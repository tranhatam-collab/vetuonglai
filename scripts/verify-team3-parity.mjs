import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "team3-parity.latest.json");
const DIST_DIR = path.join(ROOT, "dist");

const steps = [
  {
    key: "build",
    label: "Build static system",
    cmd: "npm",
    args: ["run", "build"],
    timeoutMs: 12 * 60 * 1000,
  },
  {
    key: "check",
    label: "Validate dist outputs",
    cmd: "npm",
    args: ["run", "check"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_access",
    label: "Smoke access runtime",
    cmd: "npm",
    args: ["run", "smoke:access-runtime"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_vc",
    label: "Smoke VC ownership runtime",
    cmd: "npm",
    args: ["run", "smoke:vc-ownership-runtime"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "smoke_mobile",
    label: "Smoke mobile PWA",
    cmd: "npm",
    args: ["run", "smoke:mobile-pwa"],
    timeoutMs: 3 * 60 * 1000,
  },
  {
    key: "verify_founder_panel_local",
    label: "Verify founder panel local contract",
    cmd: "npm",
    args: ["run", "verify:founder-panel:local"],
    timeoutMs: 3 * 60 * 1000,
  },
];

const DOC_15_PATH = path.join(ROOT, "docs", "15_RUNTIME_TRUTH_MATRIX_V1.md");
const DOC_32_PATH = path.join(ROOT, "docs", "00_master", "32_RUNTIME_TRUTH_MATRIX_V1.md");
const BOARD_39_PATH = path.join(ROOT, "docs", "00_master", "39_EXECUTION_BOARD_VETUONGLAI_V1.md");
const BOARD_48_PATH = path.join(ROOT, "docs", "final-lock", "VTL_48_TOTAL_SYSTEM_5_TEAM_CONTINUATION_BOARD_2026-04-22.md");
const WAVE_D_BLOCKERS_PATH = path.join(ROOT, "docs", "final-lock", "VTL_54_WAVE_D_DNS_AND_RUNTIME_PUBLISH_BLOCKERS_2026-04-22.md");
const TEAM3_PLAN_PATH = path.join(ROOT, "docs", "final-lock", "VTL_36_TEAM3_EXECUTION_PLAN_2026-04-14.md");
const WITHDRAWN_PROTOCOL_PATH = path.join(ROOT, "docs", "final-lock", "VTL_43_TEAM_PROTOCOL_ADOPTION_AND_LANGUAGE_UPGRADE_2026-04-19.md");
const MEMBER_SECRET_CHECKLIST_PATH = path.join(ROOT, "docs", "final-lock", "VTL_25_MEMBER_SECRET_CHECKLIST_2026-04-10.md");
const SYSTEM_REGISTRY_PATH = path.join(ROOT, "src", "data", "system-registry.json");
const APPS_PATH = path.join(ROOT, "src", "data", "apps.json");
const TEAM3_POLICY_MATRIX_PATH = path.join(ROOT, "src", "data", "team3-policy-matrix.json");
const RUNTIME_TRUTH_PATH = path.join(ROOT, "cloudflare", "domain-runtime-truth.json");
const WORKERS_PROJECTS_PATH = path.join(ROOT, "cloudflare", "workers-projects.json");
const LOCALE_REGISTRY_PATH = path.join(ROOT, "content", "locale-registry.json");
const LANGUAGE_CODEX_PATH = path.join(ROOT, "content", "language-codex.md");
const VI_CONTENT_PATH = path.join(ROOT, "content", "vi.json");
const EN_CONTENT_PATH = path.join(ROOT, "content", "en.json");
const HUB_HOME_PATH = path.join(DIST_DIR, "vetuonglai.com", "index.html");
const VC_HOME_PATH = path.join(DIST_DIR, "vc.vetuonglai.com", "index.html");
const MEMBER_HOME_PATH = path.join(DIST_DIR, "member.vetuonglai.com", "index.html");
const MEMBER_APP_HOME_PATH = path.join(DIST_DIR, "member.vetuonglai.com", "app", "index.html");
const MEMBER_APP_OFFLINE_PATH = path.join(DIST_DIR, "member.vetuonglai.com", "app", "offline", "index.html");
const LIFE_HOME_PATH = path.join(DIST_DIR, "life.vetuonglai.com", "index.html");
const INVEST_HOME_PATH = path.join(DIST_DIR, "invest.vetuonglai.com", "index.html");
const WORK_HOME_PATH = path.join(DIST_DIR, "work.vetuonglai.com", "index.html");
const WORK_BRIEF_PATH = path.join(DIST_DIR, "work.vetuonglai.com", "brief", "index.html");
const MARKET_HOME_PATH = path.join(DIST_DIR, "market.vetuonglai.com", "index.html");
const MARKET_RULES_PATH = path.join(DIST_DIR, "market.vetuonglai.com", "rules", "index.html");
const COMMUNITY_HOME_PATH = path.join(DIST_DIR, "community.vetuonglai.com", "index.html");
const AI_HOME_PATH = path.join(DIST_DIR, "ai.vetuonglai.com", "index.html");
const BUSINESS_HOME_PATH = path.join(DIST_DIR, "business.vetuonglai.com", "index.html");
const READ_HOME_SOURCE_PATH = path.join(ROOT, "src", "static-pages", "read.vetuonglai.com", "index.html");

function severityRank(value) {
  switch (String(value || "").toUpperCase()) {
    case "P0":
      return 4;
    case "P1":
      return 3;
    case "P2":
      return 2;
    default:
      return 1;
  }
}

function highestSeverity(findings) {
  return findings.reduce((highest, finding) => (
    severityRank(finding.severity) > severityRank(highest) ? finding.severity : highest
  ), "P3");
}

function makeFinding({
  key,
  title,
  severity = "P2",
  owner = "Team 3",
  stopLine = false,
  summaryVi,
  summaryEn,
  evidence = [],
  ...extra
}) {
  return {
    key,
    title,
    severity,
    owner,
    stopLine,
    summaryVi,
    summaryEn,
    evidence,
    ...extra,
  };
}

function normalizePublicStatus(rawValue = "") {
  const value = String(rawValue || "").toLowerCase().trim();
  if (!value) return "unknown";
  if (value.includes("bridge")) return "bridge";
  if (value.includes("member_preview") || value.includes("member preview")) return "member_preview";
  if (value.includes("beta")) return "member_preview";
  if (value.includes("planned")) return "planned";
  if (value.includes("live")) return "live";
  return "unknown";
}

async function readOptionalText(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function matchesPattern(text, pattern) {
  return pattern instanceof RegExp ? pattern.test(text) : String(text || "").includes(pattern);
}

function buildScopedRecommendation(findings) {
  if (findings.length === 0) {
    return "go";
  }

  if (findings.some((finding) => ["P0", "P1"].includes(String(finding.severity || "").toUpperCase()))) {
    return "no_go";
  }

  return "hold";
}

function buildScopedNote({ recommendation, findings, passVi, passEn, prefixVi, prefixEn }) {
  if (recommendation === "go") {
    return {
      vi: passVi,
      en: passEn,
    };
  }

  const topFinding = findings
    .slice()
    .sort((left, right) => severityRank(right.severity) - severityRank(left.severity))[0];

  if (!topFinding) {
    return {
      vi: `${prefixVi} chưa đủ evidence để chốt go.`,
      en: `${prefixEn} does not have enough evidence yet to conclude go.`,
    };
  }

  return {
    vi: `${prefixVi}: ${topFinding.summaryVi}`,
    en: `${prefixEn}: ${topFinding.summaryEn}`,
  };
}

function auditRequiredAndBannedText({
  wave,
  surfaceKey,
  title,
  owner,
  content,
  filePath,
  required = [],
  banned = [],
}) {
  const findings = [];

  if (!content) {
    findings.push(makeFinding({
      key: `${surfaceKey}_missing_surface`,
      title: `${title} output is missing`,
      severity: "P1",
      owner,
      stopLine: false,
      summaryVi: `Không tìm thấy artifact cho ${title}, nên Team 3 chưa thể audit wording/disclosure của surface này.`,
      summaryEn: `The artifact for ${title} is missing, so Team 3 cannot audit wording or disclosures on this surface yet.`,
      evidence: [filePath],
      wave,
      surfaceKey,
      scope: "continuation",
    }));
    return findings;
  }

  for (const requirement of required) {
    if (!matchesPattern(content, requirement.pattern)) {
      findings.push(makeFinding({
        key: `${surfaceKey}_missing_${requirement.key}`,
        title: `${title} is missing required Team 3 wording`,
        severity: requirement.severity || "P1",
        owner,
        stopLine: false,
        summaryVi: requirement.summaryVi,
        summaryEn: requirement.summaryEn,
        evidence: [filePath],
        wave,
        surfaceKey,
        scope: "continuation",
      }));
    }
  }

  for (const forbidden of banned) {
    if (matchesPattern(content, forbidden.pattern)) {
      findings.push(makeFinding({
        key: `${surfaceKey}_banned_${forbidden.key}`,
        title: `${title} still carries banned wording`,
        severity: forbidden.severity || "P1",
        owner,
        stopLine: false,
        summaryVi: forbidden.summaryVi,
        summaryEn: forbidden.summaryEn,
        evidence: [filePath],
        wave,
        surfaceKey,
        scope: "continuation",
      }));
    }
  }

  return findings;
}

function parseDoc15StatusMap(markdown) {
  const map = new Map();
  let currentHost = "";
  for (const line of String(markdown || "").split("\n")) {
    const hostMatch = line.match(/^### `([^`]+)`\s*$/);
    if (hostMatch) {
      currentHost = hostMatch[1];
      continue;
    }
    const statusMatch = line.match(/^\*\*Status:\*\*\s*(.+)\s*$/);
    if (currentHost && statusMatch) {
      map.set(currentHost, {
        raw: statusMatch[1].trim(),
        normalized: normalizePublicStatus(statusMatch[1]),
      });
      currentHost = "";
    }
  }
  return map;
}

function parseDoc32StatusMap(markdown) {
  const map = new Map();
  for (const line of String(markdown || "").split("\n")) {
    const match = line.match(/^- `([^`]+)` = (.+?)\s*$/);
    if (!match) continue;
    const raw = match[2].replaceAll("`", "").trim();
    map.set(match[1], {
      raw,
      normalized: normalizePublicStatus(raw),
    });
  }
  return map;
}

function extractSecretLikeTokens(markdown) {
  const matches = String(markdown || "").match(/\b[A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+\b/g) || [];
  return [...new Set(matches)].filter((token) => /(SECRET|KEY|CLIENT|WEBHOOK|COOKIE|API)/.test(token));
}

function extractChecklistStrictSecrets(markdown) {
  const content = String(markdown || "");
  const anchor = "Expected: all strict-gate secret names are present:";
  const legacyAnchor = "Expected: all 7 required secret names are present:";
  const startIndex = content.includes(anchor)
    ? content.indexOf(anchor) + anchor.length
    : (content.includes(legacyAnchor) ? content.indexOf(legacyAnchor) + legacyAnchor.length : -1);

  if (startIndex === -1) {
    return [];
  }

  const remainder = content.slice(startIndex);
  const lines = [];
  for (const line of remainder.split("\n")) {
    if (/^##\s+/.test(line)) break;
    if (/^Expected:/.test(line)) break;
    if (line.trim() === "") {
      if (lines.length > 0) break;
      continue;
    }
    lines.push(line);
  }

  return extractSecretLikeTokens(lines.join("\n"));
}

async function runStep(step) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  let timedOut = false;

  return await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
      shell: false,
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref();
    }, step.timeoutMs);

    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        timeoutMs: step.timeoutMs,
        timedOut,
        ok: false,
        code: null,
        signal: null,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timeout);
      resolve({
        key: step.key,
        label: step.label,
        command: `${step.cmd} ${step.args.join(" ")}`,
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        timeoutMs: step.timeoutMs,
        timedOut,
        ok: code === 0 && !timedOut,
        code,
        signal,
        error: timedOut ? `Timed out after ${step.timeoutMs}ms` : "",
      });
    });
  });
}

