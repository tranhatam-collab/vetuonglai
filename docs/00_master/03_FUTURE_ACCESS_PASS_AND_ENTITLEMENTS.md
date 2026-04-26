# 03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md

## Mục đích của file

File này khóa toàn bộ logic của:

- **Future Access Pass**
- giá **3 USD năm đầu**
- giá **99 USD từ năm 2 trở đi**
- đăng nhập bằng **magic link**
- hệ **entitlements** mở quyền toàn hệ
- mối quan hệ giữa:
  - public layer
  - member layer
  - specialist packs
  - partner / referral layer

Đây là file source of truth cho:
- product
- backend
- auth
- payment
- legal
- content
- growth

---

## 1. Định nghĩa Future Access Pass

Future Access Pass không phải:
- mua một bài viết
- mua một khóa học đơn lẻ
- mua vài nội dung premium

Future Access Pass là:
- quyền **bước vào hệ**
- quyền **mở lớp member của toàn hệ**
- quyền có **identity xuyên suốt**
- quyền có **dashboard hành trình cá nhân**
- quyền mở lớp nội dung sâu hơn so với public
- quyền truy cập vào **các domain đã sẵn sàng ở lớp member**

### Câu định vị chính thức
> Bạn không trả tiền để đọc thêm vài bài.
> Bạn trả tiền để mở một hệ thống có thể đồng hành cùng hành trình sống, học, làm và phát triển của bạn.

### Câu CTA chính thức
> Mở toàn bộ hệ của bạn

---

## 2. Mô hình giá

### 2.1 Giá chính thức công bố
- **Năm đầu tiên:** 3 USD
- **Từ năm thứ 2 trở đi:** 99 USD / năm
- renewal hàng năm ở mức 99 USD

### 2.2 Nguyên tắc pricing
- 3 USD là giá **gateway / entry year**
- 99 USD là giá **duy trì quyền vào hệ**
- không được diễn đạt như “giảm giá sốc”
- không được diễn đạt như “khuyến mãi ngắn hạn”
- đây là **cấu trúc giá chiến lược**, không phải flash sale

### 2.3 Cách copy đúng
Đúng:
- “Năm đầu tiên 3 USD để mở hệ”
- “Từ năm thứ hai trở đi 99 USD / năm”
- “Trong thời gian đó hệ sẽ tiếp tục được nâng cấp về nội dung, công cụ, AI, cộng đồng và bằng chứng xác minh”

Sai:
- “mua một lần dùng mãi”
- “giá rẻ vĩnh viễn”
- “ưu đãi hôm nay duy nhất”
- “chốt đơn kẻo lỡ”

---

## 3. Bản chất kỹ thuật của Pass

Future Access Pass phải được triển khai như:
- **subscription**
- không phải one-time order

Lý do:
- có năm đầu giá đặc biệt
- có renewals tự động / có cấu trúc rõ
- entitlement có thời hạn
- legal/accounting rõ hơn
- phù hợp cho member access

### Product taxonomy chuẩn
- **Pass** = subscription access
- **Pack** = one-time chuyên đề
- **Program** = cohort / đồng hành sâu
- **Partner** = quyền nâng cao có duyệt

---

## 4. Những gì Pass mở

Future Access Pass mở:
- lớp member của các domain đã sẵn sàng
- dashboard cá nhân
- recommendation / journey engine
- lớp hướng dẫn và demo sâu
- AI layer cơ bản
- nội dung không public của toàn hệ
- quyền thấy toàn bộ hệ ở lớp core

### Không tự động mở
- specialist packs
- coaching
- one-time deep systems
- partner privileges
- affiliate rights
- API access
- private circles sâu
- enterprise / business features

---

## 5. Entitlement model tổng

### 5.1 Khái niệm entitlement
Entitlement = quyền truy cập mà backend cấp cho user sau khi có payment và state hợp lệ.

Entitlement không được:
- quyết định ở frontend
- dựa chỉ vào query param
- dựa chỉ vào auth provider
- mở bằng client-side logic

