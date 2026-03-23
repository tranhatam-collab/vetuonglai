import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, parseArgs, resolveAccountId, runWrangler } from "./cloudflare-utils.mjs";

async function loadWorkersConfig() {
  const raw = await readFile(path.join(ROOT, "cloudflare", "workers-projects.json"), "utf8");
  return JSON.parse(raw);
}

function runCommand(bin, args) {
  return execFileSync(bin, args, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  }).trim();
}

function safeGit(command) {
  try {
    return command();
  } catch {
    return "";
  }
}

async function ensurePath(targetPath) {
  await access(path.join(ROOT, targetPath));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadWorkersConfig();
  const accountId = resolveAccountId(config);
  const selected = args.worker
    ? config.workers.filter((worker) => worker.key === args.worker || worker.scriptName === args.worker)
    : config.workers;

  if (selected.length === 0) {
    throw new Error("Khong tim thay worker nao khop voi --worker.");
  }

  const commitHash = safeGit(() => runCommand("git", ["rev-parse", "HEAD"]));
  const commitMessage = safeGit(() => runCommand("git", ["log", "-1", "--pretty=%s"])) || "Deploy workers";

  for (const worker of selected) {
    await ensurePath(worker.entry);
    await ensurePath(worker.assetsDir);

    const wranglerArgs = [
      "deploy",
      worker.entry,
      "--name",
      worker.scriptName,
      "--assets",
      path.join(ROOT, worker.assetsDir),
      "--compatibility-date",
      config.compatibilityDate,
      "--keep-vars=true",
      "--message",
      commitMessage,
      ...(commitHash ? ["--tag", commitHash.slice(0, 12)] : []),
    ];

    for (const route of worker.routes) {
      wranglerArgs.push("--routes", route);
    }

    console.log(`Deploying worker ${worker.scriptName} with assets ${worker.assetsDir}`);
    runWrangler(wranglerArgs, { CLOUDFLARE_ACCOUNT_ID: accountId });
  }

  console.log("Workers deployment complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
