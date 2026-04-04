# SafeLand SaaS Admin API

## Overview

Backend API for multi-country monitoring and administration dashboard. Provides real-time metrics, alerts, system health, and operational controls for SafeLand deployments across multiple countries.

## Architecture

```
Frontend Dashboard (React)
  ↓
Admin API (/api/admin/*)
  ↓
Data Sources:
  ├─ TheGraph (subgraph queries for blockchain events)
  ├─ SQLite (metrics history, alerts, settings)
  ├─ Blockchain RPC (node health, sync status)
  └─ Application logs (error rates, transaction failures)
```

## API Endpoints (Stub - Phase 1)

### Health & Status

#### GET /api/admin/health
System health overview across all deployments.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-15T10:30:00Z",
  "blockchain": {
    "rpc_latency_ms": 150,
    "last_block": 18500000,
    "block_timestamp": "2026-04-15T10:29:45Z",
    "sync_status": "synced",
    "uptime_percent": 99.8
  },
  "backend": {
    "cpu_percent": 45,
    "memory_mb": 256,
    "uptime_hours": 72,
    "request_error_rate_percent": 0.1
  }
}
```

### Metrics Endpoints

#### GET /api/admin/metrics/users
User engagement metrics.

**Query parameters:**
- `country` (optional): Filter by country (senegal, egypt, etc.)
- `period` (optional): Time period (7d, 30d, 90d) — default 30d

**Response:**
```json
{
  "total_users": 245,
  "total_users_7d_ago": 230,
  "new_users_24h": 3,
  "new_users_7d": 12,
  "new_users_30d": 25,
  "active_users_24h": 78,
  "active_users_7d": 125,
  "active_users_30d": 200,
  "returning_rate_percent": 72.3,
  "countries": [
    {
      "name": "senegal",
      "total_users": 150,
      "new_users_30d": 15,
      "active_users_24h": 45
    },
    {
      "name": "test",
      "total_users": 95,
      "new_users_30d": 10,
      "active_users_24h": 33
    }
  ]
}
```

#### GET /api/admin/metrics/transactions
Transaction and volume metrics.

**Query parameters:**
- `country` (optional): Filter by country
- `period` (optional): Time period (7d, 30d, 90d) — default 30d

**Response:**
```json
{
  "period": "30d",
  "total_transactions": 450,
  "total_value_usd": 2500000,
  "daily_average_transactions": 15,
  "daily_average_value_usd": 83333,
  "daily_transactions_24h": 12,
  "daily_value_usd_24h": 85000,
  "transaction_types": {
    "register": 125,
    "transfer": 200,
    "escrow_open": 80,
    "escrow_settle": 75,
    "succession": 10,
    "marketplace_list": 30
  },
  "fees_collected": {
    "dgi_usd": 100000,
    "ancfcc_usd": 25000,
    "platform_usd": 5000,
    "total_usd": 130000
  },
  "error_rate_percent": 0.2,
  "average_gas_gwei": 45
}
```

#### GET /api/admin/metrics/errors
Error and failure rates.

**Response:**
```json
{
  "total_errors_24h": 3,
  "error_rate_percent_24h": 0.2,
  "error_rate_percent_7d": 0.15,
  "recent_errors": [
    {
      "timestamp": "2026-04-15T09:45:00Z",
      "type": "RPC_TIMEOUT",
      "severity": "warning",
      "message": "RPC endpoint timeout after 30s",
      "count": 1,
      "affected_users": 5
    },
    {
      "timestamp": "2026-04-15T08:30:00Z",
      "type": "TX_REVERT",
      "severity": "error",
      "message": "Transaction reverted: Insufficient escrow balance",
      "count": 2,
      "affected_users": 2
    }
  ]
}
```

### Alerts

#### GET /api/admin/alerts
List active and recent alerts.

**Response:**
```json
{
  "active_alerts": [
    {
      "id": "alert-001",
      "type": "rpc_latency_high",
      "severity": "warning",
      "country": "senegal",
      "message": "RPC latency exceeded 500ms threshold",
      "threshold": 500,
      "current_value": 650,
      "created_at": "2026-04-15T10:00:00Z",
      "acknowledged": false,
      "acknowledgement_email": null
    }
  ],
  "recent_resolved_alerts": [
    {
      "id": "alert-000",
      "type": "blockchain_not_synced",
      "severity": "critical",
      "country": "senegal",
      "message": "Node fell behind syncing",
      "resolved_at": "2026-04-15T09:30:00Z",
      "duration_minutes": 45
    }
  ]
}
```

#### POST /api/admin/alerts/{alertId}/acknowledge
Acknowledge an alert (mark as handled).

**Body:**
```json
{
  "email": "ops@safeland.team",
  "notes": "Investigated RPC timeout, restarted node"
}
```

**Response:** 204 No Content

### Deployments

#### GET /api/admin/deployments
List all country deployments and their status.

**Response:**
```json
{
  "deployments": [
    {
      "country": "senegal",
      "blockchain": "polygon",
      "status": "active",
      "contracts": {
        "nft": "0x1234...",
        "registry": "0x5678...",
        "escrow": "0x9abc...",
        "fridda": "0xdef0...",
        "justice": "0x1357...",
        "timelock": "0x2468..."
      },
      "deployed_at": "2026-06-30T00:00:00Z",
      "last_update": "2026-04-15T10:30:00Z",
      "uptime_percent": 99.8
    }
  ]
}
```

### Settings

#### GET /api/admin/settings
Retrieve system settings and thresholds.

**Response:**
```json
{
  "alert_thresholds": {
    "rpc_latency_ms": 500,
    "error_rate_percent": 5,
    "memory_percent": 80,
    "block_lag_minutes": 15
  },
  "monitoring": {
    "enabled": true,
    "check_interval_seconds": 60,
    "alert_email_recipients": ["ops@safeland.team"]
  },
  "features": {
    "admin_dashboard": true,
    "auto_scaling": false,
    "backup_enabled": true
  }
}
```

#### PATCH /api/admin/settings
Update system settings (admin only).

**Body:**
```json
{
  "alert_thresholds": {
    "rpc_latency_ms": 750,
    "error_rate_percent": 3
  },
  "monitoring": {
    "alert_email_recipients": ["ops@safeland.team", "cto@safeland.team"]
  }
}
```

**Response:** 200 OK

## Database Schema

### admin_countries

```sql
CREATE TABLE admin_countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  blockchain VARCHAR(50) NOT NULL,
  blockchain_id INTEGER NOT NULL,
  rpc_url VARCHAR(500) NOT NULL,
  contract_nft VARCHAR(66),
  contract_registry VARCHAR(66),
  contract_escrow VARCHAR(66),
  contract_fridda VARCHAR(66),
  contract_justice VARCHAR(66),
  contract_timelock VARCHAR(66),
  deployed_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### admin_metrics

