import {
  parseCliArgs,
  runCheckSuite,
  runSelfTest,
  smokeChecks,
  usageText,
} from "./founder-api-contract.mjs";

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usageText("node scripts/smoke-founder-panel-runtime.mjs", "Smoke check route ton tai, JSON parse duoc, va guardrail cot loi cho founder/autopilot APIs."));
    return;
  }

  if (options.selfTest) {
    runSelfTest();
    console.log("Founder/autopilot smoke self-test passed.");
    return;
  }

  const result = await runCheckSuite(smokeChecks, options);
  console.table(result.rows);

  if (result.failed) {
    throw new Error("Founder/autopilot smoke runtime failed.");
  }

  console.log("Founder/autopilot smoke runtime passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
