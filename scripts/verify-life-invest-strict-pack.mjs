const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_LIFE_INVEST_TIMEOUT_MS || 12000);
const DEFAULT_LIFE_URL = process.env.VTL_LIFE_BASE_URL || "https://life.vetuonglai.com";
const DEFAULT_INVEST_URL = process.env.VTL_INVEST_BASE_URL || "https://invest.vetuonglai.com";
const DEFAULT_VERIFY_WINDOW = process.env.VTL_LIFE_INVEST_VERIFY_WINDOW || "24h";

function normalizeBaseUrl(input) {
  return String(input || "").replace(/\/+$/, "");
}

function parseCliArgs(argv) {
  const options = {
    lifeUrl: normalizeBaseUrl(DEFAULT_LIFE_URL),
    investUrl: normalizeBaseUrl(DEFAULT_INVEST_URL),
    timeoutMs: DEFAULT_TIMEOUT_MS,
    selfTest: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--life-url") {
      options.lifeUrl = normalizeBaseUrl(argv[index + 1] || options.lifeUrl);
      index += 1;
      continue;
    }
    if (arg === "--invest-url") {
      options.investUrl = normalizeBaseUrl(argv[index + 1] || options.investUrl);
      index += 1;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[index + 1] || options.timeoutMs);
      index += 1;
      continue;
    }
    if (arg === "--self-test") {
      options.selfTest = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function usageText() {
  return [
    "node scripts/verify-life-invest-strict-pack.mjs",
    "",
    "Strict verify pack cho Wave C: life + invest.",
    "",
    "Tuy chon:",
    "  --life-url <url>      Base URL life. Mac dinh: https://life.vetuonglai.com",
    "  --invest-url <url>    Base URL invest. Mac dinh: https://invest.vetuonglai.com",
    "  --timeout-ms <ms>     Timeout moi request. Mac dinh: 12000",
    "  --self-test           Chay self-test validator.",
    "  --help                Hien huong dan.",
  ].join("\n");
}

function summarizeRows(rows) {
  const total = rows.length;
  const passed = rows.filter((row) => row.ok).length;
  const failed = total - passed;
  return {
    total,
    passed,
    failed,
    passRate: total === 0 ? 0 : Number((passed / total).toFixed(3)),
  };
}

async function fetchText(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
    });
    const bodyText = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      bodyText,
      contentType: String(response.headers.get("content-type") || ""),
      finalUrl: response.url,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      bodyText: "",
      contentType: "",
      finalUrl: "",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function assertContainsAny(text, candidates, label) {
  for (const candidate of candidates) {
    if (text.includes(candidate)) return;
  }
  throw new Error(`${label} khong tim thay bat ky marker bat buoc nao.`);
}

function validateLifeHtml(bodyText) {
  if (!bodyText.includes('data-domain="life"')) {
    throw new Error("Life root thieu data-domain=life.");
  }
  if (!bodyText.includes("Planned")) {
    throw new Error("Life root thieu marker Planned.");
  }
  if (bodyText.includes("Member Preview")) {
    throw new Error("Life root con marker Member Preview cu.");
  }
  if (!bodyText.includes("https://vetuonglai.com/?entry=life")) {
    throw new Error("Life root thieu gateway CTA ve hub.");
  }
  assertContainsAny(bodyText, [
    "không thay thế tư vấn y tế",
    "does not replace medical advice",
  ], "Life disclosure y te");
}

function validateInvestHtml(bodyText) {
  if (!bodyText.includes('data-domain="invest"')) {
    throw new Error("Invest root thieu data-domain=invest.");
  }
  if (!bodyText.includes("Planned")) {
    throw new Error("Invest root thieu marker Planned.");
  }
  if (bodyText.includes("Member Preview")) {
    throw new Error("Invest root con marker Member Preview cu.");
  }
  if (!bodyText.includes("https://vetuonglai.com/?entry=invest")) {
    throw new Error("Invest root thieu gateway CTA ve hub.");
  }
  assertContainsAny(bodyText, [
    "không hứa hẹn lợi nhuận",
    "does not promise returns",
  ], "Invest disclosure loi nhuan");
  assertContainsAny(bodyText, [
    "không đưa khuyến nghị mua bán",
    "does not issue buy-sell recommendations",
  ], "Invest disclosure buy-sell");
}

async function runDomainPack(domain, baseUrl, timeoutMs) {
  const checks = [
    { name: `${domain} root`, url: `${baseUrl}/`, acceptedStatuses: [200], validator: domain === "life" ? validateLifeHtml : validateInvestHtml },
    { name: `${domain} robots`, url: `${baseUrl}/robots.txt`, acceptedStatuses: [200] },
    { name: `${domain} sitemap`, url: `${baseUrl}/sitemap.xml`, acceptedStatuses: [200] },
  ];

  const rows = [];
  for (const check of checks) {
    const result = await fetchText(check.url, timeoutMs);
    let ok = check.acceptedStatuses.includes(result.status);
    let note = "";
    if (!ok) {
      note = result.error || `status ${result.status} khong nam trong tap cho phep ${check.acceptedStatuses.join(", ")}`;
    }
    if (ok && check.validator) {
      try {
        check.validator(result.bodyText);
      } catch (error) {
        ok = false;
        note = error instanceof Error ? error.message : String(error);
      }
    }
    rows.push({
      name: check.name,
      url: check.url,
      status: result.status,
      ok,
      note,
    });
  }
  return rows;
}

function runSelfTest() {
  validateLifeHtml(`
    <html data-domain="life">
      <body>
        Planned
        https://vetuonglai.com/?entry=life
        LIFE là lớp nhịp sống và quan sát nền. Nó không thay thế tư vấn y tế hay điều trị.
      </body>
    </html>
  `);
  validateInvestHtml(`
    <html data-domain="invest">
      <body>
        Planned
        https://vetuonglai.com/?entry=invest
        INVEST không đưa khuyến nghị mua bán và không hứa hẹn lợi nhuận.
      </body>
    </html>
  `);
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    console.log("Life/Invest strict pack self-test passed.");
    return;
  }

  console.log("Life/Invest strict verify brief");
  console.log(`- life_url: ${options.lifeUrl}`);
  console.log(`- invest_url: ${options.investUrl}`);
  console.log(`- verify_window: ${DEFAULT_VERIFY_WINDOW}`);
  console.log("");

  const lifeRows = await runDomainPack("life", options.lifeUrl, options.timeoutMs);
  const investRows = await runDomainPack("invest", options.investUrl, options.timeoutMs);
  const rows = [...lifeRows, ...investRows];

  console.log("Life/Invest strict rows");
  console.table(rows);

  const failed = rows.some((row) => !row.ok);
  const decision = {
    release_ready: !failed,
    summary: summarizeRows(rows),
    rows,
    handoff: {
      strict_targets: ["life.vetuonglai.com", "invest.vetuonglai.com"],
      required_markers: [
        "Planned status marker",
        "Gateway CTA ve hub",
        "Disclosure anti-overclaim cho life/invest",
      ],
    },
  };

  console.log("Life/Invest strict decision");
  console.log(JSON.stringify(decision, null, 2));

  if (failed) {
    throw new Error("Life/Invest strict verify pack failed.");
  }
  console.log("Life/Invest strict verify pack passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
