"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/shell"
import {
  mockAccounts,
  formatCurrency,
  getStatusLabel,
  getStatusClass,
  generateEquityCurve,
} from "@/lib/data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShoppingCart,
  Target,
  Shield,
  DollarSign,
  BarChart2,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const instrumentData = [
  { name: "XAUUSD", value: 38, fill: "#a7ffeb" },
  { name: "EURUSD", value: 22, fill: "#14655b" },
  { name: "NAS100", value: 18, fill: "#4dd9b8" },
  { name: "US30", value: 12, fill: "#ffd166" },
  { name: "Other", value: 10, fill: "#7ab8ac" },
]

function RuleRow({ label, status, desc }: { label: string; status: "pass" | "fail" | "warn"; desc: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[rgba(167,255,235,0.06)] last:border-0">
      <div className="flex items-center gap-2">
        {status === "pass" ? (
          <CheckCircle2 size={15} className="text-[#4ade80] shrink-0 mt-0.5" />
        ) : status === "fail" ? (
          <AlertTriangle size={15} className="text-[#f87171] shrink-0 mt-0.5" />
        ) : (
          <Clock size={15} className="text-[#fbbf24] shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-3",
        status === "pass" ? "badge-active" : status === "fail" ? "badge-failed" : "badge-challenge"
      )}>
        {status === "pass" ? "Pass" : status === "fail" ? "Fail" : "In Progress"}
      </span>
    </div>
  )
}

