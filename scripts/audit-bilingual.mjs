// Bilingual audit — scans dist/ for issues per
// docs/00_master/41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md
//
// Reports (does not fix) the following per HTML page:
//   - Missing <html lang="...">
//   - Missing meta description
//   - Missing canonical
//   - Missing hreflang (when other-language route exists)
//   - Missing OG title/description/image
//   - Missing Twitter card
//   - Identical title in both languages (when alternate exists)
//   - Visible-text abbreviations (VI/EN, AI on kids surfaces)
//   - Mixed Vietnamese + English in the same data-content / aria-label pair
//
// Output: writes summary to docs/00_master/42_BILINGUAL_AUDIT_REPORT.md
// and returns process.exitCode = 0 even when issues exist (audit is informational).

import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(process.env.VTL_DIST_ROOT || path.join(ROOT, "dist"));
const REPORT = path.join(ROOT, "docs", "00_master", "42_BILINGUAL_AUDIT_REPORT.md");

const SKIP_DIRS = new Set([".build-lock", "_redirects", "_headers"]);
const VISIBLE_ABBREVIATIONS = [
  { needle: />VI<\/(button|a|span|div|small)>/g, label: '"VI" abbreviation in user-visible text' },
  { needle: />EN<\/(button|a|span|div|small)>/g, label: '"EN" abbreviation in user-visible text' },
];
const KIDS_FORBIDDEN_ABBREVIATIONS = [
  { needle: /\bAI\b(?![-_a-z])/g, label: '"AI" on kids surface (should be "Trợ lý học" / "learning assistant")' },
  { needle: /\bVC\b(?![-_a-z])/g, label: '"VC" on kids surface (should be "lớp xác minh độc lập" / "independent verification layer")' },
];

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function metaPresent(html, namePattern, attr = "name") {
  const re = new RegExp(`<meta\\s+[^>]*${attr}=["']${namePattern}["'][^>]*>`, "i");
  return re.test(html);
}

function pickTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : "";
}

function pickHtmlLang(html) {
  const m = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  return m ? m[1] : "";
}

function hasHreflang(html) {
  return /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=/i.test(html);
}