function auditSuiteResults(stepResults) {
  return stepResults
    .filter((step) => !step.ok)
    .map((step) => makeFinding({
      key: `suite_${step.key}`,
      title: `Verification suite failed: ${step.label}`,
      severity: step.key === "build" || step.key === "check" ? "P0" : "P1",
      owner: step.key === "verify_founder_panel_local" ? "Team 1 + Team 3" : "Team 1",
      stopLine: true,
      summaryVi: `Bước verify \`${step.command}\` chưa pass nên Team 3 chưa thể chốt parity/go-no-go.`,
      summaryEn: `The verification step \`${step.command}\` failed, so Team 3 cannot close parity or go/no-go.`,
      evidence: [step.command],
    }));
}

function auditBoardAndProtocol({ board39, team3Plan, withdrawnProtocol }) {
  const findings = [];

  if (!board39.includes("Team 3 — Governance / Runtime Truth / QA Gate")
    && !board39.includes("Team 3 — Docs / Ops / Governance / QA Gate")) {
    findings.push(makeFinding({
      key: "board_39_missing_team3_lane",
      title: "Main execution board no longer exposes Team 3 ownership",
      severity: "P1",
      owner: "Team 1 + Team 3",
      stopLine: true,
      summaryVi: "Board chính không còn ghi rõ lane Team 3, dễ làm drift ownership của trust/disclosure/runtime parity.",
      summaryEn: "The main execution board no longer states Team 3's lane clearly, which risks trust/disclosure/runtime-parity ownership drift.",
      evidence: [BOARD_39_PATH],
    }));
  }

  if (!team3Plan.includes("launch go/no-go control") || !team3Plan.includes("chặn mọi overclaim")) {
    findings.push(makeFinding({
      key: "team3_plan_missing_governance_gates",
      title: "Team 3 plan no longer carries stop-line and go/no-go duties",
      severity: "P1",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "Plan của Team 3 đang thiếu phần go/no-go hoặc stop-line, không còn bám đúng scope governance đã khóa.",
      summaryEn: "The Team 3 plan is missing go/no-go or stop-line duties and no longer matches the locked governance scope.",
      evidence: [TEAM3_PLAN_PATH],
    }));
  }

  if (!withdrawnProtocol.includes("status: withdrawn")) {
    findings.push(makeFinding({
      key: "withdrawn_protocol_not_marked",
      title: "Withdrawn protocol file is no longer explicitly withdrawn",
      severity: "P1",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "File correction protocol không còn ghi rõ trạng thái withdrawn, có thể làm team dùng nhầm rule cũ.",
      summaryEn: "The correction protocol file is no longer explicitly marked withdrawn, which could make teams follow outdated rules.",
      evidence: [WITHDRAWN_PROTOCOL_PATH],
    }));
  }

  return findings;
}

