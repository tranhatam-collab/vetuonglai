(function () {
  "use strict";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- Language switcher --- */
  function getDocsLang() {
    return localStorage.getItem("docs-lang") === "en" ? "en" : "vi";
  }

  function applyDocsLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("docs-lang", lang);
    document.querySelectorAll(".docs-lang button[data-lang]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
  }

  /* --- Sidebar toggle (mobile) --- */
  function initSidebar() {
    var toggle = document.querySelector(".docs-sidebar-toggle");
    var sidebar = document.querySelector(".docs-sidebar");
    if (!toggle || !sidebar) return;

    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("is-open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
      }
    });
    document.addEventListener("click", function (e) {
      if (sidebar.classList.contains("is-open") && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove("is-open");
      }
    });
  }

  /* --- Table of contents highlight --- */
  function initToc() {
    var headings = document.querySelectorAll(".docs-main h2[id], .docs-main h3[id]");
    if (!headings.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        document.querySelectorAll(".docs-toc a[href]").forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "0px 0px -60% 0px", threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* --- Copy code blocks --- */
  function initCopyCode() {
    document.querySelectorAll(".docs-code pre").forEach(function (pre) {
      var btn = document.createElement("button");
      btn.className = "docs-copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.textContent).then(function () {
          btn.textContent = "Copied!";
          if (!prefersReducedMotion.matches) {
            btn.style.transition = "opacity .2s";
          }
          setTimeout(function () { btn.textContent = "Copy"; }, 1500);
        });
      });
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }

  /* --- Init --- */
  function init() {
    applyDocsLang(getDocsLang());
    document.querySelectorAll(".docs-lang button[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyDocsLang(btn.getAttribute("data-lang"));
      });
    });
    initSidebar();
    initToc();
    initCopyCode();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
