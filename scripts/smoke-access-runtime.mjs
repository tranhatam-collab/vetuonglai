import assert from "node:assert/strict";

import { maybeHandleAccessRuntime } from "../workers/lib/access-runtime.mjs";

async function readJson(response) {
  return JSON.parse(await response.text());
}

function getCookie(response) {
  return response.headers.get("set-cookie") || "";
}

async function signTimestampedPayload(rawBody, secret, timestamp) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function testSessionFlow() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
  };

  const request = new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "smoke-team1@vetuonglai.com",
      entry: "hub",
      intent: "annual-access",
      annual_access_status: "active",
      member_state: "annual_active",
      lang: "vi",
      return_to: "/thanh-vien/",
    }),
  });

  const requested = await maybeHandleAccessRuntime(request, env);
  assert(requested);
  assert.equal(requested.status, 202);
  const requestedBody = await readJson(requested);
  assert.equal(requestedBody.status, "session_request_normalized");
  assert.equal(requestedBody.storage.mode, "memory");

  const consumed = await maybeHandleAccessRuntime(new Request(requestedBody.magicLink.magicLinkUrl), env);
  assert(consumed);
  assert.equal(consumed.status, 200);
  const consumedBody = await readJson(consumed);
  assert.equal(consumedBody.status, "session_created");
  const cookie = getCookie(consumed);
  assert(cookie.includes("vtl_session="));

  const current = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/current", {
    headers: {
      cookie,
    },
  }), env);
  assert(current);
  assert.equal(current.status, 200);
  const currentBody = await readJson(current);
  assert.equal(currentBody.status, "session_active");
  assert.equal(currentBody.authenticated, true);
  assert.equal(currentBody.contract.endpoint, "/api/access/session/current");
  assert.equal(currentBody.contract.onboarding_goal_endpoint, "/api/access/onboarding/goal");
  assert.equal(currentBody.session.refresh_disabled, false);
  assert.equal(currentBody.member_state, "annual_active");
  assert.deepEqual(currentBody.entitlements, [
    "public_basics",
    "annual_access_core",
    "purchase_hub",
    "cross_domain_orientation",
  ]);

  const logout = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/logout", {
    method: "POST",
    headers: {
      cookie,
    },
  }), env);
  assert(logout);
  assert.equal(logout.status, 200);
  const logoutBody = await readJson(logout);
  assert.equal(logoutBody.status, "session_cleared");
}

async function testFreeAccountFromHomepage() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
  };

  const createResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/account/free/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "free-account@vetuonglai.com",
      lang: "vi",
      return_to: "/bat-dau/",
    }),
  }), env);
  assert(createResponse);
  assert.equal(createResponse.status, 201);
  const createPayload = await readJson(createResponse);
  assert.equal(createPayload.status, "free_account_created");
  assert.equal(createPayload.authenticated, true);
  assert.equal(createPayload.member_state, "pending_member");
  const cookie = getCookie(createResponse);
  assert(cookie.includes("vtl_session="));

  const current = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/current", {
    headers: {
      cookie,
    },
  }), env);
  assert(current);
  assert.equal(current.status, 200);
  const currentPayload = await readJson(current);
  assert.equal(currentPayload.member_state, "pending_member");
  assert.deepEqual(currentPayload.entitlements, ["public_basics"]);

  const deniedHost = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/account/free/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "free-account@vetuonglai.com",
    }),
  }), env);
  assert(deniedHost);
  assert.equal(deniedHost.status, 403);
  const deniedPayload = await readJson(deniedHost);
  assert.equal(deniedPayload.status, "free_account_host_not_allowed");

  const noCookie = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/current"), env);
  assert(noCookie);
  assert.equal(noCookie.status, 401);
  const noCookiePayload = await readJson(noCookie);
  assert.equal(noCookiePayload.error_code, "SESSION_MISSING_COOKIE");
}

async function testOnboardingGoalPersistence() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
  };

  const request = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "onboarding-goal@vetuonglai.com",
      entry: "member",
      intent: "specialist-pack",
      member_state: "pending_member",
      lang: "vi",
      return_to: "/onboarding/step-2-goals/",
    }),
  }), env);
  assert(request);
  const requestPayload = await readJson(request);

  const consumed = await maybeHandleAccessRuntime(new Request(requestPayload.magicLink.magicLinkUrl), env);
  assert(consumed);
  const cookie = getCookie(consumed);

  const persist = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/onboarding/goal", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({
      pathway: "learn",
      selection_method: "manual",
      note: "focus on structured learning",
    }),
  }), env);
  assert(persist);
  assert.equal(persist.status, 200);
  const persistPayload = await readJson(persist);
  assert.equal(persistPayload.status, "onboarding_goal_saved");
  assert.equal(persistPayload.selected_goal, "learn");

  const current = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/session/current?refresh=off", {
    headers: {
      cookie,
    },
  }), env);
  assert(current);
  assert.equal(current.status, 200);
  const currentPayload = await readJson(current);
  assert.equal(currentPayload.onboarding.selected_goal, "learn");
  assert.equal(currentPayload.session.refresh_disabled, true);
}

