# VTL TEAM 2 BLOCKERS FOR TEAM 1 AND TEAM 3

Version: 1.0
Date: 2026-04-09
Status: active handoff
Source: `docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md`

## Purpose

This file is the formal blocker handoff from Team 2 to Team 1 and Team 3 after the first 48-hour Team 2 delivery.

Team 2 has locked:

- CTA inventory
- homepage purchase-hub IA
- subdomain-to-homepage route pattern
- package chooser UX map
- teaser/demo/content-depth map

The items below are required for Team 2 to continue without contract guessing.

## Blockers for Team 1

### T1-B1: Route parameter schema lock

Team 2 currently routes deep CTA paths to homepage with params:

- `entry`
- `pack`
- `intent`
- `source`
- `slug`

Team 1 must lock:

- allowed values per field
- validation rules
- fallback behavior when params are missing or invalid
- canonical redirect behavior

Required output:

- one contract file and one API/middleware validation spec

Acceptance criteria:

- Team 2 can generate links without ambiguity
- Team 1 middleware parses the same schema consistently

### T1-B2: Entitlement names and member states

Team 2 requires the final state vocabulary to drive UX branches.

Team 1 must lock:

- member states (`visitor`, `annual_member`, `pack_owner`, etc.)
- entitlement names per state
- pending/failed/retry states for purchase lifecycle

Required output:

- entitlement matrix with exact keys

Acceptance criteria:

- Team 2 can map CTA/state UI without custom assumptions

### T1-B3: Return-flow contract from homepage purchase hub

Team 2 needs deterministic post-purchase return behavior.

Team 1 must lock:

- return target precedence (source domain vs dashboard)
- token/session behavior after return
- timeout/failure fallback routes

Required output:

- return-flow contract doc + route table

Acceptance criteria:

- Team 2 can design success/welcome/dashboard transition with no placeholder logic

## Blockers for Team 3

### T3-B1: Allowed trust language list

Team 2 needs approved trust-safe copy for teaser/demo/CTA blocks.

Team 3 must lock:

- allowed phrases
- restricted phrases
- context-specific replacements

Required output:

- trust language matrix that Team 2 can apply directly

Acceptance criteria:

- Team 2 copy passes trust review without per-page ad hoc revisions

### T3-B2: Disclosure placement rules

Team 2 requires exact placement logic for legal/trust disclosures.

Team 3 must lock:

- where disclosure appears (hero/footer/near CTA/checkout)
- minimum visibility requirements
- per-domain exceptions if any

Required output:

- disclosure placement map per route type

Acceptance criteria:

- Team 2 can place disclosure blocks uniformly across subdomains

### T3-B3: Pack-policy labels

Team 2 package chooser UX depends on final policy labels.

Team 3 must lock:

- policy labels shown at pack cards
- legal-safe microcopy for each label
- affiliate visibility rules per pack state

Required output:

- pack-policy label table

Acceptance criteria:

- Team 2 package cards can be finalized without taxonomy drift

### T3-B4: Affiliate-disabled copy for annual-only state

Team 2 needs explicit copy where affiliate is not active.

Team 3 must lock:

- exact disabled-state message
- allowed CTA after disabled-state message
- escalation or next-step wording

Required output:

- annual-only affiliate-disabled copy pack

Acceptance criteria:

- Team 2 can render annual-only UX with no compliance ambiguity

## Team 2 current dependency boundary

Team 2 will not:

- implement billing logic
- implement entitlement backend logic
- implement affiliate logic

Team 2 will continue:

- homepage purchase-hub UX
- cross-domain CTA routing UX
- teaser/demo/content-depth presentation
- dashboard/start-here entry UX

## Handoff readiness status

- Team 2 delivery file: `docs/final-lock/VTL_11_TEAM_2_OUTPUT_48H.md`
- Runtime output artifact: `vetuonglai.com/api/team2-kickoff-output.json`
- Team 1 request template: `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_TEMPLATE.md`
- Team 3 request template: `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_TEMPLATE.md`

This blocker file should be consumed by Team 1 and Team 3 before Team 2 starts the next integration slice.
