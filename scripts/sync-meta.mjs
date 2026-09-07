// Writes the <meta>, Open Graph and JSON-LD block in index.html from src/data.js.
// Runs before every build and again whenever data.js changes in dev, so data.js
// stays the single source of truth. Social crawlers (LinkedIn, WhatsApp, Slack)
// do not run JavaScript, which is why these tags have to be baked into the
// static HTML rather than set by React.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const START = "<!-- meta:start -->";
const END = "<!-- meta:end -->";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Where the site actually lives. data.js wins if you set it; otherwise we take
// whatever the host tells us at build time, which means Vercel and Netlify
// deployments get og:image and the canonical link with nothing to configure.
function resolveSiteUrl(meta) {
  const fromEnv =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    process.env.URL || // Netlify
    "";
  const raw = (meta.siteUrl || fromEnv || "").trim();
  if (!raw) return "";
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

export function syncMeta({ quiet = false } = {}) {
  // A cache-busting query keeps the dev server from serving a stale copy of
  // data.js back to us on the second and later runs of the watcher.
  const dataUrl = `${pathToFileURL(resolve(root, "src/data.js")).href}?t=${Date.now()}`;
  return import(dataUrl).then(({ meta, profile, contact }) => {
    const url = resolveSiteUrl(meta);
    const image = url && meta.ogImage ? url + meta.ogImage : "";

    // Structured data. This is what lets a search engine understand that the
    // page is a person rather than a document about one, which is most of the
    // value a portfolio gets out of SEO.
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.fullName,
      alternateName: profile.name,
      jobTitle: meta.jobTitle,
      description: meta.description,
      email: `mailto:${contact.email}`,
      address: { "@type": "PostalAddress", addressLocality: profile.location },
      sameAs: [contact.github, contact.linkedin].filter(Boolean),
      ...(url ? { url } : {}),
      ...(image ? { image } : {}),
      ...(meta.affiliation
        ? { affiliation: { "@type": "Organization", name: meta.affiliation } }
        : {}),
      // A current student is a member of the college, not an alumnus of it.
      // Switch this to alumniOf after graduation.
      ...(meta.memberOf
        ? { memberOf: { "@type": "CollegeOrUniversity", name: meta.memberOf } }
        : {}),
      ...(meta.alumniOf
        ? { alumniOf: { "@type": "CollegeOrUniversity", name: meta.alumniOf } }
        : {}),
    };

    const lines = [
      `    <title>${esc(meta.title)}</title>`,
      `    <meta name="description" content="${esc(meta.description)}" />`,
      `    <meta name="author" content="${esc(profile.fullName)}" />`,
      `    <meta name="robots" content="index, follow" />`,
      `    <meta property="og:type" content="profile" />`,
      `    <meta property="og:title" content="${esc(meta.title)}" />`,
      `    <meta property="og:description" content="${esc(meta.description)}" />`,
      `    <meta property="og:site_name" content="${esc(profile.name)}" />`,
      url ? `    <meta property="og:url" content="${esc(url)}" />` : null,
      image ? `    <meta property="og:image" content="${esc(image)}" />` : null,
      image ? `    <meta property="og:image:width" content="1200" />` : null,
      image ? `    <meta property="og:image:height" content="630" />` : null,
      image
        ? `    <meta property="og:image:alt" content="${esc(meta.ogImageAlt || meta.title)}" />`
        : null,
      `    <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
      `    <meta name="twitter:title" content="${esc(meta.title)}" />`,
      `    <meta name="twitter:description" content="${esc(meta.description)}" />`,
      image ? `    <meta name="twitter:image" content="${esc(image)}" />` : null,
      url ? `    <link rel="canonical" href="${esc(url)}" />` : null,
      `    <script type="application/ld+json">${JSON.stringify(person)}</script>`,
    ].filter(Boolean);

    const file = resolve(root, "index.html");
    const html = readFileSync(file, "utf8");

    if (!html.includes(START) || !html.includes(END)) {
      throw new Error(
        `sync-meta: could not find ${START} / ${END} markers in index.html — nothing written.`
      );
    }

    const before = html.slice(0, html.indexOf(START) + START.length);
    const after = html.slice(html.indexOf(END));
    const next = `${before}\n${lines.join("\n")}\n    ${after}`;

    // Only touch the file when something actually changed, so running the dev
    // server does not leave a modified index.html sitting in git for no reason.
    if (next !== html) writeFileSync(file, next);

    if (!quiet) {
      console.log(
        `sync-meta: ${next === html ? "already current" : "wrote"} ${lines.length} tags` +
          (url
            ? `  (site: ${url})`
            : "  (no siteUrl set — og:url, og:image and canonical skipped)")
      );
    }
    return { url, image, changed: next !== html };
  });
}

// Running it directly: `npm run sync-meta`.
if (process.argv[1] && resolve(process.argv[1]) === resolve(here, "sync-meta.mjs")) {
  syncMeta().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
