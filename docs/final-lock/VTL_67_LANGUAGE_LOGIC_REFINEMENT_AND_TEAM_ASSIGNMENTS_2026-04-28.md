# VTL 67 — TINH CHỈNH NGÔN NGỮ, TƯ DUY, LOGIC TỔNG THỂ + GIAO NHIỆM VỤ 5 TEAM

Phiên bản: 1.1
Ngày: 2026-04-28
Trạng thái: active — bắt buộc thực thi
Owner điều phối: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · Ops
**Universal Standard:** Phải tuân thủ `docs/00_master/00_UNIVERSAL_WEB_PROJECT_MASTER_IMPLEMENTATION_LOCK_BILINGUAL.md`

---

## 0. Compliance với Universal Standard

Tài liệu này áp dụng các quy tắc cốt lõi từ Universal Standard:

- Section 6 (Brand/Language): Ngôn ngữ công khai phải calm, precise, real, non-sales ✅
- Section 7 (Bilingual Switch): 🇻🇳 Tiếng Việt / 🇺🇸 English — KHÔNG dùng VI/EN ✅
- Section 4 (Non-Negotiable): Không expose internal technical labels ra trang công khai ✅
- Section 8 (Content Source): Toàn bộ text công khai phải từ content JSON ✅

Bảng thuật ngữ bị cấm trên trang công khai (từ Universal Standard Section 6 + VTL_67):

| Thuật ngữ bị cấm | Thay thế tiếng Việt |
|---|---|
| planned-safe | (không hiển thị) |
| CTA | nút hành động |
| intent | hướng đi |
| i18n | đa ngôn ngữ |
| deep-content | nội dung chuyên sâu |
| Layer A/B/C/D | lớp công khai / lớp thành viên / lớp chuyên sâu |
| gateway CTA | nút đi tiếp |
| disclosure block | ghi chú công khai |
| trust-layer | niềm tin |
| purchase hub | điểm vào |

---

## PHẦN A — PHÂN TÍCH TỔNG THỂ HỆ THỐNG

### A1. Triết lý cốt lõi (đã đúng, cần giữ)

Hệ Về Tương Lai có triết lý nhất quán xuyên suốt:

- **Không hứa hẹn kết quả** — chỉ cung cấp cấu trúc
- **Bằng chứng trước niềm tin** — VC xác minh thật, không claim suông
- **Mỗi lớp một việc** — hub không dạy, edu không verify, vc không bán
- **Chống hype** — không FOMO, không income promise, không get-rich-quick

Đây là DNA tốt. Nhưng **cách truyền tải DNA này đang có vấn đề**.

### A2. Vấn đề nghiêm trọng phát hiện

#### CRITICAL-1: vc.vetuonglai.com trả 403
- Toàn bộ hệ giới thiệu VC là lớp xác minh cốt lõi
- Mọi subdomain đều có CTA "Mở sample VC" → vc.vetuonglai.com
- **Nhưng VC trả 403 Forbidden** — người dùng không vào được
- Kết quả: lời hứa "bằng chứng kiểm chứng được" bị phá vỡ ngay từ CTA đầu tiên

#### CRITICAL-2: Bán gói cho domain chưa mở
- LIFE (planned) có CTA: `pack=g3` → hub checkout
- INVEST (planned) có CTA: `pack=g5` → hub checkout
- Người dùng có thể trả tiền cho nội dung **chưa tồn tại**
- Vi phạm trực tiếp triết lý "không hứa hẹn"

#### CRITICAL-3: Ngôn ngữ kỹ thuật rò rỉ ra public
- `"planned-safe"`, `"runtime"`, `"session-states.json"`, `"CTA"`, `"intent=specialist-pack"` xuất hiện trên giao diện
- Mã gói `G1-G9` hiển thị cho người dùng không giải thích
- Link đến JSON API endpoint trên trang member
- Đoạn "Language Codex" dùng từ `i18n`, `SEO`, `route kỹ thuật` trên trang chủ

#### CRITICAL-4: Tiếng Anh trộn tiếng Việt không nhất quán
- Nav dùng tiếng Anh: `Hub`, `EDU`, `VC`, `LIFE`, `FIN`, `INVEST`, `GREEN`
- Hero dùng tiếng Việt: `HỌC`, `TIỀN`, `NHỊP SỐNG`, `ĐẦU TƯ`, `XANH`
- Brand mark Wave D: `WK`, `MK`, `CM`, `BS` — viết tắt khó hiểu
- Thuật ngữ trộn trong câu: `"baseline"`, `"proof"`, `"brief"`, `"cohort"`, `"peer support"`, `"disclosure"`, `"scorecard"`, `"SOP"`, `"workflow"`, `"output"`

