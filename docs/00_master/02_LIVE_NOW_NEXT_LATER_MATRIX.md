# 02_LIVE_NOW_NEXT_LATER_MATRIX.md

## Mục đích của file

File này là **nguồn sự thật duy nhất về trạng thái sản phẩm công khai** của toàn hệ `*.vetuonglai.com`.

Mục tiêu:
- khóa lại cái gì đang public thật
- cái gì chỉ ở mức beta / member-preview
- cái gì mới là planned / long-term
- tránh việc homepage, subdomain, legal, content và dev nói khác nhau
- tránh overpromise ở front-end và underbuild ở backend

> Nguyên tắc:
> **Không công bố một giá trị như đang live nếu user public chưa dùng được end-to-end.**
> **Không gọi là planned nếu public surface đã có giá trị thật.**
> **Mọi lời hứa phải bám vào runtime truth.**

---

## 1. Định nghĩa 4 trạng thái chuẩn

### 1.1 LIVE
Dùng khi:
- user public vào được domain
- thấy giá trị thật
- có flow sử dụng thực
- không phải chỉ landing rỗng

### 1.2 BETA
Dùng khi:
- public đã vào được
- có use case thật
- nhưng chưa hoàn chỉnh toàn bộ flow / pricing / member / orchestration

### 1.3 MEMBER PREVIEW
Dùng khi:
- public đã có teaser / preview / pilot value
- phần sâu sẽ mở sau gateway / member layer
- chưa nên hứa như live đầy đủ

### 1.4 PLANNED
Dùng khi:
- chưa có public surface ổn định
- hoặc host / flow chưa dùng được
- hoặc mới là roadmap

---

## 2. Sự thật public hiện tại (current public reality)

Root hub hiện công bố:
- **4 live subdomains**
- **1 beta subdomain**
- **2 subdomains in planning**
- ecosystem registry V1.0
- trust wording “minh bạch vừa đủ, xác minh được độc lập”
- top navigation có `Member`, `Work`, `Market`, `EDU`, `VC`, `LIFE`, `FIN`, `INVEST`, `GREEN`

Tuy nhiên ecosystem registry trên root hiện gắn trạng thái:
- **VC = Live**
- **GREEN = Live**
- **FIN = Live**
- **EDU = Preview/Beta framing**
- **LIFE = Preview**
- **INVEST = Preview**
- **NFT = Bridge**

Đồng thời root public hiển thị package chooser / annual access ngay trên homepage.

EDU public hiện đã có:
- catalog / course routes / `/api/health` / `/api/catalog.json`
- 3 featured offers:
  - Hands-On Startup Building — **$1000**
  - Money Discipline Sprint — **$149**
  - Green Stewardship Pilot — **$99**
- flow packet → VC được mô tả công khai rõ trên site

Các host `member.vetuonglai.com`, `work.vetuonglai.com`, `market.vetuonglai.com` chỉ được xem là live khi public check truy cập ổn định và flow dùng được end-to-end.

---

## 3. Bảng phân loại cuối cùng (FINAL STATUS MATRIX)

### 3.1 LIVE NOW

#### `vetuonglai.com`
**Status:** LIVE

**Lý do:**
- đã là root hub công khai
- có hero, manifesto framing, ecosystem registry, journey entry, trust language, package chooser
- là cổng public chính của toàn hệ hiện tại

**Công bố được:**
- đây là hub V1.0
- có ecosystem map
- có ngôn ngữ song ngữ
- có trust framing
- có annual access framing
- có specialist pack framing ở mức public copy

**Không công bố như đã live đầy đủ:**
- member dashboard full
- cross-domain unlock thật
- specialist entitlement engine
- partner / affiliate fully operational

---

#### `vc.vetuonglai.com`
**Status:** LIVE

**Lý do:**
- root registry gắn Live
- là lớp verify công khai
- có route verify public và public registry độc lập

**Công bố được:**
- verify công khai và độc lập
- trust layer của hệ
- packet / code / verify model

**Không công bố:**
- “không thể fake”
- “vĩnh viễn”
- “bất biến tuyệt đối”

