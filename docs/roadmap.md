# 🗺️ SafeLand Morocco — Roadmap Visuelle

## Diagramme Gantt

```mermaid
gantt
    title SafeLand Morocco — Roadmap 2025-2027
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 0 — Fondation
    Smart Contracts Solidity           :done, sc, 2025-01-01, 2025-02-15
    Tests unitaires & intégration      :done, tests, 2025-01-15, 2025-03-01
    Audit sécurité interne             :done, audit1, 2025-02-15, 2025-03-15
    CDC Business & Technique           :done, cdc, 2025-01-01, 2025-03-31

    section Phase 1 — MVP
    Backend API Express                :active, api, 2025-03-01, 2025-04-30
    Frontend Next.js                   :active, front, 2025-03-15, 2025-05-15
    Intégration IPFS/Pinata            :active, ipfs, 2025-04-01, 2025-05-01
    Module Auth MetaMask + JWT         :active, auth, 2025-04-01, 2025-04-30
    Audit sécurité externe             :audit2, 2025-05-01, 2025-06-15
    Pilote interne Casablanca          :pilot0, 2025-05-15, 2025-06-30

    section Phase 2 — Pilote
    Partenariat ANCFCC                 :ancfcc, 2025-06-01, 2025-09-30
    Pilote 3 conservations             :pilot1, 2025-07-01, 2025-12-31
    1 000 titres tokenisés             :token1k, 2025-08-01, 2025-12-31
    Module Escrow (split fiscal)       :escrow, 2025-07-01, 2025-09-30
    Formation notaires & agents        :training1, 2025-09-01, 2025-11-30
    Certification Loi 43-20            :cert, 2025-10-01, 2025-12-31

    section Phase 3 — Régional
    Extension 12 conservations         :ext12, 2026-01-01, 2026-06-30
    Module Fridda (successions)        :fridda, 2026-01-01, 2026-03-31
    Module Justice (multi-sig)         :justice, 2026-02-01, 2026-04-30
    API B2B banques & assurances       :b2b, 2026-03-01, 2026-06-30
    10 000 titres tokenisés            :token10k, 2026-01-01, 2026-06-30

    section Phase 4 — National
    Déploiement 75 conservations       :nat, 2026-07-01, 2026-12-31
    100 000+ titres tokenisés          :token100k, 2026-07-01, 2026-12-31
    Dashboard analytics national       :dash, 2026-08-01, 2026-10-31
    Intégration DGI automatisée        :dgi, 2026-09-01, 2026-12-31

    section Phase 5 — Expansion
    Adaptation cadre francophone       :adapt, 2027-01-01, 2027-03-31
    Pilote Sénégal                     :senegal, 2027-03-01, 2027-06-30
    Pilote Côte d'Ivoire               :civ, 2027-04-01, 2027-07-31
    Pilote Tunisie                     :tunisie, 2027-05-01, 2027-08-31
    Plateforme multi-pays              :multi, 2027-06-01, 2027-12-31
```

## Jalons Clés (Milestones)

```mermaid
timeline
    title SafeLand — Jalons Stratégiques
    2025 T1 : Smart Contracts finalisés
            : CDC Business & Technique validés
            : Tests 100% passants
    2025 T2 : MVP fonctionnel
            : Audit sécurité externe
            : Pilote interne Casablanca
    2025 T3 : Partenariat ANCFCC signé
            : 3 conservations pilotes
            : Formation premiers notaires
    2025 T4 : 1 000 titres tokenisés
            : Certification Loi 43-20
            : Module Escrow en production
    2026 T1-T2 : 12 conservations
               : Module Fridda & Justice
               : API B2B bancaire
    2026 T3-T4 : Déploiement national
               : 100 000+ titres
               : Dashboard analytics
    2027 : Expansion Afrique francophone
         : Sénégal, Côte d'Ivoire, Tunisie
         : Plateforme multi-pays
```

## KPIs par Phase

| Phase | KPI Principal | Objectif |
|---|---|---|
| **Phase 0** | Couverture tests | > 90% |
| **Phase 1** | MVP livré et audité | 100% features |
| **Phase 2** | Titres tokenisés | 1 000 |
| **Phase 3** | Conservations connectées | 12 |
| **Phase 4** | Titres tokenisés | 100 000+ |
| **Phase 5** | Pays couverts | 4 (Maroc + 3) |

## Flux de Progression

```mermaid
flowchart LR
    A[Phase 0<br/>Fondation] -->|Smart Contracts<br/>Tests & Audit| B[Phase 1<br/>MVP]
    B -->|Pilote interne<br/>Casablanca| C[Phase 2<br/>Pilote]
    C -->|3 conservations<br/>1K titres| D[Phase 3<br/>Régional]
    D -->|12 conservations<br/>Fridda + Justice| E[Phase 4<br/>National]
    E -->|75 conservations<br/>100K+ titres| F[Phase 5<br/>Expansion]
    F -->|Afrique<br/>francophone| G((🌍 Vision<br/>2030))

    style A fill:#e8f5e9
    style B fill:#c8e6c9
    style C fill:#a5d6a7
    style D fill:#81c784
    style E fill:#66bb6a
    style F fill:#4caf50
    style G fill:#2e7d32,color:#fff
```