function auditStatusModel({ doc15Map, doc32Map, systemRegistry }) {
  const findings = [];

  for (const [host, doc32] of doc32Map.entries()) {
    const doc15 = doc15Map.get(host);
    if (doc15 && doc32.normalized !== doc15.normalized) {
      findings.push(makeFinding({
        key: `runtime_truth_doc_drift_${host}`,
        title: `Runtime truth docs disagree for ${host}`,
        severity: "P1",
        owner: "Team 3",
        stopLine: true,
        summaryVi: `Hai file runtime truth đang nói khác nhau cho ${host}: docs/15 = \`${doc15.raw}\`, docs/32 = \`${doc32.raw}\`.`,
        summaryEn: `The two runtime-truth docs disagree for ${host}: docs/15 = \`${doc15.raw}\`, docs/32 = \`${doc32.raw}\`.`,
        evidence: [DOC_15_PATH, DOC_32_PATH],
      }));
    }
  }

  const betaHosts = [...doc32Map.entries()]
    .filter(([, value]) => String(value.raw || "").toUpperCase().includes("BETA"))
    .map(([host]) => host);

  if (betaHosts.length > 0) {
    findings.push(makeFinding({
      key: "beta_alias_still_present",
      title: "Implementation runtime matrix still uses BETA alias",
      severity: "P1",
      owner: "Team 3",
      stopLine: true,
      summaryVi: `docs/32 vẫn dùng alias \`BETA\` cho ${betaHosts.join(", ")}, trong khi Team 3 plan đang khóa public status model về \`Live / Member Preview / Planned / Bridge\`.`,
      summaryEn: `docs/32 still uses the \`BETA\` alias for ${betaHosts.join(", ")}, while the Team 3 plan locks the public status model to \`Live / Member Preview / Planned / Bridge\`.`,
      evidence: [DOC_32_PATH, TEAM3_PLAN_PATH],
    }));
  }

  return findings;
}

function auditPolicyMatrix(team3PolicyMatrix) {
  const findings = [];
  const guardrails = team3PolicyMatrix.guardrails || {};
  const requiredEvents = new Set(team3PolicyMatrix.reporting?.requiredEvents || []);

  if (guardrails.homepagePurchaseHubOnly !== true || guardrails.affiliateDisabledAtPublicLayer !== true) {
    findings.push(makeFinding({
      key: "policy_matrix_public_guardrail_drift",
      title: "Team 3 guardrails no longer lock public purchase and affiliate boundaries",
      severity: "P0",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "Policy matrix không còn khóa chặt homepage purchase hub hoặc affiliate-disabled boundary ở public layer.",
      summaryEn: "The policy matrix no longer locks the homepage purchase hub or the affiliate-disabled boundary on the public layer.",
      evidence: [TEAM3_POLICY_MATRIX_PATH],
    }));
  }

  if (guardrails.allowEarningsGuaranteeLanguage !== false || guardrails.allowMlmStructures !== false) {
    findings.push(makeFinding({
      key: "policy_matrix_hype_guardrail_drift",
      title: "Team 3 guardrails no longer block earnings-hype language",
      severity: "P0",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "Policy matrix không còn chặn guarantee/MLM wording, vượt quá trust/legal scope mà Team 3 phải giữ.",
      summaryEn: "The policy matrix no longer blocks guarantee/MLM wording, which exceeds the trust/legal scope Team 3 must protect.",
      evidence: [TEAM3_POLICY_MATRIX_PATH],
    }));
  }

  for (const eventKey of ["affiliate_activation_approved", "affiliate_activation_rejected", "vc_record_status_changed", "disclosure_acknowledged"]) {
    if (!requiredEvents.has(eventKey)) {
      findings.push(makeFinding({
        key: `policy_matrix_missing_event_${eventKey}`,
        title: `Team 3 reporting matrix is missing required event ${eventKey}`,
        severity: "P1",
        owner: "Team 3 + Team 1",
        stopLine: true,
        summaryVi: `Policy matrix đang thiếu event bắt buộc \`${eventKey}\` cho audit/no-drift.`,
        summaryEn: `The policy matrix is missing the required \`${eventKey}\` event for audit and no-drift checks.`,
        evidence: [TEAM3_POLICY_MATRIX_PATH],
      }));
    }
  }

  if (!Array.isArray(team3PolicyMatrix.launchGate?.checks) || team3PolicyMatrix.launchGate.checks.length < 6) {
    findings.push(makeFinding({
      key: "policy_matrix_launch_gate_incomplete",
      title: "Team 3 launch-gate checklist is incomplete",
      severity: "P1",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "Launch-gate checklist trong Team 3 policy matrix chưa đủ để kết luận go/no-go có evidence.",
      summaryEn: "The Team 3 policy-matrix launch-gate checklist is not complete enough to support an evidence-backed go/no-go decision.",
      evidence: [TEAM3_POLICY_MATRIX_PATH],
    }));
  }

  return findings;
}

function auditLaunchGate(runtimeTruth, systemRegistry) {
  const findings = [];
  const runtimeByHost = new Map(
    (runtimeTruth.domains || []).map((entry) => [String(entry.host), entry]),
  );
  const memberRuntime = runtimeByHost.get("member.vetuonglai.com");

  if (!memberRuntime) {
    findings.push(makeFinding({
      key: "runtime_truth_missing_member_domain",
      title: "Runtime truth is missing member.vetuonglai.com",
      severity: "P0",
      owner: "Team 1",
      stopLine: true,
      summaryVi: "Runtime truth không còn record cho member domain, nên Team 3 không thể audit cutover hoặc launch-go.",
      summaryEn: "Runtime truth no longer carries a member-domain record, so Team 3 cannot audit cutover or launch-go.",
      evidence: [RUNTIME_TRUTH_PATH],
    }));
    return findings;
  }

  if (memberRuntime.requiredPublic !== true || String(memberRuntime.status) !== "live") {
    findings.push(makeFinding({
      key: "member_cutover_not_live_yet",
      title: "Member cutover is still not release-ready",
      severity: "P1",
      owner: "Team 1 + Ops",
      stopLine: true,
      summaryVi: `Runtime truth vẫn ghi member là \`${memberRuntime.status}\` với \`requiredPublic=${memberRuntime.requiredPublic}\`, nên Team 3 phải giữ verdict ở mức hold/no-go cho cutover công khai.`,
      summaryEn: `Runtime truth still records member as \`${memberRuntime.status}\` with \`requiredPublic=${memberRuntime.requiredPublic}\`, so Team 3 must keep the verdict at hold/no-go for public cutover.`,
      evidence: [RUNTIME_TRUTH_PATH],
    }));
  }

  const liveRegistryHosts = (systemRegistry.domains || [])
    .filter((entry) => entry?.status === "live")
    .map((entry) => String(entry.host));

  for (const host of liveRegistryHosts) {
    const runtimeEntry = runtimeByHost.get(host);
    if (!runtimeEntry) {
      findings.push(makeFinding({
        key: `live_host_missing_runtime_${host}`,
        title: `System registry marks ${host} live without runtime record`,
        severity: "P0",
        owner: "Team 1",
        stopLine: true,
        summaryVi: `System registry đang cho ${host} là live nhưng runtime truth không có record tương ứng.`,
        summaryEn: `The system registry marks ${host} as live, but runtime truth has no matching record.`,
        evidence: [SYSTEM_REGISTRY_PATH, RUNTIME_TRUTH_PATH],
      }));
      continue;
    }

    if (runtimeEntry.requiredPublic !== true) {
      findings.push(makeFinding({
        key: `live_host_not_required_public_${host}`,
        title: `Live public host ${host} is not required-public in runtime truth`,
        severity: "P1",
        owner: "Team 1 + Ops",
        stopLine: true,
        summaryVi: `${host} đang được nói là live trong system registry nhưng runtime truth chưa khóa \`requiredPublic=true\`.`,
        summaryEn: `${host} is described as live in the system registry, but runtime truth has not locked \`requiredPublic=true\`.`,
        evidence: [SYSTEM_REGISTRY_PATH, RUNTIME_TRUTH_PATH],
      }));
    }
  }

  return findings;
}

