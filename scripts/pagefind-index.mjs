#!/usr/bin/env node
// Build Pagefind static search index for content-heavy subdomains.
// Runs after main build. Indexes only domains that have meaningful long-form
// content (hub + docs + read + edu). Each subdomain owns its index at
// /_pagefind/ relative to its own root.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SEARCHABLE_DOMAINS = [
  "vetuonglai.com",
  "docs.vetuonglai.com",
  "read.vetuonglai.com",
  "edu.vetuonglai.com",
];

async function indexDomain(domain) {
  const sitePath = path.join(ROOT, "dist", domain);
  try {
    await access(sitePath);
  } catch {
    console.log(`[pagefind] skip ${domain} (no dist)`);
    return;
  }
  console.log(`[pagefind] indexing ${domain}`);
  try {
    const { stdout, stderr } = await exec("npx", [
      "pagefind",
      "--site", sitePath,
      "--output-subdir", "_pagefind",
    ], {
      cwd: ROOT,
      maxBuffer: 8 * 1024 * 1024,
    });
    const last = (stdout || stderr || "").trim().split("\n").slice(-3).join("\n");
    console.log(`[pagefind] ${domain} → ${last.replace(/\n/g, " | ")}`);
  } catch (error) {
    console.warn(`[pagefind] ${domain} FAILED: ${error?.message || error}`);
  }
}

async function main() {
  console.log(`[pagefind] starting index for ${SEARCHABLE_DOMAINS.length} domains`);
  for (const d of SEARCHABLE_DOMAINS) {
    await indexDomain(d);
  }
  console.log("[pagefind] done");
}

main().catch((err) => {
  console.error("[pagefind] FATAL:", err);
  process.exit(1);
});
