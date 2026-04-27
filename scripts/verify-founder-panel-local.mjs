import { maybeHandleFounderRuntime } from "../workers/lib/founder-runtime.mjs";

const env = {
  ENVIRONMENT_NAME: "production",
  PAY_IAI_ONE_API_KEY: "local-test-key",
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(method, path, body, headers = {}) {
  const response = await maybeHandleFounderRuntime(
    new Request(`https://member.vetuonglai.com${path}`, {
      method,
      headers: {
        accept: "application/json",
        ...(body ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
    env,
  );

  const json = await response.json();
  return { response, json };
}

async function main() {
  const overview = await request("GET", "/api/founder/overview");
  assert(overview.response.status === 200, "overview phải trả 200");
  assert(Array.isArray(overview.json.system_health?.items), "overview.system_health.items phải là mảng");
  assert(Array.isArray(overview.json.domain_summary?.items), "overview.domain_summary.items phải là mảng");
  assert(typeof overview.json.panel_contract?.version === "string", "overview phải có panel_contract.version");
  assert(typeof overview.json.metrics_registry?.version === "string", "overview phải có metrics_registry.version");
  assert(typeof overview.json.action_registry?.version === "string", "overview phải có action_registry.version");

  const journey = await request("GET", "/api/founder/journey-funnel");
  assert(journey.response.status === 200, "journey-funnel phải trả 200");
  const funnelKeys = new Set((journey.json.funnel || []).map((item) => item.key));
  for (const key of ["discover", "join", "learn", "submit", "prove", "next"]) {
    assert(funnelKeys.has(key), `journey-funnel thiếu bước ${key}`);
  }

  const insights = await request("GET", "/api/founder/insights");
  assert(insights.response.status === 200, "insights phải trả 200");
  assert(Array.isArray(insights.json.items), "insights.items phải là mảng");
  assert(insights.json.items.length >= 1, "insights.items phải có ít nhất 1 seed");

  const recommended = await request("GET", "/api/founder/actions/recommended");
  assert(recommended.response.status === 200, "actions/recommended phải trả 200");
  assert(Array.isArray(recommended.json.items), "recommended actions phải là mảng");
  assert(recommended.json.items.some((item) => item.action_id === "act_simple_submit_mode"), "recommended actions phải có act_simple_submit_mode");

  const observe = await request("GET", "/api/autopilot/observe");
  assert(observe.response.status === 200, "autopilot/observe phải trả 200");
  for (const key of ["snapshot", "metrics", "signals", "sources"]) {
    assert(key in observe.json, `autopilot/observe thiếu ${key}`);
  }

  const missingApproval = await request(
    "POST",
    "/api/founder/actions/apply",
    { action_id: "act_simple_submit_mode" },
    { "x-founder-role": "founder" },
  );
  assert(missingApproval.response.status === 422, "apply thiếu approved_by phải trả 422");

  const applyAlias = await request(
    "POST",
    "/api/founder/actions/apply",
    {
      action_id: "act_disable_invest_cta_public",
      approved_by: "founder_local",
      reason: "lock unsafe invest cta",
    },
    { "x-founder-role": "founder" },
  );
  assert(applyAlias.response.status === 202, "apply alias action cũ phải trả 202");
  assert(applyAlias.json.feature_flags?.invest_public_cta_enabled === false, "alias action phải tắt invest_public_cta_enabled");

  const verifyMissingExecution = await request(
    "POST",
    "/api/autopilot/verify",
    {},
    { "x-founder-role": "founder" },
  );
  assert(verifyMissingExecution.response.status === 422, "verify thiếu execution_id phải trả 422");

  const verifyApplied = await request(
    "POST",
    "/api/autopilot/verify",
    { execution_id: applyAlias.json.execution_id },
    { "x-founder-role": "founder" },
  );
  assert(verifyApplied.response.status === 200, "verify action đã chạy phải trả 200");
  assert(typeof verifyApplied.json.result === "string", "verify phải có result");

  const rollbackApplied = await request(
    "POST",
    "/api/founder/actions/rollback",
    { execution_id: applyAlias.json.execution_id },
    { "x-founder-role": "founder" },
  );
  assert(rollbackApplied.response.status === 202, "rollback phải trả 202");
  assert(rollbackApplied.json.feature_flags?.invest_public_cta_enabled === true, "rollback phải bật lại invest_public_cta_enabled");

  const autopilotBlocked = await request(
    "POST",
    "/api/autopilot/execute",
    {
      action_id: "act_promote_finance_entry_block",
      approved_by: "autopilot_local",
      reason: "local guardrail probe",
    },
    { "x-founder-role": "autopilot" },
  );
  assert(autopilotBlocked.response.status === 403, "autopilot ở assisted mode phải bị chặn");

  console.log("verify-founder-panel-local: ok");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
