#!/usr/bin/env node

/**
 * ops-test-payment-checkout.mjs
 * 
 * Test pay.iai.one checkout session creation with the rotated API key.
 * Verifies both annual-access and specialist-pack (g1) flows.
 * 
 * Usage:
 *   node scripts/ops-test-payment-checkout.mjs --dry-run        # validate config only
 *   node scripts/ops-test-payment-checkout.mjs                  # test live
 *   node scripts/ops-test-payment-checkout.mjs --api-key=KEY    # pass key via arg
 * 
 * Env vars:
 *   PAY_IAI_ONE_API_KEY      — rotated production API key
 *   PAY_IAI_ONE_BASE_URL     — defaults to https://pay.iai.one
 * 
 * Owner: Team 1 / Team Pay
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_BASE_URL = "https://pay.iai.one";

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    if (arg.startsWith("--api-key=")) args.apiKey = arg.slice("--api-key=".length);
    if (arg.startsWith("--base-url=")) args.baseUrl = arg.slice("--base-url=".length);
  }
  return args;
}

async function loadAccessModel() {
  const raw = await readFile(path.join(ROOT, "src", "data", "access-model.json"), "utf8");
  return JSON.parse(raw);
}

async function testOpenApiAvailability(baseUrl) {
  console.log("\n--- OpenAPI Availability ---");
  try {
    const res = await fetch(`${baseUrl}/openapi.json`, {
      signal: AbortSignal.timeout(10000),
    });
    const ok = res.status === 200;
    console.log(`${ok ? "OK" : "FAIL"}: ${baseUrl}/openapi.json -> HTTP ${res.status}`);
    if (ok) {
      const spec = await res.json();
      const paths = Object.keys(spec.paths || {});
      const hasCheckout = paths.some((p) => p.includes("checkout/session"));
      console.log(`  Paths: ${paths.length} | checkout/session endpoint: ${hasCheckout ? "YES" : "NO"}`);
    }
    return ok;
  } catch (err) {
    console.log(`FAIL: ${baseUrl}/openapi.json -> ${err.message}`);
    return false;
  }
}

async function testCheckoutSession(baseUrl, apiKey, payload, label) {
  console.log(`\n--- Checkout Test: ${label} ---`);
  console.log(`  Payload: ${JSON.stringify(payload)}`);

  try {
    const res = await fetch(`${baseUrl}/api/v1/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    const status = res.status;
    let body;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }

    console.log(`  HTTP ${status}`);

    if (status === 200 || status === 201) {
      const checkoutUrl = body?.checkoutUrl || body?.checkout_url || body?.data?.checkoutUrl || "";
      const sessionId = body?.sessionId || body?.session_id || body?.data?.sessionId || "";

      console.log(`  checkoutUrl: ${checkoutUrl || "(empty)"}`);
      console.log(`  sessionId: ${sessionId || "(empty)"}`);

      if (checkoutUrl) {
        console.log(`  PASS: Got non-empty checkoutUrl`);
        return { ok: true, checkoutUrl, sessionId, status };
      } else {
        console.log(`  FAIL: checkoutUrl is empty — upstream pay.iai.one issue`);
        return { ok: false, reason: "empty_checkout_url", status, body };
      }
    } else if (status === 401) {
      console.log(`  FAIL: API key rejected (401 API_KEY_REQUIRED)`);
      return { ok: false, reason: "auth_rejected", status };
    } else if (status === 403) {
      console.log(`  FAIL: API key invalid (403 API_KEY_INVALID)`);
      return { ok: false, reason: "auth_invalid", status };
    } else {
      console.log(`  FAIL: Unexpected status ${status}`);
      console.log(`  Body: ${JSON.stringify(body).slice(0, 500)}`);
      return { ok: false, reason: `http_${status}`, status, body };
    }
  } catch (err) {
    console.log(`  FAIL: ${err.message}`);
    return { ok: false, reason: "fetch_error", error: err.message };
  }
}

async function testWebhookEndpoint() {
  console.log("\n--- Webhook Dispatcher Endpoint ---");
  const url = "https://member.vetuonglai.com/api/access/webhooks/pay/iai-one";

  try {
    // Just check endpoint is reachable (OPTIONS or HEAD)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true, event: "ping" }),
      signal: AbortSignal.timeout(10000),
    });
    console.log(`  ${url} -> HTTP ${res.status}`);

    // We expect 400 or 401 for invalid payload, but NOT 404/502/503
    if (res.status === 404) {
      console.log("  FAIL: Endpoint not found (404) — dispatcher not configured");
      return { ok: false, reason: "not_found" };
    } else if (res.status >= 500) {
      console.log(`  FAIL: Server error (${res.status})`);
      return { ok: false, reason: `server_${res.status}` };
    } else {
      console.log("  OK: Endpoint is reachable");
      return { ok: true, status: res.status };
    }
  } catch (err) {
    console.log(`  FAIL: ${err.message}`);
    return { ok: false, reason: "unreachable", error: err.message };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl || process.env.PAY_IAI_ONE_BASE_URL || DEFAULT_BASE_URL;
  const apiKey = args.apiKey || process.env.PAY_IAI_ONE_API_KEY;

  console.log("=== Pay.iai.one Checkout Test ===");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API Key: ${apiKey ? apiKey.slice(0, 6) + "..." : "(not provided)"}`);
  console.log(`Mode: ${args.dryRun ? "DRY-RUN (config check only)" : "LIVE"}`);

  // Load access model for reference
  const model = await loadAccessModel();
  const hub = model.homepagePurchaseHub;
  console.log(`\nAccess model version: ${model.version}`);
  console.log(`Annual access price: $${hub.annualAccess.billingCycles[0].price} (year 1)`);

  // Test 1: OpenAPI availability
  const openApiOk = await testOpenApiAvailability(baseUrl);

  if (args.dryRun) {
    console.log("\n[DRY-RUN] Config check complete. Use without --dry-run to test live.");
    return;
  }

  if (!apiKey) {
    console.error("\nERROR: No API key provided.");
    console.error("  Set PAY_IAI_ONE_API_KEY env var or pass --api-key=YOUR_KEY");
    process.exitCode = 1;
    return;
  }

  // Test 2: Annual access checkout
  const annualResult = await testCheckoutSession(baseUrl, apiKey, {
    product: "annual-access",
    currency: "USD",
    amount: 300, // $3.00 in cents
    description: "Ve Tuong Lai Annual Access - Year 1",
    returnUrl: "https://vetuonglai.com/thanh-cong/",
    cancelUrl: "https://vetuonglai.com/huy/",
    idempotencyKey: `test-annual-${Date.now()}`,
  }, "Annual Access ($3)");

  // Test 3: Specialist pack g1
  const packResult = await testCheckoutSession(baseUrl, apiKey, {
    product: "specialist-pack",
    pack: "g1",
    currency: "USD",
    amount: 900, // $9.00 in cents
    description: "Ve Tuong Lai Specialist Pack G1",
    returnUrl: "https://vetuonglai.com/thanh-cong/",
    cancelUrl: "https://vetuonglai.com/huy/",
    idempotencyKey: `test-g1-${Date.now()}`,
  }, "Specialist Pack G1 ($9)");

  // Test 4: Webhook endpoint
  const webhookResult = await testWebhookEndpoint();

  // Summary
  console.log("\n=== PAYMENT GATE SUMMARY ===");
  console.log(`OpenAPI spec: ${openApiOk ? "OK" : "FAIL"}`);
  console.log(`Annual checkout: ${annualResult.ok ? "PASS" : "FAIL"} ${annualResult.reason || ""}`);
  console.log(`Pack G1 checkout: ${packResult.ok ? "PASS" : "FAIL"} ${packResult.reason || ""}`);
  console.log(`Webhook endpoint: ${webhookResult.ok ? "REACHABLE" : "FAIL"} ${webhookResult.reason || ""}`);

  const allOk = openApiOk && annualResult.ok && packResult.ok && webhookResult.ok;
  console.log(`\nPayment gate: ${allOk ? "GREEN — ready for cutover" : "BLOCKED"}`);

  if (!allOk) {
    console.log("\nRemaining blockers:");
    if (!openApiOk) console.log("  - pay.iai.one OpenAPI not reachable");
    if (!annualResult.ok) console.log(`  - Annual checkout: ${annualResult.reason}`);
    if (!packResult.ok) console.log(`  - Pack G1 checkout: ${packResult.reason}`);
    if (!webhookResult.ok) console.log(`  - Webhook endpoint: ${webhookResult.reason}`);
    process.exitCode = 1;
  }

  if (annualResult.ok && packResult.ok) {
    console.log("\nCheckout proofs collected:");
    console.log(`  1. Annual: ${annualResult.checkoutUrl}`);
    console.log(`  2. Pack G1: ${packResult.checkoutUrl}`);
    console.log("\nNext: collect 6 UAT webhook replay payloads");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
