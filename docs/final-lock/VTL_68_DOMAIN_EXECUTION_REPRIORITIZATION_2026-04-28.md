# VETUONGLAI_DOMAIN_EXECUTION_REPRIORITIZATION_2026.md

**Version:** 1.1  
**Date:** 2026-04-28  
**Status:** Approved execution lock for Slice 2  
**Scope:** `vetuonglai.com` + toàn bộ domain/subdomain trong inventory hiện tại  
**Important note:** Đây là bản khóa thực thi cho Slice 2. Mọi thay đổi sau phải qua founder approval.

---

# 1. Mục đích tài liệu

Tài liệu này được tạo để:
- tổng hợp thực trạng build hiện tại của toàn hệ `vetuonglai.com`
- xác định chỗ mạnh, chỗ yếu, chỗ nguy hiểm
- tái sắp xếp thứ tự ưu tiên cho team
- ngăn đội dev tiếp tục mở thêm feature khi nền chưa đồng bộ
- đưa hệ từ trạng thái đã build được nhiều domain sang trạng thái đúng hệ, đúng chuẩn, đúng nền

---

# 2. Kết luận điều hành

Hệ hiện tại đã vượt giai đoạn ý tưởng.  
Hệ đã có:
- domain registry rõ
- nhiều domain live thật
- build outputs thật
- API JSON thật
- shared assets và shared styling thật
- canonical / hreflang / H1 khá đồng bộ

Nhưng hệ vẫn chưa đủ sạch để mở rộng thêm feature.

## Đánh giá thẳng
- khoảng 70% đúng kiến trúc
- khoảng 30% chưa đồng bộ và có thể làm vỡ hệ sau 2–3 sprint nếu không sửa

## Kết luận hành động
Không nên build thêm feature ngay.  
Phải sửa nền trước.

---

# 3. Ảnh chụp hiện trạng hệ

## 3.1. Điểm mạnh

### A. Hệ đã có hình dạng thật
- 16 domain trong registry
- 14 domain đã có dist output
- tổng 67 HTML pages
- tổng 93 API JSON files

Điều này cho thấy hệ đã là system build thật, không còn là spec rời.

### B. Shared layer đã hình thành
- nhiều domain dùng shared assets
- shared style/app đã có mặt
- canonical / hreflang / H1 đã hiện diện ở phần lớn surfaces
- reduced-motion / focus-visible đã có ở đa số domain trong pipeline chính

### C. Tách domain theo vai trò đã đúng hướng
- hub
- edu
- vc
- finance
- green
- member
- work
- market
- community
- ai
- business
- kids
- read

### D. `edu.vetuonglai.com` và `vc.vetuonglai.com` đã được tách đúng
- EDU có nhiều pages và API nhất, đúng trọng tâm giáo dục
- VC đứng riêng, đúng hướng trust / credentials

---

## 3.2. Điểm yếu lớn cần xử ngay

### 1. Content JSON chưa đồng bộ
7 domain đang thiếu content JSON:
- member
- work
- market
- community
- ai
- business
- kids

### 2. OG image = 0 domain có dist output
Hiện không domain nào có `og:image`.

### 3. JSON-LD gần như không có
Chỉ `kids` có 1 block JSON-LD.  
Các domain còn lại chưa có.

### 4. `kids.vetuonglai.com` đang lệch hệ
- không dùng shared assets
- không có reduced-motion
- không có focus-visible
- không có content JSON
- không đi qua build pipeline chuẩn như các domain còn lại

### 5. `read.vetuonglai.com` đã có registry nhưng chưa vào build pipeline
Đây là domain chiến lược nhưng hiện chưa có dist output.

### 6. Một số domain planned đang có risk "trông như live"
Nếu content, metadata và trust signals không rõ, domain planned dễ bị hiểu lầm là live-ready.

---

# 4. Rủi ro nếu không sửa ngay

Nếu tiếp tục build feature mới mà không xử lý nền, hệ có thể gặp 8 rủi ro:

## 4.1. Language Codex bị phá
Khi content JSON không đồng bộ, mỗi domain sẽ nói một giọng khác nhau.

