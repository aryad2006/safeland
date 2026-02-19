# SafeLand — Note Technique de Reprise

> Date : 19 février 2026  
> Dernier commit : `9877761` — feat: i18n multi-langue FR/AR/EN  
> État : **Modifications non commitées** (11 fichiers modifiés, 1 nouveau)

---

## 1. ÉTAT GIT — Changements non commités

### Fichiers modifiés (à commiter) :
```
M  backend/Dockerfile              → ajout COPY artifacts/, volume deploy
M  backend/src/index.js            → ajout route /api/justice
M  docker-compose.yml              → backend depends_on deployer, volume addresses
M  frontend/jsconfig.json          → ajout ignoreDeprecations: "6.0"
M  frontend/next.config.js         → ajout output: "standalone"
M  frontend/src/app/dashboard/page.js → i18n avec t() (terminé)
M  frontend/src/i18n/locales/ar.json  → clés étendues (dashboard→stats complet)
M  frontend/src/i18n/locales/en.json  → clés étendues (dashboard→stats complet)
M  frontend/src/i18n/locales/fr.json  → clés étendues (dashboard→stats complet)
M  package-lock.json               → prettier ajouté
M  package.json                    → prettier ajouté
?? backend/src/routes/justice.js   → NOUVEAU — routes API Justice (7 endpoints)
```

### Commande pour commiter :
```bash
cd /Users/imac/Desktop/safeland
git add -A
git commit -m "feat: Docker fixes, Justice API, i18n locales étendues, standalone build"
```

---

## 2. ROADMAP COMPLÉTÉE (10/10)

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

---

## 3. TRAVAIL EN COURS (non commité)

### ✅ Terminé dans cette session :
1. **Fix build frontend** — cache `.next/` nettoyé, `output: "standalone"` ajouté, `ignoreDeprecations` pour jsconfig
2. **Fix Docker** — backend Dockerfile copie artifacts, docker-compose: backend `depends_on: deployer`, volume mounted pour deployed-addresses.json
3. **Routes API Justice** — `backend/src/routes/justice.js` (7 endpoints : propose, get, sign, execute, recovery, get-recovery, stats)
4. **Locales étendues** — fr/en/ar.json : ~200 clés chacune, sections dashboard/properties/escrow/fridda/justice/stats complètes
5. **Dashboard i18n** — page dashboard utilise `t()` partout

### 🔄 Reste à faire :
1. **i18n des 5 pages restantes** — escrow, fridda, justice, properties, stats → remplacer les strings hardcodées par `t()`. Les clés de traduction sont DÉJÀ dans les 3 fichiers JSON.
2. **Page Justice** — actuellement utilise `useContracts` (blockchain directe). Incohérence archi : les autres pages passent par l'API backend. Décision : soit migrer vers apiCall() (cohérent), soit laisser en l'état (fonctionnel).
3. **Branch coverage** — 69% branches (81 non testées). Principalement les false-paths des require/revert. Contrats les plus déficitaires : SafeLandNFT (34), SafeLandEscrow (21), SafeLandFridda (18).
4. **Input validation backend** — les routes ne valident que la présence des champs, pas le format.

---

## 4. ARCHITECTURE TECHNIQUE

### Smart Contracts (Solidity 0.8.24, OZ v5 UUPS)
- `SafeLandNFT.sol` — ERC-721 titres fonciers, 5 rôles
- `SafeLandRegistry.sol` — index central, stats globales
- `SafeLandEscrow.sol` — escrow atomique, split fiscal 4%+1%+95%
- `SafeLandFridda.sol` — ERC-1155 succession, 24 parts islamiques
- `SafeLandJustice.sol` — multi-sig judiciaire, gel, burn & remint

### Backend (Express.js)
- Routes : auth, properties, escrow, fridda, **justice** (nouveau), ipfs
- Middleware : JWT, role-based auth, rate-limit (100/15min), helmet, cors
- WebSocket notifications
- ⚠️ Stockage utilisateurs en mémoire (Map) — pas de persistance

### Frontend (Next.js 14 App Router)
- Pages : landing, dashboard, properties, escrow, fridda, justice, stats
- i18n : I18nProvider context + LanguageSwitcher (FR/EN/AR avec RTL)
- Wallet : MetaMask via WalletContext

### Infra
- Hardhat 2.22.x, optimizer 200 runs, viaIR=true
- Docker : 4 services (hardhat, deployer, backend, frontend)
- CI : `.github/workflows/ci.yml` — 6 jobs
- TheGraph subgraph configuré

---

## 5. PROBLÈMES CONNUS

1. **Clé privée Hardhat en clair** dans docker-compose et blockchain.js — OK pour dev, à sécuriser pour prod
2. **JWT secret fallback** faible (`safeland-dev-secret`) — utiliser .env en prod
3. **Stockage mémoire** des nonces/users dans auth.js — à migrer vers SQLite/Redis
4. **Frontend build** — fonctionne après nettoyage `.next/`, le standalone build est actif

---

## 6. COMMANDES UTILES

```bash
# Tests smart contracts (96 tests)
cd /Users/imac/Desktop/safeland && npx hardhat test

# Coverage
npx hardhat coverage

# Build frontend
cd frontend && rm -rf .next && npx next build

# Lint frontend
cd frontend && npx next lint

# Slither audit
slither . --filter-paths "node_modules|@openzeppelin"

# Docker
docker-compose up --build
```

---

## 7. FICHIERS CLÉS POUR LA REPRISE

| Fichier | Rôle |
|---------|------|
| `frontend/src/app/escrow/page.js` | Page à i18n-iser |
| `frontend/src/app/fridda/page.js` | Page à i18n-iser |
| `frontend/src/app/justice/page.js` | Page à i18n-iser + migrer vers apiCall |
| `frontend/src/app/properties/page.js` | Page à i18n-iser |
| `frontend/src/app/stats/page.js` | Page à i18n-iser |
| `frontend/src/i18n/locales/fr.json` | Référence clés i18n |
| `backend/src/routes/justice.js` | Routes Justice (nouveau, non commité) |
| `test/` | Tests à étendre pour coverage branches |
