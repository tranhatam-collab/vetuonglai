#!/usr/bin/env node
// auto-dev-loop.mjs — 1 tick.
// Chạy bởi launchd mỗi 9 phút. Tự thoát sau khi xong tick.
//
// QUY TẮC AN TOÀN CỨNG:
// - Working tree DIRTY → ABORT (không đụng WIP của founder)
// - Mỗi handler có whitelist riêng. Không match → escalate, không tự sáng tạo.
// - Mọi commit do loop tạo có prefix [auto-dev-loop] để dễ revert.
// - 5 fail liên tiếp cùng handler → quarantine handler đó.
// - 2 tick sạch liên tiếp → tự xoá launchd job.
// - File .autodev/STOP tồn tại → exit ngay.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const STATE_PATH = path.join(ROOT, ".autodev/state.json");
const BACKLOG_PATH = path.join(ROOT, ".autodev/backlog.json");
const STOP_PATH = path.join(ROOT, ".autodev/STOP");
const LOG_DIR = path.join(ROOT, ".autodev/logs");
const HANDLER_DIR = path.join(ROOT, ".autodev/handlers");

const HANDLERS = [
  "verifier-flake.mjs",
  "auto-assertion-lock.mjs",
  "scaffold-only.mjs",
  // bilingual.mjs đã viết nhưng luôn escalate, bỏ ra để loop không gọi vô ích.
];

const MAX_HANDLER_FAIL = 5;
const CLEAN_TICKS_TO_STOP = 2;

