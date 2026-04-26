# 43 — Render Function Review and Rewrite Proposal

> Review status: **proposal — awaiting founder approval before any text change is committed.**
> Reference: [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md), [`42_BILINGUAL_AUDIT_REPORT.md`](42_BILINGUAL_AUDIT_REPORT.md)

## Methodology

For each `render*` function in [`scripts/build.mjs`](../../scripts/build.mjs), the visible Vietnamese and English copy was read against the language codex:

- Calm, precise, non-sales tone
- No hype, no urgency, no outcome promise
- Vietnamese with full diacritics, no slang
- English in international American style, not machine-translated
- Bilingual pairs equivalent in meaning and tone
- Brand names left untranslated (Về Tương Lai, Vetuonglai, EDU, VC, FIN, GREEN, etc.)

Audit results were used as the floor: the seven-check audit ([viewport, html lang, description, canonical, hreflang, og, twitter, abbreviation, mixed-language pair, alt text, MT phrasing, hardcoded text, schema.org, link reachability, banned word]) reports **0 issues across 52 files**.

This document covers what an editor's read-through finds *beyond* the audit floor.

## Per-render review

| Function | Path | Assessment | Action |
| --- | --- | --- | --- |
| `renderHubPage` | `/` | Calm copy, problem cards explicit, "Điều hệ này không làm" anchor honest. **Keep.** | none |
| `renderHubAboutPage` | `/ve-chung-toi/` | Founder voice, proof-first. **Keep.** | none |
| `renderHubEcosystemPage` | `/he-sinh-thai/` | Domain map only, no commerce. **Keep.** | none |
| `renderHubStartPage` | `/bat-dau/` | Single entry point, calm. **Keep.** | none |
| `renderHubMemberPage` | `/thanh-vien/` | Member benefits stated as access scope, not promises. **Keep.** | none |
| `renderHubNewsPage` | `/tin-tuc/` | Updates only, no urgency. **Keep.** | none |
| `renderHubContactPage` | `/lien-he/` | Plain contact. **Keep.** | none |
| `renderHubSitemapPage` | `/sitemap/` | Programmatic. **Keep.** | none |
| `renderMemberHome` | `member /` | "Affiliate disabled at annual-only layer" disclosed. **Keep.** | none |
| `renderMemberJourneyPage` | `member /journey/` | New parent-bridge card lands here under self-attestation. **Keep.** | none |
| `renderEduPage` *(plus course/learn pages)* | `edu /...` | Course entries factual; AI tutor labelled as helper. *See micro-fix #1.* | one targeted change |
| `renderGreenPage` | `green /` | Anti-greenwash language explicit ("Không có bằng chứng thì không có giá trị"). **Keep.** | none |
| `renderFinancePage` | `finance /` | Anti-scam filter, "Không dạy làm giàu nhanh, không dạy trading, không dùng ngôn ngữ tự do tài chính." **Keep.** | none |
| `renderLifePage` | `life /` | Calm rhythm framing. **Keep.** | none |
| `renderInvestPage` | `invest /` | Due diligence, "no FOMO investing." **Keep.** | none |
| `renderBusinessPage` | `business /` | Enterprise intake, clear scope. **Keep.** | none |
| `renderCommunityPrinciplesPage` | `community /principles/` | Principles only, no testimonials. **Keep.** | none |
| `renderAiUseCasesPage` | `ai /use-cases/` | Sample-use only, no auto-execution. **Keep.** | none |
| `renderMarketRulesPage` | `market /rules/` | Trust boundary. **Keep.** | none |
| `renderWorkBriefsPage` | `work /brief/` | Proof-first opportunities. **Keep.** | none |
| `renderVcPage` | `vc /` | Issuer + method, no claims. **Keep.** | none |

## Proposed micro-fixes (await approval)

### Fix #1 — EDU course player "AI Tutor" label

**Where**: `renderCoursePlayerPage` in `build.mjs`, EDU course-player UI.

