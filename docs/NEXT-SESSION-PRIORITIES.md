# Next Session Priorities — Execution Roadmap

**Updated:** April 4, 2026
**Next review:** April 15, 2026 (Generator checkpoint)

---

## Priority 1: IMMEDIATE (Week of Apr 1)

### All-Hands Kickoff (Apr 1)
- [ ] CEO presents 3-year vision + quick wins to all staff
- [ ] Assign owners to 5 quick wins (Platform Fee, Generator, Dashboard, Data Migration, Runbook)
- [ ] Align individual OKRs with quick win deliverables
- [ ] Introduce memory system (where to find context)

**Owner:** CEO
**Duration:** 2 hours
**Success:** Team clarity on priorities + assignments

---

## Priority 2: Apr 1-15 (Week 1-2)

### Platform Fee Implementation (P1)
- [ ] CTO: Design SafeLandEscrow fee logic (0.1% configurable)
- [ ] CTO: Create PR with implementation + tests
- [ ] Code review: Senior dev approval
- [ ] Target: Merged to testnet by Apr 10
- [ ] Success metric: Fee calculation tested on 20+ scenarios

**Owner:** CTO
**Effort:** 80h
**Blocker check:** If slipped to Apr 20, escalate immediately

### Generator MVP Scope Lock (P1)
- [ ] Backend Lead: JSON schema design (country configs, inheritance schools, fiscal rules)
- [ ] DevOps: Bash/Node.js generator skeleton (copy + env injection, NO EJS templating)
- [ ] Create branch: `feature/generator-mvp`
- [ ] Target: Schema + generator skeleton by Apr 15 (code review ready)
- [ ] Success metric: Schema can generate Sénégal config in 1 hour

**Owner:** Backend Lead + DevOps
**Effort:** 40h (design phase only)
**Critical:** Lock scope by Apr 8 (no feature creep)

### SaaS Dashboard Mockups (P2)
- [ ] Frontend Lead: Finalize dashboard UX mockups (Figma)
- [ ] API Lead: Define /metrics endpoints (JSON response specs)
- [ ] Review with product + CTO
- [ ] Target: UX approved + API specs signed off by Apr 15
- [ ] Success metric: Frontend can start React components Apr 15

**Owner:** Frontend Lead
**Effort:** 20h

### Series Seed Prep (P1)
- [ ] CEO: Investor pipeline confirmed (10+ target LPs)
- [ ] Finance: Data room setup (Google Drive, key docs organized)
- [ ] CEO: Pitch deck PowerPoint started (using INVESTOR-DECK-OUTLINE.md)
- [ ] Target: Draft deck ready for feedback by Apr 15
- [ ] Success metric: 3 investor meetings booked for Apr 20+

**Owner:** CEO + Finance
**Effort:** 40h

### Maroc Preparation (P1)
- [ ] PM: Confirm ANCFCC UAT start date (target May 1)
- [ ] Dev: Begin data migration ETL script (ANCFCC legacy format → contract params)
- [ ] PM: Finalize go-live date (Jun 30 confirmed or escalate)
- [ ] Target: Data audit started, timeline locked by Apr 15
- [ ] Success metric: First 100 test titles mapped, format validated

**Owner:** PM + 1 Backend Dev
**Effort:** 20h

---

## Priority 3: Apr 15-30 (Week 3-4)

### Generator MVP Development (P1)
- [ ] Backend: Implement generator CLI (generate-fork.js)
- [ ] Backend: Parameter injection into .env files + contract config
- [ ] DevOps: Test on 2 hypothetical countries (Egypt, Kenya configs)
- [ ] Target: Generator MVP ready for Sénégal testing by May 1
- [ ] Success metric: Generate fork in <4 hours (vs 40+ manual)

**Owner:** Backend Lead + DevOps
**Effort:** 80h (implementation + testing)

### SaaS Dashboard Development (P2)
- [ ] Frontend: React components (health, users, transactions, alerts)
- [ ] API: /metrics endpoints (hardcoded data first, integrate TheGraph later)
- [ ] Target: Staging deployment by May 1
- [ ] Success metric: Dashboard displaying Maroc testnet data

