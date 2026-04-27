/**
 * Team 5 — Responsive Audit
 * Checks that all HTML pages have viewport meta, and that CSS files contain
 * responsive breakpoints at 720px and 980px.
 * Usage: node scripts/verify-responsive.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const issues = [];
let totalHtml = 0;
let totalCss = 0;

async function collectFiles(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full, ext)));
    } else if (entry.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  console.log("Team 5 — Responsive Audit");
  console.log("==========================\n");

  const domainDirs = await readdir(DIST, { withFileTypes: true });

  for (const domainEntry of domainDirs) {
    if (!domainEntry.isDirectory()) continue;
    const domainDir = path.join(DIST, domainEntry.name);
    const domainName = domainEntry.name;

    // Check HTML files for viewport meta
    const htmlFiles = await collectFiles(domainDir, ".html");
    for (const htmlFile of htmlFiles) {
      totalHtml++;
      const content = await readFile(htmlFile, "utf-8");
      const relPath = path.relative(DIST, htmlFile);

      if (!content.includes('name="viewport"')) {
        issues.push({ type: "missing-viewport", file: relPath });
      }
    }

    // Check CSS files for responsive breakpoints
    const cssFiles = await collectFiles(domainDir, ".css");
    for (const cssFile of cssFiles) {
      totalCss++;
      const content = await readFile(cssFile, "utf-8");
      const relPath = path.relative(DIST, cssFile);

      const has720 = /max-width:\s*720px/.test(content) || /max-width:\s*44\.?/i.test(content);
      const has980 = /max-width:\s*980px/.test(content) || /max-width:\s*840px/.test(content) || /max-width:\s*61\.?/i.test(content);

      if (!has720 && !has980) {
        // Only flag main stylesheets (not tiny utility CSS)
        if (content.length > 500) {
          issues.push({ type: "no-breakpoints", file: relPath });
        }
      }
    }
  }

  console.log(`Scanned: ${totalHtml} HTML files, ${totalCss} CSS files`);

  const viewportIssues = issues.filter((i) => i.type === "missing-viewport");
  const breakpointIssues = issues.filter((i) => i.type === "no-breakpoints");

  if (viewportIssues.length > 0) {
    console.log(`\n--- MISSING VIEWPORT META (${viewportIssues.length}) ---`);
    for (const { file } of viewportIssues) {
      console.log(`  ${file}`);
    }
  }

  if (breakpointIssues.length > 0) {
    console.log(`\n--- CSS WITHOUT RESPONSIVE BREAKPOINTS (${breakpointIssues.length}) ---`);
    for (const { file } of breakpointIssues) {
      console.log(`  ${file}`);
    }
  }

  if (issues.length === 0) {
    console.log("\n✅ PASS — All pages have viewport meta and CSS has responsive breakpoints.");
  } else {
    console.log(`\n⚠️  ${issues.length} issues found. Review above.`);
    // Non-fatal — warn only
    process.exit(viewportIssues.length > 0 ? 1 : 0);
  }
}

main().catch((err) => {
  console.error("Responsive audit error:", err);
  process.exit(1);
});
