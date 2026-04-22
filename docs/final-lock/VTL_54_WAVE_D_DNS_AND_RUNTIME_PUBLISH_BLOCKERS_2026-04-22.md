# VTL WAVE D — DNS VÀ RUNTIME PUBLISH BLOCKERS

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 10:36 ICT
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

Đã kiểm bằng resolver công khai và HTTP probe trực tiếp từ shell.

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

## 2. Kết luận vận hành

Tại thời điểm chốt file:

- `work` / `market` / `community` / `ai` / `business` chưa có DNS công khai để Team 5 probe runtime live
- blocker publish của Wave D đang nằm ở `DNS + route/runtime publish`
- blocker này không còn nằm ở thiếu shell build

## 3. Ý nghĩa đúng của verify pack hiện tại

`npm run verify:planned-safe:wave:release` đã pass `32/32`.

Giải nghĩa đúng:

- pass cho `planned-safe shell + runtime-truth reference + Pages publish config + local verify pack`
- không có nghĩa là các domain Wave D đã live công khai
- nếu DNS/runtime publish chưa mở thì vẫn phải giữ `planned-safe / gated / no false-live`

## 4. Blocker đang mở

1. `work`, `market`, `community`, `ai`, `business` chưa có DNS công khai.
2. `cloudflare/pages-projects.json` hiện đã được khóa cho `work` / `market` / `community` / `ai` / `business`, nhưng chưa thể dùng để publish thật khi DNS chưa mở.
3. Team 5 chưa thể phát hành live smoke/runtime verify cuối cho Wave D khi hostname chưa reachable công khai.

## 5. Việc cần làm ngay

### Team 1

1. khóa contract publish cho Wave D trong runtime truth và board điều phối
2. giữ Pages publish plan đã khóa sẵn cho từng domain, nhưng chưa claim live
3. chỉ chạy `deploy-pages` sau khi Ops xác nhận DNS

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
2. rerun live smoke/runtime verify ngay khi DNS mở
3. chỉ phát hành `publish_ready` sau khi hostname reachable thật

## 6. Câu chốt

Wave D hiện:

- `local_ready`: đúng
- `public_publish_ready`: chưa đúng

Nút thắt còn lại là `DNS + runtime publish`, không còn là `build + shell`.
