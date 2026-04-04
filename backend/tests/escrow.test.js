/**
 * SafeLand Backend — Tests : Route Escrow
 *
 * Teste les endpoints /api/escrow/* avec mocking blockchain.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-escrow.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-escrow";

// ─── Mock blockchain ──────────────────────────────────────
jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    escrow: {
      createDeal: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xdeal",
          logs: [{ fragment: { name: "DealCreated" }, args: [1n] }],
        }),
      }),
      getDeal: jest.fn().mockResolvedValue({
        tokenId: 1n,
        seller: "0x0000000000000000000000000000000000000001",
        buyer: "0x0000000000000000000000000000000000000002",
        price: 10000000000000000000n, // 10 ETH
        status: 0n,
        notary: "0x0000000000000000000000000000000000000003",
        createdAt: 1700000000n,
      }),
      sellerSign: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xsign" }),
      }),
      buyerDeposit: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xdeposit" }),
      }),
      notaryComplete: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xcomplete" }),
      }),
      cancelDeal: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xcancel" }),
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
  app.use("/api/escrow", require("../src/routes/escrow"));
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

beforeAll(() => { app = createTestApp(); });

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

describe("Escrow API", function () {
  describe("POST /api/escrow (creer un deal)", function () {
    it("devrait creer un deal avec le role notary", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          seller: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          buyer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          price: 10,
        });
      expect(res.status).toBe(201);
      expect(res.body.dealId).toBe("1");
    });

    it("devrait refuser sans le role notary", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/escrow")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          seller: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          buyer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          price: 10,
        });
      expect(res.status).toBe(403);
    });

    it("devrait refuser avec des champs manquants", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow")
        .set("Authorization", `Bearer ${token}`)
        .send({ tokenId: 1 });
      expect(res.status).toBe(400);
    });

    it("devrait refuser une adresse seller invalide", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          seller: "invalid",
          buyer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          price: 10,
        });
      expect(res.status).toBe(400);
    });

    it("devrait refuser un prix negatif", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          seller: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          buyer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          price: -5,
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/escrow/:dealId", function () {
    it("devrait retourner les details d un deal", async function () {
      const res = await request(app).get("/api/escrow/1");
      expect(res.status).toBe(200);
      expect(res.body.dealId).toBe("1");
      expect(res.body.status).toBe("Created");
    });
  });

  describe("POST /api/escrow/:dealId/seller-sign", function () {
    it("devrait permettre la signature vendeur", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/escrow/1/seller-sign")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xsign");
    });

    it("devrait refuser sans auth", async function () {
      const res = await request(app).post("/api/escrow/1/seller-sign");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/escrow/:dealId/buyer-deposit", function () {
    it("devrait permettre le depot", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/escrow/1/buyer-deposit")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xdeposit");
    });
  });

  describe("POST /api/escrow/:dealId/notary-complete", function () {
    it("devrait permettre la finalisation par notaire", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow/1/notary-complete")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xcomplete");
    });

    it("devrait refuser par un non-notaire", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/escrow/1/notary-complete")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/escrow/:dealId/cancel", function () {
    it("devrait permettre l annulation par notaire", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/escrow/1/cancel")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xcancel");
    });
  });

  describe("GET /api/escrow/:dealId/fees", function () {
    it("devrait retourner la repartition fiscale", async function () {
      const res = await request(app).get("/api/escrow/1/fees");
      expect(res.status).toBe(200);
      expect(res.body.dgiPercent).toBe("4%");
      expect(res.body.ancfccPercent).toBe("1%");
      expect(res.body.sellerPercent).toBe("95%");
    });
  });
});
