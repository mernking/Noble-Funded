import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      colors: {
        surface: "#010e0d",
        "surface-low": "#001614",
        "surface-high": "#0a2825",
        "surface-bright": "#1a3a37",
        primary: "#00ffcc",
        "primary-dim": "#00d4a8",
        secondary: "#ffbc7c",
        danger: "#ff4444",
        warning: "#f59e0b",
        success: "#10b981",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "pageFade 0.25s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
