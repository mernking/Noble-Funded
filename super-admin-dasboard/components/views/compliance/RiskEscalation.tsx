"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert, Zap, AlertTriangle, Lock, Eye, CheckCircle2,
  Clock, User, TrendingDown, XCircle, RefreshCw, ChevronDown,
  Circle, ArrowRight, Filter, Search, Flame, Copy, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EscalationType =
  | "copy_trading"
  | "latency_arb"
  | "coordinated_breach"
  | "mass_payout_abuse"
  | "ip_cluster"
  | "drawdown_spike"
  | "toxic_flow";

type EscalationSeverity = "critical" | "high" | "medium";
type EscalationStatus = "live" | "frozen" | "cleared" | "escalated";

interface EscalatedAccount {
  id: string;
  mt5Login: string;
  traderName: string;
  accountSize: string;
  type: EscalationType;
  severity: EscalationSeverity;
  status: EscalationStatus;
  flaggedAt: string;
  flaggedAtRaw: number;
  description: string;
  linkedAccounts?: string[];
  profitAtFlag: string;
  drawdownPct: number;
  tradeCount: number;
  flagSource: string; // n8n node that triggered
  notes: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ESCALATED: EscalatedAccount[] = [
  {
    id: "e1",
    mt5Login: "MT5-91001",
    traderName: "Group Cluster A",
    accountSize: "Various",
    type: "copy_trading",
    severity: "critical",
    status: "live",
    flaggedAt: "Today 14:22",
    flaggedAtRaw: Date.now() - 90000,
    description: "20 accounts placed identical EURUSD buy orders within a 340ms window. Profit correlation: 99.8%. Suspected signal service or copy-trading abuse before payout.",
    linkedAccounts: ["MT5-91001", "MT5-91002", "MT5-91003", "MT5-91004", "MT5-91005", "+15 more"],
    profitAtFlag: "$5,000+ across cluster",
    drawdownPct: 1.2,
    tradeCount: 20,
    flagSource: "n8n: simultaneous-trade-detector",
    notes: "",
  },
  {
    id: "e2",
    mt5Login: "MT5-77412",
    traderName: "Tunde Badmus",
    accountSize: "$10,000",
    type: "latency_arb",
    severity: "critical",
    status: "frozen",
    flaggedAt: "Today 11:45",
    flaggedAtRaw: Date.now() - 3600000,
    description: "Consistent trade execution 50-80ms before price feed update on NF-DEMO-01 server. Pattern matched latency arbitrage signature. 34 winning trades, 0 losing trades in session.",
    profitAtFlag: "$820 in 2 hours",
    drawdownPct: 0.0,
    tradeCount: 34,
    flagSource: "n8n: latency-pattern-detector",
    notes: "Account frozen pending manual review. Broker contacted for execution logs.",
  },
  {
    id: "e3",
    mt5Login: "MT5-55200",
    traderName: "Mubarak Saleh",
    accountSize: "₦500,000",
    type: "coordinated_breach",
    severity: "high",
    status: "live",
    flaggedAt: "Today 10:03",
    flaggedAtRaw: Date.now() - 7200000,
    description: "3 linked accounts (same IP subnet) approached daily loss limit simultaneously. Appears to be testing breach detection thresholds rather than genuine trading activity.",
    linkedAccounts: ["MT5-55200", "MT5-55201", "MT5-55202"],
    profitAtFlag: "₦0 (net loss testing)",
    drawdownPct: 4.8,
    tradeCount: 45,
    flagSource: "n8n: breach-pattern-detector",
    notes: "",
  },
  {
    id: "e4",
    mt5Login: "MT5-33891",
    traderName: "Adaeze Onyema",
    accountSize: "$2,500",
    type: "mass_payout_abuse",
    severity: "high",
    status: "escalated",
    flaggedAt: "Yesterday 19:30",
    flaggedAtRaw: Date.now() - 68000000,
    description: "Trader passed Phase 1 and Phase 2 using minimum 4-day trading rule with a single large trade. Phase 2 completed with only 4 trades. Suspected challenge gaming for payout.",
    profitAtFlag: "$128 (5.12% on $2,500)",
    drawdownPct: 1.1,
    tradeCount: 4,
    flagSource: "n8n: challenge-evaluator-node",
    notes: "Escalated to Super Admin. Payout blocked pending review.",
  },
  {
    id: "e5",
    mt5Login: "MT5-81100",
    traderName: "IP Cluster: 197.x.x.x",
    accountSize: "Multiple",
    type: "ip_cluster",
    severity: "high",
    status: "live",
    flaggedAt: "Yesterday 14:12",
    flaggedAtRaw: Date.now() - 82000000,
    description: "12 separate trader accounts trading from the same IP range (197.210.0.0/24) in Lagos. Simultaneous logins detected. Possible account farm operation.",
    linkedAccounts: ["MT5-81100", "MT5-81101", "MT5-81102", "MT5-81103", "+8 more"],
    profitAtFlag: "₦180,000+ combined",
    drawdownPct: 2.3,
    tradeCount: 89,
    flagSource: "n8n: ip-clustering-detector",
    notes: "",
  },
  {
    id: "e6",
    mt5Login: "MT5-44122",
    traderName: "Chidi Okonkwo",
    accountSize: "₦1,000,000",
    type: "drawdown_spike",
    severity: "medium",
    status: "live",
    flaggedAt: "Yesterday 16:30",
    flaggedAtRaw: Date.now() - 81000000,
    description: "Drawdown approaching 9.4% (limit: 10%). n8n pre-emptively flagged for monitoring before auto-suspension threshold is hit.",
    profitAtFlag: "₦0 (monitoring phase)",
    drawdownPct: 9.4,
    tradeCount: 12,
    flagSource: "n8n: equity-monitor-node",
    notes: "",
  },
  {
    id: "e7",
    mt5Login: "MT5-20091",
    traderName: "Hakeem Olawale",
    accountSize: "$5,000",
    type: "toxic_flow",
    severity: "medium",
    status: "cleared",
    flaggedAt: "2 days ago",
    flaggedAtRaw: Date.now() - 172000000,
    description: "High win-rate scalping pattern flagged as potentially toxic to liquidity provider. 94% win rate over 3 sessions. Investigated — legitimate strategy, cleared.",
    profitAtFlag: "$241 cleared",
    drawdownPct: 0.8,
    tradeCount: 62,
    flagSource: "n8n: toxic-flow-detector",
    notes: "Cleared after manual review. Strategy is scalping on news — not prohibited under current rules.",
  },
];

const TYPE_META: Record<EscalationType, { label: string; color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }> }> = {
  copy_trading: { label: "Copy Trading / Signal Abuse", color: "#ff6b6b", icon: Flame },
  latency_arb: { label: "Latency Arbitrage", color: "#ff6b6b", icon: Zap },
  coordinated_breach: { label: "Coordinated Breach Test", color: "#f59e0b", icon: AlertTriangle },
  mass_payout_abuse: { label: "Payout Gaming", color: "#f59e0b", icon: TrendingDown },
  ip_cluster: { label: "IP Cluster / Account Farm", color: "#f59e0b", icon: User },
  drawdown_spike: { label: "Drawdown Alert", color: "#60a5fa", icon: TrendingDown },
  toxic_flow: { label: "Toxic Flow Pattern", color: "#a78bfa", icon: AlertTriangle },
};

