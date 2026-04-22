# VTL TOTAL SYSTEM — 5 TEAM CONTINUATION BOARD

Phiên bản: 1.1
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:02 ICT
Trạng thái: active
Owner chính: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · QA · PM · Ops

## 0. Mục tiêu

Board này là board tiếp tục của toàn hệ sau khi founder lane và core live redeploy bước đầu đã chốt xanh.

Từ thời điểm này, mọi team phải dùng cùng một logic:

- không mở economy trước trust và access
- không mở planned domain như thể đã live
- không bỏ qua mobile closure
- không dùng `%` kiểu vanity, chỉ dùng `%` có bám backlog đã khóa

## 1. Snapshot đã được xác minh

Tính đến `2026-04-22 10:27 ICT`:

- founder lane: `100% / 0%`
- core live redeploy bước đầu: pass
- build hygiene: đã khóa sạch trong pipeline build
- `member.vetuonglai.com`: `live`
- required-public domains đang pass runtime verify:
  - `vetuonglai.com`
  - `member.vetuonglai.com`
  - `vc.vetuonglai.com`
  - `edu.vetuonglai.com`
  - `green.vetuonglai.com`
  - `finance.vetuonglai.com`
- `life.vetuonglai.com` và `invest.vetuonglai.com` hiện ở trạng thái `planned_public`, nhưng Wave C verify đã pass `hardening_ready`
- `work` / `market` / `community` / `ai` / `business` đã có planned-safe shell local
- `cloudflare/pages-projects.json` đã có publish plan cho toàn cụm Wave D
- `node scripts/deploy-wave-d-pages.mjs --dry-run` đã pass cho toàn cụm Wave D
- `node scripts/verify-wave-d-public-publish.mjs --self-test` đã pass
- live verify hiện fail `ENOTFOUND` cho cả `work` / `market` / `community` / `ai` / `business`
- blocker chính của Wave D hiện là `public DNS`, không còn là thiếu shell build, thiếu Pages config, hay thiếu verify tooling

## 2. Cách tính phần trăm của board này

Phần trăm dưới đây là `execution rollup` của tổng kế hoạch từ trạng thái hiện tại tới khi xong các subdomain còn thiếu theo đúng sequence đã khóa.

Không dùng để khoe tiến độ.
Chỉ dùng để biết còn bao nhiêu việc thực sự.

Backlog tổng được chia thành `5` wave khóa:

1. Wave A — Core live stabilization
2. Wave B — Mobile V1 closure
3. Wave C — Core subdomains hardening
4. Wave D — Planned-safe rollout cho các subdomain còn thiếu
5. Wave E — Release/QA/Ops pack toàn hệ

## 3. Tổng rollup toàn hệ

Theo backlog đã khóa ở board này:

- tổng hoàn thành: `71%`
- tổng còn lại: `29%`

Ghi chú:

- `71%` này đã bao gồm founder lane closure, Wave A, Wave B, Wave C hardening-ready, Wave D local-ready, Pages publish plan đã khóa, và deploy/verify runbook đã sẵn sàng
- phần `29%` còn lại nằm chủ yếu ở signoff/promotion Wave C, DNS/runtime publish Wave D, và release/QA/Ops pack cuối của Wave E

## 4. Phần trăm theo team

### Team 1 — Platform / Runtime / Release Control

Backlog khóa:

1. build hygiene + dist cleanup
2. core live redeploy + runtime verify
3. guarded access/mobile contract stabilization
4. `life` / `invest` runtime hardening
5. planned-safe runtime cho `work` / `market` / `community` / `ai` / `business`
6. cross-domain release pack và rollback pack

Trạng thái:

- hoàn thành: `82%`
- còn lại: `18%`

### Team 2 — Frontend / UX / Mobile / Public Surfaces

Backlog khóa:

1. founder shell cleanup
2. mobile V1 state parity
3. core nav/status render bám runtime registry
4. wording/copy cleanup cho `member`, `work`, `market`, `life`, `invest`, `green`
5. planned-safe UI cho `work`, `market`, `community`, `ai`, `business`
6. hero/CTA/disclosure consistency toàn hệ

