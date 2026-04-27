# READ_04 — Revenue Split Lock

## Quy tắc bất biến

Các con số dưới đây là **hardcoded constants** trong worker code, không phải config có thể đổi qua admin panel. Thay đổi yêu cầu:
1. PR công khai vào repo
2. Notify community 30 ngày trước
3. Update `READ_04` doc + `read.vetuonglai.com/how-we-pay/`

## Bảng phí cố định

| Khoản | % / Số | Khóa cứng ở |
|---|---|---|
| Platform operating fee | **15%** | `workers/lib/read-split.mjs:PLATFORM_FEE_BPS = 1500` |
| Payment processor fee | **0%** từ 2026-01-23 | PayOS free unlimited |
| Tax withholding (PIT bản quyền) | **5%** trên phần >10M VNĐ/contract | `read-split.mjs:PIT_RATE_BPS = 500` |
| Minimum payout threshold | **200.000 VNĐ** | `read-split.mjs:MIN_PAYOUT_VND = 200000` |

## Default split — sản phẩm có 1 author

```
Gross revenue (sách 199.000):  199.000 VNĐ
- Platform fee (15%):          -29.850 VNĐ
- Payment fee:                  0 VNĐ
- Net distributable:           169.150 VNĐ
  - Author (60% gross):        119.400 VNĐ
  - Bonus pool (~25% gross):    49.750 VNĐ
```

## Multi-role split — khi có nhiều người đóng góp

| Role | % default | Note |
|---|---|---|
| Author | 60% | Có thể giảm nếu chia với role khác |
| Translator | 10% | Chỉ áp khi sản phẩm là bản dịch |
| Editor | 5% | Trừ vào phần author |
| Designer | 3% | Cover/illustration — trừ vào author |
| Curator (bundle) | 5% của bundle | Chỉ áp ở Reading Stack |
| Referrer | 15% | 12 tháng đầu của reader, trừ tỷ lệ author + platform |
| Reviewer | flat 30k–100k VNĐ | Trả từ bonus pool, không trừ author |
| Sponsor | 0% nhận tiền | Nhận VC badge "Sponsor" |

## Ràng buộc bất biến

1. **Tổng % phải đúng 100%** sau khi đã trừ platform fee và tax
2. **Platform fee không bao giờ vượt 15%**
3. **Author không bao giờ nhận <50%** sau khi đã trừ tất cả role phụ
4. **Referrer commission cap 15%** trong vòng 12 tháng kể từ lần mua đầu của reader
5. **Bonus pool không vào account founder** — dùng cho editorial prize, translator bonus, referrer leaderboard, reserve

## Bonus pool allocation — quý

| Mục đích | % của bonus pool |
|---|---|
| Editorial prize tháng (essay xuất sắc) | 40% |
| Translator bonus | 20% |
| Referrer leaderboard | 20% |
| Reserve (chống biến động/refund spike) | 20% |

## Settlement cycle

- Cron: **mỗi thứ Hai 06:00 ICT (UTC+7)**
- Worker: `workers/settlement.mjs`
- Quy trình:
  1. Tính tổng earnings của mỗi creator trong tuần
  2. Trừ refund đã xảy ra (clawback)
  3. Nếu balance ≥ 200k VNĐ → tạo PayOS payout request
  4. Ghi tx_id vào ledger
  5. Send notification email/in-app
  6. Update public ledger (anonymized)

## Refund + clawback rules

| Tình huống | Xử lý |
|---|---|
| Reader refund <7 ngày, đọc <20% | Full refund, clawback 100% từ creator |
| Reader refund >7 ngày | Không refund |
| Đọc >20% | Không full refund (case-by-case) |
| Author bị ban (đạo văn, AI content) | Refund tất cả buyer, clawback toàn bộ earnings |
| Bot inflate reads | Freeze payout, manual review |

## Clawback nếu balance creator âm

- Nếu refund > earnings còn lại → balance âm
- Nợ này được trừ vào earnings tương lai
- Không truy thu tiền đã trả về creator (one-way settlement)
- Ledger ghi `clawback_balance` công khai (anonymized)
