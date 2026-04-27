# VTL TEAM 2 EXECUTION PLAN COMPLETE

Version: 3.1 FINAL LOCK
Date: 2026-04-10
Status: handoff_ready
Team: Team 2 — Hub, Domain Experience, Content Surfaces
Companion files:

- `docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md`
- `docs/final-lock/VTL_11_TEAM_2_OUTPUT_48H.md`
- `docs/final-lock/VTL_11_TEAM_2_BLOCKERS_FOR_TEAM1_TEAM3.md`
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
- `docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md`
- `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md`
- `docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Purpose

This is the complete execution plan for Team 2.

Team 2 turns the platform and trust contracts into a coherent user-facing system:

- homepage purchase hub
- CTA system
- teaser/public-depth structure
- dashboard entry experience
- subdomain routing back to homepage

## Team Mission

Make every public surface understandable, consistent, and correctly routed so users always know where to start and how to go deeper without creating checkout drift across subdomains.

## Non-Negotiable Rules

- homepage is the only purchase hub
- every subdomain keeps a basic public layer
- deep content always routes back to homepage
- no subdomain invents its own checkout
- annual access and specialist packs must remain visibly separate
- pricing must follow the founder lock
- trust and disclosure copy must match Team 3 policy

## Scope Owned by Team 2

- homepage IA
- homepage package chooser UX
- CTA inventory
- route map from every subdomain to homepage
- teaser and demo system
- dashboard and start-here surfaces
- language and copy implementation for non-legal surfaces
- public-to-member depth structure

## Scope Team 2 Must Not Drift Into

- payment webhook logic
- session logic
- entitlement logic
- affiliate eligibility logic
- legal guarantees or trust claims outside Team 3 contract

## File Ownership

Primary write scope:

- `src/data/apps.json`
- `src/data/courses.json`
- `src/data/system.json`
- `src/shared/app.js`
- `src/shared/style.css`
- `src/shared/design-tokens.css`
- `scripts/build.mjs`
- Team 2 docs under `docs/final-lock`

Shared but coordinate before broad edits:

- `scripts/check.mjs`

Do not own:

- `workers/generic-worker.mjs`
- `workers/lib/*`
- `workers/vc-worker.mjs`

## Inputs Required From Other Teams

From Team 1:

- route params
- gateway keys
- entitlement names
- member-state names
- return-flow contract

From Team 3:

- disclosure insertion points
- restricted language list
- required trust labels
- affiliate-disabled messaging for annual-only layer
- proof and VC disclosure rules

## Outputs Team 2 Must Publish

- CTA inventory
- homepage package chooser IA
- teaser/public-depth matrix
- subdomain route map
- dashboard entry map
- pack preselect UI states
- disclosure-ready page placement map
- Team 1 consume-ready route-state + CTA-state table
- Team 3 finalize-ready disclosure placement map template

## Execution Status Snapshot (as of 2026-04-10)

Already delivered (48h kickoff scope):

- `docs/final-lock/VTL_11_TEAM_2_OUTPUT_48H.md`
- `docs/final-lock/VTL_11_TEAM_2_BLOCKERS_FOR_TEAM1_TEAM3.md`
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md`
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
- `dist/vetuonglai.com/api/team2-kickoff-output.json` (generated runtime artifact)
- `docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md`
- `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md`

Finalized now:

- hardened CTA/state consistency in shared surface contracts
- consumed locked Team 3 trust/disclosure/pack-policy contract into live surface copy, disclosure registry (`DPM-001..DPM-021`), and machine-readable endpoint (`/api/disclosures.json`)
- consumed Team 1 parser/member-state/return-flow contract locks (`T2-T1-001`, `T2-T1-002`, `T2-T1-003`)
- passed final Team 2 verification run (`npm run build`, `npm run check`, `npm run smoke:access-runtime`)

Waiting on external contracts:

- `T2-T1-001`: route param schema lock (P0, accepted)
- `T2-T1-002`: entitlement names + member states lock (P1, accepted)
- `T2-T1-003`: return-flow contract lock (P1, accepted)
- `T2-T3-001`: trust language matrix lock (P1, accepted)
- `T2-T3-002`: disclosure placement rules lock (P1, accepted)
- `T2-T3-003`: pack-policy labels lock (P1, accepted)
- `T2-T3-004`: annual-only affiliate-disabled copy lock (P2, accepted)

Source of truth for dependency status:

- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`

## Priority Queue and Dependency Gates

| Priority | Item | Owner | Blocks Which Team 2 Output | Team 2 Action Until Unblocked |
| --- | --- | --- | --- | --- |
| P0 | `T2-T1-001` route param schema lock | Team 1 | final route map + pack preselect states | keep provisional schema stable and avoid adding new route keys |
| P1 | `T2-T1-002` entitlement/member-state lock | Team 1 | dashboard entry map + CTA state branching | keep UI states semantic, do not hardcode backend-only transitions |
| P1 | `T2-T1-003` return-flow lock | Team 1 | post-purchase routing surfaces | keep return UI modular with explicit fallback states |
| P1 | `T2-T3-001` trust language matrix | Team 3 | teaser/demo/CTA copy finalization | apply approved phrase allowlist and restricted replacements from Team 3 contract |
| P1 | `T2-T3-002` disclosure placement rules | Team 3 | disclosure-ready placement map | Team 3 final lock completed in `VTL_20`; Team 2 can implement directly without placeholder copy |
| P1 | `T2-T3-003` pack-policy labels | Team 3 | package chooser card copy | replace label placeholders with approved Team 3 label keys and legal notes |
| P2 | `T2-T3-004` affiliate-disabled copy | Team 3 | annual-only state messaging | apply approved annual-only disabled copy and CTA next-step rules |

## Next 72h Runbook

### Day 1 (Contract hardening)

- freeze Team 2 route key usage to `entry/pack/intent/source/slug/gateway/lang/ref/return_to`
- run surface pass to ensure no subdomain-local checkout CTA exists
- publish dependency reminders for `T2-T1-001` with impact notes

Target files:

- `src/shared/app.js`
- `scripts/build.mjs`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

### Day 2 (Surface consistency + disclosure-ready zones)

- normalize CTA vocabulary across homepage and subdomain teaser blocks
- reserve disclosure slots near pricing and deep CTA sections on all core surfaces
- confirm package chooser keeps annual vs specialist separation in all states

Target files:

- `src/shared/app.js`
- `src/shared/style.css`
- `src/shared/design-tokens.css`
- `src/data/apps.json`
- `src/data/system.json`

### Day 3 (Integration prep under partial dependency lock)

- validate fallback behavior when route params are missing/invalid in UI layer
- complete dashboard `start here` and return-state mapping table for Team 1 integration
- publish blocker status delta and escalation candidate list (if any overdue)

Target files:

- `src/shared/app.js`
- `src/data/courses.json`
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Artifact Acceptance Checklist

### CTA inventory

- every subdomain has at least one teaser CTA and one deep CTA
- every deep CTA has a homepage target and explicit `source`
- no CTA points directly to subdomain-local checkout

### Homepage package chooser IA

- annual access and specialist packs are visually and semantically separate
- pack cards can accept preselect context without UI rewrites
- purchase hub language does not promise trust/legal outcomes outside Team 3 scope

### Teaser/public-depth matrix

- each surface declares `public teaser`, `demo`, and `member depth` boundaries
- no SEO-critical teaser surface is removed when depth CTA is present

### Subdomain route map

- each route documents intent, source, and homepage landing behavior
- invalid/missing params have explicit fallback behavior

### Dashboard entry map

- `start here` path exists for new/pending users
- post-purchase and return-from-payment states are separated

### Pack preselect UI states

- supported pack keys are explicit and deterministic
- unknown pack values degrade gracefully to neutral chooser state

### Disclosure-ready page placement map

- pricing and CTA surfaces reserve disclosure slots
- each slot maps to a Team 3 dependency ID
- placement can be enabled without redesigning page structure

## File-Level Backlog (Team 2 Owned)

| File | Priority | Team 2 Task | Exit Check |
| --- | --- | --- | --- |
| `src/shared/app.js` | P0 | enforce homepage-hub CTA routing and preselect state mapping | deep CTA always resolves to homepage hub context |
| `scripts/build.mjs` | P0 | keep machine-readable Team 2 output aligned with latest route/CTA contract | generated Team 2 JSON remains complete and deterministic |
| `src/data/apps.json` | P1 | keep subdomain metadata aligned with teaser/depth and CTA intent | each app surface declares clear public/depth boundary |
| `src/data/system.json` | P1 | align homepage IA sections and package chooser semantics | annual vs specialist remains separate at content model layer |
| `src/data/courses.json` | P1 | map course/depth entries to correct CTA destination patterns | no course depth CTA bypasses homepage hub |
| `src/shared/style.css` | P2 | stabilize visual CTA hierarchy for hub-first routing | deep CTA remains visible but non-checkout on subdomains |
| `src/shared/design-tokens.css` | P2 | keep consistent label and state token usage across surfaces | CTA and disclosure placeholders use one vocabulary style |

## Handoff Payload Format (Team 2 -> Team 1 / Team 3)

Every dependency update from Team 2 should include:

- dependency ID (`T2-T1-xxx` or `T2-T3-xxx`)
- impacted artifact (`route map`, `CTA inventory`, `disclosure placement map`, etc.)
- concrete unresolved field (for example: allowed `pack` values)
- latest placeholder behavior currently active in Team 2 surfaces
- deadline and escalation state from `VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`

## Sprint-by-Sprint Plan

### Sprint 0

Objective:

- lock IA and routing principles

Deliverables:

- homepage-only purchase-hub rule reflected in all UX docs
- domain inventory and CTA inventory draft

Exit gate:

- no surface points users to a hidden or alternate checkout path

### Sprint 1

Objective:

- define the surface contract

Deliverables:

- CTA map for all domains
- teaser structure
- package chooser wireframe
- route-state map

Exit gate:

- Team 1 can map route params to UI states
- Team 3 can map disclosures to exact insertion points

### Sprint 2

Objective:

- implement homepage purchase hub and deep-content routing system

Deliverables:

- homepage purchase-hub surfaces
- pack chooser states
- cross-domain CTA linking
- `start here` entry flow

Exit gate:

- every deep CTA lands on homepage with the right preselected context

### Sprint 3

Objective:

- roll teaser/demo system across all relevant surfaces

Deliverables:

- public teaser blocks
- demo blocks
- depth CTA blocks
- dashboard return paths

Exit gate:

- no page loses SEO teaser value
- no page bypasses homepage hub

### Sprint 4

Objective:

- finish polish and verification

Deliverables:

- copy clean-up
- route QA
- multilingual check
- disclosure placement verified against Team 3

Exit gate:

- all CTA, teaser, and route surfaces match the founder lock

## Workstreams

### WS1 — Homepage Purchase Hub

- structure
- package chooser
- annual vs pack separation
- gateway selection entry states

### WS2 — Domain CTA System

- each subdomain deep CTA
- route back to homepage
- source tagging
- pack preselect behavior

### WS3 — Public Depth Contract

- teaser
- demo
- public summary
- member-depth invitation

### WS4 — Dashboard and Entry Flow

- start-here logic
- member orientation entry
- return-from-payment surfaces

### WS5 — Language and Surface Consistency

- bilingual labels
- consistent CTA vocabulary
- safe copy boundaries
- Team 3 disclosure integration points

## Workstream-to-Dependency Mapping

- WS1 depends on `T2-T3-003` for final pack-policy labels
- WS2 depends on `T2-T1-001` for route param lock
- WS3 depends on `T2-T3-001` and `T2-T3-002` for trust/disclosure finalization
- WS4 depends on `T2-T1-002` and `T2-T1-003` for member-state and return-flow certainty
- WS5 depends on `T2-T3-001`, `T2-T3-002`, and `T2-T3-004` for compliant final copy

## Daily Update Protocol

Team 2 must update `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md` at:

- start of day
- after every route-map or CTA-map handoff
- end of day

Every update must include:

- status: `done`, `next`, `blocked`
- surfaces finished
- files changed
- blocked contract from Team 1 or Team 3
- route or copy risk discovered
- next surface batch

## Definition of Done

Team 2 is done only when:

- homepage is the obvious purchase hub
- all deep content routes back to homepage
- teaser/public-depth structure is consistent
- Team 3 disclosures can be placed without redesigning the surface
- Team 1 route and gateway contracts are consumed correctly everywhere

## Copy-Paste Execution Prompt

```text
Bạn là Team 2 của hệ Về Tương Lai. Bạn chỉ được tập trung vào homepage purchase hub, CTA system, teaser/demo/public-depth surfaces, dashboard entry và routing UX.

Đọc theo thứ tự:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_02_RUNTIME_TRUTH_AND_DOMAIN_MATRIX_FINAL.md
4. docs/final-lock/VTL_04_CONTENT_GATE_SEO_AND_COPY_RULES_FINAL.md
5. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
6. docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md
7. docs/final-lock/VTL_11_TEAM_2_BLOCKERS_FOR_TEAM1_TEAM3.md
8. docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md
9. docs/final-lock/VTL_16_TEAM_2_EXECUTION_PLAN_COMPLETE.md
10. docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md
11. docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md
12. docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md

Luật bắt buộc:
- homepage là purchase hub duy nhất
- subdomain không có checkout riêng
- teaser/public layer luôn tồn tại
- deep content phải dẫn về homepage đúng params
- không tự chốt contract Team 1/Team 3 khi dependency còn trạng thái waiting

Đầu ra bắt buộc:
- CTA inventory
- route map
- surface map
- disclosure placement map
- báo rõ dependency ID nào đang chặn output nào
- cập nhật docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md sau mỗi lần xong việc
```
