"use client";

import { Monitor, Flag, AlertTriangle, FileText, TrendingUp, CheckCircle } from "lucide-react";

export default function ComplianceOverview({ onTabChange }: { onTabChange: (tab: string) => void }) {
  return (
    <div className="page-fade space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Compliance Overview</h1>
        <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Platform-wide risk posture and regulatory status.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Compliance Score", value: "94.2%", badge: "EXCELLENT", icon: CheckCircle, color: "#00ffcc" },
          { label: "Active Monitors", value: "1,847", badge: "LIVE", icon: Monitor, color: "#00ffcc" },
          { label: "Flagged Accounts", value: "3", badge: "REVIEW", icon: Flag, color: "#ffbc7c" },
          { label: "Open Violations", value: "12", badge: "ACTION NEEDED", icon: AlertTriangle, color: "#ff6b6b" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center">
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: kpi.color }}>{kpi.badge}</span>
            </div>
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/60 uppercase mb-1">{kpi.label}</p>
            <p className="text-xl font-bold font-display text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Risk Distribution</h2>
          <div className="space-y-3">
            {[
              { label: "Low Risk Accounts", pct: 76, color: "#00ffcc" },
              { label: "Medium Risk", pct: 18, color: "#ffbc7c" },
              { label: "High Risk / Flagged", pct: 6, color: "#ff6b6b" },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#b9cbc2]/70">{r.label}</span>
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.pct}%</span>
                </div>
                <div className="h-2 bg-[#0b2f2d] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Review Flagged Accounts", tab: "flagged", icon: Flag },
              { label: "Monitor Live Traders", tab: "monitor", icon: Monitor },
              { label: "Review Violations", tab: "violations", icon: AlertTriangle },
              { label: "Generate Report", tab: "reports", icon: FileText },
            ].map((a) => (
              <button
                key={a.tab}
                onClick={() => onTabChange(a.tab)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0b2f2d]/40 hover:bg-[#00ffcc]/08 border border-[rgba(0,255,204,0.08)] hover:border-[#00ffcc]/20 text-sm text-[#b9cbc2] hover:text-white transition-all group"
              >
                <a.icon size={14} className="text-[#00ffcc]/60 group-hover:text-[#00ffcc]" />
                <span className="flex-1 text-left">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold font-display text-white mb-4">Recent Compliance Events</h2>
        <div className="space-y-3">
          {[
            { text: "Drawdown alert — Alex Thorne exceeded 9% daily limit", time: "1h ago", sev: "danger" },
            { text: "KYC document rejected — ID mismatch for User #NF-89288", time: "3h ago", sev: "warning" },
            { text: "Suspicious trading pattern detected — Account #NF-89214", time: "5h ago", sev: "warning" },
            { text: "Payout cleared compliance review — ₦2.8M batch", time: "8h ago", sev: "success" },
          ].map((event, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${event.sev === "danger" ? "border-[#ff4444]/20 bg-[#ff4444]/05" : event.sev === "warning" ? "border-[#ffbc7c]/20 bg-[#ffbc7c]/05" : "border-[#00ffcc]/15 bg-[#00ffcc]/05"}`}>
              <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${event.sev === "danger" ? "bg-[#ff6b6b]" : event.sev === "warning" ? "bg-[#ffbc7c]" : "bg-[#00ffcc]"}`} />
              <div>
                <p className="text-xs text-white">{event.text}</p>
                <p className="text-[10px] text-[#b9cbc2]/40 mt-0.5">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
