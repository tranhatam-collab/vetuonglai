# VTL TEAM SPLIT WORKLOAD AND PROMPTS FINAL

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked

## Team Split

### Team 1 — Platform, Access, Commerce Core

Owns:

- member identity
- annual subscription flow
- specialist pack checkout flow
- entitlement service
- webhook handling
- routing contract between subdomains and homepage hub

Does not own:

- marketing copy
- teaser writing
- VC disclosure language

Estimated load:

- 58 points

### Team 2 — Hub, Domain Experience, Content Surfaces

Owns:

- homepage purchase hub UX
- teaser and demo system across subdomains
- CTA and package-choice experience
- dashboard and onboarding UX
- content depth presentation rules

Does not own:

- billing verification logic
- affiliate payout logic
- trust-registry rules

Estimated load:

- 47 points

### Team 3 — Trust, Affiliate, Legal, Analytics, Ops

Owns:

- VC flow extensions
- specialist-pack affiliate rules
- reporting and payout logic
- legal/trust policy alignment
- runtime KPI and launch gate

Does not own:

- homepage page-builder work
- auth session internals
- subdomain UI layout ownership

Estimated load:

- 43 points

## Team Operating Rules

1. Every team reads the full final-lock pack before coding.
2. Every team works from contracts, not assumptions.
3. No team edits another team's primary files without sync approval.
4. Every day starts with blockers, dependencies, and handoff needs.
5. If pricing, copy, or entitlement changes, stop and re-check the lock pack.

## Prompt for Team 1

```text
Bạn là Team 1 của hệ Về Tương Lai.

Trước khi làm bất kỳ code nào, hãy đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_03_ACCESS_PRICING_AND_ENTITLEMENT_FINAL.md
4. docs/final-lock/VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md
5. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md

Nhiệm vụ của bạn:
- thiết kế annual-access subscription flow cho homepage
- thiết kế pack purchase flow riêng
- khóa entitlement matrix
- định nghĩa webhook, member state, pending state, and cross-domain routing contract
- đưa ra file/API/schema cần có để Team 2 và Team 3 tích hợp

Không làm:
- không viết lại marketing copy
- không tự đổi pack taxonomy
- không gộp annual access và specialist pack thành một loại sản phẩm

Đầu ra bắt buộc:
- contract rõ ràng
- dependency rõ ràng
- file ownership rõ ràng
- danh sách blocker cho Team 2 và Team 3
```

## Prompt for Team 2

```text
Bạn là Team 2 của hệ Về Tương Lai.

Trước khi làm bất kỳ code nào, hãy đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_02_RUNTIME_TRUTH_AND_DOMAIN_MATRIX_FINAL.md
4. docs/final-lock/VTL_04_CONTENT_GATE_SEO_AND_COPY_RULES_FINAL.md
5. docs/final-lock/VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md
6. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md

Nhiệm vụ của bạn:
- chuẩn hóa teaser/demo/CTA trên mọi subdomain
- biến homepage thành purchase hub chính
- chuẩn hóa luồng từ subdomain về homepage với pack preselect
- thiết kế dashboard/member entry ở mức UX/content contract
- giữ toàn bộ public layer sạch, indexable, và đúng SEO/paywall rules

Không làm:
- không tự cài billing logic
- không tự định nghĩa affiliate logic
- không để subdomain có checkout riêng

Đầu ra bắt buộc:
- component map
- CTA map
- route map
- content-depth map
- handoff contract để Team 1 nối entitlement và Team 3 nối trust/affiliate
```

## Prompt for Team 3

```text
Bạn là Team 3 của hệ Về Tương Lai.

Trước khi làm bất kỳ code nào, hãy đọc:
1. docs/PROJECT_CONTEXT_ENGINE.md
2. docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md
3. docs/final-lock/VTL_05_SPECIALIST_PACKS_AND_AFFILIATE_FINAL.md
4. docs/final-lock/VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md
5. docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md
6. docs/final-lock/VTL_08_FOUNDER_UPDATE_CHANGELOG_2026-04-09.md

Nhiệm vụ của bạn:
- khóa rule cho VC extension, proof direction, credential path
- khóa affiliate activation rule sau annual access + specialist pack
- thiết kế analytics, commission, reporting, payout, legal/trust policy
- chuẩn hóa runtime KPI và launch gates

Không làm:
- không tự viết lại homepage pricing
- không mở affiliate ở lớp public/annual access
- không làm cho VC thành gated content site

Đầu ra bắt buộc:
- policy matrix
- event and reporting matrix
- trust and disclosure rules
- payout and compliance checklist
- blockers cần Team 1 hoặc Team 2 giải quyết
```
