## Latest UI review

See **UI_REVIEW.md**, **ui-review-results.json** and **ui-review-log.txt** for the latest changes and checks.

---

# Validation — completed build, 9 September 2026

## Results actually obtained

| Check | Result |
| --- | --- |
| Native Node.js static build | Passed; 18 HTML pages generated |
| Content, validation and source-integrity unit tests | 22 passed, 0 failed |
| Chromium offline DOM/interaction checks | 56 passed, 0 failed |
| Local HTTP server and built-file response checks | 64 passed, 0 failed |
| Original certificate PDF integrity | All 5 files match supplied SHA-256 hashes |
| Resume | 2 pages, rendered and visually inspected |
| Responsive homepage widths | 320, 390, 768, 1024 and 1440 CSS pixels; no horizontal overflow |
| Project/certificate detail pages | All 15 rendered at 390px; no horizontal overflow |
| Uncaught JavaScript errors in the tested pages | None |

The browser checks covered category filters, featured/all certificate views,
certificate-dialog opening, keyboard focus, Escape and focus return, video
click-to-load construction, mobile navigation, active section highlighting,
Fab Lab expand/collapse, form validation, mocked success/rejection/network failure,
duplicate submissions, timeout recovery and no-JavaScript content fallbacks.

Local HTTP tests independently fetched every built document/asset and compared
response bytes to the built file. They also checked unknown-page 404, directory
redirect, unsupported POST rejection and HEAD behavior.

## Environment boundary

The environment blocked Chromium navigation to network URLs, including localhost,
and package downloads were unavailable. The native build needs no downloaded
packages. The browser run used an offline fixture: actual generated HTML with its
CSS and local images inlined, running the same UI and validation code. This checks
rendering and interactions but does not exercise real page-to-page HTTP navigation
inside the browser or Vercel's production headers. The separate HTTP suite tested
local serving rather than claiming a deployed-site walkthrough.

Screenshots of the homepage, mobile layout, projects and certificates are in
`docs/previews/`. Machine-readable results and run logs are included alongside
this document. The Node audit's empty dependency tree is not a substitute for a
security assessment; no penetration-test or WCAG-certification claim is made.

## Not performed

No GitHub write, merge, Vercel deployment or change to a live website was made.
No real Web3Forms submission was sent. Video playback and external credential
verification were not performed. The original certificate links and video IDs
are retained, not promoted to independently verified evidence.

After deploying a preview, check direct project/certificate URLs and reloads,
open the resume and at least one original certificate, play both videos, and
send one real contact message to confirm inbox delivery. Check the browser console
for blocked resources under the production Content Security Policy.
