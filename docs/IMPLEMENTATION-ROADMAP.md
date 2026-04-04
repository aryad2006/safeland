# SafeLand Implementation Roadmap — 2026-2027

## Strategic Context

This roadmap translates Phase 4-5 Quick Wins and Implementation Foundation into concrete coding tasks, team assignments, and dependencies. It covers:

1. **Quick Wins (Apr-May 2026):** 5 near-term improvements to unblock Maroc go-live
2. **Foundation (May-Jun 2026):** Architecture and tooling for multi-country scaling
3. **Scale (Jul-Dec 2026):** Deploy to 3+ countries, complete generator, SaaS admin MVP
4. **Growth (Jan-Dec 2027):** Feature modules, fundraising enablement, 7-country expansion

---

## Phase 1: Quick Wins (Apr 1 - May 31, 2026)

### Sprint 1: Apr 1-15 (Weeks 1-2)

#### Task 1.1: Platform Fee Escrow Collection (CTO, 80h)

**Files to modify:**
- `contracts/SafeLandEscrow.sol` — Add platformFeeBps + platformWallet
- `test/SafeLandEscrow.test.js` — Add 5+ fee calculation tests
- `backend/src/routes/escrow.js` — Add fee collection endpoint
- `deployed-addresses.json` — Update after redeployment

**Acceptance Criteria:**
- ✅ SafeLandEscrow accepts `platformFeeBps` parameter (0-100 bps)
- ✅ Fee calculated at settlement: `fee = escrowAmount * platformFeeBps / 10000`
- ✅ Fee routed to `platformWallet` address (configurable)
- ✅ `PlatformFeeCollected` event emitted with details (escrowId, amount, fee)
- ✅ 20+ unit tests passing (edge cases: 0 fee, max fee, rounding)
- ✅ Testnet deployment successful (no revert errors)
- ✅ Fee audit trail queryable via API

**Dependencies:** None (independent)

**Testing:**
```bash
npm test -- test/SafeLandEscrow.test.js --grep "platform fee"
npm run deploy:testnet
curl http://localhost:3001/api/escrow/123/fees
```

**Effort Breakdown:**
- Design + code review (10h)
- Solidity implementation (20h)
- Unit tests (20h)
- Integration testing (15h)
- Deployment + verification (15h)

---

#### Task 1.2: Generator MVP - Schema & Validation (Backend Lead, 40h)

**Files to create:**
- `backend/src/generator/schema.json` — JSON schema for country configs
- `backend/src/generator/validator.js` — Schema validation logic (Ajv)
- `backend/src/generator/__tests__/schema.test.js` — Jest tests
- `backend/src/generator/fixtures/senegal.json` — Sample config
- `backend/src/generator/fixtures/egypt.json` — Sample config

**Acceptance Criteria:**
- ✅ JSON schema defined (name, blockchain, inheritance_school, fiscal_rules, etc.)
- ✅ Schema validation working (20+ test cases)
- ✅ Valid configs: senegal.json, egypt.json pass validation
- ✅ Invalid configs: duplicate names, bad blockchain, missing fields detected
- ✅ Error messages clear and actionable
- ✅ Schema documented in `backend/src/generator/README.md`

**Dependencies:** None

**Testing:**
```bash
npm test -- backend/src/generator/__tests__/schema.test.js
npm run generate -- --config backend/src/generator/fixtures/senegal.json --validate-only
```

**Effort Breakdown:**
- Schema design (10h)
- Validation logic (15h)
- Tests (10h)
- Documentation (5h)

---

#### Task 1.3: Dashboard MVP - Component Mockups (Frontend Lead, 30h)

**Files to create:**
- `frontend/src/app/admin/dashboard.tsx` — Main dashboard page
- `frontend/src/components/HealthCard.tsx` — RPC health display
- `frontend/src/components/MetricsChart.tsx` — Charts (Recharts)
- `frontend/src/components/AlertPanel.tsx` — Active alerts display
- `frontend/src/hooks/useMetrics.ts` — API call hook (stub)
- `frontend/public/mock-data.json` — Mock metrics for preview

