import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RUNTIME_TRUTH_PATH = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");
const MEMBER_HOST = "member.vetuonglai.com";

function runStep(label, command, args) {
  console.log(`\n[${label}] ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status ?? "unknown"}).`);
  }
}

async function ensureMemberIsReachable() {
  const url = `https://${MEMBER_HOST}/api/index.json`;
  let response;
  try {
    response = await fetch(url, { method: "GET", redirect: "follow" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Member endpoint is not reachable: ${message}`);
  }

  if (!response.ok) {
    throw new Error(`Member endpoint returned HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Member endpoint returned unexpected content-type: ${contentType || "unknown"}.`);
  }
}

async function promoteRuntimeTruth() {
  const raw = await readFile(RUNTIME_TRUTH_PATH, "utf8");
  const truth = JSON.parse(raw);

  if (!Array.isArray(truth.domains)) {
    throw new Error("Invalid runtime truth: domains must be an array.");
  }

  const member = truth.domains.find((item) => String(item?.host || "").toLowerCase() === MEMBER_HOST);
  if (!member) {
    throw new Error(`Runtime truth does not contain ${MEMBER_HOST}.`);
  }

  member.status = "live";
  member.requiredPublic = true;
  member.updatedAt = new Date().toISOString().slice(0, 10);

  await writeFile(RUNTIME_TRUTH_PATH, `${JSON.stringify(truth, null, 2)}\n`, "utf8");
  console.log(`[promote] Updated ${RUNTIME_TRUTH_PATH} -> ${MEMBER_HOST} requiredPublic=true`);
}

async function main() {
  runStep("build", "npm", ["run", "build"]);
  runStep("check", "npm", ["run", "check"]);
  runStep("strict-member-deploy", "npm", ["run", "cloudflare:deploy:workers:strict", "--", "--worker", "member"]);
  runStep("smoke-endpoints", "npm", ["run", "cloudflare:smoke:endpoints"]);
  await ensureMemberIsReachable();
  await promoteRuntimeTruth();
  runStep("verify-runtime", "npm", ["run", "cloudflare:verify:runtime"]);
  console.log("\nPromotion complete: member.vetuonglai.com is now marked required-public in runtime truth.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
