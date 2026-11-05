#!/usr/bin/env node
// The repository's checks, with no dependencies: the Cursor index and its
// one plugin agree, the plugin points at Thicket's hosted MCP server placed
// on the server (Grok Bot needs that), the logo is a 1024 px opaque PNG,
// the licenses are MIT, the manifests name this repository, nothing at the
// root is a plugin manifest, and the public copy names no competitor and
// carries no em dash.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY = "https://github.com/thicket-hq/plugins";
const MCP_URL = "https://www.thickethq.com/api/mcp";
const failures = [];
const check = (ok, label) => {
  if (!ok) failures.push(label);
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
};
const json = (path) => JSON.parse(readFileSync(join(ROOT, path), "utf8"));
const text = (path) => readFileSync(join(ROOT, path), "utf8");

// 1. The Cursor index and its plugin.
const marketplace = json(".cursor-plugin/marketplace.json");
const [entry] = marketplace.plugins;
check(marketplace.name === "thicket-hq", "index name is thicket-hq");
check(marketplace.plugins.length === 1 && entry.name === "thicket", "the index lists one plugin, thicket");
check(entry.source === "plugins/cursor/thicket", "the plugin's source is plugins/cursor/thicket");
const plugin = json(join(entry.source, ".cursor-plugin", "plugin.json"));
check(plugin.name === entry.name, "manifest name matches the index");
check(plugin.description === entry.description, "manifest description matches the index");
check(/^\d+\.\d+\.\d+$/.test(plugin.version), `manifest version is semver (${plugin.version})`);
check(plugin.repository === REPOSITORY, "Cursor manifest names this repository");
check(plugin.mcpServers === "./mcp.json", "manifest points at ./mcp.json");
const mcp = json(join(entry.source, "mcp.json"));
check(
  JSON.stringify(mcp) === JSON.stringify({ mcpServers: { thicket: { type: "http", url: MCP_URL, placement: "server" } } }),
  "mcp.json is the hosted server, type http, placed on the server",
);

// 2. The logo, the licenses, the README.
const png = readFileSync(join(ROOT, entry.source, plugin.logo));
check(png.subarray(1, 4).toString() === "PNG", "logo is a PNG");
check(png.readUInt32BE(16) === 1024 && png.readUInt32BE(20) === 1024, "logo is 1024 by 1024");
check(png[25] === 2, "logo is opaque (IHDR colour type 2)");
for (const path of ["LICENSE", join(entry.source, "LICENSE"), "plugins/openai/thicket/LICENSE"]) {
  check(/^MIT License/.test(text(path)), `${path} is MIT`);
}
check(existsSync(join(ROOT, entry.source, "README.md")), "the Cursor plugin has a README");

// 3. The ChatGPT package's manifest.
const openai = json("plugins/openai/thicket/plugin.json");
check(/^\d+\.\d+\.\d+$/.test(openai.version), `ChatGPT manifest version is semver (${openai.version})`);
check(openai.repository === REPOSITORY, "ChatGPT manifest names this repository");

// 4. Nothing at the root is a plugin manifest.
for (const path of ["plugin.json", ".claude-plugin", ".cursor-plugin/plugin.json", "mcp.json"]) {
  check(!existsSync(join(ROOT, path)), `no ${path} at the root`);
}

// 5. Public copy: no competitor name (kept encoded), no em dash where a person reads.
const COMPETITORS = new RegExp(["YmFzZWNhbXA=", "MzdzaWduYWxz"].map((n) => atob(n)).join("|"), "i");
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    if (name === ".git" || name === "node_modules") return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const files = walk(ROOT).filter((p) => !p.endsWith(".png"));
const competitorHits = files.filter((p) => !p.endsWith("validate.mjs") && COMPETITORS.test(readFileSync(p, "utf8")));
check(competitorHits.length === 0, `public copy names no competitor${competitorHits.length ? `: ${competitorHits.map((p) => relative(ROOT, p)).join(", ")}` : ""}`);
const readByPeople = files.filter((p) => /(README\.md|SKILL\.md|plugin\.json|marketplace\.json)$/.test(p));
const dashHits = readByPeople.filter((p) => readFileSync(p, "utf8").includes("—"));
check(dashHits.length === 0, `no em dash in READMEs, skills or manifests${dashHits.length ? `: ${dashHits.map((p) => relative(ROOT, p)).join(", ")}` : ""}`);

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
