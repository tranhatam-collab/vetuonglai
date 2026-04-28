# VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE

> **Trạng thái:** Founder approved — 2026-04-28
> **Loại file:** Master compliance lock (bổ sung, không thay thế 5 file strategy hiện có)
> **Phụ thuộc:** đọc cùng `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md`,
> `VETUONGLAI_REVENUE_FOR_MEMBERS.md`, `VETUONGLAI_INVEST_GATING_RULES.md`,
> `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`.
> **Mục đích:** khóa quy tắc disclosure cho mọi material connection
> (referral, contributor revenue share, mời bạn) theo FTC 16 CFR §255 và
> EU Platform Work Directive 2024/2831.

---

## 0. Vì sao cần file này

Hệ có:

- contributor program (xem `VETUONGLAI_REVENUE_FOR_MEMBERS.md`),
- referral một cấp (single-tier),
- revenue share theo contributor group,
- chia sẻ trên social bởi chính user / contributor.

Bất kỳ trường hợp nào trên đều là **material connection** theo FTC.
Không công bố rõ ràng = vi phạm. Vi phạm khi scale quốc tế = bị phạt,
bị ban platform, bị đóng payment provider.

---

## 1. Nguyên tắc cốt lõi

1. Hệ **không phải affiliate system**.
   - Public không dùng từ "affiliate", "affiliate program", "affiliate marketing", "MLM".
   - Public chỉ dùng:
     - **contributor program**,
     - **giới thiệu minh bạch (1 cấp)** / **transparent referral (single-tier)**,
     - **revenue share**,
     - **material connection disclosure**.
2. **Single-tier only.** Tuyệt đối không có cấp 2, không có downline,
   không có commission tree.
3. **Có lợi ích → phải nói rõ.** Không nói rõ → không được chia sẻ link.
4. **Không hứa thu nhập.** Không "passive income", "get rich",
   "đảm bảo thu nhập", "đổi đời".
5. **Không gating bằng tiền.** Tier không mua được; xem
   `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §4.

---

## 2. FTC 16 CFR §255 — Material Connection

Áp dụng khi user, contributor, hoặc bên thứ ba đề cập đến hệ và:

- nhận tiền (commission, payout, bonus),
- nhận lợi ích phi tiền tệ (free access, gói, pack),
- có quan hệ nội bộ (nhân viên, đối tác hợp tác),
- là creator / influencer được mời.

Khi áp dụng, người đó **phải** disclose connection đó **một cách rõ ràng và
dễ thấy** (clearly and conspicuously) trước/khi mời người khác hành động.

### 2.1 "Clear and conspicuous" theo FTC

- Phải **gần** điểm có lợi ích (cùng câu, cùng caption, cùng overlay).
- Phải **đọc được** trên thiết bị mà nội dung được tiêu thụ
  (mobile-first nếu post mobile).
- Phải **dùng từ thông thường**, không jargon, không viết tắt nhập nhằng.
- Không được giấu trong hashtag dài, footer, hoặc trong terms.

---

## 3. Public vocabulary (đối chiếu nội bộ ↔ public)

Hệ giữ identifier nội bộ kiểu cũ trong code/data để không phá schema, nhưng
**bắt buộc đổi sang vocab sạch khi render public**.

| Internal identifier (giữ) | Public-safe wording (bắt buộc) |
|---|---|
| `affiliate_single_tier` | "giới thiệu minh bạch (1 cấp)" / "transparent referral (single-tier)" |
| `affiliate_candidate` | "ứng viên contributor" / "contributor candidate" |
| `affiliate_active` | "verified contributor có quyền giới thiệu" / "verified contributor with referral right" |
| `affiliate_id` | "mã giới thiệu" / "referral code" |
| `revenue_share` | giữ nguyên "revenue share" / "chia sẻ doanh thu" |
| `payout` | "thanh toán cho contributor" / "contributor payout" |
| `partner_access:<tier>` | dùng tier name theo `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §2 |

