const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SafeLandJustice", function () {
  let justice, nft;
  let admin, judge1, judge2, judge3, owner1, newOwner;

  beforeEach(async function () {
    [admin, judge1, judge2, judge3, owner1, newOwner] = await ethers.getSigners();

    // Deploy NFT first
    const NFT = await ethers.getContractFactory("SafeLandNFT");
    nft = await upgrades.deployProxy(NFT, [admin.address], { kind: "uups" });
    await nft.waitForDeployment();

    // Deploy Justice
    const Justice = await ethers.getContractFactory("SafeLandJustice");
    justice = await upgrades.deployProxy(
      Justice,
      [admin.address, await nft.getAddress(), 2],
      { kind: "uups" }
    );
    await justice.waitForDeployment();

    // Grant roles
    const AGENT_ROLE = await nft.AGENT_ROLE();
    const JUSTICE_ROLE = await nft.JUSTICE_ROLE();
    const JUDGE_ROLE = await justice.JUDGE_ROLE();

    await nft.grantRole(AGENT_ROLE, admin.address);
    await nft.grantRole(JUSTICE_ROLE, await justice.getAddress());
    await justice.grantRole(JUDGE_ROLE, judge1.address);
    await justice.grantRole(JUDGE_ROLE, judge2.address);
    await justice.grantRole(JUDGE_ROLE, judge3.address);

    // Create a test property
    await nft.createProperty(
      owner1.address,
      "TF-JUSTICE-001",
      "residential",
      200,
      "Casablanca",
      "Anfa",
      335731,
      -75898,
      "ipfs://test-justice",
      ethers.keccak256(ethers.toUtf8Bytes("doc-justice"))
    );
  });

  describe("Proposition d'action", function () {
    it("devrait permettre a un juge de proposer une action de gel", async function () {
      const tx = await justice.connect(judge1).proposeAction(
        1,
        ethers.ZeroAddress,
        ethers.keccak256(ethers.toUtf8Bytes("jugement-gel")),
        "",
        0 // Freeze
      );
      await expect(tx).to.emit(justice, "ActionProposed");

      // actionId = 1 (counter increments before assignment)
      // getAction returns: (tokenId, newOwner, judgmentHash, actionType, signatures, executed)
      const action = await justice.getAction(1);
      expect(action[0]).to.equal(1);                    // tokenId
      expect(action[1]).to.equal(ethers.ZeroAddress);   // newOwner
      expect(action[3]).to.equal(0);                    // actionType = Freeze
      expect(action[4]).to.equal(1);                    // signatures (proposer auto-signs)
      expect(action[5]).to.equal(false);                // executed
    });

    it("devrait refuser un non-juge de proposer", async function () {
      await expect(
        justice.connect(owner1).proposeAction(1, ethers.ZeroAddress, ethers.ZeroHash, "", 0)
      ).to.be.reverted;
    });

    it("devrait compter le total des actions", async function () {
      expect(await justice.totalActions()).to.equal(0);
      await justice.connect(judge1).proposeAction(1, ethers.ZeroAddress, ethers.ZeroHash, "", 0);
      expect(await justice.totalActions()).to.equal(1);
    });
  });

  describe("Signature multi-sig", function () {
    beforeEach(async function () {
      await justice.connect(judge1).proposeAction(
        1, newOwner.address,
        ethers.keccak256(ethers.toUtf8Bytes("jugement")),
        "ipfs://new-uri", 1 // BurnRemint
      );
    });

    it("devrait permettre a un second juge de signer", async function () {
      const tx = await justice.connect(judge2).signAction(1);
      await expect(tx).to.emit(justice, "ActionSigned");

      const action = await justice.getAction(1);
      expect(action[4]).to.equal(2); // signatures = 2
    });

    it("devrait refuser la double signature", async function () {
      // judge1 already auto-signed when proposing
      await expect(
        justice.connect(judge1).signAction(1)
      ).to.be.revertedWith("Justice: already signed");
    });

    it("devrait refuser un non-juge de signer", async function () {
      await expect(
        justice.connect(owner1).signAction(1)
      ).to.be.reverted;
    });
  });

  describe("Execution d'action", function () {
    it("devrait executer un gel apres 2 signatures", async function () {
      // judge1 proposes (auto-signs => signatures = 1), actionId = 1
      await justice.connect(judge1).proposeAction(
        1, ethers.ZeroAddress,
        ethers.keccak256(ethers.toUtf8Bytes("gel")),
        "", 0 // Freeze
      );
      // judge2 signs => signatures = 2, meets threshold
      await justice.connect(judge2).signAction(1);

      const tx = await justice.connect(judge1).executeAction(1);
      await expect(tx).to.emit(justice, "ActionExecuted");

      const action = await justice.getAction(1);
      expect(action[5]).to.equal(true); // executed
    });

    it("devrait refuser l execution sans assez de signatures", async function () {
      await justice.connect(judge1).proposeAction(
        1, ethers.ZeroAddress, ethers.ZeroHash, "", 0
      );
      // Only 1 signature (proposer), need 2
      await expect(
        justice.connect(judge1).executeAction(1)
      ).to.be.revertedWith("Justice: not enough signatures");
    });

    it("devrait refuser l execution double", async function () {
      await justice.connect(judge1).proposeAction(
        1, ethers.ZeroAddress, ethers.ZeroHash, "", 0
      );
      await justice.connect(judge2).signAction(1);
      await justice.connect(judge1).executeAction(1);
      await expect(
        justice.connect(judge1).executeAction(1)
      ).to.be.revertedWith("Justice: already executed");
    });
  });

  describe("Recuperation sociale", function () {
    it("devrait creer une demande de recuperation par un juge", async function () {
      // judge1 has JUDGE_ROLE => authorized to requestRecovery
      const tx = await justice.connect(judge1).requestRecovery(1, newOwner.address);
      await expect(tx).to.emit(justice, "RecoveryRequested");

      const recovery = await justice.getRecovery(1);
      expect(recovery.tokenId).to.equal(1);
      expect(recovery.newWallet).to.equal(newOwner.address);
      expect(recovery.verifiedBy).to.equal(judge1.address);
      expect(recovery.executed).to.equal(false);
    });

    it("devrait refuser un non-autorise", async function () {
      await expect(
        justice.connect(owner1).requestRecovery(1, newOwner.address)
      ).to.be.revertedWith("Justice: not authorized");
    });
  });

  describe("Configuration", function () {
    it("devrait permettre de changer le seuil de signatures", async function () {
      await justice.setRequiredSignatures(3);
      expect(await justice.requiredSignatures()).to.equal(3);
    });

    it("devrait refuser un non-admin de changer le seuil", async function () {
      await expect(
        justice.connect(judge1).setRequiredSignatures(3)
      ).to.be.reverted;
    });

    it("devrait refuser un seuil a zero", async function () {
      await expect(
        justice.setRequiredSignatures(0)
      ).to.be.revertedWith("Justice: zero");
    });
  });

  describe("Couverture branches supplémentaires", function () {
    it("devrait executer un BurnRemint", async function () {
      await justice.connect(judge1).proposeAction(
        1, newOwner.address,
        ethers.keccak256(ethers.toUtf8Bytes("burn-remint")),
        "ipfs://new-uri", 1 // BurnRemint
      );
      await justice.connect(judge2).signAction(1);
      const tx = await justice.connect(judge1).executeAction(1);
      await expect(tx).to.emit(justice, "ActionExecuted");

      const action = await justice.getAction(1);
      expect(action[5]).to.equal(true); // executed
    });

    it("devrait executer un SocialRecovery", async function () {
      await justice.connect(judge1).proposeAction(
        1, newOwner.address,
        ethers.keccak256(ethers.toUtf8Bytes("recovery")),
        "ipfs://recovery-uri", 2 // SocialRecovery
      );
      await justice.connect(judge2).signAction(1);
      const tx = await justice.connect(judge1).executeAction(1);
      await expect(tx).to.emit(justice, "ActionExecuted");
    });

    it("devrait permettre un CONSERVATOR de demander une recuperation", async function () {
      const CONSERVATOR_ROLE = await justice.CONSERVATOR_ROLE();
      await justice.grantRole(CONSERVATOR_ROLE, owner1.address);

      const tx = await justice.connect(owner1).requestRecovery(1, newOwner.address);
      await expect(tx).to.emit(justice, "RecoveryRequested");
    });

    it("devrait refuser signAction sur une action deja executee", async function () {
      await justice.connect(judge1).proposeAction(
        1, ethers.ZeroAddress, ethers.ZeroHash, "", 0
      );
      await justice.connect(judge2).signAction(1);
      await justice.connect(judge1).executeAction(1);
      await expect(
        justice.connect(judge3).signAction(1)
      ).to.be.revertedWith("Justice: already executed");
    });

    it("devrait supporter l upgrade UUPS", async function () {
      const JusticeV2 = await ethers.getContractFactory("SafeLandJustice");
      const upgraded = await upgrades.upgradeProxy(await justice.getAddress(), JusticeV2);
      expect(await upgraded.totalActions()).to.equal(0);
    });

    // ─── Branches requestRecovery ─────────────────────────
    it("devrait refuser requestRecovery vers address(0)", async function () {
      await expect(
        justice.connect(judge1).requestRecovery(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Justice: zero address");
    });

    // ─── Branches executeAction ───────────────────────────
    it("devrait refuser executeAction par un non-juge", async function () {
      await justice.connect(judge1).proposeAction(
        1, ethers.ZeroAddress, ethers.ZeroHash, "", 0
      );
      await justice.connect(judge2).signAction(1);
      await expect(
        justice.connect(owner1).executeAction(1)
      ).to.be.reverted;
    });
  });
});
