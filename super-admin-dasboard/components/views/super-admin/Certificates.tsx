"use client";

import { useState, useEffect } from "react";
import { Award, Download, Search, RefreshCw, Eye, Send, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type CertStatus = "issued" | "pending" | "revoked";

interface Certificate {
  id: string;
  certificateNumber: string;
  trader: {
    name: string;
    email: string;
  };
  accountSize: string;
  profitTarget: string;
  maxDrawdown: string;
  issuedDate: string;
  status: CertStatus;
}

const STATUS_CONFIG: Record<CertStatus, { label: string; icon: React.ComponentType<{size?: number; className?: string}>; color: string; bg: string; border: string }> = {
  issued: { label: "Issued", icon: CheckCircle, color: "text-[#00ffcc]", bg: "bg-[#00ffcc]/10", border: "border-[#00ffcc]/25" },
  pending: { label: "Pending", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/25" },
  revoked: { label: "Revoked", icon: XCircle, color: "text-[#ff4444]", bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/25" },
};

export default function CertificatesView() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertStatus>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [certsRes, statsRes] = await Promise.all([
        api.get("admin/certificates?limit=50"),
        api.get("admin/certificates?limit=1") // Just to get stats
      ]);

      const certsData = certsRes.data?.certificates || [];
      setCerts(certsData.map((c: any) => ({
        id: c.id?.toString(),
        certificateNumber: c.certificateNumber,
        trader: c.trader,
        accountSize: c.accountSize,
        profitTarget: c.profitTarget,
        maxDrawdown: c.maxDrawdown,
        issuedDate: c.issuedDate ? new Date(c.issuedDate).toLocaleDateString() : "-",
        status: c.status || "issued"
      })));
      
      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filtered = certs.filter((c) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      c.trader?.name?.toLowerCase().includes(searchLower) || 
      c.certificateNumber?.toLowerCase().includes(searchLower) ||
      c.id?.toLowerCase().includes(searchLower);
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

  const handleIssue = async (certId: string) => {
    try {
      await api.post(`admin/certificates/${certId}/regenerate`, {});
      fetchData();
    } catch (err) {
      console.error("Failed to issue certificate", err);
    }
  };

  const statsData = {
    total: stats?.totalCertificates || certs.length,
    issued: certs.filter((c) => c.status === "issued").length,
    pending: certs.filter((c) => c.status === "pending").length,
    revoked: certs.filter((c) => c.status === "revoked").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#00ffcc] animate-spin" />
        <p className="text-sm text-[#a8c0b8]">Loading certificates...</p>
      </div>
    );
  }

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
          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/08 transition-all disabled:opacity-50">
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Certificates", value: statsData.total, color: "text-white" },
          { label: "Issued", value: statsData.issued, color: "text-[#00ffcc]" },
          { label: "Pending Issue", value: statsData.pending, color: "text-[#f59e0b]" },
          { label: "This Month", value: stats?.thisMonth || 0, color: "text-[#60a5fa]" },
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
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACCOUNT SIZE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TARGET</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ISSUED DATE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">STATUS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffcc]/05">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-[#b9cbc2]/50">
                  No certificates found
                </td>
              </tr>
            ) : (
              filtered.map((cert) => {
                const statusConf = STATUS_CONFIG[cert.status] || STATUS_CONFIG.issued;
                const StatusIcon = statusConf.icon;
                return (
                  <tr key={cert.id} className={cn("hover:bg-[#00ffcc]/04 transition-all", selectedIds.has(cert.id) && "bg-[#00ffcc]/04")}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selectedIds.has(cert.id)} onChange={() => toggleSelect(cert.id)} className="accent-[#00ffcc]" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[#00ffcc] text-xs">{cert.certificateNumber || cert.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-white font-medium text-sm">{cert.trader?.name || "Unknown"}</p>
                      <p className="text-[11px] text-[#b9cbc2]/50">{cert.trader?.email || ""}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white font-medium text-sm">{cert.accountSize}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[#b9cbc2] text-sm">{cert.profitTarget}</td>
                    <td className="px-4 py-3.5 text-[#b9cbc2]/70 text-sm">{cert.issuedDate}</td>
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
                            onClick={() => handleIssue(cert.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20 transition-all"
                          >
                            <Send size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}