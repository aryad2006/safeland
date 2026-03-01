/**
 * SafeLand — Configuration de sécurité centralisée
 *
 * JWT_SECRET : secret partagé entre le middleware auth et les routes.
 * En production, DOIT être défini via la variable d'environnement JWT_SECRET.
 * En dev, un secret éphémère est généré (tokens invalidés au redémarrage).
 */
const crypto = require("crypto");

const FALLBACK_SECRET = crypto.randomBytes(64).toString("hex");

const JWT_SECRET = process.env.JWT_SECRET || FALLBACK_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "30m";

if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET non défini — secret éphémère généré. " +
    "Définissez JWT_SECRET dans .env pour la production."
  );
}

module.exports = { JWT_SECRET, JWT_EXPIRES };