#### CRITICAL-5: User journey vòng lặp không thoát
- Hub → Subdomain → "Quay về hub" → Hub
- Mọi subdomain đều nói "Mở toàn bộ hệ của bạn" → quay về hub
- Không subdomain nào có chiều sâu nội dung đủ để giữ chân
- Demo sections chỉ là bullet points, không có demo thật
- Người dùng cảm nhận: landing page mỏng xếp vòng tròn

#### HIGH-1: Lặp nội dung quá nhiều
- "Ghi chú công khai" lặp 3-4 lần trên cùng 1 trang
- Đoạn "Đi tiếp đúng cổng" + "Niềm tin & trạng thái" + "Ranh giới công khai" gần như giống nhau trên mọi subdomain
- Member page có 4 block "Ghi chú công khai" liên tiếp

#### HIGH-2: Planned domains giống nhau quá
- work/market/community/ai/business dùng cùng 1 template
- Wording gần như copy-paste, chỉ đổi vài từ khóa
- Không tạo cảm giác mỗi domain có bản sắc riêng

#### HIGH-3: "0 domain mở lớp thành viên" trên trang chủ
- Metric card hiện "0" — tạo ấn tượng không gì đang hoạt động
- Phản tác dụng marketing

---

## PHẦN B — NGUYÊN TẮC TINH CHỈNH NGÔN NGỮ

### B1. Nguyên tắc ngôn ngữ mới (thay thế Language Codex hiện tại)

1. **Tiếng Việt là gốc**. Khi dùng tiếng Việt, KHÔNG trộn thuật ngữ tiếng Anh trừ khi không có từ Việt tương đương phổ biến (ví dụ: "email", "app")
2. **Thuật ngữ nội bộ không ra public**. Không bao giờ hiển thị: `planned-safe`, `runtime`, `CTA`, `intent`, `session`, `webhook`, `deploy`, `smoke test`, `entry point` (thay bằng "điểm vào")
3. **Mã gói cần tên gợi nghĩa**. Thay `G1` bằng tên đầy đủ: "Nền Tảng Tư Duy ($9)". Mã chỉ dùng trong hệ thống
4. **Status badges bằng tiếng Việt**: `"Đang hoạt động"` thay `"Live"`, `"Đang chuẩn bị"` thay `"Planned"`, `"Xem trước"` thay `"Preview"`
5. **Không lặp disclosure hơn 1 lần trên cùng trang**
6. **Demo phải demo thật** — hiển thị nội dung mẫu, không chỉ mô tả nội dung mẫu sẽ trông như thế nào

### B2. Bảng thay thế thuật ngữ

| Hiện tại (sai) | Thay bằng (đúng) |
|---|---|
| `Live` | `Đang hoạt động` |
| `Planned` | `Đang chuẩn bị` |
| `Bridge` | `Cầu nối` |
| `Member Preview` | `Thành viên xem trước` |
| `baseline` | `nền tảng / mốc khởi đầu` |
| `proof` | `bằng chứng` |
| `brief` | `bản tóm tắt công việc` |
| `cohort` | `nhóm đồng hành` |
| `peer support` | `hỗ trợ ngang hàng` |
| `disclosure` | `ghi chú minh bạch` |
| `scorecard` | `bảng đánh giá` |
| `SOP` | `quy trình chuẩn` |
| `workflow` | `quy trình làm việc` |
| `output` | `đầu ra` |
| `use-case` | `tình huống thực tế` |
| `CTA` | (xóa, không hiện cho user) |
| `planned-safe` | (xóa, không hiện cho user) |
| `Public value` | `Giá trị công khai` |
| `Demo` | `Xem trước` |
| `Language Codex` | `Nguyên tắc ngôn ngữ` |
| `Trust note` | `Ghi chú niềm tin` |

### B3. Nguyên tắc tư duy cho nội dung

