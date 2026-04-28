# trust.iai.one — Development & Deployment Guide

> Production-ready guide for building and shipping the Trust Infrastructure Platform.
> Last updated: 2026-04-28

---

## 1. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui | SSR/SSG, type safety, rapid UI |
| Backend | Next.js API Routes + Cloudflare Workers | Edge-first, low latency globally |
| Database | PostgreSQL 15+ (Supabase or Neon) | Relational integrity, JSONB for flexible metadata |
| ORM | Prisma 5+ | Type-safe queries, migrations, seeding |
| Auth | NextAuth.js v5 | Magic link (Resend), Google OAuth |
| Payments | Stripe SDK, PayPal REST API, PayOS (VN QR bank) | Global + Vietnam coverage |
| File Storage | Cloudflare R2 | S3-compatible, zero egress fees |
| Blockchain | ethers.js v6 | Optional asset minting on EVM chains |
| Monitoring | Sentry, Cloudflare Analytics | Error tracking + traffic insights |
| Email | Resend | Transactional email (magic links, receipts) |
| Validation | Zod | Runtime schema validation |

---

## 2. Project Structure

```
trust.iai.one/
├── apps/
│   ├── web/                    # Next.js frontend + API routes
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, register, verify-email
│   │   │   ├── (dashboard)/    # Authenticated pages
│   │   │   ├── (public)/       # Landing, pricing, verify page
│   │   │   ├── api/
│   │   │   │   ├── v1/         # Versioned API routes
│   │   │   │   ├── auth/       # NextAuth handlers
│   │   │   │   └── webhooks/   # Stripe, PayPal, PayOS
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   ├── middleware.ts
│   │   └── next.config.ts
│   ├── api/                    # Standalone Cloudflare Workers
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.ts
│   │   └── wrangler.toml
│   └── admin/                  # Admin panel (Next.js)
│       ├── app/
│       └── next.config.ts
├── packages/
│   ├── core/                   # Shared types, utils, constants
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── db/                     # Prisma schema + migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   └── client.ts
│   │   └── package.json
│   ├── proof-engine/           # Hash, timestamp, verify logic
│   │   ├── src/
│   │   │   ├── create.ts
│   │   │   ├── verify.ts
│   │   │   ├── hash.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── vc-engine/              # Issue, revoke, expire, verify VCs
│   │   ├── src/
│   │   │   ├── issue.ts
│   │   │   ├── revoke.ts
│   │   │   ├── verify.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── asset-engine/           # Mint, transfer, history
│   │   ├── src/
│   │   │   ├── mint.ts
│   │   │   ├── transfer.ts
│   │   │   ├── history.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── ui/                     # Shared UI components (shadcn/ui based)
│       ├── src/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── dialog.tsx
│       │   └── index.ts
│       └── package.json
├── docs/
├── scripts/
│   ├── setup.sh
│   ├── seed.ts
│   └── generate-api-key.ts
├── infra/                      # Terraform/Pulumi
│   ├── cloudflare/
│   ├── supabase/
│   └── main.ts
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── pull_request_template.md
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .env.example
└── .eslintrc.js
```

---

## 3. Environment Setup

### Prerequisites

```bash
node --version   # v20.0.0+
pnpm --version   # v9.0.0+
docker --version # optional, for local PostgreSQL
```

### Clone & Install

```bash
git clone git@github.com:your-org/trust.iai.one.git
cd trust.iai.one
pnpm install
```

### .env.example

Create `.env` from the example. Every variable is documented:

