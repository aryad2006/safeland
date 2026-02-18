const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");

const router = express.Router();

/**
 * POST /api/fridda
 * Ouvrir un dossier de succession
 * Rôles : notary, justice, admin
 */
router.post("/", authenticate, requireRole("notary", "justice", "admin"), async (req, res, next) => {
  try {
    const { nftTokenId, heirs, shares, adoulCid, notaryCid } = req.body;

    if (!nftTokenId || !heirs || !shares) {
      return res.status(400).json({ error: "nftTokenId, heirs et shares requis" });
    }

    if (heirs.length !== shares.length) {
      return res.status(400).json({ error: "Le nombre d'héritiers doit correspondre au nombre de parts" });
    }

    const totalShares = shares.reduce((a, b) => a + b, 0);
    if (totalShares !== 24) {
      return res.status(400).json({ error: "Le total des parts doit être 24 (système Fridda)" });
    }

    const { fridda } = await getContracts();

    const tx = await fridda.openSuccession(
      nftTokenId,
      heirs,
      shares,
      adoulCid || "",
      notaryCid || ""
    );
    const receipt = await tx.wait();

    // Extraire dossierId
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "SuccessionOpened"
    );
    const dossierId = event ? event.args[0].toString() : null;

    res.status(201).json({
      message: "Dossier de succession ouvert",
      dossierId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/fridda/:dossierId
 * Récupère les détails d'un dossier de succession
 */
router.get("/:dossierId", async (req, res, next) => {
  try {
    const { fridda } = await getContracts();
    const dossierId = req.params.dossierId;

    const dossier = await fridda.getDossier(dossierId);

    res.json({
      dossierId,
      nftTokenId: dossier.nftTokenId.toString(),
      totalShares: dossier.totalShares.toString(),
      heirs: dossier.heirs,
      shares: dossier.shares.map((s) => s.toString()),
      distributed: dossier.distributed,
      finalized: dossier.finalized,
      adoulCid: dossier.adoulCid,
      notaryCid: dossier.notaryCid,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fridda/:dossierId/distribute
 * Distribuer les parts ERC-1155 aux héritiers
 */
router.post("/:dossierId/distribute", authenticate, requireRole("notary", "admin"), async (req, res, next) => {
  try {
    const { fridda } = await getContracts();
    const dossierId = req.params.dossierId;

    const tx = await fridda.distributeShares(dossierId);
    const receipt = await tx.wait();

    res.json({ message: "Parts distribuées (ERC-1155 mintées)", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fridda/:dossierId/finalize
 * Finaliser la succession
 */
router.post("/:dossierId/finalize", authenticate, requireRole("notary", "justice", "admin"), async (req, res, next) => {
  try {
    const { fridda } = await getContracts();
    const dossierId = req.params.dossierId;

    const tx = await fridda.finalizeSuccession(dossierId);
    const receipt = await tx.wait();

    res.json({ message: "Succession finalisée", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fridda/:dossierId/propose
 * Créer une proposition de gouvernance (vente, location, rénovation)
 */
router.post("/:dossierId/propose", authenticate, async (req, res, next) => {
  try {
    const { voteType, description, quorumBps, durationDays } = req.body;

    if (voteType === undefined || !description) {
      return res.status(400).json({ error: "voteType et description requis" });
    }

    const { fridda } = await getContracts();
    const dossierId = req.params.dossierId;

    const quorum = quorumBps || 5000; // 50% par défaut
    const duration = (durationDays || 7) * 24 * 60 * 60; // 7 jours par défaut

    const tx = await fridda.createProposal(dossierId, voteType, description, quorum, duration);
    const receipt = await tx.wait();

    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ProposalCreated"
    );
    const proposalId = event ? event.args[0].toString() : null;

    res.status(201).json({
      message: "Proposition créée",
      proposalId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fridda/:dossierId/vote/:proposalId
 * Voter sur une proposition
 */
router.post("/:dossierId/vote/:proposalId", authenticate, async (req, res, next) => {
  try {
    const { support } = req.body; // true = pour, false = contre

    if (support === undefined) {
      return res.status(400).json({ error: "Le champ 'support' (true/false) est requis" });
    }

    const { fridda } = await getContracts();
    const { proposalId } = req.params;

    const tx = await fridda.castVote(proposalId, support);
    const receipt = await tx.wait();

    res.json({
      message: support ? "Vote POUR enregistré" : "Vote CONTRE enregistré",
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/fridda/:dossierId/proposal/:proposalId
 * Récupère les détails d'une proposition
 */
router.get("/:dossierId/proposal/:proposalId", async (req, res, next) => {
  try {
    const { fridda } = await getContracts();
    const { proposalId } = req.params;

    const proposal = await fridda.getProposal(proposalId);

    const VOTE_TYPES = ["Sell", "Rent", "Renovate"];

    res.json({
      proposalId,
      dossierId: proposal.dossierId.toString(),
      voteType: VOTE_TYPES[Number(proposal.voteType)] || "Unknown",
      description: proposal.description,
      forVotes: proposal.forVotes.toString(),
      againstVotes: proposal.againstVotes.toString(),
      quorumBps: proposal.quorumBps.toString(),
      deadline: new Date(Number(proposal.deadline) * 1000).toISOString(),
      executed: proposal.executed,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
