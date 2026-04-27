# VTL TEAM 3 EXECUTION PLAN COMPLETE

Version: 3.2 FINAL LOCK
Date: 2026-04-10
Status: active
Team: Team 3 — Trust, Affiliate, Legal, Analytics, Ops
Companion files:

- `docs/final-lock/VTL_12_TEAM_3_KICKOFF_48H.md`
- `docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/final-lock/VTL_21_TEAM_3_CONTRACT_HANDOFF_2026-04-09.md`

## Purpose

This is the complete execution plan for Team 3.

Team 3 locks the system against strategic drift:

- trust model
- affiliate policy
- disclosure rules
- VC proof routing
- launch governance
- KPI and reporting expectations

## Team Mission

Protect the founder lock so the system grows as a proof-based ecosystem instead of collapsing into misleading commerce, weak claims, or affiliate drift.

## Non-Negotiable Rules

- no affiliate in public layer
- no affiliate in annual-only layer
- no MLM or multi-tier commission
- no earnings guarantee language
- VC remains public trust layer, not gated premium content
- disclosure must exist where pricing, routing, proof, and affiliate state can be misunderstood
- launch cannot proceed without auditable event naming and compliance checks

## Scope Owned by Team 3

- affiliate eligibility matrix
- compliance-pass requirements
- disclosure and compliance rules
- trust language rules
- VC extension and proof-routing rules
- KPI vocabulary
- launch-gate checklist
- audit and payout-readiness expectations

## Scope Team 3 Must Not Drift Into

- homepage layout
- route and session implementation
- pricing changes
- gateway implementation details beyond policy and required events
- CTA design behavior owned by Team 2

## File Ownership

Primary write scope:

- `src/data/team3-policy-matrix.json`
- `src/data/certificates.json`
- `workers/vc-worker.mjs`
- `scripts/check.mjs`
- Team 3 docs under `docs/final-lock`

Shared but coordinate before broad edits:

- `scripts/build.mjs`

Do not own:

- `workers/generic-worker.mjs`
- `workers/lib/*`
- `src/shared/app.js`
- `src/shared/style.css`

## Inputs Required From Other Teams

From Team 1:

- final member-state taxonomy
- normalized event vocabulary
- pack ownership state model
- webhook contract outputs
- entitlement fields used for eligibility checks

From Team 2:

- surface placement map
- homepage and subdomain CTA insertion points
- pricing display states
- confirmation surfaces requiring disclosure acknowledgment

## Outputs Team 3 Must Publish

- affiliate eligibility matrix
- disclosure and compliance checklist
- VC extension and proof-routing matrix
- KPI and reporting event matrix
- launch-gate checklist
- stop-rule escalation list

## Execution Status Snapshot (as of 2026-04-10)

Already delivered (kickoff baseline):

- Team 3 kickoff lock in `docs/final-lock/VTL_12_TEAM_3_KICKOFF_48H.md`
- Team 3 contract handoff in `docs/final-lock/VTL_21_TEAM_3_CONTRACT_HANDOFF_2026-04-09.md`
- affiliate policy direction
- VC proof-routing direction
- disclosure and launch-go baseline

In progress now:

- validate Team 2 rollout evidence against locked `DPM-001..DPM-021` map
- keep Team 3 machine-readable contract checks green during Team 1/Team 2 runtime iterations
- finalize launch-go closure mapping with Team 1 runtime-truth and Team 2 disclosure evidence

External contract status:

- `T3-T1-001`: final member-state machine + normalized event vocabulary lock (P0, done)
- `T3-T1-002`: entitlement and pack ownership fields for affiliate eligibility lock (P1, done)
- `T3-T1-003`: webhook outputs required for compliance and payout-audit dependencies (P1, done and machine-checkable via Team 3 policy matrix + `scripts/check.mjs`)
- `T3-T2-001`: disclosure insertion-point map by surface (done, locked in `VTL_20`)
- `T3-T2-002`: confirmation surfaces requiring disclosure acknowledgment (done, locked in `VTL_20`)
- `T3-T2-003`: pricing display states by page and CTA state (done, locked in `VTL_20`)
- `T3-T2-004`: CTA insertion points for trust and affiliate-disabled messaging (done, locked in `VTL_20`)

Source of truth for cross-team status:

- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Priority Queue and Dependency Gates

| Priority | Item | Owner | Blocks Which Team 3 Output | Team 3 Action Until Unblocked |
| --- | --- | --- | --- | --- |
| P0 | `T3-T1-001` state machine + event vocabulary lock | Team 1 | final required event list + launch-go mapping | freeze Team 3 event names to currently consumed set and do not invent new runtime states |
| P0 | `T3-T2-001` disclosure insertion-point map | Team 2 | disclosure checklist finalization | locked; Team 3 now validates Team 2 render evidence for each DPM row |
| P1 | `T3-T1-002` entitlement and pack fields lock | Team 1 | affiliate eligibility matrix final machine-readable contract | keep eligibility logic policy-level only; no runtime field assumptions |
| P1 | `T3-T1-003` webhook outputs for compliance/payout | Team 1 | payout-readiness requirements | lock maintained in Team 3 contract; continue parity checks against Team 1 runtime outputs |
| P1 | `T3-T2-002` disclosure acknowledgment surface lock | Team 2 | compliance checklist enforcement points | locked; monitor implementation coverage and acknowledgment event wiring |
| P1 | `T3-T2-003` pricing display state lock | Team 2 | pricing and routing disclosure wording by surface | locked; verify wording parity across all mapped surfaces |
| P1 | `T3-T2-004` trust/affiliate-disabled CTA points | Team 2 | trust language deployment map | locked; verify disabled-state and trust copy appear at required points |

