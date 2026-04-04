"use client";

import { useState } from "react";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, TrendingUp,
  TrendingDown, Trophy, CreditCard, AlertTriangle, Ban, CheckCircle,
  Clock, BarChart2, Activity, FileText, MessageSquare, Flag, Eye,
  Download, Edit, ChevronRight, Landmark, Bitcoin, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TraderDetailProps {
  traderId: string;
  onBack: () => void;
  onViewChallenge?: (challengeId: string) => void;
  onViewPayout?: (payoutId: string) => void;
}

// ── Mock rich data ─────────────────────────────────────────────────────────
const TRADER_DATA: Record<string, {
  id: string; name: string; email: string; phone: string; country: string;
  type: string; balance: string; perf: string; positive: boolean; status: string;
  kyc: string; joined: string; totalChallenges: number; passed: number; failed: number;
  totalSpent: string; totalEarned: string; mt5Login: string; leverage: string;
  profitSplit: string; broker: string; lastLogin: string; ipAddress: string;
  timezone: string; referralCode?: string;
  challenges: { id: string; type: string; phase: string; startBal: string; currentBal: string; pl: string; plRaw: number; status: string; startDate: string; endDate?: string }[];
  payouts: { id: string; amount: string; method: string; status: string; date: string; notes?: string }[];
  activityLog: { action: string; time: string; ip: string; type: "info" | "warning" | "danger" | "success" }[];
  notes: string;
}> = {
  "#NF-89210": {
    id: "#NF-89210", name: "Felix Henderson", email: "felix.h@tradenet.io", phone: "+234 812 000 0001",
    country: "Nigeria", type: "FUNDED", balance: "$100,000", perf: "+4.2%", positive: true,
    status: "Active", kyc: "Verified", joined: "2025-08-14", totalChallenges: 3, passed: 2, failed: 1,
    totalSpent: "₦255,000", totalEarned: "₦1,200,000", mt5Login: "882010", leverage: "1:100",
    profitSplit: "80%", broker: "NF-LIVE-01", lastLogin: "2026-04-01 14:32 UTC",
    ipAddress: "102.89.44.21", timezone: "Africa/Lagos", referralCode: "FELIX10",
    challenges: [
      { id: "#CH-99281", type: "DOLLAR/FUNDED", phase: "Funded", startBal: "$100,000", currentBal: "$104,200", pl: "+4.2%", plRaw: 4.2, status: "ACTIVE", startDate: "2025-11-01" },
      { id: "#CH-88210", type: "DOLLAR/PHASE 2", phase: "Phase 2", startBal: "$50,000", currentBal: "$54,500", pl: "+9.0%", plRaw: 9.0, status: "PASSED", startDate: "2025-09-10", endDate: "2025-10-30" },
      { id: "#CH-77120", type: "DOLLAR/PHASE 1", phase: "Phase 1", startBal: "$25,000", currentBal: "$22,000", pl: "-12.0%", plRaw: -12.0, status: "FAILED", startDate: "2025-07-05", endDate: "2025-08-12" },
    ],
    payouts: [
      { id: "#PAY-8910", amount: "₦1,200,000", method: "Bank Transfer", status: "APPROVED", date: "Mar 30, 1:30 PM" },
      { id: "#PAY-7821", amount: "₦450,000", method: "USDT (TRC20)", status: "APPROVED", date: "Feb 15, 9:00 AM" },
      { id: "#PAY-6540", amount: "₦300,000", method: "Bank Transfer", status: "REJECTED", date: "Jan 22, 3:45 PM", notes: "Incomplete bank details" },
    ],
    activityLog: [
      { action: "Logged in from Lagos, Nigeria", time: "2026-04-01 14:32", ip: "102.89.44.21", type: "info" },
      { action: "Payout request submitted — ₦1,200,000", time: "2026-03-30 13:28", ip: "102.89.44.21", type: "success" },
      { action: "Challenge #CH-99281 trade opened — BUY EURUSD 0.5 lots", time: "2026-03-28 10:15", ip: "102.89.44.21", type: "info" },
      { action: "KYC documents re-submitted", time: "2026-03-15 08:40", ip: "102.89.44.21", type: "warning" },
      { action: "Password changed", time: "2026-03-10 12:00", ip: "102.89.23.10", type: "warning" },
      { action: "Challenge #CH-88210 passed — Phase 2", time: "2025-10-30 16:00", ip: "102.89.44.21", type: "success" },
    ],
    notes: "VIP trader. Consistently profitable. Referred 3 new users via FELIX10 code. Monitor Phase 2 drawdown — hit 4.1% on March 28.",
  },
  "#NF-89213": {
    id: "#NF-89213", name: "Ayo Tobi", email: "ayo.tobi@gmail.com", phone: "+234 807 222 3333",
    country: "Nigeria", type: "FUNDED", balance: "$200,000", perf: "+8.2%", positive: true,
    status: "Active", kyc: "Verified", joined: "2025-07-05", totalChallenges: 5, passed: 4, failed: 1,
    totalSpent: "₦425,000", totalEarned: "₦3,200,000", mt5Login: "878900", leverage: "1:100",
    profitSplit: "80%", broker: "NF-LIVE-01", lastLogin: "2026-04-01 10:20 UTC",
    ipAddress: "105.112.44.88", timezone: "Africa/Lagos",
    challenges: [
      { id: "#CH-96221", type: "DOLLAR/PHASE 1", phase: "Phase 1", startBal: "$25,000", currentBal: "$27,450", pl: "+9.8%", plRaw: 9.8, status: "ACTIVE", startDate: "2026-03-01" },
      { id: "#CH-90001", type: "NAIRA/FUNDED", phase: "Funded", startBal: "₦5,000,000", currentBal: "₦5,410,000", pl: "+8.2%", plRaw: 8.2, status: "ACTIVE", startDate: "2026-01-15" },
      { id: "#CH-84221", type: "NAIRA/PHASE 2", phase: "Phase 2", startBal: "₦2,000,000", currentBal: "₦2,180,000", pl: "+9.0%", plRaw: 9.0, status: "PASSED", startDate: "2025-10-01", endDate: "2025-12-20" },
    ],
    payouts: [
      { id: "#PAY-8921", amount: "₦1,250,000", method: "Bank Transfer", status: "PENDING", date: "Mar 31, 2:15 PM" },
      { id: "#PAY-7001", amount: "₦800,000", method: "USDT (TRC20)", status: "APPROVED", date: "Feb 20, 10:30 AM" },
    ],
    activityLog: [
      { action: "Payout request submitted — ₦1,250,000", time: "2026-03-31 14:15", ip: "105.112.44.88", type: "info" },
      { action: "Phase 1 challenge entered profit target zone", time: "2026-03-28 11:00", ip: "105.112.44.88", type: "success" },
      { action: "Logged in from Lagos, Nigeria", time: "2026-03-28 09:00", ip: "105.112.44.88", type: "info" },
    ],
    notes: "Top-performing Nigerian trader. 4 out of 5 challenges passed. Clean compliance record. No flags to date.",
  },
  "#NF-89211": {
    id: "#NF-89211", name: "Sarah Valerius", email: "s.valerius@fintech.com", phone: "+234 803 111 2222",
    country: "Nigeria", type: "PHASE 2", balance: "$50,000", perf: "-1.8%", positive: false,
    status: "Flagged", kyc: "Verified", joined: "2025-09-01", totalChallenges: 2, passed: 1, failed: 1,
    totalSpent: "₦90,000", totalEarned: "₦0", mt5Login: "881001", leverage: "1:100",
    profitSplit: "80%", broker: "NF-LIVE-02", lastLogin: "2026-03-31 09:10 UTC",
    ipAddress: "41.203.88.12", timezone: "Africa/Lagos",
    challenges: [
      { id: "#CH-98112", type: "NAIRA/FUNDED", phase: "Funded", startBal: "₦10,000,000", currentBal: "₦11,200,000", pl: "+12.0%", plRaw: 12.0, status: "PASSED", startDate: "2025-12-01", endDate: "2026-02-15" },
      { id: "#CH-91002", type: "DOLLAR/PHASE 2", phase: "Phase 2", startBal: "$50,000", currentBal: "$49,100", pl: "-1.8%", plRaw: -1.8, status: "ACTIVE", startDate: "2026-02-20" },
    ],
    payouts: [],
    activityLog: [
      { action: "Account flagged — suspicious withdrawal pattern", time: "2026-03-31 09:00", ip: "41.203.88.12", type: "danger" },
      { action: "Logged in from unknown IP", time: "2026-03-31 08:55", ip: "41.203.88.12", type: "warning" },
    ],
    notes: "Account flagged for review. IP address mismatch on latest session. Compliance review pending.",
  },
};

