# UNIVERSAL WEB PROJECT MASTER IMPLEMENTATION LOCK
# KHÓA TRIỂN KHAI CHUẨN CHO MỌI DỰ ÁN WEB

Version: 1.0
Status: Universal / Reusable / Locked
Scope: Any existing website, web app, landing page, multi-page site, subdomain system, or ecosystem website
Owner: Founder / Team Admin / Product Owner / Tech Lead

Phiên bản: 1.0
Trạng thái: Chuẩn chung / Tái sử dụng / Đã khóa
Phạm vi: Mọi website hiện có, web app, landing page, website nhiều trang, hệ subdomain hoặc hệ sinh thái web
Chủ sở hữu: Founder / Team Admin / Product Owner / Tech Lead

---

## 1. Executive Decision / Quyết định điều hành

This document is a universal implementation lock for upgrading any existing web project.
Tài liệu này là bản khóa triển khai chuẩn chung để nâng cấp bất kỳ dự án web hiện có nào.

The website is not considered complete until it passes all gates in this document.
Website chưa được xem là hoàn chỉnh cho đến khi vượt qua toàn bộ cổng kiểm soát trong tài liệu này.

The purpose of this file is to ensure every web project can be upgraded to a modern, beautiful, production-ready, bilingual, SEO-ready, accessible, and trustworthy standard without rebuilding from scratch.
Mục đích của file này là bảo đảm mọi dự án web đều có thể được nâng cấp lên chuẩn hiện đại, đẹp, sẵn sàng production, song ngữ, chuẩn SEO, dễ truy cập và đáng tin cậy mà không cần xây lại từ đầu.

---

## 2. Final Answer / Kết luận cuối

A website is not complete only because the layout looks better.
Một website chưa hoàn chỉnh chỉ vì giao diện trông đẹp hơn.

A website is complete only when it is:
Một website chỉ hoàn chỉnh khi nó:

- clear / rõ ràng
- structurally consistent / nhất quán về cấu trúc
- beautiful without being noisy / đẹp nhưng không rối
- bilingual where required / song ngữ nếu dự án yêu cầu
- accessible / dễ truy cập
- fast / nhanh
- SEO-ready / chuẩn SEO
- testable / kiểm thử được
- meaningful page by page / có ý nghĩa theo từng trang
- ready for deployment / sẵn sàng triển khai
- reviewed with evidence / được kiểm duyệt bằng bằng chứng

---

## 3. Core Rule / Quy tắc cốt lõi

The code already exists. Do not rebuild from scratch.
Code đã tồn tại. Không xây lại từ đầu.

Upgrade the existing implementation carefully, in controlled slices, while preserving:
Phải nâng cấp phần triển khai hiện có một cách cẩn thận, theo từng lát kiểm soát được, đồng thời giữ nguyên:

- existing architecture / kiến trúc hiện có
- existing route logic / logic route hiện có
- existing deployment structure / cấu trúc deploy hiện có
- existing content model / mô hình nội dung hiện có
- existing working features / các tính năng đang hoạt động
- existing trust and business direction / hướng niềm tin và định hướng kinh doanh hiện có

---

## 4. Non-Negotiable Rules / Quy tắc không được vi phạm

### Do not / Không được:

- rebuild the whole project / xây lại toàn bộ dự án
- silently change architecture / âm thầm đổi kiến trúc
- remove existing working features / xóa tính năng đang hoạt động
- introduce mock data unless explicitly requested / thêm mock data nếu chưa được yêu cầu rõ
- touch unrelated files / sửa các file không liên quan
- hard-code localized public text if the project already uses localization files / hardcode text công khai đã localize
- use hype language / dùng ngôn ngữ cường điệu
- use fake claims / đưa ra tuyên bố giả
- expose internal technical labels publicly / để lộ nhãn kỹ thuật nội bộ ra công khai
- commit before approval / commit trước khi được duyệt

### Must / Phải:

- analyze first / phân tích trước
- plan before coding / lập kế hoạch trước khi code
- work in small slices / làm theo từng lát nhỏ
- preserve deployment structure / giữ nguyên cấu trúc deploy
- test locally after each major slice / test local sau mỗi lát thay đổi lớn
- report with evidence / báo cáo có bằng chứng
- ask approval before major changes / xin duyệt trước thay đổi lớn

