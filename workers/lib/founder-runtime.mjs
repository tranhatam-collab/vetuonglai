import accessModel from "../../src/data/access-model.json" with { type: "json" };
import courses from "../../src/data/courses.json" with { type: "json" };
import founderActionRegistrySource from "../../src/data/founder-action-registry.json" with { type: "json" };
import founderAutopilotSeeds from "../../src/data/founder-autopilot-seeds.json" with { type: "json" };
import founderCommandPanel from "../../src/data/founder-command-panel.json" with { type: "json" };
import founderMetricsRegistrySource from "../../src/data/founder-metrics-registry.json" with { type: "json" };
import system from "../../src/data/system.json" with { type: "json" };
import systemRegistry from "../../src/data/system-registry.json" with { type: "json" };
import team3PolicyMatrix from "../../src/data/team3-policy-matrix.json" with { type: "json" };
import runtimeTruth from "../../cloudflare/domain-runtime-truth.json" with { type: "json" };
import { createAccessStore } from "./access-state.mjs";

const FOUNDER_BASE = "/api/founder";
const AUTOPILOT_BASE = "/api/autopilot";
const STATE_PREFIX = "founder_panel";
const SNAPSHOT_KEY = "overview_snapshot";
const ACTIONS_KEY = "action_history";
const AUDIT_KEY = "audit_log";
const INCIDENTS_KEY = "incidents";
const FEATURES_KEY = "feature_flags";
const INSIGHTS_KEY = "insights";
const AUTOPILOT_MODE_KEY = "autopilot_mode";
const DEPLOYMENTS_KEY = "deployments";
const DEFAULT_AUTOPILOT_MODE = "assisted";

const domainMissionLookup = new Map(
  (systemRegistry.domains || []).map((entry) => [String(entry?.key || ""), entry]),
);

const domainHostToKey = new Map(
  (systemRegistry.domains || [])
    .filter((entry) => entry?.host && entry?.key)
    .map((entry) => [String(entry.host), String(entry.key)]),
);

const founderPanelBlocks = new Map(
  (founderCommandPanel.panel?.blocks || []).map((block) => [String(block?.key || ""), block]),
);

const founderSystemHealthCards = new Map(
  ((founderPanelBlocks.get("system_health")?.cards) || []).map((card) => [String(card?.key || ""), card]),
);

const actionIdAliases = new Map([
  ["act_disable_invest_cta_public", "act_disable_invest_public_cta"],
  ["act_boost_review_queue", "act_force_content_review_queue_boost"],
  ["act_lock_broken_public_route", "act_lock_broken_cta_route"],
]);

const actionRegistry = (founderActionRegistrySource.registry || []).map(normalizeActionRegistryEntry);
const actionRegistryById = new Map();
for (const entry of actionRegistry) {
  actionRegistryById.set(entry.action_id, entry);
}
for (const [alias, canonical] of actionIdAliases.entries()) {
  const action = actionRegistry.find((entry) => entry.action_id === canonical);
  if (action) {
    actionRegistryById.set(alias, action);
  }
}

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers,
  });
}

async function readRequestJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function isoNow() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function getEnvString(env, key) {
  const value = env?.[key];
  return typeof value === "string" ? value : "";
}

function toNumber(value, fallback = 0) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function clampConfidence(value) {
  const normalized = toNumber(value, 0);
  if (normalized < 0) return 0;
  if (normalized > 1) return 1;
  return normalized;
}

function normalizeActionRegistryEntry(entry = {}) {
  return {
    action_id: String(entry.actionId || ""),
    name: String(entry.nameEn || entry.nameVi || entry.actionId || ""),
    name_vi: String(entry.nameVi || entry.nameEn || entry.actionId || ""),
    name_en: String(entry.nameEn || entry.nameVi || entry.actionId || ""),
    tier: String(entry.tier || "LOW_RISK"),
    description: String(entry.descriptionEn || entry.descriptionVi || ""),
    description_vi: String(entry.descriptionVi || entry.descriptionEn || ""),
    description_en: String(entry.descriptionEn || entry.descriptionVi || ""),
    rollback_supported: Boolean(entry.rollbackSupported),
    enabled: entry.enabled !== false,
    expected_effect: Array.isArray(entry.expectedMetricKeys) && entry.expectedMetricKeys.length > 0
      ? `metrics: ${entry.expectedMetricKeys.join(", ")}`
      : "",
    expected_metric_keys: Array.isArray(entry.expectedMetricKeys) ? entry.expectedMetricKeys : [],
    scope_domains: Array.isArray(entry.scopeDomains) ? entry.scopeDomains : [],
    control_type: String(entry.controlType || ""),
    flag_key: String(entry.flagKey || ""),
    priority_key: String(entry.priorityKey || ""),
    queue_key: String(entry.queueKey || ""),
    allowed_roles: Array.isArray(entry.allowedRoles) ? entry.allowedRoles : [],
    autopilot_eligible: entry.autopilotEligible === true,
    forbidden_if: Array.isArray(entry.forbiddenIf) ? entry.forbiddenIf : [],
  };
}

function normalizeActionId(actionId) {
  const raw = String(actionId || "");
  return actionIdAliases.get(raw) || raw;
}

function resolveAction(actionId) {
  return actionRegistryById.get(String(actionId || "")) || actionRegistryById.get(normalizeActionId(actionId)) || null;
}

