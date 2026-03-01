/**
 * SafeLand Backend — Tests : Service Notifications WebSocket
 *
 * Teste le service WebSocket de notifications temps réel.
 * Vérifie connect/subscribe/broadcast/timelock/stats sans blockchain réelle.
 */
const http = require("http");
const WebSocket = require("ws");
const NotificationService = require("../src/services/notifications");

// ─── Helpers ──────────────────────────────────────────────

/**
 * Crée un serveur HTTP + NotificationService et démarre l'écoute.
 * Retourne { server, notifications, baseUrl, wsUrl }.
 */
function createServer(config = {}) {
  const server = http.createServer();
  const notifications = new NotificationService(server, config);
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        notifications,
        port,
        wsUrl: `ws://127.0.0.1:${port}/ws`,
      });
    });
  });
}

/**
 * Ouvre un client WS et attend le message de bienvenue.
 * Retourne { ws, welcome }.
 */
function connectClient(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.once("message", (data) => {
      const msg = JSON.parse(data.toString());
      resolve({ ws, welcome: msg });
    });
    ws.once("error", reject);
  });
}

/**
 * Attend le prochain message du client WS.
 */
function nextMessage(ws, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("WS message timeout")), timeout);
    ws.once("message", (data) => {
      clearTimeout(timer);
      resolve(JSON.parse(data.toString()));
    });
  });
}

// ─── Suite ────────────────────────────────────────────────

