import { createAccessStore } from "./access-state.mjs";
import { deriveWalletAddress, isValidWalletAddress, normalizeWalletEmail } from "./wallet-address.mjs";

const WALLET_BASE = "/api/wallet";
const SESSION_COOKIE_NAME = "vtl_session";
const HISTORY_DEFAULT_LIMIT = 50;
const HISTORY_MAX_LIMIT = 200;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;
const PAYOUT_REQUEST_TTL_SECONDS = 180 * 24 * 60 * 60;
const TRANSACTION_TTL_SECONDS = 365 * 24 * 60 * 60;
const MIN_PAYOUT_VND = 200000;
const DEFAULT_PAYOUT_FEE_BPS = 200;

const CREDIT_BUCKETS = new Set(["pending", "available"]);
const DEBIT_BUCKETS = new Set(["available"]);
const KYC_LEVELS = new Set(["none", "basic", "verified"]);
const VALID_TX_TYPES = new Set([
  "credit",
  "debit",
  "transfer_in",
  "transfer_out",
  "payout_request",
  "payout_settled",
  "payout_cancelled",
  "tax_hold",
  "tax_release",
  "promote_pending_to_available",
]);

const BASE64URL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

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

function currentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseCookies(headerValue = "") {
  const entries = String(headerValue || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf("=");
      return index === -1 ? [part, ""] : [part.slice(0, index), part.slice(index + 1)];
    });
  return Object.fromEntries(entries);
}

