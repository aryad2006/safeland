const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SafeLand Morocco API",
      version: "1.0.0",
      description:
        "API REST pour la plateforme de cadastre blockchain souverain du Maroc. " +
        "Gère les titres fonciers NFT (ERC-721), l'escrow fiscal, les successions Fridda (ERC-1155) " +
        "et les actions judiciaires multi-sig.",
      contact: {
        name: "SafeLand Morocco",
        email: "info@safeland.ma",
        url: "https://www.safeland.ma",
      },
      license: {
        name: "UNLICENSED",
      },
    },
    servers: [
      { url: "http://localhost:3001/api", description: "Développement local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenu via /auth/login (signature MetaMask)",
        },
      },
      schemas: {
        // ─── Auth ───────────────────────────────────────────
        NonceRequest: {
          type: "object",
          required: ["address"],
          properties: {
            address: { type: "string", example: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
          },
        },
        NonceResponse: {
          type: "object",
          properties: {
            nonce: { type: "string", example: "SafeLand Auth 1708300000-abc123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["address", "signature"],
          properties: {
            address: { type: "string" },
            signature: { type: "string" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            address: { type: "string" },
            role: { type: "string", enum: ["admin", "agent", "notary", "justice", "owner", "buyer"] },
          },
        },
        // ─── Property ──────────────────────────────────────
        CreatePropertyRequest: {
          type: "object",
          required: ["to", "titreFoncier", "surface", "propertyType", "city", "gpsCoords", "documentHash"],
          properties: {
            to: { type: "string", description: "Adresse du propriétaire" },
            titreFoncier: { type: "string", example: "TF-12345/C" },
            surface: { type: "integer", example: 250 },
            propertyType: { type: "string", enum: ["residential", "commercial", "agricultural", "industrial"] },
            city: { type: "string", example: "Casablanca" },
            gpsCoords: { type: "string", example: "33.5731,-7.5898" },
            documentHash: { type: "string", example: "QmXoYpTUqdFN..." },
          },
        },
        PropertyResponse: {
          type: "object",
          properties: {
            tokenId: { type: "string" },
            owner: { type: "string" },
            locked: { type: "boolean" },
            titreFoncier: { type: "string" },
            surface: { type: "string" },
            propertyType: { type: "string" },
            city: { type: "string" },
            gpsCoords: { type: "string" },
            documentHash: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            history: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  from: { type: "string" },
                  to: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                  documentHash: { type: "string" },
                },
              },
            },
          },
        },
        // ─── Escrow ────────────────────────────────────────
        CreateDealRequest: {
          type: "object",
          required: ["tokenId", "seller", "buyer", "price"],
          properties: {
            tokenId: { type: "string" },
            seller: { type: "string" },
            buyer: { type: "string" },
            price: { type: "string", description: "Prix en ETH", example: "10.5" },
          },
        },
        DealResponse: {
          type: "object",
          properties: {
            dealId: { type: "string" },
            tokenId: { type: "string" },
            seller: { type: "string" },
            buyer: { type: "string" },
            price: { type: "string" },
            status: { type: "string", enum: ["Created", "SellerSigned", "BuyerFunded", "NotarySigned", "Completed", "Cancelled"] },
            notary: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        FeesResponse: {
          type: "object",
          properties: {
            dealId: { type: "string" },
            totalPrice: { type: "string" },
            dgiFee: { type: "string" },
            dgiPercent: { type: "string", example: "4%" },
            ancfccFee: { type: "string" },
            ancfccPercent: { type: "string", example: "1%" },
            sellerAmount: { type: "string" },
            sellerPercent: { type: "string", example: "95%" },
          },
        },
        // ─── Fridda ────────────────────────────────────────
        CreateSuccessionRequest: {
          type: "object",
          required: ["nftTokenId", "heirs", "shares"],
          properties: {
            nftTokenId: { type: "string" },
            heirs: { type: "array", items: { type: "string" } },
            shares: { type: "array", items: { type: "integer" }, description: "Parts sur 24 total" },
            adoulCid: { type: "string" },
            notaryCid: { type: "string" },
          },
        },
        DossierResponse: {
          type: "object",
          properties: {
            dossierId: { type: "string" },
            nftTokenId: { type: "string" },
            totalShares: { type: "string" },
            heirs: { type: "array", items: { type: "string" } },
            shares: { type: "array", items: { type: "string" } },
            distributed: { type: "boolean" },
            finalized: { type: "boolean" },
          },
        },
        // ─── Timelock ──────────────────────────────────────
        TimelockScheduleRequest: {
          type: "object",
          required: ["target", "salt", "delay", "description"],
          properties: {
            target:      { type: "string", description: "Adresse du contrat cible" },
            value:       { type: "string", description: "Valeur ETH envoyée avec l'appel", example: "0" },
            data:        { type: "string", description: "Calldata encodé en hex", example: "0x" },
            salt:        { type: "string", description: "Salt bytes32 unique (0x + 64 hex)", example: "0xabc..." },
            delay:       { type: "integer", description: "Délai en secondes (≥ 86400 = 1 jour)", example: 86400 },
            description: { type: "string", description: "Description lisible de l'opération" },
          },
        },
        TimelockOperationResponse: {
          type: "object",
          properties: {
            message:   { type: "string" },
            txHash:    { type: "string" },
            operationId: { type: "string", description: "keccak256 de la proposition" },
          },
        },
        TimelockStatusResponse: {
          type: "object",
          properties: {
            operationId: { type: "string" },
            status: { type: "string", enum: ["unknown", "pending", "ready", "done"] },
            timestamp: { type: "integer", description: "Timestamp d'exécution possible (unix)" },
          },
        },
        // ─── Bank ──────────────────────────────────────────────
        BankScoreResponse: {
          type: "object",
          properties: {
            tokenId:    { type: "string" },
            scoreClass: { type: "string", enum: ["A", "B", "C", "D", "E"] },
            ltv:        { type: "number",  description: "Loan-to-value ratio", example: 0.7 },
            maxLoan:    { type: "string",  description: "Montant maximum empruntable en ETH" },
            surface:    { type: "string" },
            city:       { type: "string" },
            propertyType: { type: "string" },
          },
        },
        BankHypothequeRequest: {
          type: "object",
          required: ["tokenId", "bankAddress", "loanAmount"],
          properties: {
            tokenId:     { type: "string" },
            bankAddress: { type: "string", description: "Adresse du contrat/compte bancaire" },
            loanAmount:  { type: "string", description: "Montant emprunté en ETH", example: "5.0" },
          },
        },
        BankHypothequeResponse: {
          type: "object",
          properties: {
            message:   { type: "string" },
            txHash:    { type: "string" },
            tokenId:   { type: "string" },
            bankAddress: { type: "string" },
            loanAmount:  { type: "string" },
          },
        },
        BankStatusResponse: {
          type: "object",
          properties: {
            tokenId:  { type: "string" },
            locked:   { type: "boolean" },
            hypotheque: {
              type: "object",
              properties: {
                bank:    { type: "string" },
                amount:  { type: "string" },
                active:  { type: "boolean" },
              },
            },
          },
        },
        // ─── Common ────────────────────────────────────────
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        TxResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            txHash: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentification via signature MetaMask + JWT" },
      { name: "Properties", description: "Gestion des titres fonciers NFT (ERC-721)" },
      { name: "Escrow", description: "Transactions sécurisées avec split fiscal automatique" },
      { name: "Fridda", description: "Successions — distribution de parts ERC-1155 et gouvernance" },
      { name: "IPFS",     description: "Upload et récupération de documents sur IPFS" },
      { name: "Timelock", description: "Gouvernance différée — schedule / execute / cancel opérations admin" },
      { name: "Bank B2B", description: "Interface bancaire — scoring LTV, hypothèques et MAINLEVÉE" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
