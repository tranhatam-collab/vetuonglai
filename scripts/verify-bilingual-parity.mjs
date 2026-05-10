#!/usr/bin/env node
/**
 * scripts/verify-bilingual-parity.mjs
 *
 * Founder Lock VTL_75 §1.6 + Public Copy Plan §11: every public page on
 * vetuonglai.com (and its subdomains) must have a 1:1 bilingual mirror
 * at the corresponding /en/ path. The Vietnamese page is canonical;
 * the English page must exist and must declare its language correctly.
 *
 * Rules:
 *   1. For every dist/<host>/<path>/index.html that is NOT under
 *      dist/<host>/en/, there must be a corresponding
 *      dist/<host>/en/<path>/index.html.
 *   2. The VI page must declare lang="vi" on <html>.
 *   3. The EN page must declare lang="en" on <html>.
 *   4. Both pages must include a <link rel="alternate" hreflang="vi" ...>
 *      and a <link rel="alternate" hreflang="en" ...>.
 *
 * Excluded from parity:
 *   - dist/<host>/api/**, /admin/**, /app/**, /_next/**, /dev/**
 *   - assets / non-HTML files
 *   - subdomains where bilingual is not yet required: kids.vetuonglai.com
 *     is VI-only at V1 (per VTL_75 §1.6 carve-out); english copy comes V2.
 *
 * Output: reports/bilingual-parity.latest.json
 *
 * Default: ADVISORY_ONLY=true until the build pipeline emits /en/
 * mirrors universally. Switch to false (hard fail) once homepage and
 * each landing page is mirrored.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "bilingual-parity.latest.json");

const ADVISORY_ONLY = true;

const VI_ONLY_HOSTS = new Set([
  "kids.vetuonglai.com", // V1 carve-out
]);

const EXCLUDED_SEGMENTS = ["api", "admin", "app", "_next", "dev"];

function* walkHosts() {
  if (!fs.existsSync(DIST_ROOT)) return;
  for (const e of fs.readdirSync(DIST_ROOT, { withFileTypes: true })) {
    if (e.isDirectory()) yield e.name;
  }
}

function* walkHtmlRel(hostDir) {
  const stack = [{ abs: hostDir, rel: "" }];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(cur.abs, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const absChild = path.join(cur.abs, e.name);
      const relChild = cur.rel ? cur.rel + "/" + e.name : e.name;
      if (e.isDirectory()) {
        if (EXCLUDED_SEGMENTS.includes(e.name)) continue;
        stack.push({ abs: absChild, rel: relChild });
      } else if (e.isFile() && e.name.toLowerCase().endsWith(".html")) {
        yield { abs: absChild, rel: relChild };
      }
    }
  }
}

function checkLang(html, expected) {
  const m = /<html\b[^>]*\blang=["']([^"']+)["']/i.exec(html);
  if (!m) return { ok: false, reason: "no lang attribute on <html>" };
  if (m[1].toLowerCase() !== expected) return { ok: false, reason: `lang="${m[1]}" expected "${expected}"` };
  return { ok: true };
}

function hasHreflang(html, lang) {
  const re = new RegExp(`<link\\b[^>]*\\brel=["']alternate["'][^>]*\\bhreflang=["']${lang}["']`, "i");
  const reAlt = new RegExp(`<link\\b[^>]*\\bhreflang=["']${lang}["'][^>]*\\brel=["']alternate["']`, "i");
  return re.test(html) || reAlt.test(html);
}

function checkHost(host) {
  const hostDir = path.join(DIST_ROOT, host);
  const enDir = path.join(hostDir, "en");
  const issues = [];
  let scannedVi = 0;
  let scannedEn = 0;

  for (const { abs, rel } of walkHtmlRel(hostDir)) {
    // Skip files under /en/ here; we'll iterate VI side and look up EN counterpart.
    if (rel === "en/index.html" || rel.startsWith("en/")) {
      scannedEn++;
      continue;
    }
    scannedVi++;
    const html = fs.readFileSync(abs, "utf8");

    const langCheck = checkLang(html, "vi");
    if (!langCheck.ok) {
      issues.push({ type: "vi_lang", file: `${host}/${rel}`, reason: langCheck.reason });
    }
    if (!hasHreflang(html, "vi")) {
      issues.push({ type: "missing_hreflang_vi", file: `${host}/${rel}` });
    }
    if (!hasHreflang(html, "en")) {
      issues.push({ type: "missing_hreflang_en", file: `${host}/${rel}` });
    }

    // Counterpart EN path
    const enRel = "en/" + rel;
    const enAbs = path.join(hostDir, enRel);
    if (!fs.existsSync(enAbs)) {
      issues.push({ type: "missing_en_mirror", file: `${host}/${rel}`, expected: `${host}/${enRel}` });
      continue;
    }
    const enHtml = fs.readFileSync(enAbs, "utf8");
    const enLangCheck = checkLang(enHtml, "en");
    if (!enLangCheck.ok) {
      issues.push({ type: "en_lang", file: `${host}/${enRel}`, reason: enLangCheck.reason });
    }
    if (!hasHreflang(enHtml, "vi")) {
      issues.push({ type: "missing_hreflang_vi", file: `${host}/${enRel}` });
    }
    if (!hasHreflang(enHtml, "en")) {
      issues.push({ type: "missing_hreflang_en", file: `${host}/${enRel}` });
    }
  }
  return { host, scanned_vi: scannedVi, scanned_en: scannedEn, issues };
}

function main() {
  if (!fs.existsSync(DIST_ROOT)) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ ok: false, error: "dist/ missing" }, null, 2));
    console.error("verify-bilingual-parity: dist/ missing");
    process.exit(1);
  }
  const hostResults = [];
  for (const host of walkHosts()) {
    if (VI_ONLY_HOSTS.has(host)) {
      hostResults.push({ host, vi_only: true, skipped: true });
      continue;
    }
    hostResults.push(checkHost(host));
  }
  const totalIssues = hostResults.reduce((n, h) => n + (h.issues ? h.issues.length : 0), 0);
  const ok = totalIssues === 0;
  const report = {
    ok,
    advisory_only: ADVISORY_ONLY,
    total_issues: totalIssues,
    hosts: hostResults,
    timestamp: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!ok && !ADVISORY_ONLY) {
    console.error(`verify-bilingual-parity: FAIL — ${totalIssues} parity issue(s)`);
    process.exit(1);
  }
  if (!ok) {
    console.warn(`verify-bilingual-parity: ADVISORY — ${totalIssues} parity issue(s) (see report)`);
  } else {
    console.log("verify-bilingual-parity: PASS");
  }
  process.exit(0);
}

main();
