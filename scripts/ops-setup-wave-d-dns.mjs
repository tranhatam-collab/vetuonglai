#!/usr/bin/env node

/**
 * ops-setup-wave-d-dns.mjs
 * 
 * Create DNS records for Wave D subdomains on the new Cloudflare zone.
 * 
 * Usage:
 *   node scripts/ops-setup-wave-d-dns.mjs --dry-run     # show what would be created
 *   node scripts/ops-setup-wave-d-dns.mjs               # create DNS records
 * 
 * Requires: CLOUDFLARE_API_TOKEN env var
 * Owner: Team 1 / Ops
 */

const ACCOUNT_ID = "62d57eaa548617aeecac766e5a1cb98e";
const ZONE_ID = "34862e35921b6643995f18b38b1808bd";

const WAVE_D_HOSTS = [
  { name: "work",      full: "work.vetuonglai.com" },
  { name: "market",    full: "market.vetuonglai.com" },
  { name: "community", full: "community.vetuonglai.com" },
  { name: "ai",        full: "ai.vetuonglai.com" },
  { name: "business",  full: "business.vetuonglai.com" },
];

// Pages direct serving uses CNAME to *.pages.dev or A/AAAA proxied records
// For Cloudflare Pages custom domains, we create proxied CNAME to the pages project
const PAGES_PROJECTS = {
  work: "vetuonglai-work.pages.dev",
  market: "vetuonglai-market.pages.dev",
  community: "vetuonglai-community.pages.dev",
  ai: "vetuonglai-ai.pages.dev",
  business: "vetuonglai-business.pages.dev",
};

const dryRun = process.argv.includes("--dry-run");

async function cfApi(endpoint, method = "GET", body = null) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN required");

  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  const opts = {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  return res.json();
}

async function listDnsRecords() {
  const data = await cfApi(`/zones/${ZONE_ID}/dns_records?per_page=200`);
  if (!data.success) throw new Error(`Cannot list DNS records: ${JSON.stringify(data.errors)}`);
  return data.result || [];
}

async function createCnameRecord(name, target) {
  if (dryRun) {
    console.log(`  [DRY-RUN] Would create CNAME: ${name}.vetuonglai.com -> ${target} (proxied)`);
    return { ok: true, dryRun: true };
  }

  const data = await cfApi(`/zones/${ZONE_ID}/dns_records`, "POST", {
    type: "CNAME",
    name: name,
    content: target,
    proxied: true,
    ttl: 1, // auto
  });

  if (!data.success) {
    // Check if record already exists
    const errors = data.errors || [];
    const alreadyExists = errors.some((e) =>
      e.message?.includes("already exists") || e.code === 81057
    );
    if (alreadyExists) {
      console.log(`  EXISTS: ${name}.vetuonglai.com (already has DNS record)`);
      return { ok: true, exists: true };
    }
    console.error(`  FAIL: ${name}.vetuonglai.com:`, errors);
    return { ok: false, errors };
  }

  console.log(`  OK: ${name}.vetuonglai.com -> ${target} (proxied)`);
  return { ok: true };
}

async function main() {
  console.log("=== Wave D DNS Setup ===");
  console.log(`Zone: ${ZONE_ID}`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE"}`);
  console.log();

  // Check current DNS records
  console.log("--- Current DNS records for Wave D hosts ---");
  const existing = await listDnsRecords();
  const waveDExisting = new Set();

  for (const host of WAVE_D_HOSTS) {
    const records = existing.filter((r) => r.name === host.full);
    if (records.length > 0) {
      for (const r of records) {
        console.log(`  ${r.name}: ${r.type} -> ${r.content} (proxied: ${r.proxied})`);
      }
      waveDExisting.add(host.name);
    } else {
      console.log(`  ${host.full}: NO RECORD`);
    }
  }

  // Also create www. variants
  for (const host of WAVE_D_HOSTS) {
    const wwwRecords = existing.filter((r) => r.name === `www.${host.full}`);
    if (wwwRecords.length > 0) {
      for (const r of wwwRecords) {
        console.log(`  ${r.name}: ${r.type} -> ${r.content}`);
      }
    }
  }

  console.log("\n--- Creating DNS records ---");
  const results = [];

  for (const host of WAVE_D_HOSTS) {
    const target = PAGES_PROJECTS[host.name];
    console.log(`\n[${host.name}]`);

    // Main record
    const mainResult = await createCnameRecord(host.name, target);
    results.push({ host: host.name, type: "main", ...mainResult });

    // www variant
    const wwwResult = await createCnameRecord(`www.${host.name}`, target);
    results.push({ host: `www.${host.name}`, type: "www", ...wwwResult });
  }

  // Summary
  console.log("\n--- Summary ---");
  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`Total: ${results.length} | OK: ${ok} | Failed: ${fail}`);

  if (fail > 0) {
    process.exitCode = 1;
  }

  console.log("\nNext steps after DNS records created:");
  console.log("  1. Wait for DNS propagation (usually 1-5 minutes with Cloudflare proxy)");
  console.log("  2. Run: node scripts/ops-verify-zone-activation.mjs");
  console.log("  3. Run: node scripts/deploy-wave-d-pages.mjs --branch main");
  console.log("  4. Run: node scripts/verify-wave-d-public-publish.mjs");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
