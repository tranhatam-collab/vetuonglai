import {
  jsonResponse, currentUnixSeconds, platformStore, requireSession,
  readRequestJson, makeId, listKvByPrefix, slugify, isInternalCallAuthorized,
} from "./runtime-helpers.mjs";

const BASE = "/api/jobs";
const LISTING_TTL = 365 * 24 * 60 * 60;
const APPLICATION_TTL = 365 * 24 * 60 * 60;
const TITLE_MAX = 140;
const DESCRIPTION_MAX = 8000;
const APPLICATION_NOTE_MAX = 4000;
const VALID_TYPES = new Set(["full_time", "part_time", "freelance", "internship", "volunteer"]);
const VALID_STATUSES = new Set(["draft", "open", "in_progress", "completed", "cancelled"]);
const VALID_APPLICATION_STATUS = new Set(["submitted", "shortlisted", "rejected", "hired"]);

function publicEmployer(email) {
  if (!email) return "anonymous";
  const [local, domain] = String(email).split("@");
  if (local && local.length > 2) return `${local.slice(0, 2)}***@${domain || ""}`;
  return `***@${domain || ""}`;
}

async function handleCreateListing(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const title = String(input.title || "").trim().slice(0, TITLE_MAX);
  const description = String(input.description || "").trim().slice(0, DESCRIPTION_MAX);
  const jobType = String(input.job_type || "freelance").toLowerCase();
  const budgetVnd = Math.max(0, Math.floor(Number(input.budget_vnd) || 0));
  const skills = Array.isArray(input.skills) ? input.skills.slice(0, 12).map((s) => String(s).trim().slice(0, 30)).filter(Boolean) : [];
  const location = String(input.location || "remote").trim().slice(0, 60);
  const deadlineUnix = Math.max(0, Math.floor(Number(input.deadline_unix) || 0));

  if (!title || !description) {
    return jsonResponse({ status: "validation_failed", detail: "title + description required" }, { status: 422 });
  }
  if (!VALID_TYPES.has(jobType)) {
    return jsonResponse({ status: "job_type_invalid", valid: Array.from(VALID_TYPES) }, { status: 422 });
  }

  const store = platformStore(env);
  const id = makeId("JOB_");
  const slug = slugify(title) || "untitled";
  const record = {
    id,
    slug,
    title,
    description,
    job_type: jobType,
    budget_vnd: budgetVnd,
    skills,
    location,
    deadline_unix: deadlineUnix,
    status: "open",
    employer_email: ctx.session.candidate_email,
    employer_public: publicEmployer(ctx.session.candidate_email),
    application_count: 0,
    created_at: currentUnixSeconds(),
    updated_at: currentUnixSeconds(),
  };
  await store.put("job_listing", id, record, { ttlSeconds: LISTING_TTL });
  await store.put("job_listing_by_status", `open:${id}`, { listing_id: id }, { ttlSeconds: LISTING_TTL });
  return jsonResponse({ status: "listing_created", listing: record }, { status: 201 });
}

async function handleListListings(request, env) {
  const url = new URL(request.url);
  const status = (url.searchParams.get("status") || "open").toLowerCase();
  const cursor = url.searchParams.get("cursor") || undefined;
  if (!VALID_STATUSES.has(status)) {
    return jsonResponse({ status: "status_invalid", valid: Array.from(VALID_STATUSES) }, { status: 422 });
  }
  const data = await listKvByPrefix(env, `job_listing_by_status:${status}`, { limit: 50, cursor });
  const store = platformStore(env);
  const listings = [];
  for (const item of data.entries) {
    const lid = item.value?.listing_id;
    if (!lid) continue;
    const listing = await store.get("job_listing", lid);
    if (listing) listings.push(listing);
  }
  listings.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({ status: "listings_ok", listings, next_cursor: data.next_cursor });
}

async function handleGetListing(request, env, id) {
  const store = platformStore(env);
  const listing = await store.get("job_listing", id);
  if (!listing) return jsonResponse({ status: "listing_not_found" }, { status: 404 });
  return jsonResponse({ status: "listing_ok", listing });
}

