# VTL PLANNED-SAFE NOTES — WORK / MARKET / COMMUNITY / AI / BUSINESS

Phiên bản: 1.1
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:06 ICT
Trạng thái: `active_reference / local_wording_go / public_rollout_no_go`
Owner: Team 3
Phạm vi: `work` / `market` / `community` / `ai` / `business`

## 0. Mục đích

File này khóa note planned-safe cho các domain chưa mở.

Mục tiêu:

- giúp Team 1 / Team 2 / Team 4 / Team 5 build đúng mức
- chặn false-live, false-usable, false-commerce
- giữ wording, CTA, disclosure và status cùng một logic
- tách rõ `local wording go` với `public rollout no-go`

## 1. Runtime truth và cách đọc file này

Theo snapshot active ngày `2026-04-22 18:06 ICT`:

- `work.vetuonglai.com` = `planned_public`, `requiredPublic=false`
- `market.vetuonglai.com` = `planned_public`, `requiredPublic=false`
- `community.vetuonglai.com` = `planned_public`, `requiredPublic=false`
- `ai.vetuonglai.com` = `planned_public`, `requiredPublic=false`
- `business.vetuonglai.com` = `planned_public`, `requiredPublic=false`

Vì vậy:

- các public shell hiện có của Wave D chỉ được xem là `planned-safe`
- `planned-safe` không đồng nghĩa `live`
- mọi CTA phải quay về điểm vào hợp lệ đang tồn tại thật
- nếu chưa có DNS công khai + deploy thật + live verify, Team 3 vẫn giữ `NO-GO` cho public rollout

## 2. Note planned-safe theo từng domain

| Domain | Owner chính | Điều được phép viết/làm ngay | Điều chưa được phép | Gate để rời planned-safe | Evidence tối thiểu |
| --- | --- | --- | --- | --- | --- |
| `work.vetuonglai.com` | Team 1 + Team 2 + Team 3 + Team 5 | teaser roadmap, project card demo, proof-based work explanation, CTA về hub/entry hợp lệ | job board usable, apply flow thật, claim có việc/thu nhập, onboarding nhà tuyển dụng live | runtime guard + Pages deploy + public DNS + Team 5 live verify | board wave ở [VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md) + blocker pack ở [VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md) |
| `market.vetuonglai.com` | Team 1 + Team 2 + Team 3 + Team 5 | asset demo, packet preview, explanation về digital asset layer, CTA về điểm vào hợp lệ | marketplace usable, checkout thật trên domain, claim bán được ngay hoặc có doanh thu | runtime guard + Pages deploy + public DNS + Team 5 live verify | same as above |
| `community.vetuonglai.com` | Team 1 + Team 2 + Team 3 + Team 5 | cohort/circle preview, participation principles, CTA về hub/member entry hợp lệ | open community live, active social feed, cohort usable claim | runtime guard + Pages deploy + public DNS + Team 5 live verify | same as above |
| `ai.vetuonglai.com` | Team 1 + Team 2 + Team 3 + Team 5 | use-case preview, AI helper demo-safe blocks, CTA về entry hợp lệ | live tool runtime claim, assistant usable production claim, AI hype copy | runtime guard + Pages deploy + public DNS + Team 5 live verify | same as above |
| `business.vetuonglai.com` | Team 4 primary, với Team 1 + Team 2 + Team 3 + Team 5 phụ thuộc | spec, form schema, package comparison, demo-safe enterprise map; public-safe shell chỉ sau khi contract dữ liệu rõ | doanh nghiệp onboarding usable, enterprise solution live, AI agent integration live, business self-serve live | Team 4 data/form contract + Pages deploy + public DNS + Team 5 live verify | [28_PACKAGING_AND_FORMS_SYSTEM_FULL.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/00_master/28_PACKAGING_AND_FORMS_SYSTEM_FULL.md) + runbook ở [VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md) |

## 3. Rule CTA cho toàn bộ cụm domain này

Được phép:

- `Xem điểm vào phù hợp`
- `Tiếp tục tại hub`
- `Xem lớp liên quan`

Không được phép:

- `Mua ngay`
- `Đăng việc ngay`
- `Mở marketplace`
- `Dùng AI ngay`
- `Bắt đầu kiếm tiền`

## 4. Stop-line của Team 3 cho Wave D

Wave D phải dừng nếu:

- bất kỳ domain nào trong cụm này tự nhận `live`
- CTA dẫn vào route cụt hoặc workflow không tồn tại
- copy nói như thể checkout, apply, feed, tool runtime, onboarding doanh nghiệp đã usable
- `business` bị trộn chung vào flow cá nhân

## 5. Blocker còn lại

1. planned-safe local shell, local verify pack và Pages publish plan không còn là blocker của Wave D.
2. `work`, `market`, `community`, `ai`, `business` vẫn chưa có public DNS + runtime publish evidence đủ để Team 3 cho phép claim rollout công khai.
3. Team 1 chỉ được chạy `node scripts/deploy-wave-d-pages.mjs --branch main` sau khi Ops xác nhận DNS mở cho cả 5 host.
4. Team 5 phải giữ `publish_ready: false` cho tới khi `node scripts/verify-wave-d-public-publish.mjs` pass đủ cả 5 host.
5. `business` vẫn phải giữ planned-safe boundary cho tới khi Team 4 contract dữ liệu/form và live verify cùng xanh.

## 6. Câu chốt

Ở snapshot hiện tại, Team 3 cho `GO` cho local wording audit của Wave D.

Team 3 vẫn giữ `NO-GO` cho mọi claim public rollout của `work`, `market`, `community`, `ai`, `business` cho tới khi DNS công khai, deploy thật và live verify cùng xanh.
