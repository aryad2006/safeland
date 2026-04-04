/**
 * SafeLand Backend — Tests : Route Fridda (Succession)
 *
 * Teste les endpoints /api/fridda/* avec mocking blockchain.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-fridda.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-fridda";

// ─── Mock blockchain ──────────────────────────────────────
jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    fridda: {
      openSuccession: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xsuccession",
          logs: [{ fragment: { name: "SuccessionOpened" }, args: [1n] }],
        }),
      }),
      getDossier: jest.fn().mockResolvedValue({
        nftTokenId: 1n,
        totalShares: 24n,
        heirs: [
          "0x0000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000002",
        ],
        shares: [16n, 8n],
        distributed: false,
        finalized: false,
        adoulCid: "QmAdoul",
        notaryCid: "QmNotary",
      }),
      distributeShares: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xdistribute" }),
      }),
      finalizeSuccession: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xfinalize" }),
      }),
      createProposal: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xpropose",
          logs: [{ fragment: { name: "ProposalCreated" }, args: [1n] }],
        }),
      }),
      castVote: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xvote" }),
      }),
      getProposal: jest.fn().mockResolvedValue({
        dossierId: 1n,
        voteType: 0n,
        description: "Vente du bien",
        forVotes: 16n,
        againstVotes: 8n,
        quorumBps: 5000n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 86400),
        executed: false,
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
  app.use("/api/fridda", require("../src/routes/fridda"));
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

describe("Fridda API (Succession)", function () {
  describe("POST /api/fridda (ouvrir succession)", function () {
    it("devrait ouvrir un dossier avec le role notary", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nftTokenId: 1,
          heirs: [
            "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          ],
          shares: [16, 8],
        });
      expect(res.status).toBe(201);
      expect(res.body.dossierId).toBe("1");
    });

    it("devrait refuser sans le role notary", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/fridda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nftTokenId: 1,
          heirs: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
          shares: [24],
        });
      expect(res.status).toBe(403);
    });

    it("devrait refuser si heirs et shares de longueurs differentes", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nftTokenId: 1,
          heirs: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
          shares: [16, 8],
        });
      expect(res.status).toBe(400);
    });

    it("devrait refuser si total shares != 24", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nftTokenId: 1,
          heirs: [
            "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          ],
          shares: [10, 10],
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("24");
    });

    it("devrait refuser des heirs invalides", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nftTokenId: 1,
          heirs: ["invalid_address"],
          shares: [24],
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/fridda/:dossierId", function () {
    it("devrait retourner les details d un dossier", async function () {
      const res = await request(app).get("/api/fridda/1");
      expect(res.status).toBe(200);
      expect(res.body.totalShares).toBe("24");
      expect(res.body.heirs.length).toBe(2);
    });
  });

  describe("POST /api/fridda/:dossierId/distribute", function () {
    it("devrait distribuer les parts avec le role notary", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda/1/distribute")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xdistribute");
    });
  });

  describe("POST /api/fridda/:dossierId/finalize", function () {
    it("devrait finaliser avec le role notary", async function () {
      const token = await loginAs(WALLET, "notary");
      const res = await request(app)
        .post("/api/fridda/1/finalize")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.txHash).toBe("0xfinalize");
    });

    it("devrait refuser sans le bon role", async function () {
      const token = await loginAs(WALLET, "buyer");
      const res = await request(app)
        .post("/api/fridda/1/finalize")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/fridda/:dossierId/propose", function () {
    it("devrait creer une proposition de vente", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/fridda/1/propose")
        .set("Authorization", `Bearer ${token}`)
        .send({
          voteType: 0,
          description: "Vendre la propriete",
        });
      expect(res.status).toBe(201);
      expect(res.body.proposalId).toBe("1");
    });

    it("devrait refuser un voteType invalide", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/fridda/1/propose")
        .set("Authorization", `Bearer ${token}`)
        .send({
          voteType: 5,
          description: "Invalid",
        });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/fridda/:dossierId/vote/:proposalId", function () {
    it("devrait voter pour une proposition", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/fridda/1/vote/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ support: true });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("POUR");
    });

    it("devrait voter contre", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/fridda/1/vote/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ support: false });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("CONTRE");
    });

    it("devrait refuser sans le champ support", async function () {
      const token = await loginAs(WALLET, "owner");
      const res = await request(app)
        .post("/api/fridda/1/vote/1")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/fridda/:dossierId/proposal/:proposalId", function () {
    it("devrait retourner les details d une proposition", async function () {
      const res = await request(app).get("/api/fridda/1/proposal/1");
      expect(res.status).toBe(200);
      expect(res.body.voteType).toBe("Sell");
      expect(res.body.forVotes).toBe("16");
      expect(res.body.againstVotes).toBe("8");
    });
  });
});