async function testBypassAndDedupe() {
  const env = {
    VTL_ENV: "development",
  };
  const body = {
    event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
    event_id: "evt_sub_smoke_1",
    candidate_email: "smoke-team1@vetuonglai.com",
    paypal_subscription_id: "I-SMOKE-1",
  };

  const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/subscriptions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }), env);
  assert(response);
  assert.equal(response.status, 202);
  const payload = await readJson(response);
  assert.equal(payload.status, "subscription_event_normalized");
  assert.equal(payload.paypalVerification.verificationStatus, "BYPASSED");

  const duplicate = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/subscriptions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }), env);
  assert(duplicate);
  assert.equal(duplicate.status, 200);
  const duplicateBody = await readJson(duplicate);
  assert.equal(duplicateBody.status, "duplicate_event_ignored");
}

async function testRuntimeStateSyncAfterPurchase() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
  };

  const request = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "upgrade-after-pay@vetuonglai.com",
      entry: "hub",
      intent: "specialist-pack",
      member_state: "pending_member",
      lang: "vi",
      return_to: "/bat-dau/",
    }),
  }), env);
  assert(request);
  assert.equal(request.status, 202);
  const requestPayload = await readJson(request);

  const consumed = await maybeHandleAccessRuntime(new Request(requestPayload.magicLink.magicLinkUrl), env);
  assert(consumed);
  assert.equal(consumed.status, 200);
  const cookie = getCookie(consumed);
  assert(cookie.includes("vtl_session="));

  const webhook = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      event_id: "evt_pack_sync_smoke_1",
      candidate_email: "upgrade-after-pay@vetuonglai.com",
      pack_key: "g3",
      annual_access_status: "active",
    }),
  }), env);
  assert(webhook);
  assert.equal(webhook.status, 202);
  const webhookPayload = await readJson(webhook);
  assert.equal(webhookPayload.runtimeProvisioning.member_state, "pack_owner");

  const current = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/current", {
    headers: {
      cookie,
    },
  }), env);
  assert(current);
  assert.equal(current.status, 200);
  const currentPayload = await readJson(current);
  assert.equal(currentPayload.member_state, "pack_owner");
  assert(currentPayload.entitlements.includes("owned_pack_depth"));
}

async function testPostbackVerification() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    calls.push({ url, init });

    if (url.endsWith("/v1/oauth2/token")) {
      return new Response(JSON.stringify({
        access_token: "smoke-paypal-token",
        expires_in: 3600,
      }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (url.endsWith("/v1/notifications/verify-webhook-signature")) {
      return new Response(JSON.stringify({
        verification_status: "SUCCESS",
      }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    throw new Error(`unexpected fetch: ${url}`);
  };

  try {
    const env = {
      VTL_ENV: "production",
      PAYPAL_ENVIRONMENT: "sandbox",
      PAYPAL_WEBHOOK_VERIFY_MODE: "postback",
      PAYPAL_CLIENT_ID: "smoke-client-id",
      PAYPAL_CLIENT_SECRET: "smoke-client-secret",
      PAYPAL_WEBHOOK_ID_ORDERS: "WH-ORDER-SMOKE",
    };

    const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "paypal-transmission-id": "transmission-1",
        "paypal-transmission-time": "2026-04-09T09:00:00Z",
        "paypal-transmission-sig": "signature-1",
        "paypal-cert-url": "https://api-m.sandbox.paypal.com/v1/notifications/certs/CERT-1",
        "paypal-auth-algo": "SHA256withRSA",
      },
      body: JSON.stringify({
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        event_id: "evt_order_smoke_1",
        pack_key: "g4",
        annual_access_status: "active",
        candidate_email: "smoke-team1@vetuonglai.com",
        paypal_order_id: "ORDER-SMOKE-1",
        compliance_passed: true,
        identity_confirmed: true,
      }),
    }), env);

    assert(response);
    assert.equal(response.status, 202);
    const payload = await readJson(response);
    assert.equal(payload.status, "pack_provisioning_evaluated");
    assert.equal(payload.paypalVerification.verificationStatus, "SUCCESS");
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testCheckoutResolveAndStripeWebhook() {
  const env = {
    VTL_ENV: "development",
    STRIPE_ANNUAL_ACCESS_CHECKOUT_URL: "https://buy.stripe.com/test-annual-access",
    STRIPE_PACK_CHECKOUT_URLS_JSON: JSON.stringify({
      g5: "https://buy.stripe.com/test-pack-g5",
    }),
  };

  const checkoutResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/checkout/resolve", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "smoke-stripe@vetuonglai.com",
      entry: "finance",
      intent: "specialist-pack",
      pack: "g5",
      gateway: "stripe",
      lang: "vi",
      return_to: "/finance/",
    }),
  }), env);
  assert(checkoutResponse);
  assert.equal(checkoutResponse.status, 202);
  const checkoutPayload = await readJson(checkoutResponse);
  assert.equal(checkoutPayload.status, "checkout_route_resolved");
  assert.equal(checkoutPayload.payment.checkoutUrl, "https://buy.stripe.com/test-pack-g5");

  const stripeBypass = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/stripe", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: "evt_stripe_smoke_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_smoke_1",
          mode: "payment",
          customer_email: "smoke-stripe@vetuonglai.com",
          metadata: {
            intent: "specialist-pack",
            pack_key: "g5",
            annual_access_status: "active",
            identity_confirmed: "true",
            compliance_passed: true,
          },
        },
      },
    }),
  }), env);
  assert(stripeBypass);
  assert.equal(stripeBypass.status, 202);
  const stripeBypassPayload = await readJson(stripeBypass);
  assert.equal(stripeBypassPayload.status, "pack_provisioning_evaluated");
  assert.equal(stripeBypassPayload.stripeVerification.verificationStatus, "BYPASSED");

  const productionEnv = {
    VTL_ENV: "production",
    STRIPE_WEBHOOK_VERIFY_MODE: "signature",
    STRIPE_WEBHOOK_SECRET: "whsec_smoke_secret",
  };
  const rawBody = JSON.stringify({
    id: "evt_stripe_smoke_2",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_smoke_2",
        mode: "subscription",
        customer_email: "smoke-annual@vetuonglai.com",
        subscription: "sub_smoke_2",
        metadata: {
          intent: "annual-access",
        },
      },
    },
  });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await signTimestampedPayload(rawBody, productionEnv.STRIPE_WEBHOOK_SECRET, timestamp);

  const stripeVerified = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/stripe", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": `t=${timestamp},v1=${signature}`,
    },
    body: rawBody,
  }), productionEnv);
  assert(stripeVerified);
  assert.equal(stripeVerified.status, 202);
  const stripeVerifiedPayload = await readJson(stripeVerified);
  assert.equal(stripeVerifiedPayload.status, "subscription_event_normalized");
  assert.equal(stripeVerifiedPayload.stripeVerification.verificationStatus, "SUCCESS");
}

