# Web Upgrade Team Report — Về Tương Lai
# Báo cáo nhóm nâng cấp web — Về Tương Lai

Tuân thủ: `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md` Section 20
Date / Ngày: 2026-04-28
Reporter / Người báo cáo: Team 2 (Frontend/UX) via AI agent
Project / Dự án: vetuonglai.com ecosystem (15 domains)
Phase / Giai đoạn: Slice 2 — Repair and alignment sprint

---

## Completed / Đã hoàn thành

### Slice 1 — Foundation (DONE)
- Added 7 new domain token blocks to `design-tokens.css` (ai, work, market, business, member, kids, community)
- Added `--vt-space-2xl`, `--vt-space-3xl` spacing tokens
- Added `--vt-shadow-xs/sm/md/lg` shadow tokens
- Added `--vt-z-base/card/sticky/topbar/modal/toast` z-index tokens
- Mirrored all new tokens in `design-tokens.json`
- Added `@media (prefers-reduced-motion: reduce)` to `style.css`
- Added `:focus-visible` styles to `style.css`
- Added `prefers-reduced-motion` guard in `app.js` scroll animations
- npm run build PASS, npm run check PASS

### Slice 2 — Images & Visual Identity (DONE)
- Created 15 unique OG images (1200×630 SVG) with domain-specific icon metaphors
- Created 15 hero illustrations (800×500 SVG) matching domain visual identity
- OG images auto-generated per domain in build pipeline (`ensureDomainOgAsset()`)
- Hero illustrations auto-rendered in `renderHero()` when aside slot is empty
- CSS `.hero-illustration` responsive + hover transition added
- og:image + twitter:image meta confirmed in all 67 HTML pages
- JSON-LD WebPage schema confirmed in 14/15 domains (read pending bootstrap)
- npm run build PASS, npm run check PASS

### Slice 2 — Content JSON Expansion (VERIFIED COMPLETE)
- content/vi.json: 15 domains with seo + hero entries (hub, edu, vc, life, finance, invest, green, member, work, market, community, ai, business, kids, read)
- content/en.json: same 15 domains fully covered

### Slice 2 — Planning Docs Alignment (DONE)
- Saved Universal Standard as `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md`
- Updated VTL_68_SLICE_2_SYSTEM_FIX_PLAN with compliance section
- Updated VTL_68_DOMAIN_EXECUTION_REPRIORITIZATION with domain compliance matrix
- Updated VTL_68_KIDS_DOMAIN_REMEDIATION_PLAN with specific gate checklist
- Updated VTL_67_LANGUAGE_LOGIC_REFINEMENT with banned-term table
- Created VTL_SUBDOMAIN_MEANING_MAP with all 15 domains

---

## In Progress / Đang tiến hành

(none — awaiting next task assignment)

---

## Blockers / Vấn đề chặn

- None for current scope

---

## Risks / Rủi ro

- kids.vetuonglai.com still lacks prefers-reduced-motion + focus-visible in its own CSS/JS (separate pipeline)
- read.vetuonglai.com Phase 0 bootstrap not yet built (3 pages needed)
- Some siteTheme accent colors differ from design-tokens.css domain tokens (needs unification in later slice)

---

## Design Status / Trạng thái thiết kế

- ✅ Color tokens: 14 domain blocks in design-tokens.css
- ✅ Typography: Inter, Plus Jakarta Sans, Lora, JetBrains Mono (loaded via Google Fonts)
- ✅ Spacing: base + extended (2xl, 3xl)
- ✅ Shadows: xs/sm/md/lg
- ✅ Z-index: 6-tier scale
- ✅ Card system: existing, working
- ✅ Button system: existing, working
- ✅ Badge system: existing, working
- ✅ Illustration direction: SVG icon metaphors per domain (15 unique)
- ⚠️ Icon system: pending formal icon set (currently inline SVG)

---

## Frontend Status / Trạng thái Frontend

- ✅ Build pipeline: npm run build passes for all 15 domains
- ✅ Shared assets: design-tokens.css, style.css, app.js deployed to 13 domains
- ✅ OG images: auto-generated per domain
- ✅ Hero illustrations: auto-rendered or metrics aside
- ✅ Reduced motion: CSS + JS guards in shared pipeline
- ✅ Focus visible: CSS in shared pipeline
- ⚠️ Kids pipeline: separate, needs its own accessibility additions

---

## SEO / Content Status / Trạng thái SEO / Nội dung

