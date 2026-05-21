import { maybeHandleAccessRuntime } from "./lib/access-runtime.mjs";
import { maybeHandleFounderRuntime } from "./lib/founder-runtime.mjs";
import { maybeHandleWalletRuntime } from "./lib/wallet-runtime.mjs";
import { maybeHandleCommunityRuntime } from "./lib/community-runtime.mjs";
import { maybeHandleJobsRuntime } from "./lib/jobs-runtime.mjs";
import { maybeHandleAffiliateRuntime } from "./lib/affiliate-runtime.mjs";
import { maybeHandleAnalyticsRuntime } from "./lib/analytics-runtime.mjs";
import { maybeHandleNotifyRuntime } from "./lib/notify-runtime.mjs";
import { maybeHandleAdminCmsRuntime } from "./lib/admin-cms-runtime.mjs";
import businessDomainContract from "../src/data/business-domain-contract.json" with { type: "json" };
import packageComparisonDemoOutput from "../src/data/package-comparison-demo-output.json" with { type: "json" };
import packageFormRegistry from "../src/data/package-form-registry.json" with { type: "json" };
import emailFormRegistry from "../src/data/email-form-registry.json" with { type: "json" };
import kidsCurriculum from "../src/data/kids-curriculum.json" with { type: "json" };
import kidsApiContract from "../src/data/kids-api-contract.json" with { type: "json" };

const TEAM4_ALLOWED_HOSTS = new Set([
  "vetuonglai.com",
  "www.vetuonglai.com",
  "member.vetuonglai.com",
  "www.member.vetuonglai.com",
]);

const TEAM4_ENDPOINT_PAYLOADS = new Map([
  ["/api/team4/package-form-registry.json", packageFormRegistry],
  ["/api/team4/business-domain-contract.json", businessDomainContract],
  ["/api/team4/package-comparison-demo-output.json", packageComparisonDemoOutput],
]);

const EMAIL_FORM_ALLOWED_HOSTS = new Set(emailFormRegistry.allowedHosts || []);
const EMAIL_FORM_ENDPOINTS = new Set([
  "/api/email/forms/submit",
  "/api/email/forms/submit/",
]);
const EMAIL_FORM_REGISTRY_PATHS = new Set([
  "/api/email/forms/registry.json",
  "/api/email/forms/registry",
]);
const EMAIL_PURPOSE_ROUTES = new Map(
  (emailFormRegistry.purposeRoutes || []).map((route) => [route.key, route]),
);

const KIDS_ALLOWED_HOSTS = new Set([
  "kids.vetuonglai.com",
  "www.kids.vetuonglai.com",
]);

function isKidsHost(hostname) {
  if (KIDS_ALLOWED_HOSTS.has(hostname)) return true;
  // Cloudflare Workers preview URL: <scriptname>.<account>.workers.dev.
  // The kids worker's scriptName is "vetuonglai-kids", so any host whose
  // first label is exactly that under workers.dev is a preview address
  // for this same worker. Allowing it lets the team review dev builds
  // before DNS / route binding is in place.
  if (hostname.endsWith(".workers.dev") && hostname.startsWith("vetuonglai-kids.")) return true;
  return false;
}

const KIDS_ENDPOINT_PAYLOADS = new Map([
  ["/api/kids/curriculum.json", kidsCurriculum],
  ["/api/kids/contract.json", kidsApiContract],
]);

const KIDS_SAFETY_HEADERS = {
  "x-robots-tag": "noindex, nofollow, noarchive",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-child-safe-zone": "kids.vetuonglai.com",
};

