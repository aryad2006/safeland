# Fiche Pays — MAROC

**Date:** Avril 2026  
**Statut:** Go-live juin 2026 (reference case study)  
**Responsable:** Founder/CEO + PM Deployment  

---

## 1. Executive Summary

### Snapshot Pays

- **Capitale:** Rabat
- **Population:** 37 millions
- **GDP:** $140 milliards (3,600 USD/capita)
- **Marché immobilier:** ~$20 milliards/an
- **Système politique:** Monarchie constitutionnelle, stable

### Opportunité SafeLand

Le Maroc représente le cas de référence idéal pour SafeLand : gouvernement réformiste, champion ministériel (ANCFCC), marché immobilier mature, infrastructure technologique solide. La numérisation des 10+ millions de titres fonciers marocains réduit les délais d'enregistrement de 6-12 mois à quelques jours, libère le crédit immobilier et positionne le Maroc comme leader numérique régional.

### Fit SafeLand

- **Avantage concurrentiel:** Cadre légal moderne (Dahir 2011), infrastructure cadastrale centralisée (ANCFCC = seul opérateur)
- **Taille marché:** €270K Year 1, €600K+ Year 2
- **Impact:** 10M+ titres numérisés, €200M+ de transactions escrow facilitées
- **Délai:** 6 mois go-live (timeline aggressif mais tenable)

---

## 2. Contexte Légal & Réglementaire

### Droit Foncier

**Dahir 2011 (Réforme majeure)**
- Système moderne, basé sur enregistrement volontaire
- 9 millions de titres enregistrés; ~1 million non-titré (zones rurales, succession complexe)
- Cadastre digital = objectif gouvernemental depuis 2015

**Structure administrative:**
- **ANCFCC** (Agence Nationale de la Conservation Foncière, du Cadastre et de la Cartographie) = sole operator
- Autorité décentralisée, 9 régions, ~200 offices notariaux
- Digitalisation en cours, mais legacy systems fragiles

### Succession & Héritage

- **Loi islamique malékite** (école juridique dominante)
- SafeLandFridda déjà codé pour Maroc (1/3 = épouse + enfants, variantes selon configuration)
- Acceptation sociale forte (conformité religieuse non-négociable)

### Cadre Crypto & Blockchain

- **Politique:** Non régulée explicitement; Bank Al-Maghrib (banque centrale) prudente mais ouverte
- **Interprétation:** Blockchain comme outil technologique = acceptable (pas crypto-trading)
- **Risque:** Faible à moyen terme; government dialogue en cours

### Conformité & Fiscalité

- **DGI** (Direction Générale des Impôts): 4% droits d'enregistrement (transactions immobilières)
- **ANCFCC fee:** ~0.5% (enregistrement cadastral)
- **TVA:** 20% applicable (escrow ventes)
- **Gestion:** SafeLand collecte, reverse à DGI (audit nécessaire mais standard)

---

## 3. Stratégie d'Acquisition & Partenariats

### Timeline

| Phase | Date | Objectif |
|-------|------|----------|
| **LOI signing** | 28 février 2026 | Engagement gouvernemental signé (exists) |
| **Data audit** | Janv-mars 2026 | Audit 100K titres, migration staging |
| **Testing & UAT** | Avr-mai 2026 | Stakeholder testing, notary training |
| **Go-live** | 30 juin 2026 | 500-1000 titles production, 100+ users |
| **Operations** | Jul-dec 2026 | Scale to 5K+ titles, onboard 50-100 notaires |

### Chemin d'Acquisition

**Stakeholder clé:**
- **Ministry champion:** Director ANCFCC + Digital Transformation Officer (MoI)
- **Entry point:** Existing relationship (CEO/founder direct access)
- **Validation:** Letter of Intent (signed Feb 2026)

**Pitch clé:**
- Souveraineté numérique (solutions propriétaires marocaines)
- Efficacité (6-12 mois → jours)
- Showcase international (Morocco = African innovation leader)
- Revenue share (DGI + government co-invest)

### Financement & Modèle Commercial

**Pas de financement externe nécessaire** (gouvernement + SafeLand cofinance)

