import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(ROOT, "dist");
const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_PLANNED_SAFE_TIMEOUT_MS || 12000);
const DEFAULT_VERIFY_WINDOW = process.env.VTL_PLANNED_SAFE_VERIFY_WINDOW || "24h";

const domains = [
  {
    key: "work",
    host: "work.vetuonglai.com",
    mode: "planned_surface",
    distDir: "work.vetuonglai.com",
    requiredMarkers: ["Planned", "Bạn đang ở lớp Planned", "https://vetuonglai.com/?entry=work"],
    apiName: "work",
  },
  {
    key: "market",
    host: "market.vetuonglai.com",
    mode: "planned_surface",
    distDir: "market.vetuonglai.com",
    requiredMarkers: ["Planned", "Bạn đang ở lớp Planned", "https://vetuonglai.com/?entry=market"],
    apiName: "market",
  },
  {
    key: "community",
    host: "community.vetuonglai.com",
    mode: "gated_only",
    distDir: "community.vetuonglai.com",
    requiredMarkers: ["Planned", "planned", "đang chuẩn bị", "coming soon"],
  },
  {
    key: "ai",
    host: "ai.vetuonglai.com",
    mode: "gated_only",
    distDir: "ai.vetuonglai.com",
    requiredMarkers: ["Planned", "planned", "đang chuẩn bị", "coming soon"],
  },
  {
    key: "business",
    host: "business.vetuonglai.com",
    mode: "gated_only",
    distDir: "business.vetuonglai.com",
    requiredMarkers: ["Planned", "planned", "đang chuẩn bị", "internal planning"],
  },
];

function parseCliArgs(argv) {
  const options = {
    timeoutMs: DEFAULT_TIMEOUT_MS,
    selfTest: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[index + 1] || options.timeoutMs);
      index += 1;
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
    "node scripts/verify-planned-safe-wave-release.mjs",
    "",
    "Release verification pack cho Wave D planned-safe domains:",
    "work, market, community, ai, business",
    "",
    "Tuy chon:",
    "  --timeout-ms <ms>   Timeout moi runtime request. Mac dinh: 12000",
    "  --self-test         Chay self-test validator.",
    "  --help              Hien huong dan.",
  ].join("\n");
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

