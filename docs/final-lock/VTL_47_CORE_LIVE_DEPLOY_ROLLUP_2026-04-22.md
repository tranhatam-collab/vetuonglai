# VTL CORE LIVE DEPLOY ROLLUP — 2026-04-22

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 09:05 ICT
Trạng thái: pass
Owner chính: Team 1
Phạm vi: core live redeploy + core verify + build hygiene hardening

## 0. Mục đích

File này chốt lại đúng 3 việc đã hoàn thành trong lượt hôm nay:

- redeploy lại core live workers sau khi rà soát lõi
- verify lại toàn bộ local + live gates quan trọng
- khóa sạch build pipeline để không kéo artifact cũ sang các lượt deploy sau

File này không mở scope mới.
File này chỉ khóa evidence để toàn team dùng cùng một sự thật runtime.

## 1. Kết luận ngắn

Core lane hiện tại đã đạt trạng thái:

- local core verify: pass
- Team 3 parity: `go`
- live smoke/runtime verify: pass
- founder live release verify: pass

Kết luận vận hành:

- có thể coi `core live redeploy bước đầu` là đã chốt xanh
- founder/member lane vẫn giữ trạng thái `release_ready`
- phần còn lại của tổng kế hoạch phải chuyển sang:
  - mobile V1 closure
  - hardening các subdomain lõi còn lại
  - planned-safe rollout cho các subdomain chưa mở

## 2. Những gì Team 1 đã khóa thật trong lượt này

### 2.1 Build hygiene đã được vá

Đã cập nhật [build.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/build.mjs) để:

- dọn sạch toàn bộ `dist` trước mỗi lượt build
- loại bỏ artifact cũ kiểu `index 2.html`, `robots 2.txt`, `sitemap 2.xml`
- thêm build lock để các lượt verify/build song song không tự va vào nhau
- giữ nguyên `official-docs-lock` và contract outputs trong cùng pipeline sạch

Kết quả sau patch:

- root `dist` chỉ còn đúng các domain hiện hành
- không còn file rác kiểu ` 2` trong output build
- `official-docs-lock` quay lại trạng thái đầy đủ: `58/58`

### 2.2 Local verify đã pass lại toàn bộ

Lệnh đã chạy:

```bash
npm run verify:team-app:day1:local
npm run verify:team3:parity
```

Kết quả:

- `verify:team-app:day1:local` -> pass
- `verify:team3:parity` -> `go`
- `suite: 6/6 pass`
- `stopLineOpen: false`

Evidence:

- [team3-parity.latest.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/reports/team3-parity.latest.json)
- [build.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/build.mjs)

### 2.3 Live redeploy đã pass lại cho core workers

Lệnh logic đã chạy:

```bash
unset CLOUDFLARE_API_TOKEN
npm run cloudflare:deploy:workers:strict -- --worker home
npm run cloudflare:deploy:workers:strict -- --worker member
npm run cloudflare:deploy:workers -- --worker edu
npm run cloudflare:deploy:workers -- --worker green
npm run cloudflare:deploy:workers -- --worker finance
npm run cloudflare:smoke:endpoints
npm run cloudflare:verify:runtime
node scripts/verify-founder-lane-release.mjs --base-url https://member.vetuonglai.com --auth-header x-founder-role --auth-value founder
```

Version đã lên live:

- `vetuonglai-home` -> `d1977cb1-3cda-4e8c-9da4-41f5a5997349`
- `vetuonglai-member` -> `f2c1ce45-d574-4233-8839-c2c5f622fd36`
- `vetuonglai-edu-github` -> `ee641ef0-0cd2-472c-996c-492b34bee830`
- `vetuonglai-green` -> `098c61a7-5fce-4391-9600-bb4244b5b7b4`
- `vetuonglai-finance` -> `cddd2631-2317-4276-8317-420aa1a173cb`

## 3. Live verify mới nhất

### 3.1 Smoke endpoints

Kết quả:

- `10/10` required endpoints pass
- các endpoint bắt buộc đều trả `200`

Bao gồm:

- hub manifest
- VC certificates
- VC verify route
- EDU health
- hub/member API index
- hub/member contracts
- Team 3 policy endpoints

### 3.2 Runtime truth verify

Kết quả:

- required-public domains: pass
- tất cả domain bắt buộc đang trả `200`

Snapshot đúng ở thời điểm chốt:

- `vetuonglai.com` -> `live`
- `member.vetuonglai.com` -> `live`
- `vc.vetuonglai.com` -> `live`
- `edu.vetuonglai.com` -> `live`
- `green.vetuonglai.com` -> `live`
- `finance.vetuonglai.com` -> `live`
- `life.vetuonglai.com` -> `planned_public`
- `invest.vetuonglai.com` -> `planned_public`

### 3.3 Founder live release verify

Lệnh:

```bash
node scripts/verify-founder-lane-release.mjs \
  --base-url https://member.vetuonglai.com \
  --auth-header x-founder-role \
  --auth-value founder
```

Kết quả:

- `smoke: 20/20 pass`
- `strict: 20/20 pass`
- `release_ready: true`

Guardrail đúng:

- action nguy hiểm bị chặn `422`
- route read/query trả JSON parse được và đúng shape kiểm tra

## 4. Ý nghĩa của mốc này

Mốc hôm nay xác nhận:

- deploy bước đầu không chỉ xanh bề mặt, mà lõi build cũng đã được làm sạch
- founder/member lane không bị regression sau patch build pipeline
- total plan có thể đi tiếp mà không phải quay lại dọn artifact build cũ

Mốc hôm nay chưa có nghĩa là:

- toàn bộ hệ đã hoàn thành
- mọi subdomain đã live đầy đủ
- planned domains đã được mở runtime thật

## 5. Gợi ý điều phối sau mốc này

Ngay sau file này, Team 1 phải điều phối tiếp theo thứ tự:

1. mobile V1 closure
2. core subdomains hardening (`life`, `invest`, các bề mặt core còn drift wording/status)
3. planned-safe rollout cho `work`, `market`, `community`, `ai`, `business`
4. release verification theo wave cho từng cụm domain

## 6. Evidence tham chiếu nhanh

- build pipeline: [build.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/build.mjs)
- runtime verify: [verify-runtime.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/verify-runtime.mjs)
- endpoint smoke: [smoke-endpoints.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/smoke-endpoints.mjs)
- founder live verify: [verify-founder-lane-release.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/verify-founder-lane-release.mjs)
- Team 3 parity report: [team3-parity.latest.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/reports/team3-parity.latest.json)
- master board: [39_EXECUTION_BOARD_VETUONGLAI_V1.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md)

## 7. Câu chốt

Core live đã xanh lại bằng evidence mới nhất.

Từ đây, mọi đội phải coi build hygiene và runtime truth là nền bắt buộc, không phải việc phụ.
