const express = require("express");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const crypto = require("crypto");
const { authenticate } = require("../middleware/auth");
const { JWT_SECRET, JWT_EXPIRES } = require("../config/security");
const db = require("../config/database");
const {
  validateBody,
  isValidAddress,
  isNonEmptyString,
} = require("../utils/validators");

const router = express.Router();

// Rôles reconnus
const VALID_ROLES = ["admin", "agent", "notary", "justice", "owner", "buyer", "conservator", "judge", "bank"];

/**
 * @swagger
 * /auth/nonce:
 *   post:
 *     tags: [Auth]
 *     summary: Générer un nonce pour signature wallet
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NonceRequest'
 *     responses:
 *       200:
 *         description: Nonce généré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NonceResponse'
 */
router.post("/nonce", validateBody([
  { field: "address", validator: isValidAddress, message: "Adresse Ethereum invalide (format 0x...)" },
]), (req, res) => {
  const { address } = req.body;

  const nonce = `SafeLand Auth ${Date.now()}-${crypto.randomBytes(16).toString("hex")}`;
  db.setNonce(address.toLowerCase(), nonce);

  res.json({ nonce });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion via signature MetaMask
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
router.post("/login", validateBody([
  { field: "address", validator: isValidAddress, message: "Adresse Ethereum invalide" },
  { field: "signature", validator: isNonEmptyString, message: "Signature requise" },
]), (req, res) => {
  const { address, signature } = req.body;

  const lowerAddress = address.toLowerCase();
  const nonce = db.getNonce(lowerAddress);

  if (!nonce) {
    return res.status(400).json({ error: "Nonce introuvable ou expiré — demandez /nonce d'abord" });
  }

  try {
    const recovered = ethers.verifyMessage(nonce, signature);
    if (recovered.toLowerCase() !== lowerAddress) {
      db.logAudit("login_failed", lowerAddress, null, "Signature invalide");
      return res.status(401).json({ error: "Signature invalide" });
    }

    // Supprimer le nonce utilisé
    db.deleteNonce(lowerAddress);

    // Récupérer ou créer l'utilisateur en SQLite
    const user = db.createOrGetUser(lowerAddress, "owner");

    const token = jwt.sign(
      { address: lowerAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token, address: lowerAddress, role: user.role });

    db.logAudit("login_success", lowerAddress, null, `role=${user.role}`);
  } catch {
    res.status(401).json({ error: "Échec de vérification de signature" });
  }
});

/**
 * GET /api/auth/me
 * Retourne les infos de l'utilisateur connecté
 */
router.get("/me", authenticate, (req, res) => {
  const user = db.getUser(req.user.address) || { role: req.user.role };
  res.json({ address: req.user.address, ...user });
});

/**
 * PUT /api/auth/role  (admin only)
 * Modifie le rôle d'un utilisateur
 */
router.put("/role", authenticate, validateBody([
  { field: "address", validator: isValidAddress, message: "Adresse Ethereum invalide" },
  { field: "role", validator: (v) => VALID_ROLES.includes(v), message: `Rôle invalide. Valeurs: ${VALID_ROLES.join(", ")}` },
]), (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Seul un admin peut modifier les rôles" });
  }

  const { address, role } = req.body;
  const lowerAddress = address.toLowerCase();

  const user = db.updateUserRole(lowerAddress, role);

  db.logAudit("role_changed", req.user.address, lowerAddress, `new_role=${role}`);

  res.json({ address: lowerAddress, role: user.role });
});

module.exports = router;