## 4.2. i18n fail ở lớp hệ thống
Có thể vẫn hiển thị được, nhưng sẽ không còn là hệ song ngữ có cấu trúc.

## 4.3. SEO dài hạn bị suy yếu
Không có og:image và JSON-LD đồng nghĩa:
- share xấu
- CTR thấp
- máy tìm kiếm hiểu kém
- khó có rich results

## 4.4. Planned domains bị hiểu nhầm là production
Điều này tạo trust risk không cần thiết.

## 4.5. `kids` trở thành một đảo riêng
Một domain đi ngoài pipeline và ngoài accessibility baseline sẽ rất khó bảo trì về sau.

## 4.6. `read` chậm vào hệ
Đây là domain chiến lược cho knowledge + creator economy, nhưng nếu để lâu ngoài pipeline, nó sẽ làm mất nhịp phát triển của cả hệ.

## 4.7. Team mở rộng sai thứ tự
Nếu thêm feature mới trước khi đồng bộ nền, chi phí sửa sau này sẽ tăng rất nhanh.

## 4.8. Hệ nhìn rộng nhưng không sâu
Nhiều domain nhưng baseline trust/SEO/content chưa hoàn chỉnh sẽ làm thương hiệu yếu đi.

---

# 5. Nguyên tắc thực thi mới

Từ thời điểm này, team nên đi theo 5 nguyên tắc:

## Rule 1
Không thêm feature mới trong Slice 2.

## Rule 2
Ưu tiên đồng bộ nền trước nội dung mới.

## Rule 3
Mọi domain phải có trạng thái rõ: live / member-preview / planned / bridge / external.  
`hidden` chỉ là visibility flag, không phải product state.

## Rule 4
Mọi domain live phải đạt baseline tối thiểu:
- content structure rõ
- og:image
- JSON-LD
- canonical
- hreflang
- H1
- reduced-motion
- focus-visible

## Rule 5
`kids` là nhánh remediation riêng, không được coi là chỉ thêm content là xong.

---

# 6. Tái ưu tiên kế hoạch thực thi

## Kết luận mới
Không tiếp tục mở Slice 2 theo kiểu content-first thuần túy.  
Thay vào đó, Slice 2 phải được chia thành **5 workstreams** có thứ tự và mục tiêu rõ.

---

# 7. Slice 2 — System Fix Plan

## Mục tiêu tổng
- đồng bộ nền toàn hệ
- sửa các lệch hệ nguy hiểm
- bổ sung trust/SEO baseline
- chuẩn hóa content architecture
- đưa `read` vào pipeline
- đưa `kids` về gần chuẩn hệ

---

## WORKSTREAM A — SYSTEM INTEGRITY
### Priority: Cực cao
### Mục tiêu
Đảm bảo registry, build pipeline và trạng thái domain nhất quán.

### Việc phải làm
1. Thêm `read.vetuonglai.com` vào `domains` map của build pipeline
2. Chuẩn hóa domain state cho toàn hệ:
   - live
   - member-preview
   - planned
   - bridge
   - external
3. Rà lại domain nào được phép xuất hiện ở primary nav
4. Không để domain planned trông như live nếu chưa đủ nền
5. Chuẩn hóa `data-domain`
6. Quyết định hướng đi của `kids` (Day 1 decision — không chờ Day 5):
   - giữ tách riêng
   - hay kéo về pipeline chuẩn

### Deliverables
- domain state map
- build parity update
- READ bootstrap entry
- KIDS pipeline decision (Day 1)

### Không được làm
- không thêm marketplace
- không thêm monetization logic
- không thêm creator payout

---

## WORKSTREAM B — CONTENT JSON EXPANSION
### Priority: Rất cao
### Mục tiêu
Đưa 7 domain còn thiếu vào content system chuẩn.

### Domain cần làm
- member
- work
- market
- community
- ai
- business
- kids

