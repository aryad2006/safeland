# GUIDE DES ACTEURS — PLATEFORME MOROCCO LAND TRUST

# Rôles, droits, responsabilités et usage des Titres Numériques Fongibles (TNF)

---

## Table des matières

1. [Vue d'ensemble de l'écosystème](#1-vue-densemble-de-lécosystème)
2. [L'État — Master Admin / Root Admin](#2-létat--master-admin--root-admin)
3. [L'ANCFCC — Conservation Foncière — Agent Validateur](#3-lancfcc--conservation-foncière--agent-validateur)
4. [Le Notaire — Officier Public Assermenté](#4-le-notaire--officier-public-assermenté)
5. [L'Adoul — Officier Traditionnel de l'Acte Authentique](#5-ladoul--officier-traditionnel-de-lacte-authentique)
6. [Le Juge / Magistrat — Autorité Judiciaire](#6-le-juge--magistrat--autorité-judiciaire)
7. [Le Tribunal — Institution Judiciaire](#7-le-tribunal--institution-judiciaire)
8. [Le Propriétaire Individuel — Holder](#8-le-propriétaire-individuel--holder)
9. [L'Héritier — Holder de Parts ERC-1155](#9-lhéritier--holder-de-parts-erc-1155)
10. [Le Marocain Résidant à l'Étranger (MRE) — Holder + Watchtower](#10-le-marocain-résidant-à-létranger-mre--holder--watchtower)
11. [Le Créancier Hypothécaire (Banque) — Observateur Privilégié](#11-le-créancier-hypothécaire-banque--observateur-privilégié)
12. [Le Naïb (Représentant des terres collectives) — Opérateur Soulalyate](#12-le-naïb-représentant-des-terres-collectives--opérateur-soulalyate)
13. [Le Géomètre-Expert — Fournisseur Oracle](#13-le-géomètre-expert--fournisseur-oracle)
14. [La DGI — Trésor Public — Wallet de collecte fiscale](#14-la-dgi--trésor-public--wallet-de-collecte-fiscale)
15. [La CNDP — Autorité de Protection des Données](#15-la-cndp--autorité-de-protection-des-données)
16. [Matrice récapitulative des droits](#16-matrice-récapitulative-des-droits)

---

# 1. VUE D'ENSEMBLE DE L'ÉCOSYSTÈME

La plateforme Morocco Land Trust organise les acteurs du foncier marocain en une **pyramide de gouvernance à 5 niveaux**, chacun correspondant à un rôle technique dans les smart contracts :

```
                    ┌─────────────────┐
                    │      ÉTAT       │  Niveau 1 — Root Admin
                    │  (Gouvernement) │  DEFAULT_ADMIN_ROLE + ADMIN_ROLE + UPGRADER_ROLE
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │     ANCFCC      │  Niveau 2 — Agent Validateur
                    │ (Conservation)  │  AGENT_ROLE + OPERATOR_ROLE
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────┴────┐  ┌─────┴──────┐ ┌─────┴──────┐
     │   JUSTICE   │  │  NOTAIRES  │ │   ADOULS   │  Niveau 3 — Officiers
     │ (Tribunaux) │  │            │ │            │  JUSTICE_ROLE / NOTARY_ROLE
     └──────┬──────┘  └─────┬──────┘ └─────┬──────┘
            │               │              │
            └───────────────┼──────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
     ┌────────┴───┐  ┌─────┴─────┐ ┌─────┴─────┐
     │PROPRIÉTAIRE│  │ HÉRITIER  │ │    MRE    │  Niveau 4 — Holders
     │            │  │           │ │           │  ownerOf / balanceOf
     └────────────┘  └───────────┘ └───────────┘
```

---

# 2. L'ÉTAT — MASTER ADMIN / ROOT ADMIN

## 2.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Gouvernement du Royaume / Ministère de la Transition Numérique (MTNRA) / ADD |
| **Rôle blockchain** | `DEFAULT_ADMIN_ROLE` + `ADMIN_ROLE` + `UPGRADER_ROLE` |
| **Contrats concernés** | Tous (SafeLandNFT, SafeLandRegistry, SafeLandEscrow, SafeLandFridda, SafeLandJustice) |
| **Position hiérarchique** | Sommet absolu — Autorité Régalienne |

## 2.2 Pouvoirs et fonctions sur la plateforme

### A. Gouvernance du protocole

L'État est le **gardien ultime** du protocole. Son wallet détient le `DEFAULT_ADMIN_ROLE`, qui lui confère le pouvoir de :

- **Attribuer et révoquer tous les rôles** : Il peut nommer ou destituer n'importe quel agent (`AGENT_ROLE`), notaire (`NOTARY_ROLE`), juge (`JUDGE_ROLE`) ou conservateur (`CONSERVATOR_ROLE`) dans tous les contrats
- **Mettre à jour les smart contracts** (`UPGRADER_ROLE`) : Via le patron UUPS (Universal Upgradeable Proxy Standard), l'État peut autoriser les mises à jour du code des contrats sans perdre les données
- **Modifier les paramètres fiscaux** : Réajuster les taux de la DGI et de l'ANCFCC dans l'Escrow

### B. Bouton Panique (Panic Button)

L'État peut **mettre en pause l'ensemble de la plateforme** en cas de crise nationale, de cyberattaque ou de défaillance critique :

```
Fonction : pause() → met en pause SafeLandNFT (aucun transfert possible)
Fonction : pause() → met en pause SafeLandEscrow (aucune transaction possible)
```

Cela équivaut à un « arrêt de toutes les transactions foncières sur la blockchain » — une mesure d'urgence qui n'affecte pas les données existantes mais empêche toute nouvelle opération.

### C. Escrow d'État — Continuité de service

L'État héberge des **nœuds de blockchain souverains** synchronisés en temps réel. En cas de disparition de Tachydigital :

1. L'État active ses nœuds propres
2. Le code source déposé auprès de l'ADD est déployé sur les serveurs étatiques
3. Aucune donnée n'est perdue — le registre est intégralement répliqué
4. L'État reprend la gestion des rôles `ADMIN_ROLE` via les clés Root qu'il détient

### D. Ce que l'État ne peut PAS faire

- **L'État ne peut pas créer de TNF directement** : Seuls les agents ANCFCC (`AGENT_ROLE`) peuvent minter des tokens
- **L'État ne peut pas transférer une propriété** sans passer par un notaire ou un juge
- **L'État ne peut pas modifier l'historique des transactions** : L'immutabilité de la blockchain est absolue

## 2.3 Workflow type

```
État détecte une faille de sécurité nationale
  └→ pause() sur SafeLandNFT et SafeLandEscrow
  └→ Enquête et correction
  └→ unpause() après résolution
  └→ Publication d'un rapport de transparence
```

---

# 3. L'ANCFCC — CONSERVATION FONCIÈRE — AGENT VALIDATEUR

## 3.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Conservateurs fonciers régionaux et agents ANCFCC |
| **Rôle blockchain** | `AGENT_ROLE` (SafeLandNFT) + `OPERATOR_ROLE` (SafeLandRegistry) |
| **Contrats concernés** | SafeLandNFT, SafeLandRegistry |
| **Position hiérarchique** | Niveau 2 — Validateur Maître |

## 3.2 Pouvoirs et fonctions sur la plateforme

### A. Création de Titres Numériques Fongibles (TNF)

L'ANCFCC est le **seul acteur** habilité à créer de nouveaux TNF sur la blockchain. Ce pouvoir exclusif garantit que chaque TNF correspond exactement à un titre foncier réel dans les registres physiques de la Conservation Foncière.

**Fonction utilisée :** `createProperty()`

Lors de la création, le conservateur renseigne :

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `to` | Wallet du propriétaire | `0xAbC...123` |
| `titreFoncier` | Numéro officiel ANCFCC | `"TF-12345/CS"` |
| `propertyType` | Type de bien | `"villa"`, `"terrain"`, `"soulaliyate"` |
| `surface` | Surface en m² | `250` |
| `city` | Ville | `"Casablanca"` |
| `district` | Quartier / arrondissement | `"Maârif"` |
| `latitude` / `longitude` | Coordonnées GPS × 1e6 | `33592280`, `-7631930` |
| `uri` | Lien IPFS vers les documents | `"ipfs://Qm..."` |
| `documentHash` | Hash SHA-256 du dossier scellé | `0x7f3a...` |

**Garantie d'unicité :** Le contrat rejette automatiquement toute tentative de créer un TNF avec un numéro de titre foncier déjà existant (`"SafeLand: titre exists"`). C'est la **première barrière anti-fraude** : une double tokenisation est techniquement impossible.

### B. Transfert de propriété

L'ANCFCC est le seul à pouvoir exécuter un transfert de propriété de manière directe (hors escrow notarial et hors override judiciaire) :

**Fonction utilisée :** `transferProperty()`

Ce transfert ne peut avoir lieu que si :
- Le titre n'est pas verrouillé (`_transferLocked == false`)
- Le titre n'est pas gelé par la Justice (`_frozenByJustice == false`)
- La plateforme n'est pas en pause

### C. Gestion des charges et encumbrances

L'ANCFCC inscrit les **hypothèques, servitudes, saisies** et autres charges sur les TNF :

**Fonctions utilisées :** `addEncumbrance()` / `removeEncumbrance()`

| Type de charge | Code | Effet sur le transfert |
|---------------|------|----------------------|
| `"hypotheque"` | Prêt immobilier garanti | **Verrouille** le transfert automatiquement |
| `"servitude"` | Droit de passage, eau, etc. | Pas de verrouillage |
| `"saisie"` | Saisie judiciaire | **Verrouille** le transfert automatiquement |
| `"safe_lock"` | Verrou volontaire anti-spoliation | **Verrouille** le transfert automatiquement |

### D. Indexation dans le registre

L'ANCFCC enrichit le `SafeLandRegistry` avec les index de recherche :

**Fonctions utilisées :** `registerProperty()` / `recordTransaction()` / `recordFraudPrevented()`

Ces fonctions alimentent les index par ville, par propriétaire et par type de bien, permettant des recherches instantanées.

### E. Réception fiscale

Le wallet de l'ANCFCC (`ancfccWallet`) reçoit automatiquement **1% du montant de chaque vente** transitant par l'escrow notarial. Ce prélèvement est codé en dur dans le smart contract : `ANCFCC_FEE_BPS = 100` (100 points de base = 1%).

## 3.3 Workflow type — Création d'un TNF

```
Propriétaire dépose un dossier physique à la Conservation Foncière
  └→ Le conservateur vérifie le dossier (titre, plans, identité)
  └→ Le conservateur scanne et stocke les documents sur IPFS (CID)
  └→ Le conservateur calcule le hash SHA-256 du dossier
  └→ createProperty(owner, "TF-12345/CS", "villa", 250, ...)
  └→ Le contrat génère un tokenId unique (ex: #42)
  └→ registerProperty(42, "Casablanca", "villa", ownerAddress)
  └→ Événement PropertyCreated émis → visible par tous
  └→ Le propriétaire reçoit son TNF dans son wallet
```

---

# 4. LE NOTAIRE — OFFICIER PUBLIC ASSERMENTÉ

## 4.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Notaires inscrits à l'Ordre National des Notaires du Maroc |
| **Rôle blockchain** | `NOTARY_ROLE` (SafeLandNFT, SafeLandEscrow, SafeLandFridda) |
| **Contrats concernés** | SafeLandEscrow (principal), SafeLandFridda, SafeLandNFT |
| **Position hiérarchique** | Niveau 3 — Officier de confiance |

## 4.2 Pouvoirs et fonctions sur la plateforme

Le notaire est l'**acteur pivot** de toutes les transactions foncières. Son rôle sur la plateforme reflète fidèlement son rôle dans le droit marocain : il certifie, authentifie et sécurise.

### A. Orchestration des ventes — Module Escrow

Le notaire est le seul à pouvoir **initier et finaliser** une vente foncière sur la blockchain. Le workflow d'escrow en 4 étapes est entièrement sous son contrôle :

#### Étape 1 — Création du deal

**Fonction :** `createDeal(tokenId, seller, buyer, salePrice, documentHash)`

Le notaire ouvre un escrow après vérification de :
- L'identité du vendeur et de l'acheteur (CIN/passeport)
- La propriété du bien (le vendeur est-il bien le `ownerOf(tokenId)` ?)
- L'absence de charges bloquantes (`canTransfer(tokenId) == true`)
- Le consentement des parties

#### Étape 4 — Validation finale et transfert

**Fonction :** `notaryComplete(dealId)`

Quand l'acheteur a déposé les fonds et le vendeur a signé, le notaire déclenche :

1. **Fractionnement fiscal automatique** :
   - 4% → wallet DGI (droits d'enregistrement)
   - 1% → wallet ANCFCC (frais de conservation)
   - 95% → wallet vendeur
2. **Transfert du TNF** : L'ERC-721 change de propriétaire instantanément
3. **Enregistrement** dans l'historique immuable avec le type `"sale"`

#### Annulation

**Fonction :** `cancelDeal(dealId, reason)`

Le notaire peut annuler la vente à tout moment avant sa complétion. Si l'acheteur avait déjà déposé les fonds, le remboursement est **automatique et intégral**.

### B. Gestion des successions — Module Fridda

Le notaire est le seul à pouvoir ouvrir, distribuer et finaliser une succession :

#### Ouverture du dossier

**Fonction :** `openSuccession(nftTokenId, deceasedOwner, totalShares, actDecesCID, friddaDocCID)`

Le notaire ouvre le dossier de succession avec :
- L'identifiant du TNF du bien concerné
- L'adresse blockchain du défunt
- Le nombre total de parts (recommandé : 24, pour couvrir toutes les fractions de la Moudawana)
- Le CID IPFS de l'acte de décès
- Le CID IPFS de l'acte Fridda (acte de dévolution successorale)

#### Distribution des parts

**Fonction :** `distributeShares(dossierId, heirs[], shares[])`

Le notaire attribue à chaque héritier ses parts ERC-1155. Le contrat vérifie automatiquement que :
- La somme des parts = le total déclaré (`totalShares`)
- Aucun héritier n'a une adresse nulle
- Chaque part est strictement positive

Exemple pour un bien réparti entre une veuve (1/8), un fils (7/24) et deux filles (7/48 chacune) :

| Héritier | Fraction légale | Parts sur 24 |
|----------|-----------------|-------------|
| Épouse | 1/8 | 3 |
| Fils | 7/24 | 7 |
| Fille 1 | 7/48 | 3,5 → arrondi via 48 parts |
| Fille 2 | 7/48 | 3,5 → arrondi via 48 parts |

*(Dans ce cas, le notaire utiliserait `totalShares = 48` pour éviter les fractions.)*

#### Finalisation

**Fonction :** `finalizeSuccession(dossierId)`

La succession est scellée. Les parts deviennent définitives. Le module de gouvernance (votes) est activé.

#### Exécution des propositions votées

**Fonction :** `executeProposal(proposalId)`

Après un vote des héritiers (vente, location, rénovation), le notaire vérifie que le quorum est atteint et exécute la décision.

### C. Ce que le notaire ne peut PAS faire

- **Créer un TNF** : Réservé à l'ANCFCC (`AGENT_ROLE`)
- **Geler un titre** : Réservé à la Justice (`JUSTICE_ROLE`)
- **Modifier l'historique** : Impossible (immutabilité blockchain)
- **Modifier les taux fiscaux** : Réservé à l'État (`ADMIN_ROLE`)
- **Détourner les fonds d'un escrow** : Les paiements sont codés dans le smart contract, ils sont exécutés automatiquement

## 4.3 Workflow type — Vente notariée

```
Vendeur et acheteur se présentent chez le notaire
  └→ Le notaire vérifie les identités (CIN) et le titre
  └→ createDeal(tokenId=42, seller, buyer, 2_000_000 MAD, docHash)
  └→ Le vendeur signe sur la plateforme : sellerSign(dealId)
  └→ L'acheteur dépose 2 000 000 MAD : buyerDeposit(dealId)
  └→ Le notaire valide : notaryComplete(dealId)
       ├→ 80 000 MAD (4%) → DGI
       ├→ 20 000 MAD (1%) → ANCFCC
       └→ 1 900 000 MAD (95%) → Vendeur
  └→ Le TNF #42 change de propriétaire automatiquement
  └→ Événement DealCompleted émis → tracé pour toujours
```

---

# 5. L'ADOUL — OFFICIER TRADITIONNEL DE L'ACTE AUTHENTIQUE

## 5.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Adouls agréés par le Ministère de la Justice |
| **Rôle blockchain** | `NOTARY_ROLE` (mutualisé avec les notaires dans SafeLandFridda) |
| **Contrats concernés** | SafeLandFridda (principal), SafeLandNFT (consultation) |
| **Position hiérarchique** | Niveau 3 — Officier de confiance |

## 5.2 Fonctions spécifiques de l'adoul

Dans le système juridique marocain, l'adoul est l'officier public de droit traditionnel musulman. Son rôle sur la plateforme est **complémentaire** à celui du notaire et se concentre sur :

### A. Actes de succession (Fridda / Iratha)

L'adoul est historiquement l'acteur principal de la dévolution successorale au Maroc. Sur la plateforme :

1. **Établissement de l'acte adoulaire de décès** (Rasm Al-Wafat) : L'adoul constate le décès et établit l'acte qui sera hashé et stocké sur IPFS
2. **Établissement de l'acte de dévolution successorale** (Iratha) : L'adoul identifie les héritiers et calcule les parts conformément à la Moudawana
3. **Numérisation des actes** : Chaque acte adoulaire reçoit un hash SHA-256 stocké on-chain (`actDecesCID`, `friddaDocCID`)

### B. Vérification d'identité pour le Social Recovery

L'adoul peut participer à la procédure de **Social Recovery** (récupération de clés perdues) en:
- Attestant de l'identité du propriétaire ayant perdu l'accès à son wallet
- Signant l'acte de correspondance entre l'identité physique et la nouvelle adresse blockchain

### C. Actes en matière de Melk et Soulalyate

L'adoul est souvent le seul officier compétent pour les biens **Melk** (non immatriculés) dans les zones rurales. Sur la plateforme :
- Il certifie la possession coutumière (Hiyaza)
- Il établit l'acte de Moulkiya (attestation de propriété en droit traditionnel)
- Il prépare le dossier pour la première immatriculation et la tokenisation par l'ANCFCC

### D. Gestion des terres Soulalyates

Pour les terres collectives, l'adoul :
- Atteste du lien de l'ayant droit avec la collectivité ethnique
- Certifie les droits de jouissance (pas de propriété au sens moderne)
- Documente les décisions de la Jemaa (assemblée de la collectivité)

## 5.3 Différences entre Notaire et Adoul sur la plateforme

| Critère | Notaire | Adoul |
|---------|---------|-------|
| **Escrow (ventes)** | ✅ Peut initier et finaliser | ❌ Ne peut pas opérer l'escrow |
| **Fridda (successions)** | ✅ Peut ouvrir et distribuer | ✅ Peut ouvrir et distribuer |
| **Type d'actes** | Actes notariés modernes | Actes adoulaires traditionnels |
| **Zone de compétence** | Urbain et rural | Principalement rural / Melk / Soulalyate |
| **Homologation** | Auto-exécutoire | Nécessite parfois l'homologation du juge |

---

# 6. LE JUGE / MAGISTRAT — AUTORITÉ JUDICIAIRE

## 6.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Magistrats du Royaume (Tribunaux de première instance, Cours d'Appel, Cour de Cassation) |
| **Rôle blockchain** | `JUDGE_ROLE` (SafeLandJustice) + `JUSTICE_ROLE` (SafeLandNFT) |
| **Contrats concernés** | SafeLandJustice (principal), SafeLandNFT (exécution) |
| **Position hiérarchique** | Niveau 3 — Autorité judiciaire |

## 6.2 Pouvoirs et fonctions sur la plateforme

Le juge dispose des **pouvoirs les plus intrusifs** sur les TNF, mais ces pouvoirs sont protégés par un mécanisme de **multi-signature** (au moins 2 juges doivent signer pour exécuter une action).

### A. Gel judiciaire (FREEZE)

**Fonction :** `proposeAction(tokenId, address(0), judgmentHash, "", ActionType.Freeze)`

Le gel rend le TNF **intransférable** tant que la Justice n'a pas levé le gel. Usage :

| Situation | Application |
|-----------|-------------|
| Litige entre héritiers | Gel pendant la procédure de partage |
| Saisie conservatoire | Gel pour protéger les droits du créancier |
| Enquête pénale | Gel pour préserver les preuves |
| Contestation de propriété | Gel en attendant le jugement |

**Processus multi-sig :**
1. Un premier juge propose le gel → `proposeAction()` (1 signature)
2. Un second juge confirme → `signAction(actionId)` (2 signatures)
3. Le seuil atteint, un juge exécute → `executeAction(actionId)`
4. Le contrat SafeLandNFT exécute `freezeByJustice(tokenId, judgmentHash)`

### B. Override Judiciaire — Burn & Remint

**Fonction :** `proposeAction(tokenId, newOwner, judgmentHash, newUri, ActionType.BurnRemint)`

C'est le pouvoir le plus radical : **la destruction d'un TNF frauduleux et sa réémission au nom du propriétaire légitime**. Cas d'usage :

| Situation | Application |
|-----------|-------------|
| Spoliation foncière avérée | Annulation de la vente frauduleuse |
| Faux et usage de faux | Destruction du titre falsifié |
| Expropriation pour utilité publique | Transfert forcé avec indemnisation |
| Jugement de partage exécuté | Redistribution en cas de litige successoral |

**L'Override fonctionne en 3 temps dans le contrat SafeLandNFT :**

1. **Burn** : Le TNF détenu par le fraudeur est détruit → `_burn(tokenId)`
2. **Remint** : Un nouveau TNF avec le même `tokenId` est émis au nom du propriétaire légitime → `_safeMint(newOwner, tokenId)`
3. **Historique** : Une entrée `"justice_override"` est ajoutée à l'historique du titre → preuve permanente de l'intervention judiciaire

**Garanties :**
- L'historique de la fraude et de la correction est **indélébile** — il reste tracé pour toujours
- Les données de la propriété (surface, localisation, etc.) sont **conservées** — seule la propriété change
- Le `documentHash` du jugement est inscrit dans le registre — n'importe qui peut vérifier la décision

### C. Social Recovery — Récupération de clés perdues

**Fonction :** `requestRecovery(tokenId, newWallet)` puis `proposeAction(... ActionType.SocialRecovery)`

Quand un propriétaire perd l'accès à son wallet (perte de clé privée, décès sans transmission des identifiants), la Justice peut :

1. Vérifier l'identité du demandeur (via un notaire ou conservateur — `CONSERVATOR_ROLE`)
2. Proposer un Social Recovery
3. Après multi-sig, exécuter un Burn & Remint vers le nouveau wallet du propriétaire légitime

**Ce mécanisme est fondamental** : il différencie SafeLand des systèmes DeFi classiques où la perte d'une clé signifie la perte définitive du bien. Ici, **le droit prime sur la cryptographie**.

### D. Ce que le juge ne peut PAS faire seul

- **Agir seul** : Toute action requiert au moins 2 signatures (`requiredSignatures = 2`)
- **Créer un TNF** : Seul l'ANCFCC le peut
- **Modifier les données de la propriété** : Le système conserve les données originales, même après un Override
- **Accéder aux fonds de l'Escrow** : Les flux financiers sont automatiques et immuables

## 6.3 Workflow type — Spoliation foncière

```
Un citoyen porte plainte pour spoliation de son terrain
  └→ Le tribunal instruit l'affaire
  └→ Juge A propose le gel : proposeAction(tokenId, ..., Freeze)
  └→ Juge B confirme : signAction(actionId)
  └→ Un juge exécute : executeAction(actionId)
  └→ Le TNF est gelé (aucun transfert possible)
  
Après jugement (le plaignant est le propriétaire légitime)
  └→ Juge A propose l'Override : proposeAction(tokenId, plaignant, ..., BurnRemint)
  └→ Juge B confirme : signAction(actionId)
  └→ Un juge exécute : executeAction(actionId)
  └→ Le TNF est détruit chez le fraudeur et recréé chez le plaignant
  └→ L'historique conserve la trace complète : création → vente frauduleuse → override judiciaire
```

---

# 7. LE TRIBUNAL — INSTITUTION JUDICIAIRE

## 7.1 Identité institutionnelle

| Attribut | Valeur |
|----------|--------|
| **Types** | Tribunal de première instance, Tribunal de Commerce, Cour d'Appel, Cour de Cassation |
| **Rôle sur la plateforme** | Organisation institutionnelle des juges disposant du `JUDGE_ROLE` |
| **Fonction** | Cadre organisationnel de la multi-signature judiciaire |

## 7.2 Rôle organisationnel

Le tribunal n'agit pas directement sur la blockchain — ce sont les **magistrats individuels** (porteurs du `JUDGE_ROLE`) qui interagissent avec les smart contracts. Le tribunal fournit :

### A. Le cadre de la multi-signature

Le système de multi-sig judiciaire de SafeLandJustice est conçu pour refléter la collégialité judiciaire marocaine :

| Type de tribunal | Nombre de juges dans la multi-sig |
|-----------------|-----------------------------------|
| Tribunal de première instance | 2 juges (seuil par défaut) |
| Cour d'Appel | 3 juges (seuil configurable) |
| Cour de Cassation | 3 à 5 juges (pour les décisions de principe) |

### B. Le registre des décisions

Chaque action judiciaire sur la blockchain contient un `judgmentHash` — le hash SHA-256 du jugement. Ceci permet :

- **L'auditabilité** : N'importe quel citoyen peut vérifier qu'un override correspond à un vrai jugement
- **L'archivage immuable** : La décision judiciaire est liée de manière permanente au titre foncier
- **La traçabilité temporelle** : La date de l'action est inscrite dans la blockchain (`createdAt`)

### C. Statistiques judiciaires

Le `SafeLandRegistry` maintient un compteur `justicOverrides` qui donne une **vue macro du nombre d'interventions judiciaires** — un indicateur précieux pour évaluer l'efficacité du système et le volume de fraudes corrigées.

### D. Compétences par type de litige

| Type de litige | Juridiction compétente | Action blockchain |
|---------------|----------------------|-------------------|
| Spoliation foncière | Tribunal pénal / 1ère instance | Freeze → BurnRemint |
| Liquidation successorale | Tribunal de la famille | BurnRemint (partage forcé) |
| Saisie immobilière | Tribunal de Commerce | Freeze |
| Expropriation | Tribunal administratif | BurnRemint (au profit de l'État) |
| Perte de clé | Tribunal de 1ère instance | SocialRecovery |

---

# 8. LE PROPRIÉTAIRE INDIVIDUEL — HOLDER

## 8.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Toute personne physique ou morale possédant un bien foncier titré |
| **Rôle blockchain** | Holder ERC-721 (`ownerOf(tokenId)`) |
| **Contrats concernés** | SafeLandNFT (détention), SafeLandEscrow (vente), SafeLandRegistry (consultation) |
| **Position hiérarchique** | Niveau 4 — Utilisateur final |

## 8.2 Droits et fonctions sur la plateforme

### A. Détention du TNF

Le propriétaire détient un ERC-721 dans son wallet. Ce token :

- **Prouve sa propriété** de manière cryptographique et vérifiable par tous
- **Contient les métadonnées** du bien (via l'URI IPFS) : superficie, localisation, photos, plans
- **Porte l'historique** complet du bien : toutes les transactions depuis sa tokenisation

### B. Consultation de ses biens

Le propriétaire peut à tout moment :

| Action | Fonction | Résultat |
|--------|----------|---------|
| Voir ses propriétés | `getByOwner(address)` | Liste de tous ses tokenIds |
| Voir les détails d'un bien | `getProperty(tokenId)` | Surface, ville, type, validateur, etc. |
| Voir l'historique | `getHistory(tokenId)` | Toute la chaîne de propriété |
| Voir les charges | `getEncumbrances(tokenId)` | Hypothèques, servitudes, saisies |
| Vérifier la transférabilité | `canTransfer(tokenId)` | `true` ou `false` |

### C. Participation aux ventes (Module Escrow)

Le propriétaire intervient dans la vente en tant que **vendeur** :

1. Le notaire crée le deal → `createDeal()`
2. **Le vendeur signe son consentement** → `sellerSign(dealId)` (seul le wallet propriétaire peut appeler cette fonction)
3. L'acheteur dépose les fonds → `buyerDeposit()`
4. Le notaire finalise → `notaryComplete()`
5. Le vendeur reçoit 95% du prix net automatiquement

### D. Travel Lock / Safe-Lock — Protection anti-spoliation

**Fonction :** `lockTransfer(tokenId, reason)`

Le propriétaire peut **verrouiller son TNF** pour empêcher tout transfert. C'est le mécanisme de protection le plus puissant offert au citoyen :

| Situation | Usage |
|-----------|-------|
| Déplacement à l'étranger | « Je verrouille mon titre pendant mes vacances » |
| Suspicion de tentative de fraude | « Je bloque tout en attendant de comprendre » |
| Bien inoccupé | « Personne ne peut vendre pendant mon absence » |

Pour déverrouiller : `unlockTransfer(tokenId)`.

**Seuls le propriétaire lui-même ou l'État (ADMIN_ROLE) peuvent verrouiller/déverrouiller.**

### E. Ce que le propriétaire ne peut PAS faire

- **Transférer directement** son TNF : Il doit passer par un notaire + l'ANCFCC ou l'escrow
- **Modifier les données de la propriété** : Seul l'ANCFCC peut modifier les métadonnées
- **Contourner un gel judiciaire** : Le `JUSTICE_ROLE` surpasse le propriétaire
- **Émettre de nouveaux tokens** : Seul l'ANCFCC le peut

## 8.3 Workflow type — Achat d'un bien

```
L'acheteur se présente chez le notaire avec le vendeur
  └→ Le notaire crée l'escrow : createDeal(...)
  └→ Le vendeur signe : sellerSign(dealId)
  └→ L'acheteur dépose les fonds : buyerDeposit(dealId) {value: 2M MAD}
  └→ Le notaire finalise : notaryComplete(dealId)
  └→ L'acheteur reçoit le TNF dans son wallet
  └→ L'acheteur peut vérifier : getProperty(tokenId) → ses données
  └→ L'acheteur verrouille son titre par précaution : lockTransfer(tokenId, "anti-spoliation")
```

---

# 9. L'HÉRITIER — HOLDER DE PARTS ERC-1155

## 9.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Héritiers légaux conformément à la Moudawana |
| **Rôle blockchain** | Holder ERC-1155 (`balanceOf(heir, dossierId)`) |
| **Contrats concernés** | SafeLandFridda (principal), SafeLandNFT (consultation) |
| **Position hiérarchique** | Niveau 4 — Utilisateur final |

## 9.2 Droits et fonctions sur la plateforme

### A. Réception des parts successorales

Quand un notaire ou adoul distribue les parts (`distributeShares`), chaque héritier reçoit automatiquement des **tokens ERC-1155** dans son wallet. Le nombre de tokens correspond exactement à sa part légale :

| Exemple : Bien de valeur 2 400 000 MAD — 24 parts |
|---|
| Épouse : 3 parts (1/8) = 300 000 MAD de droits |
| Fils aîné : 7 parts (7/24) = 700 000 MAD de droits |
| Fille 1 : 7 parts (7/24) = 700 000 MAD de droits |
| Fille 2 : 7 parts (7/24) = 700 000 MAD de droits |

### B. Cession de parts

Un héritier peut **transférer ses parts** ERC-1155 à un autre héritier ou à un tiers via la fonction standard `safeTransferFrom()`. Cela permet de :

- Racheter les parts d'un co-héritier pour consolider la propriété
- Vendre ses droits d'indivision sans bloquer les autres héritiers
- Donner ses parts à un enfant ou un parent

### C. Gouvernance de l'indivision — Propositions et votes

L'héritier est au cœur du système de **gouvernance démocratique** de l'indivision :

#### Créer une proposition

**Fonction :** `createProposal(dossierId, voteType, description, quorumBps, durationDays)`

| Type de vote | `VoteType` | Quorum recommandé |
|-------------|-----------|-------------------|
| Vente du bien entier | `Sell` | 6667 BPS (2/3) — Acte de disposition |
| Mise en location | `Rent` | 5001 BPS (50%+1) — Acte d'administration |
| Rénovation | `Renovate` | 5001 BPS (50%+1) — Acte d'administration |

#### Voter

**Fonction :** `vote(proposalId, inFavor)`

- Le **poids du vote** est proportionnel au nombre de parts détenues
- Un héritier avec 7 parts a 7× plus de poids qu'un héritier avec 1 part
- Chaque héritier ne peut voter **qu'une seule fois** par proposition

#### Suivi

**Fonction :** `getProposal(proposalId)` — Consulter l'état du vote (pour, contre, quorum, deadline)

### D. Exemple concret de vote pondéré

```
Bien : Villa à Casablanca — 24 parts — 4 héritiers

Proposition : "Vendre la villa pour 3 000 000 MAD"
Type : Sell — Quorum requis : 2/3 = 16 parts sur 24
Durée : 30 jours

Héritier A (8 parts) : Vote POUR  →  8 parts pour
Héritier B (6 parts) : Vote POUR  →  14 parts pour
Héritier C (6 parts) : Vote CONTRE → 6 parts contre
Héritier D (4 parts) : Vote POUR  → 18 parts pour

Résultat : 18/24 = 75% > 66.67% → ✅ Proposition adoptée
Le notaire peut exécuter : executeProposal(proposalId)
```

### E. Ce que l'héritier ne peut PAS faire

- **Vendre le bien physiquement** sans le vote des co-héritiers (gouvernance ERC-1155)
- **Modifier les parts des autres héritiers** : La distribution est verrouillée par le contrat
- **Rouvrir une succession finalisée** : `isFinalized = true` est irréversible
- **Voter deux fois** sur la même proposition

---

# 10. LE MAROCAIN RÉSIDANT À L'ÉTRANGER (MRE) — HOLDER + WATCHTOWER

## 10.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Citoyens marocains résidant hors du Maroc |
| **Rôle blockchain** | Holder ERC-721 / ERC-1155 + Module Watchtower |
| **Contrats concernés** | Tous (consultation) + SafeLandNFT (Travel Lock) |
| **Position hiérarchique** | Niveau 4 — Utilisateur final avec protections renforcées |

## 10.2 Problématiques spécifiques des MRE

Les MRE représentent une population **particulièrement vulnérable** à la fraude foncière :

| Risque | Description |
|--------|-------------|
| Procuration frauduleuse | Un mandataire vend le bien sans consentement réel |
| Spoliation par la famille | Des co-héritiers vendent pendant l'absence du MRE |
| Faux documents | Des tiers falsifient des actes pour s'accaparer le bien |
| Lenteur d'intervention | Le MRE ne peut pas se déplacer rapidement au Maroc |

## 10.3 Solutions offertes par la plateforme

### A. Travel Lock — Verrou anti-spoliation

**Fonction :** `lockTransfer(tokenId, "MRE travel lock")`

Le MRE peut verrouiller son TNF **depuis n'importe où dans le monde**, via son wallet. Tant que le verrou est actif :

- Aucun transfert n'est possible
- Aucune vente via escrow n'est possible
- Aucune hypothèque ne peut être ajoutée de manière verrouillante

**Avantage décisif :** Même si un fraudeur obtient une procuration falsifiée, il ne pourra pas transférer le TNF car le contrat vérifie `_transferLocked[tokenId]` avant tout transfert.

### B. Watchtower — Surveillance en temps réel

Le module Watchtower (côté frontend/backend) émet des **alertes automatiques** au MRE lorsque :

- Quelqu'un tente de créer un escrow sur son bien → Événement `DealCreated`
- Une charge est ajoutée à son titre → Événement `EncumbranceAdded`
- Son titre est gelé par la Justice → Événement `PropertyFrozenByJustice`
- Une succession est ouverte sur son bien → Événement `SuccessionOpened`

Le MRE reçoit ces alertes par **email, SMS ou notification push**, où qu'il soit dans le monde.

### C. Investissement fractionné

Via le module Fridda, un MRE peut acheter des **parts ERC-1155** d'un bien en indivision, sans avoir à acquérir le bien entier. Cela ouvre la voie à l'**investissement immobilier fractionné** à distance.

### D. Vérification à distance

Le MRE peut à tout moment :

- Vérifier la propriété de ses biens : `getByOwner(myAddress)`
- Consulter l'historique de tous les mouvements : `getHistory(tokenId)`
- Vérifier qu'aucune charge suspecte n'a été ajoutée : `getEncumbrances(tokenId)`
- S'assurer que son titre est verrouillé : `isLocked(tokenId) == true`

## 10.4 Workflow type — Protection MRE

```
MRE résidant en France détient un terrain au Maroc (tokenId #77)
  └→ Le MRE verrouille son titre : lockTransfer(77, "MRE France - anti-spoliation")
  
Un fraudeur tente de vendre le terrain avec une fausse procuration
  └→ Le notaire crée un deal : createDeal(77, ...) → ❌ ÉCHEC
     "SafeLand: token not transferable" (car canTransfer(77) == false)
  └→ Le Watchtower alerte le MRE : "Tentative de vente détectée sur votre terrain"
  └→ Le MRE contacte les autorités
  └→ L'ANCFCC enregistre la tentative : recordFraudPrevented(77, "Fausse procuration")
```

---

# 11. LE CRÉANCIER HYPOTHÉCAIRE (BANQUE) — OBSERVATEUR PRIVILÉGIÉ

## 11.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Banques commerciales (Attijariwafa Bank, BMCE, CIH, BP, ...) |
| **Rôle blockchain** | Observateur — adresse `creditor` dans les Encumbrances |
| **Contrats concernés** | SafeLandNFT (consultation des charges), SafeLandEscrow (observation) |
| **Position hiérarchique** | Observateur externe |

## 11.2 Fonctions sur la plateforme

### A. Inscription de l'hypothèque

Quand une banque accorde un crédit immobilier, l'ANCFCC inscrit l'hypothèque sur le TNF :

```
addEncumbrance(tokenId, "hypotheque", bankAddress, loanAmount, endDate)
```

**Effet automatique :** Le TNF est **verrouillé** tant que l'hypothèque est active. Le propriétaire ne peut pas vendre sans lever l'hypothèque.

### B. Mainlevée

Une fois le crédit remboursé :

```
removeEncumbrance(tokenId, encumbranceIndex)
```

Le TNF est automatiquement **déverrouillé** (si aucune autre charge bloquante n'existe).

### C. Suivi en temps réel

La banque peut consulter l'état de l'hypothèque via :
- `getEncumbrances(tokenId)` → vérifie que l'hypothèque est toujours active
- `canTransfer(tokenId)` → vérifie que le bien ne peut pas échapper à la garantie
- `getHistory(tokenId)` → surveille tout mouvement

### D. Avantages pour la banque

| Avantage | Description |
|----------|-------------|
| **Sécurité de la garantie** | L'hypothèque est inscrite de manière immuable sur le TNF |
| **Vérification instantanée** | Pas besoin de demander un certificat à l'ANCFCC — lecture directe |
| **Anti-double hypothèque** | L'historique complet révèle toutes les charges existantes |
| **Automatisation** | Le verrouillage est automatique dès l'inscription |

---

# 12. LE NAÏB (REPRÉSENTANT DES TERRES COLLECTIVES) — OPÉRATEUR SOULALYATE

## 12.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Naïbs élus ou désignés des collectivités ethniques |
| **Rôle blockchain** | `NOTARY_ROLE` (limité aux opérations Soulalyates) ou rôle spécifique futur |
| **Contrats concernés** | SafeLandFridda (gestion des droits de jouissance), SafeLandNFT (consultation) |
| **Position hiérarchique** | Niveau 3 — Opérateur sectoriel |

## 12.2 Contexte juridique

Les terres Soulalyates sont régies par la **Loi 62-17** et supervisées par le **Ministère de l'Intérieur** (Direction des Affaires Rurales). Les Naïbs sont les représentants des collectivités ethniques auprès de l'administration.

## 12.3 Fonctions sur la plateforme

### A. Certification des ayants droit

Le Naïb atteste de l'appartenance d'un individu à la collectivité ethnique. Sur la plateforme :

1. Le Naïb fournit la liste des ayants droit de la collectivité
2. L'ANCFCC tokenise la terre collective en un TNF unique (`propertyType = "soulaliyate"`)
3. Le module Fridda émet des parts ERC-1155 aux ayants droit (**non cessibles à des tiers extérieurs à la collectivité**)

### B. Gestion des droits de jouissance

Les parts ERC-1155 Soulalyates sont **spéciales** : elles représentent un droit de jouissance, pas un droit de propriété. Le Naïb veille à ce que :

- Les parts ne soient pas vendues à des tiers hors de la collectivité
- Les droits de jouissance soient respectés (cultures, pâturages, habitation)
- Les décisions de la Jemaa soient transcrites en propositions de vote sur la blockchain

### C. Participation à la gouvernance

Le Naïb peut créer des **propositions de vote** via le module Fridda :

| Décision | Type de vote | Quorum |
|----------|-------------|--------|
| Mise en location de parcelles | `Rent` | 50%+1 |
| Aménagement collectif | `Renovate` | 50%+1 |
| Cession à l'État (utilité publique) | `Sell` | 2/3 + accord Ministère Intérieur |

---

# 13. LE GÉOMÈTRE-EXPERT — FOURNISSEUR ORACLE

## 13.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Géomètres-topographes agréés par l'ANCFCC |
| **Rôle blockchain** | Fournisseur de données (Oracle hors-chaîne) |
| **Contrats concernés** | SafeLandNFT (données de création) |
| **Position hiérarchique** | Fournisseur de services |

## 13.2 Fonctions sur la plateforme

### A. Données de géolocalisation

Le géomètre fournit les **coordonnées GPS précises** qui sont inscrites dans le TNF :

| Paramètre | Source | Précision |
|-----------|--------|-----------|
| `latitude` | Relevé GPS du géomètre | × 1e6 (6 décimales) |
| `longitude` | Relevé GPS du géomètre | × 1e6 (6 décimales) |
| `surface` | Bornage et mesurage | En m² |

### B. Vérification des limites

Avant la tokenisation, le géomètre :
1. Effectue le **bornage contradictoire** du terrain
2. Établit le **plan topographique** (stocké sur IPFS)
3. Calcule la **superficie réelle** (inscrite dans `surface`)
4. Fournit le **hash des documents** de bornage (`documentHash`)

### C. Oracle Satellite (Phase avancée)

À terme, le géomètre alimentera les **oracles satellite** de la plateforme pour :
- Vérifier l'occupation réelle des parcelles (imagerie satellite)
- Détecter les constructions non autorisées
- Surveiller le stress hydrique des terres agricoles

---

# 14. LA DGI — TRÉSOR PUBLIC — WALLET DE COLLECTE FISCALE

## 14.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Direction Générale des Impôts (DGI) |
| **Rôle blockchain** | Wallet de réception des droits d'enregistrement |
| **Contrats concernés** | SafeLandEscrow (`dgiWallet`) |
| **Position hiérarchique** | Bénéficiaire automatique |

## 14.2 Fonctions sur la plateforme

### A. Prélèvement fiscal automatique (At-the-Source)

La DGI reçoit **automatiquement 4%** de chaque vente foncière transitant par l'escrow. Ce mécanisme est codé en dur dans le smart contract :

```
DGI_FEE_BPS = 400  // 400 BPS = 4%
```

**Avantages :**

| Avantage | Description |
|----------|-------------|
| **Zéro évasion** | Le prélèvement est automatique et impossible à contourner |
| **Temps réel** | Les fonds arrivent instantanément dans le wallet DGI |
| **Traçabilité** | Chaque prélèvement est lié à une transaction spécifique |
| **Transparence** | Le montant exact est inscrit dans l'événement `DealCompleted` |

### B. Exemple chiffré

| Transaction | Montant |
|-------------|---------|
| Prix de vente | 2 000 000 MAD |
| DGI (4%) | **80 000 MAD** → automatiquement dans `dgiWallet` |
| ANCFCC (1%) | 20 000 MAD |
| Net vendeur | 1 900 000 MAD |

---

# 15. LA CNDP — AUTORITÉ DE PROTECTION DES DONNÉES

## 15.1 Identité

| Attribut | Valeur |
|----------|--------|
| **Représenté par** | Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel |
| **Rôle blockchain** | Auditeur externe — pas de rôle on-chain |
| **Cadre légal** | Loi 09-08 relative à la protection des données personnelles |

## 15.2 Interaction avec la plateforme

### A. Données on-chain vs off-chain

La plateforme est conçue pour **minimiser les données personnelles on-chain** :

| Donnée | Stockage | Justification |
|--------|----------|---------------|
| Adresse wallet | On-chain | Pseudonyme — pas une donnée personnelle directe |
| Numéro titre foncier | On-chain | Donnée publique (registre foncier) |
| Surface, localisation | On-chain | Données foncières publiques |
| CIN, nom, adresse du propriétaire | **Off-chain (IPFS chiffré)** | Données personnelles protégées |
| Documents notariés | **Off-chain (IPFS, CID hashé)** | Seul le hash est on-chain |

### B. Droit d'accès et de rectification

Le droit à l'effacement (article 40 de la Loi 09-08) est **incompatible** avec l'immutabilité de la blockchain. Solution :

- Les données personnelles sont stockées **off-chain** (IPFS)
- Seuls les **hashes cryptographiques** sont on-chain (impossibles à rétro-ingénierer)
- La suppression des données off-chain est possible sans affecter la blockchain
- Le TNF reste valide même si les documents IPFS sont retirés

---

# 16. MATRICE RÉCAPITULATIVE DES DROITS

| Acteur | Créer TNF | Transférer | Geler | Override | Escrow | Fridda | Lock | Voter | Consulter |
|--------|-----------|-----------|-------|----------|--------|--------|------|-------|-----------|
| **État** | ❌ | ❌ | Via Justice | Via Justice | ❌ | ❌ | ✅ | ❌ | ✅ |
| **ANCFCC** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Notaire** | ❌ | Via Escrow | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Adoul** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Juge** | ❌ | ❌ | ✅ Multi-sig | ✅ Multi-sig | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Propriétaire** | ❌ | Via Notaire | ❌ | ❌ | Vendeur/Acheteur | ❌ | ✅ | ❌ | ✅ |
| **Héritier** | ❌ | Parts ERC-1155 | ❌ | ❌ | ❌ | Parts | ❌ | ✅ | ✅ |
| **MRE** | ❌ | Via Notaire | ❌ | ❌ | Vendeur/Acheteur | Parts | ✅ | ✅ | ✅ |
| **Banque** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Naïb** | ❌ | ❌ | ❌ | ❌ | ❌ | Propositions | ❌ | ✅ | ✅ |
| **DGI** | ❌ | ❌ | ❌ | ❌ | Reçoit 4% | ❌ | ❌ | ❌ | ✅ |

---

> **Ce document fait partie du dossier TACHYDIGITAL — Projet Morocco Land Trust.**
> **Tous droits réservés — TACHYDIGITAL S.A.R.L.**
