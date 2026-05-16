#!/usr/bin/env node
// Backfill wallet for every email present in KV under "pending_members:*".
// Usage:
//   WALLET_ADDRESS_SECRET=... CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... \
//   ACCESS_KV_NAMESPACE_ID=<id> node scripts/backfill-wallets.mjs
//
// Mode local (KV memory only — for testing): pass --local.
// Idempotent: existing wallets are skipped.

import { deriveWalletAddress, normalizeWalletEmail } from "../workers/lib/wallet-address.mjs";

const LOCAL = process.argv.includes("--local");
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const KV_NS = process.env.ACCESS_KV_NAMESPACE_ID || "";

function envOrExit(name, value) {
  if (!value) {
    console.error(`Missing env: ${name}`);
    process.exit(1);
  }
  return value;
}

async function listKeys(prefix, cursor) {
  const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NS}/keys`);
  url.searchParams.set("prefix", prefix);
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url, { headers: { authorization: `Bearer ${API_TOKEN}` } });
  if (!res.ok) throw new Error(`KV list failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function getKv(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NS}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${API_TOKEN}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`KV get failed: ${res.status}`);
  return res.text();
}

async function putKv(key, value) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NS}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { authorization: `Bearer ${API_TOKEN}`, "content-type": "text/plain" },
    body: value,
  });
  if (!res.ok) throw new Error(`KV put failed: ${res.status} ${await res.text()}`);
}

async function main() {
  if (!LOCAL) {
    envOrExit("CLOUDFLARE_ACCOUNT_ID", ACCOUNT_ID);
    envOrExit("CLOUDFLARE_API_TOKEN", API_TOKEN);
    envOrExit("ACCESS_KV_NAMESPACE_ID", KV_NS);
  }
  envOrExit("WALLET_ADDRESS_SECRET", process.env.WALLET_ADDRESS_SECRET);

  if (LOCAL) {
    console.log("Local mode: no KV write. Demonstrating address derivation only.");
    for (const email of ["alice@example.com", "bob@example.com", "long.email@vetuonglai.com"]) {
      const addr = await deriveWalletAddress(email, process.env);
      console.log(`${email.padEnd(35)} -> ${addr}`);
    }
    return;
  }

  let cursor = undefined;
  let processed = 0;
  let created = 0;
  let skipped = 0;

  do {
    const page = await listKeys("pending_members:", cursor);
    for (const item of page.result || []) {
      const email = normalizeWalletEmail(item.name.replace(/^pending_members:/, ""));
      processed += 1;
      if (!email || !/@/.test(email)) continue;

      const walletKey = `wallets:${email}`;
      const existing = await getKv(walletKey);
      if (existing) { skipped += 1; continue; }

      const address = await deriveWalletAddress(email, process.env);
      const wallet = {
        address,
        candidate_email: email,
        created_at: Math.floor(Date.now() / 1000),
        created_from: "backfill_script",
        kyc: { level: "none", verified_at: null, full_name: "", phone: "", id_number_hash: "" },
        balances: { pending_vnd: 0, available_vnd: 0, tax_held_vnd: 0, withdrawn_vnd: 0 },
        limits: { min_payout_vnd: 200000, payout_fee_bps: 200 },
        level: "Free",
        version: 1,
      };
      await putKv(walletKey, JSON.stringify(wallet));
      await putKv(`wallet_index:${address}`, JSON.stringify({ candidate_email: email }));
      created += 1;
      if (created % 25 === 0) console.log(`...created ${created}/${processed}`);
    }
    cursor = page.result_info?.cursor || undefined;
    if (page.result_info?.list_complete) cursor = undefined;
  } while (cursor);

  console.log(`Done. processed=${processed} created=${created} skipped=${skipped}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
