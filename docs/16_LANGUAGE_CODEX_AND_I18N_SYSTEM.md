# 16_LANGUAGE_CODEX_AND_I18N_SYSTEM.md

## Mục đích
File này khóa toàn bộ:
- ngôn ngữ public của hệ
- i18n system
- từ khóa chuẩn
- từ cấm
- CTA
- badges
- rule về bilingual
- rule về internal/public text

Đây là non-negotiable source of truth cho DEV, Content, Design, AI Code, QA, SEO.

## Triết lý ngôn ngữ gốc
Hệ này không:
- bán sản phẩm bằng hype
- truyền cảm hứng rẻ tiền
- dạy thành công
- hứa thu nhập nhanh

Hệ này:
- giúp con người sống rõ hơn
- học đúng hơn
- làm thật hơn
- tạo giá trị có thể kiểm chứng

## Tone chuẩn toàn hệ
- Calm
- Precise
- Real
- Long-term
- Non-sales

## Quy tắc tiếng Việt
- có dấu đầy đủ 100%
- không viết tắt
- không slang
- không overuse dấu chấm than
- không viết kiểu “gọi mua”

## Quy tắc English
- ngắn
- rõ
- không hype
- không dịch từng chữ

## Từ khóa chuẩn
| Việt | English |
|---|---|
| Hệ sống | Life system |
| Bằng chứng | Evidence |
| Xác minh | Verification |
| Lớp xác minh | Verification layer |
| Nhịp sống | Rhythm |
| Kỷ luật | Discipline |
| Tư duy dài hạn | Long-term thinking |
| Đầu tư tỉnh táo | Calm investing |
| Điểm vào | Entry point |
| Lộ trình | Pathway |
| Gói bằng chứng | Evidence packet |

## Từ cấm
### Việt
- đột phá
- đổi đời
- kiếm tiền nhanh
- tự do tài chính
- chữa lành
- truyền cảm hứng
- thành công nhanh
- đảm bảo

### English
- coaching
- transformation
- breakthrough
- guaranteed return
- make money fast
- passive income
- inspiration
- boost
- maximize

## CTA chuẩn
### Việt
- Khởi động đối thoại
- Xem điểm vào
- Tiếp tục tại hub
- Xem lớp liên quan
- Xem hồ sơ mẫu
- Xem checklist
- Xem lộ trình học
- Bắt đầu từ baseline

### English
- Start dialogue
- View entry point
- Continue at hub
- Explore related layer
- View sample profile
- View checklist
- View learning path
- Start with baseline

## Badge / status chuẩn
Chỉ dùng đúng 4 trạng thái:
- Live
- Member Preview
- Planned
- Bridge

## Quy tắc bilingual
Không được:
- VI và EN trên cùng một dòng
- trộn heading hai ngôn ngữ trong cùng block
- render bilingual line-by-line

Được:
- VI block trước, EN block sau
- hoặc một ngôn ngữ sạch cho mỗi request `?lang=vi` / `?lang=en`

## i18n architecture bắt buộc
```text
/content/language-codex.md
/content/vi.json
/content/en.json
/content/site-map.md
/content/seo-registry.csv
```

## Rule cho DEV
1. Không hard-code text vào template/component.
2. Public pages không được lộ:
   - DPM code
   - source state
   - ready
   - public host
   - internal staging labels
3. Shared design system + shared badge system + shared metadata system.

## Rule cho Content
1. Mỗi trang chỉ giúp người dùng hiểu 1 ý chính.
2. Không dùng ngôn ngữ nội bộ.
3. Không dùng từ cấm.
4. CTA phải là directional, không sales-driven.

## Rule cho QA
Reject nếu thấy:
- hype language
- sales pressure
- internal wording lộ public
- untranslated / half-translated copy
- duplicated bilingual same line
- inconsistent badge labels

## Rewrite core copy
### Root
H1: VỀ TƯƠNG LAI  
Subline: Một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng.

### VC
H1: XÁC MINH  
Subline: Một lớp xác minh độc lập cho giá trị thật.

### LIFE
H1: NHỊP SỐNG  
Subline: Ổn định cuộc sống trước khi tối ưu cuộc đời.

### FINANCE
H1: TIỀN  
Subline: Hiểu tiền trước khi cố kiếm thêm tiền.

### INVEST
H1: ĐẦU TƯ  
Subline: Đầu tư bắt đầu từ hiểu rủi ro.

### GREEN
H1: XANH  
Subline: Biến tuyên bố xanh thành bằng chứng.

### EDU
H1: HỌC  
Subline: Học để làm được việc, không phải để biết.

## Điều phải làm ngay
1. Tạo bộ `/content/*` chuẩn
2. Gỡ internal labels khỏi public pages
3. Chuẩn hóa 4 badge
4. Chuẩn hóa CTA
5. Chuẩn hóa bilingual rendering

## Kết luận
Language governance là hạ tầng. Nếu không khóa từ đây, mỗi domain sẽ nói một kiểu và trust sẽ gãy rất nhanh.
