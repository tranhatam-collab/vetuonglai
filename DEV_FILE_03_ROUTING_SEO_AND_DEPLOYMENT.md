# DEV FILE 03 — ROUTING, SEO & DEPLOYMENT

Version: 1.0
Last updated: 2026-04-08
Status: active dev source of truth
Owner: FE / Infra / SEO

## Purpose

This file locks the routing, SEO, middleware, deploy, DNS, cache, and analytics rules for the real multi-domain application layer.

## 1. Access-level matrix for 18 subdomains

```text
hub         discover + route system
member      gateway + unlocked dashboard
edu         discover + hook + full
vc          discover + verify + claims
work        discover + hook + gated apply
market      discover + hook + gated purchase
life        discover + hook + gateway
finance     discover + hook + gateway
invest      discover + hook + gateway
green       discover + hook + gateway
community   discover + hook + gateway
blog        public SEO anchor + gateway CTA
ai          discover + demo + gateway
tools       public free utilities + gateway CTAs where relevant
stories     public proof stories + system routing
affiliate   protected / controlled expansion
api         internal + public contracts by route
admin       internal only
```

## 2. Shared Next.js config requirements

### `next.config.js`

- domain-aware metadata
- image remote patterns
- redirects and rewrites only when they do not weaken canonical rules
- strict security headers for auth and payment-sensitive routes

### `middleware.ts`

Responsibilities:

- read `vtl_session`
- annotate request auth context
- protect gated routes
- allow discover and hook layers
- preserve return URL and intent on unlock redirect
- support domain-based access policy

Pseudo-rules:

```ts
if (route.isPublic) return next();
if (!session && route.requiresUnlock) return redirectToUnlock();
if (session && !session.is_unlocked && route.requiresUnlock) return redirectToUnlock();
return next();
```

## 3. Route structure for 4 primary domains

### member

```text
/unlock/
/unlock/success/
/magic/[token]
/welcome/
/dashboard/
/journey/
/u/[username]/
```

### edu

```text
/courses/
/courses/[slug]/
/learn/[slug]/
/learn/[slug]/player/
/badge/[badgeType]/
```

### work

```text
/jobs/
/jobs/[slug]/
/skills/[skill]/
/brief/
```

### market

```text
/products/
/products/[slug]/
/tag/[topic]/
/rules/
```

## 4. Sitemap and robots generation

Rules:

- every public domain generates its own `sitemap.xml`
- hub may generate `sitemap-index.xml`
- `robots.txt` must point to the correct sitemap
- noindex only where needed for dynamic, thin, or tokenized routes

## 5. Internal link helper

Shared helper should resolve system-owned URLs consistently.

```ts
export const keywordToUrlMap: Record<string, string> = {
  "vc badge": "https://vc.vetuonglai.com/badges/",
  "tim viec": "https://work.vetuonglai.com/jobs/",
  "san pham so": "https://market.vetuonglai.com/products/",
  "member": "https://member.vetuonglai.com/",
};

export function resolveInternalLink(keyword: string) {
  return keywordToUrlMap[keyword] || "https://vetuonglai.com/";
}
```

## 6. SEO rules

- public pages must keep at least 300 words indexable where applicable
- job descriptions remain public; only apply is gated
- product descriptions remain public; only transaction action is gated
- course intro and first lesson preview remain public
- canonical/source-owner must be explicit for summary pages and mirrors

## 7. Deployment model

### Vercel

- deploy web apps per domain app or via shared monorepo project rules
- preview deployments per branch
- production deploy on merged main after checks pass

### GitHub Actions

Required jobs:

1. install
2. lint
3. typecheck
4. test
5. build
6. smoke
7. deploy

## 8. Cloudflare DNS and cache rules

DNS:

- wildcard handling only where intended
- explicit records for live public domains
- admin and internal domains protected from accidental public exposure

Cache:

- assets: long TTL
- HTML: low or controlled TTL
- auth-sensitive pages: bypass or highly conservative cache
- VC verify and payment-related routes prioritize correctness over aggressive cache

## 9. Analytics events

Required events:

- `gateway_page_view`
- `gateway_cta_click`
- `payment_initiated`
- `payment_success`
- `payment_failed`
- `magic_link_clicked`
- `first_content_view`
- `job_apply_started`
- `market_purchase_started`
- `vc_claim_started`

## 10. Launch checklist

- middleware policy tested on all core public/gated routes
- canonical/source-owner rules verified per summary page
- sitemap and robots generated per domain
- preview -> production deploy path tested
- Cloudflare cache does not break auth state
- analytics events visible in dashboard

## 11. Current repo gap note

Current repo still uses a static build generator for runtime output.
This file is the target routing/deployment source of truth for the real application stack, not a claim that the full Next.js monorepo is already live.
