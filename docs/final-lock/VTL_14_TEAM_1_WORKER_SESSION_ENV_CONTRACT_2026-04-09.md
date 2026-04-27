# VTL TEAM 1 WORKER SESSION ENV CONTRACT

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: in execution
Owner: Team 1 — Platform, Access, Commerce Core

## Purpose

This file documents the first runtime contract now exposed by the Team 1 worker layer.

## Live Contract Routes in Worker

Read routes:

- `/api/access/health`
- `/api/access/env-contract.json`
- `/api/access/session-contract.json`
- `/api/access/provisioning-contract.json`
- `/api/access/dependencies.json`
- `/api/access/checkout-contract.json`
- `/api/access/routing-contract.json`
- `/api/access/policy-bindings.json`
- `/api/access/provider-status.json`
- `GET /api/access/session/consume`
- `GET /api/access/session/current`

Write routes:

- `POST /api/access/route/normalize`
- `POST /api/access/checkout/resolve`
- `POST /api/access/session/magic-link/request`
- `POST /api/access/session/logout`
- `POST /api/access/webhooks/paypal/subscriptions`
- `POST /api/access/webhooks/paypal/orders`
- `POST /api/access/webhooks/stripe`

## Current Behavior

- `GET` routes return the locked runtime contract as JSON
- route normalization is now available as a machine-readable runtime step, not only as a doc promise
- `POST` routes now parse JSON payloads, normalize events, and enforce Team 1 plus Team 3 guardrails
- accepted payloads return `202` with a normalized provisioning or session decision
- invalid or blocked payloads return `4xx` with a machine-readable reason
- magic-link requests now create a pending-member record and a signed one-time token
- session consume now exchanges that token for a signed `vtl_session` cookie
- session current reads the cookie and resolves the stored session record
- webhook routes now store normalized decisions and ignore duplicate events
- checkout resolve now supports dual-gateway routing:
  - PayPal hosted/runtime checkout URLs
  - Stripe hosted checkout URLs already configured outside the site
- Team 2 compatibility is now locked in runtime:
  - legacy Team 2 intent aliases normalize to canonical Team 1 intents
  - `source` and `slug` are accepted as trace metadata
  - invalid raw specialist pack keys fall back to `g1` with warning
  - missing gateway is allowed at deep-CTA stage but still required at checkout resolve
- Team 3 policy binding is now exposed directly from runtime:
  - `GET /api/access/policy-bindings.json`
  - includes consumed identity states
  - includes required normalized events and policy-to-runtime event mapping
  - includes no-drift assertions and required runtime outputs for compliance/audit
- provider status now exposes machine-readable readiness for:
  - session secrets
  - persistence mode
  - PayPal annual and pack readiness
  - Stripe annual and pack readiness
  - Cloudflare target path currently serving the access runtime
  - member-worker topology and current `requiredPublic` decision for `member.vetuonglai.com`
- Stripe webhook verification now supports:
  - `bypass` for local and non-production smoke/dev use
  - `signature` for production-style verification using `Stripe-Signature`
- webhook verification now has two explicit modes:
  - `bypass` for local and non-production smoke/dev use
  - `postback` for production-style verification against PayPal
- postback verification now uses:
  - `PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`
  - route-specific webhook ID
  - raw webhook body passed back to PayPal verification as received
- runtime health now exposes verification mode/environment and persistence mode
- the runtime contract is currently wired through [generic-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/generic-worker.mjs), so the active exposure today is the homepage worker
- the same host filter already reserves `member.vetuonglai.com` and `www.member.vetuonglai.com`
- Team 1 now runs a dedicated worker target for member:
  - script: `vetuonglai-member`
  - assets: `dist/member.vetuonglai.com`
  - runtime-truth status: `live`
  - `requiredPublic`: `true` after successful promote on `2026-04-21`
- Team 1 also added an inspect utility for live ops:
  - `npm run cloudflare:inspect:member`
  - current known result: `https://member.vetuonglai.com/api/index.json` is reachable and public runtime verification is green
- Team 1 deploy script now supports secret-readiness enforcement:
  - `npm run cloudflare:deploy:workers:strict`
  - per-worker strict deploy can be run with:
    - `node scripts/deploy-workers.mjs --worker member --strict-secrets`
  - current known result for `vetuonglai-member`: strict deploy + promote flow have passed in the latest release cycle
- Team 1 now provides one-command member promotion after Ops prerequisites are ready:
  - `npm run cloudflare:promote:member`
  - pipeline: build -> check -> strict member deploy -> endpoint smoke -> member endpoint reachability -> runtime-truth flip -> runtime verify
  - promotion remains fail-safe and is the only allowed path to change `requiredPublic`

## What Team 2 Can Use Now

- session cookie name
- required session claims
- safe route parameter names
- canonical webhook endpoint paths
- checkout resolver path and gateway keys `paypal` / `stripe`
- routing contract path and route-normalize path for Team 2 surface integration
- provider readiness route for ops and deployment verification
- one-time magic-link consume path
- session current and logout paths

## What Team 3 Can Use Now

- required environment variables
- normalized event names
- provisioning and revocation triggers
- the fact that annual access and pack provisioning stay separate
- dedupe semantics for webhook events
- compliance and affiliate decisions written into runtime responses
- verification mode and verification status surfaced in webhook responses
- dual-gateway checkout policy still locked to homepage purchase hub
- policy binding route proving Team 1 is consuming Team 3 fields without renaming policy keys

## Team 1 Dependency Now Linked

The Team 1 runtime contract now declares the Team 3 dependency explicitly:

- discovery: `https://member.vetuonglai.com/api/index.json`
- contract: `https://member.vetuonglai.com/api/team3-policy-matrix.json`

This is surfaced from:

- `GET /api/access/dependencies.json`

## What Is Still Missing

- full self-cryptographic verification for PayPal simulator/mock events
- guaranteed KV or database-backed persistence in production
- email transport for delivering magic links without debug exposure
- durable provisioning writes into the final member system of record
