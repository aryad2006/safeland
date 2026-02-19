# SafeLand Subgraph

Subgraph [TheGraph](https://thegraph.com/) pour indexer les événements on-chain de SafeLand.

## Contrats indexés

| Contrat | Événements |
|---------|-----------|
| SafeLandNFT | PropertyCreated, PropertyTransferred, EncumbranceAdded/Removed, TransferLocked/Unlocked, PropertyFrozen, PropertyBurned |
| SafeLandRegistry | PropertyRegistered, TransactionRecorded, FraudPrevented |
| SafeLandEscrow | DealCreated, SellerSigned, BuyerFunded, NotaryValidated, DealCompleted, DealCancelled |
| SafeLandFridda | SuccessionOpened, SharesDistributed, SuccessionFinalized, ProposalCreated, VoteCast, ProposalExecuted |
| SafeLandJustice | ActionProposed, ActionSigned, ActionExecuted, RecoveryRequested, RecoveryExecuted |

## Installation

```bash
cd subgraph
npm install
```

## Configuration

1. Mettre à jour les adresses des contrats dans `subgraph.yaml` après déploiement sur Sepolia
2. Mettre à jour `startBlock` avec le bloc de déploiement

## Déploiement

### TheGraph Studio (hébergé)

```bash
# Auth avec votre clé
npx graph auth --studio <DEPLOY_KEY>

# Codegen + build
npm run codegen
npm run build

# Déployer
npm run deploy
```

### Local (Graph Node)

```bash
npm run create-local
npm run deploy-local
```

## Requêtes GraphQL exemples

### Toutes les propriétés d'un owner
```graphql
{
  properties(where: { owner: "0x..." }) {
    id
    titreFoncier
    frozen
    locked
    encumbrances(where: { active: true }) {
      encType
      creditor
    }
  }
}
```

### Deals escrow en cours
```graphql
{
  escrowDeals(where: { status_not: "Completed" }) {
    id
    seller
    buyer
    price
    status
  }
}
```

### Statistiques globales
```graphql
{
  globalStat(id: "global") {
    totalProperties
    totalTransfers
    totalEscrowDeals
    totalSuccessions
    totalJusticeActions
    totalFraudAlerts
  }
}
```