describe("NotificationService — WebSocket", () => {
  let server, notifications, wsUrl, port;

  beforeAll(async () => {
    ({ server, notifications, wsUrl, port } = await createServer());
  });

  afterAll(async () => {
    // Terminate lingering WS clients so server.close() resolves promptly
    notifications.wss.clients.forEach((client) => client.terminate());
    await new Promise((resolve) => server.close(resolve));
  }, 10000);

  // ── Connexion ───────────────────────────────────────────

  describe("Connexion initiale", () => {
    it("envoie un message de bienvenue avec type=connected", async () => {
      const { ws, welcome } = await connectClient(wsUrl);
      expect(welcome.type).toBe("connected");
      ws.close();
    });

    it("le message de bienvenue contient un clientId", async () => {
      const { ws, welcome } = await connectClient(wsUrl);
      expect(typeof welcome.clientId).toBe("string");
      expect(welcome.clientId.length).toBeGreaterThan(0);
      ws.close();
    });

    it("le message de bienvenue liste les channels disponibles", async () => {
      const { ws, welcome } = await connectClient(wsUrl);
      expect(Array.isArray(welcome.channels)).toBe(true);
      expect(welcome.channels).toContain("all");
      expect(welcome.channels).toContain("nft");
      expect(welcome.channels).toContain("escrow");
      expect(welcome.channels).toContain("fridda");
      expect(welcome.channels).toContain("justice");
      expect(welcome.channels).toContain("registry");
      ws.close();
    });

    it("le message de bienvenue liste les channels timelock", async () => {
      const { ws, welcome } = await connectClient(wsUrl);
      expect(welcome.channels).toContain("timelock");
      expect(welcome.channels).toContain("timelock.scheduled");
      expect(welcome.channels).toContain("timelock.executed");
      expect(welcome.channels).toContain("timelock.cancelled");
      ws.close();
    });

    it("incrémente le compteur de clients connectés", async () => {
      // Wait for any lingering disconnections from previous tests
      await new Promise((r) => setTimeout(r, 100));
      const before = notifications.clients.size;
      const { ws } = await connectClient(wsUrl);
      expect(notifications.clients.size).toBe(before + 1);
      // Close and wait for server to process disconnect
      ws.terminate();
      await new Promise((r) => setTimeout(r, 100));
      expect(notifications.clients.size).toBe(before);
    });
  });

  // ── Ping / Pong ─────────────────────────────────────────

  describe("Ping / Pong", () => {
    it("répond pong à un ping", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "ping" }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("pong");
      expect(typeof reply.timestamp).toBe("number");
      ws.close();
    });
  });

  // ── Subscribe ───────────────────────────────────────────

  describe("Subscribe", () => {
    it("répond avec type=subscribed et liste les channels", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "subscribe", channels: ["property.created", "deal.completed"] }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("subscribed");
      expect(reply.channels).toContain("property.created");
      expect(reply.channels).toContain("deal.completed");
      ws.close();
    });

    it("s'abonne aux channels timelock", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "subscribe", channels: ["timelock.scheduled", "timelock.cancelled"] }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("subscribed");
      expect(reply.channels).toContain("timelock.scheduled");
      expect(reply.channels).toContain("timelock.cancelled");
      ws.close();
    });

    it("ignore les channels invalides (garde les valides)", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "subscribe", channels: ["valid.channel", null, undefined, 42] }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("subscribed");
      ws.close();
    });
  });

  // ── Unsubscribe ─────────────────────────────────────────

  describe("Unsubscribe", () => {
    it("désabonne et retourne les channels restants", async () => {
      const { ws } = await connectClient(wsUrl);
      // S'abonner d'abord
      ws.send(JSON.stringify({ action: "subscribe", channels: ["nft", "escrow"] }));
      await nextMessage(ws);
      // Se désabonner de nft
      ws.send(JSON.stringify({ action: "unsubscribe", channels: ["nft"] }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("unsubscribed");
      expect(reply.channels).not.toContain("nft");
      expect(reply.channels).toContain("escrow");
      ws.close();
    });
  });

  // ── Action inconnue ─────────────────────────────────────

  describe("Actions inconnues", () => {
    it("répond avec type=error pour une action inconnue", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "fly_to_moon" }));
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("error");
      ws.close();
    });

    it("répond avec type=error pour un JSON invalide", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send("not json {{{{");
      const reply = await nextMessage(ws);
      expect(reply.type).toBe("error");
      ws.close();
    });
  });

  // ── Broadcast ───────────────────────────────────────────

  describe("broadcast()", () => {
    it("envoie le message aux clients abonnés à 'all'", async () => {
      const { ws } = await connectClient(wsUrl); // connecté → abonné à 'all' par défaut
      // Envoyer un broadcast
      const count = notifications.broadcast("test.channel", { foo: "bar" });
      const msg = await nextMessage(ws);
      expect(msg.type).toBe("notification");
      expect(msg.channel).toBe("test.channel");
      expect(msg.data.foo).toBe("bar");
      expect(count).toBeGreaterThan(0);
      ws.close();
    });

    it("envoie le message aux clients abonnés au channel exact", async () => {
      const { ws } = await connectClient(wsUrl);
      // Désabonner de 'all', s'abonner à 'deal.created' uniquement
      ws.send(JSON.stringify({ action: "unsubscribe", channels: ["all"] }));
      await nextMessage(ws); // réponse unsubscribed
      ws.send(JSON.stringify({ action: "subscribe", channels: ["deal.created"] }));
      await nextMessage(ws); // réponse subscribed

      notifications.broadcast("deal.created", { dealId: "42" });
      const msg = await nextMessage(ws);
      expect(msg.channel).toBe("deal.created");
      expect(msg.data.dealId).toBe("42");
      ws.close();
    });

    it("envoie le message aux clients abonnés à la catégorie parente", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "unsubscribe", channels: ["all"] }));
      await nextMessage(ws);
      ws.send(JSON.stringify({ action: "subscribe", channels: ["timelock"] })); // catégorie
      await nextMessage(ws);

      notifications.broadcast("timelock.scheduled", { operationId: "0xabc" });
      const msg = await nextMessage(ws);
      expect(msg.channel).toBe("timelock.scheduled");
      expect(msg.data.operationId).toBe("0xabc");
      ws.close();
    });

    it("n'envoie pas aux clients non abonnés", async () => {
      const { ws } = await connectClient(wsUrl);
      ws.send(JSON.stringify({ action: "unsubscribe", channels: ["all"] }));
      await nextMessage(ws);
      // Ne s'abonner à rien d'autre

      notifications.broadcast("timelock.cancelled", { operationId: "0xdef" });

      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("no msg")), 200));
      await expect(Promise.race([nextMessage(ws, 200), timeout])).rejects.toThrow();
      ws.close();
    });

    it("retourne le nombre de clients ayant reçu le message", async () => {
      // 2 clients abonnés à 'all'
      const { ws: ws1 } = await connectClient(wsUrl);
      const { ws: ws2 } = await connectClient(wsUrl);

      const count = notifications.broadcast("multi.test", { x: 1 });
      expect(count).toBeGreaterThanOrEqual(2);
      ws1.close();
      ws2.close();
    });
  });

  // ── Stats ───────────────────────────────────────────────

  describe("getStats()", () => {
    it("retourne les statistiques du service", () => {
      const stats = notifications.getStats();
      expect(typeof stats.connectedClients).toBe("number");
      expect(Array.isArray(stats.listeningContracts)).toBe(true);
      expect(typeof stats.uptime).toBe("number");
    });
  });
});