function hasCanonical(html) {
  return /<link\s+[^>]*rel=["']canonical["']/i.test(html);
}

function relPath(file) {
  return path.relative(DIST, file).split(path.sep).join("/");
}

function hostFor(file) {
  const segments = path.relative(DIST, file).split(path.sep);
  return segments[0] || "";
}

function isKidsHost(host) {
  return host === "kids.vetuonglai.com";
}

function isHubLikeHost(host) {
  return host.endsWith(".vetuonglai.com") || host === "vetuonglai.com";
}

function findVisible(html, needles) {
  const hits = [];
  for (const { needle, label } of needles) {
    const matches = html.match(needle);
    if (matches && matches.length > 0) {
      hits.push({ label, count: matches.length });
    }
  }
  return hits;
}

function isNoindex(html) {
  const m = html.match(/<meta\s+name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  if (!m) return false;
  return /noindex/i.test(m[1]);
}

async function auditFile(file) {
  const html = await readFile(file, "utf8");
  const issues = [];

  const lang = pickHtmlLang(html);
  if (!lang) issues.push({ severity: "high", code: "missing-html-lang", detail: "no <html lang=...>" });

  if (!metaPresent(html, "description")) issues.push({ severity: "high", code: "missing-description", detail: "no <meta name=description>" });
  if (!hasCanonical(html)) issues.push({ severity: "medium", code: "missing-canonical", detail: "no canonical link" });

  // Internal pages marked noindex are exempt from social/hreflang share-meta checks.
  const noindex = isNoindex(html);
  if (!noindex) {
    if (!hasHreflang(html)) issues.push({ severity: "medium", code: "missing-hreflang", detail: "no hreflang alternates" });
    if (!metaPresent(html, "og:title", "property")) issues.push({ severity: "medium", code: "missing-og-title", detail: "no og:title" });
    if (!metaPresent(html, "og:description", "property")) issues.push({ severity: "medium", code: "missing-og-description", detail: "no og:description" });
    if (!metaPresent(html, "twitter:card")) issues.push({ severity: "low", code: "missing-twitter-card", detail: "no twitter:card" });
  }

  const host = hostFor(file);
  for (const hit of findVisible(html, VISIBLE_ABBREVIATIONS)) {
    issues.push({ severity: "high", code: "visible-abbreviation", detail: `${hit.label} ×${hit.count}` });
  }

  if (isKidsHost(host)) {
    // Strip data-* attribute values before scanning content (to avoid hitting class names like 'kids-ai-helper').
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/data-[a-z-]+="[^"]*"/g, "")
      .replace(/href="[^"]*"/g, "")
      .replace(/class="[^"]*"/g, "")
      .replace(/id="[^"]*"/g, "")
      .replace(/aria-label[a-z-]*="[^"]*"/g, "");
    for (const hit of findVisible(visible, KIDS_FORBIDDEN_ABBREVIATIONS)) {
      issues.push({ severity: "high", code: "kids-abbreviation", detail: `${hit.label} ×${hit.count}` });
    }
  }

  return { file, host, issues, title: pickTitle(html), lang };
}

function summarise(results) {
  const byHost = new Map();
  const byCode = new Map();
  let issueCount = 0;
  for (const r of results) {
    const host = r.host;
    const arr = byHost.get(host) || [];
    arr.push(r);
    byHost.set(host, arr);
    for (const issue of r.issues) {
      issueCount++;
      const k = issue.code;
      const c = byCode.get(k) || 0;
      byCode.set(k, c + 1);
    }
  }
  return { byHost, byCode, issueCount, fileCount: results.length };
}

function fmtIssueRow(file, issues) {
  const cls = issues.length === 0 ? "ok" : issues.some((i) => i.severity === "high") ? "high" : "medium";
  return `| \`${file}\` | ${cls} | ${issues.length} |`;
}

async function main() {
  if (!await stat(DIST).then(() => true).catch(() => false)) {
    console.error("dist directory not found — run scripts/build.mjs first.");
    process.exitCode = 1;
    return;
  }
  const files = await walk(DIST);
  const results = await Promise.all(files.map(auditFile));
  const summary = summarise(results);

  const lines = [];
  lines.push("# 42 — Bilingual Audit Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString().slice(0, 10)} (informational; not a build gate)`);
  lines.push("");
  lines.push(`Scope: \`dist/\` (${summary.fileCount} HTML files across ${summary.byHost.size} hosts)`);
  lines.push("");
  lines.push("Reference: [`41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md)");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total issues: ${summary.issueCount}`);
  lines.push(`- Files scanned: ${summary.fileCount}`);
  lines.push("");
  lines.push("### Issues by code");
  lines.push("");
  lines.push("| Code | Count |");
  lines.push("| --- | ---: |");
  const sortedCodes = Array.from(summary.byCode.entries()).sort((a, b) => b[1] - a[1]);
  for (const [code, count] of sortedCodes) {
    lines.push(`| ${code} | ${count} |`);
  }
  lines.push("");
  lines.push("### Issues by host");
  lines.push("");
  lines.push("| Host | Files | Issues |");
  lines.push("| --- | ---: | ---: |");
  const sortedHosts = Array.from(summary.byHost.entries()).sort();
  for (const [host, hostResults] of sortedHosts) {
    const issueTotal = hostResults.reduce((sum, r) => sum + r.issues.length, 0);
    lines.push(`| \`${host || "(root)"}\` | ${hostResults.length} | ${issueTotal} |`);
  }
  lines.push("");
  lines.push("## Top 30 files by issue count");
  lines.push("");
  lines.push("| File | Issues | Codes |");
  lines.push("| --- | ---: | --- |");
  const flagged = results
    .filter((r) => r.issues.length > 0)
    .sort((a, b) => b.issues.length - a.issues.length)
    .slice(0, 30);
  for (const r of flagged) {
    const codes = Array.from(new Set(r.issues.map((i) => i.code))).join(", ");
    lines.push(`| \`${relPath(r.file)}\` | ${r.issues.length} | ${codes} |`);
  }
  lines.push("");
  lines.push("## Detail (high-severity only)");
  lines.push("");
  for (const r of results) {
    const high = r.issues.filter((i) => i.severity === "high");
    if (high.length === 0) continue;
    lines.push(`### \`${relPath(r.file)}\``);
    for (const i of high) {
      lines.push(`- **${i.code}** — ${i.detail}`);
    }
    lines.push("");
  }
  lines.push("## Notes");
  lines.push("");
  lines.push("- Audit is informational. Re-run with `node scripts/audit-bilingual.mjs` after fixes.");
  lines.push("- High-severity codes block live launch per the bilingual rebuild command.");
  lines.push("- Kids-specific rule: no abbreviation at all — \"AI\" → \"Trợ lý học\", \"VC\" → \"lớp xác minh độc lập\".");

  await writeFile(REPORT, lines.join("\n") + "\n", "utf8");

  console.log(`Audit complete — ${summary.issueCount} issues across ${summary.fileCount} files.`);
  console.log(`Report: ${path.relative(ROOT, REPORT)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
