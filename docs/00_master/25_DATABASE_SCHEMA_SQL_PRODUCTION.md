# 25_DATABASE_SCHEMA_SQL_PRODUCTION.md

Status: LOCKED (Non-negotiable)
Scope: Data schema tối thiểu cho V1 production
Áp dụng cho: BE · Data · Ops · QA
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## 1) Nguyên tắc

- Normalize
- Không duplication không cần thiết
- Mỗi bảng phục vụ state thật
- Chỉ build schema phục vụ core loop V1

---

## 2) USERS

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  level INT NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'vi',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 3) JOURNEY

```sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  stage TEXT NOT NULL,
  next_step TEXT,
  score JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 4) COURSES

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'vi',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 5) LESSONS

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  position INT NOT NULL,
  requires_submission BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, slug)
);
```

---

## 6) PROGRESS

```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  status TEXT NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

---

## 7) SUBMISSIONS

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL,
  review_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 8) VC BADGES / CREDENTIALS

```sql
CREATE TABLE vc_badges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  issued_at TIMESTAMP,
  evidence_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verify_code TEXT UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 9) EVENTS

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 10) TRANSACTIONS

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 11) Rule cuối

Schema production V1 phải phục vụ đúng login -> learn -> submit -> review -> VC -> dashboard.
Không mở thêm bảng economy sâu nếu core loop chưa khóa xong.