function buildKidsRoutePatterns(contract) {
  const patterns = [];
  for (const endpoint of contract?.endpoints || []) {
    if (!endpoint?.path || !endpoint?.method) continue;
    const segments = String(endpoint.path).split("/").filter(Boolean);
    const params = [];
    const regexParts = segments.map((segment) => {
      if (segment.startsWith(":")) {
        params.push(segment.slice(1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    const regex = new RegExp("^/" + regexParts.join("/") + "/?$");
    patterns.push({ endpoint, regex, params });
  }
  return patterns;
}

const KIDS_API_ROUTES = buildKidsRoutePatterns(kidsApiContract);

function maybeHandleKidsApiStub(request, url) {
  if (!url.pathname.startsWith("/api/kids/")) return null;
  if (!isKidsHost(url.hostname)) return null;

  for (const route of KIDS_API_ROUTES) {
    const match = url.pathname.match(route.regex);
    if (!match) continue;
    if (request.method.toUpperCase() !== String(route.endpoint.method).toUpperCase()) continue;

    const params = {};
    route.params.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    const body = {
      error: {
        code: "NOT_IMPLEMENTED",
        stage: "stub",
        message: "kids API is in Member Preview. Backend implementation is gated by child-safety review.",
        contractVersion: kidsApiContract.version,
        endpoint: {
          id: route.endpoint.id,
          method: route.endpoint.method,
          path: route.endpoint.path,
          summary: route.endpoint.summary,
          request: route.endpoint.request,
          response: route.endpoint.response,
          childSafety: route.endpoint.childSafety || [],
        },
        params,
      },
    };

    return jsonResponse(body, {
      status: 501,
      headers: {
        "cache-control": "no-store",
        ...KIDS_SAFETY_HEADERS,
      },
    });
  }

  return null;
}

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers,
  });
}

function isEmailFormHost(hostname) {
  if (EMAIL_FORM_ALLOWED_HOSTS.has(hostname)) return true;
  if (hostname.endsWith(".workers.dev") && hostname.startsWith("vetuonglai-home.")) return true;
  return false;
}

function textResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "text/plain; charset=utf-8");
  return new Response(body, {
    ...init,
    headers,
  });
}

function normalizeText(value, maxLength = 2000) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeText(value, 320).toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readEmailFormPayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const formData = await request.formData();
  const payload = {};
  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : value.name;
  }
  return payload;
}

function renderTemplate(template = "", values = {}) {
  return String(template).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return String(values[key] ?? "");
  });
}

