#!/usr/bin/env node
// Verify that POST /api/access/account/free/create triggers wallet creation,
// returns wallet_address, and the wallet is readable via /api/wallet/me using
// the same session cookie.
import { maybeHandleAccessRuntime } from "../workers/lib/access-runtime.mjs";
import { maybeHandleWalletRuntime } from "../workers/lib/wallet-runtime.mjs";

const env = {
  SESSION_COOKIE_SECRET: "test-session-secret",
  MAGIC_LINK_SIGNING_KEY: "test-magic-key",
  WALLET_ADDRESS_SECRET: "test-wallet-secret",
  WALLET_INTERNAL_TOKEN: "test-internal-token",
  VTL_ENV: "dev",
};

function reqJson(host, path, body) {
  return new Request(`https://${host}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function main() {
  // 1. Trigger free account create on vetuonglai.com host (allowed host)
  const signup = await maybeHandleAccessRuntime(
    reqJson("vetuonglai.com", "/api/access/account/free/create", {
      candidate_email: "newuser@example.com",
      lang: "vi",
      return_to: "/welcome/",
    }),
    env,
  );
  const setCookie = signup.headers.get("set-cookie");
  const signupBody = await signup.json();
  console.log("=== free_account_create →", signup.status, "===");
  console.log("wallet_address:", signupBody.wallet_address);
  console.log("status:", signupBody.status);
  if (!signupBody.wallet_address || !signupBody.wallet_address.startsWith("vtl1")) {
    throw new Error("Wallet address missing in signup response!");
  }
  if (!setCookie || !setCookie.startsWith("vtl_session=")) {
    throw new Error("Session cookie not set!");
  }
  const sessionCookie = setCookie.split(";")[0]; // "vtl_session=..."

  // 2. Use that session cookie to read wallet from vc.vetuonglai.com
  const meReq = new Request("https://vc.vetuonglai.com/api/wallet/me", {
    headers: { cookie: sessionCookie },
  });
  const meResp = await maybeHandleWalletRuntime(meReq, env);
  const meBody = await meResp.json();
  console.log("\n=== /api/wallet/me from vc.vetuonglai.com →", meResp.status, "===");
  console.log("address:", meBody.wallet?.address);
  console.log("created_from:", meBody.wallet?.created_from);

  if (meBody.wallet?.address !== signupBody.wallet_address) {
    throw new Error(`Mismatch! signup gave ${signupBody.wallet_address}, /me returned ${meBody.wallet?.address}`);
  }
  if (meBody.wallet?.created_from !== "free_account_create") {
    throw new Error(`Expected created_from=free_account_create, got ${meBody.wallet?.created_from}`);
  }

  // 3. Second signup with same email → wallet not re-created (idempotent)
  const signup2 = await maybeHandleAccessRuntime(
    reqJson("vetuonglai.com", "/api/access/account/free/create", {
      candidate_email: "newuser@example.com",
      lang: "vi",
      return_to: "/",
    }),
    env,
  );
  const signup2Body = await signup2.json();
  console.log("\n=== second free_account_create (same email) → wallet stays same? ===");
  console.log("address:", signup2Body.wallet_address, "match:", signup2Body.wallet_address === signupBody.wallet_address);
  if (signup2Body.wallet_address !== signupBody.wallet_address) {
    throw new Error("Wallet address should be deterministic across signups!");
  }

  console.log("\nINTEGRATION OK ✓");
}

main().catch((e) => { console.error("FAIL:", e); process.exit(1); });
