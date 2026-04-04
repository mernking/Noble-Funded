"use client";

import { useState } from "react";
import {
  ShieldAlert, TrendingDown, ToggleLeft, ToggleRight, AlertTriangle,
  RefreshCw, Eye, Server, Sliders, Activity, ArrowUpRight, ArrowDownRight,
  Zap, Lock, Unlock, ChevronDown, CheckCircle, XCircle, Settings,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const drawdownData = [
  { t: "00:00", exposure: 320000, breaches: 1 },
  { t: "02:00", exposure: 285000, breaches: 0 },
  { t: "04:00", exposure: 210000, breaches: 0 },
  { t: "06:00", exposure: 390000, breaches: 2 },
  { t: "08:00", exposure: 540000, breaches: 3 },
  { t: "10:00", exposure: 720000, breaches: 1 },
  { t: "12:00", exposure: 890000, breaches: 4 },
  { t: "14:00", exposure: 1020000, breaches: 2 },
  { t: "16:00", exposure: 840000, breaches: 1 },
  { t: "18:00", exposure: 650000, breaches: 0 },
  { t: "20:00", exposure: 480000, breaches: 1 },
  { t: "22:00", exposure: 390000, breaches: 0 },
];

const riskyAccounts = [
  { id: "MT5-78821", trader: "Alex Thorne", drawdown: 91.4, book: "B", balance: 97200, dailyLoss: 4.8, status: "critical" },
  { id: "MT5-44312", trader: "Musa Okoro", drawdown: 84.2, book: "B", balance: 49800, dailyLoss: 3.9, status: "warning" },
  { id: "MT5-90012", trader: "Jane Adeyemi", drawdown: 78.8, book: "A", balance: 98100, dailyLoss: 2.1, status: "warning" },
  { id: "MT5-33401", trader: "Emeka Nwachukwu", drawdown: 71.0, book: "B", balance: 19200, dailyLoss: 1.4, status: "watch" },
  { id: "MT5-55601", trader: "Chidi Okonkwo", drawdown: 65.5, book: "B", balance: 48500, dailyLoss: 0.8, status: "watch" },
  { id: "MT5-22190", trader: "Tosin Abiodun", drawdown: 52.3, book: "A", balance: 95000, dailyLoss: 0.3, status: "normal" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-modal rounded-xl p-3 text-xs border border-[rgba(0,255,204,0.2)]">
        <p className="text-[#a8c0b8] mb-1 font-display font-semibold">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.name === "Exposure" ? `₦${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RiskEngine() {
  const [accounts, setAccounts] = useState(riskyAccounts);
  const [drawdownEngine, setDrawdownEngine] = useState(true);
  const [newsProtection, setNewsProtection] = useState(true);
  const [autoLiquidation, setAutoLiquidation] = useState(true);
  const [slippage, setSlippage] = useState(2);
  const [spread, setSpread] = useState(1.5);
  const [dailyLossLimit, setDailyLossLimit] = useState(5);
  const [maxDrawdownLimit, setMaxDrawdownLimit] = useState(10);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null);

  const toggleBook = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => a.id === id ? { ...a, book: a.book === "A" ? "B" : "A" } : a)
    );
    setConfirmAction(null);
  };

  const liquidateAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => a.id === id ? { ...a, drawdown: 100, status: "liquidated" as any } : a)
    );
    setConfirmAction(null);
  };

  const stats = [
    { label: "TOTAL EXPOSURE", value: "₦3.84M", sub: "Live B-Book notional", icon: TrendingDown, color: "#ff6b6b", trend: "up" },
    { label: "BREACHES TODAY", value: "14", sub: "Daily loss triggers", icon: AlertTriangle, color: "#ffbc7c", trend: "warn" },
    { label: "A-BOOK ACCOUNTS", value: "12", sub: "Live market execution", icon: Unlock, color: "#00ffcc", trend: "up" },
    { label: "RISK ENGINE", value: drawdownEngine ? "ACTIVE" : "PAUSED", sub: "Auto-liquidation service", icon: ShieldAlert, color: drawdownEngine ? "#34d399" : "#ff6b6b", trend: drawdownEngine ? "up" : "down" },
  ];

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#ff6b6b] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Risk Management Engine</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">A-Book / B-Book control, drawdown monitoring & slippage configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,204,0.18)] text-[12px] text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold">
            <Settings size={13} /> Engine Config
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass-card-elevated rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: s.color }}>
                {s.trend === "up" ? <ArrowUpRight size={12} style={{ color: s.color }} className="inline" /> : <ArrowDownRight size={12} className="inline" />}
              </span>
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[18px] font-bold font-display text-white leading-tight">{s.value}</p>
            <p className="text-[10px] text-[#a8c0b8]/40 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls + Exposure Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Engine Controls */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h2 className="text-[14px] font-semibold font-display text-white">Engine Controls</h2>

          {[
            { label: "Drawdown Engine", sub: "Auto-liquidate breached accounts", state: drawdownEngine, set: setDrawdownEngine, color: "#00ffcc" },
            { label: "News Trading Protection", sub: "Block trades 5min around events", state: newsProtection, set: setNewsProtection, color: "#ffbc7c" },
            { label: "Auto-Liquidation", sub: "Instant close on daily loss breach", state: autoLiquidation, set: setAutoLiquidation, color: "#ff6b6b" },
          ].map((ctrl, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-[12px] font-semibold text-white">{ctrl.label}</p>
                <p className="text-[10px] text-[#a8c0b8]/50 mt-0.5">{ctrl.sub}</p>
              </div>
              <button onClick={() => ctrl.set(!ctrl.state)} className="flex-shrink-0">
                {ctrl.state
                  ? <ToggleRight size={28} style={{ color: ctrl.color }} />
                  : <ToggleLeft size={28} className="text-[#a8c0b8]/30" />}
              </button>
            </div>
          ))}

          <div className="border-t border-white/[0.06] pt-4 space-y-3">
            <h3 className="text-[11px] tracking-widest text-[#a8c0b8]/50 uppercase font-display">Slippage & Spread</h3>
            {[
              { label: "Max Slippage (pips)", value: slippage, set: setSlippage, min: 0, max: 10, step: 0.5, color: "#ffbc7c" },
              { label: "Min Spread (pips)", value: spread, set: setSpread, min: 0.5, max: 5, step: 0.5, color: "#60a5fa" },
            ].map((ctrl, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[#a8c0b8]/70">{ctrl.label}</span>
                  <span className="font-bold" style={{ color: ctrl.color }}>{ctrl.value} pips</span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={ctrl.value}
                  onChange={(e) => ctrl.set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: ctrl.color }}
                />
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-4 space-y-3">
            <h3 className="text-[11px] tracking-widest text-[#a8c0b8]/50 uppercase font-display">Loss Limits</h3>
            {[
              { label: "Daily Loss Limit (%)", value: dailyLossLimit, set: setDailyLossLimit, min: 1, max: 10, color: "#ff6b6b" },
              { label: "Max Drawdown (%)", value: maxDrawdownLimit, set: setMaxDrawdownLimit, min: 5, max: 20, color: "#a78bfa" },
            ].map((ctrl, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[#a8c0b8]/70">{ctrl.label}</span>
                  <span className="font-bold" style={{ color: ctrl.color }}>{ctrl.value}%</span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={1}
                  value={ctrl.value}
                  onChange={(e) => ctrl.set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: ctrl.color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Exposure Chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-semibold font-display text-white">Live B-Book Exposure</h2>
              <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Total notional value in simulated execution — last 24h</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff6b6b]" /> Exposure</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffbc7c]" /> Breaches</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={drawdownData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" />
              <XAxis dataKey="t" tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="exposure" name="Exposure" stroke="#ff6b6b" strokeWidth={2} fill="url(#expGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Risk Level Distribution */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "CRITICAL (>90%)", count: 1, color: "#ff4444" },
              { label: "WARNING (70-90%)", count: 2, color: "#ffbc7c" },
              { label: "WATCH (50-70%)", count: 2, color: "#60a5fa" },
            ].map((level, i) => (
              <div key={i} className="text-center p-2.5 rounded-xl" style={{ background: `${level.color}10`, border: `1px solid ${level.color}25` }}>
                <p className="text-[9px] tracking-wider text-[#a8c0b8]/60 uppercase font-display">{level.label}</p>
                <p className="text-[22px] font-bold font-display mt-1" style={{ color: level.color }}>{level.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A-Book / B-Book Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <div>
            <h2 className="text-[14px] font-semibold font-display text-white">A-Book / B-Book Account Control</h2>
            <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Toggle accounts between simulated (B) and live market (A) execution</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] font-semibold">A-BOOK: Live</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] font-semibold">B-BOOK: Simulated</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,255,204,0.05)]">
                {["Account", "Trader", "Balance", "Drawdown", "Daily P&L", "Book Type", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase font-display">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => {
                const statusColor = acc.status === "critical" ? "#ff4444" : acc.status === "warning" ? "#ffbc7c" : acc.status === "watch" ? "#60a5fa" : acc.status === "liquidated" ? "#a8c0b8" : "#34d399";
                const drawdownColor = acc.drawdown >= 90 ? "#ff4444" : acc.drawdown >= 70 ? "#ffbc7c" : "#34d399";
                return (
                  <tr key={acc.id} className="border-b border-[rgba(0,255,204,0.04)] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[12px] font-mono text-[#00ffcc]">{acc.id}</td>
                    <td className="px-4 py-3 text-[12px] text-white font-medium">{acc.trader}</td>
                    <td className="px-4 py-3 text-[12px] text-[#a8c0b8]">₦{acc.balance.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10">
                          <div className="h-full rounded-full transition-all" style={{ width: `${acc.drawdown}%`, background: drawdownColor }} />
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: drawdownColor }}>{acc.drawdown}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: acc.dailyLoss > 3 ? "#ff6b6b" : "#a8c0b8" }}>-{acc.dailyLoss}%</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setConfirmAction({ id: acc.id, action: "toggle" })}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                        style={acc.book === "A"
                          ? { background: "#00ffcc20", border: "1px solid #00ffcc35", color: "#00ffcc" }
                          : { background: "#a78bfa20", border: "1px solid #a78bfa35", color: "#a78bfa" }}
                      >
                        {acc.book === "A" ? <Unlock size={10} /> : <Lock size={10} />}
                        {acc.book}-Book
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: `${statusColor}15`, color: statusColor }}>{acc.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-[11px] text-[#60a5fa] hover:underline flex items-center gap-1"><Eye size={11} /> View</button>
                        {acc.status !== "liquidated" && acc.status !== "normal" && (
                          <button
                            onClick={() => setConfirmAction({ id: acc.id, action: "liquidate" })}
                            className="text-[11px] text-[#ff6b6b] hover:underline flex items-center gap-1">
                            <Zap size={11} /> Liquidate
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

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-sm relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: confirmAction.action === "liquidate" ? "#ff444415" : "#00ffcc15", border: `1px solid ${confirmAction.action === "liquidate" ? "#ff444430" : "#00ffcc30"}` }}>
              {confirmAction.action === "liquidate" ? <Zap size={18} className="text-[#ff6b6b]" /> : <Sliders size={18} className="text-[#00ffcc]" />}
            </div>
            <h3 className="text-[15px] font-bold font-display text-white mb-1">
              {confirmAction.action === "liquidate" ? "Liquidate Account?" : "Toggle Book Type?"}
            </h3>
            <p className="text-[12px] text-[#a8c0b8]/60 mb-5">
              {confirmAction.action === "liquidate"
                ? `This will force-close all open positions for ${confirmAction.id} immediately.`
                : `This will move ${confirmAction.id} between A-Book and B-Book execution.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button
                onClick={() => confirmAction.action === "liquidate" ? liquidateAccount(confirmAction.id) : toggleBook(confirmAction.id)}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all"
                style={{ background: confirmAction.action === "liquidate" ? "#ff444480" : "#00ffcc20", border: `1px solid ${confirmAction.action === "liquidate" ? "#ff444430" : "#00ffcc35"}`, color: confirmAction.action === "liquidate" ? "white" : "#00ffcc" }}
              >
                {confirmAction.action === "liquidate" ? "Liquidate Now" : "Confirm Toggle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
