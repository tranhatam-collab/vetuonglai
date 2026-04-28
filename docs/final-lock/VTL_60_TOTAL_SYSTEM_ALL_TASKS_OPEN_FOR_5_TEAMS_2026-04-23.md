# VTL TOTAL SYSTEM — ALL TASKS OPEN FOR 5 TEAMS

Phiên bản: 1.0
Ngày: 2026-04-23
Mốc chốt: 2026-04-23 16:43 ICT
Trạng thái: active_all_tasks_open
Owner điều phối: Team 1
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · Ops · QA · PM

## 0. Quyết định mở nhiệm vụ

Từ mốc này, toàn bộ nhiệm vụ còn lại của tổng kế hoạch được mở cho 5 team chạy song song.

Ý nghĩa đúng của `mở hết nhiệm vụ`:

- mọi team phải xử lý ngay toàn bộ phần việc không bị blocker thật
- team nào xong phiên hiện tại phải tự lấy nhiệm vụ kế tiếp trong board này
- không team nào được đứng chờ nếu vẫn còn việc có thể làm trong phạm vi của mình
- Wave E được mở ở mức chuẩn bị release pack, nhưng chưa được ký release khi Wave D còn thiếu public evidence

Ý nghĩa không đúng:

- không có nghĩa là được claim live khi chưa verify
- không có nghĩa là được deploy Wave D khi DNS chưa mở
- không có nghĩa là được promote `life` / `invest` khi runtime truth còn `planned_public`
- không có nghĩa là được tắt reminder 15 phút khi team chưa đạt `100% / 0%`
- không có nghĩa là được dọn Cloudflare account cũ trước khi account mới đã pass cutover

## 1. Runtime truth hiện tại

Theo các verify gần nhất:

- Founder lane: `100% / 0%`
- Core live bước đầu: xanh
- Wave B mobile closure: done
- Wave C `life` / `invest`: `hardening_ready / promotion_blocked`
- Wave D `work` / `market` / `community` / `ai` / `business`: `local_ready / dns_blocked`
- Wave E: `open_for_preparation / release_blocked`

## 2. Phần trăm hiện hành

Cập nhật sau commit test sync lúc `2026-04-23 18:21 ICT`:

- Team 1: `82% / 18%`
- Team 2: `44% / 56%`
- Team 3: `72% / 28%`
- Team 4: `88% / 12%`
- Team 5: `94% / 6%`
- Tổng hệ: `73% / 27%`

Không được tự tăng phần trăm nếu chưa có verify hoặc evidence mới.

## 3. Blocker thật đang mở

### Blocker B0 — Cloudflare account migration

Từ `2026-04-26`, repo này phải dùng account đích:

- `Anhhatam@gmail.com's Account`
- `62d57eaa548617aeecac766e5a1cb98e`

Trong repo, account ID đã được đổi ở config Pages/Workers. Tuy nhiên các bước sau vẫn là blocker ngoài repo cho tới khi có evidence:

- auth thật vào account mới
- inventory Pages/Workers của account mới
- deploy verify pass trên account mới
- dọn account cũ sau cutover

Ảnh hưởng:

- Team 1 chưa được coi account cutover là hoàn tất chỉ vì config đã đổi
- Team 5 chưa được ký release trên account mới nếu chưa có deploy/verify evidence
- Ops không được dọn account cũ trước khi có report pass
- local auth + Pages inventory sync trên account mới đã có
- Pages deploy proof trên account mới đã có cho toàn bộ lớp public shell
- worker code mirror proof trên account mới đã có ở `worker.dev` cho 6 worker lõi
- blocker còn lại của B0 là `secret migration + custom-domain runtime proof + worker route proof + final verify proof`
### Blocker B1 — Wave D DNS

5 host chưa có public DNS:

- `work.vetuonglai.com`
- `market.vetuonglai.com`
- `community.vetuonglai.com`
- `ai.vetuonglai.com`
- `business.vetuonglai.com`

Ảnh hưởng:

