import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");

export async function loadPagesConfig() {
  const raw = await readFile(path.join(ROOT, "cloudflare", "pages-projects.json"), "utf8");
  return JSON.parse(raw);
}

export function resolveAccountId(config) {
  return process.env.CLOUDFLARE_ACCOUNT_ID || config.accountId;
}

export async function resolveApiToken() {
  const wranglerConfig = path.join(os.homedir(), ".wrangler", "config", "default.toml");
  try {
    const raw = await readFile(wranglerConfig, "utf8");
    const match = raw.match(/^oauth_token = "(.*)"$/m);
    if (match?.[1]) {
      return match[1];
    }
  } catch {}

  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN;
  }

  throw new Error("Khong tim thay oauth_token tu Wrangler va cung khong co CLOUDFLARE_API_TOKEN.");
}

export async function cloudflareApi(pathname, { method = "GET", body, accountId, token } = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    const message = Array.isArray(payload.errors) && payload.errors.length > 0
      ? payload.errors.map((item) => item.message).join("; ")
      : `Cloudflare API loi o ${pathname}`;
    throw new Error(message);
  }

  return payload.result;
}

export function runWrangler(args, extraEnv = {}) {
  execFileSync("wrangler", args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

export function resolveProjectDist(rootDir) {
  return path.join(ROOT, rootDir);
}

export function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}
