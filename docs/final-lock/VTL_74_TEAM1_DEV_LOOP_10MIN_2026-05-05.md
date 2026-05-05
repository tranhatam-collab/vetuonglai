# VTL_74 — Team 1 Dev Loop 10-Minute Schedule
**File:** `docs/final-lock/VTL_74_TEAM1_DEV_LOOP_10MIN_2026-05-05.md`
**Status:** ACTIVE — runs until all READ Book lanes deploy green
**Owner:** Team 1 (assistant-led, Founder-supervised)
**Cadence:** every 10 minutes (offset from other loops)
**Founder authority:** order received 2026-05-05

## 0. Why this loop

Founder has 3 loops running in parallel:

| Loop | Cadence | Owner | Scope |
|---|---|---|---|
| `auto-dev-loop` | 9 min | repo-level launchd | scaffold + housekeeping |
| `editorial admin team` | 15 min | content-only AI agents (per VTL_72 §7) | source audit + manuscript adapt |
| **Team 1 dev loop (this doc)** | **10 min** | **Team 1 / assistant** | **runtime + verifier + deploy gate** |

Companion docs: VTL_71 (publish model), VTL_72 (book import plan), VTL_73 (Book 2 intake audit).

The 9 / 10 / 15 cadences mean the three loops co-prime — collisions stay rare.

## 1. Hard non-overlap rules

Team 1 dev loop **MUST NOT**:
- Touch `protected/read-books/<slug>/content.json` (editorial team owns it)
- Touch `protected/read-books/<slug>/content.placeholder.json` body content (only Team 1 may rewrite the schema-level fields, never the placeholder bodies which are live in tests)
- Re-add manuscript or any `*.docx` `*.pdf` `*.epub` `*.mobi` to the repo
- Push to remote
- Deploy to Cloudflare production
- Bump `package.json` version
- Run any command that touches the network without an explicit per-tick green light
- Run a slow command longer than 4 minutes within the 10-minute window
- Modify any 8 master strategy docs locked at commit `2b3e3fa`

Team 1 dev loop **MAY**:
- Read any file in repo
- Run smoke / verifier / build locally
- Edit `workers/lib/access-runtime.mjs`, scripts, package.json scripts entries, `src/data/*.json` non-locked, `src/static-pages/read.vetuonglai.com/`, gitignore, docs under `docs/team*/` and `docs/final-lock/VTL_7[2-9]*` only
- Commit local changes that pass `npm run verify:no-protected-books-in-git`
- Spawn parallel subagents (general/explore) for work units
- Update this doc and the 5-min Founder report log

## 2. Definition of Done — when this loop terminates

Loop stops only when ALL of the following are green AND Founder confirms:

| Signal | Acceptance |
|---|---|
| `npm run build` | exit 0 |
| `npm run check` | exit 0 |
| `npm run audit:bilingual` | 0 issues |
| `npm run smoke:access-runtime` | exit 0 (incl. `testBookContentEndpoint`) |
| `npm run verify:read:phase0` | 8/8 PASS |
| `npm run verify:read:book-publish-gate` | 18/18 PASS (15 original + 3 protected leak checks) |
| `npm run verify:no-protected-books-in-git` | exit 0 |
| `npm run verify:total-system:release-gate` | 10/10 PASS, `publish_ready=true`, blockers=[] |
| Step 4 reader page | live at `/books/<slug>/read/`, gated, server-rendered from `/api/access/books/content` |
| Step 5 PayOS book SKU metadata | `intent=book` + `book_slug` flow E2E tested in checkout-resolve smoke |
| Founder confirmation | explicit go from Founder for production deploy |

When all 11 signals are green, this loop exits and posts final Founder report.

## 3. Per-tick procedure (10 minutes)

Every tick, in order:

