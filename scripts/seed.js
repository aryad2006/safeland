/**
 * scripts/seed.js — Script de données de démonstration SafeLand
 *
 * Crée 6 propriétés, 1 deal escrow, 1 dossier de succession
 * et enregistre le tout dans le Registry.
 *
 * Usage : npx hardhat run scripts/seed.js --network localhost
 */
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [admin, agent, notary, buyer, heir1, heir2, heir3, judge1, judge2] =
    await ethers.getSigners();

  console.log("🌱 SafeLand Seed — Données de démonstration");
  console.log("=".repeat(55));

  // ── Charger les adresses déployées ────────────────────────
  const addresses = require("../deployed-addresses.json");

  const NFT = await ethers.getContractAt("SafeLandNFT", addresses.SafeLandNFT);
  const Registry = await ethers.getContractAt("SafeLandRegistry", addresses.SafeLandRegistry);
  const Escrow = await ethers.getContractAt("SafeLandEscrow", addresses.SafeLandEscrow);
  const Fridda = await ethers.getContractAt("SafeLandFridda", addresses.SafeLandFridda);
  const Justice = await ethers.getContractAt("SafeLandJustice", addresses.SafeLandJustice);

  const Timelock = addresses.SafeLandTimelock
    ? await ethers.getContractAt("SafeLandTimelock", addresses.SafeLandTimelock)
    : null;

  // ── Rôles ─────────────────────────────────────────────────
  const AGENT_ROLE = await NFT.AGENT_ROLE();
  const NOTARY_ROLE = await NFT.NOTARY_ROLE();
  const JUSTICE_ROLE = await NFT.JUSTICE_ROLE();
  const OPERATOR_ROLE = await Registry.OPERATOR_ROLE();
  const JUDGE_ROLE = await Justice.JUDGE_ROLE();

  // Attribuer les rôles si nécessaire
  const grants = [
    [NFT, AGENT_ROLE, agent.address],
    [NFT, NOTARY_ROLE, notary.address],
    [NFT, JUSTICE_ROLE, judge1.address],
    [Registry, OPERATOR_ROLE, admin.address],
    [Justice, JUDGE_ROLE, judge1.address],
    [Justice, JUDGE_ROLE, judge2.address],
  ];

  for (const [contract, role, addr] of grants) {
    if (!(await contract.hasRole(role, addr))) {
      await (await contract.grantRole(role, addr)).wait();
    }
  }
  console.log("✅ Rôles attribués (agent, notary, judges)");

  // ── 1. Créer 6 propriétés ────────────────────────────────
  const properties = [
    {
      to: buyer.address,
      tf: "TF-10234/C",
      tfOld: "TF-OLD-10234",
      surface: 120,
      type: "residential",
      city: "Casablanca",
      gps: "33.5731,-7.5898",
      lat: 335731,
      lng: -75898,
      doc: "QmCasablancaDoc1",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-casa-1")),
    },
    {
      to: agent.address,
      tf: "TF-20456/R",
      tfOld: "TF-OLD-20456",
      surface: 250,
      type: "commercial",
      city: "Rabat",
      gps: "34.0209,-6.8416",
      lat: 340209,
      lng: -68416,
      doc: "QmRabatDoc2",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-rabat-2")),
    },
    {
      to: notary.address,
      tf: "TF-30789/M",
      tfOld: "TF-OLD-30789",
      surface: 5000,
      type: "agricultural",
      city: "Marrakech",
      gps: "31.6295,-7.9811",
      lat: 316295,
      lng: -79811,
      doc: "QmMarrakechDoc3",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-marrakech-3")),
    },
    {
      to: heir1.address,
      tf: "TF-40123/T",
      tfOld: "TF-OLD-40123",
      surface: 800,
      type: "industrial",
      city: "Tanger",
      gps: "35.7595,-5.8340",
      lat: 357595,
      lng: -58340,
      doc: "QmTangerDoc4",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-tanger-4")),
    },
    {
      to: buyer.address,
      tf: "TF-50567/F",
      tfOld: "TF-OLD-50567",
      surface: 180,
      type: "residential",
      city: "Fès",
      gps: "34.0331,-5.0003",
      lat: 340331,
      lng: -50003,
      doc: "QmFesDoc5",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-fes-5")),
    },
    {
      to: admin.address,
      tf: "TF-60890/A",
      tfOld: "TF-OLD-60890",
      surface: 320,
      type: "commercial",
      city: "Agadir",
      gps: "30.4278,-9.5981",
      lat: 304278,
      lng: -95981,
      doc: "QmAgadirDoc6",
      hash: ethers.keccak256(ethers.toUtf8Bytes("doc-agadir-6")),
    },
  ];

  const propertyTypes = { residential: 0, commercial: 1, agricultural: 2, industrial: 3 };

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    try {
      const tx = await NFT.connect(agent).createProperty(
        p.to,
        p.tf,
        p.tfOld,
        p.surface,
        Object.keys(propertyTypes).indexOf(p.type).toString(),
        p.city,
        p.lat,
        p.lng,
        p.doc,
        p.hash
      );
      await tx.wait();

      // Enregistrer dans le Registry
      await (
        await Registry.registerProperty(i, p.city, p.type, p.to)
      ).wait();

      console.log(`  📍 Token #${i} — ${p.tf} — ${p.city} (${p.surface} m²)`);
    } catch (err) {
      console.log(`  ⚠️  Token #${i} déjà existant ou erreur: ${err.reason || err.message}`);
    }
  }
  console.log("✅ 6 propriétés créées\n");

  // ── 2. Créer un deal Escrow ──────────────────────────────
  console.log("📋 Création d'un deal escrow...");
  try {
    // Token #0 : buyer vend à heir1
    const salePrice = ethers.parseEther("10");

    // Le NFT doit approuver l'escrow pour le transfert
    await (await NFT.connect(buyer).approve(addresses.SafeLandEscrow, 0)).wait();

    const dealTx = await Escrow.connect(notary).createDeal(
      0,
      buyer.address,
      heir1.address,
      salePrice,
      ethers.keccak256(ethers.toUtf8Bytes("contrat-vente-casa"))
    );
    await dealTx.wait();
    console.log("  ✅ Deal #0 créé (Token #0, 10 ETH)");

    // Vendeur signe
    await (await Escrow.connect(buyer).sellerSign(0)).wait();
    console.log("  ✅ Vendeur a signé");

    // Note: pour compléter le deal il faudrait que l'acheteur dépose les fonds
    // await (await Escrow.connect(heir1).buyerDeposit(0, { value: salePrice })).wait();
    console.log("  ℹ️  Deal en attente du dépôt de l'acheteur (SellerSigned)\n");
  } catch (err) {
    console.log(`  ⚠️  Escrow: ${err.reason || err.message}\n`);
  }

  // ── 3. Ouvrir un dossier de succession Fridda ────────────
  console.log("👨‍👩‍👧‍👦 Ouverture succession Fridda...");
  try {
    // Token #3 (Tanger, heir1) : succession avec 3 héritiers
    const FRIDDA_NOTARY = await Fridda.NOTARY_ROLE();
    if (!(await Fridda.hasRole(FRIDDA_NOTARY, notary.address))) {
      await (await Fridda.grantRole(FRIDDA_NOTARY, notary.address)).wait();
    }

    const succTx = await Fridda.connect(notary).openSuccession(
      3, // tokenId
      heir1.address, // deceasedOwner
      24, // totalShares
      ethers.keccak256(ethers.toUtf8Bytes("acte-deces-tanger")),
      ethers.keccak256(ethers.toUtf8Bytes("fridda-doc-tanger"))
    );
    await succTx.wait();
    console.log("  ✅ Dossier #0 ouvert (Token #3, 24 parts)");

    // Distribuer les parts : 12/24, 8/24, 4/24
    const distTx = await Fridda.connect(notary).distributeShares(
      0,
      [heir1.address, heir2.address, heir3.address],
      [12, 8, 4]
    );
    await distTx.wait();
    console.log("  ✅ Parts distribuées : heir1=12, heir2=8, heir3=4");

    // Créer une proposition de vote
    const propTx = await Fridda.connect(heir1).createProposal(
      0,    // dossierId
      0,    // voteType = Sell
      "Proposer la vente du bien à Tanger pour financer les héritiers",
      5000, // quorum 50%
      7     // 7 jours
    );
    await propTx.wait();
    console.log("  ✅ Proposition #0 créée (vote Vente, quorum 50%)\n");
  } catch (err) {
    console.log(`  ⚠️  Fridda: ${err.reason || err.message}\n`);
  }

  // ── 4. Enregistrer des transactions dans le Registry ─────
  console.log("📊 Enrichissement du Registry...");
  try {
    await (await Registry.recordTransaction(0, admin.address, buyer.address, "creation")).wait();
    await (await Registry.recordTransaction(1, admin.address, agent.address, "creation")).wait();
    await (await Registry.recordTransaction(2, admin.address, notary.address, "creation")).wait();
    await (await Registry.recordFraudPrevented(0, "Tentative de double vente détectée")).wait();
    console.log("  ✅ 3 transactions + 1 fraude enregistrées\n");
  } catch (err) {
    console.log(`  ⚠️  Registry: ${err.reason || err.message}\n`);
  }

  // ── 7. Démo Timelock ────────────────────────────────────────
  if (Timelock) {
    try {
      // Planifie un futur grant de AGENT_ROLE à agent via Timelock (délai 1 jour)
      const AGENT_ROLE = await NFT.AGENT_ROLE();
      const calldata = NFT.interface.encodeFunctionData("grantRole", [
        AGENT_ROLE,
        admin.address, // cible symbolique pour la démo
      ]);
      const salt = ethers.id("safeland-seed-demo-v1");
      // MIN_DELAY est une constante publique (pas getMinDelay)
      const delay = await Timelock.MIN_DELAY();

      const tx = await Timelock.connect(admin).schedule(
        await NFT.getAddress(), // target
        0,                       // value
        calldata,                // data
        salt,                    // salt (pas de predecessor dans SafeLandTimelock)
        delay,                   // delay en secondes
        "Seed demo: grant AGENT_ROLE via Timelock" // description
      );
      await tx.wait();

      const opId = await Timelock.hashOperation(
        await NFT.getAddress(), 0, calldata, salt
      );
      console.log(`⏰  Opération Timelock planifiée : ${opId.slice(0, 20)}...`);
      console.log(`   Délai : ${delay.toString()}s — exécutable après ${new Date(Date.now() + Number(delay) * 1000).toISOString()}`);
    } catch (err) {
      console.log(`  ⚠️  Timelock demo: ${err.reason || err.message}`);
    }
  } else {
    console.log("  ⏭️  Timelock non déployé, étape ignorée");
  }
  console.log("");

  // ── Résumé ───────────────────────────────────────────────
  console.log("=".repeat(55));
  console.log("🎉 Seed terminé !");
  console.log("");

  const stats = await Registry.getStats();
  console.log(`📊 Statistiques Registry :`);
  console.log(`   Propriétés : ${stats.totalProperties}`);
  console.log(`   Transactions : ${stats.totalTransactions}`);
  console.log(`   Fraudes évitées : ${stats.fraudPrevented}`);

  const totalMinted = await NFT.totalMinted();
  const totalDeals = await Escrow.totalDeals();
  const totalDossiers = await Fridda.totalDossiers();
  console.log(`   NFTs mintés : ${totalMinted}`);
  console.log(`   Deals escrow : ${totalDeals}`);
  console.log(`   Dossiers Fridda : ${totalDossiers}`);
  console.log("");
  console.log("🔑 Comptes de test :");
  console.log(`   Admin    : ${admin.address}`);
  console.log(`   Agent    : ${agent.address}`);
  console.log(`   Notaire  : ${notary.address}`);
  console.log(`   Acheteur : ${buyer.address}`);
  console.log(`   Héritier1: ${heir1.address}`);
  console.log(`   Héritier2: ${heir2.address}`);
  console.log(`   Héritier3: ${heir3.address}`);
  console.log(`   Juge1    : ${judge1.address}`);
  console.log(`   Juge2    : ${judge2.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
