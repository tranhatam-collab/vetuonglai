import { execFileSync } from "node:child_process";
import { access, cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ROOT, parseArgs, resolveAccountId, runWrangler } from "./cloudflare-utils.mjs";

async function loadWorkersConfig() {
  const raw = await readFile(path.join(ROOT, "cloudflare", "workers-projects.json"), "utf8");
  return JSON.parse(raw);
}

function runCommand(bin, args, env = {}) {
  return execFileSync(bin, args, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    env: {
      ...process.env,
      ...env,
    },
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

function isDuplicateArtifactName(name = "") {
  return / 2(?:\.[^./]+)?$/.test(String(name || ""));
}

async function collectDuplicateArtifactPaths(rootDir, relativeDir = ".") {
  const absoluteDir = relativeDir === "." ? rootDir : path.join(rootDir, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const targets = [];

  for (const entry of entries) {
    const entryRelativePath = relativeDir === "."
      ? entry.name
      : path.join(relativeDir, entry.name);

    if (isDuplicateArtifactName(entry.name)) {
      targets.push(path.join(rootDir, entryRelativePath));
      continue;
    }

    if (entry.isDirectory()) {
      const nested = await collectDuplicateArtifactPaths(rootDir, entryRelativePath);
      targets.push(...nested);
    }
  }

  return targets;
}

async function prepareWorkerAssetsDir(worker) {
  const absoluteAssetsDir = path.join(ROOT, worker.assetsDir);
  const pagesWorkerPath = path.join(absoluteAssetsDir, "_worker.js");
  const pagesRedirectsPath = path.join(absoluteAssetsDir, "_redirects");
  const duplicateArtifactPaths = await collectDuplicateArtifactPaths(absoluteAssetsDir);

  const ignoredEntries = [];

  try {
    await access(pagesWorkerPath);
    ignoredEntries.push("_worker.js");
  } catch {}

  try {
    await access(pagesRedirectsPath);
    ignoredEntries.push("_redirects");
  } catch {}

  if (ignoredEntries.length === 0 && duplicateArtifactPaths.length === 0) {
    return {
      assetsDir: absoluteAssetsDir,
      cleanup: async () => {},
    };
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), `${worker.scriptName}-assets-`));
  await cp(absoluteAssetsDir, tempDir, { recursive: true });
  const tempDuplicateArtifactPaths = await collectDuplicateArtifactPaths(tempDir);
  await Promise.all(
    tempDuplicateArtifactPaths.map((entry) => rm(entry, { recursive: true, force: true })),
  );
  await writeFile(path.join(tempDir, ".assetsignore"), `${ignoredEntries.join("\n")}\n`, "utf8");
  await Promise.all(
    ignoredEntries.map((entry) => rm(path.join(tempDir, entry), { force: true })),
  );

  return {
    assetsDir: tempDir,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
}

function printAccessRuntimeContract(worker) {
  if (!worker.accessRuntime) return;

  console.log(`Access runtime contract for ${worker.scriptName}:`);
  console.log(`  required secrets: ${worker.accessRuntime.requiredSecrets.join(", ")}`);
  console.log(`  recommended vars: ${worker.accessRuntime.recommendedVars.join(", ")}`);
  console.log(`  optional bindings: ${worker.accessRuntime.optionalBindings.join(", ")}`);
}

function listWorkerSecrets(scriptName, accountId) {
  try {
    const raw = runCommand(
      "wrangler",
      ["secret", "list", "--name", scriptName, "--format", "json"],
      { CLOUDFLARE_ACCOUNT_ID: accountId },
    );
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => entry?.name)
      .filter((name) => typeof name === "string" && name.length > 0);
  } catch {
    return [];
  }
}

function printSecretReadiness(worker, accountId, { strict } = {}) {
  if (!worker.accessRuntime?.requiredSecrets?.length) return;

  const existing = listWorkerSecrets(worker.scriptName, accountId);
  const missing = worker.accessRuntime.requiredSecrets.filter((name) => !existing.includes(name));

  if (missing.length === 0) {
    console.log(`Access runtime secrets ready for ${worker.scriptName}.`);
    return;
  }

  console.warn(`Access runtime secrets missing for ${worker.scriptName}: ${missing.join(", ")}`);
  if (strict) {
    throw new Error(`Missing required secrets for ${worker.scriptName}. Add secrets before strict deployment.`);
  }
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
  const strictSecrets = Boolean(args["strict-secrets"]);
  const scriptOnly = Boolean(args["script-only"]);

  const commitHash = safeGit(() => runCommand("git", ["rev-parse", "HEAD"]));
  const commitMessage = safeGit(() => runCommand("git", ["log", "-1", "--pretty=%s"])) || "Deploy workers";

  for (const worker of selected) {
    await ensurePath(worker.entry);
    await ensurePath(worker.assetsDir);
    printAccessRuntimeContract(worker);
    printSecretReadiness(worker, accountId, { strict: strictSecrets });
    const preparedAssets = await prepareWorkerAssetsDir(worker);

    const wranglerArgs = [
      "deploy",
      worker.entry,
      "--name",
      worker.scriptName,
      "--assets",
      preparedAssets.assetsDir,
      "--compatibility-date",
      config.compatibilityDate,
      "--keep-vars=true",
      "--message",
      commitMessage,
      ...(commitHash ? ["--tag", commitHash.slice(0, 12)] : []),
    ];

    const requiredBindings = worker.accessRuntime?.requiredBindings || [];
    let tempConfigPath = null;
    if (requiredBindings.includes("ACCESS_KV_NAMESPACE")) {
      const kvId = process.env.ACCESS_KV_NAMESPACE_ID;
      if (!kvId) {
        throw new Error(
          `Worker ${worker.scriptName} requires ACCESS_KV_NAMESPACE binding. `
          + `Set env ACCESS_KV_NAMESPACE_ID=<kv-namespace-id> before deploy.`,
        );
      }
      const tempConfigDir = await mkdtemp(path.join(os.tmpdir(), `${worker.scriptName}-config-`));
      tempConfigPath = path.join(tempConfigDir, "wrangler.jsonc");
      await writeFile(tempConfigPath, JSON.stringify({
        name: worker.scriptName,
        main: worker.entry,
        compatibility_date: config.compatibilityDate,
        kv_namespaces: [
          { binding: "ACCESS_KV_NAMESPACE", id: kvId },
        ],
      }, null, 2), "utf8");
      wranglerArgs.push("--config", tempConfigPath);
    }

    if (!scriptOnly) {
      for (const route of worker.routes) {
        wranglerArgs.push("--routes", route);
      }
    }

    console.log(`Deploying worker ${worker.scriptName} with assets ${worker.assetsDir}`);
    console.log(`  mode: ${scriptOnly ? "script_only" : "full_routes"}`);
    try {
      runWrangler(wranglerArgs, {
        CLOUDFLARE_ACCOUNT_ID: accountId,
        ...(process.env.CLOUDFLARE_API_TOKEN ? { CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN } : {}),
      });
    } finally {
      await preparedAssets.cleanup();
      if (tempConfigPath) {
        await rm(path.dirname(tempConfigPath), { recursive: true, force: true });
      }
    }
  }

  console.log("Workers deployment complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