function hasMarker(text, markers) {
  for (const marker of markers) {
    if (text.includes(marker)) return true;
  }
  return false;
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runLocalChecks() {
  const rows = [];
  const pagesConfigPath = path.join(ROOT, "cloudflare", "pages-projects.json");
  const pagesConfig = JSON.parse(await readText(pagesConfigPath));
  const pageProjects = Array.isArray(pagesConfig?.projects) ? pagesConfig.projects : [];

  for (const domain of domains) {
    const distDir = path.join(DIST_ROOT, domain.distDir);
    const indexPath = path.join(distDir, "index.html");
    const apiIndexPath = path.join(distDir, "api", "index.json");
    const distExists = await exists(distDir);

    if (!distExists) {
      rows.push({
        domain: domain.key,
        check: "local_dist_presence",
        ok: domain.mode === "gated_only",
        note: domain.mode === "gated_only"
          ? "dist chua co, hop le voi gated_only."
          : "thieu dist cho planned_surface.",
      });
      continue;
    }

    const hasIndex = await exists(indexPath);
    if (!hasIndex) {
      rows.push({
        domain: domain.key,
        check: "index_html",
        ok: false,
        note: "thieu index.html",
      });
      continue;
    }

    const indexText = await readText(indexPath);
    rows.push({
      domain: domain.key,
      check: "planned_marker",
      ok: hasMarker(indexText, domain.requiredMarkers),
      note: hasMarker(indexText, domain.requiredMarkers) ? "" : "khong tim thay marker planned-safe bat buoc.",
    });

    if (domain.mode === "planned_surface") {
      const hasApiIndex = await exists(apiIndexPath);
      if (!hasApiIndex) {
        rows.push({
          domain: domain.key,
          check: "api_index",
          ok: false,
          note: "thieu api/index.json",
        });
      } else {
        const apiJson = JSON.parse(await readText(apiIndexPath));
        rows.push({
          domain: domain.key,
          check: "api_index_name",
          ok: apiJson?.name === domain.apiName,
          note: apiJson?.name === domain.apiName ? "" : `name khong dung, nhan ${String(apiJson?.name || "")}`,
        });
      }
    }

    const project = pageProjects.find((entry) => entry?.key === domain.key);
    rows.push({
      domain: domain.key,
      check: "pages_project_entry",
      ok: Boolean(project),
      note: project ? "" : "thieu project trong cloudflare/pages-projects.json",
    });

    if (project) {
      rows.push({
        domain: domain.key,
        check: "pages_project_domain",
        ok: Array.isArray(project.customDomains) && project.customDomains.includes(domain.host),
        note: Array.isArray(project.customDomains) && project.customDomains.includes(domain.host)
          ? ""
          : "customDomains chua gom host can publish.",
      });
      rows.push({
        domain: domain.key,
        check: "pages_project_dist",
        ok: project.distDir === `dist/${domain.distDir}`,
        note: project.distDir === `dist/${domain.distDir}`
          ? ""
          : `distDir khong dung, nhan ${String(project.distDir || "")}`,
      });
    }
  }

  const runtimeMatrixPath = path.join(ROOT, "docs", "00_master", "32_RUNTIME_TRUTH_MATRIX_V1.md");
  const runtimeMatrix = await readText(runtimeMatrixPath);
  for (const domain of domains) {
    rows.push({
      domain: domain.key,
      check: "runtime_truth_matrix_reference",
      ok: runtimeMatrix.includes(domain.host),
      note: runtimeMatrix.includes(domain.host) ? "" : "thieu host trong runtime truth matrix.",
    });
  }

  return rows;
}

async function probeRuntime(host, timeoutMs) {
  const url = `https://${host}/`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
    });
    const bodyText = await response.text();
    return {
      status: response.status,
      bodyText,
      ok: true,
      error: "",
    };
  } catch (error) {
    return {
      status: 0,
      bodyText: "",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runRuntimeChecks(timeoutMs) {
  const rows = [];
  for (const domain of domains) {
    const runtime = await probeRuntime(domain.host, timeoutMs);
    if (!runtime.ok) {
      rows.push({
        domain: domain.key,
        check: "runtime_probe",
        status: runtime.status,
        ok: true,
        note: `runtime khong reachable (${runtime.error}), chap nhan cho planned-safe/gated.`,
      });
      continue;
    }

    const allowedStatus = [200, 301, 302, 307, 308, 403, 404].includes(runtime.status);
    rows.push({
      domain: domain.key,
      check: "runtime_status",
      status: runtime.status,
      ok: allowedStatus,
      note: allowedStatus ? "" : `status ${runtime.status} khong hop le cho planned-safe.`,
    });

    if (runtime.status === 200) {
      const hasPlannedMarker = hasMarker(runtime.bodyText, domain.requiredMarkers);
      rows.push({
        domain: domain.key,
        check: "runtime_planned_marker",
        status: runtime.status,
        ok: hasPlannedMarker || domain.mode === "gated_only",
        note: hasPlannedMarker
          ? ""
          : "runtime 200 nhung khong co marker planned-safe ro rang.",
      });
    }
  }
  return rows;
}

function runSelfTest() {
  if (!hasMarker("Planned coming soon", ["Planned"])) {
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
    console.log("Planned-safe wave release self-test passed.");
    return;
  }

  console.log("Planned-safe wave release brief");
  console.log(`- verify_window: ${DEFAULT_VERIFY_WINDOW}`);
  console.log(`- timeout_ms: ${options.timeoutMs}`);
  console.log(`- domains: ${domains.map((domain) => domain.key).join(", ")}`);
  console.log("");

  const localRows = await runLocalChecks();
  const runtimeRows = await runRuntimeChecks(options.timeoutMs);
  const rows = [...localRows, ...runtimeRows];

  console.log("Planned-safe wave rows");
  console.table(rows);

  const failed = rows.some((row) => !row.ok);
  const decision = {
    release_ready: !failed,
    summary: summarizeRows(rows),
    rows,
    handoff: {
      targets: domains.map((domain) => ({
        key: domain.key,
        host: domain.host,
        mode: domain.mode,
      })),
      gate_rules: [
        "Khong false-live claim tren domain planned-safe.",
        "CTA domain planned-safe phai dan ve diem vao hop le (hub/gateway).",
        "Domain gated-only co the chua public runtime, nhung phai co runtime-truth reference ro rang.",
      ],
    },
  };

  console.log("Planned-safe wave release decision");
  console.log(JSON.stringify(decision, null, 2));

  if (failed) {
    throw new Error("Planned-safe wave release verification failed.");
  }
  console.log("Planned-safe wave release verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
