const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SafeLandRegistry", function () {
  let registry;
  let admin, operator, user;

  beforeEach(async function () {
    [admin, operator, user] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("SafeLandRegistry");
    registry = await upgrades.deployProxy(Registry, [admin.address], { kind: "uups" });
    await registry.waitForDeployment();

    const OPERATOR_ROLE = await registry.OPERATOR_ROLE();
    await registry.grantRole(OPERATOR_ROLE, operator.address);
  });

  describe("Enregistrement de propriétés", function () {
    it("devrait enregistrer une propriété", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      const byCity = await registry.getByCity("Casablanca");
      expect(byCity.length).to.equal(1);
      expect(byCity[0]).to.equal(0);
    });

    it("devrait retrouver par propriétaire", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      await registry.connect(operator).registerProperty(1, "Rabat", "commercial", user.address);
      const byOwner = await registry.getByOwner(user.address);
      expect(byOwner.length).to.equal(2);
    });

    it("devrait retrouver par type", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      await registry.connect(operator).registerProperty(1, "Fès", "residential", admin.address);
      const byType = await registry.getByType("residential");
      expect(byType.length).to.equal(2);
    });

    it("devrait incrémenter le compteur de propriétés", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      const stats = await registry.getStats();
      expect(stats.totalProperties).to.equal(1);
    });
  });

  describe("Transactions", function () {
    it("devrait enregistrer une transaction", async function () {
      await registry.connect(operator).recordTransaction(0, admin.address, user.address, "sale");
      const stats = await registry.getStats();
      expect(stats.totalTransactions).to.equal(1);
    });

    it("devrait enregistrer plusieurs transactions", async function () {
      await registry.connect(operator).recordTransaction(0, admin.address, user.address, "sale");
      await registry.connect(operator).recordTransaction(1, user.address, admin.address, "transfer");
      const stats = await registry.getStats();
      expect(stats.totalTransactions).to.equal(2);
    });
  });

  describe("Prévention de fraude", function () {
    it("devrait enregistrer une fraude prévenue", async function () {
      await registry.connect(operator).recordFraudPrevented(0, "Double vente détectée");
      const stats = await registry.getStats();
      expect(stats.fraudAttemptsPrevented).to.equal(1);
    });
  });

  describe("Statistiques globales", function () {
    it("devrait retourner des stats complètes", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      await registry.connect(operator).registerProperty(1, "Rabat", "commercial", admin.address);
      await registry.connect(operator).recordTransaction(0, admin.address, user.address, "sale");
      await registry.connect(operator).recordFraudPrevented(0, "Fraude");

      const stats = await registry.getStats();
      expect(stats.totalProperties).to.equal(2);
      expect(stats.totalTransactions).to.equal(1);
      expect(stats.fraudAttemptsPrevented).to.equal(1);
    });
  });

  describe("Contrôle d'accès", function () {
    it("devrait refuser un non-opérateur", async function () {
      await expect(
        registry.connect(user).registerProperty(0, "Casablanca", "residential", user.address)
      ).to.be.reverted;
    });
  });
});
