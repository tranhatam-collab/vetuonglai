#!/usr/bin/env node
/**
 * scripts/verify-homepage-block-sequence.mjs
 *
 * Founder Lock VTL_75 §1.3 + Public Copy Plan §1.1 + §1.2: V1 homepage
 * at vetuonglai.com/ (and /en/) must contain exactly the 10 required
 * blocks in order, and must NOT contain any forbidden block.
 *
 * The verifier expects each block to be marked in HTML with a stable
 * data attribute: data-vtl-block="<id>". This is an explicit contract
 * with the homepage renderer — adding/removing/reordering a block
 * requires a Founder memo update + this verifier list update.
 *
 * Required blocks (in order):
 *   1.  header-nav
 *   2.  hero
 *   3.  three-path-purchase
 *   4.  three-step-explainer
 *   5.  five-commitments
 *   6.  read-featured
 *   7.  edu-featured
 *   8.  trust-block
 *   9.  faq-six
 *   10. footer
 *
 * Forbidden blocks:
 *   - family-passport-cta (V1)
 *   - partner-passport-cta (V1)
 *   - contributor-signup-cta (V1)
 *   - invest-cta (any phase)
 *   - invest-waitlist (any phase)
 *   - countdown
 *   - lifestyle-imagery (placeholder if a future component is tagged)
 *
 * Output: reports/homepage-block-sequence.latest.json
 *
 * Exit 0 on pass, 1 on fail. If the homepage has not yet been built to
 * include data-vtl-block attributes, the verifier reports "not_yet_implemented"
 * with ok=false but exits 0 (advisory only) until the homepage adopts
 * the contract. Switch the ADVISORY_ONLY_UNTIL_CONTRACT flag to false
 * once the homepage emits data-vtl-block.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "homepage-block-sequence.latest.json");

const ADVISORY_ONLY_UNTIL_CONTRACT = true;

const REQUIRED_BLOCKS_IN_ORDER = [
  "header-nav",
  "hero",
  "three-path-purchase",
  "three-step-explainer",
  "five-commitments",
  "read-featured",
  "edu-featured",
  "trust-block",
  "faq-six",
  "footer",
];

const FORBIDDEN_V1_BLOCKS = [
  "family-passport-cta",
  "partner-passport-cta",
  "contributor-signup-cta",
  "invest-cta",
  "invest-waitlist",
  "countdown",
];

const HOMEPAGE_TARGETS = [
  "dist/vetuonglai.com/index.html",
  "dist/vetuonglai.com/en/index.html",
];

function extractBlocks(html) {
  const re = /data-vtl-block=["']([a-z0-9\-]+)["']/gi;
  const found = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    found.push(m[1].toLowerCase());
  }
  return found;
}

function checkPage(absPath) {
  const result = {
    file: path.relative(REPO_ROOT, absPath),
    exists: fs.existsSync(absPath),
    ok: false,
    blocks_found: [],
    missing_required: [],
    forbidden_present: [],
    out_of_order: false,
  };
  if (!result.exists) {
    result.error = "homepage file not found";
    return result;
  }
  const html = fs.readFileSync(absPath, "utf8");
  const blocks = extractBlocks(html);
  result.blocks_found = blocks;

  if (blocks.length === 0) {
    result.error = "no data-vtl-block attributes found — homepage has not adopted the block contract yet";
    result.contract_not_implemented = true;
    return result;
  }

  // Required-in-order check
  const requiredFiltered = blocks.filter((b) => REQUIRED_BLOCKS_IN_ORDER.includes(b));
  for (const req of REQUIRED_BLOCKS_IN_ORDER) {
    if (!blocks.includes(req)) result.missing_required.push(req);
  }
  // Order check on those that are present
  let lastIdx = -1;
  for (const b of requiredFiltered) {
    const idx = REQUIRED_BLOCKS_IN_ORDER.indexOf(b);
    if (idx < lastIdx) {
      result.out_of_order = true;
      break;
    }
    lastIdx = idx;
  }
  for (const fb of FORBIDDEN_V1_BLOCKS) {
    if (blocks.includes(fb)) result.forbidden_present.push(fb);
  }
  result.ok =
    result.missing_required.length === 0 &&
    !result.out_of_order &&
    result.forbidden_present.length === 0;
  return result;
}

function main() {
  const results = HOMEPAGE_TARGETS.map((rel) => checkPage(path.join(REPO_ROOT, rel)));
  const allOk = results.every((r) => r.ok);
  const allContractMissing = results.every((r) => r.contract_not_implemented);
  const report = {
    ok: allOk,
    contract_not_implemented: allContractMissing,
    advisory_only: ADVISORY_ONLY_UNTIL_CONTRACT && allContractMissing,
    results,
    timestamp: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (allContractMissing && ADVISORY_ONLY_UNTIL_CONTRACT) {
    console.warn("verify-homepage-block-sequence: ADVISORY — homepage has not yet adopted data-vtl-block contract; not failing build.");
    process.exit(0);
  }
  if (!allOk) {
    console.error("verify-homepage-block-sequence: FAIL");
    for (const r of results) {
      if (!r.ok) {
        console.error(`  ${r.file}: missing=${JSON.stringify(r.missing_required)} forbidden=${JSON.stringify(r.forbidden_present)} out_of_order=${r.out_of_order}`);
      }
    }
    process.exit(1);
  }
  console.log("verify-homepage-block-sequence: PASS");
  process.exit(0);
}

main();
