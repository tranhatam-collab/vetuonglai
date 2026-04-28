# VTL 68 — Kids Homepage Launch Team Split

Phiên bản: 1.0
Ngày: 2026-04-29
Trạng thái: active_today
Owner điều phối: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · Founder

## 0. Mục tiêu của lượt này

Khóa kế hoạch mới cho `kids.vetuonglai.com` như một subdomain bổ sung trong tổng hệ.

Mục tiêu hôm nay không phải là mở toàn bộ hệ Kids.
Mục tiêu hôm nay là:

- chốt **homepage public info** của `kids.vetuonglai.com`
- giữ đúng ranh giới **child-safe / parent-mediated / no-commerce**
- nếu homepage đạt gate, **commit ngay hôm nay**

## 1. Runtime truth hiện tại

Nguồn sự thật hiện có trong repo:

- `cloudflare/domain-runtime-truth.json`
  - `host`: `kids.vetuonglai.com`
  - `servingModel`: `worker_fronted`
  - `status`: `planned_public`
  - `requiredPublic`: `false`
  - `publicDiscovery`: `false`
- `src/data/system-registry.json`
  - `status`: `planned`
  - `primaryNav`: `false`
- `cloudflare/workers-projects.json`
  - worker: `vetuonglai-kids`
  - routes: `kids.vetuonglai.com/*`, `www.kids.vetuonglai.com/*`

Kết luận:

- Kids đã có spec + build + worker lane
- Kids chưa được coi là live public discovery
- Kids không được leak từ hub / member / nav chính

## 2. Scope hôm nay

### Phải làm

- homepage `/` (VI)
- homepage `/en/` (EN)
- block `Mùa Hè Lập Trình Viên — Đà Lạt` ở mức **thông tin**
- child-safe banner, copy, CTA không bán
- QA + smoke + predeploy gate
- commit nếu homepage pass gate

### Không làm hôm nay

- không mở form đăng ký
- không mở payment
- không mở login / onboarding flow công khai
- không public parent dashboard như feature live
- không public lesson flow như feature live
- không đưa Kids vào primary nav của hub/member
- không claim `live` nếu chưa có deploy proof + founder go

## 3. Gate bắt buộc trước khi commit homepage

1. `npm run check`
2. `npm run smoke:kids:worker`
3. `npm run verify:kids:predeploy`
4. Không leak `kids.vetuonglai.com` từ hub/member/public main nav
5. Homepage không có:
   - email capture
   - payment
   - checkout
   - sign up
   - register
6. Copy bám Language Codex:
   - không hype
   - không viết tắt sai chuẩn
   - không trộn VI / EN trong cùng block

## 4. Giao việc theo team

### Team 1 — Platform / Runtime / Release Control

Chịu trách nhiệm:

- điều phối toàn lane `kids`
- giữ runtime truth chưa flip vội
- kiểm tra worker `vetuonglai-kids` + route/deploy path
- chỉ cho phép deploy sau khi Team 5 ký predeploy pass
- quyết định commit packet homepage cùng founder nếu gate đủ

Phải làm ngay:

1. Rà `cloudflare/workers-projects.json` cho worker `kids`
2. Xác nhận route lane và account cutover state
3. Chạy lại gate kỹ thuật sau khi Team 2 chốt homepage
4. Giữ `kids` ở trạng thái `planned_public / requiredPublic=false` cho tới khi có deploy proof

Lệnh chính:

```bash
npm run check
npm run smoke:kids:worker
npm run verify:kids:predeploy
```

### Team 2 — Frontend / UX / Public Surface

Chịu trách nhiệm:

- hoàn thiện homepage `kids.vetuonglai.com`
- bảo đảm song ngữ VI/EN sạch
- mobile-first
- không để homepage biến thành landing bán hàng

Phải làm ngay:

1. Chốt `/` và `/en/`
2. Chốt block `Mùa Hè Lập Trình Viên — Đà Lạt` đúng scope thông tin
3. Chốt CTA:
   - `Xem dự án mẫu`
   - `Xem hành trình học`
4. Rà lại child-safe visual / spacing / readability
5. Không link sang flow phụ huynh / học như public CTA chính

File trọng tâm:

- `src/static-pages/kids.vetuonglai.com/index.html`
- `src/static-pages/kids.vetuonglai.com/en/index.html`
- `src/static-pages/kids.vetuonglai.com/assets/kids.css`
- `src/static-pages/kids.vetuonglai.com/assets/kids.js`
- `docs/kids/11_DAY_0_LAUNCH_PLAN.md`

### Team 3 — Governance / Safety / Truth Gate

Chịu trách nhiệm:

- audit truth wording
- audit child-safe boundary
- audit no-commerce / no-registration
- giữ đúng status của Kids trong hệ

Phải làm ngay:

1. Review homepage copy VI/EN
2. Chặn mọi câu có màu bán hàng, thu hút, ép CTA
3. Chặn mọi leak:
   - public signup
   - payment wording
   - public profile / leaderboard / earning
4. Ký note `homepage_ready_for_commit` hoặc `hold`

### Team 4 — Data / Content Contract / Parent Boundary

Chịu trách nhiệm:

- dữ liệu curriculum / contract / sample outputs
- block phụ huynh và lesson data không drift khỏi homepage promise
- đảm bảo homepage nói đúng những gì backend/data đã có

Phải làm ngay:

1. Rà `src/data/kids-curriculum.json`
2. Rà `src/data/kids-api-contract.json`
3. Rà `src/data/kids-lessons.json`
4. Đảm bảo sample project / sample outcome trên homepage khớp data thật
5. Giữ parent-managed boundary rõ

### Team 5 — Smoke / QA / Release Verification

Chịu trách nhiệm:

- chạy gate cuối trước commit homepage
- xác nhận homepage đúng scope Day 0
- không ký live release nếu chưa có deploy proof

Phải làm ngay:

1. Chạy `npm run smoke:kids:worker`
2. Chạy `npm run verify:kids:predeploy`
3. Rà:
   - robots
   - sitemap
   - canonical / hreflang
   - no-commerce surface
4. Ký `commit_ready_today` hoặc `hold`

## 5. Tiêu chí commit homepage hôm nay

Homepage `kids` được commit hôm nay khi đủ đồng thời:

- Team 2 chốt xong `/` và `/en/`
- Team 3 không còn safety/truth stop-line
- Team 4 xác nhận data/sample không drift
- Team 5 cho `predeploy PASS`
- Team 1 xác nhận packet chỉ là homepage/day-0 scope, không lẫn full launch

## 6. Tiêu chí chưa được gọi là live

Dù homepage commit hôm nay, vẫn **không** được tự gọi là live nếu thiếu một trong các điều sau:

- deploy proof trên account/zone đúng
- route/domain binding đúng
- founder go cho public homepage
- Team 5 smoke sau deploy pass

## 7. Câu chốt cho toàn team

Hôm nay chúng ta không mở toàn bộ Kids.
Chúng ta chỉ chốt đúng một bề mặt: homepage công khai, an toàn, rõ giá trị.
Nếu homepage qua đủ gate, commit ngay trong hôm nay.
