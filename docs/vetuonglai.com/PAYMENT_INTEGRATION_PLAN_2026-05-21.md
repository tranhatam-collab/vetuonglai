# Payment Integration Plan — 2026-05-21

> Technical plan for Stripe + PayPal direct integration. pay.iai.one is NOT used for vetuonglai.com (Phase 4 lock respected — confirmed Q.B6).

---

## Architecture

```
Member browser
    │
    ├── POST /api/access/checkout/stripe  ──► Stripe Checkout Session (redirect)
    ├── POST /api/access/checkout/paypal  ──► PayPal Order/Subscription (redirect)
    │
    ▼
Stripe / PayPal processes payment
    │
    ├── POST https://vetuonglai.com/api/access/webhook/stripe
    └── POST https://vetuonglai.com/api/access/webhook/paypal/{subscriptions|orders}
         │
         ▼
    access-runtime.mjs
         │
         ├── Verify signature / postback
         ├── Deduplicate (KV webhook_dedupe prefix)
         ├── Normalise to internal event name
         ├── upsertRuntimeMemberState()  ──► wallet credit + entitlement write
         └── [PENDING] dispatchNotifyEmail()  ──► notify-runtime → Resend API
```

**No pay.iai.one involvement.** Direct Stripe + PayPal credentials only.

---

## Existing webhook stubs — location + current behaviour

File: `workers/lib/access-runtime.mjs`

| Function | Lines (approx) | Current behaviour |
|---|---|---|
| `handleStripeWebhook(request, env)` | ~2301–2336 | Reads raw body, verifies HMAC signature (`STRIPE_WEBHOOK_SECRET`), deduplicates by `payload.id`, calls `upsertRuntimeMemberState()`, returns 202 JSON with event name + provisioning result |
| `handlePayPalWebhook(request, env, routeKey)` | ~2264–2299 | Reads raw body, calls PayPal postback verification API using `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET`, deduplicates by `payload.event_id`, calls `upsertRuntimeMemberState()`, returns 202 JSON |
| `verifyStripeWebhook()` | ~1259–1283 | HMAC-SHA256 over `timestamp.rawBody`; bypassed in non-production if `STRIPE_WEBHOOK_VERIFY_MODE != "signature"` |
| `verifyPayPalWebhook()` | ~1208–1257 | OAuth token fetch + PayPal postback API call; bypassed if `PAYPAL_WEBHOOK_VERIFY_MODE != "postback"` |

**What `upsertRuntimeMemberState()` currently does**: writes wallet credit + entitlement records to KV based on normalised event name. Does NOT currently send emails — that pipeline is the remaining gap.

Route dispatch (lines ~2881–2889):
```
/api/access/webhook/paypal/subscriptions  →  handlePayPalWebhook(…, "subscriptions")
/api/access/webhook/paypal/orders         →  handlePayPalWebhook(…, "orders")
/api/access/webhook/stripe                →  handleStripeWebhook(…)
```

---

## What needs to be added

### 1 — `dispatchNotifyEmail(env, eventName, payload)` in `notify-runtime.mjs`

Called after `upsertRuntimeMemberState()` succeeds. Maps normalised event names to email templates:

| Normalised event | Template | Key variables from payload |
|---|---|---|
| `subscription.activated` | `payment_success` | member email, product name, amount |
| `subscription.cancelled` | `generic` | cancellation notice |
| `payment.captured` | `payment_success` | member email, amount, transaction ID |
| `payment.failed` | `payment_failed` | member email, failure reason |
| `refund.completed` | `refund_completed` | member email, refund amount |
| `pack.order.fulfilled` | `payment_success` + `payment_unlock_magic_link` | member email, pack name |
| `wallet.credited` | `wallet_credited` (already in KV) | member email, amount, new balance |

### 2 — Resend delivery layer in `notify-runtime.mjs`

```javascript
async function sendEmailViaResend(env, { to, subject, html, text }) {
  const apiKey = getEnvString(env, "RESEND_API_KEY");
  if (!apiKey) {
    // Graceful fallback: log to KV inbox, no outbound delivery
    await writeKvInboxMessage(env, { to, subject, body: text });
    return { ok: false, reason: "RESEND_API_KEY_missing", fallback: "kv_inbox" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: getEnvString(env, "RESEND_FROM_EMAIL") || "noreply@vetuonglai.com",
      to: [to],
      bcc: [getEnvString(env, "RESEND_AUDIT_BCC") || "audit@vetuonglai.com"],
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok, status: res.status };
}
```

### 3 — Invoice API endpoint `/api/invoice/{id}`

