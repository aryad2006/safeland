# LIVRE BLANC — SafeLand Morocco
## Le Cadastre Blockchain Souverain du Royaume du Maroc

**Version 2.0 — Mars 2026**
**Editeur : TachyDigital SARL**

---

## Table des Matieres

1. [Resume Executif](#1-resume-executif)
2. [Le Probleme](#2-le-probleme)
3. [La Solution SafeLand](#3-la-solution-safeland)
4. [Architecture Technique](#4-architecture-technique)
5. [Smart Contracts — 6 Modules](#5-smart-contracts--6-modules)
6. [Securite & Conformite](#6-securite--conformite)
7. [Modele Economique B2G](#7-modele-economique-b2g)
8. [Feuille de Route](#8-feuille-de-route)
9. [Equipe & Gouvernance](#9-equipe--gouvernance)
10. [Analyse Comparative](#10-analyse-comparative)
11. [Annexes Techniques](#11-annexes-techniques)

---

## 1. Resume Executif

**SafeLand** est une infrastructure blockchain souveraine qui transforme chaque titre foncier marocain en un **NFT ERC-721 infalsifiable**. En operant en modele B2G (Business to Government), SafeLand fournit a l'Etat marocain un registre foncier numerique immutable, transparent et automatise.

### Chiffres Cles

| Indicateur | Valeur |
|-----------|--------|
| Titres fonciers au Maroc | ~5 millions |
| Litiges fonciers annuels | ~68 000 dossiers |
| Fraudes detectees | ~12% des transactions |
| Perte economique estimee | > 15 milliards MAD/an |
| Temps moyen transaction actuelle | 3-6 mois |
| Temps cible avec SafeLand | < 30 secondes (on-chain) |
| Taux recouvrement fiscal cible | 100% (at-the-source) |
| Smart contracts deployes | 6 (UUPS upgradeable) |
| Tests automatises | 373 (206 contracts + 167 backend) |

### Proposition de Valeur

1. **Immuabilite** — Chaque titre foncier est un NFT inviolable sur blockchain
2. **Automatisation** — Escrow atomique, succession fractionnee, gel judiciaire
3. **Transparence** — Historique complet, audit trail, repartition fiscale automatique
4. **Souverainete** — Conforme aux lois marocaines, donnees sous controle regalien

---

## 2. Le Probleme

### 2.1 Etat des Lieux

Le systeme foncier marocain, gere principalement par l'ANCFCC, repose sur des registres papier vulnerables a la falsification, la perte et la corruption. Les consequences sont systemiques :

**Fraude documentaire** : Falsification de titres, double vente, usurpation d'identite. Environ 12% des transactions fonciers presentent des anomalies detectables.

**Lenteur administrative** : Une transaction immobiliere complete necessite 3 a 6 mois de traitement, impliquant de multiples allers-retours entre notaire, conservateur et administration fiscale.

**Spoliation des MRE** : Les 5 millions de Marocains Residant a l'Etranger sont particulierement vulnerables. Eloignes physiquement de leurs biens, ils sont victimes privilegiees de transactions frauduleuses operees en leur absence.

**Successions bloquees (Fridda)** : Des milliers de biens restent en indivision, paralyses par le manque de consensus entre heritiers ou la complexite du calcul successoral islamique.

**Cout economique** : Les litiges fonciers representent environ 30% des affaires civiles au Maroc, avec un cout moyen de 120 000 a 500 000 MAD par dossier et des delais de resolution de 3 a 7 ans.

### 2.2 Limites des Solutions Existantes

Les tentatives de digitalisation (portail ANCFCC en ligne, e-titres) restent :
- **Centralisees** : Une seule base de donnees = un seul point de defaillance
- **Modifiables** : Les administrateurs peuvent alterer les enregistrements
- **Non transparentes** : Pas d'audit trail immutable
- **Non automatisees** : Les processus metier restent manuels

### 2.3 Pourquoi la Blockchain ?

| Propriete | Benefice Foncier |
|-----------|-----------------|
| Immuabilite | Impossible de falsifier un titre une fois enregistre |
| Tracabilite | Chaque mutation est horodatee et liee a son auteur |
| Automatisation | Smart contracts executent les regles metier sans intermediaire |
| Decentralisation | Pas de point unique de defaillance |
| Cryptographie | Signature numerique = preuve d'identite irrefutable |

---

## 3. La Solution SafeLand

### 3.1 Vision

**1 Titre Foncier = 1 NFT ERC-721**

Chaque titre foncier ANCFCC est represente par un token non-fongible unique sur blockchain. Ce NFT contient toutes les donnees critiques du bien (titre, surface, GPS, charges, historique) et suit les regles du droit marocain via des smart contracts.

### 3.2 Les 6 Modules

```
┌─────────────────────────────────────────────────────────┐
│                    SAFELAND PLATFORM                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  SafeLandNFT │  │  SafeLand    │  │  SafeLand    │   │
│  │  ERC-721     │  │  Registry    │  │  Escrow      │   │
│  │              │  │              │  │              │   │
│  │ Titres       │  │ Index        │  │ Sequestre    │   │
│  │ fonciers     │  │ centralise   │  │ atomique     │   │
│  │ + charges    │  │ + stats      │  │ + fiscalite  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  SafeLand    │  │  SafeLand    │  │  SafeLand    │   │
│  │  Fridda      │  │  Justice     │  │  Timelock    │   │
│  │  ERC-1155    │  │              │  │              │   │
│  │ Succession   │  │ Multi-sig    │  │ Operations   │   │
│  │ 24 parts     │  │ judiciaire   │  │ differees    │   │
│  │ + vote       │  │ gel/remint   │  │ 1-30 jours   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Principes Fondateurs

1. **On-chain first** — Donnees critiques sur blockchain, documents sur IPFS
2. **Compliance-as-Code** — Regles du droit marocain codees dans les smart contracts
3. **RBAC granulaire** — 9 roles distincts avec permissions hierarchiques
4. **Upgradeable** — Pattern UUPS permet l'evolution sans migration
5. **Fiscalite automatique** — Prelevement at-the-source, taux recouvrement 100%

---

## 4. Architecture Technique

### 4.1 Stack Technologique

| Couche | Technologie | Justification |
|--------|------------|---------------|
| Smart Contracts | Solidity 0.8.24 + OZ 5.x | Standard industrie, protection overflow native |
| Proxy Pattern | UUPS (EIP-1822) | Upgrade sans migration, cout gas reduit |
| Blockchain cible | Polygon PoS | Gas faible (~0.01 USD), finalite 2 sec |
| Backend | Express.js 4.18 + ethers.js v6 | Ecosysteme Node.js mature, signer server-side |
| Frontend | Next.js 14 (App Router) | SSR/SSG, performance, SEO |
| Wallet | MetaMask (BrowserProvider) | Standard de facto, 30M+ utilisateurs |
| Stockage | IPFS (Pinata) + SQLite WAL | Documents decentralises + cache local |
| Indexation | TheGraph | Requetes complexes sans lecture on-chain |
| CI/CD | GitHub Actions (7 jobs) | Automatisation complete du pipeline |

### 4.2 Flux de Donnees

```
Utilisateur → MetaMask → Frontend (Next.js)
                              │
                    ┌─────────┴─────────┐
                    │                    │
              REST API             Direct Web3
              (Backend)            (ethers.js)
                    │                    │
              ┌─────┴─────┐              │
              │           │              │
           SQLite     Blockchain ←───────┘
           (cache)    (verite)
              │           │
              │      TheGraph
              │      (indexation)
              │           │
           Pinata
           (IPFS docs)
```

### 4.3 Securite Multi-Couche

**Couche 1 — Peripherie** : HTTPS, CORS restreint, Helmet, Rate Limiting
**Couche 2 — Authentification** : JWT + signature MetaMask (nonce challenge)
**Couche 3 — Autorisation** : RBAC on-chain (AccessControl) + off-chain (requireRole)
**Couche 4 — Smart Contracts** : ReentrancyGuard, Pausable, UUPS protege
**Couche 5 — Donnees** : PII jamais on-chain, hashes de documents, IPFS chiffre

---

## 5. Smart Contracts — 6 Modules

### 5.1 SafeLandNFT — Le Titre Foncier Numerique

Chaque NFT represente un titre foncier unique avec :
- **Donnees fonciers** : N° titre, surface, GPS, type, ville, quartier
- **Charges** : Hypotheques, saisies, servitudes (auto-lock/unlock)
- **Historique** : Registre complet des mutations (TransactionRecord[])
- **Travel Lock** : Verrouillage par le proprietaire (protection MRE)
- **Panic Button** : Pause d'urgence par l'administrateur

**5 roles** : ADMIN, AGENT (ANCFCC), NOTARY, JUSTICE, UPGRADER

### 5.2 SafeLandEscrow — Le Sequestre Atomique

Transaction immobiliere en 4 etapes :

| Etape | Acteur | Action | Etat |
|-------|--------|--------|------|
| 1 | Notaire | Cree le deal | Created |
| 2 | Vendeur | Signe | SellerSigned |
| 3 | Acheteur | Depose les fonds | BuyerFunded |
| 4 | Notaire | Finalise | Completed |

A la finalisation, le smart contract execute automatiquement :
- **4% → DGI** (droits d'enregistrement)
- **1% → ANCFCC** (frais de conservation)
- **95% → Vendeur** (solde net)
- **NFT → Acheteur** (transfert de propriete)

### 5.3 SafeLandFridda — La Succession Intelligente

Le module Fridda (Fractionnee, Intelligente, Distribuee, Decentralisee, Automatisee) resout le probleme des successions bloquees :

1. **Fractionnement en 24 parts** : Conforme aux fractions du droit successoral islamique (1/2, 1/3, 1/4, 1/6, 1/8, 1/12, 1/24)
2. **Tokens ERC-1155** : Chaque heritier recoit des tokens representant ses parts
3. **Gouvernance** : Propositions (vente, location, renovation) + vote pondere
4. **Quorum configurable** : Majorite simple, 2/3, unanimite

### 5.4 SafeLandJustice — L'Intervention Judiciaire

Trois mecanismes de protection :

**Gel (Freeze)** : Un juge gele un titre en cours de litige. Aucune operation possible jusqu'a la levee du gel.

**Burn & Remint** : En cas de fraude averee, le titre frauduleux est detruit et reemis au proprietaire legitime. Preuve on-chain immutable.

**Social Recovery** : Recuperation de wallet en cas de perte ou vol de cles cryptographiques, initiee par un conservateur et executee par un juge.

Toutes les actions judiciaires suivent un protocole **multi-signature M-of-N** (seuil configurable, defaut 2 juges).

### 5.5 SafeLandTimelock — Le Garde-Fou Temporel

Les operations administratives critiques (upgrade de contrat, changement de roles) sont soumises a un delai obligatoire de 1 a 30 jours avant execution. Cela permet :
- Transparence : Toute operation est visible avant son execution
- Verification : Les parties prenantes peuvent verifier et contester
- Annulation : Un CANCELLER peut bloquer une operation suspecte

### 5.6 SafeLandRegistry — L'Index Central

Registre de recherche par ville, proprietaire et type de bien. Maintient les statistiques globales : nombre de proprietes, transactions, charges, fraudes prevenues, interventions judiciaires.

---

## 6. Securite & Conformite

### 6.1 Securite Smart Contracts

| Protection | Implementation | Raison |
|-----------|---------------|--------|
| UUPS Proxy | OpenZeppelin v5 | Upgrade sans migration |
| AccessControl | Roles granulaires | Pas d'admin unique |
| ReentrancyGuard | Fonctions critiques | Anti-reentrance |
| Pausable | Arret d'urgence | Panic Button |
| CEI Pattern | Checks-Effects-Interactions | Previent manipulation |
| Solidity 0.8.24 | Protection native | Overflow impossible |

### 6.2 Audit de Securite

**Audit interne realise** (Slither v0.11.5) : 26 findings, 4 corriges (2 High reentrancy, 2 Medium zero-check), 22 acceptes ou faux positifs.

**Audit technique approfondi** (mars 2026) : 12 problemes critiques identifies, plan de remediation en cours. Voir rapport AUDIT-TECHNIQUE-COMPLET.md.

**Audit externe prevu** : CertiK ou Trail of Bits avant deploiement mainnet.

### 6.3 Conformite Juridique Marocaine

| Loi | Application SafeLand |
|-----|---------------------|
| Dahir 1913 | NFT = extension numerique du titre physique |
| Loi 14-07 (ANCFCC) | Integration directe registre |
| Loi 39-08 | Equivalence titre numerique / physique |
| Loi 43-20 | Signature MetaMask = signature electronique qualifiee |
| Loi 09-08 (CNDP) | PII jamais on-chain, chiffrement AES-256 |
| Loi 53-05 | Horodatage blockchain comme preuve |
| Moudawana | Fridda — fractions successorales conformes |

### 6.4 Protection des Donnees

- **Principe de minimisation** : Seules les donnees strictement necessaires sont on-chain
- **Hachage** : CIN et noms sont haches (SHA-256), jamais en clair
- **IPFS chiffre** : Documents sensibles chiffres AES-256 avant upload
- **Droit a l'oubli** : Compatible car seuls les hashes sont on-chain

---

## 7. Modele Economique B2G

### 7.1 Sources de Revenus

| Source | Mecanisme | Projection An 1 |
|--------|-----------|------------------|
| Licence SaaS annuelle | Acces plateforme par institution | 2 000 000 MAD |
| Frais de tokenisation | 50-500 MAD par titre | Variable |
| Commission transactions | 0.5% du prix de vente | Variable |
| Formation agents | 2 000 MAD / agent | 240 000 MAD |
| Support & maintenance | Forfait annuel | 500 000 MAD |
| Premium MRE (Watchtower) | Abonnement surveillance | Variable |
| API B2B (banques) | Acces scoring/hypotheques | Variable |

### 7.2 Projection Financiere

| | Annee 1 | Annee 2 | Annee 3 |
|---|---------|---------|---------|
| **Revenus** | 2,84 M MAD | 6,0 M MAD | 10+ M MAD |
| **Couts** | 4,87 M MAD | 2,5 M MAD | 3,0 M MAD |
| **Resultat** | -2,03 M MAD | +3,5 M MAD | +7,0 M MAD |
| **NFT crees** | 10 000 | 50 000 | 200 000 |
| **Agents formes** | 120 | 500 | 1 000+ |

**ROI cumule positif des l'annee 2.**

### 7.3 Avantage Fiscal At-the-Source

Le smart contract d'Escrow agit comme agent de retenue automatique :
- 4% DGI preleves a la source
- 1% ANCFCC preleves a la source
- Transfert NFT conditionne au paiement
- **Taux de recouvrement : 100%** (vs estimation actuelle < 80%)

---

## 8. Feuille de Route

| Phase | Periode | Livrables | Statut |
|-------|---------|-----------|--------|
| **Phase 0 — Fondation** | T1 2025 | Smart contracts, tests, architecture | FAIT |
| **Phase 1 — MVP** | T2-T4 2025 | Backend, frontend, Docker, CI/CD | FAIT |
| **Phase 2 — Stabilisation** | T1 2026 | 373 tests, WebSocket, i18n, Timelock | FAIT |
| **Phase 3 — Correction** | T1-T2 2026 | Fix des 12 critiques, audit | EN COURS |
| **Phase 4 — Testnet** | T2 2026 | Deploy Sepolia, TheGraph | PLANIFIE |
| **Phase 5 — Audit Externe** | T3 2026 | CertiK/Trail of Bits | PLANIFIE |
| **Phase 6 — Pilote** | T4 2026 | 3 conservations, 1 000 titres | PLANIFIE |
| **Phase 7 — Regional** | 2027 | 12 conservations, 10 000 titres | PLANIFIE |
| **Phase 8 — National** | 2027-2028 | 75 conservations, 100K+ titres | VISION |
| **Phase 9 — Expansion** | 2028+ | Afrique francophone | VISION |

---

## 9. Equipe & Gouvernance

### 9.1 Structure de Gouvernance

- **Comite Technique** : Architecture, smart contracts, securite
- **Comite Juridique** : Conformite, liaison ANCFCC/DGI, Moudawana
- **Comite Strategique** : Vision, partenariats, expansion
- **Comite Ethique** : Protection citoyens, transparence

### 9.2 Partenaires Institutionnels Vises

- ANCFCC (Conservation Fonciere)
- ADD (Agence de Developpement du Digital)
- Ordre des Notaires du Maroc
- Ministere de la Justice
- CNDP (Commission Nationale de Protection des Donnees)
- DGSSI (Securite des Systemes d'Information)
- Bank Al-Maghrib

---

## 10. Analyse Comparative

### SafeLand vs. Solutions Existantes

| Critere | Cadastre Papier | e-Cadastre (ANCFCC) | SafeLand |
|---------|----------------|---------------------|----------|
| Immuabilite | Non | Non | Oui (blockchain) |
| Anti-fraude | Faible | Moyen | Fort (crypto) |
| Tracabilite | Partielle | Base de donnees | Complete (on-chain) |
| Automatisation | Non | Partielle | Totale (smart contracts) |
| Fiscalite auto | Non | Non | 100% at-the-source |
| Succession | Bloquee | Non geree | Fridda (24 parts) |
| Protection MRE | Non | Non | Travel Lock + Watchtower |
| Justice | 3-7 ans | Non integre | Multi-sig instantane |
| Temps transfert | 3-6 mois | Semaines | < 30 secondes |
| Audit trail | Non | Partiel | Immutable |

### SafeLand vs. Projets Blockchain Fonciers Internationaux

| Projet | Pays | Difference SafeLand |
|--------|------|---------------------|
| Medici Land (Propy) | USA | Pas de module succession |
| Bitland | Ghana | Pas de multi-sig judiciaire |
| Chromaway | Suede | Pas de fiscalite at-the-source |
| BenBen | Ghana | Pas d'ERC-1155 pour succession |
| **SafeLand** | **Maroc** | **6 modules integres, Fridda unique, fiscalite auto** |

---

## 11. Annexes Techniques

### A. Contrats Deployes (Hardhat localhost)

| Contrat | Proxy |
|---------|-------|
| SafeLandNFT | ERC-721 + UUPS |
| SafeLandRegistry | UUPS |
| SafeLandEscrow | UUPS + ReentrancyGuard |
| SafeLandFridda | ERC-1155 + UUPS |
| SafeLandJustice | UUPS + ReentrancyGuard |
| SafeLandTimelock | UUPS + ReentrancyGuard |

### B. Roles et Permissions

| Role | NFT | Registry | Escrow | Fridda | Justice | Timelock |
|------|-----|----------|--------|--------|---------|----------|
| ADMIN | Pause, Upgrade | - | Pause | - | - | - |
| AGENT | Create, Transfer, Encumbrance | Register, Record | - | - | - | - |
| NOTARY | - | - | Create, Complete | Open, Distribute, Finalize | - | - |
| JUSTICE | Freeze, Override | - | - | - | Propose, Sign, Execute | - |
| UPGRADER | - | - | - | - | - | - |
| PROPOSER | - | - | - | - | - | Schedule |
| EXECUTOR | - | - | - | - | - | Execute |
| CANCELLER | - | - | - | - | - | Cancel |

### C. Glossaire

| Terme | Definition |
|-------|-----------|
| NFT | Non-Fungible Token — jeton numerique unique |
| ERC-721 | Standard Ethereum pour tokens non-fongibles |
| ERC-1155 | Standard multi-token (parts successorales Fridda) |
| UUPS | Universal Upgradeable Proxy Standard |
| RBAC | Role-Based Access Control |
| B2G | Business to Government |
| ANCFCC | Agence Nationale de la Conservation Fonciere |
| DGI | Direction Generale des Impots |
| MRE | Marocains Residant a l'Etranger |
| Fridda | Module succession (Fractionnee, Intelligente, Distribuee, Decentralisee, Automatisee) |
| Escrow | Sequestre — fonds bloques jusqu'a validation |
| Travel Lock | Verrou anti-fraude pour proprietaires absents |
| Moudawana | Code de la Famille marocain |
| Melk | Terres non immatriculees (regime coutumier) |
| Soulaliyates | Terres collectives ethniques |

---

**TachyDigital SARL — Tous droits reserves**
*Document confidentiel — Usage interne, investisseurs et institutions uniquement*
