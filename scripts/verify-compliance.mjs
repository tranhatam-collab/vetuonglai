/**
 * Team 5 — Public Compliance Term Audit
 * Scans dist HTML output for forbidden public terms from product strategy registry.
 * Usage: node scripts/verify-compliance.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REGISTRY = path.join(ROOT, "src", "data", "product-strategy-registry.json");

const EXCLUDED_PATH_PARTS = ["/legal/"];

const NEGATION_MARKERS = [
  "khong",
  "không",
  "khong phai",
  "không phải",
  "khong day",
  "không dạy",
  "khong dung",
  "không dùng",
  "no",
  "not",
  "does not",
  "do not",
  "without",
  "never",
];

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isNegatedContext(lineNormalized, startIndex) {
  const contextStart = Math.max(0, startIndex - 256);
  const context = lineNormalized.slice(contextStart, startIndex);
  return NEGATION_MARKERS.some((marker) => context.includes(marker));
}

function isAllowedPhraseContext(lineNormalized, term) {
  if (term === "invest now" && lineNormalized.includes("invest now clearly")) {
    return true;
  }
  return false;
}

async function main() {
  console.log("Team 5 — Public Compliance Term Audit");
  console.log("======================================\n");

  const registryRaw = await readFile(REGISTRY, "utf-8");
  const registry = JSON.parse(registryRaw);
  const forbidden = (registry.publicCompliance?.forbiddenPublicTerms || []).map((term) => term.toLowerCase());

  const allowPhrases = [
    registry.publicCompliance?.mandatoryStatements?.antiMlmVi,
    registry.publicCompliance?.mandatoryStatements?.antiMlmEn,
  ]
    .filter(Boolean)
    .map((v) => v.toLowerCase());

  const htmlFiles = await collectHtmlFiles(DIST);
  let scanned = 0;
  const hits = [];

  for (const htmlFile of htmlFiles) {
    const relPath = path.relative(DIST, htmlFile).replaceAll(path.sep, "/");
    if (EXCLUDED_PATH_PARTS.some((part) => relPath.includes(part))) continue;

    scanned++;
    const content = await readFile(htmlFile, "utf-8");
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      const lineLower = originalLine.toLowerCase();
      let line = lineLower;

      for (const allowPhrase of allowPhrases) {
        line = line.replaceAll(allowPhrase, " ");
      }

      for (const term of forbidden) {
        let termRegex;
        if (term === "roi") {
          termRegex = /(^|[^A-Za-z0-9])ROI([^A-Za-z0-9]|$)/;
        } else {
          termRegex = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`, "i");
        }

        const match = line.match(termRegex);
        if (!match || typeof match.index !== "number") continue;
        if (isNegatedContext(line, match.index)) continue;
        if (isAllowedPhraseContext(line, term)) continue;

        hits.push({
          file: relPath,
          line: i + 1,
          term,
          excerpt: originalLine.trim().slice(0, 220),
        });
      }
    }
  }

  console.log(`Scanned: ${scanned} HTML files`);
  console.log(`Forbidden terms: ${forbidden.length}`);
  console.log(`Findings: ${hits.length}`);

  if (hits.length > 0) {
    console.log("\n--- FORBIDDEN TERM HITS ---");
    for (const hit of hits) {
      console.log(`  ${hit.file}:${hit.line} [${hit.term}] ${hit.excerpt}`);
    }
    console.log("\n❌ FAIL — Forbidden public terms detected in rendered HTML.");
    process.exit(1);
  }

  console.log("\n✅ PASS — No forbidden public terms found in rendered HTML.");
}

main().catch((err) => {
  console.error("Compliance audit error:", err);
  process.exit(1);
});
