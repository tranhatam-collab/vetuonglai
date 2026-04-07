# EDU_AI_FLOW_RUNTIME_SPEC

## 1. Mục tiêu

Biến AI từ "cửa sổ chat" thành "động cơ dẫn dắt hành trình học".

## 2. AI runtime loop

- nhận context hiện tại
- hiểu user đang ở bài nào
- hiểu user đang kẹt ở đâu
- trả lời
- gợi ý action
- ghi nhớ ngắn hạn
- cập nhật next step

## 3. AI entry points

- /ai/start-course
- /ai/start-lesson
- /ai/help
- /ai/action
- /ai/review-submission
- /ai/next-step

## 4. AI output contract

Mỗi response phải có:

- message
- suggested_actions
- recommended_resource
- next_step
- confidence

## 5. AI modes

- explainer mode
- coach mode
- project mode
- reflection mode
- review mode

## 6. Hard rules

- không nói như sách giáo khoa
- không trả lời dài vô hạn
- không bỏ user ở trạng thái "đã hiểu rồi nhưng không biết làm gì"
- luôn kết thúc bằng action hoặc next step
