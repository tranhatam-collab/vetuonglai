# VTL Internal PR Summary

**Date:** 2026-04-28  
**Scope:** Slice 2 system-fix execution  
**Status:** Ready for internal review  
**Owner:** Team 1

---

## Overview

Slice 2 focused on system integrity, public wording correctness, trust baseline, and READ Phase 0 bootstrap.

This round did not add marketplace, payout, wallet, or creator economy activation. It aligned the public system with reality:

- planned domains do not open checkout
- status labels are accurate and bilingual
- READ exists as a truthful Phase 0 reading shell
- SEO/trust baseline is present across dist-output domains
- kids accessibility baseline now includes reduced-motion and focus-visible

---

## Main Changes

### 1. Runtime and Access Safety

- Blocked checkout for planned domains in `workers/lib/access-runtime.mjs`
- Added `interest` as a valid non-purchase route intent in `src/data/access-model.json`
- Updated smoke coverage for planned-domain blocking and route normalization

### 2. Domain Registry and Public State Accuracy

- Standardized public state model to:
  - `live`
  - `member_preview`
  - `planned`
  - `bridge`
  - `external`
- Updated `src/data/system-registry.json`
- Updated `cloudflare/domain-runtime-truth.json`
- Corrected `edu` and `member` to `member_preview`

### 3. Content and Language Baseline

- Added missing bilingual site content blocks in `content/vi.json` and `content/en.json`
- Added missing app catalog entries in `src/data/apps.json`
- Localized public labels and status vocabulary to Vietnamese-first wording

### 4. READ Phase 0 Bootstrap

- Added READ Pages project and deployed production build to Pages
- Added READ static pack and content/data files
- Enforced Phase 0 wording:
  - public reading shell only
  - no checkout
  - no payout
  - no creator onboarding
- Tightened internal revenue split lock metadata to Phase 1+ only

### 5. SEO and Trust Baseline

- Added JSON-LD baseline to shared shell pages
- Added OG image baseline for all dist-output domains
- Backfilled OG/Twitter image meta into static `read` and `kids` pages

### 6. Kids Accessibility Remediation

- Added `prefers-reduced-motion` fallback in kids CSS/JS
- Added `:focus-visible` support in kids CSS
- Updated remediation lock doc to mark those items complete

### 7. Documentation and Governance

- Added Universal Standard lock doc
- Added subdomain meaning map
- Added current Team Admin report
- Added current Analyze report
- Added compliance overlays to VTL_67 / VTL_68 lock docs

---

## Commit Set

| Commit | Message |
|---|---|
| `e77d0bf` | Team 1: complete Slice 2 READ/status/SEO baseline |
| `641e0f3` | Team 1: finalize Slice 2 runtime gates and READ static pack |
| `f5dadf8` | Team 1: tighten READ phase-0 gating metadata |
| `98a333e` | Team 1: add universal standard lock and compliance overlays |
| `f847995` | Team 2: complete kids reduced-motion and focus-visible remediation |
| `e93ac4b` | Team 2: refine READ phase-0 wording on static collaboration pages |
| `eef127a` | Team 5: refresh parity report and kids remediation lock status |

---

## Verification

Executed successfully during this round:

- `npm run build`
- `npm run check`
- `node scripts/smoke-access-runtime.mjs`

Additional evidence:

- READ Pages deploy succeeded at `https://0e30add7.vetuonglai-read.pages.dev`
- READ project now exists in Cloudflare account `62d57eaa548617aeecac766e5a1cb98e`
- OG image meta confirmed on dynamic and static domain outputs
- JSON-LD baseline confirmed on shared-shell outputs

---

## Remaining Blocker

### READ Custom Domain

`read.vetuonglai.com` is not yet bound as a Pages custom domain.

Current state:

- project exists: `vetuonglai-read`
- deployment exists and is healthy
- `pages.dev` URL works
- custom domain binding still needs to be added in Cloudflare dashboard

Required next action:

1. Open Pages project `vetuonglai-read`
2. Add custom domain `read.vetuonglai.com`
3. Let Cloudflare create/verify the DNS mapping
4. Re-run DNS and HTTPS verification

---

## Risks

| Risk | Status | Note |
|---|---|---|
| READ publicly overclaiming creator economy readiness | Mitigated | Phase 0 wording locked down |
| Planned domains accidentally opening paid flow | Mitigated | Runtime 403 checkout block added |
| Kids accessibility gap | Mitigated | reduced-motion + focus-visible completed |
| READ custom domain not live yet | Open | Needs custom-domain binding |

---

## Rollback Notes

If rollback is required:

1. READ Pages deploy can be ignored without impacting main runtime domains
2. READ custom domain should not be announced until bound and verified
3. Planned-domain checkout block should remain in place even if READ work is paused
4. Kids accessibility changes are safe to keep and should not be rolled back

---

## Team Ownership

| Team | Ownership in this round |
|---|---|
| Team 1 | Runtime gates, READ bootstrap, state model, SEO baseline, deploy setup |
| Team 2 | Kids remediation, READ static wording refinements |
| Team 3 | Trust wording/parity review inputs, lock alignment |
| Team 4 | Contract surfaces remained in sync with existing runtime outputs |
| Team 5 | Verify/report refresh and release-gate evidence |

---

## Recommended Next Step

Bind `read.vetuonglai.com` to the `vetuonglai-read` Pages project, then run final live verification:

1. DNS resolve
2. HTTPS certificate issuance
3. homepage load
4. `/transparency/` load
5. `/how-we-pay/` load
