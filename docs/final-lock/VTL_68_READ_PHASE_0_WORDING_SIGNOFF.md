# VTL_68 — READ Phase 0 Wording Signoff

**Directive:** VTL_68  
**Date:** 2026-04-28  
**Signed by:** Team 3 — Governance / Trust / Legal  
**Scope:** All public-facing copy on `read.vetuonglai.com` (Phase 0 shell)

---

## Purpose

This document confirms that all visible text on the READ Phase 0 public shell has been audited against:

1. **VTL_67** — READ Creator Economy Lock (banned phrases, stop-lines, legal-safe framing)
2. **`banned-terms-public.json`** — 8 system-wide banned terms
3. **`read-public-copy.json`** — Approved copy blocks extracted from VTL_67

---

## Pages Audited

| Route | File | Status |
|---|---|---|
| `/` | `index.html` | PASS |
| `/books/` | `books/index.html` | PASS |
| `/creator/` | `creator/index.html` | PASS |
| `/essays/` | `essays/index.html` | PASS |
| `/how-we-pay/` | `how-we-pay/index.html` | PASS |
| `/pillars/` | `pillars/index.html` | PASS |
| `/review/` | `review/index.html` | PASS |
| `/stacks/` | `stacks/index.html` | PASS |
| `/submit/` | `submit/index.html` | PASS |
| `/tax-note/` | `tax-note/index.html` | PASS |
| `/terms/` | `terms/index.html` | PASS |
| `/transparency/` | `transparency/index.html` | PASS |
| `/write/` | `write/index.html` | PASS |

---

## Checks Performed

### 1. Banned Phrases (VTL_67 Section: Stop-Lines)

| Phrase | Found? |
|---|---|
| `ai cũng kiếm tiền` | NO |
| `thu nhập thụ động` | NO |
| `đảm bảo được trả` | NO |
| `PayOS miễn phí vĩnh viễn` | NO |
| `platform khấu trừ đúng mọi loại thuế` | NO |

### 2. Banned Terms (banned-terms-public.json)

| Term | Found in visible text? |
|---|---|
| `planned-safe` | NO |
| `CTA` | NO |
| `i18n` | NO |
| `route kỹ thuật` | NO |
| `runtime` | NO |
| `deploy` | NO |
| `smoke` | NO |
| `entry point` | NO |

### 3. Stop-Line Compliance

| Stop-line | Status |
|---|---|
| No "Live" label when stage = planned_public | PASS — stage banner says "Đang chuẩn bị" |
| No "Đang nhận đóng góp" | PASS — no contribution intake active |
| No "Trả creator" | PASS — no settlement claims |
| No "Public ledger live" | PASS — transparency page uses aggregate/anonymized framing |

### 4. Legal-Safe Framing

- No MMO framing detected
- No guaranteed payout claims
- No fixed tax rate claims without disclaimer
- Revenue split numbers NOT exposed on any Phase 0 page (locked in `read-revenue-split-lock.json` with `legalSafeMode: true`)
- All transparency wording uses "minh bạch tổng hợp" / "dữ liệu đã ẩn danh" framing

---

## Automated Verification

```
npm run build                       → PASS
npm run check                       → PASS
npm run verify:read:phase0          → 8/8 PASS
Banned-term scan (all dist HTML)    → 0 leaks
```

---

## Conclusion

All READ Phase 0 pages are **APPROVED** for public deployment. No governance violations found. Copy aligns with VTL_67 lock constraints.

This signoff covers Phase 0 only. Any Phase 1+ copy (monetization, checkout, payout, creator onboarding) requires a separate signoff after legal review.

---

**Signoff:** Team 3 Governance  
**Gate:** `READ_PHASE_0_WORDING_SIGNOFF = PASS`  
**Valid until:** Phase 1 activation or next VTL directive, whichever comes first
