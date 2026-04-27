# READ_03 — Information Architecture

## Site map

```
read.vetuonglai.com/
├── /                              # Homepage (essay highlights + book carousel + transparency banner)
├── /essays/                       # Essay archive — list, filter by pillar
│   └── /essays/<slug>/            # Per-essay long-form page
├── /books/                        # Book catalog — list, sort by date/topic
│   └── /books/<slug>/             # Book detail (preview + buy)
├── /stacks/                       # Reading Stacks (curated bundles)
│   └── /stacks/<slug>/            # Stack detail
├── /pillars/                      # 5 content pillars
│   ├── /pillars/work/
│   ├── /pillars/money/
│   ├── /pillars/learning/
│   ├── /pillars/society/
│   └── /pillars/timeless/
├── /how-we-pay/                   # Public revenue split formula
├── /transparency/                 # Public ledger + quarterly reports
│   ├── /transparency/ledger/      # Real-time anonymized ledger
│   └── /transparency/reports/     # Quarterly Q1, Q2, Q3, Q4
├── /write/                        # Become a contributor
│   ├── /write/apply/              # Trial application
│   ├── /write/guidelines/         # Editorial standards
│   └── /write/tiers/              # Tier ladder explained
├── /me/                           # Logged-in contributor area
│   ├── /me/earnings/              # Earnings dashboard
│   ├── /me/drafts/                # Submitted drafts
│   └── /me/payouts/               # Payout history
└── /api/
    ├── /api/health
    ├── /api/essays.json
    ├── /api/books.json
    ├── /api/transparency.json     # Aggregated metrics
    └── /api/ledger.json           # Anonymized public ledger
```

## 5 Content pillars (rõ ràng, không overlap)

| Pillar | Vai | Khác gì với domain khác |
|---|---|---|
| `work` | Tương lai công việc — AI, kỹ năng, ý nghĩa | Không phải khoá `edu`, không phải job board `work` domain |
| `money` | Tiền và thời gian — pattern dài hạn | Không phải checklist `finance`, không phải due-diligence `invest` |
| `learning` | Cách học thật sự — meta về tri thức | Không phải curriculum `edu` |
| `society` | Cộng đồng, ý nghĩa, kết nối | Không phải circles `community` |
| `timeless` | Những gì không thay đổi — pattern hành vi | Không có ở domain nào khác |

## Navigation hierarchy

### Top nav (4 mục, không hơn)
1. Essays
2. Books
3. Stacks
4. How we pay

### Footer (3 cột)
- **Đọc**: Essays / Books / Stacks / Pillars
- **Đóng góp**: Write / Tiers / Guidelines
- **Minh bạch**: How we pay / Public ledger / Quarterly reports