async function testPayIaiOneCheckoutAndWebhook() {
  const originalFetch = globalThis.fetch;
  const upstreamCalls = [];

  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    upstreamCalls.push({
      url,
      init,
    });

    if (url === "https://pay.iai.one/api/v1/checkout/session") {
      return new Response(JSON.stringify({
        checkout_url: "https://pay.iai.one/checkout/session/live-smoke-1",
        session_id: "vtl_pay_session_smoke_1",
        provider_ref: "payos_live_ref_smoke_1",
        expires_at: "2026-04-17T18:00:00.000Z",
      }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    throw new Error(`unexpected fetch: ${url}`);
  };

  try {
    const env = {
      VTL_ENV: "production",
      PAY_IAI_ONE_BASE_URL: "https://pay.iai.one",
      PAY_IAI_ONE_API_KEY: "pay_live_smoke_api_key",
      PAY_IAI_ONE_WEBHOOK_SECRET: "pay_live_smoke_webhook_secret",
    };

    const checkoutResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/checkout/resolve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-idempotency-key": "team1-pay-smoke-annual-1",
      },
      body: JSON.stringify({
        candidate_email: "pay-annual@vetuonglai.com",
        entry: "hub",
        intent: "annual-access",
        gateway: "payos",
        lang: "vi",
        source: "purchase-hub",
        return_to: "/thanh-vien/",
        metadata: {
          campaign: "smoke-launch",
          device: "desktop",
        },
      }),
    }), env);
    assert(checkoutResponse);
    assert.equal(checkoutResponse.status, 202);
    const checkoutPayload = await readJson(checkoutResponse);
    assert.equal(checkoutPayload.status, "checkout_route_resolved");
    assert.equal(checkoutPayload.normalized.gateway, "pay");
    assert.equal(checkoutPayload.payment.provider, "pay_iai_one_checkout_session");
    assert.equal(checkoutPayload.payment.checkoutUrl, "https://pay.iai.one/checkout/session/live-smoke-1");
    assert.equal(checkoutPayload.payment.sessionId, "vtl_pay_session_smoke_1");
    assert.equal(checkoutPayload.payment.providerRef, "payos_live_ref_smoke_1");
    assert.equal(checkoutPayload.payment.idempotencyKey, "team1-pay-smoke-annual-1");
    assert.equal(upstreamCalls.length, 1);
    assert.equal(upstreamCalls[0].init.headers["x-api-key"], env.PAY_IAI_ONE_API_KEY);
    assert.equal(upstreamCalls[0].init.headers["x-idempotency-key"], "team1-pay-smoke-annual-1");
    const checkoutRequestBody = JSON.parse(upstreamCalls[0].init.body);
    assert.equal(checkoutRequestBody.intent, "annual-access");
    assert.equal(checkoutRequestBody.candidate_email, "pay-annual@vetuonglai.com");
    assert.equal(checkoutRequestBody.metadata.entry, "hub");
    assert.equal(checkoutRequestBody.metadata.campaign, "smoke-launch");
    assert.equal(checkoutRequestBody.metadata.device, "desktop");
    assert(checkoutRequestBody.return_url.includes("member.vetuonglai.com/unlock/success/"));
    assert(checkoutRequestBody.cancel_url.includes("vetuonglai.com/bat-dau/"));

    const annualWebhookBody = JSON.stringify({
      event_id: "evt_pay_annual_smoke_1",
      event_type: "subscription.activated",
      occurred_at: "2026-04-17T10:00:00.000Z",
      candidate_email: "pay-annual@vetuonglai.com",
      subscription_id: "sub_pay_smoke_1",
      amount: 1200000,
      currency: "VND",
      status: "active",
      intent: "annual-access",
      metadata: {
        entry: "hub",
        source: "purchase-hub",
      },
    });
    const annualTimestamp = Math.floor(Date.now() / 1000).toString();
    const annualSignature = await signTimestampedPayload(
      annualWebhookBody,
      env.PAY_IAI_ONE_WEBHOOK_SECRET,
      annualTimestamp,
    );
    const annualWebhook = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/webhooks/pay/iai-one", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-pay-timestamp": annualTimestamp,
        "x-pay-signature": annualSignature,
      },
      body: annualWebhookBody,
    }), env);
    assert(annualWebhook);
    assert.equal(annualWebhook.status, 202);
    const annualPayload = await readJson(annualWebhook);
    assert.equal(annualPayload.status, "subscription_event_normalized");
    assert.equal(annualPayload.runtimeEvent, "annual.subscription.activated");
    assert.equal(annualPayload.payIaiOneVerification.verificationStatus, "SUCCESS");
    assert.equal(annualPayload.runtimeProvisioning.member_state, "annual_active");

    const annualDuplicate = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/webhooks/pay/iai-one", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-pay-timestamp": annualTimestamp,
        "x-pay-signature": annualSignature,
      },
      body: annualWebhookBody,
    }), env);
    assert(annualDuplicate);
    assert.equal(annualDuplicate.status, 200);
    const annualDuplicatePayload = await readJson(annualDuplicate);
    assert.equal(annualDuplicatePayload.status, "duplicate_event_ignored");

    const annualOneTimeWebhookBody = JSON.stringify({
      event_id: "evt_pay_annual_order_smoke_1",
      event_type: "order.captured",
      occurred_at: "2026-04-17T10:03:00.000Z",
      candidate_email: "pay-annual-order@vetuonglai.com",
      order_id: "order_pay_annual_smoke_1",
      amount: 1200000,
      currency: "VND",
      status: "captured",
      intent: "annual-access",
      metadata: {
        entry: "hub",
        source: "purchase-hub",
      },
    });
    const annualOneTimeTimestamp = (Number(annualTimestamp) + 1).toString();
    const annualOneTimeSignature = await signTimestampedPayload(
      annualOneTimeWebhookBody,
      env.PAY_IAI_ONE_WEBHOOK_SECRET,
      annualOneTimeTimestamp,
    );
    const annualOneTimeWebhook = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/webhooks/pay/iai-one", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-pay-timestamp": annualOneTimeTimestamp,
        "x-pay-signature": annualOneTimeSignature,
      },
      body: annualOneTimeWebhookBody,
    }), env);
    assert(annualOneTimeWebhook);
    assert.equal(annualOneTimeWebhook.status, 202);
    const annualOneTimePayload = await readJson(annualOneTimeWebhook);
    assert.equal(annualOneTimePayload.runtimeEvent, "pack.order.captured");
    assert.equal(annualOneTimePayload.runtimeProvisioning.member_state, "annual_active");

    const packWebhookBody = JSON.stringify({
      event_id: "evt_pay_pack_smoke_1",
      event_type: "order.captured",
      occurred_at: "2026-04-17T10:05:00.000Z",
      candidate_email: "pay-pack@vetuonglai.com",
      order_id: "order_pay_smoke_1",
      amount: 990000,
      currency: "VND",
      status: "captured",
      intent: "specialist-pack",
      pack: "g1",
      metadata: {
        entry: "invest",
        source: "pack-card",
      },
    });
    const packTimestamp = (Number(annualTimestamp) + 2).toString();
    const packSignature = await signTimestampedPayload(
      packWebhookBody,
      env.PAY_IAI_ONE_WEBHOOK_SECRET,
      packTimestamp,
    );
    const packWebhook = await maybeHandleAccessRuntime(new Request("https://member.vetuonglai.com/api/access/webhooks/pay/iai-one", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-pay-timestamp": packTimestamp,
        "x-pay-signature": packSignature,
      },
      body: packWebhookBody,
    }), env);
    assert(packWebhook);
    assert.equal(packWebhook.status, 202);
    const packPayload = await readJson(packWebhook);
    assert.equal(packPayload.status, "pack_provisioning_evaluated");
    assert.equal(packPayload.runtimeEvent, "pack.order.captured");
    assert.equal(packPayload.payIaiOneVerification.verificationStatus, "SUCCESS");
    assert.equal(packPayload.runtimeProvisioning.member_state, "pack_owner");
    assert(packPayload.runtimeProvisioning.entitlements.includes("owned_pack_depth"));
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testProviderStatus() {
  const env = {
    VTL_ENV: "production",
    SESSION_COOKIE_SECRET: "session-secret",
    MAGIC_LINK_SIGNING_KEY: "magic-secret",
    PAY_IAI_ONE_BASE_URL: "https://pay.iai.one",
    PAY_IAI_ONE_API_KEY: "pay-api-key",
    PAY_IAI_ONE_WEBHOOK_SECRET: "pay-webhook-secret",
    PAYPAL_CLIENT_ID: "paypal-client-id",
    PAYPAL_CLIENT_SECRET: "paypal-client-secret",
    PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS: "wh-sub",
    PAYPAL_WEBHOOK_ID_ORDERS: "wh-order",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    STRIPE_ANNUAL_ACCESS_CHECKOUT_URL: "https://buy.stripe.com/test-annual-access",
    STRIPE_PACK_CHECKOUT_URLS_JSON: JSON.stringify({
      g1: "https://buy.stripe.com/test-g1",
      g2: "https://buy.stripe.com/test-g2",
      g3: "https://buy.stripe.com/test-g3",
      g4: "https://buy.stripe.com/test-g4",
      g5: "https://buy.stripe.com/test-g5",
      g6: "https://buy.stripe.com/test-g6",
      g7: "https://buy.stripe.com/test-g7",
      g8: "https://buy.stripe.com/test-g8",
      g9: "https://buy.stripe.com/test-g9",
    }),
  };

  const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/provider-status.json"), env);
  assert(response);
  assert.equal(response.status, 200);
  const payload = await readJson(response);
  assert.equal(payload.session.ready, true);
  assert.equal(payload.session.persistenceMode, "memory");
  assert.equal(payload.gateways.annualAccess.pay.productionReady, true);
  assert.equal(payload.gateways.annualAccess.pay.webhookReady, true);
  assert.equal(payload.gateways.annualAccess.stripe.productionReady, true);
  assert.equal(payload.gateways.specialistPacks.pay.productionReady, true);
  assert.equal(payload.gateways.specialistPacks.stripe.configuredPackCount, 9);
  assert.equal(payload.gateways.annualAccess.paypal.webhookReady, true);
  assert.equal(payload.cloudflareTarget.stagedMemberWorkerScript, "vetuonglai-member");
  assert.equal(payload.cloudflareTarget.memberDomainRequiredPublic, true);
  assert.equal(payload.persistence.accessStateStore, "memory");
}

