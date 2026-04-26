# 14_DESIGN_SYSTEM_MASTER.md

## Mục đích của file

Khóa design system dùng chung cho toàn bộ hệ `*.vetuonglai.com` để:
- thống nhất trải nghiệm xuyên domain
- giữ mobile-first và accessibility
- tránh mỗi team tự dựng UI khác chuẩn

---

## 1. Design principles

1. Clarity first
2. Calm confidence
3. Proof-oriented UI
4. Mobile-first default
5. Accessibility by default

---

## 2. Token system

### 2.1 Core tokens

- color tokens: semantic (`bg/surface/text/border/success/warning/error`)
- spacing tokens: `4,8,12,16,24,32,48`
- radius tokens: `sm/md/lg/xl`
- shadow tokens: `soft/medium/focus`

### 2.2 Typography tokens

- display
- heading
- body
- caption
- mono (technical snippets)

### 2.3 Motion tokens

- duration: `fast/normal/slow`
- easing: `standard/emphasized`
- prefers-reduced-motion fallback bắt buộc

---

## 3. Layout standards

- max content width chuẩn
- grid 12 cột cho desktop, 4 cột mobile
- container padding responsive
- sticky action zone cho mobile CTA chính

---

## 4. Core component contracts

Bắt buộc có thư viện chung cho:

- top navigation
- status badges (`LIVE/BETA/PREVIEW/PLANNED`)
- domain cards
- teaser blocks
- proof summary cards
- CTA buttons
- disclosure blocks
- form fields (email/magic-link)

---

## 5. Accessibility standards

- color contrast tối thiểu WCAG AA
- focus states rõ ràng
- keyboard navigable components
- semantic HTML landmarks
- aria-label cho interactive elements quan trọng

---

## 6. Responsive standards

Breakpoints chuẩn:

- `sm`: mobile
- `md`: tablet
- `lg`: desktop
- `xl`: wide desktop

Rules:
- không horizontal scroll ngoài component đặc biệt
- action chính hiển thị trong first view trên mobile
- bảng dài phải có responsive fallback

---

## 7. Performance-aware UI rules

- tối ưu ảnh theo kích thước thực
- tránh animation nặng trên mobile
- ưu tiên component reuse để giảm bundle drift
- LCP mục tiêu route chính < 2.5s trên mobile tốt

---

## 8. Cross-domain consistency map

Mọi domain phải dùng chung:

- navigation behavior
- CTA priority hierarchy
- status label semantics
- trust/disclosure presentation

Mỗi domain được phép khác:

- hero imagery
- domain-specific accent
- content structure chi tiết

---

## 9. QA checklist design system

1. component parity giữa root và subdomain
2. mobile visual pass ở 3 viewport chính
3. contrast/focus/keyboard pass
4. no broken states cho loading/empty/error

---

## 10. Definition of done

Design system chỉ được xem là hoàn chỉnh khi:

- component contracts được dùng thực tế ở core domains
- không còn hard-coded styles trái token ở các surface chính
- accessibility pass cho các luồng quan trọng
- mobile-first QA pass ở iOS Safari + Android Chrome

