#!/usr/bin/env node
/**
 * scripts/verify-microcopy-canon.mjs
 *
 * Founder Lock VTL_75 + Public Positioning §7 + Public Copy Plan §14:
 * every CTA on a public surface must use a canonical microcopy string.
 * This verifier extracts visible text inside <a> and <button> elements
 * (and elements with role="button") on public HTML, normalizes it, and
 * compares against the canonical CTA library.
 *
 * Unrecognized CTA strings are recorded as drift so a human can either
 * (a) approve the new string by adding it to the canon, or (b) revert
 * the page to canonical wording.
 *
 * Approach is intentionally conservative: we record drift in the report
 * and exit 0 (advisory) by default; switch ADVISORY_ONLY to false once
 * the homepage and product landings have stabilized.
 *
 * Output: reports/microcopy-canon.latest.json
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "microcopy-canon.latest.json");

const ADVISORY_ONLY = true;

// Canonical CTA strings — Public Positioning §7 + Public Copy Plan §14.1-§14.3
const CANON = new Set(
  [
    // Sign-up / membership
    "Đăng ký miễn phí",
    "Sign up free",
    "Trở thành Thành viên — $99/năm",
    "Become a Member — $99/year",
    "Khám phá sản phẩm nhỏ",
    "Browse mini products",
    "Đăng nhập",
    "Log in",
    "Khám phá sản phẩm nhỏ ($3-$9)",
    "Browse mini products ($3-$9)",
    // Browse
    "Đọc sách",
    "Browse books",
    "Đọc bài viết",
    "Browse essays",
    "Xem chương trình học",
    "Browse programs",
    "Xem chứng chỉ",
    "View credential",
    "Xem các gói",
    "View options",
    "Xem chi tiết các gói",
    "View pricing detail",
    // Trust
    "Đọc cẩm nang vận hành",
    "Read the operating manual",
    "Xem 5 cam kết",
    "See our 5 commitments",
    "Tiết lộ quan hệ lợi ích",
    "Material connection disclosure",
    "Tuyên bố về thu nhập",
    "Income disclaimer",
    "Quyền riêng tư & dữ liệu",
    "Privacy & data",
    "Tuyên bố rủi ro đầu tư",
    "Investment risk disclosure",
    // Common navigation tokens (single-word) — allow for nav menus
    "Sản phẩm",
    "Products",
    "Học",
    "Edu",
    "Đọc",
    "Read",
    "Cẩm nang vận hành",
    "Operating manual",
    "Tìm hiểu thêm",
    "Learn more",
  ].map((s) => s.trim()),
);

// Normalize text for comparison (collapse whitespace, strip surrounding punctuation)
function normalize(s) {
  return s.replace(/\s+/g, " ").trim().replace(/^[\s\u00A0\-–—•»·›]+|[\s\u00A0\-–—•»·›]+$/g, "");
}

// Pull text content out of <a> and <button> tags (very lightweight HTML parser)
function extractCTAStrings(html) {
  const out = [];
  // Match <a ...>TEXT</a>, <button ...>TEXT</button>, <... role="button" ...>TEXT</...>
  const patterns = [
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    /<button\b[^>]*>([\s\S]*?)<\/button>/gi,
    /<([a-z][a-z0-9]*)\b[^>]*\brole=["']button["'][^>]*>([\s\S]*?)<\/\1>/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const inner = m[m.length - 1];
      // Strip nested tags, keep text
      const text = inner.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      const norm = normalize(text);
      if (norm && norm.length <= 120) out.push(norm);
    }
  }
  return out;
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
        if (/\/(app|admin|api|_next)\//.test(full + "/")) continue;
        stack.push(full);
      } else if (e.isFile() && full.toLowerCase().endsWith(".html")) {
        yield full;
      }
    }
  }
}

function main() {
  if (!fs.existsSync(DIST_ROOT)) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ ok: false, error: "dist/ missing" }, null, 2));
    console.error("verify-microcopy-canon: dist/ missing");
    process.exit(1);
  }
  const drift = {}; // text -> [{file, count}]
  let scanned = 0;
  for (const file of walkHtml(DIST_ROOT)) {
    scanned++;
    let html;
    try {
      html = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const ctas = extractCTAStrings(html);
    for (const c of ctas) {
      if (CANON.has(c)) continue;
      // Skip pure URL / plain anchor without text (e.g., "→")
      if (!c || c.length < 2) continue;
      // Skip text that looks like an icon / arrow
      if (/^[\s\-→»›·•]+$/.test(c)) continue;
      // Skip raw URLs
      if (/^https?:\/\//.test(c)) continue;
      // Skip purely numeric or single-character
      if (/^\d+$/.test(c)) continue;
      drift[c] = drift[c] || { count: 0, files: new Set() };
      drift[c].count++;
      drift[c].files.add(path.relative(REPO_ROOT, file));
    }
  }

  const driftList = Object.entries(drift)
    .map(([text, info]) => ({ text, count: info.count, files: [...info.files].slice(0, 5) }))
    .sort((a, b) => b.count - a.count);

  const ok = driftList.length === 0;
  const report = {
    ok,
    advisory_only: ADVISORY_ONLY,
    scanned_files: scanned,
    canon_size: CANON.size,
    drift_count: driftList.length,
    top_drift: driftList.slice(0, 50),
    timestamp: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!ok && !ADVISORY_ONLY) {
    console.error(`verify-microcopy-canon: FAIL — ${driftList.length} non-canonical CTA strings`);
    for (const d of driftList.slice(0, 25)) {
      console.error(`  [${d.count}x] "${d.text}" → ${d.files.join(", ")}`);
    }
    process.exit(1);
  }
  if (!ok) {
    console.warn(`verify-microcopy-canon: ADVISORY — ${driftList.length} non-canonical CTAs (see report)`);
  } else {
    console.log(`verify-microcopy-canon: PASS — scanned ${scanned} html files; canon size ${CANON.size}`);
  }
  process.exit(0);
}

main();