### File cần tạo
- `/content/sites.member.vi.json`
- `/content/sites.member.en.json`
- `/content/sites.work.vi.json`
- `/content/sites.work.en.json`
- `/content/sites.market.vi.json`
- `/content/sites.market.en.json`
- `/content/sites.community.vi.json`
- `/content/sites.community.en.json`
- `/content/sites.ai.vi.json`
- `/content/sites.ai.en.json`
- `/content/sites.business.vi.json`
- `/content/sites.business.en.json`
- `/content/sites.kids.vi.json`
- `/content/sites.kids.en.json`

### Rule
- không hard-code text
- phải đúng Language Codex
- mỗi domain giữ giọng riêng nhưng vẫn nằm trong cùng hệ
- planned domain dùng ngôn ngữ planned, không giả vờ full-live
- kids content phải có parent-mediated framing nếu cần

### Thứ tự nên làm
1. member
2. work
3. community
4. business
5. ai
6. market
7. kids

### Lý do thứ tự này
- `member` đang live mà thiếu content JSON là nguy hiểm nhất
- `work/community/business/ai/market` cùng nhóm planned trong pipeline
- `kids` có remediation riêng nên làm sau khi framework chung đã rõ

---

## WORKSTREAM C — SEO / TRUST BASELINE
### Priority: Cực cao
### Mục tiêu
Biến hệ thành machine-readable, shareable, indexable.

### Task 1 — OG image system
Tạo 1 og image cho mỗi domain có dist output (all dist-output domains).

### Task 2 — Inject `og:image`
Thêm:
```html
<meta property="og:image" content="..." />
<meta name="twitter:image" content="..." />
```

