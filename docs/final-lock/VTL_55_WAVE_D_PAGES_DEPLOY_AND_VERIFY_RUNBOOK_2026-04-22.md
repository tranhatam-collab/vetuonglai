# VTL WAVE D — PAGES DEPLOY VÀ LIVE VERIFY RUNBOOK

Phiên bản: 1.0
Ngày: 2026-04-22
Mốc chốt: 2026-04-22 18:02 ICT
Trạng thái: ready_when_dns_opens
Owner chính: Team 1
Phối hợp: Team 5 · Ops · QA · PM
Phạm vi: `work` / `market` / `community` / `ai` / `business`

## 0. Mục đích

File này là runbook thao tác thật cho Wave D.

Mục tiêu:

- Team 1 có một lệnh deploy chuẩn cho toàn cụm Pages
- Team 5 có một lệnh live verify chuẩn sau publish
- Ops biết chính xác điều kiện phải mở trước khi Team 1 bấm deploy
- QA/PM có đường signoff rõ, không suy diễn theo cảm giác

## 1. Điều kiện bắt buộc trước khi deploy

### 1.1 DNS công khai phải mở đủ

Ops phải mở public DNS cho cả 5 host:

- `work.vetuonglai.com`
- `market.vetuonglai.com`
- `community.vetuonglai.com`
- `ai.vetuonglai.com`
- `business.vetuonglai.com`

### 1.2 Preflight resolver

Team 1 hoặc Ops chạy:

```bash
dig @1.1.1.1 +short work.vetuonglai.com
dig @1.1.1.1 +short market.vetuonglai.com
dig @1.1.1.1 +short community.vetuonglai.com
dig @1.1.1.1 +short ai.vetuonglai.com
dig @1.1.1.1 +short business.vetuonglai.com
```

Gate:

- cả 5 lệnh phải trả record công khai
- nếu còn host nào trống -> dừng, chưa deploy

### 1.3 Preflight local

Team 1 chạy:

```bash
npm run verify:planned-safe:wave:release
node scripts/deploy-wave-d-pages.mjs --dry-run
node scripts/verify-wave-d-public-publish.mjs --self-test
```

Gate:

- local release pack phải pass
- dry-run phải in đủ 5 Pages project
- self-test của live verifier phải pass

## 2. Thứ tự deploy thật

### 2.1 Lệnh chuẩn

Sau khi DNS đã mở, Team 1 chạy:

```bash
node scripts/deploy-wave-d-pages.mjs --branch main
```

Lệnh này deploy tuần tự cho:

1. `vetuonglai-work`
2. `vetuonglai-market`
3. `vetuonglai-community`
4. `vetuonglai-ai`
5. `vetuonglai-business`

### 2.2 Quy tắc trong lúc deploy

- không đổi copy public trong lúc deploy
- không đổi runtime truth giữa chừng
- nếu một project deploy fail -> dừng cả wave, không claim partial-live cho cụm Wave D

## 3. Live verify sau deploy

Ngay sau khi deploy xong, Team 5 chạy:

```bash
node scripts/verify-wave-d-public-publish.mjs
```

Gate pass khi:

- cả 5 host reachable qua HTTPS
- cả 5 host trả `200` ở root surface
- cả 5 host còn marker `planned-safe/public boundary` đúng contract

Nếu fail:

- không được đổi status board thành live
- ghi rõ host fail, lỗi fail, và giữ `dns_blocked` hoặc `publish_blocked` tùy bằng chứng thật

## 4. Dấu hiệu pass đúng

Wave D chỉ được xem là qua gate publish khi đủ cả 3 lớp:

1. DNS mở công khai
2. Pages deploy thật hoàn tất
3. Live verify của Team 5 pass

Thiếu 1 trong 3 lớp trên:

- chưa được gọi là live
- chỉ được giữ `planned-safe` hoặc `gated-only`

## 5. Dấu hiệu fail thường gặp

### 5.1 DNS chưa mở

Triệu chứng:

- `dig` không trả record
- `node scripts/verify-wave-d-public-publish.mjs` báo `getaddrinfo ENOTFOUND`

Xử lý:

- trả lane cho Ops
- không deploy thật

### 5.2 DNS có nhưng runtime chưa lên

Triệu chứng:

- host reachable nhưng không trả `200`
- hoặc marker contract bị mất

Xử lý:

- Team 1 rà Pages deploy / dist mapping
- Team 5 giữ verdict `publish_ready: false`

## 6. Rollback path

Nếu deploy thật làm Wave D sai boundary hoặc fail contract:

1. dừng claim live ngay trên board
2. chọn commit/dist xanh gần nhất của Wave D
3. rebuild từ commit xanh đó
4. chạy lại:

```bash
node scripts/deploy-wave-d-pages.mjs --branch main
```

5. Team 5 rerun live verify

Rule:

- rollback ưu tiên đưa cụm Wave D về `planned-safe` sạch
- không để trạng thái nửa sống nửa chết trên public DNS

## 7. Signoff sau mỗi lượt

### Team 1 báo

- deploy có chạy hay chưa
- deploy pass/fail ở project nào
- runtime truth có đổi hay không

### Team 5 báo

- `publish_ready: true/false`
- host nào pass/fail
- lỗi cụ thể theo từng host

### QA/PM ký nhận

- chỉ ký khi có evidence thật từ Team 1 và Team 5

## 8. Câu chốt

Wave D không thiếu lệnh deploy nữa.

Wave D chỉ còn chờ:

- DNS công khai
- deploy thật
- verify thật
