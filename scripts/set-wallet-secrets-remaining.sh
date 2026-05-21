#!/usr/bin/env bash
# Push WALLET_ADDRESS_SECRET + WALLET_INTERNAL_TOKEN to the 4 workers that
# were NOT covered by the original deploy-wallet-final.sh run:
#   vetuonglai-edu-github, vetuonglai-green, vetuonglai-finance, vetuonglai-kids
#
# Prerequisites:
#   1. Retrieve WALLET_ADDRESS_SECRET + WALLET_INTERNAL_TOKEN from your
#      password manager (they were saved when you ran deploy-wallet-final.sh).
#   2. export CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e
#   3. npx wrangler login   (if your auth token expired)
#
# Usage:
#   bash scripts/set-wallet-secrets-remaining.sh
#
# Or pass secrets inline (non-interactive):
#   WALLET_ADDRESS_SECRET=xxx WALLET_INTERNAL_TOKEN=yyy \
#     bash scripts/set-wallet-secrets-remaining.sh

set -euo pipefail

export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-62d57eaa548617aeecac766e5a1cb98e}"

# ── Collect secrets ────────────────────────────────────────────────────────────
if [ -z "${WALLET_ADDRESS_SECRET:-}" ]; then
  echo ""
  echo "Enter WALLET_ADDRESS_SECRET (from 1Password / Bitwarden):"
  read -rs WALLET_ADDRESS_SECRET
fi

if [ -z "${WALLET_INTERNAL_TOKEN:-}" ]; then
  echo ""
  echo "Enter WALLET_INTERNAL_TOKEN (from 1Password / Bitwarden):"
  read -rs WALLET_INTERNAL_TOKEN
fi

echo ""
echo "Secrets loaded. Setting on 4 workers..."
echo ""

# ── Workers that need the secrets ─────────────────────────────────────────────
WORKERS=(
  "vetuonglai-edu-github"
  "vetuonglai-green"
  "vetuonglai-finance"
  "vetuonglai-kids"
)

for NAME in "${WORKERS[@]}"; do
  echo "──────────────────────────────────"
  echo "Worker: $NAME"
  printf '%s' "$WALLET_ADDRESS_SECRET" \
    | npx wrangler secret put WALLET_ADDRESS_SECRET --name "$NAME"
  printf '%s' "$WALLET_INTERNAL_TOKEN" \
    | npx wrangler secret put WALLET_INTERNAL_TOKEN --name "$NAME"
  echo "✅ $NAME done"
done

echo ""
echo "══════════════════════════════════"
echo "Verifying secret lists:"
echo "══════════════════════════════════"
for NAME in "${WORKERS[@]}"; do
  echo ""
  echo "=== $NAME ==="
  npx wrangler secret list --name "$NAME" 2>&1 | grep -E "WALLET|MAIL|SESSION|MAGIC" || true
done

echo ""
echo "══════════════════════════════════"
echo "DONE — redeploy the 4 workers now:"
echo "  node scripts/deploy-workers.mjs --worker edu"
echo "  node scripts/deploy-workers.mjs --worker green"
echo "  node scripts/deploy-workers.mjs --worker finance"
echo "  node scripts/deploy-workers.mjs --worker kids"
echo "══════════════════════════════════"
