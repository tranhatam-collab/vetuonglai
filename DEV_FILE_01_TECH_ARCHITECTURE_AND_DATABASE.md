# DEV FILE 01 — TECH ARCHITECTURE & DATABASE

Version: 1.0
Last updated: 2026-04-08
Status: active dev source of truth
Owner: BE / Infra lead

## Purpose

This file is the dev-facing technical architecture and database source of truth for the Gateway V2.1 direction.

It extends the existing V2 architecture with the 2 USD lifetime unlock, magic link auth, cross-domain session model, payment orchestration, and the minimum persistent entities needed to run the system safely.

## 1. Tech stack

```text
WEB FRONTEND
  Framework:        Next.js 14 App Router
  Rendering:        Hybrid SSR + static + route handlers
  Styling:          Tailwind CSS + shadcn/ui
  State:            Zustand + TanStack Query
  Forms:            React Hook Form + Zod

API / ORCHESTRATION
  Runtime:          Node.js 20+
  Framework:        Fastify
  Validation:       Zod or TypeBox
  Auth helpers:     jose + secure cookie utilities

DATABASE / CACHE
  Primary DB:       PostgreSQL
  Cache / queue:    Redis
  ORM / SQL layer:  Drizzle ORM or Prisma + raw SQL when needed

AI LAYER
  Primary model:    Claude API
  Support tasks:    content assist, journey suggestions, tutoring, moderation support

PAYMENTS
  Vietnam:          VNPay, MoMo, ZaloPay
  International:    Stripe

FILES / STORAGE
  Media / assets:   Cloudflare R2
  Static delivery:  Cloudflare + Vercel where needed

OBSERVABILITY
  Errors:           Sentry
  Product analytics: PostHog
  Uptime / smoke:   GitHub Actions + runtime smoke checks

EMAIL
  Transactional:    Resend

MONOREPO TOOLING
  Package manager:  pnpm
  Workspace:        pnpm workspaces + Turborepo recommended
```

## 2. Monorepo structure

```text
vetuonglai-platform/
  apps/
    web-hub/
    web-edu/
    web-vc/
    web-member/
    web-work/
    web-market/
    api/
    admin/
  packages/
    ui/
    auth/
    database/
    config/
    seo/
    analytics/
    gateway/
    vc/
  infra/
    github/
    cloudflare/
    vercel/
    scripts/
  docs/
  migrations/
```

Important:

- Current repo is still a static multi-site runtime system.
- This monorepo is the target implementation structure for the real app layer.
- Do not confuse target architecture with live runtime truth.

## 3. Runtime roles

```text
member.vetuonglai.com
  identity, unlock status, dashboard, journey engine, magic link entry

api.vetuonglai.com
  payment orchestration, auth verification, webhook handling, session validation

edu.vetuonglai.com
  public + gated learning content, AI tutor, progress, output submission

vc.vetuonglai.com
  verification registry, record display, VC claims and trust logic

work.vetuonglai.com
  public listings + gated application and proof-first matching

market.vetuonglai.com
  public product pages + gated purchase / access actions
```

## 4. Database schema overview

This file locks 9 core tables for the first real backend implementation:

1. `users`
2. `payments`
3. `magic_links`
4. `vc_badges`
5. `vc_claims`
6. `courses`
7. `content`
8. `jobs`
9. `transactions`

## 5. SQL schema

### 5.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  level VARCHAR(20) NOT NULL DEFAULT 'free',
  plan VARCHAR(20) NOT NULL DEFAULT 'free',
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  unlock_source VARCHAR(30),
  vc_badge_count INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMP,
  downgrade_grace_until TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_is_unlocked ON users(is_unlocked);
```

### 5.2 payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  gateway VARCHAR(20) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_vnd INTEGER,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  gateway_txn_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  idempotency_key VARCHAR(255) UNIQUE,
  raw_payload JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_payments_email ON payments(email);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
```

### 5.3 magic_links

```sql
CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id),
  token VARCHAR(500) NOT NULL UNIQUE,
  purpose VARCHAR(20) NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_magic_links_token ON magic_links(token);
CREATE INDEX idx_magic_links_email ON magic_links(email);
CREATE INDEX idx_magic_links_expires_at ON magic_links(expires_at);
```

### 5.4 vc_badges

