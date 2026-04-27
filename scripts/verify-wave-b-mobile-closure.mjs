import {
  assertJsonObject,
  loadRuntimeTruthByHost,
  parseModeArgs,
  readDistJson,
  readDistText,
  requestUrl,
  requireIncludes,
  runCommandSuite,
  summarizeRows,
  usageText,
} from "./verify-wave-pack-utils.mjs";

const LOCAL_STEPS = [
  {
    key: "build",
    label: "Build static system",
    cmd: "npm",
    args: ["run", "build"],
    timeoutMs: 12 * 60 * 1000,
  },
  {
    key: "check",
    label: "Validate dist outputs",
    cmd: "npm",
    args: ["run", "check"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_access",
    label: "Smoke access runtime",
    cmd: "npm",
    args: ["run", "smoke:access-runtime"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_vc",
    label: "Smoke VC ownership runtime",
    cmd: "npm",
    args: ["run", "smoke:vc-ownership-runtime"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_mobile",
    label: "Smoke mobile PWA",
    cmd: "npm",
    args: ["run", "smoke:mobile-pwa"],
    timeoutMs: 3 * 60 * 1000,
  },
];

const MOBILE_REQUIRED_EVENTS = [
  "mobile_app_open",
  "mobile_login_success",
  "mobile_edu_lesson_start",
  "mobile_edu_lesson_complete",
  "mobile_vc_verify_open",
  "dashboard_open",
  "dashboard_next_step_click",
  "dashboard_domain_open_click",
  "dashboard_pack_view_click",
  "dashboard_renew_click",
];

async function evaluateLocalContract() {
  const appHtml = await readDistText("member.vetuonglai.com", "app", "index.html");
  const manifest = await readDistJson("member.vetuonglai.com", "app", "manifest.webmanifest");
  const mobileConfig = await readDistJson("member.vetuonglai.com", "api", "mobile-config.json");
  const routingContract = await readDistJson("member.vetuonglai.com", "api", "access", "routing-contract.json");
  const sessionStates = await readDistJson("member.vetuonglai.com", "api", "mobile", "session-states.json");
  const apiIndex = await readDistJson("member.vetuonglai.com", "api", "index.json");

  const rows = [];

  try {
    requireIncludes("Member app shell", appHtml, [
      "/api/mobile-config.json",
      "/api/access/routing-contract.json",
      "/api/mobile/session-states.json",
      "data-mobile-requires-auth",
      "mobile-next-step-primary",
      "mobile-primary-cta",
    ]);
    rows.push({ name: "Member app shell wiring", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "Member app shell wiring",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertJsonObject("Member mobile config", mobileConfig);
    if (mobileConfig.paymentInAppEnabled !== false) {
      throw new Error("paymentInAppEnabled phai = false.");
    }
    for (const eventKey of MOBILE_REQUIRED_EVENTS) {
      if (!mobileConfig.telemetry?.requiredEvents?.includes(eventKey)) {
        throw new Error(`Telemetry thieu su kien ${eventKey}.`);
      }
    }
    const requiredEndpointKeys = [
      "sessionCurrent",
      "eduCatalog",
      "vcCertificates",
      "routingContract",
      "mobileStates",
      "team3PolicyMatrix",
    ];
    for (const key of requiredEndpointKeys) {
      if (typeof mobileConfig.endpoints?.[key] !== "string" || !mobileConfig.endpoints[key]) {
        throw new Error(`Mobile config thieu endpoint ${key}.`);
      }
    }
    rows.push({ name: "Mobile config contract", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "Mobile config contract",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertJsonObject("Member routing contract", routingContract);
    if (routingContract.routeContract?.purchaseHub?.domain !== "vetuonglai.com") {
      throw new Error("purchaseHub.domain phai tro ve vetuonglai.com.");
    }
    const queryParams = Array.isArray(routingContract.routeContract?.queryParams)
      ? routingContract.routeContract.queryParams
      : [];
    const names = new Set(queryParams.map((item) => item?.name));
    if (!names.has("entry") || !names.has("intent")) {
      throw new Error("routing-contract phai giu query params entry + intent.");
    }
    rows.push({ name: "Routing contract to hub", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "Routing contract to hub",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertJsonObject("Member mobile session states", sessionStates);
    const states = Array.isArray(sessionStates.identityStates) ? sessionStates.identityStates : [];
    const keys = new Set(states.map((item) => item?.key));
    if (!keys.has("annual_active") || !keys.has("pack_owner")) {
      throw new Error("session-states phai co annual_active + pack_owner.");
    }
    rows.push({ name: "Session states contract", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "Session states contract",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertJsonObject("Member PWA manifest", manifest);
    if (manifest.display !== "standalone") {
      throw new Error("manifest.display phai = standalone.");
    }
    if (manifest.scope !== "/app/") {
      throw new Error("manifest.scope phai = /app/.");
    }
    if (typeof manifest.start_url !== "string" || !manifest.start_url.startsWith("/app/")) {
      throw new Error("manifest.start_url phai bat dau bang /app/.");
    }
    if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
      throw new Error("manifest phai co it nhat 2 icon.");
    }
    rows.push({ name: "PWA manifest contract", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "PWA manifest contract",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertJsonObject("Member API index", apiIndex);
    const endpoints = Array.isArray(apiIndex.endpoints) ? apiIndex.endpoints : [];
    const requiredEndpoints = [
      "/api/mobile-config.json",
      "/api/mobile/edu-catalog.json",
      "/api/mobile/vc-certificates.json",
      "/api/mobile/session-states.json",
      "/api/access/routing-contract.json",
    ];
    for (const endpoint of requiredEndpoints) {
      if (!endpoints.includes(endpoint)) {
        throw new Error(`Member API index thieu ${endpoint}.`);
      }
    }
    rows.push({ name: "Member API index mobile endpoints", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "Member API index mobile endpoints",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return rows;
}

function buildLiveChecks(runtimeTruth) {
  const member = runtimeTruth.get("member.vetuonglai.com");
  const edu = runtimeTruth.get("edu.vetuonglai.com");
  const vc = runtimeTruth.get("vc.vetuonglai.com");

  return [
    {
      name: "Member app shell",
      url: "https://member.vetuonglai.com/app/",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        requireIncludes("Member app shell live", result.bodyText, [
          "/api/mobile-config.json",
          "/api/access/routing-contract.json",
          "mobile-primary-cta",
        ]);
      },
    },
    {
      name: "Member app manifest",
      url: "https://member.vetuonglai.com/app/manifest.webmanifest",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        assertJsonObject("Member app manifest live", result.json);
        if (result.json.display !== "standalone") {
          throw new Error("Live manifest.display phai = standalone.");
        }
      },
    },
    {
      name: "Member mobile config",
      url: "https://member.vetuonglai.com/api/mobile-config.json",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        assertJsonObject("Member mobile config live", result.json);
        if (result.json.paymentInAppEnabled !== false) {
          throw new Error("Live mobile-config paymentInAppEnabled phai = false.");
        }
      },
    },
    {
      name: "Member session states",
      url: "https://member.vetuonglai.com/api/mobile/session-states.json",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        assertJsonObject("Member session states live", result.json);
        const keys = new Set((result.json.identityStates || []).map((item) => item?.key));
        if (!keys.has("annual_active") || !keys.has("pack_owner")) {
          throw new Error("Live session-states thieu annual_active hoac pack_owner.");
        }
      },
    },
    {
      name: "Member routing contract",
      url: "https://member.vetuonglai.com/api/access/routing-contract.json",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        assertJsonObject("Member routing contract live", result.json);
        if (result.json.routeContract?.purchaseHub?.domain !== "vetuonglai.com") {
          throw new Error("Live routing-contract khong tro ve vetuonglai.com.");
        }
      },
    },
    {
      name: "Member API index",
      url: "https://member.vetuonglai.com/api/index.json",
      required: Boolean(member?.requiredPublic),
      assertResult(result) {
        assertJsonObject("Member API index live", result.json);
        const endpoints = Array.isArray(result.json.endpoints) ? result.json.endpoints : [];
        if (!endpoints.includes("/api/mobile-config.json") || !endpoints.includes("/api/mobile/session-states.json")) {
          throw new Error("Live member api index chua expose mobile endpoints.");
        }
      },
    },
    {
      name: "EDU health",
      url: "https://edu.vetuonglai.com/api/health",
      required: Boolean(edu?.requiredPublic),
      assertResult(result) {
        assertJsonObject("EDU health live", result.json);
      },
    },
    {
      name: "VC certificates",
      url: "https://vc.vetuonglai.com/api/certificates.json",
      required: Boolean(vc?.requiredPublic),
      assertResult(result) {
        assertJsonObject("VC certificates live", result.json);
      },
    },
  ];
}

async function evaluateLiveSurface() {
  const runtimeTruth = await loadRuntimeTruthByHost();
  const checks = buildLiveChecks(runtimeTruth);
  const rows = [];

  for (const check of checks) {
    if (!check.required) {
      rows.push({
        name: check.name,
        url: check.url,
        required: false,
        skipped: true,
        ok: true,
        status: 0,
        detail: "Skipped because runtime truth does not require this surface to be public.",
      });
      continue;
    }

    const result = await requestUrl(check.url);
    let ok = result.ok;
    let detail = result.error || "";

    if (ok) {
      try {
        check.assertResult(result);
      } catch (error) {
        ok = false;
        detail = error instanceof Error ? error.message : String(error);
      }
    }

    rows.push({
      name: check.name,
      url: check.url,
      required: true,
      skipped: false,
      ok,
      status: result.status,
      detail,
    });
  }

  return {
    rows,
    runtimeTruth: {
      member: runtimeTruth.get("member.vetuonglai.com") || null,
      edu: runtimeTruth.get("edu.vetuonglai.com") || null,
      vc: runtimeTruth.get("vc.vetuonglai.com") || null,
    },
  };
}

function buildDecision({ options, commandSuite, localRows, liveRows, runtimeTruth }) {
  const commandSummary = summarizeRows(commandSuite?.rows || []);
  const localSummary = summarizeRows(localRows);
  const liveSummary = summarizeRows(liveRows || []);
  const commandsOk = commandSummary.failed === 0;
  const localOk = localSummary.failed === 0;
  const liveOk = options.localOnly ? true : liveSummary.failed === 0;

  return {
    wave: "B",
    lane: "mobile_closure",
    mode: options.localOnly ? "local_only" : "full",
    release_ready: commandsOk && localOk && liveOk,
    command_suite: commandSummary,
    local_contract: localSummary,
    live_surface: options.localOnly ? { skipped: true } : liveSummary,
    runtime_truth: runtimeTruth || null,
  };
}

async function main() {
  const options = parseModeArgs(process.argv.slice(2));

  if (options.help) {
    console.log(
      usageText(
        "node scripts/verify-wave-b-mobile-closure.mjs",
        "Verify pack cho Wave B mobile closure. Script nay chi pass release_ready khi contract local sach va cac mobile surface dang requiredPublic deu pass.",
      ),
    );
    return;
  }

  const commandSuite = options.skipCommandSteps
    ? { rows: [], failed: false }
    : await runCommandSuite(LOCAL_STEPS);

  if (commandSuite.rows.length) {
    console.log("Wave B command suite");
    console.table(commandSuite.rows.map((row) => ({
      key: row.key,
      label: row.label,
      ok: row.ok,
      code: row.code,
      timedOut: row.timedOut,
      error: row.error,
    })));
  }

  if (commandSuite.failed) {
    throw new Error("Wave B mobile closure failed inside command suite.");
  }

  const localRows = await evaluateLocalContract();
  console.log("Wave B local contract rows");
  console.table(localRows);

  if (localRows.some((row) => !row.ok)) {
    throw new Error("Wave B mobile closure failed at local contract stage.");
  }

  let liveEvaluation = { rows: [], runtimeTruth: null };
  if (!options.localOnly) {
    liveEvaluation = await evaluateLiveSurface();
    console.log("Wave B live surface rows");
    console.table(liveEvaluation.rows);

    if (liveEvaluation.rows.some((row) => !row.ok && !row.skipped)) {
      throw new Error("Wave B mobile closure failed at live surface stage.");
    }
  }

  const decision = buildDecision({
    options,
    commandSuite,
    localRows,
    liveRows: liveEvaluation.rows,
    runtimeTruth: liveEvaluation.runtimeTruth,
  });

  console.log("Wave B mobile closure decision");
  console.log(JSON.stringify(decision, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