const SEVERITY_STYLE: Record<EscalationSeverity, string> = {
  critical: "text-[#ff6b6b] bg-[#ff4444]/12 border-[#ff4444]/30",
  high: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
  medium: "text-[#60a5fa] bg-[#60a5fa]/08 border-[#60a5fa]/20",
};

const STATUS_STYLE: Record<EscalationStatus, string> = {
  live: "text-[#ff6b6b] bg-[#ff4444]/08 border-[#ff4444]/25",
  frozen: "text-[#a78bfa] bg-[#a78bfa]/08 border-[#a78bfa]/25",
  cleared: "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/20",
  escalated: "text-[#f59e0b] bg-[#f59e0b]/08 border-[#f59e0b]/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RiskEscalation() {
  const [items, setItems] = useState<EscalatedAccount[]>(ESCALATED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | EscalationSeverity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | EscalationStatus>("all");
  const [isLive, setIsLive] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Simulate a new live escalation appearing periodically
  useEffect(() => {
    if (!isLive) return;
    const timer = setTimeout(() => {
      const liveItem: EscalatedAccount = {
        id: `live_${Date.now()}`,
        mt5Login: `MT5-${Math.floor(10000 + Math.random() * 90000)}`,
        traderName: "New Flagged Trader",
        accountSize: "$5,000",
        type: "copy_trading",
        severity: "critical",
        status: "live",
        flaggedAt: "Just now",
        flaggedAtRaw: Date.now(),
        description: "Real-time flag: Account entered simultaneous position matching 8 other accounts. Payout block applied by n8n.",
        profitAtFlag: "$240 (live)",
        drawdownPct: 0.4,
        tradeCount: 3,
        flagSource: "n8n: simultaneous-trade-detector",
        notes: "",
      };
      setItems((prev) => [liveItem, ...prev]);
      setFlash(liveItem.id);
      setTimeout(() => setFlash(null), 3000);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isLive]);

  const filtered = items.filter((item) => {
    const matchSearch = item.traderName.toLowerCase().includes(search.toLowerCase()) || item.mt5Login.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || item.severity === severityFilter;
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const criticalCount = items.filter((i) => i.severity === "critical" && i.status === "live").length;
  const frozenCount = items.filter((i) => i.status === "frozen").length;
  const pendingCount = items.filter((i) => i.status === "live" || i.status === "escalated").length;
  const clearedToday = items.filter((i) => i.status === "cleared").length;

  const updateStatus = (id: string, status: EscalationStatus) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
  };

  const saveNotes = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, notes: notes[id] || i.notes } : i));
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#ff6b6b]/15 flex items-center justify-center animate-pulse">
              <ShieldAlert size={18} className="text-[#ff6b6b]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">Live Risk Escalation Board</h1>
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase">High-Priority Threat Detection</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff4444]/12 border border-[#ff4444]/30 animate-pulse">
              <Flame size={12} className="text-[#ff6b6b]" />
              <span className="text-[11px] font-bold text-[#ff6b6b]">{criticalCount} CRITICAL — IMMEDIATE ACTION REQUIRED</span>
            </div>
          )}
          <button
            onClick={() => setIsLive((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border font-medium transition-all",
              isLive
                ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/25"
                : "text-[#a8c0b8]/50 border-[rgba(0,255,204,0.08)]"
            )}
          >
            <Circle size={8} className={cn(isLive ? "fill-[#00ffcc] text-[#00ffcc]" : "text-[#a8c0b8]/30")} />
            {isLive ? "Live Feed" : "Paused"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical Active", value: criticalCount, color: "#ff6b6b", icon: Flame },
          { label: "Accounts Frozen", value: frozenCount, color: "#a78bfa", icon: Lock },
          { label: "Pending Review", value: pendingCount, color: "#f59e0b", icon: Eye },
          { label: "Cleared", value: clearedToday, color: "#00ffcc", icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">{s.value}</p>
              <p className="text-[11px] text-[#a8c0b8]/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trader or MT5..."
            className="input-field w-full bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "critical", "high", "medium"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize",
                severityFilter === s
                  ? s === "critical" ? "text-[#ff6b6b] bg-[#ff4444]/10 border-[#ff4444]/25"
                    : s === "high" ? "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25"
                    : s === "medium" ? "text-[#60a5fa] bg-[#60a5fa]/08 border-[#60a5fa]/20"
                    : "text-white bg-[#0b2f2d]/60 border-[rgba(0,255,204,0.15)]"
                  : "text-[#a8c0b8]/50 border-transparent hover:text-white"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {(["all", "live", "frozen", "cleared", "escalated"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize",
                statusFilter === s
                  ? "text-white bg-[#0b2f2d]/60 border-[rgba(0,255,204,0.2)]"
                  : "text-[#a8c0b8]/50 border-transparent hover:text-white"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Escalation cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl py-12 text-center text-[#a8c0b8]/40 text-sm">No matching escalations.</div>
        )}
        {filtered.map((item) => {
          const typeMeta = TYPE_META[item.type];
          const isExpanded = expandedId === item.id;
          const isNew = flash === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "glass-card rounded-xl overflow-hidden transition-all",
                item.severity === "critical" && item.status === "live" && "border-[#ff4444]/25",
                isNew && "border-[#00ffcc]/30 shadow-[0_0_20px_rgba(0,255,204,0.08)]"
              )}
            >
              {/* Card header */}
              <div
                className={cn(
                  "px-5 py-4 cursor-pointer transition-colors",
                  item.severity === "critical" && item.status === "live" ? "hover:bg-[#ff4444]/[0.03]" : "hover:bg-[#00ffcc]/[0.02]"
                )}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Severity indicator */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${typeMeta.color}15`, border: `1px solid ${typeMeta.color}25` }}
                    >
                      <typeMeta.icon size={16} style={{ color: typeMeta.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[13px] font-bold text-white">{item.traderName}</span>
                        <code className="text-[11px] font-mono text-[#00ffcc]/50">{item.mt5Login}</code>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-semibold", SEVERITY_STYLE[item.severity])}>
                          {item.severity.toUpperCase()}
                        </span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border capitalize", STATUS_STYLE[item.status])}>
                          {item.status === "live" ? "● Live" : item.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold mb-1" style={{ color: typeMeta.color }}>{typeMeta.label}</p>
                      <p className="text-[12px] text-[#a8c0b8]/60 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap text-[10px] text-[#a8c0b8]/40">
                        <span className="flex items-center gap-1"><Clock size={9} /> {item.flaggedAt}</span>
                        <span>Profit: <span className="text-[#f59e0b]/70">{item.profitAtFlag}</span></span>
                        <span>DD: <span className={item.drawdownPct > 8 ? "text-[#ff6b6b]" : "text-white/60"}>{item.drawdownPct}%</span></span>
                        <span>Trades: <span className="text-white/60">{item.tradeCount}</span></span>
                        <span className="text-[#a8c0b8]/30">via <span className="text-[#60a5fa]/50">{item.flagSource}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    {item.status === "live" && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(item.id, "frozen"); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#a78bfa] bg-[#a78bfa]/08 border border-[#a78bfa]/20 hover:bg-[#a78bfa]/15 transition-all"
                        >
                          <Lock size={11} /> Freeze Account
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(item.id, "escalated"); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#f59e0b] bg-[#f59e0b]/08 border border-[#f59e0b]/20 hover:bg-[#f59e0b]/15 transition-all"
                        >
                          <ArrowRight size={11} /> Escalate
                        </button>
                      </>
                    )}
                    {item.status === "frozen" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(item.id, "cleared"); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#00ffcc] bg-[#00ffcc]/08 border border-[#00ffcc]/20 hover:bg-[#00ffcc]/15 transition-all"
                      >
                        <CheckCircle2 size={11} /> Mark Cleared
                      </button>
                    )}
                    {item.status === "escalated" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(item.id, "cleared"); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#00ffcc] bg-[#00ffcc]/08 border border-[#00ffcc]/20 hover:bg-[#00ffcc]/15 transition-all"
                      >
                        <CheckCircle2 size={11} /> Resolve
                      </button>
                    )}
                    <ChevronDown size={13} className={cn("text-[#a8c0b8]/30 transition-transform flex-shrink-0", isExpanded && "rotate-180")} />
                  </div>
                </div>
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[rgba(0,255,204,0.06)]">
                  {/* Linked accounts */}
                  {item.linkedAccounts && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-2">Linked / Correlated Accounts</p>
                      <div className="flex flex-wrap gap-2">
                        {item.linkedAccounts.map((acc) => (
                          <span key={acc} className="text-[11px] font-mono px-2 py-1 rounded bg-[#ff4444]/10 text-[#ff6b6b]/80 border border-[#ff4444]/15">{acc}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12px]">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Account Size</p>
                      <p className="text-white font-semibold">{item.accountSize}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Profit at Flag</p>
                      <p className="text-[#f59e0b] font-semibold">{item.profitAtFlag}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Drawdown</p>
                      <p className={cn("font-semibold", item.drawdownPct > 8 ? "text-[#ff6b6b]" : "text-white")}>{item.drawdownPct}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Flag Source</p>
                      <p className="text-[#60a5fa]/80">{item.flagSource}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1.5">Compliance Notes</p>
                    {item.notes && !notes[item.id] && (
                      <p className="text-[12px] text-[#a8c0b8]/60 italic mb-2">{item.notes}</p>
                    )}
                    <div className="flex items-end gap-2">
                      <textarea
                        rows={2}
                        value={notes[item.id] ?? item.notes}
                        onChange={(e) => setNotes((n) => ({ ...n, [item.id]: e.target.value }))}
                        placeholder="Add compliance notes, investigation findings..."
                        className="input-field flex-1 px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#a8c0b8]/30 focus:border-[#00ffcc]/40 resize-none"
                      />
                      <button
                        onClick={() => saveNotes(item.id)}
                        className="px-3 py-2 rounded-lg text-[11px] font-semibold text-[#00ffcc] bg-[#00ffcc]/08 border border-[#00ffcc]/20 hover:bg-[#00ffcc]/15 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap border-t border-[rgba(0,255,204,0.06)]">
                    <span className="text-[10px] text-[#a8c0b8]/40 uppercase tracking-wider">Quick Actions:</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#a8c0b8]/60 border border-[rgba(0,255,204,0.08)] hover:text-white hover:border-[rgba(0,255,204,0.2)] transition-all">
                      <Eye size={11} /> View Full Trade History
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#a8c0b8]/60 border border-[rgba(0,255,204,0.08)] hover:text-white hover:border-[rgba(0,255,204,0.2)] transition-all">
                      <TrendingDown size={11} /> View Equity Curve
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#ff6b6b]/70 border border-[#ff4444]/15 hover:bg-[#ff4444]/08 hover:text-[#ff6b6b] transition-all">
                      <XCircle size={11} /> Disqualify & Block Payout
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