| Phase | Window | Action |
|---|---|---|
| T+0:00 → T+0:30 | Snapshot | Read latest reports/*.latest.json + git status. Log to `reports/team1-dev-loop.latest.json`. |
| T+0:30 → T+1:00 | Pick | From the queue (§4), pick highest-priority unblocked item. Mark in_progress. |
| T+1:00 → T+7:00 | Execute | Do the slice. May spawn up to 2 parallel subagents. Assistant reviews every output. |
| T+7:00 → T+8:30 | Verify | Run only the verifiers touching the modified files. NEVER run the full release-gate suite mid-tick (it takes >4 min). |
| T+8:30 → T+9:00 | Commit | If green and changes exist, commit with prefix `t1-loop(<step>):`. If red, revert work for the tick and report blocker. |
| T+9:00 → T+9:30 | Report | Append to `reports/team1-dev-loop.history.jsonl`. |
| T+9:30 → T+10:00 | Pause | Slack window. Next tick begins at T+10:00 only if no STOP signal. |

STOP signals (assistant must obey, no asking):
- `.autodev/STOP` exists
- `reports/team1-dev-loop.STOP` exists
- Founder text contains `STOP` or `DỪNG` (uppercase intentional)
- Any tick fails verifier 3 ticks in a row → auto-pause and ask Founder

## 4. Work queue (priority order)

Each item is a discrete slice that fits in one 10-minute tick.

### Already done (this session, before loop activation)
- Step 3a: `handleBookContent` handler + route wired
- Step 3b: `testBookContentEndpoint` smoke test added (12 assertions)
- Step 3c: `.gitignore` rule for `protected/read-books/*/content.json`
- Step 3d: `scripts/ensure-protected-content.mjs` (prebuild safety)
- Step 3e: `scripts/verify-no-protected-books-in-git.mjs` (release-gate hook)
- Step 3f: `content.placeholder.json` baseline created

### Queue
| ID | Title | Acceptance | Owner | Subagent? |
|---|---|---|---|---|
| L1 | Add `content.placeholder.json` to allowed-tracked list and stage it | `git ls-files protected/` shows placeholder + manifest + README only | Team 1 | no |
| L2 | Wire `verify:no-protected-books-in-git` into `verify:total-system:release-gate` step | step `no_protected_books_in_git` PASS in `team5-total-system-release-gate.latest.json` | Team 1 | no |
| L3 | Extend `verify-read-book-publish-gate.mjs` with 3 leak/manifest checks (subagent #2 from earlier — was interrupted) | 18/18 PASS, leak detection covers `body_*`, `experience_plan`, `ai_study_guide`, `final_*` | Team 1 + subagent | yes |
| L4 | Run full release-gate suite, capture evidence | 10/10 PASS, `publish_ready=true` | Team 1 | no |
| L5 | Commit Step 3 closure: `READ Step 3: protected content store + content endpoint + Founder no-github-books rule` | clean commit on local | Team 1 | no |
| L6 | Step 4: scaffold reader page `/books/tan-cung-mot-cuoc-song/read/` | static HTML shell with `data-requires-auth=member` and per-chapter slot | Team 1 + Team 2 subagent | yes |
| L7 | Step 4: client-side reader.js — fetch `/api/access/books/check`, then `/api/access/books/content?section=chapters&chapter=N` | renders body with no leak in static HTML; 401/403 routes user to login/purchase | Team 1 + subagent | yes |
| L8 | Step 4: smoke test `testReaderPage` (no auth → redirect, with entitlement → renders) | smoke green | Team 1 | no |
| L9 | Step 5: extend checkout-resolve to accept `intent=book` + `book_slug` | webhook + intent path tested via existing PayOS smoke | Team 1 | no |
| L10 | Step 5: book SKU price-tier from `read-books.json` flow | metadata carries book_slug to PayOS, captured back in webhook auto-grant | Team 1 | no |
| L11 | Pre-deploy dry run: `npm run cloudflare:deploy:preview` | preview URL probed 200, no protected leak | Team 1 | no |
| L12 | Final 10/10 release-gate run, evidence saved | reports/*.latest.json all green | Team 1 | no |
| L13 | Founder go/no-go gate for production | wait for explicit Founder approval | Founder | no |
| L14 | Production deploy | tagged + reported | Team 1 | no |

Each tick takes 1 item. Multiple parallel subagents may run within a tick if assistant supervises all outputs.

## 5. Anti-collision with editorial 15-min loop

| Conflict surface | Risk | Mitigation |
|---|---|---|
| Same `content.json` edit | high | Editorial owns the file, Team 1 NEVER touches it |
| `content.placeholder.json` edit | medium | Team 1 only edits schema-level fields (e.g. add new section type); body fields owned by editorial |
| `manifest.json` add/remove book | medium | Team 1 owns. Editorial proposes via doc, never directly. |
| `scripts/ensure-protected-content.mjs` | low | Team 1 only |
| `read-books.json` registry | low | Team 1 only |

If a tick detects an editorial-team in-flight edit on a Team 1-owned file (via `git status` showing M on owned file), Team 1 backs off, logs blocker, picks next item.

## 6. Reporting

Every tick writes one line to `reports/team1-dev-loop.history.jsonl`:

```json
{"tick":N,"started_at":"...","ended_at":"...","item_id":"L3","status":"green|blocked|skipped","commit":"<sha?>","verifiers":{"build":true,...},"notes":"..."}
```

Every 5 ticks (≈50 min), assistant produces a Founder summary:
- 5 ticks done, X items closed, Y items in progress, Z blockers
- Diff of release-gate signals vs previous summary
- Decision needed from Founder (if any)

If Founder is silent, loop continues. If Founder responds with anything that contains `STOP` or `DỪNG`, loop halts immediately.

## 7. Failure modes

| Mode | Trigger | Response |
|---|---|---|
| Build hangs | `prebuild` or `build.mjs` does not exit in 4 min | Kill PID, clean `dist/.build-lock`, log blocker, skip tick |
| Verifier fails | any of the 8 verifiers exit non-zero | Revert in-tick changes (`git checkout -- .`), log blocker, do NOT retry same item next tick |
| Subagent contradicts assistant review | output fails moderation | Discard subagent output, redo manually |
| Founder file conflict | `git status` shows founder editing a runtime file | Pause tick, message Founder, wait |
| Network timeout in verifier | flake | retry once. If second flake, mark `skip-for-now` and report. |

## 8. Exit conditions

Loop exits when:
1. §2 Definition of Done hits all 11 green
2. Founder explicitly says STOP / DỪNG
3. 3 consecutive ticks fail with same blocker (auto-pause for Founder decision)
4. Founder marks the loop complete

On exit, write final report to `reports/team1-dev-loop.exit.json` with full tick history summary.

---

**This document is the binding contract for the Team 1 dev loop. Any deviation must be recorded in the per-tick report.**
