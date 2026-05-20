#!/usr/bin/env node
/**
 * scripts/fix-bilingual-parity-pass2.mjs
 *
 * Second-pass fix: reads the CURRENT report and fixes all remaining issues.
 * Handles:
 *  - "index 2.html" / "index 4.html" files (macOS duplicates)
 *  - New VI pages discovered in edu.vetuonglai.com (sang-tao-cong-nghe)
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "bilingual-parity.latest.json");

function hasHreflang(html, lang) {
  const re = new RegExp(`<link\\b[^>]*\\brel=["']alternate["'][^>]*\\bhreflang=["']${lang}["']`, "i");
  const reAlt = new RegExp(`<link\\b[^>]*\\bhreflang=["']${lang}["'][^>]*\\brel=["']alternate["']`, "i");
  return re.test(html) || reAlt.test(html);
}

/**
 * Derive VI and EN URLs from a file's relative path (from dist root).
 * relFile: e.g. "host/path/to/index.html" or "host/path/to/index 2.html"
 * For URL purposes, files like "index 2.html" still live at the directory path
 * (they're macOS duplicates of index.html at the same directory level).
 */
function deriveUrls(relFile) {
  const parts = relFile.split("/");
  const host = parts[0];
  // Path segments between host and filename
  const pathParts = parts.slice(1, -1);
  const isEnFile = pathParts[0] === "en";
  const viPathParts = isEnFile ? pathParts.slice(1) : pathParts;
  const viPath = viPathParts.length > 0 ? viPathParts.join("/") + "/" : "";
  const viUrl = `https://${host}/${viPath}`;
  const enUrl = `https://${host}/en/${viPath}`;
  return { host, viUrl, enUrl };
}

function injectHreflangTags(html, viUrl, enUrl, addVi, addEn) {
  const tags = [];
  if (addVi) tags.push(`<link rel="alternate" hreflang="vi" href="${viUrl}" />`);
  if (addEn) tags.push(`<link rel="alternate" hreflang="en" href="${enUrl}" />`);
  if (tags.length === 0) return html;
  const injection = tags.join("");
  if (html.includes("</head>")) {
    return html.replace("</head>", `${injection}</head>`);
  }
  return html + injection;
}

function fixLangAttr(html) {
  html = html.replace(/(<html\b[^>]*)\blang="vi"([^>]*>)/, '$1lang="en"$2');
  html = html.replace(/(<html\b[^>]*)\bdata-language="vi"([^>]*>)/, '$1data-language="en"$2');
  return html;
}

const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));

let fixedCount = 0;
const errors = [];

// Collect issues grouped by file
const fileIssues = new Map();
for (const hostResult of report.hosts) {
  if (!hostResult.issues) continue;
  for (const issue of hostResult.issues) {
    const key = issue.file;
    if (!fileIssues.has(key)) fileIssues.set(key, { types: new Set(), expected: null });
    fileIssues.get(key).types.add(issue.type);
    if (issue.type === "missing_en_mirror" && issue.expected) {
      fileIssues.get(key).expected = issue.expected;
    }
  }
}

// Process each VI file (fix hreflang and create EN mirror)
for (const [relFile, { types, expected }] of fileIssues.entries()) {
  const absFile = path.join(DIST_ROOT, relFile.replace(/\//g, path.sep));
  const isEnFile = relFile.includes("/en/");

  if (isEnFile) {
    // EN file issues (en_lang, missing hreflang on existing EN file)
    if (!fs.existsSync(absFile)) {
      errors.push(`EN file not found: ${absFile}`);
      continue;
    }
    let html = fs.readFileSync(absFile, "utf8");
    let modified = false;
    if (types.has("en_lang")) {
      html = fixLangAttr(html);
      modified = true;
    }
    const { viUrl, enUrl } = deriveUrls(relFile);
    const addVi = types.has("missing_hreflang_vi") && !hasHreflang(html, "vi");
    const addEn = types.has("missing_hreflang_en") && !hasHreflang(html, "en");
    if (addVi || addEn) {
      html = injectHreflangTags(html, viUrl, enUrl, addVi, addEn);
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(absFile, html, "utf8");
      console.log(`[FIX_EN] ${relFile}`);
      fixedCount++;
    }
    continue;
  }

  // VI file
  if (!fs.existsSync(absFile)) {
    errors.push(`VI file not found: ${absFile}`);
    continue;
  }

  let html = fs.readFileSync(absFile, "utf8");
  let modified = false;
  const { viUrl, enUrl } = deriveUrls(relFile);

  const addVi = types.has("missing_hreflang_vi") && !hasHreflang(html, "vi");
  const addEn = types.has("missing_hreflang_en") && !hasHreflang(html, "en");
  if (addVi || addEn) {
    html = injectHreflangTags(html, viUrl, enUrl, addVi, addEn);
    modified = true;
    console.log(`[HREFLANG_VI] ${relFile}`);
  }

  if (modified) {
    fs.writeFileSync(absFile, html, "utf8");
    fixedCount++;
  }

  // Create EN mirror if needed
  if (types.has("missing_en_mirror") && expected) {
    const enAbs = path.join(DIST_ROOT, expected.replace(/\//g, path.sep));
    const enDir = path.dirname(enAbs);
    fs.mkdirSync(enDir, { recursive: true });

    // Read the VI file (now with hreflang already injected)
    let enHtml = fs.readFileSync(absFile, "utf8");
    enHtml = fixLangAttr(enHtml);

    // Make sure hreflang exists on EN copy
    const { viUrl: eViUrl, enUrl: eEnUrl } = deriveUrls(expected);
    const needVi = !hasHreflang(enHtml, "vi");
    const needEn = !hasHreflang(enHtml, "en");
    enHtml = injectHreflangTags(enHtml, eViUrl, eEnUrl, needVi, needEn);

    fs.writeFileSync(enAbs, enHtml, "utf8");
    console.log(`[CREATE_EN] ${expected}`);
    fixedCount++;
  }
}

console.log(`\n--- Pass 2 Fix Summary ---`);
console.log(`Actions taken: ${fixedCount}`);
if (errors.length > 0) {
  console.warn(`Errors (${errors.length}):`);
  errors.forEach(e => console.warn("  " + e));
}