function resolveMailApiSendUrl(env) {
  const base = String(env.MAIL_API_BASE_URL || emailFormRegistry.mailApiContract?.canonicalBaseUrl || "").replace(/\/+$/, "");
  if (!base) return "";
  const path = String(emailFormRegistry.mailApiContract?.sendPath || "/send");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function sendMailApiMessage(env, message, requestId) {
  const missing = [];
  if (!env.MAIL_API_BASE_URL) missing.push("MAIL_API_BASE_URL");
  if (!env.MAIL_API_KEY) missing.push("MAIL_API_KEY");
  if (!env.MAIL_API_WORKSPACE_ID) missing.push("MAIL_API_WORKSPACE_ID");

  if (missing.length > 0) {
    return {
      attempted: false,
      accepted: false,
      status: "missing_runtime",
      missing_env: missing,
    };
  }

  const response = await fetch(resolveMailApiSendUrl(env), {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.MAIL_API_KEY}`,
      "content-type": "application/json",
      "x-workspace-id": env.MAIL_API_WORKSPACE_ID,
      "x-request-id": requestId,
    },
    body: JSON.stringify({ ...message, message_idempotency_key: requestId }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = { raw: await response.text().catch(() => "") };
  }

  const messageId = payload?.message_id || payload?.id || payload?.messageId || null;
  return {
    attempted: true,
    accepted: response.status >= 200 && response.status < 300,
    status: response.status,
    message_id: messageId,
    provider_response: payload,
  };
}

async function maybeStoreEmailSubmission(env, submission) {
  const store = env.EMAIL_FORM_KV || env.ACCESS_KV_NAMESPACE;
  if (!store || typeof store.put !== "function") {
    return { stored: false, reason: "kv_binding_missing" };
  }

  await store.put(`email_form:${submission.submission_id}`, JSON.stringify(submission), {
    expirationTtl: 60 * 60 * 24 * 180,
  });
  return { stored: true, key: `email_form:${submission.submission_id}` };
}

function buildEmailMessages({ submission, route, locale }) {
  const templates = emailFormRegistry.templates || {};
  const internal = templates.internalNotification || {};
  const acknowledgement = templates.submitterAcknowledgement || {};
  const language = locale === "en" ? "en" : "vi";
  const values = {
    ...submission,
    purpose_label: route?.[language === "en" ? "labelEn" : "labelVi"] || route?.key || "general",
  };
  const from = emailFormRegistry.senderPolicy?.from || "noreply@vetuonglai.com";
  const bcc = normalizeEmail(submission.audit_bcc);

  const internalMessage = {
    from,
    to: route?.to || "support@vetuonglai.com",
    reply_to: submission.email,
    subject: renderTemplate(internal.subject?.[language] || internal.subject?.vi || "New Vetuonglai request", values),
    text: renderTemplate(internal.bodyText?.[language] || internal.bodyText?.vi || "", values),
    tags: ["vetuonglai", "form", route?.key || "general", "internal"],
    metadata: {
      submission_id: submission.submission_id,
      form_key: submission.form_key,
      purpose: route?.key || "general",
      source: submission.source,
      page_url: submission.page_url,
    },
  };

  if (bcc) internalMessage.bcc = bcc;

  const acknowledgementMessage = {
    from,
    to: submission.email,
    reply_to: route?.to || "support@vetuonglai.com",
    subject: renderTemplate(acknowledgement.subject?.[language] || acknowledgement.subject?.vi || "Vetuonglai received your request", values),
    text: renderTemplate(acknowledgement.bodyText?.[language] || acknowledgement.bodyText?.vi || "", values),
    tags: ["vetuonglai", "form", route?.key || "general", "acknowledgement"],
    metadata: {
      submission_id: submission.submission_id,
      form_key: submission.form_key,
      purpose: route?.key || "general",
      source: submission.source,
      page_url: submission.page_url,
    },
  };

  if (bcc) acknowledgementMessage.bcc = bcc;

  return { internalMessage, acknowledgementMessage };
}

async function maybeHandleEmailForms(request, env) {
  const url = new URL(request.url);
  if (!isEmailFormHost(url.hostname)) return null;

  if (EMAIL_FORM_REGISTRY_PATHS.has(url.pathname)) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return textResponse("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }
    return jsonResponse(emailFormRegistry, {
      headers: { "cache-control": "public, max-age=60" },
    });
  }

  if (!EMAIL_FORM_ENDPOINTS.has(url.pathname)) return null;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": url.origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }

  if (request.method !== "POST") {
    return textResponse("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST, OPTIONS" },
    });
  }

  let payload;
  try {
    payload = await readEmailFormPayload(request);
  } catch {
    return jsonResponse({ ok: false, code: "INVALID_PAYLOAD", message: "Request payload is not valid." }, { status: 400 });
  }

  const form = (emailFormRegistry.forms || [])[0] || {};
  const honeypot = normalizeText(payload[form.honeypotField || "company_website"], 300);
  if (honeypot) {
    return jsonResponse({
      ok: true,
      status: "accepted",
      submission_id: `vtl_ignored_${crypto.randomUUID()}`,
    }, { status: 202 });
  }

  const formKey = normalizeText(payload.form_key || payload.formKey || form.formKey, 120);
  const purposeKey = normalizeText(payload.purpose || "general", 80);
  const route = EMAIL_PURPOSE_ROUTES.get(purposeKey) || EMAIL_PURPOSE_ROUTES.get("general");
  const name = normalizeText(payload.name, 160);
  const email = normalizeEmail(payload.email);
  const phone = normalizeText(payload.phone, 80);
  const message = normalizeText(payload.message, 5000);
  const source = normalizeText(payload.source || url.searchParams.get("source") || "hub_contact", 120);
  const pageUrl = normalizeText(payload.page_url || payload.pageUrl || request.headers.get("referer") || "", 600);
  const locale = normalizeText(payload.locale || payload.lang || "vi", 8) === "en" ? "en" : "vi";
  const auditBcc = normalizeEmail(env.VTL_EMAIL_AUDIT_BCC || "");

  const errors = [];
  if (!formKey || formKey !== form.formKey) errors.push("form_key");
  if (!name) errors.push("name");
  if (!isValidEmail(email)) errors.push("email");
  if (!message || message.length < 8) errors.push("message");

  if (errors.length > 0) {
    return jsonResponse({
      ok: false,
      code: "VALIDATION_FAILED",
      invalid_fields: errors,
    }, { status: 400 });
  }

  const submission = {
    submission_id: `vtl_form_${crypto.randomUUID()}`,
    form_key: formKey,
    purpose: route?.key || "general",
    name,
    email,
    phone,
    message,
    source,
    page_url: pageUrl,
    locale,
    host: url.hostname,
    audit_bcc: auditBcc,
    created_at: new Date().toISOString(),
    registry_version: emailFormRegistry.version,
  };

  const storage = await maybeStoreEmailSubmission(env, submission);
  const { internalMessage, acknowledgementMessage } = buildEmailMessages({ submission, route, locale });
  const internalDelivery = await sendMailApiMessage(env, internalMessage, `${submission.submission_id}:internal`);
  const ackDelivery = await sendMailApiMessage(env, acknowledgementMessage, `${submission.submission_id}:ack`);
  const accepted = internalDelivery.accepted && ackDelivery.accepted;

  return jsonResponse({
    ok: true,
    status: accepted ? "submitted_and_email_handoff_accepted" : "queued_without_delivery",
    submission_id: submission.submission_id,
    route: {
      purpose: route?.key || "general",
      sla: route?.[locale === "en" ? "slaEn" : "slaVi"] || "",
    },
    storage,
    delivery: {
      internal: {
        attempted: internalDelivery.attempted,
        accepted: internalDelivery.accepted,
        status: internalDelivery.status,
        message_id: internalDelivery.message_id || null,
        missing_env: internalDelivery.missing_env || [],
      },
      acknowledgement: {
        attempted: ackDelivery.attempted,
        accepted: ackDelivery.accepted,
        status: ackDelivery.status,
        message_id: ackDelivery.message_id || null,
        missing_env: ackDelivery.missing_env || [],
      },
    },
  }, {
    status: 202,
    headers: {
      "cache-control": "no-store",
      "access-control-allow-origin": url.origin,
    },
  });
}

function maybeHandleTeam4Contracts(request) {
  const url = new URL(request.url);
  if (!TEAM4_ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }

  const payload = TEAM4_ENDPOINT_PAYLOADS.get(url.pathname);
  if (!payload) {
    return null;
  }

  return jsonResponse(payload, {
    headers: {
      "cache-control": "public, max-age=60",
    },
  });
}

function maybeHandleKidsRuntime(request) {
  const url = new URL(request.url);
  if (!isKidsHost(url.hostname)) {
    return null;
  }

  const payload = KIDS_ENDPOINT_PAYLOADS.get(url.pathname);
  if (payload) {
    return jsonResponse(payload, {
      headers: {
        "cache-control": "public, max-age=60",
        ...KIDS_SAFETY_HEADERS,
      },
    });
  }

  const stub = maybeHandleKidsApiStub(request, url);
  if (stub) return stub;

  return null;
}

// ─── Google OAuth handler ────────────────────────────────────────────────────

const GOOGLE_OAUTH_ALLOWED_HOSTS = new Set([
  "vetuonglai.com",
  "www.vetuonglai.com",
]);

const SESSION_COOKIE_NAME_GOOGLE = "vtl_session";
const SESSION_TTL_SECONDS_GOOGLE = 30 * 24 * 60 * 60;
const GOOGLE_OAUTH_STATE_TTL_SECONDS = 10 * 60;
const GOOGLE_OAUTH_CALLBACK_URI = "https://vetuonglai.com/api/auth/google/callback";
const GOOGLE_OAUTH_DASHBOARD_REDIRECT = "https://member.vetuonglai.com/app/dashboard/";
const COOKIE_DOMAIN_GOOGLE = ".vetuonglai.com";

function toBase64UrlGoogle(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function signTokenGoogle(secret, payload) {
  const payloadString = JSON.stringify(payload);
  const encodedPayload = toBase64UrlGoogle(new TextEncoder().encode(payloadString));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  const sigHex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${encodedPayload}.${sigHex}`;
}

async function maybeHandleGoogleOAuth(request, env) {
  const url = new URL(request.url);
  if (!GOOGLE_OAUTH_ALLOWED_HOSTS.has(url.hostname)) return null;
  if (!url.pathname.startsWith("/api/auth/google/")) return null;

  const clientId = env.GOOGLE_CLIENT_ID || "";
  const clientSecret = env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = env.GOOGLE_REDIRECT_URI || GOOGLE_OAUTH_CALLBACK_URI;
  const sessionSecret = (typeof env.SESSION_COOKIE_SECRET === "string" && env.SESSION_COOKIE_SECRET)
    ? env.SESSION_COOKIE_SECRET
    : "debug-session-secret";
  const kvStore = env.ACCESS_KV_NAMESPACE;

  // ── /api/auth/google/start ──────────────────────────────────────────────
  if (url.pathname === "/api/auth/google/start" || url.pathname === "/api/auth/google/start/") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Generate a random CSRF state token
    const stateBytes = crypto.getRandomValues(new Uint8Array(24));
    const state = toBase64UrlGoogle(stateBytes);

    // Store state in KV for later verification (best-effort)
    if (kvStore && typeof kvStore.put === "function") {
      await kvStore.put(`google_oauth_state:${state}`, "1", {
        expirationTtl: GOOGLE_OAUTH_STATE_TTL_SECONDS,
      }).catch(() => {});
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("access_type", "online");

    return Response.redirect(authUrl.toString(), 302);
  }

  // ── /api/auth/google/callback ───────────────────────────────────────────
  if (url.pathname === "/api/auth/google/callback" || url.pathname === "/api/auth/google/callback/") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const code = url.searchParams.get("code") || "";
    const state = url.searchParams.get("state") || "";
    const errorParam = url.searchParams.get("error") || "";

    if (errorParam) {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_denied", 302);
    }

    if (!code) {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_no_code", 302);
    }

    // Optional: verify CSRF state from KV
    if (state && kvStore && typeof kvStore.get === "function") {
      const storedState = await kvStore.get(`google_oauth_state:${state}`).catch(() => null);
      if (!storedState) {
        return Response.redirect("https://member.vetuonglai.com/signup/?error=google_state_invalid", 302);
      }
      // Consume state token
      await kvStore.delete(`google_oauth_state:${state}`).catch(() => {});
    }

    // Exchange code for tokens
    let tokenResponse;
    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
      tokenResponse = await tokenRes.json();
    } catch {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_token_exchange_failed", 302);
    }

    const accessToken = tokenResponse?.access_token || "";
    if (!accessToken) {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_no_access_token", 302);
    }

    // Fetch user info
    let userInfo;
    try {
      const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { "authorization": `Bearer ${accessToken}` },
      });
      userInfo = await userRes.json();
    } catch {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_userinfo_failed", 302);
    }

    const email = String(userInfo?.email || "").trim().toLowerCase();
    const name = String(userInfo?.name || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.redirect("https://member.vetuonglai.com/signup/?error=google_no_email", 302);
    }

    // Build session payload matching access-runtime.mjs format
    const nowSeconds = Math.floor(Date.now() / 1000);
    const sessionPayload = {
      candidate_email: email,
      member_state: "pending_member",
      annual_access_status: "none",
      pack_key: "",
      owned_packs: [],
      entitlements: [],
      entry: "hub",
      lang: "vi",
      return_to: "/",
      created_from: "google_oauth",
      google_name: name,
      exp: nowSeconds + SESSION_TTL_SECONDS_GOOGLE,
    };

    const sessionToken = await signTokenGoogle(sessionSecret, sessionPayload);

    // Upsert user record in KV (best-effort, matches pending_members pattern)
    if (kvStore && typeof kvStore.put === "function") {
      await kvStore.put(
        `pending_members:${email}`,
        JSON.stringify({
          candidate_email: email,
          member_state: "pending_member",
          provider: "google",
          google_name: name,
          last_google_login_at: nowSeconds,
        }),
        { expirationTtl: SESSION_TTL_SECONDS_GOOGLE },
      ).catch(() => {});
    }

    const cookieDomainGoogle = (typeof env.SESSION_COOKIE_DOMAIN === "string" && env.SESSION_COOKIE_DOMAIN)
      ? env.SESSION_COOKIE_DOMAIN
      : COOKIE_DOMAIN_GOOGLE;
    const cookieValue = `${SESSION_COOKIE_NAME_GOOGLE}=${sessionToken}; Path=/; Domain=${cookieDomainGoogle}; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS_GOOGLE}`;

    return new Response(null, {
      status: 302,
      headers: {
        location: GOOGLE_OAUTH_DASHBOARD_REDIRECT,
        "set-cookie": cookieValue,
      },
    });
  }

  return null;
}

