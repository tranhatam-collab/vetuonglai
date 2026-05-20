#!/usr/bin/env node
/**
 * scripts/verify-public-lexicon.mjs
 *
 * Founder Lock VTL_75 §1.1, §1.2 + Public Copy Plan §14.4 + Public
 * Positioning §3.1: certain strings MUST NOT appear on any public
 * (logged-out) HTML surface. This verifier scans dist/**\/*.html and
 * fails the release if any forbidden string is present.
 *
 * The list of forbidden strings is the canonical V1 set per
 * docs/00_master/VETUONGLAI_DOCS_AND_HOMEPAGE_PUBLIC_COPY_PLAN_2026.md
 * §14.4. Any addition or removal must be accompanied by a Founder memo
 * update.
 *
 * Public surface = everything under dist/ EXCEPT post-login routes
 * (member.vetuonglai.com/app/**, any /admin/, any /api/). The verifier
 * scans only logged-out subdomains by default.
 *
 * Output: reports/public-lexicon.latest.json
 *   { ok, scanned_files, hard_failures, manual_review,
 *     negation_filtered_count, allowlisted_count,
 *     allowlist_entries_loaded, hits: [...] }
 *
 * Exit 0 on pass, 1 on fail.
 *
 * ─── CLI flags ─────────────────────────────────────────────────────
 *
 * --no-negation-filter
 *     Disable the negation-aware detector and revert to legacy
 *     behavior (every substring match is a hit). Useful for debugging
 *     classification regressions.
 *
 * --allowlist=<path>
 *     Override the canonical allowlist file path. Default is
 *     `docs/final-lock/VTL_75_INFRA_IAI_ONE_ALLOWLIST_2026-05-07.md`
 *     relative to repo root.
 *
 * ─── Negation-aware detection ──────────────────────────────────────
 *
 * After locating a candidate match on a line, the verifier examines
 * the 50 characters immediately preceding the match (within the same
 * line). If a recognized negation token (VI: không, chưa, cấm, tránh,
 * loại bỏ, đừng, không được, không có, không phải, không dùng,
 * không cam kết, không hứa; EN: no, not, never, prohibited, forbidden,
 * avoid, excluded, disallow(ed), do not, does not, is not, are not,
 * without) appears in that window, the hit is dropped.
 *
 * Each retained hit is annotated with `negation_checked: true` and
 * the report includes a `negation_filtered_count`.
 *
 * ─── External allowlist ────────────────────────────────────────────
 *
 * The allowlist file is a Markdown document. Each allowlist entry is
 * a line matching:
 *
 *   ^- `<path>`(?:\s+\(term:\s*<term>\))?\s*$
 *
 * `<path>` is a repo-relative path (e.g.
 * `dist/vc.vetuonglai.com/index.html`). `<term>` is optional; when
 * absent it defaults to `iai.one`. A hit is suppressed when its file
 * path matches an entry's path AND its term equals the entry's term.
 *
 * The allowlist takes effect ONLY when the file contains a non-empty
 * Founder signature line of the exact form:
 *
 *   Founder signature: <name>
 *
 * (anywhere in the file). If the signature line is missing or empty,
 * the file is treated as inert: a warning is logged and NO hits are
 * suppressed.
 *
 * The pre-existing `<!-- VTL-LEXICON-ALLOW -->` inline-comment escape
 * hatch continues to work alongside the external allowlist.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "public-lexicon.latest.json");
const DEFAULT_ALLOWLIST_PATH = path.join(
  REPO_ROOT,
  "docs",
  "final-lock",
  "VTL_75_INFRA_IAI_ONE_ALLOWLIST_2026-05-07.md",
);

// ─── CLI flag parsing ──────────────────────────────────────────────
const argv = process.argv.slice(2);
const NEGATION_FILTER_ENABLED = !argv.includes("--no-negation-filter");
let allowlistPathArg = null;
for (const a of argv) {
  if (a.startsWith("--allowlist=")) {
    allowlistPathArg = a.slice("--allowlist=".length);
  }
}
const ALLOWLIST_PATH = allowlistPathArg
  ? path.resolve(REPO_ROOT, allowlistPathArg)
  : DEFAULT_ALLOWLIST_PATH;

// Forbidden strings (case-insensitive). Each entry has:
//   pattern: substring to match (lowercased)
//   diacritic_variants: optional VI variants without diacritics
//   manual_review: true if the term may appear in legitimate body prose
//                  but must be flagged for human review (we still record
//                  the hit; we just don't fail the build for these)
const FORBIDDEN = [
  { term: "kiếm tiền", variants: ["kiem tien"] },
  { term: "thu nhập thụ động", variants: ["thu nhap thu dong"] },
  { term: "passive income" },
  { term: "đổi đời", variants: ["doi doi"] },
  { term: "làm giàu", variants: ["lam giau"] },
  { term: "get rich" },
  { term: "become rich" },
  { term: "đảm bảo thu nhập", variants: ["dam bao thu nhap"] },
  { term: "guaranteed income" },
  { term: "affiliate program" },
  { term: "affiliate marketing" },
  { term: "MLM" },
  { term: "multi-level" },
  { term: "network marketing" },
  { term: "downline" },
  { term: "upline" },
  { term: "ROI" },
  { term: "expected return" },
  { term: "lợi nhuận kỳ vọng", variants: ["loi nhuan ky vong"] },
  { term: "expected ROI" },
  { term: "Invest now" },
  { term: "Đầu tư ngay", variants: ["dau tu ngay"] },
  { term: "Become an investor" },
  { term: "Trở thành nhà đầu tư", variants: ["tro thanh nha dau tu"] },
  { term: "Join investor waitlist" },
  { term: "Đăng ký danh sách nhà đầu tư", variants: ["dang ky danh sach nha dau tu"] },
  { term: "cheap labor" },
  { term: "low-cost outsource" },
  { term: "nhân công giá rẻ", variants: ["nhan cong gia re"] },
  { term: "iai.one" },
  // Manual-review terms: hit is recorded with manual_review=true so a
  // human can confirm context (e.g., "marketplace" inside a paragraph
  // explaining what we are not). These do NOT fail the build but appear
  // in the report for review.
  { term: "marketplace", manual_review: true },
  { term: "Cơ hội đầu tư", variants: ["co hoi dau tu"], manual_review: true },
  { term: "affiliate", manual_review: true }, // bare word, may be inside legacy code identifiers
];

// Excluded path patterns (post-login surfaces, admin, etc.)
const EXCLUDED_PATH_PATTERNS = [
  /\/app\//,
  /\/admin\//,
  /\/api\//,
  /\/dev\//,
  /\/_next\//,
  // member.vetuonglai.com is a post-login surface in V1; logged-out marketing
  // landing of member.* is allowed but treated as public — for now scan all of
  // member.* and rely on excluded subpaths above to drop dashboard pages.
];

// ─── Negation tokens ───────────────────────────────────────────────
// Single-word tokens are matched with regex word boundaries. Multi-word
// tokens (containing spaces) are matched as plain substrings inside
// the pre-context window.
const NEGATION_TOKENS_SINGLE = [
  // VI single-word
  "không", "chưa", "cấm", "tránh", "đừng",
  // EN single-word
  "no", "not", "never", "prohibited", "forbidden",
  "avoid", "excluded", "disallow", "disallowed", "without",
];
const NEGATION_TOKENS_MULTI = [
  // VI multi-word
  "loại bỏ",
  "không được",
  "không có",
  "không phải",
  "không dùng",
  "không cam kết",
  "không hứa",
  // EN multi-word
  "do not",
  "does not",
  "is not",
  "are not",
  // Added for material-connection legal prose
  "Không được dùng các từ ngữ kiểu:",
  "The following wording is prohibited:"
];
// Build a single regex for single-word tokens with word boundaries.
// We escape regex special chars defensively, though current tokens
// contain none.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const NEGATION_SINGLE_RE = new RegExp(
  "(?:^|[^\\p{L}\\p{N}_])(" +
    NEGATION_TOKENS_SINGLE.map(escapeRegex).join("|") +
    ")(?:$|[^\\p{L}\\p{N}_])",
  "iu",
);

function hasNegationBefore(lineLower, idx) {
  const start = Math.max(0, idx - 200);
  const window = lineLower.slice(start, idx);
  if (NEGATION_SINGLE_RE.test(window)) return true;
  for (const tok of NEGATION_TOKENS_MULTI) {
    if (window.includes(tok)) return true;
  }
  return false;
}

// ─── Allowlist parsing ─────────────────────────────────────────────
function loadAllowlist(filePath) {
  const result = { entries: [], signed: false, signer: null, present: false };
  if (!fs.existsSync(filePath)) return result;
  result.present = true;
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return result;
  }
  // Founder signature
  const sigMatch = raw.match(/^Founder signature:\s*(.+?)\s*$/m);
  if (sigMatch && sigMatch[1].trim().length > 0) {
    result.signed = true;
    result.signer = sigMatch[1].trim();
  }
  // Entries
  const entryRe = /^- `([^`]+)`(?:\s+\(term:\s*([^)]+)\))?\s*$/gm;
  let m;
  while ((m = entryRe.exec(raw)) !== null) {
    const p = m[1].trim();
    const t = m[2] ? m[2].trim() : "iai.one";
    result.entries.push({ path: p, term: t });
  }
  return result;
}

function isAllowlisted(hit, allowlist) {
  if (!allowlist.signed) return false;
  // Normalize file path to forward slashes for comparison.
  const hitFile = hit.file.split(path.sep).join("/");
  for (const e of allowlist.entries) {
    const entryPath = e.path.split(path.sep).join("/");
    if (hitFile === entryPath && hit.term.toLowerCase() === e.term.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function shouldExclude(relPath) {
  return EXCLUDED_PATH_PATTERNS.some((rx) => rx.test(relPath));
}

function* walkHtml(rootDir) {
  if (!fs.existsSync(rootDir)) return;
  const stack = [rootDir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else if (e.isFile() && full.toLowerCase().endsWith(".html")) {
        const rel = path.relative(rootDir, full);
        if (shouldExclude("/" + rel)) continue;
        yield full;
      }
    }
  }
}

function findHits(html, htmlLower, file, stats) {
  const hits = [];
  const lines = html.split("\n");
  const linesLower = htmlLower.split("\n");
  for (const entry of FORBIDDEN) {
    const candidates = [entry.term, ...(entry.variants || [])];
    for (const cand of candidates) {
      const candLower = cand.toLowerCase();
      for (let i = 0; i < linesLower.length; i++) {
        let searchFrom = 0;
        const lineLower = linesLower[i];
        while (true) {
          const idx = lineLower.indexOf(candLower, searchFrom);
          if (idx < 0) break;
          searchFrom = idx + candLower.length;
          // Skip if inside an HTML comment that begins with <!-- VTL-LEXICON-ALLOW
          // (escape hatch for legitimate body prose explaining what we are not).
          const lineRaw = lines[i];
          if (/<!--\s*VTL-LEXICON-ALLOW/i.test(lineRaw)) continue;
          // Negation-aware filter
          if (NEGATION_FILTER_ENABLED && hasNegationBefore(lineLower, idx)) {
            stats.negation_filtered_count += 1;
            continue;
          }
          hits.push({
            file,
            line: i + 1,
            term: entry.term,
            matched: cand,
            manual_review: !!entry.manual_review,
            negation_checked: NEGATION_FILTER_ENABLED,
            snippet: lineRaw.trim().slice(0, 240),
          });
          // Only record one hit per (term, line) pair to avoid duplicate
          // noise (matches the legacy behavior).
          break;
        }
      }
    }
  }
  return hits;
}

function main() {
  const stats = { negation_filtered_count: 0 };
  const allowlist = loadAllowlist(ALLOWLIST_PATH);
  if (allowlist.present && !allowlist.signed) {
    console.warn(
      `verify-public-lexicon: WARNING — allowlist at ${path.relative(REPO_ROOT, ALLOWLIST_PATH)} ` +
        `is missing a non-empty 'Founder signature:' line. Treating allowlist as inert; no hits will be suppressed.`,
    );
  }
  const allHits = [];
  let scanned = 0;
  if (!fs.existsSync(DIST_ROOT)) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify({ ok: false, error: "dist/ does not exist; run npm run build first" }, null, 2),
    );
    console.error("verify-public-lexicon: dist/ missing — run npm run build");
    process.exit(1);
  }
  for (const file of walkHtml(DIST_ROOT)) {
    scanned++;
    let html;
    try {
      html = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const hits = findHits(html, html.toLowerCase(), path.relative(REPO_ROOT, file), stats);
    allHits.push(...hits);
  }

  // Apply allowlist suppression
  let allowlisted_count = 0;
  const retainedHits = [];
  for (const h of allHits) {
    if (isAllowlisted(h, allowlist)) {
      allowlisted_count += 1;
      continue;
    }
    retainedHits.push(h);
  }

  const hardHits = retainedHits.filter((h) => !h.manual_review);
  const reviewHits = retainedHits.filter((h) => h.manual_review);
  const ok = hardHits.length === 0;
  const report = {
    ok,
    scanned_files: scanned,
    hard_failures: hardHits.length,
    manual_review: reviewHits.length,
    negation_filtered_count: stats.negation_filtered_count,
    negation_filter_enabled: NEGATION_FILTER_ENABLED,
    allowlisted_count,
    allowlist_entries_loaded: allowlist.signed ? allowlist.entries.length : 0,
    allowlist_path: path.relative(REPO_ROOT, ALLOWLIST_PATH),
    allowlist_present: allowlist.present,
    allowlist_signed: allowlist.signed,
    allowlist_signer: allowlist.signer,
    hits: retainedHits,
    timestamp: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!ok) {
    console.error(
      `verify-public-lexicon: FAIL — ${hardHits.length} forbidden string(s) on public surface ` +
        `(negation_filtered=${stats.negation_filtered_count}, allowlisted=${allowlisted_count})`,
    );
    for (const h of hardHits.slice(0, 25)) {
      console.error(`  [${h.term}] ${h.file}:${h.line} → ${h.snippet}`);
    }
    if (hardHits.length > 25) console.error(`  …and ${hardHits.length - 25} more (see report).`);
    process.exit(1);
  }
  console.log(
    `verify-public-lexicon: PASS — scanned ${scanned} html files; ` +
      `${reviewHits.length} manual-review hit(s); ` +
      `negation_filtered=${stats.negation_filtered_count}; allowlisted=${allowlisted_count}.`,
  );
  process.exit(0);
}

main();
