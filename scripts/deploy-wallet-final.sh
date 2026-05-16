#!/usr/bin/env bash
# Wallet deploy — final clean run. Idempotent.
# Usage: bash scripts/deploy-wallet-final.sh

set -e

# Find project root from script location (works no matter where you run from)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

CORRECT_ACCOUNT=62d57eaa548617aeecac766e5a1cb98e
WRONG_ACCOUNT=f3f9e76222dcb488d5e303e29e8ba192
ORPHAN_KV_ID=341041f79bcb498faf23d9b0eb1bd259

step() {
  echo ""
  echo "########## $1 ##########"
}

# ------------------------------------------------------------------
step "STEP 1/6 — Cleanup wrong account ($WRONG_ACCOUNT)"
# ------------------------------------------------------------------
for NAME in vetuonglai-home vetuonglai-vc vetuonglai-member; do
  echo "--- delete worker $NAME (wrong account) ---"
  CLOUDFLARE_ACCOUNT_ID=$WRONG_ACCOUNT npx wrangler delete --name "$NAME" 2>&1 \
    | tail -5 || true
done
echo "--- delete orphan KV $ORPHAN_KV_ID ---"
yes | CLOUDFLARE_ACCOUNT_ID=$WRONG_ACCOUNT npx wrangler kv namespace delete \
  --namespace-id "$ORPHAN_KV_ID" 2>&1 | tail -5 || true

# ------------------------------------------------------------------
step "STEP 2/6 — Lock to correct account"
# ------------------------------------------------------------------
export CLOUDFLARE_ACCOUNT_ID=$CORRECT_ACCOUNT
echo "CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID"

# ------------------------------------------------------------------
step "STEP 3/6 — Generate secrets + create KV"
# ------------------------------------------------------------------
WALLET_ADDRESS_SECRET=$(openssl rand -base64 48 | tr -d '\n')
WALLET_INTERNAL_TOKEN=$(openssl rand -base64 48 | tr -d '\n')

cat <<EOF

================================================================
LƯU 2 DÒNG NÀY VÀO 1PASSWORD / BITWARDEN NGAY:
WALLET_ADDRESS_SECRET=$WALLET_ADDRESS_SECRET
WALLET_INTERNAL_TOKEN=$WALLET_INTERNAL_TOKEN
================================================================
EOF

read -p "Đã lưu xong? Enter để tiếp tục (Ctrl+C để huỷ)..."

echo "--- Creating KV namespace vetuonglai_access ---"
KV_CREATE_OUT=$(npx wrangler kv namespace create vetuonglai_access 2>&1)
echo "$KV_CREATE_OUT"

ACCESS_KV_NAMESPACE_ID=$(echo "$KV_CREATE_OUT" \
  | grep -oE '"id":[[:space:]]*"[a-f0-9]{32}"' \
  | grep -oE '[a-f0-9]{32}' \
  | head -1)

if [ -z "$ACCESS_KV_NAMESPACE_ID" ]; then
  # Fallback: namespace may already exist — find it
  echo "--- KV may already exist, looking up ---"
  ACCESS_KV_NAMESPACE_ID=$(npx wrangler kv namespace list 2>&1 \
    | grep -B1 '"title": "vetuonglai_access"' \
    | grep -oE '"id":[[:space:]]*"[a-f0-9]{32}"' \
    | grep -oE '[a-f0-9]{32}' \
    | head -1)
fi

if [ -z "$ACCESS_KV_NAMESPACE_ID" ]; then
  echo "ERROR: cannot determine ACCESS_KV_NAMESPACE_ID"
  exit 1
fi

export ACCESS_KV_NAMESPACE_ID
echo ""
echo "ACCESS_KV_NAMESPACE_ID=$ACCESS_KV_NAMESPACE_ID"

# ------------------------------------------------------------------
step "STEP 4/6 — Upload secrets to 3 workers"
# ------------------------------------------------------------------
for NAME in vetuonglai-home vetuonglai-vc vetuonglai-member; do
  echo ""
  echo "--- $NAME ---"
  printf '%s' "$WALLET_ADDRESS_SECRET" \
    | npx wrangler secret put WALLET_ADDRESS_SECRET --name "$NAME"
  printf '%s' "$WALLET_INTERNAL_TOKEN" \
    | npx wrangler secret put WALLET_INTERNAL_TOKEN --name "$NAME"
done

echo ""
echo "--- Verify secrets ---"
for NAME in vetuonglai-home vetuonglai-vc vetuonglai-member; do
  echo "=== $NAME ==="
  npx wrangler secret list --name "$NAME" --format json
done

# ------------------------------------------------------------------
step "STEP 5/6 — Deploy 3 workers (KV binding auto-passed by deploy script)"
# ------------------------------------------------------------------
npm run cloudflare:deploy:workers

# ------------------------------------------------------------------
step "STEP 6/6 — Smoke test"
# ------------------------------------------------------------------
echo "--- /api/wallet/health (expect storage_mode:kv) ---"
curl -s https://vc.vetuonglai.com/api/wallet/health
echo ""

TEST_EMAIL="smoketest-wallet-$(date +%s)@example.com"
echo ""
echo "--- POST /api/access/account/free/create  ($TEST_EMAIL) ---"
curl -s -X POST https://vetuonglai.com/api/access/account/free/create \
  -H 'content-type: application/json' \
  -c /tmp/vtl.cookies \
  -d "{\"candidate_email\":\"$TEST_EMAIL\",\"lang\":\"vi\",\"return_to\":\"/\"}" \
  | python3 -m json.tool 2>/dev/null \
  || curl -s -X POST https://vetuonglai.com/api/access/account/free/create \
      -H 'content-type: application/json' \
      -d "{\"candidate_email\":\"$TEST_EMAIL\",\"lang\":\"vi\",\"return_to\":\"/\"}"
echo ""

echo "--- GET /api/wallet/me (with cookie) ---"
curl -s https://vc.vetuonglai.com/api/wallet/me -b /tmp/vtl.cookies \
  | python3 -m json.tool 2>/dev/null \
  || curl -s https://vc.vetuonglai.com/api/wallet/me -b /tmp/vtl.cookies
echo ""

step "DONE"
cat <<EOF

Persist account for future terminals:
  echo 'export CLOUDFLARE_ACCOUNT_ID=$CORRECT_ACCOUNT' >> ~/.zshrc
  source ~/.zshrc

KV namespace id (for backfill script later):
  ACCESS_KV_NAMESPACE_ID=$ACCESS_KV_NAMESPACE_ID
EOF
