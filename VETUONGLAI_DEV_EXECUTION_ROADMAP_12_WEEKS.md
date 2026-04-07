# VETUONGLAI DEV EXECUTION ROADMAP 12 WEEKS

Version: 1.0
Last updated: 2026-04-07

## Mục tiêu tổng

Trong 12 tuần, team phải đưa Về Tương Lai từ một multi-site content system lên một nền tảng có root hub rõ nghĩa, EDU có thể học thật, VC có thể verify thật và các domain cốt lõi có hành trình user rõ ràng.

## Phase 1: Weeks 1-3

Focus:

- root hub
- EDU basic
- VC hardening

Deliverables:

- root hub structure theo spec
- onboarding skeleton
- EDU course listing
- EDU course detail
- EDU lesson player MVP
- VC verify flow ổn định
- CI/CD fix lane Pages + Workers

Owner chính:

- FE
- BE/Infra
- Product

Rủi ro:

- domain truth không đồng bộ
- route rewrite sai
- content chưa sẵn sàng

Dependencies:

- root copy
- cloudflare config
- media placeholder

## Phase 2: Weeks 4-6

Focus:

- Life
- Finance
- Community MVP

Deliverables:

- Life pathways and routines MVP
- Finance tools and content MVP
- Community join flow MVP
- shared CTA and linking logic
- analytics cơ bản

Owner chính:

- Product
- FE
- Content

## Phase 3: Weeks 7-9

Focus:

- Invest
- Green
- Stories

Deliverables:

- Invest framework pages
- Green impact pages
- Stories architecture MVP
- cross-domain link system
- proof linkage về VC

Owner chính:

- Product
- Content
- Trust / VC owner

## Phase 4: Weeks 10-12

Focus:

- Assessment
- personal dashboard
- trust graph direction

Deliverables:

- onboarding assessment functional
- journey recommendation engine ban đầu
- dashboard concept MVP
- progress + credential overview
- production QA matrix

Owner chính:

- Product
- FE
- Data / BE

## Milestones theo tuần

### Week 1

- chốt source of truth files
- fix CI/CD
- chốt serving model per domain

### Week 2

- root hub hero, map, start flow
- EDU routes MVP

### Week 3

- VC verify and issue hardening
- smoke tests production

### Week 4

- Life MVP structure
- Finance MVP structure

### Week 5

- routine / tools pages
- linking logic giữa Life, Finance, EDU

### Week 6

- Community join flow
- first retention signals

### Week 7

- Invest MVP
- risk and disclaimer layer

### Week 8

- Green MVP
- proof and impact packet logic

### Week 9

- Stories MVP
- cross-domain trust and story links

### Week 10

- assessment logic
- onboarding result mapping

### Week 11

- dashboard MVP
- progress and proof summary

### Week 12

- QA pass
- runtime truth review
- release review

## Deliverable rules

Mỗi deliverable chỉ được coi là xong khi:

- route load được
- content có nghĩa
- CTA đúng
- mobile ổn
- không gây broken flow
- nếu là production-facing thì đã được QA

## Owner model

- Founder: direction approval
- Product lead: flow, backlog, acceptance
- Brand / content lead: copy and meaning quality
- FE lead: interface and route execution
- BE / infra lead: API, worker, deploy, secrets
- Trust owner: VC and proof rules

## Risks tổng hợp

- team chỉ xây UI mà không xây journey
- domain status trên hub khác domain status production
- EDU trở thành trang catalog thay vì learning system
- VC bị hiểu sai thành trang cert đơn thuần
- quá nhiều domain nhưng không có owner rõ

## Dependencies tổng hợp

- cloudflare and domain stability
- media pipeline
- content readiness
- secrets and webhook setup
- owner and review rhythm
