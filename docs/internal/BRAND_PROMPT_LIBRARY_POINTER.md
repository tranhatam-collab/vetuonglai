# Brand Prompt Library — Pointer

The authoritative design prompt library for Vetuonglai brand assets lives in the
Brandpro fork (sibling repo, kept separate so brand decisions don't churn the
product repo):

```
/Users/tranhatam/Documents/Devnewproject/Brandpro-all/forks/vetuonglai.com/PROMPT-LIBRARY.md
```

## How to use

1. Open Claude Code with the Canva MCP enabled (already wired in this workspace
   — connector ID `40e2354f-6a30-4752-bb88-7874e8d69c9d`).
2. Paste this trigger:

   ```
   Đọc Brandpro-all/forks/vetuonglai.com/PROMPT-LIBRARY.md.
   Sinh toàn bộ asset trong section {N}. Lưu local vào
   files/brand/canva-exports/ theo naming convention section 11. Commit mỗi
   section thành 1 commit riêng.
   ```

3. Loop từng section. Sections nặng nhất (section 6 + section 10) tạo 16 asset
   mỗi cái — tổng ~120 asset cho nguyên bộ.

## Existing exports

9 asset đầu tiên đã sinh trong session 2026-05-17 — xem
`files/brand/canva-exports/` và `Brandpro-all/forks/vetuonglai.com/BRAND-CANVA-LIBRARY.md`.

## Free plan limit (đã gặp)

- Transparent PNG export → cần Canva Pro (~$10/tháng).
- Email design type không xuất PNG → xuất PDF.

Upgrade Pro nếu muốn sinh transparent logo + tạo official Brand Kit trong Canva
(currently `list-brand-kits` trả về rỗng).
