"use client";

import { useState } from "react";
import { Download, Plus, Eye, Edit, TrendingUp, TrendingDown, Trophy, DollarSign, CheckCircle, XCircle, X, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

type ChallengeStatus = "ACTIVE" | "PASSED" | "FAILED" | "DISABLED";

interface Challenge {
  id: string;
  mt5: string;
  user: string;
  email: string;
  type: string;
  startBal: string;
  currentBal: string;
  pl: string;
  plRaw: number;
  status: ChallengeStatus;
  daysRemaining: number;
  phase: string;
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: "#CH-99281", mt5: "882010", user: "Alex Sterling", email: "alex.s@tradenet.io", type: "DOLLAR/PHASE 1", startBal: "$50,000.00", currentBal: "$54,230.15", pl: "+8.46%", plRaw: 8.46, status: "ACTIVE", daysRemaining: 22, phase: "Phase 1" },
  { id: "#CH-98112", mt5: "881092", user: "Sarah Chen", email: "sarah.c@fintech.com", type: "NAIRA/FUNDED", startBal: "₦10,000,000", currentBal: "₦11,200,000", pl: "+12.0%", plRaw: 12.0, status: "PASSED", daysRemaining: 0, phase: "Funded" },
  { id: "#CH-97003", mt5: "881554", user: "Marcus Thorne", email: "mthorne@pro.net", type: "DOLLAR/PHASE 2", startBal: "$100,000.00", currentBal: "$94,000.00", pl: "-6.00%", plRaw: -6.0, status: "FAILED", daysRemaining: 0, phase: "Phase 2" },
  { id: "#CH-96221", mt5: "880341", user: "Ayo Tobi", email: "ayo.t@gmail.com", type: "DOLLAR/PHASE 1", startBal: "$25,000.00", currentBal: "$27,450.00", pl: "+9.8%", plRaw: 9.8, status: "ACTIVE", daysRemaining: 18, phase: "Phase 1" },
  { id: "#CH-95819", mt5: "879211", user: "Elena Vasquez", email: "e.v@invest.io", type: "NAIRA/PHASE 1", startBal: "₦2,500,000", currentBal: "₦2,380,000", pl: "-4.8%", plRaw: -4.8, status: "ACTIVE", daysRemaining: 9, phase: "Phase 1" },
  { id: "#CH-95100", mt5: "878901", user: "Jiro Tanaka", email: "jiro.t@trade.jp", type: "DOLLAR/FUNDED", startBal: "$200,000.00", currentBal: "$218,400.00", pl: "+9.2%", plRaw: 9.2, status: "PASSED", daysRemaining: 0, phase: "Funded" },
  { id: "#CH-94500", mt5: "878000", user: "Emeka Bakare", email: "emeka@ng.io", type: "NAIRA/PHASE 2", startBal: "₦5,000,000", currentBal: "₦5,310,000", pl: "+6.2%", plRaw: 6.2, status: "ACTIVE", daysRemaining: 14, phase: "Phase 2" },
  { id: "#CH-93111", mt5: "877654", user: "Kwame Asante", email: "k.asante@trade.gh", type: "DOLLAR/PHASE 1", startBal: "$10,000.00", currentBal: "$9,020.00", pl: "-9.8%", plRaw: -9.8, status: "DISABLED", daysRemaining: 0, phase: "Phase 1" },
];

const statusStyles: Record<ChallengeStatus, string> = {
  ACTIVE: "chip-active",
  PASSED: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30",
  FAILED: "chip-danger",
  DISABLED: "chip-neutral",
};

interface ChallengesViewProps {
  onViewChallenge?: (challengeId: string) => void;
}

