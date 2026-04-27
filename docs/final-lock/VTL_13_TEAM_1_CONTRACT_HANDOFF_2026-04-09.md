# VTL TEAM 1 CONTRACT HANDOFF

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: in execution
Owner: Team 1 — Platform, Access, Commerce Core

## Purpose

This is the first Team 1 handoff after the kickoff lock.

It turns the planning rules into machine-readable contracts so Team 2 and Team 3 can integrate without guessing.

## Source of Truth

- Data source: `src/data/access-model.json`
- Member contract API: `member.vetuonglai.com/api/access-model.json`
- Member entitlement API: `member.vetuonglai.com/api/entitlements.json`
- Member events API: `member.vetuonglai.com/api/events.json`
- Member routing API: `member.vetuonglai.com/api/routing.json`
- Team 3 policy API: `member.vetuonglai.com/api/team3-policy-matrix.json`
- Hub purchase API: `vetuonglai.com/api/purchase-hub.json`
- Runtime checkout contract: `GET /api/access/checkout-contract.json`
- Runtime checkout resolver: `POST /api/access/checkout/resolve`

## Locked Team 1 Outputs

### Identity states

- `visitor`
- `pending_member`
- `annual_active`
- `pack_owner`
- `program_user`
- `partner`

### Commerce split

- annual access uses `PayPal Subscriptions`
- annual access also supports `Stripe Checkout Subscription`
- specialist packs use `PayPal Orders`
- specialist packs also support `Stripe Checkout Payment`
- provisioning only happens after valid webhook confirmation

### Route contract

Canonical destination:

- `https://vetuonglai.com/`

Fallback:

- `https://vetuonglai.com/bat-dau/`

Canonical query parameters:

- `entry`
- `pack`
- `intent`
- `source`
- `slug`
- `gateway`
- `lang`
- `ref`
- `return_to`

### Required normalized events

- `annual.subscription.activated`
- `annual.subscription.renewed`
- `annual.subscription.past_due`
- `annual.subscription.cancelled`
- `pack.order.captured`
- `pack.order.refunded`

Additional provider signals now locked:

- `STRIPE_CHECKOUT_SESSION_COMPLETED_SUBSCRIPTION`
- `STRIPE_INVOICE_PAID`
- `STRIPE_INVOICE_PAYMENT_FAILED`
- `STRIPE_CUSTOMER_SUBSCRIPTION_DELETED`
- `STRIPE_CHECKOUT_SESSION_COMPLETED_PAYMENT`
- `STRIPE_CHARGE_REFUNDED`

### Team 1 dependency on Team 3

Team 1 now consumes Team 3 policy via:

- discovery: `https://member.vetuonglai.com/api/index.json`
- contract: `https://member.vetuonglai.com/api/team3-policy-matrix.json`

Fields Team 1 must respect:

- homepage purchase-hub guardrail
- affiliate disabled at annual-only layer
- compliance-pass requirements
- disclosure requirements
- required reporting events
- launch-gate checks

## Handoff to Team 2

Team 2 should consume:

- homepage purchase-hub path and fallback
- route parameter names
- gateway keys `paypal` and `stripe`
- pack keys `g1` through `g9`
- annual pricing cycles `9 / 66 / 99`

Team 2 should not invent:

- new pack IDs
- subdomain-local checkout URLs
- alternate query parameter names

## Handoff to Team 3

Team 3 should consume:

- identity state names
- webhook event names
- pack keys and affiliate percent fields
- the rule that affiliate remains off for annual-only members
- the rule that Stripe and PayPal normalize into the same annual/pack event vocabulary

Team 3 should not invent:

- different event names for the same lifecycle
- affiliate eligibility at the public or annual-only layer

## Current Limitation

This handoff locks the contract and exposes static APIs for integration.
The Team 1 worker layer now also enforces the contract shape and the Team 3 policy dependency on runtime POST routes.

It does not yet include:

- live payment provider credentials
- guaranteed durable storage in every environment
- external email transport for magic-link delivery
- final provisioning writes to the long-term member system of record

## Runtime Progress Since This Handoff

The worker layer now also supports:

- pending-member storage through memory mode or `ACCESS_KV_NAMESPACE`
- signed debug magic-link issuance
- one-time magic-link consumption into a signed `vtl_session`
- session introspection at `GET /api/access/session/current`
- session clearing at `POST /api/access/session/logout`
- webhook dedupe storage keyed by normalized event plus event id
- explicit PayPal verification modes:
  - `bypass` for local/non-production runtime
  - `postback` for production-style verification through PayPal
- explicit Stripe verification modes:
  - `bypass` for local/non-production runtime
  - `signature` for production-style verification through `Stripe-Signature`
- route-specific webhook verification using:
  - `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`
  - `PAYPAL_WEBHOOK_ID_ORDERS`
- raw-body postback verification requests so webhook payload formatting is preserved
- Team 2 compatibility locks in runtime:
  - legacy Team 2 intent aliases normalize to canonical Team 1 intents
  - `source` and `slug` are preserved as trace metadata
  - invalid raw pack keys fall back to `g1` with warning
- homepage/subdomain checkout resolution through one runtime path:
  - `POST /api/access/checkout/resolve`
- route normalization and parser contract routes:
  - `GET /api/access/routing-contract.json`
  - `POST /api/access/route/normalize`
- Team 3 policy binding route:
  - `GET /api/access/policy-bindings.json`
- a runnable smoke script at [smoke-access-runtime.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/smoke-access-runtime.mjs)