## Sprint-by-Sprint Plan

### Sprint 0

Objective:

- freeze the business and trust boundaries

Deliverables:

- anti-drift guardrails
- affiliate denial states
- VC public-layer rule

Exit gate:

- no unresolved ambiguity about what the system must not become

### Sprint 1

Objective:

- publish policy matrices

Deliverables:

- affiliate matrix
- compliance checklist
- VC routing policy
- launch event vocabulary

Exit gate:

- Team 1 can enforce policy in runtime
- Team 2 can place copy and disclosure correctly

### Sprint 2

Objective:

- connect policy to implementation contracts

Deliverables:

- required event list
- disclosure placement requirements
- proof anchor rules
- payout-readiness requirements

Exit gate:

- policy can be mapped to runtime and UI without reinterpretation

### Sprint 3

Objective:

- operationalize trust and audit expectations

Deliverables:

- launch-gate checklist
- audit-log expectations
- risk-state definitions
- suspension and rejection states

Exit gate:

- failures and edge cases are explicit, not informal

### Sprint 4

Objective:

- final launch verification

Deliverables:

- final compliance pass
- disclosure coverage check
- KPI coverage check
- go / no-go recommendation

Exit gate:

- the system is auditable and policy-consistent end to end

## Workstreams

### WS1 — Affiliate Governance

- eligibility states
- compliance pass
- denial reasons
- suspension reasons

### WS2 — VC and Proof Governance

- allowed VC statuses
- proof anchors
- proof-routing restrictions
- denied sales-to-proof shortcuts

### WS3 — Disclosure and Legal Surface Rules

- pricing disclosure
- routing disclosure
- affiliate disclosure
- proof disclosure

### WS4 — KPI and Reporting

- required events
- owners
- launch minimum instrumentation
- payout-readiness tracking

### WS5 — Launch Governance

- stop rules
- auditability
- launch gate
- severity model

## Mandatory Cross-Team Coordination Protocol

Team 3 must always coordinate with Team 1 and Team 2 before any policy handoff is considered complete.

Mandatory rules:

- every Team 3 handoff must specify dependency ID, owner team, impacted artifact, and expected consumption time
- every inbound blocker from Team 1 or Team 2 must receive first response in the shared report within 2 working hours
- every policy change touching runtime fields must tag Team 1 explicitly before implementation continues
- every policy change touching disclosure/copy placement must tag Team 2 explicitly before implementation continues
- no Team 3 task is considered done if `handoff sent to` and `handoff needed from` are left as `pending`
- if a dependency is blocked longer than one reporting cycle, Team 3 must escalate in the shared stop-rule section with risk level (`low`, `medium`, `high`, `critical`)

## Daily Update Protocol

Team 3 must update `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md` at:

- `09:00 ICT` start-of-day
- `13:30 ICT` contract sync when blocked or newly unblocked
- `18:00 ICT` close-of-day

Every update must include:

- policy area completed
- files changed
- constraints delivered to Team 1 and Team 2
- dependency IDs touched (`T3-T1-*` / `T3-T2-*`)
- remaining ambiguity
- launch risk level
- `handoff sent to` and `handoff needed from` values with no `pending` placeholder unless explicitly justified

Team 3 reporting is incomplete if any of the following happens:

- changed files are missing while policy impact is claimed
- risk level is missing after a blocker update
- dependency ID is missing for cross-team requests
- update exists in Team 3 docs but not in `VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Definition of Done

Team 3 is done only when:

- affiliate policy cannot be misread
- disclosure requirements are explicit
- VC trust layer rules are explicit
- Team 1 runtime decisions map to policy
- Team 2 surfaces can display required trust language and disclosures correctly

## Copy-Paste Execution Prompt

```text
Bạn là Team 3 của hệ Về Tương Lai. Bạn chỉ được tập trung vào trust, affiliate, disclosure, legal surface rules, VC proof routing, KPI và launch governance.

Đọc theo thứ tự:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_05_SPECIALIST_PACKS_AND_AFFILIATE_FINAL.md
4. docs/final-lock/VTL_08_FOUNDER_UPDATE_CHANGELOG_2026-04-09.md
5. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
6. docs/final-lock/VTL_12_TEAM_3_KICKOFF_48H.md
7. docs/final-lock/VTL_17_TEAM_3_EXECUTION_PLAN_COMPLETE.md
8. docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md

Luật bắt buộc:
- affiliate không bật ở public và annual-only
- VC là trust layer công khai
- không MLM, không multi-tier, không earnings guarantee
- disclosure phải có ở đúng surface
- luôn phối hợp với Team 1 và Team 2 trước khi chốt handoff policy

Đầu ra bắt buộc:
- policy matrix
- disclosure checklist
- KPI/reporting matrix
- launch gate
- cập nhật docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md đầy đủ theo nhịp `09:00`, `13:30` (khi blocked), `18:00`
- mỗi báo cáo phải có dependency ID, handoff sent/needed, risk level, file changed
```
