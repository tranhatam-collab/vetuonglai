#!/usr/bin/env node
// Smoke test wallet runtime end-to-end with in-memory KV (no real Cloudflare).
import { maybeHandleWalletRuntime, ensureWalletForEmail } from "../workers/lib/wallet-runtime.mjs";

const env = {
  SESSION_COOKIE_SECRET: "test-session-secret",
  WALLET_ADDRESS_SECRET: "test-wallet-secret",
  WALLET_INTERNAL_TOKEN: "test-internal-token",
};

// helper: build a session cookie compatible with wallet-runtime's verifier
async function signValueHex(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}
function toBase64Url(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
}
async function makeSessionCookie(email) {
  const payload = { candidate_email: email, exp: Math.floor(Date.now()/1000) + 3600 };
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await signValueHex(env.SESSION_COOKIE_SECRET, encoded);
  return `vtl_session=${encoded}.${sig}`;
}

function req(path, { method="GET", cookie="", body=null, headers={} } = {}) {
  const init = { method, headers: { ...headers } };
  if (cookie) init.headers.cookie = cookie;
  if (body !== null) {
    init.body = JSON.stringify(body);
    init.headers["content-type"] = "application/json";
  }
  return new Request(`https://vc.vetuonglai.com${path}`, init);
}

async function call(label, request) {
  const r = await maybeHandleWalletRuntime(request, env);
  const text = await r.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  console.log(`\n=== ${label} → ${r.status} ===`);
  console.log(JSON.stringify(parsed, null, 2).slice(0, 600));
  return { status: r.status, body: parsed };
}

async function main() {
  await call("GET /health", req("/api/wallet/health"));

  // 1. Ensure wallet for alice via API
  const aliceCookie = await makeSessionCookie("alice@example.com");
  const ensured = await call("POST /ensure (alice)", req("/api/wallet/ensure", { method: "POST", cookie: aliceCookie }));
  const aliceAddr = ensured.body.wallet?.address;

  // 2. GET /me
  await call("GET /me (alice)", req("/api/wallet/me", { cookie: aliceCookie }));

  // 3. Credit alice 100k VND via internal token
  await call("POST /credit (internal token, alice +100000 available)", req("/api/wallet/credit", {
    method: "POST",
    headers: { "x-wallet-internal-token": "test-internal-token", "idempotency-key": "credit-001" },
    body: { address: aliceAddr, amount_vnd: 100000, bucket: "available", source: "edu.vetuonglai.com", ref: "course-vtl-001" },
  }));

  // 4. Replay same idempotency
  await call("POST /credit replay same idempotency-key (should be replay)", req("/api/wallet/credit", {
    method: "POST",
    headers: { "x-wallet-internal-token": "test-internal-token", "idempotency-key": "credit-001" },
    body: { address: aliceAddr, amount_vnd: 100000, bucket: "available", source: "edu.vetuonglai.com", ref: "course-vtl-001" },
  }));

  // 5. Wrong internal token
  await call("POST /credit BAD token (should 401)", req("/api/wallet/credit", {
    method: "POST",
    headers: { "x-wallet-internal-token": "wrong", "idempotency-key": "credit-002" },
    body: { address: aliceAddr, amount_vnd: 1, bucket: "available" },
  }));

  // 6. Create bob, transfer 30k from alice to bob
  const bobResult = await ensureWalletForEmail("bob@example.com", env, { createdFrom: "test_setup" });
  const bobAddr = bobResult.wallet.address;

  await call("POST /transfer (alice -> bob 30000)", req("/api/wallet/transfer", {
    method: "POST",
    cookie: aliceCookie,
    headers: { "idempotency-key": "xfer-001" },
    body: { to_address: bobAddr, amount_vnd: 30000, memo: "Trả Bob coffee" },
  }));

  // 7. Lookup
  await call("GET /lookup bob (public view)", req(`/api/wallet/lookup?address=${bobAddr}`));

  // 8. Try payout without KYC (should fail)
  await call("POST /payout/request (no KYC, should 403)", req("/api/wallet/payout/request", {
    method: "POST", cookie: aliceCookie,
    body: { amount_vnd: 200000, bank_name: "VCB", account_number: "123", account_holder: "Alice" },
  }));

  // 9. KYC submit verified
  await call("POST /kyc/submit (alice verified)", req("/api/wallet/kyc/submit", {
    method: "POST", cookie: aliceCookie,
    body: { level: "verified", full_name: "Alice Tran", phone: "0900000001", id_number: "079200012345" },
  }));

  // Add more balance via direct credit
  await call("POST /credit alice +500000 available", req("/api/wallet/credit", {
    method: "POST",
    headers: { "x-wallet-internal-token": "test-internal-token", "idempotency-key": "credit-002" },
    body: { address: aliceAddr, amount_vnd: 500000, bucket: "available", source: "work.vetuonglai.com" },
  }));

  // 10. Payout request with KYC ok
  const payoutRes = await call("POST /payout/request (KYC verified, 250000)", req("/api/wallet/payout/request", {
    method: "POST", cookie: aliceCookie,
    body: { amount_vnd: 250000, bank_name: "VCB", account_number: "0123456789", account_holder: "Tran Alice" },
  }));
  const payoutId = payoutRes.body.payout_request?.id;

  // 11. Payout settle
  await call("POST /payout/settle", req("/api/wallet/payout/settle", {
    method: "POST",
    headers: { "x-wallet-internal-token": "test-internal-token" },
    body: { address: aliceAddr, request_id: payoutId, settled_status: "settled", settlement_ref: "BANK-TXN-99" },
  }));

  // 12. History
  await call("GET /history alice (memory KV won't list; expect mode='memory')", req("/api/wallet/history", { cookie: aliceCookie }));

  // 13. Unknown route
  await call("GET /api/wallet/nope (404)", req("/api/wallet/nope"));

  // 14. Determinism: derive again -> same address
  const re = await ensureWalletForEmail("alice@example.com", env, { createdFrom: "re-derive" });
  console.log(`\n=== Determinism: re-ensure alice → same address? ${re.wallet.address === aliceAddr} ===`);

  console.log("\nALL SMOKE CHECKS COMPLETE.");
}

main().catch((e) => { console.error(e); process.exit(1); });
