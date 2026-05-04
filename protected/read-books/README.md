# protected/read-books — 70% paid layer

This directory holds the protected content for READ books (Book 2 onward, per VTL_71 layered publish model: 10/20/70).

## Hard rules

1. **NEVER copy this directory into `dist/`.** It is server-side only.
2. **NEVER reference these files from anywhere under `src/static-pages/`** — Cloudflare Pages will publish them as static assets if you do.
3. Served only by `workers/lib/access-runtime.mjs` via `GET /api/access/books/content?slug=<slug>&section=<section>` after the requester's session passes the `book_purchased` capability check AND `hasBookEntitlement(session, slug)` for the specific book slug.
4. Per book: one folder named after the book slug, containing `content.json`. Schema is enforced by `scripts/verify-read-book-publish-gate.mjs` (extended).
5. Manifest at `manifest.json` lists every book served. Books not in the manifest will return 404 even if a folder exists.

## Verifier guarantees

`verify:read:book-publish-gate` ensures:

- No string from any `body_vi` / `body_en` / `experience_plan.*` / `ai_study_guide.*` appears in any HTML file under `dist/read.vetuonglai.com/`.
- The folder is excluded from `dist/` entirely.
- Each declared book in `read-books.json` has a matching `protected/read-books/<slug>/content.json` once published.

## License

Author Trần Hà Tâm holds dual-publish rights for tranhatam.com (5/10/85 Phase 0 model) and vetuonglai.com READ (10/20/70 layered model). Content here is the canonical source for the READ paid layer.
