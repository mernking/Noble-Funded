"use client";

import { useState } from "react";
import {
  Medal, Eye, EyeOff, Ban, CheckCircle, Search, AlertTriangle,
  Trophy, TrendingUp, Shield, Ghost, Flag, RefreshCw, Filter,
} from "lucide-react";

type LeaderboardEntry = {
  rank: number;
  trader: string;
  traderId: string;
  account: string;
  pnl: number;
  winRate: number;
  trades: number;
  ghostMode: boolean;
  banned: boolean;
  flagged: boolean;
  joinedDays: number;
  avgRR: number;
};

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, trader: "Emeka Nwachukwu", traderId: "ID-4619", account: "MT5-44312", pnl: 28.4, winRate: 74, trades: 142, ghostMode: false, banned: false, flagged: false, joinedDays: 28, avgRR: 2.1 },
  { rank: 2, trader: "Jane Adeyemi", traderId: "ID-3821", account: "MT5-78821", pnl: 24.1, winRate: 68, trades: 98, ghostMode: false, banned: false, flagged: false, joinedDays: 25, avgRR: 1.9 },
  { rank: 3, trader: "Musa Okoro", traderId: "ID-4892", account: "MT5-33401", pnl: 21.7, winRate: 71, trades: 210, ghostMode: true, banned: false, flagged: false, joinedDays: 22, avgRR: 1.7 },
  { rank: 4, trader: "Chidi Okonkwo", traderId: "ID-4821", account: "MT5-55601", pnl: 19.2, winRate: 65, trades: 77, ghostMode: false, banned: false, flagged: true, joinedDays: 19, avgRR: 2.4 },
  { rank: 5, trader: "Tosin Abiodun", traderId: "ID-3901", account: "MT5-22190", pnl: 17.8, winRate: 62, trades: 134, ghostMode: false, banned: false, flagged: false, joinedDays: 18, avgRR: 1.8 },
  { rank: 6, trader: "Alex Thorne", traderId: "ID-3012", account: "MT5-90012", pnl: 16.3, winRate: 60, trades: 88, ghostMode: false, banned: false, flagged: false, joinedDays: 17, avgRR: 1.6 },
  { rank: 7, trader: "Unknown-A", traderId: "ID-ANON", account: "MT5-88231", pnl: 15.9, winRate: 58, trades: 310, ghostMode: false, banned: false, flagged: true, joinedDays: 5, avgRR: 1.2 },
  { rank: 8, trader: "Mark Samson", traderId: "ID-3555", account: "MT5-11234", pnl: 14.8, winRate: 70, trades: 66, ghostMode: true, banned: false, flagged: false, joinedDays: 15, avgRR: 2.0 },
  { rank: 9, trader: "Amara Obi", traderId: "ID-4811", account: "MT5-77012", pnl: 13.1, winRate: 55, trades: 189, ghostMode: false, banned: false, flagged: false, joinedDays: 14, avgRR: 1.4 },
  { rank: 10, trader: "Prince Ade", traderId: "ID-4710", account: "MT5-99812", pnl: 12.4, winRate: 63, trades: 74, ghostMode: false, banned: false, flagged: false, joinedDays: 12, avgRR: 1.9 },
];

