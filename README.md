# SafeLand Morocco — Foncier 2.0

Plateforme NFT de Sécurisation Foncière au Maroc (B2G).  
Transformer le patrimoine national en un actif numérique souverain, liquide et infalsifiable.

## Architecture

```
safeland/
├── contracts/          # Smart Contracts Solidity
│   ├── SafeLandNFT.sol         # ERC-721 — Titre foncier NFT
│   ├── SafeLandRegistry.sol    # Registre central
│   ├── SafeLandEscrow.sol      # Smart-Escrow (séquestre atomique)
│   ├── SafeLandFridda.sol      # ERC-1155 — Succession automatisée
│   └── SafeLandJustice.sol     # Justice Override (Burn & Remint)
├── test/               # Tests Hardhat (Chai + Ethers)
├── scripts/            # Scripts de déploiement
├── backend/            # API Node.js / Express
├── frontend/           # Interface Next.js
└── docs/               # Cahiers des charges
```

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install
```

## Commandes

| Commande | Description |
|---|---|
| `npm run compile` | Compiler les Smart Contracts |
| `npm test` | Lancer les tests |
| `npm run test:coverage` | Tests avec couverture de code |
| `npm run node` | Lancer un nœud local Hardhat |
| `npm run deploy:local` | Déployer en local |
| `npm run dev:backend` | Lancer le backend |
| `npm run dev:frontend` | Lancer le frontend |

## Standards

- **ERC-721** : Titre foncier unique (NFT)
- **ERC-1155** : Indivision / Fridda (multi-token)
- **ERC-3643 (T-Rex)** : Compliance-as-Code

## Cadre Légal

- Loi 39-08 (Conservation Foncière)
- Loi 43-20 (Services de Confiance / Signature Électronique)
- Loi 09-08 (Protection des Données)
- Loi 53-05 (Échange Électronique)

## Licence

Propriétaire — SafeLand Morocco © 2026
