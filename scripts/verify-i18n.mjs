/**
 * Team 5 — i18n Coverage Checker
 * Verifies that elements with data-text-vi also have data-text-en (and vice versa),
 * and that bilingual patterns are consistent across all HTML pages.
 * Usage: node scripts/verify-i18n.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const issues = [];
let totalFiles = 0;
let totalPairs = 0;

// Bilingual attribute pairs to check
const ATTR_PAIRS = [
  ["data-text-vi", "data-text-en"],
  ["data-html-vi", "data-html-en"],
  ["data-content-vi", "data-content-en"],
  ["data-title-vi", "data-title-en"],
  ["data-aria-label-vi", "data-aria-label-en"],
  ["data-placeholder-vi", "data-placeholder-en"],
];

// Kids-specific pairs
const KIDS_ATTR_PAIRS = [
  ["data-vi", "data-en"],
  ["data-vi-html", "data-en-html"],
  ["data-vi-placeholder", "data-en-placeholder"],
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

function checkAttrPairs(content, relPath, pairs) {
  let count = 0;
  for (const [attrVi, attrEn] of pairs) {
    // Find elements with vi but missing en
    const viRegex = new RegExp(`${attrVi}="[^"]*"`, "g");
    const viMatches = content.match(viRegex) || [];

    const enRegex = new RegExp(`${attrEn}="[^"]*"`, "g");
    const enMatches = content.match(enRegex) || [];

    count += viMatches.length;

    // Simple count mismatch check
    if (viMatches.length !== enMatches.length) {
      issues.push({
        type: "pair-mismatch",
        file: relPath,
        detail: `${attrVi}: ${viMatches.length} vs ${attrEn}: ${enMatches.length}`,
      });
    }
  }
  return count;
}

function checkLanguageSwitcher(content, relPath, isKids) {
  if (isKids) {
    if (!content.includes("kids-lang")) {
      issues.push({ type: "missing-lang-switch", file: relPath, detail: "No kids-lang switcher found" });
    }
  } else {
    // Build pipeline pages should have lang-switch or data-language-option
    if (content.includes("data-language-option") || content.includes("lang-switch")) {
      // OK
    } else if (content.includes("<html")) {
      // Only flag main pages, not API or utility pages
      const isMainPage = content.includes("<main") || content.includes('id="main"');
      if (isMainPage) {
        issues.push({ type: "missing-lang-switch", file: relPath, detail: "No language switcher found" });
      }
    }
  }
}

async function main() {
  console.log("Team 5 — i18n Coverage Checker");
  console.log("================================\n");

  const domainDirs = await readdir(DIST, { withFileTypes: true });

  for (const domainEntry of domainDirs) {
    if (!domainEntry.isDirectory()) continue;
    const domainDir = path.join(DIST, domainEntry.name);
    const domainName = domainEntry.name;
    const isKids = domainName.startsWith("kids.");
    const isRead = domainName.startsWith("read.");
    const htmlFiles = await collectHtmlFiles(domainDir);

    for (const htmlFile of htmlFiles) {
      totalFiles++;
      const content = await readFile(htmlFile, "utf-8");
      const relPath = path.relative(DIST, htmlFile);

      // Check bilingual attribute pairs
      const pairs = isKids ? KIDS_ATTR_PAIRS : ATTR_PAIRS;
      totalPairs += checkAttrPairs(content, relPath, pairs);

      // Read uses its own data-vi/data-en pattern too
      if (isRead) {
        totalPairs += checkAttrPairs(content, relPath, [["data-vi", "data-en"]]);
      }

      // Check language switcher presence
      checkLanguageSwitcher(content, relPath, isKids);
    }
  }

  const pairMismatches = issues.filter((i) => i.type === "pair-mismatch");
  const missingSwitch = issues.filter((i) => i.type === "missing-lang-switch");

  console.log(`Scanned: ${totalFiles} HTML files`);
  console.log(`Bilingual attribute pairs checked: ${totalPairs}`);

  if (pairMismatches.length > 0) {
    console.log(`\n--- BILINGUAL PAIR MISMATCHES (${pairMismatches.length}) ---`);
    for (const { file, detail } of pairMismatches) {
      console.log(`  ${file}: ${detail}`);
    }
  }

  if (missingSwitch.length > 0) {
    console.log(`\n--- MISSING LANGUAGE SWITCHER (${missingSwitch.length}) ---`);
    for (const { file, detail } of missingSwitch) {
      console.log(`  ${file}: ${detail}`);
    }
  }

  if (issues.length === 0) {
    console.log("\n✅ PASS — All bilingual pairs are balanced and language switchers are present.");
  } else {
    console.log(`\n⚠️  ${issues.length} i18n issues found.`);
    // Pair mismatches are critical, missing switcher is warning
    process.exit(pairMismatches.length > 0 ? 1 : 0);
  }
}

main().catch((err) => {
  console.error("i18n checker error:", err);
  process.exit(1);
});
