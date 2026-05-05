# VTL_72 — READ Book Import and Editorial Execution Plan

- **Version:** 1.0
- **Date:** 2026-05-05
- **Status:** ACTIVE_NOW / NO_DIRECT_PUBLISH_WITHOUT_GATE
- **Owner:** Founder (Tran Ha Tam) + Team 1 coordination
- **Applies to:** Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · AI content agents
- **Source system:** `/Users/tranhatam/Documents/Devnewproject/tranhatam.com/WEB-TRANHATAM.COM/docs/50_books/`
- **Target system:** `read.vetuonglai.com`
- **Authority:** VTL_67 · VTL_68 · VTL_71 · `content/language-codex.md`

---

## 0. Founder Directive

Bring only publish-ready books from `tranhatam.com` into `vetuonglai.com` READ.

Every imported book must be adapted to the Vetuonglai language, legal, access, and editorial rules before it is exposed publicly or through member/protected access.

No team may publish raw manuscripts, KDP files, Drive links, full protected chapters, or downloadable book files into `dist/`.

---

## 1. Current Book Readiness Audit

Based on local source and READ gate inspection on 2026-05-05:

| Priority | Book | Slug | Source state | Vetuonglai READ state | Decision today |
|---:|---|---|---|---|---|
| 1 | Tận Cùng Một Cuộc Sống | `tan-cung-mot-cuoc-song` | closest to ready; local docs say near-ready / layered approved | public/demo registry exists; protected content is placeholder | WORK TODAY, do not revenue-launch yet |
| 2 | Từ 0 Đến Không Giới Hạn | `tu-0-den-khong-gioi-han` | draft / metadata-only; chapter extraction incomplete | not imported | SKIP until source body + sample windows are locked |
| 3 | Trồi Sinh | `troi-sinh` | draft / high-risk legal-financial-policy review pending | not imported | SKIP until Team 3 review |
| 4 | Trí Tuệ Không Nguồn Gốc | `tri-tue-khong-nguon-goc` | draft / AI safety + title consistency review pending | not imported | SKIP until title + AI boundary lock |
| 5 | 999 Thông Điệp Sống | `999-thong-diep-song` | manuscript exists in parts, but 999 extraction/grouping unresolved | not imported | SKIP until cycle grouping + sample selection |

Other related surfaces (`protected-bilingual-practice`, `99-cuts`, `sach-tang-noi-bo`, `leadership-execution`) are separate lanes and must not be mixed into the first five-book import lane without Founder approval.

---

## 2. Hard Stop-Lines

Stop immediately and mark `skip-for-now` if any item below is true:

- no confirmed author rights / dual-publish rights
- no final manuscript body
- no Founder-approved sample window
- no chapter title lock
- source title differs across registry/catalog/manifest without decision
- protected content still contains `[PROTECTED PLACEHOLDER]`
- static HTML includes full chapter body, KDP metadata, raw manuscript, PDF, EPUB, DOCX, MOBI, AZW3, or Drive links
- public page shows price before Team 3 disclosure approval
- book copy contains banned terms or legal-risk claims
- contemplative book is turned into coaching, therapy, success, healing, or self-improvement promise
- runtime does not enforce per-book entitlement for the protected 70% layer

When blocked, do not wait. Move to the next unblocked audit/edit task and report the blocker in the 15-minute Founder update.

---

## 3. Vetuonglai READ Publishing Standard

All READ-hosted books use VTL_71 unless Founder signs a new model:

| Layer | Share | Audience | Allowed |
|---|---:|---|---|
| Public discovery | 10% | everyone | metadata, back cover, short intro excerpt, chapter titles, reading orientation |
| Member preview | 20% | registered members | full introduction, reading orientation, selected Chapter 1 slice, one private reflection prompt |
| Protected paid | 70% | paid readers | full chapters, practice/experience layer, AI study guide, final protected material |

Blocked from public/member layers:

- full chapter bodies beyond approved sample
- final distillation
- final white page body
- private prompts at scale
- KDP metadata
- raw manuscript
- downloadable files
- unapproved public price

---

## 4. Source Files to Pull From Tranhatam.com

For each book, agents must inspect the source folder:

`/Users/tranhatam/Documents/Devnewproject/tranhatam.com/WEB-TRANHATAM.COM/docs/50_books/<book>/`

Use these files when present:

| Source file | Use in READ |
|---|---|
| `05_KDP_METADATA.md` | metadata only; never expose KDP-only data publicly |
| `06_BACK_COVER_COPY.md` | public back-cover copy after language-codex edit |
| `12_FINAL_TOC_DRAFT.md` | chapter outline cross-check |
| `18_CHAPTER_TITLES_LOCK.md` | chapter title source of truth |
| `14_SAMPLE_WINDOW_CANDIDATES.md` | public/member sample candidates; requires Founder approval |
| `15_PROTECTED_CMS_SECTION_MAP.md` | protected-layer import mapping |
| `03_BOOK_PRACTICE_MAP.md` | protected practice/experience layer only |
| `16_IMPORT_MANIFEST_STUB.json` | import blocker list and source-state check |

Do not copy raw manuscript into static pages. Protected manuscript content belongs only under `protected/read-books/<slug>/content.json` and must be verified not to enter `dist/`.

---

## 5. Team Responsibilities

### Team 1 — Platform / Access / Coordination

Today's tasks:

