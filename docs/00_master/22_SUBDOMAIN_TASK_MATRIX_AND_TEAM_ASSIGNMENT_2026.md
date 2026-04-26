# 22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026

## Mục đích của file

File này thống kê nhiệm vụ rõ ràng cho từng subdomain trong hệ `*.vetuonglai.com`, đồng thời khóa trách nhiệm cụ thể cho mô hình `5 team` mới.

Mô hình áp dụng:

- Team 1 — Lead Platform / Runtime / Release Control
- Team 2 — Product / Frontend / Mobile / Panel UI
- Team 3 — Docs / Ops / Governance / QA Gate
- Team 4 — Data / Metrics / Founder Backend
- Team 5 — AI / Autopilot / Intelligence
- Ops / Founder support lane

File này hoạt động bên dưới:

- `docs/00_master/17_TEAM_EXECUTION_PLAN_MOBILE_AND_SUBDOMAINS.md`
- `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
- `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
- `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`

---

## 1. Quy tắc dùng file này

1. Mỗi subdomain và mỗi internal lane phải có owner lane rõ ràng.
2. Mỗi task phải đi theo `plan -> build -> verify -> report`.
3. Không team nào được tự mở scope ngoài cột “được làm ngay”.
4. Nếu subdomain đang `Planned` hoặc `Member Preview`, không được viết / ship như thể đã `Live`.
5. Team 1 là lead và phải tổng hợp tiến độ của cả `5` team.
6. Sau mỗi lượt dev, Team 1 phải báo:
   - `% hoàn thành`
   - `% còn lại`
   - blocker đang treo ở team nào
7. Team 3 audit cách tính phần trăm và evidence.

---

## 2. Ma trận nhiệm vụ theo subdomain và internal lane

| Surface / Domain | Trạng thái hiện tại | Team 1 | Team 2 | Team 3 | Team 4 | Team 5 | External |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `vetuonglai.com` | Live | giữ route/access truth, gateway truth | hero/CTA/disclosure/mobile | chặn overclaim và drift status | domain summary metrics | teaser insight, CTA insight | deploy/runtime hỗ trợ khi cần |
| `member.vetuonglai.com` | Staged public / planned-safe | owner cutover, runtime, smoke, promote | dashboard/app shell/mobile state | go/no-go trust/disclosure | activation, stuck-user, next-step metrics | stuck-state insight | secrets, DNS, custom-domain |
| `edu.vetuonglai.com` | Beta | catalog/health/contracts | list/detail/player/progress/mobile UX | proof wording, disclosure | learning summary, review queue | submit-drop insight | runtime support nếu có env gate |
| `vc.vetuonglai.com` | Live | registry/verify routes | verify entry, sample record, mobile verify | chặn claim quá mức | VC summary, issuance backlog | VC bottleneck insight | domain/runtime nếu cần |
| `life.vetuonglai.com` | Member Preview | route/runtime safe | public teaser + preview surface | chặn self-help drift | teaser engagement metrics | entry-block recommendation | none |
| `finance.vetuonglai.com` | Live | runtime safe | checklist, CTA, mobile readability | chặn money hype | trust conversion metrics | safer entry recommendation | none |
| `invest.vetuonglai.com` | Member Preview | route/runtime safe | risk-first preview, checklist | chặn kèo/lợi nhuận wording | drop / CTA metrics | pause-invest CTA recommendation | none |
| `green.vetuonglai.com` | Live | route/runtime safe | impact demo, CTA, responsive | chặn greenwashing | impact page metrics | impact insight | none |
| `community.vetuonglai.com` | Planned | guarded route | planned-safe teaser surface | chặn false-live | planned domain metrics stub | not in scope execute | host/runtime khi tới wave |
| `work.vetuonglai.com` | Planned | guarded route | teaser, project card demo | chặn việc làm / thu nhập overclaim | planned domain metrics stub | not in scope execute | host/runtime khi tới wave |
| `market.vetuonglai.com` | Planned | guarded route | teaser, asset demo, CTA | chặn commerce overclaim | planned domain metrics stub | not in scope execute | host/runtime khi tới wave |
| `ai.vetuonglai.com` | Planned | guarded route | tool preview, CTA | chặn AI hype | planned domain metrics stub | not in scope execute | host/runtime khi tới wave |
| `Founder Command Panel` (internal) | Planned internal-first | auth, permission, apply/rollback guard | overview UI, action modal, drawer | wording, severity, approval policy | overview APIs, incident/audit/deploy feeds | insights, query, recommendation | founder approval |
| `AI Autopilot` (internal) | Planned internal-first | whitelist, runtime guard | action state UI | action tier governance | before/after snapshot, verification data | observe/analyze/recommend/execute/verify | founder high-risk approval |

