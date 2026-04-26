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

import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
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

// Vietnamese diacritics signature — if a string has any of these, it is Vietnamese.
const VI_DIACRITIC = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;

// Common Vietnamese function words / particles. Presence = Vietnamese-likely text.
const VI_FUNCTION = /\b(và|hoặc|nhưng|vì|của|với|cho|không|được|đang|đã|sẽ|là|một|những|các|theo|để|khi|nếu|trong|trên|dưới|mà|này|đó|này\b|đây|kia)\b/i;
// Common English function words. Presence = English-likely text.
const EN_FUNCTION = /\b(the|and|or|but|of|with|for|not|is|are|was|were|will|would|should|could|this|that|these|those|in|on|at|by|to|from|when|while|because)\b/i;

function isVietnameseSentence(text) {
  if (!text || text.length < 3) return false;
  if (VI_DIACRITIC.test(text)) return true;
  return VI_FUNCTION.test(text);
}
function isEnglishSentence(text) {
  if (!text || text.length < 3) return false;
  if (VI_DIACRITIC.test(text)) return false;
  return EN_FUNCTION.test(text);
}

// Machine-translation red flags in EN content (rough heuristics, not authoritative).
const MT_PATTERNS = [
  { needle: /\b(in order to make sure|in order to ensure that)\b/gi, label: 'wordy MT phrasing — prefer "to ensure"' },
  { needle: /\bthe layer is the layer\b/gi, label: 'redundant translation phrasing' },
  { needle: /\bdo the job that\b/gi, label: 'awkward MT phrasing' },
];

// Hard-coded text without bilingual data attributes.
// Heuristic: <h1|h2|h3|p|button|a> with no data-text-vi/data-text-en/data-content-vi/data-content-en/data-vi/data-en
// AND inner text contains a sentence (>= 12 chars, has space)
const TEXT_NODE_RE = /<(h1|h2|h3|h4|p|button|li)\b([^>]*)>([^<]{12,})<\/\1>/g;
function hasBilingualAttr(attrs) {
  return /(data-(text|content|html|aria-label)-(vi|en)|data-vi|data-en|data-language-option|aria-hidden="true")/.test(attrs);
}

// Brand names that legitimately appear identical in both languages.
const BRAND_NAMES = ["Về Tương Lai", "Vetuonglai", "VTL", "EDU", "VC", "PWA", "OG"];
function stripBrandNames(text) {
  let out = text;
  for (const brand of BRAND_NAMES) {
    out = out.split(brand).join("");
  }
  return out;
}

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

