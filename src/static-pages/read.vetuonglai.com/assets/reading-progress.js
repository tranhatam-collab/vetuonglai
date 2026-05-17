/*!
 * Vetuonglai — reading-progress.js
 * Drop-in script for read.vetuonglai.com book/essay pages.
 * <script src="/assets/reading-progress.js" defer></script>
 *
 * Provides: sticky progress bar, auto-save/restore, bookmark toggle,
 * reading-time estimate, milestone analytics fires.
 *
 * Pure JS, no framework, no dependencies. IIFE-wrapped.
 * Storage keys:
 *   - vtl-read-progress   { [slug]: {title, percent, pos, savedAt} }
 *   - vtl-read-bookmarks  [ {slug, title, pos, savedAt} ]
 */
(function () {
  "use strict";

  // ---------- 1. Detect reading page ----------
  var body = document.body;
  var html = document.documentElement;
  var path = location.pathname || "";
  var hasArticle = !!document.querySelector("article");
  var hasSlugAttr = body && body.hasAttribute("data-read-slug");
  var urlMatch = /\/(books|essays)\//i.test(path);
  if (!hasArticle && !hasSlugAttr && !urlMatch) return;

  // ---------- 2. Locale ----------
  var lang = (html.getAttribute("lang") || "vi").toLowerCase();
  var isEN = lang.indexOf("en") === 0;
  var T = {
    resume:        isEN ? "Continue where you left off" : "Tiếp tục đọc dở",
    bookmarkOff:   isEN ? "Bookmark" : "Đánh dấu",
    bookmarkOn:    isEN ? "Bookmarked" : "Đã đánh dấu",
    minutesShort:  isEN ? "min read" : "phút đọc",
    minutesOne:    isEN ? "min" : "phút"
  };

  // ---------- 3. Identify article ----------
  function deriveSlug() {
    if (body.dataset && body.dataset.readSlug) return body.dataset.readSlug;
    var parts = path.replace(/\/+$/, "").split("/").filter(Boolean);
    return parts[parts.length - 1] || "untitled";
  }
  function deriveTitle() {
    var h1 = document.querySelector("h1");
    return (h1 && h1.textContent.trim()) || document.title || "";
  }
  var slug = deriveSlug();
  var title = deriveTitle();

  // ---------- 4. Safe localStorage wrapper ----------
  var LS = {
    get: function (k) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
      catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; }
      catch (e) { return false; }
    }
  };
  var PROGRESS_KEY = "vtl-read-progress";
  var BOOKMARK_KEY = "vtl-read-bookmarks";
  var TTL_MS = 30 * 24 * 60 * 60 * 1000;

  // ---------- 5. Purge stale progress entries ----------
  (function purge() {
    var store = LS.get(PROGRESS_KEY) || {};
    var now = Date.now(), changed = false;
    for (var k in store) {
      if (Object.prototype.hasOwnProperty.call(store, k)) {
        if (!store[k] || !store[k].savedAt || (now - store[k].savedAt) > TTL_MS) {
          delete store[k]; changed = true;
        }
      }
    }
    if (changed) LS.set(PROGRESS_KEY, store);
  })();

  // ---------- 6. Word count + reading-time estimate ----------
  var WPM = 250;
  function countWords() {
    if (body.dataset && body.dataset.readWords) {
      var n = parseInt(body.dataset.readWords, 10);
      if (!isNaN(n) && n > 0) return n;
    }
    var src = document.querySelector(".essay-body") || document.querySelector("article") || body;
    var txt = (src.textContent || "").trim();
    if (!txt) return 0;
    return txt.split(/\s+/).length;
  }
  var words = countWords();
  var minutes = Math.max(1, Math.round(words / WPM));

  // ---------- 7. Reduced motion ----------
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  // ---------- 8. Inject styles ----------
  var css = [
    "#vtl-read-bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:9999;background:transparent;pointer-events:none}",
    "#vtl-read-bar>i{display:block;height:100%;width:0%;",
    "background:linear-gradient(90deg,#4ADE80 0%,#22D3EE 50%,#818CF8 100%);",
    "transition:width .12s linear}",
    "#vtl-read-meta{position:fixed;top:10px;left:14px;font-family:var(--vt-font-sans,system-ui,sans-serif);",
    "font-size:11px;color:#64748b;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);",
    "padding:4px 9px;border-radius:999px;border:1px solid rgba(15,23,42,.06);z-index:9998;",
    "letter-spacing:.02em;font-weight:500}",
    "#vtl-read-bmk{position:fixed;top:24px;right:20px;display:inline-flex;align-items:center;gap:6px;",
    "padding:7px 14px;border-radius:999px;background:#fff;color:#475569;",
    "border:1px solid rgba(15,23,42,.1);font:600 12px/1 var(--vt-font-sans,system-ui,sans-serif);",
    "cursor:pointer;z-index:9998;box-shadow:0 4px 12px -4px rgba(15,23,42,.08);",
    "transition:transform .15s, background .15s, color .15s, border-color .15s}",
    "#vtl-read-bmk:hover{transform:translateY(-1px);border-color:#B45309;color:#B45309}",
    "#vtl-read-bmk.on{background:#B45309;color:#fff;border-color:#B45309}",
    "#vtl-read-bmk svg{width:13px;height:13px;display:block}",
    "#vtl-read-resume{position:fixed;bottom:22px;right:22px;display:inline-flex;align-items:center;gap:8px;",
    "padding:11px 18px;border-radius:999px;",
    "background:linear-gradient(90deg,#4ADE80 0%,#22D3EE 50%,#818CF8 100%);",
    "color:#0f172a;border:0;font:700 13px/1 var(--vt-font-sans,system-ui,sans-serif);",
    "cursor:pointer;z-index:9998;box-shadow:0 10px 30px -8px rgba(15,23,42,.25);",
    "transform:translateY(20px);opacity:0;transition:transform .25s, opacity .25s}",
    "#vtl-read-resume.show{transform:translateY(0);opacity:1}",
    "#vtl-read-resume:hover{filter:brightness(1.05)}",
    "@media (max-width:540px){",
    "  #vtl-read-meta{display:none}",
    "  #vtl-read-bmk{top:18px;right:12px;padding:6px 11px;font-size:11px}",
    "  #vtl-read-resume{bottom:14px;right:14px;left:14px;justify-content:center}",
    "}"
  ].join("");
  var styleEl = document.createElement("style");
  styleEl.id = "vtl-read-progress-style";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- 9. Inject UI ----------
  var bar = document.createElement("div");
  bar.id = "vtl-read-bar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<i></i>";
  document.body.appendChild(bar);
  var fill = bar.firstChild;

  var meta = document.createElement("div");
  meta.id = "vtl-read-meta";
  meta.textContent = (words > 0 ? minutes + " " + T.minutesShort : "");
  if (words > 0) document.body.appendChild(meta);

  var bmkBtn = document.createElement("button");
  bmkBtn.id = "vtl-read-bmk";
  bmkBtn.type = "button";
  bmkBtn.setAttribute("aria-label", T.bookmarkOff);
  bmkBtn.title = T.bookmarkOff;
  bmkBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg><span>' + T.bookmarkOff + "</span>";
  document.body.appendChild(bmkBtn);

  var resumeBtn = null;

  // ---------- 10. Progress calculation ----------
  function calcPercent() {
    var doc = document.documentElement;
    var st = window.pageYOffset || doc.scrollTop || 0;
    var vh = window.innerHeight || doc.clientHeight || 0;
    var dh = Math.max(doc.scrollHeight, body.scrollHeight, doc.offsetHeight) || 1;
    var pct = ((st + vh) / dh) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    return pct;
  }

  // ---------- 11. Track milestones + complete ----------
  var firedMilestones = {};
  var sessionCompleteKey = "vtl-read-complete-" + slug;
  var startTime = Date.now();
  function maybeFireMilestones(pct) {
    var ms = [25, 50, 75, 100];
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (pct >= m && !firedMilestones[m]) {
        firedMilestones[m] = true;
        if (window.vtlTrack) {
          try { window.vtlTrack("read_progress", { slug: slug, percent: m }); } catch (e) {}
        }
      }
    }
    if (pct >= 99.5) {
      var fired = false;
      try { fired = sessionStorage.getItem(sessionCompleteKey) === "1"; } catch (e) {}
      if (!fired) {
        try { sessionStorage.setItem(sessionCompleteKey, "1"); } catch (e) {}
        if (window.vtlTrack) {
          try {
            window.vtlTrack("read_complete", {
              slug: slug,
              seconds: Math.round((Date.now() - startTime) / 1000)
            });
          } catch (e) {}
        }
      }
    }
  }

  // ---------- 12. Save progress (throttled to 2s) ----------
  var lastSave = 0;
  function saveProgress(pct) {
    if (pct < 1) return;
    var now = Date.now();
    if (now - lastSave < 2000) return;
    lastSave = now;
    var store = LS.get(PROGRESS_KEY) || {};
    store[slug] = {
      title: title,
      percent: Math.round(pct * 10) / 10,
      pos: window.pageYOffset || 0,
      savedAt: now,
      url: location.pathname
    };
    LS.set(PROGRESS_KEY, store);
  }

  // ---------- 13. Scroll handler ----------
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var pct = calcPercent();
      fill.style.width = pct + "%";
      maybeFireMilestones(pct);
      saveProgress(pct);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // ---------- 14. Restore "continue" button ----------
  var saved = (LS.get(PROGRESS_KEY) || {})[slug];
  var savedPos = saved && saved.pos ? saved.pos : 0;
  var savedRecent = saved && (Date.now() - saved.savedAt) < TTL_MS;
  var savedNotFinished = saved && saved.percent < 95;
  var userPassedSaved = false;

  if (savedRecent && savedNotFinished && savedPos > 200) {
    resumeBtn = document.createElement("button");
    resumeBtn.id = "vtl-read-resume";
    resumeBtn.type = "button";
    resumeBtn.innerHTML = '<span>' + T.resume + '</span><span style="opacity:.7;font-weight:500">' +
      Math.round(saved.percent || 0) + "%</span>";
    document.body.appendChild(resumeBtn);

    resumeBtn.addEventListener("click", function () {
      var opts = reduceMotion ? { top: savedPos } : { top: savedPos, behavior: "smooth" };
      try { window.scrollTo(opts); } catch (e) { window.scrollTo(0, savedPos); }
      hideResume();
    });

    // Show after a tick so transition runs.
    setTimeout(function () { if (resumeBtn) resumeBtn.classList.add("show"); }, 60);

    // If user scrolls past saved position within 5s, hide it.
    var checkTimer = setInterval(function () {
      if (!resumeBtn) { clearInterval(checkTimer); return; }
      if ((window.pageYOffset || 0) >= savedPos - 40) {
        userPassedSaved = true;
        hideResume();
        clearInterval(checkTimer);
      }
    }, 250);
    setTimeout(function () {
      clearInterval(checkTimer);
      if (resumeBtn && userPassedSaved) hideResume();
    }, 5200);
  }
  function hideResume() {
    if (!resumeBtn) return;
    resumeBtn.classList.remove("show");
    var ref = resumeBtn;
    resumeBtn = null;
    setTimeout(function () { if (ref && ref.parentNode) ref.parentNode.removeChild(ref); }, 300);
  }

  // ---------- 15. Bookmark logic ----------
  function getBookmarks() { return LS.get(BOOKMARK_KEY) || []; }
  function isBookmarked() {
    var list = getBookmarks();
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return true;
    return false;
  }
  function setBookmarkUI(on) {
    bmkBtn.classList.toggle("on", on);
    bmkBtn.title = on ? T.bookmarkOn : T.bookmarkOff;
    bmkBtn.setAttribute("aria-pressed", on ? "true" : "false");
    bmkBtn.setAttribute("aria-label", on ? T.bookmarkOn : T.bookmarkOff);
    var span = bmkBtn.querySelector("span");
    if (span) span.textContent = on ? T.bookmarkOn : T.bookmarkOff;
  }
  function toggleBookmark() {
    var list = getBookmarks();
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) { idx = i; break; }
    if (idx >= 0) {
      list.splice(idx, 1);
      LS.set(BOOKMARK_KEY, list);
      setBookmarkUI(false);
      if (window.vtlTrack) {
        try { window.vtlTrack("read_bookmark_removed", { slug: slug }); } catch (e) {}
      }
    } else {
      list.unshift({
        slug: slug,
        title: title,
        pos: window.pageYOffset || 0,
        url: location.pathname,
        savedAt: Date.now()
      });
      // cap at 200 entries
      if (list.length > 200) list.length = 200;
      LS.set(BOOKMARK_KEY, list);
      setBookmarkUI(true);
      if (window.vtlTrack) {
        try { window.vtlTrack("read_bookmark_added", { slug: slug }); } catch (e) {}
      }
    }
  }
  setBookmarkUI(isBookmarked());
  bmkBtn.addEventListener("click", toggleBookmark);

  // ---------- 16. Initial paint ----------
  onScroll();

  // ---------- 17. Final save on page hide ----------
  window.addEventListener("pagehide", function () {
    lastSave = 0;
    saveProgress(calcPercent());
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      lastSave = 0;
      saveProgress(calcPercent());
    }
  });

  // ---------- 18. Expose minimal API (for library/index.html etc.) ----------
  window.vtlRead = {
    slug: slug,
    title: title,
    getProgress: function () { return LS.get(PROGRESS_KEY) || {}; },
    getBookmarks: getBookmarks,
    keys: { progress: PROGRESS_KEY, bookmarks: BOOKMARK_KEY }
  };
})();
