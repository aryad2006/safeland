require("dotenv").config({ path: "../.env" });
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const NotificationService = require("./services/notifications");

const propertyRoutes = require("./routes/properties");
const escrowRoutes = require("./routes/escrow");
const friddaRoutes = require("./routes/fridda");
const authRoutes = require("./routes/auth");
const ipfsRoutes = require("./routes/ipfs");
const justiceRoutes = require("./routes/justice");
const timelockRoutes = require("./routes/timelock");
const bankRoutes = require("./routes/bank");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Trop de requêtes, réessayez plus tard" },
});
app.use("/api/", limiter);

// ─── Routes ───────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "SafeLand API Documentation",
}));
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/fridda", friddaRoutes);
app.use("/api/justice", justiceRoutes);
app.use("/api/timelock", timelockRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SafeLand Morocco API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Erreur interne du serveur",
  });
});

// ─── Start ────────────────────────────────────────────────
const server = http.createServer(app);

// WebSocket Notifications
const notifications = new NotificationService(server);

// Route pour les stats WS
app.get("/api/notifications/stats", (req, res) => {
  res.json(notifications.getStats());
});

// Démarrer l'écoute blockchain si les adresses sont configurées
const contractAddresses = {
  nft: process.env.NFT_ADDRESS,
  escrow: process.env.ESCROW_ADDRESS,
  fridda: process.env.FRIDDA_ADDRESS,
  justice: process.env.JUSTICE_ADDRESS,
  registry: process.env.REGISTRY_ADDRESS,
};

if (Object.values(contractAddresses).some(Boolean)) {
  notifications.startListening(contractAddresses);
}

// Exposer pour les tests
app.locals.notifications = notifications;

server.listen(PORT, () => {
  console.log(`🏗️  SafeLand API démarrée sur http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔔 WebSocket: ws://localhost:${PORT}/ws`);
  console.log(`📊 WS Stats: http://localhost:${PORT}/api/notifications/stats`);
});

module.exports = app;
