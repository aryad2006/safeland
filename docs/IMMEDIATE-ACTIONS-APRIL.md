# Immediate Actions — April 2026 (Next 2 Weeks)

## Week 1 (Apr 1-7): Kickoff

### Monday, Apr 1
- **CEO:** Series Seed pitch finalized, first investor meetings scheduled
- **CTO:** Quick win review, assign owners (Platform Fee, Generator, Dashboard)
- **PM:** Maroc timeline review with ANCFCC (UAT start date)

### Wednesday, Apr 3
- **CTO + Backend:** Platform Fee design review (30 min)
  - Escrow.sol parameter injection (platformFeeBps, platformWallet)
  - Test scenarios (0.05%, 0.1%, edge cases)
  - Security review (reentrancy, overflow checks)
- **Frontend:** Dashboard MVP scope finalized (30 min)
  - Component list (HealthCard, MetricsChart, AlertPanel)
  - TheGraph query design
  - Figma mockups review

### Friday, Apr 5
- **All-hands:** Quick wins presentation, individual OKRs aligned
  - 5-minute summary per win
  - Owner confirmation + backup assignment
  - Risk flags identified
- **CTO:** Generator schema design kickoff (1h)
  - JSON schema design (name, blockchain, fiscal_rules, modules)
  - Parameter injection points in .env + Solidity contracts
  - Testing strategy (2 hypothetical countries)

---

## Week 2 (Apr 8-15): Execution Start

### Monday, Apr 8
- **CTO:** Platform Fee PR created (code review starts)
  - SafeLandEscrow.sol: Add platformFeeBps + platformWallet parameters
  - Tests: 20+ scenarios covering edge cases, fee calculation
  - Expected: Testnet deployment by Apr 12
  
- **Backend Lead:** Generator MVP branch created, JSON schema drafted
  - Define schema.json in `backend/src/generator/`
  - Stub `scripts/generate-fork.js` with validation logic
  - Expected: Schema finalized by Apr 10

- **Frontend:** Dashboard mockups reviewed (Figma)
  - HealthCard component (RPC latency, uptime, last block)
  - MetricsChart (daily users, transactions)
  - AlertPanel (RPC down, error spike, no blocks)
  - Expected: Components started by Apr 12

### Wednesday, Apr 10
- **PM + Dev:** Data migration ETL script started (ANCFCC data audit continues)
  - Legacy data format mapping (CSV → ERC-721 fields)
  - 1K sample record selection (highest data quality)
  - ETL script skeleton (extract → transform → load)
  - Expected: Mapping validated, ETL started by Apr 12

- **DevOps:** Runbook outline drafted (shared doc)
  - Architecture overview skeleton
  - Day-2 operations: incident response playbook structure
  - Monitoring & alerting section template
  - Expected: Outline complete by Apr 12, writing starts Apr 15

- **PM + QA:** Maroc go-live checklist finalized
  - ANCFCC acceptance criteria confirmed
  - UAT schedule (start Apr 15, complete Jun 20)
  - Production cutover procedure documented

### Friday, Apr 15
- **CTO:** Platform Fee merged to testnet, tested
  - Code review sign-off
  - Testnet deployment (fee collection verified)
  - Audit trail tested (exportable report working)
  - **Blockers:** Any failing tests → escalate to CTO immediately

- **Backend:** Generator v0.1 code review (PR ready)
  - JSON schema validation working
  - Parameter injection for 1 sample country (hypothetical)
  - Tests: Schema validation, env file generation
  - Expected: PR ready for merge by end of day

- **Frontend:** Dashboard components started
  - HealthCard + MetricsChart wired to backend /metrics endpoint
  - Figma-to-React components 50% complete
  - Expected: Basic dashboard layout rendered by Apr 20

- **PM:** Maroc UAT kickoff (ANCFCC team)
  - 5 test users created on testnet
  - Initial workflows tested (property registration, escrow)
  - Expected: UAT running live by Apr 20

---

## Owners & Escalation

