import { execFileSync } from "node:child_process";

const DEFAULT_HUB_URL = process.env.VTL_TEAM4_HUB_BASE_URL || "https://vetuonglai.com";
const DEFAULT_MEMBER_URL = process.env.VTL_TEAM4_MEMBER_BASE_URL || "https://member.vetuonglai.com";
const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_TEAM4_ENDPOINTS_TIMEOUT_MS || 12000);
const DEFAULT_VERIFY_WINDOW = process.env.VTL_TEAM4_ENDPOINTS_VERIFY_WINDOW || "24h";

const TEAM4_ENDPOINT_PATHS = [
  "/api/team4/package-form-registry.json",
  "/api/team4/business-domain-contract.json",
  "/api/team4/package-comparison-demo-output.json",
];

const TEAM4_ENDPOINTS = [
  {
    key: "package_form_registry",
    name: "Team4 package/form registry",
    path: "/api/team4/package-form-registry.json",
    smokeValidator: validatePackageFormRegistrySmoke,
    strictValidator: validatePackageFormRegistryStrict,
  },
  {
    key: "business_domain_contract",
    name: "Team4 business domain contract",
    path: "/api/team4/business-domain-contract.json",
    smokeValidator: validateBusinessDomainContractSmoke,
    strictValidator: validateBusinessDomainContractStrict,
  },
  {
    key: "package_comparison_demo_output",
    name: "Team4 package comparison/demo/output",
    path: "/api/team4/package-comparison-demo-output.json",
    smokeValidator: validatePackageComparisonDemoOutputSmoke,
    strictValidator: validatePackageComparisonDemoOutputStrict,
  },
];

function normalizeBaseUrl(input) {
  return String(input || "").replace(/\/+$/, "");
}

function assertJsonObject(label, json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${label} phai la JSON object.`);
  }
}

function assertStringField(object, key, label) {
  const value = object?.[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} thieu truong chuoi ${key}.`);
  }
}

function mustIncludeAll(label, sourceArray, expectedValues) {
  if (!Array.isArray(sourceArray)) {
    throw new Error(`${label} phai la array.`);
  }
  const set = new Set(sourceArray);
  for (const value of expectedValues) {
    if (!set.has(value)) {
      throw new Error(`${label} thieu gia tri bat buoc: ${value}.`);
    }
  }
}

function requiresPublicNameVi(version) {
  const match = String(version || "").match(/-v(\d+)$/i);
  if (!match) return false;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) && parsed >= 3;
}

function validatePackageFormRegistrySmoke(json) {
  assertJsonObject("package-form-registry", json);
  assertStringField(json, "version", "package-form-registry");
  assertStringField(json, "owner", "package-form-registry");
  if (!Array.isArray(json.packageLayers) || json.packageLayers.length === 0) {
    throw new Error("package-form-registry thieu packageLayers.");
  }
  if (!Array.isArray(json.subdomainFormRegistry) || json.subdomainFormRegistry.length === 0) {
    throw new Error("package-form-registry thieu subdomainFormRegistry.");
  }
}

function validatePackageFormRegistryStrict(json) {
  validatePackageFormRegistrySmoke(json);

  if (!Array.isArray(json.packageLayers) || json.packageLayers.length !== 4) {
    throw new Error("package-form-registry phai khoa dung 4 package layers.");
  }

  const packageKeys = new Set((json.packageLayers || []).map((item) => item?.key));
  mustIncludeAll("package-form-registry.packageLayers", [...packageKeys], [
    "foundation",
    "applied",
    "professional",
    "business",
  ]);

  if (requiresPublicNameVi(json.version)) {
    for (const layer of json.packageLayers || []) {
      if (typeof layer?.publicNameVi !== "string" || layer.publicNameVi.trim().length === 0) {
        throw new Error(`package-form-registry package layer ${layer?.key || "unknown"} thieu publicNameVi.`);
      }
    }
  }

  if (json.guardrails?.businessDomainPublicState !== "planned_internal_only") {
    throw new Error("package-form-registry guardrails.businessDomainPublicState phai la planned_internal_only.");
  }

  const businessSurface = (json.subdomainFormRegistry || []).find((item) => item?.surfaceKey === "business");
  if (!businessSurface || businessSurface.runtimeState !== "planned_internal_only") {
    throw new Error("package-form-registry business surface phai co runtimeState=planned_internal_only.");
  }

  mustIncludeAll("package-form-registry.apiPublication.team4Endpoints", json.apiPublication?.team4Endpoints, TEAM4_ENDPOINT_PATHS);
}

