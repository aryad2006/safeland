const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");
const {
  validateBody,
  validateParamId,
  isValidAddress,
  isNonEmptyString,
  isPositiveNumber,
  isValidHash,
  isValidGPS,
} = require("../utils/validators");

const router = express.Router();

/**
 * @swagger
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Créer un titre foncier NFT
 *     description: Mint un ERC-721 représentant un titre foncier. Rôles autorisés — agent, notary, admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyRequest'
 *     responses:
 *       201:
 *         description: Titre créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 tokenId: { type: string }
 *                 txHash: { type: string }
 *       400:
 *         description: Champs manquants
 */
router.post("/", authenticate, requireRole("agent", "notary", "admin"), validateBody([
  { field: "to", validator: isValidAddress, message: "to: adresse Ethereum invalide" },
  { field: "titreFoncier", validator: isNonEmptyString, message: "titreFoncier: requis (ex: 12345/R)" },
  { field: "surface", validator: isPositiveNumber, message: "surface: nombre positif requis" },
  { field: "propertyType", validator: isNonEmptyString, message: "propertyType: requis (Villa, Terrain, Appartement…)" },
  { field: "city", validator: isNonEmptyString, message: "city: requis" },
  { field: "gpsCoords", validator: isValidGPS, message: "gpsCoords: requis" },
  { field: "documentHash", validator: isValidHash, message: "documentHash: hash ou CID invalide" },
]), async (req, res, next) => {
  try {
    const { to, titreFoncier, surface, propertyType, city, gpsCoords, documentHash } = req.body;

    const { nft, registry } = await getContracts();

    const tx = await nft.createProperty(to, titreFoncier, surface, propertyType, city, gpsCoords, documentHash);
    const receipt = await tx.wait();

    // Extraire le tokenId depuis les logs
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "PropertyCreated"
    );
    const tokenId = event ? event.args[0].toString() : null;

    // Enregistrer dans le registre
    if (tokenId) {
      const regTx = await registry.registerProperty(tokenId, city, to, propertyType);
      await regTx.wait();
    }

    res.status(201).json({
      message: "Titre foncier créé",
      tokenId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /properties/{tokenId}:
 *   get:
 *     tags: [Properties]
 *     summary: Consulter un titre foncier
 *     security: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails du titre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyResponse'
 */
router.get("/:tokenId", async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const tokenId = req.params.tokenId;

    const data = await nft.getPropertyData(tokenId);
    const owner = await nft.ownerOf(tokenId);
    const locked = await nft.isLocked(tokenId);
    const history = await nft.getTransactionHistory(tokenId);

    res.json({
      tokenId,
      owner,
      locked,
      titreFoncier: data.titreFoncier,
      surface: data.surface.toString(),
      propertyType: data.propertyType,
      city: data.city,
      gpsCoords: data.gpsCoords,
      documentHash: data.documentHash,
      createdAt: new Date(Number(data.createdAt) * 1000).toISOString(),
      history: history.map((h) => ({
        action: h.action,
        from: h.from,
        to: h.to,
        timestamp: new Date(Number(h.timestamp) * 1000).toISOString(),
        documentHash: h.documentHash,
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/properties
 * Liste les propriétés par ville ou propriétaire
 */
router.get("/", async (req, res, next) => {
  try {
    const { registry } = await getContracts();
    const { city, owner } = req.query;

    let tokenIds = [];
    if (city) {
      tokenIds = await registry.getPropertiesByCity(city);
    } else if (owner) {
      tokenIds = await registry.getPropertiesByOwner(owner);
    } else {
      const stats = await registry.getGlobalStats();
      return res.json({
        totalProperties: stats.totalProperties.toString(),
        totalTransactions: stats.totalTransactions.toString(),
        fraudPrevented: stats.fraudPrevented.toString(),
        justiceOverrides: stats.justiceOverrides.toString(),
      });
    }

    res.json({
      count: tokenIds.length,
      tokenIds: tokenIds.map((id) => id.toString()),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/properties/:tokenId/transfer
 * Transfert de propriété (via contrat — généralement utilisé par l'escrow)
 */
router.post("/:tokenId/transfer", authenticate, requireRole("agent", "notary", "admin"), validateParamId("tokenId"), validateBody([
  { field: "to", validator: isValidAddress, message: "to: adresse Ethereum invalide" },
  { field: "documentHash", validator: isValidHash, message: "documentHash: hash invalide" },
]), async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const { to, documentHash } = req.body;
    const tokenId = req.params.tokenId;

    const tx = await nft.transferProperty(tokenId, to, documentHash);
    const receipt = await tx.wait();

    res.json({ message: "Transfert effectué", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/properties/:tokenId/lock
 * Verrouillage Travel Lock par le propriétaire
 */
router.post("/:tokenId/lock", authenticate, async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const tokenId = req.params.tokenId;

    const tx = await nft.setTravelLock(tokenId, true);
    const receipt = await tx.wait();

    res.json({ message: "Travel Lock activé", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/properties/:tokenId/unlock
 * Déverrouillage Travel Lock
 */
router.post("/:tokenId/unlock", authenticate, async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const tokenId = req.params.tokenId;

    const tx = await nft.setTravelLock(tokenId, false);
    const receipt = await tx.wait();

    res.json({ message: "Travel Lock désactivé", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/properties/:tokenId/encumbrance
 * Ajout d'une charge (hypothèque, saisie, etc.)
 */
router.post("/:tokenId/encumbrance", authenticate, requireRole("notary", "justice", "admin"), validateParamId("tokenId"), validateBody([
  { field: "encumbranceType", validator: isNonEmptyString, message: "encumbranceType: requis" },
  { field: "description", validator: isNonEmptyString, message: "description: requis" },
  { field: "documentHash", validator: isValidHash, message: "documentHash: hash invalide" },
]), async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const { encumbranceType, description, documentHash } = req.body;
    const tokenId = req.params.tokenId;

    const tx = await nft.addEncumbrance(tokenId, encumbranceType, description, documentHash);
    const receipt = await tx.wait();

    res.json({ message: "Charge ajoutée", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/properties/:tokenId/encumbrance/:index
 * Suppression d'une charge
 */
router.delete("/:tokenId/encumbrance/:index", authenticate, requireRole("notary", "justice", "admin"), async (req, res, next) => {
  try {
    const { nft } = await getContracts();
    const { tokenId, index } = req.params;

    const tx = await nft.removeEncumbrance(tokenId, parseInt(index));
    const receipt = await tx.wait();

    res.json({ message: "Charge levée", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
