# VTL MOBILE PWA EXECUTION PLAN

Version: 1.0
Date: 2026-04-13
Status: active_execution
Owner: Team 1 + Team 2 + Team 3
Scope: non-payment mobile V1

## Purpose

Lock one execution plan for mobile V1 so all teams build the same app shape:

- PWA-first
- member + EDU core
- no in-app payment
- one contract path for telemetry and runtime parity

## Snapshot cập nhật (2026-04-21 17:46 ICT)

- `member.vetuonglai.com` đã promote thành công sang `live` + `requiredPublic=true`
- gate external về member cutover không còn là blocker của mobile V1
- các local gates vẫn đã có bằng chứng xanh:
  - `npm run build`
  - `npm run check`
  - `npm run smoke:access-runtime`
  - `npm run smoke:mobile-pwa`
- trọng tâm còn lại của mobile V1 bây giờ là:
  - QA matrix theo device/viewport
  - parity/trust wording trên mobile surfaces
  - launch-go package cho mobile non-payment scope

## Product Lock

- app shell host: `member.vetuonglai.com/app/`
- payment in app: disabled
- commerce CTA behavior: redirect to homepage purchase hub (`vetuonglai.com`)
- core journeys:
  - session check and member-state rendering
  - EDU course list + learn entry
  - VC quick verify entry

## Runtime Contracts (Mobile)

Member domain must expose:

- `/api/mobile-config.json`
- `/api/mobile/edu-catalog.json`
- `/api/mobile/vc-certificates.json`
- `/api/mobile/session-states.json`

App shell must ship:

- `/app/index.html`
- `/app/manifest.webmanifest`
- `/app/sw.js`
- `/app/offline/index.html`

## Team Responsibilities

### Team 1

- keep `access-runtime` persistence ready for KV via `ACCESS_KV_NAMESPACE`
- keep `provider-status`, `routing-contract`, `policy-bindings` stable for app consumption
- maintain member-domain non-payment runtime integrity

### Team 2

- own mobile-first responsive behavior for app shell and member/core surfaces
- keep CTA routing consistent with homepage-only purchase hub rule
- prevent checkout UI from appearing inside mobile app shell

### Team 3

- enforce trust/disclosure and no-drift language in mobile app copy
- keep telemetry event vocabulary aligned with Team 3 reporting requirements
- validate mobile disclosure and trust behavior after each release run

## QA Gates

Required local gates:

- `npm run build`
- `npm run check`
- `npm run smoke:access-runtime`
- `npm run smoke:mobile-pwa`

Required production gate for current release scope:

- `npm run cloudflare:smoke:endpoints`

Ops/live gate (external prerequisite):

- `npm run cloudflare:promote:member`
- `npm run cloudflare:verify:runtime`

## Done Criteria (Mobile V1)

- app is installable as PWA
- app has offline fallback and cached app shell
- member session state appears in app shell
- EDU and VC quick-verify snapshots render inside app shell
- no in-app payment path exists
- telemetry keys are emitted for:
  - `mobile_app_open`
  - `mobile_login_success`
  - `mobile_edu_lesson_start`
  - `mobile_edu_lesson_complete`
  - `mobile_vc_verify_open`

## Current Blockers

- member domain ops cutover external is no longer blocking this plan.
- current open work for mobile V1 is now:
  - QA closure theo matrix trong `VTL_31`
  - parity/go-no-go package cho mobile non-payment scope
  - đồng bộ copy/trust/telemetry trên mobile surfaces nếu còn drift
