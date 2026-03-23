import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

const styleCss = await readFile(path.join(SRC, "shared", "style.css"), "utf8");
const sharedJs = await readFile(path.join(SRC, "shared", "app.js"), "utf8");
const apps = JSON.parse(await readFile(path.join(SRC, "data", "apps.json"), "utf8"));
const certificates = JSON.parse(await readFile(path.join(SRC, "data", "certificates.json"), "utf8"));
const courses = JSON.parse(await readFile(path.join(SRC, "data", "courses.json"), "utf8"));

const domains = {
  hub: "vetuonglai.com",
  vc: "vc.vetuonglai.com",
  edu: "edu.vetuonglai.com",
  green: "green.vetuonglai.com",
  finance: "finance.vetuonglai.com",
  life: "life.vetuonglai.com",
  invest: "invest.vetuonglai.com",
};

const managedHosts = new Set(Object.values(domains));

const siteTheme = {
  hub: {
    brand: "VT",
    name: "Về Tương Lai",
    accent: "#7bd3ff",
    accentSoft: "rgba(123, 211, 255, 0.18)",
    accentStrong: "#d9f5ff",
  },
  vc: {
    brand: "VC",
    name: "VC Registry",
    accent: "#f4c96b",
    accentSoft: "rgba(244, 201, 107, 0.18)",
    accentStrong: "#fff0c7",
  },
  edu: {
    brand: "ED",
    name: "Future EDU",
    accent: "#76dfc1",
    accentSoft: "rgba(118, 223, 193, 0.16)",
    accentStrong: "#d7fff2",
  },
  green: {
    brand: "GR",
    name: "Future GREEN",
    accent: "#59d78b",
    accentSoft: "rgba(89, 215, 139, 0.18)",
    accentStrong: "#d7ffea",
  },
  finance: {
    brand: "FN",
    name: "Future FIN",
    accent: "#6fb7ff",
    accentSoft: "rgba(111, 183, 255, 0.18)",
    accentStrong: "#dcecff",
  },
  life: {
    brand: "LF",
    name: "Future LIFE",
    accent: "#ff9d72",
    accentSoft: "rgba(255, 157, 114, 0.18)",
    accentStrong: "#ffe2d1",
  },
  invest: {
    brand: "IV",
    name: "Future INVEST",
    accent: "#ffb86f",
    accentSoft: "rgba(255, 184, 111, 0.18)",
    accentStrong: "#ffe7c7",
  },
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugText(value = "") {
  return value
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỵỷỹ]/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusBadge(status, label) {
  return `<span class="badge ${escapeHtml(status)}">${escapeHtml(label)}</span>`;
}

function linkAttributes(href) {
  if (!href.startsWith("http")) return "";

  const url = new URL(href);
  if (managedHosts.has(url.host)) return "";

  return ` target="_blank" rel="noreferrer"`;
}

function button(href, label, variant = "primary") {
  return `<a class="button ${escapeHtml(variant)}" href="${escapeHtml(href)}"${linkAttributes(href)}>${escapeHtml(label)}</a>`;
}

function renderTopbar(currentKey, items) {
  const theme = siteTheme[currentKey];
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="https://${domains.hub}">
          <span class="brand-mark">${escapeHtml(theme.brand)}</span>
          <span class="brand-meta">
            <span class="brand-title">${escapeHtml(theme.name)}</span>
            <span class="brand-subtitle">Minh bach vua du · khong lo thong tin thua</span>
          </span>
        </a>
        <nav class="nav">
          ${items.map((item) => {
            const active = item.key === currentKey ? "active" : "";
            return `<a class="${active}" href="${escapeHtml(item.href)}"${linkAttributes(item.href)}>${escapeHtml(item.label)}</a>`;
          }).join("")}
        </nav>
      </div>
    </header>
  `;
}

function renderShell({ currentKey, title, description, navItems, hero, sections, inlineScript = "" }) {
  const theme = siteTheme[currentKey];
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <link rel="stylesheet" href="/assets/style.css" />
  <style>
    :root {
      --accent: ${theme.accent};
      --accent-soft: ${theme.accentSoft};
      --accent-strong: ${theme.accentStrong};
    }
  </style>
</head>
<body>
  ${renderTopbar(currentKey, navItems)}
  <main class="shell">
    <section class="hero">
      ${hero}
    </section>
    ${sections.join("\n")}
    <footer class="footer">
      <span>© <span data-year></span> Vetuonglai System</span>
      <span class="subtle">Deploy root rieng cho tung subdomain, chung mot design system.</span>
    </footer>
  </main>
  <script src="/assets/app.js" defer></script>
  ${inlineScript ? `<script>${inlineScript}</script>` : ""}
</body>
</html>`;
}

function renderHero({ eyebrow, title, description, actions = "", aside = "" }) {
  return `
    <div class="eyebrow">${escapeHtml(eyebrow)}</div>
    <div class="hero-grid">
      <div class="stack">
        <h1 class="headline">${title}</h1>
        <p class="lede">${description}</p>
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
      </div>
      ${aside || ""}
    </div>
  `;
}

function renderCards(items) {
  return `<div class="grid-3">${items.join("")}</div>`;
}

function renderCard({ title, body, badge = "", meta = "", actions = "" }) {
  return `
    <article class="card">
      <div class="card-body stack">
        <div class="cluster" style="justify-content:space-between;align-items:flex-start">
          <h3 class="card-title">${title}</h3>
          ${badge}
        </div>
        <div class="card-copy">${body}</div>
        ${meta ? `<div class="cluster subtle mono">${meta}</div>` : ""}
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
      </div>
    </article>
  `;
}

function renderMetrics(items) {
  return `
    <aside class="card">
      <div class="card-body">
        <div class="metrics">
          ${items.map((item) => `
            <div class="metric">
              <div class="metric-value">${escapeHtml(item.value)}</div>
              <div class="metric-label">${escapeHtml(item.label)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderSection(title, note, content) {
  return `
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">${escapeHtml(title)}</h2>
          ${note ? `<div class="section-note">${escapeHtml(note)}</div>` : ""}
        </div>
      </div>
      ${content}
    </section>
  `;
}

function ecosystemNav(currentKey, extra = []) {
  const base = [
    { key: "hub", label: "Hub", href: `https://${domains.hub}` },
    { key: "vc", label: "VC", href: `https://${domains.vc}` },
    { key: "edu", label: "EDU", href: `https://${domains.edu}` },
    { key: "green", label: "GREEN", href: `https://${domains.green}` },
    { key: "finance", label: "FIN", href: `https://${domains.finance}` },
    { key: "life", label: "LIFE", href: `https://${domains.life}` },
    { key: "invest", label: "INVEST", href: `https://${domains.invest}` },
  ];

  return [...extra, ...base];
}

function renderHubPage() {
  const liveCount = apps.filter((app) => app.status === "live").length;
  const betaCount = apps.filter((app) => app.status === "beta").length;
  const plannedCount = apps.filter((app) => app.status === "planned").length;

  const hero = renderHero({
    eyebrow: "Future System Map",
    title: `Vet\u01b0\u01a1nglai.com<br><span class="accent">khong con la cac landing roi rac</span>`,
    description:
      "Mot hub cho giao duc, xac minh, tai chinh, moi truong, doi song va dau tu. Moi subdomain co vai tro ro rang, chung mot trust model va co the deploy doc lap.",
    actions: [
      button(`https://${domains.vc}`, "Mo VC"),
      button(`https://${domains.edu}`, "Mo EDU", "ghost"),
      button(`https://${domains.finance}`, "Mo FIN", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: String(liveCount), label: "subdomain live" },
      { value: String(betaCount), label: "subdomain beta" },
      { value: String(plannedCount), label: "subdomain planned" },
      { value: String(certificates.length), label: "mau chung chi" },
    ]),
  });

  const appCards = renderCards(apps.map((app) => renderCard({
    title: escapeHtml(app.title),
    badge: statusBadge(app.status, app.stageLabel),
    body: escapeHtml(app.desc),
    meta: `<span>${escapeHtml(app.url)}</span>`,
    actions: [
      button(app.url, app.status === "planned" ? "Trang preview" : "Mo subdomain"),
    ].join(""),
  })));

  const trustFlow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Cach he thong van hanh</h3>
          <ul class="list">
            <li><strong>Hub</strong>: cong bo system map, route va trang thai tung domain.</li>
            <li><strong>VC</strong>: cap ma, doi chieu bang chung, tra cuu hash va duong link goc.</li>
            <li><strong>EDU / GREEN / FIN / LIFE / INVEST</strong>: san pham, chuong trinh, curriculum va bang chung chuyen mon.</li>
            <li><strong>Trust rule</strong>: chi cong bo toi thieu, nhung thu da cong bo thi phai doi chieu duoc.</li>
          </ul>
        </div>
      </article>
      <article class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr><th>Layer</th><th>Vai tro</th></tr>
            </thead>
            <tbody>
              <tr><td class="mono">hub</td><td>Discoverability, roadmap, app registry</td></tr>
              <tr><td class="mono">vc</td><td>Verification gateway and evidence registry</td></tr>
              <tr><td class="mono">edu</td><td>Learning, course flow, micro-credentials</td></tr>
              <tr><td class="mono">green / finance</td><td>Use-case domains with practical proofs</td></tr>
              <tr><td class="mono">life / invest</td><td>Domains dang duoc dong bo hoa va san sang deploy</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;

  const rollout = `
    <div class="grid-3">
      ${renderCard({
        title: "VC Layer",
        body: "Hoan thien trang verify, dataset mau, route /v/* va co the cap chung chi doc lap cho EDU, GREEN, FIN.",
        badge: statusBadge("live", "core"),
      })}
      ${renderCard({
        title: "EDU Layer",
        body: "Catalog khoa hoc, course detail, health endpoint tinh va lien ket ve VC cho cap credential.",
        badge: statusBadge("beta", "ready"),
      })}
      ${renderCard({
        title: "Domain Expansion",
        body: "GREEN, FIN, LIFE, INVEST dung chung mot design system nen co the chay cung nhiep va de mo rong.",
        badge: statusBadge("planned", "synced"),
      })}
    </div>
  `;

  return renderShell({
    currentKey: "hub",
    title: "Về Tương Lai • Ecosystem Hub",
    description:
      "He thong da duoc dong bo lai thanh mot static multi-site cho vetuonglai.com va tat ca subdomain lien quan.",
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection("Ecosystem Registry", "Danh muc toan bo subdomain hien tai", appCards),
      renderSection("Trust Model", "Vet duong xac minh va phan tach vai tro giua cac domain", trustFlow),
      renderSection("Rollout", "Nhung phan dang do nay da duoc gom vao mot codebase chung", rollout),
    ],
  });
}

function renderVcHome() {
  const featured = certificates.slice(0, 3).map((record) => renderCard({
    title: `${escapeHtml(record.code)} · ${escapeHtml(record.program)}`,
    body: escapeHtml(record.summary),
    badge: statusBadge(record.status, record.status.toUpperCase()),
    meta: `<span>${escapeHtml(record.holder)}</span><span>${escapeHtml(record.domain)}</span>`,
    actions: button(`/v/${record.code}`, "Mo ban ghi", "ghost"),
  })).join("");

  const tableRows = certificates.map((record) => `
    <tr>
      <td class="mono">${escapeHtml(record.code)}</td>
      <td>${escapeHtml(record.program)}</td>
      <td>${escapeHtml(record.holder)}</td>
      <td>${statusBadge(record.status, record.status)}</td>
    </tr>
  `).join("");

  const hero = renderHero({
    eyebrow: "Independent Verification Registry",
    title: `VC<br><span class="accent">xac minh doc lap cho toan he vetuonglai</span>`,
    description:
      "Nhap ma chung chi, mo duong /v/:code hoac duyet registry. Lop nay dung doc lap voi app van hanh va chi hien thi bang chung toi thieu can thiet.",
    actions: [
      `<div class="search-shell" style="min-width:min(100%,480px)">
        <input class="search-input mono" id="vc-code-input" placeholder="Nhap ma, vi du VC-2026-0001" />
        <div class="cluster">
          <button class="button primary" id="vc-verify-button">Xac minh</button>
          <button class="button ghost" id="vc-sample-button" data-sample="${escapeHtml(certificates[0].code)}">Thu mau</button>
        </div>
      </div>`
    ].join(""),
    aside: renderMetrics([
      { value: String(certificates.length), label: "ban ghi mau" },
      { value: String(certificates.filter((item) => item.status === "verified").length), label: "verified" },
      { value: String(certificates.filter((item) => item.status === "reviewing").length), label: "reviewing" },
      { value: "VC", label: "layer doc lap" },
    ]),
  });

  const registry = `
    <div class="grid-3">
      ${featured}
    </div>
  `;

  const table = `
    <article class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr><th>Code</th><th>Program</th><th>Holder</th><th>Status</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </article>
  `;

  const trust = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Nguyen tac cong bo</h3>
          <ul class="list">
            <li>Chi cong bo nguoi nhan, pham vi, trang thai va anchors can thiet.</li>
            <li>Khong lo thong tin nhay cam ve diem so, giao dich hay noi dung private.</li>
            <li>Moi ban ghi deu tro nguoc ve domain goc phat hanh.</li>
          </ul>
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Tich hop voi cac subdomain</h3>
          <div class="body-copy">
            EDU dung VC cho micro-credential. GREEN dung VC cho impact proof. FIN dung VC cho sprint certificate.
            LIFE va INVEST da co blueprint chung chi mau de san sang pilot.
          </div>
          <div class="cluster">
            ${button(`https://${domains.edu}`, "Mo EDU", "ghost")}
            ${button(`https://${domains.green}`, "Mo GREEN", "ghost")}
            ${button(`https://${domains.finance}`, "Mo FIN", "ghost")}
          </div>
        </div>
      </article>
    </div>
  `;

  const inlineScript = `
    const input = document.getElementById("vc-code-input");
    const button = document.getElementById("vc-verify-button");
    const sample = document.getElementById("vc-sample-button");
    function go(code) {
      const normalized = (code || "").trim().toUpperCase();
      if (!normalized) return;
      location.href = "/v/" + encodeURIComponent(normalized);
    }
    button?.addEventListener("click", () => go(input?.value));
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") go(input.value);
    });
    sample?.addEventListener("click", () => go(sample.getAttribute("data-sample")));
  `;

  return renderShell({
    currentKey: "vc",
    title: "VC – Verify",
    description: "Registry doc lap de tra cuu ma chung chi vetuonglai.",
    navItems: ecosystemNav("vc", [
      { key: "vc-registry", label: "Registry", href: `https://${domains.vc}` },
      { key: "vc-direct", label: "Direct Verify", href: `https://${domains.vc}/v/VC-2026-0001` },
    ]),
    hero,
    sections: [
      renderSection("Featured Records", "Cac ban ghi mau co the kiem chung ngay", registry),
      renderSection("Registry Table", "Tong hop nhanh ma, program, holder, status", table),
      renderSection("Trust Notes", "Cach VC giu minh bach vua du", trust),
    ],
    inlineScript,
  });
}

