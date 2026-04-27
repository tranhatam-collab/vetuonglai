# READ_11 — Dev Phase Plan

## Tổng quan

Đây là phase plan đã chỉnh theo hướng an toàn pháp lý và vận hành.

Nguyên tắc:

- không public claim về phí, thuế, payout như một cam kết vĩnh viễn nếu chưa có legal/provider confirmation
- không build `read` như mô hình MMO hay hứa thu nhập
- mọi phase sau chỉ mở khi phase trước đã pass verify và pass legal-safe wording gate

Authority hiện tại:

- `docs/25_read/READ_VETUONGLAI_CREATOR_ECONOMY_MASTER_SPEC.md`
- `docs/25_read/READ_13_TEAM_DEV_EXECUTION_PLAN.md`

Nếu có xung đột với phase plan cũ, bản này được ưu tiên.

---

## Phase 0 — Free reading archive (`planned_public`)

**Owner:** Team 1 + Team 2 + Team 3
**Duration:** 1 tuần

### Scope

- free reading archive
- author profile
- submit essay free
- editorial review shell
- public pages cơ bản cho `read`

### Public pages tối thiểu

- `/`
- `/how-we-pay`
- `/transparency`
- `/creator`
- `/submit`
- `/review`
- `/stacks`
- `/terms`
- `/tax-note`

### Verify

- `npm run build` pass
- `npm run check` pass
- `node scripts/audit-bilingual.mjs` pass cho read pages
- `read.vetuonglai.com` trả `HTTP 200`
- wording đúng stage `planned_public`

### Done khi

- [ ] Cloudflare Pages project tạo
- [ ] DNS/custom domain live
- [ ] Build pipeline render `dist/read.vetuonglai.com/`
- [ ] Homepage/hub announce read domain mới
- [ ] Không có claim checkout/payout live trên public shell

---

## Phase 1 — Owner-published ebook + checkout (`member_preview`)

**Owner:** Team 1 + Team 4 + Team 5
**Duration:** 2 tuần

### Scope

- 1 owner-published ebook
- checkout
- order record
- basic ledger
- chưa mở multi-role payout

### Verify

- 1 giao dịch thật pass end-to-end
- refund flow test pass
- ledger cơ bản ghi nhận được gross, fee provider thực tế, net platform, net creator
- wording public không ghi `PayOS miễn phí vĩnh viễn`

### Done khi

- [ ] Provider credentials production configured
- [ ] 1 owner ebook live
- [ ] order record lưu đúng
- [ ] refund flow tested
- [ ] legal/provider note đủ để public checkout wording ở mức an toàn

---

## Phase 2 — Author monetization + creator onboarding (`member_preview`)

**Owner:** Team 1 + Team 4 + Team 5
**Duration:** 2 tuần

### Scope

- author monetization
- reviewer payout
- creator onboarding
- bank/KYC collection

### Verify

- 1 author ngoài owner onboarded đúng flow
- reviewer payout test pass
- KYC/bank/tax collection không lộ dữ liệu nhạy cảm trên public surface
- legal/accounting review pass cho tax decision tree trước khi auto-withholding

### Done khi

- [ ] creator onboarding live
- [ ] reviewer payout test pass
- [ ] KYC/bank collection locked
- [ ] tax handling có legal/accounting signoff

---

## Phase 3 — Multi-role split + weekly settlement (`live_candidate`)

**Owner:** Team 1 + Team 4 + Team 5
**Duration:** 3 tuần

### Scope

- translator, editor, designer split
- weekly settlement
- payout report

### Verify

- weekly settlement pass liên tiếp theo test plan
- 1 sản phẩm multi-role split đúng
- payout report khớp ledger nội bộ
- không public thông tin có thể suy luận danh tính cá nhân

### Done khi

- [ ] translator/editor/designer split working
- [ ] weekly settlement pass
- [ ] payout report generated correctly
- [ ] internal legal-safe ledger structure approved

---

## Phase 4 — Referrer + curator stacks + anonymized transparency (`live`)

**Owner:** Team 1 + Team 3 + Team 4 + Team 5
**Duration:** 3 tuần

### Scope

- referrer tracking
- curator stacks
- public anonymized transparency

### Verify

- 1 referrer chain pass
- 1 curator stack live
- transparency page chỉ hiện data ẩn danh/tổng hợp/hash
- Team 3 signoff wording + transparency boundary

### Done khi

- [ ] referrer tracking live
- [ ] curator stack live
- [ ] public transparency anonymized
- [ ] stage promoted đúng evidence

---

## Timeline gộp

| Phase | Duration | Cumulative |
|---|---|---|
| 0 — Free archive | 1 wk | T+1 |
| 1 — Owner checkout | 2 wk | T+3 |
| 2 — Creator onboarding | 2 wk | T+5 |
| 3 — Multi-role settlement | 3 wk | T+8 |
| 4 — Referrer + curator + transparency | 3 wk | T+11 |

**Total to legal-safe live:** khoảng 11 tuần từ lúc bắt đầu Phase 0.
