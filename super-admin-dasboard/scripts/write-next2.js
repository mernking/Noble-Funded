import { writeFileSync, mkdirSync } from "fs";

writeFileSync("/home/user/next.config.mjs", "/** @type {import('next').NextConfig} */\nexport default {};\n");
console.log("next.config.mjs written");

writeFileSync("/home/user/postcss.config.mjs", "export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n");
console.log("postcss.config.mjs written");

mkdirSync("/home/user/lib", { recursive: true });
writeFileSync("/home/user/lib/utils.ts", "import { type ClassValue, clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n");
console.log("lib/utils.ts written");