function buildMemberCutoverDetails({ runtimeTruth, workersConfig, checklistMarkdown }) {
  const runtimeByHost = new Map(
    (runtimeTruth.domains || []).map((entry) => [String(entry.host), entry]),
  );
  const memberRuntime = runtimeByHost.get("member.vetuonglai.com") || null;
  const memberWorker = (workersConfig.workers || []).find((worker) => worker?.key === "member" || worker?.scriptName === "vetuonglai-member") || null;

  return {
    runtimeTruth: memberRuntime
      ? {
          status: String(memberRuntime.status || ""),
          requiredPublic: Boolean(memberRuntime.requiredPublic),
          servingModel: String(memberRuntime.servingModel || ""),
        }
      : null,
    workerContract: memberWorker
      ? {
          scriptName: String(memberWorker.scriptName || ""),
          routes: Array.isArray(memberWorker.routes) ? memberWorker.routes : [],
          requiredSecrets: Array.isArray(memberWorker.accessRuntime?.requiredSecrets) ? memberWorker.accessRuntime.requiredSecrets : [],
        }
      : null,
    checklistStrictSecrets: extractChecklistStrictSecrets(checklistMarkdown),
    promoteCommand: "npm run cloudflare:promote:member",
  };
}

function auditMemberCutoverContract({ workersConfig, checklistMarkdown }) {
  const findings = [];
  const memberWorker = (workersConfig.workers || []).find((worker) => worker?.key === "member" || worker?.scriptName === "vetuonglai-member");

  if (!memberWorker?.accessRuntime?.requiredSecrets?.length) {
    findings.push(makeFinding({
      key: "member_worker_required_secrets_missing",
      title: "Member worker contract does not expose required secrets",
      severity: "P1",
      owner: "Team 1",
      stopLine: true,
      summaryVi: "workers-projects hiện không khai báo rõ required secrets cho worker member, nên Team 3 không thể audit cutover checklist.",
      summaryEn: "workers-projects does not clearly expose required secrets for the member worker, so Team 3 cannot audit the cutover checklist.",
      evidence: [WORKERS_PROJECTS_PATH],
    }));
    return findings;
  }

  const contractSecrets = new Set(memberWorker.accessRuntime.requiredSecrets);
  const documentedSecrets = new Set(extractChecklistStrictSecrets(checklistMarkdown));
  const missingFromChecklist = [...contractSecrets].filter((token) => !documentedSecrets.has(token));
  const extraInChecklist = [...documentedSecrets].filter((token) => !contractSecrets.has(token));

  if (missingFromChecklist.length > 0 || extraInChecklist.length > 0) {
    const extrasVi = extraInChecklist.length > 0
      ? `Checklist đang nói thêm: ${extraInChecklist.join(", ")}.`
      : "";
    const missingVi = missingFromChecklist.length > 0
      ? `Checklist đang thiếu: ${missingFromChecklist.join(", ")}.`
      : "";
    const extrasEn = extraInChecklist.length > 0
      ? `Checklist still includes: ${extraInChecklist.join(", ")}.`
      : "";
    const missingEn = missingFromChecklist.length > 0
      ? `Checklist is missing: ${missingFromChecklist.join(", ")}.`
      : "";

    findings.push(makeFinding({
      key: "member_cutover_secret_contract_drift",
      title: "Member cutover checklist drifts from the current worker secret contract",
      severity: "P1",
      owner: "Team 1 + Team 3",
      stopLine: true,
      summaryVi: `Checklist cutover member không còn khớp strict contract của worker. ${missingVi} ${extrasVi}`.trim(),
      summaryEn: `The member cutover checklist no longer matches the worker's strict contract. ${missingEn} ${extrasEn}`.trim(),
      evidence: [WORKERS_PROJECTS_PATH, MEMBER_SECRET_CHECKLIST_PATH],
    }));
  }

  return findings;
}

function auditLanguageLock({ localeRegistry, languageCodex }) {
  const findings = [];
  if (localeRegistry.sourceLocale !== "vi-VN" || localeRegistry.defaultRuntimeLocale !== "vi") {
    findings.push(makeFinding({
      key: "locale_registry_drift",
      title: "Locale registry no longer locks Vietnamese as the source language",
      severity: "P1",
      owner: "Team 2 + Team 3",
      stopLine: true,
      summaryVi: "Locale registry không còn khóa tiếng Việt là source locale / runtime locale mặc định.",
      summaryEn: "The locale registry no longer locks Vietnamese as the source or default runtime locale.",
      evidence: [LOCALE_REGISTRY_PATH],
    }));
  }

  if (!String(languageCodex || "").includes("Chuẩn hóa badge, CTA và disclosure wording")) {
    findings.push(makeFinding({
      key: "language_codex_anchor_missing",
      title: "Language Codex is missing the badge/CTA/disclosure wording anchor",
      severity: "P1",
      owner: "Team 3",
      stopLine: true,
      summaryVi: "Language Codex không còn anchor cho badge/CTA/disclosure wording nên Team 3 mất chuẩn review ngôn ngữ.",
      summaryEn: "The Language Codex no longer contains the badge/CTA/disclosure wording anchor, so Team 3 loses its wording review baseline.",
      evidence: [LANGUAGE_CODEX_PATH],
    }));
  }

  return findings;
}

function summarizeStepResults(stepResults) {
  const failed = stepResults.filter((step) => !step.ok).length;
  return {
    total: stepResults.length,
    passed: stepResults.length - failed,
    failed,
  };
}

function buildRecommendation(findings, stepResults) {
  const suiteFailed = stepResults.some((step) => !step.ok);
  const stopLineFindings = findings.filter((finding) => finding.stopLine);
  const hasP0 = stopLineFindings.some((finding) => finding.severity === "P0");

  if (suiteFailed || hasP0) {
    return "no_go";
  }

  if (stopLineFindings.length > 0) {
    return "hold";
  }

  return "go";
}

function buildHumanNote(recommendation, findings) {
  if (recommendation === "go") {
    return {
      vi: "Team 3 pass: không còn stop-line đang mở trong scope local parity hiện tại.",
      en: "Team 3 pass: there are no open stop-lines in the current local parity scope.",
    };
  }

  const topFinding = findings
    .slice()
    .sort((left, right) => severityRank(right.severity) - severityRank(left.severity))[0];

  if (!topFinding) {
    return {
      vi: "Team 3 giữ verdict ở mức hold vì chưa đủ evidence để kết luận go.",
      en: "Team 3 keeps the verdict at hold because there is not enough evidence yet to conclude go.",
    };
  }

  return {
    vi: `Team 3 ${recommendation === "no_go" ? "no-go" : "hold"}: ${topFinding.summaryVi}`,
    en: `Team 3 ${recommendation}: ${topFinding.summaryEn}`,
  };
}

