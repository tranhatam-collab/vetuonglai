# 30_V1_CROSS_TEAM_EXECUTION_SYNC_UPDATE

## Mục đích của file

Đồng bộ toàn team sau khi xác nhận:

- hệ vẫn đang ở `V1.0`
- nhiều brief V2 là target-state, chưa phải current-state
- payment / member lane phải nói theo reality hiện tại
- founder command panel + autopilot là internal-first, chưa được public claim như đã live

---

## 1. Team 1

- tiếp tục owner lane runtime / payment / member / integration
- chịu trách nhiệm chính và báo tiến độ toàn hệ
- mọi blocker phải có production hoặc staging evidence rõ

## 2. Team 2

- ưu tiên hoàn thiện public layer, member-safe layer, mobile-safe layer, panel UI layer
- không dùng wording như thể full V2 economy hoặc founder control production đã live

## 3. Team 3

- chặn mọi claim biến target-state thành current-state
- chặn legal / brand / governance drift
- audit progress report và `% còn lại`

## 4. Team 4

- chỉ công bố founder backend khi đã có data source thật
- không dùng backend mock để claim metrics live

## 5. Team 5

- chỉ công bố AI insight / action khi đã có evidence thật
- không dùng AI reasoning thay cho data
- không chạy ngoài action registry + whitelist

## 6. Ops / Founder

- chỉ xác nhận xong khi Team 1 verify được runtime thật
- mọi gate `HIGH_RISK` vẫn phải do founder / Ops approve

---

## 7. Rule chung

- dùng tiếng Việt có dấu đầy đủ
- mọi roadmap phải ghi rõ `current-state`, `preview`, `next-state`
- không khóa file nào mâu thuẫn với runtime truth
- Team 1 phải báo `% hoàn thành / % còn lại` sau mỗi lượt dev