function createMockKvNamespace() {
  const storage = new Map();
  return {
    async get(key) {
      const record = storage.get(key);
      if (!record) return null;
      if (record.expiresAt && record.expiresAt <= Date.now()) {
        storage.delete(key);
        return null;
      }
      return record.value;
    },
    async put(key, value, options = {}) {
      const ttl = Number(options.expirationTtl || 0);
      storage.set(key, {
        value,
        expiresAt: ttl > 0 ? Date.now() + ttl * 1000 : null,
      });
    },
    async delete(key) {
      storage.delete(key);
    },
  };
}

async function testKvPersistenceMode() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
    ACCESS_KV_NAMESPACE: createMockKvNamespace(),
  };

  const requestResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: "kv-smoke@vetuonglai.com",
      entry: "member",
      intent: "annual-access",
      member_state: "pending_member",
      lang: "vi",
      return_to: "/app/",
    }),
  }), env);
  assert(requestResponse);
  assert.equal(requestResponse.status, 202);
  const requestPayload = await readJson(requestResponse);
  assert.equal(requestPayload.storage.mode, "kv");

  const consumedResponse = await maybeHandleAccessRuntime(new Request(requestPayload.magicLink.magicLinkUrl), env);
  assert(consumedResponse);
  assert.equal(consumedResponse.status, 200);

  const providerStatus = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/provider-status.json"), env);
  assert(providerStatus);
  assert.equal(providerStatus.status, 200);
  const providerPayload = await readJson(providerStatus);
  assert.equal(providerPayload.session.persistenceMode, "kv");
  assert.equal(providerPayload.persistence.accessStateStore, "kv");
}