function renderVcRecordPage() {
  const hero = renderHero({
    eyebrow: "VC Record",
    title: `Tra cuu chung chi<br><span class="accent">tu duong dan /v/:code</span>`,
    description:
      "Trang nay doc ma tu pathname, tai registry JSON va hien thi bang chung xac minh. Hoat dong voi Pages rewrite /v/* -> /v/index.html.",
    actions: [
      button("/", "Ve VC Home"),
      button(`https://${domains.hub}`, "Ve Hub", "ghost"),
    ].join(""),
  });

  const shell = `
    <article class="card">
      <div class="card-body stack">
        <div class="result-shell" id="vc-result-shell">
          <div class="subtle">Dang tai du lieu registry...</div>
        </div>
      </div>
    </article>
  `;

  const inlineScript = `
    const resultShell = document.getElementById("vc-result-shell");
    const statusClass = (value) => {
      if (value === "verified") return "live";
      if (value === "reviewing") return "reviewing";
      return "planned";
    };
    const pickCode = () => {
      const params = new URLSearchParams(location.search);
      const fromQuery = params.get("code");
      if (fromQuery) return fromQuery.toUpperCase();
      const segments = location.pathname.split("/").filter(Boolean);
      const candidate = segments.at(-1);
      if (!candidate || candidate === "v") return "";
      return decodeURIComponent(candidate).toUpperCase();
    };
    const renderNotFound = (code) => {
      resultShell.innerHTML = '<h2 class="result-title">Khong tim thay ban ghi</h2><p class="body-copy">Ma <strong class="mono">' + code + '</strong> chua ton tai trong registry mau. Hay quay lai trang VC de thu ma khac.</p>';
    };
    const renderRecord = (record) => {
      const evidence = record.evidence.map((item) => '<li>' + item + '</li>').join("");
      const ipfs = record.anchors.ipfs || "Chua neo";
      resultShell.innerHTML = [
        '<div class="cluster" style="justify-content:space-between;align-items:flex-start">',
        '<div><div class="badge ' + statusClass(record.status) + '">' + record.status + '</div><h2 class="result-title" style="margin-top:12px">' + record.program + '</h2><div class="subtle mono">' + record.code + '</div></div>',
        '<button class="button ghost" id="copy-hash" data-copy="' + record.anchors.contentHash + '">Copy hash</button>',
        '</div>',
        '<p class="body-copy">' + record.summary + '</p>',
        '<div class="grid-2">',
        '<article class="card"><div class="card-body stack"><h3 class="card-title">Nguoi nhan</h3><div class="body-copy"><strong>' + record.holder + '</strong><br>' + record.scope + '</div></div></article>',
        '<article class="card"><div class="card-body stack"><h3 class="card-title">Nguon phat hanh</h3><div class="body-copy">' + record.issuer + '<br><span class="mono">' + record.domain + '</span><br>Issued: ' + record.issuedAt + '</div></div></article>',
        '</div>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack"><h3 class="card-title">Evidence</h3><ul class="list">' + evidence + '</ul></div></article>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack"><h3 class="card-title">Anchors</h3><div class="body-copy mono">Hash: ' + record.anchors.contentHash + '</div><div class="body-copy mono">IPFS: ' + ipfs + '</div><div class="cluster"><a class="button primary" href="https://' + record.domain + '" target="_blank" rel="noreferrer">Mo domain goc</a><a class="button ghost" href="/">Tra cuu ma khac</a></div></div></article>'
      ].join("");
      const button = document.getElementById("copy-hash");
      button?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(record.anchors.contentHash);
          button.textContent = "Da copy";
        } catch {
          button.textContent = "Copy loi";
        }
      });
    };
    fetch("/api/certificates.json")
      .then((response) => response.json())
      .then((items) => {
        const code = pickCode();
        if (!code) {
          resultShell.innerHTML = '<h2 class="result-title">Nhap ma de xac minh</h2><p class="body-copy">Mo duong dan dang <strong class="mono">/v/VC-2026-0001</strong> hoac dung form tra cuu o trang chu VC.</p>';
          return;
        }
        const record = items.find((item) => item.code.toUpperCase() === code);
        if (!record) return renderNotFound(code);
        renderRecord(record);
      })
      .catch(() => {
        resultShell.innerHTML = '<h2 class="result-title">Khong tai duoc registry</h2><p class="body-copy">Kiem tra lai file /api/certificates.json va rewrite /v/*.</p>';
      });
  `;

  return renderShell({
    currentKey: "vc",
    title: "VC Record Lookup",
    description: "Tra cuu chi tiet mot ma chung chi tren vc.vetuonglai.com.",
    navItems: ecosystemNav("vc", [
      { key: "vc-registry", label: "Registry", href: `https://${domains.vc}` },
    ]),
    hero,
    sections: [renderSection("Certificate Result", "Chi hien thi bang chung can thiet cho verify", shell)],
    inlineScript,
  });
}

