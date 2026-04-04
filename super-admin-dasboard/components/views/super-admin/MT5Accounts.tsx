"use client";

import { useState } from "react";
import { Server, Search, RefreshCw, Download, AlertTriangle, CheckCircle, XCircle, Clock, Shield, Activity, Eye, Ban, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccountPhase = "Phase 1" | "Phase 2" | "Funded" | "Disabled";
type ServerName = "NF-NG-Demo" | "NF-NG-Live" | "NF-USD-Demo" | "NF-USD-Live";

interface MT5Account {
  id: string;
  login: string;
  userId: string;
  traderName: string;
  server: ServerName;
  currency: "NGN" | "USD";
  balance: number;
  equity: number;
  profitPct: number;
  dailyDrawdownPct: number;
  maxDrawdownPct: number;
  phase: AccountPhase;
  openPositions: number;
  lastActivity: string;
}

const ACCOUNTS: MT5Account[] = [
  { id: "a1", login: "105001", userId: "NF-4821", traderName: "Adebayo Okafor", server: "NF-NG-Live", currency: "NGN", balance: 860000, equity: 860000, profitPct: 7.5, dailyDrawdownPct: 0.3, maxDrawdownPct: 2.1, phase: "Funded", openPositions: 2, lastActivity: "3 min ago" },
  { id: "a2", login: "105002", userId: "NF-4821", traderName: "Adebayo Okafor", server: "NF-NG-Demo", currency: "NGN", balance: 419200, equity: 422000, profitPct: 4.8, dailyDrawdownPct: 0.0, maxDrawdownPct: 1.5, phase: "Phase 1", openPositions: 1, lastActivity: "3 min ago" },
  { id: "a3", login: "105010", userId: "NF-3312", traderName: "Chidi Nwosu", server: "NF-NG-Demo", currency: "NGN", balance: 467000, equity: 467000, profitPct: 6.7, dailyDrawdownPct: 0.0, maxDrawdownPct: 3.2, phase: "Phase 2", openPositions: 0, lastActivity: "1 hr ago" },
  { id: "a4", login: "205001", userId: "NF-5501", traderName: "Michael Tetteh", server: "NF-USD-Live", currency: "USD", balance: 5397, equity: 5420, profitPct: 7.9, dailyDrawdownPct: 0.4, maxDrawdownPct: 2.8, phase: "Funded", openPositions: 3, lastActivity: "12 min ago" },
  { id: "a5", login: "205010", userId: "NF-7712", traderName: "Kwame Asante", server: "NF-USD-Demo", currency: "USD", balance: 25000, equity: 24100, profitPct: -3.6, dailyDrawdownPct: 1.8, maxDrawdownPct: 6.2, phase: "Phase 1", openPositions: 5, lastActivity: "2 min ago" },
  { id: "a6", login: "105099", userId: "NF-1144", traderName: "Amara Conde", server: "NF-NG-Demo", currency: "NGN", balance: 200000, equity: 181000, profitPct: -9.5, dailyDrawdownPct: 4.9, maxDrawdownPct: 9.5, phase: "Disabled", openPositions: 0, lastActivity: "2 days ago" },
  { id: "a7", login: "205099", userId: "NF-8801", traderName: "Tunde Femi", server: "NF-USD-Demo", currency: "USD", balance: 10000, equity: 9200, profitPct: -8.0, dailyDrawdownPct: 3.2, maxDrawdownPct: 8.0, phase: "Disabled", openPositions: 0, lastActivity: "1 day ago" },
  { id: "a8", login: "105030", userId: "NF-6600", traderName: "Emeka Williams", server: "NF-NG-Live", currency: "NGN", balance: 908800, equity: 912000, profitPct: 13.6, dailyDrawdownPct: 0.1, maxDrawdownPct: 1.9, phase: "Funded", openPositions: 1, lastActivity: "18 min ago" },
];

const PHASE_STYLE: Record<AccountPhase, string> = {
  "Funded": "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/25",
  "Phase 1": "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
  "Phase 2": "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/25",
  "Disabled": "text-[#ff4444] bg-[#ff4444]/10 border-[#ff4444]/25",
};

const SERVER_STYLE: Record<ServerName, string> = {
  "NF-NG-Live": "text-[#00ffcc]",
  "NF-NG-Demo": "text-[#60a5fa]",
  "NF-USD-Live": "text-[#00ffcc]",
  "NF-USD-Demo": "text-[#60a5fa]",
};

export default function MT5AccountsView() {
  const [accounts, setAccounts] = useState<MT5Account[]>(ACCOUNTS);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<"all" | AccountPhase>("all");
  const [serverFilter, setServerFilter] = useState<"all" | ServerName>("all");
  const [sortKey, setSortKey] = useState<"balance" | "profitPct" | "dailyDrawdownPct">("balance");
  const [sortAsc, setSortAsc] = useState(false);

  const toggleDisable = (id: string) => {
    setAccounts((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      return { ...a, phase: a.phase === "Disabled" ? "Phase 1" : "Disabled" };
    }));
  };

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = accounts
    .filter((a) => {
      const matchSearch = a.traderName.toLowerCase().includes(search.toLowerCase()) || a.login.includes(search) || a.userId.toLowerCase().includes(search.toLowerCase());
      const matchPhase = phaseFilter === "all" || a.phase === phaseFilter;
      const matchServer = serverFilter === "all" || a.server === serverFilter;
      return matchSearch && matchPhase && matchServer;
    })
    .sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mul;
    });

  const stats = {
    total: accounts.length,
    active: accounts.filter((a) => a.phase !== "Disabled").length,
    live: accounts.filter((a) => a.server.includes("Live")).length,
    riskAlert: accounts.filter((a) => a.dailyDrawdownPct > 3 || a.maxDrawdownPct > 7).length,
  };

  const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button onClick={() => handleSort(k)} className="flex items-center gap-1 group">
      {label}
      {sortKey === k ? (sortAsc ? <ChevronUp size={11} className="text-[#00ffcc]" /> : <ChevronDown size={11} className="text-[#00ffcc]" />) : <ChevronUp size={11} className="opacity-20 group-hover:opacity-60" />}
    </button>
  );

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Server size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">MT5 Accounts</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Monitor all live and demo MT5 trading accounts across all servers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/08 transition-all">
            <RefreshCw size={12} /> Sync MT5
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Server Status Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["NF-NG-Live", "NF-NG-Demo", "NF-USD-Live", "NF-USD-Demo"] as ServerName[]).map((srv) => {
          const srvAccounts = accounts.filter((a) => a.server === srv);
          const isLive = srv.includes("Live");
          return (
            <div key={srv} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", isLive ? "bg-[#00ffcc] animate-pulse" : "bg-[#60a5fa]")} />
              <div className="min-w-0">
                <p className={cn("text-xs font-semibold font-mono", SERVER_STYLE[srv])}>{srv}</p>
                <p className="text-[11px] text-[#b9cbc2]/40">{srvAccounts.length} accounts</p>
              </div>
              <CheckCircle size={14} className="text-[#00ffcc]/60 ml-auto flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Accounts", value: stats.total, color: "text-white", icon: Server },
          { label: "Active Accounts", value: stats.active, color: "text-[#00ffcc]", icon: Activity },
          { label: "Live Accounts", value: stats.live, color: "text-[#60a5fa]", icon: CheckCircle },
          { label: "Risk Alerts", value: stats.riskAlert, color: stats.riskAlert > 0 ? "text-[#f59e0b]" : "text-[#b9cbc2]/40", icon: AlertTriangle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#00ffcc]/50" />
                <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider">{s.label}</p>
              </div>
              <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            type="text"
            placeholder="MT5 login, name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] text-white placeholder:text-[#b9cbc2]/40 focus:border-[#00ffcc]/40"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value as typeof phaseFilter)}
          className="input-field px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.12)] text-[#b9cbc2] focus:border-[#00ffcc]/40"
        >
          <option value="all">All Phases</option>
          <option value="Funded">Funded</option>
          <option value="Phase 1">Phase 1</option>
          <option value="Phase 2">Phase 2</option>
          <option value="Disabled">Disabled</option>
        </select>
        <select
          value={serverFilter}
          onChange={(e) => setServerFilter(e.target.value as typeof serverFilter)}
          className="input-field px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.12)] text-[#b9cbc2] focus:border-[#00ffcc]/40"
        >
          <option value="all">All Servers</option>
          <option value="NF-NG-Live">NF-NG-Live</option>
          <option value="NF-NG-Demo">NF-NG-Demo</option>
          <option value="NF-USD-Live">NF-USD-Live</option>
          <option value="NF-USD-Demo">NF-USD-Demo</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-[#00ffcc]/08 text-left">
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">MT5 LOGIN</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TRADER</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">SERVER</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <SortBtn k="balance" label="BALANCE" />
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <SortBtn k="profitPct" label="PROFIT %" />
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <SortBtn k="dailyDrawdownPct" label="DAILY DD" />
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">MAX DD</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">PHASE</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">POSITIONS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffcc]/05">
            {filtered.map((acc) => {
              const isDanger = acc.dailyDrawdownPct > 3.5 || acc.maxDrawdownPct > 7;
              const balanceStr = acc.currency === "NGN" ? `₦${acc.balance.toLocaleString()}` : `$${acc.balance.toLocaleString()}`;
              return (
                <tr key={acc.id} className={cn("hover:bg-[#00ffcc]/04 transition-all", acc.phase === "Disabled" && "opacity-60", isDanger && "bg-[#ff4444]/03")}>
                  {/* Login */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {isDanger && <AlertTriangle size={12} className="text-[#f59e0b] flex-shrink-0" />}
                      <span className="font-mono text-[#00ffcc] text-xs">{acc.login}</span>
                    </div>
                  </td>
                  {/* Trader */}
                  <td className="px-4 py-3.5">
                    <p className="text-white font-medium text-sm">{acc.traderName}</p>
                    <p className="text-[11px] text-[#b9cbc2]/50">{acc.userId}</p>
                  </td>
                  {/* Server */}
                  <td className="px-4 py-3.5">
                    <span className={cn("font-mono text-xs", SERVER_STYLE[acc.server])}>{acc.server}</span>
                  </td>
                  {/* Balance */}
                  <td className="px-4 py-3.5 text-white font-semibold text-sm">{balanceStr}</td>
                  {/* Profit */}
                  <td className="px-4 py-3.5">
                    <span className={cn("font-bold font-display text-sm", acc.profitPct >= 0 ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                      {acc.profitPct >= 0 ? "+" : ""}{acc.profitPct}%
                    </span>
                  </td>
                  {/* Daily DD */}
                  <td className="px-4 py-3.5">
                    <span className={cn("text-sm font-medium", acc.dailyDrawdownPct > 3.5 ? "text-[#f59e0b]" : acc.dailyDrawdownPct > 4.5 ? "text-[#ff6b6b]" : "text-[#b9cbc2]")}>
                      {acc.dailyDrawdownPct}%
                    </span>
                  </td>
                  {/* Max DD */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-[#0b2f2d]">
                        <div
                          className={cn("h-1.5 rounded-full", acc.maxDrawdownPct > 7 ? "bg-[#f59e0b]" : "bg-[#00ffcc]/60")}
                          style={{ width: `${(acc.maxDrawdownPct / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#b9cbc2]">{acc.maxDrawdownPct}%</span>
                    </div>
                  </td>
                  {/* Phase */}
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full border", PHASE_STYLE[acc.phase])}>{acc.phase}</span>
                  </td>
                  {/* Positions */}
                  <td className="px-4 py-3.5">
                    <span className={cn("text-sm font-medium", acc.openPositions > 0 ? "text-white" : "text-[#b9cbc2]/40")}>
                      {acc.openPositions}
                    </span>
                    <p className="text-[10px] text-[#b9cbc2]/40">{acc.lastActivity}</p>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white hover:border-[#00ffcc]/20 transition-all">
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => toggleDisable(acc.id)}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-lg border transition-all",
                          acc.phase === "Disabled"
                            ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                            : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
                        )}
                      >
                        {acc.phase === "Disabled" ? <RotateCcw size={12} /> : <Ban size={12} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
