"use client";

import { useState } from "react";
import { Search, Download, Clock, CheckCircle, MoreVertical, Landmark, Bitcoin, X, AlertTriangle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type PayoutStatus = "PENDING" | "PROCESSING" | "FLAGGED" | "APPROVED" | "REJECTED";

interface Payout {
  id: string;
  trader: string;
  email: string;
  date: string;
  amount: string;
  method: string;
  methodIcon: React.ComponentType<{ size?: number; className?: string }>;
  status: PayoutStatus;
  notes?: string;
}

const INITIAL_PAYOUTS: Payout[] = [
  { id: "#PAY-8921", trader: "Ayo Tobi", email: "ayo.tobi@gmail.com", date: "Mar 31, 2:15 PM", amount: "₦1,250,000", method: "Bank Transfer", methodIcon: Landmark, status: "PENDING" },
  { id: "#PAY-8920", trader: "Sarah Nwosu", email: "snwosu_fx@yahoo.com", date: "Mar 31, 11:30 AM", amount: "₦2,800,000", method: "USDT (ERC20)", methodIcon: Bitcoin, status: "PROCESSING" },
  { id: "#PAY-8919", trader: "Alex Sterling", email: "alex.s@tradenet.io", date: "Mar 31, 10:00 AM", amount: "$1,840", method: "USDT (ERC20)", methodIcon: Bitcoin, status: "PENDING" },
  { id: "#PAY-8918", trader: "Musa Okoro", email: "musa.okoro@outlook.com", date: "Mar 31, 09:05 AM", amount: "₦450,000", method: "Bank Transfer", methodIcon: Landmark, status: "FLAGGED", notes: "IP address mismatch detected." },
  { id: "#PAY-8917", trader: "Jiro Tanaka", email: "jiro.t@trade.jp", date: "Mar 30, 5:30 PM", amount: "$4,200", method: "USDT (TRC20)", methodIcon: Bitcoin, status: "APPROVED" },
  { id: "#PAY-8915", trader: "Emeka Bakare", email: "ebakare@fintech.ng", date: "Mar 30, 4:45 PM", amount: "₦950,000", method: "USDT (TRC20)", methodIcon: Bitcoin, status: "APPROVED" },
  { id: "#PAY-8914", trader: "Ayo Thorne", email: "ayo.thorne@fx.io", date: "Mar 30, 3:00 PM", amount: "$720", method: "Bank Transfer", methodIcon: Landmark, status: "PROCESSING" },
  { id: "#PAY-8910", trader: "Felix Henderson", email: "felix.h@tradenet.io", date: "Mar 30, 1:30 PM", amount: "₦3,200,000", method: "Bank Transfer", methodIcon: Landmark, status: "APPROVED" },
  { id: "#PAY-8901", trader: "Elena Vasquez", email: "e.vasquez@invest.io", date: "Mar 29, 10:00 AM", amount: "₦780,000", method: "USDT (ERC20)", methodIcon: Bitcoin, status: "PENDING" },
  { id: "#PAY-8900", trader: "Kwame Asante", email: "k.asante@trade.gh", date: "Mar 29, 9:15 AM", amount: "$950", method: "USDT (ERC20)", methodIcon: Bitcoin, status: "FLAGGED", notes: "KYC mismatch — country mismatch." },
  { id: "#PAY-8895", trader: "James Okafor", email: "j.okafor@trader.ng", date: "Mar 29, 8:30 AM", amount: "₦320,000", method: "Bank Transfer", methodIcon: Landmark, status: "REJECTED", notes: "Incomplete KYC verification." },
];

const statusStyles: Record<PayoutStatus, string> = {
  PENDING: "chip-warning",
  PROCESSING: "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30",
  FLAGGED: "chip-danger",
  APPROVED: "chip-active",
  REJECTED: "bg-[#7f1d1d]/30 text-[#ff6b6b] border border-[#ff4444]/30",
};

interface ConfirmModal {
  type: "approve" | "reject";
  payout: Payout;
}

interface PayoutsViewProps {
  onViewPayout?: (payoutId: string) => void;
}

export default function PayoutsView({ onViewPayout }: PayoutsViewProps = {}) {
  const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [systemFilter, setSystemFilter] = useState<"ALL" | "NGN" | "USD">("ALL");
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailPayout, setDetailPayout] = useState<Payout | null>(null);

  const filtered = payouts.filter((p) => {
    const matchSearch = p.trader.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || p.status === statusFilter;
    const matchSystem =
      systemFilter === "ALL" ||
      (systemFilter === "NGN" && p.amount.startsWith("₦")) ||
      (systemFilter === "USD" && p.amount.startsWith("$"));
    return matchSearch && matchStatus && matchSystem;
  });

  const handleApprove = () => {
    if (!confirmModal) return;
    setPayouts((prev) => prev.map((p) => p.id === confirmModal.payout.id ? { ...p, status: "APPROVED" as PayoutStatus } : p));
    setConfirmModal(null);
  };

  const handleReject = () => {
    if (!confirmModal) return;
    setPayouts((prev) => prev.map((p) => p.id === confirmModal.payout.id ? { ...p, status: "REJECTED" as PayoutStatus, notes: rejectReason || "Rejected by admin." } : p));
    setConfirmModal(null);
    setRejectReason("");
  };

  const stats = {
    pending: payouts.filter((p) => p.status === "PENDING").length,
    processing: payouts.filter((p) => p.status === "PROCESSING").length,
    approved: payouts.filter((p) => p.status === "APPROVED").length,
    flagged: payouts.filter((p) => p.status === "FLAGGED").length,
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Payout Management</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Review and process withdrawal requests from funded traders.</p>
        </div>
        {/* System Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-[rgba(0,255,204,0.08)] rounded-xl">
          {([
            { value: "ALL", label: "All" },
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending", value: stats.pending, color: "#ffbc7c", icon: Clock },
          { label: "Processing", value: stats.processing, color: "#3b82f6", icon: Clock },
          { label: "Approved (All)", value: stats.approved, color: "#00ffcc", icon: CheckCircle },
          { label: "Flagged", value: stats.flagged, color: "#ff4444", icon: AlertTriangle },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/60 uppercase mb-1">{s.label}</p>
              <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            </div>
            <s.icon size={28} style={{ color: s.color, opacity: 0.2 }} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Trader name or ID..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
          {["All Status", "PENDING", "PROCESSING", "FLAGGED", "APPROVED", "REJECTED"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold btn-primary">
          <Download size={13} /> Export Report
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["ID", "Trader", "Request Date", "Amount", "Method", "Status", "Action"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-[#00ffcc]">{p.id}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0b2f2d] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                      {p.trader.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{p.trader}</p>
                      <p className="text-[10px] text-[#b9cbc2]/50">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/70">{p.date}</td>
                <td className="px-4 py-3.5"><span className="text-sm font-bold font-display text-[#00ffcc]">{p.amount}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#b9cbc2]">
                    <p.methodIcon size={12} className="opacity-60" /> {p.method}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", statusStyles[p.status])}>{p.status}</span>
                  {p.notes && <p className="text-[10px] text-[#b9cbc2]/40 mt-0.5 max-w-[140px] truncate">{p.notes}</p>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onViewPayout ? onViewPayout(p.id) : setDetailPayout(p)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white hover:border-[#00ffcc]/20 transition-all">
                      <Eye size={12} />
                    </button>
                    {(p.status === "PENDING" || p.status === "FLAGGED") && (
                      <>
                        <button
                          onClick={() => setConfirmModal({ type: "approve", payout: p })}
                          className="px-2.5 py-1 rounded-lg bg-[#00ffcc]/10 text-[#00ffcc] text-[10px] font-semibold border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setConfirmModal({ type: "reject", payout: p })}
                          className="px-2.5 py-1 rounded-lg bg-[#ff4444]/10 text-[#ff6b6b] text-[10px] font-semibold border border-[#ff4444]/20 hover:bg-[#ff4444]/20 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,255,204,0.06)]">
          <p className="text-xs text-[#b9cbc2]/60">Showing <span className="text-white">1–{filtered.length}</span> of <span className="text-white">128</span> requests</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((pg) => (
              <button key={pg} className={cn("w-7 h-7 rounded-lg text-xs font-semibold", pg === 1 ? "bg-[#00ffcc] text-[#001716]" : "text-[#b9cbc2] hover:bg-[#0b2f2d]")}>{pg}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Detail Modal */}
      {detailPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDetailPayout(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Payout Details</h3>
              <button onClick={() => setDetailPayout(null)} className="text-[#b9cbc2]/50 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Payout ID", value: detailPayout.id },
                { label: "Trader", value: detailPayout.trader },
                { label: "Email", value: detailPayout.email },
                { label: "Amount", value: detailPayout.amount },
                { label: "Method", value: detailPayout.method },
                { label: "Date", value: detailPayout.date },
                { label: "Status", value: detailPayout.status },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-[#b9cbc2]/50">{row.label}</span>
                  <span className={cn("font-medium", row.label === "Amount" ? "text-[#00ffcc] font-bold font-display" : "text-white")}>{row.value}</span>
                </div>
              ))}
              {detailPayout.notes && (
                <div className="pt-2 border-t border-[#00ffcc]/08">
                  <p className="text-[11px] text-[#b9cbc2]/40 mb-1">Notes</p>
                  <p className="text-xs text-[#f59e0b]">{detailPayout.notes}</p>
                </div>
              )}
            </div>
            {(detailPayout.status === "PENDING" || detailPayout.status === "FLAGGED") && (
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setConfirmModal({ type: "approve", payout: detailPayout }); setDetailPayout(null); }} className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all">Approve</button>
                <button onClick={() => { setConfirmModal({ type: "reject", payout: detailPayout }); setDetailPayout(null); }} className="flex-1 py-2.5 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 text-[#ff6b6b] text-sm font-semibold hover:bg-[#ff4444]/20 transition-all">Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve / Reject Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">
              {confirmModal.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </h3>
            <p className="text-sm text-[#b9cbc2]/70">
              {confirmModal.type === "approve"
                ? <>Are you sure you want to approve <span className="text-[#00ffcc] font-mono">{confirmModal.payout.id}</span> for <span className="text-[#00ffcc] font-bold">{confirmModal.payout.amount}</span>? This will trigger payment.</>
                : <>Reject payout <span className="text-[#00ffcc] font-mono">{confirmModal.payout.id}</span>? Please provide a reason.</>
              }
            </p>
            {confirmModal.type === "reject" && (
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (optional)..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#b9cbc2]/30 focus:border-[#ff4444]/40 resize-none"
              />
            )}
            <div className="flex gap-3">
              <button onClick={() => { setConfirmModal(null); setRejectReason(""); }} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2] hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={confirmModal.type === "approve" ? handleApprove : handleReject}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                  confirmModal.type === "approve"
                    ? "bg-[#00ffcc] text-[#001716] hover:bg-[#00e6b8]"
                    : "bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff6b6b] hover:bg-[#ff4444]/20"
                )}
              >
                {confirmModal.type === "approve" ? "Approve & Pay" : "Reject Payout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
