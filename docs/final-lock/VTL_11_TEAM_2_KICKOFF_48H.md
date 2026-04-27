# VTL TEAM 2 KICKOFF 48H

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked
Team: Team 2 — Hub, Domain Experience, Content Surfaces

## 48-Hour Mission

In the first 48 hours, Team 2 must make the homepage purchase hub and subdomain CTA system unambiguous.

## Must Take in the First 48 Hours

- inventory every deep-content CTA across homepage and subdomains
- lock the route map from each subdomain back to homepage
- lock package chooser and pack preselect UX states
- lock teaser/demo/public-depth contract for all domains
- lock dashboard entry and `Start here` UX at homepage level

## Primary File Ownership

- [apps.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/data/apps.json)
- [courses.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/data/courses.json)
- [system.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/data/system.json)
- [app.js](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/app.js)
- [style.css](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/style.css)
- [design-tokens.css](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/design-tokens.css)
- [build.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/build.mjs)

Do not own:

- [generic-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/generic-worker.mjs)
- [vc-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/vc-worker.mjs)
- [check.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/check.mjs)

## Blockers to Request from Other Teams

- From Team 1: route parameter schema, entitlement names, member states, return-flow contract
- From Team 3: allowed trust language, disclosure placement rules, pack-policy labels, affiliate-disabled copy for annual access

## Required Output by Hour 48

- CTA inventory
- homepage purchase-hub IA
- subdomain-to-homepage route map
- pack preselect UX contract
- teaser/demo/content-depth map

## Delivery Status (Repo)

Team 2 delivery has been materialized in:

- `docs/final-lock/VTL_11_TEAM_2_OUTPUT_48H.md`
- `docs/final-lock/VTL_11_TEAM_2_BLOCKERS_FOR_TEAM1_TEAM3.md`
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md`
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
- `scripts/build.mjs`
- `scripts/check.mjs`
- generated `dist/vetuonglai.com/api/team2-kickoff-output.json`

## Copy-Paste Prompt

```text
Bạn là Team 2 của hệ Về Tương Lai. Trong 48 giờ đầu, chỉ tập trung khóa UX/content contract để tất cả domain dẫn đúng về homepage purchase hub.

Đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_02_RUNTIME_TRUTH_AND_DOMAIN_MATRIX_FINAL.md
4. docs/final-lock/VTL_04_CONTENT_GATE_SEO_AND_COPY_RULES_FINAL.md
5. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md
6. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
7. docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md

Nhiệm vụ 48 giờ:
- khóa CTA inventory và route map của mọi subdomain
- khóa homepage purchase-hub IA và package chooser UX
- khóa teaser/demo/public-depth contract
- chỉ rõ điểm nào cần Team 1 nối entitlement, điểm nào cần Team 3 nối trust/disclosure

Không làm:
- không tự thêm checkout ở subdomain
- không tự viết billing logic
- không đổi pack taxonomy

Đầu ra bắt buộc:
- component map
- CTA map
- route map
- blockers cần xin Team 1 và Team 3
```
