import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export async function thirdPartyNotices(root) {
  root = resolve(root);
  const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const visited = new Set();
  const notices = [];
  async function visit(name, from) {
    let location = from;
    let folder;
    while (location.startsWith(root)) {
      const candidate = join(location, "node_modules", name);
      if (existsSync(join(candidate, "package.json"))) {
        folder = candidate;
        break;
      }
      const parent = dirname(location);
      if (parent === location) break;
      location = parent;
    }
    if (!folder) throw new Error(`Missing dependency licence source: ${name}`);
    folder = resolve(folder);
    if (visited.has(folder)) return;
    visited.add(folder);
    const pkg = JSON.parse(await readFile(join(folder, "package.json"), "utf8"));
    const files = (await readdir(folder, { withFileTypes: true })).filter(
      (entry) => entry.isFile() && /^(licen[sc]e|copying|ofl|notice)([.-]|$)/i.test(entry.name),
    );
    const texts = await Promise.all(
      files.map((entry) => readFile(join(folder, entry.name), "utf8")),
    );
    notices.push(
      `${pkg.name} ${pkg.version}\nLicence: ${JSON.stringify(pkg.license ?? "See package metadata")}\n${texts.join("\n\n")}`,
    );
    for (const dependency of Object.keys(pkg.dependencies ?? {})) await visit(dependency, folder);
  }
  for (const name of [...Object.keys(manifest.dependencies), "tailwindcss", "tw-animate-css"])
    await visit(name, root);
  return `Third-party software and font notices\nThese notices do not license client artwork or copy.\n\n${notices.sort().join("\n\n========================================\n\n")}\n`;
}
