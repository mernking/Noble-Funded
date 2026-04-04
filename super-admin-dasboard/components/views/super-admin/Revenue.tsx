"use client";

import { useState } from "react";
import { Download, TrendingUp, ArrowUpRight, DollarSign, CreditCard, Users } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, BarChart, Bar,
} from "recharts";

const monthlyRevenue = [
  { date: "Sep", fees: 420000, payouts: 180000, net: 240000 },
  { date: "Oct", fees: 680000, payouts: 290000, net: 390000 },
  { date: "Nov", fees: 1200000, payouts: 510000, net: 690000 },
  { date: "Dec", fees: 980000, payouts: 420000, net: 560000 },
  { date: "Jan", fees: 1450000, payouts: 620000, net: 830000 },
  { date: "Feb", fees: 1820000, payouts: 790000, net: 1030000 },
  { date: "Mar", fees: 2340000, payouts: 1020000, net: 1320000 },
  { date: "Apr", fees: 4822190, payouts: 2100000, net: 2722190 },
];

const monthlyRevenueUSD = [
  { date: "Sep", fees: 1800, payouts: 720, net: 1080 },
  { date: "Oct", fees: 2900, payouts: 1160, net: 1740 },
  { date: "Nov", fees: 5200, payouts: 2080, net: 3120 },
  { date: "Dec", fees: 4100, payouts: 1640, net: 2460 },
  { date: "Jan", fees: 6300, payouts: 2520, net: 3780 },
  { date: "Feb", fees: 7800, payouts: 3120, net: 4680 },
  { date: "Mar", fees: 10200, payouts: 4080, net: 6120 },
  { date: "Apr", fees: 18420, payouts: 7368, net: 11052 },
];

const dailyRevenue = [
  { date: "Apr 1", rev: 210000 }, { date: "Apr 4", rev: 240000 }, { date: "Apr 7", rev: 285000 },
  { date: "Apr 10", rev: 320000 }, { date: "Apr 13", rev: 295000 }, { date: "Apr 16", rev: 410000 },
  { date: "Apr 19", rev: 480000 }, { date: "Apr 22", rev: 520000 }, { date: "Apr 25", rev: 610000 },
  { date: "Apr 28", rev: 720000 }, { date: "Today", rev: 847000 },
];

const dailyRevenueUSD = [
  { date: "Apr 1", rev: 820 }, { date: "Apr 4", rev: 940 }, { date: "Apr 7", rev: 1120 },
  { date: "Apr 10", rev: 1380 }, { date: "Apr 13", rev: 1210 }, { date: "Apr 16", rev: 1640 },
  { date: "Apr 19", rev: 1980 }, { date: "Apr 22", rev: 2100 }, { date: "Apr 25", rev: 2480 },
  { date: "Apr 28", rev: 2890 }, { date: "Today", rev: 3420 },
];

