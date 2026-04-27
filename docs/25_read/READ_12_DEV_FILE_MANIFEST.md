# READ_12 — Dev File Manifest

## File mới phải tạo

### Static pages (Phase 0)
```
src/static-pages/read.vetuonglai.com/
├── index.html                          # Homepage
├── essays/index.html                   # Essay archive
├── books/index.html                    # Book catalog
├── how-we-pay/index.html               # Revenue split policy
├── transparency/index.html             # Public transparency page
├── creator/index.html                  # Creator system explainer
├── submit/index.html                   # Submit essay/article
├── review/index.html                   # Editorial review explainer
├── stacks/index.html                   # Reading Stacks
├── terms/index.html                    # Legal terms page
├── tax-note/index.html                 # Tax note / legal-safe disclaimer
└── assets/
    ├── read.css
    └── read.js
```

### Worker scripts (later phases)
```
workers/
├── read-checkout.mjs                   # Checkout endpoint
├── read-webhook.mjs                    # Payment webhook
├── settlement.mjs                      # Weekly settlement worker
└── lib/
    ├── read-split.mjs                  # Split calculation with versioned config
    ├── provider-payout.mjs             # Provider payout abstraction
    ├── read-tax.mjs                    # Tax withholding logic
    └── read-ledger.mjs                 # Anonymized ledger writer
```

### Build pipeline updates
```
scripts/build.mjs
  - Add `domains.read = "read.vetuonglai.com"`
  - Add read paths and renderers
  - Add to main domain rendering loop

scripts/check.mjs
  - Add `read.vetuonglai.com` to required dist check

scripts/audit-bilingual.mjs
  - Auto-includes new dist directory (no change expected)
```

### Verify scripts
```
scripts/
├── verify-read-runtime-truth.mjs
├── verify-read-settlement.mjs
├── verify-read-tax-withholding.mjs
├── verify-read-ledger-consistency.mjs
└── generate-tax-report.mjs
```

### Data files
```
src/data/
├── read-pillars.json
├── read-revenue-split-lock.json
├── read-tier-ladder.json
└── read-legal-safe-copy.json
```

### Cloudflare config
```
cloudflare/
├── pages-projects.json                 # Add `vetuonglai-read` project
├── workers-projects.json               # Add read workers when runtime phases open
└── domain-runtime-truth.json           # Add read.vetuonglai.com row
```

### Docs to update
```
content/site-map.md
docs/20_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES.md
src/data/system-registry.json
src/data/apps.json
```

### Final lock
```
docs/final-lock/
└── VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md
```

### Team handoff pack
```
docs/25_read/
├── READ_VETUONGLAI_CREATOR_ECONOMY_MASTER_SPEC.md
├── READ_CREATOR_01_MASTER_SPEC.md
├── READ_CREATOR_02_REVENUE_SPLIT_AND_LEDGER_MODEL.md
├── READ_CREATOR_03_ONBOARDING_KYC_TAX_FLOW.md
├── READ_CREATOR_04_EDITORIAL_REVIEW_AND_ANTI_FRAUD_POLICY.md
├── READ_CREATOR_05_PAYMENT_CHECKOUT_AND_SETTLEMENT_SPEC.md
├── READ_CREATOR_06_PUBLIC_TRANSPARENCY_PAGE_SPEC.md
├── READ_CREATOR_07_DASHBOARD_UI_SPEC.md
└── READ_CREATOR_08_LEGAL_TERMS_AND_TAX_NOTES_DRAFT.md
```

## File hiện tại phải edit

| File | Thay đổi |
|---|---|
| `scripts/build.mjs` | Add domains.read, render functions, paths |
| `scripts/check.mjs` | Include read.vetuonglai.com |
| `cloudflare/pages-projects.json` | Add `vetuonglai-read` project entry |
| `cloudflare/domain-runtime-truth.json` | Add read entry với stage `planned_public` |
| `cloudflare/workers-projects.json` | Add read workers when runtime phases open |
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
- Secrets prefix: `READ_*`, `PAYOS_*`, `PROVIDER_*`

## Acceptance criteria summary

| Phase | Acceptance |
|---|---|
| 0 | `read.vetuonglai.com` HTTP 200 + bilingual audit pass |
| 1 | 1 owner ebook sale + refund tested |
| 2 | author monetization + onboarding + KYC flow working |
| 3 | translator/editor/designer split + weekly settlement pass |
| 4 | referrer + curator stacks + anonymized transparency live |
