# Cahier des Charges - SafeLand
## Plateforme NFT de Sécurisation Foncière au Maroc (B2G)

**Version:** 2.0 (alignée sur implémentation réelle)  
**Date:** 18 février 2026  
**Statut:** Document de spécification — synchronisé avec le code déployé

---

## Table des Matières

1. [Contexte et Enjeux](#1-contexte-et-enjeux)
2. [Objectifs du Projet](#2-objectifs-du-projet)
3. [Périmètre du Projet](#3-périmètre-du-projet)
4. [Modèle B2G (Business to Government)](#4-modèle-b2g-business-to-government)
5. [Spécifications Fonctionnelles](#5-spécifications-fonctionnelles)
6. [Spécifications Techniques](#6-spécifications-techniques)
7. [Architecture Système](#7-architecture-système)
8. [Smart Contracts Solidity](#8-smart-contracts-solidity)
9. [Sécurité et Conformité](#9-sécurité-et-conformité)
10. [Intégration Gouvernementale](#10-intégration-gouvernementale)
11. [Interface Utilisateur](#11-interface-utilisateur)
12. [Planning et Livrables](#12-planning-et-livrables)
13. [Ressources et Budget](#13-ressources-et-budget)
14. [Risques et Mitigation](#14-risques-et-mitigation)
15. [Critères de Succès](#15-critères-de-succès)

---

## 1. Contexte et Enjeux

### 1.1 Problématique
Le secteur foncier au Maroc fait face à plusieurs défis :
- Fraude et falsification des titres de propriété
- Processus administratifs longs et complexes
- Manque de transparence dans les transactions
- Difficultés de traçabilité historique
- Coûts élevés de vérification et d'authentification
- Risques de corruption et de double vente

### 1.2 Opportunités de la Blockchain
- Immuabilité des enregistrements
- Traçabilité complète des transactions
- Transparence et auditabilité
- Réduction des intermédiaires
- Automatisation via smart contracts
- Sécurité cryptographique avancée

### 1.3 Cadre Légal Marocain
- Conformité avec la loi 39-08 (Conservation Foncière)
- Respect du Code des Droits Réels
- Alignement avec la stratégie de digitalisation du gouvernement
- Protection des données personnelles (loi 09-08)

---

## 2. Objectifs du Projet

### 2.1 Objectifs Principaux
1. **Numériser** les titres fonciers sous forme de NFT
2. **Sécuriser** les transactions immobilières via blockchain
3. **Simplifier** les processus administratifs
4. **Réduire** les fraudes et litiges fonciers
5. **Améliorer** la transparence et la confiance

### 2.2 Objectifs Secondaires
- Créer un registre foncier numérique décentralisé
- Faciliter l'accès à l'information foncière
- Réduire les coûts de transaction
- Accélérer les délais de traitement
- Moderniser l'administration foncière

### 2.3 Indicateurs de Performance (KPI)
- Réduction de 70% du temps de traitement des transactions
- Diminution de 80% des cas de fraude
- Augmentation de 60% de la satisfaction utilisateur
- Économie de 50% sur les coûts administratifs

---

## 3. Périmètre du Projet

### 3.1 Inclus dans le Périmètre
✅ Développement des smart contracts Solidity
✅ Déploiement sur réseau blockchain (testnet puis mainnet)
✅ Interface web pour les autorités gouvernementales
✅ API d'intégration avec systèmes existants
✅ Système de gestion des NFT fonciers
✅ Module de vérification et d'authentification
✅ Système de traçabilité des transactions
✅ Documentation technique complète
✅ Formation des administrateurs

### 3.2 Hors Périmètre (Phase 1)
❌ Application mobile grand public
❌ Intégration avec cadastre 3D
❌ Paiement en cryptomonnaie
❌ Tokenisation fractionnée des biens
❌ Marketplace publique de revente

### 3.3 Évolutions Futures (Phase 2)
- Extension à d'autres types de biens
- Intégration IoT pour surveillance physique
- Smart contracts pour locations et hypothèques
- Système de vote décentralisé pour copropriétés

---

## 4. Modèle B2G (Business to Government)

### 4.1 Définition du Modèle
Le modèle B2G consiste à fournir une solution technologique blockchain à l'administration marocaine pour moderniser la gestion foncière.

### 4.2 Parties Prenantes

#### 4.2.1 Côté Gouvernement
- **Agence Nationale de la Conservation Foncière (ANCFCC)**
  - Validation des titres de propriété
  - Enregistrement officiel des NFT
  - Supervision des transactions
  
- **Ministère de l'Intérieur**
  - Coordination administrative
  - Contrôle de conformité
  
- **Ministère de la Justice**
  - Validation légale
  - Résolution des litiges

#### 4.2.2 Côté Business (SafeLand)
- Développement et maintenance de la plateforme
- Support technique
- Formation des agents
- Évolution du système

### 4.3 Flux de Valeur
```
SafeLand → Plateforme Blockchain → Gouvernement → Citoyens
   ↓              ↓                      ↓            ↓
Technologie   Sécurité           Administration   Services
Innovation    Transparence       Efficace         Améliorés
```

### 4.4 Modèle Économique
- **Licence d'utilisation** : Contrat annuel avec l'État
- **Frais par transaction** : Commission sur chaque enregistrement
- **Services de maintenance** : Support technique et mises à jour
- **Formation** : Programmes de formation certifiante
- **Consulting** : Accompagnement stratégique

---

## 5. Spécifications Fonctionnelles

### 5.1 Gestion des Titres Fonciers NFT

#### 5.1.1 Création de NFT Foncier
**Acteurs:** Agent ANCFCC authentifié

**Processus:**
1. Vérification du titre foncier physique
2. Numérisation des documents (scan haute résolution)
3. Extraction des métadonnées :
   - Numéro de titre foncier
   - Localisation GPS (coordonnées)
   - Surface (m²)
   - Type de bien (terrain, villa, appartement, etc.)
   - Propriétaire actuel (identité + CIN)
   - Historique des transactions
   - Charges et servitudes
4. Upload des documents sur IPFS/Arweave
5. Création du NFT avec métadonnées on-chain
6. Attribution au propriétaire légitime

**Données Stockées:**
```json
{
  "tokenId": "unique_id",
  "titreFoncier": "12345/R",
  "type": "Villa",
  "surface": 250,
  "localisation": {
    "ville": "Casablanca",
    "quartier": "Anfa",
    "gps": {"lat": 33.5731, "lng": -7.5898}
  },
  "proprietaire": {
    "nom": "HASHED",
    "cin": "ENCRYPTED",
    "walletAddress": "0x..."
  },
  "documents": {
    "titreFoncier": "ipfs://...",
    "planCadastral": "ipfs://...",
    "certificatPropriete": "ipfs://..."
  },
  "timestamp": 1739836800,
  "validePar": "Agent_ID_123"
}
```

#### 5.1.2 Consultation de NFT
**Acteurs:** Agents ANCFCC, Notaires, Juges, Propriétaires

**Fonctionnalités:**
- Recherche par numéro de titre foncier
- Recherche par adresse/localisation
- Recherche par propriétaire
- Affichage des métadonnées complètes
- Historique complet des transactions
- Vérification d'authenticité
- Export de certificat blockchain

#### 5.1.3 Modification de NFT
**Acteurs:** Agent ANCFCC (niveau supérieur)

**Cas d'usage:**
- Correction d'erreurs administratives
- Mise à jour de surface (après re-mesure)
- Ajout de servitudes
- Modification de classification

**Contraintes:**
- Nécessite validation multi-signature
- Traçabilité complète des modifications
- Justificatif obligatoire

### 5.2 Gestion des Transactions

#### 5.2.1 Transfert de Propriété via Escrow (SafeLandEscrow)
**Processus atomique en 4 étapes :**
1. **Notaire crée le deal** (`createDeal`) — lie le tokenId, vendeur, acheteur et prix
2. **Vendeur signe** (`sellerSign`) — confirme son accord de vente
3. **Acheteur dépose les fonds** (`buyerDeposit`) — ETH bloqué dans le contrat Escrow
4. **Notaire finalise** (`notaryComplete`) — répartition fiscale automatique + transfert NFT

**Répartition fiscale automatique :**
- 4 % → DGI (Direction Générale des Impôts)
- 1 % → ANCFCC (Conservation Foncière)
- 95 % → Vendeur (net)

**Annulation :** Le vendeur peut annuler avant validation notaire ; les fonds de l'acheteur sont remboursés automatiquement.

**Smart Contract Logic (implémenté) :**
```solidity
function createDeal(uint256 tokenId, address seller, address buyer, uint256 price) external onlyRole(NOTARY_ROLE);
function sellerSign(uint256 dealId) external; // vendeur uniquement
function buyerDeposit(uint256 dealId) external payable nonReentrant;
function notaryComplete(uint256 dealId) external onlyRole(NOTARY_ROLE) nonReentrant;
function cancelDeal(uint256 dealId, string calldata reason) external nonReentrant;
```

#### 5.2.2 Mise sous Hypothèque / Charges
**Fonctionnalité (implémenté dans SafeLandNFT) :**
- Enregistrement de la charge sur le NFT (`addEncumbrance`)
- **Blocage automatique** du transfert si type = "hypotheque" ou "saisie"
- Lien avec le créancier (adresse wallet)
- Déblocage automatique quand toutes les charges actives sont levées (`removeEncumbrance`)
- Types supportés : `hypotheque`, `servitude`, `saisie`

**Mécanismes de verrouillage :**
- Travel Lock : verrouillage lors d'une transaction en cours
- Safe-Lock : verrouillage manuel par admin/juge
- Panic Button : verrouillage d'urgence avec raison

#### 5.2.3 Héritage / Succession (SafeLandFridda – Module FRIDDA)
**Standard :** ERC-1155 (parts successorales fractionnées en 24 shares)

**Processus (implémenté) :**
1. **Ouverture** (`openSuccession`) — par AGENT_ROLE, lie le NFT au de cujus
2. **Distribution** (`distributeShares`) — répartition des 24 parts entre héritiers
3. **Finalisation** (`finalizeSuccession`) — par NOTARY_ROLE, mint ERC-1155 pour chaque héritier

**Gouvernance successorale :**
- **Proposition** (`createProposal`) — un héritier propose une action (vente, partage, etc.)
- **Vote pondéré** (`vote`) — chaque héritier vote proportionnellement à ses parts
- **Exécution** (`executeProposal`) — si majorité (>12 shares en faveur), le notaire exécute

#### 5.2.4 Module Judiciaire (SafeLandJustice)
**Objectif :** Multi-signature judiciaire pour interventions légales

**Actions supportées :**
- **Gel judiciaire** (`FREEZE`) — gèle un NFT par décision de justice
- **Transfert forcé** (`OVERRIDE`) — burn + remint vers nouveau propriétaire
- **Récupération sociale** (`SOCIAL_RECOVERY`) — en cas de perte de wallet

**Processus multi-sig :**
1. Un juge propose l'action (`proposeAction`)
2. D'autres juges co-signent (`signAction`) — seuil configurable (défaut : 2)
3. Exécution après atteinte du quorum (`executeAction`)

### 5.3 Gestion des Utilisateurs et Permissions

#### 5.3.1 Rôles et Accès

**Super Admin (ANCFCC Director)**
- Gestion globale du système
- Création/révocation d'agents
- Modification des paramètres critiques
- Accès aux logs complets

**Agent ANCFCC (Niveau 1)**
- Création de NFT
- Consultation illimitée
- Validation de transactions

**Agent ANCFCC (Niveau 2)**
- Modification de NFT
- Résolution de litiges
- Multi-signature

**Notaire Certifié**
- Initiation de transactions
- Consultation de NFT spécifiques
- Génération de contrats

**Juge**
- Consultation pour litiges
- Déblocage de transactions
- Ordre de saisie

**Propriétaire**
- Consultation de ses biens
- Initiation de vente
- Téléchargement de certificats

#### 5.3.2 Authentification
- Multi-factor authentication (MFA)
- Wallet Ethereum obligatoire
- Signature cryptographique
- Session timeout (30 min)
- Logging de toutes les actions

### 5.4 Système de Vérification

#### 5.4.1 Vérification d'Authenticité
**API Publique:**
```
GET /api/verify/{tokenId}
Response:
{
  "valid": true,
  "onChain": true,
  "owner": "0x...",
  "lastTransaction": "timestamp",
  "certificateUrl": "ipfs://..."
}
```

#### 5.4.2 Anti-Fraude
- Détection de tentatives de double création
- Alerte sur transactions suspectes
- Vérification croisée avec base physique
- Machine learning pour patterns anormaux

### 5.5 Rapports et Analytics

#### 5.5.1 Tableaux de Bord
**Pour ANCFCC:**
- Nombre de NFT créés (jour/mois/an)
- Transactions en cours
- Transactions complétées
- Temps moyen de traitement
- Alertes et incidents

**Pour Gouvernement:**
- Valeur totale sécurisée
- Réduction de la fraude (%)
- Adoption par région
- ROI de la digitalisation

#### 5.5.2 Exports
- Rapports PDF personnalisables
- Export Excel pour analyses
- API pour business intelligence
- Logs auditables

---

## 6. Spécifications Techniques

### 6.1 Stack Technologique

#### 6.1.1 Blockchain
- **Framework:** Hardhat v2.22+
- **Langage Smart Contracts:** Solidity ^0.8.24
- **Bibliothèques:** OpenZeppelin Contracts Upgradeable v5 (UUPS Proxy Pattern)
- **Compilateur:** solc 0.8.24, optimizer enabled (200 runs), viaIR=true
- **Network:** 
  - Développement: Hardhat Local Network (chainId 31337)
  - Test: Sepolia Testnet
  - Production: Polygon PoS (Layer 2)

**Justification Polygon:**
- Frais de gas réduits
- Vitesse de transaction élevée
- Compatibilité EVM
- Éco-responsable (Proof of Stake)

#### 6.1.2 Backend
- **Runtime:** Node.js v20 LTS
- **Framework:** Express.js v4.18
- **Sécurité:** helmet, cors, express-rate-limit (100 req / 15 min)
- **Authentification:** JWT (jsonwebtoken) — expiration 30 min, signature MetaMask (nonce challenge)
- **Blockchain:** ethers.js v6 (provider + wallet + contract instances)
- **Logging:** morgan (dev mode)
- **Upload fichiers:** multer
- **Documentation API:** swagger-jsdoc v6 + swagger-ui-express v5 (OpenAPI 3.0, UI à `/api/docs`)
- **IPFS:** Pinata SDK (upload fichiers/JSON, téléchargement via gateway)
- **Base de données:** Aucune (Phase 1 — données on-chain + IPFS uniquement)

> **Note Phase 2 :** Intégration PostgreSQL (Prisma) prévue pour cache off-chain, analytics et indexation.

#### 6.1.3 Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v3
- **Icônes:** lucide-react
- **Notifications:** react-hot-toast
- **Web3:** ethers.js v6 (connexion directe MetaMask via `window.ethereum`)
- **State Management:** React Context API (`WalletContext`)

> **Note Phase 2 :** Ajout wagmi + RainbowKit pour support multi-wallet, Mapbox GL JS pour cartographie interactive.

#### 6.1.4 Stockage Décentralisé
- **Documents:** IPFS (via Pinata ou Infura)
- **Backup permanent:** Arweave
- **Chiffrement:** AES-256 pour données sensibles

#### 6.1.5 Infrastructure
- **Containerisation:** Docker + docker-compose (3 services : hardhat, backend, frontend)
- **CI/CD:** GitHub Actions (2 jobs : contracts compile+test+gas, frontend build)
- **Logging:** morgan (console, dev mode)
- **Images Docker:** node:20-alpine (multi-stage build)

> **Note Phase 2 :** Migration vers Kubernetes, monitoring Grafana + Prometheus, logs ELK Stack, WAF CloudFlare.

### 6.2 Standards et Normes

#### 6.2.1 Smart Contracts
- **NFT Standard:** ERC-721 étendu
- **Access Control:** OpenZeppelin AccessControl
- **Upgradeability:** UUPS Proxy Pattern
- **Audit:** Conformité aux standards OpenZeppelin

```solidity
// Structure de base
contract SafeLandNFT is 
    ERC721URIStorage, 
    AccessControl, 
    Pausable, 
    UUPSUpgradeable {
    // Implementation
}
```

#### 6.2.2 Métadonnées NFT
- **Standard:** ERC-721 Metadata JSON Schema
- **Extensions:** Custom fields pour foncier

```json
{
  "name": "Titre Foncier #12345/R",
  "description": "Villa à Casablanca - Anfa",
  "image": "ipfs://Qm.../preview.jpg",
  "external_url": "https://safeland.ma/property/12345",
  "attributes": [
    {"trait_type": "Type", "value": "Villa"},
    {"trait_type": "Surface", "value": 250, "display_type": "number"},
    {"trait_type": "Ville", "value": "Casablanca"},
    {"trait_type": "Quartier", "value": "Anfa"},
    {"trait_type": "Date Création", "value": 1739836800, "display_type": "date"}
  ],
  "properties": {
    "titreFoncier": "12345/R",
    "cadastralReference": "SEC-1234-PARCEL-5678",
    "legalDocuments": "ipfs://Qm.../documents.zip"
  }
}
```

#### 6.2.3 API
- **Style:** REST uniquement (OpenAPI 3.0 / Swagger)
- **Versioning:** URI versioning (/api/v1/)
- **Authentication:** JWT Bearer (MetaMask nonce-challenge login)
- **Rate Limiting:** 100 req / 15 min par IP
- **Documentation live:** Swagger UI à `/api/docs`

### 6.3 Environnements

#### 6.3.1 Développement (Local)
- Hardhat Network
- Base de données locale
- IPFS local node
- Mock services gouvernementaux

#### 6.3.2 Staging (Test)
- Polygon Mumbai Testnet
- Base de données staging
- Pinata IPFS testnet
- Services gouvernementaux sandbox

#### 6.3.3 Production
- Polygon Mainnet
- Cluster PostgreSQL redondant
- IPFS production cluster
- Intégration systèmes réels

### 6.4 Performance

#### 6.4.1 Objectifs
- **Temps de réponse API:** < 200ms (p95)
- **Création NFT:** < 5 secondes
- **Transfert:** < 10 secondes
- **Consultation:** < 100ms
- **Disponibilité:** 99.9% uptime

#### 6.4.2 Scalabilité
- Support de 10,000+ NFT simultanés
- 100+ transactions/jour
- 1,000+ utilisateurs actifs
- Croissance: +200% annual

---

## 7. Architecture Système

### 7.1 Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                      UTILISATEURS                            │
├───────────┬─────────────┬──────────────┬───────────────────┤
│  Agents   │  Notaires   │ Propriétaires│   Juges           │
│  ANCFCC   │  Certifiés  │              │   (Justice)       │
└─────┬─────┴──────┬──────┴──────┬───────┴───────┬───────────┘
      │            │             │               │
      └────────────┴─────────────┴───────────────┘
                     │
      ┌──────────────▼───────────────┐
      │   FRONTEND (Next.js 14)      │
      │   - App Router               │
      │   - Tailwind CSS             │
      │   - ethers.js + MetaMask     │
      │   - WalletContext            │
      │   Pages: Dashboard, NFT,     │
      │   Escrow, Fridda, Stats      │
      └──────────────┬───────────────┘
                     │
      ┌──────────────▼───────────────┐
      │    API BACKEND (Express.js)  │
      │   - Auth JWT (MetaMask sig)  │
      │   - Rate Limiting            │
      │   - Swagger UI (/api/docs)   │
      │   - CORS + Helmet            │
      └──────────────┬───────────────┘
                     │
      ┌──────────────▼───────────────────────┐
      │     APPLICATION LAYER (Node.js)      │
      ├──────────────────────────────────────┤
      │  Routes:                             │
      │  - /api/auth     (nonce + login)     │
      │  - /api/properties (CRUD NFT)        │
      │  - /api/escrow   (deals lifecycle)   │
      │  - /api/fridda   (succession)        │
      │  - /api/ipfs     (upload/download)   │
      └────┬─────────────────────────┬───────┘
           │                         │
    ┌──────▼─────────┐      ┌───────▼────────────┐
    │   IPFS         │      │    BLOCKCHAIN      │
    ├────────────────┤      ├────────────────────┤
    │  Pinata        │      │  Hardhat / Polygon │
    │  - Documents   │      │  5 Smart Contracts │
    │  - Metadata    │      │  (UUPS Proxies)    │
    │  - Media       │      │  - SafeLandNFT     │
    │                │      │  - SafeLandRegistry│
    │                │      │  - SafeLandEscrow  │
    │                │      │  - SafeLandFridda  │
    │                │      │  - SafeLandJustice │
    └────────────────┘      └────────────────────┘
```

### 7.2 Architecture Smart Contracts (5 contrats UUPS)

```
┌─────────────────────────────────────┐
│   SafeLandJustice.sol               │
│   - Multi-sig judiciaire (2/N)      │
│   - Freeze / Override / Recovery    │
│   - Rôle: JUDGE_ROLE                │
└──────────────┬──────────────────────┘
               │ appelle freezeByJustice
               │ / justiceOverride
┌──────────────▼──────────────────────┐
│   SafeLandNFT.sol (ERC-721)         │
│   - Titre foncier tokenisé          │
│   - PropertyData + Encumbrance      │
│   - Travel Lock, Safe-Lock, Panic   │
│   - Rôles: ADMIN, AGENT, NOTARY,    │
│     JUSTICE, UPGRADER                │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────────┐
    │                         │
┌───▼──────────────┐  ┌──────▼─────────────┐
│ SafeLandEscrow   │  │ SafeLandFridda     │
│ .sol             │  │ .sol (ERC-1155)    │
│ - Escrow atomique│  │ - Succession engine│
│ - Répartition    │  │ - 24 shares        │
│   fiscale auto   │  │ - Proposition/Vote │
│ - 4% DGI         │  │ - Gouvernance      │
│ - 1% ANCFCC      │  │   héritiers        │
│ - 95% vendeur    │  │                    │
└──────────────────┘  └────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   SafeLandRegistry.sol              │
│   - Index par ville/propriétaire    │
│   - GlobalStats (compteurs)         │
│   - Recherche multi-critères        │
└─────────────────────────────────────┘
```

**Rôles AccessControl (implémentés) :**
| Rôle | Contrat(s) | Permissions |
|------|-----------|-------------|
| `DEFAULT_ADMIN_ROLE` | Tous | Grant/Revoke rôles |
| `ADMIN_ROLE` | NFT, Registry, Escrow, Fridda, Justice | Pause, config, lock/unlock |
| `AGENT_ROLE` | NFT, Registry | Créer, modifier, transférer NFT |
| `NOTARY_ROLE` | NFT, Escrow, Fridda | Valider deals, finaliser successions |
| `JUSTICE_ROLE` | NFT | Freeze, burn/remint |
| `JUDGE_ROLE` | Justice | Proposer/signer/exécuter actions |
| `UPGRADER_ROLE` | NFT | Autoriser upgrades UUPS |

### 7.3 Flux de Données

#### 7.3.1 Création d'un NFT Foncier
```
Agent ANCFCC → Frontend → API
                          ↓
                    Validate Input
                          ↓
                    Upload IPFS (Documents)
                          ↓
                    Store Metadata (DB)
                          ↓
                    Call Smart Contract
                    (SafeLandNFT.mint)
                          ↓
                    Transaction Blockchain
                          ↓
                    Wait Confirmation
                          ↓
                    Update DB (tokenId)
                          ↓
                    Send Notification
                          ↓
                    Return Success
```

#### 7.3.2 Transfert de Propriété
```
Notaire → Initie Transaction
            ↓
      Vérifications (Backend)
      - Propriétaire valide
      - Pas de charges bloquantes
      - Documents complets
            ↓
      Génération Contrat
            ↓
      Signatures Numériques
      (Vendeur + Acheteur)
            ↓
      Validation ANCFCC
            ↓
      Appel Smart Contract
      (SafeLandNFT.transfer)
            ↓
      Escrow (si paiement)
            ↓
      Transfert NFT
            ↓
      Mise à jour Registre
            ↓
      Notification Parties
            ↓
      Génération Certificat
```

### 7.4 Sécurité Architecture

#### 7.4.1 Niveaux de Sécurité

**Niveau 1: Périphérie**
- WAF (Web Application Firewall)
- DDoS Protection (CloudFlare)
- SSL/TLS (Certificats)
- Rate Limiting

**Niveau 2: Application**
- Authentication JWT
- Authorization RBAC
- Input Validation
- SQL Injection Prevention
- XSS Protection

**Niveau 3: Smart Contracts**
- Access Control (Roles)
- Pausable Emergency
- Reentrancy Guards
- Integer Overflow Protection
- Formal Verification

**Niveau 4: Données**
- Encryption at Rest (AES-256)
- Encryption in Transit (TLS 1.3)
- Hashing (SHA-256)
- Key Management (AWS KMS)

---

## 8. Smart Contracts Solidity

> **Note :** Les contrats ci-dessous sont les versions **réellement implémentées et testées** (30/30 tests passants, compilés avec Solidity ^0.8.24, OpenZeppelin Contracts Upgradeable v5). Tous utilisent le pattern UUPS Proxy.

### 8.1 SafeLandNFT.sol — Titre Foncier ERC-721 (contrat principal, ~427 lignes)

**Héritage :** ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable

**Structures :**
- `PropertyData` — données du titre foncier (titreFoncier, propertyType, surface, city, district, GPS, documentHash…)
- `TransactionRecord` — historique (from, to, timestamp, txType, documentHash, notary)
- `Encumbrance` — charges (encType, creditor, amount, startDate, endDate, isActive)

**5 rôles AccessControl :** ADMIN_ROLE, AGENT_ROLE, NOTARY_ROLE, JUSTICE_ROLE, UPGRADER_ROLE

**Fonctions principales :**

| Fonction | Rôle requis | Description |
|----------|------------|-------------|
| `createProperty(to, titreFoncier, …, documentHash)` | AGENT | Mint un NFT foncier + stocke PropertyData + historique |
| `transferProperty(tokenId, to, txType, docHash, notary)` | AGENT | Transfert avec vérif locks + historique |
| `addEncumbrance(tokenId, encType, creditor, amount, endDate)` | AGENT | Ajout charge + auto-lock si hypothèque/saisie |
| `removeEncumbrance(tokenId, index)` | AGENT | Levée charge + auto-unlock si plus aucune charge bloquante |
| `lockTransfer(tokenId, reason)` | Owner ou ADMIN | Travel Lock (MRE) / Panic Button |
| `unlockTransfer(tokenId)` | Owner ou ADMIN | Déverrouillage |
| `freezeByJustice(tokenId, judgmentHash)` | JUSTICE | Gel judiciaire |
| `justiceOverride(tokenId, newOwner, judgmentHash, uri)` | JUSTICE | Burn & Remint (transfert forcé par jugement) |
| `pause() / unpause()` | ADMIN | Panic Button global |

**Vues :** `getProperty`, `getHistory`, `getEncumbrances`, `findByTitreFoncier`, `canTransfer`, `isLocked`, `isFrozenByJustice`, `totalMinted`

**Overrides OZ v5 :** `_update`, `_increaseBalance`, `tokenURI`, `supportsInterface`

### 8.2 SafeLandRegistry.sol — Registre Central (~120 lignes)

**Fonctionnalités :**
- Index par ville (`_propertiesByCity`) et par propriétaire (`_propertiesByOwner`)
- Compteurs globaux via struct `GlobalStats` (totalProperties, totalTransactions, totalValueSecured, fraudAttemptsPrevented)
- `registerProperty(tokenId, city, owner)` — enregistre une propriété dans l'index
- `recordTransaction(tokenId, from, to)` — met à jour l'index après transfert
- `getPropertiesByCity(city)` / `getPropertiesByOwner(owner)` — recherche multi-critères

### 8.3 SafeLandEscrow.sol — Séquestre Atomique (~252 lignes)

**Héritage :** AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable

**Struct `EscrowDeal` :** tokenId, seller, buyer, price, status (Created/SellerSigned/Funded/Completed/Cancelled), notary, dgiAmount, ancfccAmount, sellerNet

**Workflow :**
```
createDeal(NOTARY) → sellerSign(seller) → buyerDeposit(buyer, payable)
                                          → notaryComplete(NOTARY)
                   → cancelDeal (avant completion) → remboursement auto
```

**Répartition fiscale :**
- `DGI_BPS = 400` (4 %)
- `ANCFCC_BPS = 100` (1 %)
- `SELLER_BPS = 9500` (95 %)

**Events :** DealCreated, SellerSigned, BuyerFunded, NotaryValidated, DealCompleted, DealCancelled

### 8.4 SafeLandFridda.sol — Succession ERC-1155 (~291 lignes)

**Héritage :** ERC1155Upgradeable, AccessControlUpgradeable, UUPSUpgradeable

**24 parts successorales** fractionnées en tokens ERC-1155 (1 dossierId → 24 shares max)

**Struct `SuccessionDossier` :** nftTokenId, deceased, heirs[], shares[], status (Open/Distributed/Finalized)

**Struct `Proposal` :** dossierId, proposer, description, voteType (SELL/SPLIT/CUSTOM), votesFor, votesAgainst, deadline, executed

**Workflow :**
```
openSuccession(AGENT) → distributeShares(NOTARY, heirs, shares)
                      → finalizeSuccession(NOTARY) → mint ERC-1155
                      
createProposal(héritier) → vote(héritier, inFavor) → executeProposal(NOTARY)
```

### 8.5 SafeLandJustice.sol — Multi-sig Judiciaire (~227 lignes)

**Héritage :** AccessControlUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable

**Actions judiciaires :** FREEZE, OVERRIDE, SOCIAL_RECOVERY

**Struct `JusticeAction` :** actionType, tokenId, targetAddress, judgmentHash, proposedBy, signers[], requiredSignatures, executed, createdAt

**Struct `RecoveryRequest` :** tokenId, currentOwner, newWallet, justiceActionId, executed

**Workflow multi-sig (seuil configurable, défaut = 2) :**
```
proposeAction(JUDGE) → signAction(JUDGE, …) × N → executeAction(JUDGE)
                       ↓ appelle sur SafeLandNFT :
                         - freezeByJustice() si FREEZE
                         - justiceOverride() si OVERRIDE
```

### 8.6 Tests Automatisés

**Framework :** Hardhat + Chai + ethers.js v6 + OpenZeppelin test-helpers

**3 fichiers de tests — 30 tests / 30 passants :**

| Fichier | Tests | Couverture |
|---------|-------|-----------|
| `SafeLandNFT.test.js` | 12 | Création, transfert, encumbrances, locks, justice override, pause |
| `SafeLandEscrow.test.js` | 10 | Création deal, signer, deposit, complete, cancel, répartition fiscale |
| `SafeLandFridda.test.js` | 8 | Ouverture succession, distribution, finalisation, proposal, vote, execute |

**Gas Report :** Généré automatiquement à chaque `npx hardhat test` (hardhat-gas-reporter)

### 8.7 Script de Déploiement

**`scripts/deploy.js`** — Déploie les 5 contrats via UUPS proxy + configure les rôles croisés :
1. SafeLandNFT (proxy)
2. SafeLandRegistry (proxy) — reçoit ADMIN_ROLE
3. SafeLandEscrow (proxy) — reçoit NOTARY_ROLE, lie à SafeLandNFT
4. SafeLandFridda (proxy) — reçoit AGENT_ROLE + NOTARY_ROLE
5. SafeLandJustice (proxy) — reçoit JUSTICE_ROLE sur SafeLandNFT

---

## 9. Sécurité et Conformité

### 9.1 Sécurité Smart Contracts

#### 9.1.1 Audit de Sécurité
**Phase 1: Audit Interne**
- Tests unitaires (>95% coverage)
- Tests d'intégration
- Fuzzing (Echidna)
- Static analysis (Slither, Mythril)

**Phase 2: Audit Externe**
- Engagement d'une firme reconnue (ConsenSys Diligence, Trail of Bits, OpenZeppelin)
- Revue manuelle du code
- Tests de pénétration
- Rapport public

#### 9.1.2 Vulnérabilités Prévenues
- ✅ Reentrancy (ReentrancyGuard)
- ✅ Integer Overflow/Underflow (Solidity ^0.8)
- ✅ Front-running (ordre de transactions moins critique)
- ✅ Access Control (roles stricts)
- ✅ Denial of Service (gas limits)
- ✅ Signature Replay (nonces)

#### 9.1.3 Mécanismes d'Urgence
- **Pause Contract**: Arrêt d'urgence par admin
- **Upgrade Path**: UUPS pour correctifs critiques
- **Multi-sig**: Validation à plusieurs pour actions sensibles
- **Timelock**: Délai avant application de changements majeurs

### 9.2 Sécurité Application

#### 9.2.1 Authentification
- **Multi-Factor Authentication (MFA)**
  - OTP via SMS ou App (Google Authenticator)
  - Obligatoire pour agents et notaires
  
- **Wallet Authentication**
  - Signature cryptographique Ethereum
  - Message challenge unique par session
  - Vérification on-chain du rôle

- **Session Management**
  - JWT avec expiration courte (30 min)
  - Refresh tokens sécurisés
  - Invalidation immédiate au logout
  - Détection de sessions multiples

#### 9.2.2 Autorisation
- **Role-Based Access Control (RBAC)**
  ```
  Super Admin → Tout
  Agent Niveau 2 → Créer, Modifier, Transférer
  Agent Niveau 1 → Créer, Consulter
  Notaire → Initier Transaction, Consulter
  Propriétaire → Consulter Ses Biens
  Public → Vérification Authenticité
  ```

- **Permissions Granulaires**
  - CRUD sur ressources spécifiques
  - Validation multi-niveau pour actions critiques
  - Logs de toutes les autorisations

#### 9.2.3 Protection des Données

**Données Sensibles:**
- Identité (CIN, Nom, Prénom)
- Adresse complète
- Informations financières

**Mesures:**
- Chiffrement AES-256 en base
- Hashing irréversible pour identifiants
- PII (Personally Identifiable Information) jamais on-chain
- Zero-knowledge proofs pour vérifications

**Exemple:**
```
On-Chain: Hash(CIN) = 0x7a8b9c...
Off-Chain (DB): CIN_encrypted = AES_256(CIN, key)
Vérification: Hash(CIN_saisie) === Hash_onchain
```

#### 9.2.4 Protection des Communications
- **TLS 1.3** pour toutes les communications HTTPS
- **Certificate Pinning** sur mobile
- **VPN** pour accès admin
- **API Key Rotation** mensuelle

### 9.3 Conformité Réglementaire

#### 9.3.1 Cadre Légal Marocain

**Loi 39-08 (Conservation Foncière)**
- Reconnaissance des titres numériques
- Équivalence avec titres physiques
- Validité juridique des signatures électroniques

**Loi 09-08 (Protection des Données)**
- Consentement explicite pour collecte
- Droit d'accès, rectification, suppression
- Notification en cas de breach (<72h)
- Désignation d'un DPO (Data Protection Officer)

**Loi 53-05 (Échange Électronique)**
- Signature électronique qualifiée
- Horodatage certifié
- Archivage légal (10 ans)

#### 9.3.2 Gestion RGPD (si extension EU)
- Droit à l'oubli (difficile blockchain → solution off-chain)
- Portabilité des données
- Limitation de la finalité
- Privacy by Design

#### 9.3.3 KYC/AML
**Know Your Customer**
- Vérification d'identité stricte (CIN + Selfie)
- Contrôle listes sanctions internationales
- Due diligence renforcée >10M MAD

**Anti-Money Laundering**
- Déclaration transactions suspectes
- Monitoring patterns anormaux
- Collaboration avec UTRF (Unité de Traitement du Renseignement Financier)

#### 9.3.4 Audit et Traçabilité
- Conservation logs 10 ans (exigence légale)
- Audit trail immuable
- Rapports trimestriels aux autorités
- Accès réservé aux juridictions compétentes

### 9.4 Sauvegarde et Reprise

#### 9.4.1 Stratégie de Backup
**Base de Données:**
- Backup complet quotidien
- Backup incrémental horaire
- Rétention 90 jours
- Stockage géo-redondant (3 régions)

**Blockchain:**
- Nœuds archivés multiples
- Snapshots hebdomadaires
- IPFS pinning permanent

**Disaster Recovery:**
- RTO (Recovery Time Objective): 4 heures
- RPO (Recovery Point Objective): 1 heure
- Site de secours actif (hot standby)
- Tests trimestriels

#### 9.4.2 Plan de Continuité
- Basculement automatique sur cluster secondaire
- Dégradation gracieuse des services
- Communication crisis management
- Restauration progressive

---

## 10. Intégration Gouvernementale

### 10.1 Systèmes à Intégrer

#### 10.1.1 ANCFCC (Agence Nationale Conservation Foncière)
**Système Existant:** Base de données legacy (probablement Oracle/SQL Server)

**Points d'Intégration:**
- Import initial des titres fonciers existants
- Synchronisation bidirectionnelle
- Validation croisée des transactions
- Export de rapports réglementaires

**API à Développer:**
```
POST /api/ancfcc/sync/titre-foncier
GET /api/ancfcc/validate/{titreFoncier}
POST /api/ancfcc/report/monthly
GET /api/ancfcc/search
```

**Méthode:**
- API REST avec authentification OAuth 2.0
- VPN site-to-site sécurisé
- Format d'échange: JSON + XML (legacy)
- Webhook pour notifications temps réel

#### 10.1.2 Système d'Identité Nationale
**Objectif:** Vérification automatique de l'identité des citoyens

**Données à Vérifier:**
- CIN (Carte Identité Nationale)
- Nom complet
- Date de naissance
- Adresse

**Intégration:**
- API gouvernementale sécurisée
- Protocole SAML ou OpenID Connect
- Vérification biométrique (optionnel Phase 2)

#### 10.1.3 Cadastre National
**Objectif:** Enrichissement des données géographiques

**Données:**
- Plans cadastraux numériques
- Coordonnées GPS précises
- Limites parcellaires
- Zonage urbain

**Format:**
- GeoJSON
- Shapefiles
- KML

#### 10.1.4 Système Judiciaire
**Objectif:** Gestion des litiges et saisies

**Intégrations:**
- Notification automatique en cas de litige
- Blocage de transactions sur ordre judiciaire
- Accès consultation pour juges
- Export de preuves blockchain

### 10.2 Workflow d'Intégration B2G

#### 10.2.1 Phase d'Onboarding Gouvernement

**Étape 1: Signature Convention (Mois 1)**
- Contrat cadre B2G
- Définition SLA (Service Level Agreement)
- Clauses de confidentialité
- Propriété intellectuelle

**Étape 2: Environnement Pilote (Mois 2-3)**
- Déploiement sandbox
- Migration de 100 titres tests
- Formation équipe pilote (20 agents)
- Tests d'acceptation

**Étape 3: Déploiement Progressif (Mois 4-12)**
- Phase 1: Casablanca (10,000 titres)
- Phase 2: Rabat + Marrakech (20,000 titres)
- Phase 3: Autres villes (100,000+ titres)

**Étape 4: Généralisation (Année 2)**
- Déploiement national
- Intégration complète systèmes
- Formation massive (500+ agents)

#### 10.2.2 Processus de Migration de Données

```
┌────────────────────────────────────────┐
│  Système Legacy ANCFCC                 │
│  - Oracle DB                           │
│  - 5M+ titres fonciers                 │
└───────────────┬────────────────────────┘
                │
                │ Extract (ETL)
                ▼
┌────────────────────────────────────────┐
│  Transformation Layer                  │
│  - Nettoyage données                   │
│  - Normalisation format                │
│  - Enrichissement GPS                  │
│  - Validation intégrité                │
└───────────────┬────────────────────────┘
                │
                │ Batch Processing
                ▼
┌────────────────────────────────────────┐
│  SafeLand Platform                     │
│  1. Upload documents IPFS              │
│  2. Création NFT (batch 1000/jour)     │
│  3. Validation blockchain              │
│  4. Notification propriétaires         │
└────────────────────────────────────────┘
```

**Script Migration:**
```javascript
// scripts/migrate-legacy-data.js
async function migrateBatch(titres) {
  for (const titre of titres) {
    try {
      // 1. Upload documents
      const ipfsHash = await uploadToIPFS(titre.documents);
      
      // 2. Prepare metadata
      const metadata = prepareMetadata(titre, ipfsHash);
      
      // 3. Create NFT
      const tx = await safeLandNFT.createProperty(
        titre.owner, titre.numero, titre.type,
        titre.surface, titre.city, titre.district,
        titre.lat, titre.lng, metadata.uri
      );
      
      await tx.wait();
      
      // 4. Log success
      console.log(`✅ Migrated: ${titre.numero}`);
      await logMigration(titre.numero, tx.hash);
      
    } catch (error) {
      console.error(`❌ Failed: ${titre.numero}`, error);
      await logError(titre.numero, error);
    }
  }
}
```

### 10.3 Portail Gouvernemental

#### 10.3.1 Interface ANCFCC

**Dashboard Principal:**
- Vue d'ensemble (KPI)
- NFT créés aujourd'hui
- Transactions en attente
- Alertes système

**Modules:**

1. **Gestion des Titres**
   - Recherche avancée
   - Création NFT
   - Modification NFT
   - Historique complet

2. **Gestion des Transactions**
   - File d'attente validation
   - Approbation/Rejet
   - Suivi en temps réel
   - Génération certificats

3. **Gestion des Utilisateurs**
   - Agents ANCFCC
   - Notaires certifiés
   - Permissions
   - Audit logs

4. **Rapports et Statistiques**
   - Rapports mensuels
   - Tableaux de bord
   - Export données
   - Analytics avancés

5. **Administration Système**
   - Configuration
   - Paramètres blockchain
   - Maintenance
   - Support

#### 10.3.2 Interface Notaires

**Fonctionnalités:**
- Consultation titres fonciers
- Initiation vente/achat
- Génération contrats
- Signature électronique
- Suivi dossiers

**Restrictions:**
- Accès limité aux dossiers actifs
- Pas de modification directe
- Audit trail complet

### 10.4 Support et Formation

#### 10.4.1 Programme de Formation

**Formation Initiale (5 jours):**
- Jour 1: Introduction blockchain et NFT
- Jour 2: Plateforme SafeLand (features)
- Jour 3: Création et gestion NFT (pratique)
- Jour 4: Transactions et cas complexes
- Jour 5: Dépannage et support

**Formation Continue:**
- Webinaires mensuels
- Documentation en ligne
- Vidéos tutoriels
- FAQ dynamique

**Certification:**
- Examen théorique
- Examen pratique
- Certificat officiel
- Renouvellement annuel

#### 10.4.2 Support Technique

**Niveaux de Support:**

**Niveau 1: Helpdesk (8h-18h)**
- Hotline téléphonique
- Email support
- Chat en ligne
- Temps de réponse: 2h

**Niveau 2: Experts (24/7)**
- Issues techniques complexes
- Bugs critiques
- Escalade depuis N1
- Temps de réponse: 1h

**Niveau 3: Développeurs (Urgence)**
- Incidents majeurs
- Patches d'urgence
- Coordination crisis
- Temps de réponse: 30min

**SLA Garantis:**
- Disponibilité: 99.9%
- Uptime mensuel: 99.95%
- Temps de résolution P1: 4h
- Temps de résolution P2: 24h

---

## 11. Interface Utilisateur

### 11.1 Architecture Frontend (implémenté)

**Framework:** Next.js 14 (App Router)
**Styling:** Tailwind CSS v3
**Icônes:** lucide-react (Shield, Home, FileText, Users, Scale, BarChart3)
**Web3:** ethers.js v6 direct (window.ethereum / MetaMask)
**State:** React Context API (WalletContext)
**Notifications:** react-hot-toast

> **Phase 2 prévue :** shadcn/ui, wagmi + RainbowKit, Zustand, Mapbox GL JS

### 11.2 Pages Implémentées

#### 11.2.1 Dashboard (page.js — route `/`)
**6 cartes modules** avec icônes lucide-react :
- Sécurité Foncière (Shield) — vue d'ensemble
- Propriétés (Home) — gestion NFT
- Escrow (FileText) — séquestres
- Succession FRIDDA (Users) — héritage
- Justice (Scale) — module judiciaire
- Statistiques (BarChart3) — analytics
```
┌────────────────────────────────────────────────┐
│  SafeLand - Dashboard                    [User]│
├────────────────────────────────────────────────┤
│  📊 Statistiques                               │
│  ┌──────────┬──────────┬──────────┬──────────┐│
│  │ Total NFT│Aujourd'hui│En Attente│ Complété ││
│  │  12,345  │    42     │    18    │   8,234  ││
│  └──────────┴──────────┴──────────┴──────────┘│
│                                                │
│  📈 Graphique des Transactions (30 jours)     │
│  [Graphique ligne]                             │
│                                                │
│  🔔 Alertes Récentes                           │
│  • Titre 12345/R - Transaction en attente     │
│  • Nouveau NFT créé - 67890/R                  │
│                                                │
│  🗺️ Carte Interactive                          │
│  [Mapbox avec pins des propriétés]            │
└────────────────────────────────────────────────┘
```

#### 11.2.2 Création de NFT
```
┌────────────────────────────────────────────────┐
│  Créer un Nouveau Titre Foncier NFT           │
├────────────────────────────────────────────────┤
│                                                │
│  Informations Générales                        │
│  ┌────────────────────────────────────┐       │
│  │ Numéro Titre Foncier: [12345/R   ]│       │
│  │ Type de Bien: [Villa ▼           ]│       │
│  │ Surface (m²): [250               ]│       │
│  └────────────────────────────────────┘       │
│                                                │
│  Localisation                                  │
│  ┌────────────────────────────────────┐       │
│  │ Ville: [Casablanca ▼             ]│       │
│  │ Quartier: [Anfa                  ]│       │
│  │ GPS: [33.5731, -7.5898] [📍 Map ]│       │
│  └────────────────────────────────────┘       │
│                                                │
│  Propriétaire                                  │
│  ┌────────────────────────────────────┐       │
│  │ CIN: [AB123456                   ]│       │
│  │ Nom: [El Alami Mohammed          ]│       │
│  │ Wallet: [0x742d...8f3a           ]│       │
│  │         [🔗 Connecter Wallet]     │       │
│  └────────────────────────────────────┘       │
│                                                │
│  Documents (Upload)                            │
│  📄 Titre Foncier (PDF) [Choisir fichier]     │
│  📄 Plan Cadastral (PDF) [Choisir fichier]    │
│  📷 Photos (JPG) [Choisir fichiers]            │
│                                                │
│  [Annuler]           [Créer NFT 🚀]           │
└────────────────────────────────────────────────┘
```

#### 11.2.3 Détails d'un NFT
```
┌────────────────────────────────────────────────┐
│  Titre Foncier #12345/R                  [✓]  │
├────────────────────────────────────────────────┤
│  ┌──────────┐  Villa - 250 m²                 │
│  │  Image   │  Casablanca, Anfa               │
│  │  3D      │  Propriétaire: 0x742d...8f3a    │
│  │          │  Créé le: 15/02/2026             │
│  └──────────┘  Validé par: Agent_ID_123       │
│                                                │
│  📋 Onglets                                    │
│  [Détails] [Historique] [Documents] [Carte]   │
│                                                │
│  ▼ Détails                                     │
│  • Token ID: 1                                 │
│  • Contrat: 0xABCD...1234                     │
│  • Network: Polygon                            │
│  • Standard: ERC-721                           │
│  • Metadata: ipfs://Qm...                      │
│                                                │
│  • Type: Villa                                 │
│  • Surface: 250 m²                             │
│  • Coordonnées: 33.5731, -7.5898              │
│  • Statut: ✅ Actif                            │
│                                                │
│  💼 Charges                                     │
│  • Aucune charge active                        │
│                                                │
│  ⚡ Actions                                     │
│  [Transférer] [Ajouter Charge] [Modifier]     │
│  [Exporter Certificat PDF]                     │
└────────────────────────────────────────────────┘
```

#### 11.2.4 Escrow (escrow/page.js — route `/escrow`)
- Création d'un nouveau deal (tokenId, seller, buyer, price)
- Liste des deals actifs avec statuts colorés
- Actions contextuelles : Sign, Deposit, Complete, Cancel

#### 11.2.5 Succession FRIDDA (fridda/page.js — route `/fridda`)
- Ouverture de dossier de succession
- Distribution des 24 parts entre héritiers
- Système de propositions et votes pondérés

#### 11.2.6 Statistiques (stats/page.js — route `/stats`)
- Total NFT créés
- Transactions complétées
- Valeur totale sécurisée
- Graphiques de tendances

#### 11.2.7 Composants partagés
- **Navbar** (`components/Navbar.js`) — Navigation + bouton "Connecter Wallet" MetaMask
- **WalletContext** (`context/WalletContext.js`) — Provider ethers.js, gestion account/signer/provider

### 11.3 Expérience Utilisateur (UX)

#### 11.3.1 Principes de Design
- **Simplicité**: Interface intuitive pour utilisateurs non-tech
- **Accessibilité**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first approach
- **Performance**: < 2s loading time
- **Offline**: Progressive Web App (PWA) pour fonctions de base

#### 11.3.2 Feedback Utilisateur
- Toast notifications pour succès/erreur
- Loaders pendant transactions blockchain
- Confirmations explicites avant actions irréversibles
- Tooltips pédagogiques

#### 11.3.3 Multilangue
- Français (principal)
- Arabe (Standard et Darija)
- Anglais (optionnel)

---

## 12. Planning et Livrables

### 12.1 Phases du Projet

#### **Phase 0: Initialisation (Mois 1)**
**Objectifs:**
- Constitution de l'équipe
- Setup infrastructure
- Définition architecture détaillée

**Livrables:**
- Document d'architecture technique
- Environnement de développement
- Repo Git configuré
- CI/CD pipeline

**Équipe:**
- 1 Chef de projet
- 1 Architecte blockchain
- 2 Développeurs Solidity
- 2 Développeurs Full-stack
- 1 DevOps
- 1 Designer UI/UX

---

#### **Phase 1: Développement Smart Contracts (Mois 2-3)**

**Sprints:**

**Sprint 1 (2 semaines): Core Contracts**
- SafeLandNFT.sol (base ERC-721)
- Tests unitaires (>80% coverage)
- Déploiement testnet local

**Sprint 2 (2 semaines): Advanced Features**
- SafeLandEscrow.sol (séquestre atomique)
- SafeLandFridda.sol (succession ERC-1155)
- Encumbrances logic + auto-lock
- Tests unitaires (>90% coverage)

**Sprint 3 (2 semaines): Registry & Justice**
- SafeLandRegistry.sol
- SafeLandJustice.sol (multi-sig judiciaire)
- Integration tests croisés
- Tests unitaires (>95% coverage)

**Sprint 4 (2 semaines): Audit & Deploy**
- Audit interne (Slither, Mythril)
- Gas optimization
- Déploiement Polygon Mumbai
- Documentation contracts

**Livrables Phase 1:**
- ✅ Smart contracts complets
- ✅ Tests (95%+ coverage)
- ✅ Documentation technique
- ✅ Déployé sur testnet
- ✅ Rapport audit interne

---

#### **Phase 2: Développement Backend (Mois 3-5)**

**Sprint 5 (2 semaines): API Core**
- Setup Express.js + helmet + cors + rate-limit
- Authentification JWT (MetaMask nonce-challenge)
- Blockchain service (ethers.js v6)
- Swagger/OpenAPI documentation

**Sprint 6 (2 semaines): Business Logic**
- Service création NFT
- Service transfert
- Service consultation
- IPFS integration

**Sprint 7 (2 semaines): Integrations**
- API ANCFCC mock
- Service identité
- Service notifications
- Webhooks

**Sprint 8 (2 semaines): Admin & Analytics**
- Dashboard API
- Rapports
- Logs et monitoring
- Documentation API (Swagger)

**Livrables Phase 2:**
- ✅ API REST complète
- ✅ Documentation Swagger
- ✅ Tests API (Postman collection)
- ✅ Integration avec blockchain
- ✅ Monitoring configuré

---

#### **Phase 3: Développement Frontend (Mois 5-7)**

**Sprint 9 (2 semaines): Setup & Auth**
- Setup Next.js 14 (App Router)
- Design system (Tailwind CSS v3)
- Connexion wallet (ethers.js + MetaMask)
- WalletContext + Navbar

**Sprint 10 (2 semaines): Pages Core**
- Dashboard
- Liste NFT
- Détails NFT
- Recherche

**Sprint 11 (2 semaines): Features Avancées**
- Création NFT (formulaire)
- Transfert de propriété
- Gestion charges
- Historique

**Sprint 12 (2 semaines): UX & Polish**
- Notifications (react-hot-toast)
- Pages Escrow et Fridda
- Page Statistiques
- Responsive mobile

**Livrables Phase 3:**
- ✅ Application web complète
- ✅ Interface responsive
- ✅ Tests E2E
- ✅ Documentation utilisateur

---

#### **Phase 4: Intégration & Tests (Mois 7-8)**

**Sprint 13 (2 semaines): Intégration Systèmes**
- API ANCFCC réelle
- Service identité nationale
- Tests d'intégration
- Migration données pilote

**Sprint 14 (2 semaines): Tests Utilisateurs**
- UAT (User Acceptance Testing)
- Tests de charge
- Tests de sécurité
- Corrections bugs

**Livrables Phase 4:**
- ✅ Intégrations complètes
- ✅ Rapport tests UAT
- ✅ Rapport tests performance
- ✅ Corrections appliquées

---

#### **Phase 5: Audit Externe & Sécurité (Mois 9)**

**Activités:**
- Audit smart contracts (firme externe)
- Pentest application web
- Audit sécurité infrastructure
- Corrections vulnérabilités
- Re-test

**Livrables Phase 5:**
- ✅ Rapport audit smart contracts
- ✅ Rapport pentest
- ✅ Certificat de conformité
- ✅ Corrections validées

---

#### **Phase 6: Déploiement Pilote (Mois 10)**

**Activités:**
- Déploiement production (Polygon Mainnet)
- Migration 100 titres fonciers (Casablanca)
- Formation 20 agents ANCFCC
- Support intensif

**Livrables Phase 6:**
- ✅ Plateforme en production
- ✅ 100 NFT créés
- ✅ Agents formés
- ✅ Documentation complète

---

#### **Phase 7: Déploiement Progressif (Mois 11-12)**

**Mois 11:**
- Extension Rabat (5,000 titres)
- Formation 50 agents supplémentaires
- Monitoring et optimisations

**Mois 12:**
- Extension Marrakech (5,000 titres)
- Formation 50 agents supplémentaires
- Bilan et préparation Phase 2

**Livrables Phase 7:**
- ✅ 10,000+ NFT créés
- ✅ 120 agents formés
- ✅ Support stable
- ✅ Rapport annuel

---

### 12.2 Gantt Chart (Simplifié)

```
Mois:  1  2  3  4  5  6  7  8  9  10 11 12
       ════════════════════════════════════
Init   █
Smart     ████
Backend      ██████
Frontend        ██████
Integ.             ████
Audit                 ██
Pilot                   ██
Deploy                    ████
```

### 12.3 Milestones Clés

| Milestone | Date | Description |
|-----------|------|-------------|
| M1 | Fin Mois 1 | Initialisation complète |
| M2 | Fin Mois 3 | Smart contracts déployés testnet |
| M3 | Fin Mois 5 | Backend API opérationnel |
| M4 | Fin Mois 7 | Frontend MVP complet |
| M5 | Fin Mois 9 | Audit externe validé |
| M6 | Fin Mois 10 | Pilote réussi (100 NFT) |
| M7 | Fin Mois 12 | Déploiement 3 villes (10K NFT) |

---

## 13. Ressources et Budget

### 13.1 Équipe Projet

#### 13.1.1 Profils et Rôles

**Management (2 personnes)**
- 1 Chef de Projet Senior
  - Coordination générale
  - Relation client (ANCFCC)
  - Budget et planning
  - Salaire: 20,000 MAD/mois

- 1 Product Owner
  - Définition features
  - Backlog management
  - UAT coordination
  - Salaire: 15,000 MAD/mois

**Développement Blockchain (3 personnes)**
- 1 Architecte Blockchain Senior
  - Architecture smart contracts
  - Audit interne
  - Expertise Solidity/Hardhat
  - Salaire: 25,000 MAD/mois

- 2 Développeurs Solidity
  - Développement smart contracts
  - Tests unitaires
  - Gas optimization
  - Salaire: 18,000 MAD/mois chacun

**Développement Full-Stack (4 personnes)**
- 2 Développeurs Backend (Node.js)
  - API REST/GraphQL
  - Intégrations
  - Base de données
  - Salaire: 16,000 MAD/mois chacun

- 2 Développeurs Frontend (React/Next.js)
  - Interface utilisateur
  - Web3 integration
  - UX implementation
  - Salaire: 16,000 MAD/mois chacun

**Infrastructure & DevOps (2 personnes)**
- 1 DevOps Engineer
  - CI/CD
  - Infrastructure cloud
  - Monitoring
  - Salaire: 18,000 MAD/mois

- 1 Security Engineer
  - Sécurité application
  - Pentest
  - Compliance
  - Salaire: 20,000 MAD/mois

**Design & QA (2 personnes)**
- 1 Designer UI/UX
  - Maquettes
  - Prototypes
  - Design system
  - Salaire: 12,000 MAD/mois

- 1 QA Engineer
  - Tests manuels/auto
  - Tests de charge
  - Reporting bugs
  - Salaire: 12,000 MAD/mois

**TOTAL ÉQUIPE: 14 personnes**

### 13.2 Budget Détaillé (12 mois)

#### 13.2.1 Ressources Humaines

| Poste | Nombre | Salaire/mois | Durée | Total |
|-------|--------|--------------|-------|-------|
| Chef de Projet | 1 | 20,000 | 12 mois | 240,000 |
| Product Owner | 1 | 15,000 | 12 mois | 180,000 |
| Architecte Blockchain | 1 | 25,000 | 12 mois | 300,000 |
| Dev Solidity | 2 | 18,000 | 12 mois | 432,000 |
| Dev Backend | 2 | 16,000 | 12 mois | 384,000 |
| Dev Frontend | 2 | 16,000 | 12 mois | 384,000 |
| DevOps | 1 | 18,000 | 12 mois | 216,000 |
| Security Engineer | 1 | 20,000 | 12 mois | 240,000 |
| Designer UI/UX | 1 | 12,000 | 12 mois | 144,000 |
| QA Engineer | 1 | 12,000 | 12 mois | 144,000 |
| **Sous-total RH** | | | | **2,664,000 MAD** |

#### 13.2.2 Infrastructure & Services Cloud

| Service | Fournisseur | Coût/mois | Durée | Total |
|---------|-------------|-----------|-------|-------|
| Serveurs (EC2/VM) | AWS/Azure | 8,000 | 12 | 96,000 |
| Base de données | RDS/MongoDB Atlas | 3,000 | 12 | 36,000 |
| IPFS Pinning | Pinata | 2,000 | 12 | 24,000 |
| CDN | CloudFlare | 1,000 | 12 | 12,000 |
| Monitoring | Grafana Cloud | 1,500 | 12 | 18,000 |
| Backup & Storage | S3/Azure Blob | 2,000 | 12 | 24,000 |
| **Sous-total Infra** | | | | **210,000 MAD** |

#### 13.2.3 Blockchain & Gas Fees

| Item | Détails | Coût |
|------|---------|------|
| Déploiement contrats | Polygon Mainnet (5 contrats) | 5,000 |
| Gas fees pilote | 100 NFT + transactions | 10,000 |
| Gas fees déploiement | 10,000 NFT création | 100,000 |
| Nœud RPC | Infura/Alchemy (année) | 50,000 |
| **Sous-total Blockchain** | | **165,000 MAD** |

#### 13.2.4 Audit & Sécurité

| Service | Détails | Coût |
|---------|---------|------|
| Audit Smart Contracts | Firme externe (ConsenSys) | 400,000 |
| Pentest Application | Security firm | 150,000 |
| Audit Infrastructure | DevSecOps review | 100,000 |
| Bug Bounty Program | 3 mois | 50,000 |
| **Sous-total Audit** | | **700,000 MAD** |

#### 13.2.5 Licences & Outils

| Outil | Utilisation | Coût/an |
|-------|-------------|---------|
| GitHub Enterprise | Version control | 30,000 |
| Figma Professional | Design | 15,000 |
| Notion/Jira | Project management | 20,000 |
| Postman Enterprise | API testing | 15,000 |
| Sentry | Error tracking | 25,000 |
| **Sous-total Licences** | | **105,000 MAD** |

#### 13.2.6 Formation & Documentation

| Item | Détails | Coût |
|------|---------|------|
| Formation agents (120 agents) | 5 jours × 2,000 MAD/agent | 240,000 |
| Matériel formation | Manuels, vidéos | 50,000 |
| Certification blockchain | Équipe technique | 30,000 |
| **Sous-total Formation** | | **320,000 MAD** |

#### 13.2.7 Divers

| Item | Détails | Coût |
|------|---------|------|
| Déplacements | Casablanca/Rabat meetings | 80,000 |
| Marketing & Communication | Lancement plateforme | 100,000 |
| Légal & Compliance | Contrats, DPO | 80,000 |
| Contingence (10%) | Imprévus | 442,400 |
| **Sous-total Divers** | | **702,400 MAD** |

---

### 13.3 Budget Total

| Catégorie | Montant (MAD) | % Total |
|-----------|---------------|---------|
| Ressources Humaines | 2,664,000 | 56.7% |
| Infrastructure & Cloud | 210,000 | 4.5% |
| Blockchain & Gas | 165,000 | 3.5% |
| Audit & Sécurité | 700,000 | 14.9% |
| Licences & Outils | 105,000 | 2.2% |
| Formation | 320,000 | 6.8% |
| Divers & Contingence | 702,400 | 15.0% |
| **TOTAL** | **4,866,400 MAD** | **100%** |

**≈ 486,640 EUR** (au taux 1 EUR = 10 MAD)

---

### 13.4 Modèle de Revenus (B2G)

#### 13.4.1 Contrat Année 1

**Licence d'Utilisation Annuelle:**
- Coût: 2,000,000 MAD/an
- Inclus: Support, maintenance, mises à jour

**Frais par Transaction:**
- 50 MAD par création NFT
- 100 MAD par transfert de propriété
- Estimation: 10,000 NFT + 1,000 transferts/an
- Revenus: (10,000 × 50) + (1,000 × 100) = 600,000 MAD

**Formation:**
- 2,000 MAD/agent/session
- 120 agents formés = 240,000 MAD

**Revenus Année 1: 2,840,000 MAD**

**ROI Année 1: 2,840,000 - 4,866,400 = -2,026,400 MAD** (déficit normal année de lancement)

#### 13.4.2 Projection Année 2

**Licence:** 2,500,000 MAD (augmentation 25%)
**Transactions:** 50,000 NFT + 5,000 transferts = 3,000,000 MAD
**Support & Maintenance:** 500,000 MAD
**Total: 6,000,000 MAD**

**Coûts Année 2:**
- Équipe réduite (10 personnes): 1,800,000 MAD
- Infrastructure: 300,000 MAD
- Autres: 400,000 MAD
- **Total: 2,500,000 MAD**

**Profit Année 2: 3,500,000 MAD** ✅

**ROI Cumulé: 3,500,000 - 2,026,400 = +1,473,600 MAD** ✅

---

## 14. Risques et Mitigation

### 14.1 Risques Techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Vulnérabilité Smart Contracts** | Moyenne | Critique | Audit externe, bug bounty, tests exhaustifs |
| **Congestion réseau Polygon** | Faible | Moyen | Nœud dédié, Layer 2 alternatif prévu |
| **Perte de clés privées** | Faible | Critique | Multi-sig, backup sécurisé, hardware wallets |
| **Bug critique production** | Moyenne | Élevé | Tests rigoureux, feature flags, rollback plan |
| **Performance IPFS** | Moyenne | Moyen | Pinning redondant, CDN, backup Arweave |
| **Scalabilité base données** | Moyenne | Moyen | Sharding, réplication, monitoring proactif |

### 14.2 Risques Organisationnels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Résistance au changement** | Élevée | Élevé | Formation intensive, change management, champions |
| **Intégration systèmes legacy** | Élevée | Élevé | POC précoce, équipe dédiée, API adapter layer |
| **Turnover équipe** | Moyenne | Moyen | Documentation, pair programming, rétention incentives |
| **Retard planning** | Élevée | Moyen | Buffer temps (20%), Agile sprints, priorisation MVP |
| **Budget dépassé** | Moyenne | Moyen | Contingence 10%, suivi hebdomadaire, scope control |

### 14.3 Risques Juridiques/Réglementaires

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Cadre légal inadapté** | Moyenne | Critique | Lobbying, partenariat législateur, legal advisory |
| **Non-conformité GDPR/Data** | Faible | Élevé | DPO dédié, privacy by design, audit conformité |
| **Contestation validité NFT** | Faible | Critique | Validation notariale hybride, backup papier phase 1 |
| **Cyberattaque** | Moyenne | Critique | WAF, DDoS protection, insurance cyber, incident response plan |

### 14.4 Risques Adoption

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Faible adoption citoyens** | Moyenne | Moyen | Campagne communication, incentives, simplification UX |
| **Manque confiance blockchain** | Élevée | Élevé | Pédagogie, transparence, certification officielle |
| **Concurrence alternative** | Faible | Moyen | Innovation continue, partenariat exclusif B2G |

### 14.5 Plan de Continuité d'Activité (PCA)

#### 14.5.1 Scénarios de Crise

**Scénario 1: Attaque DDoS**
- Détection: Monitoring automatique (>1000 req/s)
- Action: Activation CloudFlare DDoS protection
- Délai: <5 minutes
- Communication: Status page publique

**Scénario 2: Bug Critique Smart Contract**
- Détection: Alerte monitoring blockchain
- Action: Pause contract (emergency function)
- Escalade: Équipe core + auditeurs externes
- Correctif: Déploiement upgrade UUPS
- Délai: <4 heures

**Scénario 3: Panne Base de Données**
- Détection: Health check failed
- Action: Failover automatique sur réplica
- Restauration: Backup le plus récent (<1h)
- Délai: <15 minutes

**Scénario 4: Compromission Compte Admin**
- Détection: Alerte connexion suspecte
- Action: Révocation immédiate access, investigation
- Audit: Forensics complet
- Communication: Notification autorités + utilisateurs

---

## 15. Critères de Succès

### 15.1 Objectifs Quantitatifs

#### Année 1
- ✅ **10,000+ NFT créés** (titres fonciers tokenisés)
- ✅ **1,000+ transactions** complétées avec succès
- ✅ **120 agents formés** et certifiés
- ✅ **99.9% uptime** de la plateforme
- ✅ **<10 secondes** temps moyen de transaction
- ✅ **0 vulnérabilités critiques** non corrigées
- ✅ **Audit externe réussi** avec score >90%

#### Année 2
- 🎯 100,000 NFT créés
- 🎯 10,000 transactions
- 🎯 Déploiement national (12+ villes)
- 🎯 500 agents formés

### 15.2 Objectifs Qualitatifs

- ✅ **Satisfaction utilisateur** >80% (NPS score)
- ✅ **Réduction fraude** de 70%
- ✅ **Réduction temps traitement** de 60%
- ✅ **Reconnaissance juridique** officielle des NFT
- ✅ **Certification ISO 27001** (sécurité)
- ✅ **Prix/Award** innovation publique

### 15.3 KPI Dashboard

| Indicateur | Objectif An 1 | Mesure |
|------------|---------------|--------|
| Nombre NFT actifs | 10,000 | Compteur blockchain |
| Transactions/mois | 100 | Compteur smart contract |
| Temps moyen création NFT | <5 min | Métrique backend |
| Taux d'erreur | <1% | Logs application |
| Satisfaction agents | >85% | Survey trimestriel |
| Coût par transaction | <200 MAD | Calcul total/volume |
| Réduction paperasse | -80% | Audit ANCFCC |

---

## 16. Conclusion et Prochaines Étapes

### 16.1 Synthèse

Le projet **SafeLand** représente une **transformation digitale majeure** du secteur foncier marocain, en tirant parti de la technologie blockchain et des NFT pour:

1. **Sécuriser** les titres de propriété de manière immuable
2. **Simplifier** les processus administratifs
3. **Réduire** la fraude et la corruption
4. **Moderniser** l'administration foncière
5. **Renforcer** la confiance citoyenne

Ce cahier des charges définit une **roadmap complète** sur 12 mois, avec un budget de **4.9M MAD**, mobilisant une équipe de **14 experts**, et visant la création de **10,000 NFT** la première année.

Le modèle **B2G (Business to Government)** garantit un partenariat stratégique avec l'État marocain, avec un **ROI positif dès l'année 2**.

### 16.2 Prochaines Étapes Immédiates

**Semaine 1-2:**
1. ✅ Validation du cahier des charges avec ANCFCC
2. ✅ Signature du contrat cadre
3. ✅ Constitution de l'équipe projet
4. ✅ Setup environnement de développement

**Semaine 3-4:**
1. ✅ Kickoff meeting avec toutes les parties prenantes
2. ✅ Architecture technique détaillée
3. ✅ Setup CI/CD pipeline
4. ✅ Début Sprint 1 (Smart Contracts)

**Mois 2:**
1. ✅ Déploiement premiers contrats sur testnet
2. ✅ POC intégration ANCFCC
3. ✅ Premières maquettes UI
4. ✅ Tests unitaires contrats

### 16.3 Facteurs Clés de Succès

1. **Support gouvernemental fort** ⭐⭐⭐
2. **Équipe technique experte** ⭐⭐⭐
3. **Communication et formation** ⭐⭐⭐
4. **Sécurité et audit rigoureux** ⭐⭐⭐
5. **Adoption progressive et pragmatique** ⭐⭐

### 16.4 Vision Long Terme

**Année 3-5:**
- Extension à d'autres types d'actifs (véhicules, entreprises)
- Marketplace décentralisée de biens immobiliers
- Intégration IA pour évaluation automatique
- Expansion régionale (Afrique du Nord)
- Tokenisation fractionnée (investissement participatif)

---

## Annexes

### Annexe A: Glossaire

- **NFT (Non-Fungible Token)**: Jeton numérique unique représentant un actif
- **B2G (Business to Government)**: Modèle commercial entreprise vers gouvernement
- **ANCFCC**: Agence Nationale de la Conservation Foncière, du Cadastre et de la Cartographie
- **IPFS**: InterPlanetary File System - stockage décentralisé
- **ERC-721**: Standard Ethereum pour NFT
- **Gas**: Frais de transaction blockchain
- **UUPS**: Universal Upgradeable Proxy Standard
- **Multi-sig**: Signature multiple requise pour valider

### Annexe B: Références Techniques

- **Solidity Documentation**: https://docs.soliditylang.org
- **Hardhat**: https://hardhat.org
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com
- **Polygon Network**: https://polygon.technology
- **ERC-721 Standard**: https://eips.ethereum.org/EIPS/eip-721

### Annexe C: Contacts Projet

**Équipe SafeLand:**
- Chef de Projet: [contact@safeland.ma](mailto:contact@safeland.ma)
- Support Technique: [support@safeland.ma](mailto:support@safeland.ma)
- Sécurité: [security@safeland.ma](mailto:security@safeland.ma)

**Partenaires Gouvernementaux:**
- ANCFCC: [info@ancfcc.gov.ma](mailto:info@ancfcc.gov.ma)

---

**Document approuvé par:**

- [ ] Chef de Projet SafeLand
- [ ] Architecte Technique
- [ ] Représentant ANCFCC
- [ ] Directeur Technique Gouvernement

**Date de dernière révision:** 17 février 2026

---

