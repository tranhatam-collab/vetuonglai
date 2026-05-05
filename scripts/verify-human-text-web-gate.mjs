import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(ROOT, "dist");
const REPORT_DIR = path.join(ROOT, "reports");
const JSON_REPORT = path.join(REPORT_DIR, "human-text-web-gate.latest.json");
const MD_REPORT = path.join(REPORT_DIR, "human-text-web-inventory.latest.md");

const EXCLUDED_HOSTS = new Set([
  "kids.vetuonglai.com",
]);

const FORBIDDEN_CHAR_RE = /[\u2013\u2014\u2212\u2192\u2190\u2194\u21D2\u279C\u27A1\u2197\u2605\u2606\u25C6\u25C7\u25CF\u25CB\u25A0\u25A1\u2666\u2026\u2728\u{1F680}\u{1F525}\u{1F4A5}\u{2B50}]/u;
const EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]/u;
const TRUE_STATE_RE = /\b(public preview|member preview|planned|beta|bridge|coming soon|preview|live)\b/i;

const summary = {
  generated_at: new Date().toISOString(),
  gate: "human-text-web-gate",
  scope: "vetuonglai-system public HTML",
  pages_scanned: 0,
  pages_passed: 0,
  pages_failed: 0,
  warnings: 0,
  hosts: {},
  issues: [],
};

function stripDecorativeHiddenBlocks(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<code[\s\S]*?<\/code>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]*aria-hidden=["']true["'][^>]*>[\s\S]*?<\/[^>]+>/gi, " ");
}