function renderVcWorker() {
  return `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/v" || url.pathname === "/v/" || url.pathname.startsWith("/v/")) {
      const segments = url.pathname.split("/").filter(Boolean);
      const code = segments[0] === "v" && segments.length > 1 ? decodeURIComponent(segments.slice(1).join("/")) : "";
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/v/";
      if (code && !assetUrl.searchParams.has("code")) {
        assetUrl.searchParams.set("code", code);
      }
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
`;
}

function renderEduHome() {
  const featuredCards = renderCards(courses.map((course) => renderCard({
    title: escapeHtml(course.title),
    body: escapeHtml(course.summary),
    badge: statusBadge("beta", course.level),
    meta: `<span>${escapeHtml(course.duration)}</span><span>${escapeHtml(course.price)}</span>`,
    actions: [
      button(`/course/${course.slug}/`, "Xem chi tiet"),
      button(`https://${domains.vc}/v/${course.certificateCode}`, "VC sample", "ghost"),
    ].join(""),
  })));

  const flow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Flow cap credential</h3>
          <ol class="list">
            <li>Hoc vien hoan thanh dau ra, nop bang chung toi thieu.</li>
            <li>EDU duyet ket qua va tao packet chuan hoa.</li>
            <li>VC nhan ma, hash va anchors de xac minh doc lap.</li>
          </ol>
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Catalog endpoints</h3>
          <div class="body-copy mono">/api/health<br>/api/catalog.json<br>/courses/<br>/course/:slug/</div>
          <div class="subtle">Toan bo la static output, khong phu thuoc runtime server de preview.</div>
        </div>
      </article>
    </div>
  `;

  const hero = renderHero({
    eyebrow: "Future Education Layer",
    title: `EDU<br><span class="accent">hoc de co bang chung, khong chi co noi dung</span>`,
    description:
      "Kho khoa hoc, page chi tiet, catalog JSON va lien ket cap chung chi qua VC. Day la version da dong bo lai de de deploy va mo rong tiep.",
    actions: [
      button("/courses/", "Mo danh sach khoa hoc"),
      button(`https://${domains.vc}`, "Mo VC", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: String(courses.length), label: "featured courses" },
      { value: "VC", label: "credential layer" },
      { value: "/api/health", label: "health endpoint" },
      { value: "static", label: "deploy model" },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    title: "Giáo Dục Tương Lai",
    description: "Catalog khoa hoc, course detail va micro-credential layer cho edu.vetuonglai.com.",
    navItems: ecosystemNav("edu", [
      { key: "edu-courses", label: "Courses", href: `https://${domains.edu}/courses/` },
      { key: "edu-health", label: "Health", href: `https://${domains.edu}/api/health` },
    ]),
    hero,
    sections: [
      renderSection("Featured Courses", "Catalog duoc lay tu data chung", featuredCards),
      renderSection("Credential Flow", "EDU khong cap chung chi mo ho, tat ca di qua VC", flow),
    ],
  });
}

