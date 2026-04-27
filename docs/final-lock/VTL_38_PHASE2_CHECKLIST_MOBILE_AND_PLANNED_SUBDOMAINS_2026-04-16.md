# VTL PHASE 2 CHECKLIST — MOBILE + PLANNED SUBDOMAINS

Version: 1.0
Date: 2026-04-16
Status: active
Owner: Founder + Team 1 + Team 2 + Team 3

## Purpose

Lock one execution checklist for:
1. mobile V1 closure (non-payment)
2. planned subdomain rollout in planned-safe mode
3. team-split delivery with strict pre-dev planning gate

## Snapshot cập nhật (2026-04-21 17:46 ICT)

- gate `member cutover` đã được gỡ:
  - `npm run cloudflare:promote:member` đã pass
  - `npm run cloudflare:verify:runtime` đã pass cho required-public domains
- vì vậy thứ tự thực thi phase 2 hiện tại phải hiểu là:
  1. chốt mobile V1 closure
  2. chỉ sau đó mới mở planned subdomains theo planned-safe mode

## Non-Negotiable Rule

No team writes code for a new cycle unless that team has an updated complete plan file.
No plan file -> no coding, no merge, no deploy.

## Team Split Checklist

### Team 1 (Platform / Runtime)
- keep runtime gates green (`provider-status`, `policy-bindings`, `routing-contract`)
- stabilize mobile contract endpoints and session state mapping
- enforce guarded routes for planned domains
- update runtime truth immediately after status changes

### Team 2 (Frontend / Mobile / Product UX)
- enforce brand consistency on hero/CTA/disclosure
- complete mobile state and flow QA (`visitor`, `pending_member`, `annual_active`, `pack_owner`)
- ensure deep CTA always routes to homepage gateway
- implement teaser/demo/gateway blocks for planned domains without false live claims or `Beta` wording

### Team 3 (Trust / Legal / Governance)
- verify DPM disclosure placement on core mobile routes
- block overclaim wording against `Live / Member Preview / Planned / Bridge`
- keep event vocabulary/audit fields in parity
- issue sprint go/no-go with evidence

## Required Command Gates

```bash
npm run build
npm run check
npm run smoke:mobile-pwa
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run cloudflare:verify:runtime
```

If member cutover is in scope:

```bash
npm run cloudflare:promote:member
```

## Release Gate

Release may proceed only if:
1. all 3 team plan files are updated and `plan_ready`
2. required command gates pass
3. trust/legal parity is approved
4. runtime truth and status matrix are synced
5. no open critical blocker remains
6. `member` DNS and runtime secret gate are actually green before any member cutover claim

## Mandatory Reporting

Update daily:
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/final-lock/VTL_30_TEAM_APP_DAILY_TASK_BOARD_2026-04-13.md`
- `docs/final-lock/VTL_34_TEAM1_EXECUTION_PLAN_2026-04-14.md`
- `docs/final-lock/VTL_35_TEAM2_EXECUTION_PLAN_2026-04-14.md`
- `docs/final-lock/VTL_36_TEAM3_EXECUTION_PLAN_2026-04-14.md`
