# 33_LANGUAGE_CODEX_AND_I18N_SYSTEM

## Mục đích của file

File này chuyển Language Codex từ mức định hướng sang mức **implementation-grade**.

Nó trả lời thẳng cho team DEV:

- text phải nằm ở đâu
- locale nào là nguồn nghĩa gốc
- badge, CTA, meta và copy public lấy từ đâu
- những gì tuyệt đối không được hard-code ra UI public

---

## 1. Nguồn nghĩa gốc

Trong V1.0 hiện tại:

- `vi-VN` là nguồn nghĩa gốc
- `en-US` là lớp dịch đã review

Source of truth:

- `content/language-codex.md`
- `content/locale-registry.json`
- `content/vi.json`
- `content/en.json`
- `content/site-map.md`
- `content/seo-registry.csv`

Không được tạo thêm nguồn copy ngoài các file trên cho public layer.

---

## 2. Quy tắc i18n bắt buộc

### 2.1 DEV

Phải làm:

1. bind mọi text public từ `content/vi.json` hoặc `content/en.json`
2. bind locale, hreflang và fallback từ `content/locale-registry.json`
3. bind meta title, description, alt text, OG locale theo registry chung

Không được làm:

- hard-code hero copy
- hard-code CTA
- hard-code badge state
- hard-code internal labels ra page public

### 2.2 Content

Phải làm:

1. viết tiếng Việt có dấu đầy đủ
2. giữ tiếng Anh ngắn, đúng nghĩa, không hype
3. một trang chỉ giữ một ý chính

### 2.3 QA

Phải chặn:

- mixed bilingual line
- internal ops wording lộ ra public
- CTA sales-heavy
- badge sai status
- EN dịch từng chữ sai nghĩa

---

## 3. Key nhóm text bắt buộc phải chuẩn hóa

### 3.1 Shared UI

- nav labels
- footer lines
- system badges
- CTA chuẩn
- disclosure labels
- error-state public copy

### 3.2 Domain copy

- hero title
- subline
- section labels
- teaser block
- member-depth preview

### 3.3 SEO

- title
- description
- canonical label
- image alt text

---

## 4. Bộ badge chuẩn

Chỉ dùng:

- `Live`
- `Beta`
- `Member Preview`
- `Planned`
- `Bridge`

Không dùng:

- coming soon
- launching
- early access
- ready
- source state

---

## 5. Bộ CTA chuẩn

Primary:

- `Mở toàn bộ hệ của bạn`

Allowed variants:

- `Mở hành trình của bạn`
- `Bước vào hệ của bạn`
- `Xem sâu hơn trong hệ của bạn`
- `Mở lớp thành viên của toàn hệ`

Không dùng:

- mua ngay
- chốt đơn
- unlock success
- đăng ký kẻo lỡ

---

## 6. Từ cấm trên public layer

### Tiếng Việt

- đổi đời
- kiếm tiền nhanh
- tự do tài chính
- chữa lành
- thành công nhanh
- đảm bảo

### Tiếng Anh

- coaching
- transformation
- guaranteed return
- make money fast
- passive income
- maximize

---

## 7. Internal labels không được lộ

Public layer không được hiện:

- `DPM-*`
- `source state`
- `public host`
- `ready`
- endpoint docs
- internal review notes

Nếu cần tài liệu kỹ thuật, đưa sang docs/dev note, không đưa lên landing public.

---

## 8. Definition of done

I18n system chỉ được xem là đạt khi:

1. mọi chuỗi public lấy từ source i18n
2. locale fallback không vỡ
3. badge/CTA/meta đồng bộ giữa domain
4. không còn internal labels trên public pages
