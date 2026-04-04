"use client";

import { useState } from "react";
import { Medal, Trophy, TrendingUp, Eye, EyeOff, Download, RefreshCw, Search, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  country: string;
  accountType: string;
  accountSize: string;
  profitPct: number;
  profitAmount: string;
  maxDrawdown: number;
  winRate: number;
  tradingDays: number;
  visible: boolean;
}

const INITIAL_DATA: LeaderboardEntry[] = [
  { rank: 1, userId: "NF-4821", name: "Adebayo O.", country: "NG", accountType: "Funded", accountSize: "₦800K", profitPct: 18.4, profitAmount: "₦147,200", maxDrawdown: 3.1, winRate: 74, tradingDays: 28, visible: true },
  { rank: 2, userId: "NF-3312", name: "Chidi N.", country: "NG", accountType: "Funded", accountSize: "₦400K", profitPct: 16.7, profitAmount: "₦66,800", maxDrawdown: 4.2, winRate: 68, tradingDays: 30, visible: true },
  { rank: 3, userId: "NF-5501", name: "Michael T.", country: "GH", accountType: "Funded", accountSize: "$5K", profitPct: 15.9, profitAmount: "$795", maxDrawdown: 5.8, winRate: 71, tradingDays: 25, visible: true },
  { rank: 4, userId: "NF-2201", name: "Fatima B.", country: "NG", accountType: "Funded", accountSize: "₦200K", profitPct: 14.2, profitAmount: "₦28,400", maxDrawdown: 6.1, winRate: 65, tradingDays: 22, visible: true },
  { rank: 5, userId: "NF-6600", name: "Emeka W.", country: "NG", accountType: "Funded", accountSize: "₦800K", profitPct: 13.8, profitAmount: "₦110,400", maxDrawdown: 4.9, winRate: 69, tradingDays: 31, visible: true },
  { rank: 6, userId: "NF-1144", name: "Amara C.", country: "KE", accountType: "Funded", accountSize: "$10K", profitPct: 12.5, profitAmount: "$1,250", maxDrawdown: 7.2, winRate: 63, tradingDays: 20, visible: false },
  { rank: 7, userId: "NF-3399", name: "Jide L.", country: "NG", accountType: "Phase 2", accountSize: "₦400K", profitPct: 11.9, profitAmount: "₦47,600", maxDrawdown: 5.3, winRate: 61, tradingDays: 18, visible: true },
  { rank: 8, userId: "NF-7712", name: "Kwame A.", country: "GH", accountType: "Phase 1", accountSize: "$25K", profitPct: 11.1, profitAmount: "$2,775", maxDrawdown: 8.4, winRate: 58, tradingDays: 26, visible: true },
  { rank: 9, userId: "NF-8801", name: "Tunde F.", country: "NG", accountType: "Funded", accountSize: "₦200K", profitPct: 10.8, profitAmount: "₦21,600", maxDrawdown: 6.7, winRate: 60, tradingDays: 19, visible: false },
  { rank: 10, userId: "NF-9903", name: "Ngozi A.", country: "NG", accountType: "Phase 2", accountSize: "₦800K", profitPct: 10.2, profitAmount: "₦81,600", maxDrawdown: 7.9, winRate: 57, tradingDays: 24, visible: true },
];

const FLAG: Record<string, string> = { NG: "🇳🇬", GH: "🇬🇭", KE: "🇰🇪", ZA: "🇿🇦", TZ: "🇹🇿" };

type SortKey = "rank" | "profitPct" | "maxDrawdown" | "winRate";

