# 42 — Bilingual Audit Report

Generated: 2026-04-28 (informational; not a build gate)

Scope: `dist/` (74 HTML files across 16 hosts)

Reference: [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md)

## Summary

- Total issues: 29
- Files scanned: 74

### Issues by code

| Code | Count |
| --- | ---: |
| image-empty-alt | 29 |

### Issues by host

| Host | Files | Issues |
| --- | ---: | ---: |
| `ai.vetuonglai.com` | 2 | 2 |
| `business.vetuonglai.com` | 1 | 0 |
| `community.vetuonglai.com` | 2 | 2 |
| `docs.vetuonglai.com` | 9 | 0 |
| `edu.vetuonglai.com` | 11 | 7 |
| `finance.vetuonglai.com` | 1 | 0 |
| `green.vetuonglai.com` | 1 | 0 |
| `invest.vetuonglai.com` | 1 | 0 |
| `kids.vetuonglai.com` | 2 | 0 |
| `life.vetuonglai.com` | 1 | 0 |
| `market.vetuonglai.com` | 2 | 2 |
| `member.vetuonglai.com` | 4 | 3 |
| `read.vetuonglai.com` | 22 | 0 |
| `vc.vetuonglai.com` | 4 | 3 |
| `vetuonglai.com` | 9 | 8 |
| `work.vetuonglai.com` | 2 | 2 |

## Top 30 files by issue count

| File | Issues | Codes |
| --- | ---: | --- |
| `ai.vetuonglai.com/index.html` | 1 | image-empty-alt |
| `ai.vetuonglai.com/use-cases/index.html` | 1 | image-empty-alt |
| `community.vetuonglai.com/index.html` | 1 | image-empty-alt |
| `community.vetuonglai.com/principles/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/courses/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/green-stewardship-pilot/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/green-stewardship-pilot/player/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/money-discipline-sprint/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/money-discipline-sprint/player/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/startup-1000/index.html` | 1 | image-empty-alt |
| `edu.vetuonglai.com/learn/startup-1000/player/index.html` | 1 | image-empty-alt |
| `market.vetuonglai.com/index.html` | 1 | image-empty-alt |
| `market.vetuonglai.com/rules/index.html` | 1 | image-empty-alt |
| `member.vetuonglai.com/app/offline/index.html` | 1 | image-empty-alt |
| `member.vetuonglai.com/index.html` | 1 | image-empty-alt |
| `member.vetuonglai.com/journey/index.html` | 1 | image-empty-alt |
| `vc.vetuonglai.com/issuers/index.html` | 1 | image-empty-alt |
| `vc.vetuonglai.com/methods/index.html` | 1 | image-empty-alt |
| `vc.vetuonglai.com/v/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/bat-dau/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/he-sinh-thai/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/lien-he/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/sitemap/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/thanh-vien/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/tin-tuc/index.html` | 1 | image-empty-alt |
| `vetuonglai.com/ve-chung-toi/index.html` | 1 | image-empty-alt |
| `work.vetuonglai.com/brief/index.html` | 1 | image-empty-alt |
| `work.vetuonglai.com/index.html` | 1 | image-empty-alt |

## Detail (high-severity only)

## Notes

- Audit is informational. Re-run with `node scripts/audit-bilingual.mjs` after fixes.
- High-severity codes block live launch per the bilingual rebuild command.
- Kids-specific rule: no abbreviation at all — "AI" → "Trợ lý học", "VC" → "lớp xác minh độc lập".
