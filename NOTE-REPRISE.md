# NOTE DE REPRISE - SafeLand Morocco
> HEAD propre sur `origin/main` -- verifier avec `git log --oneline -5`

## Etat global

| Couche | Etat |
|---|---|
| Smart contracts | OK 6 contrats - 206 tests |
| Backend Express | OK 8 routes - 131 tests |
| Subgraph TheGraph | OK codegen + build |
| Frontend Next.js | OK 9 pages |
| CI/CD GitHub Actions | OK 7 jobs |
| Docker Compose | OK SQLite volume + NEXT_PUBLIC_* |

**Total tests : 337 (206 SC + 131 backend)**

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
| `npm test` | Tests smart contracts |
| `cd backend && npm test` | Tests backend |

## Pieges connus

- BOM PowerShell : Out-File -Encoding utf8 ajoute un BOM -> utiliser [System.IO.File]::WriteAllText avec UTF8Encoding::new(\False)
- validateBody retourne { error, details: [] } (cle 'details', pas 'errors')
- isPositiveInteger : accepte > 0, rejette 0
- JWT secret : toujours passer par security.js, pas process.env directement
- SQLite WAL mode, DB_PATH depuis l'env, volume Docker backend_data

## Historique des sessions

| Session | Commit | Description |
|---|---|---|
| 1 | 84ae9bc | validators, database, security, auth SQLite, SafeLandTimelock.sol |
| 2 | 8730edf | deploy Timelock, subgraph, routes timelock+bank |
| 3 | 2d96261 | pages timelock+bank, i18n, CI/CD 7 jobs |
| 4 | 7b8c22a | useContracts Timelock, docker-compose SQLite+NEXT_PUBLIC |
| 5 | courant | blockchain.js Timelock fix, swagger Timelock+Bank, seed Timelock, update-env.js |

## Prochaines etapes

- [ ] Tests E2E Playwright sur pages timelock/bank
- [ ] Slither : corriger warnings SafeLandTimelock.sol
- [ ] Frontend : connexion wallet reelle sur timelock/bank
- [ ] Deploiement Sepolia + npm run update-env:write
- [ ] TheGraph : deploiement reseau decentralise
