# NOTE DE CADRAGE INSTITUTIONNELLE

# PROJET « MOROCCO LAND TRUST »

---

## Digitalisation, sécurisation et fractionnement du foncier marocain
## par la technologie des Titres Numériques Fongibles (TNF)

---

**Porteur du projet : TACHYDIGITAL S.A.R.L.**

**Destiné à :**
- Ministère de la Transition Numérique et de la Réforme de l'Administration (MTNRA)
- Agence Nationale de la Conservation Foncière, du Cadastre et de la Cartographie (ANCFCC)
- Agence de Développement du Digital (ADD)
- Ministère de l'Intérieur — Direction des Affaires Rurales (terres Soulalyates)
- Ministère de la Justice

---

## DOCUMENT CONFIDENTIEL

**Version :** 1.0
**Date :** [DATE]
**Classification :** Confidentiel — Usage institutionnel uniquement

---

# 1. CONTEXTE ET ENJEUX NATIONAUX

## 1.1 Le défi foncier marocain

Le foncier constitue le socle de la souveraineté économique du Royaume. Pourtant, le système actuel de gestion des titres de propriété fait face à des défis structurels majeurs :

| Problématique | Ampleur | Conséquence |
|---------------|---------|-------------|
| **Litiges fonciers** | ~68 000 affaires/an | 30% des affaires civiles — engorgement judiciaire |
| **Fraude documentaire** | 12% des transactions | Spoliation foncière, perte de confiance |
| **Indivision successorale** | Des millions de biens bloqués | Gel de l'investissement, conflits familiaux |
| **Délai de transaction** | 3 à 6 mois | Frein à l'activité économique |
| **Terres Soulalyates** | ~15 millions d'hectares | Droits de jouissance mal documentés |
| **Melk non immatriculé** | ~40% du foncier national | Absence de sécurité juridique |
| **Investissements MRE** | Des milliards de MAD | Vulnérabilité aux abus de procuration |
| **Perte économique globale** | >15 milliards MAD/an | Impact direct sur le PIB |

## 1.2 Les limites du système actuel

Le système de gestion foncière, hérité du Dahir de 1913, repose sur des registres papier et des procédures physiques qui :

- Ne garantissent pas l'intégrité des documents face à la contrefaçon moderne ;
- Ne permettent pas le fractionnement efficient dans les cas de copropriété et d'héritage ;
- Ne facilitent pas la collaboration en temps réel entre les acteurs (Conservation, Notaires, Adouls, Justice, Propriétaires) ;
- Ne disposent pas de mécanismes de traçabilité automatisée et infalsifiable ;
- Souffrent d'un manque d'interopérabilité entre les systèmes existants.

## 1.3 Alignement stratégique

Le projet Morocco Land Trust s'inscrit pleinement dans :

- **Le Plan Maroc Digital 2030** : Souveraineté numérique et transformation de l'administration
- **Le Nouveau Modèle de Développement (NMD)** : Modernisation institutionnelle et réduction des inégalités
- **La Réforme de la Conservation Foncière** : Programme de numérisation de l'ANCFCC
- **La Loi 43-20** : Services de confiance pour les transactions électroniques
- **La Stratégie Nationale d'Intelligence Artificielle (SNAI)**

---

# 2. VISION STRATÉGIQUE

## 2.1 Notre proposition

**Morocco Land Trust** ambitionne de construire un **double numérique souverain** de chaque propriété foncière du Royaume sous forme de **Titre Numérique Fongible (TNF)**, créant un écosystème de propriété dynamique, sécurisé par la technologie blockchain et placé sous la gouvernance permanente de l'État.

## 2.2 Principes directeurs

| Principe | Description |
|----------|-------------|
| **Souveraineté** | L'État détient les clés maîtresses et les nœuds critiques à tout moment |
| **Immutabilité** | Les registres sont infalsifiables grâce à la cryptographie blockchain |
| **Divisibilité** | Les titres peuvent être fractionnés numériquement pour l'indivision et l'héritage |
| **Interopérabilité** | Tous les acteurs (ANCFCC, Notaires, Adouls, Justice, MRE) interagissent sur une plateforme unique |
| **Réversibilité** | En cas de défaillance du partenaire privé, l'État reprend la gestion sans interruption |
| **Conformité** | Stricte adhérence au droit marocain (Dahir 1913, Loi 14-07, Loi 39-08, Moudawana) |

---

# 3. INNOVATION TECHNOLOGIQUE : LE TNF

## 3.1 Qu'est-ce qu'un Titre Numérique Fongible ?

Le TNF est la représentation numérique et cryptographiquement sécurisée d'un titre de propriété foncière sur un registre distribué (blockchain). Il combine :

