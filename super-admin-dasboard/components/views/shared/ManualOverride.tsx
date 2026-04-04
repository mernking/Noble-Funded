"use client";

import { useState } from "react";
import {
  ShieldOff, RotateCcw, CheckCircle2, XCircle, AlertTriangle,
  Search, Clock, User, ChevronDown, Send, Filter, Zap, RefreshCw,
  Eye, Loader2, CheckCheck, Lock, Unlock, Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

type OverrideType = "reinstate" | "forgive_breach" | "reset_balance" | "unsuspend" | "manual_suspend";
type AccountStatus = "suspended" | "active" | "breached" | "under_review";

interface SuspendedAccount {
  id: string;
  mt5Login: string;
  traderName: string;
  accountSize: string;
  reason: string;
  suspendedAt: string;
  suspendedBy: string; // "n8n" | admin name
  violationType: string;
  drawdownAt: number; // percentage when suspended
  startingBalance: string;
  currentBalance: string;
  status: AccountStatus;
  webhookId: string;
}

interface OverrideLog {
  id: string;
  mt5Login: string;
  traderName: string;
  action: OverrideType;
  performedBy: string;
  reason: string;
  timestamp: string;
  webhookSent: boolean;
  webhookStatus: "success" | "failed" | "pending";
}

const SUSPENDED_ACCOUNTS: SuspendedAccount[] = [
  {
    id: "acc1", mt5Login: "MT5-78821", traderName: "Alex Thorne",
    accountSize: "₦800,000", reason: "Daily Loss Limit Exceeded — Broker spread glitch detected",
    suspendedAt: "Today 14:02", suspendedBy: "n8n Automation", violationType: "Daily Drawdown",
    drawdownAt: 5.2, startingBalance: "₦800,000", currentBalance: "₦758,400", status: "suspended",
    webhookId: "wh_8f92k3"
  },
  {
    id: "acc2", mt5Login: "MT5-92314", traderName: "Emeka Nwachukwu",
    accountSize: "₦500,000", reason: "Simultaneous trades across linked accounts — Rule 11 violation",
    suspendedAt: "Today 10:45", suspendedBy: "n8n Automation", violationType: "Multi-Account Abuse",
    drawdownAt: 3.1, startingBalance: "₦500,000", currentBalance: "₦484,500", status: "breached",
    webhookId: "wh_7d14m2"
  },
  {
    id: "acc3", mt5Login: "MT5-65531", traderName: "Fatima Abubakar",
    accountSize: "$5,000", reason: "News trading restriction — FOMC position not closed before release",
    suspendedAt: "Yesterday 21:18", suspendedBy: "n8n Automation", violationType: "News Trading",
    drawdownAt: 1.8, startingBalance: "$5,000", currentBalance: "$4,910", status: "suspended",
    webhookId: "wh_3c88p9"
  },
  {
    id: "acc4", mt5Login: "MT5-44122", traderName: "Chidi Okonkwo",
    accountSize: "₦1,000,000", reason: "Maximum overall drawdown approaching — System precautionary hold",
    suspendedAt: "Yesterday 16:30", suspendedBy: "n8n Automation", violationType: "Overall Drawdown",
    drawdownAt: 9.4, startingBalance: "₦1,000,000", currentBalance: "₦906,000", status: "under_review",
    webhookId: "wh_5a21q7"
  },
  {
    id: "acc5", mt5Login: "MT5-31089", traderName: "Musa Aliyu",
    accountSize: "$2,500", reason: "IP address mismatch — VPN detected during trading session",
    suspendedAt: "2 days ago", suspendedBy: "Compliance: Sarah O.", violationType: "IP Violation",
    drawdownAt: 0, startingBalance: "$2,500", currentBalance: "$2,312", status: "suspended",
    webhookId: "wh_9b77x1"
  },
];

const OVERRIDE_LOGS: OverrideLog[] = [
  { id: "ol1", mt5Login: "MT5-55901", traderName: "James Obi", action: "reinstate", performedBy: "Alexander Noble", reason: "Broker spread glitch confirmed — false positive violation", timestamp: "Today 13:40", webhookSent: true, webhookStatus: "success" },
  { id: "ol2", mt5Login: "MT5-12440", traderName: "Amina Suleiman", action: "forgive_breach", performedBy: "Alexander Noble", reason: "Manual review: trader complied, data lag caused false flag", timestamp: "Today 11:20", webhookSent: true, webhookStatus: "success" },
  { id: "ol3", mt5Login: "MT5-78100", traderName: "Peter Adeleke", action: "reset_balance", performedBy: "Sarah O. (Compliance)", reason: "Phase reset after system error credited wrong starting balance", timestamp: "Yesterday 15:08", webhookSent: true, webhookStatus: "success" },
  { id: "ol4", mt5Login: "MT5-30029", traderName: "Ngozi Eze", action: "unsuspend", performedBy: "Alexander Noble", reason: "IP flag was legitimate travel — trader confirmed location", timestamp: "2 days ago", webhookSent: true, webhookStatus: "success" },
  { id: "ol5", mt5Login: "MT5-66712", traderName: "Uche Bello", action: "reinstate", performedBy: "Sarah O. (Compliance)", reason: "Broker API outage caused missed equity read — reinstated", timestamp: "3 days ago", webhookSent: false, webhookStatus: "failed" },
];

const ACTION_LABELS: Record<OverrideType, { label: string; color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }> }> = {
  reinstate: { label: "Reinstate Account", color: "#00ffcc", icon: RotateCcw },
  forgive_breach: { label: "Forgive Breach", color: "#60a5fa", icon: CheckCircle2 },
  reset_balance: { label: "Reset Balance", color: "#a78bfa", icon: Coins },
  unsuspend: { label: "Unsuspend", color: "#34d399", icon: Unlock },
  manual_suspend: { label: "Manual Suspend", color: "#ff6b6b", icon: Lock },
};

