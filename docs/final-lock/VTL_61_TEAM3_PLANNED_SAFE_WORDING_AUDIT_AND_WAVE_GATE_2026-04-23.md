# VTL TEAM 3 PLANNED-SAFE WORDING AUDIT AND WAVE GATE

Phiên bản: 1.0
Ngày: 2026-04-23
Mốc chốt: 2026-04-23 18:02 ICT
Trạng thái: active_reference
Owner: Team 3
Phạm vi: audit wording planned-safe cho `work` / `market` / `community` / `ai` / `business`, chốt Wave C và chặn Wave E khi Wave D chưa có live evidence

## 1. Stop-line của Team 3

Team 3 giữ quyền stop-line nếu public copy hoặc tài liệu điều phối:

- nói quá runtime truth
- dùng chữ làm người đọc tưởng surface đã live khi DNS/runtime publish chưa mở
- lộ technical/dev wording ra public copy
- dùng tiếng Việt lai technical English gây sai nghĩa
- gom Wave E signoff khi Wave D chưa có live evidence thật

## 2. Wave gate chốt tại mốc này

| Wave | Verdict Team 3 | Ghi chú |
| --- | --- | --- |
| Wave C `life` / `invest` | `HARDENING PASS / PROMOTION NO-GO` | Verifier Wave C pass `hardening_ready`, nhưng `life` và `invest` vẫn là `planned_public`, nên promotion chưa được mở. |
| Wave D `work` / `market` / `community` / `ai` / `business` | `WORDING PASS / PUBLIC ROLLOUT NO-GO` | Local build đã sạch planned-safe wording, nhưng chưa có DNS/runtime publish/live evidence đủ để gọi public rollout. |
| Wave E | `SIGNOFF NO-GO` | Không được signoff khi Wave D chưa có live evidence: DNS reachable, runtime publish, smoke/live verify và release pack evidence. |

## 3. Audit planned-safe wording

| Surface | Kết quả | Điều đã khóa |
| --- | --- | --- |
| `work` | `PASS` | Public copy chỉ nói brief mẫu, proof-first và hub continuation. Không nói job board live, apply live, checkout, revenue promise hoặc mở tuyển thật. |
| `market` | `PASS` | Public copy chỉ nói tài sản mẫu, ranh giới tin cậy và hub continuation. Không nói marketplace live, cart, checkout, giao dịch đang mở hoặc doanh thu chắc chắn. |
| `community` | `PASS` | Public copy chỉ nói cohort/circle/principles ở mức bản xem trước. Không nói community live, feed live, registration hoặc outcome promise. |
| `ai` | `PASS` | Public copy chỉ nói tình huống mẫu, demo trợ giúp và ranh giới AI. Không nói assistant live, production tool, payment step, thay thế con người hoặc kiếm tiền tự động. |
| `business` | `FIXED + PASS` | Public copy đã bỏ dev wording kiểu `/api`, payload, hydrate, runtime, waiting-state, shell, contract. Trang chỉ giữ định hướng, gợi ý gói, demo an toàn và hub contact. |

## 4. Source đã chỉnh trong scope Team 3

- [scripts/build.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/build.mjs): dọn public copy planned-safe cho 5 surface, đặc biệt BUSINESS và AI.
- [src/data/system-registry.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/src/data/system-registry.json): thêm/chỉnh mission copy `vi` / `en` để gateway không rơi về technical English.
- [scripts/check.mjs](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/scripts/check.mjs): giữ check BUSINESS bám wording fallback public-safe hiện tại.
- [VTL_52_TEAM3_WAVE_GO_NO_GO_ROLLUP_2026-04-22.md](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/docs/final-lock/VTL_52_TEAM3_WAVE_GO_NO_GO_ROLLUP_2026-04-22.md): cập nhật rollup wave gate của Team 3.

## 5. Evidence verify tại mốc này

- `npm run build`: `PASS`
- `npm run check`: `PASS`
- `npm run verify:team3:parity`: `PASS 6/6`, `stopLineOpen: false`
- `node scripts/verify-wave-c-life-invest-hardening.mjs`: `hardening_ready: true`, `release_ready: false`, `planned_safe_hold: true`
- `npm run verify:planned-safe:wave:release`: `PASS 32/32`
- `node scripts/verify-total-system-release-gate.mjs --skip-heavy --timeout-ms 12000`: `baseline_ready: true`, `system_signoff_ready: false`, `wave_e_allowed: false`, blocker `wave_d_dns_or_runtime_publish`
- planned-safe visible/localized scan cho `work`, `market`, `community`, `ai`, `business`: `PASS 5/5`
- planned-safe API scan cho summary/use-case/business contracts: `PASS 7/7`

## 6. Câu chốt điều phối

Wave C được chốt `hardening PASS`, nhưng promotion vẫn `NO-GO`.

Wave D được chốt `planned-safe wording PASS`, nhưng public rollout vẫn `NO-GO` cho tới khi có live evidence.

Wave E không được signoff nếu Wave D chưa có live evidence thật.
