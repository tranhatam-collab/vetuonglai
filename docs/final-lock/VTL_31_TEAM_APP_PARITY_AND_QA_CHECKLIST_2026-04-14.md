# VTL TEAM APP PARITY AND QA CHECKLIST

Version: 1.0
Date: 2026-04-14
Status: active-checklist
Owner: Team 2 + Team 3 + Team App Lead

## Purpose

Provide one operational checklist for:

1. post-cutover parity validation (Team 3 lead)
2. mobile QA execution matrix (Team 2 lead)
3. go/no-go evidence packaging (shared)

This checklist is for non-payment mobile V1 scope only.

## Trigger Point

Run this checklist immediately after Team 1 posts:

- `npm run cloudflare:promote:member` result
- `npm run cloudflare:verify:runtime` result

Snapshot update (2026-04-21 17:46 ICT):

- trigger point has been reached
- `npm run cloudflare:promote:member` is now pass
- `npm run cloudflare:verify:runtime` is now pass for required-public domains
- Team 3 parity is now `go`
- remaining open work in this checklist is the mobile QA matrix and final mobile launch-go packaging

## Section A — Team 3 Parity Checklist

### A1. Runtime and policy parity

- [ ] `provider-status` reflects expected persistence mode and active contract version.
- [ ] `policy-bindings` matches locked disclosure/trust rule set (no field drift).
- [ ] `routing-contract` still routes commerce CTA to `vetuonglai.com` only.
- [ ] `requiredPublic` state in runtime truth matches real production behavior.

### A2. Vocabulary and audit parity

- [ ] event vocabulary includes:
  - `mobile_app_open`
  - `mobile_login_success`
  - `mobile_edu_lesson_start`
  - `mobile_edu_lesson_complete`
  - `mobile_vc_verify_open`
- [ ] audit fields preserve `route`, `screen`, `language`, `member_state`.
- [ ] no policy wording drift between Team 2 surfaces and Team 3 contract.

### A3. Team 3 sign-off output

- [ ] update `VTL_18` with parity pass/fail and risk level.
- [ ] update `VTL_24` with launch-go recommendation.
- [ ] if fail: include blocker owner + ETA + rollback note.

## Section B — Team 2 Mobile QA Checklist

### B1. Device/browser matrix

- [ ] iOS Safari latest
- [ ] iOS Safari previous major
- [ ] Android Chrome latest
- [ ] Android Chrome previous major

### B2. Viewport matrix

- [ ] small (`360x780`)
- [ ] medium (`390x844`)
- [ ] large mobile (`430x932`)

### B3. Functional checklist

- [ ] app install path visible and usable
- [ ] session state renders correctly (`visitor`, `pending_member`, `annual_active`, `pack_owner`)
- [ ] auth-gated actions are disabled for visitor and enabled for eligible states
- [ ] EDU list opens and lesson start event fires
- [ ] EDU complete action emits completion event
- [ ] VC quick verify opens and event fires
- [ ] offline fallback page is reachable and understandable
- [ ] commerce CTA always routes to hub (no in-app payment)

### B4. Accessibility and content checklist

- [ ] touch targets remain usable on smallest viewport
- [ ] disclosure text remains present and readable in VI/EN
- [ ] no critical visual overlap or unreadable text on mobile cards/lists

## Section C — Command Gate Checklist

- [ ] `npm run verify:team-app:day1`
- [ ] `npm run verify:team-app:day1:local`
- [ ] `npm run verify:team-app:day1:prod`
- [ ] `npm run verify:team-app:day1:full`
- [ ] `npm run build`
- [ ] `npm run check`
- [ ] `npm run smoke:access-runtime`
- [ ] `npm run smoke:mobile-pwa`
- [ ] `npm run cloudflare:smoke:endpoints`
- [ ] `npm run cloudflare:promote:member`
- [ ] `npm run cloudflare:verify:runtime`

## Section D — Go/No-Go Package

Attach in one closure update:

1. parity result summary (Team 3)
2. QA matrix summary (Team 2)
3. command gate results (Team 1/Lead)
4. final recommendation:
   - `GO`
   - `GO_WITH_RISK`
   - `NO_GO`

## Report Template (Copy)

```text
### YYYY-MM-DD HH:MM ICT — Team App Parity/QA Closure
- parity_status:
- qa_status:
- command_gates:
- critical_blockers:
- rollback_ready:
- recommendation:
- owner:
```