Entitlement phải do:
- backend / member service quyết định
- dựa trên payment state + account state + product ownership

---

### 5.2 Các entitlement chính

#### A. `public_access`
Ai cũng có.
Cho phép:
- đọc teaser
- xem demo
- xem content public
- thấy CTA vào hệ

#### B. `future_access_member`
Có khi:
- Pass active

Cho phép:
- đăng nhập toàn hệ
- xem lớp member cơ bản
- truy cập dashboard
- vào các subdomain ở lớp member

#### C. `specialist_pack_access:<pack_id>`
Có khi:
- user đã mua one-time pack cụ thể

Cho phép:
- mở module chuyên sâu tương ứng
- thấy dashboard pack đó
- dùng AI / worksheet / demo sâu của pack đó

#### D. `verified_builder`
Có khi:
- user đã có proof / credential / state đủ điều kiện

Cho phép:
- đi sâu vào các lớp tạo giá trị
- mở thêm trust / showcase / một số con đường work/partner sau này

#### E. `partner_access`
Có khi:
- được xét duyệt
- hoặc đủ criteria theo policy

Cho phép:
- co-brand / referral sâu / API / curated opportunity tùy level

---

### 5.3 Entitlement matrix mức cao

#### Pass active
Mở:
- root member dashboard
- member content của root
- member content của EDU / LIFE / FINANCE / INVEST / GREEN / VC nếu domain đó đã support member layer
- journey recommendations
- cross-domain visibility

#### Pass inactive / expired
Không mở:
- member content
- dashboard sâu
- specialist dashboards
- protected guides
- cross-domain unlock

Nhưng vẫn cho:
- login
- xem trạng thái tài khoản
- renew
- xem public content

#### Pack purchased nhưng pass expired
Nguyên tắc đề xuất:
- pack ownership vẫn lưu
- nhưng quyền vào hệ core bị hạn chế nếu Pass hết hạn
- user cần active pass để dùng trọn workflow toàn hệ

Lý do:
- Pass là cửa vào hệ
- Pack là chiều sâu trong hệ

> Team legal/product phải chốt rõ câu này trong policy để không gây hiểu lầm.

---

## 6. Flow chuẩn: Email -> Payment -> Webhook -> Provisioning -> Magic Link

### 6.1 Flow tổng

```text
User click "Mở toàn bộ hệ của bạn"
-> nhập email
-> tạo candidate member
-> redirect sang payment
-> payment thành công
-> webhook về backend
-> activate member
-> gửi magic link
-> user login
-> entitlements được nạp
-> dashboard mở toàn hệ core
```

---

### 6.2 Candidate email

Email nhập trước checkout là:
- `candidate_email`
- chưa phải member active
- chưa được cấp quyền

Mục đích:
- giữ identity xuyên flow checkout
- dùng làm base để gửi magic link
- map với payment record / subscription record

Không được làm:
- mở quyền ngay sau khi user nhập email
- mở quyền chỉ vì user về từ trang thank-you

---

### 6.3 Payment success source of truth

Chỉ có backend webhook hợp lệ mới được xem là nguồn sự thật để:
- activate member
- create subscription state
- cấp entitlements

Không được dùng làm source of truth:
- query params từ client
- frontend success page
- local storage
- user nói “tôi đã trả”

---

### 6.4 Provisioning

Sau webhook hợp lệ:
- tìm candidate member theo email / external payment id
- tạo hoặc cập nhật member record
- set subscription state = active
- set future_access_member entitlement = true
- gửi magic link
- ghi audit log

---

## 7. Magic link model

### 7.1 Vai trò của magic link

Magic link chỉ dùng để:
- login
- establish identity
- tạo session

Magic link không quyết định:
- user mở được gì
- user có quyền gì

Quy tắc gốc:

**Identity != Entitlement**

---

### 7.2 Quy tắc login
- magic link một lần
- không dùng password
- giảm friction
- phù hợp cho toàn hệ nhiều domain

