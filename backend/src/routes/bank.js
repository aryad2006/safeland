/**
 * SafeLand — Route API B2B Banques
 *
 * Expose les fonctionnalités liées aux établissements de crédit :
 *   POST /api/bank/hypotheque         — Inscrire une hypothèque
 *   POST /api/bank/mainlevee          — Lever une hypothèque
 *   GET  /api/bank/score/:tokenId     — Score de liquidité foncière
 *   GET  /api/bank/titre/:tokenId/status — Statut crédit d'un titre
 *
 * Rôle requis : "bank" ou "admin"
 */
const express = require("express");
const { ethers } = require("ethers");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");
const {
  validateBody,
  validateParamId,
  isValidAddress,
  isPositiveInteger,
  isNonEmptyString,
} = require("../utils/validators");

const router = express.Router();

// ─────────────────────────────────────────────────────────
// POST /api/bank/hypotheque
// Inscrire une hypothèque sur un titre foncier
// ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/bank/hypotheque:
 *   post:
 *     summary: Inscrire une hypothèque sur un titre
 *     tags: [Bank B2B]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tokenId, creditor, amount]
 *             properties:
 *               tokenId:
 *                 type: integer
 *               creditor:
 *                 type: string
 *                 description: Adresse Ethereum de la banque créditrice
 *               amount:
 *                 type: number
 *                 description: Montant du crédit en ETH
 *               endDate:
 *                 type: integer
 *                 description: Timestamp UNIX de la date d'échéance (0 = illimité)
 */
