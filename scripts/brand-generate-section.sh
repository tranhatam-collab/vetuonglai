#!/usr/bin/env bash
# Trigger Claude Code to generate a full brand asset section from the
# Brandpro prompt library.
#
# Usage:
#   bash scripts/brand-generate-section.sh <section-number>
#   bash scripts/brand-generate-section.sh 6        # generates 16 hero banners
#   bash scripts/brand-generate-section.sh all      # generates everything
#
# This script doesn't talk to Canva directly — it prints the exact prompt
# you should paste into Claude Code (which has the Canva MCP wired). Claude
# will then loop through generate-design + create-design-from-candidate +
# export-design for each asset in the section.

LIB="../Brandpro-all/forks/vetuonglai.com/PROMPT-LIBRARY.md"
SECTION="${1:-help}"

case "$SECTION" in
  1)  TOPIC="Logo set (5 variants)"; COUNT="5" ;;
  2)  TOPIC="Print collateral (business card, letterhead, envelope, stickers, t-shirt)"; COUNT="5" ;;
  3)  TOPIC="Social media set (IG square/portrait/story/reel, FB cover, LinkedIn, YouTube, X, Pinterest)"; COUNT="9" ;;
  4)  TOPIC="Web assets (OG images per subdomain, favicons, 404, email signature)"; COUNT="34" ;;
  5)  TOPIC="Documents (pitch deck, brand book, proposal, report)"; COUNT="4" ;;
  6)  TOPIC="Per-subdomain hero banners (16)"; COUNT="16" ;;
  7)  TOPIC="Marketing campaign assets"; COUNT="5" ;;
  10) TOPIC="Subdomain assets pack (16 × 3 = 48)"; COUNT="48" ;;
  all) TOPIC="Full library — all sections sequentially"; COUNT="~150" ;;
  help|*)
    cat <<EOF
Usage: bash $0 <section>

Sections:
  1    Logo set (5 assets)
  2    Print collateral (5)
  3    Social media (9)
  4    Web (34)
  5    Documents (4)
  6    Per-subdomain hero banners (16)
  7    Marketing campaign (5)
  10   Subdomain pack (48)
  all  Everything (~150)

Example: bash $0 6   # generates 16 hero banners
EOF
    exit 0
    ;;
esac

cat <<EOF
========================================================
Paste this into Claude Code (Canva MCP must be active):
========================================================

Đọc kỹ Brandpro-all/forks/vetuonglai.com/PROMPT-LIBRARY.md section ${SECTION}
("${TOPIC}", ${COUNT} asset).

Sinh nguyên bộ asset của section này bằng Canva MCP:

  1. Với mỗi asset, dùng generate-design (3-4 candidate).
  2. Pick candidate đầu tiên on-brand nhất, gọi create-design-from-candidate.
  3. Gọi export-design với format phù hợp (PNG cho social/web, PDF cho print).
  4. curl URL về files/brand/canva-exports/ với tên theo section 11 của
     PROMPT-LIBRARY.md.
  5. Sau khi xong section, commit local với message
     "feat(brand): section ${SECTION} — ${TOPIC}".

LUÔN paste khối CONTEXT (section 0 của PROMPT-LIBRARY) vào đầu mỗi prompt
generate-design để giữ brand consistency.

Bắt đầu ngay. Không hỏi confirmation.
========================================================
EOF
