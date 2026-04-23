# VTL AUTOMATED TEAM CHANNEL MAPPING VÀ 15-PHÚT DEV REMINDER

Phiên bản: 1.0
Ngày: 2026-04-23
Mốc chốt: 2026-04-23 00:00 ICT
Trạng thái: active_automation_lock
Owner điều phối: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · QA · PM · Ops

## 0. Mục đích

File này khóa channel mapping và nhịp nhắc việc tự động cho toàn bộ 5 team đang dev.

Mục tiêu:

- mỗi team biết kênh trách nhiệm của mình
- mỗi team nhận nhắc việc định kỳ theo đúng backlog hiện hành
- sau khi hoàn thành một phiên, team phải tự chuyển sang nhiệm vụ kế tiếp nếu không bị blocker thật
- không nghỉ giữa chừng khi vẫn còn task mở
- chỉ được chờ team khác khi dependency của mình đã hoàn thành và có evidence rõ

## 1. Channel mapping logic

Đây là channel mapping logic nội bộ. Nếu sau này nối Slack / Teams / Linear, các key này là tên chuẩn để map sang channel thật.

| Team | Channel key | Vai trò chính | Người báo cáo mặc định |
| --- | --- | --- | --- |
| Team 1 | `vtl-team1-runtime-release` | Platform, runtime, release control, deploy gate, board tổng | Team 1 Lead |
| Team 2 | `vtl-team2-frontend-ux-mobile` | FE, UX, mobile parity, public wording, nav/status render | FE Lead |
| Team 3 | `vtl-team3-governance-runtime-truth` | Governance, runtime truth, go/no-go, language/trust gate | Governance Lead |
| Team 4 | `vtl-team4-data-registry-forms` | Data registry, package/form contract, business data, dashboard/journey contract | Data Lead |
| Team 5 | `vtl-team5-smoke-release-qa` | Smoke, strict contract, live verification, release evidence pack | QA/Release Lead |
| Ops | `vtl-ops-dns-cloudflare` | DNS, Cloudflare routing, runtime publish, secrets/config | Ops Lead |
| PM/Founder | `vtl-founder-pm-signoff` | Quyết định scope, ký nhận, stop-line, promotion gate | PM / Founder |

## 2. Cadence bắt buộc

Nhắc việc tự động chạy mỗi `15 phút`.

Mỗi lượt nhắc phải yêu cầu từng team cập nhật:

- đã xong gì
- đang làm gì
- 15 phút tới làm gì
- blocker thật là gì
- evidence ở đâu
- `% hoàn thành / % còn lại`

Không chờ tới 8 giờ sáng.
Không chờ daily standup.
Không nghỉ nếu còn task không bị blocker.

## 3. Quy tắc sau mỗi phiên hoàn thành

Khi một team hoàn thành phiên hiện tại:

1. chạy verify tương ứng
2. ghi evidence
3. báo `% hoàn thành / % còn lại`
4. tự nhận nhiệm vụ kế tiếp trong board hiện hành
5. chỉ dừng nếu dependency tiếp theo thuộc team khác hoặc Ops/PM chưa mở gate

Nếu blocker kéo dài hơn `15 phút`:

- phải escalate trong lượt nhắc kế tiếp
- phải ghi rõ owner thật
- phải ghi action đã thử
- không được ghi chung chung là “đang chờ”

## 4. Nhiệm vụ nhắc theo team

### Team 1 — `vtl-team1-runtime-release`

Trọng tâm hiện tại:

- giữ core runtime xanh
- giữ Wave C ở `hardening_ready / promotion_blocked`
- giữ Wave D ở `tooling_ready / dns_blocked`
- phối hợp Ops để mở DNS Wave D
- chỉ deploy Wave D khi DNS mở đủ

Lệnh nhắc bắt buộc:

```bash
npm run verify:planned-safe:wave:release
node scripts/deploy-wave-d-pages.mjs --dry-run
node scripts/verify-wave-d-public-publish.mjs
node scripts/verify-wave-c-life-invest-hardening.mjs
```

Nếu Ops xác nhận DNS Wave D đã mở đủ:

```bash
node scripts/deploy-wave-d-pages.mjs --branch main
node scripts/verify-wave-d-public-publish.mjs
```

### Team 2 — `vtl-team2-frontend-ux-mobile`

Trọng tâm hiện tại:

- dọn wording công khai còn kỹ thuật ở `member`, `work`, `market`, `life`, `invest`, `green`
- giữ nav/status render bám runtime truth
- không tạo false-live ở planned-safe domains
- polish planned-safe shell cho `community`, `ai`, `business`

Lệnh nhắc bắt buộc:

```bash
npm run build
npm run check
npm run verify:planned-safe:wave:release
```

Team 2 phải báo rõ file nào đã dọn và bằng chứng không còn wording sai.

### Team 3 — `vtl-team3-governance-runtime-truth`

Trọng tâm hiện tại:

- giữ go/no-go theo từng wave
- ký nhận Wave C đúng nghĩa `hardening PASS / promotion NO-GO`
- audit wording planned-safe cho `work`, `market`, `community`, `ai`, `business`
- không cho Wave E signoff khi Wave D còn DNS blocked