1. Maintain the READ book access model: public 10%, member 20%, protected 70%.
2. Confirm `/api/access/books/check` and `/api/access/books/content` enforce per-slug entitlement.
3. Confirm no protected directory is copied to `dist/`.
4. Coordinate AI agents and stop-line decisions.
5. Keep the book queue moving; do not wait on blocked books.

Do not today:

- open public pricing
- activate community overlay
- mass-import new books before protected content loader and verifier are ready

### Team 2 — Frontend / UX / Editorial Surface

Today's tasks:

1. Audit the current Book 2 public and demo routes.
2. Ensure public copy stays calm, precise, non-sales, and non-therapy.
3. Ensure member demo has clear gate wording without pressure.
4. Prepare page templates for Books 1, 3, 4, 5 but do not publish them until Team 3/5 pass.
5. Keep mobile reading layout readable.

Do not today:

- invent missing book content
- add purchase pressure copy
- expose protected chapter text in static HTML

### Team 3 — Governance / Legal / Editorial Integrity

Today's tasks:

1. Sign off Book 2 wording under the editorial north star:
   `Cuốn sách đọc một lần. Mỗi chương đóng lại mà không dạy. Người đọc rời đi mà không bị sửa.`
2. Check no therapy, healing, guaranteed transformation, religious authority, or medical treatment claim.
3. Check no income/ROI/affiliate wording leaks into READ book pages.
4. Hold Books 1, 3, 4, 5 until source-state blockers are removed.
5. Approve or reject each sample window.

Do not today:

- sign off community overlay
- sign off public pricing
- sign off raw manuscript exposure

### Team 4 — Data / Contracts / Registry

Today's tasks:

1. Keep `src/data/read-books.json` as source of truth.
2. Compare READ registry with Tranhatam source manifests.
3. Produce a per-book import checklist with missing fields.
4. Mark every blocked book explicitly as `skip-for-now` in the work queue, not in public registry.
5. Prepare a future `book-publication-registry` mapping only after Founder approves sequence.

Do not today:

- mark draft books as published
- change slug/title if source files conflict without Founder decision

### Team 5 — QA / Release Gate

Today's tasks:

1. Re-run `node scripts/verify-read-book-publish-gate.mjs` after Team 1 clears build lock if needed.
2. Extend the evidence report manually if verifier does not yet execute protected-content checks.
3. Confirm the current `15/15` gate is structural only, not proof of real protected manuscript readiness.
4. Verify zero protected leaks in `dist/`.
5. Send Founder report every 15 minutes.

Do not today:

- certify revenue launch while protected content is placeholder
- treat placeholder content as publish-ready manuscript

---

## 6. AI Agent Work Queue

Use multiple agents, but one owner per item.

### Agent A — Source Auditor

Scope:

- inspect Tranhatam source folders
- classify book as `publish-ready`, `near-ready`, `draft`, or `skip-for-now`
- list missing source files and conflicts

Output:

```text
Book:
Slug:
Source folder:
State:
Ready evidence:
Missing:
Conflict:
Decision:
Next owner:
```

### Agent B — Editorial Adapter

Scope:

- adapt approved public/member copy to Vetuonglai tone
- remove banned terms
- preserve book's editorial north star
- never touch protected body unless explicitly assigned

### Agent C — Protected Content Mapper

Scope:

- map final manuscript into protected schema
- ensure `chapters`, `practice_map`, `experience_plan`, `ai_study_guide`, `final_distillation`, `final_white_page` are present
- remove placeholder notices before launch

### Agent D — QA / Leak Checker

Scope:

- run book publish gate
- inspect `dist/read.vetuonglai.com`
- confirm no protected text, URI, or downloads leak

### Agent E — Reporter / Traffic Controller

Scope:

- maintain 9-minute task queue
- send 15-minute Founder report
- prevent team overlap

---

## 7. 9-Minute Agent Loop

Each agent repeats this loop while the Founder session is active:

| Minute | Action |
|---:|---|
| 0-1 | Pick next unblocked item and declare owner |
| 1-6 | Execute only assigned slice |
| 6-7 | Self-check against stop-lines |
| 7-8 | Write handoff/update |
| 8-9 | Move item forward or mark `skip-for-now`; pick next item if free |

Rules:

- one agent owns one item at a time
- blocked items are skipped, not debated
- no agent changes schema/code unless Team 1 explicitly approves
- no agent publishes live content without Team 5 gate

---

## 8. Founder Report Every 15 Minutes

Team 5 / Agent E sends this format:

```text
[READ BOOK REPORT — HH:MM ICT]

Done:
- ...

In progress:
- Book / Owner / Current step / ETA

Blocked:
- Book / Reason / Needed decision

Skipped for now:
- Book / Reason / Next revisit condition

Risks:
- protected leak / legal wording / missing manuscript / title conflict / access gap

Next 15 minutes:
- ...

Decision needed from Founder:
- ...
```

---

## 9. Today's Execution Order

1. Book 2 only: verify source body status and replace placeholder only if final manuscript is present and approved.
2. Book 2: activate protected-content checks in evidence before revenue launch.
3. Books 1, 3, 4, 5: audit only, no public publish.
4. Create a queue table of blockers for the four draft books.
5. Prepare templates, not content, for future imports.

---

## 10. Current Verdict

```text
NO BOOK IS FULLY CLEARED FOR DIRECT PUBLIC REVENUE LAUNCH TODAY.

Book 2 is the active working candidate.
Book 2 public/demo layer is structurally ready.
Book 2 protected layer is not manuscript-ready because content still contains placeholders.

Books 1, 3, 4, 5 stay in audit/skip-for-now until source blockers are cleared.
```

END
