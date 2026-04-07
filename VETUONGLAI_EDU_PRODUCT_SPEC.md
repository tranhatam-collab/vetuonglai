# VETUONGLAI EDU PRODUCT SPEC

Version: 1.0
Last updated: 2026-04-07

## Source of truth bổ sung

Team EDU bắt buộc đọc kèm:

- `VETUONGLAI_EDU_PHILOSOPHY_AND_SYSTEM_LOCK.md`
- `EDU_AI_TUTOR_SYSTEM_DEEP_SPEC.md`

Nếu có bất kỳ quyết định nào khiến EDU trở thành LMS truyền thống, file philosophy lock sẽ được ưu tiên hơn.

Nếu có bất kỳ quyết định nào khiến AI Tutor bị hạ xuống thành chatbot hỏi đáp đơn thuần, file AI Tutor deep spec sẽ được ưu tiên hơn.

## Vai trò EDU

`edu.vetuonglai.com` là hệ giáo dục công nghệ của Về Tương Lai.

Nó không phụ thuộc bằng cấp.

Nó không lấy kiến thức trường lớp làm trung tâm.

Nó hướng tới học thông qua trải nghiệm thực tế, công nghệ, AI, project và bằng chứng năng lực.

## User types

- người cần học kỹ năng để làm được
- người cần nâng cấp năng lực sống và năng lực tạo giá trị
- người đã học nhiều nhưng thiếu hệ thống thực chiến
- người học cùng AI và muốn có lộ trình rõ ràng

## Course listing

Trang `/courses` cần có:

- bộ lọc theo topic, level, format
- card khóa học rõ promise và output
- route sang course detail

## Course detail

Trang `/course/:slug` cần có:

- problem statement
- outcomes
- modules
- duration
- format
- evidence requirements
- VC linkage
- CTA bắt đầu học

## Lesson player

Trang `/learn/:lesson` cần có:

- title
- lesson navigation
- content renderer
- progress marker
- related resources
- next lesson CTA

## PDF / video reader

Cần hỗ trợ:

- video stream
- pdf reader
- text content
- AI session entry point

## AI Tutor integration

EDU phải xem AI Tutor là lõi của trải nghiệm học, không phải tính năng phụ.

Yêu cầu chi tiết xem tại:

- `EDU_AI_TUTOR_SYSTEM_DEEP_SPEC.md`

Nguyên tắc bắt buộc:

- AI hỏi để hiểu user
- AI gợi ý bước tiếp theo
- AI tạo hoặc hỗ trợ project / task
- AI gắn với learning path và progress
- AI không được hoạt động như chatbot chung chung

## Progress tracking

Cần có:

- completed state
- current lesson
- milestone progress
- exam readiness

## Exam flow

Cần có:

- quiz hoặc bài đánh giá
- project / output review nếu cần
- score hoặc review status

## Completion flow

Khi user đạt điều kiện:

- mark complete
- tạo output packet
- chờ issue proof / certificate

## Certificate issuance flow

Flow đề xuất:

lesson completion -> exam or review -> outcome verified -> VC issue request -> public verify record

## Payment integration option

Phải hỗ trợ ít nhất 3 mode:

- free course
- paid course
- cohort / premium access

## Admin needs

- create / edit course
- create / edit lesson
- upload media
- manage progress
- review submissions
- issue cert

## Content upload requirements

- upload video
- upload pdf
- rich text lesson
- workbook attachment
- metadata đầy đủ

## Access control

- public preview nếu cần
- paid content lock nếu cần
- cohort-only content nếu cần

## Proof output via VC

EDU phải có thể tạo ra proof cho:

- course completed
- skill achieved
- project delivered

## Đặc điểm chiến lược bắt buộc

EDU phải giữ đúng tinh thần sau:

- học để có năng lực thật
- học với AI, công nghệ và app realtime
- học bằng trải nghiệm và project
- không xem bằng cấp là trung tâm của giá trị học tập