export default function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<"monthly" | "alltime">("monthly");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleVisibility = (userId: string) => {
    setEntries((prev) =>
      prev.map((e) => e.userId === userId ? { ...e, visible: !e.visible } : e)
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = entries
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.userId.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mul;
    });

  const visibleCount = entries.filter((e) => e.visible).length;

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortAsc ? <ChevronUp size={12} className="text-[#00ffcc]" /> : <ChevronDown size={12} className="text-[#00ffcc]" />)
    : <ChevronUp size={12} className="opacity-20" />;

  const medalColor = (rank: number) => {
    if (rank === 1) return "text-[#ffd700]";
    if (rank === 2) return "text-[#c0c0c0]";
    if (rank === 3) return "text-[#cd7f32]";
    return "text-[#b9cbc2]/40";
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Medal size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Leaderboard Management</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Control which traders appear on the public leaderboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/08 transition-all">
            <RefreshCw size={12} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Ranked", value: entries.length.toString(), sub: "this month" },
          { label: "Visible on Board", value: visibleCount.toString(), sub: `of ${entries.length} traders` },
          { label: "Top Profit", value: "18.4%", sub: "NF-4821 Adebayo O." },
          { label: "Avg Win Rate", value: `${Math.round(entries.reduce((s, e) => s + e.winRate, 0) / entries.length)}%`, sub: "across all traders" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-display text-white">{s.value}</p>
            <p className="text-[11px] text-[#b9cbc2]/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] text-white placeholder:text-[#b9cbc2]/40 focus:border-[#00ffcc]/40"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["monthly", "alltime"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                period === p ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30" : "text-[#b9cbc2]/60 border border-transparent hover:border-[#00ffcc]/15"
              )}
            >
              {p === "monthly" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ffcc]/08 text-left">
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium w-14">
                <button onClick={() => handleSort("rank")} className="flex items-center gap-1">RANK <SortIcon k="rank" /></button>
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">TRADER</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">ACCOUNT</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <button onClick={() => handleSort("profitPct")} className="flex items-center gap-1">PROFIT % <SortIcon k="profitPct" /></button>
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">AMOUNT</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <button onClick={() => handleSort("maxDrawdown")} className="flex items-center gap-1">DRAWDOWN <SortIcon k="maxDrawdown" /></button>
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">
                <button onClick={() => handleSort("winRate")} className="flex items-center gap-1">WIN RATE <SortIcon k="winRate" /></button>
              </th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">DAYS</th>
              <th className="px-4 py-3 text-[11px] tracking-wider text-[#b9cbc2]/50 font-medium">VISIBLE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffcc]/05">
            {filtered.map((entry) => (
              <tr key={entry.userId} className={cn("hover:bg-[#00ffcc]/04 transition-all", !entry.visible && "opacity-50")}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={14} className={medalColor(entry.rank)} />
                    <span className="font-bold font-display text-white">{entry.rank}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-white font-medium text-sm">
                      <span className="mr-1">{FLAG[entry.country] || "🌍"}</span>
                      {entry.name}
                    </p>
                    <p className="text-[11px] text-[#b9cbc2]/50">{entry.userId}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full border",
                    entry.accountType === "Funded" ? "text-[#00ffcc] border-[#00ffcc]/25 bg-[#00ffcc]/08" : "text-[#60a5fa] border-[#60a5fa]/25 bg-[#60a5fa]/08"
                  )}>
                    {entry.accountType}
                  </span>
                  <p className="text-[11px] text-[#b9cbc2]/50 mt-0.5">{entry.accountSize}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[#00ffcc] font-bold font-display">+{entry.profitPct}%</span>
                </td>
                <td className="px-4 py-3.5 text-[#b9cbc2] text-sm">{entry.profitAmount}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-sm font-medium", entry.maxDrawdown > 7 ? "text-[#f59e0b]" : "text-[#b9cbc2]")}>
                    {entry.maxDrawdown}%
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#0b2f2d]">
                      <div
                        className="h-1.5 rounded-full bg-[#00ffcc]"
                        style={{ width: `${entry.winRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#b9cbc2]">{entry.winRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-[#b9cbc2] text-sm">{entry.tradingDays}</td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => toggleVisibility(entry.userId)}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-all border",
                      entry.visible
                        ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                        : "bg-[#0b2f2d]/60 border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/40 hover:text-white"
                    )}
                  >
                    {entry.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
