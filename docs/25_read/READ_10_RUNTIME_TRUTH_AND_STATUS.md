# READ_10 — Runtime Truth and Status

## Stage definition

`read.vetuonglai.com` runtime truth có 4 stage cho phép:

| Stage | Nghĩa |
|---|---|
| `planned_public` | DNS có, shell có, KHÔNG có monetization, KHÔNG có checkout |
| `member_preview` | Có monetization cho founder/owner, chưa mở cho contributor khác |
| `live` | Mở contributor onboarding, tất cả role kiếm tiền được |
| `live_full` | Phase 6+: Curator + Sponsor đầy đủ |

## Status badges trên public pages

```
Stage hiện tại: planned_public
└── Banner: "Đang chuẩn bị shell — chưa bán, chưa nhận đóng góp."

Stage member_preview
└── Banner: "Đã mở mua sách. Đang chuẩn bị mở cho cộng đồng đóng góp."

Stage live
└── Banner: "Mở cho mọi người đóng góp. Xem tier ladder tại /write/tiers/"

Stage live_full
└── Không banner — full feature
```

## Khi nào được promote stage

### planned_public → member_preview
- [ ] Static shell deploy pass
- [ ] PayOS checkout integration tested
- [ ] Owner đã upload 1 ebook
- [ ] Refund flow tested
- [ ] Audit bilingual pass

### member_preview → live
- [ ] Contributor onboarding flow live
- [ ] Tax compliance verified by external accountant
- [ ] Settlement cron tested 4 weeks consecutive
- [ ] PayOS chi-ho integration tested with real payouts
- [ ] Public ledger live và verifiable
- [ ] Quarterly report process tested

### live → live_full
- [ ] Curator role onboarded
- [ ] Reading Stack feature live
- [ ] Sponsor flow live
- [ ] Community vote on bonus pool tested

## Verify commands

```bash
# Stage check
node scripts/verify-read-runtime-truth.mjs

# Settlement dry-run
node scripts/verify-read-settlement.mjs --dry-run

# Tax withholding correctness
node scripts/verify-read-tax-withholding.mjs --quarter Q1-2026

# Public ledger consistency
node scripts/verify-read-ledger-consistency.mjs

# Bilingual audit on read pages
node scripts/audit-bilingual.mjs
```

## Domain runtime truth row

`cloudflare/domain-runtime-truth.json` add:

```json
{
  "host": "read.vetuonglai.com",
  "stage": "planned_public",
  "label_vi": "Đang chuẩn bị shell — chưa bán, chưa nhận đóng góp",
  "label_en": "Shell in preparation — not selling, not accepting contributions yet",
  "owner_team": "team1",
  "promoted_when": [
    "static shell deploy pass",
    "checkout flow tested",
    "owner uploaded first ebook"
  ]
}
```

## Stop-line wording — không được dùng trên read public

- "Live" cho domain khi stage = `planned_public` hoặc `member_preview`
- "Đang nhận đóng góp" khi `live` chưa được ký
- "Trả creator" khi chưa có settlement run thật
- "Public ledger live" khi ledger chưa có entry thật