// ─── startListening avec mock provider ─────────────────────

describe("NotificationService — startListening", () => {
  it("appelle _listenTimelock si contractAddresses.timelock est défini", async () => {
    const server = http.createServer();
    const notifications = new NotificationService(server, {
      rpcUrl: "http://localhost:9999", // URL invalide exprès
    });

    // Spy sur les méthodes d'écoute et le provider
    notifications._listenNFT = jest.fn();
    notifications._listenEscrow = jest.fn();
    notifications._listenFridda = jest.fn();
    notifications._listenJustice = jest.fn();
    notifications._listenRegistry = jest.fn();
    notifications._listenTimelock = jest.fn();

    // Mock provider pour éviter une vraie connexion RPC
    const { ethers } = require("ethers");
    jest.spyOn(ethers, "JsonRpcProvider").mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 31337n }),
    }));

    const addresses = {
      nft: "0x1111111111111111111111111111111111111111",
      escrow: "0x2222222222222222222222222222222222222222",
      fridda: "0x3333333333333333333333333333333333333333",
      justice: "0x4444444444444444444444444444444444444444",
      registry: "0x5555555555555555555555555555555555555555",
      timelock: "0x6666666666666666666666666666666666666666",
    };

    await notifications.startListening(addresses);

    expect(notifications._listenNFT).toHaveBeenCalledWith(addresses.nft);
    expect(notifications._listenEscrow).toHaveBeenCalledWith(addresses.escrow);
    expect(notifications._listenFridda).toHaveBeenCalledWith(addresses.fridda);
    expect(notifications._listenJustice).toHaveBeenCalledWith(addresses.justice);
    expect(notifications._listenRegistry).toHaveBeenCalledWith(addresses.registry);
    expect(notifications._listenTimelock).toHaveBeenCalledWith(addresses.timelock);

    jest.restoreAllMocks();
    server.close();
  });

  it("n'appelle pas _listenTimelock si contractAddresses.timelock est absent", async () => {
    const server = http.createServer();
    const notifications = new NotificationService(server, {
      rpcUrl: "http://localhost:9999",
    });

    notifications._listenNFT = jest.fn();
    notifications._listenEscrow = jest.fn();
    notifications._listenFridda = jest.fn();
    notifications._listenJustice = jest.fn();
    notifications._listenRegistry = jest.fn();
    notifications._listenTimelock = jest.fn();

    const { ethers } = require("ethers");
    jest.spyOn(ethers, "JsonRpcProvider").mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 31337n }),
    }));

    // Pas de timelock dans les adresses
    await notifications.startListening({
      nft: "0x1111111111111111111111111111111111111111",
    });

    expect(notifications._listenTimelock).not.toHaveBeenCalled();

    jest.restoreAllMocks();
    server.close();
  });

  it("retry après 10s si la connexion blockchain échoue", async () => {
    jest.useFakeTimers();
    const server = http.createServer();
    const notifications = new NotificationService(server, {
      rpcUrl: "http://localhost:9999",
    });

    const startSpy = jest.spyOn(notifications, "startListening");

    const { ethers } = require("ethers");
    jest.spyOn(ethers, "JsonRpcProvider").mockImplementation(() => ({
      getNetwork: jest.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    }));

    notifications.startListening({ nft: "0x1111111111111111111111111111111111111111" });
    await Promise.resolve(); // flush microtasks

    jest.advanceTimersByTime(10001);
    expect(startSpy).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
    jest.restoreAllMocks();
    server.close();
  });
});
