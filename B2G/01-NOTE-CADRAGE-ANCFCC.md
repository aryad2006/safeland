# Note de Cadrage — Partenariat SafeLand / ANCFCC
## Projet de Securisation Fonciere par Blockchain

**Destinataire :** Direction Generale de l'ANCFCC
**Emetteur :** TachyDigital SARL
**Date :** Mars 2026
**Classification :** Confidentiel

---

## 1. Objet

La presente note propose a l'Agence Nationale de la Conservation Fonciere, du Cadastre et de la Cartographie (ANCFCC) un partenariat technologique pour la mise en place d'une infrastructure blockchain de securisation des titres fonciers marocains.

Le projet SafeLand transforme chaque titre foncier en un NFT (Non-Fungible Token) infalsifiable sur blockchain, eliminant les risques de fraude documentaire, accelerant les transactions et automatisant la perception fiscale.

---

## 2. Contexte et Problematique

### 2.1 Defis Actuels

Le systeme foncier marocain, malgre les efforts de modernisation de l'ANCFCC (portail en ligne, e-services), fait face a des vulnerabilites structurelles :

- **68 000 litiges fonciers/an** engorgent les tribunaux
- **~12% des transactions** presentent des anomalies detectables
- **Perte economique estimee** : > 15 milliards MAD/an
- **Spoliation des MRE** : 5 millions de Marocains a l'etranger vulnerables
- **Successions bloquees** : milliers de biens en indivision

### 2.2 Limites des Solutions Actuelles

Les systemes centralises (base de donnees ANCFCC) restent vulnerables a la modification retroactive, n'offrent pas de tracabilite immutable, et ne permettent pas l'automatisation des processus metier (fiscalite, succession, justice).

---

## 3. Solution Proposee

### 3.1 Architecture SafeLand

SafeLand est une plateforme composee de 6 smart contracts deployes sur blockchain (EVM), operant en modele B2G :

| Module | Fonction | Benefice ANCFCC |
|--------|----------|-----------------|
| SafeLandNFT | Titre foncier numerique (ERC-721) | Registre immutable |
| SafeLandRegistry | Index centralise + stats | Dashboard decisonnel |
| SafeLandEscrow | Sequestre vente + fiscalite | Perception 1% automatique |
| SafeLandFridda | Succession 24 parts (ERC-1155) | Deblocage indivisions |
| SafeLandJustice | Multi-sig judiciaire | Gel/remint instantane |
| SafeLandTimelock | Operations differees | Gouvernance transparente |

### 3.2 Etat d'Avancement

| Element | Statut |
|---------|--------|
| Smart contracts (6) | Developpes et testes (206 tests) |
| Backend API | Operationnel (167 tests, 8 routes) |
| Frontend | 9 pages, i18n FR/EN/AR |
| CI/CD | 7 jobs GitHub Actions |
| Docker | Deploiement one-click |
| **Total tests** | **373** |

### 3.3 Role de l'ANCFCC

L'ANCFCC occuperait le role de **validateur souverain** dans l'architecture SafeLand :

- **AGENT_ROLE** : Creation des NFTs (mint), transferts, gestion des charges
- **Panic Button** : Pause d'urgence de tout le systeme
- **Dashboard** : Acces au tableau de bord decisonnel (stats nationales)
- **Wallet fiscal** : Reception automatique de 1% sur chaque transaction

L'ANCFCC conserve la **prerogative exclusive** de validation des titres. SafeLand ne fait que fournir l'infrastructure technologique.

---

## 4. Benefices Attendus

### 4.1 Pour l'ANCFCC

| Benefice | Impact Mesurable |
|----------|-----------------|
| Elimination fraude documentaire | -80% cas detectes |
| Acceleration transactions | 3-6 mois → < 30 secondes |
| Perception automatique frais conservation | 1% at-the-source, taux 100% |
| Tracabilite complete | Audit trail immutable |
| Modernisation image | Alignement Plan Maroc Digital 2030 |

### 4.2 Pour l'Etat

| Benefice | Impact |
|----------|--------|
| Recouvrement fiscal DGI | +20% (4% at-the-source) |
| Desengorgement tribunaux | -80% litiges fonciers |
| Protection citoyens | Travel Lock, Social Recovery |
| Souverainete numerique | Infrastructure sous controle regalien |

---

## 5. Proposition de Pilote

### 5.1 Perimetre

| Parametre | Valeur |
|-----------|--------|
| Conservations pilotes | 3 (Casablanca, Rabat, Marrakech) |
| Titres a tokeniser | 1 000 (phase pilote) |
| Agents a former | 20 |
| Duree | 6 mois |
| Reseau blockchain | Polygon PoS (Layer 2) |

### 5.2 Deroulement

| Phase | Duree | Activite |
|-------|-------|----------|
| Mois 1 | Setup | Deploy reseau, configuration, tests d'integration |
| Mois 2 | Formation | Formation 20 agents ANCFCC |
| Mois 3-4 | Tokenisation | Conversion de 1 000 titres existants |
| Mois 5 | Operations | Transactions reelles (ventes, charges, successions) |
| Mois 6 | Evaluation | Bilan, KPI, rapport d'impact |

### 5.3 Livrables

1. Plateforme deployee et operationnelle
2. 1 000 NFTs correspondant a 1 000 titres reels
3. 20 agents formes et autonomes
4. Rapport d'evaluation avec KPIs mesures
5. Proposition d'extension regionale

---

## 6. Modele Financier

### 6.1 Cout du Pilote

| Poste | Montant (MAD) |
|-------|---------------|
| Infrastructure cloud (6 mois) | 180 000 |
| Formation agents (20 x 2 000) | 40 000 |
| Support technique dedié | 120 000 |
| Audit securite externe | 400 000 |
| Frais de deplacement | 60 000 |
| **Total pilote** | **800 000** |

### 6.2 Revenus Generes

Pendant le pilote, l'ANCFCC percevrait automatiquement 1% sur chaque transaction Escrow. Avec un volume moyen de 500 transactions a 500 000 MAD, cela represente **2 500 000 MAD** de revenus automatiques.

### 6.3 Modele Post-Pilote

| Source | Description |
|--------|-------------|
| Licence SaaS | Forfait annuel pour l'infrastructure |
| Frais de transaction | Commission sur les operations |
| Formation | Forfait par agent forme |
| Maintenance | Support et evolution |

---

## 7. Conformite

### 7.1 Cadre Legal

Le projet SafeLand est concu pour etre 100% conforme au cadre legal marocain :

- **Loi 39-08** : Conservation fonciere — NFT comme extension du titre
- **Loi 43-20** : Signature electronique qualifiee (MetaMask)
- **Loi 09-08** : Protection donnees (PII jamais on-chain)
- **Loi 53-05** : Horodatage blockchain comme preuve

### 7.2 Securite

- Audit interne realise (Slither)
- Audit externe prevu (CertiK/Trail of Bits)
- Pattern UUPS (upgrade sans migration)
- Multi-sig pour operations critiques
- Chiffrement AES-256 pour documents sensibles

---

## 8. Prochaines Etapes

1. **Presentation** : Demo live de la plateforme a la Direction ANCFCC
2. **Lettre d'intention** : Signature d'une LOI pour le pilote
3. **Convention PPP** : Redaction et signature de la convention
4. **Setup technique** : Deploy sur reseau Polygon, configuration
5. **Formation** : 20 agents sur 2 semaines
6. **Lancement pilote** : 3 conservations, 1 000 titres, 6 mois

---

**Contact :**
TachyDigital SARL
Email : contact@tachydigital.ma
Site : www.safeland.ma
