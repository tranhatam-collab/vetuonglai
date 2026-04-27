# VTL Daily Execution Checklist

Version: 1.1
Date: 2026-04-10
Status: active
Owner: Cross-team (Team 1, Team 2, Team 3)

## Purpose

This is the single-day execution checklist for 2026-04-10 to close remaining contract integration and launch-readiness gaps.

## Completion Snapshot (as of 2026-04-10 01:27 ICT)

- Team 3 policy/disclosure lock: `100%` done
- Team 2 dependency on Team 3 (`T2-T3-*`): `100%` done (`accepted`)
- Team 2 dependency on Team 1 (`T2-T1-*`): `3/3 accepted`
- Team 3 dependency on Team 1 (`T3-T1-*`): `100%` done, including `T3-T1-003` machine-checkable lock
- Cross-team integrated progress: `100%` complete for current release scope (`member.vetuonglai.com` is `staged_public`, `requiredPublic=false`)

## Today's Critical Path

1. Completed: Team 1 confirmed and signed `T2-T1-001`, `T2-T1-002`, `T2-T1-003`.
2. Completed: Team 1 published final webhook output mapping for `T3-T1-003`.
3. Completed: Team 2 implemented disclosure copy/placement from `VTL_20` and reported evidence.
4. Completed: Team 3 verified integration coverage and updated launch readiness reports.

## Team Checklist

### Team 1 — Platform / Access / Commerce

- [x] confirm route param schema sign-off for `T2-T1-001`
- [x] confirm entitlement/member state lock for `T2-T1-002`
- [x] confirm return-flow contract lock for `T2-T1-003`
- [x] publish final webhook outputs for compliance and payout dependencies (`T3-T1-003`)
- [x] update `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md` with accepted/rejected decisions and reasons

Exit gate:

- all `T2-T1-*` move to `accepted` or explicit `blocked` with mitigation
- `T3-T1-003` has machine-readable final mapping, not placeholder text

### Team 2 — Hub / UX / Content Surfaces

- [x] implement all approved rows `DPM-001`..`DPM-021` from `VTL_20` into target surfaces
- [x] verify no subdomain-local checkout CTA is reintroduced while binding disclosure blocks
- [x] produce implementation evidence list by `DPM-*` row (surface key, file, status)
- [x] update dependency status in `VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md` after Team 1 decisions
- [x] append execution evidence summary to `VTL_18`

Exit gate:

- all implemented rows in `VTL_20` have evidence references
- no unresolved `TBD_*` placeholders in delivery-facing artifacts

### Team 3 — Trust / Affiliate / Legal / Ops

- [x] validate Team 2 implementation against `VTL_20` row-by-row
- [x] verify runtime/event compatibility against Team 1 final webhook outputs
- [x] close `T3-T1-003` with machine-checkable policy and verification gates
- [x] publish updated launch-go checklist delta in `VTL_18`
- [x] classify remaining issue level as `low` for current release scope

Exit gate:

- Team 3 confirms coverage and marks any gap explicitly with owner + ETA
- launch-go criteria can be evaluated without policy ambiguity

## Cadence for 2026-04-10 (ICT)

- `09:00`: standup log entry by each team
- `13:30`: contract sync log only for blockers or dependency status changes
- `18:00`: close-of-day update by each team with done/next/blocked/risk

## End-of-Day Done Criteria

- [x] all `T2-T1-*` accepted
- [x] Team 2 has implementation evidence for disclosure rollout
- [x] Team 3 published updated integration percentage and remaining blocker list
