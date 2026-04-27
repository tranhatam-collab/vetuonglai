# VTL TEAM 2 EXECUTION PLAN

Phiên bản: 1.0
Ngày: 2026-04-14
Trạng thái: in_progress
Owner: Team 2

## Mục tiêu

Hoàn tất lane Team 2 theo thứ tự mới:

- `P0`: language cleanup + status normalization + public/internal separation
- `P1`: dashboard + EDU player + submit/review UI + verify UI

## Cổng tiền phát triển

File kế hoạch đã tồn tại và đủ nội dung: `có`.
File này vận hành bên dưới:

- `docs/00_master/21_MULTILINGUAL_EXPANSION_PROTOCOL_2026.md`

## Phạm vi

1. mobile PWA shell stability
2. dashboard và domain UI parity
3. CTA/deep-link integrity
4. i18n binding và public copy cleanup trên các domain hiện có

## Danh sách việc

1. khóa phạm vi không bao gồm thanh toán (`không checkout trong app`)
2. bind mọi public text vào `content/vi.json` và `content/en.json`
3. xóa `DPM-*`, `ready`, `source state`, wording nội bộ khỏi public layer
4. kiểm tra đầy đủ các trạng thái: `visitor`, `pending_member`, `annual_active`, `pack_owner`
5. đóng regression set `DPM-001..DPM-021`
6. bảo đảm mọi commerce CTA đều route về `vetuonglai.com`
7. giữ tiếng Việt là ngôn ngữ nguồn hoàn thiện nhất trên mọi surface do Team 2 sở hữu
8. không mở locale mới ngoài `vi/en` khi chưa có founder lock và locale activation review
9. không build public runtime cho `work`, `market`, `affiliate`, `community` trong cycle hiện tại

## Phụ thuộc

- Team 1: stable runtime contracts
- Team 3: trust/disclosure placement approvals

## Command gates

```bash
npm run build
npm run check
npm run smoke:mobile-pwa
```

## Tiêu chí hoàn tất

- mobile matrix pass on iOS Safari + Android Chrome
- no broken route/CTA state
- trust-safe copy surfaces aligned
- mọi file giao việc, evidence, note và release-facing artifact của Team 2 dùng tiếng Việt có dấu đầy đủ
- mọi chuỗi tiếng Anh còn lại đúng nghĩa kỹ thuật và bám Language Codex

## Checklist phase 2 (2026-04-16)

1. giữ hero/CTA/disclosure wording khớp brand contract đã khóa trên mọi route core
2. hoàn tất kiểm tra flow mobile V1: login, dashboard state mapping, EDU player, VC verify
3. ép mọi gateway CTA route về homepage purchase hub cho các deep/planned path
4. chỉ làm teaser/gateway cho các domain hiện có; không mở thêm domain wave mới
5. dùng `content/vi.json`, `content/en.json`, `content/locale-registry.json` làm nguồn i18n duy nhất
6. bảo đảm mọi artifact mới của Team 2 đạt chuẩn ngôn ngữ đã khóa từ ngày `2026-04-19`
7. bám `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md` làm board chính cho cycle hiện tại
