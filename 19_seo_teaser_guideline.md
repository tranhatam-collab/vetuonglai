# GATEWAY SYSTEM — FILE 19
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 19_seo_teaser_guideline.md
**Tên:** Hướng dẫn SEO cho lớp Public (mọi subdomain)

### 19.1 Nguyên tắc SEO với Gateway model

```
VẤN ĐỀ: Content sau gateway không được Google index
GIẢI PHÁP: Public layer phải đủ mạnh để SEO độc lập

Quy tắc cứng:
  → Mỗi URL phải có ít nhất 300 từ PUBLIC (không bị lock)
  → Title + Meta description KHÔNG được hint về paywall
  → H1 phải chứa primary keyword
  → Ít nhất 1 bài/trang hoàn chỉnh free cho mỗi category
  → Không dùng noindex cho trang có gateway
  → Structured data (schema) đầy đủ trên lớp public
```

### 19.2 Template SEO cho từng loại trang

**Template: Trang khóa học (edu.)**
```
<title>[Tên khóa học] — Học có VC Proof | Về Tương Lai</title>
<meta description="[Mô tả 150 ký tự: kỹ năng học được +
output thật + VC badge nhận được]. Bắt đầu ngay.">

PUBLIC CONTENT (Google index):
  H1: [Tên khóa học]
  H2: Bạn sẽ học được gì?
  → 5 bullet points cụ thể
  H2: Output của khóa học
  → Mô tả deliverable thật
  H2: VC Badge nhận được
  → Link đến vc.vetuonglai.com/badges/[type]/
  H2: Bài học đầu tiên (free)
  → Toàn bộ bài 1

GATE (sau bài 1):
  → Blur + teaser + CTA
```

**Template: Trang job listing (work.)**
```
<title>[Job Title] — Remote Việt Nam | Về Tương Lai Work</title>
<meta description="Tuyển [Job Title]: [mức lương],
[yêu cầu chính], [VC required]. Apply với VC Proof.">

PUBLIC CONTENT:
  H1: [Job Title]
  → Company (ẩn tên nếu cần) + Budget range
  → Mô tả công việc đầy đủ (KHÔNG lock mô tả JD)
  → VC Required: [badge type] + link đến vc.
  → Skills cần có

GATE (chỉ lock form apply):
  → Blur form apply
  → CTA: "Apply với VC Profile của bạn"
```

**Template: Trang sản phẩm (market.)**
```
<title>[Tên sản phẩm] bởi [Tác giả] | VTL Market</title>
<meta description="[Mô tả sản phẩm 150 ký tự +
use case + rating]">

PUBLIC CONTENT:
  H1: [Tên sản phẩm]
  → Tác giả + VC badge
  → Mô tả đầy đủ (300+ từ)
  → Screenshots/preview
  → Rating + reviews (text, không lock)
  → Giá

GATE (chỉ lock nút mua):
  → Blur nút "Tải về / Truy cập"
  → CTA: "Mua sản phẩm này trong hệ"
```

### 19.3 Internal linking SEO trong lớp public

```
Mỗi trang public PHẢI có:

1. Breadcrumb schema:
   vetuonglai.com > edu.vetuonglai.com > [Category] > [Trang]

2. Contextual links (trong content public):
   Nhắc đến "VC badge" → link vc.vetuonglai.com/badges/[type]/
   Nhắc đến "tìm việc" → link work.vetuonglai.com/ky-nang/[skill]/
   Nhắc đến "tài liệu" → link market.vetuonglai.com/tag/[topic]/

3. Author schema (Person):
   Tác giả có VC badge → link member.vetuonglai.com/u/[user]/

4. FAQ schema (nếu có Q&A section):
   Câu hỏi thường gặp về topic → schema FAQ
   → Eligible for Google Featured Snippet
```

### 19.4 Content SEO anchor (bài free làm mồi)

```
Mỗi subdomain cần ít nhất 1 "SEO Anchor" — bài free hoàn chỉnh:

edu.:     "Lộ trình học freelance từ 0 — đầy đủ không cắt xén"
work.:    "Bảng mức lương freelancer Việt Nam 2026 — số liệu thật"
market.:  "Cách định giá sản phẩm số — hướng dẫn thực tế"
vc.:      "VC Proof là gì và tại sao quan trọng hơn CV?"
blog.:    "30 ngày đầu freelance — nhật ký thật"
community.: "Cộng đồng nào thật sự giúp được freelancer VN?"
life.:    "Làm remote 2 năm — những gì tôi học được về sức khỏe"
finance.: "Kỷ luật tài chính cho người thu nhập không đều"

Tiêu chuẩn SEO anchor:
  → Độ dài: 1.500–3.000 từ
  → Hoàn chỉnh, không cắt xén
  → Internal links đến toàn hệ
  → CTA tự nhiên ở giữa và cuối bài
  → Cập nhật định kỳ 3–6 tháng/lần
```
