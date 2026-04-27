import { createAccessStore } from "./access-state.mjs";
import accessModel from "../../src/data/access-model.json" with { type: "json" };
import system from "../../src/data/system.json" with { type: "json" };
import {
  decodeBase64Url,
  encodeBase64Url,
  signToken,
  verifyToken,
} from "./access-crypto.mjs";

const VC_BASE = "/api/vc";
const SESSION_COOKIE_NAME = "vtl_session";
const CHALLENGE_TTL_SECONDS = 10 * 60;
const DEFAULT_IDENTITY_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_OWNERSHIP_TTL_SECONDS = 10 * 365 * 24 * 60 * 60;
const OWNERSHIP_ID_PREFIX = "VTL-OWN";
const MEMBERSHIP_INCLUDED_STATES = new Set(["annual_active", "pack_owner", "program_user", "partner"]);
const VC_POLICY = accessModel?.vcProtectionPolicy || {};
const PROFILE_POLICY = VC_POLICY?.profileVerification || {};
const PROFILE_REQUIRED_FIELDS = Array.isArray(PROFILE_POLICY?.requiredFields)
  ? PROFILE_POLICY.requiredFields.map((value) => String(value || "")).filter(Boolean)
  : [
      "legal_full_name",
      "date_of_birth",
      "country_code",
      "phone_e164",
      "national_id_last4",
      "address_line_1",
      "city",
    ];
const PROFILE_REQUIRED_CONSENTS = Array.isArray(PROFILE_POLICY?.requiredConsents)
  ? PROFILE_POLICY.requiredConsents.map((value) => String(value || "")).filter(Boolean)
  : ["consent_truthful_data", "consent_privacy_policy"];
const MIN_IDENTITY_ASSURANCE_LEVEL = Number.isFinite(Number(PROFILE_POLICY?.identityAssuranceMinLevel))
  && Number(PROFILE_POLICY.identityAssuranceMinLevel) > 0
  ? Number(PROFILE_POLICY.identityAssuranceMinLevel)
  : 2;
const ENTERPRISE_PLANS = Array.isArray(accessModel?.enterprisePlans) ? accessModel.enterprisePlans : [];
const NFT_BRIDGE = system?.nftBridge || {};

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

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
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
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function normalizeHexHash(input) {
  const value = String(input || "").trim().toLowerCase();
  if (!value) return "";
  return /^[a-f0-9]{64}$/.test(value) ? value : "";
}

async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decodeFlexibleBase64(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const source = raw.startsWith("data:") && raw.includes(",")
    ? raw.slice(raw.indexOf(",") + 1)
    : raw;
  try {
    return decodeBase64Url(source);
  } catch {
    try {
      const normalized = source.replaceAll("-", "+").replaceAll("_", "/");
      const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
      const binary = atob(padded);
      return Uint8Array.from(binary, (char) => char.charCodeAt(0));
    } catch {
      return null;
    }
  }
}

function maskEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const [local, domain] = normalized.split("@");
  if (!local || !domain) return "";
  if (local.length <= 2) return `${local[0] || "*"}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

function sessionSubjectKey(session) {
  const email = String(session?.candidate_email || "").trim().toLowerCase();
  if (email) return `email:${email}`;
  const fallback = String(session?.member_state || "visitor").toLowerCase();
  return `state:${fallback}`;
}

function resolveVcProtectionEligibility(session) {
  const memberState = String(session?.member_state || "").trim().toLowerCase();
  const entitlements = Array.isArray(session?.entitlements) ? session.entitlements.map((value) => String(value || "")) : [];
  const entitlementSet = new Set(entitlements);
  const includedByState = MEMBERSHIP_INCLUDED_STATES.has(memberState);
  const includedByEntitlement = entitlementSet.has("annual_access_core")
    || entitlementSet.has("owned_pack_depth")
    || entitlementSet.has("program_layer")
    || entitlementSet.has("partner_rights");
  const eligible = includedByState || includedByEntitlement;

  return {
    eligible,
    memberState,
    entitlements,
    reason: eligible ? "included_with_member_purchase" : "membership_required",
  };
}

async function mergeSessionWithRuntimeState(session, store) {
  const candidateEmail = String(session?.candidate_email || "").trim().toLowerCase();
  if (!candidateEmail) return session;
  const runtimeState = await store.get("member_runtime_state", candidateEmail);
  if (!runtimeState?.member_state) return session;
  return {
    ...session,
    member_state: String(runtimeState.member_state || session.member_state || "").trim(),
    entitlements: Array.isArray(runtimeState.entitlements)
      ? runtimeState.entitlements
      : session.entitlements,
  };
}

function vcBillingPolicy(eligibility) {
  if (eligibility.eligible) {
    return {
      plan: "included_with_membership",
      currency: "USD",
      amount: 0,
      charged: false,
      checkoutUrl: null,
    };
  }

  return {
    plan: "membership_required",
    currency: "USD",
    amount: null,
    charged: false,
    checkoutUrl: "https://vetuonglai.com/?entry=vc&intent=annual-access",
  };
}

function enterprisePlansSnapshot() {
  return ENTERPRISE_PLANS.map((plan) => {
    const cta = plan?.cta && typeof plan.cta === "object" ? plan.cta : {};
    return {
      key: String(plan?.key || ""),
      name: String(plan?.name || ""),
      nameVi: String(plan?.nameVi || plan?.name || ""),
      billing: {
        currency: String(plan?.billing?.currency || "USD"),
        amount: Number.isFinite(Number(plan?.billing?.amount)) ? Number(plan.billing.amount) : null,
        interval: String(plan?.billing?.interval || "month"),
      },
      coverage: plan?.coverage && typeof plan.coverage === "object" ? plan.coverage : {},
      included: Array.isArray(plan?.included) ? plan.included.map((item) => String(item || "")) : [],
      includedVi: Array.isArray(plan?.includedVi) ? plan.includedVi.map((item) => String(item || "")) : [],
      cta: {
        label: String(cta.label || ""),
        labelVi: String(cta.labelVi || cta.label || ""),
        href: String(cta.href || ""),
      },
    };
  }).filter((plan) => plan.key && plan.name);
}

function normalizeBoolean(value) {
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return false;
  return normalized === "true"
    || normalized === "1"
    || normalized === "yes"
    || normalized === "y"
    || normalized === "verified"
    || normalized === "complete"
    || normalized === "passed"
    || normalized === "success";
}

function normalizeProfileInput(rawInput = {}) {
  const profile = rawInput?.profile && typeof rawInput.profile === "object"
    ? rawInput.profile
    : rawInput;

  return {
    legal_full_name: String(profile?.legal_full_name || profile?.full_name || "").trim(),
    date_of_birth: String(profile?.date_of_birth || "").trim(),
    country_code: String(profile?.country_code || "").trim().toUpperCase(),
    phone_e164: String(profile?.phone_e164 || profile?.phone || "").trim(),
    national_id_last4: String(profile?.national_id_last4 || profile?.id_last4 || "").trim(),
    address_line_1: String(profile?.address_line_1 || profile?.address_line1 || "").trim(),
    city: String(profile?.city || "").trim(),
    consent_truthful_data: normalizeBoolean(profile?.consent_truthful_data),
    consent_privacy_policy: normalizeBoolean(profile?.consent_privacy_policy),
  };
}

function validateProfileInput(profile) {
  const invalidFields = [];
  const missingFields = [];

  const check = (key, valid) => {
    if (!profile[key]) {
      missingFields.push(key);
      return;
    }
    if (!valid) invalidFields.push(key);
  };

  check("legal_full_name", profile.legal_full_name.length >= 4);
  check("date_of_birth", /^\d{4}-\d{2}-\d{2}$/.test(profile.date_of_birth));
  check("country_code", /^[A-Z]{2}$/.test(profile.country_code));
  check("phone_e164", /^\+[1-9]\d{7,14}$/.test(profile.phone_e164));
  check("national_id_last4", /^\d{4}$/.test(profile.national_id_last4));
  check("address_line_1", profile.address_line_1.length >= 6);
  check("city", profile.city.length >= 2);

  const missingConsents = PROFILE_REQUIRED_CONSENTS.filter((key) => !normalizeBoolean(profile[key]));

  return {
    complete: missingFields.length === 0 && invalidFields.length === 0 && missingConsents.length === 0,
    missingFields,
    invalidFields,
    missingConsents,
  };
}

function profileVerificationTtlSeconds(env) {
  const configured = Number(getEnvString(env, "VC_PROFILE_VERIFICATION_TTL_SECONDS"));
  if (!Number.isFinite(configured) || configured <= 0) return DEFAULT_OWNERSHIP_TTL_SECONDS;
  return Math.floor(configured);
}

function maskName(name) {
  const tokens = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "";
  if (tokens.length === 1) return `${tokens[0].slice(0, 1)}***`;
  return `${tokens[0]} ${tokens.slice(1).map((token) => `${token.slice(0, 1)}.`).join(" ")}`;
}

function maskPhone(phone) {
  const normalized = String(phone || "").trim();
  if (!normalized) return "";
  if (normalized.length <= 5) return `${normalized.slice(0, 1)}***`;
  return `${normalized.slice(0, 4)}***${normalized.slice(-2)}`;
}

async function readSessionFromRequest(request, env) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const token = cookies[SESSION_COOKIE_NAME] || "";
  if (!token) return null;

  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET");
  if (!sessionSecret) return null;

  const [encodedPayload, signature] = String(token).split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signValueHex(sessionSecret, encodedPayload);
  if (!timingSafeEqual(expectedSignature, signature)) return null;

  const decoded = safeJsonParse(new TextDecoder().decode(decodeBase64Url(encodedPayload)), null);
  if (!decoded || typeof decoded !== "object") return null;
  if (decoded.exp && Number(decoded.exp) < currentUnixSeconds()) return null;
  return decoded;
}

function identityTtlFromPayload(payload, fallbackSeconds = DEFAULT_IDENTITY_TTL_SECONDS) {
  const exp = Number(payload?.exp || 0);
  if (!Number.isFinite(exp) || exp <= 0) return fallbackSeconds;
  const ttl = exp - currentUnixSeconds();
  if (ttl <= 0) return 1;
  return Math.min(ttl, 7 * 24 * 60 * 60);
}

function ownershipRecordTtlSeconds(env) {
  const configured = Number(getEnvString(env, "VC_OWNERSHIP_RECORD_TTL_SECONDS"));
  if (!Number.isFinite(configured) || configured <= 0) return DEFAULT_OWNERSHIP_TTL_SECONDS;
  return Math.floor(configured);
}

function buildChallengeMessage({ challengeId, nonce, assetHashSha256, subjectKey }) {
  return [
    "vtl.vc.ownership.challenge.v1",
    challengeId,
    nonce,
    assetHashSha256,
    subjectKey,
  ].join(":");
}

function createOwnershipId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  return `${OWNERSHIP_ID_PREFIX}-${date}-${random}`;
}

function resolveSignatureAlgorithm(publicKeyJwk) {
  const kty = String(publicKeyJwk?.kty || "").toUpperCase();

  if (kty === "EC" && String(publicKeyJwk?.crv || "").toUpperCase() === "P-256") {
    return {
      importAlgorithm: {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      verifyAlgorithm: {
        name: "ECDSA",
        hash: "SHA-256",
      },
      label: "ECDSA_P256_SHA256",
    };
  }

  if (kty === "RSA") {
    const alg = String(publicKeyJwk?.alg || "").toUpperCase();
    if (alg === "PS256") {
      return {
        importAlgorithm: {
          name: "RSA-PSS",
          hash: "SHA-256",
        },
        verifyAlgorithm: {
          name: "RSA-PSS",
          saltLength: 32,
        },
        label: "RSA_PSS_SHA256",
      };
    }
    return {
      importAlgorithm: {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      verifyAlgorithm: {
        name: "RSASSA-PKCS1-v1_5",
      },
      label: "RSASSA_PKCS1_V1_5_SHA256",
    };
  }

  if (kty === "OKP" && String(publicKeyJwk?.crv || "") === "Ed25519") {
    return {
      importAlgorithm: {
        name: "Ed25519",
      },
      verifyAlgorithm: {
        name: "Ed25519",
      },
      label: "ED25519",
    };
  }

  throw new Error("unsupported_signature_key_type");
}

function normalizePublicKeyJwk(input) {
  if (typeof input === "string") {
    return safeJsonParse(input, null);
  }
  if (input && typeof input === "object") return input;
  return null;
}

async function parseChallengeRequestInput(request) {
  const contentType = request.headers.get("content-type") || "";
  const normalized = {
    assetName: "",
    assetType: "digital_asset",
    fileName: "",
    mimeType: "",
    byteLength: 0,
    assetHashSha256: "",
    metadata: {},
    publicKeyJwk: null,
    idempotencyKey: "",
  };

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");

    if (file && typeof file === "object" && typeof file.arrayBuffer === "function") {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      normalized.byteLength = fileBytes.byteLength;
      normalized.fileName = String(file.name || "");
      normalized.mimeType = String(file.type || "");
      normalized.assetHashSha256 = await sha256Hex(fileBytes);
      if (!normalized.assetName) {
        normalized.assetName = normalized.fileName || "uploaded_asset";
      }
    }

    normalized.assetName = String(form.get("asset_name") || normalized.assetName || "").trim();
    normalized.assetType = String(form.get("asset_type") || normalized.assetType || "digital_asset").trim();
    normalized.fileName = String(form.get("file_name") || normalized.fileName || "").trim();
    normalized.mimeType = String(form.get("mime_type") || normalized.mimeType || "").trim();
    normalized.idempotencyKey = String(form.get("idempotency_key") || "").trim();

    const metadataRaw = String(form.get("metadata_json") || "").trim();
    normalized.metadata = metadataRaw ? safeJsonParse(metadataRaw, {}) : {};

    const providedHash = normalizeHexHash(String(form.get("asset_hash_sha256") || ""));
    if (providedHash) normalized.assetHashSha256 = providedHash;

    normalized.publicKeyJwk = normalizePublicKeyJwk(form.get("public_key_jwk"));
    return normalized;
  }

  const raw = safeJsonParse(await request.text(), {});
  const input = raw && typeof raw === "object" ? raw : {};

  normalized.assetName = String(input.asset_name || "").trim();
  normalized.assetType = String(input.asset_type || normalized.assetType).trim();
  normalized.fileName = String(input.file_name || "").trim();
  normalized.mimeType = String(input.mime_type || "").trim();
  normalized.idempotencyKey = String(input.idempotency_key || "").trim();
  normalized.metadata = input.metadata && typeof input.metadata === "object" ? input.metadata : {};
  normalized.publicKeyJwk = normalizePublicKeyJwk(input.public_key_jwk);

  const providedHash = normalizeHexHash(String(input.asset_hash_sha256 || ""));
  if (providedHash) {
    normalized.assetHashSha256 = providedHash;
    return normalized;
  }

  const fileBytes = decodeFlexibleBase64(input.file_base64);
  if (fileBytes) {
    normalized.byteLength = fileBytes.byteLength;
    normalized.assetHashSha256 = await sha256Hex(fileBytes);
  }

  return normalized;
}

async function ensureIdentityAttestation(store, subjectKey) {
  const attestation = await store.get("vc_identity_attestations", subjectKey);
  if (!attestation) return null;
  if (Number(attestation.exp || 0) > 0 && Number(attestation.exp) < currentUnixSeconds()) {
    return null;
  }
  return attestation;
}

async function ensureProfileVerification(store, subjectKey) {
  const profileVerification = await store.get("vc_profile_verifications", subjectKey);
  if (!profileVerification || !profileVerification.verified) return null;
  if (Number(profileVerification.exp || 0) > 0 && Number(profileVerification.exp) < currentUnixSeconds()) {
    return null;
  }
  return profileVerification;
}

async function handleSecurityStatus(env) {
  const store = createAccessStore(env);
  const enterprisePlans = enterprisePlansSnapshot();
  return jsonResponse({
    status: "vc_security_status",
    ready: {
      sessionSecret: Boolean(getEnvString(env, "SESSION_COOKIE_SECRET")),
      identityAttestationSecret: Boolean(getEnvString(env, "VC_IDENTITY_ATTESTATION_SECRET")),
      ownershipChallengeSecret: Boolean(getEnvString(env, "VC_OWNERSHIP_CHALLENGE_SECRET")),
    },
    storage: {
      mode: store.mode,
    },
    ownership: {
      twoLayerProtection: true,
      acceptedMimeTypes: "*/*",
      acceptedFileTypes: "all",
    },
    protectionPolicy: {
      vcProtectionIncludedForStates: Array.from(MEMBERSHIP_INCLUDED_STATES),
      billing: {
        mode: "included_for_paid_members",
        externalCheckoutHub: "https://vetuonglai.com/?entry=vc&intent=annual-access",
      },
      profileVerification: {
        required: true,
        requiredFields: PROFILE_REQUIRED_FIELDS,
        requiredConsents: PROFILE_REQUIRED_CONSENTS,
        minIdentityAssuranceLevel: MIN_IDENTITY_ASSURANCE_LEVEL,
      },
      certification: {
        publicLookupEnabled: true,
        freeForPaidMembers: true,
        level: "STRONG_2_LAYER",
      },
    },
    integrations: {
      nftBridge: {
        enabled: Boolean(NFT_BRIDGE?.registryUrl),
        mode: String(NFT_BRIDGE?.mode || "runtime-mirror"),
        siteUrl: String(NFT_BRIDGE?.siteUrl || ""),
        registryUrl: String(NFT_BRIDGE?.registryUrl || ""),
      },
    },
    enterprise: {
      enabled: enterprisePlans.length > 0,
      plans: enterprisePlans,
      salesHub: "https://vetuonglai.com/lien-he/?intent=enterprise-vc",
    },
  });
}

async function handleProtectionEligibility(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) {
    return jsonResponse({
      status: "session_required",
      authenticated: false,
    }, {
      status: 401,
    });
  }

  const store = createAccessStore(env);
  const effectiveSession = await mergeSessionWithRuntimeState(session, store);
  const eligibility = resolveVcProtectionEligibility(effectiveSession);
  const subjectKey = sessionSubjectKey(effectiveSession);
  const profileVerification = await ensureProfileVerification(store, subjectKey);
  const enterprisePlans = enterprisePlansSnapshot();
  const certificationReady = Boolean(eligibility.eligible && profileVerification);

  return jsonResponse({
    status: "vc_protection_eligibility",
    authenticated: true,
    eligibility,
    billing: vcBillingPolicy(eligibility),
    profileVerification: {
      required: true,
      verified: Boolean(profileVerification),
      status: profileVerification ? "verified_complete" : "profile_verification_required",
      verifiedAt: profileVerification?.verifiedAt || null,
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
    },
    certificationGate: {
      ready: certificationReady,
      reason: !eligibility.eligible
        ? "membership_required"
        : (profileVerification ? "ready_for_identity_attestation" : "profile_verification_required"),
      twoLayerLevel: "STRONG_2_LAYER",
    },
    enterprise: {
      plans: enterprisePlans,
      salesHub: "https://vetuonglai.com/lien-he/?intent=enterprise-vc",
    },
  });
}

async function handleProfileVerify(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) {
    return jsonResponse({
      status: "session_required",
      authenticated: false,
    }, { status: 401 });
  }

  const store = createAccessStore(env);
  const effectiveSession = await mergeSessionWithRuntimeState(session, store);
  const eligibility = resolveVcProtectionEligibility(effectiveSession);
  if (!eligibility.eligible) {
    return jsonResponse({
      status: "membership_required_for_profile_verification",
      eligibility,
      billing: vcBillingPolicy(eligibility),
      detail: "Free ownership certification requires an active paid member state.",
    }, { status: 402 });
  }

  const rawBody = safeJsonParse(await request.text(), {});
  const profile = normalizeProfileInput(rawBody);
  const validation = validateProfileInput(profile);
  if (!validation.complete) {
    return jsonResponse({
      status: "profile_verification_incomplete",
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
      validation,
    }, { status: 422 });
  }

  const subjectKey = sessionSubjectKey(effectiveSession);
  const ttlSeconds = profileVerificationTtlSeconds(env);
  const nowIso = new Date().toISOString();
  const exp = currentUnixSeconds() + ttlSeconds;

  const canonicalProfile = {
    legal_full_name: profile.legal_full_name,
    date_of_birth: profile.date_of_birth,
    country_code: profile.country_code,
    phone_e164: profile.phone_e164,
    national_id_last4: profile.national_id_last4,
    address_line_1: profile.address_line_1,
    city: profile.city,
    consent_truthful_data: true,
    consent_privacy_policy: true,
  };
  const profileHashSha256 = await sha256Hex(new TextEncoder().encode(JSON.stringify(canonicalProfile)));

  const profileVerificationRecord = {
    verified: true,
    verificationLevel: "FULL_PROFILE",
    verifiedAt: nowIso,
    exp,
    sessionSubjectKey: subjectKey,
    memberState: String(effectiveSession.member_state || "visitor"),
    profileHashSha256,
    requiredFields: PROFILE_REQUIRED_FIELDS,
    requiredConsents: PROFILE_REQUIRED_CONSENTS,
    profileSummary: {
      legalFullNameMasked: maskName(profile.legal_full_name),
      dateOfBirth: profile.date_of_birth,
      countryCode: profile.country_code,
      phoneMasked: maskPhone(profile.phone_e164),
      nationalIdLast4: profile.national_id_last4,
      city: profile.city,
    },
    createdAt: nowIso,
  };

  await store.put("vc_profile_verifications", subjectKey, profileVerificationRecord, {
    ttlSeconds,
  });

  return jsonResponse({
    status: "profile_verified_complete",
    authenticated: true,
    owner: {
      sessionSubjectKey: subjectKey,
      candidateEmailMasked: maskEmail(effectiveSession.candidate_email),
      memberState: effectiveSession.member_state || "visitor",
    },
    profileVerification: {
      verified: true,
      verificationLevel: "FULL_PROFILE",
      verifiedAt: nowIso,
      expiresAtUnix: exp,
      profileHashSha256,
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
    },
    next: {
      identityAttestationEndpoint: `${VC_BASE}/identity/attest`,
      ownershipChallengeEndpoint: `${VC_BASE}/ownership/challenge/request`,
    },
  }, { status: 202 });
}

async function handleIdentityAttestation(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) {
    return jsonResponse({
      status: "session_required",
      authenticated: false,
    }, { status: 401 });
  }

  const store = createAccessStore(env);
  const effectiveSession = await mergeSessionWithRuntimeState(session, store);
  const eligibility = resolveVcProtectionEligibility(effectiveSession);
  if (!eligibility.eligible) {
    return jsonResponse({
      status: "membership_required_for_identity_attestation",
      eligibility,
      billing: vcBillingPolicy(eligibility),
      detail: "Identity attestation for free certification is only available for active paid members.",
    }, { status: 402 });
  }

  const subjectKey = sessionSubjectKey(effectiveSession);
  const profileVerification = await ensureProfileVerification(store, subjectKey);
  if (!profileVerification) {
    return jsonResponse({
      status: "profile_verification_required",
      detail: "Call /api/vc/profile/verify with complete profile fields before identity attestation.",
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
    }, { status: 428 });
  }

  const body = safeJsonParse(await request.text(), {});
  const identityToken = String(body?.identity_token || "").trim();
  if (!identityToken) {
    return jsonResponse({
      status: "identity_token_required",
    }, { status: 400 });
  }

  const identitySecret = getEnvString(env, "VC_IDENTITY_ATTESTATION_SECRET");
  if (!identitySecret) {
    return jsonResponse({
      status: "identity_attestation_not_configured",
      detail: "VC_IDENTITY_ATTESTATION_SECRET is required for real-user verification.",
    }, { status: 503 });
  }

  const verified = await verifyToken(identityToken, identitySecret);
  if (!verified.ok) {
    return jsonResponse({
      status: "identity_token_invalid",
      reason: verified.reason,
    }, { status: 401 });
  }

  const payload = verified.payload || {};
  const verificationStatus = String(payload.verification_status || payload.status || "").toLowerCase();
  const subject = String(payload.sub || payload.subject || "").trim();
  const provider = String(payload.provider || payload.issuer || "").trim() || "external_kyc";
  const assuranceLevel = Number(payload.assurance_level ?? payload.level ?? 0);
  const exp = Number(payload.exp || 0);
  const profileVerifiedClaim = payload.profile_verified ?? payload.profile_verification_status ?? payload.profile_status;
  const profileHashClaim = normalizeHexHash(String(payload.profile_hash_sha256 || payload.profileHashSha256 || ""));

  if (!subject) {
    return jsonResponse({
      status: "identity_token_missing_subject",
    }, { status: 422 });
  }

  if (!["verified", "success", "passed"].includes(verificationStatus)) {
    return jsonResponse({
      status: "identity_not_verified",
      verificationStatus,
    }, { status: 422 });
  }

  if (!Number.isFinite(assuranceLevel) || assuranceLevel < MIN_IDENTITY_ASSURANCE_LEVEL) {
    return jsonResponse({
      status: "identity_assurance_too_low",
      requiredMinLevel: MIN_IDENTITY_ASSURANCE_LEVEL,
      assuranceLevel,
    }, { status: 422 });
  }

  if (!normalizeBoolean(profileVerifiedClaim)) {
    return jsonResponse({
      status: "identity_profile_not_verified",
      detail: "identity_token must include profile_verified=true (or equivalent verified status).",
    }, { status: 422 });
  }

  if (profileHashClaim && profileVerification.profileHashSha256 && !timingSafeEqual(profileHashClaim, profileVerification.profileHashSha256)) {
    return jsonResponse({
      status: "identity_profile_hash_mismatch",
      detail: "identity_token profile hash does not match the verified member profile.",
    }, { status: 422 });
  }

  if (!Number.isFinite(exp) || exp <= currentUnixSeconds()) {
    return jsonResponse({
      status: "identity_token_expired",
    }, { status: 401 });
  }

  const nowIso = new Date().toISOString();
  const attestation = {
    subject,
    provider,
    assuranceLevel,
    verificationStatus,
    verifiedAt: payload.verified_at || nowIso,
    exp,
    sessionSubjectKey: subjectKey,
    profileHashSha256: profileVerification.profileHashSha256 || "",
    profileVerifiedAt: profileVerification.verifiedAt || nowIso,
    createdAt: nowIso,
  };

  await store.put("vc_identity_attestations", subjectKey, attestation, {
    ttlSeconds: identityTtlFromPayload(payload),
  });

  return jsonResponse({
    status: "identity_attested_real",
    authenticated: true,
    owner: {
      sessionSubjectKey: subjectKey,
      candidateEmailMasked: maskEmail(effectiveSession.candidate_email),
      memberState: effectiveSession.member_state || "visitor",
    },
    identity: {
      provider,
      subject,
      assuranceLevel,
      exp,
      verificationStatus,
    },
    profileVerification: {
      required: true,
      verified: true,
      verificationLevel: profileVerification.verificationLevel || "FULL_PROFILE",
      profileHashSha256: profileVerification.profileHashSha256 || "",
      verifiedAt: profileVerification.verifiedAt || null,
    },
    protection: {
      layer1: "session_cookie + full_profile_verification + real_identity_attestation",
      layer2: "cryptographic_asset_ownership_challenge",
    },
    billing: vcBillingPolicy(eligibility),
  }, { status: 202 });
}

async function handleOwnershipChallengeRequest(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) {
    return jsonResponse({
      status: "session_required",
      authenticated: false,
    }, { status: 401 });
  }

  const challengeSecret = getEnvString(env, "VC_OWNERSHIP_CHALLENGE_SECRET");
  if (!challengeSecret) {
    return jsonResponse({
      status: "ownership_challenge_not_configured",
      detail: "VC_OWNERSHIP_CHALLENGE_SECRET is required.",
    }, { status: 503 });
  }

  const store = createAccessStore(env);
  const effectiveSession = await mergeSessionWithRuntimeState(session, store);
  const eligibility = resolveVcProtectionEligibility(effectiveSession);
  if (!eligibility.eligible) {
    return jsonResponse({
      status: "membership_required_for_vc_protection",
      eligibility,
      billing: vcBillingPolicy(eligibility),
      detail: "Create free account on vetuonglai.com, then complete member purchase to unlock VC protection at zero extra cost.",
    }, { status: 402 });
  }

  const subjectKey = sessionSubjectKey(effectiveSession);
  const profileVerification = await ensureProfileVerification(store, subjectKey);
  if (!profileVerification) {
    return jsonResponse({
      status: "profile_verification_required",
      detail: "Call /api/vc/profile/verify with complete profile fields before requesting an ownership challenge.",
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
    }, { status: 428 });
  }

  const attestation = await ensureIdentityAttestation(store, subjectKey);

  if (!attestation) {
    return jsonResponse({
      status: "identity_attestation_required",
      detail: "Call /api/vc/identity/attest first with a valid real-user identity token.",
    }, { status: 428 });
  }

  const normalized = await parseChallengeRequestInput(request);
  const assetHashSha256 = normalizeHexHash(normalized.assetHashSha256);
  if (!assetHashSha256) {
    return jsonResponse({
      status: "asset_hash_required",
      detail: "Provide asset_hash_sha256 or file/file_base64 to compute it.",
    }, { status: 400 });
  }

  const publicKeyJwk = normalizePublicKeyJwk(normalized.publicKeyJwk);
  if (!publicKeyJwk) {
    return jsonResponse({
      status: "public_key_required",
      detail: "public_key_jwk is required for layer-2 challenge signing.",
    }, { status: 400 });
  }

  let signatureProfile;
  try {
    signatureProfile = resolveSignatureAlgorithm(publicKeyJwk);
  } catch (error) {
    return jsonResponse({
      status: "unsupported_signature_key",
      detail: error instanceof Error ? error.message : "unsupported_signature_key",
    }, { status: 422 });
  }

  const existingIndexKey = `${subjectKey}:${assetHashSha256}`;
  const existingIndex = await store.get("vc_ownership_index", existingIndexKey);
  if (existingIndex?.ownershipId) {
    const existingRecord = await store.get("vc_ownership_records", existingIndex.ownershipId);
    if (existingRecord) {
      return jsonResponse({
        status: "ownership_already_verified",
        ownershipId: existingRecord.ownershipId,
        verifyUrl: existingRecord.anchors?.registryLookupUrl,
      }, { status: 200 });
    }
  }

  const challengeId = crypto.randomUUID();
  const nonceBytes = new Uint8Array(32);
  crypto.getRandomValues(nonceBytes);
  const nonce = encodeBase64Url(nonceBytes);
  const exp = currentUnixSeconds() + CHALLENGE_TTL_SECONDS;

  const challengeRecord = {
    challengeId,
    exp,
    nonce,
    subjectKey,
    candidateEmailMasked: maskEmail(effectiveSession.candidate_email),
    memberState: effectiveSession.member_state || "visitor",
    identity: {
      subject: attestation.subject,
      provider: attestation.provider,
      assuranceLevel: attestation.assuranceLevel,
    },
    profileVerification: {
      verifiedAt: profileVerification.verifiedAt || null,
      verificationLevel: profileVerification.verificationLevel || "FULL_PROFILE",
      profileHashSha256: profileVerification.profileHashSha256 || "",
    },
    asset: {
      name: normalized.assetName || normalized.fileName || "digital_asset",
      type: normalized.assetType || "digital_asset",
      fileName: normalized.fileName || "",
      mimeType: normalized.mimeType || "application/octet-stream",
      byteLength: Number(normalized.byteLength || 0),
      assetHashSha256,
      metadata: normalized.metadata && typeof normalized.metadata === "object" ? normalized.metadata : {},
    },
    publicKeyJwk,
    signatureScheme: signatureProfile.label,
    createdAt: new Date().toISOString(),
    idempotencyKey: normalized.idempotencyKey || "",
  };

  await store.put("vc_ownership_challenges", challengeId, challengeRecord, {
    ttlSeconds: CHALLENGE_TTL_SECONDS,
  });

  const challengeToken = await signToken({
    iss: "vc.vetuonglai.com",
    typ: "ownership_challenge",
    cid: challengeId,
    nonce,
    subject_key: subjectKey,
    asset_hash_sha256: assetHashSha256,
    exp,
  }, challengeSecret);

  const signingMessage = buildChallengeMessage({
    challengeId,
    nonce,
    assetHashSha256,
    subjectKey,
  });

  return jsonResponse({
    status: "ownership_challenge_created",
    challenge: {
      challengeId,
      challengeToken,
      signingMessage,
      signatureScheme: signatureProfile.label,
      expiresInSeconds: CHALLENGE_TTL_SECONDS,
    },
    ownership: {
      acceptedMimeTypes: "*/*",
      acceptedFileTypes: "all",
      noFileTypeWhitelist: true,
      assetHashSha256,
    },
    protection: {
      layer1: "verified_session_and_identity",
      layer2: "challenge_signature_required",
    },
    billing: vcBillingPolicy(eligibility),
  }, { status: 202 });
}

async function handleOwnershipChallengeVerify(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session) {
    return jsonResponse({
      status: "session_required",
      authenticated: false,
    }, { status: 401 });
  }

  const challengeSecret = getEnvString(env, "VC_OWNERSHIP_CHALLENGE_SECRET");
  if (!challengeSecret) {
    return jsonResponse({
      status: "ownership_challenge_not_configured",
    }, { status: 503 });
  }

  const body = safeJsonParse(await request.text(), {});
  const challengeId = String(body?.challenge_id || body?.challengeId || "").trim();
  const challengeToken = String(body?.challenge_token || body?.challengeToken || "").trim();
  const signatureInput = String(body?.signature_base64url || body?.signature || "").trim();

  if (!challengeId || !challengeToken || !signatureInput) {
    return jsonResponse({
      status: "challenge_id_challenge_token_signature_required",
    }, { status: 400 });
  }

  const signatureBytes = decodeFlexibleBase64(signatureInput);
  if (!signatureBytes || signatureBytes.byteLength === 0) {
    return jsonResponse({
      status: "signature_decode_failed",
    }, { status: 422 });
  }

  const store = createAccessStore(env);
  const challenge = await store.get("vc_ownership_challenges", challengeId);
  if (!challenge) {
    return jsonResponse({
      status: "challenge_not_found_or_expired",
    }, { status: 404 });
  }

  const subjectKey = sessionSubjectKey(session);
  if (challenge.subjectKey !== subjectKey) {
    return jsonResponse({
      status: "challenge_owner_mismatch",
    }, { status: 403 });
  }

  if (Number(challenge.exp || 0) < currentUnixSeconds()) {
    return jsonResponse({
      status: "challenge_expired",
    }, { status: 410 });
  }

  const verifiedToken = await verifyToken(challengeToken, challengeSecret);
  if (!verifiedToken.ok) {
    return jsonResponse({
      status: "challenge_token_invalid",
      reason: verifiedToken.reason,
    }, { status: 401 });
  }

  const tokenPayload = verifiedToken.payload || {};
  if (
    tokenPayload.typ !== "ownership_challenge"
    || tokenPayload.cid !== challengeId
    || tokenPayload.subject_key !== challenge.subjectKey
    || !timingSafeEqual(tokenPayload.asset_hash_sha256, challenge.asset.assetHashSha256)
    || tokenPayload.exp < currentUnixSeconds()
  ) {
    return jsonResponse({
      status: "challenge_token_mismatch",
    }, { status: 401 });
  }

  const existingIndexKey = `${subjectKey}:${challenge.asset.assetHashSha256}`;
  const existingIndex = await store.get("vc_ownership_index", existingIndexKey);
  if (existingIndex?.ownershipId) {
    const existingRecord = await store.get("vc_ownership_records", existingIndex.ownershipId);
    if (existingRecord) {
      return jsonResponse({
        status: "ownership_already_verified",
        ownership: existingRecord,
      });
    }
  }

  let signatureProfile;
  try {
    signatureProfile = resolveSignatureAlgorithm(challenge.publicKeyJwk);
  } catch (error) {
    return jsonResponse({
      status: "unsupported_signature_key",
      detail: error instanceof Error ? error.message : "unsupported_signature_key",
    }, { status: 422 });
  }

  const message = buildChallengeMessage({
    challengeId: challenge.challengeId,
    nonce: challenge.nonce,
    assetHashSha256: challenge.asset.assetHashSha256,
    subjectKey: challenge.subjectKey,
  });

  let signatureVerified = false;
  try {
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      challenge.publicKeyJwk,
      signatureProfile.importAlgorithm,
      false,
      ["verify"],
    );
    signatureVerified = await crypto.subtle.verify(
      signatureProfile.verifyAlgorithm,
      publicKey,
      signatureBytes,
      new TextEncoder().encode(message),
    );
  } catch {
    signatureVerified = false;
  }

  if (!signatureVerified) {
    return jsonResponse({
      status: "challenge_signature_invalid",
    }, { status: 401 });
  }

  const ownershipId = createOwnershipId();
  const issuedAt = new Date().toISOString();
  const ownershipDigestSha256 = await sha256Hex(new TextEncoder().encode(JSON.stringify({
    ownershipId,
    subjectKey,
    assetHashSha256: challenge.asset.assetHashSha256,
    issuedAt,
  })));
  const verifyUrl = `https://vc.vetuonglai.com${VC_BASE}/ownership/verify?ownership_id=${encodeURIComponent(ownershipId)}`;

  const ownershipRecord = {
    ownershipId,
    issuedAt,
    owner: {
      candidateEmailMasked: challenge.candidateEmailMasked,
      memberState: challenge.memberState,
      identityProvider: challenge.identity.provider,
      identitySubject: challenge.identity.subject,
      identityAssuranceLevel: challenge.identity.assuranceLevel,
      profileVerificationLevel: challenge.profileVerification?.verificationLevel || "FULL_PROFILE",
      profileVerifiedAt: challenge.profileVerification?.verifiedAt || null,
    },
    asset: challenge.asset,
    verification: {
      level: "STRONG_2_LAYER",
      layers: [
        {
          key: "L1_REAL_USER_VERIFIED",
          status: "verified",
          detail: "session + complete profile verification + identity attestation token",
        },
        {
          key: "L2_CRYPTOGRAPHIC_OWNERSHIP_PROOF",
          status: "verified",
          detail: challenge.signatureScheme,
        },
      ],
      challengeId,
      challengeSignedAt: issuedAt,
    },
    anchors: {
      ownershipDigestSha256,
      registryLookupUrl: verifyUrl,
    },
  };

  await store.put("vc_ownership_records", ownershipId, ownershipRecord, {
    ttlSeconds: ownershipRecordTtlSeconds(env),
  });
  await store.put("vc_ownership_index", existingIndexKey, {
    ownershipId,
    assetHashSha256: challenge.asset.assetHashSha256,
    subjectKey,
  }, {
    ttlSeconds: ownershipRecordTtlSeconds(env),
  });
  await store.put("vc_ownership_challenges", challengeId, {
    ...challenge,
    verifiedAt: issuedAt,
    ownershipId,
  }, {
    ttlSeconds: CHALLENGE_TTL_SECONDS,
  });

  return jsonResponse({
    status: "ownership_verified",
    ownership: ownershipRecord,
  }, { status: 201 });
}