Trạng thái:

- hoàn thành: `44%`
- còn lại: `56%`

### Team 3 — Governance / Runtime Truth / QA Gate

Backlog khóa:

1. founder parity/audit
2. runtime truth matrix sync
3. mobile trust/disclosure parity
4. planned-safe wording gate cho domain chưa live
5. release go/no-go theo từng wave
6. audit report cho total plan mỗi ngày

Trạng thái:

- hoàn thành: `72%`
- còn lại: `28%`

### Team 4 — Data / Registry / Forms / Content Contracts

Backlog khóa:

1. founder data seeds
2. package/form registry cho member + subdomains
3. business domain intake schema
4. teaser/demo contract data cho planned domains
5. unified registry cho pricing/package/form comparison
6. cross-domain data contract cho dashboard/journey

Trạng thái:

- hoàn thành: `83%`
- còn lại: `17%`

### Team 5 — Smoke / Strict Contract / Release Verification

Backlog khóa:

1. founder release wrapper
2. core live smoke/release verify
3. mobile release verification pack
4. wave verify pack cho `life` / `invest`
5. planned-safe verify pack cho `work` / `market` / `community` / `ai` / `business`
6. total-system release gate report

Trạng thái:

- hoàn thành: `92%`
- còn lại: `8%`

## 5. Trật tự thực thi bắt buộc từ bây giờ

### Wave A — Core live stabilization

Trạng thái: `done`

Đã khóa:

- core workers redeploy
- local verify xanh
- runtime verify xanh
- founder live verify xanh
- build hygiene sạch

### Wave B — Mobile V1 closure

Trạng thái: `done`

Mục tiêu:

- chốt mobile state parity cho `visitor`, `pending_member`, `annual_active`, `pack_owner`
- khóa entitlement/mobile/session state mapping
- chốt QA mobile cho `hub/member/edu/vc`

Owner:

- Team 1
- Team 2
- Team 3
- Team 5

Exit gate:

- `npm run verify:team-app:day1:local` pass
- mobile flow pack pass
- không còn drift trust wording trên mobile surfaces

### Wave C — Core subdomains hardening

Trạng thái: `active_now / hardening_ready / promotion_blocked`

Phạm vi:

- `life.vetuonglai.com`
- `invest.vetuonglai.com`
- wording/status cleanup còn sót ở `member`, `work`, `market`, `green`, `finance`, `edu`
- nav/status render chỉ lấy từ runtime truth / registry

Owner:

- Team 1: runtime + contract
- Team 2: wording + UI surface
- Team 3: trust wording + status gate
- Team 5: smoke + strict verify

Exit gate:

- không còn hard-coded status sai runtime truth
- không còn public wording kỹ thuật/nội bộ
- `life` và `invest` đã pass verify pack ở mức `hardening_ready`
- quyết định promote hay tiếp tục giữ `planned_public` phải có signoff riêng

### Wave D — Planned-safe rollout cho các subdomain còn thiếu

Trạng thái: `active_next / local_ready / dns_blocked`

Cụm domain:

- `work.vetuonglai.com`
- `market.vetuonglai.com`
- `community.vetuonglai.com`
- `ai.vetuonglai.com`
- `business.vetuonglai.com`

Rule:

- chỉ mở planned-safe hoặc gated-only
- không được dùng copy ám chỉ “đã live đầy đủ”
- mọi CTA phải dẫn về điểm vào hợp lệ

Team split:

- Team 1: runtime guard + route validity
- Team 2: planned-safe UI shell + teaser/demo/gateway
- Team 3: disclosure + wording gate
- Team 4: package/form/demo data contracts
- Team 5: smoke + contract verify

Exit gate:

- mỗi domain có status đúng
- mỗi domain có CTA hợp lệ
- không có route cụt hoặc claim quá current state

### Wave E — Release/QA/Ops pack toàn hệ

Trạng thái: `next`

Mục tiêu:

