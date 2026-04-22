import { access } from 'node:fs/promises';
import { loadPagesConfig, parseArgs, resolveAccountId, resolveProjectDist, runWrangler } from './cloudflare-utils.mjs';

const WAVE_D_KEYS = ['work', 'market', 'community', 'ai', 'business'];

async function ensureBuilt(distDir) {
  await access(distDir);
}

function usageText() {
  return [
    'node scripts/deploy-wave-d-pages.mjs',
    '',
    'Deploy Pages cho cum Wave D: work, market, community, ai, business.',
    '',
    'Tuy chon:',
    '  --branch <name>   Branch deploy len Cloudflare Pages. Mac dinh: branch production trong pages-projects.json',
    '  --dry-run         Chi in ke hoach deploy, khong goi wrangler.',
    '  --help            Hien huong dan.',
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usageText());
    return;
  }

  const config = await loadPagesConfig();
  const accountId = resolveAccountId(config);
  const branch = args.branch || config.productionBranch;
  const dryRun = Boolean(args['dry-run']);
  const selected = config.projects.filter((project) => WAVE_D_KEYS.includes(project.key));

  if (selected.length !== WAVE_D_KEYS.length) {
    const found = new Set(selected.map((project) => project.key));
    const missing = WAVE_D_KEYS.filter((key) => !found.has(key));
    throw new Error(`Thieu Pages project config cho Wave D: ${missing.join(', ')}`);
  }

  console.log('Wave D Pages deploy plan');
  console.log(`- branch: ${branch}`);
  console.log(`- dry_run: ${dryRun}`);
  console.log(`- projects: ${selected.map((project) => `${project.key}:${project.projectName}`).join(', ')}`);

  for (const project of selected) {
    const distDir = resolveProjectDist(project.distDir);
    await ensureBuilt(distDir);

    const wranglerArgs = [
      'pages',
      'deploy',
      distDir,
      '--project-name',
      project.projectName,
      '--branch',
      branch,
    ];

    console.log(`\n[wave-d] ${project.key}`);
    console.log(`  project_name: ${project.projectName}`);
    console.log(`  dist_dir: ${project.distDir}`);
    console.log(`  custom_domains: ${(project.customDomains || []).join(', ')}`);
    if (project.notes) {
      console.log(`  notes: ${project.notes}`);
    }
    console.log(`  command: wrangler ${wranglerArgs.join(' ')}`);

    if (!dryRun) {
      runWrangler(wranglerArgs, {
        CLOUDFLARE_ACCOUNT_ID: accountId,
        ...(process.env.CLOUDFLARE_API_TOKEN ? { CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN } : {}),
      });
    }
  }

  console.log('\nWave D Pages deployment plan complete.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