```bash
# ──────────────── Database ────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/trust_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/trust_dev"  # For Prisma migrations (bypasses pooler)

# ──────────────── Auth ────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32"  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ──────────────── Email (Resend) ────────────────
RESEND_API_KEY=""
EMAIL_FROM="trust@iai.one"

# ──────────────── Payments ────────────────
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_WEBHOOK_ID=""
PAYPAL_MODE="sandbox"  # sandbox | live

# PayOS (VN QR Bank)
PAYOS_CLIENT_ID=""
PAYOS_API_KEY=""
PAYOS_CHECKSUM_KEY=""

# ──────────────── Storage ────────────────
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="trust-files"
R2_PUBLIC_URL="https://files.trust.iai.one"

# ──────────────── Blockchain (optional) ────────────────
CHAIN_RPC_URL="https://polygon-rpc.com"
MINTER_PRIVATE_KEY=""  # DO NOT commit

# ──────────────── Monitoring ────────────────
SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""

# ──────────────── Cloudflare ────────────────
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_API_TOKEN=""
```

### Database Setup

```bash
# Option A: Docker
docker run -d --name trust-pg \
  -e POSTGRES_DB=trust_dev \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# Option B: Use Supabase/Neon cloud DB (set DATABASE_URL in .env)

# Run migrations
pnpm db:migrate

# Seed test data
pnpm db:seed
```

### Local Development

```bash
# Run all apps concurrently (via Turborepo)
pnpm dev

# Run specific apps
pnpm dev:web     # http://localhost:3000
pnpm dev:api     # http://localhost:8787 (wrangler)
pnpm dev:admin   # http://localhost:3001
```

### Turbo Config (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint": {},
    "type-check": {},
    "test": { "dependsOn": ["^build"] },
    "db:migrate": { "cache": false },
    "db:seed": { "cache": false }
  }
}
```

---

## 4. Development Workflow

### Branch Strategy

```
main ──────────────────────────────── production (auto-deploy)
  └── staging ─────────────────────── staging env (auto-deploy)
        ├── feat/proof-engine
        ├── feat/vc-issue
        ├── fix/auth-redirect
        └── chore/update-deps
```

- **Feature branches** → PR to `staging`
- **staging** → PR to `main` (after QA)
- **Hotfixes** → branch from `main`, PR to `main`, cherry-pick to `staging`

### PR Template (`.github/pull_request_template.md`)

```markdown
## What changed?
<!-- Brief description -->

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Docs

## Checklist
- [ ] Types pass (`pnpm type-check`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] Tested locally
- [ ] DB migration included (if schema changed)
- [ ] Environment variables documented (if added)
- [ ] No secrets committed
```

### CI/CD (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
    branches: [main, staging]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
```

### Pre-commit Hooks (via `lint-staged` + `husky`)

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.prisma": ["prisma format"]
  }
}
```

```bash
# Setup
pnpm add -Dw husky lint-staged
npx husky init
echo "pnpm lint-staged" > .husky/pre-commit
```

---

## 5. API Development

### Route Structure

```
/api/v1/proofs/create       POST
/api/v1/proofs/verify       POST
/api/v1/proofs/:id          GET
/api/v1/credentials/issue   POST
/api/v1/credentials/revoke  POST
/api/v1/credentials/verify  POST
/api/v1/assets/mint         POST
/api/v1/assets/transfer     POST
/api/v1/assets/:id/history  GET
/api/v1/billing/checkout    POST
/api/v1/billing/portal      POST
/api/health                 GET
```

### Middleware Chain

```typescript
// apps/web/lib/api/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyApiKey, verifySession } from "./auth";
import { rateLimit } from "./rate-limit";
import { ApiError, errorResponse } from "./errors";

type Handler<T = unknown> = (
  req: NextRequest,
  context: { userId: string; body: T }
) => Promise<NextResponse>;

interface PipelineOptions<T> {
  schema?: z.ZodSchema<T>;
  auth: "session" | "api-key" | "public";
  rateLimit?: { window: number; max: number };
}

