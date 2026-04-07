# VETUONGLAI USER JOURNEY SYSTEM

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này khóa toàn bộ hành trình người dùng của hệ thống Về Tương Lai, từ lúc là người lạ cho đến lúc trở thành người học, người thực hành, thành viên cộng đồng và người có proof được xác minh.

## Nguyên tắc tổng

Hệ thống không được để user đi lung tung giữa các domain mà không biết mình đang ở đâu.

Mỗi user cần có:

- điểm vào rõ ràng
- bước kế tiếp rõ ràng
- lý do vì sao phải đi tiếp
- một hành trình có ý nghĩa

## Hành trình tổng quan

Luồng tổng:

người lạ -> hiểu vấn đề -> đánh giá hiện trạng -> được route vào domain phù hợp -> học / thực hành -> tạo output -> xác minh / proof -> tham gia cộng đồng -> đóng góp / phụng sự

## Các loại người dùng chính

- người mất ổn định đời sống
- người thiếu hiểu biết tài chính
- người cần học kỹ năng
- người cần chữa lành / hồi phục
- người cần cộng đồng đồng hành
- người muốn xác minh kết quả
- người muốn chuyển từ học sang làm và đóng góp

## Các điểm vào hệ thống

- root hub homepage
- start / assessment flow
- bài viết từ SEO
- course landing
- story page
- VC verify page
- community invitation

## Onboarding chung

Root onboarding phải xây quanh 4 bước:

1. user nhận diện tình trạng hiện tại
2. hệ thống phân loại và gợi ý domain phù hợp
3. user chọn hành trình bắt đầu
4. user có next step rõ ràng trong 24 giờ đầu

## Hành trình phổ biến

### 1. Người mất ổn định đời sống

Flow:

- vào root hub
- làm assessment
- được route sang `life`
- chọn lộ trình 7 hoặc 14 ngày
- thực hành routine
- nhận nhắc nhở / support
- nếu ổn định hơn thì mở rộng sang `edu` hoặc `community`

Drop-off points:

- giao diện quá tải
- challenge quá khó
- không có next step rõ ràng

Recovery flow:

- quay lại route ngắn hơn
- đề xuất bài thực hành nhẹ hơn
- gợi ý cộng đồng hỗ trợ nếu có

### 2. Người thiếu hiểu biết tài chính

Flow:

- vào root hoặc finance page
- đọc framing về money clarity
- làm self-check
- bắt đầu learning path tại `finance`
- dùng template và tool
- khi có nền tảng thì route sang `invest`

Drop-off points:

- content quá lý thuyết
- không có công cụ thực hành

Recovery flow:

- đề xuất template ngắn
- đề xuất challenge ngắn 7 ngày

### 3. Người cần học kỹ năng

Flow:

- vào `edu`
- xem course listing
- chọn course theo output
- học lesson
- làm exam / project
- nhận completion proof qua VC

Drop-off points:

- không rõ outcome
- lesson player kém
- progress không minh bạch

Recovery flow:

- email nhắc tiếp tục
- đề xuất lesson tiếp theo
- hiện lại progress và output gần nhất

### 4. Người cần chữa lành

Flow:

- vào root hoặc `life` / `healing`
- nhận diện nhu cầu hồi phục
- được dẫn vào path an toàn, nhẹ, không áp lực
- thực hành journaling, grounding, hỗ trợ có giới hạn

Drop-off points:

- ngôn ngữ quá nặng
- claim quá đà

Recovery flow:

- route sang nội dung an toàn hơn
- hiện disclaimer và support path phù hợp

### 5. Người cần cộng đồng

Flow:

- vào hub hoặc `community`
- hiểu vì sao cần đồng hành
- xem loại group phù hợp
- join flow
- tham gia circle / cohort

### 6. Người muốn xác minh kết quả

Flow:

- vào `vc`
- search / lookup record
- hoặc đi từ domain nguồn sang VC
- xem minimal disclosure proof

## Entry points cho từng domain

- `vetuonglai.com`: tổng quan, onboarding, route
- `life`: path cho ổn định đời sống
- `edu`: path cho học năng lực
- `finance`: path cho rõ tiền bạc
- `invest`: path cho đầu tư có kỷ luật
- `green`: path cho hành động bền vững
- `vc`: path cho verify
- `community`: path cho đồng hành

## Step-by-step flow chuẩn

Mỗi major flow trong hệ thống phải có:

1. context
2. expectation
3. action
4. progress feedback
5. next step

## Drop-off points tổng quát

- user không hiểu page này để làm gì
- user không biết nên click vào đâu
- user không thấy lợi ích ngay
- user bị overload bởi quá nhiều lựa chọn
- user không thấy được mình đang tiến bộ

## Recovery flows tổng quát

- đề xuất 1 next step duy nhất
- quay lại path ngắn hơn
- cho xem progress hiện tại
- đề xuất content nhẹ hơn hoặc phù hợp hơn

## Suggested next steps engine

Về sau hệ thống cần có recommendation engine đơn giản dựa trên:

- domain đã vào
- assessment result
- last completed action
- progress state
- current journey stage

Nguyên tắc:

- không đề xuất quá nhiều
- đề xuất phải có lý do
- mỗi next step phải giúp user tiến thêm 1 bước thật
