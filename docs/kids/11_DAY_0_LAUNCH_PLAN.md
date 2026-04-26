# KIDS_DAY_0_LAUNCH_PLAN

> Live trang chủ `kids.vetuonglai.com` + công bố "Mùa Hè Lập Trình Viên — Đà Lạt"
> theo Language Codex (không hype, không bán, không nút mua / đăng ký).

## Mục tiêu Day 0

- Live trang chủ Kids: public, SEO-ready, song ngữ chuẩn
- Công bố chương trình hè ở mức **thông tin** (không CTA mua / đăng ký)
- Không phá nguyên tắc hệ: calm, precise, real, non-sales

## 1. Trang chủ — cấu trúc live

### Hero (VI)
> H1: TRẺ EM VỀ TƯƠNG LAI
> Subline: Một môi trường giúp trẻ hiểu mình, học đúng cách và tạo ra sản phẩm nhỏ có thể kiểm chứng.

### Section flow
```
Hero
↓
Vấn đề thật
↓
Hệ này là gì
↓
Cách hoạt động
↓
Ví dụ sản phẩm
↓
Vai trò phụ huynh
↓
Điều hệ này không làm
↓
Mùa Hè Lập Trình Viên — Đà Lạt (block riêng, chỉ công bố)
↓
CTA (không bán)
```

### CTA Day 0 (không bán)

- Xem dự án mẫu
- Xem hành trình học

## 2. Block "Mùa Hè Lập Trình Viên — Đà Lạt"

### Subline
> Một chương trình trải nghiệm giúp trẻ học cách tạo ra sản phẩm công nghệ trong môi trường thực tế.

### Mục tiêu
- hiểu công nghệ không chỉ là sử dụng
- tạo ra sản phẩm đơn giản
- làm việc theo nhóm nhỏ
- giữ nhịp sống ổn định

### Nội dung trải nghiệm
- làm website đơn giản
- tạo game cơ bản
- làm video sản phẩm
- làm việc nhóm
- trình bày sản phẩm

### Môi trường
- Đà Lạt
- không gian tự nhiên
- lịch học – nghỉ – vận động rõ ràng

### Kết quả
- mỗi trẻ có ít nhất 1 sản phẩm
- hiểu quy trình từ ý tưởng → thực hiện
- có hồ sơ tiến bộ

### Lưu ý
> Chương trình đang được chuẩn bị. Thông tin chi tiết sẽ được công bố sau.

### CTA (chỉ thông tin)
> Xem chi tiết chương trình (sắp công bố) — render dưới dạng tag, không phải link.

## 3. SEO & đa ngôn ngữ

- Route: `/` (VI), `/en/` (EN)
- Meta riêng theo ngôn ngữ
- `hreflang` đầy đủ: `vi`, `en`, `x-default`
- Schema: EducationalOrganization, WebSite

## 4. Robots

- `Allow: /$`, `Allow: /en/`, `Allow: /assets/`, `Allow: /api/curriculum.json`, `Allow: /api/contract.json`
- `Disallow: /parent/`, `Disallow: /learn/`, `Disallow: /api/kids/`
- `Sitemap: https://kids.vetuonglai.com/sitemap.xml`

## 5. Checklist deploy hôm nay

### FE
- Route `/` và `/en/` live
- i18n bind đầy đủ
- Không trộn VI / EN trong cùng block
- Responsive mobile

### Content
- Đúng tone codex
- Không từ cấm
- Không hype
- Không viết tắt (Tiếng Việt / English / Trợ lý học / lớp xác minh độc lập)

### QA
- Không lỗi chính tả
- Không link lỗi
- Không text nội bộ lộ ra
- Hub + member không leak `kids.vetuonglai.com` (đã filter)

### SEO
- Title / Description theo ngôn ngữ
- H1 / H2 đúng cấp
- Schema cơ bản

## 6. Những điều KHÔNG làm hôm nay

- Không nút đăng ký
- Không form
- Không thanh toán
- Không quảng cáo
- Không ép chuyển đổi

## 7. Bước tiếp theo

- Tuần 1: thêm 5–10 project mẫu, 2–3 video demo
- Tuần 2: viết landing chi tiết chương trình hè
- Tuần 3: mở waitlist (chỉ khi nội dung đủ rõ)

## Câu chốt

> Hôm nay không cần bán. Hôm nay cần làm rõ giá trị.