export function createHandler<T>(
  options: PipelineOptions<T>,
  handler: Handler<T>
) {
  return async (req: NextRequest) => {
    try {
      // 1. Rate limit
      if (options.rateLimit) {
        const ip = req.headers.get("x-forwarded-for") ?? "unknown";
        const allowed = await rateLimit(ip, options.rateLimit);
        if (!allowed) {
          throw new ApiError("RATE_LIMITED", "Too many requests", 429);
        }
      }

      // 2. Auth
      let userId = "";
      if (options.auth === "session") {
        userId = await verifySession(req);
      } else if (options.auth === "api-key") {
        userId = await verifyApiKey(req);
      }

      // 3. Validate body
      let body: T = undefined as T;
      if (options.schema) {
        const raw = await req.json();
        const result = options.schema.safeParse(raw);
        if (!result.success) {
          throw new ApiError(
            "VALIDATION_ERROR",
            result.error.issues[0].message,
            400
          );
        }
        body = result.data;
      }

      // 4. Execute handler
      return await handler(req, { userId, body });
    } catch (err) {
      return errorResponse(err);
    }
  };
}
```

### Error Handling

```typescript
// apps/web/lib/api/errors.ts

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PAYMENT_REQUIRED"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public override message: string,
    public status: number
  ) {
    super(message);
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { ok: false, error: { code: err.code, message: err.message } },
      { status: err.status }
    );
  }
  console.error("Unhandled error:", err);
  return NextResponse.json(
    { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
    { status: 500 }
  );
}
```

### Response Format

All API responses follow this shape:

```typescript
// Success
{ "ok": true, "data": { ... } }

// Error
{ "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }

// Paginated
{ "ok": true, "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }
```

### Example Route

```typescript
// apps/web/app/api/v1/proofs/create/route.ts

import { z } from "zod";
import { NextResponse } from "next/server";
import { createHandler } from "@/lib/api/middleware";
import { createProof } from "@trust/proof-engine";
import { db } from "@trust/db";

const schema = z.object({
  name: z.string().min(1).max(255),
  data: z.string().min(1),            // raw content or file hash
  type: z.enum(["document", "image", "code", "text"]),
  metadata: z.record(z.string()).optional(),
});

export const POST = createHandler(
  { schema, auth: "session", rateLimit: { window: 60, max: 30 } },
  async (req, { userId, body }) => {
    const proof = await createProof({
      userId,
      name: body.name,
      data: body.data,
      type: body.type,
      metadata: body.metadata,
    });

    await db.proof.create({ data: proof });

    return NextResponse.json({ ok: true, data: proof }, { status: 201 });
  }
);
```

---

## 6. Database Management

### Prisma Schema (key models)

```prisma
// packages/db/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  plan          Plan      @default(FREE)
  stripeId      String?   @unique
  apiKeys       ApiKey[]
  proofs        Proof[]
  credentials   Credential[]
  assets        Asset[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}

model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  keyHash     String   @unique  // SHA-256 hash, never store plaintext
  prefix      String             // first 8 chars for display: "tr_1a2b..."
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  createdAt   DateTime @default(now())

  @@index([keyHash])
  @@index([userId])
}

model Proof {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  type        String
  dataHash    String   // SHA-256 of original data
  timestamp   DateTime @default(now())
  txHash      String?  // blockchain tx (optional)
  metadata    Json?
  status      ProofStatus @default(ACTIVE)
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([dataHash])
}

model Credential {
  id          String   @id @default(cuid())
  issuerId    String
  issuer      User     @relation(fields: [issuerId], references: [id], onDelete: Cascade)
  subjectId   String
  subjectName String
  type        String
  claims      Json
  issuedAt    DateTime @default(now())
  expiresAt   DateTime?
  revokedAt   DateTime?
  status      CredentialStatus @default(ACTIVE)
  signature   String   // HMAC or Ed25519 sig
  createdAt   DateTime @default(now())

  @@index([issuerId])
  @@index([subjectId])
}

model Asset {
  id          String   @id @default(cuid())
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  name        String
  description String?
  fileUrl     String?
  fileHash    String?
  tokenId     String?  // on-chain token ID
  contractAddr String?
  transfers   AssetTransfer[]
  createdAt   DateTime @default(now())

  @@index([ownerId])
}

model AssetTransfer {
  id        String   @id @default(cuid())
  assetId   String
  asset     Asset    @relation(fields: [assetId], references: [id])
  fromId    String
  toId      String
  txHash    String?
  createdAt DateTime @default(now())

  @@index([assetId])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // e.g. "proof.create", "credential.revoke"
  resource  String   // e.g. "proof:clx..."
  ip        String?
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum ProofStatus {
  ACTIVE
  ARCHIVED
}

enum CredentialStatus {
  ACTIVE
  REVOKED
  EXPIRED
}
```

### Migration Workflow

```bash
# Development: create migration from schema changes
pnpm db:migrate          # prisma migrate dev --name <name>

# Push schema without migration (prototyping only)
pnpm db:push             # prisma db push

# Seed database
pnpm db:seed             # tsx packages/db/prisma/seed.ts

# Production: apply pending migrations
pnpm db:migrate:prod     # prisma migrate deploy

# View database in browser
pnpm db:studio           # prisma studio
```

### Package Scripts (`packages/db/package.json`)

```json
{
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "push": "prisma db push",
    "seed": "tsx prisma/seed.ts",
    "migrate:prod": "prisma migrate deploy",
    "studio": "prisma studio"
  }
}
```

### Connection Pooling

For production with Supabase, use their built-in PgBouncer:

```
DATABASE_URL="postgresql://...@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...@db.xxx.supabase.co:5432/postgres"
```

### Backup Strategy

- **Supabase**: automated daily backups (Pro plan), point-in-time recovery
- **Self-hosted**: `pg_dump` cron job → upload to R2
- **Neon**: built-in branching and PITR

---

## 7. Authentication Flow

### NextAuth Configuration

```typescript
// apps/web/lib/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@trust/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.plan = token.plan as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/check-email",
  },
});
```

### API Key Authentication

```typescript
// apps/web/lib/api/auth.ts

