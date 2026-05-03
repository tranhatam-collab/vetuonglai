import accessModel from "../../src/data/access-model.json" with { type: "json" };
import courses from "../../src/data/courses.json" with { type: "json" };
import packageFormRegistry from "../../src/data/package-form-registry.json" with { type: "json" };
import productStrategyRegistry from "../../src/data/product-strategy-registry.json" with { type: "json" };
import team3PolicyMatrix from "../../src/data/team3-policy-matrix.json" with { type: "json" };
import runtimeTruth from "../../cloudflare/domain-runtime-truth.json" with { type: "json" };
import readBooksRegistry from "../../src/data/read-books.json" with { type: "json" };
import { createAccessStore } from "./access-state.mjs";

const ACCESS_BASE = "/api/access";
const SESSION_COOKIE_NAME = "vtl_session";
const MAGIC_LINK_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const SESSION_REFRESH_THRESHOLD_SECONDS = 24 * 60 * 60;
const DEFAULT_COOKIE_DOMAIN = ".vetuonglai.com";
const DEFAULT_MEMBER_SCRIPT = "vetuonglai-member";
const FREE_ACCOUNT_HOSTS = new Set(["vetuonglai.com", "www.vetuonglai.com"]);

const routeContract = accessModel.routeContract || {};
const intentAliases = routeContract.intentAliases || {};
const gatewayAliases = routeContract.gatewayAliases || {};
const validEntries = new Set(routeContract.queryParams?.find((entry) => entry.name === "entry")?.values || []);
const validPacks = new Set(routeContract.queryParams?.find((entry) => entry.name === "pack")?.values || []);
const validGateways = new Set(routeContract.queryParams?.find((entry) => entry.name === "gateway")?.values || []);
const validLangs = new Set(routeContract.queryParams?.find((entry) => entry.name === "lang")?.values || ["vi", "en"]);
const knownIdentityStates = new Map((accessModel.identityStates || []).map((entry) => [entry.key, entry]));
const knownEntitlements = Array.isArray(accessModel.entitlements) ? accessModel.entitlements : [];
const runtimeEvents = Array.from(new Set((accessModel.webhookEvents || []).filter(Boolean)));
const knownCourseSlugs = new Set((courses || []).map((entry) => String(entry?.slug || "")).filter(Boolean));
const submissionWorkflow = accessModel.submissionWorkflow || {};
const workflowSubmissionTypes = Array.isArray(submissionWorkflow.submissionTypes)
  ? submissionWorkflow.submissionTypes
  : [];
const workflowSubmissionTypeKeys = new Set(workflowSubmissionTypes.map((entry) => String(entry?.key || "")).filter(Boolean));
const workflowReviewDecisions = new Set(
  Array.isArray(submissionWorkflow.reviewDecisions)
    ? submissionWorkflow.reviewDecisions.map((entry) => String(entry || ""))
    : ["reviewing", "approved", "rejected"],
);
const workflowReviewerStates = new Set(
  Array.isArray(submissionWorkflow.reviewerStates)
    ? submissionWorkflow.reviewerStates.map((entry) => String(entry || ""))
    : ["program_user", "partner"],
);
const workflowRequiredApprovedSubmissions = Array.isArray(submissionWorkflow.vcCandidateRules?.requiredApprovedSubmissions)
  ? submissionWorkflow.vcCandidateRules.requiredApprovedSubmissions.map((entry) => String(entry || ""))
  : ["action_proof", "project_output", "reflection"];
const subdomainFormRegistry = Array.isArray(packageFormRegistry.subdomainFormRegistry)
  ? packageFormRegistry.subdomainFormRegistry
  : [];
const memberSurfaceContract = subdomainFormRegistry.find((entry) => entry.surfaceKey === "member") || null;
const pathwayIds = new Set(((productStrategyRegistry.pathways?.items) || []).map((entry) => String(entry.id || "")).filter(Boolean));
const knownBookSlugs = new Set(
  (Array.isArray(readBooksRegistry?.books) ? readBooksRegistry.books : [])
    .map((entry) => String(entry?.slug || "").trim().toLowerCase())
    .filter(Boolean),
);

const plannedDomains = new Set(
  (runtimeTruth.domains || [])
    .filter((d) => d.status === "planned_public" || d.status === "planned")
    .map((d) => {
      const host = String(d.host || "");
      const dot = host.indexOf(".");
      return dot > 0 ? host.substring(0, dot).toLowerCase() : "";
    })
    .filter(Boolean),
);

const runtimeState = globalThis.__vtlAccessRuntimeState || {
  auditNonce: 0,
};
globalThis.__vtlAccessRuntimeState = runtimeState;

const PAYPAL_EVENT_MAP = {
  "BILLING.SUBSCRIPTION.ACTIVATED": "annual.subscription.activated",
  "BILLING.SUBSCRIPTION.RE-ACTIVATED": "annual.subscription.activated",
  "PAYMENT.SALE.COMPLETED": "annual.subscription.renewed",
  "PAYMENT.CAPTURE.COMPLETED": "pack.order.captured",
  "PAYMENT.CAPTURE.REFUNDED": "pack.order.refunded",
  "BILLING.SUBSCRIPTION.CANCELLED": "annual.subscription.cancelled",
  "BILLING.SUBSCRIPTION.SUSPENDED": "annual.subscription.past_due",
};

const STRIPE_EVENT_MAP = {
  "checkout.session.completed:subscription": "annual.subscription.activated",
  "invoice.paid": "annual.subscription.renewed",
  "invoice.payment_failed": "annual.subscription.past_due",
  "customer.subscription.deleted": "annual.subscription.cancelled",
  "checkout.session.completed:payment": "pack.order.captured",
  "charge.refunded": "pack.order.refunded",
};

const PAY_IAI_ONE_EVENT_MAP = {
  "subscription.activated": "annual.subscription.activated",
  "subscription.renewed": "annual.subscription.renewed",
  "subscription.past_due": "annual.subscription.past_due",
  "subscription.cancelled": "annual.subscription.cancelled",
  "order.captured": "pack.order.captured",
  "order.refunded": "pack.order.refunded",
};

const DEFAULT_PAY_IAI_ONE_BASE_URL = "https://pay.iai.one";

const policyToRuntimeEventMap = [
  { policyEventKey: "annual_access_confirmed", runtimeEventKey: "annual.subscription.activated" },
  { policyEventKey: "specialist_pack_purchased", runtimeEventKey: "pack.order.captured" },
  { policyEventKey: "affiliate_activation_requested", runtimeEventKey: "pack.order.captured" },
  { policyEventKey: "affiliate_activation_rejected", runtimeEventKey: "annual.subscription.past_due" },
  { policyEventKey: "disclosure_acknowledged", runtimeEventKey: "annual.subscription.activated" },
];

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
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

