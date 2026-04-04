"use client";

import { useState } from "react";
import {
  Tag, Plus, Copy, Trash2, Search, Filter, CheckCircle,
  XCircle, Clock, Trophy, DollarSign, Percent, Eye,
  ToggleLeft, ToggleRight, Calendar,
} from "lucide-react";

type PromoCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  uses: number;
  maxUses: number;
  validFrom: string;
  validTo: string;
  planRestriction: string;
  status: "active" | "expired" | "paused";
  redemptions: number;
  revenue: number;
};

const initialCodes: PromoCode[] = [
  { id: "pc1", code: "SUMMER50", type: "percent", value: 50, uses: 0, maxUses: 200, validFrom: "2025-05-01", validTo: "2025-08-31", planRestriction: "All Plans", status: "active", redemptions: 47, revenue: 1480000 },
  { id: "pc2", code: "LAUNCH100K", type: "fixed", value: 5000, uses: 0, maxUses: 50, validFrom: "2025-04-01", validTo: "2025-04-30", planRestriction: "₦100K Plan Only", status: "expired", redemptions: 50, revenue: 375000 },
  { id: "pc3", code: "VIP25", type: "percent", value: 25, uses: 0, maxUses: 100, validFrom: "2025-03-01", validTo: "2025-12-31", planRestriction: "Dollar Plans Only", status: "active", redemptions: 23, revenue: 892000 },
  { id: "pc4", code: "RETRY20", type: "percent", value: 20, uses: 0, maxUses: 500, validFrom: "2025-01-01", validTo: "2025-12-31", planRestriction: "All Plans", status: "active", redemptions: 181, revenue: 2140000 },
  { id: "pc5", code: "BLACKFRIDAY", type: "percent", value: 60, uses: 0, maxUses: 300, validFrom: "2024-11-25", validTo: "2024-11-30", planRestriction: "All Plans", status: "expired", redemptions: 300, revenue: 3600000 },
  { id: "pc6", code: "NAIRA10K", type: "fixed", value: 10000, uses: 0, maxUses: 100, validFrom: "2025-06-01", validTo: "2025-06-30", planRestriction: "Naira Plans Only", status: "paused", redemptions: 0, revenue: 0 },
];

const planOptions = ["All Plans", "₦200K Plan", "₦500K Plan", "₦1M Plan", "$15K Plan", "$50K Plan", "$100K Plan", "Naira Plans Only", "Dollar Plans Only"];

type NewCode = {
  code: string;
  type: "percent" | "fixed";
  value: string;
  maxUses: string;
  validFrom: string;
  validTo: string;
  planRestriction: string;
};

