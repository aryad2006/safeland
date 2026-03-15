# Rapport d'Audit Technique Complet - SafeLand Morocco

**Version:** 3.0
**Date:** 15 mars 2026
**Auditeur:** Analyse statique approfondie (architecture, logique, securite)
**Perimetre:** 6 smart contracts, backend Express, frontend Next.js, infra Docker/CI

---

## Resume Executif

| Couche | Critiques | Majeurs | Mineurs | Suggestions |
|--------|-----------|---------|---------|-------------|
| Smart Contracts (6) | 4 | 7 | 6 | 8 |
| Backend Express | 5 | 8 | 4 | - |
| Frontend Next.js | 3 | 5 | 5 | 6 |
| Infra (Docker/CI/Subgraph) | 3 | 6 | 5 | 3 |
| **TOTAL** | **15** | **26** | **20** | **17** |

**Verdict global :** Architecture structurellement saine, 373 tests existants, mais **15 problemes critiques** a corriger avant tout deploiement Sepolia/mainnet.

---

## 1. SMART CONTRACTS — 25 findings

### 1.1 CRITIQUES (4)

#### SC-C1 : Token ID commence a 1, collision avec mapping default (0)
**Fichier :** `SafeLandNFT.sol:156-157`
**Probleme :** `_tokenIdCounter` demarre a 0, incremente a 1 avant le premier mint. Le mapping `_titreFoncierToToken` retourne 0 par defaut pour un titre inexistant, rendant la detection de doublons impossible pour le premier token.
**Impact :** Un agent peut creer deux NFTs avec le meme titre foncier.
**Fix :** Initialiser `_tokenIdCounter = 1` dans `initialize()`.

#### SC-C2 : Race condition Escrow — _tokenToDeal desynchronise apres notaryComplete
**Fichier :** `SafeLandEscrow.sol:117,135,192,226`
**Probleme :** Si `notaryComplete()` echoue apres le reset de `_tokenToDeal[tokenId] = 0` mais avant le transfert NFT, le meme token peut etre vendu deux fois.
**Impact :** Double vente potentielle.
**Fix :** Appliquer le pattern CEI strict : transferer d'abord, puis mettre a jour l'etat, puis envoyer les paiements.

#### SC-C3 : Social Recovery incomplete — executed jamais mis a true
**Fichier :** `SafeLandJustice.sol:171-197`
**Probleme :** `requestRecovery()` cree une RecoveryRequest avec `executed: false`, mais aucune fonction ne la marque comme executee.
**Impact :** Feature Social Recovery non fonctionnelle. Un recovery peut etre "execute" plusieurs fois.
**Fix :** Ajouter `executeRecovery()` avec verification `!recovery.executed`.

#### SC-C4 : Typo "justicOverrides" dans Registry GlobalStats
**Fichier :** `SafeLandRegistry.sol:24,78`
**Probleme :** Le champ du struct s'appelle `justicOverrides` au lieu de `justiceOverrides`.
**Impact :** Confusion, donnees mal nommees dans getStats(). Correction necessitant migration storage si deja deploye.

### 1.2 MAJEURS (7)

#### SC-M1 : Pas de __gap[] dans les contrats UUPS
**Fichiers :** Tous les 6 contrats
**Probleme :** OpenZeppelin recommande `uint256[50] private __gap` pour reserver de l'espace storage lors des upgrades.
**Impact :** Storage collision lors d'un upgrade si de nouveaux champs sont ajoutes.
**Fix :** Ajouter `uint256[50] private __gap` a chaque contrat.

#### SC-M2 : Justice executeAction() marque executed AVANT l'appel au NFT
**Fichier :** `SafeLandJustice.sol:140-165`
**Probleme :** `action.executed = true` est place avant `nftContract.freezeByJustice()`. Si l'appel reverte, l'action est marquee comme executee sans effet.
**Fix :** Deplacer `action.executed = true` APRES les appels externes.

