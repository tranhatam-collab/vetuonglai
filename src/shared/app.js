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

setLanguage(initialLanguage, { updateUrl: !new URL(window.location.href).searchParams.has("lang") });
