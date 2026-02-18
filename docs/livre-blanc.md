# LIVRE BLANC — SafeLand
## Plateforme NFT de Sécurisation Foncière au Maroc

**Version 1.0 — Février 2026**

---

## Table des Matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Le Problème](#2-le-problème)
3. [La Solution SafeLand](#3-la-solution-safeland)
4. [Architecture Technique](#4-architecture-technique)
5. [Smart Contracts](#5-smart-contracts)
6. [Modules Fonctionnels](#6-modules-fonctionnels)
7. [Sécurité & Conformité](#7-sécurité--conformité)
8. [Modèle Économique B2G](#8-modèle-économique-b2g)
9. [Feuille de Route](#9-feuille-de-route)
10. [Équipe & Gouvernance](#10-équipe--gouvernance)
11. [Annexes Techniques](#11-annexes-techniques)

---

## 1. Résumé Exécutif

**SafeLand** est une plateforme blockchain qui tokenise les titres fonciers marocains en NFT (ERC-721) pour éliminer la fraude immobilière, automatiser les transactions et moderniser l'administration foncière.

### Chiffres clés

| Indicateur | Valeur |
|-----------|--------|
| Titres fonciers au Maroc | ~5 millions |
| Fraudes foncières annuelles estimées | 12 000+ cas |
| Temps moyen d'une transaction actuelle | 3-6 mois |
| Temps cible avec SafeLand | < 10 secondes (on-chain) |
| Budget Phase 1 (12 mois) | 4,87 M MAD (~487 K EUR) |
| ROI positif estimé | Année 2 |

### Proposition de valeur

1. **Immuabilité** — Chaque titre foncier est un NFT inviolable sur blockchain
2. **Automatisation** — Escrow atomique, succession fractionnée, gel judiciaire
3. **Transparence** — Historique complet, audit trail, répartition fiscale automatique
4. **Souveraineté** — Conforme aux lois marocaines 39-08, 43-20 et 09-08

---

## 2. Le Problème

### 2.1 État des lieux du foncier marocain

Le secteur foncier au Maroc repose sur un système largement papier, géré principalement par l'ANCFCC (Agence Nationale de la Conservation Foncière, du Cadastre et de la Cartographie). Ce système présente des vulnérabilités critiques :

- **Fraude documentaire** — Falsification de titres, double vente, usurpation d'identité
- **Lenteur administrative** — Transactions nécessitant 3 à 6 mois de traitement
- **Opacité** — Absence de traçabilité des mutations, charges et servitudes
- **Coût élevé** — Multiples intermédiaires, frais de vérification, déplacements physiques
- **Spoliation des MRE** — Les Marocains résidant à l'étranger sont particulièrement vulnérables

### 2.2 Impact économique

- Perte de confiance des investisseurs nationaux et internationaux
- Litiges fonciers représentant ~30% des affaires civiles au Maroc
- Freins à la bancarisation (hypothèques contestées)
- Coût social : familles dépossédées, successions bloquées

### 2.3 Limites des solutions existantes

Les tentatives de digitalisation (portail ANCFCC en ligne, e-titres) restent centralisées et vulnérables aux mêmes vecteurs de fraude (modification des bases de données, absence de preuve d'intégrité, pas d'automatisation des processus).

---

## 3. La Solution SafeLand

### 3.1 Vision

Transformer chaque titre foncier marocain en un **NFT ERC-721** sur blockchain, créant un registre foncier numérique immuable, transparent et automatisé.

### 3.2 Principes fondateurs

1. **1 Titre = 1 NFT** — Correspondance bijective entre le titre ANCFCC et le token blockchain
2. **On-chain first** — Toutes les données critiques sont enregistrées on-chain (propriétaire, charges, historique)
3. **Automatisation par Smart Contracts** — Les règles métier sont codées et exécutées automatiquement
4. **Accès contrôlé (RBAC)** — 6 rôles distincts avec permissions granulaires
5. **Conformité juridique** — Alignement avec le cadre légal marocain existant

### 3.3 Modèle B2G

SafeLand opère en **Business to Government** : la plateforme est fournie à l'État marocain (ANCFCC, Ministère de la Justice) comme infrastructure de modernisation foncière, avec un modèle de licence + frais par transaction.

---

## 4. Architecture Technique

### 4.1 Stack technologique

| Couche | Technologie | Version |
|--------|------------|---------|
| Smart Contracts | Solidity | ^0.8.24 |
| Framework blockchain | Hardhat | 2.22+ |
| Bibliothèques | OpenZeppelin Upgradeable | v5 |
| Proxy Pattern | UUPS (Universal Upgradeable Proxy Standard) | — |
| Backend | Express.js + ethers.js | v4.18 / v6 |
| Frontend | Next.js (App Router) + Tailwind CSS | v14 / v3 |
| Stockage décentralisé | IPFS via Pinata | — |
| Containerisation | Docker + docker-compose | — |
| CI/CD | GitHub Actions | — |
| Réseau cible | Polygon PoS (Layer 2) | — |

### 4.2 Architecture globale

```
┌──────────────────────────────────┐
│  UTILISATEURS                    │
│  Agents · Notaires · Juges       │
│  Propriétaires                   │
└──────────┬───────────────────────┘
           │
┌──────────▼───────────────────────┐
│  FRONTEND — Next.js 14           │
│  Tailwind · ethers.js · MetaMask │
│  Pages: Dashboard, Properties,   │
│  Escrow, Fridda, Stats           │
└──────────┬───────────────────────┘
           │
┌──────────▼───────────────────────┐
│  BACKEND — Express.js            │
│  JWT · Swagger · Rate Limit      │
│  Routes: auth, properties,       │
│  escrow, fridda, ipfs            │
└──────────┬───────────────────────┘
           │
     ┌─────┴──────┐
     │            │
┌────▼────┐ ┌────▼─────────────────┐
│  IPFS   │ │ BLOCKCHAIN           │
│ Pinata  │ │ 5 Smart Contracts    │
│         │ │ (UUPS Proxies)       │
└─────────┘ └──────────────────────┘
```

### 4.3 Sécurité en couches

| Niveau | Mécanismes |
|--------|-----------|
| Périphérie | CORS, Helmet, Rate Limiting, TLS |
| Application | JWT (30 min), signature MetaMask, RBAC |
| Smart Contracts | AccessControl, Pausable, ReentrancyGuard, UUPS |
| Données | Documents chiffrés AES-256, PII jamais on-chain, IPFS pinning |

---

## 5. Smart Contracts

SafeLand repose sur **5 smart contracts** déployés via UUPS Proxy, tous compilés avec Solidity ^0.8.24 et OpenZeppelin v5.

### 5.1 SafeLandNFT.sol — Titre Foncier (~427 lignes)

Le contrat principal. Chaque NFT représente un titre foncier unique.

**Fonctionnalités clés :**
- **Création** (`createProperty`) — Mint par agent ANCFCC, stockage des données foncières on-chain
- **Transfert** (`transferProperty`) — Avec vérification des verrous et historique complet
- **Charges** (`addEncumbrance` / `removeEncumbrance`) — Hypothèques, servitudes, saisies avec auto-lock/unlock
- **Travel Lock** — Verrouillage par le propriétaire (protection MRE)
- **Panic Button** — Pause globale par admin
- **Justice Override** — Gel et burn/remint par ordre judiciaire

**5 rôles :** ADMIN, AGENT, NOTARY, JUSTICE, UPGRADER

### 5.2 SafeLandEscrow.sol — Séquestre (~252 lignes)

Transaction immobilière atomique en 4 étapes avec répartition fiscale automatique.

```
Notaire crée → Vendeur signe → Acheteur dépose → Notaire finalise
                                                   ↓
                                           4% → DGI
                                           1% → ANCFCC
                                          95% → Vendeur
```

Protection : annulation possible avant finalisation, remboursement automatique de l'acheteur.

### 5.3 SafeLandFridda.sol — Succession ERC-1155 (~291 lignes)

Moteur de succession fractionnée en **24 parts** (tokens ERC-1155).

- Ouverture de dossier par agent
- Distribution des parts entre héritiers par notaire
- Gouvernance : propositions + vote pondéré (majorité > 12/24)
- Types de propositions : SELL, SPLIT, CUSTOM

### 5.4 SafeLandJustice.sol — Multi-sig Judiciaire (~227 lignes)

Interventions judiciaires avec quorum multi-signatures (seuil configurable, défaut = 2).

- **FREEZE** — Gel d'un titre en cours de litige
- **OVERRIDE** — Burn & remint vers le propriétaire légitime
- **SOCIAL_RECOVERY** — Récupération de wallet en cas de perte

### 5.5 SafeLandRegistry.sol — Index Central (~120 lignes)

Registre de recherche par ville et par propriétaire + compteurs globaux (GlobalStats).

### 5.6 Tests & Déploiement

- **30/30 tests passants** (Hardhat + Chai + ethers.js v6)
- **Gas Report** automatique via hardhat-gas-reporter
- **Déploiement UUPS** : script `deploy.js` configure les 5 contrats + rôles croisés

---

## 6. Modules Fonctionnels

### 6.1 Gestion des Titres Fonciers

| Action | Acteur | Smart Contract | Détail |
|--------|--------|---------------|--------|
| Créer un NFT | Agent ANCFCC | SafeLandNFT | Mint + IPFS + PropertyData |
| Transférer | Agent | SafeLandNFT | Via Escrow ou directement |
| Ajouter charge | Agent | SafeLandNFT | Auto-lock si hypothèque |
| Lever charge | Agent | SafeLandNFT | Auto-unlock si dernière |
| Verrouiller | Propriétaire/Admin | SafeLandNFT | Travel Lock / Panic |
| Geler | Juge (via Justice) | SafeLandJustice → NFT | Freeze |
| Annuler fraude | Juge (via Justice) | SafeLandJustice → NFT | Burn & Remint |

### 6.2 Transactions Immobilières (Escrow)

**Workflow complet :**

1. Le notaire crée le deal avec les parties et le prix
2. Le vendeur confirme par signature on-chain
3. L'acheteur dépose les fonds (ETH/MATIC) dans le contrat
4. Le notaire valide → répartition fiscale automatique + transfert NFT
5. En cas d'annulation : remboursement automatique

### 6.3 Succession (FRIDDA)

Le module FRIDDA (Fractionné, Intelligent, Distribué, Décentralisé, Automatisé) gère :

- L'ouverture d'un dossier de succession lié à un NFT
- La distribution des 24 parts entre héritiers (conforme au droit marocain)
- La gouvernance successorale par vote pondéré
- La finalisation avec mint des tokens ERC-1155

### 6.4 Module Judiciaire

Trois actions judiciaires multi-signatures :

1. **Gel** — Bloque tout transfert du NFT
2. **Transfert forcé** — Destruction et réémission (cas de fraude avérée)
3. **Récupération sociale** — Changement de wallet (perte/vol de clés)

---

## 7. Sécurité & Conformité

### 7.1 Sécurité des Smart Contracts

- **OpenZeppelin v5** — Bibliothèque auditée et standard de l'industrie
- **ReentrancyGuard** — Protection contre les attaques de réentrance
- **AccessControl** — Rôles granulaires (pas de admin unique)
- **Pausable** — Arrêt d'urgence par admin
- **UUPS Proxy** — Upgrade possible sans migration de données
- **Solidity ^0.8.24** — Protection native contre overflow/underflow

### 7.2 Conformité juridique marocaine

| Loi | Domaine | Conformité SafeLand |
|-----|---------|-------------------|
| Loi 39-08 | Conservation Foncière | Équivalence titre numérique ↔ titre physique |
| Loi 43-20 | Signature Électronique | Signature MetaMask comme preuve légale |
| Loi 09-08 | Protection des Données | PII jamais on-chain, chiffrement AES-256 |
| Loi 53-05 | Échange Électronique | Horodatage blockchain comme preuve |
| Code des Droits Réels | Propriété | NFT = représentation numérique du titre |

### 7.3 Audit et traçabilité

- Historique immuable de chaque mutation (TransactionRecord[])
- Logs applicatifs via morgan
- Conservation 10 ans (exigence légale)
- Audit externe smart contracts prévu (Phase 5)

---

## 8. Modèle Économique B2G

### 8.1 Sources de revenus

| Source | Montant | Récurrence |
|--------|---------|-----------|
| Licence annuelle | 2 000 000 MAD | Annuel |
| Création NFT | 50 MAD / titre | Par transaction |
| Transfert propriété | 100 MAD / transfert | Par transaction |
| Formation agents | 2 000 MAD / agent | Ponctuel |
| Support & maintenance | 500 000 MAD | Annuel (à partir An 2) |

### 8.2 Projection financière

| | Année 1 | Année 2 | Année 3 |
|--|---------|---------|---------|
| **Revenus** | 2,84 M MAD | 6,0 M MAD | 10+ M MAD |
| **Coûts** | 4,87 M MAD | 2,5 M MAD | 3,0 M MAD |
| **Résultat** | -2,03 M MAD | +3,5 M MAD | +7,0 M MAD |
| **NFT créés** | 10 000 | 50 000 | 200 000 |
| **Agents formés** | 120 | 500 | 1 000+ |

**ROI cumulé positif dès l'année 2.**

### 8.3 Avantage compétitif

- **Premier entrant** sur le marché foncier blockchain au Maroc
- **Partenariat B2G exclusif** avec l'ANCFCC
- **5 contrats intégrés** couvrant tout le cycle de vie foncier
- **Module FRIDDA unique** pour la succession conforme au droit marocain

---

## 9. Feuille de Route

### Phase 0 — Initialisation (Mois 1) ✅
- Setup projet, CI/CD, architecture

### Phase 1 — Smart Contracts (Mois 2-3) ✅
- 5 contrats déployés, 30/30 tests passants

### Phase 2 — Backend (Mois 3-5)
- API Express.js, IPFS, Swagger

### Phase 3 — Frontend (Mois 5-7)
- Next.js 14, 6 pages, connexion MetaMask

### Phase 4 — Intégration & Tests (Mois 7-8)
- UAT, tests de charge, intégration ANCFCC

### Phase 5 — Audit Externe (Mois 9)
- Audit smart contracts, pentest application

### Phase 6 — Pilote (Mois 10)
- 100 NFT réels à Casablanca, 20 agents formés

### Phase 7 — Déploiement (Mois 11-12)
- Extension Rabat + Marrakech, 10 000+ NFT

### Vision 2027-2030
- Déploiement national (5M+ titres)
- Marketplace immobilière décentralisée
- Tokenisation fractionnée (investissement participatif)
- Expansion Afrique du Nord

---

## 10. Équipe & Gouvernance

### 10.1 Équipe cible (14 personnes)

| Pôle | Profils | Effectif |
|------|---------|---------|
| Management | Chef de Projet, Product Owner | 2 |
| Blockchain | Architecte Senior, Dev Solidity | 3 |
| Full-Stack | Dev Backend (Node.js), Dev Frontend (React) | 4 |
| Infra & Sécurité | DevOps, Security Engineer | 2 |
| Design & QA | UI/UX Designer, QA Engineer | 2 |
| **Total** | | **14** |

### 10.2 Gouvernance technique

- **Smart Contracts** — Upgrades via UUPS, contrôlés par UPGRADER_ROLE
- **Multi-sig judiciaire** — Seuil configurable pour actions Justice
- **Pause d'urgence** — ADMIN_ROLE sur tous les contrats
- **Rôles croisés** — Le script de déploiement configure automatiquement les permissions inter-contrats

---

## 11. Annexes Techniques

### A. Contrats déployés (Hardhat localhost)

| Contrat | Adresse Proxy |
|---------|--------------|
| SafeLandNFT | 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 |
| SafeLandRegistry | 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 |
| SafeLandEscrow | 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 |
| SafeLandFridda | 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 |
| SafeLandJustice | 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318 |

### B. Endpoints API

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/auth/nonce/:address` | GET | Obtenir nonce MetaMask |
| `/api/auth/login` | POST | Login par signature |
| `/api/properties` | GET/POST | Lister / créer propriétés |
| `/api/properties/:tokenId` | GET | Détails d'un NFT |
| `/api/escrow/create` | POST | Créer un deal Escrow |
| `/api/escrow/:dealId/sign` | POST | Vendeur signe |
| `/api/escrow/:dealId/fund` | POST | Acheteur dépose |
| `/api/escrow/:dealId/complete` | POST | Notaire finalise |
| `/api/fridda/open` | POST | Ouvrir succession |
| `/api/fridda/:dossierId/distribute` | POST | Distribuer parts |
| `/api/fridda/:dossierId/finalize` | POST | Finaliser |
| `/api/ipfs/upload` | POST | Upload fichier IPFS |
| `/api/ipfs/:cid` | GET | Télécharger depuis IPFS |
| `/api/docs` | GET | Swagger UI |

### C. Structure du projet

```
safeland/
├── contracts/           # 5 Smart Contracts Solidity
├── test/                # 3 fichiers de tests (30/30)
├── scripts/             # Script de déploiement UUPS
├── backend/             # API Express.js
│   └── src/
│       ├── config/      # blockchain.js, swagger.js
│       ├── middleware/   # auth.js (JWT)
│       ├── routes/      # auth, properties, escrow, fridda, ipfs
│       └── services/    # ipfs.js (Pinata)
├── frontend/            # Next.js 14
│   └── src/
│       ├── app/         # Pages (dashboard, properties, escrow, fridda, stats)
│       ├── components/  # Navbar
│       └── context/     # WalletContext
├── docs/                # CDC business, CDC technique, pitch, roadmap
├── .github/workflows/   # CI/CD
├── docker-compose.yml   # 3 services
└── hardhat.config.js    # Solidity ^0.8.24, optimizer, gas reporter
```

### D. Glossaire

| Terme | Définition |
|-------|-----------|
| NFT | Non-Fungible Token — jeton numérique unique |
| ERC-721 | Standard Ethereum pour tokens non-fongibles |
| ERC-1155 | Standard multi-token (utilisé pour parts successorales) |
| UUPS | Universal Upgradeable Proxy Standard |
| RBAC | Role-Based Access Control |
| B2G | Business to Government |
| ANCFCC | Agence Nationale de la Conservation Foncière |
| DGI | Direction Générale des Impôts |
| MRE | Marocains Résidant à l'Étranger |
| FRIDDA | Module succession (Fractionné, Intelligent, Distribué, Décentralisé, Automatisé) |
| Escrow | Séquestre — fonds bloqués jusqu'à validation |
| Gas | Frais de transaction blockchain |
| Pinata | Service d'hébergement IPFS |

---

**© 2026 SafeLand — Tous droits réservés**

*Document confidentiel — Usage interne et investisseurs uniquement*
