import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "prelive-report.latest.json");

function readTimeoutMs(envKey, fallbackMs) {
  const value = Number.parseInt(String(process.env[envKey] || ""), 10);
  if (!Number.isFinite(value) || value <= 0) return fallbackMs;
  return value;
}

function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}m ${remain}s`;
}

function resolvePipeline({ localOnly }) {
  const steps = [
    {
      key: "build",
      label: "Build static system",
      type: "command",
      cmd: "npm",
      args: ["run", "build"],
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_BUILD_MS", 12 * 60 * 1000),
    },
    {
      key: "check",
      label: "Validate dist outputs",
      type: "command",
      cmd: "npm",
      args: ["run", "check"],
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_CHECK_MS", 3 * 60 * 1000),
    },
    {
      key: "smoke_access",
      label: "Smoke access runtime",
      type: "command",
      cmd: "npm",
      args: ["run", "smoke:access-runtime"],
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_SMOKE_ACCESS_MS", 3 * 60 * 1000),
    },
    {
      key: "smoke_vc",
      label: "Smoke VC ownership runtime",
      type: "command",
      cmd: "npm",
      args: ["run", "smoke:vc-ownership-runtime"],
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_SMOKE_VC_MS", 3 * 60 * 1000),
    },
    {
      key: "smoke_mobile",
      label: "Smoke mobile PWA",
      type: "command",
      cmd: "npm",
      args: ["run", "smoke:mobile-pwa"],
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_SMOKE_MOBILE_MS", 3 * 60 * 1000),
    },
  ];

  if (!localOnly) {
    steps.push({
      key: "smoke_prod_endpoints",
      label: "Smoke required live endpoints",
      type: "live_curl",
      timeoutMs: readTimeoutMs("PRELIVE_TIMEOUT_SMOKE_PROD_MS", 4 * 60 * 1000),
    });
  }

  return steps;
}

async function runCommandStep(step) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  let timeoutTriggered = false;

  return await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
      shell: false,
    });

    const timeout = setTimeout(() => {
      timeoutTriggered = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref();
    }, step.timeoutMs);

    child.on("error", (error) => {
      clearTimeout(timeout);
      const finishedMs = Date.now();
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: finishedMs - startedMs,
        timeoutMs: step.timeoutMs,
        timedOut: timeoutTriggered,
        ok: false,
        code: null,
        signal: null,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timeout);
      const finishedMs = Date.now();
      const ok = code === 0 && !timeoutTriggered;
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: finishedMs - startedMs,
        timeoutMs: step.timeoutMs,
        timedOut: timeoutTriggered,
        ok,
        code,
        signal,
        error: timeoutTriggered ? `Timed out after ${step.timeoutMs}ms` : "",
      });
    });
  });
}

function normalizeHost(input) {
  return String(input || "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

async function loadRuntimeTruthByHost() {
  const filePath = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");
  const data = JSON.parse(await readFile(filePath, "utf8"));
  const byHost = new Map();
  for (const domain of data.domains || []) {
    byHost.set(normalizeHost(domain.host), domain);
  }
  return byHost;
}

function parseCurlPayload(rawStdout) {
  const marker = "\n__STATUS__:";
  const markerIndex = rawStdout.lastIndexOf(marker);
  if (markerIndex === -1) {
    return { bodyText: rawStdout, status: 0 };
  }
  const bodyText = rawStdout.slice(0, markerIndex);
  const statusText = rawStdout.slice(markerIndex + marker.length).trim();
  const status = Number.parseInt(statusText, 10);
  return {
    bodyText,
    status: Number.isFinite(status) ? status : 0,
  };
}

async function runCurlRequest(url, timeoutMs) {
  return await new Promise((resolve) => {
    const args = [
      "-sS",
      "-L",
      "--max-time",
      String(Math.max(5, Math.floor(timeoutMs / 1000))),
      "-w",
      "\n__STATUS__:%{http_code}",
      url,
    ];
    const child = spawn("curl", args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let stderr = "";
    let timeoutTriggered = false;

    const timer = setTimeout(() => {
      timeoutTriggered = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 3000).unref();
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
        ok: false,
        status: 0,
        bodyText: "",
        json: null,
        timedOut: timeoutTriggered,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.on("exit", (code) => {
      clearTimeout(timer);
      const parsed = parseCurlPayload(stdout);
      let json = null;

      try {
        json = JSON.parse(parsed.bodyText);
      } catch {
        json = null;
      }

      const ok = !timeoutTriggered && code === 0 && parsed.status >= 200 && parsed.status < 300;
      resolve({
        ok,
        status: parsed.status,
        bodyText: parsed.bodyText,
        json,
        timedOut: timeoutTriggered,
        error: timeoutTriggered
          ? `curl timeout after ${timeoutMs}ms`
          : (code === 0 ? "" : stderr.trim() || `curl exited with code ${code}`),
      });
    });
  });
}

function assertJsonObject(name, json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${name} did not return a valid JSON object.`);
  }
}