function cookieDomain(env) {
  return getEnvString(env, "SESSION_COOKIE_DOMAIN") || DEFAULT_COOKIE_DOMAIN;
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeEqual(left, right) {
  const a = String(left || "");
  const b = String(right || "");
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

function normalizeCandidateEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function isAllowedFreeAccountHost(url) {
  const host = String(url?.hostname || "").trim().toLowerCase();
  return FREE_ACCOUNT_HOSTS.has(host);
}

function accessStore(env) {
  return createAccessStore(env);
}

function ttlFromExp(expUnixSeconds, fallbackSeconds = MAGIC_LINK_TTL_SECONDS) {
  const exp = Number(expUnixSeconds || 0);
  if (!Number.isFinite(exp) || exp <= 0) return fallbackSeconds;
  const ttl = exp - currentUnixSeconds();
  return ttl > 0 ? ttl : 1;
}

function nextAuditKey() {
  runtimeState.auditNonce += 1;
  return `${Date.now()}:${runtimeState.auditNonce}`;
}

async function logSessionAudit(env, event, payload = {}) {
  const store = accessStore(env);
  try {
    await store.put("session_audit", nextAuditKey(), {
      event,
      timestamp: new Date().toISOString(),
      ...payload,
    }, {
      ttlSeconds: SESSION_TTL_SECONDS,
    });
  } catch {
    // Audit writes must never block runtime auth flows.
  }
}

async function markWebhookDedupe(env, key) {
  const store = accessStore(env);
  try {
    const existing = await store.get("webhook_dedupe", key);
    if (existing) return true;
    await store.put("webhook_dedupe", key, {
      seenAt: new Date().toISOString(),
    }, {
      ttlSeconds: 3 * 24 * 60 * 60,
    });
    return false;
  } catch {
    return false;
  }
}

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value) {
  const normalized = String(value || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signValue(secret, value) {
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

async function signToken(secret, payload) {
  const payloadString = JSON.stringify(payload);
  const encodedPayload = toBase64Url(new TextEncoder().encode(payloadString));
  const signature = await signValue(secret, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifyToken(secret, token) {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) return null;
  const expected = await signValue(secret, encodedPayload);
  if (expected !== signature) return null;
  const payload = safeJsonParse(new TextDecoder().decode(fromBase64Url(encodedPayload)), null);
  if (!payload || typeof payload !== "object") return null;
  if (payload.exp && Number(payload.exp) < currentUnixSeconds()) return null;
  return payload;
}

async function verifyTokenDetailed(secret, token) {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) {
    return { ok: false, code: "SESSION_TOKEN_MALFORMED", reason: "token_missing_segments" };
  }
  const expected = await signValue(secret, encodedPayload);
  if (!safeEqual(expected, signature)) {
    return { ok: false, code: "SESSION_SIGNATURE_INVALID", reason: "signature_mismatch" };
  }
  const payload = safeJsonParse(new TextDecoder().decode(fromBase64Url(encodedPayload)), null);
  if (!payload || typeof payload !== "object") {
    return { ok: false, code: "SESSION_PAYLOAD_INVALID", reason: "payload_decode_failed" };
  }
  const exp = Number(payload.exp || 0);
  if (!Number.isFinite(exp) || exp <= 0) {
    return { ok: false, code: "SESSION_EXP_INVALID", reason: "exp_missing_or_invalid" };
  }
  if (exp < currentUnixSeconds()) {
    return {
      ok: false,
      code: "SESSION_EXPIRED",
      reason: "token_expired",
      expired_at_unix: exp,
    };
  }
  return { ok: true, payload };
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

function memberDomainInfo() {
  return (runtimeTruth.domains || []).find((entry) => entry.host === "member.vetuonglai.com") || {
    host: "member.vetuonglai.com",
    status: "staged_public",
    requiredPublic: false,
  };
}

function canonicalIntent(intent) {
  const normalized = String(intent || "").trim().toLowerCase();
  if (!normalized) return "specialist-pack";
  if (normalized === "annual-access" || normalized === "specialist-pack" || normalized === "interest") return normalized;
  return intentAliases[normalized] || "specialist-pack";
}

function canonicalGateway(gateway) {
  const normalized = String(gateway || "").trim().toLowerCase();
  if (!normalized) return "";
  if (validGateways.has(normalized)) return normalized;
  const aliased = String(gatewayAliases[normalized] || "").trim().toLowerCase();
  return validGateways.has(aliased) ? aliased : "";
}

function normalizeRouteInput(input = {}) {
  const warnings = [];
  const entry = validEntries.has(input.entry) ? input.entry : "hub";
  if (entry !== input.entry && input.entry) warnings.push("invalid_entry_fallback_to_hub");

  const rawIntent = String(input.intent || "").trim();
  const normalizedIntent = canonicalIntent(rawIntent);
  const aliasApplied = rawIntent && normalizedIntent !== rawIntent ? rawIntent : null;
  if (!rawIntent) warnings.push("missing_intent_fallback_to_specialist_pack");
  if (rawIntent && !aliasApplied && normalizedIntent !== rawIntent) warnings.push("invalid_intent_fallback_to_specialist_pack");

  const rawPack = String(input.pack || "").trim().toLowerCase();
  let pack = rawPack || "";
  if (pack && !validPacks.has(pack)) {
    pack = "g1";
    warnings.push("invalid_pack_fallback_to_g1");
  }
  if (!pack && normalizedIntent === "specialist-pack") {
    pack = "g1";
  }

  const rawGateway = String(input.gateway || "").trim().toLowerCase();
  const canonicalGatewayValue = canonicalGateway(rawGateway);
  const gateway = canonicalGatewayValue || (rawGateway ? "pay" : "");
  if (rawGateway && !canonicalGatewayValue) warnings.push("invalid_gateway_fallback_to_pay");

  const rawLang = String(input.lang || "").trim().toLowerCase();
  const lang = rawLang && validLangs.has(rawLang) ? rawLang : "vi";
  if (rawLang && lang !== rawLang) warnings.push("invalid_lang_fallback_to_vi");

  const source = /^[a-z0-9-]+$/.test(String(input.source || "")) ? String(input.source) : "";
  if (input.source && !source) warnings.push("invalid_source_dropped");

  const slug = /^[a-z0-9-]+$/.test(String(input.slug || "")) ? String(input.slug) : "";
  if (input.slug && !slug) warnings.push("invalid_slug_dropped");

  const ref = /^[a-zA-Z0-9_-]+$/.test(String(input.ref || "")) ? String(input.ref) : "";
  if (input.ref && !ref) warnings.push("invalid_ref_dropped");

  const rawReturnTo = String(input.return_to || "").trim();
  const return_to = rawReturnTo.startsWith("/") ? rawReturnTo : "/";
  if (rawReturnTo && return_to !== rawReturnTo) warnings.push("invalid_return_to_fallback_to_root");

  // Block checkout for planned domains — downgrade to interest
  let finalIntent = normalizedIntent;
  if (plannedDomains.has(entry) && (finalIntent === "specialist-pack" || finalIntent === "annual-access")) {
    finalIntent = "interest";
    warnings.push("planned_domain_checkout_blocked_downgrade_to_interest");
  }

  return {
    entry,
    intent: finalIntent,
    pack,
    gateway,
    lang,
    source,
    slug,
    ref,
    return_to,
    aliasApplied,
    warnings,
  };
}

function grantsForState(memberState) {
  const visitorGrants = knownIdentityStates.get("visitor")?.grants || [];
  const stateGrants = knownIdentityStates.get(memberState)?.grants || [];
  return Array.from(new Set([...visitorGrants, ...stateGrants]));
}

function groupEntitlements(entitlements = []) {
  const groups = {
    public: [],
    payment: [],
    proof: [],
    governance: [],
  };
  const lookup = new Map(knownEntitlements.map((entry) => [entry.key, entry]));
  entitlements.forEach((key) => {
    const category = String(lookup.get(key)?.category || "payment");
    if (!groups[category]) groups[category] = [];
    groups[category].push(key);
  });
  return groups;
}

function entitlementCatalogPayload(currentEntitlements = []) {
  return {
    version: accessModel.version,
    current: currentEntitlements,
    groupedCurrent: groupEntitlements(currentEntitlements),
    identityStates: accessModel.identityStates,
    entitlements: knownEntitlements,
    specialistPacks: accessModel.specialistPacks,
    vcProtectionPolicy: accessModel.vcProtectionPolicy || {},
    enterprisePlans: accessModel.enterprisePlans || [],
  };
}

function normalizeCourseSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  return knownCourseSlugs.has(slug) ? slug : "";
}

function normalizeLessonId(value) {
  const lessonId = String(value || "").trim().toLowerCase();
  return /^[a-z0-9-]+$/.test(lessonId) ? lessonId : "";
}

function normalizeSubmissionType(value) {
  const submissionType = String(value || "").trim().toLowerCase();
  return workflowSubmissionTypeKeys.has(submissionType) ? submissionType : "";
}

function normalizePackKey(value) {
  const packKey = String(value || "").trim().toLowerCase();
  return validPacks.has(packKey) ? packKey : "";
}

function normalizeOwnedPacks(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((entry) => normalizePackKey(entry))
        .filter(Boolean),
    ),
  );
}

function mergeOwnedPacks(...lists) {
  return Array.from(
    new Set(
      lists
        .flat()
        .map((entry) => normalizePackKey(entry))
        .filter(Boolean),
    ),
  );
}

function normalizeAnnualAccessStatus(value, fallback = "none") {
  const normalized = String(value || "").trim().toLowerCase();
  if (["active", "pending", "past_due", "cancelled", "none"].includes(normalized)) {
    return normalized;
  }
  return fallback;
}

function annualAccessStatusForMemberState(memberState) {
  switch (ensureMemberState(memberState)) {
    case "annual_active":
    case "pack_owner":
    case "program_user":
    case "partner":
      return "active";
    case "pending_member":
      return "pending";
    default:
      return "none";
  }
}

function tierIdForMemberState(memberState) {
  switch (ensureMemberState(memberState)) {
    case "annual_active":
      return 2;
    case "pack_owner":
      return 4;
    case "program_user":
      return 5;
    case "partner":
      return 6;
    case "pending_member":
      return 1;
    default:
      return 1;
  }
}

function tierMeta(tierId) {
  const item = Array.isArray(productStrategyRegistry.tiers?.items)
    ? productStrategyRegistry.tiers.items.find((entry) => Number(entry.id) === Number(tierId))
    : null;
  if (!item) return null;
  return {
    id: Number(item.id),
    key: String(item.key || ""),
    label_vi: String(item.labelVi || ""),
    label_en: String(item.labelEn || ""),
    earning_allowed: Boolean(item.earningAllowed),
    invest_allowed: item.investAllowed,
  };
}

function pathwayGateForGoal(goalPathway, tierId) {
  const matrix = productStrategyRegistry.tiers?.crossMapping || {};
  const current = matrix?.[goalPathway];
  if (!Array.isArray(current)) return { pathway: goalPathway || null, state: null };
  const index = Math.max(0, Math.min(current.length - 1, Number(tierId) - 1));
  return {
    pathway: goalPathway || null,
    state: current[index] || null,
  };
}

function onboardingAllowedForSession(session) {
  const currentTier = Number(session?.tier_id || 1);
  const maxKidsTier = Number(productStrategyRegistry.tiers?.hardGates?.kidsTierCap || 2);
  const memberContractState = String(memberSurfaceContract?.contractState || "ready");
  const blockedByKidsCap = currentTier <= maxKidsTier && session?.member_state === "visitor";

  return {
    allowed: !blockedByKidsCap && (memberContractState === "ready" || memberContractState === "active"),
    reason: blockedByKidsCap ? "tier_or_state_not_eligible" : "ok",
    contract_state: memberContractState,
    required_entry_layer: memberSurfaceContract?.entryLayerRequirement || "free_member_or_future_access_pass",
    recommended_layers: Array.isArray(memberSurfaceContract?.defaultRecommendationLayers)
      ? memberSurfaceContract.defaultRecommendationLayers
      : ["foundation", "applied"],
  };
}

function normalizeGoalInput(input = {}) {
  const pathway = String(input.pathway || input.goal_primary || "").trim().toLowerCase();
  const selection_method = String(input.selection_method || "manual").trim().toLowerCase();
  const note = String(input.note || "").trim().slice(0, 500);
  return {
    pathway,
    selection_method,
    note,
  };
}

async function readOnboardingState(env, candidateEmail) {
  const store = accessStore(env);
  const state = await store.get("member_onboarding_state", candidateEmail);
  return state && typeof state === "object" ? state : null;
}

async function writeOnboardingState(env, candidateEmail, nextState) {
  const store = accessStore(env);
  await store.put("member_onboarding_state", candidateEmail, nextState, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
}

function sessionRuntimeContractPayload() {
  return {
    endpoint: `${ACCESS_BASE}/session/current`,
    onboarding_goal_endpoint: `${ACCESS_BASE}/onboarding/goal`,
    book_entitlements_endpoint: `${ACCESS_BASE}/books/entitlements`,
    book_check_endpoint: `${ACCESS_BASE}/books/check`,
    states: ["session_active", "session_missing", "session_expiring", "session_refreshed"],
    error_codes: [
      "SESSION_MISSING",
      "SESSION_EXPIRED",
      "SESSION_INVALID",
      "SESSION_REFRESH_FAILED",
      "SESSION_MISSING_COOKIE",
      "SESSION_TOKEN_MALFORMED",
      "SESSION_SIGNATURE_INVALID",
      "SESSION_PAYLOAD_INVALID",
      "SESSION_EXP_INVALID",
    ],
    error_code_http_status: {
      SESSION_MISSING: 401,
      SESSION_MISSING_COOKIE: 401,
      SESSION_TOKEN_MALFORMED: 401,
      SESSION_SIGNATURE_INVALID: 401,
      SESSION_PAYLOAD_INVALID: 401,
      SESSION_EXP_INVALID: 401,
      SESSION_EXPIRED: 401,
      SESSION_INVALID: 401,
      SESSION_REFRESH_FAILED: 503,
    },
    refresh_policy: {
      ttl_seconds: SESSION_TTL_SECONDS,
      refresh_threshold_seconds: SESSION_REFRESH_THRESHOLD_SECONDS,
      behavior: "refresh_cookie_on_active_session_near_expiry",
      query_control: {
        refresh: ["auto", "off"],
      },
    },
  };
}

function sessionErrorResponse(code, reason, { expiredAtUnix = null, detail = "", httpStatus = 401 } = {}) {
  return jsonResponse({
    status: code === "SESSION_EXPIRED" ? "session_expired" : "session_missing",
    authenticated: false,
    error_code: code,
    error_reason: reason,
    detail,
    ...(Number.isFinite(expiredAtUnix) ? { expired_at_unix: expiredAtUnix } : {}),
    contract: sessionRuntimeContractPayload(),
  }, {
    status: httpStatus,
  });
}

function isoNow() {
  return new Date().toISOString();
}

function lessonSubmissionKey(lessonId, submissionType) {
  return `${lessonId}:${submissionType}`;
}

function emptyLearningCourseState(candidateEmail, courseSlug) {
  return {
    candidate_email: candidateEmail,
    course_slug: courseSlug,
    current_lesson_id: "",
    lesson_progress: {},
    submissions: {},
    vc_candidate: {
      status: "not_started",
      eligible: false,
      required_types: [...workflowRequiredApprovedSubmissions],
      submitted_types: [],
      approved_types: [],
      reviewing_types: [],
      submitted_count: 0,
      approved_count: 0,
      reviewing_count: 0,
      outstanding_types: [...workflowRequiredApprovedSubmissions],
      updated_at: isoNow(),
    },
    updated_at: isoNow(),
  };
}

function sanitizeLearningCourseState(record, candidateEmail, courseSlug) {
  const base = emptyLearningCourseState(candidateEmail, courseSlug);
  if (!record || typeof record !== "object") {
    return base;
  }

  return {
    ...base,
    ...record,
    candidate_email: candidateEmail,
    course_slug: courseSlug,
    current_lesson_id: normalizeLessonId(record.current_lesson_id) || "",
    lesson_progress: record.lesson_progress && typeof record.lesson_progress === "object" && !Array.isArray(record.lesson_progress)
      ? record.lesson_progress
      : {},
    submissions: record.submissions && typeof record.submissions === "object" && !Array.isArray(record.submissions)
      ? record.submissions
      : {},
    vc_candidate: record.vc_candidate && typeof record.vc_candidate === "object" && !Array.isArray(record.vc_candidate)
      ? {
        ...base.vc_candidate,
        ...record.vc_candidate,
      }
      : base.vc_candidate,
    updated_at: String(record.updated_at || base.updated_at),
  };
}

function evaluateVcCandidate(courseState) {
  const submissions = Object.values(courseState?.submissions || {}).filter((entry) => entry && typeof entry === "object");
  const submittedTypes = new Set();
  const approvedTypes = new Set();
  const reviewingTypes = new Set();

  submissions.forEach((entry) => {
    const submissionType = normalizeSubmissionType(entry.submission_type);
    if (!submissionType) return;
    const status = String(entry.status || "submitted");
    if (status === "submitted" || status === "reviewing" || status === "approved") {
      submittedTypes.add(submissionType);
    }
    if (status === "reviewing") {
      reviewingTypes.add(submissionType);
    }
    if (status === "approved") {
      approvedTypes.add(submissionType);
    }
  });

  const outstandingTypes = workflowRequiredApprovedSubmissions.filter((type) => !approvedTypes.has(type));
  const eligible = outstandingTypes.length === 0;
  const submittedList = [...submittedTypes];
  const approvedList = [...approvedTypes];
  const reviewingList = [...reviewingTypes];
  const status = eligible
    ? "vc_candidate_ready"
    : reviewingList.length > 0
      ? "reviewing"
      : submittedList.length > 0
        ? "submitted"
        : "not_started";

  return {
    status,
    eligible,
    required_types: [...workflowRequiredApprovedSubmissions],
    submitted_types: submittedList,
    approved_types: approvedList,
    reviewing_types: reviewingList,
    submitted_count: submittedList.length,
    approved_count: approvedList.length,
    reviewing_count: reviewingList.length,
    outstanding_types: outstandingTypes,
    updated_at: isoNow(),
  };
}

function learningEntitlementsFromSummary(summary) {
  const entitlements = new Set();
  const coursesMap = summary?.courses && typeof summary.courses === "object" ? summary.courses : {};

  Object.values(coursesMap).forEach((courseSummary) => {
    const submittedTypes = Array.isArray(courseSummary?.submitted_types) ? courseSummary.submitted_types : [];
    const approvedTypes = Array.isArray(courseSummary?.approved_types) ? courseSummary.approved_types : [];
    if (submittedTypes.length > 0) {
      entitlements.add("vc_claim_submit");
    }
    if (approvedTypes.length > 0 && courseSummary?.eligible) {
      entitlements.add("vc_claim_reviewed");
    }
  });

  return [...entitlements];
}

function mergeEntitlementKeys(baseEntitlements = [], extraEntitlements = []) {
  return Array.from(new Set([
    ...baseEntitlements.filter(Boolean),
    ...extraEntitlements.filter(Boolean),
  ]));
}

async function readLearningCourseState(env, candidateEmail, courseSlug) {
  const store = accessStore(env);
  const raw = await store.get("learning_course_state", `${candidateEmail}:${courseSlug}`);
  return sanitizeLearningCourseState(raw, candidateEmail, courseSlug);
}

async function writeLearningCourseState(env, candidateEmail, courseSlug, value) {
  const store = accessStore(env);
  await store.put("learning_course_state", `${candidateEmail}:${courseSlug}`, value, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
}

async function refreshLearningSummary(env, candidateEmail, courseState) {
  const store = accessStore(env);
  const current = await store.get("learning_member_summary", candidateEmail);
  const nextCourses = {
    ...(current?.courses && typeof current.courses === "object" ? current.courses : {}),
    [courseState.course_slug]: {
      course_slug: courseState.course_slug,
      current_lesson_id: courseState.current_lesson_id || "",
      lesson_progress: courseState.lesson_progress || {},
      submission_count: Object.keys(courseState.submissions || {}).length,
      ...evaluateVcCandidate(courseState),
    },
  };

  const summary = {
    candidate_email: candidateEmail,
    courses: nextCourses,
    entitlements: learningEntitlementsFromSummary({ courses: nextCourses }),
    updated_at: isoNow(),
  };

  await store.put("learning_member_summary", candidateEmail, summary, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
  return summary;
}

async function readLearningSummary(env, candidateEmail) {
  const store = accessStore(env);
  return await store.get("learning_member_summary", candidateEmail);
}

async function writeLearningMutation(env, candidateEmail, courseSlug, mutator) {
  const current = await readLearningCourseState(env, candidateEmail, courseSlug);
  const next = sanitizeLearningCourseState(mutator(current) || current, candidateEmail, courseSlug);
  next.vc_candidate = evaluateVcCandidate(next);
  next.updated_at = isoNow();
  await writeLearningCourseState(env, candidateEmail, courseSlug, next);
  const summary = await refreshLearningSummary(env, candidateEmail, next);
  return { courseState: next, summary };
}

function ensureMemberState(value) {
  return knownIdentityStates.has(value) ? value : "visitor";
}

function normalizeBookSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  return knownBookSlugs.has(slug) ? slug : "";
}

function normalizeOwnedBooks(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((entry) => normalizeBookSlug(entry))
        .filter(Boolean),
    ),
  );
}

function mergeOwnedBooks(...lists) {
  return Array.from(
    new Set(
      lists
        .flat()
        .map((entry) => normalizeBookSlug(entry))
        .filter(Boolean),
    ),
  );
}

function extractBookSlugFromPayload(payload = {}) {
  const candidates = [
    payload?.book_slug,
    payload?.book,
    payload?.metadata?.book_slug,
    payload?.metadata?.book,
    payload?.resource?.custom_id,
    payload?.data?.object?.metadata?.book_slug,
    payload?.data?.object?.metadata?.book,
  ];
  for (const candidate of candidates) {
    const slug = normalizeBookSlug(candidate);
    if (slug) return slug;
  }
  return "";
}

async function readBookEntitlements(env, candidateEmail) {
  if (!isValidEmail(candidateEmail)) {
    return { candidate_email: "", books: {} };
  }
  const store = accessStore(env);
  const raw = await store.get("book_entitlements", candidateEmail);
  if (!raw || typeof raw !== "object") {
    return { candidate_email: candidateEmail, books: {} };
  }
  const books = raw.books && typeof raw.books === "object" && !Array.isArray(raw.books)
    ? raw.books
    : {};
  return {
    candidate_email: candidateEmail,
    books,
  };
}

async function writeBookEntitlements(env, candidateEmail, record) {
  const store = accessStore(env);
  await store.put("book_entitlements", candidateEmail, record, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
}

async function grantBookEntitlement(env, candidateEmail, bookSlug, source = {}) {
  const slug = normalizeBookSlug(bookSlug);
  const email = normalizeCandidateEmail(candidateEmail);
  if (!slug || !isValidEmail(email)) {
    return { ok: false, reason: !slug ? "invalid_book_slug" : "invalid_candidate_email" };
  }
  const current = await readBookEntitlements(env, email);
  const existing = current.books[slug] || null;
  const grantRecord = {
    granted_at: existing?.granted_at || isoNow(),
    last_event_at: isoNow(),
    runtime_event: String(source.runtime_event || existing?.runtime_event || "manual_grant"),
    order_id: String(source.order_id || existing?.order_id || ""),
    provider: String(source.provider || existing?.provider || ""),
    pack_key: normalizePackKey(source.pack_key || existing?.pack_key || ""),
  };
  const next = {
    candidate_email: email,
    books: {
      ...current.books,
      [slug]: grantRecord,
    },
    updated_at: isoNow(),
  };
  await writeBookEntitlements(env, email, next);
  await logSessionAudit(env, "book_entitlement_granted", {
    candidate_email: email,
    book_slug: slug,
    runtime_event: grantRecord.runtime_event,
    order_id: grantRecord.order_id,
  });
  return { ok: true, slug, granted: grantRecord };
}

async function revokeBookEntitlement(env, candidateEmail, bookSlug, source = {}) {
  const slug = normalizeBookSlug(bookSlug);
  const email = normalizeCandidateEmail(candidateEmail);
  if (!slug || !isValidEmail(email)) {
    return { ok: false, reason: !slug ? "invalid_book_slug" : "invalid_candidate_email" };
  }
  const current = await readBookEntitlements(env, email);
  if (!current.books[slug]) {
    return { ok: true, slug, revoked: false };
  }
  const { [slug]: removed, ...remaining } = current.books;
  const next = {
    candidate_email: email,
    books: remaining,
    updated_at: isoNow(),
  };
  await writeBookEntitlements(env, email, next);
  await logSessionAudit(env, "book_entitlement_revoked", {
    candidate_email: email,
    book_slug: slug,
    runtime_event: String(source.runtime_event || "manual_revoke"),
    order_id: String(source.order_id || ""),
  });
  return { ok: true, slug, revoked: true, prior: removed };
}

function hasBookEntitlement(session, bookSlug) {
  const slug = normalizeBookSlug(bookSlug);
  if (!slug) return false;
  const owned = Array.isArray(session?.owned_books) ? session.owned_books : [];
  return owned.includes(slug);
}

function effectiveAccessSnapshot(session = {}, runtimeState = {}, learningSummary = null, bookEntitlements = null) {
  const ownedPacks = mergeOwnedPacks(
    Array.isArray(session?.owned_packs) ? session.owned_packs : [],
    session?.pack_key ? [session.pack_key] : [],
    Array.isArray(runtimeState?.owned_packs) ? runtimeState.owned_packs : [],
    runtimeState?.pack_key ? [runtimeState.pack_key] : [],
  );
  let memberState = ensureMemberState(runtimeState?.member_state || session?.member_state);
  if (memberState === "annual_active" && ownedPacks.length > 0) {
    memberState = "pack_owner";
  }
  const annualAccessStatus = normalizeAnnualAccessStatus(
    runtimeState?.annual_access_status || session?.annual_access_status,
    annualAccessStatusForMemberState(memberState),
  );

  const ownedBooks = mergeOwnedBooks(
    Array.isArray(session?.owned_books) ? session.owned_books : [],
    bookEntitlements && typeof bookEntitlements === "object" && bookEntitlements.books
      ? Object.keys(bookEntitlements.books)
      : [],
  );

  const baseEntitlements = mergeEntitlementKeys(
    grantsForState(memberState),
    learningEntitlementsFromSummary(learningSummary),
  );
  const entitlements = ownedBooks.length > 0
    ? mergeEntitlementKeys(baseEntitlements, ["book_purchased"])
    : baseEntitlements;

  return {
    member_state: memberState,
    annual_access_status: annualAccessStatus,
    owned_packs: ownedPacks,
    owned_books: ownedBooks,
    entitlements,
    learning_summary: learningSummary || null,
  };
}

function getCheckoutUrl(intent, pack, gateway, env) {
  if (intent === "annual-access") {
    return gateway === "stripe"
      ? getEnvString(env, "STRIPE_ANNUAL_ACCESS_CHECKOUT_URL")
      : getEnvString(env, "PAYPAL_ANNUAL_ACCESS_CHECKOUT_URL");
  }

  const key = String(pack || "g1").toLowerCase();
  if (gateway === "stripe") {
    const byMap = safeJsonParse(getEnvString(env, "STRIPE_PACK_CHECKOUT_URLS_JSON"), {});
    return byMap[key] || getEnvString(env, `STRIPE_PACK_${key.toUpperCase()}_CHECKOUT_URL`);
  }

  const byMap = safeJsonParse(getEnvString(env, "PAYPAL_PACK_CHECKOUT_URLS_JSON"), {});
  return byMap[key] || getEnvString(env, `PAYPAL_PACK_${key.toUpperCase()}_CHECKOUT_URL`);
}

function payIaiOneBaseUrl(env) {
  return (getEnvString(env, "PAY_IAI_ONE_BASE_URL") || DEFAULT_PAY_IAI_ONE_BASE_URL).replace(/\/+$/, "");
}

function appendCheckoutContext(baseUrl, normalized) {
  try {
    const url = new URL(baseUrl);
    const params = {
      entry: normalized.entry,
      intent: normalized.intent,
      gateway: "pay",
      pack: normalized.intent === "specialist-pack" ? normalized.pack : "",
      source: normalized.source,
      slug: normalized.slug,
      ref: normalized.ref,
      return_to: normalized.return_to,
    };
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function normalizeCheckoutMetadata(inputMetadata = {}) {
  if (!inputMetadata || typeof inputMetadata !== "object" || Array.isArray(inputMetadata)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(inputMetadata).filter(([, value]) => (
      typeof value === "string"
      || typeof value === "number"
      || typeof value === "boolean"
    )),
  );
}

async function createPayIaiOneCheckoutSession(request, env, input, normalized) {
  const candidateEmail = normalizeCandidateEmail(input.candidate_email || "");
  if (!isValidEmail(candidateEmail)) {
    return {
      ok: false,
      status: 422,
      body: {
        status: "candidate_email_invalid",
        detail: "candidate_email must be a valid email format.",
      },
    };
  }

  const apiKey = getEnvString(env, "PAY_IAI_ONE_API_KEY");
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      body: {
        status: "pay_iai_one_api_key_missing",
        detail: "PAY_IAI_ONE_API_KEY is required before checkout can be created.",
      },
    };
  }

  const returnFlow = routeContract.returnFlow?.failureFallbackRoutes || {};
  const returnUrl = appendCheckoutContext(
    returnFlow.paymentSuccessButNoSession || "https://member.vetuonglai.com/unlock/success/",
    normalized,
  );
  const cancelUrl = appendCheckoutContext(
    returnFlow.genericFallback || "https://vetuonglai.com/bat-dau/",
    normalized,
  );
  const idempotencyKey = (
    request.headers.get("x-idempotency-key")
    || String(input.idempotency_key || input.idempotencyKey || "").trim()
    || crypto.randomUUID()
  );
  const payload = {
    intent: normalized.intent,
    pack: normalized.intent === "specialist-pack" ? normalized.pack : undefined,
    candidate_email: candidateEmail,
    entry: normalized.entry,
    source: normalized.source || undefined,
    lang: normalized.lang,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    metadata: {
      entry: normalized.entry,
      source: normalized.source || undefined,
      slug: normalized.slug || undefined,
      ref: normalized.ref || undefined,
      return_to: normalized.return_to,
      ...normalizeCheckoutMetadata(input.metadata),
    },
  };
  const timeoutMs = Number.parseInt(getEnvString(env, "PAY_IAI_ONE_TIMEOUT_MS") || "", 10);
  const signal = Number.isFinite(timeoutMs) && timeoutMs > 0 && typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
    ? AbortSignal.timeout(timeoutMs)
    : undefined;

  try {
    const response = await fetch(`${payIaiOneBaseUrl(env)}/api/v1/checkout/session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal,
    });
    const responseText = await response.text();
    const responseBody = safeJsonParse(responseText, {
      raw: responseText,
    });

    return {
      ok: response.ok,
      status: response.status,
      body: responseBody,
      idempotencyKey,
      requestBody: payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      body: {
        status: "pay_iai_one_request_failed",
        detail: error instanceof Error ? error.message : "Unknown checkout session error.",
      },
      idempotencyKey,
      requestBody: payload,
    };
  }
}

function getPayPalApiBase(env) {
  return getEnvString(env, "PAYPAL_ENVIRONMENT") === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function verifyPayPalWebhook(request, env, routeKey, rawBody, payload) {
  const production = getEnvString(env, "VTL_ENV") === "production";
  const mode = getEnvString(env, "PAYPAL_WEBHOOK_VERIFY_MODE") || (production ? "postback" : "bypass");
  if (mode !== "postback") {
    return {
      mode,
      verificationStatus: "BYPASSED",
    };
  }

  const clientId = getEnvString(env, "PAYPAL_CLIENT_ID");
  const clientSecret = getEnvString(env, "PAYPAL_CLIENT_SECRET");
  const baseUrl = getPayPalApiBase(env);
  const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const tokenPayload = safeJsonParse(await tokenResponse.text(), {});
  const webhookId = routeKey === "subscriptions"
    ? getEnvString(env, "PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS")
    : getEnvString(env, "PAYPAL_WEBHOOK_ID_ORDERS");

  const verificationResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenPayload.access_token || ""}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      transmission_id: request.headers.get("paypal-transmission-id") || "",
      transmission_time: request.headers.get("paypal-transmission-time") || "",
      cert_url: request.headers.get("paypal-cert-url") || "",
      auth_algo: request.headers.get("paypal-auth-algo") || "",
      transmission_sig: request.headers.get("paypal-transmission-sig") || "",
      webhook_id: webhookId,
      webhook_event: payload,
      raw_body: rawBody,
    }),
  });
  const verificationPayload = safeJsonParse(await verificationResponse.text(), {});

  return {
    mode,
    verificationStatus: String(verificationPayload.verification_status || "FAILED"),
  };
}

async function verifyStripeWebhook(request, env, rawBody) {
  const production = getEnvString(env, "VTL_ENV") === "production";
  const mode = getEnvString(env, "STRIPE_WEBHOOK_VERIFY_MODE") || (production ? "signature" : "bypass");
  if (mode !== "signature") {
    return {
      mode,
      verificationStatus: "BYPASSED",
    };
  }

  const signatureHeader = request.headers.get("stripe-signature") || "";
  const parts = Object.fromEntries(signatureHeader.split(",").map((chunk) => {
    const [key, value] = chunk.split("=");
    return [key, value];
  }));
  const timestamp = parts.t || "";
  const providedSignature = parts.v1 || "";
  const secret = getEnvString(env, "STRIPE_WEBHOOK_SECRET");
  const expectedSignature = await signValue(secret, `${timestamp}.${rawBody}`);

  return {
    mode,
    verificationStatus: safeEqual(expectedSignature, providedSignature) ? "SUCCESS" : "FAILED",
  };
}

function normalizePayPalEvent(payload) {
  const eventType = String(payload?.event_type || "");
  return PAYPAL_EVENT_MAP[eventType] || "unknown";
}

function normalizeStripeEvent(payload) {
  const eventType = String(payload?.type || "");
  const mode = String(payload?.data?.object?.mode || "");
  return STRIPE_EVENT_MAP[`${eventType}:${mode}`] || STRIPE_EVENT_MAP[eventType] || "unknown";
}

async function verifyPayIaiOneWebhook(request, env, rawBody) {
  const timestamp = request.headers.get("x-pay-timestamp") || "";
  const providedSignature = request.headers.get("x-pay-signature") || "";
  const secret = getEnvString(env, "PAY_IAI_ONE_WEBHOOK_SECRET");
  if (!secret || !timestamp || !providedSignature) {
    return {
      mode: "signature",
      verificationStatus: "FAILED",
    };
  }

  const expectedSignature = await signValue(secret, `${timestamp}.${rawBody}`);
  return {
    mode: "signature",
    verificationStatus: safeEqual(expectedSignature, providedSignature) ? "SUCCESS" : "FAILED",
  };
}

function normalizePayIaiOneEvent(payload) {
  const eventType = String(payload?.event_type || "");
  return PAY_IAI_ONE_EVENT_MAP[eventType] || "unknown";
}

function dedupeKey(eventName, eventId) {
  return `${eventName}:${eventId || "unknown"}`;
}

function extractCandidateEmailFromPayload(payload = {}) {
  const direct = normalizeCandidateEmail(payload?.candidate_email || "");
  if (isValidEmail(direct)) return direct;

  const metadataDirect = normalizeCandidateEmail(payload?.metadata?.candidate_email || "");
  if (isValidEmail(metadataDirect)) return metadataDirect;

  const paypalSubscriber = normalizeCandidateEmail(payload?.resource?.subscriber?.email_address || "");
  if (isValidEmail(paypalSubscriber)) return paypalSubscriber;

  const stripeCustomer = normalizeCandidateEmail(payload?.data?.object?.customer_email || "");
  if (isValidEmail(stripeCustomer)) return stripeCustomer;

  const stripeCustomerDetails = normalizeCandidateEmail(payload?.data?.object?.customer_details?.email || "");
  if (isValidEmail(stripeCustomerDetails)) return stripeCustomerDetails;

  const metadataCandidate = normalizeCandidateEmail(payload?.data?.object?.metadata?.candidate_email || "");
  if (isValidEmail(metadataCandidate)) return metadataCandidate;

  const payCustomer = normalizeCandidateEmail(payload?.customer?.email || "");
  if (isValidEmail(payCustomer)) return payCustomer;

  return "";
}

function extractPackKeyFromPayload(payload = {}) {
  const candidates = [
    payload?.pack_key,
    payload?.pack,
    payload?.metadata?.pack_key,
    payload?.metadata?.pack,
    payload?.resource?.custom_id,
    payload?.data?.object?.metadata?.pack_key,
    payload?.data?.object?.metadata?.pack,
  ];

  for (const candidate of candidates) {
    const packKey = normalizePackKey(candidate);
    if (packKey) return packKey;
  }

  return "";
}

function extractAnnualAccessStatusFromPayload(payload = {}, runtimeEvent = "") {
  const directCandidates = [
    payload?.annual_access_status,
    payload?.metadata?.annual_access_status,
    payload?.resource?.status,
    payload?.data?.object?.metadata?.annual_access_status,
  ];

  for (const candidate of directCandidates) {
    const normalized = normalizeAnnualAccessStatus(candidate, "");
    if (normalized) return normalized;
  }

  switch (runtimeEvent) {
    case "annual.subscription.activated":
    case "annual.subscription.renewed":
      return "active";
    case "annual.subscription.past_due":
      return "past_due";
    case "annual.subscription.cancelled":
      return "cancelled";
    default:
      return "";
  }
}

function runtimeMemberStateForEvent(runtimeEvent, payload = {}) {
  const intent = canonicalIntent(payload?.intent || "");
  switch (runtimeEvent) {
    case "annual.subscription.activated":
    case "annual.subscription.renewed":
      return "annual_active";
    case "pack.order.captured":
      return intent === "annual-access" ? "annual_active" : "pack_owner";
    case "pack.order.refunded":
      return intent === "annual-access" ? "pending_member" : "annual_active";
    case "annual.subscription.past_due":
    case "annual.subscription.cancelled":
      return "pending_member";
    default:
      return "";
  }
}

async function upsertRuntimeMemberState(env, runtimeEvent, payload = {}) {
  const candidateEmail = extractCandidateEmailFromPayload(payload);
  if (!candidateEmail) return null;

  const nextMemberState = runtimeMemberStateForEvent(runtimeEvent, payload);
  if (!nextMemberState) return null;

  const store = accessStore(env);
  const current = await store.get("member_runtime_state", candidateEmail);
  const currentMemberState = ensureMemberState(current?.member_state);
  const packKey = extractPackKeyFromPayload(payload);
  const payloadOwnedPacks = normalizeOwnedPacks(payload?.owned_packs);
  const existingOwnedPacks = normalizeOwnedPacks(current?.owned_packs);
  const ownedPacks = runtimeEvent === "pack.order.refunded" && packKey
    ? existingOwnedPacks.filter((entry) => entry !== packKey)
    : mergeOwnedPacks(existingOwnedPacks, payloadOwnedPacks, packKey ? [packKey] : []);

  let memberState = ensureMemberState(nextMemberState);
  if (
    ["annual.subscription.activated", "annual.subscription.renewed", "pack.order.captured"].includes(runtimeEvent)
    && ["program_user", "partner"].includes(currentMemberState)
  ) {
    memberState = currentMemberState;
  } else if (memberState === "annual_active" && ownedPacks.length > 0) {
    memberState = "pack_owner";
  }

  const annualAccessStatus = normalizeAnnualAccessStatus(
    extractAnnualAccessStatusFromPayload(payload, runtimeEvent),
    normalizeAnnualAccessStatus(current?.annual_access_status, annualAccessStatusForMemberState(memberState)),
  );
  const snapshot = {
    candidate_email: candidateEmail,
    member_state: memberState,
    annual_access_status: annualAccessStatus,
    pack_key: ownedPacks[ownedPacks.length - 1] || "",
    owned_packs: ownedPacks,
    entitlements: grantsForState(memberState),
    runtime_event: runtimeEvent,
    updated_at: new Date().toISOString(),
  };
  await store.put("member_runtime_state", candidateEmail, snapshot, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });

  // Book entitlement auto-grant/revoke when payload carries a known book_slug
  const bookSlug = extractBookSlugFromPayload(payload);
  if (bookSlug) {
    const orderId = String(
      payload?.order_id
      || payload?.id
      || payload?.event_id
      || payload?.resource?.id
      || payload?.data?.object?.id
      || "",
    );
    const provider = String(
      payload?.provider
      || (payload?.event_type?.startsWith?.("subscription.") || payload?.event_type?.startsWith?.("order.")
        ? "pay_iai_one"
        : payload?.type?.startsWith?.("checkout.") || payload?.type?.startsWith?.("invoice.") || payload?.type?.startsWith?.("charge.")
          ? "stripe"
          : payload?.event_type?.startsWith?.("PAYMENT.") || payload?.event_type?.startsWith?.("BILLING.")
            ? "paypal"
            : ""),
    );
    if (runtimeEvent === "pack.order.captured" || runtimeEvent === "annual.subscription.activated") {
      await grantBookEntitlement(env, candidateEmail, bookSlug, {
        runtime_event: runtimeEvent,
        order_id: orderId,
        provider,
        pack_key: snapshot.pack_key,
      });
    } else if (runtimeEvent === "pack.order.refunded") {
      await revokeBookEntitlement(env, candidateEmail, bookSlug, {
        runtime_event: runtimeEvent,
        order_id: orderId,
      });
    }
  }

  return snapshot;
}

async function readRequestJson(request) {
  return safeJsonParse(await request.text(), {});
}

function buildSessionCookie(token, env, maxAge = SESSION_TTL_SECONDS) {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Domain=${cookieDomain(env)}; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearSessionCookie(env) {
  return `${SESSION_COOKIE_NAME}=; Path=/; Domain=${cookieDomain(env)}; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function handleMagicLinkRequest(request, env) {
  const input = await readRequestJson(request);
  const memberState = ensureMemberState(String(input.member_state || "pending_member"));
  const packKey = normalizePackKey(input.pack_key || input.pack);
  const ownedPacks = mergeOwnedPacks(
    Array.isArray(input.owned_packs) ? input.owned_packs : [],
    packKey ? [packKey] : [],
  );
  const annualAccessStatus = normalizeAnnualAccessStatus(
    input.annual_access_status,
    annualAccessStatusForMemberState(memberState),
  );
  const payload = {
    candidate_email: normalizeCandidateEmail(input.candidate_email),
    entry: String(input.entry || "hub"),
    intent: canonicalIntent(input.intent || "specialist-pack"),
    member_state: memberState,
    annual_access_status: annualAccessStatus,
    pack_key: packKey,
    owned_packs: ownedPacks,
    lang: validLangs.has(String(input.lang || "")) ? String(input.lang) : "vi",
    return_to: String(input.return_to || "/"),
    exp: currentUnixSeconds() + MAGIC_LINK_TTL_SECONDS,
  };
  const signingKey = getEnvString(env, "MAGIC_LINK_SIGNING_KEY") || "debug-magic-link-key";
  const token = await signToken(signingKey, payload);
  const magicLinkUrl = `https://member.vetuonglai.com${ACCESS_BASE}/session/magic-link/consume?token=${encodeURIComponent(token)}`;
  const store = accessStore(env);

  await store.put("pending_members", payload.candidate_email, payload, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
  await store.put("magic_links", token, {
    ...payload,
    used: false,
  }, {
    ttlSeconds: ttlFromExp(payload.exp),
  });
  await logSessionAudit(env, "magic_link_requested", {
    candidate_email: payload.candidate_email,
    member_state: payload.member_state,
    entry: payload.entry,
  });

  return jsonResponse({
    status: "session_request_normalized",
    storage: {
      mode: store.mode,
    },
    magicLink: {
      token,
      magicLinkUrl,
    },
    normalized: payload,
  }, {
    status: 202,
  });
}

async function handleFreeAccountCreate(request, env) {
  const url = new URL(request.url);
  if (!isAllowedFreeAccountHost(url)) {
    return jsonResponse({
      status: "free_account_host_not_allowed",
      allowedHosts: Array.from(FREE_ACCOUNT_HOSTS),
    }, {
      status: 403,
    });
  }

  const input = await readRequestJson(request);
  const candidateEmail = normalizeCandidateEmail(input.candidate_email);
  if (!isValidEmail(candidateEmail)) {
    return jsonResponse({
      status: "candidate_email_invalid",
      detail: "candidate_email must be a valid email format.",
    }, {
      status: 422,
    });
  }

  const lang = validLangs.has(String(input.lang || "")) ? String(input.lang) : "vi";
  const rawReturnTo = String(input.return_to || "/").trim();
  const returnTo = rawReturnTo.startsWith("/") ? rawReturnTo : "/";
  const sessionMemberState = "pending_member";
  const sessionPayload = {
    candidate_email: candidateEmail,
    member_state: sessionMemberState,
    annual_access_status: "none",
    pack_key: "",
    owned_packs: [],
    entitlements: grantsForState(sessionMemberState),
    entry: "hub",
    lang,
    return_to: returnTo,
    created_from: "homepage_free_account",
    exp: currentUnixSeconds() + SESSION_TTL_SECONDS,
  };
  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  const sessionToken = await signToken(sessionSecret, sessionPayload);
  const store = accessStore(env);
  const nowUnix = currentUnixSeconds();

  await store.put("pending_members", candidateEmail, {
    candidate_email: candidateEmail,
    member_state: sessionMemberState,
    free_account: true,
    free_account_created_at: nowUnix,
    lang,
    return_to: returnTo,
  }, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
  await logSessionAudit(env, "free_account_created", {
    candidate_email: candidateEmail,
    source_host: url.hostname,
    member_state: sessionMemberState,
  });

  return jsonResponse({
    status: "free_account_created",
    authenticated: true,
    member_state: sessionMemberState,
    annual_access_status: sessionPayload.annual_access_status,
    owned_packs: sessionPayload.owned_packs,
    entitlements: sessionPayload.entitlements,
    next: {
      purchaseHub: "https://vetuonglai.com/",
      annualAccessCheckoutHint: "https://vetuonglai.com/?entry=hub&intent=annual-access",
      specialistPackCheckoutHint: "https://vetuonglai.com/?entry=hub&intent=specialist-pack&pack=g1",
    },
  }, {
    status: 201,
    headers: {
      "set-cookie": buildSessionCookie(sessionToken, env),
    },
  });
}

async function handleMagicLinkConsume(request, env) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const store = accessStore(env);
  const stored = await store.get("magic_links", token);
  const signingKey = getEnvString(env, "MAGIC_LINK_SIGNING_KEY") || "debug-magic-link-key";
  const verified = stored || await verifyToken(signingKey, token);

  if (!verified || stored?.used) {
    return jsonResponse({
      status: "magic_link_invalid",
      authenticated: false,
    }, {
      status: 400,
    });
  }

  if (stored) {
    await store.put("magic_links", token, {
      ...stored,
      used: true,
      used_at: currentUnixSeconds(),
    }, {
      ttlSeconds: Math.max(60, ttlFromExp(stored.exp, 60)),
    });
  }

  const sessionSnapshot = effectiveAccessSnapshot(verified, {}, null);
  const sessionPayload = {
    candidate_email: verified.candidate_email,
    member_state: sessionSnapshot.member_state,
    annual_access_status: sessionSnapshot.annual_access_status,
    pack_key: sessionSnapshot.owned_packs[sessionSnapshot.owned_packs.length - 1] || "",
    owned_packs: sessionSnapshot.owned_packs,
    entitlements: sessionSnapshot.entitlements,
    entry: verified.entry,
    lang: verified.lang,
    return_to: verified.return_to || "/",
    exp: currentUnixSeconds() + SESSION_TTL_SECONDS,
  };
  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  const sessionToken = await signToken(sessionSecret, sessionPayload);
  await store.put("pending_members", sessionPayload.candidate_email, {
    ...sessionPayload,
    last_magic_link_consumed_at: currentUnixSeconds(),
  }, {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
  await logSessionAudit(env, "magic_link_consumed", {
    candidate_email: sessionPayload.candidate_email,
    member_state: sessionPayload.member_state,
  });

  return jsonResponse({
    status: "session_created",
    authenticated: true,
    member_state: sessionPayload.member_state,
    annual_access_status: sessionPayload.annual_access_status,
    owned_packs: sessionPayload.owned_packs,
    entitlements: sessionPayload.entitlements,
  }, {
    status: 200,
    headers: {
      "set-cookie": buildSessionCookie(sessionToken, env),
    },
  });
}

async function readSessionEnvelopeFromRequest(request, env) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return {
    ok: false,
    code: "SESSION_MISSING_COOKIE",
    reason: "cookie_absent",
  };
  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  return verifyTokenDetailed(sessionSecret, token);
}

async function readSessionFromRequest(request, env) {
  const envelope = await readSessionEnvelopeFromRequest(request, env);
  return envelope.ok ? envelope.payload : null;
}

async function resolveEffectiveSession(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) return null;

  let effectiveSession = session;
  const candidateEmail = normalizeCandidateEmail(session.candidate_email);

  if (isValidEmail(candidateEmail)) {
    const store = accessStore(env);
    const runtimeState = await store.get("member_runtime_state", candidateEmail);
    const learningSummary = await readLearningSummary(env, candidateEmail);
    const onboardingState = await readOnboardingState(env, candidateEmail);
    const bookEntitlements = await readBookEntitlements(env, candidateEmail);
    const accessSnapshot = effectiveAccessSnapshot(session, runtimeState, learningSummary, bookEntitlements);
    effectiveSession = {
      ...session,
      candidate_email: candidateEmail,
      ...accessSnapshot,
      onboarding_state: onboardingState,
      book_entitlements: bookEntitlements,
    };
  }

  return effectiveSession;
}

async function handleSessionCurrent(request, env) {
  const envelope = await readSessionEnvelopeFromRequest(request, env);
  if (!envelope.ok) {
    await logSessionAudit(env, "session_missing", {
      reason: envelope.reason || "missing_or_invalid_cookie",
      error_code: envelope.code || "SESSION_INVALID",
    });
    return sessionErrorResponse(
      envelope.code || "SESSION_INVALID",
      envelope.reason || "missing_or_invalid_cookie",
      {
        expiredAtUnix: envelope.expired_at_unix,
      },
    );
  }

  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return sessionErrorResponse("SESSION_INVALID", "effective_session_resolution_failed", {
      detail: "Session payload exists but effective runtime session resolution failed.",
    });
  }

  const now = currentUnixSeconds();
  const exp = Number(effectiveSession.exp || 0);
  const expiresInSeconds = Number.isFinite(exp) && exp > now ? exp - now : 0;
  const refreshParam = String(new URL(request.url).searchParams.get("refresh") || "").trim().toLowerCase();
  const refreshDisabled = refreshParam === "off";
  const shouldRefresh = !refreshDisabled && expiresInSeconds > 0 && expiresInSeconds <= SESSION_REFRESH_THRESHOLD_SECONDS;
  let refreshed = false;
  let responseHeaders = undefined;

  if (shouldRefresh) {
    const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
    const refreshedPayload = {
      ...effectiveSession,
      exp: now + SESSION_TTL_SECONDS,
    };
    try {
      const refreshedToken = await signToken(sessionSecret, refreshedPayload);
      refreshed = true;
      responseHeaders = {
        "set-cookie": buildSessionCookie(refreshedToken, env),
      };
    } catch {
      return jsonResponse({
        status: "session_refresh_failed",
        authenticated: false,
        error_code: "SESSION_REFRESH_FAILED",
        contract: sessionRuntimeContractPayload(),
      }, {
        status: 503,
      });
    }
  }

  const tierId = tierIdForMemberState(effectiveSession.member_state);
  const onboardingGate = onboardingAllowedForSession({
    ...effectiveSession,
    tier_id: tierId,
  });
  const selectedGoal = effectiveSession.onboarding_state?.selected_goal || "";
  const pathwayGate = pathwayGateForGoal(selectedGoal, tierId);

  return jsonResponse({
    status: refreshed ? "session_refreshed" : (shouldRefresh ? "session_expiring" : "session_active"),
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    owned_books: effectiveSession.owned_books || [],
    entitlements: effectiveSession.entitlements,
    entitlement_groups: groupEntitlements(effectiveSession.entitlements),
    learning_summary: effectiveSession.learning_summary || null,
    onboarding: {
      gate: onboardingGate,
      selected_goal: effectiveSession.onboarding_state?.selected_goal || null,
      selected_goal_at: effectiveSession.onboarding_state?.selected_goal_at || null,
      selected_goal_source: effectiveSession.onboarding_state?.selection_method || null,
      pathway_gate: pathwayGate,
    },
    tier: tierMeta(tierId),
    session: {
      expires_at_unix: Number.isFinite(exp) ? exp : null,
      expires_in_seconds: expiresInSeconds,
      refreshed,
      refresh_disabled: refreshDisabled,
      refresh_threshold_seconds: SESSION_REFRESH_THRESHOLD_SECONDS,
      ttl_seconds: SESSION_TTL_SECONDS,
    },
    contract: sessionRuntimeContractPayload(),
  }, responseHeaders ? { headers: responseHeaders } : undefined);
}

async function handleOnboardingGoalPersist(request, env) {
  const envelope = await readSessionEnvelopeFromRequest(request, env);
  if (!envelope.ok) {
    return sessionErrorResponse(
      envelope.code || "SESSION_INVALID",
      envelope.reason || "missing_or_invalid_cookie",
      {
        expiredAtUnix: envelope.expired_at_unix,
      },
    );
  }

  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return sessionErrorResponse("SESSION_INVALID", "effective_session_resolution_failed", {
      detail: "Session payload exists but effective runtime session resolution failed.",
    });
  }

  const gate = onboardingAllowedForSession({
    ...effectiveSession,
    tier_id: tierIdForMemberState(effectiveSession.member_state),
  });
  if (!gate.allowed) {
    return jsonResponse({
      status: "onboarding_goal_forbidden",
      authenticated: true,
      error_code: "ONBOARDING_GATE_FORBIDDEN",
      gate,
    }, {
      status: 403,
    });
  }

  const input = normalizeGoalInput(await readRequestJson(request));
  if (!pathwayIds.has(input.pathway)) {
    return jsonResponse({
      status: "onboarding_goal_invalid",
      authenticated: true,
      error_code: "ONBOARDING_GOAL_INVALID",
      detail: "pathway must be one of allowed product-strategy pathways.",
      allowed_pathways: [...pathwayIds],
    }, {
      status: 422,
    });
  }

  const candidateEmail = normalizeCandidateEmail(effectiveSession.candidate_email);
  const nextState = {
    candidate_email: candidateEmail,
    selected_goal: input.pathway,
    selection_method: input.selection_method || "manual",
    note: input.note,
    selected_goal_at: isoNow(),
    updated_at: isoNow(),
    source: "member_onboarding_step_2",
  };

  await writeOnboardingState(env, candidateEmail, nextState);
  await logSessionAudit(env, "onboarding_goal_saved", {
    candidate_email: candidateEmail,
    selected_goal: nextState.selected_goal,
    selection_method: nextState.selection_method,
  });

  return jsonResponse({
    status: "onboarding_goal_saved",
    authenticated: true,
    selected_goal: nextState.selected_goal,
    selected_goal_at: nextState.selected_goal_at,
    selection_method: nextState.selection_method,
    gate,
  });
}

async function handleEntitlementsCurrent(request, env) {
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return jsonResponse({
      status: "entitlements_public",
      authenticated: false,
      ...entitlementCatalogPayload(grantsForState("visitor")),
    });
  }

  return jsonResponse({
    status: "entitlements_active",
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    owned_books: effectiveSession.owned_books || [],
    ...entitlementCatalogPayload(effectiveSession.entitlements),
    learning_summary: effectiveSession.learning_summary || null,
  });
}

function requireAuthenticatedSessionResponse() {
  return jsonResponse({
    status: "session_missing",
    authenticated: false,
  }, {
    status: 401,
  });
}

function normalizeLearningInput(input = {}) {
  return {
    course_slug: normalizeCourseSlug(input.course_slug),
    lesson_id: normalizeLessonId(input.lesson_id),
    submission_type: normalizeSubmissionType(input.submission_type),
    content: String(input.content || "").trim(),
    progress_status: String(input.progress_status || "").trim().toLowerCase(),
    decision: String(input.decision || "").trim().toLowerCase(),
    note: String(input.note || "").trim(),
    candidate_email: normalizeCandidateEmail(input.candidate_email),
  };
}

function reviewerAuthorized(request, env, session) {
  const expectedKey = getEnvString(env, "SUBMISSION_REVIEW_API_KEY");
  const providedKey = request.headers.get("x-review-key") || request.headers.get("x-api-key") || "";
  if (expectedKey && safeEqual(expectedKey, providedKey)) return true;
  return workflowReviewerStates.has(String(session?.member_state || ""));
}

async function handleLearningStateCurrent(request, env) {
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return requireAuthenticatedSessionResponse();
  }

  const candidateEmail = normalizeCandidateEmail(effectiveSession.candidate_email);
  const courseSlug = normalizeCourseSlug(new URL(request.url).searchParams.get("course"));
  if (!courseSlug) {
    return jsonResponse({
      status: "learning_course_required",
      detail: "course query param must match a known course slug.",
      knownCourses: [...knownCourseSlugs],
    }, {
      status: 422,
    });
  }

  const courseState = await readLearningCourseState(env, candidateEmail, courseSlug);
  const vcCandidate = evaluateVcCandidate(courseState);

  return jsonResponse({
    status: "learning_state_active",
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    course_slug: courseSlug,
    workflow: submissionWorkflow,
    entitlements: effectiveSession.entitlements,
    entitlement_groups: groupEntitlements(effectiveSession.entitlements),
    course_state: {
      ...courseState,
      vc_candidate: vcCandidate,
    },
    learning_summary: effectiveSession.learning_summary || null,
  });
}

async function handleLearningProgressUpdate(request, env) {
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return requireAuthenticatedSessionResponse();
  }

  const input = normalizeLearningInput(await readRequestJson(request));
  if (!input.course_slug || !input.lesson_id) {
    return jsonResponse({
      status: "learning_progress_invalid",
      detail: "course_slug and lesson_id are required.",
    }, {
      status: 422,
    });
  }

  const progressStatus = input.progress_status === "in_progress" ? "in_progress" : "completed";
  const candidateEmail = normalizeCandidateEmail(effectiveSession.candidate_email);
  const { courseState, summary } = await writeLearningMutation(env, candidateEmail, input.course_slug, (current) => ({
    ...current,
    current_lesson_id: input.lesson_id,
    lesson_progress: {
      ...current.lesson_progress,
      [input.lesson_id]: progressStatus,
    },
  }));

  return jsonResponse({
    status: "learning_progress_saved",
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    course_slug: input.course_slug,
    course_state: courseState,
    learning_summary: summary,
    entitlements: mergeEntitlementKeys(effectiveSession.entitlements, learningEntitlementsFromSummary(summary)),
  }, {
    status: 202,
  });
}

async function handleLearningSubmission(request, env) {
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return requireAuthenticatedSessionResponse();
  }

  const input = normalizeLearningInput(await readRequestJson(request));
  if (!input.course_slug || !input.lesson_id || !input.submission_type || input.content.length < 3) {
    return jsonResponse({
      status: "learning_submission_invalid",
      detail: "course_slug, lesson_id, submission_type, and content are required.",
      workflow: submissionWorkflow,
    }, {
      status: 422,
    });
  }

  const candidateEmail = normalizeCandidateEmail(effectiveSession.candidate_email);
  const submissionId = lessonSubmissionKey(input.lesson_id, input.submission_type);
  const { courseState, summary } = await writeLearningMutation(env, candidateEmail, input.course_slug, (current) => ({
    ...current,
    current_lesson_id: input.lesson_id,
    lesson_progress: {
      ...current.lesson_progress,
      [input.lesson_id]: "completed",
    },
    submissions: {
      ...current.submissions,
      [submissionId]: {
        id: submissionId,
        lesson_id: input.lesson_id,
        submission_type: input.submission_type,
        content: input.content,
        status: "submitted",
        submitted_at: isoNow(),
        reviewed_at: "",
        note: "",
      },
    },
  }));

  return jsonResponse({
    status: "learning_submission_saved",
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    course_slug: input.course_slug,
    submission_id: submissionId,
    course_state: courseState,
    learning_summary: summary,
    entitlements: mergeEntitlementKeys(effectiveSession.entitlements, learningEntitlementsFromSummary(summary)),
  }, {
    status: 202,
  });
}

async function handleLearningReview(request, env) {
  const input = normalizeLearningInput(await readRequestJson(request));
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!reviewerAuthorized(request, env, effectiveSession)) {
    return jsonResponse({
      status: "review_forbidden",
      detail: "Reviewer authorization is required.",
    }, {
      status: 403,
    });
  }

  if (!input.course_slug || !input.lesson_id || !input.submission_type || !workflowReviewDecisions.has(input.decision) || !isValidEmail(input.candidate_email)) {
    return jsonResponse({
      status: "learning_review_invalid",
      detail: "candidate_email, course_slug, lesson_id, submission_type, and a valid decision are required.",
      allowedDecisions: [...workflowReviewDecisions],
    }, {
      status: 422,
    });
  }

  const submissionId = lessonSubmissionKey(input.lesson_id, input.submission_type);
  const currentState = await readLearningCourseState(env, input.candidate_email, input.course_slug);
  if (!currentState.submissions?.[submissionId]) {
    return jsonResponse({
      status: "submission_not_found",
      submission_id: submissionId,
      course_slug: input.course_slug,
    }, {
      status: 404,
    });
  }

  const { courseState, summary } = await writeLearningMutation(env, input.candidate_email, input.course_slug, (current) => ({
    ...current,
    submissions: {
      ...current.submissions,
      [submissionId]: {
        ...current.submissions[submissionId],
        status: input.decision,
        note: input.note,
        reviewed_at: isoNow(),
      },
    },
  }));

  return jsonResponse({
    status: "learning_review_saved",
    course_slug: input.course_slug,
    submission_id: submissionId,
    reviewer_state: effectiveSession?.member_state || "api_key",
    course_state: courseState,
    learning_summary: summary,
    entitlements: learningEntitlementsFromSummary(summary),
  }, {
    status: 202,
  });
}

