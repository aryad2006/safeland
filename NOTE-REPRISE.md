# SafeLand — Note Technique de Reprise

> Date : 2025 (session courante)
> Derniers commits connus : `84ae9bc` (backend hardening + SafeLandTimelock) → `8730edf` (Timelock/Bank integration)
> État : **Modifications non commitées** — frontend Timelock/Bank, CI/CD mis à jour

---

## 1. ÉTAT GIT — Changements non commités

### Fichiers créés / modifiés dans cette session :
```
A  frontend/src/app/timelock/page.js      → page admin Timelock complète
A  frontend/src/app/bank/page.js          → page B2B Banques complète (4 onglets)
M  frontend/src/components/Navbar.js      → liens timelock/bank conditionnels par rôle
M  frontend/src/app/dashboard/page.js     → cards Timelock+Bank, 6 contracts dans archi
M  frontend/src/i18n/locales/fr.json      → clés timelock.* + bank.* + nav.timelock/bank
M  frontend/src/i18n/locales/en.json      → idem en anglais
M  frontend/src/i18n/locales/ar.json      → idem en arabe
M  frontend/e2e/app.spec.js               → tests navigation /timelock et /bank
M  .github/workflows/ci.yml               → ajout job Jest backend + job E2E Playwright
```

### Commande pour commiter :
```bash
git add -A
git commit -m "feat: frontend Timelock+Bank, i18n complet, CI Jest+E2E, navbar role-based"
```

---

## 2. ROADMAP COMPLÉTÉE (10/10 + extensions)

| # | Tâche | Commit | Statut |
|---|-------|--------|--------|
| 1 | Deploy script Sepolia | `ed35cea` | ✅ |
| 2 | Coverage 99% lignes / 96 tests | `ed35cea` | ✅ |
| 3 | Subgraph TheGraph (14 entités, 24 events) | `ae389b5` | ✅ |
| 4 | WebSocket notifications temps réel | `2e6c14d` | ✅ |
| 5 | Audit Slither (26 findings, 4 critiques fixés) | `67bcf5b` | ✅ |
| 6 | CI/CD GitHub Actions (6 jobs) | `0bdde3f` | ✅ |
| 7 | README avec badges | `1576853` | ✅ |
| 8 | Tests E2E Playwright (14 tests) | `4eb3e3b` | ✅ |
| 9 | Gas optimizations (5 contrats) | `e236422` | ✅ |
| 10 | i18n FR/AR/EN | `9877761` | ✅ |
| 11 | SafeLandTimelock contract + backend routes | `84ae9bc` + `8730edf` | ✅ |
| 12 | Frontend Timelock + Bank + i18n + CI/CD complet | session courante | ✅ |

---

## 3. ARCHITECTURE TECHNIQUE

### Smart Contracts (Solidity 0.8.24, OZ v5 UUPS)
- `SafeLandNFT.sol` — ERC-721 titres fonciers, 5 rôles, hypothèques, mainlevées
- `SafeLandRegistry.sol` — index central, stats globales
- `SafeLandEscrow.sol` — escrow atomique, split fiscal 4%+1%+95%
- `SafeLandFridda.sol` — ERC-1155 succession, 24 parts islamiques
- `SafeLandJustice.sol` — multi-sig judiciaire, gel, burn & remint
- `SafeLandTimelock.sol` — governance timelock (1j-30j délai, 14j grâce)

### Backend (Express.js) — 131 tests Jest
- Routes : auth, properties, escrow, fridda, justice, ipfs, **timelock**, **bank** (nouveaux)
- Middleware : JWT, role-based auth, rate-limit (100/15min), helmet, cors
- WebSocket notifications, input validation (`validators.js`, `database.js`)
- ⚠️ Stockage utilisateurs en mémoire (Map) — pas de persistance

### Frontend (Next.js 14 App Router)
- Pages : landing, dashboard, properties, escrow, fridda, justice, stats, **timelock**, **bank**
- i18n : I18nProvider context + LanguageSwitcher (FR/EN/AR avec RTL) — clés complètes
- Wallet : MetaMask via WalletContext
- Navbar : liens conditionnels selon `role` (timelock=admin, bank=bank|admin)
- Dashboard : cards conditionnelles par rôle

### CI/CD (`.github/workflows/ci.yml`)
- `contracts` — compile + hardhat test + gas report
- `backend` — eslint + Jest (131 tests) avec env vars CI
- `frontend` — npm ci + next build
- `security` — npm audit (root, backend, frontend)
- `slither` — analyse statique Solidity
- `coverage` — hardhat coverage
- `e2e` — Playwright tests (branch main seulement)

### Infra
- Hardhat 2.22.x, optimizer 200 runs, viaIR=true
- Docker : 4 services (hardhat, deployer, backend, frontend)
- TheGraph subgraph : TimelockOperation entity + 24 events

---

## 4. PROBLÈMES CONNUS

1. **Clé privée Hardhat en clair** dans docker-compose et blockchain.js — OK pour dev, à sécuriser pour prod
2. **JWT secret fallback** faible (`safeland-dev-secret`) — utiliser .env en prod
3. **Stockage mémoire** des nonces/users dans auth.js — à migrer vers SQLite/Redis
4. **Playwright E2E** — ne tourne pas sans serveur Next.js démarré (webServer config à ajouter)

---

## 5. COMMANDES UTILES

```bash
# Tests smart contracts
npx hardhat test

# Coverage
npx hardhat coverage

# Tests backend
cd backend && npx jest --forceExit --coverage

# Build frontend
cd frontend && npm run build

# Docker complet
docker-compose up --build

# Déploiement Sepolia
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

---

## 6. FICHIERS CLÉS POUR LA REPRISE

| Fichier | Rôle |
|---------|------|
| `contracts/SafeLandTimelock.sol` | Contrat gouvernance timelock |
| `backend/src/routes/timelock.js` | API admin timelock (schedule/execute/cancel) |
| `backend/src/routes/bank.js` | API B2B banques (score/hypothèque/mainlevée) |
| `frontend/src/app/timelock/page.js` | UI admin timelock |
| `frontend/src/app/bank/page.js` | UI B2B banques (4 onglets) |
| `frontend/src/i18n/locales/fr.json` | Référence clés i18n (complet) |
| `.github/workflows/ci.yml` | Pipeline CI 7 jobs |
| `subgraph/src/mappings/timelock.ts` | Mapping TheGraph timelock |

