# 22_MULTILINGUAL_LANGUAGE_SEO_LOCK_SYSTEM.md

Status: LOCKED (Non-negotiable)
Scope: Đa ngôn ngữ, SEO, i18n, content rendering cho toàn bộ `*.vetuonglai.com`
Áp dụng cho: DEV · FE · Content · SEO · QA · Ops
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## Mục tiêu

Khóa toàn bộ:

- đa ngôn ngữ
- SEO
- i18n
- content rendering

---

## 1) Nguyên tắc ngôn ngữ

### Tiếng Việt, Primary

- Có dấu 100%
- Không viết slang
- Không xen English nếu không thật sự cần thiết
- Không câu cảm xúc rẻ tiền
- Không hype
- Không giọng bán hàng

### Tiếng Anh, Secondary

- Ngắn
- Rõ
- Không hype
- Không dịch từng chữ
- Không dịch máy
- Phải là một hệ ngôn ngữ hoàn chỉnh riêng

---

## 2) Quy tắc hiển thị

Sai:

- VI + EN cùng dòng
- Trộn text
- Giữ chữ Việt ở page tiếng Anh
- Giữ chữ Anh ở page tiếng Việt nếu không bất khả kháng

Đúng:

- `/vi/...` -> 100% tiếng Việt
- `/en/...` -> 100% tiếng Anh

Mỗi ngôn ngữ là một hệ độc lập, không pha trộn.

---

## 3) URL structure

```text
/vi/life
/vi/finance
/vi/invest
/vi/green
/vi/edu
/vi/member

/en/life
/en/finance
/en/invest
/en/green
/en/edu
/en/member
```

Quy tắc:

- route riêng theo locale
- metadata riêng theo locale
- slug / URL strategy rõ ràng
- không trộn locale trong cùng route

---

## 4) SEO chuẩn đa ngôn ngữ

### Meta

- Title: 50–60 ký tự
- Description: 140–160 ký tự
- 1 H1 cho mỗi page
- 3–6 H2 nếu là page nội dung

### Technical SEO bắt buộc

- schema / JSON-LD
- canonical
- hreflang
- alt text trung tính
- URL sạch
- internal linking logic
- teaser public để index
- member / deep layer tách đúng khỏi lớp public

---

## 5) Schema

Ví dụ tối thiểu:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "inLanguage": "vi",
  "name": "Về Tương Lai",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Về Tương Lai"
  }
}
```

---

## 6) File i18n

```text
/content/
  vi.json
  en.json
```

Quy tắc:

- tất cả text đi qua i18n
- không hard-code text trong template
- mỗi locale có source file sạch
- giao diện, CTA, meta, badge, disclosure đều phải nằm trong i18n

---

## 7) Quy tắc dev

- Không hard-code text
- Render theo locale
- Middleware detect language
- Tách public layer và member layer rõ ràng
- Không hiển thị DPM code, source state, internal label trên public page

---

## 8) Hreflang

Ví dụ:

```html
<link rel="alternate" hreflang="vi" href="/vi/..." />
<link rel="alternate" hreflang="en" href="/en/..." />
<link rel="alternate" hreflang="x-default" href="/vi/..." />
```

---

## 9) Runtime rules cho SEO

- Public layer phải đủ hook + content mở + demo + CTA để index được
- Member layer không được lẫn vào public index nếu chưa đúng entitlement
- Paywalled content phải dùng structured data đúng chuẩn
- canonical phải trỏ đúng locale và đúng version page

---

## 10) Kết luận

Đa ngôn ngữ không phải tính năng thêm sau.
Đây là kiến trúc phải khóa từ gốc.

Mỗi ngôn ngữ là một hệ độc lập, không pha trộn, không nửa Việt nửa Anh.
