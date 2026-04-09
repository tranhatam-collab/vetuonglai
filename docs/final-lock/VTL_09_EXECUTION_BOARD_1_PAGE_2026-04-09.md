# VTL EXECUTION BOARD 1 PAGE

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked
Companion to: `VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md` and `VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md`

## Purpose

This is the one-page operating board for the next execution phase.

Use it to:

- assign work to the 3 teams immediately
- sequence handoffs by day and sprint
- prevent overlap across platform, UX/content, and trust/ops work
- stop coding from drifting away from the final lock

## Operating Rules

1. No team starts coding before Sprint 0 exit criteria are cleared.
2. Homepage is the only purchase hub.
3. All subdomains keep basic public content only.
4. All deep-content CTAs route back to the homepage purchase hub.
5. Annual access is the base layer only.
6. Specialist depth is unlocked through separate packs.
7. Affiliate activates only at the specialist-pack layer.

## Daily Cadence

- `09:00` Shared standup: blockers, dependencies, handoffs
- `13:30` Contract sync only if a dependency is blocked
- `18:00` Team update: done, next, blocked, contract changes

## Sprint Board

| Sprint | Days | Team 1 — Platform / Access / Commerce | Team 2 — Hub / UX / Content Surfaces | Team 3 — Trust / Affiliate / Ops | Required handoff | Exit gate |
| --- | --- | --- | --- | --- | --- | --- |
| Sprint 0 | Day 1-2 | Lock member states, entitlement vocabulary, product taxonomy, API/schema draft | Lock homepage purchase-hub IA, CTA inventory, subdomain-to-homepage route map | Lock pack-policy matrix, affiliate eligibility rule, VC extension scope, launch-policy checklist | Team 1 publishes contract draft. Team 2 publishes CTA map. Team 3 publishes policy constraints. | Founder lock is understood, ownership is named, no conflict with final-lock pack remains. |
| Sprint 1 | Day 3-7 | Build member registry contract, pending-member flow, annual-access subscription spec, webhook event contract | Build teaser/demo/CTA contract for all public subdomains, homepage purchase-hub wireframe, package chooser UX | Build trust/disclosure rules, pack-to-credential map, reporting event vocabulary | Team 1 hands API and event contracts to Team 2 and Team 3. Team 2 hands CTA and route requirements to Team 1. | Core contracts are approved and file ownership is clear. No subdomain checkout is allowed. |
| Sprint 2 | Day 8-12 | Implement annual-access billing skeleton, pack-order skeleton, entitlement checks, cross-domain route contract | Implement homepage purchase-hub pages, subdomain deep-content CTA blocks, dashboard entry UX, pack preselect states | Implement affiliate-state model, VC proof extension contract, legal/trust copy matrix, analytics event plan | Team 1 exposes working billing and entitlement interfaces. Team 2 exposes route params and UI states. Team 3 exposes policy and event matrices. | Purchase paths and route contracts work end to end in staging assumptions. |
| Sprint 3 | Day 13-17 | Finish session/cookie strategy, webhook provisioning flow, entitlement enforcement, homepage return flow | Finish teaser rollout on all domains, dashboard/start-here flow, gated-depth routing back to homepage | Finish affiliate rules, payout logic spec, runtime KPI dashboard spec, compliance checklist, VC issuance dependencies | Team 1 and Team 2 confirm all deep-content routes land on homepage correctly. Team 3 confirms affiliate remains disabled on annual-access only. | Cross-team integration is stable, and no pricing/copy/trust rule violates the final lock. |
| Sprint 4 | Day 18-21 | Fix platform defects, verify access states, verify member and pack edge cases | Fix UX/copy gaps, verify SEO/paywall rendering, verify every CTA path | Verify legal/trust disclosures, analytics coverage, payout/report readiness, launch-go checklist | Shared QA board with blockers ranked by severity. | Launch gate passes: pricing, routing, entitlement, trust, and disclosure all match the founder lock. |

## Primary Deliverables by Team

- Team 1 must publish: member-state schema, entitlement matrix, webhook event contract, purchase return contract, cross-domain route contract.
- Team 2 must publish: homepage purchase-hub map, CTA map, teaser block contract, route-state map, dashboard entry map.
- Team 3 must publish: pack-policy matrix, affiliate eligibility matrix, VC extension matrix, KPI/reporting matrix, launch/compliance checklist.

## Stop Rules

- Stop immediately if anyone reintroduces `lifetime unlock` or subdomain-local checkout.
- Stop immediately if annual access is treated as specialist-depth access.
- Stop immediately if affiliate is enabled before specialist-pack eligibility.
- Stop immediately if public pages lose their teaser/demo/indexable layer.

## Definition of Done

- Team 1: billing, entitlement, and routing contracts are stable enough that Team 2 and Team 3 no longer guess.
- Team 2: every domain has a clean public layer and a valid deep-content path back to homepage.
- Team 3: trust, affiliate, legal, analytics, and launch rules are explicit enough to audit.
- Shared: the system can be handed to implementation without reopening product strategy.
