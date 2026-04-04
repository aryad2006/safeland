/**
 * SafeLand Backend — Tests : Route Justice
 *
 * Teste les endpoints /api/justice/* avec mocking blockchain.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-justice.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-justice";

// ─── Mock blockchain ──────────────────────────────────────
jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    justice: {
      proposeAction: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xpropose",
          logs: [{ fragment: { name: "ActionProposed" }, args: [1n] }],
        }),
      }),
      getAction: jest.fn().mockResolvedValue([
        1n,                                                    // tokenId
        "0x0000000000000000000000000000000000000042",           // newOwner
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // judgmentHash
        0n,                                                    // actionType (Freeze)
        2n,                                                    // signatures
        false,                                                 // executed
      ]),
      signAction: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xsign" }),
      }),
      executeAction: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xexec" }),
      }),
      requestRecovery: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xrecovery",
          logs: [{ fragment: { name: "RecoveryRequested" }, args: [1n] }],
        }),
      }),
      getRecovery: jest.fn().mockResolvedValue({
        tokenId: 1n,
        currentOwner: "0x0000000000000000000000000000000000000001",
        newWallet: "0x0000000000000000000000000000000000000042",
        verifiedBy: "0x0000000000000000000000000000000000000099",
        executed: false,
        createdAt: 1700000000n,
      }),
      totalActions: jest.fn().mockResolvedValue(5n),
      requiredSignatures: jest.fn().mockResolvedValue(2n),
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
  app.use("/api/justice", require("../src/routes/justice"));
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

describe("Justice API", function () {
  describe("POST /api/justice/actions (proposer une action)", function () {
    it("devrait proposer un gel avec le role judge", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          judgmentHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          actionType: 0,
        });
      expect(res.status).toBe(201);
      expect(res.body.actionId).toBe("1");
    });

    it("devrait proposer un BurnRemint avec newOwner", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          judgmentHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          actionType: 1,
          newOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          newUri: "ipfs://QmNew",
        });
      expect(res.status).toBe(201);
    });

    it("devrait refuser sans le role judge", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/justice/actions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          judgmentHash: "0x1234",
          actionType: 0,
        });
      expect(res.status).toBe(403);
    });

    it("devrait refuser avec un actionType invalide", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          judgmentHash: "0x1234",
          actionType: 5,
        });
      expect(res.status).toBe(400);
    });

    it("devrait refuser sans tokenId", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          judgmentHash: "0x1234",
          actionType: 0,
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/justice/actions/:actionId", function () {
    it("devrait retourner les details d une action", async function () {
      const res = await request(app).get("/api/justice/actions/1");
      expect(res.status).toBe(200);
      expect(res.body.actionType).toBe("Freeze");
      expect(res.body.signatures).toBe(2);
      expect(res.body.executed).toBe(false);
    });
  });

  describe("POST /api/justice/actions/:actionId/sign", function () {
    it("devrait signer une action avec le role judge", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions/1/sign")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xsign");
    });

    it("devrait refuser sans le role judge", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/justice/actions/1/sign")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/justice/actions/:actionId/execute", function () {
    it("devrait executer une action avec le role judge", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/actions/1/execute")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xexec");
    });
  });

  describe("POST /api/justice/recovery", function () {
    it("devrait creer une demande de recovery", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/recovery")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          newWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        });
      expect(res.status).toBe(201);
      expect(res.body.recoveryId).toBe("1");
    });

    it("devrait refuser sans le role judge/conservator", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/justice/recovery")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tokenId: 1,
          newWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        });
      expect(res.status).toBe(403);
    });

    it("devrait refuser avec newWallet invalide", async function () {
      const token = await loginAs(WALLET, "judge");
      const res = await request(app)
        .post("/api/justice/recovery")
        .set("Authorization", `Bearer ${token}`)
        .send({ tokenId: 1, newWallet: "invalid" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/justice/recovery/:recoveryId", function () {
    it("devrait retourner les details d une recovery", async function () {
      const res = await request(app).get("/api/justice/recovery/1");
      expect(res.status).toBe(200);
      expect(res.body.executed).toBe(false);
      expect(res.body.newWallet).toBeDefined();
    });
  });

  describe("GET /api/justice/stats", function () {
    it("devrait retourner les statistiques judiciaires", async function () {
      const res = await request(app).get("/api/justice/stats");
      expect(res.status).toBe(200);
      expect(res.body.totalActions).toBe(5);
      expect(res.body.requiredSignatures).toBe(2);
    });
  });
});