1. **Người dùng không phải developer** — viết cho người đang tìm giải pháp sống, không phải người đọc docs
2. **Mỗi trang phải trả lời được: "Tôi đến đây thì được gì?"** — trong 5 giây đầu
3. **Planned domain không bán** — chỉ giới thiệu, thu thập quan tâm, dẫn về hub để đọc thêm (KHÔNG checkout)
4. **Mỗi subdomain phải có bản sắc riêng** — không copy-paste template
5. **Demo phải có nội dung thật** — ít nhất 1 sample hiển thị inline, không chỉ bullet points

---

## PHẦN C — TINH CHỈNH LOGIC HỆ THỐNG

### C1. Sửa luồng checkout cho planned domains

```
TRƯỚC (sai):
  life.vetuonglai.com → CTA "Mở toàn bộ hệ" → hub/?pack=g3&intent=specialist-pack → checkout

SAU (đúng):
  life.vetuonglai.com → CTA "Đăng ký quan tâm" → hub/?entry=life&intent=interest → form ghi nhận
                       → CTA "Xem hệ đang mở" → hub/ (không có pack/intent params)
```

Áp dụng cho: `life`, `invest`, `work`, `market`, `community`, `ai`, `business`

### C2. Sửa VC 403

- VC phải trả 200 với ít nhất 1 trang public giới thiệu cách xác minh hoạt động
- Hoặc: mọi link "Mở sample VC" phải trỏ về một trang fallback hợp lệ (không 403)

### C3. Sửa metric card trang chủ

```
TRƯỚC:
  6 domain đang hoạt động | 0 domain mở lớp thành viên | 7 domain đang chuẩn bị

SAU:
  6 lớp đang hoạt động | 9 gói chiều sâu | 13 lĩnh vực trong hệ | Phiên bản 1.0
```

### C4. Sửa lặp disclosure

- Mỗi trang chỉ 1 block "Ghi chú minh bạch" ở cuối trang, trước footer
- Xóa các block trùng lặp giữa trang

### C5. Sửa nav labels

```
TRƯỚC: Hub | EDU | VC | LIFE | FIN | INVEST | GREEN
SAU:   Trang chủ | Học | Xác minh | Nhịp sống | Tài chính | Đầu tư | Xanh
```

Khi chuyển sang English: `Home | Learn | Verify | Life | Finance | Invest | Green`

### C6. Sửa brand marks Wave D

```
TRƯỚC: WK / MK / CM / BS
SAU:   Việc / Chợ / Cộng / DN
```

Hoặc dùng icon thay vì abbreviation.

---

## PHẦN D — GIAO NHIỆM VỤ CỤ THỂ CHO TỪNG TEAM

---

### TEAM 1 — Platform, Access, Commerce Core

**Lời nhắn:**

> Team 1, runtime của các bạn đã solid — 82% hoàn thành, smoke tests xanh, contracts khớp. Nhưng có 2 lỗi logic nghiêm trọng cần sửa ngay: (1) planned domains đang cho phép checkout, và (2) VC trả 403 khiến toàn bộ CTA "Mở sample VC" trên hệ bị gãy. Đây là việc của platform layer — các bạn phải chặn từ runtime, không để Team 2 phải sửa từng CTA thủ công.

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | File/Scope |
|---|------|----------|------------|
| T1-1 | **Chặn checkout cho planned domains**: Sửa `access-runtime.mjs` — khi `entry` thuộc planned domain (`life`, `invest`, `work`, `market`, `community`, `ai`, `business`) VÀ `intent` là `specialist-pack` hoặc `annual-access`, trả redirect về hub KHÔNG có checkout params. Ghi log `checkout_blocked_planned_domain`. | P0 | `workers/lib/access-runtime.mjs` |
| T1-2 | **Sửa VC 403**: Phối hợp Ops kiểm tra tại sao `vc.vetuonglai.com` trả 403. Nếu là worker route issue → fix route. Nếu là auth gate → thêm public fallback page. VC phải có ít nhất 1 trang public trả 200. | P0 | `workers/vc-worker.mjs`, Ops |
| T1-3 | **Thêm intent `interest`**: Thêm intent mới `"interest"` vào `access-model.json` routeContract — cho phép planned domains thu thập quan tâm mà không trigger checkout. | P1 | `src/data/access-model.json` |
| T1-4 | **Sửa metric card data**: Thay đổi hub metrics — bỏ "0 domain mở lớp thành viên", thay bằng "9 gói chiều sâu" hoặc "13 lĩnh vực trong hệ". | P1 | `scripts/build.mjs`, `content/vi.json` |
| T1-5 | **Giữ ops blocker scripts sẵn sàng**: Khi nhận credentials từ Ops → chạy inject + verify ngay. | P1 | `scripts/ops-*.mjs` |

