// Handler: scaffold-only cho task 1B/1C.
// Tạo file structure + frontmatter + slug placeholder. KHÔNG body.
// File scaffold MẶC ĐỊNH bị block khỏi build (status: "awaiting_founder_manuscript").

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

export const id = "scaffold-only";

const SCAFFOLDS = {
  "scaffold-bai-1": {
    files: [
      {
        path: "content/essays/bai-1-vi-sao-toi-viet-series-nay.json",
        contents: {
          slug: "bai-1-vi-sao-toi-viet-series-nay",
          series_id: "vi-sao-toi-viet",
          number: 1,
          status: "awaiting_founder_manuscript",
          published: false,
          blocks_build: true,
          title_vi: null,
          title_en: null,
          subtitle_vi: null,
          subtitle_en: null,
          body_vi: null,
          body_en: null,
          notes_for_founder:
            "Auto-dev-loop tạo scaffold này. Body do founder Trần Hà Tâm điền. Loop sẽ KHÔNG fabricate.",
          created_by: "auto-dev-loop",
          created_at: null,
        },
      },
    ],
  },
  "scaffold-series-json": {
    files: [
      {
        path: "content/series.json",
        contents: {
          version: 1,
          status: "awaiting_founder_manuscript",
          blocks_build: true,
          notes_for_founder:
            "Auto-dev-loop tạo scaffold rỗng. Founder điền 10 series + 23 slug. Loop KHÔNG fabricate slug.",
          series: [
            {
              id: null,
              title_vi: null,
              title_en: null,
              order: 1,
              articles: [],
            },
          ],
          created_by: "auto-dev-loop",
          created_at: null,
        },
      },
    ],
  },
};

export async function detect(task) {
  if (!task) return { applicable: false };
  const spec = SCAFFOLDS[task.id];
  if (!spec) return { applicable: false, reason: `no_scaffold_spec_for_${task.id}` };

  // Kiểm tra file đã tồn tại chưa
  for (const f of spec.files) {
    try {
      await access(f.path);
      return { applicable: false, reason: `${f.path}_already_exists` };
    } catch {
      // không tồn tại → tốt, có thể scaffold
    }
  }
  return { applicable: true, spec };
}

export async function fix(task) {
  const detection = await detect(task);
  if (!detection.applicable) {
    return { fixed: false, reason: detection.reason };
  }

  const created = [];
  for (const f of detection.spec.files) {
    const dir = path.dirname(f.path);
    await mkdir(dir, { recursive: true });
    const payload = { ...f.contents, created_at: new Date().toISOString() };
    await writeFile(f.path, JSON.stringify(payload, null, 2) + "\n", "utf8");
    created.push(f.path);
  }

  return {
    fixed: true,
    reason: "scaffold_created_awaiting_founder",
    commit: true,
    files_to_stage: created,
    commit_message: [
      `chore(auto-dev): scaffold ${task.id} (awaiting founder manuscript)`,
      "",
      "Auto-dev-loop tạo file structure cho task content. KHÔNG body.",
      "status: awaiting_founder_manuscript",
      "blocks_build: true",
      "",
      "Founder Trần Hà Tâm điền nội dung. Loop KHÔNG fabricate.",
      `Files: ${created.join(", ")}`,
    ].join("\n"),
    branch_blocked_after: true, // sau khi scaffold xong, branch này chờ founder
    blocked_reason: "BLOCKED_NEED_FOUNDER",
  };
}