async function handleLearningVcCandidate(request, env) {
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return requireAuthenticatedSessionResponse();
  }

  const courseSlug = normalizeCourseSlug(new URL(request.url).searchParams.get("course"));
  if (!courseSlug) {
    return jsonResponse({
      status: "learning_course_required",
      detail: "course query param must match a known course slug.",
      knownCourses: [...knownCourseSlugs],
    }, {
      status: 422,
    });
  }

  const candidateEmail = normalizeCandidateEmail(effectiveSession.candidate_email);
  const courseState = await readLearningCourseState(env, candidateEmail, courseSlug);

  return jsonResponse({
    status: "vc_candidate_state",
    authenticated: true,
    member_state: effectiveSession.member_state,
    annual_access_status: effectiveSession.annual_access_status,
    owned_packs: effectiveSession.owned_packs || [],
    course_slug: courseSlug,
    vc_candidate: evaluateVcCandidate(courseState),
    entitlements: effectiveSession.entitlements,
  });
}

async function handleSessionLogout(request, env) {
  let sessionEmail = "";
  try {
    const session = await resolveEffectiveSession(request, env);
    sessionEmail = session?.email || session?.candidate_email || "";
  } catch {
    // Best-effort session resolution for audit
  }
  await logSessionAudit(env, "session_logout", {
    reason: "user_initiated",
    candidate_email: sessionEmail,
  });
  return jsonResponse({
    status: "session_cleared",
    authenticated: false,
  }, {
    headers: {
      "set-cookie": clearSessionCookie(env),
    },
  });
}

