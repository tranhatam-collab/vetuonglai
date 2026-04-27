# 18_ENTITLEMENT_AND_ACCESS_CONTROL_SPEC.md

## Mục đích
File này khóa toàn bộ:
- access control
- entitlements
- member rights
- pack rights
- proof gates
- expiry / grace / reactivation

## Nguyên tắc gốc
1. Identity không bằng entitlement.
2. Thanh toán không tự động mở mọi thứ.
3. Proof là một loại entitlement gate riêng, không thay bằng tiền.
4. Mọi quyền truy cập đều do backend quyết định.
5. Frontend chỉ hiển thị trạng thái quyền, không quyết định quyền.

## Access layers
### Layer A — Public
Ai cũng xem được teaser, demo, sample records, public content.

### Layer B — Future Access Member
Cần active pass. Mở core member layer, dashboard, next-step engine, AI basic.

### Layer C — Specialist Pack
Cần mua one-time pack tương ứng. Mở deep module / toolkit / workbook / AI mode của pack đó.

### Layer D — Proof-gated
Cần VC badge / proof / review state phù hợp.

### Layer E — Partner / Internal
Cần manual approval hoặc high-level criteria.

## Entitlement codes
### Core
- `public_access`
- `future_access_member`
- `member_dashboard_access`
- `member_cross_domain_view`

### Domain core access
- `edu_member_access`
- `life_member_access`
- `finance_member_access`
- `invest_member_access`
- `green_member_access`
- `vc_member_access`

### Pack access
- `specialist_pack_access:<pack_id>`

### Proof / status access
- `proof_verified`
- `learner_verified`
- `creator_verified`
- `builder_verified`
- `service_verified`
- `mentor_verified`
- `community_builder_verified`

### Economy / partner access
- `work_apply_basic`
- `work_apply_verified`
- `market_creator_access`
- `affiliate_tier_1`
- `affiliate_tier_2`
- `partner_access`

## Pass rules
### Active pass
Cấp:
- `future_access_member`
- `member_dashboard_access`
- domain member entitlements currently supported

### Expired pass
- gỡ `future_access_member`
- giữ identity
- giữ history
- giữ pack ownership
- vẫn cho login để renew

### Grace period
Khuyến nghị 7 ngày.

### Cancel
Quyền còn hiệu lực đến hết chu kỳ hiện tại.

## Pack rules
- pack là one-time
- ownership không mất khi pass hết hạn
- nhưng trải nghiệm tốt nhất yêu cầu pass active

## Proof gates
Một số quyền không được mua bằng tiền.

Ví dụ:
- `affiliate_tier_1` cần:
  - active pass
  - relevant pack
  - proof / compliance pass

- `work_apply_verified` cần:
  - pass active
  - VC badge hoặc equivalent review state

- `partner_access` cần:
  - pass active
  - proof đủ
  - contribution đủ
  - manual approval

## Rights matrix theo level
### Visitor
- public only

### Member
- member core
- dashboard
- cross-domain member view
- basic AI layer
- member-only content

### Specialist owner
- member core
- specialist pack specific rights

### Verified user
- member core
- proof-based opportunities
- selected earning pathways

### Partner
- deeper governed rights

## Entitlement evaluation order
1. User identity valid?
2. Pass active?
3. Domain supported?
4. Pack ownership needed?
5. Proof needed?
6. Manual gate needed?
7. Any compliance hold?

## Data model tối thiểu
### Member entitlement record
- `id`
- `member_id`
- `entitlement_code`
- `source_type`
- `source_ref`
- `granted_at`
- `expires_at`
- `status`

### Access evaluation log
- `member_id`
- `resource`
- `result`
- `reason_code`
- `timestamp`

## Error / state messaging
### No pass
- Bạn cần mở hệ để đi sâu hơn vào lớp này.

### Pass expired
- Quyền truy cập của bạn đã hết hạn. Bạn có thể gia hạn để tiếp tục hành trình.

### Pack needed
- Phần này thuộc một lộ trình chuyên sâu riêng.

### Proof needed
- Lớp này yêu cầu bằng chứng hoặc badge tương ứng trước khi mở.

## Definition of done
Entitlement system chỉ được coi là xong khi:
- pass active / expired states xử lý đúng
- pack ownership xử lý đúng
- domain-level access xử lý đúng
- proof-gated access xử lý đúng
- grace period xử lý đúng
- frontend không tự quyết định quyền

## Kết luận
Entitlement là bộ xương quyền truy cập của hệ. Nếu không khóa file này, member, pack, proof và economy sẽ mở sai đối tượng.
