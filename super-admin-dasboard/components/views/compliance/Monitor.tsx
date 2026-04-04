"use client";

import { useState } from "react";
import { Search, RefreshCw, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const traders = [
  { id: "#NF-89210", name: "Felix Henderson", account: "$100k Funded", drawdown: 2.1, dailyDD: 0.8, profit: 4.2, status: "LOW", trades: 12 },
  { id: "#NF-89211", name: "Sarah Valerius", account: "$50k Phase 2", drawdown: 7.8, dailyDD: 3.2, profit: -1.8, status: "MEDIUM", trades: 34 },
  { id: "#NF-89213", name: "Ayo Tobi", account: "$200k Funded", drawdown: 1.4, dailyDD: 0.3, profit: 8.2, status: "LOW", trades: 8 },
  { id: "#NF-89214", name: "Elena Vasquez", account: "$50k Phase 2", drawdown: 9.1, dailyDD: 4.8, profit: -3.4, status: "HIGH", trades: 89 },
  { id: "#NF-89220", name: "Alex Thorne", account: "$25k Phase 1", drawdown: 9.8, dailyDD: 4.9, profit: -2.1, status: "HIGH", trades: 102 },
  { id: "#NF-89215", name: "James Okafor", account: "$25k Phase 1", drawdown: 3.2, dailyDD: 1.1, profit: 1.1, status: "LOW", trades: 19 },
  { id: "#NF-89216", name: "Priya Sharma", account: "$100k Funded", drawdown: 4.5, dailyDD: 1.8, profit: 5.7, status: "LOW", trades: 27 },
  { id: "#NF-89217", name: "David Kowalski", account: "$25k Phase 1", drawdown: 6.2, dailyDD: 2.9, profit: -0.9, status: "MEDIUM", trades: 44 },
];

const STATUS_COLORS: Record<string, string> = {
  LOW: "chip-active",
  MEDIUM: "chip-warning",
  HIGH: "chip-danger",
};

export default function ComplianceMonitor() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = traders.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchRisk = riskFilter === "All" || t.status === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Live Monitor</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Real-time drawdown surveillance and risk monitoring for all active accounts.</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Live Refresh
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Live Traders", value: "1,847", color: "text-[#00ffcc]" },
          { label: "High Risk Accounts", value: "2", color: "text-[#ff6b6b]" },
          { label: "Avg Drawdown", value: "4.8%", color: "text-[#ffbc7c]" },
          { label: "Near Breach", value: "5", color: "text-[#ffbc7c]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search trader or account ID..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <div className="flex gap-1.5">
          {["All", "LOW", "MEDIUM", "HIGH"].map((r) => (
            <button key={r} onClick={() => setRiskFilter(r)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", riskFilter === r ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2] hover:bg-[#0b2f2d]")}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Monitor Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["TRADER", "ACCOUNT", "DRAWDOWN", "DAILY DD", "P&L", "TRADES", "RISK", ""].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className={cn("table-row-hover border-b border-[rgba(0,255,204,0.04)]", t.status === "HIGH" && "bg-[#ff4444]/03")}>
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-[10px] text-[#b9cbc2]/50">{t.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{t.account}</td>
                <td className="px-4 py-3.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-sm font-bold font-display", t.drawdown > 8 ? "text-[#ff6b6b]" : t.drawdown > 5 ? "text-[#ffbc7c]" : "text-[#00ffcc]")}>{t.drawdown}%</span>
                    </div>
                    <div className="w-20 h-1 bg-[#0b2f2d] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(t.drawdown / 10) * 100}%`, background: t.drawdown > 8 ? "#ff6b6b" : t.drawdown > 5 ? "#ffbc7c" : "#00ffcc" }} />
                    </div>
                  </div>
                </td>
                <td className={cn("px-4 py-3.5 text-sm font-semibold", t.dailyDD > 4 ? "text-[#ff6b6b]" : t.dailyDD > 2 ? "text-[#ffbc7c]" : "text-[#00ffcc]")}>{t.dailyDD}%</td>
                <td className="px-4 py-3.5">
                  <span className={cn("flex items-center gap-1 text-sm font-semibold", t.profit >= 0 ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                    {t.profit >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {t.profit >= 0 ? "+" : ""}{t.profit}%
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{t.trades}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_COLORS[t.status])}>
                    {t.status === "HIGH" && "• "}{t.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", t.status === "HIGH" ? "bg-[#ff4444]/10 text-[#ff6b6b] border border-[#ff4444]/20 hover:bg-[#ff4444]/20" : "border border-[rgba(0,255,204,0.15)] text-[#00ffcc]/70 hover:text-[#00ffcc]")}>
                    {t.status === "HIGH" ? "Intervene" : "Review"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] flex items-center justify-between">
          <p className="text-xs text-[#b9cbc2]/50">Monitoring {filtered.length} of 1,847 active accounts</p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#00ffcc]">
            <Activity size={10} className="pulse-dot" />
            LIVE MONITORING ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
