import {
  DEFAULT_RELEASE_WINDOW,
  compactRows,
  founderReleaseEvidenceMinimum,
  founderReleaseSteps,
  founderRuntimeRequirements,
  parseCliArgs,
  runCheckSuite,
  runSelfTest,
  smokeChecks,
  strictChecks,
  summarizeRows,
  usageText,
} from "./founder-api-contract.mjs";

function hasRuntimeAuth(options) {
  return Boolean(options.authHeader && options.authValue);
}

function printReleaseBrief(options) {
  console.log("Founder lane release brief");
  console.log(`- base_url: ${options.baseUrl}`);
  console.log(`- auth_ready: ${hasRuntimeAuth(options) ? "yes" : "no"}`);
  console.log(`- verify_window: ${DEFAULT_RELEASE_WINDOW}`);
  console.log("");
}

function printChecklist(title, items) {
  console.log(title);
  for (const [index, item] of items.entries()) {
    console.log(`${index + 1}. ${item}`);
  }
  console.log("");
}

function printStepBoard() {
  console.log("Founder lane verify sequence");
  for (const [index, step] of founderReleaseSteps.entries()) {
    console.log(`${index + 1}. ${step.label}`);
    console.log(`   command: ${step.command}`);
  }
  console.log("");
}

function buildDecision({ smokeResult, strictResult, options }) {
  const smokeSummary = summarizeRows(smokeResult.rows);
  const strictSummary = strictResult ? summarizeRows(strictResult.rows) : null;
  const releaseReady = !smokeResult.failed && hasRuntimeAuth(options) && Boolean(strictResult) && !strictResult.failed;

  return {
    release_ready: releaseReady,
    smoke: {
      ...smokeSummary,
      rows: compactRows(smokeResult.rows),
    },
    strict: strictResult
      ? {
          ...strictSummary,
          rows: compactRows(strictResult.rows),
        }
      : {
          total: 0,
          passed: 0,
          failed: 0,
          skipped: true,
          reason: "Thiếu auth header/auth value nên strict chưa thể chạy.",
        },
    handoff: {
      runtime_requirements: founderRuntimeRequirements,
      release_evidence_minimum: founderReleaseEvidenceMinimum,
      verify_steps: founderReleaseSteps,
    },
  };
}

function isTransportOnlyFailure(rows) {
  return Array.isArray(rows)
    && rows.length > 0
    && rows.every((row) => row.status === 0 && /fetch failed|curl fallback failed/.test(String(row.note || "")));
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(
      usageText(
        "node scripts/verify-founder-lane-release.mjs",
        "Release verification wrapper cho founder lane: chay smoke, chay strict neu co auth, va in bo evidence toi thieu Team 1 can nop khi runtime that san sang.",
      ),
    );
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    printStepBoard();
    printChecklist("Founder runtime requirements", founderRuntimeRequirements);
    printChecklist("Founder release evidence minimum", founderReleaseEvidenceMinimum);
    console.log("Founder lane release self-test passed.");
    return;
  }

  printReleaseBrief(options);
  printStepBoard();
  printChecklist("Founder runtime requirements", founderRuntimeRequirements);
  printChecklist("Founder release evidence minimum", founderReleaseEvidenceMinimum);

  let smokeResult = await runCheckSuite(smokeChecks, options);
  if (isTransportOnlyFailure(smokeResult.rows)) {
    console.log("Founder smoke transport outage detected; retrying once.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    smokeResult = await runCheckSuite(smokeChecks, options);
  }
  console.log("Founder smoke rows");
  console.table(smokeResult.rows);

  let strictResult = null;
  if (hasRuntimeAuth(options)) {
    strictResult = await runCheckSuite(strictChecks, options);
    console.log("Founder strict rows");
    console.table(strictResult.rows);
  } else {
    console.log("Strict check skipped: thiếu auth header/auth value.");
  }

  const decision = buildDecision({ smokeResult, strictResult, options });
  console.log("Founder release decision");
  console.log(JSON.stringify(decision, null, 2));

  if (smokeResult.failed) {
    throw new Error("Founder lane release verify failed at smoke stage.");
  }

  if (strictResult && strictResult.failed) {
    throw new Error("Founder lane release verify failed at strict stage.");
  }

  console.log("Founder lane release verify passed for the stages that were runnable.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