// ─── End Google OAuth handler ─────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const googleOAuthResponse = await maybeHandleGoogleOAuth(request, env);
    if (googleOAuthResponse) {
      return googleOAuthResponse;
    }

    const emailFormResponse = await maybeHandleEmailForms(request, env);
    if (emailFormResponse) {
      return emailFormResponse;
    }

    const kidsResponse = maybeHandleKidsRuntime(request);
    if (kidsResponse) {
      return kidsResponse;
    }

    const team4Response = maybeHandleTeam4Contracts(request);
    if (team4Response) {
      return team4Response;
    }

    const founderResponse = await maybeHandleFounderRuntime(request, env);
    if (founderResponse) {
      return founderResponse;
    }

    const accessResponse = await maybeHandleAccessRuntime(request, env);
    if (accessResponse) {
      return accessResponse;
    }

    const walletResponse = await maybeHandleWalletRuntime(request, env);
    if (walletResponse) {
      return walletResponse;
    }

    const communityResponse = await maybeHandleCommunityRuntime(request, env);
    if (communityResponse) return communityResponse;

    const jobsResponse = await maybeHandleJobsRuntime(request, env);
    if (jobsResponse) return jobsResponse;

    const affiliateResponse = await maybeHandleAffiliateRuntime(request, env);
    if (affiliateResponse) return affiliateResponse;

    const analyticsResponse = await maybeHandleAnalyticsRuntime(request, env);
    if (analyticsResponse) return analyticsResponse;

    const notifyResponse = await maybeHandleNotifyRuntime(request, env);
    if (notifyResponse) return notifyResponse;

    const adminCmsResponse = await maybeHandleAdminCmsRuntime(request, env);
    if (adminCmsResponse) return adminCmsResponse;

    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      JSON.stringify({
        status: "assets_binding_missing",
        detail: "ASSETS binding is not configured for this worker.",
        path: new URL(request.url).pathname,
      }, null, 2),
      {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    );
  },
};
