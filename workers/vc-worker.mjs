import { maybeHandleVcOwnershipRuntime } from "./lib/vc-ownership-runtime.mjs";

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

const CORS_HEADERS = {
  "access-control-allow-origin": "https://member.vetuonglai.com",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-max-age": "86400",
};

function addCorsHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
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
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const vcApiResponse = await maybeHandleVcOwnershipRuntime(request, env);
    if (vcApiResponse) {
      return addCorsHeaders(vcApiResponse);
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