function renderEduCoursesPage() {
  const list = renderCards(courses.map((course) => renderCard({
    title: escapeHtml(course.title),
    body: `${escapeHtml(course.tagline)}<br><br>${escapeHtml(course.summary)}`,
    badge: statusBadge("beta", course.level),
    meta: `<span>${escapeHtml(course.duration)}</span><span>${escapeHtml(course.price)}</span><span>${escapeHtml(course.certificateCode)}</span>`,
    actions: [
      button(`/course/${course.slug}/`, "Xem chi tiet"),
      button(`https://${domains.vc}/v/${course.certificateCode}`, "Mo VC", "ghost"),
    ].join(""),
  })));

  const hero = renderHero({
    eyebrow: "Course Catalog",
    title: `Danh sach khoa hoc<br><span class="accent">gom tu source data chung</span>`,
    description:
      "Moi khoa hoc o day deu co duong dan chi tiet, outcomes, modules va mot ma sample de xac minh tren VC.",
    actions: [
      button("/", "Ve EDU home"),
      button(`https://${domains.hub}`, "Ve hub", "ghost"),
    ].join(""),
  });

  return renderShell({
    currentKey: "edu",
    title: "Danh sach khoa hoc • EDU",
    description: "Danh sach khoa hoc deploy cho edu.vetuonglai.com.",
    navItems: ecosystemNav("edu", [
      { key: "edu-home", label: "EDU Home", href: `https://${domains.edu}` },
      { key: "edu-catalog", label: "Catalog", href: `https://${domains.edu}/courses/` },
    ]),
    hero,
    sections: [renderSection("Course Cards", "Toan bo card duoc sinh tu courses.json", list)],
  });
}

