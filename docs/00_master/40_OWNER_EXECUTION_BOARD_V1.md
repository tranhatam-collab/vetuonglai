# 40_OWNER_EXECUTION_BOARD_V1

## Tài liệu bắt buộc trước khi owner nhận việc

Mọi owner phải xác nhận đã đọc xong:

- `docs/00_master/22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
- `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
- `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
- `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`
- `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md`

Quyết định đã ký bởi Ông Trần Hà Tâm. Không owner nào được bỏ qua bước này.

---

## Mục đích của file

File này tách board điều phối tổng thành board tác chiến theo `5 team` để:

- Team 1 biết phải lead và theo dõi gì
- Team 2 biết UI nào đang là blocker thật
- Team 3 biết gate nào phải khóa
- Team 4 biết API / metric nào phải giao cho Team 1
- Team 5 biết AI chỉ được làm gì trong boundary cho phép

---

## Team 1 — Lead Platform / Runtime / Release Control

### Việc phải làm ngay

- giữ auth / entitlement / member / guarded routes / founder permission gate
- tổng hợp `% hoàn thành / % còn lại` của `5` team sau mỗi lượt dev
- nhận dependency từ Team 2, 3, 4, 5 và khóa integration order
- stop-line nếu có fake readiness

### Evidence bắt buộc

- runtime proof
- dependency map update
- lead rollup report

### Không được làm

- không tự sửa % của team khác nếu chưa có evidence
- không promote lane founder panel / autopilot khi chưa có audit từ Team 3

---

## Team 2 — Product / Frontend / Mobile / Panel UI

### Việc phải làm ngay

- public surfaces đúng codex
- mobile parity đúng runtime truth
- founder overview UI
- insight drawer
- action modal

### Evidence bắt buộc

- screenshots theo route
- API field map cho từng block UI
- mobile parity matrix

### Không được làm

- không dùng mock data để báo ready
- không public founder panel như live user surface

---

## Team 3 — Docs / Ops / Governance / QA Gate

### Việc phải làm ngay

- giữ spec / board / runbook / report
- audit `% hoàn thành / % còn lại`
- duyệt action tier, severity tier, trust wording
- cập nhật `VTL_18` sau mỗi đợt docs/ops handoff

### Evidence bắt buộc

- board diff
- policy diff
- audit note
- go / no-go note

### Không được làm

- không duyệt artifact thiếu evidence
- không để Team 1 report mơ hồ bằng lời nói thay cho file

---

## Team 4 — Data / Metrics / Founder Backend

### Việc phải làm ngay

- dựng read APIs cho founder layer
- dựng health / journey / learning / VC / domain summaries
- dựng incident / audit / deployment feeds
- khóa data dictionary

### Evidence bắt buộc

- API response snapshot
- schema note
- source data note

### Không được làm

- không gọi API ready khi chưa có source data thật
- không đổi định nghĩa metric khi chưa sign-off

---

## Team 5 — AI / Autopilot / Intelligence

### Việc phải làm ngay

- dựng insight query
- dựng recommendation payload
- dựng action reasoning payload
- bám action registry và whitelist
- chuẩn bị verify loop

### Evidence bắt buộc

- prompt contract
- output schema sample
- risk / confidence note

### Không được làm

- không tự execute ngoài `LOW_RISK`
- không đề xuất đổi pricing / legal / domain status như hành động tự động

---

## Founder / PM / Ops check

### Mỗi ngày phải hỏi

- Team 1: hệ còn bao nhiêu `%`?
- Team 2: UI nào đang chờ backend thật?
- Team 3: số nào đang không hợp lệ vì thiếu evidence?
- Team 4: API nào đã thật, API nào mới là contract?
- Team 5: insight nào có evidence, insight nào chỉ là giả thuyết?

---

## Rule chung

1. Owner nào thiếu evidence thì task chưa `done`.
2. Owner nào mở scope ngoài board thì task chuyển `blocked_scope_violation`.
3. Team 1 phải có lead rollup sau mỗi lượt dev.
4. Team 3 phải audit lead rollup trong cùng ngày.
