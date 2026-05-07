/**
 * Team 3 — Referral Disclosure Placement Audit (outside docs)
 * Ensures every non-doc referral touchpoint carries disclosure blocks.
 * Usage: node scripts/verify-referral-disclosure-placement.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const REFERRAL_PATTERN = /(affiliate|referral|hoa\s*h[oò]ng|gi[ơo]i\s*thi[ẹe]u)/i;
const INCOME_PATTERN = /(thu\s*nh[ậa]p|income|earnings)/i;

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
    } else if (entry.name === "index.html") {
      files.push(fullPath);
    }
  }
  return files;
}

function isDocsPath(relPath) {
  return relPath.startsWith("docs.vetuonglai.com/");
}

async function main() {
  console.log("Team 3 — Referral Disclosure Placement Audit");
  console.log("============================================\n");

  const htmlFiles = await collectHtmlFiles(DIST);
  const findings = [];
  let referralTouchpoints = 0;

  for (const filePath of htmlFiles) {
    const relPath = path.relative(DIST, filePath).replaceAll(path.sep, "/");
    if (isDocsPath(relPath)) continue;

    const content = await readFile(filePath, "utf8");
    if (!REFERRAL_PATTERN.test(content)) continue;

    referralTouchpoints += 1;

    const hasDisclosure = content.includes('data-disclosure-kind="public-note"') || content.includes("referral-disclosure");
    if (!hasDisclosure) {
      findings.push(`${relPath} missing disclosure block near referral touchpoint`);
    }

    if (INCOME_PATTERN.test(content)) {
      const hasPolicyMarker = content.includes('data-income-reference-policy="login_plus_accepted_disclaimer_only"')
        && content.includes('data-income-disclaimer-event="income_disclaimer_accepted"');
      const hasPublicDisclaimer = content.includes('data-compliance="income-disclaimer"')
        || content.includes('data-compliance="income-disclaimer-short"')
        || content.includes('data-compliance="earning-gate"');
      const hasNoGuaranteeLanguage = /(không\s+cam\s+kết|no income guarantees|not guarantees|not guarantee)/i.test(content);
      if (!hasPolicyMarker && !(hasPublicDisclaimer && hasNoGuaranteeLanguage)) {
        findings.push(`${relPath} has income reference near referral scope but missing income policy/disclaimer safety marker`);
      }
    }
  }

  console.log(`Referral touchpoints outside docs: ${referralTouchpoints}`);
  console.log(`Findings: ${findings.length}`);

  if (findings.length > 0) {
    console.log("\n--- FINDINGS ---");
    for (const finding of findings) {
      console.log(`  - ${finding}`);
    }
    console.log("\nFAIL — Referral disclosure placement audit failed.");
    process.exit(1);
  }

  console.log("\nPASS — Disclosure placement is valid for non-doc referral touchpoints.");
}

main().catch((error) => {
  console.error("Referral disclosure audit error:", error);
  process.exit(1);
});
