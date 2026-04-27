const STORAGE_KEY = "vetuonglai.language";
const TELEMETRY_STORAGE_KEY = "vetuonglai.telemetry.v1";
const MEMBER_STATE_DATASET_KEY = "memberState";

let memberStateHint = "unknown";

function normalizeLanguage(value) {
  return value === "en" ? "en" : "vi";
}

function currentLanguage() {
  return normalizeLanguage(document.documentElement.dataset.language);
}

function escapeLabel(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function translatedPair(node, fallback) {
  const raw = node.getAttribute(`data-${fallback}`) || node.textContent || "";
  return {
    vi: node.getAttribute(`data-copy-${fallback}-vi`)
      || node.getAttribute(`data-${fallback}-vi`)
      || raw,
    en: node.getAttribute(`data-copy-${fallback}-en`)
      || node.getAttribute(`data-${fallback}-en`)
      || raw,
  };
}

function translatedLabel(node, language, fallback) {
  const pair = translatedPair(node, fallback);
  return pair[language] || pair.vi;
}

function applyLocalizedLabel(node, fallback) {
  const pair = translatedPair(node, fallback);
  node.setAttribute("data-text-vi", pair.vi);
  node.setAttribute("data-text-en", pair.en);
  node.textContent = pair[currentLanguage()] || pair.vi;
}

function syncLocalizedNodes(language) {
  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.hidden = node.getAttribute("data-lang") !== language;
  });

  document.querySelectorAll("[data-html-vi], [data-html-en]").forEach((node) => {
    const html = node.getAttribute(`data-html-${language}`);
    if (html !== null) node.innerHTML = html;
  });

  document.querySelectorAll("[data-text-vi], [data-text-en]").forEach((node) => {
    const text = node.getAttribute(`data-text-${language}`);
    if (text !== null) node.textContent = text;
  });

  document.querySelectorAll("[data-content-vi], [data-content-en]").forEach((node) => {
    const content = node.getAttribute(`data-content-${language}`);
    if (content !== null) node.setAttribute("content", content);
  });

  document.querySelectorAll("[data-title-vi], [data-title-en]").forEach((node) => {
    const title = node.getAttribute(`data-title-${language}`);
    if (title) node.setAttribute("title", title);
  });

  document.querySelectorAll("[data-aria-label-vi], [data-aria-label-en]").forEach((node) => {
    const label = node.getAttribute(`data-aria-label-${language}`);
    if (label) node.setAttribute("aria-label", label);
  });

  document.querySelectorAll("[data-placeholder-vi], [data-placeholder-en]").forEach((node) => {
    const placeholder = node.getAttribute(`data-placeholder-${language}`);
    if (placeholder !== null) node.setAttribute("placeholder", placeholder);
  });
}

function syncLanguageControls(language) {
  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const active = button.getAttribute("data-language-option") === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setLanguage(language, { updateUrl = true } = {}) {
  const normalized = normalizeLanguage(language);
  document.documentElement.dataset.language = normalized;
  document.documentElement.lang = normalized;
  window.localStorage.setItem(STORAGE_KEY, normalized);
  syncLocalizedNodes(normalized);
  syncLanguageControls(normalized);

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", normalized);
    window.history.replaceState({}, "", url);
  }

  window.dispatchEvent(new CustomEvent("vetuonglai:languagechange", {
    detail: { language: normalized },
  }));
}

async function handleCopy(button) {
  const value = button.getAttribute("data-copy") || "";
  if (!value) return;

  const language = currentLanguage();
  const original = translatedPair(button, "label");
  const success = translatedLabel(button, language, "success");
  const error = translatedLabel(button, language, "error");

  try {
    await navigator.clipboard.writeText(value);
    button.textContent = success;
    window.setTimeout(() => {
      if (button.hasAttribute("data-label-vi") || button.hasAttribute("data-label-en")) {
        applyLocalizedLabel(button, "label");
      } else {
        button.textContent = original[language] || original.vi;
      }
    }, 1400);
  } catch {
    button.textContent = error;
    window.setTimeout(() => {
      if (button.hasAttribute("data-label-vi") || button.hasAttribute("data-label-en")) {
        applyLocalizedLabel(button, "label");
      } else {
        button.textContent = original[language] || original.vi;
      }
    }, 1400);
  }
}

document.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-copy]") : null;
  if (!(button instanceof HTMLElement)) return;
  handleCopy(button);
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.querySelectorAll("[data-language-option]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.getAttribute("data-language-option"));
  });
});

