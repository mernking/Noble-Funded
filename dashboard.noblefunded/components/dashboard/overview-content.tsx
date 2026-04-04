"use client"

import { useState } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight,
  Trophy,
  ShoppingCart,
  MoreHorizontal,
  Wallet,
} from "lucide-react"
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
  Cell,
} from "recharts"
import { mockAccounts, mockUser, formatCurrency } from "@/lib/data"
import { cn } from "@/lib/utils"

// Naira equity curve
const nairaEquityData = [
  { date: "25 Feb", balance: 800800 },
  { date: "", balance: 812000 },
  { date: "", balance: 808000 },
  { date: "4 Mar", balance: 820000 },
  { date: "", balance: 830000 },
  { date: "", balance: 825000 },
  { date: "11 Mar", balance: 840000 },
  { date: "", balance: 848000 },
  { date: "", balance: 852000 },
  { date: "18 Mar", balance: 855000 },
  { date: "", balance: 858000 },
  { date: "", balance: 860000 },
  { date: "23 Mar", balance: 860000 },
]

// Dollar equity curve
const dollarEquityData = [
  { date: "25 Feb", balance: 10200 },
  { date: "", balance: 10350 },
  { date: "", balance: 10280 },
  { date: "4 Mar", balance: 10420 },
  { date: "", balance: 10500 },
  { date: "", balance: 10460 },
  { date: "11 Mar", balance: 10550 },
  { date: "", balance: 10590 },
  { date: "", balance: 10620 },
  { date: "18 Mar", balance: 10600 },
  { date: "", balance: 10615 },
  { date: "", balance: 10620 },
  { date: "23 Mar", balance: 10620 },
]

const nairaPnlData = [
  { month: "Oct", profit: 5.2 },
  { month: "Nov", profit: 8.1 },
  { month: "Dec", profit: -2.3 },
  { month: "Jan", profit: 11.4 },
  { month: "Feb", profit: 7.5 },
  { month: "Mar", profit: 4.2 },
]

const dollarPnlData = [
  { month: "Oct", profit: 3.1 },
  { month: "Nov", profit: 5.4 },
  { month: "Dec", profit: 1.8 },
  { month: "Jan", profit: 4.2 },
  { month: "Feb", profit: 6.2 },
  { month: "Mar", profit: 2.0 },
]

function StatCard({
  label,
  sub,
  value,
  icon: Icon,
  watermarkText,
  isNaira = true,
}: {
  label: string
  sub: string
  value: string
  icon: React.ElementType
  watermarkText?: string
  isNaira?: boolean
}) {
  return (
    <div className="glass-card relative overflow-hidden p-5 flex flex-col gap-3 hover:border-[rgba(20,184,166,0.35)] transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg" style={{ background: "rgba(13,148,136,0.14)", border: "1px solid rgba(94,234,212,0.18)" }}>
          <Icon className="w-4 h-4 text-[#5eead4]" />
        </div>
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        <p className="text-xs text-[#5eead4]/60 mt-0.5">{sub}</p>
      </div>
      {watermarkText && (
        <div
          className="absolute right-3 bottom-0 select-none pointer-events-none font-black text-[#14b8a6]/[0.08]"
          style={{ fontSize: "80px", lineHeight: 1, letterSpacing: "-4px" }}
        >
          {watermarkText}
        </div>
      )}
    </div>
  )
}

function ProgressBar({ pct, danger }: { pct: number; danger?: boolean }) {
  return (
    <div className="h-[5px] rounded-full bg-[rgba(20,184,166,0.1)] overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700", danger ? "bg-gradient-to-r from-[#7f1d1d] to-[#ef4444]" : "bg-gradient-to-r from-[#0d9488] to-[#5eead4]")}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  )
}

