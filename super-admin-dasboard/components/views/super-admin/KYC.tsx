"use client";

import { useState } from "react";
import { ShieldCheck, Search, CheckCircle, XCircle, Clock, Eye, Download, AlertTriangle, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type KYCStatus = "pending" | "approved" | "rejected";
type RiskLevel = "low" | "medium" | "high";

interface KYCRecord {
  id: string;
  name: string;
  email: string;
  country: string;
  doc: string;
  submitted: string;
  status: KYCStatus;
  risk: RiskLevel;
  docNote?: string;
}

const INITIAL_KYC: KYCRecord[] = [
  { id: "KYC-001", name: "Alex Thorne", email: "alex.thorne@email.com", country: "Nigeria", doc: "National ID", submitted: "2024-12-01", status: "pending", risk: "low" },
  { id: "KYC-002", name: "Jane Doe", email: "jane.doe@email.com", country: "Ghana", doc: "Passport", submitted: "2024-12-01", status: "approved", risk: "low" },
  { id: "KYC-003", name: "Mark Smith", email: "mark.smith@email.com", country: "UK", doc: "Driver's License", submitted: "2024-11-30", status: "rejected", risk: "high", docNote: "Expired document — resubmission required." },
  { id: "KYC-004", name: "Musa Okoro", email: "musa.okoro@email.com", country: "Nigeria", doc: "National ID", submitted: "2024-11-29", status: "pending", risk: "medium" },
  { id: "KYC-005", name: "Sarah Jones", email: "sarah.jones@email.com", country: "South Africa", doc: "Passport", submitted: "2024-11-28", status: "approved", risk: "low" },
  { id: "KYC-006", name: "Chen Wei", email: "chen.wei@email.com", country: "China", doc: "National ID", submitted: "2024-11-27", status: "pending", risk: "medium" },
  { id: "KYC-007", name: "Fatima Al-Said", email: "fatima@email.com", country: "UAE", doc: "Passport", submitted: "2024-11-26", status: "approved", risk: "low" },
  { id: "KYC-008", name: "Emeka Nwachukwu", email: "emeka.n@gmail.com", country: "Nigeria", doc: "National ID", submitted: "2024-11-25", status: "pending", risk: "low" },
  { id: "KYC-009", name: "Sana Khan", email: "sana.k@outlook.com", country: "Pakistan", doc: "Passport", submitted: "2024-11-24", status: "pending", risk: "high" },
];

const statusColors: Record<KYCStatus, string> = {
  pending: "chip-warning",
  approved: "chip-active",
  rejected: "chip-danger",
};

const riskColors: Record<RiskLevel, string> = {
  low: "text-[#00ffcc]",
  medium: "text-[#ffbc7c]",
  high: "text-[#ff6b6b]",
};

interface RejectModal {
  record: KYCRecord;
  reason: string;
}

export default function KYCView({ onViewTrader }: { onViewTrader?: (id: string) => void } = {}) {
  const [records, setRecords] = useState<KYCRecord[]>(INITIAL_KYC);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | KYCStatus>("all");
  const [viewRecord, setViewRecord] = useState<KYCRecord | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModal | null>(null);

  const filtered = records.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const approve = (id: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" as KYCStatus } : r));
    if (viewRecord?.id === id) setViewRecord((v) => v ? { ...v, status: "approved" } : null);
  };

  const reject = (id: string, reason: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" as KYCStatus, docNote: reason || "Rejected by compliance team." } : r));
    if (viewRecord?.id === id) setViewRecord((v) => v ? { ...v, status: "rejected", docNote: reason || "Rejected by compliance team." } : null);
    setRejectModal(null);
  };

  const counts = {
    pending: records.filter((r) => r.status === "pending").length,
    approved: records.filter((r) => r.status === "approved").length,
    rejected: records.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">KYC Verification Center</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Review and manage identity verification submissions from traders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <Download size={14} /> Export KYC Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: "Pending Review", value: counts.pending, icon: Clock, color: "#ffbc7c" },
          { label: "Approved", value: counts.approved, icon: CheckCircle, color: "#00ffcc" },
          { label: "Rejected", value: counts.rejected, icon: XCircle, color: "#ff6b6b" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0b2f2d] flex items-center justify-center flex-shrink-0">
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{s.label}</p>
              <p className="text-2xl font-bold font-display text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder:text-[#b9cbc2]/40"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all",
                  filter === f
                    ? "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/30"
                    : "text-[#b9cbc2] border border-[rgba(0,255,204,0.1)] hover:border-[#00ffcc]/20"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,255,204,0.08)]">
                {["KYC ID", "Name", "Country", "Document", "Submitted", "Risk", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left pb-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[rgba(0,255,204,0.04)] table-row-hover">
                  <td className="py-3 pr-4 text-xs font-mono text-[#00ffcc]/70">{r.id}</td>
                  <td className="py-3 pr-4">
                    <p className="text-sm text-white font-medium">{r.name}</p>
                    <p className="text-[10px] text-[#b9cbc2]/50">{r.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#b9cbc2]">{r.country}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#b9cbc2]">
                      <FileText size={12} className="opacity-50" /> {r.doc}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#b9cbc2]">{r.submitted}</td>
                  <td className="py-3 pr-4">
                    <span className={cn("text-xs font-semibold uppercase", riskColors[r.risk])}>{r.risk}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full uppercase", statusColors[r.status])}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewRecord(r)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d] border border-[rgba(0,255,204,0.1)] hover:border-[#00ffcc]/30 transition-all"
                      >
                        <Eye size={12} className="text-[#00ffcc]" />
                      </button>
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => approve(r.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-all"
                          >
                            <CheckCircle size={12} className="text-[#00ffcc]" />
                          </button>
                          <button
                            onClick={() => setRejectModal({ record: r, reason: "" })}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#ff4444]/10 border border-[#ff4444]/20 hover:bg-[#ff4444]/20 transition-all"
                          >
                            <XCircle size={12} className="text-[#ff6b6b]" />
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
      </div>

      {/* View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewRecord(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">KYC Record — {viewRecord.id}</h3>
              <button onClick={() => setViewRecord(null)} className="text-[#b9cbc2]/50 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Full Name", value: viewRecord.name },
                { label: "Email", value: viewRecord.email },
                { label: "Country", value: viewRecord.country },
                { label: "Document Type", value: viewRecord.doc },
                { label: "Date Submitted", value: viewRecord.submitted },
                { label: "Risk Level", value: viewRecord.risk.toUpperCase() },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm border-b border-[rgba(0,255,204,0.06)] pb-2.5">
                  <span className="text-[#b9cbc2]/50">{row.label}</span>
                  <span className={cn("font-medium", row.label === "Risk Level" ? riskColors[viewRecord.risk] : "text-white")}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#b9cbc2]/50">Status</span>
                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full uppercase", statusColors[viewRecord.status])}>{viewRecord.status}</span>
              </div>
              {viewRecord.docNote && (
                <div className="bg-[#ff4444]/05 border border-[#ff4444]/15 rounded-lg p-3">
                  <p className="text-[11px] text-[#b9cbc2]/50 mb-0.5">Review Note</p>
                  <p className="text-xs text-[#ffbc7c]">{viewRecord.docNote}</p>
                </div>
              )}
            </div>
            {viewRecord.status === "pending" ? (
              <div className="flex gap-2 pt-1">
                {onViewTrader && (
                  <button
                    onClick={() => { onViewTrader(viewRecord.id); setViewRecord(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-sm font-semibold hover:bg-[#00ffcc]/20 transition-all"
                  >
                    View Profile
                  </button>
                )}
                <button
                  onClick={() => { approve(viewRecord.id); setViewRecord(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => { setRejectModal({ record: viewRecord, reason: "" }); setViewRecord(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 text-[#ff6b6b] text-sm font-semibold hover:bg-[#ff4444]/20 transition-all"
                >
                  Reject
                </button>
              </div>
            ) : onViewTrader && (
              <button
                onClick={() => { onViewTrader(viewRecord.id); setViewRecord(null); }}
                className="w-full py-2.5 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-sm font-semibold hover:bg-[#00ffcc]/20 transition-all"
              >
                View Trader Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Reject KYC</h3>
              <button onClick={() => setRejectModal(null)} className="text-[#b9cbc2]/50 hover:text-white"><X size={16} /></button>
            </div>
            <p className="text-sm text-[#b9cbc2]/70">
              You are rejecting <span className="text-white font-semibold">{rejectModal.record.name}</span>&apos;s KYC submission. Please provide a reason.
            </p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="e.g. Expired document, unclear photo..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#b9cbc2]/30 resize-none focus:border-[#ff4444]/40"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2] hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={() => reject(rejectModal.record.id, rejectModal.reason)}
                className="flex-1 py-2.5 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff6b6b] text-sm font-semibold hover:bg-[#ff4444]/20 transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
