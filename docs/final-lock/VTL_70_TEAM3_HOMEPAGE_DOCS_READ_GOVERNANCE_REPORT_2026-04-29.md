# VTL 70 — Team 3 Homepage / Docs / Read Governance Report

Phiên bản: 1.0  
Ngày: 2026-04-29  
Trạng thái: active_now  
Owner: Team 3 (Governance / Trust / Legal)

## Team 3 Checklist Update

### 1) Lock wording vào language-codex (forbidden terms + FTC rule)
Verdict: `DONE`

Đã khóa trực tiếp trong codex:
- thêm nhóm term cấm cho FTC/Invest gate (`invest now`, `ROI`, `expected returns`, `MLM`, `downline`, `commission tree`, `passive income`, ...)
- thêm rule bắt buộc disclosure đặt gần CTA/link (không được thay bằng footer)
- thêm anti-MLM mandatory statement VI/EN
- thêm Quarterly FTC Audit Checklist (v1)
- thêm rule chặn claim `Live` khi chưa đủ `deploy evidence + domain active + QA pass`

Evidence:
- `content/language-codex.md`

### 2) Signoff nội dung 12 docs pages (public content scope)
Verdict: `IN PROGRESS / HOLD`

Kết quả audit source:
- file chiến lược `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` đang mô tả 13 route trong cây docs (bao gồm `/`)
- source docs hiện tại có 9 route HTML
- chưa đạt điều kiện để Team 3 ký signoff full cho lane "12 docs pages public content scope"

Evidence:
- `docs/00_master/VETUONGLAI_DOCS_PUBLIC_CONTENT.md`
- `src/static-pages/docs.vetuonglai.com/index.html`
- `src/static-pages/docs.vetuonglai.com/getting-started/index.html`
- `src/static-pages/docs.vetuonglai.com/api-reference/index.html`
- `src/static-pages/docs.vetuonglai.com/trust-system/index.html`
- `src/static-pages/docs.vetuonglai.com/pricing/index.html`
- `src/static-pages/docs.vetuonglai.com/changelog/index.html`
- `src/static-pages/docs.vetuonglai.com/support/index.html`
- `src/static-pages/docs.vetuonglai.com/legal/index.html`
- `src/static-pages/docs.vetuonglai.com/legal/material-connection/index.html`

### 3) Invest gate wording (không ROI claim, không "invest now")
Verdict: `DONE`

Audit trên `src/static-pages/*`:
- không phát hiện public CTA kiểu "invest now" hoặc "ROI"
- mọi chỗ có nhắc tới income/invest wording trong docs legal là ngữ cảnh "bị cấm", không phải CTA kêu gọi đầu tư

Evidence:
- `src/static-pages/docs.vetuonglai.com/legal/material-connection/index.html`
- `src/data/product-strategy-registry.json`

### 4) Disclosure wording chuẩn cho referral
Verdict: `DONE`

Đã xác nhận:
- disclosure wording VI/EN chuẩn có mặt trong component public
- disclosure đặt ở phần đầu nội dung legal page, không bị giấu dưới footer
- anti-MLM statement hiện diện cùng policy

Evidence:
- `src/static-pages/docs.vetuonglai.com/legal/material-connection/index.html`
- `docs/00_master/VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md`

### 5) Quarterly FTC audit checklist (v1)
Verdict: `DONE`

Đã khóa checklist v1 tại:
- `content/language-codex.md` (section `Quarterly FTC Audit Checklist (v1)`)
- `docs/00_master/VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` (§13)

## Wave Gate Reminder (Team 3 lock)

- Wave C: `HARDENING PASS / PROMOTION NO-GO`
- Wave D: chỉ được gọi publish/live khi có đủ deploy evidence + domain active + QA pass
- Wave E: `SIGNOFF NO-GO` nếu Wave D chưa có live evidence thật

## Required Report Format (Team 3)

Done:  
- Lock wording mới vào `content/language-codex.md` (forbidden terms + FTC/disclosure/invest gate rules).  
- Xác nhận invest gate wording không có ROI claim / "invest now" trong public static pages.  
- Xác nhận referral disclosure wording + anti-MLM statement trên docs legal material-connection page.  
- Khóa quarterly FTC audit checklist v1.

In progress:  
- Signoff full lane "12 docs pages public content scope" (đang hold để chờ Team 2 publish đủ pages theo checklist mới).

Blocked:  
- Mismatch giữa target docs scope và source docs routes hiện tại; chưa đủ evidence để ký full signoff.

Owner needed:  
- Team 2: publish đủ docs pages theo lane mới (VI/EN, không leak income wording).  
- Team 5: chạy QA evidence pack cho docs/read sau deploy.  
- Ops/Team 1: cung cấp deploy evidence + domain active để mở publish claim.

Evidence link:  
- `content/language-codex.md`  
- `docs/00_master/VETUONGLAI_DOCS_PUBLIC_CONTENT.md`  
- `src/static-pages/docs.vetuonglai.com/legal/material-connection/index.html`  
- `docs/00_master/VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md`

ETA:  
- Team 3 re-signoff trong vòng 2 giờ sau khi Team 2 cập nhật đủ docs pages và Team 5 gửi QA evidence.