function hasViewportMeta(html) {
  return /<meta\s+[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*["']/i.test(html);
}

function pickJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

function validateJsonLd(blocks) {
  const errors = [];
  for (let i = 0; i < blocks.length; i++) {
    try {
      const parsed = JSON.parse(blocks[i]);
      const items = Array.isArray(parsed) ? parsed
        : parsed["@graph"] ? parsed["@graph"]
        : [parsed];
      for (const item of items) {
        if (!item["@type"]) errors.push(`block ${i + 1}: item missing @type`);
        if (!item["@context"] && !parsed["@context"]) {
          // ok if parent had @context
        }
      }
    } catch (error) {
      errors.push(`block ${i + 1}: parse error — ${error.message}`);
    }
  }
  return errors;
}

function pickInternalLinks(html, currentHost) {
  // Match href="..." in anchors only (skip <link rel=...>).
  const re = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
  const out = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    if (href.startsWith("/")) {
      // Same-host absolute path
      out.add({ url: href, host: currentHost, isLocal: true });
    } else if (href.startsWith("http")) {
      try {
        const u = new URL(href);
        if (u.hostname === currentHost) {
          out.add({ url: u.pathname + (u.search || ""), host: currentHost, isLocal: true });
        } else if (u.hostname.endsWith(".vetuonglai.com") || u.hostname === "vetuonglai.com") {
          out.add({ url: u.pathname + (u.search || ""), host: u.hostname, isLocal: true });
        } else {
          out.add({ url: href, host: u.hostname, isLocal: false });
        }
      } catch {
        // invalid URL — skip
      }
    }
  }
  return Array.from(out);
}

function checkLinkExists(distRoot, host, urlPath) {
  // Strip query / fragment
  const cleanPath = urlPath.replace(/[?#].*$/, "");
  // dist/<host>/path
  const baseHostDir = path.join(distRoot, host);
  const candidates = [
    path.join(baseHostDir, cleanPath),
    path.join(baseHostDir, cleanPath, "index.html"),
    path.join(baseHostDir, cleanPath.replace(/\/$/, ""), "index.html"),
    path.join(baseHostDir, cleanPath + ".html"),
  ];
  return candidates;
}

// Parse Cloudflare Pages _redirects file format and return predicate (path => boolean).
const redirectsCache = new Map();
async function getRedirectMatcher(host) {
  if (redirectsCache.has(host)) return redirectsCache.get(host);
  const redirectsPath = path.join(DIST, host, "_redirects");
  let rules = [];
  try {
    const text = await readFile(redirectsPath, "utf8");
    rules = text.split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const parts = line.split(/\s+/);
        return { from: parts[0], to: parts[1] || "", code: parts[2] || "" };
      });
  } catch {
    rules = [];
  }
  const matcher = (urlPath) => {
    const cleanPath = urlPath.replace(/[?#].*$/, "");
    for (const rule of rules) {
      if (!rule.from) continue;
      if (rule.from === cleanPath) return true;
      if (rule.from.endsWith("/*")) {
        const prefix = rule.from.slice(0, -2);
        if (cleanPath.startsWith(prefix)) return true;
      }
    }
    return false;
  };
  redirectsCache.set(host, matcher);
  return matcher;
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
  if (!hasViewportMeta(html)) issues.push({ severity: "high", code: "missing-viewport", detail: "no viewport meta with width=device-width" });

  // schema.org JSON-LD validation
  const ldBlocks = pickJsonLdBlocks(html);
  const ldErrors = validateJsonLd(ldBlocks);
  for (const err of ldErrors) {
    issues.push({ severity: "medium", code: "schema-invalid", detail: err });
  }

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

  // Mixed VI / EN inside the same data-content / data-text / data-vi-en pair.
  // Strip brand names before language detection (brand may legitimately appear in both sides).
  const pairAttrRe = /data-(content|text|html|aria-label)-vi="([^"]+)"\s+data-\1-en="([^"]+)"/g;
  let mPair;
  let mixedPairCount = 0;
  while ((mPair = pairAttrRe.exec(html)) !== null) {
    const viStripped = stripBrandNames(mPair[2]);
    const enStripped = stripBrandNames(mPair[3]);
    if (viStripped && enStripped && isEnglishSentence(viStripped) && !isVietnameseSentence(viStripped)) {
      mixedPairCount++;
    }
    if (viStripped && enStripped && isVietnameseSentence(enStripped)) {
      mixedPairCount++;
    }
  }
  if (mixedPairCount > 0) {
    issues.push({ severity: "medium", code: "mixed-language-pair", detail: `${mixedPairCount} bilingual attribute pair(s) appear language-swapped` });
  }

  // Missing alt text on <img>
  const imgRe = /<img\b([^>]*)>/g;
  let imgM;
  let imgWithoutAlt = 0;
  let imgWithEmptyAlt = 0;
  while ((imgM = imgRe.exec(html)) !== null) {
    const attrs = imgM[1];
    const altMatch = attrs.match(/\balt=["']([^"']*)["']/);
    if (!altMatch) imgWithoutAlt++;
    else if (altMatch[1].trim() === "") imgWithEmptyAlt++;
  }
  if (imgWithoutAlt > 0) {
    issues.push({ severity: "high", code: "image-missing-alt", detail: `${imgWithoutAlt} <img> without alt attribute` });
  }
  if (imgWithEmptyAlt > 0) {
    issues.push({ severity: "low", code: "image-empty-alt", detail: `${imgWithEmptyAlt} <img> with empty alt (decorative? confirm intent)` });
  }

  // Machine-translation red flags
  for (const { needle, label } of MT_PATTERNS) {
    const matches = html.match(needle);
    if (matches && matches.length > 0) {
      issues.push({ severity: "medium", code: "mt-phrasing", detail: `${label} ×${matches.length}` });
    }
  }

  // Hard-coded text without bilingual attributes (excluding noindex pages and kids static pages
  // which use data-vi/data-en consistently). Strip <script>, <style>, and <template> blocks first
  // to avoid matching JS template-literal text or CSS selectors.
  if (!noindex && !isKidsHost(host)) {
    const visibleHtml = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<template[\s\S]*?<\/template>/g, "");
    let hardcodedCount = 0;
    const hardcodedSamples = [];
    let hcM;
    TEXT_NODE_RE.lastIndex = 0;
    while ((hcM = TEXT_NODE_RE.exec(visibleHtml)) !== null) {
      const attrs = hcM[2];
      const inner = hcM[3];
      if (hasBilingualAttr(attrs)) continue;
      if (!/\s/.test(inner.trim())) continue;
      if (/<[a-z]/i.test(inner)) continue;
      // Skip JS template literal residues
      if (/['"]\s*\+\s*escapeHtml/.test(inner)) continue;
      hardcodedCount++;
      if (hardcodedSamples.length < 3) hardcodedSamples.push(inner.trim().slice(0, 80));
    }
    if (hardcodedCount > 0) {
      issues.push({ severity: "medium", code: "hardcoded-text", detail: `${hardcodedCount} block(s) of text without bilingual data-* attributes (samples: ${hardcodedSamples.map((s) => JSON.stringify(s)).join(", ")})` });
    }
  }

  // Link reachability — only for internal links pointing to other dist files.
  // Honour _redirects (Cloudflare Pages) so dynamic prefixes like /v/* are
  // treated as reachable.
  const links = pickInternalLinks(html, host);
  const broken = [];
  for (const link of links) {
    if (!link.isLocal) continue;
    const candidates = checkLinkExists(DIST, link.host, link.url);
    let found = false;
    for (const candidate of candidates) {
      try {
        await access(candidate);
        found = true;
        break;
      } catch {}
    }
    if (!found) {
      const matcher = await getRedirectMatcher(link.host);
      if (matcher(link.url)) {
        found = true;
      }
    }
    if (!found) {
      broken.push(`${link.host}${link.url}`);
    }
  }
  if (broken.length > 0) {
    const sample = broken.slice(0, 5).map((s) => JSON.stringify(s)).join(", ");
    issues.push({ severity: "high", code: "broken-internal-link", detail: `${broken.length} broken internal link(s): ${sample}` });
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
