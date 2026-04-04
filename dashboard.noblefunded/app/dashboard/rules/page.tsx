"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
} from "lucide-react"

// ─────────────────────────────────────────────
// Reusable Accordion
// ─────────────────────────────────────────────
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: "rgba(13,148,136,0.07)",
        border: "1px solid rgba(94,234,212,0.12)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-foreground text-sm">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#5eead4] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground space-y-3 border-t border-[rgba(94,234,212,0.08)] pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Table helpers
// ─────────────────────────────────────────────
function RulesTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | React.ReactNode)[][]
}) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(94,234,212,0.1)" }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "rgba(13,148,136,0.12)", borderBottom: "1px solid rgba(94,234,212,0.1)" }}>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-muted-foreground font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(94,234,212,0.06)" : undefined }}
              className="hover:bg-[rgba(13,148,136,0.04)] transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AllowItem({ text, allowed }: { text: string; allowed: boolean }) {
  return (
    <div className="flex items-start gap-2">
      {allowed ? (
        <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
      )}
      <span className={allowed ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// NAIRA rules content
// ─────────────────────────────────────────────
function NairaRules() {
  return (
    <div className="space-y-4">
      {/* What is the Naira Challenge */}
      <Accordion title="What is the Naira Challenge Account?" defaultOpen={false}>
        <p>
          The Noble Funded Naira Challenge is a 2-phase evaluation designed for Nigerian traders. You trade in Naira on a simulated MT5 account. Once you pass both phases, you receive a fully funded Naira live account where you keep a percentage of all profits.
        </p>
        <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 mt-2" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
          <Info className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
          <span>Challenge fees are <strong className="text-foreground">non-refundable</strong>. Account sizes range from ₦200,000 to ₦3,000,000.</span>
        </div>
      </Accordion>

      {/* Profit Target */}
      <Accordion title="Profit Target" defaultOpen={true}>
        <p>
          <strong className="text-foreground">Phase 1:</strong> 10% of your account size.{" "}
          <strong className="text-foreground">Phase 2:</strong> 10% of your account size.
        </p>
        <p className="text-xs text-[#fbbf24]">Profit must be from closed trades. Floating/open profit does not count.</p>
        <RulesTable
          headers={["Account Size", "Phase 1 Target (10%)", "Phase 2 Target (10%)"]}
          rows={[
            ["₦200,000", "₦20,000", "₦20,000"],
            ["₦400,000", "₦40,000", "₦40,000"],
            ["₦600,000", "₦60,000", "₦60,000"],
            ["₦800,000", "₦80,000", "₦80,000"],
            ["₦1,000,000", "₦100,000", "₦100,000"],
            ["₦3,000,000", "₦300,000", "₦300,000"],
          ]}
        />
      </Accordion>

      {/* Maximum Drawdown */}
      <Accordion title="Maximum Drawdown" defaultOpen={true}>
        <p>
          Maximum drawdown on Naira accounts is <strong className="text-foreground">20%</strong>. If your equity drops below this level, your account is terminated.
        </p>
        <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
          <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
          <span>There is <strong className="text-foreground">NO daily drawdown</strong> on Naira accounts. Only the overall 20% maximum drawdown applies.</span>
        </div>
        <RulesTable
          headers={["Account Size", "Max Drawdown (20%)", "Account Terminates Below"]}
          rows={[
            ["₦200,000", "₦40,000", "₦160,000"],
            ["₦400,000", "₦80,000", "₦320,000"],
            ["₦600,000", "₦120,000", "₦480,000"],
            ["₦800,000", "₦160,000", "₦640,000"],
            ["₦1,000,000", "₦200,000", "₦800,000"],
            ["₦3,000,000", "₦600,000", "₦2,400,000"],
          ]}
        />
      </Accordion>

      {/* Minimum Trading Days */}
      <Accordion title="Minimum Trading Days">
        <p>
          <strong className="text-foreground">Minimum 1 trading day</strong> per phase. You only need to trade on 1 day to pass each phase — as long as you hit the profit target without breaking the drawdown rule.
        </p>
      </Accordion>

      {/* Time Limit */}
      <Accordion title="Time Limit">
        <p>
          <strong className="text-foreground">No time limit.</strong> Trade at your own pace. However, you must place at least one trade within <strong className="text-foreground">30 days</strong> or your account will be disabled.
        </p>
      </Accordion>

      {/* Profit Split — Two Tier */}
      <Accordion title="Profit Split — The Two-Tier System (IMPORTANT)" defaultOpen={true}>
        <p>
          On Naira accounts, you can make a maximum of <strong className="text-foreground">200%</strong> of your account size in total profit. The profit split works like this:
        </p>
        <ul className="space-y-1 mt-2 ml-2">
          <li><strong className="text-foreground">Tier 1</strong> — First 100% of profit = <strong className="text-[#4ade80]">80/20</strong> (you keep 80%)</li>
          <li><strong className="text-foreground">Tier 2</strong> — Any profit above 100%, up to the 200% cap = <strong className="text-[#fbbf24]">60/40</strong> (you keep 60%)</li>
        </ul>
        <p className="mt-2">It does not matter how much you make above the first 100% — whether it is ₦10,000 or ₦3,000,000 — everything above 100% is always split 60/40.</p>
        <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 mt-2" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.12)" }}>
          <AlertTriangle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
          <span>Anything above 200% is <strong className="text-foreground">not counted at all</strong>. After reaching 200%, the account is complete and closes.</span>
        </div>
        <p className="font-semibold text-foreground mt-4 mb-2">Example — ₦800,000 Account, full 200% profit (₦1,600,000):</p>
        <RulesTable
          headers={["Tier", "Profit Range", "Amount", "Split", "You Get"]}
          rows={[
            ["Tier 1", "₦0 → ₦800,000", "₦800,000", "80/20", <span className="text-[#4ade80] font-semibold">₦640,000</span>],
            ["Tier 2", "₦800,000 → ₦1,600,000", "₦800,000", "60/40", <span className="text-[#fbbf24] font-semibold">₦480,000</span>],
            [<span className="font-bold text-foreground">TOTAL</span>, "", "₦1,600,000", "", <span className="font-bold text-[#4ade80]">₦1,120,000</span>],
          ]}
        />
        <p className="font-semibold text-foreground mt-4 mb-2">Example — ₦3,000,000 Account, 120% profit (₦3,600,000):</p>
        <RulesTable
          headers={["Tier", "Profit Range", "Amount", "Split", "You Get"]}
          rows={[
            ["Tier 1", "₦0 → ₦3,000,000", "₦3,000,000", "80/20", <span className="text-[#4ade80] font-semibold">₦2,400,000</span>],
            ["Tier 2", "₦3,000,000 → ₦3,600,000", "₦600,000", "60/40", <span className="text-[#fbbf24] font-semibold">₦360,000</span>],
            [<span className="font-bold text-foreground">TOTAL</span>, "", "₦3,600,000", "", <span className="font-bold text-[#4ade80]">₦2,760,000</span>],
          ]}
        />
      </Accordion>

      {/* Payout */}
      <Accordion title="Payout Frequency &amp; Method">
        <div className="space-y-2">
          <p><strong className="text-foreground">Frequency:</strong> 24 hours (same day / next business day)</p>
          <p><strong className="text-foreground">Minimum Payout:</strong> None specified — request anytime</p>
          <p><strong className="text-foreground">Method:</strong> Nigerian bank transfer (NGN)</p>
          <p><strong className="text-foreground">KYC:</strong> Required before first payout</p>
        </div>
      </Accordion>

      {/* What is NOT allowed */}
      <Accordion title="What is NOT Allowed — Full Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Scalping under 3 minutes",
            "Expert Advisors (EAs) or trading bots",
            "Copy trading",
            "Weekend holding",
            "News trading",
            "Account sharing or third-party trading",
            "Latency arbitrage",
            "High-Frequency Trading (HFT)",
            "Grid trading",
            "Tick scalping",
            "Group trading",
            "Over-leveraging",
            "30+ days inactivity",
          ].map((item) => (
            <AllowItem key={item} text={item} allowed={false} />
          ))}
        </div>
      </Accordion>

      {/* What IS allowed */}
      <Accordion title="What IS Allowed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Manual trading only",
            "Swing trading",
            "Day trading",
            "Scalping (3+ minutes)",
            "Hedging (within the same account)",
            "All instruments (Forex, Gold, Indices, Crypto, etc.)",
            "No consistency rule",
            "No time limit",
            "No daily drawdown",
            "24-hour payouts",
          ].map((item) => (
            <AllowItem key={item} text={item} allowed={true} />
          ))}
        </div>
      </Accordion>

      {/* Quick Reference */}
      <Accordion title="Quick Reference Table" defaultOpen={true}>
        <RulesTable
          headers={["Rule", "Details"]}
          rows={[
            ["Account Sizes", "₦200,000 — ₦3,000,000"],
            ["Challenge Fee", "₦10,000 — ₦190,000 (non-refundable)"],
            ["Evaluation", "2 Phases (10% / 10%)"],
            ["Daily Drawdown", <span className="text-[#4ade80] font-semibold">None</span>],
            ["Maximum Drawdown", "20% (static)"],
            ["Minimum Trading Days", "1 per phase"],
            ["Time Limit", "None (30-day inactivity rule)"],
            ["Profit Split Tier 1", "80/20 (first 100% of account size)"],
            ["Profit Split Tier 2", "60/40 (100%–200% of account size)"],
            ["Max Profit Cap", "200% of account size"],
            ["Payout Frequency", "24 hours"],
            ["Payout Method", "NGN bank transfer"],
            ["EAs / Bots", <span className="text-[#f87171]">NOT allowed</span>],
            ["News Trading", <span className="text-[#f87171]">NOT allowed</span>],
            ["Weekend Holding", <span className="text-[#f87171]">NOT allowed</span>],
            ["Copy Trading", <span className="text-[#f87171]">NOT allowed</span>],
            ["KYC", "Required before first payout"],
            ["Inactivity", "Disabled after 30 days"],
            ["Leverage", "Up to 1:100"],
            ["Consistency Rule", "Not Applied"],
            ["Refund", <span className="text-[#f87171]">Non-refundable</span>],
          ]}
        />
      </Accordion>
    </div>
  )
}