**Acceptance Criteria:**
- ✅ Dashboard page renders (no errors)
- ✅ HealthCard shows: RPC latency, uptime %, last block, sync status
- ✅ MetricsChart displays: daily users (7d trend), daily transactions
- ✅ AlertPanel lists active alerts with severity colors
- ✅ Components work with mock data (no API call yet)
- ✅ Responsive design (mobile + desktop)
- ✅ TypeScript types correct (no `any`)

**Dependencies:** None (mock data only)

**Testing:**
```bash
cd frontend && npm run dev
# Visit http://localhost:3000/admin/dashboard (should render)
npm run test:e2e -- admin/dashboard.spec.ts
```

**Effort Breakdown:**
- Component design (10h)
- Implementation (15h)
- Styling + responsive (5h)

---

#### Task 1.4: Maroc Data Migration Setup (PM + Backend Dev, 40h)

**Files to create:**
- `scripts/migrate-data/audit.js` — Legacy data format audit
- `scripts/migrate-data/etl.js` — Extract-transform-load script
- `scripts/migrate-data/fixtures/sample-1000.csv` — 1K sample records
- `backend/src/services/migration.js` — Migration service
- `docs/DATA-MAPPING.md` — ANCFCC legacy → ERC-721 mapping

**Acceptance Criteria:**
- ✅ Legacy data format documented (from ANCFCC samples)
- ✅ Mapping defined: address, property description, ownership chain → ERC-721 fields
- ✅ 1K sample records selected (highest data quality)
- ✅ ETL script extracts, transforms, validates records
- ✅ 1K records load to testnet without errors
- ✅ ANCFCC team can spot-check 10 random records (data accuracy ≥90%)
- ✅ ETL logs all transformations (for audit trail)

**Dependencies:** Testnet deployment (from Task 1.1)

**Testing:**
```bash
npm run migrate:data -- --source scripts/migrate-data/fixtures/sample-1000.csv --validate-only
# Spot-check on testnet (via dashboard)
```

**Effort Breakdown:**
- Data audit (15h)
- ETL script (20h)
- Validation + testing (5h)

---

#### Task 1.5: DevOps Kickoff - Runbook Outline (DevOps, 15h)

**Files to create:**
- `docs/DEPLOYMENT-RUNBOOK.md` — Complete operational guide (outline only)
- `docs/INCIDENT-RESPONSE.md` — Incident playbooks (outline)
- `scripts/monitoring/health-check.sh` — Simple RPC health check script

**Acceptance Criteria:**
- ✅ Runbook outline finalized (sections identified)
- ✅ Incident response scenarios documented (RPC down, error spike, etc.)
- ✅ Escalation procedures clear (who to contact, when)
- ✅ Health check script working (tests RPC latency, block sync)
- ✅ DevOps & CTO sign-off on outline

**Dependencies:** None

**Effort Breakdown:**
- Outline creation (10h)
- Script implementation (5h)

---

### Sprint 2: Apr 15 - May 15 (Weeks 3-6)

#### Task 2.1: Platform Fee Testing on Testnet (CTO, 20h)

**Files:**
- `test/SafeLandEscrow.test.js` — Integration tests on testnet
- `deployment-report.json` — Post-deployment report

**Acceptance Criteria:**
- ✅ 20+ fee scenarios tested on testnet
- ✅ All test cases passing (no reverts)
- ✅ Fee audit trail queryable
- ✅ Deployment report generated (gas costs, block height, etc.)

**Dependencies:** Task 1.1

**Effort:** 20h

---

#### Task 2.2: Generator MVP - .env Injection (Backend Lead, 40h)

**Files to create/modify:**
- `scripts/generate-fork.js` — Main generator CLI
- `backend/src/generator/generator.js` — Generator logic
- `backend/src/generator/steps/env-generator.js` — .env file generation
- `backend/src/generator/templates/.env.example` — Template
- `backend/src/generator/__tests__/generator.test.js` — E2E tests