Sau login backend hoặc orchestration layer phải nạp:
- profile
- current stage
- pass state
- owned packs
- available domains
- next step

---

### 7.3 Session

Sau khi login thành công:
- session dùng chung toàn hệ
- user không phải login lại mỗi subdomain nếu cùng identity layer
- root hub biết user là ai và đang có quyền gì

---

## 8. Dashboard sau khi mở Pass

Ngay sau login lần đầu, user phải thấy:

### 8.1 Bạn đang ở đâu
- stage hiện tại
- segment hiện tại
- domain phù hợp nhất

### 8.2 Bạn nên bắt đầu từ đâu
- 1 next step chính
- 2 next steps phụ
- 1 pathway gợi ý

### 8.3 Những gì bạn đã mở
- root member layer
- edu member layer
- life / finance / invest / green / vc member depth (nếu domain đó đã có lớp member thật)

### 8.4 Những gì bạn có thể mở thêm
- specialist packs
- deeper programs
- later partner path

### 8.5 Những gì đã được xác minh
- proof summary
- credential summary
- progress summary

---

## 9. Public layer vs member layer

### 9.1 Public layer

Mọi subdomain phải có:
- 1-3 dòng hook
- content public
- demo
- teaser block
- CTA gateway

Public layer dùng để:
- SEO
- trust
- entry
- hiểu hệ

### 9.2 Member layer

Member layer dùng để:
- đào sâu
- thực hành
- cá nhân hóa
- kết nối hành trình
- mở AI cơ bản
- mở playbooks / packets / workflows sâu hơn

Quy tắc:

Không được khóa sạch toàn bộ content public.
Nếu khóa sạch, hệ sẽ:
- chết SEO
- yếu trust
- giảm conversion

---

## 10. Các domain được mở bởi Future Access Pass

Nguyên tắc: chỉ mở những domain đã có member-ready layer.

Hiện tại nên thiết kế để hỗ trợ:
- vetuonglai.com
- edu.vetuonglai.com
- life.vetuonglai.com
- finance.vetuonglai.com
- invest.vetuonglai.com
- green.vetuonglai.com
- vc.vetuonglai.com

### 10.1 Quy tắc cho VC protection (bắt buộc)

- User có thể tạo free account từ homepage (`vetuonglai.com`) để vào trạng thái `pending_member`.
- Sau khi hoàn tất member purchase và state được nâng (`annual_active`, `pack_owner`, `program_user`, `partner`), VC protection được mở với chi phí thêm bằng `0`.
- Nếu chưa đạt state/entitlement phù hợp, VC runtime trả `membership_required_for_vc_protection` và điều hướng về purchase hub.
- VC ownership verification vẫn bắt buộc 2 lớp kỹ thuật (real identity attestation + cryptographic signature), không chỉ dựa vào trạng thái thanh toán.

Các domain sau chỉ mở khi đã có thật:
- community
- work
- market
- ai
- stories
- mission
- healing
- foundation
- labs

Quy tắc copy:

Đúng:
- “mở lớp member của toàn hệ core”
- “mở những domain đã sẵn sàng ở lớp member”

Sai:
- “mở mọi thứ không giới hạn”
- “mở toàn bộ mọi hệ thống đã tồn tại và sẽ tồn tại”

---

## 11. Specialist packs và mối quan hệ với Pass

### 11.1 Bản chất

Specialist packs là:
- sản phẩm one-time
- đào sâu một vấn đề cụ thể
- add-on vào hệ

### 11.2 Quan hệ với Pass
- Pass = cửa vào hệ
- Pack = đào sâu trong hệ

Quy tắc đề xuất:
- để dùng pack tốt nhất, user nên có Pass active
- có thể cho phép mua pack riêng, nhưng trải nghiệm tối ưu chỉ có khi có Pass
- nếu chưa có Pass mà mua pack, vẫn nên dẫn user vào luồng active Pass

### 11.3 Sau khi mua pack

Backend cấp:
- `specialist_pack_access:<pack_id>`

