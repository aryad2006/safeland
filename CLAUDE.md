# SafeLand Morocco - Guide Projet

## Stack Technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Smart Contracts | Solidity + OpenZeppelin Upgradeable (UUPS) | 0.8.24 / OZ 5.x |
| Blockchain Dev | Hardhat + hardhat-toolbox + hardhat-upgrades | 2.22+ |
| Backend | Node.js + Express + better-sqlite3 + ws | Node 20, Express 4.18 |
| Frontend | Next.js 14 (App Router) + React 18 + Tailwind CSS 3.4 | |
| Web3 | ethers.js v6 (backend signer + frontend BrowserProvider/MetaMask) | 6.13 |
| Auth | JWT (jsonwebtoken) + signature MetaMask (nonce challenge) | |
| Tests contracts | Mocha + Chai (via hardhat-toolbox) | ~206 tests |
| Tests backend | Jest 30 + supertest 7 | ~167 tests |
| Tests E2E | Playwright (Chromium + iPhone 13) | |
| Linting | ESLint (backend v10, frontend next/core-web-vitals), solhint | |
| IPFS | Pinata API | |
| Indexation | TheGraph subgraph (6 datasources) | |
| Infra | Docker Compose (hardhat + backend + frontend + deployer) | |

## Architecture

```
safeland/
├── contracts/           # 6 contrats Solidity (UUPS upgradeable)
│   ├── SafeLandNFT.sol         # ERC-721 titres fonciers
│   ├── SafeLandRegistry.sol    # Index centralisé + stats
│   ├── SafeLandEscrow.sol      # Sequestre vente + fiscalite (DGI 4% + ANCFCC 1%)
│   ├── SafeLandFridda.sol      # Succession ERC-1155 + gouvernance heritiers
│   ├── SafeLandJustice.sol     # Actions judiciaires multi-sig (Freeze/BurnRemint)
│   └── SafeLandTimelock.sol    # Operations admin differees (1-30 jours)
├── test/                # Tests smart contracts (Mocha/Chai, 206 tests)
├── scripts/             # deploy.js, seed.js, sync-abis.js, update-env.js
├── backend/
│   ├── src/
│   │   ├── index.js            # Point d'entree Express + WS
│   │   ├── app.js              # Factory Express (pour tests)
│   │   ├── config/             # blockchain.js, database.js, security.js, swagger.js
│   │   ├── middleware/auth.js  # JWT authenticate + requireRole
│   │   ├── routes/             # auth, properties, escrow, fridda, justice, timelock, bank, ipfs
│   │   ├── services/           # notifications.js (WebSocket), ipfs.js (Pinata)
│   │   └── utils/validators.js # Validation inputs (addresses, hashes, GPS, etc.)
│   └── tests/           # Tests Jest (7 suites, 167 tests)
├── frontend/
│   └── src/
│       ├── app/                # 9 pages (App Router): dashboard, properties, escrow, fridda, justice, bank, timelock, stats
│       ├── components/         # Navbar, LanguageSwitcher, NotificationBell
│       ├── context/WalletContext.js  # MetaMask + JWT + apiCall helper
│       ├── hooks/              # useContracts.js, useNotifications.js (WebSocket)
│       ├── i18n/               # FR/EN/AR + RTL auto
│       └── contracts/          # ABIs JSON (synced via sync-abis.js)
├── subgraph/            # TheGraph (schema.graphql + 6 mappings TS)
├── docs/                # Cahier des charges, livre blanc, roadmap, audit, pitch
├── tachydigital/        # Documents administratifs societe (SARL Maroc)
├── hardhat.config.js    # Solidity 0.8.24, optimizer 200 runs, viaIR
├── docker-compose.yml   # 4 services: hardhat, deployer, backend, frontend
└── deployed-addresses.json  # Adresses contrats apres deploy
```

## Commandes Utiles

### Blockchain / Contrats
```bash
npm run node              # Hardhat local network (port 8545)
npm run compile           # Compiler les contrats
npm test                  # Tests smart contracts (Mocha/Chai)
npm run test:coverage     # Coverage Solidity
npm run deploy:local      # Deploy sur localhost
npm run deploy:testnet    # Deploy sur Sepolia
npm run seed              # Donnees de demo (6 proprietes, 1 deal, 1 succession)
npm run sync-abis         # Sync ABIs -> subgraph + frontend
npm run update-env:write  # deployed-addresses.json -> frontend/.env.local
npm run lint:sol          # Linting Solidity (solhint)
```