**Acceptance Criteria:**
- ✅ `npm run generate --config senegal.json --output ../safeland-senegal` works
- ✅ Generates valid .env.local with injected params (RPC, fees, regions, etc.)
- ✅ Generated fork has correct directory structure
- ✅ Tests verify parameter injection correctness
- ✅ Documentation complete (usage examples, troubleshooting)
- ✅ Generator produces deployable fork in <4 hours (vs. 40h manual)

**Dependencies:** Task 1.2 (schema validation)

**Testing:**
```bash
npm run generate -- --config backend/src/generator/fixtures/senegal.json --output /tmp/safeland-senegal
ls -la /tmp/safeland-senegal/
cat /tmp/safeland-senegal/.env.local
npm test -- backend/src/generator/__tests__/generator.test.js
```

**Effort Breakdown:**
- CLI implementation (15h)
- .env generation (15h)
- Tests (10h)

---

#### Task 2.3: Dashboard - TheGraph Integration (Frontend Lead, 40h)

**Files to create/modify:**
- `frontend/src/hooks/useMetrics.ts` — TheGraph queries + API calls
- `frontend/src/app/admin/dashboard.tsx` — Wire metrics to backend
- `backend/src/routes/admin.js` — New admin API endpoints (stub)
- `backend/src/admin/README.md` — API documentation

**Acceptance Criteria:**
- ✅ Dashboard queries real data from backend /api/admin/metrics
- ✅ Backend provides: users, transactions, errors (from mock or TheGraph)
- ✅ Charts update every 60s (real-time feel)
- ✅ No API errors on dashboard
- ✅ Responsive & performant (< 2s load time)
- ✅ TypeScript types complete

**Dependencies:** Task 1.3 (mockups)

**Testing:**
```bash
npm run dev:frontend
# Load http://localhost:3000/admin/dashboard
# Should show real data from backend (or mock if backend not running)
```

**Effort Breakdown:**
- API integration (20h)
- Backend endpoints (15h)
- Testing & polish (5h)

---

#### Task 2.4: Maroc Data Migration - ETL Execution (PM + Dev, 30h)

**Files:**
- `scripts/migrate-data/sample-1000.csv` — 1K records
- `backend/logs/migration.log` — Execution log

**Acceptance Criteria:**
- ✅ 1K records successfully loaded to testnet
- ✅ ANCFCC team spot-checks 10 records (90%+ accuracy)
- ✅ No duplicate mints (data validation)
- ✅ Migration log clean (no errors or warnings)
- ✅ UAT sign-off: "System ready for production data"

**Dependencies:** Task 1.4, testnet running

**Effort Breakdown:**
- Execution (15h)
- ANCFCC coordination (10h)
- Log analysis (5h)

---

#### Task 2.5: Runbook Writing (DevOps + CTO, 40h)

**Files to write:**
- `docs/DEPLOYMENT-RUNBOOK.md` — Complete guide (sections)
- `docs/INCIDENT-RESPONSE.md` — 10+ incident playbooks
- `scripts/monitoring/alerts.sh` — Alert setup script
- `scripts/recovery/restore.sh` — Disaster recovery script

**Acceptance Criteria:**
- ✅ Runbook sections: Architecture, Day-2 ops, Monitoring, DR
- ✅ 10+ incident scenarios documented (with scripts where applicable)
- ✅ Escalation procedures: who to contact, when, how
- ✅ Recovery procedures tested (at least documented)
- ✅ ANCFCC IT team review & sign-off: "Sufficient for month 1 support"

**Dependencies:** None

**Effort Breakdown:**
- Writing (30h)
- Scripts (10h)

---

### Sprint 3: May 15 - May 31 (Weeks 7-8)

#### Task 3.1: Integration Testing & Bug Fixes (All, 40h)

