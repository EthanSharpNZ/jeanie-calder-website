import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
execFileSync(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = join(root, "artifacts", "handover", stamp);
const source = join(destination, "source");
const website = join(destination, "website");
await mkdir(source, { recursive: true });
const entries = [
  "src",
  "public",
  "scripts",
  "tests",
  ".github",
  "index.html",
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "vitest.config.ts",
  "playwright.config.ts",
  "tsconfig.json",
  "eslint.config.js",
  "wrangler.jsonc",
  ".nvmrc",
  ".gitignore",
  ".prettierignore",
  ".prettierrc",
  "README.md",
  "HANDOVER.md",
  "AUDIT.md",
  "ASSET_CREDITS.md",
  "AGENTS.md",
];
for (const entry of entries) await cp(join(root, entry), join(source, entry), { recursive: true });
await cp(join(root, "dist"), website, { recursive: true });
for (const folder of [source, website]) {
  const inventory = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile())
        inventory.push(
          `${createHash("sha256")
            .update(await readFile(file))
            .digest("hex")}  ${relative(folder, file).replaceAll("\\", "/")}`,
        );
    }
  }
  await walk(folder);
  await writeFile(join(folder, "SHA256SUMS.txt"), inventory.sort().join("\n") + "\n");
}
console.log(`Handover source: ${source}\nUpload only website contents: ${website}`);
