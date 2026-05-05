// Handler: retry verifier flake. Đây là handler an toàn nhất.
// Rerun verify:read:phase0 --live + smoke:access-runtime nếu báo cáo gần đây fail.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const execFileAsync = promisify(execFile);

export const id = "verifier-flake";

export async function detect() {
  // Đọc reports/read-phase0-readiness.latest.json
  try {
    const raw = await readFile("reports/read-phase0-readiness.latest.json", "utf8");
    const data = JSON.parse(raw);
    if (data.allPass === true) {
      return { applicable: false, reason: "phase0_already_green" };
    }
    return { applicable: true, reason: "phase0_not_green", data };
  } catch (e) {
    return { applicable: true, reason: "report_missing_or_unreadable", error: e.message };
  }
}

export async function fix() {
  // Bước 1: rerun phase0 không live
  try {
    await execFileAsync("npm", ["run", "verify:read:phase0"], { maxBuffer: 8 * 1024 * 1024 });
  } catch (e) {
    return { fixed: false, escalate: true, reason: "phase0_dry_failed", detail: e.message };
  }

  // Bước 2: rerun phase0 --live
  try {
    await execFileAsync("npm", ["run", "verify:read:phase0", "--", "--live"], {
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (e) {
    return { fixed: false, escalate: true, reason: "phase0_live_failed", detail: e.message };
  }

  // Bước 3: smoke
  try {
    await execFileAsync("npm", ["run", "smoke:access-runtime"], {
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (e) {
    return { fixed: false, escalate: true, reason: "smoke_failed", detail: e.message };
  }

  return {
    fixed: true,
    reason: "verifiers_now_green",
    commit: false, // chỉ regen reports, để loop tự quyết có commit reports/ hay không
    files_to_stage: [
      "reports/read-phase0-readiness.latest.json",
      "reports/read-book-publish-gate.latest.json",
    ],
  };
}