export default function ChallengesView({ onViewChallenge }: ChallengesViewProps = {}) {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [systemFilter, setSystemFilter] = useState<"ALL" | "NGN" | "USD">("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewChallenge, setViewChallenge] = useState<Challenge | null>(null);
  const [editChallenge, setEditChallenge] = useState<Challenge | null>(null);

  const filtered = challenges.filter((c) => {
    const matchStatus = statusFilter === "All Statuses" || c.status === statusFilter;
    const matchType = typeFilter === "All Types" || c.type.includes(typeFilter);
    const matchSystem =
      systemFilter === "ALL" ||
      (systemFilter === "NGN" && c.type.includes("NAIRA")) ||
      (systemFilter === "USD" && c.type.includes("DOLLAR"));
    return matchStatus && matchType && matchSystem;
  });

  const disableChallenge = (id: string) => {
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "DISABLED" ? "ACTIVE" : "DISABLED" } : c));
    setViewChallenge(null);
  };

  const saveEdit = () => {
    if (!editChallenge) return;
    setChallenges((prev) => prev.map((c) => c.id === editChallenge.id ? editChallenge : c));
    setEditChallenge(null);
  };

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white text-balance">Challenges Management</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">
            Real-time oversight of all trading evaluations. Eligible traders receive an{" "}
            <span className="text-[#00ffcc] font-semibold">80% profit split</span> upon successful funding.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
            <Download size={14} /> Export to CSV
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
            <Plus size={14} /> New Challenge
          </button>
        </div>
      </div>

      {/* System Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-[rgba(0,255,204,0.08)] rounded-xl w-fit">
        {([
          { value: "ALL", label: "All Systems" },
          { value: "NGN", label: "₦ Naira" },
          { value: "USD", label: "$ Dollar" },
        ] as const).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSystemFilter(opt.value)}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={
              systemFilter === opt.value
                ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc", border: "1px solid rgba(0,255,204,0.25)" }
                : { color: "#a8c0b8" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
            {["All Statuses", "ACTIVE", "PASSED", "FAILED", "DISABLED"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Account Type:</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
            {["All Types", "DOLLAR", "NAIRA", "PHASE 1", "PHASE 2", "FUNDED"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">From:</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
          <span className="text-[#b9cbc2]/40">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <button
          onClick={() => { setStatusFilter("All Statuses"); setTypeFilter("All Types"); setDateFrom(""); setDateTo(""); }}
          className="px-4 py-2 rounded-lg border border-[rgba(0,255,204,0.15)] text-xs font-semibold text-[#b9cbc2] hover:text-white uppercase tracking-widest transition-all"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["Challenge ID", "User", "Type", "Starting Bal.", "Current Bal.", "P/L %", "Days Left", "Status", "Actions"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ch) => (
              <tr key={ch.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)] cursor-pointer" onClick={() => setViewChallenge(ch)}>
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-[#00ffcc] font-mono">{ch.id}</p>
                  <p className="text-[10px] text-[#b9cbc2]/40">MT5: {ch.mt5}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0b2f2d] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                      {ch.user.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm text-white">{ch.user}</p>
                      <p className="text-[10px] text-[#b9cbc2]/40">{ch.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-[#0b2f2d] text-[#b9cbc2] border border-[rgba(0,255,204,0.1)]">{ch.type}</span>
                </td>
                <td className="px-4 py-3.5 text-sm text-[#b9cbc2]">{ch.startBal}</td>
                <td className="px-4 py-3.5 text-sm font-semibold font-display text-white">{ch.currentBal}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-sm font-bold font-display flex items-center gap-1", ch.plRaw >= 0 ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                    {ch.plRaw >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {ch.pl}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {ch.daysRemaining > 0 ? (
                    <span className={cn("text-xs font-medium", ch.daysRemaining <= 7 ? "text-[#ffbc7c]" : "text-[#b9cbc2]")}>
                      {ch.daysRemaining}d
                    </span>
                  ) : (
                    <span className="text-xs text-[#b9cbc2]/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", statusStyles[ch.status])}>{ch.status}</span>
                </td>
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewChallenge(ch)}
                      className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 transition-all text-[#00ffcc]/60 hover:text-[#00ffcc]"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => setEditChallenge({ ...ch })}
                      className="p-1.5 rounded-lg hover:bg-[#ffbc7c]/10 transition-all text-[#b9cbc2]/50 hover:text-[#ffbc7c]"
                    >
                      <Edit size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,255,204,0.06)]">
          <p className="text-xs text-[#b9cbc2]/60">Showing 1–{filtered.length} of <span className="text-white">1,240</span> challenges</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn("w-7 h-7 rounded-lg text-xs font-semibold", p === 1 ? "bg-[#00ffcc] text-[#001716]" : "text-[#b9cbc2] hover:bg-[#0b2f2d]")}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Managed Capital", value: systemFilter === "NGN" ? "₦4.8B" : systemFilter === "USD" ? "$4.2M" : "₦4.8B + $4.2M", sub: "+12% vs last month", icon: DollarSign, color: "#00ffcc" },
          { label: "Active Challenges", value: systemFilter === "NGN" ? "632" : systemFilter === "USD" ? "389" : "854", sub: "+5% growth rate", icon: Trophy, color: "#00ffcc" },
          { label: "Success Rate", value: systemFilter === "NGN" ? "15.8%" : systemFilter === "USD" ? "11.4%" : "14.2%", sub: "Phase 1 pass rate", icon: CheckCircle, color: "#ffbc7c" },
          { label: "Payouts Pending", value: systemFilter === "NGN" ? "₦780K" : systemFilter === "USD" ? "$18.4K" : "₦780K + $18.4K", sub: "80/20 split enabled", icon: XCircle, color: "#ff6b6b" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-2">{s.label}</p>
            <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#b9cbc2]/40 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* View Detail Modal */}
      {viewChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewChallenge(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Challenge {viewChallenge.id}</h3>
              <button onClick={() => setViewChallenge(null)} className="text-[#b9cbc2]/50 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Trader", value: viewChallenge.user },
                { label: "Email", value: viewChallenge.email },
                { label: "MT5 Login", value: viewChallenge.mt5 },
                { label: "Account Type", value: viewChallenge.type },
                { label: "Phase", value: viewChallenge.phase },
                { label: "Starting Balance", value: viewChallenge.startBal },
                { label: "Current Balance", value: viewChallenge.currentBal },
                { label: "P/L", value: viewChallenge.pl },
                { label: "Days Remaining", value: viewChallenge.daysRemaining > 0 ? `${viewChallenge.daysRemaining} days` : "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm border-b border-[rgba(0,255,204,0.06)] pb-2.5">
                  <span className="text-[#b9cbc2]/50">{row.label}</span>
                  <span className={cn("font-medium", row.label === "P/L" ? (viewChallenge.plRaw >= 0 ? "text-[#00ffcc] font-bold" : "text-[#ff6b6b] font-bold") : "text-white")}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#b9cbc2]/50">Status</span>
                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", statusStyles[viewChallenge.status])}>{viewChallenge.status}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              {onViewChallenge && (
                <button
                  onClick={() => { onViewChallenge(viewChallenge.id); setViewChallenge(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all"
                >
                  Full Detail
                </button>
              )}
              <button
                onClick={() => { setEditChallenge({ ...viewChallenge }); setViewChallenge(null); }}
                className="flex-1 py-2.5 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-sm font-semibold hover:bg-[#00ffcc]/20 transition-all"
              >
                <Edit size={13} className="inline mr-1.5" />Edit
              </button>
              <button
                onClick={() => disableChallenge(viewChallenge.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                  viewChallenge.status === "DISABLED"
                    ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                    : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
                )}
              >
                <Ban size={13} className="inline mr-1.5" />{viewChallenge.status === "DISABLED" ? "Re-enable" : "Disable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Edit Challenge</h3>
              <button onClick={() => setEditChallenge(null)} className="text-[#b9cbc2]/50 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Status</label>
                <select
                  value={editChallenge.status}
                  onChange={(e) => setEditChallenge({ ...editChallenge, status: e.target.value as ChallengeStatus })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                >
                  {["ACTIVE", "PASSED", "FAILED", "DISABLED"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Current Balance</label>
                <input
                  type="text"
                  value={editChallenge.currentBal}
                  onChange={(e) => setEditChallenge({ ...editChallenge, currentBal: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Days Remaining</label>
                <input
                  type="number"
                  value={editChallenge.daysRemaining}
                  onChange={(e) => setEditChallenge({ ...editChallenge, daysRemaining: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditChallenge(null)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2] hover:text-white transition-all">Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-bold hover:bg-[#00e6b8] transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