// ─────────────────────────────────────────────
// DOLLAR rules content
// ─────────────────────────────────────────────
function DollarRules() {
  return (
    <div className="space-y-4">
      {/* What is the Dollar Challenge */}
      <Accordion title="What is the Dollar Challenge Account?" defaultOpen={false}>
        <p>
          The Noble Funded Dollar Challenge is a 2-phase evaluation for traders who want to trade in USD. You trade on a simulated MT5 account. Once you pass both phases, you receive a fully funded Dollar live account where you keep up to 90% of all profits with no profit cap.
        </p>
        <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 mt-2" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
          <Info className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
          <span>All Dollar challenge fees are <strong className="text-foreground">non-refundable</strong>. No exceptions. Account sizes range from $5,000 to $200,000.</span>
        </div>
      </Accordion>

      {/* Profit Target */}
      <Accordion title="Profit Target" defaultOpen={true}>
        <p>
          <strong className="text-foreground">Phase 1:</strong> 10% of your account size.{" "}
          <strong className="text-foreground">Phase 2:</strong> 5% of your account size.
        </p>
        <p className="text-xs text-[#5eead4]">Profit must be from closed trades. Floating profit does not count.</p>
        <RulesTable
          headers={["Account Size", "Phase 1 Target (10%)", "Phase 2 Target (5%)"]}
          rows={[
            ["$5,000", "$500", "$250"],
            ["$10,000", "$1,000", "$500"],
            ["$25,000", "$2,500", "$1,250"],
            ["$50,000", "$5,000", "$2,500"],
            ["$100,000", "$10,000", "$5,000"],
            ["$200,000", "$20,000", "$10,000"],
          ]}
        />
      </Accordion>

      {/* Daily Drawdown */}
      <Accordion title="Daily Drawdown" defaultOpen={true}>
        <p>
          <strong className="text-foreground">3%</strong> of your account balance at the start of each trading day (00:00 server time).
        </p>
        <p className="mt-1">Example: $50,000 account starts the day at $52,000. Daily limit = $1,560 (3% of $52,000). If equity drops to $50,440, account is terminated.</p>
        <p className="mt-1">Both realised and unrealised losses count. Resets daily.</p>
        <RulesTable
          headers={["Account Size", "Daily Drawdown (3%)", "Example Balance Needed"]}
          rows={[
            ["$5,000", "$150", "$4,850"],
            ["$10,000", "$300", "$9,700"],
            ["$25,000", "$750", "$24,250"],
            ["$50,000", "$1,500", "$48,500"],
            ["$100,000", "$3,000", "$97,000"],
            ["$200,000", "$6,000", "$194,000"],
          ]}
        />
      </Accordion>

      {/* Maximum Drawdown */}
      <Accordion title="Maximum Drawdown" defaultOpen={true}>
        <p>
          <strong className="text-foreground">10%</strong> of your initial account balance. Static/fixed — does NOT trail.
        </p>
        <RulesTable
          headers={["Account Size", "Max Drawdown (10%)", "Account Terminates Below"]}
          rows={[
            ["$5,000", "$500", "$4,500"],
            ["$10,000", "$1,000", "$9,000"],
            ["$25,000", "$2,500", "$22,500"],
            ["$50,000", "$5,000", "$45,000"],
            ["$100,000", "$10,000", "$90,000"],
            ["$200,000", "$20,000", "$180,000"],
          ]}
        />
      </Accordion>

      {/* Minimum Trading Days */}
      <Accordion title="Minimum Trading Days">
        <div className="space-y-1">
          <p><strong className="text-foreground">Phase 1:</strong> Minimum <strong className="text-foreground">3 trading days</strong></p>
          <p><strong className="text-foreground">Phase 2:</strong> Minimum <strong className="text-foreground">3 trading days</strong></p>
          <p><strong className="text-foreground">Funded Account:</strong> No minimum</p>
        </div>
      </Accordion>

      {/* Time Limit */}
      <Accordion title="Time Limit">
        <p>
          <strong className="text-foreground">No time limit.</strong> You must place at least one trade every <strong className="text-foreground">30 days</strong> to keep the account active.
        </p>
      </Accordion>

      {/* Profit Split */}
      <Accordion title="Profit Split" defaultOpen={true}>
        <div className="space-y-2">
          <p><strong className="text-foreground">Standard:</strong> <span className="text-[#4ade80] font-semibold">80% to you / 20% to Noble Funded</span></p>
          <p><strong className="text-foreground">After Scaling:</strong> Up to <span className="text-[#5eead4] font-semibold">90% to you / 10% to Noble Funded</span></p>
          <p>There is <strong className="text-foreground">no profit cap</strong> on Dollar accounts. Trade as long as you maintain the rules.</p>
        </div>
      </Accordion>

      {/* Scaling Plan */}
      <Accordion title="Scaling Plan">
        <div className="space-y-2">
          <p>Grow your funded account every <strong className="text-foreground">4 months</strong> by <strong className="text-foreground">25%</strong> of the account size, up to a maximum of <strong className="text-foreground">$200,000</strong>.</p>
          <p>Requirements to qualify for scaling:</p>
          <ul className="space-y-1 ml-2 mt-1">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />Average at least 10% profit over the 4-month period</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />No rule violations during the period</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />Profit split reaches 90/10 after first successful scale</li>
          </ul>
        </div>
      </Accordion>

      {/* Payout */}
      <Accordion title="Payout Frequency &amp; Method">
        <div className="space-y-2">
          <p><strong className="text-foreground">Frequency:</strong> Bi-Weekly (every 2 weeks)</p>
          <p><strong className="text-foreground">Minimum Payout:</strong> $50</p>
          <p><strong className="text-foreground">Methods:</strong> Cryptocurrency (USDT), Bank transfer (USD)</p>
          <p><strong className="text-foreground">KYC:</strong> Required before first payout</p>
        </div>
      </Accordion>

      {/* No Copy Trading */}
      <Accordion title="No Copy Trading">
        <p>
          Copy trading is strictly prohibited on all Noble Funded accounts (both Challenge and Funded). Using copy trading services, signal providers, or mirroring trades from another account will result in immediate termination.
        </p>
      </Accordion>

      {/* KYC Verification */}
      <Accordion title="KYC Verification">
        <p>
          You must complete KYC (Know Your Customer) verification before your first payout can be processed. KYC involves submitting a valid government-issued ID and proof of address. This is a one-time requirement.
        </p>
      </Accordion>

      {/* Refund Policy */}
      <Accordion title="Refund Policy">
        <p>
          All Dollar challenge fees are <strong className="text-foreground">non-refundable</strong>. No exceptions.
        </p>
      </Accordion>

      {/* What is NOT allowed */}
      <Accordion title="What is NOT Allowed — Full Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Expert Advisors (EAs) or trading bots (Challenge + Funded)",
            "Copy trading (Challenge + Funded)",
            "News trading (Challenge + Funded)",
            "Weekend holding (Challenge + Funded)",
            "Account sharing or third-party trading",
            "Latency arbitrage",
            "High-Frequency Trading (HFT)",
            "Grid trading",
            "Tick scalping",
            "Group trading",
            "Over-leveraging",
            "30+ days inactivity",
          ].map((item) => (
            <AllowItem key={item} text={item} allowed={false} />
          ))}
        </div>
      </Accordion>

      {/* What IS allowed */}
      <Accordion title="What IS Allowed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Manual trading only",
            "Scalping (normal, not tick scalping)",
            "Swing trading (close before weekend)",
            "Day trading",
            "Hedging (within the same account)",
            "All instruments",
            "No consistency rule",
            "No time limit",
            "No profit cap",
            "Scaling up to $200,000",
          ].map((item) => (
            <AllowItem key={item} text={item} allowed={true} />
          ))}
        </div>
      </Accordion>

      {/* Quick Reference */}
      <Accordion title="Quick Reference Table" defaultOpen={true}>
        <RulesTable
          headers={["Rule", "Details"]}
          rows={[
            ["Account Sizes", "$5,000 — $200,000"],
            ["Challenge Fee", "$29.99 — $749.99 (non-refundable)"],
            ["Evaluation", "2 Phases (10% / 5%)"],
            ["Daily Drawdown", "3%"],
            ["Maximum Drawdown", "10% (static)"],
            ["Minimum Trading Days", "3 per phase"],
            ["Time Limit", "None (30-day inactivity rule)"],
            ["Maximum Profit", <span className="text-[#4ade80] font-semibold">No cap</span>],
            ["Profit Split", "80/20 (scaling to 90/10)"],
            ["Minimum Payout", "$50"],
            ["Payout Frequency", "Bi-Weekly (every 2 weeks)"],
            ["Payout Method", "USDT / Bank transfer (USD)"],
            ["EAs / Bots", <span className="text-[#f87171]">NOT allowed</span>],
            ["News Trading", <span className="text-[#f87171]">NOT allowed</span>],
            ["Weekend Holding", <span className="text-[#f87171]">NOT allowed</span>],
            ["Copy Trading", <span className="text-[#f87171]">NOT allowed</span>],
            ["KYC", "Before first payout"],
            ["Inactivity", "Disabled after 30 days"],
            ["Leverage", "Up to 1:100"],
            ["Consistency Rule", "Not Applied"],
            ["Scaling", "25% every 4 months, up to $200K"],
            ["Refund", <span className="text-[#f87171]">Non-refundable</span>],
          ]}
        />
      </Accordion>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function RulesPage() {
  const [tab, setTab] = useState<"naira" | "dollar">("naira")

  return (
    <DashboardShell title="Rules" subtitle="Trading rules and guidelines for all account types">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Tab switcher */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(94,234,212,0.12)" }}
          >
            <button
              onClick={() => setTab("naira")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
                tab === "naira"
                  ? "bg-[rgba(251,191,36,0.2)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Naira Rules ₦
            </button>
            <button
              onClick={() => setTab("dollar")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
                tab === "dollar"
                  ? "bg-[rgba(20,184,166,0.2)] text-[#5eead4] border border-[rgba(94,234,212,0.3)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dollar Rules $
            </button>
          </div>

          {/* Key difference callout */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground"
            style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.1)" }}
          >
            <Info className="w-3.5 h-3.5 text-[#5eead4] shrink-0" />
            {tab === "naira"
              ? "No daily drawdown · 20% max drawdown · 80/20 then 60/40 split · 24h payouts"
              : "3% daily drawdown · 10% max drawdown · 80/20 split (up to 90/10) · Bi-weekly payouts"}
          </div>
        </div>

        {/* Account type badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider",
              tab === "naira"
                ? "bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border border-[rgba(251,191,36,0.2)]"
                : "bg-[rgba(20,184,166,0.12)] text-[#5eead4] border border-[rgba(94,234,212,0.2)]"
            )}
          >
            {tab === "naira" ? "Naira Account Rules" : "Dollar Account Rules"}
          </span>
          <span className="text-xs text-muted-foreground">
            {tab === "naira"
              ? "₦200,000 – ₦3,000,000 account sizes"
              : "$5,000 – $200,000 account sizes"}
          </span>
        </div>

        {/* Rules content */}
        {tab === "naira" ? <NairaRules /> : <DollarRules />}
      </div>
    </DashboardShell>
  )
}