---

### TEAM 2 — Frontend, UX, Content Surfaces

**Lời nhắn:**

> Team 2, ngôn ngữ trên hệ hiện đang rò rỉ quá nhiều thuật ngữ kỹ thuật và tiếng Anh vào nội dung tiếng Việt. Người dùng thật không biết "planned-safe" nghĩa là gì, không hiểu tại sao CTA nói "intent=specialist-pack". Các bạn là tuyến phòng thủ cuối — nếu có từ nào người bình thường không hiểu, nó phải bị xóa hoặc thay bằng tiếng Việt phổ thông. Ngoài ra, mỗi subdomain đang giống nhau quá — cần bản sắc riêng cho từng lớp.

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | File/Scope |
|---|------|----------|------------|
| T2-1 | **Thay toàn bộ status badges**: `Live` → `Đang hoạt động`, `Planned` → `Đang chuẩn bị`, `Bridge` → `Cầu nối`. Sửa trong `content/vi.json` + build script. | P0 | `content/vi.json`, `scripts/build.mjs` |
| T2-2 | **Thay nav labels sang tiếng Việt**: `Hub` → `Trang chủ`, `EDU` → `Học`, `VC` → `Xác minh`, `LIFE` → `Nhịp sống`, `FIN` → `Tài chính`, `INVEST` → `Đầu tư`, `GREEN` → `Xanh`. | P0 | `content/vi.json`, build |
| T2-3 | **Quét và thay 30+ thuật ngữ Anh trong nội dung Việt**: Dùng bảng thay thế ở mục B2. Ưu tiên: `baseline` → `mốc khởi đầu`, `proof` → `bằng chứng`, `brief` → `bản tóm tắt`, `cohort` → `nhóm đồng hành`, `disclosure` → `ghi chú minh bạch`. | P0 | Toàn bộ `content/vi.json` + static pages |
| T2-4 | **Xóa section "Language Codex" khỏi trang chủ public**: Nội dung này là internal docs, không phải cho người dùng. | P0 | `scripts/build.mjs` (hub section) |
| T2-5 | **Giảm lặp disclosure**: Mỗi trang giữ TỐI ĐA 1 block "Ghi chú minh bạch", đặt ở cuối trang trước footer. Xóa tất cả block trùng lặp. | P1 | Toàn bộ dist pages |
| T2-6 | **Sửa CTA planned domains**: Thay `"Mở toàn bộ hệ của bạn"` (có checkout params) bằng `"Đăng ký quan tâm"` (intent=interest) + `"Xem hệ đang hoạt động"` (về hub không có params). | P1 | Planned domain pages |
| T2-7 | **Tạo bản sắc riêng cho Wave D**: Mỗi domain (work/market/community/ai/business) cần ít nhất 1 phần nội dung khác biệt — không copy-paste template. Gợi ý: work có demo brief thật, market có sample asset thật, community có nguyên tắc tham gia chi tiết, ai có demo tương tác mẫu. | P1 | Planned domain HTML |
| T2-8 | **Sửa brand marks**: `WK` → `Việc`, `MK` → `Chợ`, `CM` → `Cộng`, `BS` → `DN`. Hoặc thay bằng emoji/icon. | P2 | `content/vi.json`, build |
| T2-9 | **Sửa member page**: Xóa link JSON API endpoint, xóa "Mobile V1 chỉ hỗ trợ hành trình", xóa 3/4 block "Ghi chú công khai" trùng lặp, xóa "Affiliate chưa mở ở gói năm cơ bản". | P1 | `dist/member.vetuonglai.com` source |
| T2-10 | **Package table trang chủ**: Thay mã G1-G9 bằng tên đầy đủ tiếng Việt. Bỏ cột "Code". Giữ: Tên gói / Giá / Mở. | P1 | Hub page |

---

### TEAM 3 — Governance, Trust, QA Gate

**Lời nhắn:**