function validateBusinessDomainContractSmoke(json) {
  assertJsonObject("business-domain-contract", json);
  assertStringField(json, "version", "business-domain-contract");
  assertStringField(json, "owner", "business-domain-contract");
  assertJsonObject("business-domain-contract.domain", json.domain);
  assertStringField(json.domain, "host", "business-domain-contract.domain");
}

function validateBusinessDomainContractStrict(json) {
  validateBusinessDomainContractSmoke(json);

  if (json.domain?.host !== "business.vetuonglai.com") {
    throw new Error("business-domain-contract domain.host phai la business.vetuonglai.com.");
  }
  if (json.domain?.runtimeStatus !== "planned") {
    throw new Error("business-domain-contract domain.runtimeStatus phai la planned.");
  }
  if (json.runtimeTruthGuardrails?.allowPublicLaunch !== false) {
    throw new Error("business-domain-contract allowPublicLaunch phai la false.");
  }
  if (json.runtimeTruthGuardrails?.allowProductionOnboarding !== false) {
    throw new Error("business-domain-contract allowProductionOnboarding phai la false.");
  }

  mustIncludeAll(
    "business-domain-contract.plannedApiContract.currentSourceOfTruth",
    json.plannedApiContract?.currentSourceOfTruth,
    TEAM4_ENDPOINT_PATHS,
  );
}

function validatePackageComparisonDemoOutputSmoke(json) {
  assertJsonObject("package-comparison-demo-output", json);
  assertStringField(json, "version", "package-comparison-demo-output");
  assertStringField(json, "owner", "package-comparison-demo-output");
  if (!Array.isArray(json.comparisonColumns) || json.comparisonColumns.length === 0) {
    throw new Error("package-comparison-demo-output thieu comparisonColumns.");
  }
  if (!Array.isArray(json.comparisonBundles) || json.comparisonBundles.length === 0) {
    throw new Error("package-comparison-demo-output thieu comparisonBundles.");
  }
}

function validatePackageComparisonDemoOutputStrict(json) {
  validatePackageComparisonDemoOutputSmoke(json);

  if (!Array.isArray(json.packageOrder) || json.packageOrder.join(",") !== "foundation,applied,professional,business") {
    throw new Error("package-comparison-demo-output packageOrder phai la foundation,applied,professional,business.");
  }

  const requiredColumns = [
    "who_for",
    "problem_solved",
    "what_you_get",
    "expected_output",
    "ai_review_proof",
    "next_step",
  ];
  const columnKeys = new Set((json.comparisonColumns || []).map((item) => item?.key));
  mustIncludeAll("package-comparison-demo-output.comparisonColumns", [...columnKeys], requiredColumns);

  if (!Array.isArray(json.demoBundles) || json.demoBundles.length < 4) {
    throw new Error("package-comparison-demo-output demoBundles phai co it nhat 4 bundle.");
  }

  const demoBundleIds = new Set((json.demoBundles || []).map((item) => item?.bundleId));
  mustIncludeAll("package-comparison-demo-output.demoBundles", [...demoBundleIds], [
    "demo_business_entry_v1",
    "demo_business_foundation_v1",
    "demo_business_applied_v1",
    "demo_business_strategic_v1",
  ]);

  const comparisonBundleIds = new Set((json.comparisonBundles || []).map((item) => item?.bundleId));
  if (!comparisonBundleIds.has("business_packages_v1")) {
    throw new Error("package-comparison-demo-output comparisonBundles thieu business_packages_v1.");
  }
}

