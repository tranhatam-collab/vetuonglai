#!/usr/bin/env node
/**
 * One-shot script: inject data-en-title and data-en-content attributes
 * into all read.vetuonglai.com pages so client-side language switch can
 * swap document.title and meta description when ?lang=en is active.
 *
 * Source-of-truth mapping below is reviewed against current VI copy in source.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const READ_ROOT = path.join(ROOT, "src/static-pages/read.vetuonglai.com");

// route -> { titleEn, descEn, ogTitleEn?, ogDescEn?, twitterTitleEn? }
const MAP = {
  "index.html": {
    titleEn: "READ — Long-form knowledge · Vetuonglai",
    descEn: "Long-form essays, books and reading notes about the future. READ is opening a public reading layer and publishing direction; sales and operational contributions are not yet open.",
    ogTitleEn: "READ — Long-form knowledge · Vetuonglai",
    ogDescEn: "Long-form essays, books and reading notes about the future. READ is opening a public reading layer; sales and operational contributions are not yet open.",
    twitterTitleEn: "READ — Knowledge for the future",
  },
  "essays/index.html": {
    titleEn: "Essays — READ · Vetuonglai",
    descEn: "Long-form essays about the future of life — five pillars: work, money, learning, society, and what does not change.",
  },
  "books/index.html": {
    titleEn: "Books — READ · Vetuonglai",
    descEn: "E-book catalog about the future. Phase 1 only opens the page frame; purchases are not yet open.",
  },
  "stacks/index.html": {
    titleEn: "Reading stacks — READ · Vetuonglai",
    descEn: "Reading stacks are a roadmap branch of READ. In the preparation phase only the structure is described; live reading bundles are not yet open.",
  },
  "submit/index.html": {
    titleEn: "Submission roadmap — READ · Vetuonglai",
    descEn: "READ is in preparation: this page describes the submission roadmap for a later phase. Public submission intake is not yet open.",
  },
  "review/index.html": {
    titleEn: "Editorial review — READ · Vetuonglai",
    descEn: "READ's content review principles: technical checks, peer review, and editorial sign-off. Quality is protected during the preparation phase.",
  },
  "creator/index.html": {
    titleEn: "Community roles — READ · Vetuonglai",
    descEn: "READ is in preparation: this page describes roles in the editorial roadmap. Participation guidance and benefit lanes only open in a later phase after passing review gates.",
  },
  "terms/index.html": {
    titleEn: "Terms and policies — READ · Vetuonglai",
    descEn: "Public legal terms and principles for READ in the preparation phase: usage, anti-fraud, copyright and data.",
  },
  "tax-note/index.html": {
    titleEn: "Tax note — READ · Vetuonglai",
    descEn: "Legal-safe tax note: principles of withholding at source by income type. Not a substitute for accounting advice.",
  },
  "how-we-pay/index.html": {
    titleEn: "Benefit disclosure principles — READ · Vetuonglai",
    descEn: "READ is in preparation. This page only publishes benefit principles and conditions for opening a later phase; it does not open payments, payouts, or live operational ledgers.",
  },
  "transparency/index.html": {
    titleEn: "Transparency — READ · Vetuonglai",
    descEn: "Transparency: publishes principles, boundaries and conditions for opening a later phase. No live operational transaction data is exposed publicly at this phase.",
  },
  "transparency/ledger/index.html": {
    titleEn: "Transparency ledger roadmap — READ · Vetuonglai",
    descEn: "This page describes the transparency ledger roadmap and conditions for opening a later phase. There is no public per-transaction ledger at the current phase.",
  },
  "transparency/reports/index.html": {
    titleEn: "Quarterly report roadmap — READ · Vetuonglai",
    descEn: "This page describes the quarterly report roadmap and disclosure conditions for a later phase. No official operational report is published at the current phase.",
  },
  "write/index.html": {
    titleEn: "Content collaboration roadmap — READ · Vetuonglai",
    descEn: "The writing branch is in preparation: it publishes the content collaboration roadmap; public participation guidance is not yet open at this phase.",
  },
  "write/apply/index.html": {
    titleEn: "Pilot signup — READ · Vetuonglai",
    descEn: "Pilot signup page in the preparation phase: only collects initial interest for the collaboration roadmap; live participation guidance is not yet public.",
  },
  "write/tiers/index.html": {
    titleEn: "Collaboration tier roadmap — READ · Vetuonglai",
    descEn: "This page describes the collaboration tier roadmap for a later phase. Requirements and entitlements are directional only and not yet a live public flow.",
  },
  "write/guidelines/index.html": {
    titleEn: "Editorial standard roadmap — READ · Vetuonglai",
    descEn: "This page publishes the direction of editorial standards for a later phase. It is a public reference, not a complete operational standard set.",
  },
  "pillars/work/index.html": {
    titleEn: "The future of work — READ · Vetuonglai",
    descEn: "Pillar 1: AI and jobs. Long-form essay will be released by phase.",
  },
  "pillars/money/index.html": {
    titleEn: "Money and time — READ · Vetuonglai",
    descEn: "Pillar 2: long-term financial behavior. Long-form essay will be released by phase.",
  },
  "pillars/learning/index.html": {
    titleEn: "Real learning — READ · Vetuonglai",
    descEn: "Pillar 3: meta-knowledge. Long-form essay will be released by phase.",
  },
  "pillars/society/index.html": {
    titleEn: "A changing society — READ · Vetuonglai",
    descEn: "Pillar 4: community and meaning. Long-form essay will be released by phase.",
  },
  "pillars/timeless/index.html": {
    titleEn: "What does not change — READ · Vetuonglai",
    descEn: "Pillar 5: timeless behavioral patterns. Long-form essay will be released by phase.",
  },
};

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function injectIntoTitleTag(html, titleEn) {
  // Match: <title>VI text</title>  OR existing <title data-vi-title="..." data-en-title="...">
  return html.replace(/<title(\s[^>]*)?>([\s\S]*?)<\/title>/i, (match, attrs, inner) => {
    const viText = inner;
    const safeVi = escapeAttr(viText);
    const safeEn = escapeAttr(titleEn);
    return `<title data-vi-title="${safeVi}" data-en-title="${safeEn}">${viText}</title>`;
  });
}

function injectIntoMetaDescription(html, descEn) {
  return html.replace(
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i,
    (match, viContent) => {
      const safeVi = escapeAttr(viContent);
      const safeEn = escapeAttr(descEn);
      return `<meta name="description" content="${viContent}" data-vi-content="${safeVi}" data-en-content="${safeEn}" />`;
    },
  );
}

let updated = 0;
let missing = [];
for (const [route, entry] of Object.entries(MAP)) {
  const filePath = path.join(READ_ROOT, route);
  if (!fs.existsSync(filePath)) {
    missing.push(route);
    continue;
  }
  let html = fs.readFileSync(filePath, "utf8");
  const before = html;
  html = injectIntoTitleTag(html, entry.titleEn);
  html = injectIntoMetaDescription(html, entry.descEn);
  if (html !== before) {
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`updated: ${route}`);
    updated += 1;
  } else {
    console.log(`unchanged: ${route}`);
  }
}

if (missing.length > 0) {
  console.log("missing routes:", missing);
}
console.log(`done. updated=${updated} of ${Object.keys(MAP).length}`);
