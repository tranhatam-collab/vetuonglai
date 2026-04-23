# EXECUTION_BOARD_VETUONGLAI_V1

## Founder Lock Bắt Buộc

Mọi owner phải đọc xong các file sau trước khi nhận task:

- `docs/00_master/00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md`
- `docs/00_master/22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
- `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
- `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
- `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`

Quyết định đã ký bởi Ông Trần Hà Tâm. Không được đổi scope. Không được thiếu nội dung.

---

## Mục tiêu board hiện tại

- giữ core loop xanh
- mở mô hình `5 team` để tăng tốc đúng chỗ
- đưa founder command panel + autopilot vào build lane nội bộ
- buộc Team 1 lead báo `% còn lại` sau mỗi lượt dev

## Snapshot điều phối mới nhất (2026-04-22 18:02 ICT)

- founder lane execution đã khóa xong:
  - `100% / 0%`
  - không còn dependency dev mở giữa 5 team trong lane này
- member required-public promote đã pass
- founder live release verify đã pass lại trên runtime live mới nhất
- Team 3 parity đã `go` sau patch build hygiene
- core live redeploy bước đầu đã pass lại cho:
  - `home`
  - `member`
  - `edu`
  - `green`
  - `finance`
- build pipeline đã được khóa thêm:
  - dọn sạch `dist`
  - build lock chống va chạm khi verify song song
- Wave B — Mobile V1 Closure đã chốt verify pass
- Wave C — Core Subdomains Hardening đang ở trạng thái `hardening_ready / promotion_blocked`
- Wave D — Planned-safe rollout hiện đã có shell local + Pages publish plan + deploy/verify runbook cho toàn cụm, nhưng blocker active vẫn là `public DNS`
- trọng tâm active của tổng kế hoạch hiện tại là:
  - chốt signoff Wave C
  - khóa DNS/runtime publish cho Wave D
  - rồi mới gom Wave E — Release/QA/Ops pack toàn hệ

## Board điều phối chi tiết đang active

- rollup live + evidence mới nhất:
  - `docs/final-lock/VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md`
- rollup tiến độ mới nhất sau Wave B + Wave D local-ready:
  - `docs/final-lock/VTL_53_WAVE_B_D_RUNTIME_PROGRESS_ROLLUP_2026-04-22.md`
- blocker publish mới nhất của Wave D:
  - `docs/final-lock/VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md`
- runbook deploy/verify mới nhất của Wave D:
  - `docs/final-lock/VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md`
- release/signoff pack mới nhất của Wave C:
  - `docs/final-lock/VTL_56_WAVE_C_RELEASE_NOTE_LIFE_INVEST_2026-04-22.md`
  - `docs/final-lock/VTL_57_QA_PM_OPS_SIGNOFF_CHECKLIST_WAVE_C_2026-04-22.md`
- channel mapping + 15 phút dev reminder active:
  - `docs/final-lock/VTL_58_AUTOMATED_TEAM_CHANNEL_MAPPING_AND_15_MIN_DEV_REMINDER_2026-04-23.md`
- board continuation 5 team cho toàn hệ:
  - `docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md`
- Team 3 audit/go-no-go active cho wave hiện tại:
  - `docs/final-lock/VTL_49_WAVE_B_MOBILE_CLOSURE_GO_NO_GO_2026-04-22.md`
  - `docs/final-lock/VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md`
  - `docs/final-lock/VTL_51_PLANNED_SAFE_NOTES_WORK_MARKET_COMMUNITY_AI_BUSINESS_2026-04-22.md`

Nếu có tài liệu cũ hơn mâu thuẫn với ba file trên trong phạm vi Wave B / Wave C / Wave D, team phải bám snapshot active ngày `2026-04-22` cho lane hiện tại, không tự suy diễn theo status cũ.

---

## Owner map theo team

- Team 1 — Lead Platform / Runtime / Release Control
- Team 2 — Frontend / UX / Mobile / Public Surfaces
- Team 3 — Governance / Runtime Truth / QA Gate
- Team 4 — Data / Registry / Forms / Content Contracts
- Team 5 — Smoke / Strict Contract / Release Verification

---

## SPRINT 1 — CORE + TEAM MODEL LOCK (`completed_for_founder_lane`)

### Team 1

- giữ member/access/runtime xanh
- tổng hợp progress `5` team
- khóa dependency map cho Team 4 và Team 5

### Team 2

- tiếp tục public layer, dashboard, mobile parity
- không để founder panel UI drift khỏi contract

### Team 3

- tạo spec `36`
- nâng cấp board / report sang mô hình `5 team`
- khóa `% hoàn thành / % còn lại`

### Team 4

- chốt founder backend data entities
- chốt read APIs

### Team 5

- chốt insight / action schema
- chốt prompt + guardrails

### DoD

- mô hình `5 team` đã có trên toàn bộ board trung tâm
- Team 1 có template lead rollup
- Team 4 và Team 5 có lane start rõ
- founder command panel + autopilot lane đã chốt execution `100% / 0%`

---

## SPRINT 2 — CORE HARDENING + FOUNDER DATA PLANE (`active_next`)

### Team 1

- auth / entitlement / guarded route / permission model

### Team 2

- member / edu / vc / mobile parity
- founder overview shell UI

### Team 3

- trust wording review
- planned-safe review

### Team 4

- `/api/founder/overview`
- `/api/founder/system-health`
- `/api/founder/journey-funnel`
- `/api/founder/domains`
- `/api/founder/learning-summary`
- `/api/founder/vc-summary`
- `/api/founder/review-queue`

### Team 5

- `observe / analyze / recommend` read-only
- insight sample từ data thật

### DoD

- core loop vẫn xanh
- founder overview có ít nhất `5` block dữ liệu thật
- insight sample đúng schema

---

## SPRINT 3 — FOUNDER COMMAND PANEL (`next`)

### Team 1

- permission + action guard
- apply / rollback wiring

### Team 2

- Overview
- System Health block
- User Journey block
- Insight Drawer
- Action Modal

### Team 3

- severity wording
- founder approval wording
- audit wording

### Team 4

- incidents
- audit log
- deployment feed
- domain performance summary

### Team 5

- insights list
- insight query
- recommendations payload

### DoD

- founder nhìn `Overview` thấy system truth thật
- click insight thấy evidence thật
- action modal hiển thị `risk + rollback`

---

## SPRINT 4 — LIMITED AUTOPILOT (`next`)

### Team 1

- whitelist execution
- rollback enforcement

### Team 2

- before / after UI
- action result UI

### Team 3

- whitelist policy gate
- stop-line nếu vượt tier

### Team 4

- before / after metrics snapshot
- verification window

### Team 5

- execute `LOW_RISK`
- verify
- learning memory

### DoD

- apply được `1` action `LOW_RISK`
- rollback được `1` action
- audit log đúng
- founder thấy kết quả trước / sau rõ ràng

---

## Báo cáo bắt buộc sau mỗi lượt dev

Team 1 phải cập nhật:

- Team 1 `% hoàn thành / % còn lại`
- Team 2 `% hoàn thành / % còn lại`
- Team 3 `% hoàn thành / % còn lại`
- Team 4 `% hoàn thành / % còn lại`
- Team 5 `% hoàn thành / % còn lại`
- Tổng hệ `% hoàn thành / % còn lại`

Team 3 phải audit lại bản này trong cùng ngày.

---

## Không được làm trong board này

- không public founder panel như feature live cho user thường
- không cho autopilot execute ngoài whitelist
- không đẩy pricing / legal / entitlement vào AI automation
- không bỏ qua report `% còn lại`

---

## Câu chốt cho team

Thêm team để tiến nhanh hơn chỉ có ý nghĩa khi Team 1 nhìn một báo cáo là biết hệ còn bao nhiêu phần trăm và vì sao chưa xong.
