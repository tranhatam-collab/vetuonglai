# DEV FILE 02 — GATEWAY SYSTEM & FRONTEND

Version: 1.0
Last updated: 2026-04-08
Status: active dev source of truth
Owner: FE lead

## Purpose

This file locks the frontend system for the Gateway V2.1 model: teaser -> demo -> gateway -> unlock -> welcome -> dashboard.

## 1. Gateway flow chart

```text
Public page visit
  -> read session
  -> if unlocked: show full access
  -> if locked: show discover + hook layers
  -> user clicks unlock CTA
  -> redirect to member.vetuonglai.com/unlock/
  -> capture email
  -> choose gateway
  -> payment gateway
  -> success page
  -> webhook marks user unlocked
  -> magic link email sent
  -> user clicks magic link
  -> session cookie set across .vetuonglai.com
  -> redirect to /welcome/
  -> enter /dashboard/
```

## 2. Required pages

### `/unlock/`

- email capture
- unlock promise
- gateway selection
- refund note
- trust note: one-time, lifetime, no subscription

### `/unlock/success/`

- success confirmation
- email destination display
- resend button after cooldown
- support fallback

### `/magic/[token]`

- validating state
- success redirect state
- expired state
- used-token state

### `/welcome/`

- first unlock greeting
- journey intro
- 4 quick starts
- link to dashboard and relevant domain entry points

### `/dashboard/`

- member overview
- unlock status
- VC badge summary
- next-best-action widget
- quick links to EDU / VC / WORK / MARKET

## 3. React components

### `GatewayOverlay`

```ts
export interface GatewayOverlayProps {
  contentType: "course" | "job" | "market" | "article" | "community";
  referringUrl: string;
  variant?: "soft" | "hard";
  teaserKey?: string;
}
```

### `TeaserBlock`

```ts
export interface TeaserBlockProps {
  subdomain: "hub" | "edu" | "vc" | "work" | "market" | "life" | "finance" | "invest" | "green";
  customMessage?: {
    line1: string;
    line2: string;
    line3: string;
    cta: string;
  };
}
```

### `UnlockCTA`

```ts
export interface UnlockCTAProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "sticky";
  referringUrl?: string;
  intent?: string;
}
```

### `DemoWidget`

```ts
export interface DemoWidgetProps {
  demoType: "course" | "job" | "ai" | "market" | "vc" | "community";
  previewId?: string;
}
```

### `VCBadgeCard`

```ts
export interface VCBadgeCardProps {
  code: string;
  badgeType: string;
  holderName: string;
  issuedAt: string;
  status: "verified" | "reviewing" | "planned";
  sourceOwnerUrl: string;
}
```

## 4. UX states

- loading
- locked
- unlocked
- payment pending
- email sent
- expired link
- already unlocked
- refunded / revoked access

## 5. SEO metadata requirements

Every gateway-aware page must still have public metadata and public content value.

- unique title
- unique description
- canonical URL
- source-owner metadata
- hreflang where applicable
- structured data if the page qualifies

## 6. Schema markup

### Article

Use for long-form guides and public anchor content.

### Course

Use on EDU course pages with public first-lesson visibility.

### JobPosting

Use on WORK listing pages where the description is public and only apply is gated.

### CredentialSchema

Use on VC and proof-related content pages where verification semantics matter.

## 7. Performance targets

```text
Lighthouse Performance: >= 90
Lighthouse SEO:         >= 90
Lighthouse Accessibility: >= 90
Largest Contentful Paint: < 2.5s on broadband mobile
Interaction to Next Paint: < 200ms target
CLS: < 0.1
```

## 8. E2E testing checklist

- locked user sees teaser + CTA
- unlocked user bypasses overlay
- unlock flow preserves referring URL / intent
- payment success screen shows correct email
- resend cooldown works
- valid magic link logs user in
- expired magic link shows recovery path
- used token cannot be reused
- dashboard loads with session on subdomain revisit
- cross-domain cookie unlocks EDU / VC / WORK / MARKET

## 9. Rendering rules

- Layer 0 and Layer 1 content must render without auth.
- Lock only the action or deep continuation where possible.
- Prefer gating the form, apply action, purchase action, or full lesson body rather than gating all useful context.

## 10. Definition of done

- all 5 pages exist as real routes
- component APIs are implemented in shared FE packages
- teaser and gateway states work on mobile and desktop
- schema markup validates
- E2E tests cover the gateway critical path