async function testRouteNormalizationAndPolicyBindings() {
  const normalizeResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/route/normalize", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      entry: "edu",
      intent: "course-detail",
      pack: "g999",
      gateway: "payos",
      source: "edu-course-detail",
      slug: "startup-1000",
      return_to: "/course/startup-1000/",
    }),
  }), {});
  assert(normalizeResponse);
  assert.equal(normalizeResponse.status, 200);
  const normalized = await readJson(normalizeResponse);
  assert.equal(normalized.status, "route_normalized");
  assert.equal(normalized.normalized.intent, "specialist-pack");
  assert.equal(normalized.normalized.pack, "g1");
  assert.equal(normalized.normalized.gateway, "pay");
  assert.equal(normalized.normalized.aliasApplied, "course-detail");
  assert(normalized.normalized.warnings.includes("invalid_pack_fallback_to_g1"));

  const bindingsResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/policy-bindings.json"), {});
  assert(bindingsResponse);
  assert.equal(bindingsResponse.status, 200);
  const bindings = await readJson(bindingsResponse);
  assert.equal(bindings.noKeyDrift.team3SourceLocked, true);
  assert(bindings.consumedIdentityStates.includes("pack_owner"));
  assert(bindings.policyToRuntimeEventMap.some((entry) => entry.policyEventKey === "annual_access_confirmed" && entry.runtimeEventKey === "annual.subscription.activated"));
}