export default function AccountDetailPage() {
  const { id } = useParams()
  const account = mockAccounts.find((a) => a.id === id)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "trades">("overview")

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!account) {
    return (
      <DashboardShell title="Account Not Found">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Account not found.</p>
          <Link href="/dashboard/accounts" className="text-[#a7ffeb] mt-3 inline-block">
            Back to Accounts
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const equityData = generateEquityCurve(30, account.startingBalance, account.type === "naira" ? 0.025 : 0.022)
  const profitPct = Math.min(100, Math.max(0, (account.currentProfit / account.profitTarget) * 100))
  const drawdownPct = Math.min(100, (account.currentOverallDrawdown / account.maxOverallDrawdown) * 100)
  const dailyDDPct = Math.min(100, (account.currentDailyDrawdown / account.maxDailyDrawdown) * 100)

  const winningTrades = account.trades.filter((t) => t.profit > 0)
  const losingTrades = account.trades.filter((t) => t.profit <= 0)
  const winRate = ((winningTrades.length / account.trades.length) * 100).toFixed(1)
  const totalProfit = account.trades.reduce((s, t) => s + t.profit, 0)
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((s, t) => s + t.profit, 0) / winningTrades.length : 0
  const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((s, t) => s + t.profit, 0) / losingTrades.length : 0

  return (
    <DashboardShell title={account.accountNumber} subtitle={`${account.type === "naira" ? "Naira" : "Dollar"} Account · ${account.platform}`}>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Back + Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/accounts"
              className="p-2 rounded-lg glass-card hover:border-[rgba(167,255,235,0.2)] transition-all text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", account.type === "naira" ? "badge-naira" : "badge-dollar")}>
                {account.type === "naira" ? "₦ NAIRA" : "$ DOLLAR"}
              </span>
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", getStatusClass(account.status))}>
                {account.status === "challenge_phase1" ? "Phase 1 Challenge" : account.status === "challenge_phase2" ? "Phase 2 Challenge" : getStatusLabel(account.status)}
              </span>
            </div>
          </div>
          {account.status === "funded" && (
            <Link
              href="/dashboard/payouts"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all"
            >
              <DollarSign size={15} />
              Request Payout
            </Link>
          )}
          {account.status === "failed" && (
            <Link
              href="https://noble-frontend-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#001e28] bg-[#ffd166] hover:bg-[#f5c842] transition-all"
            >
              <ShoppingCart size={15} />
              Buy New Challenge
            </Link>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(account.balance, account.currency)}</p>
            <p className={cn("text-xs font-medium mt-1", account.currentProfit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
              {account.currentProfit >= 0 ? "+" : ""}{account.currentProfit.toFixed(2)}%
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Starting Balance</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(account.startingBalance, account.currency)}</p>
            <p className="text-xs text-muted-foreground mt-1">{account.profitSplit}% Profit Split</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-xl font-bold text-[#4ade80]">{winRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{winningTrades.length} / {account.trades.length} trades</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
            <p className={cn("text-xl font-bold", totalProfit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
              {totalProfit >= 0 ? "+" : ""}{formatCurrency(Math.abs(totalProfit), account.currency)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{account.trades.length} closed trades</p>
          </div>
        </div>

        {/* MT5 Credentials */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink size={16} className="text-[#a7ffeb]" />
            MT5 Account Credentials
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Login", value: account.login, key: "login" },
              { label: "Password", value: account.password, key: "password", secret: true },
              { label: "Server", value: account.server, key: "server" },
              { label: "Platform", value: account.platform, key: "platform" },
            ].map((c) => (
              <div key={c.key} className="bg-[rgba(167,255,235,0.03)] rounded-lg p-3 border border-[rgba(167,255,235,0.06)]">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{c.label}</p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-mono font-semibold text-foreground truncate">
                    {c.secret && !showPassword ? "••••••••" : c.value}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    {c.secret && (
                      <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground p-0.5">
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    )}
                    <button onClick={() => copy(c.value, c.key)} className="text-muted-foreground hover:text-[#a7ffeb] p-0.5 transition-colors">
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                {copied === c.key && <p className="text-[10px] text-[#a7ffeb] mt-1">Copied!</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
          {(["overview", "trades"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize",
                activeTab === tab ? "bg-[rgba(167,255,235,0.12)] text-[#a7ffeb]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "overview" ? "Overview & Rules" : "Trade History"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col */}
            <div className="lg:col-span-2 space-y-5">
              {/* Equity Chart */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-4">Equity Curve (30 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={equityData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a7ffeb" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#a7ffeb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} interval={6} />
                    <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => account.currency === "NGN" ? `₦${(v/1000).toFixed(0)}k` : `$${(v/1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      contentStyle={{ background: "#002b36", border: "1px solid rgba(167,255,235,0.15)", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: number) => [formatCurrency(v, account.currency), "Balance"]}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#a7ffeb" strokeWidth={2} fill="url(#areaGrad2)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Trading Rules */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Shield size={16} className="text-[#a7ffeb]" />
                  Challenge Rules Status
                </h3>
                <p className="text-xs text-muted-foreground mb-4">All rules must be met to advance to the next phase or receive a funded account.</p>
                <RuleRow
                  label={`Profit Target: ${account.profitTarget}%`}
                  status={account.currentProfit >= account.profitTarget ? "pass" : account.status === "failed" ? "fail" : "warn"}
                  desc={`Current: ${account.currentProfit.toFixed(2)}% — Need ${(account.profitTarget - Math.max(0, account.currentProfit)).toFixed(2)}% more`}
                />
                <RuleRow
                  label={`Daily Drawdown Limit: ${account.maxDailyDrawdown}%`}
                  status={account.status === "failed" && account.currentDailyDrawdown >= account.maxDailyDrawdown ? "fail" : "pass"}
                  desc={`Current: ${account.currentDailyDrawdown.toFixed(2)}% — Limit: ${account.maxDailyDrawdown}%`}
                />
                <RuleRow
                  label={`Max Overall Drawdown: ${account.maxOverallDrawdown}%`}
                  status={account.currentOverallDrawdown >= account.maxOverallDrawdown ? "fail" : "pass"}
                  desc={`Current: ${account.currentOverallDrawdown.toFixed(2)}% — Limit: ${account.maxOverallDrawdown}%`}
                />
                <RuleRow
                  label="No Minimum Trading Days"
                  status="pass"
                  desc="Noble Funded has no minimum trading day requirements — trade at your own pace."
                />
                <RuleRow
                  label="Expert Advisors (EAs) Allowed"
                  status="pass"
                  desc="All automated strategies and EAs are permitted on this account."
                />
                <RuleRow
                  label="Weekend Holding Allowed"
                  status="pass"
                  desc="You may hold positions over the weekend."
                />
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-5">
              {/* Progress meters */}
              <div className="glass-card p-5 space-y-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target size={16} className="text-[#a7ffeb]" />
                  Progress
                </h3>
                {[
                  { label: "Profit Target", current: account.currentProfit, max: account.profitTarget, pct: profitPct, color: "#a7ffeb", unit: "%" },
                  { label: "Daily Drawdown", current: account.currentDailyDrawdown, max: account.maxDailyDrawdown, pct: dailyDDPct, color: dailyDDPct > 70 ? "#f87171" : "#fbbf24", unit: "%" },
                  { label: "Max Drawdown", current: account.currentOverallDrawdown, max: account.maxOverallDrawdown, pct: drawdownPct, color: drawdownPct > 70 ? "#f87171" : "#fbbf24", unit: "%" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold" style={{ color: m.color }}>{m.current.toFixed(2)}{m.unit} / {m.max}{m.unit}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Instrument breakdown */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-[#a7ffeb]" />
                  Instruments Traded
                </h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={instrumentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {instrumentData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#002b36", border: "1px solid rgba(167,255,235,0.15)", borderRadius: "8px", fontSize: "11px" }}
                      formatter={(v: number) => [`${v}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {instrumentData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="ml-auto font-medium text-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade stats */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-4">Trade Statistics</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Trades", value: account.trades.length },
                    { label: "Win Rate", value: `${winRate}%`, color: "text-[#4ade80]" },
                    { label: "Avg Win", value: formatCurrency(avgWin, account.currency), color: "text-[#4ade80]" },
                    { label: "Avg Loss", value: formatCurrency(Math.abs(avgLoss), account.currency), color: "text-[#f87171]" },
                    { label: "Profit Factor", value: avgLoss !== 0 ? (Math.abs(avgWin / avgLoss)).toFixed(2) : "N/A" },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-sm border-b border-[rgba(167,255,235,0.05)] pb-2 last:border-0">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={cn("font-semibold", s.color || "text-foreground")}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[rgba(167,255,235,0.08)] flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Trade History</h3>
              <span className="text-xs text-muted-foreground">{account.trades.length} trades</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(167,255,235,0.06)]">
                    {["Ticket", "Symbol", "Type", "Lots", "Open", "Close", "Open Time", "P&L"].map((h) => (
                      <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {account.trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-[rgba(167,255,235,0.04)] hover:bg-[rgba(167,255,235,0.03)] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{trade.ticket}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{trade.symbol}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", trade.type === "buy" ? "badge-active" : "badge-failed")}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{trade.lots}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{trade.openPrice.toFixed(5)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{trade.closePrice.toFixed(5)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(trade.openTime).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className={cn("px-4 py-3 font-bold", trade.profit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
                        {trade.profit >= 0 ? "+" : ""}{formatCurrency(trade.profit, account.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
