"use client";

import { useState } from "react";
import { AlertTriangle, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const violations = [
  { id: "VIO-1029", trader: "Alex Thorne", account: "#NF-89220", type: "DRAWDOWN_BREACH", detail: "Daily drawdown exceeded 5% limit — 4.9% in 3h", severity: "CRITICAL", time: "1h ago", resolved: false },
  { id: "VIO-1028", trader: "Elena Vasquez", account: "#NF-89214", type: "OVERTRADING", detail: "89 trades placed in 4-hour window — suspicious pattern", severity: "HIGH", time: "5h ago", resolved: false },
  { id: "VIO-1027", trader: "David Kowalski", account: "#NF-89217", type: "LOSS_LIMIT", detail: "Phase 1 daily loss limit warning — 2.9% of 3% cap", severity: "MEDIUM", time: "8h ago", resolved: false },
  { id: "VIO-1026", trader: "Unknown User", account: "#NF-89288", type: "KYC_FAIL", detail: "Identity document failed verification — mismatch detected", severity: "HIGH", time: "2d ago", resolved: false },
  { id: "VIO-1025", trader: "Sarah Valerius", account: "#NF-89211", type: "DRAWDOWN_WARNING", detail: "Drawdown at 7.8% — approaching 10% max limit", severity: "MEDIUM", time: "1d ago", resolved: true },
  { id: "VIO-1024", trader: "Marcus Thorne", account: "#NF-89212", type: "INACTIVE_TRADING", detail: "No trades placed in 14-day window — account at risk", severity: "LOW", time: "5d ago", resolved: true },
];

const SEVERITY_STYLES: Record<string, string> = { CRITICAL: "chip-danger", HIGH: "chip-danger", MEDIUM: "chip-warning", LOW: "chip-neutral" };

export default function ViolationsView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = violations.filter((v) => {
    const matchSearch = v.trader.toLowerCase().includes(search.toLowerCase()) || v.type.includes(search.toUpperCase());
    const matchFilter = filter === "All" || (filter === "Open" && !v.resolved) || (filter === "Resolved" && v.resolved) || v.severity === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Violations Log</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">All rule breaches and compliance violations with resolution tracking.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Critical", value: "1", color: "text-[#ff6b6b]" },
          { label: "High", value: "2", color: "text-[#ff6b6b]" },
          { label: "Medium", value: "2", color: "text-[#ffbc7c]" },
          { label: "Resolved", value: "2", color: "text-[#00ffcc]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search violations..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Open", "Resolved", "CRITICAL", "HIGH", "MEDIUM"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === f ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2] hover:bg-[#0b2f2d]")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((v) => (
          <div key={v.id} className={cn("glass-card rounded-xl p-4 flex items-start gap-4 transition-all", v.resolved ? "opacity-60" : "")}>
            <div className={cn("w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center", v.severity === "CRITICAL" || v.severity === "HIGH" ? "bg-[#ff4444]/15" : v.severity === "MEDIUM" ? "bg-[#ffbc7c]/15" : "bg-[#b9cbc2]/10")}>
              <AlertTriangle size={16} className={v.severity === "CRITICAL" || v.severity === "HIGH" ? "text-[#ff6b6b]" : v.severity === "MEDIUM" ? "text-[#ffbc7c]" : "text-[#b9cbc2]/60"} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#b9cbc2]/50">{v.id}</span>
                <span className="text-xs font-mono text-[#00ffcc]/70 bg-[#00ffcc]/05 px-2 py-0.5 rounded">{v.type}</span>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", SEVERITY_STYLES[v.severity])}>{v.severity}</span>
                {v.resolved && <span className="chip-active text-[10px] px-2 py-0.5 rounded-full">RESOLVED</span>}
              </div>
              <p className="text-sm font-medium text-white">{v.trader} — {v.account}</p>
              <p className="text-xs text-[#b9cbc2]/70 mt-0.5">{v.detail}</p>
              <p className="text-[10px] text-[#b9cbc2]/40 mt-1">{v.time}</p>
            </div>
            {!v.resolved && (
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-all flex-shrink-0">
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
