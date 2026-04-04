import { writeFileSync } from "fs";
const c = `import type { Config } from "tailwindcss";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
`;
writeFileSync("/home/user/tailwind.config.ts", c);
console.log("tailwind.config.ts written");
