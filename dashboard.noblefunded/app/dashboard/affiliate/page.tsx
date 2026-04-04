"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { mockAffiliate, formatCurrency, nairaChallengePricing, dollarChallengePricing } from "@/lib/data"
import {
  Copy,
  CheckCircle2,
  Users,
  DollarSign,
  Link2,
  ExternalLink,
  Clock,
  Zap,
  Gift,
  Trophy,
  Star,
  Medal,
  Crown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nairaTiers = [
  { label: "Bronze", icon: Medal, color: "text-[#cd7f32]", bg: "bg-[rgba(205,127,50,0.1)]", border: "border-[rgba(205,127,50,0.2)]", req: "10 referrals/mo", commission: "10%", bonus: "Standard rate" },
  { label: "Silver", icon: Star, color: "text-[#c0c0c0]", bg: "bg-[rgba(192,192,192,0.1)]", border: "border-[rgba(192,192,192,0.2)]", req: "25 referrals/mo", commission: "12%", bonus: "Rate upgrade for the month" },
  { label: "Gold", icon: Trophy, color: "text-[#fbbf24]", bg: "bg-[rgba(251,191,36,0.1)]", border: "border-[rgba(251,191,36,0.2)]", req: "50 referrals/mo", commission: "15%", bonus: "+ Free ₦400,000 Naira Challenge" },
  { label: "Diamond", icon: Crown, color: "text-[#5eead4]", bg: "bg-[rgba(94,234,212,0.1)]", border: "border-[rgba(94,234,212,0.2)]", req: "100+ referrals/mo", commission: "15%", bonus: "+ Free ₦400K + $10K Challenge + Featured on website" },
]

const faqs = [
  { q: "How do I sign up?", a: "Click 'Become an Affiliate' below. Fill in your name, email, and payment details. You receive your unique referral link within 24 hours." },
  { q: "Do I need to be a Noble Funded trader to join?", a: "No. Anyone can join the referral programme for free. You do not need a challenge or funded account." },
  { q: "When do I get paid?", a: "Monthly. Commissions earned in a calendar month are paid within the first 10 days of the following month." },
  { q: "Can I share my link on social media?", a: "Yes. Share anywhere — WhatsApp, Telegram, Discord, Twitter/X, Instagram, TikTok, YouTube, your website, or email list." },
  { q: "What if someone clicks my link but buys later?", a: "Our tracking cookie lasts 30 days. If someone clicks today and buys within 30 days, you get the commission." },
  { q: "Is there a limit to how many people I can refer?", a: "No limit. Refer as many traders as you can." },
  { q: "Do I earn on both Naira and Dollar purchases?", a: "Yes. You earn 10% commission on both Naira and Dollar challenge purchases." },
]

const rules = [
  "Commission is earned when the referred trader completes their purchase.",
  "Self-referrals are not allowed. You cannot use your own link to buy your own challenge.",
  "No misleading claims. Do not promise guaranteed profits or guaranteed funding.",
  "No spam. Promote organically through content and genuine recommendations.",
  "No paid ads on brand keywords ('Noble Funded' or related terms).",
  "Commission applies to first purchase only per referred trader.",
  "Noble Funded may update the commission structure with 14 days notice.",
  "Affiliate accounts inactive for 6 months will be closed.",
]

export default function AffiliatePage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [commTab, setCommTab] = useState<"naira" | "dollar">("naira")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeReferrals = mockAffiliate.referrals.filter(r => r.status === "active")
  const pendingReferrals = mockAffiliate.referrals.filter(r => r.status === "pending")
  const ngnEarnings = mockAffiliate.referrals.filter(r => r.currency === "NGN").reduce((s, r) => s + r.commission, 0)
  const usdEarnings = mockAffiliate.referrals.filter(r => r.currency === "USD").reduce((s, r) => s + r.commission, 0)

  return (
    <DashboardShell title="Affiliate Program" subtitle="Refer traders and earn commissions on every challenge purchase">
      <div className="p-4 lg:p-6 space-y-6 page-fade-in">

        {/* Hero Banner */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(13,148,136,0.22) 0%, transparent 60%)" }} />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-[#5eead4]" />
                <span className="text-xs font-bold text-[#5eead4] uppercase tracking-wider">Noble Funded Affiliate Program</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground text-balance">Refer Traders. Earn Naira.</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
                Share your unique referral link and get paid every time someone you refer buys a challenge. Earn 10% commission, up to 15% for top affiliates.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#5eead4]">{formatCurrency(ngnEarnings, "NGN")}</p>
                {usdEarnings > 0 && <p className="text-lg font-bold text-[#4ade80]">${usdEarnings.toFixed(2)} USD</p>}
                <p className="text-xs text-muted-foreground">Total Commissions Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Referrals", value: mockAffiliate.totalReferrals, icon: Users, color: "text-foreground" },
            { label: "Active Referrals", value: activeReferrals.length, icon: Zap, color: "text-[#4ade80]" },
            { label: "Pending", value: pendingReferrals.length, icon: Clock, color: "text-[#fbbf24]" },
            { label: "Commission Rate", value: "10%", icon: DollarSign, color: "text-[#5eead4]" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <div className="p-2 rounded-lg w-fit mb-3" style={{ background: "rgba(13,148,136,0.12)", border: "1px solid rgba(94,234,212,0.12)" }}>
                <s.icon className="w-4 h-4 text-muted-foreground" size={16} />
              </div>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Referral Details */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Link2 size={16} className="text-[#5eead4]" />
                Your Referral Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Referral Code</p>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(94,234,212,0.14)" }}>
                    <span className="font-mono font-bold text-[#5eead4] flex-1">{mockAffiliate.referralCode}</span>
                    <button onClick={() => copy(mockAffiliate.referralCode, "code")} className="text-muted-foreground hover:text-[#5eead4] transition-colors shrink-0">
                      {copied === "code" ? <CheckCircle2 size={15} className="text-[#4ade80]" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Referral Link</p>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(94,234,212,0.14)" }}>
                    <span className="font-mono text-xs text-muted-foreground flex-1 truncate">{mockAffiliate.referralLink}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => copy(mockAffiliate.referralLink, "link")} className="text-muted-foreground hover:text-[#5eead4] transition-colors">
                        {copied === "link" ? <CheckCircle2 size={15} className="text-[#4ade80]" /> : <Copy size={15} />}
                      </button>
                      <a href={mockAffiliate.referralLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#5eead4] transition-colors">
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Share Buttons */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2.5">Share via</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "WhatsApp", href: `https://wa.me/?text=Start%20your%20funded%20trading%20journey%20with%20Noble%20Funded!%20Use%20my%20referral%20link:%20${mockAffiliate.referralLink}`, color: "bg-[rgba(37,211,102,0.1)] text-[#25d366] hover:bg-[rgba(37,211,102,0.18)]" },
                    { label: "Telegram", href: `https://t.me/share/url?url=${mockAffiliate.referralLink}&text=Join%20Noble%20Funded%20with%20my%20referral%20link!`, color: "bg-[rgba(0,136,204,0.1)] text-[#0088cc] hover:bg-[rgba(0,136,204,0.18)]" },
                    { label: "Twitter/X", href: `https://twitter.com/intent/tweet?text=I%20just%20got%20funded%20with%20@NobleFunded!%20Join%20me%20here:%20${mockAffiliate.referralLink}`, color: "bg-[rgba(167,255,235,0.08)] text-[#a7ffeb] hover:bg-[rgba(167,255,235,0.15)]" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={cn("py-2 rounded-lg text-xs font-medium transition-all border border-[rgba(94,234,212,0.1)] text-center", s.color)}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Sign Up for Free", desc: "Create your free affiliate account. No need to be a trader — anyone can join in under 2 minutes." },
                  { step: "2", title: "Share Your Link", desc: "Get your unique referral link. Share on WhatsApp, Telegram, Discord, Twitter/X, TikTok, YouTube — anywhere." },
                  { step: "3", title: "Get Paid", desc: "Earn 10% commission (up to 15%) on every challenge sold through your link. Paid monthly via Naira bank transfer or USDT." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#5eead4] shrink-0 mt-0.5" style={{ background: "rgba(20,184,166,0.14)", border: "1px solid rgba(94,234,212,0.18)" }}>
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Details */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4">Payout Details</h3>
              <div className="space-y-2">
                {[
                  { label: "Commission Rate", value: "10% (up to 15%)" },
                  { label: "Payout Frequency", value: "Monthly" },
                  { label: "Payout Methods", value: "Naira bank transfer or USDT" },
                  { label: "Minimum Payout", value: "None — you get everything" },
                  { label: "Cookie Duration", value: "30 days" },
                  { label: "Tracking", value: "Real-time dashboard" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(94,234,212,0.06)" }}>
                    <span className="text-xs text-muted-foreground">{r.label}</span>
                    <span className="text-xs font-semibold text-foreground text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-4">

            {/* Commission Structure */}
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(94,234,212,0.1)" }}>
                <h3 className="font-bold text-foreground">Commission Structure</h3>
                <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(94,234,212,0.1)" }}>
                  <button
                    onClick={() => setCommTab("naira")}
                    className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-all", commTab === "naira" ? "bg-[#5eead4] text-[#071210]" : "text-muted-foreground hover:text-foreground")}
                  >
                    Naira ₦
                  </button>
                  <button
                    onClick={() => setCommTab("dollar")}
                    className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-all", commTab === "dollar" ? "bg-[#5eead4] text-[#071210]" : "text-muted-foreground hover:text-foreground")}
                  >
                    Dollar $
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(94,234,212,0.08)" }}>
                      {["Account Size", "Challenge Fee", "Your Commission (10%)"].map((h) => (
                        <th key={h} className="text-left text-xs text-muted-foreground font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(commTab === "naira" ? nairaChallengePricing : dollarChallengePricing).map((p, i) => {
                      const commission = commTab === "naira"
                        ? `₦${(p.challengeFee * 0.1).toLocaleString()}`
                        : `$${(p.challengeFee * 0.1).toFixed(2)}`
                      const feeLabel = commTab === "naira"
                        ? `₦${p.challengeFee.toLocaleString()}`
                        : `$${p.challengeFee.toFixed(2)}`
                      return (
                        <tr key={i} className="glass-row transition-colors" style={{ borderBottom: "1px solid rgba(94,234,212,0.05)" }}>
                          <td className="px-5 py-3 font-bold text-foreground">{p.label}</td>
                          <td className="px-5 py-3 text-muted-foreground">{feeLabel}</td>
                          <td className="px-5 py-3 font-bold text-[#4ade80]">{commission}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(94,234,212,0.1)" }}>
                <p className="text-xs text-muted-foreground">Milestone tiers (Silver/Gold/Diamond) unlock 12–15% commission retroactively for the entire month.</p>
              </div>
            </div>

            {/* Milestone Tiers */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4">Monthly Milestone Rewards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nairaTiers.map((tier) => (
                  <div key={tier.label} className={cn("rounded-xl p-4 border", tier.bg, tier.border)}>
                    <div className="flex items-center gap-2 mb-2">
                      <tier.icon className={cn("w-4 h-4", tier.color)} size={16} />
                      <span className={cn("text-sm font-bold", tier.color)}>{tier.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{tier.req}</p>
                    <p className="text-sm font-semibold text-foreground">{tier.commission} commission</p>
                    <p className="text-xs text-muted-foreground mt-1">{tier.bonus}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
                <AlertCircle size={12} className="text-[#fbbf24] mt-0.5 shrink-0" />
                Milestone bonuses are calculated at end of month. Hitting Silver, Gold, or Diamond upgrades your rate retroactively for that entire month.
              </p>
            </div>

            {/* My Referrals Table */}
            <div className="glass-table overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(94,234,212,0.1)" }}>
                <h3 className="font-bold text-foreground">My Referrals</h3>
                <span className="text-xs text-muted-foreground">{mockAffiliate.referrals.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(94,234,212,0.08)" }}>
                      {["Trader", "Email", "Joined", "Status", "Commission"].map((h) => (
                        <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockAffiliate.referrals.map((r) => (
                      <tr key={r.id} className="glass-row transition-colors" style={{ borderBottom: "1px solid rgba(94,234,212,0.05)" }}>
                        <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{r.name}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.email}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(r.joinedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                            r.status === "active" ? "badge-active" :
                            r.status === "converted" ? "badge-dollar" :
                            "badge-challenge"
                          )}>
                            {r.status === "active" ? "Active" : r.status === "converted" ? "Purchased" : "Pending"}
                          </span>
                        </td>
                        <td className={cn("px-4 py-3 font-bold whitespace-nowrap", r.commission > 0 ? "text-[#4ade80]" : "text-muted-foreground")}>
                          {r.commission > 0
                            ? r.currency === "NGN"
                              ? formatCurrency(r.commission, "NGN")
                              : `$${r.commission.toFixed(2)}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 flex justify-between items-center" style={{ borderTop: "1px solid rgba(94,234,212,0.1)" }}>
                <span className="text-sm text-muted-foreground">NGN Earned</span>
                <div className="flex items-center gap-4">
                  {usdEarnings > 0 && <span className="font-bold text-[#5eead4]">${usdEarnings.toFixed(2)} USD</span>}
                  <span className="font-bold text-[#4ade80] text-lg">{formatCurrency(ngnEarnings, "NGN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Examples */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-foreground mb-4">Earnings Examples</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Casual Referrer", desc: "5 friends buy the ₦400,000 challenge (₦19,000 fee)", result: "5 × ₦1,900 = ₦9,500/mo", color: "text-[#5eead4]" },
              { title: "Active Promoter", desc: "20 referrals — mix of Naira & Dollar accounts", result: "~₦29,000 + $220/mo", color: "text-[#fbbf24]" },
              { title: "Content Creator (Gold)", desc: "55 referrals via YouTube/TikTok this month", result: "~₦150K–₦300K/mo + Free ₦400K Challenge", color: "text-[#c0c0c0]" },
              { title: "Community Leader (Diamond)", desc: "110 referrals from Telegram group of 5,000", result: "₦400K+ commissions + 2 Free Challenges", color: "text-[#5eead4]" },
            ].map((ex) => (
              <div key={ex.title} className="rounded-xl p-4" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.12)" }}>
                <p className="text-sm font-bold text-foreground mb-1">{ex.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{ex.desc}</p>
                <p className={cn("text-sm font-bold", ex.color)}>{ex.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ & Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-foreground mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(94,234,212,0.1)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(20,184,166,0.05)] transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={15} className="text-[#5eead4] shrink-0" /> : <ChevronDown size={15} className="text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3" style={{ borderTop: "1px solid rgba(94,234,212,0.07)" }}>
                      <p className="text-xs text-muted-foreground pt-3 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Programme Rules */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-foreground mb-4">Programme Rules</h3>
            <ol className="space-y-3">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#5eead4] shrink-0 mt-0.5" style={{ background: "rgba(20,184,166,0.14)", border: "1px solid rgba(94,234,212,0.18)" }}>
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-card p-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(13,148,136,0.2) 0%, transparent 70%)" }} />
          <div className="relative">
            <h3 className="text-xl font-bold text-foreground mb-2">Start Earning Today</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              Join thousands of affiliates already earning with Noble Funded. Free to join, no limits on earnings.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://noblefunded.com/affiliate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#071210] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all"
                style={{ boxShadow: "0 0 20px rgba(94,234,212,0.3)" }}
              >
                Become an Affiliate
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#5eead4] hover:bg-[rgba(20,184,166,0.1)] transition-all"
                style={{ border: "1px solid rgba(94,234,212,0.25)" }}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
