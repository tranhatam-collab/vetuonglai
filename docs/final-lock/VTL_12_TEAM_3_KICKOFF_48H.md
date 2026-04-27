# VTL TEAM 3 KICKOFF 48H

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked
Team: Team 3 — Trust, Affiliate, Legal, Analytics, Ops

## 48-Hour Mission

In the first 48 hours, Team 3 must lock the trust, affiliate, policy, and launch rules so the system cannot drift into the wrong business model.

## Must Take in the First 48 Hours

- lock affiliate eligibility after annual access plus specialist-pack ownership
- lock no-affiliate-at-public-layer and no-affiliate-at-annual-only rules
- lock VC extension scope, credential triggers, and proof-routing rules
- lock legal/trust disclosure requirements around pricing, routing, proof, and checkout
- lock runtime KPI and launch-gate checklist

## Primary File Ownership

- [vc-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/vc-worker.mjs)
- [certificates.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/data/certificates.json)
- [check.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/check.mjs)
- Any new policy, affiliate, KPI, or disclosure files created under `/src/data` or `/docs`

Do not own:

- [app.js](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/app.js)
- [style.css](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/style.css)
- [generic-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/generic-worker.mjs)
- [build.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/build.mjs)

## Blockers to Request from Other Teams

- From Team 1: member-state definitions, webhook event names, entitlement statuses, pack ownership statuses
- From Team 2: CTA placements, homepage pricing display states, pack-label usage, disclosure insertion points on pages

## Required Output by Hour 48

- affiliate eligibility matrix
- VC extension and proof-routing matrix
- disclosure and compliance checklist
- KPI and reporting event list
- launch-gate checklist

## Copy-Paste Prompt

```text
Bạn là Team 3 của hệ Về Tương Lai. Trong 48 giờ đầu, chỉ tập trung khóa trust, affiliate, legal và launch rules để Team 1 và Team 2 không build lệch mô hình.

Đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_05_SPECIALIST_PACKS_AND_AFFILIATE_FINAL.md
4. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md
5. docs/final-lock/VTL_08_FOUNDER_UPDATE_CHANGELOG_2026-04-09.md
6. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
7. docs/final-lock/VTL_12_TEAM_3_KICKOFF_48H.md

Nhiệm vụ 48 giờ:
- khóa affiliate eligibility matrix
- khóa VC extension scope và proof-routing rules
- khóa disclosure/compliance requirements
- khóa KPI, reporting, launch-gate checklist

Không làm:
- không đổi homepage pricing
- không bật affiliate ở annual-only layer
- không biến VC thành trang gated content

Đầu ra bắt buộc:
- policy matrix
- reporting matrix
- blockers cần xin Team 1 và Team 2
```

## Team 3 48H Execution Update (Locked Direction)

Based on:

- `docs/PROJECT_CONTEXT_ENGINE.md`
- `docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md`
- `docs/final-lock/VTL_05_SPECIALIST_PACKS_AND_AFFILIATE_FINAL.md`
- `docs/final-lock/VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md`
- `docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md`
- `docs/final-lock/VTL_08_FOUNDER_UPDATE_CHANGELOG_2026-04-09.md`
- `docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md`

### Guardrails (Do Not Break)

- homepage is the only purchase hub
- annual access is base layer only, not specialist depth
- affiliate is never enabled in public layer
- affiliate is never enabled at annual-only layer
- VC stays trust registry layer, not a gated content product
- no multi-tier, MLM, or forced recruiting logic

### Hour-by-Hour Plan (First 48 Hours)

| Window | Priority | Output locked in window |
| --- | --- | --- |
| H0-H4 | Alignment freeze | confirm final-lock assumptions, ownership boundaries, anti-overlap notes |
| H4-H10 | Affiliate policy | publish affiliate eligibility matrix with explicit allow/deny states |
| H10-H16 | VC extension policy | publish VC extension scope and proof-routing matrix |
| H16-H24 | Legal/trust baseline | publish disclosure and compliance checklist for checkout, routing, and proof |
| H24-H32 | Analytics contract | publish KPI vocabulary and reporting event matrix |
| H32-H40 | Launch governance | publish launch-gate checklist and stop-rules mapping |
| H40-H48 | Cross-team handoff | publish blockers list and dependency requests to Team 1 and Team 2 |

## Policy Matrix 1: Affiliate Eligibility

| Condition set | Public visitor | Registered only (no annual) | Annual only | Annual + pack | Annual + pack + compliance pass |
| --- | --- | --- | --- | --- | --- |
| Eligibility state | denied | denied | denied | pending compliance | eligible |
| Referral link generation | no | no | no | no | yes |
| Commission accrual | no | no | no | no | yes |
| Payout eligibility | no | no | no | no | yes |
| Legal disclosure requirement | N/A | N/A | N/A | required before activation | required and logged |

