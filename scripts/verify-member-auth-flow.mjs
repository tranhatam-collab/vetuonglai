/**
 * Team 5 — Member Auth Flow Audit
 * Validates auth-aware signup/onboarding rendering in dist output.
 * Usage: node scripts/verify-member-auth-flow.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "member.vetuonglai.com");

function assertIncludesAll(content, pageLabel, fragments) {
  for (const fragment of fragments) {
    if (!content.includes(fragment)) {
      throw new Error(`${pageLabel} missing required fragment: ${fragment}`);
    }
  }
}

function countOccurrences(content, fragment) {
  return String(content).split(fragment).length - 1;
}

async function main() {
  console.log("Team 5 — Member Auth Flow Audit");
  console.log("================================\n");

  const memberHome = await readFile(path.join(DIST, "index.html"), "utf8");
  const signup = await readFile(path.join(DIST, "signup", "index.html"), "utf8");
  const onboardingGoals = await readFile(path.join(DIST, "onboarding", "step-2-goals", "index.html"), "utf8");

  assertIncludesAll(memberHome, "member home", [
    'data-auth-gate="logged-out"',
    'data-auth-gate="logged-in"',
    "/api/access/session/current",
    "mock_member_state",
    "vtl.member.mock_state",
    "Đăng ký thành viên",
    "Open journey",
  ]);

  assertIncludesAll(signup, "member signup", [
    "/onboarding/step-2-goals/",
    "/api/access/session/current",
    "member-signup-signed-in",
    "member-signup-auth-note",
    "mock_member_state",
    "Không cam kết thu nhập",
    "No income guarantees",
  ]);

  assertIncludesAll(onboardingGoals, "member onboarding step-2", [
    "/api/access/session/current",
    "onboarding-auth-state",
    "onboarding-signup-cta",
    "onboarding-journey-cta",
    "data-onboarding-auth-required=\"true\"",
    "mock_member_state",
    "Quay lại bước bắt đầu",
  ]);

  const onboardingAuthGateCount = countOccurrences(onboardingGoals, 'data-onboarding-auth-required="true"');
  if (onboardingAuthGateCount < 3) {
    throw new Error(`member onboarding step-2 expected >=3 auth-required actions, found ${onboardingAuthGateCount}`);
  }

  const sessionEndpointRefs = [memberHome, signup, onboardingGoals]
    .map((html) => countOccurrences(html, "/api/access/session/current"))
    .reduce((acc, value) => acc + value, 0);
  if (sessionEndpointRefs < 3) {
    throw new Error(`expected session endpoint references across auth pages >= 3, found ${sessionEndpointRefs}`);
  }

  console.log("Checked pages: 3");
  console.log(`Auth-required actions on onboarding page: ${onboardingAuthGateCount}`);
  console.log(`Session endpoint references: ${sessionEndpointRefs}`);
  console.log("\n✅ PASS — Member auth-aware signup/onboarding flow is wired correctly.");
}

main().catch((error) => {
  console.error("\n❌ FAIL — Member auth flow audit failed.");
  console.error(error.message || error);
  process.exit(1);
});