**Ngôn ngữ đúng:**
- “khó giả mạo hơn và dễ kiểm tra hơn”
- “có thể kiểm tra công khai và độc lập”

---

#### `green.vetuonglai.com`
**Status:** LIVE

**Lý do:**
- root registry gắn Live
- được công bố là domain có impact / green evidence / packet rõ ràng

**Công bố được:**
- green impact
- bằng chứng xanh
- packet / verify framing

**Không công bố như đã có đủ:**
- community economy full
- full contribution graph
- full funded project network

---

#### `finance.vetuonglai.com`
**Status:** LIVE

**Lý do:**
- root registry gắn Live
- public copy đã rõ về money discipline, anti-scam, long-term financial behavior

**Công bố được:**
- money discipline
- anti-scam / risk-first
- personal finance foundation

**Không công bố như đã có:**
- full financial dashboard
- personalized financial operating system
- partner investment advisory

---

### 3.2 BETA NOW

#### `edu.vetuonglai.com`
**Status:** BETA

**Lý do:**
- root top-line system count đang dành 1 slot beta
- EDU public đã có catalog, routes, health endpoint, credential packet flow và 3 featured offers thật
- không còn là landing nháp, nhưng chưa nên gọi là live hoàn chỉnh theo member/payment/orchestration

**Công bố được:**
- future education layer
- learn toward proof
- course catalog
- packet → VC flow
- 3 featured offers hiện tại
- VC-linked outcomes

**Không công bố như đã full:**
- full member unlock
- full course player + AI tutor production
- full progress/eligibility engine
- full annual pass integration
- specialist pack integration

**Ngôn ngữ đúng:**
- “EDU đang ở lớp beta có giá trị thật”
- “đã có catalog, route, packet, VC flow”
- “đang mở sâu hơn theo từng lớp member”

---

### 3.3 MEMBER PREVIEW / PILOT-READY

#### `life.vetuonglai.com`
**Status:** MEMBER PREVIEW

**Lý do:**
- root registry hiện để Preview
- theo current positioning nội bộ, LIFE đã ở mức pilot-ready, không phải landing trống
- chưa nên public như live full system

**Công bố được:**
- life operating system
- nhịp sống, recovery, rhythm, discipline
- pilot blocks / preview value

**Không công bố như đã có đủ:**
- full routines engine
- full recovery protocols
- full personalized rhythm dashboard

**Ngôn ngữ đúng:**
- “preview có giá trị”
- “pilot-ready”
- “mở sâu trong lớp member”

---

#### `invest.vetuonglai.com`
**Status:** MEMBER PREVIEW

**Lý do:**
- root registry hiện để Preview
- public framing đã rõ: due diligence, risk appetite, no-FOMO rule
- chưa nên gọi là live invest platform

**Công bố được:**
- sane investing framing
- due diligence
- risk-first / no-FOMO

**Không công bố:**
- trading platform
- advisory service
- guaranteed investing outcomes
- “không cần phỏng vấn / không cần đánh giá”

---

### 3.4 SPECIAL / SUPPORTING PUBLIC STATUS

#### `nft.iai.one`
**Status:** BRIDGE

**Lý do:**
- root registry công bố rõ là bridge
- dùng để mirror một số bản ghi số, không phải trust layer chính

**Công bố được:**
- bridge / mirror / metadata / proof-url relationship

**Không công bố:**
- “NFT là nguồn sự thật chính”
- “NFT thay thế VC”

---

### 3.5 PLANNED / NOT PUBLICLY AVAILABLE

#### `member.vetuonglai.com`
**Status:** PLANNED

**Lý do:**
- xuất hiện trong nav root
- chỉ chuyển sang live khi host public ổn định và member flow dùng được thực tế

**Public wording đúng:**
- “sẽ mở cùng Future Access Pass”
- “member area is opening next”

---

#### `work.vetuonglai.com`
**Status:** PLANNED

**Lý do:**
- xuất hiện trong nav root
- chỉ nâng trạng thái khi có public job/workflow usable

---

#### `market.vetuonglai.com`
**Status:** PLANNED

**Lý do:**
- xuất hiện trong nav root
- chỉ nâng trạng thái khi có public commerce surface usable