---

## 3. Phân công rõ cho 5 team

### Team 1 — Lead Platform / Runtime / Release Control

**Team 1 phải làm**

1. giữ runtime truth, access truth, release truth
2. owner toàn bộ gate runtime, auth, entitlement, guarded route
3. tích hợp output của Team 2, Team 4, Team 5 thành hệ chạy được thật
4. theo dõi và báo cáo tiến độ `5` team
5. stop-line nếu bất kỳ team nào báo `done` nhưng không có evidence

**Team 1 không được làm**

- không tự mở scope UI / content ngoài bugfix hoặc contract-safe patch
- không promote nếu truth chưa khớp production
- không tự sửa % của team khác nếu team đó chưa nộp evidence

### Team 2 — Product / Frontend / Mobile / Panel UI

**Team 2 phải làm**

1. sở hữu public surface, mobile shell, dashboard UX, founder panel UI
2. mọi subdomain phải có đúng khung: hook, public value, demo, gateway CTA, trust/status footer
3. founder panel phải render bằng contract thật, không mock như live

**Team 2 không được làm**

- không mở checkout trong app hoặc subdomain
- không ship false-live surface cho planned domains
- không render founder panel production state nếu backend chưa có data thật

### Team 3 — Docs / Ops / Governance / QA Gate

**Team 3 phải làm**

1. review legal / trust / disclosure / runtime parity cho mọi surface
2. giữ spec, board, report, action tier, severity tier
3. audit mọi báo cáo `% hoàn thành / % còn lại`
4. stop-line nếu overclaim, sai runtime truth, sai ngôn ngữ, sai severity

**Team 3 không được làm**

- không duyệt artifact thiếu evidence
- không để Team 1 gánh monitoring bằng lời nói thay cho file đã khóa

### Team 4 — Data / Metrics / Founder Backend

**Team 4 phải làm**

1. owner aggregation, metrics, incident, audit, deployment feed
2. expose founder read APIs có data thật hoặc data nguồn được chỉ rõ
3. khóa data dictionary cho system health, journey, learning, VC, domains

**Team 4 không được làm**

- không gọi backend ready nếu chỉ có schema mà chưa có source data
- không tự thay đổi nghĩa metric khi chưa có Team 1 + Team 3 sign-off

### Team 5 — AI / Autopilot / Intelligence

**Team 5 phải làm**

1. owner insight query, recommendation logic, action reasoning, verification loop
2. bám chặt action registry, không tự phát minh action mới
3. mọi insight phải có evidence + confidence + risk level

**Team 5 không được làm**

- không tự đổi pricing, legal, domain status, deploy, entitlement
- không tự execute ngoài `LOW_RISK` whitelist và guard của Team 1

---

## 4. Công thức tiến độ bắt buộc

### 4.1 Tiến độ từng team

- `% hoàn thành team = deliverable_done / deliverable_total * 100`
- `% còn lại team = 100 - % hoàn thành team`

### 4.2 Trọng số rollup toàn hệ

- Team 1 = `30%`
- Team 2 = `25%`
- Team 3 = `15%`
- Team 4 = `15%`
- Team 5 = `15%`

### 4.3 Tiến độ toàn hệ

- `% hoàn thành hệ = tổng (progress_team * weight_team)`
- `% còn lại hệ = 100 - % hoàn thành hệ`

Team 1 phải báo số này sau mỗi lượt dev.
Team 3 kiểm tra lại số này sau mỗi lượt dev.

---

## 5. Definition of done cho file này

File này chỉ được xem là hoàn tất khi:

- mỗi domain đã có owner rõ theo mô hình `5 team`
- mỗi team biết mình làm gì, không làm gì
- đã có internal lane riêng cho `Founder Command Panel` và `AI Autopilot`
- đã có công thức progress / remaining rõ ràng
- task matrix không mâu thuẫn với runtime truth hay founder lock
