# NOTE DE REPRISE - SafeLand Morocco
> HEAD propre sur `origin/main` -- verifier avec `git log --oneline -5`

## Etat global

| Couche | Etat |
|---|---|
| Smart contracts | 6 contrats UUPS + __gap[50] — 206 tests OK |
| Backend Express | 8 routes + WS notifications — 167 tests (7 suites) OK |
| Subgraph TheGraph | OK codegen + build |
| Frontend Next.js | 9 pages + NotificationBell + useNotifications |
| CI/CD GitHub Actions | 7 jobs (npm audit strict, plus de || true) |
| Docker Compose | SQLite volume + secrets interpoles via ${VAR} |
| Documentation | CDC V3, Livre Blanc V2, Marketing, Guide Utilisateurs, Audit, B2G (10 docs) |

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
- isPositiveInteger : accepte >= 0 (inclut 0), isPositiveIntegerArray : strictement > 0
- JWT secret : toujours passer par security.js, pas process.env directement
- SQLite WAL mode, DB_PATH depuis l'env, volume Docker backend_data
- SafeLandTimelock.schedule() : PAS de param `predecessor`, interface = (target, value, data, salt, delay, description)
- SafeLandTimelock.schedule() : require(target != address(0)) ajoute session 12
- SafeLandTimelock constants : MIN_DELAY(), MAX_DELAY(), GRACE_PERIOD() -- appeles comme des fonctions
- Apres `npx hardhat compile` : lancer `npm run sync-abis` pour syncer subgraph + frontend
- SafeLandRegistry.GlobalStats : champ renomme `justiceOverrides` (anciennement `justicOverrides`, typo corrige session 12)
- SafeLandJustice.executeRecovery() : nouvelle fonction ajoutee session 12 pour completer Social Recovery
- docker-compose.yml : secrets interpoles via ${PRIVATE_KEY:-default}, creer .env.docker pour surcharger

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
| 10 | f837b58 | ESLint backend (0 warn), WS auto-refresh properties+escrow, MetaMask chainChanged reload |
| 11 | 8df3f7d | Audit technique complet (78 findings), CDC V3, Livre Blanc V2, Marketing, Guide Utilisateurs, Dossier B2G (10 docs) |
| 12 | (HEAD) | Fix 11 issues critiques/majeurs (contrats + backend + frontend + infra), 373 tests verts |

## Corrections session 12 (audit -> fix)

### Smart Contracts
- `SafeLandEscrow.notaryComplete()` : transfert NFT AVANT les paiements (CEI strict)
- `SafeLandEscrow.createDeal()` : ajout `require(seller != buyer)`
- `SafeLandJustice.executeAction()` : `action.executed = true` deplace APRES appels NFT
- `SafeLandJustice.executeRecovery()` : nouvelle fonction (Social Recovery complete)
- `SafeLandRegistry.GlobalStats` : renommage `justicOverrides` -> `justiceOverrides`
- `SafeLandTimelock.schedule()` : ajout `require(target != address(0))`
- 6 contrats : ajout `uint256[50] private __gap` (storage gap pour upgrades)

### Backend
- `routes/properties.js` GET / : validation req.query (city string, owner adresse)
- `utils/validators.js` : isPositiveIntegerArray clarifie (strictement > 0)
- `services/notifications.js` : removeAllListeners() avant retry WS (fix memory leak)

### Frontend
- `timelock/page.js` : `data: operation.data || "0x"` (plus hardcode)

### Infra
- `docker-compose.yml` : secrets interpoles `${PRIVATE_KEY:-default}` au lieu de hardcode
- `.github/workflows/ci.yml` : npm audit strict (retire || true)

## Documentation generee (session 11)

| Document | Emplacement |
|---|---|
| Audit Technique Complet | `docs/AUDIT-TECHNIQUE-COMPLET.md` |
| CDC Complet V3 | `docs/CDC-COMPLET-V3.md` |
| Livre Blanc V2 | `docs/LIVRE-BLANC-V2.md` |
| Livre Marketing | `docs/LIVRE-MARKETING.md` |
| Guide Utilisateurs | `docs/GUIDE-UTILISATEURS.md` |
| Dossier B2G (10 docs) | `B2G/00-INDEX-DOSSIER-B2G.md` a `B2G/09-MODELE-ECONOMIQUE.md` |
| Exports DOCX + ODT | `C:\Users\USER\docs-safeland\` (30 fichiers) |
| Scripts conversion | `scripts/convert-docs.py`, `scripts/convert-odt.py` |

## Prochaines etapes

### Court terme (faisable sans dependances)

- [ ] Sync ABIs apres modif contrats : `npm run compile && npm run sync-abis`
- [ ] Tests backend manquants : ecrire tests pour routes escrow, fridda, justice, properties (couverture actuelle ~40%)
- [ ] WS auto-refresh pages bank, justice, fridda (meme pattern que properties/escrow/timelock)
  - bank : channels `bank.*`
  - justice : channels `justice.action`, `justice.executed`
  - fridda : channels `succession.opened`, `succession.finalized`
- [ ] NotificationBell : labels i18n (deplacer du francais hardcode vers fr.json/en.json/ar.json)
- [ ] Fridda <-> NFT sync (SC-M3) : executeProposal() doit appeler transferProperty() si vote de vente
- [ ] Nonce avec adresse (BE-M1) : inclure address dans le message signe
- [ ] `npx hardhat coverage` : rapport Istanbul lignes/branches/fonctions
- [ ] `hardhat-gas-reporter` : cout gas par fonction

### Moyen terme (dependances requises)

- [ ] Deploy Sepolia (ALCHEMY_SEPOLIA_URL + cle privee avec ETH test)
  ```bash
  npx hardhat run scripts/deploy-sepolia.js --network sepolia
  npm run update-env:write && npm run sync-abis
  ```
- [ ] TheGraph Studio (adresses Sepolia dans subgraph.yaml + startBlocks)
- [ ] Audit externe CertiK / Trail of Bits (~400K MAD)
- [ ] JWT httpOnly cookies (remplacer localStorage, refactoring CORS)
- [ ] Tests E2E Playwright avec MetaMask reel
- [ ] Migration SQLite -> PostgreSQL (production multi-instance)

### Long terme (pre-production)

- [ ] Monitoring on-chain (Forta / OpenZeppelin Defender)
- [ ] Convention PPP signature ANCFCC
- [ ] Pilote 3 conservations (Casablanca, Rabat, Marrakech)
- [ ] Formation 20 agents ANCFCC
- [ ] Certification CNDP + DGSSI
