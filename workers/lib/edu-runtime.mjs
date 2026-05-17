import { createAccessStore } from "./access-state.mjs";

const EDU_BASE = "/api/edu";
const WALLET_API = "/api/wallet/credit";
const COURSE_COMPLETION_REWARD_VND = 100;

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers,
  });
}

function getEnvString(env, key) {
  const value = env?.[key];
  return typeof value === "string" ? value : "";
}

function currentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

async function readRequestJson(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function eduStore(env) {
  return createAccessStore(env);
}

async function readSessionFromRequest(request, env) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const token = cookies["vtl_session"] || "";
  if (!token) return null;

  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  const [encodedPayload, signature] = String(token).split(".");
  if (!encodedPayload || !signature) return null;

  const expected = await signValueHex(sessionSecret, encodedPayload);
  if (!timingSafeEqual(expected, signature)) return null;

  let payload = null;
  try {
    payload = safeJsonParse(new TextDecoder().decode(decodeBase64Url(encodedPayload)), null);
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  if (payload.exp && Number(payload.exp) < currentUnixSeconds()) return null;
  return payload;
}

function parseCookies(headerValue = "") {
  const entries = String(headerValue || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf("=");
      return index === -1 ? [part, ""] : [part.slice(0, index), part.slice(index + 1)];
    });
  return Object.fromEntries(entries);
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function decodeBase64Url(value) {
  const normalized = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signValueHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

function isValidEmail(value) {
  const raw = String(value || "").trim();
  if (raw.length < 3 || raw.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

async function awardCourseCompletion(env, candidateEmail, courseId, courseTitle) {
  try {
    const walletToken = getEnvString(env, "WALLET_INTERNAL_TOKEN");
    if (!walletToken) {
      return {
        ok: false,
        error: "wallet_token_missing",
        detail: "WALLET_INTERNAL_TOKEN not configured",
      };
    }

    const url = new URL(env.WORKER_URL || "http://localhost:8787");
    url.pathname = WALLET_API;

    const creditRequest = {
      candidate_email: candidateEmail,
      amount_vnd: COURSE_COMPLETION_REWARD_VND,
      source: "course_completion",
      ref: courseId,
      memo: `Course completion reward for: ${courseTitle}`,
    };

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wallet-internal-token": walletToken,
      },
      body: JSON.stringify(creditRequest),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: errorBody.status || "credit_failed",
        detail: errorBody.detail || "Failed to award wallet credit",
        status: response.status,
      };
    }

    const result = await response.json();
    return {
      ok: true,
      wallet: result.wallet,
      ledger_entry: result.ledger_entry,
      credit_awarded_vnd: COURSE_COMPLETION_REWARD_VND,
    };
  } catch (err) {
    return {
      ok: false,
      error: "credit_request_failed",
      detail: String(err?.message || err),
    };
  }
}

async function handleCourseCompletion(request, env) {
  const input = await readRequestJson(request);

  // Validate required fields
  const courseId = String(input.course_id || "").trim();
  const courseTitle = String(input.course_title || "").trim();
  const candidateEmail = String(input.candidate_email || "").trim();

  if (!courseId || !courseTitle || !candidateEmail) {
    return jsonResponse(
      {
        status: "invalid_request",
        detail: "Missing required fields: course_id, course_title, candidate_email",
      },
      { status: 422 }
    );
  }

  if (!isValidEmail(candidateEmail)) {
    return jsonResponse(
      {
        status: "invalid_email",
        detail: "candidate_email is not a valid email address",
      },
      { status: 422 }
    );
  }

  // Store course completion record
  const store = eduStore(env);
  const completionRecord = {
    course_id: courseId,
    course_title: courseTitle,
    candidate_email: candidateEmail,
    completed_at: currentUnixSeconds(),
    wallet_credit_attempted: false,
    wallet_credit_result: null,
  };

  // Award wallet credit
  const creditResult = await awardCourseCompletion(env, candidateEmail, courseId, courseTitle);

  completionRecord.wallet_credit_attempted = true;
  completionRecord.wallet_credit_result = creditResult;

  // Store the completion record
  const recordKey = `${courseId}:${candidateEmail}`;
  await store.put("edu_completions", recordKey, completionRecord);

  // Return response with credit status
  if (creditResult.ok) {
    return jsonResponse(
      {
        status: "course_completed_with_credit",
        course_id: courseId,
        candidate_email: candidateEmail,
        wallet: creditResult.wallet,
        credit_awarded_vnd: creditResult.credit_awarded_vnd,
        ledger_entry: creditResult.ledger_entry,
      },
      { status: 200 }
    );
  } else {
    return jsonResponse(
      {
        status: "course_completed_credit_failed",
        course_id: courseId,
        candidate_email: candidateEmail,
        credit_error: creditResult.error,
        credit_detail: creditResult.detail,
      },
      { status: 200 }
    );
  }
}

async function handleCourseCompletionStatus(request, env) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get("course_id");
  const candidateEmail = url.searchParams.get("candidate_email");

  if (!courseId || !candidateEmail) {
    return jsonResponse(
      {
        status: "invalid_request",
        detail: "Missing query parameters: course_id, candidate_email",
      },
      { status: 422 }
    );
  }

  const store = eduStore(env);
  const recordKey = `${courseId}:${candidateEmail}`;
  const record = await store.get("edu_completions", recordKey);

  if (!record) {
    return jsonResponse(
      {
        status: "completion_not_found",
        course_id: courseId,
        candidate_email: candidateEmail,
      },
      { status: 404 }
    );
  }

  return jsonResponse(
    {
      status: "completion_found",
      completion: record,
    },
    { status: 200 }
  );
}

export async function maybeHandleEduRuntime(request, env) {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname === `${EDU_BASE}/course-completion`) {
    return handleCourseCompletion(request, env);
  }

  if (request.method === "GET" && url.pathname === `${EDU_BASE}/course-completion-status`) {
    return handleCourseCompletionStatus(request, env);
  }

  return null;
}