function renderEduCourseDetail(course) {
  const outcomes = `<ul class="list">${course.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const modules = `<ul class="list">${course.modules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

  const detail = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Outcomes</h3>
          ${outcomes}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          <h3 class="card-title">Modules</h3>
          ${modules}
        </div>
      </article>
    </div>
  `;

  const hero = renderHero({
    eyebrow: "Course Detail",
    title: `${escapeHtml(course.title)}<br><span class="accent">${escapeHtml(course.tagline)}</span>`,
    description: escapeHtml(course.summary),
    actions: [
      button("/courses/", "Ve catalog"),
      button(`https://${domains.vc}/v/${course.certificateCode}`, "Mo sample credential", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: course.level, label: "level" },
      { value: course.duration, label: "duration" },
      { value: course.price, label: "price" },
      { value: course.certificateCode, label: "vc sample" },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    title: `${course.title} • EDU`,
    description: course.summary,
    navItems: ecosystemNav("edu", [
      { key: "edu-courses", label: "Courses", href: `https://${domains.edu}/courses/` },
    ]),
    hero,
    sections: [renderSection("Course Structure", "Dau ra va modules de doi chieu khi cap chung chi", detail)],
  });
}

function renderGreenPage() {
  const cards = renderCards([
    renderCard({
      title: "Impact Dossier",
      body: "Moi hoat dong xanh duoc bien thanh bo ho so gom baseline, bang chung truoc/sau, checklist doi chieu va anchor xac minh.",
      badge: statusBadge("live", "proof"),
    }),
    renderCard({
      title: "Program Templates",
      body: "Co san khuon cho cong dong, doanh nghiep nho va chuong trinh giao duc xanh. Muc tieu la tai su dung cach ghi bang chung.",
      badge: statusBadge("live", "template"),
    }),
    renderCard({
      title: "VC Bridge",
      body: "Chung chi xanh duoc phat hanh qua domain GREEN nhung verify bang ma doc lap tren VC.",
      badge: statusBadge("live", "bridge"),
      actions: button(`https://${domains.vc}/v/VC-2026-0008`, "Xem sample VC", "ghost"),
    }),
  ]);

  const hero = renderHero({
    eyebrow: "Green Proof Layer",
    title: `GREEN<br><span class="accent">bien hanh dong xanh thanh bang chung kiem tra duoc</span>`,
    description:
      "Khong dung nhan xanh mo ho. He thong nay chuan hoa impact dossier, evidence checklist va credential packet de verify doc lap.",
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0008`, "Mo chung chi mau"),
      button(`https://${domains.hub}`, "Ve hub", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "30d", label: "pilot cycle" },
      { value: "3", label: "proof layers" },
      { value: "VC", label: "verify endpoint" },
      { value: "ready", label: "deploy status" },
    ]),
  });

  const standards = `
    <article class="card">
      <div class="card-body stack">
        <h3 class="card-title">Bang chung toi thieu</h3>
        <ul class="list">
          <li>Baseline truoc khi can thiep</li>
          <li>Evidence sequence trong qua trinh thuc hien</li>
          <li>Post-check va nguoi doi chieu</li>
          <li>Hash packet de verify tren VC</li>
        </ul>
      </div>
    </article>
  `;

  return renderShell({
    currentKey: "green",
    title: "Chứng Chỉ Môi Trường • GREEN",
    description: "Green proof layer cho vetuonglai.com, chuan hoa evidence va verify qua VC.",
    navItems: ecosystemNav("green"),
    hero,
    sections: [
      renderSection("Product Blocks", "Nhung khoi co ban cua GREEN layer", cards),
      renderSection("Evidence Standard", "Khong xac minh bang loi noi, ma bang packet", standards),
    ],
  });
}

