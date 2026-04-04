"use client";

import { useState } from "react";
import {
  Award, RefreshCw, Search, Edit3, Download, Send,
  CheckCircle, XCircle, AlertTriangle, Eye, Save, X,
  FileText, Clock, User, Trophy,
} from "lucide-react";

type Certificate = {
  id: string;
  trader: string;
  traderId: string;
  email: string;
  type: "phase1" | "phase2" | "funded" | "payout";
  issueDate: string;
  amount?: string;
  account: string;
  status: "issued" | "pending" | "failed" | "regenerated";
  nameOnCert: string;
};

const initialCertificates: Certificate[] = [
  { id: "cert1", trader: "Emeka Nwachukwu", traderId: "ID-4619", email: "emeka@email.com", type: "phase2", issueDate: "2025-04-10", account: "MT5-44312", status: "issued", nameOnCert: "Emeka Nwachukwu" },
  { id: "cert2", trader: "Jane Adeyemi", traderId: "ID-3821", email: "jane@email.com", type: "funded", issueDate: "2025-04-12", account: "MT5-78821", status: "issued", nameOnCert: "Jane A." },
  { id: "cert3", trader: "Musa Okoro", traderId: "ID-4892", email: "musa@email.com", type: "payout", issueDate: "2025-04-08", amount: "₦45,000", account: "MT5-33401", status: "issued", nameOnCert: "Musa Okoro" },
  { id: "cert4", trader: "Chidi Okonkwo", traderId: "ID-4821", email: "chidi@email.com", type: "phase1", issueDate: "2025-04-14", account: "MT5-55601", status: "failed", nameOnCert: "Chidi Okonkwo" },
  { id: "cert5", trader: "Tosin Abiodun", traderId: "ID-3901", email: "tosin@email.com", type: "phase1", issueDate: "2025-04-13", account: "MT5-22190", status: "pending", nameOnCert: "Tosin Abiodun" },
  { id: "cert6", trader: "Alex Thorne", traderId: "ID-3012", email: "alex@email.com", type: "payout", issueDate: "2025-04-11", amount: "$2,400", account: "MT5-90012", status: "regenerated", nameOnCert: "Alexander Thorne" },
  { id: "cert7", trader: "Mark Samson", traderId: "ID-3555", email: "mark@email.com", type: "phase2", issueDate: "2025-04-09", account: "MT5-11234", status: "issued", nameOnCert: "Mark Samsom" },
];

const typeConfig = {
  phase1: { label: "Phase 1 Complete", color: "#ffbc7c", icon: Trophy },
  phase2: { label: "Phase 2 Complete", color: "#60a5fa", icon: Trophy },
  funded: { label: "Funded Account", color: "#00ffcc", icon: Award },
  payout: { label: "Payout Certificate", color: "#34d399", icon: FileText },
};

const statusColor = { issued: "#34d399", pending: "#ffbc7c", failed: "#ff6b6b", regenerated: "#a78bfa" };

type EditModal = { cert: Certificate; draftName: string } | null;