function stripTags(html) {
  return stripDecorativeHiddenBlocks(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirst(html, pattern) {
  const match = String(html).match(pattern);
  return match ? String(match[1] || "").trim() : "";
}

function decodeHtml(text) {
  return String(text)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getHeadingLevels(html) {
  const levels = [];
  const pattern = /<h([1-3])\b/gi;
  let match;
  while ((match = pattern.exec(html))) {
    levels.push(Number(match[1]));
  }
  return levels;
}

function hasValidHeadingHierarchy(levels) {
  let seenH2 = false;
  for (const level of levels) {
    if (level === 2) seenH2 = true;
    if (level === 3 && !seenH2) return false;
  }
  return true;
}

function collectImageAltIssues(html) {
  const issues = [];
  const imgRe = /<img\b([^>]*?)>/gi;
  let match;
  while ((match = imgRe.exec(html))) {
    const attrs = match[1] || "";
    if (/role=["']presentation["']/i.test(attrs) || /aria-hidden=["']true["']/i.test(attrs)) {
      continue;
    }
    const altMatch = attrs.match(/\balt=["']([^"']*)["']/i);
    if (!altMatch) {
      issues.push("missing_alt");
      continue;
    }
    if (!String(altMatch[1] || "").trim()) {
      issues.push("empty_alt");
    }
  }
  return issues;
}

async function fileExists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function collectHtmlFiles(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectHtmlFiles(full);
      out.push(...nested);
      continue;
    }
    if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function pageRoleFromPath(host, relPath) {
  if (relPath === "index.html") return `${host}:home`;
  if (relPath.startsWith("books/")) return `${host}:book`;
  if (relPath.startsWith("docs/")) return `${host}:docs`;
  if (relPath.startsWith("how-we-pay/")) return `${host}:disclosure`;
  if (relPath.startsWith("terms/")) return `${host}:legal`;
  return `${host}:page`;
}

function pageUrl(host, relPath, html) {
  const canonical = extractFirst(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonical) return canonical;
  const route = relPath === "index.html" ? "" : relPath.replace(/index\.html$/, "");
  return `https://${host}/${route}`;
}

function isExcludedRoute(host, relPath) {
  const normalized = String(relPath || "");
  if (host === "member.vetuonglai.com" && normalized.startsWith("app/")) return true;
  if (host === "vetuonglai.com" && normalized === "founder/index.html") return true;
  return false;
}

function addIssue(host, url, key, detail, severity = "fail") {
  summary.issues.push({ host, url, key, detail, severity });
  if (!summary.hosts[host]) {
    summary.hosts[host] = { pages: 0, passed: 0, failed: 0, warnings: 0 };
  }
  if (severity === "warn") {
    summary.hosts[host].warnings += 1;
    summary.warnings += 1;
  }
}

async function inspectPage(host, htmlPath) {
  const html = await readFile(htmlPath, "utf8");
  const relPath = path.relative(path.join(DIST_ROOT, host), htmlPath).replaceAll(path.sep, "/");
  const url = pageUrl(host, relPath, html);
  const role = pageRoleFromPath(host, relPath);
  const text = decodeHtml(stripTags(html));
  const title = decodeHtml(extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = decodeHtml(extractFirst(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i));
  const ogTitle = decodeHtml(extractFirst(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i));
  const ogDescription = decodeHtml(extractFirst(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i));
  const ogImage = extractFirst(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const canonical = extractFirst(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const headingLevels = getHeadingLevels(html);
  const headingValid = hasValidHeadingHierarchy(headingLevels);
  const altIssues = collectImageAltIssues(html);
  const hasForbiddenChars = FORBIDDEN_CHAR_RE.test(text) || FORBIDDEN_CHAR_RE.test(title) || FORBIDDEN_CHAR_RE.test(description);
  const hasEmoji = EMOJI_RE.test(text) || EMOJI_RE.test(title) || EMOJI_RE.test(description);
  const trueStateDetected = TRUE_STATE_RE.test(text);
  const lang = extractFirst(html, /<html[^>]+lang=["']([^"']+)["']/i);

  const page = {
    host,
    url,
    role,
    h1_status: h1Count === 1 ? "pass" : `fail:${h1Count}`,
    heading_hierarchy: headingValid ? "pass" : "fail",
    character_hygiene: !hasForbiddenChars && !hasEmoji ? "pass" : "fail",
    seo_metadata: title && description && canonical && ogTitle && ogDescription && ogImage ? "pass" : "fail",
    canonical: canonical ? "pass" : "fail",
    og_image: ogImage ? "pass" : "fail",
    alt_text: altIssues.length === 0 ? "pass" : `fail:${altIssues.join(",")}`,
    language: lang ? `manual_review_required:${lang}` : "fail:missing_html_lang",
    true_state: trueStateDetected ? "pass" : "manual_review_required",
    next_action: "none",
  };

  let failed = false;
  if (h1Count !== 1) {
    addIssue(host, url, "h1_count", `expected 1 H1, found ${h1Count}`);
    failed = true;
  }
  if (!headingValid) {
    addIssue(host, url, "heading_hierarchy", "found H3 before any H2");
    failed = true;
  }
  if (hasForbiddenChars || hasEmoji) {
    addIssue(host, url, "character_hygiene", "decorative character or emoji found in rendered text or metadata");
    failed = true;
  }
  if (!title) {
    addIssue(host, url, "meta_title", "missing <title>");
    failed = true;
  }
  if (!description) {
    addIssue(host, url, "meta_description", "missing meta description");
    failed = true;
  }
  if (!canonical) {
    addIssue(host, url, "canonical", "missing canonical link");
    failed = true;
  }
  if (!ogTitle) {
    addIssue(host, url, "og_title", "missing og:title");
    failed = true;
  }
  if (!ogDescription) {
    addIssue(host, url, "og_description", "missing og:description");
    failed = true;
  }
  if (!ogImage) {
    addIssue(host, url, "og_image", "missing og:image");
    failed = true;
  }
  if (altIssues.length > 0) {
    addIssue(host, url, "alt_text", `image alt issues: ${altIssues.join(", ")}`);
    failed = true;
  }
  if (!lang) {
    addIssue(host, url, "language", "missing html[lang]");
    failed = true;
  }
  if (!trueStateDetected) {
    addIssue(host, url, "true_state", "manual review required to confirm visible state wording", "warn");
    if (page.next_action === "none") page.next_action = "add_true_state_or_confirm_evergreen_page";
  }
  if (page.language.startsWith("manual_review_required")) {
    addIssue(host, url, "language_review", "manual review required for natural-language quality", "warn");
    if (page.next_action === "none") page.next_action = "human_language_review";
  }
  if (failed && page.next_action === "none") {
    page.next_action = "fix_failed_gate";
  }

  if (!summary.hosts[host]) {
    summary.hosts[host] = { pages: 0, passed: 0, failed: 0, warnings: 0 };
  }
  summary.hosts[host].pages += 1;
  summary.pages_scanned += 1;
  if (failed) {
    summary.pages_failed += 1;
    summary.hosts[host].failed += 1;
  } else {
    summary.pages_passed += 1;
    summary.hosts[host].passed += 1;
  }

  return page;
}

function toMarkdownTable(pages) {
  const lines = [
    "# HUMAN TEXT WEB INVENTORY",
    "",
    `Generated: ${summary.generated_at}`,
    "",
    "| URL | Page role | H1 status | Character hygiene | SEO metadata | Canonical | OG image | Alt text | Language | True state | Next action |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const page of pages) {
    lines.push(`| ${page.url} | ${page.role} | ${page.h1_status} | ${page.character_hygiene} | ${page.seo_metadata} | ${page.canonical} | ${page.og_image} | ${page.alt_text} | ${page.language} | ${page.true_state} | ${page.next_action} |`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  if (!(await fileExists(DIST_ROOT))) {
    throw new Error("dist/ missing. Run npm run build first.");
  }

  const hostEntries = await readdir(DIST_ROOT, { withFileTypes: true });
  const pages = [];
  for (const entry of hostEntries) {
    if (!entry.isDirectory()) continue;
    const host = entry.name;
    if (!host.endsWith(".com")) continue;
    if (EXCLUDED_HOSTS.has(host)) continue;
    const htmlFiles = await collectHtmlFiles(path.join(DIST_ROOT, host));
    for (const htmlPath of htmlFiles) {
      const relPath = path.relative(path.join(DIST_ROOT, host), htmlPath).replaceAll(path.sep, "/");
      if (isExcludedRoute(host, relPath)) continue;
      pages.push(await inspectPage(host, htmlPath));
    }
  }

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(JSON_REPORT, JSON.stringify({ ...summary, pages }, null, 2));
  await writeFile(MD_REPORT, toMarkdownTable(pages));

  const failed = summary.pages_failed > 0;
  console.log("\nverify-human-text-web-gate");
  console.log(`  pages_scanned: ${summary.pages_scanned}`);
  console.log(`  pages_passed: ${summary.pages_passed}`);
  console.log(`  pages_failed: ${summary.pages_failed}`);
  console.log(`  warnings: ${summary.warnings}`);
  console.log(`  json_report: ${path.relative(ROOT, JSON_REPORT)}`);
  console.log(`  markdown_inventory: ${path.relative(ROOT, MD_REPORT)}`);

  if (failed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("verify-human-text-web-gate: fatal");
  console.error(error);
  process.exitCode = 1;
});
