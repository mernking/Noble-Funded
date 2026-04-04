"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const payouts = [
  { id: "PAY-8821", trader: "Felix Henderson", account: "#NF-89210", amount: "$4,200", method: "Bank Transfer", submitted: "2h ago", risk: "LOW", status: "PENDING" },
  { id: "PAY-8820", trader: "Ayo Tobi", account: "#NF-89213", amount: "$16,400", method: "USDT TRC20", submitted: "5h ago", risk: "LOW", status: "PENDING" },
  { id: "PAY-8819", trader: "Sarah Valerius", account: "#NF-89211", amount: "$1,800", method: "Bank Transfer", submitted: "8h ago", risk: "MEDIUM", status: "REVIEW" },
  { id: "PAY-8818", trader: "Elena Vasquez", account: "#NF-89214", amount: "$2,600", method: "USDC", submitted: "12h ago", risk: "HIGH", status: "HOLD" },
  { id: "PAY-8817", trader: "Priya Sharma", account: "#NF-89216", amount: "$5,700", method: "Bank Transfer", submitted: "1d ago", risk: "LOW", status: "APPROVED" },
  { id: "PAY-8816", trader: "James Okafor", account: "#NF-89215", amount: "$1,100", method: "USDT TRC20", submitted: "2d ago", risk: "LOW", status: "APPROVED" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "chip-neutral",
  REVIEW: "chip-warning",
  HOLD: "chip-danger",
  APPROVED: "chip-active",
};

const RISK_COLORS: Record<string, string> = {
  LOW: "chip-active",
  MEDIUM: "chip-warning",
  HIGH: "chip-danger",
};

interface CompliancePayoutsViewProps {
  onViewPayout?: (payoutId: string) => void;
}

export default function CompliancePayoutsView({ onViewPayout }: CompliancePayoutsViewProps = {}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = payouts.filter((p) => {
    const matchSearch = p.trader.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Payouts Review</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Compliance screening for all pending payout requests.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending Review", value: "8", color: "text-white" },
          { label: "On Hold", value: "2", color: "text-[#ff6b6b]" },
          { label: "Approved Today", value: "14", color: "text-[#00ffcc]" },
          { label: "Total Value", value: "$124K", color: "text-[#ffbc7c]" },
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payout ID or trader..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <div className="flex gap-1.5">
          {["All", "PENDING", "REVIEW", "HOLD", "APPROVED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", statusFilter === s ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2] hover:bg-[#0b2f2d]")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["PAY ID", "TRADER", "AMOUNT", "METHOD", "SUBMITTED", "RISK", "STATUS", "ACTIONS"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-[#00ffcc]/70">{p.id}</span></td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-white">{p.trader}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50">{p.account}</p>
                </td>
                <td className="px-4 py-3.5"><span className="text-sm font-bold font-display text-white">{p.amount}</span></td>
                <td className="px-4 py-3.5"><span className="text-xs text-[#b9cbc2]">{p.method}</span></td>
                <td className="px-4 py-3.5"><span className="text-xs text-[#b9cbc2]/70">{p.submitted}</span></td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", RISK_COLORS[p.risk])}>{p.risk}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_COLORS[p.status])}>
                    {p.status === "APPROVED" && <CheckCircle size={10} />}
                    {p.status === "HOLD" && <XCircle size={10} />}
                    {(p.status === "PENDING" || p.status === "REVIEW") && <Clock size={10} />}
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {onViewPayout && (
                      <button
                        onClick={() => onViewPayout(p.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 transition-all"
                      >
                        <Eye size={12} />
                      </button>
                    )}
                    {(p.status === "PENDING" || p.status === "REVIEW") && (
                      <>
                        <button className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-all">Approve</button>
                        <button className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#ff4444]/10 text-[#ff6b6b] border border-[#ff4444]/20 hover:bg-[#ff4444]/20 transition-all">Hold</button>
                      </>
                    )}
                    {p.status === "HOLD" && (
                      <button className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20">Release</button>
                    )}
                    {p.status === "APPROVED" && <span className="text-[10px] text-[#b9cbc2]/40">Processed</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
