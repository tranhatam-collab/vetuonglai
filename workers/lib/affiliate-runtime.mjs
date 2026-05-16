import {
  jsonResponse, currentUnixSeconds, platformStore, requireSession,
  readRequestJson, makeId, listKvByPrefix, isInternalCallAuthorized, getEnvString,
} from "./runtime-helpers.mjs";

const BASE = "/api/affiliate";
const CODE_TTL = 365 * 24 * 60 * 60;
const CLICK_TTL = 90 * 24 * 60 * 60;
const CONVERSION_TTL = 365 * 24 * 60 * 60;
const CODE_PATTERN = /^[a-z0-9-]{3,30}$/;
const ALLOWED_SUBDOMAINS = new Set([
  "vetuonglai.com", "vc.vetuonglai.com", "edu.vetuonglai.com",
  "member.vetuonglai.com", "read.vetuonglai.com", "green.vetuonglai.com",
  "finance.vetuonglai.com", "life.vetuonglai.com", "work.vetuonglai.com",
]);

const DEFAULT_COMMISSION_BPS = 1500;

function shortCode() {
  const letters = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) out += letters[bytes[i] % letters.length];
  return out;
}

async function handleCreateCode(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  let code = String(input.code || "").toLowerCase().trim();
  if (!code) code = shortCode();
  if (!CODE_PATTERN.test(code)) {
    return jsonResponse({ status: "code_invalid", detail: "3–30 chars, lowercase a-z 0-9 -" }, { status: 422 });
  }
  const store = platformStore(env);
  const existing = await store.get("affiliate_code", code);
  if (existing) {
    return jsonResponse({ status: "code_taken" }, { status: 409 });
  }
  const targetUrl = String(input.target_url || `https://vetuonglai.com/`).trim();
  let targetHost = "";
  try { targetHost = new URL(targetUrl).hostname; } catch { targetHost = ""; }
  if (!targetHost || (![...ALLOWED_SUBDOMAINS].some((d) => targetHost === d || targetHost.endsWith(`.${d}`)))) {
    return jsonResponse({ status: "target_url_invalid", detail: "host must be vetuonglai.com or subdomain" }, { status: 422 });
  }
  const commissionBps = Number.isFinite(Number(input.commission_bps))
    ? Math.max(0, Math.min(5000, Math.floor(Number(input.commission_bps))))
    : DEFAULT_COMMISSION_BPS;

  const record = {
    code,
    owner_email: ctx.session.candidate_email,
    target_url: targetUrl,
    commission_bps: commissionBps,
    clicks: 0,
    conversions: 0,
    earned_vnd: 0,
    created_at: currentUnixSeconds(),
    active: true,
  };
  await store.put("affiliate_code", code, record, { ttlSeconds: CODE_TTL });
  await store.put("affiliate_code_by_owner", `${ctx.session.candidate_email}:${code}`, { code }, { ttlSeconds: CODE_TTL });
  return jsonResponse({
    status: "code_created",
    code: record,
    share_url: `https://vetuonglai.com/r/${code}`,
  }, { status: 201 });
}

async function handleListMyCodes(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const data = await listKvByPrefix(env, `affiliate_code_by_owner:${ctx.session.candidate_email}`, { limit: 100 });
  const store = platformStore(env);
  const codes = [];
  for (const item of data.entries) {
    const c = item.value?.code;
    if (!c) continue;
    const code = await store.get("affiliate_code", c);
    if (code) codes.push(code);
  }
  return jsonResponse({ status: "codes_ok", codes });
}

async function handleTrack(request, env) {
  const url = new URL(request.url);
  const code = (url.searchParams.get("code") || "").toLowerCase().trim();
  if (!code || !CODE_PATTERN.test(code)) {
    return jsonResponse({ status: "code_required" }, { status: 422 });
  }
  const store = platformStore(env);
  const record = await store.get("affiliate_code", code);
  if (!record || !record.active) {
    return Response.redirect("https://vetuonglai.com/", 302);
  }
  const clickId = makeId("CLK_");
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const click = {
    id: clickId,
    code,
    ua: String(ua).slice(0, 200),
    referer: String(referer).slice(0, 200),
    created_at: currentUnixSeconds(),
  };
  await store.put("affiliate_click", `${code}:${clickId}`, click, { ttlSeconds: CLICK_TTL });
  record.clicks = Number(record.clicks || 0) + 1;
  await store.put("affiliate_code", code, record, { ttlSeconds: CODE_TTL });

  const target = new URL(record.target_url);
  target.searchParams.set("ref", code);
  target.searchParams.set("ck", clickId.slice(0, 12));
  const response = Response.redirect(target.toString(), 302);
  const headers = new Headers(response.headers);
  headers.append("set-cookie", `vtl_ref=${code}; Path=/; Domain=.vetuonglai.com; Max-Age=2592000; SameSite=Lax; Secure`);
  return new Response(null, { status: 302, headers });
}

