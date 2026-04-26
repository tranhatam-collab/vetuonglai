# 21_MULTILINGUAL_EXPANSION_PROTOCOL_2026

## Mục đích của file

File này khóa quy trình mở rộng đa ngôn ngữ cho `*.vetuonglai.com`.

Mục tiêu:

- giữ tiếng Việt là bản hoàn thiện nhất và là nguồn nghĩa gốc
- giữ tiếng Anh đúng nghĩa kỹ thuật, nhất quán với codex
- chuẩn bị sẵn nền để mở thêm ngôn ngữ khác khi founder muốn
- không để team “thêm locale cho có” rồi làm vỡ SEO, nghĩa hoặc QA

---

## 1. Nguyên tắc gốc

1. `vi-VN` là source of truth cho meaning, editorial structure và public promise.
2. `en-US` là lớp dịch đã review, dùng cho technical clarity và mở rộng quốc tế hiện tại.
3. Locale mới chỉ được mở khi:
   - bản tiếng Việt đã khóa
   - glossary đã review
   - SEO đã review
   - QA đã review
   - locale registry đã cập nhật
4. Mở locale mới là một quyết định phát hành, không phải một việc “dịch thêm chuỗi”.

---

## 2. Source of truth

Mọi quyết định đa ngôn ngữ phải bám 5 nguồn này:

1. `content/language-codex.md`
2. `content/locale-registry.json`
3. `content/vi.json`
4. `content/en.json`
5. `content/seo-registry.csv`

---

## 3. Trạng thái locale

### 3.1 Active public locale

Locale đang được render, có SEO, có hreflang, có QA.

Hiện tại:

- `vi`
- `en`

### 3.2 Future locale

Locale mới chỉ được lên planned cho đến khi pass đủ gate.

Không được:

- thêm nút chuyển ngôn ngữ
- thêm hreflang public
- thêm metadata public
- claim là đã hỗ trợ

---

## 4. Rule cho tiếng Việt

Tiếng Việt phải:

- có dấu đầy đủ 100%
- đúng vai trò hệ thống
- đúng language codex
- là bản hoàn thiện nhất để các team cùng bám

Nếu bản tiếng Việt chưa khóa:

- không mở dịch mới
- không duyệt locale expansion

---

## 5. Rule cho tiếng Anh

Tiếng Anh phải:

- ngắn
- rõ
- đúng nghĩa kỹ thuật
- không dịch từng chữ
- không marketing hóa hệ thống

Tiếng Anh không được:

- mâu thuẫn với bản tiếng Việt
- “dịch sáng tạo” làm lệch promise
- dịch literal gây sai vai trò domain

---

## 6. Rule cho locale mới

Mỗi locale mới phải đi qua đúng chuỗi:

1. khóa bản tiếng Việt
2. xác nhận glossary domain-level
3. dịch bản nháp
4. review ngôn ngữ
5. review technical meaning
6. review SEO/meta
7. review QA/UI
8. cập nhật `content/locale-registry.json`
9. cập nhật build/check nếu cần
10. chỉ sau đó mới được phát hành

---

## 7. Runtime và fallback policy

Runtime locale policy phải bám `content/locale-registry.json`.

Hiện tại:

- `vi` -> fallback `vi`
- `en` -> fallback `en`, rồi `vi`
- locale mới trong tương lai -> mặc định fallback `en`, rồi `vi` cho đến khi được kích hoạt chính thức

Lưu ý:

- editorial priority vẫn là tiếng Việt
- runtime fallback cho user quốc tế có thể ưu tiên tiếng Anh trước tiếng Việt

---

## 8. SEO và alternate language rule

Locale active public phải có:

- `hreflang`
- meta title / description đúng locale
- canonical đúng
- alternate links đúng

Locale chưa active public thì:

- không có `hreflang`
- không có route public
- không có indexable page

---

## 9. Rule cho Team Dev

Team Dev phải:

1. không hard-code locale list
2. đọc locale active từ `content/locale-registry.json` nếu lane đó đã được hỗ trợ
3. không thêm locale mới chỉ ở UI mà quên SEO/check/runtime
4. không merge locale expansion nếu QA chưa pass

---

## 10. Rule cho Team Content

Team Content phải:

1. viết và khóa tiếng Việt trước
2. review tiếng Anh theo nghĩa, không theo từng chữ
3. không dùng machine translation literal như output cuối
4. không claim đa ngôn ngữ nếu mới chỉ có vài chuỗi giao diện

---

## 11. Rule cho Team QA

Team QA phải chặn nếu:

- locale active nhưng metadata sai
- `hreflang` thiếu
- nghĩa tiếng Anh lệch bản tiếng Việt
- locale mới mở nhưng chưa có registry rule
- chuỗi rơi về fallback sai ngoài policy

---

## 12. Definition of done cho multilingual expansion

Một locale mới chỉ được xem là sẵn sàng khi:

- bản tiếng Việt gốc đã khóa
- glossary pass
- bản dịch pass review
- SEO pass
- QA pass
- locale registry đã cập nhật
- build/check không fail

Nếu thiếu 1 bước, locale đó chưa được xem là ready.
