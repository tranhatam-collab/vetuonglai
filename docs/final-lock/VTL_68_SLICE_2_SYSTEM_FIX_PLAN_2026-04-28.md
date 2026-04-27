# SLICE_2_SYSTEM_FIX_PLAN_2026.md

**Version:** 1.2  
**Date:** 2026-04-28  
**Status:** Approved execution lock for Slice 2  
**Scope:** Toàn bộ hệ `vetuonglai.com` trong Slice 2  
**Important note:** Đây là bản khóa triển khai. Mọi thay đổi sau phải qua founder approval.  
**Universal Standard:** Phải tuân thủ `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md`

---

## 0. Compliance với Universal Standard

Tài liệu này tuân thủ Universal Web Project Master Implementation Lock (v1.0).

Các gate áp dụng cho Slice 2:
- Section 3 (Core Rule): Không xây lại, chỉ nâng cấp theo lát nhỏ ✅
- Section 4 (Non-Negotiable): Không hardcode text, không đổi kiến trúc ✅
- Section 6 (Brand/Language): Calm, precise, real, non-sales ✅
- Section 7 (Bilingual Switch): 🇻🇳 Tiếng Việt / 🇺🇸 English (không dùng VI/EN) ✅
- Section 8 (Content Source): Toàn bộ text từ content/vi.json + content/en.json ✅
- Section 12 (Image Rules): OG images SVG, icon metaphors riêng mỗi domain, không stock ✅
- Section 13 (Motion): CSS-only, prefers-reduced-motion fallback ✅
- Section 14 (SEO): title, meta, canonical, hreflang, og:image, JSON-LD, H1 ✅
- Section 15 (Accessibility): focus-visible, reduced-motion, semantic HTML ✅

---

# 1. Mục tiêu của Slice 2

Slice 2 không nhằm mở thêm sản phẩm mới.  
Slice 2 nhằm:

- sửa nền hệ thống
- đồng bộ content architecture
- nâng baseline SEO và trust
- đưa `read.vetuonglai.com` vào pipeline
- xử lý `kids.vetuonglai.com` như một nhánh remediation riêng
- chuẩn bị nền đúng cho Slice 3 hoặc READ system build sau này

---

# 2. Nguyên tắc điều hành

## Rule 1
Không build thêm feature mới trong Slice 2.

## Rule 2
Không mở thêm domain mới ngoài READ bootstrap đã có trong registry.

## Rule 3
Ưu tiên sửa:
- content
- metadata
- accessibility
- nav
- pipeline consistency

## Rule 4
Mọi task phải phục vụ một trong 4 mục tiêu:
- consistency
- trust
- SEO
- maintainability

## Rule 5
Nếu một task không làm nền mạnh hơn, task đó không thuộc Slice 2.

---

# 3. Workstreams của Slice 2

Slice 2 được chia thành **5 workstreams**:
- A — System Integrity
- B — Content JSON Expansion
- C — SEO / Trust Baseline
- D — KIDS Remediation
- E — READ Bootstrap

---

## WORKSTREAM A — System Integrity

### Mục tiêu
Làm cho registry, build pipeline và domain state nhất quán.

### Tasks
1. Thêm `read.vetuonglai.com` vào `domains` map của build pipeline
2. Chuẩn hóa state cho từng domain (5 states):
   - live
   - member-preview
   - planned
   - bridge
   - external
3. Rà lại primary nav:
   - chỉ giữ domain usable
   - domain planned nếu chưa đủ nền phải route đúng và copy đúng
4. Chuẩn hóa `data-domain` cho tất cả domain trong pipeline chính
5. Quyết định rõ hướng xử lý `kids` **(Day 1 — không chờ)**:
   - giữ static riêng nhưng có remediation
   - hoặc kéo dần về pipeline chung
6. Xác định rule cho external bridge như `nft.iai.one`

### Deliverables
- updated `domains` map
- domain state registry (5 states)
- nav eligibility list
- `read` bootstrap ready
- kids decision note (Day 1)

### Owner gợi ý
- Build / platform lead
- SEO / content architecture reviewer

---

## WORKSTREAM B — Content JSON Expansion

### Mục tiêu
Đưa 7 domain thiếu về content system chuẩn.

### Domain cần làm
- member
- work
- market
- community
- ai
- business
- kids