**Owner:** Frontend Lead + API Backend
**Effort:** 60h

### Data Migration (P1)
- [ ] Dev: Complete ETL script for 1K sample titles
- [ ] QA: Validate 10 random titles (compare legacy vs on-chain)
- [ ] PM: Share testnet results with ANCFCC (confidence building)
- [ ] Target: 1K titles minted, ANCFCC review by May 1
- [ ] Success metric: ANCFCC confirms 90%+ data accuracy

**Owner:** PM + Backend Dev
**Effort:** 40h

### Series Seed Push (P1)
- [ ] CEO: Full investor deck complete (20-30 slides)
- [ ] CEO: 5+ investor meetings (pitch 45-min version)
- [ ] Finance: Cap table, financials model, use of funds finalized
- [ ] Target: Warm intros to 3+ lead investors by Apr 30
- [ ] Success metric: 1+ term sheet received by May 15

**Owner:** CEO + Finance
**Effort:** 60h

---

## Priority 4: May 1-15 (Week 5-6)

### Generator Testing & Finalization (P1)
- [ ] Backend: Test Sénégal fork generation end-to-end
- [ ] DevOps: Document generator usage (README updated)
- [ ] Target: Generator ready for production deployment by May 15
- [ ] Success metric: Generate Sénégal fork in 2-3 hours

**Owner:** Backend Lead + DevOps
**Effort:** 40h

### Dashboard MVP Production (P2)
- [ ] Frontend: Deploy dashboard to production
- [ ] Monitoring: Connect to Maroc network data
- [ ] SRE: Setup monitoring + alerts
- [ ] Target: Live and monitoring by May 15
- [ ] Success metric: Viewing real-time Maroc metrics

**Owner:** Frontend + DevOps
**Effort:** 40h

### Deployment Runbook (P2)
- [ ] DevOps: Write runbook (incident response, deployment, scaling)
- [ ] CTO: Review + sign-off
- [ ] PM: Share with ANCFCC IT (training)
- [ ] Target: Runbook approved by May 15
- [ ] Success metric: ANCFCC team can handle common issues

**Owner:** DevOps + CTO
**Effort:** 40h

### Series Seed Close Target (P1)
- [ ] CEO: Final investor meetings + negotiations (May 1-15)
- [ ] Legal: Prepare SAFE/term sheet documents
- [ ] Finance: Final due diligence data requests
- [ ] Target: **Series Seed closed by May 31** (hard deadline)
- [ ] Success metric: €3M in bank, announcement ready

**Owner:** CEO + Finance + Legal
**Effort:** 80h

---

## Priority 5: Jun 1-30 (Week 7-8)

### Maroc Go-Live (P1 — CRITICAL)
- [ ] PM: Final UAT week with ANCFCC (June 1-22)
- [ ] Tech: Production deployment readiness review (June 24-28)
- [ ] Support: 24/7 team on call (June 29-30)
- [ ] Launch: Go-live execution (June 30)
- [ ] Target: **June 30 go-live (LOI commitment)**
- [ ] Success metric: 100+ users active, 0 critical incidents day-1

**Owner:** PM + All + ANCFCC
**Effort:** 160h (team all hands)

### Sénégal Preparation (P1)
- [ ] PM: Discovery calls with World Bank + Sénégal ministry (June 1-15)
- [ ] Backend: Fork generation + testing on Sénégal config (June 15-30)
- [ ] Target: Fork ready for UAT by July 1
- [ ] Success metric: Sénégal fork tested, WB approval for go-live

**Owner:** PM + Backend
**Effort:** 80h

---

## Conditional Priorities (If Blocked)

### If Series Seed Delayed Beyond May 31
- [ ] **Scope cut Q2 2026:** Skip Bénin/RDC/Malawi deployments, focus Maroc + Sénégal only
- [ ] **Bridge financing:** Activate €500K angel backup funding
- [ ] **Hiring pause:** Freeze headcount, redirect to lean core team

