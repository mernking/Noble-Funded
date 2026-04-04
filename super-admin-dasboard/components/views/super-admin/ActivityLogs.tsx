"use client";

import { useState } from "react";
import { Download, Search, Filter, RefreshCw, CheckCircle, AlertCircle, UserPlus, CreditCard, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const logs = [
  { id: "LOG-9910", time: "2 mins ago", actor: "Alexander Noble", action: "PAYOUT_APPROVED", target: "Jane Obi — ₦45,000", ip: "192.168.1.44", severity: "success" },
  { id: "LOG-9909", time: "14 mins ago", actor: "Sarah Jenkins", action: "USER_FLAGGED", target: "Account #NF-89214", ip: "82.33.11.04", severity: "warning" },
  { id: "LOG-9908", time: "45 mins ago", actor: "System", action: "DRAWDOWN_ALERT", target: "Alex Thorne — 91.4%", ip: "AUTO", severity: "danger" },
  { id: "LOG-9907", time: "1h ago", actor: "Marcus Chen", action: "TICKET_RESOLVED", target: "TKT-4821 — KYC Issue", ip: "22.109.4.19", severity: "success" },
  { id: "LOG-9906", time: "2h ago", actor: "Alexander Noble", action: "SETTINGS_CHANGED", target: "Profit Split: 75% → 80%", ip: "192.168.1.44", severity: "info" },
  { id: "LOG-9905", time: "3h ago", actor: "Priya Sharma", action: "CAMPAIGN_LAUNCHED", target: "Q1 Referral Campaign", ip: "104.22.8.91", severity: "info" },
  { id: "LOG-9904", time: "4h ago", actor: "Elena Rodriguez", action: "DEPLOY_TRIGGERED", target: "v2.4.1 — Production", ip: "45.12.98.22", severity: "success" },
  { id: "LOG-9903", time: "5h ago", actor: "System", action: "CHALLENGE_FAILED", target: "David Kowalski — Phase 1", ip: "AUTO", severity: "danger" },
  { id: "LOG-9902", time: "6h ago", actor: "Alexander Noble", action: "STAFF_ADDED", target: "Ade Williams — Support", ip: "192.168.1.44", severity: "success" },
  { id: "LOG-9901", time: "8h ago", actor: "System", action: "KYC_REJECTED", target: "User #NF-89288 — Doc Mismatch", ip: "AUTO", severity: "warning" },
];

const SEVERITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle,
  warning: AlertCircle,
  danger: AlertCircle,
  info: Settings,
};

const SEVERITY_COLORS: Record<string, string> = {
  success: "#00ffcc",
  warning: "#ffbc7c",
  danger: "#ff6b6b",
  info: "#b9cbc2",
};

const SEVERITY_BG: Record<string, string> = {
  success: "chip-active",
  warning: "chip-warning",
  danger: "chip-danger",
  info: "chip-neutral",
};

export default function ActivityLogsView() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = logs.filter((l) => {
    const matchSearch = l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "All" || l.severity === severityFilter.toLowerCase();
    return matchSearch && matchSeverity;
  });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Activity Logs</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Immutable audit trail for all institutional administrative actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Events (24h)", value: "2,847" },
          { label: "Admin Actions", value: "142", color: "text-[#00ffcc]" },
          { label: "System Alerts", value: "28", color: "text-[#ffbc7c]" },
          { label: "Critical Events", value: "6", color: "text-[#ff6b6b]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color || "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by actor, action, or target..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Severity:</span>
          <div className="flex gap-1.5">
            {["All", "Success", "Warning", "Danger", "Info"].map((s) => (
              <button key={s} onClick={() => setSeverityFilter(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", severityFilter === s ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2] hover:bg-[#0b2f2d]")}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["LOG ID", "TIMESTAMP", "ACTOR", "ACTION", "TARGET", "IP ADDRESS", "SEVERITY"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => {
              const Icon = SEVERITY_ICONS[log.severity] || CheckCircle;
              return (
                <tr key={log.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-[#00ffcc]/70">{log.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[#b9cbc2]/70">{log.time}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#0b2f2d] border border-[rgba(0,255,204,0.1)] flex items-center justify-center text-[9px] font-bold text-[#00ffcc]">
                        {log.actor === "System" ? "SY" : log.actor.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-xs text-white">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-[#00ffcc]/80 bg-[#00ffcc]/05 px-2 py-0.5 rounded">{log.action}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[#b9cbc2]">{log.target}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-mono text-[#b9cbc2]/50">{log.ip}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full", SEVERITY_BG[log.severity])}>
                      <Icon size={10} />
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] flex items-center justify-between">
          <p className="text-xs text-[#b9cbc2]/50">Showing {filtered.length} of 2,847 log entries • Immutable ledger active</p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#00ffcc]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] pulse-dot" />
            REAL-TIME AUDIT ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