| Composant | Montant | Source |
|-----------|---------|--------|
| License deployment | €450K | Negotiated (fork + audit + training) |
| Infrastructure (YR1) | €80K | SafeLand |
| Team on-site (YR1) | €120K | SafeLand |
| Government co-invest | €100K | ANCFCC budget |
| **Total YR1 deployment** | **€750K** | **Shared** |

### Partenaires & Rôles

| Entité | Rôle | Engagement |
|--------|------|-----------|
| ANCFCC | Data provider, product owner, marketing | Full-time PM + director endorsement |
| Ministry (MoI) | Regulatory green light, ministry comms | Letter + press support |
| Notaries association | Training, adoption champions | 50+ notaries sign-up by Dec 2026 |
| DGI | Tax coordination, fee collection | Revenue share agreement |
| SafeLand | Product, deployment, ops | 2 devs on-site (6 months) + remote SaaS team |

---

## 4. Roadmap Produit pour le Maroc

### MVP (Juin 2026) — Pilot Phase

**Scope:** 500-1000 titres, 3 régions (Casablanca, Rabat, Fès)

**Modules inclus:**
1. **ERC-721 Land Titles** — Mint per property
   - Legacy cadastre data → blockchain
   - Metadata: propriétaire, surface, localisation GPS, références légales
2. **Escrow Transactions** — Full buyer-seller-notary workflow
   - Buyer deposit → escrow contract (SafeLandEscrow)
   - DGI fees automated (4% + ANCFCC 0.5%)
   - Signature blockchain (notary + parties)
   - Release = transfer ownership + mint new title to buyer
3. **Succession (SafeLandFridda)** — Malékite rules
   - 1/3 épouse + 2/3 enfants (no gender discrimination variant if applicable)
   - Multi-heir distribution, automatic fund split
   - Governance: heirs vote for estate manager
4. **Tasaluh Pilot** — Informal land dispute resolution
   - 50-100 land disputes (local mediation)
   - Blockchain-recorded outcomes
   - Proof of concept for future "justice module" cross-border

### Year 1 (H2 2026) — Growth Phase

- Scale to 10,000 titles (3 regions + urban centers)
- Onboard 50+ active notaries
- Achieve 1,000+ escrow transactions
- Revenue: €270K (license + SaaS + platform fees)

### Year 2 (2027) — Titrables Module

- **Use case:** Real estate investment fractionalization
  - Investor buys 1% fractional ownership in multi-unit building
  - ERC-1155 tokens (fungible fractions)
  - Dividend distribution (rental income) automated
- **Revenue impact:** €150K+ (module licensing + platform fees on higher transaction volume)

### Year 3 (2028+) — Hypothèque API

- Bank integration (mortgage scoring + credit decisioning)
- Automated collateral valuation (title metadata → bank API)
- Revenue: Bank partnerships, API licensing, credit facilitation fees

---

## 5. Plan de Déploiement & Ressources

### Phase 1 — Discovery & Infrastructure (Janvier—Mars 2026)

**Objectifs:**
- On-ground team operational (Rabat office)
- Data audit: 100K sample titles validated
- Infrastructure secure (server, VPN, compliance)

**Ressources:**
- 2 senior devs (Rabat-based, relocation budget ~€40K)
- 1 PM on-ground (3 months)
- Office rental (Rabat, 6 months): €6K
- VPN/security audit: €5K

**Livrables:**
- Data migration playbook (legacy cadastre format → blockchain staging)
- Infrastructure security sign-off
- Notary training materials (v1)

**Défi principal:** Legacy cadastre data chaotic (20+ years of entry standards)
→ Mitigation: 3-month audit + 30% contingency time buffer

---

### Phase 2 — Testing & UAT (Avril—Mai 2026)

**Objectifs:**
- 500 titres tested in staging environment
- 50 stakeholders (notaries, ministry, ANCFCC staff) UAT sign-off
- Go-live risk assessment ≤ medium

**Ressources:**
- QA team (2 people, remote + 1 on-site)
- Notary training cohort 1 (25 notaries, 2 weeks)
- Legal compliance review

**Livrables:**
- UAT report + sign-off
- Contract audit (smart contract security review)
- Go-live checklist

