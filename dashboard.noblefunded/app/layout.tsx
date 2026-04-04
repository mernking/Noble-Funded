import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Noble Funded | Trader Dashboard",
  description: "Nigeria's #1 Prop Trading Firm. Manage your funded accounts, track performance, and request payouts.",
  generator: "Noble Funded",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  themeColor: "#002B36",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${figtree.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  )
}
