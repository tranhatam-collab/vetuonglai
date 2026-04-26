import { access, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.resolve(process.env.VTL_DIST_ROOT || path.join(ROOT, "dist"));
const BUILD_LOCK_DIR = path.join(DIST, ".build-lock");
const BUILD_LOCK_MAX_AGE_MS = 15 * 60 * 1000;
const OFFICIAL_DOCS_CANDIDATES = [
  path.join(ROOT, "vetuonglai_official_docs"),
  path.join(ROOT, "docs", "00_master"),
];
const BUILD_SCOPE = process.env.VTL_BUILD_SCOPE || "full";

const styleCss = await readFile(path.join(SRC, "shared", "style.css"), "utf8");
const designTokensCss = await readFile(path.join(SRC, "shared", "design-tokens.css"), "utf8");
const designTokensJson = await readFile(path.join(SRC, "shared", "design-tokens.json"), "utf8");
const sharedJs = await readFile(path.join(SRC, "shared", "app.js"), "utf8");
const apps = JSON.parse(await readFile(path.join(SRC, "data", "apps.json"), "utf8"));
const systemRegistry = JSON.parse(await readFile(path.join(SRC, "data", "system-registry.json"), "utf8"));
const accessModel = JSON.parse(await readFile(path.join(SRC, "data", "access-model.json"), "utf8"));
const certificates = JSON.parse(await readFile(path.join(SRC, "data", "certificates.json"), "utf8"));
const courses = JSON.parse(await readFile(path.join(SRC, "data", "courses.json"), "utf8"));
const founderActionRegistry = JSON.parse(await readFile(path.join(SRC, "data", "founder-action-registry.json"), "utf8"));
const founderAutopilotSeeds = JSON.parse(await readFile(path.join(SRC, "data", "founder-autopilot-seeds.json"), "utf8"));
const founderCommandPanel = JSON.parse(await readFile(path.join(SRC, "data", "founder-command-panel.json"), "utf8"));
const packageFormRegistry = JSON.parse(await readFile(path.join(SRC, "data", "package-form-registry.json"), "utf8"));
const businessDomainContract = JSON.parse(await readFile(path.join(SRC, "data", "business-domain-contract.json"), "utf8"));
const packageComparisonDemoOutput = JSON.parse(await readFile(path.join(SRC, "data", "package-comparison-demo-output.json"), "utf8"));
const system = JSON.parse(await readFile(path.join(SRC, "data", "system.json"), "utf8"));
const team3PolicyMatrix = JSON.parse(await readFile(path.join(SRC, "data", "team3-policy-matrix.json"), "utf8"));
const localeRegistry = JSON.parse(await readFile(path.join(ROOT, "content", "locale-registry.json"), "utf8"));
const domainRuntimeTruth = await (async () => {
  try {
    return JSON.parse(await readFile(path.join(ROOT, "cloudflare", "domain-runtime-truth.json"), "utf8"));
  } catch {
    return { domains: [] };
  }
})();
const contentVi = JSON.parse(await readFile(path.join(ROOT, "content", "vi.json"), "utf8"));
const contentEn = JSON.parse(await readFile(path.join(ROOT, "content", "en.json"), "utf8"));
const team3PolicyContract = {
  ...team3PolicyMatrix,
  contractVersion: accessModel.version,
};

const domains = {
  hub: "vetuonglai.com",
  vc: "vc.vetuonglai.com",
  edu: "edu.vetuonglai.com",
  member: "member.vetuonglai.com",
  work: "work.vetuonglai.com",
  market: "market.vetuonglai.com",
  community: "community.vetuonglai.com",
  ai: "ai.vetuonglai.com",
  business: "business.vetuonglai.com",
  green: "green.vetuonglai.com",
  finance: "finance.vetuonglai.com",
  life: "life.vetuonglai.com",
  invest: "invest.vetuonglai.com",
  kids: "kids.vetuonglai.com",
};

const kidsCurriculum = JSON.parse(await readFile(path.join(SRC, "data", "kids-curriculum.json"), "utf8"));
const kidsApiContract = JSON.parse(await readFile(path.join(SRC, "data", "kids-api-contract.json"), "utf8"));

function readNestedValue(source, pathString, fallback = "") {
  const result = String(pathString || "")
    .split(".")
    .filter(Boolean)
    .reduce((current, key) => (current && typeof current === "object" ? current[key] : undefined), source);

  return typeof result === "string" ? result : fallback;
}

function codexPair(pathString, fallbackVi, fallbackEn = fallbackVi) {
  return pair(
    readNestedValue(contentVi, pathString, fallbackVi),
    readNestedValue(contentEn, pathString, fallbackEn),
  );
}

const brandPromiseCopy = codexPair(
  "shared.system_lock",
  "Không hứa hẹn kết quả. Chỉ cung cấp cấu trúc để sống rõ hơn.",
  "No promised outcomes. Only structure to help people live with more clarity.",
);
const brandSubtitleCopy = codexPair(
  "shared.brand.subtitle",
  "Minh bạch vừa đủ, xác minh được độc lập.",
  "Right-sized transparency with independent verification.",
);
const gatewayPrimaryCtaCopy = {
  vi: String(
    accessModel.homepagePurchaseHub?.cta?.vi
    || readNestedValue(contentVi, "shared.cta.continue_at_hub", "Mở toàn bộ hệ của bạn"),
  ),
  en: String(
    accessModel.homepagePurchaseHub?.cta?.en
    || readNestedValue(contentEn, "shared.cta.continue_at_hub", "Open your full system"),
  ),
};
const disclosureNoteLabelCopy = pair("Ghi chú công khai", "Public note");
const activePublicLocales = Array.isArray(localeRegistry.activePublicLocales)
  ? localeRegistry.activePublicLocales.filter((entry) => entry?.status === "active")
  : [];
const activeLocaleTags = activePublicLocales
  .map((entry) => entry?.tag)
  .filter(Boolean);
const primaryLocaleTag = String(localeRegistry.sourceLocale || "vi-VN");
const primaryRuntimeLocale = String(localeRegistry.defaultRuntimeLocale || "vi");

function normalizeSurfaceStatus(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "live") return "live";
  if (normalized === "bridge") return "bridge";
  if (normalized === "member_preview" || normalized === "member-preview") return "member_preview";
  if (normalized === "beta" || normalized === "preview") return "member_preview";
  return "planned";
}

function normalizeRuntimeTruthStatus(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "planned_public" || normalized === "planned-public") return "planned";
  if (normalized === "staged_public" || normalized === "staged-public") return "planned";
  return normalizeSurfaceStatus(normalized);
}

function stageLabelFromStatus(status = "") {
  const normalized = normalizeSurfaceStatus(status);
  if (normalized === "member_preview") return "MEMBER_PREVIEW";
  return normalized.toUpperCase();
}

function resolveSurfaceStatusMeta(status = "") {
  const normalized = normalizeSurfaceStatus(status);
  return {
    status: normalized,
    stageLabel: stageLabelFromStatus(normalized),
    statusLabel: registryStatusLabel(normalized),
  };
}

function siteContentKeyForApp(appKey = "") {
  const key = String(appKey || "").trim().toLowerCase();
  return ["hub", "vc", "edu", "life", "finance", "invest", "green"].includes(key) ? key : "";
}

function resolveAppPublicCopy(app) {
  const siteKey = siteContentKeyForApp(app?.key);
  if (!siteKey) {
    return {
      title: String(app?.title || ""),
      titleEn: String(app?.titleEn || app?.title || ""),
      desc: String(app?.desc || ""),
      descEn: String(app?.descEn || app?.desc || ""),
    };
  }

  return {
    title: readNestedValue(contentVi, `sites.${siteKey}.hero.title`, String(app?.title || "")),
    titleEn: readNestedValue(contentEn, `sites.${siteKey}.hero.title`, String(app?.titleEn || app?.title || "")),
    desc: readNestedValue(contentVi, `sites.${siteKey}.seo.description`, String(app?.desc || "")),
    descEn: readNestedValue(contentEn, `sites.${siteKey}.seo.description`, String(app?.descEn || app?.desc || "")),
  };
}

const systemRegistryByKey = new Map(
  (systemRegistry.domains || [])
    .filter((entry) => entry && typeof entry === "object" && entry.key)
    .map((entry) => [entry.key, entry]),
);
const registryStatusVocabulary = systemRegistry.statusVocabulary || {};
const runtimeTruthByHost = new Map(
  (domainRuntimeTruth.domains || [])
    .filter((entry) => entry && typeof entry === "object" && entry.host)
    .map((entry) => [String(entry.host), normalizeRuntimeTruthStatus(entry.status)]),
);

const nftBridge = system.nftBridge || {};
const enterprisePlans = Array.isArray(accessModel.enterprisePlans) ? accessModel.enterprisePlans : [];
const vcProtectionProfilePolicy = accessModel.vcProtectionPolicy?.profileVerification || {};
const managedHosts = new Set(Object.values(domains));
if (nftBridge.siteUrl) {
  try {
    managedHosts.add(new URL(nftBridge.siteUrl).host);
  } catch {
    // Ignore malformed siteUrl in source data.
  }
}

const siteTheme = {
  hub: {
    brand: "VT",
    name: pair("Về Tương Lai", "Vetuonglai"),
    accent: "#7bd3ff",
    accentSoft: "rgba(123, 211, 255, 0.18)",
    accentStrong: "#d9f5ff",
  },
  vc: {
    brand: "VC",
    name: pair("VC Registry", "VC Registry"),
    accent: "#f4c96b",
    accentSoft: "rgba(244, 201, 107, 0.18)",
    accentStrong: "#fff0c7",
  },
  edu: {
    brand: "ED",
    name: pair("Future EDU", "Future EDU"),
    accent: "#76dfc1",
    accentSoft: "rgba(118, 223, 193, 0.16)",
    accentStrong: "#d7fff2",
  },
  member: {
    brand: "MB",
    name: pair("Future MEMBER", "Future MEMBER"),
    accent: "#8fd9d2",
    accentSoft: "rgba(143, 217, 210, 0.18)",
    accentStrong: "#d9fff7",
  },
  work: {
    brand: "WK",
    name: pair("Future WORK", "Future WORK"),
    accent: "#ffd27a",
    accentSoft: "rgba(255, 210, 122, 0.18)",
    accentStrong: "#fff0c7",
  },
  market: {
    brand: "MK",
    name: pair("Future MARKET", "Future MARKET"),
    accent: "#9be37f",
    accentSoft: "rgba(155, 227, 127, 0.18)",
    accentStrong: "#e5ffd7",
  },
  community: {
    brand: "CM",
    name: pair("Future COMMUNITY", "Future COMMUNITY"),
    accent: "#8ac6ff",
    accentSoft: "rgba(138, 198, 255, 0.18)",
    accentStrong: "#deefff",
  },
  ai: {
    brand: "AI",
    name: pair("Future AI", "Future AI"),
    accent: "#b28dff",
    accentSoft: "rgba(178, 141, 255, 0.18)",
    accentStrong: "#efe4ff",
  },
  business: {
    brand: "BS",
    name: pair("Future BUSINESS", "Future BUSINESS"),
    accent: "#ff9f6b",
    accentSoft: "rgba(255, 159, 107, 0.18)",
    accentStrong: "#ffe6d5",
  },
  green: {
    brand: "GR",
    name: pair("Future GREEN", "Future GREEN"),
    accent: "#59d78b",
    accentSoft: "rgba(89, 215, 139, 0.18)",
    accentStrong: "#d7ffea",
  },
  finance: {
    brand: "FN",
    name: pair("Future FIN", "Future FIN"),
    accent: "#6fb7ff",
    accentSoft: "rgba(111, 183, 255, 0.18)",
    accentStrong: "#dcecff",
  },
  life: {
    brand: "LF",
    name: pair("Future LIFE", "Future LIFE"),
    accent: "#ff9d72",
    accentSoft: "rgba(255, 157, 114, 0.18)",
    accentStrong: "#ffe2d1",
  },
  invest: {
    brand: "IV",
    name: pair("Future INVEST", "Future INVEST"),
    accent: "#ffb86f",
    accentSoft: "rgba(255, 184, 111, 0.18)",
    accentStrong: "#ffe7c7",
  },
};

function pair(vi, en = vi) {
  return {
    vi: String(vi ?? ""),
    en: String(en ?? vi ?? ""),
  };
}

function relativeToRoot(targetPath) {
  return path.relative(ROOT, targetPath).split(path.sep).join("/");
}

async function readUtf8WithTimeout(targetPath, timeoutMs = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await readFile(targetPath, { encoding: "utf8", signal: controller.signal });
  } catch (error) {
    if (error && typeof error === "object" && error.name === "AbortError") {
      throw new Error(`Timed out reading ${relativeToRoot(targetPath)} after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function extractMarkdownTitle(markdown = "", fallback = "") {
  const match = markdown.match(/^#\s+(.+)$/m);
  return String(match?.[1] || fallback).trim();
}

function parseDocAnnualPricing(markdown = "") {
  const parseFirstMatch = (patterns) => {
    for (const pattern of patterns) {
      const match = markdown.match(pattern);
      if (match?.[1]) return Number.parseInt(match[1], 10);
    }
    return null;
  };

  const year1Usd = parseFirstMatch([
    /Năm đầu(?: tiên)?\s*:\s*\*{0,2}\s*(\d+)\s*USD/i,
    /year 1[^0-9]{0,40}(\d+)\s*USD/i,
  ]);
  const year2PlusUsd = parseFirstMatch([
    /Từ năm thứ\s*2\s*trở đi\s*:\s*\*{0,2}\s*(\d+)\s*USD/i,
    /năm\s*2\+[^0-9]{0,40}(\d+)\s*USD/i,
    /year 2\+[^0-9]{0,40}(\d+)\s*USD/i,
  ]);

  return {
    year1Usd: Number.isFinite(year1Usd) ? year1Usd : null,
    year2PlusUsd: Number.isFinite(year2PlusUsd) ? year2PlusUsd : null,
  };
}

function parseSpecialistPackCount(markdown = "") {
  return (markdown.match(/^##\s+\d+\.\s+Pack\b/gm) || []).length;
}

async function buildOfficialDocsLock(accessContract) {
  let files = [];
  let officialDocsDir = OFFICIAL_DOCS_CANDIDATES[0];

  try {
    for (const candidateDir of OFFICIAL_DOCS_CANDIDATES) {
      try {
        await access(candidateDir);
        const candidateFiles = (await readdir(candidateDir))
          .filter((filename) => filename.toLowerCase().endsWith(".md"))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
        if (candidateFiles.length > 0) {
          officialDocsDir = candidateDir;
          files = candidateFiles;
          break;
        }
      } catch {
        // Try the next official docs source.
      }
    }

    if (files.length === 0) {
      throw new Error("No official docs markdown files found in configured sources.");
    }
  } catch (error) {
    return {
      version: accessContract.version,
      generatedAt: new Date().toISOString(),
      sourceDir: relativeToRoot(officialDocsDir),
      sourceFilesCount: 0,
      files: [],
      extracts: {
        annualAccessDocPricing: {
          year1Usd: null,
          year2PlusUsd: null,
          sourceFile: null,
        },
        runtimeAnnualPricing: {
          source: "src/data/access-model.json",
          billingCycles: accessContract.homepagePurchaseHub?.annualAccess?.billingCycles || [],
        },
        specialistPackCount: 0,
        paymentGatewayMentions: {
          paypal: false,
          stripe: false,
        },
      },
      drift: {
        annualPricingMismatch: false,
        reasons: [
          "official_docs_unavailable",
          error instanceof Error ? error.message : String(error),
        ],
      },
      readinessBoard: {
        mode: "blocked",
        team1: { first48h: [] },
        team2: { first48h: [] },
        team3: { first48h: [] },
      },
    };
  }

  const docs = [];
  for (const filename of files) {
    const absolutePath = path.join(officialDocsDir, filename);
    const markdown = await readUtf8WithTimeout(absolutePath);
    const lines = markdown.split(/\r?\n/);
    docs.push({
      filename,
      relativePath: relativeToRoot(absolutePath),
      title: extractMarkdownTitle(markdown, filename.replace(/\.md$/i, "")),
      lineCount: lines.length,
      sha256_16: createHash("sha256").update(markdown).digest("hex").slice(0, 16),
      markdown,
    });
  }

  const annualAccessDoc = docs.find((doc) => doc.filename.startsWith("03_")) || docs.find((doc) => doc.filename.includes("FUTURE_ACCESS_PASS"));
  const specialistDoc = docs.find((doc) => doc.filename.startsWith("06_")) || docs.find((doc) => doc.filename.includes("SPECIALIST_PACKS"));
  const paymentDoc = docs.find((doc) => doc.filename.startsWith("05_")) || docs.find((doc) => doc.filename.includes("PAYPAL_MAGIC_LINK"));
  const annualPricingDoc = parseDocAnnualPricing(annualAccessDoc?.markdown || "");
  const specialistPackCount = parseSpecialistPackCount(specialistDoc?.markdown || "");
  const runtimeAnnualPricing = accessContract.homepagePurchaseHub?.annualAccess?.billingCycles || [];
  const runtimeAnnualPrices = runtimeAnnualPricing
    .map((cycle) => Number(cycle?.price))
    .filter((price) => Number.isFinite(price));
  const docAnnualPrices = [
    annualPricingDoc.year1Usd,
    annualPricingDoc.year2PlusUsd,
  ].filter((price) => Number.isFinite(price));
  const annualPricingMismatch = docAnnualPrices.length > 0
    && (runtimeAnnualPrices.length !== docAnnualPrices.length
      || runtimeAnnualPrices.some((price, index) => price !== docAnnualPrices[index]));

  const paymentText = String(paymentDoc?.markdown || "");
  const gatewayMentions = {
    paypal: /paypal/i.test(paymentText),
    stripe: /stripe/i.test(paymentText),
  };

  const driftReasons = [];
  if (annualPricingMismatch) {
    driftReasons.push("annual_pricing_docs_vs_runtime_mismatch");
  }
  if (!gatewayMentions.stripe) {
    driftReasons.push("stripe_not_explicit_in_official_docs_file_05");
  }

  return {
    version: accessContract.version,
    generatedAt: new Date().toISOString(),
    sourceDir: relativeToRoot(officialDocsDir),
    sourceFilesCount: docs.length,
    files: docs.map(({ markdown, ...entry }) => entry),
    extracts: {
      annualAccessDocPricing: {
        ...annualPricingDoc,
        sourceFile: annualAccessDoc?.relativePath || null,
      },
      runtimeAnnualPricing: {
        source: "src/data/access-model.json",
        billingCycles: runtimeAnnualPricing,
      },
      specialistPackCount,
      paymentGatewayMentions: gatewayMentions,
    },
    drift: {
      annualPricingMismatch,
      reasons: driftReasons,
      comparedAnnualPrices: {
        docs: docAnnualPrices,
        runtime: runtimeAnnualPrices,
      },
    },
    readinessBoard: {
      mode: "parallel_upgrade_ready",
      team1: {
        first48h: [
          "Lock runtime checkout + webhook contracts from official docs set.",
          "Keep dual-gateway resolver stable while docs/runtime pricing drift is unresolved.",
          "Expose official-docs lock endpoint for downstream teams.",
        ],
      },
      team2: {
        first48h: [
          "Align teaser CTA links to homepage purchase-hub canonical flow.",
          "Apply legal-safe copy from 11_LEGAL_TRUST_LANGUAGE_RULES to all deep-content CTAs.",
          "Use official-docs lock endpoint as source-of-truth for live/next/later wording.",
        ],
      },
      team3: {
        first48h: [
          "Gate affiliate activation after annual + pack + compliance pass.",
          "Validate disclosure placement blocks DPM-001..DPM-021 against official docs pack.",
          "Publish trust-layer policy checks based on team3-policy matrix and official docs lock.",
        ],
      },
    },
  };
}

const ecosystemDirectory = (systemRegistry.domains || [])
  .filter((entry) => entry && domains[entry.key])
  .map((entry) => {
    const runtimeStatus = runtimeTruthByHost.get(domains[entry.key]);
    const statusMeta = resolveSurfaceStatusMeta(runtimeStatus || entry.status);
    return {
      key: entry.key,
      label: pair(entry.labelVi || entry.key.toUpperCase(), entry.labelEn || entry.key.toUpperCase()),
      status: statusMeta.status,
      stageLabel: statusMeta.stageLabel,
      statusLabel: statusMeta.statusLabel,
      primaryNav: Boolean(entry.primaryNav),
      mission: String(entry.mission || ""),
      url: String(entry.url || `https://${domains[entry.key]}`),
      publicDiscovery: entry.publicDiscovery !== false,
    };
  });

const ecosystemDirectoryByKey = new Map(ecosystemDirectory.map((entry) => [entry.key, entry]));
const ecosystemNavKeys = ecosystemDirectory
  .filter((entry) => entry.primaryNav)
  .map((entry) => entry.key);

function isPubliclyDiscoverable(entry) {
  if (!entry) return false;
  if (entry.publicDiscovery === false) return false;
  return entry.publicDiscovery !== false;
}

const publicEcosystemDirectory = ecosystemDirectory.filter(isPubliclyDiscoverable);

const ecosystemMission = Object.fromEntries(
  ecosystemDirectory.map((entry) => [entry.key, entry.mission || ""]),
);

const appCatalog = apps.map((app) => {
  const fromRegistry = systemRegistryByKey.get(app.key) || {};
  const resolvedUrl = String(fromRegistry.url || app.publicUrl || app.url || "");
  const runtimeHost = (() => {
    try {
      return new URL(resolvedUrl).host;
    } catch {
      return domains[app.key] || "";
    }
  })();
  const runtimeStatus = runtimeTruthByHost.get(runtimeHost);
  const statusMeta = resolveSurfaceStatusMeta(runtimeStatus || fromRegistry.status || app.status);
  const publicCopy = resolveAppPublicCopy(app);
  const resolvedHost = (() => {
    try {
      return new URL(resolvedUrl).host;
    } catch {
      return app.key === "nft" ? "nft.iai.one" : `${app.key}.vetuonglai.com`;
    }
  })();

  return {
    ...app,
    ...publicCopy,
    status: statusMeta.status,
    stageLabel: statusMeta.stageLabel,
    statusLabel: statusMeta.statusLabel,
    url: resolvedUrl,
    host: resolvedHost,
  };
});

const specialistPacks = [
  { code: "g1", name: pair("Nền Tảng Tư Duy", "Foundation Thinking"), price: "9 USD", affiliate: "5%" },
  { code: "g2", name: pair("Kỷ Luật Tài Chính", "Finance Discipline"), price: "19 USD", affiliate: "5.5%" },
  { code: "g3", name: pair("Hệ Điều Hành Sống", "Life Operating System"), price: "29 USD", affiliate: "6%" },
  { code: "g4", name: pair("Khởi Nghiệp Thực Chiến", "Hands-On Startup"), price: "39 USD", affiliate: "6.5%" },
  { code: "g5", name: pair("Đầu Tư Tỉnh Táo", "Sane Investing"), price: "49 USD", affiliate: "7%" },
  { code: "g6", name: pair("Tạo Giá Trị Số", "Digital Value Creation"), price: "59 USD", affiliate: "7.5%" },
  { code: "g7", name: pair("Tác Động Xanh", "Green Impact"), price: "69 USD", affiliate: "8%" },
  { code: "g8", name: pair("Dẫn Dắt và Cộng Đồng", "Leadership and Community"), price: "79 USD", affiliate: "8.9%" },
  { code: "g9", name: pair("VTL Elite — Toàn Hệ", "VTL Elite — Full System"), price: "99 USD", affiliate: "9.9%" },
];

const domainPackMap = {
  hub: "g1",
  edu: "g6",
  vc: "g8",
  green: "g7",
  finance: "g2",
  life: "g3",
  invest: "g5",
  member: "g1",
  work: "g4",
  market: "g6",
  community: "g8",
  ai: "g6",
};

const pageMetaOverrides = new Map([
  ["hub:/thanh-vien/", {
    canonicalUrl: `https://${domains.member}/`,
    sourceOwner: `https://${domains.member}/`,
    robots: "noindex,follow",
  }],
  ["hub:/he-sinh-thai/", {
    canonicalUrl: `https://${domains.hub}/he-sinh-thai/`,
    sourceOwner: `https://${domains.hub}/`,
  }],
  ["hub:/sitemap/", {
    canonicalUrl: `https://${domains.hub}/sitemap/`,
    sourceOwner: `https://${domains.hub}/`,
  }],
  ["hub:/bat-dau/", {
    canonicalUrl: `https://${domains.hub}/bat-dau/`,
    sourceOwner: `https://${domains.hub}/`,
  }],
]);

function resolvePageMeta(currentKey, pathname) {
  const canonicalUrl = absoluteUrl(domains[currentKey], pathname);
  const base = {
    canonicalUrl,
    sourceOwner: canonicalUrl,
    robots: "index,follow",
  };
  const override = pageMetaOverrides.get(`${currentKey}:${pathname}`);
  return override ? { ...base, ...override } : base;
}

function normalizeCopy(value) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("vi" in value || "en" in value)) {
    return pair(value.vi ?? value.en ?? "", value.en ?? value.vi ?? "");
  }

  return pair(value ?? "", value ?? "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attrsToString(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false && value !== "")
    .map(([key, value]) => (value === true ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`))
    .join("");
}

function localizedText(value, tag = "span", attrs = {}) {
  const copy = normalizeCopy(value);
  const mergedAttrs = {
    ...attrs,
    "data-text-vi": copy.vi,
    "data-text-en": copy.en,
  };
  return `<${tag}${attrsToString(mergedAttrs)}>${escapeHtml(copy.vi)}</${tag}>`;
}

function localizedHtml(value, tag = "div", attrs = {}) {
  const copy = normalizeCopy(value);
  const mergedAttrs = {
    ...attrs,
    "data-html-vi": copy.vi,
    "data-html-en": copy.en,
  };
  return `<${tag}${attrsToString(mergedAttrs)}>${copy.vi}</${tag}>`;
}

function absoluteUrl(domain, pathname = "/") {
  const url = new URL(`https://${domain}`);
  url.pathname = pathname;
  return url.toString();
}

function deepLinkAbsoluteUrl(rawUrl = "") {
  try {
    return new URL(String(rawUrl || "")).toString();
  } catch {
    return String(rawUrl || "");
  }
}

const canonicalIntentMap = new Map([
  ["annual", "annual-access"],
  ["annual-access", "annual-access"],
  ["pack", "specialist-pack"],
  ["specialist-pack", "specialist-pack"],
  ["depth", "specialist-pack"],
  ["course-depth", "specialist-pack"],
  ["course-card", "specialist-pack"],
  ["course-list", "specialist-pack"],
  ["course-list-item", "specialist-pack"],
  ["course-detail", "specialist-pack"],
  ["job-apply", "specialist-pack"],
  ["brief", "specialist-pack"],
  ["market-buy", "specialist-pack"],
  ["market-rules", "specialist-pack"],
  ["member-depth", "specialist-pack"],
  ["journey", "specialist-pack"],
  ["green-depth", "specialist-pack"],
  ["finance-depth", "specialist-pack"],
  ["life-depth", "specialist-pack"],
  ["invest-depth", "specialist-pack"],
]);

function canonicalPurchaseIntent(intent) {
  const key = String(intent || "").trim().toLowerCase();
  if (!key) return "specialist-pack";
  return canonicalIntentMap.get(key) || "specialist-pack";
}

function purchaseHubUrl({ entry, pack, slug = "", intent = "specialist-pack", source = "" }) {
  const url = new URL(`https://${domains.hub}/`);
  if (entry) url.searchParams.set("entry", entry);
  if (pack) url.searchParams.set("pack", pack.toLowerCase());
  if (slug) url.searchParams.set("slug", slug);
  url.searchParams.set("intent", canonicalPurchaseIntent(intent));
  if (source) url.searchParams.set("source", source);
  return url.toString();
}

function deepContentHubCta(entry, intent = "specialist-pack", source = "", slug = "") {
  return purchaseHubUrl({
    entry,
    pack: domainPackMap[entry] || "g1",
    intent,
    source,
    slug,
  });
}

const disclosurePlacements = [
  {
    id: "DPM-001",
    surfaceKey: "hub.purchase_hub.hero",
    routeContext: `https://${domains.hub}/`,
    trigger: "user enters purchase hub",
    blockKeys: ["DISC-ANNUAL-PACK-SEPARATION", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Điểm vào thành viên là lớp nền. Lớp chuyên sâu chỉ mở khi bạn thực sự cần thêm chiều sâu.",
      "Member access is the base layer. Specialist depth opens only when you truly need deeper work.",
    ),
  },
  {
    id: "DPM-002",
    surfaceKey: "hub.package_chooser.cards",
    routeContext: `https://${domains.hub}/#package-chooser`,
    trigger: "user compares annual vs pack",
    blockKeys: ["DISC-ANNUAL-PACK-SEPARATION"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Mỗi điểm vào mở một lớp khác nhau. Hãy chọn theo nhu cầu hiện tại, không theo cảm giác khẩn cấp.",
      "Each entry point opens a different layer. Choose by present need, not by urgency.",
    ),
  },
  {
    id: "DPM-003",
    surfaceKey: "hub.start_here",
    routeContext: `https://${domains.hub}/#start-here`,
    trigger: "user picks annual or specialist path",
    blockKeys: ["DISC-NO-GUARANTEE", "DISC-AFFILIATE-ACTIVATION-RULE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Hệ không cam kết thu nhập. Bạn bắt đầu từ lớp phù hợp với trạng thái của mình.",
      "The system does not promise income. Start from the layer that matches your current state.",
    ),
  },
  {
    id: "DPM-004",
    surfaceKey: "hub.bat_dau",
    routeContext: `https://${domains.hub}/bat-dau/`,
    trigger: "onboarding entry from fallback routes",
    blockKeys: ["DISC-ANNUAL-PACK-SEPARATION"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Điểm bắt đầu dùng để định hướng hành trình, không dùng để hứa hẹn kết quả.",
      "The starting point is for direction, not for promising outcomes.",
    ),
  },
  {
    id: "DPM-005",
    surfaceKey: "edu.home.deep_cta",
    routeContext: `https://${domains.edu}/`,
    trigger: "deep course CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Phần công khai giúp bạn hiểu lộ trình học. Phần sâu chỉ mở khi quyền truy cập phù hợp.",
      "The public layer explains the learning path. Deeper work opens only with the right access.",
    ),
  },
  {
    id: "DPM-006",
    surfaceKey: "edu.courses.list",
    routeContext: `https://${domains.edu}/courses/`,
    trigger: "course list item deep CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Danh sách khóa học chỉ công bố lớp học công khai. Phần sâu được mở theo quyền truy cập phù hợp.",
      "The course list publishes only the public learning layer. Deeper work opens through the proper access layer.",
    ),
  },
  {
    id: "DPM-007",
    surfaceKey: "edu.course.detail",
    routeContext: `https://${domains.edu}/courses/<slug>/`,
    trigger: "course detail unlock CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Học để làm được việc và tạo đầu ra. Không có cam kết thu nhập từ kết quả khóa học.",
      "Learning here is for real output. No income is promised from course outcomes.",
    ),
  },
  {
    id: "DPM-008",
    surfaceKey: "work.home.deep_cta",
    routeContext: `https://${domains.work}/`,
    trigger: "deep apply CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "WORK chỉ nên công bố cơ hội, tiêu chuẩn và bằng chứng cần có. Phần sâu mở theo điều kiện phù hợp.",
      "WORK should publish opportunities, standards, and required proof. Deeper layers open only when conditions fit.",
    ),
  },
  {
    id: "DPM-009",
    surfaceKey: "work.brief",
    routeContext: `https://${domains.work}/brief/`,
    trigger: "brief unlock CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Brief công khai dùng để giải thích yêu cầu thật. Các lớp sâu không được giả làm đã mở sẵn.",
      "A public brief should explain real requirements. Deeper layers must not pretend to be already open.",
    ),
  },
  {
    id: "DPM-010",
    surfaceKey: "market.home.deep_cta",
    routeContext: `https://${domains.market}/`,
    trigger: "market-buy CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "MARKET chỉ công bố tài sản số có cấu trúc rõ ràng. Không có cam kết thu nhập từ việc mua hoặc sở hữu.",
      "MARKET should publish only clearly structured digital assets. No income is promised from buying or owning them.",
    ),
  },
  {
    id: "DPM-011",
    surfaceKey: "market.rules",
    routeContext: `https://${domains.market}/rules/`,
    trigger: "rules-based unlock CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-REFUND-FRAUD-GATE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Quy tắc giao dịch công khai phải rõ, trung tính và kiểm tra được. Các quyền nâng cao chỉ mở khi điều kiện đã đủ.",
      "Public transaction rules must stay clear, neutral, and checkable. Higher rights open only when conditions are met.",
    ),
  },
  {
    id: "DPM-012",
    surfaceKey: "green.home.deep_cta",
    routeContext: `https://${domains.green}/`,
    trigger: "framework depth CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "GREEN chỉ có giá trị khi hành động đi kèm bằng chứng kiểm tra được.",
      "GREEN has value only when action is paired with checkable evidence.",
    ),
  },
  {
    id: "DPM-013",
    surfaceKey: "finance.home.deep_cta",
    routeContext: `https://${domains.finance}/`,
    trigger: "framework depth CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "FINANCE không cam kết lợi nhuận hay tăng thu nhập nhanh.",
      "FINANCE does not promise profit or rapid income growth.",
    ),
  },
  {
    id: "DPM-014",
    surfaceKey: "life.home.deep_cta",
    routeContext: `https://${domains.life}/`,
    trigger: "framework depth CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "LIFE là lớp nhịp sống và quan sát nền. Nó không thay thế tư vấn y tế hay điều trị.",
      "LIFE is a rhythm and baseline observation layer. It does not replace medical advice or treatment.",
    ),
  },
  {
    id: "DPM-015",
    surfaceKey: "invest.home.deep_cta",
    routeContext: `https://${domains.invest}/`,
    trigger: "framework depth CTA",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "INVEST không đưa khuyến nghị mua bán và không hứa hẹn lợi nhuận.",
      "INVEST does not issue buy-sell recommendations and does not promise returns.",
    ),
  },
  {
    id: "DPM-016",
    surfaceKey: "member.home.deep_cta",
    routeContext: `https://${domains.member}/`,
    trigger: "member-depth CTA to hub",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-AFFILIATE-ACTIVATION-RULE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "MEMBER là lớp định danh và hành trình. Một số quyền chỉ mở khi hệ thống xác nhận đủ điều kiện.",
      "MEMBER is the identity and journey layer. Some rights open only after the system confirms eligibility.",
    ),
  },
  {
    id: "DPM-017",
    surfaceKey: "member.journey",
    routeContext: `https://${domains.member}/journey/`,
    trigger: "journey CTA to hub pack chooser",
    blockKeys: ["DISC-DEEP-ROUTE-TO-HUB", "DISC-AFFILIATE-ACTIVATION-RULE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Journey dùng để chỉ bước tiếp theo phù hợp. Nó không tự động mở mọi quyền sâu hơn.",
      "Journey is for the next suitable step. It does not automatically open every deeper right.",
    ),
  },
  {
    id: "DPM-018",
    surfaceKey: "checkout.pre_confirm",
    routeContext: "runtime checkout step before provider redirect",
    trigger: "user confirms checkout intent",
    blockKeys: ["DISC-ANNUAL-PACK-SEPARATION", "DISC-NO-GUARANTEE", "DISC-REFUND-FRAUD-GATE"],
    eventHook: "disclosure_acknowledged",
    finalStatus: "approved",
    copy: pair(
      "Xác nhận: mỗi lớp truy cập có phạm vi riêng. Hệ không hứa hẹn kết quả tài chính.",
      "Confirm: each access layer has its own scope. The system makes no financial-outcome promises.",
    ),
  },
  {
    id: "DPM-019",
    surfaceKey: "checkout.success",
    routeContext: `https://${domains.member}/unlock/success/`,
    trigger: "payment success return",
    blockKeys: ["DISC-AFFILIATE-ACTIVATION-RULE", "DISC-REFUND-FRAUD-GATE"],
    eventHook: "disclosure_acknowledged_recommended",
    finalStatus: "approved",
    copy: pair(
      "Quyền truy cập chỉ được xem là hoàn tất khi hệ thống xác nhận thành công và đồng bộ đầy đủ.",
      "Access is considered complete only after the system confirms success and finishes synchronization.",
    ),
  },
  {
    id: "DPM-020",
    surfaceKey: "annual_only.affiliate_disabled_state",
    routeContext: "annual-only member surfaces",
    trigger: "user enters affiliate-related surface without eligibility",
    blockKeys: ["DISC-AFFILIATE-ACTIVATION-RULE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "Một số quyền nâng cao sẽ chưa mở ở trạng thái hiện tại của bạn.",
      "Some advanced rights remain unavailable in your current state.",
    ),
  },
  {
    id: "DPM-021",
    surfaceKey: "vc.reference_blocks",
    routeContext: "hub/member surfaces that reference VC trust",
    trigger: "user opens VC explanation near conversion",
    blockKeys: ["DISC-VC-PROOF-DIRECTION", "DISC-NO-GUARANTEE"],
    eventHook: "optional",
    finalStatus: "approved",
    copy: pair(
      "VC xác minh bằng chứng và cách kiểm tra, không xác minh kết quả tài chính.",
      "VC verifies evidence and how it can be checked, not financial outcomes.",
    ),
  },
];

const disclosurePlacementById = new Map(disclosurePlacements.map((placement) => [placement.id, placement]));

function renderDisclosureBlock(placementId, { compact = false, className = "" } = {}) {
  const placement = disclosurePlacementById.get(placementId);
  if (!placement) return "";

  const classes = ["disclosure-block", compact ? "is-compact" : "", className].filter(Boolean).join(" ");
  return `
    <aside class="${classes}" data-disclosure-kind="public-note" data-final-status="${escapeHtml(placement.finalStatus)}">
      ${localizedText(disclosureNoteLabelCopy, "div", { class: "disclosure-label" })}
      ${localizedText(placement.copy, "div", { class: "disclosure-copy" })}
    </aside>
  `;
}

function renderDisclosureStack(placementIds, { className = "" } = {}) {
  const blocks = placementIds
    .map((placementId) => renderDisclosureBlock(placementId))
    .filter(Boolean)
    .join("");

  if (!blocks) return "";
  const classes = ["disclosure-stack", className].filter(Boolean).join(" ");
  return `<div class="${classes}">${blocks}</div>`;
}

function buildTeam2KickoffOutput(contractVersion) {
  return {
    version: "1.0",
    contractVersion,
    source: "docs/final-lock/VTL_11_TEAM_2_KICKOFF_48H.md",
    outputs: {
      componentMap: [
        { component: "purchase_hub", route: "/#purchase-hub", owner: "team2" },
        { component: "package_chooser", route: "/#package-chooser", owner: "team2" },
        { component: "start_here", route: "/#start-here", owner: "team2" },
        { component: "dashboard_entry", route: `https://${domains.member}/`, owner: "team2" },
      ],
      ctaMap: [
        { domain: "edu", ctaType: "deep_course", target: deepContentHubCta("edu", "course-depth", "edu-home") },
        { domain: "work", ctaType: "deep_apply", target: deepContentHubCta("work", "job-apply", "work-home") },
        { domain: "market", ctaType: "deep_purchase", target: deepContentHubCta("market", "market-buy", "market-home") },
        { domain: "green", ctaType: "deep_framework", target: deepContentHubCta("green", "green-depth", "green-home") },
        { domain: "finance", ctaType: "deep_framework", target: deepContentHubCta("finance", "finance-depth", "finance-home") },
        { domain: "life", ctaType: "deep_framework", target: deepContentHubCta("life", "life-depth", "life-home") },
        { domain: "invest", ctaType: "deep_framework", target: deepContentHubCta("invest", "invest-depth", "invest-home") },
        { domain: "member", ctaType: "deep_journey", target: deepContentHubCta("member", "member-depth", "member-home") },
      ],
      routeMap: [
        { from: "edu deep CTA", to: "homepage purchase hub" },
        { from: "work deep CTA", to: "homepage purchase hub" },
        { from: "market deep CTA", to: "homepage purchase hub" },
        { from: "life deep CTA", to: "homepage purchase hub" },
        { from: "finance deep CTA", to: "homepage purchase hub" },
        { from: "green deep CTA", to: "homepage purchase hub" },
        { from: "invest deep CTA", to: "homepage purchase hub" },
        { from: "member deep CTA", to: "homepage purchase hub" },
      ],
      disclosureMap: disclosurePlacements.map((placement) => ({
        id: placement.id,
        surfaceKey: placement.surfaceKey,
        routeContext: placement.routeContext,
        trigger: placement.trigger,
        blockKeys: placement.blockKeys,
        eventHook: placement.eventHook,
        finalStatus: placement.finalStatus,
      })),
      contentDepthMap: {
        layerA_public_basic: "domain owned public teaser/demo/basic trust",
        layerB_member_basic: "homepage + member orientation",
        layerC_specialist_depth: "homepage pack chooser + entitlement",
        layerD_credential_program: "proof + review + issuance contract",
      },
      blockers: {
        team1: [
          "route parameter schema for entry/pack/intent/source/slug",
          "entitlement names and member states",
          "return flow contract from homepage purchase hub",
        ],
        team3: [
          "allowed trust language",
          "disclosure placement rules",
          "pack-policy labels",
          "affiliate-disabled copy for annual-only state",
        ],
      },
    },
  };
}

function buildContractsManifest(contractVersion, officialDocsLock) {
  const sourceOfTruth = [
    "docs/PROJECT_CONTEXT_ENGINE.md",
    "docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md",
  ];

  const officialSourceFiles = (officialDocsLock?.files || [])
    .map((file) => file.relativePath)
    .filter((value) => typeof value === "string" && value.length > 0);

  if (officialSourceFiles.length > 0) {
    sourceOfTruth.push(...officialSourceFiles);
  }

  return {
    name: "vetuonglai-contract-manifest",
    contractVersion,
    generatedAt: new Date().toISOString(),
    sourceOfTruth,
    contracts: {
      team1: {
        accessModel: `https://${domains.member}/api/access-model.json`,
        entitlements: `https://${domains.member}/api/entitlements.json`,
        events: `https://${domains.member}/api/events.json`,
        routing: `https://${domains.member}/api/routing.json`,
        purchaseHub: `https://${domains.hub}/api/purchase-hub.json`,
      },
      team2: {
        kickoffOutput: `https://${domains.hub}/api/team2-kickoff-output.json`,
        disclosures: `https://${domains.hub}/api/disclosures.json`,
      },
      team3: {
        policyMatrixHub: `https://${domains.hub}/api/policy/team3-matrix.json`,
        policyMatrixMember: `https://${domains.member}/api/team3-policy-matrix.json`,
      },
      team4: {
        packageFormRegistryHub: `https://${domains.hub}/api/team4/package-form-registry.json`,
        packageFormRegistryMember: `https://${domains.member}/api/team4/package-form-registry.json`,
        businessDomainContractHub: `https://${domains.hub}/api/team4/business-domain-contract.json`,
        businessDomainContractMember: `https://${domains.member}/api/team4/business-domain-contract.json`,
        packageComparisonDemoOutputHub: `https://${domains.hub}/api/team4/package-comparison-demo-output.json`,
        packageComparisonDemoOutputMember: `https://${domains.member}/api/team4/package-comparison-demo-output.json`,
      },
      discovery: {
        hubIndex: `https://${domains.hub}/api/index.json`,
        memberIndex: `https://${domains.member}/api/index.json`,
      },
      governance: {
        officialDocsLock: `https://${domains.hub}/api/official-docs-lock.json`,
        officialDocsLockMember: `https://${domains.member}/api/official-docs-lock.json`,
        systemRegistry: `https://${domains.hub}/api/system-registry.json`,
        systemRegistryMember: `https://${domains.member}/api/system-registry.json`,
      },
    },
  };
}

function localizedUrl(domain, pathname, language) {
  const url = new URL(absoluteUrl(domain, pathname));
  url.searchParams.set("lang", language);
  return url.toString();
}

function renderAlternateLocaleLinks(domain, pathname, canonical) {
  const links = activePublicLocales
    .filter((entry) => entry?.seoEnabled !== false && entry?.key && entry?.tag)
    .map((entry) => `  <link rel="alternate" hreflang="${escapeHtml(entry.tag)}" href="${escapeHtml(localizedUrl(domain, pathname, entry.key))}" />`);

  links.push(`  <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}" />`);
  return links.join("\n");
}

function renderOgLocaleMeta() {
  const primary = primaryLocaleTag.replace("-", "_");
  const alternates = activeLocaleTags
    .filter((tag) => tag !== primaryLocaleTag)
    .map((tag) => `  <meta property="og:locale:alternate" content="${escapeHtml(tag.replace("-", "_"))}" />`);

  return [
    `  <meta property="og:locale" content="${escapeHtml(primary)}" />`,
    ...alternates,
  ].join("\n");
}

function linkAttributeMap(href) {
  if (!href.startsWith("http")) return {};

  const url = new URL(href);
  if (managedHosts.has(url.host)) return {};

  return { target: "_blank", rel: "noreferrer" };
}

function button(href, label, variant = "primary", attrs = {}) {
  return localizedText(label, "a", {
    class: `button ${variant}`,
    href,
    ...linkAttributeMap(href),
    ...attrs,
  });
}

function gatewayCtaButton(href, variant = "primary", attrs = {}) {
  return button(href, gatewayPrimaryCtaCopy, variant, attrs);
}

function statusBadge(status, label) {
  return localizedText(label, "span", { class: `badge ${badgeTone(status)}` });
}

function registryStatusLabel(status) {
  const normalized = normalizeSurfaceStatus(status);
  const fallbackLabels = {
    live: pair("Live", "Live"),
    member_preview: pair("Member Preview", "Member Preview"),
    planned: pair("Planned", "Planned"),
    bridge: pair("Bridge", "Bridge"),
  };
  const registryLabel = registryStatusVocabulary[normalized] || {};

  return pair(
    readNestedValue(contentVi, `shared.status.${normalized}`, registryLabel.vi || fallbackLabels[normalized].vi),
    readNestedValue(contentEn, `shared.status.${normalized}`, registryLabel.en || fallbackLabels[normalized].en),
  );
}

function surfaceBadgeClass(status) {
  if (status === "reviewing") return "reviewing";
  const normalized = normalizeRuntimeTruthStatus(status);
  if (normalized === "member_preview") return "member-preview";
  return normalized;
}

function appStageLabel(app) {
  if (app?.statusLabel) return normalizeCopy(app.statusLabel);
  const stage = String(app.stageLabel || "").trim().toUpperCase();
  if (stage) return registryStatusLabel(stage.toLowerCase());

  const status = normalizeSurfaceStatus(app.status);
  return registryStatusLabel(status);
}

function recordStatusLabel(status) {
  switch (status) {
    case "verified":
      return pair("Đã xác minh", "Verified");
    case "reviewing":
      return pair("Đang rà soát", "Reviewing");
    default:
      return pair("Kế hoạch", "Planned");
  }
}

function recordTypeLabel(type = "credential") {
  if (type === "asset") return pair("Tài sản", "Asset");
  return pair("Chứng nhận", "Credential");
}

function badgeTone(status) {
  if (status === "verified") return "live";
  return surfaceBadgeClass(status);
}

function cardTitle(copy) {
  return localizedHtml(copy, "h3", { class: "card-title" });
}

function cardText(copy, className = "card-copy") {
  return localizedText(copy, "div", { class: className });
}

function cardHtml(copy, className = "card-copy") {
  return localizedHtml(copy, "div", { class: className });
}

function renderCard({ title, body, badge = "", meta = "", actions = "", support = "" }) {
  return `
    <article class="card">
      <div class="card-body stack">
        <div class="cluster" style="justify-content:space-between;align-items:flex-start">
          ${title}
          ${badge}
        </div>
        ${body}
        ${meta ? `<div class="cluster subtle mono">${meta}</div>` : ""}
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
        ${support ? `<div class="card-support">${support}</div>` : ""}
      </div>
    </article>
  `;
}

function renderCards(items) {
  return `<div class="grid-3">${items.join("")}</div>`;
}

function renderMetrics(items) {
  return `
    <aside class="card">
      <div class="card-body">
        <div class="metrics">
          ${items.map((item) => `
            <div class="metric">
              ${typeof item.value === "object" && item.value !== null
                ? localizedText(item.value, "div", { class: "metric-value" })
                : `<div class="metric-value">${escapeHtml(item.value)}</div>`}
              ${localizedText(item.label, "div", { class: "metric-label" })}
            </div>
          `).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderList(items, { ordered = false, html = false } = {}) {
  const tag = ordered ? "ol" : "ul";
  const renderer = html ? localizedHtml : localizedText;
  return `<${tag} class="list">${items.map((item) => `<li>${renderer(item, "span")}</li>`).join("")}</${tag}>`;
}

function renderTable(headers, rows, { tbodyId = "" } = {}) {
  const tbodyAttr = tbodyId ? ` id="${escapeHtml(tbodyId)}"` : "";
  return `
    <table class="table">
      <thead>
        <tr>${headers.map((header) => localizedText(header, "th")).join("")}</tr>
      </thead>
      <tbody${tbodyAttr}>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderSection(title, note, content, sectionId = "") {
  const idAttr = sectionId ? ` id="${escapeHtml(sectionId)}"` : "";
  return `
    <section class="section"${idAttr}>
      <div class="section-header">
        <div>
          ${localizedText(title, "h2", { class: "section-title" })}
          ${note ? localizedText(note, "div", { class: "section-note" }) : ""}
        </div>
      </div>
      ${content}
    </section>
  `;
}

function renderHero({ eyebrow, title, description, beforeActions = "", actions = "", afterActions = "", aside = "" }) {
  return `
    ${localizedText(eyebrow, "div", { class: "eyebrow" })}
    <div class="hero-grid">
      <div class="stack">
        ${localizedHtml(title, "h1", { class: "headline" })}
        ${localizedHtml(description, "p", { class: "lede" })}
        ${beforeActions || ""}
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
        ${afterActions || ""}
      </div>
      ${aside || ""}
    </div>
  `;
}

function resolveSurfaceEntry(currentKey) {
  const registryEntry = systemRegistryByKey.get(currentKey);
  const runtimeStatus = runtimeTruthByHost.get(domains[currentKey]);
  if (registryEntry) {
    return {
      ...registryEntry,
      status: normalizeSurfaceStatus(runtimeStatus || registryEntry.status),
    };
  }

  return {
    key: currentKey,
    status: normalizeSurfaceStatus(runtimeStatus || (currentKey === "hub" || currentKey === "vc" || currentKey === "green" || currentKey === "finance"
      ? "live"
      : "planned")),
      mission: "",
  };
}

function resolveSurfacePublicMeta(currentKey) {
  const entry = resolveSurfaceEntry(currentKey);
  const statusMeta = resolveSurfaceStatusMeta(entry.status);
  return {
    ...entry,
    status: statusMeta.status,
    stageLabel: String(entry.stageLabel || statusMeta.stageLabel),
    statusLabel: entry.statusLabel || statusMeta.statusLabel,
    url: String(entry.url || (domains[currentKey] ? `https://${domains[currentKey]}` : "")),
  };
}

function buildSurfaceSummaryPayload(currentKey, extra = {}) {
  const entry = resolveSurfacePublicMeta(currentKey);
  return {
    name: currentKey,
    owner: domains[currentKey],
    mission: entry.mission || "",
    status: entry.status,
    stageLabel: entry.stageLabel,
    statusLabel: entry.statusLabel,
    sourceOwner: `https://${domains[currentKey]}/`,
    canonicalUrl: `https://${domains[currentKey]}/`,
    ...extra,
  };
}

function surfaceStatusNarrative(currentKey) {
  const entry = resolveSurfaceEntry(currentKey);
  switch (entry.status) {
    case "live":
      return pair(
        "Lớp công khai này đang mở ổn định. Bạn có thể đọc, xem mẫu và hiểu bước tiếp theo ngay tại đây; nếu cần đi sâu hơn, hệ sẽ đưa bạn về hub.",
        "This public layer is stably open. People can read, inspect samples, and understand the next step here; if deeper access is needed, the system routes back to the hub.",
      );
    case "member_preview":
      return pair(
        "Lớp này đang ở trạng thái xem trước cho thành viên: giá trị công khai và demo đã mở, nhưng lớp sâu hơn chỉ tiếp tục khi trạng thái truy cập phù hợp.",
        "This surface is in Member Preview: public value and demos are open, but deeper layers continue only when the access state is appropriate.",
      );
    case "bridge":
      return pair(
        "Lớp này là một cầu nối sang hệ khác. Vai trò của nó là nối bản ghi và đường kiểm tra, không tự mở thêm một luồng riêng.",
        "This layer acts as a bridge into another system. Its role is to connect records and verification paths, not to open a separate flow on its own.",
      );
    default:
      return pair(
        "Lớp này đang ở trạng thái Planned. Hiện mới mở phần giới thiệu, demo và điểm đi tiếp; nó chưa được trình bày như một lớp đã vận hành đầy đủ.",
        "This layer is currently in Planned status. Only the introduction, demos, and next-step entry are open here; it is not presented as fully operating.",
      );
  }
}

function surfaceBoundaryItems(currentKey, extraItems = []) {
  const entry = resolveSurfaceEntry(currentKey);
  const baseItems = [];

  if (entry.status === "planned") {
    baseItems.push(pair(
      "Đây là lớp công khai ở trạng thái Planned: có phần giới thiệu, demo và nút đi tiếp, nhưng chưa được trình bày như một lớp đã hoạt động đầy đủ.",
      "This is a public layer in Planned status: it has introductory content, demos, and a next-step button, but it is not presented as fully active yet.",
    ));
  } else if (entry.status === "member_preview") {
    baseItems.push(pair(
      "Lớp công khai hiện mở đủ để đọc, xem mẫu và hiểu khung vận hành; phần sâu hơn vẫn đi qua member/hub theo trạng thái truy cập.",
      "The public layer is open enough to read, inspect samples, and understand the operating frame; deeper layers still continue through member/hub according to access state.",
    ));
  } else {
    baseItems.push(pair(
      "Lớp công khai giữ giá trị thật, mẫu thật và điểm kiểm tra thật trước khi mời người xem đi tiếp.",
      "The public layer keeps real value, real samples, and real checking points before inviting people to go deeper.",
    ));
  }

  baseItems.push(
    pair(
      "Mọi nút đi sâu hơn đều quay về hub để hệ giữ một điểm vào thống nhất giữa các lớp.",
      "Every deeper-entry button returns to the hub so the system keeps one consistent entry point across layers.",
    ),
    pair(
      "Không có thanh toán trực tiếp tại trang này.",
      "There is no direct payment step on this page.",
    ),
  );

  return [...baseItems, ...extraItems];
}

function renderSurfaceGatewaySection({
  currentKey,
  deepCta,
  notes = [],
  disclosureIds = [],
  secondaryActions = "",
}) {
  const entry = resolveSurfaceEntry(currentKey);
  const stageLabel = appStageLabel(entry);
  const missionCopy = (entry.missionVi || entry.missionEn)
    ? pair(entry.missionVi || entry.mission || entry.missionEn, entry.missionEn || entry.mission || entry.missionVi)
    : null;
  const mission = entry.mission
    ? pair(`Trọng tâm hiện tại: ${missionCopy ? missionCopy.vi : entry.mission}.`, `Current focus: ${missionCopy ? missionCopy.en : entry.mission}.`)
    : pair("Trang này dùng hub làm điểm đi tiếp duy nhất.", "This page uses the hub as the only continuation point.");

  const stageCopy = entry.status === "planned"
    ? pair(
      "Bạn đang ở lớp Planned. Nếu muốn đi sâu hơn, hệ sẽ đưa bạn về hub để giữ đúng phần đang mở công khai và không nói quá phần chưa sẵn sàng.",
      "You are in the Planned layer. If you want to go deeper, the system routes you back to the hub so the public promise stays accurate and the not-yet-ready layer is not overstated.",
    )
    : pair(
      "Nếu cần đi sâu hơn, bạn vẫn tiếp tục từ hub để hệ giữ một điểm vào chung và đường đi rõ ràng.",
      "If deeper access is needed, you still continue from the hub so the system keeps one shared entry point and a clear onward path.",
    );

  const noteItems = [mission, ...notes];
  const support = renderDisclosureStack(disclosureIds, { className: "is-footer" });
  const actions = [
    gatewayCtaButton(deepCta, "primary"),
    secondaryActions,
  ].filter(Boolean).join(" ");

  return renderSection(
    pair("Đi tiếp đúng cổng", "Continue through the right entry"),
    pair(
      "Đi sâu hơn từ đúng điểm vào, không mở thanh toán ngay tại app hoặc subdomain.",
      "Go deeper from the right entry point without opening payment on the app or subdomain itself.",
    ),
    `
      <div class="grid-2">
        ${renderCard({
          title: cardTitle(pair("Mở đúng điểm vào", "Open the right entry point")),
          badge: statusBadge(badgeTone(entry.status), stageLabel),
          body: `${cardText(stageCopy)}${cardText(pair("Hub giữ điểm vào chung và dẫn bạn sang lớp phù hợp hơn khi cần.", "The hub keeps the shared entry point and leads people into the right deeper layer when needed."), "body-copy")}`,
          actions,
        })}
        ${renderCard({
          title: cardTitle(pair("Điều mở ra sau CTA", "What opens after the CTA")),
          body: renderList(noteItems),
          support,
        })}
      </div>
    `,
    "gateway-cta",
  );
}

function renderSurfaceTrustStatusSection({
  currentKey,
  extraItems = [],
  disclosureIds = [],
  actions = "",
}) {
  const entry = resolveSurfaceEntry(currentKey);
  const stageLabel = appStageLabel(entry);
  const support = renderDisclosureStack(disclosureIds, { className: "is-footer" });

  return renderSection(
    pair("Niềm tin & trạng thái", "Trust & status"),
    pair(
      "Cho người xem biết đang mở gì, đang khóa gì, và cách kiểm tra lớp này.",
      "Show people what is open, what remains gated, and how to verify this layer.",
    ),
    renderCards([
      renderCard({
        title: cardTitle(pair("Trạng thái lớp", "Surface status")),
        badge: statusBadge(badgeTone(entry.status), stageLabel),
        body: cardText(surfaceStatusNarrative(currentKey)),
      }),
      renderCard({
        title: cardTitle(pair("Ranh giới công khai", "Public boundary")),
        body: renderList(surfaceBoundaryItems(currentKey, extraItems)),
      }),
      renderCard({
        title: cardTitle(pair("Ghi chú tin cậy", "Trust note")),
        body: cardText(pair(
          "Trust ở đây đến từ wording đúng mức, demo có nhãn rõ, disclosure hiện diện và cách kiểm tra quay về đúng nguồn.",
          "Trust here comes from right-sized wording, clearly labeled demos, visible disclosures, and a verification path that returns to the right source.",
        )),
        actions,
        support,
      }),
    ]),
    "trust-status",
  );
}

function ecosystemNav(currentKey, extra = []) {
  const base = ecosystemNavKeys
    .map((key) => ecosystemDirectoryByKey.get(key))
    .filter(Boolean)
    .map((entry) => ({
      key: entry.key,
      label: entry.label ?? pair(entry.key, entry.key),
      href: entry.url || `https://${domains[entry.key]}`,
    }));

  const filteredBase = extra.length > 0 ? base.filter((item) => item.key !== currentKey) : base;
  return [...extra, ...filteredBase];
}

function renderEcosystemBacklinks(currentKey) {
  const links = ecosystemDirectory
    .filter((entry) => entry.key !== currentKey && domains[entry.key] && isPubliclyDiscoverable(entry))
    .map((entry) => {
      const status = appStageLabel(entry);
      const normalizedStatus = normalizeSurfaceStatus(entry.status);
      const rawUrl = entry.url || `https://${domains[entry.key]}`;
      const href = normalizedStatus === "planned"
        ? `https://${domains.hub}/he-sinh-thai/`
        : rawUrl;
      const host = (() => {
        try {
          return new URL(rawUrl).host;
        } catch {
          return rawUrl.replace(/^https?:\/\//, "");
        }
      })();
      return `
        <a class="footer-link" href="${href}"${attrsToString(linkAttributeMap(href))}>
          <span class="footer-link-meta">
            <span class="footer-link-host">${escapeHtml(host)}</span>
            <span class="footer-link-url mono">${escapeHtml(rawUrl)}</span>
          </span>
          <span class="badge ${badgeTone(entry.status)}">${localizedText(status)}</span>
        </a>
      `;
    });

  return `
    <div class="footer-links">
      <div class="footer-title">${localizedText(pair("Liên kết hệ sinh thái", "Ecosystem links"), "span")}</div>
      <div class="footer-grid">
        ${links.join("")}
      </div>
    </div>
  `;
}

function renderTopbar(siteKey, activeKey, items) {
  const theme = siteTheme[siteKey];

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="https://${domains.hub}">
          <span class="brand-mark">${escapeHtml(theme.brand)}</span>
          <span class="brand-meta">
            ${localizedText(theme.name, "span", { class: "brand-title" })}
            ${localizedText(brandSubtitleCopy, "span", { class: "brand-subtitle" })}
          </span>
        </a>
        <div class="nav-tools">
          <nav class="nav">
            ${items.map((item) => localizedText(item.label, "a", {
              class: item.key === activeKey ? "active" : "",
              href: item.href,
              ...linkAttributeMap(item.href),
            })).join("")}
          </nav>
          <div class="lang-switch" role="group" aria-label="Language switch" data-aria-label-vi="Chọn ngôn ngữ" data-aria-label-en="Choose language">
            <button class="lang-button is-active" type="button" data-language-option="vi" aria-pressed="true" data-aria-label-vi="Chuyển sang tiếng Việt" data-aria-label-en="Switch to Vietnamese">VI</button>
            <button class="lang-button" type="button" data-language-option="en" aria-pressed="false" data-aria-label-vi="Chuyển sang tiếng Anh" data-aria-label-en="Switch to English">EN</button>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderShell({
  currentKey,
  activeKey = currentKey,
  pathname = "/",
  title,
  description,
  canonicalUrl,
  sourceOwner,
  robots,
  navItems,
  hero,
  sections,
  inlineScript = "",
  headExtras = "",
  bodyClass = "",
}) {
  const theme = siteTheme[currentKey];
  const titleCopy = normalizeCopy(title);
  const descriptionCopy = normalizeCopy(description);
  const meta = resolvePageMeta(currentKey, pathname);
  const canonical = canonicalUrl || meta.canonicalUrl;
  const robotsMeta = robots || meta.robots;
  const sourceOwnerValue = sourceOwner || meta.sourceOwner;

  return `<!doctype html>
<html lang="${escapeHtml(primaryRuntimeLocale)}" data-language="${escapeHtml(primaryRuntimeLocale)}" data-domain="${escapeHtml(currentKey)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title data-text-vi="${escapeHtml(titleCopy.vi)}" data-text-en="${escapeHtml(titleCopy.en)}">${escapeHtml(titleCopy.vi)}</title>
  <meta name="description" data-content-vi="${escapeHtml(descriptionCopy.vi)}" data-content-en="${escapeHtml(descriptionCopy.en)}" content="${escapeHtml(descriptionCopy.vi)}" />
  <meta name="robots" content="${escapeHtml(robotsMeta)}" />
  <meta name="generator" content="${escapeHtml(system.releaseName)}" />
  <meta name="content-language" content="${escapeHtml(activePublicLocales.map((entry) => entry.key).join(", "))}" />
  <meta name="source-owner" content="${escapeHtml(sourceOwnerValue)}" />
  <meta property="og:title" data-content-vi="${escapeHtml(titleCopy.vi)}" data-content-en="${escapeHtml(titleCopy.en)}" content="${escapeHtml(titleCopy.vi)}" />
  <meta property="og:description" data-content-vi="${escapeHtml(descriptionCopy.vi)}" data-content-en="${escapeHtml(descriptionCopy.en)}" content="${escapeHtml(descriptionCopy.vi)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
${renderOgLocaleMeta()}
  <link rel="canonical" href="${escapeHtml(canonical)}" />
${renderAlternateLocaleLinks(domains[currentKey], pathname, canonical)}
  ${headExtras || ""}
  <link rel="stylesheet" href="/assets/design-tokens.css" />
  <link rel="stylesheet" href="/assets/style.css" />
  <style>
    :root {
      --accent: ${theme.accent};
      --accent-soft: ${theme.accentSoft};
      --accent-strong: ${theme.accentStrong};
    }
  </style>
</head>
  <body${bodyClass ? ` class="${escapeHtml(bodyClass)}"` : ""}>
  ${renderTopbar(currentKey, activeKey, navItems)}
  <main class="shell">
    ${hero ? `<section class="hero">${hero}</section>` : ""}
    ${sections.join("\n")}
    <footer class="footer">
      <div class="footer-stack">
        <span>© <span data-year></span> Vetuonglai System</span>
        ${localizedText(brandPromiseCopy, "span", { class: "subtle" })}
        ${renderEcosystemBacklinks(currentKey)}
      </div>
    </footer>
  </main>
  <script src="/assets/app.js" defer></script>
  ${inlineScript ? `<script>${inlineScript}</script>` : ""}
</body>
</html>`;
}

function renderHubPage() {
  const liveCount = publicEcosystemDirectory.filter((entry) => entry.status === "live").length;
  const memberPreviewCount = publicEcosystemDirectory.filter((entry) => entry.status === "member_preview").length;
  const plannedCount = publicEcosystemDirectory.filter((entry) => entry.status === "planned").length;

  const hero = renderHero({
    eyebrow: codexPair("sites.hub.hero.eyebrow", `Hệ sống ${system.releaseName}`, `The ${system.releaseNameEn} life system`),
    title: codexPair("sites.hub.hero.title", "VỀ TƯƠNG LAI", "VETUONGLAI"),
    description: codexPair(
      "sites.hub.hero.subline",
      "Một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng.",
      "A life system that helps people understand themselves, learn correctly, and produce verifiable value.",
    ),
    actions: [
      button("#journey-entry", codexPair("sites.hub.hero.primary_cta", "Xem điểm vào", "View entry point")),
      button("#ecosystem-map", codexPair("shared.cta.explore_related_layer", "Xem lớp liên quan", "Explore related layer"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: String(liveCount), label: pair("domain đang hoạt động", "live domains") },
      { value: String(memberPreviewCount), label: pair("domain mở lớp thành viên", "member-preview domains") },
      { value: String(plannedCount), label: pair("domain đang chuẩn bị", "planned domains") },
      { value: system.version, label: pair("phiên bản hệ", "system version") },
    ]),
  });

  const appCards = renderCards(appCatalog.map((app) => {
    const status = normalizeSurfaceStatus(app.status);
    const meta = `<span>${escapeHtml(app.url)}</span>`;
    const openLabel = status === "planned"
      ? pair("Xem lộ trình", "View roadmap")
      : app.key === "nft"
        ? pair("Mở NFT bridge", "Open NFT bridge")
        : pair("Mở subdomain", "Open subdomain");
    const actionHref = status === "planned" ? "/he-sinh-thai/" : app.url;

    return renderCard({
    title: cardTitle(pair(app.title, app.titleEn)),
    badge: statusBadge(badgeTone(status), appStageLabel(app)),
    body: cardText(pair(app.desc, app.descEn)),
    meta,
    actions: button(actionHref, openLabel, status === "planned" ? "ghost" : "primary"),
  });
  }));

  const problemCards = renderCards([
    renderCard({
      title: cardTitle(pair("Học nhiều nhưng không rõ để làm gì", "Learning a lot without knowing why")),
      body: cardText(pair(
        "Con người đang học rất nhiều nhưng không biết học để làm gì.",
        "People are learning a lot without knowing what the learning is for.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Làm nhiều nhưng không rõ mình đang đi đâu", "Working hard without knowing the direction")),
      body: cardText(pair(
        "Làm việc rất nhiều nhưng vẫn không có một cấu trúc sống đủ rõ để đi tiếp.",
        "Many people work hard without a clear enough structure to move forward.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Có thu nhập nhưng không hiểu tiền và rủi ro", "Having income without money clarity")),
      body: cardText(pair(
        "Có thu nhập nhưng không hiểu cách giữ tiền, tránh rủi ro và ra quyết định dài hạn.",
        "People may earn money without understanding how to protect it, reduce risk, or think long term.",
      )),
    }),
  ]);

  const whatSystemIs = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Hệ này là gì", "What this system is"))}
          ${cardText(pair(
            "Về Tương Lai là một hệ sống gồm nhiều lớp: lớp học, lớp đời sống, lớp tài chính, lớp đầu tư và lớp xác minh.",
            "Vetuonglai is a life system made of several layers: learning, life, finance, investing, and verification.",
          ), "body-copy")}
          ${cardText(pair(
            "Mỗi lớp giải quyết một phần của cuộc đời. Không có lớp nào thay thế lớp khác.",
            "Each layer solves one part of life. No layer replaces another.",
          ), "body-copy")}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Điều hệ này không làm", "What this system does not do"))}
          ${renderList([
            pair("Không hứa kiếm tiền nhanh", "No make-money-fast promise"),
            pair("Không hứa thành công", "No promise of success"),
            pair("Không truyền cảm hứng để thay cho cấu trúc sống", "No inspiration language in place of structure"),
            pair("Chỉ cung cấp cấu trúc để người dùng tự xây cuộc đời mình", "It only provides structure so people can build their own lives"),
          ])}
        </div>
      </article>
    </div>
  `;
  const memberSurface = resolveSurfacePublicMeta("member");

  const entryCards = renderCards([
    renderCard({
      title: cardTitle(pair("Điểm vào thành viên", "Member entry point")),
      badge: statusBadge("live", pair("điểm vào", "entry point")),
      body: cardText(pair(
        "Người dùng không bắt đầu bằng mua thật nhiều sản phẩm. Người dùng bắt đầu bằng một điểm vào phù hợp với trạng thái của mình.",
        "People do not begin by buying many products. They begin with the entry point that fits their current state.",
      )),
      actions: button("#journey-entry", pair("Xem điểm vào", "View entry point")),
    }),
    renderCard({
      title: cardTitle(pair("Lớp chuyên sâu", "Specialist depth")),
      badge: statusBadge("live", pair("chiều sâu", "depth")),
      body: cardText(pair(
        "Sau khi đã có điểm vào phù hợp, người dùng mới học đúng, làm thật, tạo giá trị và xác minh bằng bằng chứng.",
        "After the right entry point is chosen, people learn correctly, do real work, create value, and verify it through evidence.",
      )),
      actions: button("#start-here", pair("Xem cách hệ hoạt động", "See how the system works"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Mobile V1", "Mobile V1")),
      badge: statusBadge(surfaceBadgeClass(memberSurface.status), appStageLabel(memberSurface)),
      body: cardText(pair(
        "Hub, app mobile, EDU snapshot và VC quick verify đang dùng cùng một khung 4 trạng thái để giữ đúng bước tiếp theo.",
        "The hub, mobile app, EDU snapshots, and quick VC verify now use the same four-state model to keep the next step aligned.",
      )),
      actions: button(`https://${domains.member}/app/`, pair("Mở app mobile", "Open the mobile app"), "ghost"),
    }),
  ]);

  const purchaseHubDisclosure = renderDisclosureStack(["DPM-001"]);
  const packageChooserDisclosure = renderDisclosureStack(["DPM-002"]);
  const trustReferenceDisclosure = renderDisclosureStack(["DPM-021"]);

  const packRows = specialistPacks.map((pack) => [
    `<span class="mono">${escapeHtml(pack.code.toUpperCase())}</span>`,
    localizedText(pack.name),
    `<span class="mono">${escapeHtml(pack.price)}</span>`,
    `<a href="${purchaseHubUrl({ entry: "hub", pack: pack.code, intent: "pack" })}" class="button ghost">${localizedText(pair("Mở ở homepage", "Open on homepage"))}</a>`,
  ]);

  const packageChooser = renderTable(
    [pair("Code", "Code"), pair("Gói", "Pack"), pair("Giá", "Price"), pair("Mở", "Open")],
    packRows,
  );

  const startHere = renderCards([
    renderCard({
      title: cardTitle(pair("Bước 1: Chọn điểm vào", "Step 1: Choose the entry point")),
      body: cardText(pair(
        "Điểm vào đúng giúp bạn bắt đầu ở lớp phù hợp thay vì đi vòng quanh quá nhiều nội dung.",
        "The right entry point helps you start in the right layer instead of wandering through too much content.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Bước 2: Học đúng và làm thật", "Step 2: Learn correctly and do real work")),
      body: cardText(pair(
        "Hệ này không dừng ở đọc và biết. Bạn phải đi tới đầu ra, thực hành và bằng chứng tối thiểu.",
        "The system does not stop at reading and knowing. It has to move into output, practice, and minimum evidence.",
      )),
      support: renderDisclosureBlock("DPM-003", { compact: true }),
    }),
    renderCard({
      title: cardTitle(pair("Bước 3: Xác minh bằng bằng chứng", "Step 3: Verify through evidence")),
      body: cardText(pair(
        "Khi đã có đầu ra thật, lớp xác minh giúp người dùng giảm nói suông và tăng khả năng kiểm tra độc lập.",
        "Once real output exists, the verification layer reduces empty claims and increases independent checking.",
      )),
      actions: button(`https://${domains.vc}`, pair("Xem lớp xác minh", "View the verification layer"), "ghost"),
    }),
  ]);

  const journeyEntry = renderCards([
    renderCard({
      title: cardTitle(pair("Nếu bạn đang mất nhịp sống", "If your life rhythm is unstable")),
      body: cardText(pair(
        "Bắt đầu từ LIFE để ổn định năng lượng, kỷ luật và nền sống mỗi ngày.",
        "Start with LIFE to stabilize energy, discipline, and daily rhythm.",
      )),
      actions: button(`https://${domains.life}`, pair("Bắt đầu từ LIFE", "Start with LIFE"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Nếu bạn cần học để làm được", "If you need to learn by doing")),
      body: cardText(pair(
        "Vào EDU để học, làm, nộp đầu ra và đi tiếp bằng bằng chứng rõ ràng.",
        "Go to EDU to learn, produce work, submit output, and move forward with clear evidence.",
      )),
      actions: button(`https://${domains.edu}`, pair("Vào EDU", "Open EDU")),
    }),
    renderCard({
      title: cardTitle(pair("Nếu bạn cần lớp kiểm tra độc lập", "If you need independent proof")),
      body: cardText(pair(
        "Dùng VC để xem cách bằng chứng, hồ sơ và mã xác minh được công bố tối thiểu nhưng đủ kiểm tra.",
        "Use VC to see how evidence, profiles, and verification codes are published with minimal but sufficient disclosure.",
      )),
      actions: button(`https://${domains.vc}`, pair("Mở VC", "Open VC"), "ghost"),
    }),
  ]);

  const stories = renderCards([
    renderCard({
      title: cardTitle(pair("Hiểu mình", "Understand yourself")),
      badge: statusBadge("live", pair("lớp 1", "layer 1")),
      body: cardText(pair(
        "Bắt đầu bằng việc nhìn rõ mình đang ở đâu và mình thật sự cần gì.",
        "Begin by seeing clearly where you are and what you actually need.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Học đúng", "Learn correctly")),
      badge: statusBadge("live", pair("lớp 2", "layer 2")),
      body: cardText(pair(
        "Sau đó học và làm được việc, thay vì dừng lại ở việc đọc và nhớ.",
        "Then learn and do real work, instead of stopping at reading and remembering.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Có bằng chứng", "Produce evidence")),
      badge: statusBadge("live", pair("lớp 3", "layer 3")),
      body: cardText(pair(
        "Chỉ khi có đầu ra và bằng chứng đủ rõ, lớp xác minh mới thật sự có ý nghĩa.",
        "Only when real output and evidence exist does verification become meaningful.",
      )),
    }),
  ]);

  const languageStandard = renderCards([
    renderCard({
      title: cardTitle(pair("Một ngôn ngữ duy nhất", "One locked language system")),
      badge: statusBadge("live", pair("ngôn ngữ", "language")),
      body: cardText(pair(
        "Public layer của toàn hệ dùng chung một Language Codex, một hệ badge và một chuẩn CTA.",
        "The public layer now follows one Language Codex, one badge system, and one CTA standard.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Không dùng nội ngữ nội bộ", "No internal ops wording on public pages")),
      badge: statusBadge("live", pair("song ngữ", "bilingual")),
      body: cardText(pair(
        "Các mã nội bộ, trạng thái nguồn và route kỹ thuật không được để lộ ở lớp công khai.",
        "Internal codes, source-state labels, and technical routes do not belong on the public layer.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Nguồn i18n dùng chung", "Shared i18n source")),
      badge: statusBadge("live", pair("SEO", "SEO")),
      body: cardText(pair(
        "Tất cả text public phải đi qua nguồn ngôn ngữ dùng chung để nhiều team sửa song song mà không làm vỡ giọng hệ thống.",
        "All public copy now belongs in the shared language source so multiple teams can edit in parallel without breaking the voice.",
      )),
    }),
  ]);

  const v1 = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Cách hệ vận hành", "How the system works"))}
          ${cardText(pair(
            "Người dùng không bắt đầu bằng mua sản phẩm. Người dùng bắt đầu bằng điểm vào phù hợp, rồi học đúng, làm thật, tạo giá trị và xác minh bằng bằng chứng.",
            "People do not start by buying products. They start from the right entry point, then learn correctly, do real work, create value, and verify it through evidence.",
          ), "body-copy")}
          <div class="cluster subtle mono">
            <span>${escapeHtml(system.version)}</span>
            <span>${escapeHtml(system.updatedAt)}</span>
          </div>
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Lớp xác minh độc lập", "Independent verification layer"))}
          ${cardText(pair(
            `VC giữ vai trò xác minh độc lập cho hồ sơ, chứng nhận và bằng chứng. Một số bản ghi số có thể được mirror thêm từ ${nftBridge.registryUrl} khi phù hợp.`,
            `VC keeps the independent verification role for records, credentials, and evidence. Some digital records can also be mirrored from ${nftBridge.registryUrl} when appropriate.`,
          ), "body-copy")}
          <div class="cluster">
            ${button(`https://${domains.vc}`, pair("Mở VC", "Open VC"), "ghost")}
            ${button(nftBridge.siteUrl, pair("Mở nft.iai.one", "Open nft.iai.one"), "ghost")}
          </div>
        </div>
      </article>
    </div>
  `;

  const trustFlow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Mô hình tin cậy", "Trust model"))}
          ${renderList([
            pair("<strong>Hub</strong>: giải thích hệ và chỉ đúng điểm vào.", "<strong>Hub</strong>: explains the system and points to the right entry point."),
            pair("<strong>VC</strong>: xác minh bằng chứng bằng công bố tối thiểu nhưng đủ kiểm tra.", "<strong>VC</strong>: verifies evidence with minimal but sufficient disclosure."),
            pair("<strong>EDU / GREEN / FINANCE / LIFE / INVEST</strong>: giải quyết từng lớp vấn đề của cuộc sống.", "<strong>EDU / GREEN / FINANCE / LIFE / INVEST</strong>: solve one layer of real life each."),
            pair("<strong>NFT Bridge</strong>: là lớp hỗ trợ khi cần mirror một số bản ghi số, không thay thế VC.", "<strong>NFT Bridge</strong>: is a supporting bridge when some digital records need mirroring; it does not replace VC."),
          ], { html: true })}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Vai trò theo lớp", "Layer responsibilities"))}
          ${renderTable(
            [pair("Lớp", "Layer"), pair("Vai trò", "Responsibility")],
            [
              [`<span class="mono">hub</span>`, localizedText(pair("Giải thích hệ, bản đồ domain và điểm vào.", "Explains the system, domain map, and entry points."))],
              [`<span class="mono">vc</span>`, localizedText(pair("Lớp xác minh độc lập cho hồ sơ và bằng chứng.", "Independent verification for records and evidence."))],
              [`<span class="mono">edu</span>`, localizedText(pair("Lớp học để làm được việc và tạo đầu ra.", "The learning layer for real output and real work."))],
              [`<span class="mono">life / finance / invest / green</span>`, localizedText(pair("Các lớp đời sống, tiền, đầu tư và hành động xanh.", "The layers for life rhythm, money, investing, and green action."))],
            ],
          )}
        </div>
      </article>
    </div>
  `;

  const rollout = renderCards([
    renderCard({
      title: cardTitle(pair("Lớp xác minh", "Verification layer")),
      badge: statusBadge("live", pair("cốt lõi", "core")),
      body: cardText(pair(
        "VC là lớp giúp niềm tin bớt mù mờ hơn bằng bằng chứng có thể kiểm tra.",
        "VC reduces ambiguity by giving trust a checkable evidence layer.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lớp học", "Learning layer")),
      badge: statusBadge("live", pair("đang hoạt động", "active")),
      body: cardText(pair(
        "EDU dùng đầu ra, bài nộp và bằng chứng thay cho mô hình học chỉ để biết.",
        "EDU uses output, submission, and evidence instead of knowledge-only learning.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Các lớp sống cốt lõi", "Core life layers")),
      badge: statusBadge("planned", pair("đồng bộ", "synced")),
      body: cardText(pair(
        "LIFE, FINANCE, INVEST và GREEN giữ vai trò riêng nhưng dùng chung một ngôn ngữ hệ thống.",
        "LIFE, FINANCE, INVEST, and GREEN keep distinct roles while sharing one system language.",
      )),
    }),
  ]);

  return renderShell({
    currentKey: "hub",
    pathname: "/",
    title: codexPair("sites.hub.seo.title", "Về Tương Lai | Hệ sống và điểm vào rõ ràng", "Vetuonglai | A life system with clear entry points"),
    description: codexPair(
      "sites.hub.seo.description",
      "Một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng qua từng lớp đời sống, học tập và xác minh.",
      "A life system that helps people understand themselves, learn correctly, and produce verifiable value across living, learning, and verification layers.",
    ),
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection(pair("Vấn đề thật", "Real problems"), pair("Vấn đề không nằm ở thiếu thông tin. Vấn đề nằm ở thiếu cấu trúc sống đúng.", "The problem is not a lack of information. The problem is a lack of the right living structure."), problemCards),
      renderSection(pair("Hệ này là gì", "What this system is"), pair("Một hệ sống gồm nhiều lớp, mỗi lớp giải quyết một phần của cuộc đời.", "A life system made of several layers, each solving one part of life."), whatSystemIs),
      renderSection(pair("Bản đồ hệ", "System map"), pair("Danh mục domain và trạng thái công khai từ một nguồn chung.", "The public domain map and statuses from a shared source."), appCards, "ecosystem-map"),
      renderSection(pair("Điểm vào", "Entry points"), pair("Bắt đầu từ lớp phù hợp với trạng thái hiện tại của bạn.", "Start from the layer that matches your current state."), journeyEntry, "journey-entry"),
      renderSection(pair("Cách hệ hoạt động", "How the system works"), pair("Học đúng, làm thật, tạo giá trị và xác minh bằng bằng chứng.", "Learn correctly, do real work, create value, and verify it through evidence."), `${startHere}${rollout}`, "start-here"),
      renderSection(pair("Lớp truy cập và chiều sâu", "Access and depth"), pair("Giữ đúng lớp nền, rồi mới mở chiều sâu khi thật sự cần.", "Keep the foundation clear, then open depth only when it is truly needed."), `${purchaseHubDisclosure}${entryCards}${packageChooserDisclosure}${packageChooser}`, "purchase-hub"),
      renderSection(pair("Trust và bằng chứng", "Trust and evidence"), pair("Niềm tin tốt hơn khi có thể kiểm tra.", "Trust improves when it can be checked."), `${stories}${trustFlow}${trustReferenceDisclosure}`),
      renderSection(pair("Language Codex", "Language Codex"), pair("Một hệ, một giọng nói, một chuẩn CTA và status.", "One system, one voice, one CTA standard, and one status model."), languageStandard),
      renderSection(pair("Khóa triển khai hiện tại", "Current implementation lock"), pair("Phiên bản đang chạy phải bám đúng vai trò hub.", "The running version must stay faithful to the hub role."), v1),
    ],
  });
}

function renderHubAboutPage() {
  const hero = renderHero({
    eyebrow: pair("Về chúng tôi", "About us"),
    title: pair(
      `Về Tương Lai<br><span class="accent">sống thật, làm thật, tương lai thật</span>`,
      `Vetuonglai<br><span class="accent">live true, build true, future true</span>`,
    ),
    description: pair(
      "Chúng tôi xây một hệ sinh thái để người dùng học, làm, tạo giá trị và có bằng chứng xác minh độc lập, thay vì chạy theo hứa hẹn ngắn hạn.",
      "We build an ecosystem where people learn, build, create value, and hold independently verifiable proof, instead of chasing short-term hype.",
    ),
    actions: [
      button("/bat-dau/", pair("Bắt đầu ngay", "Start now")),
      button("/he-sinh-thai/", pair("Xem hệ sinh thái", "View ecosystem"), "ghost"),
    ].join(""),
  });

  const values = renderCards([
    renderCard({
      title: cardTitle(pair("Sống thật", "Live true")),
      body: cardText(pair("Không glorify overwork, không fake lifestyle, không đánh đổi sức khỏe để đổi lấy tiền ngắn hạn.", "No overwork glorification, no fake lifestyle, and no health tradeoffs for short-term money.")),
    }),
    renderCard({
      title: cardTitle(pair("Làm thật", "Build true")),
      body: cardText(pair("Mọi hành trình phải tạo output thực tế, deliverable kiểm chứng được và khả năng ứng dụng thật.", "Every path must produce practical outputs, verifiable deliverables, and real-world applicability.")),
    }),
    renderCard({
      title: cardTitle(pair("Tương lai thật", "Future true")),
      body: cardText(pair("Xây thu nhập, cộng đồng và cuộc sống bền vững theo nhịp dài hạn, không FOMO.", "Build income, community, and life sustainability through a long-term rhythm, not FOMO.")),
    }),
  ]);

  return renderShell({
    currentKey: "hub",
    pathname: "/ve-chung-toi/",
    title: pair("Về chúng tôi • Về Tương Lai", "About • Vetuonglai"),
    description: pair("Giới thiệu tầm nhìn, triết lý và lý do Về Tương Lai tồn tại.", "Vision, principles, and the reason Vetuonglai exists."),
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection(pair("Tầm nhìn", "Vision"), pair("Một hệ kinh tế tỉnh thức, proof-based cho người Việt", "A proof-based conscious economy for Vietnamese users"), values),
    ],
  });
}

function renderHubEcosystemPage() {
  const hero = renderHero({
    eyebrow: pair("Bản đồ hệ sinh thái", "Ecosystem map"),
    title: pair("Mỗi domain một nhiệm vụ duy nhất", "One mission per domain"),
    description: pair(
      "Mỗi subdomain của Về Tương Lai phục vụ một intent riêng. Không chồng chéo nội dung, chỉ liên kết theo hành trình.",
      "Each Vetuonglai subdomain serves one distinct intent. No content overlap, only journey-based linking.",
    ),
  });

  const matrixRows = appCatalog.map((app) => [
    `<span class="mono">${escapeHtml(app.host || `${app.key}.vetuonglai.com`)}</span>`,
    localizedText(pair(app.title, app.titleEn)),
    `<span class="badge ${badgeTone(app.status)}">${localizedText(appStageLabel(app))}</span>`,
  ]);

  const matrix = renderTable(
    [pair("Domain", "Domain"), pair("Vai trò", "Role"), pair("Trạng thái", "Status")],
    matrixRows,
  );

  return renderShell({
    currentKey: "hub",
    pathname: "/he-sinh-thai/",
    title: pair("Hệ sinh thái • Về Tương Lai", "Ecosystem • Vetuonglai"),
    description: pair("Ma trận domain và vai trò vận hành toàn hệ.", "Domain matrix and operating roles across the ecosystem."),
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection(pair("Ma trận domain", "Domain matrix"), pair("Core, preview và bridge trong cùng một bản đồ", "Core, preview, and bridge in one map"), matrix),
    ],
  });
}

function renderHubStartPage() {
  const annualAccessCta = purchaseHubUrl({ entry: "hub", pack: "g1", intent: "annual", source: "hub-start" });
  const specialistCta = purchaseHubUrl({ entry: "hub", pack: "g6", intent: "pack", source: "hub-start" });
  const onboardingDisclosure = renderDisclosureStack(["DPM-004"]);
  const hero = renderHero({
    eyebrow: pair("Bắt đầu", "Start here"),
    title: pair("Bắt đầu trong 3 bước", "Start in 3 steps"),
    description: pair(
      "Bạn không cần biết tất cả. Chỉ cần xác định mình đang ở đâu, chọn mục tiêu gần nhất, rồi làm bước tiếp theo.",
      "You do not need to know everything. Define where you are, pick your nearest goal, and take the next step.",
    ),
  });

  const flow = renderCards([
    renderCard({
      title: cardTitle(pair("Bước 1: Bạn đang ở đâu?", "Step 1: Where are you now?")),
      body: cardText(pair("Mất phương hướng, thiếu kỹ năng, thiếu proof hay thiếu cơ hội? Chọn đúng điểm xuất phát.", "Lack of direction, skills, proof, or opportunities? Choose the right starting point.")),
    }),
    renderCard({
      title: cardTitle(pair("Bước 2: Chọn đường đi", "Step 2: Choose your path")),
      body: cardText(pair("Nếu cần học để làm: vào EDU. Nếu cần nền sống: vào LIFE. Nếu cần kiểm chứng: vào VC.", "Need to learn by doing: EDU. Need life stability: LIFE. Need verification: VC.")),
      actions: `${button(`https://${domains.edu}`, pair("Mở EDU", "Open EDU"), "ghost")} ${button(`https://${domains.life}`, pair("Mở LIFE", "Open LIFE"), "ghost")} ${button(`https://${domains.vc}`, pair("Mở VC", "Open VC"), "ghost")}`,
    }),
    renderCard({
      title: cardTitle(pair("Bước 3: Làm bước tiếp theo", "Step 3: Take the next step")),
      body: cardText(pair("Hoàn thành một bài, một action hoặc một proof nhỏ. Hành trình lớn bắt đầu từ tiến bộ nhỏ.", "Complete one lesson, one action, or one proof. Big journeys start with small progress.")),
      actions: gatewayCtaButton(annualAccessCta, "primary"),
    }),
    renderCard({
      title: cardTitle(pair("Bước 4: Chọn lớp sâu hơn khi cần", "Step 4: Choose deeper layers when needed")),
      body: cardText(pair("Khi đã rõ điểm vào và mục tiêu gần nhất, bạn mới chọn lớp sâu hơn phù hợp với hành trình của mình.", "Only after your entry point and near-term goal are clear should you choose a deeper layer.")),
      actions: `${button(annualAccessCta, pair("Xem lớp thành viên", "View member layer"), "ghost")} ${button(specialistCta, pair("Xem lớp chuyên sâu", "View specialist layer"), "ghost")}`,
    }),
  ]);

  return renderShell({
    currentKey: "hub",
    pathname: "/bat-dau/",
    title: pair("Bắt đầu • Về Tương Lai", "Start • Vetuonglai"),
    description: pair("Onboarding 3 bước cho người mới vào hệ.", "Three-step onboarding for new users."),
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection(pair("Onboarding", "Onboarding"), pair("Đơn giản, rõ ràng, có hành động", "Simple, clear, action-ready"), `${onboardingDisclosure}${flow}`),
    ],
  });
}

function renderHubMemberPage() {
  const table = renderTable(
    [pair("Level", "Level"), pair("Điều kiện", "Requirement"), pair("Ý nghĩa", "Meaning")],
    [
      ["0 • Free", localizedText(pair("Đăng ký", "Sign up")), localizedText(pair("Khám phá hệ", "Explore the ecosystem"))],
      ["1 • Pro", localizedText(pair("Trả phí + hoạt động 7 ngày", "Paid + active for 7 days")), localizedText(pair("Cam kết học và làm", "Commit to learn and build"))],
      ["2 • Elite", localizedText(pair("Pro + >=1 VC badge", "Pro + >=1 VC badge")), localizedText(pair("Đã có proof", "Has verified proof"))],
      ["3 • Partner", localizedText(pair("Elite + đóng góp thật", "Elite + real contribution")), localizedText(pair("Đồng tạo hệ", "Co-build the ecosystem"))],
    ],
  );

  return renderShell({
    currentKey: "hub",
    pathname: "/thanh-vien/",
    ...resolvePageMeta("hub", "/thanh-vien/"),
    title: pair("Thành viên • Về Tương Lai", "Membership • Vetuonglai"),
    description: pair("Giải thích level, điều kiện và ý nghĩa thành viên trong hệ.", "Explains member levels, requirements, and meaning in the system."),
    navItems: ecosystemNav("hub"),
    hero: renderHero({
      eyebrow: pair("Member system", "Member system"),
      title: pair("Level không chỉ là tiền", "Level is not only about payment"),
      description: pair("Mỗi level phản ánh payment, activity, proof và contribution.", "Each level reflects payment, activity, proof, and contribution."),
      actions: gatewayCtaButton(purchaseHubUrl({ entry: "hub", pack: "g1", intent: "annual" })),
    }),
    sections: [
      renderSection(pair("Các level", "Levels"), pair("4 level cốt lõi của hệ", "The 4 core levels"), table),
    ],
  });
}

function renderHubNewsPage() {
  const updates = renderCards([
    renderCard({
      title: cardTitle(pair("Bản V2 source of truth đã khóa", "V2 source-of-truth is locked")),
      badge: statusBadge("live", pair("cập nhật", "update")),
      body: cardText(pair("Bản đồ hệ thống đã được cập nhật để các lớp public, member và trust đi cùng một logic.", "The system map has been refreshed so the public, member, and trust layers move with one shared logic.")),
    }),
    renderCard({
      title: cardTitle(pair("EDU course player", "EDU course player")),
      badge: statusBadge("beta", pair("tiến độ", "progress")),
      body: cardText(pair("Đã có flow học, action, reflection, proof và eligibility ở mức pilot có thể kiểm tra.", "Learning, action, reflection, proof, and eligibility flows are available in a checkable pilot flow.")),
    }),
    renderCard({
      title: cardTitle(pair("Runtime truth và smoke checks", "Runtime truth and smoke checks")),
      badge: statusBadge("live", pair("QA", "QA")),
      body: cardText(pair("Pipeline kiểm tra domain và endpoint bắt buộc đang chạy ổn định.", "Required domain and endpoint checks are running consistently in the pipeline.")),
    }),
  ]);

  return renderShell({
    currentKey: "hub",
    pathname: "/tin-tuc/",
    title: pair("Tin tức hệ thống • Về Tương Lai", "System updates • Vetuonglai"),
    description: pair("Các cập nhật chính thức về tiến độ hệ thống.", "Official updates on system progress."),
    navItems: ecosystemNav("hub"),
    hero: renderHero({
      eyebrow: pair("Tin tức", "Updates"),
      title: pair("Cập nhật hệ thống", "System updates"),
      description: pair("Theo dõi tiến độ, mốc triển khai và trạng thái vận hành thực tế.", "Track progress, rollout milestones, and live operating status."),
    }),
    sections: [
      renderSection(pair("Cập nhật mới", "Latest updates"), pair("Những thay đổi quan trọng gần đây", "Recent important changes"), updates),
    ],
  });
}

function renderHubContactPage() {
  const contact = `
    <article class="card">
      <div class="card-body stack">
        ${cardTitle(pair("Liên hệ", "Contact"))}
        ${cardText(pair("Bạn có thể liên hệ theo mục đích cụ thể để nhận phản hồi đúng người phụ trách.", "Use purpose-based contact paths to reach the right owner."), "body-copy")}
        ${renderList([
          pair("Hợp tác / đối tác: partner@vetuonglai.com", "Partnerships: partner@vetuonglai.com"),
          pair("Nội dung / truyền thông: content@vetuonglai.com", "Content and media: content@vetuonglai.com"),
          pair("Hỗ trợ thành viên: support@vetuonglai.com", "Member support: support@vetuonglai.com"),
        ])}
      </div>
    </article>
  `;

  return renderShell({
    currentKey: "hub",
    pathname: "/lien-he/",
    title: pair("Liên hệ • Về Tương Lai", "Contact • Vetuonglai"),
    description: pair("Thông tin liên hệ chính thức cho thành viên, đối tác và cộng tác viên.", "Official contact channels for members, partners, and contributors."),
    navItems: ecosystemNav("hub"),
    hero: renderHero({
      eyebrow: pair("Kết nối", "Connect"),
      title: pair("Liên hệ đúng người, đúng việc", "Contact the right owner, faster"),
      description: pair("Chọn đúng kênh để xử lý nhanh hơn và đúng ngữ cảnh hơn.", "Use the right channel for faster, context-aware responses."),
    }),
    sections: [
      renderSection(pair("Kênh liên hệ", "Contact channels"), pair("Theo mục đích và nhóm phụ trách", "By purpose and owner team"), contact),
    ],
  });
}

function renderHubSitemapPage() {
  const links = [
    ["/", pair("Trang chủ", "Homepage")],
    ["/ve-chung-toi/", pair("Về chúng tôi", "About")],
    ["/he-sinh-thai/", pair("Hệ sinh thái", "Ecosystem")],
    ["/bat-dau/", pair("Bắt đầu", "Start here")],
    ["/thanh-vien/", pair("Thành viên", "Membership")],
    ["/tin-tuc/", pair("Tin tức", "Updates")],
    ["/lien-he/", pair("Liên hệ", "Contact")],
    ["/founder/", pair("Founder Command Panel", "Founder Command Panel")],
  ];

  const domainLinks = ecosystemDirectory
    .filter((entry) => domains[entry.key] && isPubliclyDiscoverable(entry))
    .map((entry) => [`https://${domains[entry.key]}`, domains[entry.key]]);

  const siteMapLinks = `
    <article class="card">
      <div class="card-body stack">
        ${cardTitle(pair("Trang trong hub", "Hub pages"))}
        <ul class="list">${links.map(([href, label]) => `<li><a href="${href}">${localizedText(label)}</a></li>`).join("")}</ul>
      </div>
    </article>
    <article class="card">
      <div class="card-body stack">
        ${cardTitle(pair("Subdomain toàn hệ", "Ecosystem subdomains"))}
        <ul class="list">${domainLinks.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("")}</ul>
      </div>
    </article>
  `;

  return renderShell({
    currentKey: "hub",
    pathname: "/sitemap/",
    title: pair("Sitemap • Về Tương Lai", "Sitemap • Vetuonglai"),
    description: pair("Sitemap toàn hệ gồm hub pages và các subdomain chính.", "Ecosystem sitemap with hub pages and primary subdomains."),
    navItems: ecosystemNav("hub"),
    hero: renderHero({
      eyebrow: pair("Sitemap", "Sitemap"),
      title: pair("Bản đồ điều hướng toàn hệ", "Navigation map for the ecosystem"),
      description: pair("Tập trung các đường dẫn chính để bạn vào đúng nơi cần thiết nhanh hơn.", "Centralized links so users can reach the right destination faster."),
    }),
    sections: [
      renderSection(pair("Danh mục điều hướng", "Navigation map"), pair("Hub + subdomain", "Hub + subdomains"), siteMapLinks),
    ],
  });
}

function renderFounderCommandPanelPage() {
  const founderPanel = founderCommandPanel.panel || {};
  const commandInput = founderPanel.commandInput || {};
  const founderPanelBlocksByKey = new Map((founderPanel.blocks || []).map((block) => [String(block?.key || ""), block]));
  const founderActionLabelById = Object.fromEntries(
    (founderActionRegistry.registry || []).map((entry) => [
      String(entry?.actionId || ""),
      {
        vi: String(entry?.nameVi || entry?.nameEn || entry?.actionId || ""),
        en: String(entry?.nameEn || entry?.nameVi || entry?.actionId || ""),
      },
    ]),
  );
  const founderBlockTitle = (blockKey, fallbackVi, fallbackEn = fallbackVi) => {
    const block = founderPanelBlocksByKey.get(String(blockKey || "")) || {};
    return pair(block.titleVi || fallbackVi, block.titleEn || fallbackEn);
  };
  const commandPlaceholder = pair(
    commandInput.placeholderVi || "Hỏi hệ đang yếu ở đâu hoặc cần sửa gì hôm nay",
    commandInput.placeholderEn || "Ask where the system is weak or what to fix today",
  );
  const founderCommandExamples = ((commandInput.linkedExampleIds || [])
    .map((id) => (founderAutopilotSeeds.commandPromptExamples || []).find((entry) => entry.id === id))
    .filter(Boolean));
  const founderCommandExampleCount = founderCommandExamples.length;
  const founderNavHrefByKey = {
    overview: "#founder-overview",
    system_health: "#founder-system-health",
    user_journey: "#founder-journey",
    learning_and_proof: "#founder-learning-proof",
    domain_performance: "#founder-domain-performance",
    ai_insights: "#founder-ai-insights",
    incidents: "#founder-incidents",
    actions: "#founder-actions",
    audit_log: "#founder-audit-log",
    deployments: "#founder-deployments",
    settings: "#founder-settings",
  };
  const founderNavItems = (founderPanel.leftNav || [])
    .map((item) => ({
      href: founderNavHrefByKey[String(item?.key || "")] || "",
      label: pair(item?.labelVi || item?.labelEn || item?.key || "", item?.labelEn || item?.labelVi || item?.key || ""),
    }))
    .filter((item) => item.href);
  const founderCommandExampleButtons = founderCommandExamples.map((example) => `
    <button
      type="button"
      class="command-example-chip"
      data-founder-query="${escapeHtml(example.input || "")}"
      title="${escapeHtml((example.requiredSources || []).join(" • "))}"
    >${escapeHtml(example.input || "")}</button>
  `).join("");

  const overviewMetrics = `
    <aside class="card">
      <div class="card-body">
        <div class="metrics" id="founder-overview-metrics">
          <div class="metric">
            <div class="metric-value mono" id="founder-metric-data-state">runtime</div>
            <div class="metric-label" data-text-vi="trạng thái dữ liệu" data-text-en="data state">trạng thái dữ liệu</div>
          </div>
          <div class="metric">
            <div class="metric-value mono" id="founder-metric-default-window">7d</div>
            <div class="metric-label" data-text-vi="cửa sổ mặc định" data-text-en="default window">cửa sổ mặc định</div>
          </div>
          <div class="metric">
            <div class="metric-value mono" id="founder-metric-active-incidents">0</div>
            <div class="metric-label" data-text-vi="incident đang mở" data-text-en="active incidents">incident đang mở</div>
          </div>
          <div class="metric">
            <div class="metric-value mono" id="founder-metric-top-risk">R2</div>
            <div class="metric-label" data-text-vi="rủi ro cao nhất" data-text-en="top risk">rủi ro cao nhất</div>
          </div>
        </div>
      </div>
    </aside>
  `;

  const leftNav = `
    <aside class="command-side">
      <article class="card command-sticky">
        <div class="card-body stack">
          ${cardTitle(pair("Command Navigation", "Command Navigation"))}
          <nav class="command-nav-list">
            ${founderNavItems.map((item) => localizedText(item.label, "a", { href: item.href, class: "command-nav-link" })).join("")}
          </nav>
          <div class="disclosure-stack is-footer">
            <aside class="disclosure-block is-compact">
              ${localizedText(pair("Public-safe runtime note", "Public-safe runtime note"), "div", { class: "disclosure-label" })}
              ${localizedText(pair(
                "Route này đọc contract và payload runtime thật khi có dữ liệu. Empty state, sample state và waiting state luôn được hiển thị như trạng thái chờ, không như production đã live.",
                "This route reads the real founder contract and runtime payload when data exists. Empty, sample, and waiting states always stay clearly marked instead of being presented as live production state.",
              ), "div", { class: "disclosure-copy" })}
            </aside>
          </div>
        </div>
      </article>
    </aside>
  `;

  const rightDrawer = `
    <aside class="command-side">
      <article class="card command-sticky">
        <div class="card-body stack" id="founder-command-center">
          ${cardTitle(pair("Command / Action Drawer", "Command / Action Drawer"))}
          ${cardText(pair(
            "Founder command trả về summary, evidence, recommendation và action options từ founder runtime. Khi chưa chạy query, drawer giữ insight ưu tiên cao nhất hiện có.",
            "Founder command returns a summary, evidence, recommendations, and action options from the founder runtime. Until a query runs, the drawer stays anchored to the highest-priority insight.",
          ), "body-copy")}
          <div class="command-example-list">
            ${founderCommandExampleButtons}
          </div>
          <div class="result-shell" id="founder-drawer-shell">
            <div class="subtle" data-text-vi="Đang chờ dữ liệu founder runtime..." data-text-en="Waiting for founder runtime data...">Đang chờ dữ liệu founder runtime...</div>
          </div>
          <div class="disclosure-stack is-footer">
            <aside class="disclosure-block">
              ${localizedText(pair("Founder APIs đang đọc", "Founder APIs in use"), "div", { class: "disclosure-label" })}
              <div class="disclosure-copy mono">GET /api/founder/overview</div>
              <div class="disclosure-copy mono">GET /api/founder/insights</div>
              <div class="disclosure-copy mono">POST /api/founder/insights/query</div>
              <div class="disclosure-copy mono">GET /api/founder/actions/recommended</div>
              <div class="disclosure-copy mono">GET /api/founder/actions/history</div>
            </aside>
          </div>
          <div class="cluster">
            ${button("#founder-actions", founderBlockTitle("actions", "Hành động", "Actions"), "ghost")}
            ${button("#founder-incidents", founderBlockTitle("incident_stream", "Luồng incident", "Incident Stream"), "ghost")}
            ${button("#founder-deployments", founderBlockTitle("deployments", "Deploy", "Deployments"), "ghost")}
          </div>
        </div>
      </article>
    </aside>
  `;

  const overviewShell = `
    <div class="command-panel-shell" id="founder-overview">
      <article class="card command-overview-bar">
        <div class="card-body stack">
          <div class="command-overview-top">
            <div class="command-overview-meta">
              <span class="command-pill" id="founder-pill-runtime-state">${localizedText(pair("Đang kết nối runtime", "Connecting runtime"))}</span>
              <span class="command-pill" id="founder-pill-environment">env: --</span>
              <span class="command-pill" id="founder-pill-version">version: --</span>
              <span class="command-pill" id="founder-pill-alerts">alerts: --</span>
              <span class="command-pill" id="founder-pill-incidents">incidents: --</span>
              <span class="command-pill" id="founder-pill-override">${localizedText(pair("override: off", "override: off"))}</span>
            </div>
            <div class="command-input-shell">
              <span class="subtle">${localizedText(pair("Founder command input", "Founder command input"))}</span>
              <form class="command-input-form" id="founder-command-form">
                <input
                  class="search-input"
                  id="founder-command-input"
                  type="text"
                  data-placeholder-vi="${escapeHtml(commandPlaceholder.vi)}"
                  data-placeholder-en="${escapeHtml(commandPlaceholder.en)}"
                  placeholder="${escapeHtml(commandPlaceholder.vi)}"
                />
                <button class="button primary" type="submit" data-text-vi="Chạy query" data-text-en="Run query">Chạy query</button>
              </form>
              <div class="command-query-meta" id="founder-command-state" data-text-vi="Nhập câu hỏi ngắn để lấy summary, evidence, recommendation và actions." data-text-en="Enter a short question to get a summary, evidence, recommendations, and actions.">Nhập câu hỏi ngắn để lấy summary, evidence, recommendation và actions.</div>
            </div>
          </div>
        </div>
      </article>
      <div class="command-layout">
        ${leftNav}
        <div class="command-main">
          ${overviewMetrics}
          <div class="command-grid">
            <article class="card command-block" id="founder-system-health">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("system_health", "Sức khỏe hệ thống", "System Health"))}
                  ${statusBadge("member-preview", pair("runtime-bound", "runtime-bound"))}
                </div>
                ${cardText(pair(
                  "Block này đọc system-health contract thật. Nếu runtime chưa sẵn sàng, panel hiển thị waiting state thay vì số giả hoặc màu giả.",
                  "This block reads the real system-health contract. If the runtime is not ready, the panel shows waiting states instead of fake numbers or fake color signals.",
                ), "body-copy")}
                <div class="command-health-list" id="founder-system-health-list">
                  <article class="command-health-item">
                    <div class="command-item-title" data-text-vi="Đang tải System Health..." data-text-en="Loading System Health...">Đang tải System Health...</div>
                  </article>
                </div>
              </div>
            </article>

            <article class="card command-block" id="founder-journey">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("user_journey_truth", "Sự thật hành trình người dùng", "User Journey Truth"))}
                  ${statusBadge("planned", pair("contract-bound", "contract-bound"))}
                </div>
                ${cardText(pair(
                  "Funnel Discover → Join → Learn → Submit → Prove → Next đọc từ founder overview và giữ nguyên disclosure khi analytics thật chưa đầy đủ.",
                  "The Discover → Join → Learn → Submit → Prove → Next funnel reads from the founder overview and keeps its disclosure intact while live analytics is still incomplete.",
                ), "body-copy")}
                ${renderTable(
                  [pair("Bước", "Step"), pair("Tổng", "Total"), pair("Qua bước kế", "To next"), pair("Delta 7 ngày", "7-day delta")],
                  [],
                  { tbodyId: "founder-journey-table-body" },
                )}
              </div>
            </article>

            <article class="card command-block" id="founder-learning-proof">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("learning_and_proof", "Học và bằng chứng", "Learning & Proof"))}
                  ${statusBadge("live", pair("overview runtime", "overview runtime"))}
                </div>
                ${cardText(pair(
                  "Learning summary và VC summary được đọc thẳng từ founder runtime để tránh mô tả backlog, conversion hoặc issuance như dữ liệu live khi chưa có evidence.",
                  "The learning and VC summaries are read directly from the founder runtime so backlog, conversion, and issuance are never described as live data without evidence.",
                ), "body-copy")}
                ${renderTable(
                  [pair("Chỉ số", "Metric"), pair("Giá trị", "Value")],
                  [],
                  { tbodyId: "founder-learning-proof-body" },
                )}
              </div>
            </article>

            <article class="card command-block" id="founder-domain-performance">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("domain_performance", "Hiệu quả theo domain", "Domain Performance"))}
                  ${statusBadge("member-preview", pair("runtime summary", "runtime summary"))}
                </div>
                ${cardText(pair(
                  "Mỗi domain hiển thị stage, CTA, next-step, drop rate và incident count theo runtime summary thay vì dựng cảm giác đang live hơn thực tế.",
                  "Each domain shows stage, CTA, next-step, drop rate, and incident count from the runtime summary instead of creating a stronger live impression than the runtime truth supports.",
                ), "body-copy")}
                ${renderTable(
                  [pair("Domain", "Domain"), pair("Stage", "Stage"), pair("CTA CTR", "CTA CTR"), pair("Next step", "Next step"), pair("Drop", "Drop"), pair("Incidents", "Incidents")],
                  [],
                  { tbodyId: "founder-domain-performance-body" },
                )}
              </div>
            </article>

            <article class="card command-block" id="founder-ai-insights">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("ai_insights", "AI Insight", "AI Insights"))}
                  ${statusBadge("planned", pair("insight runtime", "insight runtime"))}
                </div>
                ${cardText(pair(
                  "Insight list này lấy dữ liệu từ founder runtime. Insight sample chỉ được giữ như sample/runtime-seed và không được trình bày như production incident đã xác nhận.",
                  "This insight list reads from the founder runtime. Sample insights stay clearly marked as sample/runtime-seed and are never presented like confirmed production incidents.",
                ), "body-copy")}
                <div class="command-insight-list" id="founder-ai-insights-list">
                  <article class="command-insight-item">
                    <div class="command-item-title" data-text-vi="Đang tải AI Insights..." data-text-en="Loading AI Insights...">Đang tải AI Insights...</div>
                  </article>
                </div>
              </div>
            </article>

            <article class="card command-block" id="founder-actions">
              <div class="card-body stack">
                <div class="cluster" style="justify-content:space-between;align-items:flex-start">
                  ${cardTitle(founderBlockTitle("actions", "Hành động", "Actions"))}
                  ${statusBadge("member-preview", pair("guarded runtime", "guarded runtime"))}
                </div>
                ${cardText(pair(
                  "Khối actions hiển thị recommended actions, history gần nhất và rollback readiness từ runtime. Không có production apply UI công khai ở route này.",
                  "The actions block shows recommended actions, recent history, and rollback readiness from the runtime. There is no public production apply UI on this route.",
                ), "body-copy")}
                <div class="command-summary-metrics" id="founder-action-summary-metrics">
                  <div class="command-summary-metric">
                    <div class="command-summary-metric-value mono">--</div>
                    <div class="command-summary-metric-label" data-text-vi="recommended" data-text-en="recommended">recommended</div>
                  </div>
                </div>
                <div class="command-list-block">
                  <div class="subtle" data-text-vi="Recommended actions" data-text-en="Recommended actions">Recommended actions</div>
                  <div class="command-stream-list" id="founder-recommended-actions-list">
                    <article class="command-stream-item">
                      <div class="command-item-title" data-text-vi="Đang tải action runtime..." data-text-en="Loading runtime actions...">Đang tải action runtime...</div>
                    </article>
                  </div>
                </div>
                <div class="command-list-block">
                  <div class="subtle" data-text-vi="Recently applied" data-text-en="Recently applied">Recently applied</div>
                  <div class="command-stream-list" id="founder-action-history-list">
                    <article class="command-stream-item">
                      <div class="command-item-title" data-text-vi="Đang tải action history..." data-text-en="Loading action history...">Đang tải action history...</div>
                    </article>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        ${rightDrawer}
      </div>
    </div>
  `;

  const operationsShell = `
    <div class="command-grid">
      <article class="card command-block" id="founder-incidents">
        <div class="card-body stack">
          ${cardTitle(founderBlockTitle("incident_stream", "Luồng incident", "Incident Stream"))}
          ${cardText(pair(
            "Incident feed giữ severity, owner, status và root hypothesis tách riêng để route này không trộn stream tổng hợp với sự kiện thật.",
            "The incident feed keeps severity, owner, status, and root hypothesis explicit so the route does not blur real incidents into a vague combined stream.",
          ), "body-copy")}
          <div class="command-stream-list" id="founder-incidents-list">
            <article class="command-stream-item">
              <div class="command-item-title" data-text-vi="Đang tải incidents..." data-text-en="Loading incidents...">Đang tải incidents...</div>
            </article>
          </div>
        </div>
      </article>

      <article class="card command-block" id="founder-audit-log">
        <div class="card-body stack">
          ${cardTitle(founderBlockTitle("audit_log", "Nhật ký kiểm toán", "Audit Log"))}
          ${cardText(pair(
            "Audit log chỉ hiển thị event runtime thật. Nếu chưa có event, panel phải nói rõ là chưa có bản ghi thay vì dựng sample như live.",
            "The audit log shows only real runtime events. If no event exists yet, the panel says so plainly instead of rendering a sample as if it were live.",
          ), "body-copy")}
          <div class="command-stream-list" id="founder-audit-log-list">
            <article class="command-stream-item">
              <div class="command-item-title" data-text-vi="Đang tải audit log..." data-text-en="Loading audit log...">Đang tải audit log...</div>
            </article>
          </div>
        </div>
      </article>

      <article class="card command-block" id="founder-deployments">
        <div class="card-body stack">
          ${cardTitle(founderBlockTitle("deployments", "Deploy", "Deployments"))}
          ${cardText(pair(
            "Deployment block giữ environment, version, release name và rollback readiness ở một nơi để founder nhìn nhanh release truth hiện có.",
            "The deployments block keeps environment, version, release name, and rollback readiness in one place so the founder can scan the current release truth quickly.",
          ), "body-copy")}
          <div class="command-stream-list" id="founder-deployments-list">
            <article class="command-stream-item">
              <div class="command-item-title" data-text-vi="Đang tải deployments..." data-text-en="Loading deployments...">Đang tải deployments...</div>
            </article>
          </div>
        </div>
      </article>

      <article class="card command-block" id="founder-settings">
        <div class="card-body stack">
          ${cardTitle(pair("Settings & Contract", "Settings & Contract"))}
          ${cardText(pair(
            "Khối này khóa panel contract, metrics registry, action modes và public-safe guardrails để Team 2 không làm panel trông live hơn runtime contract thật.",
            "This block locks the panel contract, metrics registry, action modes, and public-safe guardrails so the Team 2 surface does not look more live than the real runtime contract.",
          ), "body-copy")}
          <div class="command-stream-list" id="founder-settings-list">
            <article class="command-stream-item">
              <div class="command-item-title" data-text-vi="Đang tải contract settings..." data-text-en="Loading contract settings...">Đang tải contract settings...</div>
            </article>
          </div>
        </div>
      </article>
    </div>
  `;

  return renderShell({
    currentKey: "hub",
    pathname: "/founder/",
    title: pair("Founder Command Panel • Về Tương Lai", "Founder Command Panel • Vetuonglai"),
    description: pair(
      "Founder Command Panel public-safe: command input, overview, system health, user journey, learning & proof, domain performance, AI insights, actions, incidents, audit log và deployments đọc từ runtime khi khả dụng.",
      "A public-safe Founder Command Panel with command input, overview, system health, user journey, learning & proof, domain performance, AI insights, actions, incidents, the audit log, and deployments hydrated from runtime when available.",
    ),
    canonicalUrl: `https://${domains.hub}/founder/`,
    sourceOwner: `https://${domains.hub}/`,
    robots: "noindex,follow",
    navItems: ecosystemNav("hub"),
    hero: "",
    sections: [
      renderSection(
        pair("Founder Command Panel", "Founder Command Panel"),
        pair(
          "Route public-safe cho founder lane: block nào có runtime thật thì hydrate, block nào chưa có evidence thì giữ waiting state và disclosure rõ ràng.",
          "A public-safe route for the founder lane: blocks with real runtime data hydrate, while blocks without evidence stay in clear waiting states with explicit disclosure.",
        ),
        overviewShell,
        "founder-shell",
      ),
      renderSection(
        pair("Control Log", "Control Log"),
        pair(
          "Incidents, audit, deployments và settings được tách riêng để founder nhìn thấy đúng evidence lane thay vì một stream chung khó kiểm tra.",
          "Incidents, audit, deployments, and settings are split into distinct blocks so the founder can read the evidence lane directly instead of relying on a blended stream.",
        ),
        operationsShell,
        "founder-control-log",
      ),
    ],
    inlineScript: `
      (() => {
        const founderCommandExampleCount = ${founderCommandExampleCount};
        const founderActionLabels = ${JSON.stringify(founderActionLabelById)};
        const state = {
          overview: null,
          insights: null,
          recommendedActions: null,
          actionHistory: null,
          incidents: null,
          audit: null,
          deployments: null,
          queryResult: null,
          queryText: "",
          queryError: "",
          queryLoading: false,
          error: "",
        };

        function currentLanguage() {
          return document.documentElement.dataset.language === "en" ? "en" : "vi";
        }

        function localized(vi, en) {
          return currentLanguage() === "en" ? (en || vi) : vi;
        }

        function localizedField(item, baseKey, fallback = "--") {
          const suffix = currentLanguage() === "en" ? "_en" : "_vi";
          const localizedValue = item && typeof item === "object" ? item[baseKey + suffix] : "";
          const directValue = item && typeof item === "object" ? item[baseKey] : "";
          return localizedValue || directValue || fallback;
        }

        function resolveActionLabel(actionId) {
          const entry = founderActionLabels[String(actionId || "")];
          if (!entry) return String(actionId || "--");
          return currentLanguage() === "en"
            ? (entry.en || entry.vi || String(actionId || "--"))
            : (entry.vi || entry.en || String(actionId || "--"));
        }

        function escapeHtml(value) {
          return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
        }

        function setText(id, value) {
          const node = document.getElementById(id);
          if (node) node.textContent = value;
        }

        function setHtml(id, value) {
          const node = document.getElementById(id);
          if (node) node.innerHTML = value;
        }

        function formatCount(value) {
          const normalized = Number(value);
          return Number.isFinite(normalized) ? String(normalized) : "--";
        }

        function formatPercent(value) {
          const normalized = Number(value);
          if (!Number.isFinite(normalized)) return "--";
          return normalized <= 1 ? Math.round(normalized * 100) + "%" : normalized + "%";
        }

        function formatDateTime(value) {
          if (!value) return "--";
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return String(value);
          return date.toLocaleString(currentLanguage() === "en" ? "en-US" : "vi-VN", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        }

        function toneFromStatus(status) {
          const normalized = String(status || "").trim().toLowerCase();
          if (
            normalized.includes("critical")
            || normalized.includes("failed")
            || normalized === "p0"
            || normalized === "p1"
            || normalized === "r1"
            || normalized === "r2"
          ) return "critical";
          if (
            normalized.includes("warning")
            || normalized.includes("investigating")
            || normalized.includes("open")
            || normalized === "p2"
            || normalized === "r3"
          ) return "warning";
          if (
            normalized.includes("ok")
            || normalized.includes("success")
            || normalized.includes("resolved")
            || normalized.includes("production")
            || normalized.includes("live")
          ) return "ok";
          return "pending";
        }

        function toneFromTier(tier) {
          const normalized = String(tier || "").toUpperCase();
          if (normalized.includes("HIGH")) return "critical";
          if (normalized.includes("MEDIUM")) return "warning";
          if (normalized.includes("LOW")) return "ok";
          return "pending";
        }

        function toneFromRisk(riskLevel) {
          const normalized = String(riskLevel || "").toUpperCase();
          if (normalized === "R1" || normalized === "R2") return "critical";
          if (normalized === "R3") return "warning";
          if (normalized === "R4") return "ok";
          return toneFromStatus(normalized);
        }

        function messageCard(message, itemClass = "command-stream-item") {
          return '<article class="' + itemClass + '"><div class="command-item-title">' + escapeHtml(message) + '</div></article>';
        }

        function messageTable(message, colspan) {
          return '<tr><td colspan="' + escapeHtml(String(colspan)) + '"><span class="subtle">' + escapeHtml(message) + '</span></td></tr>';
        }

        function inlineList(items) {
          if (!Array.isArray(items) || items.length === 0) return "";
          return '<ul class="list">' + items.map((item) => '<li><span>' + escapeHtml(item) + '</span></li>').join("") + '</ul>';
        }

        function summaryMetricsHtml(items) {
          return items.map((item) => (
            '<div class="command-summary-metric">'
              + '<div class="command-summary-metric-value mono">' + escapeHtml(item.value) + '</div>'
              + '<div class="command-summary-metric-label">' + escapeHtml(item.label) + '</div>'
            + '</div>'
          )).join("");
        }

        function journeyStepLabel(key) {
          const labels = {
            discover: localized("Discover", "Discover"),
            join: localized("Join", "Join"),
            learn: localized("Learn", "Learn"),
            submit: localized("Submit", "Submit"),
            prove: localized("Prove", "Prove"),
            next: localized("Next", "Next"),
          };
          return labels[key] || key || "--";
        }

        function renderCommandState() {
          if (state.queryLoading) {
            setText("founder-command-state", localized("Đang chạy founder query...", "Running founder query..."));
            return;
          }
          if (state.queryError) {
            setText("founder-command-state", localized("Founder query chưa sẵn sàng: ", "Founder query is not ready: ") + state.queryError);
            return;
          }
          if (state.queryText && state.queryResult) {
            const actionCount = Array.isArray(state.queryResult.actions) ? state.queryResult.actions.length : 0;
            setText(
              "founder-command-state",
              localized("Query gần nhất: ", "Last query: ") + '"' + state.queryText + '"'
                + " · " + localized("action options", "action options") + ": " + formatCount(actionCount),
            );
            return;
          }
          setText(
            "founder-command-state",
            localized(
              "Nhập câu hỏi ngắn để lấy summary, evidence, recommendation và actions.",
              "Enter a short question to get a summary, evidence, recommendations, and actions.",
            ),
          );
        }

        function renderLoadingState() {
          setText("founder-pill-runtime-state", localized("Đang tải runtime", "Loading runtime"));
          setHtml("founder-system-health-list", messageCard(localized("Đang tải System Health...", "Loading System Health..."), "command-health-item"));
          setHtml("founder-ai-insights-list", messageCard(localized("Đang tải AI Insights...", "Loading AI Insights..."), "command-insight-item"));
          setHtml("founder-recommended-actions-list", messageCard(localized("Đang tải recommended actions...", "Loading recommended actions...")));
          setHtml("founder-action-history-list", messageCard(localized("Đang tải action history...", "Loading action history...")));
          setHtml("founder-incidents-list", messageCard(localized("Đang tải incidents...", "Loading incidents...")));
          setHtml("founder-audit-log-list", messageCard(localized("Đang tải audit log...", "Loading audit log...")));
          setHtml("founder-deployments-list", messageCard(localized("Đang tải deployments...", "Loading deployments...")));
          setHtml("founder-settings-list", messageCard(localized("Đang tải contract settings...", "Loading contract settings...")));
          setHtml("founder-journey-table-body", messageTable(localized("Đang tải funnel...", "Loading funnel..."), 4));
          setHtml("founder-learning-proof-body", messageTable(localized("Đang tải learning & proof...", "Loading learning & proof..."), 2));
          setHtml("founder-domain-performance-body", messageTable(localized("Đang tải domain performance...", "Loading domain performance..."), 6));
          setHtml("founder-action-summary-metrics", summaryMetricsHtml([
            { label: localized("recommended", "recommended"), value: "--" },
            { label: localized("applied", "applied"), value: "--" },
            { label: localized("success rate", "success rate"), value: "--" },
            { label: localized("rollback ready", "rollback ready"), value: "--" },
          ]));
          setHtml("founder-drawer-shell", '<div class="subtle">' + escapeHtml(localized("Đang chờ dữ liệu founder runtime...", "Waiting for founder runtime data...")) + '</div>');
          renderCommandState();
        }

        function renderErrorState(message) {
          const safeMessage = escapeHtml(message || localized("Chưa lấy được dữ liệu runtime.", "Runtime data is not available yet."));
          setText("founder-pill-runtime-state", localized("Runtime chưa sẵn sàng", "Runtime not ready"));
          setText("founder-pill-environment", "env: --");
          setText("founder-pill-version", "version: --");
          setText("founder-pill-alerts", "alerts: --");
          setText("founder-pill-incidents", "incidents: --");
          setText("founder-pill-override", localized("override: off", "override: off"));
          setHtml("founder-system-health-list", messageCard(safeMessage, "command-health-item"));
          setHtml("founder-ai-insights-list", messageCard(safeMessage, "command-insight-item"));
          setHtml("founder-recommended-actions-list", messageCard(safeMessage));
          setHtml("founder-action-history-list", messageCard(safeMessage));
          setHtml("founder-incidents-list", messageCard(safeMessage));
          setHtml("founder-audit-log-list", messageCard(safeMessage));
          setHtml("founder-deployments-list", messageCard(safeMessage));
          setHtml("founder-settings-list", messageCard(safeMessage));
          setHtml("founder-journey-table-body", messageTable(safeMessage, 4));
          setHtml("founder-learning-proof-body", messageTable(safeMessage, 2));
          setHtml("founder-domain-performance-body", messageTable(safeMessage, 6));
          setHtml("founder-action-summary-metrics", summaryMetricsHtml([
            { label: localized("recommended", "recommended"), value: "--" },
            { label: localized("applied", "applied"), value: "--" },
            { label: localized("success rate", "success rate"), value: "--" },
            { label: localized("rollback ready", "rollback ready"), value: "--" },
          ]));
          setHtml("founder-drawer-shell", '<div class="subtle">' + safeMessage + '</div>');
          renderCommandState();
        }

        function renderOverviewMeta() {
          const overview = state.overview || {};
          const alerts = Array.isArray(overview.critical_alerts) ? overview.critical_alerts.length : 0;
          const featureFlags = overview.feature_flags || {};
          const topRisk = ((state.insights?.items || [])[0]?.risk_level) || "R3";

          setText("founder-pill-runtime-state", localized("Runtime đã nối", "Runtime connected"));
          setText("founder-pill-environment", "env: " + (overview.environment || "--"));
          setText("founder-pill-version", "version: " + (overview.version || "--"));
          setText("founder-pill-alerts", "alerts: " + formatCount(alerts));
          setText("founder-pill-incidents", "incidents: " + formatCount(overview.active_incidents || 0));
          setText(
            "founder-pill-override",
            localized("override", "override") + ": " + ((featureFlags.manual_override === true || featureFlags.manual_override === "on") ? localized("on", "on") : localized("off", "off")),
          );
          setText("founder-metric-data-state", localized("runtime", "runtime"));
          setText("founder-metric-default-window", overview.panel_contract?.default_window || "--");
          setText("founder-metric-active-incidents", formatCount(overview.active_incidents || 0));
          setText("founder-metric-top-risk", topRisk);
        }

        function renderSystemHealth() {
          const items = state.overview?.system_health?.items || [];
          if (!items.length) {
            setHtml("founder-system-health-list", messageCard(localized("Chưa có snapshot System Health.", "No System Health snapshot yet."), "command-health-item"));
            return;
          }

          const html = items.map((item) => {
            const tone = toneFromStatus(item.status);
            return '<article class="command-health-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(localizedField(item, "label", item.key || "--")) + '</div><div class="subtle mono">' + escapeHtml(item.key || "") + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(tone) + '">' + escapeHtml(String(item.status || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("độ trễ", "latency")) + ': <span class="mono">' + escapeHtml(formatCount(item.latency_ms)) + 'ms</span></span>'
              + '<span>' + escapeHtml(localized("lỗi 1h", "errors 1h")) + ': <span class="mono">' + escapeHtml(formatCount(item.errors_last_1h)) + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("last incident", "last incident")) + ': <span class="mono">' + escapeHtml(formatDateTime(item.last_incident_time)) + '</span></div>'
              + '<div class="subtle">' + escapeHtml(localized("runtime status", "runtime status")) + ': <span class="mono">' + escapeHtml(item.runtime_status || "--") + '</span></div>'
              + '</article>';
          }).join("");
          setHtml("founder-system-health-list", html);
        }

        function renderJourney() {
          const funnel = Array.isArray(state.overview?.journey_summary?.funnel) ? state.overview.journey_summary.funnel : [];
          if (!funnel.length) {
            setHtml("founder-journey-table-body", messageTable(localized("Chưa có funnel runtime.", "No runtime funnel yet."), 4));
            return;
          }

          const rows = funnel.map((item) => (
            '<tr>'
              + '<td>' + escapeHtml(journeyStepLabel(item.key)) + '</td>'
              + '<td><span class="mono">' + escapeHtml(formatCount(item.total)) + '</span></td>'
              + '<td><span class="mono">' + escapeHtml(formatPercent(item.conversion_to_next)) + '</span></td>'
              + '<td><span class="mono">' + escapeHtml(formatCount(item.delta_vs_previous_7d)) + '</span></td>'
            + '</tr>'
          )).join("");
          setHtml("founder-journey-table-body", rows);
        }

        function renderLearningProof() {
          const learning = state.overview?.learning_summary || {};
          const vc = state.overview?.vc_summary || {};
          const rows = [
            [localized("Courses live", "Courses live"), formatCount(learning.courses_live)],
            [localized("Lessons completed", "Lessons completed"), formatCount(learning.lessons_completed)],
            [localized("Submissions today", "Submissions today"), formatCount(learning.submissions_today)],
            [localized("Review backlog", "Review backlog"), formatCount(learning.review_backlog)],
            [localized("Submit → VC conversion", "Submit → VC conversion"), formatPercent(learning.submit_to_vc_conversion)],
            [localized("Average review time", "Average review time"), formatCount(learning.average_review_time_hours) + "h"],
            [localized("VC issued", "VC issued"), formatCount(vc.issued_count)],
            [localized("VC backlog", "VC backlog"), formatCount(vc.backlog)],
          ];
          const html = rows.map((item) => (
            '<tr><td>' + escapeHtml(item[0]) + '</td><td><span class="mono">' + escapeHtml(item[1]) + '</span></td></tr>'
          )).join("");
          setHtml("founder-learning-proof-body", html);
        }

        function renderDomains() {
          const items = state.overview?.domain_summary?.items || [];
          if (!items.length) {
            setHtml("founder-domain-performance-body", messageTable(localized("Chưa có domain summary.", "No domain summary yet."), 6));
            return;
          }

          const html = items.map((item) => (
            '<tr>'
              + '<td><div class="stack" style="gap:4px"><span class="mono">' + escapeHtml(item.key || "--") + '</span><span class="subtle">' + escapeHtml(item.mission || "--") + '</span></div></td>'
              + '<td>' + escapeHtml(item.stage_label || item.status || "--") + '</td>'
              + '<td><span class="mono">' + escapeHtml(formatPercent(item.cta_ctr)) + '</span></td>'
              + '<td><span class="mono">' + escapeHtml(formatPercent(item.next_step_conversion)) + '</span></td>'
              + '<td><span class="mono">' + escapeHtml(formatPercent(item.drop_rate)) + '</span></td>'
              + '<td><span class="mono">' + escapeHtml(formatCount(item.active_incidents)) + '</span></td>'
            + '</tr>'
          )).join("");
          setHtml("founder-domain-performance-body", html);
        }

        function renderInsights() {
          const items = state.insights?.items || [];
          if (!items.length) {
            setHtml("founder-ai-insights-list", messageCard(localized("Chưa có insight runtime.", "No runtime insights yet."), "command-insight-item"));
            return;
          }

          const html = items.map((item) => {
            const tone = toneFromRisk(item.risk_level);
            const recommendations = Array.isArray(item.recommendations) ? item.recommendations : (Array.isArray(item.recommendation) ? item.recommendation : []);
            return '<article class="command-insight-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<h4 class="command-item-title">' + escapeHtml(localizedField(item, "title", item.id || "--")) + '</h4>'
              + '<span class="command-status is-' + escapeHtml(tone) + '">' + escapeHtml(String(item.risk_level || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="subtle mono">' + escapeHtml(localized("confidence", "confidence")) + ' ' + escapeHtml(String(item.confidence ?? "--")) + ' · ' + escapeHtml(String(item.type || "--")) + '</div>'
              + '<div class="body-copy">' + escapeHtml(localizedField(item, "summary")) + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("affected area", "affected area")) + ': <span class="mono">' + escapeHtml(item.affected_area || "--") + '</span></div>'
              + '<div class="subtle">' + escapeHtml(localized("Khuyến nghị đầu tiên", "First recommendation")) + '</div>'
              + '<div class="disclosure-copy">' + escapeHtml(recommendations[0] || localized("Chưa có khuyến nghị.", "No recommendation yet.")) + '</div>'
              + '</article>';
          }).join("");
          setHtml("founder-ai-insights-list", html);
        }

        function renderActionSummary() {
          const recommended = state.recommendedActions?.items || [];
          const history = state.actionHistory?.items || [];
          const successCount = history.filter((item) => item.status === "success").length;
          const rollbackReadyCount = history.filter((item) => item.rollback_available).length;
          const successRate = history.length > 0 ? Math.round((successCount / history.length) * 100) + "%" : "--";

          setHtml("founder-action-summary-metrics", summaryMetricsHtml([
            { label: localized("recommended", "recommended"), value: formatCount(recommended.length) },
            { label: localized("applied", "applied"), value: formatCount(history.length) },
            { label: localized("success rate", "success rate"), value: successRate },
            { label: localized("rollback ready", "rollback ready"), value: formatCount(rollbackReadyCount) },
          ]));
        }

        function renderRecommendedActions() {
          const items = state.recommendedActions?.items || [];
          if (!items.length) {
            setHtml("founder-recommended-actions-list", messageCard(localized("Chưa có runtime action recommendation.", "No runtime action recommendation yet.")));
            return;
          }

          const html = items.map((item) => (
            '<article class="command-stream-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(localizedField(item, "name", item.action_id || "--")) + '</div><div class="subtle mono">' + escapeHtml(item.action_id || "--") + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(toneFromTier(item.tier)) + '">' + escapeHtml(String(item.tier || "--").replaceAll("_RISK", "")) + '</span>'
              + '</div>'
              + '<div class="body-copy">' + escapeHtml(localizedField(item, "description")) + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("scope", "scope")) + ': <span class="mono">' + escapeHtml((item.scope_domains || []).join(", ") || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("rollback", "rollback")) + ': <span class="mono">' + escapeHtml(item.rollback_supported ? localized("yes", "yes") : localized("no", "no")) + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("expected effect", "expected effect")) + ': ' + escapeHtml(item.expected_effect || "--") + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("source insight", "source insight")) + ': ' + escapeHtml(item.insight_title || "--") + '</div>'
            + '</article>'
          )).join("");
          setHtml("founder-recommended-actions-list", html);
        }

        function renderActionHistory() {
          const items = state.actionHistory?.items || [];
          if (!items.length) {
            setHtml("founder-action-history-list", messageCard(localized("Chưa có runtime action history.", "No runtime action history yet.")));
            return;
          }

          const html = items.slice(0, 5).map((item) => (
            '<article class="command-stream-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(resolveActionLabel(item.action_id || "--")) + '</div><div class="subtle mono">' + escapeHtml(item.action_id || "--") + ' · ' + escapeHtml(formatDateTime(item.created_at)) + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(toneFromStatus(item.status)) + '">' + escapeHtml(String(item.status || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("trigger", "trigger")) + ': <span class="mono">' + escapeHtml(item.trigger_type || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("rollback", "rollback")) + ': <span class="mono">' + escapeHtml(item.rollback_available ? localized("yes", "yes") : localized("no", "no")) + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("approved by", "approved by")) + ': ' + escapeHtml(item.triggered_by || "--") + '</div>'
            + '</article>'
          )).join("");
          setHtml("founder-action-history-list", html);
        }

        function renderIncidents() {
          const items = state.incidents?.items || [];
          if (!items.length) {
            setHtml("founder-incidents-list", messageCard(localized("Chưa có runtime incident.", "No runtime incident yet.")));
            return;
          }

          const html = items.map((item) => (
            '<article class="command-stream-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(localizedField(item, "title", item.id || "--")) + '</div><div class="subtle mono">' + escapeHtml(formatDateTime(item.created_at)) + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(toneFromStatus(item.severity || item.status)) + '">' + escapeHtml(String(item.severity || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="body-copy">' + escapeHtml(localizedField(item, "description")) + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("status", "status")) + ': <span class="mono">' + escapeHtml(item.status || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("owner", "owner")) + ': <span class="mono">' + escapeHtml(item.owner_id || item.owner_role || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("domain", "domain")) + ': <span class="mono">' + escapeHtml(item.domain || "--") + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("root hypothesis", "root hypothesis")) + ': ' + escapeHtml(item.root_hypothesis || "--") + '</div>'
            + '</article>'
          )).join("");
          setHtml("founder-incidents-list", html);
        }

        function renderAuditLog() {
          const items = state.audit?.items || [];
          if (!items.length) {
            setHtml("founder-audit-log-list", messageCard(localized("Chưa có runtime audit event.", "No runtime audit event yet.")));
            return;
          }

          const html = items.slice(0, 6).map((item) => (
            '<article class="command-stream-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(item.event || "--") + '</div><div class="subtle mono">' + escapeHtml(formatDateTime(item.created_at)) + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(toneFromStatus(item.result || item.event)) + '">' + escapeHtml(String(item.actor_role || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("actor", "actor")) + ': <span class="mono">' + escapeHtml(item.actor || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("rollback", "rollback")) + ': <span class="mono">' + escapeHtml(item.rollback_available ? localized("yes", "yes") : localized("no", "no")) + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("detail", "detail")) + ': ' + escapeHtml(item.action_id || item.execution_id || item.incident_id || "--") + '</div>'
              + (item.reason ? '<div class="subtle">' + escapeHtml(localized("reason", "reason")) + ': ' + escapeHtml(item.reason) + '</div>' : '')
            + '</article>'
          )).join("");
          setHtml("founder-audit-log-list", html);
        }

        function renderDeployments() {
          const items = state.deployments?.items || [];
          if (!items.length) {
            setHtml("founder-deployments-list", messageCard(localized("Chưa có runtime deployment.", "No runtime deployment yet.")));
            return;
          }

          const html = items.map((item) => (
            '<article class="command-stream-item">'
              + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
              + '<div><div class="command-item-title">' + escapeHtml(item.release_name || item.version || "--") + '</div><div class="subtle mono">' + escapeHtml(formatDateTime(item.deployed_at)) + '</div></div>'
              + '<span class="command-status is-' + escapeHtml(toneFromStatus(item.environment)) + '">' + escapeHtml(String(item.environment || "--").toUpperCase()) + '</span>'
              + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("version", "version")) + ': <span class="mono">' + escapeHtml(item.version || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("rollback ready", "rollback ready")) + ': <span class="mono">' + escapeHtml(item.rollback_ready ? localized("yes", "yes") : localized("no", "no")) + '</span></span>'
              + '</div>'
            + '</article>'
          )).join("");
          setHtml("founder-deployments-list", html);
        }

        function renderSettings() {
          const overview = state.overview || {};
          const autopilotModes = Array.isArray(overview.action_registry?.autopilot_modes) ? overview.action_registry.autopilot_modes : [];
          const windows = Array.isArray(overview.metrics_registry?.default_windows) ? overview.metrics_registry.default_windows : [];
          const html = [
            '<article class="command-stream-item">'
              + '<div class="command-item-title">' + escapeHtml(localized("Contract versions", "Contract versions")) + '</div>'
              + '<div class="command-item-meta">'
              + '<span>' + escapeHtml(localized("panel", "panel")) + ': <span class="mono">' + escapeHtml(overview.panel_contract?.version || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("metrics", "metrics")) + ': <span class="mono">' + escapeHtml(overview.metrics_registry?.version || "--") + '</span></span>'
              + '<span>' + escapeHtml(localized("actions", "actions")) + ': <span class="mono">' + escapeHtml(overview.action_registry?.version || "--") + '</span></span>'
              + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("default view", "default view")) + ': <span class="mono">' + escapeHtml(overview.panel_contract?.default_view || "--") + '</span> · ' + escapeHtml(localized("default window", "default window")) + ': <span class="mono">' + escapeHtml(overview.panel_contract?.default_window || "--") + '</span></div>'
            + '</article>',
            '<article class="command-stream-item">'
              + '<div class="command-item-title">' + escapeHtml(localized("Guardrails", "Guardrails")) + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("available windows", "available windows")) + ': <span class="mono">' + escapeHtml(windows.join(", ") || "--") + '</span></div>'
              + '<div class="subtle">' + escapeHtml(localized("autopilot modes", "autopilot modes")) + ': <span class="mono">' + escapeHtml(autopilotModes.map((item) => localizedField(item, "label", item.key || "--")).join(", ") || "--") + '</span></div>'
              + '<div class="subtle">' + escapeHtml(localized("query examples wired", "query examples wired")) + ': <span class="mono">' + escapeHtml(formatCount(founderCommandExampleCount)) + '</span></div>'
              + '<div class="body-copy">' + escapeHtml(localized("Không có production apply UI công khai ở route này. Sample/runtime-seed luôn phải được hiểu là seed, không phải live event.", "There is no public production apply UI on this route. Sample/runtime-seed content must always be read as seed data, not as a live event.")) + '</div>'
            + '</article>',
          ].join("");
          setHtml("founder-settings-list", html);
        }

        function renderDrawer() {
          if (state.queryLoading) {
            setHtml("founder-drawer-shell", '<div class="subtle">' + escapeHtml(localized("Đang chạy founder query...", "Running founder query...")) + '</div>');
            return;
          }

          if (state.queryError) {
            setHtml("founder-drawer-shell", '<div class="subtle">' + escapeHtml(state.queryError) + '</div>');
            return;
          }

          if (state.queryResult) {
            const evidence = Array.isArray(state.queryResult.evidence) ? state.queryResult.evidence : [];
            const recommendations = Array.isArray(state.queryResult.recommendations) ? state.queryResult.recommendations : [];
            const actions = Array.isArray(state.queryResult.actions) ? state.queryResult.actions : [];
            const normalizedActionLabels = actions.map((item) => (
              typeof item === "string"
                ? resolveActionLabel(item)
                : localizedField(item, "name", resolveActionLabel(item.action_id || "--"))
            ));

            setHtml(
              "founder-drawer-shell",
              '<div class="stack">'
                + '<div class="command-item-title">' + escapeHtml(state.queryText || localized("Founder query result", "Founder query result")) + '</div>'
                + '<div class="subtle mono">' + escapeHtml(localized("risk", "risk")) + ': ' + escapeHtml(String(state.queryResult.risk_level || "--")) + '</div>'
                + '<div class="body-copy">' + escapeHtml(state.queryResult.summary || localized("Chưa có summary.", "No summary yet.")) + '</div>'
                + (evidence.length > 0 ? '<div class="subtle">' + escapeHtml(localized("Evidence", "Evidence")) + '</div>' + inlineList(evidence.slice(0, 3)) : '')
                + (recommendations.length > 0 ? '<div class="subtle">' + escapeHtml(localized("Recommendations", "Recommendations")) + '</div>' + inlineList(recommendations.slice(0, 3)) : '')
                + (normalizedActionLabels.length > 0 ? '<div class="subtle">' + escapeHtml(localized("Action options", "Action options")) + '</div>' + inlineList(normalizedActionLabels.slice(0, 3)) : '')
              + '</div>',
            );
            return;
          }

          const first = (state.insights?.items || [])[0];
          if (!first) {
            setHtml("founder-drawer-shell", '<div class="subtle">' + escapeHtml(localized("Chưa có insight hoặc query result để hiển thị.", "No insight or query result is available yet.")) + '</div>');
            return;
          }

          const firstRecommendations = Array.isArray(first.recommendations) ? first.recommendations : (Array.isArray(first.recommendation) ? first.recommendation : []);
          const firstEvidence = Array.isArray(first.evidence) ? first.evidence : [];
          setHtml(
            "founder-drawer-shell",
            '<div class="stack">'
              + '<div class="command-item-title">' + escapeHtml(localizedField(first, "title", first.id || "--")) + '</div>'
              + '<div class="subtle mono">' + escapeHtml(String(first.risk_level || "--")) + ' · ' + escapeHtml(localized("confidence", "confidence")) + ' ' + escapeHtml(String(first.confidence ?? "--")) + '</div>'
              + '<div class="body-copy">' + escapeHtml(localizedField(first, "summary")) + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("Bằng chứng đầu tiên", "First evidence")) + '</div>'
              + '<div class="disclosure-copy">' + escapeHtml(firstEvidence[0] || localized("Chưa có bằng chứng hiển thị.", "No evidence available.")) + '</div>'
              + '<div class="subtle">' + escapeHtml(localized("Khuyến nghị đầu tiên", "First recommendation")) + '</div>'
              + '<div class="disclosure-copy">' + escapeHtml(firstRecommendations[0] || localized("Chưa có khuyến nghị.", "No recommendation yet.")) + '</div>'
            + '</div>',
          );
        }

        function renderAll() {
          if (state.error) {
            renderErrorState(state.error);
            return;
          }
          if (!state.overview) {
            renderLoadingState();
            return;
          }
          renderOverviewMeta();
          renderSystemHealth();
          renderJourney();
          renderLearningProof();
          renderDomains();
          renderInsights();
          renderActionSummary();
          renderRecommendedActions();
          renderActionHistory();
          renderIncidents();
          renderAuditLog();
          renderDeployments();
          renderSettings();
          renderDrawer();
          renderCommandState();
        }

        async function fetchJson(path) {
          const response = await fetch(path, {
            headers: {
              accept: "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(path + " -> " + response.status);
          }
          return response.json();
        }

        async function postJson(path, payload) {
          const response = await fetch(path, {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
            body: JSON.stringify(payload || {}),
          });
          if (!response.ok) {
            throw new Error(path + " -> " + response.status);
          }
          return response.json();
        }

        async function runFounderQuery(query) {
          const trimmed = String(query || "").trim();
          state.queryText = trimmed;
          state.queryError = "";
          state.queryResult = null;

          if (!trimmed) {
            renderDrawer();
            renderCommandState();
            return;
          }

          state.queryLoading = true;
          renderDrawer();
          renderCommandState();

          try {
            state.queryResult = await postJson("/api/founder/insights/query", { query: trimmed });
            state.queryLoading = false;
            renderDrawer();
            renderCommandState();

            if (typeof window.vetuonglaiTrack === "function") {
              window.vetuonglaiTrack("founder_panel_query_submitted", {
                screen: "/founder/",
                query: trimmed,
              });
            }
          } catch (error) {
            state.queryLoading = false;
            state.queryError = error instanceof Error ? error.message : String(error || "query_error");
            renderDrawer();
            renderCommandState();
          }
        }

        async function hydrateFounderPanel() {
          renderLoadingState();
          try {
            const [overview, insights, recommendedActions, actionHistory, incidents, audit, deployments] = await Promise.all([
              fetchJson("/api/founder/overview"),
              fetchJson("/api/founder/insights"),
              fetchJson("/api/founder/actions/recommended"),
              fetchJson("/api/founder/actions/history"),
              fetchJson("/api/founder/incidents"),
              fetchJson("/api/founder/audit-log"),
              fetchJson("/api/founder/deployments"),
            ]);

            state.overview = overview;
            state.insights = insights;
            state.recommendedActions = recommendedActions;
            state.actionHistory = actionHistory;
            state.incidents = incidents;
            state.audit = audit;
            state.deployments = deployments;
            state.error = "";
            renderAll();

            if (typeof window.vetuonglaiTrack === "function") {
              window.vetuonglaiTrack("founder_panel_runtime_hydrated", {
                screen: "/founder/",
                alerts: Array.isArray(overview.critical_alerts) ? overview.critical_alerts.length : 0,
                insights: Array.isArray(insights.items) ? insights.items.length : 0,
                recommended_actions: Array.isArray(recommendedActions.items) ? recommendedActions.items.length : 0,
              });
            }
          } catch (error) {
            state.error = error instanceof Error ? error.message : String(error || "runtime_error");
            renderAll();
          }
        }

        document.addEventListener("DOMContentLoaded", () => {
          hydrateFounderPanel();

          const form = document.getElementById("founder-command-form");
          const input = document.getElementById("founder-command-input");
          if (form && input) {
            form.addEventListener("submit", (event) => {
              event.preventDefault();
              runFounderQuery(input.value);
            });
          }

          document.querySelectorAll("[data-founder-query]").forEach((button) => {
            button.addEventListener("click", () => {
              const query = button.getAttribute("data-founder-query") || "";
              if (input) input.value = query;
              runFounderQuery(query);
            });
          });
        });

        window.addEventListener("vetuonglai:languagechange", renderAll);
      })();
    `,
  });
}

function renderVcHome() {
  const deepCta = purchaseHubUrl({ entry: "vc", pack: "g1", intent: "annual-access", source: "vc-home" });
  const vcSurface = resolveSurfacePublicMeta("vc");
  const hero = renderHero({
    eyebrow: codexPair("sites.vc.hero.eyebrow", "Lớp xác minh", "Verification layer"),
    title: codexPair("sites.vc.hero.title", "XÁC MINH", "VERIFICATION"),
    description: codexPair(
      "sites.vc.hero.subline",
      "Một lớp xác minh độc lập cho giá trị thật.",
      "An independent verification layer for real value.",
    ),
    actions: `
      <div class="search-shell" style="min-width:min(100%,480px)">
        <input class="search-input mono" id="vc-code-input" data-placeholder-vi="Nhập mã, ví dụ VC-2026-0001" data-placeholder-en="Enter a code, for example VC-2026-0001" placeholder="Nhập mã, ví dụ VC-2026-0001" />
        <div class="cluster">
          <button class="button primary" id="vc-verify-button" type="button">${localizedText(pair("Xác minh", "Verify"))}</button>
          <button class="button ghost" id="vc-sample-button" type="button" data-sample="${escapeHtml(certificates[0].code)}">${localizedText(pair("Thử mẫu", "Try sample"))}</button>
        </div>
      </div>
    `,
    aside: renderMetrics([
      { value: String(certificates.length), label: pair("bản ghi nội bộ", "local records") },
      { value: String(certificates.filter((item) => item.status === "verified").length), label: pair("đã xác minh", "verified") },
      { value: "NFT", label: pair("mirror runtime", "runtime mirror") },
      { value: system.version, label: pair("phiên bản", "version") },
    ]),
  });

  const registry = `
    <div class="grid-3" id="vc-featured-shell">
      <article class="card">
        <div class="card-body">
          ${localizedText(pair("Đang tải registry nội bộ và NFT mirror...", "Loading the local registry and NFT mirror..."), "div", { class: "subtle" })}
        </div>
      </article>
    </div>
  `;

  const table = `
    <article class="card">
      <div class="card-body" id="vc-table-shell">
        ${localizedText(pair("Đang tải bảng registry...", "Loading registry table..."), "div", { class: "subtle" })}
      </div>
    </article>
  `;

  const trust = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Nguyên tắc", "Principles"))}
          ${renderList([
            pair("Công bố tối thiểu", "Minimal disclosure"),
            pair("Xác minh độc lập", "Independent verification"),
            pair("Không chỉnh sửa dữ liệu sau khi ghi nhận", "No silent edits after recording"),
            pair("Có thể kiểm tra chéo", "Cross-checkable records"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("VC là gì", "What VC is"))}
          ${cardText(pair(
            "VC là một hệ thống xác minh năng lực, sản phẩm, tài sản và dự án dựa trên dữ liệu thật, hồ sơ thật và dấu vết kiểm tra được.",
            "VC is a verification system for capabilities, products, assets, and projects built on real data, real profiles, and checkable traces.",
          ), "body-copy")}
          <div class="cluster">
            ${button(`https://${domains.edu}`, pair("Mở EDU", "Open EDU"), "ghost")}
            ${button(`https://${domains.green}`, pair("Mở GREEN", "Open GREEN"), "ghost")}
            ${button(`https://${domains.finance}`, pair("Mở FIN", "Open FIN"), "ghost")}
          </div>
        </div>
      </article>
    </div>
  `;

  const profileFieldCopyMap = new Map([
    ["legal_full_name", pair("Họ tên pháp lý", "Legal full name")],
    ["date_of_birth", pair("Ngày sinh (YYYY-MM-DD)", "Date of birth (YYYY-MM-DD)")],
    ["country_code", pair("Mã quốc gia (ISO 2 ký tự)", "Country code (2-letter ISO)")],
    ["phone_e164", pair("Số điện thoại chuẩn quốc tế", "Phone number in E.164 format")],
    ["national_id_last4", pair("4 số cuối giấy tờ định danh", "Last 4 digits of national ID")],
    ["address_line_1", pair("Địa chỉ dòng 1", "Address line 1")],
    ["city", pair("Thành phố", "City")],
  ]);

  const profileConsentCopyMap = new Map([
    ["consent_truthful_data", pair("Cam kết dữ liệu trung thực", "Consent to truthful data declaration")],
    ["consent_privacy_policy", pair("Đồng ý chính sách riêng tư", "Consent to privacy policy")],
  ]);

  const profileFieldItems = (Array.isArray(vcProtectionProfilePolicy.requiredFields) ? vcProtectionProfilePolicy.requiredFields : [])
    .map((key) => profileFieldCopyMap.get(key) || pair(key, key));
  const profileConsentItems = (Array.isArray(vcProtectionProfilePolicy.requiredConsents) ? vcProtectionProfilePolicy.requiredConsents : [])
    .map((key) => profileConsentCopyMap.get(key) || pair(key, key));

  const membershipAndProfileFlow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("VC không phải", "What VC is not"))}
          ${renderList([
            pair("Không phải chứng chỉ đẹp", "Not a decorative certificate"),
            pair("Không phải profile marketing", "Not a marketing profile"),
            pair("Không phải blockchain để đầu cơ", "Not a speculative blockchain page"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Cách đọc một bản ghi", "How to read a record"))}
          ${cardText(pair(
            "Một bản ghi VC chỉ công bố những gì cần thiết cho việc kiểm tra: mã, chủ thể, phạm vi, trạng thái và các neo bằng chứng.",
            "A VC record publishes only what is needed for checking: code, holder, scope, status, and evidence anchors.",
          ), "body-copy")}
          ${renderList([
            pair("Xem mã và trạng thái", "Read the code and status"),
            pair("Đối chiếu phạm vi và chủ thể", "Check scope and holder"),
            pair("Mở bằng chứng hoặc liên kết gốc khi cần", "Open supporting evidence or source links when needed"),
          ])}
        </div>
      </article>
    </div>
  `;

  const enterprisePlanCards = enterprisePlans.map((plan) => {
    const includedVi = Array.isArray(plan.includedVi) ? plan.includedVi : [];
    const includedEn = Array.isArray(plan.included) ? plan.included : includedVi;
    const billing = plan?.billing || {};
    const amount = Number.isFinite(Number(billing.amount)) ? Number(billing.amount) : null;
    const interval = String(billing.interval || "month");
    const billingLabel = interval === "custom_quote"
      ? pair("Báo giá theo nhu cầu", "Custom quote")
      : pair(`USD ${amount}/${interval}`, `USD ${amount}/${interval}`);
    const monthlyVolume = plan?.coverage?.monthlyOwnershipCertifications ?? "custom";
    const teamSeats = plan?.coverage?.teamSeats ?? "custom";
    const coverageList = renderList([
      pair(`Số chứng thực/tháng: ${monthlyVolume}`, `Certifications/month: ${monthlyVolume}`),
      pair(`Số seat đội ngũ: ${teamSeats}`, `Team seats: ${teamSeats}`),
    ]);
    return renderCard({
      title: cardTitle(pair(plan.nameVi || plan.name || "", plan.name || plan.nameVi || "")),
      badge: statusBadge("live", pair("Trả phí", "Paid")),
      body: `${cardText(billingLabel)}${coverageList}${renderList(includedVi.map((vi, index) => pair(vi, includedEn[index] || vi)))}`,
      actions: button(
        plan?.cta?.href || "https://vetuonglai.com/lien-he/?intent=enterprise-vc",
        pair(plan?.cta?.labelVi || plan?.cta?.label || "Liên hệ đội Enterprise", plan?.cta?.label || plan?.cta?.labelVi || "Contact enterprise team"),
        "ghost",
      ),
    });
  });

  const enterpriseSection = enterprisePlanCards.length > 0
    ? renderCards(enterprisePlanCards)
    : `
      <article class="card">
        <div class="card-body">
          ${localizedText(pair("Chưa có gói enterprise công khai. Vui lòng liên hệ trực tiếp để nhận báo giá.", "No public enterprise plans yet. Contact the team for a custom quote."), "div", { class: "subtle" })}
        </div>
      </article>
    `;

  const publicValue = `${trust}${membershipAndProfileFlow}`;
  const demoSurface = `${registry}${table}`;

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "vc",
    deepCta,
    notes: [
      pair("VC mở lớp xác minh công khai, còn các intent mở sâu sang learning, profile hoặc member routing vẫn quay về hub.", "VC keeps the verification layer public, while deeper intents for learning, profiles, or member routing still return to the hub."),
      pair("VC không tạo purchase flow riêng. Nó chỉ làm rõ trust path và evidence path.", "VC does not create its own purchase flow. It only clarifies the trust path and evidence path."),
    ],
    disclosureIds: ["DPM-021"],
    secondaryActions: `${button(`https://${domains.vc}/issuers/`, pair("Xem nguồn phát hành", "Open issuers"), "ghost")} ${button(`https://${domains.vc}/v/${certificates[0].code}`, pair("Mở bản ghi mẫu", "Open sample record"), "ghost")}`,
  });

  const trustStatusSection = renderSection(
    pair("Trust & trạng thái", "Trust & status"),
    pair(
      "Giữ rõ vai trò public của VC, boundary công khai và lớp tổ chức đi kèm.",
      "Keep the public role of VC, the disclosure boundary, and the organization layer explicit.",
    ),
    `
      ${renderCards([
        renderCard({
          title: cardTitle(pair("Trạng thái surface", "Surface status")),
          badge: statusBadge(surfaceBadgeClass(vcSurface.status), appStageLabel(vcSurface)),
          body: cardText(pair(
            "VC là live public layer: người dùng có thể tra cứu, mở sample record và đọc nguyên tắc xác minh mà không đi qua checkout.",
            "VC is a live public layer: users can look up records, open sample records, and read verification principles without passing through checkout.",
          )),
        }),
        renderCard({
          title: cardTitle(pair("Boundary công khai", "Public boundary")),
          body: renderList([
            pair("Công khai lớp verify, trạng thái và anchor cần thiết.", "Publish the verify layer, status, and required anchors."),
            pair("Không công bố quá mức, không hứa outcome, không dùng VC để xác minh kết quả tài chính.", "Do not overexpose data, do not promise outcomes, and do not use VC to verify financial results."),
            pair("Mọi commerce intent vẫn quay về hub.", "Every commerce intent still returns to the hub."),
            pair("VC quick verify trên mobile cũng bám cùng bốn trạng thái visitor, pending member, annual access và specialist access; VC không tự mở quyền thành viên.", "Quick VC verify on mobile follows the same four states: visitor, pending member, annual access, and specialist access; VC never unlocks member access by itself."),
          ]),
        }),
        renderCard({
          title: cardTitle(pair("Lớp tổ chức", "Organization layer")),
          body: cardText(pair(
            "Các gói tổ chức là lớp vận hành mở rộng cho đội ngũ và doanh nghiệp. Chúng không thay đổi nguyên tắc công khai của VC.",
            "Organization plans are an extended operating layer for teams and enterprises. They do not change the public principles of VC.",
          )),
          actions: button("https://vetuonglai.com/lien-he/?intent=enterprise-vc", pair("Liên hệ enterprise", "Contact enterprise"), "ghost"),
          support: renderDisclosureStack(["DPM-021"], { className: "is-footer" }),
        }),
      ])}
      <div style="margin-top:18px">${enterpriseSection}</div>
    `,
    "trust-status",
  );

  const inlineScript = `
    const nftRegistryUrl = ${JSON.stringify(nftBridge.registryUrl || "")};
    const featuredShell = document.getElementById("vc-featured-shell");
    const tableShell = document.getElementById("vc-table-shell");
    const input = document.getElementById("vc-code-input");
    const verifyButton = document.getElementById("vc-verify-button");
    const sampleButton = document.getElementById("vc-sample-button");
    const copy = (vi, en = vi) => ({ vi, en });
    const currentLanguage = () => document.documentElement.dataset.language === "en" ? "en" : "vi";
    const toneClass = (value) => {
      if (value === "verified") return "live";
      if (value === "reviewing") return "reviewing";
      return "planned";
    };
    const escapeHtml = (value) => String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const localizedText = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + escapeHtml(vi) + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + escapeHtml(en) + '</span></' + tag + '>';
    };
    const localizedHtml = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + vi + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + en + '</span></' + tag + '>';
    };
    const syncLanguage = () => window.vetuonglaiSyncLanguage?.();
    const statusLabel = (value) => {
      if (value === "verified") return copy("Đã xác minh", "Verified");
      if (value === "reviewing") return copy("Đang rà soát", "Reviewing");
      return copy("Kế hoạch", "Planned");
    };
    const typeLabel = (value) => value === "asset" ? copy("Tài sản", "Asset") : copy("Chứng nhận", "Credential");
    const programLabel = (record) => copy(
      record.program || record.assetName || record.name || record.code || "",
      record.programEn || record.assetNameEn || record.program || record.assetName || record.name || record.code || ""
    );
    const summaryLabel = (record) => copy(
      record.summary || record.description || "",
      record.summaryEn || record.descriptionEn || record.summary || record.description || ""
    );
    const holderLabel = (record) => record.holder || record.walletAddress || "Unknown";
    const domainLabel = (record) => record.domain || "nft.iai.one";
    const mergeRecords = (localItems, remotePayload) => {
      const remoteItems = Array.isArray(remotePayload?.vcRecords)
        ? remotePayload.vcRecords
        : Array.isArray(remotePayload?.registrations)
          ? remotePayload.registrations.map((item) => item.vcRecord).filter(Boolean)
          : [];
      const byCode = new Map();
      [...localItems, ...remoteItems]
        .map((item) => ({ recordType: item.recordType || "credential", ...item }))
        .forEach((item) => {
          byCode.set(String(item.code || "").toUpperCase(), item);
        });
      return Array.from(byCode.values()).sort((a, b) => String(b.issuedAt || "").localeCompare(String(a.issuedAt || "")));
    };
    const emptyCard = '<article class="card"><div class="card-body"><div class="subtle">' + localizedText("Chưa có bản ghi nào.", "No records yet.") + '</div></div></article>';
    const renderRegistry = (items) => {
      featuredShell.innerHTML = items.slice(0, 4).map((record) => {
        const label = programLabel(record);
        const summary = summaryLabel(record);
        return [
          '<article class="card"><div class="card-body stack">',
          '<div class="cluster" style="justify-content:space-between;align-items:flex-start">',
          localizedText(record.code + ' · ' + label.vi, record.code + ' · ' + label.en, 'h3', 'card-title'),
          '<span class="badge ' + toneClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</span>',
          '</div>',
          localizedText(summary.vi, summary.en, 'div', 'body-copy'),
          '<div class="cluster subtle mono"><span>' + escapeHtml(holderLabel(record)) + '</span><span>' + escapeHtml(domainLabel(record)) + '</span><span>' + localizedText(typeLabel(record.recordType).vi, typeLabel(record.recordType).en) + '</span></div>',
          '<div class="cluster"><a class="button ghost" href="/v/' + encodeURIComponent(record.code) + '?lang=' + currentLanguage() + '">' + localizedText("Mở bản ghi", "Open record") + '</a></div>',
          '</div></article>',
        ].join("");
      }).join("") || emptyCard;

      tableShell.innerHTML = [
        '<table class="table"><thead><tr>',
        '<th>' + localizedText("Mã", "Code") + '</th>',
        '<th>' + localizedText("Loại", "Type") + '</th>',
        '<th>' + localizedText("Chương trình / tài sản", "Program / asset") + '</th>',
        '<th>' + localizedText("Chủ thể", "Holder") + '</th>',
        '<th>' + localizedText("Trạng thái", "Status") + '</th>',
        '</tr></thead><tbody>',
        items.map((record) => {
          const label = programLabel(record);
          return [
            '<tr>',
            '<td class="mono"><a href="/v/' + encodeURIComponent(record.code) + '?lang=' + currentLanguage() + '">' + escapeHtml(record.code) + '</a></td>',
            '<td>' + localizedText(typeLabel(record.recordType).vi, typeLabel(record.recordType).en) + '</td>',
            '<td>' + localizedText(label.vi, label.en) + '</td>',
            '<td>' + escapeHtml(holderLabel(record)) + '</td>',
            '<td><span class="badge ' + toneClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</span></td>',
            '</tr>',
          ].join("");
        }).join(""),
        '</tbody></table>',
      ].join("");

      if (!sampleButton.getAttribute("data-sample") && items[0]?.code) {
        sampleButton.setAttribute("data-sample", items[0].code);
      }

      syncLanguage();
    };
    const normalizeLocalRegistryItems = (payload) => Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.certificates)
        ? payload.certificates
        : [];
    async function loadRegistry() {
      const [localPayload, remotePayload] = await Promise.all([
        fetch("/api/certificates.json").then((response) => response.ok ? response.json() : { certificates: [] }).catch(() => ({ certificates: [] })),
        nftRegistryUrl
          ? fetch(nftRegistryUrl).then((response) => response.ok ? response.json() : { vcRecords: [] }).catch(() => ({ vcRecords: [] }))
          : Promise.resolve({ vcRecords: [] }),
      ]);
      const localItems = normalizeLocalRegistryItems(localPayload);
      renderRegistry(mergeRecords(localItems, remotePayload));
    }
    function go(code) {
      const normalized = String(code || "").trim().toUpperCase();
      if (!normalized) return;
      const url = new URL("/v/" + encodeURIComponent(normalized), window.location.origin);
      url.searchParams.set("lang", currentLanguage());
      window.location.href = url.toString();
    }
    verifyButton?.addEventListener("click", () => go(input?.value));
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") go(input.value);
    });
    sampleButton?.addEventListener("click", () => go(sampleButton.getAttribute("data-sample")));
    loadRegistry().catch(() => {
      featuredShell.innerHTML = '<article class="card"><div class="card-body"><div class="subtle">' + localizedText("Không tải được registry runtime. Hệ thống đang rơi về dữ liệu cục bộ.", "Unable to load the runtime registry. Falling back to local data.") + '</div></div></article>';
      tableShell.innerHTML = '<div class="subtle">' + localizedText("Không tải được bảng registry.", "Unable to load the registry table.") + '</div>';
      syncLanguage();
    });
  `;

  return renderShell({
    currentKey: "vc",
    pathname: "/",
    title: codexPair("sites.vc.seo.title", "VC | Lớp xác minh độc lập cho giá trị thật", "VC | Independent verification for real value"),
    description: codexPair(
      "sites.vc.seo.description",
      "VC là lớp xác minh độc lập cho năng lực, sản phẩm, tài sản và dự án bằng dữ liệu thật, hồ sơ thật và kiểm tra được.",
      "VC is the independent verification layer for capabilities, products, assets, and projects through real data, real profiles, and checkable records.",
    ),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("VC giải thích cách trust được kiểm tra mà không công bố thừa.", "VC explains how trust is checked without overexposing data."), publicValue, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Sample record và lookup mở công khai để user thấy verify layer hoạt động ra sao.", "Sample records and the lookup stay public so users can see how the verification layer works."), demoSurface, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
    inlineScript,
  });
}

function renderVcRecordPage() {
  const hero = renderHero({
    eyebrow: pair("Tra cứu VC record", "VC record lookup"),
    title: pair(
      `Tra cứu bản ghi<br><span class="accent">qua đường dẫn /v/:code</span>`,
      `Open a record<br><span class="accent">through the /v/:code route</span>`,
    ),
    description: pair(
      "Trang này đọc mã từ pathname, tải registry JSON và hiển thị bằng chứng xác minh. Nó hoạt động với Pages rewrite `/v/* -> /v/index.html`.",
      "This page reads the code from the pathname, loads the registry JSON, and renders the verification evidence. It works with the Pages rewrite `/v/* -> /v/index.html`.",
    ),
    actions: [
      button("/", pair("Về VC home", "Back to VC home")),
      button(`https://${domains.hub}`, pair("Về Hub", "Back to hub"), "ghost"),
    ].join(""),
  });

  const shell = `
    <article class="card">
      <div class="card-body stack">
        <div class="result-shell" id="vc-result-shell">
          ${localizedText(pair("Đang tải dữ liệu registry...", "Loading registry data..."), "div", { class: "subtle" })}
        </div>
      </div>
    </article>
  `;

  const inlineScript = `
    const nftRegistryUrl = ${JSON.stringify(nftBridge.registryUrl || "")};
    const resultShell = document.getElementById("vc-result-shell");
    const copy = (vi, en = vi) => ({ vi, en });
    const currentLanguage = () => document.documentElement.dataset.language === "en" ? "en" : "vi";
    const statusClass = (value) => {
      if (value === "verified") return "live";
      if (value === "reviewing") return "reviewing";
      return "planned";
    };
    const escapeHtml = (value) => String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const localizedText = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + escapeHtml(vi) + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + escapeHtml(en) + '</span></' + tag + '>';
    };
    const syncLanguage = () => window.vetuonglaiSyncLanguage?.();
    const statusLabel = (value) => {
      if (value === "verified") return copy("Đã xác minh", "Verified");
      if (value === "reviewing") return copy("Đang rà soát", "Reviewing");
      return copy("Kế hoạch", "Planned");
    };
    const typeLabel = (value) => value === "asset" ? copy("Tài sản", "Asset") : copy("Chứng nhận", "Credential");
    const renderNotFound = (code) => {
      resultShell.innerHTML = [
        localizedText("Không tìm thấy bản ghi", "Record not found", "h2", "result-title"),
        localizedText('Mã ' + code + ' chưa tồn tại trong registry hiện tại. Hãy quay lại trang VC để thử mã khác.', 'Code ' + code + ' does not exist in the current registry. Return to VC home to try another code.', "p", "body-copy"),
      ].join("");
      syncLanguage();
    };
    const pickCode = () => {
      const params = new URLSearchParams(location.search);
      const fromQuery = params.get("code");
      if (fromQuery) return fromQuery.toUpperCase();
      const segments = location.pathname.split("/").filter(Boolean);
      const candidate = segments.at(-1);
      if (!candidate || candidate === "v") return "";
      return decodeURIComponent(candidate).toUpperCase();
    };
    const mergeRecords = (localItems, remotePayload) => {
      const remoteItems = Array.isArray(remotePayload?.vcRecords)
        ? remotePayload.vcRecords
        : Array.isArray(remotePayload?.registrations)
          ? remotePayload.registrations.map((item) => item.vcRecord).filter(Boolean)
          : [];
      const byCode = new Map();
      [...localItems, ...remoteItems]
        .map((item) => ({ recordType: item.recordType || "credential", ...item }))
        .forEach((item) => {
          byCode.set(String(item.code || "").toUpperCase(), item);
        });
      return Array.from(byCode.values());
    };
    const recordText = (record, viKey, enKey) => ({
      vi: record[viKey] || "",
      en: record[enKey] || record[viKey] || "",
    });
    const programLabel = (record) => copy(
      record.program || record.assetName || record.name || record.code || "",
      record.programEn || record.assetNameEn || record.program || record.assetName || record.name || record.code || ""
    );
    const summaryLabel = (record) => copy(
      record.summary || record.description || "",
      record.summaryEn || record.descriptionEn || record.summary || record.description || ""
    );
    const scopeLabel = (record) => copy(
      record.scope || "",
      record.scopeEn || record.scope || ""
    );
    const evidenceRows = (record) => {
      const base = Array.isArray(record.evidence) ? record.evidence : [];
      const alt = Array.isArray(record.evidenceEn) ? record.evidenceEn : [];
      return base.map((item, index) => '<li>' + localizedText(item, alt[index] || item) + '</li>').join("");
    };
    const renderRecord = (record) => {
      const program = programLabel(record);
      const summary = summaryLabel(record);
      const scope = scopeLabel(record);
      const ipfs = record.anchors?.ipfs || "";
      const proofUrl = record.anchors?.proofUrl || "";
      const registryUrl = record.anchors?.registry || location.href;
      const vcUrl = record.anchors?.vc || location.href;
      const originDomain = record.domain || "nft.iai.one";
      const originHref = /^https?:/i.test(originDomain) ? originDomain : "https://" + originDomain;
      const codeType = record.code + " · " + (typeLabel(record.recordType).vi);
      const codeTypeEn = record.code + " · " + (typeLabel(record.recordType).en);
      const extras = [];
      if (record.walletAddress) extras.push('<div class="body-copy mono">Wallet: ' + escapeHtml(record.walletAddress) + '</div>');
      if (record.contractAddress) extras.push('<div class="body-copy mono">Contract: ' + escapeHtml(record.contractAddress) + '</div>');
      if (record.tokenId) extras.push('<div class="body-copy mono">Token ID: ' + escapeHtml(record.tokenId) + '</div>');
      resultShell.innerHTML = [
        '<div class="cluster" style="justify-content:space-between;align-items:flex-start">',
        '<div><div class="badge ' + statusClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</div>' + localizedText(program.vi, program.en, 'h2', 'result-title') + '<div class="subtle mono">' + localizedText(codeType, codeTypeEn) + '</div></div>',
        '<button class="button ghost" type="button" data-copy="' + escapeHtml(record.anchors?.contentHash || "") + '" data-label-vi="Sao chép hash" data-label-en="Copy hash" data-success-vi="Đã chép" data-success-en="Copied" data-error-vi="Lỗi sao chép" data-error-en="Copy failed">' + localizedText("Sao chép hash", "Copy hash") + '</button>',
        '</div>',
        localizedText(summary.vi, summary.en, 'p', 'body-copy'),
        '<div class="grid-2">',
        '<article class="card"><div class="card-body stack">' + localizedText("Chủ thể nhận", "Recipient", "h3", "card-title") + localizedText(record.holder || record.walletAddress || "Unknown", record.holder || record.walletAddress || "Unknown", "div", "body-copy") + localizedText(scope.vi, scope.en, 'div', 'body-copy') + '</div></article>',
        '<article class="card"><div class="card-body stack">' + localizedText("Nguồn phát hành", "Issuing source", "h3", "card-title") + localizedText(record.issuer || "Registry độc lập", record.issuer || "Independent registry", "div", "body-copy") + '<div class="body-copy mono">' + escapeHtml(originDomain) + '</div><div class="body-copy mono">' + localizedText('Phát hành: ' + (record.issuedAt || ""), 'Issued: ' + (record.issuedAt || "")) + '</div></div></article>',
        '</div>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack">' + localizedText("Bằng chứng", "Evidence", "h3", "card-title") + '<ul class="list">' + evidenceRows(record) + '</ul></div></article>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack">' + localizedText("Anchors", "Anchors", "h3", "card-title") + '<div class="body-copy mono">Hash: ' + escapeHtml(record.anchors?.contentHash || "") + '</div>' + (ipfs ? '<div class="body-copy mono">IPFS: ' + escapeHtml(ipfs) + '</div>' : '') + (proofUrl ? '<div class="body-copy mono">Proof: ' + escapeHtml(proofUrl) + '</div>' : '') + '<div class="body-copy mono">Registry: ' + escapeHtml(registryUrl) + '</div>' + extras.join("") + '<div class="cluster"><a class="button primary" href="' + escapeHtml(originHref) + '" target="_blank" rel="noreferrer">' + localizedText("Mở domain gốc", "Open source domain") + '</a><a class="button ghost" href="' + escapeHtml(vcUrl) + '" target="_blank" rel="noreferrer">' + localizedText("Mở URL VC", "Open VC URL") + '</a><a class="button ghost" href="/?lang=' + currentLanguage() + '">' + localizedText("Tra mã khác", "Look up another code") + '</a></div></div></article>',
      ].join("");
      syncLanguage();
    };
    const normalizeLocalRegistryItems = (payload) => Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.certificates)
        ? payload.certificates
        : [];
    Promise.all([
      fetch("/api/certificates.json").then((response) => response.ok ? response.json() : { certificates: [] }).catch(() => ({ certificates: [] })),
      nftRegistryUrl
        ? fetch(nftRegistryUrl).then((response) => response.ok ? response.json() : { vcRecords: [] }).catch(() => ({ vcRecords: [] }))
        : Promise.resolve({ vcRecords: [] }),
    ])
      .then(([localPayload, remotePayload]) => {
        const code = pickCode();
        const localItems = normalizeLocalRegistryItems(localPayload);
        const items = mergeRecords(localItems, remotePayload);
        if (!code) {
          resultShell.innerHTML = [
            localizedText("Nhập mã để xác minh", "Enter a code to verify", "h2", "result-title"),
            localizedText("Mở đường dẫn dạng /v/VC-2026-0001 hoặc dùng form tra cứu ở trang chủ VC.", "Open a route like /v/VC-2026-0001 or use the lookup form on the VC home page.", "p", "body-copy"),
          ].join("");
          syncLanguage();
          return;
        }
        const record = items.find((item) => String(item.code || "").toUpperCase() === code);
        if (!record) {
          renderNotFound(code);
          return;
        }
        renderRecord(record);
      })
      .catch(() => {
        resultShell.innerHTML = [
          localizedText("Không tải được registry", "Unable to load the registry", "h2", "result-title"),
          localizedText("Kiểm tra lại file /api/certificates.json, NFT mirror runtime và rewrite /v/*.", "Check /api/certificates.json, the NFT runtime mirror, and the /v/* rewrite.", "p", "body-copy"),
        ].join("");
        syncLanguage();
      });
  `;

  return renderShell({
    currentKey: "vc",
    pathname: "/v/",
    canonicalUrl: `https://${domains.vc}/v/`,
    sourceOwner: `https://${domains.vc}/v/`,
    robots: "noindex,follow",
    title: pair("Tra cứu bản ghi VC", "VC Record Lookup"),
    description: pair(
      "Trang tra cứu chi tiết cho từng mã chứng nhận hoặc tài sản trên vc.vetuonglai.com.",
      "The detailed lookup page for every credential or asset record on vc.vetuonglai.com.",
    ),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [renderSection(pair("Kết quả tra cứu", "Lookup result"), pair("Chỉ hiển thị phần bằng chứng cần thiết cho việc xác minh", "Only the evidence required for verification is displayed"), shell)],
    inlineScript,
  });
}

function renderVcIssuerPage() {
  const hero = renderHero({
    eyebrow: pair("Issuing hub", "Issuing hub"),
    title: pair("Nguồn phát hành VC", "VC issuing sources"),
    description: pair(
      "Danh sách các domain có thể phát hành VC và trách nhiệm công bố proof.",
      "A directory of domains that may issue VC records and their disclosure responsibilities.",
    ),
    actions: [
      button(`https://${domains.vc}/`, pair("Về VC", "Back to VC")),
      button(`https://${domains.hub}/he-sinh-thai/`, pair("Xem hệ sinh thái", "View ecosystem"), "ghost"),
    ].join(""),
  });

  const issuerRows = [
    {
      key: "edu",
      domain: domains.edu,
      role: pair("Micro-credential hoc tap", "Learning micro-credentials"),
    },
    {
      key: "green",
      domain: domains.green,
      role: pair("Impact proof", "Impact proof"),
    },
    {
      key: "finance",
      domain: domains.finance,
      role: pair("Sprint certificate", "Sprint certificate"),
    },
    {
      key: "life",
      domain: domains.life,
      role: pair("Blueprint sống và nhật ký tiến trình", "Life blueprint and progress journal"),
    },
    {
      key: "invest",
      domain: domains.invest,
      role: pair("Blueprint due diligence", "Due diligence blueprint"),
    },
    {
      key: "work",
      domain: domains.work,
      role: pair("Work deliverables", "Work deliverables"),
    },
  ].map((row) => {
    const surface = resolveSurfacePublicMeta(row.key);
    return {
      ...row,
      status: surface.status,
      statusLabel: appStageLabel(surface),
    };
  });

  const issuerTable = renderTable(
    [pair("Domain", "Domain"), pair("Vai trò", "Role"), pair("Trạng thái", "Status")],
    issuerRows.map((row) => [
      `<span class=\"mono\">${escapeHtml(row.domain)}</span>`,
      localizedText(row.role),
      `<span class=\"badge ${surfaceBadgeClass(row.status)}\">${localizedText(row.statusLabel)}</span>`,
    ]),
  );

  return renderShell({
    currentKey: "vc",
    pathname: "/issuers/",
    title: pair("Nguồn phát hành VC", "VC issuing sources"),
    description: pair("Danh sách domain có thể phát hành VC và quy ước proof.", "A directory of VC issuing domains and proof expectations."),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [
      renderSection(pair("Danh sách nguồn phát hành", "Issuing directory"), pair("Phân định rõ nguồn phát hành và phạm vi proof", "Clear issuer ownership and proof scope"), issuerTable),
    ],
  });
}

function renderVcMethodsPage() {
  const hero = renderHero({
    eyebrow: pair("Phương pháp xác minh", "Verification methods"),
    title: pair("Cách VC xác minh", "How VC verification works"),
    description: pair(
      "VC không công bố thừa. Chỉ công bố anchor cần thiết để xác minh độc lập.",
      "VC does not overexpose data. Only anchors required for independent verification are published.",
    ),
    actions: [
      button(`https://${domains.vc}/`, pair("Về VC", "Back to VC")),
      button(`https://${domains.vc}/v/VC-2026-0001`, pair("Mở VC mẫu", "Open sample"), "ghost"),
    ].join(""),
  });

  const methods = renderCards([
    renderCard({
      title: cardTitle(pair("Anchor content", "Content anchors")),
      body: cardText(pair("Su dung content hash va metadata de doi chieu doc lap.", "Use content hashes and metadata for independent verification.")),
    }),
    renderCard({
      title: cardTitle(pair("Issuer boundary", "Issuer boundary")),
      body: cardText(pair("Moi ban ghi tro nguon phat hanh va pham vi cong bo ro rang.", "Every record points to its issuer and clear disclosure scope.")),
    }),
    renderCard({
      title: cardTitle(pair("Review status", "Review status")),
      body: cardText(pair("Trạng thái đang rà soát không đồng nghĩa đã xác minh.", "Reviewing status is not the same as verified.")),
    }),
  ]);

  return renderShell({
    currentKey: "vc",
    pathname: "/methods/",
    title: pair("Phương pháp xác minh", "Verification methods"),
    description: pair("Nguyên tắc và method để VC giữ trust layer độc lập.", "Principles and methods that keep VC an independent trust layer."),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [
      renderSection(pair("Phương pháp", "Methods"), pair("Ba lớp kiểm chứng", "Three verification layers"), methods),
    ],
  });
}

function renderMemberHome() {
  const deepCta = deepContentHubCta("member", "member-depth", "member-home");
  const annualOnlyCopy = team3PolicyMatrix?.integrationContracts?.team2Surfaces?.annualOnlyAffiliateDisabledCopy || {};
  const hero = renderHero({
    eyebrow: pair("Lớp thành viên", "Member layer"),
    title: pair("MEMBER<br><span class=\"accent\">hồ sơ, bước tiếp theo, bằng chứng</span>", "MEMBER<br><span class=\"accent\">profile, next steps, proof</span>"),
    description: pair(
      "Lớp thành viên giữ hồ sơ, quyền truy cập, tiến độ và bằng chứng trong cùng một điểm vào.",
      "The member layer keeps profile, access, progress, and proof in one shared entry point.",
    ),
    actions: [
      button(`https://${domains.hub}/thanh-vien/`, pair("Xem quyền lợi", "View membership")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-016"]),
  });

  const systemBlocks = renderCards([
    renderCard({
      title: cardTitle(pair("Hồ sơ", "Profile")),
      body: cardText(pair("Giữ hồ sơ, quyền truy cập và những mốc cá nhân trong một nơi để người dùng nhìn rõ mình đang ở đâu.", "Keeps profile, access, and personal milestones in one place so people can see where they are.")),
    }),
    renderCard({
      title: cardTitle(pair("Bước tiếp theo", "Next step")),
      body: cardText(pair("Hiển thị hướng đi tiếp theo theo trạng thái thật thay vì bắt người dùng tự đoán đường.", "Shows the next step from the real state instead of making people guess where to go next.")),
    }),
    renderCard({
      title: cardTitle(pair("Dấu mốc đóng góp", "Contribution milestones")),
      body: cardText(pair("Nối kết quả học, làm và đóng góp thành các dấu mốc có thể kiểm tra lại.", "Connects learning, work, and contribution into milestones that can be checked again.")),
    }),
  ]);

  const memberSurface = resolveSurfacePublicMeta("member");

  const annualOnlyDisclosureState = renderCards([
    renderCard({
      title: cardTitle(pair(annualOnlyCopy.headline || "Affiliate chưa mở ở gói năm cơ bản", "Affiliate is disabled in the annual-only layer")),
      badge: statusBadge("reviewing", pair("điều kiện mở", "activation rule")),
      body: cardText(pair(
        annualOnlyCopy.body || "Bạn cần gói năm, gói chuyên sâu phù hợp và bước rà soát cần thiết trước khi mở affiliate.",
        "Annual access, a qualifying pack, and a compliance review are required before activation.",
      )),
      support: `${renderDisclosureBlock("DPM-020", { compact: true })}${renderDisclosureBlock("DPM-021", { compact: true })}`,
      actions: `${button(`https://${domains.hub}/`, pair(annualOnlyCopy.ctaPrimary || "Xem điều kiện kích hoạt", "View activation requirements"), "ghost")} ${button(`https://${domains.hub}/#package-chooser`, pair(annualOnlyCopy.ctaSecondary || "Quay về homepage package chooser", "Back to homepage package chooser"), "ghost")}`,
    }),
  ]);

  const demoCards = renderCards([
    renderCard({
      title: cardTitle(pair("Điểm bắt đầu", "Starting point")),
      badge: statusBadge(surfaceBadgeClass(memberSurface.status), appStageLabel(memberSurface)),
      body: cardText(pair(
        "Lớp public của member hiện cho phép xem dashboard mẫu, hiểu quyền đang mở và biết bước đi tiếp phù hợp.",
        "The current public member layer lets people inspect a sample dashboard, understand the access they have, and see the right next step.",
      )),
      actions: button(`https://${domains.member}/journey/`, pair("Xem hành trình", "Open journey"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Bản mobile", "Mobile view")),
      badge: statusBadge(surfaceBadgeClass(memberSurface.status), appStageLabel(memberSurface)),
      body: cardText(pair(
        "Bản mobile tập trung vào đăng nhập, dashboard, xem nhanh EDU và mở nhanh VC. Nếu cần đi sâu hơn, người dùng luôn quay về hub.",
        "The mobile view focuses on sign-in, the dashboard, quick EDU views, and quick VC access. If deeper access is needed, users always return to the hub.",
      )),
      actions: button(`https://${domains.member}/app/`, pair("Mở bản mobile", "Open mobile view"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("4 trạng thái mở đường", "Four access states")),
      badge: statusBadge(surfaceBadgeClass(memberSurface.status), appStageLabel(memberSurface)),
      body: cardText(pair(
        "Hub, member app, xem nhanh EDU và mở nhanh VC cùng bám theo bốn trạng thái chung để bước tiếp theo không bị lệch.",
        "The hub, member app, quick EDU views, and quick VC access follow the same four shared states so the next step does not drift.",
      )),
      actions: button(`https://${domains.member}/api/mobile/session-states.json`, pair("Xem trạng thái", "Open state map"), "ghost"),
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "member",
    deepCta,
    notes: [
      pair("Mở quyền lợi thành viên, annual access hoặc pack từ một cổng duy nhất ở vetuonglai.com.", "Open membership, annual access, or packs from a single gateway at vetuonglai.com."),
      pair("Bản mobile và lớp public của member không có checkout riêng, cũng không có bước thanh toán riêng tại đây.", "The mobile view and the public member layer do not have a separate checkout or payment step here."),
    ],
    disclosureIds: ["DPM-016", "DPM-017", "DPM-020", "DPM-021"],
    secondaryActions: `${button(`https://${domains.member}/app/`, pair("Mở bản mobile", "Open mobile view"), "ghost")} ${button(`https://${domains.hub}/thanh-vien/`, pair("Xem quyền lợi", "View membership"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "member",
    extraItems: [
      pair("member.vetuonglai.com hiện là lớp public đang mở cho hồ sơ, hành trình và bước đi tiếp của thành viên.", "member.vetuonglai.com is now an open public layer for profile, journey, and the member next step."),
      pair("Quyền sâu hơn vẫn bám theo quyền truy cập thật và trạng thái thành viên hiện tại, không tự mở toàn bộ hệ.", "Deeper rights still follow the real access state and the current member state; they do not auto-open the full system."),
      pair("Affiliate vẫn bị khóa ở gói năm cơ bản cho đến khi đủ gói phù hợp và bước rà soát cần thiết.", "Affiliate remains locked in the annual-only layer until a qualifying pack and the required compliance review are both present."),
      pair("Mobile V1 chỉ hỗ trợ hành trình, không xử lý thanh toán trong ứng dụng.", "Mobile V1 supports the journey only and does not process payments inside the app."),
    ],
    disclosureIds: ["DPM-016", "DPM-017", "DPM-020", "DPM-021"],
    actions: `${button(`https://${domains.member}/app/`, pair("Vào bản mobile", "Open mobile view"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  return renderShell({
    currentKey: "member",
    pathname: "/",
    title: pair("Lớp thành viên", "Member layer"),
    description: pair("Hệ thống thành viên để giữ hồ sơ, quyền truy cập và bằng chứng trong một điểm vào.", "The member system that keeps profile, access, and proof in one entry point."),
    navItems: ecosystemNav("member"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("Member giữ hồ sơ, tiến độ và bằng chứng trong một điểm vào chung.", "Member keeps profile, progress, and proof in one shared entry surface."), systemBlocks, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các phần mở sẵn này đủ để hiểu dashboard, app mobile và khung 4 trạng thái trước khi đi sâu hơn.", "These open sections are enough to understand the dashboard, the mobile app, and the four-state model before going deeper."), demoCards, "demo"),
      gatewaySection,
      renderSection(pair("Điều kiện mở affiliate", "Affiliate rule"), pair("Affiliate ở gói năm cơ bản vẫn bị chặn cho đến khi đủ điều kiện rà soát.", "Affiliate in the annual-only layer remains blocked until compliance requirements are met."), annualOnlyDisclosureState),
      trustStatusSection,
    ],
  });
}

function renderMemberJourneyPage() {
  const deepCta = deepContentHubCta("member", "journey", "member-journey");
  const hero = renderHero({
    eyebrow: pair("Lộ trình thành viên", "Member journey"),
    title: pair("Hành trình cá nhân", "Personal journey"),
    description: pair(
      "Hành trình này nối học tập, công việc, bằng chứng và các bước phát triển thu nhập theo từng chặng.",
      "This journey connects learning, work, proof, and earning growth step by step.",
    ),
    actions: [
      button(`https://${domains.member}/`, pair("Về Member", "Back to member")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-017"]),
  });

  const stages = renderCards([
    renderCard({
      title: cardTitle(pair("Discover", "Discover")),
      body: cardText(pair("Xác định điểm xuất phát và mục tiêu gần.", "Define your starting point and near-term goal.")),
    }),
    renderCard({
      title: cardTitle(pair("Build", "Build")),
      body: cardText(pair("Học - làm - thử nghiệm với output rõ ràng.", "Learn, build, and practice with clear outputs.")),
    }),
    renderCard({
      title: cardTitle(pair("Prove", "Prove")),
      body: cardText(pair("Xác minh proof và cập nhật VC.", "Verify proof and update VC.")),
    }),
  ]);

  const kidsParentBridge = renderKidsParentBridgeBlock();

  return renderShell({
    currentKey: "member",
    pathname: "/journey/",
    title: pair("Hành trình thành viên", "Member journey"),
    description: pair("Lộ trình nối các lớp trong hệ thành viên từ học tới bằng chứng.", "The journey path linking member layers from learning to proof."),
    navItems: ecosystemNav("member"),
    hero,
    sections: [
      renderSection(pair("Các giai đoạn", "Stages"), pair("Hành trình từ học đến proof", "From learning to proof"), stages),
      renderSection(
        pair("Phụ huynh có trẻ em", "Parents with children"),
        pair("Hệ Kids cho trẻ em 6–17 nằm ở vùng riêng, có ranh giới bảo vệ trẻ.", "The Kids zone for ages 6–17 lives in an isolated, child-safe space."),
        kidsParentBridge,
        "kids-parent-bridge",
      ),
    ],
  });
}

function renderKidsParentBridgeBlock() {
  return `
    <article class="card" data-kids-parent-bridge>
      <div class="card-body stack">
        ${cardTitle(pair("Vùng Kids cho phụ huynh", "Kids zone for parents"))}
        ${cardText(pair(
          "Hệ Kids dành cho trẻ em 6–17 nằm ở subdomain riêng kids.vetuonglai.com — tách hẳn khỏi hệ chính, có ranh giới bảo vệ trẻ: phụ huynh đồng hành, không quảng cáo, không bảng xếp hạng, AI chỉ giải thích/gợi ý/sửa lỗi.",
          "The Kids zone for ages 6–17 lives on its own subdomain kids.vetuonglai.com — fully separated from the main ecosystem with child-safe limits: parent-mediated, ad-free, no leaderboards, AI restricted to explain/hint/correct.",
        ))}
        ${cardText(pair(
          "Khu vực này đang ở trạng thái Member Preview. Chỉ mở khi bạn xác nhận là phụ huynh hoặc người giám hộ.",
          "This area is in Member Preview. It only opens when you confirm you are a parent or legal guardian.",
        ))}
        <div class="cluster">
          <button type="button" class="button" data-kids-parent-confirm>
            ${escapeHtml("Tôi xác nhận là phụ huynh — mở vùng Kids")}
          </button>
        </div>
        <div data-kids-parent-revealed hidden>
          ${cardText(pair(
            "Bạn có thể bắt đầu từ bước Đồng ý phụ huynh.",
            "You can start at the Parent consent step.",
          ))}
          <div class="cluster">
            <a class="button" rel="nofollow noopener" target="_blank"
               href="https://${domains.kids}/parent/onboarding/consent/">
              ${escapeHtml("Mở Đồng ý phụ huynh")}
            </a>
          </div>
        </div>
      </div>
    </article>
    <script>
      (function () {
        var card = document.querySelector('[data-kids-parent-bridge]');
        if (!card) return;
        var btn = card.querySelector('[data-kids-parent-confirm]');
        var box = card.querySelector('[data-kids-parent-revealed]');
        if (!btn || !box) return;
        try {
          if (localStorage.getItem('vtl.kids.parentSelfAttest') === '1') {
            box.hidden = false;
            btn.disabled = true;
            btn.textContent = 'Đã xác nhận';
          }
        } catch (_) {}
        btn.addEventListener('click', function () {
          try { localStorage.setItem('vtl.kids.parentSelfAttest', '1'); } catch (_) {}
          box.hidden = false;
          btn.disabled = true;
          btn.textContent = 'Đã xác nhận';
        });
      })();
    </script>
  `;
}

function buildMemberMobileConfig() {
  return {
    version: accessModel.version,
    mode: "pwa_first_member_edu_core",
    paymentInAppEnabled: false,
    appShellPath: "/app/",
    install: {
      manifest: "/app/manifest.webmanifest",
      serviceWorker: "/app/sw.js",
      offlineFallback: "/app/offline/",
    },
    telemetry: {
      schemaVersion: "1.0",
      eventKeyPrefix: "mobile",
      requiredEvents: [
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
      ],
    },
    endpoints: {
      sessionCurrent: "/api/access/session/current",
      routingContract: "/api/access/routing-contract.json",
      contractsManifest: "/api/contracts.json",
      eduCatalog: "/api/mobile/edu-catalog.json",
      vcCertificates: "/api/mobile/vc-certificates.json",
      mobileStates: "/api/mobile/session-states.json",
      team3PolicyMatrix: "/api/team3-policy-matrix.json",
    },
    commercePolicy: {
      inAppCheckout: false,
      redirectToHub: `https://${domains.hub}/?entry=member&intent=specialist-pack&source=member-app`,
    },
  };
}

function buildMemberPwaManifest() {
  return {
    id: "/app/",
    name: "Vetuonglai Mobile",
    short_name: "VTL Mobile",
    description: "Member + EDU core mobile experience without in-app payment.",
    lang: "vi",
    start_url: "/app/?entry=member&source=pwa",
    scope: "/app/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7fbfa",
    theme_color: "#0f172a",
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/app/?screen=dashboard",
      },
      {
        name: "EDU",
        short_name: "EDU",
        url: "/app/?screen=edu",
      },
      {
        name: "VC Verify",
        short_name: "VC",
        url: "/app/?screen=vc",
      },
    ],
    icons: [
      {
        src: "/assets/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/assets/pwa-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

function renderPwaIconSvg({ label = "VTL", accent = "#0ea5e9", background = "#0f172a" } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${escapeHtml(label)} icon">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#7dd3fc"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="56" fill="${background}"/>
  <circle cx="128" cy="128" r="90" fill="url(#g)" opacity="0.22"/>
  <path d="M66 74h124v20H138v88h-20V94H66z" fill="#e2f2ff"/>
  <path d="M76 196h104v-18H98v-30h66v-18H98v-22h76V90H76z" fill="#bfe6ff"/>
  <text x="128" y="223" text-anchor="middle" fill="#dff4ff" font-family="Arial, sans-serif" font-size="18" letter-spacing="3">${escapeHtml(label)}</text>
</svg>
`;
}

function renderMemberAppServiceWorker() {
  return `const CACHE_KEY = "vtl-member-pwa-v1";
const PRECACHE_URLS = [
  "/app/",
  "/app/index.html",
  "/app/offline/",
  "/app/manifest.webmanifest",
  "/assets/style.css",
  "/assets/design-tokens.css",
  "/assets/app.js",
  "/assets/pwa-icon.svg",
  "/assets/pwa-maskable.svg",
  "/api/mobile-config.json",
  "/api/mobile/edu-catalog.json",
  "/api/mobile/vc-certificates.json",
  "/api/mobile/session-states.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_KEY);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_KEY).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_KEY);
    const isAppNavigation = event.request.mode === "navigate" && url.pathname.startsWith("/app");

    if (isAppNavigation) {
      try {
        const network = await fetch(event.request);
        cache.put(event.request, network.clone()).catch(() => {});
        return network;
      } catch {
        return (await cache.match("/app/offline/")) || (await cache.match("/app/index.html")) || Response.error();
      }
    }

    const cached = await cache.match(event.request);
    if (cached) return cached;

    try {
      const network = await fetch(event.request);
      if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/app/") || url.pathname.startsWith("/assets/")) {
        cache.put(event.request, network.clone()).catch(() => {});
      }
      return network;
    } catch {
      return cached || Response.error();
    }
  })());
});
`;
}

function renderMemberAppOfflinePage() {
  const hero = renderHero({
    eyebrow: pair("Offline mode", "Offline mode"),
    title: pair("Bạn đang offline", "You are offline"),
    description: pair(
      "Ứng dụng vẫn giữ shell và dữ liệu đã cache. Hãy kết nối lại để đồng bộ trạng thái và nội dung mới.",
      "The app shell and cached data remain available. Reconnect to sync status and fresh content.",
    ),
    actions: [
      button("/app/", pair("Thử lại", "Retry")),
      button(`https://${domains.hub}/`, pair("Về homepage", "Open homepage"), "ghost"),
    ].join(""),
  });

  return renderShell({
    currentKey: "member",
    pathname: "/app/offline/",
    title: pair("Offline • VTL Mobile", "Offline • VTL Mobile"),
    description: pair("Trang fallback khi mất mạng cho member app shell.", "Fallback page when network is unavailable for the member app shell."),
    navItems: ecosystemNav("member", [
      { key: "app", label: pair("App", "App"), href: "/app/" },
    ]),
    hero,
    sections: [
      renderSection(
        pair("Dữ liệu khả dụng", "Available data"),
        pair("Các API snapshot vẫn đọc được từ cache.", "Snapshot APIs stay readable from cache."),
      renderList([
        pair("Trạng thái gần nhất", "Latest status"),
        pair("Danh mục EDU snapshot", "EDU catalog snapshot"),
        pair("Ảnh chụp nhanh VC", "VC quick verify snapshot"),
      ]),
      ),
    ],
    headExtras: `
  <link rel="manifest" href="/app/manifest.webmanifest" />
  <meta name="theme-color" content="#0f172a" />
`,
    bodyClass: "mobile-app-shell",
  });
}

function renderMemberAppPage() {
  const commerceCta = `https://${domains.hub}/?entry=member&intent=specialist-pack&source=member-app`;
  const dashboardShell = `
    <div class="member-dashboard-shell" id="mobile-dashboard">
      <div class="member-dashboard-layout">
        <div class="member-dashboard-main">
          <article class="member-dashboard-surface">
            <div class="member-dashboard-meta-row">
              <span class="member-dashboard-chip" id="mobile-session-status-chip" data-text-vi="đang đồng bộ" data-text-en="syncing">đang đồng bộ</span>
              ${localizedText(
                pair(
                  "Không xử lý thanh toán trong app. Nếu cần lớp sâu hơn, app sẽ đưa bạn về hub.",
                  "No in-app payment. If deeper access is needed, the app routes you back to the hub.",
                ),
                "span",
                { class: "subtle" },
              )}
            </div>
            <div class="member-dashboard-status-grid">
              <div>
                ${localizedText(pair("Trạng thái tài khoản", "Account status"), "div", { class: "member-dashboard-kicker" })}
                <strong class="member-dashboard-value" id="mobile-session-status">loading...</strong>
                <p class="body-copy subtle" id="mobile-state-note" data-text-vi="Đang kiểm tra trạng thái tài khoản..." data-text-en="Checking account state...">Đang kiểm tra trạng thái tài khoản...</p>
              </div>
              <div>
                ${localizedText(pair("Pass đang dùng", "Current pass"), "div", { class: "member-dashboard-kicker" })}
                <strong class="member-dashboard-value" id="mobile-pass-plan">Future Access Pass</strong>
                <p class="body-copy subtle" id="mobile-route-note" data-text-vi="Đang đồng bộ đường đi tiếp..." data-text-en="Syncing the continuation path...">Đang đồng bộ đường đi tiếp...</p>
              </div>
            </div>
            <p class="body-copy subtle" id="mobile-affiliate-note" hidden></p>
            <ul id="mobile-state-contract" class="member-dashboard-list member-dashboard-list-compact"></ul>
          </article>

          <article class="member-dashboard-surface">
            ${localizedText(pair("Bạn đang ở đây, bước tiếp theo là…", "You are here, and the next step is…"), "div", { class: "member-dashboard-kicker" })}
            <h2 class="member-dashboard-title" id="mobile-next-step-title">Đang đồng bộ quyền truy cập</h2>
            <p class="body-copy" id="mobile-next-step-note" data-text-vi="Quick actions và CTA chính sẽ đổi theo trạng thái hiện tại của bạn." data-text-en="Quick actions and the primary CTA will adapt to your current status.">Quick actions và CTA chính sẽ đổi theo trạng thái hiện tại của bạn.</p>
            <div class="cluster member-dashboard-primary-actions">
              <a class="button" id="mobile-next-step-primary" href="#mobile-dashboard" data-mobile-action="next-step-primary">Đang đồng bộ...</a>
              <a class="button ghost" id="mobile-renew-link" href="${commerceCta}" data-mobile-action="renew-access" data-mobile-commerce-link="hub">Quản lý quyền truy cập</a>
            </div>
            <ul id="mobile-next-step-secondary" class="member-dashboard-list"></ul>
          </article>
        </div>

        <aside class="member-dashboard-rail">
          <article class="member-dashboard-surface">
            ${localizedText(pair("Quick actions", "Quick actions"), "div", { class: "member-dashboard-kicker" })}
            <div class="member-dashboard-action-stack">
              <a class="button ghost" href="/journey/" data-mobile-action="open-journey" data-mobile-requires-auth="true" data-domain-key="journey">${localizedText(pair("Mở journey", "Open journey"))}</a>
              <a class="button ghost" href="#mobile-edu-core" data-mobile-action="open-domain" data-mobile-requires-auth="true" data-domain-key="edu">${localizedText(pair("Mở EDU core", "Open EDU core"))}</a>
              <a class="button ghost" href="#mobile-vc-quick" data-mobile-action="open-domain" data-mobile-requires-auth="true" data-domain-key="vc">${localizedText(pair("Kiểm tra VC nhanh", "Quick VC verify"))}</a>
              <button class="button ghost" type="button" data-mobile-action="refresh-session">${localizedText(pair("Làm mới trạng thái", "Refresh status"))}</button>
            </div>
          </article>

          <article class="member-dashboard-surface member-dashboard-summary-preview">
            ${localizedText(pair("Đây là những gì bạn đã mở", "This is what you have unlocked"), "div", { class: "member-dashboard-kicker" })}
            <ul id="mobile-opened-summary" class="member-dashboard-list"></ul>
          </article>

          <article class="member-dashboard-surface member-dashboard-cta-surface" id="mobile-primary-cta-rail">
            ${localizedText(gatewayPrimaryCtaCopy, "div", { class: "member-dashboard-kicker" })}
            <p class="body-copy subtle" id="mobile-primary-cta-note" data-text-vi="App chỉ giữ shell, state và quick actions. Khi cần đi sâu hơn, hệ sẽ quay bạn về hub." data-text-en="The app keeps the shell, state, and quick actions. When deeper access is needed, the system routes you back to the hub.">App chỉ giữ shell, state và quick actions. Khi cần đi sâu hơn, hệ sẽ quay bạn về hub.</p>
            <a class="button" id="mobile-primary-cta" href="${commerceCta}" data-mobile-action="open-commerce-hub" data-mobile-commerce-link="hub">${localizedText(gatewayPrimaryCtaCopy)}</a>
          </article>

          <article class="member-dashboard-surface">
            ${localizedText(pair("Cài vào màn hình chính", "Add to home screen"), "div", { class: "member-dashboard-kicker" })}
            <p class="body-copy" id="mobile-install-hint" data-text-vi="Dùng menu trình duyệt để thêm app vào màn hình chính." data-text-en="Use your browser menu to add the app to your home screen.">Dùng menu trình duyệt để thêm app vào màn hình chính.</p>
            <button class="button ghost" type="button" data-mobile-action="install-app">${localizedText(pair("Xem cách cài", "Show install hint"))}</button>
          </article>
        </aside>
      </div>
    </div>
  `;

  const publicValueSection = `
    <div class="member-dashboard-public-grid">
      <article class="member-dashboard-surface">
        ${localizedText(pair("Đây là những gì bạn đã mở", "This is what you have unlocked"), "div", { class: "member-dashboard-kicker" })}
        <p class="body-copy subtle" data-text-vi="Unlock map luôn bám theo trạng thái tài khoản và quyền truy cập hiện có, không giả như đã mở thật." data-text-en="The unlock map always follows your current account status and access rights, and is never presented as already live.">Unlock map luôn bám theo trạng thái tài khoản và quyền truy cập hiện có, không giả như đã mở thật.</p>
        <ul id="mobile-opened-detail" class="member-dashboard-list"></ul>
      </article>
      <article class="member-dashboard-surface">
        ${localizedText(pair("Lộ trình đề xuất", "Recommended tracks"), "div", { class: "member-dashboard-kicker" })}
        <p class="body-copy subtle" id="mobile-recommendation-note" data-text-vi="Nếu chưa có gợi ý cá nhân, app sẽ giữ 3 lộ trình mặc định theo trạng thái hiện tại." data-text-en="If there is no personal recommendation yet, the app keeps 3 default tracks based on your current status.">Nếu chưa có gợi ý cá nhân, app sẽ giữ 3 lộ trình mặc định theo trạng thái hiện tại.</p>
        <ul id="mobile-recommendation-list" class="member-dashboard-list"></ul>
      </article>
    </div>
  `;

  const eduAndVc = `
    <div class="member-dashboard-demo-grid">
      <article class="member-dashboard-surface" id="mobile-edu-core">
        ${localizedText(pair("EDU core", "EDU core"), "h3", { class: "card-title" })}
        <p class="body-copy" data-text-vi="Danh sách khoá học snapshot cho mobile shell. Không có checkout trong app." data-text-en="Snapshot course list for the mobile shell. There is no in-app checkout.">Danh sách khoá học snapshot cho mobile shell. Không có checkout trong app.</p>
        <ul id="mobile-edu-list" class="member-dashboard-list"></ul>
      </article>
      <article class="member-dashboard-surface" id="mobile-vc-quick">
        ${localizedText(pair("Kiểm tra VC nhanh", "VC quick verify"), "h3", { class: "card-title" })}
        <p class="body-copy" data-text-vi="Mở nhanh các record xác minh gần nhất để kiểm tra proof." data-text-en="Quick open the latest verification records to inspect proof.">Mở nhanh các record xác minh gần nhất để kiểm tra proof.</p>
        <ul id="mobile-vc-list" class="member-dashboard-list"></ul>
      </article>
    </div>
  `;

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "member",
    deepCta: commerceCta,
    notes: [
      pair("CTA trong app chỉ làm một việc: đưa người dùng về homepage hub với đúng điểm vào.", "CTAs inside the app do one thing only: take people back to the homepage hub through the right entry point."),
      pair("Không có form checkout, không có chọn cổng thanh toán và không có luồng mở quyền ngay trong app shell này.", "There is no checkout form, no gateway selection, and no unlock flow inside this app shell."),
    ],
    disclosureIds: ["DPM-016", "DPM-017"],
    secondaryActions: button(`https://${domains.member}/journey/`, pair("Mở journey", "Open journey"), "ghost"),
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "member",
    extraItems: [
      pair("App shell chỉ hỗ trợ 4 trạng thái cốt lõi: visitor, pending_member, annual_active, pack_owner.", "The app shell supports only four core states: visitor, pending_member, annual_active, and pack_owner."),
      pair("Khi offline, app giữ shell và snapshot nhưng không tự mở quyền khi chưa có dữ liệu xác nhận.", "When offline, the app keeps the shell and snapshots but never opens extra access without confirmation."),
      pair("Nếu trạng thái chưa mở đủ quyền, app chỉ hiển thị hướng dẫn và CTA về hub thay vì tạo một luồng mua trong app không có thật.", "If the state does not open enough access, the app shows guidance and a CTA back to the hub instead of creating a fake in-app purchase flow."),
    ],
    disclosureIds: ["DPM-016", "DPM-017", "DPM-020", "DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.member}/api/mobile-config.json`, pair("Xem mobile config", "Open mobile config"), "ghost")}`,
  });

  const inlineScript = `
(() => {
  const boot = () => {
    const byId = (id) => document.getElementById(id);
    const setMemberState = typeof window.vetuonglaiSetMemberState === "function"
      ? window.vetuonglaiSetMemberState
      : () => "unknown";
    const getMemberState = typeof window.vetuonglaiCurrentMemberState === "function"
      ? window.vetuonglaiCurrentMemberState
      : () => "unknown";
    const currentLanguage = typeof window.vetuonglaiCurrentLanguage === "function"
      ? window.vetuonglaiCurrentLanguage
      : () => "vi";
    const localizedCopy = (vi, en) => (currentLanguage() === "en" ? en : vi);
    const screenKey = "member_app_home";
    const endpointConfig = {
      mobileConfig: "/api/mobile-config.json",
      sessionCurrent: "/api/access/session/current",
      eduCatalog: "/api/mobile/edu-catalog.json",
      vcCertificates: "/api/mobile/vc-certificates.json",
      mobileStates: "/api/mobile/session-states.json",
      routingContract: "/api/access/routing-contract.json",
      team3PolicyMatrix: "/api/team3-policy-matrix.json",
    };
    const commercePolicy = {
      redirectToHub: "${commerceCta}",
    };
    const sessionStateCatalog = new Map();
    let annualOnlyAffiliateCopy = null;
    let stateContractPayload = null;
    let routeContractPayload = null;
    let eduSnapshotCache = null;
    let vcSnapshotCache = null;

    const hasCoreAccess = (memberState) => !["visitor", "offline", "loading", "unknown"].includes(memberState);
    const telemetry = (event, payload = {}) => {
      const tracker = typeof window.vetuonglaiTrack === "function" ? window.vetuonglaiTrack : null;
      const enrichedPayload = {
        timestamp: new Date().toISOString(),
        route: window.location.pathname + window.location.search,
        screen: screenKey,
        language: currentLanguage(),
        member_state: getMemberState(),
        ...payload,
      };

      if (!enrichedPayload.member_state || enrichedPayload.member_state === "unknown") {
        delete enrichedPayload.member_state;
      }

      if (tracker) {
        tracker(event, enrichedPayload);
        return;
      }
      try {
        const key = "vetuonglai.telemetry.fallback";
        const current = JSON.parse(window.localStorage.getItem(key) || "[]");
        current.push({ event, payload: enrichedPayload, at: enrichedPayload.timestamp });
        window.localStorage.setItem(key, JSON.stringify(current.slice(-120)));
      } catch {}
    };

    async function readJson(url, options = {}) {
      const response = await fetch(url, options);
      const payload = await response.json().catch(() => ({}));
      return { response, payload };
    }

    const copy = (vi, en) => ({ vi, en });
    const toText = (value) => (currentLanguage() === "en" ? value.en : value.vi);

    function syncCommerceLinks() {
      document.querySelectorAll("[data-mobile-commerce-link='hub']").forEach((node) => {
        if (node instanceof HTMLAnchorElement) {
          node.href = commercePolicy.redirectToHub;
        }
      });
    }

    function setChipText(id, value) {
      const node = byId(id);
      if (!node) return;
      node.textContent = value;
    }

    function getOpenedItems(memberState) {
      switch (memberState) {
        case "visitor":
          return [
            {
              title: copy("App shell + offline snapshot", "App shell + offline snapshot"),
              note: copy("Bạn thấy được shell, config và các lớp demo đã cache.", "You can see the shell, config, and the cached demo layers."),
            },
            {
              title: copy("Gateway về hub", "Gateway back to the hub"),
              note: copy("Mọi bước mở sâu hơn đều quay về hub, không checkout trong app.", "Every deeper-access step returns to the hub, with no in-app checkout."),
            },
            {
              title: copy("EDU + VC preview", "EDU + VC preview"),
              note: copy("Bạn xem được giá trị lớp EDU core và VC quick verify trước khi đăng nhập.", "You can inspect the EDU core and VC quick verify value before signing in."),
            },
          ];
        case "pending_member":
          return [
            {
              title: copy("Provision đang chờ hoàn tất", "Provision is still pending"),
              note: copy("App giữ trạng thái đang kích hoạt cho tới khi hệ thống xác nhận quyền.", "The app stays in the activation-pending state until the system confirms access."),
            },
            {
              title: copy("Retry safe", "Retry-safe flow"),
              note: copy("Bạn có thể làm mới trạng thái mà không mất mạch sử dụng hay rơi vào luồng gây hiểu nhầm.", "You can refresh status without losing context or falling into a misleading flow."),
            },
            {
              title: copy("Gateway xử lý access", "Gateway handles access"),
              note: copy("Nếu cần kiểm tra tiếp, app sẽ đưa bạn về hub đúng entry point.", "When more checking is needed, the app routes you back to the hub through the correct entry point."),
            },
          ];
        case "annual_active":
          return [
            {
              title: copy("Journey cá nhân", "Personal journey"),
              note: copy("Đường đi tiếp của bạn mở ngay từ /journey/ theo state thật.", "Your continuation path opens straight from /journey/ using the real state."),
            },
            {
              title: copy("EDU core", "EDU core"),
              note: copy("Danh sách khoá học snapshot sẵn sàng trên mobile shell.", "The course snapshot list is available on the mobile shell."),
            },
            {
              title: copy("VC quick verify", "VC quick verify"),
              note: copy("Bạn có thể mở record xác minh nhanh để check proof.", "You can open quick verification records to inspect proof."),
            },
          ];
        case "pack_owner":
          return [
            {
              title: copy("Journey cá nhân", "Personal journey"),
              note: copy("Journey vẫn là điểm bắt đầu ổn định cho các bước core.", "Journey remains the stable starting point for core steps."),
            },
            {
              title: copy("EDU core + VC quick verify", "EDU core + VC quick verify"),
              note: copy("Hai lớp core vẫn mở trực tiếp từ app shell theo state thật.", "The two core layers remain available directly from the app shell under the real state."),
            },
            {
              title: copy("Gateway cho specialist packs", "Gateway for specialist packs"),
              note: copy("Pack chuyên sâu vẫn mở từ hub để giữ một điểm mua duy nhất.", "Specialist packs still open from the hub to preserve one purchase point."),
            },
          ];
        case "offline":
          return [
            {
              title: copy("Shell đã cache", "Cached shell"),
              note: copy("App shell và offline fallback vẫn dùng được khi mất mạng.", "The app shell and offline fallback remain usable while offline."),
            },
            {
              title: copy("EDU + VC snapshot gần nhất", "Latest EDU + VC snapshots"),
              note: copy("Bạn vẫn thấy dữ liệu đã cache thay vì một UI rỗng.", "You still see cached data instead of a blank UI."),
            },
            {
              title: copy("Không mở quyền giả", "No fake access"),
              note: copy("App không tự mở lớp sâu khi chưa nhận lại trạng thái tài khoản.", "The app never opens deeper layers until account status returns."),
            },
          ];
        case "loading":
        case "unknown":
        default:
          return [
            {
              title: copy("Đang đồng bộ state", "Syncing state"),
              note: copy("App đang đọc trạng thái tài khoản để tránh hiển thị sai quyền truy cập.", "The app is reading account status to avoid showing the wrong access."),
            },
            {
              title: copy("Quick actions chờ state", "Quick actions wait for state"),
              note: copy("Các action nhạy cảm chỉ bật khi hệ thống xác nhận quyền.", "Sensitive actions only turn on after the system confirms access."),
            },
            {
              title: copy("Gateway vẫn ổn định", "Gateway remains stable"),
              note: copy("Nếu cần lớp sâu hơn, hub vẫn là điểm quay về chuẩn.", "When deeper access is needed, the hub remains the standard return point."),
            },
          ];
      }
    }

    function getRecommendationItems(memberState) {
      switch (memberState) {
        case "visitor":
          return [
            {
              label: copy("Mở toàn bộ hệ của bạn", "Open your full system"),
              note: copy("Quay về hub đúng entry point để tiếp tục đăng nhập hoặc chọn layer phù hợp.", "Return to the hub through the right entry point to continue signing in or choosing the right layer."),
              href: commercePolicy.redirectToHub,
              action: "open-commerce-hub",
              commerceLink: "hub",
            },
            {
              label: copy("Xem EDU core snapshot", "Review the EDU core snapshot"),
              note: copy("Xem cách layer học hoạt động trước khi state member được mở.", "Review how the learning layer works before the member state is unlocked."),
              href: "#mobile-edu-core",
              action: "open-domain",
              domainKey: "edu",
            },
            {
              label: copy("Xem VC quick verify", "Review VC quick verify"),
              note: copy("Hiểu cách proof được đọc trên mobile shell mà không cần checkout.", "Understand how proof is read on the mobile shell without any checkout."),
              href: "#mobile-vc-quick",
              action: "open-domain",
              domainKey: "vc",
            },
          ];
        case "pending_member":
          return [
            {
              label: copy("Kiểm tra kích hoạt trên hub", "Check activation on the hub"),
              note: copy("Nếu thanh toán đang chờ xử lý, hub là nơi tiếp tục đúng lộ trình.", "If payment is still pending, the hub is where the flow continues correctly."),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            {
              label: copy("Làm mới trạng thái", "Refresh status"),
              note: copy("Giữ app ở màn đầu và thử đồng bộ lại quyền truy cập.", "Stay on the first screen and retry the access sync."),
              href: "#mobile-dashboard",
              action: "refresh-session",
            },
            {
              label: copy("Đọc EDU core snapshot", "Read the EDU core snapshot"),
              note: copy("Bạn có thể xem snapshot trong lúc chờ hệ thống xác nhận quyền.", "You can review the snapshot while waiting for the system to confirm access."),
              href: "#mobile-edu-core",
              action: "open-domain",
              domainKey: "edu",
            },
          ];
        case "annual_active":
          return [
            {
              label: copy("Tiếp tục journey cá nhân", "Continue your personal journey"),
              note: copy("Đây là bước có giá trị cao nhất ngay sau khi access core hoạt động.", "This is the highest-value action right after core access becomes active."),
              href: "/journey/",
              action: "open-journey",
              domainKey: "journey",
              requiresAuth: true,
            },
            {
              label: copy("Mở EDU core", "Open EDU core"),
              note: copy("Tiếp tục lớp học từ snapshot ngay trong app shell.", "Continue the learning layer directly from the app shell snapshot."),
              href: "#mobile-edu-core",
              action: "open-domain",
              domainKey: "edu",
              requiresAuth: true,
            },
            {
              label: copy("Kiểm tra VC nhanh", "Open VC quick verify"),
              note: copy("Kiểm tra proof nhanh trước khi đi vào bước sâu hơn.", "Check proof quickly before moving into deeper steps."),
              href: "#mobile-vc-quick",
              action: "open-domain",
              domainKey: "vc",
              requiresAuth: true,
            },
          ];
        case "pack_owner":
          return [
            {
              label: copy("Mở toàn bộ hệ của bạn", "Open your full system"),
              note: copy("Pack chuyên sâu và các bước mở rộng vẫn đi từ hub để giữ một lộ trình mua duy nhất.", "Specialist packs and deeper expansion continue from the hub to preserve one purchase path."),
              href: commercePolicy.redirectToHub,
              action: "open-commerce-hub",
              commerceLink: "hub",
            },
            {
              label: copy("Tiếp tục journey cá nhân", "Continue your personal journey"),
              note: copy("Giữ nhịp core từ app rồi mới nhảy sang layer sâu hơn khi cần.", "Keep the core momentum in the app before jumping to deeper layers when needed."),
              href: "/journey/",
              action: "open-journey",
              domainKey: "journey",
              requiresAuth: true,
            },
            {
              label: copy("Kiểm tra VC nhanh", "Open VC quick verify"),
              note: copy("Proof vẫn là điểm đọc nhanh nhất trước khi sang specialist layer.", "Proof remains the fastest read before entering a specialist layer."),
              href: "#mobile-vc-quick",
              action: "open-domain",
              domainKey: "vc",
              requiresAuth: true,
            },
          ];
        case "offline":
          return [
            {
              label: copy("Thử đồng bộ lại", "Try syncing again"),
              note: copy("Khi mạng quay lại, app sẽ đọc lại trạng thái tài khoản và cập nhật quyền.", "Once the network returns, the app will reread account status and refresh access."),
              href: "#mobile-dashboard",
              action: "refresh-session",
            },
            {
              label: copy("Mở EDU snapshot đã cache", "Open the cached EDU snapshot"),
              note: copy("Bạn vẫn có thể đọc snapshot để không bị mất nhịp.", "You can still read the snapshot so you do not lose momentum."),
              href: "#mobile-edu-core",
              action: "open-domain",
              domainKey: "edu",
            },
            {
              label: copy("Quay về hub khi online", "Return to the hub once online"),
              note: copy("Các bước sâu hơn chỉ tiếp tục khi kết nối đã ổn định.", "Deeper steps only continue once the connection is stable again."),
              href: commercePolicy.redirectToHub,
              action: "open-commerce-hub",
              commerceLink: "hub",
            },
          ];
        case "loading":
        case "unknown":
        default:
          return [
            {
              label: copy("Giữ app ở màn đầu", "Stay on the first screen"),
              note: copy("Quick actions sẽ bật ngay khi hệ thống trả lại trạng thái mới.", "Quick actions will turn on as soon as the system returns an updated status."),
              href: "#mobile-dashboard",
              action: "refresh-session",
            },
            {
              label: copy("Đọc EDU snapshot", "Read the EDU snapshot"),
              note: copy("Bạn vẫn xem được layer công khai trong lúc chờ đồng bộ.", "You can still review the public layer while the sync is running."),
              href: "#mobile-edu-core",
              action: "open-domain",
              domainKey: "edu",
            },
            {
              label: copy("Mở gateway trên hub", "Open the gateway on the hub"),
              note: copy("Hub luôn là nơi tiếp tục các bước sâu hơn nếu bạn cần rời app shell.", "The hub remains the correct place for deeper steps if you need to leave the app shell."),
              href: commercePolicy.redirectToHub,
              action: "open-commerce-hub",
              commerceLink: "hub",
            },
          ];
      }
    }

    function getStateView(memberState) {
      switch (memberState) {
        case "visitor":
          return {
            chip: copy("visitor", "visitor"),
            plan: copy("Future Access Pass", "Future Access Pass"),
            nextTitle: copy("Đăng nhập để mở hành trình của bạn", "Sign in to open your journey"),
            nextNote: copy(
              "Bạn đang ở lớp app shell công khai. Khi trạng thái tài khoản quay lại, app sẽ hiển thị bước tiếp theo phù hợp.",
              "You are on the public app shell. Once account status returns, the app shows the right next step.",
            ),
            nextPrimary: {
              label: copy("Mở toàn bộ hệ của bạn", "Open your full system"),
              href: commercePolicy.redirectToHub,
              action: "next-step-primary",
              commerceLink: "hub",
            },
            renew: {
              label: copy("Xem gateway trên hub", "View the gateway on the hub"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "Bạn chưa mở lớp member sâu hơn ở trạng thái visitor. Nếu cần đi tiếp, hub là điểm tiếp tục đúng.",
              "Deeper member access is not open in visitor mode. When you need to continue, the hub is the right point.",
            ),
            secondary: [
              copy("Review EDU core snapshot bên dưới để hiểu lớp học sẽ mở ra sao.", "Review the EDU core snapshot below to understand how the learning layer opens."),
              copy("VC quick verify vẫn đọc được như một demo giá trị công khai, chưa phải luồng mở sâu.", "VC quick verify remains readable as a public-value demo, not a deeper-unlock flow."),
            ],
          };
        case "pending_member":
          return {
            chip: copy("đang kích hoạt", "activating"),
            plan: copy("Future Access Pass • pending activation", "Future Access Pass • pending activation"),
            nextTitle: copy("Payment đã ghi nhận, hệ đang kích hoạt quyền", "Payment is recorded and the system is activating access"),
            nextNote: copy(
              "Bạn chưa rơi vào luồng giả như đã mở thật. App giữ quick actions an toàn, cho retry và đưa bạn về hub khi cần kiểm tra sâu hơn.",
              "You are not dropped into a flow that looks already live. The app keeps quick actions safe, allows retries, and routes you back to the hub when deeper checks are needed.",
            ),
            nextPrimary: {
              label: copy("Kiểm tra kích hoạt trên hub", "Check activation on the hub"),
              href: commercePolicy.redirectToHub,
              action: "next-step-primary",
              commerceLink: "hub",
            },
            renew: {
              label: copy("Làm mới quyền truy cập", "Refresh access"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "App giữ trạng thái pending và không tạo checkout giả. Hub là nơi tiếp tục khi cần xác minh access.",
              "The app keeps the pending state and never creates a fake checkout. The hub is where the flow continues when access needs verification.",
            ),
            secondary: [
              copy("Giữ app ở màn đầu và dùng nút làm mới trạng thái để đọc lại quyền truy cập.", "Stay on the first screen and use refresh status to reread access."),
              copy("Nếu trạng thái chưa đổi, mở hub đúng entry point để tiếp tục flow.", "If the state has not changed yet, open the hub through the correct entry point to continue."),
            ],
          };
        case "annual_active":
          return {
            chip: copy("annual", "annual"),
            plan: copy("Future Access Pass • annual core", "Future Access Pass • annual core"),
            nextTitle: copy("Bắt đầu hành trình của bạn", "Start your journey"),
            nextNote: copy(
              "Bạn đã có core access. First screen giữ quick actions, domain demo và CTA mở rộng mà không nhồi một luồng mua trong app.",
              "You already have core access. The first screen keeps quick actions, domain demos, and an expansion CTA without forcing any in-app purchase flow.",
            ),
            nextPrimary: {
              label: copy("Mở journey của bạn", "Open your journey"),
              href: "/journey/",
              action: "next-step-primary",
              domainKey: "journey",
              requiresAuth: true,
            },
            renew: {
              label: copy("Quản lý quyền truy cập", "Manage access"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "Bạn đã có core access. Hub chỉ dùng cho layer sâu hơn và quản lý access, không phải checkout trong app.",
              "You already have core access. The hub is only for deeper layers and access management, not for any in-app checkout.",
            ),
            secondary: [
              copy("EDU core và VC quick verify nằm ngay dưới như hai action giá trị cao nhất trên mobile.", "EDU core and VC quick verify sit directly below as the two highest-value actions on mobile."),
              copy("Nếu cần specialist layer, gateway CTA sẽ đưa bạn về hub với đúng context.", "If you need a specialist layer, the gateway CTA routes you back to the hub with the correct context."),
            ],
          };
        case "pack_owner":
          return {
            chip: copy("specialist", "specialist"),
            plan: copy("Future Access Pass + specialist pack", "Future Access Pass + specialist pack"),
            nextTitle: copy("Bạn đã mở core và specialist layer", "You have both core and specialist layers open"),
            nextNote: copy(
              "App giữ nhịp thao tác hàng ngày. Khi cần domain sâu hơn hoặc pack context, hệ sẽ quay bạn về hub thay vì dựng thêm một flow giả trong app.",
              "The app keeps the day-to-day operating rhythm. When you need deeper domain access or pack context, the system routes you back to the hub instead of building a fake flow in-app.",
            ),
            nextPrimary: {
              label: copy("Mở toàn bộ hệ của bạn", "Open your full system"),
              href: commercePolicy.redirectToHub,
              action: "next-step-primary",
              commerceLink: "hub",
            },
            renew: {
              label: copy("Quản lý quyền truy cập", "Manage access"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "Pack chuyên sâu và các bước mở rộng vẫn được giữ ở hub để đảm bảo một điểm mua duy nhất.",
              "Specialist packs and deeper expansion remain on the hub to preserve one purchase point.",
            ),
            secondary: [
              copy("Journey, EDU core và VC quick verify vẫn là ba nhịp thao tác nhanh nhất trong app shell.", "Journey, EDU core, and VC quick verify remain the three fastest operating beats inside the app shell."),
              copy("Gateway CTA chỉ làm một việc: quay bạn về hub với đúng entry point.", "The gateway CTA does exactly one thing: route you back to the hub through the correct entry point."),
            ],
          };
        case "offline":
          return {
            chip: copy("offline", "offline"),
            plan: copy("Cached app shell", "Cached app shell"),
            nextTitle: copy("Thiết bị đang offline", "Your device is offline"),
            nextNote: copy(
              "App giữ shell và snapshot đã cache. Khi có mạng lại, bạn có thể làm mới trạng thái để lấy đúng bước tiếp theo.",
              "The app keeps the shell and cached snapshots. Once the network returns, you can refresh status to get the correct next step.",
            ),
            nextPrimary: {
              label: copy("Thử đồng bộ lại", "Try syncing again"),
              href: "#mobile-dashboard",
              action: "refresh-session",
            },
            renew: {
              label: copy("Mở hub khi online", "Open the hub once online"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "Hub vẫn là điểm tiếp tục chuẩn cho lớp sâu hơn, nhưng chỉ khi kết nối quay lại và trạng thái đã được cập nhật.",
              "The hub remains the correct continuation point for deeper layers, but only after connection returns and status is updated.",
            ),
            secondary: [
              copy("Bạn vẫn có thể đọc snapshot EDU và VC đã cache để không mất nhịp.", "You can still read the cached EDU and VC snapshots so you do not lose momentum."),
              copy("App không tự đoán trạng thái member khi thiết bị đang offline.", "The app never guesses your member state while the device is offline."),
            ],
          };
        case "loading":
        case "unknown":
        default:
          return {
            chip: copy("syncing", "syncing"),
            plan: copy("Đang đọc quyền truy cập", "Reading access"),
            nextTitle: copy("Đang đồng bộ quyền truy cập", "Syncing access"),
            nextNote: copy(
              "First screen giữ skeleton, quick actions an toàn và CTA về hub trong lúc hệ thống cập nhật trạng thái.",
              "The first screen keeps the skeleton, safe quick actions, and the hub CTA while the system updates your status.",
            ),
            nextPrimary: {
              label: copy("Giữ app ở màn đầu", "Stay on the first screen"),
              href: "#mobile-dashboard",
              action: "refresh-session",
            },
            renew: {
              label: copy("Mở gateway trên hub", "Open the gateway on the hub"),
              href: commercePolicy.redirectToHub,
              action: "renew-access",
              commerceLink: "hub",
            },
            primaryCtaNote: copy(
              "Quick actions sẽ bật ngay khi hệ thống xác nhận trạng thái. App không suy diễn quyền truy cập trước khi có dữ liệu.",
              "Quick actions will turn on as soon as the system confirms your status. The app never infers access before data arrives.",
            ),
            secondary: [
              copy("Bạn vẫn có thể xem các layer demo bên dưới trong lúc chờ đồng bộ.", "You can still review the demo layers below while the sync runs."),
              copy("Nếu cần layer sâu hơn ngay lúc này, gateway CTA sẽ đưa bạn về hub.", "If you need a deeper layer right now, the gateway CTA routes you back to the hub."),
            ],
          };
      }
    }

    function renderStateContract() {
      const list = byId("mobile-state-contract");
      if (!list) return;
      list.innerHTML = "";
      sessionStateCatalog.clear();

      const focusStates = new Set(["visitor", "pending_member", "annual_active", "pack_owner"]);
      const states = Array.isArray(stateContractPayload?.identityStates)
        ? stateContractPayload.identityStates.filter((state) => focusStates.has(String(state.key || "")))
        : [];

      if (states.length === 0) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Trạng thái quyền truy cập sẽ hiện ở đây khi dữ liệu phiên được tải xong.", "Access state details will appear here when session data has loaded.");
        list.appendChild(li);
        return;
      }

      states.forEach((state) => {
        sessionStateCatalog.set(state.key, state);
        const publicStateName = {
          visitor: copy("Visitor", "Visitor"),
          pending_member: copy("Đang kích hoạt", "Pending activation"),
          annual_active: copy("Annual Access", "Annual Access"),
          pack_owner: copy("Specialist Access", "Specialist Access"),
        };
        const publicStateNote = {
          visitor: copy("Xem lớp công khai, app mobile và ví dụ EDU/VC trước khi đăng nhập.", "View the public layer, the mobile app, and EDU/VC examples before signing in."),
          pending_member: copy("Hệ đang kích hoạt quyền. App giữ bước tiếp theo an toàn và cho phép làm mới trạng thái.", "The system is activating access. The app keeps the next step safe and lets you refresh status."),
          annual_active: copy("Mở journey, EDU core và VC quick verify từ cùng một khung mobile.", "Opens journey, EDU core, and quick VC verify from the same mobile frame."),
          pack_owner: copy("Giữ core access trong app và quay về hub khi cần lớp chuyên sâu hơn.", "Keeps core access in the app and returns to the hub when a deeper specialist layer is needed."),
        };
        const li = document.createElement("li");
        const stateLabel = toText(publicStateName[state.key] || copy(state.label, state.label));
        const stateNote = toText(publicStateNote[state.key] || copy("Giữ đúng quyền truy cập theo trạng thái hiện tại.", "Keeps access aligned with your current status."));
        li.textContent = stateLabel + ": " + stateNote;
        list.appendChild(li);
      });
    }

    function renderRouteNote() {
      const note = byId("mobile-route-note");
      if (!note) return;

      const routeContract = routeContractPayload?.routeContract || routeContractPayload || {};
      const hubDomain = routeContract.purchaseHub?.domain || "vetuonglai.com";
      const pendingFallback = routeContract.returnFlow?.failureFallbackRoutes?.paymentPendingTimeout || "https://member.vetuonglai.com/unlock/";

      note.textContent = localizedCopy(
        "CTA mở sâu hơn trong app luôn quay về " + hubDomain + "; không có checkout trong app. Nếu thanh toán đang chờ, app sẽ đưa bạn về " + pendingFallback + ".",
        "Deeper-access CTAs inside the app always return to " + hubDomain + "; there is no in-app checkout. If payment is still pending, the app routes you to " + pendingFallback + ".",
      );
    }

    function renderAffiliateNote(memberState) {
      const note = byId("mobile-affiliate-note");
      if (!note) return;

      if (memberState === "annual_active") {
        note.hidden = false;
        note.textContent = currentLanguage() === "en"
          ? "Affiliate stays disabled in the annual-only layer. You need annual access, a qualifying pack, and a compliance review before activation."
          : ((annualOnlyAffiliateCopy?.headline || "Affiliate chưa mở ở gói năm cơ bản") + ". " + (annualOnlyAffiliateCopy?.body || "Bạn cần annual access, gói phù hợp và bước rà soát cần thiết trước khi mở affiliate."));
        return;
      }

      if (memberState === "pack_owner") {
        note.hidden = false;
        note.textContent = localizedCopy(
          "Bạn đã có pack chuyên sâu. Affiliate vẫn cần bước rà soát cần thiết trước khi kích hoạt.",
          "You already own a specialist pack. Affiliate still requires a compliance review before activation.",
        );
        return;
      }

      note.hidden = true;
      note.textContent = "";
    }

    function renderStateNote(memberState) {
      const note = byId("mobile-state-note");
      if (!note) return;

      const messages = {
        loading: localizedCopy("Đang kiểm tra trạng thái tài khoản...", "Checking account state..."),
        visitor: localizedCopy("Bạn đang ở chế độ visitor. Đăng nhập để mở đầy đủ EDU và hành trình cá nhân.", "You are in visitor mode. Sign in to unlock full EDU and personalized journey."),
        pending_member: localizedCopy("Tài khoản đang ở giai đoạn kích hoạt. Một số tính năng đang chờ mở quyền.", "Your account is still activating. Some features are waiting for access to open."),
        annual_active: localizedCopy("Annual access đang hoạt động. Bạn có thể tiếp tục hành trình học.", "Annual access is active. You can continue your learning journey."),
        pack_owner: localizedCopy("Bạn đã sở hữu pack chuyên sâu. Truy cập nội dung chuyên sâu từ homepage hub.", "You own specialist packs. Access deep content from the homepage hub."),
        offline: localizedCopy("Thiết bị đang offline. App hiển thị dữ liệu snapshot gần nhất.", "Device is offline. The app shows latest available snapshots."),
        unknown: localizedCopy("Đang đồng bộ trạng thái tài khoản.", "Syncing account state."),
      };

      note.textContent = messages[memberState] || messages.unknown;
      renderAffiliateNote(memberState);
    }

    function renderSimpleList(listId, items) {
      const list = byId(listId);
      if (!list) return;
      list.innerHTML = "";

      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "member-dashboard-item";

        const title = document.createElement("strong");
        title.className = "member-dashboard-item-title";
        title.textContent = toText(item.title);

        const note = document.createElement("span");
        note.className = "subtle";
        note.textContent = toText(item.note);

        li.appendChild(title);
        li.appendChild(note);
        list.appendChild(li);
      });
    }

    function setLinkConfig(node, config) {
      if (!(node instanceof HTMLAnchorElement)) return;
      node.textContent = toText(config.label);
      node.href = config.href || "#mobile-dashboard";
      node.setAttribute("data-mobile-action", config.action || "open-domain");
      if (config.requiresAuth) {
        node.setAttribute("data-mobile-requires-auth", "true");
      } else {
        node.removeAttribute("data-mobile-requires-auth");
      }
      if (config.domainKey) {
        node.setAttribute("data-domain-key", config.domainKey);
      } else {
        node.removeAttribute("data-domain-key");
      }
      if (config.commerceLink === "hub") {
        node.setAttribute("data-mobile-commerce-link", "hub");
      } else {
        node.removeAttribute("data-mobile-commerce-link");
      }
    }

    function renderNextStep(memberState) {
      const view = getStateView(memberState);
      const title = byId("mobile-next-step-title");
      const note = byId("mobile-next-step-note");
      const list = byId("mobile-next-step-secondary");
      const plan = byId("mobile-pass-plan");
      const primary = byId("mobile-next-step-primary");
      const renew = byId("mobile-renew-link");
      const primaryCtaNote = byId("mobile-primary-cta-note");

      if (title) title.textContent = toText(view.nextTitle);
      if (note) note.textContent = toText(view.nextNote);
      if (plan) plan.textContent = toText(view.plan);
      if (primaryCtaNote) primaryCtaNote.textContent = toText(view.primaryCtaNote);
      if (primary) setLinkConfig(primary, view.nextPrimary);
      if (renew) setLinkConfig(renew, view.renew);

      if (list) {
        list.innerHTML = "";
        view.secondary.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = toText(item);
          list.appendChild(li);
        });
      }
    }

    function renderRecommendations(memberState) {
      const list = byId("mobile-recommendation-list");
      if (!list) return;
      list.innerHTML = "";

      const items = getRecommendationItems(memberState);
      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "member-dashboard-item";

        const link = document.createElement("a");
        link.className = "member-dashboard-link";
        link.textContent = toText(item.label);
        link.href = item.href || "#mobile-dashboard";
        link.setAttribute("data-mobile-action", item.action || "open-domain");

        if (item.requiresAuth) {
          link.setAttribute("data-mobile-requires-auth", "true");
        }
        if (item.domainKey) {
          link.setAttribute("data-domain-key", item.domainKey);
        }
        if (item.commerceLink === "hub") {
          link.setAttribute("data-mobile-commerce-link", "hub");
        }

        const note = document.createElement("span");
        note.className = "subtle";
        note.textContent = toText(item.note);

        li.appendChild(link);
        li.appendChild(note);
        list.appendChild(li);
      });
    }

    function renderDashboard(memberState) {
      const view = getStateView(memberState);
      const statusEl = byId("mobile-session-status");
      if (statusEl) {
        statusEl.textContent = memberState;
      }
      setChipText("mobile-session-status-chip", toText(view.chip));
      renderStateNote(memberState);
      renderRouteNote();
      renderNextStep(memberState);
      renderSimpleList("mobile-opened-summary", getOpenedItems(memberState));
      renderSimpleList("mobile-opened-detail", getOpenedItems(memberState));
      renderRecommendations(memberState);
    }

    function applyAuthGate(memberState) {
      const enabled = hasCoreAccess(memberState);
      document.querySelectorAll("[data-mobile-requires-auth='true']").forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.classList.toggle("is-disabled", !enabled);
        node.setAttribute("aria-disabled", enabled ? "false" : "true");
        if (node.tagName === "A") {
          if (enabled) {
            node.removeAttribute("tabindex");
          } else {
            node.setAttribute("tabindex", "-1");
          }
        }
      });
    }

    async function loadMobileConfig() {
      try {
        const { response, payload } = await readJson(endpointConfig.mobileConfig);
        if (response.ok && payload && typeof payload === "object") {
          const endpointEntries = Object.entries(payload.endpoints || {});
          endpointEntries.forEach(([key, value]) => {
            if (typeof value === "string" && value) {
              endpointConfig[key] = value;
            }
          });
          if (typeof payload.commercePolicy?.redirectToHub === "string" && payload.commercePolicy.redirectToHub) {
            commercePolicy.redirectToHub = payload.commercePolicy.redirectToHub;
          }
        }
      } catch {}
      syncCommerceLinks();
    }

    async function loadStateContract() {
      try {
        const { response, payload } = await readJson(endpointConfig.mobileStates);
        if (!response.ok) return;
        stateContractPayload = payload;
        renderStateContract();
      } catch {}
    }

    async function loadRouteContract() {
      try {
        const { response, payload } = await readJson(endpointConfig.routingContract);
        if (!response.ok) return;
        routeContractPayload = payload;
        renderRouteNote();
      } catch {}
    }

    async function loadPolicyContract() {
      try {
        const { response, payload } = await readJson(endpointConfig.team3PolicyMatrix);
        if (!response.ok) return;
        annualOnlyAffiliateCopy = payload?.integrationContracts?.team2Surfaces?.annualOnlyAffiliateDisabledCopy || null;
        renderAffiliateNote(getMemberState());
      } catch {}
    }

    async function loadContracts() {
      await loadMobileConfig();
      await Promise.allSettled([
        loadStateContract(),
        loadRouteContract(),
        loadPolicyContract(),
      ]);
    }

    async function loadSession() {
      setMemberState("loading");
      renderDashboard("loading");
      applyAuthGate("loading");
      try {
        const { response, payload } = await readJson(endpointConfig.sessionCurrent, { credentials: "include" });
        if (!response.ok || !payload.authenticated) {
          setMemberState("visitor");
          renderDashboard("visitor");
          applyAuthGate("visitor");
          return "visitor";
        }
        const memberState = payload.member_state || "annual_active";
        setMemberState(memberState);
        renderDashboard(memberState);
        applyAuthGate(memberState);
        telemetry("mobile_login_success", { member_state: memberState, source: "member_app" });
        return memberState;
      } catch {
        setMemberState("offline");
        renderDashboard("offline");
        applyAuthGate("offline");
        return "offline";
      }
    }

    function renderEduList() {
      const list = byId("mobile-edu-list");
      if (!list) return;
      list.innerHTML = "";
      const memberState = getMemberState();

      if (!hasCoreAccess(memberState)) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Đăng nhập để mở EDU core trên app mobile.", "Sign in to unlock EDU core on the mobile app.");
        list.appendChild(li);
        return;
      }

      if (eduSnapshotCache === null) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Đang tải EDU snapshot...", "Loading the EDU snapshot...");
        list.appendChild(li);
        return;
      }

      if (!Array.isArray(eduSnapshotCache)) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("EDU snapshot chưa sẵn sàng. Bạn có thể làm mới trạng thái hoặc quay về hub.", "The EDU snapshot is not ready yet. You can refresh status or return to the hub.");
        list.appendChild(li);
        return;
      }

      const rows = eduSnapshotCache.slice(0, 4);
      if (rows.length === 0) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Chưa có khoá học phù hợp trong snapshot này.", "There are no courses in this snapshot yet.");
        list.appendChild(li);
        return;
      }

      rows.forEach((course) => {
        const courseSlug = String(course.slug || "unknown");
        const courseTitle = String(course.title || course.slug || "EDU");
        const li = document.createElement("li");
        li.className = "member-dashboard-item";

        const row = document.createElement("div");
        row.className = "member-dashboard-inline-actions";

        const link = document.createElement("a");
        link.href = course.learnUrl || "#";
        link.textContent = courseTitle;
        link.className = "member-dashboard-link";
        link.setAttribute("data-mobile-action", "edu-lesson-start");
        link.setAttribute("data-course-slug", courseSlug);
        link.setAttribute("data-course-title", courseTitle);

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.className = "button ghost";
        completeButton.textContent = localizedCopy("Đánh dấu hoàn tất", "Mark complete");
        completeButton.setAttribute("data-mobile-action", "edu-lesson-complete");
        completeButton.setAttribute("data-course-slug", courseSlug);
        completeButton.setAttribute("data-course-title", courseTitle);

        row.appendChild(link);
        row.appendChild(completeButton);
        li.appendChild(row);
        list.appendChild(li);
      });
    }

    async function loadEdu() {
      try {
        const { response, payload } = await readJson(endpointConfig.eduCatalog);
        if (!response.ok) throw new Error("edu unavailable");
        eduSnapshotCache = Array.isArray(payload.courses) ? payload.courses : [];
      } catch {
        eduSnapshotCache = false;
      }
      renderEduList();
    }

    function renderVcList() {
      const list = byId("mobile-vc-list");
      if (!list) return;
      list.innerHTML = "";
      const memberState = getMemberState();

      if (!hasCoreAccess(memberState)) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Đăng nhập để mở kiểm tra VC nhanh trên app mobile.", "Sign in to unlock quick VC checks on the mobile app.");
        list.appendChild(li);
        return;
      }

      if (vcSnapshotCache === null) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Đang tải VC snapshot...", "Loading the VC snapshot...");
        list.appendChild(li);
        return;
      }

      if (!Array.isArray(vcSnapshotCache)) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("VC snapshot chưa sẵn sàng. Bạn có thể làm mới trạng thái hoặc quay về hub.", "The VC snapshot is not ready yet. You can refresh status or return to the hub.");
        list.appendChild(li);
        return;
      }

      const rows = vcSnapshotCache.slice(0, 4);
      if (rows.length === 0) {
        const li = document.createElement("li");
        li.textContent = localizedCopy("Chưa có record VC phù hợp trong snapshot này.", "There are no VC records in this snapshot yet.");
        list.appendChild(li);
        return;
      }

      rows.forEach((record) => {
        const verifyCode = String(record.code || "VC");
        const li = document.createElement("li");
        li.className = "member-dashboard-item";

        const link = document.createElement("a");
        link.href = record.verifyUrl || "#";
        link.textContent = verifyCode;
        link.className = "member-dashboard-link mono";
        link.setAttribute("data-mobile-action", "vc-verify-open");
        link.setAttribute("data-vc-code", verifyCode);

        const note = document.createElement("span");
        note.className = "subtle";
        note.textContent = localizedCopy("Mở nhanh record xác minh gần nhất để kiểm tra proof.", "Quick open the latest verification record to inspect proof.");

        li.appendChild(link);
        li.appendChild(note);
        list.appendChild(li);
      });
    }

    async function loadVc() {
      try {
        const { response, payload } = await readJson(endpointConfig.vcCertificates);
        if (!response.ok) throw new Error("vc unavailable");
        vcSnapshotCache = Array.isArray(payload.certificates) ? payload.certificates : [];
      } catch {
        vcSnapshotCache = false;
      }
      renderVcList();
    }

    async function refreshSessionAndData() {
      const memberState = await loadSession();
      if (window.__VTL_DASHBOARD_OPEN_TRACKED !== true) {
        window.__VTL_DASHBOARD_OPEN_TRACKED = true;
        telemetry("dashboard_open", { member_state: memberState, source: "member_app" });
      }
      await Promise.all([
        loadEdu(),
        loadVc(),
      ]);
    }

    function bindActions() {
      document.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[data-mobile-action]") : null;
        if (!(target instanceof HTMLElement)) return;

        const action = target.getAttribute("data-mobile-action") || "unknown";
        if (action === "refresh-session") {
          event.preventDefault();
          refreshSessionAndData().catch(() => {});
          return;
        }
        if (action === "install-app") {
          const installHint = byId("mobile-install-hint");
          if (installHint) {
            installHint.textContent = localizedCopy(
              "iPhone: Share > Add to Home Screen. Android: menu trình duyệt > Install app.",
              "iPhone: Share > Add to Home Screen. Android: browser menu > Install app.",
            );
          }
          telemetry("mobile_action", { action, member_state: getMemberState() });
          return;
        }
        if (action === "next-step-primary") {
          telemetry("dashboard_next_step_click", {
            source: "member_app",
            domain_key: target.getAttribute("data-domain-key") || undefined,
            commerce_target: target.getAttribute("data-mobile-commerce-link") || undefined,
          });
          if (target.getAttribute("data-mobile-commerce-link") === "hub") {
            telemetry("dashboard_pack_view_click", {
              source: "member_app",
              entry: "next_step",
            });
            return;
          }
          const domainKey = target.getAttribute("data-domain-key");
          if (domainKey) {
            telemetry("dashboard_domain_open_click", {
              source: "member_app",
              domain_key: domainKey,
            });
          }
          return;
        }
        if (action === "open-journey" || action === "open-domain") {
          telemetry("dashboard_domain_open_click", {
            source: "member_app",
            domain_key: target.getAttribute("data-domain-key") || "unknown",
          });
          return;
        }
        if (action === "open-commerce-hub") {
          telemetry("dashboard_pack_view_click", {
            source: "member_app",
            entry: "primary_cta",
          });
          return;
        }
        if (action === "renew-access") {
          telemetry("dashboard_renew_click", {
            source: "member_app",
          });
          return;
        }
        if (action === "edu-lesson-start") {
          telemetry("mobile_edu_lesson_start", {
            source: "member_app",
            course_slug: target.getAttribute("data-course-slug") || "unknown",
            course_title: target.getAttribute("data-course-title") || "EDU",
          });
          return;
        }
        if (action === "edu-lesson-complete") {
          telemetry("mobile_edu_lesson_complete", {
            source: "member_app",
            course_slug: target.getAttribute("data-course-slug") || "unknown",
            course_title: target.getAttribute("data-course-title") || "EDU",
          });
          return;
        }
        if (action === "vc-verify-open") {
          telemetry("mobile_vc_verify_open", {
            source: "member_app",
            vc_code: target.getAttribute("data-vc-code") || "unknown",
          });
          return;
        }
        telemetry("mobile_action", { action, member_state: getMemberState() });
      });
    }

    async function registerSw() {
      if (!("serviceWorker" in navigator)) return;
      try {
        await navigator.serviceWorker.register("/app/sw.js", { scope: "/app/" });
      } catch {}
    }

    if (window.__VTL_MOBILE_APP_OPEN_TRACKED !== true) {
      window.__VTL_MOBILE_APP_OPEN_TRACKED = true;
      telemetry("mobile_app_open", { screen: "member_app_home", source: "member_app" });
    }
    setMemberState("unknown");
    renderDashboard("unknown");
    applyAuthGate("unknown");
    syncCommerceLinks();
    loadContracts()
      .catch(() => {})
      .finally(() => {
        refreshSessionAndData().catch(() => {});
      });
    bindActions();
    registerSw().catch(() => {});
    window.addEventListener("vetuonglai:languagechange", () => {
      renderStateContract();
      renderDashboard(getMemberState());
      renderEduList();
      renderVcList();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
    return;
  }
  boot();
})();
`;

  return renderShell({
    currentKey: "member",
    pathname: "/app/",
    title: pair("VTL Mobile App", "VTL Mobile App"),
    description: pair("Ứng dụng mobile nhẹ cho member + EDU core, ưu tiên mở nhanh hành trình và không thanh toán trong app.", "A lightweight mobile app for member + EDU core that opens the journey quickly and avoids in-app payments."),
    navItems: ecosystemNav("member", [
      { key: "app", label: pair("App", "App"), href: "/app/" },
      { key: "member", label: pair("Member", "Member"), href: "/" },
      { key: "journey", label: pair("Journey", "Journey"), href: "/journey/" },
    ]),
    sections: [
      renderSection(
        pair("Trạng thái & bước tiếp theo", "Status & next step"),
        pair("Pass, thao tác nhanh và CTA chính đều nằm ngay ở màn đầu của bản mobile này.", "The pass, quick actions, and main CTA all stay on the first screen of this mobile view."),
        dashboardShell,
        "hook",
      ),
      renderSection(
        pair("Đây là những gì bạn đã mở", "This is what you have unlocked"),
        pair("Giá trị công khai ở đây luôn bám theo quyền truy cập thật và không dựng cảm giác đã mở hơn thực tế.", "Public value here always follows the real access state and never creates a more-open impression than reality supports."),
        publicValueSection,
        "public-value",
      ),
      renderSection(
        pair("Demo", "Demo"),
        pair("Xem nhanh EDU và mở nhanh VC cho thấy giá trị cốt lõi mà không đẩy người dùng vào bước thanh toán trong app.", "Quick EDU views and quick VC access show the core value without pushing people into an in-app payment step."),
        eduAndVc,
        "demo",
      ),
      gatewaySection,
      trustStatusSection,
    ],
    inlineScript,
    headExtras: `
  <link rel="manifest" href="/app/manifest.webmanifest" />
  <meta name="theme-color" content="#0f172a" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="VTL Mobile" />
  <link rel="icon" href="/assets/pwa-icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/assets/pwa-icon.svg" />
`,
    bodyClass: "mobile-app-shell",
  });
}

function renderWorkHome() {
  const deepCta = deepContentHubCta("work", "job-apply", "work-home");
  const workSurface = resolveSurfacePublicMeta("work");
  const hero = renderHero({
    eyebrow: pair("WORK công khai", "WORK public"),
    title: pair("WORK<br><span class=\"accent\">proof trước, apply sau</span>", "WORK<br><span class=\"accent\">proof first, apply later</span>"),
    description: pair(
      "Bạn có kỹ năng nhưng người đối diện chưa thấy đủ bằng chứng để chọn bạn. WORK mở lớp công khai với brief mẫu và hướng đi tiếp rõ ràng trước khi mở các cơ hội sâu hơn.",
      "You may have skills, but people still do not see enough proof to choose you. WORK opens a public layer with sample briefs and a clear next step before deeper opportunities are opened.",
    ),
    actions: [
      gatewayCtaButton(deepCta, "primary"),
      button(`https://${domains.work}/brief/`, pair("Xem brief mẫu", "Open sample brief"), "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-008"]),
  });

  const pillars = renderCards([
    renderCard({
      title: cardTitle(pair("Đầu ra rõ ràng", "Clear deliverables")),
      body: cardText(pair("Đăng việc yêu cầu output rõ ràng trước khi nộp.", "Roles require clear outputs before applying.")),
    }),
    renderCard({
      title: cardTitle(pair("Bằng chứng trước", "Proof first")),
      body: cardText(pair("VC là điều kiện cho những cơ hội cần độ tin cậy cao.", "VC is required for opportunities that need a higher level of trust.")),
    }),
    renderCard({
      title: cardTitle(pair("Phù hợp sứ mệnh", "Mission fit")),
      body: cardText(pair("Không nhận dự án làm sai triết lý hệ.", "No projects that violate ecosystem principles.")),
    }),
  ]);

  const demoCards = renderCards([
    renderCard({
      title: cardTitle(pair("Demo brief 01", "Demo brief 01")),
      badge: statusBadge(surfaceBadgeClass(workSurface.status), appStageLabel(workSurface)),
      body: cardText(pair(
        "Audit nội dung 7 ngày: cần 3 deliverable rõ, 1 checklist proof, 1 vòng review có tiêu chí.",
        "Seven-day content audit: needs 3 clear deliverables, 1 proof checklist, and 1 criteria-based review loop.",
      )),
      actions: button(`https://${domains.work}/brief/`, pair("Mở brief mẫu", "Open sample brief"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Demo brief 02", "Demo brief 02")),
      badge: statusBadge(surfaceBadgeClass(workSurface.status), appStageLabel(workSurface)),
      body: cardText(pair(
        "Bản demo này chỉ hiển thị phạm vi, đầu ra mong đợi và bằng chứng cần có; chưa mở ứng tuyển trực tiếp.",
        "This demo shows the scope, expected output, and required proof without opening direct applications.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Demo brief 03", "Demo brief 03")),
      badge: statusBadge(surfaceBadgeClass(workSurface.status), appStageLabel(workSurface)),
      body: cardText(pair(
        "Bản demo này giúp người xem hiểu cách một brief được viết, không biến trang thành một job board giả.",
        "This demo helps viewers understand how a brief is written without turning the page into a fake job board.",
      )),
      actions: button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "work",
    deepCta,
    notes: [
      pair("Hub là điểm đi tiếp chung cho các bước sâu hơn liên quan tới WORK, không phải chính trang WORK này.", "The hub is the shared continuation point for deeper WORK steps, not this WORK page itself."),
      pair("Các bước nhạy cảm như ứng tuyển thật hoặc mở gói chuyên sâu đều đi qua hub.", "Sensitive steps such as real applications or pack access all go through the hub."),
    ],
    disclosureIds: ["DPM-008", "DPM-021"],
    secondaryActions: `${button(`https://${domains.work}/brief/`, pair("Xem brief mẫu", "Open sample brief"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "work",
    extraItems: [
      pair("WORK hiện ở trạng thái Planned. Trang này chưa phải job board đang hoạt động và chưa nhận ứng tuyển trực tiếp.", "WORK is currently in Planned status. This page is not a live job board and it does not accept direct applications."),
      pair("Mọi ngân sách, mốc thời gian hoặc đầu ra xuất hiện ở đây phải được đọc như brief mẫu, không phải tin đang mở.", "Any budget, timing, or output shown here must be read as a sample brief, not an active listing."),
      pair("Ranh giới bằng chứng luôn được nói rõ trước khi nhắc tới đường tạo thu nhập.", "The proof boundary is made clear before any earning path is mentioned."),
    ],
    disclosureIds: ["DPM-008", "DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.work}/brief/`, pair("Mở brief mẫu", "Open sample brief"), "ghost")}`,
  });

  return renderShell({
    currentKey: "work",
    pathname: "/",
    title: pair("WORK mission", "WORK mission"),
    description: pair(
      "WORK là lớp công khai ở trạng thái Planned để mở brief mẫu, khung bằng chứng và đường đi tiếp về hub.",
      "WORK is a public layer in Planned status for sample briefs, proof framing, and a clear path back to the hub.",
    ),
    navItems: ecosystemNav("work"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("WORK giúp người xem hiểu logic proof-first trước khi có bất kỳ action sâu nào.", "WORK helps people understand the proof-first logic before any deeper action exists."), pillars, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các brief mẫu này cho thấy cách WORK sẽ mở cơ hội mà không giả vờ là đã có tin đang hoạt động.", "These sample briefs show how WORK will open opportunities without pretending an active listing already exists."), demoCards, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderWorkBriefPage() {
  const deepCta = deepContentHubCta("work", "brief", "work-brief");
  const hero = renderHero({
    eyebrow: pair("Work brief", "Work brief"),
    title: pair("Brief tuyển chọn", "Work brief"),
    description: pair(
      "Mô tả phạm vi công việc, proof cần có, và kênh xác minh.",
      "Describe scope, required proof, and verification channels.",
    ),
    actions: [
      button(`https://${domains.work}/`, pair("Về WORK", "Back to WORK")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-009"]),
  });

  const checklist = renderList([
    pair("Mô tả rõ output và tiêu chí đánh giá.", "Define output and evaluation criteria."),
    pair("Yêu cầu VC nếu công việc cần trust.", "Require VC for trust-sensitive work."),
    pair("Nếu chưa có proof, gom data cho pilot.", "If no proof yet, collect data for pilot."),
  ]);

  return renderShell({
    currentKey: "work",
    pathname: "/brief/",
    title: pair("Work brief", "Work brief"),
    description: pair("Template brief cho việc có output và proof.", "Work brief template for outputs and proof."),
    navItems: ecosystemNav("work"),
    hero,
    sections: [
      renderSection(pair("Checklist", "Checklist"), pair("Những mục cần có", "Required items"), checklist),
    ],
  });
}

function renderMarketHome() {
  const deepCta = deepContentHubCta("market", "market-buy", "market-home");
  const marketSurface = resolveSurfacePublicMeta("market");
  const hero = renderHero({
    eyebrow: pair("MARKET công khai", "MARKET public"),
    title: pair("MARKET<br><span class=\"accent\">tài sản mẫu trước, giao dịch sau</span>", "MARKET<br><span class=\"accent\">sample assets first, commerce later</span>"),
    description: pair(
      "MARKET hiện mở các mẫu công khai để giải thích tài sản số, cách người tạo trình bày và quy tắc tin cậy. Nó chưa được trình bày như một khu chợ đã vận hành.",
      "MARKET currently opens public samples to explain digital assets, creator presentation, and trust rules. It is not presented as an already operating marketplace.",
    ),
    actions: [
      gatewayCtaButton(deepCta, "primary"),
      button(`https://${domains.market}/rules/`, pair("Xem rule sample", "Open rule sample"), "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-010"]),
  });

  const rules = renderCards([
    renderCard({
      title: cardTitle(pair("Cổng tin cậy", "Trust gate")),
      body: cardText(pair("Yêu cầu VC cho giao dịch nhạy cảm.", "Require VC for trust-sensitive deals.")),
    }),
    renderCard({
      title: cardTitle(pair("Công khai phạm vi", "Scope disclosure")),
      body: cardText(pair("Công bố phạm vi công việc và bài toán cần giải.", "Disclose scope and problem statements.")),
    }),
    renderCard({
      title: cardTitle(pair("Không thổi phồng", "No hype")),
      body: cardText(pair("Không tạo FOMO, không đưa chỉ tiêu thu nhập ảo.", "No FOMO or fake income promises.")),
    }),
  ]);

  const demoCards = renderCards([
    renderCard({
      title: cardTitle(pair("Sample asset 01", "Sample asset 01")),
      badge: statusBadge(surfaceBadgeClass(marketSurface.status), appStageLabel(marketSurface)),
      body: cardText(pair(
        "Bộ mẫu CV + hóa đơn: lớp công khai chỉ cho xem cách trình bày, ghi chú tin cậy và ranh giới của người tạo; chưa mở mua trực tiếp tại trang này.",
        "CV + invoice sample set: the public layer shows framing, trust notes, and creator boundaries without opening direct purchase on this page.",
      )),
      actions: button(`https://${domains.market}/rules/`, pair("Xem rule", "Open rules"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Xem trước gian trưng bày", "creator storefront preview")),
      badge: statusBadge(surfaceBadgeClass(marketSurface.status), appStageLabel(marketSurface)),
      body: cardText(pair(
        "Bản xem trước này chỉ cho thấy cách asset, proof và disclosure nằm cùng nhau. Nó không phải cửa hàng đang mở.",
        "The storefront preview exists to show how assets, proof, and disclosures fit together. It is not a live store.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Luồng giao dịch cần trust", "Trust-sensitive flow")),
      badge: statusBadge(surfaceBadgeClass(marketSurface.status), appStageLabel(marketSurface)),
      body: cardText(pair(
        "Nếu người dùng muốn đi sâu hơn tới giao dịch, hệ sẽ đưa họ về hub để giữ cùng một điểm vào.",
        "If people want to move into a deeper transaction, the system returns them to the hub to keep one shared entry point.",
      )),
      actions: button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "market",
    deepCta,
    notes: [
      pair("Hub giữ một điểm đi tiếp thống nhất cho gói truy cập, quyền năm và các bước sâu hơn liên quan tới MARKET.", "The hub keeps one consistent continuation point for packs, annual access, and deeper MARKET steps."),
      pair("MARKET hiện chỉ mở tài sản mẫu và cách đọc mức độ tin cậy ở lớp public.", "MARKET currently opens only sample assets and a trust-reading layer in public."),
    ],
    disclosureIds: ["DPM-010", "DPM-011", "DPM-021"],
    secondaryActions: `${button(`https://${domains.market}/rules/`, pair("Xem rules", "Open rules"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "market",
    extraItems: [
      pair("MARKET đang ở trạng thái Planned. Không có gian hàng đang hoạt động, không có giỏ hàng và không có bước thanh toán riêng tại đây.", "MARKET is currently in Planned status. There is no active storefront, no cart, and no separate payment step here."),
      pair("Tài sản mẫu chỉ dùng để giải thích cấu trúc, bằng chứng của người tạo và ranh giới disclosure.", "Sample assets are used only to explain structure, creator proof, and disclosure boundaries."),
      pair("Mọi mô tả về giao dịch, doanh thu hay thu nhập của người tạo đều phải được gắn nhãn mẫu hoặc đưa người dùng quay về hub.", "Any description of transactions, revenue, or creator earnings must be labeled as sample content or routed back to the hub."),
    ],
    disclosureIds: ["DPM-010", "DPM-011", "DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.market}/rules/`, pair("Mở rules", "Open rules"), "ghost")}`,
  });

  return renderShell({
    currentKey: "market",
    pathname: "/",
    title: pair("MARKET pilot", "MARKET pilot"),
    description: pair(
      "MARKET là lớp công khai ở trạng thái Planned cho tài sản mẫu, xem trước gian trưng bày và cách đọc mức độ tin cậy trước khi giao dịch hoạt động.",
      "MARKET is a public layer in Planned status for sample assets, storefront previews, and trust framing before commerce goes live.",
    ),
    navItems: ecosystemNav("market"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("MARKET giải thích vì sao giao dịch cần bằng chứng, disclosure và trust boundary trước khi nói tới mua bán.", "MARKET explains why commerce needs proof, disclosures, and trust boundaries before talking about transactions."), rules, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các preview này cho thấy cấu trúc và cách đọc mức độ tin cậy mà không giả vờ phần giao dịch đã mở.", "These previews show structure and trust framing without pretending that live commerce already exists."), demoCards, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderMarketRulesPage() {
  const deepCta = deepContentHubCta("market", "market-rules", "market-rules");
  const hero = renderHero({
    eyebrow: pair("Market rules", "Market rules"),
    title: pair("Quy ước giao dịch", "Transaction rules"),
    description: pair(
      "Quy ước minh bạch và chống lời hứa ảo.",
      "Transparency rules that prevent fake promises.",
    ),
    actions: [
      button(`https://${domains.market}/`, pair("Về Market", "Back to Market")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-011"]),
  });

  const rules = renderList([
    pair("Hiển thị phạm vi deliverable và budget rõ ràng.", "Show deliverable scope and budget clearly."),
    pair("Nếu có liên quan kết quả, bắt buộc VC hoặc proof kèm theo.", "If outcomes are promised, VC or proof is required."),
    pair("Không được quảng cáo thu nhập cụ thể.", "Do not advertise specific income outcomes."),
  ]);

  return renderShell({
    currentKey: "market",
    pathname: "/rules/",
    title: pair("Market rules", "Market rules"),
    description: pair("Quy ước minh bạch và proof trong Market.", "Transparency and proof rules in Market."),
    navItems: ecosystemNav("market"),
    hero,
    sections: [
      renderSection(pair("Quy ước", "Rules"), pair("Cần tuân thủ khi giao dịch", "Required for transactions"), rules),
    ],
  });
}

function renderCommunityHome() {
  const deepCta = deepContentHubCta("community", "community-entry", "community-home");
  const communitySurface = resolveSurfacePublicMeta("community");
  const hero = renderHero({
    eyebrow: pair("COMMUNITY công khai", "COMMUNITY public"),
    title: pair("COMMUNITY<br><span class=\"accent\">preview cohort trước, mở vòng thực hành sau</span>", "COMMUNITY<br><span class=\"accent\">cohort preview first, deeper practice later</span>"),
    description: pair(
      "COMMUNITY hiện mở lớp planned-safe để giới thiệu cohort, circle và cách tham gia an toàn. Nó chưa được trình bày như một cộng đồng đã vận hành công khai.",
      "COMMUNITY currently opens a planned-safe layer for cohorts, circles, and safe participation. It is not presented as an already open public community.",
    ),
    actions: [
      gatewayCtaButton(deepCta, "primary"),
      button(`https://${domains.community}/principles/`, pair("Xem nguyên tắc tham gia", "Open participation principles"), "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-021"]),
  });

  const publicValue = renderCards([
    renderCard({
      title: cardTitle(pair("Bản xem trước cohort", "Cohort preview")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "Lớp công khai cho thấy cách cohort được tổ chức, không biến trang này thành bảng tin cộng đồng đã chạy thật.",
        "The public layer shows how a cohort is structured without turning the page into a live activity stream.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Peer support", "Peer support")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "COMMUNITY chỉ mở các nguyên tắc hỗ trợ ngang hàng, ranh giới rõ và hướng đi tiếp về hub.",
        "COMMUNITY opens only peer-support principles, clear boundaries, and a path back to the hub.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Không ồn ào", "No noisy feed")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "Không có feed hoạt động, không có thông báo như thể đã mở thật và không có lời mời tham gia như community đã mở hoàn toàn.",
        "There is no active feed, no alerts that imply a live launch, and no invitation copy that pretends the community is fully open.",
      )),
    }),
  ]);

  const demo = renderCards([
    renderCard({
      title: cardTitle(pair("Circle sample", "Circle sample")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "Mẫu circle này chỉ cho thấy cấu trúc vòng thực hành, nhịp gặp và nguyên tắc giữ chất lượng trao đổi.",
        "This sample circle shows only the practice structure, rhythm, and principles that protect quality conversations.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Nhịp tham gia", "Participation rhythm")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "Preview public nêu rõ tần suất, vai trò người điều phối và cách review tiến trình mà không mở đăng ký live.",
        "The public preview explains cadence, facilitator roles, and progress review without opening live registration.",
      )),
      actions: button(`https://${domains.community}/principles/`, pair("Mở nguyên tắc", "Open principles"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Điểm vào tiếp theo", "Next valid entry")),
      badge: statusBadge(surfaceBadgeClass(communitySurface.status), appStageLabel(communitySurface)),
      body: cardText(pair(
        "Nếu cần đi sâu hơn, hệ đưa người dùng về hub để giữ đúng điểm vào công khai.",
        "If deeper access is needed, the system routes people back to the hub so the public entry point stays consistent.",
      )),
      actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.community}/principles/`, pair("Mở nguyên tắc", "Open principles"), "ghost")}`,
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "community",
    deepCta,
    notes: [
      pair("COMMUNITY hiện chỉ mở bản xem trước an toàn cho cohort, nguyên tắc tham gia và điểm đi tiếp hợp lệ.", "COMMUNITY currently opens only a safe preview for cohorts, participation principles, and valid next-step routes."),
      pair("Không có đăng ký cohort, không có bảng tin cộng đồng và không có lời hứa kết quả cộng đồng tại trang này.", "There is no cohort registration, no community feed, and no community outcome promise on this page."),
    ],
    disclosureIds: ["DPM-021"],
    secondaryActions: `${button(`https://${domains.community}/principles/`, pair("Xem nguyên tắc", "Open principles"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "community",
    extraItems: [
      pair("COMMUNITY đang ở trạng thái Planned. Trang này chưa phải community live và chưa mở tương tác thời gian thực.", "COMMUNITY is currently in Planned status. This page is not a live community and it does not open real-time interaction yet."),
      pair("Mọi CTA sâu hơn phải quay về hub để giữ một điểm vào nhất quán và rõ ràng.", "Every deeper CTA must return to the hub to keep one clear and consistent entry point."),
      pair("Không dùng lời chứng thực hoặc áp lực cộng đồng để kéo người xem vào bản xem trước COMMUNITY.", "No testimonial marketing or social pressure is used to pull people into the community preview."),
    ],
    disclosureIds: ["DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.community}/principles/`, pair("Mở nguyên tắc", "Open principles"), "ghost")}`,
  });

  return renderShell({
    currentKey: "community",
    pathname: "/",
    title: pair("COMMUNITY bản xem trước", "COMMUNITY preview"),
    description: pair(
      "COMMUNITY là lớp công khai ở trạng thái Planned để mở bản xem trước cohort, nguyên tắc tham gia và điểm vào hợp lệ.",
      "COMMUNITY is a public layer in Planned status for cohort previews, participation principles, and valid entry points.",
    ),
    navItems: ecosystemNav("community"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("COMMUNITY giúp người xem hiểu logic cohort và peer support trước khi có bất kỳ tương tác live nào.", "COMMUNITY helps people understand cohort and peer-support logic before any live interaction exists."), publicValue, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các bản xem trước này cho thấy cấu trúc tham gia mà không giả vờ community đã mở công khai.", "These previews show the participation structure without pretending the community is already publicly open."), demo, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderCommunityPrinciplesPage() {
  const deepCta = deepContentHubCta("community", "community-principles", "community-principles");
  const hero = renderHero({
    eyebrow: pair("Community principles", "Community principles"),
    title: pair("Nguyên tắc tham gia", "Participation principles"),
    description: pair(
      "Boundary công khai cho cohort, peer support và cách giữ chất lượng trao đổi trước khi mở community sâu hơn.",
      "A public boundary for cohorts, peer support, and quality conversations before deeper community layers are opened.",
    ),
    actions: [
      button(`https://${domains.community}/`, pair("Về COMMUNITY", "Back to COMMUNITY")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-021"]),
  });

  const principles = renderList([
    pair("Không biến COMMUNITY thành bảng tin cộng đồng ồn ào.", "Do not turn COMMUNITY into a noisy community feed."),
    pair("Mọi vòng thực hành phải có người điều phối, mục tiêu rõ và review rõ.", "Every practice loop needs a facilitator, a clear goal, and a clear review step."),
    pair("Không claim network, job hay earning outcome khi chưa có bằng chứng xác thực.", "Do not claim network, job, or earning outcomes without verified evidence."),
  ]);

  return renderShell({
    currentKey: "community",
    pathname: "/principles/",
    title: pair("Community principles", "Community principles"),
    description: pair("Nguyên tắc công khai cho COMMUNITY planned-safe.", "Public principles for COMMUNITY planned-safe."),
    navItems: ecosystemNav("community"),
    hero,
    sections: [
      renderSection(pair("Nguyên tắc", "Principles"), pair("Những điều phải giữ đúng khi mở COMMUNITY planned-safe.", "What must stay true while COMMUNITY remains planned-safe."), principles),
    ],
  });
}

function renderAiHome() {
  const deepCta = deepContentHubCta("ai", "ai-entry", "ai-home");
  const aiSurface = resolveSurfacePublicMeta("ai");
  const hero = renderHero({
    eyebrow: pair("AI công khai", "AI public"),
    title: pair("AI<br><span class=\"accent\">use-case thật trước, công cụ sâu hơn sau</span>", "AI<br><span class=\"accent\">real use cases first, deeper tools later</span>"),
    description: pair(
      "AI hiện mở lớp planned-safe cho tình huống mẫu, nguyên tắc dùng AI đúng chỗ và bản xem trước an toàn. Nó chưa được trình bày như một bộ công cụ AI đã mở chính thức.",
      "AI currently opens a planned-safe layer for sample use cases, safe AI boundaries, and guided previews. It is not presented as a production-ready tool suite.",
    ),
    actions: [
      gatewayCtaButton(deepCta, "primary"),
      button(`https://${domains.ai}/use-cases/`, pair("Xem use-case mẫu", "Open sample use cases"), "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-021"]),
  });

  const publicValue = renderCards([
    renderCard({
      title: cardTitle(pair("AI đúng chỗ", "AI in the right place")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "AI chỉ hữu ích khi nó nối với workflow thật, output thật và ranh giới trách nhiệm rõ ràng.",
        "AI is useful only when it connects to a real workflow, a real output, and a clear responsibility boundary.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Bản xem trước trợ giúp", "Guided preview")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "Trang public chỉ cho xem cách AI helper có thể hỗ trợ học, soát và gợi ý bước tiếp theo mà không giả tool đã live.",
        "The public page only shows how guided AI support can assist learning, review, and next-step guidance without pretending the tools are already live.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Không hype", "No hype")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "Không dùng nội dung kiểu thay thế con người, kiếm tiền ngay hay tự động hóa mọi thứ để kéo người xem vào lớp AI.",
        "No copy about replacing people, earning instantly, or automating everything is used to pull people into the AI layer.",
      )),
    }),
  ]);

  const demo = renderCards([
    renderCard({
      title: cardTitle(pair("Tutor helper sample", "Tutor helper sample")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "Ví dụ này cho thấy AI giải thích bài học, tóm tắt context và gợi ý hành động nhỏ ngay sau khi học.",
        "This example shows AI explaining a lesson, summarizing context, and suggesting one small action after learning.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Review helper sample", "Review helper sample")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "Trợ giúp rà soát chỉ được mô tả như demo. Nó chưa phải trợ lý đã mở chính thức ở trang này.",
        "The review helper is described only as a demo flow. It is not an officially open assistant on this domain yet.",
      )),
      actions: button(`https://${domains.ai}/use-cases/`, pair("Mở use-case", "Open use cases"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Điểm vào hợp lệ", "Valid next step")),
      badge: statusBadge(surfaceBadgeClass(aiSurface.status), appStageLabel(aiSurface)),
      body: cardText(pair(
        "Mọi bước đi tiếp vẫn quay về hub để giữ đúng điểm vào và không tạo cảm giác tool đã mở thật.",
        "Every next step still returns to the hub to keep the right entry point and avoid implying the tools are fully open.",
      )),
      actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.ai}/use-cases/`, pair("Mở tình huống mẫu", "Open sample uses"), "ghost")}`,
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "ai",
    deepCta,
    notes: [
      pair("AI hiện chỉ mở bản xem trước tình huống, demo trợ giúp và nguyên tắc dùng AI đúng vai.", "AI currently opens only sample-use previews, guided demos, and correct-role usage principles."),
      pair("Không có trợ lý mở hoàn chỉnh, không có tuyên bố công cụ đã live và không có bước thanh toán tại trang này.", "There is no fully open assistant, no claim that tools are live, and no payment step on this page."),
    ],
    disclosureIds: ["DPM-021"],
    secondaryActions: `${button(`https://${domains.ai}/use-cases/`, pair("Xem tình huống mẫu", "Open sample uses"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "ai",
    extraItems: [
      pair("AI đang ở trạng thái Planned. Trang này chưa dùng để tuyên bố bộ công cụ đã mở chính thức.", "AI is currently in Planned status. This page is not used to claim a fully open tool suite yet."),
      pair("Nội dung công khai phải nói rõ đây là bản xem trước trợ giúp, bản xem trước tình huống và bản xem trước ranh giới an toàn.", "Public copy must make it clear that this is a guided preview, a sample-use preview, and a safety-boundary preview."),
      pair("Nếu người xem cần đi sâu hơn, hệ sẽ trả về hub thay vì mở một luồng AI độc lập ngay tại đây.", "If people need to go deeper, the system returns them to the hub instead of opening an isolated AI flow here."),
    ],
    disclosureIds: ["DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.ai}/use-cases/`, pair("Mở use-case", "Open use cases"), "ghost")}`,
  });

  return renderShell({
    currentKey: "ai",
    pathname: "/",
    title: pair("AI bản xem trước", "AI preview"),
    description: pair(
      "AI là lớp công khai ở trạng thái Planned cho bản xem trước tình huống, demo trợ giúp và ranh giới dùng AI đúng chỗ.",
      "AI is a public layer in Planned status for sample-use previews, guided demos, and safe AI boundaries.",
    ),
    navItems: ecosystemNav("ai"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("AI giải thích vai trò, ranh giới và tình huống mẫu trước khi có bất kỳ tuyên bố công cụ production nào.", "AI explains role, boundaries, and sample uses before any production-tool claim exists."), publicValue, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các bản xem trước này cho thấy AI có thể hỗ trợ ở đâu mà không giả vờ công cụ đã mở chính thức.", "These previews show where AI can help without pretending the tools are already fully open."), demo, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderAiUseCasesPage() {
  const deepCta = deepContentHubCta("ai", "ai-use-cases", "ai-use-cases");
  const hero = renderHero({
    eyebrow: pair("Tình huống AI", "AI sample uses"),
    title: pair("Tình huống mẫu", "Sample uses"),
    description: pair(
      "Các tình huống công khai giúp người xem hiểu AI được dùng ở đâu, với dữ liệu nào và trong ranh giới nào.",
      "Public sample uses help people understand where AI is used, with what data, and inside which boundary.",
    ),
    actions: [
      button(`https://${domains.ai}/`, pair("Về AI", "Back to AI")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-021"]),
  });

  const useCases = renderList([
    pair("Giải thích bài học theo bối cảnh của người học.", "Explain a lesson in a learner's context."),
    pair("Soát output mẫu trước khi nộp review.", "Review a sample output before it enters review."),
    pair("Gợi ý bước tiếp theo mà không tự mở quyền truy cập sâu hơn.", "Suggest the next step without unlocking deeper access on its own."),
  ]);

  return renderShell({
    currentKey: "ai",
    pathname: "/use-cases/",
    title: pair("Tình huống AI", "AI sample uses"),
    description: pair("Tình huống mẫu cho AI planned-safe.", "Sample uses for AI planned-safe."),
    navItems: ecosystemNav("ai"),
    hero,
    sections: [
      renderSection(pair("Tình huống mẫu", "Sample uses"), pair("Các tình huống công khai đang được phép nói tới ở lớp AI.", "The public sample uses that are allowed to be described on the AI layer."), useCases),
    ],
  });
}

function renderBusinessPage() {
  const businessSurface = resolveSurfacePublicMeta("business");
  const deepCta = `https://${domains.hub}/lien-he/?intent=enterprise-business&source=business-home`;
  const businessStageLabel = normalizeCopy(appStageLabel(businessSurface));
  const businessStageTone = surfaceBadgeClass(businessSurface.status);
  const businessRuntimeEndpoints = {
    formRegistry: "/api/team4/package-form-registry.json",
    businessContract: "/api/team4/business-domain-contract.json",
    comparison: "/api/team4/package-comparison-demo-output.json",
  };
  const businessRuntimeDisclosure = `
    <div class="disclosure-stack">
      <aside class="disclosure-block" data-disclosure-kind="public-note" data-final-status="approved">
        ${localizedText(disclosureNoteLabelCopy, "div", { class: "disclosure-label" })}
        ${localizedText(pair(
          "BUSINESS hiện chỉ mở phần định hướng, gợi ý gói và demo an toàn. Nếu dữ liệu nền chưa đủ, trang sẽ giữ thông báo chờ thay vì giả như đã mở dịch vụ doanh nghiệp.",
          "BUSINESS currently opens only orientation, package guidance, and safe demos. If the underlying data is not complete, the page stays in a waiting notice instead of pretending enterprise service is live.",
        ), "div", { class: "disclosure-copy" })}
      </aside>
    </div>
  `;
  const runtimeMetricAside = `
    <aside class="card">
      <div class="card-body">
        <div class="metrics">
          <div class="metric">
            <div class="metric-value" id="business-metric-steps">--</div>
            ${localizedText(pair("bước trao đổi", "discussion steps"), "div", { class: "metric-label" })}
          </div>
          <div class="metric">
            <div class="metric-value" id="business-metric-packages">--</div>
            ${localizedText(pair("gói doanh nghiệp", "business packages"), "div", { class: "metric-label" })}
          </div>
          <div class="metric">
            <div class="metric-value" id="business-metric-previews">--</div>
            ${localizedText(pair("bản xem trước an toàn", "safe previews"), "div", { class: "metric-label" })}
          </div>
          <div class="metric">
            ${localizedText(businessStageLabel, "div", { class: "metric-value", id: "business-metric-status" })}
            ${localizedText(pair("trạng thái", "status"), "div", { class: "metric-label" })}
          </div>
        </div>
      </div>
    </aside>
  `;
  const loadingPublicValue = renderCards([
    renderCard({
      title: cardTitle(pair("Đang chuẩn bị điểm vào doanh nghiệp", "Preparing the enterprise entry point")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Các bước trao đổi ban đầu được trình bày như bản xem trước an toàn, chưa phải luồng tiếp nhận doanh nghiệp đang mở.",
        "The first discussion steps are presented as a safe preview, not as an open enterprise intake flow.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Đang chuẩn bị gợi ý gói", "Preparing package guidance")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Trang chỉ gợi ý nhóm gói ở mức tham khảo và giữ mọi bước tiếp theo quay về hub.",
        "The page only presents package groups as guidance and keeps every next step routed back to the hub.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Đang kiểm tra dữ liệu nền", "Checking supporting data")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Nếu dữ liệu nền chưa đủ, phần public value sẽ giữ thông báo chờ và không dựng trải nghiệm doanh nghiệp như đã mở thật.",
        "If supporting data is incomplete, the public value section stays in a waiting notice and does not create an enterprise experience that appears already live.",
      )),
    }),
  ]);
  const loadingDemo = renderCards([
    renderCard({
      title: cardTitle(pair("Đang chuẩn bị phần so sánh", "Preparing comparison")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Phần so sánh chỉ dùng để minh họa cách đọc nhóm gói, chưa phải tư vấn triển khai trực tiếp.",
        "The comparison section only illustrates how to read package groups; it is not live implementation consulting.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Đang chuẩn bị bản xem trước", "Preparing safe previews")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Bản xem trước chỉ xuất hiện khi đủ dữ liệu đã kiểm tra; nếu chưa đủ, trang sẽ giữ thông báo chờ.",
        "Previews appear only when checked data is available; otherwise the page keeps a waiting notice.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Đang chuẩn bị đầu ra mẫu", "Preparing sample outputs")),
      badge: statusBadge(businessStageTone, businessStageLabel),
      body: cardText(pair(
        "Đầu ra mẫu chỉ dùng để minh họa phạm vi, không phải không gian vận hành doanh nghiệp đang mở công khai.",
        "Sample outputs illustrate scope only; they are not a public enterprise operating space.",
      )),
    }),
  ]);

  const hero = renderHero({
    eyebrow: pair("BUSINESS doanh nghiệp", "BUSINESS enterprise"),
    title: pair("BUSINESS<br><span class=\"accent\">định hướng doanh nghiệp trước khi triển khai</span>", "BUSINESS<br><span class=\"accent\">enterprise direction before rollout</span>"),
    description: pair(
      "BUSINESS đang ở lớp planned-safe. Trang này chỉ mở định hướng, gợi ý gói và demo an toàn; mọi bước tiếp theo vẫn quay về hub.",
      "BUSINESS is in a planned-safe layer. This page opens only orientation, package guidance, and safe demos; every next step still returns to the hub.",
    ),
    actions: [
      button(deepCta, pair("Mở trao đổi tại hub", "Open discussion at the hub")),
      button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
    afterActions: businessRuntimeDisclosure,
    aside: runtimeMetricAside,
  });

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "business",
    deepCta,
    notes: [
      pair("BUSINESS hiện chỉ mở định hướng công khai, gợi ý gói và demo an toàn; chưa mở tiếp nhận, thanh toán hay không gian vận hành doanh nghiệp.", "BUSINESS currently opens only public orientation, package guidance, and safe demos; there is no live intake, payment step, or enterprise operating space here."),
      pair("Điểm vào hợp lệ lúc này vẫn là hub liên hệ để giữ một cổng tiếp nhận duy nhất cho lớp doanh nghiệp.", "The valid entry point right now is still the hub contact flow so the enterprise layer keeps a single intake gateway."),
    ],
    secondaryActions: `${button(deepCta, pair("Mở trao đổi doanh nghiệp", "Open enterprise discussion"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "business",
    extraItems: [
      pair("BUSINESS đang ở trạng thái Planned và thẻ trạng thái chỉ phản ánh phần đang được phép mở công khai.", "BUSINESS is in Planned status, and the status card reflects only what is allowed to be public now."),
      pair("Nếu dữ liệu nền chưa đủ, phần giá trị công khai và demo sẽ giữ thông báo chờ thay vì dựng trải nghiệm như đã mở thật.", "If supporting data is incomplete, the public-value and demo sections keep a waiting notice instead of creating an experience that appears already live."),
      pair("Không có tiếp nhận doanh nghiệp tự phục vụ, không có thanh toán và không có không gian vận hành doanh nghiệp được trình bày như đã mở thật ở trang này.", "There is no direct enterprise intake, no payment step, and no enterprise operating space presented as already live on this page."),
    ],
    actions: `${button(deepCta, pair("Mở trao đổi doanh nghiệp", "Open enterprise discussion"), "ghost")} ${button(`https://${domains.hub}/lien-he/`, pair("Liên hệ đội vận hành", "Contact operations"), "ghost")}`,
  });

  return renderShell({
    currentKey: "business",
    pathname: "/",
    title: pair("BUSINESS planned-safe", "BUSINESS planned-safe"),
    description: pair(
      "Lớp BUSINESS đang ở trạng thái Planned để mở trao đổi doanh nghiệp, so sánh lộ trình và gợi ý bước tiếp theo mà không tạo cảm giác onboarding đã mở thật.",
      "The BUSINESS layer is in Planned status for enterprise intake, path comparison, and next-step guidance without creating the impression that onboarding is already live.",
    ),
    navItems: ecosystemNav("business"),
    hero,
    sections: [
      renderSection(
        pair("Public value", "Public value"),
        pair(
          "BUSINESS giúp đội ngũ hiểu đúng điểm vào, phạm vi gói và lý do lớp này vẫn ở trạng thái planned-safe.",
          "BUSINESS helps teams understand the entry point, package scope, and why this layer remains planned-safe.",
        ),
        `<div id="business-public-value-runtime">${loadingPublicValue}</div>`,
        "public-value",
      ),
      renderSection(
        pair("Demo", "Demo"),
        pair(
          "Các block demo chỉ dùng để minh họa phạm vi; nếu thiếu dữ liệu đã kiểm tra, trang sẽ giữ thông báo chờ thay vì dựng trải nghiệm như đã live.",
          "These demo blocks illustrate scope only; if checked data is missing, the page keeps a waiting notice instead of inventing a live-looking experience.",
        ),
        `<div id="business-demo-runtime">${loadingDemo}</div>`,
        "demo",
      ),
      gatewaySection,
      trustStatusSection,
    ],
    inlineScript: `
      (() => {
        const endpoints = ${JSON.stringify(businessRuntimeEndpoints)};
        const stageTone = ${JSON.stringify(businessStageTone)};
        const stageLabel = ${JSON.stringify(businessStageLabel)};
        const sourceFallback = ${JSON.stringify(Object.values(businessRuntimeEndpoints))};
        const outputCopyMap = ${JSON.stringify({
          business_scorecard: pair("Scorecard doanh nghiệp", "Business scorecard"),
          priority_map: pair("Bản đồ ưu tiên", "Priority map"),
          operating_structure_map: pair("Sơ đồ vận hành", "Operating structure map"),
          owner_responsibility_matrix: pair("Ma trận trách nhiệm", "Owner responsibility matrix"),
          sop_bundle: pair("Bộ SOP", "SOP bundle"),
          execution_timeline: pair("Mốc triển khai", "Execution timeline"),
          governance_review_log: pair("Nhật ký rà soát vận hành", "Governance review log"),
          trust_layer_blueprint: pair("Khung trust layer", "Trust layer blueprint"),
          team_readiness_assessment: pair("Đánh giá độ sẵn sàng đội ngũ", "Team readiness assessment"),
          partner_readiness_note: pair("Ghi chú readiness đối tác", "Partner readiness note"),
        })};
        const state = {
          payload: null,
          error: "",
        };

        function currentLanguage() {
          return document.documentElement.dataset.language === "en" ? "en" : "vi";
        }

        function localized(value) {
          if (value && typeof value === "object") {
            return currentLanguage() === "en"
              ? (value.en || value.vi || "")
              : (value.vi || value.en || "");
          }
          return String(value || "");
        }

        function pair(vi, en) {
          return {
            vi: String(vi || ""),
            en: String(en || vi || ""),
          };
        }

        function escapeHtml(value) {
          return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
        }

        function setText(id, value) {
          const node = document.getElementById(id);
          if (node) node.textContent = value;
        }

        function setHtml(id, value) {
          const node = document.getElementById(id);
          if (node) node.innerHTML = value;
        }

        function badge(label) {
          return '<span class="badge ' + escapeHtml(stageTone) + '">' + escapeHtml(localized(label)) + '</span>';
        }

        function title(copy) {
          return '<h3 class="card-title">' + escapeHtml(localized(copy)) + '</h3>';
        }

        function text(copy, className = "card-copy") {
          return '<div class="' + escapeHtml(className) + '">' + escapeHtml(localized(copy)) + '</div>';
        }

        function list(items) {
          return '<ul class="list">' + items.map((item) => '<li><span>' + escapeHtml(localized(item)) + '</span></li>').join("") + '</ul>';
        }

        function support(copy) {
          return '<div class="card-support"><div class="subtle">' + escapeHtml(localized(copy)) + '</div></div>';
        }

        function card({ title: cardTitleCopy, body, badgeHtml = "", supportCopy = "" }) {
          return '<article class="card"><div class="card-body stack">'
            + '<div class="cluster" style="justify-content:space-between;align-items:flex-start">'
            + title(cardTitleCopy)
            + badgeHtml
            + '</div>'
            + body
            + (supportCopy ? support(supportCopy) : "")
            + '</div></article>';
        }

        function grid(cards) {
          return '<div class="grid-3">' + cards.join("") + '</div>';
        }

        function toLocalizedPair(value, fallbackKey = "--") {
          if (value && typeof value === "object" && ("vi" in value || "en" in value)) {
            return {
              vi: String(value.vi || value.en || fallbackKey),
              en: String(value.en || value.vi || fallbackKey),
            };
          }
          return {
            vi: String(value || fallbackKey),
            en: String(value || fallbackKey),
          };
        }

        function humanizeToken(value) {
          const raw = String(value || "").trim();
          if (!raw) return "--";
          return raw
            .replaceAll(/[_-]+/g, " ")
            .replace(/\\b\\w/g, (character) => character.toUpperCase());
        }

        function outputLabel(outputKey) {
          if (outputCopyMap[String(outputKey || "")]) {
            return outputCopyMap[String(outputKey || "")];
          }
          const fallback = humanizeToken(outputKey);
          return {
            vi: fallback,
            en: fallback,
          };
        }

        function findBusinessData() {
          const formRegistry = state.payload?.formRegistry || {};
          const businessContract = state.payload?.businessContract || {};
          const comparison = state.payload?.comparison || {};
          const businessSurface = Array.isArray(formRegistry.subdomainFormRegistry)
            ? formRegistry.subdomainFormRegistry.find((item) => item.surfaceKey === "business") || {}
            : {};
          const businessForm = Array.isArray(formRegistry.forms)
            ? formRegistry.forms.find((item) => item.formKey === (businessSurface.formKey || "business_enterprise_intake_v1")) || {}
            : {};
          const businessFamily = Array.isArray(formRegistry.surfacePackageFamilies)
            ? formRegistry.surfacePackageFamilies.find((item) => item.surfaceKey === "business" || item.familyKey === businessSurface.packageFamilyKey) || {}
            : {};
          const businessRows = Array.isArray(comparison.comparisonBundles)
            ? (
              comparison.comparisonBundles.find((item) => item.surfaceKey === "business" || (businessSurface.comparisonBundleIds || []).includes(item.bundleId))
              || {}
            ).rows || []
            : [];
          const businessPackages = Array.isArray(businessContract.businessPackages) && businessContract.businessPackages.length > 0
            ? businessContract.businessPackages
            : Array.isArray(businessFamily.packages)
              ? businessFamily.packages
              : [];
          const packageKeys = new Set((businessPackages || []).map((item) => item.packageKey || item.key).filter(Boolean));
          const demoBundles = Array.isArray(comparison.demoBundles)
            ? comparison.demoBundles.filter((item) => item.surfaceKey === "business" || packageKeys.has(item.packageKey))
            : [];
          const outputBundles = Array.isArray(comparison.outputBundles)
            ? comparison.outputBundles.filter((item) => packageKeys.has(item.packageKey))
            : [];
          const sourceOfTruth = Array.isArray(businessContract.plannedApiContract?.currentSourceOfTruth) && businessContract.plannedApiContract.currentSourceOfTruth.length > 0
            ? businessContract.plannedApiContract.currentSourceOfTruth
            : sourceFallback;
          const minRecommendations = Number(
            businessContract.packageRecommendationRules?.minimumRecommendationCount
            || businessForm.recommendationContract?.minRecommendations
            || 2,
          );
          const maxRecommendations = Number(
            businessContract.packageRecommendationRules?.maximumRecommendationCount
            || businessForm.recommendationContract?.maxRecommendations
            || 3,
          );

          return {
            businessForm,
            businessFamily,
            businessRows,
            businessPackages,
            demoBundles,
            outputBundles,
            sourceOfTruth,
            minRecommendations,
            maxRecommendations,
          };
        }

        function packageLabel(item) {
          return toLocalizedPair({
            vi: item?.labelVi || item?.labelEn || item?.packageKey || item?.key || "--",
            en: item?.labelEn || item?.labelVi || item?.packageKey || item?.key || "--",
          });
        }

        function renderMetrics(data) {
          setText("business-metric-steps", String(Array.isArray(data.businessForm.steps) ? data.businessForm.steps.length : 0));
          setText("business-metric-packages", String(Array.isArray(data.businessPackages) ? data.businessPackages.length : 0));
          setText("business-metric-previews", String(Array.isArray(data.demoBundles) ? data.demoBundles.length : 0));
          setText("business-metric-status", localized(stageLabel));
        }

        function renderPublicValue(data) {
          const steps = Array.isArray(data.businessForm.steps) ? data.businessForm.steps : [];
          const packageLabels = (Array.isArray(data.businessPackages) ? data.businessPackages : []).map((item) => packageLabel(item));
          const sourceLabels = [
            pair("Bước trao đổi ban đầu", "Initial discussion steps"),
            pair("Nhóm gói doanh nghiệp", "Enterprise package groups"),
            pair("Đầu ra mẫu đã kiểm tra", "Checked sample outputs"),
          ];

          setHtml("business-public-value-runtime", grid([
            card({
              title: pair("Điểm vào doanh nghiệp", "Enterprise entry point"),
              badgeHtml: badge(stageLabel),
              body: list(steps.map((step) => ({
                vi: step.titleVi || step.key || "Bước trao đổi",
                en: step.titleEn || step.titleVi || step.key || "Intake step",
              }))),
              supportCopy: pair(
                "Phần này hiện chỉ minh họa " + steps.length + " bước trao đổi ban đầu.",
                "This section currently illustrates only " + steps.length + " initial discussion steps.",
              ),
            }),
            card({
              title: pair("Gợi ý 2-3 gói phù hợp", "Recommend 2-3 fitting packages"),
              badgeHtml: badge(pair("gói", "packages")),
              body: text(pair(
                "BUSINESS chỉ gợi ý " + data.minRecommendations + "-" + data.maxRecommendations + " gói phù hợp và giữ toàn bộ bước tiếp theo quay về hub.",
                "BUSINESS recommends only " + data.minRecommendations + "-" + data.maxRecommendations + " fitting packages and keeps every next step routed back to the hub.",
              )) + list(packageLabels),
              supportCopy: pair(
                "Đây là nhóm gói tham khảo, chưa phải luồng tiếp nhận doanh nghiệp trực tiếp.",
                "This is a reference package group, not a direct enterprise intake flow.",
              ),
            }),
            card({
              title: pair("Dữ liệu nền đang được kiểm tra", "Supporting data being checked"),
              badgeHtml: badge(stageLabel),
              body: list(sourceLabels),
              supportCopy: pair(
                "Nếu dữ liệu nền chưa đủ, phần public value sẽ giữ thông báo chờ.",
                "If supporting data is incomplete, the public value section keeps a waiting notice.",
              ),
            }),
          ]));
        }

        function renderDemo(data) {
          const rows = Array.isArray(data.businessRows) ? data.businessRows : [];
          const familyPackages = Array.isArray(data.businessFamily.packages) ? data.businessFamily.packages : [];
          const previewItems = familyPackages.map((item) => {
            const hasPreview = (data.demoBundles || []).some((bundle) => bundle.packageKey === item.packageKey);
            const label = packageLabel(item);
            return {
              vi: label.vi + (hasPreview ? " - đã khóa bản xem trước an toàn" : " - đang chờ bản xem trước"),
              en: label.en + (hasPreview ? " - safe preview locked" : " - preview pending"),
            };
          });
          const outputItems = Array.from(new Set(
            (Array.isArray(data.outputBundles) ? data.outputBundles : [])
              .flatMap((bundle) => Array.isArray(bundle.outputs) ? bundle.outputs : [])
              .filter(Boolean),
          ))
            .slice(0, 6)
            .map((outputKey) => outputLabel(outputKey));

          setHtml("business-demo-runtime", grid([
            card({
              title: pair("Phần so sánh BUSINESS", "BUSINESS comparison"),
              badgeHtml: badge(pair("so sánh", "comparison")),
              body: text(pair(
                "Phần so sánh hiện có " + rows.length + " gói trong nhóm BUSINESS.",
                "The comparison bundle currently contains " + rows.length + " packages in the BUSINESS family.",
              )) + list(rows.map((row) => packageLabel(row))),
              supportCopy: pair(
                "Demo so sánh chỉ hiển thị nhãn gói đã được kiểm tra.",
                "The comparison demo shows only checked package labels.",
              ),
            }),
            card({
              title: pair("Bản xem trước theo từng gói", "Safe previews by package"),
              badgeHtml: badge(pair("preview", "preview")),
              body: list(previewItems),
              supportCopy: pair(
                "Hiện có " + (Array.isArray(data.demoBundles) ? data.demoBundles.length : 0) + " bản xem trước an toàn cho lớp BUSINESS.",
                "There are currently " + (Array.isArray(data.demoBundles) ? data.demoBundles.length : 0) + " safe previews for the BUSINESS layer.",
              ),
            }),
            card({
              title: pair("Đầu ra mẫu đang khóa", "Locked sample outputs"),
              badgeHtml: badge(pair("đầu ra", "outputs")),
              body: list(outputItems),
              supportCopy: pair(
                "Các đầu ra này là mẫu planned-safe, không phải không gian vận hành doanh nghiệp đang mở công khai.",
                "These outputs are planned-safe sample outputs, not a publicly open enterprise operating space.",
              ),
            }),
          ]));
        }

        function renderLoadingState() {
          setText("business-metric-steps", "--");
          setText("business-metric-packages", "--");
          setText("business-metric-previews", "--");
          setText("business-metric-status", localized(stageLabel));
        }

        function renderErrorState(message) {
          renderLoadingState();
          setHtml("business-public-value-runtime", grid([
            card({
              title: pair("Dữ liệu nền chưa đủ", "Supporting data is incomplete"),
              badgeHtml: badge(stageLabel),
              body: text(pair(
                "Điểm vào và nhóm gói vẫn ở trạng thái Planned. Trang không mở luồng doanh nghiệp giả như đã live.",
                "The entry point and package groups remain Planned. The page does not open an enterprise flow that looks live.",
              )),
              supportCopy: {
                vi: "Vui lòng tiếp tục từ hub nếu cần trao đổi sâu hơn.",
                en: "Please continue from the hub for deeper discussion.",
              },
            }),
            card({
              title: pair("Public value đang chờ dữ liệu", "Public value is waiting for data"),
              badgeHtml: badge(stageLabel),
              body: text(pair(
                "Khi dữ liệu nền chưa phản hồi, BUSINESS chỉ giữ wording công khai an toàn và CTA về hub.",
                "When supporting data is not responding, BUSINESS keeps only public-safe wording and the CTA back to the hub.",
              )),
            }),
            card({
              title: pair("Demo chưa mở", "Demo not open"),
              badgeHtml: badge(pair("planned-safe", "planned-safe")),
              body: text(pair(
                "Không có preview hoặc output nào được dựng như lớp doanh nghiệp đã live khi dữ liệu chưa đủ.",
                "No preview or output is rendered as if the enterprise layer were live while data is incomplete.",
              )),
            }),
          ]));
          setHtml("business-demo-runtime", grid([
            card({
              title: pair("Phần so sánh đang chờ", "Comparison waiting"),
              badgeHtml: badge(stageLabel),
              body: text(pair(
                "Phần so sánh doanh nghiệp đang chờ dữ liệu đã kiểm tra.",
                "The enterprise comparison section is waiting for checked data.",
              )),
            }),
            card({
              title: pair("Bản xem trước đang chờ", "Safe previews waiting"),
              badgeHtml: badge(stageLabel),
              body: text(pair(
                "Bản xem trước chỉ hiện khi dữ liệu hợp lệ đã sẵn sàng.",
                "Previews appear only when valid data is available.",
              )),
            }),
            card({
              title: pair("Output mẫu đang chờ", "Sample outputs waiting"),
              badgeHtml: badge(stageLabel),
              body: text(pair(
                "Đầu ra mẫu sẽ quay lại khi dữ liệu nền đồng bộ lại.",
                "Sample outputs return when supporting data is synchronized again.",
              )),
            }),
          ]));
        }

        async function fetchJson(path) {
          const response = await fetch(path, {
            headers: {
              accept: "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(path + " -> " + response.status);
          }
          return response.json();
        }

        async function hydrateBusinessShell() {
          renderLoadingState();
          try {
            const [formRegistry, businessContract, comparison] = await Promise.all([
              fetchJson(endpoints.formRegistry),
              fetchJson(endpoints.businessContract),
              fetchJson(endpoints.comparison),
            ]);
            state.payload = { formRegistry, businessContract, comparison };
            state.error = "";
            const data = findBusinessData();
            renderMetrics(data);
            renderPublicValue(data);
            renderDemo(data);

            if (typeof window.vetuonglaiTrack === "function") {
              window.vetuonglaiTrack("business_team4_runtime_hydrated", {
                screen: "/",
                intake_steps: Array.isArray(data.businessForm.steps) ? data.businessForm.steps.length : 0,
                packages: Array.isArray(data.businessPackages) ? data.businessPackages.length : 0,
                previews: Array.isArray(data.demoBundles) ? data.demoBundles.length : 0,
              });
            }
          } catch (error) {
            state.payload = null;
            state.error = error instanceof Error ? error.message : String(error || "team4_runtime_error");
            renderErrorState(state.error);
          }
        }

        function rerenderBusinessShell() {
          if (state.payload) {
            const data = findBusinessData();
            renderMetrics(data);
            renderPublicValue(data);
            renderDemo(data);
            return;
          }
          if (state.error) {
            renderErrorState(state.error);
            return;
          }
          renderLoadingState();
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", hydrateBusinessShell);
        } else {
          hydrateBusinessShell();
        }

        window.addEventListener("vetuonglai:languagechange", rerenderBusinessShell);
      })();
    `,
  });
}

function renderVcWorker() {
  return `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/v" || url.pathname === "/v/" || url.pathname.startsWith("/v/")) {
      const segments = url.pathname.split("/").filter(Boolean);
      const code = segments[0] === "v" && segments.length > 1 ? decodeURIComponent(segments.slice(1).join("/")) : "";
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/v/";
      if (code && !assetUrl.searchParams.has("code")) {
        assetUrl.searchParams.set("code", code);
      }
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
`;
}

function renderEduHome() {
  const deepCta = deepContentHubCta("edu", "course-depth", "edu-home");
  const featuredCards = renderCards(courses.map((course) => renderCard({
    title: cardTitle(pair(course.title, course.titleEn)),
    badge: statusBadge("beta", pair(course.level, course.level)),
    body: cardText(pair(course.summary, course.summaryEn)),
    meta: [
      `<span>${escapeHtml(course.duration)}</span>`,
      `<span>${escapeHtml(course.price)}</span>`,
      `<span>${escapeHtml(course.certificateCode)}</span>`,
    ].join(""),
    actions: [
      button(`/course/${course.slug}/`, pair("Xem chi tiết", "View details")),
      gatewayCtaButton(deepContentHubCta("edu", "course-card", "edu-home", course.slug), "ghost"),
    ].join(""),
  })));

  const architecture = renderCards([
    renderCard({
      title: cardTitle(pair("Lớp học có đầu ra", "Learning with output")),
      badge: statusBadge("live", pair("đầu ra", "output")),
      body: cardText(pair(
        "Mỗi khóa học không chỉ có mô tả. Nó phải dẫn tới đầu ra, bài nộp và bằng chứng tối thiểu.",
        "Each course does more than describe content. It has to lead to output, submission, and minimum evidence.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lộ trình học", "Learning pathway")),
      badge: statusBadge("live", pair("lộ trình", "pathway")),
      body: cardText(pair(
        "Người học đi qua chuỗi học, làm, nộp và đối chiếu thay vì học rời rạc từng mảnh.",
        "Learners move through learning, doing, submitting, and checking instead of fragmented content.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Nối sang VC", "Bridge to VC")),
      badge: statusBadge("live", pair("xác minh", "verification")),
      body: cardText(pair(
        "Sau khi hoàn thành đầu ra, hồ sơ học sẽ được chuẩn hóa thành bộ hồ sơ để xác minh độc lập.",
        "Once the output is complete, the learning record is normalized into a dossier for independent verification.",
      )),
    }),
  ]);

  const flow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Cách học", "How learning works"))}
          ${renderList([
            pair("Học -> làm -> nộp", "Learn -> do -> submit"),
            pair("Tạo sản phẩm hoặc kết quả cụ thể", "Create a concrete product or result"),
            pair("Chuẩn hóa hồ sơ để nối sang lớp xác minh", "Normalize the record before sending it to verification"),
          ], { ordered: true })}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Điều cần hiểu", "What matters here"))}
          ${localizedText(pair(
            "Nếu không có output, việc học vẫn chưa đủ. EDU tồn tại để biến bài học thành thứ dùng được ngoài đời.",
            "If there is no output, the learning is still incomplete. EDU exists to turn lessons into something usable in real life.",
          ), "div", { class: "subtle" })}
        </div>
      </article>
    </div>
  `;

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "edu",
    deepCta,
    notes: [
      pair("Khám phá khóa học mở ở lớp public; khi cần đi sâu hơn, user quay về hub theo điểm vào đã được khóa.", "Course discovery stays on the public layer; when users need to go deeper, they return to the hub through the locked entry flow."),
      pair("EDU không tự mở checkout ở trang khóa học, catalog hay player.", "EDU does not open checkout on the course page, catalog, or player."),
    ],
    disclosureIds: ["DPM-005", "DPM-021"],
    secondaryActions: `${button("/courses/", pair("Xem catalog", "Open catalog"), "ghost")} ${button(`https://${domains.vc}/v/${courses[0].certificateCode}`, pair("Mở sample VC", "Open sample VC"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "edu",
    extraItems: [
      pair("EDU đang ở trạng thái Live cho lớp public: danh sách khóa học, trang chi tiết, lộ trình mẫu và trình học có thể mở để đọc; lớp sâu hơn vẫn đi theo trạng thái truy cập.", "EDU is Live on the public layer: the course list, detail pages, sample learning paths, and player can be opened for reading; deeper layers still follow access state."),
      pair("EDU trên mobile cũng bám cùng bốn trạng thái visitor, pending member, annual access và specialist access; snapshot không tự mở sâu hơn.", "EDU on mobile follows the same four states: visitor, pending member, annual access, and specialist access; snapshots never unlock deeper layers on their own."),
      pair("Mỗi course phải giữ public teaser có giá trị, một demo cụ thể và đường neo sang VC khi nói tới proof.", "Each course must keep a valuable public teaser, a concrete demo, and an anchor into VC whenever proof is discussed."),
      pair("Không tách payment khỏi hub ở bất kỳ hành trình học nào.", "Payment is never split away from the hub on any learning path."),
    ],
    disclosureIds: ["DPM-005", "DPM-021"],
    actions: `${button("/courses/", pair("Mở catalog", "Open catalog"), "ghost")} ${button(`https://${domains.member}/app/`, pair("Mở mobile app", "Open mobile app"), "ghost")}`,
  });

  const hero = renderHero({
    eyebrow: codexPair("sites.edu.hero.eyebrow", "Lớp học", "Learning layer"),
    title: codexPair("sites.edu.hero.title", "HỌC", "LEARNING"),
    description: codexPair(
      "sites.edu.hero.subline",
      "Học để làm được việc, không phải để biết.",
      "Learn to do real work, not to merely know.",
    ),
    actions: [
      button("/courses/", codexPair("sites.edu.hero.primary_cta", "Xem lộ trình học", "View the learning path")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-005"]),
    aside: renderMetrics([
      { value: String(courses.length), label: pair("khóa học nổi bật", "featured courses") },
      { value: "VC", label: pair("lớp chứng nhận", "credential layer") },
      { value: "AI", label: pair("lớp hỗ trợ", "support layer") },
      { value: "output", label: pair("trọng tâm", "focus") },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    pathname: "/",
    title: codexPair("sites.edu.seo.title", "EDU | Học để làm được việc thật", "EDU | Learn to do real work"),
    description: codexPair(
      "sites.edu.seo.description",
      "EDU là lớp học để làm được việc, tạo đầu ra và nối sang lớp xác minh thay vì dừng ở kiến thức đơn lẻ.",
      "EDU is the learning layer for practical output, real work, and evidence that can be reviewed and verified instead of isolated knowledge.",
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("EDU tồn tại để biến việc học thành output, bộ hồ sơ và bằng chứng.", "EDU exists to turn learning into output, dossiers, and evidence."), `${architecture}${flow}`, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Các lộ trình mở công khai để user thấy từ bài học đi tới đầu ra như thế nào.", "The public learning paths show how a lesson moves toward output."), featuredCards, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderEduCoursesPage() {
  const deepCta = deepContentHubCta("edu", "course-list", "edu-courses");
  const listDisclosure = renderDisclosureStack(["DPM-006"], { className: "is-footer" });
  const list = renderCards(courses.map((course) => renderCard({
    title: cardTitle(pair(course.title, course.titleEn)),
    badge: statusBadge("beta", pair(course.level, course.level)),
    body: cardHtml(pair(
      `${escapeHtml(course.tagline)}<br><br>${escapeHtml(course.summary)}`,
      `${escapeHtml(course.taglineEn)}<br><br>${escapeHtml(course.summaryEn)}`,
    )),
    meta: [
      `<span>${escapeHtml(course.duration)}</span>`,
      `<span>${escapeHtml(course.price)}</span>`,
      `<span>${escapeHtml(course.certificateCode)}</span>`,
    ].join(""),
    actions: [
      button(`/course/${course.slug}/`, pair("Xem chi tiết", "View details")),
      gatewayCtaButton(deepContentHubCta("edu", "course-list-item", "edu-courses", course.slug), "ghost"),
    ].join(""),
  })));

  const hero = renderHero({
    eyebrow: pair("Danh mục khóa học", "Course catalog"),
    title: pair(
      `Danh sách khóa học<br><span class="accent">gom từ source data chung</span>`,
      `Course catalog<br><span class="accent">assembled from shared source data</span>`,
    ),
    description: pair(
      "Mỗi khóa học đều có trang chi tiết, outcomes, modules và mã VC mẫu để kiểm tra logic chứng nhận.",
      "Each course includes a detail page, outcomes, modules, and a VC sample code to validate the credential flow.",
    ),
    actions: [
      button("/", pair("Về EDU home", "Back to EDU home")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-006"]),
  });

  return renderShell({
    currentKey: "edu",
    activeKey: "edu",
    pathname: "/courses/",
    title: pair("Danh sách khóa học • EDU", "Course catalog • EDU"),
    description: pair(
      "Danh sách khóa học chính thức cho edu.vetuonglai.com.",
      "The official course catalog for edu.vetuonglai.com.",
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [renderSection(pair("Course Cards", "Course cards"), pair("Toàn bộ card được sinh trực tiếp từ courses.json", "Every card is generated directly from courses.json"), `${list}${listDisclosure}`)],
  });
}

function renderEduCourseDetail(course) {
  const deepCta = deepContentHubCta("edu", "course-detail", "edu-course-detail", course.slug);
  const outcomes = renderList(course.outcomes.map((item, index) => pair(item, course.outcomesEn[index] || item)));
  const modules = renderList(course.modules.map((item, index) => pair(item, course.modulesEn[index] || item)));

  const structure = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Đầu ra", "Outcomes"))}
          ${outcomes}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Các mô-đun", "Modules"))}
          ${modules}
        </div>
      </article>
    </div>
  `;

  const credentialAnchor = renderCards([
    renderCard({
      title: cardTitle(pair("Mẫu VC", "VC sample")),
      badge: statusBadge("live", pair("đối chiếu", "reference")),
      body: cardText(pair(
        `Khóa học này nối sẵn tới bản ghi mẫu ${course.certificateCode} trên VC để kiểm tra cách xuất credential.`,
        `This course is already linked to sample record ${course.certificateCode} on VC so the credential flow can be inspected.`,
      )),
      actions: button(`https://${domains.vc}/v/${course.certificateCode}`, pair("Mở sample VC", "Open VC sample"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Thời lượng và cấp độ", "Duration & level")),
      badge: statusBadge("beta", pair("khóa học", "course")),
      body: cardText(pair(
        `${course.duration} • ${course.level} • ${course.price}`,
        `${course.durationEn} • ${course.level} • ${course.price}`,
      )),
    }),
    renderCard({
      title: cardTitle(pair("Triển khai", "Deployment")),
      badge: statusBadge("live", pair("tĩnh", "static")),
      body: cardText(pair(
        "Trang này được xuất bản ổn định để người học có thể đọc, đối chiếu và đi tiếp mà không bị phụ thuộc vào một lớp mô tả kỹ thuật.",
        "This page is published as a stable learning surface so learners can read, compare, and continue without seeing technical implementation detail.",
      )),
    }),
  ]);

  const hero = renderHero({
    eyebrow: pair("Chi tiết khóa học", "Course detail"),
    title: pair(
      `${escapeHtml(course.title)}<br><span class="accent">${escapeHtml(course.tagline)}</span>`,
      `${escapeHtml(course.titleEn)}<br><span class="accent">${escapeHtml(course.taglineEn)}</span>`,
    ),
    description: pair(course.summary, course.summaryEn),
    beforeActions: renderDisclosureStack(["DPM-007"]),
    actions: [
      button("/courses/", pair("Về catalog", "Back to catalog")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: course.level, label: pair("cấp độ", "level") },
      { value: course.duration, label: pair("thời lượng", "duration") },
      { value: course.price, label: pair("mức phí", "price") },
      { value: course.certificateCode, label: pair("mã VC mẫu", "sample VC code") },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    pathname: `/course/${course.slug}/`,
    title: pair(`${course.title} • EDU`, `${course.titleEn} • EDU`),
    description: pair(course.summary, course.summaryEn),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Cấu trúc khóa học", "Course structure"), pair("Đầu ra và module được dùng làm khung đối chiếu khi cấp chứng nhận", "Outcomes and modules are used as the reference frame for credential issuance"), structure),
      renderSection(pair("Mối nối chứng nhận", "Credential anchor"), pair("Mối nối từ trang khóa học sang lớp VC độc lập", "How the course detail page connects into the independent VC layer"), credentialAnchor),
    ],
  });
}

function buildEduCoursePlayerLessons(course) {
  const fallbackModules = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : ["Khởi động", "Thực hành", "Tổng kết"];
  const fallbackModulesEn = Array.isArray(course.modulesEn) && course.modulesEn.length > 0
    ? course.modulesEn
    : ["Kickoff", "Practice", "Wrap-up"];
  const typeCycle = ["reading", "ai_guided", "action", "project", "reflection"];

  return fallbackModules.map((moduleTitle, index) => {
    const moduleTitleEn = fallbackModulesEn[index] || moduleTitle;
    const type = typeCycle[index % typeCycle.length];
    const lessonId = `${course.slug}-lesson-${index + 1}`;

    return {
      id: lessonId,
      moduleIndex: index + 1,
      moduleTitle,
      moduleTitleEn,
      type,
      title: `${moduleTitle}`,
      titleEn: `${moduleTitleEn}`,
      objective: "Hiểu đúng trọng tâm bài học và áp dụng được vào ngữ cảnh của bạn.",
      objectiveEn: "Understand the core of this lesson and apply it to your own context.",
      why: "Nếu không áp dụng ngay, kiến thức sẽ nhanh chóng bị quên.",
      whyEn: "If you do not apply it immediately, the knowledge fades quickly.",
      body: "Đọc phần chính, hỏi AI khi chưa rõ, rồi làm một hành động nhỏ để biến nội dung thành kết quả thật.",
      bodyEn: "Read the core content, ask AI when you are unclear, then complete one small action to turn content into a real outcome.",
      actionStep: "Viết ra 1 việc bạn sẽ làm trong hôm nay dựa trên bài này.",
      actionStepEn: "Write one thing you will do today based on this lesson.",
      reflectionQuestion: "Điều gì trong bài này giúp bạn rõ hướng hơn?",
      reflectionQuestionEn: "What in this lesson makes your direction clearer?",
      completionRule:
        type === "action"
          ? "must_submit_proof"
          : type === "project"
            ? "must_submit_project"
            : type === "reflection"
              ? "must_submit_reflection"
              : type === "ai_guided"
                ? "must_open_and_ask_ai"
                : "must_open_and_confirm_understanding",
    };
  });
}

function renderEduCourseOverview(course, lessons) {
  const hero = renderHero({
    eyebrow: pair("Course Player", "Course player"),
    title: pair(
      `${escapeHtml(course.title)}<br><span class="accent">học để làm được, có AI đồng hành</span>`,
      `${escapeHtml(course.titleEn)}<br><span class="accent">learn by doing with AI as your companion</span>`,
    ),
    description: pair(
      "Bạn không cần học hết mọi thứ cùng lúc. Chỉ cần bắt đầu từ một bài, làm một hành động, và tiến lên từng bước.",
      "You do not need to learn everything at once. Start with one lesson, complete one action, and move step by step.",
    ),
    actions: [
      button(`/learn/${course.slug}/player/`, pair("Bắt đầu bài học", "Start lesson")),
      button(`/course/${course.slug}/`, pair("Xem lại chi tiết khóa", "Back to course detail"), "ghost"),
    ].join(""),
  });

  const modules = renderCards(lessons.map((lesson) => renderCard({
    title: cardTitle(pair(`Module ${lesson.moduleIndex}: ${lesson.title}`, `Module ${lesson.moduleIndex}: ${lesson.titleEn}`)),
    badge: statusBadge("beta", pair(lesson.type.replaceAll("_", " "), lesson.type.replaceAll("_", " "))),
    body: cardText(pair(lesson.objective, lesson.objectiveEn)),
    meta: `<span class="mono">${escapeHtml(lesson.completionRule)}</span>`,
  })));

  return renderShell({
    currentKey: "edu",
    pathname: `/learn/${course.slug}/`,
    title: pair(`${course.title} • Course Player`, `${course.titleEn} • Course Player`),
    description: pair(
      `Lộ trình học hành động cho khóa ${course.title}.`,
      `Action-based learning path for ${course.titleEn}.`,
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Lộ trình bài học", "Lesson roadmap"), pair("Mỗi bài phải tạo được hành động thật và bằng chứng thật", "Each lesson must produce real action and real proof"), modules),
    ],
  });
}

function renderEduCoursePlayer(course, lessons) {
  const hero = renderHero({
    eyebrow: pair("Lesson Player", "Lesson player"),
    title: pair(
      `${escapeHtml(course.title)}<br><span class="accent">học, hỏi AI, làm thật, ghi nhận tiến bộ</span>`,
      `${escapeHtml(course.titleEn)}<br><span class="accent">learn, ask AI, act, and record progress</span>`,
    ),
    description: pair(
      "Đây không phải màn hình xem video. Đây là nơi bạn học và hành động theo từng bước có thể kiểm chứng.",
      "This is not a passive video screen. It is where you learn and act through verifiable steps.",
    ),
    actions: [
      button(`/learn/${course.slug}/`, pair("Về tổng quan khóa", "Back to course overview"), "ghost"),
      button(`/courses/`, pair("Về danh sách khóa", "Back to catalog"), "ghost"),
    ].join(""),
  });

  const shell = `
    <article class="card">
      <div class="card-body">
        <div id="edu-player-root" class="edu-player-root"></div>
      </div>
    </article>
  `;

  const inlineScript = `
    const course = ${JSON.stringify(course)};
    const lessons = ${JSON.stringify(lessons)};
    const root = document.getElementById("edu-player-root");
    const storageKey = "vt-edu-player:" + course.slug;
    const learningEndpoints = {
      state: "/api/access/learning/state?course=" + encodeURIComponent(course.slug),
      vcCandidate: "/api/access/learning/vc-candidate?course=" + encodeURIComponent(course.slug),
      progress: "/api/access/learning/progress",
      submission: "/api/access/learning/submission",
    };
    let runtimeCourseState = null;
    const currentLanguage = () => document.documentElement.dataset.language === "en" ? "en" : "vi";

    const copy = (vi, en = vi) => ({ vi, en });
    const statusLabel = (status) => {
      if (status === "completed") return copy("đã hoàn thành", "completed");
      if (status === "in_progress") return copy("đang học", "in progress");
      if (status === "needs_action") return copy("cần thực hành", "needs action");
      if (status === "needs_review") return copy("cần review", "needs review");
      return copy("chưa bắt đầu", "not started");
    };

    const escapeHtml = (value) => String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

    const localized = (vi, en = vi) => {
      const lang = currentLanguage();
      return lang === "en" ? en : vi;
    };

    function loadState() {
      try {
        const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
        return {
          currentLessonId: parsed.currentLessonId || lessons[0]?.id || "",
          completed: parsed.completed || {},
          actionProofs: parsed.actionProofs || {},
          reflections: parsed.reflections || {},
          aiMessages: Array.isArray(parsed.aiMessages) ? parsed.aiMessages : [],
          vcIssued: Boolean(parsed.vcIssued),
          vcCandidate: parsed.vcCandidate || null,
        };
      } catch {
        return {
          currentLessonId: lessons[0]?.id || "",
          completed: {},
          actionProofs: {},
          reflections: {},
          aiMessages: [],
          vcIssued: false,
          vcCandidate: null,
        };
      }
    }

    function saveState(state) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    function mergeWithRuntime(localState) {
      if (!runtimeCourseState) return localState;

      const completed = { ...(localState.completed || {}) };
      const actionProofs = { ...(localState.actionProofs || {}) };
      const reflections = { ...(localState.reflections || {}) };

      Object.entries(runtimeCourseState.lesson_progress || {}).forEach(([lessonId, status]) => {
        if (status === "completed") completed[lessonId] = true;
      });

      Object.values(runtimeCourseState.submissions || {}).forEach((entry) => {
        if (!entry || !entry.lesson_id) return;
        if (entry.submission_type === "reflection") {
          reflections[entry.lesson_id] = entry.content || reflections[entry.lesson_id] || "";
          completed[entry.lesson_id] = true;
          return;
        }
        actionProofs[entry.lesson_id] = entry.content || actionProofs[entry.lesson_id] || "";
        completed[entry.lesson_id] = true;
      });

      return {
        ...localState,
        currentLessonId: runtimeCourseState.current_lesson_id || localState.currentLessonId,
        completed,
        actionProofs,
        reflections,
        vcCandidate: runtimeCourseState.vc_candidate || localState.vcCandidate || null,
      };
    }

    async function syncRuntimeState() {
      try {
        const response = await fetch(learningEndpoints.state, {
          credentials: "same-origin",
        });
        if (!response.ok) {
          runtimeCourseState = null;
          return null;
        }
        const payload = await response.json().catch(() => ({}));
        runtimeCourseState = payload.course_state || null;
        return runtimeCourseState;
      } catch {
        runtimeCourseState = null;
        return null;
      }
    }

    async function postRuntime(endpoint, body) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("runtime_request_failed");
      }
      const payload = await response.json().catch(() => ({}));
      runtimeCourseState = payload.course_state || runtimeCourseState;
      return payload;
    }

    function getLessonStatus(lesson, state) {
      if (state.completed[lesson.id]) return "completed";
      if (state.currentLessonId === lesson.id) return "in_progress";
      if (lesson.type === "action" || lesson.type === "project") return "needs_action";
      if (lesson.type === "reflection") return "needs_review";
      return "not_started";
    }

    function nextLesson(lessonId) {
      const idx = lessons.findIndex((item) => item.id === lessonId);
      return idx >= 0 ? lessons[idx + 1] || null : null;
    }

    function aiReply(input, lesson) {
      const normalized = String(input || "").toLowerCase();
      if (normalized.includes("ví dụ") || normalized.includes("example")) {
        return copy(
          "Ví dụ đơn giản: chọn một việc rất nhỏ bạn có thể làm trong hôm nay, làm ngay trong 15 phút, rồi ghi lại kết quả.",
          "A simple example: pick one small thing you can do today, do it in 15 minutes, then write down the result.",
        );
      }
      if (normalized.includes("kẹt") || normalized.includes("stuck")) {
        return copy(
          "Bạn đang bị kẹt vì cố làm quá nhiều cùng lúc. Mình đề xuất tách bài này thành một bước nhỏ và làm ngay bây giờ.",
          "You are stuck because you are trying to do too much at once. Break this lesson into one small step and do it now.",
        );
      }
      return copy(
        "Để mình nói đơn giản: bài này giúp bạn hiểu rõ hơn một điểm quan trọng, rồi chuyển ngay thành hành động có thể kiểm chứng.",
        "In simple terms: this lesson clarifies one important point, then turns it into a verifiable action right away.",
      );
    }

    function render() {
      const state = mergeWithRuntime(loadState());
      const accessDenied = new URL(window.location.href).searchParams.get("access") === "denied";
      const lesson = lessons.find((item) => item.id === state.currentLessonId) || lessons[0];
      const doneCount = Object.values(state.completed).filter(Boolean).length;
      const progressMilestone = doneCount + " / " + lessons.length;
      const runtimeSubmissions = Object.values(runtimeCourseState?.submissions || {}).filter((entry) => entry && typeof entry === 'object');
      const proofCount = runtimeSubmissions.length > 0
        ? runtimeSubmissions.filter((entry) => entry.submission_type !== 'reflection').length
        : Object.keys(state.actionProofs).length;
      const reflectionCount = runtimeSubmissions.length > 0
        ? runtimeSubmissions.filter((entry) => entry.submission_type === 'reflection').length
        : Object.keys(state.reflections).length;
      const vcCandidate = state.vcCandidate || null;
      const eligible = Boolean(vcCandidate?.eligible);
      const submittedCount = Number.isFinite(Number(vcCandidate?.submitted_count)) ? Number(vcCandidate.submitted_count) : proofCount + reflectionCount;
      const reviewingCount = Number.isFinite(Number(vcCandidate?.reviewing_count)) ? Number(vcCandidate.reviewing_count) : 0;
      const approvedCount = Number.isFinite(Number(vcCandidate?.approved_count)) ? Number(vcCandidate.approved_count) : 0;
      const outstandingCount = Array.isArray(vcCandidate?.outstanding_types) ? vcCandidate.outstanding_types.length : 0;
      const nxt = lesson ? nextLesson(lesson.id) : null;

      if (!lesson) {
        root.innerHTML = '<div class="result-shell"><h3>' + escapeHtml(localized("Chưa có bài học", "No lessons yet")) + '</h3><p class="body-copy">' + escapeHtml(localized("Khóa học này chưa có lesson khả dụng.", "This course has no available lessons yet.")) + '</p></div>';
        window.vetuonglaiSyncLanguage?.();
        return;
      }

      if (accessDenied) {
        root.innerHTML = '<div class="result-shell"><h3>' + escapeHtml(localized("Bạn chưa có quyền truy cập", "No access")) + '</h3><p class="body-copy">' + escapeHtml(localized("Bạn cần quyền truy cập hợp lệ để mở Course Player này.", "You need valid access to open this course player.")) + '</p></div>';
        window.vetuonglaiSyncLanguage?.();
        return;
      }

      const systemState = vcCandidate?.status === "vc_candidate_ready"
        ? copy("đủ điều kiện vào bước xác minh", "eligible for verification")
        : vcCandidate?.status === "reviewing"
          ? copy("đang được rà soát", "under review")
          : vcCandidate?.status === "submitted"
            ? copy("đã nộp, chờ rà soát", "submitted, awaiting review")
          : eligible
            ? copy("đủ điều kiện để nộp xét duyệt", "eligible for review")
            : copy("đang tiến hành", "in progress");

      root.innerHTML = [
        '<div class="edu-player-layout">',
        '<aside class="edu-sidebar card"><div class="card-body stack">',
        '<h3 class="card-title">' + escapeHtml(localized("Lộ trình khóa học", "Course path")) + '</h3>',
        '<div class="subtle">' + escapeHtml(localized("Tiến trình", "Progress")) + ': ' + escapeHtml(progressMilestone) + '</div>',
        '<div class="badge member-preview">' + escapeHtml(localized(systemState.vi, systemState.en)) + '</div>',
        '<div class="stack">',
        lessons.map((item) => {
          const st = statusLabel(getLessonStatus(item, state));
          const active = item.id === lesson.id ? ' style="outline:2px solid var(--accent);"' : "";
          return '<button class="button ghost" data-lesson="' + escapeHtml(item.id) + '"' + active + '>' +
            '<span class="mono">' + escapeHtml(item.moduleIndex) + '</span> ' +
            escapeHtml(localized(item.title, item.titleEn)) +
            '<br><span class="subtle">' + escapeHtml(localized(st.vi, st.en)) + '</span></button>';
        }).join(''),
        '</div>',
        '<a class="button ghost" href="/">' + escapeHtml(localized("Về dashboard", "Back to dashboard")) + '</a>',
        '</div></aside>',

        '<section class="edu-main card"><div class="card-body stack">',
        '<div class="badge live">' + escapeHtml(localized("Bài học đang học", "Current lesson")) + '</div>',
        '<h2 class="section-title">' + escapeHtml(localized(lesson.title, lesson.titleEn)) + '</h2>',
        '<div class="body-copy"><strong>' + escapeHtml(localized("Mục tiêu:", "Objective:")) + '</strong> ' + escapeHtml(localized(lesson.objective, lesson.objectiveEn)) + '</div>',
        '<div class="body-copy"><strong>' + escapeHtml(localized("Vì sao quan trọng:", "Why this matters:")) + '</strong> ' + escapeHtml(localized(lesson.why, lesson.whyEn)) + '</div>',
        '<div class="body-copy">' + escapeHtml(localized(lesson.body, lesson.bodyEn)) + '</div>',
        '<article class="card"><div class="card-body stack">',
        '<h3 class="card-title">' + escapeHtml(localized("Action cuối bài", "End-of-lesson action")) + '</h3>',
        '<div class="body-copy">' + escapeHtml(localized(lesson.actionStep, lesson.actionStepEn)) + '</div>',
        '<div class="cluster"><button class="button primary" data-mark-complete="true">' + escapeHtml(localized("Đánh dấu đã học", "Mark lesson complete")) + '</button>',
        '<button class="button ghost" data-next="true">' + escapeHtml(localized("Làm bước tiếp theo", "Take next step")) + '</button></div>',
        '</div></article>',
        '<article class="card"><div class="card-body stack">',
        '<h3 class="card-title">' + escapeHtml(localized("Nộp bằng chứng", "Submit proof")) + '</h3>',
        '<textarea id="proof-input" class="search-input" style="padding:12px;min-height:90px" placeholder="' + escapeHtml(localized("Mô tả việc bạn đã làm...", "Describe what you did...")) + '"></textarea>',
        '<div class="cluster"><button class="button" data-submit-proof="true">' + escapeHtml(localized("Nộp kết quả", "Submit outcome")) + '</button></div>',
        '</div></article>',
        '<article class="card"><div class="card-body stack">',
        '<h3 class="card-title">' + escapeHtml(localized("Reflection", "Reflection")) + '</h3>',
        '<div class="body-copy">' + escapeHtml(localized(lesson.reflectionQuestion, lesson.reflectionQuestionEn)) + '</div>',
        '<textarea id="reflection-input" class="search-input" style="padding:12px;min-height:90px" placeholder="' + escapeHtml(localized("Viết phản tư ngắn của bạn...", "Write your short reflection...")) + '"></textarea>',
        '<div class="cluster"><button class="button" data-submit-reflection="true">' + escapeHtml(localized("Lưu phản tư", "Save reflection")) + '</button></div>',
        '</div></article>',
        '</div></section>',

        '<aside class="edu-ai card"><div class="card-body stack">',
        '<h3 class="card-title">' + escapeHtml(localized("AI Tutor", "AI Tutor")) + '</h3>',
        '<div class="result-shell" id="ai-messages">' +
          (state.aiMessages.length === 0
            ? '<div class="subtle">' + escapeHtml(localized("Chào bạn. Bạn đang muốn thay đổi điều gì nhất lúc này?", "Hi. What is the one thing you most want to change right now?")) + '</div>'
            : state.aiMessages.map((m) => '<div class="body-copy"><strong>' + escapeHtml(m.role) + ':</strong> ' + escapeHtml(m.text) + '</div>').join('')) +
        '</div>',
        '<div class="cluster">',
        '<button class="button ghost" data-quick="Giải thích đơn giản hơn">' + escapeHtml(localized("Giải thích đơn giản hơn", "Simplify this")) + '</button>',
        '<button class="button ghost" data-quick="Cho tôi ví dụ thật">' + escapeHtml(localized("Cho tôi ví dụ thật", "Give me a real example")) + '</button>',
        '</div>',
        '<input id="ai-input" class="search-input" placeholder="' + escapeHtml(localized("Hỏi AI phần bạn chưa rõ...", "Ask AI what is unclear...")) + '" />',
        '<button class="button primary" data-send-ai="true">' + escapeHtml(localized("Hỏi AI", "Ask AI")) + '</button>',
        '<article class="card"><div class="card-body stack">',
        '<h4 class="card-title">' + escapeHtml(localized("Bước tiếp theo", "Next step")) + '</h4>',
        '<div class="body-copy">' + escapeHtml(nxt ? localized(nxt.title, nxt.titleEn) : localized("Bạn đã hoàn tất lộ trình. Kiểm tra điều kiện VC nhé.", "You completed the path. Check VC eligibility.")) + '</div>',
        '<div class="subtle">' + escapeHtml(localized("Rule: ", "Rule: ")) + escapeHtml(lesson.completionRule) + '</div>',
        '</div></article>',
        '<article class="card"><div class="card-body stack">',
        '<h4 class="card-title">' + escapeHtml(localized("Eligibility", "Eligibility")) + '</h4>',
        '<div class="body-copy">' + escapeHtml(localized("Bài hoàn tất", "Completed lessons")) + ': ' + doneCount + '/' + lessons.length + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Loại đã nộp", "Submitted types")) + ': ' + submittedCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Loại đang review", "Types under review")) + ': ' + reviewingCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Loại đã approve", "Approved types")) + ': ' + approvedCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Loại còn thiếu", "Outstanding types")) + ': ' + outstandingCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Proof đã nộp", "Submitted proofs")) + ': ' + proofCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Reflection đã lưu", "Saved reflections")) + ': ' + reflectionCount + '</div>',
        '<div class="body-copy">' + escapeHtml(localized("Trạng thái xét điều kiện xác minh", "Verification eligibility status")) + ': ' + escapeHtml(localized(systemState.vi, systemState.en)) + '</div>',
        '<div class="badge ' + (eligible ? 'live' : 'planned') + '">' + escapeHtml(eligible ? localized("Đủ điều kiện VC", "Eligible for VC") : localized("Chưa đủ điều kiện VC", "Not eligible for VC yet")) + '</div>',
        '<button class="button ' + (eligible ? 'primary' : 'ghost') + '" data-issue-vc="true">' + escapeHtml(
          vcCandidate?.status === 'vc_candidate_ready'
            ? localized("Đã đủ điều kiện vào bước xác minh", "Eligible for verification")
            : vcCandidate?.status === 'reviewing'
              ? localized("Hồ sơ đang được rà soát", "Verification review in progress")
              : vcCandidate?.status === 'submitted'
                ? localized("Đã nộp, chờ rà soát", "Submitted, awaiting review")
                : localized("Làm mới trạng thái xét duyệt", "Refresh verification status")
        ) + '</button>',
        '</div></article>',
        '</div></aside>',
        '</div>',
      ].join("");

      root.querySelectorAll('[data-lesson]').forEach((button) => {
        button.addEventListener('click', () => {
          const nextState = loadState();
          nextState.currentLessonId = button.getAttribute('data-lesson') || nextState.currentLessonId;
          saveState(nextState);
          render();
        });
      });

      root.querySelector('[data-mark-complete]')?.addEventListener('click', () => {
        const nextState = loadState();
        nextState.completed[lesson.id] = true;
        if (!nextState.currentLessonId) nextState.currentLessonId = lesson.id;
        saveState(nextState);
        postRuntime(learningEndpoints.progress, {
          course_slug: course.slug,
          lesson_id: lesson.id,
          progress_status: 'completed',
        }).then(syncRuntimeState).then(render).catch(() => {});
        render();
      });

      root.querySelector('[data-next]')?.addEventListener('click', () => {
        const nextState = loadState();
        const next = nextLesson(lesson.id);
        if (next) nextState.currentLessonId = next.id;
        saveState(nextState);
        render();
      });

      root.querySelector('[data-submit-proof]')?.addEventListener('click', () => {
        const input = root.querySelector('#proof-input');
        const value = (input && 'value' in input) ? String(input.value || '').trim() : '';
        if (!value) return;
        const nextState = loadState();
        nextState.actionProofs[lesson.id] = value;
        nextState.completed[lesson.id] = true;
        saveState(nextState);
        const submissionType = lesson.type === 'project' ? 'project_output' : 'action_proof';
        postRuntime(learningEndpoints.submission, {
          course_slug: course.slug,
          lesson_id: lesson.id,
          submission_type: submissionType,
          content: value,
        }).then(syncRuntimeState).then(render).catch(() => {});
        render();
      });

      root.querySelector('[data-submit-reflection]')?.addEventListener('click', () => {
        const input = root.querySelector('#reflection-input');
        const value = (input && 'value' in input) ? String(input.value || '').trim() : '';
        if (!value) return;
        const nextState = loadState();
        nextState.reflections[lesson.id] = value;
        nextState.completed[lesson.id] = true;
        saveState(nextState);
        postRuntime(learningEndpoints.submission, {
          course_slug: course.slug,
          lesson_id: lesson.id,
          submission_type: 'reflection',
          content: value,
        }).then(syncRuntimeState).then(render).catch(() => {});
        render();
      });

      const send = (text) => {
        const message = String(text || '').trim();
        if (!message) return;
        const nextState = loadState();
        nextState.aiMessages.push({ role: 'You', text: message });
        const reply = aiReply(message, lesson);
        nextState.aiMessages.push({ role: 'AI', text: localized(reply.vi, reply.en) });
        saveState(nextState);
        render();
      };

      root.querySelector('[data-send-ai]')?.addEventListener('click', () => {
        const input = root.querySelector('#ai-input');
        const value = (input && 'value' in input) ? String(input.value || '') : '';
        send(value);
      });

      root.querySelectorAll('[data-quick]').forEach((button) => {
        button.addEventListener('click', () => send(button.getAttribute('data-quick') || ''));
      });

      root.querySelector('[data-issue-vc]')?.addEventListener('click', () => {
        syncRuntimeState().then(render).catch(() => render());
      });

      window.vetuonglaiSyncLanguage?.();
    }

    root.innerHTML = '<div class="result-shell"><div class="subtle">' + localized("Đang tải Course Player...", "Loading course player...") + '</div></div>';
    window.setTimeout(async () => {
      await syncRuntimeState();
      render();
    }, 220);
  `;

  return renderShell({
    currentKey: "edu",
    pathname: `/learn/${course.slug}/player/`,
    title: pair(`${course.title} • Lesson Player`, `${course.titleEn} • Lesson Player`),
    description: pair(
      `Màn hình học thực chiến có AI đồng hành cho khóa ${course.title}.`,
      `AI-guided action learning player for ${course.titleEn}.`,
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Course Player", "Course player"), pair("Sidebar, nội dung bài học, AI panel, action zone, progress và eligibility VC", "Sidebar, lesson content, AI panel, action zone, progress, and VC eligibility"), shell),
    ],
    inlineScript,
  });
}

function renderGreenPage() {
  const deepCta = deepContentHubCta("green", "green-depth", "green-home");
  const greenSurface = resolveSurfacePublicMeta("green");
  const cards = renderCards([
    renderCard({
      title: cardTitle(pair("Hồ sơ tác động", "Impact dossier")),
      badge: statusBadge(surfaceBadgeClass(greenSurface.status), pair("bằng chứng", "proof")),
      body: cardText(pair(
        "GREEN ghi nhận hành động, tạo hồ sơ và giữ bằng chứng ở dạng kiểm tra được.",
        "GREEN records action, builds a dossier, and keeps evidence in a checkable form.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Bộ bằng chứng", "Evidence bundle")),
      badge: statusBadge(surfaceBadgeClass(greenSurface.status), pair("gói bằng chứng", "evidence bundle")),
      body: cardText(pair(
        "Mỗi hồ sơ tác động phải đủ baseline, bằng chứng trong quá trình thực hiện và phần đối chiếu sau cùng.",
        "Each impact dossier needs a baseline, execution evidence, and a final check layer.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Neo vào VC", "Anchored to VC")),
      badge: statusBadge(surfaceBadgeClass(greenSurface.status), pair("xác minh", "verification")),
      body: cardText(pair(
        "GREEN tạo hồ sơ tác động, nhưng lớp xác minh chính thức vẫn đi qua VC.",
        "GREEN creates the impact dossier, but the formal verification layer still runs through VC.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0008`, pair("Xem sample VC", "View VC sample"), "ghost"),
    }),
  ]);

  const standards = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Cách hoạt động", "How it works"))}
          ${renderList([
            pair("Tạo hồ sơ tác động", "Create the impact dossier"),
            pair("Thu thập bằng chứng", "Collect evidence"),
            pair("Gom thành bộ bằng chứng", "Turn it into an evidence bundle"),
            pair("Neo sang VC", "Anchor it into VC"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Điều quan trọng", "What matters"))}
          ${renderList([
            pair("Không có bằng chứng thì không có giá trị.", "Without evidence, there is no value."),
            pair("Không dùng nhãn xanh mơ hồ.", "Do not rely on vague green labels."),
            pair("Minh bạch vừa đủ tốt hơn công bố tràn lan.", "Sufficient transparency is better than excessive exposure."),
          ])}
        </div>
      </article>
    </div>
  `;

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "green",
    deepCta,
    notes: [
      pair("Lớp public cho thấy cấu trúc hồ sơ tác động, cách gom bằng chứng và bản kiểm tra mẫu; phần sâu hơn vẫn đi qua hub.", "The public layer shows the impact dossier structure, evidence collection, and a sample verification path; deeper layers still go through the hub."),
      pair("GREEN không mở một bước thanh toán riêng để tránh những tuyên bố vượt quá bằng chứng đang có.", "GREEN does not open a separate payment step so the page never makes claims beyond the evidence that is available."),
    ],
    disclosureIds: ["DPM-012", "DPM-021"],
    secondaryActions: `${button(`https://${domains.vc}/v/VC-2026-0008`, pair("Mở sample VC", "Open sample VC"), "ghost")} ${button(`https://${domains.hub}/he-sinh-thai/`, pair("Xem hệ", "View ecosystem"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "green",
    extraItems: [
      pair("GREEN là lớp public đang hoạt động, nhưng chỉ nêu tác động khi có hồ sơ và cách kiểm tra rõ ràng.", "GREEN is a live public layer, but it states impact only when the dossier and checking path are clear."),
      pair("Không dùng khẩu hiệu xanh để thay cho bằng chứng.", "Green slogans are never used as a substitute for evidence."),
      pair("Khi người dùng cần đi sâu hơn, hệ sẽ quay về hub thay vì mở thanh toán tại GREEN.", "When people need to go deeper, the path returns to the hub instead of opening payment on GREEN."),
    ],
    disclosureIds: ["DPM-012", "DPM-021"],
    actions: `${button(`https://${domains.vc}/`, pair("Mở VC", "Open VC"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const hero = renderHero({
    eyebrow: codexPair("sites.green.hero.eyebrow", "Lớp xanh", "Green layer"),
    title: codexPair("sites.green.hero.title", "XANH", "GREEN"),
    description: codexPair(
      "sites.green.hero.subline",
      "Biến tuyên bố xanh thành bằng chứng.",
      "Turn green claims into evidence.",
    ),
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0008`, codexPair("sites.green.hero.primary_cta", "Xem hồ sơ mẫu", "View a sample dossier")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-012"]),
    aside: renderMetrics([
      { value: "30d", label: pair("chu kỳ pilot", "pilot cycle") },
      { value: "3", label: pair("lớp bằng chứng", "proof layers") },
      { value: "VC", label: pair("điểm xác minh", "verification endpoint") },
      { value: appStageLabel(greenSurface), label: pair("trạng thái", "status") },
    ]),
  });

  return renderShell({
    currentKey: "green",
    pathname: "/",
    title: codexPair("sites.green.seo.title", "GREEN | Biến tuyên bố xanh thành bằng chứng", "GREEN | Turn green claims into evidence"),
    description: codexPair(
      "sites.green.seo.description",
      "GREEN ghi nhận hành động, tạo hồ sơ tác động và neo bằng chứng sang lớp xác minh để tránh greenwashing.",
      "GREEN records action, builds an impact dossier, and anchors evidence into the verification layer to avoid vague green claims.",
    ),
    navItems: ecosystemNav("green"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("GREEN biến hành động xanh thành hồ sơ, bộ bằng chứng và cách kiểm tra rõ ràng.", "GREEN turns green action into dossiers, evidence bundles, and a clear way to verify them."), cards, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Bản demo này cho thấy cách GREEN chuyển từ hành động sang hồ sơ có thể xác minh.", "This demo shows how GREEN moves from action to a dossier that can be verified."), standards, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderFinancePage() {
  const deepCta = deepContentHubCta("finance", "finance-depth", "finance-home");
  const financeSurface = resolveSurfaceEntry("finance");
  const tracks = renderCards([
    renderCard({
      title: cardTitle(pair("Hiểu tiền", "Understand money")),
      badge: statusBadge("live", pair("nền tảng", "core")),
      body: cardText(pair(
        "FIN giúp hiểu tiền, giữ tiền và nhìn rõ dòng tiền trước khi nghĩ tới bước tiếp theo.",
        "FIN helps people understand money, protect it, and see cash flow clearly before anything else.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0012`, pair("Chứng nhận mẫu", "Sample credential"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Tránh rủi ro", "Reduce risk")),
      badge: statusBadge("live", pair("an toàn", "safety")),
      body: cardText(pair(
        "Bộ lọc chống lừa đảo giúp người dùng nhận diện áp lực khẩn cấp, lời hứa lợi nhuận và nguồn tin không kiểm tra được.",
        "The anti-scam filter helps users spot urgency pressure, profit promises, and uncheckable sources.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Điều không làm", "What this layer does not do")),
      badge: statusBadge("live", pair("kỷ luật", "discipline")),
      body: cardText(pair(
        "FIN không dạy làm giàu nhanh, không dạy trading và không dùng ngôn ngữ tự do tài chính.",
        "FIN does not teach get-rich-quick ideas, does not teach trading, and does not use financial-freedom language.",
      )),
    }),
  ]);

  const checklist = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Nguyên tắc", "Principles"))}
          ${renderList([
            pair("Không đầu tư khi chưa hiểu", "Do not invest before understanding"),
            pair("Không tin lời hứa lợi nhuận", "Do not trust profit promises"),
            pair("Luôn kiểm tra rủi ro trước", "Always check risk first"),
            pair("Giữ buffer trước khi nghĩ tới tăng tốc", "Protect a buffer before chasing acceleration"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Checklist tiền", "Money checklist"))}
          ${cardText(pair(
            "Bắt đầu từ buffer, dòng tiền, nhịp chi tiêu và bộ lọc chống lừa đảo trước khi nghĩ tới các quyết định khó hơn.",
            "Start with buffer, cash flow, spending rhythm, and scam filters before moving into harder decisions.",
          ), "body-copy")}
        </div>
      </article>
    </div>
  `;

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "finance",
    deepCta,
    notes: [
      pair("FIN mở khung anti-scam, checklist tiền và lộ trình công khai trước; phần đi sâu hơn hoặc pack vẫn đi qua hub.", "FIN opens the anti-scam frame, the money checklist, and the public path first; deeper learning or packs still go through the hub."),
      pair("Không có purchase flow, không có unlock form và không có hứa hẹn tài chính tại finance subdomain.", "There is no purchase flow, no unlock form, and no financial promise on the FINANCE subdomain."),
    ],
    disclosureIds: ["DPM-013", "DPM-021"],
    secondaryActions: `${button(`#money-checklist`, pair("Xem checklist", "Open checklist"), "ghost")} ${button(`https://${domains.vc}/v/VC-2026-0012`, pair("Mở chứng nhận mẫu", "Open sample credential"), "ghost")}`,
  });

  const trustStatusSection = renderSurfaceTrustStatusSection({
    currentKey: "finance",
    extraItems: [
      pair("FIN là live public layer cho money clarity, risk reduction và anti-scam literacy.", "FIN is a live public layer for money clarity, risk reduction, and anti-scam literacy."),
      pair("Không dùng các cụm như “financial freedom” hay “làm giàu nhanh” trên public surface này.", "Terms like “financial freedom” or “get rich quick” are not used on this public surface."),
      pair("Checklist công khai phải có ích ngay cả khi user chưa mở layer sâu hơn.", "The public checklist must stay useful even when the user has not opened a deeper layer."),
    ],
    disclosureIds: ["DPM-013", "DPM-021"],
    actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`https://${domains.vc}/`, pair("Mở VC", "Open VC"), "ghost")}`,
  });

  const hero = renderHero({
    eyebrow: codexPair("sites.finance.hero.eyebrow", "Lớp tài chính", "Finance layer"),
    title: codexPair("sites.finance.hero.title", "TIỀN", "MONEY"),
    description: codexPair(
      "sites.finance.hero.subline",
      "Hiểu tiền trước khi cố kiếm thêm tiền.",
      "Understand money before trying to earn more.",
    ),
    actions: [
      button(`#money-checklist`, codexPair("sites.finance.hero.primary_cta", "Xem checklist tiền", "View the money checklist")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-013"]),
    aside: renderMetrics([
      { value: "21d", label: pair("thời lượng sprint", "sprint length") },
      { value: "8", label: pair("dấu hiệu anti-scam", "anti-scam signals") },
      { value: "VC", label: pair("cầu chứng nhận", "credential bridge") },
      { value: appStageLabel(financeSurface), label: pair("trạng thái", "status") },
    ]),
  });

  return renderShell({
    currentKey: "finance",
    pathname: "/",
    title: codexPair("sites.finance.seo.title", "FINANCE | Hiểu tiền trước khi kiếm thêm", "FINANCE | Understand money before earning more"),
    description: codexPair(
      "sites.finance.seo.description",
      "FINANCE giúp hiểu tiền, giữ tiền và tránh rủi ro bằng kỷ luật dòng tiền, bộ lọc chống lừa đảo và tư duy dài hạn.",
      "FINANCE helps people understand money, protect it, and reduce risk through discipline, scam filters, and long-term clarity.",
    ),
    navItems: ecosystemNav("finance"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("FIN giữ trọng tâm ở hiểu tiền, tránh rủi ro và kỷ luật dài hạn.", "FIN stays focused on money clarity, risk reduction, and long-term discipline."), tracks, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Checklist công khai này cho user một khung tự kiểm tra trước khi nghĩ tới bước tài chính tiếp theo.", "This public checklist gives users a self-check frame before they take the next financial step."), `<div id="money-checklist">${checklist}</div>`, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderLifePage() {
  const deepCta = deepContentHubCta("life", "life-depth", "life-home");
  const lifeSurface = resolveSurfacePublicMeta("life");
  const vcSurface = resolveSurfacePublicMeta("vc");
  const blocks = renderCards([
    renderCard({
      title: cardTitle(pair("Ổn định nhịp sống", "Stabilize rhythm")),
      badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
      body: cardText(pair(
        "LIFE bắt đầu từ giấc ngủ, giờ thức dậy, năng lượng và nhịp sống có thể quan sát được.",
        "LIFE begins with sleep, wake time, energy, and an observable rhythm.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Tạo kỷ luật nền", "Build baseline discipline")),
      badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
      body: cardText(pair(
        "Mục tiêu không phải làm thêm nhiều việc. Mục tiêu là giữ một nhịp sống ổn định, lặp lại được và ít lệch hơn.",
        "The goal is not more activity. It is a stable rhythm that can be repeated with less drift.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Giữ năng lượng", "Protect energy")),
      badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
      body: cardText(pair(
        "Không có nhịp sống ổn định thì rất khó học đúng, làm sâu hoặc tạo giá trị bền.",
        "Without a stable rhythm, it is hard to learn well, work deeply, or create lasting value.",
      )),
      actions: button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    }),
  ]);

  const operatingLoop = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Cách làm", "How it works"))}
          ${renderList([
            pair("Baseline 7 ngày", "Seven-day baseline"),
            pair("Nhịp 30 ngày", "Thirty-day rhythm"),
            pair("Review hàng tuần", "Weekly review"),
            pair("Ghi nhận bằng dữ liệu thật", "Record through real data"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Điều cần hiểu", "What matters"))}
          ${renderList([
            pair("Không có nhịp sống thì không có ổn định.", "Without rhythm, there is no stability."),
            pair("Không ổn định thì rất khó học và làm sâu.", "Without stability, it is hard to learn or work deeply."),
            pair("LIFE là lớp nền trước khi tối ưu các phần khác.", "LIFE is the baseline layer before optimizing anything else."),
          ])}
        </div>
      </article>
    </div>
  `;

  const readiness = renderCards([
    renderCard({
      title: cardTitle(pair("Lớp public đang mở", "Public layer is open")),
      badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
      body: cardText(pair(
        "LIFE hiện công bố triết lý, baseline và cách bắt đầu mà không cần dùng ngôn ngữ nội bộ.",
        "LIFE now publishes the philosophy, baseline, and starting logic in public-facing language.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lớp member mở sâu hơn", "Member layer goes deeper")),
      badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
      body: cardText(pair(
        "Các phần review sâu hơn, bộ tài liệu đi tiếp và xác minh chỉ nên mở khi lớp thành viên đã sẵn sàng hơn.",
        "Deeper reviews, follow-on materials, and verification should open only when the member layer is more ready.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lớp xác minh liên quan", "Related verification layer")),
      badge: statusBadge(surfaceBadgeClass(vcSurface.status), appStageLabel(vcSurface)),
      body: cardText(pair(
        "Khi cần bằng chứng rõ hơn, LIFE có thể nối sang VC bằng bộ hồ sơ tối thiểu.",
        "When stronger evidence is needed, LIFE can connect to VC through a minimum dossier.",
      )),
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "life",
    deepCta,
    notes: [
      pair("Public LIFE mở baseline, nhịp thực hành và cách tự rà soát; phần dành cho thành viên cần đi sâu hơn vẫn quay về hub để không nói quá vai trò của trang này.", "Public LIFE opens the baseline, daily rhythm, and self-review logic; deeper member-only support still returns to the hub so the page does not overstate its role."),
      pair("Nếu cần đi sâu hơn vào bộ tài liệu đi tiếp hoặc định hướng cá nhân, người dùng sẽ tiếp tục từ hub.", "If deeper materials or more personal guidance are needed, people continue from the hub."),
    ],
    disclosureIds: ["DPM-014", "DPM-021"],
    secondaryActions: `${button(`#life-baseline`, pair("Xem baseline", "Open baseline"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSection(
    pair("Trust & trạng thái", "Trust & status"),
    pair(
      "Làm rõ đây là lớp Planned có giá trị thật, nhưng chưa được nói như một lớp hỗ trợ đã mở đầy đủ.",
      "Clarify that this is a meaningful Planned surface without presenting it as a fully open support layer.",
    ),
    `
      ${readiness}
      <div style="margin-top:18px">
        ${renderCards([
          renderCard({
            title: cardTitle(pair("Trạng thái surface", "Surface status")),
            badge: statusBadge(surfaceBadgeClass(lifeSurface.status), appStageLabel(lifeSurface)),
            body: cardText(surfaceStatusNarrative("life")),
          }),
          renderCard({
            title: cardTitle(pair("Boundary công khai", "Public boundary")),
            body: renderList(surfaceBoundaryItems("life", [
              pair("Lớp public nói về nhịp sống, baseline và review; không được trình bày như một dịch vụ hỗ trợ đã mở sẵn.", "The public layer talks about rhythm, baselines, and review; it is not presented as a fully open support service."),
              pair("Các claim về phục hồi hay chuyển hóa đều phải bám observation thật, không self-help hype.", "Claims about recovery or transformation must stay grounded in real observation, not self-help hype."),
            ])),
          }),
          renderCard({
            title: cardTitle(pair("Trust note", "Trust note")),
            body: cardText(pair(
              "LIFE giữ giọng điệu bình tĩnh, không nói quá và không ép người dùng mua trước khi hiểu baseline của mình.",
              "LIFE keeps a calm tone, does not overstate outcomes, and never pushes people to buy before they understand their own baseline.",
            )),
            support: renderDisclosureStack(["DPM-014", "DPM-021"], { className: "is-footer" }),
            actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`#life-baseline`, pair("Xem baseline", "Open baseline"), "ghost")}`,
          }),
        ])}
      </div>
    `,
    "trust-status",
  );

  const hero = renderHero({
    eyebrow: codexPair("sites.life.hero.eyebrow", "Lớp đời sống", "Life layer"),
    title: codexPair("sites.life.hero.title", "NHỊP SỐNG", "RHYTHM"),
    description: codexPair(
      "sites.life.hero.subline",
      "Ổn định cuộc sống trước khi tối ưu cuộc đời.",
      "Stabilize life before trying to optimize it.",
    ),
    actions: [
      button(`#life-baseline`, codexPair("sites.life.hero.primary_cta", "Bắt đầu từ baseline", "Start from the baseline")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-014"]),
    aside: renderMetrics([
      { value: "14d", label: pair("chu kỳ pilot", "pilot cycle") },
      { value: "3", label: pair("khối ritual", "ritual blocks") },
      { value: "baseline", label: pair("điểm bắt đầu", "starting point") },
      { value: appStageLabel(lifeSurface), label: pair("trạng thái", "status") },
    ]),
  });

  return renderShell({
    currentKey: "life",
    pathname: "/",
    title: codexPair("sites.life.seo.title", "LIFE | Ổn định nhịp sống trước khi tối ưu", "LIFE | Stabilize rhythm before optimization"),
    description: codexPair(
      "sites.life.seo.description",
      "LIFE giúp ổn định nhịp sống, giữ năng lượng và tạo kỷ luật nền bằng baseline, review tuần và dữ liệu thật.",
      "LIFE helps people stabilize rhythm, protect energy, and build discipline through baselines, weekly review, and real observation.",
    ),
    navItems: ecosystemNav("life"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("LIFE giữ trọng tâm ở nhịp sống, kỷ luật và năng lượng nền.", "LIFE stays focused on rhythm, discipline, and baseline energy."), blocks, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Baseline và review công khai giúp user nhận giá trị thật trước khi đi sâu hơn.", "The public baseline and review help users get real value before they go deeper."), `<div id="life-baseline">${operatingLoop}</div>`, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderInvestPage() {
  const deepCta = deepContentHubCta("invest", "invest-depth", "invest-home");
  const investSurface = resolveSurfacePublicMeta("invest");
  const blocks = renderCards([
    renderCard({
      title: cardTitle(pair("Đọc rủi ro", "Read risk first")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "Đầu tư không bắt đầu từ kỳ vọng. Nó bắt đầu từ việc hiểu mình có thể mất gì.",
        "Investing does not begin with upside. It begins with understanding what you can lose.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Thẩm định độc lập", "Independent due diligence")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "INVEST dùng checklist để kiểm tra nguồn thông tin, cấu trúc rủi ro và các vùng mờ trước quyết định.",
        "INVEST uses a checklist to validate sources, risk structure, and blind spots before a decision.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Không FOMO", "No FOMO")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "Không all-in, không chạy theo đám đông và không dùng niềm tin chưa kiểm tra làm tỷ trọng quá lớn.",
        "No all-in behavior, no crowd chasing, and no turning an untested belief into oversized exposure.",
      )),
      actions: button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    }),
  ]);

  const diligence = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Checklist đầu tư", "Investing checklist"))}
          ${renderList([
            pair("Hiểu sản phẩm", "Understand the product"),
            pair("Hiểu dòng tiền", "Understand cash flow"),
            pair("Hiểu downside", "Understand downside"),
            pair("Có nguyên tắc thoát", "Have an exit rule"),
            pair("Không vào chỉ vì FOMO", "Do not enter because of FOMO"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Nguyên tắc", "Principles"))}
          ${renderList([
            pair("Không FOMO", "No FOMO"),
            pair("Không all-in", "No all-in"),
            pair("Không tin người không chứng minh được", "Do not trust people without evidence"),
            pair("Ưu tiên sống sót dài hạn hơn thắng nhanh", "Favor long-term survival over quick wins"),
          ])}
        </div>
      </article>
    </div>
  `;

  const readiness = renderCards([
    renderCard({
      title: cardTitle(pair("Lớp công khai", "Public layer")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "INVEST hiện công bố rõ tư duy đặt rủi ro lên trước, tự thẩm định và không chạy theo đám đông.",
        "INVEST now clearly publishes a risk-first, self-checking, and no-crowd-chasing philosophy.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lớp bằng chứng", "Evidence layer")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "Khi cần bằng chứng về quá trình thẩm định, INVEST có thể nối sang VC qua bộ hồ sơ phù hợp.",
        "When due-diligence proof is needed, INVEST can connect into VC through a suitable dossier.",
      )),
      actions: button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Biên độ công khai", "Public boundary")),
      badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
      body: cardText(pair(
        "Lớp công khai chỉ giúp người dùng hiểu rủi ro rõ hơn. Nó không phải lời khuyên mua bán.",
        "The public layer helps people understand risk more clearly. It is not trading advice.",
      )),
    }),
  ]);

  const gatewaySection = renderSurfaceGatewaySection({
    currentKey: "invest",
    deepCta,
    notes: [
      pair("Public INVEST mở khung đọc rủi ro, checklist tự thẩm định và nguyên tắc không chạy theo đám đông; phần sâu hơn vẫn quay về hub.", "Public INVEST opens a risk-reading frame, self-check checklist, and a no-crowd-chasing rule; deeper learning still returns to the hub."),
      pair("Không có phòng tín hiệu, không có kèo mua bán và không có bước thanh toán tại invest subdomain.", "There is no signal room, no trade call, and no payment step on the INVEST subdomain."),
    ],
    disclosureIds: ["DPM-015", "DPM-021"],
    secondaryActions: `${button(`#invest-checklist`, pair("Xem checklist", "Open checklist"), "ghost")} ${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")}`,
  });

  const trustStatusSection = renderSection(
    pair("Trust & trạng thái", "Trust & status"),
    pair(
      "Giữ INVEST ở đúng trạng thái Planned: đặt rủi ro lên trước, rõ lưu ý cần thiết và không nói quá về kết quả.",
      "Keep INVEST in the right Planned state: put risk first, keep the needed cautions explicit, and do not overclaim outcomes.",
    ),
    `
      ${readiness}
      <div style="margin-top:18px">
        ${renderCards([
          renderCard({
            title: cardTitle(pair("Trạng thái surface", "Surface status")),
            badge: statusBadge(surfaceBadgeClass(investSurface.status), appStageLabel(investSurface)),
            body: cardText(surfaceStatusNarrative("invest")),
          }),
          renderCard({
            title: cardTitle(pair("Boundary công khai", "Public boundary")),
            body: renderList(surfaceBoundaryItems("invest", [
              pair("Public layer chỉ giúp người dùng đọc rủi ro rõ hơn; nó không phải khuyến nghị mua bán.", "The public layer only helps users read risk more clearly; it is not buy/sell advice."),
              pair("Không chạy theo đám đông là nguyên tắc vận hành, không phải slogan trang trí.", "No crowd-chasing is an operating rule, not a decorative slogan."),
            ])),
          }),
          renderCard({
            title: cardTitle(pair("Trust note", "Trust note")),
            body: cardText(pair(
              "INVEST không hứa lợi nhuận, không cho tín hiệu giao dịch và luôn đặt kịch bản xấu lên trước phần tăng trưởng kỳ vọng.",
              "INVEST does not promise returns, does not give trading signals, and always places the loss scenario before the upside.",
            )),
            support: renderDisclosureStack(["DPM-015", "DPM-021"], { className: "is-footer" }),
            actions: `${button(`https://${domains.hub}/`, pair("Về hub", "Back to hub"), "ghost")} ${button(`#invest-checklist`, pair("Xem checklist", "Open checklist"), "ghost")}`,
          }),
        ])}
      </div>
    `,
    "trust-status",
  );

  const hero = renderHero({
    eyebrow: codexPair("sites.invest.hero.eyebrow", "Lớp đầu tư", "Investing layer"),
    title: codexPair("sites.invest.hero.title", "ĐẦU TƯ", "INVESTING"),
    description: codexPair(
      "sites.invest.hero.subline",
      "Đầu tư bắt đầu từ hiểu rủi ro.",
      "Investing starts with understanding risk.",
    ),
    actions: [
      button(`#invest-checklist`, codexPair("sites.invest.hero.primary_cta", "Xem checklist đầu tư", "View the investing checklist")),
      gatewayCtaButton(deepCta, "ghost"),
    ].join(""),
    afterActions: renderDisclosureStack(["DPM-015"]),
    aside: renderMetrics([
      { value: "5", label: pair("câu hỏi sàng lọc", "screening questions") },
      { value: "0", label: pair("độ dung nạp FOMO", "FOMO tolerance") },
      { value: appStageLabel(investSurface), label: pair("trạng thái", "status") },
      { value: "risk-first", label: pair("nguyên tắc", "principle") },
    ]),
  });

  return renderShell({
    currentKey: "invest",
    pathname: "/",
    title: codexPair("sites.invest.seo.title", "INVEST | Đầu tư bắt đầu từ hiểu rủi ro", "INVEST | Investing starts with risk awareness"),
    description: codexPair(
      "sites.invest.seo.description",
      "INVEST là lớp đầu tư tỉnh táo với risk-first thinking, due diligence và kỷ luật phân bổ vốn không FOMO.",
      "INVEST is the calm-investing layer built on risk-first thinking, due diligence, and allocation discipline without FOMO.",
    ),
    navItems: ecosystemNav("invest"),
    hero,
    sections: [
      renderSection(pair("Public value", "Public value"), pair("INVEST giữ trọng tâm ở đặt rủi ro lên trước, tự thẩm định và kỷ luật phân bổ.", "INVEST stays focused on putting risk first, self-checking, and allocation discipline."), blocks, "public-value"),
      renderSection(pair("Demo", "Demo"), pair("Checklist công khai để người dùng tự kiểm tra logic đầu tư trước khi đi sâu hơn.", "A public checklist so people can test their investing logic before they go deeper."), `<div id="invest-checklist">${diligence}</div>`, "demo"),
      gatewaySection,
      trustStatusSection,
    ],
  });
}

function renderStaticJson(data) {
  return JSON.stringify(data, null, 2);
}

function renderRobots(domain, sitemap = "/sitemap.xml") {
  const sitemapUrl = sitemap.startsWith("http") ? sitemap : `https://${domain}${sitemap}`;
  return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
}

function renderSitemap(domain, paths) {
  const items = paths.map((pathname) => `
  <url>
    <loc>https://${domain}${pathname}</loc>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>`;
}

function renderSitemapIndex(items) {
  const entries = items
    .map((item) => `
  <sitemap>
    <loc>${escapeHtml(item)}</loc>
  </sitemap>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</sitemapindex>`;
}

async function ensureDir(target) {
  await mkdir(target, { recursive: true });
}

async function acquireBuildLock() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    try {
      await mkdir(BUILD_LOCK_DIR);
      await writeFile(
        path.join(BUILD_LOCK_DIR, "owner.json"),
        JSON.stringify(
          {
            pid: process.pid,
            acquiredAt: new Date().toISOString(),
          },
          null,
          2,
        ),
        "utf8",
      );
      return;
    } catch (error) {
      if (error?.code !== "EEXIST") {
        throw error;
      }

      try {
        const lockStats = await stat(BUILD_LOCK_DIR);
        const ageMs = Date.now() - lockStats.mtimeMs;
        if (ageMs > BUILD_LOCK_MAX_AGE_MS) {
          await rm(BUILD_LOCK_DIR, { recursive: true, force: true });
          continue;
        }
      } catch (lockError) {
        if (lockError?.code !== "ENOENT") {
          throw lockError;
        }
        continue;
      }

      await delay(500);
    }
  }

  throw new Error("Timed out waiting for build lock.");
}

async function releaseBuildLock() {
  await rm(BUILD_LOCK_DIR, { recursive: true, force: true });
}

async function resetDistRoot() {
  const lockDirName = path.basename(BUILD_LOCK_DIR);
  const entries = await readdir(DIST);
  for (const entry of entries) {
    if (entry === lockDirName) {
      continue;
    }
    await rm(path.join(DIST, entry), { recursive: true, force: true });
  }
}

async function resetDomainDist(domain) {
  const domainRoot = path.join(DIST, domain);
  await rm(domainRoot, { recursive: true, force: true });
  await ensureDir(domainRoot);
}

async function writeSiteFile(domain, relativePath, content) {
  const target = path.join(DIST, domain, relativePath);
  await ensureDir(path.dirname(target));
  const nextContent = String(content ?? "");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const tempTarget = `${target}.tmp-${process.pid}-${Date.now()}-${attempt}`;
    try {
      await writeFile(tempTarget, nextContent, "utf8");
      await rename(tempTarget, target);
      return;
    } catch (error) {
      if (!["ECANCELED", "EBUSY", "ETIMEDOUT"].includes(error?.code) || attempt === 2) {
        throw error;
      }
      await delay(120 * (attempt + 1));
    }
  }
}

async function writeAssets(domain) {
  await writeSiteFile(domain, "assets/design-tokens.css", designTokensCss);
  await writeSiteFile(domain, "assets/design-tokens.json", designTokensJson);
  await writeSiteFile(domain, "assets/style.css", styleCss);
  await writeSiteFile(domain, "assets/app.js", sharedJs);
}

function buildLog(step) {
  console.log(`[build] ${step}`);
}

async function build() {
  buildLog("preparing dist");
  await ensureDir(DIST);
  await acquireBuildLock();

  try {
    await resetDistRoot();
    for (const domain of Object.values(domains)) {
      await resetDomainDist(domain);
    }
    buildLog("loading official docs lock");
    const officialDocsLock = await buildOfficialDocsLock(accessModel);

  const hubPaths = [
    "/",
    "/ve-chung-toi/",
    "/he-sinh-thai/",
    "/bat-dau/",
    "/thanh-vien/",
    "/tin-tuc/",
    "/lien-he/",
    "/sitemap/",
    "/apps.json",
    "/manifest.json",
  ];
  const vcPaths = ["/", "/v/", "/issuers/", "/methods/"];
  const memberPaths = ["/", "/journey/", "/app/", "/app/offline/"];
  const workPaths = ["/", "/brief/"];
  const marketPaths = ["/", "/rules/"];
  const communityPaths = ["/", "/principles/"];
  const aiPaths = ["/", "/use-cases/"];
  const eduPaths = [
    "/",
    "/courses/",
    "/api/health",
    "/api/catalog.json",
    "/api/courses/index.json",
    ...courses.flatMap((course) => [
      `/course/${course.slug}/`,
      `/learn/${course.slug}/`,
      `/learn/${course.slug}/player/`,
      `/api/courses/${course.slug}.json`,
      `/api/courses/${course.slug}/modules.json`,
      `/api/eligibility/${course.slug}.json`,
    ]),
  ];
  const simplePaths = ["/"];

  buildLog("rendering hub");
  await writeAssets(domains.hub);
  buildLog("rendering hub index body");
  const hubIndexHtml = renderHubPage();
  buildLog("writing hub index file");
  await writeSiteFile(domains.hub, "index.html", hubIndexHtml);
  buildLog("rendering hub about");
  await writeSiteFile(domains.hub, "ve-chung-toi/index.html", renderHubAboutPage());
  await writeSiteFile(domains.hub, "he-sinh-thai/index.html", renderHubEcosystemPage());
  await writeSiteFile(domains.hub, "bat-dau/index.html", renderHubStartPage());
  await writeSiteFile(domains.hub, "thanh-vien/index.html", renderHubMemberPage());
  await writeSiteFile(domains.hub, "tin-tuc/index.html", renderHubNewsPage());
  await writeSiteFile(domains.hub, "lien-he/index.html", renderHubContactPage());
  await writeSiteFile(domains.hub, "sitemap/index.html", renderHubSitemapPage());
  await writeSiteFile(domains.hub, "founder/index.html", renderFounderCommandPanelPage());
  await writeSiteFile(domains.hub, "apps.json", renderStaticJson(appCatalog));
  await writeSiteFile(domains.hub, "manifest.json", renderStaticJson(system));
  await writeSiteFile(domains.hub, "api/registry.json", renderStaticJson({
    lastUpdated: system.releaseDate || new Date().toISOString().slice(0, 10),
    domains: publicEcosystemDirectory
      .filter((entry) => domains[entry.key])
      .map((entry) => ({
        key: entry.key,
        domain: domains[entry.key],
        status: entry.status,
        statusLabel: entry.statusLabel,
        stageLabel: entry.stageLabel,
        mission: ecosystemMission[entry.key] || "",
        sourceOwner: `https://${domains[entry.key]}/`,
        canonicalUrl: `https://${domains[entry.key]}/`,
      })),
    canonicalRules: Array.from(pageMetaOverrides.entries()).map(([key, value]) => ({
      key,
      canonicalUrl: value.canonicalUrl,
      sourceOwner: value.sourceOwner,
      robots: value.robots,
    })),
  }));
  await writeSiteFile(domains.hub, "api/purchase-hub.json", renderStaticJson({
    version: accessModel.version,
    owner: accessModel.owner,
    homepagePurchaseHub: accessModel.homepagePurchaseHub,
    specialistPacks: accessModel.specialistPacks.map((pack) => ({
      key: pack.key,
      code: pack.code,
      slug: pack.slug,
      name: pack.name,
      price: pack.price,
    })),
    routeContract: accessModel.routeContract,
  }));
  await writeSiteFile(domains.hub, "api/team2-kickoff-output.json", renderStaticJson(buildTeam2KickoffOutput(accessModel.version)));
  await writeSiteFile(domains.hub, "api/disclosures.json", renderStaticJson({
    version: accessModel.version,
    source: "docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md",
    placements: disclosurePlacements,
  }));
  await writeSiteFile(domains.hub, "api/system-registry.json", renderStaticJson({
    version: systemRegistry.version || accessModel.version,
    statusVocabulary: systemRegistry.statusVocabulary || {},
    domains: publicEcosystemDirectory.map((entry) => ({
      key: entry.key,
      label: entry.label,
      status: entry.status,
      stageLabel: entry.stageLabel || "",
      statusLabel: entry.statusLabel,
      primaryNav: entry.primaryNav,
      mission: entry.mission || "",
      url: entry.url,
      sourceOwner: `https://${domains[entry.key]}/`,
    })),
  }));
  await writeSiteFile(domains.hub, "api/official-docs-lock.json", renderStaticJson(officialDocsLock));
  await writeSiteFile(domains.hub, "api/policy/team3-matrix.json", renderStaticJson(team3PolicyContract));
  await writeSiteFile(domains.hub, "api/team4/package-form-registry.json", renderStaticJson(packageFormRegistry));
  await writeSiteFile(domains.hub, "api/team4/business-domain-contract.json", renderStaticJson(businessDomainContract));
  await writeSiteFile(domains.hub, "api/team4/package-comparison-demo-output.json", renderStaticJson(packageComparisonDemoOutput));
  await writeSiteFile(domains.hub, "api/contracts.json", renderStaticJson(buildContractsManifest(accessModel.version, officialDocsLock)));
  await writeSiteFile(domains.hub, "api/index.json", renderStaticJson({
    name: "hub",
    contractVersion: accessModel.version,
    endpoints: [
      "/api/registry.json",
      "/api/purchase-hub.json",
      "/api/team2-kickoff-output.json",
      "/api/disclosures.json",
      "/api/system-registry.json",
      "/api/official-docs-lock.json",
      "/api/policy/team3-matrix.json",
      "/api/team4/package-form-registry.json",
      "/api/team4/business-domain-contract.json",
      "/api/team4/package-comparison-demo-output.json",
      "/api/contracts.json",
    ],
  }));
  await writeSiteFile(domains.hub, "robots.txt", renderRobots(domains.hub, "/sitemap-index.xml"));
  await writeSiteFile(domains.hub, "sitemap.xml", renderSitemap(domains.hub, hubPaths));
  await writeSiteFile(domains.hub, "sitemap-index.xml", renderSitemapIndex([
    `https://${domains.hub}/sitemap.xml`,
    `https://${domains.vc}/sitemap.xml`,
    `https://${domains.edu}/sitemap.xml`,
    `https://${domains.member}/sitemap.xml`,
    `https://${domains.work}/sitemap.xml`,
    `https://${domains.market}/sitemap.xml`,
    `https://${domains.community}/sitemap.xml`,
    `https://${domains.ai}/sitemap.xml`,
    `https://${domains.business}/sitemap.xml`,
    `https://${domains.green}/sitemap.xml`,
    `https://${domains.finance}/sitemap.xml`,
    `https://${domains.life}/sitemap.xml`,
    `https://${domains.invest}/sitemap.xml`,
  ]));
  buildLog("hub done");

  buildLog("rendering vc");
  await writeAssets(domains.vc);
  buildLog("rendering vc index body");
  const vcIndexHtml = renderVcHome();
  buildLog("writing vc index file");
  await writeSiteFile(domains.vc, "index.html", vcIndexHtml);
  await writeSiteFile(domains.vc, "v/index.html", renderVcRecordPage());
  await writeSiteFile(domains.vc, "issuers/index.html", renderVcIssuerPage());
  await writeSiteFile(domains.vc, "methods/index.html", renderVcMethodsPage());
  await writeSiteFile(domains.vc, "_worker.js", renderVcWorker());
  await writeSiteFile(domains.vc, "api/certificates.json", renderStaticJson({
    version: system.version,
    source: "vc_local_registry",
    count: certificates.length,
    certificates,
  }));
  await writeSiteFile(domains.vc, "_redirects", "/v/* /v/index.html 200\n");
  await writeSiteFile(domains.vc, "robots.txt", renderRobots(domains.vc));
  await writeSiteFile(domains.vc, "sitemap.xml", renderSitemap(domains.vc, vcPaths));
  buildLog("vc done");

  buildLog("rendering edu");
  await writeAssets(domains.edu);
  await writeSiteFile(domains.edu, "index.html", renderEduHome());
  await writeSiteFile(domains.edu, "courses/index.html", renderEduCoursesPage());
  await writeSiteFile(domains.edu, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-edu", mode: "static" }));
  await writeSiteFile(domains.edu, "api/catalog.json", renderStaticJson(courses));
  await writeSiteFile(domains.edu, "api/submission-workflow.json", renderStaticJson({
    version: accessModel.version,
    workflow: accessModel.submissionWorkflow || {},
  }));
  await writeSiteFile(domains.edu, "api/courses/index.json", renderStaticJson(courses.map((course) => ({
    slug: course.slug,
    title: course.title,
    titleEn: course.titleEn,
    level: course.level,
    duration: course.duration,
    certificateCode: course.certificateCode,
    playerUrl: `/learn/${course.slug}/player/`,
  }))));

  for (const course of courses) {
    const lessons = buildEduCoursePlayerLessons(course);

    await writeSiteFile(domains.edu, `course/${course.slug}/index.html`, renderEduCourseDetail(course));
    await writeSiteFile(domains.edu, `learn/${course.slug}/index.html`, renderEduCourseOverview(course, lessons));
    await writeSiteFile(domains.edu, `learn/${course.slug}/player/index.html`, renderEduCoursePlayer(course, lessons));

    await writeSiteFile(domains.edu, `api/courses/${course.slug}.json`, renderStaticJson({
      id: course.slug,
      title: course.title,
      titleEn: course.titleEn,
      summary: course.summary,
      summaryEn: course.summaryEn,
      level: course.level,
      duration: course.duration,
      durationEn: course.durationEn,
      outcomes: course.outcomes,
      outcomesEn: course.outcomesEn,
      ai_mode: "co-pilot",
      modules: lessons.map((lesson) => ({
        id: `${course.slug}-module-${lesson.moduleIndex}`,
        title: lesson.moduleTitle,
        titleEn: lesson.moduleTitleEn,
        order: lesson.moduleIndex,
      })),
    }));

    await writeSiteFile(domains.edu, `api/courses/${course.slug}/modules.json`, renderStaticJson(lessons.map((lesson) => ({
      id: `${course.slug}-module-${lesson.moduleIndex}`,
      title: lesson.moduleTitle,
      titleEn: lesson.moduleTitleEn,
      order: lesson.moduleIndex,
      lessons: [lesson.id],
    }))));

    await writeSiteFile(domains.edu, `api/eligibility/${course.slug}.json`, renderStaticJson({
      courseId: course.slug,
      required: {
        paidAccess: course.price !== "$0",
        lessonCompletion: true,
        actionProofs: true,
        projectSubmission: true,
        reflectionComplete: true,
      },
      statuses: ["completed", "verified", "vc_issued"],
    }));

    for (const lesson of lessons) {
      await writeSiteFile(domains.edu, `api/lessons/${lesson.id}.json`, renderStaticJson({
        id: lesson.id,
        type: lesson.type,
        title: lesson.title,
        titleEn: lesson.titleEn,
        objective: lesson.objective,
        objectiveEn: lesson.objectiveEn,
        body: lesson.body,
        bodyEn: lesson.bodyEn,
        action_requirements: [lesson.actionStep],
        ai_prompts: [
          "giải thích đơn giản hơn",
          "cho tôi ví dụ thật",
          "việc này áp dụng thế nào vào cuộc sống",
          "tôi đang bị kẹt ở đâu",
        ],
        completion_rules: lesson.completionRule,
      }));
    }
  }
  await writeSiteFile(domains.edu, "robots.txt", renderRobots(domains.edu));
  await writeSiteFile(domains.edu, "sitemap.xml", renderSitemap(domains.edu, eduPaths));
  buildLog("edu done");

  if (BUILD_SCOPE !== "public-core-only") {
    buildLog("rendering member");
    await writeAssets(domains.member);
    await writeSiteFile(domains.member, "assets/pwa-icon.svg", renderPwaIconSvg({
      label: "VTL",
      accent: "#0ea5e9",
      background: "#0f172a",
    }));
    await writeSiteFile(domains.member, "assets/pwa-maskable.svg", renderPwaIconSvg({
      label: "APP",
      accent: "#22d3ee",
      background: "#020617",
    }));
    buildLog("rendering member index body");
    const memberIndexHtml = renderMemberHome();
    buildLog("writing member index file");
    await writeSiteFile(domains.member, "index.html", memberIndexHtml);
    buildLog("rendering member journey");
    await writeSiteFile(domains.member, "journey/index.html", renderMemberJourneyPage());
    buildLog("rendering member app");
    await writeSiteFile(domains.member, "app/index.html", renderMemberAppPage());
    buildLog("rendering member app offline");
    await writeSiteFile(domains.member, "app/offline/index.html", renderMemberAppOfflinePage());
    buildLog("rendering member app manifest");
    await writeSiteFile(domains.member, "app/manifest.webmanifest", renderStaticJson(buildMemberPwaManifest()));
    buildLog("rendering member service worker");
    await writeSiteFile(domains.member, "app/sw.js", renderMemberAppServiceWorker());
    buildLog("member service worker done");
    buildLog("writing member api health");
    await writeSiteFile(domains.member, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-member", mode: "static" }));
    buildLog("writing member api summary");
    await writeSiteFile(domains.member, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("member", {
      contractVersion: accessModel.version,
    })));
    buildLog("writing member api levels");
    await writeSiteFile(domains.member, "api/levels.json", renderStaticJson({
    levels: [
      { level: 0, key: "visitor", name: "Visitor", requirement: "public entry", meaning: "explore public basics" },
      { level: 1, key: "pending_member", name: "Pending Member", requirement: "candidate_email + checkout_started", meaning: "await provisioning" },
      { level: 2, key: "annual_active", name: "Annual Access Member", requirement: "subscription_active", meaning: "member dashboard + purchase hub" },
      { level: 3, key: "pack_owner", name: "Specialist Pack Owner", requirement: "annual_active + owned_pack", meaning: "owned specialist depth" },
      { level: 4, key: "program_user", name: "Program User", requirement: "annual_active + program_admitted", meaning: "guided layer" },
      { level: 5, key: "partner", name: "Partner", requirement: "proof_verified + approval", meaning: "partner rights" },
    ],
    }));
    buildLog("writing member access model");
    await writeSiteFile(domains.member, "api/access-model.json", renderStaticJson(accessModel));
  buildLog("writing member entitlements");
  await writeSiteFile(domains.member, "api/entitlements.json", renderStaticJson({
    version: accessModel.version,
    identityStates: accessModel.identityStates,
    entitlements: accessModel.entitlements,
    grouped: {
      public: (accessModel.entitlements || []).filter((entry) => entry.category === "public").map((entry) => entry.key),
      payment: (accessModel.entitlements || []).filter((entry) => entry.category === "payment").map((entry) => entry.key),
      proof: (accessModel.entitlements || []).filter((entry) => entry.category === "proof").map((entry) => entry.key),
      governance: (accessModel.entitlements || []).filter((entry) => entry.category === "governance").map((entry) => entry.key),
    },
    specialistPacks: accessModel.specialistPacks,
    vcProtectionPolicy: accessModel.vcProtectionPolicy || {},
    enterprisePlans: accessModel.enterprisePlans || [],
  }));
  buildLog("writing member enterprise plans");
  await writeSiteFile(domains.member, "api/enterprise-plans.json", renderStaticJson({
    version: accessModel.version,
    vcProtectionPolicy: accessModel.vcProtectionPolicy || {},
    plans: accessModel.enterprisePlans || [],
    salesHub: `https://${domains.hub}/lien-he/?intent=enterprise-vc`,
  }));
  buildLog("writing member events");
  await writeSiteFile(domains.member, "api/events.json", renderStaticJson({
    version: accessModel.version,
    billingObjects: accessModel.billingObjects,
    webhookEvents: accessModel.webhookEvents,
  }));
  buildLog("writing member submission workflow");
  await writeSiteFile(domains.member, "api/submission-workflow.json", renderStaticJson({
    version: accessModel.version,
    workflow: accessModel.submissionWorkflow || {},
  }));
  buildLog("writing member system registry");
  await writeSiteFile(domains.member, "api/system-registry.json", renderStaticJson({
    version: systemRegistry.version || accessModel.version,
    statusVocabulary: systemRegistry.statusVocabulary || {},
    domains: publicEcosystemDirectory.map((entry) => ({
      key: entry.key,
      label: entry.label,
      status: entry.status,
      stageLabel: entry.stageLabel || "",
      statusLabel: entry.statusLabel,
      primaryNav: entry.primaryNav,
      mission: entry.mission || "",
      url: entry.url,
      sourceOwner: `https://${domains[entry.key]}/`,
    })),
  }));
  buildLog("writing member official docs lock");
  await writeSiteFile(domains.member, "api/official-docs-lock.json", renderStaticJson(officialDocsLock));
  buildLog("writing member team3 policy matrix");
  await writeSiteFile(domains.member, "api/team3-policy-matrix.json", renderStaticJson(team3PolicyContract));
  buildLog("writing member team4 package/form registry");
  await writeSiteFile(domains.member, "api/team4/package-form-registry.json", renderStaticJson(packageFormRegistry));
  buildLog("writing member team4 business domain contract");
  await writeSiteFile(domains.member, "api/team4/business-domain-contract.json", renderStaticJson(businessDomainContract));
  buildLog("writing member team4 package comparison demo output");
  await writeSiteFile(domains.member, "api/team4/package-comparison-demo-output.json", renderStaticJson(packageComparisonDemoOutput));
  buildLog("writing member contracts");
  await writeSiteFile(domains.member, "api/contracts.json", renderStaticJson(buildContractsManifest(accessModel.version, officialDocsLock)));
  buildLog("writing member routing");
  await writeSiteFile(domains.member, "api/routing.json", renderStaticJson({
    version: accessModel.version,
    routeContract: accessModel.routeContract,
  }));
  buildLog("writing member access routing contract");
  await writeSiteFile(domains.member, "api/access/routing-contract.json", renderStaticJson({
    version: accessModel.version,
    routeContract: accessModel.routeContract,
  }));
  buildLog("writing member mobile config");
  await writeSiteFile(domains.member, "api/mobile-config.json", renderStaticJson(buildMemberMobileConfig()));
  buildLog("writing member mobile edu catalog");
  await writeSiteFile(domains.member, "api/mobile/edu-catalog.json", renderStaticJson({
    version: accessModel.version,
    source: `https://${domains.edu}/api/catalog.json`,
    courses: courses.map((course) => ({
      slug: course.slug,
      title: course.title,
      titleEn: course.titleEn,
      learnUrl: `https://${domains.edu}/learn/${course.slug}/`,
      detailUrl: `https://${domains.edu}/course/${course.slug}/`,
      certificateCode: course.certificateCode,
    })),
  }));
  buildLog("writing member mobile vc certificates");
  await writeSiteFile(domains.member, "api/mobile/vc-certificates.json", renderStaticJson({
    version: accessModel.version,
    source: `https://${domains.vc}/api/certificates.json`,
    certificates: certificates.map((record) => ({
      code: record.code,
      domain: record.domain,
      status: record.status,
      verifyUrl: `https://${domains.vc}/v/${encodeURIComponent(record.code)}`,
    })),
  }));
  buildLog("writing member mobile session states");
  await writeSiteFile(domains.member, "api/mobile/session-states.json", renderStaticJson({
    version: accessModel.version,
    identityStates: accessModel.identityStates,
  }));
  buildLog("writing member api index");
  await writeSiteFile(domains.member, "api/index.json", renderStaticJson({
    name: "member",
    contractVersion: accessModel.version,
    endpoints: [
      "/api/health",
      "/api/summary.json",
      "/api/levels.json",
      "/api/access-model.json",
      "/api/entitlements.json",
      "/api/enterprise-plans.json",
      "/api/events.json",
      "/api/submission-workflow.json",
      "/api/system-registry.json",
      "/api/official-docs-lock.json",
      "/api/team3-policy-matrix.json",
      "/api/team4/package-form-registry.json",
      "/api/team4/business-domain-contract.json",
      "/api/team4/package-comparison-demo-output.json",
      "/api/contracts.json",
      "/api/routing.json",
      "/api/access/routing-contract.json",
      "/api/mobile-config.json",
      "/api/mobile/edu-catalog.json",
      "/api/mobile/vc-certificates.json",
      "/api/mobile/session-states.json",
      "/api/access/session/current",
      "/api/access/entitlements.json",
      "/api/access/learning/state?course=:slug",
      "/api/access/learning/vc-candidate?course=:slug",
      "/api/access/learning/progress",
      "/api/access/learning/submission",
      "/api/access/learning/review",
    ],
  }));
  buildLog("writing member robots");
  await writeSiteFile(domains.member, "robots.txt", renderRobots(domains.member));
  buildLog("writing member sitemap");
    await writeSiteFile(domains.member, "sitemap.xml", renderSitemap(domains.member, memberPaths));
    buildLog("member done");

    buildLog("rendering work");
    await writeAssets(domains.work);
    buildLog("rendering work index body");
    const workIndexHtml = renderWorkHome();
    buildLog("writing work index file");
    await writeSiteFile(domains.work, "index.html", workIndexHtml);
    buildLog("rendering work brief");
    await writeSiteFile(domains.work, "brief/index.html", renderWorkBriefPage());
    buildLog("writing work api health");
    await writeSiteFile(domains.work, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-work", mode: "static" }));
    const workSurfaceSummary = resolveSurfacePublicMeta("work");
    buildLog("writing work summary");
    await writeSiteFile(domains.work, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("work")));
    buildLog("writing work briefs");
  await writeSiteFile(domains.work, "api/briefs.json", renderStaticJson({
    briefs: [
      {
        id: "WORK-PILOT-001",
        title: "Proof-first freelance pilot",
        status: workSurfaceSummary.status,
        requiredProof: "VC",
      },
    ],
  }));
    buildLog("writing work api index");
  await writeSiteFile(domains.work, "api/index.json", renderStaticJson({
    name: "work",
    endpoints: [
      "/api/health",
      "/api/summary.json",
      "/api/briefs.json",
    ],
  }));
    buildLog("writing work robots");
    await writeSiteFile(domains.work, "robots.txt", renderRobots(domains.work));
    buildLog("writing work sitemap");
    await writeSiteFile(domains.work, "sitemap.xml", renderSitemap(domains.work, workPaths));
    buildLog("work done");

    buildLog("rendering market");
    await writeAssets(domains.market);
    buildLog("rendering market index body");
    const marketIndexHtml = renderMarketHome();
    buildLog("writing market index file");
    await writeSiteFile(domains.market, "index.html", marketIndexHtml);
    buildLog("rendering market rules");
    await writeSiteFile(domains.market, "rules/index.html", renderMarketRulesPage());
    buildLog("writing market api health");
    await writeSiteFile(domains.market, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-market", mode: "static" }));
    const marketSurfaceSummary = resolveSurfacePublicMeta("market");
    buildLog("writing market summary");
    await writeSiteFile(domains.market, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("market")));
    buildLog("writing market listings");
  await writeSiteFile(domains.market, "api/listings.json", renderStaticJson({
    listings: [
      {
        id: "MARKET-PILOT-001",
        title: "Verified deliverable showcase",
        status: marketSurfaceSummary.status,
        requiredProof: "VC",
      },
    ],
  }));
    buildLog("writing market api index");
  await writeSiteFile(domains.market, "api/index.json", renderStaticJson({
    name: "market",
    endpoints: [
      "/api/health",
      "/api/summary.json",
      "/api/listings.json",
    ],
  }));
    buildLog("writing market robots");
    await writeSiteFile(domains.market, "robots.txt", renderRobots(domains.market));
    buildLog("writing market sitemap");
    await writeSiteFile(domains.market, "sitemap.xml", renderSitemap(domains.market, marketPaths));
    buildLog("market done");

    buildLog("rendering community");
    await writeAssets(domains.community);
    buildLog("rendering community index body");
    const communityIndexHtml = renderCommunityHome();
    buildLog("writing community index file");
    await writeSiteFile(domains.community, "index.html", communityIndexHtml);
    buildLog("rendering community principles");
    await writeSiteFile(domains.community, "principles/index.html", renderCommunityPrinciplesPage());
    buildLog("writing community api health");
    await writeSiteFile(domains.community, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-community", mode: "static" }));
    buildLog("writing community summary");
    await writeSiteFile(domains.community, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("community", {
      mode: "planned_safe",
    })));
    buildLog("writing community circle preview");
    await writeSiteFile(domains.community, "api/circle-preview.json", renderStaticJson({
      circles: [
        {
          id: "COMMUNITY-PREVIEW-001",
          title: "Peer reflection circle",
          status: resolveSurfacePublicMeta("community").status,
          mode: "preview_only",
        },
      ],
    }));
    buildLog("writing community api index");
    await writeSiteFile(domains.community, "api/index.json", renderStaticJson({
      name: "community",
      endpoints: [
        "/api/health",
        "/api/summary.json",
        "/api/circle-preview.json",
      ],
    }));
    buildLog("writing community robots");
    await writeSiteFile(domains.community, "robots.txt", renderRobots(domains.community));
    buildLog("writing community sitemap");
    await writeSiteFile(domains.community, "sitemap.xml", renderSitemap(domains.community, communityPaths));
    buildLog("community done");

    buildLog("rendering ai");
    await writeAssets(domains.ai);
    buildLog("rendering ai index body");
    const aiIndexHtml = renderAiHome();
    buildLog("writing ai index file");
    await writeSiteFile(domains.ai, "index.html", aiIndexHtml);
    buildLog("rendering ai use cases");
    await writeSiteFile(domains.ai, "use-cases/index.html", renderAiUseCasesPage());
    buildLog("writing ai api health");
    await writeSiteFile(domains.ai, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-ai", mode: "static" }));
    buildLog("writing ai summary");
    await writeSiteFile(domains.ai, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("ai", {
      mode: "planned_safe",
    })));
    buildLog("writing ai use cases api");
    await writeSiteFile(domains.ai, "api/use-cases.json", renderStaticJson({
      useCases: [
        {
          id: "AI-PREVIEW-001",
          title: "Guided tutor sample",
          status: resolveSurfacePublicMeta("ai").status,
          mode: "preview_only",
        },
        {
          id: "AI-PREVIEW-002",
          title: "Guided review sample",
          status: resolveSurfacePublicMeta("ai").status,
          mode: "preview_only",
        },
      ],
    }));
    buildLog("writing ai api index");
    await writeSiteFile(domains.ai, "api/index.json", renderStaticJson({
      name: "ai",
      endpoints: [
        "/api/health",
        "/api/summary.json",
        "/api/use-cases.json",
      ],
    }));
    buildLog("writing ai robots");
    await writeSiteFile(domains.ai, "robots.txt", renderRobots(domains.ai));
    buildLog("writing ai sitemap");
    await writeSiteFile(domains.ai, "sitemap.xml", renderSitemap(domains.ai, aiPaths));
    buildLog("ai done");

    buildLog("rendering business");
    await writeAssets(domains.business);
    buildLog("rendering business index body");
    const businessIndexHtml = renderBusinessPage();
    buildLog("writing business index file");
    await writeSiteFile(domains.business, "index.html", businessIndexHtml);
    buildLog("writing business api health");
    await writeSiteFile(domains.business, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-business", mode: "static" }));
    buildLog("writing business summary");
    await writeSiteFile(domains.business, "api/summary.json", renderStaticJson(buildSurfaceSummaryPayload("business", {
      contractVersion: businessDomainContract.version,
      mode: "planned_safe",
      nextStep: deepLinkAbsoluteUrl(`https://${domains.hub}/lien-he/?intent=enterprise-business&source=business-home`),
      team4Endpoints: [
        "/api/team4/package-form-registry.json",
        "/api/team4/business-domain-contract.json",
        "/api/team4/package-comparison-demo-output.json",
      ],
    })));
    buildLog("writing business team4 package form registry");
    await writeSiteFile(domains.business, "api/team4/package-form-registry.json", renderStaticJson(packageFormRegistry));
    buildLog("writing business team4 business contract");
    await writeSiteFile(domains.business, "api/team4/business-domain-contract.json", renderStaticJson(businessDomainContract));
    buildLog("writing business team4 comparison demo output");
    await writeSiteFile(domains.business, "api/team4/package-comparison-demo-output.json", renderStaticJson(packageComparisonDemoOutput));
    buildLog("writing business contracts");
    await writeSiteFile(domains.business, "api/business/contracts.json", renderStaticJson({
      version: businessDomainContract.version,
      domain: businessDomainContract.domain || {},
      runtimeTruthGuardrails: businessDomainContract.runtimeTruthGuardrails || {},
      intakeContract: businessDomainContract.intakeContract || {},
      packageRecommendationRules: businessDomainContract.packageRecommendationRules || {},
      businessPackages: businessDomainContract.businessPackages || [],
      currentSourceOfTruth: businessDomainContract.plannedApiContract?.currentSourceOfTruth || [],
      comparisonDemoOutputVersion: packageComparisonDemoOutput.version,
    }));
    buildLog("writing business api index");
    await writeSiteFile(domains.business, "api/index.json", renderStaticJson({
      name: "business",
      contractVersion: businessDomainContract.version,
      endpoints: [
        "/api/health",
        "/api/summary.json",
        "/api/team4/package-form-registry.json",
        "/api/team4/business-domain-contract.json",
        "/api/team4/package-comparison-demo-output.json",
        "/api/business/contracts.json",
      ],
    }));
    buildLog("writing business robots");
    await writeSiteFile(domains.business, "robots.txt", renderRobots(domains.business));
    buildLog("writing business sitemap");
    await writeSiteFile(domains.business, "sitemap.xml", renderSitemap(domains.business, simplePaths));
    buildLog("business done");
  } else {
    buildLog("skipping member/work/market/business for public-core-only build");
  }

  buildLog("rendering green");
  await writeAssets(domains.green);
  await writeSiteFile(domains.green, "index.html", renderGreenPage());
  await writeSiteFile(domains.green, "robots.txt", renderRobots(domains.green));
  await writeSiteFile(domains.green, "sitemap.xml", renderSitemap(domains.green, simplePaths));
  buildLog("green done");

  buildLog("rendering finance");
  await writeAssets(domains.finance);
  await writeSiteFile(domains.finance, "index.html", renderFinancePage());
  await writeSiteFile(domains.finance, "robots.txt", renderRobots(domains.finance));
  await writeSiteFile(domains.finance, "sitemap.xml", renderSitemap(domains.finance, simplePaths));
  buildLog("finance done");

  buildLog("rendering life");
  await writeAssets(domains.life);
  await writeSiteFile(domains.life, "index.html", renderLifePage());
  await writeSiteFile(domains.life, "robots.txt", renderRobots(domains.life));
  await writeSiteFile(domains.life, "sitemap.xml", renderSitemap(domains.life, simplePaths));
  buildLog("life done");

  buildLog("rendering invest");
  await writeAssets(domains.invest);
  await writeSiteFile(domains.invest, "index.html", renderInvestPage());
  await writeSiteFile(domains.invest, "robots.txt", renderRobots(domains.invest));
  await writeSiteFile(domains.invest, "sitemap.xml", renderSitemap(domains.invest, simplePaths));
  buildLog("invest done");

  buildLog("rendering kids");
  await renderKidsDomain();
  buildLog("kids done");
  } finally {
    await releaseBuildLock();
  }
}

async function copyStaticTree(srcDir, dstDomain) {
  let entries;
  try {
    entries = await readdir(srcDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      await copyStaticTree(srcPath, path.join(dstDomain, entry.name));
    } else if (entry.isFile()) {
      const content = await readFile(srcPath, "utf8");
      await writeSiteFile(dstDomain, entry.name, content);
    }
  }
}

async function copyStaticTreeForDomain(domain) {
  const sourceRoot = path.join(SRC, "static-pages", domain);
  let topEntries;
  try {
    topEntries = await readdir(sourceRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  for (const entry of topEntries) {
    const srcPath = path.join(sourceRoot, entry.name);
    if (entry.isDirectory()) {
      await copyStaticTree(srcPath, path.join(domain, entry.name));
    } else if (entry.isFile()) {
      const content = await readFile(srcPath, "utf8");
      await writeSiteFile(domain, entry.name, content);
    }
  }
}

async function renderKidsDomain() {
  const domain = domains.kids;
  await copyStaticTreeForDomain(domain);

  const robots = [
    "User-agent: *",
    "Allow: /$",
    "Allow: /en/",
    "Allow: /assets/",
    "Allow: /api/curriculum.json",
    "Allow: /api/contract.json",
    "Disallow: /parent/",
    "Disallow: /learn/",
    "Disallow: /api/kids/",
    `Sitemap: https://${domain}/sitemap.xml`,
    "",
  ].join("\n");
  await writeSiteFile(domain, "robots.txt", robots);

  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://${domain}/</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="vi" href="https://${domain}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://${domain}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://${domain}/"/>
  </url>
  <url>
    <loc>https://${domain}/en/</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="vi" href="https://${domain}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://${domain}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://${domain}/"/>
  </url>
</urlset>
`;
  await writeSiteFile(domain, "sitemap.xml", sitemap);
  await writeSiteFile(domain, "api/health", renderStaticJson({
    name: "kids",
    status: "ok",
    audience: "children-6-to-17-and-parents",
    childSafety: kidsCurriculum.childSafety || {},
  }));
  await writeSiteFile(domain, "api/curriculum.json", renderStaticJson(kidsCurriculum));
  await writeSiteFile(domain, "api/contract.json", renderStaticJson(kidsApiContract));

  const stubEndpointPaths = [];
  for (const endpoint of kidsApiContract.endpoints || []) {
    if (!endpoint?.path) continue;
    if (String(endpoint.path).includes(":")) continue;
    const stubPath = endpoint.path.replace(/^\//, "") + ".stub.json";
    stubEndpointPaths.push(endpoint.path);
    await writeSiteFile(domain, stubPath, renderStaticJson({
      error: {
        code: "NOT_IMPLEMENTED",
        stage: "stub",
        message: "kids API is in Member Preview. Backend implementation is gated by child-safety review.",
        contractVersion: kidsApiContract.version,
        endpoint: {
          id: endpoint.id,
          method: endpoint.method,
          path: endpoint.path,
          summary: endpoint.summary,
          request: endpoint.request,
          response: endpoint.response,
          childSafety: endpoint.childSafety || [],
        },
      },
    }));
  }

  await writeSiteFile(domain, "api/registry.json", renderStaticJson({
    name: "kids",
    host: domain,
    pages: [
      "/",
      "/parent/onboarding/consent/",
      "/parent/onboarding/child-profile/",
      "/parent/dashboard/",
      "/parent/pricing/",
      "/parent/support/sessions/",
      "/learn/dashboard/",
      "/learn/lessons/",
      "/learn/ai-helper/",
      "/learn/achievements/",
    ],
    endpoints: [
      "/api/health",
      "/api/curriculum.json",
      "/api/contract.json",
      "/api/registry.json",
      ...stubEndpointPaths,
    ],
    apiContractVersion: kidsApiContract.version,
    apiStage: kidsApiContract.stage,
    childSafety: kidsCurriculum.childSafety || {},
  }));
}

await build();
buildLog("all domains done");
console.log(`Built Vetuonglai system into ${DIST}`);
