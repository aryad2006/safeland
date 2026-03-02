# NOTE DE REPRISE - SafeLand Morocco
> HEAD propre sur `origin/main` -- verifier avec `git log --oneline -5`

## Etat global

| Couche | Etat |
|---|---|
| Smart contracts | OK 6 contrats - 206 tests |
| Backend Express | OK 8 routes + WS notifications - 167 tests (7 suites) |
| Subgraph TheGraph | OK codegen + build |
| Frontend Next.js | OK 9 pages + NotificationBell + useNotifications |
| CI/CD GitHub Actions | OK 7 jobs |
| Docker Compose | OK SQLite volume + NEXT_PUBLIC_* + contrats backend |

**Total tests : 373 (206 SC + 167 backend)**

## Contrats deployes

SafeLandNFT, SafeLandRegistry, SafeLandEscrow, SafeLandFridda, SafeLandJustice, SafeLandTimelock

## Workflow de demarrage local

```bash
npm run node                 # terminal 1
npm run deploy:local         # terminal 2
npm run seed
npm run update-env:write     # -> frontend/.env.local
npm run dev:backend          # terminal 3
npm run dev:frontend         # terminal 4
```

## Scripts utilitaires

| Commande | Action |
|---|---|
| `npm run seed` | Demo data (6 props, deal, succession, op Timelock) |
| `npm run update-env` | Affiche NEXT_PUBLIC_* prets a copier |
| `npm run update-env:write` | Ecrit frontend/.env.local |
| `npm run sync-abis` | Sync tous les ABIs Hardhat -> subgraph + frontend |
| `npm test` | Tests smart contracts (206 tests) |
| `cd backend && npm test` | Tests backend (167 tests, 7 suites) |

## Architecture notifications WebSocket

Le backend expose un WebSocket sur `ws://localhost:3001/ws`.
Channels disponibles :
- `all` (defaut), `nft`, `escrow`, `fridda`, `justice`, `registry`, `timelock`
- `property.created`, `property.transferred`, `property.frozen`
- `deal.created`, `deal.completed`, `deal.cancelled`
- `succession.opened`, `succession.finalized`
- `justice.action`, `justice.executed`
- `fraud.alert`
- `timelock.scheduled`, `timelock.executed`, `timelock.cancelled`

Frontend : `useNotifications(channels, options)` hook + `NotificationBell` composant.
La page Timelock se rafraichit automatiquement quand un evenement `timelock.*` arrive.

Env var backend : `TIMELOCK_ADDRESS` (+ NFT/ESCROW/FRIDDA/JUSTICE/REGISTRY_ADDRESS).

## Pieges connus

- BOM PowerShell : Out-File -Encoding utf8 ajoute un BOM -> utiliser [System.IO.File]::WriteAllText avec UTF8Encoding::new($false)
- validateBody retourne { error, details: [] } (cle 'details', pas 'errors')
- isPositiveInteger : accepte > 0, rejette 0
- JWT secret : toujours passer par security.js, pas process.env directement
- SQLite WAL mode, DB_PATH depuis l'env, volume Docker backend_data
- SafeLandTimelock.schedule() : PAS de param `predecessor`, interface = (target, value, data, salt, delay, description)
- SafeLandTimelock constants : MIN_DELAY(), MAX_DELAY(), GRACE_PERIOD() -- appeles comme des fonctions
- Apres `npx hardhat compile` : lancer `npm run sync-abis` pour syncer subgraph + frontend

## Historique des sessions

| Session | Commit | Description |
|---|---|---|
| 1 | 84ae9bc | validators, database, security, auth SQLite, SafeLandTimelock.sol |
| 2 | 8730edf | deploy Timelock, subgraph, routes timelock+bank, 131 tests |
| 3 | 2d96261 | pages timelock+bank, i18n, CI/CD 7 jobs |
| 4 | 7b8c22a | useContracts Timelock, docker-compose SQLite+NEXT_PUBLIC |
| 5 | 15efe47 | blockchain.js Timelock fix, swagger Timelock+Bank, seed Timelock, update-env.js |
| 6 | f0d7405 | ReentrancyGuard Timelock, ipfs 400 fix, 15 tests IPFS, 30 E2E fonctionnels |
| 7 | a705cc1 | sync-abis.js, ABI 54->55 entries apres ReentrancyGuard |
| 8 | 6ec9983 | _listenTimelock WS, TIMELOCK_ADDRESS index.js, 21 tests notifications, 167 total |
| 9 | 71c3514 | Fix useState->useEffect timelock page, WS auto-refresh timelock, NotificationBell labels Timelock |
| 10 | f837b58 | ESLint backend (0 warn), WS auto-refresh properties+escrow, MetaMask chainChanged reload, useNotifications reconnect fix |

## Etat session 10 (HEAD = f837b58)

- `backend/eslint.config.js` : flat config ESLint 10, 0 erreurs/warnings
- `backend/package.json` : script `lint` + eslint/`@eslint/js` en devDeps
- `.github/workflows/ci.yml` : lint step utilise `npm run lint` (plus de `|| true`)
- `frontend/src/hooks/useNotifications.js` : pattern `channelsRef` -- inline arrays desormais sécurisés sans `useMemo`
- `frontend/src/context/WalletContext.js` : `handleChainChanged` fait `window.location.reload()` (spec MetaMask)
- `frontend/src/app/properties/page.js` : auto-refresh WS sur `property.created/transferred/frozen`
- `frontend/src/app/escrow/page.js` : auto-refresh WS sur `deal.created/completed/cancelled/escrow`

## Prochaines etapes

- [ ] Deploiement Sepolia + npm run update-env:write (necessite ALCHEMY_SEPOLIA_URL + cle privee)
- [ ] TheGraph : deploiement reseau decentralise (subgraph.yaml a jour, attendre adresses Sepolia)
- [ ] Slither : analyse securite (necessite Python >= 3.8 + pip install slither-analyzer)
- [ ] Frontend : tests E2E Playwright sur interactions wallet reelles (MetaMask extension)
