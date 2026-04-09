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
