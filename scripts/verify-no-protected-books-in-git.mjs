#!/usr/bin/env node
/**
 * scripts/verify-no-protected-books-in-git.mjs
 *
 * Founder order 2026-05-05: NEVER push books to GitHub.
 *
 * Hard verifier — fails the build/release if any of these are true:
 *   1. protected/read-books/<slug>/content.json is currently tracked by git
 *   2. .gitignore is missing the rule for content.json
 *   3. Any *.docx / *.pdf / *.epub / *.mobi exists under protected/ and is tracked
 *   4. The placeholder file has been modified to contain real manuscript signal
 *      (heuristic: > 4096 bytes per chapter body — placeholders are short)
 *
 * Run as part of release gate.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const GITIGNORE = path.join(REPO_ROOT, ".gitignore");
const PROTECTED_ROOT = path.join(REPO_ROOT, "protected", "read-books");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "no-protected-books-in-git.latest.json");

const failures = [];

function gitListFiles(pattern) {
  try {
    const out = execSync(`git ls-files -- ${pattern}`, { cwd: REPO_ROOT, encoding: "utf8" });
    return out.split("\n").map((s) => s.trim()).filter(Boolean);
  } catch (err) {
    return [];
  }
}

// Check 1: content.json tracked
const trackedContent = gitListFiles("'protected/read-books/*/content.json'");
if (trackedContent.length > 0) {
  failures.push({
    check: "content_json_tracked",
    detail: `These files are tracked in git but MUST be untracked: ${trackedContent.join(", ")}`,
  });
}

// Check 2: gitignore rule present
const gitignoreText = fs.existsSync(GITIGNORE) ? fs.readFileSync(GITIGNORE, "utf8") : "";
if (!gitignoreText.includes("protected/read-books/*/content.json")) {
  failures.push({
    check: "gitignore_rule_missing",
    detail: ".gitignore must contain the rule 'protected/read-books/*/content.json'",
  });
}

// Check 3: binary book artifacts tracked
const trackedBinaries = [
  ...gitListFiles("'protected/**/*.docx'"),
  ...gitListFiles("'protected/**/*.pdf'"),
  ...gitListFiles("'protected/**/*.epub'"),
  ...gitListFiles("'protected/**/*.mobi'"),
];
if (trackedBinaries.length > 0) {
  failures.push({
    check: "binary_book_artifact_tracked",
    detail: `These binary book files are tracked but MUST never be committed: ${trackedBinaries.join(", ")}`,
  });
}

// Check 4: placeholder mutation heuristic — only checks tracked placeholder files
const trackedPlaceholders = gitListFiles("'protected/read-books/*/content.placeholder.json'");
for (const rel of trackedPlaceholders) {
  const abs = path.join(REPO_ROOT, rel);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    failures.push({
      check: "placeholder_invalid_json",
      detail: `${rel} is not valid JSON: ${err.message}`,
    });
    continue;
  }
  const chapters = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
  for (const ch of chapters) {
    const viLen = String(ch?.body_vi || "").length;
    const enLen = String(ch?.body_en || "").length;
    if (viLen > 4096 || enLen > 4096) {
      failures.push({
        check: "placeholder_body_too_long",
        detail: `${rel} chapter ${ch?.n} body exceeds 4096 chars (vi=${viLen}, en=${enLen}). Real manuscript has likely been pasted into the tracked placeholder. Move it to content.json instead.`,
      });
    }
    const viBody = String(ch?.body_vi || "");
    if (viBody && !viBody.includes("[PROTECTED PLACEHOLDER]")) {
      failures.push({
        check: "placeholder_marker_missing",
        detail: `${rel} chapter ${ch?.n} body_vi missing '[PROTECTED PLACEHOLDER]' marker. Tracked placeholder must keep marker so it cannot accidentally pass as real manuscript.`,
      });
    }
  }
}

// Check 5: any tracked file under protected/ matching a high-risk pattern
const trackedAll = gitListFiles("'protected/'");
const allowed = new Set([
  "protected/read-books/manifest.json",
  "protected/read-books/README.md",
]);
const allowedPattern = /^protected\/read-books\/[^/]+\/content\.placeholder\.json$/;
for (const rel of trackedAll) {
  if (allowed.has(rel)) continue;
  if (allowedPattern.test(rel)) continue;
  failures.push({
    check: "unexpected_tracked_file_under_protected",
    detail: `Unexpected tracked file under protected/: ${rel}. Only manifest.json, README.md, and content.placeholder.json are allowed.`,
  });
}

const result = {
  ok: failures.length === 0,
  generated_at: new Date().toISOString(),
  failures,
  tracked_summary: {
    content_json_count: trackedContent.length,
    placeholder_count: trackedPlaceholders.length,
    binary_count: trackedBinaries.length,
    total_under_protected: trackedAll.length,
  },
  founder_order: "2026-05-05: NEVER push books to GitHub.",
};

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(result, null, 2));

if (failures.length > 0) {
  console.error("[no-protected-books-in-git] FAIL");
  for (const f of failures) {
    console.error(`  - ${f.check}: ${f.detail}`);
  }
  process.exit(1);
}
console.log(`[no-protected-books-in-git] ok — wrote ${path.relative(REPO_ROOT, REPORT_PATH)}`);
