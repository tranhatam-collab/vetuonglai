# READ_08 — Transparency and Public Ledger

## Triết lý
Đây là khác biệt mạnh nhất so với mọi creator platform Việt khác. Mọi đồng tiền chảy qua hệ phải có thể kiểm chứng — không cần tin lời founder.

## 3 lớp transparency

### Lớp 1: Real-time aggregated metrics
**Endpoint:** `GET /api/transparency.json` (public, cache 1 hour)

```json
{
  "as_of": "2026-04-28T12:00:00Z",
  "lifetime": {
    "total_gross_vnd": 1234567890,
    "total_paid_to_creators_vnd": 1049382706,
    "total_platform_kept_vnd": 185185184,
    "total_tax_withheld_vnd": 6172839,
    "platform_take_rate_actual_pct": 14.99,
    "creator_count_paid": 47
  },
  "this_month": {
    "gross_vnd": 12345670,
    "paid_to_creators_vnd": 10493827,
    "platform_kept_vnd": 1851851,
    "active_creators": 12,
    "median_creator_earning_vnd": 245000,
    "top_creator_earning_vnd_anonymized": 1850000
  },
  "this_week": {
    "settlement_run": "2026-04-28T06:00:00+07:00",
    "payouts_sent_count": 9,
    "payouts_sent_total_vnd": 4250000,
    "pending_below_threshold_count": 23,
    "pending_below_threshold_total_vnd": 1875000
  }
}
```

### Lớp 2: Public ledger (anonymized, real-time)
**Endpoint:** `GET /api/ledger.json?limit=100&since=<iso>`

Page UI: `/transparency/ledger/`

```json
{
  "entries": [
    {
      "ts": "2026-04-28T06:03:14Z",
      "type": "payout_sent",
      "amount_vnd": 1250000,
      "role": "author",
      "hash_anon": "a3f9b7e2c1d5..."
    },
    {
      "ts": "2026-04-28T06:03:15Z",
      "type": "payout_sent",
      "amount_vnd": 342000,
      "role": "translator",
      "hash_anon": "b8e2d1c5..."
    },
    {
      "ts": "2026-04-28T06:03:16Z",
      "type": "order_paid",
      "amount_vnd": 199000,
      "hash_anon": "c1d5a3f9..."
    }
  ],
  "verifiable_total_vnd": 1791000,
  "next_cursor": "..."
}
```

**Kiểm chứng:**
- Sum `payout_sent` lifetime = `total_paid_to_creators_vnd` trong metrics
- Sum `order_paid` - sum `refund` lifetime = `total_gross_vnd`
- User KHÔNG thấy ai nhận tiền, NHƯNG thấy mọi giao dịch có amount + timestamp

### Lớp 3: Quarterly signed report
**File:** `reports/transparency/Q<n>-<year>.json` (committed vào public repo)

```json
{
  "quarter": "Q1-2026",
  "signed_by": "founder",
  "signed_at": "2026-04-05T00:00:00Z",
  "signature_sha256": "...",
  "totals": {
    "gross_revenue_vnd": 50000000,
    "creator_paid_vnd": 42500000,
    "platform_kept_vnd": 7500000,
    "tax_withheld_vnd": 250000,
    "tax_remitted_to_state_proof_url": "https://..."
  },
  "platform_kept_breakdown": {
    "infrastructure_vnd": 2000000,
    "ops_salary_vnd": 3000000,
    "community_fund_vnd": 1500000,
    "reserve_vnd": 1000000
  },
  "violations": [
    { "type": "ai_content", "count": 1, "action": "ban_and_refund" }
  ],
  "new_contributors": 12,
  "tier_progression": {
    "trial_to_active": 4,
    "active_to_trusted": 1
  }
}
```

## Hash anonymization

```javascript
// Hash that allows verification without revealing identity
async function ledgerHash(env, contributorId, orderId, role) {
  const input = `${contributorId}|${orderId}|${role}|${env.READ_LEDGER_HASH_SALT}`;
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
```

- Salt rotated annually → old entries vẫn verify được, new entries dùng salt mới
- Creator có thể yêu cầu xem hash của mình (proof of payment)
- Bất kỳ ai cũng có thể tải full ledger từ `/api/ledger.json?limit=10000`

## Public dashboard UI

**Page:** `/transparency/`

```
┌────────────────────────────────────────────────────────────┐
│  Tháng này                                                 │
│  ─────────────                                             │
│  Doanh thu cộng đồng:        12.345.670 VNĐ                │
│  Trả creator:                10.493.827 VNĐ (85.0%)        │
│  Platform giữ:                1.851.851 VNĐ (15.0%)        │
│  Đã nộp thuế thay:                6.172 VNĐ                │
│                                                            │
│  Số creator được trả:        12 người                      │
│  Median earning:             245.000 VNĐ                   │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  Public ledger (live, anonymized)                          │
│  ────────────────────────────────                          │
│  06:03  payout_sent    author       1.250.000  ✓          │
│  06:03  payout_sent    translator     342.000  ✓          │
│  06:04  order_paid                    199.000  ✓          │
│  ...                                                       │
│  [Tải full ledger CSV] [Verify total]                      │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  Quarterly reports (signed)                                │
│  ────────────────────────                                  │
│  Q1-2026 [PDF] [JSON] — đã ký, đã commit vào git           │
│  Q4-2025 [PDF] [JSON]                                      │
└────────────────────────────────────────────────────────────┘
```

## Verifiability checklist

Mọi reader có thể tự verify:

- [ ] `sum(payout_sent) lifetime == total_paid_to_creators_vnd`?
- [ ] `total_paid + total_kept + total_tax == total_gross`?
- [ ] `platform_take_rate <= 15%`?
- [ ] Quarterly report đã commit vào git public?
- [ ] Tax remitted proof URL accessible?
- [ ] Hash của order đã mua khớp với ledger?

Nếu bất kỳ check nào fail → community report → editor council review.
