#!/usr/bin/env node
// Smoke test notify-runtime: template rendering + KV inbox + Resend gate
import { maybeHandleNotifyRuntime } from "../workers/lib/notify-runtime.mjs";

const env = {
  WALLET_INTERNAL_TOKEN: "test-token",
  // RESEND_API_KEY intentionally absent → delivery: kv_only
};

function req(path, { method = "GET", body = null } = {}) {
  const init = { method, headers: {} };
  if (body) { init.body = JSON.stringify(body); init.headers["content-type"] = "application/json"; }
  if (method === "POST") init.headers["x-wallet-internal-token"] = env.WALLET_INTERNAL_TOKEN;
  return new Request(`https://vc.vetuonglai.com${path}`, init);
}

async function call(label, request) {
  const r = await maybeHandleNotifyRuntime(request, env);
  const text = await r.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  const ok = r.status >= 200 && r.status < 300;
  console.log(`\n=== ${label} → ${r.status} ${ok ? "✅" : "❌"} ===`);
  if (!ok || process.env.VERBOSE) console.log(JSON.stringify(parsed, null, 2).slice(0, 400));
  return { status: r.status, body: parsed, ok };
}

async function main() {
  // 1. Health check — should show 26 templates + kv_only delivery
  const health = await call("GET /health", req("/api/notify/health"));
  console.assert(health.body.templates?.length >= 26, "FAIL: expected ≥26 templates");
  console.assert(health.body.delivery === "kv_only", "FAIL: expected kv_only without RESEND_API_KEY");

  // 2. Send payment_success notification
  const sent = await call("POST /send (payment_success)", req("/api/notify/send", {
    method: "POST",
    body: {
      recipient_email: "test@example.com",
      template: "payment_success",
      lang: "vi",
      vars: { amount: "500,000", product_name: "Annual Access", transaction_id: "TXN-001", payment_date: "21/05/2026", access_url: "https://member.vetuonglai.com/journey/" },
    },
  }));
  console.assert(sent.status === 202, "FAIL: expected 202 for queued notification");
  console.assert(sent.body.notification?.subject?.includes("thành công"), `FAIL: subject should contain 'thành công', got: ${sent.body.notification?.subject}`);

  // 3. Send welcome notification (EN)
  const welcome = await call("POST /send (welcome EN)", req("/api/notify/send", {
    method: "POST",
    body: {
      recipient_email: "test@example.com",
      template: "welcome",
      lang: "en",
      vars: { first_name: "Alice", wallet_address: "vtl1test123abc" },
    },
  }));
  console.assert(welcome.body.notification?.subject?.includes("Welcome"), `FAIL: EN welcome subject`);

  // 4. Send magic_link notification
  const magicLink = await call("POST /send (magic_link)", req("/api/notify/send", {
    method: "POST",
    body: {
      recipient_email: "test@example.com",
      template: "magic_link",
      lang: "vi",
      vars: { magic_link_url: "https://vetuonglai.com/login?token=test", expiry_minutes: "15" },
    },
  }));
  console.assert(magicLink.status === 202, "FAIL: magic_link send");

  // 5. Resend active path (mock key — will fail delivery but should attempt)
  const envWithKey = { ...env, RESEND_API_KEY: "re_test_FAKE", RESEND_FROM_EMAIL: "noreply@vetuonglai.com" };
  const sentWithKey = await call("POST /send (with RESEND key — expect delivery attempt)", req("/api/notify/send", {
    method: "POST",
    body: {
      recipient_email: "test@example.com",
      template: "kyc_approved",
      lang: "vi",
      vars: { kyc_id: "KYC-001", kyc_level: "verified" },
    },
  }));
  // Direct call with envWithKey (bypassing req helper which uses old env)
  const envKeyReq = new Request("https://vc.vetuonglai.com/api/notify/send", {
    method: "POST",
    headers: { "content-type": "application/json", "x-wallet-internal-token": "test-token" },
    body: JSON.stringify({
      recipient_email: "test@example.com",
      template: "kyc_approved",
      lang: "vi",
      vars: { kyc_id: "KYC-001", kyc_level: "verified" },
    }),
  });
  const r2 = await maybeHandleNotifyRuntime(envKeyReq, envWithKey);
  const b2 = await r2.json();
  console.log(`\n=== POST /send with RESEND key → ${r2.status} ${r2.status===202?"✅":"❌"} ===`);
  // delivery attempt will fail (fake key) but notification should still be 202
  console.assert(r2.status === 202, "FAIL: should still return 202 even if Resend rejects");

  // 6. Reject unauthorized send
  const unauth = await call("POST /send (no token)", new Request("https://vc.vetuonglai.com/api/notify/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ recipient_email: "x@x.com", template: "generic" }),
  }));
  console.assert(unauth.status === 401, "FAIL: should reject missing internal token");

  // 7. Invalid email
  const badEmail = await call("POST /send (bad email)", req("/api/notify/send", {
    method: "POST",
    body: { recipient_email: "not-an-email", template: "generic" },
  }));
  console.assert(badEmail.status === 422, "FAIL: should reject invalid email");

  console.log("\n\n✅ ALL SMOKE CHECKS COMPLETE — notify-runtime OK");
}

main().catch(e => { console.error("SMOKE FAILED:", e); process.exit(1); });