function renderFinancePage() {
  const tracks = renderCards([
    renderCard({
      title: "Money Discipline",
      body: "Thiet lap ngan sach, quy khan cap va thoi quen giu dong tien sach.",
      badge: statusBadge("live", "sprint"),
      actions: button(`https://${domains.vc}/v/VC-2026-0012`, "Chung chi mau", "ghost"),
    }),
    renderCard({
      title: "Anti-Scam Lens",
      body: "Danh sach dau hieu lua dao, trick urgency va cach doi chieu thong tin truoc khi xuong tien.",
      badge: statusBadge("live", "safety"),
    }),
    renderCard({
      title: "Long-Term Thinking",
      body: "Khong day danh nhanh. Tap trung vao he thong quyet dinh, cushion rui ro va ky luat lau dai.",
      badge: statusBadge("live", "mindset"),
    }),
  ]);

  const checklist = `
    <article class="card">
      <div class="card-body stack">
        <h3 class="card-title">4 bo loc co ban</h3>
        <ul class="list">
          <li>Tien nay co phai tien nhan roi tu dong luc?</li>
          <li>Neu sai, minh mat bao nhieu va co song duoc khong?</li>
          <li>Nguon thong tin co doc lap va verify duoc khong?</li>
          <li>Co ap luc "vao ngay" hay "khong mua la mat co hoi" khong?</li>
        </ul>
      </div>
    </article>
  `;

  const hero = renderHero({
    eyebrow: "Financial Literacy Layer",
    title: `FIN<br><span class="accent">tai chinh co ban, ro rui ro, khong thoi phong</span>`,
    description:
      "FIN duoc dat nhu mot layer giao duc thuc dung. Noi dung xoay quanh dong tien, scam signals, habit loop va cac sprint co credential sample.",
    actions: [
      button(`https://${domains.edu}/courses/`, "Xem khoa hoc lien quan"),
      button(`https://${domains.hub}`, "Ve hub", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "21d", label: "sprint" },
      { value: "8", label: "anti-scam signals" },
      { value: "VC", label: "certificate bridge" },
      { value: "core", label: "status" },
    ]),
  });

  return renderShell({
    currentKey: "finance",
    title: "Tài Chính Cơ Bản • FIN",
    description: "Layer tai chinh co ban cho vetuonglai.com, ket hop noi dung va verification.",
    navItems: ecosystemNav("finance"),
    hero,
    sections: [
      renderSection("Tracks", "Ba khong gian cot loi cua FIN", tracks),
      renderSection("Decision Filter", "Khung bo loc de tranh mat tien vi mo ho", checklist),
    ],
  });
}

