"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { mockAccounts, mockUser, mockPayouts, formatCurrency } from "@/lib/data"
import {
  Award,
  Download,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Shield,
  Star,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CertType = "payout" | "pass"

interface Certificate {
  id: string
  type: CertType
  title: string
  accountNumber: string
  accountType: "naira" | "dollar"
  currency: "NGN" | "USD"
  date: string
  details: string
  amount?: number
  phase?: string
}

// Generate mock certificates from mock data
const generateCertificates = (): Certificate[] => {
  const certs: Certificate[] = []

  // Payout certificates — from paid payouts
  mockPayouts
    .filter(p => p.status === "paid")
    .forEach((p, i) => {
      const acc = mockAccounts.find(a => a.id === p.accountId)
      certs.push({
        id: `cert-pay-${i}`,
        type: "payout",
        title: "Payout Certificate",
        accountNumber: acc?.accountNumber || p.accountId,
        accountType: acc?.type || "naira",
        currency: p.currency,
        date: p.paidAt || p.requestedAt,
        details: `Successfully received ${p.currency === "NGN" ? "₦" : "$"}${p.amount.toLocaleString()} via ${p.method}`,
        amount: p.amount,
      })
    })

  // Pass certificates — from funded/passed accounts
  mockAccounts
    .filter(a => a.status === "funded" || a.status === "passed")
    .forEach((acc, i) => {
      // Phase 1 pass
      certs.push({
        id: `cert-p1-${i}`,
        type: "pass",
        title: "Challenge Phase 1 Certificate",
        accountNumber: acc.accountNumber,
        accountType: acc.type,
        currency: acc.currency,
        date: acc.createdAt,
        details: `Successfully passed Phase 1 evaluation with ${acc.type === "naira" ? "10%" : "10%"} profit target`,
        phase: "Phase 1",
      })
      // Phase 2 pass (for funded accounts)
      if (acc.status === "funded") {
        certs.push({
          id: `cert-p2-${i}`,
          type: "pass",
          title: "Challenge Phase 2 Certificate",
          accountNumber: acc.accountNumber,
          accountType: acc.type,
          currency: acc.currency,
          date: acc.createdAt,
          details: `Successfully passed Phase 2 evaluation and received funded account`,
          phase: "Phase 2",
        })
      }
    })

  return certs
}

const allCerts = generateCertificates()

function CertificateCard({ cert }: { cert: Certificate }) {
  const isNaira = cert.accountType === "naira"
  const isPayout = cert.type === "payout"

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-default",
      isNaira
        ? "border border-[rgba(251,191,36,0.25)]"
        : "border border-[rgba(94,234,212,0.25)]"
    )}
      style={{
        background: isNaira
          ? "linear-gradient(145deg, rgba(251,191,36,0.07) 0%, rgba(6,15,14,0.7) 40%, rgba(7,18,17,0.75) 100%)"
          : "linear-gradient(145deg, rgba(20,184,166,0.08) 0%, rgba(6,15,14,0.65) 40%, rgba(7,18,17,0.72) 100%)",
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Shimmer top line */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: isNaira ? "linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent)" : "linear-gradient(90deg,transparent,rgba(94,234,212,0.5),transparent)" }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isPayout ? "bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.2)]" : isNaira ? "bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.2)]" : "bg-[rgba(94,234,212,0.12)] border border-[rgba(94,234,212,0.2)]"
          )}>
            {isPayout
              ? <DollarSign className="w-5 h-5 text-[#4ade80]" />
              : <Award className={cn("w-5 h-5", isNaira ? "text-[#fbbf24]" : "text-[#5eead4]")} />
            }
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">{cert.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", isNaira ? "badge-naira" : "badge-dollar")}>
                {isNaira ? "Naira" : "Dollar"}
              </span>
              {cert.phase && (
                <span className="text-[10px] font-semibold text-muted-foreground">{cert.phase}</span>
              )}
            </div>
          </div>
        </div>
        <button
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0",
            isNaira ? "text-[#fbbf24] bg-[rgba(251,191,36,0.08)] hover:bg-[rgba(251,191,36,0.16)] border border-[rgba(251,191,36,0.15)]" : "text-[#5eead4] bg-[rgba(20,184,166,0.08)] hover:bg-[rgba(20,184,166,0.15)] border border-[rgba(94,234,212,0.15)]"
          )}
          onClick={() => {
            // In production: generate and download PDF
            alert("Certificate download coming soon. This will generate a PDF certificate.")
          }}
        >
          <Download size={12} />
          Download
        </button>
      </div>

      {/* Noble Funded Seal */}
      <div className="flex items-center gap-1.5 mb-3">
        <Star size={11} className={isNaira ? "text-[#fbbf24]" : "text-[#5eead4]"} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isNaira ? "#fbbf24" : "#5eead4" }}>Noble Funded — Official Certificate</span>
        <Star size={11} className={isNaira ? "text-[#fbbf24]" : "text-[#5eead4]"} />
      </div>

      {/* Account info */}
      <div className="rounded-xl p-3 mb-3 space-y-1.5" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.08)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Account</span>
          <span className="text-xs font-mono font-bold text-foreground">{cert.accountNumber}</span>
        </div>
        {cert.amount !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Amount</span>
            <span className="text-sm font-bold text-[#4ade80]">{formatCurrency(cert.amount, cert.currency)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Issued</span>
          <span className="text-xs text-foreground">
            {new Date(cert.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Details */}
      <p className="text-xs text-muted-foreground leading-relaxed">{cert.details}</p>

      {/* Verified badge */}
      <div className="flex items-center gap-1.5 mt-3">
        <CheckCircle2 size={12} className="text-[#4ade80]" />
        <span className="text-[10px] text-[#4ade80] font-semibold">Verified by Noble Funded</span>
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: "naira" | "dollar" }) {
  return (
    <div className="glass-card p-12 text-center col-span-full">
      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <p className="font-semibold text-foreground">No certificates yet</p>
      <p className="text-sm text-muted-foreground mt-1">
        Pass a {type === "naira" ? "Naira" : "Dollar"} challenge or receive a payout to earn your first certificate.
      </p>
    </div>
  )
}

export default function CertificatesPage() {
  const [tab, setTab] = useState<"naira" | "dollar">("naira")
  const [typeFilter, setTypeFilter] = useState<"all" | "payout" | "pass">("all")

  const filtered = allCerts.filter(c => {
    const typeMatch = c.accountType === tab
    const certMatch = typeFilter === "all" || c.type === typeFilter
    return typeMatch && certMatch
  })

  const nairaCerts = allCerts.filter(c => c.accountType === "naira")
  const dollarCerts = allCerts.filter(c => c.accountType === "dollar")

  return (
    <DashboardShell title="Certificates" subtitle="Your trading achievement certificates and payout records">
      <div className="p-4 lg:p-6 space-y-6 page-fade-in">

        {/* Header Banner */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(13,148,136,0.18) 0%, transparent 60%)" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Award className="w-5 h-5 text-[#5eead4]" />
                <span className="text-xs font-bold text-[#5eead4] uppercase tracking-wider">Achievement Records</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Your Certificates</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Official certificates for every challenge you pass and every payout you receive — for both Naira and Dollar accounts.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black text-[#fbbf24]">{nairaCerts.length}</p>
                <p className="text-xs text-muted-foreground">Naira Certs</p>
              </div>
              <div className="w-px h-8 bg-[rgba(94,234,212,0.15)]" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#5eead4]">{dollarCerts.length}</p>
                <p className="text-xs text-muted-foreground">Dollar Certs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Certificates", value: allCerts.length, icon: Award, color: "text-foreground" },
            { label: "Payout Certificates", value: allCerts.filter(c => c.type === "payout").length, icon: DollarSign, color: "text-[#4ade80]" },
            { label: "Pass Certificates", value: allCerts.filter(c => c.type === "pass").length, icon: CheckCircle2, color: "text-[#5eead4]" },
            { label: "Verified", value: allCerts.length, icon: Shield, color: "text-[#fbbf24]" },
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

        {/* Tab and filter controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Account type tabs */}
          <div className="flex items-center gap-1 p-1 glass-card rounded-xl">
            <button
              onClick={() => setTab("naira")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                tab === "naira" ? "bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.25)]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Naira ₦</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                {nairaCerts.length}
              </span>
            </button>
            <button
              onClick={() => setTab("dollar")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                tab === "dollar" ? "bg-[rgba(20,184,166,0.15)] text-[#5eead4] border border-[rgba(94,234,212,0.25)]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Dollar $</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.12)", color: "#5eead4" }}>
                {dollarCerts.length}
              </span>
            </button>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 p-1 glass-card rounded-xl">
            {(["all", "pass", "payout"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                  typeFilter === f ? "bg-[rgba(167,255,235,0.15)] text-[#a7ffeb]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f === "all" ? "All" : f === "pass" ? "Pass Certificates" : "Payout Certificates"}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates grid */}
        {filtered.length === 0 ? (
          <EmptyState type={tab} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="glass-card p-4 flex items-start gap-3">
          <Shield size={15} className="text-[#5eead4] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">About Your Certificates</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              All certificates are issued by Noble Funded and verified on our records. Payout certificates confirm funds disbursed to your account. Pass certificates confirm successful completion of challenge phases. Download your certificates for your records or to share with your community.
            </p>
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
