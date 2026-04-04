"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell, Search, ChevronDown, Eye, Settings, LogOut, Menu,
  CheckCheck, AlertTriangle, CheckCircle, XCircle,
  Info, CreditCard, User, Shield, X,
} from "lucide-react";
import { Role, ROLE_NOTIFICATIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: Role[] = ["Super Admin", "Compliance", "Support", "Marketing", "Developer"];

const ROLE_COLORS: Record<Role, string> = {
  "Super Admin": "#00ffcc",
  "Compliance": "#60a5fa",
  "Support": "#f59e0b",
  "Marketing": "#a78bfa",
  "Developer": "#34d399",
};

const ROLE_LABELS: Record<Role, string> = {
  "Super Admin": "Super Admin",
  "Compliance": "Compliance Officer",
  "Support": "Customer Support",
  "Marketing": "Marketing Team",
  "Developer": "Developer",
};

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onTabChange?: (tab: string) => void;
  onMenuToggle?: () => void;
  onSignOut?: () => void;
  notifications?: any[];
  unreadCount?: number;
  onMarkAllRead?: () => void;
}

export default function Header({
  role, onRoleChange, onTabChange, onMenuToggle, onSignOut,
  notifications: externalNotifs, unreadCount: externalUnreadCount, onMarkAllRead,
}: HeaderProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const roleColor = ROLE_COLORS[role];
  const roleNotifications = externalNotifs ?? (ROLE_NOTIFICATIONS[role] || []);
  const unreadCount = externalUnreadCount ?? roleNotifications.filter((n: any) => !n.read).length;

  const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
    success: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info,
    payout: CreditCard,
    user: User,
    system: Shield,
  };

  const TYPE_COLORS: Record<string, string> = {
    success: "#00ffcc",
    warning: "#f59e0b",
    danger: "#ff4444",
    info: "#60a5fa",
    payout: "#a78bfa",
    user: "#34d399",
    system: "#94a3b8",
  };

  // Close all dropdowns when clicking outside any of the three wrappers
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!roleRef.current?.contains(t)) setRoleDropdownOpen(false);
      if (!notifRef.current?.contains(t)) setNotifOpen(false);
      if (!profileRef.current?.contains(t)) setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (which: "role" | "notif" | "profile") => {
    setRoleDropdownOpen(which === "role" ? (v) => !v : false);
    setNotifOpen(which === "notif" ? (v) => !v : false);
    setProfileDropdownOpen(which === "profile" ? (v) => !v : false);
  };

  return (
    <header className="glass-header h-14 flex items-center px-3 lg:px-4 gap-2 lg:gap-3 flex-shrink-0" style={{ zIndex: 50, overflow: "visible" }}>

      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] border border-[rgba(0,255,204,0.1)] text-[#a8c0b8] hover:text-white transition-all flex-shrink-0"
        aria-label="Toggle menu"
      >
        <Menu size={16} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[340px] lg:max-w-[420px] relative hidden sm:block">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8c0b8]/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Search users, challenges, transactions..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="input-field w-full bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-[#a8c0b8]/35 focus:border-[#00ffcc]/35 transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* System Status — desktop only */}
      <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#a8c0b8]/50 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] pulse-dot" />
        <span>NOMINAL</span>
        <span className="opacity-30 mx-1">//</span>
        <span>14MS</span>
      </div>

      {/* ── Role Switcher ───────────────────────────────────────────────────── */}
      <div className="relative flex-shrink-0" ref={roleRef} style={{ zIndex: 200 }}>
        <button
          onClick={() => toggle("role")}
          className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-[rgba(0,255,204,0.12)] text-sm text-white hover:border-[rgba(0,255,204,0.25)] transition-all"
        >
          <Eye size={13} style={{ color: roleColor }} />
          <span className="text-[#a8c0b8]/60 text-[11px] hidden md:inline">View As:</span>
          <span className="font-semibold font-display text-[12px] hidden sm:inline" style={{ color: roleColor }}>
            {role}
          </span>
          <span className="font-semibold font-display text-[12px] sm:hidden" style={{ color: roleColor }}>
            {role.split(" ")[0]}
          </span>
          <ChevronDown size={12} className={cn("transition-transform flex-shrink-0", roleDropdownOpen && "rotate-180")} style={{ color: `${roleColor}80` }} />
        </button>

        {roleDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-60 glass-modal rounded-2xl shadow-2xl dropdown-enter"
            style={{ zIndex: 9999 }}>
            <div className="px-4 py-2.5 border-b border-[rgba(0,255,204,0.08)]">
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase font-display">Simulate Dashboard View</p>
            </div>
            <div className="py-1">
              {ROLES.map((r) => {
                const rc = ROLE_COLORS[r];
                return (
                  <button
                    key={r}
                    onClick={() => { onRoleChange(r); setRoleDropdownOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-[13px] transition-all hover:bg-white/[0.04]",
                      r === role ? "text-white font-medium" : "text-[#a8c0b8]"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r === role ? rc : `${rc}30` }} />
                    <span className="flex-1 text-left">{ROLE_LABELS[r]}</span>
                    {r === role && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${rc}20`, color: rc }}>
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Notifications ───────────────────────────────────────────────────── */}
      <div className="relative flex-shrink-0" ref={notifRef} style={{ zIndex: 200 }}>
        <button
          onClick={() => toggle("notif")}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-[rgba(0,255,204,0.1)] text-[#a8c0b8] hover:text-white hover:border-[rgba(0,255,204,0.22)] transition-all"
          aria-label="Notifications"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4444] rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 top-full mt-2 glass-modal rounded-2xl shadow-2xl dropdown-enter overflow-hidden"
            style={{ zIndex: 9999, width: "min(320px, calc(100vw - 16px))" }}
          >
            <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold font-display text-white">Notifications</p>
                <p className="text-[10px] text-[#a8c0b8]/50 mt-0.5">{role} — Role-filtered</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4444]/15 text-[#ff6b6b]">
                    {unreadCount} new
                  </span>
                )}
                <button
                  onClick={() => setNotifOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-[#a8c0b8]/40 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[rgba(0,255,204,0.04)]">
              {roleNotifications.slice(0, 8).map((n: any) => {
                const IconComp = TYPE_ICONS[n.type] || Info;
                const iconColor = TYPE_COLORS[n.type] || "#a8c0b8";
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "px-4 py-3 hover:bg-white/[0.03] transition-all cursor-pointer flex items-start gap-3",
                      !n.read && "bg-[rgba(0,255,204,0.02)]"
                    )}
                    onClick={() => { setNotifOpen(false); onTabChange?.("notifications"); }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${iconColor}15` }}>
                      <IconComp size={13} style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[12px] leading-snug", n.read ? "text-[#a8c0b8]" : "text-white font-medium")}>{n.title}</p>
                      <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] flex-shrink-0 mt-1.5" />}
                  </div>
                );
              })}
              {roleNotifications.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Bell size={20} className="text-[#a8c0b8]/20 mx-auto mb-2" />
                  <p className="text-[12px] text-[#a8c0b8]/40">No notifications</p>
                </div>
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-[rgba(0,255,204,0.08)] flex items-center justify-between">
              <button
                className="text-[11px] font-medium hover:underline transition-all"
                style={{ color: roleColor }}
                onClick={() => { setNotifOpen(false); onTabChange?.("notifications"); }}
              >
                View all notifications
              </button>
              <button
                className="text-[11px] text-[#a8c0b8]/40 hover:text-white transition-all flex items-center gap-1"
                onClick={() => { onMarkAllRead?.(); setNotifOpen(false); }}
              >
                <CheckCheck size={11} />
                Mark all read
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────────── */}
      <div className="relative flex-shrink-0" ref={profileRef} style={{ zIndex: 200 }}>
        <button
          onClick={() => toggle("profile")}
          className="flex items-center gap-2 lg:gap-2.5 px-2 lg:px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-[rgba(0,255,204,0.1)] hover:border-[rgba(0,255,204,0.22)] transition-all"
          aria-label="Account menu"
        >
          <div className="hidden lg:block text-right">
            <p className="text-[12px] font-semibold text-white leading-tight">Alexander Noble</p>
            <p className="text-[10px] uppercase tracking-wide" style={{ color: `${roleColor}90` }}>{role}</p>
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-display flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${roleColor}30, ${roleColor}10)`, border: `1px solid ${roleColor}30`, color: roleColor }}
          >
            AN
          </div>
        </button>

        {profileDropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-56 glass-modal rounded-2xl overflow-hidden shadow-2xl dropdown-enter"
            style={{ zIndex: 9999 }}
          >
            <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)]">
              <p className="text-[13px] font-semibold text-white">Alexander Noble</p>
              <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">admin@noblefunded.com</p>
              <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}25` }}>
                {role}
              </span>
            </div>
            <div className="py-1">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#a8c0b8] hover:text-white hover:bg-white/[0.04] transition-all"
                onClick={() => { setProfileDropdownOpen(false); onTabChange?.("account-settings"); }}
              >
                <Settings size={13} className="text-[#00ffcc]/60" />
                Account Settings
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#a8c0b8] hover:text-white hover:bg-white/[0.04] transition-all"
                onClick={() => { setProfileDropdownOpen(false); onTabChange?.("notifications"); }}
              >
                <Bell size={13} className="text-[#00ffcc]/60" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff4444]/15 text-[#ff6b6b]">{unreadCount}</span>
                )}
              </button>
            </div>
            <div className="border-t border-[rgba(0,255,204,0.06)] py-1">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#ff6b6b] hover:bg-[#ff4444]/08 transition-all"
                onClick={() => { setProfileDropdownOpen(false); onSignOut?.(); }}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
}
