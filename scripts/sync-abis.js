#!/usr/bin/env node
/**
 * scripts/sync-abis.js
 *
 * Synchronise les ABIs depuis les artifacts Hardhat compilés vers :
 *   - subgraph/abis/<Contract>.json       (tableau ABI brut)
 *   - frontend/src/contracts/<Contract>.json  (garde address + abi)
 *
 * À exécuter après chaque compilation Hardhat si des contrats ont changé.
 *
 * Usage :
 *   node scripts/sync-abis.js
 *   npm run sync-abis       (si ajouté dans package.json)
 */

const fs   = require("fs");
const path = require("path");

const ROOT      = path.resolve(__dirname, "..");
const ARTIFACTS = path.join(ROOT, "artifacts", "contracts");
const SUBGRAPH  = path.join(ROOT, "subgraph", "abis");
const FRONTEND  = path.join(ROOT, "frontend", "src", "contracts");

const CONTRACTS = [
  "SafeLandNFT",
  "SafeLandRegistry",
  "SafeLandEscrow",
  "SafeLandFridda",
  "SafeLandJustice",
  "SafeLandTimelock",
];

let changed = 0;
let unchanged = 0;
let errors = 0;

console.log("🔄 SafeLand — Sync ABIs (artifacts → subgraph + frontend)\n");

for (const name of CONTRACTS) {
  const artifactPath = path.join(ARTIFACTS, `${name}.sol`, `${name}.json`);

  if (!fs.existsSync(artifactPath)) {
    console.error(`  ❌ ${name}: artifact introuvable. Lancez 'npx hardhat compile' d'abord.`);
    errors++;
    continue;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // ── Subgraph ─────────────────────────────────────────────
  const sgPath = path.join(SUBGRAPH, `${name}.json`);
  const sgOld  = fs.existsSync(sgPath)
    ? JSON.parse(fs.readFileSync(sgPath, "utf8"))
    : null;

  const sgContent = JSON.stringify(abi, null, 2);
  if (!sgOld || JSON.stringify(sgOld) !== sgContent) {
    fs.writeFileSync(sgPath, sgContent, { encoding: "utf8" });
    const delta = sgOld
      ? `${sgOld.length} → ${abi.length} entrées`
      : `${abi.length} entrées (nouveau)`;
    console.log(`  ✅ ${name} subgraph : ${delta}`);
    changed++;
  } else {
    unchanged++;
  }

  // ── Frontend ─────────────────────────────────────────────
  const fePath = path.join(FRONTEND, `${name}.json`);
  if (fs.existsSync(fePath)) {
    const feData = JSON.parse(fs.readFileSync(fePath, "utf8"));
    const oldAbiStr = JSON.stringify(feData.abi || []);
    if (oldAbiStr !== JSON.stringify(abi)) {
      feData.abi = abi;
      fs.writeFileSync(fePath, JSON.stringify(feData, null, 2), { encoding: "utf8" });
      console.log(`  ✅ ${name} frontend : ABI mise à jour`);
    }
  }
}

console.log(`\n${changed > 0 ? "✅" : "✔️"} Done — ${changed} changed, ${unchanged} unchanged${errors > 0 ? `, ${errors} errors` : ""}`);

if (changed > 0) {
  console.log("\n💡 Pensez à relancer :");
  console.log("   cd subgraph && npm run codegen && npm run build");
}

if (errors > 0) process.exit(1);