import { createHash, randomBytes } from "crypto";
import { db } from "@trust/db";

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `tr_${randomBytes(32).toString("hex")}`;
  const hash = createHash("sha256").update(key).digest("hex");
  const prefix = key.slice(0, 11); // "tr_1a2b3c4d"
  return { key, hash, prefix };
}

export async function verifyApiKey(req: Request): Promise<string> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer tr_")) {
    throw new ApiError("UNAUTHORIZED", "Missing or invalid API key", 401);
  }

  const key = header.slice(7); // remove "Bearer "
  const hash = createHash("sha256").update(key).digest("hex");

  const apiKey = await db.apiKey.findUnique({ where: { keyHash: hash } });
  if (!apiKey) {
    throw new ApiError("UNAUTHORIZED", "Invalid API key", 401);
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    throw new ApiError("UNAUTHORIZED", "API key expired", 401);
  }

  // Update last used
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey.userId;
}
```

### Session Middleware (for pages)

```typescript
// apps/web/middleware.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

---

## 8. Payment Integration

### Stripe Setup

```typescript
// apps/web/lib/payments/stripe.ts

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// Products & Prices (create once via script or Stripe dashboard)
export const PLANS = {
  FREE: { priceId: null, limits: { proofs: 10, credentials: 5, apiCalls: 100 } },
  PRO: {
    priceId: "price_xxx",  // $19/mo
    limits: { proofs: 1000, credentials: 500, apiCalls: 50000 },
  },
  ENTERPRISE: {
    priceId: "price_yyy",  // $99/mo
    limits: { proofs: -1, credentials: -1, apiCalls: -1 }, // unlimited
  },
} as const;

export async function createCheckoutSession(userId: string, priceId: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });

  // Create or retrieve Stripe customer
  let customerId = user.stripeId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email });
    customerId = customer.id;
    await db.user.update({ where: { id: userId }, data: { stripeId: customerId } });
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
    metadata: { userId },
  });
}

export async function createBillingPortal(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  });
}
```

### Stripe Webhook Handler

