# SafeLand Deployment Tooling

## Overview

Scripts and configuration for deploying SafeLand to multiple countries and managing production infrastructure.

## Components

### 1. generate-fork.js
Generate new country fork from JSON configuration.

```bash
npm run generate -- --config countries/senegal.json --output ../safeland-senegal
```

See `backend/src/generator/README.md` for detailed documentation.

### 2. deploy-contracts.js (Phase 1 Stub)
Deploy smart contracts to target blockchain.

**Usage:**
```bash
# Deploy to testnet (Polygon testnet)
NETWORK=polygon-testnet npm run deploy:testnet

# Deploy to mainnet (requires approval)
NETWORK=polygon npm run deploy:mainnet -- --fork senegal
```

**What it does:**
1. Compile contracts (Solidity 0.8.24)
2. Deploy with UUPS proxy pattern
3. Initialize contracts with country-specific parameters
4. Save deployed addresses to `deployed-addresses.json`
5. Update `.env.local` with contract addresses

**Phase 1 Implementation:**
- Use existing hardhat deploy infrastructure
- Add country parameter to deploy script
- Generate deployment report (addresses, gas used, etc.)

### 3. setup-monitoring.js (Phase 1 Stub)
Initialize monitoring and alerting infrastructure.

**Usage:**
```bash
npm run setup-monitoring -- --country senegal --alerts ops@safeland.team
```

**What it does:**
1. Create admin database entries (admin_countries table)
2. Configure TheGraph subgraph for country
3. Set up alert thresholds
4. Create initial dashboards

**Phase 1 Implementation:**
- Insert country record into admin_countries SQLite DB
- Store contract addresses + RPC URL
- Create sample alerts configuration

### 4. Docker Compose - Admin Stack (Phase 2)
Complete stack for running SaaS admin infrastructure.

**File:** `docker-compose.admin.yml`

**Services:**
- `admin-backend`: Node.js API (port 3002)
- `admin-frontend`: Next.js dashboard (port 3003)
- `admin-postgres`: PostgreSQL for admin metrics (port 5432)
- `redis`: Caching layer (port 6379)

**Usage:**
```bash
docker-compose -f docker-compose.admin.yml up -d
```

## CI/CD Integration

GitHub Actions workflows for automated deployment:

### 1. generate-fork.yml
Test fork generator on every commit.

```yaml
name: Test Fork Generator

on: [push, pull_request]

jobs:
  test-generator:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run generate -- --config backend/src/generator/fixtures/senegal.json --validate-only
      - run: npm test -- backend/src/generator/__tests__
```

### 2. deploy-testnet.yml (Phase 2)
Deploy to testnet on tag push.

```yaml
name: Deploy to Testnet

on:
  push:
    tags:
      - 'testnet-*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - env:
          NETWORK: polygon-testnet
          MNEMONIC: ${{ secrets.TESTNET_MNEMONIC }}
        run: npm run deploy:testnet
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: deployment-report
          path: deployment-report.json
```

### 3. deploy-mainnet.yml (Phase 3)
Production deployment (manual approval required).

```yaml
name: Deploy to Mainnet

on:
  workflow_dispatch:
    inputs:
      country:
        description: 'Country to deploy'
        required: true
        default: 'senegal'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - env:
          NETWORK: polygon-mainnet
          MNEMONIC: ${{ secrets.MAINNET_MNEMONIC }}
        run: npm run deploy:mainnet -- --fork ${{ github.event.inputs.country }}
      - name: Create release
        uses: actions/create-release@v1
        with:
          tag_name: mainnet-${{ github.event.inputs.country }}-${{ github.run_number }}
          body_path: deployment-report.md
```

## Deployment Process

### Phase 1: Manual (Apr-Jun 2026)

1. **Testnet Deployment**
   ```bash
   # Senegal testnet (Jun 2026)
   COUNTRY=senegal NETWORK=polygon-testnet npm run deploy:testnet
   ```

2. **UAT & Sign-off**
   - ANCFCC team tests on testnet
   - Verify data accuracy
   - Sign-off on deployment readiness

3. **Production Deployment**
   ```bash
   COUNTRY=senegal NETWORK=polygon npm run deploy:mainnet
   ```

### Phase 2+: Automated (Jul-Dec 2026)

1. **Push tag to GitHub**
   ```bash
   git tag mainnet-senegal-v1.0
   git push origin mainnet-senegal-v1.0
   ```