- Team 1 chưa được deploy Pages thật
- Team 5 chưa thể live verify
- Wave E chưa được release signoff

### Blocker B2 — Team 4 final signoff phụ thuộc Wave D

Team 4 endpoint pack đã pass self-test và pass smoke + strict ngoài sandbox với DNS thật.

Phần còn lại của Team 4 không còn được xem là blocker endpoint/data pack. Team 4 chỉ chưa được chốt `100% / 0%` vì Wave D vẫn thiếu DNS/public publish/deploy/signoff live.

Ảnh hưởng:

- Team 4 duy trì `88% / 12%`
- Team 5 chỉ được ký release sau khi Wave D live verify có evidence
- Ops và Team 1 là owner chính của blocker publish hiện tại

### Blocker B3 — Wave C promotion

`life` và `invest` có public runtime reachable, nhưng runtime truth vẫn là `planned_public`.

Ảnh hưởng:

- chỉ được ký hardening pass
- không được ký promotion/live

### Blocker B4 — Kids homepage lane

`kids.vetuonglai.com` được mở lane riêng từ `2026-04-29`, nhưng scope active hôm nay chỉ là:

- homepage `/`
- homepage `/en/`
- child-safe public information only

Không được:

- claim full launch cho parent / learn / onboarding
- đưa `kids` vào public discovery của hub/member
- gắn form / payment / registration lên homepage

Tài liệu điều phối active:

- `docs/final-lock/VTL_68_KIDS_HOMEPAGE_LAUNCH_TEAM_SPLIT_2026-04-29.md`

### Blocker B5 — Homepage/Docs/Read live-claim gate

Lane `homepage/docs/read` đang chạy checklist mới, nhưng không được claim live cho tới khi đủ đồng thời:

- deploy evidence
- domain active
- QA pass

Tài liệu điều phối active:

- `docs/final-lock/VTL_69_HOMEPAGE_DOCS_READ_BROADCAST_AND_TEAM_CHECKLIST_2026-04-29.md`

## 4. Team 1 — Platform / Runtime / Release Control

Channel: `vtl-team1-runtime-release`

### Nhiệm vụ mở ngay

1. Giữ core runtime xanh.
2. Giữ Wave C ở trạng thái `hardening_ready / promotion_blocked`.
3. Giữ Wave D ở trạng thái `tooling_ready / dns_blocked` cho tới khi Ops mở DNS.
4. Chạy lại Wave D preflight mỗi lượt nhắc.
5. Khi DNS mở đủ, deploy Pages thật cho Wave D.
6. Sau deploy, gọi Team 5 live verify ngay.
7. Chuẩn bị rollback pack cho Wave D.
8. Chuẩn bị Wave E release skeleton, nhưng không ký release.
9. Cập nhật board `% hoàn thành / % còn lại` sau mỗi evidence mới.
10. Điều phối blocker giữa Ops, Team 4, Team 5.
11. Điều phối lane `kids` theo scope `homepage only` cho tới khi Team 5 ký `verify:kids:predeploy` pass.

### Lệnh bắt buộc

```bash
npm run verify:planned-safe:wave:release
node scripts/deploy-wave-d-pages.mjs --dry-run
node scripts/verify-wave-d-public-publish.mjs
node scripts/verify-wave-c-life-invest-hardening.mjs
```

Sau khi Ops mở DNS đủ:

```bash
node scripts/deploy-wave-d-pages.mjs --branch main
node scripts/verify-wave-d-public-publish.mjs
```

### Done của Team 1

Team 1 chỉ được báo `100% / 0%` khi:

- Wave C hardening signoff đã được ký đúng
- Wave D DNS mở, deploy thật pass, live verify pass
- rollback pack sẵn sàng
- Wave E release pack được Team 5 xác nhận đủ evidence

## 5. Team 2 — Frontend / UX / Mobile / Public Surfaces

Channel: `vtl-team2-frontend-ux-mobile`

### Nhiệm vụ mở ngay

