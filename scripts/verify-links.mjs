/**
 * Team 5 — Internal Link Checker
 * Scans all HTML files in dist/ for broken internal links (href/src).
 * Usage: node scripts/verify-links.mjs
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

let totalFiles = 0;
let totalLinks = 0;
let brokenLinks = [];
let passed = 0;

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

function extractInternalLinks(html) {
  const links = [];
  // Match href="..." and src="..." for internal paths
  const regex = /(?:href|src)="(\/[^"]*?)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    // Skip anchors-only, javascript:, mailto:, tel:, data:, external
    if (href.startsWith("//") || href.startsWith("/#")) continue;
    // Skip JS template expressions that leak into href regex
    if (href.includes("'") || href.includes("+") || href.includes("encodeURI") || href.includes("${")) continue;
    links.push(href);
  }
  return links;
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveLink(domainDir, href) {
  // Strip query string and hash
  const clean = href.split("?")[0].split("#")[0];
  if (!clean || clean === "/") {
    // Root → index.html
    return fileExists(path.join(domainDir, "index.html"));
  }

  const target = path.join(domainDir, clean);

  // Direct file match
  if (await fileExists(target)) {
    const s = await stat(target);
    if (s.isFile()) return true;
    // If directory, check for index.html
    if (s.isDirectory()) {
      return fileExists(path.join(target, "index.html"));
    }
  }

  // Try with trailing index.html
  if (clean.endsWith("/")) {
    return fileExists(path.join(domainDir, clean, "index.html"));
  }

  return false;
}

async function main() {
  console.log("Team 5 — Internal Link Checker");
  console.log("================================\n");

  const domainDirs = await readdir(DIST, { withFileTypes: true });

  for (const domainEntry of domainDirs) {
    if (!domainEntry.isDirectory()) continue;
    const domainDir = path.join(DIST, domainEntry.name);
    const htmlFiles = await collectHtmlFiles(domainDir);

    for (const htmlFile of htmlFiles) {
      totalFiles++;
      const content = await readFile(htmlFile, "utf-8");
      const links = extractInternalLinks(content);
      const relPath = path.relative(DIST, htmlFile);

      for (const href of links) {
        totalLinks++;
        const exists = await resolveLink(domainDir, href);
        if (exists) {
          passed++;
        } else {
          brokenLinks.push({ file: relPath, href });
        }
      }
    }
  }

  console.log(`Scanned: ${totalFiles} HTML files`);
  console.log(`Checked: ${totalLinks} internal links`);
  console.log(`Passed:  ${passed}`);
  console.log(`Broken:  ${brokenLinks.length}`);

  if (brokenLinks.length > 0) {
    console.log("\n--- BROKEN LINKS ---");
    for (const { file, href } of brokenLinks) {
      console.log(`  ${file} → ${href}`);
    }
    console.log(`\n❌ FAIL — ${brokenLinks.length} broken internal links found.`);
    process.exit(1);
  } else {
    console.log("\n✅ PASS — All internal links resolve correctly.");
  }
}

main().catch((err) => {
  console.error("Link checker error:", err);
  process.exit(1);
});