async function handleEnterprisePlans() {
  return jsonResponse({
    status: "vc_enterprise_plans",
    plans: enterprisePlansSnapshot(),
    profileVerificationPolicy: {
      required: true,
      requiredFields: PROFILE_REQUIRED_FIELDS,
      requiredConsents: PROFILE_REQUIRED_CONSENTS,
      minIdentityAssuranceLevel: MIN_IDENTITY_ASSURANCE_LEVEL,
    },
    salesHub: "https://vetuonglai.com/lien-he/?intent=enterprise-vc",
  });
}

async function handleOwnershipVerify(request, env) {
  const url = new URL(request.url);
  const ownershipId = String(url.searchParams.get("ownership_id") || "").trim();
  if (!ownershipId) {
    return jsonResponse({
      status: "ownership_id_required",
    }, { status: 400 });
  }

  const store = createAccessStore(env);
  const record = await store.get("vc_ownership_records", ownershipId);
  if (!record) {
    return jsonResponse({
      status: "ownership_not_found",
      ownershipId,
    }, { status: 404 });
  }

  return jsonResponse({
    status: "ownership_verified",
    ownership: record,
  });
}

export async function maybeHandleVcOwnershipRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(VC_BASE)) {
    return null;
  }

  try {
    if (request.method === "GET" && url.pathname === `${VC_BASE}/security/status`) {
      return handleSecurityStatus(env);
    }

    if (request.method === "GET" && url.pathname === `${VC_BASE}/protection/eligibility`) {
      return handleProtectionEligibility(request, env);
    }

    if (request.method === "POST" && url.pathname === `${VC_BASE}/profile/verify`) {
      return handleProfileVerify(request, env);
    }

    if (request.method === "POST" && url.pathname === `${VC_BASE}/identity/attest`) {
      return handleIdentityAttestation(request, env);
    }

    if (request.method === "GET" && url.pathname === `${VC_BASE}/enterprise/plans`) {
      return handleEnterprisePlans();
    }

    if (request.method === "POST" && url.pathname === `${VC_BASE}/ownership/challenge/request`) {
      return handleOwnershipChallengeRequest(request, env);
    }

    if (request.method === "POST" && url.pathname === `${VC_BASE}/ownership/challenge/verify`) {
      return handleOwnershipChallengeVerify(request, env);
    }

    if (request.method === "GET" && url.pathname === `${VC_BASE}/ownership/verify`) {
      return handleOwnershipVerify(request, env);
    }
  } catch (error) {
    return jsonResponse({
      status: "vc_runtime_error",
      message: error instanceof Error ? error.message : "unexpected_error",
    }, { status: 500 });
  }

  return jsonResponse({
    status: "not_found",
    path: url.pathname,
  }, { status: 404 });
}