```sql
CREATE TABLE admin_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_key VARCHAR(100),
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id)
);

-- Examples:
-- metric_type='users', metric_key='total', value=245
-- metric_type='users', metric_key='new_24h', value=3
-- metric_type='transactions', metric_key='total', value=450
-- metric_type='transactions', metric_key='error_rate', value=0.2
```

### admin_alerts

```sql
CREATE TABLE admin_alerts (
  id VARCHAR(100) PRIMARY KEY,
  country_id INTEGER NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message VARCHAR(500) NOT NULL,
  threshold NUMERIC,
  current_value NUMERIC,
  status VARCHAR(20) DEFAULT 'active',
  acknowledged_at TIMESTAMP,
  acknowledged_by VARCHAR(200),
  resolved_at TIMESTAMP,
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id)
);
```

## Implementation Phases

### Phase 1: MVP (Apr 15 - May 15, 2026)

**Scope:**
- Monitoring endpoints (health, metrics, alerts)
- Read-only dashboard data
- TheGraph subgraph queries

**Deliverables:**
1. API skeleton + endpoint stubs
2. Database schema design
3. TheGraph integration (query wrapper)
4. Frontend components (HealthCard, MetricsChart, AlertPanel)

**Effort:** 100 hours (backend + frontend)

**Tasks:**
1. Design API endpoints (1 week)
2. Database schema and migrations (1 week)
3. TheGraph query integration (1 week)
4. Endpoint implementation (1 week)
5. Frontend components + wiring (2 weeks)

