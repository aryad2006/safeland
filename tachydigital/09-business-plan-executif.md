# BUSINESS PLAN EXÉCUTIF

# TACHYDIGITAL S.A.R.L.

---

## « Construire l'infrastructure de confiance numérique du foncier marocain »

---

**Document confidentiel — Usage investisseurs et partenaires institutionnels**

**Date :** [DATE]
**Version :** 1.0

---

# RÉSUMÉ EXÉCUTIF

**TACHYDIGITAL** est une startup deeptech marocaine qui développe **SafeLand**, la première plateforme souveraine de tokenisation du foncier sur la blockchain. Notre technologie transforme chaque titre de propriété en un Titre Numérique Fongible (TNF) sécurisé, divisible et programmable.

### Le problème
- ~68 000 litiges fonciers/an au Maroc
- >15 milliards MAD de pertes économiques annuelles
- 12% de fraudes documentaires
- Indivision successorale bloquant des millions de biens
- Délai de transaction de 3 à 6 mois

### Notre solution
- **1 Titre foncier = 1 TNF** sur blockchain souveraine
- **Fractionnement numérique** pour l'héritage et la copropriété
- **Escrow notarial** automatisé avec prélèvements fiscaux
- **Multi-signature judiciaire** pour l'exécution des décisions de justice
- **Escrow d'État** garantissant la continuité du service public

### Le marché
- **TAM** : 800 milliards MAD (foncier national)
- **SAM** : 120 milliards MAD (foncier immatriculé)
- **SOM** : 6 milliards MAD (5% à 3 ans) + Expansion Afrique

### Le modèle économique
- SaaS B2G (licence annuelle 2M MAD)
- Frais transactionnels (500 MAD/titre, 0,5% par transfert)
- Break-even à Mois 18
- ROI x5 à 5 ans

### Le besoin
- **Phase Seed** : 4 870 000 MAD (R&D + pilote)
- **Série A** : 30 000 000 MAD (déploiement national)

---

# 1. LE PROBLÈME

## 1.1 Chiffres clés

Le système foncier marocain, malgré les efforts de modernisation de l'ANCFCC, souffre de failles structurelles majeures :

| Indicateur | Valeur | Source |
|------------|--------|--------|
| Nombre de titres fonciers | ~5 millions | ANCFCC |
| Litiges fonciers annuels | ~68 000 | Ministère de la Justice |
| Part dans les affaires civiles | ~30% | Rapports judiciaires |
| Fraudes documentaires | 12% des transactions | Estimations sectorielles |
| Délai moyen de transaction | 3-6 mois | Pratique notariale |
| Pertes économiques annuelles | >15 milliards MAD | Études économiques |
| Biens en indivision bloqués | Millions | Estimations |
| Terres Soulalyates | ~15 millions d'hectares | Ministère de l'Intérieur |

## 1.2 Les victimes

- **Propriétaires légitimes** spoliés par la fraude documentaire
- **Héritiers** incapables de vendre ou exploiter leur part d'un bien indivis
- **MRE** victimes de procurations frauduleuses
- **Ayants droit Soulalyates** dont les droits de jouissance sont contestés
- **Investisseurs** freinés par l'insécurité juridique
- **L'État** qui perd des recettes fiscales et judiciaires

---

# 2. LA SOLUTION : SAFELAND / MOROCCO LAND TRUST

## 2.1 Concept

SafeLand crée un **registre foncier parallèle et complémentaire** sur blockchain, synchronisé avec les registres officiels de l'ANCFCC. Chaque propriété reçoit un Titre Numérique Fongible (TNF) qui :

