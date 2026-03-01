const express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/auth");
const ipfs = require("../services/ipfs");

const router = express.Router();

// Multer : stockage en mémoire (max 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("Format non autorisé. Acceptés : PDF, JPEG, PNG, WebP");
      err.status = 400;
      cb(err);
    }
  },
});

/**
 * POST /api/ipfs/upload
 * Upload un document vers IPFS via Pinata
 */
router.post("/upload", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Fichier requis" });
    }

    const metadata = {
      uploadedBy: req.user.address,
      tokenId: req.body.tokenId || "",
      documentType: req.body.documentType || "general",
    };

    const result = await ipfs.uploadFile(req.file.buffer, req.file.originalname, metadata);

    res.status(201).json({
      message: "Document uploadé sur IPFS",
      cid: result.cid,
      url: result.url,
      size: result.size,
      fileName: req.file.originalname,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ipfs/upload-json
 * Upload des métadonnées JSON vers IPFS
 */
router.post("/upload-json", authenticate, async (req, res, next) => {
  try {
    const { data, name } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Champ 'data' (objet JSON) requis" });
    }

    const result = await ipfs.uploadJSON(data, name || "metadata");

    res.status(201).json({
      message: "Métadonnées uploadées sur IPFS",
      cid: result.cid,
      url: result.url,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ipfs/:cid
 * Récupère un fichier depuis IPFS
 */
router.get("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const buffer = await ipfs.getFile(cid);

    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${cid}"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ipfs/:cid/status
 * Vérifie le statut de pin d'un CID
 */
router.get("/:cid/status", async (req, res, next) => {
  try {
    const status = await ipfs.getPinStatus(req.params.cid);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
