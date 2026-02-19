/**
 * SafeLand — Service de notifications temps réel via WebSocket
 *
 * Écoute les événements on-chain des 5 contrats et diffuse aux clients connectés.
 * Supporte les rooms par type d'événement pour un filtrage côté client.
 */
const { WebSocketServer } = require("ws");
const { ethers } = require("ethers");

// ABI fragments — seulement les événements
const NFT_EVENTS = [
  "event PropertyCreated(uint256 indexed tokenId, string titreFoncier, address owner, address validator)",
  "event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to, string txType)",
  "event EncumbranceAdded(uint256 indexed tokenId, string encType, address creditor)",
  "event EncumbranceRemoved(uint256 indexed tokenId, uint256 index)",
  "event TransferLocked(uint256 indexed tokenId, string reason)",
  "event TransferUnlocked(uint256 indexed tokenId)",
  "event PropertyFrozenByJustice(uint256 indexed tokenId, bytes32 judgmentHash)",
  "event PropertyBurned(uint256 indexed tokenId, bytes32 judgmentHash)",
];

const ESCROW_EVENTS = [
  "event DealCreated(uint256 indexed dealId, uint256 indexed tokenId, address seller, address buyer, uint256 price)",
  "event SellerSigned(uint256 indexed dealId)",
  "event BuyerFunded(uint256 indexed dealId, uint256 amount)",
  "event NotaryValidated(uint256 indexed dealId)",
  "event DealCompleted(uint256 indexed dealId, uint256 dgiAmount, uint256 ancfccAmount, uint256 sellerNet)",
  "event DealCancelled(uint256 indexed dealId, string reason)",
];

const FRIDDA_EVENTS = [
  "event SuccessionOpened(uint256 indexed dossierId, uint256 indexed nftTokenId, address deceased)",
  "event SharesDistributed(uint256 indexed dossierId, address[] heirs, uint256[] shares)",
  "event SuccessionFinalized(uint256 indexed dossierId)",
  "event ProposalCreated(uint256 indexed proposalId, uint256 indexed dossierId, uint8 voteType)",
  "event VoteCast(uint256 indexed proposalId, address voter, bool inFavor, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)",
];

const JUSTICE_EVENTS = [
  "event ActionProposed(uint256 indexed actionId, uint8 actionType, uint256 tokenId, address proposedBy)",
  "event ActionSigned(uint256 indexed actionId, address signer, uint256 totalSignatures)",
  "event ActionExecuted(uint256 indexed actionId, uint8 actionType, uint256 tokenId)",
  "event RecoveryRequested(uint256 indexed recoveryId, uint256 tokenId, address currentOwner, address newWallet)",
  "event RecoveryExecuted(uint256 indexed recoveryId, uint256 tokenId, address newWallet)",
];

const REGISTRY_EVENTS = [
  "event PropertyRegistered(uint256 indexed tokenId, string city, string propertyType, address owner)",
  "event TransactionRecorded(uint256 indexed tokenId, address from, address to, string txType)",
  "event FraudPrevented(uint256 indexed tokenId, string reason)",
];

class NotificationService {
  constructor(server, config = {}) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    this.clients = new Map(); // ws -> { subscriptions: Set }
    this.provider = null;
    this.contracts = {};
    this.config = {
      rpcUrl: config.rpcUrl || process.env.RPC_URL || "http://localhost:8545",
      contracts: config.contracts || {},
    };

