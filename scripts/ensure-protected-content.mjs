#!/usr/bin/env node
/**
 * scripts/ensure-protected-content.mjs
 *
 * Founder order 2026-05-05: protected/read-books/<slug>/content.json is gitignored.
 * On a fresh clone, the file does not exist, but the Worker static-imports it.
 *
 * This script ensures every book registered in protected/read-books/manifest.json
 * has a content.json on disk. If missing, it copies content.placeholder.json as
 * a safe baseline so build/import does not break.
 *
 * It NEVER overwrites an existing content.json (manuscript edits are sacred).
 *
 * Run as part of prebuild and prestart.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PROTECTED_ROOT = path.join(REPO_ROOT, "protected", "read-books");
const MANIFEST_PATH = path.join(PROTECTED_ROOT, "manifest.json");

function log(msg) {
  console.log(`[ensure-protected-content] ${msg}`);
}

function fail(msg) {
  console.error(`[ensure-protected-content] FAIL: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(MANIFEST_PATH)) {
  log(`manifest not found at ${MANIFEST_PATH} — skipping (protected lane not initialized).`);
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const books = Array.isArray(manifest.books) ? manifest.books : [];

let created = 0;
let preserved = 0;
const missingPlaceholders = [];

for (const entry of books) {
  const slug = String(entry?.slug || "").trim();
  if (!slug) continue;
  const dir = path.join(PROTECTED_ROOT, slug);
  const contentPath = path.join(dir, "content.json");
  const placeholderPath = path.join(dir, "content.placeholder.json");

  if (fs.existsSync(contentPath)) {
    preserved += 1;
    continue;
  }
  if (!fs.existsSync(placeholderPath)) {
    missingPlaceholders.push(slug);
    continue;
  }
  fs.copyFileSync(placeholderPath, contentPath);
  created += 1;
  log(`created ${path.relative(REPO_ROOT, contentPath)} from placeholder`);
}

if (missingPlaceholders.length > 0) {
  fail(`books in manifest missing both content.json and content.placeholder.json: ${missingPlaceholders.join(", ")}`);
}

log(`ok — preserved=${preserved} created_from_placeholder=${created} books=${books.length}`);
