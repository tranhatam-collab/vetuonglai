import {
  jsonResponse, currentUnixSeconds, platformStore, readRequestJson, makeId,
  listKvByPrefix, readSessionFromRequest, isFounderEmail,
} from "./runtime-helpers.mjs";

const BASE = "/api/analytics";
const EVENT_TTL = 90 * 24 * 60 * 60;
const AGGREGATE_TTL = 365 * 24 * 60 * 60;
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{1,48}$/;
const MAX_PROPS_BYTES = 4096;

function dayKey(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function handleIngest(request, env) {
  const input = await readRequestJson(request);
  const name = String(input.name || "").toLowerCase().trim();
  if (!EVENT_NAME_PATTERN.test(name)) {
    return jsonResponse({ status: "event_name_invalid", detail: "lowercase, [a-z0-9_], length 2–49, start with letter" }, { status: 422 });
  }
  const host = String(input.host || "").trim().slice(0, 80);
  const path = String(input.path || "").trim().slice(0, 200);
  const props = input.props && typeof input.props === "object" ? input.props : {};
  const propsJson = JSON.stringify(props);
  if (propsJson.length > MAX_PROPS_BYTES) {
    return jsonResponse({ status: "props_too_large", limit_bytes: MAX_PROPS_BYTES }, { status: 422 });
  }

  const session = await readSessionFromRequest(request, env);
  const actorEmail = session?.candidate_email || "";

  const store = platformStore(env);
  const id = makeId("EVT_");
  const now = currentUnixSeconds();
  const event = {
    id,
    name,
    host,
    path,
    props,
    actor_email: actorEmail,
    member_state: session?.member_state || "anonymous",
    created_at: now,
  };
  await store.put("analytics_event", `${name}:${id}`, event, { ttlSeconds: EVENT_TTL });

  const aggKey = `${dayKey(now)}:${name}`;
  const agg = (await store.get("analytics_daily", aggKey)) || { day: dayKey(now), name, count: 0 };
  agg.count = Number(agg.count || 0) + 1;
  agg.updated_at = now;
  await store.put("analytics_daily", aggKey, agg, { ttlSeconds: AGGREGATE_TTL });

  return jsonResponse({ status: "event_ingested", id }, { status: 202 });
}

async function handleSummary(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session || !isFounderEmail(session.candidate_email, env)) {
    return jsonResponse({ status: "forbidden", detail: "founder_required" }, { status: 403 });
  }
  const url = new URL(request.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit")) || 200));
  const data = await listKvByPrefix(env, "analytics_daily", { limit });
  const rows = data.entries.map((e) => e.value).filter(Boolean);
  rows.sort((a, b) => String(b.day || "").localeCompare(String(a.day || "")));

  const byName = {};
  let total = 0;
  for (const row of rows) {
    byName[row.name] = (byName[row.name] || 0) + Number(row.count || 0);
    total += Number(row.count || 0);
  }
  return jsonResponse({
    status: "summary_ok",
    total_events: total,
    by_name: byName,
    daily: rows.slice(0, 60),
    next_cursor: data.next_cursor,
  });
}

export async function maybeHandleAnalyticsRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "analytics_ok" });
  }
  if (request.method === "POST" && url.pathname === `${BASE}/events`) {
    return handleIngest(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/summary`) {
    return handleSummary(request, env);
  }
  return jsonResponse({ status: "analytics_route_not_found", path: url.pathname }, { status: 404 });
}
