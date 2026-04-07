# EDU AI TUTOR SYSTEM DEEP SPEC

Version: 1.0
Last updated: 2026-04-07

## 0. Mục tiêu hệ AI Tutor

AI Tutor không phải chatbot hỏi đáp.

AI Tutor là:

- người hướng dẫn cá nhân
- người phân tích năng lực
- người thiết kế lộ trình
- người thúc đẩy hành động

## 1. Kiến trúc tổng thể

### 1.1 System layers

```text
User
 ↓
UI Chat / Voice
 ↓
AI Tutor Engine
 ↓
Context Engine
 ↓
Learning Path Engine
 ↓
Action Engine (Tasks / Projects)
 ↓
Proof Engine (VC)
```

## 2. Core modules

### 2.1 AI Tutor Engine

Chức năng:

- nhận input user
- hiểu context
- trả lời theo level
- gợi ý hành động

Input:

```json
{
  "user_id": "u_123",
  "message": "Tôi muốn khởi nghiệp",
  "context": {
    "level": "beginner",
    "goal": null,
    "history": []
  }
}
```

Output:

```json
{
  "reply": "Bạn muốn khởi nghiệp lĩnh vực nào?",
  "next_actions": [
    "Chọn lĩnh vực",
    "Làm bài test định hướng"
  ],
  "recommended_content": ["course_001"],
  "recommended_project": null
}
```

### 2.2 Context Engine

Nhiệm vụ:

Giữ trạng thái người dùng.

Lưu:

- mục tiêu
- trình độ
- lịch sử học
- hành vi
- project đã làm

KV / DB structure:

```text
user_context:{
  user_id,
  level,
  goal,
  interests,
  progress,
  history
}
```

### 2.3 Learning Path Engine

Nhiệm vụ:

Sinh lộ trình động.

Input:

```json
{
  "goal": "startup",
  "level": "beginner"
}
```

Output:

```json
{
  "path": [
    "mindset",
    "problem_finding",
    "solution_design",
    "build_mvp",
    "test_market"
  ]
}
```

### 2.4 Action Engine

Nhiệm vụ:

Chuyển học -> hành động.

Ví dụ:

```json
{
  "action": "Tạo ý tưởng kinh doanh",
  "type": "task",
  "deadline": "3 ngày"
}
```

### 2.5 Memory System

Có 2 loại:

- Short-term: session hiện tại
- Long-term: lưu KV / DB

## 3. AI response rules

### 3.1 Không được

- trả lời chung chung
- nói dài dòng
- dạy lý thuyết suông

### 3.2 Phải

- hỏi lại nếu chưa rõ
- cá nhân hóa
- luôn có bước tiếp theo

Format bắt buộc:

```json
{
  "explanation": "...",
  "next_step": "...",
  "action": "...",
  "time_estimate": "..."
}
```

## 4. AI prompt system

### 4.1 System prompt

```text
You are an AI Tutor for a future-oriented education system.

Rules:
- Do not teach abstract theory.
- Focus on real-world application.
- Always guide user to action.
- Personalize based on user level.
- Keep responses clear and structured.
- Always suggest next step.

User is learning to build a real life, not pass exams.
```

### 4.2 Level adaptation

Beginner:

- giải thích đơn giản
- ví dụ cụ thể

Intermediate:

- phân tích sâu hơn

Advanced:

- chiến lược + tối ưu

## 5. User journey with AI

### 5.1 First-time user

AI hỏi:

- bạn muốn gì?
- bạn đang ở đâu?
- bạn có kinh nghiệm gì?

### 5.2 Mapping

AI xác định:

- level
- path
- first action

### 5.3 Loop học

Hỏi -> Hiểu -> Làm -> Feedback -> Cải thiện

## 6. UI/UX cho AI

### 6.1 Chat UI

Phải có:

- message
- suggested actions
- quick buttons

Example:

```text
AI: Bạn muốn khởi nghiệp ngành nào?

[ Công nghệ ]
[ Giáo dục ]
[ Kinh doanh nhỏ ]
```

### 6.2 Action button

- `Bắt đầu bài`
- `Tạo project`
- `Tiếp tục`

## 7. API design

### 7.1 POST /api/ai/chat

Request:

```json
{
  "message": "...",
  "user_id": "...",
  "context": {}
}
```

Response:

```json
{
  "reply": "...",
  "actions": [],
  "path": [],
  "project": {}
}
```

## 8. Integration với EDU

AI phải gọi được:

- courses
- projects
- VC

## 9. Project generation

AI có thể tạo:

```json
{
  "project_name": "Startup idea validation",
  "steps": [
    "Xác định vấn đề",
    "Phỏng vấn 5 người",
    "Viết giải pháp"
  ]
}
```

## 10. Safety & ethics

- không tạo ảo tưởng thành công
- không bias
- không spam nội dung

## 11. Roadmap build

Phase 1:

- chat cơ bản
- context đơn giản

Phase 2:

- learning path
- project

Phase 3:

- AI cá nhân hóa sâu
- VC integration

## Kết luận

AI Tutor là trái tim của EDU.

Nếu build đúng:

- hệ giáo dục sẽ trở thành hệ giáo dục sống
