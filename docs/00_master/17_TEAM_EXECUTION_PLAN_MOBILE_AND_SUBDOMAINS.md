# 17_TEAM_EXECUTION_PLAN_MOBILE_AND_SUBDOMAINS

## Mục đích của file

Kế hoạch điều phối thực thi cho toàn bộ web và `5 team dev` trong V1.0 hiện tại.

File này dùng để:

- ép toàn team đi đúng thứ tự
- khóa `P0` trước khi build thêm
- chạy core loop thật trước economy
- mở thêm `2` team mới nhưng không làm vỡ ownership cũ
- buộc Team 1 lead tổng hợp tiến độ + `% còn lại` sau mỗi lượt dev

File này phải được đọc cùng:

- `docs/00_master/22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
- `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
- `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
- `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`
- `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md`
- `docs/00_master/40_OWNER_EXECUTION_BOARD_V1.md`

---

## 0. Khóa vận hành

Kể từ cycle `2026-04-21`, thứ tự đúng là:

1. `P0` — khóa nền govern + team split + progress reporting
2. `P1` — chạy core loop thật
3. `P2` — harden core + mobile + planned-safe surfaces
4. `P3` — founder command panel data + UI
5. `P4` — autopilot limited + action verification
6. `P5` — economy sâu chỉ mở khi founder cho phép

Điều này có nghĩa:

- không build thêm economy runtime trước khi core loop pass
- không gọi founder panel là live production nếu mới có mock UI
- không gọi autopilot là active nếu chưa có whitelist + rollback + audit

---

## 1. Team structure

### Team 1 — Lead Platform / Runtime / Release Control

Owner scope:

- member auth
- payment / access / entitlement
- runtime truth evidence
- guarded routes
- integration cuối giữa các team
- tổng hợp tiến độ toàn hệ và báo `% còn lại`

### Team 2 — Product / Frontend / Mobile / Panel UI

Owner scope:

- public layer
- dashboard / member shell
- mobile parity
- existing subdomain surfaces
- Founder Command Panel UI

### Team 3 — Docs / Ops / Governance / QA Gate

Owner scope:

- docs lock
- board / report / runbook
- trust wording
- release gate
- progress formula audit
- incident / audit / deployment wording parity

### Team 4 — Data / Metrics / Founder Backend

Owner scope:

- aggregation
- metrics
- journey truth service
- incident service
- founder backend APIs
- audit stream / deployment feed

### Team 5 — AI / Autopilot / Intelligence

Owner scope:

- observer
- analyzer
- recommender
- verifier
- limited executor
- insight query
- action verification memory

### Ops / Founder

Owner scope:

- secrets
- DNS
- deploy approval
- provider / payment gates
- high-risk action approval

---

## 2. P0 — phải khóa ngay

### Mục tiêu

Biến hệ từ “nhiều lane đúng hướng” thành “một hệ có owner rõ, tiến độ rõ, và không đoán trạng thái”.

### Team 1

- khóa Team 1 lead report format
- giữ runtime truth và dependency map đúng thực tế
- chốt baseline delivery checklist cho Team 4 và Team 5

### Team 2

- giữ public / mobile surface bám runtime truth
- không mở UI founder panel như thể đã có backend thật

### Team 3

- khóa mô hình `5 team`
- khóa `% hoàn thành / % còn lại`
- khóa progress evidence rules

### Team 4

- khóa schema snapshot, health snapshot, incident snapshot
- chưa claim runtime ready nếu chưa có source data thật

### Team 5

- khóa prompt, output schema, action tier guardrails
- chưa claim AI reasoning live nếu chưa có evidence thật

### Gate P0

- mọi board đã chuyển sang mô hình `5 team`
- Team 1 có template rollup bắt buộc
- Team 4 và Team 5 có owner + dependency + done criteria rõ
- không còn file điều phối trung tâm nào nói theo mô hình `3 team`

---

## 3. P1 — core loop phải chạy

Core loop V1.0:

`login -> học -> nộp -> review -> VC -> dashboard`

### Team 1

- magic link auth
- session dùng chung
- Future Access Pass activation path
- entitlement API
- submission / VC contracts

### Team 2

- course player shell
- submit output UI
- review state UI
- dashboard state + next step
- verify page UI

### Team 3

- review completion wording
- review review-state fairness
- review proof wording ở VC
- stop-line nếu report khác runtime truth

### Team 4

- collect health, funnel, learning, proof metrics read-only
- chuẩn bị `system_health_snapshots` và `journey_truth` data model

### Team 5

- chuẩn bị insight schema, confidence schema, action schema
- chỉ dùng data read-only; chưa execute action

### Gate P1

- user login được
- user học `1` lesson được
- user nộp `1` output được
- output đổi trạng thái review được
- dashboard hiện next step đúng
- Team 4 đọc được dữ liệu funnel thật
- Team 5 query được insight mẫu từ data thật hoặc fixture được Team 3 duyệt

---

## 4. P2 — harden core + planned surfaces

Chỉ mở sau khi `P1` pass.

### Phạm vi

- AI tutor sâu hơn
- journey engine basic
- mobile parity cho root / member / edu / vc
- harden life / finance / invest / green theo runtime truth
- planned-safe surfaces cho `community / work / market / ai`

### Gate P2

- state không drift giữa API và UI
- copy public bám codex
- QA flow pass trên thiết bị mục tiêu
- planned surfaces không false-live

---

## 5. P3 — Founder Command Panel

### Team 1

- founder permission gate
- manual override state
- action apply / rollback guard

### Team 2

- overview UI
- block rendering
- insight drawer
- action modal

### Team 3

- panel wording / action wording / risk wording review
- founder report format review

### Team 4

- overview APIs
- system health
- journey funnel
- domains summary
- incidents
- audit log

### Team 5

- insights API
- insight query
- recommendation format

### Gate P3

- `Overview` đọc được data thật
- ít nhất `5` block có dữ liệu thật
- insight drawer render được evidence thật
- audit log mở được

---

## 6. P4 — Limited Autopilot

### Team 1

- whitelist action execution
- rollback guard
- permission enforcement

### Team 2

- action state UI
- before / after display

### Team 3

- policy gate cho `LOW / MEDIUM / HIGH`
- audit wording và incident wording

### Team 4

- before / after metrics snapshot
- verification window logic

### Team 5

- observe
- analyze
- recommend
- limited execute `LOW_RISK`
- verify

### Gate P4

- apply được `1` action `LOW_RISK`
- rollback được `1` action
- before / after comparison hiện đúng
- audit log ghi đầy đủ

---

## 7. Daily ops cadence

- `09:00 ICT`: plan / owner check
- `13:30 ICT`: blocker resolution
- `18:00 ICT`: readiness snapshot + `% còn lại`

Artifact bắt buộc:

- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
- `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
- file plan / board của team đang chạy

---

## 8. Stop-the-line rules

Dừng ngay nếu có một trong các trường hợp:

- Team 1 không tổng hợp được `% còn lại` theo evidence
- Team 2 render founder panel bằng data giả nhưng báo như data thật
- Team 4 thiếu API contract nhưng báo backend ready
- Team 5 execute action ngoài whitelist
- Team 3 phát hiện drift giữa runtime truth và report

---

## 9. Câu chốt

Thêm team để nhanh hơn, không phải để rối hơn.
Mô hình `5 team` chỉ hợp lệ khi Team 1 nhìn một vòng là biết ai đang làm gì, còn bao nhiêu phần trăm, và cái gì đang chặn hệ.