**Testing:**
- Jest tests for API endpoints (mock TheGraph)
- Mock data for dashboard preview
- E2E tests (Playwright) for dashboard navigation

### Phase 2: Production Features (May 15 - Jun 30, 2026)

**Enhancements:**
- Multi-country metrics aggregation
- Alert acknowledgement and escalation
- Admin settings management
- Metrics history (30/90 day trends)

**Effort:** 60 hours

### Phase 3: Analytics (Jul 1 - Sep 30, 2026)

**Features:**
- Custom report generation
- User analytics (cohort analysis)
- Transaction analytics (fee breakdown, contract usage)
- Performance trends and predictions

**Effort:** 100 hours

## Technology Stack

- **Backend API:** Express.js (existing, port 3001)
- **New Port:** 3002 for admin API (separate to isolate permissions)
- **Database:** SQLite (admin-specific, separate from main app)
- **Graphs/Charts:** Recharts (frontend)
- **TheGraph Integration:** GraphQL queries via Apollo Client
- **Authentication:** JWT (existing mechanism, admin-only role)
- **Testing:** Jest + supertest

## Frontend Integration

Admin dashboard consumed by `frontend/src/app/admin/` pages:
- `dashboard.tsx` — Overview (health, top metrics)
- `metrics.tsx` — Detailed user/transaction metrics
- `alerts.tsx` — Alert management
- `deployments.tsx` — Country deployments status
- `settings.tsx` — Admin settings (superadmin only)

## Security

- **Authentication:** JWT token required (admin role only)
- **Authorization:** Role-based (admin vs. superadmin)
- **Rate limiting:** 100 req/min per IP (monitoring endpoint)
- **Data:** No PII in metrics (aggregated only)
- **Audit:** All alert acknowledgements logged with user/timestamp

## Deployment

### Local Development
```bash
# Terminal 1
npm run node  # Hardhat node

# Terminal 2
npm run dev:backend  # Backend with admin API on port 3002

# Terminal 3
npm run dev:frontend  # Frontend
```

### Docker
```bash
docker-compose -f docker-compose.admin.yml up
```

Includes:
- Backend + Admin API (port 3002)
- Frontend (port 3003)
- SQLite database (volume-mounted)

## Known Limitations (MVP)

1. **No authentication UI** — API endpoints assume JWT token in header
2. **Hardcoded metrics** — Real data aggregation from TheGraph (Phase 2)
3. **No email alerts** — Manual acknowledgement only
4. **Single admin user** — No role-based access control yet
5. **No custom dashboards** — Fixed layout (Phase 3)

## Future Enhancements

1. **Real-time alerting** (Phase 2)
   - WebSocket notifications
   - Email escalation
   - Slack/SMS integration

2. **Predictive analytics** (Phase 3)
   - Forecasting user growth
   - Anomaly detection
   - Performance prediction

3. **Automated remediation** (Phase 4)
   - Auto-restart RPC node on timeout
   - Auto-scale backend on high load
   - Contract pause/resume on critical errors

4. **Multi-tenancy** (Phase 4+)
   - Per-country admin dashboards
   - Custom metrics per country
   - White-label support

## Support

For questions or issues:
- Create GitHub issue: `#admin-api-bug` or `#admin-api-feature`
- Contact Frontend lead (admin@safeland.team)
- See docs/QUICK-WINS-Q2-2026.md for timeline and ownership
