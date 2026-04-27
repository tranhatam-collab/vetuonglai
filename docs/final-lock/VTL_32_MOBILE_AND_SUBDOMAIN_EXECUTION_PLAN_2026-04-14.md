# VTL MOBILE + SUBDOMAIN CONTINUATION PLAN

Version: 1.0
Date: 2026-04-14
Status: active-execution
Owner: Founder + Team 1 + Team 2 + Team 3 + Ops

## Purpose

Provide one complete continuation plan for 3 dev teams to:

1. close remaining mobile V1 blockers
2. expand stable execution to other subdomains
3. keep runtime truth, copy, policy, and engineering aligned

Payment implementation remains deferred in this plan.

## Non-Negotiable Pre-Dev Gate

Before any team starts coding for a new cycle, that team must publish a complete plan file for the cycle.
No plan file -> no coding, no merge, no deploy.

## Current Baseline (2026-04-14)

- Team model confirmed: `Team 1`, `Team 2`, `Team 3` (+ Ops support).
- Mobile technical gates are mostly green.
- Historical blocker from `2026-04-14`:
  - `npm run cloudflare:promote:member` was blocked by missing runtime prerequisites on `vetuonglai-member`.

## Baseline cập nhật (2026-04-21 17:46 ICT)

- member required-public promote has passed
- runtime truth for `member.vetuonglai.com` is now:
  - `status: live`
  - `requiredPublic: true`
- founder lane execution debt has closed at `100% / 0%`
- Sprint 1 critical path is effectively closed for the member cutover portion
- current active focus of this plan should move to:
  - Sprint 2 — Mobile V1 Closure
  - chuẩn bị Sprint 3 — Core Subdomains Hardening

## Team Structure (3 Dev Teams)

### Team 1 — Runtime / Access / Platform

Owns:

- access runtime
- member cutover
- contract endpoints
- deployment/verification gates
- API/runtime consistency across subdomains

### Team 2 — Product UX / Frontend / Mobile Experience

Owns:

- app/mobile UX flows
- responsive surfaces across root/member/edu/vc and expansion subs
- IA and CTA routing consistency
- usability and content rendering integrity

### Team 3 — Trust / Compliance / Launch Governance

Owns:

- disclosure and trust parity
- event vocabulary and audit-field governance
- launch go/no-go controls
- policy-safe copy and claims

## Execution Roadmap (6 Sprints)

### Sprint 1 — Unblock Mobile Cutover (Critical Path)

Target window: immediate

Team 1:

- rerun `npm run cloudflare:promote:member` as soon as Ops confirms secrets + DNS
- publish runtime-truth evidence after successful promotion

Team 2:

- hold mobile scope freeze
- keep day1/day2 local regression green

Team 3:

- prepare immediate post-promote parity pass

Exit gate:

- member promotion succeeds and runtime truth remains non-drift

Current state:

- gate passed on `2026-04-21`

### Sprint 2 — Mobile V1 Closure

Target window: after Sprint 1 gate pass

Team 1:

- monitor `provider-status`, `policy-bindings`, `routing-contract` in production

Team 2:

- close regression `DPM-001..DPM-021`
- finish mobile state/route QA for `visitor`, `pending_member`, `annual_active`, `pack_owner`
- complete EDU + VC mobile interaction checks

Team 3:

- complete parity checks for mobile trust/disclosure/event vocabulary
- publish launch recommendation for mobile non-payment scope

Exit gate:

- mobile V1 done criteria pass end-to-end

Current state:

- this is now the active next sprint for the total plan

### Sprint 3 — Core Subdomains Hardening (ROOT, MEMBER, EDU, VC)

Team 1:

- lock API contracts and telemetry contract compatibility for core domains
- stabilize cross-domain session and entitlement read model

Team 2:

- finalize IA/render consistency on `root/member/edu/vc`
- align dashboard + journey entry surfaces with updated status badges

