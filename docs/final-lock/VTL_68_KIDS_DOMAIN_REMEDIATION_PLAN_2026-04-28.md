# KIDS_DOMAIN_REMEDIATION_PLAN_2026.md

**Version:** 1.2  
**Date:** 2026-04-28  
**Status:** Approved execution lock for Slice 2  
**Scope:** `kids.vetuonglai.com`  
**Important note:** Pipeline decision phải được đưa ra Day 1 của Slice 2. Không chờ Day 5.  
**Universal Standard:** Phải tuân thủ `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md`

---

## 0. Compliance với Universal Standard

Kids domain phải đạt các gate sau (theo Universal Standard):

- Section 12 (Image): ✅ OG image SVG đã có (kids star metaphor, 3.8KB)
- Section 13 (Motion): ⚠️ PENDING — chưa có prefers-reduced-motion trong kids.css/kids.js
- Section 14 (SEO): ✅ title, canonical, hreflang, H1 đã có. JSON-LD đã có (1 block)
- Section 15 (Accessibility): ⚠️ PENDING — chưa có :focus-visible trong kids.css
- Section 8 (Content Source): ✅ content/vi.json + content/en.json đã có sites.kids
- Section 7 (Bilingual Switch): ✅ đã có hreflang (4 tags)

Remediation tasks cần hoàn thành:
1. Thêm `@media (prefers-reduced-motion: reduce)` vào kids.css
2. Thêm prefers-reduced-motion guard vào kids.js animation functions
3. Thêm `:focus-visible` styles vào kids.css
4. Hero illustration SVG đã được generate (kids star, 1.8KB)

---

# 1. Executive summary

`kids.vetuonglai.com` is currently the most structurally divergent domain in the Về Tương Lai system.

Current issues identified:
- separate assets (`kids.css`, `kids.js`)
- not using shared asset pipeline
- no reduced-motion baseline
- no focus-visible baseline
- missing content JSON
- separate content and behavior pattern from the rest of the system

This does not mean KIDS must be rebuilt from scratch immediately.  
It does mean KIDS must be remediated now before it becomes long-term technical debt.

---

# 2. Remediation goals

The goal is not to erase the unique nature of KIDS.

The goal is to ensure KIDS is:
- more accessible
- more governable
- more content-consistent
- more trust-consistent
- easier to maintain

---

# 3. Current issues to address

## Issue 1 — Accessibility gap
Missing:
- `prefers-reduced-motion`
- `focus-visible`

This is serious because KIDS is aimed at a younger audience and should not be behind the rest of the system on accessibility basics.

## Issue 2 — Content gap
Missing:
- structured content JSON
- bilingual content parity with system standards

## Issue 3 — Pipeline isolation
KIDS currently sits outside the main shared pipeline conventions.

## Issue 4 — Governance gap
Without standard content and system conventions, KIDS may drift further away from the ecosystem over time.

---

# 4. Immediate remediation scope

## 4.1 Pipeline decision (Day 1 — CRITICAL)

**This decision must be made on Day 1 of Slice 2, not Day 5.**

The team must decide:

### Option A
Keep `kids.css` and `kids.js` for now, but add the missing accessibility and content system layers.

### Option B
Begin partial migration toward shared assets.

### Recommendation
Use **Option A in Slice 2**:
- minimal risk
- faster remediation
- avoids unnecessary rebuild
- creates a base for later convergence

Then decide later whether to migrate further.

**Regardless of option chosen, accessibility work begins Day 1.**

---

## 4.2 Accessibility remediation
Must add:
- CSS support for `prefers-reduced-motion`
- equivalent JS behavior reduction if animations exist
- `:focus-visible` treatment
- keyboard-visible interaction states

### Minimum acceptance
- users with reduced motion preference are respected
- keyboard navigation shows visible focus
- no critical interaction depends only on mouse/hover

---

## 4.3 Content remediation
Must create:
- `/content/sites.kids.vi.json`
- `/content/sites.kids.en.json`

### Content must include
- site title
- description
- hero content
- audience framing
- parent-mediated or guardian-aware note if relevant
- curriculum summary if applicable
- trust-safe wording

### Content rule
Do not write KIDS as if it were a generic marketing site.  
It must be clear, safe, and structurally consistent with the ecosystem.

---

## 4.4 Trust and status remediation
KIDS must clearly communicate:
- what it is
- who it is for
- whether it is live, planned, or partially live
- whether content is public preview or complete

If parts are still early, that should be visible in wording.

---

# 5. Remediation tasks

## Task 1 — Audit current kids CSS and JS (Day 1)
Identify:
- all animations
- all interactive controls
- all keyboard-focusable elements
- all custom styles that bypass system standards

## Task 2 — Add reduced-motion support (Day 1-2)
Implement:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

Adjust as needed to avoid breaking layout.

## Task 3 — Add focus-visible support (Day 1-2)
Ensure:
- clear focus ring
- consistent visible state
- color contrast acceptable
- no interactive element hides focus

## Task 4 — Create content JSON (Day 2-3)
Add bilingual content files and wire page text to content source where appropriate.

## Task 5 — Review public copy (Day 3)
Check:
- age appropriateness
- clarity for parents/guardians if relevant
- no internal labels leaking
- no overclaiming of readiness

## Task 6 — Review schema (Day 4)
Preserve existing JSON-LD where useful.
Do not remove it just because the rest of the system lacks it.
Instead:
- clean it
- simplify if needed
- align terminology

## Task 7 — Add OG image (Day 4)
KIDS must receive its own domain-specific OG image like the rest of the system.

---

# 6. Recommended content structure for KIDS

Suggested page content should support:
- introductory explanation
- learning path or lessons
- curriculum or structure
- guidance for families/parents if needed
- safe and calm language
- no clutter

If lessons are public:
- keep labels consistent
- make progression easy to understand
- ensure navigation is predictable

---

# 7. Accessibility acceptance criteria

KIDS remediation passes accessibility baseline only if:
- reduced-motion support exists
- focus-visible exists
- keyboard focus is visible on all primary interactions
- motion does not block core use
- no important interaction is hidden only behind animation

---

# 8. Content acceptance criteria

KIDS remediation passes content baseline only if:
- content JSON exists in vi/en
- public copy is safe and clear
- no internal notes leak
- no hard-coded domain text remains where JSON should be used
- trust/status wording matches reality

---

# 9. System acceptance criteria

KIDS remediation passes system baseline only if:
- domain has clear state (one of: live / member-preview / planned / bridge / external)
- content source exists
- SEO baseline exists or is scheduled
- accessibility baseline is materially fixed
- technical path forward is documented (Day 1 decision)

---

# 10. Recommended implementation sequence

## Day 1
- pipeline decision (Option A or B)
- audit kids CSS/JS
- begin reduced-motion implementation
- begin focus-visible implementation

## Day 2
- complete accessibility fixes
- start content JSON

## Day 3
- complete content JSON
- review trust/status wording

## Day 4
- review schema
- add OG image

## Day 5
- QA pass
- issue log
- future architecture note

---

# 11. Future decision after remediation

After Slice 2, founder/team should decide:

### Option 1
Keep KIDS as a semi-independent surface with stronger governance

### Option 2
Migrate KIDS gradually toward shared assets and pipeline standards

That decision should happen after remediation, not before — but the groundwork (Day 1 decision) informs this.

---

# 12. Final instruction

Do not rebuild KIDS emotionally.

Repair it structurally.

Slice 2 is about:
- accessibility
- content consistency
- trust clarity
- technical control

That is enough for now.