- **L'identité unique** (ERC-721) : Chaque propriété reçoit un identifiant numérique non duplicable
- **La divisibilité** (ERC-1155) : Le titre peut être fractionné en parts égales ou proportionnelles pour les héritiers et copropriétaires
- **La conformité réglementaire** (ERC-3643 T-Rex) : Les règles de transfert et de restriction sont codées dans le titre lui-même
- **La programmabilité** (Smart Contracts) : Les conditions de vente, de succession, de gel judiciaire sont auto-exécutantes

## 3.2 Avantages par rapport aux solutions existantes

| Fonction | Système actuel | **TNF (Morocco Land Trust)** |
|----------|---------------|-------------------------------|
| Origine du titre | Registre papier, faillible | Immutable sur blockchain |
| Vérification d'authenticité | Lente, manuelle | Instantanée, cryptographique |
| Transfert de propriété | Semaines/mois | Secondes (après validation légale) |
| Gestion de l'indivision | Impossible sans unanimité | Fractionnement numérique natif |
| Traçabilité | Partielle | Complète et infalsifiable |
| Accès MRE | Nécessite déplacement / procuration | À distance, sécurisé, temps réel |
| Exécution judiciaire | Lente, contestable | Automatisée par smart contract |

---

# 4. ARCHITECTURE DE GOUVERNANCE

## 4.1 Pyramide des acteurs

Le système est conçu sur un modèle de gouvernance pyramidale plaçant l'État au sommet :

### Niveau 1 — Autorité Régalienne (Root Admin)

**Acteur :** Gouvernement / MTNRA / ADD

**Pouvoirs :**
- Détention des clés de secours du protocole
- Pouvoir de pause d'urgence (Panic Button)
- Validation des mises à jour du protocole
- Hébergement des nœuds critiques sur les serveurs souverains

### Niveau 2 — Conservation Foncière (Validateur Maître)

**Acteur :** ANCFCC / Conservateurs régionaux

**Pouvoirs :**
- Création et certification finale des TNF
- Validation des transferts de propriété
- Mise à jour du registre foncier numérique
- Administration des métadonnées (plans, superficies, servitudes)

### Niveau 3 — Pouvoir Judiciaire (Justice Admin)

**Acteur :** Tribunaux / Juges

**Pouvoirs :**
- Gel de titres (FREEZE)
- Saisie et transfert forcé (OVERRIDE — Burn & Remint)
- Exécution des jugements de partage
- Récupération sociale (SOCIAL RECOVERY) en cas de perte d'accès

### Niveau 4 — Officiers Publics (Opérateurs de Node)

**Acteurs :** Notaires, Adouls

**Pouvoirs :**
- Initiation des transactions de vente (Escrow)
- Validation de l'identité des parties
- Actes de succession et de partage (Fridda)
- Certification légale des opérations

### Niveau 5 — Citoyens et MRE (Holders)

**Acteurs :** Propriétaires, héritiers, investisseurs

**Droits :**
- Détention de parts divisibles du TNF
- Vote dans les décisions d'indivision (Fridda)
- Consultation en temps réel de l'historique de leur titre
- Alerte automatique en cas de tentative de modification (Watchtower MRE)

---

# 5. PROTOCOLE DE CONTINUITÉ DE SERVICE PUBLIC (ESCROW D'ÉTAT)

## 5.1 Garantie fondamentale

Le protocole Morocco Land Trust est conçu comme une **infrastructure de service public** et non comme un simple produit commercial. Sa continuité est garantie par un mécanisme d'Escrow d'État à trois niveaux :

### Niveau 1 — Hébergement souverain

- L'État (via les serveurs du MTNRA, de l'ANRT ou du Cloud Souverain) héberge des **nœuds de blockchain complets**, synchronisés en temps réel avec les nœuds de Tachydigital
- Ces nœuds contiennent l'intégralité des données et de l'historique des transactions

### Niveau 2 — Dépôt du code source

- Le code source complet de la plateforme est déposé auprès de l'ADD ou d'un tiers séquestre agréé
- Le code est documenté, commenté et accompagné de procédures de déploiement
- Mise à jour du dépôt à chaque version majeure

### Niveau 3 — Réversibilité opérationnelle

