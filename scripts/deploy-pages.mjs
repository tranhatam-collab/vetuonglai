import { execFileSync } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { loadPagesConfig, parseArgs, resolveAccountId, resolveProjectDist, runWrangler } from "./cloudflare-utils.mjs";

function runCommand(bin, args) {
  return execFileSync(bin, args, {
    cwd: path.resolve(path.dirname(new URL(import.meta.url).pathname), ".."),
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

async function ensureBuilt(distDir) {
  await access(distDir);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadPagesConfig();
  const accountId = resolveAccountId(config);
  const branch = args.branch || config.productionBranch;
  const selected = args.project
    ? config.projects.filter((project) => project.key === args.project || project.projectName === args.project)
    : config.projects;

  if (selected.length === 0) {
    throw new Error("Khong tim thay project nao khop voi --project.");
  }

  const commitHash = safeGit(() => runCommand("git", ["rev-parse", "HEAD"]));
  const commitMessage = safeGit(() => runCommand("git", ["log", "-1", "--pretty=%s"])) || `Deploy ${branch}`;

  for (const project of selected) {
    const distDir = resolveProjectDist(project.distDir);
    await ensureBuilt(distDir);

    console.log(`Deploying ${project.projectName} from ${project.distDir} -> branch ${branch}`);
    const wranglerArgs = [
      "pages",
      "deploy",
      distDir,
      "--project-name",
      project.projectName,
      "--branch",
      branch,
      "--commit-message",
      commitMessage,
    ];

    if (commitHash) {
      wranglerArgs.push("--commit-hash", commitHash);
    }

    runWrangler(wranglerArgs, {
      CLOUDFLARE_ACCOUNT_ID: accountId,
      ...(process.env.CLOUDFLARE_API_TOKEN ? { CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN } : {}),
    });
  }

  console.log("Cloudflare Pages deployment complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
