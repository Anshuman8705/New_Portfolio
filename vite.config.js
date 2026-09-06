import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { syncMeta } from "./scripts/sync-meta.mjs";

// Keeps index.html's meta block in step with src/data.js while the dev server is
// running. Without this the tags were only written at startup, so editing the
// title in data.js appeared to do nothing until you restarted.
function syncMetaOnChange() {
  const dataFile = resolve(process.cwd(), "src/data.js");
  return {
    name: "sync-meta-on-change",
    apply: "serve",
    configureServer(server) {
      server.watcher.add(dataFile);
      server.watcher.on("change", async (file) => {
        if (resolve(file) !== dataFile) return;
        try {
          const { changed } = await syncMeta({ quiet: true });
          if (changed) {
            server.config.logger.info("  sync-meta: index.html updated from data.js");
            server.ws.send({ type: "full-reload" });
          }
        } catch (err) {
          server.config.logger.error(`sync-meta: ${err.message}`);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), syncMetaOnChange()],
  // Deploying to Vercel or Netlify? Leave base as "/".
  // Deploying to GitHub Pages at username.github.io/REPO ? Set base to "/REPO/".
  base: "/",
});
