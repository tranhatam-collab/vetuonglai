import {
  jsonResponse, currentUnixSeconds, platformStore, requireSession,
  readRequestJson, makeId, listKvByPrefix, slugify,
} from "./runtime-helpers.mjs";

const BASE = "/api/community";
const POST_TTL = 365 * 24 * 60 * 60;
const POSTS_PER_PAGE = 30;
const TITLE_MAX = 140;
const BODY_MAX = 8000;
const COMMENT_MAX = 2000;
const REACTIONS = new Set(["heart", "insight", "support", "doubt"]);
const VALID_CIRCLES = ["general", "edu", "work", "finance", "green", "family", "vc"];

function publicAuthor(email) {
  if (!email) return { handle: "anonymous", masked: "***" };
  const [local, domain] = String(email).split("@");
  const masked = local && local.length > 2
    ? `${local.slice(0, 2)}***@${domain || ""}`
    : `***@${domain || ""}`;
  return { handle: slugify(email).slice(0, 20) || "member", masked };
}

function sanitizeText(value, max) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}

function sanitizeBody(value, max) {
  return String(value || "").trim().slice(0, max);
}

async function handleCreatePost(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const title = sanitizeText(input.title, TITLE_MAX);
  const body = sanitizeBody(input.body, BODY_MAX);
  const circle = String(input.circle || "general").toLowerCase();
  if (!title || !body) {
    return jsonResponse({ status: "validation_failed", detail: "title + body required" }, { status: 422 });
  }
  if (!VALID_CIRCLES.includes(circle)) {
    return jsonResponse({ status: "circle_invalid", valid: VALID_CIRCLES }, { status: 422 });
  }
  const store = platformStore(env);
  const id = makeId("POST_");
  const record = {
    id,
    circle,
    title,
    body,
    author_email: ctx.session.candidate_email,
    author_public: publicAuthor(ctx.session.candidate_email),
    comment_count: 0,
    reaction_count: 0,
    reactions: { heart: 0, insight: 0, support: 0, doubt: 0 },
    created_at: currentUnixSeconds(),
    updated_at: currentUnixSeconds(),
  };
  await store.put("community_post", id, record, { ttlSeconds: POST_TTL });
  await store.put("community_post_by_circle", `${circle}:${id}`, { post_id: id }, { ttlSeconds: POST_TTL });
  return jsonResponse({ status: "post_created", post: record }, { status: 201 });
}

async function handleListPosts(request, env) {
  const url = new URL(request.url);
  const circle = (url.searchParams.get("circle") || "").toLowerCase();
  const cursor = url.searchParams.get("cursor") || undefined;
  const prefix = circle && VALID_CIRCLES.includes(circle)
    ? `community_post_by_circle:${circle}`
    : "community_post";
  const data = await listKvByPrefix(env, prefix, { limit: POSTS_PER_PAGE, cursor });
  const store = platformStore(env);
  const posts = [];
  for (const item of data.entries) {
    const postId = item.value?.post_id || item.value?.id;
    if (!postId) continue;
    const post = item.value?.post_id ? await store.get("community_post", postId) : item.value;
    if (post) posts.push(post);
  }
  posts.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({
    status: "posts_ok",
    posts,
    next_cursor: data.next_cursor,
    storage_mode: data.mode,
  });
}

async function handleGetPost(request, env, id) {
  const store = platformStore(env);
  const post = await store.get("community_post", id);
  if (!post) return jsonResponse({ status: "post_not_found" }, { status: 404 });
  const comments = await listKvByPrefix(env, `community_comment:${id}`, { limit: 200 });
  const commentList = comments.entries.map((e) => e.value).filter(Boolean);
  commentList.sort((a, b) => Number(a.created_at || 0) - Number(b.created_at || 0));
  return jsonResponse({ status: "post_ok", post, comments: commentList });
}

