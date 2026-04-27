import { cloudflareApi, resolveApiToken } from "./cloudflare-utils.mjs";

async function main() {
  const token = await resolveApiToken();
  const zones = await cloudflareApi("/zones?name=vetuonglai.com", { token });
  const zone = Array.isArray(zones) ? zones[0] : null;

  if (!zone?.id) {
    throw new Error("Khong tim thay zone vetuonglai.com tren Cloudflare.");
  }

  const zoneId = zone.id;
  const dnsRecords = await cloudflareApi(`/zones/${zoneId}/dns_records?name=member.vetuonglai.com`, { token });

  const workerRoutes = await cloudflareApi(`/zones/${zoneId}/workers/routes`, { token });
  const memberRoutes = Array.isArray(workerRoutes)
    ? workerRoutes.filter((route) => String(route.pattern || "").includes("member.vetuonglai.com"))
    : [];

  const pagesProjects = await cloudflareApi(`/accounts/${zone.account.id}/pages/projects`, {
    token,
  });
  const memberPagesProject = Array.isArray(pagesProjects)
    ? pagesProjects.find((project) => String(project.name || "").includes("member"))
    : null;

  console.log(JSON.stringify({
    zone: {
      id: zoneId,
      name: zone.name,
      accountId: zone.account?.id || "",
    },
    dnsRecords,
    workerRoutes: memberRoutes,
    memberPagesProject: memberPagesProject
      ? {
          id: memberPagesProject.id,
          name: memberPagesProject.name,
          subdomain: memberPagesProject.subdomain || "",
          domains: memberPagesProject.domains || [],
        }
      : null,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
