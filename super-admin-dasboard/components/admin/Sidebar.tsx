"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, Trophy, CreditCard, TrendingUp, UsersRound,
  Settings, Activity, Monitor, Flag, AlertTriangle, FileText, Ticket,
  HelpCircle, MessageSquare, BarChart2, GitBranch, Target, Megaphone,
  FileBarChart, Cpu, Terminal, AlertCircle, Rocket, Database, LogOut,
  ShieldCheck, Globe, Lock, Bell, Share2, Medal, Award, BookOpen,
  PackageOpen, Server, X, ChevronRight, ShieldAlert, Tag, Wallet,
  Plug, DollarSign, Send, SlidersHorizontal, RotateCcw, Webhook,
} from "lucide-react";
import { Role, ROLE_CONFIGS } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  LayoutDashboard, Users, Trophy, CreditCard, TrendingUp, UsersRound,
  Settings, Activity, Monitor, Flag, AlertTriangle, FileText, Ticket,
  HelpCircle, MessageSquare, BarChart2, GitBranch, Target, Megaphone,
  FileBarChart, Cpu, Terminal, AlertCircle, Rocket, Database,
  ShieldCheck, Globe, Lock, Bell, Share2, Medal, Award, BookOpen,
  PackageOpen, Server, ShieldAlert, Tag, Wallet, Plug, DollarSign, Send,
  SlidersHorizontal, RotateCcw, Webhook,
};

const ROLE_INITIALS: Record<Role, string> = {
  "Super Admin": "SA",
  "Compliance": "CO",
  "Support": "SP",
  "Marketing": "MK",
  "Developer": "DV",
};

const ROLE_COLORS: Record<Role, string> = {
  "Super Admin": "#00ffcc",
  "Compliance": "#60a5fa",
  "Support": "#f59e0b",
  "Marketing": "#a78bfa",
  "Developer": "#34d399",
};

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// SidebarInner is defined OUTSIDE the Sidebar component so React never
// unmounts/remounts it on parent re-renders — this preserves scroll position.
interface SidebarInnerProps extends SidebarProps {
  onMobileCloseButton?: () => void;
}

function SidebarInner({
  role,
  activeTab,
  onTabChange,
  onSignOut,
  onMobileCloseButton,
}: SidebarInnerProps) {
  const config = ROLE_CONFIGS[role];
  const roleColor = ROLE_COLORS[role];
  const initials = ROLE_INITIALS[role];

  // Preserve scroll position across tab changes
  const navRef = useRef<HTMLElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Save scroll before re-render
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleScroll = () => { scrollPosRef.current = nav.scrollTop; };
    nav.addEventListener("scroll", handleScroll, { passive: true });
    return () => nav.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll after role changes (full remount is fine for role switch)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.scrollTop = scrollPosRef.current;
  }, [activeTab]);

  const handleTabClick = (id: string) => {
    onTabChange(id);
    onMobileCloseButton?.();
  };

  return (
    <aside
      className="glass-sidebar flex flex-col h-full select-none"
      style={{ width: "220px", minWidth: "220px" }}
    >
      {/* Logo + Close on mobile */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <Image
            src="/noble-logo.svg"
            alt="Noble Funded"
            width={120}
            height={32}
            className="object-contain brightness-0 invert"
            priority
          />
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: roleColor }} />
            <span className="text-[10px] tracking-[0.16em] font-display uppercase" style={{ color: `${roleColor}80` }}>
              {config.subtitle}
            </span>
          </div>
        </div>
        {onMobileCloseButton && (
          <button
            onClick={onMobileCloseButton}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-[#b9cbc2] hover:text-white hover:bg-[#0b2f2d]/60"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav ref={navRef} className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {config.navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "sidebar-item relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "text-white"
                  : "text-[#a8c0b8] hover:text-white hover:bg-white/[0.04]"
              )}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${roleColor}18, ${roleColor}08)`,
                      border: `1px solid ${roleColor}28`,
                      boxShadow: `0 2px 12px ${roleColor}0a, inset 0 1px 0 ${roleColor}12`,
                    }
                  : {}
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                  style={{ background: roleColor, boxShadow: `0 0 8px ${roleColor}` }}
                />
              )}
              {Icon && (
                <Icon
                  size={15}
                  style={{ color: isActive ? roleColor : undefined }}
                  className={isActive ? "" : "opacity-60"}
                />
              )}
              <span className="flex-1 text-left text-[13px]">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={
                    isActive
                      ? { background: roleColor, color: "#010e0d" }
                      : { background: `${roleColor}25`, color: roleColor }
                  }
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight size={11} className="opacity-40" style={{ color: roleColor }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user info + sign out */}
      <div className="px-3 py-4 border-t border-[rgba(0,255,204,0.08)]">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2"
          style={{
            background: `linear-gradient(135deg, ${roleColor}10, transparent)`,
            border: `1px solid ${roleColor}18`,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold font-display"
            style={{
              background: `linear-gradient(135deg, ${roleColor}30, ${roleColor}10)`,
              border: `1px solid ${roleColor}30`,
              color: roleColor,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Alexander Noble</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#00ffcc" }} />
              <span className="text-[10px] text-[#a8c0b8]/60 truncate">Live Trading Active</span>
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#a8c0b8] hover:text-[#ff6b6b] hover:bg-[#ff4444]/08 border border-transparent hover:border-[#ff4444]/20 transition-all"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function Sidebar({
  role,
  activeTab,
  onTabChange,
  onSignOut,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen flex-shrink-0" style={{ width: "220px" }}>
        <SidebarInner
          role={role}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onSignOut={onSignOut}
        />
      </div>

      {/* Mobile sidebar — slide over */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[150] mobile-sidebar-backdrop lg:hidden"
            onClick={onMobileClose}
          />
          <div
            className="fixed inset-y-0 left-0 z-[160] lg:hidden animate-slide-in-left"
            style={{ width: "260px" }}
          >
            <SidebarInner
              role={role}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onSignOut={onSignOut}
              onMobileCloseButton={onMobileClose}
            />
          </div>
        </>
      )}
    </>
  );
}