---

### Phase 3 — Go-Live (30 Juin 2026)

**Objectifs:**
- Production deployment, 100+ concurrent users
- Press conference (government announcement)
- Day-1 transactions successful (5-10 escrow deals)

**Ressources:**
- Full deployment team (4 people): 2 devs, 1 QA, 1 devops
- Ministry comms team
- 24/7 on-call support (first week)

**Livrables:**
- Production environment live
- Government press release
- Day-1 transaction monitoring dashboard

---

### Phase 4 — Operations & Growth (Juillet—Décembre 2026)

**Objectifs:**
- 5,000+ titles on-chain by Dec 31
- 50-100 active notaries
- €200K+ revenue collected

**Ressources:**
- 2 devs on-site (ongoing)
- 1 remote SaaS engineer (monitoring, updates)
- Customer success manager (1 FTE, Rabat)
- 24/7 support desk (shared Morocco + regional)

**Activités:**
- Onboard cohort 2 (50 notaries, Nov-Dec)
- Monitor transaction volume + DGI fee collection
- Monthly stakeholder syncs (ANCFCC + ministry)
- Scale infrastructure (if >1000 tx/day)

---

### Budget Déploiement Total

| Item | Montant |
|------|---------|
| **Personnel (6 mois)** | |
| - 2 devs on-site (€4K/mo × 6) | €48K |
| - 1 PM (€3K/mo × 3) | €9K |
| - QA (€2K/mo × 6) | €12K |
| - CSM (€2K/mo × 6) | €12K |
| **Infrastructure & Tools** | |
| - Office rental (€1K/mo × 6) | €6K |
| - VPN/security/audit | €5K |
| - Servers + database (year 1) | €15K |
| **Training & Comms** | |
| - Notary training program | €8K |
| - Government PR/launch event | €10K |
| **Contingency (15%)** | €22K |
| **Total Deployment** | **€147K** |
| **License (ANCFCC negotiated)** | **€450K** |
| **Combined Package** | **€597K** |

*Note: License negotiated separately; deployment is SafeLand-funded (R&D investment); government co-invests €100K*

---

## 6. Projections Financières

### Year 1 (H2 2026 + transitions)

| Revenue Stream | Estimate | Notes |
|---|---|---|
| **License Fee** | €450K | One-time (deployment only) |
| **SaaS Monitoring** | €50K | €50K/year (4 modules, standard support) |
| **Platform Fees** | €100-200K | 0.2% of escrow transactions (~€100-200M escrow volume projected) |
| **Tasaluh Module** | €20K | Pilot, 50-100 disputes recorded |
| **Total Year 1** | **€620-720K** | **High, due to license payment** |

### Year 2-3 Recurring

| Year | SaaS | Platform | Modules | Total |
|---|---|---|---|---|
| **Year 2** | €50K | €300K | €150K (Titrables) | €500K |
| **Year 3** | €50K | €400K | €200K (Hypothèque) | €650K |

### Operating Costs Recurring

| Category | Year 1 | Year 2+ |
|---|---|---|
| **Personnel (remote SaaS)** | €60K | €80K |
| **Infrastructure & ops** | €30K | €40K |
| **Security audits** | €10K | €15K |
| **Support & training** | €20K | €25K |
| **Total OpEx** | **€120K** | **€160K** |

### Profitability

- **Year 1 net:** €500K (after ops; license amortized)
- **Year 2+ net:** €340K+ annually (sustainable, growing)
- **IRR:** 35%+ (strong case)

---

## 7. Risques & Mitigations

### Risque #1 — Bureaucratie ANCFCC (Moyen)

**Description:** ANCFCC est organisme étatique lourd; décisions lentes, comités multiples.

**Impact:** Retard go-live, scope creep, demandes de modification tardives.

**Mitigation:**
- Direct relationship CEO ↔ Director ANCFCC (bypass bureaucracy)
- Secure minister's letter upfront (political cover)
- Define scope freeze 2 months before go-live (contractual)
- Weekly steering committee (accelerate decision-making)

---

### Risque #2 — Data Migration Chaos (Moyen)

