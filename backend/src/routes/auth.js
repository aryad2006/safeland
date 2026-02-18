const express = require("express");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "safeland-dev-secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "30m";

// ─── Stockage en mémoire (remplacer par DB en prod) ───
const nonces = new Map(); // address → nonce
const users = new Map();  // address → { role, createdAt }

// Rôles reconnus
const VALID_ROLES = ["admin", "agent", "notary", "justice", "owner", "buyer"];

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
router.post("/nonce", (req, res) => {
  const { address } = req.body;
  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: "Adresse Ethereum invalide" });
  }

  const nonce = `SafeLand Auth ${Date.now()}-${Math.random().toString(36).slice(2)}`;
  nonces.set(address.toLowerCase(), nonce);

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
router.post("/login", (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({ error: "Adresse et signature requis" });
  }

  const lowerAddress = address.toLowerCase();
  const nonce = nonces.get(lowerAddress);

  if (!nonce) {
    return res.status(400).json({ error: "Nonce introuvable — demandez /nonce d'abord" });
  }

  try {
    const recovered = ethers.verifyMessage(nonce, signature);
    if (recovered.toLowerCase() !== lowerAddress) {
      return res.status(401).json({ error: "Signature invalide" });
    }

    // Supprimer le nonce utilisé
    nonces.delete(lowerAddress);

    // Récupérer ou créer l'utilisateur
    let user = users.get(lowerAddress);
    if (!user) {
      user = { role: "owner", createdAt: new Date().toISOString() };
      users.set(lowerAddress, user);
    }

    const token = jwt.sign(
      { address: lowerAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token, address: lowerAddress, role: user.role });
  } catch (err) {
    res.status(401).json({ error: "Échec de vérification de signature" });
  }
});

/**
 * GET /api/auth/me
 * Retourne les infos de l'utilisateur connecté
 */
router.get("/me", authenticate, (req, res) => {
  const user = users.get(req.user.address) || { role: req.user.role };
  res.json({ address: req.user.address, ...user });
});

/**
 * PUT /api/auth/role  (admin only)
 * Modifie le rôle d'un utilisateur
 */
router.put("/role", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Seul un admin peut modifier les rôles" });
  }

  const { address, role } = req.body;
  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: "Adresse invalide" });
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Rôle invalide. Valeurs: ${VALID_ROLES.join(", ")}` });
  }

  const lowerAddress = address.toLowerCase();
  let user = users.get(lowerAddress);
  if (!user) {
    user = { role, createdAt: new Date().toISOString() };
  } else {
    user.role = role;
  }
  users.set(lowerAddress, user);

  res.json({ address: lowerAddress, role: user.role });
});

module.exports = router;