async function handleAddComment(request, env, postId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const body = sanitizeBody(input.body, COMMENT_MAX);
  if (!body) {
    return jsonResponse({ status: "comment_empty" }, { status: 422 });
  }
  const store = platformStore(env);
  const post = await store.get("community_post", postId);
  if (!post) return jsonResponse({ status: "post_not_found" }, { status: 404 });
  const commentId = makeId("CMT_");
  const comment = {
    id: commentId,
    post_id: postId,
    body,
    author_email: ctx.session.candidate_email,
    author_public: publicAuthor(ctx.session.candidate_email),
    created_at: currentUnixSeconds(),
  };
  await store.put("community_comment", `${postId}:${commentId}`, comment, { ttlSeconds: POST_TTL });
  post.comment_count = Number(post.comment_count || 0) + 1;
  post.updated_at = currentUnixSeconds();
  await store.put("community_post", postId, post, { ttlSeconds: POST_TTL });
  return jsonResponse({ status: "comment_created", comment }, { status: 201 });
}

async function handleReact(request, env, postId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const reaction = String(input.reaction || "").toLowerCase();
  if (!REACTIONS.has(reaction)) {
    return jsonResponse({ status: "reaction_invalid", valid: Array.from(REACTIONS) }, { status: 422 });
  }
  const store = platformStore(env);
  const post = await store.get("community_post", postId);
  if (!post) return jsonResponse({ status: "post_not_found" }, { status: 404 });
  const userKey = `${postId}:${ctx.session.candidate_email}`;
  const existing = await store.get("community_reaction", userKey);
  if (existing && existing.reaction === reaction) {
    return jsonResponse({ status: "already_reacted", post });
  }
  if (existing && post.reactions[existing.reaction]) {
    post.reactions[existing.reaction] = Math.max(0, post.reactions[existing.reaction] - 1);
  } else if (!existing) {
    post.reaction_count = Number(post.reaction_count || 0) + 1;
  }
  post.reactions[reaction] = Number(post.reactions[reaction] || 0) + 1;
  await store.put("community_reaction", userKey, { reaction, created_at: currentUnixSeconds() }, { ttlSeconds: POST_TTL });
  await store.put("community_post", postId, post, { ttlSeconds: POST_TTL });
  return jsonResponse({ status: "reaction_recorded", reactions: post.reactions });
}

async function handleFlagPost(request, env, postId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const input = await readRequestJson(request);
  const reason = String(input.reason || "other").toLowerCase();
  const validReasons = ["spam", "inappropriate", "off_topic", "other"];
  if (!validReasons.includes(reason)) {
    return jsonResponse({ status: "reason_invalid", valid: validReasons }, { status: 422 });
  }
  const store = platformStore(env);
  const post = await store.get("community_post", postId);
  if (!post) return jsonResponse({ status: "post_not_found" }, { status: 404 });
  const flagKey = `${postId}:${ctx.session.candidate_email}`;
  await store.put("community_flag", flagKey, {
    post_id: postId,
    reporter_email: ctx.session.candidate_email,
    reason,
    created_at: currentUnixSeconds(),
  }, { ttlSeconds: POST_TTL });
  post.flagged = true;
  post.flag_count = Number(post.flag_count || 0) + 1;
  post.updated_at = currentUnixSeconds();
  await store.put("community_post", postId, post, { ttlSeconds: POST_TTL });
  return jsonResponse({ status: "post_flagged", post_id: postId, reason }, { status: 201 });
}

