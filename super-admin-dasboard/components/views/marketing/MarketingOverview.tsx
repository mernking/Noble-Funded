"use client";

import { BarChart2, TrendingUp, Users, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", visitors: 4200, conversions: 210 },
  { day: "Tue", visitors: 5100, conversions: 280 },
  { day: "Wed", visitors: 4800, conversions: 245 },
  { day: "Thu", visitors: 6200, conversions: 380 },
  { day: "Fri", visitors: 7100, conversions: 420 },
  { day: "Sat", visitors: 5400, conversions: 290 },
  { day: "Sun", visitors: 4900, conversions: 260 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="text-[#b9cbc2] mb-1">{label}</p>
        <p className="text-[#00ffcc] font-semibold">Visitors: {payload[0]?.value?.toLocaleString()}</p>
        <p className="text-[#ffbc7c] font-semibold">Conversions: {payload[1]?.value}</p>
      </div>
    );
  }
  return null;
};

export default function MarketingOverview({ onTabChange }: { onTabChange: (tab: string) => void }) {
  return (
    <div className="page-fade space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Marketing Overview</h1>
        <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Platform-wide traffic analytics and campaign performance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weekly Visitors", value: "37,700", badge: "+18.2%", icon: BarChart2, color: "#00ffcc" },
          { label: "Conversions", value: "2,085", badge: "+14.8%", icon: Target, color: "#00ffcc" },
          { label: "Conv. Rate", value: "5.53%", badge: "+0.4%", icon: TrendingUp, color: "#00ffcc" },
          { label: "Active Campaigns", value: "6", badge: "LIVE", icon: Users, color: "#ffbc7c" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center">
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
              <span className="text-[10px] font-semibold text-[#00ffcc] uppercase tracking-wider">{kpi.badge}</span>
            </div>
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/60 uppercase mb-1">{kpi.label}</p>
            <p className="text-xl font-bold font-display text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold font-display text-white">Weekly Traffic & Conversions</h2>
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">7-Day Performance</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00ffcc]" />Visitors</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffbc7c]" />Conversions</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffbc7c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ffbc7c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" />
            <XAxis dataKey="day" tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="visitors" stroke="#00ffcc" strokeWidth={2} fill="url(#visGrad)" dot={false} />
            <Area type="monotone" dataKey="conversions" stroke="#ffbc7c" strokeWidth={2} fill="url(#convGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Top Traffic Sources</h2>
          <div className="space-y-3">
            {[
              { label: "Organic Search", pct: 42 },
              { label: "Direct", pct: 28 },
              { label: "Social Media", pct: 18 },
              { label: "Referral", pct: 12 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#b9cbc2]/70">{s.label}</span>
                  <span className="text-xs font-bold text-[#00ffcc]">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#0b2f2d] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00ffcc] to-[#00d4a8] rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Quick Navigation</h2>
          <div className="space-y-2">
            {[
              { label: "Traffic Analytics", tab: "traffic" },
              { label: "Traffic Sources", tab: "sources" },
              { label: "Conversion Funnel", tab: "conversions" },
              { label: "Campaigns", tab: "campaigns" },
              { label: "Reports", tab: "reports" },
            ].map((a) => (
              <button key={a.tab} onClick={() => onTabChange(a.tab)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0b2f2d]/40 hover:bg-[#00ffcc]/08 border border-[rgba(0,255,204,0.08)] hover:border-[#00ffcc]/20 text-sm text-[#b9cbc2] hover:text-white transition-all text-left">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
