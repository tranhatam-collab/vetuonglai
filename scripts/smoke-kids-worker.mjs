// Smoke test for the kids handlers in workers/generic-worker.mjs.
//
// Imports the worker module and drives its default.fetch() with hand-built
// Request objects, then asserts response status, headers, and JSON shape.
//
// Run: `node scripts/smoke-kids-worker.mjs`
// Exit 0 if every assertion passes; exit 1 otherwise.

import worker from "../workers/generic-worker.mjs";

let passed = 0;
let failed = 0;
const failures = [];

function pass(label) {
  passed += 1;
  console.log(`OK  ${label}`);
}

function fail(label, detail) {
  failed += 1;
  failures.push({ label, detail });
  console.log(`FAIL ${label} — ${detail}`);
}

function makeReq(method, url) {
  return new Request(url, { method });
}

function makeEnv() {
  // The kids handlers do not use env; ASSETS is a fallback only.
  return {
    ASSETS: {
      async fetch() {
        return new Response("not-found", { status: 404 });
      },
    },
  };
}

async function expectStatus(label, response, status) {
  if (!response) return fail(label, "no response returned");
  if (response.status !== status) return fail(label, `expected status ${status}, got ${response.status}`);
  pass(`${label} → status ${status}`);
}

async function expectHeader(label, response, header, valuePart) {
  const v = response.headers.get(header);
  if (!v) return fail(label, `header ${header} missing`);
  if (valuePart && !v.toLowerCase().includes(String(valuePart).toLowerCase())) {
    return fail(label, `header ${header}=${v} does not contain ${valuePart}`);
  }
  pass(`${label} → header ${header}`);
}

async function expectJsonField(label, response, jsonPath, predicate, predicateLabel) {
  let body;
  try {
    body = await response.clone().json();
  } catch (error) {
    return fail(label, `body is not JSON: ${error.message}`);
  }
  const segments = jsonPath.split(".").filter(Boolean);
  let cursor = body;
  for (const segment of segments) {
    if (cursor == null) return fail(label, `path ${jsonPath} stopped at undefined`);
    cursor = cursor[segment];
  }
  if (typeof predicate === "function") {
    if (!predicate(cursor)) return fail(label, `predicate ${predicateLabel || "<unnamed>"} failed for ${jsonPath} = ${JSON.stringify(cursor)}`);
  } else if (cursor !== predicate) {
    return fail(label, `expected ${jsonPath} = ${JSON.stringify(predicate)}, got ${JSON.stringify(cursor)}`);
  }
  pass(`${label} → ${jsonPath} ✓`);
}