```sql
CREATE TABLE vc_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  badge_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'issued',
  code VARCHAR(100) NOT NULL UNIQUE,
  evidence_url TEXT,
  issuer_domain VARCHAR(255) NOT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_vc_badges_user_id ON vc_badges(user_id);
CREATE INDEX idx_vc_badges_badge_type ON vc_badges(badge_type);
```

### 5.5 vc_claims

```sql
CREATE TABLE vc_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  badge_type VARCHAR(50) NOT NULL,
  source_domain VARCHAR(255) NOT NULL,
  source_ref VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  submitted_payload JSONB,
  reviewer_note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_vc_claims_user_id ON vc_claims(user_id);
CREATE INDEX idx_vc_claims_status ON vc_claims(status);
```

### 5.6 courses

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  access_level VARCHAR(20) NOT NULL DEFAULT 'gateway',
  vc_badge_type VARCHAR(50),
  price_cents INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
```

### 5.7 content

```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_key VARCHAR(50) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  access_level VARCHAR(20) NOT NULL DEFAULT 'discover',
  source_owner_url TEXT,
  canonical_url TEXT,
  author_user_id UUID REFERENCES users(id),
  body_json JSONB,
  seo_json JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(domain_key, slug)
);

CREATE INDEX idx_content_domain_slug ON content(domain_key, slug);
CREATE INDEX idx_content_type ON content(content_type);
```

### 5.8 jobs

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  employment_type VARCHAR(30),
  budget_min INTEGER,
  budget_max INTEGER,
  currency VARCHAR(10) DEFAULT 'VND',
  vc_required VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  access_level VARCHAR(20) NOT NULL DEFAULT 'gateway',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_status ON jobs(status);
```

### 5.9 transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  transaction_type VARCHAR(30) NOT NULL,
  source_type VARCHAR(30),
  source_id UUID,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  meta JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
```

## 6. Auth and JWT session model

### JWT payload

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "level": "free|pro|elite|partner",
  "plan": "free|gateway|pro|elite|partner",
  "is_unlocked": true,
  "unlocked_at": "2026-04-08T10:00:00.000Z",
  "vc_badges": ["learner_verified"],
  "permissions": ["content:read"],
  "session_id": "uuid"
}
```

### Cookie model

```text
Cookie name:      vtl_session
Domain:           .vetuonglai.com
Secure:           true
HttpOnly:         true
SameSite:         Lax
Path:             /
TTL:              30 days refresh / 1 hour access token
```

### Auth middleware rules

- Public pages render without auth.
- Hook pages can render teaser/demo without auth.
- Full access routes require valid session.
- `is_unlocked` must be checked before showing gateway-protected content.
- Domain middleware may enrich user state, but source verification must happen through `api.vetuonglai.com/auth/check` or equivalent shared auth package.

## 7. Level downgrade logic with 14-day grace period

Use this rule for paid or activity-based tiers above gateway unlock.

```text
If a user loses eligibility for current level:
  1. Do not downgrade immediately.
  2. Set downgrade_grace_until = NOW() + 14 days.
  3. Notify user with exact reason and recovery path.
  4. Re-check on grace expiry.
  5. Downgrade only if user still fails the requirement.

Gateway unlock itself is permanent unless refunded or fraud-revoked.
```

### Pseudocode

```ts
if (user.level === "elite" && !hasRequiredVcBadge(user)) {
  if (!user.downgrade_grace_until) {
    user.downgrade_grace_until = addDays(new Date(), 14);
    notifyGracePeriodStarted(user.id);
  } else if (new Date() > user.downgrade_grace_until) {
    user.level = "pro";
    user.downgrade_grace_until = null;
    notifyLevelChanged(user.id);
  }
}
```

## 8. Payment webhook handler references

### VNPay / MoMo handler requirements

- verify signature before any state change
- verify amount equals expected gateway unlock amount
- enforce idempotency by `gateway_txn_id` or `idempotency_key`
- upsert user by email
- mark payment success
- set `users.is_unlocked = true`
- trigger magic link email
- track analytics event

### Example Fastify pseudo-handler

