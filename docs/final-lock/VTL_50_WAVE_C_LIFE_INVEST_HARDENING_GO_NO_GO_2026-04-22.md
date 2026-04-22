# VTL WAVE C — LIFE / INVEST HARDENING GO / NO-GO

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 10:26 ICT
Trạng thái: `go_for_hardening / no_go_for_promotion`
Owner: Team 3
Phạm vi: `life.vetuonglai.com` + `invest.vetuonglai.com` và wording/status cleanup liên quan

## 0. Mục đích

File này là note audit ngắn của Team 3 cho Wave C.

Mục tiêu:

- cho phép hardening đúng current state
- chặn mọi hành vi nâng status hoặc copy vượt runtime truth
- nêu rõ owner, gate, evidence trước khi Team 1 / Team 2 / Team 5 đi sâu hơn

## 1. Runtime truth dùng cho note này

Snapshot active được khóa theo:

- [VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md)
- [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md)

Current truth cho Wave C:

- `life.vetuonglai.com` = `planned_public`
- `invest.vetuonglai.com` = `planned_public`

Lưu ý:

- một số file master/final-lock cũ hơn vẫn còn mô tả `MEMBER_PREVIEW`
- Team 3 không dùng các mô tả cũ đó để signoff cho Wave C
- cho lane hiện tại, mọi team phải bám snapshot active ngày `2026-04-22`

## 2. Verdict

### Verdict cho tiếp tục dev hardening

`GO`

Lý do:

- Wave C đang là lane kế tiếp đã khóa trong board active
- `life` và `invest` cần được dọn wording/status/render trước khi bàn tới bất kỳ mức mở nào khác

### Verdict cho nâng status / public promotion

`NO-GO`

Lý do:

- chưa có runtime evidence cho `life` / `invest` ở mức cao hơn `planned_public`
- runtime truth hiện vẫn khóa `requiredPublic=false`, nên verify pack đúng chuẩn sẽ giữ `planned_safe_hold`
- chưa có quyết định promote/signoff cuối từ Team 1 + Team 3 + QA/PM/Ops để đổi current state

## 3. Owner / Gate / Evidence

| Gate | Owner chính | Điều kiện phải đúng | Evidence hiện có | Trạng thái |
| --- | --- | --- | --- | --- |
| `WC-01` | Team 1 | route, runtime guard, contract của `life` / `invest` không drift khỏi `planned_public` | current snapshot ở [VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md) + `node scripts/verify-wave-c-life-invest-hardening.mjs` | pass_hardening_ready |
| `WC-02` | Team 2 | cleanup wording/status/UI xong; nav/status chỉ lấy từ registry/runtime truth | source build đã dọn drift `Member Preview` -> `Planned` cho `life` / `invest`; phần cleanup cross-domain vẫn theo board active ở [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md) | pass_for_life_invest / mở_cho_cross_domain |
| `WC-03` | Team 3 | `life` không drift sang self-help/healing; `invest` không drift sang kèo/tín hiệu/lợi nhuận; không có overclaim current state | file audit này + protocol ở [00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/00_master/00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md) | đang giữ |
| `WC-04` | Team 5 | smoke + strict verify pack riêng cho `life` / `invest` được phát hành và pass | `node scripts/verify-wave-c-life-invest-hardening.mjs` -> `hardening_ready: true`, `release_ready: false`, `planned_safe_hold: true` | pass_hardening_ready |

## 4. Stop-line của Team 3

Wave C phải dừng ngay nếu có một trong các dấu hiệu sau:

- badge/status của `life` hoặc `invest` hiển thị như `live` hoặc `member preview`
- CTA của `life` hoặc `invest` dẫn tới workflow sâu không tương ứng current state
- `life` dùng ngôn ngữ chữa lành, điều trị, hoặc hứa kết quả tinh thần/sức khỏe
- `invest` dùng ngôn ngữ deal room, tín hiệu, lợi nhuận, hoặc implied return
- nav/status render còn hard-coded trái runtime truth

## 5. Điều Team 3 cho phép ở lượt này

Được phép:

- cleanup wording công khai còn kỹ thuật
- chuẩn hóa status render
- dựng plan rõ cho `life` và `invest` trong `planned_public`
- dùng verify pack đã có để giữ hardening lane xanh

Chưa được phép:

- promote `life` / `invest` lên `live`
- đổi badge thành `member preview` nếu chưa có runtime truth mới
- dùng copy ám chỉ đã có workflow usable đầy đủ

## 6. Blocker còn lại

1. `life` và `invest` vẫn đang ở `planned_public`, nên release pack đúng chuẩn sẽ tiếp tục giữ `planned_safe_hold` cho tới khi có quyết định promote.
2. Chưa có signoff promote/public-live cuối từ Team 1 + Team 3 + QA/PM/Ops.
3. Có rủi ro đọc nhầm tài liệu cũ nói `member preview`; vì vậy phải bám snapshot active ngày `2026-04-22`.

## 7. Câu chốt

Wave C hiện `GO` để hardening.

Wave C hiện `NO-GO` để nâng status hoặc phát ngôn như thể `life` và `invest` đã mở thật.