const STATUS_STYLE: Record<AccountStatus, string> = {
  suspended: "text-[#ff6b6b] bg-[#ff4444]/10 border-[#ff4444]/25",
  active: "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/25",
  breached: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
  under_review: "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
};

interface OverrideModalState {
  account: SuspendedAccount;
  action: OverrideType;
  reason: string;
  loading: boolean;
  done: boolean;
}

export default function ManualOverrideView() {
  const [accounts, setAccounts] = useState<SuspendedAccount[]>(SUSPENDED_ACCOUNTS);
  const [logs, setLogs] = useState<OverrideLog[]>(OVERRIDE_LOGS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<OverrideModalState | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "logs">("queue");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = accounts.filter(
    (a) =>
      a.traderName.toLowerCase().includes(search.toLowerCase()) ||
      a.mt5Login.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (account: SuspendedAccount, action: OverrideType) => {
    setModal({ account, action, reason: "", loading: false, done: false });
  };

  const executeOverride = async () => {
    if (!modal) return;
    setModal((m) => m ? { ...m, loading: true } : m);

    // Simulate webhook dispatch to n8n (in production: POST to /api/webhooks/override)
    await new Promise((r) => setTimeout(r, 1800));

    const newLog: OverrideLog = {
      id: `ol${Date.now()}`,
      mt5Login: modal.account.mt5Login,
      traderName: modal.account.traderName,
      action: modal.action,
      performedBy: "Alexander Noble",
      reason: modal.reason || "No reason provided",
      timestamp: "Just now",
      webhookSent: true,
      webhookStatus: "success",
    };

    // Update account status based on action
    let newStatus: AccountStatus = modal.account.status;
    if (modal.action === "reinstate" || modal.action === "unsuspend" || modal.action === "forgive_breach") newStatus = "active";
    if (modal.action === "manual_suspend") newStatus = "suspended";
    if (modal.action === "reset_balance") newStatus = "active";

    setAccounts((prev) =>
      prev.map((a) => a.id === modal.account.id ? { ...a, status: newStatus } : a)
    );
    setLogs((prev) => [newLog, ...prev]);
    setModal((m) => m ? { ...m, loading: false, done: true } : m);
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#ff6b6b]/15 flex items-center justify-center">
              <ShieldOff size={18} className="text-[#ff6b6b]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">Manual Override Engine</h1>
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase">Reinstatement & Breach Forgiveness</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff6b6b]/08 border border-[#ff4444]/20">
          <Zap size={12} className="text-[#ff6b6b]" />
          <span className="text-[11px] text-[#ff6b6b] font-medium">Webhooks route to n8n in real-time</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Suspended Now", value: accounts.filter((a) => a.status === "suspended").length, color: "#ff6b6b", icon: Lock },
          { label: "Breached", value: accounts.filter((a) => a.status === "breached").length, color: "#f59e0b", icon: AlertTriangle },
          { label: "Under Review", value: accounts.filter((a) => a.status === "under_review").length, color: "#60a5fa", icon: Eye },
          { label: "Reinstated Today", value: logs.filter((l) => l.timestamp.includes("Today") && (l.action === "reinstate" || l.action === "unsuspend")).length, color: "#00ffcc", icon: CheckCheck },
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

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b1e1d]/60 w-fit border border-[rgba(0,255,204,0.06)]">
        {(["queue", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-[12px] font-medium transition-all",
              activeTab === t
                ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/25"
                : "text-[#a8c0b8]/60 hover:text-white"
            )}
          >
            {t === "queue" ? `Override Queue (${accounts.filter((a) => a.status !== "active").length})` : `Action Log (${logs.length})`}
          </button>
        ))}
      </div>

      {activeTab === "queue" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,255,204,0.08)] flex-wrap gap-3">
            <h2 className="text-sm font-semibold font-display text-white">Suspended / Flagged Accounts</h2>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trader or MT5 login..."
                className="input-field bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-[#b9cbc2]/30 w-full sm:w-60"
              />
            </div>
          </div>

          <div className="divide-y divide-[rgba(0,255,204,0.05)]">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-[#a8c0b8]/40 text-sm">No accounts match your search.</div>
            )}
            {filtered.map((account) => (
              <div key={account.id} className="p-4 sm:p-5">
                {/* Row header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 flex items-center justify-center flex-shrink-0">
                      <User size={15} className="text-[#ff6b6b]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">{account.traderName}</span>
                        <code className="text-[11px] text-[#00ffcc]/60 font-mono">{account.mt5Login}</code>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize", STATUS_STYLE[account.status])}>
                          {account.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#a8c0b8]/60 mt-0.5 leading-relaxed">{account.reason}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-[#a8c0b8]/40">
                          <Clock size={10} /> {account.suspendedAt}
                        </span>
                        <span className="text-[11px] text-[#a8c0b8]/40">by <span className="text-[#f59e0b]/70">{account.suspendedBy}</span></span>
                        <span className="text-[11px] text-[#a8c0b8]/40">Account: <span className="text-white/60">{account.accountSize}</span></span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#ff4444]/10 text-[#ff6b6b]/70 border border-[#ff4444]/15">{account.violationType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <button
                      onClick={() => setExpandedId(expandedId === account.id ? null : account.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#a8c0b8]/60 border border-[rgba(0,255,204,0.08)] hover:text-white hover:border-[rgba(0,255,204,0.2)] transition-all"
                    >
                      <Eye size={12} />
                      Details
                      <ChevronDown size={11} className={cn("transition-transform", expandedId === account.id && "rotate-180")} />
                    </button>
                    {account.status !== "active" && (
                      <>
                        <button
                          onClick={() => openModal(account, "forgive_breach")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#60a5fa] bg-[#60a5fa]/08 border border-[#60a5fa]/20 hover:bg-[#60a5fa]/15 transition-all"
                        >
                          <CheckCircle2 size={12} /> Forgive Breach
                        </button>
                        <button
                          onClick={() => openModal(account, "reinstate")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#00ffcc] bg-[#00ffcc]/08 border border-[#00ffcc]/20 hover:bg-[#00ffcc]/15 transition-all"
                        >
                          <RotateCcw size={12} /> Reinstate
                        </button>
                      </>
                    )}
                    {account.status === "active" && (
                      <button
                        onClick={() => openModal(account, "manual_suspend")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#ff6b6b] bg-[#ff4444]/08 border border-[#ff4444]/20 hover:bg-[#ff4444]/15 transition-all"
                      >
                        <Lock size={12} /> Suspend
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === account.id && (
                  <div className="mt-4 pt-4 border-t border-[rgba(0,255,204,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Starting Balance</p>
                      <p className="text-sm font-semibold text-white">{account.startingBalance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Current Balance</p>
                      <p className="text-sm font-semibold text-white">{account.currentBalance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Drawdown at Suspension</p>
                      <p className="text-sm font-semibold text-[#ff6b6b]">{account.drawdownAt}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a8c0b8]/40 mb-1">Webhook ID</p>
                      <code className="text-[11px] font-mono text-[#00ffcc]/50">{account.webhookId}</code>
                    </div>
                    <div className="col-span-2 sm:col-span-4 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => openModal(account, "reset_balance")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#a78bfa] bg-[#a78bfa]/08 border border-[#a78bfa]/20 hover:bg-[#a78bfa]/15 transition-all"
                      >
                        <Coins size={12} /> Reset Starting Balance
                      </button>
                      <button
                        onClick={() => openModal(account, "unsuspend")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#34d399] bg-[#34d399]/08 border border-[#34d399]/20 hover:bg-[#34d399]/15 transition-all"
                      >
                        <Unlock size={12} /> Unsuspend Only
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
            <h2 className="text-sm font-semibold font-display text-white">Override Action Log</h2>
            <p className="text-[11px] text-[#a8c0b8]/40 mt-0.5">All webhook dispatches to n8n are audited and timestamped.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[rgba(0,255,204,0.06)]">
                  {["MT5 Login", "Trader", "Action", "Reason", "By", "Time", "Webhook"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a8c0b8]/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,255,204,0.04)]">
                {logs.map((log) => {
                  const meta = ACTION_LABELS[log.action];
                  return (
                    <tr key={log.id} className="hover:bg-[#00ffcc]/[0.02] transition-colors">
                      <td className="px-4 py-3"><code className="text-[11px] font-mono text-[#00ffcc]/70">{log.mt5Login}</code></td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{log.traderName}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: meta.color }}>
                          <meta.icon size={11} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/60 max-w-[200px] truncate">{log.reason}</td>
                      <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/70">{log.performedBy}</td>
                      <td className="px-4 py-3 text-[11px] text-[#a8c0b8]/50">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border",
                          log.webhookStatus === "success"
                            ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/20"
                            : log.webhookStatus === "failed"
                            ? "text-[#ff6b6b] bg-[#ff4444]/08 border-[#ff4444]/20"
                            : "text-[#f59e0b] bg-[#f59e0b]/08 border-[#f59e0b]/20"
                        )}>
                          {log.webhookStatus === "success" ? <CheckCircle2 size={9} /> : log.webhookStatus === "failed" ? <XCircle size={9} /> : <Loader2 size={9} />}
                          {log.webhookStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Override Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-modal rounded-2xl p-6 w-full max-w-md space-y-5">
            {modal.done ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#00ffcc]/15 flex items-center justify-center mx-auto">
                  <CheckCheck size={24} className="text-[#00ffcc]" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">Override Executed</h3>
                <p className="text-[13px] text-[#a8c0b8]/60">
                  Webhook dispatched to n8n successfully. Account <code className="text-[#00ffcc] font-mono">{modal.account.mt5Login}</code> has been updated.
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#00ffcc]/60">
                  <CheckCircle2 size={12} />
                  <span>n8n workflow triggered — MT5 account status synced</span>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-full py-2.5 rounded-xl bg-[#00ffcc]/15 text-[#00ffcc] font-semibold text-sm border border-[#00ffcc]/25 hover:bg-[#00ffcc]/20 transition-all mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ACTION_LABELS[modal.action].color}15`, border: `1px solid ${ACTION_LABELS[modal.action].color}25` }}>
                    {(() => { const Icon = ACTION_LABELS[modal.action].icon; return <Icon size={16} />; })()}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold font-display text-white">{ACTION_LABELS[modal.action].label}</h3>
                    <p className="text-[12px] text-[#a8c0b8]/60">
                      <code className="text-[#00ffcc]/70 font-mono">{modal.account.mt5Login}</code> — {modal.account.traderName}
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#a8c0b8]/50">Violation type</span>
                    <span className="text-white font-medium">{modal.account.violationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8c0b8]/50">Suspended by</span>
                    <span className="text-[#f59e0b]/80">{modal.account.suspendedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8c0b8]/50">Drawdown at event</span>
                    <span className="text-[#ff6b6b]">{modal.account.drawdownAt}%</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[rgba(0,255,204,0.06)]">
                    <Send size={11} className="text-[#00ffcc]/60" />
                    <span className="text-[#a8c0b8]/50">This action will send a webhook to n8n to update MT5 account status in real-time.</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#a8c0b8]/50 mb-1.5 block">Reason / Notes (required)</label>
                  <textarea
                    value={modal.reason}
                    onChange={(e) => setModal((m) => m ? { ...m, reason: e.target.value } : m)}
                    rows={3}
                    placeholder="e.g. Broker spread glitch confirmed — verified with broker logs ref #8821..."
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#a8c0b8]/30 focus:border-[#00ffcc]/40 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm text-[#a8c0b8] bg-white/[0.04] border border-white/[0.08] hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeOverride}
                    disabled={!modal.reason.trim() || modal.loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: modal.reason.trim() ? ACTION_LABELS[modal.action].color : undefined,
                      color: modal.reason.trim() ? "#001716" : "#a8c0b8",
                      border: `1px solid ${ACTION_LABELS[modal.action].color}40`,
                    }}
                  >
                    {modal.loading ? (
                      <><RefreshCw size={13} className="animate-spin" /> Sending Webhook...</>
                    ) : (
                      <><Send size={13} /> Execute Override</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
