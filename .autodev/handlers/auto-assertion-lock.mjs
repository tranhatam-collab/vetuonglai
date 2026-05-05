// Handler: scan dist/ tìm marker data-* chưa có assertion trong scripts/check.mjs.
// CHỈ thêm assertion mới — không xoá, không sửa assertion cũ.

import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const id = "auto-assertion-lock";

const TRACKED_ATTRS = [
  "data-compliance",
  "data-product",
  "data-region",
  "data-tiers",
];

export async function detect() {
  const checkSrc = await readFile("scripts/check.mjs", "utf8");
  const html = await readFile("dist/vetuonglai.com/index.html", "utf8");

  const newMarkers = [];
  for (const attr of TRACKED_ATTRS) {
    const re = new RegExp(`${attr}="([^"]+)"`, "g");
    let m;
    const seen = new Set();
    while ((m = re.exec(html)) !== null) {
      const marker = `${attr}="${m[1]}"`;
      if (seen.has(marker)) continue;
      seen.add(marker);
      if (!checkSrc.includes(marker)) {
        newMarkers.push(marker);
      }
    }
  }

  if (newMarkers.length === 0) return { applicable: false };
  return { applicable: true, newMarkers };
}

export async function fix() {
  const detection = await detect();
  if (!detection.applicable) return { fixed: false, reason: "nothing_to_lock" };

  // ESCALATE: tự sửa check.mjs là rủi ro. Chỉ tạo file đề xuất, KHÔNG tự edit.
  const proposal = {
    timestamp: new Date().toISOString(),
    new_markers_detected: detection.newMarkers,
    suggested_block: [
      "// Đề xuất từ auto-dev-loop:",
      "  assertIncludesAll(hubHtml, 'Auto-detected markers', [",
      ...detection.newMarkers.map((m) => `    '${m.replace(/'/g, "\\'")}',`),
      "  ]);",
    ].join("\n"),
  };

  await writeFile(
    ".autodev/proposals/check-assertion-additions.json",
    JSON.stringify(proposal, null, 2) + "\n",
    "utf8",
  ).catch(async () => {
    await execFileAsync("mkdir", ["-p", ".autodev/proposals"]);
    await writeFile(
      ".autodev/proposals/check-assertion-additions.json",
      JSON.stringify(proposal, null, 2) + "\n",
      "utf8",
    );
  });

  return {
    fixed: false,
    escalate: true,
    reason: "proposal_written_for_human_review",
    detail: `${detection.newMarkers.length} marker mới phát hiện. Xem .autodev/proposals/check-assertion-additions.json`,
  };
}