function mapInsightSeed(seed = {}) {
  const affectedDomains = Array.isArray(seed.affectedArea) ? seed.affectedArea : [];
  return {
    id: String(seed.id || createId("ins")),
    is_sample: seed.isSample === true,
    type: String(seed.type || "operational"),
    title: String(seed.titleEn || seed.titleVi || seed.id || ""),
    title_vi: String(seed.titleVi || seed.titleEn || seed.id || ""),
    title_en: String(seed.titleEn || seed.titleVi || seed.id || ""),
    summary: String(seed.summaryVi || seed.summaryEn || ""),
    summary_vi: String(seed.summaryVi || seed.summaryEn || ""),
    summary_en: String(seed.summaryEn || seed.summaryVi || ""),
    explanation: String(seed.summaryEn || seed.summaryVi || ""),
    confidence: clampConfidence(seed.confidence),
    evidence: Array.isArray(seed.evidence) ? seed.evidence : [],
    recommendation: Array.isArray(seed.recommendations) ? seed.recommendations : [],
    recommendations: Array.isArray(seed.recommendations) ? seed.recommendations : [],
    risk_level: String(seed.riskLevel || "R2"),
    affected_area: affectedDomains.join(", "),
    affected_domains: affectedDomains,
    action_ids: (Array.isArray(seed.relatedActionIds) ? seed.relatedActionIds : []).map(normalizeActionId),
  };
}

function mapIncidentSeed(seed = {}) {
  return {
    id: String(seed.id || createId("inc")),
    is_sample: seed.isSample === true,
    severity: String(seed.severity || "P2"),
    title: String(seed.titleEn || seed.titleVi || seed.id || ""),
    title_vi: String(seed.titleVi || seed.titleEn || seed.id || ""),
    title_en: String(seed.titleEn || seed.titleVi || seed.id || ""),
    description: String(seed.descriptionVi || seed.descriptionEn || ""),
    description_vi: String(seed.descriptionVi || seed.descriptionEn || ""),
    description_en: String(seed.descriptionEn || seed.descriptionVi || ""),
    domain: String(seed.domain || ""),
    status: String(seed.status || "open"),
    owner_role: String(seed.ownerRole || ""),
    owner_id: "",
    root_hypothesis: String(seed.rootHypothesisVi || seed.rootHypothesisEn || ""),
    related_insight_id: String(seed.relatedInsightId || ""),
    action_ids: (Array.isArray(seed.relatedActionIds) ? seed.relatedActionIds : []).map(normalizeActionId),
    created_at: isoNow(),
  };
}

function store(env) {
  return createAccessStore(env);
}

async function readState(env, key, fallback) {
  const value = await store(env).get(STATE_PREFIX, key);
  return value ?? fallback;
}

async function writeState(env, key, value) {
  await store(env).put(STATE_PREFIX, key, value);
  return value;
}

async function appendStateList(env, key, item, maxItems = 100) {
  const current = await readState(env, key, []);
  const next = [item, ...current].slice(0, maxItems);
  await writeState(env, key, next);
  return next;
}

function runtimeStatusToHealth(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "live") return "OK";
  if (normalized === "staged_public" || normalized === "planned_public") return "Warning";
  return "Critical";
}

function healthItem(key, label, runtimeStatus, extras = {}) {
  const card = founderSystemHealthCards.get(String(key || ""));
  return {
    key,
    label: extras.label || card?.labelVi || label,
    label_vi: card?.labelVi || label,
    label_en: card?.labelEn || label,
    scope_state: extras.scope_state || card?.scopeState || "active",
    status: extras.status || runtimeStatusToHealth(runtimeStatus),
    latency_ms: extras.latency_ms ?? 0,
    errors_last_1h: extras.errors_last_1h ?? 0,
    last_incident_time: extras.last_incident_time || "",
    runtime_status: runtimeStatus || "unknown",
  };
}