2. **GitHub Actions triggers deployment**
   - Runs all tests
   - Deploys to mainnet
   - Generates deployment report
   - Creates release notes

3. **Post-deployment verification**
   - Check contract addresses
   - Verify event logs
   - Monitor metrics dashboard

## Deployment Configuration

### Environment Variables

```bash
# Network selection
NETWORK=polygon              # or polygon-testnet, ethereum, etc.
BLOCKCHAIN_ID=137            # EVM chain ID

# Deployment signer (from mnemonic or private key)
MNEMONIC=word1 word2 ...     # or PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...        # for verification

# Country/fork parameters (from country.json)
COUNTRY_NAME=senegal
COUNTRY_BLOCKCHAIN=polygon
RPC_URL=https://polygon-rpc.com

# Feature flags
DEPLOY_WITH_PROXY=true       # UUPS proxy pattern
UPGRADE_EXISTING=false       # Update existing contracts
VERIFY_ON_EXPLORER=true      # Verify on Etherscan
```

### Deployment Report

After deployment, `deployment-report.json` includes:

```json
{
  "timestamp": "2026-06-30T00:00:00Z",
  "country": "senegal",
  "network": "polygon",
  "status": "success",
  "contracts": {
    "nft": {
      "address": "0x1234...",
      "proxy_address": "0x5678...",
      "implementation": "0x9abc...",
      "deployment_tx": "0xdef0...",
      "gas_used": 2500000,
      "deployment_cost_usd": 125
    },
    "registry": {...},
    "escrow": {...},
    "fridda": {...},
    "justice": {...},
    "timelock": {...}
  },
  "initialization": {
    "dgi_percent": 4,
    "ancfcc_percent": 1,
    "platform_fee_bps": 10,
    "regions": ["dakar", "kaolack", "tambacounda"]
  },
  "graph": {
    "subgraph_deployed": true,
    "subgraph_id": "Qm...",
    "indexing_status": "syncing"
  },
  "verification": {
    "all_contracts_verified": true,
    "etherscan_urls": [...]
  }
}
```

## Monitoring After Deployment

### Immediate (1-7 days)
- Monitor blockchain events via subgraph
- Check error rates in admin dashboard
- Verify transaction processing
- ANCFCC team validates data accuracy

### Ongoing (production operations)
- Daily health checks (RPC latency, block sync)
- Weekly metrics review (user count, transaction volume)
- Monthly security updates
- Quarterly performance analysis

## Disaster Recovery

### Contract Bug Found
1. Pause contract via emergency proxy (if available)
2. Propose fix via timelock (1-30 day delay)
3. Deploy fixed implementation
4. Execute upgrade via multisig

### RPC Node Down
1. Failover to backup RPC provider (configured in .env)
2. Verify sync status (should recover within 15 min)
3. Alert ops team if issue persists

### Data Corruption
1. Identify corrupted state (off-chain verification)
2. Create rollback proposal via governance
3. Execute rollback if approved by multisig
4. Redeploy contracts with previous state

## Known Limitations (Phase 1)

1. **Manual deployment only** — CI/CD not yet integrated
2. **Single network supported** — Polygon only (add others in Phase 2)
3. **No automated testing** — Testnet required before mainnet
4. **No rollback automation** — Manual intervention needed

## Future Enhancements

### Phase 2 (Jul-Sep 2026)
- [ ] Fully automated CI/CD
- [ ] Multi-network support (Ethereum, Arbitrum, Optimism)
- [ ] Automated contract upgrade path
- [ ] Blue-green deployment strategy

### Phase 3+ (Oct-Dec 2026)
- [ ] Canary deployments (10% rollout first)
- [ ] A/B testing infrastructure
- [ ] Performance monitoring integration
- [ ] Incident response automation

## Support & Escalation

**Deployment Issues:**
- Contact: DevOps lead (deploy@safeland.team)
- Slack: #deployment
- GitHub issues: `#deployment-bug` or `#deployment-feature`

**Production Incidents:**
- Escalate to: CTO (cto@safeland.team)
- Slack: #incidents
- On-call rotation: See runbook

## Related Documentation

- Generator architecture: `backend/src/generator/README.md`
- Admin API: `backend/src/admin/README.md`
- Deployment runbook: `docs/DEPLOYMENT-RUNBOOK.md` (Phase 5)
- Quick wins timeline: `docs/QUICK-WINS-Q2-2026.md`
