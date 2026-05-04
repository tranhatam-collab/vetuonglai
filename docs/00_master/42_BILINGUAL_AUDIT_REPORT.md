# 42 — Bilingual Audit Report

Generated: 2026-05-04 (informational; not a build gate)

Scope: `dist/` (86 HTML files across 16 hosts)

Reference: [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md)

## Summary

- Total issues: 0
- Files scanned: 86

### Issues by code

| Code | Count |
| --- | ---: |

### Issues by host

| Host | Files | Issues |
| --- | ---: | ---: |
| `ai.vetuonglai.com` | 2 | 0 |
| `business.vetuonglai.com` | 1 | 0 |
| `community.vetuonglai.com` | 2 | 0 |
| `docs.vetuonglai.com` | 17 | 0 |
| `edu.vetuonglai.com` | 11 | 0 |
| `finance.vetuonglai.com` | 1 | 0 |
| `green.vetuonglai.com` | 1 | 0 |
| `invest.vetuonglai.com` | 1 | 0 |
| `kids.vetuonglai.com` | 2 | 0 |
| `life.vetuonglai.com` | 1 | 0 |
| `market.vetuonglai.com` | 2 | 0 |
| `member.vetuonglai.com` | 6 | 0 |
| `read.vetuonglai.com` | 24 | 0 |
| `vc.vetuonglai.com` | 4 | 0 |
| `vetuonglai.com` | 9 | 0 |
| `work.vetuonglai.com` | 2 | 0 |

## Top 30 files by issue count

| File | Issues | Codes |
| --- | ---: | --- |

## Detail (high-severity only)

## Notes

- Audit is informational. Re-run with `node scripts/audit-bilingual.mjs` after fixes.
- High-severity codes block live launch per the bilingual rebuild command.
- Kids-specific rule: no abbreviation at all — "AI" → "Trợ lý học", "VC" → "lớp xác minh độc lập".
