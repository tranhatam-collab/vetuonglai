# 00_VETUONGLAI_MASTER_SYSTEM_LOCK_V1.md

Status: LOCKED (Non-negotiable)
Scope: Tất cả `*.vetuonglai.com` (hub + mọi subdomain)
Áp dụng cho: DEV · FE · BE · AI · Content · Design · QA · Ops · PM
Nguyên tắc: Đọc file này trước khi làm bất kỳ việc gì. Không tuân thủ = không được merge.
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## 0) Tuyên bố nền tảng

Về Tương Lai là Life System Platform.
Hệ không bán cảm xúc, không hứa kết quả. Hệ cung cấp cấu trúc để hiểu – học – làm – chứng minh – mở giá trị.

4 lớp cốt lõi, không đổi:

- Hiểu mình
- Làm được
- Có bằng chứng
- Mở giá trị

Chuỗi logic chuẩn:

`Hiểu mình -> Làm được -> Có bằng chứng -> Mở giá trị`

---

## 1) Kiến trúc hệ thống, khóa cứng

### 1.1. Năm lớp toàn hệ

#### LAYER 1 — CORE

- `vetuonglai.com` — Hub + Orchestration
- `member.vetuonglai.com` — Identity + Dashboard + Entitlement
- `vc.vetuonglai.com` — Verification / Registry
- `api.vetuonglai.com` — Orchestration + Data Sync

#### LAYER 2 — LEARNING / PROOF

- `edu.vetuonglai.com` — Learn -> Do -> Submit -> Review -> VC

#### LAYER 3 — LIFE SYSTEM

- `life.vetuonglai.com` — Rhythm
- `finance.vetuonglai.com` — Money basics
- `invest.vetuonglai.com` — Calm investing
- `green.vetuonglai.com` — Green proof

#### LAYER 4 — COMMUNITY, mở sau

- `community.vetuonglai.com`
- `stories.vetuonglai.com`
- `live.vetuonglai.com`
- `blog.vetuonglai.com`

#### LAYER 5 — ECONOMY, mở sau

- `work.vetuonglai.com`
- `market.vetuonglai.com`
- `ai.vetuonglai.com`
- `affiliate.vetuonglai.com`
- `tools.vetuonglai.com`

### 1.2. Rule kiến trúc

LAYER 1–3 phải chạy end-to-end trước khi mở LAYER 4–5.

Không được mở economy trước trust.
Không được mở expansion trước core loop.

---

## 2) Domain Boundaries, không chồng chéo

- Hub: giải thích + định tuyến. Không dạy sâu, không verify.
- Member: identity + quyền. Không chứa nội dung chuyên sâu.
- VC: xác minh. Không bán hàng, không dạy học.
- EDU: học + làm + nộp + proof. Không chỉ video.
- LIFE: nhịp sống. Không self-help.
- FIN: tiền cơ bản. Không “kiếm tiền”.
- INVEST: risk-first. Không kèo, không tín hiệu.
- GREEN: bằng chứng xanh. Không buzzword.

Bản phân vai ngắn gọn:

| Domain | Vai trò | Không được làm |
| --- | --- | --- |
| Hub | Điều hướng, giải thích hệ | Dạy học chuyên sâu, verify, bán như landing page |
| Member | Identity, entitlement, dashboard, next step | Chứa toàn bộ nội dung chuyên sâu |
| VC | Proof, registry, disclosure | Bán hàng, marketplace, hứa kết quả |
| EDU | Học -> làm -> nộp -> review -> proof | Chỉ là catalog video |
| LIFE | Rhythm, baseline, review | Self-help, chữa lành, hứa kết quả sức khỏe |
| FIN | Money basics, anti-scam | Làm giàu nhanh, trading, hype tiền |
| INVEST | Risk-first, due diligence | Kèo, tín hiệu, FOMO, hứa lợi nhuận |
| GREEN | Impact dossier, evidence packet, VC anchoring | Greenwashing, ESG buzzword |

---

## 3) Toàn hệ là web động, dynamic bắt buộc

### 3.1. Nguyên tắc

- Mọi trang là data-driven, không HTML tĩnh đơn lẻ.
- Nội dung render từ API + CMS + i18n.
- Mọi hành động tạo state thật: progress, submission, review, VC, dashboard, journey.
- Không làm trang đẹp nhưng rỗng.

### 3.2. Các bề mặt động bắt buộc

- User profile / dashboard tại `member`
- Course / lesson / progress tại `edu`
- Submission / review tại `edu`
- VC verify tại `/v/:code`
- Journey, next step
- Search toàn hệ
- Teaser + demo blocks

---

## 4) Liên kết logic xuyên hệ, khóa cứng

### 4.1. Flow chuẩn, không đổi

`Discover (public) -> Join (Pass) -> Learn (EDU) -> Submit (Action) -> Review (AI/Peer) -> Prove (VC) -> Next step (Hub)`

