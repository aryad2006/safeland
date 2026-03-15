# Dossier de Candidature — Label Startup Innovante
## Agence de Developpement du Digital (ADD)

**Candidat :** TachyDigital SARL
**Projet :** SafeLand — Plateforme NFT de Securisation Fonciere
**Date :** Mars 2026

---

## 1. Identification de l'Entreprise

| Champ | Valeur |
|-------|--------|
| Denomination sociale | TachyDigital SARL |
| Forme juridique | SARL de droit marocain |
| Capital social | 100 000 MAD |
| Siege social | [Adresse - a completer] |
| N° RC | [A completer apres immatriculation] |
| N° IF | [A completer apres immatriculation] |
| Secteur d'activite | PropTech / RegTech / Blockchain |
| Date de creation | [A completer] |
| Effectif actuel | [A completer] |

---

## 2. Description du Projet Innovant

### 2.1 Resume

SafeLand est une plateforme blockchain B2G qui transforme les titres fonciers marocains en NFT (ERC-721) infalsifiables. Elle automatise les transactions immobilieres, les successions et les interventions judiciaires via 6 smart contracts, dans le respect du cadre legal marocain.

### 2.2 Probleme Resolu

- 68 000 litiges fonciers/an au Maroc
- > 15 milliards MAD de perte economique annuelle
- Fraude documentaire sur ~12% des transactions
- Successions bloquees en indivision
- Spoliation des MRE a distance

### 2.3 Innovation Technologique

| Innovation | Description |
|-----------|-------------|
| NFT Foncier (ERC-721) | Premier token non-fongible representant un titre foncier marocain |
| Fiscalite at-the-source | Smart contract de sequestre avec prelevement automatique (DGI 4% + ANCFCC 1%) |
| Fridda (ERC-1155) | Module de succession fractionnee en 24 parts conforme au droit islamique |
| Justice Multi-sig | Gel et burn/remint par multi-signature de magistrats |
| Travel Lock | Verrou cryptographique anti-spoliation pour les MRE |
| UUPS Upgradeable | 6 contrats evolutifs sans migration de donnees |

### 2.4 Differenciateur

Aucune solution concurrente n'offre simultanement :
- La tokenisation fonciere conforme au droit marocain
- La fiscalite automatique at-the-source
- Un module de succession (Fridda) aligne sur la Moudawana
- Un protocole judiciaire multi-signature

---

## 3. Etat d'Avancement Technique

### 3.1 Produit

| Composant | Lignes de code | Tests | Statut |
|-----------|---------------|-------|--------|
| Smart Contracts (6) | ~2 672 (Solidity) | 206 | Operationnel |
| Backend API | ~2 000 (Node.js) | 167 | Operationnel |
| Frontend | ~3 000 (Next.js) | E2E prevus | Operationnel |
| Subgraph TheGraph | ~474 (TypeScript) | Build OK | Operationnel |
| CI/CD | 7 jobs | - | Automatise |
| Docker | 4 services | - | Operationnel |

**Total : 373 tests automatises**

### 3.2 Stack Technique

- Solidity 0.8.24 + OpenZeppelin v5 (UUPS)
- Hardhat 2.22+ (framework blockchain)
- Node.js 20 + Express 4.18 (backend)
- Next.js 14 + React 18 + Tailwind CSS (frontend)
- ethers.js v6 (interaction blockchain)
- SQLite WAL + Pinata IPFS (stockage)
- GitHub Actions CI/CD (7 jobs)

### 3.3 Propriete Intellectuelle

- Code source : depot prevu aupres de l'OMPIC
- Marque : demande de marque "SafeLand" en cours
- Architecture : documentation complete (Livre Blanc, CDC)

---

## 4. Modele Economique

### 4.1 Modele B2G (Business to Government)

SafeLand fournit une infrastructure technologique a l'Etat marocain sous forme de SaaS multi-tenant :

| Source de revenu | Description |
|-----------------|-------------|
| Licence SaaS | Acces annuel par institution |
| Frais de tokenisation | Par titre foncier tokenise |
| Commission transactions | Pourcentage sur ventes Escrow |
| Formation | Par agent forme |
| Maintenance | Support annuel |
| Premium MRE | Abonnement surveillance |

### 4.2 Projections

| | An 1 | An 2 | An 3 |
|---|------|------|------|
| Revenus | 2,84 M MAD | 6 M MAD | 10+ M MAD |
| Couts | 4,87 M MAD | 2,5 M MAD | 3 M MAD |
| NFT crees | 10 000 | 50 000 | 200 000 |
| Break-even | - | An 2 | - |

### 4.3 Marche

| Segment | Taille |
|---------|--------|
| TAM (marche foncier Maroc) | 800 Mds MAD |
| SAM (transactions annuelles) | 120 Mds MAD |
| SOM (penetration An 3, 5%) | 6 Mds MAD |

---

## 5. Conformite Reglementaire

| Loi | Conformite |
|-----|-----------|
| Loi 39-08 (Conservation Fonciere) | NFT = extension numerique du titre |
| Loi 43-20 (Services de confiance) | Signature electronique MetaMask |
| Loi 09-08 (CNDP) | PII jamais on-chain |
| Loi 53-05 (Echange electronique) | Horodatage blockchain |
| Moudawana (Code Famille) | Fridda conforme |

---

## 6. Equipe

### 6.1 Equipe Actuelle

[A completer avec les profils reels des fondateurs/associes]

### 6.2 Equipe Cible (14 personnes)

| Pole | Profils | Effectif |
|------|---------|---------|
| Management | Chef de Projet, Product Owner | 2 |
| Blockchain | Architecte Senior, Dev Solidity | 3 |
| Full-Stack | Dev Backend, Dev Frontend | 4 |
| Infra & Securite | DevOps, Security Engineer | 2 |
| Design & QA | UI/UX, QA Engineer | 2 |
| Juridique | Juriste foncier | 1 |

---

## 7. Besoin de Financement

### 7.1 Phase Seed

| Poste | Montant (MAD) |
|-------|---------------|
| Salaires equipe (12 mois) | 3 360 000 |
| Infrastructure cloud | 360 000 |
| Audit securite externe | 400 000 |
| Licences & outils | 150 000 |
| Juridique & conformite | 200 000 |
| Formation & deplacement | 200 000 |
| Reserve (10%) | 200 000 |
| **Total Seed** | **4 870 000** |

### 7.2 Serie A (post-pilote)

30 000 000 MAD pour scaling national (75 conservations, 100K+ titres).

---

## 8. Criteres Label Startup Innovante

| Critere ADD | Reponse SafeLand |
|------------|------------------|
| Caractere innovant | Premier cadastre blockchain au Maroc, 6 modules uniques |
| Potentiel de croissance | Marche de 800 Mds MAD, scalable a l'Afrique |
| Equipe | [A completer] |
| Modele economique viable | ROI positif An 2, revenus recurrents SaaS |
| Impact societal | Securisation 5M titres, protection MRE, deblocage successions |
| Maturite technique | 373 tests, CI/CD, Docker, pret pour pilote |

---

## 9. Pieces Jointes

1. Livre Blanc V2 (LIVRE-BLANC-V2.md)
2. Cahier des Charges V3 (CDC-COMPLET-V3.md)
3. Business Plan Executif (tachydigital/09-business-plan)
4. Rapport d'Audit Technique (AUDIT-TECHNIQUE-COMPLET.md)
5. Statuts SARL (tachydigital/01-statuts)
6. Note de Cadrage ANCFCC (01-NOTE-CADRAGE-ANCFCC.md)

---

*TachyDigital SARL — Candidature Label Startup Innovante ADD*
