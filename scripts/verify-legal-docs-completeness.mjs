#!/usr/bin/env node
/**
 * scripts/verify-legal-docs-completeness.mjs
 *
 * Founder Lock VTL_75 §6.4 + Public Copy Plan §12 + §13 (LOCKED 2026-05-06):
 * the 12 canonical legal documents and the 3 supporting documents must
 * each exist at their canonical path, with VI + EN versions, and with
 * a version marker.
 *
 * Canonical 12 (VTL_75 §12):
 *   /legal/tos /legal/privacy /legal/cookies /legal/refund
 *   /legal/material-connection /legal/contractor /legal/income
 *   /legal/invest /legal/kids /legal/spam /legal/dmca /legal/conduct
 *
 * Supporting 3 (LOCKED 2026-05-06 §13):
 *   /legal/editorial /legal/contributor-conduct /legal/dsar
 *
 * Source paths checked:
 *   - dist/docs.vetuonglai.com/legal/<slug>/index.html (VI)
 *   - dist/docs.vetuonglai.com/en/legal/<slug>/index.html (EN)
 * Plus, the page must contain a version marker matching:
 *   data-vtl-legal-version="<semver-like>"
 *   or visible text matching /Phiên bản\s+\d{4}\.\d{2}\.\d{2}/
 *   or visible text matching /Version\s+\d{4}\.\d{2}\.\d{2}/
 *
 * Output: reports/legal-docs-completeness.latest.json
 *
 * Exit 0 on pass, 1 on fail. If a doc has not yet been authored,
 * verifier records advisory but still fails for canonical 12 missing.
 * For supporting 3, advisory mode is on until 2026-06-01 to allow
 * authoring lead time.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "legal-docs-completeness.latest.json");

const SUPPORTING_ADVISORY_UNTIL = new Date("2026-06-01T00:00:00Z");

const CANONICAL_12 = [
  "tos",
  "privacy",
  "cookies",
  "refund",
  "material-connection",
  "contractor",
  "income",
  "invest",
  "kids",
  "spam",
  "dmca",
  "conduct",
];

const SUPPORTING_3 = [
  "editorial",
  "contributor-conduct",
  "dsar",
];

const VI_BASE = "docs.vetuonglai.com/legal";
const EN_BASE = "docs.vetuonglai.com/en/legal";

function checkSlug(slug, advisory) {
  const viPath = path.join(DIST_ROOT, VI_BASE, slug, "index.html");
  const enPath = path.join(DIST_ROOT, EN_BASE, slug, "index.html");
  const result = {
    slug,
    advisory,
    vi: { path: path.relative(REPO_ROOT, viPath), exists: false, has_version: false },
    en: { path: path.relative(REPO_ROOT, enPath), exists: false, has_version: false },
    ok: false,
  };
  for (const lang of ["vi", "en"]) {
    const p = lang === "vi" ? viPath : enPath;
    if (!fs.existsSync(p)) continue;
    result[lang].exists = true;
    const html = fs.readFileSync(p, "utf8");
    if (
      /data-vtl-legal-version=["']\d{4}\.\d{2}\.\d{2}["']/.test(html) ||
      /Phiên bản\s+\d{4}\.\d{2}\.\d{2}/.test(html) ||
      /Version\s+\d{4}\.\d{2}\.\d{2}/.test(html)
    ) {
      result[lang].has_version = true;
    }
  }
  result.ok = result.vi.exists && result.en.exists && result.vi.has_version && result.en.has_version;
  return result;
}

function main() {
  const now = new Date();
  const supportingAdvisory = now < SUPPORTING_ADVISORY_UNTIL;
  const canonicalResults = CANONICAL_12.map((s) => checkSlug(s, false));
  const supportingResults = SUPPORTING_3.map((s) => checkSlug(s, supportingAdvisory));
  const canonicalAllOk = canonicalResults.every((r) => r.ok);
  const supportingAllOk = supportingResults.every((r) => r.ok);

  const report = {
    ok: canonicalAllOk && (supportingAllOk || supportingAdvisory),
    canonical_all_ok: canonicalAllOk,
    supporting_all_ok: supportingAllOk,
    supporting_advisory_until: SUPPORTING_ADVISORY_UNTIL.toISOString(),
    canonical_12: canonicalResults,
    supporting_3: supportingResults,
    timestamp: now.toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!canonicalAllOk) {
    console.error("verify-legal-docs-completeness: FAIL — canonical 12 incomplete");
    for (const r of canonicalResults) {
      if (!r.ok) {
        console.error(`  /legal/${r.slug}: vi.exists=${r.vi.exists} en.exists=${r.en.exists} vi.version=${r.vi.has_version} en.version=${r.en.has_version}`);
      }
    }
    process.exit(1);
  }
  if (!supportingAllOk && !supportingAdvisory) {
    console.error("verify-legal-docs-completeness: FAIL — supporting 3 incomplete (past advisory deadline)");
    process.exit(1);
  }
  if (!supportingAllOk) {
    console.warn(`verify-legal-docs-completeness: PASS canonical; supporting-3 advisory until ${SUPPORTING_ADVISORY_UNTIL.toISOString()}`);
  } else {
    console.log("verify-legal-docs-completeness: PASS — canonical 12 + supporting 3 complete");
  }
  process.exit(0);
}

main();
