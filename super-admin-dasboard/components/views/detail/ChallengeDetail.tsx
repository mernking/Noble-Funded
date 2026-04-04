"use client";

import { useState } from "react";
import {
  ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Trophy, Shield,
  Activity, Clock, CheckCircle, XCircle, AlertTriangle, BarChart2,
  Edit, Ban, Download, Eye, Target, Zap, User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChallengeDetailProps {
  challengeId: string;
  onBack: () => void;
  onViewTrader?: (traderId: string) => void;
}

// ── Mock data ──────────────────────────────────────────────────────────────
const CHALLENGE_DATA: Record<string, {
  id: string; mt5: string; traderId: string; trader: string; email: string;
  type: string; phase: string; currency: string; startBal: string; currentBal: string;
  targetBal: string; pl: string; plRaw: number; status: string; daysRemaining: number;
  maxDailyLoss: string; maxDailyLossUsed: string; maxDailyLossPct: number;
  maxTotalDrawdown: string; maxTotalDrawdownUsed: string; maxTotalDrawdownPct: number;
  profitTarget: string; profitTargetReached: number; minTradingDays: number; tradingDaysCompleted: number;
  startDate: string; endDate?: string; broker: string; leverage: string;
  trades: { id: string; symbol: string; direction: string; lots: number; openPrice: string; closePrice?: string; pl: string; plRaw: number; status: string; openTime: string; closeTime?: string; duration?: string }[];
  ruleBreaches: { rule: string; severity: string; timestamp: string; auto: boolean }[];
  dailyPL: { day: string; pl: number }[];
}> = {
  "#CH-99281": {
    id: "#CH-99281", mt5: "882010", traderId: "#NF-89210", trader: "Felix Henderson",
    email: "felix.h@tradenet.io", type: "DOLLAR/FUNDED", phase: "Funded",
    currency: "USD", startBal: "$100,000", currentBal: "$104,200", targetBal: "$108,000",
    pl: "+4.2%", plRaw: 4.2, status: "ACTIVE", daysRemaining: 0,
    maxDailyLoss: "$2,000", maxDailyLossUsed: "$820", maxDailyLossPct: 41,
    maxTotalDrawdown: "$10,000", maxTotalDrawdownUsed: "$4,100", maxTotalDrawdownPct: 41,
    profitTarget: "$108,000", profitTargetReached: 52,
    minTradingDays: 0, tradingDaysCompleted: 22,
    startDate: "2025-11-01", broker: "NF-LIVE-01", leverage: "1:100",
    trades: [
      { id: "T-00191", symbol: "EURUSD", direction: "BUY", lots: 0.5, openPrice: "1.08450", closePrice: "1.09120", pl: "+$335", plRaw: 335, status: "CLOSED", openTime: "2026-04-01 09:30", closeTime: "2026-04-01 14:05", duration: "4h 35m" },
      { id: "T-00190", symbol: "GBPJPY", direction: "SELL", lots: 0.3, openPrice: "191.220", closePrice: "190.880", pl: "+$174", plRaw: 174, status: "CLOSED", openTime: "2026-03-31 11:00", closeTime: "2026-03-31 16:30", duration: "5h 30m" },
      { id: "T-00189", symbol: "XAUUSD", direction: "BUY", lots: 0.2, openPrice: "2315.50", closePrice: "2302.00", pl: "-$270", plRaw: -270, status: "CLOSED", openTime: "2026-03-28 08:15", closeTime: "2026-03-28 12:45", duration: "4h 30m" },
      { id: "T-00188", symbol: "USDJPY", direction: "SELL", lots: 0.8, openPrice: "151.830", closePrice: undefined, pl: "+$120", plRaw: 120, status: "OPEN", openTime: "2026-04-01 10:00" },
    ],
    ruleBreaches: [
      { rule: "Trailing drawdown proximity warning — within 3% of limit", severity: "WARNING", timestamp: "2026-03-28 12:45", auto: true },
    ],
    dailyPL: [
      { day: "Mar 24", pl: 420 }, { day: "Mar 25", pl: -180 }, { day: "Mar 26", pl: 650 },
      { day: "Mar 27", pl: 210 }, { day: "Mar 28", pl: -270 }, { day: "Mar 29", pl: 480 },
      { day: "Mar 30", pl: 310 }, { day: "Mar 31", pl: 174 }, { day: "Apr 1", pl: 335 },
    ],
  },
};

const DEFAULT_CHALLENGE = CHALLENGE_DATA["#CH-99281"];

const statusStyles: Record<string, string> = {
  ACTIVE: "chip-active",
  PASSED: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30",
  FAILED: "chip-danger",
  DISABLED: "chip-neutral",
};

const tradeStatusStyles: Record<string, string> = {
  OPEN: "chip-active",
  CLOSED: "chip-neutral",
};

type Tab = "overview" | "trades" | "rules";

export default function ChallengeDetail({ challengeId, onBack, onViewTrader }: ChallengeDetailProps) {
  const ch = CHALLENGE_DATA[challengeId] || DEFAULT_CHALLENGE;
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const maxDailyBar = Math.min(ch.maxDailyLossPct, 100);
  const drawdownBar = Math.min(ch.maxTotalDrawdownPct, 100);
  const profitBar = Math.min(ch.profitTargetReached, 100);

  const dailyMax = Math.max(...ch.dailyPL.map(d => Math.abs(d.pl)));

  return (
    <div className="page-fade space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Challenges
        </button>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-[#b9cbc2]/60 font-mono">{ch.id}</span>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-white">{ch.trader}</span>
      </div>

      {/* Hero */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)" }}>
              <Trophy size={20} className="text-[#00ffcc]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl font-bold font-display text-white">{ch.id}</h1>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", statusStyles[ch.status])}>{ch.status}</span>
                <span className="text-[11px] bg-[#0b2f2d] text-[#b9cbc2] border border-[rgba(0,255,204,0.1)] px-2 py-0.5 rounded">{ch.type}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#b9cbc2]/60 flex-wrap">
                <span>MT5: <span className="text-white font-mono">{ch.mt5}</span></span>
                <span>Broker: <span className="text-white font-mono">{ch.broker}</span></span>
                <span>Leverage: <span className="text-white">{ch.leverage}</span></span>
                <span>Started: <span className="text-white">{ch.startDate}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onViewTrader && (
              <button
                onClick={() => onViewTrader(ch.traderId)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-xs font-semibold hover:bg-[#00ffcc]/20 transition-all"
              >
                <User size={12} /> View Trader
              </button>
            )}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold hover:bg-[#f59e0b]/20 transition-all">
              <Edit size={12} /> Edit
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 text-[#ff6b6b] text-xs font-semibold hover:bg-[#ff4444]/20 transition-all">
              <Ban size={12} /> Disable
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-xs hover:text-white transition-all">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* Balance KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[rgba(0,255,204,0.08)]">
          {[
            { label: "Starting Balance", value: ch.startBal, color: "#b9cbc2" },
            { label: "Current Balance", value: ch.currentBal, color: "#ffffff" },
            { label: "P/L", value: ch.pl, color: ch.plRaw >= 0 ? "#00ffcc" : "#ff6b6b" },
            { label: "Trading Days", value: `${ch.tradingDaysCompleted}${ch.minTradingDays > 0 ? ` / ${ch.minTradingDays}` : ""}`, color: "#ffffff" },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-[10px] text-[#b9cbc2]/40 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-lg font-bold font-display" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(0,255,204,0.08)]">
        {(["overview", "trades", "rules"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px",
              activeTab === tab ? "text-[#00ffcc] border-[#00ffcc]" : "text-[#b9cbc2]/50 border-transparent hover:text-[#b9cbc2]"
            )}
          >
            {tab === "rules" ? "Rules & Breaches" : tab}
            {tab === "rules" && ch.ruleBreaches.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 px-1.5 py-0.5 rounded-full">{ch.ruleBreaches.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Risk Meters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Daily Loss */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#b9cbc2]/60 uppercase tracking-wider">Daily Loss Limit</p>
                <AlertTriangle size={14} className={maxDailyBar > 70 ? "text-[#ff6b6b]" : "text-[#f59e0b]/60"} />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold font-display text-white">{ch.maxDailyLossUsed}</span>
                <span className="text-xs text-[#b9cbc2]/40">of {ch.maxDailyLoss}</span>
              </div>
              <div className="h-2 rounded-full bg-[#0b2f2d] mb-1">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${maxDailyBar}%`,
                    background: maxDailyBar > 80 ? "#ff4444" : maxDailyBar > 60 ? "#f59e0b" : "#00ffcc"
                  }}
                />
              </div>
              <p className="text-[11px] text-[#b9cbc2]/40">{maxDailyBar}% used today</p>
            </div>

            {/* Drawdown */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#b9cbc2]/60 uppercase tracking-wider">Max Drawdown</p>
                <Target size={14} className="text-[#b9cbc2]/40" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold font-display text-white">{ch.maxTotalDrawdownUsed}</span>
                <span className="text-xs text-[#b9cbc2]/40">of {ch.maxTotalDrawdown}</span>
              </div>
              <div className="h-2 rounded-full bg-[#0b2f2d] mb-1">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${drawdownBar}%`,
                    background: drawdownBar > 80 ? "#ff4444" : drawdownBar > 60 ? "#f59e0b" : "#00ffcc"
                  }}
                />
              </div>
              <p className="text-[11px] text-[#b9cbc2]/40">{drawdownBar}% used total</p>
            </div>

            {/* Profit Target */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#b9cbc2]/60 uppercase tracking-wider">Profit Target</p>
                <Zap size={14} className="text-[#00ffcc]/60" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold font-display text-[#00ffcc]">{ch.currentBal}</span>
                <span className="text-xs text-[#b9cbc2]/40">of {ch.profitTarget}</span>
              </div>
              <div className="h-2 rounded-full bg-[#0b2f2d] mb-1">
                <div className="h-2 rounded-full bg-[#00ffcc] transition-all" style={{ width: `${profitBar}%` }} />
              </div>
              <p className="text-[11px] text-[#b9cbc2]/40">{profitBar}% to target</p>
            </div>
          </div>

          {/* Daily P/L Bar Chart */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-[#00ffcc]" /> Daily P/L (Last 9 Days)
            </h3>
            <div className="flex items-end gap-1.5 h-28">
              {ch.dailyPL.map((d) => {
                const height = Math.round((Math.abs(d.pl) / dailyMax) * 100);
                const isPositive = d.pl >= 0;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className={cn("text-[9px] font-medium", isPositive ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                      {isPositive ? "+" : ""}{d.pl > 0 ? `$${d.pl}` : `-$${Math.abs(d.pl)}`}
                    </span>
                    <div className="w-full rounded-t" style={{ height: `${height}%`, minHeight: 4, background: isPositive ? "#00ffcc" : "#ff4444", opacity: 0.8 }} />
                    <span className="text-[9px] text-[#b9cbc2]/40 whitespace-nowrap">{d.day.replace("Mar ", "M").replace("Apr ", "A")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trading Rules Checklist */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-4 flex items-center gap-2">
              <Shield size={14} className="text-[#00ffcc]" /> Trading Rules Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { rule: "Max Daily Loss Limit", met: ch.maxDailyLossPct < 100, detail: `${ch.maxDailyLossUsed} / ${ch.maxDailyLoss} used` },
                { rule: "Max Drawdown Limit", met: ch.maxTotalDrawdownPct < 100, detail: `${ch.maxTotalDrawdownUsed} / ${ch.maxTotalDrawdown} used` },
                { rule: "No Trading on News Ban", met: true, detail: "No violations found" },
                { rule: "Minimum Trading Days", met: ch.phase !== "Phase 1" || ch.tradingDaysCompleted >= ch.minTradingDays, detail: `${ch.tradingDaysCompleted} days active` },
                { rule: "No Simultaneous Hedge", met: true, detail: "Verified clean" },
                { rule: "Position Size Within Limit", met: true, detail: "Max lot: 0.8" },
              ].map((r) => (
                <div key={r.rule} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.06)]">
                  {r.met
                    ? <CheckCircle size={14} className="text-[#00ffcc] flex-shrink-0" />
                    : <XCircle size={14} className="text-[#ff4444] flex-shrink-0" />
                  }
                  <div>
                    <p className="text-xs font-medium text-white">{r.rule}</p>
                    <p className="text-[10px] text-[#b9cbc2]/40">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Trades ── */}
      {activeTab === "trades" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Activity size={14} className="text-[#00ffcc]" /> Trade History
            </h3>
            <span className="text-xs text-[#b9cbc2]/50">{ch.trades.length} trades</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["Ticket", "Symbol", "Direction", "Lots", "Open Price", "Close Price", "P/L", "Status", "Duration"].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ch.trades.map((t) => (
                  <tr key={t.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                    <td className="px-4 py-3.5 text-xs font-mono text-[#00ffcc]">{t.id}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-white">{t.symbol}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-fit",
                        t.direction === "BUY" ? "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20" : "bg-[#ff4444]/10 text-[#ff6b6b] border border-[#ff4444]/20")}>
                        {t.direction === "BUY" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {t.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{t.lots}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#b9cbc2]">{t.openPrice}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#b9cbc2]">{t.closePrice || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-sm font-bold font-display", t.plRaw >= 0 ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>{t.pl}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", tradeStatusStyles[t.status] || "chip-neutral")}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/50">{t.duration || "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Rules & Breaches ── */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          {ch.ruleBreaches.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <CheckCircle size={32} className="text-[#00ffcc] mx-auto mb-3 opacity-60" />
              <p className="text-sm font-semibold text-white">No Rule Breaches</p>
              <p className="text-xs text-[#b9cbc2]/50 mt-1">This challenge account is fully compliant.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ch.ruleBreaches.map((breach, i) => (
                <div key={i} className={cn("glass-card rounded-xl p-4 border-l-4", breach.severity === "VIOLATION" ? "border-[#ff4444]" : "border-[#f59e0b]")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className={breach.severity === "VIOLATION" ? "text-[#ff4444] flex-shrink-0 mt-0.5" : "text-[#f59e0b] flex-shrink-0 mt-0.5"} />
                      <div>
                        <p className="text-sm font-semibold text-white">{breach.rule}</p>
                        <p className="text-xs text-[#b9cbc2]/50 mt-0.5">{breach.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                        breach.severity === "VIOLATION" ? "bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/30" : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30")}>
                        {breach.severity}
                      </span>
                      <span className="text-[10px] text-[#b9cbc2]/40">{breach.auto ? "Auto-detected" : "Manual"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Rules Reference */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-4">Challenge Rules Reference</h3>
            <div className="space-y-2.5">
              {[
                { label: "Max Daily Loss", value: ch.maxDailyLoss, used: ch.maxDailyLossUsed, pct: ch.maxDailyLossPct },
                { label: "Max Total Drawdown", value: ch.maxTotalDrawdown, used: ch.maxTotalDrawdownUsed, pct: ch.maxTotalDrawdownPct },
                { label: "Profit Target", value: ch.profitTarget, used: ch.currentBal, pct: ch.profitTargetReached },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center justify-between text-xs py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
                  <span className="text-[#b9cbc2]/60 w-36">{rule.label}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 h-1.5 rounded-full bg-[#0b2f2d]">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${Math.min(rule.pct, 100)}%`, background: rule.pct > 80 ? "#ff4444" : rule.pct > 60 ? "#f59e0b" : "#00ffcc" }}
                      />
                    </div>
                    <span className="text-[#b9cbc2] w-20 text-right">{rule.used} / {rule.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
