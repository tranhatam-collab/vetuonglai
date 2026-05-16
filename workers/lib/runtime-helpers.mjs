import { createAccessStore } from "./access-state.mjs";

export const SESSION_COOKIE_NAME = "vtl_session";

export function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(body, null, 2), { ...init, headers });
}

export function getEnvString(env, key) {
  const value = env?.[key];
  return typeof value === "string" ? value : "";
}

export function currentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function safeJsonParse(value, fallback = null) {
  try { return JSON.parse(value); } catch { return fallback; }
}

export function parseCookies(headerValue = "") {
  const entries = String(headerValue || "")
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf("=");
      return i === -1 ? [p, ""] : [p.slice(0, i), p.slice(i + 1)];
    });
  return Object.fromEntries(entries);
}

export function decodeBase64Url(value) {
  const norm = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = norm + "=".repeat((4 - (norm.length % 4 || 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

export async function signValueHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function timingSafeEqual(a, b) {
  const l = String(a || "");
  const r = String(b || "");
  if (l.length !== r.length) return false;
  let d = 0;
  for (let i = 0; i < l.length; i += 1) d |= l.charCodeAt(i) ^ r.charCodeAt(i);
  return d === 0;
}

export function isValidEmail(value) {
  const raw = String(value || "").trim();
  if (raw.length < 3 || raw.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

export function platformStore(env) {
  return createAccessStore(env);
}

export async function readSessionFromRequest(request, env) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const token = cookies[SESSION_COOKIE_NAME] || "";
  if (!token) return null;
  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  const [encoded, sig] = String(token).split(".");
  if (!encoded || !sig) return null;
  const expected = await signValueHex(sessionSecret, encoded);
  if (!timingSafeEqual(expected, sig)) return null;
  let payload = null;
  try { payload = safeJsonParse(new TextDecoder().decode(decodeBase64Url(encoded)), null); }
  catch { return null; }
  if (!payload || typeof payload !== "object") return null;
  if (payload.exp && Number(payload.exp) < currentUnixSeconds()) return null;
  return payload;
}

const BASE64URL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function makeId(prefix = "") {
  const time = Date.now().toString(36).padStart(10, "0");
  const rand = crypto.getRandomValues(new Uint8Array(12));
  let r = "";
  for (let i = 0; i < rand.length; i += 1) r += BASE64URL_ALPHABET[rand[i] % BASE64URL_ALPHABET.length];
  return `${prefix}${time}${r}`.toUpperCase();
}

export async function readRequestJson(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}

export async function requireSession(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session || !session.candidate_email) {
    return {
      response: jsonResponse({
        status: "session_required",
        error_code: "SESSION_REQUIRED",
      }, { status: 401 }),
    };
  }
  return { session };
}

export function isInternalCallAuthorized(request, env, secretKey = "WALLET_INTERNAL_TOKEN") {
  const expected = getEnvString(env, secretKey);
  if (!expected) return false;
  const provided = request.headers.get("x-internal-token") || request.headers.get("x-wallet-internal-token") || "";
  return timingSafeEqual(expected, provided);
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listKvByPrefix(env, prefix, { limit = 50, cursor } = {}) {
  const ns = env?.ACCESS_KV_NAMESPACE;
  if (!ns || typeof ns.list !== "function") return { entries: [], next_cursor: null, mode: "memory" };
  const result = await ns.list({ prefix: `${prefix}:`, limit, cursor: cursor || undefined });
  const entries = [];
  for (const item of result?.keys || []) {
    const raw = await ns.get(item.name);
    if (!raw) continue;
    const parsed = safeJsonParse(raw, null);
    if (parsed) entries.push({ key: item.name, value: parsed });
  }
  return {
    entries,
    next_cursor: result?.list_complete ? null : (result?.cursor || null),
    mode: "kv",
  };
}

export function isFounderEmail(email, env) {
  const allow = String(getEnvString(env, "FOUNDER_EMAILS") || "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (allow.length === 0) {
    return ["anhhatam@gmail.com", "tranhatam@gmail.com"].includes(String(email || "").toLowerCase());
  }
  return allow.includes(String(email || "").toLowerCase());
}
