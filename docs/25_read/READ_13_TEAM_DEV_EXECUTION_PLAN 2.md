# READ_13 — Team Dev Execution Plan

## 0. Mục tiêu

File này là execution plan hoàn chỉnh cho team dev để triển khai `read.vetuonglai.com` theo đúng phase đã khóa ở `READ_11` và runtime truth ở `READ_10`.

Nguyên tắc bắt buộc:

- không mở phase sau khi phase trước chưa pass verify
- không claim `live` khi stage hiện tại chưa được promote
- không đưa checkout, payout, contributor earning lên public shell khi stage còn `planned_public`
- mọi thay đổi phải bám file manifest ở `READ_12`

## 1. Trạng thái hiện tại

- Phase 0: `done`
- Phase 1: `open_now`
- Current target stage: `planned_public`
- Current technical target: dựng shell public + Pages + DNS + build pipeline
- Current stop-line: chưa được mở monetization, checkout, payout, contributor onboarding trên domain public

## 2. Deliverable theo phase

### Phase 1 — Static shell live (`planned_public`)

Deliverable bắt buộc:

- `src/static-pages/read.vetuonglai.com/` được tạo đủ theo `READ_12`
- `scripts/build.mjs` render `dist/read.vetuonglai.com/`
- `scripts/check.mjs` verify thêm `read.vetuonglai.com`
- `cloudflare/pages-projects.json` có project `vetuonglai-read`
- `cloudflare/domain-runtime-truth.json` có row `read.vetuonglai.com`
- hub homepage có banner/card announce `read.vetuonglai.com`
- `read.vetuonglai.com` trả `HTTP 200`

Exit gate:

- `npm run build` pass
- `npm run check` pass
- `node scripts/audit-bilingual.mjs` không có issue trên read pages
- domain public trả `HTTP 200`
- wording đúng `planned_public`

### Phase 2 — Checkout owner-only (`member_preview`)

Deliverable bắt buộc:

- worker checkout cho `read`
- D1 schema `orders`, `order_splits`
- 1 ebook test do owner publish
- refund flow + clawback
- email confirmation + access link

Exit gate:

- 1 thanh toán thật pass end-to-end
- refund thật pass
- tax withholding đúng với case `199k` và `5M`

### Phase 3 — Auto settlement (`member_preview`)

Deliverable bắt buộc:

- cron settlement worker
- payout integration
- public ledger APIs
- transparency dashboard có data thật

Exit gate:

- 4 tuần auto-payout liên tiếp pass
- ledger có tối thiểu 4 entries thật
- gross = paid + kept + tax

### Phase 4 — Multi-contributor (`live`)

Deliverable bắt buộc:

- contributor onboarding trên `member.vetuonglai.com`
- tax profile collection
- VC verify cho tier promotion
- editor queue + reviewer assignment
- author/editor split logic

Exit gate:

- 3 contributor onboard thành công
- 1 essay multi-role publish thành công
- payout author/editor đúng
- accountant audit pass

### Phase 5 — Translator + Designer + Referrer

Deliverable bắt buộc:

- translator onboarding
- designer onboarding
- referrer tracking integration
- multi-role split UI trên book detail

Exit gate:

- 2 bản dịch bán pass
- 1 cover designer live
- 1 referrer chain payout đúng

### Phase 6 — Curator + Reading Stack

Deliverable bắt buộc:

- curator promotion flow
- reading stack UI
- bundle pricing + curator 5%
- stack discovery section

Exit gate:

- 1 curator onboarded
- 1 stack live với 5+ books
- 1 stack purchase split đúng

### Phase 7 — Sponsor + Community Vote (`live_full`)

Deliverable bắt buộc:

- sponsor flow
- VC sponsor badge
- quarterly bonus vote
- lead editor rotation rule

Exit gate:

- 5 sponsorships live
- quarterly vote tested
- stage promote `live` -> `live_full`

## 3. Phân chia nhiệm vụ theo team

### Team 1 — Platform / Runtime / Payments / Release

Owner chính cho toàn bộ runtime lane.

Phase 1:

- tạo Pages project `vetuonglai-read`
- mở DNS `read.vetuonglai.com`
- thêm `read` vào build/check/runtime truth/system registry
- dựng static routes theo manifest

Phase 2:

- PayOS checkout worker
- webhook/refund/clawback
- D1 schema + email flow

Phase 3:

- settlement cron
- payout integration
- ledger API + dashboard API

Phase 4-7:

- runtime logic cho onboarding, split, stack, sponsor, vote
- promote stage khi đủ evidence

Definition of done:

- mọi verify phase pass
- runtime truth đúng stage
- không còn blocker hạ tầng mở cho phase hiện tại

### Team 2 — Frontend / UX / Public Surface

Owner chính của shell và public wording ở Phase 1.

Phase 1:

- dựng homepage `read`
- dựng archive/catalog/stack placeholders
- dựng `how-we-pay`, `transparency`, `write`, `tiers`, `guidelines`
- add announce banner/card trên hub
- giữ wording đúng `planned_public`

Phase 2-7:

- checkout UX
- dashboard/payout/transparency UI
- contributor/editor/referrer/stack/sponsor UI

Definition of done:

- không false-live
- không wording kỹ thuật/nội bộ trên public pages
- bilingual audit sạch