### 4.2. Quy tắc linking

Mỗi trang phải có:

- 1 CTA chính, không bán hàng
- 1 next step
- ít nhất 2 liên kết chéo domain

Không có trang cụt, không có dead-end.

---

## 5) Hệ nội dung động + media, bắt buộc

### 5.1. Mỗi bài / page phải có

- Hook 1–3 dòng
- Nội dung chính, 2–4 đoạn
- ít nhất 1 hình minh họa thật hoặc demo
- 1 demo block
- CTA chuẩn

### 5.2. Media rules

Không dùng stock giả tạo.

Ưu tiên:

- ảnh người thật / công việc thật
- UI demo thật
- checklist / sơ đồ / case / screenshot

Alt text phải trung tính, đúng chuẩn SEO.

---

## 6) Design System đa màu, cùng một hệ

### 6.1. Nguyên tắc

- 1 design system chung
- Mỗi domain có accent riêng
- Không đổi typography, spacing, component giữa các domain

### 6.2. Bảng màu chuẩn

| Domain | Màu chủ | Cảm giác |
| --- | --- | --- |
| Hub | Deep Teal `#1A6B6B` | Trung tâm, cân bằng |
| EDU | Sky Blue `#22D3EE` | Rõ ràng, học |
| LIFE | Soft Green `#4ADE80` | Bình ổn |
| FIN | Warm Gold `#FACC15` | Thực tế |
| INVEST | Indigo `#6366F1` | Chiến lược |
| GREEN | Emerald `#34D399` | Bền vững |
| VC | Slate / Indigo `#475569` / `#6366F1` | Tin cậy |

### 6.3. Component rules

- Card: bo 20px, nền sáng, shadow nhẹ
- Button: primary gradient, radius 16px
- Glass: blur 20–30px, chỉ dùng vừa đủ
- Motion: 200–400ms, không gây phân tâm

---

## 7) Language Codex, khóa cứng

### 7.1. Tone

- Calm
- Precise
- Real
- Long-term
- Non-sales

### 7.2. Bắt buộc

- Tiếng Việt có dấu 100%
- Tiếng Anh ngắn, rõ, không hype
- Không trộn Việt / Anh cùng dòng
- Không hard-code text, phải đi qua i18n

### 7.3. CTA chuẩn

- Khởi động đối thoại / Start dialogue
- Xem điểm vào / View entry point
- Tiếp tục tại hub / Continue at hub
- Xem lớp liên quan / Explore related layer

### 7.4. Badge chuẩn

- Live
- Member Preview
- Planned
- Bridge

### 7.5. Từ cấm

Tiếng Việt:

- đột phá
- đổi đời
- kiếm tiền nhanh
- tự do tài chính
- chữa lành
- truyền cảm hứng
- thành công nhanh
- đảm bảo

Tiếng Anh:

- coaching
- transformation
- breakthrough
- guaranteed return
- make money fast
- passive income
- inspiration
- boost
- maximize

---

## 8) i18n, bắt buộc

```text
/content/
  vi.json
  en.json
```

- Tất cả text đi qua i18n
- Không hiển thị DPM code
- Không hiển thị source state
- Không hiển thị internal label

---

## 9) Data & API, tối thiểu

### 9.1. Entities

- user
- journey
- course
- lesson
- progress
- submission
- vc_credential
- events

### 9.2. API ví dụ

- `/api/auth/*`
- `/api/courses/*`
- `/api/progress/*`
- `/api/submission/*`
- `/api/vc/*`
- `/api/journey/*`

---

## 10) Entitlement, khóa cứng

- `public_access`
- `future_access_member`
- `specialist_pack:<id>`
- `verified_builder`
- `partner_access`

Identity không bằng Entitlement.
Quyền truy cập chỉ do backend cấp.

---

## 11) Submission & Review, khóa EDU

`Learn -> Do -> Submit -> Review -> Approve -> VC`

- Không submit thì không completion
- Không review thì không VC
- Không VC thì không mở layer tiếp

---

## 12) SEO, bắt buộc

- Title: 50–60 ký tự
- Description: 140–160 ký tự
- 1 H1 cho mỗi page
- JSON-LD
- canonical + hreflang
- Paywalled content dùng structured data đúng chuẩn

---

## 13) QA Checklist trước release

- Không từ cấm
- Không nội ngữ nội bộ
- Không trộn Việt / Anh
- Không link lỗi 502 / 404
- Flow phải chạy end-to-end: login -> learn -> submit -> VC -> dashboard

---

## 14) Dev Sequence Lock, không đổi

### Phase 1, bắt buộc xong

1. `member` — auth + pass
2. `edu` — course + lesson
3. `submission`
4. `vc`
5. `dashboard`

### Phase 2

- AI tutor
- journey engine

### Phase 3

- work
- market
- affiliate

---

## 15) Quy tắc vận hành team