1. Dọn wording công khai còn kỹ thuật trên:
   - `member`
   - `work`
   - `market`
   - `life`
   - `invest`
   - `green`
   - `community`
   - `ai`
   - `business`
2. Khóa nav/status render chỉ bám runtime truth / registry.
3. Không hiển thị `live` cho domain chưa qua publish verify.
4. Không dùng wording nội bộ, DPM, source state, ready, raw action id trên public surface.
5. Polish planned-safe shell cho `work`, `market`, `community`, `ai`, `business`.
6. Kiểm tra mobile surface cho hub/member/edu/vc sau mỗi build lớn.
7. Chuẩn hóa CTA planned-safe về hub/gateway/entry point hợp lệ.
8. Chuẩn bị copy fallback cho trường hợp Wave D DNS mở từng phần.
9. Chốt homepage `kids.vetuonglai.com` và `/en/` theo `docs/kids/11_DAY_0_LAUNCH_PLAN.md`.
10. Rebuild homepage theo `VETUONGLAI_HOMEPAGE_CONTENT.md` (hero + 3 cards + 6-tier timeline + signup + disclosure blocks).
11. Publish 12 docs pages theo `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` (VI/EN), không lộ income wording.
12. Render đúng tier clusters: `Discover / Create Value / Deep Collaboration`.
13. Đặt FTC disclosure block gần CTA, không để ở footer.
14. Chạy visual QA + WCAG, đính kèm evidence ảnh + issue list.

### Lệnh bắt buộc

```bash
npm run build
npm run check
npm run verify:planned-safe:wave:release
npm run verify:team3:parity
```

### Done của Team 2

Team 2 chỉ được báo `100% / 0%` khi:

- không còn wording kỹ thuật/nội bộ ở public surfaces
- tất cả planned-safe shell không false-live
- nav/status render bám runtime truth
- Team 3 không còn wording stop-line
- Team 5 verify pack không phát hiện UI/status drift

## 6. Team 3 — Governance / Runtime Truth / QA Gate

Channel: `vtl-team3-governance-runtime-truth`

### Nhiệm vụ mở ngay

1. Giữ `go/no-go` theo từng wave, không gom sai.
2. Ký nhận Wave C đúng nghĩa:
   - hardening: `PASS` nếu đủ evidence
   - promotion: `NO-GO` khi runtime truth chưa đổi
3. Audit planned-safe wording cho:
   - `work`
   - `market`
   - `community`
   - `ai`
   - `business`
4. Audit language codex cho các surface mới.
5. Audit domain boundaries để tránh chồng vai:
   - hub không dạy sâu
   - edu không verify
   - vc không bán
   - business không đi vào flow cá nhân
6. Cập nhật go/no-go note khi Team 2 hoặc Team 4 đổi surface/data.
7. Chặn Wave E nếu Wave D chưa có DNS/deploy/live evidence.
8. Audit child-safe / no-commerce / no-registration wording cho homepage `kids`.
9. Lock wording mới vào `language-codex.md` (forbidden terms + FTC rule).
10. Signoff nội dung 12 docs pages (public content scope).
11. Invest gate wording: không ROI claim, không `invest now`.
12. Xác nhận disclosure wording chuẩn cho referral.
13. Chuẩn bị quarterly FTC audit checklist (v1).

### Lệnh bắt buộc

```bash
npm run verify:team3:parity
node scripts/verify-wave-c-life-invest-hardening.mjs
npm run verify:planned-safe:wave:release
```

### Done của Team 3

Team 3 chỉ được báo `100% / 0%` khi:

- không còn stop-line wording/truth mở
- Wave C signoff đúng scope đã khóa
- Wave D planned-safe go/no-go đã cập nhật theo live evidence cuối
- Wave E go/no-go report đã phát hành sau khi Team 5 có release gate pack

## 7. Team 4 — Data / Registry / Forms / Content Contracts

Channel: `vtl-team4-data-registry-forms`

### Nhiệm vụ mở ngay

