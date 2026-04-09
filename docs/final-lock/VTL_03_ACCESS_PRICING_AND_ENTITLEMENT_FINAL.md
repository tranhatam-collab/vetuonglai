# VTL ACCESS PRICING AND ENTITLEMENT FINAL

Version: 3.0 FINAL LOCK
Date: 2026-04-09
Status: locked

## Product Taxonomy

There are now 4 clean product layers:

1. `Public`
   - basic open content on every subdomain
2. `Annual Access`
   - homepage-only annual entry product
3. `Specialist Packs`
   - 9 one-time depth products
4. `Program / Partner`
   - guided, reviewed, or negotiated layers

Do not collapse these layers into one product.

## Annual Access — Homepage Only

Canonical CTA copy:

`Để biết về tương lai của bạn, hãy bắt đầu đăng ký tại đây.`

This CTA belongs to the homepage purchase hub.

### Locked Pricing Schedule

- year 1: `9 USD/year`
- year 2: `66 USD/year`
- year 3 onward: `99 USD/year`

Working positioning line:

- year 1 helps users step into the system seriously
- year 2 becomes the commitment stage
- year 3 onward is the permanent standard price

Safe public copy:

`9 USD cho năm đầu tiên. 66 USD cho năm thứ hai. Từ năm thứ ba trở đi là 99 USD mỗi năm để tiếp tục chạm đến những điều không giới hạn.`

## What Annual Access Unlocks

Annual access is the base registration and member layer.

It unlocks:

- the member identity layer
- onboarding and dashboard
- foundational cross-domain navigation
- core member-only orientation content
- the right to purchase specialist packs
- the right to enter the deeper system properly

It does not automatically mean:

- all specialist depth is open
- all professional content is open
- affiliate is open
- partner rights are open

## Specialist Pack Rule

All deeper domain content must route back to the homepage package hub.

Users can then choose any of the 9 specialist packs there.

This creates:

- one billing center
- one pricing language
- one entitlement source
- less duplication across subdomains

## Entitlement Matrix

| State | Access |
| --- | --- |
| Visitor | public basics only |
| Annual Access Member | member dashboard, foundational member layer, purchase hub, cross-domain orientation |
| Specialist Pack Owner | annual member rights plus the depth of owned pack(s) |
| Program User | pack/member rights plus guided cohort or mentor layer |
| Partner | negotiated commercial and contribution rights |

## Payment Architecture Lock

### Annual Access

Preferred technical model:

- `PayPal Subscriptions API`

Reason:

- the product is annual and recurring
- the pricing changes over time by cycle
- it should not be modeled as a lifetime one-time unlock anymore

### Specialist Packs

Preferred technical model:

- `PayPal Orders API`

Reason:

- they are one-time purchases
- they represent discrete specialist depth
- they must remain separate from the annual access lifecycle

### Identity Rule

- collect email before checkout
- create pending registration record
- provision only after valid webhook confirmation
- use magic link for identity
- keep entitlement logic in VTL backend, not in the auth provider

## Final Commerce Rule

Annual access is the doorway.
Specialist packs are the depth.
Programs and partner layers come after proof and maturity.
