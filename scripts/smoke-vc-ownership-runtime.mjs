import assert from "node:assert/strict";

import { maybeHandleAccessRuntime } from "../workers/lib/access-runtime.mjs";
import { encodeBase64Url, signToken } from "../workers/lib/access-crypto.mjs";
import { maybeHandleVcOwnershipRuntime } from "../workers/lib/vc-ownership-runtime.mjs";

async function readJson(response) {
  return JSON.parse(await response.text());
}

function getCookie(response) {
  return response.headers.get("set-cookie") || "";
}

function sampleCompleteProfile() {
  return {
    legal_full_name: "Nguyen Van Chu So Huu",
    date_of_birth: "1994-08-19",
    country_code: "VN",
    phone_e164: "+84901234567",
    national_id_last4: "6789",
    address_line_1: "12 Duong So 9, Thu Duc",
    city: "Ho Chi Minh",
    consent_truthful_data: true,
    consent_privacy_policy: true,
  };
}

async function createSessionCookie(env, {
  candidateEmail = "vc-owner@vetuonglai.com",
  memberState = "pack_owner",
  entry = "member",
  returnTo = "/app/",
} = {}) {
  const request = new Request("https://member.vetuonglai.com/api/access/session/magic-link/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      candidate_email: candidateEmail,
      entry,
      intent: "specialist-pack",
      member_state: memberState,
      lang: "vi",
      return_to: returnTo,
    }),
  });

  const requested = await maybeHandleAccessRuntime(request, env);
  assert(requested);
  assert.equal(requested.status, 202);
  const requestedBody = await readJson(requested);
  assert.equal(requestedBody.status, "session_request_normalized");

  const consumed = await maybeHandleAccessRuntime(new Request(requestedBody.magicLink.magicLinkUrl), env);
  assert(consumed);
  assert.equal(consumed.status, 200);
  return getCookie(consumed);
}

async function testSecurityStatus(env) {
  const statusResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/security/status"), env);
  assert(statusResponse);
  assert.equal(statusResponse.status, 200);
  const statusPayload = await readJson(statusResponse);
  assert.equal(statusPayload.status, "vc_security_status");
  assert.equal(statusPayload.ready.identityAttestationSecret, true);
  assert.equal(statusPayload.ready.ownershipChallengeSecret, true);
  assert.equal(statusPayload.ownership.acceptedMimeTypes, "*/*");
  assert.equal(statusPayload.ownership.acceptedFileTypes, "all");
  assert.equal(statusPayload.protectionPolicy.profileVerification.required, true);
  assert(Array.isArray(statusPayload.enterprise.plans));
}

async function testEnterprisePlansEndpoint(env) {
  const response = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/enterprise/plans"), env);
  assert(response);
  assert.equal(response.status, 200);
  const payload = await readJson(response);
  assert.equal(payload.status, "vc_enterprise_plans");
  assert(payload.plans.length >= 3);
  assert(payload.plans.some((plan) => plan.key === "enterprise_core"));
}

async function testProtectionEligibilityAndMembershipGate(env) {
  const pendingCookie = await createSessionCookie(env, {
    candidateEmail: "vc-pending@vetuonglai.com",
    memberState: "pending_member",
  });

  const pendingEligibility = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/protection/eligibility", {
    headers: {
      cookie: pendingCookie,
    },
  }), env);
  assert(pendingEligibility);
  assert.equal(pendingEligibility.status, 200);
  const pendingEligibilityPayload = await readJson(pendingEligibility);
  assert.equal(pendingEligibilityPayload.status, "vc_protection_eligibility");
  assert.equal(pendingEligibilityPayload.eligibility.eligible, false);
  assert.equal(pendingEligibilityPayload.billing.plan, "membership_required");

  const deniedChallenge = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/ownership/challenge/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: pendingCookie,
    },
    body: JSON.stringify({}),
  }), env);
  assert(deniedChallenge);
  assert.equal(deniedChallenge.status, 402);
  const deniedChallengePayload = await readJson(deniedChallenge);
  assert.equal(deniedChallengePayload.status, "membership_required_for_vc_protection");

  const annualCookie = await createSessionCookie(env, {
    candidateEmail: "vc-annual@vetuonglai.com",
    memberState: "annual_active",
  });
  const annualEligibility = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/protection/eligibility", {
    headers: {
      cookie: annualCookie,
    },
  }), env);
  assert(annualEligibility);
  assert.equal(annualEligibility.status, 200);
  const annualEligibilityPayload = await readJson(annualEligibility);
  assert.equal(annualEligibilityPayload.eligibility.eligible, true);
  assert.equal(annualEligibilityPayload.billing.plan, "included_with_membership");
  assert.equal(annualEligibilityPayload.billing.amount, 0);
  assert.equal(annualEligibilityPayload.profileVerification.required, true);
  assert.equal(annualEligibilityPayload.profileVerification.verified, false);
}

