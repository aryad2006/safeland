# SafeLand SaaS TERMS OF SERVICE

Effective Date: [DATE]

This Terms of Service ("Agreement") governs your use of SafeLand SaaS services ("Services").

---

## 1. SERVICE LEVELS

### 1.1 Availability
SafeLand commits to 99.5% uptime (excluding scheduled maintenance, up to 4 hours/month).

### 1.2 Performance
- Dashboard API response time: <500ms (95th percentile)
- Data freshness: <5 minutes (transactions indexed via TheGraph)
- Report generation: <1 minute (monthly analytics)

### 1.3 Support Response Times

| Severity | Response Time | Escalation |
|----------|---------------|-----------|
| P1 Critical (service down) | 4 hours | CEO if >8 hours |
| P2 Major (degraded) | 24 hours | VP Engineering |
| P3 Minor (cosmetic) | 5 business days | — |

### 1.4 Credits for Non-Compliance
If SafeLand misses SLA targets:
- 99.0%-99.5%: 10% monthly credit
- 95.0%-99.0%: 25% monthly credit
- <95.0%: 50% monthly credit

---

## 2. FEATURES INCLUDED

### Tier: Starter (€50K/year)
- Multi-country admin dashboard (read-only access)
- Basic monitoring (uptime, error rates)
- Monthly reports (CSV export)
- Email support (business hours)

### Tier: Pro (€75K/year)
- Full admin dashboard (create alerts, manage settings)
- Advanced monitoring (per-country drill-down, transaction analysis)
- AI anti-fraud detection (anomaly alerts)
- Weekly reports (customizable)
- Phone support (business hours)

### Tier: Enterprise (€100K+/year, custom)
- All Pro features
- Dedicated success manager
- Custom reporting (SQL queries on demand)
- 24/7 phone + email support
- SLA 99.9%

---

## 3. ACCEPTABLE USE POLICY

Government agrees not to:
- Attempt to reverse-engineer SafeLand proprietary code
- Share SaaS login credentials outside authorized team members
- Use dashboard to export data for competing vendor (non-compete clause)
- Perform automated testing/scraping of APIs without permission

---

## 4. DATA & PRIVACY

### 4.1 What Data SafeLand Accesses
- Transaction metadata (sender, receiver, amount, timestamp) — needed for monitoring
- User activity logs (logins, actions) — for analytics and debugging
- Error logs (transaction failures) — for diagnostics
- Aggregate statistics (daily volume, unique users) — for reporting

### 4.2 What SafeLand Does NOT Access
- Private keys (never transmitted to SafeLand)
- Sensitive PII (names, addresses, IDs) — stay in Government DB
- Blockchain data beyond escrow transactions

### 4.3 Data Retention
- Live transaction data: 3 years
- Aggregated analytics: 5 years
- Error logs: 90 days (then deleted)
- Government may request data deletion at any time (with 30-day notice)

### 4.4 Data Breach Notification
If SafeLand experiences breach:
- Notify Government within 24 hours
- Provide details of breach scope
- Engage third-party forensics if needed
- Work with Government on disclosure (if required by local law)

---

## 5. CHANGES TO SERVICES

SafeLand may:
- Add new features (announced 30 days in advance)
- Deprecate old features (with 6-month notice)
- Modify pricing (with 12 months notice for next renewal)
- Change uptime targets (only with mutual agreement)

SafeLand will NOT:
- Remove core features (dashboard, monitoring, support)
- Degrade performance without compensation

---

## 6. PRICING & BILLING

- **Billing cycle:** Annual, invoice in advance (quarterly payment option available)
- **Payment terms:** Net 30 (invoice due within 30 days)
- **Late payment:** 1.5% monthly interest after 30 days overdue
- **Price adjustments:** Max +5% annually, starting Year 2

---

## 7. TERM & RENEWAL

- **Initial term:** 12 months
- **Auto-renewal:** Yes, unless 60-day notice of non-renewal provided
- **Renewal price:** Subject to adjustment per pricing schedule

---

## 8. TERMINATION

- **For convenience:** Either party may terminate with 12 months notice
- **For cause:** Non-payment (>60 days) or material breach (>30 days uncured)
- **Effect:** Access to dashboard stops immediately, data retained per retention policy

---

## 9. LIABILITY

SafeLand liability capped at [12 months of fees paid].

Excluded: Lost profits, lost revenue, reputational damages, consequential damages.

---

## 10. GOVERNING LAW & DISPUTE RESOLUTION

- **Jurisdiction:** [Country law if government is signatories, else Delaware law]
- **Arbitration:** Disputes resolved via arbitration (not litigation), per UNCITRAL rules if international
- **Escalation:** Executive-to-executive escalation required before formal proceedings

---

## 11. SIGNATURE

**GOVERNMENT MINISTRY**
_________________________
Name: [Title]
Date: _______________

**SAFELAND INC.**
_________________________
Name: [CEO]
Date: _______________
