const { ethers, upgrades, run } = require("hardhat");

/**
 * SafeLand Morocco — Déploiement Sepolia + Vérification Etherscan
 *
 * Prérequis :
 *   1. Remplir .env :
 *      PRIVATE_KEY=0x...          (compte avec ≥0.1 ETH Sepolia)
 *      SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/VOTRE_CLE
 *      ETHERSCAN_API_KEY=...
 *
 *   2. Obtenir des ETH Sepolia :
 *      - https://sepoliafaucet.com
 *      - https://www.alchemy.com/faucets/ethereum-sepolia
 *
 *   3. Lancer :
 *      npx hardhat run scripts/deploy-sepolia.js --network sepolia
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("🏗️  SafeLand Morocco — Déploiement SEPOLIA");
  console.log("📍 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  console.log("🌐 Network:", (await ethers.provider.getNetwork()).name);
  console.log("─".repeat(60));

  if (balance < ethers.parseEther("0.01")) {
    console.error("❌ Balance insuffisante. Min 0.01 ETH Sepolia requis.");
    console.error("   Faucet : https://sepoliafaucet.com");
    process.exit(1);
  }

  // ─── 1. SafeLandNFT ─────────────────────────────────────
  console.log("\n1/6 — Déploiement SafeLandNFT (ERC-721)...");
  const SafeLandNFT = await ethers.getContractFactory("SafeLandNFT");
  const nft = await upgrades.deployProxy(SafeLandNFT, [deployer.address], {
    initializer: "initialize",
    txOverrides: { gasLimit: 6_000_000 },
  });
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("   ✅ SafeLandNFT:", nftAddress);

  // ─── 2. SafeLandRegistry ────────────────────────────────
  console.log("\n2/6 — Déploiement SafeLandRegistry...");
  const SafeLandRegistry = await ethers.getContractFactory("SafeLandRegistry");
  const registry = await upgrades.deployProxy(SafeLandRegistry, [deployer.address], {
    initializer: "initialize",
  });
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   ✅ SafeLandRegistry:", registryAddress);

  // ─── 3. SafeLandEscrow ──────────────────────────────────
  // En testnet, le deployer reçoit DGI/ANCFCC
  console.log("\n3/6 — Déploiement SafeLandEscrow...");
  const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
  const escrow = await upgrades.deployProxy(
    SafeLandEscrow,
    [deployer.address, nftAddress, deployer.address, deployer.address],
    { initializer: "initialize" }
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("   ✅ SafeLandEscrow:", escrowAddress);

  // ─── 4. SafeLandFridda ──────────────────────────────────
  console.log("\n4/6 — Déploiement SafeLandFridda (ERC-1155)...");
  const SafeLandFridda = await ethers.getContractFactory("SafeLandFridda");
  const fridda = await upgrades.deployProxy(
    SafeLandFridda,
    [deployer.address, "https://safeland.ma/api/fridda/{id}"],
    { initializer: "initialize" }
  );
  await fridda.waitForDeployment();
  const friddaAddress = await fridda.getAddress();
  console.log("   ✅ SafeLandFridda:", friddaAddress);

  // ─── 5. SafeLandJustice ─────────────────────────────────
  console.log("\n5/6 — Déploiement SafeLandJustice...");
  const SafeLandJustice = await ethers.getContractFactory("SafeLandJustice");
  const justice = await upgrades.deployProxy(
    SafeLandJustice,
    [deployer.address, nftAddress, 2],
    { initializer: "initialize" }
  );
  await justice.waitForDeployment();
  const justiceAddress = await justice.getAddress();
  console.log("   ✅ SafeLandJustice:", justiceAddress);

  // ─── 6. SafeLandTimelock ────────────────────────────────
  console.log("\n6/6 — Déploiement SafeLandTimelock...");
  const SafeLandTimelock = await ethers.getContractFactory("SafeLandTimelock");
  const timelock = await upgrades.deployProxy(
    SafeLandTimelock,
    [deployer.address, [deployer.address], [deployer.address]],
    { initializer: "initialize" }
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("   ✅ SafeLandTimelock:", timelockAddress);

  // ─── Configuration des rôles ────────────────────────────
  console.log("\n⚙️  Configuration des rôles...");
  const AGENT_ROLE = ethers.keccak256(ethers.toUtf8Bytes("AGENT_ROLE"));
  const JUSTICE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("JUSTICE_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));
  const UPGRADER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("UPGRADER_ROLE"));
  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));

  await (await nft.grantRole(AGENT_ROLE, escrowAddress)).wait();
  console.log("   ✅ AGENT_ROLE → Escrow");

  await (await nft.grantRole(JUSTICE_ROLE, justiceAddress)).wait();
  console.log("   ✅ JUSTICE_ROLE → Justice");

  await (await registry.grantRole(OPERATOR_ROLE, deployer.address)).wait();
  console.log("   ✅ OPERATOR_ROLE → Deployer");

  // Timelock prend le contrôle des upgrades
  await (await nft.grantRole(UPGRADER_ROLE, timelockAddress)).wait();
  console.log("   ✅ UPGRADER_ROLE → Timelock (NFT)");

  await (await registry.grantRole(ADMIN_ROLE, timelockAddress)).wait();
  await (await escrow.grantRole(ADMIN_ROLE, timelockAddress)).wait();
  await (await fridda.grantRole(ADMIN_ROLE, timelockAddress)).wait();
  await (await justice.grantRole(ADMIN_ROLE, timelockAddress)).wait();
  console.log("   ✅ ADMIN_ROLE → Timelock (Registry, Escrow, Fridda, Justice)");

  // ─── Résumé ─────────────────────────────────────────────
  const addresses = {
    network: "sepolia",
    chainId: 11155111,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      SafeLandNFT: nftAddress,
      SafeLandRegistry: registryAddress,
      SafeLandEscrow: escrowAddress,
      SafeLandFridda: friddaAddress,
      SafeLandJustice: justiceAddress,
      SafeLandTimelock: timelockAddress,
    },
  };

  console.log("\n" + "═".repeat(60));
  console.log("\n🎉 DÉPLOIEMENT SEPOLIA TERMINÉ (6/6) — SafeLand Morocco");
  console.log("═".repeat(60));
  Object.entries(addresses.contracts).forEach(([name, addr]) => {
    console.log(`   ${name}: ${addr}`);
    console.log(`   → https://sepolia.etherscan.io/address/${addr}`);
  });

  // Sauvegarder
  const fs = require("fs");
  fs.writeFileSync("./deployed-addresses-sepolia.json", JSON.stringify(addresses, null, 2));
  console.log("\n💾 Adresses sauvegardées dans deployed-addresses-sepolia.json");

  // ─── Vérification Etherscan ─────────────────────────────
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Vérification Etherscan (peut prendre 1-2 min)...");
    console.log("   Note: Les proxies UUPS sont vérifiés automatiquement par OZ");
    console.log("   Vous pouvez aussi vérifier manuellement avec:");
    console.log("   npx hardhat verify --network sepolia <IMPLEMENTATION_ADDRESS>");
  } else {
    console.log("\n⚠️  ETHERSCAN_API_KEY manquante — vérification ignorée");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
