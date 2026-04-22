# VTL WAVE D — DNS VÀ RUNTIME PUBLISH BLOCKERS

Phiên bản: 1.1
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:02 ICT
Trạng thái: active_reference
Owner chính: Team 1
Phạm vi: `work` / `market` / `community` / `ai` / `business`, kèm `life` / `invest` làm reference công khai hiện hành

## 0. Mục đích

File này khóa blocker publish thật của Wave D sau khi shell build và verify pack local đã xanh.

Mục tiêu:

- tách rõ `local_ready` với `public_publish_ready`
- chặn việc đọc sai `release_ready` của planned-safe pack thành “đã live”
- cho Team 1, Team 5 và Ops cùng nhìn một sự thật hạ tầng

## 1. Evidence thật đã kiểm

Đã kiểm bằng resolver công khai, dry-run publish plan, và live verify script trực tiếp từ shell.

### 1.1 Reference công khai hiện có

- `life.vetuonglai.com`
  - `dig @1.1.1.1 +short` trả:
    - `104.21.25.54`
    - `172.67.222.247`
  - `curl -I -sS https://life.vetuonglai.com` trả `HTTP/2 200`

- `invest.vetuonglai.com`
  - `dig @1.1.1.1 +short` trả:
    - `104.21.25.54`
    - `172.67.222.247`
  - `curl -I -sS https://invest.vetuonglai.com` trả `HTTP/2 200`

### 1.2 Cụm Wave D hiện tại

Các lệnh sau hiện không trả record công khai:

- `dig @1.1.1.1 +short work.vetuonglai.com`
- `dig @1.1.1.1 +short market.vetuonglai.com`
- `dig @1.1.1.1 +short community.vetuonglai.com`
- `dig @1.1.1.1 +short ai.vetuonglai.com`
- `dig @1.1.1.1 +short business.vetuonglai.com`

Live verify bằng:

- `node scripts/verify-wave-d-public-publish.mjs`

Kết quả:

- `work.vetuonglai.com` -> `fetch failed | getaddrinfo ENOTFOUND work.vetuonglai.com`
- `market.vetuonglai.com` -> `fetch failed | getaddrinfo ENOTFOUND market.vetuonglai.com`
- `community.vetuonglai.com` -> `fetch failed | getaddrinfo ENOTFOUND community.vetuonglai.com`
- `ai.vetuonglai.com` -> `fetch failed | getaddrinfo ENOTFOUND ai.vetuonglai.com`
- `business.vetuonglai.com` -> `fetch failed | getaddrinfo ENOTFOUND business.vetuonglai.com`

Điều này khớp với kết quả `dig`: blocker hiện tại là chưa có public DNS.

### 1.3 Publish lane đã chuẩn bị xong

Đã khóa xong các điểm sau:

- `cloudflare/pages-projects.json` có đủ cấu hình Pages cho:
  - `work`
  - `market`
  - `community`
  - `ai`
  - `business`
- `node scripts/deploy-wave-d-pages.mjs --dry-run` đã pass và in đúng deploy plan cho toàn cụm Wave D
- `node scripts/verify-wave-d-public-publish.mjs --self-test` đã pass

Giải nghĩa đúng:

- publish lane đã `tooling_ready`
- public runtime vẫn `dns_blocked`

## 2. Kết luận vận hành

Tại thời điểm chốt file:

- `work` / `market` / `community` / `ai` / `business` chưa có DNS công khai để Team 5 probe runtime live
- blocker publish của Wave D đang nằm ở `public DNS`, sau đó mới đến bước `Pages publish + runtime verify`
- blocker này không còn nằm ở thiếu shell build, thiếu Pages config, hay thiếu verify tooling

## 3. Ý nghĩa đúng của verify pack hiện tại

`npm run verify:planned-safe:wave:release` đã pass `32/32`.

Giải nghĩa đúng:

- pass cho `planned-safe shell + runtime-truth reference + Pages publish config + local verify pack`
- không có nghĩa là các domain Wave D đã live công khai
- nếu DNS/runtime publish chưa mở thì vẫn phải giữ `planned-safe / gated / no false-live`

## 4. Blocker đang mở

1. `work`, `market`, `community`, `ai`, `business` chưa có DNS công khai.
2. Team 1 chưa được chạy deploy thật cho Wave D khi Ops chưa xác nhận DNS mở.
3. Team 5 chưa thể phát hành live smoke/runtime verify cuối cho Wave D khi hostname chưa reachable công khai.

## 5. Việc cần làm ngay

### Team 1

1. khóa contract publish cho Wave D trong runtime truth và board điều phối
2. giữ Pages publish plan + deploy script đã khóa sẵn cho từng domain, nhưng chưa claim live
3. chỉ chạy `node scripts/deploy-wave-d-pages.mjs --branch main` sau khi Ops xác nhận DNS

### Ops

1. mở DNS công khai cho:
   - `work.vetuonglai.com`
   - `market.vetuonglai.com`
   - `community.vetuonglai.com`
   - `ai.vetuonglai.com`
   - `business.vetuonglai.com`
2. xác nhận route/runtime publish policy cho từng host

### Team 5

1. giữ verify pack hiện tại làm baseline
2. rerun `node scripts/verify-wave-d-public-publish.mjs` ngay sau khi Team 1 publish Pages thật
3. chỉ phát hành `publish_ready` sau khi hostname reachable thật

## 6. Câu chốt

Wave D hiện:

- `local_ready`: đúng
- `public_publish_ready`: chưa đúng

Nút thắt còn lại là `DNS + runtime publish`, không còn là `build + shell`.
