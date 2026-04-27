# VTL TEAM 1 EXECUTION PLAN COMPLETE

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: active
Team: Team 1 — Platform, Access, Commerce Core
Companion files:

- `docs/final-lock/VTL_10_TEAM_1_KICKOFF_48H.md`
- `docs/final-lock/VTL_13_TEAM_1_CONTRACT_HANDOFF_2026-04-09.md`
- `docs/final-lock/VTL_14_TEAM_1_WORKER_SESSION_ENV_CONTRACT_2026-04-09.md`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

## Purpose

This is the complete execution plan for Team 1.

Team 1 owns the platform contract that every other team depends on:

- identity
- access
- annual access commerce
- specialist pack commerce
- session
- routing
- provisioning
- runtime integration points

If Team 1 is ambiguous, Team 2 and Team 3 will build the wrong system.

## Team Mission

Build and lock the access and commerce backbone so the whole ecosystem can use one homepage purchase hub, one entitlement source, and one runtime truth.

## Non-Negotiable Rules

- homepage is the only purchase hub
- no subdomain-local checkout
- annual access is the base layer only
- specialist packs are separate from annual access
- affiliate never activates in public layer
- affiliate never activates at annual-only layer
- provisioning only happens after verified webhook handling
- magic link is identity only; entitlement remains in VTL runtime
- member domain can be staged as a dedicated worker target before it becomes required-public in runtime truth

## Scope Owned by Team 1

- member states
- entitlements
- billing objects
- webhook normalization
- provisioning sequence
- session and cookie contract
- checkout resolver contract
- cross-domain routing contract
- worker runtime endpoints
- payment gateway integration contract for PayPal and Stripe

## Scope Team 1 Must Not Drift Into

- homepage IA or visual layout
- content marketing copy
- pack naming changes
- trust/legal language beyond contract fields
- VC public registry behavior not directly required for access runtime

## File Ownership

Primary write scope:

- `workers/generic-worker.mjs`
- `workers/lib/*`
- `cloudflare/workers-projects.json`
- `scripts/deploy-workers.mjs`
- `src/data/access-model.json`
- Team 1 docs under `docs/final-lock`

Shared but coordinate before broad edits:

- `scripts/build.mjs`
- `scripts/check.mjs`

Do not own:

- `src/shared/app.js`
- `src/shared/style.css`
- `workers/vc-worker.mjs`
- `src/data/certificates.json`

## Inputs Required From Other Teams

From Team 2:

- homepage purchase-hub entry states
- CTA route parameter usage
- pack preselect UI contract
- return-flow landing expectations
- dashboard entry behavior

From Team 3:

- affiliate eligibility gates
- disclosure requirements by surface
- compliance-pass requirements
- proof-routing restrictions
- launch-gate event vocabulary

## Outputs Team 1 Must Publish

- machine-readable access model
- machine-readable events model
- route contract
- runtime worker endpoints
- checkout resolution contract
- route normalization contract
- Team 3 policy binding contract
- webhook verification modes
- session lifecycle contract

## Sprint-by-Sprint Plan

### Sprint 0

Objective:

- lock product taxonomy in runtime and data contracts

Deliverables:

- member states confirmed
- entitlements confirmed
- annual and pack billing objects separated
- Team 3 dependency declared

Exit gate:

- no unresolved naming conflict across identity states, event names, and entitlements

### Sprint 1

Objective:

- publish the first stable contract set for Team 2 and Team 3

Deliverables:

- `access-model.json`
- member contract APIs
- routing contract
- webhook event vocabulary

Exit gate:

- Team 2 can consume route and CTA params without guessing
- Team 3 can consume event names and state names without guessing

### Sprint 2

Objective:

- implement runtime skeleton

Deliverables:

- worker routes for access health and contracts
- pending-member lifecycle
- magic-link request contract
- PayPal webhook skeleton
- Stripe webhook skeleton

Exit gate:

- runtime can normalize and return deterministic machine-readable decisions
- Team 2 can validate alias support, source/slug pass-through, and pack fallback without guessing

### Sprint 3

Objective:

- harden runtime behavior

Deliverables:

- session create / current / logout
- webhook dedupe
- checkout resolver
- PayPal verification mode
- Stripe verification mode

Exit gate:

- smoke test passes
- Team 2 can wire real gateway intent entry
- Team 3 can audit runtime decisions and required events

### Sprint 4

Objective:

- prepare for production wiring

Deliverables:

- final env contract
- secret naming lock
- Pages / Worker deployment handoff notes
- failure-mode contract
- provider readiness route for ops verification
- route normalization endpoint for Team 2 CTA/runtime integration
- policy bindings endpoint for Team 3 audit/no-drift verification

Exit gate:

- production env names are explicit
- runtime is ready for live secret injection and real provider callbacks
- Team 2 and Team 3 can sign off against machine-readable Team 1 routes instead of docs only

## Workstreams

### WS1 — Identity and Session

- pending-member state
- magic link issuance
- session issuance
- session read and logout

### WS2 — Commerce Model

- annual access billing object
- specialist pack billing object
- gateway routing
- provider normalization

### WS3 — Webhook Runtime

- PayPal subscription lifecycle
- PayPal order lifecycle
- Stripe checkout and subscription lifecycle
- refund and past-due transitions

### WS4 — Checkout Resolution

- homepage-only gateway resolution
- provider-specific checkout URL resolution
- pack-specific checkout URL resolution
- return-to and entry-state normalization

### WS5 — Deployment Contract

- worker route exposure
- env names
- Cloudflare runtime expectations
- storage mode expectations

## Daily Update Protocol

Team 1 must update `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md` at:

- start of day
- after any completed handoff
- end of day

Every update must include:

- status: `done`, `next`, `blocked`
- file paths changed
- dependencies requested from Team 2 or Team 3
- dependencies delivered to Team 2 or Team 3
- open risk if any

## Definition of Done

Team 1 is done only when:

- the access model is stable
- checkout resolution is stable
- session flow is stable
- both PayPal and Stripe are normalized into one event vocabulary
- Team 2 and Team 3 can work from Team 1 contracts without reopening product questions

## Copy-Paste Execution Prompt

```text
Bạn là Team 1 của hệ Về Tương Lai. Bạn chỉ được tập trung vào platform, access, commerce core, session, routing, provisioning và runtime contract.

Đọc theo thứ tự:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
4. docs/final-lock/VTL_10_TEAM_1_KICKOFF_48H.md
5. docs/final-lock/VTL_13_TEAM_1_CONTRACT_HANDOFF_2026-04-09.md
6. docs/final-lock/VTL_14_TEAM_1_WORKER_SESSION_ENV_CONTRACT_2026-04-09.md
7. docs/final-lock/VTL_15_TEAM_1_EXECUTION_PLAN_COMPLETE.md
8. docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md

Luật bắt buộc:
- homepage là purchase hub duy nhất
- không có checkout riêng ở subdomain
- annual access là lớp base
- pack là lớp depth riêng
- affiliate không bao giờ bật ở annual-only

Đầu ra bắt buộc:
- contract rõ
- runtime rõ
- gateway rõ
- handoff rõ
- cập nhật docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md sau mỗi lần xong việc
```
