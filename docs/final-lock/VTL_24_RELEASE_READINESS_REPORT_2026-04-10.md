# VTL Release Readiness Report

Version: 1.1
Date: 2026-04-10
Status: ready_with_member_live
Owner: Team 3 (cross-team contract and trust validation)

## Purpose

Provide one-page evidence that Team 1/2/3 integration contracts are machine-readable, version-locked, and live on required public surfaces.

## Current Readiness Snapshot

- Team 1 contract surfaces: ready
- Team 2 contract surfaces: ready
- Team 3 policy and launch-go contract surfaces: ready
- Required live smoke checks: pass
- Remaining runtime-truth governance decision: resolved by Team 1

Integrated progress estimate: `100%` complete for current release scope, with `member.vetuonglai.com` now promoted to required-public after live promote verification.

## Latest Member Promote Update (2026-04-21 17:09 ICT)

- Executed `npm run cloudflare:promote:member`.
- Result: pass.
- Current runtime truth for member:
  - `status: live`
  - `requiredPublic: true`
  - `servingModel: worker_fronted`
- Live smoke evidence after promote:
  - `https://member.vetuonglai.com/api/index.json` -> `200`
  - `https://member.vetuonglai.com/api/contracts.json` -> `200`
  - `https://member.vetuonglai.com/api/team3-policy-matrix.json` -> `200`
- Required public runtime verification:
  - `npm run cloudflare:verify:runtime` -> pass
- Team 3 parity closure:
  - `npm run verify:team3:parity` -> `go`
  - suite `6/6` pass
- Historical sections below are preserved as audit trail for the earlier staged-member period.

## Mobile Non-Payment V1 Snapshot (2026-04-13)

- PWA-first app shell is now generated at `member.vetuonglai.com/app/`.
- Mobile scope is locked to Member + EDU core + VC quick verify entry.
- In-app payment is explicitly disabled (`paymentInAppEnabled=false`).
- Mobile contract endpoints now exist on member domain:
  - `/api/mobile-config.json`
  - `/api/mobile/edu-catalog.json`
  - `/api/mobile/vc-certificates.json`
  - `/api/mobile/session-states.json`
- Local verification passed:
  - `npm run build`
  - `npm run check`
  - `npm run smoke:mobile-pwa`

## Day 1 Verification Refresh (2026-04-14 01:32 ICT)

- Consolidated Day 1 command gate passed:
  - `npm run verify:team-app:day1:full`
- Required public endpoint smoke is green:
  - `npm run cloudflare:smoke:endpoints`
- Runtime truth verification is green for required-public domains:
  - `npm run cloudflare:verify:runtime`
- Member host remains staged and optional:
  - `status: staged_public`
  - `requiredPublic: false`
- Remaining blocker for final member promotion:
  - Ops must complete secret + DNS cutover before `npm run cloudflare:promote:member`

## Member Promote Attempt Refresh (2026-04-14 01:49 ICT)

- Executed `npm run cloudflare:promote:member`.
- Result: failed-safe at strict member deploy gate (no runtime-truth flip).
- Blocker remains unchanged: required secrets missing on `vetuonglai-member`:
  - `SESSION_COOKIE_SECRET`
  - `MAGIC_LINK_SIGNING_KEY`
  - `PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`
  - `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`
  - `PAYPAL_WEBHOOK_ID_ORDERS`
  - `STRIPE_WEBHOOK_SECRET`

## Live Required Endpoints (Green)

- `https://vetuonglai.com/api/index.json`
- `https://vetuonglai.com/api/contracts.json`
- `https://vetuonglai.com/api/purchase-hub.json`
- `https://vetuonglai.com/api/team2-kickoff-output.json`
- `https://vetuonglai.com/api/policy/team3-matrix.json`
- `https://vc.vetuonglai.com/api/certificates.json`
- `https://edu.vetuonglai.com/api/health`

## Contract Compatibility Lock

- `purchase-hub.version` is the base compatibility version.
- `team2-kickoff-output.contractVersion` equals `purchase-hub.version`.
- `team3-policy-matrix.contractVersion` equals `purchase-hub.version`.
- Hub and member `api/contracts.json` are generated from the same contract manifest builder.
- Hub and member `api/index.json` expose `/api/contracts.json`.

## Validation Commands and Result

```bash
npm run build
npm run check
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run cloudflare:deploy:workers:strict -- --worker member
npm run cloudflare:promote:member
```

Result at latest run (`2026-04-10 14:28 ICT`):

- build: pass
- check: pass
- smoke-access-runtime: pass
- smoke-endpoints: pass for all required endpoints
- member smoke endpoints remain optional and currently unresolved in public DNS, which is consistent with `requiredPublic: false`
- dedicated member worker deployment: `vetuonglai-member` deployed successfully on Cloudflare
- current member worker version evidence: `ef528302-8e19-46ef-9ccf-e7756df02e8b`
- direct DNS check (`dig +short member.vetuonglai.com`): no public answer
- direct HTTP check (`curl -I https://member.vetuonglai.com/api/index.json`): host cannot be resolved
- strict secret readiness check for `vetuonglai-member`: failed (required secrets missing)
  - missing: `SESSION_COOKIE_SECRET`, `MAGIC_LINK_SIGNING_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`, `PAYPAL_WEBHOOK_ID_ORDERS`, `STRIPE_WEBHOOK_SECRET`
- direct worker secret listing check:
  - `wrangler secret list --name vetuonglai-member --format json`
  - current output: `[]`
  - `wrangler secret list --name vetuonglai-home --format json`
  - current output: `[]`
- one-command promotion check:
  - `npm run cloudflare:promote:member` executed
  - result: failed-safe at strict deploy (no runtime-truth flip), which is expected until secrets are present

## Governance Decision Closed

- Decision owner: Team 1
- Decision: keep `member.vetuonglai.com` in `cloudflare/domain-runtime-truth.json` as:
  - `status: live`
  - `requiredPublic: true`
- Reason:
  - strict member deploy passed through the promote pipeline
  - public member endpoint reachability is proven by smoke
  - runtime verification for required public domains is green
  - Team 3 parity no longer sees an open stop-line for member cutover

## Handoff Recommendation

- Release can proceed with current required-public scope, including `member.vetuonglai.com`.
- Remaining coordination steps are now:
  - QA/PM ký nhận founder lane theo evidence production và parity cuối
  - Team 2 dọn cleanup/handoff debt còn lại ở UI founder shell nếu vẫn giữ ownership surface