### If Generator Slips Beyond Jul 31
- [ ] **Manual forks:** Deploy Sénégal/Bénin manually (6-8 weeks each)
- [ ] **Cost:** +€100K per country, timeline slip 4-6 weeks
- [ ] **Escalate:** CEO decision on Bénin deferral to 2027

### If CertiK Audit Finds 10+ Critical Issues
- [ ] **Remediation:** Allocate 6 weeks (Aug-Sep)
- [ ] **Parallel workstream:** Continue deployments on testnet, go-live after fixes
- [ ] **Series A timeline:** Pushed to Q1 2027

---

## Success Checkpoints

| Date | Milestone | Go/No-Go | Escalate to |
|------|-----------|----------|-------------|
| Apr 15 | Generator design locked, quick wins kickoff started | Go if <20% scope creep | CTO/PM |
| May 1 | Generator MVP ready, Dashboard staging live, Data migrated | Go if 80%+ complete | CEO |
| May 15 | Generator production, Series Seed warm intros closed | Go if generator works + 1+ term sheet | CEO |
| May 31 | **Series Seed CLOSED** | CRITICAL — No-go = Major pivot | Board |
| Jun 30 | **Maroc GO-LIVE** | CRITICAL — No-go = Credibility damage | Board |
| Jul 31 | **Generator v1 ready** | Go/No-go on Sénégal/Bénin scope | PM |

---

## Team Capacity Check

### Apr-May 2026 (Quick Wins Phase)
- Core team: 5 FTE (CEO, CTO, PM, Backend, Frontend)
- Deployment team: 2 FTE rotating (Maroc UAT + Sénégal prep)
- DevOps: 0.5 FTE
- **Total:** 7.5 FTE (tight but achievable)

### Jun 2026 (Maroc Go-Live + Sénégal Prep)
- Maroc support (full team during go-live week)
- Sénégal prep (parallel track, 2 FTE)
- **Potential bottleneck:** If Maroc issues = full team distracted from Sénégal
- **Mitigation:** Hire contractor for Sénégal fork generation if needed

---

## Resource Allocation by Priority

| Task | Priority | Owner | FTE | Duration | Status |
|------|----------|-------|-----|----------|--------|
| Series Seed | P1 | CEO + Finance | 1 FTE | Apr-May | CRITICAL PATH |
| Maroc go-live | P1 | PM + All | 2 FTE | Apr-Jun | CRITICAL PATH |
| Generator MVP | P1 | Backend + DevOps | 1.5 FTE | Apr-May | CRITICAL PATH |
| Platform Fee | P1 | CTO | 0.5 FTE | Apr | Unblocks revenue |
| SaaS Dashboard MVP | P2 | Frontend | 1 FTE | Apr-May | Nice-to-have by Jun |
| Data Migration | P1 | PM + Dev | 0.5 FTE | Apr-May | Maroc confidence |
| Runbook | P2 | DevOps | 0.25 FTE | May | Ops readiness |

---

## Recommended Next Session Start

**When:** April 8, 2026 (one week from session end, Apr 4)
**What to do:** Review quick wins progress (Generator design, Platform Fee PR, Dashboard mockups, Series Seed pitch)
**Duration:** 2-4 hours (checkpoint, not full strategy session)
**Owner:** PM or CTO (whoever is blocker)

**Memory to load:** MEMORY.md (auto-loaded, check project memory)

---

## Quick Command Reference

```bash
# Load project context
cat /Users/imac/.claude/projects/-Users-imac-Desktop-safeland-claude/memory/MEMORY.md

# Key docs
ls -la docs/QUICK-WINS-Q2-2026.md docs/IMMEDIATE-ACTIONS-APRIL.md docs/IMPLEMENTATION-ROADMAP.md

# Git history (11 commits from this session)
git log --oneline | head -15

# See all new files
git diff --name-only HEAD~11..HEAD | grep docs/

# Check team assignments
grep -r "Owner:" docs/QUICK-WINS-Q2-2026.md
```

---

## Sign-Off

**Prepared by:** Claude Code (subagent-driven execution)
**Date:** April 4, 2026
**Next review:** April 15, 2026

Ready to execute. All systems go.