Lệnh nhắc bắt buộc:

```bash
npm run verify:team3:parity
node scripts/verify-wave-c-life-invest-hardening.mjs
npm run verify:planned-safe:wave:release
```

Team 3 phải báo verdict theo format:

- Wave C: `GO/HOLD` cho hardening
- Wave C: `NO-GO/PROMOTION_REVIEW_REQUIRED` cho promotion
- Wave D: `LOCAL_READY/DNS_BLOCKED/PUBLISH_READY`

### Team 4 — `vtl-team4-data-registry-forms`

Trọng tâm hiện tại:

- giữ package/form registry không drift
- tiếp tục cross-domain data contract cho dashboard/journey
- business domain data phải tách khỏi flow cá nhân
- demo/comparison/output data phải có đầu ra rõ

Lệnh nhắc bắt buộc:

```bash
node scripts/verify-team4-endpoints-pack.mjs
npm run build
npm run check
```

Team 4 phải báo:

- registry nào đã cập nhật
- schema nào còn thiếu
- domain nào đang cần dữ liệu demo/output

### Team 5 — `vtl-team5-smoke-release-qa`

Trọng tâm hiện tại:

- giữ Wave B evidence done
- giữ Wave C evidence hardening-ready
- chờ Team 1 publish Wave D sau DNS để live verify
- chuẩn bị total-system release gate pack cho Wave E

Lệnh nhắc bắt buộc:

```bash
npm run verify:planned-safe:wave:release
node scripts/verify-wave-d-public-publish.mjs
node scripts/verify-wave-c-life-invest-hardening.mjs
```

Sau khi Team 1 deploy Wave D thật:

```bash
node scripts/verify-wave-d-public-publish.mjs
```

Team 5 phải báo:

- smoke pass/fail
- strict pass/fail
- `publish_ready: true/false`
- host nào fail và fail vì DNS, TLS, status, hay marker

## 5. Format báo cáo bắt buộc mỗi 15 phút

Mỗi team báo theo mẫu:

```md
Team:
Channel:
Completed:
In progress:
Next 15 minutes:
Blockers:
Owner needed:
Evidence:
% hoàn thành / % còn lại:
```

Team 1 tổng hợp sau mỗi lượt:

```md
Team 1: x% / y%
Team 2: x% / y%
Team 3: x% / y%
Team 4: x% / y%
Team 5: x% / y%
Tổng hệ: x% / y%
Done thật trong lượt này:
Blocker thật:
Gate kế tiếp:
```

## 6. Stop-line không được vi phạm

- không claim live khi DNS hoặc runtime verify chưa pass
- không promote `life` / `invest` khi runtime truth vẫn là `planned_public`
- không mở Wave E khi Wave D chưa có publish evidence
- không dùng wording nội bộ trên public surface
- không tự đổi pricing, legal, policy hoặc entitlement model

## 7. Điều kiện duy nhất được tắt nhắc tự động

Automation nhắc việc `15 phút/lần` chỉ được tắt cho một team khi team đó đã xong hoàn chỉnh toàn bộ nhiệm vụ của mình.

Không được tắt vì:

- hết giờ làm
- team đang mệt
- đang chờ daily meeting
- task gần xong nhưng chưa có evidence
- chỉ mới báo miệng là xong

Một team chỉ được coi là đủ điều kiện tắt nhắc khi có đủ `6` điều kiện:

1. toàn bộ backlog của team trong board active đã hoàn thành
2. verify tương ứng đã pass
3. evidence đã được ghi trong repo hoặc report rõ ràng
4. báo cáo cuối đã có `% hoàn thành / % còn lại = 100% / 0%`
5. Team 1 xác nhận không còn dependency mở của team đó
6. QA / PM hoặc owner gate tương ứng không còn giữ `HOLD`

Nếu thiếu bất kỳ điều kiện nào:

- automation vẫn tiếp tục nhắc team đó mỗi `15 phút`
- team phải tiếp tục dev, verify, hoặc escalate blocker thật

Khi đủ điều kiện tắt, Team 1 phải ghi một dòng kết luận:

```md
Team <số> đủ điều kiện tắt reminder: 100% / 0%, evidence đã pass, không còn blocker mở.
```

Chỉ sau dòng kết luận này mới được tắt reminder cho team đó.

## 8. Tài liệu nền bắt buộc

- [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md)
- [VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md)
- [VTL_56_WAVE_C_RELEASE_NOTE_LIFE_INVEST_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_56_WAVE_C_RELEASE_NOTE_LIFE_INVEST_2026-04-22.md)
- [VTL_57_QA_PM_OPS_SIGNOFF_CHECKLIST_WAVE_C_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_57_QA_PM_OPS_SIGNOFF_CHECKLIST_WAVE_C_2026-04-22.md)

## 9. Câu chốt

Nhắc việc không phải để làm phiền.

Nhắc việc để hệ không đứng yên.

Mỗi 15 phút, team phải hoặc tiến thêm, hoặc báo đúng blocker thật.

Nhắc việc chỉ được tắt khi team đã thật sự xong `100% / 0%`.
