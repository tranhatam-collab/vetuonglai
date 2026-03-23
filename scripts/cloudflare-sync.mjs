import { cloudflareApi, loadPagesConfig, resolveAccountId, resolveApiToken, runWrangler } from "./cloudflare-utils.mjs";

async function ensureProject(project, config, accountId) {
  const projectPath = `/accounts/${accountId}/pages/projects/${project.projectName}`;
  try {
    const existing = await cloudflareApi(projectPath, {
      accountId,
      token: await resolveApiToken(),
    });
    console.log(`Pages project ok: ${existing.name}`);
    return existing;
  } catch (error) {
    if (!(error instanceof Error) || !error.message.toLowerCase().includes("project not found")) {
      throw error;
    }
  }

  console.log(`Creating Pages project: ${project.projectName}`);
  runWrangler(
    [
      "pages",
      "project",
      "create",
      project.projectName,
      "--production-branch",
      config.productionBranch,
      "--compatibility-date",
      config.compatibilityDate,
    ],
    { CLOUDFLARE_ACCOUNT_ID: accountId },
  );

  return cloudflareApi(projectPath, {
    accountId,
    token: await resolveApiToken(),
  });
}

async function ensureDomains(project, accountId, token) {
  const currentDomains = await cloudflareApi(
    `/accounts/${accountId}/pages/projects/${project.projectName}/domains`,
    { accountId, token },
  );
  const active = new Set(currentDomains.map((item) => item.name));

  for (const domain of project.customDomains) {
    if (active.has(domain)) {
      console.log(`Domain ok: ${project.projectName} -> ${domain}`);
      continue;
    }

    console.log(`Attaching domain: ${project.projectName} -> ${domain}`);
    await cloudflareApi(
      `/accounts/${accountId}/pages/projects/${project.projectName}/domains`,
      {
        method: "POST",
        body: { name: domain },
        accountId,
        token,
      },
    );
  }
}

async function main() {
  const config = await loadPagesConfig();
  const accountId = resolveAccountId(config);
  const token = await resolveApiToken();

  for (const project of config.projects) {
    await ensureProject(project, config, accountId);
    await ensureDomains(project, accountId, token);
  }

  console.log("Cloudflare Pages projects and domains are in sync.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
