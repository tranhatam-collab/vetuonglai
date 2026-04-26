# UNIVERSAL BILINGUAL LANGUAGE REBUILD COMMAND

- **Status**: Mandatory
- **Priority**: Highest
- **Scope**: Toàn bộ website đang trong giai đoạn re-development
- **Áp dụng cho**: DEV / Content / QA / Design / AI / Codex / CMS / SEO

Từ thời điểm này, toàn bộ website phải được rà soát, chuẩn hoá, viết lại và kiểm tra lại toàn bộ ngôn ngữ song ngữ theo chuẩn tuyệt đối trước khi được phép live.

Mục tiêu không phải là "dịch lại nội dung". Mục tiêu là tái cấu trúc toàn bộ hệ ngôn ngữ của website để đạt chuẩn:

1. Tiếng Việt Nam có dấu đầy đủ, chuẩn chính tả, chuẩn văn bản, rõ nghĩa, thống nhất toàn site.
2. Tiếng Anh chuẩn Mỹ quốc tế, tự nhiên, rõ ràng, không dịch máy từng chữ, không sai ngữ pháp, không dùng giọng bán hàng rẻ tiền.
3. Mỗi ngôn ngữ có metadata SEO riêng, title riêng, description riêng, alt text riêng, URL logic rõ ràng, không dùng chung bừa bãi.
4. Mọi chữ trên site phải đi qua một nguồn nội dung chuẩn, không hard-code rải rác trong component, template, script hay CMS không kiểm soát.
5. Không được phép live bất kỳ page nào khi còn chữ sai, chữ thiếu dấu, lệch tông, lẫn ngôn ngữ, sai heading, sai CTA, sai menu, sai meta, sai alt text hoặc sai logic song ngữ.

## Phạm vi bắt buộc rà toàn bộ

- menu chính / menu phụ / footer
- hero / section title / paragraph
- CTA / button / form label / placeholder / empty state / error message / badge / status
- metadata: OG title, OG description, Twitter metadata, schema name/description
- image filename / alt text / caption
- article title / dek / body / related links
- legal pages, trust pages, newsletter, contact
- CMS fields, search results, system notification text

## Nguyên tắc ngôn ngữ bắt buộc

### Tiếng Việt Nam
- Có dấu đầy đủ 100%
- Không viết tắt tuỳ tiện
- Không dùng slang
- Không pha giọng quảng cáo
- Câu rõ, ngắn, đúng nghĩa
- Viết như một hệ thống nghiêm túc, không như bài đăng mạng xã hội
- Giữ một chuẩn thuật ngữ thống nhất từ đầu đến cuối

### Tiếng Anh
- Chuẩn Mỹ quốc tế
- Không dịch từng chữ
- Không hype, không sales copy yếu, không cấu trúc máy dịch
- Phải đọc như nội dung do team quốc tế chuyên nghiệp viết
- Phải giữ đúng nghĩa hệ thống của bản tiếng Việt

## Quy tắc song ngữ

- Tiếng Việt là bản chuẩn nguồn nội dung
- Tiếng Anh là bản ngôn ngữ quốc tế thứ hai
- Hai bản phải tương đương về nghĩa, không lệch định vị
- Không trộn tiếng Việt và tiếng Anh trong cùng một block nếu không có lý do rõ ràng
- Không live page nào chỉ hoàn chỉnh một ngôn ngữ

## Quy tắc SEO bắt buộc

Mỗi page phải có:

- H1 duy nhất
- title riêng theo ngôn ngữ
- meta description riêng theo ngôn ngữ
- canonical đúng
- hreflang đúng nếu có URL song ngữ tách riêng
- OG title / OG description riêng
- OG image đúng
- alt text riêng theo ngôn ngữ
- internal link đúng ngôn ngữ đang đọc
- schema đúng loại trang

Không được:
- dùng chung title cho cả hai ngôn ngữ
- dịch máy description
- thiếu alt text
- URL ngẫu nhiên
- heading sai cấp
- bài viết không có internal link
- metadata trùng hàng loạt

## Quy tắc kỹ thuật bắt buộc

