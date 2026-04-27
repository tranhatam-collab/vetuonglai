# VC_12_VERIFY_PAGE_AND_DISCLOSURE_POLICY

## Mục đích
Đặt chuẩn disclosure cho trang verify của VC để người dùng nhìn thấy đúng nguồn, đúng trạng thái chứng thực, và không bị hiểu sai phạm vi bảo vệ.

## Trạng thái
- status: active_policy
- owner: team_vc_trust
- last_updated: 2026-04-15

## Verify page bắt buộc hiển thị

### 1) Record identity
- mã record (`code` hoặc `ownershipId`)
- trạng thái (`verified`, `reviewing`, `planned`)
- thời điểm phát hành (`issuedAt`)

### 2) Nguồn phát hành và nguồn dữ liệu
- `originDomain` (ví dụ `nft.iai.one` hoặc domain nguồn khác)
- URL VC hiện tại (`vc.vetuonglai.com`) là điểm verify độc lập
- không mô tả domain nguồn là “trust root chính” nếu VC mới là nơi đối chiếu cuối

### 3) Anchors/proof
- hash nội dung (`contentHash` hoặc ownership digest)
- registry URL
- proof URL/IPFS nếu có
- link mở domain nguồn chỉ mang ý nghĩa tham chiếu

## Disclosure cho ownership protection 2 lớp
- Khi ownership đã verify, phải thể hiện:
  - `verification.level = STRONG_2_LAYER`
  - L1: real user verified (session + identity attestation)
  - L2: cryptographic ownership proof (challenge signature)
- Không được hiển thị “verified ownership” nếu thiếu bất kỳ layer nào.

## Disclosure cho membership và chi phí
- Nếu user đủ điều kiện member (`annual_active`, `pack_owner`, `program_user`, `partner`), hiển thị rõ:
  - VC protection included with membership
  - extra cost: `0`
- Nếu chưa đủ điều kiện, hiển thị rõ trạng thái:
  - membership required
  - điều hướng về purchase hub tại `vetuonglai.com`

## Chính sách bảo mật dữ liệu hiển thị
- Trên response/public verify:
  - chỉ hiển thị email dạng masked (không lộ email thật)
  - không công khai private key / raw signature ngoài mục đích kiểm định kỹ thuật nội bộ
- Không log dữ liệu nhạy cảm vào giao diện public.

## Ngôn ngữ cấm trong disclosure
- “VC đảm bảo lợi nhuận / bảo đảm giá trị tài sản”
- “NFT bridge thay thế toàn bộ VC verification”
- “Bảo vệ 2 lớp cho mọi user” (sai nếu user chưa qua entitlement + identity + signature)
