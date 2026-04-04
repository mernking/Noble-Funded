"use client";

import { useState } from "react";
import { Award, Download, Search, RefreshCw, Eye, Send, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type CertStatus = "issued" | "pending" | "revoked";

interface Certificate {
  id: string;
  userId: string;
  traderName: string;
  type: string;
  accountSize: string;
  currency: string;
  issuedDate: string;
  status: CertStatus;
  downloadCount: number;
}

const CERTS: Certificate[] = [
  { id: "CERT-0041", userId: "NF-4821", traderName: "Adebayo Okafor", type: "Funded Trader", accountSize: "800,000", currency: "NGN", issuedDate: "2026-03-28", status: "issued", downloadCount: 3 },
  { id: "CERT-0040", userId: "NF-3312", traderName: "Chidi Nwosu", type: "Phase 1 Passed", accountSize: "400,000", currency: "NGN", issuedDate: "2026-03-25", status: "issued", downloadCount: 1 },
  { id: "CERT-0039", userId: "NF-5501", traderName: "Michael Tetteh", type: "Funded Trader", accountSize: "5,000", currency: "USD", issuedDate: "2026-03-22", status: "issued", downloadCount: 5 },
  { id: "CERT-0038", userId: "NF-2201", traderName: "Fatima Bello", type: "Phase 2 Passed", accountSize: "200,000", currency: "NGN", issuedDate: "2026-03-20", status: "pending", downloadCount: 0 },
  { id: "CERT-0037", userId: "NF-6600", traderName: "Emeka Williams", type: "Funded Trader", accountSize: "800,000", currency: "NGN", issuedDate: "2026-03-18", status: "issued", downloadCount: 2 },
  { id: "CERT-0036", userId: "NF-1144", traderName: "Amara Conde", type: "Phase 1 Passed", accountSize: "10,000", currency: "USD", issuedDate: "2026-03-15", status: "revoked", downloadCount: 1 },
  { id: "CERT-0035", userId: "NF-3399", traderName: "Jide Lawson", type: "Phase 2 Passed", accountSize: "400,000", currency: "NGN", issuedDate: "2026-03-12", status: "pending", downloadCount: 0 },
  { id: "CERT-0034", userId: "NF-7712", traderName: "Kwame Asante", type: "Funded Trader", accountSize: "25,000", currency: "USD", issuedDate: "2026-03-10", status: "issued", downloadCount: 4 },
];

const STATUS_CONFIG: Record<CertStatus, { label: string; icon: React.ComponentType<{size?: number; className?: string}>; color: string; bg: string; border: string }> = {
  issued: { label: "Issued", icon: CheckCircle, color: "text-[#00ffcc]", bg: "bg-[#00ffcc]/10", border: "border-[#00ffcc]/25" },
  pending: { label: "Pending", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/25" },
  revoked: { label: "Revoked", icon: XCircle, color: "text-[#ff4444]", bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/25" },
};

export default function CertificatesView() {
  const [certs, setCerts] = useState<Certificate[]>(CERTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertStatus>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = certs.filter((c) => {
    const matchesSearch = c.traderName.toLowerCase().includes(search.toLowerCase()) || c.userId.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const issueSelected = () => {
    setCerts((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, status: "issued" as CertStatus } : c));
    setSelectedIds(new Set());
  };

  const revokeSelected = () => {
    setCerts((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, status: "revoked" as CertStatus } : c));
    setSelectedIds(new Set());
  };

  const stats = {
    total: certs.length,
    issued: certs.filter((c) => c.status === "issued").length,
    pending: certs.filter((c) => c.status === "pending").length,
    revoked: certs.filter((c) => c.status === "revoked").length,
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Award size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Certificates</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Issue, manage, and revoke trader achievement certificates.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <>
              <button onClick={issueSelected} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/08 transition-all">
                <Send size={12} /> Issue Selected ({selectedIds.size})
              </button>
              <button onClick={revokeSelected} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#ff6b6b] border border-[#ff4444]/20 hover:bg-[#ff4444]/08 transition-all">
                <XCircle size={12} /> Revoke Selected
              </button>
            </>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Certificates", value: stats.total, color: "text-white" },
          { label: "Issued", value: stats.issued, color: "text-[#00ffcc]" },
          { label: "Pending Issue", value: stats.pending, color: "text-[#f59e0b]" },
          { label: "Revoked", value: stats.revoked, color: "text-[#ff4444]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            type="text"
            placeholder="Search trader name, ID or cert..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] text-white placeholder:text-[#b9cbc2]/40 focus:border-[#00ffcc]/40"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "issued", "pending", "revoked"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                statusFilter === s ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30" : "text-[#b9cbc2]/60 border border-transparent hover:border-[#00ffcc]/15"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ffcc]/08 text-left">
              <th className="px-4 py-3 w-8">
                <input type="checkbox" className="accent-[#00ffcc]" onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(filtered.map((c) => c.id)));
                  else setSelectedIds(new Set());
                }} />
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">CERT ID</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TRADER</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TYPE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACCOUNT SIZE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ISSUED DATE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">DOWNLOADS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">STATUS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffcc]/05">
            {filtered.map((cert) => {
              const statusConf = STATUS_CONFIG[cert.status];
              const StatusIcon = statusConf.icon;
              return (
                <tr key={cert.id} className={cn("hover:bg-[#00ffcc]/04 transition-all", selectedIds.has(cert.id) && "bg-[#00ffcc]/04")}>
                  <td className="px-4 py-3.5">
                    <input type="checkbox" checked={selectedIds.has(cert.id)} onChange={() => toggleSelect(cert.id)} className="accent-[#00ffcc]" />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[#00ffcc] text-xs">{cert.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white font-medium text-sm">{cert.traderName}</p>
                    <p className="text-[11px] text-[#b9cbc2]/50">{cert.userId}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[#b9cbc2] text-sm">{cert.type}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-white font-medium text-sm">{cert.currency === "NGN" ? "₦" : "$"}{cert.accountSize}</span>
                    <span className="ml-1 text-[10px] text-[#b9cbc2]/40">{cert.currency}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[#b9cbc2]/70 text-sm">{cert.issuedDate}</td>
                  <td className="px-4 py-3.5 text-[#b9cbc2] text-sm">{cert.downloadCount}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border w-fit", statusConf.color, statusConf.bg, statusConf.border)}>
                      <StatusIcon size={10} /> {statusConf.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white hover:border-[#00ffcc]/20 transition-all">
                        <Eye size={12} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 transition-all">
                        <Download size={12} />
                      </button>
                      {cert.status === "pending" && (
                        <button
                          onClick={() => setCerts((prev) => prev.map((c) => c.id === cert.id ? { ...c, status: "issued" as CertStatus } : c))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20 transition-all"
                        >
                          <Send size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
