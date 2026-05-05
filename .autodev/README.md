# .autodev — Vòng lặp dev tự động 9 phút/lần

Hệ thống chạy `scripts/auto-dev-loop.mjs` qua launchd mỗi 9 phút.
Mỗi lần chạy = 1 tick. Mỗi tick:

1. `git status` — nếu working tree dirty → ABORT tick (không đụng vào WIP của founder)
2. Chạy gate sweep nhanh (build + check + audit:bilingual)
3. Nếu có gate fail → pick handler whitelist tương ứng → fix → re-verify → commit
4. Nếu mọi gate xanh → pick 1 task tiếp theo từ `.autodev/backlog.json`
5. Cập nhật `.autodev/state.json`, ghi log `.autodev/logs/YYYY-MM-DD.jsonl`

## Phạm vi loop được tự fix (whitelist cứng)

- `bilingual-mixed-pair`: VI side trùng EN, swap, hoặc mất diacritic
- `north-star-violation`: cụm "dạy cách", "phải", "nên", "hướng dẫn cách" trong protected/ và content/
- `verifier-flake`: retry verify-read-phase0 --live, regen reports
- `auto-assertion-lock`: scan dist/ tìm `data-compliance`, `data-product`, `data-region` mới và thêm assertion vào check.mjs
- `scaffold-only` content: tạo file structure + frontmatter + slug placeholder cho 1B/1C, KHÔNG body. Đánh dấu `status: "awaiting_founder_manuscript"`, block khỏi build.
- `refactor-build-mjs`: rename biến cục bộ trong helper functions, KHÔNG đổi public API, KHÔNG đổi output HTML.

## Phạm vi loop KHÔNG được làm

- Fabricate body content (Bài 1, 9 chương, prompt, essay)
- Đổi schema public API
- Đổi pricing, license, legal text
- Đổi tagline đã khoá ở Batch 1A
- Force push, amend commit, đụng git config
- Tạo file `.env`, secrets, hoặc commit credentials

## Điều kiện dừng

Loop tự exit và xoá launchd job khi đạt 1 trong:

- 2 tick liên tiếp: backlog rỗng + tất cả gate xanh + không có việc auto-detect được
- Anh chạy `bash .autodev/stop.sh`
- 5 tick liên tiếp fail cùng 1 handler (an toàn)

## File

- `scripts/auto-dev-loop.mjs` — entry point
- `.autodev/handlers/*.mjs` — từng handler
- `.autodev/state.json` — counter, last_tick, consecutive_clean_ticks
- `.autodev/backlog.json` — task queue
- `.autodev/logs/*.jsonl` — log từng tick
- `.autodev/stop.sh` — kill loop
- `~/Library/LaunchAgents/com.vetuonglai.autodev.plist` — schedule
