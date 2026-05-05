# VTL_73 — Book 2 Intake Audit and Handoff

- **Date:** 2026-05-05
- **Status:** ACTIVE_HANDOFF / NOT_MANUSCRIPT_READY_FOR_REVENUE_LAUNCH
- **Book:** `Tận Cùng Một Cuộc Sống`
- **English title:** `The Depth of a Single Life`
- **Slug:** `tan-cung-mot-cuoc-song`
- **Source:** `/Users/tranhatam/Documents/Devnewproject/tranhatam.com/WEB-TRANHATAM.COM/docs/50_books/02_tan_cung_mot_cuoc_song/`
- **Target:** `read.vetuonglai.com/books/tan-cung-mot-cuoc-song/`
- **Authority:** VTL_71 + VTL_72 + `content/language-codex.md`

---

## 0. Verdict

Book 2 is the only active book candidate today.

It is **not cleared for protected paid / revenue launch** because the full protected manuscript is not yet final.

Current allowed work:

- keep public/detail and member-demo structure
- audit and improve public/member copy
- finish body extraction workflow
- prepare protected import schema
- strengthen verifier evidence

Current blocked work:

- replacing the protected placeholder with incomplete manuscript
- paid launch
- public price display
- community overlay
- mass import of Books 1, 3, 4, 5

---

## 1. Source Evidence Checked

| File | Status found | Meaning |
|---|---|---|
| `08_FINAL_QA_REPORT.md` | `NEAR_READY_AFTER_FINAL_QA` | Not final; final manuscript extraction + QA still required |
| `09_WEB_PUBLISH_GATE.md` | `WEB_LAYERED_PUBLISH_APPROVED` for old 5/10/85 model | Public layered surface allowed on Tranhatam model; must remap to Vetuonglai 10/20/70 |
| `14_SAMPLE_WINDOW_CANDIDATES.md` | Founder approved for 5/10/85 web launch | Sample directions usable, but target model is now 10/20/70 |
| `16_IMPORT_MANIFEST_STUB.json` | `READY_FOR_FINAL_BODY_EXTRACTION_AFTER_QA` | Import units verified; body extraction/hash still blocked |
| `18_CHAPTER_TITLES_LOCK.md` | `LOCKED_BY_FOUNDER_2026-05-01` | Chapter titles and editorial north star are locked |
| `13_CLEAN_MANUSCRIPT_REVIEW_DRAFT.md` | `MANUSCRIPT_STRUCTURE_READY_FOR_FINAL_BODY_EXTRACTION` | 9 chapters / 90 sections verified; not WEB_READY |
| `19_CHAPTER_1_DRAFT_V2.md` | `LOCKED_CHAPTER_1_VI_BODY_2026-05-01` | Chapter 1 Vietnamese body is locked; English pass still separate/pending |
| `20_CHAPTER_2_DRAFT.md` | `DRAFT_PENDING_FOUNDER_TASTE_TEST` | Chapter 2 is not final |
| `22_BUONG_SECTION_RULING_REQUEST.md` | `FOUNDER_RULING_REQUIRED` | Section-level banned-family vocabulary still needs Founder picks |

---

## 2. What Is Already Strong

- 9 chapter titles are locked.
- Editorial north star is locked:

```text
Cuốn sách đọc một lần.
Mỗi chương đóng lại mà không dạy.
Người đọc rời đi mà không bị sửa.
```

- Chapter/section structure is verified: 9 chapters, 90 bilingual section titles.
- Public back cover copy exists and matches the contemplative direction.
- Practice map exists and is light enough for the book's tone.
- Vetuonglai READ registry already declares the book under `src/data/read-books.json`.
- READ book gate currently passes 15/15 structural checks.

---

## 3. Blocking Gaps

