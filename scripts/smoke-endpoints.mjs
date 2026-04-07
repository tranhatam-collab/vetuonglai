import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function normalizeHost(input) {
  return String(input || "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

async function loadRuntimeTruth() {
  const filePath = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");
  const data = JSON.parse(await readFile(filePath, "utf8"));
  const byHost = new Map();

  for (const domain of data.domains || []) {
    byHost.set(normalizeHost(domain.host), domain);
  }

  return byHost;
}

function buildChecks(runtimeTruth) {
  const edu = runtimeTruth.get("edu.vetuonglai.com");

  return [
    {
      name: "Hub health",
      url: "https://vetuonglai.com/manifest.json",
      required: true,
    },
    {
      name: "VC certificates",
      url: "https://vc.vetuonglai.com/api/certificates.json",
      required: true,
    },
    {
      name: "VC verify route",
      url: "https://vc.vetuonglai.com/v/VC-2026-0001",
      required: true,
    },
    {
      name: "EDU health",
      url: "https://edu.vetuonglai.com/api/health",
      required: Boolean(edu?.requiredPublic),
    },
  ];
}

async function request(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const runtimeTruth = await loadRuntimeTruth();
  const checks = buildChecks(runtimeTruth);

  let failed = false;
  const rows = [];

  for (const check of checks) {
    const result = await request(check.url);
    const passed = check.required ? result.ok : true;

    rows.push({
      name: check.name,
      required: check.required,
      status: result.status,
      ok: passed,
      finalUrl: result.finalUrl,
      error: result.error,
    });

    if (!passed) {
      failed = true;
    }
  }

  console.table(rows);

  if (failed) {
    throw new Error("Smoke endpoint checks failed for required endpoints.");
  }

  console.log("Smoke endpoint checks passed for required endpoints.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
