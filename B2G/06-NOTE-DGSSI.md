# Note Technique de Conformite Securite
## Direction Generale de la Securite des Systemes d'Information (DGSSI)

**Emetteur :** TachyDigital SARL
**Projet :** SafeLand — Plateforme Blockchain de Securisation Fonciere
**Date :** Mars 2026
**Classification :** Confidentiel

---

## 1. Objet

La presente note decrit les mesures de securite implementees dans la plateforme SafeLand, en vue de son evaluation par la DGSSI pour conformite aux exigences de souverainete numerique et de securite des systemes d'information.

---

## 2. Architecture de Securite

### 2.1 Vue d'Ensemble

```
┌─────────────────────────────────────────┐
│  Couche 5 — Donnees                     │
│  PII hashees, IPFS chiffre AES-256     │
├─────────────────────────────────────────┤
│  Couche 4 — Smart Contracts             │
│  RBAC, ReentrancyGuard, Pausable, UUPS │
├─────────────────────────────────────────┤
│  Couche 3 — Application                 │
│  JWT, signature MetaMask, RBAC backend  │
├─────────────────────────────────────────┤
│  Couche 2 — Transport                   │
│  TLS 1.3, CORS restreint, WebSocket    │
├─────────────────────────────────────────┤
│  Couche 1 — Infrastructure              │
│  Docker, Helmet, Rate Limiting          │
└─────────────────────────────────────────┘
```

### 2.2 Securite par Couche

| Couche | Mecanisme | Implementation |
|--------|-----------|---------------|
| Infrastructure | Containerisation Docker | Isolation des services |
| Infrastructure | Helmet (headers HTTP) | CSP, HSTS, X-Frame-Options |
| Infrastructure | Rate Limiting | 100 req/15min par IP |
| Transport | TLS 1.3 | Chiffrement bout-en-bout |
| Transport | CORS | Origins restreints |
| Application | JWT | Tokens signes, expiration 7j |
| Application | MetaMask | Signature cryptographique ECDSA |
| Application | RBAC | 9 roles distincts |
| Smart Contracts | AccessControl | Roles granulaires on-chain |
| Smart Contracts | ReentrancyGuard | Anti-reentrance |
| Smart Contracts | Pausable | Arret d'urgence |
| Smart Contracts | UUPS | Upgrade controlé (UPGRADER_ROLE) |
| Donnees | Hachage SHA-256 | PII jamais en clair on-chain |
| Donnees | AES-256 | Documents sensibles IPFS |
| Donnees | SQLite WAL | Integrite transactionnelle |

---

## 3. Authentification et Controle d'Acces

### 3.1 Flux d'Authentification

```
1. Client → GET /auth/nonce/:address     → Serveur genere nonce unique
2. Client → MetaMask signe le nonce      → Signature ECDSA
3. Client → POST /auth/login (signature) → Serveur verifie, emet JWT
4. Client → Requetes avec Bearer JWT     → Serveur decode et verifie role
```

### 3.2 Matrice des Roles

| Role | NFT | Escrow | Fridda | Justice | Bank | Timelock |
|------|-----|--------|--------|---------|------|----------|
| admin | Pause, Upgrade | Pause | - | - | - | - |
| agent | CRUD, Charges | - | - | - | - | - |
| notary | - | CRUD, Complete | CRUD, Distribute | - | - | - |
| justice | Freeze, Override | - | - | Propose, Execute | - | - |
| judge | - | - | - | Sign, Execute | - | - |
| conservator | - | - | - | Recovery | - | - |
| owner | Lock/Unlock | Sign | Vote | - | - | - |
| buyer | - | Fund | - | - | - | - |
| bank | - | - | - | - | Score, Hypotheque | - |

### 3.3 Protection des Cles

- **Cle privee backend** : Variable d'environnement (`PRIVATE_KEY`), jamais commitee
- **Cles utilisateurs** : Gerees par MetaMask (jamais transmises au serveur)
- **JWT Secret** : Variable d'environnement (`JWT_SECRET`)
- **Cles Pinata** : Variables d'environnement (`PINATA_API_KEY`, `PINATA_API_SECRET`)

---

## 4. Securite des Smart Contracts

### 4.1 Standards Utilises

| Standard | Version | Usage |
|---------|---------|-------|
| OpenZeppelin Contracts Upgradeable | v5.x | Base de tous les contrats |
| ERC-721 | Standard | Titres fonciers NFT |
| ERC-1155 | Standard | Parts successorales Fridda |
| EIP-1822 (UUPS) | Standard | Upgrade sans migration |

