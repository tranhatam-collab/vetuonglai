# VTL TEAM 2 OUTPUT 48H

Version: 1.0
Date: 2026-04-09
Status: delivered
Source mission: `docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md`

## Delivered in this repo

Team 2 delivered the required 48-hour artifacts in runtime output and source:

- CTA inventory
- homepage purchase-hub IA
- subdomain-to-homepage route map
- pack preselect UX contract
- teaser/demo/content-depth map

## Source locations

- `scripts/build.mjs`
  - homepage purchase-hub section and package chooser
  - deep-content CTA routing helpers to homepage hub
  - Team 2 kickoff output JSON generator
- `dist/vetuonglai.com/api/team2-kickoff-output.json` (generated)
  - machine-readable component/CTA/route/content-depth/blockers output
- `scripts/check.mjs`
  - asserts Team 2 output file completeness
- `docs/final-lock/VTL_11_TEAM_2_BLOCKERS_FOR_TEAM1_TEAM3.md`
  - formal blocker handoff to Team 1 and Team 3
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_TEMPLATE.md`
  - structured response template for Team 1 contracts
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_TEMPLATE.md`
  - structured response template for Team 3 contracts
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md`
  - prefilled Team 1 contract draft from current access model
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`
  - prefilled Team 3 contract draft from current policy matrix
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
  - SLA board for cross-team blockers and escalation
- `docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md`
  - Team 1 consume-ready route-state + CTA-state map in table form
- `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md`
  - Team 3 finalize-ready disclosure placement map template

## Contract alignment notes

### Team 2 owns and locked

- purchase-hub IA sections in homepage
- CTA pattern for deep-content routing back to homepage
- UX-level pack preselect parameters (`entry`, `pack`, `intent`, `source`, `slug`)
- content depth layering map
- canonical Team 2 emitted intent values for routing now aligned to Team 1 contract:
  - `annual-access`
  - `specialist-pack`

### Team 1 blockers required

- route parameter schema finalization
- entitlement names and member states
- purchase return-flow contract

### Team 3 blockers required

- trust/disclosure language constraints
- disclosure placement rules
- pack-policy labels
- affiliate-disabled copy for annual-only state

## Guardrails respected

- no subdomain-local checkout added
- no billing logic added in Team 2 scope
- no pack taxonomy changes made by Team 2

## Runtime truth reminder

This output is a Team 2 UX/content contract delivery.
It does not claim that all planned subdomains are publicly live.
