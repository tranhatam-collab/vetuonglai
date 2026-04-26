# 16_PRODUCT_REQUIREMENTS_DOSSIER_FOR_ALL_TEAMS.md

## Mục đích của file

PRD tổng hợp cho tất cả team (product, FE, BE, mobile, AI, content, legal, ops) để triển khai một roadmap thống nhất cho toàn hệ subdomain.

---

## 1. Product scope

### 1.1 Release scope hiện tại

- Ưu tiên: non-payment + mobile PWA V1
- Payment scope: defer ở release hiện tại, giữ readiness spec

### 1.2 Core goals

1. user có trải nghiệm public -> member rõ ràng
2. domain core hoạt động nhất quán, không drift
3. mobile user dùng được member + edu + vc ổn định

---

## 2. Personas

1. Explorer (public user)
2. Member starter
3. Deep learner / builder
4. Verified contributor
5. Ops/admin reviewer

---

## 3. Functional requirements (FR)

## FR-01 Access runtime

- session/current ổn định
- entitlement resolution server-side
- routing contract không drift

## FR-02 Public teaser integrity

- mọi domain có hook + value + demo + CTA
- không khóa sạch public content

## FR-03 Member dashboard

- state-aware dashboard
- next-step recommendations
- unlock map theo entitlement

## FR-04 Mobile PWA V1

- installable PWA
- offline fallback
- mobile-first navigation
- edu + vc core flows

## FR-05 EDU core

- catalog/list/detail/player
- progress tracking
- completion events

## FR-06 VC quick verify

- verify entry nhanh
- sample/real record handling
- disclosure đúng chuẩn

## FR-07 Governance

- trust/legal wording enforcement
- runtime truth board
- release gate checklist

---

## 4. Non-functional requirements (NFR)

- performance: mobile route chính LCP mục tiêu < 2.5s
- reliability: smoke suite pass trước promote
- security: server-side entitlement checks
- observability: event + audit logs đầy đủ
- accessibility: WCAG AA cho luồng chính

---

## 5. Domain rollout waves

### Wave Core

- root
- member
- edu
- vc

### Wave 1

- life
- finance
- invest
- green

### Wave 2

- community
- work
- market
- ai

### Wave 3

- stories, mission, healing, family, foundation, labs, blog, live, tools

### Wave Platform

- affiliate
- api
- admin

---

## 6. Team responsibilities

### Team 1

- runtime/platform/access/contracts

### Team 2

- UX/frontend/mobile/content surfaces

### Team 3

- QA/governance/trust/release controls

Ops/Founder:
- secrets, DNS, cutover, final go/no-go

---

## 7. Acceptance criteria by milestone

### M1

- member cutover unblock
- smoke runtime pass

### M2

- mobile PWA shell + auth/dashboard pass

### M3

- edu + vc mobile pass

### M4

- core wave hardening + legal/trust pass

### M5

- wave 1 subdomain readiness pass

### M6

- wave 2 subdomain readiness pass

---

## 8. Risks and mitigations

1. Domain status drift -> enforce runtime truth board
2. Overpromise copy -> legal/trust gate before publish
3. Entitlement mismatch -> contract tests + smoke tests
4. Mobile fragmentation -> device matrix QA

---

## 9. Test and release gates

```bash
npm run build
npm run check
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run verify:team-app:day1:local
npm run verify:team-app:day1:prod
```

---

## 10. Reporting artifacts

- Cross-team sync report
- Daily task board
- Runtime truth board
- Release readiness report

---

## 11. Definition of done

PRD được coi là hoàn chỉnh khi:

- tất cả team đang làm theo cùng milestone/acceptance criteria
- không còn xung đột giữa scope docs và runtime
- mỗi wave có owner, gate, test plan, báo cáo rõ

