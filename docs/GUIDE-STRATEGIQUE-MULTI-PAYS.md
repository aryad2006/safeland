# Guide Strategique — SafeLand Multi-Pays
## Comment deployer, operer et monetiser SafeLand dans chaque pays

**Document confidentiel — Usage interne societe uniquement**
**Version:** 1.0 — Avril 2026

---

## Table des Matieres

1. [Vision et positionnement](#1-vision-et-positionnement)
2. [Architecture du business](#2-architecture-du-business)
3. [Modele de revenus detaille](#3-modele-de-revenus-detaille)
4. [Architecture technique multi-pays](#4-architecture-technique-multi-pays)
5. [Le generateur de forks](#5-le-generateur-de-forks)
6. [Le platform fee — mecanisme et justification](#6-le-platform-fee)
7. [Le SaaS admin — produit recurrent](#7-le-saas-admin)
8. [Catalogue de modules vendables](#8-catalogue-de-modules-vendables)
9. [Strategie de deploiement par pays](#9-strategie-de-deploiement-par-pays)
10. [Fiches pays detaillees](#10-fiches-pays-detaillees)
11. [Gestion de la propriete intellectuelle](#11-gestion-de-la-propriete-intellectuelle)
12. [Cycle de vie d'un projet pays](#12-cycle-de-vie-dun-projet-pays)
13. [Equipe et organisation](#13-equipe-et-organisation)
14. [Financement et levee de fonds](#14-financement-et-levee-de-fonds)
15. [Risques et mitigation](#15-risques-et-mitigation)
16. [Plan d'action 3 ans](#16-plan-daction-3-ans)
17. [Metriques et KPIs](#17-metriques-et-kpis)
18. [Annexes](#18-annexes)

---

## 1. Vision et Positionnement

### 1.1 Vision

Devenir le **leader mondial** des solutions blockchain cadastrales, en fournissant a chaque
pays une plateforme souveraine, autonome et adaptee a son droit local, tout en generant
des revenus recurrents via les services a valeur ajoutee.

### 1.2 Positionnement

```
                    Souverainete du pays
                          ↑
                          │
    Solutions legacy ─────┼───── SafeLand
    (papier, Oracle,      │     (blockchain, souverain,
     systemes centralises)│      open-fork, recurrent)
                          │
                          └─────→ Revenus recurrents pour la societe
```

**SafeLand n'est PAS un SaaS centralise.** C'est un produit souverain livre au pays,
avec des services recurrents optionnels mais indispensables en pratique.

### 1.3 Avantage competitif

| Critere | Solutions concurrentes | SafeLand |
|---------|----------------------|----------|
| Souverainete | Cloud heberge ailleurs | Fork autonome, le pays possede tout |
| Technologie | Base de donnees classique | Blockchain immutable, NFT, smart contracts |
| Adaptabilite | Mois de dev pour chaque pays | Generateur : 1 JSON + quelques heures |
| Revenue model | Licence one-shot | Platform fee recurrent + SaaS + modules |
| Post-conflit | Pas adapte | Module Reconstruction natif |
| Succession | Pas adapte | Multi-ecole juridique (malekite, hanafite, etc.) |
| Transparence | Code ferme | Audit trail blockchain, code auditable |
| Financement | Budget national uniquement | Compatible fonds internationaux (BM, UN, UE) |

---

## 2. Architecture du Business

### 2.1 Les 3 entites

```
┌─────────────────────────────────────────────────────┐
│  ENTITE 1 — SafeLand Core (ta societe)              │
│  Prive, jamais livre                                 │
│                                                      │
│  • Template multi-pays + generateur                  │
│  • R&D : nouveaux modules, IA, blockchain            │
│  • Equipe technique core (5-8 personnes)             │
│  • Propriete intellectuelle du template              │
└───────────────┬─────────────────────────────────────┘
                │ genere
                ▼
┌─────────────────────────────────────────────────────┐
│  ENTITE 2 — SafeLand [Pays] (fork livre)            │
│  Propriete du pays, souverain                        │
│                                                      │
│  • Code complet, deployable, modifiable              │
│  • Donnees on-chain = propriete de l'Etat            │
│  • Infrastructure hebergee par le pays               │
│  • Le pays peut operer seul si necessaire            │
└───────────────┬─────────────────────────────────────┘
                │ connecte a (optionnel mais vital)
                ▼
┌─────────────────────────────────────────────────────┐
│  ENTITE 3 — SafeLand Admin (SaaS, heberge par toi) │
│  Jamais livre, abonnement annuel                     │
│                                                      │
│  • Dashboard multi-pays                              │
│  • Monitoring, alertes, analytics                    │
│  • Detection fraude IA                               │
│  • Reporting bailleurs de fonds                      │
│  • Gestionnaire d'upgrades                           │
│  • Support ticketing                                 │
└─────────────────────────────────────────────────────┘
```

### 2.2 Ce que tu gardes vs ce que tu livres

| Element | Garde (prive) | Livre (souverain) |
|---------|--------------|------------------|
| Template generateur | Oui | Non |
| Code fork pays | Non | Oui |
| Smart contracts deployes | Non | Oui (le pays les controle) |
| Donnees on-chain | Non | Oui (propriete du pays) |
| SaaS Admin dashboard | Oui | Non (abonnement) |
| Modules futurs (source) | Oui | Livre apres achat |
| IA anti-fraude | Oui | API (abonnement) |
| Expertise / formation | Oui | Service facture |

---

## 3. Modele de Revenus Detaille

### 3.1 Les 6 sources de revenus

```
Revenue = Licence + Platform Fee + SaaS + Support + Modules + Conseil
          (one-shot)  (recurrent)  (recurrent) (recurrent) (ponctuel) (ponctuel)
```

#### Source 1 — Licence initiale (one-shot)

| Composant | Description | Prix |
|-----------|-------------|------|
| Generation du fork | Adaptation template au pays | 200K - 500K USD |
| Modules specifiques | Contrats custom (reconstruction, tasaluh, etc.) | 100K - 300K USD |
| Integration institutionnelle | Adaptation aux processus du pays | 100K - 400K USD |
| Formation technique | Equipe IT du pays | 50K - 200K USD |
| Documentation juridique | CDC, conformite, B2G | 50K - 100K USD |
| Audit securite | Audit externe par CertiK ou equivalent | 100K - 200K USD |
| **Total licence** | | **600K - 1.7M USD** |

Facteurs de variation : taille du pays, complexite juridique, modules requis, urgence.

#### Source 2 — Appchain dediee / L2 souverain (recurrent, infrastructure)

**C'est la source de revenus la plus strategique.** Au lieu de deployer sur un reseau
public (Polygon, Arbitrum), tu deploies un **Layer 2 dedie a chaque pays**.

##### Qu'est-ce qu'une Appchain ?

Une blockchain privee/semi-privee operee pour un seul usage (cadastre), avec :
- Sa propre gouvernance (le pays valide les blocs)
- Ses propres frais de transaction (que TU fixes)
- Ses propres validateurs (que TU operes, avec le pays)
- Un bridge vers Ethereum/Polygon pour la securite (ancrage L1)

##### Technologies disponibles

| Technologie | Avantage | Cout infra/mois | Revenue potentiel |
|-------------|----------|----------------|------------------|
| **OP Stack (Optimism L2)** | Meme EVM, facile, fork OP Mainnet | 2-5K USD | Frais sequencer |
| **Avalanche Subnet** | Validateurs custom, haute performance | 3-8K USD | Frais gas + staking |
| **Polygon CDK** | ZK rollup, ancrage Ethereum | 5-10K USD | Frais sequencer |
| **Arbitrum Orbit** | Tres rapide, ecosystem mature | 3-8K USD | Frais sequencer |
| **Hyperledger Besu** | Full prive, pas de token public | 5-15K USD | Abonnement infra |

##### Modele economique Appchain

```
Le pays deploie SafeLand sur "SafeChain-[PAYS]" (ta L2)

Chaque transaction on-chain :
  → Gas fee = 0.001-0.01 USD (negligeable pour l'utilisateur)
  → 100% du gas revient au SEQUENCER (= ta societe)
  → Avec 500K tx/an = 5K-50K USD/an de gas
  → MAIS le vrai revenue est l'infra fee (abonnement)

Abonnement infra :
  → Tu operes les noeuds validateurs
  → Tu geres les backups, monitoring, upgrades
  → 50K - 200K USD/an par pays
  → Le pays ne peut pas operer seul (expertise + infra)
```

##### Pourquoi le pays accepte

1. **Souverainete** — C'est LEUR blockchain, pas un reseau partage
2. **Performance** — Pas de congestion, gas quasi-gratuit pour les utilisateurs
3. **Confidentialite** — Les donnees ne sont pas sur un reseau public
4. **Controle** — Le pays peut decider qui valide les blocs
5. **Conformite** — Certains pays interdisent les crypto publiques (le L2 prive est OK)

##### Comparaison des 3 options blockchain

| Critere | Reseau public | Reseau prive (Besu) | Appchain L2 (recommande) |
|---------|-------------|--------------------|-----------------------|
| Souverainete | Faible | Forte | **Forte** |
| Securite | Tres forte (Ethereum) | Moyenne | **Forte** (ancrage L1) |
| Cout gas | Variable | Gratuit | **Quasi-gratuit** |
| Revenue pour toi | Platform fee seulement | Abonnement infra | **Gas + infra + fee** |
| Complexity | Faible | Moyenne | Moyenne |
| Scalabilite | Haute | Limitee | **Haute** |
| Controle pays | Aucun | Total | **Partage** (ideal) |

##### Revenue Appchain par pays

| Pays | Tx/an estimees | Gas revenue | Infra fee | Platform fee | Total/an |
|------|---------------|------------|----------|-------------|---------|
| Maroc | 50 000 | 5K | 100K | 2.5M | **2.6M** |
| Egypte | 100 000 | 10K | 150K | 1.5M | **1.66M** |
| Jordanie | 20 000 | 2K | 80K | 1.4M | **1.48M** |
| Ukraine | 60 000 | 6K | 120K | 1.5M | **1.63M** |
| **10 pays** | | | | | **~15M/an** |

**L'Appchain est le meilleur modele** : le pays est souverain (sa chain),
tu es indispensable (tu operes l'infra), et le revenue est triple
(gas + infra + platform fee).

---

#### Source 3 — Platform fee smart contract (recurrent, automatique)

En COMPLEMENT de l'Appchain, le platform fee est integre dans le smart contract Escrow.
Chaque transaction immobiliere preleve 0.05-0.15% vers le wallet de ta societe.

| Pays | Prix moyen propriete | Tx/an estimees | Fee 0.1% | Revenue/an |
|------|---------------------|----------------|----------|-----------|
| Maroc | 50K USD | 50 000 | 50 USD | 2.5M USD |
| Egypte | 15K USD | 100 000 | 15 USD | 1.5M USD |
| Jordanie | 70K USD | 20 000 | 70 USD | 1.4M USD |
| Syrie | 3K USD | 50 000 | 3 USD | 150K USD |
| Irak | 20K USD | 40 000 | 20 USD | 800K USD |
| Tunisie | 30K USD | 30 000 | 30 USD | 900K USD |
| Liban | 80K USD | 15 000 | 80 USD | 1.2M USD |
| Ukraine | 25K USD | 60 000 | 25 USD | 1.5M USD |
| Nigeria | 10K USD | 80 000 | 10 USD | 800K USD |
| Colombie | 40K USD | 50 000 | 40 USD | 2.0M USD |
| **10 pays** | | | | **12.8M USD/an** |

**C'est la source la plus importante.** Elle est :
- Automatique (smart contract, pas de facturation)
- Proportionnelle au volume (plus le pays utilise, plus tu gagnes)
- Ininterruptible (sauf upgrade du contrat par le pays)
- Transparente (auditable on-chain)

#### Source 4 — SaaS Admin (recurrent, abonnement)

| Tier | Fonctionnalites | Prix/an/pays |
|------|----------------|-------------|
| **Starter** | Dashboard basic, monitoring, alertes email | 60K USD |
| **Pro** | + Analytics avances, reporting bailleurs, API | 150K USD |
| **Enterprise** | + IA fraude, backup, upgrades auto, SLA 4h | 300K USD |

Projection avec 10 pays (mix de tiers) : **1.5M - 2.5M USD/an**

#### Source 5 — Support technique (recurrent, contrat)

| Niveau | SLA | Prix/an/pays |
|--------|-----|-------------|
| Standard | Response 48h, correctifs mensuels | 50K USD |
| Premium | Response 4h, correctifs hebdo, hotline | 150K USD |
| Critical | Response 1h, on-site, equipe dediee | 300K USD |

#### Source 6 — Modules et upgrades (ponctuel)

| Module | Description | Prix unitaire |
|--------|-------------|-------------|
| Module Reconstruction | Post-conflit (Syrie, Irak, Ukraine, Colombie) | 200K USD |
| Module Tasaluh | Reconciliation informel (Egypte, Afrique) | 200K USD |
| Module Refugees | Gestion camps/proprietes (Jordanie, Liban) | 150K USD |
| Module Multi-Rite | Succession multi-confessionnelle (Liban) | 180K USD |
| Module Coutumier | Droit coutumier (Afrique subsaharienne) | 200K USD |
| Module IA Anti-Fraude | Detection anomalies temps reel | 250K USD |
| Module Marketplace | Achat/vente immobilier P2P | 300K USD |
| Module Tokenisation Fractionnee | Investissement participatif | 250K USD |
| Module Hypotheque B2B | API banques + scoring IA | 200K USD |
| Module e-Notaire | Signature electronique qualifiee | 150K USD |
| Module Mobile | App React Native (offline-first) | 200K USD |
| Module Satellite | Integration imagerie satellite (preuves) | 180K USD |
| Upgrade V2 contrats | Migration majeure smart contracts | 100-300K USD |
| Adaptation loi | Quand la legislation change | 50-150K USD |

Chaque module est developpe UNE fois dans le template, vendu N fois aux pays.
Cout dev : 50-100K USD. Vente : 150-300K USD × N pays. Marge : 60-80%.

#### Source 7 — Conseil et integration (ponctuel)

| Service | Description | Prix |
|---------|-------------|------|
| Etude de faisabilite | Analyse pays + CDC | 30K - 80K USD |
| Integration SI existant | Connecter au cadastre actuel | 50K - 200K USD |
| Assistance deploiement | Equipe sur site (3-6 mois) | 100K - 400K USD |
| Audit periodique | Audit securite annuel | 50K - 100K USD |
| Formation continue | Sessions annuelles | 20K - 50K USD |

### 3.2 Projection financiere globale

| | An 1 (3 pays) | An 2 (7 pays) | An 3 (12 pays) | An 5 (20 pays) |
|--|--------------|--------------|---------------|---------------|
| Licences | 2.5M | 3.0M | 3.5M | 4.0M |
| Platform fees | 1.0M | 4.5M | 9.0M | 18.0M |
| SaaS Admin | 0.3M | 1.2M | 2.5M | 5.0M |
| Support | 0.2M | 0.8M | 1.5M | 3.0M |
| Modules | 0.5M | 1.5M | 3.0M | 5.0M |
| Conseil | 0.5M | 1.0M | 1.5M | 2.0M |
| **Total** | **5.0M** | **12.0M** | **21.0M** | **37.0M** |
| Couts | 3.0M | 5.0M | 8.0M | 12.0M |
| **Profit** | **2.0M** | **7.0M** | **13.0M** | **25.0M** |

---

## 4. Architecture Technique Multi-Pays

### 4.1 Le template (prive)

```
safeland-template/
├── core/                          # Code commun invariant (90%)
│   ├── contracts/
│   │   ├── SafeLandNFT.sol         # Parametrable (champs, categories)
│   │   ├── SafeLandEscrow.sol      # Parametrable (taux, wallets, platform fee)
│   │   ├── SafeLandSuccession.sol  # Parametrable (base parts, ecole, quorum)
│   │   ├── SafeLandJustice.sol     # Quasi-invariant
│   │   ├── SafeLandRegistry.sol    # Parametrable (noms regions)
│   │   └── SafeLandTimelock.sol    # Invariant
│   ├── backend/                    # Express + SQLite + WS
│   ├── frontend/                   # Next.js + React + Tailwind
│   └── test/                       # Tests parametrables
│
├── modules/                       # Modules optionnels (activables par pays)
│   ├── reconstruction/            # Post-conflit
│   │   ├── contracts/SafeLandReconstruction.sol
│   │   ├── backend/routes/reconstruction.js
│   │   ├── frontend/app/reconstruction/page.js
│   │   └── test/SafeLandReconstruction.test.js
│   ├── tasaluh/                   # Reconciliation informel
│   ├── refugees/                  # Gestion refugies
│   ├── multi-rite/                # Succession multi-confessionnelle
│   ├── coutumier/                 # Droit coutumier africain
│   ├── ai-fraud/                  # Detection fraude IA
│   ├── marketplace/               # Vente P2P
│   └── mobile/                    # App React Native
│
├── config/
│   └── countries/                 # 1 JSON par pays
│       ├── morocco.json
│       ├── syria.json
│       ├── egypt.json
│       ├── jordan.json
│       └── _template.json         # Template vide pour nouveau pays
│
├── templates/                     # Fichiers avec placeholders
│   ├── CDC-TEMPLATE.md
│   ├── deploy.js.ejs
│   ├── seed.js.ejs
│   ├── docker-compose.yml.ejs
│   ├── package.json.ejs
│   └── README.md.ejs
│
├── i18n/                          # Traductions par locale
│   ├── ar-MA.json                 # Arabe marocain
│   ├── ar-SY.json                 # Arabe syrien
│   ├── ar-EG.json                 # Arabe egyptien
│   ├── ar-JO.json                 # Arabe jordanien
│   ├── en.json                    # Anglais (base commune)
│   ├── fr.json                    # Francais
│   └── ku.json                    # Kurde
│
└── scripts/
    ├── generate.js                # LE GENERATEUR
    ├── validate-config.js         # Valide un country.json
    └── diff-upgrade.js            # Genere un patch pour un pays existant
```

### 4.2 Structure d'un country.json

```json
{
  "_version": "1.0",
  "_generated": false,

  "country": {
    "name": "Egypt",
    "code": "EG",
    "nameLocal": "مصر",
    "nameProject": "SafeLand Egypt"
  },

  "institution": {
    "cadastre": {
      "name": "Maslahat al-Shihr al-Aqari",
      "nameLocal": "مصلحة الشهر العقاري",
      "role": "AGENT_ROLE"
    },
    "treasury": {
      "name": "Ministry of Finance",
      "nameLocal": "وزارة المالية"
    },
    "justice": {
      "name": "Real Estate Court",
      "nameLocal": "المحكمة العقارية"
    }
  },

  "legal": {
    "landLaw": "Loi 114/1946 (Shihr Aqari)",
    "successionLaw": "Loi 77/1943 (Mawarith)",
    "successionSchool": "hanafi",
    "electronicSignatureLaw": "Loi 15/2004",
    "dataProtectionLaw": "Pas de loi specifique"
  },

  "fees": {
    "tax": { "bps": 250, "name": "Sharh Aqari", "wallet": "treasuryWallet" },
    "cadastre": { "bps": 150, "name": "Tawthiq", "wallet": "cadastreWallet" },
    "stamp": { "bps": 50, "name": "Damgha", "wallet": "stampWallet" },
    "platform": { "bps": 10, "name": "SafeLand Platform", "wallet": "platformWallet" }
  },

  "succession": {
    "baseShares": 120,
    "quorumBps": 6667,
    "minVoteDays": 30,
    "schoolRules": "hanafi"
  },

  "regions": {
    "level1": { "key": "muhafaza", "label": "Muhafaza", "labelLocal": "محافظة" },
    "level2": { "key": "markaz", "label": "Markaz", "labelLocal": "مركز" },
    "level3": { "key": "qarya", "label": "Qarya", "labelLocal": "قرية" }
  },

  "property": {
    "titleField": "raqmAlShahr",
    "titleLabel": "Registration Number",
    "titleLabelLocal": "رقم الشهر",
    "categories": [
      { "key": "musajjal", "label": "Registered", "labelLocal": "مسجل" },
      { "key": "wad_yad", "label": "Informal (Wad Yad)", "labelLocal": "وضع يد" },
      { "key": "awqaf", "label": "Waqf", "labelLocal": "أوقاف", "restricted": true },
      { "key": "desert", "label": "Desert Land", "labelLocal": "أراضي صحراوية" }
    ]
  },

  "languages": ["ar-EG", "en"],
  "defaultLanguage": "ar-EG",
  "rtl": true,

  "modules": ["tasaluh"],

  "tasaluh": {
    "reconciliationPeriodDays": 180,
    "witnessesRequired": 5,
    "maxInformalYears": 50,
    "enabled": true
  },

  "blockchain": {
    "targetNetwork": "polygon",
    "chainId": 137,
    "currency": "MATIC",
    "explorerUrl": "https://polygonscan.com"
  },

  "seed": {
    "cities": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان", "الأقصر", "المنصورة"],
    "sampleProperties": 6
  }
}
```

---

## 5. Le Generateur de Forks

### 5.1 Fonctionnement

```bash
node scripts/generate.js --country=egypt --output=../safeland-egypt
```

Le generateur :

1. **Valide** le country.json (tous les champs requis presents)
2. **Copie** le core (contracts, backend, frontend, test, scripts)
3. **Injecte** les parametres dans les contrats Solidity :
   - Taux fiscaux dans Escrow
   - Base parts et quorum dans Succession
   - Noms de champs region dans NFT et Registry
   - Platform fee wallet
4. **Active** les modules declares (copie contracts + routes + pages)
5. **Genere** les fichiers depuis les templates EJS :
   - deploy.js adapte (nombre de contrats, parametres)
   - seed.js avec donnees du pays
   - docker-compose.yml
   - package.json
   - README.md
6. **Copie** les traductions i18n du pays
7. **Genere** le CDC depuis le template
8. **Nettoie** les references aux autres pays
9. **Produit** un projet 100% standalone, pret a `npm install && npm test`

### 5.2 Pour ajouter un nouveau pays

```
Etape 1 : Creer config/countries/newcountry.json    # 1-2h (recherche juridique)
Etape 2 : Creer i18n/ar-XX.json (si nouvelle locale) # 2-4h (traduction)
Etape 3 : Creer un module specifique si necessaire    # 4-16h (dev)
Etape 4 : node scripts/generate.js --country=newcountry
Etape 5 : cd safeland-newcountry && npm test          # Verification
Etape 6 : Adapter la documentation CDC/B2G            # 2-4h
```

**Temps total : 1-3 jours** au lieu de 2-3 semaines en fork manuel.

---

## 6. Le Platform Fee

### 6.1 Mecanisme technique

```solidity
contract SafeLandEscrow {
    uint256 public platformFeeBps;     // 10 = 0.1%
    address public platformWallet;     // Wallet de ta societe

    function initialize(
        address admin,
        address _nftContract,
        address[] memory _wallets,     // [treasury, cadastre, stamp, platform]
        uint256[] memory _feesBps      // [300, 250, 50, 10]
    ) public initializer {
        // ... setup
        platformFeeBps = _feesBps[3];
        platformWallet = _wallets[3];
    }

    function notaryComplete(uint256 dealId) external {
        // ... calculs fiscaux
        uint256 platformFee = (price * platformFeeBps) / BPS_DENOMINATOR;
        sellerNet = price - taxAmount - cadastreAmount - stampAmount - platformFee;

        // Paiements
        _safeTransfer(treasuryWallet, taxAmount);
        _safeTransfer(cadastreWallet, cadastreAmount);
        if (stampAmount > 0) _safeTransfer(stampWallet, stampAmount);
        _safeTransfer(platformWallet, platformFee);
        _safeTransfer(seller, sellerNet);
    }
}
```

### 6.2 Justification aupres du pays

**Argument 1 — Transparence**
"Le fee est dans le smart contract, visible on-chain. Pas de facture opaque."

**Argument 2 — Alignement d'interets**
"On gagne plus quand vous utilisez plus. On a interet a ce que ca marche."

**Argument 3 — Negligeable**
"0.1% sur une transaction a 50K USD = 50 USD. Le notaire coute 1000 USD."

**Argument 4 — Contrepartie**
"Ce fee finance la maintenance, les mises a jour securite, et le monitoring."

**Argument 5 — Desactivable**
"Vous pouvez upgrader le contrat et mettre le fee a 0. Mais vous perdez le support."

### 6.3 Strategies de pricing

| Strategie | Fee | Quand |
|-----------|-----|-------|
| Freemium | 0% pendant 12 mois, puis 0.1% | Pour convaincre un premier pays |
| Standard | 0.1% des le debut | Pays avec financement assure |
| Degressif | 0.15% < 10K tx/an, 0.1% 10-50K, 0.05% > 50K | Grands pays (Egypte, Nigeria) |
| Plafonné | 0.1% plafonne a 200 USD/tx | Pays a prix immobilier eleve (Liban, Jordanie) |
| Mixte | 0.05% + SaaS obligatoire | Si le pays negocie la baisse du fee |

---

## 7. Le SaaS Admin

### 7.1 Fonctionnalites par tier

#### Tier Starter (60K USD/an)

- Dashboard temps reel : NFT crees, transactions, revenue fiscal
- Monitoring blockchain : block height, gas, latence RPC
- Alertes email : contrat pause, transaction echouee, node down
- Logs : historique des operations admin
- Support : ticketing (response 48h)

#### Tier Pro (150K USD/an)

Tout Starter +
- Analytics avances : tendances, heatmaps geographiques, saisonnalite
- Reporting bailleurs : rapports PDF automatiques (UN-Habitat, BM)
- API REST : integration avec BI du pays (Power BI, Tableau)
- Alertes SMS/webhook : pour operations critiques
- Multi-utilisateurs : RBAC pour l'equipe admin du pays
- Support : response 24h, call mensuel

#### Tier Enterprise (300K USD/an)

Tout Pro +
- IA anti-fraude : detection patterns suspects (double vente, collusion, prix anormaux)
- Backup & disaster recovery : snapshot quotidien, restore en 1h
- Upgrades automatiques : push des patches securite sans intervention
- SLA : disponibilite 99.9%, response 4h, on-site si critique
- Equipe dediee : 1 ingenieur assigne au pays
- Formation continue : 2 sessions/an pour l'equipe du pays

### 7.2 Stack technique du SaaS

```
safeland-admin/                    # Heberge chez toi (AWS/GCP)
├── backend/
│   ├── multi-tenant API           # 1 instance, N pays
│   ├── blockchain listeners       # Ecoute chaque reseau pays
│   ├── analytics engine           # Agregation, tendances
│   ├── alert engine               # Rules engine, seuils
│   └── report generator           # PDF, CSV, Excel
├── frontend/
│   ├── dashboard/                 # Vue globale multi-pays
│   ├── country/[code]/            # Vue par pays
│   ├── fraud-detection/           # Interface IA
│   └── settings/                  # Config alertes, users
├── ml/
│   ├── fraud-model/               # Modele de detection
│   └── price-anomaly/             # Detection prix anormaux
└── infra/
    ├── docker-compose.yml
    ├── kubernetes/                 # Pour scaler
    └── monitoring/                 # Grafana, Prometheus
```

---

## 8. Catalogue de Modules Vendables

### 8.1 Modules metier

| Module | Description | Pays cibles | Dev cost | Sell price | Marge |
|--------|-------------|-------------|----------|-----------|-------|
| **Reconstruction** | Revendications post-conflit, contestation, preuves | Syrie, Irak, Ukraine, Libye, Yemen, Colombie | 80K | 200K | 60% |
| **Tasaluh** | Reconciliation proprietes informelles | Egypte, Inde, Afrique | 70K | 200K | 65% |
| **Refugees** | Proprietes refugies, droits temporaires | Jordanie, Liban, Turquie | 60K | 150K | 60% |
| **Multi-Rite** | Succession multi-confessionnelle | Liban, Inde, Nigeria | 90K | 180K | 50% |
| **Coutumier** | Droit coutumier, chefs traditionnels | RDC, Nigeria, Cameroun, Madagascar | 80K | 200K | 60% |
| **Arsh** | Terres collectives, habous | Tunisie, Algerie | 50K | 150K | 67% |

### 8.2 Modules techniques

| Module | Description | Pays cibles | Dev cost | Sell price | Marge |
|--------|-------------|-------------|----------|-----------|-------|
| **IA Anti-Fraude** | Detection anomalies ML | Tous | 120K | 250K | 52% |
| **Marketplace** | Achat/vente P2P immobilier | Tous (phase 2+) | 150K | 300K | 50% |
| **Tokenisation Fractionnee** | Investissement participatif | Emirats, Maroc, Egypte | 130K | 250K | 48% |
| **Hypotheque B2B** | API banques + scoring | Tous | 100K | 200K | 50% |
| **e-Notaire** | Signature electronique qualifiee | Tous | 80K | 150K | 47% |
| **Mobile** | App React Native offline-first | Tous (surtout Afrique) | 120K | 200K | 40% |
| **Satellite** | Integration imagerie satellite | Post-conflit, rural | 90K | 180K | 50% |
| **Interoperabilite** | Bridge entre chains pays | Multi-pays | 100K | 200K | 50% |

### 8.3 Strategie de developpement

```
An 1 : Reconstruction + Tasaluh (couvrent les 2 premiers besoins)
An 2 : IA Anti-Fraude + Mobile + Hypotheque B2B
An 3 : Marketplace + Tokenisation + Satellite
```

Chaque module est developpe UNE fois, vendu a N pays. Plus tu as de pays, plus la marge monte.

---

## 9. Strategie de Deploiement par Pays

### 9.1 Matrice de priorite

| Pays | Urgence | Solvabilite | Complexite | Visibilite | Score | Priorite |
|------|---------|-------------|-----------|------------|-------|---------|
| Maroc | 7/10 | 8/10 | 5/10 | 7/10 | 27 | **P0 — En cours** |
| Egypte | 9/10 | 7/10 | 7/10 | 9/10 | 32 | **P1** |
| Jordanie | 6/10 | 8/10 | 4/10 | 7/10 | 25 | **P1** |
| Ukraine | 10/10 | 9/10 (fonds UE) | 6/10 | 10/10 | 35 | **P1** |
| Irak | 9/10 | 7/10 (BM) | 8/10 | 8/10 | 32 | **P2** |
| Tunisie | 6/10 | 6/10 | 4/10 | 5/10 | 21 | **P2** |
| Liban | 8/10 | 5/10 | 9/10 | 7/10 | 29 | **P2** |
| Colombie | 8/10 | 8/10 (BID) | 6/10 | 8/10 | 30 | **P2** |
| Nigeria | 8/10 | 6/10 | 8/10 | 8/10 | 30 | **P3** |
| RDC | 10/10 | 5/10 (BM) | 10/10 | 7/10 | 32 | **P3** |

### 9.2 Strategie d'approche par type de pays

#### Type A — Pays stables avec budget (Maroc, Jordanie, Tunisie)
- Approche directe : PPP avec le gouvernement
- Financement : budget national + cooperation bilaterale
- Cycle de vente : 6-12 mois
- Revenue : licence + platform fee + SaaS

#### Type B — Pays post-conflit avec fonds internationaux (Syrie, Irak, Ukraine)
- Approche via ONG/agences : UN-Habitat, UNHCR, Banque Mondiale
- Financement : grants internationaux
- Cycle de vente : 12-24 mois (appels d'offres)
- Revenue : licence (finance par le grant) + platform fee + SaaS

#### Type C — Grands marches emergents (Egypte, Nigeria, Inde)
- Approche via pilote regional + extension
- Financement : mix national + BM/BAD
- Cycle de vente : 12-18 mois
- Revenue : tres eleve (volume de transactions)

#### Type D — Pays fragiles (Somalie, Yemen, Libye)
- Approche 100% via ONG internationales
- Financement : grants humanitaires
- Cycle de vente : 6-12 mois (urgence)
- Revenue : licence modeste, mais reference prestigieuse

---

## 10. Fiches Pays Detaillees

### 10.1 Egypte

| Parametre | Valeur |
|-----------|--------|
| Population | 104 millions |
| Proprietes estimees | ~40 millions |
| % non enregistre | ~90% (wad' yad, informel) |
| Institution cle | Maslahat al-Shihr al-Aqari (مصلحة الشهر العقاري) |
| Droit successoral | Hanafite (loi 77/1943 Mawarith) |
| Fiscalite | Sharh Aqari 2.5% + Tawthiq 1.5% + Damgha 0.5% = 4.5% |
| Module specifique | Tasaluh (reconciliation informel) |
| Langues | ar-EG, en |
| Financement | Banque Mondiale, BAD, budget national |
| Revenue potentiel | Platform fee 1.5M USD/an + licence 1M USD |
| Complexite | Moyenne-haute (economie informelle massive) |
| Contact initial | Min. Justice + Shihr Aqari + BM bureau Caire |

**Use case principal** : Regulariser les 90% de proprietes informelles (wad' yad)
via le module Tasaluh, puis les tokeniser en NFT.

### 10.2 Jordanie

| Parametre | Valeur |
|-----------|--------|
| Population | 11 millions (dont 1.3M refugies syriens) |
| Institution cle | Department of Land and Survey (دائرة الأراضي والمساحة) |
| Droit successoral | Hanafite (loi statut personnel) |
| Fiscalite | Mutation 4% + inscription 1% = 5% |
| Module specifique | Refugees (gestion proprietes refugies) |
| Langues | ar-JO, en |
| Financement | USAID, UE, Banque Mondiale |
| Revenue potentiel | Platform fee 1.4M USD/an + licence 800K USD |
| Complexite | Faible-moyenne (pays stable, administration fonctionnelle) |

**Use case principal** : Moderniser le cadastre + gerer les droits fonciers
des refugies syriens (proprietes en leur nom/temporaires).

### 10.3 Ukraine

| Parametre | Valeur |
|-----------|--------|
| Population | 37 millions (avant conflit) |
| Institution cle | StateGeoCadastre (Держгеокадастр) |
| Droit successoral | Code civil (pas religieux) |
| Fiscalite | Mutation 1% + notaire 1% = 2% |
| Module specifique | Reconstruction (zones liberees/occupees) |
| Langues | uk, en, ru |
| Financement | UE (50B+ EUR mobilises), USAID, BM, BERD |
| Revenue potentiel | Platform fee 1.5M USD/an + licence 1.5M USD |
| Complexite | Moyenne (bon systeme IT, conflit actif) |

**Use case principal** : Zones liberees ou les registres sont contestes/detruits.
Le module Reconstruction est directement applicable. **Financement massif disponible.**

### 10.4 Irak

| Parametre | Valeur |
|-----------|--------|
| Population | 43 millions |
| Institution cle | General Directorate of Real Estate Registration |
| Droit successoral | Hanafite (Code du statut personnel 188/1959) |
| Fiscalite | Mutation 3% + inscription 2% = 5% |
| Module specifique | Reconstruction (post-Daech, Mossoul/Anbar) |
| Langues | ar-IQ, ku, en |
| Financement | Banque Mondiale, USAID, UN-Habitat |
| Revenue potentiel | Platform fee 800K USD/an + licence 1M USD |

### 10.5 Tunisie

| Parametre | Valeur |
|-----------|--------|
| Population | 12 millions |
| Institution cle | Office de la Topographie et du Cadastre (OTC) |
| Droit successoral | Malekite (Code du statut personnel 1956) |
| Fiscalite | Droits enregistrement 5% + timbre 1% = 6% |
| Module specifique | Arsh (terres collectives) |
| Langues | ar-TN, fr, en |
| Financement | AFD, UE, BAD |
| Revenue potentiel | Platform fee 900K USD/an + licence 700K USD |

### 10.6 Liban

| Parametre | Valeur |
|-----------|--------|
| Population | 5.5 millions (+ 1.5M refugies syriens) |
| Institution cle | Direction des Affaires Foncieres (مديرية الشؤون العقارية) |
| Droit successoral | Multi-rite (18 confessions, chacune ses regles) |
| Fiscalite | Mutation 5-6% variable par region |
| Module specifique | Multi-Rite + Refugees |
| Langues | ar-LB, fr, en |
| Financement | UE, France, BM (si stabilite politique) |
| Complexite | Tres haute (multi-confessionnel, crise economique) |

---

## 11. Gestion de la Propriete Intellectuelle

### 11.1 Ce que tu proteges

| Element | Protection | Juridiction |
|---------|-----------|-------------|
| Template generateur | Trade secret + copyright | Societe (Maroc ou autre) |
| SaaS Admin | SaaS heberge, pas livre | Ton infrastructure |
| IA anti-fraude (modele) | Trade secret | Ton infrastructure |
| Marque "SafeLand" | Depot OMPIC + WIPO | International |
| Documentation/CDC | Copyright | Societe |
| Architecture multi-pays | Brevet potentiel | PCT (international) |

### 11.2 Ce que tu livres

| Element | Licence | Droits du pays |
|---------|---------|---------------|
| Code fork | Licence perpetuelle exclusive pour le territoire | Utiliser, modifier, deployer |
| Smart contracts deployes | Propriete du pays | Upgrader, pause, modifier |
| Donnees on-chain | Propriete souveraine du pays | Total |
| Documentation adaptee | Licence perpetuelle | Utiliser, distribuer internement |

### 11.3 Clauses contractuelles cles

**1. Non-concurrence territoriale**
"Le fork est licence pour le territoire du pays uniquement.
Le pays ne peut pas le revendre a un autre pays."

**2. Non-reverse-engineering du template**
"Le pays ne peut pas reconstituer le generateur a partir du fork."

**3. Attribution**
"Mention obligatoire : Powered by SafeLand Technology"

**4. Maintenance lie au fee**
"Le support et les mises a jour sont conditionnes au maintien du platform fee."

**5. Clause d'upgrade**
"Les upgrades majeures sont disponibles moyennant un contrat de service."

---

## 12. Cycle de Vie d'un Projet Pays

### Phase 0 — Prospection (1-3 mois)
```
Identifier le pays → Contact institutionnel → Etude faisabilite → Proposition
```
- Cout : 20-50K USD (temps + deplacement)
- Livrable : etude de faisabilite + proposition commerciale

### Phase 1 — Contrat (1-2 mois)
```
Negociation → Signature → Acompte (30%)
```
- Livrable : contrat signe, country.json valide

### Phase 2 — Generation et adaptation (1-3 mois)
```
Generer fork → Adapter modules → Tests → Audit securite
```
- Livrable : projet standalone, 100% tests verts, audit passe

### Phase 3 — Integration (2-4 mois)
```
Deploiement infra → Integration SI existant → Formation equipe locale
```
- Livrable : plateforme deployee sur l'infra du pays

### Phase 4 — Pilote (3-6 mois)
```
Pilote regional → Correction bugs → Feedback utilisateurs → Ajustements
```
- Livrable : pilote operationnel, retours documentes

### Phase 5 — Extension (6-12 mois)
```
Extension nationale → Formation agents → Montee en charge
```
- Livrable : deploiement national, SaaS Admin connecte

### Phase 6 — Operations (ongoing)
```
Support → Monitoring → Upgrades → Nouveaux modules
```
- Revenue recurrent : platform fee + SaaS + support + modules

---

## 13. Equipe et Organisation

### 13.1 Equipe core (permanente, ta societe)

| Role | Effectif | Salaire/an | Responsabilite |
|------|---------|-----------|---------------|
| CTO / Architecte blockchain | 1 | 120K USD | Architecture, decisions techniques |
| Dev Solidity senior | 2 | 100K USD × 2 | Smart contracts, upgrades, nouveaux modules |
| Dev Full-Stack senior | 2 | 90K USD × 2 | Backend, frontend, SaaS Admin |
| DevOps / SRE | 1 | 90K USD | Infra, deploiement, monitoring |
| Chef de projet / BD | 1 | 100K USD | Prospection pays, gestion projets |
| Juriste / Expert foncier | 1 | 80K USD | Recherche juridique, country.json, CDC |
| **Total core** | **8** | **870K USD/an** | |

### 13.2 Equipe projet (par pays, temporaire)

| Role | Duree | Cout |
|------|-------|------|
| Chef de projet pays | 6-12 mois | 80K USD |
| Dev integration | 3-6 mois | 50K USD |
| Traducteur/localisateur | 1-2 mois | 10K USD |
| Expert terrain (local) | 6-12 mois | 30K USD |
| Formateur | 2-4 semaines | 15K USD |

### 13.3 Evolution de l'equipe

| Periode | Equipe core | Equipes projet | Total |
|---------|------------|---------------|-------|
| An 1 (3 pays) | 8 | 6 | 14 |
| An 2 (7 pays) | 12 | 10 | 22 |
| An 3 (12 pays) | 15 | 15 | 30 |
| An 5 (20 pays) | 20 | 20 | 40 |

---

## 14. Financement et Levee de Fonds

### 14.1 Besoins

| Phase | Besoin | Utilisation |
|-------|--------|------------|
| Seed (maintenant) | 500K - 1M USD | Finaliser template, 3 premiers pays, equipe core |
| Serie A (An 1-2) | 3-5M USD | Scaler a 7-10 pays, SaaS Admin, modules |
| Serie B (An 3+) | 10-15M USD | 20+ pays, IA, marketplace, expansion globale |

### 14.2 Sources de financement

| Source | Type | Montant | Probabilite |
|--------|------|---------|------------|
| Fonds propres / bootstrapping | Equity | 100-300K USD | Haute |
| Business angels (PropTech/GovTech) | Equity | 300K-1M USD | Moyenne |
| VC GovTech (Govtech Fund, Public, etc.) | Equity | 3-10M USD | Moyenne |
| Fonds impact (Omidyar, Skoll, etc.) | Equity/Grant | 1-5M USD | Moyenne |
| Grants innovation (UE Horizon, USAID DIV) | Grant | 500K-2M USD | Moyenne |
| Revenue premiers pays | Revenue | 2-5M USD/an | Haute (si execution) |

### 14.3 Pitch investors — metriques cles

| Metrique | Valeur |
|----------|--------|
| TAM | 50B+ USD (marche cadastral mondial) |
| SAM | 5B USD (pays cibles) |
| SOM An 3 | 21M USD revenue |
| Marge brute | 60-70% |
| LTV/pays | 5-15M USD (sur 10 ans) |
| CAC/pays | 100-300K USD |
| LTV/CAC | 20-50x |
| Moat | Template + expertise + PI + relations institutionnelles |

---

## 15. Risques et Mitigation

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|-----------|
| Un pays supprime le platform fee | Moyenne | Moyen | Clause contractuelle + SaaS devient payant |
| Un pays fork et revend | Faible | Eleve | Licence territoriale + non-concurrence |
| Concurrent copie l'approche | Moyenne | Moyen | Avance technologique + relations + modules |
| Instabilite dans un pays client | Haute | Moyen | Diversification geographique (20+ pays) |
| Bug securite smart contract | Faible | Critique | Audit externe + bug bounty + assurance |
| Changement de gouvernement | Haute | Moyen | Contrats multi-annuels + integration profonde |
| Sanctions internationales | Moyenne | Eleve | Due diligence OFAC + avis juridique par pays |
| Difficulte de recrutement | Moyenne | Moyen | Remote-first + salaires competitifs |
| Lenteur cycle de vente B2G | Haute | Moyen | Pipeline large (20+ pays en parallele) |

---

## 16. Plan d'Action 3 Ans

### An 1 — Foundation

| Trimestre | Actions |
|-----------|---------|
| T1 | Finaliser SafeLand Maroc (pilote). Construire template multi-pays. |
| T2 | Generer forks Egypte + Jordanie. Prospecter Ukraine + Irak. |
| T3 | Deployer pilotes Egypte + Jordanie. Developper SaaS Admin MVP. |
| T4 | Premiers revenues recurrents. Preparer Serie A. |

**KPIs An 1 :** 3 pays deployes, 5M USD revenue, template operationnel, SaaS MVP

### An 2 — Scale

| Trimestre | Actions |
|-----------|---------|
| T1 | Serie A levee. Deployer Ukraine + Irak. |
| T2 | Developper modules IA Anti-Fraude + Mobile. |
| T3 | Deployer Tunisie + Liban + Colombie. SaaS Pro lance. |
| T4 | 7 pays operationnels. Preparer expansion Afrique. |

**KPIs An 2 :** 7 pays, 12M USD revenue, 3 modules disponibles, equipe 22

### An 3 — Dominate

| Trimestre | Actions |
|-----------|---------|
| T1 | Deployer Nigeria + RDC + Kenya. |
| T2 | Module Marketplace + Tokenisation. |
| T3 | 12 pays. SaaS Enterprise. Serie B. |
| T4 | Expansion Asie (Pakistan, Inde pilote). |

**KPIs An 3 :** 12 pays, 21M USD revenue, 8 modules, equipe 30

---

## 17. Metriques et KPIs

### 17.1 KPIs business

| KPI | Frequence | Cible An 1 |
|-----|-----------|-----------|
| Nombre de pays deployes | Mensuel | 3 |
| Revenue total | Mensuel | 5M USD |
| Revenue recurrent (ARR) | Mensuel | 2M USD |
| Platform fee mensuel | Quotidien | 100K+ USD |
| Nombre de transactions on-chain | Quotidien | 50K+/mois |
| Nombre d'agents formes | Trimestriel | 100+ |
| Pipeline pays en negociation | Mensuel | 5+ |
| NPS pays (satisfaction) | Semestriel | > 8/10 |

### 17.2 KPIs techniques

| KPI | Frequence | Cible |
|-----|-----------|-------|
| Uptime SaaS Admin | Continu | 99.9% |
| Temps generation fork | Par run | < 5 min |
| Tests verts par fork | Par generation | 100% |
| Temps deploiement pays | Par projet | < 3 mois |
| Bugs critiques en production | Mensuel | 0 |
| Delai correction bug P1 | Par incident | < 4h |
| Nombre de modules disponibles | Trimestriel | +1/trimestre |

---

## 18. Annexes

### A. Checklist nouveau pays

```
[ ] Recherche juridique (lois foncieres, succession, fiscalite)
[ ] Identification institution cle + contact
[ ] Creation country.json (tous les champs)
[ ] Validation country.json (scripts/validate-config.js)
[ ] Traduction i18n (locale specifique)
[ ] Identification modules necessaires
[ ] Dev module specifique si necessaire
[ ] Generation fork (scripts/generate.js)
[ ] npm install && npm test (fork standalone)
[ ] npm run compile (smart contracts)
[ ] Redaction CDC adapte
[ ] Redaction docs B2G adaptes
[ ] Proposition commerciale
[ ] Estimation budget + timeline
[ ] Due diligence OFAC/sanctions
```

### B. Template d'offre commerciale

```
OFFRE COMMERCIALE — SafeLand [PAYS]

1. Contexte et enjeux specifiques au pays
2. Solution proposee (modules actives)
3. Livrables
   - Fork standalone (code + smart contracts + frontend)
   - Documentation (CDC, guide utilisateurs, docs admin)
   - Formation (N agents, N jours)
   - Deploiement (infra + integration)
4. Modele economique
   - Licence initiale : XXX USD
   - Platform fee : 0.1% par transaction
   - SaaS Admin : XXX USD/an (tier)
   - Support : XXX USD/an
5. Planning
   - Phase 1 : Adaptation (X mois)
   - Phase 2 : Pilote (X mois)
   - Phase 3 : Extension (X mois)
6. Equipe
7. References (autres pays deployes)
8. Conditions generales
```

### C. Tableau comparatif ecoles juridiques succession

| Ecole | Pays | Base parts | Specificites |
|-------|------|-----------|-------------|
| Malekite | Maroc, Tunisie, Algerie, Mauritanie, Libye | 24 | Grand-pere ne remplace pas le pere |
| Hanafite | Egypte, Syrie, Jordanie, Irak, Turquie, Pakistan, Inde | 120 | Grand-pere = pere. Awl different |
| Chafiite | Yemen, Malaisie, Indonesie, Somalie | 24 | Proche malekite, differences mineures |
| Hanbalite | Arabie Saoudite, Qatar, Emirats | 24 | Plus strict sur les parts femmes |
| Jafarite (chiite) | Iran, Irak (chiites), Liban (chiites) | 120 | Pas de asaba, radd different |
| Civil (non-religieux) | Ukraine, Colombie, Georgie | Variable | Code civil standard |
| Coutumier | RDC, Nigeria, Cameroun, Madagascar | Variable | Chef traditionnel decide |
| Multi-rite | Liban (18 confessions) | Variable | Chaque confession ses regles |

### D. Contacts organisations internationales

| Organisation | Division | Contact type | Objet |
|-------------|----------|-------------|-------|
| UN-Habitat | GLTN | gltn@unhabitat.org | Land tools, financement |
| Banque Mondiale | Land GP | Representant pays | Financement, expertise |
| UNHCR | HLP | Bureau pays | Retour deplaces |
| NRC | ICLA | Bureau pays | Droits HLP |
| GIZ | Governance | Bureau pays | Cooperation technique |
| AFD | Gouvernance | Bureau pays | Financement francophonie |
| USAID | Democracy | Bureau pays | Governance, land |
| UE | DG NEAR / DG INTPA | Delegation pays | Financement |
| BID | Institutions | Bureau pays | Amerique latine |
| BAD | Gouvernance | Bureau pays | Afrique |

---

**Document strictement confidentiel**
**SafeLand — Guide Strategique Multi-Pays v1.0 — Avril 2026**
**Ne pas diffuser en dehors de la societe**
