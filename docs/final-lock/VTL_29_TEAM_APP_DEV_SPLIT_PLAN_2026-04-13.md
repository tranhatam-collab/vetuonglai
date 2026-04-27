# VTL TEAM APP DEV SPLIT PLAN

Version: 1.0
Date: 2026-04-13
Status: locked-for-execution
Owner: Founder + Team 1 + Team 2 + Team 3 + Ops

## Purpose

Provide one execution file to:

1. update current `TEAM APP` status
2. split non-payment + mobile V1 work into clear dev ownership
3. define release gates until mobile app is live

Payment scope is explicitly deferred.

## TEAM APP Status Snapshot (2026-04-13 23:08 ICT)

| Team App lane | Main owner | Current status | Blocker | Immediate next step |
| --- | --- | --- | --- | --- |
| App Platform Runtime | Team 1 | in_progress | Ops cutover member secrets + DNS | rerun `npm run cloudflare:promote:member` when Ops confirms prerequisites |
| App Experience (Web + Mobile PWA) | Team 2 | handoff_ready | waiting final member required-public cutover | full regression `DPM-001..DPM-021` after Team 1 promotion |
| App Trust + Launch Governance | Team 3 | handoff_ready | waiting final runtime parity after cutover | launch-go parity recheck and closure report |
| Ops Cutover Cell | Ops + Founder | blocked | real secret values and DNS finalization | inject 7 secrets and complete `member.vetuonglai.com` public reachability |

## Scope Lock (Non-Payment + Mobile V1)

### In scope

- member domain cutover and runtime truth alignment
- access runtime persistence with KV-ready mode
- mobile PWA shell on `member.vetuonglai.com/app/`
- Member + EDU core + VC quick verify mobile flows
- telemetry baseline and mobile QA matrix

### Out of scope

- checkout/payment implementation
- App Store/Play Store native app packaging
- pricing and product model changes

## Team App Org Split (Execution Ownership)

### Squad A: Runtime and Access (Team 1 Core)

Owns:

- `workers/lib/access-runtime.mjs`
- access runtime persistence mode and contract endpoints
- member required-public promotion path

Must complete:

1. finish ops-assisted member cutover (`secrets + DNS + promote`)
2. keep smoke-green:
   - `/api/access/provider-status.json`
   - `/api/access/policy-bindings.json`
   - `/api/access/routing-contract.json`
3. lock persistence to KV in production where binding exists (`ACCESS_KV_NAMESPACE`)

Done definition:

- member host reachable publicly
- runtime truth matches live behavior
- no session/audit state loss from memory-only fallback in production

### Squad B: App UX and Mobile PWA (Team 2 Core)

Owns:

- `/app/` shell UX and mobile navigation
- responsive behavior for hub/member/edu/vc surfaces
- CTA/deep-link/disclosure render contract

Must complete:

1. freeze current non-payment UI scope (no new feature drift)
2. rerun and close regression pack `DPM-001..DPM-021`
3. verify mobile-first routes:
   - dashboard state display
   - EDU list/detail/lesson flow
   - VC quick verify open flow
4. ensure commerce CTA routes to homepage hub only (no in-app checkout)

Done definition:

- no broken CTA/deep-link/disclosure cases
- mobile interaction stable on required viewport and browser matrix

### Squad C: Trust, Compliance, and Launch-Go (Team 3 Core)

Owns:

- trust/disclosure parity checks
- policy/runtime drift prevention gates
- launch-go non-payment decision log

Must complete:

1. validate post-cutover parity for runtime + policy bindings
2. lock event vocabulary and audit fields without drift
3. publish go/no-go recommendation with evidence

Done definition:

- policy and copy parity pass
- launch report moved to closure state for this scope

### Squad D: Ops Cutover and Release Control (Ops + Founder)

Owns:

- secret source-of-truth and injection
- DNS/custom-domain readiness
- release window confirmation and rollback ownership

Must complete:

1. inject all 7 required member runtime secrets
2. complete DNS/custom-domain for `member.vetuonglai.com`
3. confirm cutover window and rollback contact

Done definition:

- Team 1 can finish promotion with no manual workaround

## 4-Sprint Delivery Plan (Execution Sequence)

### Sprint 1: Unblock and Foundation

- Squad D completes secret + DNS prerequisites
- Squad A executes member promotion and runtime truth alignment
- Squad B keeps PWA shell baseline stable
- Squad C prepares parity checklist for cutover validation

Exit gate:

- member required-public promotion command completes successfully

### Sprint 2: Auth and Dashboard Hardening

- Squad A: session/runtime stability monitoring
- Squad B: mobile auth/session mapping and route guards by member state
- Squad C: disclosure and trust parity on dashboard/session surfaces

Exit gate:

- login/session flow stable for `visitor`, `pending_member`, `annual_active`, `pack_owner`

### Sprint 3: EDU Core + VC Verify Completion

- Squad B completes EDU list/detail/player and VC quick verify mobile flow
- Squad A verifies contract endpoint stability for mobile consumers
- Squad C validates event vocabulary and launch evidence integrity

Exit gate:

- EDU + VC flows pass mobile regression and telemetry assertions

### Sprint 4: Release Hardening and Go-Live

- all squads run final command gates
- execute full device/browser matrix
- finalize runbook, rollback, and founder sign-off evidence

Exit gate:

- go-live checklist passes with zero critical blocker

## Command Ownership Matrix

| Command | Primary owner | Backup owner | Release gate |
| --- | --- | --- | --- |
| `npm run build` | Squad B | Squad A | required |
| `npm run check` | Squad B | Squad C | required |
| `npm run smoke:access-runtime` | Squad A | Squad C | required |
| `npm run smoke:mobile-pwa` | Squad B | Squad C | required |
| `npm run cloudflare:smoke:endpoints` | Squad A | Squad D | required |
| `npm run cloudflare:promote:member` | Squad A | Squad D | required before go-live |
| `npm run cloudflare:verify:runtime` | Squad A | Squad C | required before go-live |

## Mobile V1 Done Criteria

All conditions must be true:

1. user can log in and maintain session in mobile PWA
2. dashboard renders correct member state
3. EDU core can open and continue lessons
4. VC quick verify entry works on mobile
5. app has no payment processing; commerce CTA routes to `vetuonglai.com`
6. required smoke and contract gates are pass

## Reporting Protocol

Every squad updates these files in the launch window:

- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/final-lock/VTL_24_RELEASE_READINESS_REPORT_2026-04-10.md`

Daily cadence:

- `09:00 ICT` start update
- `13:30 ICT` blocker-only update
- `18:00 ICT` close-day update

## Final Rule

If there is any conflict between team assumptions and runtime behavior:

1. follow this Team App split plan
2. verify against runtime truth and smoke evidence
3. block release until mismatch is resolved