---

## 5. Project Goal Template / Mẫu mục tiêu dự án

Every project using this standard must define:
Mọi dự án dùng chuẩn này phải xác định:

- Project / Dự án
- Primary goal / Mục tiêu chính
- Secondary goals / Mục tiêu phụ
- Target user / Người dùng chính
- Current phase / Giai đoạn hiện tại
- Main surfaces / Các bề mặt chính
- Required languages / Ngôn ngữ yêu cầu
- Deployment type / Loại triển khai

---

## 6. Brand and Language Rules / Quy tắc thương hiệu và ngôn ngữ

Public language must be:
Ngôn ngữ công khai phải:

- calm / điềm tĩnh
- precise / chính xác
- real / thật
- long-term / dài hạn
- non-sales / không bán hàng lộ liễu
- trustworthy / đáng tin cậy
- human but not emotionalized / có tính con người nhưng không cảm tính hóa
- clear before decorative / rõ ràng trước khi trang trí

Vietnamese must use full accents and professional grammar.
Tiếng Việt phải có dấu đầy đủ và ngữ pháp chuyên nghiệp.

English must be short, clear, natural, and not literal translation.
Tiếng Anh phải ngắn, rõ, tự nhiên và không dịch từng chữ.

Forbidden language / Ngôn ngữ bị cấm: hype, fake urgency, fake prestige, fake guarantees, meaningless filler, random decorative text, internal technical labels on public pages.

---

## 7. Bilingual Language Switch Standard / Chuẩn chuyển ngôn ngữ song ngữ

If the project is bilingual, do not use: VI, EN, VIE, ENG
Nếu dự án song ngữ, không được dùng: VI, EN, VIE, ENG

Use full labels with flags:
Bắt buộc dùng nhãn đầy đủ kèm cờ:

- 🇻🇳 Tiếng Việt
- 🇺🇸 English

Rules / Quy tắc:
- The flag and full language name must be visible / Cờ và tên ngôn ngữ đầy đủ phải hiển thị rõ
- The active language must be clear / Ngôn ngữ đang chọn phải rõ ràng
- The switch must be keyboard accessible / Bộ chuyển ngôn ngữ phải dùng được bằng bàn phím
- The switch must have aria-label / Bộ chuyển ngôn ngữ phải có aria-label
- Mobile view must still show full language identity / Giao diện mobile vẫn phải hiện rõ bản sắc ngôn ngữ

---

## 8. Content Source Rule / Quy tắc nguồn nội dung

If the project already uses content JSON, locale files, translation files, CMS data, or other structured content sources, all public text must come from those sources.
Nếu dự án đã dùng content JSON, file locale, file translation, CMS hoặc nguồn nội dung có cấu trúc khác, toàn bộ text công khai phải lấy từ các nguồn đó.

Applies to: navigation, buttons, hero text, footer, form labels, empty states, error text, SEO metadata, image alt text, CTA labels.

No hardcoded public text is allowed where localization architecture already exists.
Không được hardcode text công khai ở nơi đã có kiến trúc localization.

---

## 9. Design Quality Target / Mục tiêu chất lượng thiết kế

The final system must feel:
Hệ cuối cùng phải tạo cảm giác:

- premium but not flashy / cao cấp nhưng không phô trương
- friendly but not childish / thân thiện nhưng không trẻ con
- modern but not cold / hiện đại nhưng không lạnh
- dynamic but not distracting / động nhưng không gây mất tập trung
- meaningful by page or subdomain / có ý nghĩa theo từng trang hoặc subdomain
- consistent across the whole system / nhất quán trên toàn hệ
- globally credible / đáng tin ở tầm quốc tế
- visually calm / thị giác điềm tĩnh
- clear before complex / rõ ràng trước khi phức tạp

---

## 10. Required Design System / Hệ thiết kế bắt buộc

The team must define or refine: color tokens, typography scale, spacing scale, radius scale, border usage, shadow system, card system, button system, input/form system, badge/tag system, icon language, illustration direction, section layout rules, responsive breakpoints, dark/light behavior if applicable.

---