```ts
app.post("/api/webhook/payment", async (request, reply) => {
  const payload = request.body as Record<string, unknown>;
  verifyWebhookSignature(request.headers, payload);

  const gateway = detectGateway(payload);
  const normalized = normalizePaymentPayload(gateway, payload);

  assertExpectedAmount(normalized.amount);

  const existing = await paymentRepo.findByGatewayTxnId(normalized.gatewayTxnId);
  if (existing?.status === "success") {
    return reply.code(200).send({ ok: true, duplicate: true });
  }

  const user = await userRepo.upsertByEmail(normalized.email, {
    plan: "gateway",
    is_unlocked: true,
    unlocked_at: new Date(),
  });

  await paymentRepo.markSuccess({
    userId: user.id,
    gateway: normalized.gateway,
    gatewayTxnId: normalized.gatewayTxnId,
    amountUsd: normalized.amountUsd,
    amountVnd: normalized.amountVnd,
    rawPayload: payload,
  });

  await magicLinkService.sendUnlockLink(user.email, user.id);
  await analytics.track("gateway_unlocked", { userId: user.id, gateway });

  return reply.code(200).send({ ok: true });
});
```

## 9. API surface (40+ endpoints)

### Auth / unlock

1. `POST /api/unlock/initiate`
2. `POST /api/unlock/payment-intent`
3. `POST /api/webhook/payment`
4. `GET /api/magic/:token`
5. `POST /api/magic/resend`
6. `POST /api/auth/logout`
7. `GET /api/auth/check`
8. `POST /api/auth/refresh`

### Users / member

9. `GET /api/users/me`
10. `PATCH /api/users/me`
11. `GET /api/users/me/journey`
12. `GET /api/users/me/dashboard`
13. `GET /api/users/me/badges`
14. `GET /api/users/me/transactions`

### Courses / EDU

15. `GET /api/courses`
16. `GET /api/courses/:slug`
17. `GET /api/courses/:slug/modules`
18. `GET /api/courses/:slug/eligibility`
19. `POST /api/courses/:slug/progress`
20. `GET /api/lessons/:lessonId`
21. `POST /api/lessons/:lessonId/reflection`
22. `POST /api/lessons/:lessonId/output`

### AI

23. `POST /api/ai/chat`
24. `POST /api/ai/tutor`
25. `POST /api/ai/niche-finder`
26. `POST /api/ai/content-outline`

### VC

27. `GET /api/vc/records/:code`
28. `GET /api/vc/badges`
29. `POST /api/vc/claims`
30. `GET /api/vc/claims/:id`
31. `POST /api/vc/issue`
32. `GET /api/vc/verify`

### Work

33. `GET /api/jobs`
34. `GET /api/jobs/:slug`
35. `POST /api/jobs/:slug/apply`
36. `GET /api/jobs/:slug/applicants`

### Market

37. `GET /api/market/products`
38. `GET /api/market/products/:slug`
39. `POST /api/market/products/:slug/purchase`
40. `GET /api/market/orders/:id`

### Content / SEO / public layer

41. `GET /api/content/:domain/:slug`
42. `GET /api/content/:domain/:slug/schema`
43. `GET /api/search`

### Admin / ops

44. `GET /api/admin/dashboard`
45. `GET /api/admin/payments`
46. `GET /api/admin/magic-links`
47. `GET /api/admin/vc-claims`
48. `POST /api/admin/vc-claims/:id/review`

## 10. Required environment variables

```text
APP_ENV
APP_URL
API_BASE_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_MEMBER_URL

DATABASE_URL
REDIS_URL

JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
MAGIC_LINK_SECRET
COOKIE_DOMAIN=.vetuonglai.com

RESEND_API_KEY
EMAIL_FROM

CLAUDE_API_KEY

VNPAY_TMN_CODE
VNPAY_HASH_SECRET
VNPAY_RETURN_URL

MOMO_PARTNER_CODE
MOMO_ACCESS_KEY
MOMO_SECRET_KEY
MOMO_RETURN_URL

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET

SENTRY_DSN
POSTHOG_KEY
POSTHOG_HOST
```

## 11. Definition of done

This file is only considered implemented when:

- database migrations exist for all 9 tables
- webhook idempotency is enforced
- cross-domain auth works on real subdomains
- JWT payload matches the locked spec
- downgrade grace-period logic exists in backend policy code
- the API surface is mapped to actual route handlers or tracked backlog items
