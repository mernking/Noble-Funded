"use client";

import { useState } from "react";
import {
  DollarSign, RefreshCw, ToggleLeft, ToggleRight, ArrowUpDown,
  TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle,
  Save, History, Zap, Globe,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const rateHistory = [
  { date: "Mar 25", rate: 1510 },
  { date: "Mar 27", rate: 1525 },
  { date: "Mar 29", rate: 1498 },
  { date: "Apr 1", rate: 1540 },
  { date: "Apr 3", rate: 1565 },
  { date: "Apr 5", rate: 1552 },
  { date: "Apr 7", rate: 1580 },
  { date: "Apr 9", rate: 1590 },
  { date: "Apr 11", rate: 1575 },
  { date: "Apr 13", rate: 1610 },
  { date: "Apr 15", rate: 1595 },
  { date: "Today", rate: 1620 },
];

const auditLog = [
  { id: 1, time: "Today 10:42", user: "Alexander Noble", action: "Switched to Fixed Rate", value: "₦1,500/$", reason: "Weekend rate lock" },
  { id: 2, time: "Today 09:15", user: "System", action: "Live rate updated", value: "₦1,620/$", reason: "API sync" },
  { id: 3, time: "Yesterday 18:00", user: "Alexander Noble", action: "Switched to Live API", value: "—", reason: "Market hours resumed" },
  { id: 4, time: "Apr 12, 17:55", user: "Alexander Noble", action: "Switched to Fixed Rate", value: "₦1,550/$", reason: "Weekend lock" },
  { id: 5, time: "Apr 12, 09:05", user: "System", action: "Live rate updated", value: "₦1,575/$", reason: "API sync" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-modal rounded-xl p-3 text-xs border border-[rgba(0,255,204,0.2)]">
        <p className="text-[#a8c0b8] mb-1 font-display font-semibold">{label}</p>
        <p className="text-[#00ffcc] font-bold">₦{payload[0]?.value.toLocaleString()}/$1</p>
      </div>
    );
  }
  return null;
};