1. Giữ package/form registry không drift.
2. Hoàn tất cross-domain data contract cho dashboard/journey.
3. Khóa business domain intake data tách khỏi flow cá nhân.
4. Duy trì comparison/demo/output data cho:
   - Foundation
   - Applied
   - Professional
   - Business
5. Bổ sung dữ liệu teaser/demo/output cho planned domains còn thiếu.
6. Bảo đảm `business` luôn `planned_internal_only` cho tới khi có signoff riêng.
7. Phối hợp Team 5 để phân biệt lỗi verifier môi trường với lỗi data thật.
8. Chuẩn bị data handoff cho Team 2 render UI mà không hard-code.
9. Rà kids curriculum / api contract / lesson sample để homepage `kids` không nói quá data thật.

### Lệnh bắt buộc

```bash
node scripts/verify-team4-endpoints-pack.mjs --self-test
node scripts/verify-team4-endpoints-pack.mjs
npm run build
npm run check
```

### Done của Team 4

Team 4 chỉ được báo `100% / 0%` khi:

- local/self-test pass
- live endpoint verify pass hoặc có evidence production tương đương được Team 5 chấp nhận
- business data không public-launch sai
- cross-domain dashboard/journey contract hoàn chỉnh
- Team 2 render được data không hard-code

## 8. Team 5 — Smoke / Strict Contract / Release Verification

Channel: `vtl-team5-smoke-release-qa`

### Nhiệm vụ mở ngay

1. Giữ Wave B evidence done.
2. Giữ Wave C evidence hardening-ready.
3. Rerun Wave D live verify sau mỗi thông báo DNS mở.
4. Chuẩn bị total-system release gate pack cho Wave E.
5. Tách rõ các loại fail:
   - DNS
   - TLS
   - HTTP status
   - marker/planned-safe boundary
   - data schema
   - language/status drift
6. Phối hợp Team 4 để xác nhận endpoint verifier fail do môi trường hay do data thật.
7. Chuẩn bị release note cuối theo từng wave.
8. Không ký `publish_ready` khi chưa có evidence live.
9. Thêm check cho 7-tier model, FTC forbidden terms, disclosure placement, invest gate.
10. Chạy SEO + canonical checks cho docs pages.
11. Update evidence pack sau khi deploy `docs/read` live.
12. Re-run `verify:read:phase0 --live` sau khi DNS ổn định.
13. Báo verdict: `baseline_ready`, `publish_ready`, blocker còn lại.

### Lệnh bắt buộc

```bash
npm run verify:planned-safe:wave:release
node scripts/verify-wave-d-public-publish.mjs
node scripts/verify-wave-c-life-invest-hardening.mjs
node scripts/verify-team4-endpoints-pack.mjs --self-test
node scripts/verify-team4-endpoints-pack.mjs
```

Sau khi Team 1 deploy Wave D thật:

```bash
node scripts/verify-wave-d-public-publish.mjs
```

### Done của Team 5

Team 5 chỉ được báo `100% / 0%` khi:

- Wave D live verify pass hoặc có fail report cuối rõ owner
- Team 4 endpoint pack được xác nhận
- Wave E release gate report đầy đủ
- QA/PM signoff pack có đủ evidence

## 9. Ops — DNS / Cloudflare / Runtime Publish

Channel: `vtl-ops-dns-cloudflare`

### Nhiệm vụ mở ngay

1. Mở DNS công khai cho 5 host Wave D.
2. Kiểm tra Cloudflare Pages custom domain mapping.
3. Kiểm tra TLS/custom hostname readiness.
4. Xác nhận route/runtime publish policy.
5. Báo lại Team 1 ngay khi từng host resolve công khai.
6. Nếu DNS đã tạo cho `read/docs`, xác nhận CNAME đúng + SSL active.
7. Confirm custom domains `read.vetuonglai.com` và `docs.vetuonglai.com` trạng thái `Active`.
8. Gửi evidence dashboard screenshot + timestamp + host status cho Team 1/Team 5.

