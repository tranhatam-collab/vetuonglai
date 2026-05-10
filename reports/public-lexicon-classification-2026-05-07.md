# Public Lexicon 42 hits — Phân loại + Fix proposal

**Founder review request — 2026-05-07 by Team 1**
**Verifier:** `scripts/verify-public-lexicon.mjs`
**Source report:** `reports/public-lexicon.latest.json`

---

## Tóm tắt

42 hits chia thành 4 nhóm hành vi rõ ràng:

| Class | Count | Bản chất | Fix |
|---|---|---|---|
| **A — Negation context (đúng chuẩn VTL_75)** | 25 | Câu phủ định/cảnh báo/giáo dục: "không hứa kiếm tiền nhanh", "không phải MLM", "no expected return figures". Đây chính là microcopy mà §1.1 VTL_75 KHUYẾN KHÍCH dùng để demonstrate compliance. Verifier hiện không phân biệt. | **Mở rộng escape hatch:** thêm `<!-- VTL-LEXICON-ALLOW: negation -->` marker quanh block, hoặc dạy verifier nhận diện 6 từ phủ định VI/EN trước trong khoảng 40 ký tự (`không`, `no`, `not`, `chưa`, `cấm`, `ngoại trừ`). Khuyến nghị: làm verifier thông minh hơn (option 2). |
| **B — Forbidden term thật, phải xóa/đổi** | 5 | Term xuất hiện như label/feature/CTA, không có phủ định | Sửa source HTML / data file ngay. |
| **C — Hạ tầng vận hành `iai.one` được link/embed** | 11 | `nft.iai.one`, `trust.iai.one` — đây là 2 dịch vụ infrastructure đang chạy. VTL_75 §1.2 cấm `iai.one` chỉ với nghĩa "đẩy traffic ra brand iai". Reference kỹ thuật trong code/footer là khác. | Cần Founder ra phán quyết riêng (xem §C dưới). |
| **D — Manual review (đã đánh dấu trong verifier)** | 1 | `marketplace` ở market.vetuonglai.com (negation context: "not presented as an already operating marketplace") | Verifier đã set `manual_review:true` → không fail; báo cáo cho human đọc. OK giữ nguyên. |

**Total:** A=25 + B=5 + C=11 + D=1 = **42 ✓**

---

## A — Negation context (25 hits) — đề xuất "verifier-aware fix"

| File | Term | Snippet (rút gọn) |
|---|---|---|
| dist/vetuonglai.com/index.html | kiếm tiền (×2) | "không hứa kiếm tiền nhanh" / "no make-money-fast promise" |
| dist/finance.vetuonglai.com/index.html | làm giàu (×3) | "fin không dạy làm giàu nhanh", "không dùng các cụm như 'làm giàu nhanh'" |
| dist/finance.vetuonglai.com/index.html | get rich | "'get rich quick' are not used on this public surface" |
| dist/invest.vetuonglai.com/index.html | Invest now | "invest now clearly publishes a risk-first..." (đây là tagline 'Future INVEST', cần xem riêng) |
| dist/docs.vetuonglai.com/membership/index.html | MLM, multi-level | "không cam kết thu nhập, không MLM" / "no multi-level" |
| dist/docs.vetuonglai.com/faq/index.html | kiếm tiền (×3) | "không phải nền tảng kiếm tiền nhanh" (×2) + "trẻ em có thể kiếm tiền không?" + "không kiếm tiền" |
| dist/docs.vetuonglai.com/kids/index.html | kiếm tiền (×2) | "không kiếm tiền, không hồ sơ công khai" |
| dist/docs.vetuonglai.com/legal/material-connection/index.html | kiếm tiền, thu nhập thụ động, passive income, đổi đời, guaranteed income, MLM, multi-level, downline (×8) | Toàn bộ là enum trong câu "không được dùng các từ ngữ kiểu..." — đây là disclosure pháp lý liệt kê term cấm |
| dist/docs.vetuonglai.com/invest/index.html | Invest now, Đầu tư ngay (×2 mỗi cái = 4) | "không có lời kêu gọi 'đầu tư ngay' / 'invest now' ở bất kỳ đâu" |
| dist/docs.vetuonglai.com/invest/index.html | expected return (×2), lợi nhuận kỳ vọng (×2) | "no expected return figures", "không có lợi nhuận kỳ vọng hay cam kết" |
| dist/ai.vetuonglai.com/index.html | kiếm tiền (×2) | "không dùng nội dung kiểu... kiếm tiền ngay..." |