async function runLiveCurlStep(step) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const runtimeTruth = await loadRuntimeTruthByHost();
  const edu = runtimeTruth.get("edu.vetuonglai.com");
  const member = runtimeTruth.get("member.vetuonglai.com");
  const memberRequired = Boolean(member?.requiredPublic);

  const checks = [
    {
      name: "Hub health",
      url: "https://vetuonglai.com/manifest.json",
      required: true,
      expectJson: true,
    },
    {
      name: "Member mobile VC certificates",
      url: "https://member.vetuonglai.com/api/mobile/vc-certificates.json",
      required: memberRequired,
      expectJson: true,
      assert: (json) => {
        const items = Array.isArray(json?.certificates) ? json.certificates : null;
        if (!items) {
          throw new Error("Member mobile VC certificates must return object.certificates array.");
        }
        if (items.length === 0) {
          throw new Error("Member mobile VC certificates array is empty.");
        }
      },
    },
    {
      name: "VC verify route",
      url: "https://vc.vetuonglai.com/v/VC-2026-0001",
      required: false,
      expectJson: false,
    },
    {
      name: "EDU health",
      url: "https://edu.vetuonglai.com/api/health",
      required: Boolean(edu?.requiredPublic),
      expectJson: true,
    },
    {
      name: "Hub API index",
      url: "https://vetuonglai.com/api/index.json",
      required: true,
      expectJson: true,
      assert: (json) => {
        assertJsonObject("Hub API index", json);
        if (json.name !== "hub") {
          throw new Error("Hub API index has invalid name.");
        }
        if (!Array.isArray(json.endpoints) || !json.endpoints.includes("/api/contracts.json")) {
          throw new Error("Hub API index does not expose /api/contracts.json.");
        }
      },
    },
    {
      name: "Member API index",
      url: "https://member.vetuonglai.com/api/index.json",
      required: memberRequired,
      expectJson: true,
      assert: (json) => {
        assertJsonObject("Member API index", json);
        if (json.name !== "member") {
          throw new Error("Member API index has invalid name.");
        }
      },
    },
    {
      name: "Hub contracts manifest",
      url: "https://vetuonglai.com/api/contracts.json",
      required: true,
      expectJson: true,
      assert: (json) => {
        assertJsonObject("Hub contracts manifest", json);
        if (json.name !== "vetuonglai-contract-manifest") {
          throw new Error("Hub contracts manifest has invalid name.");
        }
        if (!json.contracts?.team1?.accessModel || !json.contracts?.team3?.policyMatrixHub) {
          throw new Error("Hub contracts manifest missing Team 1/3 contract URLs.");
        }
      },
    },
    {
      name: "Member contracts manifest",
      url: "https://member.vetuonglai.com/api/contracts.json",
      required: memberRequired,
      expectJson: true,
    },
    {
      name: "Hub Team3 policy",
      url: "https://vetuonglai.com/api/policy/team3-matrix.json",
      required: true,
      expectJson: true,
      assert: (json) => {
        assertJsonObject("Hub Team3 policy", json);
        if (!json.guardrails?.homepagePurchaseHubOnly || !json.guardrails?.affiliateDisabledAtAnnualOnlyLayer) {
          throw new Error("Hub Team3 policy guardrails are incomplete.");
        }
      },
    },
    {
      name: "Member Team3 policy",
      url: "https://member.vetuonglai.com/api/team3-policy-matrix.json",
      required: memberRequired,
      expectJson: true,
    },
  ];

  const rows = [];
  let failed = false;

  for (const check of checks) {
    const timeoutPerCheck = Math.max(5000, Math.floor(step.timeoutMs / checks.length));
    const response = await runCurlRequest(check.url, timeoutPerCheck);
    let assertionError = "";

    if (check.required && response.ok && check.expectJson && !response.json) {
      assertionError = `${check.name} did not return valid JSON.`;
    }

    if (!assertionError && check.required && response.ok && typeof check.assert === "function") {
      try {
        check.assert(response.json);
      } catch (error) {
        assertionError = error instanceof Error ? error.message : String(error);
      }
    }

    const passed = check.required ? (response.ok && !assertionError) : true;
    if (!passed) failed = true;

    rows.push({
      name: check.name,
      required: check.required,
      status: response.status,
      ok: passed,
      error: assertionError || response.error,
    });
  }

  console.table(rows);

  const finishedMs = Date.now();
  return {
    key: step.key,
    label: step.label,
    command: "curl live endpoint assertions",
    startedAt,
    endedAt: new Date().toISOString(),
    durationMs: finishedMs - startedMs,
    timeoutMs: step.timeoutMs,
    timedOut: false,
    ok: !failed,
    code: failed ? 1 : 0,
    signal: null,
    error: failed ? "One or more required live endpoint checks failed." : "",
    details: rows,
  };
}

