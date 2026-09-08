# Resume wording and UI fixes

Based on the active portfolio files at GitHub commit b3e8c3219e7008b561ed866a8ae4cc13fd603467.
Prepared 9 September 2026. No changes have been pushed to GitHub or deployed.

## Apply to your existing New_Portfolio repository

Back up your existing source files first. Replace only these three files with
those from the update ZIP (or the matching files in the complete project):

- src/templates.mjs
- src/styles.css
- src/ui.js

Keep package.json, package-lock.json, scripts/build.mjs, vercel.json, src/data.js,
public/assets and your certificates as they are. Do not restore public/fonts.
The UI-only update ZIP contains no package.json and cannot replace your build commands.

Run `npm run check`. Then review locally with `npm run preview` before committing
these three source files to your existing repository and branch. No deployment
or data changes are performed automatically by these files.

The complete ZIP also includes tests/ui-regressions.test.mjs, tests/ui_review.py
and tests/ui_fixture.py. Copy those too to retain the new regression tests.
The existing Node tests have no third-party runtime dependencies. Python browser
tests require Playwright and BeautifulSoup as test-only tools.

## Changes

- Resume / Download Resume instead of the accented spelling in the header, mobile
  menu, hero and contact links. Font weight, the PDF path and download filename
  are unchanged.
- Correct word spacing in the contact heading when the visual line break is hidden.
- Align project overview panels, headings, summary starts and bottom action rows
  across multi-column cards; allow longer labels to wrap rather than clip.
- Make 601–720px layouts reflow the hero and cards before their columns get cramped.
- Make the two stacked hero buttons equal width/height at 320–380px.
- Improve mobile form readability with 16px form text.
- Retain the Send message arrow through sending, failure and successful retry states.
- Return keyboard focus after email-copy fallback and move it to the video frame
  after hiding the Load video trigger.
- Protect dialog titles and long credential IDs from narrow-width overflow.

Project descriptions, certificates, contributor credits, contact details, videos,
PDF documents, hosting configuration and the framework are not rewritten.

## Validation

- Node.js 22.16.0: npm run check passed; 27 content/regression tests passed.
- Build generated all 18 HTML pages and resolved local page/asset references.
- 56 existing offline Chromium interaction checks passed.
- 75 focused UI/layout regression checks passed. Home widths: 320, 360, 375,
  390, 414, 600, 601, 640, 700, 720, 721, 768, 820, 821, 1024, 1080, 1081,
  1280, 1440 and 1920px. All 18 generated pages were additionally checked at
  320, 768 and 1440px.
- 64 local HTTP checks passed against the Node preview server, comparing response
  bodies to the actual built files and checking 404/redirect/HEAD/POST behaviour.
- Source data, PDF assets, package manifests and deployment settings are unchanged.

Limitations: the public Vercel URL could not be retrieved from this environment.
Chromium navigation is restricted, so browser tests use the actual built HTML,
CSS and images in an in-memory fixture, with local modules combined only for
fixture execution. Email responses are mocked; no real messages are sent. Video
player focus/attributes are tested, not external playback. These checks do not
assert live email delivery, production CSP behaviour, Safari/Firefox behaviour,
or that Vercel has deployed the changes. Screenshots are local previews.