### File cần tạo
- `/content/sites.member.vi.json`
- `/content/sites.member.en.json`
- `/content/sites.work.vi.json`
- `/content/sites.work.en.json`
- `/content/sites.market.vi.json`
- `/content/sites.market.en.json`
- `/content/sites.community.vi.json`
- `/content/sites.community.en.json`
- `/content/sites.ai.vi.json`
- `/content/sites.ai.en.json`
- `/content/sites.business.vi.json`
- `/content/sites.business.en.json`
- `/content/sites.kids.vi.json`
- `/content/sites.kids.en.json`

### Rule viết content
- không hard-code text
- đúng Language Codex
- planned domain phải nói ngôn ngữ planned
- live domain phải có giọng hoàn chỉnh hơn
- kids content phải có framing phù hợp audience và phụ huynh

### Thứ tự ưu tiên
1. member
2. work
3. community
4. business
5. ai
6. market
7. kids

### Deliverables
- 14 file JSON mới
- content map per domain
- bilingual consistency review

### Owner gợi ý
- content system lead
- i18n reviewer
- SEO reviewer

---

## WORKSTREAM C — SEO / Trust Baseline

### Mục tiêu
Đưa all dist-output domains lên baseline shareable và machine-readable.

### Task 1 — OG image
Tạo 1 OG image cho mỗi domain có dist output (all dist-output domains — hiện 14, sẽ tăng nếu READ vào pipeline).

### Task 2 — Meta inject
Thêm tối thiểu:
```html
<meta property="og:image" ... />
<meta name="twitter:image" ... />
<meta property="og:title" ... />
<meta property="og:description" ... />
```

