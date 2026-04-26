import { maybeHandleAccessRuntime } from "./lib/access-runtime.mjs";
import { maybeHandleFounderRuntime } from "./lib/founder-runtime.mjs";
import businessDomainContract from "../src/data/business-domain-contract.json" with { type: "json" };
import packageComparisonDemoOutput from "../src/data/package-comparison-demo-output.json" with { type: "json" };
import packageFormRegistry from "../src/data/package-form-registry.json" with { type: "json" };
import kidsCurriculum from "../src/data/kids-curriculum.json" with { type: "json" };

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
]);

const KIDS_SAFETY_HEADERS = {
  "x-robots-tag": "noindex, nofollow, noarchive",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-child-safe-zone": "kids.vetuonglai.com",
};

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
  if (!payload) {
    return null;
  }

  return jsonResponse(payload, {
    headers: {
      "cache-control": "public, max-age=60",
      ...KIDS_SAFETY_HEADERS,
    },
  });
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
