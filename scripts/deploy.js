const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🏗️  SafeLand Morocco — Déploiement");
  console.log("📍 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("─".repeat(60));

  // ─── 1. SafeLandNFT ─────────────────────────────────────
  console.log("\n1/5 — Déploiement SafeLandNFT (ERC-721)...");
  const SafeLandNFT = await ethers.getContractFactory("SafeLandNFT");
  const nft = await upgrades.deployProxy(SafeLandNFT, [deployer.address], { initializer: "initialize" });
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("   ✅ SafeLandNFT:", nftAddress);

  // ─── 2. SafeLandRegistry ────────────────────────────────
  console.log("\n2/5 — Déploiement SafeLandRegistry...");
  const SafeLandRegistry = await ethers.getContractFactory("SafeLandRegistry");
  const registry = await upgrades.deployProxy(SafeLandRegistry, [deployer.address], { initializer: "initialize" });
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   ✅ SafeLandRegistry:", registryAddress);

  // ─── 3. SafeLandEscrow ──────────────────────────────────
  // Pour le déploiement local, on utilise le deployer comme DGI et ANCFCC
  const dgiWallet = deployer.address;
  const ancfccWallet = deployer.address;

  console.log("\n3/5 — Déploiement SafeLandEscrow...");
  const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
  const escrow = await upgrades.deployProxy(
    SafeLandEscrow,
    [deployer.address, nftAddress, dgiWallet, ancfccWallet],
    { initializer: "initialize" }
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("   ✅ SafeLandEscrow:", escrowAddress);

  // ─── 4. SafeLandFridda ──────────────────────────────────
  console.log("\n4/5 — Déploiement SafeLandFridda (ERC-1155)...");
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
  console.log("\n5/5 — Déploiement SafeLandJustice...");
  const SafeLandJustice = await ethers.getContractFactory("SafeLandJustice");
  const justice = await upgrades.deployProxy(
    SafeLandJustice,
    [deployer.address, nftAddress, 2], // requiredSignatures = 2
    { initializer: "initialize" }
  );
  await justice.waitForDeployment();
  const justiceAddress = await justice.getAddress();
  console.log("   ✅ SafeLandJustice:", justiceAddress);

  // ─── Configuration des rôles ────────────────────────────
  console.log("\n⚙️  Configuration des rôles...");

  const AGENT_ROLE = ethers.keccak256(ethers.toUtf8Bytes("AGENT_ROLE"));
  const JUSTICE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("JUSTICE_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));

  // L'Escrow a besoin du rôle AGENT pour transférer les NFT
  await nft.grantRole(AGENT_ROLE, escrowAddress);
  console.log("   ✅ AGENT_ROLE → Escrow");

  // Le Justice a besoin du rôle JUSTICE pour Burn & Remint
  await nft.grantRole(JUSTICE_ROLE, justiceAddress);
  console.log("   ✅ JUSTICE_ROLE → Justice");

  // Le Registry a besoin d'être opéré par le deployer
  // (En production, ce serait le backend)
  await registry.grantRole(OPERATOR_ROLE, deployer.address);
  console.log("   ✅ OPERATOR_ROLE → Deployer");

  // ─── Résumé ─────────────────────────────────────────────
  console.log("\n" + "═".repeat(60));
  console.log("🎉 DÉPLOIEMENT TERMINÉ — SafeLand Morocco");
  console.log("═".repeat(60));

  const addresses = {
    SafeLandNFT: nftAddress,
    SafeLandRegistry: registryAddress,
    SafeLandEscrow: escrowAddress,
    SafeLandFridda: friddaAddress,
    SafeLandJustice: justiceAddress,
  };

  console.log("\n📋 Adresses des contrats:");
  Object.entries(addresses).forEach(([name, addr]) => {
    console.log(`   ${name}: ${addr}`);
  });

  // Sauvegarder les adresses
  const fs = require("fs");
  fs.writeFileSync(
    "./deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Adresses sauvegardées dans deployed-addresses.json");

  return addresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
