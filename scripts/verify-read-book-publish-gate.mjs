/**
 * verify-read-book-publish-gate.mjs
 *
 * Per-book publish gate for read.vetuonglai.com — enforces VTL_71 layered
 * publish model (10/20/70). Catches protected-text leaks before public release.
 *
 * Checks (per book in src/data/read-books.json):
 *   1. schema_completeness: every book has slug, title, access_rules, routes,
 *      protected_paid, public_sample, member_preview keys
 *   2. public_page_present: dist/read.vetuonglai.com/<route.public>/index.html
 *   3. demo_page_present: dist/read.vetuonglai.com/<route.demo>/index.html
 *   4. demo_noindex: demo page has noindex,nofollow meta
 *   5. demo_gating_markers: demo page has data-requires-auth or data-gated attrs
 *   6. no_protected_uri_leak: no `internal://read/protected/` strings in any
 *      dist HTML file
 *   7. no_full_chapter_leak: protected_paid full_chapters body slugs do not
 *      appear as full chapter prose in public/demo HTML
 *   8. no_downloadable_files: no .pdf/.epub/.docx/.mobi files anywhere in
 *      dist/read.vetuonglai.com
 *   9. no_price_in_public: 10% public layer must NOT show price (regex on
 *      common VND/USD markers in the public page only)
 *  10. layered_banner_present: public page contains layered model banner copy
 *  11. dual_publish_license_present: every book declares external_origin or
 *      dual_publish_license
 *
 * Usage:  node scripts/verify-read-book-publish-gate.mjs
 * Exit code: 0 if all books pass, 1 otherwise.
 */

