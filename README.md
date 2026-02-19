# 🏗️ SafeLand Morocco — Foncier 2.0

[![CI](https://github.com/USERNAME/safeland/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/safeland/actions/workflows/ci.yml)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-v5-4E5EE4?logo=openzeppelin)](https://www.openzeppelin.com/contracts)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Propriétaire-red)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-96%20passing-brightgreen)](test/)
[![Coverage](https://img.shields.io/badge/Coverage-99%25%20lines-brightgreen)](docs/audit-securite.md)
[![Slither](https://img.shields.io/badge/Slither-Audited-blue)](docs/audit-securite.md)

> **Plateforme NFT de Sécurisation Foncière au Maroc (B2G).**
> Transformer le patrimoine national en un actif numérique souverain, liquide et infalsifiable.

---

## 📋 Table des matières

- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Installation](#-installation)
- [Commandes](#-commandes)
- [Tests & Couverture](#-tests--couverture)
- [Déploiement](#-déploiement)
- [API Backend](#-api-backend)
- [Frontend](#-frontend)
- [Subgraph TheGraph](#-subgraph-thegraph)
- [Sécurité](#-sécurité)
- [Stack Technique](#-stack-technique)
- [Cadre Légal](#-cadre-légal)
- [Documentation](#-documentation)

---

## 🏛 Architecture

```
safeland/
├── contracts/              # 5 Smart Contracts Solidity (UUPS Upgradeable)
│   ├── SafeLandNFT.sol            # ERC-721 — Titre foncier NFT
│   ├── SafeLandRegistry.sol       # Registre central par ville/propriétaire
│   ├── SafeLandEscrow.sol         # Smart-Escrow (séquestre atomique fiscal)
│   ├── SafeLandFridda.sol         # ERC-1155 — Succession automatisée (24 parts)
│   └── SafeLandJustice.sol        # Justice Override multi-sig (Burn & Remint)
├── test/                   # 96 tests Hardhat (Chai + Ethers.js v6)
├── scripts/                # Deploy local + Sepolia + seed data
├── backend/                # API Express.js + WebSocket notifications
│   └── src/
│       ├── routes/                # REST API (auth, properties, escrow, fridda, IPFS)
│       ├── services/              # Notifications temps réel (WebSocket)
│       └── config/                # Swagger OpenAPI
├── frontend/               # Next.js 14 App Router + Tailwind CSS
│   └── src/
│       ├── app/                   # Pages (landing, dashboard, properties, escrow...)
│       ├── components/            # Navbar, NotificationBell
│       ├── hooks/                 # useContracts, useNotifications
│       └── context/               # WalletContext (MetaMask)
├── subgraph/               # TheGraph indexation on-chain
│   ├── schema.graphql             # 14 entités GraphQL
│   └── src/mappings/              # Handlers pour 24 événements
├── docs/                   # CDC technique, business, livre blanc, audit
├── .github/workflows/      # CI/CD (compile, test, gas, Slither, coverage)
└── docker-compose.yml      # 3 services (hardhat, backend, frontend)
```

## 📜 Smart Contracts

| Contrat | Standard | Description | Fonctions clés |
|---------|----------|-------------|----------------|
| **SafeLandNFT** | ERC-721 | Titre foncier NFT | `createProperty`, `transferProperty`, `addEncumbrance`, `freezeByJustice` |
| **SafeLandRegistry** | — | Index central | `registerProperty`, `recordTransaction`, `getPropertiesByCity` |
| **SafeLandEscrow** | — | Séquestre atomique | `createDeal`, `buyerDeposit`, `notaryComplete` (4% DGI + 1% ANCFCC) |
| **SafeLandFridda** | ERC-1155 | Succession (24 parts) | `openSuccession`, `distributeShares`, `vote`, `executeProposal` |
| **SafeLandJustice** | — | Multi-sig judiciaire | `proposeAction`, `signAction`, `executeAction` (Freeze/BurnRemint/Recovery) |

**Rôles RBAC** : ADMIN, NOTARY, ANCFCC_OPERATOR, CONSERVATOR, JUDGE

## 🚀 Installation

### Prérequis

- Node.js >= 18
- npm >= 9
- MetaMask (pour le frontend)

### Setup

```bash
# Cloner le repo
git clone https://github.com/USERNAME/safeland.git
cd safeland

# Installer les dépendances (root + contracts)
npm install

# Installer le backend
cd backend && npm install && cd ..

# Installer le frontend
cd frontend && npm install && cd ..

# Copier les variables d'environnement
cp .env.example .env
```

## ⚡ Commandes

| Commande | Description |
|---|---|
| `npm run compile` | Compiler les Smart Contracts |
| `npm test` | Lancer les 96 tests |
| `npm run test:coverage` | Tests avec couverture de code |
| `npm run node` | Lancer un nœud local Hardhat (port 8545) |
| `npm run deploy:local` | Déployer les 5 contrats en local |
| `npm run seed` | Injecter les données de démo |
| `npm run dev:backend` | Backend API (port 3001) + WebSocket |
| `npm run dev:frontend` | Frontend Next.js (port 3000) |

### Docker

```bash
docker-compose up -d    # 3 services : hardhat + backend + frontend
```

## 🧪 Tests & Couverture

```bash
# Tests unitaires (96 tests)
npx hardhat test

# Couverture
npx hardhat coverage
```

| Métrique | Score |
|----------|-------|
| Statements | **98.76%** |
| Branches | **69.08%** |
| Functions | **96.39%** |
| Lines | **99.04%** |

## 🌐 Déploiement

### Local
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/seed.js --network localhost
```

### Sepolia Testnet
```bash
# Configurer SEPOLIA_RPC_URL et PRIVATE_KEY dans .env
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

## 🔌 API Backend

- **Base URL** : `http://localhost:3001/api`
- **Swagger** : `http://localhost:3001/api/docs`
- **WebSocket** : `ws://localhost:3001/ws`
- **Health** : `http://localhost:3001/api/health`

### Endpoints principaux

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/properties` | GET | Lister les propriétés |
| `/api/escrow` | POST | Créer un deal escrow |
| `/api/fridda` | POST | Ouvrir une succession |
| `/api/auth/login` | POST | Authentification JWT |
| `/api/notifications/stats` | GET | Stats WebSocket |

## 🎨 Frontend

- **Landing** : `http://localhost:3000` — Page marketing
- **Dashboard** : `http://localhost:3000/dashboard` — Interface principale
- **Connexion** : MetaMask (détection automatique du rôle)

## 📊 Subgraph TheGraph

```bash
cd subgraph
npm install
npx graph codegen
npx graph build
```

Indexe **24 événements** sur **14 entités** GraphQL. Voir [subgraph/README.md](subgraph/README.md).

## 🛡 Sécurité

- **Audit Slither** : 26 findings, 4 corrigés (0 high restant) — [Rapport complet](docs/audit-securite.md)
- **Pattern CEI** : Checks-Effects-Interactions dans tous les transferts ETH
- **OpenZeppelin v5** : AccessControl, ReentrancyGuard, Pausable, UUPS
- **nonReentrant** : Sur toutes les fonctions manipulant des fonds

## 🔧 Stack Technique

| Couche | Technologie |
|--------|-------------|
| Blockchain | Ethereum / Sepolia / Hardhat |
| Smart Contracts | Solidity 0.8.24, OpenZeppelin v5 UUPS |
| Backend | Express.js, ethers.js v6, JWT, Swagger |
| Frontend | Next.js 14, Tailwind CSS, lucide-react |
| Notifications | WebSocket (ws) temps réel |
| Indexation | TheGraph (subgraph) |
| IPFS | Pinata |
| CI/CD | GitHub Actions (compile, test, gas, Slither, coverage) |
| Docker | docker-compose (3 services) |

## ⚖️ Cadre Légal Marocain

| Loi | Objet |
|-----|-------|
| Loi 39-08 | Conservation Foncière |
| Loi 43-20 | Services de Confiance / Signature Électronique |
| Loi 09-08 | Protection des Données Personnelles |
| Loi 53-05 | Échange Électronique de Données Juridiques |
| Dahir 1913 | Régime de l'immatriculation foncière |

## 📚 Documentation

- [Cahier des Charges Technique](docs/cahier-des-charges.md)
- [Cahier des Charges Business](docs/cahier-des-charges-business.md)
- [Livre Blanc](docs/livre-blanc.md)
- [Rapport d'Audit Sécurité](docs/audit-securite.md)
- [Pitch Deck](docs/pitch-deck.md)
- [Roadmap](docs/roadmap.md)

---

## 📄 Licence

Propriétaire — SafeLand Morocco © 2026
