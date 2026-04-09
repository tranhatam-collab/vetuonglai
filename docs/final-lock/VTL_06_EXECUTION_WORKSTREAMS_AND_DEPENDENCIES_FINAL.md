# VTL EXECUTION WORKSTREAMS AND DEPENDENCIES FINAL

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked

## Rule Before Any Dev

Planning completion is now a formal prerequisite for implementation.

No workstream should enter coding until:

- the lock pack is read
- ownership is assigned
- file outputs are named
- dependency blockers are acknowledged

## Workstreams

| ID | Workstream | Team lead | Size | Depends on |
| --- | --- | --- | --- | --- |
| WS1 | Final planning lock and owner sign-off | Shared | M | none |
| WS2 | Homepage annual-access purchase hub | Team 2 + Team 1 | L | WS1 |
| WS3 | Identity, member registry, entitlement model | Team 1 | XL | WS1 |
| WS4 | Annual subscription billing and webhook flow | Team 1 + Team 3 | XL | WS1, WS3 |
| WS5 | Specialist pack catalog and checkout orchestration | Team 1 + Team 3 | L | WS1, WS2, WS3 |
| WS6 | Public teaser standard across all subdomains | Team 2 | L | WS1 |
| WS7 | Deep-content gate and homepage routing contract | Team 1 + Team 2 | L | WS2, WS3, WS6 |
| WS8 | VC trust-layer extensions for pack and credential flows | Team 3 | L | WS3, WS5 |
| WS9 | Affiliate eligibility, tracking, payout, policy | Team 3 | L | WS5 |
| WS10 | Dashboard, onboarding, next-step orchestration | Team 2 + Team 1 | L | WS2, WS3 |
| WS11 | Analytics, reporting, legal, trust disclosures | Team 3 | M | WS4, WS5, WS9 |
| WS12 | QA, runtime verification, launch gate | Shared | L | WS2–WS11 |

## Critical Path

The true critical path is:

`WS1 -> WS3 -> WS4 -> WS5 -> WS7 -> WS12`

If this chain slips, the launch slips.

## Recommended Phasing

### Phase 0 — Planning Freeze

- approve the lock pack
- approve ownership
- approve final pricing and product taxonomy

### Phase 1 — Core Access Foundation

- identity
- entitlement
- annual billing
- homepage purchase hub

### Phase 2 — Specialist Depth and Routing

- pack catalog
- deep-content routing
- public teaser system
- cross-domain purchase paths

### Phase 3 — Trust, Affiliate, and Ops

- VC extensions
- affiliate policy and logic
- reporting and analytics
- legal and runtime QA

## Workload Estimate by Team

| Team | Focus | Estimated load |
| --- | --- | --- |
| Team 1 | platform, auth, billing, entitlement, routing | 58 points |
| Team 2 | hub UX, content gates, teaser system, dashboard | 47 points |
| Team 3 | VC, affiliate, legal, analytics, ops | 43 points |

These are planning points, not promises of calendar duration.

## Anti-Overlap Rules

- Team 1 owns payment, auth, entitlement, and route contracts.
- Team 2 owns teaser blocks, page UX, CTA patterns, dashboard UX, and copy integration.
- Team 3 owns trust logic, affiliate logic, reporting, legal policy, and compliance rules.

If a task needs two teams:

- one team owns the contract
- the other team consumes the contract

No shared ownership without a named primary owner.