**Focus:**
- Integrate Platform Fee + Generator + Dashboard + Data Migration
- End-to-end testing (generate fork → deploy → load data → monitor)

**Acceptance Criteria:**
- ✅ Generate Sénégal fork works end-to-end
- ✅ Deploy to testnet successful
- ✅ 1K data records loaded
- ✅ Dashboard shows real metrics
- ✅ No critical bugs

**Effort:** 40h (distributed)

---

#### Task 3.2: Series Seed Preparation (CEO + CTO, 30h)

**Deliverables:**
- Demo script (generate fork → deploy → show dashboard)
- Pitch deck update (with platform fee model, generator timeline)
- Financial model (based on fee collection data)

**Acceptance Criteria:**
- ✅ 10-minute demo video (fork → deploy → metrics)
- ✅ Pitch deck finalized
- ✅ Financial projections for investors

**Effort:** 30h (CEO + CTO only)

---

## Summary: Phase 1 (Apr-May)

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Platform Fee | CTO | 80h | ✓ |
| Generator Schema | Backend | 40h | ✓ |
| Dashboard Mockups | Frontend | 30h | ✓ |
| Data Migration Setup | PM+Dev | 40h | ✓ |
| Runbook Outline | DevOps | 15h | ✓ |
| Platform Fee Testing | CTO | 20h | ✓ |
| Generator .env | Backend | 40h | ✓ |
| Dashboard Integration | Frontend | 40h | ✓ |
| Data Migration Exec | PM+Dev | 30h | ✓ |
| Runbook Writing | DevOps | 40h | ✓ |
| Integration & Bugs | All | 40h | ✓ |
| Series Seed Prep | CEO | 30h | ✓ |

**Total:** ~485h ≈ 2.5 FTE × 8 weeks (with staggering)

**Key Milestones:**
- ✅ Apr 15: Platform Fee PR ready, Generator schema done, Dashboard components rendered
- ✅ May 1: Runbook outline, data migration 1K records ready
- ✅ May 15: Generator MVP working, Dashboard live on staging, all quick wins 80% done
- ✅ May 31: All quick wins complete, Series Seed ready to pitch

---

## Phase 2: Foundation (Jun 1 - Jun 30, 2026)

### Maroc Go-Live & SaaS Admin MVP

#### Task 4.1: Maroc Production Deployment (All, 80h)

**Files:**
- `.env.mainnet` — Production config
- `deployment-report-maroc.json` — Production deployment report

**Acceptance Criteria:**
- ✅ All contracts deployed to Polygon mainnet
- ✅ ANCFCC staff trained on production system
- ✅ Support procedures in place
- ✅ 24/7 monitoring setup
- ✅ Zero-downtime deployment (if needed)

**Timeline:** Jun 15-30

**Effort:** 80h

---

#### Task 4.2: SaaS Admin MVP Production (Frontend + Backend, 60h)

**Files to complete:**
- `backend/src/admin/db/admin-schema.sql` → Migrations
- `backend/src/admin/routes/metrics.js` → Real endpoints
- `backend/src/admin/routes/alerts.js` → Alert management
- `frontend/src/app/admin/metrics.tsx` → Metrics page
- `frontend/src/app/admin/alerts.tsx` → Alerts page

**Acceptance Criteria:**
- ✅ Admin API endpoints live on port 3002
- ✅ Admin dashboard monitoring Maroc production in real-time
- ✅ Alerts working (critical issues surfaced immediately)
- ✅ Team uses dashboard for on-call support
- ✅ Metrics history stored (30-day lookback)

**Effort:** 60h (40h backend, 20h frontend)

---

#### Task 4.3: Post-Launch Monitoring & Support (All, 120h)

**Activities:**
- Monitor Maroc production (24/7 for first week)
- Bug fixes + hotfixes
- ANCFCC user support
- Performance optimization

**Acceptance Criteria:**
- ✅ Zero critical incidents in first month
- ✅ User onboarding smooth
- ✅ No data loss or corruption
- ✅ Performance: transactions settle in <5 min

