# VTL_71 — READ Layered Book Publish Model (10/20/70)

- **Status:** `LOCKED_BY_FOUNDER_2026-05-03`
- **Owner:** Founder (Tran Ha Tam) + Team 1 (Platform/Access) + Team 4 (Data Contracts)
- **Authority parent:** VTL_67 (READ Creator Economy Lock), VTL_68 (READ Phase 0 Wording Signoff)
- **Source repo:** `/Users/tranhatam/Documents/Devnewproject/tranhatam.com/WEB-TRANHATAM.COM/docs/50_books/02_tan_cung_mot_cuoc_song/`
- **Scope:** Define the canonical layered-access publish formula for every book on `read.vetuonglai.com`, beginning with Book 2 (`Tận Cùng Một Cuộc Sống`). Replaces the prior Phase 0 5/10/85 placeholder for READ-hosted books.

---

## 0. Why this lock exists

The previous READ Phase 0 model (5% public sample, 10% free member preview, 85% protected) was correct for tranhatam.com — it pairs with KDP commercial publication and the protected Reader runtime there.

For `read.vetuonglai.com`, where the book is republished by the same author, the gate is shifted to:

- **10% public** — homepage discovery, no signup required
- **20% free member preview** — after registration on `vetuonglai.com`
- **70% protected paid layer** — full read, practice, action plan, AI study guide, optional community

This widens the discovery surface (10% > 5%) and the free preview (20% > 10%), and trades raw protected size (70% < 85%) for a richer 70% that includes practice + action + AI guide + community.

---

## 1. The 10 / 20 / 70 formula (canonical)

| Layer | % | Audience | Access requirement | Content allowed |
|---|---|---|---|---|
| Public discovery | 10 | Everyone | None | Book metadata, back-cover copy, short intro excerpt, chapter titles only, reading orientation framing |
| Member preview | 20 | Free registered members on `vetuonglai.com` | Email-verified session | Full introduction, full reading orientation, selected slice of Chapter 1 section 1, one private reflection prompt |
| Protected paid | 70 | Paid readers | Purchase recorded by access runtime | Full chapters 1–9, final distillation, final white page, full 9 practice maps, action plan, AI study guide, community layer |

### 1.1 The 70% protected layer breakdown

The 70% paid layer is composed as:

| Sub-layer | % of total book | Purpose |
|---|---|---|
| Full chapters (read) | 40 | Vertical reading arc, untruncated |
| Practice / worksheet | 20 | Per-chapter pause, private reflection, non-action prompts |
| Action plan | 10 | Apply-to-life worksheet for books that have a doing surface; for contemplative books (like Book 2) this becomes "experience plan" — a quiet rhythm guide instead of an action checklist |
| AI study guide | 10 | Auto-generated personalised companion (per reader) |
| Community experience | optional overlay | Sharing + discussion. Off by default. Requires Team 3 governance signoff before being switched on per book |

For contemplative books (Book 2 archetype): the "action plan" slice is **renamed to "experience plan"** in the runtime so it does not contradict the book's editorial north star (`đóng lại mà không dạy`). The percentage stays at 10.

### 1.2 What never enters public or member layers

Hard-blocked from public + member preview, regardless of book:

- Full chapter bodies past the approved sample window
- Final distillation
- Final white page body (the concept may be summarised; the body stays protected)
- Private reflection prompts at scale
- KDP metadata sheets, raw manuscripts, Drive links
- Downloadable manuscript files (PDF/EPUB/DOCX)
- Any pricing not approved by Team 3

---

## 2. Per-book content sourcing

For every book entering READ:

1. Source canonical files from `tranhatam.com/WEB-TRANHATAM.COM/docs/50_books/<book>/`.
2. Specifically use:
   - `05_KDP_METADATA.md` → metadata + descriptions
   - `06_BACK_COVER_COPY.md` → back cover (may be public)
   - `12_FINAL_TOC_DRAFT.md` and `18_CHAPTER_TITLES_LOCK.md` → chapter titles only
   - `14_SAMPLE_WINDOW_CANDIDATES.md` → public/member sample windows (Founder-approved)
   - `15_PROTECTED_CMS_SECTION_MAP.md` → protected import map
   - `03_BOOK_PRACTICE_MAP.md` → practice prompts (protected layer)