async function run() {
  const env = makeEnv();

  // 1. Curriculum payload on kids host.
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/curriculum.json"), env);
    await expectStatus("kids curriculum", r, 200);
    await expectHeader("kids curriculum", r, "x-child-safe-zone", "kids.vetuonglai.com");
    await expectHeader("kids curriculum", r, "x-robots-tag", "noindex");
    await expectJsonField("kids curriculum", r, "name", "kids-curriculum");
    await expectJsonField("kids curriculum", r, "stages", (v) => Array.isArray(v) && v.length === 4, "stages.length === 4");
  }

  // 2. Contract payload on kids host.
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/contract.json"), env);
    await expectStatus("kids contract", r, 200);
    await expectJsonField("kids contract", r, "name", "kids-api-contract");
    await expectJsonField("kids contract", r, "endpoints", (v) => Array.isArray(v) && v.length >= 18, "endpoints.length >= 18");
  }

  // 3. parent.profile.get → 501 with contract spec
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/parent/profile"), env);
    await expectStatus("parent.profile.get stub", r, 501);
    await expectHeader("parent.profile.get stub", r, "cache-control", "no-store");
    await expectJsonField("parent.profile.get stub", r, "error.code", "NOT_IMPLEMENTED");
    await expectJsonField("parent.profile.get stub", r, "error.endpoint.id", "parent.profile.get");
    await expectJsonField("parent.profile.get stub", r, "error.endpoint.method", "GET");
  }

  // 4. parent.profile.post → 501 with same path, different method
  {
    const r = await worker.fetch(makeReq("POST", "https://kids.vetuonglai.com/api/kids/parent/profile"), env);
    await expectStatus("parent.profile.post stub", r, 501);
    await expectJsonField("parent.profile.post stub", r, "error.endpoint.id", "parent.profile.post");
    await expectJsonField("parent.profile.post stub", r, "error.endpoint.method", "POST");
  }

  // 5. parent.profile DELETE → no contract entry, fall through
  {
    const r = await worker.fetch(makeReq("DELETE", "https://kids.vetuonglai.com/api/kids/parent/profile"), env);
    await expectStatus("parent.profile.delete fallthrough", r, 404);
  }

  // 6. lesson.detail.get with slug → 501 with params.slug echoed
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/lesson/intro-to-thinking"), env);
    await expectStatus("lesson.detail.get stub", r, 501);
    await expectJsonField("lesson.detail.get stub", r, "error.endpoint.id", "lesson.detail.get");
    await expectJsonField("lesson.detail.get stub", r, "error.params.slug", "intro-to-thinking");
  }

  // 7. lesson.progress (no param) — literal path wins over :slug regex
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/lesson/progress"), env);
    await expectStatus("lesson.progress.get stub", r, 501);
    await expectJsonField("lesson.progress.get stub", r, "error.endpoint.id", "lesson.progress.get");
  }

  // 8. AI session messages with two params
  {
    const r = await worker.fetch(makeReq("GET", "https://kids.vetuonglai.com/api/kids/ai/sessions/sess_xyz/messages"), env);
    await expectStatus("ai.session.messages.get stub", r, 501);
    await expectJsonField("ai.session.messages.get stub", r, "error.endpoint.id", "ai.session.messages.get");
    await expectJsonField("ai.session.messages.get stub", r, "error.params.session_id", "sess_xyz");
  }

  // 9. Cross-host isolation — kids endpoint must NOT respond on hub host
  {
    const r = await worker.fetch(makeReq("GET", "https://vetuonglai.com/api/kids/curriculum.json"), env);
    await expectStatus("kids leak gate (hub)", r, 404);
  }
  {
    const r = await worker.fetch(makeReq("GET", "https://member.vetuonglai.com/api/kids/parent/profile"), env);
    await expectStatus("kids leak gate (member)", r, 404);
  }

  // 10. Existing Team 4 contract on hub host — regression check
  {
    const r = await worker.fetch(makeReq("GET", "https://vetuonglai.com/api/team4/package-form-registry.json"), env);
    await expectStatus("team4 package-form-registry", r, 200);
    await expectJsonField("team4 package-form-registry", r, "version", (v) => typeof v === "string" && v.length > 0, "version is non-empty string");
  }

  // 11. www.kids.vetuonglai.com mirror — must also resolve kids endpoints
  {
    const r = await worker.fetch(makeReq("GET", "https://www.kids.vetuonglai.com/api/kids/curriculum.json"), env);
    await expectStatus("www.kids curriculum", r, 200);
  }

  // 12. workers.dev preview — vetuonglai-kids.<account>.workers.dev is the
  //     auto-generated dev URL Cloudflare exposes when the worker is
  //     deployed. It must also resolve kids endpoints so the team can
  //     review dev builds before DNS is bound.
  {
    const r = await worker.fetch(makeReq("GET", "https://vetuonglai-kids.example-account.workers.dev/api/kids/curriculum.json"), env);
    await expectStatus("workers.dev preview curriculum", r, 200);
  }
  {
    const r = await worker.fetch(makeReq("GET", "https://vetuonglai-kids.example-account.workers.dev/api/kids/parent/profile"), env);
    await expectStatus("workers.dev preview stub", r, 501);
  }
  // Other workers.dev addresses (different script name) must NOT serve kids.
  {
    const r = await worker.fetch(makeReq("GET", "https://vetuonglai-home.example-account.workers.dev/api/kids/curriculum.json"), env);
    await expectStatus("workers.dev wrong-script gate", r, 404);
  }

  // Summary
  console.log("");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("smoke harness threw:", error);
  process.exitCode = 1;
});
