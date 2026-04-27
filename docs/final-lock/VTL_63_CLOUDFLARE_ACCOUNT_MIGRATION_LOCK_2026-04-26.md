# VTL 63 — CLOUDFLARE ACCOUNT MIGRATION LOCK

Phiên bản: 1.0  
Ngày: 2026-04-26  
Trạng thái: locked  
Owner điều phối: Team 1  
Áp dụng cho: Team 1 · Team 5 · Ops · QA · PM

## 0. Quyết định khóa

Toàn bộ sub dev code của repo `vetuonglai-system` phải chuyển khỏi Cloudflare account ID cũ và dùng account đích sau đây làm source of truth mới:

- Account name: `Anhhatam@gmail.com's Account`
- Account ID: `62d57eaa548617aeecac766e5a1cb98e`

Từ thời điểm file này được ký:

- mọi config deploy trong repo phải trỏ về account mới
- mọi verify/deploy lane phải giả định account mới là đích duy nhất
- account cũ chỉ được dọn sau khi account mới đã pass verify cần thiết

## 1. Thay đổi đã chốt trong repo

Hai file runtime chính đã được đổi account ID:

- `cloudflare/pages-projects.json`
- `cloudflare/workers-projects.json`

Các script sau không chứa hard-code riêng; chúng đọc account ID từ hai file trên hoặc từ `CLOUDFLARE_ACCOUNT_ID`:

- `scripts/deploy-pages.mjs`
- `scripts/deploy-wave-d-pages.mjs`
- `scripts/deploy-workers.mjs`
- `scripts/cloudflare-sync.mjs`
- `scripts/cloudflare-utils.mjs`

## 2. Guardrail bắt buộc

Không được dọn account cũ trước khi đủ cả 4 điều kiện sau:

1. account mới có đủ Pages/Workers project cần thiết
2. deploy từ repo này sang account mới pass ở scope yêu cầu
3. verify runtime/deploy ở account mới có evidence rõ
4. Team 1 + Team 5 phát hành report xác nhận cutover sạch

Nếu thiếu một trong bốn điều kiện trên:

- giữ nguyên account cũ
- không xóa project
- không gỡ route/domain
- không xóa secret/binding

## 3. Việc nằm trong repo

### Team 1

- giữ mọi deploy lane đọc account mới
- cập nhật report khi có verify trên account mới
- khóa blocker nếu external auth hoặc inventory chưa đủ

### Team 5

- verify release/deploy pack sau khi account mới có inventory usable
- không ký release nếu account mới còn authentication hoặc domain binding gap

## 4. Việc nằm ngoài repo

Các việc sau không thể hoàn tất chỉ bằng sửa code trong repo:

1. xác thực quyền thật vào account mới
2. kiểm tra inventory Pages/Workers của account mới
3. mirror hoặc tạo project/domain/binding trong account mới nếu còn thiếu
4. deploy thật lên account mới
5. dọn account cũ sau cutover

## 5. Trạng thái hiện tại

Trong phạm vi repo:

- migration config: `DONE`

Ngoài phạm vi repo:

- local Wrangler auth: `PASS`
  - email: `tranhatam@gmail.com`
  - account khả dụng:
    - `Anhhatam@gmail.com's Account` — `62d57eaa548617aeecac766e5a1cb98e`
    - `Tranhatam66@gmail.com's Account` — `93112cc89181e75335cbd7ef7e392ba3`
    - `Tranhatam@gmail.com's Account` — `f3f9e76222dcb488d5e303e29e8ba192`
- Pages inventory sync sang account mới: `PASS`
  - đã tạo và attach domain cho:
    - `vetuonglai-landing`
    - `vetuonglai-vc`
    - `vetuonglai-edu`
    - `vetuonglai-green`
    - `vetuonglai-finance`
    - `vetuonglai-life`
    - `vetuonglai-invest`
    - `vetuonglai-work`
    - `vetuonglai-market`
    - `vetuonglai-community`
    - `vetuonglai-ai`
    - `vetuonglai-business`
- Pages deploy proof trên account mới: `PASS`
  - `vetuonglai-landing` → deployment proof có trong `vetuonglai-landing-55c.pages.dev`
  - `vetuonglai-vc` → deployment proof có trong `vetuonglai-vc-7b7.pages.dev`
  - `vetuonglai-edu` → deployment proof có trong `vetuonglai-edu-8i6.pages.dev`
  - `vetuonglai-green` → deployment proof có trong `vetuonglai-green-5pn.pages.dev`
  - `vetuonglai-finance` → deployment proof có trong `vetuonglai-finance-3un.pages.dev`
  - `vetuonglai-life` → deployment proof có trong `vetuonglai-life-cbw.pages.dev`
  - `vetuonglai-invest` → deployment proof có trong `vetuonglai-invest-4eu.pages.dev`
  - `vetuonglai-work` → deployment proof có trong `vetuonglai-work.pages.dev`
  - `vetuonglai-market` → deployment proof có trong `vetuonglai-market.pages.dev`
  - `vetuonglai-community` → deployment proof có trong `vetuonglai-community.pages.dev`
  - `vetuonglai-ai` → deployment proof có trong `vetuonglai-ai.pages.dev`
  - `vetuonglai-business` → deployment proof có trong `vetuonglai-business.pages.dev`