function renderLifePage() {
  const blocks = renderCards([
    renderCard({
      title: "Sleep & Recovery",
      body: "Khong noi qua truu tuong. LIFE nham vao baseline som, gio ngu, nang luong va kha nang hoi phuc.",
      badge: statusBadge("planned", "pilot"),
    }),
    renderCard({
      title: "Focus & Rhythm",
      body: "Rut bot vo to-do, tang nhiep song on dinh va bien doi tuan thanh he thong quan sat duoc.",
      badge: statusBadge("planned", "pilot"),
    }),
    renderCard({
      title: "Life Reset Credential",
      body: "Neu pilot du bang chung, LIFE se phat hanh packet qua VC voi mode reviewing truoc khi mo rong.",
      badge: statusBadge("reviewing", "blueprint"),
      actions: button(`https://${domains.vc}/v/VC-2026-0017`, "Xem blueprint VC", "ghost"),
    }),
  ]);

  const hero = renderHero({
    eyebrow: "Life Operating Layer",
    title: `LIFE<br><span class="accent">mot domain dang duoc chuan bi de mo pilot</span>`,
    description:
      "LIFE chua mo DNS live, nhung source nay da san sang: page, proof blueprint va nhiep thiet ke dong bo voi toan he vetuonglai.",
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0017`, "Mo blueprint"),
      button(`https://${domains.hub}`, "Ve hub", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "14d", label: "pilot sprint" },
      { value: "3", label: "ritual blocks" },
      { value: "reviewing", label: "credential mode" },
      { value: "planned", label: "dns status" },
    ]),
  });

  const ritual = `
    <article class="card">
      <div class="card-body stack">
        <h3 class="card-title">Pilot stack</h3>
        <ul class="list">
          <li>Sleep reset: gio ngu, gio day, anh sang som</li>
          <li>Energy audit: do nang luong 3 moc moi ngay</li>
          <li>Rhythm loop: weekly review va reset chu ky</li>
        </ul>
      </div>
    </article>
  `;

  return renderShell({
    currentKey: "life",
    title: "Đời Sống Tương Lai • LIFE",
    description: "Blueprint da san sang cho life.vetuonglai.com du domain chua live DNS.",
    navItems: ecosystemNav("life"),
    hero,
    sections: [
      renderSection("Pilot Blocks", "Page nay dong vai tro preview hoan chinh cho LIFE", blocks),
      renderSection("Ritual Blueprint", "Nhung khoi se duoc dua vao pilot dau tien", ritual),
    ],
  });
}

function renderInvestPage() {
  const blocks = renderCards([
    renderCard({
      title: "Risk First",
      body: "Khong bat dau bang co hoi. Bat dau bang cau hoi: neu sai thi mat gi, mat bao nhieu, mat trong bao lau.",
      badge: statusBadge("planned", "core"),
    }),
    renderCard({
      title: "Due Diligence",
      body: "Checklist doi chieu nguon thong tin, dong tien, incentive va vung mo ho cua bat ky tai san nao.",
      badge: statusBadge("planned", "checklist"),
    }),
    renderCard({
      title: "No FOMO Rule",
      body: "Neu co ap luc phai vao ngay, co the day khong phai la co hoi phu hop voi minh.",
      badge: statusBadge("planned", "guardrail"),
      actions: button(`https://${domains.vc}/v/VC-2026-0024`, "Xem sample credential", "ghost"),
    }),
  ]);

  const checklist = `
    <article class="card">
      <div class="card-body stack">
        <h3 class="card-title">Khung 5 cau hoi</h3>
        <ul class="list">
          <li>Minh dang mua dong tien hay mua cau chuyen?</li>
          <li>Ai huong loi neu minh vao lenh?</li>
          <li>Thong tin nay co 2 nguon doc lap hay chi mot nguon noi lai?</li>
          <li>Ke hoach thoat lenh hoac dung lai o dau?</li>
          <li>Neu bo qua co hoi nay, cuoc song minh co xau di khong?</li>
        </ul>
      </div>
    </article>
  `;

  const hero = renderHero({
    eyebrow: "Sane Investing Layer",
    title: `INVEST<br><span class="accent">xay khung dau tu tinh tao truoc khi mo pilot</span>`,
    description:
      "INVEST dang o phase blueprint nhung page, language va guardrails da duoc hoan thien de co the dua len DNS khi san sang.",
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0024`, "Mo sample blueprint"),
      button(`https://${domains.hub}`, "Ve hub", "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "5", label: "screening questions" },
      { value: "0", label: "FOMO tolerance" },
      { value: "planned", label: "dns status" },
      { value: "ready", label: "source status" },
    ]),
  });

  return renderShell({
    currentKey: "invest",
    title: "Đầu Tư Tỉnh Táo • INVEST",
    description: "Blueprint hoan chinh cho invest.vetuonglai.com.",
    navItems: ecosystemNav("invest"),
    hero,
    sections: [
      renderSection("Guardrails", "Ba lop bao ve truoc khi noi den co hoi", blocks),
      renderSection("Due Diligence", "Checklist can co truoc khi dua tien vao bat ky tai san nao", checklist),
    ],
  });
}

