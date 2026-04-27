// KIDS subdomain — minimal runtime: i18n switch + curriculum loader.
// No live backend yet — this is Member Preview. All flows are stubbed.
(function () {
  "use strict";

  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function currentLang() {
    const stored = localStorage.getItem("kids.lang");
    const q = param("lang");
    return (q === "en" || q === "vi") ? q : (stored === "en" ? "en" : "vi");
  }

  function setLang(lang) {
    localStorage.setItem("kids.lang", lang);
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    document.querySelectorAll("[data-vi], [data-en]").forEach((el) => {
      const txt = el.getAttribute("data-" + lang);
      if (txt != null) el.textContent = txt;
    });
    document.querySelectorAll("[data-vi-html], [data-en-html]").forEach((el) => {
      const html = el.getAttribute("data-" + lang + "-html");
      if (html != null) el.innerHTML = html;
    });
    document.querySelectorAll("[data-vi-placeholder], [data-en-placeholder]").forEach((el) => {
      const ph = el.getAttribute("data-" + lang + "-placeholder");
      if (ph != null) el.setAttribute("placeholder", ph);
    });
    document.querySelectorAll(".kids-lang a").forEach((a) => {
      a.setAttribute("aria-current", a.dataset.lang === lang ? "true" : "false");
    });
  }

  function wireLang() {
    document.querySelectorAll(".kids-lang a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setLang(a.dataset.lang);
      });
    });
  }

  let curriculumCache = null;
  async function loadCurriculum() {
    if (curriculumCache) return curriculumCache;
    try {
      const res = await fetch("/api/curriculum.json", { credentials: "omit" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      curriculumCache = await res.json();
      return curriculumCache;
    } catch {
      return null;
    }
  }

  async function renderStages(targetSel) {
    const target = document.querySelector(targetSel);
    if (!target) return;
    const data = await loadCurriculum();
    if (!data || !Array.isArray(data.stages)) {
      target.innerHTML = '<p class="error-banner" data-vi="Không thể tải chương trình học." data-en="Could not load curriculum.">Không thể tải chương trình học.</p>';
      return;
    }
    const lang = currentLang();
    const labelKey = lang === "en" ? "labelEn" : "labelVi";
    target.innerHTML = data.stages.map((s, i) => {
      const tracks = (s.tracks || []).map((t) => `
        <div class="track-item">
          <strong>${escHtml(t["labelVi"] || t.key)}</strong>
          <div class="chip-list">${(t.items || []).map((it) => `<span class="chip">${escHtml(it)}</span>`).join("")}</div>
        </div>`).join("");
      return `
        <article class="surface stack-md stage-card">
          <div class="stage-num" aria-hidden="true">${i + 1}</div>
          <div>
            <p class="age">${escHtml(s.ageRange)} · ${escHtml(s[labelKey] || s.labelVi)}</p>
            <h3>${escHtml(s.labelVi)}</h3>
            <p class="status-line">${(s.objectives || []).join(" · ")}</p>
            <div class="track-list">${tracks}</div>
            <p class="status-line"><strong data-vi="Dự án" data-en="Projects">Dự án</strong>: ${(s.projects || []).join(" · ")}</p>
            <p class="status-line"><strong data-vi="Đầu ra" data-en="Outputs">Đầu ra</strong>: ${(s.outputs || []).join(" · ")}</p>
          </div>
        </article>`;
    }).join("");
    setLang(currentLang());
  }

  function initScrollAnimations() {
    /* Respect reduced-motion preference */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });

    // Observe surfaces
    document.querySelectorAll('.surface').forEach(surface => {
      observer.observe(surface);
    });

    // Observe feature lists with stagger
    document.querySelectorAll('.feature-list').forEach(list => {
      list.classList.add('animate-stagger');
    });
  }

  function init() {
    setLang(currentLang());
    wireLang();
    initScrollAnimations();
    if (document.body.dataset.kidsRender === "stages") {
      renderStages("#kidsStages");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.kids = { setLang, currentLang, loadCurriculum, renderStages, escHtml };
})();
