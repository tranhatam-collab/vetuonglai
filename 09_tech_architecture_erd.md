# 09_tech_architecture_erd

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · INFRA · OPS

## A. Tech stack

```text
FRONTEND
  Framework:    Next.js 14 App Router
  Styling:      Tailwind CSS + shadcn/ui
  State:        Zustand + React Query
  Mobile:       React Native (Phase 3)

BACKEND
  API Gateway:  Node.js Fastify hoặc Python FastAPI
  Search:       MeiliSearch
  Storage:      Cloudflare R2
  CDN:          Cloudflare

AI LAYER
  Primary:      Claude API
  Embedding:    text-embedding-3-small
  Moderation:   Custom classifier + Claude

PAYMENT
  Nội địa:      VNPay + MoMo + ZaloPay
  Quốc tế:      Stripe

INFRA
  Frontend:     Vercel
  Backend:      Railway (Phase 1-2) -> AWS (Phase 3+)
  CI/CD:        GitHub Actions
  Monitor:      Sentry + PostHog
  Email:        Resend
```

## B. Auth / Database — 2 lộ trình

### Lộ trình A (recommended, Phase 2+)

- Auth: Clerk
- Database: PostgreSQL self-hosted hoặc managed trên Railway / Render

### Lộ trình B (fast launch, Phase 1)

- Auth: Supabase Auth
- Database: Supabase PostgreSQL
- Trade-off: launch nhanh hơn nhưng ít kiểm soát hơn

### Migration path

- Có thể đi từ B -> A khi đạt mốc 1.000+ users active hoặc khi multi-domain auth complexity tăng rõ.

## C. SSO architecture

- `member.vetuonglai.com` là dashboard trung tâm của identity layer.
- các subdomain trust token từ auth layer trung tâm
- JWT / session payload nên có:
  - userId
  - level
  - VC badges array
  - permissions

## D. Core database entities

```text
users: id, email, level, points, created_at
vc_badges: id, user_id, type, issued_at, evidence_url, status
content: id, user_id, type, tier, status, metrics
transactions: id, from_user, to_user, amount, type, platform_fee
jobs: id, poster_id, type, budget, status, escrow_amount
courses: id, creator_id, modules, vc_required, price
journey_profiles: user_id, current_stage, next_step, risk_flags
```

## E. `api.vetuonglai.com` — orchestration layer

Vai trò:
- cross-domain data sync
- journey engine processing
- webhook handling
- rate limiting
- partner API key management

## F. Journey Engine trong kiến trúc V2

Journey Engine không phải subdomain riêng trong Phase 1-2.

Nó là logic service + widget trong member dashboard:
- input: user stage + badges + activity history + goals
- output: next best action

## G. Nguyên tắc runtime

- phase target phải tách khỏi runtime truth hiện tại
- domain planned không được gắn live trong docs kỹ thuật runtime
- smoke tests và runtime truth là source kiểm tra cuối cùng

## H. Definition of done cho tech architecture

Chỉ được coi là xong khi:
- auth strategy rõ
- migration path rõ
- orchestration responsibilities rõ
- entity model đủ cho team FE/BE/Data cùng làm
