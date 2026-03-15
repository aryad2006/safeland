/**
 * SafeLand — Utilitaires de validation des entrées
 *
 * Valide les formats attendus pour les adresses Ethereum,
 * les identifiants numériques, les hashes, les CID IPFS, etc.
 */
const { ethers } = require("ethers");

// ─── Adresse Ethereum ─────────────────────────────────────
function isValidAddress(value) {
  return typeof value === "string" && ethers.isAddress(value);
}

// ─── Entier positif (tokenId, dealId, dossierId, etc.) ────
function isPositiveInteger(value) {
  if (value === undefined || value === null) return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0;
}

// ─── Nombre positif (prix en ETH, surface, etc.) ──────────
function isPositiveNumber(value) {
  if (value === undefined || value === null) return false;
  const n = Number(value);
  return !isNaN(n) && n > 0 && isFinite(n);
}

// ─── String non vide ──────────────────────────────────────
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// ─── Hash (bytes32 ou IPFS CID) ───────────────────────────
function isValidHash(value) {
  if (typeof value !== "string") return false;
  // bytes32 hex : 0x + 64 hex chars
  if (/^0x[0-9a-fA-F]{64}$/.test(value)) return true;
  // IPFS CIDv0 (Qm...)
  if (/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(value)) return true;
  // IPFS CIDv1 (bafy...)
  if (/^b[a-z2-7]{58,}$/.test(value)) return true;
  // Simple non-empty hash/document hash (hex without 0x, at least 8 chars)
  if (/^[0-9a-fA-F]{8,}$/.test(value)) return true;
  // Allow any non-empty string as a generic document hash
  return value.trim().length >= 4;
}

// ─── GPS Coords (format libre mais non vide) ──────────────
function isValidGPS(value) {
  return isNonEmptyString(value);
}

// ─── Action type Justice (0=Freeze, 1=BurnRemint, 2=SocialRecovery)
function isValidActionType(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 2;
}

// ─── Vote type Fridda (0=Sell, 1=Rent, 2=Renovate) ───────
function isValidVoteType(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 2;
}

// ─── Tableau d'adresses ───────────────────────────────────
function isAddressArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isValidAddress);
}

// ─── Tableau d'entiers strictement positifs (> 0) ─────────
function isPositiveIntegerArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n > 0;
    })
  );
}

// ─── Booléen ──────────────────────────────────────────────
function isBoolean(value) {
  return typeof value === "boolean";
}

// ─── Middleware factory de validation ─────────────────────
/**
 * Crée un middleware Express qui valide le body selon un schéma.
 * Chaque règle : { field, validator, message, optional? }
 */
function validateBody(rules) {
  return (req, res, next) => {
    const errors = [];
    for (const rule of rules) {
      const value = req.body[rule.field];
      if (rule.optional && (value === undefined || value === null || value === "")) {
        continue;
      }
      if (!rule.optional && (value === undefined || value === null || value === "")) {
        errors.push(`${rule.field}: champ requis`);
        continue;
      }
      if (!rule.validator(value)) {
        errors.push(rule.message || `${rule.field}: format invalide`);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation échouée", details: errors });
    }
    next();
  };
}

/**
 * Valide un paramètre d'URL comme entier positif.
 */
function validateParamId(paramName) {
  return (req, res, next) => {
    if (!isPositiveInteger(req.params[paramName])) {
      return res.status(400).json({ error: `${paramName} doit être un entier positif` });
    }
    next();
  };
}

module.exports = {
  isValidAddress,
  isPositiveInteger,
  isPositiveNumber,
  isNonEmptyString,
  isValidHash,
  isValidGPS,
  isValidActionType,
  isValidVoteType,
  isAddressArray,
  isPositiveIntegerArray,
  isBoolean,
  validateBody,
  validateParamId,
};
