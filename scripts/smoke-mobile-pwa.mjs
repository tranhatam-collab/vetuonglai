import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.resolve(process.env.VTL_DIST_ROOT || path.join(ROOT, "dist"));
const DIST = path.join(DIST_ROOT, "member.vetuonglai.com");

async function read(relativePath) {
  return readFile(path.join(DIST, relativePath), "utf8");
}

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

async function main() {
  const appHtml = await read("app/index.html");
  const offlineHtml = await read("app/offline/index.html");
  const swJs = await read("app/sw.js");
  const manifest = await readJson("app/manifest.webmanifest");
  const mobileConfig = await readJson("api/mobile-config.json");
  const routingContract = await readJson("api/access/routing-contract.json");
  const sessionStates = await readJson("api/mobile/session-states.json");
  const eduSnapshot = await readJson("api/mobile/edu-catalog.json");
  const vcSnapshot = await readJson("api/mobile/vc-certificates.json");

  assert(appHtml.includes('rel="manifest" href="/app/manifest.webmanifest"'));
  assert(appHtml.includes("/app/sw.js"));
  assert(appHtml.includes("No in-app payment") || appHtml.includes("Không xử lý thanh toán trong app"));

  assert(offlineHtml.toLowerCase().includes("offline"));

  assert(swJs.includes("PRECACHE_URLS"));
  assert(swJs.includes("/app/offline/"));
  assert(swJs.includes("caches.open"));

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.scope, "/app/");
  assert.equal(manifest.start_url.startsWith("/app/"), true);
  assert(Array.isArray(manifest.icons));
  assert(manifest.icons.length >= 2);

  assert.equal(mobileConfig.paymentInAppEnabled, false);
  assert(Array.isArray(mobileConfig.telemetry.requiredEvents));
  const requiredEvents = [
    "mobile_app_open",
    "mobile_login_success",
    "mobile_edu_lesson_start",
    "mobile_edu_lesson_complete",
    "mobile_vc_verify_open",
    "dashboard_open",
    "dashboard_next_step_click",
    "dashboard_domain_open_click",
    "dashboard_pack_view_click",
    "dashboard_renew_click",
  ];
  for (const eventKey of requiredEvents) {
    assert(mobileConfig.telemetry.requiredEvents.includes(eventKey));
  }
  assert(typeof mobileConfig.endpoints.sessionCurrent === "string");
  assert(typeof mobileConfig.endpoints.eduCatalog === "string");
  assert(typeof mobileConfig.endpoints.vcCertificates === "string");
  assert(typeof mobileConfig.endpoints.routingContract === "string");
  assert(typeof mobileConfig.endpoints.mobileStates === "string");
  assert(typeof mobileConfig.endpoints.team3PolicyMatrix === "string");
  assert.equal(mobileConfig.commercePolicy.redirectToHub.includes("source=member-app"), true);

  assert.equal(routingContract.routeContract.purchaseHub.domain, "vetuonglai.com");
  assert.equal(Array.isArray(routingContract.routeContract.queryParams), true);
  assert(routingContract.routeContract.queryParams.some((param) => param.name === "entry"));
  assert(routingContract.routeContract.queryParams.some((param) => param.name === "intent"));

  assert(Array.isArray(sessionStates.identityStates));
  assert(sessionStates.identityStates.some((state) => state.key === "annual_active"));
  assert(sessionStates.identityStates.some((state) => state.key === "pack_owner"));

  assert(appHtml.includes("/api/mobile-config.json"));
  assert(appHtml.includes("/api/access/routing-contract.json"));
  assert(appHtml.includes("/api/mobile/session-states.json"));
  assert(appHtml.includes("/api/team3-policy-matrix.json"));
  assert(appHtml.includes("mobile-dashboard"));
  assert(appHtml.includes("mobile-state-note"));
  assert(appHtml.includes("mobile-route-note"));
  assert(appHtml.includes("mobile-affiliate-note"));
  assert(appHtml.includes("mobile-state-contract"));
  assert(appHtml.includes("mobile-next-step-title"));
  assert(appHtml.includes("mobile-next-step-primary"));
  assert(appHtml.includes("mobile-opened-summary"));
  assert(appHtml.includes("mobile-opened-detail"));
  assert(appHtml.includes("mobile-recommendation-list"));
  assert(appHtml.includes("mobile-primary-cta"));
  assert(appHtml.includes("data-mobile-requires-auth"));
  assert(appHtml.includes("edu-lesson-complete"));
  assert(appHtml.includes("mobile_edu_lesson_complete"));
  assert(appHtml.includes("mobile_vc_verify_open"));
  assert(appHtml.includes("dashboard_open"));
  assert(appHtml.includes("dashboard_next_step_click"));
  assert(appHtml.includes("dashboard_domain_open_click"));
  assert(appHtml.includes("dashboard_pack_view_click"));
  assert(appHtml.includes("dashboard_renew_click"));
  assert(appHtml.includes("vetuonglai:languagechange"));
  assert(appHtml.includes("timestamp: new Date().toISOString()"));
  assert(appHtml.includes("route: window.location.pathname + window.location.search"));
  assert(appHtml.includes("screen: screenKey"));
  assert(appHtml.includes("language: currentLanguage()"));
  assert(appHtml.includes("member_state: getMemberState()"));
  assert(appHtml.includes("annual_active"));
  assert(appHtml.includes("pack_owner"));

  assert(Array.isArray(eduSnapshot.courses));
  assert(eduSnapshot.courses.length >= 3);
  assert(Array.isArray(vcSnapshot.certificates));
  assert(vcSnapshot.certificates.length >= 3);

  console.log("smoke-mobile-pwa: ok");
}

main().catch((error) => {
  console.error("smoke-mobile-pwa: failed");
  console.error(error);
  process.exitCode = 1;
});
