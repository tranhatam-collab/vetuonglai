# Vetuonglai Investor Package — 2026-05-22

> **STRICTLY CONFIDENTIAL** — for authorized recipients only.
> Distribute only with founder consent. Watermark or NDA required for external sharing.

---

## What's in this folder

Two parallel language sets — same content, native rendering.

### `EN/` — English (for international investors and partners)

| # | File | Format | Purpose |
|---|------|--------|---------|
| 01 | Executive-Summary | DOCX + PDF | One-pager: the opportunity, ask, returns |
| 02 | Company-Profile | DOCX + PDF | Detailed business introduction (16 subdomains, tech stack, revenue streams) |
| 03 | Market-Analysis-Potential | DOCX + PDF | TAM/SAM/SOM + 5-year geographic expansion |
| 04 | Investment-Thesis-Strategy | DOCX + PDF | Why now, moats, development strategy, risk |
| 05 | Financial-Projections-5Y | XLSX | 8 sheets: assumptions, revenue model, P&L, cash flow, KPI, valuation, scenarios |
| 06 | Valuation-Report | DOCX + PDF | Methodology, sensitivity, comparable transactions |
| 07 | Investor-Pitch-Deck | PPTX | 16-slide investor presentation |
| 08 | Shareholder-Annual-Report | DOCX + PDF | Operating review, risk register, FY2027 outlook |

### `VI/` — Tiếng Việt (cho đối tác Việt Nam và cổ đông)

| # | Tệp | Định dạng | Mục đích |
|---|-----|-----------|----------|
| 01 | Tom-Tat-Dieu-Hanh | DOCX + PDF | Một trang: cơ hội, kêu gọi, lợi nhuận |
| 02 | Ho-So-Doanh-Nghiep | DOCX + PDF | Giới thiệu doanh nghiệp chi tiết |
| 03 | Phan-Tich-Thi-Truong-Tiem-Nang | DOCX + PDF | TAM/SAM/SOM + mở rộng địa lý 5 năm |
| 04 | Luan-Diem-Dau-Tu-Chien-Luoc | DOCX + PDF | Vì sao bây giờ, moat, chiến lược, rủi ro |
| 05 | Du-Bao-Tai-Chinh-5N | XLSX | 8 sheet: giả định, doanh thu, P&L, dòng tiền, KPI, định giá, kịch bản |
| 06 | Bao-Cao-Dinh-Gia | DOCX + PDF | Phương pháp, nhạy cảm, giao dịch tham chiếu |
| 07 | Pitch-Deck-Nha-Dau-Tu | PPTX | Pitch deck 16-slide cho nhà đầu tư |
| 08 | Bao-Cao-Co-Dong-Thuong-Nien | DOCX + PDF | Tổng kết hoạt động, sổ rủi ro, triển vọng năm 2027 |

---

## Headline numbers

| | 2026 (Y1) | 2027 (Y2) | 2028 (Y3) | 2029 (Y4) | 2030 (Y5) |
|---|---|---|---|---|---|
| **Revenue (USD M)** | 0.8 | 4.2 | 14.5 | 42.0 | 98.0 |
| **Paid members** | 12,000 | 55,000 | 220,000 | 620,000 | 1,650,000 |
| **Gross margin** | 72% | 76% | 78% | 80% | 81% |
| **Valuation mid (USD M)** | 11 | 40 | 108 | 265 | 615 |

**Series Seed ask:** USD 3.0M at USD 11M post-money. Pre-dilution MOIC range: **12.5x (Bear) → 43.9x (Base) → 82.0x (Bull)** by Y5.

---

## Reading order (recommended)

1. **`01-Executive-Summary`** — 5 min orientation
2. **`07-Investor-Pitch-Deck`** — 20 min walkthrough (16 slides)
3. **`05-Financial-Projections-5Y`** — open in Excel/Google Sheets; modify blue cells to test scenarios
4. **`06-Valuation-Report`** — methodology + sensitivity + comparables
5. **`02-Company-Profile`** — for deeper technical diligence
6. **`03-Market-Analysis-Potential`** — for market-sizing diligence
7. **`04-Investment-Thesis-Strategy`** — strategic and risk
8. **`08-Shareholder-Annual-Report`** — for existing shareholders / governance review

---

## File generation tooling

- DOCX: Node.js + `docx` library (Microsoft Word-native format)
- XLSX: Python + `openpyxl` with industry-standard color coding (blue inputs / black formulas / green links)
- PPTX: Node.js + `pptxgenjs` (Midnight Executive palette — navy/ice/gold)
- PDF: Python + `python-docx` + `reportlab` with Arial Unicode for full Vietnamese diacritic support

All files generated 2026-05-22. Source content lives in version control inside the repo.

---

## Contact

**Founder Q&A and term sheet review:**

- Email: invest@vetuonglai.com
- Web: https://vetuonglai.com
- Founder: Trần Hà Tâm

---

*This package is generated from the production codebase at `vetuonglai-system` repository, commit-tagged for verifiability. Live production endpoints (e.g., `https://vetuonglai.com/api/notify/health`) are available for technical due diligence on request.*
