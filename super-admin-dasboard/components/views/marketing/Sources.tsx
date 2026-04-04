"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const sources = [
  { name: "Organic Search", value: 42, visitors: 15834, color: "#00ffcc" },
  { name: "Direct", value: 28, visitors: 10556, color: "#ffbc7c" },
  { name: "Social Media", value: 18, visitors: 6786, color: "#00d4a8" },
  { name: "Referral", value: 8, visitors: 3016, color: "#b9cbc2" },
  { name: "Email", value: 4, visitors: 1508, color: "#a3bffa" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="text-white font-semibold">{payload[0]?.name}</p>
        <p style={{ color: payload[0]?.payload?.color }}>{payload[0]?.value}% • {payload[0]?.payload?.visitors?.toLocaleString()} visitors</p>
      </div>
    );
  }
  return null;
};

export default function SourcesView() {
  return (
    <div className="page-fade space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Traffic Sources</h1>
        <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Where your platform traffic originates from.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                {sources.map((s, i) => <Cell key={i} fill={s.color} stroke="transparent" fillOpacity={0.85} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Source Breakdown</h2>
          <div className="space-y-4">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-display text-white">{s.value}%</span>
                    <span className="text-[10px] text-[#b9cbc2]/50 ml-2">{s.visitors.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#0b2f2d] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-sm font-semibold font-display text-white">Source Performance Details</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.06)]">
              {["SOURCE", "VISITORS", "SHARE", "CONV. RATE", "CONVERSIONS", "TREND"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.name} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-white">{s.visitors.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm text-[#b9cbc2]">{s.value}%</td>
                <td className="px-4 py-3.5 text-sm text-[#00ffcc] font-semibold">{(Math.random() * 8 + 2).toFixed(1)}%</td>
                <td className="px-4 py-3.5 text-sm text-white">{Math.floor(s.visitors * 0.055).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs text-[#00ffcc]">+{(Math.random() * 20 + 5).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
