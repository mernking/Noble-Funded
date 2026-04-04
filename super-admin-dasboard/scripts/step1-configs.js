import { mkdirSync, writeFileSync } from "fs";
const R = "/home/user";
const w = (p, c) => { mkdirSync(`${R}/${p}`.replace(/\/[^/]+$/, ""), {recursive:true}); writeFileSync(`${R}/${p}`, c, "utf8"); console.log("OK:", p); };

w("package.json", `{
  "name": "noble-funded-admin",
  "version": "0.1.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.13.0",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4.17",
    "postcss": "^8",
    "autoprefixer": "^10.0.1"
  }
}`);

w("tsconfig.json", `{
  "compilerOptions": {
    "target": "ES2017","lib": ["dom","dom.iterable","esnext"],"allowJs": true,
    "skipLibCheck": true,"strict": true,"noEmit": true,"esModuleInterop": true,
    "module": "esnext","moduleResolution": "bundler","resolveJsonModule": true,
    "isolatedModules": true,"jsx": "preserve","incremental": true,
    "plugins": [{"name": "next"}],"paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`);

w("next.config.mjs", `/** @type {import('next').NextConfig} */\nexport default { images: { remotePatterns: [{ protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" }] } };\n`);

w("postcss.config.mjs", `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`);

w("tailwind.config.ts", `import type { Config } from "tailwindcss";
export default {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { fontFamily: { sans: ["Inter","sans-serif"], display: ["Space Grotesk","sans-serif"], mono: ["Courier New","monospace"] } } },
  plugins: [],
} satisfies Config;\n`);

w("lib/utils.ts", `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n`);

w("public/.gitkeep", "");
console.log("Step 1 done.");
