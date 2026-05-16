import {
  jsonResponse, currentUnixSeconds, platformStore, requireSession,
  readRequestJson, makeId, listKvByPrefix, isInternalCallAuthorized, isValidEmail,
} from "./runtime-helpers.mjs";

const BASE = "/api/notify";
const NOTIFICATION_TTL = 90 * 24 * 60 * 60;
const TEMPLATE_TTL = 365 * 24 * 60 * 60;
const TITLE_MAX = 140;
const BODY_MAX = 4000;

const DEFAULT_TEMPLATES = {
  wallet_credited: {
    subject_vi: "Ví của bạn vừa được cộng {amount} VND",
    subject_en: "Your wallet was credited {amount} VND",
    body_vi: "Xin chào {recipient_email}, ví VTL của bạn vừa được cộng {amount} VND từ {source}.",
    body_en: "Hi {recipient_email}, your VTL wallet was credited {amount} VND from {source}.",
  },
  job_application_received: {
    subject_vi: "Có ứng viên mới cho tin tuyển dụng của bạn",
    subject_en: "New applicant for your job listing",
    body_vi: "{applicant} vừa ứng tuyển vào: {listing_title}.",
    body_en: "{applicant} just applied to: {listing_title}.",
  },
  community_reply: {
    subject_vi: "Có người vừa trả lời bài của bạn",
    subject_en: "Someone replied to your post",
    body_vi: "{author} đã trả lời bài của bạn: {post_title}.",
    body_en: "{author} replied to your post: {post_title}.",
  },
  generic: {
    subject_vi: "{subject}",
    subject_en: "{subject}",
    body_vi: "{body}",
    body_en: "{body}",
  },
};

function applyTemplate(tpl, lang, vars) {
  const subjectKey = lang === "en" ? "subject_en" : "subject_vi";
  const bodyKey = lang === "en" ? "body_en" : "body_vi";
  let subject = tpl[subjectKey] || tpl.subject_vi || "";
  let body = tpl[bodyKey] || tpl.body_vi || "";
  for (const [k, v] of Object.entries(vars || {})) {
    const re = new RegExp(`\\{${k}\\}`, "g");
    subject = subject.replace(re, String(v ?? ""));
    body = body.replace(re, String(v ?? ""));
  }
  return { subject: subject.slice(0, TITLE_MAX), body: body.slice(0, BODY_MAX) };
}

async function loadTemplate(env, name) {
  const store = platformStore(env);
  const custom = await store.get("notify_template", name);
  if (custom) return custom;
  return DEFAULT_TEMPLATES[name] || DEFAULT_TEMPLATES.generic;
}

async function handleSend(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({ status: "internal_token_required" }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const recipient = String(input.recipient_email || "").trim().toLowerCase();
  if (!isValidEmail(recipient)) {
    return jsonResponse({ status: "recipient_invalid" }, { status: 422 });
  }
  const templateName = String(input.template || "generic").trim();
  const lang = (input.lang === "en") ? "en" : "vi";
  const vars = { recipient_email: recipient, ...(input.vars || {}) };
  const tpl = await loadTemplate(env, templateName);
  const rendered = applyTemplate(tpl, lang, vars);

  const id = makeId("NOTIF_");
  const record = {
    id,
    recipient_email: recipient,
    template: templateName,
    lang,
    subject: rendered.subject,
    body: rendered.body,
    channels: Array.isArray(input.channels) ? input.channels : ["inbox"],
    status: "queued",
    created_at: currentUnixSeconds(),
    delivered_at: null,
    delivery_provider: null,
  };

  const store = platformStore(env);
  await store.put("notify_message", `${recipient}:${id}`, record, { ttlSeconds: NOTIFICATION_TTL });
  await store.put("notify_inbox", `${recipient}:${id}`, { id, unread: true }, { ttlSeconds: NOTIFICATION_TTL });
  return jsonResponse({ status: "notification_queued", notification: record }, { status: 202 });
}

async function handleInbox(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const data = await listKvByPrefix(env, `notify_inbox:${ctx.session.candidate_email}`, { limit: 50 });
  const store = platformStore(env);
  const messages = [];
  for (const item of data.entries) {
    const ref = item.value;
    if (!ref?.id) continue;
    const msg = await store.get("notify_message", `${ctx.session.candidate_email}:${ref.id}`);
    if (msg) messages.push({ ...msg, unread: ref.unread !== false });
  }
  messages.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({ status: "inbox_ok", messages });
}

async function handleMarkRead(request, env, id) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const store = platformStore(env);
  const inboxKey = `${ctx.session.candidate_email}:${id}`;
  const ref = await store.get("notify_inbox", inboxKey);
  if (!ref) return jsonResponse({ status: "not_found" }, { status: 404 });
  ref.unread = false;
  ref.read_at = currentUnixSeconds();
  await store.put("notify_inbox", inboxKey, ref, { ttlSeconds: NOTIFICATION_TTL });
  return jsonResponse({ status: "marked_read" });
}

async function handleSetTemplate(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({ status: "internal_token_required" }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const name = String(input.name || "").trim();
  if (!name) return jsonResponse({ status: "name_required" }, { status: 422 });
  const tpl = {
    subject_vi: String(input.subject_vi || "").slice(0, 200),
    subject_en: String(input.subject_en || input.subject_vi || "").slice(0, 200),
    body_vi: String(input.body_vi || "").slice(0, 4000),
    body_en: String(input.body_en || input.body_vi || "").slice(0, 4000),
    updated_at: currentUnixSeconds(),
  };
  const store = platformStore(env);
  await store.put("notify_template", name, tpl, { ttlSeconds: TEMPLATE_TTL });
  return jsonResponse({ status: "template_saved", name, template: tpl });
}

export async function maybeHandleNotifyRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "notify_ok", templates: Object.keys(DEFAULT_TEMPLATES) });
  }
  if (request.method === "POST" && url.pathname === `${BASE}/send`) {
    return handleSend(request, env);
  }
  if (request.method === "POST" && url.pathname === `${BASE}/template`) {
    return handleSetTemplate(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/inbox`) {
    return handleInbox(request, env);
  }
  const markMatch = url.pathname.match(/^\/api\/notify\/inbox\/([^/]+)\/read$/);
  if (markMatch && request.method === "POST") {
    return handleMarkRead(request, env, markMatch[1]);
  }
  return jsonResponse({ status: "notify_route_not_found", path: url.pathname }, { status: 404 });
}
