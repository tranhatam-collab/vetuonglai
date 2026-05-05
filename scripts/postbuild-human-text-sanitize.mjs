import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(ROOT, "dist");

const PROTECTED_BLOCK_RE = /<(script|style|pre|code|textarea)\b[\s\S]*?<\/\1>/gi;
const TEXT_ATTR_NAMES = new Set([
  "alt",
  "title",
  "aria-label",
  "data-aria-label-vi",
  "data-aria-label-en",
  "data-text-vi",
  "data-text-en",
  "data-html-vi",
  "data-html-en",
  "data-content-vi",
  "data-content-en",
  "data-vi",
  "data-en",
  "data-vi-title",
  "data-en-title",
]);
const META_TEXT_KEYS = new Set([
  "description",
  "og:title",
  "og:description",
  "og:image:alt",
  "twitter:title",
  "twitter:description",
]);

async function fileExists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await collectHtmlFiles(full));
      continue;
    }
    if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function sanitizeHumanText(value = "") {
  return String(value)
    .replace(/\uFE0F/g, "")
    .replace(/\u{1F1FB}\u{1F1F3}|\u{1F1FA}\u{1F1F8}/gu, " ")
    .replace(/[\u2728\u{1F680}\u{1F525}\u{1F4A5}\u{2B50}\u2705\u274C\u26A0\u{1F517}]/gu, " ")
    .replace(/[★☆◆◇●○■□♦]/gu, " ")
    .replace(/[—–−]/g, " - ")
    .replace(/[→⇒➜➡↗]/g, " to ")
    .replace(/←/g, " ")
    .replace(/↔/g, " and ")
    .replace(/…/g, "...")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+-\s+/g, " - ")
    .replace(/(\d)\s-\s(\d)/g, "$1-$2")
    .trim();
}

function protectBlocks(html) {
  const blocks = [];
  const protectedHtml = String(html).replace(PROTECTED_BLOCK_RE, (match) => {
    const token = `__HTML_PROTECTED_BLOCK_${blocks.length}__`;
    blocks.push(match);
    return token;
  });
  return { protectedHtml, blocks };
}

function restoreBlocks(html, blocks) {
  return blocks.reduce((acc, block, index) => acc.replace(`__HTML_PROTECTED_BLOCK_${index}__`, block), html);
}

function sanitizeTextNodes(html) {
  return html.replace(/>([^<]+)</g, (full, text) => {
    const sanitized = sanitizeHumanText(text);
    return `>${sanitized}<`;
  });
}

function sanitizeTextAttributes(html) {
  return html.replace(/\b([a-zA-Z0-9:-]+)=("([^"]*)"|'([^']*)')/g, (full, attrName, quotedValue, doubleValue, singleValue) => {
    if (!TEXT_ATTR_NAMES.has(attrName)) return full;
    const quote = quotedValue[0];
    const rawValue = doubleValue ?? singleValue ?? "";
    const sanitized = sanitizeHumanText(rawValue);
    return `${attrName}=${quote}${sanitized}${quote}`;
  });
}

function sanitizeMetaContent(html) {
  return html.replace(/<meta\b([^>]*?)>/gi, (full, attrs) => {
    const keyMatch = attrs.match(/\b(?:name|property)=["']([^"']+)["']/i);
    if (!keyMatch) return full;
    const key = keyMatch[1];
    if (!META_TEXT_KEYS.has(key)) return full;
    return full.replace(/\bcontent=(["'])([\s\S]*?)\1/i, (contentFull, quote, value) => {
      return `content=${quote}${sanitizeHumanText(value)}${quote}`;
    });
  });
}

async function sanitizeHtmlFile(filePath) {
  const original = await readFile(filePath, "utf8");
  const { protectedHtml, blocks } = protectBlocks(original);
  const sanitized = restoreBlocks(
    sanitizeMetaContent(
      sanitizeTextAttributes(
        sanitizeTextNodes(protectedHtml)
      )
    ),
    blocks,
  );
  if (sanitized !== original) {
    await writeFile(filePath, sanitized);
    return true;
  }
  return false;
}

async function main() {
  if (!(await fileExists(DIST_ROOT))) {
    throw new Error("dist/ missing. Run npm run build first.");
  }
  const htmlFiles = await collectHtmlFiles(DIST_ROOT);
  let updated = 0;
  for (const htmlFile of htmlFiles) {
    if (await sanitizeHtmlFile(htmlFile)) updated += 1;
  }
  console.log(`[postbuild-human-text-sanitize] html_files=${htmlFiles.length} updated=${updated}`);
}

main().catch((error) => {
  console.error("[postbuild-human-text-sanitize] fatal");
  console.error(error);
  process.exitCode = 1;
});
