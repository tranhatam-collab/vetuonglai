# VTL MOBILE APP LIVE MASTER PLAN

Version: 1.0
Date: 2026-04-13
Status: locked-for-execution
Owner: Founder + Team 1 + Team 2 + Team 3 + Ops

## Purpose

Provide one complete execution plan to move Vetuonglai mobile app from current PWA implementation to stable production live operation.

This file is execution-focused:

- what each team must deliver
- what must be verified
- what blocks release
- how to rollback safely

## Live Target Definition

Mobile app live in this phase means:

- PWA-first app is publicly reachable at `https://member.vetuonglai.com/app/`
- app is installable on iOS Safari and Android Chrome
- app supports Member + EDU core + VC quick verify entry
- app does not contain in-app payment
- all commerce paths route back to homepage purchase hub (`vetuonglai.com`)

## Scope Lock

### In scope

- app shell and offline fallback
- session and member-state rendering
- EDU catalog/deep links
- VC quick verify links
- telemetry baseline
- mobile QA and release runbook

### Out of scope

- in-app payment
- App Store / Play Store native packaging
- new domain launches
- pricing model changes

## Release Success Criteria

All criteria below must be true for release:

1. member domain is publicly reachable and stable
2. required secrets are injected for member runtime
3. runtime truth and public behavior are aligned
4. mobile QA matrix is pass
5. smoke and contract checks are pass
6. no policy/disclosure drift between Team 1/2/3 outputs

## Team Workstreams

### Team 1 — Platform / Runtime

- keep KV-ready persistence active for access runtime (`ACCESS_KV_NAMESPACE`)
- keep these endpoints stable:
  - `/api/access/provider-status.json`
  - `/api/access/policy-bindings.json`
  - `/api/access/routing-contract.json`
- complete member cutover path with strict gate:
  - `npm run cloudflare:promote:member`
- publish final evidence into readiness and sync reports

Done for Team 1:

- strict deploy pass
- member runtime reachable
- runtime truth promotion completed without drift

### Team 2 — Mobile UX / Frontend

- maintain mobile-first behavior for app shell routes:
  - `/app/`
  - `/app/offline/`
- ensure no in-app checkout controls appear in app shell
- keep deep-link and disclosure compatibility with `DPM-001..DPM-021`
- keep telemetry hooks active in mobile flows

Done for Team 2:

- install flow works
- offline fallback works
- EDU/VC lists render and navigate correctly
- mobile accessibility baseline pass

### Team 3 — Trust / Compliance / Launch Governance

- verify trust copy and disclosure placement on mobile surfaces
- verify telemetry event vocabulary parity for launch-go reporting
- verify no contract drift after Team 1 cutover
- publish final go/no-go recommendation

Done for Team 3:

- launch-go matrix complete
- policy parity check pass
- remaining risk classified as low

### Ops / Founder

- inject required member secrets
- complete DNS/custom-domain readiness for member host
- approve production cutover window
- confirm rollback owner and contact

Done for Ops:

- secrets + DNS + strict deploy + reachability all green

## Execution Timeline

### Phase A — Cutover Prerequisites (2026-04-13 to 2026-04-14)

- Ops sets member secrets
- Ops confirms DNS/custom-domain propagation
- Team 1 reruns strict deploy and promotion flow

Exit gate:

- member endpoint reachable from public network

### Phase B — Mobile Stabilization (2026-04-14 to 2026-04-15)

- Team 2 runs responsive and flow regression
- Team 3 validates policy/disclosure on mobile
- Team 1 monitors runtime contracts and session behavior

Exit gate:

- mobile QA matrix pass across required devices

### Phase C — Launch Verification (2026-04-15)

- full command gate run
- sync report and readiness report updated
- founder sign-off

Exit gate:

- go-live decision approved and logged

### Phase D — Post-Live Guard Window (2026-04-15 to 2026-04-17)

- monitor errors, smoke checks, drift checks
- patch critical issues only
- freeze non-critical scope changes

## Command Gates

### Mandatory local gates

```bash
npm run build
npm run check
npm run smoke:access-runtime
npm run smoke:mobile-pwa
```

### Mandatory production gates

```bash
npm run cloudflare:smoke:endpoints
npm run cloudflare:promote:member
npm run cloudflare:verify:runtime
```

Release must be blocked if any mandatory gate fails.

## Mobile QA Matrix

### Devices / Browsers

- iOS Safari: latest and previous major
- Android Chrome: latest and previous major
- viewport buckets:
  - small: 360x780
  - medium: 390x844
  - large mobile: 430x932

### Scenarios

1. app open and install prompt path
2. language switch VI/EN
3. session check (`visitor`, `pending_member`, `annual_active`, `pack_owner`)
4. EDU list open and lesson start navigation
5. VC quick verify entry open
6. offline fallback route
7. commerce CTA redirects to hub (no checkout in app)

## Telemetry Minimum Contract

Required events:

- `mobile_app_open`
- `mobile_login_success`
- `mobile_edu_lesson_start`
- `mobile_edu_lesson_complete`
- `mobile_vc_verify_open`

Each event must include:

- timestamp
- route/screen
- language
- member state (if available)

## Rollback Plan

If live quality fails:

1. keep runtime truth unchanged (do not force promotion edits)
2. disable new app-shell entry points from hub navigation if needed
3. redeploy previous known-good worker/assets
4. rerun smoke gates
5. publish incident entry in sync report with owner and ETA

## Reporting and Cadence

During launch window, all teams must update:

- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/final-lock/VTL_24_RELEASE_READINESS_REPORT_2026-04-10.md`

Cadence:

- 09:00 ICT: start-of-day status
- 13:30 ICT: blocker-only sync
- 18:00 ICT: end-of-day closure status

## Final Go/No-Go Checklist

- [ ] member secrets set
- [ ] member DNS reachable publicly
- [ ] strict deploy pass
- [ ] runtime verify pass
- [ ] mobile QA matrix pass
- [ ] Team 3 policy parity pass
- [ ] sync + readiness reports updated
- [ ] founder sign-off recorded

Only when all boxes are checked can mobile app be considered live.
