import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

const styleCss = await readFile(path.join(SRC, "shared", "style.css"), "utf8");
const designTokensCss = await readFile(path.join(SRC, "shared", "design-tokens.css"), "utf8");
const designTokensJson = await readFile(path.join(SRC, "shared", "design-tokens.json"), "utf8");
const sharedJs = await readFile(path.join(SRC, "shared", "app.js"), "utf8");
const apps = JSON.parse(await readFile(path.join(SRC, "data", "apps.json"), "utf8"));
const certificates = JSON.parse(await readFile(path.join(SRC, "data", "certificates.json"), "utf8"));
const courses = JSON.parse(await readFile(path.join(SRC, "data", "courses.json"), "utf8"));
const system = JSON.parse(await readFile(path.join(SRC, "data", "system.json"), "utf8"));

const domains = {
  hub: "vetuonglai.com",
  vc: "vc.vetuonglai.com",
  edu: "edu.vetuonglai.com",
  green: "green.vetuonglai.com",
  finance: "finance.vetuonglai.com",
  life: "life.vetuonglai.com",
  invest: "invest.vetuonglai.com",
};

const nftBridge = system.nftBridge || {};
const managedHosts = new Set(Object.values(domains));
if (nftBridge.siteUrl) {
  try {
    managedHosts.add(new URL(nftBridge.siteUrl).host);
  } catch {
    // Ignore malformed siteUrl in source data.
  }
}

const siteTheme = {
  hub: {
    brand: "VT",
    name: pair("Về Tương Lai", "Vetuonglai"),
    accent: "#7bd3ff",
    accentSoft: "rgba(123, 211, 255, 0.18)",
    accentStrong: "#d9f5ff",
  },
  vc: {
    brand: "VC",
    name: pair("VC Registry", "VC Registry"),
    accent: "#f4c96b",
    accentSoft: "rgba(244, 201, 107, 0.18)",
    accentStrong: "#fff0c7",
  },
  edu: {
    brand: "ED",
    name: pair("Future EDU", "Future EDU"),
    accent: "#76dfc1",
    accentSoft: "rgba(118, 223, 193, 0.16)",
    accentStrong: "#d7fff2",
  },
  green: {
    brand: "GR",
    name: pair("Future GREEN", "Future GREEN"),
    accent: "#59d78b",
    accentSoft: "rgba(89, 215, 139, 0.18)",
    accentStrong: "#d7ffea",
  },
  finance: {
    brand: "FN",
    name: pair("Future FIN", "Future FIN"),
    accent: "#6fb7ff",
    accentSoft: "rgba(111, 183, 255, 0.18)",
    accentStrong: "#dcecff",
  },
  life: {
    brand: "LF",
    name: pair("Future LIFE", "Future LIFE"),
    accent: "#ff9d72",
    accentSoft: "rgba(255, 157, 114, 0.18)",
    accentStrong: "#ffe2d1",
  },
  invest: {
    brand: "IV",
    name: pair("Future INVEST", "Future INVEST"),
    accent: "#ffb86f",
    accentSoft: "rgba(255, 184, 111, 0.18)",
    accentStrong: "#ffe7c7",
  },
};

function pair(vi, en = vi) {
  return {
    vi: String(vi ?? ""),
    en: String(en ?? vi ?? ""),
  };
}

