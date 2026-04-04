"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import {
  mockAccounts,
  formatCurrency,
  generateEquityCurve,
  weeklyProfitData,
  monthlyProfitData,
  instrumentBreakdown,
} from "@/lib/data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Percent, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const allTrades = mockAccounts.flatMap((a) => a.trades.map((t) => ({ ...t, accountId: a.id, accountType: a.type })))

const equity30 = generateEquityCurve(30, 100000, 0.025)
const equity60 = generateEquityCurve(60, 100000, 0.022)

export default function StatisticsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [period, setPeriod] = useState<"7d" | "30d" | "60d">("30d")

  const trades = selectedAccount === "all"
    ? allTrades
    : allTrades.filter((t) => t.accountId === selectedAccount)

  const winTrades = trades.filter((t) => t.profit > 0)
  const lossTrades = trades.filter((t) => t.profit <= 0)
  const winRate = trades.length > 0 ? ((winTrades.length / trades.length) * 100).toFixed(1) : "0"
  const totalPnL = trades.reduce((s, t) => s + t.profit, 0)
  const avgWin = winTrades.length > 0 ? winTrades.reduce((s, t) => s + t.profit, 0) / winTrades.length : 0
  const avgLoss = lossTrades.length > 0 ? Math.abs(lossTrades.reduce((s, t) => s + t.profit, 0) / lossTrades.length) : 1
  const profitFactor = (avgLoss !== 0 ? avgWin / avgLoss : 0).toFixed(2)

  const equityData = period === "7d" ? equity30.slice(-7) : period === "30d" ? equity30 : equity60

  // Day of week analysis
  const dayPnL: Record<string, number[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
  trades.forEach((t) => {
    const day = new Date(t.closeTime).toLocaleDateString("en-US", { weekday: "short" })
    if (dayPnL[day]) dayPnL[day].push(t.profit)
  })
  const dayStats = Object.entries(dayPnL).map(([day, vals]) => ({
    day,
    avg: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
    count: vals.length,
  }))

  // Symbol performance
  const symbolPnL: Record<string, number> = {}
  trades.forEach((t) => {
    symbolPnL[t.symbol] = (symbolPnL[t.symbol] || 0) + t.profit
  })
  const symbolStats = Object.entries(symbolPnL)
    .map(([symbol, pnl]) => ({ symbol, pnl }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 7)

  return (
    <DashboardShell title="Statistics" subtitle="Analyse your trading performance in depth">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
            <button
              onClick={() => setSelectedAccount("all")}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", selectedAccount === "all" ? "bg-[#5eead4] text-[#071210]" : "text-muted-foreground hover:text-foreground")}
            >
              All Accounts
            </button>
            {mockAccounts.filter(a => a.status !== "failed").map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAccount(a.id)}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap", selectedAccount === a.id ? "bg-[rgba(20,184,166,0.18)] text-[#5eead4] border border-[rgba(94,234,212,0.2)]" : "text-muted-foreground hover:text-foreground")}
              >
                {a.accountNumber.split("-").slice(0, 3).join("-")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 glass-card rounded-lg ml-auto">
            {(["7d", "30d", "60d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", period === p ? "bg-[rgba(20,184,166,0.18)] text-[#5eead4] border border-[rgba(94,234,212,0.2)]" : "text-muted-foreground hover:text-foreground")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Win Rate", value: `${winRate}%`, icon: Percent, color: "text-[#4ade80]", bg: "bg-[rgba(74,222,128,0.08)]", trend: "up" as const },
            { label: "Total P&L", value: formatCurrency(Math.abs(totalPnL), "NGN"), icon: TrendingUp, color: totalPnL >= 0 ? "text-[#4ade80]" : "text-[#f87171]", bg: totalPnL >= 0 ? "bg-[rgba(74,222,128,0.08)]" : "bg-[rgba(248,113,113,0.08)]", trend: totalPnL >= 0 ? "up" as const : "down" as const },
            { label: "Profit Factor", value: profitFactor, icon: BarChart3, color: "text-[#a7ffeb]", bg: "bg-[rgba(167,255,235,0.08)]", trend: "up" as const },
            { label: "Total Trades", value: String(trades.length), icon: Activity, color: "text-[#ffd166]", bg: "bg-[rgba(255,209,102,0.08)]", trend: "neutral" as const },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg", s.bg)}>
                  <s.icon className={cn("w-4 h-4", s.color)} size={16} />
                </div>
                {s.trend !== "neutral" && (
                  s.trend === "up"
                    ? <TrendingUp size={13} className="text-[#4ade80]" />
                    : <TrendingDown size={13} className="text-[#f87171]" />
                )}
              </div>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Equity Curve */}
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="font-semibold text-foreground mb-1">Equity Curve</h3>
            <p className="text-xs text-muted-foreground mb-4">Account balance over time</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={equityData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="statsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7ffeb" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#a7ffeb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} interval={period === "7d" ? 1 : 6} />
                <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "rgba(7,18,17,0.9)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: "8px", fontSize: "12px", backdropFilter: "blur(16px)" }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Balance"]} />
                <Area type="monotone" dataKey="balance" stroke="#a7ffeb" strokeWidth={2.5} fill="url(#statsGrad)" dot={false} activeDot={{ r: 4, fill: "#a7ffeb" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Win/Loss Donut */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-1">Win / Loss Ratio</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribution of winning vs losing trades</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Wins", value: winTrades.length, fill: "#4ade80" },
                    { name: "Losses", value: lossTrades.length, fill: "#f87171" },
                  ]}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value"
                >
                  <Cell fill="#4ade80" />
                  <Cell fill="#f87171" />
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(7,18,17,0.9)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: "8px", fontSize: "11px", backdropFilter: "blur(16px)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-[#4ade80]">{winTrades.length}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#f87171]">{lossTrades.length}</p>
                <p className="text-xs text-muted-foreground">Losses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly P&L */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-1">Monthly P&L (%)</h3>
            <p className="text-xs text-muted-foreground mb-4">Return percentage per month</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyProfitData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: "rgba(7,18,17,0.9)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: "8px", fontSize: "12px", backdropFilter: "blur(16px)" }} formatter={(v: number) => [`${v}%`, "P&L"]} />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {monthlyProfitData.map((entry, i) => (
                    <Cell key={i} fill={entry.profit >= 0 ? "#0d9488" : "#b91c1c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Symbol P&L */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-1">P&L by Symbol</h3>
            <p className="text-xs text-muted-foreground mb-4">Best and worst performing instruments</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={symbolStats} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="symbol" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} width={55} />
                <Tooltip contentStyle={{ background: "rgba(7,18,17,0.9)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: "8px", fontSize: "12px", backdropFilter: "blur(16px)" }} />
                <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                  {symbolStats.map((s, i) => (
                    <Cell key={i} fill={s.pnl >= 0 ? "#0d9488" : "#b91c1c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of week analysis */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-1">Day of Week Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">Average P&L per trading day of the week</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dayStats} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(7,18,17,0.9)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: "8px", fontSize: "12px", backdropFilter: "blur(16px)" }} formatter={(v: number) => [`₦${v.toFixed(0)}`, "Avg P&L"]} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {dayStats.map((d, i) => (
                  <Cell key={i} fill={d.avg >= 0 ? "#a7ffeb" : "#f87171"} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed stats table */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            {[
              { label: "Total Trades", value: trades.length },
              { label: "Winning Trades", value: winTrades.length, color: "text-[#4ade80]" },
              { label: "Losing Trades", value: lossTrades.length, color: "text-[#f87171]" },
              { label: "Win Rate", value: `${winRate}%`, color: "text-[#4ade80]" },
              { label: "Avg Win", value: formatCurrency(avgWin, "NGN"), color: "text-[#4ade80]" },
              { label: "Avg Loss", value: formatCurrency(avgLoss, "NGN"), color: "text-[#f87171]" },
              { label: "Profit Factor", value: profitFactor },
              { label: "Total P&L", value: formatCurrency(Math.abs(totalPnL), "NGN"), color: totalPnL >= 0 ? "text-[#4ade80]" : "text-[#f87171]" },
              { label: "Biggest Win", value: formatCurrency(Math.max(...trades.map(t => t.profit), 0), "NGN"), color: "text-[#4ade80]" },
              { label: "Biggest Loss", value: formatCurrency(Math.abs(Math.min(...trades.map(t => t.profit), 0)), "NGN"), color: "text-[#f87171]" },
              { label: "Avg Trade Duration", value: "3h 42m" },
              { label: "Most Traded", value: "XAUUSD" },
            ].map((s) => (
              <div key={s.label} className="border-b border-[rgba(167,255,235,0.06)] pb-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-base font-bold mt-0.5", s.color || "text-foreground")}>{String(s.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
