#!/usr/bin/env node

/**
 * rollback-wave-d.mjs
 * 
 * Rollback Wave D deployment by reverting runtime-truth status
 * and optionally deleting Pages deployments.
 * 
 * Usage:
 *   node scripts/rollback-wave-d.mjs --dry-run         # show what would be rolled back
 *   node scripts/rollback-wave-d.mjs                    # execute rollback
 *   node scripts/rollback-wave-d.mjs --domain work      # rollback single domain
 * 
 * Owner: Team 1
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ACCOUNT_ID = "62d57eaa548617aeecac766e5a1cb98e";
const WAVE_D_DOMAINS = ["work", "market", "community", "ai", "business"];
const RUNTIME_TRUTH_PATH = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    if (argv[i] === "--domain" && argv[i + 1]) args.domain = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetDomains = args.domain ? [args.domain] : WAVE_D_DOMAINS;

  // Validate domain
  for (const d of targetDomains) {
    if (!WAVE_D_DOMAINS.includes(d)) {
      console.error(`Invalid domain: ${d}. Valid: ${WAVE_D_DOMAINS.join(", ")}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log("=== Wave D Rollback ===");
  console.log(`Mode: ${args.dryRun ? "DRY-RUN" : "LIVE"}`);
  console.log(`Domains: ${targetDomains.join(", ")}`);
  console.log();

  // Step 1: Revert runtime-truth
  console.log("--- Step 1: Revert runtime-truth ---");
  const truthRaw = await readFile(RUNTIME_TRUTH_PATH, "utf8");
  const truth = JSON.parse(truthRaw);

  let changed = 0;
  for (const domain of truth.domains) {
    const key = domain.host.replace(".vetuonglai.com", "");
    if (!targetDomains.includes(key)) continue;

    const prevStatus = domain.status;
    if (prevStatus === "live" || prevStatus === "deploying") {
      domain.status = "planned_public";
      domain.requiredPublic = false;
      domain.rolledBackAt = new Date().toISOString();
      domain.rolledBackFrom = prevStatus;
      console.log(`  ${domain.host}: ${prevStatus} -> planned_public`);
      changed++;
    } else {
      console.log(`  ${domain.host}: already ${prevStatus} (no change)`);
    }
  }

  if (changed > 0 && !args.dryRun) {
    truth.lastUpdated = new Date().toISOString().slice(0, 10);
    await writeFile(RUNTIME_TRUTH_PATH, JSON.stringify(truth, null, 2) + "\n", "utf8");
    console.log(`  Written: ${RUNTIME_TRUTH_PATH}`);
  } else if (args.dryRun) {
    console.log(`  [DRY-RUN] Would revert ${changed} domains`);
  }

  // Step 2: Delete Pages deployments (optional, requires API token)
  console.log("\n--- Step 2: Pages deployment rollback ---");
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!token) {
    console.log("  SKIP: No CLOUDFLARE_API_TOKEN — Pages deployments not touched.");
    console.log("  To also rollback Pages, set CLOUDFLARE_API_TOKEN and rerun.");
  } else {
    for (const domain of targetDomains) {
      const projectName = `vetuonglai-${domain}`;
      console.log(`  ${projectName}: checking deployments...`);

      if (args.dryRun) {
        console.log(`  [DRY-RUN] Would check/rollback ${projectName}`);
        continue;
      }

      try {
        const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${projectName}/deployments?sort_by=created_on&sort_order=desc&per_page=2`;
        const res = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.success || !data.result?.length) {
          console.log(`  ${projectName}: no deployments found`);
          continue;
        }

        const latest = data.result[0];
        console.log(`  ${projectName}: latest deployment ${latest.id} (${latest.environment})`);
        console.log(`  To manually rollback: delete this deployment or redeploy previous version`);
      } catch (err) {
        console.log(`  ${projectName}: error checking — ${err.message}`);
      }
    }
  }

  // Step 3: Notify
  console.log("\n--- Step 3: Post-rollback actions ---");
  console.log("  1. Run: npm run build && npm run check");
  console.log("  2. Run: npm run verify:planned-safe:wave:release");
  console.log("  3. Notify Team 3 + Team 5 via channel vtl-team1-runtime-release");
  console.log("  4. Team 3 updates go/no-go report");

  // Summary
  console.log(`\n=== Rollback ${args.dryRun ? "(DRY-RUN) " : ""}complete ===`);
  console.log(`Domains reverted: ${changed}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
