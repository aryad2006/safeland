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

  describe("Couverture branches supplémentaires", function () {
    it("devrait enregistrer un justice_override dans les stats", async function () {
      await registry.connect(operator).registerProperty(0, "Casablanca", "residential", user.address);
      await registry.connect(operator).recordTransaction(0, user.address, admin.address, "justice_override");
      const stats = await registry.getStats();
      expect(stats.justicOverrides).to.equal(1);
    });

    it("devrait retirer le token du propriétaire lors d un transfer", async function () {
      // Enregistrer user comme proprio du token 10
      await registry.connect(operator).registerProperty(10, "Rabat", "residential", user.address);
      let byOwner = await registry.getByOwner(user.address);
      expect(byOwner.length).to.equal(1);

      // Transférer token 10 de user à admin
      await registry.connect(operator).recordTransaction(10, user.address, admin.address, "sale");

      // user n'a plus le token
      byOwner = await registry.getByOwner(user.address);
      expect(byOwner.length).to.equal(0);

      // admin a le token
      const byNewOwner = await registry.getByOwner(admin.address);
      expect(byNewOwner).to.include(10n);
    });

    it("devrait supporter l upgrade UUPS", async function () {
      const RegistryV2 = await ethers.getContractFactory("SafeLandRegistry");
      const upgraded = await upgrades.upgradeProxy(await registry.getAddress(), RegistryV2);
      const stats = await upgraded.getStats();
      expect(stats.totalProperties).to.equal(0);
    });

    it("devrait refuser recordFraudPrevented par un non-opérateur", async function () {
      await expect(
        registry.connect(user).recordFraudPrevented(0, "test")
      ).to.be.reverted;
    });

    it("devrait refuser recordTransaction par un non-opérateur", async function () {
      await expect(
        registry.connect(user).recordTransaction(0, admin.address, user.address, "sale")
      ).to.be.reverted;
    });

    // ─── Branch _removeFromOwner quand tokenId absent ─────
    it("devrait supporter recordTransaction quand from n a pas le token dans l index", async function () {
      // recordTransaction sans registerProperty au préalable
      // _removeFromOwner ne trouvera rien mais ne doit pas revert
      await registry.connect(operator).recordTransaction(999, user.address, admin.address, "transfer");
      const stats = await registry.getStats();
      expect(stats.totalTransactions).to.equal(1);
    });

    it("devrait gérer un txType non justice_override sans incrémenter justicOverrides", async function () {
      await registry.connect(operator).recordTransaction(0, admin.address, user.address, "inheritance");
      const stats = await registry.getStats();
      expect(stats.totalTransactions).to.equal(1);
      expect(stats.justicOverrides).to.equal(0);
    });

    it("devrait gérer _removeFromOwner quand le token n est pas dans la liste du propriétaire", async function () {
      // user a le token 10 mais on transfère le token 999 (absent)
      await registry.connect(operator).registerProperty(10, "Rabat", "residential", user.address);
      await registry.connect(operator).registerProperty(20, "Fès", "commercial", user.address);
      // Transférer un token que user n'a PAS (token 999) — loop complète sans match
      await registry.connect(operator).recordTransaction(999, user.address, admin.address, "sale");
      // user a toujours ses 2 tokens
      const byOwner = await registry.getByOwner(user.address);
      expect(byOwner.length).to.equal(2);
    });
  });
});
