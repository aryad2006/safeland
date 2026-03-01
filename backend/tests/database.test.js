/**
 * SafeLand Backend — Tests unitaires : Database (SQLite)
 */
const path = require("path");
const fs = require("fs");

// Use a temporary test database
const TEST_DB_PATH = path.join(__dirname, "../data/test-db.db");
process.env.DB_PATH = TEST_DB_PATH;

const db = require("../src/config/database");

// Clean up before/after
beforeEach(() => {
  // Reset tables
  const d = db.getDb();
  d.exec("DELETE FROM nonces");
  d.exec("DELETE FROM users");
  d.exec("DELETE FROM audit_log");
});

afterAll(() => {
  db.close();
  // Remove test database file
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  const walPath = TEST_DB_PATH + "-wal";
  const shmPath = TEST_DB_PATH + "-shm";
  if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
  if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
});

// ─── Nonces ───────────────────────────────────────────────
describe("Nonces", () => {
  const addr = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

  test("setNonce + getNonce", () => {
    db.setNonce(addr, "test-nonce-123");
    expect(db.getNonce(addr)).toBe("test-nonce-123");
  });

  test("overwrites existing nonce", () => {
    db.setNonce(addr, "nonce-1");
    db.setNonce(addr, "nonce-2");
    expect(db.getNonce(addr)).toBe("nonce-2");
  });

  test("deleteNonce removes nonce", () => {
    db.setNonce(addr, "nonce-del");
    db.deleteNonce(addr);
    expect(db.getNonce(addr)).toBeNull();
  });

  test("returns null for unknown address", () => {
    expect(db.getNonce("0x0000000000000000000000000000000000000001")).toBeNull();
  });

  test("expired nonce returns null", () => {
    const d = db.getDb();
    // Manually insert an expired nonce
    d.prepare(
      "INSERT INTO nonces (address, nonce, expires_at) VALUES (?, ?, ?)"
    ).run(addr, "expired-nonce", Date.now() - 1000);

    expect(db.getNonce(addr)).toBeNull();
  });
});

// ─── Users ────────────────────────────────────────────────
describe("Users", () => {
  const addr = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

  test("createOrGetUser creates a new user", () => {
    const user = db.createOrGetUser(addr, "notary");
    expect(user.role).toBe("notary");
    expect(user.createdAt).toBeDefined();
  });

  test("createOrGetUser returns existing user", () => {
    db.createOrGetUser(addr, "notary");
    const user = db.createOrGetUser(addr, "admin"); // should NOT change role
    expect(user.role).toBe("notary");
  });

  test("getUser returns null for unknown address", () => {
    expect(db.getUser("0x0000000000000000000000000000000000000002")).toBeNull();
  });

  test("updateUserRole updates existing user", () => {
    db.createOrGetUser(addr, "owner");
    const updated = db.updateUserRole(addr, "admin");
    expect(updated.role).toBe("admin");
  });

  test("updateUserRole creates user if not exists", () => {
    const newAddr = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";
    const user = db.updateUserRole(newAddr, "judge");
    expect(user.role).toBe("judge");
  });

  test("listUsers returns all users", () => {
    db.createOrGetUser("0x1111111111111111111111111111111111111111", "owner");
    db.createOrGetUser("0x2222222222222222222222222222222222222222", "notary");
    const users = db.listUsers();
    expect(users.length).toBe(2);
  });
});

// ─── Audit Log ────────────────────────────────────────────
describe("Audit Log", () => {
  test("logAudit + getAuditLog", () => {
    db.logAudit("login_success", "0xabc", null, "role=owner");
    db.logAudit("role_changed", "0xadmin", "0xabc", "new_role=notary");

    const logs = db.getAuditLog();
    expect(logs.length).toBe(2);
    expect(logs[0].action).toBe("role_changed"); // DESC order
    expect(logs[1].action).toBe("login_success");
  });

  test("getAuditLog respects limit", () => {
    for (let i = 0; i < 10; i++) {
      db.logAudit("test_action", `actor_${i}`);
    }
    const logs = db.getAuditLog(3);
    expect(logs.length).toBe(3);
  });
});
