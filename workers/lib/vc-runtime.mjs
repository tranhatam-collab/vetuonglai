import { createAccessStore } from "./access-state.mjs";

const VC_BASE = "/api/vc";
const ISSUER_PREFIX = "vc_issuer";

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers,
  });
}

function getEnvString(env, key) {
  const value = env?.[key];
  return typeof value === "string" ? value : "";
}

function isValidEmail(value) {
  const raw = String(value || "").trim();
  if (raw.length < 3 || raw.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

function isValidUrl(value) {
  try {
    new URL(String(value || ""));
    return true;
  } catch {
    return false;
  }
}

function generateIssuerId() {
  const uuid = crypto.randomUUID();
  return `issuer_${uuid.replace(/-/g, "").slice(0, 12)}`;
}

async function readRequestJson(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function vcStore(env) {
  return createAccessStore(env);
}

async function handleIssuerRegister(request, env) {
  try {
    const body = await readRequestJson(request);
    const { name, email, profile_url } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return jsonResponse({
        status: "invalid_request",
        error: "name is required",
      }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return jsonResponse({
        status: "invalid_request",
        error: "email must be a valid email address",
      }, { status: 400 });
    }

    if (!profile_url || !isValidUrl(profile_url)) {
      return jsonResponse({
        status: "invalid_request",
        error: "profile_url must be a valid URL",
      }, { status: 400 });
    }

    const issuerId = generateIssuerId();
    const store = vcStore(env);

    const issuerRecord = {
      id: issuerId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      profile_url: String(profile_url).trim(),
      created_at: new Date().toISOString(),
      status: "pending_approval",
    };

    await store.put(ISSUER_PREFIX, issuerId, issuerRecord);

    return jsonResponse({
      id: issuerId,
      status: "pending_approval",
      created_at: issuerRecord.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error("Error registering issuer:", error);
    return jsonResponse({
      status: "error",
      error: "Failed to register issuer",
    }, { status: 500 });
  }
}

async function handleIssuerList(request, env) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));

    const store = vcStore(env);

    const offset = (page - 1) * limit;
    const issuers = [];
    let total = 0;

    if (env.ACCESS_KV_NAMESPACE && typeof env.ACCESS_KV_NAMESPACE.list === "function") {
      const listResult = await env.ACCESS_KV_NAMESPACE.list({
        prefix: `${ISSUER_PREFIX}:`,
      });

      const allKeys = listResult?.keys || [];
      total = allKeys.length;

      const sorted = allKeys.sort((a, b) => {
        const aTime = parseInt(a.metadata?.createdAt || 0, 10);
        const bTime = parseInt(b.metadata?.createdAt || 0, 10);
        return bTime - aTime;
      });

      for (let i = offset; i < Math.min(offset + limit, sorted.length); i += 1) {
        const key = sorted[i];
        const raw = await env.ACCESS_KV_NAMESPACE.get(key.name);
        if (raw) {
          const record = JSON.parse(raw);
          if (record.status !== "deleted") {
            issuers.push({
              id: record.id,
              name: record.name,
              email: record.email,
              status: record.status,
              created_at: record.created_at,
            });
          }
        }
      }
    } else {
      const allRecords = [];
      const memoryState = globalThis.__vtlAccessMemoryState || { kv: new Map() };

      for (const [key, data] of memoryState.kv) {
        if (key.startsWith(`${ISSUER_PREFIX}:`)) {
          const record = data.value;
          const isExpired = typeof record?.expiresAt === "number" && record.expiresAt <= Date.now();
          if (record && !isExpired && record.status !== "deleted") {
            allRecords.push({
              id: record.id,
              name: record.name,
              email: record.email,
              status: record.status,
              created_at: record.created_at,
            });
          }
        }
      }
      allRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      total = allRecords.length;
      issuers.push(...allRecords.slice(offset, offset + limit));
    }

    return jsonResponse({
      issuers,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error listing issuers:", error);
    return jsonResponse({
      status: "error",
      error: "Failed to list issuers",
    }, { status: 500 });
  }
}

async function handleIssuerDelete(request, env) {
  try {
    const url = new URL(request.url);
    const issuerId = url.pathname.split("/").pop();

    if (!issuerId) {
      return jsonResponse({
        status: "invalid_request",
        error: "issuer_id is required",
      }, { status: 400 });
    }

    const store = vcStore(env);
    const existing = await store.get(ISSUER_PREFIX, issuerId);

    if (!existing) {
      return jsonResponse({
        status: "not_found",
        error: "issuer not found",
      }, { status: 404 });
    }

    const updated = {
      ...existing,
      status: "deleted",
      updated_at: new Date().toISOString(),
    };

    await store.put(ISSUER_PREFIX, issuerId, updated);

    return jsonResponse({
      id: issuerId,
      status: "deleted",
      updated_at: updated.updated_at,
    });
  } catch (error) {
    console.error("Error deleting issuer:", error);
    return jsonResponse({
      status: "error",
      error: "Failed to delete issuer",
    }, { status: 500 });
  }
}

async function maybeHandleVcRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(VC_BASE)) return null;

  if (request.method === "GET" && url.pathname === `${VC_BASE}/health`) {
    const store = vcStore(env);
    return jsonResponse({
      status: "vc_runtime_ok",
      storage_mode: store.mode,
      base: VC_BASE,
      version: "v1",
    });
  }

  if (request.method === "POST" && url.pathname === `${VC_BASE}/issuer/register`) {
    return handleIssuerRegister(request, env);
  }

  if (request.method === "GET" && url.pathname === `${VC_BASE}/issuer/list`) {
    return handleIssuerList(request, env);
  }

  if (request.method === "POST" && url.pathname.startsWith(`${VC_BASE}/issuer/delete/`)) {
    return handleIssuerDelete(request, env);
  }

  return null;
}

export { maybeHandleVcRuntime };
