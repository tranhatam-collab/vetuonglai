# READ_13 — Team Dev Execution Plan

## 0. Mục tiêu

Đây là execution plan cho team dev sau khi chỉnh chiến lược theo hướng legal-safe và operations-first.

Bản này là tài liệu thi công chính cho team, cùng với:

- `READ_VETUONGLAI_CREATOR_ECONOMY_MASTER_SPEC.md`
- `READ_11_DEV_PHASE_PLAN.md`
- `READ_12_DEV_FILE_MANIFEST.md`

## 1. Guardrail bắt buộc

- không build `read` như nền tảng MMO
- không dùng wording hứa thu nhập
- không public cam kết `PayOS miễn phí vĩnh viễn`
- không public khẳng định tax withholding đúng cho mọi trường hợp khi chưa có legal/accounting confirmation
- không public ledger theo cách lộ hoặc suy luận được danh tính tài chính cá nhân

## 2. Public promise được phép dùng

Cho phép dùng:

- `Ai tạo ra giá trị, người đó được ghi nhận.`
- `Mọi khoản chia doanh thu phải có công thức rõ ràng, có lịch trả rõ ràng, và có báo cáo minh bạch.`

Không được dùng:

- `ai cũng kiếm tiền`
- `thu nhập thụ động`
- `đảm bảo được trả`
- `PayOS miễn phí vĩnh viễn`
- `platform khấu trừ đúng mọi loại thuế`

## 3. Phase hiện tại

- current phase: `0`
- current stage target: `planned_public`
- mở ngay: free archive + creator shell + submit/review shell
- chưa mở: checkout công khai, creator earning, public payout ledger chi tiết

## 4. Team split

### Team 1

- Pages/DNS/build/runtime truth
- checkout/order/ledger/settlement runtime ở các phase sau
- provider integration và env/bindings
- chỉ promote stage khi đủ verify + legal/provider gate

### Team 2

- build public shell
- build creator/submit/review/stacks/how-we-pay/transparency/terms/tax-note pages
- giữ copy đúng stage và không false-live

### Team 3

- audit wording
- stop-line gate cho claim payout/tax/provider/public transparency
- signoff trước khi public copy nhạy cảm

### Team 4

- data contracts cho split model, KYC, tax, onboarding, ledger, dashboard
- versioning cho fee/split policy

### Team 5

- verify build/runtime/payment/ledger/transparency
- phát hành evidence pack theo phase

### Ops

- Pages project
- DNS
- custom domain
- D1/KV/secrets

## 5. Backlog mở ngay

### Team 1

- add `read` vào build/check/runtime truth/pages config
- create `vetuonglai-read` Pages project
- attach `read.vetuonglai.com`
- keep stage at `planned_public`

### Team 2

- create public shell pages đúng manifest mới
- add hub announce card/banner
- add legal-safe copy blocks

### Team 3

- review all public wording trước khi publish
- lock stop-line phrases

### Team 4

- prepare split policy data
- prepare legal-safe transparency schema
- prepare creator role metadata

### Team 5

- write phase 0 verification checklist
- verify HTTP 200 + build/check + audit bilingual

## 6. Runtime and legal gates

### Provider gate

- payment fee luôn hiển thị theo provider policy tại thời điểm giao dịch
- nếu provider đang hiển thị `0`, chỉ được hiện như trạng thái tại thời điểm áp dụng

### Tax gate

- tax logic phải phụ thuộc loại thu nhập, legal entity, ngưỡng, và rule đang áp dụng
- không khóa cứng `5% royalty` cho mọi case trên public docs

### Transparency gate

- public transparency chỉ được dùng aggregate/anonymized/hash-based view
- không hiện tên, bank account, CCCD, MST, hoặc số tiền cá nhân có thể suy luận danh tính

## 7. Verify commands

Phase 0:

```bash
npm run build
npm run check
node scripts/audit-bilingual.mjs
curl -I https://read.vetuonglai.com
```

Later phases:

```bash
node scripts/verify-read-runtime-truth.mjs
node scripts/verify-read-settlement.mjs --dry-run
node scripts/verify-read-tax-withholding.mjs --quarter Q1-2026
node scripts/verify-read-ledger-consistency.mjs
```

## 8. Reporting format

- Team 1: `x% / y%`
- Team 2: `x% / y%`
- Team 3: `x% / y%`
- Team 4: `x% / y%`
- Team 5: `x% / y%`
- Current phase
- Done thật trong lượt này
- Blocker thật trong lượt này
- Legal/provider gate nào còn đang mở
- Gate kế tiếp

## 9. Kết luận thi công

Build `read.vetuonglai.com` như một hệ ghi nhận và chia doanh thu minh bạch cho đóng góp tri thức.

Không build như nền tảng MMO, không hứa thu nhập, không public số thuế hoặc phí nếu chưa có xác nhận pháp lý.
