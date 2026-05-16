import {
  jsonResponse, currentUnixSeconds, platformStore, readSessionFromRequest,
  readRequestJson, listKvByPrefix, isFounderEmail, makeId,
} from "./runtime-helpers.mjs";

const BASE = "/api/admin/cms";
const CONTENT_TTL = null;
const KEY_PATTERN = /^[a-z0-9][a-z0-9._-]{0,79}$/;
const TYPE_PATTERN = /^[a-z][a-z0-9_-]{1,30}$/;
const MAX_BODY_BYTES = 64 * 1024;

async function requireFounder(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session || !isFounderEmail(session.candidate_email, env)) {
    return {
      response: jsonResponse({
        status: "forbidden",
        detail: "founder_required",
      }, { status: 403 }),
    };
  }
  return { session };
}

function validateKey(raw) {
  const key = String(raw || "").toLowerCase().trim();
  return KEY_PATTERN.test(key) ? key : null;
}

function validateType(raw) {
  const t = String(raw || "page").toLowerCase().trim();
  return TYPE_PATTERN.test(t) ? t : "page";
}

async function handleGet(request, env) {
  const url = new URL(request.url);
  const key = validateKey(url.searchParams.get("key"));
  if (!key) return jsonResponse({ status: "key_invalid" }, { status: 422 });
  const store = platformStore(env);
  const record = await store.get("cms_content", key);
  if (!record) return jsonResponse({ status: "content_not_found", key }, { status: 404 });
  if (record.visibility === "draft") {
    const session = await readSessionFromRequest(request, env);
    if (!session || !isFounderEmail(session.candidate_email, env)) {
      return jsonResponse({ status: "content_not_found", key }, { status: 404 });
    }
  }
  return jsonResponse({ status: "content_ok", content: record });
}

async function handlePut(request, env) {
  const ctx = await requireFounder(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const key = validateKey(input.key);
  if (!key) return jsonResponse({ status: "key_invalid", detail: "lowercase, 1–80 chars, [a-z0-9._-]" }, { status: 422 });
  const type = validateType(input.type);
  const visibility = ["public", "draft", "members_only"].includes(String(input.visibility || "").toLowerCase())
    ? String(input.visibility).toLowerCase()
    : "public";
  const title = String(input.title || "").trim().slice(0, 200);
  const body = String(input.body || "");
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return jsonResponse({ status: "body_too_large", limit_bytes: MAX_BODY_BYTES }, { status: 413 });
  }
  const metadata = (input.metadata && typeof input.metadata === "object") ? input.metadata : {};

  const store = platformStore(env);
  const existing = await store.get("cms_content", key);
  const record = {
    key,
    type,
    visibility,
    title,
    body,
    metadata,
    lang: input.lang === "en" ? "en" : "vi",
    author_email: ctx.session.candidate_email,
    created_at: existing?.created_at || currentUnixSeconds(),
    updated_at: currentUnixSeconds(),
    revision: Number(existing?.revision || 0) + 1,
  };
  await store.put("cms_content", key, record, CONTENT_TTL ? { ttlSeconds: CONTENT_TTL } : undefined);
  await store.put("cms_content_by_type", `${type}:${key}`, { key }, CONTENT_TTL ? { ttlSeconds: CONTENT_TTL } : undefined);

  if (existing) {
    const revId = makeId("REV_");
    await store.put("cms_revision", `${key}:${revId}`, {
      key,
      revision_id: revId,
      previous_revision: existing.revision || 0,
      previous_body: existing.body || "",
      previous_metadata: existing.metadata || {},
      replaced_at: currentUnixSeconds(),
      replaced_by: ctx.session.candidate_email,
    }, { ttlSeconds: 180 * 24 * 60 * 60 });
  }

  return jsonResponse({ status: "content_saved", content: record }, { status: existing ? 200 : 201 });
}

async function handleDelete(request, env) {
  const ctx = await requireFounder(request, env);
  if (ctx.response) return ctx.response;
  const url = new URL(request.url);
  const key = validateKey(url.searchParams.get("key"));
  if (!key) return jsonResponse({ status: "key_invalid" }, { status: 422 });
  const store = platformStore(env);
  const existing = await store.get("cms_content", key);
  if (!existing) return jsonResponse({ status: "content_not_found", key }, { status: 404 });
  await store.delete("cms_content", key);
  await store.delete("cms_content_by_type", `${existing.type}:${key}`);
  return jsonResponse({ status: "content_deleted", key });
}

async function handleList(request, env) {
  const ctx = await requireFounder(request, env);
  if (ctx.response) return ctx.response;
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const prefix = type && TYPE_PATTERN.test(type) ? `cms_content_by_type:${type}` : "cms_content";
  const data = await listKvByPrefix(env, prefix, { limit: 200 });
  const store = platformStore(env);
  const items = [];
  for (const item of data.entries) {
    const k = item.value?.key || item.value?.key === undefined && item.key?.split(":").pop();
    const recordKey = type ? item.value?.key : (item.key?.split(":").slice(1).join(":"));
    const record = recordKey ? await store.get("cms_content", recordKey) : item.value;
    if (record) items.push(record);
  }
  items.sort((a, b) => Number(b.updated_at || 0) - Number(a.updated_at || 0));
  return jsonResponse({ status: "list_ok", count: items.length, items });
}

async function handleRevisions(request, env, key) {
  const ctx = await requireFounder(request, env);
  if (ctx.response) return ctx.response;
  const data = await listKvByPrefix(env, `cms_revision:${key}`, { limit: 100 });
  const revs = data.entries.map((e) => e.value).filter(Boolean);
  revs.sort((a, b) => Number(b.replaced_at || 0) - Number(a.replaced_at || 0));
  return jsonResponse({ status: "revisions_ok", key, revisions: revs });
}

export async function maybeHandleAdminCmsRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "admin_cms_ok" });
  }
  if (request.method === "GET" && url.pathname === `${BASE}/content`) {
    return handleGet(request, env);
  }
  if (request.method === "PUT" && url.pathname === `${BASE}/content`) {
    return handlePut(request, env);
  }
  if (request.method === "DELETE" && url.pathname === `${BASE}/content`) {
    return handleDelete(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/list`) {
    return handleList(request, env);
  }
  const revMatch = url.pathname.match(/^\/api\/admin\/cms\/content\/([^/]+)\/revisions$/);
  if (revMatch && request.method === "GET") {
    return handleRevisions(request, env, decodeURIComponent(revMatch[1]));
  }
  return jsonResponse({ status: "admin_cms_route_not_found", path: url.pathname }, { status: 404 });
}