const RevTooltip = ({ active, payload, label, sym }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-modal rounded-xl p-3 text-xs border border-[rgba(0,255,204,0.2)]">
        <p className="text-[#a8c0b8] mb-2 font-display font-semibold">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.stroke }} className="font-semibold mb-0.5">
            {p.name}: {sym}{(p.value || 0).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueView() {
  const [period, setPeriod] = useState<"daily" | "monthly">("daily");
  const [system, setSystem] = useState<"NGN" | "USD">("NGN");

  const isNGN = system === "NGN";
  const sym = isNGN ? "₦" : "$";

  const chartData = period === "daily"
    ? (isNGN ? dailyRevenue : dailyRevenueUSD)
    : (isNGN ? monthlyRevenue : monthlyRevenueUSD);

  const kpiData = isNGN
    ? { total: "₦4.82M", payouts: "₦2.10M", net: "₦2.72M", arpu: "₦4,723" }
    : { total: "$18,420", payouts: "$7,368", net: "$11,052", arpu: "$47.3" };

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold font-display text-white">Revenue & Analytics</h1>
          <p className="text-[13px] text-[#a8c0b8]/60 mt-0.5">Real-time financial performance and equity distribution.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* System switcher */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl border border-[rgba(0,255,204,0.1)] p-1">
            {(["NGN", "USD"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setSystem(val)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={system === val ? { background: "#00ffcc", color: "#010e0d" } : { color: "#a8c0b8" }}
              >
                {val === "NGN" ? "₦ Naira" : "$ Dollar"}
              </button>
            ))}
          </div>
          {/* Period switcher */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl border border-[rgba(0,255,204,0.1)] p-1">
            {(["daily", "monthly"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setPeriod(val)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize"
                style={period === val ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc", border: "1px solid rgba(0,255,204,0.25)" } : { color: "#a8c0b8" }}
              >
                {val}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "TOTAL REVENUE (MTD)", value: kpiData.total, sub: "+12.4% vs last month", icon: TrendingUp, color: "#00ffcc" },
          { label: "TOTAL PAYOUTS (MTD)", value: kpiData.payouts, sub: "43.5% of total fees", icon: CreditCard, color: "#ff6b6b" },
          { label: "NET REVENUE (MTD)", value: kpiData.net, sub: "56.5% margin", icon: DollarSign, color: "#34d399" },
          { label: "ARPU", value: kpiData.arpu, sub: "Per active user", icon: Users, color: "#a78bfa" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card-elevated rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}22` }}>
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: kpi.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{kpi.label}</p>
            <p className="text-[18px] font-bold font-display text-white">{kpi.value}</p>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
              <h2 className="text-[14px] font-semibold font-display text-white">Revenue Stream</h2>
            </div>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Challenge fees collected vs payouts disbursed</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00ffcc]" /><span className="text-[#a8c0b8]/60">Fees</span></span>
            {period === "monthly" && <>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff6b6b]" /><span className="text-[#a8c0b8]/60">Payouts</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34d399]" /><span className="text-[#a8c0b8]/60">Net</span></span>
            </>}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="payoutG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "#a8c0b8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#a8c0b8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => isNGN ? `₦${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(1)}k`} />
            <Tooltip content={<RevTooltip sym={sym} />} />
            <Area type="monotone" dataKey={period === "daily" ? "rev" : "fees"} name="Fees" stroke="#00ffcc" strokeWidth={2.5} fill="url(#revenueG)" dot={false} activeDot={{ r: 4, fill: "#00ffcc" }} />
            {period === "monthly" && <>
              <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#ff6b6b" strokeWidth={2} fill="url(#payoutG)" dot={false} />
              <Area type="monotone" dataKey="net" name="Net" stroke="#34d399" strokeWidth={1.5} fill="url(#netG)" dot={false} strokeDasharray="5 3" />
            </>}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Equity Breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-[14px] font-semibold font-display text-white mb-4">Equity Breakdown</h3>
          <div className="space-y-4">
            {isNGN ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-white font-medium">Naira Accounts</span>
                  <span className="text-[13px] font-bold font-display text-[#00ffcc]">₦1.2B</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #00ffcc, #00d4a8)", boxShadow: "0 0 6px rgba(0,255,204,0.3)" }} />
                </div>
                <p className="text-[10px] text-[#a8c0b8]/40 mt-1">3,402 active — ₦200K to ₦3M tiers</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-white font-medium">Dollar Accounts</span>
                  <span className="text-[13px] font-bold font-display text-[#ffbc7c]">$3.4M</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "45%", background: "linear-gradient(90deg, #ffbc7c, #f59e0b)", boxShadow: "0 0 6px rgba(255,188,124,0.3)" }} />
                </div>
                <p className="text-[10px] text-[#a8c0b8]/40 mt-1">1,894 active — $5K to $200K tiers</p>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-[rgba(0,255,204,0.07)] pt-4">
            {(isNGN ? [
              { label: "Avg Entry Fee (Naira)", value: "₦38,200" },
              { label: "Largest Plan", value: "₦3M — ₦190K fee" },
              { label: "Refund Rate", value: "0.8%" },
            ] : [
              { label: "Avg Entry Fee (Dollar)", value: "$285" },
              { label: "Largest Plan", value: "$200K — $749.99 fee" },
              { label: "Refund Rate", value: "1.1%" },
            ]).map((s) => (
              <div key={s.label} className="flex justify-between text-[12px]">
                <span className="text-[#a8c0b8]/60">{s.label}</span>
                <span className="text-white font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* P&L Donut */}
        <div className="glass-card rounded-2xl p-5 flex flex-col items-center">
          <h3 className="text-[14px] font-semibold font-display text-white mb-4 self-start">Profit Split</h3>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#00ffcc" strokeWidth="14"
                strokeDasharray={`${80 * 2.51} ${20 * 2.51}`}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(0,255,204,0.5))" }}
              />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#ffbc7c" strokeWidth="14"
                strokeDasharray={`${20 * 2.51} ${80 * 2.51}`}
                strokeDashoffset={`${-80 * 2.51}`}
                strokeLinecap="round"
                opacity={0.6}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-bold font-display text-[#00ffcc] neon-text">80%</span>
              <span className="text-[9px] text-[#a8c0b8]/50 uppercase tracking-wider">Trader</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            {[
              { label: "Trader Share (80%)", value: isNGN ? "+₦3.86M" : "+$14,736", color: "#00ffcc" },
              { label: "Company (20%)", value: isNGN ? "+₦964K" : "+$3,684", color: "#ffbc7c" },
              { label: "Payout Costs", value: isNGN ? "-₦2.10M" : "-$7,368", color: "#ff6b6b" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <span className="text-[#a8c0b8]/70">{m.label}</span>
                </div>
                <span className="font-semibold font-display" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-[14px] font-semibold font-display text-white mb-1">Growth Metrics</h3>

          <div className="p-4 rounded-xl" style={{ background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.15)" }}>
            <p className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase font-display">Monthly Recurring Revenue</p>
            <p className="text-[26px] font-bold font-display text-white neon-text-sm mt-1">{kpiData.total}</p>
            <p className="text-[11px] text-[#00ffcc] flex items-center gap-1 mt-1">
              <TrendingUp size={11} /> +106% month-over-month growth
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Pass Rate", value: "12.4%", color: "#00ffcc" },
              { label: "Avg Payout", value: isNGN ? "₦3.1K" : "$62", color: "#ffbc7c" },
              { label: "Churn Rate", value: "4.2%", color: "#ff6b6b" },
              { label: "Retention", value: "88.4%", color: "#34d399" },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[9px] text-[#a8c0b8]/40 uppercase tracking-wider font-display">{m.label}</p>
                <p className="text-[16px] font-bold font-display mt-1" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl" style={{ background: "rgba(255,188,124,0.06)", border: "1px solid rgba(255,188,124,0.15)" }}>
            <p className="text-[10px] text-[#a8c0b8]/50 uppercase tracking-wider font-display">Break-Even Accounts</p>
            <p className="text-[18px] font-bold font-display text-[#ffbc7c] mt-0.5">2,847</p>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Required to cover operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
