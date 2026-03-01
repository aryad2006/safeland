const express = require("express");
const { ethers } = require("ethers");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");
const {
  validateBody,
  isValidAddress,
  isNonEmptyString,
  isPositiveInteger,
} = require("../utils/validators");

const router = express.Router();

const STATUS_MAP = ["None", "Pending", "Executed", "Cancelled"];

// ─── Helpers ─────────────────────────────────────────────

function formatOperation(operationId, op) {
  return {
    operationId,
    target: op.target,
    value: ethers.formatEther(op.value),
    readyTimestamp: op.readyTimestamp.toString(),
    readyAt: new Date(Number(op.readyTimestamp) * 1000).toISOString(),
    status: STATUS_MAP[Number(op.status)] || "Unknown",
    proposer: op.proposer,
    description: op.description,
  };
}

// ─── GET /api/timelock/operations/:operationId ────────────
/**
 * @swagger
 * /api/timelock/operations/{operationId}:
 *   get:
 *     summary: Détails d'une opération Timelock
 *     tags: [Timelock]
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'opération
 *       404:
 *         description: Opération introuvable
 */
router.get("/operations/:operationId", async (req, res, next) => {
  try {
    const { operationId } = req.params;
    if (!operationId || !/^0x[0-9a-fA-F]{64}$/.test(operationId)) {
      return res.status(400).json({ error: "operationId: bytes32 hex invalide" });
    }

    const { timelock } = await getContracts();
    const op = await timelock.getOperation(operationId);

    if (Number(op.status) === 0) {
      return res.status(404).json({ error: "Opération introuvable" });
    }

    res.json(formatOperation(operationId, op));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/timelock/pending ────────────────────────────
/**
 * @swagger
 * /api/timelock/pending:
 *   get:
 *     summary: Nombre d'opérations en attente
 *     tags: [Timelock]
 *     responses:
 *       200:
 *         description: Statistiques timelock
 */
router.get("/pending", async (req, res, next) => {
  try {
    const { timelock } = await getContracts();
    const total = await timelock.operationCount();
    const minDelay = await timelock.MIN_DELAY();
    const maxDelay = await timelock.MAX_DELAY();
    const gracePeriod = await timelock.GRACE_PERIOD();

    res.json({
      totalOperations: total.toString(),
      minDelaySeconds: minDelay.toString(),
      maxDelaySeconds: maxDelay.toString(),
      gracePeriodSeconds: gracePeriod.toString(),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/timelock/schedule ─────────────────────────
/**
 * @swagger
 * /api/timelock/schedule:
 *   post:
 *     summary: Planifie une opération admin
 *     tags: [Timelock]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [target, value, data, salt, delay, description]
 *             properties:
 *               target:
 *                 type: string
 *               value:
 *                 type: string
 *               data:
 *                 type: string
 *               salt:
 *                 type: string
 *               delay:
 *                 type: integer
 *               description:
 *                 type: string
 */
router.post("/schedule",
  authenticate,
  requireRole("admin"),
  validateBody([
    { field: "target", validator: isValidAddress, message: "target: adresse Ethereum invalide" },
    { field: "description", validator: isNonEmptyString, message: "description: chaîne non vide requise" },
    {
      field: "delay",
      validator: (v) => isPositiveInteger(v) && Number(v) >= 86400,
      message: "delay: minimum 86400 secondes (1 jour)",
    },
  ]),
  async (req, res, next) => {
    try {
      const { target, value = "0", data = "0x", salt, delay, description } = req.body;

      if (!salt || !/^0x[0-9a-fA-F]{64}$/.test(salt)) {
        return res.status(400).json({ error: "salt: bytes32 hex invalide" });
      }

      const { timelock } = await getContracts();
      const tx = await timelock.schedule(
        target,
        ethers.parseEther(value.toString()),
        data,
        salt,
        delay,
        description
      );
      const receipt = await tx.wait();

      // Extraire operationId depuis les logs
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "OperationScheduled"
      );
      const operationId = event ? event.args[0] : null;
      const readyTimestamp = event ? event.args[4].toString() : null;

      res.status(201).json({
        message: "Opération planifiée",
        operationId,
        readyAt: readyTimestamp
          ? new Date(Number(readyTimestamp) * 1000).toISOString()
          : null,
        txHash: receipt.hash,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/timelock/:operationId/execute ─────────────
/**
 * @swagger
 * /api/timelock/{operationId}/execute:
 *   post:
 *     summary: Exécute une opération planifiée
 *     tags: [Timelock]
 *     security:
 *       - BearerAuth: []
 */
router.post("/:operationId/execute", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const { operationId } = req.params;
    if (!operationId || !/^0x[0-9a-fA-F]{64}$/.test(operationId)) {
      return res.status(400).json({ error: "operationId: bytes32 hex invalide" });
    }

    const { target, value = "0", data = "0x", salt } = req.body;

    if (!salt || !/^0x[0-9a-fA-F]{64}$/.test(salt)) {
      return res.status(400).json({ error: "salt: bytes32 hex invalide" });
    }
    if (!isValidAddress(target)) {
      return res.status(400).json({ error: "target: adresse Ethereum invalide" });
    }

    const { timelock } = await getContracts();
    const tx = await timelock.execute(
      target,
      ethers.parseEther(value.toString()),
      data,
      salt,
      { value: value === "0" ? 0n : ethers.parseEther(value.toString()) }
    );
    const receipt = await tx.wait();

    res.json({ message: "Opération exécutée", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/timelock/:operationId/cancel ──────────────
/**
 * @swagger
 * /api/timelock/{operationId}/cancel:
 *   post:
 *     summary: Annule une opération planifiée
 *     tags: [Timelock]
 *     security:
 *       - BearerAuth: []
 */
router.post("/:operationId/cancel", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const { operationId } = req.params;
    if (!operationId || !/^0x[0-9a-fA-F]{64}$/.test(operationId)) {
      return res.status(400).json({ error: "operationId: bytes32 hex invalide" });
    }

    const { timelock } = await getContracts();
    const tx = await timelock.cancel(operationId);
    const receipt = await tx.wait();

    res.json({ message: "Opération annulée", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