async function testWaveDEntryNormalization() {
  // Test all Wave D entries are recognized (not fallback to hub)
  const waveDEntries = ["work", "market", "community", "ai", "business"];

  for (const entryName of waveDEntries) {
    const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/route/normalize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entry: entryName,
        intent: "specialist-pack",
        pack: "g1",
      }),
    }), {});
    assert(response, `Route normalize failed for entry: ${entryName}`);
    assert.equal(response.status, 200, `Expected 200 for entry: ${entryName}`);
    const data = await readJson(response);
    assert.equal(data.normalized.entry, entryName, `Entry ${entryName} should not fallback to hub`);
    assert.equal(data.normalized.intent, "interest");
    assert.equal(data.normalized.pack, "g1");
    assert(data.normalized.warnings.includes("planned_domain_checkout_blocked_downgrade_to_interest"));
  }

  // Test Wave D intent aliases
  const aliasTests = [
    { entry: "community", intent: "community-depth", expectedIntent: "interest" },
    { entry: "ai", intent: "ai-depth", expectedIntent: "interest" },
    { entry: "business", intent: "business-depth", expectedIntent: "interest" },
    { entry: "business", intent: "business-intake", expectedIntent: "interest" },
  ];

  for (const test of aliasTests) {
    const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/route/normalize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entry: test.entry,
        intent: test.intent,
        pack: "g1",
      }),
    }), {});
    assert(response, `Alias test failed for ${test.intent}`);
    assert.equal(response.status, 200);
    const data = await readJson(response);
    assert.equal(data.normalized.intent, test.expectedIntent, `Alias ${test.intent} should resolve to ${test.expectedIntent}`);
    assert.equal(data.normalized.aliasApplied, test.intent, `aliasApplied should be ${test.intent}`);
  }

  // Test planned domain checkout block (T1-1)
  for (const plannedEntry of ["life", "invest", "work", "market", "community", "ai", "business"]) {
    const response = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/checkout/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        candidate_email: `smoke-planned-${plannedEntry}@vetuonglai.com`,
        entry: plannedEntry,
        intent: "specialist-pack",
        pack: "g1",
        gateway: "pay",
      }),
    }), {});
    assert(response, `Planned domain checkout block failed for ${plannedEntry}`);
    assert.equal(response.status, 403, `Checkout for planned domain ${plannedEntry} should return 403`);
    const data = await readJson(response);
    assert.equal(data.status, "checkout_blocked_planned_domain", `Expected checkout_blocked_planned_domain for ${plannedEntry}`);
  }

  // Test interest intent resolves correctly
  const interestResponse = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/route/normalize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      entry: "life",
      intent: "interest",
    }),
  }), {});
  assert(interestResponse);
  assert.equal(interestResponse.status, 200);
  const interestData = await readJson(interestResponse);
  assert.equal(interestData.normalized.intent, "interest");
}

async function testSessionRuntimeContractAndOnboardingGoalPersist() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
  };

  const requested = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      candidate_email: "smoke-goal@vetuonglai.com",
      member_state: "annual_active",
      intent: "annual-access",
      entry: "hub",
    }),
  }), env);
  assert(requested);
  assert.equal(requested.status, 202);
  const requestedBody = await readJson(requested);

  const consumed = await maybeHandleAccessRuntime(new Request(requestedBody.magicLink.magicLinkUrl), env);
  assert(consumed);
  assert.equal(consumed.status, 200);
  const cookie = getCookie(consumed);
  assert(cookie.includes("vtl_session="));

  const saveGoal = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/onboarding/goal", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({
      pathway: "learn",
      selection_method: "smoke_test",
    }),
  }), env);
  assert(saveGoal);
  assert.equal(saveGoal.status, 200);
  const saveGoalBody = await readJson(saveGoal);
  assert.equal(saveGoalBody.status, "onboarding_goal_saved");
  assert.equal(saveGoalBody.selected_goal, "learn");

  const current = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/current", {
    headers: { cookie },
  }), env);
  assert(current);
  assert.equal(current.status, 200);
  const currentBody = await readJson(current);
  assert(currentBody.contract?.refresh_policy?.ttl_seconds > 0);
  assert(Array.isArray(currentBody.contract?.error_codes));
  assert.equal(currentBody.onboarding?.selected_goal, "learn");
  assert.equal(currentBody.onboarding?.pathway_gate?.pathway, "learn");
  assert.equal(currentBody.tier?.id, 2);
}

