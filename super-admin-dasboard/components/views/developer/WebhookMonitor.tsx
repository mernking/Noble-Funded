"use client";

import { useState, useEffect } from "react";
import {
  Webhook, Activity, CheckCircle2, XCircle, AlertTriangle, Clock,
  Search, ChevronDown, ChevronRight, RefreshCw, Copy, CheckCheck,
  Filter, Zap, TrendingDown, User, Cpu, Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type WebhookStatus = "success" | "failed" | "pending" | "retrying";
type WebhookEvent = "breach_detected" | "account_suspended" | "payout_approved" | "payout_rejected" | "kyc_passed" | "kyc_failed" | "equity_alert" | "account_reinstated" | "challenge_passed" | "rule_violated";

interface WebhookEntry {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  mt5Login: string;
  traderName: string;
  timestamp: string;
  timestampRaw: number; // ms for sorting
  status: WebhookStatus;
  source: string; // n8n node name
  latencyMs: number;
  payload: Record<string, unknown>;
  errorMsg?: string;
  retryCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WEBHOOK_DATA: WebhookEntry[] = [
  {
    id: "wh1", webhookId: "wh_8f92k3", event: "breach_detected", mt5Login: "MT5-78821", traderName: "Alex Thorne",
    timestamp: "Today 14:02:34", timestampRaw: Date.now() - 120000, status: "success", source: "n8n: equity-monitor-node",
    latencyMs: 84, retryCount: 0,
    payload: { event: "breach_detected", mt5_login: "MT5-78821", trader_id: "4021", rule: "daily_loss_limit", drawdown_pct: 5.21, equity_usd: 758400, balance_usd: 800000, timestamp: "2026-04-01T14:02:34Z", broker: "AXI", spread_note: "Spread spike detected on XAUUSD — possible false positive" }
  },
  {
    id: "wh2", webhookId: "wh_9d12m8", event: "account_suspended", mt5Login: "MT5-78821", traderName: "Alex Thorne",
    timestamp: "Today 14:02:35", timestampRaw: Date.now() - 119000, status: "success", source: "n8n: account-action-node",
    latencyMs: 112, retryCount: 0,
    payload: { event: "account_suspended", mt5_login: "MT5-78821", action: "suspend", reason: "daily_loss_limit_exceeded", new_status: "suspended", previous_status: "active", timestamp: "2026-04-01T14:02:35Z" }
  },
  {
    id: "wh3", webhookId: "wh_7d14m2", event: "rule_violated", mt5Login: "MT5-92314", traderName: "Emeka Nwachukwu",
    timestamp: "Today 10:45:12", timestampRaw: Date.now() - 3600000, status: "success", source: "n8n: compliance-rules-node",
    latencyMs: 67, retryCount: 0,
    payload: { event: "rule_violated", mt5_login: "MT5-92314", rule: "no_hedging_between_accounts", linked_accounts: ["MT5-92315", "MT5-92316"], instrument: "EURUSD", position_size: 2.5, timestamp: "2026-04-01T10:45:12Z" }
  },
  {
    id: "wh4", webhookId: "wh_3c88p9", event: "equity_alert", mt5Login: "MT5-65531", traderName: "Fatima Abubakar",
    timestamp: "Yesterday 21:18:07", timestampRaw: Date.now() - 72000000, status: "success", source: "n8n: equity-monitor-node",
    latencyMs: 95, retryCount: 0,
    payload: { event: "equity_alert", mt5_login: "MT5-65531", alert_type: "news_trading_violation", news_event: "FOMC Rate Decision", position: { instrument: "USDJPY", size: 1.0, direction: "buy" }, time_before_news_mins: 2, rule: "news_trading_restriction", timestamp: "2026-03-31T21:18:07Z" }
  },
  {
    id: "wh5", webhookId: "wh_1a55z3", event: "payout_approved", mt5Login: "MT5-55901", traderName: "James Obi",
    timestamp: "Yesterday 16:40:22", timestampRaw: Date.now() - 79000000, status: "success", source: "n8n: payout-processor-node",
    latencyMs: 210, retryCount: 0,
    payload: { event: "payout_approved", mt5_login: "MT5-55901", amount_ngn: 45000, payment_method: "bank_transfer", bank: "GTBank", account_last4: "8821", approved_by: "compliance_team", timestamp: "2026-03-31T16:40:22Z" }
  },
  {
    id: "wh6", webhookId: "wh_2b66x4", event: "challenge_passed", mt5Login: "MT5-44901", traderName: "Chukwu Eze",
    timestamp: "Yesterday 14:22:19", timestampRaw: Date.now() - 86000000, status: "success", source: "n8n: challenge-evaluator-node",
    latencyMs: 145, retryCount: 0,
    payload: { event: "challenge_passed", mt5_login: "MT5-44901", phase: "Phase 1", profit_pct: 10.84, min_trading_days: 8, daily_dd_max: 2.1, overall_dd_max: 4.3, next_step: "provision_phase2_account", timestamp: "2026-03-31T14:22:19Z" }
  },
  {
    id: "wh7", webhookId: "wh_5k99p1", event: "payout_rejected", mt5Login: "MT5-31089", traderName: "Musa Aliyu",
    timestamp: "2 days ago 09:11:44", timestampRaw: Date.now() - 172000000, status: "failed", source: "n8n: payout-processor-node",
    latencyMs: 0, retryCount: 3,
    errorMsg: "Broker API timeout — payout gateway /api/gateway/transfer returned 503 after 3 retries",
    payload: { event: "payout_rejected", mt5_login: "MT5-31089", amount_usd: 50, reason: "broker_api_timeout", error_code: 503, retry_count: 3, timestamp: "2026-03-30T09:11:44Z" }
  },
  {
    id: "wh8", webhookId: "wh_9m01r2", event: "kyc_passed", mt5Login: "MT5-88200", traderName: "Amara Nwosu",
    timestamp: "2 days ago 11:50:03", timestampRaw: Date.now() - 165000000, status: "success", source: "n8n: kyc-verification-node",
    latencyMs: 320, retryCount: 0,
    payload: { event: "kyc_passed", mt5_login: "MT5-88200", document_type: "National ID", verification_provider: "Smile Identity", confidence_score: 0.97, next_action: "activate_trading_account", timestamp: "2026-03-30T11:50:03Z" }
  },
  {
    id: "wh9", webhookId: "wh_4p88q7", event: "account_reinstated", mt5Login: "MT5-55901", traderName: "James Obi",
    timestamp: "Today 13:40:11", timestampRaw: Date.now() - 150000, status: "success", source: "Dashboard: Manual Override",
    latencyMs: 1820, retryCount: 0,
    payload: { event: "account_reinstated", mt5_login: "MT5-55901", action: "reinstate", performed_by: "Alexander Noble", reason: "Broker spread glitch confirmed — false positive violation", previous_status: "suspended", new_status: "active", reset_balance: false, timestamp: "2026-04-01T13:40:11Z" }
  },
  {
    id: "wh10", webhookId: "wh_6r77s5", event: "equity_alert", mt5Login: "MT5-44122", traderName: "Chidi Okonkwo",
    timestamp: "Yesterday 16:30:45", timestampRaw: Date.now() - 81000000, status: "pending", source: "n8n: equity-monitor-node",
    latencyMs: 0, retryCount: 1,
    payload: { event: "equity_alert", mt5_login: "MT5-44122", alert_type: "overall_drawdown_approaching", drawdown_pct: 9.4, threshold: 10.0, timestamp: "2026-03-31T16:30:45Z" }
  },
];

const EVENT_META: Record<WebhookEvent, { label: string; color: string }> = {
  breach_detected: { label: "Breach Detected", color: "#ff6b6b" },
  account_suspended: { label: "Account Suspended", color: "#ff6b6b" },
  payout_approved: { label: "Payout Approved", color: "#00ffcc" },
  payout_rejected: { label: "Payout Rejected", color: "#f59e0b" },
  kyc_passed: { label: "KYC Passed", color: "#34d399" },
  kyc_failed: { label: "KYC Failed", color: "#ff6b6b" },
  equity_alert: { label: "Equity Alert", color: "#f59e0b" },
  account_reinstated: { label: "Account Reinstated", color: "#a78bfa" },
  challenge_passed: { label: "Challenge Passed", color: "#00ffcc" },
  rule_violated: { label: "Rule Violated", color: "#ff6b6b" },
};

const STATUS_STYLE: Record<WebhookStatus, string> = {
  success: "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/20",
  failed: "text-[#ff6b6b] bg-[#ff4444]/08 border-[#ff4444]/20",
  pending: "text-[#f59e0b] bg-[#f59e0b]/08 border-[#f59e0b]/20",
  retrying: "text-[#a78bfa] bg-[#a78bfa]/08 border-[#a78bfa]/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebhookMonitor() {
  const [entries, setEntries] = useState<WebhookEntry[]>(WEBHOOK_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WebhookStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("Just now");

  // Simulate live feed — add a new webhook entry periodically
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const simulatedEvents: Partial<WebhookEntry>[] = [
        { event: "equity_alert", mt5Login: `MT5-${Math.floor(10000 + Math.random() * 90000)}`, traderName: "Live Trader", source: "n8n: equity-monitor-node", status: "success" },
        { event: "payout_approved", mt5Login: `MT5-${Math.floor(10000 + Math.random() * 90000)}`, traderName: "Live Payout", source: "n8n: payout-processor-node", status: "success" },
      ];
      const pick = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const newEntry: WebhookEntry = {
        id: `live_${Date.now()}`,
        webhookId: `wh_live${Math.random().toString(36).slice(2, 8)}`,
        event: pick.event as WebhookEvent,
        mt5Login: pick.mt5Login ?? "MT5-00000",
        traderName: pick.traderName ?? "Trader",
        timestamp: "Live",
        timestampRaw: Date.now(),
        status: pick.status as WebhookStatus,
        source: pick.source ?? "n8n",
        latencyMs: Math.floor(50 + Math.random() * 300),
        retryCount: 0,
        payload: { event: pick.event, mt5_login: pick.mt5Login, timestamp: new Date().toISOString(), live: true },
      };
      setEntries((prev) => [newEntry, ...prev].slice(0, 50));
      setLastRefresh("Just now");
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.traderName.toLowerCase().includes(search.toLowerCase()) ||
      e.mt5Login.toLowerCase().includes(search.toLowerCase()) ||
      e.webhookId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const copyPayload = (id: string, payload: Record<string, unknown>) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const successCount = entries.filter((e) => e.status === "success").length;
  const failedCount = entries.filter((e) => e.status === "failed").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const avgLatency = Math.round(entries.filter((e) => e.latencyMs > 0).reduce((s, e) => s + e.latencyMs, 0) / entries.filter((e) => e.latencyMs > 0).length);

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#34d399]/15 flex items-center justify-center">
              <Webhook size={18} className="text-[#34d399]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">Webhook & API Event Log</h1>
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase">n8n Workflow Monitor</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border font-medium transition-all",
              isLive
                ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/25"
                : "text-[#a8c0b8]/50 border-[rgba(0,255,204,0.08)] hover:text-white"
            )}
          >
            <Circle size={8} className={cn(isLive ? "fill-[#00ffcc] text-[#00ffcc]" : "text-[#a8c0b8]/30")} />
            {isLive ? "Live" : "Paused"}
          </button>
          <span className="text-[11px] text-[#a8c0b8]/40 flex items-center gap-1">
            <RefreshCw size={10} /> Refreshed {lastRefresh}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: entries.length, color: "#a8c0b8", icon: Activity },
          { label: "Successful", value: successCount, color: "#00ffcc", icon: CheckCircle2 },
          { label: "Failed", value: failedCount, color: "#ff6b6b", icon: XCircle },
          { label: "Avg Latency", value: `${avgLatency}ms`, color: "#60a5fa", icon: Zap },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}20` }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-white">{s.value}</p>
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
            placeholder="Search MT5 login, trader, webhook ID..."
            className="input-field w-full bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "success", "failed", "pending"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize",
                statusFilter === s
                  ? s === "success" ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/25"
                    : s === "failed" ? "text-[#ff6b6b] bg-[#ff4444]/08 border-[#ff4444]/25"
                    : s === "pending" ? "text-[#f59e0b] bg-[#f59e0b]/08 border-[#f59e0b]/25"
                    : "text-white bg-[#0b2f2d]/60 border-[rgba(0,255,204,0.15)]"
                  : "text-[#a8c0b8]/50 border-transparent hover:text-white"
              )}
            >
              {s}
              {s === "failed" && failedCount > 0 && (
                <span className="ml-1 text-[9px] bg-[#ff4444]/20 text-[#ff6b6b] px-1 rounded-full">{failedCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Webhook log table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)] flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold font-display text-white">Event Feed</h2>
          <span className="text-[11px] text-[#a8c0b8]/40">{filtered.length} events shown</span>
        </div>

        <div className="divide-y divide-[rgba(0,255,204,0.04)]">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#a8c0b8]/40 text-sm">No matching events.</div>
          )}
          {filtered.map((entry) => {
            const eventMeta = EVENT_META[entry.event];
            const isExpanded = expandedId === entry.id;
            const isNew = entry.timestamp === "Live";
            return (
              <div key={entry.id} className={cn("transition-colors", isNew && "bg-[#00ffcc]/[0.025]")}>
                {/* Row */}
                <div
                  className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-[#00ffcc]/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.status === "success" ? "#00ffcc" : entry.status === "failed" ? "#ff6b6b" : "#f59e0b", boxShadow: `0 0 6px ${entry.status === "success" ? "#00ffcc" : entry.status === "failed" ? "#ff6b6b" : "#f59e0b"}80` }} />

                  {/* Webhook ID */}
                  <code className="text-[11px] font-mono text-[#a8c0b8]/40 w-24 flex-shrink-0 truncate hidden sm:block">{entry.webhookId}</code>

                  {/* Event type */}
                  <span className="text-[11px] font-semibold flex-shrink-0 w-36 hidden md:block" style={{ color: eventMeta.color }}>{eventMeta.label}</span>

                  {/* Trader */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <User size={11} className="text-[#a8c0b8]/40 flex-shrink-0" />
                    <span className="text-[12px] text-white truncate">{entry.traderName}</span>
                    <code className="text-[10px] font-mono text-[#00ffcc]/50 hidden sm:block">{entry.mt5Login}</code>
                  </div>

                  {/* Source */}
                  <span className="text-[10px] text-[#a8c0b8]/40 hidden lg:block flex-shrink-0 max-w-[180px] truncate">{entry.source}</span>

                  {/* Latency */}
                  <span className={cn(
                    "text-[10px] font-mono flex-shrink-0 w-14 text-right hidden sm:block",
                    entry.latencyMs > 200 ? "text-[#f59e0b]" : entry.latencyMs === 0 ? "text-[#a8c0b8]/30" : "text-[#34d399]"
                  )}>
                    {entry.latencyMs > 0 ? `${entry.latencyMs}ms` : "—"}
                  </span>

                  {/* Status badge */}
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize flex-shrink-0", STATUS_STYLE[entry.status])}>
                    {entry.status}
                    {entry.retryCount > 0 && ` (×${entry.retryCount})`}
                  </span>

                  {/* Time */}
                  <span className={cn("text-[10px] flex-shrink-0 w-28 text-right", isNew ? "text-[#00ffcc] font-semibold" : "text-[#a8c0b8]/40")}>
                    {isNew ? "● Live" : entry.timestamp}
                  </span>

                  <ChevronDown size={12} className={cn("text-[#a8c0b8]/30 flex-shrink-0 transition-transform", isExpanded && "rotate-180")} />
                </div>

                {/* Expanded payload */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {entry.errorMsg && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#ff4444]/08 border border-[#ff4444]/20">
                        <AlertTriangle size={12} className="text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#ff6b6b]/80">{entry.errorMsg}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-[#a8c0b8]/50 uppercase tracking-wider font-semibold">Webhook Payload</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyPayload(entry.id, entry.payload); }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-[#a8c0b8]/60 hover:text-[#00ffcc] border border-[rgba(0,255,204,0.08)] hover:border-[#00ffcc]/20 transition-all"
                      >
                        {copied === entry.id ? <CheckCheck size={11} /> : <Copy size={11} />}
                        {copied === entry.id ? "Copied" : "Copy JSON"}
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-[#00ffcc]/70 bg-[#010e0d] rounded-xl p-4 overflow-x-auto border border-[rgba(0,255,204,0.08)] leading-relaxed max-h-64 overflow-y-auto">
                      {JSON.stringify(entry.payload, null, 2)}
                    </pre>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <p className="text-[#a8c0b8]/40 uppercase tracking-wider text-[9px] mb-0.5">Source Node</p>
                        <p className="text-white">{entry.source}</p>
                      </div>
                      <div>
                        <p className="text-[#a8c0b8]/40 uppercase tracking-wider text-[9px] mb-0.5">Latency</p>
                        <p className={entry.latencyMs > 200 ? "text-[#f59e0b]" : "text-[#34d399]"}>{entry.latencyMs > 0 ? `${entry.latencyMs}ms` : "—"}</p>
                      </div>
                      <div>
                        <p className="text-[#a8c0b8]/40 uppercase tracking-wider text-[9px] mb-0.5">Retries</p>
                        <p className={entry.retryCount > 0 ? "text-[#f59e0b]" : "text-white"}>{entry.retryCount}</p>
                      </div>
                      <div>
                        <p className="text-[#a8c0b8]/40 uppercase tracking-wider text-[9px] mb-0.5">Webhook ID</p>
                        <code className="text-[#00ffcc]/60">{entry.webhookId}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