### Gate DNS

```bash
dig @1.1.1.1 +short work.vetuonglai.com
dig @1.1.1.1 +short market.vetuonglai.com
dig @1.1.1.1 +short community.vetuonglai.com
dig @1.1.1.1 +short ai.vetuonglai.com
dig @1.1.1.1 +short business.vetuonglai.com
```

## 10. QA / PM / Founder

Channel: `vtl-founder-pm-signoff`

### Nhiệm vụ mở ngay

1. Ký Wave C đúng scope:
   - hardening pass
   - promotion no-go
2. Không ký Wave E cho tới khi Wave D live evidence đủ.
3. Duyệt stop-line nếu có team xin đổi scope.
4. Không cho tắt reminder nếu team chưa đủ `100% / 0%`.

## 10B. Legal / Accounting

Channel: `vtl-legal-accounting-gate`

### Nhiệm vụ mở ngay

1. Review Terms (`READ_CREATOR_08`).
2. Review tax withholding rules.
3. Xác nhận trạng thái PayOS merchant KYC (Phase 1 blocker) + thiếu gì để mở gate.

## 11. Báo cáo bắt buộc mỗi 15 phút

Mỗi team báo:

```md
Team:
Channel:
Done:
In progress:
Blocked:
Owner needed:
Evidence link:
ETA:
```

Khi cần vận hành chi tiết theo nhịp 15 phút, team có thể bổ sung:

```md
Next 15 minutes:
% hoàn thành / % còn lại:
```

Team 1 tổng hợp:

```md
Team 1: x% / y%
Team 2: x% / y%
Team 3: x% / y%
Team 4: x% / y%
Team 5: x% / y%
Tổng hệ: x% / y%
Done thật trong lượt này:
Blocker thật:
Gate kế tiếp:
```

## 12. Quy tắc tự chuyển nhiệm vụ

Khi một team hoàn thành task hiện tại:

1. chạy verify
2. ghi evidence
3. báo `%`
4. tự nhận task kế tiếp trong file này
5. chỉ chờ nếu blocker thuộc team khác hoặc Ops/PM/Founder

Nếu team chờ mà vẫn còn task không phụ thuộc blocker, đó là vi phạm board.

## 13. Điều kiện tắt reminder

Không thay đổi điều kiện đã khóa:

- chỉ tắt khi team đạt `100% / 0%`
- verify pass
- evidence đầy đủ
- Team 1 xác nhận không còn dependency mở
- QA/PM hoặc owner gate không giữ `HOLD`

## 14. Câu chốt

Tất cả nhiệm vụ đã được mở.

Không ai được đứng yên.

Chỉ có release/live claim là vẫn phải chờ evidence thật.

## 15. Team 4 progress accepted — 2026-04-23 17:58 ICT

File evidence chính thức:

- `/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_61_TEAM4_ENDPOINT_PACK_PROGRESS_ACK_2026-04-23.md`

Kết luận:

- Team 4 endpoint pack: accepted
- Team 4 `%`: `88% / 12%`
- Tổng hệ `%`: `72% / 28%`
- Blocker thật còn lại: Wave D DNS/public publish/deploy/live verification
- Không claim Wave D live cho tới khi DNS, deploy, runtime verify, Team 5 release gate, và QA/PM signoff đều pass

## 16. Commit test sync — 2026-04-23 18:21 ICT

File evidence chính thức:

- `/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_62_COMMIT_TEST_AND_CROSS_TEAM_REMAINING_WORK_SYNC_2026-04-23.md`

Kết luận:

- Team 5 full pack: PASS ngoài sandbox
- total-system release gate: `baseline_ready=true`, `publish_ready=false`
- blocker còn lại của Vetuonglai release: Wave D DNS/public publish
- payment Team D: dual-rail assignment/policy ready, production pay gate vẫn `LOCK_RETAINED_WITH_REASON`
- Team 5 `%`: `94% / 6%`
- Tổng hệ `%`: `73% / 27%`
