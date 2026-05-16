#!/usr/bin/env node
// Smoke test for 6 new platform runtimes (community/jobs/affiliate/analytics/notify/admin)
import { maybeHandleCommunityRuntime } from "../workers/lib/community-runtime.mjs";
import { maybeHandleJobsRuntime } from "../workers/lib/jobs-runtime.mjs";
import { maybeHandleAffiliateRuntime } from "../workers/lib/affiliate-runtime.mjs";
import { maybeHandleAnalyticsRuntime } from "../workers/lib/analytics-runtime.mjs";
import { maybeHandleNotifyRuntime } from "../workers/lib/notify-runtime.mjs";
import { maybeHandleAdminCmsRuntime } from "../workers/lib/admin-cms-runtime.mjs";

const env = {
  SESSION_COOKIE_SECRET: "test-session-secret",
  WALLET_INTERNAL_TOKEN: "internal-test",
  FOUNDER_EMAILS: "founder@test.com",
};

async function signValueHex(secret, value) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(s), (b) => b.toString(16).padStart(2, "0")).join("");
}
function toB64u(bytes) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replaceAll("+","-").replaceAll("/","_").replaceAll("=",""); }
async function cookieFor(email) {
  const payload = { candidate_email: email, exp: Math.floor(Date.now()/1000)+3600 };
  const enc = toB64u(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await signValueHex(env.SESSION_COOKIE_SECRET, enc);
  return `vtl_session=${enc}.${sig}`;
}

function req(path, { method="GET", cookie="", body=null, headers={} } = {}) {
  const init = { method, headers: { ...headers } };
  if (cookie) init.headers.cookie = cookie;
  if (body !== null) { init.body = JSON.stringify(body); init.headers["content-type"] = "application/json"; }
  return new Request(`https://vetuonglai.com${path}`, init);
}

async function call(handler, label, r) {
  const resp = await handler(r, env);
  const text = await resp.text();
  let j; try { j = JSON.parse(text); } catch { j = text; }
  console.log(`\n[${resp.status}] ${label}`);
  console.log(JSON.stringify(j, null, 2).slice(0, 500));
  return { status: resp.status, body: j };
}

async function main() {
  const aliceCookie = await cookieFor("alice@test.com");
  const bobCookie = await cookieFor("bob@test.com");
  const founderCookie = await cookieFor("founder@test.com");

  // ===== Community =====
  console.log("\n========== COMMUNITY ==========");
  await call(maybeHandleCommunityRuntime, "GET /api/community/health", req("/api/community/health"));
  const postRes = await call(maybeHandleCommunityRuntime, "POST /api/community/posts (alice)", req("/api/community/posts", { method: "POST", cookie: aliceCookie, body: { circle: "edu", title: "Hỏi về khóa Startup-1000", body: "Mọi người thấy phần module 3 thế nào?" } }));
  const postId = postRes.body.post?.id;
  await call(maybeHandleCommunityRuntime, "GET /api/community/posts?circle=edu", req("/api/community/posts?circle=edu"));
  await call(maybeHandleCommunityRuntime, "POST /api/community/posts/{id}/comments (bob)", req(`/api/community/posts/${postId}/comments`, { method: "POST", cookie: bobCookie, body: { body: "Mình thấy module 3 rất sâu." } }));
  await call(maybeHandleCommunityRuntime, "POST /api/community/posts/{id}/react (bob)", req(`/api/community/posts/${postId}/react`, { method: "POST", cookie: bobCookie, body: { reaction: "insight" } }));
  await call(maybeHandleCommunityRuntime, "GET /api/community/posts/{id}", req(`/api/community/posts/${postId}`));

  // ===== Jobs =====
  console.log("\n========== JOBS ==========");
  await call(maybeHandleJobsRuntime, "GET /api/jobs/health", req("/api/jobs/health"));
  const job = await call(maybeHandleJobsRuntime, "POST /api/jobs/listings", req("/api/jobs/listings", { method: "POST", cookie: aliceCookie, body: { title: "Cần viết landing page", description: "Cần freelancer viết copy + landing page cho khóa mới", job_type: "freelance", budget_vnd: 5000000, skills: ["copywriting", "html"] } }));
  const jobId = job.body.listing?.id;
  await call(maybeHandleJobsRuntime, "GET /api/jobs/listings", req("/api/jobs/listings"));
  await call(maybeHandleJobsRuntime, "POST /api/jobs/listings/{id}/apply (bob)", req(`/api/jobs/listings/${jobId}/apply`, { method: "POST", cookie: bobCookie, body: { note: "Mình đã làm 5 landing", proposed_budget_vnd: 4500000 } }));
  await call(maybeHandleJobsRuntime, "GET /api/jobs/applications/me (bob)", req("/api/jobs/applications/me", { cookie: bobCookie }));

  // ===== Affiliate =====
  console.log("\n========== AFFILIATE ==========");
  await call(maybeHandleAffiliateRuntime, "GET /api/affiliate/health", req("/api/affiliate/health"));
  const aff = await call(maybeHandleAffiliateRuntime, "POST /api/affiliate/codes", req("/api/affiliate/codes", { method: "POST", cookie: aliceCookie, body: { code: "alice-edu", target_url: "https://edu.vetuonglai.com/course/startup-1000/" } }));
  const code = aff.body.code?.code;
  await call(maybeHandleAffiliateRuntime, "GET /r/{code}", req(`/r/${code}`));
  await call(maybeHandleAffiliateRuntime, "POST /api/affiliate/conversion (internal)", req("/api/affiliate/conversion", { method: "POST", headers: { "x-internal-token": "internal-test" }, body: { code, order_ref: "order-1", amount_vnd: 1000000, subject_email: "buyer@test.com" } }));
  await call(maybeHandleAffiliateRuntime, "GET /api/affiliate/stats", req("/api/affiliate/stats", { cookie: aliceCookie }));

  // ===== Analytics =====
  console.log("\n========== ANALYTICS ==========");
  await call(maybeHandleAnalyticsRuntime, "POST /api/analytics/events", req("/api/analytics/events", { method: "POST", body: { name: "page_view", host: "vetuonglai.com", path: "/", props: { source: "smoke" } } }));
  await call(maybeHandleAnalyticsRuntime, "POST /api/analytics/events (signup)", req("/api/analytics/events", { method: "POST", body: { name: "signup_started", host: "vetuonglai.com", path: "/signup" } }));
  await call(maybeHandleAnalyticsRuntime, "GET /api/analytics/summary (founder)", req("/api/analytics/summary", { cookie: founderCookie }));
  await call(maybeHandleAnalyticsRuntime, "GET /api/analytics/summary (NOT founder, should 403)", req("/api/analytics/summary", { cookie: aliceCookie }));

  // ===== Notify =====
  console.log("\n========== NOTIFY ==========");
  await call(maybeHandleNotifyRuntime, "POST /api/notify/send (internal)", req("/api/notify/send", { method: "POST", headers: { "x-internal-token": "internal-test" }, body: { recipient_email: "alice@test.com", template: "wallet_credited", lang: "vi", vars: { amount: "50.000", source: "edu" } } }));
  await call(maybeHandleNotifyRuntime, "GET /api/notify/inbox (alice)", req("/api/notify/inbox", { cookie: aliceCookie }));

  // ===== Admin CMS =====
  console.log("\n========== ADMIN CMS ==========");
  await call(maybeHandleAdminCmsRuntime, "PUT /api/admin/cms/content (founder)", req("/api/admin/cms/content", { method: "PUT", cookie: founderCookie, body: { key: "home.hero.title", type: "snippet", title: "Hero title", body: "Sống rõ ràng, làm có bằng chứng", visibility: "public" } }));
  await call(maybeHandleAdminCmsRuntime, "GET /api/admin/cms/content?key=home.hero.title", req("/api/admin/cms/content?key=home.hero.title"));
  await call(maybeHandleAdminCmsRuntime, "PUT (NOT founder, should 403)", req("/api/admin/cms/content", { method: "PUT", cookie: aliceCookie, body: { key: "evil", body: "X" } }));
  await call(maybeHandleAdminCmsRuntime, "GET /api/admin/cms/list (founder)", req("/api/admin/cms/list", { cookie: founderCookie }));

  console.log("\n\n✅ ALL SMOKE CHECKS COMPLETE.");
}
main().catch((e) => { console.error("FAIL:", e); process.exit(1); });