export default function FXRateEngine() {
  const [useLiveRate, setUseLiveRate] = useState(false);
  const [fixedRate, setFixedRate] = useState(1500);
  const [draftRate, setDraftRate] = useState("1500");
  const [saved, setSaved] = useState(false);
  const [liveRate] = useState(1620);
  const [showHistory, setShowHistory] = useState(false);
  const [reason, setReason] = useState("");

  const activeRate = useLiveRate ? liveRate : fixedRate;
  const rateChange = liveRate - 1580;
  const rateChangePct = ((rateChange / 1580) * 100).toFixed(2);

  const handleSave = () => {
    const parsed = Number(draftRate);
    if (!isNaN(parsed) && parsed > 0) {
      setFixedRate(parsed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const exampleAmounts = [100, 500, 1000, 5000];

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">FX Rate Engine</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Control USD/NGN conversion rate for challenges and payouts</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,204,0.18)] text-[12px] text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <History size={13} /> {showHistory ? "Hide History" : "Audit Log"}
        </button>
      </div>

      {/* Main rate control */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Control Panel */}
        <div className="glass-card rounded-2xl p-5 space-y-5">
          <h2 className="text-[14px] font-semibold font-display text-white">Rate Mode</h2>

          {/* Toggle */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white flex items-center gap-2">
                  <Globe size={14} className="text-[#00ffcc]" /> Live API Rate
                </p>
                <p className="text-[10px] text-[#a8c0b8]/50 mt-0.5">Auto-updates from market feed</p>
              </div>
              <button onClick={() => setUseLiveRate(!useLiveRate)}>
                {useLiveRate
                  ? <ToggleRight size={28} className="text-[#00ffcc]" />
                  : <ToggleLeft size={28} className="text-[#a8c0b8]/30" />}
              </button>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white flex items-center gap-2">
                  <Zap size={14} className="text-[#ffbc7c]" /> Fixed Manual Rate
                </p>
                <p className="text-[10px] text-[#a8c0b8]/50 mt-0.5">Locks rate on weekends & volatility</p>
              </div>
              <button onClick={() => setUseLiveRate(!useLiveRate)}>
                {!useLiveRate
                  ? <ToggleRight size={28} className="text-[#ffbc7c]" />
                  : <ToggleLeft size={28} className="text-[#a8c0b8]/30" />}
              </button>
            </div>
          </div>

          {/* Active rate display */}
          <div className="p-4 rounded-xl text-center" style={{ background: `${useLiveRate ? "#00ffcc" : "#ffbc7c"}08`, border: `1px solid ${useLiveRate ? "#00ffcc" : "#ffbc7c"}20` }}>
            <p className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-1">Active Rate</p>
            <p className="text-[36px] font-bold font-display" style={{ color: useLiveRate ? "#00ffcc" : "#ffbc7c" }}>
              ₦{activeRate.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#a8c0b8]/50 mt-1">per USD $1</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: useLiveRate ? "#00ffcc15" : "#ffbc7c15", color: useLiveRate ? "#00ffcc" : "#ffbc7c" }}>
                {useLiveRate ? "LIVE API" : "FIXED MANUAL"}
              </span>
            </div>
          </div>

          {/* Fixed rate input */}
          {!useLiveRate && (
            <div className="space-y-2">
              <label className="text-[11px] text-[#a8c0b8]/60 uppercase tracking-wider block">Set Fixed Rate (₦ per $1)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={draftRate}
                  onChange={(e) => setDraftRate(e.target.value)}
                  className="flex-1 bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[15px] font-bold text-[#ffbc7c] outline-none focus:border-[rgba(255,188,124,0.35)] font-display"
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
                  style={saved ? { background: "#34d39920", border: "1px solid #34d39935", color: "#34d399" } : { background: "#ffbc7c20", border: "1px solid #ffbc7c35", color: "#ffbc7c" }}
                >
                  {saved ? <CheckCircle size={14} /> : <Save size={14} />}
                </button>
              </div>
              <div>
                <label className="text-[10px] text-[#a8c0b8]/50 uppercase tracking-wider block mb-1">Reason for change</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Weekend rate lock"
                  className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.08)] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-[#a8c0b8]/40 outline-none"
                />
              </div>
            </div>
          )}

          {/* Conversion preview */}
          <div className="space-y-2">
            <p className="text-[11px] text-[#a8c0b8]/50 uppercase tracking-wider">Conversion Preview</p>
            <div className="grid grid-cols-2 gap-2">
              {exampleAmounts.map((amount) => (
                <div key={amount} className="p-2.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[11px] text-[#a8c0b8]/50">${amount}</p>
                  <p className="text-[13px] font-bold text-white">₦{(amount * activeRate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate Chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-semibold font-display text-white">USD/NGN Market Rate History</h2>
              <p className="text-[10px] text-[#a8c0b8]/40 mt-0.5">Last 30 days — live API data reference</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                {rateChange >= 0 ? <TrendingUp size={14} className="text-[#ff6b6b]" /> : <TrendingDown size={14} className="text-[#34d399]" />}
                <span className="text-[13px] font-bold" style={{ color: rateChange >= 0 ? "#ff6b6b" : "#34d399" }}>{rateChange >= 0 ? "+" : ""}{rateChangePct}%</span>
              </div>
              <p className="text-[10px] text-[#a8c0b8]/50">vs last week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rateHistory} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a8c0b8", fontSize: 9 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `₦${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rate" name="Rate" stroke="#00ffcc" strokeWidth={2} dot={{ fill: "#00ffcc", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Alert banner */}
          {!useLiveRate && Math.abs(fixedRate - liveRate) > 50 && (
            <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-[#ffbc7c]/08 border border-[#ffbc7c]/20">
              <AlertTriangle size={16} className="text-[#ffbc7c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-[#ffbc7c]">Rate Deviation Warning</p>
                <p className="text-[11px] text-[#a8c0b8]/60 mt-0.5">
                  Your fixed rate (₦{fixedRate.toLocaleString()}) differs from the live market rate (₦{liveRate.toLocaleString()}) by ₦{Math.abs(fixedRate - liveRate).toLocaleString()}.
                  Review before switching to live.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit Log */}
      {showHistory && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
            <h2 className="text-[14px] font-semibold font-display text-white">Rate Change Audit Log</h2>
          </div>
          <div className="divide-y divide-[rgba(0,255,204,0.05)]">
            {auditLog.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: entry.user === "System" ? "#60a5fa15" : "#00ffcc15", border: `1px solid ${entry.user === "System" ? "#60a5fa25" : "#00ffcc25"}` }}>
                  {entry.user === "System" ? <RefreshCw size={12} className="text-[#60a5fa]" /> : <DollarSign size={12} className="text-[#00ffcc]" />}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-white font-medium">{entry.action} {entry.value !== "—" ? <span className="text-[#00ffcc] font-mono">{entry.value}</span> : ""}</p>
                  <p className="text-[10px] text-[#a8c0b8]/50">{entry.user} — {entry.reason}</p>
                </div>
                <span className="text-[10px] text-[#a8c0b8]/40 font-mono flex items-center gap-1"><Clock size={9} /> {entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
