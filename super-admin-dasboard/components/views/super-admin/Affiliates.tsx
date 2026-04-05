"use client";

import { useState, useEffect } from "react";
import { Share2, Search, Download, TrendingUp, Users, CreditCard, DollarSign, Eye, Ban, CheckCircle, Clock, XCircle, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type AffiliateStatus = "active" | "pending" | "suspended";

interface Affiliate {
  id: string;
  userId: string;
  name: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: string;
  pendingPayout: string;
  conversionRate: number;
  joinedDate: string;
  status: AffiliateStatus;
}

const STATUS_CONFIG: Record<AffiliateStatus, { label: string; icon: React.ComponentType<{size?: number; className?: string}>; color: string; bg: string; border: string }> = {
  active: { label: "Active", icon: CheckCircle, color: "text-[#00ffcc]", bg: "bg-[#00ffcc]/10", border: "border-[#00ffcc]/25" },
  pending: { label: "Pending", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/25" },
  suspended: { label: "Suspended", icon: XCircle, color: "text-[#ff4444]", bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/25" },
};

interface AffiliatesViewProps {
  onViewAffiliate?: (affiliateId: string) => void;
}

export default function AffiliatesView({ onViewAffiliate }: AffiliatesViewProps = {}) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AffiliateStatus>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ affiliates: 0, active: 0, referrals: 0, pendingPayouts: 0 });

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter !== "all") params.set("status", statusFilter);
        
        const res = await api.get(`admin/affiliates?${params.toString()}`);
        const data = res.data.affiliates || [];
        
        // Map API response to component format
        const mapped = data.map((a: any) => ({
          id: a.id,
          userId: a.userId || "N/A",
          name: a.fullName || "Unknown",
          email: a.email || "",
          referralCode: a.referralCode || "",
          totalReferrals: a.totalReferrals || 0,
          activeReferrals: a.activeReferrals || 0,
          totalEarned: `₦${Number(a.totalEarned || 0).toLocaleString()}`,
          pendingPayout: `₦${Number(a.pendingPayout || 0).toLocaleString()}`,
          conversionRate: a.conversionRate || 0,
          joinedDate: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: a.status || "pending",
        }));
        
        setAffiliates(mapped);
        setTotals({
          affiliates: res.data.totals?.total || 0,
          active: res.data.totals?.active || 0,
          referrals: mapped.reduce((sum: number, a: Affiliate) => sum + a.totalReferrals, 0),
          pendingPayouts: mapped.filter((a: Affiliate) => a.pendingPayout !== "₦0").length,
        });
      } catch (err) {
        console.error("Failed to fetch affiliates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliates();
  }, [search, statusFilter]);

  const filtered = affiliates;

  const copyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const toggleSuspend = async (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (!affiliate) return;
    
    const newStatus = affiliate.status === "suspended" ? "active" : "suspended";
    const endpoint = newStatus === "active" ? "activate" : "suspend";
    
    try {
      await api.post(`admin/affiliates/${id}/${endpoint}`);
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Failed to update affiliate status", err);
    }
  };

  const activateAffiliate = async (id: string) => {
    try {
      await api.post(`admin/affiliates/${id}/approve`);
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: "active" as AffiliateStatus } : a));
    } catch (err) {
      console.error("Failed to approve affiliate", err);
    }
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Share2 size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Affiliates</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Manage affiliate partners, referral codes, and commission payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Affiliates", value: totals.affiliates, icon: Share2, sub: `${totals.active} active` },
          { label: "Total Referrals", value: totals.referrals, icon: Users, sub: "all time" },
          { label: "Pending Payouts", value: totals.pendingPayouts, icon: CreditCard, sub: "awaiting payment" },
          { label: "Top Affiliate", value: "Dele Ojo", icon: TrendingUp, sub: "61 referrals • ₦448K earned" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#00ffcc]/60" />
                <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider">{s.label}</p>
              </div>
              <p className="text-xl font-bold font-display text-white truncate">{s.value}</p>
              <p className="text-[11px] text-[#b9cbc2]/40 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            type="text"
            placeholder="Search name, email or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] text-white placeholder:text-[#b9cbc2]/40 focus:border-[#00ffcc]/40"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "pending", "suspended"] as const).map((s) => (
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#00ffcc] animate-spin" />
            <span className="ml-2 text-[#b9cbc2]">Loading affiliates...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-[#b9cbc2]">
            No affiliates found.
          </div>
        ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ffcc]/08 text-left">
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">AFFILIATE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">REFERRAL CODE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">REFERRALS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">CONVERSION</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TOTAL EARNED</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">PENDING</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">STATUS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffcc]/05">
            {filtered.map((aff) => {
              const statusConf = STATUS_CONFIG[aff.status];
              const StatusIcon = statusConf.icon;
              return (
                <tr key={aff.id} className="hover:bg-[#00ffcc]/04 transition-all">
                  <td className="px-4 py-3.5">
                    <p className="text-white font-medium text-sm">{aff.name}</p>
                    <p className="text-[11px] text-[#b9cbc2]/50">{aff.email}</p>
                    <p className="text-[10px] text-[#b9cbc2]/30">{aff.userId}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#00ffcc] text-xs bg-[#00ffcc]/08 px-2 py-0.5 rounded border border-[#00ffcc]/20">{aff.referralCode}</span>
                      <button onClick={() => copyCode(aff.referralCode)} className="text-[#b9cbc2]/40 hover:text-[#00ffcc] transition-all">
                        {copiedCode === aff.referralCode ? <Check size={11} className="text-[#00ffcc]" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white font-semibold text-sm">{aff.totalReferrals}</p>
                    <p className="text-[11px] text-[#b9cbc2]/40">{aff.activeReferrals} active</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-[#0b2f2d]">
                        <div className="h-1.5 rounded-full bg-[#00ffcc]" style={{ width: `${aff.conversionRate}%` }} />
                      </div>
                      <span className="text-sm text-[#b9cbc2]">{aff.conversionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white font-semibold text-sm">{aff.totalEarned}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-sm font-medium", aff.pendingPayout !== "₦0" ? "text-[#f59e0b]" : "text-[#b9cbc2]/40")}>
                      {aff.pendingPayout}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border w-fit", statusConf.color, statusConf.bg, statusConf.border)}>
                      <StatusIcon size={10} /> {statusConf.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewAffiliate ? onViewAffiliate(aff.id) : setSelectedId(selectedId === aff.id ? null : aff.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white hover:border-[#00ffcc]/20 transition-all"
                      >
                        <Eye size={12} />
                      </button>
                      {aff.status === "pending" && (
                        <button
                          onClick={() => activateAffiliate(aff.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20 transition-all"
                        >
                          <CheckCircle size={12} />
                        </button>
                      )}
                      {aff.status !== "pending" && (
                        <button
                          onClick={() => toggleSuspend(aff.id)}
                          className={cn(
                            "w-7 h-7 flex items-center justify-center rounded-lg border transition-all",
                            aff.status === "suspended"
                              ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                              : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
                          )}
                        >
                          <Ban size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
