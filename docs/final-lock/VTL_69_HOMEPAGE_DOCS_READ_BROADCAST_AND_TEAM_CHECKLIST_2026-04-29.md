# VTL 69 — Homepage / Docs / Read Broadcast and Team Checklist

Phiên bản: 1.0  
Ngày: 2026-04-29  
Trạng thái: active_now  
Owner điều phối: Team 1  
Áp dụng cho: Team 2 · Team 3 · Team 5 · Ops · Legal · Accounting

## Broadcast (All Teams)

Từ giờ áp dụng lane cập nhật mới cho homepage/docs/read. Không claim live khi chưa có deploy evidence + domain active + QA pass. Tất cả team cập nhật theo checklist bên dưới và báo `Done / In progress / Blocked` kèm evidence link.

## Team 2 — Frontend / UX Checklist

1. Rebuild homepage theo `VETUONGLAI_HOMEPAGE_CONTENT.md`: hero, 3 cards, 6-tier timeline mới, signup, disclosure blocks.
2. Publish 12 docs pages theo `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` (VI/EN), không lộ income wording.
3. Render tier clusters đúng: `Discover / Create Value / Deep Collaboration`.
4. Đặt FTC disclosure block gần CTA, không để ở footer.
5. Chạy visual QA + WCAG và gửi evidence (ảnh + issue list nếu có).

## Team 3 — Governance / Trust / Legal Checklist

1. Lock wording mới vào `language-codex.md` (forbidden terms + FTC rule).
2. Signoff nội dung 12 docs pages (public content scope).
3. Invest gate wording: không ROI claim, không “invest now”.
4. Xác nhận disclosure wording chuẩn cho referral.
5. Chuẩn bị audit checklist quarterly FTC (v1).

## Team 5 — QA / Release Checklist

1. Thêm check cho: 7-tier model, FTC forbidden terms, disclosure placement, invest gate.
2. Chạy SEO + canonical checks cho docs pages.
3. Update evidence pack sau khi deploy `docs/read` live.
4. Re-run `verify:read:phase0 --live` sau khi DNS ổn định.
5. Báo verdict: `baseline_ready`, `publish_ready`, blocker còn lại (nếu có).

## Ops Checklist

1. Nếu DNS đã tạo, xác nhận CNAME đúng + SSL active.
2. Confirm custom domains `read.vetuonglai.com` và `docs.vetuonglai.com` ở trạng thái `Active`.
3. Gửi evidence: dashboard screenshot + timestamp + host status.

## Legal / Accounting Checklist

1. Review Terms (`READ_CREATOR_08`).
2. Review tax withholding rules.
3. Xác nhận PayOS merchant KYC trạng thái hiện tại (Phase 1 blocker) + thiếu gì để mở gate.

## Format báo cáo bắt buộc (mọi team)

`Done:`  
`In progress:`  
`Blocked:`  
`Owner needed:`  
`Evidence link:`  
`ETA:`