### Backend (cd backend/)
```bash
npm run dev               # Nodemon (port 3001) + WebSocket /ws
npm start                 # Production
npm test                  # Jest (167 tests, --forceExit --detectOpenHandles)
npm run test:coverage     # Jest + coverage
npm run lint              # ESLint src/
```

### Frontend (cd frontend/)
```bash
npm run dev               # Next.js dev (port 3000)
npm run build             # Build production (standalone)
npm run lint              # ESLint (next/core-web-vitals)
npm run test:e2e          # Playwright headless
npm run test:e2e:ui       # Playwright UI mode
```

### Docker
```bash
docker-compose up -d      # Tout lancer (hardhat + deploy + backend + frontend)
```

### Workflow dev local complet
```bash
npm run node              # Terminal 1
npm run deploy:local      # Terminal 2 (une fois)
npm run seed              # Terminal 2 (optionnel)
npm run update-env:write  # Terminal 2 (une fois)
npm run dev:backend       # Terminal 2
npm run dev:frontend      # Terminal 3
```

## Conventions de Code

### General
- **Langue** : Code en anglais, docs/commentaires en francais
- **Module system** : CommonJS (require/module.exports) partout sauf frontend (ESM via Next.js)
- **Style** : Pas de semicolons en Solidity, semicolons en JS. Indentation 2 espaces
- **Commits** : Format `type: description` (feat, fix, docs, test, refactor)

### Backend
- Routes dans `src/routes/`, un fichier par domaine metier
- Validation via `validateBody(rules)` et `validateParamId()` middlewares
- Auth: `authenticate` puis `requireRole('notary', 'justice', ...)`
- Roles: admin, agent, notary, justice, owner, buyer, conservator, judge, bank
- DB SQLite WAL mode, schema dans `config/database.js`
- Tests: un fichier par route/service, DB isolee par suite (TEST_DB_PATH), mocking contrats via jest.mock
- ESLint: no-var error, eqeqeq always, no-unused-vars warn (ignore _*, next, req, res)

### Frontend
- App Router Next.js 14 (pas de Pages Router)
- Etat global via Context API (WalletContext, I18nContext)
- Alias `@/*` -> `./src/*`
- i18n custom (pas next-intl) avec localStorage, 3 locales (fr/en/ar), RTL auto
- Web3 via ethers.js BrowserProvider + MetaMask
- Composants dans `src/components/`, hooks dans `src/hooks/`
- Icones: lucide-react, Toasts: react-hot-toast

### Smart Contracts
- UUPS proxy pattern (tous les contrats sont upgradeable)
- `initialize()` au lieu de constructor
- AccessControl role-based (pas Ownable)
- ReentrancyGuard sur fonctions payables/critiques
- Events emis pour chaque mutation d'etat
- Structures dans le contrat, pas de librairies externes custom

## Regles a Suivre

1. **Ne jamais commiter .env** — utiliser .env.example comme reference
2. **Toujours deployer via UUPS proxy** — pas de deploiement direct de contrats
3. **Tester avant de push** — `npm test` (root) + `cd backend && npm test`
4. **Valider les inputs** — utiliser validators.js cote backend, require() cote Solidity
5. **Garder les ABIs synchronisees** — `npm run sync-abis` apres toute modif de contrat
6. **WebSocket** — tout evenement blockchain doit etre broadcast via NotificationService
7. **i18n** — toute nouvelle string UI doit etre dans les 3 fichiers de locale
8. **Roles** — ne pas hardcoder les adresses, utiliser AccessControl roles
9. **Tests backend** — isoler la DB par suite, mocker les contrats blockchain

## Pieges Connus

- `SafeLandTimelock.schedule()` prend (target, value, data, salt, delay, description) — pas de predecessor
- `MIN_DELAY()`, `MAX_DELAY()`, `GRACE_PERIOD()` sont des fonctions (pas des properties)
- `validateBody` retourne `{ error, details: [] }` (pas un simple message)
- `isPositiveInteger` rejette 0 (strict > 0)
- SQLite en WAL mode, chemin via `DB_PATH` env var
- BOM PowerShell : utiliser `UTF8Encoding(false)` si generation de fichiers
- MetaMask : ecouter `chainChanged` pour reload (gere dans WalletContext)
