import { readdirSync, existsSync } from "fs";
import { resolve } from "path";

console.log("[v0] process.cwd():", process.cwd());
console.log("[v0] __dirname alternative (import.meta.url):", import.meta.url);

// Check several candidate directories
const candidates = [
  process.cwd(),
  "/vercel/share/v0-project",
  "/vercel/share",
  "/app",
  "/home",
  "/workspace",
];

for (const dir of candidates) {
  if (existsSync(dir)) {
    try {
      const files = readdirSync(dir).slice(0, 20);
      console.log(`\n[v0] Contents of ${dir}:`, files.join(", "));
      if (existsSync(resolve(dir, "package.json"))) {
        console.log(`  --> package.json FOUND here: ${dir}`);
      }
    } catch (e) {
      console.log(`  Error reading ${dir}: ${e.message}`);
    }
  } else {
    console.log(`[v0] ${dir} does not exist`);
  }
}