- En cas de défaillance de Tachydigital (cessation d'activité, faillite, manquement grave), l'État active les nœuds souverains et reprend la gestion complète du protocole
- **Aucune perte de données** : les nœuds étatiques possèdent déjà l'historique complet
- **Aucune interruption de service** : les serveurs étatiques sont déjà opérationnels et synchronisés
- La transition s'effectue par la bascule des clés d'administration, dont l'État détient les sauvegardes

## 5.2 Engagement contractuel

Tachydigital s'engage contractuellement, dans le cadre d'une convention de partenariat public-privé (PPP), à :

1. Maintenir les nœuds étatiques synchronisés à J+0
2. Fournir trimestriellement un rapport d'audit de résilience
3. Former le personnel étatique aux procédures de reprise
4. Effectuer un exercice de bascule simulée au moins une fois par an
5. Ne jamais restreindre l'accès de l'État aux données et au code source

---

# 6. RÉPONSES AUX PROBLÉMATIQUES NATIONALES

## 6.1 Terres Soulalyates

- Attribution claire et immuable des droits de jouissance aux ayants droit de la collectivité ethnique
- TNF non cessibles mais divisibles, conformes à la Loi 62-17
- Historique complet et traçable de chaque parcelle

## 6.2 Successions et Indivision (Fridda)

- Liquidation simplifiée des parts d'héritage via le module Fridda
- Un héritier peut monétiser sa part numérique sans nécessiter l'accord unanime pour la vente du bien physique
- Votes pondérés par les parts, conformes à la Moudawana
- Propositions et délibérations tracées sur la blockchain

## 6.3 Investissements des MRE

- Sécurisation totale des investissements immobiliers à distance
- Module Watchtower : alertes en temps réel en cas de tentative de modification du titre
- Élimination des risques liés aux procurations frauduleuses
- Traçabilité infalsifiable de la chaîne de propriété

## 6.4 Désengorgement judiciaire

- Exécution automatisée des décisions de justice via les smart contracts
- Réduction drastique des contentieux grâce à la preuve blockchain
- Gel et saisie instantanés par le pouvoir judiciaire
- Transparence totale de l'historique des propriétés

## 6.5 Stress hydrique et environnement

- Intégration d'un oracle hydrique pour lier les données foncières aux données environnementales
- Module Crédits Carbone Foncier pour valoriser les pratiques durables
- Liaison avec les données satellitaires pour le suivi des parcelles

---

# 7. MODÈLE DE PARTENARIAT PROPOSÉ

## 7.1 Convention de Partenariat Public-Privé (PPP)

Tachydigital propose une convention de PPP structurée sur le modèle de la co-exploitation :

| Phase | Rôle de Tachydigital | Rôle de l'État |
|-------|---------------------|----------------|
| **Développement** | Conception, développement et déploiement de la plateforme | Validation des spécifications, fourniture de données |
| **Pilote** | Opération de la plateforme sur 1-2 sites pilotes | Sélection des sites, mobilisation des agents |
| **Déploiement** | Déploiement régional et national, formation | Coordination interministérielle, cadre réglementaire |
| **Exploitation** | Maintenance, support, évolutions | Gouvernance, supervision, hébergement des nœuds |

## 7.2 Rémunération

| Source | Mode | Estimation |
|--------|------|------------|
| Licence annuelle | Forfait SaaS | 2 000 000 MAD/an |
| Frais de tokenisation | Par titre créé | 500 MAD × nombre de titres |
| Commission transactionnelle | Par transfert | 0,5% du montant |
| Formation et support | Forfait | À convenir |

## 7.3 Avantages pour l'État

1. **Aucun investissement initial** en développement logiciel
2. **Transfert de technologie** progressif via le dépôt de code et la formation
3. **Réversibilité garantie** à tout moment
4. **Conformité** assurée par une société de droit marocain
5. **Préférence nationale** (SARL marocaine — majoration de 15% sur les offres étrangères dans les marchés publics)
6. **Recettes fiscales** générées par les frais transactionnels

---

# 8. PROCHAINES ÉTAPES

| N° | Action | Interlocuteur | Délai estimé |
|----|--------|---------------|--------------|
| 1 | Présentation de la note de cadrage | MTNRA / ANCFCC / ADD | Immédiat |
| 2 | Réunion technique de cadrage | Direction IT ANCFCC | Mois 1 |
| 3 | Convention de partenariat pilote | ANCFCC + Tachydigital | Mois 2-3 |
| 4 | Sélection du site pilote | ANCFCC + Ministère de l'Intérieur | Mois 3 |
| 5 | Déploiement pilote | Tachydigital | Mois 4-8 |
| 6 | Évaluation et rapport | Commission mixte | Mois 9 |
| 7 | Décision d'extension régionale | Gouvernement | Mois 10 |

---

# 9. CONTACTS

| Rubrique | Détail |
|----------|--------|
| **Société** | TACHYDIGITAL S.A.R.L. |
| **Représentant** | M./Mme [NOM ET PRÉNOM] — Gérant(e) |
| **Adresse** | [ADRESSE COMPLÈTE], [VILLE], Maroc |
| **Téléphone** | [NUMÉRO] |
| **Email** | contact@tachydigital.ma |
| **Site web** | www.tachydigital.ma |

---

> **Ce document est la propriété de TACHYDIGITAL S.A.R.L. Sa reproduction ou sa diffusion, en tout ou en partie, sans l'accord préalable de la société est interdite. Il est destiné exclusivement aux autorités et institutions mentionnées ci-dessus dans le cadre de l'évaluation du projet Morocco Land Trust.**
