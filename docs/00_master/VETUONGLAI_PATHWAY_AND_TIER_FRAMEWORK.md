# VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK

> **Trạng thái:** Founder approved — 2026-04-28
> **Loại file:** Master strategy lock (bổ sung, không thay thế 5 file strategy hiện có)
> **Phụ thuộc:** đọc cùng `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md`,
> `VETUONGLAI_PRODUCT_STRATEGY.md`, `VETUONGLAI_REVENUE_FOR_MEMBERS.md`,
> `VETUONGLAI_INVEST_GATING_RULES.md`,
> `VETUONGLAI_DOCS_PUBLIC_CONTENT.md`, `VETUONGLAI_HOMEPAGE_CONTENT.md`,
> `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md`.
> **Mục đích:** khóa cấu trúc 2 trục (Pathway × Tier) để team product, dev,
> content, legal dùng chung một ngôn ngữ; không chồng logic với 5 file cũ.

---

## 0. Vì sao cần file này

5 file strategy đã có:

- danh mục sản phẩm (3 master pass × 9 nhóm),
- 7 nhóm contributors + 8 kênh doanh thu,
- gating đầu tư,
- copy public cho docs và homepage.

Nhưng thiếu **một khung trục dọc/ngang** để:

- product team biết user đang **làm gì** (pathway) và **ở mức nào** (tier),
- dev team biết khi nào unlock cái gì,
- content team viết đúng wording cho từng pathway × tier,
- legal team biết đâu là điểm phải gắn disclosure / disclaimer / gate.

Nguyên tắc:

- **Pathway = chiều ngang** = loại hoạt động.
- **Tier = chiều dọc** = mức trưởng thành.
- Hai trục **độc lập**. Không trộn.

---

## 1. 6 Pathways (chiều ngang)

Mỗi user có thể tham gia nhiều pathway song song. Pathway là **bộ trải nghiệm**, không phải gói sản phẩm.

### 1.1 Learn — Học có cấu trúc

- Hiểu để làm được, không phải học để xem.
- Đầu vào: nội dung học, tracker tiến độ, pathway gợi ý.
- Đầu ra: kiến thức kiểm chứng được + sẵn sàng tạo output.
- Domain: `member.vetuonglai.com/app/learn/` (V1), `learn.vetuonglai.com` (V2).
- Liên quan tier: Free → Learner → Builder.

### 1.2 Read — Đọc tri thức dài hạn

- Tiếp cận tài liệu, bài viết, briefing.
- Đầu vào: bài đọc, tổng hợp, archive.
- Đầu ra: kiến thức nền, bối cảnh, văn hoá hệ.
- Domain: `read.vetuonglai.com`.
- Liên quan tier: Free → Learner.
- Đặc thù: pathway "nhẹ" nhất, có thể là điểm đầu vào của user.

### 1.3 Work — Tham gia công việc thật

- Nhận task, micro-task, project có scope rõ.
- Đầu vào: brief, contract, deliverable.
- Đầu ra: sản phẩm bàn giao + payout (nếu đủ điều kiện).
- Domain: `work.vetuonglai.com`.
- Liên quan tier: Verified Contributor → Paid Collaborator → Project Lead.
- Đặc thù: pathway **chỉ mở** sau khi có proof.

### 1.4 Build — Tạo sản phẩm / output

- Làm bài tập kết, demo, mini-product, packet, content, code.
- Đầu vào: prompt, brief tự chọn, hoặc dự án mở.
- Đầu ra: output có thể submit để xác minh.
- Domain: `member.vetuonglai.com/app/build/` + nguồn gửi tới `vc.vetuonglai.com`.
- Liên quan tier: Builder → Verified Contributor.

### 1.5 Verify — Xác minh giá trị

- Submit output, nhận đánh giá / phản biện / chứng nhận.
- Đầu vào: hồ sơ submit, evidence, peer review.
- Đầu ra: trạng thái đã xác minh, credential, proof record.
- Domain: `vc.vetuonglai.com` + dashboard tại `member.vetuonglai.com/app/verify/`.
- Liên quan tier: Builder → Verified Contributor.

### 1.6 Belong — Thuộc về cộng đồng

- Tham gia community, chia sẻ, mentor, co-host.
- Đầu vào: discussion, circle, event, story.
- Đầu ra: quan hệ tin cậy, mentor pipeline, dẫn dắt nhóm.
- Domain: `community.vetuonglai.com` + circle in `member.*`.
- Liên quan tier: Free → Verified Contributor → Project Lead.

---

## 2. 7 Tiers (chiều dọc)

Tier là mức trưởng thành **của con người**, không phải gói trả tiền.
Tier không thể mua. Tier không thể skip.

### Tier 1 — Free
- Vừa đăng ký, đang khám phá hệ.
- Quyền: đọc public, dùng read pathway, dùng phần preview của các pathway khác.
- Không có earning, không có project, không có invest.