export default function CertificateManager() {
  const [certs, setCerts] = useState<Certificate[]>(initialCertificates);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "issued" | "pending" | "failed">("all");
  const [editModal, setEditModal] = useState<EditModal>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const filtered = certs.filter((c) => {
    const matchSearch = c.trader.toLowerCase().includes(search.toLowerCase()) || c.traderId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSaveName = () => {
    if (!editModal) return;
    setCerts((prev) => prev.map((c) => c.id === editModal.cert.id ? { ...c, nameOnCert: editModal.draftName } : c));
    setEditModal(null);
  };

  const handleRegenerate = (id: string) => {
    setRegenerating(id);
    setTimeout(() => {
      setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "regenerated" } : c));
      setRegenerating(null);
    }, 1800);
  };

  const stats = [
    { label: "TOTAL ISSUED", value: certs.filter((c) => c.status === "issued" || c.status === "regenerated").length, icon: Award, color: "#00ffcc" },
    { label: "PENDING", value: certs.filter((c) => c.status === "pending").length, icon: Clock, color: "#ffbc7c" },
    { label: "FAILED", value: certs.filter((c) => c.status === "failed").length, icon: XCircle, color: "#ff6b6b" },
    { label: "REGENERATED", value: certs.filter((c) => c.status === "regenerated").length, icon: RefreshCw, color: "#a78bfa" },
  ];

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Certificate Manager</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Edit trader names, re-generate failed PDFs, and push certificates to dashboards</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[20px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-[rgba(245,158,11,0.15)] rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-[#a8c0b8]/50" />
          <input type="text" placeholder="Search by trader or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-[12px] text-white placeholder:text-[#a8c0b8]/40 outline-none flex-1" />
        </div>
        <div className="flex items-center bg-white/[0.04] border border-[rgba(245,158,11,0.15)] rounded-xl p-1">
          {(["all", "issued", "pending", "failed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b" } : { color: "#a8c0b8" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(245,158,11,0.08)]">
                {["Trader", "Certificate Type", "Name on Certificate", "Account", "Issued", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase font-display">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert) => {
                const config = typeConfig[cert.type];
                const CertIcon = config.icon;
                return (
                  <tr key={cert.id} className="border-b border-[rgba(245,158,11,0.04)] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] font-semibold text-white">{cert.trader}</p>
                        <p className="text-[10px] text-[#a8c0b8]/50">{cert.traderId} · {cert.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${config.color}15`, border: `1px solid ${config.color}25` }}>
                          <CertIcon size={12} style={{ color: config.color }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold" style={{ color: config.color }}>{config.label}</p>
                          {cert.amount && <p className="text-[10px] text-[#a8c0b8]/50">{cert.amount}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-white">{cert.nameOnCert}</span>
                        <button onClick={() => setEditModal({ cert, draftName: cert.nameOnCert })} className="text-[#a8c0b8]/40 hover:text-[#00ffcc] transition-colors">
                          <Edit3 size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono text-[#00ffcc]">{cert.account}</td>
                    <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/60">{cert.issueDate}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusColor[cert.status]}15`, color: statusColor[cert.status] }}>{cert.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerate(cert.id)}
                          disabled={regenerating === cert.id}
                          className="flex items-center gap-1 text-[11px] text-[#ffbc7c] hover:underline transition-all disabled:opacity-50"
                        >
                          <RefreshCw size={10} className={regenerating === cert.id ? "animate-spin" : ""} />
                          {regenerating === cert.id ? "..." : "Regen"}
                        </button>
                        <button className="flex items-center gap-1 text-[11px] text-[#34d399] hover:underline">
                          <Send size={10} /> Push
                        </button>
                        <button className="flex items-center gap-1 text-[11px] text-[#a8c0b8]/60 hover:text-white transition-all">
                          <Download size={10} /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Name Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditModal(null)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-sm relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold font-display text-white">Edit Name on Certificate</h3>
              <button onClick={() => setEditModal(null)} className="text-[#a8c0b8]/40 hover:text-white"><X size={16} /></button>
            </div>
            <div>
              <p className="text-[11px] text-[#a8c0b8]/60 mb-1">Trader: <span className="text-white">{editModal.cert.trader}</span></p>
              <p className="text-[11px] text-[#a8c0b8]/60 mb-3">Certificate: <span style={{ color: typeConfig[editModal.cert.type].color }}>{typeConfig[editModal.cert.type].label}</span></p>
              <label className="text-[11px] text-[#a8c0b8]/60 uppercase tracking-wider mb-1.5 block">Name to Print on Certificate</label>
              <input
                type="text"
                value={editModal.draftName}
                onChange={(e) => setEditModal({ ...editModal, draftName: e.target.value })}
                className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.2)] rounded-xl px-3 py-2.5 text-[14px] text-white outline-none focus:border-[rgba(0,255,204,0.4)]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button onClick={handleSaveName} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#010e0d] bg-[#00ffcc]">Save & Re-generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