New route in `generic-worker.mjs` (or `access-runtime.mjs`). Reads `invoice:{id}` from KV, returns JSON:

```json
{
  "invoice_id": "inv_abc123",
  "payer_name": "Nguyen Van A",
  "payer_email": "user@example.com",
  "product_name": "Annual Access",
  "amount_vnd": 2400000,
  "payment_method": "Stripe / Visa ****4242",
  "transaction_id": "pi_abc123",
  "payment_date": "2026-05-21",
  "status": "paid"
}
```

Invoice records written to KV by `upsertRuntimeMemberState()` when payment succeeds.

---

## Secret names and worker targets

| Secret name | Worker(s) | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `vetuonglai-home`, `vetuonglai-member` | Transactional email delivery |
| `RESEND_FROM_EMAIL` | `vetuonglai-home`, `vetuonglai-member` | From address (default: `noreply@vetuonglai.com`) |
| `RESEND_AUDIT_BCC` | `vetuonglai-home`, `vetuonglai-member` | BCC for audit trail (default: `audit@vetuonglai.com`) |
| `STRIPE_SECRET_KEY` | `vetuonglai-home`, `vetuonglai-member` | Create checkout sessions |
| `STRIPE_WEBHOOK_SECRET` | `vetuonglai-home`, `vetuonglai-member` | Verify incoming Stripe webhook signatures |
| `PAYPAL_CLIENT_ID` | `vetuonglai-home`, `vetuonglai-member` | PayPal OAuth + order creation |
| `PAYPAL_CLIENT_SECRET` | `vetuonglai-home`, `vetuonglai-member` | PayPal OAuth token exchange |
| `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS` | `vetuonglai-home`, `vetuonglai-member` | Verify PayPal subscription webhook events |
| `PAYPAL_WEBHOOK_ID_ORDERS` | `vetuonglai-home`, `vetuonglai-member` | Verify PayPal order webhook events |

**Set secrets via:**
```bash
npx wrangler secret put STRIPE_SECRET_KEY --name vetuonglai-home
npx wrangler secret put STRIPE_SECRET_KEY --name vetuonglai-member
# repeat for each secret on each worker
```

---

## Smoke test checklist (7 cases)

| # | Test case | Expected result |
|---|---|---|
| 1 | Stripe `checkout.session.completed` event (test mode) | Wallet credited + `payment_success` email sent to payer |
| 2 | Stripe `payment_intent.payment_failed` event | `payment_failed` email sent; wallet NOT credited |
| 3 | Stripe `charge.refunded` event | `refund_completed` email sent; wallet unchanged |
| 4 | PayPal `BILLING.SUBSCRIPTION.ACTIVATED` event | Wallet credited + `payment_success` email sent |
| 5 | PayPal postback with invalid signature | Returns 400 `paypal_verification_failed`; no state change |
| 6 | Duplicate Stripe event (same `id` sent twice) | Second request returns `duplicate_event_ignored`; no double wallet credit |
| 7 | `RESEND_API_KEY` not set | Email falls back to KV inbox only; webhook still returns 202; no crash |

---

## Deploy order

1. **Set secrets first** (all 9 secrets on both workers before deploying)
2. **Redeploy workers**:
   ```bash
   node scripts/deploy-workers.mjs --worker home
   node scripts/deploy-workers.mjs --worker member
   ```
3. **Verify webhook endpoints return 200** for a test event from Stripe/PayPal dashboard
4. **Send one real test payment** ($0.50 or equivalent) → confirm wallet credit + email received
5. **Check KV** for `invoice:*` record and confirm `/invoice/?id=...` page renders correctly

---

## Event normalisation maps (reference)

**Stripe** (`STRIPE_EVENT_MAP` in `access-runtime.mjs`):
- `checkout.session.completed:subscription` → `subscription.activated`
- `checkout.session.completed:payment` → `payment.captured`
- `customer.subscription.deleted` → `subscription.cancelled`
- `payment_intent.payment_failed` → `payment.failed`
- `charge.refunded` → `refund.completed`

**PayPal** (`PAYPAL_EVENT_MAP` in `access-runtime.mjs`):
- `BILLING.SUBSCRIPTION.ACTIVATED` → `subscription.activated`
- `BILLING.SUBSCRIPTION.CANCELLED` → `subscription.cancelled`
- `PAYMENT.CAPTURE.COMPLETED` → `payment.captured`
- `PAYMENT.CAPTURE.DENIED` → `payment.failed`
- `PAYMENT.CAPTURE.REFUNDED` → `refund.completed`

---

*Generated by autonomous dev agent · vetuonglai-system · 2026-05-21*
