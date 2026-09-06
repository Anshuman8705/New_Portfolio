// Runs after `vite build`. Renders App to static HTML and injects it into
// dist/index.html so the built page has real content in it before React loads.
// React then hydrates that markup in the browser rather than replacing it.

import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const ssrDir = resolve(root, ".ssr-build");
const htmlFile = resolve(root, "dist/index.html");

if (!existsSync(htmlFile)) {
  console.error("prerender: dist/index.html not found — run vite build first.");
  process.exit(1);
}

const { render } = await import(resolve(ssrDir, "entry-server.js"));
const markup = render();

const html = readFileSync(htmlFile, "utf8");
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  console.error(`prerender: could not find ${marker} in dist/index.html — nothing injected.`);
  process.exit(1);
}

writeFileSync(htmlFile, html.replace(marker, `<div id="root">${markup}</div>`));
rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: injected ${(markup.length / 1024).toFixed(1)} kB of markup into dist/index.html`);