export default function LeaderboardModeration() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged" | "ghost" | "banned">("all");
  const [refreshing, setRefreshing] = useState(false);

  const toggleGhost = (account: string) => {
    setEntries((prev) => prev.map((e) => e.account === account ? { ...e, ghostMode: !e.ghostMode } : e));
  };

  const toggleBan = (account: string) => {
    setEntries((prev) => prev.map((e) => e.account === account ? { ...e, banned: !e.banned } : e));
  };

  const toggleFlag = (account: string) => {
    setEntries((prev) => prev.map((e) => e.account === account ? { ...e, flagged: !e.flagged } : e));
  };

  const filtered = entries.filter((e) => {
    const matchSearch = e.trader.toLowerCase().includes(search.toLowerCase()) || e.account.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "flagged" && e.flagged) || (filter === "ghost" && e.ghostMode) || (filter === "banned" && e.banned);
    return matchSearch && matchFilter;
  });

  const rankColor = (rank: number) => rank === 1 ? "#ffbc7c" : rank === 2 ? "#a8c0b8" : rank === 3 ? "#cd7f32" : "#a8c0b8";

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Leaderboard Moderation</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Manage Ghost Mode (privacy) and ban accounts from public leaderboard</p>
        </div>
        <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(245,158,11,0.25)] text-[12px] text-[#f59e0b] hover:bg-[#f59e0b]/05 transition-all">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "LIVE RANKINGS", value: entries.filter((e) => !e.banned).length, icon: Trophy, color: "#00ffcc" },
          { label: "GHOST MODE", value: entries.filter((e) => e.ghostMode).length, icon: Ghost || EyeOff, color: "#a78bfa" },
          { label: "FLAGGED", value: entries.filter((e) => e.flagged).length, icon: Flag, color: "#ffbc7c" },
          { label: "BANNED", value: entries.filter((e) => e.banned).length, icon: Ban, color: "#ff6b6b" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[20px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-[rgba(245,158,11,0.15)] rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-[#a8c0b8]/50" />
          <input type="text" placeholder="Search traders or accounts..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-[12px] text-white placeholder:text-[#a8c0b8]/40 outline-none flex-1" />
        </div>
        <div className="flex items-center bg-white/[0.04] border border-[rgba(245,158,11,0.15)] rounded-xl p-1">
          {(["all", "flagged", "ghost", "banned"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b" } : { color: "#a8c0b8" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(245,158,11,0.08)]">
                {["Rank", "Trader", "Account", "P&L", "Win Rate", "Trades", "Avg R:R", "Ghost Mode", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase font-display">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry.account}
                  className="border-b border-[rgba(245,158,11,0.04)] hover:bg-white/[0.02] transition-colors"
                  style={entry.banned ? { opacity: 0.5 } : entry.flagged ? { background: "rgba(255,188,124,0.03)" } : {}}
                >
                  <td className="px-4 py-3">
                    <span className="text-[15px] font-bold font-display" style={{ color: rankColor(entry.rank) }}>#{entry.rank}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-semibold text-white">{entry.ghostMode ? "Anonymous Trader" : entry.trader}</span>
                        {entry.ghostMode && <EyeOff size={11} className="text-[#a78bfa]" />}
                        {entry.flagged && <Flag size={11} className="text-[#ffbc7c]" />}
                      </div>
                      <span className="text-[10px] text-[#a8c0b8]/50">{entry.traderId} · {entry.joinedDays} days</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-[#00ffcc]">{entry.account}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#34d399]">+{entry.pnl}%</td>
                  <td className="px-4 py-3 text-[12px] text-[#a8c0b8]">{entry.winRate}%</td>
                  <td className="px-4 py-3 text-[12px] text-[#a8c0b8]">{entry.trades}</td>
                  <td className="px-4 py-3 text-[12px] text-[#a8c0b8]">{entry.avgRR}:1</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleGhost(entry.account)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                      style={entry.ghostMode
                        ? { background: "#a78bfa20", border: "1px solid #a78bfa35", color: "#a78bfa" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a8c0b8" }}
                    >
                      {entry.ghostMode ? <><EyeOff size={10} /> Hidden</> : <><Eye size={10} /> Visible</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {entry.banned
                      ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b6b]/15 text-[#ff6b6b]">BANNED</span>
                      : entry.flagged
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffbc7c]/15 text-[#ffbc7c]">FLAGGED</span>
                        : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#34d399]/15 text-[#34d399]">ACTIVE</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBan(entry.account)}
                        className="text-[11px] font-medium transition-all"
                        style={{ color: entry.banned ? "#34d399" : "#ff6b6b" }}
                      >
                        {entry.banned ? "Unban" : "Ban"}
                      </button>
                      {!entry.banned && (
                        <button onClick={() => toggleFlag(entry.account)} className="text-[11px] font-medium transition-all" style={{ color: entry.flagged ? "#a8c0b8" : "#ffbc7c" }}>
                          {entry.flagged ? "Unflag" : "Flag"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#a78bfa]/06 border border-[#a78bfa]/15">
          <EyeOff size={15} className="text-[#a78bfa] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-[#a78bfa]">Ghost Mode</p>
            <p className="text-[11px] text-[#a8c0b8]/60 mt-0.5">Ghost Mode hides the trader from public leaderboard while preserving their ranking internally. Used for privacy requests from top performers.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#ff6b6b]/06 border border-[#ff6b6b]/15">
          <Ban size={15} className="text-[#ff6b6b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-[#ff6b6b]">Banning from Leaderboard</p>
            <p className="text-[11px] text-[#a8c0b8]/60 mt-0.5">Banning removes the account from all public and internal leaderboard views. Used for confirmed cheating on demo accounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
