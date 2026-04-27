# VTL QA/PM SIGNOFF CHECKLIST — FOUNDER LANE

Phiên bản: 1.0
Ngày: 2026-04-21
Mốc chốt: 2026-04-21 17:46 ICT
Trạng thái: chờ ký nhận
Owner điều phối: Team 1
Người ký nhận mục tiêu: QA Lead, PM

## 0. Mục đích

Đây là checklist 1 trang để QA/PM ký nhận nhanh cho lane:

- Founder Command Panel
- AI Autopilot runtime lane
- Member required-public promote

Checklist này chỉ bám 3 evidence đã đủ.
Không dùng checklist này để mở scope mới.

## 1. Ba evidence bắt buộc

### Evidence A — Member promote verify

- [ ] Đã xem evidence `npm run cloudflare:promote:member`
- [ ] Xác nhận [domain-runtime-truth.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/cloudflare/domain-runtime-truth.json) hiện ghi:
  - `member.vetuonglai.com`
  - `status: live`
  - `requiredPublic: true`
- [ ] Xác nhận board đã phản ánh đúng promote state:
  - [VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md)

### Evidence B — Founder live release verify

- [ ] Đã xem evidence production cho lệnh:

```bash
node scripts/verify-founder-lane-release.mjs \
  --base-url https://member.vetuonglai.com \
  --auth-header x-founder-role \
  --auth-value founder
```

- [ ] Xác nhận kết quả đã khóa:
  - `smoke: 20/20 pass`
  - `strict: 20/20 pass`
  - `release_ready: true`
- [ ] Xác nhận không còn blocker `500 / 1101` trong founder lane theo:
  - [VTL_18_CROSS_TEAM_SYNC_REPORT.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md)
  - [VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md)

### Evidence C — Team 3 parity `go`

- [ ] Đã xem report [team3-parity.latest.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/reports/team3-parity.latest.json)
- [ ] Xác nhận:
  - `recommendation: go`
  - `stopLineOpen: false`
  - `suite: 6/6 pass`
- [ ] Xác nhận Team 3 không còn stop-line mở trong scope parity hiện tại

## 2. Điều kiện bổ sung để ký nhận nhanh

- [ ] Team 2 founder cleanup/handoff đã đóng
- [ ] Board điều phối hiện ghi:
  - Team 1 = `100% / 0%`
  - Team 2 = `100% / 0%`
  - Team 3 = `100% / 0%`
  - Team 4 = `100% / 0%`
  - Team 5 = `100% / 0%`
- [ ] Rollup founder lane hiện ghi `100% / 0%`
- [ ] Không còn dependency dev mở giữa 5 team trong founder lane

## 3. Quyết định ký nhận

Chọn một:

- [ ] QA/PM ký nhận `PASS`
- [ ] QA/PM ký nhận `HOLD`

Nếu chọn `HOLD`, bắt buộc điền:

- lý do:
- owner:
- evidence:
- thời hạn xử lý:

## 4. Thông tin ký nhận

QA Lead:

- Họ tên:
- Thời điểm ký:
- Ghi chú:

PM:

- Họ tên:
- Thời điểm ký:
- Ghi chú:

## 5. Quy tắc sau khi ký nhận

Nếu ký nhận `PASS`:

1. Founder lane được coi là đóng về execution
2. Team 1 được phép chuyển sang lane kế tiếp theo board
3. Mọi thay đổi mới vào founder lane sau đó phải được coi là scope mới hoặc regression fix, không được coi là “việc cũ còn sót”

Nếu ký nhận `HOLD`:

1. Không mở scope mới
2. Chỉ xử lý đúng blocker đã nêu trong mục `HOLD`
3. Sau khi gỡ blocker phải ký nhận lại trên chính checklist này

## 6. Tài liệu tham chiếu bắt buộc

1. [VTL_45_FOUNDER_MEMBER_RELEASE_NOTE_2026-04-21.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_45_FOUNDER_MEMBER_RELEASE_NOTE_2026-04-21.md)
2. [VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md)
3. [VTL_18_CROSS_TEAM_SYNC_REPORT.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md)
4. [team3-parity.latest.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/reports/team3-parity.latest.json)

## 7. Câu chốt

Checklist này dùng để ký nhận nhanh.

Nếu cả 3 evidence đều đã đủ và board đã ghi `100% / 0%`, thì quyết định mặc định nên là:

- `PASS`