```typescript
// apps/web/app/api/webhooks/stripe/route.ts

import { stripe } from "@/lib/payments/stripe";
import { db } from "@trust/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Idempotency: check if already processed
  const existing = await db.auditLog.findFirst({
    where: { action: "stripe.webhook", resource: event.id },
  });
  if (existing) {
    return new Response("Already processed", { status: 200 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: { plan: "PRO" },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const user = await db.user.findFirst({
        where: { stripeId: sub.customer as string },
      });
      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: { plan: "FREE" },
        });
      }
      break;
    }
  }

  // Log for idempotency
  await db.auditLog.create({
    data: {
      userId: "system",
      action: "stripe.webhook",
      resource: event.id,
      metadata: { type: event.type },
    },
  });

  return new Response("OK", { status: 200 });
}
```

### PayPal Integration

```typescript
// apps/web/lib/payments/paypal.ts

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: number, currency = "USD") {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: currency, value: amount.toFixed(2) },
      }],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/api/v1/billing/paypal/capture`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      },
    }),
  });

  return res.json();
}
```

### VN QR Bank (PayOS)

```typescript
// apps/web/lib/payments/payos.ts

import PayOS from "@payos/node";

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export async function createQRPayment(params: {
  orderCode: number;
  amount: number;
  description: string;
  userId: string;
}) {
  return payos.createPaymentLink({
    orderCode: params.orderCode,
    amount: params.amount,
    description: params.description,
    returnUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
    cancelUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
  });
}

// Webhook verification
export async function verifyPayOSWebhook(body: any) {
  return payos.verifyPaymentWebhookData(body);
}
```

---

## 9. Deployment

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Cloudflare Edge                      │
│                                                        │
│  ┌─────────────────┐     ┌──────────────────────┐    │
│  │ Cloudflare Pages │     │ Cloudflare Workers    │    │
│  │ (Next.js SSR)    │     │ (Edge API)            │    │
│  │ trust.iai.one    │     │ api.trust.iai.one     │    │
│  └────────┬─────────┘     └──────────┬────────────┘    │
│           │                          │                  │
│  ┌────────┴──────────────────────────┴────────────┐    │
│  │              Cloudflare R2 (files)              │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Supabase / Neon    │
              │  PostgreSQL 15      │
              │  (managed, pooled)  │
              └─────────────────────┘
```

### Domain Setup

1. Add `trust.iai.one` to Cloudflare DNS
2. CNAME `trust.iai.one` → Cloudflare Pages project
3. CNAME `api.trust.iai.one` → Cloudflare Workers route
4. CNAME `files.trust.iai.one` → R2 custom domain
5. SSL: automatic (Cloudflare Universal SSL)

### Deploy Configuration

**Cloudflare Pages (`apps/web`):**

```toml
# apps/web/wrangler.toml (Pages config)
name = "trust-web"
compatibility_date = "2024-04-01"

[build]
command = "pnpm build"
cwd = "apps/web"

[[routes]]
pattern = "trust.iai.one/*"
```

**Cloudflare Workers (`apps/api`):**

```toml
# apps/api/wrangler.toml
name = "trust-api"
main = "src/index.ts"
compatibility_date = "2024-04-01"

[vars]
ENVIRONMENT = "production"

[[r2_buckets]]
binding = "FILES"
bucket_name = "trust-files"

routes = [
  { pattern = "api.trust.iai.one/*", zone_name = "iai.one" }
]
```

### GitHub Actions Deploy (`.github/workflows/deploy.yml`)

```yaml
name: Deploy
on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      # Deploy frontend
      - name: Deploy Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy apps/web/.next --project-name=trust-web

      # Deploy API worker
      - name: Deploy Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
          workingDirectory: apps/api

      # Run migrations
      - name: Migrate DB
        run: pnpm db:migrate:prod
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 10. Deployment Commands

```bash
# ──────────── Build ────────────
pnpm build                  # Build all apps and packages
pnpm build --filter=web     # Build web only

# ──────────── Deploy ────────────
pnpm deploy:web             # wrangler pages deploy (frontend)
pnpm deploy:api             # wrangler deploy (workers)
pnpm deploy:admin           # wrangler pages deploy (admin)

