/**
 * verify-read-phase0.mjs
 *
 * Phase 0 readiness gate for read.vetuonglai.com.
 * Checks:
 *   1. dist/read.vetuonglai.com exists with required pages
 *   2. Bilingual audit 0 issues for read host
 *   3. No banned phrases in read dist HTML
 *   4. Runtime truth stage = planned_public
 *   5. Pages project = vetuonglai-read in config
 *   6. apps.json has read entry with status planned
 *
 * Usage:  node scripts/verify-read-phase0.mjs [--live]
 *   --live  also runs HTTP 200 probe against read.vetuonglai.com
 */

import { readFile, stat, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dns.setDefaultResultOrder("ipv4first");
const execFileAsync = promisify(execFile);

const REQUIRED_PAGES = [
  "index.html",
  "how-we-pay/index.html",
  "transparency/index.html",
  "creator/index.html",
  "submit/index.html",
  "review/index.html",
  "stacks/index.html",
  "terms/index.html",
  "tax-note/index.html",
];

const LIVE = process.argv.includes("--live");
const results = [];

function check(key, pass, detail) {
  results.push({ key, pass, detail });
  const icon = pass ? "✓" : "✗";
  console.log(`  ${icon} ${key}: ${detail}`);
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(rel) {
  const raw = await readFile(path.join(ROOT, rel), "utf8");
  return JSON.parse(raw);
}

async function collectHtmlFiles(dir) {
  const out = [];
  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name.endsWith(".html")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

// ── 1. dist exists with required pages ──
async function checkDist() {
  const distDir = path.join(ROOT, "dist/read.vetuonglai.com");
  const exists = await fileExists(distDir);
  if (!exists) {
    check("dist_exists", false, "dist/read.vetuonglai.com missing — run npm run build");
    return;
  }
  check("dist_exists", true, "dist/read.vetuonglai.com present");

  const missing = [];
  for (const p of REQUIRED_PAGES) {
    if (!(await fileExists(path.join(distDir, p)))) missing.push(p);
  }
  check(
    "required_pages",
    missing.length === 0,
    missing.length === 0
      ? `all ${REQUIRED_PAGES.length} required pages present`
      : `missing: ${missing.join(", ")}`,
  );
}

// ── 2. Bilingual audit 0 issues for read ──
async function checkBilingualAudit() {
  const reportPath = path.join(ROOT, "docs/00_master/42_BILINGUAL_AUDIT_REPORT.md");
  if (!(await fileExists(reportPath))) {
    check("bilingual_audit", false, "audit report not found — run npm run audit:bilingual");
    return;
  }
  const content = await readFile(reportPath, "utf8");
  const match = content.match(/read\.vetuonglai\.com[^\n]*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/);
  if (!match) {
    check("bilingual_audit", false, "could not parse read row in audit report");
    return;
  }
  const issues = parseInt(match[2], 10);
  check("bilingual_audit", issues === 0, `read.vetuonglai.com: ${issues} bilingual issues`);
}

// ── 3. No banned phrases in read dist HTML ──
async function checkBannedPhrases() {
  const distDir = path.join(ROOT, "dist/read.vetuonglai.com");
  if (!(await fileExists(distDir))) {
    check("banned_phrases", false, "dist missing");
    return;
  }
  let bannedTerms;
  try {
    const data = await readJson("src/data/banned-terms-public.json");
    bannedTerms = (data.bannedTerms || []).map((t) => t.term);
  } catch {
    check("banned_phrases", false, "could not read banned-terms-public.json");
    return;
  }

  const htmlFiles = await collectHtmlFiles(distDir);
  const findings = [];
  for (const f of htmlFiles) {
    const html = await readFile(f, "utf8");
    // Strip HTML tags to check visible text only
    const text = html.replace(/<[^>]+>/g, " ");
    for (const term of bannedTerms) {
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      if (re.test(text)) {
        findings.push(`${path.relative(distDir, f)}: "${term}"`);
      }
    }
  }
  check(
    "banned_phrases",
    findings.length === 0,
    findings.length === 0
      ? `0 banned phrases in ${htmlFiles.length} HTML files`
      : `found ${findings.length}: ${findings.slice(0, 5).join("; ")}`,
  );
}

// ── 4. Runtime truth stage ──
async function checkRuntimeTruth() {
  try {
    const data = await readJson("cloudflare/domain-runtime-truth.json");
    const domains = data.domains || [];
    const read = domains.find((d) => d.host === "read.vetuonglai.com") || {};
    const stage = read.status || "not_found";
    check(
      "runtime_truth_stage",
      stage === "planned_public",
      `read.vetuonglai.com status = "${stage}"`,
    );
  } catch (e) {
    check("runtime_truth_stage", false, `error: ${e.message}`);
  }
}

// ── 5. Pages project config ──
async function checkPagesProject() {
  try {
    const data = await readJson("cloudflare/pages-projects.json");
    const projects = data.projects || [];
    const read = projects.find((p) => p.key === "read");
    check(
      "pages_project",
      read && read.projectName === "vetuonglai-read",
      read ? `projectName = "${read.projectName}"` : "read project not found",
    );
  } catch (e) {
    check("pages_project", false, `error: ${e.message}`);
  }
}

// ── 6. apps.json has read ──
async function checkAppsJson() {
  try {
    const data = await readJson("src/data/apps.json");
    const read = data.find((a) => a.key === "read");
    check(
      "apps_json",
      read && read.status === "planned",
      read ? `key=read, status="${read.status}"` : "read entry not found",
    );
  } catch (e) {
    check("apps_json", false, `error: ${e.message}`);
  }
}

// ── 7. Live HTTP probe (optional) ──
async function checkLiveHttp() {
  if (!LIVE) {
    check("live_http", true, "skipped (use --live to enable)");
    return;
  }
  const pages = ["/", "/how-we-pay/", "/transparency/", "/creator/", "/submit/", "/review/", "/stacks/", "/terms/", "/tax-note/"];
  const failures = [];
  for (const pg of pages) {
    const url = `https://read.vetuonglai.com${pg}`;
    let status = null;
    let fetchErr = null;
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      status = res.status;
    } catch (e) {
      fetchErr = e;
    }

    if (status === 200) continue;

    try {
      const { stdout } = await execFileAsync("curl", [
        "-sS",
        "-L",
        "--max-time",
        "10",
        "-o",
        "/dev/null",
        "-w",
        "%{http_code}",
        url,
      ]);
      const curlStatus = Number(String(stdout || "").trim());
      if (curlStatus !== 200) {
        const reason = status ?? fetchErr?.message ?? "probe_failed";
        failures.push(`${pg} → ${reason} (curl=${Number.isFinite(curlStatus) ? curlStatus : "n/a"})`);
      }
    } catch (curlErr) {
      const reason = status ?? fetchErr?.message ?? "probe_failed";
      failures.push(`${pg} → ${reason}; curl_error=${curlErr.message}`);
    }
  }
  check(
    "live_http",
    failures.length === 0,
    failures.length === 0
      ? `all ${pages.length} pages return 200`
      : `failures: ${failures.join("; ")}`,
  );
}

// ── Run ──
console.log("\n🔍 verify-read-phase0\n");

await checkDist();
await checkBilingualAudit();
await checkBannedPhrases();
await checkRuntimeTruth();
await checkPagesProject();
await checkAppsJson();
await checkLiveHttp();

const passed = results.filter((r) => r.pass).length;
const total = results.length;
const allPass = results.every((r) => r.pass);

console.log(`\n${allPass ? "✅" : "❌"} ${passed}/${total} checks passed\n`);

// Write report
const report = {
  timestamp: new Date().toISOString(),
  phase: 0,
  liveMode: LIVE,
  passed,
  total,
  allPass,
  results,
};

const reportDir = path.join(ROOT, "reports");
await mkdir(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "read-phase0-readiness.latest.json");
await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(`Report: ${path.relative(ROOT, reportPath)}`);

process.exit(allPass ? 0 : 1);