function parseCliArgs(argv) {
  const options = {
    mode: "both",
    hubUrl: normalizeBaseUrl(DEFAULT_HUB_URL),
    memberUrl: normalizeBaseUrl(DEFAULT_MEMBER_URL),
    timeoutMs: DEFAULT_TIMEOUT_MS,
    selfTest: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--mode") {
      const value = String(argv[index + 1] || "").toLowerCase();
      if (value === "smoke" || value === "strict" || value === "both") {
        options.mode = value;
      }
      index += 1;
      continue;
    }
    if (arg === "--hub-url") {
      options.hubUrl = normalizeBaseUrl(argv[index + 1] || options.hubUrl);
      index += 1;
      continue;
    }
    if (arg === "--member-url") {
      options.memberUrl = normalizeBaseUrl(argv[index + 1] || options.memberUrl);
      index += 1;
      continue;
    }
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
    "node scripts/verify-team4-endpoints-pack.mjs",
    "",
    "Team 5 smoke/strict checks rieng cho 3 endpoint Team 4 moi.",
    "",
    "Tuy chon:",
    "  --mode <smoke|strict|both>  Mac dinh: both",
    "  --hub-url <url>             Mac dinh: https://vetuonglai.com",
    "  --member-url <url>          Mac dinh: https://member.vetuonglai.com",
    "  --timeout-ms <ms>           Mac dinh: 12000",
    "  --self-test                 Chay self-test validator",
    "  --help                      Hien huong dan",
    "",
    "ENV ho tro:",
    "  VTL_TEAM4_HUB_BASE_URL",
    "  VTL_TEAM4_MEMBER_BASE_URL",
    "  VTL_TEAM4_ENDPOINTS_TIMEOUT_MS",
    "  VTL_TEAM4_ENDPOINTS_VERIFY_WINDOW",
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

function requestJsonWithCurl(url, timeoutMs, fetchError) {
  const timeoutSeconds = Math.max(1, Math.ceil(timeoutMs / 1000));
  try {
    const output = execFileSync(
      "curl",
      [
        "-sS",
        "-L",
        "--max-time",
        String(timeoutSeconds),
        "-H",
        "Accept: application/json, text/plain;q=0.8,*/*;q=0.6",
        "-w",
        "\n__VTL_HTTP_STATUS__:%{http_code}",
        url,
      ],
      {
        encoding: "utf8",
        timeout: timeoutMs + 1000,
        maxBuffer: 10 * 1024 * 1024,
      },
    );
    const marker = "\n__VTL_HTTP_STATUS__:";
    const markerIndex = output.lastIndexOf(marker);
    const bodyText = markerIndex === -1 ? output : output.slice(0, markerIndex);
    const statusText = markerIndex === -1 ? "0" : output.slice(markerIndex + marker.length).trim();
    const status = Number(statusText || 0);
    let json = null;
    try {
      json = JSON.parse(bodyText);
    } catch {
      json = null;
    }
    return {
      status,
      ok: status >= 200 && status < 300,
      json,
      bodyText,
      error: "",
      transport: "curl_fallback",
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      json: null,
      bodyText: "",
      error: `${fetchError}; curl fallback failed: ${error instanceof Error ? error.message : String(error)}`,
      transport: "fetch_failed_curl_failed",
    };
  }
}

async function requestJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { accept: "application/json, text/plain;q=0.8,*/*;q=0.6" },
    });
    const bodyText = await response.text();
    let json = null;
    try {
      json = JSON.parse(bodyText);
    } catch {
      json = null;
    }
    return {
      status: response.status,
      ok: response.ok,
      json,
      bodyText,
      error: "",
      transport: "fetch",
    };
  } catch (error) {
    const fetchError = error instanceof Error ? error.message : String(error);
    return requestJsonWithCurl(url, timeoutMs, fetchError);
  } finally {
    clearTimeout(timer);
  }
}

async function runStage(stage, options) {
  const isSmoke = stage === "smoke";
  const acceptedStatuses = isSmoke ? [200, 401, 403, 429] : [200];
  const hosts = [
    { key: "hub", baseUrl: options.hubUrl },
    { key: "member", baseUrl: options.memberUrl },
  ];

  const rows = [];
  const payloadByHostAndEndpoint = new Map();

  for (const host of hosts) {
    for (const endpoint of TEAM4_ENDPOINTS) {
      const url = new URL(endpoint.path, `${host.baseUrl}/`);
      const response = await requestJson(url.toString(), options.timeoutMs);
      let ok = acceptedStatuses.includes(response.status);
      let note = "";

      if (!ok) {
        note = response.error || `status ${response.status} khong nam trong tap cho phep ${acceptedStatuses.join(", ")}`;
      }

      if (ok && response.status === 200) {
        if (!response.json || typeof response.json !== "object" || Array.isArray(response.json)) {
          ok = false;
          note = "response body khong parse duoc thanh JSON object.";
        } else {
          try {
            if (isSmoke) {
              endpoint.smokeValidator(response.json);
            } else {
              endpoint.strictValidator(response.json);
            }
            payloadByHostAndEndpoint.set(`${host.key}:${endpoint.key}`, response.json);
          } catch (error) {
            ok = false;
            note = error instanceof Error ? error.message : String(error);
          }
        }
      }

      if (ok && isSmoke && response.status !== 200) {
        note = `status ${response.status} duoc chap nhan cho smoke mode.`;
      }

      rows.push({
        stage,
        host: host.key,
        endpoint: endpoint.name,
        path: endpoint.path,
        status: response.status,
        ok,
        note: response.transport === "curl_fallback" && ok
          ? [note, "fetch fallback qua curl do sandbox/network resolver"].filter(Boolean).join(" | ")
          : note,
      });
    }
  }

  if (!isSmoke) {
    for (const endpoint of TEAM4_ENDPOINTS) {
      const hub = payloadByHostAndEndpoint.get(`hub:${endpoint.key}`);
      const member = payloadByHostAndEndpoint.get(`member:${endpoint.key}`);

      let ok = Boolean(hub && member);
      let note = "";
      if (!ok) {
        note = "Khong du payload 200 tu ca hub va member de doi version.";
      } else if (hub.version !== member.version) {
        ok = false;
        note = `version mismatch hub=${hub.version} member=${member.version}`;
      }

      rows.push({
        stage: "strict",
        host: "cross-host",
        endpoint: `${endpoint.name} version parity`,
        path: endpoint.path,
        status: 0,
        ok,
        note,
      });
    }
  }

  return {
    rows,
    failed: rows.some((row) => !row.ok),
  };
}

