const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "safeland-dev-secret";

/**
 * Middleware d'authentification JWT
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

/**
 * Middleware de vérification de rôle
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès interdit — rôle insuffisant" });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