async function handlePayPalWebhook(request, env, routeKey) {
  const rawBody = await request.text();
  const payload = safeJsonParse(rawBody, {});
  const normalizedEvent = normalizePayPalEvent(payload);
  const verification = await verifyPayPalWebhook(request, env, routeKey, rawBody, payload);
  if (verification.verificationStatus === "FAILED") {
    return jsonResponse({
      status: "paypal_verification_failed",
      paypalVerification: verification,
    }, {
      status: 400,
    });
  }

  const eventId = payload.event_id || payload.id || "";
  const key = dedupeKey(normalizedEvent, eventId);
  if (await markWebhookDedupe(env, key)) {
    return jsonResponse({
      status: "duplicate_event_ignored",
      runtimeEvent: normalizedEvent,
      eventId,
    });
  }

  const runtimeProvisioning = await upsertRuntimeMemberState(env, normalizedEvent, payload);

  return jsonResponse({
    status: normalizedEvent.startsWith("pack.order.") ? "pack_provisioning_evaluated" : "subscription_event_normalized",
    runtimeEvent: normalizedEvent,
    eventId,
    paypalVerification: verification,
    runtimeProvisioning,
  }, {
    status: 202,
  });
}

async function handleStripeWebhook(request, env) {
  const rawBody = await request.text();
  const payload = safeJsonParse(rawBody, {});
  const verification = await verifyStripeWebhook(request, env, rawBody);
  if (verification.verificationStatus === "FAILED") {
    return jsonResponse({
      status: "stripe_verification_failed",
      stripeVerification: verification,
    }, {
      status: 400,
    });
  }

  const normalizedEvent = normalizeStripeEvent(payload);
  const eventId = payload.id || "";
  const key = dedupeKey(normalizedEvent, eventId);
  if (await markWebhookDedupe(env, key)) {
    return jsonResponse({
      status: "duplicate_event_ignored",
      runtimeEvent: normalizedEvent,
      eventId,
    });
  }

  const runtimeProvisioning = await upsertRuntimeMemberState(env, normalizedEvent, payload);

  return jsonResponse({
    status: normalizedEvent.startsWith("pack.order.") ? "pack_provisioning_evaluated" : "subscription_event_normalized",
    runtimeEvent: normalizedEvent,
    eventId,
    stripeVerification: verification,
    runtimeProvisioning,
  }, {
    status: 202,
  });
}

