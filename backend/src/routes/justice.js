const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");
const {
  validateBody,
  validateParamId,
  isPositiveInteger,
  isValidAddress,
  isValidHash,
  isValidActionType,
  isNonEmptyString,
} = require("../utils/validators");

const router = express.Router();

const ACTION_TYPES = ["Freeze", "BurnRemint", "SocialRecovery"];

/**
 * POST /api/justice/actions
 * Proposer une action judiciaire (juge uniquement)
 */
router.post("/actions", authenticate, requireRole("judge", "admin"), validateBody([
  { field: "tokenId", validator: isPositiveInteger, message: "tokenId: entier positif requis" },
  { field: "judgmentHash", validator: isValidHash, message: "judgmentHash: hash invalide" },
  { field: "actionType", validator: isValidActionType, message: "actionType: 0 (Freeze), 1 (BurnRemint) ou 2 (SocialRecovery)" },
  { field: "newOwner", validator: isValidAddress, message: "newOwner: adresse Ethereum invalide", optional: true },
  { field: "newUri", validator: isNonEmptyString, message: "newUri: chaîne invalide", optional: true },
]), async (req, res, next) => {
  try {
    const { tokenId, newOwner, judgmentHash, newUri, actionType } = req.body;

    const { justice } = await getContracts();

    const tx = await justice.proposeAction(
      tokenId,
      newOwner || "0x0000000000000000000000000000000000000000",
      judgmentHash,
      newUri || "",
      actionType
    );
    const receipt = await tx.wait();

    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ActionProposed"
    );
    const actionId = event ? event.args[0].toString() : null;

    res.status(201).json({
      message: "Action judiciaire proposée",
      actionId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/justice/actions/:actionId
 * Récupérer les détails d'une action
 */
router.get("/actions/:actionId", async (req, res, next) => {
  try {
    const { justice } = await getContracts();
    const actionId = req.params.actionId;

    const [tokenId, newOwner, judgmentHash, actionType, signatures, executed] =
      await justice.getAction(actionId);

    res.json({
      actionId,
      tokenId: tokenId.toString(),
      newOwner,
      judgmentHash,
      actionType: ACTION_TYPES[Number(actionType)] || "Unknown",
      signatures: Number(signatures),
      executed,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/justice/actions/:actionId/sign
 * Signer une action (juge uniquement)
 */
router.post("/actions/:actionId/sign", authenticate, requireRole("judge", "admin"), async (req, res, next) => {
  try {
    const { justice } = await getContracts();
    const actionId = req.params.actionId;

    const tx = await justice.signAction(actionId);
    const receipt = await tx.wait();

    res.json({
      message: "Action signée",
      actionId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/justice/actions/:actionId/execute
 * Exécuter une action (juge uniquement, après M signatures)
 */
router.post("/actions/:actionId/execute", authenticate, requireRole("judge", "admin"), async (req, res, next) => {
  try {
    const { justice } = await getContracts();
    const actionId = req.params.actionId;

    const tx = await justice.executeAction(actionId);
    const receipt = await tx.wait();

    res.json({
      message: "Action judiciaire exécutée",
      actionId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/justice/recovery
 * Initier une demande de récupération sociale (conservateur/juge)
 */
router.post("/recovery", authenticate, requireRole("judge", "conservator", "admin"), validateBody([
  { field: "tokenId", validator: isPositiveInteger, message: "tokenId: entier positif requis" },
  { field: "newWallet", validator: isValidAddress, message: "newWallet: adresse Ethereum invalide" },
]), async (req, res, next) => {
  try {
    const { tokenId, newWallet } = req.body;

    const { justice } = await getContracts();

    const tx = await justice.requestRecovery(tokenId, newWallet);
    const receipt = await tx.wait();

    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "RecoveryRequested"
    );
    const recoveryId = event ? event.args[0].toString() : null;

    res.status(201).json({
      message: "Demande de récupération créée",
      recoveryId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/justice/recovery/:recoveryId
 * Détails d'une demande de récupération
 */
router.get("/recovery/:recoveryId", async (req, res, next) => {
  try {
    const { justice } = await getContracts();
    const recoveryId = req.params.recoveryId;

    const recovery = await justice.getRecovery(recoveryId);

    res.json({
      recoveryId,
      tokenId: recovery.tokenId.toString(),
      currentOwner: recovery.currentOwner,
      newWallet: recovery.newWallet,
      verifiedBy: recovery.verifiedBy,
      executed: recovery.executed,
      createdAt: new Date(Number(recovery.createdAt) * 1000).toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/justice/stats
 * Statistiques judiciaires
 */
router.get("/stats", async (req, res, next) => {
  try {
    const { justice } = await getContracts();

    const totalActions = await justice.totalActions();
    const requiredSignatures = await justice.requiredSignatures();

    res.json({
      totalActions: Number(totalActions),
      requiredSignatures: Number(requiredSignatures),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