**Current** (Vietnamese / English):
- Heading: `"AI Tutor"` / `"AI Tutor"`
- Buttons: `"Hỏi AI"` / `"Ask AI"`

**Issue**: Even outside the kids subdomain, the Universal Bilingual Rebuild Command discourages unnecessary abbreviations in user-facing copy. The course player is for adults, but the "AI Tutor" label still reads as marketing rather than functional. A clearer pair:
- Heading VI: `"Trợ lý học"`
- Heading EN: `"Learning assistant"`
- Button VI: `"Hỏi trợ lý học"`
- Button EN: `"Ask the learning assistant"`

**Risk**: low. Same DOM structure, only string change. Existing `localized()` helper already supports both languages.

### Fix #2 — Hub hero subline (optional)

**Where**: `renderHubPage` hero subline.

**Current** Vietnamese: `"Một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng."`

**Observation**: solid. No change recommended for V1.

If a future polish pass wants slightly tighter cadence, an option to consider:
- `"Một hệ sống để hiểu mình, học đúng và tạo ra giá trị kiểm chứng được."`

This swaps `giúp con người` (helps people) for the implicit subject and changes `giá trị có thể kiểm chứng` (value that can be verified) to `giá trị kiểm chứng được` (verifiable value), keeping the exact same meaning in three fewer syllables. **Optional only.** Do not apply without approval.

### Fix #3 — Finance "FIN" inline mention

**Where**: `renderFinancePage`, copy inside cards.

**Current**: `"FIN giúp hiểu tiền, ..."`, `"FIN không dạy làm giàu nhanh, ..."`

**Observation**: `FIN` is the brand sub-label per `system-registry.json` (`labelVi: FIN`, `labelEn: FIN`). Treating it as a proper noun is consistent with how "EDU", "VC", "GREEN", "VTL" are used. **Keep as-is.**

If the founder later renames the sub-brand, do it in one place: `src/data/system-registry.json` `domains[].labelVi/labelEn`.

## What is deliberately not changing

- Brand names: Về Tương Lai, Vetuonglai, EDU, VC, FIN, GREEN, LIFE, INVEST, MEMBER, NFT, VTL.
  - These are sub-labels of the system registry, not abbreviations to expand. They appear identical in both VI and EN by design.
- Disclosure ID codes: `DPM-016`, `DPM-020`, etc. Compliance identifiers, not user copy.
- Status labels: `LIVE`, `MEMBER PREVIEW`, `PLANNED`, `BRIDGE`. These are state machine values surfaced as small badges; localised in `shared.status.*` of `content/vi.json` and `content/en.json`.
- Hub homepage stats (`X domain đang hoạt động` / `X live domains`). Numerical, factual.
- Learning-loop verbs (`Submit`, `Review`, `Next`). Used as state names in the kids learning-flow engine, kept consistent across UI.

## Process

1. Founder reads this doc.
2. For each "Proposed micro-fix" the founder marks ✅ approve / ❌ skip / 🔁 revise.
3. Approved fixes ship in a follow-up commit. Each fix is one isolated edit, one commit, with the audit re-run before/after.
4. The "deliberately not changing" list is reviewed quarterly; any rename there flows back through `system-registry.json` to keep the source of truth single.

## Recommendation

Current dist passes the full bilingual audit at zero issues, and a manual editor's read of every render function finds copy aligned with the language codex. The system is **ready for V1 launch on copy quality**. Only **Fix #1** (EDU course player AI Tutor → Trợ lý học) is suggested as a small polish to apply before launch; everything else can stand.

Future content team work should focus on the items the audit cannot judge:

- Image alt text — *content* of alt strings, not just presence.
- Editorial polish per page — line-by-line, sentence cadence, paragraph rhythm.
- SEO target-keyword research — title and description should anchor on real search intent.
- Mobile snippet preview check (search result rendering).

Those are out of scope for this proposal.
