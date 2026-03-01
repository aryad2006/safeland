/**
 * SafeLand Backend — Tests : Route Timelock
 *
 * Teste la validation et l'authentification des endpoints /api/timelock/*.
 * Les appels blockchain sont mockés via jest.mock.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-timelock.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-timelock";

// ─── Mock blockchain ──────────────────────────────────────
const MOCK_OP = {
  target: "0x0000000000000000000000000000000000000001",
  value: 0n,
  data: "0x",
  readyTimestamp: BigInt(Math.floor(Date.now() / 1000) + 86400),
  status: 1n, // Pending
  proposer: "0x0000000000000000000000000000000000000002",
  description: "Upgrade Registry",
};

jest.mock("../src/config/blockchain", () => ({
  getContracts: jest.fn().mockResolvedValue({
    timelock: {
      getOperation: jest.fn().mockResolvedValue(MOCK_OP),
      operationCount: jest.fn().mockResolvedValue(3n),
      MIN_DELAY: jest.fn().mockResolvedValue(86400n),
      MAX_DELAY: jest.fn().mockResolvedValue(2592000n),
      GRACE_PERIOD: jest.fn().mockResolvedValue(1209600n),
      schedule: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: "0xabcd",
          logs: [{
            fragment: { name: "OperationScheduled" },
            args: [
              "0x" + "a".repeat(64),
              "0x0000000000000000000000000000000000000001",
              0n,
              "0x",
              BigInt(Math.floor(Date.now() / 1000) + 86400),
              "Test op",
            ],
          }],
        }),
      }),
      execute: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: "0xexec" }),
      }),
      cancel: jest.fn().mockResolvedValue({
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

// Build test app with timelock + auth routes
function createTestApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", require("../src/routes/auth"));
  app.use("/api/timelock", require("../src/routes/timelock"));
  return app;
}

let app;
const TEST_WALLET = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
const VALID_OP_ID = "0x" + "a".repeat(64);
const VALID_SALT = "0x" + "b".repeat(64);
const VALID_ADDRESS = "0x0000000000000000000000000000000000000001";

// ─── Helper: login & get token ────────────────────────────
async function getAdminToken() {
  db.createOrGetUser(TEST_WALLET.address.toLowerCase(), "admin");
  db.updateUserRole(TEST_WALLET.address.toLowerCase(), "admin");

  const nonceRes = await request(app)
    .post("/api/auth/nonce")
    .send({ address: TEST_WALLET.address });
  const { nonce } = nonceRes.body;

  const signature = await TEST_WALLET.signMessage(nonce);

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ address: TEST_WALLET.address, signature });

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
// GET /api/timelock/pending
// ─────────────────────────────────────────────────────────
describe("GET /api/timelock/pending", () => {
  it("retourne les stats timelock sans auth", async () => {
    const res = await request(app).get("/api/timelock/pending");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalOperations");
    expect(res.body).toHaveProperty("minDelaySeconds", "86400");
    expect(res.body).toHaveProperty("maxDelaySeconds");
    expect(res.body).toHaveProperty("gracePeriodSeconds");
  });
});

// ─────────────────────────────────────────────────────────
// GET /api/timelock/operations/:operationId
// ─────────────────────────────────────────────────────────
describe("GET /api/timelock/operations/:operationId", () => {
  it("retourne une opération valide", async () => {
    const res = await request(app).get(`/api/timelock/operations/${VALID_OP_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("operationId", VALID_OP_ID);
    expect(res.body).toHaveProperty("status", "Pending");
    expect(res.body).toHaveProperty("description", "Upgrade Registry");
    expect(res.body).toHaveProperty("readyAt");
  });

  it("rejette un operationId mal formé (trop court)", async () => {
    const res = await request(app).get("/api/timelock/operations/0xdeadbeef");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bytes32/);
  });

  it("rejette un operationId sans préfixe 0x", async () => {
    const res = await request(app).get("/api/timelock/operations/" + "a".repeat(64));
    expect(res.status).toBe(400);
  });

  it("retourne 404 si status=None (operation inexistante)", async () => {
    const { getContracts } = require("../src/config/blockchain");
    getContracts.mockResolvedValueOnce({
      timelock: {
        getOperation: jest.fn().mockResolvedValue({ ...MOCK_OP, status: 0n }),
      },
    });
    const res = await request(app).get(`/api/timelock/operations/${VALID_OP_ID}`);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────
// POST /api/timelock/schedule
// ─────────────────────────────────────────────────────────
describe("POST /api/timelock/schedule", () => {
  it("exige authentification", async () => {
    const res = await request(app)
      .post("/api/timelock/schedule")
      .send({
        target: VALID_ADDRESS,
        salt: VALID_SALT,
        delay: 86400,
        description: "Test",
      });
    expect(res.status).toBe(401);
  });

  it("exige rôle admin", async () => {
    // Login as owner (not admin)
    db.createOrGetUser(TEST_WALLET.address.toLowerCase(), "owner");
    const nonceRes = await request(app)
      .post("/api/auth/nonce")
      .send({ address: TEST_WALLET.address });
    const { nonce } = nonceRes.body;
    const signature = await TEST_WALLET.signMessage(nonce);
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_WALLET.address, signature });
    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: VALID_ADDRESS,
        salt: VALID_SALT,
        delay: 86400,
        description: "Test",
      });
    expect(res.status).toBe(403);
  });

  it("rejette une adresse target invalide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: "not-an-address",
        salt: VALID_SALT,
        delay: 86400,
        description: "Test",
      });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/adresse Ethereum invalide/);
  });

  it("rejette un delay inférieur à 86400", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: VALID_ADDRESS,
        salt: VALID_SALT,
        delay: 3600,
        description: "Test",
      });
    expect(res.status).toBe(400);
    expect(res.body.details[0]).toMatch(/86400/);
  });

  it("rejette une description vide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: VALID_ADDRESS,
        salt: VALID_SALT,
        delay: 86400,
        description: "",
      });
    expect(res.status).toBe(400);
  });

  it("rejette un salt mal formé", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: VALID_ADDRESS,
        salt: "0xbadsalt",
        delay: 86400,
        description: "Test",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bytes32/);
  });

  it("planifie une opération valide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target: VALID_ADDRESS,
        salt: VALID_SALT,
        delay: 86400,
        description: "Upgrade Registry to v2",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("operationId");
    expect(res.body).toHaveProperty("txHash");
    expect(res.body).toHaveProperty("readyAt");
  });
});

// ─────────────────────────────────────────────────────────
// POST /api/timelock/:operationId/cancel
// ─────────────────────────────────────────────────────────
describe("POST /api/timelock/:operationId/cancel", () => {
  it("exige authentification", async () => {
    const res = await request(app).post(`/api/timelock/${VALID_OP_ID}/cancel`);
    expect(res.status).toBe(401);
  });

  it("rejette un operationId invalide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/0xinvalid/cancel")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bytes32/);
  });

  it("annule une opération valide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/timelock/${VALID_OP_ID}/cancel`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/annulée/);
  });
});

// ─────────────────────────────────────────────────────────
// POST /api/timelock/:operationId/execute
// ─────────────────────────────────────────────────────────
describe("POST /api/timelock/:operationId/execute", () => {
  it("exige authentification", async () => {
    const res = await request(app)
      .post(`/api/timelock/${VALID_OP_ID}/execute`)
      .send({ target: VALID_ADDRESS, salt: VALID_SALT });
    expect(res.status).toBe(401);
  });

  it("rejette un operationId invalide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post("/api/timelock/0xbad/execute")
      .set("Authorization", `Bearer ${token}`)
      .send({ target: VALID_ADDRESS, salt: VALID_SALT });
    expect(res.status).toBe(400);
  });

  it("rejette un target invalide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/timelock/${VALID_OP_ID}/execute`)
      .set("Authorization", `Bearer ${token}`)
      .send({ target: "bad-address", salt: VALID_SALT });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/adresse/);
  });

  it("rejette un salt invalide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/timelock/${VALID_OP_ID}/execute`)
      .set("Authorization", `Bearer ${token}`)
      .send({ target: VALID_ADDRESS, salt: "0xbadsalt" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bytes32/);
  });

  it("exécute une opération valide", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/timelock/${VALID_OP_ID}/execute`)
      .set("Authorization", `Bearer ${token}`)
      .send({ target: VALID_ADDRESS, salt: VALID_SALT });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/exécutée/);
  });
});
