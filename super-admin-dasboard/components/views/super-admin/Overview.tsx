"use client";

import { useState } from "react";
import {
  TrendingUp, Users, Trophy, CreditCard, AlertCircle,
  RefreshCw, Download, ArrowRight, CheckCircle, UserPlus,
  Award, Server, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Activity, Shield, Clock, Zap,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const revenueData = [
  { day: "Apr 1", rev: 210000, payouts: 85000, net: 125000 },
  { day: "Apr 4", rev: 240000, payouts: 108000, net: 132000 },
  { day: "Apr 7", rev: 285000, payouts: 112000, net: 173000 },
  { day: "Apr 10", rev: 320000, payouts: 145000, net: 175000 },
  { day: "Apr 13", rev: 295000, payouts: 130000, net: 165000 },
  { day: "Apr 16", rev: 410000, payouts: 170000, net: 240000 },
  { day: "Apr 19", rev: 480000, payouts: 195000, net: 285000 },
  { day: "Apr 22", rev: 520000, payouts: 220000, net: 300000 },
  { day: "Apr 25", rev: 610000, payouts: 255000, net: 355000 },
  { day: "Apr 28", rev: 720000, payouts: 298000, net: 422000 },
  { day: "Today", rev: 847000, payouts: 350000, net: 497000 },
];

const challengeData = [
  { type: "₦200K", active: 42, passed: 18, failed: 12, currency: "NGN" },
  { type: "₦400K", active: 31, passed: 14, failed: 8, currency: "NGN" },
  { type: "₦800K", active: 19, passed: 9, failed: 5, currency: "NGN" },
  { type: "₦1M", active: 15, passed: 6, failed: 4, currency: "NGN" },
  { type: "$5K", active: 28, passed: 11, failed: 7, currency: "USD" },
  { type: "$10K", active: 22, passed: 7, failed: 4, currency: "USD" },
  { type: "$25K", active: 14, passed: 4, failed: 3, currency: "USD" },
  { type: "$100K", active: 8, passed: 2, failed: 1, currency: "USD" },
];

const userGrowthData = [
  { month: "Oct", users: 120 },
  { month: "Nov", users: 189 },
  { month: "Dec", users: 278 },
  { month: "Jan", users: 390 },
  { month: "Feb", users: 512 },
  { month: "Mar", users: 734 },
  { month: "Apr", users: 1021 },
];

const pieData = [
  { name: "Naira Accounts", value: 62, color: "#00ffcc" },
  { name: "Dollar Accounts", value: 38, color: "#ffbc7c" },
];

const activityFeed = [
  { id: 1, icon: CheckCircle, color: "#00ffcc", title: "Payout approved — Jane Adeyemi", subtitle: "2 MIN AGO • COMPLIANCE APPROVED", value: "₦45,000", type: "success" },
  { id: 2, icon: UserPlus, color: "#34d399", title: "New user registered — ID #4821", subtitle: "14 MIN AGO • KYC PENDING", value: "Chidi O.", type: "info" },
  { id: 3, icon: Award, color: "#ffbc7c", title: "Phase 1 passed — Mark S.", subtitle: "45 MIN AGO • NAIRA ₦800K CHALLENGE", value: "+₦160K", type: "warning" },
  { id: 4, icon: AlertTriangle, color: "#ff6b6b", title: "Drawdown alert — Alex Thorne", subtitle: "1H AGO • 91.4% MAX DRAWDOWN", value: "CRITICAL", type: "danger" },
  { id: 5, icon: CreditCard, color: "#a78bfa", title: "USDT payout processed", subtitle: "2H AGO • FINANCE OPS", value: "₦2.8M", type: "success" },
  { id: 6, icon: Shield, color: "#60a5fa", title: "KYC verified — Emeka N.", subtitle: "3H AGO • IDENTITY CONFIRMED", value: "ID #4619", type: "info" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-modal rounded-xl p-3 text-xs border border-[rgba(0,255,204,0.2)]">
        <p className="text-[#a8c0b8] mb-2 font-display font-semibold">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: ₦{(p.value || 0).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-modal rounded-xl p-3 text-xs border border-[rgba(0,255,204,0.2)]">
        <p className="text-[#a8c0b8] mb-2 font-display font-semibold text-[10px]">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.fill }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

type SystemFilter = "all" | "NGN" | "USD";

// System-specific KPI data
const SYSTEM_DATA = {
  NGN: {
    revenue: "₦547,000",
    revenueSub: "+14.2% vs yesterday",
    challenges: "98",
    pendingPayouts: "5 / ₦780K",
    traders: "632",
  },
  USD: {
    revenue: "$4,120",
    revenueSub: "+9.8% vs yesterday",
    challenges: "58",
    pendingPayouts: "3 / $18.4K",
    traders: "389",
  },
  all: {
    revenue: "₦847,000",
    revenueSub: "+12.4% vs yesterday",
    challenges: "156",
    pendingPayouts: "8 / ₦1.2M",
    traders: "1,021",
  },
};

export default function SuperAdminOverview({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");
  const [system, setSystem] = useState<SystemFilter>("all");

  const systemData = SYSTEM_DATA[system];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const kpis = [
    {
      label: "REVENUE TODAY",
      value: systemData.revenue,
      sub: systemData.revenueSub,
      trend: "up",
      icon: TrendingUp,
      iconColor: "#00ffcc",
      badge: "+12.4%",
      badgeColor: "#00ffcc",
    },
    {
      label: "NEW SIGNUPS",
      value: "23 Users",
      sub: "Target: 20 users/day",
      trend: "up",
      icon: Users,
      iconColor: "#34d399",
      badge: "TARGET MET",
      badgeColor: "#34d399",
    },
    {
      label: "ACTIVE CHALLENGES",
      value: systemData.challenges,
      sub: system === "all" ? "Across all plan tiers" : system === "NGN" ? "Naira plan tiers" : "Dollar plan tiers",
      trend: "up",
      icon: Trophy,
      iconColor: "#ffbc7c",
      badge: "LIVE",
      badgeColor: "#ffbc7c",
    },
    {
      label: "PENDING PAYOUTS",
      value: systemData.pendingPayouts,
      sub: "Awaiting compliance review",
      trend: "warn",
      icon: CreditCard,
      iconColor: "#ff6b6b",
      badge: "ACTION NEEDED",
      badgeColor: "#ff6b6b",
    },
    {
      label: "KYC PENDING",
      value: "12 Users",
      sub: "Awaiting document review",
      trend: "warn",
      icon: Shield,
      iconColor: "#60a5fa",
      badge: "REVIEW",
      badgeColor: "#60a5fa",
    },
    {
      label: "TOTAL TRADERS",
      value: systemData.traders,
      sub: system === "all" ? "All-time registrations" : system === "NGN" ? "Naira account holders" : "Dollar account holders",
      trend: "up",
      icon: UserPlus,
      iconColor: "#a78bfa",
      badge: "+8.2%",
      badgeColor: "#a78bfa",
    },
    {
      label: "PLATFORM UPTIME",
      value: "99.98%",
      sub: "Last 30 days",
      trend: "up",
      icon: Server,
      iconColor: "#00ffcc",
      badge: "NOMINAL",
      badgeColor: "#00ffcc",
    },
    {
      label: "ALERTS TODAY",
      value: "4 Issues",
      sub: "1 critical, 3 warnings",
      trend: "danger",
      icon: AlertCircle,
      iconColor: "#ff6b6b",
      badge: "MONITOR",
      badgeColor: "#ff6b6b",
    },
  ];

  return (
    <div className="page-fade space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white text-balance">System Overview</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Real-time institutional platform performance — Noble Funded v2.4</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* System filter — NGN / USD / All */}
          <div className="flex items-center bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl p-1">
            {([
              { value: "all", label: "All Systems" },
              { value: "NGN", label: "₦ Naira" },
              { value: "USD", label: "$ Dollar" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSystem(opt.value)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={
                  system === opt.value
                    ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc", border: "1px solid rgba(0,255,204,0.25)" }
                    : { color: "#a8c0b8" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
          {/* Time range selector */}
          <div className="flex items-center bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl p-1">
            {(["7D", "30D", "90D"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={
                  timeRange === t
                    ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc", border: "1px solid rgba(0,255,204,0.25)" }
                    : { color: "#a8c0b8" }
                }
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,204,0.18)] text-[12px] text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={handleRefresh}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold transition-all"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Grid — 4 cols desktop, 2 cols tablet, 2 cols mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.slice(0, 4).map((kpi, i) => (
          <div key={i} className="glass-card-elevated rounded-2xl p-4 kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.iconColor}15`, border: `1px solid ${kpi.iconColor}22` }}
              >
                <kpi.icon size={16} style={{ color: kpi.iconColor }} />
              </div>
              <div className="flex items-center gap-1">
                {kpi.trend === "up" && <ArrowUpRight size={12} style={{ color: kpi.badgeColor }} />}
                {kpi.trend === "down" && <ArrowDownRight size={12} style={{ color: "#ff6b6b" }} />}
                <span className="text-[10px] font-bold" style={{ color: kpi.badgeColor }}>{kpi.badge}</span>
              </div>
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{kpi.label}</p>
            <p className="text-[18px] font-bold font-display text-white kpi-value leading-tight">{kpi.value}</p>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.slice(4, 8).map((kpi, i) => (
          <div key={i} className="glass-card rounded-xl p-3.5 kpi-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <kpi.icon size={14} style={{ color: kpi.iconColor }} />
                <span className="text-[10px] tracking-wider text-[#a8c0b8]/50 uppercase font-display">{kpi.label}</span>
              </div>
            </div>
            <p className="text-[16px] font-bold font-display text-white">{kpi.value}</p>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main charts row — Revenue chart full width, then Account Split + Quick Actions below on a new row */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h2 className="text-[14px] font-semibold font-display text-white">Revenue & Payouts</h2>
            <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase mt-0.5">30-Day Performance Window</p>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 text-[11px] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ffcc]" />
              <span className="text-[#a8c0b8]/70">Gross Rev</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffbc7c]" />
              <span className="text-[#a8c0b8]/70">Payouts</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
              <span className="text-[#a8c0b8]/70">Net</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffbc7c" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ffbc7c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" />
            <XAxis dataKey="day" tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="rev" name="Revenue" stroke="#00ffcc" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#ffbc7c" strokeWidth={2} fill="url(#payGrad)" dot={false} />
            <Area type="monotone" dataKey="net" name="Net" stroke="#60a5fa" strokeWidth={1.5} fill="url(#netGrad)" dot={false} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Account Split + Quick Actions row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie chart — Account Split */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold font-display text-white mb-1">Account Split</h2>
          <p className="text-[10px] text-[#a8c0b8]/40 mb-4">Naira vs Dollar challenges</p>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <PieChart width={160} height={160}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  strokeWidth={0}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="flex-1 space-y-3">
              {pieData.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[#a8c0b8]/70">{d.name}</span>
                    </div>
                    <span className="font-bold text-[14px]" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${d.value}%`, background: d.color, opacity: 0.75 }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-[rgba(0,255,204,0.06)]">
                <p className="text-[10px] text-[#a8c0b8]/40">Total Active Accounts</p>
                <p className="text-[18px] font-bold font-display text-white">1,021</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold font-display text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Review Payouts", tab: "payouts", icon: CreditCard, color: "#a78bfa", badge: "8", desc: "Awaiting compliance review" },
              { label: "KYC Reviews", tab: "kyc", icon: Shield, color: "#60a5fa", badge: "12", desc: "Pending document verification" },
              { label: "Failed Challenges", tab: "challenges", icon: AlertCircle, color: "#ff6b6b", badge: "5", desc: "Requires manual review" },
              { label: "System Settings", tab: "settings", icon: Server, color: "#00ffcc", badge: undefined, desc: "Platform configuration" },
            ].map((action) => (
              <button
                key={action.tab}
                onClick={() => onTabChange(action.tab)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-[#00ffcc]/06 border border-[rgba(0,255,204,0.06)] hover:border-[rgba(0,255,204,0.18)] text-[12px] text-[#a8c0b8] hover:text-white transition-all group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.color}15`, border: `1px solid ${action.color}20` }}
                >
                  <action.icon size={14} style={{ color: action.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[12px] font-medium text-white group-hover:text-[#00ffcc] transition-colors">{action.label}</p>
                  <p className="text-[10px] text-[#a8c0b8]/40">{action.desc}</p>
                </div>
                {action.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4444]/15 text-[#ff6b6b] flex-shrink-0">{action.badge}</span>
                )}
                <ArrowRight size={13} className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" style={{ color: "#00ffcc" }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge breakdown + User growth */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Challenge bar chart */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-semibold font-display text-white">Challenge Breakdown</h2>
              <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Active, passed, failed by plan</p>
            </div>
            <button onClick={() => onTabChange("challenges")} className="text-[11px] text-[#00ffcc] hover:underline font-medium">VIEW ALL</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={system === "all" ? challengeData : challengeData.filter((d) => d.currency === system)}
              margin={{ top: 0, right: 5, left: -25, bottom: 0 }} barSize={8} barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" vertical={false} />
              <XAxis dataKey="type" tick={{ fill: "#a8c0b8", fontSize: 8.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="active" name="Active" fill="#00ffcc" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="passed" name="Passed" fill="#34d399" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
              <Bar dataKey="failed" name="Failed" fill="#ff6b6b" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 text-[10px] mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00ffcc]" />Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34d399]" />Passed</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff6b6b]" />Failed</span>
          </div>
        </div>

        {/* User growth line chart */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-semibold font-display text-white">User Growth</h2>
              <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Cumulative registrations by month</p>
            </div>
            <button onClick={() => onTabChange("users")} className="text-[11px] text-[#00ffcc] hover:underline font-medium">VIEW USERS</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#a8c0b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a8c0b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(8,35,32,0.92)", border: "1px solid rgba(0,255,204,0.2)", borderRadius: "12px", fontSize: "12px" }}
                labelStyle={{ color: "#a8c0b8" }}
                itemStyle={{ color: "#a78bfa" }}
              />
              <Line type="monotone" dataKey="users" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: "#a78bfa", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a78bfa" }} name="Total Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed + Platform Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#00ffcc]" />
              <h2 className="text-[14px] font-semibold font-display text-white">Live Activity Feed</h2>
            </div>
            <button onClick={() => onTabChange("activity-logs")} className="text-[11px] text-[#00ffcc] hover:underline font-medium">VIEW ALL LOGS</button>
          </div>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}1a` }}
                >
                  <item.icon size={13} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-[#a8c0b8]/40">{item.subtitle}</p>
                </div>
                <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Status */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#00ffcc]" />
            <h2 className="text-[14px] font-semibold font-display text-white">Platform Status</h2>
          </div>

          {/* Profit split bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase">Profit Split</p>
              <span className="text-[22px] font-bold font-display text-[#00ffcc] neon-text">80%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: "80%", background: "linear-gradient(90deg, #00ffcc, #00d4a8)", boxShadow: "0 0 8px rgba(0,255,204,0.4)" }}
              />
            </div>
            <p className="text-[10px] text-[#a8c0b8]/35 mt-1">Trader share of funded account profits</p>
          </div>

          <div className="space-y-0.5">
            {[
              { label: "API Response", value: "14ms", color: "#00ffcc", status: "OPTIMAL" },
              { label: "Active Nodes", value: "12 / 12", color: "#00ffcc", status: "FULL" },
              { label: "DB Query Avg", value: "28ms", color: "#00ffcc", status: "FAST" },
              { label: "MT5 Connections", value: "3 / 3", color: "#00ffcc", status: "LIVE" },
              { label: "24h Uptime", value: "99.98%", color: "#00ffcc", status: "EXCELLENT" },
              { label: "Error Rate", value: "0.02%", color: "#34d399", status: "CLEAN" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-2.5 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color, boxShadow: `0 0 4px ${stat.color}` }} />
                  <span className="text-[12px] text-[#a8c0b8]">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${stat.color}12`, color: stat.color }}>{stat.status}</span>
                  <span className="text-[12px] font-semibold font-display text-white">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onTabChange("global-command")}
            className="w-full mt-4 py-2.5 rounded-xl border border-[rgba(0,255,204,0.18)] text-[11px] font-semibold text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all uppercase tracking-widest font-display flex items-center justify-center gap-2"
          >
            <Clock size={12} />
            Open Command Center
          </button>
        </div>
      </div>
    </div>
  );
}
