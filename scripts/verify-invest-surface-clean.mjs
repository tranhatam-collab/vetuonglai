#!/usr/bin/env node
/**
 * scripts/verify-invest-surface-clean.mjs
 *
 * Founder Lock VTL_75 §1.5 + Public Positioning §6.2 + Product
 * Architecture §6: the public surface MUST NOT carry any invest CTA,
 * waitlist, "expected return", "ROI", or any link pointing to an
 * invest-related URL outside the canonical educational page at
 * https://invest.vetuonglai.com (and its /en mirror).
 *
 * Specifically forbidden on public surface (logged-out HTML):
 *   - Any href containing "invest.iai.one"
 *   - Any href containing "/invest/waitlist", "/invest/apply",
 *     "/invest/register", "/invest/signup", "/invest/cta"
 *   - Any visible CTA-styled element (a/button) whose text matches:
 *       "Đầu tư ngay" / "Invest now" / "Become an investor" /
 *       "Trở thành nhà đầu tư" / "Join investor waitlist" /
 *       "Đăng ký danh sách nhà đầu tư"
 *   - Any text "expected return", "expected ROI",
 *     "lợi nhuận kỳ vọng", "ROI" on logged-out surface
 *
 * Allowed on public surface:
 *   - Educational page at invest.vetuonglai.com (and /en) — this page
 *     itself is scanned but is allowed to mention the word "đầu tư"
 *     in expository / risk-disclosure prose; only the forbidden
 *     CTAs and forbidden phrases are checked.
 *   - Risk disclosure / income disclaimer pages under /legal/* — these
 *     are exempt because they describe risks by name.
 *
 * Output: reports/invest-surface-clean.latest.json
 *
 * Exit 0 on pass, 1 on fail.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "invest-surface-clean.latest.json");

const FORBIDDEN_HREF_SUBSTRINGS = [
  "invest.iai.one",
  "/invest/waitlist",
  "/invest/apply",
  "/invest/register",
  "/invest/signup",
  "/invest/cta",
];

const FORBIDDEN_CTA_TEXTS = [
  "đầu tư ngay",
  "invest now",
  "become an investor",
  "trở thành nhà đầu tư",
  "join investor waitlist",
  "đăng ký danh sách nhà đầu tư",
];

const FORBIDDEN_PHRASES = [
  "expected return",
  "expected roi",
  "lợi nhuận kỳ vọng",
  "loi nhuan ky vong",
];

// Path-level exemption (relative under dist/) — these pages may legitimately
// mention forbidden phrases in disclosure context.
function isExemptPath(rel) {
  return (
    /\/legal\//.test(rel) ||
    /\binvest\.vetuonglai\.com\b/.test(rel)
  );
}

// Path-level exclusion (post-login etc.) — not part of public surface.
function isExcluded(rel) {
  return /\/(app|admin|api|_next|dev)\//.test("/" + rel.replace(/\\/g, "/"));
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
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && full.toLowerCase().endsWith(".html")) yield full;
    }
  }
}

function findCTAs(html) {
  const out = [];
  const patterns = [
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    /<button\b([^>]*)>([\s\S]*?)<\/button>/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const attrs = m[1];
      const inner = m[2];
      const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const hrefMatch = /\bhref=["']([^"']+)["']/i.exec(attrs || "");
      out.push({ text: text.toLowerCase(), href: hrefMatch ? hrefMatch[1] : null, raw: text });
    }
  }
  return out;
}

function checkPage(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  if (isExcluded(rel)) return null;
  const html = fs.readFileSync(absPath, "utf8");
  const lower = html.toLowerCase();
  const findings = [];
  const exempt = isExemptPath(rel);

  // 1. Forbidden href substrings (NEVER allowed, even on exempt paths,
  //    except invest.iai.one which is forbidden everywhere; canonical
  //    invest.vetuonglai.com page itself does not link to invest.iai.one
  //    so this remains a hard rule).
  const ctas = findCTAs(html);
  for (const c of ctas) {
    if (!c.href) continue;
    for (const sub of FORBIDDEN_HREF_SUBSTRINGS) {
      if (c.href.toLowerCase().includes(sub)) {
        findings.push({ type: "forbidden_href", href: c.href, text: c.raw, rule: sub });
      }
    }
  }
  // 2. Forbidden CTA texts on a/button — never allowed (even on the
  //    educational invest page; that page must not host an invest CTA).
  for (const c of ctas) {
    for (const t of FORBIDDEN_CTA_TEXTS) {
      if (c.text === t || c.text.startsWith(t)) {
        findings.push({ type: "forbidden_cta_text", text: c.raw, href: c.href, rule: t });
      }
    }
  }
  // 3. Forbidden phrases — only on non-exempt paths.
  if (!exempt) {
    for (const p of FORBIDDEN_PHRASES) {
      if (lower.includes(p)) {
        // capture line for context
        const lines = html.split("\n");
        const lineIdx = lines.findIndex((l) => l.toLowerCase().includes(p));
        findings.push({
          type: "forbidden_phrase",
          phrase: p,
          line: lineIdx >= 0 ? lineIdx + 1 : null,
          snippet: lineIdx >= 0 ? lines[lineIdx].trim().slice(0, 240) : null,
        });
      }
    }
  }

  return { file: rel, findings, exempt };
}

function main() {
  if (!fs.existsSync(DIST_ROOT)) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ ok: false, error: "dist/ missing" }, null, 2));
    console.error("verify-invest-surface-clean: dist/ missing");
    process.exit(1);
  }
  const allFindings = [];
  let scanned = 0;
  for (const f of walkHtml(DIST_ROOT)) {
    const r = checkPage(f);
    if (!r) continue;
    scanned++;
    if (r.findings.length) allFindings.push(r);
  }
  const totalFindings = allFindings.reduce((n, p) => n + p.findings.length, 0);
  const ok = totalFindings === 0;
  const report = {
    ok,
    scanned_files: scanned,
    files_with_findings: allFindings.length,
    total_findings: totalFindings,
    findings: allFindings,
    timestamp: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!ok) {
    console.error(`verify-invest-surface-clean: FAIL — ${totalFindings} finding(s) across ${allFindings.length} file(s)`);
    for (const p of allFindings.slice(0, 20)) {
      for (const f of p.findings.slice(0, 5)) {
        console.error(`  ${p.file}: ${f.type} → ${JSON.stringify(f).slice(0, 200)}`);
      }
    }
    process.exit(1);
  }
  console.log(`verify-invest-surface-clean: PASS — scanned ${scanned} html files, surface clean`);
  process.exit(0);
}

main();