function AccountCard({ account }: { account: typeof mockAccounts[0] }) {
  const isFailed = account.status === "failed"
  const isFunded = account.status === "funded"
  const isNaira = account.currency === "NGN"
  const isPhase1 = account.status === "challenge_phase1"
  const isPhase2 = account.status === "challenge_phase2"

  const profitPct = Math.min(100, (Math.abs(account.currentProfit) / account.profitTarget) * 100)
  const drawdownPct = Math.min(100, (account.currentOverallDrawdown / account.maxOverallDrawdown) * 100)

  return (
    <div className={cn("relative overflow-hidden p-5 flex flex-col gap-4 transition-all duration-200 hover:translate-y-[-2px]", isFailed ? "glass-card-red" : "glass-card hover:border-[rgba(20,184,166,0.35)]")}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", isNaira ? "badge-naira" : "badge-dollar")}>
            {isNaira ? "N NAIRA" : "$ DOLLAR"}
          </span>
          {isFunded && <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.25)]">Funded</span>}
          {isPhase1 && <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.25)]">Phase 1</span>}
          {isPhase2 && <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.25)]">Phase 2</span>}
          {isFailed && <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(239,68,68,0.2)] text-[#f87171] border border-[rgba(239,68,68,0.3)]">Failed</span>}
        </div>
        <div className="text-right">
          <p className={cn("text-lg font-bold", isFailed ? "text-[#f87171]" : "text-foreground")}>
            {formatCurrency(account.balance, account.currency)}
          </p>
          <p className={cn("text-xs font-semibold", account.currentProfit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
            {account.currentProfit >= 0 ? "+" : ""}{account.currentProfit.toFixed(2)}%
          </p>
        </div>
      </div>

      <div>
        <p className="font-bold text-foreground text-sm">{account.accountNumber}</p>
        <p className="text-xs text-muted-foreground mt-0.5">MT5 · {account.server}</p>
      </div>

      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Profit Target</span>
            <span className="text-foreground font-medium">{Math.abs(account.currentProfit).toFixed(2)}% / {account.profitTarget}%</span>
          </div>
          <ProgressBar pct={profitPct} danger={isFailed} />
        </div>
        {/* Dollar accounts show daily drawdown bar */}
        {!isNaira && (
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">Daily Drawdown</span>
              <span className={cn("font-medium", account.currentDailyDrawdown > account.maxDailyDrawdown * 0.7 ? "text-[#f87171]" : "text-foreground")}>
                {account.currentDailyDrawdown.toFixed(2)}% / {account.maxDailyDrawdown}%
              </span>
            </div>
            <ProgressBar pct={Math.min(100, (account.currentDailyDrawdown / account.maxDailyDrawdown) * 100)} danger={account.currentDailyDrawdown >= account.maxDailyDrawdown} />
          </div>
        )}
        {isNaira && (
          <p className="text-[10px] text-[#4ade80] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
            No daily drawdown (Naira account)
          </p>
        )}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Max Drawdown ({account.maxOverallDrawdown}%)</span>
            <span className={cn("font-medium", isFailed ? "text-[#f87171]" : drawdownPct > 60 ? "text-[#fbbf24]" : "text-foreground")}>{account.currentOverallDrawdown.toFixed(2)}% / {account.maxOverallDrawdown}%</span>
          </div>
          <ProgressBar pct={drawdownPct} danger={isFailed} />
        </div>
      </div>

      <div className="mt-auto">
        {isFunded ? (
          <Link href="/dashboard/payouts" className="w-full flex items-center justify-center text-xs font-semibold py-2.5 rounded-lg transition-all bg-[rgba(20,184,166,0.15)] border border-[rgba(20,184,166,0.25)] text-[#5eead4] hover:bg-[rgba(20,184,166,0.25)]">
            Request Payout
          </Link>
        ) : (
          <Link href={`/dashboard/accounts/${account.id}`} className={cn("w-full flex items-center justify-center gap-1 text-xs font-semibold py-2.5 rounded-lg transition-all", isFailed ? "bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#f87171] hover:bg-[rgba(239,68,68,0.18)]" : "bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)] text-[#5eead4] hover:bg-[rgba(20,184,166,0.2)]")}>
            View Details <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </div>
  )
}

export function OverviewContent() {
  const [accountView, setAccountView] = useState<"naira" | "dollar">("naira")

  const nairaAccounts = mockAccounts.filter(a => a.type === "naira")
  const dollarAccounts = mockAccounts.filter(a => a.type === "dollar")
  const activeNaira = nairaAccounts.filter(a => a.status !== "failed")
  const activeDollar = dollarAccounts.filter(a => a.status !== "failed")
  const fundedNaira = nairaAccounts.filter(a => a.status === "funded")
  const fundedDollar = dollarAccounts.filter(a => a.status === "funded")

  const isNaira = accountView === "naira"
  const equityData = isNaira ? nairaEquityData : dollarEquityData
  const pnlData = isNaira ? nairaPnlData : dollarPnlData
  const displayAccounts = isNaira ? nairaAccounts : dollarAccounts
  const fundedList = isNaira ? fundedNaira : fundedDollar
  const activeList = isNaira ? activeNaira : activeDollar

  const totalPayouts = isNaira ? 1000000 : 0
  const bestProfit = isNaira ? "+7.5%" : "+6.2%"
  const bestAccountLabel = isNaira ? "NF-NG-800K (Funded)" : "NF-USD-10K (Phase 2)"
  const equityTicker = isNaira ? (v: number) => `₦${(v / 1000).toFixed(0)}k` : (v: number) => `$${(v / 1000).toFixed(1)}k`

  return (
    <div className="p-5 lg:p-6 space-y-5 page-fade-in">

      {/* Welcome Banner with Account Type Toggle */}
      <div className="glass-card px-6 py-5 border-[rgba(20,184,166,0.25)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(20,184,166,0.07) 0%, transparent 60%)" }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5eead4] mb-1">Welcome Back</p>
            <h2 className="text-xl font-bold text-foreground">Good morning, {mockUser.name.split(" ")[0]}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              You have{" "}
              <span className="text-foreground font-semibold">{activeNaira.length} active Naira account{activeNaira.length !== 1 ? "s" : ""}</span>
              {" "}and{" "}
              <span className="text-foreground font-semibold">{activeDollar.length} active Dollar account{activeDollar.length !== 1 ? "s" : ""}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Account type toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(94,234,212,0.12)" }}>
              <button
                onClick={() => setAccountView("naira")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  accountView === "naira"
                    ? "bg-[rgba(251,191,36,0.2)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Naira ₦
              </button>
              <button
                onClick={() => setAccountView("dollar")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  accountView === "dollar"
                    ? "bg-[rgba(20,184,166,0.2)] text-[#5eead4] border border-[rgba(94,234,212,0.3)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dollar $
              </button>
            </div>
            <Link
              href="https://noble-frontend-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#001e28] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all shadow-lg shrink-0"
              style={{ boxShadow: "0 0 20px rgba(94,234,212,0.3)" }}
            >
              <ShoppingCart size={15} />
              Buy New Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Account type indicator */}
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider", isNaira ? "badge-naira" : "badge-dollar")}>
          {isNaira ? "Naira Account Overview" : "Dollar Account Overview"}
        </span>
        <span className="text-xs text-muted-foreground">
          {displayAccounts.length} account{displayAccounts.length !== 1 ? "s" : ""} · {fundedList.length} funded
        </span>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Payouts"
          sub={isNaira ? "Naira bank transfers · 24h" : "USDT / USD wire · bi-weekly"}
          value={isNaira ? "₦1,000,000" : "$0.00"}
          icon={DollarSign}
          watermarkText={isNaira ? "NGN" : "USD"}
          isNaira={isNaira}
        />
        <StatCard
          label="Active Accounts"
          sub={`${displayAccounts.length} total ${isNaira ? "Naira" : "Dollar"} accounts`}
          value={String(activeList.length)}
          icon={Wallet}
          watermarkText={String(activeList.length)}
          isNaira={isNaira}
        />
        <StatCard
          label="Best Profit"
          sub={bestAccountLabel}
          value={bestProfit}
          icon={TrendingUp}
          isNaira={isNaira}
        />
        <StatCard
          label="Profit Split"
          sub={isNaira ? "Tier 1: 80/20 · Tier 2: 60/40 (up to 200%)" : "80/20 standard · up to 90/10 scaling"}
          value={isNaira ? "80% / 60%" : "80%"}
          icon={Trophy}
          isNaira={isNaira}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Equity Curve */}
        <div className="lg:col-span-3 glass-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-sm">Equity Curve</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isNaira ? "NF-NG-800K (Funded)" : "NF-USD-10K (Phase 2)"}
                &nbsp;·&nbsp;Last 30 days
              </p>
            </div>
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", isNaira ? "text-[#fbbf24] bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.2)]" : "text-[#4ade80] bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.2)]")}>
              {isNaira ? "+7.5%" : "+6.2%"}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={equityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isNaira ? "#fbbf24" : "#14b8a6"} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={isNaira ? "#fbbf24" : "#14b8a6"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.07)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#5eead4", opacity: 0.6 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#5eead4", opacity: 0.6 }} tickLine={false} axisLine={false} tickFormatter={equityTicker} domain={["dataMin - 5000", "dataMax + 5000"]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="glass-card px-3 py-2 text-xs">
                      <p className="text-[#5eead4] font-medium mb-0.5">{label}</p>
                      <p className="text-foreground font-bold">
                        {isNaira ? `₦${(payload[0].value as number).toLocaleString()}` : `$${(payload[0].value as number).toLocaleString()}`}
                      </p>
                    </div>
                  )
                }}
              />
              <Area type="monotone" dataKey="balance" stroke={isNaira ? "#fbbf24" : "#14b8a6"} strokeWidth={2} fill="url(#eqGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly P&L */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="mb-4">
            <h3 className="font-bold text-foreground text-sm">Monthly P&amp;L</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={pnlData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.07)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#5eead4", opacity: 0.6 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#5eead4", opacity: 0.6 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const val = payload[0].value as number
                  return (
                    <div className="glass-card px-3 py-2 text-xs">
                      <p className="text-[#5eead4] font-medium mb-0.5">{label}</p>
                      <p className={cn("font-bold", val >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>{val >= 0 ? "+" : ""}{val}%</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="profit" radius={[3, 3, 0, 0]}>
                {pnlData.map((entry, i) => (
                  <Cell key={i} fill={entry.profit >= 0 ? (isNaira ? "#d97706" : "#0d9488") : "#b91c1c"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Accounts Grid — filtered by selected type */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">
            {isNaira ? "My Naira Accounts" : "My Dollar Accounts"}
          </h3>
          <Link href="/dashboard/accounts" className="text-xs text-[#5eead4] hover:text-[#2dd4bf] flex items-center gap-1 transition-colors">
            View All <ChevronRight size={12} />
          </Link>
        </div>
        {displayAccounts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No {isNaira ? "Naira" : "Dollar"} accounts yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Purchase a challenge to get started.</p>
            <Link
              href="https://noble-frontend-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#001e28] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all"
            >
              <ShoppingCart size={14} />
              Buy {isNaira ? "Naira" : "Dollar"} Challenge
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {displayAccounts.map((acc) => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