    this._setupWebSocket();
    console.log("🔔 NotificationService initialisé sur /ws");
  }

  // ── WebSocket Server Setup ──────────────────────────────

  _setupWebSocket() {
    this.wss.on("connection", (ws, req) => {
      const clientId = Date.now().toString(36) + Math.random().toString(36).slice(2);
      this.clients.set(ws, {
        id: clientId,
        subscriptions: new Set(["all"]),
        connectedAt: new Date(),
      });

      console.log(`🔗 Client connecté: ${clientId} (${this.clients.size} total)`);

      // Envoyer le message de bienvenue
      this._send(ws, {
        type: "connected",
        clientId,
        channels: [
          "all", "nft", "escrow", "fridda", "justice", "registry",
          "property.created", "property.transferred", "property.frozen",
          "deal.created", "deal.completed", "deal.cancelled",
          "succession.opened", "succession.finalized",
          "justice.action", "justice.executed",
          "fraud.alert",
        ],
      });

      ws.on("message", (data) => this._handleMessage(ws, data));

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log(`🔌 Client déconnecté: ${clientId} (${this.clients.size} restants)`);
      });

      ws.on("error", (err) => {
        console.error(`❌ WS Error (${clientId}):`, err.message);
      });
    });
  }

  _handleMessage(ws, data) {
    try {
      const msg = JSON.parse(data.toString());
      const client = this.clients.get(ws);
      if (!client) return;

      switch (msg.action) {
        case "subscribe":
          if (Array.isArray(msg.channels)) {
            msg.channels.forEach((ch) => client.subscriptions.add(ch));
          }
          this._send(ws, {
            type: "subscribed",
            channels: Array.from(client.subscriptions),
          });
          break;

        case "unsubscribe":
          if (Array.isArray(msg.channels)) {
            msg.channels.forEach((ch) => client.subscriptions.delete(ch));
          }
          this._send(ws, {
            type: "unsubscribed",
            channels: Array.from(client.subscriptions),
          });
          break;

        case "ping":
          this._send(ws, { type: "pong", timestamp: Date.now() });
          break;

        default:
          this._send(ws, { type: "error", message: `Action inconnue: ${msg.action}` });
      }
    } catch (e) {
      this._send(ws, { type: "error", message: "Message JSON invalide" });
    }
  }

  _send(ws, data) {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(JSON.stringify(data));
    }
  }

  // ── Broadcast ───────────────────────────────────────────

  broadcast(channel, notification) {
    const payload = JSON.stringify({
      type: "notification",
      channel,
      data: notification,
      timestamp: Date.now(),
    });

    let sent = 0;
    for (const [ws, client] of this.clients) {
      if (ws.readyState !== 1) continue;
      if (
        client.subscriptions.has("all") ||
        client.subscriptions.has(channel) ||
        client.subscriptions.has(channel.split(".")[0])
      ) {
        ws.send(payload);
        sent++;
      }
    }
    return sent;
  }

  // ── Blockchain Listener ─────────────────────────────────

  async startListening(contractAddresses) {
    try {
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      const network = await this.provider.getNetwork();
      console.log(`⛓️  Connecté à la blockchain (chainId: ${network.chainId})`);

      // Setup contract listeners
      if (contractAddresses.nft) {
        this._listenNFT(contractAddresses.nft);
      }
      if (contractAddresses.escrow) {
        this._listenEscrow(contractAddresses.escrow);
      }
      if (contractAddresses.fridda) {
        this._listenFridda(contractAddresses.fridda);
      }
      if (contractAddresses.justice) {
        this._listenJustice(contractAddresses.justice);
      }
      if (contractAddresses.registry) {
        this._listenRegistry(contractAddresses.registry);
      }

      console.log("👂 Écoute des événements blockchain activée");
    } catch (err) {
      console.error("❌ Erreur connexion blockchain:", err.message);
      console.log("⏳ Retry dans 10s...");
      setTimeout(() => this.startListening(contractAddresses), 10000);
    }
  }

  _listenNFT(address) {
    const contract = new ethers.Contract(address, NFT_EVENTS, this.provider);

    contract.on("PropertyCreated", (tokenId, titreFoncier, owner, validator, event) => {
      const n = this.broadcast("property.created", {
        event: "PropertyCreated",
        tokenId: tokenId.toString(),
        titreFoncier,
        owner,
        validator,
        txHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
      console.log(`📢 PropertyCreated #${tokenId} → ${n} clients`);
    });

    contract.on("PropertyTransferred", (tokenId, from, to, txType, event) => {
      this.broadcast("property.transferred", {
        event: "PropertyTransferred",
        tokenId: tokenId.toString(),
        from,
        to,
        txType,
        txHash: event.log.transactionHash,
      });
    });

    contract.on("EncumbranceAdded", (tokenId, encType, creditor) => {
      this.broadcast("nft", {
        event: "EncumbranceAdded",
        tokenId: tokenId.toString(),
        encType,
        creditor,
      });
    });

    contract.on("TransferLocked", (tokenId, reason) => {
      this.broadcast("nft", {
        event: "TransferLocked",
        tokenId: tokenId.toString(),
        reason,
      });
    });

    contract.on("TransferUnlocked", (tokenId) => {
      this.broadcast("nft", {
        event: "TransferUnlocked",
        tokenId: tokenId.toString(),
      });
    });

    contract.on("PropertyFrozenByJustice", (tokenId, judgmentHash) => {
      this.broadcast("property.frozen", {
        event: "PropertyFrozenByJustice",
        tokenId: tokenId.toString(),
        judgmentHash,
        severity: "critical",
      });
    });

    contract.on("PropertyBurned", (tokenId, judgmentHash) => {
      this.broadcast("nft", {
        event: "PropertyBurned",
        tokenId: tokenId.toString(),
        judgmentHash,
        severity: "critical",
      });
    });

    this.contracts.nft = contract;
  }

  _listenEscrow(address) {
    const contract = new ethers.Contract(address, ESCROW_EVENTS, this.provider);

    contract.on("DealCreated", (dealId, tokenId, seller, buyer, price) => {
      this.broadcast("deal.created", {
        event: "DealCreated",
        dealId: dealId.toString(),
        tokenId: tokenId.toString(),
        seller,
        buyer,
        price: ethers.formatEther(price),
      });
    });

    contract.on("SellerSigned", (dealId) => {
      this.broadcast("escrow", { event: "SellerSigned", dealId: dealId.toString() });
    });

    contract.on("BuyerFunded", (dealId, amount) => {
      this.broadcast("escrow", {
        event: "BuyerFunded",
        dealId: dealId.toString(),
        amount: ethers.formatEther(amount),
      });
    });

    contract.on("NotaryValidated", (dealId) => {
      this.broadcast("escrow", { event: "NotaryValidated", dealId: dealId.toString() });
    });

    contract.on("DealCompleted", (dealId, dgiAmount, ancfccAmount, sellerNet) => {
      this.broadcast("deal.completed", {
        event: "DealCompleted",
        dealId: dealId.toString(),
        dgiAmount: ethers.formatEther(dgiAmount),
        ancfccAmount: ethers.formatEther(ancfccAmount),
        sellerNet: ethers.formatEther(sellerNet),
      });
    });

    contract.on("DealCancelled", (dealId, reason) => {
      this.broadcast("deal.cancelled", {
        event: "DealCancelled",
        dealId: dealId.toString(),
        reason,
      });
    });

    this.contracts.escrow = contract;
  }

  _listenFridda(address) {
    const contract = new ethers.Contract(address, FRIDDA_EVENTS, this.provider);

    contract.on("SuccessionOpened", (dossierId, nftTokenId, deceased) => {
      this.broadcast("succession.opened", {
        event: "SuccessionOpened",
        dossierId: dossierId.toString(),
        nftTokenId: nftTokenId.toString(),
        deceased,
      });
    });

    contract.on("SuccessionFinalized", (dossierId) => {
      this.broadcast("succession.finalized", {
        event: "SuccessionFinalized",
        dossierId: dossierId.toString(),
      });
    });

    contract.on("ProposalCreated", (proposalId, dossierId, voteType) => {
      const types = ["Vente", "Location", "Rénovation"];
      this.broadcast("fridda", {
        event: "ProposalCreated",
        proposalId: proposalId.toString(),
        dossierId: dossierId.toString(),
        voteType: types[voteType] || "Inconnu",
      });
    });

    contract.on("VoteCast", (proposalId, voter, inFavor, weight) => {
      this.broadcast("fridda", {
        event: "VoteCast",
        proposalId: proposalId.toString(),
        voter,
        inFavor,
        weight: weight.toString(),
      });
    });

    contract.on("ProposalExecuted", (proposalId) => {
      this.broadcast("fridda", {
        event: "ProposalExecuted",
        proposalId: proposalId.toString(),
      });
    });

    this.contracts.fridda = contract;
  }

  _listenJustice(address) {
    const contract = new ethers.Contract(address, JUSTICE_EVENTS, this.provider);

    contract.on("ActionProposed", (actionId, actionType, tokenId, proposedBy) => {
      const types = ["Gel", "Destruction-Réémission", "Récupération sociale"];
      this.broadcast("justice.action", {
        event: "ActionProposed",
        actionId: actionId.toString(),
        actionType: types[actionType] || "Inconnu",
        tokenId: tokenId.toString(),
        proposedBy,
        severity: "high",
      });
    });

    contract.on("ActionExecuted", (actionId, actionType, tokenId) => {
      const types = ["Gel", "Destruction-Réémission", "Récupération sociale"];
      this.broadcast("justice.executed", {
        event: "ActionExecuted",
        actionId: actionId.toString(),
        actionType: types[actionType] || "Inconnu",
        tokenId: tokenId.toString(),
        severity: "critical",
      });
    });

    contract.on("RecoveryRequested", (recoveryId, tokenId, currentOwner, newWallet) => {
      this.broadcast("justice", {
        event: "RecoveryRequested",
        recoveryId: recoveryId.toString(),
        tokenId: tokenId.toString(),
        currentOwner,
        newWallet,
      });
    });

    contract.on("RecoveryExecuted", (recoveryId, tokenId, newWallet) => {
      this.broadcast("justice", {
        event: "RecoveryExecuted",
        recoveryId: recoveryId.toString(),
        tokenId: tokenId.toString(),
        newWallet,
      });
    });

    this.contracts.justice = contract;
  }

  _listenRegistry(address) {
    const contract = new ethers.Contract(address, REGISTRY_EVENTS, this.provider);

    contract.on("FraudPrevented", (tokenId, reason) => {
      this.broadcast("fraud.alert", {
        event: "FraudPrevented",
        tokenId: tokenId.toString(),
        reason,
        severity: "critical",
      });
    });

    contract.on("TransactionRecorded", (tokenId, from, to, txType) => {
      this.broadcast("registry", {
        event: "TransactionRecorded",
        tokenId: tokenId.toString(),
        from,
        to,
        txType,
      });
    });

    this.contracts.registry = contract;
  }

  // ── Stats ───────────────────────────────────────────────

  getStats() {
    return {
      connectedClients: this.clients.size,
      listeningContracts: Object.keys(this.contracts),
      uptime: process.uptime(),
    };
  }

  // ── Cleanup ─────────────────────────────────────────────

  async stop() {
    for (const [name, contract] of Object.entries(this.contracts)) {
      await contract.removeAllListeners();
    }
    this.wss.close();
    console.log("🔕 NotificationService arrêté");
  }
}

module.exports = NotificationService;
