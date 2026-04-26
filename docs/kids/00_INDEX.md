# KIDS — DOCS INDEX

Subdomain: `kids.vetuonglai.com`
Audience: trẻ em 6–17 tuổi và phụ huynh
Status: Member Preview · Phase 1 (Private Pilot)

## Spec docs

1. [01_UI_LEARNING_SYSTEM_SPEC.md](01_UI_LEARNING_SYSTEM_SPEC.md)
2. [02_CONTENT_SYSTEM.md](02_CONTENT_SYSTEM.md)
3. [03_PARENT_DASHBOARD_SPEC.md](03_PARENT_DASHBOARD_SPEC.md)
4. [04_SAFETY_AND_PRIVACY_POLICY.md](04_SAFETY_AND_PRIVACY_POLICY.md)
5. [05_AI_PROMPT_SYSTEM.md](05_AI_PROMPT_SYSTEM.md)
6. [06_PROJECT_LIBRARY.md](06_PROJECT_LIBRARY.md)
7. [07_LEARNING_FLOW_ENGINE.md](07_LEARNING_FLOW_ENGINE.md)
8. [08_DESIGN_SYSTEM.md](08_DESIGN_SYSTEM.md)
9. [09_QA_CHECKLIST.md](09_QA_CHECKLIST.md)
10. [10_PRODUCT_LAUNCH_PLAN_AND_GLOBAL_POSITIONING.md](10_PRODUCT_LAUNCH_PLAN_AND_GLOBAL_POSITIONING.md)
11. [11_DAY_0_LAUNCH_PLAN.md](11_DAY_0_LAUNCH_PLAN.md)
12. [12_DEPLOY_RUNBOOK.md](12_DEPLOY_RUNBOOK.md)

## Live runtime

- Curriculum data: [src/data/kids-curriculum.json](../../src/data/kids-curriculum.json)
- API contract: [src/data/kids-api-contract.json](../../src/data/kids-api-contract.json)
- Static pages: [src/static-pages/kids.vetuonglai.com/](../../src/static-pages/kids.vetuonglai.com/)
- Worker: [workers/generic-worker.mjs](../../workers/generic-worker.mjs) — host-gated kids handler
- Build entry: [scripts/build.mjs](../../scripts/build.mjs) — `renderKidsDomain()`

## Bilingual rule (lock)

Theo [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](../00_master/41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md):

- Không viết tắt trên bất kỳ surface nào của kids
- "VI / EN" → "Tiếng Việt / English"
- "AI" → "Trợ lý học" / "learning assistant"
- "VC" → "lớp xác minh độc lập" / "independent verification layer"