async function testRuntimeEligibilityFromWebhookState(env) {
  const pendingCookie = await createSessionCookie(env, {
    candidateEmail: "vc-upgrade-runtime@vetuonglai.com",
    memberState: "pending_member",
  });

  const before = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/protection/eligibility", {
    headers: {
      cookie: pendingCookie,
    },
  }), env);
  assert(before);
  assert.equal(before.status, 200);
  const beforePayload = await readJson(before);
  assert.equal(beforePayload.eligibility.eligible, false);

  const webhook = await maybeHandleAccessRuntime(new Request("https://vetuonglai.com/api/access/webhooks/paypal/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      event_id: "evt_vc_runtime_upgrade_1",
      candidate_email: "vc-upgrade-runtime@vetuonglai.com",
      pack_key: "g5",
      annual_access_status: "active",
    }),
  }), env);
  assert(webhook);
  assert.equal(webhook.status, 202);

  const after = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/protection/eligibility", {
    headers: {
      cookie: pendingCookie,
    },
  }), env);
  assert(after);
  assert.equal(after.status, 200);
  const afterPayload = await readJson(after);
  assert.equal(afterPayload.eligibility.eligible, true);
  assert.equal(afterPayload.billing.plan, "included_with_membership");
  assert.equal(afterPayload.billing.amount, 0);
}