async function testBookPurchasedCapability() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
    ACCESS_ADMIN_SECRET: "smoke-admin-secret",
  };

  // 1. Issue session via magic link for a fresh candidate
  const requestRes = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      candidate_email: "book-buyer@vetuonglai.com",
      entry: "hub",
      intent: "specialist-pack",
      member_state: "pending_member",
      lang: "vi",
      return_to: "/books/tan-cung-mot-cuoc-song/",
    }),
  }), env);
  assert.equal(requestRes.status, 202);
  const requestPayload = await readJson(requestRes);
  const consumed = await maybeHandleAccessRuntime(new Request(requestPayload.magicLink.magicLinkUrl), env);
  assert.equal(consumed.status, 200);
  const cookie = getCookie(consumed);
  assert(cookie.includes("vtl_session="));

  // 2. Pre-grant: /books/check must return 403 for the unowned book
  const preCheck = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/check?slug=tan-cung-mot-cuoc-song",
    { headers: { cookie } },
  ), env);
  assert.equal(preCheck.status, 403);
  const preCheckBody = await readJson(preCheck);
  assert.equal(preCheckBody.authorized, false);
  assert.equal(preCheckBody.slug, "tan-cung-mot-cuoc-song");

  // 3. Pre-grant: /books/entitlements returns empty owned_books
  const preList = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/entitlements",
    { headers: { cookie } },
  ), env);
  assert.equal(preList.status, 200);
  const preListBody = await readJson(preList);
  assert.deepEqual(preListBody.owned_books, []);
  assert(preListBody.catalog.known_book_slugs.includes("tan-cung-mot-cuoc-song"));

  // 4. Webhook with book_slug in metadata grants entitlement automatically
  const webhook = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      event_id: "evt_book_buy_smoke_1",
      candidate_email: "book-buyer@vetuonglai.com",
      pack_key: "g1",
      metadata: {
        book_slug: "tan-cung-mot-cuoc-song",
        order_id: "order_book_smoke_1",
      },
    }),
  }), env);
  assert.equal(webhook.status, 202);

  // 5. /books/check now returns 200 + authorized
  const postCheck = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/check?slug=tan-cung-mot-cuoc-song",
    { headers: { cookie } },
  ), env);
  assert.equal(postCheck.status, 200);
  const postCheckBody = await readJson(postCheck);
  assert.equal(postCheckBody.authorized, true);
  assert.deepEqual(postCheckBody.owned_books, ["tan-cung-mot-cuoc-song"]);
  assert.equal(postCheckBody.grant?.runtime_event, "pack.order.captured");

  // 6. /session/current surfaces owned_books and book_purchased entitlement
  const current = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/session/current",
    { headers: { cookie } },
  ), env);
  assert.equal(current.status, 200);
  const currentBody = await readJson(current);
  assert.deepEqual(currentBody.owned_books, ["tan-cung-mot-cuoc-song"]);
  assert(currentBody.entitlements.includes("book_purchased"));
  assert.equal(currentBody.contract?.book_check_endpoint, "/api/access/books/check");

  // 7. Unknown book slug yields 422
  const unknownSlug = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/check?slug=unknown-book-xyz",
    { headers: { cookie } },
  ), env);
  assert.equal(unknownSlug.status, 422);
  const unknownBody = await readJson(unknownSlug);
  assert.equal(unknownBody.error_code, "BOOK_SLUG_INVALID");

  // 8. Admin-grant endpoint requires secret + works
  const adminUnauthorized = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/grant",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        candidate_email: "admin-grant@vetuonglai.com",
        book_slug: "tan-cung-mot-cuoc-song",
      }),
    },
  ), env);
  assert.equal(adminUnauthorized.status, 401);

  const adminGrant = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/grant",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-secret": "smoke-admin-secret",
      },
      body: JSON.stringify({
        candidate_email: "admin-grant@vetuonglai.com",
        book_slug: "tan-cung-mot-cuoc-song",
        order_id: "admin_order_1",
        provider: "comp",
      }),
    },
  ), env);
  assert.equal(adminGrant.status, 200);
  const adminGrantBody = await readJson(adminGrant);
  assert.equal(adminGrantBody.ok, true);
  assert.equal(adminGrantBody.slug, "tan-cung-mot-cuoc-song");

  // 9. Refund webhook revokes book entitlement
  const refund = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event_type: "PAYMENT.CAPTURE.REFUNDED",
      event_id: "evt_book_refund_smoke_1",
      candidate_email: "book-buyer@vetuonglai.com",
      metadata: {
        book_slug: "tan-cung-mot-cuoc-song",
      },
    }),
  }), env);
  assert.equal(refund.status, 202);

  const postRefundCheck = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/check?slug=tan-cung-mot-cuoc-song",
    { headers: { cookie } },
  ), env);
  assert.equal(postRefundCheck.status, 403);
  const postRefundBody = await readJson(postRefundCheck);
  assert.equal(postRefundBody.authorized, false);
  assert.deepEqual(postRefundBody.owned_books, []);
}

