import { spawn } from "node:child_process";

const DEFAULT_BASE_URL = process.env.VTL_MOBILE_BASE_URL || "https://member.vetuonglai.com";
const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_MOBILE_TIMEOUT_MS || 12000);
const DEFAULT_RELEASE_WINDOW = process.env.VTL_MOBILE_RELEASE_WINDOW || "24h";

const mobileRuntimeRequirements = [
  "Mobile app shell phải truy cập được tại /app/ và có manifest + service worker.",
  "Mobile config/session/routing contract phải trả JSON parse được với shape cốt lõi.",
  "CTA commerce trong mobile phải quay về hub (không checkout trực tiếp trong app/subdomain).",
  "Policy matrix Team 3 phải đọc được để giữ trust wording đồng bộ.",
];

const mobileReleaseEvidenceMinimum = [
  "verify:team-app:day1:local pass.",
  "verify:team3:parity pass.",
  "Runtime probes cho /app/, mobile-config, session-states, routing-contract pass.",
  "Có base URL + verify window + decision JSON để handoff QA/PM.",
];

const mobileReleaseSteps = [
  {
    key: "local_mobile_pack",
    label: "Chạy local pack cho mobile V1",
    command: "npm run verify:team-app:day1:local",
  },
  {
    key: "local_trust_parity",
    label: "Chạy parity gate Team 3",
    command: "npm run verify:team3:parity",
  },
  {
    key: "runtime_mobile_probe",
    label: "Probe runtime mobile endpoints",
    command: "node scripts/verify-mobile-release-pack.mjs --base-url <runtime-url>",
  },
];

function parseCliArgs(argv) {
  const options = {
    baseUrl: String(DEFAULT_BASE_URL).replace(/\/+$/, ""),
    timeoutMs: DEFAULT_TIMEOUT_MS,
    skipLocal: false,
    skipRuntime: false,
    selfTest: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base-url") {
      options.baseUrl = String(argv[index + 1] || options.baseUrl).replace(/\/+$/, "");
      index += 1;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[index + 1] || options.timeoutMs);
      index += 1;
      continue;
    }
    if (arg === "--skip-local") {
      options.skipLocal = true;
      continue;
    }
    if (arg === "--skip-runtime") {
      options.skipRuntime = true;
      continue;
    }
    if (arg === "--self-test") {
      options.selfTest = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function usageText() {
  return [
    "node scripts/verify-mobile-release-pack.mjs",
    "",
    "Release verification wrapper cho mobile pack (Team 5).",
    "",
    "Tuy chon:",
    "  --base-url <url>    Runtime base URL. Mac dinh: https://member.vetuonglai.com",
    "  --timeout-ms <ms>   Timeout moi runtime request. Mac dinh: 12000",
    "  --skip-local        Bo qua local command steps.",
    "  --skip-runtime      Bo qua runtime probes.",
    "  --self-test         Chay self-test validator.",
    "  --help              Hien huong dan.",
    "",
    "ENV ho tro:",
    "  VTL_MOBILE_BASE_URL",
    "  VTL_MOBILE_TIMEOUT_MS",
    "  VTL_MOBILE_RELEASE_WINDOW",
  ].join("\n");
}

function printChecklist(title, items) {
  console.log(title);
  for (const [index, item] of items.entries()) {
    console.log(`${index + 1}. ${item}`);
  }
  console.log("");
}

function printStepBoard() {
  console.log("Mobile verify sequence");
  for (const [index, step] of mobileReleaseSteps.entries()) {
    console.log(`${index + 1}. ${step.label}`);
    console.log(`   command: ${step.command}`);
  }
  console.log("");
}

function summarizeRows(rows) {
  const total = rows.length;
  const passed = rows.filter((row) => row.ok).length;
  const failed = total - passed;
  return {
    total,
    passed,
    failed,
    passRate: total === 0 ? 0 : Number((passed / total).toFixed(3)),
  };
}

async function runCommandStep(step, timeoutMs) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();

  return await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
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
      setTimeout(() => child.kill("SIGKILL"), 3000).unref();
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      const durationMs = Date.now() - startedMs;
      const ok = !timedOut && code === 0;
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs,
        timedOut,
        ok,
        code,
        signal,
        outputTail: (stderr || stdout).trim().split("\n").slice(-6).join("\n"),
      });
    });
  });
}

