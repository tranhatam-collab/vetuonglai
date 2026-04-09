# VTL TEAM 1 KICKOFF 48H

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked
Team: Team 1 — Platform, Access, Commerce Core

## 48-Hour Mission

In the first 48 hours, Team 1 must publish the contracts that unblock every other team.

## Must Take in the First 48 Hours

- lock member states: `visitor`, `pending_member`, `active_member`, `pack_holder`, `verified`
- lock entitlement names for annual access and the 9 specialist packs
- define annual-access subscription object and specialist-pack order object
- define webhook events, provisioning sequence, and return-flow parameters
- define cross-domain routing contract from subdomains back to homepage purchase hub

## Primary File Ownership

- [generic-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/generic-worker.mjs)
- [workers-projects.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/cloudflare/workers-projects.json)
- [deploy-workers.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/scripts/deploy-workers.mjs)
- Any new access, billing, session, or entitlement files under `/workers` and `/cloudflare`

Do not own:

- [app.js](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/app.js)
- [style.css](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/shared/style.css)
- [certificates.json](/Users/tranhatam/Documents/New%20project/vetuonglai-system/src/data/certificates.json)
- [vc-worker.mjs](/Users/tranhatam/Documents/New%20project/vetuonglai-system/workers/vc-worker.mjs)

## Blockers to Request from Other Teams

- From Team 2: homepage route names, CTA parameter names, pack preselect UI contract, purchase-hub entry states
- From Team 3: final pack IDs, affiliate-off states, VC issuance trigger rules, disclosure requirements around checkout and proof

## Required Output by Hour 48

- member-state and entitlement matrix
- webhook event contract
- cross-domain route contract
- file/API/schema handoff for Team 2 and Team 3

## Copy-Paste Prompt

```text
Bạn là Team 1 của hệ Về Tương Lai. Trong 48 giờ đầu, chỉ tập trung khóa contract để unblock Team 2 và Team 3.

Đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_03_ACCESS_PRICING_AND_ENTITLEMENT_FINAL.md
4. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md
5. docs/final-lock/VTL_09_EXECUTION_BOARD_1_PAGE_2026-04-09.md
6. docs/final-lock/VTL_10_TEAM_1_KICKOFF_48H.md

Nhiệm vụ 48 giờ:
- khóa member states và entitlement matrix
- khóa annual-access subscription object và specialist-pack order object
- khóa webhook events, provisioning sequence, return params, route contract
- chỉ ra chính xác file/API/schema Team 2 và Team 3 sẽ consume

Không làm:
- không sửa marketing copy
- không đổi pricing
- không gộp annual access và specialist pack

Đầu ra bắt buộc:
- contract rõ ràng
- write scope rõ ràng
- blockers cần xin Team 2 và Team 3
```
