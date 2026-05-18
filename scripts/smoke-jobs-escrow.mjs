#!/usr/bin/env node
// Verify Jobs + Wallet Escrow Integration:
// 1. Create free account → wallet created
// 2. Create job listing with budget → escrow locked
// 3. Verify escrow status via GET /api/wallet/escrow/{job_id}
// 4. Complete job → escrow released & wallet balance restored

import { maybeHandleAccessRuntime } from "../workers/lib/access-runtime.mjs";
import { maybeHandleWalletRuntime } from "../workers/lib/wallet-runtime.mjs";
import { maybeHandleJobsRuntime } from "../workers/lib/jobs-runtime.mjs";

const env = {
  SESSION_COOKIE_SECRET: "test-session-secret",
  MAGIC_LINK_SIGNING_KEY: "test-magic-key",
  WALLET_ADDRESS_SECRET: "test-wallet-secret",
  WALLET_INTERNAL_TOKEN: "test-internal-token",
  VTL_ENV: "dev",
};

function reqJson(host, path, body, method = "POST") {
  return new Request(`https://${host}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function reqWithCookie(host, path, body, sessionCookie, method = "POST") {
  const opts = {
    method,
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
  };
  if (method !== "GET" && method !== "HEAD") {
    opts.body = JSON.stringify(body);
  }
  return new Request(`https://${host}${path}`, opts);
}

// Override fetch to intercept wallet calls from jobs-runtime
let walletCallInterceptor = null;
const originalFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  const urlStr = String(url);
  if (urlStr.includes("/api/wallet/escrow/")) {
    if (walletCallInterceptor) {
      const req = new Request(urlStr, options);
      const resp = await maybeHandleWalletRuntime(req, env);
      return resp;
    }
  }
  return originalFetch(url, options);
};