### Task 3 — JSON-LD baseline
Mỗi domain tối thiểu phải có:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage"
}
```

### Domain-specific schema guidance
- EDU → thêm `Course`
- VC → thêm `CreativeWork` hoặc verification-related structure
- HUB → thêm site-level structured context
- KIDS → giữ schema hiện có và làm sạch
- READ → sau khi vào pipeline, cần `WebPage` + `Article` hoặc `CreativeWork` phù hợp

### Deliverables
- OG images cho all dist-output domains
- JSON-LD cho tất cả domain còn thiếu
- schema consistency review

---

## WORKSTREAM D — KIDS REMEDIATION
### Priority: Cực cao
### Mục tiêu
Đưa `kids.vetuonglai.com` về gần chuẩn hệ.

### Phải làm ngay (bắt đầu Day 1 song song với Workstream A)
1. thêm `prefers-reduced-motion`
2. thêm `focus-visible`
3. tạo content JSON
4. giữ JSON-LD
5. quyết định có kéo về shared assets hay tiếp tục giữ file riêng
6. tối thiểu phải có:
   - accessibility baseline
   - content structure
   - trust state rõ
   - audience note rõ

### Lý do
`kids` hiện là domain lệch hệ nhất và sẽ là khoản nợ kỹ thuật lớn nhất nếu bỏ qua.

---

## WORKSTREAM E — READ BOOTSTRAP
### Priority: Rất cao
### Mục tiêu
Đưa `read.vetuonglai.com` vào hệ ở mức tối thiểu nhưng đúng vai.

### Chỉ làm Phase 0 bootstrap
Tạo:
- `/`
- `/transparency`
- `/how-we-pay`

### Chưa làm
- payout
- affiliate
- wallet
- marketplace
- creator economy full logic

### Legal guardrail
**Không được public các claim creator economy (85/15 split, tax, payout logic, earning roles) trên giao diện công khai cho đến khi có legal review xác nhận.** Trang `/how-we-pay` và `/transparency` chỉ nói ở mức "hướng đi dự kiến", không được viết như cam kết hợp đồng.

### Vai trò trước mắt
- knowledge layer
- creator economy explanation layer
- transparency-first domain
- structural placeholder đúng vai

---

# 8. Nội dung internal text phải dọn

## Cần dọn khỏi public text
- DPM
- ready
- source state
- internal labels
- build-only notes
- status language gây hiểu nhầm production

### Rule
Không để lộ nhãn nội bộ kỹ thuật trên public pages.

---

# 9. Nav clean-up

### Việc phải làm
- bỏ link 502
- bỏ link domain chưa usable khỏi primary nav
- chỉ link những domain live hoặc planned có landing sạch
- nếu domain chỉ là bridge/external/placeholder, phải hiện trạng thái đúng

---

# 10. Thứ tự triển khai trong 7 ngày

## Day 1–2
### Workstream A + phần đầu Workstream B + KIDS pipeline decision
- READ vào build pipeline
- domain state map (5 states: live / member-preview / planned / bridge / external)
- member/work/community/business/ai/market content JSON scaffold
- **KIDS pipeline decision** (không chờ Day 5)

## Day 3
### Workstream C phần 1
- og:image system cho all dist-output domains
- mapping per domain

## Day 4
### Workstream C phần 2
- JSON-LD baseline
- domain-specific schema pass

## Day 5
### Workstream D
- kids accessibility fix
- kids content JSON
- kids pipeline execution theo quyết định Day 1

## Day 6
### Workstream E
- read bootstrap
- transparency page
- how-we-pay page
- legal guardrail check trước khi publish

## Day 7
### QA pass
- content check
- SEO check
- accessibility check
- nav check
- planned/live state check

---

# 11. Việc tuyệt đối không làm trong Slice 2

## Không được làm
- không build economy
- không build affiliate
- không build wallet
- không build community product logic mới
- không mở creator payout
- không mở payment layer cho READ
- không mở growth experiment mới
- không thêm domain mới ngoài READ bootstrap
- không public các cam kết creator economy chưa qua legal review

---

# 12. Definition of Done cho Slice 2

Slice 2 chỉ được coi là đạt nếu:

### System
- READ vào build pipeline
- domain state map rõ (5 states)
- nav sạch

### Content
- 7 domain thiếu đã có content JSON tối thiểu

### SEO / Trust
- all dist-output domains có og:image
- tất cả domain còn thiếu đã có JSON-LD baseline

### Kids
- reduced-motion có
- focus-visible có
- content JSON có
- remediation path đã được quyết (Day 1)

### QA
- không lộ internal text sai
- không có link 502 trong nav chính
- domain planned không bị trình bày như live hoàn chỉnh
- READ không overclaim creator economy features

---

# 13. Chỉ thị ngắn cho toàn team

Không thêm gì mới.  
Chỉ làm cho hệ hiện tại đúng.

Toàn bộ Slice 2 phải được hiểu là:
- sửa nền
- đồng bộ hệ
- giảm nợ kỹ thuật
- tăng trust + SEO + i18n
- chuẩn bị cho các slice sau

---

# 14. Sau Slice 2 sẽ làm gì

Sau khi Slice 2 hoàn tất, có 2 hướng tiếp theo:

## Hướng A — Slice 3: Core Flow Hardening
Mục tiêu:
- khóa flow học → làm → proof → dashboard
- nối education, member, vc, proof chặt hơn
- tăng tính vận hành thật của hệ

## Hướng B — Build Read System
Mục tiêu:
- phát triển `read.vetuonglai.com` thành creator/knowledge system thật
- xây creator economy, payout logic, content commerce layer
- chỉ làm sau khi bootstrap và trust baseline của READ đã ổn
- chỉ làm sau khi legal review xác nhận các cam kết kinh tế

---

# 15. Kết luận cuối

Inventory hiện tại là bằng chứng rằng hệ đã có hình dạng thật.  
Nhưng chính vì đã có hình dạng thật, hệ không còn được phép phát triển theo kiểu thêm tiếp cho nhanh.

Bước đúng bây giờ là tái ưu tiên và sửa nền.

Nếu sửa đúng:
- hệ sẽ thành một platform rõ
- SEO và trust sẽ mạnh hơn
- content sẽ đồng bộ hơn
- domain planned sẽ đỡ giả live
- `kids` sẽ không còn là domain lệch hệ
- `read` sẽ vào hệ đúng vai

Nếu không sửa:
- hệ sẽ càng ngày càng rộng
- nhưng ngày càng khó quản trị
- và sau vài sprint sẽ vỡ cấu trúc đồng bộ.