### Tier 2 — Learner
- Đã chọn pathway học, đã hoàn thành ít nhất một module nhập môn có ghi nhận.
- Quyền: tracker tiến độ, học theo pathway, gợi ý bài đọc/bài làm.
- Không có earning.

### Tier 3 — Builder
- Đã tạo output có thể submit (bài tập, packet, demo, content).
- Quyền: build pathway full, gửi sang verify, tham gia pre-contributor circle.
- Có thể nhận microtask **chỉ ở dạng training**, không có thanh toán thật.

### Tier 4 — Verified Contributor
- Đã có ít nhất một proof được verify, qua thời gian quan sát tối thiểu 90 ngày
  (theo `VETUONGLAI_INVEST_GATING_RULES.md`).
- Quyền: nhận task có thanh toán **với điều kiện** (xem section 3),
  được liệt kê trong contributor directory, đủ điều kiện single-tier referral.
- **Đây là điểm thấp nhất earning có thể được mở.**

### Tier 5 — Paid Collaborator
- Đã hoàn thành ≥1 task có thanh toán đạt chuẩn.
- Quyền: nhận task định kỳ, được mời vào project có scope.
- Bắt đầu xuất hiện trong matchmaking với client.

### Tier 6 — Project Lead
- Đã dẫn ≥1 project có team ≥2 thành viên, kết thúc đúng cam kết.
- Quyền: lập team mới, quản lý milestone, chia revenue cho team theo policy.
- Phải tuân thủ FTC disclosure và contributor program rules.

### Tier 7 — Investor-ready
- Đủ điều kiện tiếp cận **education-only** invest pathway theo
  `VETUONGLAI_INVEST_GATING_RULES.md` (90-day, KYC, accredited check, etc.).
- Quyền **không phải là quyền đầu tư mặc định**, mà là quyền được mời tham
  gia phiên thẩm định, học sâu, hoặc phiên gated.
- Mọi cơ hội đầu tư cụ thể vẫn phải qua quy trình riêng (Reg D 506(c) hoặc
  tương đương theo jurisdiction).

---

## 3. Cross-mapping Pathway × Tier

Đây là phần **quan trọng nhất**. Đọc theo cột: pathway nào được mở ở tier nào.

| Pathway | Tier 1 Free | Tier 2 Learner | Tier 3 Builder | Tier 4 Verified | Tier 5 Paid | Tier 6 Lead | Tier 7 Investor-ready |
|---|---|---|---|---|---|---|---|
| Learn  | preview | full | full | full | full | full | full |
| Read   | full | full | full | full | full | full | full |
| Build  | preview | guided | full | full | full | full | full |
| Verify | — | preview | full submit | full | full | full | full |
| Work   | — | — | training only | paid task (gated) | paid task | lead project | lead project |
| Belong | view | join circles | join + post | mentor pipeline | mentor | facilitator | facilitator |

Quy ước:

- `—` = không có quyền truy cập.
- `preview` = xem mẫu, không tạo dữ liệu.
- `training only` = không có thanh toán thật.
- `gated` = thêm điều kiện ngoài tier (KYC, 90-day, jurisdiction…).

---

## 4. Rule cứng (không được vi phạm)

1. **Không mở earning trước Tier 4.**
   Tier 1–3 không có UI thanh toán, không có affiliate link, không có payout.
2. **Không mở project leadership trước Tier 5.**
3. **Không mở invest pathway trước Tier 7**, và Tier 7 cũng không tự động
   = quyền đầu tư.
4. **Không cho skip tier.** Mỗi tier có evidence requirement riêng.
5. **Không cho mua tier.** Tier là kết quả của hành động, không phải gói.
6. **Trẻ em không được rời Tier 1–2** trừ khi có khung kids riêng (xem
   `VETUONGLAI_PRODUCT_STRATEGY.md` §2.2). Trẻ em không có Tier 4+.

---

## 5. Đối chiếu cũ → mới (mapping bắt buộc cho dev/content)

5 file strategy hiện đang dùng tên tier kiểu cũ
(Free → Explorer → Learner → Builder → Contributor → Partner).
Tier framework mới là 7 nấc. Map theo **chức năng**, không phải theo thứ tự:

| Tier cũ (6 nấc) | Tier mới (7 nấc) | Ghi chú |
|---|---|---|
| Free | Tier 1 — Free | giữ nguyên |
| Explorer | gộp vào Tier 1 — Free | "Explorer" không còn là tier riêng; coi là trạng thái onboarding của Tier 1 |
| Learner | Tier 2 — Learner | giữ nguyên ý nghĩa |
| Builder | Tier 3 — Builder | giữ nguyên ý nghĩa |
| Contributor | Tier 4 — Verified Contributor | đổi tên rõ hơn, kèm điều kiện proof + 90 ngày |
| Partner (cấp dưới) | Tier 5 — Paid Collaborator | "Partner Free / Creator Free" cũ thuộc về Tier 4–5 |
| Partner (cấp giữa) | Tier 6 — Project Lead | "Partner" có dẫn dắt project |
| Partner (cấp cao, invite-only) | Tier 7 — Investor-ready | "Partner" mức cao nhất, cộng điều kiện invest |

