function normalizeReadLanguage(value) {
  return value === "en" ? "en" : "vi";
}

function getReadLanguage() {
  const url = new URL(window.location.href);
  const stored = localStorage.getItem("read.lang");
  return normalizeReadLanguage(url.searchParams.get("lang") || stored);
}

function applyReadLanguage(language) {
  document.documentElement.lang = language;
  localStorage.setItem("read.lang", language);

  document.querySelectorAll("[data-vi][data-en]").forEach((node) => {
    const value = node.getAttribute(language === "en" ? "data-en" : "data-vi");
    if (value !== null) node.textContent = value;
  });

  // Sync lang switch buttons
  document.querySelectorAll(".read-lang button[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === language);
  });
}

function initReadLanguage() {
  const language = getReadLanguage();
  applyReadLanguage(language);

  // Wire up lang switch buttons
  document.querySelectorAll(".read-lang button[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyReadLanguage(btn.getAttribute("data-lang"));
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReadLanguage, { once: true });
} else {
  initReadLanguage();
}
