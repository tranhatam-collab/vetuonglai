# READ_07 — Tax Compliance (Vietnam)

## Cơ sở pháp lý

Theo các văn bản hiệu lực 2025–2026:
- Luật Thuế TNCN 2007 (sửa đổi 2012, 2014, 2024)
- Nghị định 117/2025 về sàn TMĐT khấu trừ thuế thay (hiệu lực 1/7/2025)
- Thông tư hướng dẫn của Bộ Tài chính về bản quyền

## Nghĩa vụ của platform `read.vetuonglai.com`

Theo nghị định mới (1/7/2025), sàn nội dung có chức năng thanh toán **bắt buộc**:
1. Khấu trừ tại nguồn PIT trước khi trả creator
2. Báo cáo quý cho cơ quan thuế danh sách đã khấu trừ
3. Cấp chứng từ khấu trừ cho creator để khai quyết toán

## Loại thu nhập và mức thuế

### A. Thu nhập từ bản quyền (royalty)

| Mức thu nhập (per contract) | Thuế |
|---|---|
| ≤ 10.000.000 VNĐ | Miễn thuế PIT |
| > 10.000.000 VNĐ | 5% trên phần vượt |

**Quy ước "contract" trong `read`:** mỗi sản phẩm (book/essay/stack) = 1 contract giữa creator và platform. Nếu cùng creator có 2 sách, mỗi sách tính riêng.

### B. Thu nhập từ dịch vụ (translator/editor/designer fee)

| Loại | VAT | PIT |
|---|---|---|
| Cá nhân không HKD | 0 | 10% (thu nhập vãng lai) |
| Cá nhân có HKD | 5% | 2% |

**Lưu ý:** Translator/Editor/Designer trong `read` được coi là dịch vụ → khấu trừ 10% PIT nếu chưa đăng ký HKD.

### C. Thu nhập của HKD (hộ kinh doanh) đã đăng ký

| Mức doanh thu/năm | Thuế |
|---|---|
| ≤ 100M (2025) | Miễn |
| ≤ 500M (từ 2026) | Miễn |
| > ngưỡng | VAT 1% (goods) hoặc 5% (services) + PIT 0.5% (goods) hoặc 2% (services) |

## Onboarding tax info bắt buộc (Tier 2 trở lên)

Tại `member.vetuonglai.com/me/tax-profile/`:

```json
{
  "national_id_encrypted": "...",         // CCCD encrypted
  "national_id_last4": "1234",            // for display
  "tax_id": "0123456789",                 // optional, MST cá nhân
  "is_household_business": false,         // có HKD không
  "household_business_id": null,          // mã HKD nếu có
  "bank_account_number": "...",
  "bank_code": "VCB",
  "bank_account_holder": "NGUYEN VAN A",  // must match CCCD name
  "consent_withhold_at_source": true,     // bắt buộc true
  "consent_at": "2026-04-28T10:00:00Z"
}
```

## Withholding logic

```
function calculatePIT(grossVnd, role, isHKD) {
  if (role === "author") {
    // Royalty: 5% on amount > 10M
    const taxable = Math.max(0, grossVnd - 10_000_000);
    return Math.round(taxable * 0.05);
  }
  if (["translator", "editor", "designer", "reviewer"].includes(role)) {
    if (!isHKD) {
      // Vãng lai: 10% flat (theo nghị định)
      // BUT: Nghị định 1/7/2025 cho phép platform giữ lại tỷ lệ này
      return Math.round(grossVnd * 0.10);
    }
    // HKD: 2% PIT
    return Math.round(grossVnd * 0.02);
  }
  if (role === "referrer") {
    // Hoa hồng: same as service vãng lai
    return Math.round(grossVnd * 0.10);
  }
  return 0;
}
```

## Quarterly report (Q1, Q2, Q3, Q4)

Mỗi quý, `scripts/generate-tax-report.mjs` tạo:

1. **Báo cáo nội bộ** → cơ quan thuế (CSV format chuẩn TCT)
2. **Báo cáo per-creator** → email PDF với:
   - Tổng thu nhập 3 tháng
   - Tổng PIT đã khấu trừ
   - Số chứng từ khấu trừ (cho creator quyết toán cá nhân)
3. **Public summary** → `read.vetuonglai.com/transparency/reports/<quarter>/`
   - Tổng PIT đã nộp NSNN
   - Số creator đã khấu trừ
   - Không tiết lộ identity

## Cuối năm (annual)

- Mỗi creator nhận file PDF "Chứng nhận khấu trừ thuế năm 2026"
- Có thể dùng để khai quyết toán PIT cá nhân cuối năm
- Format: theo mẫu TT 80/2021/TT-BTC

## Risk mitigation

| Rủi ro | Mitigation |
|---|---|
| Sai mức withholding | Audit hàng quý bởi kế toán độc lập |
| Creator khai sai HKD | Verify qua VC, demote nếu phát hiện gian lận |
| Quên báo cáo quý | Cron `scripts/quarterly-tax-report.mjs` chạy ngày 5 tháng đầu quý |
| Đổi luật giữa năm | Lock tax logic trong worker, cần PR + 30 ngày notify để đổi |
| Creator chưa có MST | Dùng CCCD làm định danh tạm, khuyến khích đăng ký |
