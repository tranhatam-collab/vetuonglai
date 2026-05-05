// Handler: vá bilingual mixed-language-pair đã biết pattern.
// Pattern duy nhất được tự sửa: VI side trùng hệt EN side trong cùng pair attribute.
// Mọi pattern khác → soft-fail và escalate (tạo BLOCKED_NEED_HUMAN).

import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const id = "bilingual-mixed-pair";

export async function detect() {
  // Chạy audit script, parse output, tìm vetuonglai.com/index.html mixed-language-pair.
  try {
    const { stdout } = await execFileAsync("npm", ["run", "audit:bilingual"], {
      maxBuffer: 8 * 1024 * 1024,
    });
    const m = stdout.match(/(\d+) issues across/);
    if (!m) return { applicable: false };
    const count = Number(m[1]);
    if (count === 0) return { applicable: false };
    return { applicable: true, count, raw: stdout };
  } catch (e) {
    return { applicable: false, error: e.message };
  }
}

export async function fix() {
  // Đọc bilingual report, tìm file vi phạm, scan trong dist/* tìm pair có VI === EN literal,
  // backtrack về scripts/build.mjs hoặc content/*.json.
  // Hiện tại chỉ handle case "VI === EN literal" — đó là pattern an toàn duy nhất.
  const reportPath = "docs/00_master/42_BILINGUAL_AUDIT_REPORT.md";
  const report = await readFile(reportPath, "utf8").catch(() => "");
  if (!report.includes("mixed-language-pair")) {
    return { fixed: false, reason: "no_mixed_language_pair_in_report" };
  }

  // Scan tất cả dist/*/index.html
  const { stdout } = await execFileAsync("find", [
    "dist",
    "-type",
    "f",
    "-name",
    "*.html",
  ]);
  const files = stdout.trim().split("\n").filter(Boolean);

  const VI_DIACRITIC = /[ăâđêôơưĂÂĐÊÔƠƯáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/;
  const EN_FN = /\b(the|and|or|but|of|with|for|not|is|are|will|in|on|at|by|to|from|a|an)\b/i;
  const BRANDS = ["Về Tương Lai", "Vetuonglai", "VTL", "EDU", "VC", "PWA", "OG"];
  const strip = (t) => BRANDS.reduce((a, b) => a.split(b).join(""), t);

  const offenders = [];
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const re = /data-(content|text|html|aria-label)-vi="([^"]+)"\s+data-\1-en="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      const vi = strip(m[2]);
      const en = strip(m[3]);
      if (!vi || !en) continue;
      // Pattern an toàn: VI === EN literal
      if (m[2] === m[3] && EN_FN.test(vi) && !VI_DIACRITIC.test(vi)) {
        offenders.push({ file, attr: m[1], vi: m[2], en: m[3] });
      }
    }
  }

  if (offenders.length === 0) {
    return {
      fixed: false,
      reason: "no_safe_pattern_match",
      escalate: true,
      detail: "Có bilingual issue nhưng không match pattern 'VI === EN literal'. Cần human review.",
    };
  }

  // Có match → escalate luôn vì sửa source map từ dist về build.mjs/content/*.json
  // không an toàn để loop tự làm. Ghi snapshot và yêu cầu human.
  return {
    fixed: false,
    reason: "needs_human_source_mapping",
    escalate: true,
    detail: `Phát hiện ${offenders.length} pair VI===EN literal. Cần human map về source. Offenders: ${JSON.stringify(offenders.slice(0, 3))}`,
  };
}