Cấm public:

- "affiliate", "affiliate system", "affiliate program",
- "MLM", "multi-level", "downline", "upline", "commission tree",
- "passive income", "get rich", "đổi đời", "thu nhập đảm bảo",
- "kiếm tiền dễ dàng", "earn money fast",
- "invest now", "ROI", "expected returns".

---

## 4. Wording chuẩn cho disclosure

### 4.1 Tiếng Việt — câu mặc định

> "Liên kết này có thể mang lại lợi ích cho người giới thiệu. Bạn không trả thêm phí khi đăng ký qua liên kết này."

Câu rút gọn (cho overlay video / caption ngắn):

> "Có hoa hồng giới thiệu — không phát sinh phí cho bạn."

### 4.2 English — default

> "This link may provide a benefit to the person who shared it. You do not pay extra when you sign up through this link."

Short version:

> "Referral benefit applies — no extra cost to you."

### 4.3 Khi áp dụng

- Mọi referral link gửi qua chat / mạng xã hội / email cá nhân.
- Mọi nội dung do contributor tạo có nhắc tới hệ và có gắn link.
- Mọi banner / widget có gắn referral code.
- Mọi email mời tham gia contributor program đều phải kèm link tới
  trang public "Material connection policy" (xem §10).

---

## 5. Placement rules

Phải:

- Disclosure **gần** link, cùng câu hoặc câu liền kề.
- Disclosure **trước hoặc đồng thời** với CTA, không sau.
- Trên video: hiện text on-screen ≥ 3 giây + nhắc bằng giọng nói (nếu có voice-over).
- Trên ảnh tĩnh: phần caption đầu, không bị "see more" cắt.

Không được:

- Giấu trong footer trang.
- Giấu trong terms / privacy / FAQ.
- Đặt sau dấu "...", "more", hoặc dưới fold.
- Dùng cỡ chữ nhỏ hơn body text.
- Dùng màu trùng nền.

---

## 6. Social media rules (TikTok / YouTube / Facebook / Instagram / X / LinkedIn)

- Caption phải mở đầu hoặc kết thúc bằng disclosure.
- Hashtag không thay được disclosure (`#ad`, `#sponsored` đứng một mình **chưa đủ** — phải có câu giải thích).
- Bio link "có thể có hoa hồng" cũng không thay thế disclosure trong từng post.
- Live stream: nhắc bằng giọng nói khi giới thiệu link, không chỉ overlay.
- Story / Reel: text on-screen suốt thời gian link xuất hiện.

---

## 7. Income & invest claim rules

Cấm tuyệt đối:

- Hứa thu nhập cụ thể ("$X/tháng", "X triệu/tháng").
- Hứa thu nhập định tính nhưng vẫn ngụ ý số ("đủ sống chỉ với 1 link").
- Liệt kê thu nhập của contributor khác như evidence cho user mới.
- "Passive income", "thu nhập tự động", "đổi đời", "tự do tài chính nhanh".
- Mọi public CTA dạng "Invest now" hoặc "Đầu tư ngay".

Nếu cần đề cập income (chỉ trong khu vực **member-gated**):

- Phải có Income Disclaimer accept gate.
- Phải nêu rõ khoảng phổ biến và khả năng = $0 nếu không hoạt động.
- Phải dẫn người đọc tới `VETUONGLAI_REVENUE_FOR_MEMBERS.md` policy.

---

## 8. EU compliance — Platform Work Directive 2024/2831

Áp dụng cho mọi user EU tham gia Work pathway.

- Phải minh bạch: thuật toán matchmaking, ranking, payout calculation.
- Cấm "ranking ẩn" / "shadow downgrade".
- Cấm "fake contractor model": nếu de facto là employment, phải xử lý đúng.
- Phải có giải thích con người (human review) khi từ chối / khoá tài khoản
  contributor có ảnh hưởng tới thu nhập.

