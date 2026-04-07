import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const requiredFiles = [
  "vetuonglai.com/index.html",
  "vetuonglai.com/apps.json",
  "vetuonglai.com/manifest.json",
  "vc.vetuonglai.com/index.html",
  "vc.vetuonglai.com/v/index.html",
  "vc.vetuonglai.com/_worker.js",
  "vc.vetuonglai.com/_redirects",
  "vc.vetuonglai.com/api/certificates.json",
  "edu.vetuonglai.com/index.html",
  "edu.vetuonglai.com/courses/index.html",
  "edu.vetuonglai.com/api/health",
  "edu.vetuonglai.com/api/catalog.json",
  "green.vetuonglai.com/index.html",
  "finance.vetuonglai.com/index.html",
  "life.vetuonglai.com/index.html",
  "invest.vetuonglai.com/index.html"
];

async function assertFile(relativePath) {
  await access(path.join(DIST, relativePath));
}

async function main() {
  for (const file of requiredFiles) {
    await assertFile(file);
  }

  const apps = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "apps.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(DIST, "vetuonglai.com", "manifest.json"), "utf8"));
  const certificates = JSON.parse(await readFile(path.join(DIST, "vc.vetuonglai.com", "api", "certificates.json"), "utf8"));
  const catalog = JSON.parse(await readFile(path.join(DIST, "edu.vetuonglai.com", "api", "catalog.json"), "utf8"));
  const redirects = await readFile(path.join(DIST, "vc.vetuonglai.com", "_redirects"), "utf8");
  const health = JSON.parse(await readFile(path.join(DIST, "edu.vetuonglai.com", "api", "health"), "utf8"));
  const hubHtml = await readFile(path.join(DIST, "vetuonglai.com", "index.html"), "utf8");
  const vcHtml = await readFile(path.join(DIST, "vc.vetuonglai.com", "index.html"), "utf8");
  const investHtml = await readFile(path.join(DIST, "invest.vetuonglai.com", "index.html"), "utf8");

  if (!Array.isArray(apps) || apps.length < 6) {
    throw new Error("apps.json khong du app registry.");
  }

  if (manifest.version !== "1.0.0") {
    throw new Error("manifest.json chua dung version V1.0.");
  }

  if (!Array.isArray(certificates) || certificates.length < 5) {
    throw new Error("VC registry khong du sample records.");
  }

  if (!Array.isArray(catalog) || catalog.length < 3) {
    throw new Error("EDU catalog khong du course data.");
  }

  if (!redirects.includes("/v/* /v/index.html 200")) {
    throw new Error("VC _redirects chua co rewrite cho /v/*.");
  }

  if (!health.ok || health.name !== "vetuonglai-edu") {
    throw new Error("EDU health endpoint khong hop le.");
  }

  if (!hubHtml.includes('hreflang="vi-VN"') || !hubHtml.includes('hreflang="en-US"')) {
    throw new Error("Hub HTML chua co hreflang song ngu.");
  }

  if (!hubHtml.includes('data-language-option="vi"') || !hubHtml.includes('data-language-option="en"')) {
    throw new Error("Hub HTML chua co bo chuyen ngon ngu.");
  }

  if (!vcHtml.includes("?lang=en") || !vcHtml.includes("?lang=vi")) {
    throw new Error("VC HTML chua xuat alternate link ngon ngu day du.");
  }

  if (!investHtml.includes("đầu tư không phải để thắng nhanh")) {
    throw new Error("Trang INVEST chua duoc hoan thien noi dung tieng Viet.");
  }

  if (!investHtml.includes("investing is not about winning quickly")) {
    throw new Error("Trang INVEST chua duoc hoan thien noi dung tieng Anh.");
  }

  for (const course of catalog) {
    if (!course.slug || !course.certificateCode) {
      throw new Error(`Course data thieu slug hoac certificateCode: ${JSON.stringify(course)}`);
    }

    await assertFile(path.join("edu.vetuonglai.com", "course", course.slug, "index.html"));
  }

  for (const record of certificates) {
    if (!record.code || !record.domain || !record.anchors?.contentHash) {
      throw new Error(`VC record thieu field bat buoc: ${JSON.stringify(record)}`);
    }
  }

  console.log("Vetuonglai dist check passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