async function testBookContentEndpoint() {
  const env = {
    VTL_ENV: "development",
    SESSION_COOKIE_SECRET: "smoke-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-magic-secret",
    ACCESS_ADMIN_SECRET: "smoke-admin-secret",
  };

  const slug = "tan-cung-mot-cuoc-song";

  // 1. No session cookie -> 401 book_content_session_missing
  const noCookie = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=chapters`,
  ), env);
  assert.equal(noCookie.status, 401);
  const noCookieBody = await readJson(noCookie);
  assert.equal(noCookieBody.status, "book_content_session_missing");
  assert.equal(noCookieBody.error_code, "SESSION_MISSING_COOKIE");

  // Issue session for a fresh candidate (book content reader)
  const requestRes = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      candidate_email: "book-content-reader@vetuonglai.com",
      entry: "hub",
      intent: "specialist-pack",
      member_state: "pending_member",
      lang: "vi",
      return_to: `/books/${slug}/`,
    }),
  }), env);
  assert.equal(requestRes.status, 202);
  const requestPayload = await readJson(requestRes);
  const consumed = await maybeHandleAccessRuntime(new Request(requestPayload.magicLink.magicLinkUrl), env);
  assert.equal(consumed.status, 200);
  const cookie = getCookie(consumed);
  assert(cookie.includes("vtl_session="));

  // 2. Invalid (empty) slug -> 422 book_slug_invalid
  const emptySlug = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/content?slug=&section=chapters",
    { headers: { cookie } },
  ), env);
  assert.equal(emptySlug.status, 422);
  const emptySlugBody = await readJson(emptySlug);
  assert.equal(emptySlugBody.status, "book_slug_invalid");
  assert.equal(emptySlugBody.error_code, "BOOK_SLUG_INVALID");

  // 3. Unknown slug -> 422 book_slug_invalid (normalizeBookSlug returns "" for unknown)
  const unknownSlug = await maybeHandleAccessRuntime(new Request(
    "https://member.vetuonglai.com/api/access/books/content?slug=no-such-book&section=chapters",
    { headers: { cookie } },
  ), env);
  assert.equal(unknownSlug.status, 422);
  const unknownSlugBody = await readJson(unknownSlug);
  assert.equal(unknownSlugBody.status, "book_slug_invalid");
  assert.equal(unknownSlugBody.error_code, "BOOK_SLUG_INVALID");

  // 4. Valid slug + invalid section -> 422 book_section_invalid
  const badSection = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=garbage`,
    { headers: { cookie } },
  ), env);
  assert.equal(badSection.status, 422);
  const badSectionBody = await readJson(badSection);
  assert.equal(badSectionBody.status, "book_section_invalid");
  assert.equal(badSectionBody.error_code, "BOOK_SECTION_INVALID");

  // 5. Valid slug + valid section but no entitlement -> 403 book_content_forbidden
  const forbidden = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=chapters`,
    { headers: { cookie } },
  ), env);
  assert.equal(forbidden.status, 403);
  const forbiddenBody = await readJson(forbidden);
  assert.equal(forbiddenBody.status, "book_content_forbidden");
  assert.equal(forbiddenBody.error_code, "BOOK_PURCHASED_REQUIRED");

  // Grant entitlement via webhook auto-grant (same pattern as testBookPurchasedCapability)
  const webhook = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      event_id: "evt_book_content_smoke_1",
      candidate_email: "book-content-reader@vetuonglai.com",
      pack_key: "g1",
      metadata: {
        book_slug: slug,
        order_id: "order_book_content_smoke_1",
      },
    }),
  }), env);
  assert.equal(webhook.status, 202);

  // 6. section=chapters -> 200 array length >= 9 with required keys
  const chapters = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=chapters`,
    { headers: { cookie } },
  ), env);
  assert.equal(chapters.status, 200);
  const chaptersBody = await readJson(chapters);
  assert.equal(chaptersBody.status, "book_content_served");
  assert(Array.isArray(chaptersBody.payload));
  assert(chaptersBody.payload.length >= 9);
  for (const chapter of chaptersBody.payload) {
    assert(typeof chapter.n === "number");
    assert(typeof chapter.slug === "string");
    assert(typeof chapter.title_vi === "string");
    assert(typeof chapter.title_en === "string");
    assert(typeof chapter.body_vi === "string");
    assert(typeof chapter.body_en === "string");
  }

  // 7. section=practice -> 200 array length >= 9
  const practice = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=practice`,
    { headers: { cookie } },
  ), env);
  assert.equal(practice.status, 200);
  const practiceBody = await readJson(practice);
  assert.equal(practiceBody.status, "book_content_served");
  assert(Array.isArray(practiceBody.payload));
  assert(practiceBody.payload.length >= 9);

  // 8. section=experience -> 200 object (not null)
  const experience = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=experience`,
    { headers: { cookie } },
  ), env);
  assert.equal(experience.status, 200);
  const experienceBody = await readJson(experience);
  assert.equal(experienceBody.status, "book_content_served");
  assert(experienceBody.payload && typeof experienceBody.payload === "object");

  // 9. section=ai-guide -> 200 object (not null)
  const aiGuide = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=ai-guide`,
    { headers: { cookie } },
  ), env);
  assert.equal(aiGuide.status, 200);
  const aiGuideBody = await readJson(aiGuide);
  assert.equal(aiGuideBody.status, "book_content_served");
  assert(aiGuideBody.payload && typeof aiGuideBody.payload === "object");

  // 10. section=final -> 200 with final_distillation + final_white_page keys
  const finalRes = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=final`,
    { headers: { cookie } },
  ), env);
  assert.equal(finalRes.status, 200);
  const finalBody = await readJson(finalRes);
  assert.equal(finalBody.status, "book_content_served");
  assert(finalBody.payload && typeof finalBody.payload === "object");
  assert("final_distillation" in finalBody.payload);
  assert("final_white_page" in finalBody.payload);

  // 11. section=chapters&chapter=1 -> 200 single chapter object with n=1
  const oneChapter = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=chapters&chapter=1`,
    { headers: { cookie } },
  ), env);
  assert.equal(oneChapter.status, 200);
  const oneChapterBody = await readJson(oneChapter);
  assert.equal(oneChapterBody.status, "book_content_served");
  assert(oneChapterBody.payload && typeof oneChapterBody.payload === "object");
  assert(!Array.isArray(oneChapterBody.payload));
  assert.equal(Number(oneChapterBody.payload.n), 1);

  // 12. section=chapters&chapter=999 -> 404 book_chapter_not_found
  const missingChapter = await maybeHandleAccessRuntime(new Request(
    `https://member.vetuonglai.com/api/access/books/content?slug=${slug}&section=chapters&chapter=999`,
    { headers: { cookie } },
  ), env);
  assert.equal(missingChapter.status, 404);
  const missingChapterBody = await readJson(missingChapter);
  assert.equal(missingChapterBody.status, "book_chapter_not_found");
  assert.equal(missingChapterBody.error_code, "BOOK_CHAPTER_NOT_FOUND");
}

async function main() {
  await testSessionFlow();
  await testFreeAccountFromHomepage();
  await testOnboardingGoalPersistence();
  await testBypassAndDedupe();
  await testRuntimeStateSyncAfterPurchase();
  await testPostbackVerification();
  await testCheckoutResolveAndStripeWebhook();
  await testPayIaiOneCheckoutAndWebhook();
  await testProviderStatus();
  await testKvPersistenceMode();
  await testRouteNormalizationAndPolicyBindings();
  await testWaveDEntryNormalization();
  await testSessionRuntimeContractAndOnboardingGoalPersist();
  await testBookPurchasedCapability();
  await testBookContentEndpoint();
  console.log("smoke-access-runtime: ok");
}

main().catch((error) => {
  console.error("smoke-access-runtime: failed");
  console.error(error);
  process.exitCode = 1;
});