async function handlePayIaiOneWebhook(request, env) {
  const rawBody = await request.text();
  const payload = safeJsonParse(rawBody, {});
  const verification = await verifyPayIaiOneWebhook(request, env, rawBody);
  if (verification.verificationStatus === "FAILED") {
    return jsonResponse({
      status: "pay_iai_one_verification_failed",
      payIaiOneVerification: verification,
    }, {
      status: 400,
    });
  }

  const normalizedEvent = normalizePayIaiOneEvent(payload);
  const eventId = payload.event_id || payload.id || "";
  const key = dedupeKey(normalizedEvent, eventId);
  if (await markWebhookDedupe(env, key)) {
    return jsonResponse({
      status: "duplicate_event_ignored",
      runtimeEvent: normalizedEvent,
      eventId,
    });
  }

  const runtimeProvisioning = await upsertRuntimeMemberState(env, normalizedEvent, payload);

  return jsonResponse({
    status: normalizedEvent.startsWith("pack.order.") ? "pack_provisioning_evaluated" : "subscription_event_normalized",
    runtimeEvent: normalizedEvent,
    eventId,
    payIaiOneVerification: verification,
    runtimeProvisioning,
  }, {
    status: 202,
  });
}

const PLANNED_DOMAINS = new Set(["life", "invest", "work", "market", "community", "ai", "business"]);

