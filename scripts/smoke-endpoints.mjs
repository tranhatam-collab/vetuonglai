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
  const member = runtimeTruth.get("member.vetuonglai.com");
  const memberRequired = Boolean(member?.requiredPublic);
  const kids = runtimeTruth.get("kids.vetuonglai.com");

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
    {
      name: "Hub API index",
      url: "https://vetuonglai.com/api/index.json",
      required: true,
    },
    {
      name: "Member API index",
      url: "https://member.vetuonglai.com/api/index.json",
      required: memberRequired,
    },
    {
      name: "Hub contracts manifest",
      url: "https://vetuonglai.com/api/contracts.json",
      required: true,
    },
    {
      name: "Member contracts manifest",
      url: "https://member.vetuonglai.com/api/contracts.json",
      required: memberRequired,
    },
    {
      name: "Hub Team3 policy",
      url: "https://vetuonglai.com/api/policy/team3-matrix.json",
      required: true,
    },
    {
      name: "Member Team3 policy",
      url: "https://member.vetuonglai.com/api/team3-policy-matrix.json",
      required: memberRequired,
    },
    {
      name: "Kids curriculum contract",
      url: "https://kids.vetuonglai.com/api/curriculum.json",
      required: Boolean(kids?.requiredPublic),
    },
    {
      name: "Kids health",
      url: "https://kids.vetuonglai.com/api/health",
      required: Boolean(kids?.requiredPublic),
    },
  ];
}

async function request(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
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
  }
}

function assertJsonObject(name, json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${name} did not return a valid JSON object.`);
  }
}

async function main() {
  const runtimeTruth = await loadRuntimeTruth();
  const checks = buildChecks(runtimeTruth);
  const resultByName = new Map();

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

    resultByName.set(check.name, result);
  }

  try {
    const hubIndex = resultByName.get("Hub API index");
    const memberIndex = resultByName.get("Member API index");
    const hubContracts = resultByName.get("Hub contracts manifest");
    const memberContracts = resultByName.get("Member contracts manifest");
    const hubTeam3 = resultByName.get("Hub Team3 policy");
    const memberTeam3 = resultByName.get("Member Team3 policy");

    if (hubIndex?.ok) {
      assertJsonObject("Hub API index", hubIndex.json);
      if (hubIndex.json.name !== "hub") {
        throw new Error("Hub API index has invalid name.");
      }
      if (!Array.isArray(hubIndex.json.endpoints) || !hubIndex.json.endpoints.includes("/api/contracts.json")) {
        throw new Error("Hub API index does not expose /api/contracts.json.");
      }
    }

    if (memberIndex?.required && memberIndex?.ok) {
      assertJsonObject("Member API index", memberIndex.json);
      if (memberIndex.json.name !== "member") {
        throw new Error("Member API index has invalid name.");
      }
      if (!Array.isArray(memberIndex.json.endpoints) || !memberIndex.json.endpoints.includes("/api/contracts.json")) {
        throw new Error("Member API index does not expose /api/contracts.json.");
      }
    }

    if (hubContracts?.ok && (!memberContracts?.required || memberContracts?.ok)) {
      assertJsonObject("Hub contracts manifest", hubContracts.json);
      if (hubContracts.json.name !== "vetuonglai-contract-manifest") {
        throw new Error("Hub contracts manifest has invalid name.");
      }
      if (!hubContracts.json.contracts?.team3?.policyMatrixHub || !hubContracts.json.contracts?.team1?.accessModel) {
        throw new Error("Hub contracts manifest missing Team 1/3 contract URLs.");
      }

      if (memberContracts?.required) {
        assertJsonObject("Member contracts manifest", memberContracts.json);
        if (hubContracts.json.contractVersion !== memberContracts.json.contractVersion) {
          throw new Error("Hub/member contracts manifest contractVersion mismatch.");
        }
      }
    }

    if (hubTeam3?.ok && (!memberTeam3?.required || memberTeam3?.ok)) {
      assertJsonObject("Hub Team3 policy", hubTeam3.json);
      if (!hubTeam3.json.guardrails?.homepagePurchaseHubOnly || !hubTeam3.json.guardrails?.affiliateDisabledAtAnnualOnlyLayer) {
        throw new Error("Hub Team3 policy guardrails are incomplete.");
      }

      if (memberTeam3?.required) {
        assertJsonObject("Member Team3 policy", memberTeam3.json);
        if (hubTeam3.json.contractVersion !== memberTeam3.json.contractVersion) {
          throw new Error("Hub/member Team3 policy contractVersion mismatch.");
        }
      }
    }
  } catch (error) {
    failed = true;
    rows.push({
      name: "Contract JSON assertions",
      required: true,
      status: 0,
      ok: false,
      finalUrl: "",
      error: error instanceof Error ? error.message : String(error),
    });
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