- release note theo wave
- QA/PM signoff pack theo wave
- deploy checklist + rollback checklist
- system-level reporting cuối wave

## 6. Nhiệm vụ ngay cho từng team

### Team 1 — làm ngay

1. giữ core runtime xanh sau redeploy
2. chốt signoff hardening lane cho `life` và `invest`
3. giữ Pages publish plan + deploy runbook đã khóa cho `work`, `market`, `community`, `ai`, `business` và phối hợp Ops mở DNS
4. chặn mọi route planned chưa đủ điều kiện bằng runtime truth hiện hành

### Team 2 — làm ngay

1. giữ mobile state parity đã khóa trên `hub/member/edu/vc`
2. dọn wording công khai còn kỹ thuật ở `member`, `work`, `market`, `life`, `invest`, `green`
3. khóa render nav/status chỉ bám registry/runtime truth
4. polish planned-safe shell cho `community`, `ai`, `business` mà không tạo false-live

### Team 3 — làm ngay

1. refresh note Wave B theo evidence pass mới của Team 5
2. audit planned-safe wording cho `work`, `market`, `community`, `ai`, `business`
3. phát hành go/no-go note ngắn cho từng wave, không gom một lần cho toàn hệ

### Team 4 — làm ngay

1. giữ registry package/form cho member + subdomains đã đồng bộ
2. mở tiếp contract dữ liệu cross-domain cho dashboard/journey
3. duy trì comparison/demo/output data cho các gói Foundation / Applied / Professional / Business

### Team 5 — làm ngay

1. phát hành evidence pack ngắn cho Wave B = done
2. phát hành evidence pack ngắn cho Wave C = hardening-ready / promotion blocked
3. rerun live verify cho Wave D ngay sau khi Team 1 deploy Pages thật, rồi chuẩn bị total-system release gate report cho Wave E

## 7. Không được làm trong wave hiện tại

- không mở economy live trước trust/access
- không coi `planned_public` là `live`
- không launch `work` / `market` như production usable nếu chưa có verify pack riêng
- không đưa `business` vào flow cá nhân
- không viết thêm copy bán sâu khi mobile/core hardening chưa xong

## 8. Command gate bắt buộc

Local:

```bash
npm run verify:team-app:day1:local
npm run verify:team3:parity
```

Live core:

```bash
npm run cloudflare:smoke:endpoints
npm run cloudflare:verify:runtime
node scripts/verify-founder-lane-release.mjs --base-url https://member.vetuonglai.com --auth-header x-founder-role --auth-value founder
```

Wave-specific verify do Team 5 phát hành sau.

## 9. Format báo cáo sau mỗi lượt dev

Team 1 phải báo theo đúng mẫu:

- Team 1: `x% / y%`
- Team 2: `x% / y%`
- Team 3: `x% / y%`
- Team 4: `x% / y%`
- Team 5: `x% / y%`
- Tổng hệ: `x% / y%`
- Done thật trong lượt này
- Blocker thật trong lượt này
- Gate kế tiếp

## 10. Evidence tham chiếu

- core live rollup: [VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_47_CORE_LIVE_DEPLOY_ROLLUP_2026-04-22.md)
- progress rollup mới nhất sau Wave B + Wave D local-ready: [VTL_53_WAVE_B_D_RUNTIME_PROGRESS_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_53_WAVE_B_D_RUNTIME_PROGRESS_ROLLUP_2026-04-22.md)
- snapshot blocker publish mới nhất cho Wave D: [VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md)
- runbook deploy/verify của Wave D: [VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_55_WAVE_D_PAGES_DEPLOY_AND_VERIFY_RUNBOOK_2026-04-22.md)
- master board: [39_EXECUTION_BOARD_VETUONGLAI_V1.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md)
- founder lane control board: [VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21.md)

## 11. Câu chốt

Founder lane đã xong.
Core live bước đầu đã xanh.

Từ đây, tốc độ chỉ có ý nghĩa nếu mọi team chạy đúng wave, đúng status, đúng runtime truth.
