# SafeLand Quick Wins — Q2 2026 (Apr-Jun)

## Overview

5 concrete improvements to unlock Maroc go-live readiness and de-risk Series Seed fundraising. All achievable in 4-6 weeks with current team.

---

## Quick Win #1: Platform Fee Escrow Collection

**Owner:** CTO (Solidity)  
**Timeline:** Weeks 1-2 (Apr 1-15)  
**Effort:** 80 hours  
**Impact:** Revenue model verified, Maroc compliance confidence +20%

### What
Add platform fee (0.1% configurable) to SafeLandEscrow.sol escrow settlement. Currently only DGI + ANCFCC fees captured.

### How
1. Add `platformFeeBps` parameter to Escrow constructor
2. Calculate fee at settlement: `fee = escrowAmount * platformFeeBps / 10000`
3. Route fee to `platformWallet` address (multi-sig or timelock)
4. Emit `PlatformFeeCollected` event for audit trail
5. Add 5+ unit tests covering edge cases

### Success Metric
- Fee calculation tested on 20+ transaction scenarios
- Testnet fee collection verified (0.1% deducted from escrow settlement)
- Audit trail shows all fees collected (exportable report)

### Risk
- Maroc may resist fee; mitigation: Start at 0.05%, make transparent, tie to SaaS value

---

## Quick Win #2: Fork Generator MVP — JSON Config + Parameter Injection

**Owner:** Backend lead + DevOps  
**Timeline:** Weeks 2-4 (Apr 15 - May 15)  
**Effort:** 120 hours  
**Impact:** 50% faster deployments (6 weeks → 3 weeks), unblocks Sénégal/Bénin scaling

### What
Build minimal fork generator: JSON schema validation + template file copy + parameter injection (no complex templating yet).

### How
1. Define `country.json` schema:
   ```json
   {
     "name": "senegal",
     "inheritance_school": "hanafi",
     "fiscal_rules": {
       "dgi_percent": 4,
       "ancfcc_percent": 1,
       "platform_fee_bps": 10
     },
     "regions": ["dakar", "kaolack"],
     "support_modules": ["escrow", "succession", "marketplace"]
   }
   ```
2. Create `scripts/generate-fork.js`:
   - Input: `country.json` + source template
   - Output: Customized fork directory
   - Actions: Copy contracts, inject params into .env files, generate docs
3. Test on 2 hypothetical countries (Egypt, Kenya configs)
4. Generate Sénégal fork in 4 hours (goal: manual equivalent = 40 hours)

### Success Metric
- Generator v0.1 produces deployable fork in <4 hours
- Sénégal fork generated, tested on testnet
- Docs: "Generating a fork" guide (2 pages)

### Risk
- Scope creep into complex templating (EJS, Solidity macro expansion); mitigation: Lock scope to env injection only

---

## Quick Win #3: SaaS Admin Dashboard MVP — Monitoring Only

**Owner:** Frontend lead  
**Timeline:** Weeks 2-4 (Apr 15 - May 15)  
**Effort:** 100 hours  
**Impact:** Production monitoring capability, Series Seed demo asset

### What
Web dashboard showing real-time Maroc network health: uptime, user count, daily transactions, error alerts.

### Features (MVP, no bells)
- **Network Health:**
  - Blockchain RPC health (latency, sync status)
  - Smart contract event ingestion (transactions indexed)
  - Last block mined timestamp
- **User Metrics:**
  - Total active users (week-over-week)
  - New users (daily)
  - Daily active users (DAU)
- **Transaction Dashboard:**
  - Daily transaction volume (count, value)
  - Escrow transactions settled (count)
  - Average fee collected
  - Error rate (failed txs)
- **Alerts:**
  - RPC node down (red flag)
  - Transaction error spike (>5% errors, 1h window)
  - No new blocks (15 min)

### Tech
- Frontend: React component, TheGraph queries, Recharts for charts
- Backend: Existing Node.js API, new endpoints `/metrics` (returns JSON)
- Data: TheGraph subgraph (6 datasources already live), no new indexing needed

### Success Metric
- Dashboard deployed to staging by Jun 15
- Monitoring Maroc production (real-time data)
- Team uses it for on-call support (proves utility)

