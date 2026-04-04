"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  DollarSign,
  Users,
  Trophy,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  HelpCircle,
  MessageSquare,
  ShoppingCart,
  ChevronRight,
  User,
  Award,
  BookOpen,
} from "lucide-react"
import { mockUser } from "@/lib/data"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/accounts", icon: Wallet, label: "My Accounts" },
  { href: "/dashboard/statistics", icon: BarChart3, label: "Statistics" },
  { href: "/dashboard/payouts", icon: DollarSign, label: "Payouts" },
  { href: "/dashboard/affiliate", icon: Users, label: "Affiliate" },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/dashboard/certificates", icon: Award, label: "Certificates" },
  { href: "/dashboard/rules", icon: BookOpen, label: "Rules" },
]

const bottomItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "https://noble-frontend-lilac.vercel.app", icon: ShoppingCart, label: "Buy Challenge", external: true },
  { href: "https://discord.gg", icon: HelpCircle, label: "Support", external: true },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300",
          "border-r border-[rgba(167,255,235,0.08)]",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "linear-gradient(180deg, rgba(13,148,136,0.12) 0%, rgba(6,15,14,0.75) 30%, rgba(7,18,17,0.82) 100%)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRight: "1px solid rgba(94,234,212,0.14)",
          boxShadow: "1px 0 0 rgba(255,255,255,0.04) inset, 2px 0 32px rgba(0,0,0,0.6), 0 0 24px rgba(13,148,136,0.08) inset",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(167,255,235,0.08)]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Noble-OEj3GEQadTCZw2V91d7wOoVnrqoBG3.svg"
              alt="Noble Funded"
              width={130}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="px-4 py-4 border-b border-[rgba(167,255,235,0.08)]">
          <div className="flex items-center gap-3 glass-card px-3 py-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0d9488] flex items-center justify-center text-[#060f0e] font-bold text-sm shrink-0">
              {mockUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{mockUser.name.split(" ")[0]}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <p className="text-xs text-muted-foreground">KYC Verified</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 py-2">Main</p>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-[rgba(20,184,166,0.12)] text-[#5eead4] border border-[rgba(20,184,166,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(20,184,166,0.07)]"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] shrink-0", active ? "text-[#5eead4]" : "text-muted-foreground group-hover:text-foreground")} size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#5eead4]/60" />}
              </Link>
            )
          })}

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 py-2 mt-4">Account</p>
          {bottomItems.map((item) => {
            const active = !item.external && pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  item.label === "Buy Challenge"
                    ? "bg-[rgba(20,184,166,0.1)] text-[#5eead4] border border-[rgba(20,184,166,0.2)] hover:bg-[rgba(20,184,166,0.16)]"
                    : active
                    ? "bg-[rgba(20,184,166,0.12)] text-[#5eead4] border border-[rgba(20,184,166,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(20,184,166,0.07)]"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] shrink-0", item.label === "Buy Challenge" ? "text-[#5eead4]" : "text-muted-foreground group-hover:text-foreground")} size={18} />
                <span>{item.label}</span>
                {(item.external || active) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom logout */}
        <div className="px-3 pb-4 border-t border-[rgba(167,255,235,0.08)] pt-3">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.06)] transition-all w-full">
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

interface TopbarProps {
  onMenuOpen: () => void
  title: string
  subtitle?: string
}

export function Topbar({ onMenuOpen, title, subtitle }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-4 border-b border-[rgba(94,234,212,0.1)]" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.1) 0%, rgba(6,15,14,0.7) 50%, rgba(7,18,17,0.75) 100%)", backdropFilter: "blur(36px) saturate(180%)", WebkitBackdropFilter: "blur(36px) saturate(180%)", boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 24px rgba(0,0,0,0.4)" }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[rgba(167,255,235,0.06)] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Discord link */}
        <Link
          href="https://discord.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-[rgba(167,255,235,0.06)] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[rgba(167,255,235,0.06)] transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5eead4]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 glass-card noble-glow-strong z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[rgba(167,255,235,0.08)]">
                <p className="font-semibold text-sm">Notifications</p>
              </div>
              <div className="divide-y divide-[rgba(167,255,235,0.06)]">
                {[
                  { title: "Payout Processed", desc: "Your payout of ₦180,000 is being processed.", time: "2h ago", dot: "bg-[#a7ffeb]" },
                  { title: "Phase 1 Progress", desc: "You've reached 4.8% of your 10% profit target.", time: "1d ago", dot: "bg-[#fbbf24]" },
                  { title: "Welcome to Noble!", desc: "Complete your KYC to unlock all features.", time: "3d ago", dot: "bg-[#4ade80]" },
                ].map((n, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 hover:bg-[rgba(167,255,235,0.04)] cursor-pointer">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link href="/dashboard/settings" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[rgba(167,255,235,0.06)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center text-[#060f0e] font-bold text-xs">
            {mockUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="hidden md:block text-sm font-medium">{mockUser.name.split(" ")[0]}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
        </Link>
      </div>
    </header>
  )
}
