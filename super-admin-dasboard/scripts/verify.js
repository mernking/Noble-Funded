import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const root = resolve("/vercel/share/v0-project");
const checks = [
  "package.json",
  "app/page.tsx",
  "app/layout.tsx",
  "app/globals.css",
  "tailwind.config.ts",
  "next.config.mjs",
  "components/admin/Sidebar.tsx",
  "components/admin/Header.tsx",
  "lib/types.ts",
  "lib/utils.ts",
];

console.log("[v0] Verifying Noble Funded Admin project structure...\n");
let allGood = true;
for (const f of checks) {
  const path = resolve(root, f);
  const ok = existsSync(path);
  if (!ok) allGood = false;
  console.log(`${ok ? "✓" : "✗"} ${f}${ok ? "" : " <-- MISSING"}`);
}

console.log("\n[v0] package.json contents:");
try {
  const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  console.log("  name:", pkg.name);
  console.log("  scripts:", JSON.stringify(pkg.scripts));
  console.log("  deps:", Object.keys(pkg.dependencies || {}).join(", "));
} catch (e) {
  console.log("  ERROR reading package.json:", e.message);
}

console.log("\n[v0] Status:", allGood ? "ALL FILES PRESENT" : "SOME FILES MISSING");
