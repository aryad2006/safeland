# SafeLand Fork Generator

## Overview

Automated deployment of SafeLand to new countries. Takes country configuration (JSON), generates customized fork with parameter injection and documentation.

## Architecture

```
Input: country.json
  ↓
Validate schema (JsonSchema)
  ↓
Generate .env files (parameter injection)
  ↓
Copy contract templates (inject country-specific values)
  ↓
Generate deployment docs
  ↓
Output: [Country] fork ready for testing/deployment
```

## Country Configuration Schema

JSON schema defining country-specific parameters for SafeLand deployment:

```json
{
  "name": "senegal",
  "blockchain": "polygon",
  "blockchainId": 137,
  "rpc_url": "https://polygon-rpc.com",
  "currency": "CFA",
  "language": "fr",
  "inheritance_school": "hanafi",
  "fiscal_rules": {
    "dgi_percent": 4,
    "ancfcc_percent": 1,
    "platform_fee_bps": 10
  },
  "regions": ["dakar", "kaolack", "tambacounda", "kolda"],
  "modules": {
    "escrow": true,
    "succession": true,
    "marketplace": true,
    "justice": true,
    "timelock": true
  },
  "contacts": {
    "land_registry": "ANCFCC Dakar",
    "support_email": "support@safeland-senegal.com",
    "support_phone": "+221 33 123 45 67"
  }
}
```

### Schema Validation Rules

- `name`: Required, lowercase, no spaces, unique per deployment
- `blockchain`: Required, one of: "polygon", "ethereum", "arbitrum", "optimism"
- `blockchainId`: Required, integer (137 = Polygon, 1 = Ethereum, etc.)
- `rpc_url`: Required, valid HTTPS URL
- `currency`: Required, 3-letter code (CFA, USD, etc.)
- `inheritance_school`: One of: "hanafi", "maliki", "shafii", "hanbali", "custom"
- `fiscal_rules`: Required
  - `dgi_percent`: 0-10, percentage
  - `ancfcc_percent`: 0-5, percentage
  - `platform_fee_bps`: 1-100, basis points (0.01% - 1%)
- `regions`: Array of region names (minimum 1)
- `modules`: Object with boolean flags for enabled features

## Usage

### CLI Interface

```bash
# Generate fork from JSON config
npm run generate -- --config countries/senegal.json --output ../safeland-senegal

# Validate config without generating
npm run generate -- --config countries/egypt.json --validate-only

# List all available country configs
npm run generate -- --list-configs

# Show schema for reference
npm run generate -- --show-schema
```

### Output Structure

Generated fork includes:

```
safeland-senegal/
├── .env.local                    # Injected blockchain RPC, fee params, contacts
├── contracts/
│   ├── SafeLandNFT.sol          # Same as source
│   ├── SafeLandEscrow.sol       # DGI/ANCFCC params injected
│   ├── SafeLandRegistry.sol     # Region list injected
│   ├── SafeLandFridda.sol       # Inheritance school injected
│   ├── SafeLandJustice.sol      # Same
│   └── SafeLandTimelock.sol     # Same
├── backend/
│   ├── .env.local               # API endpoints, support contacts
│   ├── config/blockchain.js     # RPC URL injected
│   └── src/                      # Copy of source backend
├── frontend/
│   ├── .env.local               # Contract addresses (post-deploy)
│   └── src/i18n/                # Language locale injected
├── hardhat.config.js            # Network config injected
├── docker-compose.yml           # Service configs
└── DEPLOYMENT-GUIDE.md          # Country-specific deployment steps
```

## Implementation Phases

### Phase 1: MVP (Apr 15 - May 15, 2026)

**Deliverables:**
- JSON schema design + validation
- Parameter injection for .env files
- Contract template system (no complex templating)
- Test on 2 hypothetical countries
- Basic documentation

**Tasks:**
1. Design country.json schema (1 week)
2. Implement schema validation (1 week)
3. Build .env injection logic (1 week)
4. Test on Egypt + Kenya configs (1 week)
5. Write "Generating a fork" guide (1 week)

**Success Metric:**
- Generate fork from JSON config in <4 hours
- Schema validation working (20+ test cases)
- Documentation complete

### Phase 2: Optimization (May 15 - Jul 31, 2026)

**Enhancements:**
- Solidity contract parameter injection (inheritance_school, fiscal rules)
- Docker-compose multi-service setup
- Deployment automation (contract deploy scripts)
- Environment variable templating (EJS for complex rules)

**Test on:**
- Sénégal fork (production-like scenario)
- Bénin fork (alternate inheritance school)

### Phase 3: Maturity (Aug 1 - Dec 31, 2026)