async function handleApply(request, env, listingId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const note = String(input.note || "").trim().slice(0, APPLICATION_NOTE_MAX);
  const proposedBudget = Math.max(0, Math.floor(Number(input.proposed_budget_vnd) || 0));
  const portfolioUrl = String(input.portfolio_url || "").trim().slice(0, 200);

  const store = platformStore(env);
  const listing = await store.get("job_listing", listingId);
  if (!listing) return jsonResponse({ status: "listing_not_found" }, { status: 404 });
  if (listing.status !== "open") {
    return jsonResponse({ status: "listing_not_open", current_status: listing.status }, { status: 409 });
  }
  if (listing.employer_email === ctx.session.candidate_email) {
    return jsonResponse({ status: "cannot_apply_own_listing" }, { status: 403 });
  }

  const existingKey = `${listingId}:${ctx.session.candidate_email}`;
  const existing = await store.get("job_application_by_user", existingKey);
  if (existing) {
    return jsonResponse({ status: "already_applied", application_id: existing.application_id }, { status: 409 });
  }

  const appId = makeId("APP_");
  const application = {
    id: appId,
    listing_id: listingId,
    listing_title: listing.title,
    note,
    proposed_budget_vnd: proposedBudget,
    portfolio_url: portfolioUrl,
    applicant_email: ctx.session.candidate_email,
    applicant_public: publicEmployer(ctx.session.candidate_email),
    status: "submitted",
    created_at: currentUnixSeconds(),
  };
  await store.put("job_application", `${listingId}:${appId}`, application, { ttlSeconds: APPLICATION_TTL });
  await store.put("job_application_by_user", existingKey, { application_id: appId }, { ttlSeconds: APPLICATION_TTL });
  await store.put("job_application_by_applicant", `${ctx.session.candidate_email}:${appId}`, { listing_id: listingId, application_id: appId }, { ttlSeconds: APPLICATION_TTL });

  listing.application_count = Number(listing.application_count || 0) + 1;
  listing.updated_at = currentUnixSeconds();
  await store.put("job_listing", listingId, listing, { ttlSeconds: LISTING_TTL });

  return jsonResponse({ status: "application_submitted", application }, { status: 201 });
}

async function handleMyApplications(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const data = await listKvByPrefix(env, `job_application_by_applicant:${ctx.session.candidate_email}`, { limit: 100 });
  const store = platformStore(env);
  const apps = [];
  for (const item of data.entries) {
    const ref = item.value;
    if (!ref?.listing_id || !ref?.application_id) continue;
    const app = await store.get("job_application", `${ref.listing_id}:${ref.application_id}`);
    if (app) apps.push(app);
  }
  apps.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({ status: "applications_ok", applications: apps });
}

async function handleEmployerListings(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const all = await listKvByPrefix(env, "job_listing", { limit: 200 });
  const mine = all.entries
    .map((e) => e.value)
    .filter((l) => l && l.employer_email === ctx.session.candidate_email);
  mine.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({ status: "my_listings_ok", listings: mine });
}

async function handleUpdateApplicationStatus(request, env, listingId, applicationId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const newStatus = String(input.status || "").toLowerCase();
  if (!VALID_APPLICATION_STATUS.has(newStatus)) {
    return jsonResponse({ status: "application_status_invalid", valid: Array.from(VALID_APPLICATION_STATUS) }, { status: 422 });
  }
  const store = platformStore(env);
  const listing = await store.get("job_listing", listingId);
  if (!listing) return jsonResponse({ status: "listing_not_found" }, { status: 404 });
  if (listing.employer_email !== ctx.session.candidate_email) {
    return jsonResponse({ status: "not_employer" }, { status: 403 });
  }
  const app = await store.get("job_application", `${listingId}:${applicationId}`);
  if (!app) return jsonResponse({ status: "application_not_found" }, { status: 404 });
  app.status = newStatus;
  app.updated_at = currentUnixSeconds();
  await store.put("job_application", `${listingId}:${applicationId}`, app, { ttlSeconds: APPLICATION_TTL });
  return jsonResponse({ status: "application_updated", application: app });
}

export async function maybeHandleJobsRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "jobs_ok", types: Array.from(VALID_TYPES) });
  }
  if (request.method === "GET" && url.pathname === `${BASE}/listings`) {
    return handleListListings(request, env);
  }
  if (request.method === "POST" && url.pathname === `${BASE}/listings`) {
    return handleCreateListing(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/listings/me`) {
    return handleEmployerListings(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/applications/me`) {
    return handleMyApplications(request, env);
  }
  const listingMatch = url.pathname.match(/^\/api\/jobs\/listings\/([^/]+)$/);
  if (listingMatch && request.method === "GET") {
    return handleGetListing(request, env, listingMatch[1]);
  }
  const applyMatch = url.pathname.match(/^\/api\/jobs\/listings\/([^/]+)\/apply$/);
  if (applyMatch && request.method === "POST") {
    return handleApply(request, env, applyMatch[1]);
  }
  const appStatusMatch = url.pathname.match(/^\/api\/jobs\/listings\/([^/]+)\/applications\/([^/]+)\/status$/);
  if (appStatusMatch && request.method === "POST") {
    return handleUpdateApplicationStatus(request, env, appStatusMatch[1], appStatusMatch[2]);
  }
  return jsonResponse({ status: "jobs_route_not_found", path: url.pathname }, { status: 404 });
}
