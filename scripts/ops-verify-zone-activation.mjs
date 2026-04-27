#!/usr/bin/env node

/**
 * ops-verify-zone-activation.mjs
 * 
 * Verify Cloudflare zone activation status for the new account.
 * Also checks nameserver delegation and DNS propagation for all domains.
 * 
 * Usage:
 *   node scripts/ops-verify-zone-activation.mjs
 *   node scripts/ops-verify-zone-activation.mjs --verbose
 * 
 * Requires: CLOUDFLARE_API_TOKEN env var
 * Owner: Team 1 / Ops
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ACCOUNT_ID = "62d57eaa548617aeecac766e5a1cb98e";
const ZONE_ID = "34862e35921b6643995f18b38b1808bd";
const EXPECTED_NS = ["barbara.ns.cloudflare.com", "patrick.ns.cloudflare.com"];
const OLD_NS = ["davina.ns.cloudflare.com", "justin.ns.cloudflare.com"];

const verbose = process.argv.includes("--verbose");

async function cfApi(endpoint) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN required");

  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return res.json();
}

async function checkZoneStatus() {
  console.log("=== Zone Activation Check ===");
  console.log(`Zone ID: ${ZONE_ID}`);
  console.log(`Account: ${ACCOUNT_ID}`);
  console.log();

  const data = await cfApi(`/zones/${ZONE_ID}`);

  if (!data.success) {
    console.error("FAIL: Cannot fetch zone info:", data.errors);
    return { ok: false, status: "api_error" };
  }

  const zone = data.result;
  console.log(`Zone name: ${zone.name}`);
  console.log(`Status: ${zone.status}`);
  console.log(`Nameservers assigned: ${zone.name_servers?.join(", ") || "none"}`);
  console.log(`Paused: ${zone.paused}`);
  console.log(`Type: ${zone.type}`);
  console.log();

  const isActive = zone.status === "active";
  const isPending = zone.status === "pending";

  if (isActive) {
    console.log("PASS: Zone is ACTIVE on new account.");
  } else if (isPending) {
    console.log("BLOCKED: Zone is still PENDING.");
    console.log("Action required: Update nameservers at domain registrar to:");
    for (const ns of EXPECTED_NS) {
      console.log(`  ${ns}`);
    }
    console.log();
    console.log("Current old nameservers to replace:");
    for (const ns of OLD_NS) {
      console.log(`  ${ns}`);
    }
  } else {
    console.log(`UNKNOWN: Zone status is "${zone.status}"`);
  }

  return { ok: isActive, status: zone.status, nameservers: zone.name_servers };
}

async function checkDnsResolution() {
  console.log("\n=== DNS Resolution Check ===");

  const truthRaw = await readFile(
    path.join(ROOT, "cloudflare", "domain-runtime-truth.json"),
    "utf8"
  );
  const truth = JSON.parse(truthRaw);

  const results = [];

  for (const domain of truth.domains) {
    const host = domain.host;
    try {
      const res = await fetch(`https://${host}/`, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      const ok = res.status >= 200 && res.status < 400;
      console.log(`${ok ? "OK" : "WARN"}: ${host} -> HTTP ${res.status}`);
      results.push({ host, ok, status: res.status });
    } catch (err) {
      const msg = err?.cause?.code || err?.code || err.message || "fetch_failed";
      console.log(`FAIL: ${host} -> ${msg}`);
      results.push({ host, ok: false, status: 0, error: msg });
    }
  }

  return results;
}

async function checkWorkerRoutes() {
  console.log("\n=== Worker Routes on New Zone ===");

  const data = await cfApi(`/zones/${ZONE_ID}/workers/routes`);

  if (!data.success) {
    console.error("FAIL: Cannot fetch worker routes:", data.errors);
    return [];
  }

  const routes = data.result || [];
  if (routes.length === 0) {
    console.log("No worker routes configured on new zone.");
  } else {
    for (const route of routes) {
      console.log(`  ${route.pattern} -> ${route.script || "(no script)"}`);
    }
  }

  return routes;
}

async function checkWorkerSecrets() {
  console.log("\n=== Worker Secret Readiness ===");

  const configRaw = await readFile(
    path.join(ROOT, "cloudflare", "workers-projects.json"),
    "utf8"
  );
  const config = JSON.parse(configRaw);
  const results = [];

  for (const worker of config.workers) {
    if (!worker.accessRuntime?.requiredSecrets?.length) continue;

    const data = await cfApi(
      `/accounts/${ACCOUNT_ID}/workers/scripts/${worker.scriptName}/secrets`
    );

    const existing = data.success
      ? (data.result || []).map((s) => s.name)
      : [];

    const missing = worker.accessRuntime.requiredSecrets.filter(
      (s) => !existing.includes(s)
    );

    const ok = missing.length === 0;
    const label = ok ? "READY" : `MISSING ${missing.length}`;
    console.log(`${worker.scriptName}: ${label}${missing.length ? " — " + missing.join(", ") : ""}`);
    results.push({ worker: worker.scriptName, ok, missing });
  }

  return results;
}

async function main() {
  const zone = await checkZoneStatus();
  const dns = await checkDnsResolution();
  const routes = await checkWorkerRoutes();
  const secrets = await checkWorkerSecrets();

  // Summary
  console.log("\n=== SUMMARY ===");

  const dnsOk = dns.filter((d) => d.ok).length;
  const dnsFail = dns.filter((d) => !d.ok).length;
  const secretsOk = secrets.filter((s) => s.ok).length;
  const secretsFail = secrets.filter((s) => !s.ok).length;

  console.log(`Zone activation: ${zone.ok ? "ACTIVE" : zone.status?.toUpperCase()}`);
  console.log(`DNS resolution: ${dnsOk} OK / ${dnsFail} failed`);
  console.log(`Worker routes: ${routes.length} configured`);
  console.log(`Worker secrets: ${secretsOk} ready / ${secretsFail} missing`);

  const allGreen = zone.ok && dnsFail === 0 && secretsFail === 0;
  console.log(`\nOverall: ${allGreen ? "ALL GREEN — ready for cutover" : "BLOCKERS REMAIN"}`);

  if (!zone.ok) {
    console.log("\n[ACTION] Update nameservers at domain registrar:");
    console.log(`  Replace: ${OLD_NS.join(", ")}`);
    console.log(`  With:    ${EXPECTED_NS.join(", ")}`);
  }

  if (secretsFail > 0) {
    console.log("\n[ACTION] Inject missing secrets:");
    console.log("  node scripts/ops-inject-secrets.mjs");
  }

  if (dnsFail > 0) {
    console.log("\n[ACTION] DNS not resolving for:");
    for (const d of dns.filter((d) => !d.ok)) {
      console.log(`  ${d.host}: ${d.error || "unreachable"}`);
    }
  }

  process.exitCode = allGreen ? 0 : 1;
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
