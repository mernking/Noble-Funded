import { mkdirSync, writeFileSync } from "fs";

const ROOT = "/home/user";

function write(path, content) {
  const full = `${ROOT}/${path}`;
  const dir = full.substring(0, full.lastIndexOf("/"));
  mkdirSync(dir, { recursive: true });
  writeFileSync(full, content, "utf8");
  console.log(`[v0] Written: ${path}`);
}

// ─── package.json ──────────────────────────────────────────────────────────
write("package.json", JSON.stringify({
  name: "noble-funded-admin",
  version: "0.1.0",
  private: true,
  scripts: { dev: "next dev", build: "next build", start: "next start" },
  dependencies: {
    next: "^15.0.0",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    recharts: "^2.13.0",
    "lucide-react": "^0.469.0",
    clsx: "^2.1.1",
    "tailwind-merge": "^2.5.5",
  },
  devDependencies: {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    typescript: "^5",
    tailwindcss: "^3.4.17",
    postcss: "^8",
    autoprefixer: "^10.0.1",
  }
}, null, 2));

// ─── tsconfig.json ─────────────────────────────────────────────────────────
write("tsconfig.json", JSON.stringify({
  compilerOptions: {
    target: "ES2017",
    lib: ["dom", "dom.iterable", "esnext"],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    incremental: true,
    plugins: [{ name: "next" }],
    paths: { "@/*": ["./*"] }
  },
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  exclude: ["node_modules"]
}, null, 2));

// ─── next.config.mjs ───────────────────────────────────────────────────────
write("next.config.mjs", `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
    ],
  },
};
export default nextConfig;
`);

// ─── postcss.config.mjs ────────────────────────────────────────────────────
write("postcss.config.mjs", `export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
`);

// ─── tailwind.config.ts ────────────────────────────────────────────────────
write("tailwind.config.ts", `import type { Config } from "tailwindcss";
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
      colors: {
        surface: "#001716",
        primary: "#00ffcc",
      },
    },
  },
  plugins: [],
} satisfies Config;
`);

// ─── app/globals.css ───────────────────────────────────────────────────────
write("app/globals.css", `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --surface: #001716;
  --surface-low: #00201e;
  --surface-high: #0b2f2d;
  --surface-bright: #1d3f3c;
  --primary: #00ffcc;
  --primary-dim: #00d4a8;
  --primary-muted: rgba(0,255,204,0.15);
  --primary-border: rgba(0,255,204,0.2);
  --secondary: #ffbc7c;
  --on-surface: #fdfffc;
  --on-surface-variant: #b9cbc2;
  --danger: #ff4444;
  --warning: #f59e0b;
  --success: #10b981;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}
body{background-color:var(--surface);color:var(--on-surface);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--surface-low);}
::-webkit-scrollbar-thumb{background:var(--surface-bright);border-radius:2px;}
.glass-card{background:rgba(11,47,45,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--primary-border);box-shadow:0 20px 40px rgba(0,255,204,0.04),inset 0 1px 0 rgba(0,255,204,0.1);}
.chip-active{background:rgba(0,255,204,0.1);color:var(--primary);border:1px solid rgba(0,255,204,0.3);}
.chip-warning{background:rgba(245,158,11,0.1);color:var(--secondary);border:1px solid rgba(245,158,11,0.3);}
.chip-danger{background:rgba(255,68,68,0.1);color:#ff6b6b;border:1px solid rgba(255,68,68,0.3);}
.chip-neutral{background:rgba(185,203,194,0.1);color:var(--on-surface-variant);border:1px solid rgba(185,203,194,0.2);}
.font-display{font-family:'Space Grotesk',sans-serif;}
.pulse-dot{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
.blink{animation:blink 1s step-end infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
.sidebar-item{transition:all 0.15s ease;}
.page-fade{animation:pageFade 0.2s ease-in-out;}
@keyframes pageFade{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
.table-row-hover:hover{background:rgba(0,255,204,0.04);cursor:pointer;}
.input-field:focus{outline:none;border-color:rgba(0,255,204,0.5)!important;box-shadow:0 0 0 1px rgba(0,255,204,0.2);}
.btn-primary:hover{box-shadow:0 0 20px rgba(0,255,204,0.3);}
input[type="range"]{-webkit-appearance:none;appearance:none;height:4px;background:var(--surface-bright);border-radius:2px;outline:none;}
input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--primary);cursor:pointer;}
`);