#### SC-M3 : Fridda ne synchronise pas avec NFT apres vote de vente
**Fichier :** `SafeLandFridda.sol` (executeProposal)
**Probleme :** Quand une proposition "Sell" est votee et executee, rien ne transfere le NFT au nouvel acheteur.
**Impact :** Decoherence entre Fridda (vente approuvee) et NFT (proprietaire inchange).
**Fix :** Ajouter reference a ISafeLandNFT et appeler `transferProperty()` dans `executeProposal()`.

#### SC-M4 : Fraude electorale Fridda — transfert de parts apres vote
**Fichier :** `SafeLandFridda.sol:216-234`
**Probleme :** Un heritier peut voter avec ses parts ERC-1155, puis les transferer a un autre qui vote aussi.
**Impact :** Manipulation du resultat des votes de gouvernance.
**Fix :** Geler les transferts pendant la periode de vote ou utiliser un snapshot.

#### SC-M5 : Escrow ne verrouille pas le NFT pendant la vente
**Probleme :** Le vendeur peut transferer son NFT via une autre route pendant qu'un deal est en cours.
**Impact :** Deal en limbo (fonds deposes, NFT transfere a un tiers).
**Fix :** Ajouter un mecanisme d'approval ou un verrou sur le NFT dans createDeal().

#### SC-M6 : Timelock — pas de validation address(0) pour target
**Fichier :** `SafeLandTimelock.sol:175-210`
**Fix :** Ajouter `require(target != address(0))`.

#### SC-M7 : deploy.js contient du code duplique (151 lignes repetees)
**Fix :** Factoriser la logique de deploiement.

### 1.3 MINEURS (6)

| ID | Description | Fix |
|----|-------------|-----|
| SC-m1 | transferProperty() autorise self-transfer | `require(to != ownerOf(tokenId))` |
| SC-m2 | createDeal() autorise seller == buyer | `require(seller != buyer)` |
| SC-m3 | openSuccession() accepte deceasedOwner = address(0) | Ajouter require |
| SC-m4 | salePrice = 1 wei contourne la fiscalite (division entiere) | Montant minimum |
| SC-m5 | seed.js passe les params dans le mauvais ordre | Corriger l'appel |
| SC-m6 | _removeFromOwner() silencieux si tokenId absent | Ajouter revert |

---

## 2. BACKEND EXPRESS — 17 findings

### 2.1 CRITIQUES (5)

#### BE-C1 : Injection req.query sans validation dans GET /properties
**Fichier :** `routes/properties.js:143`
**Probleme :** `city` et `owner` extraits de req.query sans aucune validation avant appel contrat.
**Fix :** Valider avec `isValidAddress()` et `isNonEmptyString()`.

#### BE-C2 : Disparite isPositiveInteger vs isPositiveIntegerArray
**Fichier :** `utils/validators.js:75`
**Probleme :** `isPositiveInteger()` accepte 0, `isPositiveIntegerArray()` rejette 0.
**Impact :** Impossible de creer une succession avec 0 parts pour un heritier.
**Fix :** Harmoniser les deux fonctions.

#### BE-C3 : parseInt sans validation dans routes bank
**Fichier :** `routes/bank.js:181,312`
**Probleme :** `parseInt(req.params.tokenId)` sans `validateParamId()` middleware.
**Impact :** `NaN` propage aux appels contrats.
**Fix :** Appliquer `validateParamId("tokenId")` a TOUTES les routes.

#### BE-C4 : Memory leak WebSocket — listeners jamais nettoyes
**Fichier :** `services/notifications.js:219-223`
**Probleme :** A chaque retry, `startListening()` ajoute de nouveaux `contract.on()` sans supprimer les anciens.
**Fix :** `this.provider.removeAllListeners()` avant chaque retry.

#### BE-C5 : Lock/unlock sans verification ownership
**Fichier :** `routes/properties.js:195,213`
**Probleme :** N'importe quel utilisateur authentifie peut verrouiller les proprietes des autres.
**Fix :** Verifier `req.user.address === owner` ou ajouter `requireRole()`.

### 2.2 MAJEURS (8)

