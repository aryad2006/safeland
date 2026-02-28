# GUIDE DES TYPES DE PROPRIÉTÉS — PLATEFORME MOROCCO LAND TRUST

# Tokenisation, traitement et gestion de chaque catégorie de bien foncier

---

## Table des matières

1. [Vue d'ensemble des types de propriétés](#1-vue-densemble-des-types-de-propriétés)
2. [Immeubles Titrés — Propriété urbanisée](#2-immeubles-titrés--propriété-urbanisée)
3. [Appartements — Copropriété et lots parcellaires](#3-appartements--copropriété-et-lots-parcellaires)
4. [Villas — Propriété résidentielle individuelle](#4-villas--propriété-résidentielle-individuelle)
5. [Terrains — Foncier nu](#5-terrains--foncier-nu)
6. [Fermes et terres agricoles — Foncier rural productif](#6-fermes-et-terres-agricoles--foncier-rural-productif)
7. [Melk — Propriété non immatriculée](#7-melk--propriété-non-immatriculée)
8. [Terres Soulaliyates — Foncier collectif ethnique](#8-terres-soulaliyates--foncier-collectif-ethnique)
9. [Terrains Guich — Propriété domaniale affectée](#9-terrains-guich--propriété-domaniale-affectée)
10. [Habous / Waqf — Bien de mainmorte](#10-habous--waqf--bien-de-mainmorte)
11. [Propriété du domaine de l'État](#11-propriété-du-domaine-de-létat)
12. [Locaux commerciaux et industriels](#12-locaux-commerciaux-et-industriels)
13. [Matrice comparative des types de propriétés](#13-matrice-comparative-des-types-de-propriétés)
14. [Cas particuliers et situations hybrides](#14-cas-particuliers-et-situations-hybrides)

---

# 1. VUE D'ENSEMBLE DES TYPES DE PROPRIÉTÉS

## 1.1 Classification dans le smart contract

Le contrat `SafeLandNFT` gère les types de propriétés via le champ `propertyType` de la structure `PropertyData`. Les types principaux reconnus sont :

```solidity
// Types déclarés dans SafeLandNFT.sol > PropertyData
propertyType: string  // Valeurs : "villa", "appartement", "terrain", "melk", "soulaliyate"
```

Au-delà de ces 5 types codés, la plateforme peut accueillir **tout type de bien foncier** puisque le champ `propertyType` est une chaîne libre. Cette flexibilité permet d'ajouter de nouveaux types sans modifier le smart contract.

## 1.2 Régimes juridiques au Maroc

Le système foncier marocain est l'un des plus complexes au monde. Il superpose plusieurs régimes juridiques hérités de l'histoire :

```
┌─────────────────────────────────────────────────────────┐
│                 FONCIER MAROCAIN                        │
├─────────────────────┬───────────────────────────────────┤
│  Régime MODERNE     │  Régime TRADITIONNEL              │
│  (Dahir 1913)       │  (Droit musulman + coutumier)     │
│                     │                                   │
│  • Biens immatriculés│ • Melk (non immatriculé)         │
│  • Titre foncier     │ • Soulaliyate (collectif)        │
│  • Conservation ANCFCC│ • Guich (domanial affecté)       │
│                     │ • Habous/Waqf (mainmorte)         │
│                     │                                   │
│  → Tokenisation     │ → Tokenisation après              │
│    directe possible │   immatriculation ou              │
│                     │   mécanisme adapté                │
└─────────────────────┴───────────────────────────────────┘
```

## 1.3 Principe de tokenisation

**Règle fondamentale :** 1 titre foncier = 1 TNF (ERC-721) = 1 token unique et indivisible.

Chaque TNF porte :
- Un **numéro de titre foncier unique** (`titreFoncier`) qui le lie au registre physique
- Le **type de bien** (`propertyType`) qui détermine les règles applicables
- Les **données cadastrales** (surface, GPS, ville, quartier)
- Le **hash des documents** (attestation de propriété, plans, diagnostics)
- L'**historique complet** de toutes les transactions

---

# 2. IMMEUBLES TITRÉS — PROPRIÉTÉ URBANISÉE

## 2.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "immeuble"` |
| **Cadre légal** | Dahir du 12 août 1913 (immatriculation), Loi 18-00 (copropriété) |
| **Titre** | Titre foncier mère + titres parcellaires individuels |
| **Statut d'immatriculation** | Immatriculé — titre foncier ANCFCC |
| **Tokenisation** | Directement tokenisable |

## 2.2 Architecture de tokenisation

Un immeuble crée une **hiérarchie de TNF** reflétant la structure juridique marocaine :

```
TNF #100 — Titre Mère — Immeuble "Résidence Le Jardin"
  ├── TNF #101 — Lot 1 — Appartement RDC (propertyType: "appartement")
  ├── TNF #102 — Lot 2 — Appartement 1er étage
  ├── TNF #103 — Lot 3 — Appartement 2ème étage
  ├── TNF #104 — Lot 4 — Local commercial RDC
  └── TNF #105 — Parties communes (non transférable séparément)
```

### Titre foncier mère vs titres parcellaires

| Critère | Titre Mère | Titre Parcellaire |
|---------|-----------|-------------------|
| **Propriétaire** | Promoteur → Syndic de copropriété | Acquéreur individuel |
| **Transfert** | Uniquement lors du fractionnement | Libre (via escrow notarial) |
| **Charges** | Hypothèque globale (crédit promoteur) | Hypothèque individuelle (crédit acquéreur) |
| **Surface** | Terrain d'assiette total | Quote-part privative + tantièmes |

## 2.3 Workflow de tokenisation

```
1. Le promoteur dépose le permis d'habiter auprès de l'ANCFCC
   └→ L'ANCFCC crée le TNF mère : createProperty(..., "immeuble", ...)

2. Le géomètre établit le plan de fractionnement (lots + tantièmes)
   └→ L'ANCFCC crée un TNF par lot : createProperty(..., "appartement", ...)

3. Chaque lot est vendu individuellement via l'escrow notarial
   └→ createDeal(lotTokenId, promoteur, acheteur, prix, ...)
   └→ Le TNF du lot est transféré à l'acquéreur
   └→ Le TNF mère reste au syndic/copropriété

4. Les charges de copropriété sont gérées hors-chaîne
   └→ Seul le titre de propriété est on-chain
```

## 2.4 Lois applicables et implications

| Loi | Implication pour la tokenisation |
|-----|--------------------------------|
| **Dahir 1913** | Le TNF remplace le certificat de propriété papier |
| **Loi 18-00** (copropriété) | Le syndic gère les parties communes ; seules les parties privatives sont transférables |
| **Loi 39-08** (droits réels) | Le TNF matérialise le droit réel de propriété |
| **Décret 2-04-386** | Le plan de copropriété détermine les tantièmes → calcul des parts ERC-1155 en cas d'indivision |

## 2.5 Charges spécifiques

| Type de charge | Application à l'immeuble |
|---------------|------------------------|
| `"hypotheque"` | Prêt promoteur sur le titre mère / prêt individuel sur chaque lot |
| `"servitude"` | Servitude de passage, de vue, de mitoyenneté |
| `"saisie"` | Saisie sur un lot individuel uniquement (pas tout l'immeuble) |

---

# 3. APPARTEMENTS — COPROPRIÉTÉ ET LOTS PARCELLAIRES

## 3.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "appartement"` |
| **Cadre légal** | Loi 18-00 (copropriété des immeubles bâtis), Loi 44-00 (VEFA) |
| **Titre** | Titre parcellaire individuel dérivé du titre mère |
| **Statut d'immatriculation** | Immatriculé |
| **Tokenisation** | Directement tokenisable |

## 3.2 Structure du TNF

Chaque appartement est un TNF indépendant qui contient :

```
PropertyData {
  titreFoncier: "TF-56789/CS-LOT3",     // Titre parcellaire
  propertyType: "appartement",
  surface: 95,                           // Surface privative en m²
  city: "Casablanca",
  district: "Maârif",
  latitude: 33592280,                    // GPS × 1e6
  longitude: -7631930,
  documentHash: 0x7f3a...                // Hash du plan de lot + règlement copropriété
}
```

## 3.3 Particularités de la tokenisation

### Tantièmes de copropriété

L'appartement porte de manière implicite une **quote-part des parties communes** (tantièmes) :
- Les tantièmes sont enregistrés dans les métadonnées off-chain (IPFS)
- Le TNF ne transfère que la propriété privative
- Les droits sur les parties communes suivent automatiquement le TNF (conformément à la Loi 18-00)

### VEFA — Vente en l'État Futur d'Achèvement

Pour les appartements achetés sur plan (VEFA, Loi 44-00) :

```
Phase 1 — Promesse de vente
  └→ Le notaire crée un escrow conditionnel : createDeal(...)
  └→ L'acheteur commence les versements : buyerDeposit() par tranches

Phase 2 — Achèvement de la construction
  └→ Le promoteur obtient le permis d'habiter
  └→ L'ANCFCC crée le titre parcellaire et le TNF
  └→ Le notaire finalise l'escrow : notaryComplete()
  └→ Le TNF est transféré à l'acquéreur
```

### Succession d'un appartement

Quand un propriétaire d'appartement décède :
1. Le notaire ouvre la succession : `openSuccession(tokenId, deceased, 24, actDecesHash, friddaHash)`
2. Les héritiers reçoivent des parts ERC-1155 proportionnelles à leurs droits
3. Les héritiers votent pour décider du sort de l'appartement (garder, vendre, louer)
4. Si la vente est décidée, le notaire exécute via l'escrow

## 3.4 Avantages de la tokenisation

| Avantage | Description |
|----------|-------------|
| **Anti-double vente** | Impossible de vendre le même appartement à 2 personnes (unicité du TNF) |
| **Traçabilité VEFA** | Chaque paiement échelonné est enregistré on-chain |
| **Historique complet** | L'acheteur connaît tous les propriétaires précédents |
| **Vérification instantanée** | Pas besoin d'attendre un certificat ANCFCC papier |

---

# 4. VILLAS — PROPRIÉTÉ RÉSIDENTIELLE INDIVIDUELLE

## 4.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "villa"` |
| **Cadre légal** | Dahir 1913, Loi 39-08 |
| **Titre** | Titre foncier unique (terrain + construction) |
| **Statut d'immatriculation** | Immatriculé |
| **Tokenisation** | Directement tokenisable — cas le plus simple |

## 4.2 Cas de référence

La villa est le **type de bien le plus simple** à tokeniser car elle correspond à :
- **1 propriétaire** (ou une famille)
- **1 titre foncier** unique
- **1 parcelle** avec construction
- **Pas de copropriété** ni de parties communes

```
TNF #42 — Villa à Casablanca, Anfa
  PropertyData {
    titreFoncier: "TF-12345/CS",
    propertyType: "villa",
    surface: 350,                // Surface terrain en m²
    city: "Casablanca",
    district: "Anfa",
    latitude: 33589500,
    longitude: -7646800,
    documentHash: 0xab12...
  }
  Encumbrances: [
    { type: "hypotheque", creditor: CIH_Bank, amount: 1.5M MAD, endDate: 2045 }
  ]
  History: [
    { type: "creation", from: address(0), to: promoteur, date: 2020 },
    { type: "sale", from: promoteur, to: propriétaire, date: 2021 }
  ]
```

## 4.3 Villa avec piscine, dépendances, garage

Toutes les dépendances (piscine, garage, jardin, pool house) sont **incluses dans le même TNF** car elles font partie de la même parcelle. Le smart contract ne distingue pas les éléments construits — seule la surface globale et le type sont enregistrés.

Les détails (nombre de chambres, piscine, dépendances) sont dans les **métadonnées IPFS** référencées par l'URI du token.

## 4.4 Risques spécifiques et protections

| Risque | Solution plateforme |
|--------|-------------------|
| Spoliation par fausse procuration | **Travel Lock** : `lockTransfer(tokenId, "protection")` |
| Double vente | **Unicité du TNF** : `titreFoncier` unique empêche la duplication |
| Fraude succession | **Fridda** : succession transparente et vérifiable |
| Occupation illégale | **Watchtower** : alertes en temps réel |

## 4.5 Workflow type — Vente d'une villa

```
Vendeur (propriétaire de TNF #42) et acheteur veulent conclure la vente

Étape 1 — Vérification
  └→ L'acheteur consulte : getProperty(42) → vérifie les données
  └→ L'acheteur consulte : getEncumbrances(42) → hypothèque CIH
  └→ L'acheteur consulte : canTransfer(42) → false (hypothèque active)
  └→ Le vendeur demande la mainlevée : removeEncumbrance(42, 0) par l'ANCFCC
  └→ canTransfer(42) → true

Étape 2 — Transaction
  └→ Notaire crée le deal : createDeal(42, vendeur, acheteur, 3_500_000 MAD, ...)
  └→ sellerSign(dealId) → buyerDeposit(dealId) → notaryComplete(dealId)
  └→ 140 000 MAD → DGI | 35 000 MAD → ANCFCC | 3 325 000 MAD → Vendeur
  └→ TNF #42 → wallet de l'acheteur
```

---

# 5. TERRAINS — FONCIER NU

## 5.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "terrain"` |
| **Cadre légal** | Dahir 1913, Loi 12-90 (urbanisme), Loi 25-90 (lotissements) |
| **Titre** | Titre foncier (terrain immatriculé) |
| **Statut d'immatriculation** | Immatriculé |
| **Tokenisation** | Directement tokenisable |

## 5.2 Sous-catégories de terrains

Le type `"terrain"` couvre plusieurs sous-types, différenciés par les métadonnées IPFS :

| Sous-type | Zone | Usage | Réglementation |
|-----------|------|-------|---------------|
| Terrain urbain constructible | Ville | Construction | Plan d'aménagement communal |
| Terrain urbain non constructible | Ville | Espace vert / réserve | Servitude d'urbanisme |
| Terrain péri-urbain | Périphérie | Lotissement futur | Note de renseignement |
| Terrain agricole (titré) | Rural | Agriculture | Loi 06-87 (zones agricoles) |
| Terrain industriel | Zone industrielle | Activité industrielle | Cahier des charges zone |

## 5.3 Tokenisation et restrictions d'usage

### Restriction de constructibilité

Un terrain peut être **tokenisé même s'il n'est pas constructible**. La note de renseignement urbanistique est stockée dans les métadonnées IPFS et peut être mise à jour sans modifier le TNF.

### Lotissement et fractionnement

L'opération de lotissement transforme **1 TNF terrain** en **N TNF lots** :

```
TNF #200 — Terrain de 5 000 m² à Bouskoura
  │
  ├→ Lotissement autorisé (permis de lotir)
  │
  └→ L'ANCFCC fractionne :
       ├── TNF #201 — Lot 1 (300 m²) — propertyType: "terrain"
       ├── TNF #202 — Lot 2 (300 m²)
       ├── TNF #203 — Lot 3 (350 m²)
       ├── ...
       └── TNF #210 — Lot 10 (280 m²)
  
  Le TNF #200 original est brûlé ou marqué "fractionné"
```

### Réserves foncières de l'État

Certains terrains sont des **réserves foncières** de l'État. Ils sont tokenisés avec l'État comme propriétaire et portent une charge spéciale :

```
addEncumbrance(tokenId, "servitude", stateAddress, 0, 0)
// Servitude de réserve foncière — bloque toute cession
```

## 5.4 Charges spécifiques aux terrains

| Charge | Fréquence | Impact |
|--------|-----------|--------|
| `"servitude"` de passage | Très fréquente | Droit de passage pour parcelles enclavées |
| `"servitude"` d'utilité publique | Fréquente | Voirie, réseaux, canalisations |
| `"hypotheque"` | Modérée | Crédit foncier |
| `"saisie"` | Rare | Contentieux fiscal ou judiciaire |
| Constructibilité limitée | — | Enregistrée dans les métadonnées, pas en charge |

## 5.5 Avantages de la tokenisation des terrains

| Avantage | Détail |
|----------|--------|
| **Anti-spéculation** | L'historique des prix est traçable sur toute la chaîne de propriété |
| **Anti-morcellement illégal** | Le fractionnement ne peut se faire que via l'ANCFCC |
| **Transparence urbanistique** | Les restrictions d'usage sont consultables par tout acheteur potentiel |
| **Préemption facilitée** | L'État peut exercer son droit de préemption en temps réel (via Watchtower) |

---

# 6. FERMES ET TERRES AGRICOLES — FONCIER RURAL PRODUCTIF

## 6.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "ferme"` ou `"terrain"` avec métadonnées agricoles |
| **Cadre légal** | Dahir 1913, Loi 06-87 (urbanisme — zones NC), Code des investissements agricoles |
| **Titre** | Titre foncier (si immatriculé) ou Moulkiya (si Melk) |
| **Statut d'immatriculation** | Variable — souvent non immatriculé en zones rurales |
| **Tokenisation** | Directe si titré, via préqualification si Melk |

## 6.2 Spécificités agricoles

### Restrictions de cession

Les terres agricoles font l'objet de restrictions spécifiques :

| Restriction | Base légale | Impact sur le TNF |
|-------------|-----------|-------------------|
| Interdiction de morcellement | Loi sur le remembrement | Les lots < 5 ha ne peuvent pas être fractionnés |
| Zones irriguées protégées | ORMVA | Transfert soumis à autorisation préalable |
| Droit de préemption de l'État | Dahir 1963 | L'État peut racheter au prix déclaré |
| Interdiction de cession aux étrangers | Loi sur les investissements agricoles | Le smart contract peut vérifier le KYC |

### Tokenisation d'une ferme

```
TNF #300 — Ferme "El Baraka" — 50 hectares à Meknès
  PropertyData {
    titreFoncier: "TF-78901/MK",
    propertyType: "ferme",
    surface: 500000,              // 50 ha = 500 000 m²
    city: "Meknès",
    district: "Saïss",
    latitude: 33893500,
    longitude: -5534600,
    documentHash: 0xcd45...
  }
  Métadonnées IPFS :
    - Type de culture : Olivier
    - Irrigation : Goutte à goutte (ORMVA)
    - Bâtiments : Hangar, logement gardien, puits
    - Certification : Bio (en cours)
    - Rendement moyen : 8 tonnes/ha
```

## 6.3 Succession agricole — Un cas critique

La succession des fermes est le cas le plus problématique du foncier marocain :

### Le problème du morcellement

```
Génération 1 : 1 ferme de 50 ha → 1 TNF
Génération 2 : 5 héritiers → 5 parts ERC-1155 (10 ha chacun)
Génération 3 : 25 petits-héritiers → 25 parts (2 ha chacun)
  → Le bien devient inexploitable
```

### La solution SafeLand

Le module Fridda permet de **maintenir l'unité de la ferme** tout en respectant les droits de chaque héritier :

1. La ferme reste **1 seul TNF** (pas de morcellement physique)
2. Les héritiers reçoivent des **parts ERC-1155** (droits financiers)
3. Les héritiers **votent collectivement** sur la gestion :
   - `Rent` → Mise en location à un exploitant unique
   - `Sell` → Vente globale avec partage du prix
   - `Renovate` → Investissement collectif (irrigation, mécanisation)
4. Un héritier peut **racheter les parts** des autres pour consolider la propriété

**C'est l'une des innovations les plus puissantes de SafeLand** : elle résout le problème historique du morcellement agricole au Maroc.

## 6.4 Intégration avec les ORMVA

Les Offices Régionaux de Mise en Valeur Agricole (ORMVA) peuvent être intégrés en tant qu'**observateurs** avec un rôle de consultation :
- Suivi de l'utilisation des terres irriguées
- Vérification du respect des quotas d'eau
- Contrôle de la non-conversion en terrain constructible

---

# 7. MELK — PROPRIÉTÉ NON IMMATRICULÉE

## 7.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "melk"` |
| **Cadre légal** | Droit musulman classique, Rite malékite, Code des obligations et contrats |
| **Titre** | Pas de titre foncier ANCFCC — Acte adoulaire (Moulkiya) |
| **Statut d'immatriculation** | **Non immatriculé** |
| **Tokenisation** | Via processus spécial de pré-immatriculation |

## 7.2 Le défi du Melk

Le Melk représente environ **40 à 50% des terres au Maroc**, principalement en zones rurales. Il est basé sur la **possession coutumière** (Hiyaza) attestée par des témoins (Lafif) et formalisée par un acte adoulaire.

### Différence fondamentale avec le titre foncier

| Critère | Titre foncier (Dahir 1913) | Melk (droit musulman) |
|---------|--------------------------|---------------------|
| **Preuve** | Certificat ANCFCC | Acte adoulaire + témoins |
| **Opposabilité** | Erga omnes (face à tous) | Inter partes (entre parties) |
| **Contestabilité** | Inattaquable après 2 ans | Contestable indéfiniment |
| **Registre** | Conservation foncière | Aucun registre centralisé |
| **Sécurité juridique** | Maximale | Fragile |

## 7.3 Processus de tokenisation — La pré-qualification Melk

SafeLand introduit un processus innovant de **pré-qualification** qui permet de tokeniser les biens Melk tout en encourageant leur immatriculation :

```
Phase 1 — Pré-qualification (tokenisation provisoire)
  └→ L'adoul établit l'acte de Moulkiya (attestation Melk)
  └→ Le géomètre effectue le bornage
  └→ L'ANCFCC crée un TNF provisoire :
       createProperty(owner, "MELK-PROV-001", "melk", surface, ...)
  └→ Le TNF est créé avec un flag spécial dans les métadonnées IPFS :
       { "status": "pre-qualified", "immatriculation_pending": true }
  └→ Le TNF porte une charge :
       addEncumbrance(tokenId, "servitude", ANCFCC, 0, 0)
       // "Titre provisoire — opposabilité limitée"

Phase 2 — Purification (immatriculation définitive)
  └→ Le propriétaire dépose une réquisition d'immatriculation à l'ANCFCC
  └→ Publication au BO et affichage (2 mois d'opposition)
  └→ Si aucune opposition : l'ANCFCC convertit le TNF Melk en TNF titré
       - La charge provisoire est levée
       - Le propertyType peut rester "melk" ou être reclassé
       - Le titreFoncier provisoire est remplacé par le numéro officiel
  └→ Si opposition : le TNF est gelé (freezeByJustice) le temps du contentieux
```

## 7.4 Restrictions de transfert des biens Melk

| Opération | Melk pré-qualifié | Melk titré (immatriculé) |
|-----------|-------------------|----------------------|
| Vente via escrow | ✅ Avec avertissement à l'acheteur | ✅ Normal |
| Hypothèque | ❌ Refusée par la plupart des banques | ✅ Acceptée |
| Succession (Fridda) | ✅ Fonctionne normalement | ✅ Fonctionne normalement |
| Override judiciaire | ✅ Plus fréquent (litiges Melk) | ✅ Normal |

## 7.5 Impact social

La pré-qualification Melk de SafeLand peut :
- **Réduire le foncier informel** en incitant à l'immatriculation
- **Protéger les propriétaires ruraux** contre la spoliation
- **Faciliter l'accès au crédit** pour les agriculteurs (les banques accepteront le TNF pré-qualifié comme début de garantie)
- **Accélérer l'immatriculation** en fournissant un dossier numérique complet à l'ANCFCC

---

# 8. TERRES SOULALIYATES — FONCIER COLLECTIF ETHNIQUE

## 8.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "soulaliyate"` |
| **Cadre légal** | Loi 62-17 relative à la tutelle sur les communautés soulaliyates, Dahir du 27 avril 1919 |
| **Titre** | Terre collective — pas de titre individuel |
| **Statut de propriété** | Indivision forcée — inaliénable, insaisissable, imprescriptible |
| **Tokenisation** | Via mécanisme ERC-1155 spécifique (droits de jouissance) |

## 8.2 Contexte historique et enjeux

Les terres Soulaliyates couvrent environ **15 millions d'hectares** au Maroc (~21% du territoire). Elles appartiennent à des collectivités ethniques (tribus, fractions, douars) et sont gérées par :
- Les **Naïbs** (représentants élus de la collectivité)
- La **Direction des Affaires Rurales** (tutelle du Ministère de l'Intérieur)

### Les 3 principes intangibles

1. **Inaliénabilité** : Les terres ne peuvent pas être vendues
2. **Insaisissabilité** : Les terres ne peuvent pas être saisies par un créancier
3. **Imprescriptibilité** : L'occupation prolongée ne confère aucun droit de propriété

## 8.3 Tokenisation adaptée — Le modèle SafeLand Soulaliyate

```
TNF #500 — Terre collective "Douar Oulad Saïd" — 200 hectares
  PropertyData {
    titreFoncier: "SOULALYATE-DOUAR-OULAD-SAID",  // Identifiant unique
    propertyType: "soulaliyate",
    surface: 2000000,                               // 200 ha
    city: "Kénitra",
    district: "Commune rurale Sidi Taibi",
    ...
  }
  
  Restrictions automatiques :
    - canTransfer() → TOUJOURS false  (sauf cession à l'État)
    - addEncumbrance("hypotheque", ...) → REJETÉ (insaisissabilité)
    - transferProperty() → REJETÉ (inaliénabilité)
```

### Droits de jouissance via ERC-1155

Au lieu de transférer la propriété (impossible), SafeLand utilise le module Fridda pour distribuer des **droits de jouissance** sous forme de parts ERC-1155 :

```
SafeLandFridda → openSuccession(tokenId, stateAddress, 1000, ...)
  // 1000 parts pour une grande collectivité
  
SafeLandFridda → distributeShares(dossierId, 
  [ayantDroit1, ayantDroit2, ..., ayantDroit200],
  [5, 5, 5, 5, ..., 5]  // 5 parts chacun pour 200 ayants droit
)
```

### Restrictions spéciales ERC-1155 Soulaliyate

| Restriction | Implémentation |
|-------------|---------------|
| Parts non cessibles à des tiers | Backend vérifie l'appartenance à la collectivité |
| Retour à la collectivité en cas de départ | Le Naïb récupère les parts via `safeTransferFrom` |
| Aucune hypothèque sur les parts | Les parts ERC-1155 ne peuvent pas être gagées |
| Vote uniquement par les ayants droit actifs | Vérification d'éligibilité au moment du vote |

## 8.4 Gouvernance collective sur la blockchain

Le module Fridda offre aux Soulaliyates un système de **gouvernance transparente** :

| Décision | Type de vote | Détail |
|----------|-------------|--------|
| Mise en location de parcelles | `Rent` | Les revenus sont répartis proportionnellement aux parts |
| Aménagement (école, puits, route) | `Renovate` | Le quorum élevé (75%) protège la collectivité |
| Cession à l'État (utilité publique) | `Sell` | Nécessite 2/3 + autorisation du Ministère de l'Intérieur |
| Attribution d'un lot à un ayant droit | Proposition custom | Le Naïb soumet, la Jemaa vote |

### Loi 62-17 — Nouveauté : droit des femmes

La Loi 62-17 (2019) a reconnu le **droit des femmes Soulaliyates** :
- Les femmes peuvent désormais être ayantes droit
- Elles reçoivent des parts ERC-1155 au même titre que les hommes
- Elles votent sur les propositions
- SafeLand applique cette égalité de facto via le calcul des parts

## 8.5 Workflow type — Mise en location d'une parcelle Soulaliyate

```
Le Naïb souhaite louer 20 ha à un investisseur agricole

1. Le Naïb crée une proposition :
   createProposal(dossierId, VoteType.Rent, 
     "Location 20 ha à AgriCorp pour 10 ans, 500 000 MAD/an", 
     quorumBps=5001, durationDays=60)

2. Les ayants droit votent :
   - 120 ayants droit votent POUR (600 parts)
   - 30 votent CONTRE (150 parts)
   - 50 s'abstiennent (250 parts)
   → 600/1000 = 60% > 50%+1 → ✅ Proposition adoptée

3. Le Naïb exécute :
   executeProposal(proposalId) → validé par le contrat

4. Le contrat de location est signé hors-chaîne
   → Hash du contrat stocké dans les métadonnées IPFS du TNF

5. Les revenus locatifs (500 000 MAD/an) sont répartis :
   → Chaque ayant droit reçoit proportionnellement à ses parts
```

---

# 9. TERRAINS GUICH — PROPRIÉTÉ DOMANIALE AFFECTÉE

## 9.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "guich"` |
| **Cadre légal** | Dahir du 19 mars 1951, Dahir du 24 mai 1922 |
| **Titre** | Terre domaniale affectée à des tribus « guich » |
| **Statut de propriété** | Propriété de l'État — droit de jouissance tribal |
| **Tokenisation** | Limitée — consultation uniquement |

## 9.2 Particularités

Les terrains Guich sont des terres de l'État concédées à des tribus en échange de services militaires historiques. Aujourd'hui :

- L'État reste **propriétaire absolu**
- Les tribus Guich ont un **droit de jouissance** révocable
- Les terres sont **inaliénables** et **insaisissables**

## 9.3 Tokenisation

```
TNF #600 — Terrain Guich — 500 ha
  PropertyData {
    titreFoncier: "GUICH-STATE-001",
    propertyType: "guich",
    owner: stateAddress,             // L'État est toujours propriétaire
    ...
  }
  Restrictions :
    - canTransfer() → false (sauf par décision de l'État)
    - Pas d'hypothèque possible
    - Les bénéficiaires reçoivent des parts ERC-1155 (jouissance)
```

Le modèle est **identique aux Soulaliyates** mais avec l'État comme propriétaire exclusif du TNF.

---

# 10. HABOUS / WAQF — BIEN DE MAINMORTE

## 10.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "habous"` |
| **Cadre légal** | Code des Habous (Moudawana des Habous), Dahir du 7 juillet 1914 |
| **Titre** | Bien affecté au Habous (public ou privé) |
| **Statut de propriété** | Inaliénable — affecté à perpétuité à une œuvre pieuse ou d'utilité publique |
| **Tokenisation** | Consultative uniquement — pas de transfert possible |

## 10.2 Types de Habous

| Type | Description | Tokenisation |
|------|-------------|-------------|
| **Habous public** | Mosquées, écoles coraniques, cimetières, fontaines | TNF de traçabilité (propriété : Ministère des Habous) |
| **Habous privé (Mu'aqqab)** | Bien affecté à la descendance du fondateur, puis au public | Parts ERC-1155 pour les bénéficiaires successifs |
| **Habous mixte** | Combinaison des deux | Gestion hybride |

## 10.3 Tokenisation du Habous

```
TNF #700 — Riad historique à Fès — Habous public
  PropertyData {
    titreFoncier: "HABOUS-FES-MEDINA-001",
    propertyType: "habous",
    owner: MinistereHabousWallet,     // Le Ministère des Habous
    surface: 800,
    city: "Fès",
    district: "Médina",
    ...
  }
  Restrictions absolues :
    - canTransfer() → TOUJOURS false
    - Aucune charge possible sauf "servitude" d'utilité publique
    - Le TNF sert uniquement de certificat d'inventaire numérique
```

### Habous privé (Mu'aqqab) — Cas particulier

Le Habous privé est le seul type qui permet une gestion via ERC-1155 car il comporte des **bénéficiaires successifs** :

```
Fondateur affecte un bien Habous à sa descendance :
  └→ 1ère génération : distributions de jouissance aux enfants
  └→ 2ème génération : redistribution aux petits-enfants
  └→ ...
  └→ Extinction de la descendance : le bien revient au Habous public
```

Le module Fridda gère cette chaîne de bénéficiaires en redistribuant les parts ERC-1155 à chaque génération.

## 10.4 Utilité de la tokenisation Habous

| Utilité | Détail |
|---------|--------|
| **Inventaire national** | Créer un registre numérique exhaustif des biens Habous |
| **Traçabilité des revenus** | Les loyers des biens Habous sont tracés on-chain |
| **Anti-accaparement** | L'immutabilité empêche la transformation illégale en propriété privée |
| **Transparence** | Les citoyens peuvent vérifier l'affectation de chaque bien Habous |

---

# 11. PROPRIÉTÉ DU DOMAINE DE L'ÉTAT

## 11.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "domaine_etat"` |
| **Cadre légal** | Code du domaine de l'État |
| **Types** | Domaine public (routes, plages, rivières) + Domaine privé (terrains étatiques cessibles) |
| **Tokenisation** | Domaine privé = tokenisable | Domaine public = inventaire uniquement |

## 11.2 Domaine public vs Domaine privé

| Critère | Domaine public | Domaine privé de l'État |
|---------|---------------|----------------------|
| **Exemples** | Routes, plages, rivières, forêts | Terrains à bâtir, immeubles, fermes |
| **Cessible ?** | Non (inaliénable, imprescriptible) | Oui (par adjudication ou gré à gré) |
| **Tokenisation** | TNF d'inventaire (pas de transfert) | TNF transférable (via escrow) |
| **Encumbrances** | Servitudes d'utilité publique | Toutes les charges possibles |

## 11.3 Cession par l'État — Workflow

```
L'État met un terrain en vente (domaine privé)

1. L'ANCFCC crée le TNF :
   createProperty(stateWallet, "DOMAINE-ETAT-001", "domaine_etat", ...)

2. Appel d'offres / adjudication
   → L'acquéreur est sélectionné

3. Cession via escrow notarial :
   createDeal(tokenId, stateWallet, acquereurWallet, prix, ...)
   → sellerSign (par le wallet de l'État)
   → buyerDeposit
   → notaryComplete
   → Le TNF est transféré à l'acquéreur, la DGI reçoit 4%, l'ANCFCC 1%
```

---

# 12. LOCAUX COMMERCIAUX ET INDUSTRIELS

## 12.1 Définition légale

| Attribut | Valeur |
|----------|--------|
| **Code plateforme** | `propertyType = "commercial"` ou `"industriel"` |
| **Cadre légal** | Dahir 1913, Loi 49-16 (baux commerciaux), Code de commerce |
| **Titre** | Titre foncier ou titre parcellaire |
| **Tokenisation** | Directement tokenisable |

## 12.2 Spécificités

### Fonds de commerce vs murs

Il est important de distinguer :
- Le **TNF du local** (les murs) : ERC-721 classique, propriété du bailleur
- Le **fonds de commerce** : Non tokenisé (droit incorporel, hors scope actuel)

### Bail commercial et TNF

Le bail commercial (droit au bail) n'est pas inscrit sur la blockchain comme une charge, mais il est référencé dans les métadonnées IPFS du TNF :

```
Métadonnées IPFS du local commercial :
{
  "bail": {
    "locataire": "SARL El Baraka",
    "duree": "9 ans",
    "loyer": "15 000 MAD/mois",
    "date_debut": "2023-01-01",
    "droit_au_bail": true
  }
}
```

### Zones industrielles

Les locaux en zone industrielle peuvent porter des **charges environnementales** :
- Permis d'exploitation industrielle
- Étude d'impact environnemental
- Conformité REACH / normes environnementales

Ces documents sont stockés sur IPFS et hashés dans le TNF.

---

# 13. MATRICE COMPARATIVE DES TYPES DE PROPRIÉTÉS

| Type | Code contrat | Immatriculé | Cessible | Hypothécable | Saisissable | Succession (Fridda) | ERC-1155 |
|------|-------------|------------|----------|-------------|-------------|-------------------|----------|
| **Immeuble** | `"immeuble"` | ✅ | ✅ | ✅ | ✅ | ✅ | Héritiers |
| **Appartement** | `"appartement"` | ✅ | ✅ | ✅ | ✅ | ✅ | Héritiers |
| **Villa** | `"villa"` | ✅ | ✅ | ✅ | ✅ | ✅ | Héritiers |
| **Terrain** | `"terrain"` | ✅ | ✅ | ✅ | ✅ | ✅ | Héritiers / lotissement |
| **Ferme** | `"ferme"` | Variable | ✅* | ✅* | ✅* | ✅ | Anti-morcellement |
| **Melk** | `"melk"` | ❌ | ✅** | ❌*** | ✅ | ✅ | Héritiers |
| **Soulaliyate** | `"soulaliyate"` | ❌ | ❌ | ❌ | ❌ | N/A | Ayants droit (jouissance) |
| **Guich** | `"guich"` | Variable | ❌ | ❌ | ❌ | N/A | Bénéficiaires |
| **Habous** | `"habous"` | Variable | ❌ | ❌ | ❌ | Mu'aqqab uniquement | Bénéficiaires |
| **Domaine État** | `"domaine_etat"` | ✅ | Privé: ✅ Public: ❌ | ❌ | ❌ | N/A | N/A |
| **Commercial** | `"commercial"` | ✅ | ✅ | ✅ | ✅ | ✅ | Héritiers |

\* Si immatriculé  
\** Avec acte adoulaire + risque de contestation  
\*** Les banques refusent généralement l'hypothèque sur Melk non titré

---

# 14. CAS PARTICULIERS ET SITUATIONS HYBRIDES

## 14.1 Bien en indivision (Chouyou')

Un bien détenu en indivision par plusieurs propriétaires :

```
TNF #800 — Terrain en indivision — 3 propriétaires
  └→ Le TNF est détenu par un seul des co-indivisaires (le mandataire)
  └→ Les parts sont distribuées via SafeLandFridda en ERC-1155
  └→ Les co-indivisaires votent pour toute décision de gestion

Alternative : L'ANCFCC crée directement le TNF au nom de l'indivision
  └→ Pas de propriétaire individuel = wallet commun multi-sig
```

## 14.2 Bien grevé de droits réels accessoires

Exemples : usufruit, droit de superficie, droit d'emphytéose.

```
TNF #850 — Terrain avec usufruit
  └→ Le TNF est au nom du nu-propriétaire
  └→ L'usufruit est inscrit comme charge :
       addEncumbrance(850, "servitude", usufructuaryAddress, 0, endDate)
  └→ L'usufruitier ne possède pas de TNF mais bénéficie d'une protection
  └→ canTransfer() → true (mais l'acquéreur hérite de l'usufruit)
```

## 14.3 Bien situé en zone de remembrement

```
TNF #900 — Parcelle en zone de remembrement
  └→ L'ANCFCC gèle le TNF :
       addEncumbrance(900, "servitude", ANCFCCAddress, 0, endDate)
       Description : "Opération de remembrement en cours"
  └→ Après remembrement :
       - Les anciens TNF sont brûlés (justiceOverride ou burn administratif)
       - De nouveaux TNF sont créés avec les nouvelles parcelles
       - L'historique conserve la trace de l'opération
```

## 14.4 Bien menacé par l'expropriation

```
TNF #950 — Terrain en zone d'expropriation pour utilité publique (Loi 7-81)

Phase 1 — Déclaration d'utilité publique (DUP)
  └→ L'ANCFCC inscrit : addEncumbrance(950, "servitude", stateAddress, ...)
  └→ Le propriétaire est alerté via Watchtower

Phase 2 — Accord amiable ou judiciaire
  └→ Amiable : Vente via escrow au prix convenu
  └→ Judiciaire : Le juge fixe l'indemnité et ordonne un Override
       proposeAction(950, stateAddress, jugementHash, ..., BurnRemint)
       → Le TNF est transféré à l'État avec trace indélébile
```

## 14.5 Conversion de type

Un bien peut changer de type au fil du temps :

| Conversion | Exemple | Processus |
|-----------|---------|----------|
| Terrain → Immeuble | Construction d'un immeuble | L'ANCFCC met à jour les métadonnées IPFS + éventuellement le propertyType |
| Melk → Titré | Immatriculation réussie | L'ANCFCC met à jour le TNF : nouveau titreFoncier, levée des charges provisoires |
| Soulaliyate → Domaine État | Cession à l'État | Via processus légal Loi 62-17 + Override sur le TNF |
| Terrain agricole → Terrain urbain | Modification du plan d'aménagement | Mise à jour des métadonnées IPFS (la blockchain n'est pas modifiée) |

---

> **Ce document fait partie du dossier TACHYDIGITAL — Projet Morocco Land Trust.**
> **Version 1.0 — Tous droits réservés — TACHYDIGITAL S.A.R.L.**
