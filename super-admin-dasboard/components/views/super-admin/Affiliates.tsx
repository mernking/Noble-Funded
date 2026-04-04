"use client";

import { useState } from "react";
import { Share2, Search, Download, TrendingUp, Users, CreditCard, DollarSign, Eye, Ban, CheckCircle, Clock, XCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

const AFFILIATES: Affiliate[] = [
  { id: "AFF-001", userId: "NF-1201", name: "Tosin Abiodun", email: "tosin@email.com", referralCode: "TOSIN20", totalReferrals: 47, activeReferrals: 31, totalEarned: "₦284,000", pendingPayout: "₦24,000", conversionRate: 66, joinedDate: "2025-09-12", status: "active" },
  { id: "AFF-002", userId: "NF-2034", name: "Bimpe Adeyemi", email: "bimpe@email.com", referralCode: "BIMPE15", totalReferrals: 32, activeReferrals: 22, totalEarned: "₦176,000", pendingPayout: "₦16,000", conversionRate: 69, joinedDate: "2025-10-04", status: "active" },
  { id: "AFF-003", userId: "NF-3190", name: "Kunle Osei", email: "kunle@email.com", referralCode: "KUNLE10", totalReferrals: 18, activeReferrals: 9, totalEarned: "₦76,000", pendingPayout: "₦8,000", conversionRate: 50, joinedDate: "2025-11-20", status: "active" },
  { id: "AFF-004", userId: "NF-4442", name: "Nkechi Okafor", email: "nkechi@email.com", referralCode: "NKECHI5", totalReferrals: 8, activeReferrals: 0, totalEarned: "₦32,000", pendingPayout: "₦0", conversionRate: 0, joinedDate: "2025-12-01", status: "pending" },
  { id: "AFF-005", userId: "NF-5301", name: "Dele Ojo", email: "dele@email.com", referralCode: "DELE25", totalReferrals: 61, activeReferrals: 44, totalEarned: "₦448,000", pendingPayout: "₦48,000", conversionRate: 72, joinedDate: "2025-08-05", status: "active" },
  { id: "AFF-006", userId: "NF-6104", name: "Amaka Eze", email: "amaka@email.com", referralCode: "AMAKA30", totalReferrals: 14, activeReferrals: 0, totalEarned: "₦64,000", pendingPayout: "₦0", conversionRate: 0, joinedDate: "2025-10-15", status: "suspended" },
];

const STATUS_CONFIG: Record<AffiliateStatus, { label: string; icon: React.ComponentType<{size?: number; className?: string}>; color: string; bg: string; border: string }> = {
  active: { label: "Active", icon: CheckCircle, color: "text-[#00ffcc]", bg: "bg-[#00ffcc]/10", border: "border-[#00ffcc]/25" },
  pending: { label: "Pending", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/25" },
  suspended: { label: "Suspended", icon: XCircle, color: "text-[#ff4444]", bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/25" },
};

interface AffiliatesViewProps {
  onViewAffiliate?: (affiliateId: string) => void;
}

export default function AffiliatesView({ onViewAffiliate }: AffiliatesViewProps = {}) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(AFFILIATES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AffiliateStatus>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = affiliates.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.referralCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const toggleSuspend = (id: string) => {
    setAffiliates((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "suspended" ? "active" : "suspended" } : a));
  };

  const activateAffiliate = (id: string) => {
    setAffiliates((prev) => prev.map((a) => a.id === id ? { ...a, status: "active" as AffiliateStatus } : a));
  };

  const totals = {
    affiliates: affiliates.length,
    active: affiliates.filter((a) => a.status === "active").length,
    referrals: affiliates.reduce((s, a) => s + a.totalReferrals, 0),
    pendingPayouts: affiliates.filter((a) => a.pendingPayout !== "₦0").length,
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
      </div>
    </div>
  );
}
