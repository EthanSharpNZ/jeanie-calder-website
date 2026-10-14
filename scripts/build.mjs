import { build } from "vite";
import react from "@vitejs/plugin-react";
import sharp from "sharp";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { thirdPartyNotices } from "./licenses.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
// Set SITE_URL only when the hosting team has agreed a new public origin.
const defaultOrigin = "https://jeanie-calder-website.studionz.workers.dev";
const site = new URL(process.env.SITE_URL || defaultOrigin);
if (
  site.protocol !== "https:" ||
  site.username ||
  site.password ||
  site.pathname !== "/" ||
  site.search ||
  site.hash
) {
  throw new Error(
    "SITE_URL must be a plain HTTPS origin without a path, credentials, query or fragment.",
  );
}
// Preserve the approved masters; only derive smaller delivery assets.
await mkdir("src/assets/optimized", { recursive: true });
for (const width of [320, 400, 640, 960]) {
  await sharp("src/assets/jeanie-calder-front-cover.webp")
    .resize({ width })
    .webp({ quality: 82 })
    .toFile(`src/assets/optimized/book-${width}.webp`);
}
await build({ configFile: resolve(root, "vite.config.ts") });
await build({
  configFile: false,
  plugins: [react()],
  resolve: { alias: { "@": resolve(root, "src") } },
  build: {
    ssr: "src/ssg-entry.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    copyPublicDir: false,
    ssrEmitAssets: true,
    assetsInlineLimit: 0,
    rollupOptions: { output: { entryFileNames: "render.mjs" } },
  },
});
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/render.mjs")).href);
let html = await readFile("dist/index.html", "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("Missing SSG insertion point");
html = html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`);
// Preload only the two above-the-fold font faces; font-display:swap remains enabled.
const assets = await readdir("dist/assets");
const fonts = ["cormorant-garamond-latin-600-normal", "dm-sans-latin-400-normal"];
const preloads = fonts
  .map((prefix) => {
    const file = assets.find((name) => name.startsWith(prefix) && name.endsWith(".woff2"));
    if (!file) throw new Error(`Missing font: ${prefix}`);
    return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`;
  })
  .join("\n");
html = html.replace("</head>", `${preloads}\n</head>`);
html = html.replaceAll(defaultOrigin, site.origin);
await writeFile("dist/index.html", html);
for (const name of ["robots.txt", "sitemap.xml"]) {
  const content = await readFile(`dist/${name}`, "utf8");
  await writeFile(`dist/${name}`, content.replaceAll(defaultOrigin, site.origin));
}
await mkdir("dist/images", { recursive: true });
await sharp("src/assets/jeanie-calder-front-cover.webp")
  .resize({ height: 1200 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("dist/images/jeanie-calder-book.jpg");
console.log("Generated complete HTML, responsive cover assets and social preview image.");
await writeFile("dist/THIRD_PARTY_NOTICES.txt", await thirdPartyNotices(root));