async function runStep(step) {
  if (step.type === "live_curl") {
    return runLiveCurlStep(step);
  }
  return runCommandStep(step);
}

async function writeReport(report) {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
}

function parseOptions() {
  const argv = new Set(process.argv.slice(2));
  const localOnly = argv.has("--local-only");
  const full = argv.has("--full");
  if (localOnly) return { localOnly: true };
  if (full) return { localOnly: false };
  return { localOnly: false };
}

async function main() {
  const options = parseOptions();
  const pipeline = resolvePipeline(options);
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const results = [];

  console.log(`[prelive] started at ${startedAt}`);
  console.log(`[prelive] mode: ${options.localOnly ? "local-only" : "full (local + live endpoints)"}`);

  for (const step of pipeline) {
    console.log(`\n[prelive] >>> ${step.label}`);
    const result = await runStep(step);
    results.push(result);

    const statusText = result.ok
      ? "PASS"
      : (result.timedOut ? "FAIL (TIMEOUT)" : "FAIL");
    console.log(`[prelive] <<< ${step.label}: ${statusText} in ${formatDuration(result.durationMs)}`);

    if (!result.ok) break;
  }

  const endedAt = new Date().toISOString();
  const totalMs = Date.now() - startedMs;
  const ok = results.length === pipeline.length && results.every((result) => result.ok);
  const summary = {
    ok,
    startedAt,
    endedAt,
    durationMs: totalMs,
    mode: options.localOnly ? "local-only" : "full",
    totalSteps: pipeline.length,
    passedSteps: results.filter((result) => result.ok).length,
    failedStepKey: results.find((result) => !result.ok)?.key || null,
  };

  const report = {
    summary,
    steps: results,
  };
  await writeReport(report);

  console.log(`\n[prelive] report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`[prelive] result: ${ok ? "READY_FOR_LIVE" : "BLOCKED_NOT_READY"}`);

  if (!ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("[prelive] unexpected error");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
