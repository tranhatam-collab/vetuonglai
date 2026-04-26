# 28_EXECUTION_DAILY_CHECK_SYSTEM

Status: LOCKED (Non-negotiable)
Scope: Daily execution check cho toàn bộ `*.vetuonglai.com`
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · PM · Ops
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## 0) Mục tiêu

File này khóa nhịp vận hành hằng ngày để mọi team:

- báo đúng sự thật runtime
- không claim `done` khi chưa có evidence
- không mở rộng scope khi core chưa xong
- dùng chung một format báo cáo
- luôn hiển thị `% hoàn thành` và `% còn lại` sau mỗi lượt dev

Daily check không phải nghi thức hành chính.
Đây là cơ chế giữ hệ không lệch khỏi founder lock.

---

## 1) Nguyên tắc daily check

- Không task nào được báo `done` nếu chưa có evidence.
- Không được báo “xong UI” nếu flow chưa chạy thật.
- Không được báo “xong backend” nếu FE chưa dùng được.
- Không được báo “xanh” nếu còn blocker `P0` hoặc link lỗi công khai.
- Mọi báo cáo phải dùng tiếng Việt có dấu đầy đủ.
- Không được báo phần trăm cảm tính.

---

## 2) Công thức progress bắt buộc

### 2.1 Tiến độ từng team

- `% hoàn thành team = (deliverable_done / deliverable_total) * 100`
- `% còn lại team = 100 - % hoàn thành team`

### 2.2 Trọng số toàn hệ

- Team 1 = `30%`
- Team 2 = `25%`
- Team 3 = `15%`
- Team 4 = `15%`
- Team 5 = `15%`

### 2.3 Tiến độ toàn hệ

- `% hoàn thành hệ = tổng (progress_team * weight_team)`
- `% còn lại hệ = 100 - % hoàn thành hệ`

### 2.4 Rule thay đổi deliverable count

Nếu team muốn đổi `deliverable_total`, bắt buộc phải có:

- lý do
- change record
- Team 1 sign-off
- Team 3 audit note

Không có đủ `4` mục trên thì phần trăm mới không hợp lệ.

---

## 3) Ba nhịp bắt buộc mỗi ngày

### 3.1 `09:00` — Check mở ngày

Mỗi team phải cập nhật:

- hôm nay đang làm lane nào
- objective trong ngày là gì
- blocker đang treo từ hôm qua là gì
- evidence sẽ tạo ra cuối ngày là gì
- `% hoàn thành hiện tại`
- `% còn lại hiện tại`

### 3.2 `13:30` — Check blocker

Chỉ cập nhật nếu:

- bị chặn quá `60 phút`
- phải đổi scope
- cần dependency từ team khác
- có rủi ro ảnh hưởng release gate

### 3.3 `18:00` — Check chốt ngày

Mỗi team phải cập nhật:

- đã xong gì
- chưa xong gì
- blocker còn mở
- evidence link / file / route / log
- ngày mai đi tiếp ở đâu
- `% hoàn thành mới`
- `% còn lại mới`

---

## 4) Input bắt buộc trước khi ghi daily check

Trước khi owner ghi update, bắt buộc phải đối chiếu:

1. `docs/00_master/00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md`
2. `docs/00_master/22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
3. `docs/00_master/27_IMPLEMENTATION_TASK_MATRIX_BY_TEAM.md`
4. `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md` nếu lane liên quan tới founder panel / autopilot
5. runtime truth hiện tại của lane đang làm

Nếu update không khớp các nguồn trên thì update đó không hợp lệ.

---

## 5) Output chuẩn cho mọi team

```text
Ngày:
Lượt dev:
Team:
Lane:
Trạng thái:

Deliverable total:
Deliverable done:
% hoàn thành:
% còn lại:

Đã xong:
- ...

Đang làm:
- ...

Tiếp theo:
- ...

Blocker:
- ...

Rủi ro:
- ...

Dependency cần từ team khác:
- ...

Evidence:
- file:
- route:
- log:
- screenshot:
```

---

## 6) Output chuẩn riêng cho Team 1 Lead

Sau mỗi lượt dev, Team 1 phải gửi thêm rollup toàn hệ theo mẫu sau:

```text
Ngày:
Lượt dev:
Lead: Team 1

Team 1:
- % hoàn thành:
- % còn lại:
- blocker:

Team 2:
- % hoàn thành:
- % còn lại:
- blocker:

Team 3:
- % hoàn thành:
- % còn lại:
- blocker:

Team 4:
- % hoàn thành:
- % còn lại:
- blocker:

Team 5:
- % hoàn thành:
- % còn lại:
- blocker:

Tổng hệ:
- % hoàn thành:
- % còn lại:

Ưu tiên cần xử lý ngay:
- ...
```

Rule:

- Team 1 không được tự bịa số cho team khác.
- Nếu team khác chưa nộp evidence, Team 1 phải ghi rõ `chưa có số hợp lệ`.
- Team 3 audit bản rollup này ngay trong cùng ngày.

---

## 7) Daily check theo team

### Team 1

Mỗi ngày phải trả lời:

- runtime gate nào đã xanh
- dependency nào đang chặn `5` team
- số phần trăm rollup toàn hệ là bao nhiêu
- còn lại bao nhiêu phần trăm để xong scope hiện tại

### Team 2

Mỗi ngày phải trả lời:

- surface nào đã dùng data thật
- mobile lane nào đã pass
- panel block nào còn đang chờ backend thật

### Team 3

Mỗi ngày phải trả lời:

- board / report / wording gate nào đã khóa
- % của team nào chưa hợp lệ vì thiếu evidence
- stop-line nào đang mở

### Team 4

Mỗi ngày phải trả lời:

- API founder nào đã chạy thật
- metric nào đã có source data thật
- incident / audit / deploy feed nào còn giả hoặc thiếu

### Team 5

Mỗi ngày phải trả lời:

- insight nào đã chạy đúng schema
- recommendation nào đã có evidence
- action nào đang ở `LOW / MEDIUM / HIGH`
- có safety risk nào không

---

## 8) Evidence bắt buộc

Một daily check chỉ hợp lệ khi có ít nhất một trong các evidence sau:

- file path cụ thể
- route cụ thể
- API response snapshot
- runtime log
- screenshot
- build / smoke output

Không chấp nhận:

- “đã xong” nhưng không có bằng chứng
- “đã test” nhưng không ghi test gì
- “đã chạy” nhưng không chỉ ra route hoặc log
- “còn 40%” nhưng không chỉ ra tổng deliverable và số deliverable đã xong

---

## 9) Rule blocker

### Blocker P0

Là blocker chặn core loop hoặc founder control truth:

- login
- entitlement
- learn
- submit
- review
- VC
- dashboard
- founder overview data
- audit log
- action rollback

P0 phải escalate ngay trong ngày.

### Blocker P1

- wording sai codex
- nav / status sai runtime truth
- link lỗi công khai
- panel insight không có evidence
- metrics drift giữa Team 4 và Team 5

### Blocker P2

- polish UI
- optimization
- refactor
- mở rộng phase sau

---

## 10) Pass / Fail cho một ngày làm việc

### PASS

Một ngày được xem là pass khi:

- objective trong ngày hoàn thành đúng scope
- evidence đầy đủ
- phần trăm có công thức rõ
- runtime truth rõ hơn lúc đầu ngày

### FAIL

Một ngày bị xem là fail khi:

- claim done nhưng thiếu evidence
- mở scope ngoài board
- đẩy blocker sang team khác mà không ghi rõ dependency
- tạo fake UI / fake flow / fake readiness
- báo % không có công thức

---

## 11) Rule release note và report

- Release note phải lấy từ daily checks thật, không viết lại theo trí nhớ.
- Evidence packet phải tham chiếu file / route / log cụ thể.
- Mọi thay đổi release gate phải có timestamp và owner.
- Team 1 lead rollup phải xuất hiện sau mỗi lượt dev trong `VTL_18`.

---

## 12) Definition of Done cho daily execution system

Daily execution system chỉ được xem là hoạt động đúng khi:

- mọi team cập nhật đúng `3` nhịp
- mọi update có evidence
- mọi blocker có owner và next step rõ
- Team 1 báo được `% còn lại` của cả `5` team
- Team 3 audit được bản rollup trong cùng ngày
- founder có thể nhìn một file là biết hệ còn bao nhiêu phần trăm

---

## 13) Câu khóa cuối

Không báo cáo để trông có vẻ đang làm.
Chỉ báo cáo thứ đã chạy thật, đang chặn thật, và số phần trăm còn lại được tính ra từ deliverable thật.
