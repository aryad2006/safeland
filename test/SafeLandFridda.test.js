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
});