### Team 3 — Governance / Wording Gate / Promotion Gate

Owner chính của trust gate và stage wording.

Phase 1:

- audit wording `planned_public`
- chặn mọi claim monetization/public-ledger/contributor-live sai stage

Phase 2-3:

- audit wording `member_preview`
- xác nhận public shell không claim community contribution mở

Phase 4-7:

- signoff promotion `member_preview -> live -> live_full`
- govern sponsor/vote language

Definition of done:

- không còn stop-line wording
- stage promotion note có evidence rõ

### Team 4 — Data / Schema / Contracts

Owner chính cho data model và contract nửa sau roadmap.

Phase 1:

- chuẩn bị `read-pillars.json`, `read-revenue-split-lock.json`, `read-tier-ladder.json`

Phase 2-3:

- schema `orders`, `order_splits`, `ledger`
- tax/report/export contracts

Phase 4-7:

- contributor/tax/referrer/stack/sponsor schemas
- split formulas và contract outputs cho UI

Definition of done:

- data contract không drift với runtime
- formulas khớp docs lock và report output

### Team 5 — Verify / Smoke / Release Evidence

Owner chính cho verification pack từ phase có runtime thật.

Phase 1:

- nhận shell verify checklist
- xác nhận build/check/domain/bilingual gate

Phase 2-3:

- verify payment, refund, ledger, payout

Phase 4-7:

- verify onboarding, split, tax, sponsor, vote
- phát hành evidence để promote stage

Definition of done:

- verify pack pass cho phase hiện tại
- report nêu rõ blocker thật nếu fail

### Ops

Vai trò hạ tầng xuyên suốt:

- Pages project
- DNS
- env/secrets/bindings
- D1/KV setup
- production domain/runtime proof

### Founder

Vai trò scope lock:

- approve phase promotion
- approve public promise, payout formula, contributor model

## 4. Backlog mở ngay cho Phase 1

### Team 1

- thêm `read` vào `cloudflare/pages-projects.json`
- thêm `read` vào `cloudflare/domain-runtime-truth.json`
- thêm `read` vào `src/data/system-registry.json`
- thêm `read` vào `src/data/apps.json` nếu hub registry cần hiển thị app
- cập nhật `scripts/build.mjs` để render read domain
- cập nhật `scripts/check.mjs` để check dist read
- tạo project Pages + DNS runtime thật

### Team 2

- tạo `src/static-pages/read.vetuonglai.com/index.html`
- tạo `essays`, `books`, `stacks`, `how-we-pay`, `transparency`, `write`, `tiers`, `guidelines`, `pillars`
- thêm asset `read.css`, `read.js`
- thêm banner/card announce read lên hub

### Team 3

- review copy Phase 1 theo `READ_10`
- khóa banner/status text cho `planned_public`

### Team 4

- tạo 3 data files phase 1
- khóa metadata cho pillars, tier ladder, split formula render

### Team 5

- soạn checklist verify Phase 1
- xác nhận commands + evidence format

### Ops

- xác nhận `read.vetuonglai.com` custom domain và Pages publish lane

## 5. Verify commands cho team dev

Phase 1 local gate:

```bash
npm run build
npm run check
node scripts/audit-bilingual.mjs
```

Phase 1 runtime gate:

```bash
curl -I https://read.vetuonglai.com
```

Phase 2+ planned commands theo spec:

```bash
node scripts/verify-read-runtime-truth.mjs
node scripts/verify-read-settlement.mjs --dry-run
node scripts/verify-read-tax-withholding.mjs --quarter Q1-2026
node scripts/verify-read-ledger-consistency.mjs
```

## 6. Stop-line bắt buộc

Trong lúc Phase 1 chưa pass, không được:

- thêm checkout button hoạt động thật
- hiển thị giá bán live
- ghi “đang trả creator”
- ghi “public ledger live”
- ghi “đang nhận đóng góp”
- gọi domain là `live`

Trong lúc Phase 2-3 chưa pass, không được:

- promote `member_preview -> live`
- claim contributor earning đã mở cho cộng đồng

## 7. Reporting format cho dev team

Mỗi lượt dev báo theo mẫu:

- Team 1: `x% / y%`
- Team 2: `x% / y%`
- Team 3: `x% / y%`
- Team 4: `x% / y%`
- Team 5: `x% / y%`
- Phase hiện tại: `<phase>`
- Done thật trong lượt này
- Blocker thật trong lượt này
- Gate kế tiếp

## 8. File tham chiếu bắt buộc

- `docs/25_read/READ_10_RUNTIME_TRUTH_AND_STATUS.md`
- `docs/25_read/READ_11_DEV_PHASE_PLAN.md`
- `docs/25_read/READ_12_DEV_FILE_MANIFEST.md`
- `docs/final-lock/VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md`

## 9. Kết luận vận hành

Lane `read.vetuonglai.com` hiện chỉ được phép mở theo logic sau:

1. dựng shell public đúng `planned_public`
2. verify domain/build/wording
3. mới mở owner checkout ở `member_preview`
4. chỉ mở community earning sau khi payout/tax/ledger pass thật

Team dev không được nhảy phase. Tốc độ chỉ có ý nghĩa khi stage, wording, payout, và compliance cùng đúng.
