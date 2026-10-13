import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { rename } from "node:fs/promises";
import { join } from "node:path";

// Cloudflare Workers Static Assets build. All media are repository-owned files in
// src/assets, bundled by Vite; the build makes no network requests.
function renameEntryHtml(): Plugin {
  return {
    name: "static-entry-as-index",
    async writeBundle(options) {
      const dir = options.dir ?? "dist";
      await rename(join(dir, "static.html"), join(dir, "index.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), renameEntryHtml()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: { input: fileURLToPath(new URL("./static.html", import.meta.url)) },
  },
});