router.post("/hypotheque",
  authenticate,
  requireRole("bank", "admin"),
  validateBody([
    { field: "tokenId", validator: isPositiveInteger, message: "tokenId: entier positif requis" },
    { field: "creditor", validator: isValidAddress, message: "creditor: adresse Ethereum invalide" },
    {
      field: "amount",
      validator: (v) => typeof v === "number" && v > 0,
      message: "amount: nombre positif requis (en ETH)",
    },
  ]),
  async (req, res, next) => {
    try {
      const { tokenId, creditor, amount, endDate = 0 } = req.body;

      const { nft } = await getContracts();

      const amountWei = ethers.parseEther(amount.toString());
      const tx = await nft.addEncumbrance(
        tokenId,
        "hypotheque",
        creditor,
        amountWei,
        endDate
      );
      const receipt = await tx.wait();

      res.status(201).json({
        message: "Hypothèque inscrite",
        tokenId: tokenId.toString(),
        creditor,
        amount: amount.toString(),
        endDate: endDate || null,
        txHash: receipt.hash,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /api/bank/mainlevee
// Lever une hypothèque (supprimer la charge)
// ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/bank/mainlevee:
 *   post:
 *     summary: Lever une hypothèque (mainlevée)
 *     tags: [Bank B2B]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tokenId, encumbranceIndex]
 *             properties:
 *               tokenId:
 *                 type: integer
 *               encumbranceIndex:
 *                 type: integer
 *                 description: Index de la charge dans le tableau du titre
 */
router.post("/mainlevee",
  authenticate,
  requireRole("bank", "admin"),
  validateBody([
    { field: "tokenId", validator: isPositiveInteger, message: "tokenId: entier positif requis" },
    {
      field: "encumbranceIndex",
      validator: (v) => Number.isInteger(v) && v >= 0,
      message: "encumbranceIndex: entier >= 0 requis",
    },
  ]),
  async (req, res, next) => {
    try {
      const { tokenId, encumbranceIndex } = req.body;

      const { nft } = await getContracts();
      const tx = await nft.removeEncumbrance(tokenId, encumbranceIndex);
      const receipt = await tx.wait();

      res.json({
        message: "Mainlevée enregistrée",
        tokenId: tokenId.toString(),
        encumbranceIndex,
        txHash: receipt.hash,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─────────────────────────────────────────────────────────
// GET /api/bank/score/:tokenId
// Score de liquidité foncière (0-100)
// ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/bank/score/{tokenId}:
 *   get:
 *     summary: Score de liquidité foncière
 *     tags: [Bank B2B]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/score/:tokenId",
  authenticate,
  requireRole("bank", "admin"),
  validateParamId("tokenId"),
  async (req, res, next) => {
    try {
      const tokenId = parseInt(req.params.tokenId, 10);
      const { nft } = await getContracts();

      const [property, encumbrances, history, canTransfer, isFrozen, isLocked] =
        await Promise.all([
          nft.getProperty(tokenId),
          nft.getEncumbrances(tokenId),
          nft.getHistory(tokenId),
          nft.canTransfer(tokenId),
          nft.isFrozenByJustice(tokenId),
          nft.isLocked(tokenId),
        ]);

      // ─── Algorithme de scoring ─────────────────────────
      // Base : 100 pts
      // -30 si frozen par justice
      // -20 si transfer locké
      // -10 par hypothèque active
      // -5  par autre charge active
      // +5  par transaction dans l'historique (max +20)
      // Min: 0, Max: 100

      let score = 100;
      const details = [];

      if (isFrozen) {
        score -= 30;
        details.push({ factor: "frozen_justice", impact: -30, description: "Titre saisi par la justice" });
      }
      if (isLocked) {
        score -= 20;
        details.push({ factor: "transfer_locked", impact: -20, description: "Transfert bloqué" });
      }

      let activeHypotheques = 0;
      let otherActiveCharges = 0;
      for (const enc of encumbrances) {
        if (!enc.isActive) continue;
        const encTypeLower = enc.encType.toLowerCase();
        if (encTypeLower === "hypotheque" || encTypeLower === "saisie") {
          activeHypotheques++;
        } else {
          otherActiveCharges++;
        }
      }

      if (activeHypotheques > 0) {
        const impact = -10 * activeHypotheques;
        score += impact;
        details.push({
          factor: "active_hypotheques",
          count: activeHypotheques,
          impact,
          description: `${activeHypotheques} hypothèque(s) active(s)`,
        });
      }
      if (otherActiveCharges > 0) {
        const impact = -5 * otherActiveCharges;
        score += impact;
        details.push({
          factor: "other_charges",
          count: otherActiveCharges,
          impact,
          description: `${otherActiveCharges} autre(s) charge(s) active(s)`,
        });
      }

      const historyBonus = Math.min(history.length * 5, 20);
      if (historyBonus > 0) {
        score += historyBonus;
        details.push({
          factor: "history",
          count: history.length,
          impact: historyBonus,
          description: `${history.length} transaction(s) historique`,
        });
      }

      score = Math.max(0, Math.min(100, score));

      const rating =
        score >= 80 ? "A" :
        score >= 60 ? "B" :
        score >= 40 ? "C" :
        score >= 20 ? "D" : "E";

      res.json({
        tokenId: tokenId.toString(),
        titreFoncier: property.titreFoncier,
        score,
        rating,
        canTransfer,
        details,
        summary: {
          activeEncumbrances: activeHypotheques + otherActiveCharges,
          historyCount: history.length,
          isFrozen,
          isLocked,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─────────────────────────────────────────────────────────
// GET /api/bank/titre/:tokenId/status
// Statut d'un titre pour une demande de crédit
// ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/bank/titre/{tokenId}/status:
 *   get:
 *     summary: Statut d'un titre foncier pour demande de crédit
 *     tags: [Bank B2B]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/titre/:tokenId/status",
  authenticate,
  requireRole("bank", "admin"),
  validateParamId("tokenId"),
  async (req, res, next) => {
    try {
      const tokenId = parseInt(req.params.tokenId, 10);
      const { nft } = await getContracts();

      const [property, encumbrances, canTransferResult, isFrozen, isLocked] =
        await Promise.all([
          nft.getProperty(tokenId),
          nft.getEncumbrances(tokenId),
          nft.canTransfer(tokenId),
          nft.isFrozenByJustice(tokenId),
          nft.isLocked(tokenId),
        ]);

      const activeEncumbrances = encumbrances
        .map((e, i) => ({ index: i, ...e }))
        .filter((e) => e.isActive)
        .map((e) => ({
          index: e.index,
          type: e.encType,
          creditor: e.creditor,
          amount: ethers.formatEther(e.amount),
          startDate: new Date(Number(e.startDate) * 1000).toISOString(),
          endDate: e.endDate > 0
            ? new Date(Number(e.endDate) * 1000).toISOString()
            : null,
        }));

      // Statut crédit : eligible / restricted / blocked
      let creditStatus = "eligible";
      const restrictions = [];

      if (isFrozen) {
        creditStatus = "blocked";
        restrictions.push("Titre saisi judiciellement — aucune opération possible");
      } else if (isLocked) {
        creditStatus = "restricted";
        restrictions.push("Transfert bloqué — hypothèque possible mais pas de vente");
      }
      if (activeEncumbrances.length >= 3) {
        if (creditStatus === "eligible") creditStatus = "restricted";
        restrictions.push(`${activeEncumbrances.length} charges actives — limite de crédit réduite`);
      }

      res.json({
        tokenId: tokenId.toString(),
        titreFoncier: property.titreFoncier,
        owner: property.owner,
        creditStatus,
        restrictions,
        canTransfer: canTransferResult,
        activeEncumbrances,
        totalActiveCharges: activeEncumbrances.length,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