Quy ước cập nhật content public:

- Khi 5 file cũ ghi "Contributor" với nghĩa người đã có proof → đọc là
  **Verified Contributor**.
- Khi 5 file cũ ghi "Partner" → tách theo ngữ cảnh thành **Paid Collaborator**,
  **Project Lead**, hoặc **Investor-ready**.
- Trên public copy (homepage, docs), không bắt buộc hiển thị đầy đủ 7 tier;
  có thể nhóm thành 3 cụm để dễ hiểu (xem section 7).

---

## 6. UX / Onboarding logic

Khi user đăng ký xong:

1. Hỏi ngắn: bạn muốn bắt đầu từ pathway nào? (Learn / Read / Build / Verify / Work / Belong).
   - Có thể chọn nhiều, nhưng **một** sẽ là pathway chính.
2. Hệ tự gán **Tier 1 — Free**.
3. Dashboard hiển thị:
   - Pathway hiện tại + bước tiếp theo.
   - Tier hiện tại + điều kiện lên tier kế.
   - Không hiển thị earning UI nếu < Tier 4.

Quy tắc UI:

- Không bao giờ hiển thị "Earn now" / "Upgrade to earn" cho Tier 1–3.
- Không hiển thị invest CTA cho Tier 1–6.
- Không hiển thị ranking công khai dạng leaderboard cho Belong pathway.

---

## 7. Public-safe presentation (cho homepage / docs)

Public copy nên gom 7 tier thành 3 cụm để dễ đọc, **mà vẫn không sai**:

- **Khám phá** — Tier 1–2 (Free, Learner).
  Wording: "Bắt đầu học và làm quen hệ."
- **Tạo giá trị** — Tier 3–4 (Builder, Verified Contributor).
  Wording: "Tạo output thật, được xác minh."
- **Cộng tác sâu** — Tier 5–7 (Paid Collaborator, Project Lead, Investor-ready).
  Wording: "Cộng tác có cam kết, có thể nhận thù lao và tiếp cận cơ hội sâu hơn theo điều kiện."

Public copy **không được**:

- liệt kê con số thu nhập,
- gắn CTA "Earn" / "Invest" trên homepage,
- gọi tier là "package" hoặc "level mua được".

---

## 8. Dev implication (data model gợi ý)

```
user
├─ id
├─ tier_current        # 1..7
├─ tier_history[]      # log mỗi lần thay đổi
├─ pathway_primary     # learn | read | work | build | verify | belong
├─ pathway_active[]    # subset of 6
├─ proof_records[]     # link tới vc.* và verify pipeline
├─ contributor_state   # none | candidate | verified | paid | lead
├─ invest_eligibility  # closed | gated_education | accredited_check
└─ flags               # kids, business, jurisdiction, kyc...
```

Quy tắc bắt buộc:

- Mọi tăng tier phải đi qua **một sự kiện kiểm chứng**, không thể set trực tiếp.
- Mọi giảm tier (khi vi phạm) phải lưu reason + evidence.
- `invest_eligibility` không tự động thành `accredited_check`; cần quy trình riêng.

---

## 9. Internal vocabulary (đối chiếu nhanh với mapping lock)

- **Pathway** — public-safe, dùng được cả trên homepage / docs.
- **Tier** — public-safe, nhưng nên trình bày theo cụm 3 cluster (section 7).
- **Verified Contributor** — public-safe.
- **Paid Collaborator / Project Lead / Investor-ready** — dùng được public,
  miễn không gắn số tiền.
- **Affiliate / multi-tier / commission tree / downline / passive income / get rich** —
  CẤM dùng public, kể cả trong UI tooltip.
- Internal identifier `affiliate_single_tier` được giữ trong code/data nhưng
  KHÔNG render ra UI public. Xem
  `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` §3.

---

## 10. Definition of Done

Framework này được coi là "đã áp dụng" khi:

- [ ] User onboarding hỏi pathway chính ngay sau đăng ký.
- [ ] Dashboard hiển thị pathway + tier + bước tiếp theo.
- [ ] UI ẩn hoàn toàn earning ở Tier 1–3.
- [ ] UI ẩn hoàn toàn invest ở Tier 1–6.
- [ ] Public copy không nhắc số thu nhập.
- [ ] Mọi referral link tuân thủ FTC disclosure (xem file FTC).
- [ ] Mọi tăng/giảm tier có log + evidence.
- [ ] 5 file strategy cũ được đọc qua lăng kính bảng đối chiếu §5.

---

## 11. Câu chốt

> Pathway cho biết bạn đang làm gì.
> Tier cho biết bạn đang ở đâu trên hành trình đó.
> Hai trục độc lập, không trộn — vì trộn là loạn.
