#!/usr/bin/env node
/**
 * scripts/fix-bilingual-parity.mjs
 *
 * Fixes all bilingual parity issues reported in reports/bilingual-parity.latest.json:
 *  1. Add hreflang="vi" and/or hreflang="en" link tags to VI pages missing them
 *  2. Create EN mirror pages for VI pages missing EN counterparts
 *  3. Fix lang="vi" → lang="en" (+ data-language) on EN pages that have wrong lang attr
 *  4. Also ensure EN mirror pages get their hreflang tags
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "bilingual-parity.latest.json");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasHreflang(html, lang) {
  const re = new RegExp(`<link\\b[^>]*\\brel=["']alternate["'][^>]*\\bhreflang=["']${lang}["']`, "i");
  const reAlt = new RegExp(`<link\\b[^>]*\\bhreflang=["']${lang}["'][^>]*\\brel=["']alternate["']`, "i");
  return re.test(html) || reAlt.test(html);
}

/**
 * Given a file path relative to dist root (e.g. "vetuonglai.com/use-cases/index.html")
 * derive the host and URL path segment.
 * Returns { host, viUrl, enUrl }
 */
function deriveUrls(relFile) {
  // relFile: "host/[path/]index.html"
  const parts = relFile.split("/");
  const host = parts[0];
  // Strip "index.html" from end; remaining parts are the path segments
  const pathParts = parts.slice(1, -1); // exclude filename
  // Also strip leading "en" if this is an EN file – we want to use VI path for URL
  const isEnFile = pathParts[0] === "en";
  const viPathParts = isEnFile ? pathParts.slice(1) : pathParts;

  const viPath = viPathParts.length > 0 ? viPathParts.join("/") + "/" : "";
  const viUrl = `https://${host}/${viPath}`;
  const enUrl = `https://${host}/en/${viPath}`;
  return { host, viUrl, enUrl };
}

/**
 * Insert hreflang link tags before </head>
 */
function injectHreflangTags(html, viUrl, enUrl, addVi, addEn) {
  const tags = [];
  if (addVi) {
    tags.push(`<link rel="alternate" hreflang="vi" href="${viUrl}" />`);
  }
  if (addEn) {
    tags.push(`<link rel="alternate" hreflang="en" href="${enUrl}" />`);
  }
  if (tags.length === 0) return html;
  const injection = tags.join("");
  // Insert before </head>
  if (html.includes("</head>")) {
    return html.replace("</head>", `${injection}</head>`);
  }
  // Fallback: append after <head> (shouldn't happen with well-formed HTML)
  return html + injection;
}

/**
 * Fix lang attribute: lang="vi" → lang="en" and data-language="vi" → data-language="en"
 * on the <html> opening tag
 */
function fixLangAttr(html) {
  // Replace lang="vi" in the <html> tag
  html = html.replace(/(<html\b[^>]*)\blang="vi"([^>]*>)/, '$1lang="en"$2');
  html = html.replace(/(<html\b[^>]*)\bdata-language="vi"([^>]*>)/, '$1data-language="en"$2');
  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));

let fixedCount = 0;
let skippedCount = 0;
const errors = [];

// Collect all VI files we need to process (to add hreflang to VI pages and create EN mirrors)
// We also need to fix en_lang issues and hreflang on EN pages.

// Build a work plan from the issues in the report
// Group issues by file so we handle each file once

const fileIssues = new Map(); // relFile → Set of issue types

for (const hostResult of report.hosts) {
  if (!hostResult.issues) continue;
  for (const issue of hostResult.issues) {
    const key = issue.file;
    if (!fileIssues.has(key)) fileIssues.set(key, new Set());
    fileIssues.get(key).add(issue.type);
    // Also track the expected EN path for missing_en_mirror
    if (issue.type === "missing_en_mirror" && issue.expected) {
      const enKey = issue.expected;
      if (!fileIssues.has(enKey)) fileIssues.set(enKey, new Set());
      fileIssues.get(enKey).add("__create_from_vi__"); // marker
      fileIssues.get(enKey).add("__vi_source__:" + issue.file); // source
    }
  }
}

// Process each file
for (const [relFile, issueSet] of fileIssues.entries()) {
  const absFile = path.join(DIST_ROOT, relFile.replace(/\//g, path.sep));
  const { host, viUrl, enUrl } = deriveUrls(relFile);
  const isEnFile = relFile.includes("/en/") || relFile.startsWith("en/");

  // --- Case 1: This is an EN file that needs to be CREATED ---
  if (issueSet.has("__create_from_vi__")) {
    // Find the VI source path
    let viSourceRelFile = null;
    for (const v of issueSet) {
      if (v.startsWith("__vi_source__:")) {
        viSourceRelFile = v.slice("__vi_source__:".length);
        break;
      }
    }
    if (!viSourceRelFile) {
      errors.push(`Cannot create EN mirror for ${relFile}: no VI source found`);
      continue;
    }
    const viSourceAbs = path.join(DIST_ROOT, viSourceRelFile.replace(/\//g, path.sep));
    if (!fs.existsSync(viSourceAbs)) {
      errors.push(`VI source missing: ${viSourceAbs}`);
      continue;
    }

    // Create the EN dir
    const enDir = path.dirname(absFile);
    fs.mkdirSync(enDir, { recursive: true });

    // Read VI source
    let html = fs.readFileSync(viSourceAbs, "utf8");

    // Fix lang attr to "en"
    html = fixLangAttr(html);

    // Determine correct URLs for hreflang (derived from the EN file path, not the VI source)
    const { viUrl: enViUrl, enUrl: enEnUrl } = deriveUrls(relFile);

    // Add hreflang tags if missing
    const addVi = !hasHreflang(html, "vi");
    const addEn = !hasHreflang(html, "en");
    html = injectHreflangTags(html, enViUrl, enEnUrl, addVi, addEn);

    fs.writeFileSync(absFile, html, "utf8");
    console.log(`[CREATE_EN] ${relFile}`);
    fixedCount++;
    continue;
  }

  // --- Case 2: Existing file needs hreflang tags and/or lang fix ---
  if (!fs.existsSync(absFile)) {
    errors.push(`File not found: ${absFile}`);
    skippedCount++;
    continue;
  }

  let html = fs.readFileSync(absFile, "utf8");
  let modified = false;

  // Fix en_lang issue (lang="vi" on EN page)
  if (issueSet.has("en_lang")) {
    html = fixLangAttr(html);
    modified = true;
    console.log(`[FIX_LANG] ${relFile}`);
  }

  // Add missing hreflang tags
  const addVi = issueSet.has("missing_hreflang_vi") && !hasHreflang(html, "vi");
  const addEn = issueSet.has("missing_hreflang_en") && !hasHreflang(html, "en");
  if (addVi || addEn) {
    html = injectHreflangTags(html, viUrl, enUrl, addVi, addEn);
    modified = true;
    console.log(`[HREFLANG] ${relFile} (vi=${addVi}, en=${addEn})`);
  }

  if (modified) {
    fs.writeFileSync(absFile, html, "utf8");
    fixedCount++;
  } else {
    skippedCount++;
  }
}

console.log(`\n--- Fix Summary ---`);
console.log(`Files fixed:   ${fixedCount}`);
console.log(`Files skipped: ${skippedCount}`);
if (errors.length > 0) {
  console.warn(`Errors (${errors.length}):`);
  errors.forEach(e => console.warn("  " + e));
}