Và dashboard hiển thị:
- pack đã sở hữu
- lộ trình của pack
- tài nguyên của pack
- tiến trình của pack
- nếu có, referral eligibility của pack

---

## 12. Renewal, expiry, grace period

### 12.1 Renewal
- năm 1: 3 USD
- năm 2+: 99 USD / năm

### 12.2 Expiry state

Khi subscription hết hạn:
- member core bị khóa lại
- public layer vẫn mở
- user vẫn login được để renew
- profile và lịch sử không mất

### 12.3 Grace period

Khuyến nghị:
- 7 ngày grace period sau khi fail renewal
- trong thời gian này:
  - hiển thị cảnh báo
  - cho renew nhanh
  - chưa khóa ngay mọi thứ

### 12.4 Cancel

Nếu user cancel auto-renew:
- vẫn giữ quyền đến hết kỳ hiện tại
- không tắt entitlement ngay lập tức

---

## 13. Legal / trust wording bắt buộc

Đúng:
- “mở quyền truy cập hệ”
- “member access”
- “lớp member của toàn hệ”
- “mở sâu hơn”
- “quyền vào hệ được duy trì theo năm”

Sai:
- “mua trọn đời”
- “mở vĩnh viễn”
- “sở hữu mãi mãi”
- “trả 3 USD là có tất cả suốt đời”

---

## 14. Data model tối thiểu

### 14.1 Candidate member
- candidate_id
- candidate_email
- source_domain
- source_page
- created_at
- payment_intent_ref / subscription_ref

### 14.2 Member
- member_id
- email
- auth_user_id
- created_at
- status
- current_stage
- primary_domain
- next_step

### 14.3 Subscription
- subscription_id
- member_id
- provider
- provider_subscription_id
- plan_code
- intro_price
- regular_price
- currency
- start_at
- renew_at
- expires_at
- status

### 14.4 Entitlements
- member_id
- entitlement_code
- source_product
- granted_at
- expires_at
- status

### 14.5 Pack ownership
- member_id
- pack_id
- purchased_at
- order_ref
- status

---

## 15. API / service responsibilities

### Payment service
- create checkout / subscription
- store external ids
- verify webhook
- emit provisioning event

### Member service
- create / update candidate
- activate member
- maintain subscription state
- resolve entitlements

### Auth service
- send magic link
- establish session
- bind auth_user_id to member

### Orchestrator
- decide dashboard state
- decide next steps
- decide visible domains / pathways

---

## 16. Error states cần thiết kế

### 16.1 Payment success but provisioning pending

Message:
- “Thanh toán của bạn đã được ghi nhận. Hệ thống đang kích hoạt quyền truy cập.”

### 16.2 Email mismatch

Message:
- “Chúng tôi cần xác nhận lại email dùng để mở hệ.”

### 16.3 Pass expired

Message:
- “Quyền truy cập của bạn đã hết hạn. Bạn có thể gia hạn để tiếp tục hành trình.”

### 16.4 No entitlement

Message:
- “Nội dung này cần quyền truy cập tương ứng.”

---

## 17. Definition of done

Future Access Pass chỉ được gọi là xong khi:
- user nhập email
- user thanh toán thành công
- webhook hợp lệ về backend
- member được kích hoạt
- magic link được gửi
- user login được
- dashboard hiển thị đúng
- entitlements mở đúng
- ít nhất 2 domain core nhận entitlement đúng

Nếu thiếu một trong các bước này, Pass chưa xong.

---

## 18. Kết luận cuối

Future Access Pass là:
- cổng vào hệ
- subscription-based identity + access layer
- nền để mở member depth toàn hệ
- không phải sản phẩm nội dung lẻ
- không phải one-time unlock vĩnh viễn

Nó chỉ có giá trị thật khi 4 thứ nối được với nhau:
- payment
- provisioning
- identity
- entitlement

Và chỉ khi đó, người dùng mới thực sự “mở toàn bộ hệ của mình”.