function auditMobileTrustSurfaces({ memberAppHome, memberAppOffline }) {
  const findings = [
    ...auditRequiredAndBannedText({
      wave: "B",
      surfaceKey: "member_app_home",
      title: "member mobile app home",
      owner: "Team 2 + Team 3",
      content: memberAppHome,
      filePath: MEMBER_APP_HOME_PATH,
      required: [
        {
          key: "entitlement_truth_anchor",
          pattern: /Public value được neo vào entitlement thật|Giá trị công khai ở đây luôn bám theo quyền truy cập thật|Public value here always follows the real access state/,
          summaryVi: "Mobile app home đang thiếu anchor buộc public value bám entitlement thật.",
          summaryEn: "The mobile app home is missing the anchor that ties public value to the real entitlement state.",
        },
        {
          key: "session_truth_anchor",
          pattern: /Unlock map luôn bám theo session truth và entitlement thật, không giả live\.|Unlock map luôn bám theo trạng thái tài khoản và quyền truy cập hiện có, không giả như đã mở thật\.|The unlock map always follows your current account status and access rights, and is never presented as already live\./,
          summaryVi: "Mobile app home đang thiếu câu khóa session truth / no-fake-live cho unlock map.",
          summaryEn: "The mobile app home is missing the session-truth / no-fake-live lock for the unlock map.",
        },
        {
          key: "no_checkout_anchor",
          pattern: /Không có checkout trực tiếp tại app hoặc subdomain này\.|Không có thanh toán trực tiếp tại app hoặc subdomain này\.|Không có thanh toán trực tiếp tại trang này\.|There is no direct payment step on this app or subdomain\.|There is no direct payment step on this page\./,
          summaryVi: "Mobile app home đang thiếu disclosure chặn checkout trực tiếp trong app.",
          summaryEn: "The mobile app home is missing the disclosure that blocks direct checkout inside the app.",
        },
        {
          key: "state_model_anchor",
          pattern: /App shell chỉ hỗ trợ 4 state cốt lõi: visitor, pending_member, annual_active, pack_owner\.|App shell chỉ hỗ trợ 4 trạng thái cốt lõi: visitor, pending_member, annual_active, pack_owner\.|The app shell supports only four core states: visitor, pending_member, annual_active, and pack_owner\./,
          summaryVi: "Mobile app home đang thiếu câu khóa 4 state cốt lõi của app shell.",
          summaryEn: "The mobile app home is missing the lock that limits the app shell to the four core states.",
        },
      ],
      banned: [
        {
          key: "member_planned_claim_vi",
          pattern: "member.vetuonglai.com hiện ở trạng thái Planned",
          summaryVi: "Mobile app home vẫn còn nói member là Planned dù current runtime đã mở live core surface.",
          summaryEn: "The mobile app home still says member is Planned even though the current runtime has opened the live core surface.",
        },
        {
          key: "member_planned_claim_generic_vi",
          pattern: "Đây là lớp công khai ở trạng thái Planned: có teaser, demo và CTA, nhưng chưa được trình bày như một lớp đã hoạt động đầy đủ.",
          summaryVi: "Mobile app home vẫn render generic Planned wording cho chính surface member.",
          summaryEn: "The mobile app home still renders generic Planned wording for the member surface itself.",
        },
      ],
    }),
    ...auditRequiredAndBannedText({
      wave: "B",
      surfaceKey: "member_app_offline",
      title: "member mobile offline fallback",
      owner: "Team 2 + Team 3",
      content: memberAppOffline,
      filePath: MEMBER_APP_OFFLINE_PATH,
      required: [
        {
          key: "no_promise_anchor",
          pattern: "Không hứa hẹn kết quả. Chỉ cung cấp cấu trúc để sống rõ hơn.",
          summaryVi: "Offline fallback đang thiếu câu no-promise cốt lõi của Team 3.",
          summaryEn: "The offline fallback is missing the core no-promise disclosure required by Team 3.",
        },
      ],
    }),
  ];

  const recommendation = buildScopedRecommendation(findings);
  return {
    recommendation,
    note: buildScopedNote({
      recommendation,
      findings,
      passVi: "Wave B go: mobile trust/disclosure wording hiện khớp live member truth và vẫn giữ no-checkout / no-fake-live guardrail.",
      passEn: "Wave B go: the mobile trust/disclosure wording matches the live member truth and keeps the no-checkout / no-fake-live guardrail intact.",
      prefixVi: "Wave B no-go",
      prefixEn: "Wave B no-go",
    }),
    findings,
    auditedSurfaces: [
      MEMBER_APP_HOME_PATH,
      MEMBER_APP_OFFLINE_PATH,
    ],
  };
}

function auditCoreSubdomainWave({
  board48,
  doc15Map,
  doc32Map,
  systemRegistry,
  appsCatalog,
  memberHome,
}) {
  const findings = [];
  const registryMap = new Map(
    (systemRegistry.domains || [])
      .filter((entry) => entry?.host)
      .map((entry) => [String(entry.host), normalizePublicStatus(entry.status)]),
  );
  const appsMap = new Map(
    (appsCatalog || [])
      .filter((entry) => entry?.url)
      .map((entry) => {
        const url = String(entry.url);
        const host = url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
        return [host, normalizePublicStatus(entry.status)];
      }),
  );

  for (const host of ["life.vetuonglai.com", "invest.vetuonglai.com"]) {
    if (!board48.includes(host) || !board48.includes("planned_public")) {
      continue;
    }

    const actualStatuses = {
      doc15: doc15Map.get(host)?.normalized || "unknown",
      doc32: doc32Map.get(host)?.normalized || "unknown",
      systemRegistry: registryMap.get(host) || "unknown",
      appsCatalog: appsMap.get(host) || "unknown",
    };

    const driftedSources = Object.entries(actualStatuses)
      .filter(([, value]) => value !== "planned")
      .map(([source, value]) => `${source}=${value}`);

    if (driftedSources.length > 0) {
      findings.push(makeFinding({
        key: `wave_c_status_drift_${host}`,
        title: `${host} still drifts from the continuation-board planned_public snapshot`,
        severity: "P1",
        owner: "Team 1 + Team 2 + Team 3",
        stopLine: false,
        summaryVi: `${host} đang được board continuation chốt là \`planned_public\`, nhưng các nguồn build/public vẫn còn drift (${driftedSources.join(", ")}).`,
        summaryEn: `${host} is locked as \`planned_public\` in the continuation board, but build/public sources still drift (${driftedSources.join(", ")}).`,
        evidence: [BOARD_48_PATH, DOC_15_PATH, DOC_32_PATH, SYSTEM_REGISTRY_PATH, APPS_PATH],
        wave: "C",
        surfaceKey: host,
        scope: "continuation",
      }));
    }
  }

  findings.push(...auditRequiredAndBannedText({
    wave: "C",
    surfaceKey: "member_public_home",
    title: "member public home",
    owner: "Team 2 + Team 3",
    content: memberHome,
    filePath: MEMBER_HOME_PATH,
    banned: [
      {
        key: "member_planned_claim_public",
        pattern: "member.vetuonglai.com hiện ở trạng thái Planned",
        summaryVi: "Member public home vẫn còn claim member là Planned trong khi Team 1 đã chốt live core surface.",
        summaryEn: "The member public home still claims member is Planned even though Team 1 has locked the live core surface.",
      },
    ],
  }));

  const recommendation = buildScopedRecommendation(findings);
  return {
    recommendation,
    note: buildScopedNote({
      recommendation,
      findings,
      passVi: "Wave C go: status/copy trên member và core subdomain sources không còn drift với continuation snapshot hiện hành.",
      passEn: "Wave C go: member and core-subdomain status/copy sources no longer drift from the current continuation snapshot.",
      prefixVi: "Wave C no-go",
      prefixEn: "Wave C no-go",
    }),
    findings,
    auditedSurfaces: [
      MEMBER_HOME_PATH,
      LIFE_HOME_PATH,
      INVEST_HOME_PATH,
    ],
  };
}

