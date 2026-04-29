import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "team5-total-system-release-gate.latest.json");
const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_TOTAL_RELEASE_GATE_TIMEOUT_MS || 20 * 60 * 1000);

const gateSteps = [
  {
    key: "team5_full_pack",
    label: "Team 5 full smoke/strict pack",
    cmd: "npm",
    args: ["run", "verify:team5:pack"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "planned_safe_wave_release",
    label: "Wave D planned-safe release pack",
    cmd: "npm",
    args: ["run", "verify:planned-safe:wave:release"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "team3_referral_disclosure_audit",
    label: "Team 3 referral disclosure placement audit",
    cmd: "npm",
    args: ["run", "verify:team3:referral-disclosure"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "team3_parity",
    label: "Team 3 parity gate",
    cmd: "npm",
    args: ["run", "verify:team3:parity"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "wave_d_deploy_plan",
    label: "Wave D Pages deploy dry-run",
    cmd: "node",
    args: ["scripts/deploy-wave-d-pages.mjs", "--dry-run"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "session_contract_smoke",
    label: "Session runtime contract + onboarding goal smoke",
    cmd: "npm",
    args: ["run", "smoke:access-runtime"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "member_auth_flow",
    label: "Member auth-flow verification gate",
    cmd: "npm",
    args: ["run", "verify:member:auth-flow"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "wave_d_public_publish_self_test",
    label: "Wave D live publish verifier self-test",
    cmd: "node",
    args: ["scripts/verify-wave-d-public-publish.mjs", "--self-test"],
    requiredForBaseline: true,
    requiredForSystemSignoff: true,
  },
  {
    key: "wave_d_public_publish_live",
    label: "Wave D public publish live verify",
    cmd: "node",
    args: ["scripts/verify-wave-d-public-publish.mjs"],
    requiredForBaseline: false,
    requiredForSystemSignoff: true,
    expectedBlockerWhenFailed: "wave_d_dns_or_runtime_publish",
  },
];

function parseArgs(argv) {
  const options = {
    help: false,
    selfTest: false,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    skipHeavy: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--self-test") {
      options.selfTest = true;
      continue;
    }
    if (arg === "--skip-heavy") {
      options.skipHeavy = true;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[index + 1] || options.timeoutMs);
      index += 1;
    }
  }

  return options;
}

function usageText() {
  return [
    "node scripts/verify-total-system-release-gate.mjs",
    "",
    "Team 5 total-system release gate pack cho Wave E.",
    "",
    "Tuy chon:",
    "  --timeout-ms <ms>   Timeout moi command. Mac dinh: 1200000",
    "  --skip-heavy        Bo qua verify:team5:pack, dung khi vua chay full pack ben ngoai.",
    "  --self-test         Chay self-test decision logic.",
    "  --help              Hien huong dan.",
  ].join("\n");
}

function tail(text, lineCount = 10) {
  return String(text || "").trim().split("\n").slice(-lineCount).join("\n");
}

async function runCommandStep(step, timeoutMs) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();

  return await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref();
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        ok: false,
        code: null,
        signal: null,
        timedOut,
        durationMs: Date.now() - startedMs,
        startedAt,
        endedAt: new Date().toISOString(),
        note: error instanceof Error ? error.message : String(error),
        outputTail: "",
      });
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        ok: code === 0 && !timedOut,
        code,
        signal,
        timedOut,
        durationMs: Date.now() - startedMs,
        startedAt,
        endedAt: new Date().toISOString(),
        note: timedOut ? `Timed out after ${timeoutMs}ms` : "",
        outputTail: tail(stderr || stdout),
      });
    });
  });
}