| ID | Description | Severite |
|----|-------------|----------|
| BE-M1 | Nonce sans adresse dans le message signe — replay possible | MAJEUR |
| BE-M2 | Role dans JWT non rafraichi apres changement | MAJEUR |
| BE-M3 | Rate limiting trop faible (100 req/15min) | MAJEUR |
| BE-M4 | Aucun timeout sur appels blockchain | MAJEUR |
| BE-M5 | Calcul fiscal en dur (4%/1%) desynchronise du contrat | MAJEUR |
| BE-M6 | Adresses lowercase vs checksummed non normalisees | MAJEUR |
| BE-M7 | Error handler ne log pas la stack trace | MAJEUR |
| BE-M8 | Tests manquants pour routes critiques (escrow, fridda, justice) | MAJEUR |

### 2.3 MINEURS (4)

| ID | Description |
|----|-------------|
| BE-m1 | isValidHash() accepte n'importe quelle string >= 4 chars |
| BE-m2 | Swagger spec incomplet (90% des endpoints non documentes) |
| BE-m3 | Gestion d'erreur incoherente (next(err) vs res.status().json()) |
| BE-m4 | IPFS service sans fallback si Pinata down |

---

## 3. FRONTEND NEXT.JS — 19 findings

### 3.1 CRITIQUES (3)

#### FE-C1 : JWT en localStorage — vulnerable XSS
**Fichier :** `WalletContext.js:62,80`
**Probleme :** Le JWT est stocke en localStorage brut, accessible a tout script XSS.
**Fix :** Migrer vers httpOnly cookies + CSRF token.

#### FE-C2 : useEffect dependencies manquantes
**Fichiers :** `stats/page.js:13`, `properties/page.js:30`
**Probleme :** `apiCall` non liste dans les deps du useEffect.
**Fix :** Ajouter les dependencies ou utiliser useCallback.

#### FE-C3 : account.slice() sans null check
**Fichiers :** `Navbar.js:64,118`, `page.js:93`
**Probleme :** Crash si `account` est null pendant un re-render.
**Fix :** `account?.slice(0, 6) ?? "..."`.

### 3.2 MAJEURS (5)

| ID | Description |
|----|-------------|
| FE-M1 | Auth race condition — wallet connecte meme si JWT echoue |
| FE-M2 | window.location.reload() sur chainChanged (destructeur UX) |
| FE-M3 | Formulaires sans validation cote client |
| FE-M4 | Timelock execute envoie `data: "0x"` hardcode au lieu de operation.data |
| FE-M5 | NotificationBell labels hardcodes en francais (pas i18n) |

### 3.3 MINEURS (5)

| ID | Description |
|----|-------------|
| FE-m1 | Erreurs silencieuses dans stats/properties pages |
| FE-m2 | i18n arabe partiellement en Unicode escape |
| FE-m3 | useContracts pas de warning si adresse manquante |
| FE-m4 | Bank page pas de controle de role cote client |
| FE-m5 | Dashboard vide (recentActivity prevu mais non implemente) |

---

## 4. INFRASTRUCTURE — 14 findings

### 4.1 CRITIQUES (3)

