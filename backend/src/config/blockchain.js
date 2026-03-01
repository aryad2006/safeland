const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ─── Provider ─────────────────────────────────────────────
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ─── Wallet signataire (backend = opérateur) ──────────────
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ─── Charger les adresses déployées ───────────────────────
function loadAddresses() {
  const filePath = path.join(__dirname, "../../deployed-addresses.json");
  if (!fs.existsSync(filePath)) {
    console.warn("⚠️  deployed-addresses.json non trouvé. Déployez d'abord avec npm run deploy:local");
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ─── Charger un ABI depuis les artifacts Hardhat ──────────
function loadABI(contractName) {
  const artifactPath = path.join(
    __dirname,
    `../../artifacts/contracts/${contractName}.sol/${contractName}.json`
  );
  if (!fs.existsSync(artifactPath)) {
    console.warn(`⚠️  Artifact pour ${contractName} non trouvé. Compilez d'abord.`);
    return [];
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  return artifact.abi;
}

// ─── Instances des contrats ───────────────────────────────
function getContracts() {
  const addresses = loadAddresses();

  const contracts = {};

  if (addresses.SafeLandNFT) {
    contracts.nft = new ethers.Contract(
      addresses.SafeLandNFT,
      loadABI("SafeLandNFT"),
      signer
    );
  }

  if (addresses.SafeLandRegistry) {
    contracts.registry = new ethers.Contract(
      addresses.SafeLandRegistry,
      loadABI("SafeLandRegistry"),
      signer
    );
  }

  if (addresses.SafeLandEscrow) {
    contracts.escrow = new ethers.Contract(
      addresses.SafeLandEscrow,
      loadABI("SafeLandEscrow"),
      signer
    );
  }

  if (addresses.SafeLandFridda) {
    contracts.fridda = new ethers.Contract(
      addresses.SafeLandFridda,
      loadABI("SafeLandFridda"),
      signer
    );
  }

  if (addresses.SafeLandJustice) {
    contracts.justice = new ethers.Contract(
      addresses.SafeLandJustice,
      loadABI("SafeLandJustice"),
      signer
    );
  }

  if (addresses.SafeLandTimelock) {
    contracts.timelock = new ethers.Contract(
      addresses.SafeLandTimelock,
      loadABI("SafeLandTimelock"),
      signer
    );
  }

  return contracts;
}

module.exports = { provider, signer, getContracts, loadAddresses };
