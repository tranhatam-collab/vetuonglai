# 09_CONTENT_DEPTH_MATRIX_ALL_SUBDOMAINS.md

## Mục đích của file

File này là ma trận độ sâu nội dung thống nhất cho toàn bộ `*.vetuonglai.com`.

Mục tiêu:
- không domain nào khóa sạch public layer
- phân biệt rõ public/member/specialist/partner
- tránh content drift giữa team content, product, dev, legal

---

## 1. Định nghĩa 4 lớp độ sâu

### L0 — Public Intro

- hook 1-3 dòng
- problem framing
- basic explanation

### L1 — Public Value + Demo

- framework cơ bản
- demo/checklist/sample có giá trị thật

### L2 — Member Depth

- hướng dẫn sâu, workflow, dashboard, cá nhân hóa

### L3 — Specialist Depth

- pack/program chuyên sâu theo vấn đề

### L4 — Partner/Contributor Depth

- quyền nâng cao theo điều kiện và duyệt

---

## 2. Trạng thái khả dụng theo lớp

- `OPEN`: truy cập công khai
- `MEMBER`: cần `future_access_member`
- `PACK`: cần `specialist_pack_access:*`
- `RESTRICTED`: cần review/partner gate

---

## 3. Matrix chuẩn theo domain

## 3.1 Core domains

### `vetuonglai.com`
- L0: OPEN
- L1: OPEN
- L2: MEMBER
- L3: PACK (selected pathways)
- L4: RESTRICTED

### `member.vetuonglai.com`
- L0: OPEN (teaser/login entry)
- L1: OPEN (what member gives)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

### `edu.vetuonglai.com`
- L0: OPEN
- L1: OPEN (catalog + lesson preview)
- L2: MEMBER (core learning workflows)
- L3: PACK (deep modules)
- L4: RESTRICTED (mentor/co-creator)

### `vc.vetuonglai.com`
- L0: OPEN (verify entry)
- L1: OPEN (verify sample/disclosure)
- L2: MEMBER (personal proof dashboard)
- L3: PACK (advanced credential flows)
- L4: RESTRICTED (institutional/API partner)

---

## 3.2 Life-finance-invest-green cluster

### `life.vetuonglai.com`
- L0: OPEN
- L1: OPEN (routines/reset previews)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

### `finance.vetuonglai.com`
- L0: OPEN
- L1: OPEN (anti-scam, budgeting demos)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

### `invest.vetuonglai.com`
- L0: OPEN
- L1: OPEN (risk-first checklist)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

### `green.vetuonglai.com`
- L0: OPEN
- L1: OPEN (impact demos)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

---

## 3.3 Expansion domains

### `community.vetuonglai.com`
- L0: OPEN
- L1: OPEN (circle/cohort overview)
- L2: MEMBER
- L3: PACK (special cohorts)
- L4: RESTRICTED (moderator/host)

### `work.vetuonglai.com`
- L0: OPEN
- L1: OPEN (proof-based work framing)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED (verified partner hiring)

### `market.vetuonglai.com`
- L0: OPEN
- L1: OPEN (asset preview)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED (creator partner tiers)

### `ai.vetuonglai.com`
- L0: OPEN
- L1: OPEN (AI practical demos)
- L2: MEMBER
- L3: PACK
- L4: RESTRICTED

---

## 3.4 Long-term domains

`stories`, `mission`, `healing`, `family`, `foundation`, `labs`, `blog`, `live`, `tools`, `affiliate`, `api`, `admin`:

- L0: OPEN (khi có public surface)
- L1: OPEN (demo/value tối thiểu)
- L2: MEMBER (nếu có layer sâu)
- L3: PACK (nếu có chuyên đề)
- L4: RESTRICTED (ops/partner/internal)

---

## 4. Public minimum contract (áp dụng mọi domain)

Mọi domain phải có tối thiểu:

1. hook 1-3 dòng
2. public value thật
3. ít nhất 1 demo cụ thể
4. gateway CTA đúng chuẩn

Không đạt 4 mục trên thì không được gọi là “landing hoàn chỉnh”.

---

## 5. Paywall and SEO rules

- Không khóa toàn bộ nội dung từ đoạn đầu.
- Nếu có paywalled blocks phải gắn schema đúng.
- Internal links tối thiểu 3 nhánh:
  - cùng domain
  - domain liên quan
  - gateway/member next step

---

## 6. Ownership model

- Content owner: định nghĩa depth theo domain
- Product owner: quyết định gating theo entitlement
- Dev owner: enforce route/middleware
- Legal owner: review claims/disclosure

---

## 7. Quality gates trước khi publish

1. Content depth review
2. Entitlement mapping review
3. Legal wording review
4. Runtime truth review

---

## 8. Definition of done

Matrix chỉ được xem là hoàn chỉnh khi:

- tất cả domain có depth map rõ
- không có mâu thuẫn giữa content copy và route gating
- user luôn nhận được public value trước khi thấy paywall/upsell
- mọi team dùng cùng matrix này làm chuẩn