- zone activation: `PASS` — 2026-04-28
  - zone `vetuonglai.com` trên account mới: `active`
  - nameservers active: `barbara.ns.cloudflare.com` + `patrick.ns.cloudflare.com`
  - 13/14 host resolve HTTP 200 công khai (vc.vetuonglai.com trả 403 do thiếu secret)
- Wave D DNS + custom-domain: `PASS` — 2026-04-28
  - `work.vetuonglai.com`, `market.vetuonglai.com`, `community.vetuonglai.com`
  - `ai.vetuonglai.com`, `business.vetuonglai.com`
  - tất cả CNAME proxy về `*.pages.dev` trên account mới, HTTP 200
- Pages deploy proof (2026-04-28 — wave mới nhất):
  - `vetuonglai-landing` → `0ccdbe02.vetuonglai-landing-55c.pages.dev`
  - `vetuonglai-vc` → `496fe8a4.vetuonglai-vc-7b7.pages.dev`
  - `vetuonglai-edu` → `463e4363.vetuonglai-edu-8i6.pages.dev`
  - `vetuonglai-green` → `873f3149.vetuonglai-green-5pn.pages.dev`
  - `vetuonglai-finance` → `c0ca2fb2.vetuonglai-finance-3un.pages.dev`
  - `vetuonglai-life` → `c42cdcb8.vetuonglai-life-cbw.pages.dev`
  - `vetuonglai-invest` → `04165373.vetuonglai-invest-4eu.pages.dev`
  - `vetuonglai-work` → `9269e4dc.vetuonglai-work.pages.dev`
  - `vetuonglai-market` → `ce00bf26.vetuonglai-market.pages.dev`
  - `vetuonglai-community` → `cb7cb44b.vetuonglai-community.pages.dev`
  - `vetuonglai-ai` → `364a6356.vetuonglai-ai.pages.dev`
  - `vetuonglai-business` → `00e04f4c.vetuonglai-business.pages.dev`
- Workers code mirror sang account mới: `PASS` — 2026-04-28
  - `vetuonglai-home` → `https://vetuonglai-home.anhhatam.workers.dev`
  - `vetuonglai-vc` → `https://vetuonglai-vc.anhhatam.workers.dev`
  - `vetuonglai-edu-github` → `https://vetuonglai-edu-github.anhhatam.workers.dev`
  - `vetuonglai-member` → `https://vetuonglai-member.anhhatam.workers.dev`
  - `vetuonglai-green` → `https://vetuonglai-green.anhhatam.workers.dev`
  - `vetuonglai-finance` → `https://vetuonglai-finance.anhhatam.workers.dev`
  - `vetuonglai-kids` → `https://vetuonglai-kids.anhhatam.workers.dev`
  - tất cả 7 worker: script-only deploy, không attach route công khai
- Wave D live verify: `PASS` — 2026-04-28
  - `node scripts/verify-wave-d-public-publish.mjs`: 10/10 checks PASS
  - `publish_ready: true`
- worker secret migration: `PENDING`
  - `vetuonglai-home` thiếu:
    - `SESSION_COOKIE_SECRET`
    - `MAGIC_LINK_SIGNING_KEY`
    - `PAY_IAI_ONE_API_KEY`
    - `PAY_IAI_ONE_WEBHOOK_SECRET`
  - `vetuonglai-member` thiếu:
    - `SESSION_COOKIE_SECRET`
    - `MAGIC_LINK_SIGNING_KEY`
    - `PAY_IAI_ONE_API_KEY`
    - `PAY_IAI_ONE_WEBHOOK_SECRET`
  - `vetuonglai-vc` thiếu:
    - `SESSION_COOKIE_SECRET`
    - `VC_IDENTITY_ATTESTATION_SECRET`
    - `VC_OWNERSHIP_CHALLENGE_SECRET`
- worker route cutover: `PARTIAL`
  - edu, green, finance: route đang phục vụ qua zone mới (HTTP 200)
  - home, member: script có, route chưa attach (thiếu secret)
  - vc: script có, 403 do thiếu secret — chưa attach route
- dọn account cũ: `BLOCKED` — chờ secret migration + vc route pass

## 6. Definition of done

Lane account migration chỉ được gọi là xong khi:

1. config repo đã trỏ đúng account mới
2. deploy lane chạy được trên account mới
3. verify lane có evidence pass trên account mới
4. chỉ sau đó mới được dọn account cũ

## 7. Cảnh báo chốt

`Pages project + pages.dev deployment proof` không đồng nghĩa với:

- custom-domain runtime đã cutover xong
- worker routes đã mirror xong
- secret/binding đã mirror xong
- account cũ có thể xóa ngay

`worker.dev script-only proof` cũng không đồng nghĩa với:

- worker route công khai đã cutover
- runtime secret đã sẵn sàng
- worker API/public flow đã usable trên host chính

Account cũ chỉ được dọn sau khi các lane trên có evidence riêng.
