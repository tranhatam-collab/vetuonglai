import { execFileSync } from "node:child_process";

const DEFAULT_BASE_URL = process.env.VTL_FOUNDER_BASE_URL || "https://member.vetuonglai.com";
const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_FOUNDER_TIMEOUT_MS || 10000);
const DEFAULT_RELEASE_WINDOW = process.env.VTL_FOUNDER_RELEASE_WINDOW || "24h";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asArray(value, fallbackKeys = []) {
  if (Array.isArray(value)) {
    return value;
  }
  if (isObject(value)) {
    for (const key of fallbackKeys) {
      if (Array.isArray(value[key])) {
        return value[key];
      }
    }
  }
  return null;
}

function readField(object, candidates) {
  for (const candidate of candidates) {
    if (object?.[candidate] !== undefined) {
      return object[candidate];
    }
  }
  return undefined;
}

function assertJsonObject(label, json) {
  if (!isObject(json)) {
    throw new Error(`${label} phải trả về JSON object.`);
  }
}

function assertJsonArrayOrObject(label, json) {
  if (!Array.isArray(json) && !isObject(json)) {
    throw new Error(`${label} phải trả về JSON object hoặc array.`);
  }
}

function assertNumberField(object, candidates, label) {
  const value = readField(object, candidates);
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label} thiếu trường số: ${candidates.join(" | ")}`);
  }
}

function assertStringField(object, candidates, label) {
  const value = readField(object, candidates);
  if (!isNonEmptyString(value)) {
    throw new Error(`${label} thiếu trường chuỗi: ${candidates.join(" | ")}`);
  }
}

function assertArrayField(object, candidates, label) {
  const value = readField(object, candidates);
  if (!Array.isArray(value)) {
    throw new Error(`${label} thiếu trường mảng: ${candidates.join(" | ")}`);
  }
}

function assertErrorLikeJson(label, json) {
  assertJsonObject(label, json);
  const hasErrorSignal = [
    "error",
    "status",
    "message",
    "code",
    "success",
    "allowed",
  ].some((key) => key in json);
  if (!hasErrorSignal) {
    throw new Error(`${label} trả về lỗi nhưng không có shape JSON lỗi cơ bản.`);
  }
}

function assertOverviewShape(json) {
  assertJsonObject("Founder overview", json);
  assertStringField(json, ["environment"], "Founder overview");
  assertStringField(json, ["version"], "Founder overview");
  assertJsonObject("Founder overview.system_health", json.system_health);
  assertJsonObject("Founder overview.journey_summary", json.journey_summary);
  assertJsonObject("Founder overview.domain_summary", json.domain_summary);
  assertArrayField(json, ["critical_alerts"], "Founder overview");
}

function assertSystemHealthShape(json) {
  assertJsonObject("Founder system health", json);
  const items = asArray(json, ["items", "services"]);
  if (items) {
    if (!items.length) {
      throw new Error("Founder system health cần ít nhất 1 service item.");
    }
    for (const item of items) {
      assertJsonObject("Founder system health item", item);
      assertStringField(item, ["key", "name"], "Founder system health item");
      assertStringField(item, ["status"], "Founder system health item");
    }
    return;
  }

  const requiredKeys = ["hub", "member", "edu", "submission", "vc", "dashboard"];
  const presentKeys = requiredKeys.filter((key) => isObject(json[key]));
  if (!presentKeys.length) {
    throw new Error("Founder system health cần items/services hoặc service objects theo key chuẩn.");
  }
  for (const key of presentKeys) {
    assertStringField(json[key], ["status"], `Founder system health.${key}`);
  }
}

function assertJourneyFunnelShape(json) {
  assertJsonObject("Founder journey funnel", json);
  const items = asArray(json, ["funnel", "steps", "items"]);
  if (!items || !items.length) {
    throw new Error("Founder journey funnel cần mảng funnel/steps/items.");
  }
  const names = new Set();
  for (const item of items) {
    assertJsonObject("Founder journey funnel item", item);
    const rawName = readField(item, ["key", "step", "name"]);
    if (!isNonEmptyString(rawName)) {
      throw new Error("Founder journey funnel item thiếu key/step/name.");
    }
    names.add(String(rawName).toLowerCase());
    assertNumberField(item, ["total", "count"], "Founder journey funnel item");
  }
  const required = ["discover", "join", "learn", "submit", "prove", "next"];
  for (const key of required) {
    if (!names.has(key)) {
      throw new Error(`Founder journey funnel thiếu bước ${key}.`);
    }
  }
}

function assertDomainSummaryShape(json) {
  assertJsonObject("Founder domains", json);
  const items = asArray(json, ["items", "domains"]);
  if (!items || !items.length) {
    throw new Error("Founder domains cần mảng items/domains.");
  }
  for (const item of items) {
    assertJsonObject("Founder domain item", item);
    assertStringField(item, ["domain", "key", "name"], "Founder domain item");
  }
}

function assertLearningSummaryShape(json) {
  assertJsonObject("Founder learning summary", json);
  assertNumberField(json, ["courses_live", "coursesLive"], "Founder learning summary");
  assertNumberField(json, ["lessons_completed", "lessonsCompleted"], "Founder learning summary");
  assertNumberField(json, ["submissions_today", "submissionsToday"], "Founder learning summary");
  assertNumberField(json, ["review_backlog", "reviewBacklog"], "Founder learning summary");
}

function assertVcSummaryShape(json) {
  assertJsonObject("Founder VC summary", json);
  assertNumberField(json, ["issued_count", "issuedCount"], "Founder VC summary");
  assertNumberField(json, ["failure_count", "failureCount"], "Founder VC summary");
  assertNumberField(json, ["backlog"], "Founder VC summary");
}

function assertReviewQueueShape(json) {
  assertJsonArrayOrObject("Founder review queue", json);
  const items = asArray(json, ["items", "submissions"]) || (Array.isArray(json) ? json : null);
  if (!items) {
    throw new Error("Founder review queue cần array hoặc object.items.");
  }
}

function assertInsightsShape(json) {
  assertJsonObject("Founder insights", json);
  const items = asArray(json, ["items"]);
  if (!items) {
    throw new Error("Founder insights cần trường items.");
  }
  for (const item of items) {
    assertJsonObject("Founder insight item", item);
    assertStringField(item, ["id"], "Founder insight item");
    assertStringField(item, ["type"], "Founder insight item");
    assertStringField(item, ["title"], "Founder insight item");
    assertArrayField(item, ["evidence"], "Founder insight item");
    assertArrayField(item, ["recommendation", "recommendations"], "Founder insight item");
    assertStringField(item, ["risk_level", "riskLevel"], "Founder insight item");
    const confidence = readField(item, ["confidence"]);
    if (confidence !== undefined && (typeof confidence !== "number" || Number.isNaN(confidence))) {
      throw new Error("Founder insight item có confidence không hợp lệ.");
    }
  }
}

function assertInsightsQueryShape(json) {
  assertJsonObject("Founder insights query", json);
  assertStringField(json, ["summary"], "Founder insights query");
  assertArrayField(json, ["evidence"], "Founder insights query");
  assertArrayField(json, ["recommendations"], "Founder insights query");
  assertArrayField(json, ["actions"], "Founder insights query");
}

function assertRecommendedActionsShape(json) {
  assertJsonArrayOrObject("Founder recommended actions", json);
  const items = asArray(json, ["items", "actions"]) || (Array.isArray(json) ? json : null);
  if (!items) {
    throw new Error("Founder recommended actions cần array hoặc object.items/actions.");
  }
}

function assertIncidentsShape(json) {
  assertJsonArrayOrObject("Founder incidents", json);
  const items = asArray(json, ["items", "incidents"]) || (Array.isArray(json) ? json : null);
  if (!items) {
    throw new Error("Founder incidents cần array hoặc object.items/incidents.");
  }
}

function assertAuditLogShape(json) {
  assertJsonArrayOrObject("Founder audit log", json);
  const items = asArray(json, ["items", "events"]) || (Array.isArray(json) ? json : null);
  if (!items) {
    throw new Error("Founder audit log cần array hoặc object.items/events.");
  }
}

function assertDeploymentsShape(json) {
  assertJsonArrayOrObject("Founder deployments", json);
  const items = asArray(json, ["items", "deployments"]) || (Array.isArray(json) ? json : null);
  if (!items) {
    throw new Error("Founder deployments cần array hoặc object.items/deployments.");
  }
}

function assertAutopilotObserveShape(json) {
  assertJsonObject("Autopilot observe", json);
  const hasSignals = ["snapshot", "metrics", "signals", "sources"].some((key) => key in json);
  if (!hasSignals) {
    throw new Error("Autopilot observe cần ít nhất một trong các trường snapshot/metrics/signals/sources.");
  }
}

function assertAutopilotAnalyzeShape(json) {
  assertJsonObject("Autopilot analyze", json);
  assertArrayField(json, ["findings"], "Autopilot analyze");
  assertArrayField(json, ["anomalies"], "Autopilot analyze");
  assertArrayField(json, ["bottlenecks"], "Autopilot analyze");
}

function assertAutopilotRecommendShape(json) {
  assertJsonObject("Autopilot recommend", json);
  assertArrayField(json, ["recommendations"], "Autopilot recommend");
  for (const item of json.recommendations) {
    assertJsonObject("Autopilot recommendation", item);
    assertStringField(item, ["id"], "Autopilot recommendation");
    assertStringField(item, ["title"], "Autopilot recommendation");
    assertStringField(item, ["tier"], "Autopilot recommendation");
    const confidence = readField(item, ["confidence"]);
    if (confidence !== undefined && (typeof confidence !== "number" || Number.isNaN(confidence))) {
      throw new Error("Autopilot recommendation có confidence không hợp lệ.");
    }
  }
}

function normalizeBaseUrl(input) {
  return String(input || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function parseCliArgs(argv) {
  const options = {
    baseUrl: normalizeBaseUrl(DEFAULT_BASE_URL),
    authHeader: process.env.VTL_FOUNDER_AUTH_HEADER || "",
    authValue: process.env.VTL_FOUNDER_AUTH_VALUE || "",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    selfTest: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base-url") {
      options.baseUrl = normalizeBaseUrl(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--auth-header") {
      options.authHeader = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (arg === "--auth-value") {
      options.authValue = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[index + 1] || DEFAULT_TIMEOUT_MS);
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

function usageText(commandName, summary) {
  return [
    `${commandName}`,
    "",
    summary,
    "",
    "Tuy chon:",
    "  --base-url <url>      Base URL cua runtime founder/autopilot. Mac dinh: https://member.vetuonglai.com",
    "  --auth-header <name>  Header auth neu can validate shape tren route bao ve.",
    "  --auth-value <value>  Gia tri auth header.",
    "  --timeout-ms <ms>     Timeout cho moi request. Mac dinh: 10000",
    "  --self-test           Chay validator mau, khong goi mang.",
    "  --help                Hien huong dan.",
    "",
    "ENV ho tro:",
    "  VTL_FOUNDER_BASE_URL",
    "  VTL_FOUNDER_AUTH_HEADER",
    "  VTL_FOUNDER_AUTH_VALUE",
    "  VTL_FOUNDER_TIMEOUT_MS",
  ].join("\n");
}

function compactRows(rows) {
  return rows.map((row) => ({
    name: row.name,
    method: row.method,
    path: row.path,
    status: row.status,
    ok: row.ok,
    note: row.note,
  }));
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

const founderRuntimeRequirements = [
  "Runtime phải expose đầy đủ route /api/founder/* và /api/autopilot/* theo spec mới.",
  "Nếu route được bảo vệ, Team 1 phải cấp auth header + auth value dùng cho founder lane.",
  "Các route read/query phải trả JSON parse được; strict check yêu cầu status 200.",
  "Các route action nguy hiểm phải chặn request thiếu approval hoặc high-risk action ngoài whitelist.",
];

const founderReleaseEvidenceMinimum = [
  "Self-test của founder scripts pass.",
  "Smoke founder/autopilot pass trên runtime deploy thật.",
  "Strict founder/autopilot pass trên runtime deploy thật với auth hợp lệ.",
  "Có ảnh/chứng cứ hoặc log cho overview, insights, action guardrail, autopilot analyze/recommend.",
  "Có một lần chứng minh action high-risk bị chặn và một lần chứng minh route read/query trả shape đúng.",
  "Có base URL runtime, thời điểm verify, và version/environment trong gói release evidence.",
];

const founderReleaseSteps = [
  {
    key: "self_test",
    label: "Chạy self-test cục bộ cho founder scripts",
    command: "node scripts/verify-founder-lane-release.mjs --self-test",
  },
  {
    key: "smoke_runtime",
    label: "Chạy smoke founder/autopilot trên runtime deploy thật",
    command: "node scripts/smoke-founder-panel-runtime.mjs --base-url <runtime-url>",
  },
  {
    key: "strict_runtime",
    label: "Chạy strict founder/autopilot với auth hợp lệ",
    command: "node scripts/check-founder-panel-contract.mjs --base-url <runtime-url> --auth-header <name> --auth-value <value>",
  },
  {
    key: "release_gate",
    label: "Đối chiếu evidence tối thiểu trước khi coi founder lane ready",
    command: "node scripts/verify-founder-lane-release.mjs --base-url <runtime-url> --auth-header <name> --auth-value <value>",
  },
];

function buildHeaders(options, check) {
  const headers = {
    accept: "application/json",
    ...(check.method === "POST" ? { "content-type": "application/json" } : {}),
  };

  if (options.authHeader && options.authValue) {
    headers[options.authHeader] = options.authValue;
  }

  return headers;
}

function requestWithCurl(url, options, check, fetchError) {
  const timeoutSeconds = Math.max(1, Math.ceil(options.timeoutMs / 1000));
  const args = [
    "-s",
    "-L",
    "--max-time",
    String(timeoutSeconds),
    "-X",
    check.method,
    "-H",
    "Accept: application/json, text/plain;q=0.8,*/*;q=0.6",
  ];

  if (check.method === "POST") {
    args.push("-H", "Content-Type: application/json");
  }
  if (options.authHeader && options.authValue) {
    args.push("-H", `${options.authHeader}: ${options.authValue}`);
  }
  if (check.body !== undefined) {
    args.push("--data", JSON.stringify(check.body));
  }

  args.push(
    "-w",
    "\n__VTL_HTTP_STATUS__:%{http_code}",
    url,
  );

  try {
    const output = execFileSync("curl", args, {
      encoding: "utf8",
      timeout: options.timeoutMs + 1000,
      maxBuffer: 10 * 1024 * 1024,
    });
    const marker = "\n__VTL_HTTP_STATUS__:";
    const markerIndex = output.lastIndexOf(marker);
    const bodyText = markerIndex === -1 ? output : output.slice(0, markerIndex);
    const statusText = markerIndex === -1 ? "0" : output.slice(markerIndex + marker.length).trim();
    const status = Number(statusText || 0);
    let json = null;
    try {
      json = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      json = null;
    }

    return {
      status,
      ok: status >= 200 && status < 300,
      bodyText,
      json,
      error: "",
      transport: "curl_fallback",
    };
  } catch (error) {
    const stderrText = error && typeof error === "object" && "stderr" in error
      ? String(error.stderr || "").trim()
      : "";
    const exitCode = error && typeof error === "object" && "status" in error
      ? Number(error.status)
      : NaN;
    const compactError = stderrText
      ? stderrText.split("\n").slice(-1)[0]
      : Number.isFinite(exitCode)
        ? `curl_exit_${exitCode}`
        : (error instanceof Error ? error.message.split("\n").slice(-1)[0] : String(error));
    return {
      status: 0,
      ok: false,
      bodyText: "",
      json: null,
      error: `${fetchError}; curl fallback failed: ${compactError}`,
      transport: "fetch_failed_curl_failed",
    };
  }
}

async function requestCheck(baseUrl, options, check) {
  const url = new URL(check.path, `${baseUrl}/`);
  if (check.searchParams) {
    for (const [key, value] of Object.entries(check.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  let response;
  let bodyText = "";
  let json = null;
  let transport = "fetch";
  let transportError = "";

  try {
    response = await fetch(url, {
      method: check.method,
      headers: buildHeaders(options, check),
      body: check.body !== undefined ? JSON.stringify(check.body) : undefined,
      redirect: "follow",
      signal: controller.signal,
    });
    bodyText = await response.text();
    if (bodyText) {
      try {
        json = JSON.parse(bodyText);
      } catch (error) {
        transportError = error instanceof Error ? error.message : String(error);
      }
    }
  } catch (error) {
    const fetchError = error instanceof Error ? error.message : String(error);
    const fallback = requestWithCurl(url.toString(), options, check, fetchError);
    response = {
      status: fallback.status,
      ok: fallback.ok,
    };
    bodyText = fallback.bodyText;
    json = fallback.json;
    transport = fallback.transport;
    transportError = fallback.error;
  }

  clearTimeout(timer);

  let ok = true;
  let note = "";

  if (!check.acceptedStatuses.includes(response.status)) {
    ok = false;
    note = transportError || `status ${response.status} khong nam trong tap cho phep ${check.acceptedStatuses.join(", ")}`;
  }

  if (ok && response.status !== 204 && bodyText && !json) {
    ok = false;
    note = `response khong parse duoc JSON: ${transportError}`;
  }

  if (ok && json && response.status >= 400 && check.expectErrorJson !== false) {
    try {
      assertErrorLikeJson(check.name, json);
    } catch (error) {
      ok = false;
      note = error instanceof Error ? error.message : String(error);
    }
  }

  if (ok && response.ok && check.successValidator) {
    try {
      check.successValidator(json);
    } catch (error) {
      ok = false;
      note = error instanceof Error ? error.message : String(error);
    }
  }

  if (ok && check.guardrail === "must_not_succeed") {
    const statusText = String(json?.status || "").toLowerCase();
    const denied = json?.success === false
      || json?.allowed === false
      || /denied|rejected|forbidden|not_allowed|guardrail|invalid|failed/.test(statusText);
    if (response.status >= 200 && response.status < 300 && !denied) {
      ok = false;
      note = `${check.name} dang cho phep request ma script mong doi phai bi chan.`;
    }
  }

  if (ok && transport === "curl_fallback") {
    note = note ? `${note} | fetch fallback qua curl do sandbox/network resolver` : "fetch fallback qua curl do sandbox/network resolver";
  }

  return {
    name: check.name,
    path: url.pathname + url.search,
    method: check.method,
    status: response.status,
    ok,
    note,
  };
}

async function runCheckSuite(checks, options) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const rows = [];
  let failed = false;

  for (const check of checks) {
    let row = await requestCheck(options.baseUrl, options, check);
    if (!row.ok && row.status === 0 && /fetch failed|curl fallback failed/.test(String(row.note || ""))) {
      await wait(250);
      const retryRow = await requestCheck(options.baseUrl, options, check);
      if (retryRow.ok || retryRow.status !== 0) {
        row = {
          ...retryRow,
          note: retryRow.note ? `${retryRow.note} | retry_after_transport_failure` : "retry_after_transport_failure",
        };
      }
    }
    rows.push(row);
    if (!row.ok) {
      failed = true;
    }
  }

  return { rows, failed };
}

const smokeChecks = [
  {
    name: "Founder overview",
    method: "GET",
    path: "/api/founder/overview",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertOverviewShape,
  },
  {
    name: "Founder system health",
    method: "GET",
    path: "/api/founder/system-health",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertSystemHealthShape,
  },
  {
    name: "Founder journey funnel",
    method: "GET",
    path: "/api/founder/journey-funnel",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertJourneyFunnelShape,
  },
  {
    name: "Founder domains",
    method: "GET",
    path: "/api/founder/domains",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertDomainSummaryShape,
  },
  {
    name: "Founder learning summary",
    method: "GET",
    path: "/api/founder/learning-summary",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertLearningSummaryShape,
  },
  {
    name: "Founder VC summary",
    method: "GET",
    path: "/api/founder/vc-summary",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertVcSummaryShape,
  },
  {
    name: "Founder review queue",
    method: "GET",
    path: "/api/founder/review-queue",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertReviewQueueShape,
  },
  {
    name: "Founder insights list",
    method: "GET",
    path: "/api/founder/insights",
    searchParams: { type: "critical", limit: "5" },
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertInsightsShape,
  },
  {
    name: "Founder insights query",
    method: "POST",
    path: "/api/founder/insights/query",
    body: { query: "what should we fix today" },
    acceptedStatuses: [200, 401, 403, 422, 429],
    successValidator: assertInsightsQueryShape,
  },
  {
    name: "Founder recommended actions",
    method: "GET",
    path: "/api/founder/actions/recommended",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertRecommendedActionsShape,
  },
  {
    name: "Founder apply guardrail",
    method: "POST",
    path: "/api/founder/actions/apply",
    body: { action_id: "act_simple_submit_mode" },
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Founder rollback guardrail",
    method: "POST",
    path: "/api/founder/actions/rollback",
    body: {},
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Founder incidents",
    method: "GET",
    path: "/api/founder/incidents",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertIncidentsShape,
  },
  {
    name: "Founder audit log",
    method: "GET",
    path: "/api/founder/audit-log",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertAuditLogShape,
  },
  {
    name: "Founder deployments",
    method: "GET",
    path: "/api/founder/deployments",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertDeploymentsShape,
  },
  {
    name: "Autopilot observe",
    method: "GET",
    path: "/api/autopilot/observe",
    acceptedStatuses: [200, 401, 403, 429],
    successValidator: assertAutopilotObserveShape,
  },
  {
    name: "Autopilot analyze",
    method: "POST",
    path: "/api/autopilot/analyze",
    body: { window: "7d", compare_to: "prev_7d" },
    acceptedStatuses: [200, 401, 403, 422, 429],
    successValidator: assertAutopilotAnalyzeShape,
  },
  {
    name: "Autopilot recommend",
    method: "POST",
    path: "/api/autopilot/recommend",
    body: { finding_ids: ["find_01", "find_02"] },
    acceptedStatuses: [200, 401, 403, 422, 429],
    successValidator: assertAutopilotRecommendShape,
  },
  {
    name: "Autopilot execute high-risk guardrail",
    method: "POST",
    path: "/api/autopilot/execute",
    body: { action_id: "act_change_pricing" },
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Autopilot verify guardrail",
    method: "POST",
    path: "/api/autopilot/verify",
    body: {},
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
];

const strictChecks = [
  {
    name: "Founder overview",
    method: "GET",
    path: "/api/founder/overview",
    acceptedStatuses: [200],
    successValidator: assertOverviewShape,
  },
  {
    name: "Founder system health",
    method: "GET",
    path: "/api/founder/system-health",
    acceptedStatuses: [200],
    successValidator: assertSystemHealthShape,
  },
  {
    name: "Founder journey funnel",
    method: "GET",
    path: "/api/founder/journey-funnel",
    acceptedStatuses: [200],
    successValidator: assertJourneyFunnelShape,
  },
  {
    name: "Founder domains",
    method: "GET",
    path: "/api/founder/domains",
    acceptedStatuses: [200],
    successValidator: assertDomainSummaryShape,
  },
  {
    name: "Founder learning summary",
    method: "GET",
    path: "/api/founder/learning-summary",
    acceptedStatuses: [200],
    successValidator: assertLearningSummaryShape,
  },
  {
    name: "Founder VC summary",
    method: "GET",
    path: "/api/founder/vc-summary",
    acceptedStatuses: [200],
    successValidator: assertVcSummaryShape,
  },
  {
    name: "Founder review queue",
    method: "GET",
    path: "/api/founder/review-queue",
    acceptedStatuses: [200],
    successValidator: assertReviewQueueShape,
  },
  {
    name: "Founder insights list",
    method: "GET",
    path: "/api/founder/insights",
    searchParams: { type: "critical", limit: "5" },
    acceptedStatuses: [200],
    successValidator: assertInsightsShape,
  },
  {
    name: "Founder insights query",
    method: "POST",
    path: "/api/founder/insights/query",
    body: { query: "what should we fix today" },
    acceptedStatuses: [200],
    successValidator: assertInsightsQueryShape,
  },
  {
    name: "Founder recommended actions",
    method: "GET",
    path: "/api/founder/actions/recommended",
    acceptedStatuses: [200],
    successValidator: assertRecommendedActionsShape,
  },
  {
    name: "Founder apply guardrail",
    method: "POST",
    path: "/api/founder/actions/apply",
    body: { action_id: "act_simple_submit_mode" },
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Founder rollback guardrail",
    method: "POST",
    path: "/api/founder/actions/rollback",
    body: {},
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Founder incidents",
    method: "GET",
    path: "/api/founder/incidents",
    acceptedStatuses: [200],
    successValidator: assertIncidentsShape,
  },
  {
    name: "Founder audit log",
    method: "GET",
    path: "/api/founder/audit-log",
    acceptedStatuses: [200],
    successValidator: assertAuditLogShape,
  },
  {
    name: "Founder deployments",
    method: "GET",
    path: "/api/founder/deployments",
    acceptedStatuses: [200],
    successValidator: assertDeploymentsShape,
  },
  {
    name: "Autopilot observe",
    method: "GET",
    path: "/api/autopilot/observe",
    acceptedStatuses: [200],
    successValidator: assertAutopilotObserveShape,
  },
  {
    name: "Autopilot analyze",
    method: "POST",
    path: "/api/autopilot/analyze",
    body: { window: "7d", compare_to: "prev_7d" },
    acceptedStatuses: [200],
    successValidator: assertAutopilotAnalyzeShape,
  },
  {
    name: "Autopilot recommend",
    method: "POST",
    path: "/api/autopilot/recommend",
    body: { finding_ids: ["find_01", "find_02"] },
    acceptedStatuses: [200],
    successValidator: assertAutopilotRecommendShape,
  },
  {
    name: "Autopilot execute high-risk guardrail",
    method: "POST",
    path: "/api/autopilot/execute",
    body: { action_id: "act_change_pricing" },
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
  {
    name: "Autopilot verify guardrail",
    method: "POST",
    path: "/api/autopilot/verify",
    body: {},
    acceptedStatuses: [400, 401, 403, 422, 429],
    guardrail: "must_not_succeed",
  },
];

function runSelfTest() {
  assertOverviewShape({
    environment: "production",
    version: "v1.0.0",
    system_health: { hub: { status: "OK" } },
    journey_summary: { activated_users: 12 },
    domain_summary: { hub: { traffic: 100 } },
    critical_alerts: [],
  });

  assertInsightsShape({
    items: [
      {
        id: "ins_001",
        type: "critical",
        title: "Submission drop after lesson 2",
        confidence: 0.84,
        evidence: ["mobile submit completion fell"],
        recommendation: ["Enable simple submit form"],
        risk_level: "R2",
      },
    ],
  });

  assertInsightsQueryShape({
    summary: "Fix mobile submit friction first.",
    evidence: ["submit conversion down 18%"],
    recommendations: ["Enable simple submit form"],
    actions: ["act_simple_submit_mode"],
  });

  assertAutopilotAnalyzeShape({
    findings: [],
    anomalies: [],
    bottlenecks: [],
  });

  assertAutopilotRecommendShape({
    recommendations: [
      {
        id: "rec_01",
        title: "Simplify mobile submission",
        tier: "LOW_RISK",
        confidence: 0.81,
      },
    ],
  });
}

export {
  DEFAULT_RELEASE_WINDOW,
  DEFAULT_BASE_URL,
  assertOverviewShape,
  assertInsightsShape,
  assertInsightsQueryShape,
  assertAutopilotAnalyzeShape,
  assertAutopilotRecommendShape,
  compactRows,
  founderReleaseEvidenceMinimum,
  founderReleaseSteps,
  founderRuntimeRequirements,
  parseCliArgs,
  usageText,
  runCheckSuite,
  runSelfTest,
  smokeChecks,
  strictChecks,
  summarizeRows,
};
