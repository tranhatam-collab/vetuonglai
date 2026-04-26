# 00_MASTER_HANDOFF_INDEX

## Founder Lock Bắt Buộc

Đây là cổng vào bắt buộc cho mọi team trước khi chạm vào code, nội dung, thiết kế, QA, hay vận hành.

Quyết định này đã được nhà sáng lập Ông Trần Hà Tâm ký khóa.

- Không được thay đổi
- Không được thiếu nội dung
- Không được merge nếu chưa đọc

---

## 1. Bộ khóa nền bắt buộc

1. `docs/00_master/00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md`
2. `docs/00_master/17_TEAM_EXECUTION_PLAN_MOBILE_AND_SUBDOMAINS.md`
3. `docs/00_master/18_PHASE_2_CHECKLIST_MOBILE_AND_PLANNED_SUBDOMAINS.md`
4. `docs/00_master/22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
5. `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
6. `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
7. `docs/00_master/28_PACKAGING_AND_FORMS_SYSTEM_FULL.md`
8. `docs/00_master/29_REAL_CONVERSION_FLOW_AND_UI_SPEC.md`
9. `docs/00_master/30_FULL_SYSTEM_TEST_PLAN.md`
10. `docs/00_master/31_LAUNCH_PLAYBOOK_VETUONGLAI.md`
11. `docs/00_master/32_FULL_SYSTEM_DEPLOYMENT_CHECKLIST.md`
12. `docs/00_master/33_FULL_OPERATING_SYSTEM_DASHBOARD.md`
13. `docs/00_master/34_FOUNDER_COMMAND_PANEL_AI_SYSTEM.md`
14. `docs/00_master/35_FOUNDER_AI_AUTOPILOT_SYSTEM.md`
15. `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`
16. `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md`
17. `docs/00_master/40_OWNER_EXECUTION_BOARD_V1.md`

---

## 2. Mô hình team đang áp dụng

Từ cycle `2026-04-21`, toàn hệ chạy theo mô hình `5 team`.

- Team 1 — Lead Platform / Runtime / Release Control
- Team 2 — Product / Frontend / Mobile / Panel UI
- Team 3 — Docs / Ops / Governance / QA Gate
- Team 4 — Data / Metrics / Founder Backend
- Team 5 — AI / Autopilot / Intelligence Layer

Rule khóa:

- Team 1 chịu trách nhiệm chính và tổng hợp tiến độ toàn hệ.
- Mỗi lượt dev phải có `% hoàn thành` và `% còn lại`.
- Team 3 audit cách tính phần trăm và evidence.
- Không team nào được tự mở scope ngoài board trung tâm.

---

## 3. Bộ file execution phải đọc cùng nhau

- `docs/00_master/03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`
- `docs/00_master/04_PUBLIC_TEASER_CONTRACT_ALL_SUBDOMAINS.md`
- `docs/00_master/10_DEV_EXECUTION_SEQUENCE_MASTER.md`
- `docs/00_master/12_RUNTIME_TRUTH_MASTER.md`
- `docs/00_master/14_DESIGN_SYSTEM_MASTER.md`
- `docs/00_master/24_API_SPEC_FULL_V1.md`
- `docs/00_master/25_DATABASE_SCHEMA_SQL_PRODUCTION.md`
- `docs/00_master/26_AI_PROMPT_SYSTEM_MASTER.md`
- `docs/00_master/32_RUNTIME_TRUTH_MATRIX_V1.md`
- `docs/00_master/33_LANGUAGE_CODEX_AND_I18N_SYSTEM.md`
- `docs/00_master/34_PUBLIC_TEASER_AND_GATEWAY_CONTRACT.md`
- `docs/00_master/35_ENTITLEMENT_AND_ACCESS_CONTROL_SPEC.md`
- `docs/00_master/36_SUBMISSION_AND_REVIEW_ENGINE.md`
- `docs/00_master/37_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES.md`
- `docs/00_master/38_DEV_SEQUENCE_LOCK.md`

---

## 4. Quy tắc naming

- UPPERCASE + số thứ tự + tên rõ nghĩa
- File toàn hệ: không dùng prefix subdomain
- File subdomain: bắt buộc prefix (`ROOT_`, `EDU_`, `VC_`, ...)

---

## 5. Trạng thái

- status: active
- owner: founder + Team 1 lead + Team 3 governance
- last_updated: 2026-04-21
