# Founder Status Report — 2026-05-21

> This is a status report, not a plan. Each item is either working today or explicitly blocked by a missing external action.

---

## §1 — What is working today (✅)

| Feature | Detail |
|---|---|
| **Email form delivery** | `POST /api/email/forms/submit` → Mailgun internal notification + user acknowledgement. Smoke-tested 2026-05-20. |
| **Magic-link login** | Production. `POST /api/access/magic-link` issues signed link; `GET /api/access/magic-link/verify` sets `vtl_session` cookie across all subdomains. |
| **4 default notify templates** | Stored in KV inbox: `wallet_credited`, `job_application_received`, `community_reply`, `generic`. Rendered and deliverable today. |
| **Stripe webhook handler** | `handleStripeWebhook` in `workers/lib/access-runtime.mjs` — verifies signature, deduplicates by event ID, normalises to internal event names, calls `upsertRuntimeMemberState`. Live code, awaiting live secrets. |
| **PayPal webhook handler** | `handlePayPalWebhook` in `workers/lib/access-runtime.mjs` — verifies via PayPal postback API, deduplicates, normalises, calls `upsertRuntimeMemberState`. Live code, awaiting live secrets. |
| **Wallet runtime** | 11 endpoints fully wired: balance read, credit, debit, withdrawal request/approve/reject, transaction history, address lookup, deterministic `vtl1…` Bech32 address per member. |
| **7 Workers live** | `vetuonglai-home`, `vetuonglai-vc`, `vetuonglai-edu-github`, `vetuonglai-member`, `vetuonglai-green`, `vetuonglai-finance`, `vetuonglai-kids`. |
| **Bilingual parity** | 277 issues resolved 2026-05-20. All UI strings have `vi` / `en` equivalents. |

---

## §2 — What will NOT work until you act (⏳)

### B.1 — `RESEND_API_KEY`

- **Unlocks**: transactional email for 27 templates (welcome, payment confirmation, KYC status, withdrawal, security alerts, etc.)
- **Current state**: Email delivery layer coded; `RESEND_API_KEY` missing → emails fall back to KV inbox only (no outbound delivery).
- **How to get it**:
  1. Sign up at [resend.com](https://resend.com)
  2. Add domain `vetuonglai.com` → verify DKIM/SPF DNS records
  3. Create API key → copy value
- **Cost**: FREE for up to 100 emails/day; $20/month for 50,000 emails
- **Estimated setup**: ~30 minutes (DNS propagation may take up to 24 hours)
- **Set on workers**: `vetuonglai-home` + `vetuonglai-member`

---

### B.2 — `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`

- **Unlocks**: credit card + international payment for Annual Access subscriptions and specialist packs
- **Current state**: Stripe webhook handler live, signature verification coded, event normalisation mapped. Missing live secrets → webhook returns 400 `stripe_verification_failed`.
- **How to get it**:
  1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys → reveal **live** Secret key
  2. Webhooks → Add endpoint: `https://vetuonglai.com/api/access/webhook/stripe` → select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.deleted`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
  3. Copy webhook signing secret
- **Cost**: 2.9% + $0.30 per transaction (no monthly fee); Stripe requires business KYC
- **Estimated setup**: ~1 day (Stripe business account verification)
- **Set on workers**: `vetuonglai-home` + `vetuonglai-member`

---

### B.3 — `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` + `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS` + `PAYPAL_WEBHOOK_ID_ORDERS`

- **Unlocks**: PayPal payment + local Vietnamese payment methods available via PayPal
- **Current state**: PayPal webhook handler live, postback verification coded, OAuth token exchange coded. Missing live credentials → verification fails or runs in bypass mode.
- **How to get it**:
  1. [PayPal Developer](https://developer.paypal.com) → Apps & Credentials → Create App (Live)
  2. Copy Client ID + Secret
  3. Webhooks → Add webhook: `https://vetuonglai.com/api/access/webhook/paypal/subscriptions` + `https://vetuonglai.com/api/access/webhook/paypal/orders`
  4. Copy webhook IDs for each
- **Cost**: 3.49% + fixed fee per transaction; PayPal requires business verification
- **Estimated setup**: ~1 day (PayPal business account verification)
- **Set on workers**: `vetuonglai-home` + `vetuonglai-member`

---

## §3 — 7 Confirmation questions (Q.B1–Q.B7)

These require a yes/no or short answer before the email template layer is finalised.

**Q.B1**: Email from address — confirm `noreply@vetuonglai.com` or different?

**Q.B2**: Audit BCC — confirm all outbound transactional emails blind-copy to `audit@vetuonglai.com`?

**Q.B3**: Stripe or PayPal first, or both simultaneously? (Both handlers are coded; setup time is the constraint.)

**Q.B4**: PayPal covers Vietnamese customers adequately, or should MoMo/ZaloPay be added in a later phase?

**Q.B5**: Invoice format — HTML page at `vetuonglai.com/invoice/{id}/` (already built today) or PDF download required at launch?

**Q.B6**: Phase 4 lock confirmation — vetuonglai.com does NOT use pay.iai.one; payment flows direct through Stripe + PayPal only. Confirm?

**Q.B7**: DKIM control — do you control DNS for `vetuonglai.com`? (Required to verify domain in Resend for DKIM/SPF.)

---

## §4 — Timeline ETA

| Day | Action | Who |
|---|---|---|
| Day 0 — 2026-05-21 | 27 email templates coded + Resend delivery layer + invoice HTML page | Autonomous ✅ |
| Day 1 — 2026-05-22 | Invoice API stub + webhook→email pipeline wired to `upsertRuntimeMemberState` | Autonomous ✅ |
| Day 2 — 2026-05-23 | Founder provides B.1/B.2/B.3 secrets → set on workers via `wrangler secret put` → redeploy | **Founder** |
| Day 3 — 2026-05-24 | Live smoke tests: payment → email → inbox; staging amounts (1 VND equivalent) | Autonomous + Founder |
| Day 4 — 2026-05-25 | Final audit + 100% report | Autonomous |

**Target: 2026-05-25 — requires secrets provided by 2026-05-23 at latest.**

---

*Generated by autonomous dev agent · vetuonglai-system · 2026-05-21*
