const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SafeLandNFT", function () {
  let nft;
  let admin, agent, notary, justice, owner1, owner2;

  const AGENT_ROLE = ethers.keccak256(ethers.toUtf8Bytes("AGENT_ROLE"));
  const NOTARY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NOTARY_ROLE"));
  const JUSTICE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("JUSTICE_ROLE"));

  beforeEach(async function () {
    [admin, agent, notary, justice, owner1, owner2] = await ethers.getSigners();

    const SafeLandNFT = await ethers.getContractFactory("SafeLandNFT");
    nft = await upgrades.deployProxy(SafeLandNFT, [admin.address], { initializer: "initialize" });
    await nft.waitForDeployment();

    await nft.connect(admin).grantRole(AGENT_ROLE, agent.address);
    await nft.connect(admin).grantRole(NOTARY_ROLE, notary.address);
    await nft.connect(admin).grantRole(JUSTICE_ROLE, justice.address);
  });

  // ─── Helpers ────────────────────────────────────────────
  async function createDefaultProperty(ownerAddr) {
    const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc-12345"));
    const tx = await nft.connect(agent).createProperty(
      ownerAddr || owner1.address,
      "12345/R",
      "villa",
      250,
      "Casablanca",
      "Anfa",
      33573100,
      -7589800,
      "ipfs://QmTest123",
      docHash
    );
    return tx;
  }

  // ─── Tests Création ─────────────────────────────────────
  describe("Création de propriété", function () {
    it("devrait créer un NFT foncier avec les bonnes métadonnées", async function () {
      await createDefaultProperty();

      const prop = await nft.getProperty(1);
      expect(prop.titreFoncier).to.equal("12345/R");
      expect(prop.propertyType).to.equal("villa");
      expect(prop.surface).to.equal(250);
      expect(prop.city).to.equal("Casablanca");
      expect(prop.isActive).to.be.true;
      expect(await nft.ownerOf(1)).to.equal(owner1.address);
    });

    it("devrait émettre l'événement PropertyCreated", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc-12345"));
      await expect(
        nft.connect(agent).createProperty(
          owner1.address, "12345/R", "villa", 250,
          "Casablanca", "Anfa", 33573100, -7589800,
          "ipfs://QmTest123", docHash
        )
      ).to.emit(nft, "PropertyCreated")
        .withArgs(1, "12345/R", owner1.address, agent.address);
    });

    it("devrait refuser un titre foncier en double", async function () {
      await createDefaultProperty();
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc-other"));
      await expect(
        nft.connect(agent).createProperty(
          owner2.address, "12345/R", "terrain", 100,
          "Rabat", "Agdal", 34020000, -6840000,
          "ipfs://QmOther", docHash
        )
      ).to.be.revertedWith("SafeLand: titre exists");
    });

    it("devrait refuser si appelé sans le rôle AGENT", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
      await expect(
        nft.connect(owner1).createProperty(
          owner1.address, "999/R", "villa", 100,
          "Fes", "Medina", 0, 0, "ipfs://x", docHash
        )
      ).to.be.reverted;
    });

    it("devrait enregistrer l'historique de création", async function () {
      await createDefaultProperty();
      const history = await nft.getHistory(1);
      expect(history.length).to.equal(1);
      expect(history[0].txType).to.equal("creation");
      expect(history[0].from).to.equal(ethers.ZeroAddress);
      expect(history[0].to).to.equal(owner1.address);
    });

    it("devrait retrouver un token par titre foncier", async function () {
      await createDefaultProperty();
      const tokenId = await nft.findByTitreFoncier("12345/R");
      expect(tokenId).to.equal(1);
    });
  });

  // ─── Tests Transfert ────────────────────────────────────
  describe("Transfert de propriété", function () {
    beforeEach(async function () {
      await createDefaultProperty();
    });

    it("devrait transférer le NFT au nouveau propriétaire", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente-2026"));
      await nft.connect(agent).transferProperty(
        1, owner2.address, "sale", docHash, notary.address
      );
      expect(await nft.ownerOf(1)).to.equal(owner2.address);
    });

    it("devrait enregistrer l'historique de transfert", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente-2026"));
      await nft.connect(agent).transferProperty(
        1, owner2.address, "sale", docHash, notary.address
      );
      const history = await nft.getHistory(1);
      expect(history.length).to.equal(2);
      expect(history[1].txType).to.equal("sale");
      expect(history[1].notary).to.equal(notary.address);
    });

    it("devrait refuser le transfert si verrouillé", async function () {
      await nft.connect(owner1).lockTransfer(1, "travel_lock");
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente"));
      await expect(
        nft.connect(agent).transferProperty(1, owner2.address, "sale", docHash, notary.address)
      ).to.be.revertedWith("SafeLand: transfer locked");
    });
  });

  // ─── Tests Travel Lock ──────────────────────────────────
  describe("Travel Lock / Safe-Lock", function () {
    beforeEach(async function () {
      await createDefaultProperty();
    });

    it("le propriétaire devrait pouvoir verrouiller son titre", async function () {
      await nft.connect(owner1).lockTransfer(1, "travel_lock");
      expect(await nft.isLocked(1)).to.be.true;
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("le propriétaire devrait pouvoir déverrouiller son titre", async function () {
      await nft.connect(owner1).lockTransfer(1, "travel_lock");
      await nft.connect(owner1).unlockTransfer(1);
      expect(await nft.isLocked(1)).to.be.false;
      expect(await nft.canTransfer(1)).to.be.true;
    });

    it("l'admin devrait pouvoir verrouiller (Panic Button)", async function () {
      await nft.connect(admin).lockTransfer(1, "panic_button");
      expect(await nft.isLocked(1)).to.be.true;
    });

    it("un tiers ne devrait pas pouvoir verrouiller", async function () {
      await expect(
        nft.connect(owner2).lockTransfer(1, "malicious")
      ).to.be.revertedWith("SafeLand: not owner or admin");
    });
  });

  // ─── Tests Charges / Hypothèques ────────────────────────
  describe("Charges et hypothèques", function () {
    beforeEach(async function () {
      await createDefaultProperty();
    });

    it("devrait ajouter une hypothèque et verrouiller le transfert", async function () {
      await nft.connect(agent).addEncumbrance(
        1, "hypotheque", notary.address, ethers.parseEther("500000"), 0
      );
      const encs = await nft.getEncumbrances(1);
      expect(encs.length).to.equal(1);
      expect(encs[0].encType).to.equal("hypotheque");
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("devrait déverrouiller après mainlevée", async function () {
      await nft.connect(agent).addEncumbrance(
        1, "hypotheque", notary.address, ethers.parseEther("500000"), 0
      );
      await nft.connect(agent).removeEncumbrance(1, 0);
      expect(await nft.canTransfer(1)).to.be.true;
    });
  });

  // ─── Tests Justice Override ─────────────────────────────
  describe("Justice Override (Burn & Remint)", function () {
    beforeEach(async function () {
      await createDefaultProperty();
    });

    it("devrait geler un titre par ordre judiciaire", async function () {
      const judgmentHash = ethers.keccak256(ethers.toUtf8Bytes("jugement-2026-001"));
      await nft.connect(justice).freezeByJustice(1, judgmentHash);
      expect(await nft.isFrozenByJustice(1)).to.be.true;
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("devrait burn & remint vers le propriétaire légitime", async function () {
      const judgmentHash = ethers.keccak256(ethers.toUtf8Bytes("jugement-2026-001"));
      await nft.connect(justice).justiceOverride(
        1, owner2.address, judgmentHash, "ipfs://QmNewUri"
      );

      // Le nouveau propriétaire est owner2
      expect(await nft.ownerOf(1)).to.equal(owner2.address);

      // Les données de propriété sont préservées
      const prop = await nft.getProperty(1);
      expect(prop.titreFoncier).to.equal("12345/R");

      // L'historique contient l'override
      const history = await nft.getHistory(1);
      const lastEntry = history[history.length - 1];
      expect(lastEntry.txType).to.equal("justice_override");
    });

    it("devrait refuser un override sans le rôle JUSTICE", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(
        nft.connect(agent).justiceOverride(1, owner2.address, hash, "ipfs://x")
      ).to.be.reverted;
    });
  });

  // ─── Tests Pause (Panic Button) ─────────────────────────
  describe("Pause globale (Panic Button)", function () {
    it("devrait bloquer les créations quand en pause", async function () {
      await nft.connect(admin).pause();
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
      await expect(
        nft.connect(agent).createProperty(
          owner1.address, "999/R", "villa", 100,
          "Rabat", "Agdal", 0, 0, "ipfs://x", docHash
        )
      ).to.be.reverted;
    });

    it("devrait reprendre après unpause", async function () {
      await nft.connect(admin).pause();
      await nft.connect(admin).unpause();
      await createDefaultProperty();
      expect(await nft.totalMinted()).to.equal(1);
    });
  });

  // ─── Tests couverture supplémentaires ───────────────────
  describe("Couverture branches supplémentaires", function () {
    beforeEach(async function () {
      await createDefaultProperty(); // tokenId = 1
    });

    it("devrait gérer une charge de type saisie", async function () {
      await nft.connect(agent).addEncumbrance(
        1, "saisie", notary.address, 0, 0
      );
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("devrait garder le verrouillage quand il reste une charge bloquante active", async function () {
      // Ajouter 2 hypothèques
      await nft.connect(agent).addEncumbrance(1, "hypotheque", notary.address, ethers.parseEther("100000"), 0);
      await nft.connect(agent).addEncumbrance(1, "hypotheque", notary.address, ethers.parseEther("200000"), 0);

      // Retirer la première — il reste la deuxième
      await nft.connect(agent).removeEncumbrance(1, 0);

      // Toujours non-transférable car la 2e hypothèque est active
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("l admin devrait pouvoir déverrouiller un titre", async function () {
      await nft.connect(owner1).lockTransfer(1, "travel");
      await nft.connect(admin).unlockTransfer(1);
      expect(await nft.isLocked(1)).to.be.false;
    });

    it("canTransfer devrait retourner false si gelé par la justice", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("gel"));
      await nft.connect(justice).freezeByJustice(1, hash);
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("canTransfer devrait retourner false si en pause", async function () {
      await nft.connect(admin).pause();
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("devrait supporter l upgrade UUPS", async function () {
      const SafeLandNFTV2 = await ethers.getContractFactory("SafeLandNFT");
      const upgraded = await upgrades.upgradeProxy(await nft.getAddress(), SafeLandNFTV2);
      expect(await upgraded.totalMinted()).to.equal(1);
    });

    it("devrait refuser createProperty avec address(0)", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
      await expect(
        nft.connect(agent).createProperty(
          ethers.ZeroAddress, "NEW/R", "villa", 100,
          "Rabat", "Agdal", 0, 0, "ipfs://x", docHash
        )
      ).to.be.revertedWith("SafeLand: zero address");
    });

    it("devrait refuser createProperty avec surface 0", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
      await expect(
        nft.connect(agent).createProperty(
          owner1.address, "NEW2/R", "villa", 0,
          "Rabat", "Agdal", 0, 0, "ipfs://x", docHash
        )
      ).to.be.revertedWith("SafeLand: zero surface");
    });

    it("devrait refuser createProperty avec titre vide", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
      await expect(
        nft.connect(agent).createProperty(
          owner1.address, "", "villa", 100,
          "Rabat", "Agdal", 0, 0, "ipfs://x", docHash
        )
      ).to.be.revertedWith("SafeLand: empty titre");
    });

    // ─── Branches transferProperty ────────────────────────
    it("devrait refuser transferProperty vers address(0)", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente"));
      await expect(
        nft.connect(agent).transferProperty(1, ethers.ZeroAddress, "sale", docHash, notary.address)
      ).to.be.revertedWith("SafeLand: zero address");
    });

    it("devrait refuser transferProperty quand gelé par la justice", async function () {
      const judgmentHash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await nft.connect(justice).freezeByJustice(1, judgmentHash);
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente"));
      await expect(
        nft.connect(agent).transferProperty(1, owner2.address, "sale", docHash, notary.address)
      ).to.be.revertedWith("SafeLand: frozen by justice");
    });

    it("devrait refuser transferProperty quand en pause", async function () {
      await nft.connect(admin).pause();
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente"));
      await expect(
        nft.connect(agent).transferProperty(1, owner2.address, "sale", docHash, notary.address)
      ).to.be.reverted;
    });

    it("devrait refuser transferProperty sur un token inexistant", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("vente"));
      await expect(
        nft.connect(agent).transferProperty(999, owner2.address, "sale", docHash, notary.address)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    // ─── Branches removeEncumbrance ───────────────────────
    it("devrait refuser removeEncumbrance avec index invalide", async function () {
      await expect(
        nft.connect(agent).removeEncumbrance(1, 99)
      ).to.be.revertedWith("SafeLand: bad index");
    });

    // ─── Branches findByTitreFoncier ──────────────────────
    it("devrait refuser findByTitreFoncier si titre inexistant", async function () {
      await expect(
        nft.findByTitreFoncier("INEXISTANT/R")
      ).to.be.revertedWith("SafeLand: titre not found");
    });

    // ─── Branches vues sur tokens inexistants ─────────────
    it("devrait refuser getProperty sur un token inexistant", async function () {
      await expect(
        nft.getProperty(999)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait refuser getHistory sur un token inexistant", async function () {
      await expect(
        nft.getHistory(999)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait refuser getEncumbrances sur un token inexistant", async function () {
      await expect(
        nft.getEncumbrances(999)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    // ─── Branches encumbrances types ──────────────────────
    it("devrait ajouter une charge safe_lock et verrouiller", async function () {
      await nft.connect(agent).addEncumbrance(1, "safe_lock", notary.address, 0, 0);
      expect(await nft.canTransfer(1)).to.be.false;
    });

    it("devrait ajouter une servitude sans verrouiller", async function () {
      await nft.connect(agent).addEncumbrance(1, "servitude", notary.address, 0, 0);
      expect(await nft.canTransfer(1)).to.be.true;
      const encs = await nft.getEncumbrances(1);
      expect(encs.length).to.equal(1);
      expect(encs[0].encType).to.equal("servitude");
    });

    // ─── Branches lock/unlock sur tokens inexistants ──────
    it("devrait refuser lockTransfer sur un token inexistant", async function () {
      await expect(
        nft.connect(owner1).lockTransfer(999, "test")
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait refuser unlockTransfer sur un token inexistant", async function () {
      await expect(
        nft.connect(owner1).unlockTransfer(999)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait refuser unlockTransfer par un non-propriétaire", async function () {
      await nft.connect(owner1).lockTransfer(1, "test");
      await expect(
        nft.connect(owner2).unlockTransfer(1)
      ).to.be.revertedWith("SafeLand: not owner or admin");
    });

    // ─── Branches freezeByJustice ─────────────────────────
    it("devrait refuser freezeByJustice sans le rôle JUSTICE", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await expect(
        nft.connect(agent).freezeByJustice(1, hash)
      ).to.be.reverted;
    });

    it("devrait refuser freezeByJustice sur un token inexistant", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await expect(
        nft.connect(justice).freezeByJustice(999, hash)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    // ─── Branches justiceOverride ─────────────────────────
    it("devrait refuser justiceOverride vers address(0)", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await expect(
        nft.connect(justice).justiceOverride(1, ethers.ZeroAddress, hash, "ipfs://x")
      ).to.be.revertedWith("SafeLand: zero address");
    });

    it("devrait refuser justiceOverride sur un token inexistant", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await expect(
        nft.connect(justice).justiceOverride(999, owner2.address, hash, "ipfs://x")
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    // ─── Branches pause sans rôle admin ───────────────────
    it("devrait refuser pause par un non-admin", async function () {
      await expect(
        nft.connect(owner1).pause()
      ).to.be.reverted;
    });

    it("devrait refuser unpause par un non-admin", async function () {
      await nft.connect(admin).pause();
      await expect(
        nft.connect(owner1).unpause()
      ).to.be.reverted;
    });

    // ─── Branches vues ────────────────────────────────────
    it("canTransfer devrait retourner false pour un token inexistant", async function () {
      expect(await nft.canTransfer(999)).to.be.false;
    });

    it("devrait retourner le tokenURI correct", async function () {
      const uri = await nft.tokenURI(1);
      expect(uri).to.equal("ipfs://QmTest123");
    });

    it("devrait supporter les interfaces ERC721 et AccessControl", async function () {
      // ERC721 interfaceId = 0x80ac58cd
      expect(await nft.supportsInterface("0x80ac58cd")).to.be.true;
      // AccessControl interfaceId = 0x7965db0b  
      expect(await nft.supportsInterface("0x7965db0b")).to.be.true;
    });

    it("devrait retourner isFrozenByJustice false par défaut", async function () {
      expect(await nft.isFrozenByJustice(1)).to.be.false;
    });

    // ─── Branches addEncumbrance sur token inexistant ─────
    it("devrait refuser addEncumbrance sur un token inexistant", async function () {
      await expect(
        nft.connect(agent).addEncumbrance(999, "hypotheque", notary.address, 0, 0)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait refuser removeEncumbrance sur un token inexistant", async function () {
      await expect(
        nft.connect(agent).removeEncumbrance(999, 0)
      ).to.be.revertedWith("SafeLand: token does not exist");
    });

    it("devrait retourner isLocked false par défaut", async function () {
      expect(await nft.isLocked(1)).to.be.false;
    });

    it("removeEncumbrance avec servitude ne doit pas toucher le lock", async function () {
      await nft.connect(agent).addEncumbrance(1, "servitude", notary.address, 0, 0);
      expect(await nft.canTransfer(1)).to.be.true;
      await nft.connect(agent).removeEncumbrance(1, 0);
      expect(await nft.canTransfer(1)).to.be.true;
    });

    it("devrait gérer safe_lock et le retirer proprement", async function () {
      await nft.connect(agent).addEncumbrance(1, "safe_lock", notary.address, 0, 0);
      expect(await nft.canTransfer(1)).to.be.false;
      await nft.connect(agent).removeEncumbrance(1, 0);
      expect(await nft.canTransfer(1)).to.be.true;
    });

    it("devrait gérer saisie et hypothèque ensemble", async function () {
      await nft.connect(agent).addEncumbrance(1, "saisie", notary.address, 0, 0);
      await nft.connect(agent).addEncumbrance(1, "hypotheque", notary.address, ethers.parseEther("100"), 0);
      expect(await nft.canTransfer(1)).to.be.false;
      // Retirer saisie - hypotheque reste
      await nft.connect(agent).removeEncumbrance(1, 0);
      expect(await nft.canTransfer(1)).to.be.false;
      // Retirer hypotheque
      await nft.connect(agent).removeEncumbrance(1, 1);
      expect(await nft.canTransfer(1)).to.be.true;
    });

    it("devrait lire le totalMinted après justiceOverride", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("jugement"));
      await nft.connect(justice).justiceOverride(1, owner2.address, hash, "ipfs://new");
      // totalMinted ne change pas (même tokenId)
      expect(await nft.totalMinted()).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(owner2.address);
    });
  });
});
