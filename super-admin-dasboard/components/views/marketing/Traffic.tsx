"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const dailyData = [
  { day: "Mar 25", sessions: 5200, users: 4100, pageviews: 18400 },
  { day: "Mar 26", sessions: 4800, users: 3900, pageviews: 16200 },
  { day: "Mar 27", sessions: 6100, users: 4800, pageviews: 21000 },
  { day: "Mar 28", sessions: 7200, users: 5600, pageviews: 25100 },
  { day: "Mar 29", sessions: 6800, users: 5200, pageviews: 23400 },
  { day: "Mar 30", sessions: 5400, users: 4300, pageviews: 19200 },
  { day: "Mar 31", sessions: 7100, users: 5500, pageviews: 24800 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  visitors: Math.floor(Math.random() * 600 + 100),
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="text-[#b9cbc2] mb-1.5">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrafficView() {
  const [range, setRange] = useState("7D");

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Traffic Analytics</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Sessions, users, and pageviews across all channels.</p>
        </div>
        <div className="flex gap-1.5">
          {["24H", "7D", "30D", "90D"].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${range === r ? "bg-[#00ffcc] text-[#001716]" : "border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] hover:border-[#00ffcc]/30"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: "Total Sessions", value: "42,600", delta: "+14.2%" },
          { label: "Unique Users", value: "33,400", delta: "+11.8%" },
          { label: "Total Pageviews", value: "148,100", delta: "+16.4%" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-display text-white">{s.value}</p>
            <p className="text-xs text-[#00ffcc] mt-1">{s.delta} vs last period</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold font-display text-white mb-1">Daily Traffic Breakdown</h2>
        <p className="text-[10px] text-[#b9cbc2]/50 uppercase tracking-widest mb-4">Sessions vs Users vs Pageviews</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" />
            <XAxis dataKey="day" tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#00ffcc" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
            <Area type="monotone" dataKey="users" name="Users" stroke="#ffbc7c" strokeWidth={1.5} fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold font-display text-white mb-4">Hourly Distribution (Today)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: "#b9cbc2", fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visitors" name="Visitors" fill="#00ffcc" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
