# VTL 67 — READ CREATOR ECONOMY LOCK

Phiên bản: 1.0
Ngày: 2026-04-28
Trạng thái: locked
Owner điều phối: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · Ops · Legal · Accounting · PM

## 0. Quyết định khóa

`read.vetuonglai.com` được mở như một lớp đọc, viết, dịch, biên tập, và chia sẻ tri thức trong hệ Về Tương Lai.

Domain này không được build và không được public như:

- nền tảng MMO
- hệ hứa thu nhập
- hệ claim payout chắc chắn cho mọi đối tượng
- hệ public dữ liệu tài chính cá nhân

Từ thời điểm file này được ký:

- toàn bộ lane `read` phải bám model legal-safe và operations-first
- mọi public wording về fee, tax, payout phải chịu legal/provider gate
- mọi transparency public phải là aggregate/anonymized/hash-based

## 1. Public promise được phép dùng

Cho phép dùng đúng các câu sau:

- `Ai tạo ra giá trị, người đó được ghi nhận.`
- `Mọi khoản chia doanh thu phải có công thức rõ ràng, có lịch trả rõ ràng, và có báo cáo minh bạch.`

Không được dùng trên public surface:

- `ai cũng kiếm tiền`
- `thu nhập thụ động`
- `đảm bảo được trả`
- `PayOS miễn phí vĩnh viễn`
- `platform khấu trừ đúng mọi loại thuế`

## 2. Strategic model khóa mềm

Giữ 8 role trong hệ:

- Author
- Translator
- Editor
- Reviewer
- Curator
- Referrer
- Designer
- Sponsor

Public framing đúng:

- `role-based contribution system`

Public framing sai:

- `ai cũng kiếm tiền`
- `mọi người đều có thu nhập`

## 3. Revenue split lock

### 3.1 Platform operating fee

- mục tiêu không quá `15%`
- public wording đúng: `mức phí vận hành được công bố trước mỗi giao dịch`
- nếu muốn khóa `tối đa 15%` ở mức cam kết, phải đưa vào Terms và có versioning policy

### 3.2 Creator share

- mục tiêu `70–85%` tùy sản phẩm và role
- phải được hiển thị trước khi publish và trước khi bán
- không được coi là một tỷ lệ cố định cho mọi loại sản phẩm

### 3.3 Payment provider fee

- luôn lấy theo phí thực tế của provider tại thời điểm giao dịch
- nếu provider đang `0 phí`, chỉ được hiển thị `0` như trạng thái tại thời điểm áp dụng
- không được public như một cam kết vĩnh viễn

### 3.4 Tax

- tax phải tính theo loại thu nhập, trạng thái creator, hợp đồng, loại sản phẩm, và quy định hiện hành
- legal/accounting phải xác nhận trước khi bật auto-withholding
- không được khóa cứng `5% bản quyền` cho mọi trường hợp

## 4. Transparency lock

Public transparency chỉ được mở ở dạng:

- tổng hợp theo kỳ
- ẩn danh
- hash-based reference
- quarter report không lộ danh tính

Không được public:

- tên thật
- số tài khoản
- CCCD
- mã số thuế
- số tiền cá nhân nếu có khả năng suy luận danh tính

## 5. Public pages bắt buộc

Lane `read` phải chuẩn bị các page sau:

- `/read`
- `/read/how-we-pay`
- `/read/transparency`
- `/read/creator`
- `/read/submit`
- `/read/review`
- `/read/stacks`
- `/read/terms`
- `/read/tax-note`

## 6. Dev scope khóa theo phase

### Phase 0 — `planned_public`

- free reading archive
- author profile
- submit essay free
- editorial review

### Phase 1 — `member_preview`

- 1 owner-published ebook
- checkout
- order record
- basic ledger
- chưa mở multi-role payout

### Phase 2 — `member_preview`

- author monetization
- reviewer payout
- creator onboarding
- bank/KYC collection

### Phase 3 — `live_candidate`

- translator, editor, designer split
- weekly settlement
- payout report

### Phase 4 — `live`

- referrer tracking
- curator stacks
- public anonymized transparency

## 7. Team split khóa

### Team 1

- runtime, Pages, DNS, payment lane, settlement lane
- chỉ promote stage khi đủ verify + legal/provider gate

### Team 2

- public shell, creator pages, copy, information architecture
- không false-live

### Team 3

- wording gate
- transparency boundary gate
- stop-line enforcement

### Team 4

- split model
- KYC/tax/data contract
- ledger schema và dashboard data contract

### Team 5

- verify build/runtime/payment/ledger/transparency
- issue evidence pack cho từng phase

### Ops

- Pages project
- DNS
- D1/KV/secrets/custom domain

### Legal + Accounting

- review tax treatment
- review public terms
- review provider/fee wording

## 8. Stop-line bắt buộc

Trong lúc chưa qua gate tương ứng, không được:

- public checkout như đã live cho creator community
- claim payout chắc chắn
- claim PayOS miễn phí vĩnh viễn
- claim tax withholding đúng cho mọi case
- public ledger chi tiết từng cá nhân

## 9. Source of truth docs

Các file sau là nguồn thi công chính thức:

- `docs/25_read/READ_00_INDEX_AND_AUTHORITY.md`
- `docs/25_read/READ_VETUONGLAI_CREATOR_ECONOMY_MASTER_SPEC.md`
- `docs/25_read/READ_11_DEV_PHASE_PLAN.md`
- `docs/25_read/READ_12_DEV_FILE_MANIFEST.md`
- `docs/25_read/READ_13_TEAM_DEV_EXECUTION_PLAN.md`
- `docs/25_read/READ_CREATOR_01_MASTER_SPEC.md`
- `docs/25_read/READ_CREATOR_02_REVENUE_SPLIT_AND_LEDGER_MODEL.md`
- `docs/25_read/READ_CREATOR_03_ONBOARDING_KYC_TAX_FLOW.md`
- `docs/25_read/READ_CREATOR_04_EDITORIAL_REVIEW_AND_ANTI_FRAUD_POLICY.md`
- `docs/25_read/READ_CREATOR_05_PAYMENT_CHECKOUT_AND_SETTLEMENT_SPEC.md`
- `docs/25_read/READ_CREATOR_06_PUBLIC_TRANSPARENCY_PAGE_SPEC.md`
- `docs/25_read/READ_CREATOR_07_DASHBOARD_UI_SPEC.md`
- `docs/25_read/READ_CREATOR_08_LEGAL_TERMS_AND_TAX_NOTES_DRAFT.md`

## 10. Câu chốt

Build `read.vetuonglai.com` như một hệ ghi nhận và chia doanh thu minh bạch cho đóng góp tri thức.

Không build như nền tảng MMO, không hứa thu nhập, không public số thuế hoặc phí nếu chưa có xác nhận pháp lý.