function buildDecision(rows) {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  const baselineRows = gateSteps.filter((step) => step.requiredForBaseline).map((step) => byKey.get(step.key)).filter(Boolean);
  const signoffRows = gateSteps.filter((step) => step.requiredForSystemSignoff).map((step) => byKey.get(step.key)).filter(Boolean);
  const baselineReady = baselineRows.every((row) => row.ok);
  const systemSignoffReady = signoffRows.every((row) => row.ok);
  const blockers = [];

  for (const step of gateSteps) {
    const row = byKey.get(step.key);
    if (row && !row.ok && step.expectedBlockerWhenFailed) {
      blockers.push(step.expectedBlockerWhenFailed);
    } else if (row && !row.ok && step.requiredForSystemSignoff) {
      blockers.push(step.key);
    }
  }

  return {
    baseline_ready: baselineReady,
    system_signoff_ready: systemSignoffReady,
    wave_e_allowed: systemSignoffReady,
    publish_ready: Boolean(byKey.get("wave_d_public_publish_live")?.ok),
    blockers,
    summary: {
      total: rows.length,
      passed: rows.filter((row) => row.ok).length,
      failed: rows.filter((row) => !row.ok).length,
    },
  };
}

function runSelfTest() {
  const decision = buildDecision([
    { key: "team5_full_pack", ok: true },
    { key: "planned_safe_wave_release", ok: true },
    { key: "team3_referral_disclosure_audit", ok: true },
    { key: "team3_parity", ok: true },
    { key: "session_contract_smoke", ok: true },
    { key: "member_auth_flow", ok: true },
    { key: "wave_d_deploy_plan", ok: true },
    { key: "wave_d_public_publish_self_test", ok: true },
    { key: "wave_d_public_publish_live", ok: false },
  ]);

  if (!decision.baseline_ready || decision.system_signoff_ready || decision.wave_e_allowed || decision.publish_ready) {
    throw new Error("self-test failed: decision gates did not hold Wave E correctly.");
  }
  if (!decision.blockers.includes("wave_d_dns_or_runtime_publish")) {
    throw new Error("self-test failed: Wave D blocker not classified.");
  }
}

function compactRows(rows) {
  return rows.map((row) => ({
    key: row.key,
    label: row.label,
    command: row.command,
    ok: row.ok,
    code: row.code,
    timedOut: row.timedOut,
    durationSec: Number((row.durationMs / 1000).toFixed(1)),
    note: row.note || "",
    outputTail: row.outputTail,
  }));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    console.log("Total-system release gate self-test passed.");
    return;
  }

  const selectedSteps = options.skipHeavy
    ? gateSteps.filter((step) => step.key !== "team5_full_pack")
    : gateSteps;

  console.log("Team 5 total-system release gate brief");
  console.log(`- skip_heavy: ${options.skipHeavy ? "yes" : "no"}`);
  console.log(`- report_path: ${REPORT_PATH}`);
  console.log("");

  const rows = [];
  for (const step of selectedSteps) {
    const row = await runCommandStep(step, options.timeoutMs);
    rows.push(row);
    console.log(`${row.ok ? "PASS" : "FAIL"} ${step.key}: ${step.label}`);
  }

  const decision = buildDecision(rows);
  const report = {
    generatedAt: new Date().toISOString(),
    owner: "team-5-smoke-release-qa",
    lane: "wave-e-total-system-release-gate",
    decision,
    rows: compactRows(rows),
    gateRules: [
      "Wave E chi duoc ky khi Team 5 full pack xanh.",
    "Wave D planned-safe pack va deploy dry-run phai xanh.",
    "Team 3 referral disclosure audit + Team 3 parity phai xanh trong release gate chinh.",
    "Wave D public publish live verify phai xanh truoc khi system_signoff_ready=true.",
    "Neu Wave D con DNS/runtime publish fail thi publish_ready=false va wave_e_allowed=false.",
  ],
  };

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log("Team 5 total-system release gate decision");
  console.log(JSON.stringify(decision, null, 2));
  console.log(`Report written: ${REPORT_PATH}`);

  if (!decision.baseline_ready) {
    throw new Error("Total-system release gate baseline failed.");
  }
  if (!decision.system_signoff_ready) {
    console.log("Wave E remains blocked until public publish live verify passes.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
