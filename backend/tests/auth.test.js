/**
 * SafeLand Backend — Tests d'intégration : Auth API
 *
 * Teste les endpoints /api/auth/* avec supertest.
 * L'authentification wallet est simulée via ethers.js.
 */
const path = require("path");
const fs = require("fs");

// Use a test-specific database
const TEST_DB_PATH = path.join(__dirname, "../data/test-auth.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-auth-tests";

const request = require("supertest");
const { ethers } = require("ethers");
const createApp = require("../src/app");
const db = require("../src/config/database");

let app;

beforeAll(() => {
  app = createApp();
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

// ─── Test wallet (Hardhat account #0) ─────────────────────
const TEST_WALLET = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
const TEST_ADDRESS = TEST_WALLET.address;

// ─── Helper: full login flow ──────────────────────────────
async function loginAs(wallet, role) {
  // Set user role if not default
  if (role && role !== "owner") {
    db.createOrGetUser(wallet.address.toLowerCase(), role);
    db.updateUserRole(wallet.address.toLowerCase(), role);
  }

  // 1. Get nonce
  const nonceRes = await request(app)
    .post("/api/auth/nonce")
    .send({ address: wallet.address });

  const { nonce } = nonceRes.body;

  // 2. Sign nonce
  const signature = await wallet.signMessage(nonce);

  // 3. Login
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ address: wallet.address, signature });

  return loginRes.body.token;
}

// ═══════════════════════════════════════════════════════════
// Health Check
// ═══════════════════════════════════════════════════════════
describe("GET /api/health", () => {
  test("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("SafeLand Morocco API");
  });
});

// ═══════════════════════════════════════════════════════════
// POST /api/auth/nonce
// ═══════════════════════════════════════════════════════════
describe("POST /api/auth/nonce", () => {
  test("returns nonce for valid address", async () => {
    const res = await request(app)
      .post("/api/auth/nonce")
      .send({ address: TEST_ADDRESS });

    expect(res.status).toBe(200);
    expect(res.body.nonce).toBeDefined();
    expect(res.body.nonce).toMatch(/^SafeLand Auth/);
  });

  test("rejects invalid address", async () => {
    const res = await request(app)
      .post("/api/auth/nonce")
      .send({ address: "not-an-address" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("rejects missing address", async () => {
    const res = await request(app)
      .post("/api/auth/nonce")
      .send({});

    expect(res.status).toBe(400);
  });

  test("rejects empty body", async () => {
    const res = await request(app)
      .post("/api/auth/nonce")
      .send();

    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════════
describe("POST /api/auth/login", () => {
  test("successful login with valid signature", async () => {
    // 1. Get nonce
    const nonceRes = await request(app)
      .post("/api/auth/nonce")
      .send({ address: TEST_ADDRESS });
    const nonce = nonceRes.body.nonce;

    // 2. Sign
    const signature = await TEST_WALLET.signMessage(nonce);

    // 3. Login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS, signature });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.address).toBe(TEST_ADDRESS.toLowerCase());
    expect(loginRes.body.role).toBe("owner");
  });

  test("rejects login without nonce", async () => {
    const signature = await TEST_WALLET.signMessage("random");
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS, signature });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/nonce/i);
  });

  test("rejects invalid signature", async () => {
    // Get nonce
    await request(app)
      .post("/api/auth/nonce")
      .send({ address: TEST_ADDRESS });

    // Use wrong signature
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS, signature: "0x" + "ab".repeat(65) });

    expect(res.status).toBe(401);
  });

  test("rejects missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS });

    expect(res.status).toBe(400);
  });

  test("nonce is single-use", async () => {
    // Get nonce
    const nonceRes = await request(app)
      .post("/api/auth/nonce")
      .send({ address: TEST_ADDRESS });
    const nonce = nonceRes.body.nonce;
    const signature = await TEST_WALLET.signMessage(nonce);

    // First login succeeds
    const login1 = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS, signature });
    expect(login1.status).toBe(200);

    // Second login with same nonce fails
    const login2 = await request(app)
      .post("/api/auth/login")
      .send({ address: TEST_ADDRESS, signature });
    expect(login2.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════
// GET /api/auth/me
// ═══════════════════════════════════════════════════════════
describe("GET /api/auth/me", () => {
  test("returns user info with valid token", async () => {
    const token = await loginAs(TEST_WALLET);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.address).toBe(TEST_ADDRESS.toLowerCase());
    expect(res.body.role).toBeDefined();
  });

  test("rejects without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("rejects with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════
// PUT /api/auth/role
// ═══════════════════════════════════════════════════════════
describe("PUT /api/auth/role", () => {
  const TARGET_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  test("admin can change role", async () => {
    const token = await loginAs(TEST_WALLET, "admin");

    const res = await request(app)
      .put("/api/auth/role")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: TARGET_ADDRESS, role: "notary" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("notary");
  });

  test("non-admin cannot change role", async () => {
    const token = await loginAs(TEST_WALLET, "owner");

    const res = await request(app)
      .put("/api/auth/role")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: TARGET_ADDRESS, role: "admin" });

    expect(res.status).toBe(403);
  });

  test("rejects invalid role", async () => {
    const token = await loginAs(TEST_WALLET, "admin");

    const res = await request(app)
      .put("/api/auth/role")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: TARGET_ADDRESS, role: "hacker" });

    expect(res.status).toBe(400);
  });

  test("rejects invalid address", async () => {
    const token = await loginAs(TEST_WALLET, "admin");

    const res = await request(app)
      .put("/api/auth/role")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "bad-address", role: "notary" });

    expect(res.status).toBe(400);
  });

  test("creates an audit log entry", async () => {
    const token = await loginAs(TEST_WALLET, "admin");

    await request(app)
      .put("/api/auth/role")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: TARGET_ADDRESS, role: "judge" });

    const logs = db.getAuditLog(10);
    const roleLog = logs.find((l) => l.action === "role_changed");
    expect(roleLog).toBeDefined();
    expect(roleLog.target).toBe(TARGET_ADDRESS.toLowerCase());
    expect(roleLog.details).toContain("judge");
  });
});

// ═══════════════════════════════════════════════════════════
// Security Config
// ═══════════════════════════════════════════════════════════
describe("Security", () => {
  test("JWT_SECRET is loaded from env", () => {
    const { JWT_SECRET } = require("../src/config/security");
    expect(JWT_SECRET).toBe("test-secret-for-jest-auth-tests");
  });
});