> Team 3, audit hiện tại đang tốt ở mức structure nhưng thiếu ở mức ngôn ngữ. Có 30+ thuật ngữ tiếng Anh rò rỉ vào nội dung tiếng Việt mà chưa bị chặn. "Planned" domains đang có CTA dẫn đến checkout — vi phạm policy "không bán cái chưa có". VC trả 403 — vi phạm policy "bằng chứng kiểm tra được". Cần siết go/no-go gates cho ngôn ngữ, không chỉ cho code.

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | File/Scope |
|---|------|----------|------------|
| T3-1 | **Cập nhật wording policy**: Thêm rule mới — "Planned domain KHÔNG ĐƯỢC có CTA dẫn đến checkout (intent=specialist-pack hoặc annual-access)". Thêm vào `team3-policy-matrix.json`. | P0 | `src/data/team3-policy-matrix.json` |
| T3-2 | **Tạo banned-term list cho public surfaces**: Danh sách thuật ngữ KHÔNG được xuất hiện trên giao diện tiếng Việt: `planned-safe`, `runtime`, `CTA`, `intent`, `session`, `webhook`, `deploy`, `smoke`, `entry point` (cho phép "điểm vào"), `i18n`, `route kỹ thuật`. | P0 | Policy doc + verify script |
| T3-3 | **Audit lại toàn bộ live pages**: Dùng banned-term list quét cả 13 domain. Ghi nhận vi phạm, giao cho Team 2 sửa. | P0 | Audit report |
| T3-4 | **Cập nhật go/no-go cho Wave C**: `life`/`invest` hiện có CTA checkout — phải là NO-GO cho promotion cho đến khi CTA được sửa. | P1 | Wave C go/no-go |
| T3-5 | **Thêm ngôn ngữ vào verify script**: Sửa `verify-team3-parity.mjs` để quét banned terms trong dist HTML. Nếu phát hiện → fail parity check. | P1 | `scripts/verify-team3-parity.mjs` |

---

### TEAM 4 — Data, Registry, Forms, Content Contracts

**Lời nhắn:**

> Team 4, data contracts đã pass 88% nhưng cần điều chỉnh ở mức ngôn ngữ. Package names trong registry cần thống nhất tiếng Việt cho public, giữ tiếng Anh cho internal. Domain missions trong system-registry đang dùng tiếng Anh cho các domain live — cần đổi sang tiếng Việt. Business domain contract cần tách rõ: ngôn ngữ nào cho doanh nghiệp (có thể Anh), ngôn ngữ nào cho cá nhân (phải Việt).

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | File/Scope |
|---|------|----------|------------|
| T4-1 | **Sửa system-registry missions sang tiếng Việt**: `hub`: `"onboarding + ecosystem map"` → `"giới thiệu hệ và bản đồ các lớp"`. `edu`: → `"học để làm được việc, tạo đầu ra, nối sang xác minh"`. `vc`: → `"sổ xác minh độc lập"`. Tất cả live domains phải có mission tiếng Việt. | P0 | `src/data/system-registry.json` |
| T4-2 | **Package names cho public display**: Thêm trường `publicNameVi` cho từng gói trong `package-form-registry.json`. Ví dụ: G1 → `"Nền Tảng Tư Duy"`, G2 → `"Kỷ Luật Tài Chính"`, G3 → `"Hệ Điều Hành Sống"`. | P1 | `src/data/package-form-registry.json` |
| T4-3 | **Business contract ngôn ngữ**: Thêm trường `displayLanguage: "vi"` hoặc `"en"` cho từng output trong business-domain-contract, để build script biết render bằng ngôn ngữ nào. | P2 | `src/data/business-domain-contract.json` |

---

### TEAM 5 — Release Gate, Total System Verify

**Lời nhắn:**

> Team 5, hệ thống hiện có 6 critical issues cần chặn ở release gate. Từ giờ, release gate phải kiểm tra cả ngôn ngữ — không chỉ code/runtime. Một hệ "chống hype" mà để thuật ngữ kỹ thuật rò rỉ hoặc bán gói cho domain chưa mở là vi phạm chính triết lý hệ. Thêm 3 gate checks mới.

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | File/Scope |
|---|------|----------|------------|
| T5-1 | **Thêm gate: no-checkout-for-planned**: Verify rằng không CTA nào trên planned domains có `intent=specialist-pack` hoặc `intent=annual-access`. | P0 | `scripts/verify-total-system-release-gate.mjs` |
| T5-2 | **Thêm gate: vc-public-reachable**: Verify `vc.vetuonglai.com` trả 200 (không 403). | P0 | Release gate script |
| T5-3 | **Thêm gate: banned-terms-clean**: Verify dist HTML không chứa banned terms từ Team 3 list. | P1 | Release gate script |
| T5-4 | **Rerun total system gate sau khi Team 1-4 hoàn thành**: Chỉ ký release khi cả 3 gates mới đều pass. | P1 | Tổng verify |

