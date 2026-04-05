"use client";

import { useState, useEffect } from "react";
import { Download, Search, Filter, RefreshCw, CheckCircle, AlertCircle, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface ActivityLog {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  severity: string;
  actionType?: string;
  user?: {
    name: string;
    email: string;
  };
}

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
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [actionTypes, setActionTypes] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [logsRes, statsRes] = await Promise.all([
        api.get("admin/activity-logs?limit=50"),
        api.get("admin/activity-logs/stats?days=1")
      ]);

      const logsData = logsRes.data?.logs || [];
      setLogs(logsData.map((l: any) => ({
        id: l.id?.toString() || `LOG-${Math.random().toString(36).substr(2, 9)}`,
        time: l.createdAt ? new Date(l.createdAt).toLocaleString() : "Just now",
        actor: l.user?.name || l.actionType || "System",
        action: l.action || l.actionType || "UNKNOWN",
        target: l.description || l.action || "-",
        ip: l.ipAddress || "N/A",
        severity: mapActionToSeverity(l.actionType || l.action),
        actionType: l.actionType,
        user: l.user
      })));
      
      setStats(statsRes.data);
      
      if (logsRes.data?.filters?.actionTypes) {
        setActionTypes(logsRes.data.filters.actionTypes);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const mapActionToSeverity = (action: string): string => {
    if (!action) return "info";
    const lower = action.toLowerCase();
    if (lower.includes("approved") || lower.includes("success") || lower.includes("resolved")) return "success";
    if (lower.includes("rejected") || lower.includes("failed") || lower.includes("alert")) return "danger";
    if (lower.includes("flagged") || lower.includes("warning") || lower.includes("kyc")) return "warning";
    return "info";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filtered = logs.filter((l) => {
    const matchSearch = l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "All" || l.severity === severityFilter.toLowerCase();
    return matchSearch && matchSeverity;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#00ffcc] animate-spin" />
        <p className="text-sm text-[#a8c0b8]">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Activity Logs</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Immutable audit trail for all institutional administrative actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all disabled:opacity-50">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Events (24h)", value: stats?.todayEvents?.toLocaleString() || "0" },
          { label: "Admin Actions", value: stats?.byType?.ADMIN?.toLocaleString() || stats?.totalEvents?.toLocaleString() || "0", color: "text-[#00ffcc]" },
          { label: "System Alerts", value: (stats?.byType?.SYSTEM || 0).toLocaleString(), color: "text-[#ffbc7c]" },
          { label: "Critical Events", value: ((stats?.byType?.DANGER || 0) + (stats?.byType?.FAILED || 0)).toLocaleString(), color: "text-[#ff6b6b]" },
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#b9cbc2]/50">
                  No activity logs found
                </td>
              </tr>
            ) : (
              filtered.map((log) => {
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
              })
            )}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] flex items-center justify-between">
          <p className="text-xs text-[#b9cbc2]/50">Showing {filtered.length} of {stats?.totalEvents?.toLocaleString() || logs.length} log entries • Immutable ledger active</p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#00ffcc]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] pulse-dot" />
            REAL-TIME AUDIT ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}