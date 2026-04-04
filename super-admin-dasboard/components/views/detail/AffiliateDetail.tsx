"use client";

import { useState } from "react";
import {
  ArrowLeft, ChevronRight, Share2, Users, TrendingUp, CreditCard,
  CheckCircle, XCircle, Clock, Ban, Activity, BarChart2, User,
  Mail, Phone, MapPin, Calendar, Copy, Check, Download, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateDetailProps {
  affiliateId: string;
  onBack: () => void;
  onViewTrader?: (traderId: string) => void;
}

const AFFILIATE_DATA: Record<string, {
  id: string; userId: string; name: string; email: string; phone: string;
  country: string; joinedDate: string; referralCode: string; status: string;
  totalReferrals: number; activeReferrals: number; totalEarned: string;
  pendingPayout: string; conversionRate: number; commissionRate: string;
  tier: string; paymentMethod: string;
  referrals: { id: string; name: string; status: string; joinDate: string; spent: string; earned: string; phase: string }[];
  commissions: { id: string; amount: string; referralName: string; trigger: string; date: string; status: string }[];
  monthlyPerf: { month: string; referrals: number; earned: number }[];
  notes: string;
}> = {
  "AFF-005": {
    id: "AFF-005", userId: "NF-5301", name: "Dele Ojo", email: "dele@email.com",
    phone: "+234 802 555 1234", country: "Nigeria",
    joinedDate: "2025-08-05", referralCode: "DELE25", status: "active",
    totalReferrals: 61, activeReferrals: 44, totalEarned: "₦448,000",
    pendingPayout: "₦48,000", conversionRate: 72, commissionRate: "8%",
    tier: "Gold", paymentMethod: "Bank Transfer",
    referrals: [
      { id: "#NF-88901", name: "Chidi Okonkwo", status: "Active", joinDate: "2026-01-15", spent: "₦90,000", earned: "₦7,200", phase: "FUNDED" },
      { id: "#NF-88745", name: "Ada Nwosu", status: "Active", joinDate: "2026-01-22", spent: "₦45,000", earned: "₦3,600", phase: "PHASE 2" },
      { id: "#NF-88600", name: "Emeka Eze", status: "Inactive", joinDate: "2025-12-10", spent: "₦45,000", earned: "₦3,600", phase: "PHASE 1" },
      { id: "#NF-88401", name: "Kemi Adeleke", status: "Active", joinDate: "2025-11-30", spent: "₦180,000", earned: "₦14,400", phase: "FUNDED" },
      { id: "#NF-88200", name: "Tunde Afolabi", status: "Active", joinDate: "2025-11-05", spent: "₦90,000", earned: "₦7,200", phase: "PHASE 2" },
    ],
    commissions: [
      { id: "COM-0441", amount: "₦7,200", referralName: "Chidi Okonkwo", trigger: "Phase 1 Purchase", date: "2026-01-15", status: "PAID" },
      { id: "COM-0440", amount: "₦3,600", referralName: "Ada Nwosu", trigger: "Phase 1 Purchase", date: "2026-01-22", status: "PAID" },
      { id: "COM-0439", amount: "₦14,400", referralName: "Kemi Adeleke", trigger: "Funded Purchase (x2)", date: "2025-12-08", status: "PAID" },
      { id: "COM-0438", amount: "₦7,200", referralName: "Tunde Afolabi", trigger: "Phase 1 Purchase", date: "2025-11-05", status: "PAID" },
      { id: "COM-0437", amount: "₦48,000", referralName: "Multiple (batch)", trigger: "Monthly batch payout", date: "2026-03-31", status: "PENDING" },
    ],
    monthlyPerf: [
      { month: "Sep", referrals: 4, earned: 28000 },
      { month: "Oct", referrals: 7, earned: 42000 },
      { month: "Nov", referrals: 9, earned: 64000 },
      { month: "Dec", referrals: 11, earned: 72000 },
      { month: "Jan", referrals: 14, earned: 88000 },
      { month: "Feb", referrals: 9, earned: 56000 },
      { month: "Mar", referrals: 7, earned: 48000 },
    ],
    notes: "Top affiliate. Consistently above 70% conversion. Eligible for Platinum tier upgrade at 75 total referrals. Has own audience of forex traders on Instagram.",
  },
};

const DEFAULT_AFFILIATE = AFFILIATE_DATA["AFF-005"];

const statusStyles: Record<string, string> = {
  active: "chip-active",
  pending: "chip-warning",
  suspended: "chip-danger",
};

const referralStatusStyles: Record<string, string> = {
  Active: "chip-active",
  Inactive: "chip-neutral",
  Flagged: "chip-danger",
};

const commissionStatusStyles: Record<string, string> = {
  PAID: "chip-active",
  PENDING: "chip-warning",
  FAILED: "chip-danger",
};

const tierColors: Record<string, string> = {
  Bronze: "text-[#cd7f32]",
  Silver: "text-[#b9cbc2]",
  Gold: "text-[#ffbc7c]",
  Platinum: "text-[#00ffcc]",
};

type Tab = "overview" | "referrals" | "commissions";

export default function AffiliateDetail({ affiliateId, onBack, onViewTrader }: AffiliateDetailProps) {
  const aff = AFFILIATE_DATA[affiliateId] || DEFAULT_AFFILIATE;
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [status, setStatus] = useState(aff.status);
  const [copied, setCopied] = useState(false);

  const maxEarned = Math.max(...aff.monthlyPerf.map(m => m.earned));

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="page-fade space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Affiliates
        </button>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-[#b9cbc2]/60 font-mono">{aff.id}</span>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-white">{aff.name}</span>
      </div>

      {/* Hero */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4 justify-between flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold font-display flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)", color: "#00ffcc" }}
            >
              {aff.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl font-bold font-display text-white">{aff.name}</h1>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize", statusStyles[status])}>{status}</span>
                <span className={cn("text-[11px] font-semibold", tierColors[aff.tier])}>{aff.tier} Tier</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#b9cbc2]/60 flex-wrap">
                <span className="flex items-center gap-1.5"><Mail size={11} />{aff.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={11} />{aff.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin size={11} />{aff.country}</span>
                <span className="flex items-center gap-1.5"><Calendar size={11} />Joined {aff.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00ffcc]/08 border border-[#00ffcc]/20">
              <span className="font-mono text-[#00ffcc] text-xs font-bold">{aff.referralCode}</span>
              <button onClick={copyCode} className="text-[#b9cbc2]/40 hover:text-[#00ffcc] transition-all ml-1">
                {copied ? <Check size={11} className="text-[#00ffcc]" /> : <Copy size={11} />}
              </button>
            </div>
            <button
              onClick={() => setStatus(status === "suspended" ? "active" : "suspended")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                status === "suspended"
                  ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                  : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
              )}
            >
              <Ban size={12} /> {status === "suspended" ? "Reinstate" : "Suspend"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-xs hover:text-white transition-all">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-[rgba(0,255,204,0.08)]">
          {[
            { label: "Total Referrals", value: `${aff.totalReferrals}`, color: "#ffffff" },
            { label: "Active", value: `${aff.activeReferrals}`, color: "#00ffcc" },
            { label: "Conversion Rate", value: `${aff.conversionRate}%`, color: "#00ffcc" },
            { label: "Total Earned", value: aff.totalEarned, color: "#00ffcc" },
            { label: "Pending Payout", value: aff.pendingPayout, color: aff.pendingPayout !== "₦0" ? "#f59e0b" : "#b9cbc2" },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-[10px] text-[#b9cbc2]/40 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-base font-bold font-display" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(0,255,204,0.08)]">
        {(["overview", "referrals", "commissions"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px",
              activeTab === tab ? "text-[#00ffcc] border-[#00ffcc]" : "text-[#b9cbc2]/50 border-transparent hover:text-[#b9cbc2]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Account Details */}
          <div className="glass-card rounded-xl p-5 space-y-1">
            <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
              <Share2 size={14} className="text-[#00ffcc]" /> Account Details
            </h3>
            {[
              { label: "Affiliate ID", value: aff.id },
              { label: "User ID", value: aff.userId },
              { label: "Commission Rate", value: aff.commissionRate },
              { label: "Tier", value: aff.tier, color: tierColors[aff.tier] },
              { label: "Payment Method", value: aff.paymentMethod },
              { label: "Next Tier", value: "Platinum (at 75 referrals)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
                <span className={cn("text-[11px] font-medium font-mono", (row as { color?: string }).color || "text-white")}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Referral Code Performance */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-[#00ffcc]" /> Monthly Performance
            </h3>
            <div className="flex items-end gap-1.5 h-28">
              {aff.monthlyPerf.map((m) => {
                const height = Math.round((m.earned / maxEarned) * 100);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-[#00ffcc]">₦{Math.round(m.earned / 1000)}K</span>
                    <div className="w-full rounded-t bg-[#00ffcc]/70" style={{ height: `${height}%`, minHeight: 4 }} />
                    <span className="text-[9px] text-[#b9cbc2]/40">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#b9cbc2]/50">
              <span>{aff.totalReferrals} total referrals since joining</span>
              <span className="text-[#00ffcc] font-semibold">{aff.conversionRate}% conversion</span>
            </div>
          </div>

          {/* Notes */}
          <div className="glass-card rounded-xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold font-display text-white mb-2">Internal Notes</h3>
            <p className="text-sm text-[#b9cbc2] leading-relaxed">{aff.notes}</p>
          </div>
        </div>
      )}

      {/* ── Tab: Referrals ── */}
      {activeTab === "referrals" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Users size={14} className="text-[#00ffcc]" /> Referred Traders
            </h3>
            <span className="text-xs text-[#b9cbc2]/50">{aff.referrals.length} shown (of {aff.totalReferrals} total)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["Trader ID", "Name", "Phase", "Join Date", "Total Spent", "Commission Earned", "Status", ""].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aff.referrals.map((ref) => (
                  <tr key={ref.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                    <td className="px-4 py-3.5 text-xs font-mono text-[#00ffcc]">{ref.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#0b2f2d] flex items-center justify-center text-[9px] font-bold text-[#00ffcc]">
                          {ref.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm text-white font-medium">{ref.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] bg-[#0b2f2d] text-[#b9cbc2] border border-[rgba(0,255,204,0.1)] px-2 py-0.5 rounded">{ref.phase}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/60">{ref.joinDate}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-[#b9cbc2]">{ref.spent}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#00ffcc] font-display">{ref.earned}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", referralStatusStyles[ref.status] || "chip-neutral")}>{ref.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {onViewTrader && (
                        <button
                          onClick={() => onViewTrader(ref.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white hover:border-[#00ffcc]/20 transition-all"
                        >
                          <Eye size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Commissions ── */}
      {activeTab === "commissions" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <CreditCard size={14} className="text-[#00ffcc]" /> Commission History
            </h3>
            <span className="text-xs text-[#b9cbc2]/50">{aff.commissions.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["Commission ID", "Amount", "From", "Trigger", "Date", "Status"].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aff.commissions.map((c) => (
                  <tr key={c.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                    <td className="px-4 py-3.5 text-xs font-mono text-[#00ffcc]">{c.id}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#00ffcc] font-display">{c.amount}</td>
                    <td className="px-4 py-3.5 text-xs text-white">{c.referralName}</td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/60">{c.trigger}</td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/60">{c.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", commissionStatusStyles[c.status] || "chip-neutral")}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