async function testTwoLayerOwnershipFlow(env) {
  const sessionCookie = await createSessionCookie(env, {
    candidateEmail: "vc-owner@vetuonglai.com",
    memberState: "pack_owner",
  });

  const blockedBeforeProfile = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/ownership/challenge/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({}),
  }), env);
  assert(blockedBeforeProfile);
  assert.equal(blockedBeforeProfile.status, 428);
  const blockedBeforeProfilePayload = await readJson(blockedBeforeProfile);
  assert.equal(blockedBeforeProfilePayload.status, "profile_verification_required");

  const profileResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/profile/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({
      profile: sampleCompleteProfile(),
    }),
  }), env);
  assert(profileResponse);
  assert.equal(profileResponse.status, 202);
  const profilePayload = await readJson(profileResponse);
  assert.equal(profilePayload.status, "profile_verified_complete");
  assert.equal(profilePayload.profileVerification.verified, true);

  const identityToken = await signToken({
    sub: "kyc-live-user-2026-04-15",
    provider: "sumsub",
    verification_status: "verified",
    assurance_level: 3,
    profile_verified: true,
    profile_hash_sha256: profilePayload.profileVerification.profileHashSha256,
    exp: Math.floor(Date.now() / 1000) + 20 * 60,
  }, env.VC_IDENTITY_ATTESTATION_SECRET);

  const identityResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/identity/attest", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({
      identity_token: identityToken,
    }),
  }), env);
  assert(identityResponse);
  assert.equal(identityResponse.status, 202);
  const identityPayload = await readJson(identityResponse);
  assert.equal(identityPayload.status, "identity_attested_real");
  assert.equal(identityPayload.identity.assuranceLevel, 3);
  assert.equal(identityPayload.profileVerification.verified, true);

  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"],
  );
  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

  const fileContent = "BANG-CHUNG-SO-HUU-TAI-SAN-SO-VTL-2026-04-15";
  const fileBase64 = btoa(fileContent);
  const challengeResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/ownership/challenge/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({
      asset_name: "Tai san so ho tro startup",
      asset_type: "digital_asset",
      file_name: "startup-proof.custom",
      mime_type: "application/x-vtl-proof",
      file_base64: fileBase64,
      public_key_jwk: publicKeyJwk,
      metadata: {
        category: "proof",
        source: "vc-user-upload",
      },
    }),
  }), env);
  assert(challengeResponse);
  assert.equal(challengeResponse.status, 202);
  const challengePayload = await readJson(challengeResponse);
  assert.equal(challengePayload.status, "ownership_challenge_created");
  assert.equal(challengePayload.ownership.noFileTypeWhitelist, true);
  assert.equal(challengePayload.ownership.acceptedMimeTypes, "*/*");
  assert.equal(challengePayload.challenge.signatureScheme, "ECDSA_P256_SHA256");
  assert.equal(challengePayload.billing.plan, "included_with_membership");
  assert.equal(challengePayload.billing.amount, 0);

  const signatureBuffer = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    keyPair.privateKey,
    new TextEncoder().encode(challengePayload.challenge.signingMessage),
  );
  const signatureBase64Url = encodeBase64Url(new Uint8Array(signatureBuffer));

  const verifyResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/ownership/challenge/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({
      challenge_id: challengePayload.challenge.challengeId,
      challenge_token: challengePayload.challenge.challengeToken,
      signature_base64url: signatureBase64Url,
    }),
  }), env);
  assert(verifyResponse);
  assert.equal(verifyResponse.status, 201);
  const verifyPayload = await readJson(verifyResponse);
  assert.equal(verifyPayload.status, "ownership_verified");
  assert.equal(verifyPayload.ownership.verification.level, "STRONG_2_LAYER");
  assert.equal(verifyPayload.ownership.asset.mimeType, "application/x-vtl-proof");

  const ownershipId = verifyPayload.ownership.ownershipId;
  const lookupResponse = await maybeHandleVcOwnershipRuntime(new Request(`https://vc.vetuonglai.com/api/vc/ownership/verify?ownership_id=${encodeURIComponent(ownershipId)}`), env);
  assert(lookupResponse);
  assert.equal(lookupResponse.status, 200);
  const lookupPayload = await readJson(lookupResponse);
  assert.equal(lookupPayload.status, "ownership_verified");
  assert.equal(lookupPayload.ownership.ownershipId, ownershipId);

  const duplicateResponse = await maybeHandleVcOwnershipRuntime(new Request("https://vc.vetuonglai.com/api/vc/ownership/challenge/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: sessionCookie,
    },
    body: JSON.stringify({
      asset_hash_sha256: verifyPayload.ownership.asset.assetHashSha256,
      public_key_jwk: publicKeyJwk,
    }),
  }), env);
  assert(duplicateResponse);
  assert.equal(duplicateResponse.status, 200);
  const duplicatePayload = await readJson(duplicateResponse);
  assert.equal(duplicatePayload.status, "ownership_already_verified");
  assert.equal(duplicatePayload.ownershipId, ownershipId);
}

async function main() {
  const env = {
    VTL_ENV: "production",
    PAYPAL_WEBHOOK_VERIFY_MODE: "bypass",
    SESSION_COOKIE_SECRET: "smoke-vc-session-secret",
    MAGIC_LINK_SIGNING_KEY: "smoke-vc-magic-secret",
    VC_IDENTITY_ATTESTATION_SECRET: "smoke-vc-identity-secret",
    VC_OWNERSHIP_CHALLENGE_SECRET: "smoke-vc-challenge-secret",
  };

  await testSecurityStatus(env);
  await testEnterprisePlansEndpoint(env);
  await testProtectionEligibilityAndMembershipGate(env);
  await testRuntimeEligibilityFromWebhookState(env);
  await testTwoLayerOwnershipFlow(env);

  console.log("smoke-vc-ownership-runtime: ok");
}

main().catch((error) => {
  console.error("smoke-vc-ownership-runtime: failed");
  console.error(error);
  process.exitCode = 1;
});
