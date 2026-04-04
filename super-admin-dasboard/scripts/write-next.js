import { writeFileSync, mkdirSync } from "fs";

writeFileSync("/home/user/next.config.mjs", `/** @type {import('next').NextConfig} */\nexport default {};\n`);
console.log("next.config.mjs written");

writeFileSync("/home/user/postcss.config.mjs", `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`);
console.log("postcss.config.mjs written");

writeFileSync("/home/user/tailwind.config.ts", `import type { Config } from "tailwindcss";\nexport default {\n  content: [\n    "./pages/**/*.{js,ts,jsx,tsx,mdx}",\n    "./components/**/*.{js,ts,jsx,tsx,mdx}",\n    "./app/**/*.{js,ts,jsx,tsx,mdx}",\n  ],\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ["Inter", "sans-serif"],\n        display: ["Space Grotesk", "sans-serif"],\n        mono: ["Courier New", "monospace"],\n      },\n    },\n  },\n  plugins: [],\n} satisfies Config;\n`);
console.log("tailwind.config.ts written");

mkdirSync("/home/user/lib", { recursive: true });
writeFileSync("/home/user/lib/utils.ts", `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n`);
console.log("lib/utils.ts written");