const DEFAULT_TRADER = TRADER_DATA["#NF-89210"];

const statusStyles: Record<string, string> = {
  Active: "chip-active",
  Flagged: "chip-danger",
  Inactive: "chip-neutral",
  Banned: "bg-[#7f1d1d]/40 text-[#ff4444] border border-[#ff4444]/30",
};

const kycColors: Record<string, string> = {
  Verified: "text-[#00ffcc]",
  Pending: "text-[#f59e0b]",
  Rejected: "text-[#ff4444]",
};

const challengeStatusStyles: Record<string, string> = {
  ACTIVE: "chip-active",
  PASSED: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30",
  FAILED: "chip-danger",
  DISABLED: "chip-neutral",
};

const payoutStatusStyles: Record<string, string> = {
  PENDING: "chip-warning",
  PROCESSING: "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30",
  FLAGGED: "chip-danger",
  APPROVED: "chip-active",
  REJECTED: "bg-[#7f1d1d]/30 text-[#ff6b6b] border border-[#ff4444]/30",
};

const activityColors: Record<string, string> = {
  info: "text-[#60a5fa]",
  success: "text-[#00ffcc]",
  warning: "text-[#f59e0b]",
  danger: "text-[#ff6b6b]",
};

const activityDots: Record<string, string> = {
  info: "bg-[#60a5fa]",
  success: "bg-[#00ffcc]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ff4444]",
};

