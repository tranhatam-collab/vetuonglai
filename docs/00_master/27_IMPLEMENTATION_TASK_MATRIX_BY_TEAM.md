# 27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM

Status: LOCKED (Non-negotiable)
Scope: Task matrix theo `5 team` cho V1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · PM · Ops
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## Mục tiêu

- Biến toàn bộ V1.0 thành hệ chạy thật
- Tăng tốc bằng `5 team`, không tăng nhiễu
- Không thêm feature mới ngoài board đã khóa
- Không đoán tiến độ
- Chỉ build -> test -> verify -> báo cáo

---

## Nguyên tắc chung

- Không task nào được `DONE` nếu chưa có evidence
- Không task nào được `DONE` nếu chưa test
- Không task nào được `DONE` nếu chưa chạy được thật
- Không làm economy trước core
- Không mở founder autopilot trước khi có panel data thật
- Không hard-code text hoặc action label

---

## SPRINT 0 — TEAM SPLIT + GOVERNANCE LOCK

### Team 1

- nhận vai trò lead và tổng hợp progress toàn hệ
- khóa dependency map cho Team 2 -> Team 5

### Team 2

- nhận board UI / mobile / panel UI
- chốt surface map tiêu thụ API

### Team 3

- khóa docs, board, progress formula, report cadence
- khóa action tiers, severity tiers, stop-the-line rules

### Team 4

- chốt data entities cho founder layer
- chốt danh sách read APIs

### Team 5

- chốt prompt, insight schema, recommendation schema, action schema

### DoD

- `5` team có owner rõ
- Team 1 có template báo `% còn lại`
- Team 4 và Team 5 có lane riêng, không lẫn vào Team 1 / Team 2

---

## SPRINT 1 — CORE SYSTEM HARDENING

### Team 1

- magic link auth
- session global
- entitlement resolution
- submission / VC contracts

### Team 2

- login UI
- course player shell
- submit UI
- verify page UI
- dashboard state UI

### Team 3

- review wording, disclosure, runtime parity
- verify không có drift giữa report và runtime

### Team 4

- capture system health snapshot
- capture journey funnel snapshot
- capture learning / proof snapshot

### Team 5

- prepare read-only insight pipeline from Team 4 snapshots
- chưa execute action

### DoD

- `login -> learn -> submit -> review -> VC -> dashboard` chạy thật
- Team 4 đọc được data funnel thật
- Team 5 sinh được insight mẫu đúng schema

---

## SPRINT 2 — MOBILE + PLANNED SURFACES + FOUNDER DATA PLANE

### Team 1

- guarded route cho planned domains
- runtime truth update discipline

### Team 2

- mobile parity cho root / member / edu / vc
- planned-safe surfaces cho `community / work / market / ai`
- founder overview shell UI

### Team 3

- duyệt planned-safe wording
- duyệt founder panel wording

### Team 4

- dựng APIs:
  - overview
  - system-health
  - journey-funnel
  - domains
  - learning-summary
  - vc-summary
  - review-queue
  - incidents
  - audit-log
  - deployments

### Team 5

- insight contracts bám theo Team 4 APIs
- `observe / analyze / recommend` read-only

### DoD

- mobile parity ổn cho core surfaces
- planned-safe surfaces không false-live
- founder overview có data thật ở ít nhất `5` block

---

## SPRINT 3 — FOUNDER COMMAND PANEL

### Team 1

- founder permission gate
- manual override state
- apply / rollback guard wiring

### Team 2

- Overview
- Insight Drawer
- Action Modal
- Bottom Stream

### Team 3

- risk wording
- action wording
- founder approval wording
- audit wording

### Team 4

- incidents feed
- audit stream
- deployment feed
- domain performance summary

### Team 5

- insights list
- insight query
- recommendation rendering payload

### DoD

- founder mở `Overview` và thấy system truth thật
- click insight xem được evidence thật
- action modal hiển thị rollback support đúng

---

## SPRINT 4 — LIMITED AUTOPILOT

### Team 1

- action registry guard
- execution guard
- rollback execution

### Team 2

- action state UI
- before / after comparison UI

### Team 3

- approve `LOW_RISK` whitelist
- audit execution report
- stop-line nếu execute vượt tier

### Team 4

- before / after metrics snapshots
- verification window
- result classification: `improved / neutral / worse`

### Team 5

- execute `LOW_RISK`
- verify
- learning memory

### DoD

- apply `1` action `LOW_RISK`
- rollback được `1` action
- audit log có đủ before / after
- founder thấy được kết quả tốt hơn / trung tính / tệ hơn

---

## TEAM OUTPUT BẮT BUỘC SAU MỖI LƯỢT DEV

### Team 1

- lead rollup `% hoàn thành / % còn lại` cho `5` team
- dependency map update
- blocker escalation

### Team 2

- UI routes / screenshots / field map

### Team 3

- audit note
- wording / policy gate result

### Team 4

- API snapshot
- metrics snapshot

### Team 5

- insight / recommendation sample
- action safety note

---

## Câu chốt

Mô hình `5 team` chỉ thành công khi Team 1 không phải đoán thay người khác, và mọi team đều để lại bằng chứng đủ sạch để founder nhìn là hiểu.
