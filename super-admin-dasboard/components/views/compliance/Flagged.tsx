"use client";

import { useState } from "react";
import { Flag, Eye, Ban, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const flagged = [
  { id: "#NF-89214", name: "Elena Vasquez", email: "e.vasquez@invest.io", reason: "Suspicious trading pattern — 89 trades in 4h", drawdown: 9.1, flaggedAt: "5h ago", risk: "HIGH", accountType: "$50k Phase 2" },
  { id: "#NF-89211", name: "Sarah Valerius", email: "s.valerius@fintech.com", reason: "Drawdown nearing breach — 7.8% of 10% limit", drawdown: 7.8, flaggedAt: "1d ago", risk: "MEDIUM", accountType: "$50k Phase 2" },
  { id: "#NF-89288", name: "Unknown User", email: "user8288@email.com", reason: "KYC document mismatch — photo ID invalid", drawdown: 0, flaggedAt: "2d ago", risk: "MEDIUM", accountType: "$25k Phase 1" },
];

interface FlaggedViewProps {
  onViewTrader?: (traderId: string) => void;
}

export default function FlaggedView({ onViewTrader }: FlaggedViewProps = {}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Flagged Accounts</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Accounts requiring immediate compliance review and intervention.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#ff4444]/10 border border-[#ff4444]/20">
          <AlertTriangle size={14} className="text-[#ff6b6b]" />
          <span className="text-sm font-semibold text-[#ff6b6b]">3 Active Flags</span>
        </div>
      </div>

      <div className="space-y-4">
        {flagged.map((account) => (
          <div key={account.id} className={cn("glass-card rounded-xl overflow-hidden border", account.risk === "HIGH" ? "border-[#ff4444]/30" : "border-[#ffbc7c]/20")}>
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", account.risk === "HIGH" ? "bg-[#ff4444]/15" : "bg-[#ffbc7c]/15")}>
                  <Flag size={16} className={account.risk === "HIGH" ? "text-[#ff6b6b]" : "text-[#ffbc7c]"} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-semibold text-white">{account.name}</p>
                    <span className="text-[10px] font-mono text-[#b9cbc2]/50">{account.id}</span>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", account.risk === "HIGH" ? "chip-danger" : "chip-warning")}>{account.risk} RISK</span>
                  </div>
                  <p className="text-xs text-[#b9cbc2]/70 mb-1">{account.email} • {account.accountType}</p>
                  <p className="text-sm text-white">{account.reason}</p>
                  <p className="text-[10px] text-[#b9cbc2]/40 mt-1">Flagged {account.flaggedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onViewTrader ? onViewTrader(account.id) : setSelected(selected === account.id ? null : account.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
                  <Eye size={12} /> Review
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff4444]/10 border border-[#ff4444]/20 text-xs text-[#ff6b6b] hover:bg-[#ff4444]/20 transition-all">
                  <Ban size={12} /> Suspend
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-xs text-[#00ffcc] hover:bg-[#00ffcc]/20 transition-all">
                  <RefreshCw size={12} /> Clear Flag
                </button>
              </div>
            </div>

            {selected === account.id && (
              <div className="border-t border-[rgba(0,255,204,0.08)] px-5 py-4 bg-[#0b2f2d]/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Current Drawdown", value: `${account.drawdown}%`, color: account.drawdown > 8 ? "text-[#ff6b6b]" : "text-[#ffbc7c]" },
                    { label: "Account Type", value: account.accountType, color: "text-white" },
                    { label: "Risk Level", value: account.risk, color: account.risk === "HIGH" ? "text-[#ff6b6b]" : "text-[#ffbc7c]" },
                    { label: "Flagged", value: account.flaggedAt, color: "text-[#b9cbc2]" },
                  ].map((d) => (
                    <div key={d.label}>
                      <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{d.label}</p>
                      <p className={`text-sm font-semibold ${d.color}`}>{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <textarea
                    placeholder="Add compliance note..."
                    className="flex-1 input-field bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30 resize-none h-16"
                  />
                  <button className="btn-primary px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold self-end">Save Note</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