- Không code khi chưa rõ scope
- Không claim done khi thiếu evidence
- Không mở rộng khi core chưa xong
- Mọi thay đổi phải test được

---

## 16) Definition of Done, toàn hệ

Một feature chỉ được xem là DONE khi:

- user dùng được thật
- có dữ liệu thật
- có output / proof
- có log / evidence
- QA pass

---

## 17) Câu khóa cuối

Không cần làm nhiều hơn.
Cần làm đúng, đồng bộ và chạy thật.

---

## 18) Hướng mở rộng, không build ngay

- Community layer
- Work / Market
- Affiliate
- Creator economy
- Mobile app

---

## 19) Bắt buộc trước khi dev

Mỗi người phải:

- đọc file này
- hiểu domain mình làm
- hiểu flow toàn hệ

---

## 20) Bản dùng cho Notion / Confluence / GitHub Docs

### Overview

- Status: LOCKED
- Scope: All `*.vetuonglai.com`
- Priority: Highest
- Applies to: DEV / AI / Content / Design / QA / Ops / PM

### Core System

System Model:

`Understand -> Learn -> Do -> Prove -> Next Step`

Domains:

- Hub -> `vetuonglai.com`
- Identity -> `member.vetuonglai.com`
- Trust -> `vc.vetuonglai.com`
- Learning -> `edu.vetuonglai.com`
- Life -> `life.vetuonglai.com`
- Finance -> `finance.vetuonglai.com`
- Invest -> `invest.vetuonglai.com`
- Green -> `green.vetuonglai.com`

### Domain Boundaries

| Domain | Role | Not allowed |
| --- | --- | --- |
| Hub | routing | teaching |
| EDU | learning | verification |
| VC | proof | selling |
| LIFE | rhythm | self-help |
| FIN | money basics | making money |
| INVEST | risk | hype |
| GREEN | impact proof | ESG talk |

### Dynamic Web Rules

- All pages are data-driven
- No static-only pages
- Every page must have CTA, next step, demo, and cross-domain connection

### Design System

| Domain | Color |
| --- | --- |
| Hub | `#1A6B6B` |
| EDU | `#22D3EE` |
| LIFE | `#4ADE80` |
| FIN | `#FACC15` |
| INVEST | `#6366F1` |
| GREEN | `#34D399` |
| VC | `#475569` |

### Language Codex

Tone:

- calm
- precise
- non-sales

Forbidden:

- kiếm tiền nhanh
- đột phá
- coaching
- passive income

CTA:

- Khởi động đối thoại
- Xem điểm vào
- Tiếp tục tại hub

### Entitlement

- public_access
- member_access
- pack_access
- verified
- partner

Rule: Identity khác Access.

### Data Model

- user
- course
- lesson
- submission
- vc
- journey

### Flow

`User -> Login -> Learn -> Submit -> Review -> VC -> Dashboard`

### Definition of Done

- usable
- produces output
- stored in system
- verified
- QA passed

### Do Not

- build economy before proof
- hard-code text
- expose internal labels
- mix languages

### Final Rule

Build less. Build correct. Build connected.

---

## 21) Checklist task cho toàn team

### FE Team

#### P0

- Remove all hard-coded text
- Bind i18n (`vi.json`, `en.json`)
- Fix bilingual, không trộn dòng
- Fix nav, remove broken domains
- Apply domain colors
- Add CTA + next-step block cho mọi page

#### P1

- Build course player UI
- Build submission form
- Build VC verify UI
- Build dashboard UI

### BE Team

#### P0

- Auth system, magic link
- Payment webhook
- Member activation logic
- Entitlement service

#### P1

- Course API
- Submission API
- VC issue API
- Journey API

#### P2

- Recommendation engine
- Cross-domain sync

### AI Team

#### P0

- AI tutor basic chat
- Context-based responses

#### P1

- Lesson explain mode
- Action suggestion
- Review submission

#### P2

- Skill gap detection
- Personalized pathway

### Content Team

#### P0

- Rewrite all pages theo codex
- Remove marketing tone
- Remove internal labels

#### P1

- Add demo cho every page
- Add structured CTA
- Add cross-domain linking

### QA Team

#### P0

- Check language rules
- Check no forbidden words
- Check bilingual clean
- Check no broken links

#### P1

- Test full flow: login -> learn -> submit -> VC -> dashboard

### Product / PM

Daily check:

- What is built?
- What is real?
- What is fake UI?

Weekly check:

- Core loop working?
- Proof working?
- Journey updated?

### Critical priority order

1. Language
2. Auth + Pass
3. EDU loop
4. VC
5. Dashboard

### Câu chốt cho toàn team

Không được build thêm.
Chỉ được sửa cho đúng.
Khi đúng rồi, hệ sẽ tự mạnh.

---

## Kết luận

File này là chuẩn duy nhất, khóa toàn bộ hệ, và đảm bảo nhiều team vẫn build một hệ thống.
