"use client";

import { useState } from "react";
import {
  Bell, CheckCheck, Trash2, AlertTriangle, Info,
  CheckCircle, XCircle, CreditCard, User, Shield, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, ROLE_NOTIFICATIONS, RoleNotification, NotifType } from "@/lib/types";

const TYPE_CONFIG: Record<NotifType, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  label: string;
}> = {
  success: { icon: CheckCircle, color: "text-[#00ffcc]", bg: "bg-[#00ffcc]/10", label: "Success" },
  warning: { icon: AlertTriangle, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", label: "Warning" },
  danger: { icon: XCircle, color: "text-[#ff4444]", bg: "bg-[#ff4444]/10", label: "Alert" },
  info: { icon: Info, color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/10", label: "Info" },
  payout: { icon: CreditCard, color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10", label: "Payout" },
  user: { icon: User, color: "text-[#34d399]", bg: "bg-[#34d399]/10", label: "User" },
  system: { icon: Shield, color: "text-[#94a3b8]", bg: "bg-[#94a3b8]/10", label: "System" },
};

const ROLE_COLORS: Record<Role, string> = {
  "Super Admin": "#00ffcc",
  "Compliance": "#60a5fa",
  "Support": "#f59e0b",
  "Marketing": "#a78bfa",
  "Developer": "#34d399",
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  "Super Admin": "Platform-wide alerts, financial events, system activity",
  "Compliance": "Payout reviews, drawdown alerts, KYC flags, violations",
  "Support": "Ticket assignments, user requests, escalations",
  "Marketing": "Campaign updates, traffic alerts, conversion changes",
  "Developer": "Error spikes, deployment events, database alerts",
};

interface NotificationsViewProps {
  role?: Role;
}

export default function NotificationsView({ role = "Super Admin" }: NotificationsViewProps) {
  const baseNotifications = ROLE_NOTIFICATIONS[role] || [];
  const [notifications, setNotifications] = useState<RoleNotification[]>(baseNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const roleColor = ROLE_COLORS[role];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Build dynamic categories from the current role's notifications
  const categories = ["All", ...Array.from(new Set(notifications.map((n) => n.category)))];

  const filtered = notifications.filter((n) => {
    const matchesRead = filter === "all" || !n.read;
    const matchesCat = selectedCategory === "All" || n.category === selectedCategory;
    return matchesRead && matchesCat;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <div className="page-fade space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${roleColor}18`, border: `1px solid ${roleColor}28` }}>
              <Bell size={16} style={{ color: roleColor }} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#ff4444]/15 text-[#ff6b6b] text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
          <p className="text-[#a8c0b8]/60 text-[13px]">{ROLE_DESCRIPTIONS[role]}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all hover:bg-white/[0.04]"
              style={{ color: roleColor, borderColor: `${roleColor}25` }}
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-[#ff6b6b] border border-[#ff4444]/20 hover:bg-[#ff4444]/08 transition-all"
          >
            <Trash2 size={13} /> Clear all
          </button>
        </div>
      </div>

      {/* Role badge + filter row */}
      <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}28` }}
          >
            {role}
          </span>
          <span className="text-[12px] text-[#a8c0b8]/60">Showing role-filtered alerts only</span>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all",
                filter === f
                  ? "text-white"
                  : "text-[#a8c0b8]/60 border border-transparent hover:border-[rgba(0,255,204,0.1)]"
              )}
              style={filter === f ? { background: `${roleColor}18`, border: `1px solid ${roleColor}28`, color: roleColor } : {}}
            >
              {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter size={13} className="text-[#a8c0b8]/40 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-medium transition-all border",
              selectedCategory === cat
                ? "text-white"
                : "text-[#a8c0b8]/50 border-[rgba(0,255,204,0.07)] hover:text-white hover:border-[rgba(0,255,204,0.15)]"
            )}
            style={selectedCategory === cat ? { background: `${roleColor}15`, borderColor: `${roleColor}25`, color: roleColor } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-14 text-center">
            <Bell size={32} className="text-[#a8c0b8]/15 mx-auto mb-3" />
            <p className="text-[#a8c0b8]/50 text-[13px] font-medium">No notifications to show</p>
            <p className="text-[#a8c0b8]/30 text-[11px] mt-1">
              {filter === "unread" ? "All caught up!" : "Nothing in this category yet"}
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const typeConf = TYPE_CONFIG[notif.type];
            const TypeIcon = typeConf.icon;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "glass-card rounded-xl px-4 py-3.5 flex items-start gap-4 cursor-pointer transition-all hover:border-[rgba(0,255,204,0.2)] group",
                  !notif.read && "border-l-2"
                )}
                style={!notif.read ? { borderLeftColor: roleColor } : {}}
              >
                {/* Icon */}
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", typeConf.bg)}>
                  <TypeIcon size={16} className={typeConf.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-semibold leading-tight", notif.read ? "text-[#a8c0b8]" : "text-white")}>
                        {notif.title}
                      </p>
                      <p className="text-[12px] text-[#a8c0b8]/55 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: roleColor }} />
                      )}
                      <span className="text-[10px] text-[#a8c0b8]/35 whitespace-nowrap">{notif.time}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 text-[#a8c0b8]/25 hover:text-[#ff6b6b] transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#a8c0b8]/45 border border-white/[0.06]">
                      {notif.category}
                    </span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", typeConf.bg)}>
                      <span className={typeConf.color}>{typeConf.label}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
