#!/usr/bin/env bash
# Bind wallet secrets + KV to edu/green/finance/kids so wallet API works
# uniformly across ALL subdomains. Run AFTER initial wallet deploy.
#
# Usage:
#   WALLET_ADDRESS_SECRET="<from 1Password>" \
#   WALLET_INTERNAL_TOKEN="<from 1Password>" \
#   bash scripts/bind-wallet-to-all-workers.sh

set -e

if [ -z "$WALLET_ADDRESS_SECRET" ] || [ -z "$WALLET_INTERNAL_TOKEN" ]; then
  echo "ERROR: Export WALLET_ADDRESS_SECRET and WALLET_INTERNAL_TOKEN before running."
  echo "Get them from 1Password (same values as home/vc/member workers)."
  exit 1
fi

export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-62d57eaa548617aeecac766e5a1cb98e}"
export ACCESS_KV_NAMESPACE_ID="${ACCESS_KV_NAMESPACE_ID:-4b1329f961744a1aa3056b625c9b33e7}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

for NAME in vetuonglai-edu-github vetuonglai-green vetuonglai-finance vetuonglai-kids; do
  echo "--- $NAME: upload secrets ---"
  printf '%s' "$WALLET_ADDRESS_SECRET" | npx wrangler secret put WALLET_ADDRESS_SECRET --name "$NAME"
  printf '%s' "$WALLET_INTERNAL_TOKEN" | npx wrangler secret put WALLET_INTERNAL_TOKEN --name "$NAME"
done

echo ""
echo "--- Deploy with KV binding ---"
for KEY in edu green finance kids; do
  node scripts/deploy-workers.mjs --worker "$KEY"
done

echo ""
echo "--- Verify wallet runtime on all 4 ---"
for HOST in edu.vetuonglai.com green.vetuonglai.com finance.vetuonglai.com kids.vetuonglai.com; do
  echo "--- $HOST ---"
  curl -s "https://$HOST/api/wallet/health"
  echo ""
done