- Est **unique** et **infalsifiable** (pas de duplication possible)
- Est **divisible** (fractionnement pour héritiers/copropriétaires)
- Est **programmable** (règles de transfert codées dans le smart contract)
- Est **traçable** (historique complet et immuable)
- Est **sous gouvernance étatique** (l'État détient les clés maîtresses)

## 2.2 Les 5 modules

| Module | Fonction | Contrat |
|--------|----------|---------|
| **SafeLandNFT** | Tokenisation des propriétés (ERC-721) | ~427 lignes Solidity |
| **SafeLandRegistry** | Registre foncier avec RBAC 6 rôles | ~252 lignes |
| **SafeLandEscrow** | Escrow notarial avec prélèvements DGI/ANCFCC | ~291 lignes |
| **SafeLandFridda** | Gestion de l'indivision (ERC-1155) + votes | ~227 lignes |
| **SafeLandJustice** | Multi-sig judiciaire + override | ~120 lignes |

## 2.3 Avantage compétitif

| Critère | Papier | Digital classique | **SafeLand (TNF)** |
|---------|--------|-------------------|--------------------|
| Sécurité | Faillible | Piratable | **Blockchain** |
| Vitesse | Mois | Jours | **Secondes** |
| Fractionnement | Impossible | Limité | **Natif** |
| Exécution judiciaire | Lente | Manuelle | **Automatique** |
| Continuité | Agent-dépendant | Prestataire-dépendant | **État garanti** |
| Coût par transaction | Élevé | Moyen | **Minimal** |

---

# 3. LE MARCHÉ

## 3.1 Dimensionnement

| Segment | Valeur estimée | Description |
|---------|----------------|-------------|
| **TAM** | 800 milliards MAD | Valeur totale du foncier marocain |
| **SAM** | 120 milliards MAD | Foncier immatriculé et actif |
| **SOM** (An 3) | 6 milliards MAD | 5% du SAM à 3 ans |

## 3.2 Segments de marché

| Segment | Taille | Priorité |
|---------|--------|----------|
| **ANCFCC** (Conservation Foncière) | National | 🎯 Priorité 1 |
| **Notaires** | ~4 000 au Maroc | Priorité 2 |
| **Adouls** | ~5 000 au Maroc | Priorité 2 |
| **Tribunaux** | Toutes les juridictions | Priorité 3 |
| **Banques** (crédit immobilier) | Tout le secteur | Priorité 3 |
| **Assurances** (titre) | Émergent | Priorité 4 |
| **Expansion Afrique** | 4 pays cibles | Priorité 5 |

## 3.3 Concurrence

Il n'existe actuellement **aucune solution blockchain de tokenisation foncière** déployée au Maroc. Les solutions existantes sont :

| Solution | Type | Limite |
|----------|------|--------|
| Système ANCFCC actuel | Registre centralisé | Pas de blockchain, pas de fractionnement |
| Solutions cadastrales étrangères | SaaS centralisé | Pas de souveraineté, pas de TNF |
| Projets blockchain internationaux (Propy, RealT) | Tokenisation immobilière | Non adaptés au droit marocain, non souverains |

**Tachydigital est le premier acteur au Maroc à proposer une solution de tokenisation foncière conforme au droit marocain et sous gouvernance étatique.**

---

# 4. MODÈLE ÉCONOMIQUE

## 4.1 Sources de revenus

| Source | Description | Tarif | Récurrence |
|--------|-------------|-------|------------|
| **Licence SaaS** | Accès plateforme pour l'État/ANCFCC | 2 000 000 MAD/an | Annuelle |
| **Tokenisation** | Création d'un TNF par propriété | 500 MAD/titre | Par acte |
| **Commission** | % sur chaque transfert foncier | 0,5% | Par transaction |
| **Escrow** | Frais d'utilisation de l'escrow | 100 MAD/deal | Par transaction |
| **API B2B** | Accès API pour partenaires (banques, assurances) | Variable | Abonnement |
| **Formation** | Formation agents ANCFCC, notaires, adouls | Forfait | Ponctuelle |
| **Licences régionales** | Extension à d'autres pays | Variable | Annuelle |

## 4.2 Projection sur 3 ans

### Revenus

| Source | An 1 | An 2 | An 3 |
|--------|------|------|------|
| Licence SaaS | 500 000 | 2 000 000 | 2 500 000 |
| Tokenisation (x titres) | 500 000 (1 000 titres) | 2 500 000 (5 000) | 5 000 000 (10 000) |
| Commissions | 100 000 | 500 000 | 2 000 000 |
| Formation & Consulting | 240 000 | 500 000 | 500 000 |
| API B2B | 0 | 500 000 | 2 000 000 |
| Licences régionales | 0 | 0 | 3 000 000 |
| **Total revenus** | **1 340 000** | **6 000 000** | **15 000 000** |

### Charges

| Poste | An 1 | An 2 | An 3 |
|-------|------|------|------|
| Salaires & charges | 2 400 000 | 3 600 000 | 5 000 000 |
| Infrastructure Cloud | 480 000 | 600 000 | 800 000 |
| Audit & Sécurité | 400 000 | 200 000 | 300 000 |
| Juridique & Conformité | 370 000 | 200 000 | 200 000 |
| Marketing & Communication | 300 000 | 500 000 | 600 000 |
| Matériel & Licences | 220 000 | 100 000 | 150 000 |
| Déplacements | 250 000 | 200 000 | 300 000 |
| Bureaux & Domiciliation | 120 000 | 200 000 | 300 000 |
| Imprévus | 330 000 | 400 000 | 350 000 |
| **Total charges** | **4 870 000** | **6 000 000** | **8 000 000** |

### Résultat

| Indicateur | An 1 | An 2 | An 3 |
|------------|------|------|------|
| **Résultat net** | **-3 530 000** | **0** | **+7 000 000** |
| **Résultat cumulé** | -3 530 000 | -3 530 000 | +3 470 000 |

**Break-even prévisionnel : Fin Année 2**

---

# 5. STRATÉGIE COMMERCIALE B2G

## 5.1 Approche go-to-market

Le modèle B2G impose une approche institutionnelle structurée :

### Phase 1 — Crédibilité (Mois 1-3)

- Obtention du Label Startup Innovante (ADD)
- Inscription sur la plateforme des marchés publics (TGR)
- Qualification auprès du MTNRA
- Présentation à l'ANCFCC et à l'ADD

### Phase 2 — Pilote (Mois 4-8)

- Convention de partenariat avec l'ANCFCC pour 1 site pilote
- Tokenisation de 1 000 titres
- Formation des agents de la conservation + notaires locaux

### Phase 3 — Extension (Mois 9-18)

- Extension à 12 conservations foncières
- Convention avec le Ministère de la Justice pour le module Justice
- Intégration avec le système d'information de l'ANCFCC

### Phase 4 — National (Mois 18-36)

- Déploiement national (+100 000 titres)
- Intégration complète avec tous les systèmes étatiques

## 5.2 Partenaires stratégiques visés

| Partenaire | Rôle | Statut |
|------------|------|--------|
| **ANCFCC** | Client principal + validateur | À contacter |
| **ADD** | Label + soutien institutionnel | À contacter |
| **Ordre des Notaires** | Utilisateurs operateurs | À contacter |
| **Ordre des Adouls** | Utilisateurs operateurs | À contacter |
| **Ministère de la Justice** | Module Justice | À contacter |
| **CNDP** | Conformité données | À contacter |
| **Tamwilcom** | Financement | À contacter |
| **CDG / Finéa** | Co-investissement | À contacter |

---

# 6. BESOIN DE FINANCEMENT

## 6.1 Levée Seed : 4 870 000 MAD

| Poste | Allocation | % |
|-------|-----------|---|
| Développement & R&D | 2 200 000 | 45% |
| Salaires & charges (12 mois) | 1 200 000 | 25% |
| Infrastructure & Hébergement | 480 000 | 10% |
| Juridique, conformité & audit | 370 000 | 8% |
| Marketing & Communication | 300 000 | 6% |
| Imprévus & trésorerie | 320 000 | 6% |
| **TOTAL** | **4 870 000** | **100%** |

## 6.2 Sources de financement visées

| Source | Type | Montant visé |
|--------|------|-------------|
| **Fonds propres** | Capital + apports fondateurs | 100 000 - 500 000 MAD |
| **Tamwilcom** | Garantie / co-financement | 1 000 000 - 2 000 000 MAD |
| **Innov Invest** | Fonds d'amorçage dédié startup | 1 000 000 - 3 000 000 MAD |
| **ADD** | Subvention / Label | Variable |
| **Business Angels** | Investissement privé | 500 000 - 1 000 000 MAD |
| **Série A (18 mois)** | VC + institutionnels | 30 000 000 MAD |

## 6.3 Utilisation des fonds Série A (30M MAD)

| Poste | Allocation | % |
|-------|-----------|---|
| Développement & R&D | 12 000 000 | 40% |
| Juridique & Conformité | 4 500 000 | 15% |
| Marketing & Développement commercial | 4 500 000 | 15% |
| Infrastructure & Sécurité | 4 500 000 | 15% |
| Opérations & Administration | 3 000 000 | 10% |
| Réserve stratégique | 1 500 000 | 5% |
| **TOTAL** | **30 000 000** | **100%** |

---

# 7. ÉQUIPE

## 7.1 Fondateur

- **[NOM ET PRÉNOM]** — CEO / Fondateur — Vision stratégique, connaissance du marché marocain et de la technologie blockchain

## 7.2 Recrutements prioritaires (Phase Seed)

| Poste | Profil | Salaire mensuel estimé |
|-------|--------|----------------------|
| **CTO** | Expert Blockchain / Solidity / Architecture | 25 000 - 35 000 MAD |
| **Lead Developer** | Full-stack Next.js / Express.js / ethers.js | 18 000 - 25 000 MAD |
| **Dev Blockchain** | Solidity / Smart Contracts / Tests | 15 000 - 22 000 MAD |
| **Business Developer B2G** | Relations institutionnelles / Marchés publics | 15 000 - 20 000 MAD |

## 7.3 Équipe cible (14 personnes — An 2)

5 pôles : Direction (2), Blockchain (4), Web (3), Produit (2), Commercial/Juridique (3)

---

# 8. RISQUES ET ATTÉNUATION

| Risque | Probabilité | Impact | Atténuation |
|--------|-------------|--------|-------------|
| Rejet par les institutions | Moyen | Élevé | Note de cadrage, pilote à petite échelle, conformité stricte |
| Cadre réglementaire blockchain flou | Moyen | Moyen | Vocabulaire adapté (TNF vs crypto), conformité Loi 43-20 |
| Concurrence internationale | Faible | Moyen | Avantage local (SARL marocaine, droit marocain, préférence nationale) |
| Défaillance technique | Faible | Élevé | Audit sécurité, tests exhaustifs, monitoring 24/7 |
| Retard de déploiement | Moyen | Moyen | Planning avec marges, MVP fonctionnel existant |
| Résistance au changement | Élevé | Moyen | Formation intensive, interface simplifiée, accompagnement terrain |

---

**TACHYDIGITAL S.A.R.L.**

**Contact : [NOM] — contact@tachydigital.ma — [TÉLÉPHONE]**