→ **Đề xuất: refactor verifier với negation-aware logic.** Hit chỉ failed nếu trong khoảng 50 ký tự trước term, KHÔNG có 1 trong các từ phủ định: `không`, `no`, `not`, `cấm`, `chưa`, `prohibited`, `forbidden`, `never`, `tránh`, `avoid`, `không được`, `loại bỏ`, `đừng`. Logic này đơn giản, dễ verify, false-negative-rate thấp vì các forbidden term hầu như chỉ xuất hiện một cách rủi ro nếu KHÔNG có phủ định.

→ Alternative: dùng escape hatch `<!-- VTL-LEXICON-ALLOW -->`. Nhược điểm: phải comment 25 chỗ + dễ bị abuse trong tương lai.

→ **Khuyến nghị 1: negation-aware verifier (clean, scalable).** Khuyến nghị 2: kết hợp — negation-aware làm mặc định + ALLOW marker cho edge cases.

---

## B — Forbidden term thật phải xoá / đổi (5 hits)

| # | File | Term | Context | Fix proposal |
|---|---|---|---|---|
| B1 | dist/vetuonglai.com/index.html (homepage) | `affiliate` (×3) | "creator pro $9/tháng - đầy đủ tools" / "affiliate single-tier (1 cấp)" / "earning sau khi đủ điều kiện" — đây là feature label trong section quyền lợi gói | **Xoá block** "affiliate single-tier" khỏi homepage hub V1; thay bằng từ "giới thiệu minh bạch" theo VTL_75 §1.4 (single-tier referral phải gọi "giới thiệu" không bao giờ "affiliate"). VI page cũng cần đổi label tương tự. |
| B2 | dist/member.vetuonglai.com/index.html | `affiliate` (×4) | h2 "điều kiện mở affiliate" + "affiliate ở gói năm cơ bản" — nguyên section dùng từ affiliate | Thay toàn section: `affiliate` → `Giới thiệu (1 cấp)` / `Single-tier referral`. Section title `điều kiện mở affiliate` → `điều kiện mở giới thiệu`. |
| B3 | dist/finance.vetuonglai.com/index.html | `làm giàu` (×1 — non-negation) | "fin không dạy **làm giàu nhanh** ..." — phân tích kỹ hơn: thực ra đây IS negation, count đúng = 0. Nhưng còn 1 hit "trên public surface này" cũng negation. | Re-check: theo grep cả 3 hit của `làm giàu` đều có "không" trước → A. Loại khỏi B. |
| B4 | dist/market.vetuonglai.com/index.html | `marketplace` | "not presented as an already operating marketplace" — D (manual_review đã set), không fail | Loại khỏi B. |
| B5 | dist/invest.vetuonglai.com/index.html | `Invest now` | "invest now clearly publishes..." — đây là EN tagline của brand 'Future INVEST'. Wording sai chuẩn VTL_75: brand không được dùng "invest now" làm tagline. | Đổi tagline EN: thay "Invest now clearly publishes..." → "Future INVEST clearly publishes..." hoặc "Our invest layer clearly publishes...". |

**Sau khi loại B3+B4 (chuyển về A/D), B thực tế = 7 hits ở 3 file** (homepage `affiliate ×3`, member `affiliate ×4` — là 4 do verifier dedup theo line, member.vetuonglai.com có 1 hit ở report, B2 fix vẫn cần làm vì cùng nguồn data; invest tagline ×1).

---

## C — `iai.one` infrastructure (11 hits) — cần Founder phán quyết

