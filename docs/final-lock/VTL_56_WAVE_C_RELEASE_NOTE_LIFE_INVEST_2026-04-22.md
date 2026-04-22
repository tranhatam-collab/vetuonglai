# VTL RELEASE NOTE — WAVE C LIFE / INVEST HARDENING

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:04 ICT
Trạng thái: chờ ký nhận hardening
Owner điều phối: Team 1
Phạm vi: `life.vetuonglai.com` + `invest.vetuonglai.com`

## 0. Mục đích

File này là release note ngắn cho Wave C.

Mục tiêu:

- chốt rõ cái gì đã pass thật cho `life` và `invest`
- tách riêng `hardening signoff` với `public promotion`
- cho QA / PM / Ops một bản tóm tắt đủ ngắn để ký nhận đúng lane

File này không có quyền nâng `life` hoặc `invest` sang `live`.

## 1. Kết luận của lane này

Wave C hiện đủ evidence để ký nhận ở mức:

- `hardening_complete`
- `keep_planned_public`

Wave C chưa đủ evidence để ký nhận ở mức:

- `public_promotion`
- `live_release`

Nói ngắn gọn:

- hardening: `PASS`
- promotion: `NO-GO`

## 2. Evidence thật đã refresh

### 2.1 Team 5 verify pack của Wave C

Lệnh:

```bash
node scripts/verify-wave-c-life-invest-hardening.mjs
```

Kết quả:

- `hardening_ready: true`
- `release_ready: false`
- `planned_safe_hold: true`

Ý nghĩa đúng:

- source + dist + contract của `life` / `invest` đang sạch cho hardening
- release pack đúng chuẩn vẫn đang giữ hai domain này ở `planned_public`
- verifier chưa cho phép promote

### 2.2 Runtime công khai hiện tại

Đã kiểm lại:

```bash
dig @1.1.1.1 +short life.vetuonglai.com
dig @1.1.1.1 +short invest.vetuonglai.com
curl -I -sS https://life.vetuonglai.com
curl -I -sS https://invest.vetuonglai.com
```

Kết quả:

- `life.vetuonglai.com` có DNS công khai và trả `HTTP/2 200`
- `invest.vetuonglai.com` có DNS công khai và trả `HTTP/2 200`

Lưu ý quan trọng:

- public runtime đang reachable
- nhưng runtime truth vẫn khóa cả hai domain ở `planned_public`
- vì vậy `200` không được diễn giải thành `live`

### 2.3 Runtime truth hiện hành

Theo snapshot active:

- `life.vetuonglai.com` = `planned_public`
- `invest.vetuonglai.com` = `planned_public`
- `requiredPublic = false`

Điểm này là stop-line quan trọng nhất của Wave C.

### 2.4 Governance note của Team 3

Theo note hiện hành:

- [VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md)

Verdict đúng của Team 3:

- `GO` cho hardening
- `NO-GO` cho nâng status / public promotion

## 3. Những gì đã khóa xong trong Wave C

1. Drift wording/status `Member Preview` còn sót trong source build của `life` / `invest` đã được dọn về đúng `Planned`.
2. Verify pack riêng của Wave C đã có và đang chạy đúng.
3. Nav/status render cho scope Wave C đã bám runtime truth.
4. Board tổng đã phản ánh đúng trạng thái `hardening_ready / promotion_blocked`.

## 4. Những gì vẫn chưa được phép làm

1. Không đổi badge/status của `life` hoặc `invest` thành `live`.
2. Không dùng copy ám chỉ đã có workflow usable đầy đủ.
3. Không dùng `HTTP 200` như bằng chứng để tự promote status.
4. Không gom Wave C vào signoff cuối của toàn hệ.

## 5. Quyết định đề xuất cho QA / PM / Ops

Đề xuất mặc định:

1. ký nhận `PASS` cho hardening lane
2. ký nhận `HOLD / NO-GO` cho promotion lane
3. giữ `life` và `invest` ở `planned_public` cho tới khi có runtime truth mới

## 6. Tài liệu đi cùng khi ký nhận

1. [VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_50_WAVE_C_LIFE_INVEST_HARDENING_GO_NO_GO_2026-04-22.md)
2. [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md)
3. [VTL_53_WAVE_B_D_RUNTIME_PROGRESS_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_53_WAVE_B_D_RUNTIME_PROGRESS_ROLLUP_2026-04-22.md)
4. [VTL_57_QA_PM_OPS_SIGNOFF_CHECKLIST_WAVE_C_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_57_QA_PM_OPS_SIGNOFF_CHECKLIST_WAVE_C_2026-04-22.md)

## 7. Câu chốt

Wave C hiện đã đủ để ký nhận rằng:

- hardening đã xong đúng lane

Wave C hiện chưa đủ để ký nhận rằng:

- `life` và `invest` đã live