function decodeBase64Url(value) {
  const normalized = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signValueHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

function isValidEmail(value) {
  const raw = String(value || "").trim();
  if (raw.length < 3 || raw.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

function walletStore(env) {
  return createAccessStore(env);
}

async function readSessionFromRequest(request, env) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const token = cookies[SESSION_COOKIE_NAME] || "";
  if (!token) return null;

  const sessionSecret = getEnvString(env, "SESSION_COOKIE_SECRET") || "debug-session-secret";
  const [encodedPayload, signature] = String(token).split(".");
  if (!encodedPayload || !signature) return null;

  const expected = await signValueHex(sessionSecret, encodedPayload);
  if (!timingSafeEqual(expected, signature)) return null;

  let payload = null;
  try {
    payload = safeJsonParse(new TextDecoder().decode(decodeBase64Url(encodedPayload)), null);
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  if (payload.exp && Number(payload.exp) < currentUnixSeconds()) return null;
  return payload;
}

function makeUlid() {
  const time = Date.now().toString(36).padStart(10, "0");
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  let random = "";
  for (let i = 0; i < randomBytes.length; i += 1) {
    random += BASE64URL_ALPHABET[randomBytes[i] % BASE64URL_ALPHABET.length];
  }
  return `${time}${random}`.toUpperCase();
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

function emptyBalances() {
  return {
    pending_vnd: 0,
    available_vnd: 0,
    tax_held_vnd: 0,
    withdrawn_vnd: 0,
  };
}

function defaultLimits() {
  return {
    min_payout_vnd: MIN_PAYOUT_VND,
    payout_fee_bps: DEFAULT_PAYOUT_FEE_BPS,
  };
}

function defaultKyc() {
  return {
    level: "none",
    verified_at: null,
    full_name: "",
    phone: "",
    id_number_hash: "",
  };
}

function normalizeAmount(value) {
  const amount = Math.floor(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return amount;
}

function isInternalCallAuthorized(request, env) {
  const expected = getEnvString(env, "WALLET_INTERNAL_TOKEN");
  if (!expected) return false;
  const provided = request.headers.get("x-wallet-internal-token") || "";
  return timingSafeEqual(expected, provided);
}

async function readWallet(env, candidateEmail) {
  const store = walletStore(env);
  const email = normalizeWalletEmail(candidateEmail);
  if (!email) return null;
  return store.get("wallets", email);
}

async function writeWallet(env, wallet) {
  const store = walletStore(env);
  await store.put("wallets", wallet.candidate_email, wallet);
  await store.put("wallet_index", wallet.address, { candidate_email: wallet.candidate_email });
}

async function findWalletByAddress(env, address) {
  if (!isValidWalletAddress(address)) return null;
  const store = walletStore(env);
  const index = await store.get("wallet_index", address);
  if (!index || !index.candidate_email) return null;
  return readWallet(env, index.candidate_email);
}

async function appendLedgerEntry(env, wallet, entry) {
  const store = walletStore(env);
  const id = entry.id || makeUlid();
  const record = {
    id,
    address: wallet.address,
    candidate_email: wallet.candidate_email,
    type: entry.type,
    amount_vnd: entry.amount_vnd,
    balance_after: { ...wallet.balances },
    source: String(entry.source || "system"),
    ref: String(entry.ref || ""),
    memo: String(entry.memo || ""),
    counterparty_address: entry.counterparty_address || null,
    created_at: currentUnixSeconds(),
  };
  await store.put("wallet_tx", `${wallet.address}:${id}`, record, {
    ttlSeconds: TRANSACTION_TTL_SECONDS,
  });
  return record;
}

async function readIdempotency(env, key) {
  if (!key) return null;
  const store = walletStore(env);
  return store.get("wallet_idem", key);
}

async function writeIdempotency(env, key, value) {
  if (!key) return;
  const store = walletStore(env);
  await store.put("wallet_idem", key, value, { ttlSeconds: IDEMPOTENCY_TTL_SECONDS });
}

function publicWalletView(wallet) {
  if (!wallet) return null;
  return {
    address: wallet.address,
    level: wallet.level || "Free",
    kyc_level: wallet.kyc?.level || "none",
    created_at: wallet.created_at,
  };
}

function selfWalletView(wallet) {
  if (!wallet) return null;
  return {
    address: wallet.address,
    candidate_email: wallet.candidate_email,
    created_at: wallet.created_at,
    created_from: wallet.created_from,
    level: wallet.level || "Free",
    kyc: wallet.kyc || defaultKyc(),
    balances: wallet.balances || emptyBalances(),
    limits: wallet.limits || defaultLimits(),
    version: wallet.version || 1,
  };
}

export async function ensureWalletForEmail(email, env, { createdFrom = "lazy_get" } = {}) {
  const normalized = normalizeWalletEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, reason: "invalid_email" };
  }

  const existing = await readWallet(env, normalized);
  if (existing && existing.address) {
    return { ok: true, wallet: existing, created: false };
  }

  const address = await deriveWalletAddress(normalized, env);
  if (!address) return { ok: false, reason: "address_derive_failed" };

  const wallet = {
    address,
    candidate_email: normalized,
    created_at: currentUnixSeconds(),
    created_from: createdFrom,
    kyc: defaultKyc(),
    balances: emptyBalances(),
    limits: defaultLimits(),
    level: "Free",
    version: 1,
  };

  await writeWallet(env, wallet);
  return { ok: true, wallet, created: true };
}

async function requireSessionWallet(request, env) {
  const session = await readSessionFromRequest(request, env);
  if (!session || !session.candidate_email) {
    return {
      response: jsonResponse({
        status: "session_required",
        error_code: "SESSION_REQUIRED",
        detail: "vtl_session cookie missing or invalid.",
      }, { status: 401 }),
    };
  }
  const result = await ensureWalletForEmail(session.candidate_email, env, { createdFrom: "lazy_get" });
  if (!result.ok) {
    return {
      response: jsonResponse({
        status: "wallet_unavailable",
        reason: result.reason,
      }, { status: 422 }),
    };
  }
  return { session, wallet: result.wallet, created: result.created };
}

async function handleEnsure(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  return jsonResponse({
    status: ctx.created ? "wallet_created" : "wallet_existing",
    wallet: selfWalletView(ctx.wallet),
  }, { status: ctx.created ? 201 : 200 });
}

async function handleMe(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  return jsonResponse({
    status: "wallet_ok",
    wallet: selfWalletView(ctx.wallet),
  });
}

async function handleLookup(request, env) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address") || "";
  if (!isValidWalletAddress(address)) {
    return jsonResponse({
      status: "address_invalid",
      detail: "Address must match format vtl1 + 32 Bech32 chars.",
    }, { status: 422 });
  }
  const wallet = await findWalletByAddress(env, address);
  if (!wallet) {
    return jsonResponse({ status: "wallet_not_found" }, { status: 404 });
  }
  return jsonResponse({ status: "wallet_ok", wallet: publicWalletView(wallet) });
}

async function listLedger(env, address, { limit, cursor }) {
  const store = walletStore(env);
  const namespace = env?.ACCESS_KV_NAMESPACE;
  if (!namespace || typeof namespace.list !== "function") {
    return { entries: [], next_cursor: null, mode: store.mode };
  }
  const safeLimit = Math.min(Math.max(1, Number(limit) || HISTORY_DEFAULT_LIMIT), HISTORY_MAX_LIMIT);
  const result = await namespace.list({
    prefix: `wallet_tx:${address}:`,
    limit: safeLimit,
    cursor: cursor || undefined,
  });
  const entries = [];
  for (const item of result?.keys || []) {
    const raw = await namespace.get(item.name);
    if (!raw) continue;
    const parsed = safeJsonParse(raw, null);
    if (parsed) entries.push(parsed);
  }
  entries.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return {
    entries,
    next_cursor: result?.list_complete ? null : (result?.cursor || null),
    mode: store.mode,
  };
}

async function handleHistory(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit");
  const cursor = url.searchParams.get("cursor");
  const data = await listLedger(env, ctx.wallet.address, { limit, cursor });
  return jsonResponse({
    status: "wallet_history_ok",
    address: ctx.wallet.address,
    entries: data.entries,
    next_cursor: data.next_cursor,
    storage_mode: data.mode,
  });
}

async function handleCreditOrDebit(request, env, kind) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({
      status: "internal_token_required",
      error_code: "WALLET_INTERNAL_TOKEN_INVALID",
    }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const idempotencyKey = String(request.headers.get("idempotency-key") || input.idempotency_key || "").trim();
  if (!idempotencyKey) {
    return jsonResponse({
      status: "idempotency_key_required",
      detail: "Provide Idempotency-Key header.",
    }, { status: 422 });
  }
  const cached = await readIdempotency(env, `${kind}:${idempotencyKey}`);
  if (cached) {
    return jsonResponse({ status: "wallet_idempotent_replay", ...cached });
  }

  const amount = normalizeAmount(input.amount_vnd);
  if (!amount) {
    return jsonResponse({
      status: "amount_invalid",
      detail: "amount_vnd must be a positive integer.",
    }, { status: 422 });
  }

  const address = String(input.address || "").trim();
  let wallet = null;
  if (address) {
    wallet = await findWalletByAddress(env, address);
  } else if (input.candidate_email) {
    const result = await ensureWalletForEmail(input.candidate_email, env, { createdFrom: "credit_lazy" });
    if (result.ok) wallet = result.wallet;
  }
  if (!wallet) {
    return jsonResponse({ status: "wallet_not_found" }, { status: 404 });
  }

  const bucketRaw = String(input.bucket || (kind === "credit" ? "available" : "available")).toLowerCase();
  const validBuckets = kind === "credit" ? CREDIT_BUCKETS : DEBIT_BUCKETS;
  if (!validBuckets.has(bucketRaw)) {
    return jsonResponse({
      status: "bucket_invalid",
      detail: `bucket must be one of ${Array.from(validBuckets).join(", ")}`,
    }, { status: 422 });
  }
  const field = `${bucketRaw}_vnd`;
  if (kind === "credit") {
    wallet.balances[field] = Math.max(0, Number(wallet.balances[field] || 0) + amount);
  } else {
    const current = Number(wallet.balances[field] || 0);
    if (current < amount) {
      return jsonResponse({
        status: "insufficient_funds",
        detail: `Balance ${current} < requested ${amount}.`,
      }, { status: 409 });
    }
    wallet.balances[field] = current - amount;
  }
  wallet.version = (Number(wallet.version) || 1) + 1;

  await writeWallet(env, wallet);
  const ledger = await appendLedgerEntry(env, wallet, {
    type: kind,
    amount_vnd: amount,
    source: input.source || "system",
    ref: input.ref || "",
    memo: input.memo || "",
  });

  const responsePayload = {
    wallet: selfWalletView(wallet),
    ledger_entry: ledger,
  };
  await writeIdempotency(env, `${kind}:${idempotencyKey}`, responsePayload);
  return jsonResponse({ status: kind === "credit" ? "wallet_credited" : "wallet_debited", ...responsePayload });
}

async function handleTransfer(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const idempotencyKey = String(request.headers.get("idempotency-key") || input.idempotency_key || "").trim();
  if (!idempotencyKey) {
    return jsonResponse({
      status: "idempotency_key_required",
      detail: "Provide Idempotency-Key header.",
    }, { status: 422 });
  }
  const cached = await readIdempotency(env, `transfer:${idempotencyKey}`);
  if (cached) {
    return jsonResponse({ status: "wallet_idempotent_replay", ...cached });
  }

  const amount = normalizeAmount(input.amount_vnd);
  if (!amount) {
    return jsonResponse({ status: "amount_invalid" }, { status: 422 });
  }
  const toAddress = String(input.to_address || "").trim();
  if (!isValidWalletAddress(toAddress) || toAddress === ctx.wallet.address) {
    return jsonResponse({
      status: "to_address_invalid",
      detail: "to_address must be a valid vtl1 address different from sender.",
    }, { status: 422 });
  }
  const recipient = await findWalletByAddress(env, toAddress);
  if (!recipient) {
    return jsonResponse({ status: "recipient_not_found" }, { status: 404 });
  }
  const senderAvailable = Number(ctx.wallet.balances.available_vnd || 0);
  if (senderAvailable < amount) {
    return jsonResponse({
      status: "insufficient_funds",
      detail: `Available ${senderAvailable} < requested ${amount}.`,
    }, { status: 409 });
  }

  ctx.wallet.balances.available_vnd = senderAvailable - amount;
  ctx.wallet.version = (Number(ctx.wallet.version) || 1) + 1;
  recipient.balances.available_vnd = Number(recipient.balances.available_vnd || 0) + amount;
  recipient.version = (Number(recipient.version) || 1) + 1;

  await writeWallet(env, ctx.wallet);
  await writeWallet(env, recipient);

  const senderEntry = await appendLedgerEntry(env, ctx.wallet, {
    type: "transfer_out",
    amount_vnd: amount,
    source: "user",
    ref: input.ref || "",
    memo: input.memo || "",
    counterparty_address: recipient.address,
  });
  const recipientEntry = await appendLedgerEntry(env, recipient, {
    type: "transfer_in",
    amount_vnd: amount,
    source: "user",
    ref: input.ref || "",
    memo: input.memo || "",
    counterparty_address: ctx.wallet.address,
  });

  const responsePayload = {
    wallet: selfWalletView(ctx.wallet),
    sender_entry: senderEntry,
    recipient_entry: recipientEntry,
  };
  await writeIdempotency(env, `transfer:${idempotencyKey}`, responsePayload);
  return jsonResponse({ status: "wallet_transferred", ...responsePayload });
}

async function handlePayoutRequest(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);

  if (ctx.wallet.kyc?.level !== "verified") {
    return jsonResponse({
      status: "kyc_required",
      detail: "Wallet KYC level must be 'verified' before payout.",
    }, { status: 403 });
  }

  const amount = normalizeAmount(input.amount_vnd);
  const minPayout = Number(ctx.wallet.limits?.min_payout_vnd || MIN_PAYOUT_VND);
  if (amount < minPayout) {
    return jsonResponse({
      status: "below_min_payout",
      detail: `Minimum payout is ${minPayout} VND.`,
    }, { status: 422 });
  }
  const available = Number(ctx.wallet.balances.available_vnd || 0);
  if (available < amount) {
    return jsonResponse({
      status: "insufficient_funds",
      detail: `Available ${available} < requested ${amount}.`,
    }, { status: 409 });
  }

  const bankAccount = {
    bank_name: String(input.bank_name || "").trim(),
    account_number: String(input.account_number || "").trim(),
    account_holder: String(input.account_holder || "").trim(),
  };
  if (!bankAccount.bank_name || !bankAccount.account_number || !bankAccount.account_holder) {
    return jsonResponse({
      status: "bank_info_required",
      detail: "bank_name, account_number, account_holder are required.",
    }, { status: 422 });
  }

  const feeBps = Number(ctx.wallet.limits?.payout_fee_bps || DEFAULT_PAYOUT_FEE_BPS);
  const fee = Math.floor((amount * feeBps) / 10000);
  const net = amount - fee;

  ctx.wallet.balances.available_vnd = available - amount;
  ctx.wallet.balances.tax_held_vnd = Number(ctx.wallet.balances.tax_held_vnd || 0) + amount;
  ctx.wallet.version = (Number(ctx.wallet.version) || 1) + 1;
  await writeWallet(env, ctx.wallet);

  const requestId = makeUlid();
  const store = walletStore(env);
  const record = {
    id: requestId,
    address: ctx.wallet.address,
    candidate_email: ctx.wallet.candidate_email,
    amount_vnd: amount,
    fee_vnd: fee,
    net_vnd: net,
    bank_account: bankAccount,
    status: "pending",
    created_at: currentUnixSeconds(),
    settled_at: null,
  };
  await store.put("payout_requests", `${ctx.wallet.address}:${requestId}`, record, {
    ttlSeconds: PAYOUT_REQUEST_TTL_SECONDS,
  });

  await appendLedgerEntry(env, ctx.wallet, {
    type: "payout_request",
    amount_vnd: amount,
    source: "user",
    ref: requestId,
    memo: `Payout request fee=${fee} net=${net}`,
  });

  return jsonResponse({
    status: "payout_requested",
    payout_request: record,
    wallet: selfWalletView(ctx.wallet),
  }, { status: 202 });
}

async function handlePayoutSettle(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({
      status: "internal_token_required",
      error_code: "WALLET_INTERNAL_TOKEN_INVALID",
    }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const address = String(input.address || "").trim();
  const requestId = String(input.request_id || "").trim();
  if (!isValidWalletAddress(address) || !requestId) {
    return jsonResponse({
      status: "params_invalid",
      detail: "address and request_id required.",
    }, { status: 422 });
  }
  const wallet = await findWalletByAddress(env, address);
  if (!wallet) {
    return jsonResponse({ status: "wallet_not_found" }, { status: 404 });
  }
  const store = walletStore(env);
  const record = await store.get("payout_requests", `${address}:${requestId}`);
  if (!record) {
    return jsonResponse({ status: "payout_request_not_found" }, { status: 404 });
  }
  if (record.status !== "pending") {
    return jsonResponse({ status: "payout_already_processed", payout_request: record }, { status: 409 });
  }
  const settledStatus = String(input.settled_status || "settled").toLowerCase();
  if (settledStatus !== "settled" && settledStatus !== "cancelled") {
    return jsonResponse({
      status: "settled_status_invalid",
      detail: "settled_status must be 'settled' or 'cancelled'.",
    }, { status: 422 });
  }

  const heldAmount = Number(record.amount_vnd || 0);
  wallet.balances.tax_held_vnd = Math.max(0, Number(wallet.balances.tax_held_vnd || 0) - heldAmount);
  if (settledStatus === "settled") {
    wallet.balances.withdrawn_vnd = Number(wallet.balances.withdrawn_vnd || 0) + Number(record.net_vnd || heldAmount);
  } else {
    wallet.balances.available_vnd = Number(wallet.balances.available_vnd || 0) + heldAmount;
  }
  wallet.version = (Number(wallet.version) || 1) + 1;
  await writeWallet(env, wallet);

  record.status = settledStatus;
  record.settled_at = currentUnixSeconds();
  record.settlement_ref = String(input.settlement_ref || "");
  await store.put("payout_requests", `${address}:${requestId}`, record, {
    ttlSeconds: PAYOUT_REQUEST_TTL_SECONDS,
  });

  await appendLedgerEntry(env, wallet, {
    type: settledStatus === "settled" ? "payout_settled" : "payout_cancelled",
    amount_vnd: heldAmount,
    source: "ops",
    ref: requestId,
    memo: record.settlement_ref,
  });

  return jsonResponse({
    status: settledStatus === "settled" ? "payout_settled" : "payout_cancelled",
    payout_request: record,
    wallet: selfWalletView(wallet),
  });
}

async function handleKycSubmit(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);

  const level = String(input.level || "").toLowerCase();
  if (!KYC_LEVELS.has(level) || level === "none") {
    return jsonResponse({
      status: "kyc_level_invalid",
      detail: "level must be 'basic' or 'verified'.",
    }, { status: 422 });
  }
  const fullName = String(input.full_name || "").trim();
  const phone = String(input.phone || "").trim();
  const idNumber = String(input.id_number || "").trim();
  if (!fullName || !phone) {
    return jsonResponse({
      status: "kyc_fields_required",
      detail: "full_name and phone are required.",
    }, { status: 422 });
  }
  if (level === "verified" && !idNumber) {
    return jsonResponse({
      status: "kyc_id_required",
      detail: "id_number is required for verified level.",
    }, { status: 422 });
  }

  const idHash = idNumber
    ? Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ctx.wallet.address}:${idNumber}`))),
        (byte) => byte.toString(16).padStart(2, "0")).join("")
    : "";

  ctx.wallet.kyc = {
    level,
    verified_at: currentUnixSeconds(),
    full_name: fullName,
    phone,
    id_number_hash: idHash,
  };
  ctx.wallet.version = (Number(ctx.wallet.version) || 1) + 1;
  await writeWallet(env, ctx.wallet);

  return jsonResponse({
    status: "kyc_updated",
    wallet: selfWalletView(ctx.wallet),
  });
}

async function handleKycStatus(request, env) {
  const ctx = await requireSessionWallet(request, env);
  if (ctx.response) return ctx.response;
  return jsonResponse({
    status: "kyc_ok",
    kyc: ctx.wallet.kyc || defaultKyc(),
  });
}

export async function maybeHandleWalletRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(WALLET_BASE)) return null;

  if (request.method === "GET" && url.pathname === `${WALLET_BASE}/health`) {
    const store = walletStore(env);
    return jsonResponse({
      status: "wallet_runtime_ok",
      storage_mode: store.mode,
      base: WALLET_BASE,
      version: "v1",
    });
  }

  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/ensure`) {
    return handleEnsure(request, env);
  }
  if (request.method === "GET" && url.pathname === `${WALLET_BASE}/me`) {
    return handleMe(request, env);
  }
  if (request.method === "GET" && url.pathname === `${WALLET_BASE}/lookup`) {
    return handleLookup(request, env);
  }
  if (request.method === "GET" && url.pathname === `${WALLET_BASE}/history`) {
    return handleHistory(request, env);
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/credit`) {
    return handleCreditOrDebit(request, env, "credit");
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/debit`) {
    return handleCreditOrDebit(request, env, "debit");
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/transfer`) {
    return handleTransfer(request, env);
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/payout/request`) {
    return handlePayoutRequest(request, env);
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/payout/settle`) {
    return handlePayoutSettle(request, env);
  }
  if (request.method === "POST" && url.pathname === `${WALLET_BASE}/kyc/submit`) {
    return handleKycSubmit(request, env);
  }
  if (request.method === "GET" && url.pathname === `${WALLET_BASE}/kyc/status`) {
    return handleKycStatus(request, env);
  }

  return jsonResponse({
    status: "wallet_route_not_found",
    path: url.pathname,
    method: request.method,
  }, { status: 404 });
}