const initialLanguage = (() => {
  const url = new URL(window.location.href);
  return normalizeLanguage(url.searchParams.get("lang") || window.localStorage.getItem(STORAGE_KEY) || document.documentElement.dataset.language || "vi");
})();

window.vetuonglaiCurrentLanguage = currentLanguage;
window.vetuonglaiSetLanguage = setLanguage;
window.vetuonglaiSyncLanguage = () => {
  const language = currentLanguage();
  syncLocalizedNodes(language);
  syncLanguageControls(language);
};

window.vetuonglaiSetMemberState = (value) => {
  const normalized = String(value || "unknown").trim() || "unknown";
  memberStateHint = normalized;
  document.documentElement.dataset[MEMBER_STATE_DATASET_KEY] = normalized;
  return normalized;
};

window.vetuonglaiCurrentMemberState = () => {
  const fromDataset = document.documentElement.dataset[MEMBER_STATE_DATASET_KEY];
  return String(fromDataset || memberStateHint || "unknown");
};

window.vetuonglaiTrack = (event, payload = {}) => {
  const language = currentLanguage();
  const memberState = window.vetuonglaiCurrentMemberState();
  const telemetryEvent = {
    event: String(event || "unknown"),
    payload: {
      route: window.location.pathname,
      screen: String(payload.screen || window.location.pathname),
      language,
      member_state: memberState,
      ...payload,
    },
    path: window.location.pathname,
    at: new Date().toISOString(),
  };

  try {
    const current = JSON.parse(window.localStorage.getItem(TELEMETRY_STORAGE_KEY) || "[]");
    current.push(telemetryEvent);
    window.localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(current.slice(-250)));
  } catch {
    // Ignore telemetry storage failures; tracking is best-effort only.
  }

  return telemetryEvent;
};

if (window.location.pathname.startsWith("/app/") && window.__VTL_MOBILE_APP_OPEN_TRACKED !== true) {
  window.__VTL_MOBILE_APP_OPEN_TRACKED = true;
  window.vetuonglaiTrack("mobile_app_open", {
    source: "shared_app_bootstrap",
  });
}

// ---------------------------------------------------------------------------
// Team 2 — CTA Routing to Homepage Purchase Hub
// Mọi deep CTA trên subdomain phải dẫn về vetuonglai.com với đúng params.
// Team 2 KHÔNG xử lý payment logic — chỉ build URL và redirect.
// Contract nguồn: src/data/access-model.json (Team 1 ownership)
// ---------------------------------------------------------------------------

const CTA_HUB_ORIGIN = "https://vetuonglai.com";
const CTA_HUB_FALLBACK_PATH = "/bat-dau/";

const CTA_VALID_INTENTS = ["annual-access", "specialist-pack"];
const CTA_INTENT_ALIASES = {
  "annual": "annual-access",
  "pack": "specialist-pack",
  "course-depth": "specialist-pack",
  "course-card": "specialist-pack",
  "course-list": "specialist-pack",
  "course-list-item": "specialist-pack",
  "course-detail": "specialist-pack",
  "job-apply": "specialist-pack",
  "work-depth": "specialist-pack",
  "brief": "specialist-pack",
  "market-buy": "specialist-pack",
  "market-rules": "specialist-pack",
  "market-depth": "specialist-pack",
  "green-depth": "specialist-pack",
  "finance-depth": "specialist-pack",
  "life-depth": "specialist-pack",
  "invest-depth": "specialist-pack",
  "member-depth": "specialist-pack",
  "journey": "specialist-pack",
  "community-depth": "specialist-pack",
  "ai-depth": "specialist-pack",
  "business-depth": "specialist-pack",
  "business-intake": "specialist-pack",
};

const CTA_VALID_PACKS = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"];
const CTA_VALID_GATEWAYS = ["pay", "paypal", "stripe"];
const CTA_GATEWAY_ALIASES = {
  "payos": "pay",
  "pay.iai.one": "pay",
  "pay-iai-one": "pay",
  "pay_iai_one": "pay",
};

function resolveCtaIntent(raw) {
  if (!raw) return null;
  const lower = String(raw).toLowerCase().trim();
  if (CTA_VALID_INTENTS.includes(lower)) return lower;
  return CTA_INTENT_ALIASES[lower] || null;
}