---

### OPS — Infrastructure, DNS, Secrets

**Lời nhắn:**

> Ops, có 3 blockers chỉ các bạn mới gỡ được: (1) Secret values cho 3 workers — Team 1 đã chuẩn bị script inject sẵn, chỉ cần giá trị thật. (2) Zone activation — nameservers cần đổi sang barbara/patrick. (3) Wave D DNS cho 5 hosts. Ngoài ra, VC trả 403 cần kiểm tra — có thể là worker route hoặc access rule trên Cloudflare dashboard.

**Nhiệm vụ bắt buộc:**

| # | Task | Priority | Scope |
|---|------|----------|-------|
| OPS-1 | **Cung cấp secret values**: Điền vào `.env.secrets` (copy từ `.env.secrets.template`) và gửi cho Team 1 qua kênh bảo mật. | P0 | Secure channel |
| OPS-2 | **Đổi nameservers**: Tại domain registrar, đổi từ `davina`/`justin` sang `barbara`/`patrick`. | P0 | Domain registrar |
| OPS-3 | **Kiểm tra VC 403**: Vào Cloudflare Dashboard → vetuonglai-vc worker → kiểm tra routes, access rules, hoặc firewall rules có chặn public access không. | P0 | Cloudflare Dashboard |
| OPS-4 | **Wave D DNS**: Sau khi zone active, chạy `node scripts/ops-setup-wave-d-dns.mjs` hoặc tạo CNAME records thủ công cho 5 hosts. | P1 | Cloudflare DNS |
| OPS-5 | **Rotated API key từ Team Pay**: Liên hệ pay.iai.one để nhận rotated production key, gửi cho Team 1. | P1 | External |

---

## PHẦN E — TIMELINE THỰC THI

| Ngày | Team | Nhiệm vụ |
|------|------|----------|
| D+0 (hôm nay) | Tất cả | Đọc và xác nhận VTL_67 |
| D+0 → D+1 | Team 1 | T1-1 (chặn checkout planned), T1-2 (VC 403), T1-3 (intent interest) |
| D+0 → D+1 | Team 2 | T2-1 (badges), T2-2 (nav), T2-3 (thuật ngữ), T2-4 (xóa Language Codex) |
| D+0 → D+1 | Team 3 | T3-1 (policy), T3-2 (banned list), T3-3 (audit) |
| D+0 → D+1 | Team 4 | T4-1 (missions), T4-2 (package names) |
| D+0 → D+1 | Ops | OPS-1, OPS-2, OPS-3 |
| D+1 → D+2 | Team 2 | T2-5 → T2-10 |
| D+1 → D+2 | Team 5 | T5-1 → T5-3 |
| D+2 → D+3 | Team 5 | T5-4 (total system rerun) |
| D+3 | Tất cả | Verify tổng + cập nhật % hoàn thành |

---

## PHẦN F — VERIFY COMMANDS SAU KHI THỰC THI

```bash
# Core
npm run build
npm run check

# Access runtime (bao gồm planned domain checkout block)
node scripts/smoke-access-runtime.mjs

# Team 3 parity (bao gồm banned terms)
npm run verify:team3:parity

# Wave gates
npm run verify:planned-safe:wave:release

# Total system
node scripts/verify-total-system-release-gate.mjs

# VC reachable
curl -sS -o /dev/null -w "%{http_code}" https://vc.vetuonglai.com
# Mong đợi: 200 (không 403)
```

---

## PHẦN G — CAM KẾT

Mỗi team lead xác nhận đã đọc và hiểu VTL_67 bằng cách ghi:

```
Team [X] đã đọc VTL_67.
Xác nhận: [tên] — [ngày giờ ICT]
Nhiệm vụ nhận: [liệt kê mã task]
Blocker nếu có: [mô tả]
```

---

Không team nào được bỏ qua file này. Đây là đợt tinh chỉnh ngôn ngữ + logic quan trọng nhất kể từ khi hệ ra mắt.
