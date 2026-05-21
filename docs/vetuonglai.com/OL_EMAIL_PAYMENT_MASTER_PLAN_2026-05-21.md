# OL Email + Payment Master Plan — 2026-05-21

> Scope: vetuonglai.com email delivery architecture + payment webhook→email pipeline.
> This document is the single authoritative reference for the email/payment sprint.

---

## §1 — System Overview

Three email channels serve vetuonglai.com:

**Channel A — Form submission**
- Endpoint: `POST /api/email/forms/submit`
- Transport: SMTP via mail.iai.one (`MAIL_API_KEY`)
- Purpose: Contact forms, feedback, general enquiries
- Status: ✅ LIVE (smoke-tested 2026-05-20)

**Channel B — Magic-link authentication**
- Endpoint: `POST /api/access/session/magic-link/send`
- Transport: SMTP via mail.iai.one (`MAIL_API_KEY`)
- Purpose: Passwordless login for member + home
- Status: ✅ LIVE (smoke-tested 2026-05-20)

**Channel C — Transactional notifications**
- Endpoint: `POST /api/notify/send`
- Transport: Resend API (`RESEND_API_KEY`)
- Purpose: Welcome, payment receipts, wallet credits, invoices, membership updates
- Status: ⏳ Code complete 2026-05-21 — awaiting `RESEND_API_KEY` from Founder

All three channels enforce idempotency via unique notification IDs stored in KV (`notify_message:` prefix). Duplicate sends are blocked at the runtime layer.

---

## §2 — Tenant Matrix

| Worker | Key | Channel A | Channel B | Channel C |
|--------|-----|-----------|-----------|-----------|
| vetuonglai-home | home | ✅ | ✅ | ✅ (needs `RESEND_API_KEY`) |
| vetuonglai-member | member | ✅ | ✅ | ✅ (needs `RESEND_API_KEY`) |
| vetuonglai-vc | vc | ❌ | ❌ | ✅ wallet events (needs `RESEND_API_KEY`) |
| vetuonglai-edu-github | edu | ❌ | ❌ | ✅ if `RESEND_API_KEY` set |
| vetuonglai-green | green | ❌ | ❌ | ✅ if `RESEND_API_KEY` set |
| vetuonglai-finance | finance | ❌ | ❌ | ✅ if `RESEND_API_KEY` set |
| vetuonglai-kids | kids | ❌ | ❌ | ✅ if `RESEND_API_KEY` set |

Channel A + B are only meaningful on workers that serve user-facing forms and auth flows (home, member). VC, edu, green, finance, kids have no login/form handlers.

---

## §3 — 26-Template Taxonomy

Full copy in `EMAIL_TEMPLATES_COPY_SPEC_2026-05-21.md`. Groups and slugs:

**Auth (3)**
- `auth.magic_link` — passwordless login link
- `auth.welcome` — account created confirmation
- `auth.session_revoked` — security: session ended

**Wallet (5)**
- `wallet.credit` — tokens credited to wallet
- `wallet.debit` — tokens debited from wallet
- `wallet.address_issued` — new `vtl1…` address assigned
- `wallet.low_balance` — balance below threshold alert
- `wallet.transfer_received` — peer transfer confirmation

**Payment (7)**
- `payment.receipt_stripe` — Stripe charge succeeded
- `payment.receipt_paypal` — PayPal capture confirmed
- `payment.failed` — payment failure notification
- `payment.refund_issued` — refund processed
- `payment.subscription_activated` — recurring plan started
- `payment.subscription_cancelled` — plan cancelled
- `payment.subscription_renewal` — upcoming renewal reminder

**Invoice (3)**
- `invoice.issued` — invoice ready to view
- `invoice.paid` — invoice marked paid
- `invoice.overdue` — payment overdue reminder

**Membership (4)**
- `membership.tier_upgraded` — tier promotion
- `membership.tier_downgraded` — tier change down
- `membership.expiry_warning` — expiry approaching
- `membership.expired` — membership lapsed

**System / Admin (4)**
- `system.contact_form_ack` — form submission acknowledgement to sender
- `system.contact_form_notify` — form submission alert to team
- `system.kyc_approved` — KYC verification passed
- `system.kyc_rejected` — KYC verification failed

---

## §4 — Sprint Map

| # | Sprint | Owner | Status |
|---|--------|-------|--------|
| 1 | Email form + magic-link (Channel A + B) | dev | ✅ DONE 2026-05-20 |
| 2 | Wallet runtime + notify KV inbox | dev | ✅ DONE 2026-05-16 |
| 3 | 26 templates coded in `DEFAULT_TEMPLATES` | dev | ✅ DONE 2026-05-21 |
| 4 | Resend delivery layer (`notify-runtime.mjs`) | dev | ✅ DONE 2026-05-21 |
| 5 | Webhook→email pipeline Stripe + PayPal | dev | ✅ DONE 2026-05-21 |
| 6 | Invoice API + invoice page | dev | ✅ DONE 2026-05-21 |
| 7 | Live activation | Founder + dev | ⏳ Needs `RESEND_API_KEY`, Stripe live key, PayPal live key |
| 8 | Smoke tests prod + final audit | dev | ⏳ After Sprint 7 |

Sprint 7 is the only remaining blocker before the email+payment system is fully operational in production.

---

## §5 — Governance

**Payment provider policy**
pay.iai.one Phase 4 lock is respected: vetuonglai.com uses **Stripe** and **PayPal direct** only. No intermediary payment aggregators. No revenue-sharing or commission language in templates.

**Prohibited content in templates**
- No "guaranteed income", "cam kết 100%", "đột phá"
- No "tax-deductible" claims
- No countdown timers or artificial scarcity language
- Finance-adjacent templates must include: "Không phải lời khuyên tài chính."

**Sender identity**
- From: `noreply@vetuonglai.com`
- Domain must be DKIM + SPF verified in Resend dashboard before activation
- Reply-To: `support@vetuonglai.com` on receipts and membership templates

**Audit trail**
- BCC: `audit@vetuonglai.com` on all outbound transactional email
- Every send logged to KV under `notify_message:{id}` with timestamp, recipient hash, template slug
- Retention: 90 days in KV (auto-expiry via KV TTL)

**Idempotency**
- Every `POST /api/notify/send` requires a caller-supplied `id` field
- Runtime checks `notify_message:{id}` in KV before dispatch
- Duplicate detected → return 200 with `{"duplicate": true}` — no re-send
- Callers (webhook handlers, access-runtime) generate IDs as `{event_type}:{entity_id}:{epoch_day}` to ensure one send per event per day

**Security**
- All `{variable}` substitutions are HTML-escaped before template render
- No raw user input passed to email subject or body without sanitisation
- Webhook secrets (`STRIPE_WEBHOOK_SECRET`, `PAYPAL_WEBHOOK_ID`) validated before processing