| Blocker | Owner | Action today |
|---|---|---|
| Full body not extracted into controlled manuscript | Editorial / Team 2 support | Continue chapter extraction; do not publish incomplete body |
| Chapter 1 EN pass not found in source folder | Editorial | Produce/locate `19_CHAPTER_1_DRAFT_V2_EN.md` |
| Chapters 2-9 not locked as final body | Founder + Editorial | Taste test / approve chapter by chapter |
| Section-level `buông` replacements need Founder ruling | Founder | Pick replacements from file 22 |
| Hash manifest missing | Team 4 + Team 5 | Generate only after final protected body is normalized |
| Vetuonglai protected content still placeholder | Team 1 + Team 4 | Replace only after all manuscript gates pass |
| Verifier does not prove real protected body readiness | Team 5 | Add/evidence protected-content checks before launch |

---

## 4. Mapping To Vetuonglai 10/20/70

The Tranhatam source gate uses `5/10/85`. Vetuonglai READ uses `10/20/70` per VTL_71.

Allowed mapping:

| Vetuonglai layer | Source candidates | Decision |
|---|---|---|
| 10% public | back cover, short intro excerpt, reading orientation framing, chapter titles only | allowed now if no full body leaks |
| 20% member preview | full introduction, full reading orientation, selected Chapter 1 section 1 slice, one private prompt | allowed only after auth gate; not static public |
| 70% protected paid | full chapters, practice map, experience plan, AI study guide, final protected sections | blocked until final body extraction + hash proof |

Do not import the old 5/10/85 percentages as-is. The old approval is source evidence, not the target rule.

---

## 5. Founder Decisions Needed

From `22_BUONG_SECTION_RULING_REQUEST.md`, Founder must pick replacements before final body import:

1. Section 5.2:
   - recommended: `Rời không có nghĩa là biến mất.` / `Leaving Does Not Mean Disappearing.`
2. Section 5.5:
   - recommended: `Tình yêu không giữ - nó để qua.` / `Love Doesn't Hold - It Lets Pass.`
3. Section 5.10:
   - recommended: `Rời là cánh cửa cuối cùng dẫn về tự do.` / `Leaving Is the Final Door to Freedom.`
4. Section 8.10:
   - recommended: `Tôi đã đến - ngay khi tôi không còn giữ gì.` / `I Have Arrived - When I Hold Nothing.`

Default team recommendation: accept all four recommended replacements unless Founder writes a new line.

---

## 6. Team Handoff

### Team 1

Next:

- keep READ runtime gate unchanged
- do not enable paid launch
- verify protected folder never enters `dist/`
- prepare runtime for multi-book protected loading later; not needed for Book 2 only

### Team 2

Next:

- audit current public/demo Book 2 UI against VTL_71/VTL_72
- prepare chapter extraction checklist, but do not paste body into public pages
- preserve contemplative non-instructional tone

### Team 3

Next:

- audit public back-cover, public sample, and member demo copy
- sign or reject the four `buông` replacement recommendations
- confirm no therapy/healing/religious-authority/guaranteed-transformation claim

### Team 4

Next:

- create a normalized protected schema checklist for `content.json`
- compare final source body against required keys: `chapters`, `practice_map`, `experience_plan`, `ai_study_guide`, `final_distillation`, `final_white_page`
- hold `read-books.json` at one active book until body proof exists

### Team 5

Next:

- keep `verify-read-book-publish-gate` result as structural-only evidence
- add manual evidence note: `protected content remains placeholder`
- require hash manifest + protected body no-leak proof before revenue-ready verdict

---

## 7. Today's 9-Minute Loop For Book 2

1. Agent A: locate or produce status of Chapter 1 EN pass.
2. Agent B: audit Chapter 2 draft blockers and list Founder taste-test questions.
3. Agent C: convert source blockers into a protected import checklist, no body import yet.
4. Agent D: check Vetuonglai public/demo pages for leakage and legal-risk wording.
5. Agent E: report to Founder every 15 minutes.

---

## 8. Current Decision

```text
BOOK2_PUBLIC_LAYER = STRUCTURALLY_READY
BOOK2_MEMBER_DEMO = STRUCTURALLY_READY_BUT_AUTH_ONLY
BOOK2_PROTECTED_LAYER = BLOCKED_BY_PLACEHOLDER_AND_BODY_EXTRACTION
BOOK2_REVENUE_LAUNCH = NO_GO
```

END