### Task 3 — JSON-LD baseline
Mỗi domain có tối thiểu:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage"
}
```

### Domain-specific schema gợi ý
- hub → WebSite / Organization / WebPage
- edu → Course + WebPage
- vc → CreativeWork / Service / WebPage
- finance → Service / WebPage
- green → Organization / WebPage
- member → WebPage
- work → WebPage
- market → WebPage
- community → WebPage
- ai → WebPage / Service
- business → WebPage / Service
- kids → giữ schema hiện có, làm sạch nếu cần
- read → sau bootstrap, dùng WebPage + Article/CreativeWork phù hợp

### Deliverables
- OG images cho all dist-output domains
- JSON-LD added to all missing domains
- schema audit note

### Owner gợi ý
- SEO lead
- front-end lead
- structured data reviewer

---

## WORKSTREAM D — KIDS Remediation

### Mục tiêu
Đưa `kids.vetuonglai.com` về mức chấp nhận được của toàn hệ.

### Bắt đầu từ Day 1 song song với Workstream A
1. thêm `prefers-reduced-motion` trong CSS
2. thêm guard tương đương trong JS nếu có animation
3. thêm `focus-visible`
4. thêm content JSON song ngữ
5. giữ hoặc nâng cấp JSON-LD
6. rà copy để đúng audience
7. rà nav / route / consistency
8. viết quyết định kỹ thuật:
   - giữ `kids.css` / `kids.js` riêng
   - hay bắt đầu chuyển về shared assets

### Minimum acceptance
- accessibility baseline có
- content JSON có
- trust / planned-state rõ
- không còn là "đảo riêng" hoàn toàn

### Deliverables
- updated `kids.css`
- updated `kids.js`
- kids content JSON
- remediation note
- migration decision memo

### Owner gợi ý
- accessibility lead
- front-end lead
- content reviewer

---

## WORKSTREAM E — READ Bootstrap

### Mục tiêu
Đưa `read.vetuonglai.com` vào hệ ở mức Phase 0.

### Chỉ làm 3 page
1. `/`
2. `/transparency`
3. `/how-we-pay`

### Mục tiêu của 3 page
- homepage = giải thích vai trò knowledge layer
- transparency = giải thích creator economy direction ở mức khái niệm
- how-we-pay = giải thích logic chia sẻ doanh thu ở mức public-safe, chưa là payout engine

### Legal guardrail (CRITICAL)
**Không được public các claim creator economy (85/15 split, tax, payout logic, earning roles, wallet) trên giao diện công khai cho đến khi có legal review xác nhận.**

Các trang `/transparency` và `/how-we-pay`:
- chỉ nói ở mức "hướng đi dự kiến" / "mô hình đang phát triển"
- không được viết như cam kết hợp đồng
- không được ghi con số cụ thể (85%, 15%) như thể đã là final
- phải có disclaimer rõ: "Mô hình đang được hoàn thiện. Các con số là hướng dự kiến, chưa phải cam kết pháp lý."

### Chưa làm
- wallet
- affiliate
- payout
- dashboard
- marketplace
- content commerce engine
- reader account system

### Deliverables
- READ added to pipeline
- 3 page static bootstrap
- metadata baseline
- clear status = planned / early live bootstrap
- legal disclaimer present on economic pages

### Owner gợi ý
- build lead
- product copy lead
- SEO reviewer

---

# 4. Day-by-day execution

## Day 1
- add READ to pipeline
- create domain state registry (5 states: live / member-preview / planned / bridge / external)
- start `member` JSON
- **decide KIDS remediation path** (pipeline decision — không chờ)
- begin KIDS accessibility audit

## Day 2
- finish `work`, `community`, `business` JSON
- nav cleanup draft
- `data-domain` review
- KIDS reduced-motion + focus-visible implementation

## Day 3
- finish `ai`, `market`, `kids` JSON draft
- generate OG image system for all dist-output domains
- map OG image file names

## Day 4
- inject OG image tags
- add JSON-LD baseline
- domain-specific schema pass

## Day 5
- KIDS content pass final
- KIDS migration decision execution (theo quyết định Day 1)
- KIDS QA

## Day 6
- READ bootstrap pages
- READ transparency (with legal disclaimer)
- READ how-we-pay (with legal disclaimer)

## Day 7
- QA full pass
- internal text clean-up
- nav validation
- planned/live wording check
- acceptance review

---

# 5. Cleanup tasks across all workstreams

## Internal text cleanup
Remove or hide from public pages:
- DPM
- ready
- source state
- internal flags
- build-only labels
- experimental internal notes

## Nav cleanup
- remove 502 links
- remove unusable links from primary nav
- keep bridge/external links clearly labeled
- avoid making planned domains feel fully live

## Status wording cleanup
For planned domains:
- use careful future-facing copy
- do not write as if the feature set is fully active

---

# 6. QA checklist

## System QA
- [ ] READ enters build pipeline correctly
- [ ] domain state registry exists (5 states)
- [ ] primary nav only links usable domains

## Content QA
- [ ] 7 missing domains now have content JSON
- [ ] vi/en copies are aligned
- [ ] no hard-coded public text for those domains

## SEO QA
- [ ] all dist-output domains have OG images
- [ ] JSON-LD exists for all target domains
- [ ] canonical and hreflang remain intact

## Accessibility QA
- [ ] KIDS has reduced motion handling
- [ ] KIDS has focus-visible
- [ ] no regressions on existing domains

## Trust QA
- [ ] planned domains are not overstated as live
- [ ] internal text does not leak
- [ ] READ does not overclaim creator economy features
- [ ] READ economic pages have legal disclaimer

---

# 7. Definition of Done

Slice 2 is done only if:

1. READ is in the build pipeline
2. All 7 missing domains have content JSON
3. All dist-output domains have OG images
4. All missing domains now have JSON-LD baseline
5. KIDS accessibility gap is materially reduced
6. KIDS pipeline decision made on Day 1 and executed
7. Nav is cleaned
8. Internal text is cleaned
9. Planned/live wording is correct
10. READ economic pages have legal disclaimer
11. Team can move into Slice 3 or READ build with a stronger base

---

# 8. Things explicitly out of scope

The following are not part of Slice 2:
- creator payout system
- affiliate system
- wallet
- economy engine
- community app logic
- READ marketplace
- advanced account system
- monetization mechanics beyond transparency copy
- payment implementation for READ
- public creator economy claims without legal review

---

# 9. Team instruction

Slice 2 is a repair and alignment sprint.

The team must treat it as:
- system cleanup
- content normalization
- SEO and trust hardening
- accessibility correction
- pipeline alignment

Not as a feature sprint.

---

# 10. Closing note

If Slice 2 is done well:
- the system becomes more trustworthy
- the architecture becomes more durable
- future slices become cheaper
- READ enters correctly
- KIDS stops drifting further away
- planned domains stop pretending to be fully live

If Slice 2 is skipped or diluted:
- future slices will become harder
- trust debt will compound
- the system will look broader but behave weaker