**Timeline:** Jun 30 - Jul 15 (post-launch week)

**Effort:** 120h

---

## Phase 3: Scale (Jul 1 - Dec 31, 2026)

### Deploy to Sénégal & Bénin, Complete Generator, SaaS Admin Features

#### Task 5.1: Generator Optimization (Backend + DevOps, 80h)

**Enhancements:**
- Phase 2: Solidity contract parameter injection
- Phase 2: Subgraph generation per country
- Phase 2: Docker-compose setup per fork

**Acceptance Criteria:**
- ✅ Sénégal fork generated + deployed in 3 weeks (vs. 6 weeks manual)
- ✅ Bénin fork generated + deployed in 3 weeks
- ✅ Generator fully automated (no manual steps)
- ✅ Deployment takes <4 hours (deploy script + monitoring setup)

**Timeline:** Jul 1 - Aug 15

**Effort:** 80h

---

#### Task 5.2: Sénégal Deployment (PM + 1 Dev, 80h)

**Activities:**
- Generate fork from config
- Deploy contracts to Polygon mainnet
- Load historical data (phase 1: 5K titles)
- SENELEC/government UAT
- Production launch

**Timeline:** Jul 15 - Aug 30

**Effort:** 80h

---

#### Task 5.3: Bénin Deployment (PM + 1 Dev, 80h)

**Activities:**
- Same as Sénégal (reuse generator, processes)
- Different inheritance school (Maliki)
- Historical data integration

**Timeline:** Aug 15 - Sep 30

**Effort:** 80h

---

#### Task 5.4: SaaS Admin Features (Frontend + Backend, 100h)

**New Features:**
- Multi-country metrics dashboard
- Custom reports & exports
- Predictive analytics (trends)
- Email alerts + escalation
- Settings management (admin-only)

**Acceptance Criteria:**
- ✅ Dashboard shows Maroc + Sénégal + Bénin metrics
- ✅ Reports exportable as CSV/PDF
- ✅ Email alerts for critical issues
- ✅ Trends & predictions visible (user growth forecast, etc.)

**Timeline:** Jul 1 - Sep 30

**Effort:** 100h

---

#### Task 5.5: Module Architecture Design (Product + CTO, 120h)

**Deliverables:**
- Module 1: Reconstruction (property recovery post-disaster)
  - Smart contract architecture
  - User flow & UI mockups
  - Risk analysis
- Module 2: Tasaluh (community financing)
  - Crowdfunding contract design
  - Governance mechanism
  - Token economics

**Timeline:** Jul 1 - Sep 30 (design only, implementation in 2027)

**Effort:** 120h

---

## Phase 4: Growth (Jan - Dec 2027)

### 7-Country Expansion, Feature Modules, Series A Readiness

#### 2027 Q1 (Jan-Mar)

- [ ] Egypt fork generation + deployment (40h)
- [ ] Kenya fork generation + deployment (40h)
- [ ] Module 1 (Reconstruction) MVP development (200h)
- [ ] Series A documentation (40h)

**Deployments:** Egypt (Jan), Kenya (Feb-Mar)

---

#### 2027 Q2-Q4 (Apr-Dec)

- [ ] Ivory Coast + Cameroon deployments (80h)
- [ ] Module 2 (Tasaluh) development (200h)
- [ ] Malawi + Rwanda deployments (80h)
- [ ] Nigeria pilot (80h)
- [ ] SaaS admin production features (120h)

**By EOY 2027:**
- 7 countries live (Morocco, Senegal, Benin, Egypt, Kenya, Ivory Coast, Cameroon)
- 2 feature modules live (Reconstruction, Tasaluh)
- Series A closed (if modules show traction)

---

## Team Structure

### Core Team (Permanent, 6 FTE)
- CEO (1) — Strategy, fundraising
- CTO (1) — Smart contracts, architecture
- PM (1) — Product, user research, deployments
- Backend Lead (1) — API, generator, admin backend
- Frontend Lead (1) — Dashboard, UI/UX
- DevOps (0.5) — Infrastructure, monitoring