function normalizeCopy(value) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("vi" in value || "en" in value)) {
    return pair(value.vi ?? value.en ?? "", value.en ?? value.vi ?? "");
  }

  return pair(value ?? "", value ?? "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attrsToString(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false && value !== "")
    .map(([key, value]) => (value === true ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`))
    .join("");
}

function localizedText(value, tag = "span", attrs = {}) {
  const copy = normalizeCopy(value);
  return [
    `<${tag}${attrsToString(attrs)}>`,
    `<span data-lang="vi">${escapeHtml(copy.vi)}</span>`,
    `<span data-lang="en" hidden>${escapeHtml(copy.en)}</span>`,
    `</${tag}>`,
  ].join("");
}

function localizedHtml(value, tag = "div", attrs = {}) {
  const copy = normalizeCopy(value);
  return [
    `<${tag}${attrsToString(attrs)}>`,
    `<span data-lang="vi">${copy.vi}</span>`,
    `<span data-lang="en" hidden>${copy.en}</span>`,
    `</${tag}>`,
  ].join("");
}

function absoluteUrl(domain, pathname = "/") {
  const url = new URL(`https://${domain}`);
  url.pathname = pathname;
  return url.toString();
}

function localizedUrl(domain, pathname, language) {
  const url = new URL(absoluteUrl(domain, pathname));
  url.searchParams.set("lang", language);
  return url.toString();
}

function linkAttributeMap(href) {
  if (!href.startsWith("http")) return {};

  const url = new URL(href);
  if (managedHosts.has(url.host)) return {};

  return { target: "_blank", rel: "noreferrer" };
}

function button(href, label, variant = "primary", attrs = {}) {
  return localizedText(label, "a", {
    class: `button ${variant}`,
    href,
    ...linkAttributeMap(href),
    ...attrs,
  });
}

function statusBadge(status, label) {
  return localizedText(label, "span", { class: `badge ${status}` });
}

function appStageLabel(app) {
  if (app.stageLabel === "BRIDGE") return pair("Cầu nối", "Bridge");
  if (app.stageLabel === "LIVE") return pair("Trực tiếp", "Live");
  if (app.stageLabel === "PREVIEW") return pair("Xem trước", "Preview");
  if (app.stageLabel === "BETA") return pair("Thử nghiệm", "Beta");
  if (app.stageLabel === "PLANNED") return pair("Kế hoạch", "Planned");
  return pair(app.stageLabel || app.status || "", app.stageLabel || app.status || "");
}

function recordStatusLabel(status) {
  switch (status) {
    case "verified":
      return pair("Đã xác minh", "Verified");
    case "reviewing":
      return pair("Đang rà soát", "Reviewing");
    default:
      return pair("Kế hoạch", "Planned");
  }
}

function recordTypeLabel(type = "credential") {
  if (type === "asset") return pair("Tài sản", "Asset");
  return pair("Chứng nhận", "Credential");
}

function badgeTone(status) {
  if (status === "verified" || status === "live") return "live";
  if (status === "beta") return "beta";
  return "planned";
}

function cardTitle(copy) {
  return localizedHtml(copy, "h3", { class: "card-title" });
}

function cardText(copy, className = "card-copy") {
  return localizedText(copy, "div", { class: className });
}

function cardHtml(copy, className = "card-copy") {
  return localizedHtml(copy, "div", { class: className });
}

function renderCard({ title, body, badge = "", meta = "", actions = "" }) {
  return `
    <article class="card">
      <div class="card-body stack">
        <div class="cluster" style="justify-content:space-between;align-items:flex-start">
          ${title}
          ${badge}
        </div>
        ${body}
        ${meta ? `<div class="cluster subtle mono">${meta}</div>` : ""}
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
      </div>
    </article>
  `;
}

function renderCards(items) {
  return `<div class="grid-3">${items.join("")}</div>`;
}

function renderMetrics(items) {
  return `
    <aside class="card">
      <div class="card-body">
        <div class="metrics">
          ${items.map((item) => `
            <div class="metric">
              <div class="metric-value">${escapeHtml(item.value)}</div>
              ${localizedText(item.label, "div", { class: "metric-label" })}
            </div>
          `).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderList(items, { ordered = false, html = false } = {}) {
  const tag = ordered ? "ol" : "ul";
  const renderer = html ? localizedHtml : localizedText;
  return `<${tag} class="list">${items.map((item) => `<li>${renderer(item, "span")}</li>`).join("")}</${tag}>`;
}

function renderTable(headers, rows) {
  return `
    <table class="table">
      <thead>
        <tr>${headers.map((header) => localizedText(header, "th")).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderSection(title, note, content, sectionId = "") {
  const idAttr = sectionId ? ` id="${escapeHtml(sectionId)}"` : "";
  return `
    <section class="section"${idAttr}>
      <div class="section-header">
        <div>
          ${localizedText(title, "h2", { class: "section-title" })}
          ${note ? localizedText(note, "div", { class: "section-note" }) : ""}
        </div>
      </div>
      ${content}
    </section>
  `;
}

function renderHero({ eyebrow, title, description, actions = "", aside = "" }) {
  return `
    ${localizedText(eyebrow, "div", { class: "eyebrow" })}
    <div class="hero-grid">
      <div class="stack">
        ${localizedHtml(title, "h1", { class: "headline" })}
        ${localizedHtml(description, "p", { class: "lede" })}
        ${actions ? `<div class="cluster">${actions}</div>` : ""}
      </div>
      ${aside || ""}
    </div>
  `;
}

function ecosystemNav(currentKey, extra = []) {
  const base = [
    { key: "hub", label: pair("Hub", "Hub"), href: `https://${domains.hub}` },
    { key: "vc", label: pair("VC", "VC"), href: `https://${domains.vc}` },
    { key: "edu", label: pair("EDU", "EDU"), href: `https://${domains.edu}` },
    { key: "green", label: pair("GREEN", "GREEN"), href: `https://${domains.green}` },
    { key: "finance", label: pair("FIN", "FIN"), href: `https://${domains.finance}` },
    { key: "life", label: pair("LIFE", "LIFE"), href: `https://${domains.life}` },
    { key: "invest", label: pair("INVEST", "INVEST"), href: `https://${domains.invest}` },
  ];

  const filteredBase = extra.length > 0 ? base.filter((item) => item.key !== currentKey) : base;
  return [...extra, ...filteredBase];
}

function renderTopbar(siteKey, activeKey, items) {
  const theme = siteTheme[siteKey];

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="https://${domains.hub}">
          <span class="brand-mark">${escapeHtml(theme.brand)}</span>
          <span class="brand-meta">
            ${localizedText(theme.name, "span", { class: "brand-title" })}
            ${localizedText(pair("Minh bạch vừa đủ, xác minh được độc lập.", "Right-sized transparency with independent verification."), "span", { class: "brand-subtitle" })}
          </span>
        </a>
        <div class="nav-tools">
          <nav class="nav">
            ${items.map((item) => localizedText(item.label, "a", {
              class: item.key === activeKey ? "active" : "",
              href: item.href,
              ...linkAttributeMap(item.href),
            })).join("")}
          </nav>
          <div class="lang-switch" role="group" aria-label="Language switch" data-aria-label-vi="Chọn ngôn ngữ" data-aria-label-en="Choose language">
            <button class="lang-button is-active" type="button" data-language-option="vi" aria-pressed="true" data-aria-label-vi="Chuyển sang tiếng Việt" data-aria-label-en="Switch to Vietnamese">VI</button>
            <button class="lang-button" type="button" data-language-option="en" aria-pressed="false" data-aria-label-vi="Chuyển sang tiếng Anh" data-aria-label-en="Switch to English">EN</button>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderShell({
  currentKey,
  activeKey = currentKey,
  pathname = "/",
  title,
  description,
  navItems,
  hero,
  sections,
  inlineScript = "",
}) {
  const theme = siteTheme[currentKey];
  const titleCopy = normalizeCopy(title);
  const descriptionCopy = normalizeCopy(description);
  const canonical = absoluteUrl(domains[currentKey], pathname);

  return `<!doctype html>
<html lang="vi" data-language="vi" data-domain="${escapeHtml(currentKey)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title data-text-vi="${escapeHtml(titleCopy.vi)}" data-text-en="${escapeHtml(titleCopy.en)}">${escapeHtml(titleCopy.vi)}</title>
  <meta name="description" data-content-vi="${escapeHtml(descriptionCopy.vi)}" data-content-en="${escapeHtml(descriptionCopy.en)}" content="${escapeHtml(descriptionCopy.vi)}" />
  <meta name="robots" content="index,follow" />
  <meta name="generator" content="${escapeHtml(system.releaseName)}" />
  <meta name="content-language" content="vi, en" />
  <meta property="og:title" data-content-vi="${escapeHtml(titleCopy.vi)}" data-content-en="${escapeHtml(titleCopy.en)}" content="${escapeHtml(titleCopy.vi)}" />
  <meta property="og:description" data-content-vi="${escapeHtml(descriptionCopy.vi)}" data-content-en="${escapeHtml(descriptionCopy.en)}" content="${escapeHtml(descriptionCopy.vi)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:locale" content="vi_VN" />
  <meta property="og:locale:alternate" content="en_US" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="alternate" hreflang="vi-VN" href="${escapeHtml(localizedUrl(domains[currentKey], pathname, "vi"))}" />
  <link rel="alternate" hreflang="en-US" href="${escapeHtml(localizedUrl(domains[currentKey], pathname, "en"))}" />
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}" />
  <link rel="stylesheet" href="/assets/design-tokens.css" />
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
  ${renderTopbar(currentKey, activeKey, navItems)}
  <main class="shell">
    <section class="hero">
      ${hero}
    </section>
    ${sections.join("\n")}
    <footer class="footer">
      <span>© <span data-year></span> Vetuonglai System</span>
      ${localizedText(pair("Không hứa hẹn thành công nhanh. Chỉ đồng hành để bạn sống tốt hơn, thật hơn, từng ngày.", "No quick-success promises. We walk with you so life gets better, truer, one day at a time."), "span", { class: "subtle" })}
    </footer>
  </main>
  <script src="/assets/app.js" defer></script>
  ${inlineScript ? `<script>${inlineScript}</script>` : ""}
</body>
</html>`;
}

function renderHubPage() {
  const liveCount = apps.filter((app) => app.status === "live").length;
  const betaCount = apps.filter((app) => app.status === "beta").length;
  const plannedCount = apps.filter((app) => app.status === "planned").length;

  const hero = renderHero({
    eyebrow: pair(`Bản đồ hệ thống • ${system.releaseName}`, `System map • ${system.releaseNameEn}`),
    title: pair(
      `Một tương lai tốt hơn bắt đầu từ hôm nay`,
      `A better future starts today`,
    ),
    description: pair(
      `Không phải học để thi, mà học để sống, làm, và trở thành chính mình.`,
      `Not learning to pass exams, but learning to live, build, and become your true self.`,
    ),
    actions: [
      button(`https://${domains.edu}`, pair("Bắt đầu hành trình", "Start your journey")),
      button("#journey-entry", pair("Tìm hướng đi phù hợp với bạn", "Find your path"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: String(liveCount), label: pair("subdomain đang live", "live subdomains") },
      { value: String(betaCount), label: pair("subdomain beta", "beta subdomains") },
      { value: String(plannedCount), label: pair("subdomain đang chuẩn bị", "subdomains in planning") },
      { value: system.version, label: pair("phiên bản", "version") },
    ]),
  });

  const appCards = renderCards(apps.map((app) => {
    const isPreview = app.stageLabel === "PREVIEW";
    const meta = app.publicUrl
      ? `<span>preview: ${escapeHtml(app.url)}</span><span>public: ${escapeHtml(app.publicUrl)}</span>`
      : `<span>${escapeHtml(app.url)}</span>`;

    return renderCard({
    title: cardTitle(pair(app.title, app.titleEn)),
    badge: statusBadge(badgeTone(app.status), appStageLabel(app)),
    body: cardText(pair(app.desc, app.descEn)),
    meta,
    actions: button(
      app.url,
      app.key === "nft"
        ? pair("Mở NFT bridge", "Open NFT bridge")
        : isPreview || app.status === "planned"
          ? pair("Xem bản preview", "Open preview")
          : pair("Mở subdomain", "Open subdomain"),
      isPreview || app.status === "planned" ? "ghost" : "primary",
    ),
  });
  }));

  const problemCards = renderCards([
    renderCard({
      title: cardTitle(pair("Mất phương hướng", "Losing direction")),
      body: cardText(pair("Nhiều người cố gắng rất nhiều nhưng vẫn không rõ mình đang đi đâu.", "Many people work hard but still do not know where they are headed.")),
    }),
    renderCard({
      title: cardTitle(pair("Học sai cách", "Learning the wrong way")),
      body: cardText(pair("Học để thi và nhớ tạm thời, thay vì học để sống và làm thật.", "Learning for short-term tests instead of learning to live and build real outcomes.")),
    }),
    renderCard({
      title: cardTitle(pair("Sống sai nhịp", "Living out of rhythm")),
      body: cardText(pair("Nhịp sống rối loạn làm giảm năng lượng, sự tập trung và chất lượng quyết định.", "A disrupted life rhythm weakens energy, focus, and decision quality.")),
    }),
  ]);

  const visionSection = `
    <article class="card">
      <div class="card-body stack">
        ${cardTitle(pair("Tầm nhìn sống", "Life vision"))}
        ${cardText(pair(
          "Một hệ sinh thái giúp con người sống đủ đầy, tự chủ, hiểu mình, và tạo giá trị bền vững theo từng bước thực hành.",
          "An ecosystem that helps people live fully, become self-directed, understand themselves, and create sustainable value through practical steps.",
        ), "body-copy")}
      </div>
    </article>
  `;

  const journeyEntry = renderCards([
    renderCard({
      title: cardTitle(pair("Bạn đang mất nhịp sống", "You are losing your life rhythm")),
      body: cardText(pair("Bắt đầu từ LIFE để ổn định năng lượng, kỷ luật và nhịp sống nền.", "Start with LIFE to stabilize your energy, discipline, and baseline rhythm.")),
      actions: button(`https://${domains.life}`, pair("Bắt đầu từng bước", "Start step by step"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Bạn cần học để làm", "You need to learn by doing")),
      body: cardText(pair("Vào EDU để học với AI Tutor, làm project thật và tạo đầu ra có thể xác minh.", "Enter EDU to learn with AI Tutor, build real projects, and create verifiable outcomes.")),
      actions: button(`https://${domains.edu}`, pair("Vào EDU", "Open EDU")),
    }),
    renderCard({
      title: cardTitle(pair("Bạn cần chuẩn hóa niềm tin", "You need trusted proof")),
      body: cardText(pair("Dùng VC để xác minh chứng nhận và bằng chứng học tập hoặc thực hành.", "Use VC to verify credentials and proof from learning or practice.")),
      actions: button(`https://${domains.vc}`, pair("Mở VC", "Open VC"), "ghost"),
    }),
  ]);

  const stories = renderCards([
    renderCard({
      title: cardTitle(pair("Trước: mất định hướng", "Before: no clear direction")),
      badge: statusBadge("reviewing", pair("câu chuyện thật", "real story")),
      body: cardText(pair("Một người học nhiều nhưng không ứng dụng được vào đời sống.", "A learner consumed content but could not apply it in real life.")),
    }),
    renderCard({
      title: cardTitle(pair("Trong: học và làm", "During: learn and do")),
      badge: statusBadge("beta", pair("hành động", "action")),
      body: cardText(pair("Đi qua lộ trình ngắn, có AI đồng hành và bài thực hành theo từng mốc.", "They moved through a short pathway with AI guidance and milestone-based practice.")),
    }),
    renderCard({
      title: cardTitle(pair("Sau: có tiến bộ và bằng chứng", "After: progress with proof")),
      badge: statusBadge("live", pair("xác minh", "verified")),
      body: cardText(pair("Có kết quả đo được và hồ sơ đủ chuẩn để xác minh tại VC.", "They reached measurable outcomes with evidence that can be verified on VC.")),
    }),
  ]);

  const languageStandard = renderCards([
    renderCard({
      title: cardTitle(pair("Tiếng Việt có dấu, đúng chuẩn", "Proper Vietnamese with full diacritics")),
      badge: statusBadge("live", pair("ngôn ngữ", "language")),
      body: cardText(pair(
        "Bản tiếng Việt của toàn hệ đã được sửa sang câu hoàn chỉnh, có dấu đầy đủ và bỏ toàn bộ copy ASCII còn sót.",
        "The Vietnamese layer has been rewritten with complete grammar, proper diacritics, and no leftover ASCII copy.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Tiếng Anh tương ứng từng khối", "English parity across every block")),
      badge: statusBadge("live", pair("song ngữ", "bilingual")),
      body: cardText(pair(
        "Mỗi trang, tiêu đề, mô tả, CTA và module nội dung đều có bản tiếng Anh tương đương thay vì dịch nửa chừng.",
        "Every page, heading, description, CTA, and content module now ships with a complete English counterpart instead of partial translation.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Liên kết ngôn ngữ chuẩn quốc tế", "International language links")),
      badge: statusBadge("live", pair("SEO", "SEO")),
      body: cardText(pair(
        "Mọi trang được sinh `hreflang`, metadata song ngữ, `?lang=vi|en`, và bộ chuyển ngôn ngữ dùng chung trên toàn hệ.",
        "Every page now includes `hreflang`, bilingual metadata, `?lang=vi|en`, and one shared language switch across the entire system.",
      )),
    }),
  ]);

  const v1 = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair(system.releaseName, system.releaseNameEn))}
          ${cardText(pair(system.summary, system.summaryEn), "body-copy")}
          <div class="cluster subtle mono">
            <span>${escapeHtml(system.version)}</span>
            <span>${escapeHtml(system.updatedAt)}</span>
          </div>
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("NFT mirror và VC độc lập", "NFT mirror with independent VC verification"))}
          ${cardText(pair(
            `VC đọc thêm asset registrations từ ${nftBridge.registryUrl} để giữ vai trò xác minh độc lập cho tài sản mã hóa và NFT.`,
            `VC also reads asset registrations from ${nftBridge.registryUrl} so digital assets and NFTs can be independently verified.`,
          ), "body-copy")}
          <div class="cluster">
            ${button(nftBridge.siteUrl, pair("Mở nft.iai.one", "Open nft.iai.one"), "ghost")}
            ${button(nftBridge.registryUrl, pair("Mở registry JSON", "Open registry JSON"), "ghost")}
          </div>
        </div>
      </article>
    </div>
  `;

  const trustFlow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Mô hình tin cậy", "Trust model"))}
          ${renderList([
            pair("<strong>Hub</strong>: công bố bản đồ hệ thống, trạng thái và đường dẫn chính thức.", "<strong>Hub</strong>: publishes the system map, status, and official routes."),
            pair("<strong>VC</strong>: cấp mã, công bố hash, anchors và lớp tra cứu độc lập.", "<strong>VC</strong>: issues codes, publishes hashes, anchors, and the independent lookup layer."),
            pair("<strong>EDU / GREEN / FIN / LIFE / INVEST</strong>: phát hành nội dung, chương trình và bằng chứng chuyên môn theo từng ngữ cảnh.", "<strong>EDU / GREEN / FIN / LIFE / INVEST</strong>: publish content, programs, and domain-specific proof."),
            pair("<strong>NFT Bridge</strong>: mirror runtime từ nft.iai.one về VC để chứng nhận độc lập không phụ thuộc app nguồn.", "<strong>NFT Bridge</strong>: mirrors runtime data from nft.iai.one into VC so independent verification does not depend on the source app."),
          ], { html: true })}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Vai trò theo lớp", "Layer responsibilities"))}
          ${renderTable(
            [pair("Lớp", "Layer"), pair("Vai trò", "Responsibility")],
            [
              [`<span class="mono">hub</span>`, localizedText(pair("Khám phá hệ thống, app registry, điều phối đa site.", "System discovery, app registry, and multi-site coordination."))],
              [`<span class="mono">vc</span>`, localizedText(pair("Cổng xác minh, mã chứng chỉ, registry và NFT mirror.", "Verification gateway, credential codes, registry, and NFT mirror."))],
              [`<span class="mono">edu</span>`, localizedText(pair("Khóa học, lộ trình học, micro-credential.", "Courses, learning pathways, and micro-credentials."))],
              [`<span class="mono">green / finance</span>`, localizedText(pair("Use case domain với bằng chứng thực hành và xác nhận chéo.", "Use-case domains with practical evidence and cross-verification."))],
              [`<span class="mono">life / invest</span>`, localizedText(pair("Preview hoàn chỉnh cho pilot, sẵn sàng mở DNS khi cutover xong.", "Complete pilot-ready previews, ready for DNS cutover when the domains are switched."))],
            ],
          )}
        </div>
      </article>
    </div>
  `;

  const rollout = renderCards([
    renderCard({
      title: cardTitle(pair("Lớp VC", "VC layer")),
      badge: statusBadge("live", pair("cốt lõi", "core")),
      body: cardText(pair(
        "Trang verify, dataset mẫu, route `/v/*`, mirror tài sản mã hóa và hồ sơ chứng nhận độc lập đã được gộp vào một luồng thống nhất.",
        "The verify page, sample dataset, `/v/*` route, digital-asset mirror, and independent credential flow now run through one consistent system.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Lớp EDU", "EDU layer")),
      badge: statusBadge("beta", pair("sẵn sàng", "ready")),
      body: cardText(pair(
        "Catalog khóa học, course detail, endpoint catalog và liên kết VC đã được chuẩn hóa sang song ngữ hoàn chỉnh.",
        "The course catalog, course details, catalog endpoint, and VC linkage are now standardized into a complete bilingual experience.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Mở rộng domain", "Domain expansion")),
      badge: statusBadge("planned", pair("đồng bộ", "synced")),
      body: cardText(pair(
        "GREEN, FIN, LIFE và INVEST dùng chung design system, metadata và bộ chuyển ngôn ngữ nên có thể mở rộng cùng nhịp.",
        "GREEN, FIN, LIFE, and INVEST share one design system, metadata layer, and language switch, so they can expand in sync.",
      )),
    }),
  ]);

  return renderShell({
    currentKey: "hub",
    pathname: "/",
    title: pair("Về Tương Lai • Hub hệ sinh thái", "Vetuonglai • Ecosystem hub"),
    description: pair(
      "Bản hub chuẩn hóa của toàn hệ vetuonglai.com với song ngữ, metadata chuẩn quốc tế và lớp xác minh đồng bộ.",
      "The standardized hub for the full vetuonglai.com system, now shipping bilingual content, international metadata, and a synchronized verification layer.",
    ),
    navItems: ecosystemNav("hub"),
    hero,
    sections: [
      renderSection(pair("Vấn đề thực tế", "Real problems"), pair("Những điểm nghẽn con người đang gặp mỗi ngày", "The core frictions people face every day"), problemCards),
      renderSection(pair("Tầm nhìn", "Vision"), pair("Đích đến của một hệ sống, học và làm thật", "The direction of a life, learning, and action system"), visionSection),
      renderSection(pair("Bắt đầu hành trình", "Journey entry"), pair("Chọn điểm xuất phát để hệ gợi ý đường đi phù hợp", "Pick your starting point and get a suitable path"), journeyEntry, "journey-entry"),
      renderSection(pair("Câu chuyện chuyển hóa", "Transformation stories"), pair("Người thật, hành trình thật, kết quả có thể xác minh", "Real people, real journeys, verifiable outcomes"), stories),
      renderSection(pair("Ecosystem Registry", "Ecosystem registry"), pair("Danh mục các domain và vai trò hiện tại", "The current list of domains and their responsibilities"), appCards, "ecosystem-map"),
      renderSection(pair("Chuẩn ngôn ngữ V1.0", "Language standard in V1.0"), pair("Nền tảng song ngữ áp dụng trên toàn hệ", "The bilingual foundation now applied across the whole system"), languageStandard),
      renderSection(pair("Bản phát hành V1.0", "The V1.0 release"), pair("Phiên bản đồng bộ cho toàn hệ", "The synchronized release across the whole system"), v1),
      renderSection(pair("Mô hình tin cậy", "Trust model"), pair("Đường đi xác minh và tách vai trò theo domain", "Verification paths and responsibility boundaries by domain"), trustFlow),
      renderSection(pair("Tiến độ đồng bộ", "Rollout"), pair("Những phần đang chạy chung trong một codebase", "What now runs inside one shared codebase"), rollout),
    ],
  });
}

function renderVcHome() {
  const hero = renderHero({
    eyebrow: pair("Registry xác minh độc lập", "Independent verification registry"),
    title: pair(
      `VC<br><span class="accent">không phải chứng chỉ đẹp, mà là bằng chứng làm được</span>`,
      `VC<br><span class="accent">not decorative certificates, but proof of real capability</span>`,
    ),
    description: pair(
      "Nhập mã chứng nhận, mở đường dẫn `/v/:code` hoặc duyệt registry. VC giữ vai trò độc lập với app phát hành và đọc thêm NFT mirror từ nft.iai.one cho hồ sơ tài sản mã hóa.",
      "Enter a credential code, open the `/v/:code` route, or browse the registry. VC stays independent from the issuing app and also reads the nft.iai.one runtime mirror for digital-asset records.",
    ),
    actions: `
      <div class="search-shell" style="min-width:min(100%,480px)">
        <input class="search-input mono" id="vc-code-input" data-placeholder-vi="Nhập mã, ví dụ VC-2026-0001" data-placeholder-en="Enter a code, for example VC-2026-0001" placeholder="Nhập mã, ví dụ VC-2026-0001" />
        <div class="cluster">
          <button class="button primary" id="vc-verify-button" type="button">${localizedText(pair("Xác minh", "Verify"))}</button>
          <button class="button ghost" id="vc-sample-button" type="button" data-sample="${escapeHtml(certificates[0].code)}">${localizedText(pair("Thử mẫu", "Try sample"))}</button>
        </div>
      </div>
    `,
    aside: renderMetrics([
      { value: String(certificates.length), label: pair("bản ghi nội bộ", "local records") },
      { value: String(certificates.filter((item) => item.status === "verified").length), label: pair("đã xác minh", "verified") },
      { value: "NFT", label: pair("mirror runtime", "runtime mirror") },
      { value: system.version, label: pair("phiên bản", "version") },
    ]),
  });

  const registry = `
    <div class="grid-3" id="vc-featured-shell">
      <article class="card">
        <div class="card-body">
          ${localizedText(pair("Đang tải registry nội bộ và NFT mirror...", "Loading the local registry and NFT mirror..."), "div", { class: "subtle" })}
        </div>
      </article>
    </div>
  `;

  const table = `
    <article class="card">
      <div class="card-body" id="vc-table-shell">
        ${localizedText(pair("Đang tải bảng registry...", "Loading registry table..."), "div", { class: "subtle" })}
      </div>
    </article>
  `;

  const trust = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Nguyên tắc công bố", "Disclosure rules"))}
          ${renderList([
            pair("Chỉ công bố người nhận, phạm vi, trạng thái và anchors cần thiết cho việc xác minh.", "Only publish the holder, scope, status, and anchors required for verification."),
            pair("Không lộ điểm số, giao dịch riêng tư hay dữ liệu không cần thiết.", "Do not expose scores, private transactions, or unnecessary data."),
            pair("Mỗi bản ghi đều trỏ ngược về domain gốc phát hành hoặc nơi tài sản được đăng ký.", "Every record points back to the issuing domain or the source asset registration."),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Tích hợp với các subdomain", "Subdomain integration"))}
          ${cardText(pair(
            "EDU dùng VC cho micro-credential. GREEN dùng VC cho impact proof. FIN dùng VC cho sprint certificate. LIFE và INVEST đã có blueprint đầy đủ để mở pilot. NFT records từ nft.iai.one được mirror runtime sang VC để giữ lớp xác minh độc lập.",
            "EDU uses VC for micro-credentials. GREEN uses VC for impact proof. FIN uses VC for sprint certificates. LIFE and INVEST already ship with complete pilot blueprints. NFT records from nft.iai.one are mirrored into VC to preserve independent verification.",
          ), "body-copy")}
          <div class="cluster">
            ${button(`https://${domains.edu}`, pair("Mở EDU", "Open EDU"), "ghost")}
            ${button(`https://${domains.green}`, pair("Mở GREEN", "Open GREEN"), "ghost")}
            ${button(`https://${domains.finance}`, pair("Mở FIN", "Open FIN"), "ghost")}
            ${button(nftBridge.siteUrl, pair("Mở NFT bridge", "Open NFT bridge"), "ghost")}
          </div>
        </div>
      </article>
    </div>
  `;

  const inlineScript = `
    const nftRegistryUrl = ${JSON.stringify(nftBridge.registryUrl || "")};
    const featuredShell = document.getElementById("vc-featured-shell");
    const tableShell = document.getElementById("vc-table-shell");
    const input = document.getElementById("vc-code-input");
    const verifyButton = document.getElementById("vc-verify-button");
    const sampleButton = document.getElementById("vc-sample-button");
    const copy = (vi, en = vi) => ({ vi, en });
    const currentLanguage = () => document.documentElement.dataset.language === "en" ? "en" : "vi";
    const toneClass = (value) => {
      if (value === "verified") return "live";
      if (value === "reviewing") return "reviewing";
      return "planned";
    };
    const escapeHtml = (value) => String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const localizedText = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + escapeHtml(vi) + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + escapeHtml(en) + '</span></' + tag + '>';
    };
    const localizedHtml = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + vi + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + en + '</span></' + tag + '>';
    };
    const syncLanguage = () => window.vetuonglaiSyncLanguage?.();
    const statusLabel = (value) => {
      if (value === "verified") return copy("Đã xác minh", "Verified");
      if (value === "reviewing") return copy("Đang rà soát", "Reviewing");
      return copy("Kế hoạch", "Planned");
    };
    const typeLabel = (value) => value === "asset" ? copy("Tài sản", "Asset") : copy("Chứng nhận", "Credential");
    const programLabel = (record) => copy(
      record.program || record.assetName || record.name || record.code || "",
      record.programEn || record.assetNameEn || record.program || record.assetName || record.name || record.code || ""
    );
    const summaryLabel = (record) => copy(
      record.summary || record.description || "",
      record.summaryEn || record.descriptionEn || record.summary || record.description || ""
    );
    const holderLabel = (record) => record.holder || record.walletAddress || "Unknown";
    const domainLabel = (record) => record.domain || "nft.iai.one";
    const mergeRecords = (localItems, remotePayload) => {
      const remoteItems = Array.isArray(remotePayload?.vcRecords)
        ? remotePayload.vcRecords
        : Array.isArray(remotePayload?.registrations)
          ? remotePayload.registrations.map((item) => item.vcRecord).filter(Boolean)
          : [];
      const byCode = new Map();
      [...localItems, ...remoteItems]
        .map((item) => ({ recordType: item.recordType || "credential", ...item }))
        .forEach((item) => {
          byCode.set(String(item.code || "").toUpperCase(), item);
        });
      return Array.from(byCode.values()).sort((a, b) => String(b.issuedAt || "").localeCompare(String(a.issuedAt || "")));
    };
    const emptyCard = '<article class="card"><div class="card-body"><div class="subtle">' + localizedText("Chưa có bản ghi nào.", "No records yet.") + '</div></div></article>';
    const renderRegistry = (items) => {
      featuredShell.innerHTML = items.slice(0, 4).map((record) => {
        const label = programLabel(record);
        const summary = summaryLabel(record);
        return [
          '<article class="card"><div class="card-body stack">',
          '<div class="cluster" style="justify-content:space-between;align-items:flex-start">',
          localizedText(record.code + ' · ' + label.vi, record.code + ' · ' + label.en, 'h3', 'card-title'),
          '<span class="badge ' + toneClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</span>',
          '</div>',
          localizedText(summary.vi, summary.en, 'div', 'body-copy'),
          '<div class="cluster subtle mono"><span>' + escapeHtml(holderLabel(record)) + '</span><span>' + escapeHtml(domainLabel(record)) + '</span><span>' + localizedText(typeLabel(record.recordType).vi, typeLabel(record.recordType).en) + '</span></div>',
          '<div class="cluster"><a class="button ghost" href="/v/' + encodeURIComponent(record.code) + '?lang=' + currentLanguage() + '">' + localizedText("Mở bản ghi", "Open record") + '</a></div>',
          '</div></article>',
        ].join("");
      }).join("") || emptyCard;

      tableShell.innerHTML = [
        '<table class="table"><thead><tr>',
        '<th>' + localizedText("Mã", "Code") + '</th>',
        '<th>' + localizedText("Loại", "Type") + '</th>',
        '<th>' + localizedText("Chương trình / tài sản", "Program / asset") + '</th>',
        '<th>' + localizedText("Chủ thể", "Holder") + '</th>',
        '<th>' + localizedText("Trạng thái", "Status") + '</th>',
        '</tr></thead><tbody>',
        items.map((record) => {
          const label = programLabel(record);
          return [
            '<tr>',
            '<td class="mono"><a href="/v/' + encodeURIComponent(record.code) + '?lang=' + currentLanguage() + '">' + escapeHtml(record.code) + '</a></td>',
            '<td>' + localizedText(typeLabel(record.recordType).vi, typeLabel(record.recordType).en) + '</td>',
            '<td>' + localizedText(label.vi, label.en) + '</td>',
            '<td>' + escapeHtml(holderLabel(record)) + '</td>',
            '<td><span class="badge ' + toneClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</span></td>',
            '</tr>',
          ].join("");
        }).join(""),
        '</tbody></table>',
      ].join("");

      if (!sampleButton.getAttribute("data-sample") && items[0]?.code) {
        sampleButton.setAttribute("data-sample", items[0].code);
      }

      syncLanguage();
    };
    async function loadRegistry() {
      const [localItems, remotePayload] = await Promise.all([
        fetch("/api/certificates.json").then((response) => response.ok ? response.json() : []).catch(() => []),
        nftRegistryUrl
          ? fetch(nftRegistryUrl).then((response) => response.ok ? response.json() : { vcRecords: [] }).catch(() => ({ vcRecords: [] }))
          : Promise.resolve({ vcRecords: [] }),
      ]);
      renderRegistry(mergeRecords(localItems, remotePayload));
    }
    function go(code) {
      const normalized = String(code || "").trim().toUpperCase();
      if (!normalized) return;
      const url = new URL("/v/" + encodeURIComponent(normalized), window.location.origin);
      url.searchParams.set("lang", currentLanguage());
      window.location.href = url.toString();
    }
    verifyButton?.addEventListener("click", () => go(input?.value));
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") go(input.value);
    });
    sampleButton?.addEventListener("click", () => go(sampleButton.getAttribute("data-sample")));
    loadRegistry().catch(() => {
      featuredShell.innerHTML = '<article class="card"><div class="card-body"><div class="subtle">' + localizedText("Không tải được registry runtime. Hệ thống đang rơi về dữ liệu cục bộ.", "Unable to load the runtime registry. Falling back to local data.") + '</div></div></article>';
      tableShell.innerHTML = '<div class="subtle">' + localizedText("Không tải được bảng registry.", "Unable to load the registry table.") + '</div>';
      syncLanguage();
    });
  `;

  return renderShell({
    currentKey: "vc",
    pathname: "/",
    title: pair("VC • Registry xác minh độc lập", "VC • Independent verification registry"),
    description: pair(
      "Registry độc lập để tra cứu chứng nhận, bằng chứng và bản ghi tài sản mã hóa của hệ Về Tương Lai.",
      "An independent registry for searching credentials, evidence, and mirrored digital-asset records across the Vetuonglai system.",
    ),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [
      renderSection(pair("Bản ghi nổi bật", "Featured records"), pair("Bản ghi nội bộ và NFT mirror có thể tra cứu ngay", "Internal records and NFT mirror entries that can be opened immediately"), registry),
      renderSection(pair("Bảng registry", "Registry table"), pair("Tra nhanh mã, loại, chủ thể và trạng thái", "Quick lookup for code, type, holder, and status"), table),
      renderSection(pair("Ghi chú xác minh", "Trust notes"), pair("Cách VC giữ lớp xác minh độc lập nhưng không công bố thừa", "How VC stays independently verifiable without overexposing data"), trust),
    ],
    inlineScript,
  });
}

function renderVcRecordPage() {
  const hero = renderHero({
    eyebrow: pair("Tra cứu VC record", "VC record lookup"),
    title: pair(
      `Tra cứu bản ghi<br><span class="accent">qua đường dẫn /v/:code</span>`,
      `Open a record<br><span class="accent">through the /v/:code route</span>`,
    ),
    description: pair(
      "Trang này đọc mã từ pathname, tải registry JSON và hiển thị bằng chứng xác minh. Nó hoạt động với Pages rewrite `/v/* -> /v/index.html`.",
      "This page reads the code from the pathname, loads the registry JSON, and renders the verification evidence. It works with the Pages rewrite `/v/* -> /v/index.html`.",
    ),
    actions: [
      button("/", pair("Về VC home", "Back to VC home")),
      button(`https://${domains.hub}`, pair("Về Hub", "Back to hub"), "ghost"),
    ].join(""),
  });

  const shell = `
    <article class="card">
      <div class="card-body stack">
        <div class="result-shell" id="vc-result-shell">
          ${localizedText(pair("Đang tải dữ liệu registry...", "Loading registry data..."), "div", { class: "subtle" })}
        </div>
      </div>
    </article>
  `;

  const inlineScript = `
    const nftRegistryUrl = ${JSON.stringify(nftBridge.registryUrl || "")};
    const resultShell = document.getElementById("vc-result-shell");
    const copy = (vi, en = vi) => ({ vi, en });
    const currentLanguage = () => document.documentElement.dataset.language === "en" ? "en" : "vi";
    const statusClass = (value) => {
      if (value === "verified") return "live";
      if (value === "reviewing") return "reviewing";
      return "planned";
    };
    const escapeHtml = (value) => String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const localizedText = (vi, en = vi, tag = "span", className = "") => {
      const lang = currentLanguage();
      const cls = className ? ' class="' + className + '"' : "";
      return '<' + tag + cls + '><span data-lang="vi"' + (lang === "vi" ? "" : " hidden") + '>' + escapeHtml(vi) + '</span><span data-lang="en"' + (lang === "en" ? "" : " hidden") + '>' + escapeHtml(en) + '</span></' + tag + '>';
    };
    const syncLanguage = () => window.vetuonglaiSyncLanguage?.();
    const statusLabel = (value) => {
      if (value === "verified") return copy("Đã xác minh", "Verified");
      if (value === "reviewing") return copy("Đang rà soát", "Reviewing");
      return copy("Kế hoạch", "Planned");
    };
    const typeLabel = (value) => value === "asset" ? copy("Tài sản", "Asset") : copy("Chứng nhận", "Credential");
    const renderNotFound = (code) => {
      resultShell.innerHTML = [
        localizedText("Không tìm thấy bản ghi", "Record not found", "h2", "result-title"),
        localizedText('Mã ' + code + ' chưa tồn tại trong registry hiện tại. Hãy quay lại trang VC để thử mã khác.', 'Code ' + code + ' does not exist in the current registry. Return to VC home to try another code.', "p", "body-copy"),
      ].join("");
      syncLanguage();
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
    const mergeRecords = (localItems, remotePayload) => {
      const remoteItems = Array.isArray(remotePayload?.vcRecords)
        ? remotePayload.vcRecords
        : Array.isArray(remotePayload?.registrations)
          ? remotePayload.registrations.map((item) => item.vcRecord).filter(Boolean)
          : [];
      const byCode = new Map();
      [...localItems, ...remoteItems]
        .map((item) => ({ recordType: item.recordType || "credential", ...item }))
        .forEach((item) => {
          byCode.set(String(item.code || "").toUpperCase(), item);
        });
      return Array.from(byCode.values());
    };
    const recordText = (record, viKey, enKey) => ({
      vi: record[viKey] || "",
      en: record[enKey] || record[viKey] || "",
    });
    const programLabel = (record) => copy(
      record.program || record.assetName || record.name || record.code || "",
      record.programEn || record.assetNameEn || record.program || record.assetName || record.name || record.code || ""
    );
    const summaryLabel = (record) => copy(
      record.summary || record.description || "",
      record.summaryEn || record.descriptionEn || record.summary || record.description || ""
    );
    const scopeLabel = (record) => copy(
      record.scope || "",
      record.scopeEn || record.scope || ""
    );
    const evidenceRows = (record) => {
      const base = Array.isArray(record.evidence) ? record.evidence : [];
      const alt = Array.isArray(record.evidenceEn) ? record.evidenceEn : [];
      return base.map((item, index) => '<li>' + localizedText(item, alt[index] || item) + '</li>').join("");
    };
    const renderRecord = (record) => {
      const program = programLabel(record);
      const summary = summaryLabel(record);
      const scope = scopeLabel(record);
      const ipfs = record.anchors?.ipfs || "";
      const proofUrl = record.anchors?.proofUrl || "";
      const registryUrl = record.anchors?.registry || location.href;
      const vcUrl = record.anchors?.vc || location.href;
      const originDomain = record.domain || "nft.iai.one";
      const originHref = /^https?:/i.test(originDomain) ? originDomain : "https://" + originDomain;
      const codeType = record.code + " · " + (typeLabel(record.recordType).vi);
      const codeTypeEn = record.code + " · " + (typeLabel(record.recordType).en);
      const extras = [];
      if (record.walletAddress) extras.push('<div class="body-copy mono">Wallet: ' + escapeHtml(record.walletAddress) + '</div>');
      if (record.contractAddress) extras.push('<div class="body-copy mono">Contract: ' + escapeHtml(record.contractAddress) + '</div>');
      if (record.tokenId) extras.push('<div class="body-copy mono">Token ID: ' + escapeHtml(record.tokenId) + '</div>');
      resultShell.innerHTML = [
        '<div class="cluster" style="justify-content:space-between;align-items:flex-start">',
        '<div><div class="badge ' + statusClass(record.status) + '">' + localizedText(statusLabel(record.status).vi, statusLabel(record.status).en) + '</div>' + localizedText(program.vi, program.en, 'h2', 'result-title') + '<div class="subtle mono">' + localizedText(codeType, codeTypeEn) + '</div></div>',
        '<button class="button ghost" type="button" data-copy="' + escapeHtml(record.anchors?.contentHash || "") + '" data-label-vi="Sao chép hash" data-label-en="Copy hash" data-success-vi="Đã chép" data-success-en="Copied" data-error-vi="Lỗi sao chép" data-error-en="Copy failed">' + localizedText("Sao chép hash", "Copy hash") + '</button>',
        '</div>',
        localizedText(summary.vi, summary.en, 'p', 'body-copy'),
        '<div class="grid-2">',
        '<article class="card"><div class="card-body stack">' + localizedText("Chủ thể nhận", "Recipient", "h3", "card-title") + localizedText(record.holder || record.walletAddress || "Unknown", record.holder || record.walletAddress || "Unknown", "div", "body-copy") + localizedText(scope.vi, scope.en, 'div', 'body-copy') + '</div></article>',
        '<article class="card"><div class="card-body stack">' + localizedText("Nguồn phát hành", "Issuing source", "h3", "card-title") + localizedText(record.issuer || "Registry độc lập", record.issuer || "Independent registry", "div", "body-copy") + '<div class="body-copy mono">' + escapeHtml(originDomain) + '</div><div class="body-copy mono">' + localizedText('Phát hành: ' + (record.issuedAt || ""), 'Issued: ' + (record.issuedAt || "")) + '</div></div></article>',
        '</div>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack">' + localizedText("Bằng chứng", "Evidence", "h3", "card-title") + '<ul class="list">' + evidenceRows(record) + '</ul></div></article>',
        '<article class="card" style="margin-top:16px"><div class="card-body stack">' + localizedText("Anchors", "Anchors", "h3", "card-title") + '<div class="body-copy mono">Hash: ' + escapeHtml(record.anchors?.contentHash || "") + '</div>' + (ipfs ? '<div class="body-copy mono">IPFS: ' + escapeHtml(ipfs) + '</div>' : '') + (proofUrl ? '<div class="body-copy mono">Proof: ' + escapeHtml(proofUrl) + '</div>' : '') + '<div class="body-copy mono">Registry: ' + escapeHtml(registryUrl) + '</div>' + extras.join("") + '<div class="cluster"><a class="button primary" href="' + escapeHtml(originHref) + '" target="_blank" rel="noreferrer">' + localizedText("Mở domain gốc", "Open source domain") + '</a><a class="button ghost" href="' + escapeHtml(vcUrl) + '" target="_blank" rel="noreferrer">' + localizedText("Mở URL VC", "Open VC URL") + '</a><a class="button ghost" href="/?lang=' + currentLanguage() + '">' + localizedText("Tra mã khác", "Look up another code") + '</a></div></div></article>',
      ].join("");
      syncLanguage();
    };
    Promise.all([
      fetch("/api/certificates.json").then((response) => response.ok ? response.json() : []).catch(() => []),
      nftRegistryUrl
        ? fetch(nftRegistryUrl).then((response) => response.ok ? response.json() : { vcRecords: [] }).catch(() => ({ vcRecords: [] }))
        : Promise.resolve({ vcRecords: [] }),
    ])
      .then(([localItems, remotePayload]) => {
        const code = pickCode();
        const items = mergeRecords(localItems, remotePayload);
        if (!code) {
          resultShell.innerHTML = [
            localizedText("Nhập mã để xác minh", "Enter a code to verify", "h2", "result-title"),
            localizedText("Mở đường dẫn dạng /v/VC-2026-0001 hoặc dùng form tra cứu ở trang chủ VC.", "Open a route like /v/VC-2026-0001 or use the lookup form on the VC home page.", "p", "body-copy"),
          ].join("");
          syncLanguage();
          return;
        }
        const record = items.find((item) => String(item.code || "").toUpperCase() === code);
        if (!record) {
          renderNotFound(code);
          return;
        }
        renderRecord(record);
      })
      .catch(() => {
        resultShell.innerHTML = [
          localizedText("Không tải được registry", "Unable to load the registry", "h2", "result-title"),
          localizedText("Kiểm tra lại file /api/certificates.json, NFT mirror runtime và rewrite /v/*.", "Check /api/certificates.json, the NFT runtime mirror, and the /v/* rewrite.", "p", "body-copy"),
        ].join("");
        syncLanguage();
      });
  `;

  return renderShell({
    currentKey: "vc",
    pathname: "/v/",
    title: pair("Tra cứu bản ghi VC", "VC Record Lookup"),
    description: pair(
      "Trang tra cứu chi tiết cho từng mã chứng nhận hoặc tài sản trên vc.vetuonglai.com.",
      "The detailed lookup page for every credential or asset record on vc.vetuonglai.com.",
    ),
    navItems: ecosystemNav("vc"),
    hero,
    sections: [renderSection(pair("Kết quả tra cứu", "Lookup result"), pair("Chỉ hiển thị phần bằng chứng cần thiết cho việc xác minh", "Only the evidence required for verification is displayed"), shell)],
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
    title: cardTitle(pair(course.title, course.titleEn)),
    badge: statusBadge("beta", pair(course.level, course.level)),
    body: cardText(pair(course.summary, course.summaryEn)),
    meta: [
      `<span>${escapeHtml(course.duration)}</span>`,
      `<span>${escapeHtml(course.price)}</span>`,
      `<span>${escapeHtml(course.certificateCode)}</span>`,
    ].join(""),
    actions: [
      button(`/course/${course.slug}/`, pair("Xem chi tiết", "View details")),
      button(`https://${domains.vc}/v/${course.certificateCode}`, pair("Mở VC sample", "Open VC sample"), "ghost"),
    ].join(""),
  })));

  const architecture = renderCards([
    renderCard({
      title: cardTitle(pair("Trang khóa học", "Course page")),
      badge: statusBadge("live", pair("nội dung", "content")),
      body: cardText(pair(
        "Mỗi khóa học có route chi tiết với outcomes, modules, duration và mã VC mẫu đi kèm.",
        "Each course has a detailed route with outcomes, modules, duration, and a linked VC sample code.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Dữ liệu catalog JSON", "Catalog JSON")),
      badge: statusBadge("live", pair("API tĩnh", "static API")),
      body: cardText(pair(
        "EDU xuất `/api/catalog.json` để các app khác đọc catalog chuẩn mà không phụ thuộc runtime server.",
        "EDU exports `/api/catalog.json` so other apps can read a standard catalog without depending on a runtime server.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Gói chứng nhận", "Credential packet")),
      badge: statusBadge("live", pair("cầu VC", "VC bridge")),
      body: cardText(pair(
        "Sau khi hoàn thành đầu ra, hồ sơ học viên được chuẩn hóa thành packet để VC cấp mã và xác minh độc lập.",
        "When outcomes are completed, learner evidence is normalized into a packet so VC can issue a code and verify it independently.",
      )),
    }),
  ]);

  const flow = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Flow cấp credential", "Credential issuance flow"))}
          ${renderList([
            pair("Học viên hoàn thành đầu ra và nộp bằng chứng tối thiểu.", "The learner completes the outcomes and submits minimum evidence."),
            pair("EDU rà soát hồ sơ, mentor review và chuẩn hóa packet.", "EDU reviews the dossier, runs mentor review, and normalizes the packet."),
            pair("VC nhận mã, hash, anchors và công bố lớp verify độc lập.", "VC receives the code, hash, and anchors, then publishes the independent verification layer."),
          ], { ordered: true })}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Các endpoint đang mở", "Published endpoints"))}
          <div class="body-copy mono">/api/health<br>/api/catalog.json<br>/courses/<br>/course/:slug/</div>
          ${localizedText(pair(
            "Tất cả đều là static output để preview, deploy và mirror dễ dàng hơn.",
            "Everything is emitted as static output so previewing, deploying, and mirroring stay simple.",
          ), "div", { class: "subtle" })}
        </div>
      </article>
    </div>
  `;

  const hero = renderHero({
    eyebrow: pair("Lớp giáo dục tương lai", "Future education layer"),
    title: pair(
      `Học không phải để thi.<br><span class="accent">Học để làm được.</span>`,
      `Learning is not for exams.<br><span class="accent">Learning is for real action.</span>`,
    ),
    description: pair(
      "Bạn sẽ học cùng AI, và học bằng chính trải nghiệm của mình.",
      "You learn with AI, through your own lived experience.",
    ),
    actions: [
      button("/courses/", pair("Bắt đầu học", "Start learning")),
      button(`https://${domains.vc}`, pair("Mở VC", "Open VC"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: String(courses.length), label: pair("khóa học nổi bật", "featured courses") },
      { value: "VC", label: pair("lớp chứng nhận", "credential layer") },
      { value: "/api/health", label: pair("health endpoint", "health endpoint") },
      { value: "static", label: pair("mô hình deploy", "deployment model") },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    pathname: "/",
    title: pair("Giáo Dục Tương Lai • EDU", "Future Education • EDU"),
    description: pair(
      "Catalog khóa học, course detail và micro-credential layer cho edu.vetuonglai.com.",
      "Course catalog, course detail pages, and the micro-credential layer for edu.vetuonglai.com.",
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Featured Courses", "Featured courses"), pair("Catalog được sinh từ source data chung", "The catalog is generated from shared source data"), featuredCards),
      renderSection(pair("Kiến trúc học tập", "Learning architecture"), pair("Ba lớp giúp EDU không bị dừng ở content-only", "Three layers that prevent EDU from stopping at content-only publishing"), architecture),
      renderSection(pair("Luồng chứng nhận", "Credential flow"), pair("EDU không cấp chứng chỉ mơ hồ, mọi thứ đều đi qua VC", "EDU does not issue vague credentials; every proof packet goes through VC"), flow),
    ],
  });
}

function renderEduCoursesPage() {
  const list = renderCards(courses.map((course) => renderCard({
    title: cardTitle(pair(course.title, course.titleEn)),
    badge: statusBadge("beta", pair(course.level, course.level)),
    body: cardHtml(pair(
      `${escapeHtml(course.tagline)}<br><br>${escapeHtml(course.summary)}`,
      `${escapeHtml(course.taglineEn)}<br><br>${escapeHtml(course.summaryEn)}`,
    )),
    meta: [
      `<span>${escapeHtml(course.duration)}</span>`,
      `<span>${escapeHtml(course.price)}</span>`,
      `<span>${escapeHtml(course.certificateCode)}</span>`,
    ].join(""),
    actions: [
      button(`/course/${course.slug}/`, pair("Xem chi tiết", "View details")),
      button(`https://${domains.vc}/v/${course.certificateCode}`, pair("Mở VC", "Open VC"), "ghost"),
    ].join(""),
  })));

  const hero = renderHero({
    eyebrow: pair("Danh mục khóa học", "Course catalog"),
    title: pair(
      `Danh sách khóa học<br><span class="accent">gom từ source data chung</span>`,
      `Course catalog<br><span class="accent">assembled from shared source data</span>`,
    ),
    description: pair(
      "Mỗi khóa học đều có route chi tiết, outcomes, modules và mã VC mẫu để kiểm tra logic chứng nhận.",
      "Each course includes a detail route, outcomes, modules, and a VC sample code to validate the credential flow.",
    ),
    actions: [
      button("/", pair("Về EDU home", "Back to EDU home")),
      button(`https://${domains.hub}`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
  });

  return renderShell({
    currentKey: "edu",
    activeKey: "edu",
    pathname: "/courses/",
    title: pair("Danh sách khóa học • EDU", "Course catalog • EDU"),
    description: pair(
      "Danh sách khóa học chính thức cho edu.vetuonglai.com.",
      "The official course catalog for edu.vetuonglai.com.",
    ),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [renderSection(pair("Course Cards", "Course cards"), pair("Toàn bộ card được sinh trực tiếp từ courses.json", "Every card is generated directly from courses.json"), list)],
  });
}

function renderEduCourseDetail(course) {
  const outcomes = renderList(course.outcomes.map((item, index) => pair(item, course.outcomesEn[index] || item)));
  const modules = renderList(course.modules.map((item, index) => pair(item, course.modulesEn[index] || item)));

  const structure = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Đầu ra", "Outcomes"))}
          ${outcomes}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Các mô-đun", "Modules"))}
          ${modules}
        </div>
      </article>
    </div>
  `;

  const credentialAnchor = renderCards([
    renderCard({
      title: cardTitle(pair("Mẫu VC", "VC sample")),
      badge: statusBadge("live", pair("đối chiếu", "reference")),
      body: cardText(pair(
        `Khóa học này nối sẵn tới bản ghi mẫu ${course.certificateCode} trên VC để kiểm tra cách xuất credential.`,
        `This course is already linked to sample record ${course.certificateCode} on VC so the credential flow can be inspected.`,
      )),
      actions: button(`https://${domains.vc}/v/${course.certificateCode}`, pair("Mở sample VC", "Open VC sample"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Thời lượng và cấp độ", "Duration & level")),
      badge: statusBadge("beta", pair("khóa học", "course")),
      body: cardText(pair(
        `${course.duration} • ${course.level} • ${course.price}`,
        `${course.durationEn} • ${course.level} • ${course.price}`,
      )),
    }),
    renderCard({
      title: cardTitle(pair("Triển khai", "Deployment")),
      badge: statusBadge("live", pair("tĩnh", "static")),
      body: cardText(pair(
        "Route này được build ra HTML tĩnh để đảm bảo preview, deploy và indexing không phụ thuộc backend riêng.",
        "This route is built into static HTML so preview, deployment, and indexing do not depend on a separate backend.",
      )),
    }),
  ]);

  const hero = renderHero({
    eyebrow: pair("Chi tiết khóa học", "Course detail"),
    title: pair(
      `${escapeHtml(course.title)}<br><span class="accent">${escapeHtml(course.tagline)}</span>`,
      `${escapeHtml(course.titleEn)}<br><span class="accent">${escapeHtml(course.taglineEn)}</span>`,
    ),
    description: pair(course.summary, course.summaryEn),
    actions: [
      button("/courses/", pair("Về catalog", "Back to catalog")),
      button(`https://${domains.vc}/v/${course.certificateCode}`, pair("Mở sample credential", "Open sample credential"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: course.level, label: pair("cấp độ", "level") },
      { value: course.duration, label: pair("thời lượng", "duration") },
      { value: course.price, label: pair("mức phí", "price") },
      { value: course.certificateCode, label: pair("mã VC mẫu", "sample VC code") },
    ]),
  });

  return renderShell({
    currentKey: "edu",
    pathname: `/course/${course.slug}/`,
    title: pair(`${course.title} • EDU`, `${course.titleEn} • EDU`),
    description: pair(course.summary, course.summaryEn),
    navItems: ecosystemNav("edu"),
    hero,
    sections: [
      renderSection(pair("Cấu trúc khóa học", "Course structure"), pair("Đầu ra và module được dùng làm khung đối chiếu khi cấp chứng nhận", "Outcomes and modules are used as the reference frame for credential issuance"), structure),
      renderSection(pair("Mối nối chứng nhận", "Credential anchor"), pair("Mối nối từ course detail sang lớp VC độc lập", "How the course detail route connects into the independent VC layer"), credentialAnchor),
    ],
  });
}

function renderGreenPage() {
  const cards = renderCards([
    renderCard({
      title: cardTitle(pair("Hồ sơ tác động", "Impact dossier")),
      badge: statusBadge("live", pair("bằng chứng", "proof")),
      body: cardText(pair(
        "Mỗi hoạt động xanh được chuẩn hóa thành bộ hồ sơ gồm baseline, bằng chứng trước/sau, checklist đối chiếu và anchor xác minh.",
        "Every green action is normalized into a dossier with a baseline, before/after evidence, review checklist, and verification anchor.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Mẫu chương trình", "Program templates")),
      badge: statusBadge("live", pair("mẫu", "template")),
      body: cardText(pair(
        "Có sẵn khuôn cho cộng đồng, doanh nghiệp nhỏ và chương trình giáo dục xanh để tái sử dụng cùng một cách ghi bằng chứng.",
        "Shared templates are ready for communities, small businesses, and green-education programs so the evidence structure stays reusable.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Cầu VC", "VC bridge")),
      badge: statusBadge("live", pair("xác minh", "verification")),
      body: cardText(pair(
        "GREEN phát hành hồ sơ tác động, nhưng mọi chứng nhận chính thức vẫn đi qua VC để tạo lớp xác minh độc lập.",
        "GREEN issues the impact dossier, but every formal credential still runs through VC to preserve independent verification.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0008`, pair("Xem sample VC", "View VC sample"), "ghost"),
    }),
  ]);

  const standards = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Bằng chứng tối thiểu", "Minimum evidence"))}
          ${renderList([
            pair("Baseline trước khi can thiệp", "A baseline before intervention"),
            pair("Chuỗi bằng chứng trong quá trình thực hiện", "A sequence of evidence during execution"),
            pair("Post-check và người đối chiếu", "A post-check plus a reviewer"),
            pair("Hash packet để verify trên VC", "A hashed packet that can be verified on VC"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Use case điển hình", "Typical use cases"))}
          ${renderList([
            pair("Pilot 30 ngày cho cộng đồng giảm rác thải", "A 30-day community waste-reduction pilot"),
            pair("Báo cáo hành vi xanh trong trường học hoặc doanh nghiệp nhỏ", "Green-behavior reporting in schools or small businesses"),
            pair("Hồ sơ tác động gắn với khóa học hoặc chiến dịch cộng đồng", "Impact dossiers attached to courses or community campaigns"),
          ])}
        </div>
      </article>
    </div>
  `;

  const hero = renderHero({
    eyebrow: pair("Lớp chứng nhận môi trường", "Green proof layer"),
    title: pair(
      `GREEN<br><span class="accent">bạn không cần cứu thế giới</span>`,
      `GREEN<br><span class="accent">you do not need to save the world</span>`,
    ),
    description: pair(
      "Chỉ cần sống có trách nhiệm hơn một chút mỗi ngày.",
      "Just live a little more responsibly each day.",
    ),
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0008`, pair("Mở chứng nhận mẫu", "Open sample credential")),
      button(`https://${domains.hub}`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "30d", label: pair("chu kỳ pilot", "pilot cycle") },
      { value: "3", label: pair("lớp bằng chứng", "proof layers") },
      { value: "VC", label: pair("điểm xác minh", "verification endpoint") },
      { value: "ready", label: pair("trạng thái", "status") },
    ]),
  });

  return renderShell({
    currentKey: "green",
    pathname: "/",
    title: pair("Chứng Chỉ Môi Trường • GREEN", "Environmental Credentials • GREEN"),
    description: pair(
      "Layer môi trường của Về Tương Lai để chuẩn hóa bằng chứng và xác minh qua VC.",
      "The environmental layer of Vetuonglai for standardized evidence and VC verification.",
    ),
    navItems: ecosystemNav("green"),
    hero,
    sections: [
      renderSection(pair("Product Blocks", "Product blocks"), pair("Những khối cốt lõi của GREEN layer", "The core blocks of the GREEN layer"), cards),
      renderSection(pair("Evidence Standard", "Evidence standard"), pair("Không xác minh bằng khẩu hiệu, mà bằng packet", "Verification runs on packets, not slogans"), standards),
    ],
  });
}

function renderFinancePage() {
  const tracks = renderCards([
    renderCard({
      title: cardTitle(pair("Kỷ luật tiền bạc", "Money discipline")),
      badge: statusBadge("live", pair("sprint", "sprint")),
      body: cardText(pair(
        "Thiết lập ngân sách, quỹ khẩn cấp và kỷ luật giữ dòng tiền sạch, dễ quan sát.",
        "Set up a budget, emergency fund, and a clean money discipline that can actually be observed.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0012`, pair("Chứng nhận mẫu", "Sample credential"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Lăng kính chống lừa đảo", "Anti-scam lens")),
      badge: statusBadge("live", pair("an toàn", "safety")),
      body: cardText(pair(
        "Tách các dấu hiệu lừa đảo, chiêu trò tạo khẩn cấp và cách đối chiếu thông tin trước khi xuống tiền.",
        "Separate common scam signals, urgency tactics, and the checks you should run before committing money.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Tư duy dài hạn", "Long-term thinking")),
      badge: statusBadge("live", pair("tư duy", "mindset")),
      body: cardText(pair(
        "Không dạy làm giàu nhanh. FIN tập trung vào hệ thống quyết định, đệm rủi ro và thói quen dài hạn.",
        "This is not about getting rich quickly. FIN focuses on decision systems, risk buffers, and long-term habits.",
      )),
    }),
  ]);

  const checklist = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("4 bộ lọc cơ bản", "The four core filters"))}
          ${renderList([
            pair("Khoản tiền này có phải tiền nhàn rỗi và có thể chấp nhận rủi ro không?", "Is this actually risk capital that you can afford to expose?"),
            pair("Nếu sai, mình mất bao nhiêu và mất trong bao lâu?", "If this goes wrong, how much do you lose and for how long?"),
            pair("Nguồn thông tin có độc lập và kiểm tra được không?", "Is the information source independent and verifiable?"),
            pair("Có áp lực phải vào ngay hay bị dọa mất cơ hội không?", "Are you being pushed into urgency or fear of missing out?"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("FIN dùng VC ở đâu", "Where FIN uses VC"))}
          ${cardText(pair(
            "Các sprint như Money Discipline có thể xuất certificate mẫu sang VC để người học kiểm tra quy trình xác minh thay vì chỉ xem landing page.",
            "Sprints such as Money Discipline can export sample certificates into VC so learners can inspect the verification flow instead of only reading a landing page.",
          ), "body-copy")}
        </div>
      </article>
    </div>
  `;

  const hero = renderHero({
    eyebrow: pair("Lớp giáo dục tài chính", "Financial literacy layer"),
    title: pair(
      `FINANCE<br><span class="accent">không cần kiếm thật nhiều tiền trước</span>`,
      `FINANCE<br><span class="accent">you do not need to earn a lot first</span>`,
    ),
    description: pair(
      "Cần hiểu tiền trước.",
      "You need to understand money first.",
    ),
    actions: [
      button(`https://${domains.edu}/courses/`, pair("Xem khóa học liên quan", "View related courses")),
      button(`https://${domains.hub}`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "21d", label: pair("thời lượng sprint", "sprint length") },
      { value: "8", label: pair("dấu hiệu anti-scam", "anti-scam signals") },
      { value: "VC", label: pair("cầu chứng nhận", "credential bridge") },
      { value: "core", label: pair("trạng thái", "status") },
    ]),
  });

  return renderShell({
    currentKey: "finance",
    pathname: "/",
    title: pair("Tài Chính Cơ Bản • FIN", "Core Financial Literacy • FIN"),
    description: pair(
      "Layer tài chính cơ bản của Về Tương Lai với nội dung thực dụng và lớp xác minh VC.",
      "The core financial literacy layer of Vetuonglai with practical content and VC verification.",
    ),
    navItems: ecosystemNav("finance"),
    hero,
    sections: [
      renderSection(pair("Các trục nội dung", "Tracks"), pair("Ba không gian cốt lõi của FIN", "The three core tracks of FIN"), tracks),
      renderSection(pair("Bộ lọc quyết định", "Decision filter"), pair("Khung lọc giúp tránh mất tiền vì mù mờ", "A filter framework that helps prevent losses driven by ambiguity"), checklist),
    ],
  });
}

function renderLifePage() {
  const blocks = renderCards([
    renderCard({
      title: cardTitle(pair("Giấc ngủ và hồi phục", "Sleep & recovery")),
      badge: statusBadge("planned", pair("pilot", "pilot")),
      body: cardText(pair(
        "LIFE bắt đầu từ baseline giấc ngủ, giờ ngủ, giờ dậy, ánh sáng buổi sáng và khả năng hồi phục.",
        "LIFE starts with a sleep baseline, bedtime, wake-up time, morning light, and recovery capacity.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Tập trung và nhịp sống", "Focus & rhythm")),
      badge: statusBadge("planned", pair("pilot", "pilot")),
      body: cardText(pair(
        "Mục tiêu không phải làm thêm nhiều việc mà là thiết lập nhịp sống ổn định, quan sát được và dễ lặp lại.",
        "The goal is not to do more tasks, but to establish a stable, observable rhythm that can actually be repeated.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Chứng nhận Life Reset", "Life reset credential")),
      badge: statusBadge("planned", pair("blueprint", "blueprint")),
      body: cardText(pair(
        "Pilot LIFE đã có blueprint chứng nhận và bản ghi VC mẫu ở trạng thái reviewing để chuẩn bị cho đợt mở đầu tiên.",
        "The LIFE pilot already has a credential blueprint and a VC sample record in reviewing mode, ready for the first rollout.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0017`, pair("Xem blueprint VC", "View VC blueprint"), "ghost"),
    }),
  ]);

  const operatingLoop = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Operating loop hằng ngày", "Daily operating loop"))}
          ${renderList([
            pair("Giữ giờ ngủ và giờ dậy ổn định trong một khung hẹp.", "Keep sleep and wake times within a narrow stable window."),
            pair("Đo năng lượng ở ba mốc trong ngày để nhận diện nhịp giảm và phục hồi.", "Measure energy at three points in the day to detect drop-offs and recovery."),
            pair("Theo dõi mức tập trung, vận động nhẹ và cường độ kích thích số.", "Track focus, light movement, and the intensity of digital stimulation."),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Rà soát hằng tuần", "Weekly review"))}
          ${renderList([
            pair("So baseline tuần này với tuần trước thay vì phán đoán theo cảm giác.", "Compare this week to the last baseline instead of guessing from mood."),
            pair("Xác định một thay đổi nhỏ có thể giữ được thêm 7 ngày.", "Identify one small change that can be maintained for another 7 days."),
            pair("Chuẩn bị packet bằng chứng tối thiểu nếu muốn bước sang lớp xác minh VC.", "Prepare the minimum evidence packet if you want to move into VC verification."),
          ])}
        </div>
      </article>
    </div>
  `;

  const readiness = renderCards([
    renderCard({
      title: cardTitle(pair("Tiếp nhận pilot", "Pilot intake")),
      badge: statusBadge("planned", pair("chuẩn bị", "intake")),
      body: cardText(pair(
        "Trang LIFE hiện đã đủ để mở intake form, mô tả hành trình pilot và trình bày rõ bằng chứng đầu ra cần có.",
        "The LIFE page is now complete enough to open intake, explain the pilot journey, and define the required evidence outputs.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Rà soát mentor", "Mentor review")),
      badge: statusBadge("planned", pair("review", "review")),
      body: cardText(pair(
        "LIFE giữ mode reviewing cho đến khi mentor checklist và baseline packet đủ rõ để công bố rộng.",
        "LIFE stays in reviewing mode until the mentor checklist and baseline packet are clear enough for wider publication.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Sẵn sàng cutover DNS", "DNS cutover ready")),
      badge: statusBadge("planned", pair("hạ tầng", "infrastructure")),
      body: cardText(pair(
        "Dù host công khai chưa resolve hoàn toàn, source và dist của LIFE đã ở trạng thái đủ chuẩn để cutover khi DNS sẵn sàng.",
        "Even though the public host is not fully resolving yet, the LIFE source and dist output are now standardized enough for DNS cutover.",
      )),
    }),
  ]);

  const hero = renderHero({
    eyebrow: pair("Lớp điều hành đời sống", "Life operating layer"),
    title: pair(
      `LIFE<br><span class="accent">một cuộc sống ổn định không đến từ may mắn</span>`,
      `LIFE<br><span class="accent">a stable life does not come from luck</span>`,
    ),
    description: pair(
      "Nó đến từ cách bạn sống mỗi ngày.",
      "It comes from how you live each day.",
    ),
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0017`, pair("Mở blueprint VC", "Open VC blueprint")),
      button(`https://${domains.hub}`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "14d", label: pair("chu kỳ pilot", "pilot cycle") },
      { value: "3", label: pair("khối ritual", "ritual blocks") },
      { value: "reviewing", label: pair("chế độ chứng nhận", "credential mode") },
      { value: "preview", label: pair("trạng thái DNS", "DNS status") },
    ]),
  });

  return renderShell({
    currentKey: "life",
    pathname: "/",
    title: pair("Đời Sống Tương Lai • LIFE", "Future Life • LIFE"),
    description: pair(
      "Phiên bản LIFE hoàn chỉnh cho pilot đời sống với blueprint xác minh VC.",
      "The complete LIFE pilot edition with a VC verification blueprint.",
    ),
    navItems: ecosystemNav("life"),
    hero,
    sections: [
      renderSection(pair("Khối pilot", "Pilot blocks"), pair("Những khối đã đủ chi tiết để triển khai pilot thực tế", "The blocks that are now detailed enough for a real pilot rollout"), blocks),
      renderSection(pair("Vòng vận hành", "Operating loop"), pair("Khung theo dõi hằng ngày và review hằng tuần", "The daily tracking and weekly review framework"), operatingLoop),
      renderSection(pair("Mức sẵn sàng", "Readiness"), pair("Những phần còn lại trước khi host công khai được cắt sang bản mới", "What remains before the public host is switched to the updated version"), readiness),
    ],
  });
}

function renderInvestPage() {
  const blocks = renderCards([
    renderCard({
      title: cardTitle(pair("Ưu tiên rủi ro", "Risk first")),
      badge: statusBadge("planned", pair("cốt lõi", "core")),
      body: cardText(pair(
        "INVEST không bắt đầu bằng cơ hội mà bắt đầu bằng câu hỏi: nếu sai thì mất gì, mất bao nhiêu và mất trong bao lâu.",
        "INVEST does not begin with opportunity. It begins with the question: if this is wrong, what do you lose, how much, and for how long?",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Thẩm định độc lập", "Due diligence")),
      badge: statusBadge("planned", pair("checklist", "checklist")),
      body: cardText(pair(
        "Checklist kiểm tra nguồn thông tin, động cơ, dòng tiền, cấu trúc incentive và các vùng mờ trước khi ra quyết định.",
        "A checklist for validating sources, incentives, cash flow, structural motives, and blind spots before making a decision.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("Kỷ luật phân bổ", "Allocation discipline")),
      badge: statusBadge("planned", pair("guardrail", "guardrail")),
      body: cardText(pair(
        "Không FOMO, không all-in, không biến một niềm tin chưa được kiểm tra thành tỷ trọng quá lớn trong danh mục.",
        "No FOMO, no all-in behavior, and no turning an untested belief into an oversized portfolio position.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0024`, pair("Xem blueprint VC", "View VC blueprint"), "ghost"),
    }),
  ]);

  const diligence = `
    <div class="split">
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Khung 5 câu hỏi", "The five-question filter"))}
          ${renderList([
            pair("Mình đang mua dòng tiền, tài sản hay chỉ mua một câu chuyện hấp dẫn?", "Am I buying cash flow, an asset, or only an attractive story?"),
            pair("Ai hưởng lợi trực tiếp nếu mình vào lệnh hoặc vào vốn?", "Who benefits directly if I enter this position?"),
            pair("Thông tin có ít nhất hai nguồn độc lập hay chỉ là một nguồn được lặp lại?", "Do I have at least two independent sources, or one repeated source?"),
            pair("Điểm dừng lỗ, điều kiện thoát và thời gian nắm giữ đã rõ chưa?", "Are the stop-loss, exit conditions, and holding period already defined?"),
            pair("Nếu bỏ qua cơ hội này thì cuộc sống của mình có xấu đi thật không?", "If I skip this opportunity, does my life meaningfully get worse?"),
          ])}
        </div>
      </article>
      <article class="card">
        <div class="card-body stack">
          ${cardTitle(pair("Đầu ra pilot", "Pilot outputs"))}
          ${renderList([
            pair("Bảng xác định khẩu vị rủi ro", "A risk-appetite worksheet"),
            pair("Research memo một trang", "A one-page research memo"),
            pair("Kill-switch rõ ràng trước khi giải ngân", "A clear kill-switch before capital is deployed"),
            pair("Blueprint chứng nhận để VC có thể xác minh độc lập", "A credential blueprint so VC can independently verify the process"),
          ])}
        </div>
      </article>
    </div>
  `;

  const readiness = renderCards([
    renderCard({
      title: cardTitle(pair("Nội dung sẵn sàng cho pilot", "Pilot-ready content")),
      badge: statusBadge("planned", pair("nội dung", "content")),
      body: cardText(pair(
        "Trang INVEST giờ đã đủ chiều sâu để dùng làm portal pilot thay vì chỉ là placeholder giới thiệu một vài ý tưởng.",
        "The INVEST page is now deep enough to serve as a pilot portal instead of just a placeholder listing a few ideas.",
      )),
    }),
    renderCard({
      title: cardTitle(pair("VC blueprint", "VC blueprint")),
      badge: statusBadge("planned", pair("xác minh", "verification")),
      body: cardText(pair(
        "Bản ghi VC-2026-0024 đóng vai trò bản mẫu cho lifecycle chứng nhận đầu tư tỉnh táo khi pilot mở chính thức.",
        "VC-2026-0024 acts as the sample record for the sane-investing credential lifecycle when the pilot opens formally.",
      )),
      actions: button(`https://${domains.vc}/v/VC-2026-0024`, pair("Mở VC sample", "Open VC sample"), "ghost"),
    }),
    renderCard({
      title: cardTitle(pair("Cutover DNS", "DNS cutover")),
      badge: statusBadge("planned", pair("hạ tầng", "infrastructure")),
      body: cardText(pair(
        "Dù `invest.vetuonglai.com` chưa resolve công khai ở mọi nơi, source hiện tại đã được hoàn thiện như một site production-ready.",
        "Even though `invest.vetuonglai.com` is not publicly resolving everywhere yet, the current source is now completed as a production-ready site.",
      )),
    }),
  ]);

  const hero = renderHero({
    eyebrow: pair("Lớp đầu tư tỉnh táo", "Sane investing layer"),
    title: pair(
      `INVEST<br><span class="accent">đầu tư không phải để thắng nhanh</span>`,
      `INVEST<br><span class="accent">investing is not about winning quickly</span>`,
    ),
    description: pair(
      "Mà để đi xa mà không mất mình.",
      "It is about going far without losing yourself.",
    ),
    actions: [
      button(`https://${domains.vc}/v/VC-2026-0024`, pair("Mở blueprint VC", "Open VC blueprint")),
      button(`https://${domains.hub}`, pair("Về hub", "Back to hub"), "ghost"),
    ].join(""),
    aside: renderMetrics([
      { value: "5", label: pair("câu hỏi sàng lọc", "screening questions") },
      { value: "0", label: pair("độ dung nạp FOMO", "FOMO tolerance") },
      { value: "planned", label: pair("trạng thái DNS", "DNS status") },
      { value: "ready", label: pair("trạng thái source", "source status") },
    ]),
  });

  return renderShell({
    currentKey: "invest",
    pathname: "/",
    title: pair("Đầu Tư Tỉnh Táo • INVEST", "Sane Investing • INVEST"),
    description: pair(
      "Phiên bản INVEST hoàn chỉnh với guardrails, due diligence và blueprint chứng nhận độc lập.",
      "The completed INVEST edition with guardrails, due diligence, and an independent credential blueprint.",
    ),
    navItems: ecosystemNav("invest"),
    hero,
    sections: [
      renderSection(pair("Hàng rào an toàn", "Guardrails"), pair("Ba lớp bảo vệ trước khi nói đến cơ hội", "Three protection layers before talking about opportunity"), blocks),
      renderSection(pair("Thẩm định", "Due diligence"), pair("Checklist và deliverables cần có trước khi đưa tiền vào bất kỳ tài sản nào", "The checklist and deliverables required before allocating capital to any asset"), diligence),
      renderSection(pair("Mức sẵn sàng", "Readiness"), pair("Những phần đã hoàn thiện để INVEST có thể vận hành như một site thật", "What is now complete enough for INVEST to operate like a real site"), readiness),
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
  await writeSiteFile(domain, "assets/design-tokens.css", designTokensCss);
  await writeSiteFile(domain, "assets/design-tokens.json", designTokensJson);
  await writeSiteFile(domain, "assets/style.css", styleCss);
  await writeSiteFile(domain, "assets/app.js", sharedJs);
}

async function build() {
  await rm(DIST, { recursive: true, force: true });

  const hubPaths = ["/", "/apps.json", "/manifest.json"];
  const vcPaths = ["/", "/v/"];
  const eduPaths = ["/", "/courses/", "/api/health", "/api/catalog.json", ...courses.map((course) => `/course/${course.slug}/`)];
  const simplePaths = ["/"];

  await writeAssets(domains.hub);
  await writeSiteFile(domains.hub, "index.html", renderHubPage());
  await writeSiteFile(domains.hub, "apps.json", renderStaticJson(apps));
  await writeSiteFile(domains.hub, "manifest.json", renderStaticJson(system));
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