async function handleCheckoutResolve(request, env) {
  const input = await readRequestJson(request);
  const requestedIntent = canonicalIntent(input?.intent);
  const normalized = normalizeRouteInput(input);

  // T1-1: Block checkout for planned domains — they must not trigger purchases
  if (PLANNED_DOMAINS.has(normalized.entry) && (requestedIntent === "specialist-pack" || requestedIntent === "annual-access")) {
    await logSessionAudit(env, "checkout_blocked_planned_domain", {
      entry: normalized.entry,
      intent: requestedIntent,
      pack: normalized.pack,
    });
    return jsonResponse({
      status: "checkout_blocked_planned_domain",
      detail: `Domain "${normalized.entry}" is not yet open for purchases. Browse existing domains at the hub.`,
      entry: normalized.entry,
      requestedIntent,
      normalizedIntent: normalized.intent,
      redirect: "https://vetuonglai.com/",
    }, {
      status: 403,
    });
  }

  const gateway = normalized.gateway || "pay";

  if (gateway === "pay") {
    const payCheckout = await createPayIaiOneCheckoutSession(request, env, input, normalized);
    if (!payCheckout.ok) {
      return jsonResponse({
        ...payCheckout.body,
        contractVersion: accessModel.version,
        normalized: {
          ...normalized,
          gateway,
        },
        payment: {
          gateway,
          provider: "pay_iai_one_checkout_session",
          upstreamStatus: payCheckout.status,
          idempotencyKey: payCheckout.idempotencyKey,
        },
        returnFlow: routeContract.returnFlow,
      }, {
        status: payCheckout.status,
      });
    }

    const payment = payCheckout.body || {};
    return jsonResponse({
      status: "checkout_route_resolved",
      contractVersion: accessModel.version,
      normalized: {
        ...normalized,
        gateway,
      },
      payment: {
        gateway,
        provider: "pay_iai_one_checkout_session",
        checkoutUrl: payment.checkout_url || "",
        sessionId: payment.session_id || "",
        providerRef: payment.provider_ref || "",
        expiresAt: payment.expires_at || "",
        upstreamStatus: payCheckout.status,
        idempotencyKey: payCheckout.idempotencyKey,
      },
      returnFlow: routeContract.returnFlow,
    }, {
      status: 202,
    });
  }

  const checkoutUrl = getCheckoutUrl(normalized.intent, normalized.pack, gateway, env);

  return jsonResponse({
    status: "checkout_route_resolved",
    contractVersion: accessModel.version,
    normalized,
    payment: {
      gateway,
      checkoutUrl,
      provider: normalized.intent === "annual-access"
        ? (gateway === "stripe" ? "stripe_checkout_subscription" : "paypal_subscriptions")
        : (gateway === "stripe" ? "stripe_checkout_payment" : "paypal_orders"),
    },
    returnFlow: routeContract.returnFlow,
  }, {
    status: 202,
  });
}

