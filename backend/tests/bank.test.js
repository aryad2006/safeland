/**
 * SafeLand Backend — Tests : Route Bank B2B
 *
 * Teste la validation et l'authentification des endpoints /api/bank/*.
 * Les appels blockchain sont mockés via jest.mock.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-bank.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-bank";

// ─── Mock blockchain ──────────────────────────────────────
const MOCK_PROPERTY = {
  titreFoncier: "TF-001/CASA",
  owner: "0x0000000000000000000000000000000000000042",
  validator: "0x0000000000000000000000000000000000000001",
  frozen: false,
  locked: false,
  burned: false,
};
const MOCK_ENCUMBRANCES = [
  {
    encType: "hypotheque",
    creditor: "0x0000000000000000000000000000000000000099",
    amount: BigInt("1000000000000000000"), // 1 ETH
    startDate: BigInt(1700000000),
    endDate: BigInt(0),
    isActive: true,
  },
];
const MOCK_HISTORY = [
  { txType: "Mint", from: "0x0000000000000000000000000000000000000000", to: MOCK_PROPERTY.owner, timestamp: BigInt(1700000000) },
  { txType: "Transfer", from: MOCK_PROPERTY.owner, to: MOCK_PROPERTY.owner, timestamp: BigInt(1710000000) },
];

jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    nft: {
      addEncumbrance: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xhypo" }),
      }),
      removeEncumbrance: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xmainlevee" }),
      }),
      getProperty: jest.fn().mockResolvedValue(MOCK_PROPERTY),
      getEncumbrances: jest.fn().mockResolvedValue(MOCK_ENCUMBRANCES),
      getHistory: jest.fn().mockResolvedValue(MOCK_HISTORY),
      canTransfer: jest.fn().mockResolvedValue(false), // locked by hypotheque
      isFrozenByJustice: jest.fn().mockResolvedValue(false),
      isLocked: jest.fn().mockResolvedValue(true),
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
  app.use("/api/bank", require("../src/routes/bank"));
  return app;
}

let app;
const WALLET = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
const WALLET2 = new ethers.Wallet(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
);

async function getToken(wallet, role) {
  db.createOrGetUser(wallet.address.toLowerCase(), role);
  db.updateUserRole(wallet.address.toLowerCase(), role);

  const nonceRes = await request(app)
    .post("/api/auth/nonce")
    .send({ address: wallet.address });
  const { nonce } = nonceRes.body;

  const signature = await wallet.signMessage(nonce);

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

// ─────────────────────────────────────────────────────────
// POST /api/bank/hypotheque
// ─────────────────────────────────────────────────────────
describe("POST /api/bank/hypotheque", () => {
  it("exige authentification", async () => {
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .send({ tokenId: 1, creditor: WALLET.address, amount: 10 });
    expect(res.status).toBe(401);
  });

  it("exige rôle bank ou admin (refuse owner)", async () => {
    const token = await getToken(WALLET2, "owner");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, creditor: WALLET.address, amount: 10 });
    expect(res.status).toBe(403);
  });

  it("rejette un tokenId invalide (chaîne)", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: "abc", creditor: WALLET.address, amount: 10 });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/tokenId/);
  });

  it("rejette une adresse creditor invalide", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, creditor: "not-an-address", amount: 10 });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/creditor/);
  });

  it("rejette un amount négatif", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, creditor: WALLET.address, amount: -5 });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/amount/);
  });

  it("inscrit une hypothèque valide (rôle bank)", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, creditor: WALLET.address, amount: 50 });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Hypothèque inscrite/);
    expect(res.body.txHash).toBe("0xhypo");
  });

  it("inscrit une hypothèque valide (rôle admin)", async () => {
    const token = await getToken(WALLET, "admin");
    const res = await request(app)
      .post("/api/bank/hypotheque")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 2, creditor: WALLET.address, amount: 100, endDate: 2000000000 });
    expect(res.status).toBe(201);
    expect(res.body.endDate).toBe(2000000000);
  });
});

// ─────────────────────────────────────────────────────────
// POST /api/bank/mainlevee
// ─────────────────────────────────────────────────────────
describe("POST /api/bank/mainlevee", () => {
  it("exige authentification", async () => {
    const res = await request(app)
      .post("/api/bank/mainlevee")
      .send({ tokenId: 1, encumbranceIndex: 0 });
    expect(res.status).toBe(401);
  });

  it("rejette un encumbranceIndex négatif", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/mainlevee")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, encumbranceIndex: -1 });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/encumbranceIndex/);
  });

  it("rejette un tokenId manquant", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/mainlevee")
      .set("Authorization", `Bearer ${token}`)
      .send({ encumbranceIndex: 0 });
    expect(res.status).toBe(400);
  });

  it("lève une hypothèque valide", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .post("/api/bank/mainlevee")
      .set("Authorization", `Bearer ${token}`)
      .send({ tokenId: 1, encumbranceIndex: 0 });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Mainlevée/);
    expect(res.body.txHash).toBe("0xmainlevee");
  });
});

// ─────────────────────────────────────────────────────────
// GET /api/bank/score/:tokenId
// ─────────────────────────────────────────────────────────
describe("GET /api/bank/score/:tokenId", () => {
  it("exige authentification", async () => {
    const res = await request(app).get("/api/bank/score/1");
    expect(res.status).toBe(401);
  });

  it("exige rôle bank ou admin", async () => {
    const token = await getToken(WALLET2, "agent");
    const res = await request(app)
      .get("/api/bank/score/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("rejette un tokenId invalide", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/score/abc")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("retourne un score avec détails pour un titre valide", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/score/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("score");
    expect(res.body).toHaveProperty("rating");
    expect(res.body).toHaveProperty("details");
    expect(res.body).toHaveProperty("canTransfer");
    expect(typeof res.body.score).toBe("number");
    expect(res.body.score).toBeGreaterThanOrEqual(0);
    expect(res.body.score).toBeLessThanOrEqual(100);
    expect(["A", "B", "C", "D", "E"]).toContain(res.body.rating);
  });

  it("score réduit avec hypothèque active et transfert bloqué", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/score/1")
      .set("Authorization", `Bearer ${token}`);
    // 1 hypothèque (-10) + isLocked (-20) + 2 history (+10) = 80
    expect(res.body.score).toBe(80);
    expect(res.body.rating).toBe("A"); // >=80
    expect(res.body.summary.isLocked).toBe(true);
    expect(res.body.summary.activeEncumbrances).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────
// GET /api/bank/titre/:tokenId/status
// ─────────────────────────────────────────────────────────
describe("GET /api/bank/titre/:tokenId/status", () => {
  it("exige authentification", async () => {
    const res = await request(app).get("/api/bank/titre/1/status");
    expect(res.status).toBe(401);
  });

  it("rejette un tokenId invalide", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/titre/notanumber/status")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("retourne le statut crédit d'un titre", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/titre/1/status")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("titreFoncier");
    expect(res.body).toHaveProperty("creditStatus");
    expect(res.body).toHaveProperty("activeEncumbrances");
    expect(["eligible", "restricted", "blocked"]).toContain(res.body.creditStatus);
  });

  it("statut restricted si transfert bloqué (hypothèque)", async () => {
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/titre/1/status")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.creditStatus).toBe("restricted");
    expect(res.body.restrictions.length).toBeGreaterThan(0);
    expect(res.body.restrictions[0]).toMatch(/Transfert bloqué/);
  });

  it("statut blocked si titre saisi par justice", async () => {
    const { getContracts } = require("../src/config/blockchain");
    getContracts.mockResolvedValueOnce({
      nft: {
        getProperty: jest.fn().mockResolvedValue(MOCK_PROPERTY),
        getEncumbrances: jest.fn().mockResolvedValue([]),
        canTransfer: jest.fn().mockResolvedValue(false),
        isFrozenByJustice: jest.fn().mockResolvedValue(true),
        isLocked: jest.fn().mockResolvedValue(false),
      },
    });
    const token = await getToken(WALLET, "bank");
    const res = await request(app)
      .get("/api/bank/titre/1/status")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.creditStatus).toBe("blocked");
    expect(res.body.restrictions[0]).toMatch(/judiciellement/);
  });
});
