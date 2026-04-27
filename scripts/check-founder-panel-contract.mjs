import {
  parseCliArgs,
  runCheckSuite,
  runSelfTest,
  strictChecks,
  usageText,
} from "./founder-api-contract.mjs";

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText("node scripts/check-founder-panel-contract.mjs", "Strict check cho founder/autopilot APIs: route dung method, JSON shape cot loi, va guardrail khong cho action nguy hiem vuot qua.")); 
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    console.log("Founder/autopilot strict self-test passed.");
    return;
  }

  const result = await runCheckSuite(strictChecks, options);
  console.table(result.rows);

  if (result.failed) {
    throw new Error("Founder/autopilot strict contract check failed.");
  }

  console.log("Founder/autopilot strict contract check passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
