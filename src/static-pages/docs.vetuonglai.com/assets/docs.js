(function () {
  "use strict";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- Language switcher --- */
  function getDocsLang() {
    return localStorage.getItem("docs-lang") === "en" ? "en" : "vi";
  }

  function applyBilingualText(lang) {
    document.querySelectorAll("[data-vi][data-en]").forEach(function (el) {
      var value = el.getAttribute(lang === "en" ? "data-en" : "data-vi");
      if (value) el.textContent = value;
    });
  }

  function applyDocsLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("docs-lang", lang);
    document.querySelectorAll(".docs-lang button[data-lang]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
    applyBilingualText(lang);
  }

  /* --- Referral disclosure helper --- */
  var DEFAULT_REFERRAL_DISCLOSURE = {
    vi: "Lien ket nay co the mang lai loi ich cho nguoi gioi thieu. Ban khong tra them phi khi dang ky qua lien ket nay.",
    en: "This link may provide a benefit to the person who shared it. You do not pay extra when you sign up through this link."
  };

  function createReferralDisclosure(options) {
    var opts = options || {};
    var lang = opts.lang === "en" ? "en" : getDocsLang();
    var viText = opts.viText || DEFAULT_REFERRAL_DISCLOSURE.vi;
    var enText = opts.enText || DEFAULT_REFERRAL_DISCLOSURE.en;

    var wrapper = document.createElement("div");
    wrapper.className = "referral-disclosure" + (opts.inline ? " referral-disclosure--inline" : "");
    wrapper.setAttribute("role", "note");
    wrapper.setAttribute("aria-label", opts.ariaLabel || "Referral disclosure");

    var text = document.createElement("p");
    text.className = "referral-disclosure__text";
    text.setAttribute("data-vi", viText);
    text.setAttribute("data-en", enText);
    text.textContent = lang === "en" ? enText : viText;

    wrapper.appendChild(text);
    return wrapper;
  }

  function mountReferralDisclosure(target, options) {
    if (!target || !target.parentNode) return null;
    var disclosure = createReferralDisclosure(options);
    target.parentNode.insertBefore(disclosure, target.nextSibling);
    return disclosure;
  }

  function initReferralDisclosure() {
    document.querySelectorAll("[data-referral-disclosure]").forEach(function (slot) {
      if (slot.querySelector(".referral-disclosure__text")) return;
      var disclosure = createReferralDisclosure({
        viText: slot.getAttribute("data-vi") || DEFAULT_REFERRAL_DISCLOSURE.vi,
        enText: slot.getAttribute("data-en") || DEFAULT_REFERRAL_DISCLOSURE.en,
        inline: slot.getAttribute("data-inline") === "true"
      });
      slot.replaceWith(disclosure);
    });

    document.querySelectorAll("a[data-referral-link]").forEach(function (link) {
      var next = link.nextElementSibling;
      if (next && next.classList.contains("referral-disclosure")) return;
      mountReferralDisclosure(link, {
        viText: link.getAttribute("data-disclosure-vi") || DEFAULT_REFERRAL_DISCLOSURE.vi,
        enText: link.getAttribute("data-disclosure-en") || DEFAULT_REFERRAL_DISCLOSURE.en,
        inline: link.getAttribute("data-disclosure-inline") !== "false"
      });
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
    initReferralDisclosure();
    initSidebar();
    initToc();
    initCopyCode();

    window.DocsReferralDisclosure = {
      create: createReferralDisclosure,
      mount: mountReferralDisclosure
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
