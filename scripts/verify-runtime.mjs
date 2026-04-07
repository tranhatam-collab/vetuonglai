import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function normalizeHost(input) {
  return String(input || "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const filePath = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");
  const truth = JSON.parse(await readFile(filePath, "utf8"));

  const rows = [];
  let failed = false;

  for (const domain of truth.domains || []) {
    const host = normalizeHost(domain.host);
    const url = domain.url || `https://${host}`;
    const result = await checkUrl(url);

    const mustBeUp = Boolean(domain.requiredPublic);
    const passed = mustBeUp ? result.ok : true;

    rows.push({
      host,
      status: domain.status,
      servingModel: domain.servingModel,
      requiredPublic: mustBeUp,
      http: result.status,
      ok: passed,
      detail: result.error || "",
    });

    if (!passed) {
      failed = true;
    }
  }

  console.table(rows);

  if (failed) {
    throw new Error("Runtime verification failed for one or more required public domains.");
  }

  console.log("Runtime verification passed for required public domains.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
