"use client";

import { useState } from "react";
import {
  ArrowLeft, ChevronRight, Shield, User, Mail, Phone, MapPin, Calendar,
  Clock, Activity, Lock, Unlock, Ban, CheckCircle, AlertTriangle,
  Edit, Eye, Download, Key, Cpu, BarChart2, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffDetailProps {
  staffId: string;
  onBack: () => void;
}

const STAFF_DATA: Record<string, {
  id: string; name: string; email: string; phone: string; location: string;
  role: string; department: string; status: string; joinedDate: string;
  lastLogin: string; lastIp: string; device: string; mfaEnabled: boolean;
  timezone: string; accessLevel: string;
  permissions: { module: string; read: boolean; write: boolean; approve: boolean; delete: boolean }[];
  activityLog: { action: string; time: string; ip: string; type: "success" | "warning" | "danger" | "info" }[];
  stats: { ticketsResolved?: number; payoutsProcessed?: number; flaggedAccounts?: number; deploysRun?: number; uptime?: string; avgResponseTime?: string };
  notes: string;
}> = {
  "NT-3301-S": {
    id: "NT-3301-S", name: "Marcus Chen", email: "m.chen@noblefunded.com", phone: "+1 415 555 0192",
    location: "San Francisco, USA", role: "Support", department: "Customer Experience",
    status: "SUSPENDED", joinedDate: "2025-06-12", lastLogin: "2026-03-28 09:14 UTC",
    lastIp: "22.109.4.19", device: "Chrome 122 / Windows 11", mfaEnabled: true,
    timezone: "America/Los_Angeles", accessLevel: "Level 2",
    permissions: [
      { module: "User Profiles", read: true, write: true, approve: false, delete: false },
      { module: "Support Tickets", read: true, write: true, approve: true, delete: false },
      { module: "Payouts", read: true, write: false, approve: false, delete: false },
      { module: "KYC Documents", read: true, write: false, approve: false, delete: false },
      { module: "Leaderboard", read: true, write: true, approve: false, delete: false },
      { module: "Admin Settings", read: false, write: false, approve: false, delete: false },
    ],
    activityLog: [
      { action: "Account suspended by Super Admin — Reason: Policy violation investigation", time: "2026-03-28 11:00 UTC", ip: "Admin", type: "danger" },
      { action: "Accessed user profile: Felix Henderson (#NF-89210)", time: "2026-03-28 09:16 UTC", ip: "22.109.4.19", type: "warning" },
      { action: "Logged in from San Francisco, USA", time: "2026-03-28 09:14 UTC", ip: "22.109.4.19", type: "info" },
      { action: "Resolved ticket #TKT-5012 — marked as closed", time: "2026-03-27 15:40 UTC", ip: "22.109.4.19", type: "success" },
      { action: "Replied to ticket #TKT-5009 — 3 messages", time: "2026-03-27 11:22 UTC", ip: "22.109.4.19", type: "info" },
      { action: "Exported user data — 42 records", time: "2026-03-26 14:00 UTC", ip: "22.109.4.19", type: "warning" },
    ],
    stats: { ticketsResolved: 284, avgResponseTime: "4.2 min" },
    notes: "Suspended pending investigation into unauthorized data export on March 26. Marcus accessed bulk user export outside normal working hours. HR notified. Review in progress.",
  },
  "NT-4421-Y": {
    id: "NT-4421-Y", name: "Elena Rodriguez", email: "e.rodriguez@noblefunded.com", phone: "+44 20 7946 0320",
    location: "London, UK", role: "Developer", department: "Engineering",
    status: "VERIFIED", joinedDate: "2025-03-01", lastLogin: "2026-04-01 13:45 UTC",
    lastIp: "45.12.98.22", device: "Firefox 124 / Ubuntu 22.04", mfaEnabled: true,
    timezone: "Europe/London", accessLevel: "Level 4",
    permissions: [
      { module: "System Logs", read: true, write: false, approve: false, delete: false },
      { module: "Error Tracker", read: true, write: true, approve: false, delete: true },
      { module: "Deployments", read: true, write: true, approve: true, delete: false },
      { module: "Database Monitor", read: true, write: false, approve: false, delete: false },
      { module: "Broker API", read: true, write: true, approve: false, delete: false },
      { module: "Admin Settings", read: false, write: false, approve: false, delete: false },
    ],
    activityLog: [
      { action: "Deployed v2.4.2 to production — all checks passed", time: "2026-04-01 13:00 UTC", ip: "45.12.98.22", type: "success" },
      { action: "Fixed error in /api/mt5/balance — 500 spike resolved", time: "2026-04-01 11:45 UTC", ip: "45.12.98.22", type: "success" },
      { action: "Pushed commit to staging — 14 files changed", time: "2026-04-01 10:20 UTC", ip: "45.12.98.22", type: "info" },
      { action: "Logged in from London, UK", time: "2026-04-01 09:00 UTC", ip: "45.12.98.22", type: "info" },
    ],
    stats: { deploysRun: 47, uptime: "99.9%" },
    notes: "Senior developer. Handles MT5 API integrations and deployment pipelines. Cleared for Level 4 access. No incidents on record.",
  },
};

const DEFAULT_STAFF = STAFF_DATA["NT-4421-Y"];

const statusStyles: Record<string, string> = {
  VERIFIED: "chip-active",
  FLAGGED: "chip-warning",
  SUSPENDED: "chip-danger",
};

const roleColors: Record<string, string> = {
  Admin: "text-[#00ffcc]",
  Developer: "text-[#34d399]",
  Compliance: "text-[#60a5fa]",
  Support: "text-[#f59e0b]",
  Marketing: "text-[#a78bfa]",
};

const activityColors = {
  success: "text-[#00ffcc]",
  warning: "text-[#f59e0b]",
  danger: "text-[#ff6b6b]",
  info: "text-[#60a5fa]",
};

const activityDots = {
  success: "bg-[#00ffcc]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ff4444]",
  info: "bg-[#60a5fa]",
};

type Tab = "overview" | "permissions" | "activity" | "notes";

export default function StaffDetail({ staffId, onBack }: StaffDetailProps) {
  const staff = STAFF_DATA[staffId] || DEFAULT_STAFF;
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [status, setStatus] = useState(staff.status);
  const [permissions, setPermissions] = useState(staff.permissions);

  const togglePermission = (moduleIndex: number, perm: "read" | "write" | "approve" | "delete") => {
    setPermissions(prev => prev.map((p, i) =>
      i === moduleIndex ? { ...p, [perm]: !p[perm] } : p
    ));
  };

  return (
    <div className="page-fade space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Team
        </button>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-[#b9cbc2]/60 font-mono">{staff.id}</span>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-white">{staff.name}</span>
      </div>

      {/* Hero */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4 justify-between flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold font-display flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)", color: "#00ffcc" }}
            >
              {staff.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl font-bold font-display text-white">{staff.name}</h1>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", statusStyles[status])}>{status}</span>
                <span className={cn("text-[11px] font-semibold", roleColors[staff.role])}>{staff.role}</span>
                <span className="text-[11px] text-[#b9cbc2]/40 font-mono">{staff.id}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#b9cbc2]/60 flex-wrap">
                <span className="flex items-center gap-1.5"><Mail size={11} />{staff.email}</span>
                <span className="flex items-center gap-1.5"><MapPin size={11} />{staff.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={11} />Joined {staff.joinedDate}</span>
                <span className="flex items-center gap-1.5 text-[#00ffcc]/70">
                  <Key size={11} /> {staff.accessLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <button
              onClick={() => setStatus(status === "SUSPENDED" ? "VERIFIED" : "SUSPENDED")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                status === "SUSPENDED"
                  ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                  : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
              )}
            >
              <Ban size={12} /> {status === "SUSPENDED" ? "Reinstate" : "Suspend"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold hover:bg-[#f59e0b]/20 transition-all">
              <Edit size={12} /> Edit Role
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-xs hover:text-white transition-all">
              <Download size={12} /> Export Log
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[rgba(0,255,204,0.08)]">
          {[
            { label: "Department", value: staff.department, color: "#ffffff" },
            { label: "Access Level", value: staff.accessLevel, color: "#00ffcc" },
            { label: "MFA Enabled", value: staff.mfaEnabled ? "Yes" : "No", color: staff.mfaEnabled ? "#00ffcc" : "#ff4444" },
            { label: "Last Active", value: staff.lastLogin.split(" ")[0], color: "#b9cbc2" },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-[10px] text-[#b9cbc2]/40 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-sm font-bold font-display" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(0,255,204,0.08)]">
        {(["overview", "permissions", "activity", "notes"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px",
              activeTab === tab ? "text-[#00ffcc] border-[#00ffcc]" : "text-[#b9cbc2]/50 border-transparent hover:text-[#b9cbc2]"
            )}
          >
            {tab === "activity" ? "Activity Log" : tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Account Info */}
          <div className="glass-card rounded-xl p-5 space-y-1">
            <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
              <User size={14} className="text-[#00ffcc]" /> Staff Details
            </h3>
            {[
              { label: "Staff ID", value: staff.id },
              { label: "Email", value: staff.email },
              { label: "Phone", value: staff.phone },
              { label: "Role", value: staff.role },
              { label: "Department", value: staff.department },
              { label: "Timezone", value: staff.timezone },
              { label: "Access Level", value: staff.accessLevel },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
                <span className="text-[11px] font-medium font-mono text-white">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="glass-card rounded-xl p-5 space-y-1">
            <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
              <Shield size={14} className="text-[#00ffcc]" /> Security & Session
            </h3>
            {[
              { label: "Last Login", value: staff.lastLogin },
              { label: "Last IP", value: staff.lastIp },
              { label: "Device", value: staff.device },
              { label: "MFA Status", value: staff.mfaEnabled ? "Enabled" : "Disabled", color: staff.mfaEnabled ? "text-[#00ffcc]" : "text-[#ff4444]" },
              { label: "Account Status", value: status, color: status === "VERIFIED" ? "text-[#00ffcc]" : "text-[#ff6b6b]" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
                <span className={cn("text-[11px] font-medium font-mono", (row as { color?: string }).color || "text-white")}>{row.value}</span>
              </div>
            ))}

            {/* Performance Stats */}
            <div className="mt-4 pt-4 border-t border-[rgba(0,255,204,0.06)]">
              <h4 className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-3">Performance</h4>
              <div className="grid grid-cols-2 gap-2">
                {staff.stats.ticketsResolved && (
                  <div className="bg-[#0b2f2d]/60 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold font-display text-[#00ffcc]">{staff.stats.ticketsResolved}</p>
                    <p className="text-[10px] text-[#b9cbc2]/40">Tickets Resolved</p>
                  </div>
                )}
                {staff.stats.avgResponseTime && (
                  <div className="bg-[#0b2f2d]/60 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold font-display text-white">{staff.stats.avgResponseTime}</p>
                    <p className="text-[10px] text-[#b9cbc2]/40">Avg Response</p>
                  </div>
                )}
                {staff.stats.deploysRun && (
                  <div className="bg-[#0b2f2d]/60 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold font-display text-[#00ffcc]">{staff.stats.deploysRun}</p>
                    <p className="text-[10px] text-[#b9cbc2]/40">Deploys Run</p>
                  </div>
                )}
                {staff.stats.uptime && (
                  <div className="bg-[#0b2f2d]/60 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold font-display text-white">{staff.stats.uptime}</p>
                    <p className="text-[10px] text-[#b9cbc2]/40">Uptime</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Permissions ── */}
      {activeTab === "permissions" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Lock size={14} className="text-[#00ffcc]" /> Module Permissions
            </h3>
            <p className="text-[11px] text-[#b9cbc2]/40">Click toggles to grant or revoke access</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Module</th>
                  {["Read", "Write", "Approve", "Delete"].map(col => (
                    <th key={col} className="text-center px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, i) => (
                  <tr key={perm.module} className="border-b border-[rgba(0,255,204,0.04)]">
                    <td className="px-4 py-3.5 text-sm text-white font-medium">{perm.module}</td>
                    {(["read", "write", "approve", "delete"] as const).map((key) => (
                      <td key={key} className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => togglePermission(i, key)}
                          className={cn(
                            "w-8 h-5 rounded-full relative transition-all flex-shrink-0 inline-flex items-center",
                            perm[key] ? "bg-[#00ffcc]/30 border border-[#00ffcc]/40" : "bg-[#0b2f2d] border border-[rgba(0,255,204,0.1)]"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute w-3.5 h-3.5 rounded-full transition-all",
                              perm[key] ? "left-[14px] bg-[#00ffcc]" : "left-[2px] bg-[#b9cbc2]/30"
                            )}
                          />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] flex items-center justify-between">
            <p className="text-[11px] text-[#b9cbc2]/40">Changes are staged — click Save to apply</p>
            <button className="px-4 py-2 rounded-xl bg-[#00ffcc] text-[#001716] text-xs font-bold btn-primary transition-all">
              Save Permissions
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Activity Log ── */}
      {activeTab === "activity" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)]">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Activity size={14} className="text-[#00ffcc]" /> Staff Activity Log
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {staff.activityLog.map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", activityDots[log.type])} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-medium", activityColors[log.type])}>{log.action}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-[#b9cbc2]/40">{log.time}</span>
                    <span className="text-[10px] text-[#b9cbc2]/30 font-mono">IP: {log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Notes ── */}
      {activeTab === "notes" && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
            <FileText size={14} className="text-[#00ffcc]" /> Internal Notes (HR / Admin)
          </h3>
          <div className={cn("rounded-xl px-4 py-3 border", status === "SUSPENDED" ? "bg-[#ff4444]/05 border-[#ff4444]/20" : "bg-[#0b2f2d]/40 border-[rgba(0,255,204,0.08)]")}>
            <p className="text-sm text-[#b9cbc2] leading-relaxed">{staff.notes}</p>
          </div>
          <p className="text-[10px] text-[#b9cbc2]/30">Visible to Super Admin only.</p>
        </div>
      )}
    </div>
  );
}
