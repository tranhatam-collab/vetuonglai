#!/usr/bin/env node

/**
 * ops-inject-secrets.mjs
 * 
 * Inject required secrets into Cloudflare workers on the new account.
 * 
 * Usage:
 *   node scripts/ops-inject-secrets.mjs --dry-run          # show what would be injected
 *   node scripts/ops-inject-secrets.mjs                     # inject secrets interactively
 *   node scripts/ops-inject-secrets.mjs --env-file .env.secrets  # read from env file
 * 
 * Requires:
 *   - CLOUDFLARE_API_TOKEN env var (or wrangler login)
 *   - Secret values provided via stdin, env file, or env vars
 * 
 * Owner: Team 1 / Ops
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ACCOUNT_ID = "62d57eaa548617aeecac766e5a1cb98e";

const WORKER_SECRETS = {
  "vetuonglai-home": [
    "SESSION_COOKIE_SECRET",
    "MAGIC_LINK_SIGNING_KEY",
    "PAY_IAI_ONE_API_KEY",
    "PAY_IAI_ONE_WEBHOOK_SECRET",
  ],
  "vetuonglai-member": [
    "SESSION_COOKIE_SECRET",
    "MAGIC_LINK_SIGNING_KEY",
    "PAY_IAI_ONE_API_KEY",
    "PAY_IAI_ONE_WEBHOOK_SECRET",
  ],
  "vetuonglai-vc": [
    "SESSION_COOKIE_SECRET",
    "VC_IDENTITY_ATTESTATION_SECRET",
    "VC_OWNERSHIP_CHALLENGE_SECRET",
  ],
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    if (argv[i] === "--env-file" && argv[i + 1]) args.envFile = argv[++i];
    if (argv[i] === "--worker" && argv[i + 1]) args.worker = argv[++i];
  }
  return args;
}

async function loadEnvFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

async function promptSecret(secretName) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(`  Enter value for ${secretName}: `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function putSecretViaApi(workerName, secretName, secretValue, { dryRun }) {
  if (dryRun) {
    console.log(`  [DRY-RUN] Would inject ${secretName} into ${workerName}`);
    return { ok: true, dryRun: true };
  }

  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    throw new Error("CLOUDFLARE_API_TOKEN env var required for secret injection");
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${workerName}/secrets`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: secretName,
      text: secretValue,
      type: "secret_text",
    }),
  });

  const data = await response.json();

  if (!data.success) {
    console.error(`  FAIL: ${secretName} on ${workerName}:`, data.errors);
    return { ok: false, errors: data.errors };
  }

  console.log(`  OK: ${secretName} injected into ${workerName}`);
  return { ok: true };
}

async function listSecrets(workerName) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) return [];

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${workerName}/secrets`;

  try {
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await response.json();
    if (!data.success) return [];
    return (data.result || []).map((s) => s.name);
  } catch {
    return [];
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log("=== Ops: Cloudflare Worker Secret Injection ===");
  console.log(`Account: ${ACCOUNT_ID}`);
  console.log(`Mode: ${args.dryRun ? "DRY-RUN" : "LIVE"}`);
  console.log();

  // Load secret values from env file or env vars
  let secretSource = {};
  if (args.envFile) {
    console.log(`Loading secrets from: ${args.envFile}`);
    secretSource = await loadEnvFile(args.envFile);
  }

  // Filter to specific worker if requested
  const workers = args.worker
    ? { [args.worker]: WORKER_SECRETS[args.worker] }
    : WORKER_SECRETS;

  if (args.worker && !WORKER_SECRETS[args.worker]) {
    console.error(`Unknown worker: ${args.worker}`);
    console.error(`Valid workers: ${Object.keys(WORKER_SECRETS).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  // Collect unique secrets needed
  const allSecretsNeeded = new Set();
  for (const secrets of Object.values(workers)) {
    for (const s of secrets) allSecretsNeeded.add(s);
  }

  // Check current state
  console.log("--- Current secret state ---");
  for (const [workerName, secrets] of Object.entries(workers)) {
    const existing = await listSecrets(workerName);
    const missing = secrets.filter((s) => !existing.includes(s));
    if (missing.length === 0) {
      console.log(`${workerName}: ALL SECRETS PRESENT`);
    } else {
      console.log(`${workerName}: MISSING ${missing.length}/${secrets.length} — ${missing.join(", ")}`);
    }
  }
  console.log();

  // Resolve values
  const resolvedValues = {};
  for (const secretName of allSecretsNeeded) {
    const value = secretSource[secretName] || process.env[secretName];
    if (value) {
      resolvedValues[secretName] = value;
    } else if (!args.dryRun) {
      console.log(`Secret ${secretName} not found in env file or env vars.`);
      resolvedValues[secretName] = await promptSecret(secretName);
      if (!resolvedValues[secretName]) {
        console.error(`  SKIPPED: ${secretName} (empty value)`);
      }
    }
  }

  // Inject
  console.log("--- Injecting secrets ---");
  const results = [];

  for (const [workerName, secrets] of Object.entries(workers)) {
    console.log(`\n[${workerName}]`);
    for (const secretName of secrets) {
      const value = resolvedValues[secretName];
      if (!value && !args.dryRun) {
        console.log(`  SKIP: ${secretName} (no value provided)`);
        results.push({ worker: workerName, secret: secretName, ok: false, reason: "no_value" });
        continue;
      }
      const result = await putSecretViaApi(workerName, secretName, value || "DRY_RUN_PLACEHOLDER", args);
      results.push({ worker: workerName, secret: secretName, ...result });
    }
  }

  // Summary
  console.log("\n--- Summary ---");
  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`Total: ${results.length} | OK: ${ok} | Failed: ${fail}`);

  if (fail > 0) {
    console.log("\nFailed injections:");
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ${r.worker}/${r.secret}: ${r.reason || "api_error"}`);
    }
    process.exitCode = 1;
  }

  console.log("\nNext steps after all secrets injected:");
  console.log("  1. Run: node scripts/ops-verify-zone-activation.mjs");
  console.log("  2. Run: node scripts/deploy-workers.mjs --strict-secrets");
  console.log("  3. Run: node scripts/smoke-access-runtime.mjs");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