# ──────────── Database ────────────
pnpm db:migrate             # Dev: create + apply migration
pnpm db:migrate:prod        # Prod: apply pending migrations
pnpm db:push                # Push schema (no migration file)
pnpm db:seed                # Seed test data
pnpm db:studio              # Open Prisma Studio

# ──────────── Verify ────────────
curl https://trust.iai.one/api/health
# → {"ok":true,"version":"1.0.0","timestamp":"..."}

curl -H "Authorization: Bearer tr_xxx" \
  https://trust.iai.one/api/v1/proofs/create \
  -d '{"name":"test","data":"hello","type":"text"}'

# ──────────── Logs ────────────
wrangler tail trust-api     # Stream worker logs
```

### Root `package.json` Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:web": "turbo dev --filter=web",
    "dev:api": "turbo dev --filter=api",
    "dev:admin": "turbo dev --filter=admin",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "test": "turbo test",
    "deploy:web": "wrangler pages deploy apps/web/.next --project-name=trust-web",
    "deploy:api": "wrangler deploy --config apps/api/wrangler.toml",
    "deploy:admin": "wrangler pages deploy apps/admin/.next --project-name=trust-admin",
    "db:migrate": "pnpm --filter=db migrate",
    "db:migrate:prod": "pnpm --filter=db migrate:prod",
    "db:push": "pnpm --filter=db push",
    "db:seed": "pnpm --filter=db seed",
    "db:studio": "pnpm --filter=db studio"
  }
}
```

---

## 11. Monitoring & Alerting

### Sentry Setup

```typescript
// apps/web/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,         // 10% of transactions
  replaysSessionSampleRate: 0.01, // 1% session replay
  environment: process.env.NODE_ENV,
});
```

```typescript
// apps/web/next.config.ts
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "trust-web",
  silent: true,
  widenClientFileUpload: true,  // Upload source maps
});
```

### Health Check Endpoint

```typescript
// apps/web/app/api/health/route.ts

import { db } from "@trust/db";

export async function GET() {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({
      ok: true,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      db: "connected",
      latency: `${Date.now() - start}ms`,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Database unreachable" },
      { status: 503 }
    );
  }
}
```

### Alerting

| Metric | Threshold | Channel |
|--------|-----------|---------|
| API error rate | > 5% over 5min | Slack `#trust-alerts` |
| API p99 latency | > 2s | Slack |
| Uptime | < 99.9% | PagerDuty |
| Failed payments | > 3 consecutive | Slack + email |
| DB connections | > 80% pool | Slack |

Configure Cloudflare Health Checks for `https://trust.iai.one/api/health` with 1-minute interval.

---

## 12. Security Checklist

### Transport & Network
- [x] HTTPS everywhere (Cloudflare automatic SSL)
- [x] HSTS headers enabled
- [x] CORS whitelist: `trust.iai.one`, `admin.trust.iai.one` only

```typescript
// CORS config
const ALLOWED_ORIGINS = [
  "https://trust.iai.one",
  "https://admin.trust.iai.one",
  process.env.NODE_ENV === "development" && "http://localhost:3000",
].filter(Boolean);
```

### Rate Limiting

