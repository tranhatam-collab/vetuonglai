import {
  loadRuntimeTruthByHost,
  parseModeArgs,
  readDistText,
  requestUrl,
  requireIncludes,
  runCommandSuite,
  summarizeRows,
  usageText,
} from "./verify-wave-pack-utils.mjs";

const LOCAL_STEPS = [
  {
    key: "build",
    label: "Build static system",
    cmd: "npm",
    args: ["run", "build"],
    timeoutMs: 12 * 60 * 1000,
  },
  {
    key: "check",
    label: "Validate dist outputs",
    cmd: "npm",
    args: ["run", "check"],
    timeoutMs: 3 * 60 * 1000,
  },
];

const TEASER_FRAGMENTS = [
  'id="public-value"',
  'id="demo"',
  'id="gateway-cta"',
  'data-disclosure-kind="public-note"',
  "Mở toàn bộ hệ của bạn",
  "Open your full system",
];

async function evaluateLocalHardening() {
  const lifeHtml = await readDistText("life.vetuonglai.com", "index.html");
  const investHtml = await readDistText("invest.vetuonglai.com", "index.html");
  const rows = [];

  try {
    requireIncludes("LIFE home", lifeHtml, TEASER_FRAGMENTS);
    requireIncludes("LIFE home", lifeHtml, [
      "NHỊP SỐNG",
      "Ổn định cuộc sống trước khi tối ưu cuộc đời.",
      "RHYTHM",
      "Stabilize life before trying to optimize it.",
      "Planned",
    ]);
    rows.push({ name: "LIFE local hardening", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "LIFE local hardening",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    requireIncludes("INVEST home", investHtml, TEASER_FRAGMENTS);
    requireIncludes("INVEST home", investHtml, [
      "ĐẦU TƯ",
      "Đầu tư bắt đầu từ hiểu rủi ro.",
      "INVESTING",
      "Investing starts with understanding risk.",
      "Planned",
    ]);
    rows.push({ name: "INVEST local hardening", ok: true, skipped: false, detail: "" });
  } catch (error) {
    rows.push({
      name: "INVEST local hardening",
      ok: false,
      skipped: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return rows;
}

function validateRuntimeTruthState(domain) {
  if (!domain || typeof domain !== "object") {
    throw new Error("Missing runtime truth entry.");
  }

  if (domain.status === "planned_public" && domain.requiredPublic === false) {
    return;
  }

  if (domain.status === "live" && domain.requiredPublic === true) {
    return;
  }

  throw new Error(`Unexpected runtime truth state: status=${domain.status}, requiredPublic=${domain.requiredPublic}`);
}

function buildLiveChecks(runtimeTruth) {
  const life = runtimeTruth.get("life.vetuonglai.com");
  const invest = runtimeTruth.get("invest.vetuonglai.com");

  return [
    {
      key: "life",
      name: "LIFE public surface",
      url: "https://life.vetuonglai.com",
      required: Boolean(life?.requiredPublic),
      assertResult(result) {
        requireIncludes("LIFE live surface", result.bodyText, [
          "NHỊP SỐNG",
          "data-disclosure-kind=\"public-note\"",
          "Mở toàn bộ hệ của bạn",
        ]);
      },
    },
    {
      key: "invest",
      name: "INVEST public surface",
      url: "https://invest.vetuonglai.com",
      required: Boolean(invest?.requiredPublic),
      assertResult(result) {
        requireIncludes("INVEST live surface", result.bodyText, [
          "ĐẦU TƯ",
          "data-disclosure-kind=\"public-note\"",
          "Mở toàn bộ hệ của bạn",
        ]);
      },
    },
  ];
}

async function evaluateRuntimeTruthAndLive(options) {
  const runtimeTruth = await loadRuntimeTruthByHost();
  const life = runtimeTruth.get("life.vetuonglai.com");
  const invest = runtimeTruth.get("invest.vetuonglai.com");
  const rows = [];

  for (const [label, domain] of [
    ["LIFE runtime truth", life],
    ["INVEST runtime truth", invest],
  ]) {
    try {
      validateRuntimeTruthState(domain);
      rows.push({
        name: label,
        url: domain?.url || "",
        required: Boolean(domain?.requiredPublic),
        skipped: false,
        ok: true,
        status: 0,
        detail: `${domain.status} / requiredPublic=${domain.requiredPublic}`,
      });
    } catch (error) {
      rows.push({
        name: label,
        url: domain?.url || "",
        required: Boolean(domain?.requiredPublic),
        skipped: false,
        ok: false,
        status: 0,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (options.localOnly) {
    return {
      rows,
      runtimeTruth: { life, invest },
    };
  }

  for (const check of buildLiveChecks(runtimeTruth)) {
    if (!check.required) {
      rows.push({
        name: check.name,
        url: check.url,
        required: false,
        skipped: true,
        ok: true,
        status: 0,
        detail: "Skipped because runtime truth still marks this domain as planned-safe.",
      });
      continue;
    }

    const result = await requestUrl(check.url);
    let ok = result.ok;
    let detail = result.error || "";

    if (ok) {
      try {
        check.assertResult(result);
      } catch (error) {
        ok = false;
        detail = error instanceof Error ? error.message : String(error);
      }
    }

    rows.push({
      name: check.name,
      url: check.url,
      required: true,
      skipped: false,
      ok,
      status: result.status,
      detail,
    });
  }

  return {
    rows,
    runtimeTruth: { life, invest },
  };
}

function buildDecision({ options, commandSuite, localRows, runtimeRows }) {
  const commandSummary = summarizeRows(commandSuite?.rows || []);
  const localSummary = summarizeRows(localRows);
  const runtimeSummary = summarizeRows(runtimeRows);
  const commandOk = commandSummary.failed === 0;
  const localOk = localSummary.failed === 0;
  const runtimeOk = runtimeSummary.failed === 0;
  const publicLiveRequired = runtimeRows.some((row) => row.required && !row.skipped);

  return {
    wave: "C",
    lane: "life_invest_hardening",
    mode: options.localOnly ? "local_only" : "full",
    hardening_ready: commandOk && localOk && runtimeOk,
    release_ready: publicLiveRequired && commandOk && localOk && runtimeOk,
    planned_safe_hold: !publicLiveRequired,
    command_suite: commandSummary,
    local_contract: localSummary,
    runtime_and_live: runtimeSummary,
  };
}

async function main() {
  const options = parseModeArgs(process.argv.slice(2));

  if (options.help) {
    console.log(
      usageText(
        "node scripts/verify-wave-c-life-invest-hardening.mjs",
        "Verify pack cho Wave C life/invest hardening. Script nay ton trong runtime truth: planned-safe khong bi coi la live, nhung van phai pass hardening local.",
      ),
    );
    return;
  }

  const commandSuite = options.skipCommandSteps
    ? { rows: [], failed: false }
    : await runCommandSuite(LOCAL_STEPS);

  if (commandSuite.rows.length) {
    console.log("Wave C command suite");
    console.table(commandSuite.rows.map((row) => ({
      key: row.key,
      label: row.label,
      ok: row.ok,
      code: row.code,
      timedOut: row.timedOut,
      error: row.error,
    })));
  }

  if (commandSuite.failed) {
    throw new Error("Wave C hardening failed inside command suite.");
  }

  const localRows = await evaluateLocalHardening();
  console.log("Wave C local hardening rows");
  console.table(localRows);

  if (localRows.some((row) => !row.ok)) {
    throw new Error("Wave C hardening failed at local contract stage.");
  }

  const runtimeEvaluation = await evaluateRuntimeTruthAndLive(options);
  console.log("Wave C runtime/live rows");
  console.table(runtimeEvaluation.rows);

  if (runtimeEvaluation.rows.some((row) => !row.ok && !row.skipped)) {
    throw new Error("Wave C hardening failed at runtime truth or live stage.");
  }

  const decision = buildDecision({
    options,
    commandSuite,
    localRows,
    runtimeRows: runtimeEvaluation.rows,
  });

  console.log("Wave C life/invest hardening decision");
  console.log(JSON.stringify(decision, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
