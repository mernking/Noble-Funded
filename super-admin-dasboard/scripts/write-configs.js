import { writeFileSync, mkdirSync } from "fs";
const w = (p, c) => { writeFileSync("/home/user/" + p, c); console.log("OK:", p); };

w("tsconfig.json", `{"compilerOptions":{"target":"ES2017","lib":["dom","dom.iterable","esnext"],"allowJs":true,"skipLibCheck":true,"strict":true,"noEmit":true,"esModuleInterop":true,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":true,"isolatedModules":true,"jsx":"preserve","incremental":true,"plugins":[{"name":"next"}],"paths":{"@/*":["./"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}`);

w("next.config.mjs", `/** @type {import('next').NextConfig} */\nexport default {};\n`);

w("postcss.config.mjs", `export default{plugins:{tailwindcss:{},autoprefixer:{}}};\n`);

w("tailwind.config.ts", `import type{Config}from"tailwindcss";export default{content:["./pages/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./app/**/*.{js,ts,jsx,tsx,mdx}"],theme:{extend:{fontFamily:{sans:["Inter","sans-serif"],display:["Space Grotesk","sans-serif"]}}},plugins:[]}satisfies Config;\n`);

mkdirSync("/home/user/lib", {recursive:true});
w("lib/utils.ts", `import{type ClassValue,clsx}from"clsx";import{twMerge}from"tailwind-merge";export function cn(...inputs:ClassValue[]){return twMerge(clsx(inputs));}\n`);

console.log("Configs done.");