```typescript
// apps/web/lib/api/rate-limit.ts
// Using Cloudflare KV or upstash/ratelimit

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
});

export async function rateLimit(
  identifier: string,
  opts?: { window: number; max: number }
): Promise<boolean> {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### Input & Data
- [x] All inputs validated with Zod before processing
- [x] SQL injection prevented by Prisma parameterized queries
- [x] XSS: React auto-escapes, CSP headers set
- [x] File uploads: validate MIME type, max 10MB, scan content

### Authentication & Authorization
- [x] API keys hashed with SHA-256, never stored as plaintext
- [x] JWT in `httpOnly`, `Secure`, `SameSite=Lax` cookies
- [x] Webhook signatures verified before processing
- [x] Admin routes require `role: ADMIN` check

### Compliance
- [x] GDPR: `DELETE /api/v1/account` — deletes all user data
- [x] GDPR: `GET /api/v1/account/export` — exports all user data as JSON
- [x] Audit log for: proof creation, credential issuance/revocation, asset transfers, login, plan changes

### Security Headers

```typescript
// apps/web/middleware.ts (add to response)
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};
```

---

## 13. Phase-by-Phase Dev Tasks

### Phase 1: Foundation (Week 1–4)

| Week | Tasks | Owner |
|------|-------|-------|
| 1 | Monorepo setup (Turbo, pnpm), CI/CD pipeline, Prisma schema, DB migration | DevOps + Backend |
| 2 | NextAuth (magic link + Google), session middleware, API key system | Backend |
| 3 | Proof Engine: `create`, `verify`, `hash` — unit tests, API routes | Backend |
| 4 | Dashboard shell, proof tab UI, Stripe billing (free/pro), landing page | Frontend |

**Deliverables:**
- [ ] Monorepo with Turborepo, pnpm workspace, ESLint, Prettier
- [ ] GitHub Actions: lint → type-check → test → build → deploy
- [ ] PostgreSQL schema deployed, seed script working
- [ ] Auth: magic link login + Google OAuth, protected routes
- [ ] Proof Engine: create proof → SHA-256 hash + timestamp → store → verify
- [ ] Dashboard: overview page, proof list, create proof form
- [ ] Billing: Stripe Checkout, free/pro plans, billing portal
- [ ] Landing page: hero, features, pricing, CTA

### Phase 2: Credentials & Verification (Week 5–8)

| Week | Tasks | Owner |
|------|-------|-------|
| 5 | VC Engine: `issue`, `revoke`, `verify` — HMAC signature, expiry | Backend |
| 6 | Dashboard: credentials tab, issue/revoke UI, verify tab | Frontend |
| 7 | Public verify page (`/verify/:id`), API key management UI | Full-stack |
| 8 | PayPal integration, webhook handlers, billing history | Backend |

**Deliverables:**
- [ ] VC Engine: issue credential → sign → store → verify → revoke
- [ ] Dashboard: credentials list, issue form, revoke button
- [ ] Dashboard: verify tab (paste ID or URL → show result)
- [ ] Public verify page: anyone can verify a proof or credential
- [ ] API key management: create, list, revoke, copy
- [ ] PayPal payment option alongside Stripe
- [ ] Webhook handlers for Stripe + PayPal with idempotency

### Phase 3: Assets, API & Scale (Week 9–12)

| Week | Tasks | Owner |
|------|-------|-------|
| 9 | Asset Engine: `mint`, `transfer`, `history` — optional blockchain | Backend |
| 10 | Dashboard: assets tab, API explorer tab, billing tab | Frontend |
| 11 | OpenAPI spec, auto-generated docs, JavaScript SDK | Backend |
| 12 | VN QR bank (PayOS), admin panel, load testing, security audit | Full-stack |

**Deliverables:**
- [ ] Asset Engine: mint asset → optional on-chain → transfer → history
- [ ] Dashboard: assets list, mint form, transfer dialog
- [ ] Dashboard: API tab with live request builder
- [ ] Dashboard: billing tab with usage, invoices, plan management
- [ ] Public API docs at `docs.trust.iai.one` (auto-generated from OpenAPI)
- [ ] JavaScript SDK: `npm install @trust/sdk`
- [ ] VN QR bank payment via PayOS
- [ ] Admin panel: user management, metrics, audit logs
- [ ] Load test: 1000 concurrent users, < 200ms p95
- [ ] Security audit: OWASP top 10 check

---

## Quick Reference

```bash
# Start developing
git clone git@github.com:your-org/trust.iai.one.git
cd trust.iai.one
cp .env.example .env          # Fill in values
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev                      # All apps running

# Ship to production
git push origin main          # CI/CD handles the rest
```

---

*This guide is the single source of truth for building trust.iai.one. Keep it updated as the architecture evolves.*
