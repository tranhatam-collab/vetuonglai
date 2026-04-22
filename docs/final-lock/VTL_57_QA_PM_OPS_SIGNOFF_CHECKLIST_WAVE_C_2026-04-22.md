# VTL QA / PM / OPS SIGNOFF CHECKLIST — WAVE C

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:04 ICT
Trạng thái: chờ ký nhận
Owner điều phối: Team 1
Người ký nhận mục tiêu: QA Lead · PM · Ops
Phạm vi: `life.vetuonglai.com` + `invest.vetuonglai.com`

## 0. Mục đích

Đây là checklist 1 trang để ký nhận đúng cho Wave C.

Checklist này tách thành 2 quyết định khác nhau:

1. ký nhận hardening lane
2. không ký nhầm promotion lane

Nếu không tách 2 quyết định này, Wave C rất dễ bị đọc sai thành “đã live”.

## 1. Evidence A — Team 5 hardening verifier

- [ ] Đã xem lệnh:

```bash
node scripts/verify-wave-c-life-invest-hardening.mjs
```

- [ ] Xác nhận kết quả:
  - `hardening_ready: true`
  - `release_ready: false`
  - `planned_safe_hold: true`
- [ ] Xác nhận verifier không cho phép promote ở trạng thái hiện tại

## 2. Evidence B — Runtime truth hiện hành

- [ ] Đã xem [domain-runtime-truth.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/cloudflare/domain-runtime-truth.json)
- [ ] Xác nhận:
  - `life.vetuonglai.com = planned_public`
  - `invest.vetuonglai.com = planned_public`
  - `requiredPublic = false`
- [ ] Xác nhận board điều phối hiện phản ánh đúng trạng thái này:
  - [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md)

## 3. Evidence C — Governance / wording gate

- [ ] Đã xem note Team 3:
  - [VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md)
- [ ] Xác nhận verdict:
  - `GO` cho hardening
  - `NO-GO` cho promotion
- [ ] Xác nhận không còn drift wording/status kiểu `Member Preview` trong scope Wave C

## 4. Evidence D — Public runtime hiện tại

- [ ] Đã xem evidence refresh:
  - `dig @1.1.1.1 +short life.vetuonglai.com`
  - `dig @1.1.1.1 +short invest.vetuonglai.com`
  - `curl -I -sS https://life.vetuonglai.com`
  - `curl -I -sS https://invest.vetuonglai.com`
- [ ] Xác nhận cả hai host đang reachable công khai
- [ ] Xác nhận reachability này không được dùng làm căn cứ promote nếu runtime truth chưa đổi

## 5. Quyết định ký nhận

### Quyết định 1 — Hardening lane

Chọn một:

- [ ] `PASS` cho hardening lane của Wave C
- [ ] `HOLD` cho hardening lane của Wave C

Nếu chọn `HOLD`, bắt buộc điền:

- lý do:
- owner:
- evidence:
- thời hạn xử lý:

### Quyết định 2 — Promotion lane

Chọn một:

- [ ] `NO-GO` cho promotion của `life` / `invest` ở thời điểm hiện tại
- [ ] `PROMOTION_REVIEW_REQUIRED`

Lưu ý:

- lựa chọn mặc định đúng ở thời điểm này phải là `NO-GO`
- không được chọn `PASS_FOR_PROMOTION` trên checklist này

## 6. Thông tin ký nhận

QA Lead:

- Họ tên:
- Thời điểm ký:
- Ghi chú:

PM:

- Họ tên:
- Thời điểm ký:
- Ghi chú:

Ops:

- Họ tên:
- Thời điểm ký:
- Ghi chú:

## 7. Quy tắc sau khi ký nhận

Nếu hardening lane được ký `PASS`:

1. Wave C được coi là sạch ở mức hardening
2. Team 1 không cần quay lại dọn drift cũ của `life` / `invest`
3. `life` và `invest` vẫn phải giữ `planned_public` cho tới khi có scope promotion riêng

Nếu hardening lane bị `HOLD`:

1. không mở Wave E signoff
2. chỉ xử lý đúng blocker đã nêu
3. ký nhận lại trên chính checklist này sau khi fix xong

## 8. Tài liệu tham chiếu bắt buộc

1. [VTL_56_WAVE_C_RELEASE_NOTE_LIFE_INVEST_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_56_WAVE_C_RELEASE_NOTE_LIFE_INVEST_2026-04-22.md)
2. [VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md)
3. [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md)

## 9. Câu chốt

Checklist này tồn tại để mọi người ký đúng một điều:

- Wave C đã sạch để tiếp tục theo lane hardening

Checklist này không cho phép ký nhầm điều sau:

- `life` và `invest` đã live
