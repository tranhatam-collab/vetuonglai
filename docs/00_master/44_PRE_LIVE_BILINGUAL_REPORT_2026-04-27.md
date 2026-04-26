# 44 — Pre-Live Bilingual Report

Generated: 2026-04-27
Reference standard: [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md)
Audit data: [`42_BILINGUAL_AUDIT_REPORT.md`](42_BILINGUAL_AUDIT_REPORT.md)
Scope: every host except `kids.vetuonglai.com` (kids team owns its own audit and pre-live report).

This is the 10-point pre-live confirmation required by section
"BÁO CÁO BẮT BUỘC TRƯỚC KHI LIVE" of the rebuild command.

## 1. Tổng số URL đã rà
- 52 HTML file in `dist/` across 14 host directories.
- 41 file đi qua build pipeline song ngữ (`data-text-vi/en`, `data-content-vi/en`, `data-html-vi/en`).
- 11 file thuộc `kids.vetuonglai.com` — dùng convention `data-vi/data-en` của team kids và được audit theo bộ rule riêng.

## 2. Tổng số page đã sửa trong wave này
- 13 host root index (hub + 12 subdomain) đều rebuild với typography song ngữ chuẩn quốc tế mới.
- 7 hub sub-page (`/bat-dau`, `/founder`, `/he-sinh-thai`, `/lien-he`, `/sitemap`, `/thanh-vien`, `/tin-tuc`, `/ve-chung-toi`) tự động hưởng cùng nâng cấp.
- 11 file kids giữ nguyên (do team kids quản trị riêng) — không thay đổi.

## 3. Tổng số lỗi tiếng Việt đã sửa
- Audit `node scripts/audit-bilingual.mjs` báo `0 issues` cho cả banned VI list (hype, slang, urgency, FOMO, outcome promise).
- Source content `content/vi.json` đã pass language-codex: 100% có dấu, không slang, không hype, không outcome promise.

## 4. Tổng số lỗi tiếng Anh đã sửa
- Audit báo `0 issues` cho banned EN list (hype superlative, urgency, clickbait, "100% guaranteed").
- MT-pattern scan (`in order to ensure`, `the layer is the layer`, `do the job that`) cũng `0 issues`.
- `content/en.json` viết theo voice "calm / precise / non-sales" của codex thay vì dịch máy.

## 5. Tổng số metadata đã chuẩn hóa
Mỗi page render qua `build.mjs` đều được cấp:
- `<title>` song ngữ qua `data-text-vi/en`.
- `<meta name="description">` song ngữ qua `data-content-vi/en`.
- `<meta property="og:title|og:description|og:type|og:url|og:locale|og:locale:alternate>`.
- `<meta name="twitter:card|twitter:title|twitter:description>`.
- `<link rel="canonical">` + `<link rel="alternate" hreflang="vi-VN|en-US|x-default">`.
- `<meta name="content-language" content="vi, en">`.
- `<meta name="robots">` (noindex áp dụng đúng nơi).

Audit code coverage: `missing-description`, `missing-canonical`, `missing-hreflang`, `missing-og-title`, `missing-og-description`, `missing-twitter-card`, `missing-html-lang`, `missing-viewport`, `schema-invalid` — tất cả trả về `0` cho 52 file.

## 6. Tổng số alt text đã chuẩn hóa
- Audit code `image-missing-alt` = 0 trên 52 file.
- Inline SVG icon dùng `aria-hidden="true"` đúng quy ước.

## 7. Tổng số CTA / form / menu / footer đã chuẩn hóa
- CTA registry: 4 CTA chuẩn (Khởi động đối thoại / Xem điểm vào / Mở toàn bộ hệ của bạn / Xem lớp liên quan) — bound qua `content/vi.json` + `content/en.json` theo `shared.cta.*`.
- Status badge: chỉ dùng đúng 4 nhãn (`Live`, `Member Preview`, `Planned`, `Bridge`) — `shared.status.*`.
- Menu chính: render qua `renderTopbar()` trong `scripts/build.mjs`, mỗi link có `data-text-vi/en`.
- Footer: `renderEcosystemBacklinks()` cấp tất cả link với `data-text-vi/en` cho tên host và `data-text-vi/en` cho subtitle.
- Form / search input: dùng `data-placeholder-vi/en` + `data-aria-label-vi/en`.

## 8. Danh sách page còn treo
Không còn page nào treo cho live wave này.
- 100% trang public của hub + 12 subdomain (trừ kids) đã render đầy đủ song ngữ.
- Kids do team riêng quản trị — không nằm trong scope wave này.

## 9. Quyết định ngôn ngữ quan trọng đã khóa
- Tiếng Việt là source-of-truth (`content/locale-registry.json` → `editorialRole: source_of_truth`).
- Tiếng Anh là `verified_translation`, không phải dịch máy.
- Không bật locale mới trước khi qua glossary review + SEO review + QA review (`futureLocalePolicy.activationMode: manual_only`).
- Banned terms VN/EN khoá trong `content/language-codex.md` (đột phá, đổi đời, kiếm tiền nhanh, tự do tài chính, transformation, breakthrough, guaranteed return, etc.).
- Status labels khoá đúng 4 nhãn — không Beta / Coming soon / Launching / Early access.
- Typography stack chuẩn quốc tế: Inter (sans body) + Plus Jakarta Sans (display) + Lora (serif headline) + JetBrains Mono — đều có Vietnamese subset, render dấu phụ chính xác.

## 10. Xác nhận cuối
- Đủ chuẩn tiếng Việt: ✅ — 100% có dấu, không slang/hype/sales pressure, đi qua `content/vi.json`.
- Đủ chuẩn tiếng Anh: ✅ — chuẩn Mỹ trung tính, không MT phrasing, đi qua `content/en.json`.
- Đủ chuẩn SEO: ✅ — title / description / canonical / hreflang / OG / twitter / schema đúng cho 52/52 file.
- Đủ chuẩn live: ✅ — `npm run check` pass, `npm run build` pass, `node scripts/audit-bilingual.mjs` pass `0 issues`.

## Wave này đã làm
1. Đẩy font stack từ system Avenir/Iowan → Inter + Plus Jakarta Sans + Lora + JetBrains Mono có Vietnamese subset.
2. Thêm preconnect + Google Fonts link vào head template `scripts/build.mjs` cho mọi host hub-like.
3. Mở `:lang(vi)` rule, `font-feature-settings`, `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased` để dấu phụ tiếng Việt rõ và không gãy chân.
4. Tăng line-height của `.headline` từ `0.96` → `1.04` và mở `text-wrap: balance` để dấu mũ / dấu sắc không cắt vào hàng trên.
5. `.metric-value` mở `font-variant-numeric: tabular-nums` để con số trong báo cáo và checklist đều cột.
6. Section title / metric value / mono đều chuyển sang token `--vt-font-serif` / `--vt-font-mono` thay vì hard-code trong CSS.
7. Giữ nguyên `kids.vetuonglai.com` — team kids tự quản trị stack riêng.

## Ghi chú cho team app + kids đồng bộ
- Kids khoá rule riêng: không viết tắt `AI`, `VC` trên public surface — chuyển thành "Trợ lý học" / "lớp xác minh độc lập". Audit script đã enforce.
- Khi sub khác cần render copy thuộc về kids (ví dụ banner cross-link), bắt buộc đi qua content source song ngữ và tránh viết tắt theo chuẩn kids.

## Lệnh tái-chạy
```
npm run build
npm run check
node scripts/audit-bilingual.mjs
```
Bất kỳ ai sửa text public phải re-run đủ 3 bước trên trước khi push.
