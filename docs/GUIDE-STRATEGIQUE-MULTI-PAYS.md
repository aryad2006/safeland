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
18. [Strategie d'acquisition par pays](#18-strategie-dacquisition-par-pays)
19. [Annexes](#19-annexes)

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

### 1.3 Avantage competitif (vs alternatives reelles)

SafeLand se positionne contre 3 categories concurrentes :

#### A) Vs Solutions legacy (Oracle, SAP, Landviser, HMRC UK)

| Critere | Systemes legacy | SafeLand | Evidence |
|---------|---|---|---|
| **Souverainete & lock-in** | Cloud hebergé USA/EU, migrations coûteuses | Code fork livré, 0 dépendance SafeLand post-deployment | Maroc propriétaire de son fork ; peut embaucher devs locaux pour maintenance ; blockchain immutable reste chez pays |
| **Coût initial** | 5-15M USD (Oracle Spatial, SAP, HMRC) | 600K-1.7M USD (fork + modules + formation) | Oracle : $5M implementation + $500K/an opérations. SafeLand : flat $1M all-in (2026), puis $200-300K/an récurrent |
| **Temps deploiement** | 18-36 mois (construction, tests, data migration) | 4-6 mois (Maroc foi-juin 2026) | Maroc = 4 mois février-juin go-live. Oracle moyen : 2+ ans |
| **Flexibilité juridique** | Hardcodé pour 1-2 pays, très cher adapter | Generateur JSON : < 2 semaines adapter taux, écoles | Maroc malékite (hardcodé). Sénégal hanafite : JSON param, 0 code change |
| **Immuabilité audit** | Base de donnees centralisée, audit trail rétrospectif | Blockchain : tout on-chaîne, tamper-proof, temps réel | NFT titre + Escrow transaction : 100% visible on-chaîne, pas de "correction" secrète |
| **Successions complexes** | Requiert module custom ($$$) ou manuel | Multi-école intégrée (Malékite, Hanafite, Chaféite, Hanbalite) | SafeLandFridda.sol calcule parts auto selon école + héritiers déclarés |
| **Fonds internationaux** | Budget national uniquement | Compatible BM, AFD, USAID, UN programs | Maroc : cofinancé ANCFCC (bailleur foncier) |

**Prix impact :**
- Oracle : 5M implementation + 500K/an = 7M sur 5 ans
- SafeLand : 1M licence + 250K/an SaaS/support = 2.25M sur 5 ans
- **Saving : 65% coûts**

#### B) Vs Solutions blockchain startup (Propy, Unisot, RealT, Verifi)

| Critere | Blockchain startups | SafeLand | Evidence |
|---------|---|---|---|
| **Domaine expertise** | General real estate / fintech tokenization | **Cadastre + foncier + successions islamiques** | Propy : focus fintech. SafeLand : 15+ juristes fonciers, droit malékite codifié |
| **Modèle business** | Centralized SaaS, proprietary smart contracts | Open-fork (pays propriétaire), SaaS optionnel | Propy = dépendance SaaS. SafeLand = fork souverain + SaaS optionnel |
| **Multi-juridiction** | Générique (pas adapté droit local) | Parametré par pays (taux, écoles, régions) | Propy tokens = simplification US law. SafeLand = Maroc malékite exactement |
| **Succession support** | None (focus trading/investment) | Native (multi-école, héritage, guardians) | SafeLandFridda : héritage full juridique |
| **Government adoption** | Difficile (crypto-skepticism) | Réformateurs digitaux (BM, USAID backing) | Maroc : co-led par ANCFCC (cadastre). Propy : startups uniquement |
| **Regulatory compliance** | Light (crypto native) | Deep (audit + CDC + legal framework) | SafeLand : contrats country-specific, due diligence OFAC, partenaires legal |

**Avantage clé :** SafeLand adapté droit local. Startups blockchain = one-size-fits-all.

#### C) Vs Competitor directs (Hypothèse : autre firma blockchain cadastrale)

| Critere | Competitors potentiels | SafeLand | Evidence |
|---------|---|---|---|
| **Expertise foncier** | Géographie, pas droit juridique | **15+ ans foncier MENA + Africa** | Fondateur = ancien ANCFCC. Juristes malékite in-house. |
| **Produit mature** | En R&D, 0 go-live | **MVP Maroc production juin 2026** | Maroc = 4 mois dev. Competitors = vaporware 2024-2025 |
| **Écosystème**, | SDK fragile, ecosystem immature | **TheGraph + Pinata + MetaMask integrations** | 206 tests smart contracts, 167 tests backend, Playwright E2E — production-grade |
| **Multi-pays capability** | Conceitual, generateur n'existe pas | **Roadmap Q2 2026 : générateur JSON** | SafeLand generates 10 pays en 10 jours. Competitors = fork-per-country manual |
| **SaaS monetization** | Pas d'admin dashboard | **Roadmap Q3 2026 : SaaS 3 tiers** | SafeLand = 60-300K/an SaaS. Competitors = license only |
| **Modules vendables** | Généric, hard sell | **12 modules domain-specific** (reconstruction, tasaluh, succession multi-rite, etc.) | Reconstruction = Syria/Irak/Ukraine demand. Tasaluh = Egypt/Tunisia demand. Competitors = 0 modules |

**Avantage clé :** SafeLand = executeur (not dreamer). 4 mois go-live vs. 0 produits concurrents.

---

**Synthèse positionnement :**
1. **vs Legacy systems :** 65% coût réduit, 4x plus rapide, souveraineté totale
2. **vs Blockchain startups :** Expertise juridique incomparable, modèle ouvert, adoption gouvernementale
3. **vs Competitors :** Produit live, générateur en Q2, revenue model complet

SafeLand n'est pas un "SaaS blockchain cadastre générique". C'est une **solution adaptée droit local, avec revenue models pour financer 20+ pays**, et code souverain pour chaque pays.

---

## 2. Architecture du Business

### 2.1 Les 3 entites (Vision multi-pays)

**VISION STRATEGIQUE :** Architecture à 3 entités pour isoler propriété intellectuelle, souveraineté pays, et revenus récurrents. **STATUT IMPLEMENTATION (avril 2026) :** Entité 1 (Core template) et Entité 2 (fork Maroc) existent en version monolithique. Entités 2 et 3 multi-pays sont en développement (Roadmap 2026-2027).

```
┌─────────────────────────────────────────────────────┐
│  ENTITE 1 — SafeLand Core (ta societe)              │
│  Prive, jamais livre                                 │
│                                                      │
│  • Template multi-pays + generateur (Roadmap Q2)    │
│  • R&D : nouveaux modules, IA, blockchain            │
│  • Equipe technique core (5-8 personnes)             │
│  • Propriete intellectuelle du template              │
│  • Repository private (Github)                       │
│  • Status avril 2026 : MVP Maroc monolithique       │
│    (6 contrats, backend Node.js, frontend Next.js)  │
│  • Roadmap : Refactor en template + generateur JSON  │
└───────────────┬─────────────────────────────────────┘
                │ sera generé via generateur.js
                │ (actuellement : fork manuel)
                ▼
┌─────────────────────────────────────────────────────┐
│  ENTITE 2 — SafeLand [Pays] (fork livre)            │
│  Propriete du pays, souverain                        │
│                                                      │
│  • Code complet, deployable, modifiable              │
│  • Donnees on-chain = propriete de l'Etat            │
│  • Infrastructure hebergee par le pays (ou AWS/cloud)│
│  • Le pays peut operer seul si necessaire            │
│  • Status avril 2026 : Maroc deploye (go-live juin) │
│  • Status Q3 2026+ : Senegal, Egypte, etc.           │
│  • Fork repository livré au pays (accès complet)     │
└───────────────┬─────────────────────────────────────┘
                │ connecte a (optionnel mais vital)
                │ pour monitoring, upgrades, support
                ▼
┌─────────────────────────────────────────────────────┐
│  ENTITE 3 — SafeLand Admin Dashboard (SaaS)         │
│  Heberge par SafeLand Core, abonnement annuel       │
│                                                      │
│  • Dashboard multi-pays (Roadmap Q3 2026)           │
│  • Monitoring blockchain + backend health            │
│  • Alertes et KPIs (transactions, revenue)           │
│  • Detection fraude IA (Roadmap Q3-Q4 2026)         │
│  • Reporting bailleurs de fonds (stats)              │
│  • Gestionnaire d'upgrades (push optionnel)          │
│  • Support ticketing integre                         │
│  • Status avril 2026 : N'existe pas encore          │
│  • Architecture : Frontend Next.js + API backend     │
│  • Tiers : Starter (60K), Pro (150K), Enterprise     │
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

### 3.2 Projection financiere globale (Roadmap 2026-2028)

**STATUT AVRIL 2026 :** Seule la license initiale est operationnelle. Platform fee, SaaS Admin, et Appchain sont en development ou roadmap.

Projection assumant :
1. **Generateur live Q2 2026** → réduit coût déploiement pays
2. **Platform fee live Q2 2026** → revenus automatiques on-chain
3. **SaaS Admin live Q3 2026** → dashboard + monitoring
4. **Appchain pilote Q4 2026** (Maroc) → gas revenues optionnel

| Composant | Status Avril 2026 | Roadmap | An 1 (3 pays) | An 2 (7 pays) | An 3 (12 pays) |
|--|--|--|--|--|--|
| **Licences** | ✅ Maroc | Q2: Senegal, Egypt | 2.5M | 3.0M | 3.5M |
| **Platform fees** | ❌ N'existe pas | Q2 2026 | 0.1M* | 4.5M | 9.0M |
| **SaaS Admin** | ❌ N'existe pas | Q3 2026 | 0M | 0.8M | 2.5M |
| **Support** | ✅ Manual | Incl. SaaS | 0.2M | 0.8M | 1.5M |
| **Modules** | ❌ 0/12 ready | Q3+: reconstruction, tasaluh | 0.2M | 1.5M | 3.0M |
| **Conseil** | ✅ Ad-hoc | Optimisé | 0.5M | 1.0M | 1.5M |
| **TOTAL** | | | **3.5M** | **11.6M** | **21.0M** |
| **Couts** | | | 2.5M | 4.5M | 7.5M |
| **Profit** | | | **1.0M** | **7.1M** | **13.5M** |

*Platform fee Q1 2027 seulement si Maroc l'active post-go-live (juin 2026)

**Hypothèses par ligne :**

- **Licences :** 1 pays (Maroc) à 1.5M déjà payé. An 2: +Sénégal (1.2M), Égypte (1.0M). An 3: +2 pays à 0.5M moyen.
- **Platform fees :** Commence Q1 2027 (après Maroc go-live). Maroc: 50K tx/an à 50K USD = 2.5M/an. Autres pays: Sénégal 1.5M, Égypte 1.5M. Croissance volume +20%/an.
- **SaaS Admin :** Commence Q3 2026 après dashboard live. Tier moyen: 120K USD/pays/an. An 1: 1 pays, An 2: 5 pays, An 3: 10 pays.
- **Modules :** An 1: reconstruction (Maroc) + tasaluh (Égypte). An 2-3: +marketplace, multi-rite. 150-300K par module.
- **Appchain :** Optionnel. Si Maroc adopte Q4 2026: +gas revenue 50-200K USD/an. Pas inclus tableau conservatif ci-dessus.

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

### 5.1 Etat actuel et Roadmap

**STATUT (Avril 2026):** Generateur en development — Roadmap Q2 2026 (cible juillet 2026)

Le generateur est **l'element clé pour passer de la monnaie single-country à multi-country**. Actuellement, l'ajout d'un nouveau pays repose sur un fork manuel du codebase Maroc avec adaptation manuelle des fichiers de configuration.

**État actuel (avril 2026) :**
- Déploiement manuel via `scripts/deploy.js` (hardcodé pour Maroc)
- Temps pour ajouter un pays : **4-6 semaines** (équipe 2-3 devs)
- Risque d'erreur : haut (configuration figée, pas de validation automatique)
- Coût : ~$200K-300K USD (ingénierie custom)
- Exemple Maroc : février-juin 2026 (4 mois) de la découverte au go-live

**Roadmap Q2 2026 :**
```bash
node scripts/generate.js --country=egypt --output=../safeland-egypt
```

Une fois implémenté, le générateur :

1. **Valide** le country.json (tous les champs requis présents, taux fiscaux, écoles héritage)
2. **Copie** le core template (contrats, backend, frontend, tests)
3. **Injecte** les paramètres dans les contrats Solidity :
   - Taux fiscaux dans SafeLandEscrow (DGI, ANCFCC, fees plateformes)
   - École d'héritage et parts dans SafeLandFridda (malékite, hanafite, etc.)
   - Régions et noms champs dans SafeLandNFT et Registry
4. **Active** les modules déclarés (copie contrats + routes backend + pages frontend)
5. **Génère** fichiers depuis templates EJS :
   - deploy.js adapté (contrats, paramètres, proxy init)
   - seed.js avec données d'exemple du pays
   - docker-compose.yml (services localisés)
   - package.json (dépendances)
   - README.md (instructions pays)
6. **Copie** traductions i18n (arabe-locale, français, anglais)
7. **Génère** CDC depuis template (cahier des charges pays)
8. **Valide** et teste le fork généré (compile, tests unitaires)
9. **Produit** un projet 100% autonome, prêt à `npm install && npm test`

**Timeline post-Q2 :**
- Temps pour ajouter un pays : **1-2 semaines** (1-2 devs)
- Risque d'erreur : très bas (validation automatique, tests hérités)
- Coût : ~$50-80K USD (dépendances locales minimales)
- Réduction d'effort : **80% moins de travail manuel**

### 5.2 Proces avant générateur disponible (Avril-Juin 2026)

En attendant le générateur, l'ajout d'un nouveau pays suit ce processus manuel :

```
Etape 1 : Fork manuel du repo Maroc                # 0.5 jour
Etape 2 : Recherche juridique (taux, écoles)       # 3-5 jours
Etape 3 : Adapter contracts/* (fiscalité, héritage) # 5-10 jours
Etape 4 : Adapter backend config/routes             # 3-5 jours
Etape 5 : Localiser frontend (i18n, RTL)            # 3-5 jours
Etape 6 : Tests + validation (compile, UAT)         # 5-10 jours
Etape 7 : Documentation (CDC, B2G)                  # 3-5 jours
```

**Temps total : 4-6 semaines** (équipe 2-3 devs + 1 PM + legal)

### 5.3 Cas d'usage — Sénégal (Roadmap Q3 2026)

Avec le générateur disponible (juillet 2026) :

```
Recherche juridique Sénégal              # 1-2 jours
Créer config/countries/senegal.json      # 1-2 heures (basé sur template)
Créer i18n/ar-SN.json (localisation)     # 2-4 heures
Créer module spécifique si nécessaire     # 4-16 heures (ex. tasaluh)
Exécuter : node scripts/generate.js --country=senegal
Tester : cd safeland-senegal && npm test # 1-2 heures
Adapter CDC + documentation              # 2-4 heures
```

**Temps total avec générateur : 1-3 jours** au lieu de 4-6 semaines en manuel.

---

## 6. Le Platform Fee

### 6.1 Mecanisme cible et Roadmap

**STATUT (Avril 2026):** Platform fee — **EN DEVELOPMENT** — Roadmap Q2 2026

C'est la source de revenue la plus importante du modèle business. Actuellement, le contrat SafeLandEscrow.sol **ne prélève que les frais gouvernementaux** (DGI 4%, ANCFCC 1%, frais timbres). Le mécanisme de "platform fee" pour SafeLand n'existe pas encore dans le code.

**État actuel (avril 2026) :**
- SafeLandEscrow.sol : prélève DGI, ANCFCC, stamp fees uniquement
- Aucune variable `platformFeeBps`, `platformWallet`, ou logique équivalente
- Aucun système de distribution des revenus vers SafeLand Core
- Exemple Maroc: 10 transactions test/jour à 50K USD = revenus 0 USD pour SafeLand

**Roadmap Q2 2026 (target juillet 2026) :**

```solidity
contract SafeLandEscrow {
    uint256 public platformFeeBps;     // 10 = 0.1% (configurable par pays, 0-100 bps)
    address public platformWallet;     // Wallet de ta societe

    function initialize(
        address admin,
        address _nftContract,
        address[] memory _wallets,     // [treasury, cadastre, stamp, platform]
        uint256[] memory _feesBps      // [400, 100, 0, 10] = [DGI 4%, ANCFCC 1%, stamp, platform 0.1%]
    ) public initializer {
        // ... setup
        platformFeeBps = _feesBps[3];
        platformWallet = _wallets[3];
    }

    function notaryComplete(uint256 dealId) external {
        // ... calculs fiscaux existants (DGI, ANCFCC, stamp)
        uint256 taxAmount = (price * dgiFeeBps) / BPS_DENOMINATOR;
        uint256 cadastreAmount = (price * ancfccFeeBps) / BPS_DENOMINATOR;
        uint256 stampAmount = ...;

        // NOUVEAU : Platform fee pour SafeLand
        uint256 platformFee = (price * platformFeeBps) / BPS_DENOMINATOR;

        // Calcul net vendeur (après tous les frais)
        uint256 sellerNet = price - taxAmount - cadastreAmount - stampAmount - platformFee;

        // Distribution des paiements
        _safeTransfer(treasuryWallet, taxAmount);        // Trésor public
        _safeTransfer(cadastreWallet, cadastreAmount);   // Cadastre
        if (stampAmount > 0) _safeTransfer(stampWallet, stampAmount);  // Frais timbres
        _safeTransfer(platformWallet, platformFee);      // ← SafeLand Core
        _safeTransfer(seller, sellerNet);                // Vendeur net
    }
}
```

**Configuration par pays :**
- Maroc : platformFeeBps = 10 (0.1% — exemple : 50 USD sur 50K USD)
- Sénégal : platformFeeBps = 15 (0.15% — plus high-touch)
- Égypte : platformFeeBps = 5 (0.05% — marché très compétitif)
- Le pays peut modifier ou désactiver après uptake (souveraineté)

**Implémentation (Q2 2026) :**
1. Ajouter variables et init params à SafeLandEscrow.sol
2. Modifier logique notaryComplete() pour prélever platformFee
3. Setter admin pour ajuster platformFeeBps post-déploiement
4. Tests complets (calculs gas, edge cases, upgrade UUPS)
5. Documenter dans CDC du pays

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

## 11. Gestion de la Propriete Intellectuelle et Souverainete

**Principe clé :** SafeLand est "Template + Services". Le pays possède le code déployé et toutes les données. SafeLand Core conserve uniquement le template, l'IA, la marque, et les services SaaS.

### 11.1 Architectonie de propriété

```
SafeLand Core (Privé)              SafeLand [Pays] (Propriété du pays)
├── Template (propriétaire)         ├── Code fork (100% du pays)
├── Générateur (propriétaire)       ├── Contrats déployés (pays les contrôle)
├── SaaS Admin (SaaS)               ├── Données on-chaîne (propriété souveraine)
├── IA Anti-Fraude (SaaS API)       ├── Infrastructure (pays héberge)
├── Marque + Trademarks             ├── Teams locales (emplois du pays)
└── Brevets potentiels              └── Droits de modification (illimité)
```

### 11.2 Ce que tu proteges (IP SafeLand Core)

| Élément | Protection Légale | Durée |
|---------|------------------|-------|
| Template générateur source | Trade secret + copyright | Perpétuelle |
| Scripts generate.js et validate-config.js | Trade secret | Perpétuelle |
| Architecture template (design patterns) | Copyright + brevet potentiel (PCT) | 20 ans (brevet) |
| SaaS Admin source code | Copyright | Perpétuelle |
| IA Anti-Fraude (model + algo) | Trade secret | Perpétuelle |
| Marque "SafeLand" | Marque déposée (WIPO + pays locaux) | 10 ans renouvelable |
| Documentation générique (guides, best practices) | Copyright | Perpétuelle |
| Modules source code (non livrés) | Copyright | Perpétuelle |

**Stratégie :** Tout ce qui est "template" ou "SaaS" reste propriétaire. Tout ce qui est déployé au pays est livré.

### 11.3 Ce que tu livres au pays (Licence perpétuelle exclusive)

| Élément | Droits du Pays | Restrictions |
|---------|---------------|--------------|
| **Code fork complet** | Propriété exclusive pour le territoire. Utiliser, modifier, forker indépendamment. Embaucher développeurs pour maintenance/upgrades. | Non-concurrence : pas de revente à un autre pays (sauf accord spécial). Non-redistribution publique sans accord. |
| **Smart contracts déployés** | Le pays contrôle les keys, les addresses, et les upgrades. Peut modifier contracts via admin roles. Peut déployer contrats additionnels. | Responsabilité sécurité : le pays audite ses propres modifications. Respect UUPS interface pour compatibilité futures mises à jour. |
| **Données on-chaîne** | Propriété souveraine du pays, 100%. Données immutables, non réversibles. Le pays peut exporter/migrer vers autre blockchain indépendamment de SafeLand. | Aucune restriction (souveraineté maximale). |
| **Frontend & Backend code** | Licence perpétuelle, utiliser, modifier, forker. Embarquer dans infrastructure du pays. | Non-commercial : réservé à usage gouvernemental. Pas de commercialisation sous autre marque. |
| **Tests & Documentation** | Propriété de SafeLand, mais droit d'utilisation perpetuel pour le pays. | Le pays peut extraire, modifier, distribuer internement. |
| **Modules optionnels achetés** | Propriété exclusive du pays pour son territoire, après achat forfaitaire. Code source fourni. | Droit d'utilisation exclusif au territoire. Non-revente. |
| **Données de configuration (country.json)** | Propriété du pays (données, paramètres). | Le pays peut adapter, modifier, distribuer. |

### 11.4 Ce que tu gardes (Propriétaire, jamais livré)

| Élément | Raison | Business Model |
|---------|--------|----------------|
| **Template privé** | Actif principal pour générer nouveaux pays. Base pour R&D. | Licence à chaque nouveau pays (600K-1.7M USD) |
| **Générateur (generate.js)** | Propriété intellectuelle clé, réduit coût déploiement. | Avantage compétitif, jamais livré. |
| **SaaS Admin Dashboard** | Service hébergé, pas logiciel. Abonnement récurrent. | Revenue 60-300K USD/an par pays. |
| **IA Anti-Fraude (model)** | Modèle propriétaire, coûteux à entraîner. Données d'entraînement confidentielles. | SaaS API (0.1-0.5% revenue par utilisation). |
| **Marque "SafeLand"** | Identité globale, prestige. | Licence d'usage seulement, pas transfert propriété. |
| **Modules source** | Vendus à prix fort (150-300K USD chacun). | Code source fourni après achat, mais restent propriétaire jusqu'à achat. |
| **Archives de code** | Historique git, évolutions, décisions tech. | Restent confidentiels (trade secrets). |

### 11.5 Clauses contractuelles clés (à inclure dans contrats pays)

#### Clause 1 — Propriété et Souveraineté
```
Le pays devient propriétaire exclusif du code fork, des contrats déployés,
et de toutes les données on-chaîne. Le pays peut opérer indépendamment 
de SafeLand Core après le déploiement initial, y compris recrutement 
développeurs locaux pour maintenance.

SafeLand Core conserve propriété du template generateur, de la marque,
et des modules source code non livrés.
```

#### Clause 2 — Non-concurrence territoriale
```
Le pays s'engage à ne pas :
- Revendre, re-louer, ou relicencier le fork à un autre pays sans accord écrit
- Utiliser le code fork pour développer produits concurrents de SafeLand 
  pour d'autres juridictions

Exceptions : Le pays peut modifier/forker pour besoins domestiques illimités.
SafeLand n'est pas exclusif au cadastre (ex : le pays peut ajouter 
registre successions, maritime, etc.)
```

#### Clause 3 — Attribution obligatoire
```
Tout système déployé doit mentionner :
"Powered by SafeLand Technology" en footer/about pages
URL vers safeland.tech (ou équivalent)

Exceptions : Mentions internes/techniques non requises.
```

#### Clause 4 — Maintenance et Support liés au Fee
```
Les services inclus dans le SaaS Admin (monitoring, alertes, hotline support)
sont conditionnés au paiement du platform fee et abonnement SaaS.

Si le pays arrête paiement :
- SaaS Admin se désactive
- Support hotline cesse
- Mais : code local reste du pays, blockchain immutable (inchangé)
```

#### Clause 5 — Upgrades de sécurité critiques
```
SafeLand Core peut proposer upgrades sécurité critiques (audit trouvé bug).
Le pays a 30 jours pour évaluer/tester avant application forcée.
Raison : Bug sécurité affecte écosystème global (si Appchain partagée).

Upgrades non-critiques sont optionnels (le pays choisit quand upgrader).
```

#### Clause 6 — Indépendance technique
```
Le code fork ne dépend d'aucun service SafeLand Core pour opérer.
Même si SafeLand Core disparaît, le pays peut continuer avec:
- Code source complet (git clone)
- TheGraph subgraph hebergé localement (ou via The Graph Studio)
- Smart contracts 100% autonomes (UUPS upgradeable par pays)

Aucun "killswitch" ou dépendance cloud de SafeLand Core.
```

#### Clause 7 — Data Privacy et Conformité
```
Le pays est responsable de conformité RGPD/GDPR/loi locale pour données.
SafeLand ne stocke aucune donnée utilisateur (tout on-chaîne ou chez pays).
Exceptions : Logs anonymes audit (30 jours rétention max), métriques SaaS.
```

#### Clause 8 — Responsabilité sécurité
```
SafeLand est responsable de sécurité code livré (template + modules).
Après déploiement, le pays est responsable :
- Infrastructure sécurité (serveurs, access control)
- Gestion keys/wallets privés
- Modifications locales au code
- Opérations blockchain (node operations)

SafeLand assist via SaaS/support, mais pas responsabilité juridique.
```

### 11.6 Scénarios d'indépendance (hypothèse : pays veut partir)

**Scénario 1 : Pays arrête paiement SaaS**
- ✅ Code local reste opérationnel
- ✅ Blockchain reste immutable, données intactes
- ✅ Pays peut embaucher devs locaux pour maintenance
- ❌ Perd SaaS Admin monitoring, support hotline
- ❌ Perd IA anti-fraude API
- **Coût pour pays d'indépendance :** ~100K USD (1-2 devs, 6 mois setup opérations locales)

**Scénario 2 : Pays fork et deploy compétiteur**
- ✅ Légalement possible dans son territoire (code est livré)
- ❌ Non-concurrence contractuelle l'interdit pour autres pays
- ❌ Perte confiance bailleurs fonds / donateurs
- **Risque pour pays :** Rupture contrats, isolement diplomatique si publicisé

**Scénario 3 : SafeLand Core disparaît**
- ✅ Pays opère indépendamment (code + smart contracts)
- ✅ Blockchain inchangée, TheGraph subgraph migrables
- ❌ Perte mises à jour sécurité (pays peut les faire localement)
- ❌ Perte support (coûteux à reconstruire)
- **Coût pour pays :** ~50-100K USD setup devops local, puis 200-300K USD/an opérations

**Conclusion :** Architecture soigneusement conçue pour zéro vendor lock-in. Pays possède tout ce qui compte (code + données). SafeLand bénéficie d'être indispensable par excellence, pas obligation légale.

---

## 12. Cycle de Vie d'un Projet Pays

**Timeline reference :** Maroc (février 2026 — juin 2026) = 4 mois jusqu'au go-live. Exemple réaliste avec équipe 3 devs + 1 PM + legal.

### Phase 1 — Découverte (2-4 semaines)

**Objectif :** Valider intérêt, problématique juridique, budget disponible, timeline du ministère.

**Activités :**
- Entretiens stakeholders clés : directeur cadastre, direction transformation numérique, ministère justice, banque centrale
- Audit juridique local : lois foncières, écoles d'héritage, fiscalité, régulation blockchain
- Visite infrastructures existantes (cadastre, notaires, tribunaux)
- Validation problem-fit : "À combien revient un titre foncier aujourd'hui ? Combien de temps ?"
- Étude faisabilité technique (complexité intégration, capacité IT local)

**Livrables :**
- Rapport découverte (10-15 pages)
- Proposition de valeur (2-3 pages, impact estimé)
- Lettre d'intention (LOI) — engagement budgétaire initial

**Ressources :** 1 PM + 1 expert juridique (interne) + 1 consultant local (external)
**Coût :** 20-30K USD (consulting, déplacements, hotels)
**Durée :** 2-4 semaines

### Phase 2 — Préparation (4-8 semaines)

**Objectif :** Signer contrat, constituer équipe locale, préparer infrastructure, valider approbations régulatoires.

**Activités :**
- Négociation contrats : terms, SaaS pricing, data ownership, IP clauses
- Legal due diligence : OFAC/sanctions, data privacy (RGPD/GDPR équivalent), audit contrats
- Infrastructure setup : serveurs (AWS/Azure ou on-prem du pays), domaines, CI/CD
- Recrutement/désignation équipe locale : 1-2 devs pays, 1 PM local, experts métier
- Approvals régulatoires : signature ministère digital, cadastre, justice (si requis)
- Formation équipe : Solidity, Node.js, Next.js, processus SafeLand
- Création country.json : taux fiscaux, écoles d'héritage, régions, modules, wallets

**Livrables :**
- Contrat signé + compte de trésorier reçu (30% de licence)
- country.json validé et revisité juridiquement
- Équipe locale formée, accès à repos + infra
- Infrastructure staging opérationnelle
- Architecture technique approuvée par pays

**Ressources :** 1-2 devs (yourcore), 1 PM, 1 juriste, 1 expert terrain local
**Coût :** 80-120K USD (recrutement local, formation, legal, infra setup)
**Durée :** 4-8 semaines

### Phase 3 — Fork et Déploiement Technique (8-12 semaines)

**Objectif :** Générer fork automatisé (ou fork manuel si générateur non disponible), adapter contrats à la loi du pays, déployer sur infrastructure, passer UAT.

**Activités (avec générateur Q2 2026) :**
- Fork depuis générateur : `node scripts/generate.js --country=[pays]` (1-2 jours)
- Adaptation contrats Solidity : vérifier taux fiscaux, écoles héritage, régions, wallets (5-10 jours)
- Build & compile : vérifier aucune erreur (1 jour)
- Tests unitaires : 100% passage (3-5 jours)
- Déploiement staging : deploy contracts via UUPS proxies (2-3 jours)
- Migration données pilote : 500-5000 titres d'exemple sur-chaîne (5-10 jours)
- UAT avec ministère : scénarios transactionnels, succession, justice (10-15 jours)
- Corrections bugs UAT (5-10 jours)
- Audit sécurité externe : CertiK ou équivalent (15-20 jours, parallèle)

**Livrables :**
- Fork complet, autonome, 100% tests passants
- Contrats déployés sur staging (adresses générées, proxies fonctionnels)
- 5000+ titres d'exemple on-chaîne, queryables via TheGraph subgraph
- Rapport UAT signé par ministère
- Rapport audit sécurité (CertiK) — sans bloquants
- Documentation technique (API docs, contract specs)
- CDC (Cahier des Charges) adapté au pays

**Ressources :** 2-3 devs core/local, 1 QA, 1 PM, expert terrain local
**Coût :** 200-350K USD (dépend modules, complexité intégration, audit)
**Durée :** 8-12 semaines (peut être 4-6 semaines avec générateur mature + équipe experientée)

### Phase 4 — Lancement Production (1-2 semaines)

**Objectif :** Migrer données réelles, activer production, assurer 0 incidents critiques, former utilisateurs à grande échelle.

**Activités :**
- Migration données réelles : export cadastre legacy → format NFT SafeLand → déploiement on-chaîne
- Déploiement production : deploy contracts sur réseau production (Appchain pays, ou Polygon/Ethereum)
- Cutover data : activation production, désactivation legacy (ou mode hybride)
- Support 24/7 : équipe tech on-call durant 1-2 semaines
- Formation utilisateurs : agents notaires, registrars, judges (10-20 personnes, 3-5 jours)
- Monitoring go-live : dashboards alertes, logs, metrics
- Incident response : dédié pour bugs/questions utilisateurs

**Livrables :**
- SaaS Admin connecté aux contrats production (monitoring live)
- 100+ utilisateurs actifs jour 1
- 0 incidents critiques dans les 2 premières semaines
- Rapport go-live (nb transactions, performance, incidents)
- Equipe support production formée

**Ressources :** Full team (devs, ops, PM, support) — on-site si possible
**Coût :** 30-50K USD (support intensif, personnel sur site)
**Durée :** 1-2 semaines cutover + 2-4 semaines stabilisation post-launch

### Phase 5 — Opérations et Croissance (6+ mois)

**Objectif :** Atteindre adoption cible, générer revenus récurrents, planifier expansion régionale/nationale.

**Activités :**
- Support technique : bug fixes, questions utilisateurs, hotlines
- Monitoring SaaS : KPIs business (transactions, volumes, revenue fees), uptime
- Déploiement modules : si prévus au contrat (reconstruction, tasaluh, etc.)
- Rollout géographique : expansion du pilote régional à national (si applicable)
- Optimisations : performance, coûts infrastructure, UX améliorations
- Préparation renouvellement contrat SaaS : négociation tiers montée en charge

**Livrables :**
- 100%+ adoption growth (objectif initial atteint)
- Platform fee actif et transparent (0.1% per transaction)
- SaaS Admin reports mensuels (avec metrics bailleurs de fonds)
- 1-2 modules optionnels déployés (si applicable)
- Contrat renouvellement signé pour An 2

**Ressources :** 0.5 FTE PM (part-time), 0.5 FTE backend support, 0.5 FTE ops, 1-2 devs local
**Coût :** 50K USD/an (inclus dans SaaS revenue)
**Durée :** 6-12 mois An 1, puis récurrent

---

**Synthèse Timeline et Budget (exemple Sénégal, Q3 2026) :**

| Phase | Durée | Équipe | Coût |
|-------|-------|--------|------|
| 1. Découverte | 2-4 sem | 1 PM + 1 legal | 20-30K USD |
| 2. Préparation | 4-8 sem | 1 PM + team local | 80-120K USD |
| 3. Fork & Tech (avec générateur) | 4-6 sem | 2-3 devs + QA | 150-250K USD |
| 4. Go-Live | 1-2 sem | Full team on-site | 30-50K USD |
| 5. Operations (An 1) | 6-12 mois | 0.5-2 FTE local | Inclus SaaS |
| **TOTAL** | **4-5 mois** | **~5-8 FTE équivalent** | **280-450K USD** |

**Pour Maroc (sans générateur, février-juin 2026) :** +8-12 semaines phase 3 (fork manuel). Total : 7-8 mois, ~500-700K USD.

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

## 18. Strategie d'Acquisition par Pays

**Objectif :** Identifier, approcher, négocier et déployer SafeLand dans 20+ pays en 3-5 ans. Cette section décrit le playbook d'acquisition et les critères de sélection.

### 18.1 Criteres de Selection des Pays Cibles

**Stabilité politique & gouvernance :**
- Démocraties stables ou régimes stables depuis 10+ ans
- Éviter zones de conflit actif (mais post-conflit OK — modules reconstruction)
- Gouvernement numérique réformatrice (champion politique)
- Pas de sanctions internationales (OFAC check requis)

**Capacité financière :**
- PIB per capita > 1K USD (classe moyenne émergente)
- Gouvernement peut investir 600K-1.7M USD (budget foncier/cadastre/numérique)
- Ou accès à financements donateurs (Banque Mondiale, AFD, USAID, etc.)

**Volonté politique & réforme :**
- Champion ministériel identifié (cadastre, justice, numérique)
- Stratégie numérique nationale (pour justifier investissement)
- Problème foncier reconnu (titres informels, fraudes, successions complexes)
- Timeline réaliste : pas de "c'est bon pour dans 5 ans"

**Complexité juridique :**
- Écoles d'héritage islamiques (malékite, hanafite, chaféite, hanbalite) — bonne fit SafeLand
- Ou systèmes coutumiers africains documentés — modules future
- Pas de systèmes hybrides exotiques (trop cher à adapter)
- Droit foncier écrit et accessible en anglais/français

**Taille marché :**
- Minimum 5M population (volume transactions viables)
- Optimal 20M+ population (scale rapide)
- Secteur immobilier informel > 50% (forte demande digitalisation)

### 18.2 Matrice Pays Cibles (Priorité Roadmap 2026-2027)

| Pays | Stabilité | Financement | Champion | Complexité | Population | Priorité | Target |
|------|-----------|-------------|----------|-----------|-----------|----------|--------|
| **Maroc** | ✅ Stable | ✅ Gov | ✅ ANCFCC | Moyen | 37M | **P0** | ✅ Go-live juin 2026 |
| **Sénégal** | ✅ Stable | ✅ BM | TBD | Moyen | 18M | **P1** | Q3 2026 |
| **Égypte** | ✅ Stable | ✅ Gov/BM | TBD | Moyen | 105M | **P1** | Q3-Q4 2026 |
| **Jordanie** | ✅ Stable | ✅ BM/UE | TBD | Moyen | 10M | **P1** | Q4 2026 |
| **Tunisie** | ✅ Stable | ⚠️ Budget limité | TBD | Moyen | 12M | **P1** | Q4 2026-Q1 2027 |
| **Bénin** | ✅ Stable | ✅ AFD/BM | TBD | Moyen | 13M | **P1** | Q1 2027 |
| **Kenya** | ✅ Stable | ✅ IFC/Gov | TBD | Faible | 54M | **P1** | Q2 2027 |
| **Liban** | ⚠️ Instable | ❌ Crise | TBD | Haut | 5M | **P2** | Q3 2027 (si stabilité) |
| **Syrie** | ❌ Conflit | ✅ UN/UNRWA | TBD | Haut | 18M | **P2** | Post-reconstruction (2027+) |
| **Irak** | ⚠️ Instable | ✅ Gov/BM | TBD | Haut | 43M | **P2** | Q4 2027 (post-stabilité) |
| **Ukraine** | ⚠️ Conflit | ✅ UE/USAID | TBD | Moyen | 38M | **P2** | 2027+ (si paix) |
| **RDC** | ⚠️ Fragile | ✅ BM/UN | TBD | Haut | 99M | **P2** | 2028+ (renforcement) |
| **Nigeria** | ✅ Stable | ✅ Gov | TBD | Haut | 223M | **P2** | 2027-2028 |
| **Rwanda** | ✅ Très stable | ✅ Gov | TBD | Moyen | 14M | **P1** | 2027 |
| **Inde** | ✅ Stable | ✅ Gov | TBD | Très haut | 1.4B | **P3** | 2028+ (phase 2 produit) |

**Légende :** 
- P0 = Référence (en cours)
- P1 = Haute priorité (18-24 mois)
- P2 = Moyen terme (24-36 mois)
- P3 = Long terme / exploration

### 18.3 Playbook d'Acquisition (6 mois par pays)

**MOIS 1-2 : DÉCOUVRIR & PITCHER**

Objectif : Valider fit, identifier champion, obtenir réunion C-level.

Actions :
1. Recherche desk : legal landscape, cadastre situation, digital strategy gouvernement
2. Identification contacts : via embassy, donateurs (BM, AFD), telecoms, ONG locales
3. Outreach : email + call au directeur cadastre / CIO gouvernement
4. Pitch 2 pages : "SafeLand solves your problem : X% titres informels → blockchain 6 mois"
5. Appel découverte (30-45 min) : valider urgence, budget, timeline
6. Visite sur place (1 semaine) si fit confirmé : rencontres ministère, notaires, banks

KPI : LOI (Letter of Intent) engageant budget discussion

**MOIS 3 : NÉGOCIER & COMMIT**

Objectif : Contrat signé, 30% acompte reçu.

Actions :
1. Formule offre commerciale : modules requis, timeline, SaaS pricing
2. Négociation : termes data, IP, platform fee %, durée contrat, options renouvellement
3. Legal review : contrat par avocat local + international, OFAC check
4. Partenaires locaux : si nécessaire (intégrateur, telco, ministry IT vendor) pour crédibilité
5. Signature : contrat bilangue + acompte 30% versé

KPI : Contrat signé, 200-300K USD (30%) reçu

**MOIS 4-5 : MOBILISER**

Objectif : Équipe locale formée, country.json validé, infra ready.

Actions :
1. Recruitment / désignation équipe locale : 1-2 devs, 1 PM, experts métier
2. Infrastructure : AWS/Azure/on-prem setup, VPN, CI/CD, repos Git
3. Legal research : audit droit foncier, succession, fiscalité, blockchain compliance
4. Country.json draft : taux, écoles, régions, modules décidés, wallets
5. Formation équipe : Solidity, Node.js, Next.js workshops (1-2 semaines)
6. Regulatory approvals : signature ministère digital sur technical roadmap

KPI : Country.json validé, équipe formée, infra opérationnelle

**MOIS 6 : FORK & PILOTE RAPIDE**

Objectif : Fork généré/adapté, 500 titres d'exemple on-chaîne, UAT ministère passé.

Actions :
1. Si générateur disponible (Q2 2026+) : `node scripts/generate.js --country=[pays]` (2-3 jours)
2. Sinon (avant Q2) : fork manuel de Maroc, adaptation manuelle (2-4 semaines)
3. Adaptation modules : vérification taux, écoles, régions
4. Tests + compile : 100% verts
5. Migration données : 500-1000 titres d'exemple on-chaîne (testnet ou staging)
6. UAT avec ministère : 5-10 scénarios réels (vente, succession, actions justice)
7. Audit sécurité externe : lancé en parallèle (CertiK, Trail of Bits)

KPI : Fork 100% testé, UAT signé, audit sécurité rapporté

### 18.4 Qui Approche Quoi ?

**Votre équipe (SafeLand Core) :**
- Maroc (référence) : vous + équipe local complète
- Sénégal (prise après générateur) : PM + 1 dev yourcore + équipe local
- Égypte (stratégique, gros marché) : PM + CTO + équipe local
- Autres P1 : PM + dev généraliste

**Partenaires locaux / Intégrateurs :**
- Pays 4+ : consultants locaux prennent lead acquisition + coordination
- Vous apportez : template, générateur, expertise contrats, audit
- Partenaire apporte : crédibilité locale, connexions ministériel, équipe local
- Modèle : partenaire reçoit 10-15% revenue année 1 pour acquisition

**Donateurs / Institutions :**
- Vous : contactez BM, AFD, USAID avant partenaire local
- Pitch : "blockchain cadastre = impact foncier + financement numerique"
- Donateurs apportent : 50-80% budget pais, crédit gouvernement
- Vous apportez : technologie, déploiement rapide

### 18.5 Budget Acquisition par Pays

| Activité | Coût | Timing |
|----------|------|--------|
| Découverte (desk + visite 1 sem) | 15-25K USD | Mois 1-2 |
| Négociation + legal (avocat local) | 15-20K USD | Mois 3 |
| PM temps (4-6 mois) | 30-50K USD | Mois 1-6 |
| Formation équipe local (2-3 sem) | 10-15K USD | Mois 4 |
| Infrastructure setup (1-3 mois) | 5-10K USD | Mois 4-6 |
| Consultant local (audit foncier, etc.) | 20-30K USD | Mois 2-5 |
| **Total acquisition (sans développement)** | **95-150K USD** | **6 mois** |

**Note :** Coût développement (fork, UAT, modules) est facturé dans licence initiale 600K-1.7M. Acquisition cost 95-150K est opex.

### 18.6 Timeline Acquisition (12-24 mois pour 5 pays)

```
2026 Q2  : Maroc go-live (référence) ✅
2026 Q3  : Sénégal + Égypte pitch/découverte
2026 Q4  : Sénégal + Égypte contrats signés, fork lancé
2027 Q1  : Sénégal + Égypte go-live
2027 Q2  : Jordanie + Tunisie + Bénin en découverte
2027 Q3  : Jordanie + Tunisie contrats, Bénin en pitch
2027 Q4  : Jordanie + Tunisie + Bénin go-live (si on schedule)
2027 Q1+ : Kenya + Rwanda + Nigeria en parallèle
```

**Hypothèse :** 3 pays en parallèle max (ressources contraintes). Avec générateur Q2, timeline accélère.

---

## 19. Annexes

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
