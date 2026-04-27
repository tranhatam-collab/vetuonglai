# READ_12 — Dev File Manifest

## File mới phải tạo

### Static pages (Phase 1)
```
src/static-pages/read.vetuonglai.com/
├── index.html                          # Homepage
├── essays/
│   └── index.html                      # Essay archive
├── books/
│   └── index.html                      # Book catalog
├── stacks/
│   └── index.html                      # Reading Stacks
├── how-we-pay/
│   └── index.html                      # Revenue split formula
├── transparency/
│   ├── index.html                      # Public dashboard
│   ├── ledger/
│   │   └── index.html                  # Public ledger UI
│   └── reports/
│       └── index.html                  # Quarterly reports list
├── pillars/
│   ├── work/index.html
│   ├── money/index.html
│   ├── learning/index.html
│   ├── society/index.html
│   └── timeless/index.html
├── write/
│   ├── index.html                      # Become contributor
│   ├── apply/index.html                # Trial application
│   ├── guidelines/index.html           # Editorial standards
│   └── tiers/index.html                # Tier ladder
└── assets/
    ├── read.css
    └── read.js
```

### Worker scripts (Phase 2+)
```
workers/
├── read-checkout.mjs                   # PayOS checkout endpoint
├── read-webhook.mjs                    # PayOS payment webhook
├── settlement.mjs                      # Cron settlement worker
└── lib/
    ├── read-split.mjs                  # Split calculation (HARDCODED constants)
    ├── payos-payout.mjs                # PayOS chi-ho API
    ├── read-tax.mjs                    # Tax withholding logic
    └── read-ledger.mjs                 # Public ledger writer
```

### Build pipeline updates
```
scripts/build.mjs
  - Add `domains.read = "read.vetuonglai.com"`
  - Add `readPaths` constant
  - Add `renderReadHomePage()`, `renderReadEssaysPage()`, ...
  - Add to main domain rendering loop

scripts/check.mjs
  - Add `read.vetuonglai.com` to required dist check

scripts/audit-bilingual.mjs
  - Auto-includes new dist directory (no change)
```

### Verify scripts
```
scripts/
├── verify-read-runtime-truth.mjs       # Check stage matches features
├── verify-read-settlement.mjs          # Test cron locally
├── verify-read-tax-withholding.mjs     # Tax math check
├── verify-read-ledger-consistency.mjs  # Ledger sums match
└── generate-tax-report.mjs             # Quarterly tax report generator
```

### Data files
```
src/data/
├── read-pillars.json                   # 5 content pillars metadata
├── read-revenue-split-lock.json        # Public split formula (used by build.mjs to render)
└── read-tier-ladder.json               # 4-tier definition
```

### Cloudflare config
```
cloudflare/
├── pages-projects.json                 # Add `vetuonglai-read` project
├── workers-projects.json               # Add settlement, checkout workers
└── domain-runtime-truth.json           # Add read.vetuonglai.com row
```

### Docs to update
```
content/site-map.md                     # Add read entry
docs/20_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES.md  # Add read boundary
src/data/system-registry.json           # Add read domain entry
```

### Final lock
```
docs/final-lock/
└── VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md
```

## File hiện tại phải edit

| File | Thay đổi |
|---|---|
| `scripts/build.mjs` | Add domains.read, render functions, paths |
| `scripts/check.mjs` | Include read.vetuonglai.com |
| `cloudflare/pages-projects.json` | Add `vetuonglai-read` project entry |
| `cloudflare/domain-runtime-truth.json` | Add read entry với stage `planned_public` |
| `cloudflare/workers-projects.json` | Add `vetuonglai-read-settlement` worker (Phase 3) |
| `src/data/system-registry.json` | Add read domain |
| `src/data/apps.json` | Add read app entry |
| `content/site-map.md` | Add read role |
| `docs/20_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES.md` | Add read boundary section |
| `src/static-pages/vetuonglai.com/he-sinh-thai/index.html` | Add read card |
| Hub homepage `renderHubPage()` | Banner announce read subdomain |

## Naming convention

- Worker name: `vetuonglai-read`, `vetuonglai-read-settlement`, `vetuonglai-read-checkout`
- Pages project: `vetuonglai-read`
- D1 database: `vetuonglai-read-db`
- KV namespaces: `READ_DRAFTS_KV`, `READ_LEDGER_CACHE_KV`
- Secrets prefix: `READ_*`, `PAYOS_*`

## Acceptance criteria summary

| Phase | Acceptance |
|---|---|
| 1 | `read.vetuonglai.com` HTTP 200 + bilingual audit 0 |
| 2 | 1 real ebook sale + refund tested |
| 3 | 4 weeks auto-payout to owner |
| 4 | 3 contributors + multi-role split working |
| 5 | Translator/Designer/Referrer payout end-to-end |
| 6 | Reading Stack live |
| 7 | Sponsor + quarterly vote live |
