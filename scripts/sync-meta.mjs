// Writes the <meta> and Open Graph tags in index.html from src/data.js.
// Runs automatically before every build, so data.js stays the single source of truth.
// Social crawlers (LinkedIn, WhatsApp, Slack) do not run JavaScript, which is why
// these tags have to be baked into the static HTML rather than set by React.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// pathToFileURL is required here: on Windows, resolve() returns "C:\\Users\\..."
// and dynamic import() reads the leading "C:" as a URL protocol, which throws
// ERR_UNSUPPORTED_ESM_URL_SCHEME. A file:// URL works on every platform.
const dataUrl = pathToFileURL(resolve(root, "src/data.js")).href;
const { meta, profile } = await import(dataUrl);

const START = "<!-- meta:start -->";
const END = "<!-- meta:end -->";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const url = (meta.siteUrl || "").replace(/\/+$/, "");
const image = url && meta.ogImage ? url + meta.ogImage : "";

const lines = [
  `    <title>${esc(meta.title)}</title>`,
  `    <meta name="description" content="${esc(meta.description)}" />`,
  `    <meta name="author" content="${esc(profile.fullName)}" />`,
  `    <meta property="og:type" content="website" />`,
  `    <meta property="og:title" content="${esc(meta.title)}" />`,
  `    <meta property="og:description" content="${esc(meta.description)}" />`,
  `    <meta property="og:site_name" content="${esc(profile.name)}" />`,
  url ? `    <meta property="og:url" content="${esc(url)}" />` : null,
  image ? `    <meta property="og:image" content="${esc(image)}" />` : null,
  image ? `    <meta property="og:image:width" content="1200" />` : null,
  image ? `    <meta property="og:image:height" content="630" />` : null,
  `    <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
  `    <meta name="twitter:title" content="${esc(meta.title)}" />`,
  `    <meta name="twitter:description" content="${esc(meta.description)}" />`,
  image ? `    <meta name="twitter:image" content="${esc(image)}" />` : null,
  url ? `    <link rel="canonical" href="${esc(url)}" />` : null,
].filter(Boolean);

const file = resolve(root, "index.html");
const html = readFileSync(file, "utf8");

if (!html.includes(START) || !html.includes(END)) {
  console.error(
    `sync-meta: could not find ${START} / ${END} markers in index.html — nothing written.`
  );
  process.exit(1);
}

const before = html.slice(0, html.indexOf(START) + START.length);
const after = html.slice(html.indexOf(END));
writeFileSync(file, `${before}\n${lines.join("\n")}\n    ${after}`);

console.log(
  `sync-meta: wrote ${lines.length} tags` +
    (url ? "" : "  (no siteUrl set yet — og:url, og:image and canonical skipped)")
);
