/**
 * SafeLand Backend — Tests : Route Properties
 *
 * Teste la validation et l'authentification des endpoints /api/properties/*.
 * Les appels blockchain sont mockes via jest.mock.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-properties.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-properties";

// ─── Mock blockchain ──────────────────────────────────────
jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    nft: {
      createProperty: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xtx123",
          logs: [{ fragment: { name: "PropertyCreated" }, args: [1n] }],
        }),
      }),
      getPropertyData: jest.fn().mockResolvedValue({
        titreFoncier: "TF-001/R",
        surface: 200n,
        propertyType: "villa",
        city: "Casablanca",
        gpsCoords: "33.57,-7.58",
        documentHash: "0x1234",
        createdAt: 1700000000n,
      }),
      ownerOf: jest.fn().mockResolvedValue("0x0000000000000000000000000000000000000042"),
      isLocked: jest.fn().mockResolvedValue(false),
      getTransactionHistory: jest.fn().mockResolvedValue([]),
      transferProperty: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xtransfer" }),
      }),
      setTravelLock: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xlock" }),
      }),
      addEncumbrance: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xenc" }),
      }),
      removeEncumbrance: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xremenc" }),
      }),
    },
    registry: {
      registerProperty: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
      getPropertiesByCity: jest.fn().mockResolvedValue([1n, 2n]),
      getPropertiesByOwner: jest.fn().mockResolvedValue([1n]),
      getGlobalStats: jest.fn().mockResolvedValue({
        totalProperties: 10n,
        totalTransactions: 5n,
        fraudPrevented: 1n,
        justiceOverrides: 0n,
      }),
    },
  }),
}));

const request = require("supertest");
const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("../src/config/database");

function createTestApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", require("../src/routes/auth"));
  app.use("/api/properties", require("../src/routes/properties"));
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  return app;
}

let app;
const WALLET = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

async function loginAs(wallet, role) {
  if (role && role !== "owner") {
    db.createOrGetUser(wallet.address.toLowerCase(), role);
    db.updateUserRole(wallet.address.toLowerCase(), role);
  }
  const nonceRes = await request(app)
    .post("/api/auth/nonce")
    .send({ address: wallet.address });
  const signature = await wallet.signMessage(nonceRes.body.nonce);
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ address: wallet.address, signature });
  return loginRes.body.token;
}

beforeAll(() => {
  app = createTestApp();
});

beforeEach(() => {
  const d = db.getDb();
  d.exec("DELETE FROM nonces");
  d.exec("DELETE FROM users");
  d.exec("DELETE FROM audit_log");
});

afterAll(() => {
  db.close();
  [TEST_DB_PATH, TEST_DB_PATH + "-wal", TEST_DB_PATH + "-shm"].forEach((f) => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
});

describe("Properties API", function () {
  describe("POST /api/properties (creer un titre)", function () {
    it("devrait creer un titre avec le role agent", async function () {
      const token = await loginAs(WALLET, "agent");
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          titreFoncier: "TF-001/R",
          surface: 200,
          propertyType: "villa",
          city: "Casablanca",
          gpsCoords: "33.57,-7.58",
          documentHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        });
      expect(res.status).toBe(201);
      expect(res.body.tokenId).toBeDefined();
      expect(res.body.txHash).toBe("0xtx123");
    });

    it("devrait refuser sans authentification", async function () {
      const res = await request(app)
        .post("/api/properties")
        .send({
          to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          titreFoncier: "TF-001",
          surface: 200,
          propertyType: "villa",
          city: "Casablanca",
          gpsCoords: "33.57,-7.58",
          documentHash: "QmTest",
        });
      expect(res.status).toBe(401);
    });

    it("devrait refuser avec un role non autorise (buyer)", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          titreFoncier: "TF-001",
          surface: 200,
          propertyType: "villa",
          city: "Casablanca",
          gpsCoords: "33.57,-7.58",
          documentHash: "QmTest",
        });
      expect(res.status).toBe(403);
    });

    it("devrait refuser avec des champs manquants", async function () {
      const token = await loginAs(WALLET, "agent");
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({ to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" });
      expect(res.status).toBe(400);
      expect(res.body.details).toBeDefined();
    });

    it("devrait refuser une adresse to invalide", async function () {
      const token = await loginAs(WALLET, "agent");
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          to: "invalid",
          titreFoncier: "TF-001",
          surface: 200,
          propertyType: "villa",
          city: "Casablanca",
          gpsCoords: "33.57,-7.58",
          documentHash: "QmTest",
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/properties/:tokenId", function () {
    it("devrait retourner les details d un titre", async function () {
      const res = await request(app).get("/api/properties/1");
      expect(res.status).toBe(200);
      expect(res.body.tokenId).toBe("1");
      expect(res.body.titreFoncier).toBe("TF-001/R");
    });
  });

  describe("GET /api/properties (recherche)", function () {
    it("devrait retourner les stats globales sans filtre", async function () {
      const res = await request(app).get("/api/properties");
      expect(res.status).toBe(200);
      expect(res.body.totalProperties).toBe("10");
    });

    it("devrait rechercher par ville", async function () {
      const res = await request(app).get("/api/properties?city=Casablanca");
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.tokenIds).toEqual(["1", "2"]);
    });

    it("devrait rechercher par proprietaire", async function () {
      const res = await request(app).get("/api/properties?owner=0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
    });

    it("devrait retourner les stats si city est vide (pas de filtre)", async function () {
      const res = await request(app).get("/api/properties?city=");
      // city="" est falsy → tombe dans le else (stats globales)
      expect(res.status).toBe(200);
      expect(res.body.totalProperties).toBeDefined();
    });

    it("devrait refuser une city avec espaces seulement", async function () {
      const res = await request(app).get("/api/properties?city=%20%20");
      expect(res.status).toBe(400);
    });

    it("devrait refuser un owner invalide", async function () {
      const res = await request(app).get("/api/properties?owner=invalid");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/properties/:tokenId/lock", function () {
    it("devrait activer le travel lock", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/properties/1/lock")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Lock");
    });

    it("devrait refuser sans auth", async function () {
      const res = await request(app).post("/api/properties/1/lock");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/properties/:tokenId/unlock", function () {
    it("devrait desactiver le travel lock", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/properties/1/unlock")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/properties/:tokenId/encumbrance", function () {
    it("devrait ajouter une charge avec le role notary", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/properties/1/encumbrance")
        .set("Authorization", `Bearer ${token}`)
        .send({
          encumbranceType: "hypotheque",
          description: "Pret immobilier",
          documentHash: "QmHypoteque123",
        });
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xenc");
    });

    it("devrait refuser avec un role non autorise", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/properties/1/encumbrance")
        .set("Authorization", `Bearer ${token}`)
        .send({
          encumbranceType: "hypotheque",
          description: "Pret",
          documentHash: "QmTest",
        });
      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/properties/:tokenId/encumbrance/:index", function () {
    it("devrait lever une charge", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .delete("/api/properties/1/encumbrance/0")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