import { readFile, stat, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const READ_DIST = path.join(ROOT, "dist/read.vetuonglai.com");
const REGISTRY_PATH = path.join(ROOT, "src/data/read-books.json");
const DIST_ROOT = path.join(ROOT, "dist");
const PROTECTED_ROOT = path.join(ROOT, "protected/read-books");
const PROTECTED_MANIFEST = path.join(PROTECTED_ROOT, "manifest.json");

const REQUIRED_BOOK_KEYS = [
  "slug",
  "title",
  "access_rules",
  "routes",
  "protected_paid",
  "public_sample",
  "member_preview",
];

const REQUIRED_ACCESS_LAYERS = ["public", "registered_member", "paid_reader"];
const REQUIRED_ROUTE_KEYS = ["public", "demo"];
const PROTECTED_URI_PREFIX = "internal://read/protected/";
const DOWNLOAD_EXTENSIONS = [".pdf", ".epub", ".docx", ".mobi", ".azw3"];
const PRICE_PATTERNS = [
  /\b\d{2,3}\.\d{3}\s*(₫|VND|đ)\b/i,
  /\b(?:USD|US\$|\$)\s*\d{1,3}(?:[.,]\d{1,2})?\b/,
  /giá\s*:\s*\d/i,
  /price\s*:\s*\d/i,
];
const LAYERED_BANNER_MARKERS_VI = [
  "10%",
  "20%",
  "70%",
];

const results = [];

function record(book, key, pass, detail, status) {
  const finalStatus = status || (pass ? "passed" : "failed");
  const entry = { book, key, pass, detail, status: finalStatus };
  results.push(entry);
  const icon = finalStatus === "skipped" ? "⊘" : (pass ? "✓" : "✗");
  const scope = book ? `[${book}] ` : "";
  console.log(`  ${icon} ${scope}${key}: ${detail}`);
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p) {
  return JSON.parse(await readFile(p, "utf8"));
}

async function collectAll(dir, predicate = () => true) {
  const out = [];
  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (predicate(full, e)) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function trimRoute(route) {
  return String(route || "").replace(/^\/+/, "").replace(/\/+$/, "");
}

function distHtmlPath(route) {
  const trimmed = trimRoute(route);
  return path.join(READ_DIST, trimmed, "index.html");
}

async function checkBook(book) {
  const slug = String(book.slug || "");

  // 1. schema completeness
  const missingKeys = REQUIRED_BOOK_KEYS.filter((k) => !book[k]);
  const titleObj = book.title && typeof book.title === "object" ? book.title : null;
  const titleHasVi = titleObj && typeof titleObj.vi === "string" && titleObj.vi.length > 0;
  const titleHasEn = titleObj && typeof titleObj.en === "string" && titleObj.en.length > 0;
  if (titleObj && !(titleHasVi && titleHasEn)) {
    missingKeys.push("title.vi+title.en");
  }
  record(slug, "schema_completeness", missingKeys.length === 0,
    missingKeys.length === 0 ? "all required keys present (incl. bilingual title)" : `missing: ${missingKeys.join(", ")}`);
  if (missingKeys.length > 0) return; // skip dependent checks

  const accessRules = book.access_rules || {};
  const missingLayers = REQUIRED_ACCESS_LAYERS.filter((l) => !accessRules[l]);
  record(slug, "access_rules_layers", missingLayers.length === 0,
    missingLayers.length === 0
      ? `all 3 layers (public, registered_member, paid_reader) declared`
      : `missing: ${missingLayers.join(", ")}`);

  const routes = book.routes || {};
  const missingRoutes = REQUIRED_ROUTE_KEYS.filter((k) => !routes[k]);
  record(slug, "routes_keys", missingRoutes.length === 0,
    missingRoutes.length === 0 ? "public + demo routes declared" : `missing: ${missingRoutes.join(", ")}`);
  if (missingRoutes.length > 0) return;

  // 2. public page present
  const publicPath = distHtmlPath(routes.public);
  const publicExists = await fileExists(publicPath);
  record(slug, "public_page_present", publicExists,
    publicExists ? `${path.relative(READ_DIST, publicPath)} exists` : `missing: ${path.relative(READ_DIST, publicPath)}`);

  // 3. demo page present
  const demoPath = distHtmlPath(routes.demo);
  const demoExists = await fileExists(demoPath);
  record(slug, "demo_page_present", demoExists,
    demoExists ? `${path.relative(READ_DIST, demoPath)} exists` : `missing: ${path.relative(READ_DIST, demoPath)}`);

  if (!publicExists || !demoExists) return;

  const publicHtml = await readFile(publicPath, "utf8");
  const demoHtml = await readFile(demoPath, "utf8");

  // 4. demo_noindex
  const demoHasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*nofollow[^"']*["']/i.test(demoHtml)
    || /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*nofollow[^"']*noindex[^"']*["']/i.test(demoHtml);
  record(slug, "demo_noindex", demoHasNoindex,
    demoHasNoindex ? "noindex,nofollow meta present" : "demo page must have <meta name=\"robots\" content=\"noindex,nofollow\">");

  // 5. demo_gating_markers
  const hasGatingMarker = /data-requires-auth=|data-gated=/i.test(demoHtml);
  record(slug, "demo_gating_markers", hasGatingMarker,
    hasGatingMarker ? "data-requires-auth or data-gated marker present" : "demo page must mark gated section with data-requires-auth or data-gated");

  // 9. no_price_in_public
  const publicText = publicHtml.replace(/<[^>]+>/g, " ");
  const priceHits = PRICE_PATTERNS
    .map((re) => publicText.match(re))
    .filter(Boolean)
    .map((m) => m[0]);
  record(slug, "no_price_in_public", priceHits.length === 0,
    priceHits.length === 0 ? "no price markers in public page" : `found: ${priceHits.slice(0, 3).join(", ")}`);

  // 10. layered banner present in public
  const bannerHits = LAYERED_BANNER_MARKERS_VI.filter((m) => publicHtml.includes(m));
  record(slug, "layered_banner_present", bannerHits.length === LAYERED_BANNER_MARKERS_VI.length,
    bannerHits.length === LAYERED_BANNER_MARKERS_VI.length
      ? `10/20/70 banner markers present`
      : `missing markers: ${LAYERED_BANNER_MARKERS_VI.filter((m) => !bannerHits.includes(m)).join(", ")}`);

  // 11. dual publish license
  const hasLicense = book.dual_publish_license || book.external_origin;
  record(slug, "dual_publish_license_present", Boolean(hasLicense),
    hasLicense ? "dual_publish_license or external_origin declared" : "must declare dual_publish_license or external_origin");
}

async function checkGlobalLeaks(books) {
  if (!(await fileExists(READ_DIST))) {
    record("", "global_dist_present", false, "dist/read.vetuonglai.com missing — run npm run build");
    return;
  }

  const htmlFiles = await collectAll(READ_DIST, (f) => f.endsWith(".html"));

  // 6. no_protected_uri_leak
  const uriLeaks = [];
  for (const f of htmlFiles) {
    const html = await readFile(f, "utf8");
    if (html.includes(PROTECTED_URI_PREFIX)) {
      uriLeaks.push(path.relative(READ_DIST, f));
    }
  }
  record("", "no_protected_uri_leak", uriLeaks.length === 0,
    uriLeaks.length === 0
      ? `0 files leak "${PROTECTED_URI_PREFIX}"`
      : `leak in ${uriLeaks.length} file(s): ${uriLeaks.slice(0, 5).join("; ")}`);

  // 7. no_full_chapter_leak — heuristic: chapter slugs from TOC must not appear
  //    as full HTML headings (h2/h3) on public/demo pages beyond what is
  //    declared in member_preview.chapter_1_slice or public_sample.
  //    (We restrict scope to public + demo pages of each book, not the whole dist.)
  const chapterLeaks = [];
  for (const book of books) {
    const slug = book.slug;
    const toc = Array.isArray(book.toc?.chapters) ? book.toc.chapters : [];
    if (!toc.length) continue;
    const publicPath = distHtmlPath(book.routes?.public);
    const demoPath = distHtmlPath(book.routes?.demo);
    for (const target of [publicPath, demoPath]) {
      if (!(await fileExists(target))) continue;
      const html = await readFile(target, "utf8");
      // Count chapter title appearances in <h2>/<h3> tags (full chapter body
      // would render each chapter as its own heading). Our public page lists
      // chapter titles as a TOC, which is allowed; we look instead for
      // `chapter-body` or repeated `<article` tags as a leak signal.
      const articleTags = (html.match(/<article[^>]*data-chapter=/gi) || []).length;
      const chapterBodyDivs = (html.match(/class=["'][^"']*chapter-body[^"']*["']/gi) || []).length;
      if (articleTags > 0 || chapterBodyDivs > 0) {
        chapterLeaks.push(`${slug}:${path.relative(READ_DIST, target)} (article=${articleTags}, body=${chapterBodyDivs})`);
      }
    }
  }
  record("", "no_full_chapter_leak", chapterLeaks.length === 0,
    chapterLeaks.length === 0
      ? "no full-chapter article/body markers in public or demo pages"
      : `chapter-body leak: ${chapterLeaks.join("; ")}`);

  // 8. no_downloadable_files
  const allFiles = await collectAll(READ_DIST, (f) => DOWNLOAD_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)));
  record("", "no_downloadable_files", allFiles.length === 0,
    allFiles.length === 0
      ? `no ${DOWNLOAD_EXTENSIONS.join("/")} files in dist`
      : `found: ${allFiles.map((f) => path.relative(READ_DIST, f)).slice(0, 5).join("; ")}`);
}

async function resolveProtectedContentPath(slug) {
  // Founder order 2026-05-05: content.json is gitignored. Prefer content.json
  // when present; otherwise fall back to the tracked content.placeholder.json
  // baseline so the verifier still works on a fresh clone.
  const liveCandidate = path.join(PROTECTED_ROOT, slug, "content.json");
  if (await fileExists(liveCandidate)) {
    return { resolvedPath: liveCandidate, source: "content.json" };
  }
  const placeholderCandidate = path.join(PROTECTED_ROOT, slug, "content.placeholder.json");
  if (await fileExists(placeholderCandidate)) {
    return { resolvedPath: placeholderCandidate, source: "content.placeholder.json (fallback)" };
  }
  return { resolvedPath: null, source: null };
}

async function checkProtectedContentPerBook(books) {
  // 16. protected_content_per_book_present
  let manifest = null;
  if (await fileExists(PROTECTED_MANIFEST)) {
    try {
      manifest = await readJson(PROTECTED_MANIFEST);
    } catch {
      manifest = null;
    }
  }
  const manifestSlugs = new Set(
    Array.isArray(manifest?.books) ? manifest.books.map((b) => String(b.slug || "").toLowerCase()) : []
  );

  const requiredChapterFields = ["n", "slug", "title_vi", "title_en", "body_vi", "body_en"];

  for (const book of books) {
    const slug = String(book.slug || "");
    if (!book.routes?.public) continue;
    const failures = [];
    const { resolvedPath, source } = await resolveProtectedContentPath(slug);
    if (!resolvedPath) {
      record(slug, "protected_content_per_book_present", false,
        `missing both protected/read-books/${slug}/content.json and content.placeholder.json`);
      continue;
    }
    let content;
    try {
      content = await readJson(resolvedPath);
    } catch (e) {
      record(slug, "protected_content_per_book_present", false,
        `invalid JSON in protected/read-books/${slug}/${path.basename(resolvedPath)}: ${e.message}`);
      continue;
    }

    if (!Array.isArray(content.chapters) || content.chapters.length < 1) {
      failures.push("chapters[] missing or empty");
    } else {
      content.chapters.forEach((ch, i) => {
        for (const f of requiredChapterFields) {
          const v = ch[f];
          if (f === "n") {
            if (typeof v !== "number") failures.push(`chapters[${i}].n not a number`);
          } else {
            if (typeof v !== "string" || v.length === 0) failures.push(`chapters[${i}].${f} missing/empty`);
          }
        }
      });
    }

    if (!Array.isArray(content.practice_map)) failures.push("practice_map[] missing (must be array)");
    for (const f of ["experience_plan", "ai_study_guide", "final_distillation", "final_white_page"]) {
      if (content[f] === undefined || content[f] === null) failures.push(`${f} missing`);
    }

    if (content.license !== "owner_only_dual_publish") {
      failures.push(`license must be "owner_only_dual_publish" (got: ${JSON.stringify(content.license)})`);
    }

    if (!manifestSlugs.has(slug.toLowerCase())) {
      failures.push(`slug "${slug}" not in protected/read-books/manifest.json books[].slug (case-insensitive)`);
    }

    const chapterCount = Array.isArray(content.chapters) ? content.chapters.length : 0;
    record(slug, "protected_content_per_book_present", failures.length === 0,
      failures.length === 0
        ? `protected content valid (${chapterCount} chapters, source=${source})`
        : `[source=${source}] failures: ${failures.slice(0, 6).join("; ")}`);
  }
}

async function checkProtectedNoLeakInDist(books) {
  // 17. protected_no_leak_in_dist
  if (!(await fileExists(READ_DIST))) {
    record("", "protected_no_leak_in_dist", true, "dist not built", "skipped");
    return;
  }

  const PLACEHOLDER_PREFIX = "[PROTECTED PLACEHOLDER] ";
  const stringsToCheck = [];
  function pushStr(slug, field, str) {
    if (typeof str !== "string") return;
    // Strip the placeholder prefix so we still detect leaks of the real text
    // that follows the marker. If the post-prefix substring is < 40 chars,
    // skip the snippet (it's too short to be a meaningful leak signal).
    let candidate = str;
    if (candidate.startsWith(PLACEHOLDER_PREFIX)) {
      candidate = candidate.slice(PLACEHOLDER_PREFIX.length);
    }
    if (candidate.length >= 40) {
      stringsToCheck.push({ slug, field, str: candidate });
    }
  }

  const sources = [];
  for (const book of books) {
    const slug = String(book.slug || "");
    if (!book.routes?.public) continue;
    const { resolvedPath, source } = await resolveProtectedContentPath(slug);
    if (!resolvedPath) continue;
    let content;
    try {
      content = await readJson(resolvedPath);
    } catch {
      continue;
    }
    sources.push(`${slug}=${source}`);
    const chapters = Array.isArray(content.chapters) ? content.chapters : [];
    chapters.forEach((ch, i) => {
      pushStr(slug, `chapters[${i}].body_vi`, ch.body_vi);
      pushStr(slug, `chapters[${i}].body_en`, ch.body_en);
      pushStr(slug, `chapters[${i}].closing_silence_vi`, ch.closing_silence_vi);
      pushStr(slug, `chapters[${i}].closing_silence_en`, ch.closing_silence_en);
    });
    for (const block of ["experience_plan", "ai_study_guide", "final_distillation", "final_white_page"]) {
      const obj = content[block];
      if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === "string") pushStr(slug, `${block}.${k}`, v);
        }
      }
    }
  }

  const htmlFiles = await collectAll(READ_DIST, (f) => f.endsWith(".html"));
  const leaks = [];
  for (const f of htmlFiles) {
    const html = await readFile(f, "utf8");
    for (const item of stringsToCheck) {
      if (html.includes(item.str)) {
        leaks.push({
          file: path.relative(READ_DIST, f),
          slug: item.slug,
          field: item.field,
          excerpt: item.str.slice(0, 60),
        });
      }
    }
  }

  const sourcesNote = sources.length ? ` [sources: ${sources.join(", ")}]` : "";
  record("", "protected_no_leak_in_dist", leaks.length === 0,
    leaks.length === 0
      ? `0 protected strings leaked (checked ${stringsToCheck.length} string(s) across ${htmlFiles.length} html file(s))${sourcesNote}`
      : `${leaks.length} leak(s)${sourcesNote}: ${leaks.slice(0, 5).map((l) => `${l.file} <- ${l.slug}/${l.field} ("${l.excerpt}...")`).join("; ")}`);
}

async function checkProtectedDirAbsentInDist() {
  // 18. protected_dir_absent_in_dist
  if (!(await fileExists(DIST_ROOT))) {
    record("", "protected_dir_absent_in_dist", true, "dist not built", "skipped");
    return;
  }
  const all = await collectAll(DIST_ROOT, () => true);
  const offenders = [];
  for (const f of all) {
    const rel = path.relative(DIST_ROOT, f);
    const segments = rel.split(path.sep);
    if (segments.includes("protected")) {
      offenders.push(rel);
      continue;
    }
    if (rel.startsWith(`protected${path.sep}read-books`) || rel.startsWith("protected/read-books")) {
      offenders.push(rel);
    }
  }
  record("", "protected_dir_absent_in_dist", offenders.length === 0,
    offenders.length === 0
      ? "no `protected` segments under dist/"
      : `found ${offenders.length} offender(s): ${offenders.slice(0, 5).join("; ")}`);
}

async function main() {
  console.log("\n🔍 verify-read-book-publish-gate (VTL_71 10/20/70 enforcement)\n");

  if (!(await fileExists(REGISTRY_PATH))) {
    record("", "registry_present", false, `${path.relative(ROOT, REGISTRY_PATH)} not found`);
  } else {
    record("", "registry_present", true, `${path.relative(ROOT, REGISTRY_PATH)} loaded`);
  }

  const registry = await readJson(REGISTRY_PATH);
  const books = Array.isArray(registry.books) ? registry.books : [];
  record("", "books_array_present", books.length > 0,
    books.length > 0 ? `${books.length} book(s) declared` : "no books declared");

  for (const book of books) {
    await checkBook(book);
  }
  await checkGlobalLeaks(books);
  await checkProtectedContentPerBook(books);
  await checkProtectedNoLeakInDist(books);
  await checkProtectedDirAbsentInDist();

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass && r.status !== "skipped").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const total = results.length;
  const allPass = failed === 0;

  console.log(`\n${allPass ? "✅" : "❌"} ${passed}/${total} checks passed (failed=${failed}, skipped=${skipped})\n`);

  const report = {
    timestamp: new Date().toISOString(),
    gate: "read-book-publish-gate",
    model: "VTL_71_10_20_70",
    passed,
    failed,
    skipped,
    total,
    allPass,
    publish_ready: allPass,
    book_count: books.length,
    results,
  };

  const reportDir = path.join(ROOT, "reports");
  await mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "read-book-publish-gate.latest.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(`Report: ${path.relative(ROOT, reportPath)}`);

  process.exit(allPass ? 0 : 1);
}

main().catch((e) => {
  console.error("verify-read-book-publish-gate: fatal");
  console.error(e);
  process.exit(1);
});