function auditPlannedSafeWave({
  workHome,
  workBrief,
  marketHome,
  marketRules,
  communityHome,
  aiHome,
  businessHome,
}) {
  const findings = [
    ...auditRequiredAndBannedText({
      wave: "D",
      surfaceKey: "work_home",
      title: "WORK home",
      owner: "Team 2 + Team 3",
      content: workHome,
      filePath: WORK_HOME_PATH,
      required: [
        {
          key: "planned_status",
          pattern: /WORK hiện ở trạng thái Planned.*job board đang hoạt động|WORK is currently in Planned status.*live job board/,
          summaryVi: "WORK home đang thiếu disclosure khóa Planned / not-live-job-board.",
          summaryEn: "The WORK home is missing the disclosure that locks it as Planned / not a live job board.",
        },
        {
          key: "no_checkout",
          pattern: /Không có checkout trực tiếp tại app hoặc subdomain này\.|Không có thanh toán trực tiếp tại app hoặc subdomain này\.|Không có thanh toán trực tiếp tại trang này\.|There is no direct payment step on this app or subdomain\.|There is no direct payment step on this page\./,
          summaryVi: "WORK home đang thiếu disclosure chặn checkout trực tiếp.",
          summaryEn: "The WORK home is missing the disclosure that blocks direct checkout.",
        },
        {
          key: "sample_brief_boundary",
          pattern: /brief mẫu, không phải tin đang mở|brief mẫu, không phải listing đang mở|sample brief, not an active listing/,
          summaryVi: "WORK home đang thiếu câu khóa để đọc brief như sample thay vì listing live.",
          summaryEn: "The WORK home is missing the rule that frames the brief as a sample rather than a live listing.",
        },
      ],
    }),
    ...auditRequiredAndBannedText({
      wave: "D",
      surfaceKey: "work_brief",
      title: "WORK brief route",
      owner: "Team 2 + Team 3",
      content: workBrief,
      filePath: WORK_BRIEF_PATH,
      required: [
        {
          key: "scope_and_proof",
          pattern: "Mô tả phạm vi công việc, proof cần có, và kênh xác minh.",
          summaryVi: "WORK brief route đang thiếu câu scope/proof/verification channel.",
          summaryEn: "The WORK brief route is missing the scope/proof/verification-channel disclosure.",
        },
      ],
    }),
    ...auditRequiredAndBannedText({
      wave: "D",
      surfaceKey: "market_home",
      title: "MARKET home",
      owner: "Team 2 + Team 3",
      content: marketHome,
      filePath: MARKET_HOME_PATH,
      required: [
        {
          key: "planned_status",
          pattern: /MARKET đang ở trạng thái Planned.*gian hàng đang hoạt động.*giỏ hàng|MARKET is currently in Planned status.*active storefront.*no cart/,
          summaryVi: "MARKET home đang thiếu disclosure khóa Planned / no-storefront / no-cart.",
          summaryEn: "The MARKET home is missing the Planned / no-storefront / no-cart disclosure.",
        },
        {
          key: "sample_asset_boundary",
          pattern: "Tài sản mẫu chỉ dùng để giải thích cấu trúc, bằng chứng của người tạo và ranh giới disclosure.",
          summaryVi: "MARKET home đang thiếu câu khóa sample-asset boundary.",
          summaryEn: "The MARKET home is missing the sample-asset boundary disclosure.",
        },
        {
          key: "earnings_claim_boundary",
          pattern: /Mọi mô tả về giao dịch, doanh thu hay thu nhập của người tạo đều phải được gắn nhãn mẫu|Mọi claim về giao dịch, doanh thu hay thu nhập của người tạo đều phải gắn nhãn sample|Any description of transactions, revenue, or creator earnings must be labeled as sample content/,
          summaryVi: "MARKET home đang thiếu câu khóa earnings/revenue claim boundary.",
          summaryEn: "The MARKET home is missing the boundary for earnings or revenue claims.",
        },
      ],
    }),
    ...auditRequiredAndBannedText({
      wave: "D",
      surfaceKey: "market_rules",
      title: "MARKET rules route",
      owner: "Team 2 + Team 3",
      content: marketRules,
      filePath: MARKET_RULES_PATH,
      required: [
        {
          key: "transparency_rules",
          pattern: "Quy ước minh bạch và chống lời hứa ảo.",
          summaryVi: "MARKET rules route đang thiếu câu khóa minh bạch/chống lời hứa ảo.",
          summaryEn: "The MARKET rules route is missing the transparency / anti-fake-promise lock.",
        },
      ],
    }),
  ];

  for (const [surfaceKey, title, filePath, content] of [
    ["community_home", "COMMUNITY home", COMMUNITY_HOME_PATH, communityHome],
    ["ai_home", "AI home", AI_HOME_PATH, aiHome],
    ["business_home", "BUSINESS home", BUSINESS_HOME_PATH, businessHome],
  ]) {
    if (!content) {
      findings.push(makeFinding({
        key: `${surfaceKey}_not_shipped`,
        title: `${title} planned-safe shell has not been shipped yet`,
        severity: "P1",
        owner: "Team 1 + Team 2 + Team 4",
        stopLine: false,
        summaryVi: `${title} chưa có planned-safe shell trong dist, nên Team 3 không thể phát hành wave rollout cho cụm domain này.`,
        summaryEn: `${title} does not have a planned-safe shell in dist yet, so Team 3 cannot release the rollout wave for this domain cluster.`,
        evidence: [filePath],
        wave: "D",
        surfaceKey,
        scope: "continuation",
      }));
    }
  }

  const recommendation = buildScopedRecommendation(findings);
  return {
    scope: "local_wording_only",
    recommendation,
    note: buildScopedNote({
      recommendation,
      findings,
      passVi: "Wave D local wording pass: work/market/community/ai/business đang giữ planned-safe wording đúng và shell hiện hành đã đủ để Team 3 audit tiếp.",
      passEn: "Wave D local wording pass: WORK, MARKET, COMMUNITY, AI, and BUSINESS keep the right planned-safe wording, and the current shells are present for Team 3 audits.",
      prefixVi: "Wave D local wording no-go",
      prefixEn: "Wave D local wording no-go",
    }),
    findings,
    auditedSurfaces: [
      WORK_HOME_PATH,
      WORK_BRIEF_PATH,
      MARKET_HOME_PATH,
      MARKET_RULES_PATH,
      COMMUNITY_HOME_PATH,
      AI_HOME_PATH,
      BUSINESS_HOME_PATH,
    ],
  };
}

function auditPaymentLiveWording({
  hubHome,
  vcHome,
  memberHome,
  lifeHome,
  investHome,
  workHome,
  marketHome,
  communityHome,
  aiHome,
  businessHome,
}) {
  const findings = [];
  const surfaces = [
    { key: "hub_home", title: "HUB home", path: HUB_HOME_PATH, content: hubHome },
    { key: "vc_home", title: "VC home", path: VC_HOME_PATH, content: vcHome },
    { key: "member_home", title: "MEMBER home", path: MEMBER_HOME_PATH, content: memberHome },
    { key: "life_home", title: "LIFE home", path: LIFE_HOME_PATH, content: lifeHome },
    { key: "invest_home", title: "INVEST home", path: INVEST_HOME_PATH, content: investHome },
    { key: "work_home", title: "WORK home", path: WORK_HOME_PATH, content: workHome },
    { key: "market_home", title: "MARKET home", path: MARKET_HOME_PATH, content: marketHome },
    { key: "community_home", title: "COMMUNITY home", path: COMMUNITY_HOME_PATH, content: communityHome },
    { key: "ai_home", title: "AI home", path: AI_HOME_PATH, content: aiHome },
    { key: "business_home", title: "BUSINESS home", path: BUSINESS_HOME_PATH, content: businessHome },
  ];

  const bannedPatterns = [
    /payment ready/i,
    /payment email live/i,
    /checkout live/i,
    /payment production-ready/i,
    /unlock\s*\/\s*payment fulfillment complete/i,
    /thanh to[aá]n live/i,
    /checkout d[aã] live/i,
    /s[aă]n s[aà]ng thanh to[aá]n production/i,
  ];

  const paymentMentionPattern = /(payment|checkout|thanh to[aá]n)/i;
  const qualifierPattern = /(assignment active|live blocked|kh[oô]ng c[oó] thanh to[aá]n tr[uự]c ti[eế]p|kh[oô]ng c[oó] checkout tr[uự]c ti[eế]p|kh[oô]ng đi qua checkout|no direct payment step|without passing through checkout)/i;

  for (const surface of surfaces) {
    const content = String(surface.content || "");
    if (!content) {
      continue;
    }

    for (const pattern of bannedPatterns) {
      if (!pattern.test(content)) {
        continue;
      }
      findings.push(makeFinding({
        key: `${surface.key}_payment_live_claim`,
        title: `${surface.title} still contains payment-live claim wording`,
        severity: "P1",
        owner: "Team 2 + Team 3",
        stopLine: true,
        summaryVi: `${surface.title} đang có wording khiến người đọc hiểu nhầm payment hoặc checkout đã live. Team 3 phải chặn theo gate payment mới nhất.`,
        summaryEn: `${surface.title} still carries wording that implies payment or checkout is live. Team 3 must block this under the latest payment gate.`,
        evidence: [surface.path],
        wave: "E",
        surfaceKey: surface.key,
        scope: "payment_copy_gate",
      }));
      break;
    }

    if (paymentMentionPattern.test(content) && !qualifierPattern.test(content)) {
      findings.push(makeFinding({
        key: `${surface.key}_payment_wording_missing_qualifier`,
        title: `${surface.title} mentions payment without safe qualifier`,
        severity: "P2",
        owner: "Team 2 + Team 3",
        stopLine: false,
        summaryVi: `${surface.title} có nhắc payment hoặc checkout nhưng chưa thấy qualifier an toàn kiểu \`assignment active / live blocked\` hoặc \`không có thanh toán trực tiếp\`.`,
        summaryEn: `${surface.title} mentions payment or checkout without a safe qualifier such as \`assignment active / live blocked\` or \`no direct payment step\`.`,
        evidence: [surface.path],
        wave: "E",
        surfaceKey: surface.key,
        scope: "payment_copy_gate",
      }));
    }
  }

  const recommendation = buildScopedRecommendation(findings);
  return {
    recommendation,
    note: buildScopedNote({
      recommendation,
      findings,
      passVi: "Payment wording gate pass: chưa thấy claim `payment/checkout live` trên các surface đã audit.",
      passEn: "Payment wording gate pass: no `payment/checkout live` claim is present on the audited surfaces.",
      prefixVi: "Payment wording gate no-go",
      prefixEn: "Payment wording gate no-go",
    }),
    findings,
    auditedSurfaces: surfaces.map((surface) => surface.path),
  };
}