function buildSystemHealth(env, incidents = []) {
  const runtimeByHost = new Map(
    (runtimeTruth.domains || []).map((entry) => [String(entry.host), entry]),
  );
  const memberRuntime = runtimeByHost.get("member.vetuonglai.com");
  const hubRuntime = runtimeByHost.get("vetuonglai.com");
  const vcRuntime = runtimeByHost.get("vc.vetuonglai.com");
  const eduRuntime = runtimeByHost.get("edu.vetuonglai.com");
  const financeRuntime = runtimeByHost.get("finance.vetuonglai.com");
  const lifeRuntime = runtimeByHost.get("life.vetuonglai.com");
  const investRuntime = runtimeByHost.get("invest.vetuonglai.com");
  const greenRuntime = runtimeByHost.get("green.vetuonglai.com");
  const lastIncidentTime = incidents[0]?.created_at || "";

  return [
    healthItem("hub", "Hub", hubRuntime?.status || "unknown", {
      latency_ms: 148,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("member", "Member", memberRuntime?.status || "unknown", {
      status: memberRuntime?.requiredPublic ? "OK" : "Warning",
      latency_ms: 214,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("edu", "EDU", eduRuntime?.status || "unknown", {
      latency_ms: 176,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("submission", "Submission", "workflow_active", {
      status: accessModel.submissionWorkflow ? "OK" : "Critical",
      latency_ms: 242,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("vc", "VC", vcRuntime?.status || "unknown", {
      latency_ms: 162,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("dashboard", "Dashboard", memberRuntime?.status || "unknown", {
      status: memberRuntime?.requiredPublic ? "OK" : "Warning",
      latency_ms: 196,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("journey_engine", "Journey Engine", memberRuntime?.status || "unknown", {
      status: memberRuntime?.requiredPublic ? "OK" : "Warning",
      latency_ms: 205,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("payment_access", "Payment / Access", "runtime_enabled", {
      status: getEnvString(env, "PAY_IAI_ONE_API_KEY") ? "OK" : "Warning",
      latency_ms: 268,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("search", "Search", "not_in_scope", {
      status: "Not in scope",
      latency_ms: 0,
      errors_last_1h: 0,
      last_incident_time: "",
    }),
    healthItem("ai_layer", "AI layer", "manual_seed", {
      status: "Warning",
      latency_ms: 0,
      errors_last_1h: 0,
      last_incident_time: "",
    }),
    healthItem("life", "LIFE", lifeRuntime?.status || "unknown", {
      status: lifeRuntime?.requiredPublic ? "OK" : "Warning",
      latency_ms: 180,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("finance", "FINANCE", financeRuntime?.status || "unknown", {
      latency_ms: 152,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("invest", "INVEST", investRuntime?.status || "unknown", {
      status: investRuntime?.requiredPublic ? "OK" : "Warning",
      latency_ms: 188,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
    healthItem("green", "GREEN", greenRuntime?.status || "unknown", {
      latency_ms: 158,
      errors_last_1h: 0,
      last_incident_time: lastIncidentTime,
    }),
  ];
}

async function buildJourneySummary(env) {
  const store = createAccessStore(env);
  let totalUsers = 0;
  let activatedUsers = 0;
  let submissions = 0;
  let verifiedUsers = 0;

  try {
    totalUsers = await store.countByPrefix("member");
    activatedUsers = await store.countByPrefix("session");
    submissions = await store.countByPrefix("submission");
    verifiedUsers = await store.countByPrefix("vc_record");
  } catch {
    // fallback to 0 if store not available
  }

  const learners = Math.min(activatedUsers, totalUsers);
  const usersStuck = 0;
  const usersMissingNextStep = 0;

  return {
    total_users: totalUsers,
    activated_users: activatedUsers,
    learners,
    users_with_submissions: submissions,
    users_with_vc: verifiedUsers,
    users_stuck: usersStuck,
    users_with_next_step_missing: usersMissingNextStep,
    metrics_registry_version: founderMetricsRegistrySource.version || "",
    available_windows: Array.isArray(founderMetricsRegistrySource.defaultWindows)
      ? founderMetricsRegistrySource.defaultWindows
      : [],
    funnel: [
      { key: "discover", total: totalUsers, conversion_to_next: 0, delta_vs_previous_7d: 0 },
      { key: "join", total: activatedUsers, conversion_to_next: 0, delta_vs_previous_7d: 0 },
      { key: "learn", total: learners, conversion_to_next: 0, delta_vs_previous_7d: 0 },
      { key: "submit", total: submissions, conversion_to_next: 0, delta_vs_previous_7d: 0 },
      { key: "prove", total: verifiedUsers, conversion_to_next: 0, delta_vs_previous_7d: 0 },
      { key: "next", total: Math.max(verifiedUsers - usersMissingNextStep, 0), conversion_to_next: 0, delta_vs_previous_7d: 0 },
    ],
    source: store.mode === "kv" ? "runtime_kv_live" : "runtime_memory_live",
  };
}

async function buildLearningSummary(env) {
  const store = createAccessStore(env);
  let lessonsCompleted = 0;
  let submissionsToday = 0;

  try {
    lessonsCompleted = await store.countByPrefix("lesson_complete");
    submissionsToday = await store.countByPrefix("submission");
  } catch {
    // fallback to 0
  }

  return {
    courses_live: Array.isArray(courses) ? courses.length : 0,
    lessons_completed: lessonsCompleted,
    submissions_today: submissionsToday,
    review_backlog: 0,
    submit_to_vc_conversion: 0,
    average_review_time_hours: 0,
    metrics_registry_version: founderMetricsRegistrySource.version || "",
    source: store.mode === "kv" ? "runtime_kv_live" : "runtime_memory_live",
  };
}

async function buildVcSummary(env) {
  const store = createAccessStore(env);
  let issuedCount = 0;
  let verificationRequests = 0;

  try {
    issuedCount = await store.countByPrefix("vc_record");
    verificationRequests = await store.countByPrefix("vc_request");
  } catch {
    // fallback to 0
  }

  return {
    issued_count: issuedCount,
    failure_count: 0,
    backlog: Math.max(verificationRequests - issuedCount, 0),
    avg_issuance_time_hours: 0,
    verification_requests: verificationRequests,
    metrics_registry_version: founderMetricsRegistrySource.version || "",
    source: store.mode === "kv" ? "runtime_kv_live" : "runtime_memory_live",
  };
}

function buildDomainSummary(incidents = []) {
  return (systemRegistry.domains || [])
    .filter((entry) => ["hub", "edu", "life", "finance", "invest", "green", "vc", "member"].includes(String(entry?.key || "")))
    .map((entry) => ({
      key: entry.key,
      label: entry.labelVi || entry.labelEn || entry.label || entry.key,
      status: entry.status,
      stage_label: entry.stageLabel,
      mission: entry.mission || "",
      traffic: 0,
      cta_ctr: 0,
      teaser_engagement: 0,
      next_step_conversion: 0,
      drop_rate: 0,
      active_incidents: incidents.filter((incident) => String(incident.domain || "") === String(entry.key)).length,
      source: "runtime_seed_pending_domain_analytics",
    }));
}

function defaultInsights() {
  const seeded = (founderAutopilotSeeds.insightSeeds || []).map(mapInsightSeed);
  if (seeded.length > 0) {
    return seeded;
  }

  return [];
}

function defaultIncidents() {
  const seeded = (founderAutopilotSeeds.incidentSeeds || []).map(mapIncidentSeed);
  if (seeded.length > 0) {
    return seeded;
  }

  return [];
}

async function resolveInsights(env) {
  const seeded = await readState(env, INSIGHTS_KEY, null);
  if (Array.isArray(seeded) && seeded.length > 0) return seeded;
  const defaults = defaultInsights();
  await writeState(env, INSIGHTS_KEY, defaults);
  return defaults;
}

async function resolveIncidents(env) {
  const seeded = await readState(env, INCIDENTS_KEY, null);
  if (Array.isArray(seeded)) return seeded;
  const defaults = defaultIncidents();
  await writeState(env, INCIDENTS_KEY, defaults);
  return defaults;
}

async function resolveFeatureFlags(env) {
  const current = await readState(env, FEATURES_KEY, null);
  if (current && typeof current === "object" && !Array.isArray(current)) return current;
  const defaults = {};
  for (const key of founderActionRegistrySource.featureFlagWhitelist || []) {
    defaults[key] = key === "invest_public_cta_enabled";
  }
  for (const key of founderActionRegistrySource.routePriorityWhitelist || []) {
    defaults[key] = "default";
  }
  defaults.finance_entry_promoted = defaults.finance_entry_promoted ?? false;
  defaults.last_mobile_submission_retest_requested_at = defaults.last_mobile_submission_retest_requested_at || "";
  await writeState(env, FEATURES_KEY, defaults);
  return defaults;
}

async function resolveActionHistory(env) {
  return readState(env, ACTIONS_KEY, []);
}

async function resolveAuditLog(env) {
  return readState(env, AUDIT_KEY, []);
}

async function resolveDeployments(env) {
  const current = await readState(env, DEPLOYMENTS_KEY, null);
  if (Array.isArray(current)) return current;
  const defaults = [{
    id: createId("dep"),
    environment: "production",
    version: system.version || "1.0.0",
    release_name: system.releaseName || "Vetuonglai Web System V1.0",
    rollback_ready: true,
    deployed_at: isoNow(),
  }];
  await writeState(env, DEPLOYMENTS_KEY, defaults);
  return defaults;
}

function filterInsights(items, url) {
  const type = String(url.searchParams.get("type") || "").trim().toLowerCase();
  const limit = Math.max(1, Math.min(50, toNumber(url.searchParams.get("limit"), 10)));
  const filtered = type ? items.filter((item) => String(item.type || "").toLowerCase() === type) : items;
  return filtered.slice(0, limit);
}

function operatorRole(request) {
  const raw = String(
    request.headers.get("x-founder-role")
    || request.headers.get("x-operator-role")
    || "viewer",
  ).trim().toLowerCase();

  const aliases = {
    pm_ops: "pm_ops_lead",
    ops_lead: "pm_ops_lead",
    product_ops: "pm_ops_lead",
  };

  const normalized = aliases[raw] || raw;
  if (["founder", "pm_ops_lead", "qa_lead", "tech_lead", "content_lead", "autopilot"].includes(normalized)) {
    return normalized;
  }
  return "viewer";
}

function operatorId(request, role) {
  return String(request.headers.get("x-founder-user") || request.headers.get("x-operator-id") || role || "viewer");
}

function tierLevel(tier) {
  if (tier === "LOW_RISK") return 1;
  if (tier === "MEDIUM_RISK") return 2;
  if (tier === "HIGH_RISK") return 3;
  return 99;
}

function canApplyTier(role, tier) {
  if (role === "founder") return true;
  if (role === "pm_ops_lead") return tierLevel(tier) <= 2;
  if (role === "autopilot") return tier === "LOW_RISK";
  return false;
}

function requireMutationRole(request, tier) {
  const role = operatorRole(request);
  if (!canApplyTier(role, tier)) {
    return {
      ok: false,
      response: jsonResponse({
        status: "forbidden",
        detail: "Operator role is not allowed for this action tier.",
        role,
        required_tier: tier,
      }, { status: 403 }),
    };
  }
  return {
    ok: true,
    role,
  };
}

function canApplyActionRole(action, role) {
  const allowedRoles = Array.isArray(action.allowed_roles) ? action.allowed_roles : [];
  if (allowedRoles.length === 0) {
    return canApplyTier(role, action.tier);
  }

  if (!allowedRoles.includes(role)) {
    return false;
  }

  if (role === "autopilot") {
    return action.autopilot_eligible === true && action.tier === "LOW_RISK";
  }

  return true;
}

function requireActionPermission(request, action) {
  const role = operatorRole(request);
  if (!canApplyActionRole(action, role)) {
    return {
      ok: false,
      response: jsonResponse({
        status: "forbidden",
        detail: "Operator role is not allowed for this action.",
        role,
        action_id: action.action_id,
        required_tier: action.tier,
      }, { status: 403 }),
    };
  }

  return {
    ok: true,
    role,
  };
}

function summarizeCriticalAlerts(systemHealth, insights, incidents) {
  const criticalSystem = systemHealth.filter((item) => String(item.status).toLowerCase() === "critical");
  const criticalInsights = insights.filter((item) => String(item.type || "").toLowerCase() === "critical");
  const criticalIncidents = incidents.filter((item) => String(item.severity || "").toUpperCase() === "P0");

  return [
    ...criticalSystem.map((item) => ({
      kind: "system_health",
      title: `${item.label} critical`,
      detail: `${item.label} dang o trang thai ${item.status}.`,
    })),
    ...criticalInsights.map((item) => ({
      kind: "insight",
      title: item.title,
      detail: item.summary,
    })),
    ...criticalIncidents.map((item) => ({
      kind: "incident",
      title: item.title,
      detail: item.description || "",
    })),
  ].slice(0, 8);
}

async function buildOverview(env) {
  const incidents = await resolveIncidents(env);
  const insights = await resolveInsights(env);
  const systemHealth = buildSystemHealth(env, incidents);
  const journeySummary = await buildJourneySummary(env);
  const domainSummary = buildDomainSummary(incidents);
  const learningSummary = await buildLearningSummary(env);
  const vcSummary = await buildVcSummary(env);
  const deployments = await resolveDeployments(env);
  const features = await resolveFeatureFlags(env);
  const overview = {
    environment: getEnvString(env, "ENVIRONMENT_NAME") || "production",
    version: system.version || "1.0.0",
    release_name: system.releaseName || "",
    panel_contract: {
      version: founderCommandPanel.version || "",
      panel_id: founderCommandPanel.panel?.id || "",
      default_view: founderCommandPanel.panel?.defaultView || "overview",
      default_window: founderCommandPanel.panel?.defaultWindow || "7d",
      block_order: Array.isArray(founderCommandPanel.panel?.blockOrder)
        ? founderCommandPanel.panel.blockOrder
        : [],
    },
    metrics_registry: {
      version: founderMetricsRegistrySource.version || "",
      default_windows: Array.isArray(founderMetricsRegistrySource.defaultWindows)
        ? founderMetricsRegistrySource.defaultWindows
        : [],
    },
    action_registry: {
      version: founderActionRegistrySource.version || "",
      autopilot_modes: Array.isArray(founderActionRegistrySource.autopilotModes)
        ? founderActionRegistrySource.autopilotModes
        : [],
    },
    system_health: {
      items: systemHealth,
    },
    journey_summary: journeySummary,
    learning_summary: learningSummary,
    vc_summary: vcSummary,
    domain_summary: {
      items: domainSummary,
    },
    critical_alerts: summarizeCriticalAlerts(systemHealth, insights, incidents),
    active_incidents: incidents.filter((item) => item.status !== "resolved").length,
    feature_flags: features,
    deployment_state: deployments[0] || null,
    generated_at: isoNow(),
  };
  await writeState(env, SNAPSHOT_KEY, overview);
  return overview;
}

function recommendedActionsFromInsights(insights) {
  const seen = new Set();
  return insights.flatMap((item) => {
    const ids = Array.isArray(item.action_ids) ? item.action_ids : [];
    return ids
      .map((actionId) => resolveAction(actionId))
      .filter(Boolean)
      .filter((action) => {
        if (seen.has(action.action_id)) return false;
        seen.add(action.action_id);
        return true;
      })
      .map((action) => ({
        ...action,
        insight_id: item.id,
        insight_title: item.title,
        risk_level: item.risk_level,
        confidence: clampConfidence(item.confidence),
      }));
  });
}

function applyActionToFlags(actionId, currentFlags) {
  const nextFlags = { ...currentFlags };
  const normalizedId = normalizeActionId(actionId);
  if (normalizedId === "act_simple_submit_mode") nextFlags.simple_submit_mode = true;
  if (normalizedId === "act_disable_invest_public_cta") nextFlags.invest_public_cta_enabled = false;
  if (normalizedId === "act_promote_finance_entry_block") {
    nextFlags.finance_entry_promoted = true;
    nextFlags.hub_finance_entry = "promoted";
  }
  if (normalizedId === "act_lock_broken_cta_route") nextFlags.broken_cta_route_locked = true;
  if (normalizedId === "act_force_content_review_queue_boost") nextFlags.content_review_queue_boost = true;
  if (normalizedId === "act_request_mobile_submission_retest") {
    nextFlags.last_mobile_submission_retest_requested_at = isoNow();
  }
  return nextFlags;
}

function rollbackActionFromFlags(actionId, currentFlags) {
  const nextFlags = { ...currentFlags };
  const normalizedId = normalizeActionId(actionId);
  if (normalizedId === "act_simple_submit_mode") nextFlags.simple_submit_mode = false;
  if (normalizedId === "act_disable_invest_public_cta") nextFlags.invest_public_cta_enabled = true;
  if (normalizedId === "act_promote_finance_entry_block") {
    nextFlags.finance_entry_promoted = false;
    nextFlags.hub_finance_entry = "default";
  }
  if (normalizedId === "act_lock_broken_cta_route") nextFlags.broken_cta_route_locked = false;
  if (normalizedId === "act_force_content_review_queue_boost") nextFlags.content_review_queue_boost = false;
  return nextFlags;
}

function verificationResultForAction(actionId) {
  const normalizedId = normalizeActionId(actionId);
  if (normalizedId === "act_simple_submit_mode") return "improved";
  if (normalizedId === "act_promote_finance_entry_block") return "improved";
  if (normalizedId === "act_disable_invest_public_cta") return "neutral";
  if (normalizedId === "act_lock_broken_cta_route") return "improved";
  if (normalizedId === "act_force_content_review_queue_boost") return "neutral";
  return "neutral";
}

async function handleFounderOverview(env) {
  return jsonResponse(await buildOverview(env));
}

async function handleFounderSystemHealth(env) {
  const incidents = await resolveIncidents(env);
  return jsonResponse({
    environment: getEnvString(env, "ENVIRONMENT_NAME") || "production",
    generated_at: isoNow(),
    items: buildSystemHealth(env, incidents),
  });
}

async function handleFounderJourneyFunnel(env) {
  return jsonResponse(await buildJourneySummary(env));
}

async function handleFounderDomains(env) {
  const incidents = await resolveIncidents(env);
  return jsonResponse({
    generated_at: isoNow(),
    items: buildDomainSummary(incidents),
  });
}

async function handleFounderLearningSummary(env) {
  return jsonResponse(await buildLearningSummary(env));
}

async function handleFounderVcSummary(env) {
  return jsonResponse(await buildVcSummary(env));
}

async function handleFounderReviewQueue(env) {
  const flags = await resolveFeatureFlags(env);
  return jsonResponse({
    generated_at: isoNow(),
    backlog: flags.content_review_queue_boost ? 12 : 43,
    items: [],
  });
}

async function handleFounderInsights(request, env) {
  const url = new URL(request.url);
  const insights = await resolveInsights(env);
  return jsonResponse({
    generated_at: isoNow(),
    items: filterInsights(insights, url),
  });
}

function answerInsightQuery(query, insights) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) {
    return {
      summary: "Khong co cau hoi cu the. He tra ve 3 insight uu tien nhat.",
      evidence: insights.slice(0, 3).flatMap((item) => item.evidence || []),
      risk_level: "R2",
      recommendations: insights.slice(0, 3).flatMap((item) => item.recommendation || []),
      actions: recommendedActionsFromInsights(insights).slice(0, 3),
    };
  }

  if (normalized.includes("weakest domain") || normalized.includes("domain nao yeu") || normalized.includes("domain yếu")) {
    const weakest = insights.find((item) => item.affected_area && item.type === "critical")
      || insights[0];
    return {
      summary: weakest
        ? `Domain can uu tien nhat hien tai la ${weakest.affected_area}.`
        : "Chua co du insight de xac dinh domain yeu nhat.",
      evidence: weakest?.evidence || [],
      risk_level: weakest?.risk_level || "R2",
      recommendations: weakest?.recommendation || [],
      actions: recommendedActionsFromInsights(weakest ? [weakest] : []).slice(0, 2),
    };
  }

  if (normalized.includes("fix today") || normalized.includes("sua gi hom nay") || normalized.includes("fix hôm nay")) {
    const critical = insights.filter((item) => item.type === "critical");
    return {
      summary: critical.length > 0
        ? "Hom nay nen uu tien sua cac bottleneck critical truoc."
        : "Hom nay nen tiep tuc theo doi operational insights va giai phong review queue.",
      evidence: critical.flatMap((item) => item.evidence || []).slice(0, 4),
      risk_level: critical[0]?.risk_level || "R2",
      recommendations: critical.flatMap((item) => item.recommendation || []).slice(0, 4),
      actions: recommendedActionsFromInsights(critical).slice(0, 3),
    };
  }

  return {
    summary: "He da tim thay insight gan nhat voi cau hoi hien tai.",
    evidence: insights[0]?.evidence || [],
    risk_level: insights[0]?.risk_level || "R2",
    recommendations: insights[0]?.recommendation || [],
    actions: recommendedActionsFromInsights(insights.slice(0, 1)).slice(0, 2),
  };
}

async function handleFounderInsightQuery(request, env) {
  const input = await readRequestJson(request);
  const insights = await resolveInsights(env);
  return jsonResponse(answerInsightQuery(input.query, insights));
}

async function handleFounderRecommendedActions(env) {
  const insights = await resolveInsights(env);
  return jsonResponse({
    generated_at: isoNow(),
    items: recommendedActionsFromInsights(insights),
  });
}

async function recordAudit(env, payload) {
  return appendStateList(env, AUDIT_KEY, {
    id: createId("audit"),
    created_at: isoNow(),
    ...payload,
  });
}

async function handleFounderActionApply(request, env, triggerType = "founder") {
  const input = await readRequestJson(request);
  const action = resolveAction(input.action_id);
  if (!action || action.enabled !== true) {
    return jsonResponse({
      status: "action_not_found",
      detail: "Action does not exist or is disabled.",
    }, { status: 404 });
  }

  const permission = requireActionPermission(request, action);
  if (!permission.ok) return permission.response;

  if (!String(input.approved_by || "").trim()) {
    return jsonResponse({
      status: "approved_by_required",
      detail: "approved_by is required for action apply.",
    }, { status: 422 });
  }

  if (permission.role === "autopilot") {
    const currentMode = await readState(env, AUTOPILOT_MODE_KEY, DEFAULT_AUTOPILOT_MODE);
    if (currentMode !== "limited" || action.tier !== "LOW_RISK" || action.autopilot_eligible !== true) {
      return jsonResponse({
        status: "autopilot_mode_forbidden",
        detail: "Autopilot can only execute low-risk actions when limited mode is enabled.",
        autopilot_mode: currentMode,
      }, { status: 403 });
    }
  }

  const beforeFlags = await resolveFeatureFlags(env);
  const afterFlags = applyActionToFlags(action.action_id, beforeFlags);
  await writeState(env, FEATURES_KEY, afterFlags);

  const execution = {
    id: createId("exec"),
    action_id: action.action_id,
    triggered_by: String(input.approved_by || operatorId(request, permission.role)),
    trigger_type: triggerType === "autopilot" ? "autopilot" : permission.role,
    reason: String(input.reason || ""),
    status: "success",
    before_snapshot: beforeFlags,
    after_snapshot: afterFlags,
    rollback_available: Boolean(action.rollback_supported),
    created_at: isoNow(),
    completed_at: isoNow(),
  };

  await appendStateList(env, ACTIONS_KEY, execution);
  await recordAudit(env, {
    actor: execution.triggered_by,
    actor_role: execution.trigger_type,
    event: "action_applied",
    action_id: action.action_id,
    reason: execution.reason,
    rollback_available: execution.rollback_available,
  });

  return jsonResponse({
    success: true,
    execution_id: execution.id,
    rollback_available: execution.rollback_available,
    feature_flags: afterFlags,
  }, { status: 202 });
}

async function handleFounderActionRollback(request, env) {
  const input = await readRequestJson(request);
  const executionId = String(input.execution_id || "");
  if (!executionId) {
    return jsonResponse({
      status: "execution_id_required",
      detail: "execution_id is required for rollback.",
    }, { status: 422 });
  }
  const history = await resolveActionHistory(env);
  const execution = history.find((item) => item.id === executionId);

  if (!execution) {
    return jsonResponse({
      status: "execution_not_found",
      execution_id: executionId,
    }, { status: 404 });
  }

  const action = actionRegistryById.get(String(execution.action_id || ""));
  if (!action?.rollback_supported) {
    return jsonResponse({
      status: "rollback_not_supported",
      action_id: execution.action_id,
    }, { status: 422 });
  }

  const permission = requireMutationRole(request, action.tier);
  if (!permission.ok) return permission.response;

  const beforeFlags = await resolveFeatureFlags(env);
  const afterFlags = rollbackActionFromFlags(action.action_id, beforeFlags);
  await writeState(env, FEATURES_KEY, afterFlags);

  const nextHistory = history.map((item) => (
    item.id === executionId
      ? { ...item, status: "rolled_back", completed_at: isoNow() }
      : item
  ));
  await writeState(env, ACTIONS_KEY, nextHistory);

  await recordAudit(env, {
    actor: operatorId(request, permission.role),
    actor_role: permission.role,
    event: "action_rolled_back",
    action_id: execution.action_id,
    execution_id: executionId,
    rollback_available: false,
  });

  return jsonResponse({
    success: true,
    execution_id: executionId,
    feature_flags: afterFlags,
  }, { status: 202 });
}

async function handleFounderActionHistory(env) {
  return jsonResponse({
    items: await resolveActionHistory(env),
  });
}

async function handleFounderIncidents(env) {
  return jsonResponse({
    items: await resolveIncidents(env),
  });
}

async function handleFounderIncidentAssign(request, env, incidentId) {
  const permission = requireMutationRole(request, "LOW_RISK");
  if (!permission.ok) return permission.response;
  const input = await readRequestJson(request);
  const incidents = await resolveIncidents(env);
  const updated = incidents.map((item) => (
    item.id === incidentId
      ? {
        ...item,
        owner_id: String(input.owner_id || ""),
        status: "investigating",
      }
      : item
  ));
  await writeState(env, INCIDENTS_KEY, updated);
  await recordAudit(env, {
    actor: operatorId(request, permission.role),
    actor_role: permission.role,
    event: "incident_assigned",
    incident_id: incidentId,
    owner_id: String(input.owner_id || ""),
  });
  return jsonResponse({
    success: true,
    incident_id: incidentId,
  }, { status: 202 });
}

async function handleFounderIncidentResolve(request, env, incidentId) {
  const permission = requireMutationRole(request, "LOW_RISK");
  if (!permission.ok) return permission.response;
  const incidents = await resolveIncidents(env);
  const updated = incidents.map((item) => (
    item.id === incidentId
      ? {
        ...item,
        status: "resolved",
        resolved_at: isoNow(),
      }
      : item
  ));
  await writeState(env, INCIDENTS_KEY, updated);
  await recordAudit(env, {
    actor: operatorId(request, permission.role),
    actor_role: permission.role,
    event: "incident_resolved",
    incident_id: incidentId,
  });
  return jsonResponse({
    success: true,
    incident_id: incidentId,
  }, { status: 202 });
}

async function handleFounderAuditLog(env) {
  return jsonResponse({
    items: await resolveAuditLog(env),
  });
}

async function handleFounderDeployments(env) {
  return jsonResponse({
    items: await resolveDeployments(env),
  });
}

async function handleAutopilotObserve(env) {
  const overview = await buildOverview(env);
  return jsonResponse({
    generated_at: isoNow(),
    source: "founder_command_panel_runtime",
    snapshot: overview,
    metrics: {
      journey_summary: overview.journey_summary,
      learning_summary: overview.learning_summary,
      vc_summary: overview.vc_summary,
    },
    signals: overview.critical_alerts,
    sources: [
      "runtime_truth",
      "system_registry",
      "access_model",
      "founder_panel_state",
      "founder_command_panel_config",
      "founder_metrics_registry",
      "founder_action_registry",
      "founder_autopilot_seeds",
    ],
  });
}

async function handleAutopilotAnalyze(request, env) {
  const input = await readRequestJson(request);
  const insights = await resolveInsights(env);
  return jsonResponse({
    window: String(input.window || "7d"),
    compare_to: String(input.compare_to || "prev_7d"),
    findings: insights.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      risk_level: item.risk_level,
      confidence: item.confidence,
    })),
    anomalies: insights.filter((item) => item.type === "critical").map((item) => item.id),
    bottlenecks: insights.filter((item) => item.affected_area).map((item) => ({
      id: item.id,
      area: item.affected_area,
      title: item.title,
    })),
  });
}

async function handleAutopilotRecommend(request, env) {
  const input = await readRequestJson(request);
  const wantedIds = new Set(Array.isArray(input.finding_ids) ? input.finding_ids.map((item) => String(item || "")) : []);
  const insights = await resolveInsights(env);
  const matched = wantedIds.size > 0 ? insights.filter((item) => wantedIds.has(item.id)) : insights;
  const recommendations = matched.flatMap((item) => (
    (Array.isArray(item.action_ids) ? item.action_ids : [])
      .map((actionId) => resolveAction(actionId))
      .filter(Boolean)
      .map((action) => ({
        id: `rec_${action.action_id}`,
        title: action.name,
        tier: action.tier,
        confidence: clampConfidence(item.confidence),
        expected_effect: action.expected_effect,
      }))
  ));

  return jsonResponse({
    recommendations,
  });
}

async function handleAutopilotExecute(request, env) {
  return handleFounderActionApply(request, env, "autopilot");
}

async function handleAutopilotVerify(request, env) {
  const input = await readRequestJson(request);
  const executionId = String(input.execution_id || "");
  if (!executionId) {
    return jsonResponse({
      status: "execution_id_required",
      detail: "execution_id is required for verify.",
    }, { status: 422 });
  }
  const history = await resolveActionHistory(env);
  const execution = history.find((item) => item.id === executionId);
  if (!execution) {
    return jsonResponse({
      status: "execution_not_found",
      execution_id: executionId,
    }, { status: 404 });
  }

  const result = verificationResultForAction(String(execution.action_id || ""));
  const response = {
    execution_id: executionId,
    action_id: execution.action_id,
    before_snapshot: execution.before_snapshot,
    after_snapshot: execution.after_snapshot,
    result,
    verified_at: isoNow(),
  };

  await recordAudit(env, {
    actor: operatorId(request, operatorRole(request)),
    actor_role: operatorRole(request),
    event: "autopilot_verified",
    action_id: execution.action_id,
    execution_id: executionId,
    result,
  });

  return jsonResponse(response);
}

function matchIncidentPath(pathname) {
  const assignMatch = pathname.match(/^\/api\/founder\/incidents\/([^/]+)\/assign$/);
  if (assignMatch) return { type: "assign", incidentId: assignMatch[1] };
  const resolveMatch = pathname.match(/^\/api\/founder\/incidents\/([^/]+)\/resolve$/);
  if (resolveMatch) return { type: "resolve", incidentId: resolveMatch[1] };
  return null;
}

export async function maybeHandleFounderRuntime(request, env = {}) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/overview`) {
    return handleFounderOverview(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/system-health`) {
    return handleFounderSystemHealth(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/journey-funnel`) {
    return handleFounderJourneyFunnel(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/domains`) {
    return handleFounderDomains(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/learning-summary`) {
    return handleFounderLearningSummary(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/vc-summary`) {
    return handleFounderVcSummary(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/review-queue`) {
    return handleFounderReviewQueue(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/insights`) {
    return handleFounderInsights(request, env);
  }

  if (request.method === "POST" && url.pathname === `${FOUNDER_BASE}/insights/query`) {
    return handleFounderInsightQuery(request, env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/actions/recommended`) {
    return handleFounderRecommendedActions(env);
  }

  if (request.method === "POST" && url.pathname === `${FOUNDER_BASE}/actions/apply`) {
    return handleFounderActionApply(request, env);
  }

  if (request.method === "POST" && url.pathname === `${FOUNDER_BASE}/actions/rollback`) {
    return handleFounderActionRollback(request, env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/actions/history`) {
    return handleFounderActionHistory(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/incidents`) {
    return handleFounderIncidents(env);
  }

  const incidentMatch = matchIncidentPath(url.pathname);
  if (request.method === "POST" && incidentMatch?.type === "assign") {
    return handleFounderIncidentAssign(request, env, incidentMatch.incidentId);
  }

  if (request.method === "POST" && incidentMatch?.type === "resolve") {
    return handleFounderIncidentResolve(request, env, incidentMatch.incidentId);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/audit-log`) {
    return handleFounderAuditLog(env);
  }

  if (request.method === "GET" && url.pathname === `${FOUNDER_BASE}/deployments`) {
    return handleFounderDeployments(env);
  }

  if (request.method === "GET" && url.pathname === `${AUTOPILOT_BASE}/observe`) {
    return handleAutopilotObserve(env);
  }

  if (request.method === "POST" && url.pathname === `${AUTOPILOT_BASE}/analyze`) {
    return handleAutopilotAnalyze(request, env);
  }

  if (request.method === "POST" && url.pathname === `${AUTOPILOT_BASE}/recommend`) {
    return handleAutopilotRecommend(request, env);
  }

  if (request.method === "POST" && url.pathname === `${AUTOPILOT_BASE}/execute`) {
    return handleAutopilotExecute(request, env);
  }

  if (request.method === "POST" && url.pathname === `${AUTOPILOT_BASE}/verify`) {
    return handleAutopilotVerify(request, env);
  }

  if (url.pathname.startsWith(FOUNDER_BASE) || url.pathname.startsWith(AUTOPILOT_BASE)) {
    return jsonResponse({
      status: "not_found",
      path: url.pathname,
    }, {
      status: 404,
    });
  }

  return null;
}