### Deployment Team (Rotating, 2-3 FTE)
- Deployment Dev × 2-3 (rotating, 4-6 week assignments per country)
- QA/Tester (1, rotating)

### Part-Time / Contractors
- Legal advisor (0.25 FTE) — Country compliance, contracts
- BD (0.5 FTE) — Partnerships, fundraising support

**Total:** ~9 FTE + contractors

---

## Critical Path & Dependencies

### Apr-May 2026 (Quick Wins)
```
Platform Fee ─────────────┐
Generator Schema ──┬──────┤
                   ├──→ Generator .env ─┬──────┐
Dashboard Mockups ──┤                    ├──→ Integration Testing ──→ Series Seed
Data Migration ────┤                    ├──→ Maroc Deployment
Runbook Outline ────┴──────┬────────────┤
                           └──→ Runbook Writing
```

**Critical dependencies:**
1. **Generator schema** → blocks .env injection, contract parameter injection (Phase 2+)
2. **Platform Fee** → blocks fee testing, revenue model validation
3. **Data migration** → blocks Maroc UAT sign-off
4. **SaaS admin** → blocks production monitoring, Series Seed demo

---

### Jun-Aug 2026 (Foundation + Scale)
```
Maroc Deployment ──┐
                   ├──→ Sénégal Deployment ──┐
Generator Optimization ──┤                     ├──→ 3-Country Platform ──→ Series A
                         └──→ Bénin Deployment
SaaS Admin MVP ────────────────────────────────→ Production Monitoring
```

---

### 2027 (Growth)
```
Series A Closed ──┐
                  ├──→ Egypt + Kenya + Ivory Coast + Cameroon
Module 1 (Reconstruction) ──┐
Module 2 (Tasaluh) ─────────┼──→ Feature Expansion ──→ 7-Country Platform
Malawi + Rwanda ────────────┘
```

---

## Risk Mitigation

| Risk | Impact | Mitigation | Owner |
|------|--------|-----------|-------|
| Generator scope creep | Generator delay | Lock scope to MVP by May 15 | Backend Lead |
| Maroc go-live delay | Timeline slip | Start deployment prep May 1 | PM |
| CertiK audit delays | Series A delay | Start early (Aug), allocate 6-week buffer | CTO |
| Team bottleneck | Velocity slowdown | Hire contractors or defer Phase 3 features | CEO |
| Data quality issues | UAT failure | Start data audit early (Apr), prioritize clean data | PM |
| RPC provider issues | Production outage | Set up backup RPC, failover procedure | DevOps |

---

## Success Metrics

### Q2 2026 (Apr-Jun)
- [ ] Platform Fee live on testnet + fee model validated
- [ ] Generator MVP working (Sénégal fork <4h from config)
- [ ] Dashboard monitoring Maroc production
- [ ] 1K historical records on testnet
- [ ] Maroc go-live successful (0 critical bugs in first week)
- [ ] Series Seed closed (target: $2-5M)

### Q3 2026 (Jul-Sep)
- [ ] Generator fully automated
- [ ] Sénégal + Bénin live (3 countries total)
- [ ] SaaS admin MVP with multi-country metrics
- [ ] CertiK audit complete + 95% passing
- [ ] Module 1 (Reconstruction) design finalized

### Q4 2026 (Oct-Dec)
- [ ] 50K+ titles minted across 3 countries
- [ ] Admin dashboard used by 3 country operations teams
- [ ] Module 1 MVP development started
- [ ] Team expanded to 10-12 FTE

### 2027 (By Year-End)
- [ ] 7 countries live
- [ ] 500K+ titles on blockchain
- [ ] 2 feature modules live (Reconstruction, Tasaluh)
- [ ] Series A closed (target: $10-20M)
- [ ] 20+ FTE team

---

## Appendix: File Structure Reference