function renderStaticJson(data) {
  return JSON.stringify(data, null, 2);
}

function renderRobots(domain) {
  return `User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml\n`;
}

function renderSitemap(domain, paths) {
  const items = paths.map((pathname) => `
  <url>
    <loc>https://${domain}${pathname}</loc>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>`;
}

async function ensureDir(target) {
  await mkdir(target, { recursive: true });
}

async function writeSiteFile(domain, relativePath, content) {
  const target = path.join(DIST, domain, relativePath);
  await ensureDir(path.dirname(target));
  await writeFile(target, content, "utf8");
}

async function writeAssets(domain) {
  await writeSiteFile(domain, "assets/style.css", styleCss);
  await writeSiteFile(domain, "assets/app.js", sharedJs);
}

async function build() {
  await rm(DIST, { recursive: true, force: true });

  const hubPaths = ["/", "/apps.json"];
  const vcPaths = ["/", "/v/"];
  const eduPaths = ["/", "/courses/", "/api/health", "/api/catalog.json", ...courses.map((course) => `/course/${course.slug}/`)];
  const simplePaths = ["/"];

  await writeAssets(domains.hub);
  await writeSiteFile(domains.hub, "index.html", renderHubPage());
  await writeSiteFile(domains.hub, "apps.json", renderStaticJson(apps));
  await writeSiteFile(domains.hub, "robots.txt", renderRobots(domains.hub));
  await writeSiteFile(domains.hub, "sitemap.xml", renderSitemap(domains.hub, hubPaths));

  await writeAssets(domains.vc);
  await writeSiteFile(domains.vc, "index.html", renderVcHome());
  await writeSiteFile(domains.vc, "v/index.html", renderVcRecordPage());
  await writeSiteFile(domains.vc, "_worker.js", renderVcWorker());
  await writeSiteFile(domains.vc, "api/certificates.json", renderStaticJson(certificates));
  await writeSiteFile(domains.vc, "_redirects", "/v/* /v/index.html 200\n");
  await writeSiteFile(domains.vc, "robots.txt", renderRobots(domains.vc));
  await writeSiteFile(domains.vc, "sitemap.xml", renderSitemap(domains.vc, vcPaths));

  await writeAssets(domains.edu);
  await writeSiteFile(domains.edu, "index.html", renderEduHome());
  await writeSiteFile(domains.edu, "courses/index.html", renderEduCoursesPage());
  await writeSiteFile(domains.edu, "api/health", renderStaticJson({ ok: true, name: "vetuonglai-edu", mode: "static" }));
  await writeSiteFile(domains.edu, "api/catalog.json", renderStaticJson(courses));
  for (const course of courses) {
    await writeSiteFile(domains.edu, `course/${course.slug}/index.html`, renderEduCourseDetail(course));
  }
  await writeSiteFile(domains.edu, "robots.txt", renderRobots(domains.edu));
  await writeSiteFile(domains.edu, "sitemap.xml", renderSitemap(domains.edu, eduPaths));

  await writeAssets(domains.green);
  await writeSiteFile(domains.green, "index.html", renderGreenPage());
  await writeSiteFile(domains.green, "robots.txt", renderRobots(domains.green));
  await writeSiteFile(domains.green, "sitemap.xml", renderSitemap(domains.green, simplePaths));

  await writeAssets(domains.finance);
  await writeSiteFile(domains.finance, "index.html", renderFinancePage());
  await writeSiteFile(domains.finance, "robots.txt", renderRobots(domains.finance));
  await writeSiteFile(domains.finance, "sitemap.xml", renderSitemap(domains.finance, simplePaths));

  await writeAssets(domains.life);
  await writeSiteFile(domains.life, "index.html", renderLifePage());
  await writeSiteFile(domains.life, "robots.txt", renderRobots(domains.life));
  await writeSiteFile(domains.life, "sitemap.xml", renderSitemap(domains.life, simplePaths));

  await writeAssets(domains.invest);
  await writeSiteFile(domains.invest, "index.html", renderInvestPage());
  await writeSiteFile(domains.invest, "robots.txt", renderRobots(domains.invest));
  await writeSiteFile(domains.invest, "sitemap.xml", renderSitemap(domains.invest, simplePaths));
}

await build();
console.log(`Built Vetuonglai system into ${DIST}`);
