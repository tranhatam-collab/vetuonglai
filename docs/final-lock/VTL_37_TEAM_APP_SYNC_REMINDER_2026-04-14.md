# VTL TEAM APP SYNC REMINDER

Version: 1.0
Date: 2026-04-14
Status: active
Owner: Team App Lead

## Why this note exists

This note is a short cross-team reminder after the latest local hardening pass so Team 1, Team 2, Team 3, and Ops finish the current cycle together instead of closing isolated lanes.

## Current shared facts

- local gates are green:
  - `npm run build`
  - `npm run check`
  - `npm run smoke:access-runtime`
  - `npm run smoke:mobile-pwa`
- mobile app shell is now wired to:
  - `mobile-config`
  - `routing-contract`
  - `session-states`
  - `team3-policy-matrix`
- payment remains out of scope
- member public cutover is still blocked by:
  - missing member runtime secrets
  - missing public DNS/custom-domain readiness

## Reminder by team

### Team 1

Please finish the runtime lane only after Ops clears the blocker:

1. rerun `npm run cloudflare:promote:member`
2. publish fresh evidence for:
   - `provider-status`
   - `policy-bindings`
   - `routing-contract`
3. confirm persistence mode does not regress when `ACCESS_KV_NAMESPACE` is present

Do not treat local smoke-green as final closure until public member promotion is complete.

### Team 2

Please close the mobile UX lane with evidence, not assumptions:

1. validate `visitor`, `pending_member`, `annual_active`, `pack_owner` on mobile
2. rerun and close `DPM-001..DPM-021`
3. verify EDU list/detail/lesson and VC quick verify flow on required devices
4. confirm every commerce CTA still routes to `vetuonglai.com` only

Do not reopen payment scope or add fresh UI drift during this cycle.

### Team 3

Please stay attached to the live surfaces and runtime evidence:

1. verify app-shell and dashboard trust copy after the latest Team 2 hardening
2. confirm event vocabulary and audit fields remain non-drift
3. rerun parity checks immediately after Team 1 promotion
4. publish the go/no-go note with explicit evidence, not generic confidence language

Do not close governance until post-cutover parity is rechecked on the real promoted path.

### Ops + Founder

Please unblock the rest of the system in the smallest possible move:

1. inject the 7 required secrets for `vetuonglai-member`
2. finalize DNS/custom-domain for `member.vetuonglai.com`
3. confirm rollback owner and release window once Team 1 can rerun promotion

## Finish-together rule

No squad should declare final closure alone.

The intended same-cycle finish order is:

1. Ops clears secrets + DNS
2. Team 1 reruns member promotion and runtime verification
3. Team 2 reruns mobile QA and CTA/deep-link checks on promoted surfaces
4. Team 3 reruns parity/governance checks and publishes recommendation
5. Team App Lead closes the board only after all four updates are linked

## Gentle reminder

We are already past the hard part of contract guessing.
What remains is disciplined closure:

- Team 1 keeps runtime real
- Team 2 keeps mobile honest
- Team 3 keeps trust true
- Ops makes the path live

Please finish this round together, not sequentially with stale assumptions.