---

#### Các domain roadmap khác
- `community.vetuonglai.com`
- `mission.vetuonglai.com`
- `healing.vetuonglai.com`
- `stories.vetuonglai.com`
- `foundation.vetuonglai.com`
- `labs.vetuonglai.com`
- `ai.vetuonglai.com`
- `live.vetuonglai.com`
- `tools.vetuonglai.com`
- `affiliate.vetuonglai.com`
- `api.vetuonglai.com`
- `admin.vetuonglai.com`

**Status:** PLANNED / INTERNAL / NOT PUBLIC YET

**Nguyên tắc:**
Chỉ được công bố như roadmap / future layers, không được liệt kê như public destinations cho đến khi có working public surface hoặc controlled member surface.

---

## 4. Quy tắc copy bắt buộc theo status

### Nếu domain = LIVE
Được dùng:
- đang mở
- đang hoạt động
- có thể truy cập công khai
- có giá trị sử dụng thật

### Nếu domain = BETA
Được dùng:
- đang ở lớp beta
- đã có giá trị sử dụng thật
- chưa hoàn thiện toàn bộ flow
- đang mở sâu dần

Không dùng:
- fully live
- production complete
- open all systems

### Nếu domain = MEMBER PREVIEW
Được dùng:
- preview
- pilot-ready
- xem trước
- mở sâu trong member layer

Không dùng:
- live
- full system
- complete experience

### Nếu domain = PLANNED
Được dùng:
- planned
- coming next
- sẽ mở ở lớp kế tiếp
- đang chuẩn bị

Không dùng:
- available now
- open now
- enter now

---

## 5. Quy tắc nav và route công khai

### Primary nav chỉ được chứa:
- hub
- live domains
- beta domain nếu click vào vẫn dùng được thật
- cert / verify / api nếu public

### Không được để trong primary nav như destination thật:
- planned domains chưa có host usable
- destinations không truy cập ổn định
- internal QA links
- pages.dev preview URLs

### Preview URLs
`*.pages.dev` chỉ được dùng:
- trong internal QA
- trong runtime truth docs
- trong admin / staging references

Không được đẩy ra public homepage như link chính.

---

## 6. Future Access Pass và mối quan hệ với matrix này

Matrix này phải làm rõ:

### Public layer
- user thấy live / beta / member-preview
- user có thể đọc teaser + demo + summary

### Future Access Pass
- không biến planned thành live
- chỉ mở **member depth** cho các domain đã sẵn sàng có lớp member

### Specialist packs
- không public như “đã live hết”
- chỉ mở khi pass + dashboard + entitlement logic thật đã chạy

---

## 7. Cách team dev phải dùng file này

### FE team
- render badge/status đúng theo file này
- không hard-code status khác ở từng trang

### Content team
- copy tất cả domain theo đúng status
- không dùng từ quá mức so với runtime truth

### Product/PM
- roadmap phải bám matrix này
- không ship CTA đẩy user vào domain planned như live destination

### Legal / Trust
- chỉ duyệt public claims bám đúng matrix này

### Founder / Growth
- mọi chiến dịch phải kiểm tra trước với matrix này

---

## 8. Quy tắc cập nhật file này

File này chỉ được cập nhật khi có **runtime proof**:

Một domain chỉ được nâng status khi:
- host công khai dùng được
- có flow người dùng thật
- có value layer thật
- không còn là teaser / preview

Ví dụ:
- `member` từ planned → beta khi có login + dashboard tối thiểu
- `work` từ planned → beta khi có job board usable
- `market` từ planned → beta khi có listing + checkout usable
- `life` / `invest` từ member-preview → beta/live khi flow sâu chạy thật

---

## 9. Câu kết luận để dùng nội bộ

> Hiện tại, Về Tương Lai đã có một hub public thật, một trust layer thật, một EDU beta có giá trị thật, và các trụ cột sống / tiền / đầu tư / xanh đang ở các mức live hoặc member-preview có thật. Những lớp member, specialist, partner, work, market và community chỉ được public theo đúng mức độ runtime truth — không được hứa trước khi flow thật tồn tại.
