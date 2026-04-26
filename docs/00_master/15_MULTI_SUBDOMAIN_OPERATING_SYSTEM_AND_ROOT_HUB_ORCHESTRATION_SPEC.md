# 15_MULTI_SUBDOMAIN_OPERATING_SYSTEM_AND_ROOT_HUB_ORCHESTRATION_SPEC.md

## Mục đích của file

Khóa kiến trúc điều phối nhiều subdomain từ root hub, đảm bảo:
- routing nhất quán
- identity/session không drift
- entitlement được enforce đồng bộ
- dashboard có thể điều hướng user đúng domain đúng thời điểm

---

## 1. Hệ điều phối đa domain

### 1.1 Vai trò root hub

`vetuonglai.com` là control plane cấp trải nghiệm:
- định hướng hành trình
- đọc trạng thái user
- đề xuất next-step
- route user sang domain phù hợp

### 1.2 Vai trò subdomain

Mỗi subdomain là execution surface cho một năng lực cụ thể:
- EDU: học và output
- LIFE: nhịp sống/recovery
- FINANCE/INVEST: tiền và rủi ro
- GREEN: impact
- VC: verify/proof

---

## 2. Operating contracts

## 2.1 Identity contract

- magic-link tạo identity session
- subdomains dùng chung auth/session layer

## 2.2 Entitlement contract

- root và subdomains cùng đọc một nguồn entitlement truth
- không tự quyết quyền bằng client-only logic

## 2.3 Routing contract

- route decisions dựa trên `member_state + entitlement + domain_status`
- nếu domain chưa ready phải chuyển sang teaser/alternative route

---

## 3. Root orchestration pipeline

1. Load session/current
2. Resolve member state
3. Resolve entitlement map
4. Resolve domain status map (live/beta/preview/planned)
5. Compute next-step recommendations
6. Render dashboard + route links

---

## 4. Domain routing rules

### 4.1 Nếu domain = LIVE/BETA

- cho route trực tiếp theo quyền

### 4.2 Nếu domain = MEMBER_PREVIEW

- route vào preview + CTA mở sâu

### 4.3 Nếu domain = PLANNED

- không route như destination chính
- show coming-next path

---

## 5. Event model (cross-domain)

Events chuẩn:

- `member_login_success`
- `dashboard_open`
- `domain_route_click`
- `edu_lesson_start`
- `edu_lesson_complete`
- `vc_verify_open`
- `renew_click`

Mọi domain phải dùng vocabulary event thống nhất.

---

## 6. Error and fallback orchestration

- session lỗi -> fallback login state
- entitlement lỗi -> fallback safe public state
- domain down -> route sang safe alternative + notice
- recommendation service lỗi -> default starter paths

---

## 7. Ownership split

- Team 1: orchestration runtime services
- Team 2: orchestration UI behavior + route UX
- Team 3: contract QA + governance checks

---

## 8. Observability

Bắt buộc theo dõi:

- route success rate
- cross-domain session continuity
- entitlement mismatch rate
- broken destination rate

---

## 9. Security and trust

- không leak protected data qua client preload
- enforce server-side checks cho protected routes
- audit mọi change ở mapping contracts

---

## 10. Definition of done

Operating system đa domain đạt khi:

- user login 1 lần dùng xuyên core domains ổn định
- root dashboard route đúng theo trạng thái thực
- không có link chính dẫn vào host không usable
- telemetry + audit cho orchestration đầy đủ

