# Anshuman Agrawal — Complete Portfolio

Full source + a built website. Prepared 9 September 2026.

**This is a complete replacement project, not a changes-only patch.** The earlier
Portfolio_Content_Update ZIP does not need to be applied. NimbusMart itself is a
separate project and is not modified by this package.

## Open it on Windows

Install Node.js 20 or newer if it is not already installed. Extract this ZIP, open
`Anshuman_Portfolio_Complete`, and double-click **start-preview.bat**. Keep its
terminal window open while browsing `http://127.0.0.1:4173`.

Or use a terminal in this folder:

```sh
npm run build
npm run preview
```

The prebuilt `dist/` folder is included. Do not double-click `dist/index.html`:
root-relative document links and browser modules should be served over HTTP.

## What is complete

- Responsive homepage with portrait, clearer positioning and project filters.
- Six standalone project case studies with public source links, honest boundaries
  and the agreed equal-contribution credits for DermAI and Expense & Budget Management.
- NimbusMart project entry and the public .NET repository link.
- Two owner-supplied YouTube walkthroughs. Players load only after a click; regular
  YouTube links also remain available. The CS50 video is not assigned to the .NET project.
- Nine certificate cards, category filters, five featured entries, a keyboard-operable
  preview dialog, individual document pages and downloads.
- All five original certificate PDFs, unchanged. IEEE and TCS photos are rotated for
  reading; untouched original photo files are also linked on their document pages.
- Existing Fab Lab learning journeys, hardware builds, experience, skills and education.
- An updated, linked, two-page PDF resume. It uses the new credits and document-supported
  internship dates, and does not label research as a clinical product.
- Contact validation, timeout, error recovery, duplicate-submit prevention, a real
  honeypot field, copy-email action and direct email fallback.
- Static metadata, social preview, per-page canonical URLs, sitemap, robots file,
  favicon, privacy page and 404 page.

## Implementation change from the old ZIP

The previous portfolio was a React/Vite project. This complete edition uses a
**dependency-free Node.js static build plus native browser JavaScript**, rather
than another unverified React/Vite patch. It keeps the portfolio content and
features, and pre-renders every page. No `node_modules`, frontend framework
runtime, database, server-side application or new paid service is required for
normal hosting. The optional resume generator and browser tests have their own
Python test/build requirements; the website build does not.

The old React/Vite files are not the active application in this package. Keep your
original ZIP/repository as a rollback copy. Do not mix the earlier JSX patch files
into this source tree. System typefaces are used; there are no font downloads.

## Folder guide

```
src/data.js          Your profile, projects, skills, modules, videos and certificates
src/templates.mjs    HTML templates for the home and detail pages
src/styles.css       Responsive styling
src/ui.js            Navigation, filters, dialogs, videos and contact behavior
src/form.mjs         Shared contact validation
public/assets/       Portrait, resume, social preview and local certificate assets
scripts/build.mjs    Creates and validates all pages in dist/
scripts/serve.mjs    Local preview server; not needed on a static host
scripts/build_resume.py  Optional resume regeneration from src/data.js
scripts/make_previews.py Optional PDF/image preview regeneration
tests/               Content, browser and HTTP checks
docs/                Source notes, test results and preview screenshots
dist/                Ready-built website (18 HTML pages)
```

## Editing content

Edit `src/data.js`, then run `npm run build`. It is the source for all project and
certificate descriptions. Keep image/PDF paths under `public/assets/`.

Add a certificate with a unique `id`, accurate `title`, `issuer`, `kind`, `group`,
`date`, and paths for `document`, `preview` and `thumbnail`. Only add `credentialUrl`
when it comes from a real credential record. Set `featured: true` to put it in the
initial featured view. Existing labels distinguish course attendance, completion,
workshop participation, internship and appreciation; they are not interchangeable.

The site address is `meta.siteUrl`. It currently retains the address you supplied:
`https://portfolio-kohl-theta-24.vercel.app`. Update it only when moving the site.
The content review date is `meta.contentUpdated`, not an automatically invented
credential date.

To regenerate the resume after material content changes:

```sh
python -m pip install reportlab
npm run resume
npm run build
```

Review the PDF after adding more content; the included version is two pages.

## Publish through the existing Vercel project

Back up the existing repository or create a new review branch first. Use this
folder's contents as the project root, rather than nesting it inside the old root.
The included `vercel.json` supplies these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other (not Vite) |
| Install command | `npm ci --ignore-scripts` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 22 |

The lockfile has no external package dependencies. Review a preview deployment
before merging to the production branch. No GitHub push or Vercel deployment was
performed while preparing this ZIP. Preview builds set `noindex` when Vercel
reports `VERCEL_ENV=preview`.

Alternatively, upload the **contents of `dist/`** to a static host. A separate
ready-to-host ZIP is supplied for that route. Root-relative paths assume the site
is at a domain root, as in the current Vercel address; subfolder hosting needs a
base-path adaptation.

## Contact configuration and live verification

The existing public Web3Forms form access key is retained in `src/data.js`.
It is a public form identifier intended to appear in the client; do not put a
private API key there. An optional build environment variable
`WEB3FORMS_ACCESS_KEY` overrides it.

Success and failure states were tested using mocked provider responses. **A real
message was not sent**, and inbox delivery has not been confirmed. After publishing,
send one message yourself, confirm it arrives, and check spam. A successful API
response is described as submission success, not proof of inbox delivery.

YouTube playback, live GitHub availability and issuer credential records were not
independently verified. The links retain the owner's supplied destinations.

## Quality checks

```sh
npm test
npm run build
npm run preview
```

With the preview server running, the optional HTTP check is:

```sh
python tests/http_check.py
```

For browser checks in a normal development environment:

```sh
python -m pip install playwright beautifulsoup4
python -m playwright install chromium
python tests/browser_check.py --screenshots
```

The delivered run used `--offline` because browser navigation and package downloads
were restricted in the build environment. That run rendered the actual built HTML,
inlined its local CSS/images and executed the same UI logic in Chromium. It is not
represented as a deployed-site test. Separately, the local HTTP checks fetched all
built assets and compared response bytes to the corresponding files.

See `docs/VALIDATION.md` for actual results and remaining post-deployment checks.