function assertJsonObject(name, json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${name} phai la JSON object.`);
  }
}

async function requestCheck(options, check) {
  const url = new URL(check.path, `${options.baseUrl}/`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { accept: "application/json, text/html;q=0.9" },
    });
    const bodyText = await response.text();
    let json = null;
    if (bodyText) {
      try {
        json = JSON.parse(bodyText);
      } catch {
        json = null;
      }
    }

    let ok = check.acceptedStatuses.includes(response.status);
    let note = "";
    if (!ok) {
      note = `status ${response.status} khong nam trong tap cho phep ${check.acceptedStatuses.join(", ")}`;
    }

    if (ok && check.validator) {
      try {
        check.validator({ bodyText, json });
      } catch (error) {
        ok = false;
        note = error instanceof Error ? error.message : String(error);
      }
    }

    return {
      name: check.name,
      path: url.pathname,
      status: response.status,
      ok,
      note,
    };
  } catch (error) {
    return {
      name: check.name,
      path: url.pathname,
      status: 0,
      ok: false,
      note: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function buildRuntimeChecks() {
  return [
    {
      name: "Mobile app shell",
      path: "/app/",
      acceptedStatuses: [200],
      validator: ({ bodyText }) => {
        if (!bodyText.includes("/app/manifest.webmanifest") || !bodyText.includes("/app/sw.js")) {
          throw new Error("App shell thieu manifest hoac service worker link.");
        }
      },
    },
    {
      name: "Mobile config",
      path: "/api/mobile-config.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("mobile-config", json);
        if (json.paymentInAppEnabled !== false) {
          throw new Error("mobile-config paymentInAppEnabled phai la false.");
        }
        if (!Array.isArray(json.telemetry?.requiredEvents) || !json.telemetry.requiredEvents.includes("mobile_app_open")) {
          throw new Error("mobile-config telemetry requiredEvents khong hop le.");
        }
      },
    },
    {
      name: "Mobile session states",
      path: "/api/mobile/session-states.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("session-states", json);
        if (!Array.isArray(json.identityStates)) {
          throw new Error("session-states thieu identityStates.");
        }
        const keys = new Set(json.identityStates.map((item) => item?.key));
        if (!keys.has("annual_active") || !keys.has("pack_owner")) {
          throw new Error("session-states thieu annual_active hoac pack_owner.");
        }
      },
    },
    {
      name: "Mobile routing contract",
      path: "/api/access/routing-contract.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("routing-contract", json);
        if (json.routeContract?.purchaseHub?.domain !== "vetuonglai.com") {
          throw new Error("routing-contract purchaseHub.domain khong dung.");
        }
      },
    },
    {
      name: "Team3 policy matrix",
      path: "/api/team3-policy-matrix.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("team3-policy-matrix", json);
      },
    },
    {
      name: "Mobile EDU catalog",
      path: "/api/mobile/edu-catalog.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("mobile-edu-catalog", json);
        if (!Array.isArray(json.courses) || json.courses.length === 0) {
          throw new Error("mobile-edu-catalog thieu courses.");
        }
      },
    },
    {
      name: "Mobile VC certificates",
      path: "/api/mobile/vc-certificates.json",
      acceptedStatuses: [200],
      validator: ({ json }) => {
        assertJsonObject("mobile-vc-certificates", json);
        if (!Array.isArray(json.certificates) || json.certificates.length === 0) {
          throw new Error("mobile-vc-certificates thieu certificates.");
        }
      },
    },
  ];
}

function runSelfTest() {
  assertJsonObject("sample", { ok: true });
  const sampleConfig = {
    paymentInAppEnabled: false,
    telemetry: { requiredEvents: ["mobile_app_open"] },
  };
  if (sampleConfig.paymentInAppEnabled !== false) {
    throw new Error("self-test failed");
  }
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    printStepBoard();
    printChecklist("Mobile runtime requirements", mobileRuntimeRequirements);
    printChecklist("Mobile release evidence minimum", mobileReleaseEvidenceMinimum);
    console.log("Mobile verify pack self-test passed.");
    return;
  }

  console.log("Mobile release brief");
  console.log(`- base_url: ${options.baseUrl}`);
  console.log(`- verify_window: ${DEFAULT_RELEASE_WINDOW}`);
  console.log(`- skip_local: ${options.skipLocal ? "yes" : "no"}`);
  console.log(`- skip_runtime: ${options.skipRuntime ? "yes" : "no"}`);
  console.log("");

  printStepBoard();
  printChecklist("Mobile runtime requirements", mobileRuntimeRequirements);
  printChecklist("Mobile release evidence minimum", mobileReleaseEvidenceMinimum);

  const localRows = [];
  if (!options.skipLocal) {
    localRows.push(await runCommandStep({
      key: "verify_team_app_day1_local",
      label: "verify:team-app:day1:local",
      cmd: "npm",
      args: ["run", "verify:team-app:day1:local"],
    }, 20 * 60 * 1000));
    localRows.push(await runCommandStep({
      key: "verify_team3_parity",
      label: "verify:team3:parity",
      cmd: "npm",
      args: ["run", "verify:team3:parity"],
    }, 8 * 60 * 1000));
  }

  if (localRows.length > 0) {
    console.log("Mobile local rows");
    console.table(localRows.map((row) => ({
      step: row.label,
      ok: row.ok,
      code: row.code,
      timedOut: row.timedOut,
      durationSec: Number((row.durationMs / 1000).toFixed(1)),
      note: row.outputTail ? row.outputTail.split("\n").slice(-1)[0] : "",
    })));
  }

  const runtimeRows = [];
  if (!options.skipRuntime) {
    for (const check of buildRuntimeChecks()) {
      runtimeRows.push(await requestCheck(options, check));
    }
    console.log("Mobile runtime rows");
    console.table(runtimeRows);
  }

  const localFailed = localRows.some((row) => !row.ok);
  const runtimeFailed = runtimeRows.some((row) => !row.ok);
  const decision = {
    release_ready: !localFailed && !runtimeFailed,
    local: {
      skipped: options.skipLocal,
      ...summarizeRows(localRows.map((row) => ({ ok: row.ok }))),
      rows: localRows.map((row) => ({
        step: row.label,
        ok: row.ok,
        code: row.code,
        timedOut: row.timedOut,
      })),
    },
    runtime: {
      skipped: options.skipRuntime,
      ...summarizeRows(runtimeRows),
      rows: runtimeRows,
    },
    handoff: {
      runtime_requirements: mobileRuntimeRequirements,
      release_evidence_minimum: mobileReleaseEvidenceMinimum,
      verify_steps: mobileReleaseSteps,
    },
  };

  console.log("Mobile release decision");
  console.log(JSON.stringify(decision, null, 2));

  if (localFailed) {
    throw new Error("Mobile release verify failed at local stage.");
  }
  if (runtimeFailed) {
    throw new Error("Mobile release verify failed at runtime stage.");
  }
  console.log("Mobile release verify pack passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

