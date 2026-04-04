# Guide de Deploiement Blockchain — SafeLand
## Comment deployer une blockchain pour chaque pays

**Document interne — Version 1.0 — Avril 2026**

---

## Table des Matieres

1. [Les 4 options de deploiement](#1-les-4-options)
2. [Option A — Reseau public (Polygon)](#2-option-a--reseau-public)
3. [Option B — Appchain L2 (recommande)](#3-option-b--appchain-l2)
4. [Option C — Reseau prive (Hyperledger Besu)](#4-option-c--reseau-prive)
5. [Option D — Reseau souverain custom](#5-option-d--reseau-souverain)
6. [Comparaison detaillee](#6-comparaison-detaillee)
7. [Guide pas-a-pas : deployer sur Polygon](#7-deployer-sur-polygon)
8. [Guide pas-a-pas : deployer une Appchain OP Stack](#8-deployer-une-appchain-op-stack)
9. [Guide pas-a-pas : deployer Hyperledger Besu](#9-deployer-hyperledger-besu)
10. [Infrastructure serveur](#10-infrastructure-serveur)
11. [Couts detailles](#11-couts-detailles)
12. [Securite et operations](#12-securite-et-operations)
13. [Disaster recovery](#13-disaster-recovery)
14. [FAQ technique](#14-faq-technique)

---

## 1. Les 4 Options

```
Option A                Option B                Option C              Option D
Reseau Public           Appchain L2             Reseau Prive          Souverain Custom
(Polygon/Arbitrum)      (OP Stack/Orbit)        (Hyperledger Besu)    (Chain from scratch)
                        
Facile                  Equilibre               Controle total        Maximum controle
Pas de controle         Souverain + securise    100% prive            Tres complexe
Gas public              Gas configurable        Pas de gas public     Tout custom
0 infra                 Infra moderee           Infra lourde          Infra tres lourde

Pour : MVP, test        Pour : PRODUCTION       Pour : donnees        Pour : pays avec
                        RECOMMANDE              ultra-sensibles       capacite technique
```

---

## 2. Option A — Reseau Public (Polygon PoS / Arbitrum)

### Principe
Tu deploies tes smart contracts sur un reseau existant (Polygon, Arbitrum, Base).
Pas d'infrastructure a gerer. C'est comme publier un site sur un hebergeur partage.

### Avantages
- Zero infrastructure a gerer
- Securite maximale (heritee d'Ethereum)
- Deploiement en 10 minutes
- Cout gas tres faible (Polygon : ~$0.001/tx)
- Ecosystem riche (explorers, wallets, outils)

### Inconvenients
- Pas de souverainete (le reseau ne t'appartient pas)
- Donnees publiques (tout le monde peut lire)
- Dependent du reseau (si Polygon tombe, tu tombes)
- Pas de controle sur les frais de gas
- Certains pays refusent les reseaux publics crypto

### Quand l'utiliser
- MVP et tests
- Pays qui acceptent les crypto publiques
- Budget limite
- Besoin rapide

### Cout
| Element | Cout |
|---------|------|
| Deploiement | ~$50 de MATIC/ETH |
| Gas mensuel (10K tx) | ~$10-50 |
| Infra | $0 (pas de serveur) |
| **Total/mois** | **~$50** |

### Comment deployer (resume)
```bash
# 1. Obtenir des MATIC (Polygon) ou ETH (Arbitrum)
# 2. Configurer hardhat.config.js avec le reseau
# 3. Deployer
npx hardhat run scripts/deploy.js --network polygon
# 4. Verifier sur Polygonscan
npx hardhat verify --network polygon <CONTRACT_ADDRESS>
```

---

## 3. Option B — Appchain L2 (RECOMMANDE)

### Principe
Tu deploies ta propre blockchain Layer 2, ancree sur Ethereum pour la securite.
C'est comme avoir ton propre immeuble dans un quartier securise.

### Technologies disponibles

#### 3.1 OP Stack (Optimism)
- **Quoi** : Fork de la stack Optimism (meme technologie que Base, Worldcoin, Zora)
- **EVM compatible** : 100% — tes contrats Solidity marchent sans modification
- **Sequencer** : tu operes le sequencer (toi qui ordonne les transactions)
- **Cout** : gas L2 que tu fixes + cout d'ancrage L1 (~$1000-3000/mois)
- **Maturite** : Tres haute (Coinbase Base l'utilise)

```
Utilisateur → Transaction → TON Sequencer (L2) → Batch → Ethereum L1
                                    ↑
                            Tu controles cette partie
                            Tu fixes le gas
                            Tu collectes les fees
```

#### 3.2 Arbitrum Orbit
- **Quoi** : Chain L2 ou L3 basee sur Arbitrum
- **EVM compatible** : 100%
- **Avantage** : peut etre L3 (encore moins cher)
- **Cout** : similaire a OP Stack
- **Maturite** : Haute

#### 3.3 Polygon CDK
- **Quoi** : Kit pour creer un ZK rollup
- **EVM compatible** : 100%
- **Avantage** : ZK proofs (plus securise theoriquement)
- **Cout** : plus eleve (proofs ZK couteuses)
- **Maturite** : Moyenne (plus recent)

#### 3.4 Avalanche Subnet
- **Quoi** : Sous-reseau dedie dans l'ecosysteme Avalanche
- **EVM compatible** : 100%
- **Avantage** : validateurs custom, haute performance
- **Cout** : staking AVAX requis (~$50K-100K)
- **Maturite** : Haute

### Recommandation : OP Stack

C'est le plus mature, le plus utilise, et le plus documente. Base (Coinbase) l'utilise
pour des millions d'utilisateurs. La communaute est enorme.

### Avantages Appchain
- **Souverainete** : c'est TA chain, TU decides des regles
- **Gas configurable** : tu fixes le prix (peut etre quasi-gratuit)
- **Revenue** : les frais de gas te reviennent
- **Securite** : ancree sur Ethereum (la plus securisee)
- **Performance** : pas de congestion (tu es seul sur ta chain)
- **Confidentialite** : tu peux choisir qui voit quoi
- **Conformite** : acceptable par les gouvernements (chain dediee, pas "crypto publique")

### Inconvenients
- Infrastructure a gerer (sequencer, noeud, bridge)
- Cout d'ancrage L1 ($1000-3000/mois)
- Equipe DevOps necessaire

### Cout
| Element | Cout/mois |
|---------|----------|
| Serveurs (3 noeuds min) | $500-1500 |
| Ancrage L1 Ethereum | $1000-3000 |
| Monitoring | $200-500 |
| DevOps (temps partiel) | $2000-5000 |
| **Total/mois** | **$3700-10000** |
| **Total/an** | **$45K-120K** |

---

## 4. Option C — Reseau Prive (Hyperledger Besu)

### Principe
Tu deploies un reseau blockchain completement prive, sans lien avec Ethereum.
C'est comme avoir ton propre datacenter isole.

### Quoi
Hyperledger Besu est un client Ethereum en Java, developpe par la Linux Foundation.
Il peut fonctionner en mode prive avec des validateurs autorises (PoA - Proof of Authority).

### Avantages
- **100% prive** : aucune donnee publique
- **Controle total** : tu decides qui valide, qui lit, qui ecrit
- **Pas de crypto publique** : pas de token, pas de gas public
- **EVM compatible** : tes contrats Solidity marchent sans modification
- **Conformite** : ideal pour les pays qui interdisent les crypto
- **Gratuit** : open source, pas de licence

### Inconvenients
- **Pas d'ancrage L1** : la securite depend uniquement de tes validateurs
- **Centralise** : si tes serveurs tombent, tout tombe
- **Pas d'ecosystem** : pas d'explorer public, pas de wallets standard
- **Infra lourde** : 5-7 noeuds minimum pour le consensus
- **Moins credible** : les puristes blockchain diront que c'est une "base de donnees deguisee"

### Quand l'utiliser
- Pays qui interdisent totalement les crypto publiques
- Donnees ultra-sensibles (militaire, secret d'etat)
- Exigence de controle total par le gouvernement

### Cout
| Element | Cout/mois |
|---------|----------|
| Serveurs (5-7 noeuds) | $2000-5000 |
| Load balancer + backup | $500-1000 |
| Monitoring | $300-500 |
| DevOps (dedié) | $5000-8000 |
| **Total/mois** | **$7800-14500** |
| **Total/an** | **$95K-175K** |

---

## 5. Option D — Reseau Souverain Custom

### Principe
Tu construis ta propre blockchain from scratch avec ton propre consensus.
C'est l'equivalent de construire ton propre systeme d'exploitation.

### Quand
Uniquement si le pays a une equipe technique de 20+ ingenieurs blockchain
et un budget de plusieurs millions. Aucun pays cible n'en a besoin actuellement.

**Non recommande.** Utilise OP Stack (option B) pour le meme resultat avec 10x moins d'effort.

---

## 6. Comparaison Detaillee

| Critere | A. Public | B. Appchain L2 | C. Prive (Besu) | D. Custom |
|---------|-----------|----------------|-----------------|-----------|
| **Difficulte** | Facile | Moyenne | Difficile | Tres difficile |
| **Souverainete** | Aucune | Forte | Totale | Totale |
| **Securite** | Ethereum L1 | Ethereum L1 | Tes validateurs | Tes validateurs |
| **Confidentialite** | Publique | Configurable | 100% prive | 100% prive |
| **Gas/tx** | $0.001-0.01 | Configurable | Gratuit | Gratuit |
| **Revenue gas** | Aucun | Oui (sequencer) | N/A | N/A |
| **Infra** | Aucune | 3 serveurs | 5-7 serveurs | 10+ serveurs |
| **Cout/mois** | $50 | $3K-10K | $8K-15K | $20K+ |
| **Cout/an** | $600 | $45K-120K | $95K-175K | $250K+ |
| **EVM compatible** | Oui | Oui | Oui | Selon choix |
| **MetaMask** | Oui | Oui | Oui (config) | Selon choix |
| **Temps deploy** | 10 min | 1-2 semaines | 2-4 semaines | 3-6 mois |
| **Equipe DevOps** | 0 | 1 personne | 2 personnes | 5+ personnes |
| **Gouvernement** | Refus probable | Accepte | Tres accepte | Tres accepte |
| **Recommande** | MVP/Test | **PRODUCTION** | Sensible | Jamais |

### Matrice de decision par pays

| Pays | Option recommandee | Raison |
|------|-------------------|--------|
| Maroc | B (Appchain) | Modernisation, partenaire tech-savvy |
| Egypte | B (Appchain) | Grand volume, besoin souverainete |
| Jordanie | B (Appchain) | Pays stable, tech-friendly |
| Syrie | B ou C | Post-conflit, sensibilite donnees |
| Irak | B (Appchain) | Fonds internationaux, volume moyen |
| Ukraine | B (Appchain) | Pro-tech, fonds UE |
| Liban | A puis B | Budget limite, commencer simple |
| Tunisie | A puis B | Budget limite, commencer simple |
| RDC | A puis B | Infra limitee, commencer simple |
| Nigeria | B (Appchain) | Grand volume, tech ecosystem |

---

## 7. Guide Pas-a-Pas : Deployer sur Polygon (Option A)

### Prerequis
- Node.js 20+
- Compte sur Polygonscan
- MATIC pour le gas (acheter sur un exchange)
- RPC URL (Alchemy ou Infura)

### Etape 1 : Obtenir un RPC Polygon

```
1. Aller sur https://www.alchemy.com/
2. Creer un compte gratuit
3. Creer une app "SafeLand-Maroc" sur Polygon Mainnet
4. Copier l'API URL : https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Etape 2 : Creer un wallet deployer

```bash
# Generer un wallet (NE PAS utiliser un wallet personnel)
node -e "const w = require('ethers').Wallet.createRandom(); console.log('Address:', w.address); console.log('Private Key:', w.privateKey)"

# Envoyer du MATIC a cette adresse (acheter sur Binance, Coinbase, etc.)
# Budget : ~50 MATIC ($30-50) suffit pour deployer 6 contrats
```

### Etape 3 : Configurer .env

```bash
# .env (NE PAS COMMITER)
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_KEY
```

### Etape 4 : Configurer hardhat.config.js

```javascript
// Ajouter dans networks:
polygon: {
  url: process.env.POLYGON_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 137,
  gasPrice: 50000000000, // 50 gwei (ajuster selon le marche)
},
```

### Etape 5 : Deployer

```bash
# Compiler
npx hardhat compile

# Deployer sur Polygon
npx hardhat run scripts/deploy.js --network polygon

# Le script affiche les adresses des contrats
# Sauvegarder dans deployed-addresses.json
```

### Etape 6 : Verifier sur Polygonscan

```bash
# Pour chaque contrat (implementation, pas le proxy)
npx hardhat verify --network polygon <IMPLEMENTATION_ADDRESS>
```

### Etape 7 : Configurer le frontend

```bash
# Mettre a jour les adresses
npm run update-env:write

# Changer le chainId dans .env.local
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Etape 8 : Configurer MetaMask

```
Reseau : Polygon Mainnet
RPC URL : https://polygon-rpc.com
Chain ID : 137
Symbole : MATIC
Explorer : https://polygonscan.com
```

---

## 8. Guide Pas-a-Pas : Deployer une Appchain OP Stack (Option B)

### Architecture

```
┌─────────────────────────────────────────┐
│  SafeChain-[PAYS] (ton L2)              │
│                                          │
│  ┌──────────┐  ┌──────────┐             │
│  │ Sequencer │  │ Proposer │             │
│  │ (ordonne  │  │ (soumet  │             │
│  │  les tx)  │  │  batches │             │
│  └─────┬─────┘  └─────┬────┘            │
│        │               │                 │
│  ┌─────▼───────────────▼────┐           │
│  │    Batcher (batch les     │           │
│  │    tx et les envoie a L1) │           │
│  └──────────┬────────────────┘           │
└─────────────┼───────────────────────────┘
              │
    ┌─────────▼─────────┐
    │  Ethereum L1       │
    │  (securite ultime) │
    └────────────────────┘
```

### Prerequis
- 3 serveurs (AWS/GCP/OVH) : 4 vCPU, 16 GB RAM, 500 GB SSD chacun
- Domaine DNS (ex: chain.safeland.ma)
- ETH sur L1 pour l'ancrage (~$2000-3000/mois)
- Docker + docker-compose
- ~1-2 semaines de travail DevOps

### Etape 1 : Cloner le repo OP Stack

```bash
git clone https://github.com/ethereum-optimism/optimism.git
cd optimism
git checkout v1.9.0  # ou derniere version stable
```

### Etape 2 : Configurer la chain

```bash
# Generer les cles des operateurs
cd packages/contracts-bedrock

# 4 cles necessaires :
# - Admin : gere les contrats L1
# - Batcher : soumet les batches a L1
# - Proposer : soumet les state roots
# - Sequencer : ordonne les transactions L2

# Generer chaque cle
cast wallet new  # Repeter 4 fois, noter chaque cle
```

### Etape 3 : Configurer le fichier de deploiement

```json
// deploy-config/safeland-morocco.json
{
  "l1ChainID": 1,
  "l2ChainID": 424242,              // Ton chain ID unique
  "l2BlockTime": 2,                  // 1 bloc toutes les 2 secondes
  "maxSequencerDrift": 600,
  "sequencerWindowSize": 3600,
  "channelTimeout": 300,

  "p2pSequencerAddress": "0x...",    // Cle Sequencer
  "batchSenderAddress": "0x...",     // Cle Batcher
  "l2OutputOracleProposer": "0x...", // Cle Proposer
  "proxyAdminOwner": "0x...",        // Cle Admin

  "l1StartingBlockTag": "latest",
  "l2GenesisBlockGasLimit": "0x1C9C380",  // 30M gas limit
  "l2GenesisBlockBaseFeePerGas": "0x3B9ACA00",  // 1 gwei
  "gasPriceOracleOverhead": 2100,
  "gasPriceOracleScalar": 1000000,

  "finalizationPeriodSeconds": 604800  // 7 jours
}
```

### Etape 4 : Deployer les contrats L1

```bash
# Deployer les contrats du bridge sur Ethereum L1
forge script scripts/Deploy.s.sol \
  --rpc-url $L1_RPC_URL \
  --private-key $ADMIN_PRIVATE_KEY \
  --broadcast

# Cela cree les contrats :
# - OptimismPortal (bridge L1↔L2)
# - L2OutputOracle (state roots)
# - SystemConfig (parametres chain)
```

### Etape 5 : Generer la genesis L2

```bash
# Generer le bloc genesis de ta L2
go run cmd/genesis/main.go \
  --deploy-config deploy-config/safeland-morocco.json \
  --l1-deployments deployments/1-deploy.json \
  --outfile genesis.json
```

### Etape 6 : Lancer les services (Docker)

```yaml
# docker-compose-chain.yml
version: "3.9"

services:
  # Le noeud L2 (geth modifie)
  op-geth:
    image: us-docker.pkg.dev/oplabs-tools-artifacts/images/op-geth:v1.101315.0
    ports:
      - "8545:8545"    # RPC
      - "8546:8546"    # WebSocket
    volumes:
      - geth-data:/data
      - ./genesis.json:/genesis.json
    command: >
      --datadir=/data
      --http --http.addr=0.0.0.0 --http.port=8545
      --http.api=eth,net,web3,debug,txpool
      --ws --ws.addr=0.0.0.0 --ws.port=8546
      --ws.api=eth,net,web3,debug,txpool
      --syncmode=full
      --gcmode=archive
      --rollup.sequencerhttp=http://op-node:8547

  # Le noeud OP (consensus)
  op-node:
    image: us-docker.pkg.dev/oplabs-tools-artifacts/images/op-node:v1.9.0
    depends_on: [op-geth]
    environment:
      - OP_NODE_L1_ETH_RPC=$L1_RPC_URL
      - OP_NODE_L2_ENGINE_RPC=http://op-geth:8551
      - OP_NODE_ROLLUP_CONFIG=/rollup.json
      - OP_NODE_P2P_SEQUENCER_KEY=$SEQUENCER_KEY
      - OP_NODE_SEQUENCER_ENABLED=true
      - OP_NODE_SEQUENCER_L1_CONFS=4
    volumes:
      - ./rollup.json:/rollup.json

  # Le batcher (soumet les batches a L1)
  op-batcher:
    image: us-docker.pkg.dev/oplabs-tools-artifacts/images/op-batcher:v1.9.0
    depends_on: [op-node]
    environment:
      - OP_BATCHER_L1_ETH_RPC=$L1_RPC_URL
      - OP_BATCHER_L2_ETH_RPC=http://op-geth:8545
      - OP_BATCHER_ROLLUP_RPC=http://op-node:8547
      - OP_BATCHER_PRIVATE_KEY=$BATCHER_KEY
      - OP_BATCHER_MAX_CHANNEL_DURATION=1

  # Le proposer (soumet les state roots a L1)
  op-proposer:
    image: us-docker.pkg.dev/oplabs-tools-artifacts/images/op-proposer:v1.9.0
    depends_on: [op-node]
    environment:
      - OP_PROPOSER_L1_ETH_RPC=$L1_RPC_URL
      - OP_PROPOSER_ROLLUP_RPC=http://op-node:8547
      - OP_PROPOSER_PRIVATE_KEY=$PROPOSER_KEY
      - OP_PROPOSER_L2OO_ADDRESS=$L2_OUTPUT_ORACLE_ADDRESS

volumes:
  geth-data:
```

```bash
# Lancer la chain
docker-compose -f docker-compose-chain.yml up -d

# Verifier que ca tourne
curl http://localhost:8545 -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
# Doit retourner ton chainId (424242 en hex = 0x67932)
```

### Etape 7 : Deployer SafeLand sur ta L2

```bash
# Configurer hardhat pour ta L2
# hardhat.config.js
safeland_l2: {
  url: "http://YOUR_SERVER:8545",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 424242,
}

# Deployer
npx hardhat run scripts/deploy.js --network safeland_l2
```

### Etape 8 : Configurer le frontend

```bash
# .env.local
NEXT_PUBLIC_CHAIN_ID=424242
NEXT_PUBLIC_RPC_URL=https://chain.safeland.ma
NEXT_PUBLIC_CHAIN_NAME="SafeChain Morocco"
NEXT_PUBLIC_CURRENCY_SYMBOL="SLM"
NEXT_PUBLIC_EXPLORER_URL="https://explorer.safeland.ma"
```

### Etape 9 : Deployer un explorer (Blockscout)

```bash
# Blockscout est un explorer open source
git clone https://github.com/blockscout/blockscout.git

# docker-compose pour Blockscout
docker-compose -f docker-compose-blockscout.yml up -d

# Accessible sur https://explorer.safeland.ma
```

### Etape 10 : Configurer MetaMask pour les utilisateurs

```javascript
// Code pour ajouter le reseau automatiquement
await window.ethereum.request({
  method: "wallet_addEthereumChain",
  params: [{
    chainId: "0x67932",                              // 424242
    chainName: "SafeChain Morocco",
    nativeCurrency: { name: "SafeLand", symbol: "SLM", decimals: 18 },
    rpcUrls: ["https://chain.safeland.ma"],
    blockExplorerUrls: ["https://explorer.safeland.ma"],
  }]
});
```

---

## 9. Guide Pas-a-Pas : Deployer Hyperledger Besu (Option C)

### Architecture

```
┌─────────────────────────────────────────┐
│  Reseau Prive SafeLand                   │
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Node 1│ │Node 2│ │Node 3│ │Node 4│   │
│  │Valida│ │Valida│ │Valida│ │Valida│   │
│  │teur  │ │teur  │ │teur  │ │teur  │   │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘   │
│     │        │        │        │         │
│     └────────┴────────┴────────┘         │
│              Consensus IBFT 2.0          │
│     (2/3 des validateurs doivent etre    │
│      d'accord pour valider un bloc)      │
│                                          │
│  ┌──────┐                               │
│  │Node 5│  Noeud RPC (pour l'API)       │
│  │ RPC  │  Les utilisateurs se           │
│  │      │  connectent ici                │
│  └──────┘                               │
└─────────────────────────────────────────┘
```

### Etape 1 : Installer Besu

```bash
# Sur chaque serveur (5 minimum)
# Option Docker (recommande)
docker pull hyperledger/besu:latest

# Option binaire
wget https://github.com/hyperledger/besu/releases/download/24.1.0/besu-24.1.0.tar.gz
tar xzf besu-24.1.0.tar.gz
```

### Etape 2 : Generer les cles des validateurs

```bash
# Sur ta machine locale
# Generer 4 cles de validateurs + 1 cle RPC
for i in 1 2 3 4 5; do
  besu --data-path=node$i/data public-key export --to=node$i/key.pub
done
```

### Etape 3 : Creer le fichier genesis

```json
{
  "config": {
    "chainId": 1337,
    "berlinBlock": 0,
    "ibft2": {
      "blockperiodseconds": 5,
      "epochlength": 30000,
      "requesttimeoutseconds": 10
    }
  },
  "nonce": "0x0",
  "timestamp": "0x0",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "alloc": {
    "0xYOUR_DEPLOYER_ADDRESS": {
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
    }
  },
  "extraData": "0x... IBFT extra data avec les 4 validateurs ..."
}
```

### Etape 4 : Lancer les noeuds

```bash
# Validateur 1
docker run -d --name besu-validator-1 \
  -v /data/node1:/opt/besu/data \
  -p 8545:8545 -p 30303:30303 \
  hyperledger/besu:latest \
  --genesis-file=/opt/besu/data/genesis.json \
  --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT,WEB3 \
  --rpc-http-host=0.0.0.0 \
  --min-gas-price=0 \
  --host-allowlist="*"

# Repeter pour validateurs 2, 3, 4 avec des ports differents
# Noeud 5 = RPC node (pas validateur, juste pour les requetes)
```

### Etape 5 : Deployer SafeLand

```javascript
// hardhat.config.js
besu_private: {
  url: "http://YOUR_RPC_NODE:8545",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 1337,
  gasPrice: 0,  // Gas gratuit sur reseau prive
}
```

```bash
npx hardhat run scripts/deploy.js --network besu_private
```

---

## 10. Infrastructure Serveur

### Ou heberger

| Provider | Region | Avantage | Cout/serveur |
|----------|--------|----------|-------------|
| **OVH** | France/Maroc | Donnees en Europe/Afrique, prix bas | $30-80/mois |
| **AWS** | Toutes | Global, fiable, services manages | $100-300/mois |
| **Google Cloud** | Toutes | Kubernetes natif, bonne API | $100-300/mois |
| **Azure** | Toutes | Bonne integration gouvernementale | $100-300/mois |
| **Hetzner** | Allemagne | Tres pas cher, bon hardware | $20-60/mois |
| **Maroc Telecom Cloud** | Maroc | Souverainete donnees | Sur devis |
| **Datapark** | Maroc | Datacenter marocain | Sur devis |

### Specifications serveur minimales

| Role | CPU | RAM | Stockage | Reseau |
|------|-----|-----|----------|--------|
| Sequencer / Validateur | 4 vCPU | 16 GB | 500 GB SSD | 1 Gbps |
| Noeud RPC | 4 vCPU | 16 GB | 1 TB SSD | 1 Gbps |
| Backend SafeLand | 2 vCPU | 4 GB | 50 GB SSD | 100 Mbps |
| Frontend SafeLand | 2 vCPU | 4 GB | 20 GB SSD | 100 Mbps |
| Base de donnees | 2 vCPU | 8 GB | 100 GB SSD | 100 Mbps |
| Monitoring | 2 vCPU | 4 GB | 50 GB SSD | 100 Mbps |

### Architecture serveur recommandee (Appchain)

```
┌─── Serveur 1 (sequencer) ──────────────────────┐
│  op-geth + op-node + op-batcher + op-proposer  │
│  4 vCPU, 16 GB RAM, 500 GB SSD                 │
└─────────────────────────────────────────────────┘

┌─── Serveur 2 (app) ───────────────────────────┐
│  Backend SafeLand + Frontend + DB SQLite       │
│  4 vCPU, 8 GB RAM, 100 GB SSD                 │
└─────────────────────────────────────────────────┘

┌─── Serveur 3 (monitoring + explorer) ──────────┐
│  Blockscout + Grafana + Prometheus             │
│  4 vCPU, 8 GB RAM, 200 GB SSD                 │
└─────────────────────────────────────────────────┘
```

---

## 11. Couts Detailles

### Option A — Reseau Public (Polygon)

| Element | Setup | Mensuel | Annuel |
|---------|-------|---------|--------|
| MATIC gas | $50 | $10-50 | $120-600 |
| Alchemy RPC (gratuit tier) | $0 | $0 | $0 |
| Serveur backend + frontend | $0 | $60 | $720 |
| Domaine | $15 | $0 | $15 |
| **Total** | **$65** | **$70-110** | **$855-1335** |

### Option B — Appchain OP Stack

| Element | Setup | Mensuel | Annuel |
|---------|-------|---------|--------|
| 3 serveurs | $0 | $300-600 | $3600-7200 |
| ETH L1 ancrage | $3000 | $1000-3000 | $12K-36K |
| Blockscout explorer | $0 | $100 | $1200 |
| Monitoring (Grafana) | $0 | $50 | $600 |
| Domaine + SSL | $15 | $0 | $15 |
| DevOps (20% temps) | $0 | $2000 | $24K |
| **Total** | **$3015** | **$3450-5750** | **$41K-69K** |

### Option C — Hyperledger Besu

| Element | Setup | Mensuel | Annuel |
|---------|-------|---------|--------|
| 5-7 serveurs | $0 | $1000-3000 | $12K-36K |
| Load balancer | $0 | $100 | $1200 |
| Monitoring | $0 | $200 | $2400 |
| DevOps (50% temps) | $0 | $5000 | $60K |
| **Total** | **$0** | **$6300-8300** | **$76K-100K** |

---

## 12. Securite et Operations

### 12.1 Gestion des cles

| Cle | Stockage | Qui y a acces |
|-----|----------|--------------|
| Deployer (UUPS admin) | Hardware wallet (Ledger) | CTO uniquement |
| Sequencer | Serveur + env var chiffree | DevOps |
| Batcher | Serveur + env var chiffree | DevOps |
| Platform fee wallet | Multi-sig (Gnosis Safe) | 2/3 (CTO + CEO + CFO) |
| DGI/ANCFCC wallets | Gerees par le gouvernement | Gouvernement |

### 12.2 Multi-sig pour les operations admin

```
Operations critiques :
  - Upgrade contrat → Timelock (1-30 jours) + Multi-sig (2/3)
  - Changer platform fee → ADMIN_ROLE + Multi-sig
  - Pause d'urgence → ADMIN_ROLE (immediat, sans multi-sig)
  - Unpause → ADMIN_ROLE + Timelock (1 jour)
```

### 12.3 Monitoring

```
Grafana + Prometheus :
  - Block height (augmente regulierement ?)
  - Transaction count (normal ou spike ?)
  - Gas usage (pas de congestion ?)
  - RPC latence (< 100ms ?)
  - Espace disque (> 20% libre ?)
  - CPU/RAM des noeuds

Alertes :
  - Bloc pas produit depuis > 30 secondes → PagerDuty
  - RPC down → PagerDuty
  - Disque > 80% → Email
  - Erreur contrat (revert) → Slack
```

### 12.4 Backup

```
Quotidien :
  - Snapshot de geth-data (ou besu-data)
  - Export de la DB SQLite backend
  - Backup des cles (chiffrees, hors-site)

Hebdomadaire :
  - Test de restauration depuis backup
  - Verification integrite des donnees

Mensuel :
  - Rotation des cles d'acces serveur
  - Mise a jour des images Docker
  - Audit des logs d'acces
```

---

## 13. Disaster Recovery

### Scenario : le serveur sequencer tombe

```
1. Le L2 arrete de produire des blocs
2. Les transactions sont en queue
3. Deployer un nouveau sequencer depuis le backup
4. Temps de recovery : 15-30 minutes (avec backup recent)
5. Aucune donnee perdue (le L1 a les batches)
```

### Scenario : perte totale des serveurs

```
1. Les contrats L1 (Ethereum) sont intacts
2. Les donnees L2 sont dans les batches L1
3. Re-deployer les serveurs
4. Re-synchroniser le L2 depuis L1 (peut prendre des heures)
5. Aucune donnee perdue
```

### Scenario : cle privee compromise

```
1. Pause d'urgence immediate (ADMIN_ROLE)
2. Revoquer tous les roles de la cle compromise
3. Generer de nouvelles cles
4. Upgrade les contrats si necessaire (Timelock + multi-sig)
5. Reprendre les operations
```

---

## 14. FAQ Technique

### "Le pays peut-il operer la chain seul ?"
Oui, avec l'option B ou C. On livre la documentation et la formation.
Mais en pratique, 90% des pays prefereront payer le support.

### "Que se passe-t-il si Ethereum tombe ?"
Avec l'option B (L2), ta chain continue de fonctionner.
Les transactions sont bufferisees et soumises a L1 quand il revient.
Avec l'option C (prive), Ethereum n'est pas implique du tout.

### "Le gas est payant pour les utilisateurs ?"
Tu decides. Options :
1. Gas gratuit (le gouvernement paie, inclus dans l'abonnement)
2. Gas minimal ($0.001/tx, invisible pour l'utilisateur)
3. Gas standard (l'utilisateur paie, comme MetaMask)
Recommandation : gas gratuit ou sponsorise par le gouvernement.

### "Combien de transactions par seconde ?"
- Option A (Polygon) : partage avec les autres, ~7000 TPS theorique
- Option B (Appchain) : dedié, ~2000 TPS
- Option C (Besu) : dedié, ~1000 TPS
Pour SafeLand, 10 TPS suffit largement (marche immobilier = faible frequence).

### "Peut-on migrer de l'option A vers l'option B ?"
Oui. Les contrats sont les memes (EVM compatible). Il faut :
1. Deployer les memes contrats sur la nouvelle chain
2. Migrer les donnees (re-minter les NFT existants)
3. Mettre a jour le frontend (nouveau RPC, nouveau chainId)
Cout : 1-2 semaines de travail.

### "Comment le pays ajoute MetaMask pour ses fonctionnaires ?"
1. Installer MetaMask (extension Chrome/Firefox)
2. Cliquer "Ajouter un reseau"
3. Entrer : RPC URL, Chain ID, nom du reseau
4. Ou : le frontend a un bouton "Ajouter le reseau" qui le fait automatiquement

### "Faut-il un token natif ?"
- Option A : MATIC ou ETH (existe deja)
- Option B : tu crees ton token (SLM = SafeLand Morocco) — utilise pour le gas
- Option C : pas de token (gas = 0)
Recommandation pour B : creer un token SLM, le distribuer gratuitement aux fonctionnaires.

### "Comment distribuer le token aux fonctionnaires ?"
```bash
# Script de distribution
node scripts/faucet.js --addresses agents.csv --amount 100

# Chaque agent recoit 100 SLM (suffisant pour ~10000 transactions)
# Le gouvernement recharge periodiquement via un "faucet" administratif
```

---

**Document interne — SafeLand v1.0 — Avril 2026**
**Ne pas diffuser sans autorisation**