async function handleRouteNormalize(request) {
  const input = await readRequestJson(request);
  return jsonResponse({
    status: "route_normalized",
    contractVersion: accessModel.version,
    normalized: normalizeRouteInput(input),
  });
}

function configuredPackCount(env, gatewayKey) {
  const envKey = gatewayKey === "stripe" ? "STRIPE_PACK_CHECKOUT_URLS_JSON" : "PAYPAL_PACK_CHECKOUT_URLS_JSON";
  const configured = safeJsonParse(getEnvString(env, envKey), {});
  return Object.keys(configured || {}).length;
}

function handleProviderStatus(env) {
  const memberDomain = memberDomainInfo();
  const stripePackCount = configuredPackCount(env, "stripe");
  const paypalPackCount = configuredPackCount(env, "paypal");
  const store = accessStore(env);
  const payIaiOneReady = Boolean(getEnvString(env, "PAY_IAI_ONE_API_KEY"));
  const payIaiOneWebhookReady = Boolean(getEnvString(env, "PAY_IAI_ONE_WEBHOOK_SECRET"));

  return jsonResponse({
    status: "provider_status",
    contractVersion: accessModel.version,
    session: {
      ready: Boolean(getEnvString(env, "SESSION_COOKIE_SECRET") && getEnvString(env, "MAGIC_LINK_SIGNING_KEY")),
      cookieDomain: cookieDomain(env),
      persistenceMode: store.mode,
    },
    gateways: {
      annualAccess: {
        pay: {
          productionReady: payIaiOneReady,
          webhookReady: payIaiOneWebhookReady,
          baseUrl: payIaiOneBaseUrl(env),
        },
        stripe: {
          productionReady: Boolean(getEnvString(env, "STRIPE_ANNUAL_ACCESS_CHECKOUT_URL")),
        },
        paypal: {
          productionReady: Boolean(getEnvString(env, "PAYPAL_ANNUAL_ACCESS_CHECKOUT_URL")),
          webhookReady: Boolean(
            getEnvString(env, "PAYPAL_CLIENT_ID")
            && getEnvString(env, "PAYPAL_CLIENT_SECRET")
            && getEnvString(env, "PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS"),
          ),
        },
      },
      specialistPacks: {
        pay: {
          productionReady: payIaiOneReady,
          webhookReady: payIaiOneWebhookReady,
          baseUrl: payIaiOneBaseUrl(env),
        },
        stripe: {
          configuredPackCount: stripePackCount,
        },
        paypal: {
          configuredPackCount: paypalPackCount,
          webhookReady: Boolean(getEnvString(env, "PAYPAL_WEBHOOK_ID_ORDERS")),
        },
      },
    },
    cloudflareTarget: {
      stagedMemberWorkerScript: DEFAULT_MEMBER_SCRIPT,
      memberDomainRequiredPublic: Boolean(memberDomain.requiredPublic),
      memberDomainStatus: memberDomain.status,
    },
    persistence: {
      accessStateStore: store.mode,
      pendingMemberState: store.mode === "kv" ? "ACCESS_KV_NAMESPACE" : "memory_fallback",
      sessionAudit: store.mode === "kv" ? "ACCESS_KV_NAMESPACE" : "memory_fallback",
    },
  });
}

