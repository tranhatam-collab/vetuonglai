import { access, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(process.env.VTL_DIST_ROOT || path.join(ROOT, "dist"));
const BUILD_LOCK_DIR = path.join(DIST, ".build-lock");
const BUILD_LOCK_MAX_AGE_MS = 15 * 60 * 1000;
const CHECK_BUILD_LOCK_WAIT_MS = Number(process.env.VTL_CHECK_BUILD_LOCK_WAIT_MS || 5 * 60 * 1000);
const domains = {
  member: "member.vetuonglai.com",
  work: "work.vetuonglai.com",
  market: "market.vetuonglai.com",
  community: "community.vetuonglai.com",
  ai: "ai.vetuonglai.com",
  business: "business.vetuonglai.com",
};

const requiredFiles = [
  "vetuonglai.com/index.html",
  "vetuonglai.com/ve-chung-toi/index.html",
  "vetuonglai.com/he-sinh-thai/index.html",
  "vetuonglai.com/bat-dau/index.html",
  "vetuonglai.com/thanh-vien/index.html",
  "vetuonglai.com/tin-tuc/index.html",
  "vetuonglai.com/lien-he/index.html",
  "vetuonglai.com/sitemap/index.html",
  "vetuonglai.com/founder/index.html",
  "vetuonglai.com/apps.json",
  "vetuonglai.com/manifest.json",
  "vetuonglai.com/api/registry.json",
  "vetuonglai.com/api/index.json",
  "vetuonglai.com/api/purchase-hub.json",
  "vetuonglai.com/api/team2-kickoff-output.json",
  "vetuonglai.com/api/disclosures.json",
  "vetuonglai.com/api/system-registry.json",
  "vetuonglai.com/api/official-docs-lock.json",
  "vetuonglai.com/api/policy/team3-matrix.json",
  "vetuonglai.com/api/team4/package-form-registry.json",
  "vetuonglai.com/api/team4/business-domain-contract.json",
  "vetuonglai.com/api/team4/package-comparison-demo-output.json",
  "vetuonglai.com/api/contracts.json",
  "vetuonglai.com/sitemap-index.xml",
  "vc.vetuonglai.com/index.html",
  "vc.vetuonglai.com/v/index.html",
  "vc.vetuonglai.com/issuers/index.html",
  "vc.vetuonglai.com/methods/index.html",
  "vc.vetuonglai.com/_worker.js",
  "vc.vetuonglai.com/_redirects",
  "vc.vetuonglai.com/api/certificates.json",
  "edu.vetuonglai.com/index.html",
  "edu.vetuonglai.com/courses/index.html",
  "edu.vetuonglai.com/api/courses/index.json",
  "edu.vetuonglai.com/api/health",
  "edu.vetuonglai.com/api/catalog.json",
  "member.vetuonglai.com/index.html",
  "member.vetuonglai.com/journey/index.html",
  "member.vetuonglai.com/app/index.html",
  "member.vetuonglai.com/app/offline/index.html",
  "member.vetuonglai.com/app/manifest.webmanifest",
  "member.vetuonglai.com/app/sw.js",
  "member.vetuonglai.com/assets/pwa-icon.svg",
  "member.vetuonglai.com/assets/pwa-maskable.svg",
  "member.vetuonglai.com/api/health",
  "member.vetuonglai.com/api/summary.json",
  "member.vetuonglai.com/api/levels.json",
  "member.vetuonglai.com/api/access-model.json",
  "member.vetuonglai.com/api/entitlements.json",
  "member.vetuonglai.com/api/enterprise-plans.json",
  "member.vetuonglai.com/api/events.json",
  "member.vetuonglai.com/api/system-registry.json",
  "member.vetuonglai.com/api/official-docs-lock.json",
  "member.vetuonglai.com/api/team3-policy-matrix.json",
  "member.vetuonglai.com/api/team4/package-form-registry.json",
  "member.vetuonglai.com/api/team4/business-domain-contract.json",
  "member.vetuonglai.com/api/team4/package-comparison-demo-output.json",
  "member.vetuonglai.com/api/contracts.json",
  "member.vetuonglai.com/api/routing.json",
  "member.vetuonglai.com/api/access/routing-contract.json",
  "member.vetuonglai.com/api/mobile-config.json",
  "member.vetuonglai.com/api/mobile/edu-catalog.json",
  "member.vetuonglai.com/api/mobile/vc-certificates.json",
  "member.vetuonglai.com/api/mobile/session-states.json",
  "member.vetuonglai.com/api/index.json",
  "work.vetuonglai.com/index.html",
  "work.vetuonglai.com/brief/index.html",
  "work.vetuonglai.com/api/health",
  "work.vetuonglai.com/api/summary.json",
  "work.vetuonglai.com/api/briefs.json",
  "work.vetuonglai.com/api/index.json",
  "market.vetuonglai.com/index.html",
  "market.vetuonglai.com/rules/index.html",
  "market.vetuonglai.com/api/health",
  "market.vetuonglai.com/api/summary.json",
  "market.vetuonglai.com/api/listings.json",
  "market.vetuonglai.com/api/index.json",
  "community.vetuonglai.com/index.html",
  "community.vetuonglai.com/principles/index.html",
  "community.vetuonglai.com/api/health",
  "community.vetuonglai.com/api/summary.json",
  "community.vetuonglai.com/api/circle-preview.json",
  "community.vetuonglai.com/api/index.json",
  "ai.vetuonglai.com/index.html",
  "ai.vetuonglai.com/use-cases/index.html",
  "ai.vetuonglai.com/api/health",
  "ai.vetuonglai.com/api/summary.json",
  "ai.vetuonglai.com/api/use-cases.json",
  "ai.vetuonglai.com/api/index.json",
  "business.vetuonglai.com/index.html",
  "business.vetuonglai.com/api/health",
  "business.vetuonglai.com/api/summary.json",
  "business.vetuonglai.com/api/team4/package-form-registry.json",
  "business.vetuonglai.com/api/team4/business-domain-contract.json",
  "business.vetuonglai.com/api/team4/package-comparison-demo-output.json",
  "business.vetuonglai.com/api/business/contracts.json",
  "business.vetuonglai.com/api/index.json",
  "business.vetuonglai.com/sitemap.xml",
  "green.vetuonglai.com/index.html",
  "finance.vetuonglai.com/index.html",
  "life.vetuonglai.com/index.html",
  "invest.vetuonglai.com/index.html",
  "kids.vetuonglai.com/index.html",
  "kids.vetuonglai.com/parent/onboarding/consent/index.html",
  "kids.vetuonglai.com/parent/onboarding/child-profile/index.html",
  "kids.vetuonglai.com/parent/dashboard/index.html",
  "kids.vetuonglai.com/parent/pricing/index.html",
  "kids.vetuonglai.com/parent/support/sessions/index.html",
  "kids.vetuonglai.com/learn/dashboard/index.html",
  "kids.vetuonglai.com/learn/lessons/index.html",
  "kids.vetuonglai.com/learn/ai-helper/index.html",
  "kids.vetuonglai.com/learn/achievements/index.html",
  "kids.vetuonglai.com/api/curriculum.json",
  "kids.vetuonglai.com/api/health",
  "kids.vetuonglai.com/api/registry.json",
  "kids.vetuonglai.com/assets/kids.css",
  "kids.vetuonglai.com/assets/kids.js",
  "kids.vetuonglai.com/robots.txt",
  "read.vetuonglai.com/index.html",
  "read.vetuonglai.com/books/index.html",
  "read.vetuonglai.com/how-we-pay/index.html",
  "read.vetuonglai.com/transparency/index.html",
  "read.vetuonglai.com/creator/index.html",
  "read.vetuonglai.com/submit/index.html",
  "read.vetuonglai.com/review/index.html",
  "read.vetuonglai.com/stacks/index.html",
  "read.vetuonglai.com/terms/index.html",
  "read.vetuonglai.com/tax-note/index.html",
  "read.vetuonglai.com/assets/read.css",
  "read.vetuonglai.com/assets/read.js"
];

async function assertFile(relativePath) {
  await access(path.join(DIST, relativePath));
}

async function waitForBuildLockRelease() {
  const startedMs = Date.now();

  while (true) {
    try {
      const lockStats = await stat(BUILD_LOCK_DIR);
      const lockAgeMs = Date.now() - lockStats.mtimeMs;
      if (lockAgeMs > BUILD_LOCK_MAX_AGE_MS) {
        await rm(BUILD_LOCK_DIR, { recursive: true, force: true });
        continue;
      }

      if (Date.now() - startedMs > CHECK_BUILD_LOCK_WAIT_MS) {
        throw new Error("check.mjs timed out waiting for build lock release.");
      }

      await delay(500);
      continue;
    } catch (error) {
      if (error?.code === "ENOENT") {
        return;
      }
      throw error;
    }
  }
}

function countOccurrences(haystack, needle) {
  return String(haystack || "").split(needle).length - 1;
}

function assertIncludesAll(html, label, fragments) {
  for (const fragment of fragments) {
    if (!String(html || "").includes(fragment)) {
      throw new Error(`${label} thieu fragment bat buoc: ${fragment}`);
    }
  }
}

async function main() {
  await waitForBuildLockRelease();

  const localeRegistry = JSON.parse(await readFile(path.join(ROOT, "content", "locale-registry.json"), "utf8"));
  const activePublicLocales = Array.isArray(localeRegistry.activePublicLocales)
    ? localeRegistry.activePublicLocales.filter((entry) => entry?.status === "active")
    : [];

  for (const file of requiredFiles) {
    await assertFile(file);
  }

  const apps = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "apps.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "manifest.json"), "utf8"));
  const hubApiIndex = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "index.json"), "utf8"));
  const purchaseHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "purchase-hub.json"), "utf8"));
  const team2Kickoff = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "team2-kickoff-output.json"), "utf8"));
  const disclosures = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "disclosures.json"), "utf8"));
  const systemRegistryHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "system-registry.json"), "utf8"));
  const officialDocsHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "official-docs-lock.json"), "utf8"));
  const team3PolicyMatrix = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "policy", "team3-matrix.json"), "utf8"));
  const team4PackageFormRegistryHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "team4", "package-form-registry.json"), "utf8"));
  const team4BusinessDomainContractHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "team4", "business-domain-contract.json"), "utf8"));
  const team4PackageComparisonDemoOutputHub = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "team4", "package-comparison-demo-output.json"), "utf8"));
  const hubContracts = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "contracts.json"), "utf8"));
  const certificates = JSON.parse(await readFile(path.join(DIST, "vc.vetuonglai.com", "api", "certificates.json"), "utf8"));
  const catalog = JSON.parse(await readFile(path.join(DIST, "edu.vetuonglai.com", "api", "catalog.json"), "utf8"));
  const registry = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "api", "registry.json"), "utf8"));
  const redirects = await readFile(path.join(DIST, "vc.vetuonglai.com", "_redirects"), "utf8");
  const health = JSON.parse(await readFile(path.join(DIST, "edu.vetuonglai.com", "api", "health"), "utf8"));
  const hubHtml = await readFile(path.join(DIST, "vetuonglai.com", "index.html"), "utf8");
  const founderHtml = await readFile(path.join(DIST, "vetuonglai.com", "founder", "index.html"), "utf8");
  const vcHtml = await readFile(path.join(DIST, "vc.vetuonglai.com", "index.html"), "utf8");
  const eduHtml = await readFile(path.join(DIST, "edu.vetuonglai.com", "index.html"), "utf8");
  const investHtml = await readFile(path.join(DIST, "invest.vetuonglai.com", "index.html"), "utf8");
  const hubStartHtml = await readFile(path.join(DIST, "vetuonglai.com", "bat-dau", "index.html"), "utf8");
  const vcIssuersHtml = await readFile(path.join(DIST, "vc.vetuonglai.com", "issuers", "index.html"), "utf8");
  const memberHtml = await readFile(path.join(DIST, "member.vetuonglai.com", "index.html"), "utf8");
  const memberJourneyHtml = await readFile(path.join(DIST, "member.vetuonglai.com", "journey", "index.html"), "utf8");
  const memberAppHtml = await readFile(path.join(DIST, "member.vetuonglai.com", "app", "index.html"), "utf8");
  const memberAppOfflineHtml = await readFile(path.join(DIST, "member.vetuonglai.com", "app", "offline", "index.html"), "utf8");
  const memberAppServiceWorker = await readFile(path.join(DIST, "member.vetuonglai.com", "app", "sw.js"), "utf8");
  const memberPwaManifest = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "app", "manifest.webmanifest"), "utf8"));
  const workHtml = await readFile(path.join(DIST, "work.vetuonglai.com", "index.html"), "utf8");
  const workBriefHtml = await readFile(path.join(DIST, "work.vetuonglai.com", "brief", "index.html"), "utf8");
  const marketHtml = await readFile(path.join(DIST, "market.vetuonglai.com", "index.html"), "utf8");
  const marketRulesHtml = await readFile(path.join(DIST, "market.vetuonglai.com", "rules", "index.html"), "utf8");
  const communityHtml = await readFile(path.join(DIST, "community.vetuonglai.com", "index.html"), "utf8");
  const communityPrinciplesHtml = await readFile(path.join(DIST, "community.vetuonglai.com", "principles", "index.html"), "utf8");
  const aiHtml = await readFile(path.join(DIST, "ai.vetuonglai.com", "index.html"), "utf8");
  const aiUseCasesHtml = await readFile(path.join(DIST, "ai.vetuonglai.com", "use-cases", "index.html"), "utf8");
  const businessHtml = await readFile(path.join(DIST, "business.vetuonglai.com", "index.html"), "utf8");
  const eduCoursesHtml = await readFile(path.join(DIST, "edu.vetuonglai.com", "courses", "index.html"), "utf8");
  const greenHtml = await readFile(path.join(DIST, "green.vetuonglai.com", "index.html"), "utf8");
  const financeHtml = await readFile(path.join(DIST, "finance.vetuonglai.com", "index.html"), "utf8");
  const lifeHtml = await readFile(path.join(DIST, "life.vetuonglai.com", "index.html"), "utf8");
  const hubMemberHtml = await readFile(path.join(DIST, "vetuonglai.com", "thanh-vien", "index.html"), "utf8");
  const memberSummary = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "summary.json"), "utf8"));
  const workSummary = JSON.parse(await readFile(path.join(DIST, "work.vetuonglai.com", "api", "summary.json"), "utf8"));
  const marketSummary = JSON.parse(await readFile(path.join(DIST, "market.vetuonglai.com", "api", "summary.json"), "utf8"));
  const communitySummary = JSON.parse(await readFile(path.join(DIST, "community.vetuonglai.com", "api", "summary.json"), "utf8"));
  const aiSummary = JSON.parse(await readFile(path.join(DIST, "ai.vetuonglai.com", "api", "summary.json"), "utf8"));
  const businessSummary = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "summary.json"), "utf8"));
  const memberIndex = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "index.json"), "utf8"));
  const accessModel = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "access-model.json"), "utf8"));
  const entitlements = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "entitlements.json"), "utf8"));
  const enterprisePlans = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "enterprise-plans.json"), "utf8"));
  const memberEvents = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "events.json"), "utf8"));
  const systemRegistryMember = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "system-registry.json"), "utf8"));
  const officialDocsMember = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "official-docs-lock.json"), "utf8"));
  const memberTeam3PolicyMatrix = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "team3-policy-matrix.json"), "utf8"));
  const team4PackageFormRegistryMember = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "team4", "package-form-registry.json"), "utf8"));
  const team4BusinessDomainContractMember = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "team4", "business-domain-contract.json"), "utf8"));
  const team4PackageComparisonDemoOutputMember = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "team4", "package-comparison-demo-output.json"), "utf8"));
  const memberContracts = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "contracts.json"), "utf8"));
  const memberRouting = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "routing.json"), "utf8"));
  const memberRoutingAccess = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "access", "routing-contract.json"), "utf8"));
  const memberMobileConfig = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "mobile-config.json"), "utf8"));
  const memberMobileEdu = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "mobile", "edu-catalog.json"), "utf8"));
  const memberMobileVc = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "mobile", "vc-certificates.json"), "utf8"));
  const memberMobileStates = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "mobile", "session-states.json"), "utf8"));
  const workIndex = JSON.parse(await readFile(path.join(DIST, "work.vetuonglai.com", "api", "index.json"), "utf8"));
  const marketIndex = JSON.parse(await readFile(path.join(DIST, "market.vetuonglai.com", "api", "index.json"), "utf8"));
  const communityIndex = JSON.parse(await readFile(path.join(DIST, "community.vetuonglai.com", "api", "index.json"), "utf8"));
  const aiIndex = JSON.parse(await readFile(path.join(DIST, "ai.vetuonglai.com", "api", "index.json"), "utf8"));
  const businessIndex = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "index.json"), "utf8"));
  const memberLevels = JSON.parse(await readFile(path.join(DIST, "member.vetuonglai.com", "api", "levels.json"), "utf8"));
  const workBriefs = JSON.parse(await readFile(path.join(DIST, "work.vetuonglai.com", "api", "briefs.json"), "utf8"));
  const marketListings = JSON.parse(await readFile(path.join(DIST, "market.vetuonglai.com", "api", "listings.json"), "utf8"));
  const communityPreview = JSON.parse(await readFile(path.join(DIST, "community.vetuonglai.com", "api", "circle-preview.json"), "utf8"));
  const aiUseCases = JSON.parse(await readFile(path.join(DIST, "ai.vetuonglai.com", "api", "use-cases.json"), "utf8"));
  const team4PackageFormRegistryBusiness = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "team4", "package-form-registry.json"), "utf8"));
  const team4BusinessDomainContractBusiness = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "team4", "business-domain-contract.json"), "utf8"));
  const team4PackageComparisonDemoOutputBusiness = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "team4", "package-comparison-demo-output.json"), "utf8"));
  const businessContracts = JSON.parse(await readFile(path.join(DIST, "business.vetuonglai.com", "api", "business", "contracts.json"), "utf8"));
  const teaserContractFragments = ['id="public-value"', 'id="demo"', 'id="gateway-cta"', 'id="trust-status"'];
  const requiredGatewayCopyVi = "Mở toàn bộ hệ của bạn";
  const requiredGatewayCopyEn = "Open your full system";
  const interestCopyVi = "Đăng ký quan tâm";
  const interestCopyEn = "Register interest";
  const plannedDomainLabels = new Set(["WORK home", "MARKET home", "COMMUNITY home", "AI home", "LIFE home", "INVEST home"]);

  if (!Array.isArray(apps) || apps.length < 6) {
    throw new Error("apps.json khong du app registry.");
  }

  if (manifest.version !== "1.0.0") {
    throw new Error("manifest.json chua dung version V1.0.");
  }

  if (purchaseHub.homepagePurchaseHub?.annualAccess?.billingCycles?.map((cycle) => cycle.price).join(",") !== "3,99") {
    throw new Error("Purchase hub contract chua khoa dung pricing 3/99.");
  }

  const annualProviders = purchaseHub.homepagePurchaseHub?.annualAccess?.supportedProviders || [];
  if (!annualProviders.some((provider) => provider.key === "pay") || !annualProviders.some((provider) => provider.key === "paypal") || !annualProviders.some((provider) => provider.key === "stripe")) {
    throw new Error("Purchase hub contract chua khoa pay + paypal + stripe cho annual access.");
  }

  const packProviders = purchaseHub.homepagePurchaseHub?.specialistPackCheckout?.supportedProviders || [];
  if (!packProviders.some((provider) => provider.key === "pay") || !packProviders.some((provider) => provider.key === "paypal") || !packProviders.some((provider) => provider.key === "stripe")) {
    throw new Error("Purchase hub contract chua khoa pay + paypal + stripe cho specialist packs.");
  }

  if (hubApiIndex.name !== "hub" || !Array.isArray(hubApiIndex.endpoints)) {
    throw new Error("Hub api index khong hop le.");
  }

  if (hubApiIndex.contractVersion !== purchaseHub.version) {
    throw new Error("Hub api index contractVersion chua dong bo voi purchase hub version.");
  }

  if (!hubApiIndex.endpoints.includes("/api/registry.json") || !hubApiIndex.endpoints.includes("/api/purchase-hub.json") || !hubApiIndex.endpoints.includes("/api/team2-kickoff-output.json") || !hubApiIndex.endpoints.includes("/api/disclosures.json") || !hubApiIndex.endpoints.includes("/api/system-registry.json") || !hubApiIndex.endpoints.includes("/api/policy/team3-matrix.json") || !hubApiIndex.endpoints.includes("/api/team4/package-form-registry.json") || !hubApiIndex.endpoints.includes("/api/team4/business-domain-contract.json") || !hubApiIndex.endpoints.includes("/api/team4/package-comparison-demo-output.json") || !hubApiIndex.endpoints.includes("/api/contracts.json")) {
    throw new Error("Hub api index chua expose du Team 1/2/3/4 contracts.");
  }

  if (!Array.isArray(systemRegistryHub.domains) || systemRegistryHub.domains.length < 8) {
    throw new Error("System registry hub chua du domain records.");
  }

  const systemRegistryStatuses = new Set((systemRegistryHub.domains || []).map((domain) => domain.status));
  const systemRegistryVocabulary = new Set(Object.keys(systemRegistryHub.statusVocabulary || {}));
  if (!systemRegistryVocabulary.has("live") || !systemRegistryVocabulary.has("member_preview") || !systemRegistryVocabulary.has("planned")) {
    throw new Error("System registry hub chua khoa du status vocabulary live/member_preview/planned.");
  }
  if (!systemRegistryStatuses.has("live") || !systemRegistryStatuses.has("planned")) {
    throw new Error("System registry hub chua phan bo du trang thai live/planned theo runtime truth hien tai.");
  }

  const businessRegistryEntry = (systemRegistryHub.domains || []).find((domain) => domain.key === "business");
  if (!businessRegistryEntry || businessRegistryEntry.status !== "planned") {
    throw new Error("System registry hub chua khoa business = planned.");
  }

  const communityRegistryEntry = (systemRegistryHub.domains || []).find((domain) => domain.key === "community");
  if (!communityRegistryEntry || communityRegistryEntry.status !== "planned") {
    throw new Error("System registry hub chua khoa community = planned.");
  }

  const aiRegistryEntry = (systemRegistryHub.domains || []).find((domain) => domain.key === "ai");
  if (!aiRegistryEntry || aiRegistryEntry.status !== "planned") {
    throw new Error("System registry hub chua khoa ai = planned.");
  }

  if (!hubApiIndex.endpoints.includes("/api/official-docs-lock.json")) {
    throw new Error("Hub api index chua expose endpoint official docs lock.");
  }

  if (!Array.isArray(officialDocsHub.files) || officialDocsHub.files.length < 12) {
    throw new Error("Official docs lock chua ingest du 12 file markdown.");
  }

  if (officialDocsHub.sourceFilesCount !== officialDocsHub.files.length) {
    throw new Error("Official docs lock sourceFilesCount lech voi files.length.");
  }

  if (!officialDocsHub.files.some((file) => file.filename === "01_SYSTEM_VALUE_MAP_FINAL.md") || !officialDocsHub.files.some((file) => file.filename === "12_RUNTIME_TRUTH_MASTER.md")) {
    throw new Error("Official docs lock thieu anchor files 01/12.");
  }

  if (officialDocsHub.extracts?.specialistPackCount !== 9) {
    throw new Error("Official docs lock chua parse dung specialist pack count = 9.");
  }

  if (typeof officialDocsHub.drift?.annualPricingMismatch !== "boolean") {
    throw new Error("Official docs lock thieu annualPricingMismatch drift flag.");
  }

  if (!Array.isArray(officialDocsHub.readinessBoard?.team1?.first48h) || !Array.isArray(officialDocsHub.readinessBoard?.team2?.first48h) || !Array.isArray(officialDocsHub.readinessBoard?.team3?.first48h)) {
    throw new Error("Official docs lock chua co readiness board cho Team 1/2/3.");
  }

  if (hubContracts.name !== "vetuonglai-contract-manifest" || hubContracts.contractVersion !== purchaseHub.version) {
    throw new Error("Hub contracts manifest khong hop le hoac lech contractVersion.");
  }

  if (!hubContracts.contracts?.team1?.accessModel?.includes("member.vetuonglai.com/api/access-model.json") || !hubContracts.contracts?.team2?.kickoffOutput?.includes("vetuonglai.com/api/team2-kickoff-output.json") || !hubContracts.contracts?.team2?.disclosures?.includes("vetuonglai.com/api/disclosures.json") || !hubContracts.contracts?.team3?.policyMatrixHub?.includes("vetuonglai.com/api/policy/team3-matrix.json")) {
    throw new Error("Hub contracts manifest chua map dung Team 1/2/3 endpoints.");
  }

  if (!hubContracts.contracts?.governance?.officialDocsLock?.includes("vetuonglai.com/api/official-docs-lock.json") || !hubContracts.contracts?.governance?.officialDocsLockMember?.includes("member.vetuonglai.com/api/official-docs-lock.json")) {
    throw new Error("Hub contracts manifest chua map governance official docs lock endpoints.");
  }

  if (!hubContracts.contracts?.governance?.systemRegistry?.includes("vetuonglai.com/api/system-registry.json") || !hubContracts.contracts?.governance?.systemRegistryMember?.includes("member.vetuonglai.com/api/system-registry.json")) {
    throw new Error("Hub contracts manifest chua map governance system-registry endpoints.");
  }

  if (!hubContracts.contracts?.team4?.packageFormRegistryHub?.includes("vetuonglai.com/api/team4/package-form-registry.json") || !hubContracts.contracts?.team4?.packageFormRegistryMember?.includes("member.vetuonglai.com/api/team4/package-form-registry.json") || !hubContracts.contracts?.team4?.businessDomainContractHub?.includes("vetuonglai.com/api/team4/business-domain-contract.json") || !hubContracts.contracts?.team4?.businessDomainContractMember?.includes("member.vetuonglai.com/api/team4/business-domain-contract.json") || !hubContracts.contracts?.team4?.packageComparisonDemoOutputHub?.includes("vetuonglai.com/api/team4/package-comparison-demo-output.json") || !hubContracts.contracts?.team4?.packageComparisonDemoOutputMember?.includes("member.vetuonglai.com/api/team4/package-comparison-demo-output.json")) {
    throw new Error("Hub contracts manifest chua map dung Team 4 data contract endpoints.");
  }

  if (!Array.isArray(team4PackageFormRegistryHub.packageLayers) || team4PackageFormRegistryHub.packageLayers.length !== 4) {
    throw new Error("Team 4 package/form registry chua khoa du 4 package layers.");
  }

  const team4PackageKeys = new Set((team4PackageFormRegistryHub.packageLayers || []).map((item) => item.key));
  if (!team4PackageKeys.has("foundation") || !team4PackageKeys.has("applied") || !team4PackageKeys.has("professional") || !team4PackageKeys.has("business")) {
    throw new Error("Team 4 package/form registry thieu foundation/applied/professional/business.");
  }

  const businessSurface = (team4PackageFormRegistryHub.subdomainFormRegistry || []).find((item) => item.surfaceKey === "business");
  const businessLaneLocked = businessSurface && (
    businessSurface.runtimeState === "planned_internal_only"
    || businessSurface.intakeMode === "planned_safe_internal_only"
    || businessSurface.publicRenderPolicy === "internal_only_until_runtime_upgrade"
  );
  if (!businessLaneLocked || team4PackageFormRegistryHub.guardrails?.businessDomainPublicState !== "planned_internal_only") {
    throw new Error("Team 4 package/form registry chua khoa business lane la planned_internal_only.");
  }

  if (team4BusinessDomainContractHub.domain?.host !== "business.vetuonglai.com" || team4BusinessDomainContractHub.runtimeTruthGuardrails?.allowPublicLaunch !== false) {
    throw new Error("Team 4 business domain contract chua khoa host hoac allowPublicLaunch=false.");
  }

  if (!Array.isArray(team4PackageComparisonDemoOutputHub.packageOrder) || team4PackageComparisonDemoOutputHub.packageOrder.join(",") !== "foundation,applied,professional,business") {
    throw new Error("Team 4 package comparison/demo/output chua khoa packageOrder foundation->business.");
  }

  if (!Array.isArray(team4PackageComparisonDemoOutputHub.demoBundles) || team4PackageComparisonDemoOutputHub.demoBundles.length < 4) {
    throw new Error("Team 4 package comparison/demo/output chua du demo bundles.");
  }

  if (!Array.isArray(team2Kickoff.outputs?.componentMap) || team2Kickoff.outputs.componentMap.length < 4) {
    throw new Error("Team 2 kickoff output chua du component map.");
  }

  if (team2Kickoff.contractVersion !== purchaseHub.version) {
    throw new Error("Team 2 kickoff output contractVersion chua dong bo voi purchase hub version.");
  }

  if (!Array.isArray(team2Kickoff.outputs?.ctaMap) || team2Kickoff.outputs.ctaMap.length < 8) {
    throw new Error("Team 2 kickoff output chua du CTA map.");
  }

  const plannedDomainSet = new Set(["work", "market", "community", "ai", "business", "life", "invest", "kids", "read"]);
  for (const cta of team2Kickoff.outputs.ctaMap) {
    const intent = new URL(cta.target).searchParams.get("intent");
    const domainKey = String(cta.domain || "").replace(/\.vetuonglai\.com$/, "");
    if (plannedDomainSet.has(domainKey)) {
      if (intent !== "interest") {
        throw new Error(`Planned domain ${cta.domain} CTA intent must be interest. Found ${intent || "empty"}.`);
      }
    } else {
      if (intent !== "specialist-pack") {
        throw new Error(`Live domain ${cta.domain} CTA intent must be specialist-pack. Found ${intent || "empty"}.`);
      }
    }
  }

  if (!Array.isArray(team2Kickoff.outputs?.routeMap) || team2Kickoff.outputs.routeMap.length < 8) {
    throw new Error("Team 2 kickoff output chua du route map.");
  }

  if (!Array.isArray(team2Kickoff.outputs?.disclosureMap) || team2Kickoff.outputs.disclosureMap.length < 21) {
    throw new Error("Team 2 kickoff output chua du disclosure map theo DPM-001..DPM-021.");
  }

  if (!Array.isArray(disclosures.placements) || disclosures.placements.length < 21) {
    throw new Error("Hub disclosures endpoint chua day du placement rows.");
  }

  if (disclosures.placements.some((placement) => placement.finalStatus !== "approved")) {
    throw new Error("Hub disclosures endpoint co placement chua approved.");
  }

  if (!team3PolicyMatrix.guardrails?.homepagePurchaseHubOnly || !team3PolicyMatrix.guardrails?.affiliateDisabledAtPublicLayer || !team3PolicyMatrix.guardrails?.affiliateDisabledAtAnnualOnlyLayer) {
    throw new Error("Team 3 policy matrix chua khoa guardrails purchase-hub va affiliate layer.");
  }

  if (team3PolicyMatrix.guardrails?.allowMultiTierCommission !== false || team3PolicyMatrix.guardrails?.allowMlmStructures !== false || team3PolicyMatrix.guardrails?.allowEarningsGuaranteeLanguage !== false) {
    throw new Error("Team 3 policy matrix chua khoa anti-MLM, anti-multi-tier, anti-guarantee rules.");
  }

  const annualOnlyState = team3PolicyMatrix.affiliateEligibility?.states?.find((state) => state.condition === "annual_only");
  if (!annualOnlyState || annualOnlyState.eligibilityState !== "denied" || annualOnlyState.commissionAccrual !== false) {
    throw new Error("Team 3 affiliate matrix chua khoa annual_only la denied va no-commission.");
  }

  const eligibleState = team3PolicyMatrix.affiliateEligibility?.states?.find((state) => state.condition === "annual_plus_pack_with_compliance_pass");
  if (!eligibleState || eligibleState.eligibilityState !== "eligible" || eligibleState.referralLinkGeneration !== true || eligibleState.payoutEligibility !== true) {
    throw new Error("Team 3 affiliate matrix chua khoa activation state cho annual_plus_pack_with_compliance_pass.");
  }

  const complianceRequirements = team3PolicyMatrix.affiliateEligibility?.compliancePassRequirements || [];
  if (!complianceRequirements.includes("valid_paid_member_state") || !complianceRequirements.includes("valid_paid_specialist_pack_ownership") || !complianceRequirements.includes("identity_confirmed")) {
    throw new Error("Team 3 affiliate compliance requirements chua du field bat buoc.");
  }

  const vcAllowedStatuses = team3PolicyMatrix.vcExtensionAndProofRouting?.allowedStatuses || [];
  if (!vcAllowedStatuses.includes("verified") || !vcAllowedStatuses.includes("reviewing") || !vcAllowedStatuses.includes("planned")) {
    throw new Error("Team 3 VC matrix chua khoa allowed statuses verified/reviewing/planned.");
  }

  if (!team3PolicyMatrix.vcExtensionAndProofRouting?.requiredAnchors?.includes("contentHash")) {
    throw new Error("Team 3 VC matrix chua khoa required anchor contentHash.");
  }

  const deniedVcFlow = team3PolicyMatrix.vcExtensionAndProofRouting?.flows?.find((flow) => flow.flow === "affiliate_sales_claim_as_vc_proof");
  if (!deniedVcFlow || deniedVcFlow.result !== "denied") {
    throw new Error("Team 3 VC matrix chua khoa flow affiliate_sales_claim_as_vc_proof = denied.");
  }

  const requiredEvents = team3PolicyMatrix.reporting?.requiredEvents || [];
  if (!requiredEvents.includes("affiliate_activation_approved") || !requiredEvents.includes("affiliate_activation_rejected") || !requiredEvents.includes("vc_record_status_changed") || !requiredEvents.includes("disclosure_acknowledged")) {
    throw new Error("Team 3 reporting matrix chua khoa required launch events.");
  }

  if (!Array.isArray(team3PolicyMatrix.disclosureAndCompliance?.requirements) || team3PolicyMatrix.disclosureAndCompliance.requirements.length < 6) {
    throw new Error("Team 3 disclosure/compliance matrix chua day du.");
  }

  if (!Array.isArray(team3PolicyMatrix.launchGate?.checks) || team3PolicyMatrix.launchGate.checks.length < 6) {
    throw new Error("Team 3 launch gate checklist chua day du.");
  }

  if (team3PolicyMatrix.contractVersion !== purchaseHub.version) {
    throw new Error("Team 3 policy matrix contractVersion chua dong bo voi purchase hub version.");
  }

  const accessIdentityStateKeys = new Set((accessModel.identityStates || []).map((state) => state.key));
  if (!accessIdentityStateKeys.has("annual_active") || !accessIdentityStateKeys.has("pack_owner")) {
    throw new Error("Access model thieu identity states annual_active/pack_owner de map Team 3 affiliate eligibility.");
  }

  const affiliateStates = team3PolicyMatrix.affiliateEligibility?.states || [];
  const annualPlusPackPending = affiliateStates.find((state) => state.condition === "annual_plus_pack_without_compliance_pass");
  if (!annualPlusPackPending || annualPlusPackPending.eligibilityState !== "pending_compliance") {
    throw new Error("Team 3 affiliate matrix thieu state annual_plus_pack_without_compliance_pass = pending_compliance.");
  }

  const requiredComplianceSignals = new Set(team3PolicyMatrix.affiliateEligibility?.compliancePassRequirements || []);
  if (!requiredComplianceSignals.has("no_active_refund_abuse_flag") || !requiredComplianceSignals.has("no_fraud_or_spam_risk_flag")) {
    throw new Error("Team 3 affiliate compliance requirements thieu anti-abuse/anti-fraud signals.");
  }

  const team1RuntimeContract = team3PolicyMatrix.integrationContracts?.team1Runtime || {};
  const webhookOutputContract = team1RuntimeContract.webhookOutputsRequiredForComplianceAndPayout;
  if (!webhookOutputContract || webhookOutputContract.dependencyId !== "T3-T1-003") {
    throw new Error("Team 3 policy matrix chua khoa integrationContracts.team1Runtime.webhookOutputsRequiredForComplianceAndPayout (T3-T1-003).");
  }

  const requiredWebhookRoutes = new Set(webhookOutputContract.requiredWebhookRoutes || []);
  if (!requiredWebhookRoutes.has("/api/access/webhooks/paypal/subscriptions") || !requiredWebhookRoutes.has("/api/access/webhooks/paypal/orders") || !requiredWebhookRoutes.has("/api/access/webhooks/stripe")) {
    throw new Error("Team 3 T3-T1-003 chua khoa du required webhook routes cho Team 1 runtime.");
  }

  const requiredDecisionFields = new Set(webhookOutputContract.requiredDecisionFields || []);
  if (!requiredDecisionFields.has("normalizedEvent") || !requiredDecisionFields.has("dedupeKey") || !requiredDecisionFields.has("identity") || !requiredDecisionFields.has("affiliateEligibility") || !requiredDecisionFields.has("requiredReportingEvents")) {
    throw new Error("Team 3 T3-T1-003 chua khoa du required decision fields cho webhook outputs.");
  }

  const memberWebhookKeys = new Set((memberEvents.webhookEvents || []).map((event) => event.key));
  if (!memberWebhookKeys.has("annual.subscription.activated") || !memberWebhookKeys.has("pack.order.captured") || !memberWebhookKeys.has("pack.order.refunded")) {
    throw new Error("Team 1 webhook events chua du annual.subscription.activated / pack.order.captured / pack.order.refunded de phuc vu Team 3 compliance.");
  }

  const memberWebhookSignals = new Set((memberEvents.webhookEvents || []).map((event) => event.providerSignal).filter(Boolean));
  const requiredNormalizedEventsFromContract = new Set(webhookOutputContract.requiredNormalizedEvents || []);
  for (const eventKey of requiredNormalizedEventsFromContract) {
    if (!memberWebhookKeys.has(eventKey)) {
      throw new Error(`Team 1 webhook events thieu normalized event bat buoc cho T3-T1-003: ${eventKey}.`);
    }
  }

  const requiredProviderSignalsFromContract = new Set(webhookOutputContract.requiredProviderSignals || []);
  for (const providerSignal of requiredProviderSignalsFromContract) {
    if (!memberWebhookSignals.has(providerSignal)) {
      throw new Error(`Team 1 webhook events thieu provider signal bat buoc cho T3-T1-003: ${providerSignal}.`);
    }
  }

  const requiredReportingEventsForAudit = new Set(webhookOutputContract.requiredReportingEventsForAudit || []);
  for (const eventKey of requiredReportingEventsForAudit) {
    if (!requiredEvents.includes(eventKey)) {
      throw new Error(`Team 3 reporting.requiredEvents thieu event bat buoc cho T3-T1-003 audit: ${eventKey}.`);
    }
  }

  const requiredDisclosureAreas = new Set((team3PolicyMatrix.disclosureAndCompliance?.requirements || []).map((item) => item.area));
  if (!requiredDisclosureAreas.has("affiliate") || !requiredDisclosureAreas.has("earnings_language") || !requiredDisclosureAreas.has("vc_proof") || !requiredDisclosureAreas.has("refund_fraud")) {
    throw new Error("Team 3 disclosure matrix thieu cac area bat buoc affiliate/earnings_language/vc_proof/refund_fraud.");
  }

  const certificateItems = Array.isArray(certificates)
    ? certificates
    : (Array.isArray(certificates?.certificates) ? certificates.certificates : []);
  if (certificateItems.length < 5) {
    throw new Error("VC registry khong du sample records.");
  }

  if (!Array.isArray(catalog) || catalog.length < 3) {
    throw new Error("EDU catalog khong du course data.");
  }

  const sampleCourse = catalog[0];
  if (!sampleCourse?.slug) {
    throw new Error("Catalog khong co sample slug de verify disclosure DPM-007.");
  }
  const sampleCourseHtml = await readFile(path.join(DIST, "edu.vetuonglai.com", "course", sampleCourse.slug, "index.html"), "utf8");
  if (!sampleCourseHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang EDU course detail chua render public disclosure note.");
  }

  if (!Array.isArray(registry.domains) || registry.domains.length < 6) {
    throw new Error("Registry domain map chua du thong tin.");
  }

  if (!redirects.includes("/v/* /v/index.html 200")) {
    throw new Error("VC _redirects chua co rewrite cho /v/*.");
  }

  if (!health.ok || health.name !== "vetuonglai-edu") {
    throw new Error("EDU health endpoint khong hop le.");
  }

  if (localeRegistry.sourceLocale !== "vi-VN" || localeRegistry.defaultRuntimeLocale !== "vi") {
    throw new Error("Locale registry chua khoa vi-VN la source locale va vi la runtime locale mac dinh.");
  }

  if (activePublicLocales.length < 2) {
    throw new Error("Locale registry chua khai bao du locale active public.");
  }

  for (const locale of activePublicLocales) {
    if (!locale?.key || !locale?.tag) {
      throw new Error("Locale registry co locale active bi thieu key hoac tag.");
    }
    if (!hubHtml.includes(`hreflang="${locale.tag}"`)) {
      throw new Error(`Hub HTML chua co hreflang cho locale ${locale.tag}.`);
    }
  }

  if (!hubHtml.includes('data-language-option="vi"') || !hubHtml.includes('data-language-option="en"')) {
    throw new Error("Hub HTML chua co bo chuyen ngon ngu.");
  }

  assertIncludesAll(founderHtml, "Founder panel", [
    'id="founder-command-form"',
    'id="founder-actions"',
    'id="founder-incidents"',
    'id="founder-audit-log"',
    'id="founder-deployments"',
    'id="founder-settings"',
    "POST /api/founder/insights/query",
    "/api/founder/actions/history",
  ]);

  if (!founderHtml.includes('<meta name="robots" content="noindex,follow"')) {
    throw new Error("Founder panel phai giu robots = noindex,follow.");
  }

  assertIncludesAll(vcHtml, "VC home", teaserContractFragments);
  assertIncludesAll(eduHtml, "EDU home", teaserContractFragments);
  assertIncludesAll(memberHtml, "Member home", teaserContractFragments);
  assertIncludesAll(memberAppHtml, "Member app", teaserContractFragments);
  assertIncludesAll(workHtml, "WORK home", teaserContractFragments);
  assertIncludesAll(marketHtml, "MARKET home", teaserContractFragments);
  assertIncludesAll(communityHtml, "COMMUNITY home", teaserContractFragments);
  assertIncludesAll(aiHtml, "AI home", teaserContractFragments);
  assertIncludesAll(businessHtml, "BUSINESS home", teaserContractFragments);
  assertIncludesAll(greenHtml, "GREEN home", teaserContractFragments);
  assertIncludesAll(financeHtml, "FINANCE home", teaserContractFragments);
  assertIncludesAll(lifeHtml, "LIFE home", teaserContractFragments);
  assertIncludesAll(investHtml, "INVEST home", teaserContractFragments);

  for (const [label, html] of [
    ["VC home", vcHtml],
    ["EDU home", eduHtml],
    ["Member home", memberHtml],
    ["Member app", memberAppHtml],
    ["WORK home", workHtml],
    ["MARKET home", marketHtml],
    ["COMMUNITY home", communityHtml],
    ["AI home", aiHtml],
    ["BUSINESS home", businessHtml],
    ["GREEN home", greenHtml],
    ["FINANCE home", financeHtml],
    ["LIFE home", lifeHtml],
    ["INVEST home", investHtml],
  ]) {
    if (plannedDomainLabels.has(label)) {
      if (!html.includes(interestCopyVi) || !html.includes(interestCopyEn)) {
        throw new Error(`${label} chua dong bo interest CTA copy ${interestCopyVi} / ${interestCopyEn}.`);
      }
    } else {
      if (!html.includes(requiredGatewayCopyVi) || !html.includes(requiredGatewayCopyEn)) {
        throw new Error(`${label} chua dong bo gateway CTA copy ${requiredGatewayCopyVi} / ${requiredGatewayCopyEn}.`);
      }
    }
  }

  const sharedShellInlineLangPattern = /data-lang="vi"|data-lang="en"/;
  for (const [label, html] of [
    ["Hub", hubHtml],
    ["EDU", eduHtml],
    ["GREEN", greenHtml],
    ["FINANCE", financeHtml],
    ["LIFE", lifeHtml],
    ["INVEST", investHtml],
    ["WORK", workHtml],
    ["MARKET", marketHtml],
    ["COMMUNITY", communityHtml],
    ["AI", aiHtml],
    ["BUSINESS", businessHtml],
    ["MEMBER", memberHtml],
    ["MEMBER JOURNEY", memberJourneyHtml],
    ["MEMBER APP", memberAppHtml],
  ]) {
    if (sharedShellInlineLangPattern.test(html)) {
      throw new Error(`${label} van con dung bilingual-inline render (data-lang spans).`);
    }
  }

  if (!vcHtml.includes("?lang=en") || !vcHtml.includes("?lang=vi")) {
    throw new Error("VC HTML chua xuat alternate link ngon ngu day du.");
  }

  if (!eduHtml.includes("HỌC") || !eduHtml.includes("Học để làm được việc, không phải để biết.")) {
    throw new Error("Trang EDU chua dong bo copy moi.");
  }

  if (!eduHtml.includes("EDU đang ở trạng thái Live cho lớp public") || eduHtml.includes("EDU is in Member Preview")) {
    throw new Error("Trang EDU chua khoa wording runtime truth Live cho trust/status block.");
  }

  if (!investHtml.includes("ĐẦU TƯ") || !investHtml.includes("Đầu tư bắt đầu từ hiểu rủi ro.")) {
    throw new Error("Trang INVEST chua duoc hoan thien noi dung tieng Viet.");
  }

  if (!investHtml.includes("INVESTING") || !investHtml.includes("Investing starts with understanding risk.")) {
    throw new Error("Trang INVEST chua duoc hoan thien noi dung tieng Anh.");
  }

  if (!hubStartHtml.includes("Bắt đầu trong 3 bước")) {
    throw new Error("Trang hub /bat-dau chua duoc tao dung huong.");
  }

  if (!hubStartHtml.includes("intent=annual-access") || !hubStartHtml.includes("intent=specialist-pack")) {
    throw new Error("Trang hub /bat-dau chua dung canonical intent annual-access/specialist-pack.");
  }

  if (countOccurrences(hubHtml, 'data-disclosure-kind="public-note"') < 4) {
    throw new Error("Hub home chua render du public disclosure blocks.");
  }

  if (!hubStartHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Hub /bat-dau chua render public disclosure note.");
  }

  if (!vcIssuersHtml.includes("Nguồn phát hành VC")) {
    throw new Error("VC issuers page chua duoc tao dung huong.");
  }

  if (!vcHtml.includes("XÁC MINH") || !vcHtml.includes("Một lớp xác minh độc lập cho giá trị thật.") || !vcHtml.includes("Lớp tổ chức")) {
    throw new Error("VC home chua dong bo language codex moi.");
  }

  if (!memberHtml.includes("identity") || !memberHtml.includes("journey")) {
    throw new Error("Trang member chua co core blocks.");
  }

  if (!(memberHtml.includes("không có checkout riêng") || memberHtml.includes("Không có thanh toán trực tiếp tại app hoặc subdomain này."))
    || !memberHtml.includes("lớp public đang mở")) {
    throw new Error("Trang member chua lam ro boundary cong khai va pham vi public dang mo hien tai.");
  }

  if (!memberAppHtml.includes('rel="manifest" href="/app/manifest.webmanifest"') || !memberAppHtml.includes("/app/sw.js")) {
    throw new Error("Member app shell chua co manifest/service worker wiring.");
  }

  if (!memberAppHtml.includes("No in-app payment") && !memberAppHtml.includes("Không xử lý thanh toán trong app")) {
    throw new Error("Member app shell chua khoa non-payment messaging.");
  }

  if (!memberAppHtml.includes("/api/mobile-config.json") || !memberAppHtml.includes("/api/access/routing-contract.json") || !memberAppHtml.includes("/api/mobile/session-states.json") || !memberAppHtml.includes("/api/team3-policy-matrix.json")) {
    throw new Error("Member app shell chua wire day du mobile/runtime/policy contracts.");
  }

  if (!memberAppHtml.includes("mobile-route-note") || !memberAppHtml.includes("mobile-affiliate-note") || !memberAppHtml.includes("mobile-state-contract")) {
    throw new Error("Member app shell chua render day du route/state/trust note blocks.");
  }

  if (!memberAppOfflineHtml.toLowerCase().includes("offline")) {
    throw new Error("Member app offline fallback chua duoc tao dung.");
  }

  if (!memberAppServiceWorker.includes("PRECACHE_URLS") || !memberAppServiceWorker.includes("/app/offline/")) {
    throw new Error("Member app service worker chua co precache/offline fallback.");
  }

  if (countOccurrences(memberHtml, 'data-disclosure-kind="public-note"') < 3) {
    throw new Error("Trang member chua render du public disclosure blocks.");
  }

  if (!memberJourneyHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang member journey chua render public disclosure note.");
  }

  if (!workHtml.includes("deliverable") || !workHtml.includes("WORK")) {
    throw new Error("Trang work chua co messaging chinh.");
  }

  if (!workHtml.includes("sample brief") || !workHtml.includes("trạng thái Planned")) {
    throw new Error("Trang WORK chua khoa boundary cong khai va demo block theo wording moi.");
  }

  if (!workHtml.includes('data-disclosure-kind="public-note"') || !workBriefHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang WORK chua render du public disclosure notes.");
  }

  if (!marketHtml.includes("MARKET") || !marketHtml.includes("trust")) {
    throw new Error("Trang market chua co messaging chinh.");
  }

  if (!(marketHtml.includes("creator storefront preview") || marketHtml.includes("gian hàng đang hoạt động"))
    || !marketHtml.includes("trạng thái Planned")) {
    throw new Error("Trang MARKET chua khoa boundary cong khai va storefront preview demo theo wording moi.");
  }

  if (!marketHtml.includes('data-disclosure-kind="public-note"') || !marketRulesHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang MARKET chua render du public disclosure notes.");
  }

  if (!businessHtml.includes("BUSINESS") || !businessHtml.includes("Đang chuẩn bị")) {
    throw new Error("Trang BUSINESS chua khoa messaging dang-chuan-bi.");
  }

  if (!businessHtml.includes("/api/team4/package-form-registry.json") || !businessHtml.includes("/api/team4/business-domain-contract.json") || !businessHtml.includes("/api/team4/package-comparison-demo-output.json")) {
    throw new Error("Trang BUSINESS chua bind runtime /api/team4/* endpoints.");
  }

  if (!businessHtml.includes("thông báo chờ") || !businessHtml.includes("Không có tiếp nhận doanh nghiệp tự phục vụ")) {
    throw new Error("Trang BUSINESS chua khoa fallback cho du lieu nen hoac no-self-serve boundary.");
  }

  if (!businessHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang BUSINESS chua render public disclosure note.");
  }

  if (!eduHtml.includes('data-disclosure-kind="public-note"') || !eduCoursesHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("Trang EDU chua render du public disclosure notes.");
  }

  if (!greenHtml.includes('data-disclosure-kind="public-note"') || !financeHtml.includes('data-disclosure-kind="public-note"') || !lifeHtml.includes('data-disclosure-kind="public-note"') || !investHtml.includes('data-disclosure-kind="public-note"')) {
    throw new Error("GREEN/FINANCE/LIFE/INVEST chua render du public disclosure notes.");
  }

  if (!hubMemberHtml.includes(`rel="canonical" href="https://${domains.member}/"`)) {
    throw new Error("Trang hub /thanh-vien chua tro canonical ve member.");
  }

  if (memberSummary.sourceOwner !== `https://${domains.member}/`) {
    throw new Error("Member summary chua co sourceOwner dung.");
  }

  if (memberSummary.contractVersion !== accessModel.version) {
    throw new Error("Member summary chua dong bo contractVersion.");
  }

  if (workSummary.sourceOwner !== `https://${domains.work}/`) {
    throw new Error("Work summary chua co sourceOwner dung.");
  }

  if (marketSummary.sourceOwner !== `https://${domains.market}/`) {
    throw new Error("Market summary chua co sourceOwner dung.");
  }

  if (communitySummary.sourceOwner !== `https://${domains.community}/` || communitySummary.status !== "planned") {
    throw new Error("Community summary chua co sourceOwner/status planned dung.");
  }

  if (aiSummary.sourceOwner !== `https://${domains.ai}/` || aiSummary.status !== "planned") {
    throw new Error("AI summary chua co sourceOwner/status planned dung.");
  }

  if (businessSummary.sourceOwner !== `https://${domains.business}/`) {
    throw new Error("Business summary chua co sourceOwner dung.");
  }

  if (businessSummary.contractVersion !== team4BusinessDomainContractBusiness.version || businessSummary.status !== "planned") {
    throw new Error("Business summary chua dong bo contractVersion/status voi Team 4 business contract.");
  }

  if (!Array.isArray(businessSummary.team4Endpoints) || businessSummary.team4Endpoints.length !== 3) {
    throw new Error("Business summary chua expose du 3 Team 4 endpoints.");
  }

  if (!Array.isArray(memberIndex.endpoints) || memberIndex.endpoints.length < 2) {
    throw new Error("Member api index chua day du endpoint.");
  }

  if (memberIndex.contractVersion !== accessModel.version) {
    throw new Error("Member api index contractVersion chua dong bo voi access model version.");
  }

  if (!memberIndex.endpoints.includes("/api/access-model.json") || !memberIndex.endpoints.includes("/api/events.json") || !memberIndex.endpoints.includes("/api/system-registry.json") || !memberIndex.endpoints.includes("/api/team3-policy-matrix.json") || !memberIndex.endpoints.includes("/api/team4/package-form-registry.json") || !memberIndex.endpoints.includes("/api/team4/business-domain-contract.json") || !memberIndex.endpoints.includes("/api/team4/package-comparison-demo-output.json") || !memberIndex.endpoints.includes("/api/contracts.json")) {
    throw new Error("Member api index chua expose Team 1/Team 3/Team 4 contract endpoints.");
  }

  if (!memberIndex.endpoints.includes("/api/enterprise-plans.json")) {
    throw new Error("Member api index chua expose enterprise plans endpoint.");
  }

  if (!memberIndex.endpoints.includes("/api/access/routing-contract.json")) {
    throw new Error("Member api index chua expose endpoint routing-contract alias cho app shell.");
  }

  if (!memberIndex.endpoints.includes("/api/official-docs-lock.json")) {
    throw new Error("Member api index chua expose endpoint official docs lock.");
  }

  if (!memberIndex.endpoints.includes("/api/mobile-config.json") || !memberIndex.endpoints.includes("/api/mobile/edu-catalog.json") || !memberIndex.endpoints.includes("/api/mobile/vc-certificates.json")) {
    throw new Error("Member api index chua expose mobile app endpoints.");
  }

  if (officialDocsMember.sourceFilesCount !== officialDocsHub.sourceFilesCount) {
    throw new Error("Official docs lock member lech sourceFilesCount voi hub.");
  }

  if ((officialDocsMember.extracts?.annualAccessDocPricing?.year1Usd ?? null) !== (officialDocsHub.extracts?.annualAccessDocPricing?.year1Usd ?? null)) {
    throw new Error("Official docs lock member lech annualAccessDocPricing.year1Usd voi hub.");
  }

  if (systemRegistryMember.version !== systemRegistryHub.version || (systemRegistryMember.domains || []).length !== (systemRegistryHub.domains || []).length) {
    throw new Error("System registry member chua dong bo version/domains voi hub.");
  }

  if (memberContracts.name !== hubContracts.name || memberContracts.contractVersion !== hubContracts.contractVersion) {
    throw new Error("Member contracts manifest chua dong bo voi hub contracts manifest.");
  }

  if (team4PackageFormRegistryMember.version !== team4PackageFormRegistryHub.version || team4BusinessDomainContractMember.version !== team4BusinessDomainContractHub.version || team4PackageComparisonDemoOutputMember.version !== team4PackageComparisonDemoOutputHub.version) {
    throw new Error("Team 4 contracts tren member chua dong bo version voi hub.");
  }

  if (memberTeam3PolicyMatrix.version !== team3PolicyMatrix.version) {
    throw new Error("Member team3 policy endpoint chua dong bo version voi hub policy endpoint.");
  }

  if (memberTeam3PolicyMatrix.contractVersion !== team3PolicyMatrix.contractVersion) {
    throw new Error("Member team3 policy endpoint chua dong bo contractVersion voi hub policy endpoint.");
  }

  if (!Array.isArray(workIndex.endpoints) || workIndex.endpoints.length < 2) {
    throw new Error("Work api index chua day du endpoint.");
  }

  if (!Array.isArray(marketIndex.endpoints) || marketIndex.endpoints.length < 2) {
    throw new Error("Market api index chua day du endpoint.");
  }

  if (!Array.isArray(communityIndex.endpoints) || !communityIndex.endpoints.includes("/api/circle-preview.json")) {
    throw new Error("Community api index chua expose circle preview endpoint.");
  }

  if (!Array.isArray(aiIndex.endpoints) || !aiIndex.endpoints.includes("/api/use-cases.json")) {
    throw new Error("AI api index chua expose use cases endpoint.");
  }

  if (!Array.isArray(communityPreview.circles) || communityPreview.circles.length < 1) {
    throw new Error("Community preview api chua co circle sample.");
  }

  if (!Array.isArray(aiUseCases.useCases) || aiUseCases.useCases.length < 1) {
    throw new Error("AI use cases api chua co sample use cases.");
  }

  if (!Array.isArray(businessIndex.endpoints) || businessIndex.endpoints.length < 4) {
    throw new Error("Business api index chua day du endpoint.");
  }

  if (businessIndex.contractVersion !== team4BusinessDomainContractBusiness.version) {
    throw new Error("Business api index contractVersion chua dong bo voi business contract version.");
  }

  if (!businessIndex.endpoints.includes("/api/team4/package-form-registry.json") || !businessIndex.endpoints.includes("/api/team4/business-domain-contract.json") || !businessIndex.endpoints.includes("/api/team4/package-comparison-demo-output.json") || !businessIndex.endpoints.includes("/api/business/contracts.json")) {
    throw new Error("Business api index chua expose du Team 4 runtime endpoints va business contracts.");
  }

  if (team4PackageFormRegistryBusiness.version !== team4PackageFormRegistryHub.version || team4BusinessDomainContractBusiness.version !== team4BusinessDomainContractHub.version || team4PackageComparisonDemoOutputBusiness.version !== team4PackageComparisonDemoOutputHub.version) {
    throw new Error("Team 4 contracts tren business chua dong bo version voi hub.");
  }

  if (businessContracts.version !== team4BusinessDomainContractBusiness.version || businessContracts.comparisonDemoOutputVersion !== team4PackageComparisonDemoOutputBusiness.version) {
    throw new Error("Business contracts endpoint chua dong bo version voi Team 4 contracts.");
  }

  if (!Array.isArray(businessContracts.currentSourceOfTruth) || !businessContracts.currentSourceOfTruth.includes("/api/team4/package-form-registry.json") || !businessContracts.currentSourceOfTruth.includes("/api/team4/business-domain-contract.json") || !businessContracts.currentSourceOfTruth.includes("/api/team4/package-comparison-demo-output.json")) {
    throw new Error("Business contracts endpoint chua tro ve dung currentSourceOfTruth /api/team4/*.");
  }

  if (!Array.isArray(memberLevels.levels) || memberLevels.levels.length < 4) {
    throw new Error("Member levels chua du 4 level.");
  }

  if (!memberLevels.levels.some((level) => level.key === "annual_active") || !memberLevels.levels.some((level) => level.key === "pack_owner")) {
    throw new Error("Member levels chua doi sang model annual_active / pack_owner.");
  }

  if (!Array.isArray(accessModel.identityStates) || !accessModel.identityStates.some((state) => state.key === "pending_member")) {
    throw new Error("Access model chua co pending_member state.");
  }

  if (!Array.isArray(entitlements.specialistPacks) || entitlements.specialistPacks.length !== 9) {
    throw new Error("Entitlements chua du 9 specialist packs.");
  }

  if (!Array.isArray(entitlements.enterprisePlans) || entitlements.enterprisePlans.length < 3) {
    throw new Error("Entitlements chua dong bo enterprise plans.");
  }

  if (entitlements.vcProtectionPolicy?.profileVerification?.required !== true) {
    throw new Error("Entitlements chua khoa profile verification requirement cho VC.");
  }

  if (!Array.isArray(enterprisePlans.plans) || enterprisePlans.plans.length < 3) {
    throw new Error("Enterprise plans endpoint chua co toi thieu 3 goi.");
  }

  if (enterprisePlans.vcProtectionPolicy?.profileVerification?.required !== true) {
    throw new Error("Enterprise plans endpoint chua dong bo profile verification policy.");
  }

  if (!Array.isArray(memberEvents.webhookEvents) || !memberEvents.webhookEvents.some((event) => event.key === "annual.subscription.activated") || !memberEvents.webhookEvents.some((event) => event.key === "pack.order.captured")) {
    throw new Error("Member events chua khoa annual.subscription.activated va pack.order.captured.");
  }

  if (!memberEvents.webhookEvents.some((event) => event.providerSignal === "STRIPE_CHECKOUT_SESSION_COMPLETED_SUBSCRIPTION") || !memberEvents.webhookEvents.some((event) => event.providerSignal === "STRIPE_CHECKOUT_SESSION_COMPLETED_PAYMENT")) {
    throw new Error("Member events chua khoa stripe annual + pack webhook signals.");
  }

  if (!memberEvents.webhookEvents.some((event) => event.providerSignal === "PAY_IAI_ONE_SUBSCRIPTION_ACTIVATED") || !memberEvents.webhookEvents.some((event) => event.providerSignal === "PAY_IAI_ONE_ORDER_CAPTURED")) {
    throw new Error("Member events chua khoa pay.iai.one annual + pack webhook signals.");
  }

  if (!Array.isArray(memberRouting.routeContract?.queryParams) || !memberRouting.routeContract.queryParams.some((param) => param.name === "entry") || !memberRouting.routeContract.queryParams.some((param) => param.name === "intent") || !memberRouting.routeContract.queryParams.some((param) => param.name === "gateway")) {
    throw new Error("Member routing contract chua co entry / intent / gateway params.");
  }

  if (memberRoutingAccess.version !== memberRouting.version || JSON.stringify(memberRoutingAccess.routeContract) !== JSON.stringify(memberRouting.routeContract)) {
    throw new Error("Routing-contract alias chua dong bo voi member api/routing.json.");
  }

  if (memberPwaManifest.scope !== "/app/" || memberPwaManifest.start_url?.startsWith("/app/") !== true) {
    throw new Error("Member PWA manifest chua khoa scope/start_url cho app shell.");
  }

  if (!Array.isArray(memberPwaManifest.icons) || memberPwaManifest.icons.length < 2) {
    throw new Error("Member PWA manifest chua du icon definitions.");
  }

  if (memberMobileConfig.paymentInAppEnabled !== false) {
    throw new Error("Mobile config chua khoa paymentInAppEnabled=false.");
  }

  if (!memberMobileConfig.endpoints?.sessionCurrent || !memberMobileConfig.endpoints?.eduCatalog || !memberMobileConfig.endpoints?.vcCertificates || !memberMobileConfig.endpoints?.routingContract || !memberMobileConfig.endpoints?.mobileStates || !memberMobileConfig.endpoints?.team3PolicyMatrix) {
    throw new Error("Mobile config chua day du API endpoints.");
  }

  const requiredMobileEvents = [
    "mobile_app_open",
    "mobile_login_success",
    "mobile_edu_lesson_start",
    "mobile_edu_lesson_complete",
    "mobile_vc_verify_open",
  ];

  if (!Array.isArray(memberMobileConfig.telemetry?.requiredEvents)) {
    throw new Error("Mobile config chua khoa telemetry events co ban.");
  }

  const missingMobileEvents = requiredMobileEvents.filter((eventKey) => !memberMobileConfig.telemetry.requiredEvents.includes(eventKey));
  if (missingMobileEvents.length > 0) {
    throw new Error(`Mobile config thieu telemetry events: ${missingMobileEvents.join(", ")}`);
  }

  if (!Array.isArray(memberMobileEdu.courses) || memberMobileEdu.courses.length < 3) {
    throw new Error("Mobile EDU snapshot chua du data.");
  }

  if (!Array.isArray(memberMobileVc.certificates) || memberMobileVc.certificates.length < 3) {
    throw new Error("Mobile VC snapshot chua du data.");
  }

  if (!Array.isArray(memberMobileStates.identityStates) || !memberMobileStates.identityStates.some((state) => state.key === "pending_member")) {
    throw new Error("Mobile session-states chua dong bo identity states.");
  }

  if (!Array.isArray(workBriefs.briefs) || workBriefs.briefs.length < 1) {
    throw new Error("Work briefs chua co pilot.");
  }

  if (!Array.isArray(marketListings.listings) || marketListings.listings.length < 1) {
    throw new Error("Market listings chua co pilot.");
  }

  for (const course of catalog) {
    if (!course.slug || !course.certificateCode) {
      throw new Error(`Course data thieu slug hoac certificateCode: ${JSON.stringify(course)}`);
    }

    await assertFile(path.join("edu.vetuonglai.com", "course", course.slug, "index.html"));
    await assertFile(path.join("edu.vetuonglai.com", "learn", course.slug, "index.html"));
    await assertFile(path.join("edu.vetuonglai.com", "learn", course.slug, "player", "index.html"));
    await assertFile(path.join("edu.vetuonglai.com", "api", "courses", `${course.slug}.json`));
    await assertFile(path.join("edu.vetuonglai.com", "api", "courses", course.slug, "modules.json"));
    await assertFile(path.join("edu.vetuonglai.com", "api", "eligibility", `${course.slug}.json`));
  }

  for (const record of certificateItems) {
    if (!record.code || !record.domain || !record.anchors?.contentHash) {
      throw new Error(`VC record thieu field bat buoc: ${JSON.stringify(record)}`);
    }
  }

  // Gate: no-checkout-for-planned — planned domain HTML must not have specialist-pack checkout links
  const plannedDomainDirs = ["life.vetuonglai.com", "invest.vetuonglai.com", "work.vetuonglai.com", "market.vetuonglai.com", "community.vetuonglai.com", "ai.vetuonglai.com", "business.vetuonglai.com", "kids.vetuonglai.com"];
  for (const dir of plannedDomainDirs) {
    const htmlPath = path.join(DIST, dir, "index.html");
    try {
      const html = await readFile(htmlPath, "utf8");
      if (html.includes("intent=specialist-pack")) {
        throw new Error(`Planned domain ${dir} still has checkout intent=specialist-pack. Must use intent=interest.`);
      }
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  // Gate: banned-terms-clean — dist HTML must not contain banned internal terms in visible text
  const bannedTerms = ["planned-safe", "i18n", "route kỹ thuật"];
  const allDistDirs = await import("node:fs").then((fs) => fs.readdirSync(DIST, { withFileTypes: true }))
    .then ? await import("node:fs/promises").then((fs) => fs.readdir(DIST, { withFileTypes: true })) : [];
  for (const entry of allDistDirs) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(DIST, entry.name, "index.html");
    try {
      const html = await readFile(indexPath, "utf8");
      for (const term of bannedTerms) {
        if (html.includes(term)) {
          throw new Error(`Banned term "${term}" found in ${entry.name}/index.html. Remove from public HTML.`);
        }
      }
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  console.log("Vetuonglai dist check passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
