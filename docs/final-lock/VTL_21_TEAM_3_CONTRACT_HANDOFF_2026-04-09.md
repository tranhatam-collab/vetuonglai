# VTL TEAM 3 CONTRACT HANDOFF

Version: 1.2
Date: 2026-04-10
Status: done
Owner: Team 3 — Trust, Affiliate, Legal, Analytics, Ops

## Purpose

This handoff turns Team 3 policy direction into consumable contracts for Team 1 runtime and Team 2 surfaces so both teams can implement without policy guessing.

## Source of Truth

- data source: `src/data/team3-policy-matrix.json`
- member policy API: `member.vetuonglai.com/api/team3-policy-matrix.json`
- hub policy mirror: `vetuonglai.com/api/policy/team3-matrix.json`
- Team 2 contract confirmation: `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`
- cross-team reporting log: `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Locked Output for Team 1 Runtime

Team 1 must consume these Team 3 fields from `integrationContracts.team1Runtime`:

- `consumedIdentityStates`
- `normalizedEventsRequiredFromTeam1`
- `policyToRuntimeEventMap`
- `webhookOutputsRequiredForComplianceAndPayout` (`T3-T1-003`)
- existing required fields under:
  - `guardrails`
  - `affiliateEligibility`
  - `disclosureAndCompliance`
  - `reporting.requiredEvents`
  - `launchGate`

### Runtime no-drift requirements

- `annual_only` must remain `denied` for affiliate eligibility
- runtime cannot enable referral link generation unless condition is `annual_plus_pack_with_compliance_pass`
- runtime annual and pack lifecycle normalization must stay aligned with:
  - `annual.subscription.*`
  - `pack.order.*`
- Team 1 must not replace Team 3 policy keys with provider-specific raw events

## Locked Output for Team 2 Surfaces

Team 2 should consume `integrationContracts.team2Surfaces` directly:

- `trustLanguageMatrix` (`T2-T3-001`)
- `disclosurePlacementRules` (`T2-T3-002`)
- `packPolicyLabels` (`T2-T3-003`)
- `annualOnlyAffiliateDisabledCopy` (`T2-T3-004`)
- `launchComplianceEventMapping`

### Team 2 placement and copy guardrails

- disclosures must be visible on primary flow, not hidden behind tabs
- annual and pack layers must remain separate in every pricing context
- annual-only state must show affiliate-disabled messaging with compliant next-step CTAs only
- restricted phrases are blocked and require replacement wording from Team 3 matrix

## Dependency Coordination Status

### Team 3 dependencies needed from Team 1

- `T3-T1-001` member-state machine + normalized event vocabulary lock: `done`
- `T3-T1-002` entitlement and pack ownership fields lock: `done`
- `T3-T1-003` webhook outputs for compliance and payout-audit dependencies: `done`

### Team 3 dependencies needed from Team 2

- `T3-T2-001` disclosure insertion-point map by surface: `done`
- `T3-T2-002` confirmation surfaces requiring disclosure acknowledgment: `done`
- `T3-T2-003` pricing display states by page and CTA state: `done`
- `T3-T2-004` CTA insertion points for trust and affiliate-disabled messaging: `done`

## Handoff Acceptance Checklist

- Team 1 confirms runtime reads Team 3 contract fields without key drift
- Team 1 confirms event normalization mapping from Team 3 policy keys to runtime keys
- Team 2 confirms all four Team 2 dependency IDs from Team 3 are accepted
- Team 2 confirms disclosure slots are bound to real surface keys after placement map lock
- Team 3 updates `VTL_18_CROSS_TEAM_SYNC_REPORT.md` after each handoff change

## Current Limitation

This handoff is fully locked and consumed for current release scope.
Any further changes must be treated as post-lock revision with explicit cross-team re-approval.