### Risk
- Scope creep (user management, alerts email, custom reports); mitigation: MVP = read-only monitoring only

---

## Quick Win #4: Maroc Data Migration & UAT Dry-Run

**Owner:** PM + 1 backend dev  
**Timeline:** Weeks 2-3 (Apr 15 - May 1)  
**Effort:** 60 hours  
**Impact:** ANCFCC confidence +30%, data mapping validated

### What
Migrate first 1,000 historical land titles from ANCFCC legacy system to Maroc testnet. Validate mapping, run UAT with ANCFCC team.

### Steps
1. Data audit: Map ANCFCC legacy record format → ERC-721 title fields
2. ETL script: Extract 1K sample titles, transform to contract parameters, load to testnet
3. Validation: ANCFCC team verifies 10 random titles (properties, ownership, addresses match)
4. UAT: 5 ANCFCC staff test user workflows on testnet (register, transfer, escrow)

### Success Metric
- 1,000 titles successfully minted on testnet
- ANCFCC team certifies data accuracy (90%+ match to legacy)
- UAT sign-off: "System ready for production data"

### Risk
- Legacy data messy (missing fields, inconsistent formats); mitigation: Start with 1K cleanest records, scope larger migration to Phase 2

---

## Quick Win #5: Deployment Runbook & Post-Launch Playbook

**Owner:** DevOps + CTO  
**Timeline:** Week 3 (May 1-7)  
**Effort:** 40 hours  
**Impact:** Team confidence +25%, operations sustainable

### What
Write operational runbook: how to deploy updates, scale infrastructure, handle incidents, escalate to SafeLand.

### Contents
1. **Architecture Overview** (1 page)
   - Smart contracts (which are upgradeable, multisig controls)
   - Backend services (Node.js, DB, WebSocket)
   - Frontend (static assets, CDN)
   - TheGraph (subgraph, indexing)

2. **Day-2 Operations** (5 pages)
   - **Incident response playbook:**
     - High error rate → check RPC health → restart backend → escalate to SafeLand
     - Missing blocks → check Polygon network status → wait or redeploy
     - User reports fraud → check transaction on-chain → support team investigation
   - **Deployment process:**
     - Smart contract upgrade: Propose via timelock → Wait delay → Execute
     - Backend update: Deploy to staging → Test → Production (blue-green)
     - Frontend: Build + upload to CDN → Verify → Cache invalidate

3. **Monitoring & Alerting** (2 pages)
   - Key metrics to watch (RPC latency, tx error rate, user growth)
   - Alert thresholds
   - Who to escalate to (SafeLand support email, Slack channel)

4. **Disaster Recovery** (2 pages)
   - Key loss: Use multi-sig recovery (explained)
   - Data corruption: Rollback via subgraph snapshot
   - Complete outage: Instructions to operate independently

### Success Metric
- Runbook certified by Maroc IT team: "Sufficient to operate first month"
- SafeLand support contact + escalation procedures documented
- Operations team (ANCFCC) can handle common issues without SafeLand hand-holding

---

## Summary Table

| Win | Owner | Timeline | Effort | Impact | Success Metric |
|-----|-------|----------|--------|--------|---|
| Platform Fee | CTO | Apr 1-15 | 80h | Revenue model ✓ | Fee tested on 20+ txs |
| Generator MVP | Backend | Apr 15-May 15 | 120h | 50% faster | Generate fork <4h |
| SaaS Dashboard | Frontend | Apr 15-May 15 | 100h | Production monitor | Live by Jun 15 |
| Data Migration | PM+Dev | Apr 15-May 1 | 60h | ANCFCC confident | 1K titles, UAT sign-off |
| Runbook | DevOps | May 1-7 | 40h | Operations ✓ | IT team certified |

**Total effort:** 400 hours ≈ 2 FTE × 10 weeks  
**Team allocation:** Stagger across 4 devs (no one overloaded)  
**Timeline:** All done by May 31 (before Series Seed close)

---

## Next Steps

1. Review with CTO/PM this week (Apr 1-2)
2. Assign owners and kick off Apr 1
3. Weekly syncs (Mon standup, Wed technical review)
4. Go/No-Go decision May 15