```
safeland-claude/
├── docs/
│   ├── QUICK-WINS-Q2-2026.md ...................... [CREATED] Phase 4 quick wins
│   ├── IMMEDIATE-ACTIONS-APRIL.md ................ [CREATED] April 1-15 action plan
│   ├── IMPLEMENTATION-ROADMAP.md ................. [CREATED] This file
│   ├── DEPLOYMENT-RUNBOOK.md ..................... [Phase 5, Jun] Day-2 ops guide
│   └── INCIDENT-RESPONSE.md ...................... [Phase 5, Jun] 10+ incident playbooks
│
├── backend/src/
│   ├── generator/
│   │   ├── README.md ............................. [CREATED] Generator documentation
│   │   ├── schema.json ........................... [CREATED] Country config schema
│   │   ├── generator.js .......................... [CREATED] Generator main logic
│   │   ├── validator.js .......................... [Phase 1 May] Schema validation
│   │   ├── steps/
│   │   │   ├── validate.js ....................... [Phase 1 May]
│   │   │   ├── env-generator.js ................. [Phase 1 May]
│   │   │   ├── contract-copy.js ................. [Phase 2 Jul]
│   │   │   └── doc-generator.js ................. [Phase 1 May]
│   │   ├── templates/
│   │   │   ├── .env.example ..................... [Phase 1 May]
│   │   │   └── DEPLOYMENT-GUIDE.md.template .... [Phase 1 May]
│   │   └── __tests__/
│   │       ├── schema.test.js ................... [Phase 1 Apr]
│   │       └── generator.test.js ............... [Phase 1 May]
│   │
│   └── admin/
│       ├── README.md ............................. [CREATED] Admin API documentation
│       ├── admin-schema.sql ..................... [CREATED] Database schema
│       ├── routes/
│       │   ├── health.js ........................ [Phase 2 Jun]
│       │   ├── metrics.js ....................... [Phase 2 Jun]
│       │   ├── alerts.js ........................ [Phase 2 Jun]
│       │   └── settings.js ...................... [Phase 2 Jun]
│       ├── services/
│       │   ├── metrics.js ....................... [Phase 2 Jun]
│       │   └── alerts.js ........................ [Phase 2 Jun]
│       └── __tests__/
│           ├── metrics.test.js .................. [Phase 2 Jun]
│           └── alerts.test.js ................... [Phase 2 Jun]
│
├── scripts/
│   ├── deploy/
│   │   ├── README.md ............................. [CREATED] Deployment tooling
│   │   ├── generate-fork.js ..................... [Phase 1 May] CLI entry point
│   │   ├── deploy-contracts.js ................. [Phase 2 Jun] Contract deployer
│   │   └── setup-monitoring.js ................. [Phase 2 Jun] Monitoring setup
│   │
│   └── migrate-data/
│       ├── audit.js ............................. [Phase 1 Apr]
│       ├── etl.js ............................... [Phase 1 Apr]
│       └── fixtures/
│           └── sample-1000.csv .................. [Phase 1 Apr]
│
├── countries/
│   ├── senegal.json ............................. [Phase 1 May]
│   ├── egypt.json ............................... [Phase 3 Jul]
│   └── kenya.json ............................... [Phase 3 Jul]
│
└── docker-compose.admin.yml ..................... [Phase 2 Jun] Admin stack
```

---

## Next Steps

1. **Apr 1:** Review with team, assign owners
2. **Apr 15:** Quick Wins 50% done, Series Seed pitch ready
3. **May 15:** Go/No-Go decision, all quick wins 80% done
4. **May 31:** Series Seed closed, all quick wins complete
5. **Jun 30:** Maroc go-live
6. **Jul 31:** Generator MVP ready, Sénégal deployment starts
7. **Aug 30:** Sénégal live
8. **Dec 31:** 3 countries live, Series A prep underway

---

**Roadmap Version:** 1.0  
**Last Updated:** 2026-04-15  
**Next Review:** 2026-05-15 (Go/No-Go decision)
