/**
 * SafeLand — Couche base de données SQLite
 *
 * Persiste les utilisateurs, nonces et sessions d'authentification.
 * Remplace les Map() en mémoire pour la production.
 *
 * Table `users` : address (PK), role, createdAt, updatedAt
 * Table `nonces` : address (PK), nonce, expiresAt
 */
const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../../data/safeland.db");

let db = null;

function getDb() {
  if (db) return db;

  // Ensure data directory exists
  const fs = require("fs");
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      address     TEXT PRIMARY KEY,
      role        TEXT NOT NULL DEFAULT 'owner',
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS nonces (
      address     TEXT PRIMARY KEY,
      nonce       TEXT NOT NULL,
      expires_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      action      TEXT NOT NULL,
      actor       TEXT,
      target      TEXT,
      details     TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor);
    CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
  `);

  return db;
}

// ─── Nonces ───────────────────────────────────────────────

const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function setNonce(address, nonce) {
  const d = getDb();
  const expiresAt = Date.now() + NONCE_TTL_MS;
  d.prepare(
    `INSERT INTO nonces (address, nonce, expires_at)
     VALUES (?, ?, ?)
     ON CONFLICT(address) DO UPDATE SET nonce = excluded.nonce, expires_at = excluded.expires_at`
  ).run(address, nonce, expiresAt);
}

function getNonce(address) {
  const d = getDb();
  const row = d.prepare("SELECT nonce, expires_at FROM nonces WHERE address = ?").get(address);
  if (!row) return null;
  if (Date.now() > row.expires_at) {
    d.prepare("DELETE FROM nonces WHERE address = ?").run(address);
    return null;
  }
  return row.nonce;
}

function deleteNonce(address) {
  getDb().prepare("DELETE FROM nonces WHERE address = ?").run(address);
}

// Cleanup expired nonces periodically
function cleanupExpiredNonces() {
  getDb().prepare("DELETE FROM nonces WHERE expires_at < ?").run(Date.now());
}

// ─── Users ────────────────────────────────────────────────

function getUser(address) {
  const row = getDb()
    .prepare("SELECT address, role, created_at, updated_at FROM users WHERE address = ?")
    .get(address);
  if (!row) return null;
  return { role: row.role, createdAt: row.created_at, updatedAt: row.updated_at };
}

function createOrGetUser(address, role = "owner") {
  const d = getDb();
  const existing = getUser(address);
  if (existing) return existing;

  d.prepare(
    "INSERT INTO users (address, role) VALUES (?, ?)"
  ).run(address, role);

  return { role, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

function updateUserRole(address, role) {
  const d = getDb();
  const existing = getUser(address);
  if (!existing) {
    d.prepare("INSERT INTO users (address, role) VALUES (?, ?)").run(address, role);
  } else {
    d.prepare(
      "UPDATE users SET role = ?, updated_at = datetime('now') WHERE address = ?"
    ).run(role, address);
  }
  return getUser(address);
}

function listUsers() {
  return getDb()
    .prepare("SELECT address, role, created_at, updated_at FROM users ORDER BY created_at DESC")
    .all();
}

// ─── Audit Log ────────────────────────────────────────────

function logAudit(action, actor, target = null, details = null) {
  getDb()
    .prepare("INSERT INTO audit_log (action, actor, target, details) VALUES (?, ?, ?, ?)")
    .run(action, actor, target, details);
}

function getAuditLog(limit = 100) {
  return getDb()
    .prepare("SELECT * FROM audit_log ORDER BY id DESC LIMIT ?")
    .all(limit);
}

// ─── Close ────────────────────────────────────────────────

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

// Cleanup expired nonces every 5 minutes
const cleanupInterval = setInterval(cleanupExpiredNonces, 5 * 60 * 1000);
// Allow process to exit
if (cleanupInterval.unref) cleanupInterval.unref();

module.exports = {
  getDb,
  setNonce,
  getNonce,
  deleteNonce,
  getUser,
  createOrGetUser,
  updateUserRole,
  listUsers,
  logAudit,
  getAuditLog,
  close,
};