3. Edit (not copy raw) into READ's tone: bilingual (vi/en), no sales pressure, no banned terms.
4. Store in `src/data/read-books.json` with explicit `access_rules`.
5. Render static pages at `src/static-pages/read.vetuonglai.com/books/<slug>/` and `<slug>/demo/`.

The full manuscript and KDP artefacts **never** leave protected runtime. Static HTML must contain only the 10% layer.

---

## 3. Book 2 publication scope (this lock)

| Item | Value |
|---|---|
| Slug | `tan-cung-mot-cuoc-song` |
| Title VI | `Tận Cùng Một Cuộc Sống` |
| Title EN | `The Depth of a Single Life` |
| Author | Trần Hà Tâm |
| Editorial north star | `Cuốn sách đọc một lần. Mỗi chương đóng lại mà không dạy. Người đọc rời đi mà không bị sửa.` |
| Chapter count | 9 (90 sections total) |
| Public route | `/books/tan-cung-mot-cuoc-song/` |
| Member demo route | `/books/tan-cung-mot-cuoc-song/demo/` |
| Public sample | back cover + short intro excerpt + 9 chapter titles + reading orientation framing |
| Member preview | full introduction + full reading orientation + one Chapter 1 slice + one private reflection prompt |
| Protected paid | 9 full chapters + final distillation + final white page + 9 practice maps + experience plan + AI study guide |
| Community | OFF for v1 (revisit after 30 days of paid live) |
| Pricing | NOT shown publicly (Team 3 disclosure rule) |

---

## 4. Team-by-team responsibilities

### Team 1 (Platform / Access / Commerce)
- Enforce access rules at runtime: 10% public is HTML, 20% preview gated by `member_state in [pending_member, annual_active, pack_owner, program_user, partner]`, 70% gated by `book_purchased=true`.
- Add `book_purchased` capability check to `workers/lib/access-runtime.mjs`.
- Surface no price on the public page; price only after login + Team 3 disclaimer accepted.

### Team 2 (Frontend / UX)
- Render the public page using only the approved 10% sample window.
- Render the demo page with the 20% member preview and a clear sign-in CTA.
- Add a "Reading rhythm" component for contemplative books (read → pause → private reflection prompt).
- No quiz UI on Book 2 unless Founder approves.

### Team 3 (Governance / Trust / Legal)
- Confirm zero KDP/PDF/EPUB/DOCX exposure on public surface.
- Approve any community layer activation (default OFF).
- Audit copy against banned-terms list before each new book ships.
- FTC disclosure remains: no income claims, no transformation guarantees.

### Team 4 (Data Contracts)
- Source of truth: `src/data/read-books.json`.
- Add per-book `access_rules` schema that the runtime consumes.
- Cross-link to `product-strategy-registry.json` pathway: `read`.

### Team 5 (QA / Release Gate)
- Add a verifier `verify:read:book-publish-gate` that:
  - Asserts no protected text leaks into the static dist.
  - Asserts every book in `read-books.json` has at least: title, author, slug, chapter_titles, public_sample, member_preview, access_rules.
  - Asserts the static HTML for `/books/<slug>/` does not contain protected markers (`final_distillation`, `final_white_page`, `practice_prompt_*`).
- Add to `verify:total-system:release-gate` as a baseline-required step.

---

## 5. Rollout sequence

1. Lock Book 2 under this model — covered by this commit.
2. Run build + check + smoke locally.
3. Deploy preview to Cloudflare Pages (`vetuonglai-read`) and verify both routes resolve.
4. Hand to Team 5 for total-system release gate run.
5. Once Book 2 ships clean, replicate the formula for Books 1, 3, 4 in `book-publication-registry.json` (Founder-approved sequence: `tu-0-den-khong-gioi-han`, `troi-sinh`, `tri-tue-khong-nguon-goc`).

---

## 6. Decision

```
READ_LAYERED_BOOK_PUBLISH_MODEL = 10/20/70
APPROVED_FOR_BOOK_2_LIVE_PUBLISH_2026-05-03
```

END
