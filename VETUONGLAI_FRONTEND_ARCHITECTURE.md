# VETUONGLAI FRONTEND ARCHITECTURE

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này dành cho FE lead và FE team để thống nhất cách tổ chức app, route, rendering, components và UX states.

## App structure

Target structure ưu tiên:

- root hub app tách rõ
- mỗi domain có app hoặc feature boundary rõ ràng
- có shared UI layer

## Shared components

Cần có bộ component dùng chung:

- header
- footer
- language switch
- CTA button
- card system
- section wrapper
- form fields
- empty / loading / error states

## Routing strategy

- route cấp domain rõ ràng
- item detail routes dùng slug ổn định
- verify routes của VC cần support `/v/:code`

## Content rendering strategy

- content có thể đến từ static JSON, CMS hoặc API
- FE phải có 1 rendering model ổn định cho article, course, story, guide

## Static + dynamic split

Nên tách rõ:

- static marketing / landing content
- dynamic user state, progress, dashboard, admin, verify

## Form system

Cần có pattern thống nhất cho:

- onboarding
- join flow
- payment flow
- admin forms

## Internationalization

Phải hỗ trợ song ngữ rõ ràng.

Cần có:

- 1 source of truth cho labels
- 1 logic để route / query language
- alternate metadata

## Search UI

Search cần có khung UI thống nhất, có support keyboard và kết quả rõ loại item.

## Dashboard UI

Cần có pattern cho:

- overview
- progress list
- credentials block
- next step cards

## Reader UI

Cần có pattern cho:

- text lesson
- pdf lesson
- video lesson
- mixed content lesson

## Verify UI

VC verify UI phải:

- rõ code đang tra cứu
- hiện kết quả tối thiểu
- hiện trust notes rõ ràng

## Admin UI

Cần tách rõ khỏi public UX.

Admin ưu tiên rõ ràng, nhanh, không cần marketing visual.

## Error states

Mọi flow phải có error state có nghĩa.

Không được chỉ hiện `Something went wrong` nếu có thể nói rõ hơn.

## Loading states

Cần có skeleton / loading state ổn định cho:

- search
- lesson data
- progress
- dashboard
- verify record
