import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Deploying to Vercel or Netlify? Leave base as "/".
  // Deploying to GitHub Pages at username.github.io/REPO ? Set base to "/REPO/".
  base: "/",
});