async function readJson(p, fallback) {
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(p, data) {
  await writeFile(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function appendLog(entry) {
  await mkdir(LOG_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(LOG_DIR, `${date}.jsonl`);
  await writeFile(file, JSON.stringify(entry) + "\n", { flag: "a" });
}

async function gitWorkingTreeClean() {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--porcelain"], { cwd: ROOT });
    // Bỏ qua các pattern noise đã biết: state/backlog/log của loop, audit report regen,
    // reports/*.latest.json regen timestamp.
    const ignorePatterns = [
      /^.M\s+\.autodev\/state\.json/,
      /^.M\s+\.autodev\/backlog\.json/,
      /^.M\s+docs\/00_master\/42_BILINGUAL_AUDIT_REPORT\.md/,
      /^.M\s+reports\/.*\.latest\.json/,
    ];
    const lines = stdout.split("\n").filter(Boolean);
    const significant = lines.filter((l) => !ignorePatterns.some((re) => re.test(l)));
    return significant.length === 0;
  } catch {
    return false;
  }
}

async function resetLoopNoise() {
  // Reset các file noise auto-regen để không lẫn vào commit task.
  const noiseFiles = [
    "docs/00_master/42_BILINGUAL_AUDIT_REPORT.md",
    "reports/read-phase0-readiness.latest.json",
    "reports/read-book-publish-gate.latest.json",
  ];
  for (const f of noiseFiles) {
    try {
      await execFileAsync("git", ["checkout", "--", f], { cwd: ROOT });
    } catch {}
  }
}

async function gateSweep() {
  const gates = [
    ["build", ["npm", ["run", "build"]]],
    ["check", ["npm", ["run", "check"]]],
    ["audit", ["npm", ["run", "audit:bilingual"]]],
  ];
  const results = {};
  for (const [name, [cmd, args]] of gates) {
    try {
      await execFileAsync(cmd, args, { cwd: ROOT, maxBuffer: 16 * 1024 * 1024 });
      results[name] = "pass";
    } catch (e) {
      results[name] = `fail: ${e.message.split("\n")[0]}`;
    }
  }
  return results;
}

async function loadHandler(name) {
  const url = new URL(`../.autodev/handlers/${name}`, import.meta.url);
  return import(url.href);
}

async function shouldStop(state) {
  // STOP file
  try {
    await access(STOP_PATH);
    return { stop: true, reason: "stop_file_present" };
  } catch {}

  // 2 tick sạch liên tiếp
  if (state.consecutive_clean_ticks >= CLEAN_TICKS_TO_STOP) {
    return { stop: true, reason: "two_clean_ticks_in_a_row" };
  }

  // explicit stop_requested
  if (state.stop_requested) {
    return { stop: true, reason: "stop_requested" };
  }

  return { stop: false };
}

async function unloadLaunchd() {
  try {
    await execFileAsync("launchctl", [
      "unload",
      `${process.env.HOME}/Library/LaunchAgents/com.vetuonglai.autodev.plist`,
    ]);
  } catch {}
}

async function pickTask(backlog, state) {
  for (const task of backlog.tasks) {
    if (task.status === "done" || task.status === "blocked") continue;
    if (state.blocked_branches.includes(task.branch)) continue;
    if ((state.consecutive_handler_fail[task.type] || 0) >= MAX_HANDLER_FAIL) continue;
    return task;
  }
  return null;
}

async function commit(message, files) {
  // Persist state/backlog ngay trước khi commit để chúng vào cùng commit task.
  // (Caller phải đảm bảo state/backlog đã được writeJson trước khi gọi.)
  const allFiles = [...new Set([...files, ".autodev/state.json", ".autodev/backlog.json"])];
  await execFileAsync("git", ["add", ...allFiles], { cwd: ROOT });
  await execFileAsync("git", ["commit", "-m", `[auto-dev-loop] ${message}`], { cwd: ROOT });
}

async function main() {
  const tickStart = Date.now();
  const tickIso = new Date().toISOString();

  const state = await readJson(STATE_PATH, {
    version: 1,
    started_at: tickIso,
    last_tick_at: null,
    tick_count: 0,
    consecutive_clean_ticks: 0,
    consecutive_handler_fail: {},
    blocked_branches: [],
    stop_requested: false,
    stopped_at: null,
    stopped_reason: null,
  });
  if (!state.started_at) state.started_at = tickIso;

  const stopCheck = await shouldStop(state);
  if (stopCheck.stop) {
    state.stopped_at = tickIso;
    state.stopped_reason = stopCheck.reason;
    await writeJson(STATE_PATH, state);
    await appendLog({ tick: state.tick_count, ts: tickIso, event: "stopped", reason: stopCheck.reason });
    await unloadLaunchd();
    console.log(`[auto-dev-loop] stop: ${stopCheck.reason}`);
    return;
  }

  state.tick_count += 1;
  state.last_tick_at = tickIso;
  const tickN = state.tick_count;

  // Check working tree
  if (!(await gitWorkingTreeClean())) {
    await appendLog({ tick: tickN, ts: tickIso, event: "abort", reason: "working_tree_dirty" });
    await writeJson(STATE_PATH, state);
    console.log(`[auto-dev-loop] tick ${tickN}: ABORT (working tree dirty)`);
    return;
  }

  // Gate sweep
  const gates = await gateSweep();
  await appendLog({ tick: tickN, ts: tickIso, event: "gate_sweep", gates });

  // Reset noise file (audit report timestamp, reports/*.latest.json) sau gate sweep
  // để không lẫn vào commit task.
  await resetLoopNoise();

  const allGreen = Object.values(gates).every((v) => v === "pass");

  // Backlog
  const backlog = await readJson(BACKLOG_PATH, { version: 1, tasks: [] });
  let didWork = false;
  let workSummary = null;

  // Nếu có gate fail → ưu tiên gọi handler liên quan
  if (!allGreen) {
    if (gates.audit && gates.audit !== "pass") {
      // Bilingual fail — không có handler an toàn, escalate
      await appendLog({
        tick: tickN,
        ts: tickIso,
        event: "escalate",
        reason: "audit_bilingual_failed_no_safe_handler",
        gates,
      });
    }
    if (gates.check && gates.check !== "pass") {
      await appendLog({
        tick: tickN,
        ts: tickIso,
        event: "escalate",
        reason: "check_failed_no_safe_handler",
        gates,
      });
    }
    if (gates.build && gates.build !== "pass") {
      await appendLog({
        tick: tickN,
        ts: tickIso,
        event: "escalate",
        reason: "build_failed_no_safe_handler",
        gates,
      });
    }
    state.consecutive_clean_ticks = 0;
  }

  // Verifier flake handler chạy mỗi tick (nó tự detect)
  if (allGreen) {
    try {
      const mod = await loadHandler("verifier-flake.mjs");
      const det = await mod.detect();
      if (det.applicable) {
        const result = await mod.fix();
        await appendLog({ tick: tickN, ts: tickIso, event: "handler", id: mod.id, result });
        if (result.fixed && result.commit && result.files_to_stage?.length) {
          if (await gitWorkingTreeClean()) {
            // skip — không gì để commit
          } else {
            didWork = true;
            workSummary = "regen_reports";
            await writeJson(BACKLOG_PATH, backlog);
            await writeJson(STATE_PATH, state);
            await commit(`regen reports (verifier-flake)`, result.files_to_stage);
          }
        }
      }
    } catch (e) {
      await appendLog({ tick: tickN, ts: tickIso, event: "handler_error", id: "verifier-flake", error: e.message });
      state.consecutive_handler_fail["verifier-flake"] = (state.consecutive_handler_fail["verifier-flake"] || 0) + 1;
    }
  }

  // Auto-assertion-lock: detect-only, ghi proposal
  if (allGreen) {
    try {
      const mod = await loadHandler("auto-assertion-lock.mjs");
      const det = await mod.detect();
      if (det.applicable) {
        const result = await mod.fix();
        await appendLog({ tick: tickN, ts: tickIso, event: "handler", id: mod.id, result });
        // proposal-only, không commit
      }
    } catch (e) {
      await appendLog({ tick: tickN, ts: tickIso, event: "handler_error", id: "auto-assertion-lock", error: e.message });
    }
  }

  // Pick 1 task scaffold-only
  if (allGreen && !didWork) {
    const task = await pickTask(backlog, state);
    if (task && task.type === "scaffold-only") {
      try {
        const mod = await loadHandler("scaffold-only.mjs");
        const det = await mod.detect(task);
        if (det.applicable) {
          const result = await mod.fix(task);
          await appendLog({ tick: tickN, ts: tickIso, event: "handler", id: mod.id, task: task.id, result });
          if (result.fixed && result.commit) {
            // Mutate state/backlog TRƯỚC khi persist + commit để chúng cùng vào commit.
            task.status = "done";
            didWork = true;
            workSummary = `scaffold_${task.id}`;
            if (result.branch_blocked_after) {
              if (!state.blocked_branches.includes(task.branch)) {
                state.blocked_branches.push(task.branch);
              }
            }
            await writeJson(BACKLOG_PATH, backlog);
            await writeJson(STATE_PATH, state);
            await commit(result.commit_message.split("\n")[0].replace("[auto-dev-loop] ", ""), result.files_to_stage);
          }
        } else {
          // không applicable → đánh dấu skipped
          task.status = "skipped";
          task.skipped_reason = det.reason;
          await appendLog({ tick: tickN, ts: tickIso, event: "task_skipped", task: task.id, reason: det.reason });
        }
      } catch (e) {
        await appendLog({ tick: tickN, ts: tickIso, event: "handler_error", id: "scaffold-only", task: task.id, error: e.message });
        state.consecutive_handler_fail["scaffold-only"] = (state.consecutive_handler_fail["scaffold-only"] || 0) + 1;
      }
    }
  }

  // Cập nhật consecutive_clean_ticks
  if (allGreen && !didWork) {
    state.consecutive_clean_ticks += 1;
  } else if (didWork) {
    state.consecutive_clean_ticks = 0;
  }

  // Persist
  await writeJson(BACKLOG_PATH, backlog);
  await writeJson(STATE_PATH, state);

  // Nếu tick này không có commit task (didWork=false) nhưng state.json/backlog.json
  // đã thay đổi (tick_count, last_tick_at, consecutive_clean_ticks), tạo 1
  // housekeeping commit để working tree không bị dirty cho tick kế tiếp.
  if (!didWork) {
    try {
      const { stdout } = await execFileAsync("git", ["status", "--porcelain", ".autodev/state.json", ".autodev/backlog.json"], { cwd: ROOT });
      if (stdout.trim().length > 0) {
        await execFileAsync("git", ["add", ".autodev/state.json", ".autodev/backlog.json"], { cwd: ROOT });
        await execFileAsync(
          "git",
          [
            "commit",
            "-m",
            `[auto-dev-loop] housekeeping tick ${tickN} (gates green, no work)`,
          ],
          { cwd: ROOT },
        );
      }
    } catch {}
  }

  const tickDuration = Date.now() - tickStart;
  await appendLog({
    tick: tickN,
    ts: tickIso,
    event: "tick_end",
    all_green: allGreen,
    did_work: didWork,
    work_summary: workSummary,
    consecutive_clean_ticks: state.consecutive_clean_ticks,
    duration_ms: tickDuration,
  });

  console.log(
    `[auto-dev-loop] tick ${tickN} done in ${tickDuration}ms — gates: ${JSON.stringify(gates)} — work: ${workSummary || "none"} — clean_streak: ${state.consecutive_clean_ticks}`,
  );

  // Stop nếu đạt
  if (state.consecutive_clean_ticks >= CLEAN_TICKS_TO_STOP) {
    state.stopped_at = new Date().toISOString();
    state.stopped_reason = "two_clean_ticks_in_a_row";
    await writeJson(STATE_PATH, state);
    await unloadLaunchd();
    console.log("[auto-dev-loop] STOP: 2 tick sạch liên tiếp, unload launchd.");
  }
}

main().catch(async (err) => {
  await mkdir(LOG_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  await writeFile(
    path.join(LOG_DIR, `${date}.jsonl`),
    JSON.stringify({ ts: new Date().toISOString(), event: "fatal", error: err.message, stack: err.stack }) + "\n",
    { flag: "a" },
  );
  console.error("[auto-dev-loop] FATAL:", err.message);
  process.exit(1);
});
