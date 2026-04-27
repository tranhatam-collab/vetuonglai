# READ_BOOTSTRAP_EXECUTION_SPEC_2026.md

**Version:** 1.1  
**Date:** 2026-04-28  
**Status:** Approved execution lock for Slice 2  
**Scope:** `read.vetuonglai.com` Phase 0 / Slice 2 bootstrap only  
**Important note:** Đây là spec bootstrap tối thiểu. Chưa phải creator economy build đầy đủ. Mọi claim kinh tế phải qua legal review trước khi public.

---

# 1. Purpose

This spec exists to bring `read.vetuonglai.com` into the system correctly without overbuilding it.

Phase 0 must:
- put READ into the build pipeline
- give it a clean role
- make it understandable publicly
- avoid pretending the full creator economy already exists
- create a safe bridge toward later creator/product work

---

# 2. Official role of READ

`read.vetuonglai.com` is the **knowledge layer + creator economy explanation layer**.

In Phase 0, it is not yet:
- a marketplace
- a wallet
- a payout system
- a reader account system
- an affiliate system
- a full commerce engine

It is:
- a structural placeholder
- a public knowledge and reading surface
- a trust-oriented explanation space
- a transparent entry into future creator economics

---

# 3. Required pages in Phase 0

Exactly 3 public pages are required.

## 3.1 `/`
### Role
Homepage for the knowledge layer

### Must explain
- what READ is
- why it exists
- what kinds of content it will host
- how it connects to the wider ecosystem
- that the system is early-stage and being built progressively

### Must not do
- overpromise creator commerce features
- imply payouts are already active
- imply a full reader/author platform already exists

---

## 3.2 `/transparency`
### Role
Trust and transparency page

### Must explain
- the intended creator-economy principle
- the high-level revenue share direction
- that this is a transparency-first system
- what is already true
- what is not live yet
- what is still being built

### Must include
- clear disclosure language
- no unsupported financial certainty
- no hidden or internal labels
- no promise of immediate creator payouts unless implemented

### Legal guardrail
- Không ghi con số cụ thể (85%, 15%) như thể đã là final
- Phải có disclaimer: "Mô hình đang được hoàn thiện. Các con số là hướng dự kiến, chưa phải cam kết pháp lý."
- Không claim earning roles, tax handling, hoặc payout frequency cho đến khi legal xác nhận

---

## 3.3 `/how-we-pay`
### Role
Public explanation of how the future economic model is intended to work

### Must explain
- the high-level split model
- that percentages are directional until implementation is live
- what happens at a conceptual level:
  - reader payment
  - platform fee
  - creator share
- that payout infrastructure is not yet live in Phase 0

### Must not do
- behave like a live payout dashboard
- show wallets
- show balances
- show withdrawal actions
- show tax or accounting advice as if settled

### Legal guardrail
- Phải ghi rõ: "Đây là mô hình dự kiến, không phải cam kết thanh toán."
- Không dùng ngôn ngữ hứa hẹn thu nhập
- Không nêu con số % cụ thể như final trừ khi đã có legal sign-off
- Phải có phần "Khi nào mô hình này chính thức?" với câu trả lời trung thực

---

# 4. Public copy rules

## Rule 1
Use calm, structural language.

## Rule 2
Use "planned", "in development", or "early build" where appropriate.

## Rule 3
Do not use the READ homepage as a sales page for features that do not exist yet.

## Rule 4
Do not overclaim creator economy readiness.

## Rule 5
Use trust-aware wording:
- what is available now
- what is being built
- what is intentionally deferred

## Rule 6 (NEW — Legal guardrail)
Do not public any creator economy claim (revenue split, earning roles, payout frequency, tax handling) until legal review confirms the language is safe. Trang có thể mô tả "hướng đi" nhưng không được viết như hợp đồng.

---

# 5. Content structure

## 5.1 Homepage sections
Recommended sections:
1. Hero
2. What READ is
3. What kinds of works will live here
4. Why reading matters in this ecosystem
5. How READ connects to creators
6. How READ connects to transparency
7. Link to `/transparency`
8. Link to `/how-we-pay`

## 5.2 Transparency page sections
Recommended sections:
1. Why transparency matters
2. Current status of READ
3. What is already true
4. What is not live yet
5. Content and creator principles
6. Revenue share direction (framed as "intended direction", not commitment)
7. Update cadence / stale note
8. **Legal disclaimer block** (required)

## 5.3 How-we-pay page sections
Recommended sections:
1. Purpose of the page
2. High-level economic intent (framed as "model being developed")
3. Platform share vs creator share (directional, not final)
4. What this does not mean yet
5. When details become final
6. Contact / questions path
7. **Legal disclaimer block** (required)

---

# 6. Technical requirements

## 6.1 Build integration
- add `read.vetuonglai.com` to build pipeline
- add domain metadata
- add nav eligibility decision
- add data-domain if using shared system pattern
- integrate with shared assets unless there is a strong reason not to

## 6.2 Content
Add content files:
- `/content/sites.read.vi.json`
- `/content/sites.read.en.json`

## 6.3 SEO baseline
Must include:
- title
- meta description
- canonical
- hreflang
- H1
- og:image
- JSON-LD baseline

## 6.4 JSON-LD suggestion
Minimum:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage"
}
```

Potential later extensions:
- `Article`
- `CreativeWork`
- `CollectionPage`

---

# 7. Design rules

READ should feel:
- clean
- quiet
- literate
- trustworthy
- not overdecorated
- not hype-driven

Do not make it feel like:
- a crypto marketplace
- a startup growth funnel
- a half-built payout app

---

# 8. Things explicitly out of scope

Not in Phase 0:
- creator payouts
- payment rails
- wallets
- affiliate logic
- dashboards
- reader accounts
- content purchases
- download licenses
- ecommerce backend
- creator admin panels
- public creator economy claims without legal review

---

# 9. Status labeling

READ must be publicly labeled in a way that matches reality.

Recommended status framing:
- early build
- transparency-first
- knowledge layer in development

Do not label it as:
- complete
- live creator economy
- ready for payouts
- active marketplace

---

# 10. Acceptance criteria

READ bootstrap passes only if:
- 3 pages exist
- content is bilingual
- build pipeline includes READ
- SEO baseline exists
- transparency language is honest
- no unsupported commerce claims appear
- route structure is clean
- links to future systems are explanatory, not deceptive
- **legal disclaimer present on `/transparency` and `/how-we-pay`**
- **no specific % figures presented as final commitment**

---

# 11. Recommended team sequence

1. add READ to build pipeline
2. create content JSON
3. build homepage
4. build transparency page (with legal disclaimer)
5. build how-we-pay page (with legal disclaimer)
6. add OG image
7. add JSON-LD
8. QA wording and trust claims
9. **legal review checkpoint before publish**

---

# 12. Final instruction

READ should launch first as a truthful knowledge layer.

It should become a creator economy system later, only after:
- its role is trusted
- its wording is clean
- its technical path is real
- **legal review has confirmed economic claims are safe to publish**
