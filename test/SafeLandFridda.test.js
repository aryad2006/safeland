const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SafeLandFridda", function () {
  let fridda;
  let admin, notary, heir1, heir2, heir3;

  const NOTARY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NOTARY_ROLE"));

  beforeEach(async function () {
    [admin, notary, heir1, heir2, heir3] = await ethers.getSigners();

    const SafeLandFridda = await ethers.getContractFactory("SafeLandFridda");
    fridda = await upgrades.deployProxy(
      SafeLandFridda,
      [admin.address, "https://safeland.ma/api/fridda/{id}"],
      { initializer: "initialize" }
    );
    await fridda.waitForDeployment();

    await fridda.connect(admin).grantRole(NOTARY_ROLE, notary.address);
  });

  describe("Ouverture de succession", function () {
    it("devrait créer un dossier Fridda", async function () {
      const actHash = ethers.keccak256(ethers.toUtf8Bytes("acte-deces"));
      const friddaHash = ethers.keccak256(ethers.toUtf8Bytes("fridda-doc"));

      await fridda.connect(notary).openSuccession(
        42, // nftTokenId
        admin.address, // deceased
        24, // totalShares (24 = divisible par 2,3,4,6,8,12)
        actHash,
        friddaHash
      );

      const [nftId, deceased, totalShares, heirs, shares, finalized] = await fridda.getDossier(1);
      expect(nftId).to.equal(42);
      expect(totalShares).to.equal(24);
      expect(finalized).to.be.false;
    });
  });

  describe("Distribution des parts", function () {
    beforeEach(async function () {
      const actHash = ethers.keccak256(ethers.toUtf8Bytes("acte-deces"));
      const friddaHash = ethers.keccak256(ethers.toUtf8Bytes("fridda-doc"));
      await fridda.connect(notary).openSuccession(42, admin.address, 24, actHash, friddaHash);
    });

    it("devrait distribuer les parts ERC-1155 aux héritiers", async function () {
      // Répartition islamique exemple : épouse 3/24, fils 14/24, fille 7/24
      await fridda.connect(notary).distributeShares(
        1,
        [heir1.address, heir2.address, heir3.address],
        [3, 14, 7]
      );

      expect(await fridda.balanceOf(heir1.address, 1)).to.equal(3);
      expect(await fridda.balanceOf(heir2.address, 1)).to.equal(14);
      expect(await fridda.balanceOf(heir3.address, 1)).to.equal(7);
    });

    it("devrait refuser si le total des parts ne correspond pas", async function () {
      await expect(
        fridda.connect(notary).distributeShares(1, [heir1.address, heir2.address], [10, 10])
      ).to.be.revertedWith("Fridda: shares mismatch total");
    });
  });

  describe("Gouvernance de l'indivision", function () {
    beforeEach(async function () {
      const actHash = ethers.keccak256(ethers.toUtf8Bytes("acte-deces"));
      const friddaHash = ethers.keccak256(ethers.toUtf8Bytes("fridda-doc"));
      await fridda.connect(notary).openSuccession(42, admin.address, 24, actHash, friddaHash);
      await fridda.connect(notary).distributeShares(
        1,
        [heir1.address, heir2.address, heir3.address],
        [3, 14, 7]
      );
      await fridda.connect(notary).finalizeSuccession(1);
    });

    it("devrait créer et voter une proposition", async function () {
      // Heir2 (14 parts) propose une vente
      await fridda.connect(heir2).createProposal(
        1, 0, "Vendre la villa", 6667, 7 // VoteType.Sell, quorum 2/3, 7 jours
      );

      // Heir2 vote pour (14 parts)
      await fridda.connect(heir2).vote(1, true);
      // Heir3 vote pour (7 parts)
      await fridda.connect(heir3).vote(1, true);

      const [, , , votesFor, votesAgainst] = await fridda.getProposal(1);
      expect(votesFor).to.equal(21); // 14 + 7
      expect(votesAgainst).to.equal(0);
    });

    it("devrait refuser le double vote", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 6667, 7);
      await fridda.connect(heir2).vote(1, true);
      await expect(
        fridda.connect(heir2).vote(1, true)
      ).to.be.revertedWith("Fridda: already voted");
    });

    it("devrait refuser un non-héritier de voter", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 6667, 7);
      await expect(
        fridda.connect(admin).vote(1, true)
      ).to.be.revertedWith("Fridda: no voting power");
    });
  });

  describe("Couverture branches supplémentaires", function () {
    beforeEach(async function () {
      const actHash = ethers.keccak256(ethers.toUtf8Bytes("acte-deces"));
      const friddaHash = ethers.keccak256(ethers.toUtf8Bytes("fridda-doc"));
      await fridda.connect(notary).openSuccession(42, admin.address, 24, actHash, friddaHash);
      await fridda.connect(notary).distributeShares(
        1,
        [heir1.address, heir2.address, heir3.address],
        [3, 14, 7]
      );
      await fridda.connect(notary).finalizeSuccession(1);
    });

    it("devrait enregistrer un vote contre", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 6667, 7);
      await fridda.connect(heir1).vote(1, false);
      const [, , , votesFor, votesAgainst] = await fridda.getProposal(1);
      expect(votesAgainst).to.equal(3); // heir1 a 3 parts
      expect(votesFor).to.equal(0);
    });

    it("devrait exécuter une proposition approuvée", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre la villa", 5000, 1);
      // heir2 vote pour (14/24 = 58% > 50% quorum)
      await fridda.connect(heir2).vote(1, true);

      // Avancer le temps de 1 jour + 1 seconde
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await fridda.connect(notary).executeProposal(1);
      const [, , , , , , , executed] = await fridda.getProposal(1);
      expect(executed).to.be.true;
    });

    it("devrait refuser executeProposal avant la deadline", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 5000, 7);
      await fridda.connect(heir2).vote(1, true);
      await expect(
        fridda.connect(notary).executeProposal(1)
      ).to.be.revertedWith("Fridda: vote not ended");
    });

    it("devrait refuser executeProposal si quorum non atteint", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 9000, 1);
      // heir1 vote pour (3/24 = 12.5% < 90% quorum)
      await fridda.connect(heir1).vote(1, true);

      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        fridda.connect(notary).executeProposal(1)
      ).to.be.revertedWith("Fridda: quorum not met");
    });

    it("devrait refuser la double exécution d une proposition", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "Vendre", 5000, 1);
      await fridda.connect(heir2).vote(1, true);

      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await fridda.connect(notary).executeProposal(1);
      await expect(
        fridda.connect(notary).executeProposal(1)
      ).to.be.revertedWith("Fridda: already executed");
    });

    it("devrait retourner le totalDossiers", async function () {
      expect(await fridda.totalDossiers()).to.equal(1);
    });

    it("devrait retourner le dossier par nftTokenId", async function () {
      expect(await fridda.getDossierByNft(42)).to.equal(1);
    });

    it("devrait supporter supportsInterface", async function () {
      // ERC1155 interfaceId = 0xd9b67a26
      expect(await fridda.supportsInterface("0xd9b67a26")).to.be.true;
      // AccessControl interfaceId = 0x7965db0b
      expect(await fridda.supportsInterface("0x7965db0b")).to.be.true;
    });

    it("devrait supporter l upgrade UUPS", async function () {
      const FriddaV2 = await ethers.getContractFactory("SafeLandFridda");
      const upgraded = await upgrades.upgradeProxy(await fridda.getAddress(), FriddaV2);
      expect(await upgraded.totalDossiers()).to.equal(1);
    });

    it("devrait refuser un non-notaire d ouvrir une succession", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await expect(
        fridda.connect(heir1).openSuccession(99, admin.address, 24, h, h)
      ).to.be.reverted;
    });

    it("devrait refuser distributeShares si longueurs inégales", async function () {
      // Nouveau dossier pour ce test
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(99, admin.address, 12, h, h);
      await expect(
        fridda.connect(notary).distributeShares(2, [heir1.address, heir2.address], [6])
      ).to.be.revertedWith("Fridda: length mismatch");
    });

    // ─── Branches openSuccession ──────────────────────────
    it("devrait refuser openSuccession avec totalShares zero", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await expect(
        fridda.connect(notary).openSuccession(99, admin.address, 0, h, h)
      ).to.be.revertedWith("Fridda: zero shares");
    });

    it("devrait refuser openSuccession si déjà ouverte pour le même NFT", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      // nftTokenId = 42 est déjà ouvert dans le beforeEach du describe parent
      await expect(
        fridda.connect(notary).openSuccession(42, admin.address, 24, h, h)
      ).to.be.revertedWith("Fridda: succession already open");
    });

    // ─── Branches distributeShares ────────────────────────
    it("devrait refuser distributeShares sans héritiers", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(200, admin.address, 12, h, h);
      await expect(
        fridda.connect(notary).distributeShares(2, [], [])
      ).to.be.revertedWith("Fridda: no heirs");
    });

    it("devrait refuser distributeShares avec héritier address(0)", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(201, admin.address, 12, h, h);
      await expect(
        fridda.connect(notary).distributeShares(2, [ethers.ZeroAddress], [12])
      ).to.be.revertedWith("Fridda: zero address heir");
    });

    it("devrait refuser distributeShares avec parts zero", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(202, admin.address, 12, h, h);
      await expect(
        fridda.connect(notary).distributeShares(2, [heir1.address], [0])
      ).to.be.revertedWith("Fridda: zero share");
    });

    it("devrait refuser distributeShares si déjà finalisé", async function () {
      // Le dossier 1 est déjà finalisé dans le beforeEach
      await expect(
        fridda.connect(notary).distributeShares(
          1, [heir1.address], [24]
        )
      ).to.be.revertedWith("Fridda: already finalized");
    });

    // ─── Branches finalizeSuccession ──────────────────────
    it("devrait refuser finalizeSuccession si déjà finalisé", async function () {
      await expect(
        fridda.connect(notary).finalizeSuccession(1)
      ).to.be.revertedWith("Fridda: already finalized");
    });

    it("devrait refuser finalizeSuccession sans parts distribuées", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(300, admin.address, 24, h, h);
      await expect(
        fridda.connect(notary).finalizeSuccession(2)
      ).to.be.revertedWith("Fridda: no shares distributed");
    });

    it("devrait refuser finalizeSuccession par un non-notaire", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(301, admin.address, 24, h, h);
      await fridda.connect(notary).distributeShares(2, [heir1.address, heir2.address, heir3.address], [3, 14, 7]);
      await expect(
        fridda.connect(heir1).finalizeSuccession(2)
      ).to.be.reverted;
    });

    // ─── Branches createProposal ──────────────────────────
    it("devrait refuser createProposal si pas finalisé", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(400, admin.address, 24, h, h);
      await fridda.connect(notary).distributeShares(2, [heir1.address, heir2.address, heir3.address], [3, 14, 7]);
      // Pas finalisé !
      await expect(
        fridda.connect(heir1).createProposal(2, 0, "test", 5000, 7)
      ).to.be.revertedWith("Fridda: not finalized");
    });

    it("devrait refuser createProposal par un non-héritier", async function () {
      await expect(
        fridda.connect(admin).createProposal(1, 0, "test", 5000, 7)
      ).to.be.revertedWith("Fridda: not an heir");
    });

    it("devrait refuser createProposal avec quorum zero", async function () {
      await expect(
        fridda.connect(heir1).createProposal(1, 0, "test", 0, 7)
      ).to.be.revertedWith("Fridda: invalid quorum");
    });

    it("devrait refuser createProposal avec quorum > 10000", async function () {
      await expect(
        fridda.connect(heir1).createProposal(1, 0, "test", 10001, 7)
      ).to.be.revertedWith("Fridda: invalid quorum");
    });

    // ─── Branches vote ────────────────────────────────────
    it("devrait refuser un vote après la deadline", async function () {
      await fridda.connect(heir2).createProposal(1, 0, "test", 5000, 1);
      // Avancer le temps au-delà de la deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        fridda.connect(heir1).vote(1, true)
      ).to.be.revertedWith("Fridda: vote ended");
    });

    // ─── Branches distributeShares sans rôle ──────────────
    it("devrait refuser distributeShares par un non-notaire", async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await fridda.connect(notary).openSuccession(500, admin.address, 12, h, h);
      await expect(
        fridda.connect(heir1).distributeShares(2, [heir1.address], [12])
      ).to.be.reverted;
    });
  });

  // ─── Couverture branches double-init & authorizeUpgrade ─
  describe("Branches sécurité avancées", function () {
    beforeEach(async function () {
      const h = ethers.keccak256(ethers.toUtf8Bytes("acte"));
      await fridda.connect(notary).openSuccession(42, admin.address, 24, h, h);
      await fridda.connect(notary).distributeShares(1, [heir1.address, heir2.address, heir3.address], [3, 14, 7]);
      await fridda.connect(notary).finalizeSuccession(1);
    });

    it("devrait refuser un double appel à initialize()", async function () {
      await expect(
        fridda.connect(admin).initialize(admin.address, "https://safeland.ma/api/fridda/{id}")
      ).to.be.reverted;
    });

    it("devrait refuser upgradeProxy par un non-admin", async function () {
      const FriddaV2 = await ethers.getContractFactory("SafeLandFridda", heir1);
      await expect(
        upgrades.upgradeProxy(await fridda.getAddress(), FriddaV2)
      ).to.be.reverted;
    });

    it("devrait refuser executeProposal par un non-notaire", async function () {
      await fridda.connect(heir1).createProposal(1, 0, "vente", 5000, 7);
      await expect(
        fridda.connect(heir1).executeProposal(1)
      ).to.be.reverted;
    });
  });
});
