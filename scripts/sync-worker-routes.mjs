import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, cloudflareApi, parseArgs, resolveAccountId, resolveApiToken } from './cloudflare-utils.mjs';

async function loadWorkersConfig() {
  const raw = await readFile(path.join(ROOT, 'cloudflare', 'workers-projects.json'), 'utf8');
  return JSON.parse(raw);
}

async function resolveZone(accountId, token, zoneName) {
  const zones = await cloudflareApi(`/zones?name=${encodeURIComponent(zoneName)}`, { token });
  const zone = zones.find((item) => item?.account?.id === accountId);
  if (!zone) {
    throw new Error(`Khong tim thay zone ${zoneName} trong account ${accountId}.`);
  }
  return zone;
}

async function ensureRoute({ zoneId, token, pattern, script }) {
  const routes = await cloudflareApi(`/zones/${zoneId}/workers/routes`, { token });
  const exact = routes.find((item) => item.pattern === pattern);

  if (exact && exact.script === script) {
    console.log(`Route ok: ${pattern} -> ${script}`);
    return 'unchanged';
  }

  if (exact) {
    await cloudflareApi(`/zones/${zoneId}/workers/routes/${exact.id}`, {
      method: 'PUT',
      token,
      body: { pattern, script },
    });
    console.log(`Route updated: ${pattern} -> ${script}`);
    return 'updated';
  }

  await cloudflareApi(`/zones/${zoneId}/workers/routes`, {
    method: 'POST',
    token,
    body: { pattern, script },
  });
  console.log(`Route created: ${pattern} -> ${script}`);
  return 'created';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadWorkersConfig();
  const accountId = resolveAccountId(config);
  const token = await resolveApiToken();
  const zone = await resolveZone(accountId, token, 'vetuonglai.com');

  const selected = args.worker
    ? config.workers.filter((worker) => worker.key === args.worker || worker.scriptName === args.worker)
    : config.workers;

  if (selected.length === 0) {
    throw new Error('Khong tim thay worker nao khop voi --worker.');
  }

  console.log(`Zone selected: ${zone.name} (${zone.id}) status=${zone.status} account=${zone.account?.id}`);

  for (const worker of selected) {
    console.log(`\nSync routes for ${worker.scriptName}`);
    for (const pattern of worker.routes) {
      await ensureRoute({
        zoneId: zone.id,
        token,
        pattern,
        script: worker.scriptName,
      });
    }
  }

  console.log('\nWorker route sync complete.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