async function main() {
  console.log("=== JOBS ESCROW INTEGRATION TEST ===\n");

  try {
    // 1. Create free account
    const signup = await maybeHandleAccessRuntime(
      reqJson("vetuonglai.com", "/api/access/account/free/create", {
        candidate_email: "employer@example.com",
        lang: "vi",
        return_to: "/jobs/",
      }),
      env,
    );
    const setCookie = signup.headers.get("set-cookie");
    const signupBody = await signup.json();
    const sessionCookie = setCookie.split(";")[0];
    console.log("✓ Account created");
    console.log(`  email: ${signupBody.email}`);
    console.log(`  wallet: ${signupBody.wallet_address}\n`);

    // 2. Credit wallet with 10,000 VND to test escrow lock
    const creditReq = new Request("https://vc.vetuonglai.com/api/wallet/credit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wallet-internal-token": env.WALLET_INTERNAL_TOKEN,
        "idempotency-key": "test-credit-1",
      },
      body: JSON.stringify({
        address: signupBody.wallet_address,
        amount_vnd: 10000,
        bucket: "available",
        source: "test",
        memo: "Test credit for escrow",
      }),
    });
    const creditResp = await maybeHandleWalletRuntime(creditReq, env);
    const creditBody = await creditResp.json();
    console.log("✓ Wallet credited 10,000 VND");
    console.log(`  available: ${creditBody.wallet?.balances?.available_vnd}\n`);

    // Enable wallet call interception
    walletCallInterceptor = true;

    // 3. Create job listing with 5,000 VND budget
    const jobReq = reqWithCookie(
      "vc.vetuonglai.com",
      "/api/jobs/listings",
      {
        title: "Test Escrow Job",
        description: "A test job to verify escrow locking",
        job_type: "freelance",
        budget_vnd: 5000,
        skills: ["testing"],
        location: "remote",
      },
      sessionCookie,
    );
    const jobResp = await maybeHandleJobsRuntime(jobReq, env);
    const jobBody = await jobResp.json();

    if (jobResp.status !== 201) {
      throw new Error(`Failed to create job! Status: ${jobResp.status}, body: ${JSON.stringify(jobBody)}`);
    }

    const jobId = jobBody.listing?.id;
    const escrowStatus = jobBody.listing?.escrow_status;

    console.log("✓ Job listing created");
    console.log(`  job_id: ${jobId}`);
    console.log(`  escrow_status: ${escrowStatus}\n`);

    if (escrowStatus !== "locked") {
      throw new Error(`Expected escrow_status='locked', got '${escrowStatus}'`);
    }

    // 4. Verify escrow status via GET endpoint
    const escrowGetReq = new Request(
      `https://vc.vetuonglai.com/api/wallet/escrow/${jobId}`,
      { method: "GET", headers: { "content-type": "application/json" } },
    );
    const escrowGetResp = await maybeHandleWalletRuntime(escrowGetReq, env);
    const escrowGetBody = await escrowGetResp.json();

    if (escrowGetResp.status !== 200) {
      throw new Error(`Failed to get escrow! Status: ${escrowGetResp.status}`);
    }

    const escrow = escrowGetBody.escrow;
    console.log("✓ Escrow status retrieved");
    console.log(`  amount: ${escrow.amount_vnd}`);
    console.log(`  status: ${escrow.status}`);
    console.log(`  locked_at: ${new Date(escrow.locked_at * 1000).toISOString()}`);
    console.log(`  expires_at: ${new Date(escrow.expires_at * 1000).toISOString()}\n`);

    if (escrow.status !== "locked" || escrow.amount_vnd !== 5000) {
      throw new Error(`Escrow mismatch! Expected locked + 5000, got ${escrow.status} + ${escrow.amount_vnd}`);
    }

    // 5. Check wallet balance after escrow lock
    const meReq = reqWithCookie("vc.vetuonglai.com", "/api/wallet/me", {}, sessionCookie, "GET");
    const meResp = await maybeHandleWalletRuntime(meReq, env);
    const meBody = await meResp.json();
    const availableAfterLock = meBody.wallet?.balances?.available_vnd;

    console.log("✓ Wallet balance after escrow lock");
    console.log(`  available: ${availableAfterLock}`);
    console.log(`  expected: 5000 (10000 - 5000 locked)\n`);

    if (availableAfterLock !== 5000) {
      throw new Error(`Balance mismatch! Expected 5000, got ${availableAfterLock}`);
    }

    // 6. Complete job & release escrow
    const completeReq = reqWithCookie(
      "vc.vetuonglai.com",
      `/api/jobs/listings/${jobId}/complete`,
      {},
      sessionCookie,
    );
    const completeResp = await maybeHandleJobsRuntime(completeReq, env);
    const completeBody = await completeResp.json();

    if (completeResp.status !== 200) {
      throw new Error(`Failed to complete job! Status: ${completeResp.status}, body: ${JSON.stringify(completeBody)}`);
    }

    const completedJob = completeBody.listing;
    console.log("✓ Job marked complete & escrow released");
    console.log(`  job_status: ${completedJob.status}`);
    console.log(`  escrow_status: ${completedJob.escrow_status}\n`);

    if (completedJob.status !== "completed" || completedJob.escrow_status !== "released") {
      throw new Error(`Expected completed + released, got ${completedJob.status} + ${completedJob.escrow_status}`);
    }

    // 7. Verify wallet balance restored
    const meReq2 = reqWithCookie("vc.vetuonglai.com", "/api/wallet/me", {}, sessionCookie, "GET");
    const meResp2 = await maybeHandleWalletRuntime(meReq2, env);
    const meBody2 = await meResp2.json();
    const availableAfterRelease = meBody2.wallet?.balances?.available_vnd;

    console.log("✓ Wallet balance after escrow release");
    console.log(`  available: ${availableAfterRelease}`);
    console.log(`  expected: 10000 (5000 + 5000 released)\n`);

    if (availableAfterRelease !== 10000) {
      throw new Error(`Balance mismatch after release! Expected 10000, got ${availableAfterRelease}`);
    }

    // 8. Verify final escrow status is "released"
    const escrowFinalReq = new Request(
      `https://vc.vetuonglai.com/api/wallet/escrow/${jobId}`,
      { method: "GET", headers: { "content-type": "application/json" } },
    );
    const escrowFinalResp = await maybeHandleWalletRuntime(escrowFinalReq, env);
    const escrowFinalBody = await escrowFinalResp.json();

    console.log("✓ Final escrow status");
    console.log(`  status: ${escrowFinalBody.escrow.status}`);
    console.log(`  released_at: ${new Date(escrowFinalBody.escrow.released_at * 1000).toISOString()}\n`);

    if (escrowFinalBody.escrow.status !== "released") {
      throw new Error(`Expected escrow to be released, got ${escrowFinalBody.escrow.status}`);
    }

    console.log("=== JOBS ESCROW INTEGRATION OK ✓ ===");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

main().catch((e) => { console.error("FAIL:", e); process.exit(1); });