function handlePolicyBindings() {
  return jsonResponse({
    status: "policy_bindings_ready",
    contractVersion: accessModel.version,
    noKeyDrift: {
      team3SourceLocked: Boolean(team3PolicyMatrix.guardrails?.homepagePurchaseHubOnly),
      runtimeEventVocabularyLocked: runtimeEvents.includes("annual.subscription.activated"),
    },
    consumedIdentityStates: Array.from(knownIdentityStates.keys()),
    consumedGuardrails: team3PolicyMatrix.guardrails,
    requiredEvents: team3PolicyMatrix.reporting?.requiredEvents || [],
    policyToRuntimeEventMap,
  });
}

function handleCheckoutContract() {
  return jsonResponse({
    status: "checkout_contract_ready",
    contractVersion: accessModel.version,
    annualAccess: accessModel.homepagePurchaseHub?.annualAccess || {},
    specialistPackCheckout: accessModel.homepagePurchaseHub?.specialistPackCheckout || {},
    specialistPacks: accessModel.specialistPacks || [],
  });
}

function handleRoutingContract() {
  return jsonResponse({
    status: "routing_contract_ready",
    contractVersion: accessModel.version,
    routeContract,
  });
}

async function handleBooksEntitlements(request, env) {
  const envelope = await readSessionEnvelopeFromRequest(request, env);
  if (!envelope.ok) {
    return sessionErrorResponse(
      envelope.code || "SESSION_INVALID",
      envelope.reason || "missing_or_invalid_cookie",
      { expiredAtUnix: envelope.expired_at_unix },
    );
  }
  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return sessionErrorResponse("SESSION_INVALID", "effective_session_resolution_failed");
  }
  return jsonResponse({
    status: "book_entitlements",
    authenticated: true,
    candidate_email: effectiveSession.candidate_email,
    member_state: effectiveSession.member_state,
    owned_books: effectiveSession.owned_books || [],
    book_purchased: hasBookEntitlement(effectiveSession, ""),
    catalog: {
      version: readBooksRegistry.version || null,
      known_book_slugs: [...knownBookSlugs],
    },
    grants: effectiveSession.book_entitlements?.books || {},
  });
}

async function handleBookCheck(request, env) {
  const url = new URL(request.url);
  const requestedSlug = String(url.searchParams.get("slug") || "").trim().toLowerCase();
  const slug = normalizeBookSlug(requestedSlug);

  if (!slug) {
    return jsonResponse({
      status: "book_slug_invalid",
      authenticated: false,
      authorized: false,
      requested_slug: requestedSlug,
      known_book_slugs: [...knownBookSlugs],
      error_code: "BOOK_SLUG_INVALID",
      detail: "slug must match a known read-books.json entry.",
    }, { status: 422 });
  }

  const envelope = await readSessionEnvelopeFromRequest(request, env);
  if (!envelope.ok) {
    return jsonResponse({
      status: "book_check_session_missing",
      authenticated: false,
      authorized: false,
      slug,
      error_code: envelope.code || "SESSION_INVALID",
      contract: sessionRuntimeContractPayload(),
    }, { status: 401 });
  }

  const effectiveSession = await resolveEffectiveSession(request, env);
  if (!effectiveSession) {
    return jsonResponse({
      status: "book_check_session_invalid",
      authenticated: false,
      authorized: false,
      slug,
      error_code: "SESSION_INVALID",
    }, { status: 401 });
  }

  const authorized = hasBookEntitlement(effectiveSession, slug);
  return jsonResponse({
    status: authorized ? "book_check_authorized" : "book_check_forbidden",
    authenticated: true,
    authorized,
    slug,
    member_state: effectiveSession.member_state,
    owned_books: effectiveSession.owned_books || [],
    grant: effectiveSession.book_entitlements?.books?.[slug] || null,
  }, {
    status: authorized ? 200 : 403,
  });
}

async function handleBookGrantInternal(request, env) {
  const adminSecret = getEnvString(env, "ACCESS_ADMIN_SECRET");
  if (!adminSecret) {
    return jsonResponse({
      status: "admin_secret_missing",
      detail: "ACCESS_ADMIN_SECRET must be set before /books/grant can be called.",
    }, { status: 503 });
  }
  const provided = request.headers.get("x-admin-secret") || "";
  if (!safeEqual(provided, adminSecret)) {
    return jsonResponse({
      status: "admin_secret_invalid",
    }, { status: 401 });
  }

  const input = await readRequestJson(request);
  const candidateEmail = normalizeCandidateEmail(input.candidate_email);
  const bookSlug = normalizeBookSlug(input.book_slug || input.slug);
  const action = String(input.action || "grant").toLowerCase();

  if (!isValidEmail(candidateEmail)) {
    return jsonResponse({
      status: "candidate_email_invalid",
      error_code: "CANDIDATE_EMAIL_INVALID",
    }, { status: 422 });
  }
  if (!bookSlug) {
    return jsonResponse({
      status: "book_slug_invalid",
      error_code: "BOOK_SLUG_INVALID",
      known_book_slugs: [...knownBookSlugs],
    }, { status: 422 });
  }

  if (action === "revoke") {
    const result = await revokeBookEntitlement(env, candidateEmail, bookSlug, {
      runtime_event: "admin_revoke",
      order_id: String(input.order_id || ""),
    });
    return jsonResponse({
      status: "book_entitlement_revoke_evaluated",
      ...result,
    });
  }

  const result = await grantBookEntitlement(env, candidateEmail, bookSlug, {
    runtime_event: "admin_grant",
    order_id: String(input.order_id || ""),
    provider: String(input.provider || "admin"),
    pack_key: normalizePackKey(input.pack_key || ""),
  });
  return jsonResponse({
    status: "book_entitlement_grant_evaluated",
    ...result,
  });
}

export async function maybeHandleAccessRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(ACCESS_BASE)) {
    return null;
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/account/free/create`) {
    return handleFreeAccountCreate(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/session/magic-link/request`) {
    return handleMagicLinkRequest(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/session/magic-link/consume`) {
    return handleMagicLinkConsume(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/session/current`) {
    return handleSessionCurrent(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/onboarding/goal`) {
    return handleOnboardingGoalPersist(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/session/logout`) {
    return handleSessionLogout(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/webhooks/paypal/subscriptions`) {
    return handlePayPalWebhook(request, env, "subscriptions");
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/webhooks/paypal/orders`) {
    return handlePayPalWebhook(request, env, "orders");
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/webhooks/stripe`) {
    return handleStripeWebhook(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/webhooks/pay/iai-one`) {
    return handlePayIaiOneWebhook(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/checkout/resolve`) {
    return handleCheckoutResolve(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/provider-status.json`) {
    return handleProviderStatus(env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/entitlements.json`) {
    return handleEntitlementsCurrent(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/books/entitlements`) {
    return handleBooksEntitlements(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/books/check`) {
    return handleBookCheck(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/books/grant`) {
    return handleBookGrantInternal(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/learning/state`) {
    return handleLearningStateCurrent(request, env);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/learning/vc-candidate`) {
    return handleLearningVcCandidate(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/learning/progress`) {
    return handleLearningProgressUpdate(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/learning/submission`) {
    return handleLearningSubmission(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/learning/review`) {
    return handleLearningReview(request, env);
  }

  if (request.method === "POST" && url.pathname === `${ACCESS_BASE}/route/normalize`) {
    return handleRouteNormalize(request);
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/policy-bindings.json`) {
    return handlePolicyBindings();
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/checkout-contract.json`) {
    return handleCheckoutContract();
  }

  if (request.method === "GET" && url.pathname === `${ACCESS_BASE}/routing-contract.json`) {
    return handleRoutingContract();
  }

  return jsonResponse({
    status: "not_found",
    path: url.pathname,
  }, {
    status: 404,
  });
}
