"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Search, Trophy, AlertCircle, BarChart2, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const traders = [
  { id: 4821, name: "Alex Thorne", phase: "Funded", balance: "₦480,000", profit: "+₦80,000", pct: "+20.0%", drawdown: "3.2%", trades: 142, winRate: "68%", status: "elite", trend: "up" },
  { id: 4822, name: "Jane Doe", phase: "Phase 2", balance: "₦98,000", profit: "+₦8,000", pct: "+8.9%", drawdown: "5.1%", trades: 44, winRate: "61%", status: "active", trend: "up" },
  { id: 4823, name: "Mark Smith", phase: "Phase 1", balance: "₦44,500", profit: "-₦5,500", pct: "-11.0%", drawdown: "11.0%", trades: 28, winRate: "39%", status: "warning", trend: "down" },
  { id: 4824, name: "Musa Okoro", phase: "Funded", balance: "₦210,000", profit: "+₦10,000", pct: "+5.0%", drawdown: "2.8%", trades: 88, winRate: "59%", status: "active", trend: "up" },
  { id: 4825, name: "Sarah Jones", phase: "Phase 2", balance: "₦95,500", profit: "+₦5,500", pct: "+6.1%", drawdown: "4.4%", trades: 51, winRate: "55%", status: "active", trend: "up" },
  { id: 4826, name: "Chen Wei", phase: "Phase 1", balance: "₦48,200", profit: "+₦1,200", pct: "+2.4%", drawdown: "7.2%", trades: 19, winRate: "52%", status: "active", trend: "up" },
];

const equityCurve = [
  { d: "W1", val: 400000 }, { d: "W2", val: 415000 }, { d: "W3", val: 408000 },
  { d: "W4", val: 432000 }, { d: "W5", val: 449000 }, { d: "W6", val: 458000 },
  { d: "W7", val: 471000 }, { d: "W8", val: 480000 },
];

const statusStyles: Record<string, string> = {
  elite: "chip-active",
  active: "chip-neutral",
  warning: "chip-warning",
};

export default function TraderPerformance() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(traders[0]);

  const filtered = traders.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    String(t.id).includes(search)
  );

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Trader Performance</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Deep-dive analytics on individual trader accounts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trader List */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
              <input
                type="text"
                placeholder="Search trader..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/40"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selected.id === t.id
                    ? "bg-[#00ffcc]/10 border border-[#00ffcc]/25"
                    : "bg-[#0b2f2d]/20 border border-[rgba(0,255,204,0.06)] hover:border-[#00ffcc]/15"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0b2f2d] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#00ffcc]">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{t.name}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50">{t.phase}</p>
                </div>
                <span className={`text-xs font-semibold ${t.trend === "up" ? "text-[#00ffcc]" : "text-[#ff6b6b]"}`}>
                  {t.pct}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Trader Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-white">{selected.name}</h2>
                <p className="text-xs text-[#b9cbc2]/50">ID: #{selected.id} · {selected.phase}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase ${statusStyles[selected.status]}`}>
                {selected.status}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Balance", value: selected.balance, color: "text-white" },
                { label: "Net P&L", value: selected.profit, color: selected.trend === "up" ? "text-[#00ffcc]" : "text-[#ff6b6b]" },
                { label: "Max Drawdown", value: selected.drawdown, color: parseFloat(selected.drawdown) > 8 ? "text-[#ff6b6b]" : "text-[#ffbc7c]" },
                { label: "Win Rate", value: selected.winRate, color: "text-[#00ffcc]" },
              ].map(s => (
                <div key={s.label} className="bg-[#0b2f2d]/40 rounded-lg p-3">
                  <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
                  <p className={`text-lg font-bold font-display ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Equity Curve */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={equityCurve} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" />
                <XAxis dataKey="d" tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#0b2f2d", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 8 }}
                  labelStyle={{ color: "#b9cbc2", fontSize: 11 }}
                  itemStyle={{ color: "#00ffcc", fontSize: 11 }}
                  formatter={(v: any) => [`₦${v.toLocaleString()}`, "Balance"]}
                />
                <Area type="monotone" dataKey="val" stroke="#00ffcc" strokeWidth={2} fill="url(#eqGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">Total Trades</p>
              <p className="text-2xl font-bold font-display text-white">{selected.trades}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">Phase Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-[#0b2f2d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ffcc] rounded-full" style={{ width: selected.phase === "Funded" ? "100%" : selected.phase === "Phase 2" ? "66%" : "33%" }} />
                </div>
                <span className="text-xs text-[#00ffcc] font-semibold">{selected.phase}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
