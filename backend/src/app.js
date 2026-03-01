/**
 * SafeLand — App factory pour les tests
 *
 * Crée une instance Express sans démarrer le serveur HTTP,
 * et sans dépendance blockchain (routes auth + health uniquement).
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Seules les routes testables hors blockchain
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SafeLand Morocco API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: err.message || "Erreur interne du serveur",
    });
  });

  return app;
}

module.exports = createApp;