Phải có trang public hoặc member-gated nêu:

- Cách matchmaking hoạt động.
- Tiêu chí ranking (top-level, không cần lộ trọng số).
- Cơ chế khiếu nại.

---

## 9. Vietnam / Asia layer

- **Nghị định 40/2018 / sửa đổi**: chỉ cho phép single-tier referral; cấm
  cấu trúc hoa hồng nhiều tầng.
- Wording phải đề cập rõ: "không phải mô hình kinh doanh đa cấp".
- Tham chiếu mandatory statement (cũng có trong mapping lock):

  - VI: "Đây không phải mô hình kinh doanh đa cấp và không có cấu trúc hoa hồng nhiều tầng."
  - EN: "This is not a multi-level marketing model and does not involve tiered commission structures."

---

## 10. Penalty awareness

Không tuân thủ có thể dẫn đến:

- Phạt FTC (US) — civil penalty đáng kể, có thể lên đến **hàng triệu USD**
  cho diện rộng.
- Bị ban TikTok / Meta / YouTube / X — mất kênh phân phối.
- Bị payment provider freeze — Stripe / PayPal có quyền giữ payout.
- Bị nhà chức trách Việt Nam xử phạt theo nghị định đa cấp.
- Bị EU yêu cầu rút quảng cáo / fine theo DSA.

---

## 11. Dev rule

1. Mỗi link referral có flag `is_referral=true` + `referrer_id`.
2. UI render link **luôn kèm** disclosure component (`<ReferralDisclosure/>`).
3. Không có API nào trả referral link mà không kèm `disclosure_text` field.
4. Không cho user copy raw URL không có disclosure (UI phải bundle text khi share).
5. Server log: mỗi click referral lưu `referrer_id`, `clicked_at`, `disclosure_version`.
6. Audit job định kỳ: rà các trang public có chứa từ "affiliate"/"MLM"/"passive income" → flag.

---

## 12. Content rule

1. Tất cả copy public mới phải qua compliance review trước khi publish.
2. Tất cả contributor được hướng dẫn 1 trang ngắn về §4 và §5 trước khi nhận
   referral code.
3. Mọi training material cho contributor phải nêu §7 (cấm income claim).
4. Nội dung do contributor tạo (UGC) gắn link phải có disclosure; nếu vi phạm,
   contributor bị tạm khoá referral code (xem §13).

---

## 13. Audit checklist (chạy hàng quý)

- [ ] Mọi trang public không chứa từ cấm trong §3.
- [ ] Mọi referral CTA có disclosure component đứng cạnh.
- [ ] Mọi email mời contributor có link tới Material connection policy.
- [ ] Mọi video / reel mẫu nội bộ tuân thủ §6.
- [ ] Mọi nội dung member-gated có Income Disclaimer accept gate.
- [ ] Không trang public nào có "Invest now" hoặc số ROI.
- [ ] Anti-MLM statement (§9) xuất hiện trên các trang nói về referral / contributor.
- [ ] Log audit có evidence (screenshot, build hash, timestamp).

---

## 14. Definition of Done

File này được coi là "đã áp dụng" khi:

- [ ] Vocabulary public đã sạch (không còn "affiliate" rò rỉ ra UI).
- [ ] Component `<ReferralDisclosure/>` tồn tại và bắt buộc đi kèm referral link.
- [ ] Trang `/legal/material-connection` (VI + EN) đã publish.
- [ ] Contributor onboarding bắt buộc đọc & xác nhận §4–§7.
- [ ] Audit checklist §13 chạy lần đầu, kết quả lưu lại.
- [ ] Tất cả 5 file strategy cũ được đối chiếu lại với §3 mapping vocab.

---

## 15. Câu chốt

> Có lợi ích — phải nói rõ.
> Không nói rõ — không được dùng.
> Tier không mua được. Đầu tư không mời gọi public.
> Referral chỉ một cấp. Disclosure luôn đi cùng link.
