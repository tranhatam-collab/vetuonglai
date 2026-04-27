# VTL ANALYZE REPORT — TRẠNG THÁI HIỆN TẠI
# (Universal Standard Section 17, Step 1)

Tuân thủ: `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md` Section 17 Step 1
Ngày: 2026-04-28

---

## Current structure / Cấu trúc hiện tại

- 16 domains in system-registry.json (14 internal + nft bridge + read planned)
- 15 domains with dist output (14 original + read)
- 67 HTML pages across all domains
- 93 API JSON files
- Shared build pipeline: scripts/build.mjs → dist/{domain}/
- Shared assets: design-tokens.css, style.css, app.js
- Content source: content/vi.json + content/en.json (15 domains covered)
- Kids: separate pipeline (kids.css, kids.js, static HTML)

---

## Design strengths / Điểm mạnh thiết kế

- Consistent card system across all domains
- Unified topbar/nav component
- Domain-specific color accents via siteTheme + design-tokens.css
- Clean typography (Inter, Plus Jakarta Sans, Lora, JetBrains Mono)
- 15 unique OG images with domain icon metaphors (NEW)
- 15 hero illustrations matching domain visual identity (NEW)
- Comprehensive spacing, shadow, z-index token system

---

## Design weaknesses / Điểm yếu thiết kế

1. siteTheme accent colors differ from design-tokens.css domain tokens (e.g., hub: #7bd3ff vs #22d3ee)
2. Language switch uses "Tiếng Việt" / "English" text only — needs flags per Universal Standard Section 7
3. No formal dark mode support
4. No formal icon system (icons are currently inline SVG in build.mjs)
5. Hero sections with metrics aside all look similar — limited visual differentiation
6. Footer links all follow same pattern — some planned domains link to /he-sinh-thai/ instead of their own URL

---

## SEO strengths / Điểm mạnh SEO

- All pages have: title, meta description, canonical, hreflang, og:title, og:description, og:image, twitter:card, twitter:image
- JSON-LD WebPage schema on all main-pipeline pages
- robots.txt and sitemap.xml generated per domain
- Content JSON provides bilingual metadata

---

## SEO weaknesses / Điểm yếu SEO

1. JSON-LD is generic WebPage only — needs domain-specific schemas (EDU→Course, VC→CreativeWork, etc.)
2. OG images are SVG — some social platforms may not render SVG (PNG fallback needed eventually)
3. No structured data for courses, products, organizations
4. Alt text on hero illustrations is empty string (aria-hidden="true" is correct but could be improved)

---

## Animation opportunities / Cơ hội animation

1. Scroll reveal for sections (data-animate system planned for Slice 4)
2. Hero illustration subtle float/pulse
3. Card hover lift
4. Stats counter animation in metrics
5. Progress bar animations in member/journey
6. Constellation animation for hub hero
7. Icon micro-interactions on hover

---

## Accessibility strengths / Điểm mạnh accessibility

- prefers-reduced-motion CSS guard in shared style.css
- prefers-reduced-motion JS guard in shared app.js
- :focus-visible styles in shared style.css
- Semantic HTML (h1, h2, h3, article, section, nav, footer)
- Language switch has aria-label and aria-pressed
- All images have alt attributes

---

## Accessibility weaknesses / Điểm yếu accessibility

1. kids.vetuonglai.com: NO prefers-reduced-motion in kids.css
2. kids.vetuonglai.com: NO :focus-visible in kids.css
3. kids.vetuonglai.com: NO prefers-reduced-motion guard in kids.js
4. Some contrast ratios need formal verification (especially subtle/mono text)
5. Skip-to-content link not present

---

## Affected pages/subdomains / Trang/subdomain bị ảnh hưởng

### Needs immediate work:
- kids.vetuonglai.com — accessibility remediation
- read.vetuonglai.com — Phase 0 bootstrap (3 pages)

### Needs next-slice work:
- All domains — animation refactor (Slice 4)
- All domains — language switch flag upgrade
- Hub — visual upgrade (Slice 5)
- Individual subdomains — unique section designs (Slices 6-10)

---

## Risks / Rủi ro

1. SVG OG images may not render on all social platforms (LinkedIn, WhatsApp confirmed SVG support; Facebook may need PNG)
2. Kids separate pipeline means changes require manual testing
3. siteTheme vs design-tokens accent mismatch could cause confusion
4. READ domain has legal requirements (disclaimer blocks) that need founder/legal review before publish

---

## Recommended next step / Bước tiếp theo đề xuất

1. **Immediate (Day 0):** Kids accessibility remediation — add reduced-motion + focus-visible to kids.css/kids.js
2. **Day 1-2:** READ Phase 0 bootstrap — 3 pages with legal disclaimers
3. **Day 2-3:** Language switch flag upgrade across all domains
4. **Day 3-5:** Animation refactor to data-animate system (Slice 4)
5. **Day 5-7:** Hub visual upgrade (Slice 5)
