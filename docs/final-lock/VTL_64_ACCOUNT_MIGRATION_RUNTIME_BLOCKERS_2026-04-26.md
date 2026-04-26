# VTL 64 — Account Migration Runtime Blockers

Phiên bản: 1.0
Ngày: 2026-04-26
Trạng thái: active
Owner điều phối: Team 1

## 0. Mục tiêu của lượt này

Chốt phần đã làm được thật trong lane migration sang Cloudflare account:

- `Anhhatam@gmail.com's Account`
- `62d57eaa548617aeecac766e5a1cb98e`

và khóa rõ blocker còn lại trước khi dọn account cũ.

## 1. Việc đã xác nhận pass

### 1.1 Config trong repo

- `cloudflare/pages-projects.json` đã đổi sang account mới
- `cloudflare/workers-projects.json` đã đổi sang account mới
- `scripts/deploy-workers.mjs` đã có mode `--script-only` để mirror code trước khi attach route

### 1.2 Pages và worker code

- Pages inventory sync sang account mới: `PASS`
- Pages deploy proof cho 12 public shell: `PASS`
- Worker code mirror ở `script_only` cho 6 worker lõi: `PASS`
- Local verify sau khi rehydrate file provider: `PASS`
  - `npm run check`
  - `npm run verify:planned-safe:wave:release`

### 1.3 Main-host probe

DNS resolve công khai và HTTP `200` hiện có cho:

- `vetuonglai.com`
- `edu.vetuonglai.com`
- `green.vetuonglai.com`
- `finance.vetuonglai.com`
- `member.vetuonglai.com`
- `vc.vetuonglai.com`

Lưu ý:

- đây là bằng chứng host đang usable
- chưa đủ để kết luận toàn bộ route runtime đã cutover sang account mới

### 1.4 Route sync prep trên zone mới

Đã sync route bằng Cloudflare API cho 3 worker không có strict secret gate:

- `edu.vetuonglai.com/*` -> `vetuonglai-edu-github`
- `www.edu.vetuonglai.com/*` -> `vetuonglai-edu-github`
- `green.vetuonglai.com/*` -> `vetuonglai-green`
- `www.green.vetuonglai.com/*` -> `vetuonglai-green`
- `finance.vetuonglai.com/*` -> `vetuonglai-finance`
- `www.finance.vetuonglai.com/*` -> `vetuonglai-finance`

Lưu ý:

- route này đang nằm trên zone mới của account đích
- zone mới vẫn là `pending`, nên route prep chưa làm đổi main host hiện tại

## 2. Secret migration state

### 2.1 Xác nhận được

Trên account mới:

- `wrangler secret list --name vetuonglai-home --format json` -> `[]`
- `wrangler secret list --name vetuonglai-member --format json` -> `[]`

### 2.2 Kết luận kỹ thuật

- repo này không chứa giá trị secret thật để mirror
- Cloudflare/Wrangler không cho đọc lại giá trị secret từ account cũ
- vì vậy không thể tự động mirror secret chỉ bằng code của repo

### 2.3 Secret còn thiếu

`vetuonglai-home`

- `SESSION_COOKIE_SECRET`
- `MAGIC_LINK_SIGNING_KEY`
- `PAY_IAI_ONE_API_KEY`
- `PAY_IAI_ONE_WEBHOOK_SECRET`

`vetuonglai-member`

- `SESSION_COOKIE_SECRET`
- `MAGIC_LINK_SIGNING_KEY`
- `PAY_IAI_ONE_API_KEY`
- `PAY_IAI_ONE_WEBHOOK_SECRET`

`vetuonglai-vc`

- `SESSION_COOKIE_SECRET`
- `VC_IDENTITY_ATTESTATION_SECRET`
- `VC_OWNERSHIP_CHALLENGE_SECRET`

## 3. Route/runtime blocker

Đã thử mở route cho worker không có strict secret gate:

- `edu`
- `green`
- `finance`

Nhưng chưa thể hoàn tất vì asset local đang ở trạng thái `compressed,dataless`.

Cập nhật mới nhất:

- blocker `dataless` của `scripts/` và `dist/` đã được gỡ ở lane local
- blocker hiện tại không còn là asset local
- blocker hiện tại là `zone activation + secret source + old-account active zone`

## 4. Local environment blocker

Các file đang block verify/deploy local:

- `scripts/check.mjs`
- `scripts/verify-planned-safe-wave-release.mjs`
- `dist/edu.vetuonglai.com/index.html`
- `dist/green.vetuonglai.com/index.html`
- `dist/finance.vetuonglai.com/index.html`

Triệu chứng đã xác nhận:

- `fileproviderctl evaluate ...` trả:
  - `isDownloadRequested = 1`
  - `isDownloaded = 0`
  - `isDownloading = 1`
- `npm run check` bị treo khi đọc `scripts/check.mjs`
- `npm run verify:planned-safe:wave:release` bị treo cùng nguyên nhân
- deploy worker full-route cho `edu/green/finance` bị treo khi đọc asset local

Đây là blocker môi trường local/macOS File Provider, chưa phải bug logic của script.

Trạng thái hiện tại của blocker này:

- `CLEARED` cho lane local cần dùng trong lượt này
- cần tiếp tục theo dõi nếu các file khác trong repo lại rơi về `dataless`

## 4B. Cloudflare control-plane blocker

Zone `vetuonglai.com` trong account mới hiện là:

- zone id: `34862e35921b6643995f18b38b1808bd`
- status: `pending`
- nameservers mới:
  - `barbara.ns.cloudflare.com`
  - `patrick.ns.cloudflare.com`

Zone active đang phục vụ main host hiện tại vẫn thuộc account cũ:

- account id: `f3f9e76222dcb488d5e303e29e8ba192`
- nameservers active:
  - `davina.ns.cloudflare.com`
  - `justin.ns.cloudflare.com`

Kết luận:

- main host hiện chưa chạy trên zone/account mới
- account cũ chưa thể dọn
- cutover main host phụ thuộc đổi nameserver hoặc hoàn tất activation của zone mới

## 4C. Wrangler CLI auth blocker

`wrangler whoami` và `wrangler deploy ... --routes ...` hiện fail với:

- `Authentication error [code: 10000]`
- `Max auth failures reached [code: 9109]`

Do đó:

- lane `wrangler deploy` không phải đường cutover đáng tin cậy trong phiên này
- lane đúng hiện tại là:
  - Cloudflare API trực tiếp cho inventory, Pages domain attach và route sync prep
  - main host cutover vẫn chờ zone activation + secret source

## 5. Quyết định chốt

Không được:

- attach route cho `home`, `member`, `vc` khi secret chưa mirror xong
- dọn account cũ khi chưa có custom-domain runtime proof trên account mới
- coi test lane local đang pass khi file `dataless` chưa materialize

## 6. Việc tiếp theo bắt buộc

1. Lấy nguồn secret thật từ secure Ops storage hoặc founder-provided secret source
2. Materialize local các file `dataless` trong `scripts/` và `dist/`
3. Rerun:
   - `npm run check`
   - `npm run verify:planned-safe:wave:release`
4. Giữ route sync prep qua API cho zone mới; không coi đó là live cutover khi zone còn `pending`
5. Sau khi có secret:
   - mirror secret cho `home`, `member`, `vc`
   - attach route/runtime tương ứng
6. Hoàn tất activation/nameserver cutover của zone mới
7. Verify host chính lần cuối
8. Chỉ sau đó mới dọn account cũ
