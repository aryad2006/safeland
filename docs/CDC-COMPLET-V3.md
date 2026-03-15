# Cahier des Charges Complet - SafeLand Morocco
## Plateforme NFT de Securisation Fonciere au Maroc (B2G)

**Version:** 3.0 (synchronisee avec l'implementation reelle — 6 contrats, 373 tests)
**Date:** 15 mars 2026
**Statut:** Document de specification — aligne sur le code deploye
**Editeur:** TachyDigital SARL

---

## Table des Matieres

1. [Contexte et Enjeux](#1-contexte-et-enjeux)
2. [Objectifs du Projet](#2-objectifs-du-projet)
3. [Perimetre](#3-perimetre)
4. [Modele B2G](#4-modele-b2g)
5. [Specifications Fonctionnelles](#5-specifications-fonctionnelles)
6. [Specifications Techniques](#6-specifications-techniques)
7. [Architecture Systeme](#7-architecture-systeme)
8. [Smart Contracts Solidity](#8-smart-contracts-solidity)
9. [Backend API](#9-backend-api)
10. [Frontend](#10-frontend)
11. [Securite et Conformite](#11-securite-et-conformite)
12. [Integration Gouvernementale](#12-integration-gouvernementale)
13. [Interface Utilisateur](#13-interface-utilisateur)
14. [Tests et Qualite](#14-tests-et-qualite)
15. [Infrastructure et Deploiement](#15-infrastructure-et-deploiement)
16. [Planning et Livrables](#16-planning-et-livrables)
17. [Ressources et Budget](#17-ressources-et-budget)
18. [Risques et Mitigation](#18-risques-et-mitigation)
19. [Criteres de Succes](#19-criteres-de-succes)

---

## 1. Contexte et Enjeux

### 1.1 Problematique Fonciere Marocaine

Le secteur foncier au Maroc repose sur un systeme largement papier gere par l'ANCFCC. Vulnerabilites critiques :

| Probleme | Impact | Chiffres |
|----------|--------|----------|
| Fraude documentaire | Falsification titres, double vente, usurpation | ~12% des transactions |
| Litiges fonciers | Engorgement tribunaux | ~68 000 dossiers/an |
| Lenteur administrative | Transactions sur 3-6 mois | Cout moyen 120-500K MAD |
| Spoliation MRE | Vulnerable a distance | 5M+ Marocains concernes |
| Successions bloquees (Fridda) | Biens en indivision | Milliers de dossiers geles |
| Perte economique | Frein a l'investissement | > 15 Mds MAD/an |

### 1.2 Opportunites Blockchain

- Immuabilite des enregistrements (aucune modification retroactive)
- Tracabilite complete de chaque mutation depuis la creation
- Automatisation des processus via smart contracts
- Fiscalite at-the-source (taux de recouvrement 100%)
- Securite cryptographique (signature numerique, hachage)

### 1.3 Cadre Legal Marocain

| Loi | Domaine | Application SafeLand |
|-----|---------|---------------------|
| Dahir de 1913 | Immatriculation fonciere | NFT comme extension numerique du titre |
| Loi 14-07 | ANCFCC | Integration directe registre |
| Loi 39-08 | Conservation Fonciere | Equivalence titre numerique / physique |
| Loi 43-20 | Services de confiance | Signature electronique qualifiee |
| Loi 09-08 | Protection donnees (CNDP) | PII jamais on-chain, chiffrement AES-256 |
| Loi 53-05 | Echange electronique | Horodatage blockchain comme preuve |
| Code Famille (Moudawana) | Succession | Fridda — calcul successoral 24 parts |

---

## 2. Objectifs du Projet

### 2.1 Objectifs Principaux

1. **Numeriser** les titres fonciers sous forme de NFT ERC-721 (1 titre = 1 NFT)
2. **Securiser** les transactions immobilieres via blockchain (escrow atomique)
3. **Automatiser** la fiscalite fonciere (DGI 4% + ANCFCC 1% at-the-source)
4. **Simplifier** les successions via fractionnement ERC-1155 (Fridda)
5. **Proteger** les citoyens via gel judiciaire, travel lock, et social recovery

### 2.2 Indicateurs de Performance (KPI)

| KPI | Objectif | Methode de mesure |
|-----|----------|-------------------|
| Temps de traitement transaction | Reduction 70% (< 30 sec on-chain) | Logs blockchain |
| Cas de fraude | Reduction 80% | Compteur fraudAttemptsPrevented |
| Satisfaction utilisateurs | +60% | Enquetes UAT |
| Couts administratifs | Reduction 50% | Comparaison avant/apres |
| Taux recouvrement fiscal | 100% | Split automatique Escrow |

---

## 3. Perimetre

### 3.1 Phase 1 — MVP (implemente)

| Module | Etat | Details |
|--------|------|---------|
| SafeLandNFT (ERC-721) | OK | Mint, transfert, charges, travel lock, freeze, burn/remint |
| SafeLandRegistry | OK | Index par ville/proprietaire/type, stats globales |
| SafeLandEscrow | OK | Sequestre 4 etapes, split fiscal DGI+ANCFCC |
| SafeLandFridda (ERC-1155) | OK | Succession 24 parts, vote heritiers, propositions |
| SafeLandJustice | OK | Multi-sig M-of-N, freeze/burn/remint, social recovery |
| SafeLandTimelock | OK | Operations differees 1-30 jours, grace period 14j |
| Backend API | OK | 8 routes, JWT, WebSocket, SQLite |
| Frontend | OK | 9 pages, i18n FR/EN/AR, MetaMask |
| Subgraph TheGraph | OK | 6 datasources, 20 entites |
| CI/CD | OK | 7 jobs GitHub Actions |
| Docker | OK | 4 services |

### 3.2 Phase 2 — Extensions planifiees

- Module Pre-Immatriculation Blockchain (Terres Melk)
- Module Terres Collectives (Soulaliyates & Habous)
- Module Droits d'Irrigation et Stress Hydrique
- Module 3D & Verticalite (trefonds, droits de surelevation)
- Service Watchtower MRE (protection active anti-spoliation)
- Marketplace immobiliere decentralisee

### 3.3 Hors Perimetre Phase 1

- Application mobile grand public
- Cadastre 3D avance
- Paiement en cryptomonnaie
- Tokenisation fractionnee (investissement participatif)

---

## 4. Modele B2G

### 4.1 Parties Prenantes

**Cote Gouvernement :**
- **ANCFCC** : Partenaire principal, validateur souverain, Panic Button
- **Ministere de la Justice** : Cles Multi-Sig Justice Override
- **DGI** : Perception fiscale automatique at-the-source
- **DGSSI** : Certification infrastructure souveraine
- **CNDP** : Conformite donnees personnelles

**Cote Business (TachyDigital) :**
- Developpement et maintenance plateforme
- Support technique 24/7
- Formation agents gouvernementaux
- Evolution continue du systeme

### 4.2 Architecture Multi-Tenant

| Tenant | Fonctionnalites |
|--------|----------------|
| Autorite Regalienne (ANCFCC/DGI) | Dashboard decisonnel, Panic Button, Justice Override, perception fiscale |
| Officier Public (Notaires/Adouls) | Minting NFT, Multi-Sig, Moteur Fridda, Smart-Escrow |
| Finance (Banques) | Hypotheque programmable, mainlevee instantanee, scoring |
| Citoyen/MRE | Wallet patrimoine, Watchtower, Travel Lock, vote Fridda |

### 4.3 Sources de Revenus

| Source | Description | Projection An 1 |
|--------|-------------|------------------|
| Licence SaaS Tenant | Acces annuel interfaces professionnelles | 2 000 000 MAD |
| Frais tokenisation | 50-500 MAD / titre | Variable |
| Commission transactions | 0.5% du prix de vente | Variable |
| Formation agents | 2 000 MAD / agent | 240 000 MAD |
| Support & maintenance | Annuel (a partir An 2) | 500 000 MAD |
| Premium MRE (Watchtower) | Abonnement surveillance active | Variable |

### 4.4 Fiscalite Programmee

Lors de chaque vente via SafeLandEscrow :
- **4% → DGI** (Direction Generale des Impots)
- **1% → ANCFCC** (frais de conservation)
- **95% → Vendeur** (solde net)

Le transfert du NFT est techniquement conditionne au paiement des droits → taux de recouvrement 100%.

---

## 5. Specifications Fonctionnelles

### 5.1 Gestion des Titres Fonciers (SafeLandNFT)

#### Creation de NFT Foncier
- **Acteur** : Agent ANCFCC (AGENT_ROLE)
- **Donnees on-chain** : titreFoncier, propertyType, surface, city, district, GPS (lat/lng), documentHash, validator
- **Donnees off-chain** : Documents sur IPFS via Pinata (plans cadastraux, certificats)
- **Contrainte** : Unicite du titreFoncier (pas de doublon)

#### Transfert de Propriete
- **Acteur** : Agent ANCFCC
- **Verifications** : NFT non gele, non verrouille, pas de charge bloquante
- **Historique** : TransactionRecord[] stocke on-chain (from, to, txType, timestamp, notary, documentHash)

#### Systeme de Charges (Encumbrances)
- **Types** : Hypotheque, Saisie, Servitude
- **Comportement** : Auto-lock si hypotheque/saisie active, auto-unlock a la derniere levee
- **Acteur** : Agent ANCFCC

#### Travel Lock (Protection MRE)
- **Acteur** : Proprietaire ou Admin
- **Effet** : Bloque tout transfert du NFT
- **Cas d'usage** : Marocains a l'etranger voulant proteger leurs biens

#### Interventions Judiciaires
- **Gel** : `freezeByJustice()` — bloque toute operation sur le NFT
- **Burn & Remint** : `justiceOverride()` — destruction et reemission (fraude averee)
- **Acteur** : JUSTICE_ROLE

### 5.2 Transactions Immobilieres (SafeLandEscrow)

**Workflow en 4 etapes :**

```
1. Notaire cree le deal  →  createDeal(tokenId, seller, buyer, price, docHash)
2. Vendeur signe         →  sellerSign(dealId)
3. Acheteur depose fonds →  buyerDeposit(dealId) {value: price}
4. Notaire finalise      →  notaryComplete(dealId)
                              ├→ 4% → wallet DGI
                              ├→ 1% → wallet ANCFCC
                              ├→ 95% → wallet vendeur
                              └→ NFT transfere a l'acheteur
```

**Annulation** : Possible avant finalisation, remboursement automatique de l'acheteur.

### 5.3 Succession (SafeLandFridda)

**Principes :**
- Chaque dossier = 24 parts (conforme fractions islamiques du droit marocain)
- Parts representees par tokens ERC-1155 (fongibles entre heritiers du meme dossier)

**Workflow :**
1. Notaire ouvre le dossier (`openSuccession`) avec acte de deces CID
2. Notaire distribue les parts (`distributeShares`) : mint ERC-1155
3. Notaire finalise (`finalizeSuccession`) : verrouille le dossier
4. Heritiers creent des propositions (Sell/Rent/Renovate)
5. Vote pondere par le nombre de parts (quorum configurable)
6. Execution par le notaire si quorum atteint

### 5.4 Module Judiciaire (SafeLandJustice)

**3 types d'actions :**

| Action | Description | Effet sur NFT |
|--------|-------------|---------------|
| Freeze | Gel d'un titre en litige | Bloque transfert + charges |
| BurnRemint | Annulation pour fraude | Destruction + reemission vers proprietaire legitime |
| SocialRecovery | Perte de wallet | Transfert vers nouveau wallet |

**Multi-sig** : Seuil configurable (defaut = 2 signatures de juges). Proposition → Signatures → Execution.

### 5.5 Timelock Administratif (SafeLandTimelock)

- **Delai** : 1-30 jours (MIN_DELAY / MAX_DELAY)
- **Grace period** : 14 jours apres le delai
- **Roles** : PROPOSER planifie, EXECUTOR execute, CANCELLER annule
- **Usage** : Upgrades de contrats, changements de roles, operations sensibles

### 5.6 Module Bancaire (Backend uniquement)

- **Scoring de liquidite** : Evaluation de la sante d'un titre foncier
- **Hypotheques** : Inscription/levee de charges
- **Mainlevee** : Signature numerique de la mainlevee

---

## 6. Specifications Techniques

### 6.1 Stack Technologique

| Couche | Technologie | Version |
|--------|------------|---------|
| Smart Contracts | Solidity + OpenZeppelin Upgradeable (UUPS) | 0.8.24 / OZ 5.x |
| Blockchain Dev | Hardhat + hardhat-toolbox + hardhat-upgrades | 2.22+ |
| Backend | Node.js + Express + better-sqlite3 + ws | Node 20, Express 4.18 |
| Frontend | Next.js 14 (App Router) + React 18 + Tailwind CSS 3.4 | |
| Web3 | ethers.js v6 (backend signer + frontend BrowserProvider/MetaMask) | 6.13 |
| Auth | JWT (jsonwebtoken) + signature MetaMask (nonce challenge) | |
| Tests contracts | Mocha + Chai (via hardhat-toolbox) | 206 tests |
| Tests backend | Jest 30 + supertest 7 | 167 tests |
| Tests E2E | Playwright (Chromium + iPhone 13) | |
| Linting | ESLint (backend v10, frontend next/core-web-vitals), solhint | |
| IPFS | Pinata API | |
| Indexation | TheGraph subgraph (6 datasources) | |
| Infra | Docker Compose (hardhat + backend + frontend + deployer) | |

### 6.2 Reseau Blockchain Cible

| Phase | Reseau | Usage |
|-------|--------|-------|
| Dev | Hardhat localhost (chainId 31337) | Developpement local |
| Test | Sepolia testnet | Tests d'integration |
| Production | Polygon PoS (Layer 2) | Production |

Polygon PoS choisi pour : frais de gas faibles (~0.01 USD), finalite rapide (~2 sec), compatibilite EVM complete, gouvernance decentralisee.

---

## 7. Architecture Systeme

### 7.1 Architecture Globale

```
┌─────────────────────────────────────────────────────┐
│  UTILISATEURS                                        │
│  Agents ANCFCC · Notaires · Juges · Proprietaires    │
│  Banques · MRE · Heritiers                           │
└──────────┬──────────────────────────────────────────┘
           │ HTTPS + MetaMask
┌──────────v──────────────────────────────────────────┐
│  FRONTEND — Next.js 14 (App Router)                  │
│  9 pages · Tailwind CSS · ethers.js v6 · MetaMask    │
│  i18n FR/EN/AR · RTL auto · WebSocket notifications  │
└──────────┬──────────────────────────────────────────┘
           │ REST API + WebSocket
┌──────────v──────────────────────────────────────────┐
│  BACKEND — Express.js 4.18                           │
│  8 routes · JWT · SQLite WAL · Rate Limiting         │
│  WebSocket broadcast · IPFS (Pinata)                 │
│  Swagger API docs                                    │
└──────────┬──────────────────────────────────────────┘
           │ ethers.js v6 (JSON-RPC)
     ┌─────┴──────────┐
     │                 │
┌────v─────┐    ┌─────v──────────────────────────────┐
│  IPFS    │    │  BLOCKCHAIN (EVM)                   │
│  Pinata  │    │  6 Smart Contracts UUPS Proxies     │
│          │    │  SafeLandNFT (ERC-721)              │
│          │    │  SafeLandRegistry                   │
│          │    │  SafeLandEscrow                     │
│          │    │  SafeLandFridda (ERC-1155)          │
│          │    │  SafeLandJustice                    │
│          │    │  SafeLandTimelock                   │
└──────────┘    └────────────────────────────────────┘
                         │
                ┌────────v───────────┐
                │  TheGraph Subgraph │
                │  6 datasources     │
                │  20 entites        │
                └────────────────────┘
```

### 7.2 Securite en Couches

| Niveau | Mecanismes |
|--------|-----------|
| Peripherie | CORS, Helmet, Rate Limiting (100 req/15min), TLS |
| Application | JWT (7 jours), signature MetaMask (nonce challenge), RBAC 9 roles |
| Smart Contracts | AccessControl (roles granulaires), Pausable, ReentrancyGuard, UUPS |
| Donnees | Documents IPFS (hashes on-chain), PII jamais on-chain, SQLite WAL |

### 7.3 Roles Systeme

| Role | Permissions | Acteur |
|------|------------|--------|
| admin | Toutes (pause, upgrade, grant roles) | TachyDigital + ANCFCC |
| agent | Mint NFT, transfert, charges, registre | Agent ANCFCC |
| notary | Escrow, Fridda, transfert avec validation | Notaire/Adoul |
| justice / judge | Freeze, burn/remint, multi-sig | Magistrat |
| conservator | Social Recovery | Conservateur |
| owner | Travel lock, consultation, vote Fridda | Proprietaire |
| buyer | Depot fonds escrow | Acheteur |
| bank | Scoring, hypotheques, mainlevee | Etablissement bancaire |

---

## 8. Smart Contracts Solidity

### 8.1 SafeLandNFT.sol (~434 lignes)

**Heritage OpenZeppelin :** ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable

**Structures :**
```
PropertyData {
  titreFoncier, oldTitreFoncier, propertyType, surface,
  city, district, latitude, longitude,
  documentHash, validator, createdAt, isActive
}

Encumbrance {
  encType (Hypotheque/Saisie/Servitude), creditor,
  description, documentHash, addedAt, isActive
}

TransactionRecord {
  from, to, txType, timestamp, notary, documentHash
}
```

**Fonctions principales :** createProperty, transferProperty, addEncumbrance, removeEncumbrance, lockTransfer, unlockTransfer, freezeByJustice, justiceOverride, pause, unpause

### 8.2 SafeLandRegistry.sol (~123 lignes)

**Fonctions :** registerProperty, recordTransaction, recordFraudPrevented, getPropertiesByCity, getPropertiesByOwner, getPropertiesByType, getStats

### 8.3 SafeLandEscrow.sol (~272 lignes)

**Fiscalite :** DGI_FEE_BPS = 400 (4%), ANCFCC_FEE_BPS = 100 (1%)
**Statuts :** Created → SellerSigned → BuyerFunded → Completed | Cancelled

### 8.4 SafeLandFridda.sol (~297 lignes)

**Heritage :** ERC1155Upgradeable + AccessControl + ReentrancyGuard + UUPS
**Proposals :** VoteType.Sell / Rent / Renovate, vote pondere par parts

### 8.5 SafeLandJustice.sol (~226 lignes)

**Actions :** Freeze / BurnRemint / SocialRecovery
**Multi-sig :** Seuil configurable (requiredSignatures, defaut 2)

### 8.6 SafeLandTimelock.sol (~271 lignes)

**Constantes :** MIN_DELAY = 1 day, MAX_DELAY = 30 days, GRACE_PERIOD = 14 days

---

## 9. Backend API

### 9.1 Endpoints

| Route | Methodes | Description | Auth |
|-------|----------|-------------|------|
| /api/auth/nonce/:address | GET | Obtenir nonce MetaMask | Non |
| /api/auth/login | POST | Login par signature | Non |
| /api/auth/role | PUT | Changer role utilisateur | admin |
| /api/properties | GET, POST | Lister / creer proprietes | agent (POST) |
| /api/properties/:tokenId | GET | Details d'un NFT | Non |
| /api/properties/:tokenId/lock | POST | Verrouiller | authenticate |
| /api/properties/:tokenId/encumbrance | POST | Ajouter charge | agent |
| /api/escrow | POST, GET | Creer deal / lister | notary |
| /api/escrow/:dealId/sign | POST | Vendeur signe | authenticate |
| /api/escrow/:dealId/fund | POST | Acheteur depose | authenticate |
| /api/escrow/:dealId/complete | POST | Notaire finalise | notary |
| /api/fridda | POST, GET | Ouvrir succession / lister | notary |
| /api/fridda/:dossierId/distribute | POST | Distribuer parts | notary |
| /api/fridda/:dossierId/finalize | POST | Finaliser | notary |
| /api/fridda/:dossierId/propose | POST | Creer proposition | authenticate |
| /api/fridda/:dossierId/vote | POST | Voter | authenticate |
| /api/justice | POST, GET | Proposer action / lister | justice |
| /api/justice/:actionId/sign | POST | Signer action | judge |
| /api/justice/:actionId/execute | POST | Executer action | judge |
| /api/timelock | POST, GET | Planifier / lister | admin |
| /api/timelock/:operationId/execute | POST | Executer operation | admin |
| /api/timelock/:operationId/cancel | POST | Annuler operation | admin |
| /api/bank/:tokenId/score | GET | Scoring liquidite | bank |
| /api/bank/:tokenId/hypotheque | POST | Inscrire hypotheque | bank |
| /api/bank/:tokenId/mainlevee | POST | Lever hypotheque | bank |
| /api/ipfs/upload | POST | Upload fichier IPFS | authenticate |
| /api/ipfs/:cid | GET | Telecharger depuis IPFS | Non |

### 9.2 WebSocket

**URL :** `ws://localhost:3001/ws`
**Channels :** all, nft, escrow, fridda, justice, registry, timelock, bank
**Events :** property.created, property.transferred, property.frozen, deal.created, deal.completed, succession.opened, justice.action, timelock.scheduled, fraud.alert, etc.

---

## 10. Frontend

### 10.1 Pages (App Router Next.js 14)

| Page | Fonctionnalite | WebSocket |
|------|---------------|-----------|
| / | Landing page + connexion MetaMask | - |
| /dashboard | Vue d'ensemble + navigation | - |
| /properties | Liste, creation, recherche, lock/unlock | property.* |
| /escrow | Creation deals, suivi etapes, completion | deal.* |
| /fridda | Successions, parts, propositions, votes | succession.* |
| /justice | Actions judiciaires, signatures, execution | justice.* |
| /bank | Scoring, hypotheques, mainlevee | bank.* |
| /timelock | Operations planifiees, execution, annulation | timelock.* |
| /stats | Statistiques globales (GlobalStats du Registry) | - |

### 10.2 Composants Partages

- **Navbar** : Navigation + wallet status + LanguageSwitcher
- **LanguageSwitcher** : FR/EN/AR avec RTL auto
- **NotificationBell** : Temps reel via WebSocket

### 10.3 Internationalisation

3 locales : Francais (defaut), English, Arabe
RTL automatique pour l'arabe (`dir="rtl"`)
Persistence via localStorage

---

## 11. Securite et Conformite

### 11.1 Audit Interne Realise

| Severite | Trouves | Corriges | Restants |
|----------|---------|----------|----------|
| High (Reentrancy) | 2 | 2 | 0 |
| Medium (Zero-check) | 2 | 2 | 0 |
| Low (Timestamp) | 10 | - | 10 (faux positifs) |
| Info | 12 | - | 12 (acceptes) |

### 11.2 Protections Implementees

- **ReentrancyGuard** : Fonctions payantes/critiques (Escrow, Justice, Timelock)
- **AccessControl** : Roles granulaires RBAC (pas d'admin unique)
- **Pausable** : Arret d'urgence par admin
- **UUPS Proxy** : Upgrade possible sans migration de donnees
- **Solidity 0.8.24** : Protection native overflow/underflow
- **Rate Limiting** : 100 req/15min par IP
- **Helmet** : Headers HTTP securises
- **JWT** : Authentification stateless avec expiration

### 11.3 Conformite RGPD / Loi 09-08

- PII jamais stockees on-chain
- Documents sensibles chiffres AES-256 sur IPFS
- Droit a l'oubli : seuls les hashes sont on-chain
- Declaration CNDP prevue avant mise en production

---

## 12. Integration Gouvernementale

### 12.1 Points d'Integration

| Systeme | Interface | Description |
|---------|-----------|-------------|
| ANCFCC | API REST + WebSocket | Validation titres, consultation registre |
| DGI | Smart Contract (wallet automatique) | Perception fiscale 4% |
| Tribunaux | Frontend Justice + Multi-sig | Gel, burn/remint, recovery |
| Notaires | Frontend Escrow + Fridda | Transactions, successions |
| Banques | API Bank + Scoring | Hypotheques, mainlevee, scoring |

### 12.2 Deploiement Cible

| Phase | Perimeter | Volume |
|-------|-----------|--------|
| Pilote (6 mois) | 3 conservations (Casablanca, Rabat, Marrakech) | 1 000 titres |
| Regional (12 mois) | 12 conservations | 10 000 titres |
| National (24 mois) | 75 conservations | 100 000+ titres |
| Expansion (36 mois) | Afrique francophone | Multi-pays |

---

## 13. Interface Utilisateur

### 13.1 Design System

- **Framework CSS** : Tailwind CSS 3.4
- **Theme** : Glassmorphism (composants glass avec backdrop-blur)
- **Icones** : lucide-react
- **Toasts** : react-hot-toast
- **Responsive** : Mobile-first (grid Tailwind)
- **Accessibilite** : RTL auto, contraste suffisant

### 13.2 Flows Utilisateur Principaux

**Agent ANCFCC :**
1. Connexion MetaMask → JWT
2. Dashboard → Properties → Creer un NFT
3. Remplir formulaire (titre, type, surface, ville, GPS)
4. Upload documents IPFS
5. Mint NFT → notification WebSocket

**Notaire :**
1. Connexion → Escrow → Creer un deal
2. Vendeur notifie → signe
3. Acheteur notifie → depose fonds
4. Notaire finalise → split fiscal automatique
5. NFT transfere → notifications

**Heritier :**
1. Connexion → Fridda → Voir ses parts
2. Creer proposition (vente, location, renovation)
3. Autres heritiers votent
4. Si quorum atteint → execution par notaire

---

## 14. Tests et Qualite

### 14.1 Couverture

| Couche | Framework | Tests | Suites |
|--------|-----------|-------|--------|
| Smart Contracts | Mocha + Chai | 206 | 6 |
| Backend | Jest + Supertest | 167 | 7 |
| **Total** | | **373** | **13** |

### 14.2 Suites de Tests

**Smart Contracts :**
- SafeLandNFT.test.js (76 tests)
- SafeLandRegistry.test.js (27 tests)
- SafeLandEscrow.test.js (53 tests)
- SafeLandFridda.test.js (41 tests)
- SafeLandJustice.test.js (38 tests)
- SafeLandTimelock.test.js (37 tests — correction: total ajuste)

**Backend :**
- auth.test.js, validators.test.js, database.test.js, bank.test.js, ipfs.test.js, notifications.test.js, timelock.test.js

### 14.3 CI/CD

7 jobs GitHub Actions :
1. **contracts** : compile + test + gas report
2. **backend** : lint + test + coverage
3. **frontend** : build
4. **subgraph** : codegen + build
5. **security** : npm audit
6. **slither** : analyse statique Solidity
7. **e2e** : Playwright (branch main uniquement)

---

## 15. Infrastructure et Deploiement

### 15.1 Docker Compose

4 services :
- **hardhat** : Blockchain locale (port 8545)
- **deployer** : Deploy contrats (one-shot)
- **backend** : API Express (port 3001)
- **frontend** : Next.js standalone (port 3000)

### 15.2 Deploiement Production

| Composant | Hebergement | Details |
|-----------|-------------|---------|
| Smart Contracts | Polygon PoS | UUPS proxies |
| Backend | VPS ou Cloud (AWS/GCP) | Node.js + PM2/Docker |
| Frontend | Vercel ou VPS | Next.js standalone |
| Base de donnees | SQLite WAL (volume Docker) | Migration PostgreSQL prevue |
| IPFS | Pinata (cloud) | Documents certifies |
| Subgraph | TheGraph Studio | Indexation evenements |

---

## 16. Planning et Livrables

| Phase | Periode | Livrables | Statut |
|-------|---------|-----------|--------|
| Phase 0 — Fondation | T1 2025 | Smart contracts, tests, architecture | FAIT |
| Phase 1 — MVP | T2-T4 2025 | Backend, frontend, Docker, CI/CD | FAIT |
| Phase 2 — Stabilisation | T1 2026 | 373 tests, WebSocket, i18n, Timelock | FAIT |
| Phase 3 — Audit & Fix | T1 2026 | Correction des 12 critiques identifiees | EN COURS |
| Phase 4 — Testnet | T2 2026 | Deploy Sepolia, TheGraph Studio | PLANIFIE |
| Phase 5 — Audit Externe | T3 2026 | CertiK ou Trail of Bits | PLANIFIE |
| Phase 6 — Pilote | T4 2026 | 3 conservations, 1 000 titres | PLANIFIE |
| Phase 7 — Regional | 2027 | 12 conservations, 10 000 titres | PLANIFIE |

---

## 17. Ressources et Budget

### 17.1 Equipe Cible

| Pole | Profils | Effectif |
|------|---------|---------|
| Management | Chef de Projet, Product Owner | 2 |
| Blockchain | Architecte Senior, Dev Solidity | 3 |
| Full-Stack | Dev Backend (Node.js), Dev Frontend (React) | 4 |
| Infra & Securite | DevOps, Security Engineer | 2 |
| Design & QA | UI/UX Designer, QA Engineer | 2 |
| Juridique | Juriste foncier | 1 |
| **Total** | | **14** |

### 17.2 Budget Phase 1 (12 mois)

| Poste | Montant (MAD) |
|-------|---------------|
| Salaires equipe (14 pers.) | 3 360 000 |
| Infrastructure cloud | 360 000 |
| Audit securite externe | 400 000 |
| Licences & outils | 150 000 |
| Juridique & conformite | 200 000 |
| Formation & deplacement | 200 000 |
| Reserve (10%) | 200 000 |
| **Total** | **4 870 000** |

---

## 18. Risques et Mitigation

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Resistance au changement (ANCFCC) | Haute | Haute | Pilote progressif, formation, quick wins |
| Cadre legal insuffisant | Moyenne | Haute | Veille juridique, lobbying, Loi 43-20 |
| Vulnerabilite smart contracts | Moyenne | Critique | Audit externe, bug bounty, monitoring |
| Scalabilite blockchain | Faible | Moyenne | Polygon L2, optimisation gas |
| Perte de cles (MRE) | Moyenne | Haute | Social Recovery, Watchtower |
| Dependance Pinata IPFS | Faible | Moyenne | Fallback vers Arweave/nft.storage |

---

## 19. Criteres de Succes

| Critere | Seuil | Mesure |
|---------|-------|--------|
| Tests passants | 100% | CI/CD green |
| Vulnerabilites critiques | 0 | Audit externe |
| Temps de traitement | < 30 sec (on-chain) | Logs |
| Disponibilite API | > 99.5% | Monitoring |
| Titres pilote tokenises | 1 000 | Registry.getStats() |
| Agents formes | 20+ | Compteur formation |
| Satisfaction UAT | > 80% | Enquetes |

---

*Document genere le 15 mars 2026 — SafeLand Morocco / TachyDigital SARL*
*Version 3.0 — Synchronisee avec le code (HEAD: 005b18b)*
