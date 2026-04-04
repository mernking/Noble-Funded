import { writeFileSync } from "fs";
writeFileSync("/home/user/app/layout.tsx", `import type { Metadata, Viewport } from "next";
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
console.log("app/layout.tsx written");