async function handleConversion(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({ status: "internal_token_required" }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const code = String(input.code || "").toLowerCase().trim();
  const orderRef = String(input.order_ref || "").trim();
  const amountVnd = Math.max(0, Math.floor(Number(input.amount_vnd) || 0));
  const subjectEmail = String(input.subject_email || "").trim().toLowerCase();
  if (!code || !orderRef || !amountVnd) {
    return jsonResponse({ status: "validation_failed", detail: "code + order_ref + amount_vnd required" }, { status: 422 });
  }
  const store = platformStore(env);
  const codeRecord = await store.get("affiliate_code", code);
  if (!codeRecord) return jsonResponse({ status: "code_not_found" }, { status: 404 });
  const idemKey = `${code}:${orderRef}`;
  const existing = await store.get("affiliate_conversion_by_order", idemKey);
  if (existing) {
    return jsonResponse({ status: "conversion_already_recorded", conversion_id: existing.id });
  }
  const commissionBps = Number(codeRecord.commission_bps || DEFAULT_COMMISSION_BPS);
  const commissionVnd = Math.floor((amountVnd * commissionBps) / 10000);
  const convId = makeId("CONV_");
  const conversion = {
    id: convId,
    code,
    owner_email: codeRecord.owner_email,
    subject_email: subjectEmail,
    order_ref: orderRef,
    amount_vnd: amountVnd,
    commission_bps: commissionBps,
    commission_vnd: commissionVnd,
    status: "credited",
    created_at: currentUnixSeconds(),
  };
  await store.put("affiliate_conversion", `${code}:${convId}`, conversion, { ttlSeconds: CONVERSION_TTL });
  await store.put("affiliate_conversion_by_order", idemKey, { id: convId }, { ttlSeconds: CONVERSION_TTL });
  codeRecord.conversions = Number(codeRecord.conversions || 0) + 1;
  codeRecord.earned_vnd = Number(codeRecord.earned_vnd || 0) + commissionVnd;
  await store.put("affiliate_code", code, codeRecord, { ttlSeconds: CODE_TTL });

  return jsonResponse({ status: "conversion_recorded", conversion }, { status: 201 });
}

async function handleStats(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const codes = await listKvByPrefix(env, `affiliate_code_by_owner:${ctx.session.candidate_email}`, { limit: 100 });
  const store = platformStore(env);
  let totalClicks = 0;
  let totalConversions = 0;
  let totalEarnedVnd = 0;
  const breakdown = [];
  for (const item of codes.entries) {
    const c = item.value?.code;
    if (!c) continue;
    const cr = await store.get("affiliate_code", c);
    if (!cr) continue;
    totalClicks += Number(cr.clicks || 0);
    totalConversions += Number(cr.conversions || 0);
    totalEarnedVnd += Number(cr.earned_vnd || 0);
    breakdown.push({ code: cr.code, clicks: cr.clicks, conversions: cr.conversions, earned_vnd: cr.earned_vnd });
  }
  return jsonResponse({
    status: "stats_ok",
    total_clicks: totalClicks,
    total_conversions: totalConversions,
    total_earned_vnd: totalEarnedVnd,
    breakdown,
  });
}

export async function maybeHandleAffiliateRuntime(request, env = {}) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/r/")) {
    const code = decodeURIComponent(url.pathname.slice(3)).toLowerCase().trim();
    if (CODE_PATTERN.test(code)) {
      const trackUrl = new URL(request.url);
      trackUrl.pathname = `${BASE}/track`;
      trackUrl.searchParams.set("code", code);
      return handleTrack(new Request(trackUrl.toString(), request), env);
    }
  }

  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "affiliate_ok", default_commission_bps: DEFAULT_COMMISSION_BPS });
  }
  if (request.method === "POST" && url.pathname === `${BASE}/codes`) {
    return handleCreateCode(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/codes/me`) {
    return handleListMyCodes(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/track`) {
    return handleTrack(request, env);
  }
  if (request.method === "POST" && url.pathname === `${BASE}/conversion`) {
    return handleConversion(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/stats`) {
    return handleStats(request, env);
  }
  return jsonResponse({ status: "affiliate_route_not_found", path: url.pathname }, { status: 404 });
}
