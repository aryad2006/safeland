#!/usr/bin/env node
/**
 * scripts/update-env.js
 *
 * Lit deployed-addresses.json et :
 *   1. Affiche les variables NEXT_PUBLIC_* prêtes à copier
 *   2. Si --write est passé, met à jour frontend/.env.local automatiquement
 *
 * Usage :
 *   node scripts/update-env.js            # affiche seulement
 *   node scripts/update-env.js --write    # écrit frontend/.env.local
 */

const fs   = require("fs");
const path = require("path");

const ROOT      = path.resolve(__dirname, "..");
const ADDRESSES = path.join(ROOT, "deployed-addresses.json");
const ENV_LOCAL = path.join(ROOT, "frontend", ".env.local");

// Correspondance contractName → NEXT_PUBLIC_ key
const CONTRACT_MAP = {
  SafeLandNFT:      "NEXT_PUBLIC_NFT_ADDRESS",
  SafeLandRegistry: "NEXT_PUBLIC_REGISTRY_ADDRESS",
  SafeLandEscrow:   "NEXT_PUBLIC_ESCROW_ADDRESS",
  SafeLandFridda:   "NEXT_PUBLIC_FRIDDA_ADDRESS",
  SafeLandJustice:  "NEXT_PUBLIC_JUSTICE_ADDRESS",
  SafeLandTimelock: "NEXT_PUBLIC_TIMELOCK_ADDRESS",
};

// ── Lire deployed-addresses.json ──────────────────────────────────
if (!fs.existsSync(ADDRESSES)) {
  console.error("❌ deployed-addresses.json introuvable. Déployez d'abord avec scripts/deploy.js");
  process.exit(1);
}

const addresses = JSON.parse(fs.readFileSync(ADDRESSES, "utf8"));

// ── Générer les lignes .env ───────────────────────────────────────
const lines = [];
const missing = [];

for (const [contract, envKey] of Object.entries(CONTRACT_MAP)) {
  const addr = addresses[contract];
  if (addr && addr.length === 42) {
    lines.push(`${envKey}=${addr}`);
  } else {
    missing.push(contract);
    lines.push(`# ${envKey}=  # ${contract} non déployé`);
  }
}

const content = [
  "# Généré automatiquement par scripts/update-env.js",
  `# Source : deployed-addresses.json — ${new Date().toISOString()}`,
  "",
  ...lines,
  "",
].join("\n");

// ── Affichage ─────────────────────────────────────────────────────
console.log("\n📋 Variables d'environnement générées :\n");
console.log(content);

if (missing.length) {
  console.warn(`⚠️  ${missing.length} contrat(s) non déployé(s) : ${missing.join(", ")}`);
}

// ── Écriture optionnelle ──────────────────────────────────────────
const shouldWrite = process.argv.includes("--write");

if (shouldWrite) {
  // Préserver les variables existantes qui ne sont pas dans CONTRACT_MAP
  let existing = {};
  if (fs.existsSync(ENV_LOCAL)) {
    const raw = fs.readFileSync(ENV_LOCAL, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !Object.values(CONTRACT_MAP).includes(m[1])) {
        existing[m[1]] = m[2];
      }
    }
  }

  const extraLines = Object.entries(existing).map(([k, v]) => `${k}=${v}`);
  const finalContent = content + (extraLines.length ? extraLines.join("\n") + "\n" : "");

  fs.writeFileSync(ENV_LOCAL, finalContent, { encoding: "utf8" });
  console.log(`✅ Écrit dans ${ENV_LOCAL}`);
} else {
  console.log("💡 Ajoutez --write pour mettre à jour frontend/.env.local automatiquement");
}