Compliance pass requires all:

- valid paid member state
- valid paid specialist-pack ownership
- identity confirmed
- no active refund-abuse flag
- no fraud/spam risk flag

Hard policy lock:

- direct referral only
- no multi-tier commission
- no MLM graph logic
- no earnings guarantee language

## Policy Matrix 2: VC Extension and Proof Routing

| Flow | Trigger | VC action | Proof route | Status |
| --- | --- | --- | --- | --- |
| EDU completion to VC record | verified learning outcome | create or update credential entry | `edu -> vc registry` | allowed |
| Pack completion with evidence | specialist-pack outcome validated | create extension metadata tied to credential path | `pack outcome -> vc proof reference` | allowed |
| Pending review case | evidence incomplete or mentor pending | mark as `reviewing` only | `issuer review queue -> vc` | allowed with restriction |
| Planned template record | future program blueprint | mark as `planned`, no claims of issuance | `internal template -> vc sample` | allowed with disclosure |
| Affiliate sales claim as VC proof | sales-only event without outcome evidence | no VC credential issuance | none | denied |

VC trust lock:

- VC record requires explicit proof anchor fields (`contentHash` minimum)
- status vocabulary is controlled (`verified`, `reviewing`, `planned`)
- proof route must identify issuer domain and verification intent
- VC pages remain public trust pages, never paywalled

## Policy Matrix 3: Disclosure and Compliance Checklist

| Area | Mandatory disclosure | Enforcement point |
| --- | --- | --- |
| Pricing | annual pricing ladder and pack pricing are separate layers | homepage purchase and pack detail surfaces |
| Affiliate | activates only after annual + qualifying pack + compliance pass | affiliate onboarding and referral dashboard |
| Earnings language | no guarantee, no fast-income claim, no public-layer auto-commission | sales copy review gate |
| VC proof | VC confirms proof direction, not guaranteed income | VC record detail page and issuer explanation |
| Routing | deep content and purchase intent route to homepage hub | subdomain CTA contract and route checks |
| Refund/fraud | anti-abuse and fraud flags can suspend affiliate state | compliance state machine and payout gate |
| Data logging | activation, state changes, and payout decisions are auditable | reporting pipeline and weekly compliance log |

## Reporting Matrix: KPI and Event Vocabulary

| KPI | Event source | Definition | Owner |
| --- | --- | --- | --- |
| Affiliate activation rate | affiliate events | `eligible_activated / eligible_candidates` | Team 3 |
| Compliance rejection rate | compliance events | `rejected / activation_attempts` | Team 3 |
| Pack-to-affiliate conversion | commerce + affiliate | activated affiliates who own qualifying pack | Team 1 + Team 3 |
| VC verified issuance count | VC events | count of records reaching `verified` status | Team 3 |
| Proof review cycle time | VC workflow events | median time from `submitted` to final status | Team 3 |
| Payout readiness ratio | payout events | affiliates passing payout checks per cycle | Team 3 |
| Disclosure coverage | QA/legal events | % required surfaces with required disclosures present | Team 2 + Team 3 |

### Required Event List (Launch Minimum)

- `annual_access_confirmed`
- `specialist_pack_purchased`
- `affiliate_activation_requested`
- `affiliate_activation_approved`
- `affiliate_activation_rejected`
- `affiliate_state_suspended`
- `vc_record_created`
- `vc_record_status_changed`
- `proof_submission_received`
- `proof_review_completed`
- `payout_cycle_opened`
- `payout_cycle_closed`
- `compliance_flag_raised`
- `disclosure_acknowledged`

## Launch-Gate Checklist (Team 3 Scope)

Launch can proceed only when all are true:

- affiliate is technically impossible for public and annual-only states
- annual and pack layers remain separate in eligibility logic
- VC record rules enforce proof anchors and controlled statuses
- disclosure blocks are present at all required affiliate and proof touchpoints
- KPI events are emitted, named consistently, and mapped to owners
- payout logic is gated by compliance state and audit logs
- stop-rules from execution board are tested and documented

## Blockers Required from Team 1

- final member-state taxonomy and transition rules
- annual access payment success/fail/refund event names
- pack ownership state model (`pending`, `paid`, `refunded`, `revoked`)
- entitlement contract fields for affiliate eligibility calculation
- webhook contract for compliance and payout dependency events

## Blockers Required from Team 2

- canonical CTA insertion points for disclosure and trust copy
- homepage and subdomain placement map for affiliate policy text
- pack-label and pricing-context usage rules in UI components
- route-state map for deep-content to homepage handoff
- confirmation surfaces where users must acknowledge disclosures
