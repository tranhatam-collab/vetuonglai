import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const KIDS_DIST = path.join(DIST, "kids.vetuonglai.com");

const rows = [];

function logResult(ok, label, detail = "") {
  rows.push({ ok, label, detail });
  const prefix = ok ? "PASS" : "FAIL";
  console.log(`${prefix} ${label}${detail ? `: ${detail}` : ""}`);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

async function listFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const rel = path.posix.join(prefix, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(abs, rel));
    } else if (entry.isFile()) {
      files.push(rel);
    }
  }

  return files.sort();
}

function assert(label, condition, detail) {
  logResult(Boolean(condition), label, detail);
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

async function main() {
  const requiredFiles = [
    "index.html",
    "en/index.html",
    "robots.txt",
    "sitemap.xml",
    "assets/icon.svg",
    "assets/kids.css",
    "assets/kids.js",
    "api/health",
    "api/curriculum.json",
    "api/contract.json",
    "api/lessons.json",
    "api/registry.json",
  ];

  for (const rel of requiredFiles) {
    assert(`required ${rel}`, await exists(path.join(KIDS_DIST, rel)), rel);
  }

  const files = await listFiles(KIDS_DIST);
  const disallowedFiles = files.filter((rel) => !(
    rel === "index.html"
    || rel === "robots.txt"
    || rel === "sitemap.xml"
    || rel.startsWith("assets/")
    || rel.startsWith("api/")
    || rel.startsWith("en/")
  ));
  assert(
    "kids dist is homepage-only packet",
    disallowedFiles.length === 0,
    disallowedFiles.length === 0 ? "only homepage, assets, and api files are present" : disallowedFiles.join(", "),
  );

  const registry = JSON.parse(await readText(path.join(KIDS_DIST, "api/registry.json")));
  const registryPages = Array.isArray(registry.pages) ? registry.pages : [];
  const unexpectedRegistryPages = registryPages.filter((page) => page !== "/" && page !== "/en/");
  assert(
    "kids registry only exposes public homepage pages",
    unexpectedRegistryPages.length === 0,
    unexpectedRegistryPages.length === 0 ? registryPages.join(", ") : unexpectedRegistryPages.join(", "),
  );

  const robots = await readText(path.join(KIDS_DIST, "robots.txt"));
  assert("kids robots disallow /learn/", robots.includes("Disallow: /learn/"), "Disallow: /learn/");
  assert("kids robots disallow /parent/", robots.includes("Disallow: /parent/"), "Disallow: /parent/");

  const sitemap = await readText(path.join(KIDS_DIST, "sitemap.xml"));
  const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const unexpectedSitemapLocs = sitemapLocs.filter((loc) => !(
    loc === "https://kids.vetuonglai.com/"
    || loc === "https://kids.vetuonglai.com/en/"
  ));
  assert(
    "kids sitemap is homepage-only",
    unexpectedSitemapLocs.length === 0,
    unexpectedSitemapLocs.length === 0 ? sitemapLocs.join(", ") : unexpectedSitemapLocs.join(", "),
  );

  const viHome = await readText(path.join(KIDS_DIST, "index.html"));
  const enHome = await readText(path.join(KIDS_DIST, "en", "index.html"));

  assert(
    "kids VI homepage has planned/public preview banner",
    viHome.includes("Bản xem trước công khai"),
    "Bản xem trước công khai",
  );
  assert(
    "kids EN homepage has planned/public preview banner",
    enHome.includes("Public preview"),
    "Public preview",
  );
  assert(
    "kids homepage CTAs stay inside homepage sections",
    !hasAny(viHome + "\n" + enHome, [/href="\/parent\//i, /href="\/learn\//i, /href="https:\/\/kids\.vetuonglai\.com\/parent\//i, /href="https:\/\/kids\.vetuonglai\.com\/learn\//i]),
    "no /parent/ or /learn/ links on public homepage",
  );
  assert(
    "kids homepage blocks sales and signup wording",
    !hasAny(
      viHome + "\n" + enHome,
      [
        /Đăng ký/i,
        /Thanh toán/i,
        /Checkout/i,
        /\bPayment\b/i,
        /\bSign up\b/i,
        /\bRegister\b/i,
        /Mua ngay/i,
        /\bBuy now\b/i,
        /Bảng xếp hạng/i,
        /\bLeaderboard\b/i,
        /Thu nhập/i,
        /\bEarn money\b/i,
        /Giới thiệu bạn bè/i,
        /\bReferral\b/i,
        /\bLog in\b/i,
      ],
    ),
    "no sign-up, payment, leaderboard, earning, or referral wording on homepage",
  );

  const publicLeakTargets = [
    { label: "hub home", path: path.join(DIST, "vetuonglai.com", "index.html") },
    { label: "hub ecosystem", path: path.join(DIST, "vetuonglai.com", "he-sinh-thai", "index.html") },
    { label: "member journey", path: path.join(DIST, "member.vetuonglai.com", "journey", "index.html") },
  ];

  for (const target of publicLeakTargets) {
    const text = await readText(target.path);
    assert(
      `${target.label} does not publicly discover kids`,
      !(/kids\.vetuonglai\.com/i.test(text) || /\/parent\/onboarding\/consent\//i.test(text)),
      target.label,
    );
  }

  const hubApps = JSON.parse(await readText(path.join(DIST, "vetuonglai.com", "apps.json")));
  const appHosts = Array.isArray(hubApps) ? hubApps.map((entry) => entry?.host || "").filter(Boolean) : [];
  assert(
    "hub apps.json does not expose kids",
    !appHosts.includes("kids.vetuonglai.com"),
    appHosts.join(", "),
  );

  const hubRegistry = JSON.parse(await readText(path.join(DIST, "vetuonglai.com", "api/system-registry.json")));
  const hubRegistryHosts = Array.isArray(hubRegistry.domains) ? hubRegistry.domains.map((entry) => entry?.host || "").filter(Boolean) : [];
  assert(
    "hub public system-registry does not expose kids",
    !hubRegistryHosts.includes("kids.vetuonglai.com"),
    hubRegistryHosts.join(", "),
  );

  const memberRegistry = JSON.parse(await readText(path.join(DIST, "member.vetuonglai.com", "api/system-registry.json")));
  const memberRegistryHosts = Array.isArray(memberRegistry.domains) ? memberRegistry.domains.map((entry) => entry?.host || "").filter(Boolean) : [];
  assert(
    "member public system-registry does not expose kids",
    !memberRegistryHosts.includes("kids.vetuonglai.com"),
    memberRegistryHosts.join(", "),
  );

  const failed = rows.filter((row) => !row.ok);
  console.log("");
  console.log(`Kids predeploy summary: ${rows.length - failed.length}/${rows.length} passed`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("verify-kids-predeploy failed:", error);
  process.exitCode = 1;
});