#### IF-C1 : Secrets en clair dans docker-compose.yml
**Fichier :** `docker-compose.yml:33-34`
**Probleme :** `PRIVATE_KEY` (cle Hardhat #0) et `JWT_SECRET` hardcodes en clair dans le fichier commite.
**Fix :** Utiliser `.env.docker` (non commite) avec interpolation `${PRIVATE_KEY}`.

#### IF-C2 : deployed-addresses.json incomplet (Timelock vide)
**Fichier :** `deployed-addresses.json`
**Probleme :** `SafeLandTimelock: ""` — adresse vide. Le script deploy.js deploie bien Timelock mais le fichier n'a pas ete regenere.
**Fix :** Re-executer `npm run deploy:local` et verifier que toutes les adresses sont remplies.

#### IF-C3 : npm audit non strict en CI (|| true)
**Fichier :** `.github/workflows/ci.yml:131-138`
**Probleme :** `npm audit --audit-level=high || true` ignore les vulnerabilites HIGH.
**Fix :** Retirer `|| true` pour que le pipeline echoue sur des failles connues.

### 4.2 MAJEURS (6)

| ID | Description |
|----|-------------|
| IF-M1 | Healthchecks manquants pour backend et frontend dans Docker |
| IF-M2 | Adresses subgraph hardcodees a 0x0000...0000 (placeholder) |
| IF-M3 | startBlocks subgraph hardcodes a 0 (coutera cher en indexation) |
| IF-M4 | Reseau subgraph hardcode a "sepolia" (pas parametre) |
| IF-M5 | deploy.js contient 110 lignes de code duplique |
| IF-M6 | Multer en version LTS obsolete (v1.4.5) |

### 4.3 MINEURS (5)

| ID | Description |
|----|-------------|
| IF-m1 | Pas de reseau Docker explicite (bridge implicite) |
| IF-m2 | E2E Playwright limite a la branche main (pas sur les PR) |
| IF-m3 | Pas de caching npm pour subgraph en CI |
| IF-m4 | Mappings subgraph sans logging si entite absente |
| IF-m5 | Axios frontend legerement en retard (v1.7 vs v1.8) |

---

## 5. PLAN DE REMEDIATION PRIORITISE

### Phase 1 — Avant Sepolia (CRITIQUES)
1. Fix tokenId counter (SC-C1)
2. Fix Escrow race condition (SC-C2)
3. Fix Social Recovery incomplete (SC-C3)
4. Fix req.query injection (BE-C1)
5. Fix WebSocket memory leak (BE-C4)
6. Fix lock/unlock ownership (BE-C5)
7. Fix JWT localStorage → httpOnly (FE-C1)
8. Fix Timelock data hardcode (FE-M4)
9. Retirer secrets docker-compose (IF-C1)
10. Regenerer deployed-addresses.json (IF-C2)
11. Rendre npm audit strict en CI (IF-C3)

### Phase 2 — Avant production (MAJEURS)
9. Ajouter __gap[] a tous les contrats (SC-M1)
10. Fix Justice executeAction order (SC-M2)
11. Fix Fridda ↔ NFT sync (SC-M3)
12. Fix nonce replay (BE-M1)
13. Ajouter timeouts blockchain (BE-M4)
14. Normaliser les adresses (BE-M6)
15. Ajouter tests routes critiques (BE-M8)

### Phase 3 — Amelioration continue
16. Gas optimizations
17. Swagger complet
18. Pagination frontend
19. CSP headers
20. i18n labels notification

---

## 5. AMELIORATIONS PROPOSEES

### Architecture
- **Multi-sig admin** : Remplacer le signer unique backend par un multi-sig (Gnosis Safe) pour les operations critiques
- **Event sourcing** : Utiliser les events blockchain comme source de verite pour la DB SQLite (replay)
- **Circuit breaker** : Ajouter un pattern circuit breaker sur les appels RPC pour eviter les cascades d'erreurs

### Securite
- **Audit externe** : CertiK ou Trail of Bits avant mainnet
- **Bug bounty** : Programme Immunefi
- **Monitoring on-chain** : Forta ou OpenZeppelin Defender
- **CSP headers** : Content Security Policy stricte sur le frontend
- **HTTPS obligatoire** : Forcer TLS en production

### Performance
- **Indexation** : Deployer le subgraph TheGraph pour eviter les lectures on-chain lentes
- **Caching** : Redis ou in-memory cache pour les lectures frequentes (stats, properties)
- **Pagination** : Toutes les listes (properties, deals, successions) avec limit/offset

### Conformite
- **Declaration CNDP** : Enregistrement formel aupres de la Commission Nationale
- **Certification ISO 27001** : Demarrer le processus
- **Audit juridique** : Validation par un cabinet specialise en droit foncier marocain

---

**Statut de deploiement recommande :**
- Localhost : OK (avec precautions)
- Sepolia : Apres correction des 12 CRITIQUES
- Mainnet : Apres correction de TOUS les CRITIQUES + MAJEURS + audit externe

---

*Document genere le 15 mars 2026 — SafeLand Morocco v2.0*
