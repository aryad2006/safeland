const express = require("express");
const { ethers } = require("ethers");
const { authenticate, requireRole } = require("../middleware/auth");
const { getContracts } = require("../config/blockchain");
const {
  validateBody,
  validateParamId,
  isValidAddress,
  isPositiveInteger,
  isPositiveNumber,
} = require("../utils/validators");

const router = express.Router();

/**
 * POST /api/escrow
 * Créer un deal escrow (notaire uniquement)
 */
router.post("/", authenticate, requireRole("notary", "admin"), validateBody([
  { field: "tokenId", validator: isPositiveInteger, message: "tokenId: entier positif requis" },
  { field: "seller", validator: isValidAddress, message: "seller: adresse Ethereum invalide" },
  { field: "buyer", validator: isValidAddress, message: "buyer: adresse Ethereum invalide" },
  { field: "price", validator: isPositiveNumber, message: "price: nombre positif requis (en ETH)" },
]), async (req, res, next) => {
  try {
    const { tokenId, seller, buyer, price } = req.body;

    const { escrow } = await getContracts();

    const priceWei = ethers.parseEther(price.toString());
    const tx = await escrow.createDeal(tokenId, seller, buyer, priceWei);
    const receipt = await tx.wait();

    // Extraire dealId depuis les logs
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "DealCreated"
    );
    const dealId = event ? event.args[0].toString() : null;

    res.status(201).json({
      message: "Deal escrow créé",
      dealId,
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/escrow/:dealId
 * Récupère les détails d'un deal
 */
router.get("/:dealId", async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const deal = await escrow.getDeal(dealId);

    const STATUS_LABELS = ["Created", "SellerSigned", "BuyerFunded", "NotarySigned", "Completed", "Cancelled"];

    res.json({
      dealId,
      tokenId: deal.tokenId.toString(),
      seller: deal.seller,
      buyer: deal.buyer,
      price: ethers.formatEther(deal.price),
      status: STATUS_LABELS[Number(deal.status)] || "Unknown",
      notary: deal.notary,
      createdAt: new Date(Number(deal.createdAt) * 1000).toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/escrow/:dealId/seller-sign
 * Le vendeur signe le deal
 */
router.post("/:dealId/seller-sign", authenticate, async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const tx = await escrow.sellerSign(dealId);
    const receipt = await tx.wait();

    res.json({ message: "Vendeur a signé", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/escrow/:dealId/buyer-deposit
 * L'acheteur dépose les fonds
 */
router.post("/:dealId/buyer-deposit", authenticate, async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const deal = await escrow.getDeal(dealId);

    const tx = await escrow.buyerDeposit(dealId, { value: deal.price });
    const receipt = await tx.wait();

    res.json({
      message: "Fonds déposés",
      amount: ethers.formatEther(deal.price),
      txHash: receipt.hash,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/escrow/:dealId/notary-complete
 * Le notaire finalise la transaction (split fiscal + transfert NFT)
 */
router.post("/:dealId/notary-complete", authenticate, requireRole("notary", "admin"), async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const tx = await escrow.notaryComplete(dealId);
    const receipt = await tx.wait();

    res.json({ message: "Transaction finalisée — NFT transféré, fonds distribués", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/escrow/:dealId/cancel
 * Annulation du deal (notaire) — remboursement automatique si fonds déposés
 */
router.post("/:dealId/cancel", authenticate, requireRole("notary", "admin"), async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const tx = await escrow.cancelDeal(dealId);
    const receipt = await tx.wait();

    res.json({ message: "Deal annulé — remboursement effectué si applicable", txHash: receipt.hash });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/escrow/:dealId/fees
 * Calcule la répartition fiscale pour un deal donné
 */
router.get("/:dealId/fees", async (req, res, next) => {
  try {
    const { escrow } = await getContracts();
    const dealId = req.params.dealId;

    const deal = await escrow.getDeal(dealId);
    const price = deal.price;

    const dgiFee = (price * 400n) / 10000n;
    const ancfccFee = (price * 100n) / 10000n;
    const sellerAmount = price - dgiFee - ancfccFee;

    res.json({
      dealId,
      totalPrice: ethers.formatEther(price),
      dgiFee: ethers.formatEther(dgiFee),
      dgiPercent: "4%",
      ancfccFee: ethers.formatEther(ancfccFee),
      ancfccPercent: "1%",
      sellerAmount: ethers.formatEther(sellerAmount),
      sellerPercent: "95%",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