## 11. Page and Subdomain Meaning Map / Bản đồ ý nghĩa trang và subdomain

For every main page or subdomain, the team must define: purpose, audience, trust role, primary action, visual metaphor, color accent, hero concept, icon direction, motion direction, related links, SEO role.

See: `docs/00_master/VTL_SUBDOMAIN_MEANING_MAP.md`

---

## 12. Image and Icon Rules / Quy tắc hình ảnh và icon

Images must be: meaningful, original or properly licensed, matched to content, optimized for web, responsive, accessible with alt text, visually calm, not random stock, not fake-looking generic AI art.

Icons must be: clear, original-feeling, SVG-ready, consistent, meaningful, lightweight, usable in full and compact UI.

If image generation is needed, write prompts first instead of inserting random images.

---

## 13. Motion and Animation Rules / Quy tắc motion và animation

Allowed: CSS transitions, scroll reveal, subtle parallax, floating cards, line drawing, icon micro-interactions, soft background gradient movement, lightweight SVG motion.

Not allowed unless approved: heavy animation libraries, aggressive motion, autoplay video background, motion that hurts Core Web Vitals, effects that distract from page meaning.

Required fallback:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

---

## 14. SEO Acceptance Rules / Quy tắc nghiệm thu SEO

For every main page and subdomain, verify: title, meta description, canonical, hreflang where needed, one H1 only, clear H2/H3 structure, Open Graph title, Open Graph description, Open Graph image, alt text, internal links, schema recommendation if relevant, robots behavior, sitemap inclusion.

Vietnamese routes must have Vietnamese metadata. English routes must have English metadata.

---

## 15. Accessibility Acceptance Rules / Quy tắc nghiệm thu accessibility

Required baseline: keyboard navigation, visible focus states, semantic HTML, sufficient contrast, accessible language switch if bilingual, readable font sizes, touch-safe mobile targets, alt text for meaningful images, aria-label for icon-only controls, reduced-motion support.

---

## 16. Performance Acceptance Rules / Quy tắc nghiệm thu hiệu năng

The upgrade must not slow the site. Protect: fast first paint, low layout shift, image optimization, minimal JS, maintainable CSS, no heavy visual effect by default.

---

## 17. Execution Workflow / Quy trình thực hiện

Step 1 — Analyze only → Step 2 — Plan → Step 3 — Implement → Step 4 — Local Test → Step 5 — Verify → Step 6 — Report → Step 7 — Commit after approval.

---

## 18. Team Roles / Vai trò team

- Team Admin: coordinate, enforce, collect reports, identify blockers
- Design Team: global design system, visual direction, icons, prompts
- Frontend Team: implement UI, responsive, components, motion, accessibility
- SEO / Content Team: metadata, content structure, headings, alt text, bilingual copy
- QA Team: local test review, responsive review, link review, language switch review
- DevOps Team: preserve deploy, verify build, protect production, confirm release readiness

---

## 19. Acceptance Criteria / Tiêu chí nghiệm thu cuối

The website is accepted only when: design feels complete and consistent, each main page has distinct meaning, bilingual switch uses full labels with flags, no hardcoded localized public text, SEO metadata is complete, mobile-first quality, accessibility baseline passes, motion is lightweight, local tests pass, no broken links or content, team report is complete, Founder approves.

---

## 20. Team Admin Report Template / Mẫu báo cáo Team Admin

See: `docs/00_master/VTL_TEAM_ADMIN_REPORT_CURRENT.md`

---

## 21. Final Master Prompt For Team Dev / AI Agent

See Section 17 execution workflow. Start with Step 1: Analyze only. Do not implement yet.

---

## 22. Final Control Statement / Tuyên bố kiểm soát cuối

A website is not complete because it looks better.
A website is complete only when it is: clear, fast, accessible, bilingual where required, meaningful, testable, SEO-ready, structurally consistent, approved with evidence.

Một website chưa hoàn chỉnh chỉ vì nó trông đẹp hơn.
Một website chỉ hoàn chỉnh khi nó: rõ ràng, nhanh, dễ truy cập, song ngữ nếu dự án yêu cầu, có ý nghĩa, kiểm thử được, sẵn sàng SEO, nhất quán về cấu trúc, được duyệt bằng bằng chứng.
