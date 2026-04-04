import { writeFileSync, mkdirSync } from "fs";
writeFileSync("/home/user/postcss.config.mjs", "export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n");
mkdirSync("/home/user/lib", { recursive: true });
writeFileSync("/home/user/lib/utils.ts", "import { type ClassValue, clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n");
console.log("done");
