import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, "..");
export const DIST_ROOT = path.resolve(process.env.VTL_DIST_ROOT || path.join(ROOT, "dist"));
export const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_VERIFY_TIMEOUT_MS || 12000);

export function normalizeHost(input) {
  return String(input || "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

export function parseModeArgs(argv) {
  const options = {
    full: true,
    localOnly: false,
    skipCommandSteps: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--local-only") {
      options.localOnly = true;
      options.full = false;
      continue;
    }
    if (arg === "--full") {
      options.full = true;
      options.localOnly = false;
      continue;
    }
    if (arg === "--skip-command-steps") {
      options.skipCommandSteps = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

export function usageText(commandName, summary) {
  return [
    commandName,
    "",
    summary,
    "",
    "Options:",
    "  --local-only          Chi chay local/dist contract, bo qua live surface.",
    "  --full                Chay local/dist va live surface theo runtime truth hien tai.",
    "  --skip-command-steps  Bo qua cac npm step (dung khi suite ben ngoai da build/smoke xong).",
    "  -h, --help            In huong dan.",
  ].join("\n");
}

export async function readText(filePath) {
  return readFile(filePath, "utf8");
}

export async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

export async function readDistText(...segments) {
  return readText(path.join(DIST_ROOT, ...segments));
}

export async function readDistJson(...segments) {
  return readJson(path.join(DIST_ROOT, ...segments));
}

export async function loadRuntimeTruthByHost() {
  const data = await readJson(path.join(ROOT, "cloudflare", "domain-runtime-truth.json"));
  const byHost = new Map();

  for (const domain of data.domains || []) {
    byHost.set(normalizeHost(domain.host), domain);
  }

  return byHost;
}

export function summarizeRows(rows) {
  const total = rows.length;
  const passed = rows.filter((row) => row.ok && !row.skipped).length;
  const failed = rows.filter((row) => !row.ok && !row.skipped).length;
  const skipped = rows.filter((row) => row.skipped).length;
  return { total, passed, failed, skipped };
}

export async function runCommandStep(step) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  let timedOut = false;

  return await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
      shell: false,
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref();
    }, step.timeoutMs || DEFAULT_TIMEOUT_MS);

    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        ok: false,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        timedOut,
        code: null,
        signal: null,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timeout);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        ok: code === 0 && !timedOut,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        timedOut,
        code,
        signal,
        error: timedOut ? `Timed out after ${step.timeoutMs || DEFAULT_TIMEOUT_MS}ms` : "",
      });
    });
  });
}

export async function runCommandSuite(steps) {
  const rows = [];
  let failed = false;

  for (const step of steps) {
    const row = await runCommandStep(step);
    rows.push(row);
    if (!row.ok) {
      failed = true;
      break;
    }
  }

  return { rows, failed };
}

export async function requestUrl(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    const bodyText = await response.text();

    let json = null;
    try {
      json = JSON.parse(bodyText);
    } catch {
      json = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      bodyText,
      json,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: "",
      bodyText: "",
      json: null,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

export function assertJsonObject(label, json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${label} phai tra ve JSON object.`);
  }
}

export function requireIncludes(label, haystack, fragments) {
  for (const fragment of fragments) {
    if (!String(haystack || "").includes(fragment)) {
      throw new Error(`${label} thieu fragment bat buoc: ${fragment}`);
    }
  }
}