// ─── app/layout.tsx ────────────────────────────────────────────────────────
write("app/layout.tsx", `import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Noble Funded | Super Admin",
  description: "Noble Funded Prop Trading Firm — Institutional Grade Admin Platform",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
};
export const viewport: Viewport = { themeColor: "#001716" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
`);

// ─── lib/utils.ts ──────────────────────────────────────────────────────────
write("lib/utils.ts", `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
`);

// ─── lib/types.ts ──────────────────────────────────────────────────────────
write("lib/types.ts", `export type Role = "Super Admin" | "Compliance" | "Support" | "Marketing" | "Developer";
export type NavItem = { id: string; label: string; icon: string; badge?: number; };
export type RoleConfig = { role: Role; subtitle: string; defaultTab: string; navItems: NavItem[]; };
export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  "Super Admin": {
    role: "Super Admin", subtitle: "INSTITUTIONAL GRADE", defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "users", label: "Users", icon: "Users" },
      { id: "challenges", label: "Challenges", icon: "Trophy" },
      { id: "payouts", label: "Payouts", icon: "CreditCard" },
      { id: "revenue", label: "Revenue", icon: "TrendingUp" },
      { id: "kyc", label: "KYC Center", icon: "ShieldCheck" },
      { id: "trader-performance", label: "Trader Analytics", icon: "BarChart2" },
      { id: "advanced-reporting", label: "Reports", icon: "FileBarChart" },
      { id: "global-command", label: "Command Center", icon: "Globe" },
      { id: "team", label: "Team", icon: "UsersRound" },
      { id: "staff-permissions", label: "Permissions", icon: "Lock" },
      { id: "settings", label: "Settings", icon: "Settings" },
      { id: "activity-logs", label: "Activity Logs", icon: "Activity" },
    ],
  },
  "Compliance": {
    role: "Compliance", subtitle: "COMPLIANCE OPS", defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "monitor", label: "Monitor", icon: "Monitor" },
      { id: "payouts", label: "Payouts", icon: "CreditCard" },
      { id: "flagged", label: "Flagged Accounts", icon: "Flag", badge: 3 },
      { id: "violations", label: "Violations Log", icon: "AlertTriangle" },
      { id: "reports", label: "Reports", icon: "FileText" },
    ],
  },
  "Support": {
    role: "Support", subtitle: "SUPPORT CENTER", defaultTab: "tickets",
    navItems: [
      { id: "tickets", label: "Ticket Queue", icon: "Ticket", badge: 128 },
      { id: "users", label: "Users", icon: "Users" },
      { id: "faq", label: "FAQ Manager", icon: "HelpCircle" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
    ],
  },
  "Marketing": {
    role: "Marketing", subtitle: "GROWTH & ANALYTICS", defaultTab: "overview",
    navItems: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "traffic", label: "Traffic", icon: "BarChart2" },
      { id: "sources", label: "Traffic Sources", icon: "GitBranch" },
      { id: "conversions", label: "Conversions", icon: "Target" },
      { id: "campaigns", label: "Campaigns", icon: "Megaphone" },
      { id: "reports", label: "Reports", icon: "FileBarChart" },
    ],
  },
  "Developer": {
    role: "Developer", subtitle: "INSTITUTIONAL TERMINAL", defaultTab: "system",
    navItems: [
      { id: "system", label: "System Status", icon: "Cpu" },
      { id: "logs", label: "System Logs", icon: "Terminal" },
      { id: "errors", label: "Error Tracker", icon: "AlertCircle", badge: 6 },
      { id: "deploy", label: "Deployments", icon: "Rocket" },
      { id: "database", label: "Database", icon: "Database" },
    ],
  },
};
`);

console.log("[v0] Core files written successfully!");
