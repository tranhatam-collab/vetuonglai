import assert from "node:assert/strict";
import worker from "../workers/generic-worker.mjs";

async function readJson(response) {
  return await response.json();
}

function request(path, init = {}) {
  return new Request(`https://vetuonglai.com${path}`, init);
}

async function main() {
  const registry = await worker.fetch(request("/api/email/forms/registry.json"), {});
  assert.equal(registry.status, 200, "registry endpoint returns 200");
  const registryBody = await readJson(registry);
  assert.equal(registryBody.domain, "vetuonglai.com", "registry domain is vetuonglai.com");
  assert.ok(Array.isArray(registryBody.purposeRoutes), "purpose routes are exposed");
  assert.ok(registryBody.purposeRoutes.length >= 6, "purpose routes cover core form types");

  const invalid = await worker.fetch(request("/api/email/forms/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      form_key: "vetuonglai_contact_intake_v1",
      purpose: "general",
      name: "Smoke",
      email: "not-an-email",
      message: "Xin chao",
    }),
  }), {});
  assert.equal(invalid.status, 400, "invalid email is rejected");

  const queued = await worker.fetch(request("/api/email/forms/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      form_key: "vetuonglai_contact_intake_v1",
      purpose: "payment_access",
      name: "Smoke Test",
      email: "smoke@example.com",
      message: "Can kiem tra quyen truy cap sau thanh toan.",
      locale: "vi",
      page_url: "https://vetuonglai.com/lien-he/",
    }),
  }), {});
  assert.equal(queued.status, 202, "valid form is accepted without mail runtime");
  const queuedBody = await readJson(queued);
  assert.equal(queuedBody.ok, true);
  assert.equal(queuedBody.status, "queued_without_delivery");
  assert.deepEqual(queuedBody.delivery.internal.missing_env, [
    "MAIL_API_BASE_URL",
    "MAIL_API_KEY",
    "MAIL_API_WORKSPACE_ID",
  ]);

  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({
      message_id: `msg_test_${calls.length}`,
      status: "queued",
    }), {
      status: 202,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    const delivered = await worker.fetch(request("/api/email/forms/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        form_key: "vetuonglai_contact_intake_v1",
        purpose: "partnership",
        name: "Smoke Partner",
        email: "partner@example.com",
        message: "Muon trao doi hop tac voi VTL.",
        locale: "en",
      }),
    }), {
      MAIL_API_BASE_URL: "https://api.mail.iai.one/v1",
      MAIL_API_KEY: "test-key",
      MAIL_API_WORKSPACE_ID: "vetuonglai",
      VTL_EMAIL_AUDIT_BCC: "audit@example.com",
    });
    assert.equal(delivered.status, 202, "valid form is accepted with mail runtime");
    const deliveredBody = await readJson(delivered);
    assert.equal(deliveredBody.status, "submitted_and_email_handoff_accepted");
    assert.equal(deliveredBody.delivery.internal.message_id, "msg_test_1");
    assert.equal(deliveredBody.delivery.acknowledgement.message_id, "msg_test_2");
    assert.equal(calls.length, 2, "internal and acknowledgement emails are sent");
  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log("PASS: email form runtime smoke");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