| File | Hit context |
|---|---|
| dist/vetuonglai.com/index.html | Body card mô tả: "cầu nối tới **nft.iai.one** để mirror các bản ghi tài sản mã hoá sang VC độc lập của Về Tương Lai" — homepage có data card mô tả relationship VC↔nft.iai.one |
| dist/vetuonglai.com/lien-he/index.html | inline JSON `mail_endpoint = "https://mail.iai.one/..."` (form contact) |
| dist/vetuonglai.com/he-sinh-thai/index.html | section card same as homepage |
| dist/vc.vetuonglai.com/index.html (×2) | JS const: `nftRegistryUrl = "https://nft.iai.one/api/asset-registrations"`, fallback domain label `"nft.iai.one"` |
| dist/vc.vetuonglai.com/v/index.html (×2) | same JS const |
| dist/docs.vetuonglai.com/work/index.html | "→ trust.iai.one ghi chứng nhận (nếu đủ điều kiện)" — đây là explainer giải thích pipeline kỹ thuật |
| dist/docs.vetuonglai.com/verification/index.html (×3) | Title page "trust.iai.one Verification System" + body |
| dist/docs.vetuonglai.com/trust-system/index.html | Title page "trust.iai.one Verification System" |
| dist/docs.vetuonglai.com/support/index.html, products, pricing, legal, getting-started, faq, changelog, api-reference | Hit ở line 1 — nhiều khả năng do nav/footer global include link tới trust.iai.one (cần grep source) |

**Câu hỏi thực tế:** VTL_75 §1.2 cấm `iai.one` để (a) tránh đẩy traffic public ra ngoài hệ Về Tương Lai, (b) tránh confusion về brand. Nhưng `nft.iai.one` + `trust.iai.one` đang là **infrastructure đang chạy, đã có production data, có VC ledger phụ thuộc** (xem worker `vc.vetuonglai.com` runtime).

3 hướng có thể:

- **C1 (cấm tuyệt đối):** Migrate toàn bộ `nft.iai.one` → `vc.vetuonglai.com/api/...`, `trust.iai.one` → `verify.vetuonglai.com` hoặc `docs.vetuonglai.com/trust/`. Đây là infra refactor, ngoài scope verifier task này, ước tính 1-2 tuần engineering.
- **C2 (cấm CTA, cho phép infra reference):** Verifier bỏ `iai.one` khỏi forbidden HARD list, đưa vào `manual_review` list. Cấm CTA/link **anchor text** chứa "iai.one" thì dùng rule riêng (ví dụ: `<a href="*iai.one*">` chỉ được phép nếu kèm rel="noopener" + technical attribute marker `data-vtl-infra="true"`).
- **C3 (allowlist file):** Founder ký file `docs/final-lock/VTL_75_INFRA_IAI_ONE_ALLOWLIST_2026-05-07.md` listing 9 file paths được phép reference iai.one cho mục đích infrastructure, expiry **2026-09-30** (deadline cho C1 migration).

**Khuyến nghị: C3** — đáp ứng yêu cầu "không allowlist rộng" của Founder (cụ thể path, có expiry, có owner, có lý do), và mở đường cho C1 migration một cách chủ động.

---

## D — Manual review đã ghi nhận, không cần action (1 hit)

`marketplace` ở `dist/market.vetuonglai.com/index.html` — verifier đã set `manual_review:true`, không fail build. Giữ nguyên.

---

## Recommendation tổng

1. **A (25 hits):** Refactor verifier sang negation-aware logic (option 2 trong khuyến nghị A) — code change ~30 dòng trong `findHits()`.
2. **B (5 hits, sau loại B3/B4):** Sửa source HTML/data — homepage hub bỏ block "affiliate single-tier", member.* đổi label, invest.* đổi tagline EN.
3. **C (11 hits):** Founder ký allowlist file `VTL_75_INFRA_IAI_ONE_ALLOWLIST_2026-05-07.md` với expiry 2026-09-30 + danh sách 9 file path. Verifier đọc allowlist file này.
4. **D (1 hit):** Giữ nguyên.

**Sau khi 3 hành động trên xong, verifier `verify-public-lexicon` sẽ PASS hard mode.**

---

## Câu hỏi chờ Founder

1. Approve negation-aware refactor cho verifier? (yes/no/đề xuất khác)
2. Approve fix B-list bằng cách đổi từ `affiliate` → `giới thiệu (1 cấp)` toàn site? (yes/no)
3. Approve C3 allowlist với expiry 2026-09-30, owner Team 1? Hay chọn C1 (migration ngay) hoặc C2 (rule khác)?
