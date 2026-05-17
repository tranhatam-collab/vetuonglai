import { maybeHandleVcOwnershipRuntime } from "./lib/vc-ownership-runtime.mjs";
import { maybeHandleVcRuntime } from "./lib/vc-runtime.mjs";
import { maybeHandleWalletRuntime } from "./lib/wallet-runtime.mjs";
import { maybeHandleCommunityRuntime } from "./lib/community-runtime.mjs";
import { maybeHandleJobsRuntime } from "./lib/jobs-runtime.mjs";
import { maybeHandleAffiliateRuntime } from "./lib/affiliate-runtime.mjs";
import { maybeHandleAnalyticsRuntime } from "./lib/analytics-runtime.mjs";
import { maybeHandleNotifyRuntime } from "./lib/notify-runtime.mjs";
import { maybeHandleAdminCmsRuntime } from "./lib/admin-cms-runtime.mjs";
import { maybeHandleEduRuntime } from "./lib/edu-runtime.mjs";

function missingAssetsResponse(request) {
  return new Response(
    JSON.stringify({
      status: "assets_binding_missing",
      detail: "ASSETS binding is not configured for this worker.",
      path: new URL(request.url).pathname,
    }, null, 2),
    {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
}

const ORIGIN_ALLOWLIST = /^https:\/\/([a-z0-9-]+\.)?vetuonglai\.com$/;
const DEFAULT_ORIGIN = "https://vetuonglai.com";

function corsHeadersFor(request) {
  const origin = request.headers.get("origin") || "";
  const allowed = ORIGIN_ALLOWLIST.test(origin) ? origin : DEFAULT_ORIGIN;
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization, x-wallet-internal-token, x-internal-token, idempotency-key",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
}

function addCorsHeaders(response, request) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeadersFor(request))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeadersFor(request) });
    }

    const walletResponse = await maybeHandleWalletRuntime(request, env);
    if (walletResponse) return addCorsHeaders(walletResponse, request);

    const eduResponse = await maybeHandleEduRuntime(request, env);
    if (eduResponse) return addCorsHeaders(eduResponse, request);

    const communityResponse = await maybeHandleCommunityRuntime(request, env);
    if (communityResponse) return addCorsHeaders(communityResponse, request);

    const jobsResponse = await maybeHandleJobsRuntime(request, env);
    if (jobsResponse) return addCorsHeaders(jobsResponse, request);

    const affiliateResponse = await maybeHandleAffiliateRuntime(request, env);
    if (affiliateResponse) return addCorsHeaders(affiliateResponse, request);

    const analyticsResponse = await maybeHandleAnalyticsRuntime(request, env);
    if (analyticsResponse) return addCorsHeaders(analyticsResponse, request);

    const notifyResponse = await maybeHandleNotifyRuntime(request, env);
    if (notifyResponse) return addCorsHeaders(notifyResponse, request);

    const adminCmsResponse = await maybeHandleAdminCmsRuntime(request, env);
    if (adminCmsResponse) return addCorsHeaders(adminCmsResponse, request);

    const vcApiResponse = await maybeHandleVcRuntime(request, env);
    if (vcApiResponse) {
      return addCorsHeaders(vcApiResponse, request);
    }

    const vcOwnershipResponse = await maybeHandleVcOwnershipRuntime(request, env);
    if (vcOwnershipResponse) {
      return addCorsHeaders(vcOwnershipResponse, request);
    }

    const url = new URL(request.url);

    if (url.pathname === "/v" || url.pathname === "/v/" || url.pathname.startsWith("/v/")) {
      const segments = url.pathname.split("/").filter(Boolean);
      const code = segments[0] === "v" && segments.length > 1 ? decodeURIComponent(segments.slice(1).join("/")) : "";
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/v/";
      if (code && !assetUrl.searchParams.has("code")) {
        assetUrl.searchParams.set("code", code);
      }
      if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
        return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      }
      return missingAssetsResponse(request);
    }

    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return missingAssetsResponse(request);
  },
};
