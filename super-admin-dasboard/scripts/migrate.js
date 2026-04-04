import { mkdirSync, writeFileSync, copyFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";

const SRC = "/vercel/share/v0-project";
const DST = "/home/user";

function copyDir(src, dst) {
  if (!existsSync(src)) {
    console.log(`[v0] Source dir does not exist: ${src}`);
    return;
  }
  mkdirSync(dst, { recursive: true });
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const dstPath = join(dst, entry);
    const stat = statSync(srcPath);
    // Skip these directories
    if (["node_modules", ".next", "scripts", ".git"].includes(entry)) continue;
    if (stat.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      copyFileSync(srcPath, dstPath);
      console.log(`[v0] Copied: ${dstPath}`);
    }
  }
}

console.log("[v0] Starting migration from", SRC, "to", DST);
copyDir(SRC, DST);
console.log("[v0] Migration complete!");

// Verify key files
const keys = ["package.json", "app/page.tsx", "app/layout.tsx", "tailwind.config.ts", "next.config.mjs"];
for (const k of keys) {
  const p = join(DST, k);
  console.log(`[v0] ${existsSync(p) ? "OK" : "MISSING"}: ${p}`);
}
