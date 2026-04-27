# 00 CORRECTION NOTICE FOR DEV TEAM

Date: 2026-04-10  
Updated: 2026-04-10 (post-deploy reconciliation)  
Status: effective immediately  
Owner: Founder directive, executed by Team 1 core runtime

## Why this correction exists

Public surface was ahead of runtime truth in 4 critical layers: language rendering, status consistency, nav promises, pricing/gating order.  
This notice is now reconciled against code + deployed runtime and is the mandatory baseline before any new public feature work.

## Locked correction scope (P0)

1. `?lang=vi|en` must render one clean language state per request path.
2. Primary nav excludes unresolved domains (`member`, `work`, `market`) from destination-level navigation.
3. One shared status source is mandatory: `system-registry`.
4. Homepage pricing for `Future Access Pass` is locked to:
   - year 1: `3 USD`
   - year 2+: `99 USD/year`
5. Public homepage must not expose high-commission package ladder copy.

## Reconciliation matrix (as of 2026-04-10)

| P0 item | State | Evidence |
|---|---|---|
| Language clean render | ✅ Done | `scripts/build.mjs` switched to `data-text-*` / `data-html-*`; `src/shared/app.js` syncs one-language render; check gate rejects `data-lang` inline on public pages |
| Primary nav correction | ✅ Done | Hub nav now: Hub, EDU, VC, LIFE, FIN, INVEST, GREEN |
| Shared status source | ✅ Done | New registry file and API: `/api/system-registry.json` on hub + member |
| Pricing correction | ✅ Done | `annualAccess.billingCycles` now `3,99`; runtime check enforces `3,99` |
| Public commission ladder removal | ✅ Done | Homepage package chooser removed affiliate percentage column |
| Homepage ordering (explain first, gateway later) | ✅ Done | Section order now: problems → vision → ecosystem → journey → demo → pass → stories/trust |

## Source-of-truth endpoints

- `https://vetuonglai.com/api/system-registry.json`
- `https://member.vetuonglai.com/api/system-registry.json`
- `https://vetuonglai.com/api/official-docs-lock.json`
- `https://member.vetuonglai.com/api/official-docs-lock.json`

All teams must consume these endpoints before rendering status, pricing, or copy promises.

## Homepage ordering rule (locked)

1. Hero
2. Real problems
3. Vision
4. Ecosystem map
5. Journey entry
6. Demo value
7. Future Access Pass
8. Stories + trust

## Gating and payment rules remain locked

- `Future Access Pass` uses subscription flow (PayPal/Stripe supported).
- `Specialist packs` remain one-time products.
- `candidate_email` must be captured before checkout.
- Provisioning must occur only after verified webhook.
- Magic link is identity only; entitlement is backend-owned.

## Deployment + verification snapshot

- Cloudflare Pages deploy: ✅ complete for hub + vc + edu + green + finance + life + invest.
- Home worker deploy: ✅ complete (`Current Version ID: b90f8404-8132-471f-83b6-c4f71e8214e5`).
- Required endpoint smoke: ✅ pass (`cloudflare:smoke:endpoints`).
- Access runtime smoke: ✅ pass (`smoke:access-runtime`).

## Remaining blockers (not in P0 scope)

1. Strict worker deploy is still blocked by missing required secrets on `vetuonglai-home` and `vetuonglai-member`:
   - `SESSION_COOKIE_SECRET`
   - `MAGIC_LINK_SIGNING_KEY`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`
   - `PAYPAL_WEBHOOK_ID_ORDERS`
   - `STRIPE_WEBHOOK_SECRET`
2. Member domain remains optional public surface until DNS/custom-domain + strict secret readiness are complete.

## Team execution policy

- Stop adding new public features until strict worker readiness is green.
- Any copy/status/pricing drift between docs/runtime must be surfaced in `official-docs-lock.json`.
- Team 2 and Team 3 must consume `system-registry` + `official-docs-lock` before publishing any public changes.