function auditReadPlannedPublicWording({ readHomeSource }) {
  const findings = [];
  const content = String(readHomeSource || "");

  if (!content) {
    findings.push(makeFinding({
      key: "read_home_source_missing",
      title: "READ home source is missing",
      severity: "P1",
      owner: "Team 1 + Team 2 + Team 3",
      stopLine: false,
      summaryVi: "Chưa tìm thấy source của READ homepage để Team 3 audit wording planned_public.",
      summaryEn: "The READ homepage source is missing, so Team 3 cannot audit planned_public wording.",
      evidence: [READ_HOME_SOURCE_PATH],
      wave: "READ-P1",
      surfaceKey: "read_home_source",
      scope: "read_planned_public",
    }));
    return {
      recommendation: buildScopedRecommendation(findings),
      note: buildScopedNote({
        recommendation: buildScopedRecommendation(findings),
        findings,
        passVi: "READ Phase 1 wording pass: source homepage giữ đúng planned_public wording.",
        passEn: "READ Phase 1 wording pass: the source homepage keeps correct planned_public wording.",
        prefixVi: "READ Phase 1 wording no-go",
        prefixEn: "READ Phase 1 wording no-go",
      }),
      findings,
      auditedSurfaces: [READ_HOME_SOURCE_PATH],
    };
  }

  const requiredPatterns = [
    /planned_public/i,
    /Chưa bán, chưa nhận đóng góp|Not selling, not accepting contributions yet/i,
  ];
  const bannedPatterns = [
    /mở cho mọi thành viên đóng góp/i,
    /đều có thể kiếm tiền/i,
    /public ledger có thể verify|public ledger có thể kiểm chứng/i,
    /đang trả creator/i,
    /creator economy minh bạch hoàn toàn/i,
  ];

  for (const pattern of requiredPatterns) {
    if (!pattern.test(content)) {
      findings.push(makeFinding({
        key: `read_home_missing_${String(pattern)}`,
        title: "READ home is missing required planned_public disclosure",
        severity: "P1",
        owner: "Team 2 + Team 3",
        stopLine: false,
        summaryVi: "READ homepage source đang thiếu disclosure bắt buộc cho stage planned_public.",
        summaryEn: "The READ homepage source is missing a required disclosure for the planned_public stage.",
        evidence: [READ_HOME_SOURCE_PATH],
        wave: "READ-P1",
        surfaceKey: "read_home_source",
        scope: "read_planned_public",
      }));
    }
  }

  for (const pattern of bannedPatterns) {
    if (pattern.test(content)) {
      findings.push(makeFinding({
        key: `read_home_banned_${String(pattern)}`,
        title: "READ home still contains banned monetization wording",
        severity: "P1",
        owner: "Team 2 + Team 3",
        stopLine: true,
        summaryVi: "READ homepage source vẫn có wording monetization vượt stage planned_public.",
        summaryEn: "The READ homepage source still contains monetization wording beyond the planned_public stage.",
        evidence: [READ_HOME_SOURCE_PATH],
        wave: "READ-P1",
        surfaceKey: "read_home_source",
        scope: "read_planned_public",
      }));
    }
  }

  const recommendation = buildScopedRecommendation(findings);
  return {
    recommendation,
    note: buildScopedNote({
      recommendation,
      findings,
      passVi: "READ Phase 1 wording pass: source homepage giữ đúng planned_public wording.",
      passEn: "READ Phase 1 wording pass: the source homepage keeps correct planned_public wording.",
      prefixVi: "READ Phase 1 wording no-go",
      prefixEn: "READ Phase 1 wording no-go",
    }),
    findings,
    auditedSurfaces: [READ_HOME_SOURCE_PATH],
  };
}

function auditWaveDPublicPublishGate({ board48, waveDBlockers }) {
  const blockersActive = (
    board48.includes("Trạng thái: `active_next / local_ready / dns_blocked`")
    || waveDBlockers.includes("public runtime vẫn `dns_blocked`")
    || waveDBlockers.includes("- `public_publish_ready`: chưa đúng")
    || waveDBlockers.includes("Nút thắt còn lại là `DNS + runtime publish`")
  );

  const recommendation = blockersActive ? "no_go" : "go";
  return {
    recommendation,
    note: recommendation === "go"
      ? {
          vi: "Wave D go: public DNS, runtime publish, và Team 5 live verify đều đã xanh.",
          en: "Wave D go: public DNS, runtime publish, and Team 5 live verification are all green.",
        }
      : {
          vi: "Wave D no-go: planned-safe wording local đã sạch, nhưng public rollout vẫn bị chặn bởi DNS/runtime publish theo board active.",
          en: "Wave D no-go: the local planned-safe wording is clean, but the public rollout remains blocked by DNS/runtime publish in the active board.",
        },
    evidence: [
      BOARD_48_PATH,
      WAVE_D_BLOCKERS_PATH,
    ],
  };
}

function buildWaveNotes({
  coreRecommendation,
  mobileAudit,
  waveCAudit,
  plannedSafeAudit,
  waveDPublicGate,
}) {
  const waveANote = coreRecommendation === "go"
    ? {
        wave: "A",
        recommendation: "go",
        note: {
          vi: "Wave A go: core live stabilization vẫn xanh theo verify hiện tại của Team 3.",
          en: "Wave A go: core live stabilization stays green under the current Team 3 verification set.",
        },
      }
    : {
        wave: "A",
        recommendation: coreRecommendation,
        note: {
          vi: "Wave A không thể chốt go vì core parity hiện tại chưa sạch hoàn toàn.",
          en: "Wave A cannot be closed as go because current core parity is not fully clean.",
        },
      };

  let waveDRecommendation = "go";
  let waveDNote = {
    vi: "Wave D go: planned-safe wording sạch và public publish gate đã xanh.",
    en: "Wave D go: the planned-safe wording is clean and the public publish gate is green.",
  };

  if (plannedSafeAudit.recommendation !== "go") {
    waveDRecommendation = "no_go";
    waveDNote = {
      vi: plannedSafeAudit.note.vi,
      en: plannedSafeAudit.note.en,
    };
  } else if (waveDPublicGate.recommendation !== "go") {
    waveDRecommendation = "no_go";
    waveDNote = waveDPublicGate.note;
  }

  const waveERecommendation = "no_go";

  const waveENote = waveDRecommendation === "go"
    ? {
        vi: "Wave E no-go: gói release/QA/Ops cuối wave vẫn chưa được chốt ở lượt này, nên chưa thể phát hành signoff toàn hệ.",
        en: "Wave E no-go: the final release/QA/Ops pack is not closed in this pass, so the system-wide signoff cannot ship yet.",
      }
    : {
        vi: "Wave E no-go: Wave D còn đang bị chặn ở DNS/runtime publish và pack signoff cuối chưa được khóa.",
        en: "Wave E no-go: Wave D is still blocked on DNS/runtime publish and the final signoff pack is not locked yet.",
      };

  return [
    waveANote,
    {
      wave: "B",
      recommendation: mobileAudit.recommendation,
      note: mobileAudit.note,
    },
    {
      wave: "C",
      recommendation: waveCAudit.recommendation,
      note: waveCAudit.note,
    },
    {
      wave: "D",
      recommendation: waveDRecommendation,
      note: waveDNote,
    },
    {
      wave: "E",
      recommendation: waveERecommendation,
      note: waveENote,
    },
  ];
}