| Task | Owner | Backup | Escalate to |
|------|-------|--------|-------------|
| Platform Fee | CTO | Senior Dev | CEO if blocked |
| Generator MVP | Backend Lead | DevOps | CTO if scope creep |
| SaaS Dashboard | Frontend Lead | UI/UX | CTO if architecture issues |
| Data Migration | PM | Backend Dev | CEO if ANCFCC delays |
| Runbook | DevOps | CTO | PM if prioritization conflict |

---

## Weekly Syncs

- **Mon 10am:** Quick Wins standup (15 min)
  - Each owner: status, blockers, help needed
  - Red flags flagged immediately

- **Wed 2pm:** Technical review (1h)
  - Platform Fee: Test results, deployment readiness
  - Generator: Schema review, parameter injection validation
  - Dashboard: Component progress, TheGraph queries
  - Data migration: ETL progress, ANCFCC feedback
  - Runbook: Outline review, escalation procedures

- **Fri 4pm:** All-hands (15 min)
  - Weekly status recap
  - Risk flags + mitigation
  - Next week priorities

---

## Go/No-Go Decision Points

### Apr 15 Checkpoint
- ✅ Platform Fee: Tests passing, testnet deployment successful
- ✅ Generator: Schema finalized, v0.1 code review ready
- ✅ Dashboard: Components started, TheGraph queries defined
- ✅ Data Migration: 1K records selected, ETL script started
- ✅ Runbook: Outline finalized, writing started

**Red flags:**
- Platform Fee tests failing → CTO allocates 50% effort week 2
- Generator scope creeping → Lock scope to env injection by Apr 12
- Dashboard blocked on TheGraph → Use cached data spike for demo
- Data migration data quality issues → Escalate to CEO, plan alternate data source
- Runbook deprioritized → Defer to May 1, backfill DevOps workload

---

## Risk Flags & Mitigations

| Risk | Flag | Mitigation | Owner |
|------|------|-----------|-------|
| Platform Fee test failures | Emerging in code review | Allocate CTO +50% effort | CTO |
| Generator scope creep | Requests for templating | Lock scope to env injection only | Backend Lead |
| Dashboard complexity | TheGraph query issues | Use hardcoded spike data for demo | Frontend Lead |
| Data migration quality | Legacy records messy | Start with 1K cleanest only, audit first | PM |
| Team overload | 5 wins + Maroc UAT = 300h | Consider contractor for Generator or Data Migration | CEO |

---

## Slack/Communication Channels

- **#quick-wins-q2:** All updates, blockers, decisions
- **#maroc-uatf:** ANCFCC team, UAT updates
- **#devops:** Deployment, monitoring, tooling
- **#tech-review:** Technical decisions, code reviews

---

## Deliverables by Apr 15

| Deliverable | Owner | Status |
|---|---|---|
| Platform Fee merged & testnet verified | CTO | ✓ |
| Generator v0.1 PR ready | Backend | ✓ |
| Dashboard components 50% built | Frontend | ✓ |
| ETL script skeleton running | PM+Dev | ✓ |
| Runbook outline finalized | DevOps | ✓ |
| Maroc UAT kickoff meeting completed | PM | ✓ |

---

## Next Phase (Apr 15 - May 15)

Once Apr 15 checkpoint passed:

1. **Generator v0.2** (Backend, Apr 15-May 1)
   - Contract parameter injection
   - Generate Sénégal fork (test)
   - Documentation

2. **Dashboard MVP production-ready** (Frontend, Apr 15-May 15)
   - All components wired
   - Monitoring Maroc testnet live
   - UI polish

3. **Data migration complete** (PM+Dev, Apr 15-May 1)
   - All 1K records minted on testnet
   - ANCFCC validation complete
   - UAT sign-off

4. **Runbook + playbook written** (DevOps, May 1-7)
   - Day-2 ops section complete
   - Incident response documented
   - ANCFCC IT team review

5. **Series Seed prep** (CEO+CFO, ongoing)
   - Dashboard demo working
   - Platform fee model explained
   - Go-live timeline confirmed