export default function PromoCodes() {
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "paused">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState<NewCode>({
    code: "", type: "percent", value: "", maxUses: "", validFrom: "", validTo: "", planRestriction: "All Plans"
  });
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = codes.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCreate = () => {
    if (!newCode.code || !newCode.value) return;
    const created: PromoCode = {
      id: `pc${Date.now()}`,
      code: newCode.code.toUpperCase(),
      type: newCode.type,
      value: Number(newCode.value),
      uses: 0,
      maxUses: Number(newCode.maxUses) || 100,
      validFrom: newCode.validFrom || new Date().toISOString().split("T")[0],
      validTo: newCode.validTo || "2025-12-31",
      planRestriction: newCode.planRestriction,
      status: "active",
      redemptions: 0,
      revenue: 0,
    };
    setCodes([created, ...codes]);
    setShowCreateModal(false);
    setNewCode({ code: "", type: "percent", value: "", maxUses: "", validFrom: "", validTo: "", planRestriction: "All Plans" });
  };

  const toggleStatus = (id: string) => {
    setCodes((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "paused" : c.status === "paused" ? "active" : c.status } : c)
    );
  };

  const deleteCode = (id: string) => setCodes((prev) => prev.filter((c) => c.id !== id));

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusColor = { active: "#34d399", expired: "#a8c0b8", paused: "#ffbc7c" };
  const totalRevenue = codes.reduce((a, c) => a + c.revenue, 0);
  const activeCodes = codes.filter((c) => c.status === "active").length;
  const totalRedemptions = codes.reduce((a, c) => a + c.redemptions, 0);

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Promo Code Manager</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Create and manage discount codes across challenge plans</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold"
        >
          <Plus size={14} /> New Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ACTIVE CODES", value: activeCodes, icon: Tag, color: "#00ffcc" },
          { label: "TOTAL REDEMPTIONS", value: totalRedemptions.toLocaleString(), icon: CheckCircle, color: "#34d399" },
          { label: "REVENUE INFLUENCED", value: `₦${(totalRevenue / 1000000).toFixed(2)}M`, icon: DollarSign, color: "#ffbc7c" },
          { label: "TOTAL CODES", value: codes.length, icon: Percent, color: "#a78bfa" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[20px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-[#a8c0b8]/50" />
          <input
            type="text"
            placeholder="Search promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[12px] text-white placeholder:text-[#a8c0b8]/40 outline-none flex-1"
          />
        </div>
        <div className="flex items-center bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl p-1">
          {(["all", "active", "expired", "paused"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc" } : { color: "#a8c0b8" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Codes Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,255,204,0.06)]">
                {["Code", "Discount", "Plan", "Redemptions", "Valid Period", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase font-display">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[rgba(0,255,204,0.04)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-[13px] font-bold font-mono text-[#00ffcc] bg-[#00ffcc]/08 px-2 py-0.5 rounded">{c.code}</code>
                      <button onClick={() => copyCode(c.code)} className="text-[#a8c0b8]/40 hover:text-[#00ffcc] transition-colors">
                        {copied === c.code ? <CheckCircle size={12} className="text-[#34d399]" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-bold text-[#ffbc7c]">
                      {c.type === "percent" ? `${c.value}%` : `₦${c.value.toLocaleString()}`} off
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/70">{c.planRestriction}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-[12px] text-white font-semibold">{c.redemptions} / {c.maxUses}</div>
                      <div className="w-20 h-1 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[#00ffcc]" style={{ width: `${Math.min((c.redemptions / c.maxUses) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/60">
                    <div className="flex items-center gap-1.5"><Calendar size={10} />{c.validFrom}</div>
                    <div className="flex items-center gap-1.5 mt-0.5"><Calendar size={10} />{c.validTo}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: `${statusColor[c.status]}15`, color: statusColor[c.status] }}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.status !== "expired" && (
                        <button onClick={() => toggleStatus(c.id)} className="text-[#a8c0b8]/50 hover:text-[#00ffcc] transition-colors">
                          {c.status === "active" ? <ToggleRight size={16} className="text-[#34d399]" /> : <ToggleLeft size={16} />}
                        </button>
                      )}
                      <button onClick={() => deleteCode(c.id)} className="text-[#a8c0b8]/40 hover:text-[#ff6b6b] transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-md relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold font-display text-white">Create Promo Code</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#a8c0b8]/40 hover:text-white">
                <XCircle size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER50"
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none focus:border-[rgba(0,255,204,0.35)] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Type</label>
                <select
                  value={newCode.type}
                  onChange={(e) => setNewCode({ ...newCode, type: e.target.value as "percent" | "fixed" })}
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Value</label>
                <input
                  type="number"
                  value={newCode.value}
                  onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
                  placeholder={newCode.type === "percent" ? "50" : "5000"}
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none focus:border-[rgba(0,255,204,0.35)]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Max Uses</label>
                <input
                  type="number"
                  value={newCode.maxUses}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                  placeholder="100"
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Plan Restriction</label>
                <select
                  value={newCode.planRestriction}
                  onChange={(e) => setNewCode({ ...newCode, planRestriction: e.target.value })}
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                >
                  {planOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Valid From</label>
                <input
                  type="date"
                  value={newCode.validFrom}
                  onChange={(e) => setNewCode({ ...newCode, validFrom: e.target.value })}
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Valid To</label>
                <input
                  type="date"
                  value={newCode.validTo}
                  onChange={(e) => setNewCode({ ...newCode, validTo: e.target.value })}
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#010e0d] bg-[#00ffcc] hover:bg-[#00ffcc]/90 transition-all">Create Code</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