1. Chuẩn hoá nguồn nội dung: `/content/vi.json`, `/content/en.json`
2. CMS: khoá field song ngữ rõ ràng, không cho publish nếu thiếu một ngôn ngữ
3. Không hard-code text public trong component, template, script, page file, client-side logic
4. Route song ngữ: `/vi/...`, `/en/...` — language switcher phải đưa đúng sang page tương ứng
5. Nếu chưa tách route: vẫn phải tách metadata, content source, render logic theo ngôn ngữ

## Quy tắc đặc biệt cho `kids.vetuonglai.com`

- **Tuyệt đối không viết tắt** trên bất kỳ surface nào, kể cả nav, footer, badge, label.
- "VI / EN" → **"Tiếng Việt" / "English"** (viết đầy đủ, có dấu).
- "AI" → **"Trợ lý học"** / **"learning assistant"** (kids audience không cần biết khái niệm AI ở mức công nghệ).
- "VC" → **"lớp xác minh độc lập"** / **"independent verification layer"**.
- "PWA", "URL", "OG" và các kỹ thuật khác chỉ được dùng trong meta tag hoặc khu vực dev — không xuất hiện trong UI.

## Quy trình thực hiện bắt buộc

1. Crawl toàn bộ site dev hiện tại → xuất danh sách URL, text node public, metadata, image alt, form text.
2. Lập bảng kiểm kê song ngữ: URL, page type, trạng thái VI, trạng thái EN, lỗi chính tả, lỗi ngữ nghĩa, lỗi SEO, lỗi UI text, lỗi metadata, lỗi alt text, mức độ ưu tiên sửa.
3. Chuẩn hoá language codex: thuật ngữ khoá, từ cấm, giọng văn, cấu trúc heading, CTA registry, form registry, error/empty state registry.
4. Viết lại toàn bộ text theo nguồn chuẩn: Việt trước, Anh sau, đúng role từng page và từng component.
5. Rà từng chữ: AI pass 1 → Human/Editor pass 2 → SEO pass 3 → QA pass 4.
6. Kiểm thử trước live: mobile, desktop, metadata, language switcher, internal links, canonical, hreflang, schema, image alt, search snippet preview.
7. Chỉ live khi 100% page public đã qua đủ 4 pass; không còn text sai, thiếu dấu, dịch máy, metadata trùng, page lệch tông.

## Định nghĩa hoàn thành

- Mọi URL public đều có ngôn ngữ rõ ràng
- Mọi chữ public đều nằm trong hệ content source
- Mọi page đều đúng chuẩn tiếng Việt Nam có dấu
- Mọi page đều đúng chuẩn tiếng Anh Mỹ quốc tế
- Mọi page đều có SEO song ngữ riêng
- Mọi ảnh đều có alt text đúng
- Mọi CTA, menu, footer, form đều đồng nhất
- Không còn text rác, placeholder, hard-code, lẫn ngôn ngữ
- Founder có thể rà ngẫu nhiên bất kỳ page nào mà không thấy lỗi

## Báo cáo bắt buộc trước khi live

1. Tổng số URL đã rà
2. Tổng số page đã sửa
3. Tổng số lỗi tiếng Việt đã sửa
4. Tổng số lỗi tiếng Anh đã sửa
5. Tổng số metadata đã chuẩn hoá
6. Tổng số alt text đã chuẩn hoá
7. Tổng số CTA / form / menu / footer đã chuẩn hoá
8. Danh sách page còn treo nếu có
9. Danh sách quyết định ngôn ngữ quan trọng đã khoá
10. Xác nhận cuối: đủ chuẩn tiếng Việt, đủ chuẩn tiếng Anh, đủ chuẩn SEO, đủ chuẩn live

## Mệnh lệnh cuối

Đây không phải nhiệm vụ dịch thuật. Đây là nhiệm vụ tái cấu trúc toàn bộ hệ ngôn ngữ, SEO và UI text của website ở cấp production. Chỉ khi toàn bộ hệ chữ, hệ SEO, hệ song ngữ đã đúng, website mới được phép live.
