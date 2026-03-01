const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SafeLandTimelock", function () {
  let timelock;
  let mockTarget;
  let admin, proposer, executor, canceller, other;

  const PROPOSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PROPOSER_ROLE"));
  const EXECUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("EXECUTOR_ROLE"));
  const CANCELLER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CANCELLER_ROLE"));
  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));

  const ONE_DAY = 86400;
  const TWO_DAYS = 2 * ONE_DAY;
  const SALT = ethers.keccak256(ethers.toUtf8Bytes("salt-1"));

  beforeEach(async function () {
    [admin, proposer, executor, canceller, other] = await ethers.getSigners();

    // Deploy a mock target contract (simple counter)
    const MockTarget = await ethers.getContractFactory("MockTimelockTarget");
    mockTarget = await MockTarget.deploy();
    await mockTarget.waitForDeployment();

    // Deploy timelock
    const SafeLandTimelock = await ethers.getContractFactory("SafeLandTimelock");
    timelock = await upgrades.deployProxy(
      SafeLandTimelock,
      [admin.address, [proposer.address], [executor.address]],
      { initializer: "initialize" }
    );
    await timelock.waitForDeployment();

    // Grant canceller role
    await timelock.connect(admin).grantRole(CANCELLER_ROLE, canceller.address);
  });

  // ─── Helpers ────────────────────────────────────────────
  function encodeSetValue(value) {
    return mockTarget.interface.encodeFunctionData("setValue", [value]);
  }

  async function scheduleOperation(delay = ONE_DAY, value = 42, salt = SALT) {
    const data = encodeSetValue(value);
    const target = await mockTarget.getAddress();
    const tx = await timelock.connect(proposer).schedule(
      target, 0, data, salt, delay, "Set value to " + value
    );
    const receipt = await tx.wait();
    const operationId = await timelock.hashOperation(target, 0, data, salt);
    return { operationId, data, target };
  }

  // ═══════════════════════════════════════════════════════
  // Initialisation
  // ═══════════════════════════════════════════════════════
  describe("Initialisation", function () {
    it("devrait assigner les rôles correctement", async function () {
      expect(await timelock.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
      expect(await timelock.hasRole(PROPOSER_ROLE, proposer.address)).to.be.true;
      expect(await timelock.hasRole(EXECUTOR_ROLE, executor.address)).to.be.true;
      expect(await timelock.hasRole(CANCELLER_ROLE, canceller.address)).to.be.true;
      expect(await timelock.hasRole(CANCELLER_ROLE, admin.address)).to.be.true;
    });

    it("ne devrait pas permettre une double initialisation", async function () {
      await expect(
        timelock.initialize(admin.address, [], [])
      ).to.be.reverted;
    });

    it("devrait avoir les constantes correctes", async function () {
      expect(await timelock.MIN_DELAY()).to.equal(ONE_DAY);
      expect(await timelock.MAX_DELAY()).to.equal(30 * ONE_DAY);
      expect(await timelock.GRACE_PERIOD()).to.equal(14 * ONE_DAY);
    });
  });

  // ═══════════════════════════════════════════════════════
  // Schedule
  // ═══════════════════════════════════════════════════════
  describe("Schedule", function () {
    it("devrait planifier une opération avec succès", async function () {
      const { operationId } = await scheduleOperation();

      expect(await timelock.isOperationPending(operationId)).to.be.true;
      expect(await timelock.isOperationReady(operationId)).to.be.false;
      expect(await timelock.isOperationDone(operationId)).to.be.false;
      expect(await timelock.operationCount()).to.equal(1);
    });

    it("devrait émettre OperationScheduled", async function () {
      const data = encodeSetValue(99);
      const target = await mockTarget.getAddress();

      await expect(
        timelock.connect(proposer).schedule(
          target, 0, data, SALT, ONE_DAY, "Set 99"
        )
      ).to.emit(timelock, "OperationScheduled");
    });

    it("devrait rejeter un délai trop court", async function () {
      const data = encodeSetValue(1);
      const target = await mockTarget.getAddress();

      await expect(
        timelock.connect(proposer).schedule(
          target, 0, data, SALT, 100, "Too fast"
        )
      ).to.be.revertedWithCustomError(timelock, "TimelockInvalidDelay");
    });

    it("devrait rejeter un délai trop long", async function () {
      const data = encodeSetValue(1);
      const target = await mockTarget.getAddress();

      await expect(
        timelock.connect(proposer).schedule(
          target, 0, data, SALT, 31 * ONE_DAY, "Too slow"
        )
      ).to.be.revertedWithCustomError(timelock, "TimelockInvalidDelay");
    });

    it("devrait rejeter les propositions dupliquées", async function () {
      await scheduleOperation(ONE_DAY, 42, SALT);

      const data = encodeSetValue(42);
      const target = await mockTarget.getAddress();

      await expect(
        timelock.connect(proposer).schedule(
          target, 0, data, SALT, ONE_DAY, "Duplicate"
        )
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationAlreadyScheduled");
    });

    it("devrait rejeter si non-PROPOSER", async function () {
      const data = encodeSetValue(1);
      const target = await mockTarget.getAddress();

      await expect(
        timelock.connect(other).schedule(
          target, 0, data, SALT, ONE_DAY, "Unauthorized"
        )
      ).to.be.reverted;
    });
  });

  // ═══════════════════════════════════════════════════════
  // Execute
  // ═══════════════════════════════════════════════════════
  describe("Execute", function () {
    it("devrait exécuter après le délai", async function () {
      const { operationId, data, target } = await scheduleOperation(ONE_DAY, 77);

      // Avancer le temps
      await time.increase(ONE_DAY + 1);

      expect(await timelock.isOperationReady(operationId)).to.be.true;

      await timelock.connect(executor).execute(target, 0, data, SALT);

      expect(await mockTarget.value()).to.equal(77);
      expect(await timelock.isOperationDone(operationId)).to.be.true;
    });

    it("devrait émettre OperationExecuted", async function () {
      const { data, target } = await scheduleOperation(ONE_DAY, 55);

      await time.increase(ONE_DAY + 1);

      await expect(
        timelock.connect(executor).execute(target, 0, data, SALT)
      ).to.emit(timelock, "OperationExecuted");
    });

    it("devrait rejeter si le délai n'est pas écoulé", async function () {
      const { data, target } = await scheduleOperation(TWO_DAYS, 10);

      // Avancer seulement 1 jour (pas assez)
      await time.increase(ONE_DAY);

      await expect(
        timelock.connect(executor).execute(target, 0, data, SALT)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationNotReady");
    });

    it("devrait rejeter si le grace period est dépassé", async function () {
      const { data, target } = await scheduleOperation(ONE_DAY, 10);

      // Avancer au-delà du grace period (1 jour + 14 jours + 1)
      await time.increase(ONE_DAY + 14 * ONE_DAY + 1);

      await expect(
        timelock.connect(executor).execute(target, 0, data, SALT)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationExpired");
    });

    it("devrait rejeter si non-EXECUTOR", async function () {
      const { data, target } = await scheduleOperation(ONE_DAY, 10);

      await time.increase(ONE_DAY + 1);

      await expect(
        timelock.connect(other).execute(target, 0, data, SALT)
      ).to.be.reverted;
    });

    it("devrait rejeter une opération non planifiée", async function () {
      const data = encodeSetValue(99);
      const target = await mockTarget.getAddress();
      const fakeSalt = ethers.keccak256(ethers.toUtf8Bytes("fake"));

      await expect(
        timelock.connect(executor).execute(target, 0, data, fakeSalt)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationNotPending");
    });

    it("devrait rejeter la double exécution", async function () {
      const { data, target } = await scheduleOperation(ONE_DAY, 33);

      await time.increase(ONE_DAY + 1);

      await timelock.connect(executor).execute(target, 0, data, SALT);

      await expect(
        timelock.connect(executor).execute(target, 0, data, SALT)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationNotPending");
    });
  });

  // ═══════════════════════════════════════════════════════
  // Cancel
  // ═══════════════════════════════════════════════════════
  describe("Cancel", function () {
    it("devrait annuler une opération en attente", async function () {
      const { operationId } = await scheduleOperation();

      await timelock.connect(canceller).cancel(operationId);

      expect(await timelock.isOperationPending(operationId)).to.be.false;
    });

    it("devrait émettre OperationCancelled", async function () {
      const { operationId } = await scheduleOperation();

      await expect(
        timelock.connect(canceller).cancel(operationId)
      ).to.emit(timelock, "OperationCancelled").withArgs(operationId);
    });

    it("devrait rejeter si non-CANCELLER", async function () {
      const { operationId } = await scheduleOperation();

      await expect(
        timelock.connect(other).cancel(operationId)
      ).to.be.reverted;
    });

    it("devrait rejeter l'annulation d'une opération non-pending", async function () {
      const fakeSalt = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      const fakeOpId = await timelock.hashOperation(admin.address, 0, "0x", fakeSalt);

      await expect(
        timelock.connect(canceller).cancel(fakeOpId)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationNotPending");
    });

    it("devrait empêcher l'exécution d'une opération annulée", async function () {
      const { operationId, data, target } = await scheduleOperation();

      await timelock.connect(canceller).cancel(operationId);

      await time.increase(ONE_DAY + 1);

      await expect(
        timelock.connect(executor).execute(target, 0, data, SALT)
      ).to.be.revertedWithCustomError(timelock, "TimelockOperationNotPending");
    });
  });

  // ═══════════════════════════════════════════════════════
  // Views
  // ═══════════════════════════════════════════════════════
  describe("Views", function () {
    it("hashOperation devrait être déterministe", async function () {
      const data = encodeSetValue(42);
      const target = await mockTarget.getAddress();

      const hash1 = await timelock.hashOperation(target, 0, data, SALT);
      const hash2 = await timelock.hashOperation(target, 0, data, SALT);

      expect(hash1).to.equal(hash2);
    });

    it("getOperation devrait retourner les détails", async function () {
      const { operationId } = await scheduleOperation(ONE_DAY, 42);

      const op = await timelock.getOperation(operationId);
      expect(op.target).to.equal(await mockTarget.getAddress());
      expect(op.status).to.equal(1); // Pending
      expect(op.proposer).to.equal(proposer.address);
      expect(op.description).to.equal("Set value to 42");
    });
  });

  // ═══════════════════════════════════════════════════════
  // ETH Handling
  // ═══════════════════════════════════════════════════════
  describe("ETH Handling", function () {
    it("devrait recevoir de l'ETH", async function () {
      const timelockAddr = await timelock.getAddress();

      await admin.sendTransaction({
        to: timelockAddr,
        value: ethers.parseEther("1.0"),
      });

      const balance = await ethers.provider.getBalance(timelockAddr);
      expect(balance).to.equal(ethers.parseEther("1.0"));
    });
  });

  // ═══════════════════════════════════════════════════════
  // UUPS Upgrade
  // ═══════════════════════════════════════════════════════
  describe("UUPS Upgrade", function () {
    it("devrait rejeter l'upgrade par un non-admin", async function () {
      const SafeLandTimelockV2 = await ethers.getContractFactory("SafeLandTimelock", other);

      await expect(
        upgrades.upgradeProxy(await timelock.getAddress(), SafeLandTimelockV2)
      ).to.be.reverted;
    });
  });
});
