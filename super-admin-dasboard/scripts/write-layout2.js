import { writeFileSync } from "fs";
const lines = [
  'import type { Metadata, Viewport } from "next";',
  'import "./globals.css";',
  'export const metadata: Metadata = {',
  '  title: "Noble Funded | Super Admin",',
  '  description: "Noble Funded Prop Trading Firm",',
  '  icons: { icon: "/favicon.png" },',
  '};',
  'export const viewport: Viewport = { themeColor: "#001716" };',
  'export default function RootLayout({ children }: { children: React.ReactNode }) {',
  '  return (',
  '    <html lang="en">',
  '      <body className="antialiased">{children}</body>',
  '    </html>',
  '  );',
  '}',
  '',
];
writeFileSync("/home/user/app/layout.tsx", lines.join("\n"));
console.log("app/layout.tsx written");