type Tab = "overview" | "challenges" | "payouts" | "activity" | "notes";

export default function TraderDetail({ traderId, onBack, onViewChallenge, onViewPayout }: TraderDetailProps) {
  const trader = TRADER_DATA[traderId] || DEFAULT_TRADER;
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [status, setStatus] = useState(trader.status);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(trader.notes);

  const initials = trader.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="page-fade space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Users
        </button>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-[#b9cbc2]/60 font-mono">{trader.id}</span>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-white font-medium">{trader.name}</span>
      </div>

      {/* Hero Card */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4 flex-wrap">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold font-display flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0b2f2d, #001a18)", border: "1px solid rgba(0,255,204,0.3)", color: "#00ffcc" }}
          >
            {initials}
          </div>

          {/* Core info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold font-display text-white">{trader.name}</h1>
              <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", statusStyles[status] || "chip-neutral")}>{status}</span>
              <span className="text-[11px] font-mono text-[#00ffcc] bg-[#00ffcc]/08 px-2 py-0.5 rounded border border-[#00ffcc]/20">{trader.id}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#b9cbc2]/60 flex-wrap">
              <span className="flex items-center gap-1.5"><Mail size={11} />{trader.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={11} />{trader.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={11} />{trader.country}</span>
              <span className="flex items-center gap-1.5"><Calendar size={11} />Joined {trader.joined}</span>
              <span className={cn("flex items-center gap-1", kycColors[trader.kyc])}>
                <Shield size={11} /> {trader.kyc}
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-xs font-semibold hover:bg-[#00ffcc]/20 transition-all">
              <Mail size={12} /> Message
            </button>
            <button
              onClick={() => setStatus(status === "Banned" ? "Active" : "Banned")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                status === "Banned"
                  ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                  : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
              )}
            >
              <Ban size={12} /> {status === "Banned" ? "Unban" : "Ban"}
            </button>
            <button
              onClick={() => setStatus(status === "Flagged" ? "Active" : "Flagged")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold hover:bg-[#f59e0b]/20 transition-all"
            >
              <Flag size={12} /> {status === "Flagged" ? "Unflag" : "Flag"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-xs hover:text-white transition-all">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-[rgba(0,255,204,0.08)]">
          {[
            { label: "Account Type", value: trader.type, color: "#00ffcc" },
            { label: "Balance", value: trader.balance, color: "#ffffff" },
            { label: "Performance", value: trader.perf, color: trader.positive ? "#00ffcc" : "#ff6b6b" },
            { label: "Challenges", value: `${trader.totalChallenges}`, color: "#ffffff" },
            { label: "Total Spent", value: trader.totalSpent, color: "#ffbc7c" },
            { label: "Total Earned", value: trader.totalEarned, color: "#00ffcc" },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-[10px] text-[#b9cbc2]/40 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-sm font-bold font-display" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(0,255,204,0.08)] pb-0">
        {(["overview", "challenges", "payouts", "activity", "notes"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px",
              activeTab === tab
                ? "text-[#00ffcc] border-[#00ffcc]"
                : "text-[#b9cbc2]/50 border-transparent hover:text-[#b9cbc2]"
            )}
          >
            {tab === "activity" ? "Activity Log" : tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Account Details */}
          <div className="glass-card rounded-xl p-5 space-y-1">
            <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
              <User size={14} className="text-[#00ffcc]" /> Account Details
            </h3>
            {[
              { label: "MT5 Login", value: trader.mt5Login },
              { label: "Leverage", value: trader.leverage },
              { label: "Profit Split", value: trader.profitSplit },
              { label: "Broker Server", value: trader.broker },
              { label: "Timezone", value: trader.timezone },
              { label: "Referral Code", value: trader.referralCode || "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className="text-xs text-[#b9cbc2]/50">{row.label}</span>
                <span className="text-xs font-medium text-white font-mono">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Security & Session */}
          <div className="glass-card rounded-xl p-5 space-y-1">
            <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
              <Shield size={14} className="text-[#00ffcc]" /> Security & Session
            </h3>
            {[
              { label: "Last Login", value: trader.lastLogin },
              { label: "Last IP Address", value: trader.ipAddress },
              { label: "KYC Status", value: trader.kyc, color: kycColors[trader.kyc] },
              { label: "Account Status", value: status, color: status === "Active" ? "text-[#00ffcc]" : "text-[#ff6b6b]" },
              { label: "Phase Passed", value: `${trader.passed}/${trader.totalChallenges}` },
              { label: "Phases Failed", value: `${trader.failed}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className="text-xs text-[#b9cbc2]/50">{row.label}</span>
                <span className={cn("text-xs font-medium font-mono", (row as { color?: string }).color || "text-white")}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="glass-card rounded-xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold font-display text-white mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-[#00ffcc]" /> Performance Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Win Rate", value: "64%", color: "#00ffcc", bar: 64 },
                { label: "Avg P/L per Trade", value: "+1.2%", color: "#00ffcc", bar: 60 },
                { label: "Max Drawdown Used", value: "4.1%", color: "#f59e0b", bar: 41 },
                { label: "Best Trading Day", value: "+3.8%", color: "#10b981", bar: 76 },
              ].map((m) => (
                <div key={m.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-[#b9cbc2]/50">{m.label}</p>
                    <p className="text-sm font-bold font-display" style={{ color: m.color }}>{m.value}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0b2f2d]">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${m.bar}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Challenges ── */}
      {activeTab === "challenges" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Trophy size={14} className="text-[#00ffcc]" /> Challenge History
            </h3>
            <span className="text-xs text-[#b9cbc2]/50">{trader.challenges.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["Challenge ID", "Type / Phase", "Start Balance", "End Balance", "P/L", "Status", "Dates"].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trader.challenges.map((ch) => (
                  <tr
                    key={ch.id}
                    onClick={() => onViewChallenge && onViewChallenge(ch.id)}
                    className={cn("table-row-hover border-b border-[rgba(0,255,204,0.04)]", onViewChallenge && "cursor-pointer")}
                  >
                    <td className="px-4 py-3.5 text-xs font-mono text-[#00ffcc]">{ch.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-white">{ch.type}</p>
                      <p className="text-[10px] text-[#b9cbc2]/40">{ch.phase}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{ch.startBal}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold font-display text-white">{ch.currentBal}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-sm font-bold font-display flex items-center gap-1 w-fit", ch.plRaw >= 0 ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                        {ch.plRaw >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {ch.pl}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", challengeStatusStyles[ch.status] || "chip-neutral")}>{ch.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[10px] text-[#b9cbc2]/50">
                      {ch.startDate}{ch.endDate ? ` → ${ch.endDate}` : " → present"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Payouts ── */}
      {activeTab === "payouts" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <CreditCard size={14} className="text-[#00ffcc]" /> Payout History
            </h3>
            <span className="text-xs text-[#b9cbc2]/50">{trader.payouts.length} transactions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["Payout ID", "Amount", "Method", "Status", "Date", "Notes"].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trader.payouts.map((pay) => (
                  <tr
                    key={pay.id}
                    onClick={() => onViewPayout && onViewPayout(pay.id)}
                    className={cn("table-row-hover border-b border-[rgba(0,255,204,0.04)]", onViewPayout && "cursor-pointer")}
                  >
                    <td className="px-4 py-3.5 text-xs font-mono text-[#00ffcc]">{pay.id}</td>
                    <td className="px-4 py-3.5 text-sm font-bold font-display text-[#00ffcc]">{pay.amount}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-[#b9cbc2]">
                        {pay.method.includes("Bank") ? <Landmark size={11} className="opacity-60" /> : <Bitcoin size={11} className="opacity-60" />}
                        {pay.method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", payoutStatusStyles[pay.status] || "chip-neutral")}>{pay.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/60">{pay.date}</td>
                    <td className="px-4 py-3.5 text-[10px] text-[#f59e0b]">{pay.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Activity Log ── */}
      {activeTab === "activity" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)]">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Activity size={14} className="text-[#00ffcc]" /> Activity Log
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {trader.activityLog.map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", activityDots[log.type])} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-medium", activityColors[log.type])}>{log.action}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-[#b9cbc2]/40">{log.time}</span>
                    <span className="text-[10px] text-[#b9cbc2]/30 font-mono">IP: {log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Notes ── */}
      {activeTab === "notes" && (
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <FileText size={14} className="text-[#00ffcc]" /> Internal Admin Notes
            </h3>
            <button
              onClick={() => setEditNotes(!editNotes)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/10 transition-all"
            >
              <Edit size={11} /> {editNotes ? "Cancel" : "Edit Notes"}
            </button>
          </div>
          {editNotes ? (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 text-sm rounded-xl bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#b9cbc2]/30 resize-none input-field leading-relaxed"
              />
              <button
                onClick={() => setEditNotes(false)}
                className="px-4 py-2 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-bold btn-primary hover:bg-[#00e6b8] transition-all"
              >
                Save Notes
              </button>
            </div>
          ) : (
            <div className="bg-[#0b2f2d]/40 rounded-xl px-4 py-3 border border-[rgba(0,255,204,0.08)]">
              <p className="text-sm text-[#b9cbc2] leading-relaxed">{notes || "No internal notes yet."}</p>
            </div>
          )}
          <p className="text-[10px] text-[#b9cbc2]/30">Last updated by admin — Apr 1, 2026. Notes are visible to Super Admin and Compliance only.</p>
        </div>
      )}
    </div>
  );
}
