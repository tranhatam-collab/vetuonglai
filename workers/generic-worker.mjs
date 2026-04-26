import { maybeHandleAccessRuntime } from "./lib/access-runtime.mjs";
import { maybeHandleFounderRuntime } from "./lib/founder-runtime.mjs";
import businessDomainContract from "../src/data/business-domain-contract.json" with { type: "json" };
import packageComparisonDemoOutput from "../src/data/package-comparison-demo-output.json" with { type: "json" };
import packageFormRegistry from "../src/data/package-form-registry.json" with { type: "json" };
import kidsCurriculum from "../src/data/kids-curriculum.json" with { type: "json" };
import kidsApiContract from "../src/data/kids-api-contract.json" with { type: "json" };

const TEAM4_ALLOWED_HOSTS = new Set([
  "vetuonglai.com",
  "www.vetuonglai.com",
  "member.vetuonglai.com",
  "www.member.vetuonglai.com",
]);

const TEAM4_ENDPOINT_PAYLOADS = new Map([
  ["/api/team4/package-form-registry.json", packageFormRegistry],
  ["/api/team4/business-domain-contract.json", businessDomainContract],
  ["/api/team4/package-comparison-demo-output.json", packageComparisonDemoOutput],
]);

const KIDS_ALLOWED_HOSTS = new Set([
  "kids.vetuonglai.com",
  "www.kids.vetuonglai.com",
]);

const KIDS_ENDPOINT_PAYLOADS = new Map([
  ["/api/kids/curriculum.json", kidsCurriculum],
  ["/api/kids/contract.json", kidsApiContract],
]);

const KIDS_SAFETY_HEADERS = {
  "x-robots-tag": "noindex, nofollow, noarchive",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-child-safe-zone": "kids.vetuonglai.com",
};

function buildKidsRoutePatterns(contract) {
  const patterns = [];
  for (const endpoint of contract?.endpoints || []) {
    if (!endpoint?.path || !endpoint?.method) continue;
    const segments = String(endpoint.path).split("/").filter(Boolean);
    const params = [];
    const regexParts = segments.map((segment) => {
      if (segment.startsWith(":")) {
        params.push(segment.slice(1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    const regex = new RegExp("^/" + regexParts.join("/") + "/?$");
    patterns.push({ endpoint, regex, params });
  }
  return patterns;
}

const KIDS_API_ROUTES = buildKidsRoutePatterns(kidsApiContract);

function maybeHandleKidsApiStub(request, url) {
  if (!url.pathname.startsWith("/api/kids/")) return null;

  for (const route of KIDS_API_ROUTES) {
    const match = url.pathname.match(route.regex);
    if (!match) continue;
    if (request.method.toUpperCase() !== String(route.endpoint.method).toUpperCase()) continue;

    const params = {};
    route.params.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    const body = {
      error: {
        code: "NOT_IMPLEMENTED",
        stage: "stub",
        message: "kids API is in Member Preview. Backend implementation is gated by child-safety review.",
        contractVersion: kidsApiContract.version,
        endpoint: {
          id: route.endpoint.id,
          method: route.endpoint.method,
          path: route.endpoint.path,
          summary: route.endpoint.summary,
          request: route.endpoint.request,
          response: route.endpoint.response,
          childSafety: route.endpoint.childSafety || [],
        },
        params,
      },
    };

    return jsonResponse(body, {
      status: 501,
      headers: {
        "cache-control": "no-store",
        ...KIDS_SAFETY_HEADERS,
      },
    });
  }

  return null;
}

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers,
  });
}

function maybeHandleTeam4Contracts(request) {
  const url = new URL(request.url);
  if (!TEAM4_ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }

  const payload = TEAM4_ENDPOINT_PAYLOADS.get(url.pathname);
  if (!payload) {
    return null;
  }

  return jsonResponse(payload, {
    headers: {
      "cache-control": "public, max-age=60",
    },
  });
}

function maybeHandleKidsRuntime(request) {
  const url = new URL(request.url);
  if (!KIDS_ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }

  const payload = KIDS_ENDPOINT_PAYLOADS.get(url.pathname);
  if (payload) {
    return jsonResponse(payload, {
      headers: {
        "cache-control": "public, max-age=60",
        ...KIDS_SAFETY_HEADERS,
      },
    });
  }

  const stub = maybeHandleKidsApiStub(request, url);
  if (stub) return stub;

  return null;
}

export default {
  async fetch(request, env) {
    const kidsResponse = maybeHandleKidsRuntime(request);
    if (kidsResponse) {
      return kidsResponse;
    }

    const team4Response = maybeHandleTeam4Contracts(request);
    if (team4Response) {
      return team4Response;
    }

    const founderResponse = await maybeHandleFounderRuntime(request, env);
    if (founderResponse) {
      return founderResponse;
    }

    const accessResponse = await maybeHandleAccessRuntime(request, env);
    if (accessResponse) {
      return accessResponse;
    }

    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }

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
  },
};