function resolveCtaGateway(raw) {
  if (!raw) return null;
  const lower = String(raw).toLowerCase().trim();
  if (CTA_VALID_GATEWAYS.includes(lower)) return lower;
  return CTA_GATEWAY_ALIASES[lower] || null;
}

function resolveCtaPack(raw) {
  if (!raw) return null;
  const lower = String(raw).toLowerCase().trim();
  return CTA_VALID_PACKS.includes(lower) ? lower : null;
}

/**
 * Xây URL dẫn về homepage purchase hub.
 * Team 2 chỉ build URL — không gọi /api/access/checkout/resolve.
 * Checkout session sẽ do homepage + Team 1 runtime xử lý.
 *
 * @param {Object} opts
 * @param {string} opts.entry     — subdomain gốc (vc, edu, finance, ...)
 * @param {string} opts.intent    — annual-access | specialist-pack (hoặc alias)
 * @param {string} [opts.pack]    — g1..g9
 * @param {string} [opts.source]  — source tag
 * @param {string} [opts.slug]    — content identifier
 * @param {string} [opts.gateway] — pay | paypal | stripe (hoặc alias)
 * @param {string} [opts.ref]     — affiliate/campaign code
 * @param {string} [opts.returnTo]— đường dẫn quay lại sau checkout
 * @returns {string} URL tuyệt đối dẫn về homepage purchase hub
 */
function buildPurchaseHubUrl(opts) {
  const intent = resolveCtaIntent(opts.intent);
  if (!intent) {
    return CTA_HUB_ORIGIN + CTA_HUB_FALLBACK_PATH;
  }

  const url = new URL(CTA_HUB_ORIGIN + "/");
  const entry = String(opts.entry || "hub").toLowerCase().trim();
  url.searchParams.set("entry", entry);
  url.searchParams.set("intent", intent);

  const pack = resolveCtaPack(opts.pack);
  if (pack) url.searchParams.set("pack", pack);

  if (opts.source) url.searchParams.set("source", String(opts.source).trim());
  if (opts.slug) url.searchParams.set("slug", String(opts.slug).trim());

  const gateway = resolveCtaGateway(opts.gateway);
  if (gateway) url.searchParams.set("gateway", gateway);

  const lang = currentLanguage();
  url.searchParams.set("lang", lang);

  if (opts.ref && intent !== "annual-access") {
    url.searchParams.set("ref", String(opts.ref).trim());
  }

  if (opts.returnTo) url.searchParams.set("return_to", String(opts.returnTo).trim());

  return url.toString();
}

/**
 * Xử lý click trên CTA elements có data-cta-intent.
 * Không gọi API — chỉ redirect về homepage purchase hub.
 */
function handleCtaClick(event) {
  const ctaEl = event.target instanceof Element
    ? event.target.closest("[data-cta-intent]")
    : null;
  if (!ctaEl) return;

  event.preventDefault();

  const opts = {
    entry: ctaEl.getAttribute("data-cta-entry")
      || detectEntryFromHostname(),
    intent: ctaEl.getAttribute("data-cta-intent"),
    pack: ctaEl.getAttribute("data-cta-pack"),
    source: ctaEl.getAttribute("data-cta-source"),
    slug: ctaEl.getAttribute("data-cta-slug"),
    gateway: ctaEl.getAttribute("data-cta-gateway"),
    ref: ctaEl.getAttribute("data-cta-ref"),
    returnTo: ctaEl.getAttribute("data-cta-return-to")
      || window.location.pathname,
  };

  const hubUrl = buildPurchaseHubUrl(opts);

  window.vetuonglaiTrack("cta_click", {
    intent: opts.intent,
    pack: opts.pack || "",
    source: opts.source || "",
    entry: opts.entry,
    destination: hubUrl,
  });

  window.location.href = hubUrl;
}

/**
 * Tự phát hiện entry từ hostname hiện tại.
 * vc.vetuonglai.com → "vc", edu.vetuonglai.com → "edu", v.v.
 */
function detectEntryFromHostname() {
  const host = window.location.hostname;
  const match = host.match(/^([a-z0-9-]+)\.vetuonglai\.com$/);
  if (match && match[1] !== "www") return match[1];
  return "hub";
}

document.addEventListener("click", handleCtaClick);

// Expose cho các surface khác dùng programmatically
window.vetuonglaiBuildPurchaseHubUrl = buildPurchaseHubUrl;
window.vetuonglaiDetectEntry = detectEntryFromHostname;

setLanguage(initialLanguage, { updateUrl: !new URL(window.location.href).searchParams.has("lang") });