**Features:**
- Interactive CLI (guided wizard for country config)
- Subgraph generator (TheGraph deployment per country)
- CI/CD integration (GitHub Actions for fork validation)
- Multi-sig setup automation (timelock + governance)

**Support:**
- Egypt, Kenya, Ivory Coast forks
- Automated testing per fork
- Rollback procedures

## Configuration Examples

### Senegal (MVP Target)

```json
{
  "name": "senegal",
  "blockchain": "polygon",
  "blockchainId": 137,
  "rpc_url": "https://polygon-rpc.com",
  "currency": "CFA",
  "language": "fr",
  "inheritance_school": "hanafi",
  "fiscal_rules": {
    "dgi_percent": 4,
    "ancfcc_percent": 1,
    "platform_fee_bps": 10
  },
  "regions": ["dakar", "kaolack", "tambacounda"],
  "modules": {
    "escrow": true,
    "succession": true,
    "marketplace": false,
    "justice": true,
    "timelock": true
  },
  "contacts": {
    "land_registry": "ANCFCC Dakar",
    "support_email": "support@safeland-senegal.com",
    "support_phone": "+221 33 123 45 67"
  }
}
```

### Egypt (Future, Shafii Inheritance School)

```json
{
  "name": "egypt",
  "blockchain": "polygon",
  "blockchainId": 137,
  "rpc_url": "https://polygon-rpc.com",
  "currency": "EGP",
  "language": "ar",
  "inheritance_school": "shafii",
  "fiscal_rules": {
    "dgi_percent": 5,
    "ancfcc_percent": 0,
    "platform_fee_bps": 15
  },
  "regions": ["cairo", "alexandria", "giza"],
  "modules": {
    "escrow": true,
    "succession": true,
    "marketplace": true,
    "justice": false,
    "timelock": true
  },
  "contacts": {
    "land_registry": "Egyptian Ministry of Housing",
    "support_email": "support@safeland-egypt.com",
    "support_phone": "+20 100 123 4567"
  }
}
```

## Directory Structure

```
backend/src/generator/
├── README.md                 # This file
├── schema.json              # JSON schema for validation
├── validator.js             # Schema validation logic
├── generator.js             # Main generator (coordinate all steps)
├── steps/
│   ├── validate.js          # Input validation
│   ├── env-generator.js     # .env file generation
│   ├── contract-copy.js     # Copy + parameter inject contracts
│   ├── doc-generator.js     # Generate deployment guide
│   └── test-generator.js    # Generate test configs
├── templates/               # Template files (not yet complex EJS)
│   ├── .env.example
│   ├── docker-compose.example.yml
│   └── DEPLOYMENT-GUIDE.md.template
└── __tests__/              # Jest tests
    ├── schema.test.js
    ├── generator.test.js
    └── fixtures/
        ├── senegal.json
        ├── egypt.json
        └── kenya.json
```

## Testing Strategy

### Unit Tests
- Schema validation (valid/invalid configs)
- Parameter injection (edge cases, special chars)
- File generation (output structure)

### Integration Tests
- Full fork generation for 2 countries
- Output verification (file structure, content)
- Deployment readiness (can deploy to testnet)

### Manual Tests
- Generate Sénégal fork
- Deploy to Polygon testnet
- Test all workflows (register property, transfer, escrow, succession)

## Known Limitations (MVP)

1. **No Solidity templating yet** — Contract parameters injected via .env, not code changes
2. **No interactive wizard** — Config must be valid JSON; no guided CLI yet
3. **No subgraph generation** — TheGraph configs must be manually copied per country
4. **No multi-sig setup** — Timelock/governance addresses hardcoded (manual setup post-deploy)
5. **Limited localization** — Only French/English/Arabic hardcoded; no i18n generation

## Future Enhancements

1. **Solidity contract templating** (Phase 2)
   - Inject inheritance school logic into SafeLandFridda.sol
   - Inject fiscal rules into SafeLandEscrow.sol
   - Use conditional compilation or parameter constants

2. **Interactive CLI** (Phase 3)
   - Guided wizard for country configuration
   - Validation and suggestions as user types
   - Preview before generation

3. **Subgraph generator** (Phase 3)
   - Auto-generate subgraph.yaml per country
   - Deploy to The Graph hosted service
   - Index country-specific contracts

4. **CI/CD integration** (Phase 3)
   - GitHub Actions for fork validation
   - Automated testnet deployment
   - Test suite per fork (Playwright E2E)

5. **Documentation auto-generation** (Phase 3)
   - Deployment guide per country
   - User manual (translated)
   - API reference (if different per country)

## Support

For questions or issues:
- Create GitHub issue: `#generator-bug` or `#generator-feature`
- Contact Backend lead (generator@safeland.team)
- See docs/QUICK-WINS-Q2-2026.md for timeline and ownership