function printEndpointList() {
  console.log("Team4 endpoints under verify");
  for (const [index, path] of TEAM4_ENDPOINT_PATHS.entries()) {
    console.log(`${index + 1}. ${path}`);
  }
  console.log("");
}

function runSelfTest() {
  validatePackageFormRegistryStrict({
    version: "v1",
    owner: "team4",
    guardrails: { businessDomainPublicState: "planned_internal_only" },
    packageLayers: [
      { key: "foundation", publicNameVi: "Nền tảng" },
      { key: "applied", publicNameVi: "Ứng dụng" },
      { key: "professional", publicNameVi: "Chuyên nghiệp" },
      { key: "business", publicNameVi: "Doanh nghiệp" },
    ],
    subdomainFormRegistry: [
      { surfaceKey: "business", runtimeState: "planned_internal_only" },
    ],
    apiPublication: { team4Endpoints: TEAM4_ENDPOINT_PATHS },
  });

  validateBusinessDomainContractStrict({
    version: "v1",
    owner: "team4",
    domain: { host: "business.vetuonglai.com", runtimeStatus: "planned" },
    runtimeTruthGuardrails: {
      allowPublicLaunch: false,
      allowProductionOnboarding: false,
    },
    plannedApiContract: { currentSourceOfTruth: TEAM4_ENDPOINT_PATHS },
  });

  validatePackageComparisonDemoOutputStrict({
    version: "v1",
    owner: "team4",
    packageOrder: ["foundation", "applied", "professional", "business"],
    comparisonColumns: [
      { key: "who_for" },
      { key: "problem_solved" },
      { key: "what_you_get" },
      { key: "expected_output" },
      { key: "ai_review_proof" },
      { key: "next_step" },
    ],
    comparisonBundles: [{ bundleId: "business_packages_v1" }],
    demoBundles: [
      { bundleId: "demo_business_entry_v1" },
      { bundleId: "demo_business_foundation_v1" },
      { bundleId: "demo_business_applied_v1" },
      { bundleId: "demo_business_strategic_v1" },
    ],
  });
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    printEndpointList();
    console.log("Team4 endpoint smoke/strict self-test passed.");
    return;
  }

  console.log("Team4 endpoint verify brief");
  console.log(`- mode: ${options.mode}`);
  console.log(`- hub_url: ${options.hubUrl}`);
  console.log(`- member_url: ${options.memberUrl}`);
  console.log(`- verify_window: ${DEFAULT_VERIFY_WINDOW}`);
  console.log("");

  printEndpointList();

  let smokeResult = null;
  let strictResult = null;

  if (options.mode === "smoke" || options.mode === "both") {
    smokeResult = await runStage("smoke", options);
    console.log("Team4 endpoint smoke rows");
    console.table(smokeResult.rows);
  }

  if (options.mode === "strict" || options.mode === "both") {
    strictResult = await runStage("strict", options);
    console.log("Team4 endpoint strict rows");
    console.table(strictResult.rows);
  }

  const decision = {
    release_ready: !(smokeResult?.failed || strictResult?.failed),
    smoke: smokeResult
      ? { ...summarizeRows(smokeResult.rows), rows: smokeResult.rows }
      : { skipped: true, reason: "mode khong bao gom smoke." },
    strict: strictResult
      ? { ...summarizeRows(strictResult.rows), rows: strictResult.rows }
      : { skipped: true, reason: "mode khong bao gom strict." },
    handoff: {
      endpoints: TEAM4_ENDPOINT_PATHS,
      hosts: ["vetuonglai.com", "member.vetuonglai.com"],
      strict_focus: [
        "business lane planned_internal_only",
        "allowPublicLaunch=false",
        "packageOrder foundation->business",
        "hub/member version parity",
      ],
    },
  };

  console.log("Team4 endpoint verify decision");
  console.log(JSON.stringify(decision, null, 2));

  if (smokeResult?.failed) {
    throw new Error("Team4 endpoint verify failed at smoke stage.");
  }
  if (strictResult?.failed) {
    throw new Error("Team4 endpoint verify failed at strict stage.");
  }
  console.log("Team4 endpoint smoke/strict verify passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