async function handleListFlaggedPosts(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  if (!ctx.session.is_founder) {
    return jsonResponse({ status: "forbidden", detail: "only_founders_can_moderate" }, { status: 403 });
  }
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") || undefined;
  const data = await listKvByPrefix(env, "community_post", { limit: POSTS_PER_PAGE, cursor });
  const store = platformStore(env);
  const flaggedPosts = [];
  for (const item of data.entries) {
    const post = item.value;
    if (post && post.flagged) {
      const flags = await listKvByPrefix(env, `community_flag:${post.id}`, { limit: 100 });
      const flagDetails = flags.entries.map((e) => e.value).filter(Boolean);
      flaggedPosts.push({
        ...post,
        flags: flagDetails,
        flag_count: flagDetails.length,
      });
    }
  }
  flaggedPosts.sort((a, b) => Number(b.updated_at || 0) - Number(a.updated_at || 0));
  return jsonResponse({
    status: "flagged_posts_ok",
    posts: flaggedPosts,
    next_cursor: data.next_cursor,
    total: flaggedPosts.length,
  });
}

async function handleModeratePost(request, env, postId) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  if (!ctx.session.is_founder) {
    return jsonResponse({ status: "forbidden", detail: "only_founders_can_moderate" }, { status: 403 });
  }
  const input = await readRequestJson(request);
  const action = String(input.action || "").toLowerCase();
  const reason = String(input.reason || "other").toLowerCase();
  const validActions = ["approve", "reject"];
  if (!validActions.includes(action)) {
    return jsonResponse({ status: "action_invalid", valid: validActions }, { status: 422 });
  }
  const store = platformStore(env);
  const post = await store.get("community_post", postId);
  if (!post) return jsonResponse({ status: "post_not_found" }, { status: 404 });
  const modLogId = makeId("MOD_");
  const timestamp = currentUnixSeconds();
  await store.put("community_modlog", modLogId, {
    id: modLogId,
    post_id: postId,
    action,
    reason,
    moderator_email: ctx.session.candidate_email,
    created_at: timestamp,
  }, { ttlSeconds: POST_TTL });
  if (action === "approve") {
    post.flagged = false;
    post.flag_count = 0;
    post.updated_at = timestamp;
    await store.put("community_post", postId, post, { ttlSeconds: POST_TTL });
    return jsonResponse({
      status: "post_approved",
      post_id: postId,
      modlog_id: modLogId,
    }, { status: 200 });
  } else if (action === "reject") {
    post.soft_deleted = true;
    post.deleted_reason = reason;
    post.deleted_at = timestamp;
    post.deleted_by = ctx.session.candidate_email;
    post.updated_at = timestamp;
    await store.put("community_post", postId, post, { ttlSeconds: POST_TTL });
    return jsonResponse({
      status: "post_rejected",
      post_id: postId,
      modlog_id: modLogId,
    }, { status: 200 });
  }
}

export async function maybeHandleCommunityRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({ status: "community_ok", circles: VALID_CIRCLES });
  }
  if (request.method === "POST" && url.pathname === `${BASE}/posts`) {
    return handleCreatePost(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/posts`) {
    return handleListPosts(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/flagged-posts`) {
    return handleListFlaggedPosts(request, env);
  }
  const postMatch = url.pathname.match(/^\/api\/community\/posts\/([^/]+)$/);
  if (postMatch && request.method === "GET") {
    return handleGetPost(request, env, postMatch[1]);
  }
  const flagMatch = url.pathname.match(/^\/api\/community\/posts\/([^/]+)\/flag$/);
  if (flagMatch && request.method === "POST") {
    return handleFlagPost(request, env, flagMatch[1]);
  }
  const commentMatch = url.pathname.match(/^\/api\/community\/posts\/([^/]+)\/comments$/);
  if (commentMatch && request.method === "POST") {
    return handleAddComment(request, env, commentMatch[1]);
  }
  const reactMatch = url.pathname.match(/^\/api\/community\/posts\/([^/]+)\/react$/);
  if (reactMatch && request.method === "POST") {
    return handleReact(request, env, reactMatch[1]);
  }
  const moderateMatch = url.pathname.match(/^\/api\/community\/moderate\/([^/]+)$/);
  if (moderateMatch && request.method === "POST") {
    return handleModeratePost(request, env, moderateMatch[1]);
  }
  return jsonResponse({ status: "community_route_not_found", path: url.pathname }, { status: 404 });
}