- ✅ title: all 67 HTML pages
- ✅ meta description: all 67 HTML pages
- ✅ canonical: all pages
- ✅ hreflang: all pages (4-5 tags per page)
- ✅ H1: all pages (one per page)
- ✅ og:image: all pages → /assets/og-image.svg
- ✅ twitter:image: all pages
- ✅ JSON-LD WebPage: 14/15 domains
- ✅ robots.txt: generated per domain
- ✅ sitemap.xml: generated per domain
- ✅ Content JSON: vi + en for all 15 domains

---

## QA Status / Trạng thái QA

- ✅ npm run build: PASS
- ✅ npm run check: PASS
- ⚠️ Responsive: not formally tested (visual inspection needed)
- ⚠️ Link check: not formally run
- ⚠️ Language switch: needs manual verification per domain

---

## DevOps Status / Trạng thái DevOps

- ✅ Deployment structure preserved (dist/ per domain)
- ✅ Build scripts unchanged (scripts/build.mjs)
- ✅ No new npm dependencies
- ⚠️ Cloudflare deployment: needs ops confirmation

---

## Language Switch Check / Kiểm tra chuyển ngôn ngữ

- Bilingual required: YES
- Uses full labels: Currently "Tiếng Việt" / "English" (no flags yet — needs update per Section 7)
- No VI/EN shorthand: ✅ confirmed

---

## Local Test Evidence / Bằng chứng test local

```
npm run build → PASS (all 15 domains built)
npm run check → PASS (Vetuonglai dist check passed)

OG images verified: 15/15 domains have og-image.svg (3.8-4.6KB each)
Hero illustrations verified: 15/15 domains have hero-illustration.svg (1.8-2.7KB each)
HTML meta verified: og:image=2, twitter:image=1, JSON-LD=1 per domain index
```

---

## Files Changed / File đã thay đổi

### Source files (persistent)
1. `scripts/build.mjs` — added domainIconMetaphors, upgraded renderOgImageSvg(), added renderHeroIllustrationSvg(), upgraded ensureDomainOgAsset(), upgraded renderHero()
2. `src/shared/style.css` — added .hero-illustration CSS
3. `src/shared/design-tokens.css` — (Slice 1: 7 domain blocks, spacing, shadows, z-index)
4. `src/shared/design-tokens.json` — (Slice 1: mirrored tokens)
5. `src/shared/app.js` — (Slice 1: reduced-motion guard)
6. `content/vi.json` — all 15 domains covered
7. `content/en.json` — all 15 domains covered

### Docs files
8. `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md` — NEW
9. `docs/00_master/VTL_SUBDOMAIN_MEANING_MAP.md` — NEW
10. `docs/00_master/VTL_TEAM_ADMIN_REPORT_CURRENT.md` — NEW (this file)
11. `docs/final-lock/VTL_68_SLICE_2_SYSTEM_FIX_PLAN_2026-04-28.md` — UPDATED (compliance section)
12. `docs/final-lock/VTL_68_DOMAIN_EXECUTION_REPRIORITIZATION_2026-04-28.md` — UPDATED (compliance matrix)
13. `docs/final-lock/VTL_68_KIDS_DOMAIN_REMEDIATION_PLAN_2026-04-28.md` — UPDATED (gate checklist)
14. `docs/final-lock/VTL_67_LANGUAGE_LOGIC_REFINEMENT_AND_TEAM_ASSIGNMENTS_2026-04-28.md` — UPDATED (banned-term table)

---

## Screenshots Needed / Screenshot cần bổ sung

- Each domain index page in browser (desktop + mobile)
- OG image preview via social media debugger
- Hero illustration rendering per domain

---

## Approval Needed From Owner / Cần duyệt từ chủ dự án

- Approve Slice 2 image + docs completion
- Decide: proceed with Kids remediation (WS-D) or READ bootstrap (WS-A) next?
- Approve commit

---

## Next Step / Bước tiếp theo

1. Kids accessibility remediation (prefers-reduced-motion + focus-visible in kids.css/kids.js)
2. READ Phase 0 bootstrap (3 pages: /, /transparency, /how-we-pay)
3. Language switch upgrade to flags (🇻🇳 Tiếng Việt / 🇺🇸 English)
4. Formal link check + responsive test
5. Animation refactor (Slice 4: data-animate system)

---

## Suggested Commit Message / Đề xuất commit message

```
feat: add domain-specific OG images, hero illustrations, and universal standard compliance

- 15 unique SVG OG images with domain icon metaphors (1200×630)
- 15 SVG hero illustrations with domain visual identity (800×500)
- Auto hero illustration in renderHero() when aside is empty
- CSS .hero-illustration with responsive + hover
- Updated 4 planning docs with Universal Standard compliance sections
- Created Subdomain Meaning Map, Team Admin Report, Universal Standard doc
```