**Description:** Cadastre hérité = 20+ ans de standards différents, incohérences, gaps.

**Impact:** Délai migration +30%, bugs en production, loss of trust.

**Mitigation:**
- 3-month data audit (Janv-mars 2026, before Phase 2)
- Automated validation pipeline (detect + flag problematic records)
- Contingency buffer (6 weeks extra in schedule)
- Parallel run (old + new system 2 months if critical)

---

### Risque #3 — Notaire Resistance (Moyen)

**Description:** Notaires habituées au process analog; peur de technologie, perte de fees.

**Impact:** Lenteur adoption, low transaction volume, revenue miss.

**Mitigation:**
- Training cohorts (2 weeks hands-on, small groups)
- Financial incentive (early adopters get 10% fee share increase)
- "Super user" champions (5-10 notaires pionniers, advocates)
- Showcase quick wins (first 10 transactions automated, saved time = £/hour)

---

### Risque #4 — Demande Fiscale Surprise (Bas-Moyen)

**Description:** DGI (tax authority) demands différent fee structure ou format de reporting.

**Impact:** Contract renegotiation, revenue model shift.

**Mitigation:**
- Legal review upfront (fiscal clause negotiated, in writing)
- Flexible fee model (platform supports % and flat fees)
- Monthly DGI reconciliation (avoid surprises)
- Escalation path (CEO + ministry if dispute)

---

### Risque #5 — Compliance Blockchain (Bas)

**Description:** Morocco later regulates crypto/blockchain; SafeLand deemed non-compliant.

**Impact:** Government pulls deployment, reputational damage.

**Mitigation:**
- Position as "cadastral digitization tool" (not crypto)
- No native token (uses Ethereum, external blockchain)
- Regulatory monitoring (legal team flags changes)
- Pivot to private blockchain if needed (6-month effort)

---

## 8. KPIs & Métriques de Succès

### Objectifs Opérationnels

| Milestone | Target | Timeline |
|-----------|--------|----------|
| **Titles on-chain** | 500 | Jun 2026 (go-live) |
| | 2,000 | Sep 2026 |
| | 5,000 | Dec 2026 |
| **Active notaries** | 25 | Jun 2026 |
| | 50 | Sep 2026 |
| | 100+ | Dec 2026 |
| **Escrow transactions** | 10 | Jun 2026 (week 1) |
| | 100/mo | Aug 2026 |
| | 500+/mo | Dec 2026 |

### Métriques Commerciales

| KPI | Target | Notes |
|-----|--------|-------|
| **Revenue Year 1** | €620K+ | License + SaaS + platform fees |
| **SaaS ARR (recurring)** | €50K+ | By Dec 2026 |
| **Platform fee volume** | €150K+ | By Dec 2026 |
| **NPS (net promoter score)** | ≥ 45 | Survey notaries + ministry Q4 2026 |
| **Uptime** | 99.5% | Measured Jan-Dec 2026 |

### Métriques Produit

| Métrique | Target |
|----------|--------|
| **Data accuracy** | 99%+ (title to blockchain match) |
| **Escrow settlement time** | < 3 days (vs. 6-12 months legacy) |
| **User adoption** | 50%+ notaries in 3 regions within 6 months |
| **Mobile usage** | 20%+ transactions via mobile (future roadmap) |

### Milestones Critiques

1. **Data audit completed** (Mar 31) — Must clear before UAT
2. **Notary training cohort 1** (May 31) — 25 notaries certified
3. **UAT sign-off** (May 31) — Ministry + ANCFCC approval
4. **Go-live Day 1** (Jun 30) — 10+ transactions, zero downtime
5. **Month 3 review** (Sep 30) — 2K+ titles, governance meeting with ministry

---

## 9. Réapprovision & Contact

**PM Déploiement:** [TBD]  
**Contact ANCFCC:** [TBD — Director + PM]  
**Contact Ministry:** [TBD — Digital Transformation Officer]  

**Prochaines étapes (Avril 2026):**
1. Confirm on-ground team (2 devs hire/relocation)
2. Kick-off data audit
3. Weekly steering committee begins
4. Legal: finalize license + revenue share agreement