async function main() {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const stepResults = [];

  for (const step of steps) {
    stepResults.push(await runStep(step));
  }

  const [
    doc15,
    doc32,
    board39,
    board48,
    waveDBlockers,
    team3Plan,
    withdrawnProtocol,
    memberSecretChecklist,
    systemRegistry,
    appsCatalog,
    team3PolicyMatrix,
    runtimeTruth,
    workersConfig,
    localeRegistry,
    languageCodex,
    viContent,
    enContent,
    hubHome,
    vcHome,
    memberHome,
    lifeHome,
    investHome,
    memberAppHome,
    memberAppOffline,
    workHome,
    workBrief,
    marketHome,
    marketRules,
    communityHome,
    aiHome,
    businessHome,
    readHomeSource,
  ] = await Promise.all([
    readFile(DOC_15_PATH, "utf8"),
    readFile(DOC_32_PATH, "utf8"),
    readFile(BOARD_39_PATH, "utf8"),
    readFile(BOARD_48_PATH, "utf8"),
    readFile(WAVE_D_BLOCKERS_PATH, "utf8"),
    readFile(TEAM3_PLAN_PATH, "utf8"),
    readFile(WITHDRAWN_PROTOCOL_PATH, "utf8"),
    readFile(MEMBER_SECRET_CHECKLIST_PATH, "utf8"),
    readFile(SYSTEM_REGISTRY_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(APPS_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(TEAM3_POLICY_MATRIX_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(RUNTIME_TRUTH_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(WORKERS_PROJECTS_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(LOCALE_REGISTRY_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(LANGUAGE_CODEX_PATH, "utf8"),
    readFile(VI_CONTENT_PATH, "utf8").then((value) => JSON.parse(value)),
    readFile(EN_CONTENT_PATH, "utf8").then((value) => JSON.parse(value)),
    readOptionalText(HUB_HOME_PATH),
    readOptionalText(VC_HOME_PATH),
    readOptionalText(MEMBER_HOME_PATH),
    readOptionalText(LIFE_HOME_PATH),
    readOptionalText(INVEST_HOME_PATH),
    readOptionalText(MEMBER_APP_HOME_PATH),
    readOptionalText(MEMBER_APP_OFFLINE_PATH),
    readOptionalText(WORK_HOME_PATH),
    readOptionalText(WORK_BRIEF_PATH),
    readOptionalText(MARKET_HOME_PATH),
    readOptionalText(MARKET_RULES_PATH),
    readOptionalText(COMMUNITY_HOME_PATH),
    readOptionalText(AI_HOME_PATH),
    readOptionalText(BUSINESS_HOME_PATH),
    readOptionalText(READ_HOME_SOURCE_PATH),
  ]);

  const doc15Map = parseDoc15StatusMap(doc15);
  const doc32Map = parseDoc32StatusMap(doc32);

  const findings = [
    ...auditSuiteResults(stepResults),
    ...auditBoardAndProtocol({ board39, team3Plan, withdrawnProtocol }),
    ...auditStatusModel({
      doc15Map,
      doc32Map,
      systemRegistry,
    }),
    ...auditPolicyMatrix(team3PolicyMatrix),
    ...auditLaunchGate(runtimeTruth, systemRegistry),
    ...auditMemberCutoverContract({ workersConfig, checklistMarkdown: memberSecretChecklist }),
    ...auditLanguageLock({ localeRegistry, languageCodex }),
  ];

  if (!viContent?.shared || !enContent?.shared) {
    findings.push(makeFinding({
      key: "content_pairs_missing_shared_root",
      title: "Shared content trees are incomplete",
      severity: "P1",
      owner: "Team 2 + Team 3",
      stopLine: true,
      summaryVi: "Cặp nguồn nội dung vi/en đang thiếu root `shared`, dễ làm drift wording ở CTA/disclosure.",
      summaryEn: "The vi/en content pair is missing the `shared` root, which risks CTA/disclosure wording drift.",
      evidence: [VI_CONTENT_PATH, EN_CONTENT_PATH],
    }));
  }

  const recommendation = buildRecommendation(findings, stepResults);
  const note = buildHumanNote(recommendation, findings);
  const stepSummary = summarizeStepResults(stepResults);
  const mobileAudit = auditMobileTrustSurfaces({
    memberAppHome,
    memberAppOffline,
  });
  const waveCAudit = auditCoreSubdomainWave({
    board48,
    doc15Map,
    doc32Map,
    systemRegistry,
    appsCatalog,
    memberHome,
  });
  const plannedSafeAudit = auditPlannedSafeWave({
    workHome,
    workBrief,
    marketHome,
    marketRules,
    communityHome,
    aiHome,
    businessHome,
  });
  const paymentWordingAudit = auditPaymentLiveWording({
    hubHome,
    vcHome,
    memberHome,
    lifeHome,
    investHome,
    workHome,
    marketHome,
    communityHome,
    aiHome,
    businessHome,
  });
  const readPlannedPublicAudit = auditReadPlannedPublicWording({
    readHomeSource,
  });
  findings.push(...paymentWordingAudit.findings);
  findings.push(...readPlannedPublicAudit.findings);
  const waveDPublicGate = auditWaveDPublicPublishGate({
    board48,
    waveDBlockers,
  });
  const waveNotes = buildWaveNotes({
    coreRecommendation: recommendation,
    mobileAudit,
    waveCAudit,
    plannedSafeAudit,
    waveDPublicGate,
  });
  const endedAt = new Date().toISOString();
  const report = {
    summary: {
      recommendation,
      stopLineOpen: findings.some((finding) => finding.stopLine),
      highestSeverity: highestSeverity(findings),
      startedAt,
      endedAt,
      durationMs: Date.now() - startedMs,
      suite: stepSummary,
    },
    note,
    memberCutover: buildMemberCutoverDetails({
      runtimeTruth,
      workersConfig,
      checklistMarkdown: memberSecretChecklist,
    }),
    continuationAudit: {
      board: BOARD_48_PATH,
      mobile: mobileAudit,
      waveC: waveCAudit,
      plannedSafe: plannedSafeAudit,
      paymentWording: paymentWordingAudit,
      readPlannedPublic: readPlannedPublicAudit,
      waveDPublicRollout: waveDPublicGate,
      waveNotes,
    },
    stepResults,
    findings,
  };

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Team 3 parity summary");
  console.log(JSON.stringify(report.summary, null, 2));
  console.log("Team 3 parity note");
  console.log(JSON.stringify(note, null, 2));

  if (findings.length > 0) {
    console.log("Team 3 findings");
    console.log(JSON.stringify(findings, null, 2));
  }

  if (recommendation !== "go") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
