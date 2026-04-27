# 19_SUBMISSION_AND_REVIEW_ENGINE.md

## Mục đích
File này khóa toàn bộ vòng:
- học
- làm
- nộp
- review
- đủ điều kiện proof
- chuyển vào VC

## Triết lý
Học chỉ được xem là có giá trị khi đi tới:
- output
- submission
- review
- evidence
- proof readiness

## Submission types
### Reflection submission
- câu trả lời ngắn
- self-review
- next step commitment

### Task submission
- checklist done
- text / image / file / link

### Project submission
- deliverable có cấu trúc
- file, link, doc, portfolio piece, demo, code, content, plan

### Evidence packet submission
- bộ bằng chứng để xét proof / badge / credential

## Lesson → submission mapping
### Reading lesson
- understanding confirmation
- reflection
- short answer

### Video lesson
- summary
- applied response
- action proof

### AI-guided lesson
- AI-reviewed artifact
- generated plan
- corrected output

### Action lesson
- bắt buộc submission proof

### Project lesson
- bắt buộc deliverable

## Submission statuses
- `draft`
- `submitted`
- `under_review`
- `revision_requested`
- `approved`
- `verified_input`
- `rejected`

## Review modes
### Auto-check
Cho completeness, file presence, required fields, format validation.

### AI review
Cho structure feedback, clarity feedback, gap detection, suggestions.

### Editor review
Cho course quality, content-based deliverable, creator-quality work.

### Peer review
Cho builder-level work, structured rubric-based feedback.

### Final proof review
Cho badge / VC-related decisions.

## Submission data model
### Submission
- `id`
- `user_id`
- `course_id`
- `lesson_id`
- `type`
- `title`
- `body`
- `file_refs`
- `link_refs`
- `status`
- `submitted_at`
- `review_mode`

### Review
- `id`
- `submission_id`
- `reviewer_type`
- `reviewer_id`
- `decision`
- `feedback`
- `created_at`

### Evidence packet
- `id`
- `user_id`
- `source_submission_ids`
- `packet_type`
- `status`
- `ready_for_vc`
- `created_at`

## Review deadlines
- auto-check: immediate
- AI review: within minutes
- editor review: within 72h
- peer review: within 5 days
- proof review: within 5 days

## Completion rules
Một lesson / module chỉ được xem là completed nếu:
- requirements hoàn tất
- submission hợp lệ
- required review state đạt

Ví dụ:
- lesson watched only → not complete
- lesson watched + action submitted → pending
- lesson watched + action approved → complete

## Revision flow
Nếu submission chưa đạt:
- status = `revision_requested`
- user thấy:
  - thiếu gì
  - cần sửa gì
  - deadline nếu có

### Correct wording
- Bài nộp của bạn cần thêm một bước trước khi được xác nhận.
- Bạn đang thiếu phần bằng chứng cho bước này.

## Submission → VC readiness
Một submission chỉ trở thành evidence packet khi:
- đủ chất lượng
- đủ completeness
- nằm trong pathway có proof mapping
- không vi phạm policy

## Dashboard requirements
User phải thấy:
- bài đã nộp
- bài đang review
- bài bị yêu cầu sửa
- bài đã được xác nhận
- packet nào sắp đủ điều kiện proof

Admin / reviewer phải thấy:
- queue theo deadline
- status by course
- stale items
- review load
- disputed items

## Abuse controls
- duplicate submissions spam
- plagiarized content flags
- AI-only generic submission with no personal value
- fake evidence upload
- falsified project claims

## Definition of done
Submission Engine chỉ được coi là xong khi:
- user nộp được
- system validate được
- reviewer review được
- revision flow hoạt động
- approved state cập nhật completion
- packet tạo được cho VC pathway

## Kết luận
Submission là cầu nối giữa học và chứng minh. Nếu không có Submission Engine, EDU chỉ còn là content platform.
