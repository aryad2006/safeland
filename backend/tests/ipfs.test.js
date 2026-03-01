/**
 * SafeLand Backend — Tests : Route IPFS
 *
 * Teste les 4 endpoints /api/ipfs/*
 * Le service IPFS (Pinata) est mocké pour éviter les appels réseau.
 */
const path = require("path");
const fs = require("fs");

const TEST_DB_PATH = path.join(__dirname, "../data/test-ipfs.db");
process.env.DB_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = "test-secret-for-jest-ipfs";

// ─── Mock du service IPFS ─────────────────────────────────
jest.mock("../src/services/ipfs", () => ({
  uploadFile: jest.fn().mockResolvedValue({
    cid: "QmTestCID123abc",
    url: "https://gateway.pinata.cloud/ipfs/QmTestCID123abc",
    size: 1234,
  }),
  uploadJSON: jest.fn().mockResolvedValue({
    cid: "QmTestJSONCID456def",
    url: "https://gateway.pinata.cloud/ipfs/QmTestJSONCID456def",
  }),
  getFile: jest.fn().mockResolvedValue(Buffer.from("fake-file-content")),
  getPinStatus: jest.fn().mockResolvedValue({
    pinned: true,
    name: "safeland-test.pdf",
    size: 1234,
  }),
  IPFS_GATEWAY: "https://gateway.pinata.cloud/ipfs",
}));

const request = require("supertest");
const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("../src/config/database");

// ─── Build test app ───────────────────────────────────────
function createTestApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", require("../src/routes/auth"));
  app.use("/api/ipfs", require("../src/routes/ipfs"));
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  return app;
}

let app;
const TEST_WALLET = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

async function getToken(role = "agent") {
  db.createOrGetUser(TEST_WALLET.address.toLowerCase(), role);
  db.updateUserRole(TEST_WALLET.address.toLowerCase(), role);

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
  // Reset mock call counts
  const ipfs = require("../src/services/ipfs");
  Object.values(ipfs).forEach((fn) => typeof fn === "function" && fn.mockClear?.());
});

afterAll(() => {
  db.close();
  [TEST_DB_PATH, TEST_DB_PATH + "-wal", TEST_DB_PATH + "-shm"].forEach((f) => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
});

// ─── POST /api/ipfs/upload ────────────────────────────────
describe("POST /api/ipfs/upload", () => {
  test("401 sans token", async () => {
    const res = await request(app)
      .post("/api/ipfs/upload")
      .attach("file", Buffer.from("test"), { filename: "test.pdf", contentType: "application/pdf" });
    expect(res.status).toBe(401);
  });

  test("400 si aucun fichier", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fichier/i);
  });

  test("400 si format non autorisé (txt)", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("bad"), { filename: "bad.txt", contentType: "text/plain" });
    expect(res.status).toBe(400);
  });

  test("201 avec PDF valide", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`)
      .field("tokenId", "42")
      .field("documentType", "acte-notarie")
      .attach("file", Buffer.from("%PDF-1.4 fake"), { filename: "acte.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      message: expect.stringMatching(/upload/i),
      cid: "QmTestCID123abc",
      url: expect.stringContaining("QmTestCID123abc"),
      size: 1234,
      fileName: "acte.pdf",
    });
  });

  test("201 avec image JPEG valide", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-jpeg-data"), { filename: "photo.jpg", contentType: "image/jpeg" });

    expect(res.status).toBe(201);
    expect(res.body.cid).toBe("QmTestCID123abc");
  });

  test("201 avec image WebP valide", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("fake-webp-data"), { filename: "photo.webp", contentType: "image/webp" });

    expect(res.status).toBe(201);
    expect(res.body.cid).toBeDefined();
  });

  test("le service est appelé avec les métadonnées correctes", async () => {
    const token = await getToken("agent");
    await request(app)
      .post("/api/ipfs/upload")
      .set("Authorization", `Bearer ${token}`)
      .field("tokenId", "99")
      .field("documentType", "plan-cadastral")
      .attach("file", Buffer.from("data"), { filename: "plan.pdf", contentType: "application/pdf" });

    const ipfs = require("../src/services/ipfs");
    expect(ipfs.uploadFile).toHaveBeenCalledTimes(1);
    const [, , metadata] = ipfs.uploadFile.mock.calls[0];
    expect(metadata.tokenId).toBe("99");
    expect(metadata.documentType).toBe("plan-cadastral");
    expect(metadata.uploadedBy).toBeDefined();
  });
});

// ─── POST /api/ipfs/upload-json ───────────────────────────
describe("POST /api/ipfs/upload-json", () => {
  test("401 sans token", async () => {
    const res = await request(app)
      .post("/api/ipfs/upload-json")
      .send({ data: { foo: "bar" } });
    expect(res.status).toBe(401);
  });

  test("400 si 'data' absent", async () => {
    const token = await getToken("agent");
    const res = await request(app)
      .post("/api/ipfs/upload-json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/'data'/);
  });

  test("201 avec données JSON valides", async () => {
    const token = await getToken("agent");
    const metadata = {
      name: "TF-10234/C",
      description: "Titre foncier NFT — Casablanca",
      attributes: [
        { trait_type: "surface", value: 120 },
        { trait_type: "city", value: "Casablanca" },
      ],
    };
    const res = await request(app)
      .post("/api/ipfs/upload-json")
      .set("Authorization", `Bearer ${token}`)
      .send({ data: metadata, name: "tf-10234" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      message: expect.stringMatching(/upload/i),
      cid: "QmTestJSONCID456def",
      url: expect.stringContaining("QmTestJSONCID456def"),
    });
  });

  test("le service est appelé avec name personnalisé", async () => {
    const token = await getToken("agent");
    await request(app)
      .post("/api/ipfs/upload-json")
      .set("Authorization", `Bearer ${token}`)
      .send({ data: { k: "v" }, name: "mon-document" });

    const ipfs = require("../src/services/ipfs");
    expect(ipfs.uploadJSON).toHaveBeenCalledWith({ k: "v" }, "mon-document");
  });
});

// ─── GET /api/ipfs/:cid ───────────────────────────────────
describe("GET /api/ipfs/:cid", () => {
  test("200 retourne le contenu binaire", async () => {
    const res = await request(app)
      .get("/api/ipfs/QmTestCID123abc");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/octet-stream/);
    expect(res.body).toBeDefined();
  });

  test("le service est appelé avec le bon CID", async () => {
    await request(app).get("/api/ipfs/QmSomeCID789xyz");
    const ipfs = require("../src/services/ipfs");
    expect(ipfs.getFile).toHaveBeenCalledWith("QmSomeCID789xyz");
  });
});

// ─── GET /api/ipfs/:cid/status ────────────────────────────
describe("GET /api/ipfs/:cid/status", () => {
  test("200 retourne le statut de pin", async () => {
    const res = await request(app)
      .get("/api/ipfs/QmTestCID123abc/status");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      pinned: true,
      name: "safeland-test.pdf",
      size: 1234,
    });
  });

  test("200 retourne pinned: false si non pinnné", async () => {
    const ipfs = require("../src/services/ipfs");
    ipfs.getPinStatus.mockResolvedValueOnce({ pinned: false });

    const res = await request(app)
      .get("/api/ipfs/QmUnknownCID/status");

    expect(res.status).toBe(200);
    expect(res.body.pinned).toBe(false);
  });
});