Team 3:

- validate trust wording parity on all core surfaces
- block overclaim language against runtime truth

Exit gate:

- core-domain release pack has zero P1 contract drift

### Sprint 4 — Expansion Subdomains Wave 1 (LIFE, FINANCE, INVEST, GREEN)

Team 1:

- expose required runtime/contract endpoints for expansion domains
- ensure telemetry contract hooks available for these surfaces

Team 2:

- complete responsive and content flow readiness for these 4 domains
- map teaser/member-depth boundaries per domain status

Team 3:

- approve disclosure bundles per domain
- verify claims remain consistent with `Live / Member Preview / Planned / Bridge`

Exit gate:

- 4 domains are content/runtime consistent with locked status model

### Sprint 5 — Expansion Subdomains Wave 2 (COMMUNITY, WORK, MARKET, AI)

Team 1:

- prepare guarded runtime routes and feature flags for planned domains

Team 2:

- build usable planned-safe or member-preview-safe surface scaffolds (no false “live” claims)
- ensure CTA flows route to valid destinations only

Team 3:

- lock legal/trust language for `Member Preview` / `Planned` / `Bridge` states
- verify no planned domain is advertised as fully live

Exit gate:

- wave 2 domains are planned-safe with explicit status disclosure

### Sprint 6 — Ops/API/Admin Consolidation

Team 1:

- complete API/admin contract stability and observability baselines

Team 2:

- align FE operations views and status indicators with runtime truth

Team 3:

- finalize governance checklist for cross-domain scale phase

Exit gate:

- all team workflows are production-operable with clear owner and runbook

## Delivery Waves by Domain

Wave A:

- `vetuonglai.com`
- `member.vetuonglai.com`
- `edu.vetuonglai.com`
- `vc.vetuonglai.com`

Wave B:

- `life.vetuonglai.com`
- `finance.vetuonglai.com`
- `invest.vetuonglai.com`
- `green.vetuonglai.com`

Wave C:

- `community.vetuonglai.com`
- `work.vetuonglai.com`
- `market.vetuonglai.com`
- `ai.vetuonglai.com`

Wave D:

- remaining long-horizon domains (`stories`, `mission`, `healing`, `family`, `foundation`, `labs`, `blog`, `live`, `tools`, `affiliate`, `api`, `admin`)

## Command Gate Sequence (Per Sprint Checkpoint)

Mandatory local:

```bash
npm run verify:team-app:day1:local
```

Mandatory required-public:

```bash
npm run verify:team-app:day1:prod
npm run cloudflare:verify:runtime
```

Member cutover checkpoint:

```bash
npm run cloudflare:promote:member
```

Block release if any required gate fails.

## Team-by-Team Weekly Outputs

### Team 1 weekly output

- runtime contract diff report
- production gate logs
- blocker summary for Ops dependencies

### Team 2 weekly output

- domain UX parity report
- mobile/device QA matrix updates
- CTA/deep-link verification results

### Team 3 weekly output

- trust/disclosure parity report
- event vocabulary audit status
- go/no-go recommendation updates

## Reporting and Cadence

Mandatory updates:

- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/final-lock/VTL_24_RELEASE_READINESS_REPORT_2026-04-10.md`
- `docs/final-lock/VTL_30_TEAM_APP_DAILY_TASK_BOARD_2026-04-13.md`

Cadence:

- `09:00 ICT`: team start status
- `13:30 ICT`: blocker-only sync
- `18:00 ICT`: closure update

## Immediate Next Actions (Now)

1. Ops inject 7 required member secrets and confirm DNS readiness.
2. Team 1 rerun `npm run cloudflare:promote:member`.
3. Team 2 run full `DPM-001..DPM-021` regression after promote signal.
4. Team 3 execute parity checklist from `VTL_31` and issue launch recommendation.

## Final Rule

No team may claim a domain or feature as live unless runtime truth and required gates both confirm it.