### 4.2 Audits Realises

| Audit | Date | Resultat |
|-------|------|----------|
| Slither (interne) | Fevrier 2026 | 26 findings, 4 corriges, 22 acceptes |
| Analyse approfondie | Mars 2026 | 12 critiques identifies, plan de remediation |
| CertiK/Trail of Bits (externe) | Planifie T3 2026 | - |

### 4.3 Vulnerabilites et Remediations

Les 12 problemes critiques identifies ont ete documentes dans le rapport d'audit technique (AUDIT-TECHNIQUE-COMPLET.md) avec un plan de remediation priorise :
- Phase 1 (avant testnet) : 8 corrections critiques
- Phase 2 (avant production) : 7 corrections majeures
- Phase 3 (amelioration continue) : optimisations

---

## 5. Protection des Donnees

### 5.1 Donnees On-Chain (Blockchain)

| Type | Stockage | Protection |
|------|----------|-----------|
| Adresses wallet | On-chain (public) | Pseudonyme (pas de PII) |
| Donnees fonciers | On-chain | Titre, surface, GPS (donnees publiques) |
| Hashes documents | On-chain | SHA-256 (irreversible) |
| Historique mutations | On-chain | Immutable |

### 5.2 Donnees Off-Chain

| Type | Stockage | Protection |
|------|----------|-----------|
| JWT tokens | Memoire client | Expiration 7j |
| Nonces auth | SQLite (backend) | Usage unique, 24h |
| Roles utilisateurs | SQLite | Chiffrement WAL |
| Documents sensibles | IPFS (Pinata) | Chiffrement AES-256 |
| Logs applicatifs | Fichiers serveur | Pas de PII |

### 5.3 Conformite Loi 09-08

- PII jamais en clair sur la blockchain
- Principe de minimisation respecte
- Declaration CNDP preparee (voir 04-DECLARATION-CNDP.md)
- DPO a designer

---

## 6. Infrastructure et Disponibilite

### 6.1 Architecture Deploiement

| Service | Technologie | Haute Disponibilite |
|---------|------------|---------------------|
| Blockchain | Polygon PoS (reseau public) | Decentralise (> 100 validateurs) |
| Backend | Express.js + Docker | Scalable horizontalement |
| Frontend | Next.js standalone | CDN + load balancer |
| Base de donnees | SQLite WAL | Backup quotidien |
| IPFS | Pinata (cloud) | Replication multi-noeud |

### 6.2 Monitoring

- Logs applicatifs (morgan + winston)
- Health checks Docker
- Alerting sur erreurs critiques
- Monitoring on-chain prevu (Forta/OpenZeppelin Defender)

### 6.3 Plan de Reprise d'Activite (PRA)

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| Panne backend | 15 min | 0 (stateless) | Redemarrage Docker |
| Panne base SQLite | 1h | 24h (backup) | Restauration backup |
| Panne IPFS | 4h | 0 (hashes on-chain) | Switch vers fallback |
| Panne blockchain | 0 | 0 | Reseau decentralise, auto-recovery |

---

## 7. Tests et Validation

| Type de test | Outil | Couverture |
|-------------|-------|-----------|
| Tests unitaires SC | Mocha + Chai | 206 tests, 6 suites |
| Tests unitaires backend | Jest + Supertest | 167 tests, 7 suites |
| Tests E2E | Playwright | Prevu (Chromium + mobile) |
| Analyse statique | Slither | 6 contrats |
| CI/CD | GitHub Actions | 7 jobs automatises |
| Audit securite | Interne + externe | En cours |

---

## 8. Recommandations pour Hebergement Souverain

Si la DGSSI exige un hebergement souverain (data center marocain) :

1. **Option 1** : Cloud souverain marocain (si disponible)
2. **Option 2** : Data center prive avec Docker Compose
3. **Option 3** : Cloud europeen avec garanties contractuelles (AWS Paris, OVH)

La blockchain Polygon reste publique (donnees non sensibles uniquement). Seuls le backend et la base de donnees necessitent un hebergement souverain.

---

## 9. Conclusion

La plateforme SafeLand met en oeuvre une defense en profondeur (5 couches de securite) conforme aux bonnes pratiques de l'industrie et aux standards OpenZeppelin. Un audit externe est planifie avant le deploiement en production.

Nous sommes a la disposition de la DGSSI pour toute demande d'information complementaire ou pour une evaluation technique approfondie.

---

**Contact :** security@tachydigital.ma
**TachyDigital SARL**
