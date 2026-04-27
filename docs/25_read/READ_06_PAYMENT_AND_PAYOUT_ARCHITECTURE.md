# READ_06 — Payment and Payout Architecture

## Stack

```
Reader pays → PayOS Checkout → Cloudflare Worker (read.vetuonglai.com)
            → D1 database (orders, splits, ledger)
            → Cron settlement (Mon 06:00 ICT)
            → PayOS chi-ho API (auto payout)
            → Bank account creator (T+0)
            → Public ledger update (anonymized)
```

## Components

### 1. Checkout flow

```
GET  /books/<slug>/         → book detail page with "Mua ngay" button
POST /api/checkout          → create PayOS order, return checkout URL
GET  /api/payment-webhook   → PayOS webhook, mark order paid
GET  /access/<order_id>     → grant download access
```

**File:** `workers/read-checkout.mjs`

### 2. Order + split DB (Cloudflare D1)

```sql
-- orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,                    -- ord_<uuid>
  product_id TEXT NOT NULL,               -- book/essay slug
  product_type TEXT NOT NULL,             -- 'book' | 'stack' | 'essay_paid'
  buyer_member_id TEXT,                   -- nullable for guest
  gross_vnd INTEGER NOT NULL,
  platform_fee_vnd INTEGER NOT NULL,
  pit_withhold_vnd INTEGER NOT NULL,
  net_distributable_vnd INTEGER NOT NULL,
  payos_tx_id TEXT,
  status TEXT NOT NULL,                   -- pending | paid | refunded | clawback
  referrer_member_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP
);

-- order_splits table — every contributor's share for this order
CREATE TABLE order_splits (
  id TEXT PRIMARY KEY,                    -- spl_<uuid>
  order_id TEXT NOT NULL REFERENCES orders(id),
  contributor_member_id TEXT NOT NULL,
  role TEXT NOT NULL,                     -- author | translator | editor | designer | curator | referrer | reviewer
  share_bps INTEGER NOT NULL,             -- basis points (e.g. 6000 = 60%)
  amount_vnd INTEGER NOT NULL,
  status TEXT NOT NULL,                   -- pending | included_in_payout | paid | clawback
  payout_id TEXT,                         -- nullable until settled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- payouts table — weekly settlement runs
CREATE TABLE payouts (
  id TEXT PRIMARY KEY,                    -- pay_<uuid>
  contributor_member_id TEXT NOT NULL,
  week_start_iso TEXT NOT NULL,
  total_vnd INTEGER NOT NULL,
  payos_chi_ho_tx_id TEXT,
  status TEXT NOT NULL,                   -- pending | sent | confirmed | failed
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP
);

-- ledger_public — anonymized public ledger
CREATE TABLE ledger_public (
  id TEXT PRIMARY KEY,                    -- led_<uuid>
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL,                     -- order_paid | refund | payout_sent | clawback
  amount_vnd INTEGER NOT NULL,
  role TEXT,                              -- nullable for non-split entries
  hash_anon TEXT NOT NULL                 -- hash of (contributor_id+order_id+nonce)
);
```

### 3. Settlement cron worker

**File:** `workers/settlement.mjs`

```javascript
// Cron schedule: 0 23 * * 0 (Sunday 23:00 UTC = Monday 06:00 ICT)
export default {
  async scheduled(event, env, ctx) {
    const week = lastWeekRange();
    const due = await env.READ_DB.prepare(`
      SELECT contributor_member_id, SUM(amount_vnd) as total_vnd
      FROM order_splits
      WHERE status = 'pending' AND created_at < ?
      GROUP BY contributor_member_id
      HAVING total_vnd >= 200000
    `).bind(week.endIso).all();
    
    for (const row of due.results) {
      const payout = await createPayoutRecord(env, row);
      try {
        const tx = await callPayosChiHo(env, {
          contributor: row.contributor_member_id,
          amount_vnd: row.total_vnd,
          memo: `Read settlement ${week.label}`,
        });
        await markPayoutSent(env, payout.id, tx.tx_id);
        await appendPublicLedger(env, "payout_sent", row.total_vnd);
      } catch (err) {
        await markPayoutFailed(env, payout.id, err.message);
      }
    }
  },
};
```

### 4. PayOS chi-ho integration

**File:** `workers/lib/payos-payout.mjs`

```javascript
// Call PayOS payout API
// Docs: https://payos.vn/api-chi-ho-tu-dong/
export async function callPayosChiHo(env, { contributor, amount_vnd, memo }) {
  const profile = await getContributorBankInfo(env, contributor);
  const body = {
    bank_code: profile.bank_code,
    account_number: profile.account_number,
    account_holder: profile.account_holder,
    amount: amount_vnd,
    memo,
    reference_id: `read_${Date.now()}_${contributor.slice(-6)}`,
  };
  const sig = await signHmac(env.PAYOS_PAYOUT_SECRET, JSON.stringify(body));
  const res = await fetch("https://api-merchant.payos.vn/v2/payouts", {
    method: "POST",
    headers: {
      "x-client-id": env.PAYOS_CLIENT_ID,
      "x-api-key": env.PAYOS_API_KEY,
      "x-signature": sig,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`PayOS payout failed: ${res.status} ${await res.text()}`);
  }
  return await res.json();
}
```

### 5. Backup payout (PayOS down)

Nếu PayOS chi-ho fail trong 3 lần liên tiếp:
- Worker tự động fallback sang **Casso** (cùng nhóm công ty)
- Nếu Casso cũng fail → **manual queue** + notify ops via email
- Public ledger ghi `payout_pending` thay vì `payout_sent` để minh bạch

## Required env vars / secrets

```
PAYOS_CLIENT_ID         — public client ID
PAYOS_API_KEY           — checkout API key
PAYOS_PAYOUT_SECRET     — HMAC secret for chi-ho
PAYOS_PAYOUT_CLIENT_ID  — separate client for payout (PayOS giữ riêng)
PAYOS_PAYOUT_API_KEY    — separate key for payout
CASSO_API_KEY           — fallback
READ_LEDGER_HASH_SALT   — for hash_anon column
READ_DB                 — D1 binding
```

## Phase rollout

| Phase | Component | Live khi |
|---|---|---|
| P1 | Static shell + API stubs | T1 — homepage, archive UI, no checkout |
| P2 | Checkout (owner book only) | T2 — PayOS checkout, manual settle |
| P3 | DB + cron settlement | T3 — auto weekly payout cho owner |
| P4 | Multi-contributor splits | T4 — author + editor flows |
| P5 | Translator + Designer + Referrer | T5 |
| P6 | Curator + Stack bundles | T6 |
| P7 | Sponsor + community vote | T7+ |
