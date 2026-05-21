# Team Coordination Briefing — 2026-05-21

> Email + Payment sprint status and handoff checklist.
> Audience: dev lead, Founder, any incoming contributor.

---

## §1 — Status as of 2026-05-21

**Done (code complete, not yet live in production):**
- 26 transactional email templates coded in `notify-runtime.mjs` `DEFAULT_TEMPLATES`
- Resend delivery layer wired into `POST /api/notify/send`
- HTML email wrapper with brand header/footer, mobile-responsive
- Stripe webhook handler (`stripe.charge.succeeded`, `.payment_intent.payment_failed`, `.customer.subscription.*`)
- PayPal webhook handler (capture confirmed, refund, subscription events)
- Webhook→email pipeline: each webhook event calls `notify-runtime` with correct template
- Invoice API route (`GET/POST /api/invoice/*`) + invoice HTML page
- `scripts/smoke-notify.mjs` — 7-case test script (ready to run post-deploy)

**Pending (blocked on Founder-supplied secrets):**
- Set `RESEND_API_KEY` + `RESEND_FROM_EMAIL` on home + member workers
- Verify `vetuonglai.com` domain in Resend dashboard (DKIM + SPF)
- Set Stripe live keys + register webhook URL in Stripe dashboard
- Set PayPal live keys + register webhook URL in PayPal dashboard
- Run smoke tests on production workers
- One real end-to-end test (sign up → welcome email received)

---

## §2 — Team Assignments

### Team A — Email delivery

**Owner:** vetuonglai-system dev

Done:
- 26 templates structured and coded
- Resend API client integrated in `notify-runtime.mjs`
- HTML wrapper with VTL brand header, footer, unsubscribe link
- Audit BCC to `audit@vetuonglai.com` on all sends
- Idempotency check (KV dedup before dispatch)

Pending:
- Founder provides Resend account access or API key
- Dev sets `RESEND_API_KEY` secret on `vetuonglai-home` and `vetuonglai-member` workers via `npx wrangler secret put`
- Dev sets `RESEND_FROM_EMAIL=noreply@vetuonglai.com`
- Verify domain DKIM pass in Resend dashboard (DNS TXT records added by domain owner)
- Confirm outbound email lands in inbox (not spam) with a test send

### Team B — Payment webhooks

**Owner:** vetuonglai-system dev

Done:
- Stripe webhook signature verification + event routing
- PayPal webhook signature verification + event routing
- Webhook→email pipeline: receipt, failure, refund, subscription events all trigger correct templates
- Escrow release to wallet on payment success (via `wallet-runtime.mjs`)

Pending:
- Founder provides Stripe live secret key (`STRIPE_SECRET_KEY`) + webhook secret (`STRIPE_WEBHOOK_SECRET`)
- Dev registers endpoint `https://vetuonglai.com/api/access/webhook/stripe` in Stripe dashboard
- Founder provides PayPal live client ID + secret (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`)
- Dev registers endpoint `https://vetuonglai.com/api/access/webhook/paypal` in PayPal dashboard, notes Webhook ID → sets `PAYPAL_WEBHOOK_ID`
- Run 7-case smoke test after secrets are live

### Team C — System / infra

**Owner:** vetuonglai-system dev

Done:
- Invoice page at `/invoice` on home + member
- Invoice API (`/api/invoice/issue`, `/api/invoice/{id}`)
- `scripts/smoke-notify.mjs` covers: welcome, receipt, failed payment, wallet credit, low balance, invoice issued, membership expiry
- `scripts/smoke-wallet.mjs` already passes locally

Pending:
- Run `node scripts/smoke-notify.mjs` against production after secrets set
- Run `node scripts/smoke-wallet.mjs` against production
- Check Cloudflare Workers tail logs for any 500s after first real payments

---

## §3 — Daily Sync Protocol

Each working day, the dev lead should report:

1. **Unblocked / deployed** — list any secrets set, workers redeployed, or features activated
2. **Error log review** — check Cloudflare Workers logs (`npx wrangler tail vetuonglai-home --env production`) for 4xx/5xx patterns; note any recurring errors
3. **Idempotency check** — confirm no duplicate `notify_message:` KV keys for the same event (spot-check 3 recent entries)
4. **Blockers** — anything that can't progress without Founder action goes into `docs/internal/BLOCKERS_NEED_USER_INPUT.md`

Report format (Slack / async message):
```
Date: YYYY-MM-DD
Deployed: [list or "none"]
Errors: [summary or "clean"]
Idempotency: [ok / flag]
Blockers: [list or "none new"]
```

---

## §4 — Handoff Checklist (before declaring sprint complete)

The lead dev must verify all 10 items before closing the email+payment sprint:

- [ ] 1. `RESEND_API_KEY` set as secret on `vetuonglai-home` and `vetuonglai-member` workers
- [ ] 2. `RESEND_FROM_EMAIL` set to `noreply@vetuonglai.com` on both workers
- [ ] 3. Resend dashboard: domain `vetuonglai.com` verified — DKIM TXT + SPF TXT present and passing
- [ ] 4. `STRIPE_SECRET_KEY` (live mode) set on `vetuonglai-home` and `vetuonglai-member`
- [ ] 5. `STRIPE_WEBHOOK_SECRET` set on both workers; webhook endpoint `https://vetuonglai.com/api/access/webhook/stripe` registered in Stripe dashboard with correct events
- [ ] 6. `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` (live) set on `vetuonglai-home` and `vetuonglai-member`
- [ ] 7. `PAYPAL_WEBHOOK_ID` set; webhook endpoint `https://vetuonglai.com/api/access/webhook/paypal` registered in PayPal dashboard
- [ ] 8. `node scripts/smoke-notify.mjs` passes all 7 assertions on production (exit code 0)
- [ ] 9. `node scripts/smoke-wallet.mjs` passes on production (exit code 0)
- [ ] 10. At least 1 real end-to-end test completed: new account sign-up → magic-link received → login → trigger payment → receipt email received in real inbox (not spam)
