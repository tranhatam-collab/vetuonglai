function normalizeReadLanguage(value) {
  return value === "en" ? "en" : "vi";
}

function getReadLanguage() {
  const url = new URL(window.location.href);
  return normalizeReadLanguage(url.searchParams.get("lang"));
}

function applyReadLanguage(language) {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-vi][data-en]").forEach((node) => {
    const value = node.getAttribute(language === "en" ? "data-en" : "data-vi");
    if (value !== null) node.textContent = value;
  });
}

function initReadLanguage() {
  const language = getReadLanguage();
  applyReadLanguage(language);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReadLanguage, { once: true });
} else {
  initReadLanguage();
}
