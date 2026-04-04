"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import {
  mockPayouts,
  mockAccounts,
  formatCurrency,
} from "@/lib/data"
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
  Banknote,
  Copy,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const fundedAccounts = mockAccounts.filter((a) => a.status === "funded")

function PayoutStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
    paid: { label: "Paid", icon: CheckCircle2, cls: "text-[#4ade80] bg-[rgba(74,222,128,0.1)]" },
    processing: { label: "Processing", icon: Clock, cls: "text-[#fbbf24] bg-[rgba(251,191,36,0.1)]" },
    pending: { label: "Pending", icon: Clock, cls: "text-[#a7ffeb] bg-[rgba(167,255,235,0.1)]" },
    rejected: { label: "Rejected", icon: XCircle, cls: "text-[#f87171] bg-[rgba(248,113,113,0.1)]" },
  }
  const s = map[status] || map.pending
  return (
    <span className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", s.cls)}>
      <s.icon size={12} />
      {s.label}
    </span>
  )
}

export default function PayoutsPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState({
    accountId: fundedAccounts[0]?.id || "",
    amount: "",
    method: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    walletAddress: "",
    network: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const selectedAccount = mockAccounts.find((a) => a.id === form.accountId)
  const isNaira = selectedAccount?.currency === "NGN"
  // Naira: no minimum. Dollar: $50 minimum
  const minPayout = isNaira ? 0 : 50
  const maxPayout = selectedAccount ? (selectedAccount.balance - selectedAccount.startingBalance) * (selectedAccount.profitSplit / 100) : 0
  const payoutTimeLabel = isNaira ? "within 24 hours" : "bi-weekly (every 2 weeks)"
  const payoutMethods = isNaira
    ? ["Bank Transfer (GTBank)", "Bank Transfer (Access Bank)", "Bank Transfer (Opay)", "Bank Transfer (Palmpay)", "Bank Transfer (Kuda)"]
    : ["USDT (TRC20)", "USDT (ERC20)", "Bank Transfer (USD)"]

  const handleSubmit = () => {
    setSubmitted(true)
    setStep(1)
    setForm({ accountId: fundedAccounts[0]?.id || "", amount: "", method: "", bankName: "", accountNumber: "", accountName: "", walletAddress: "", network: "" })
  }

  const totalPaidNaira = mockPayouts.filter(p => p.status === "paid" && p.currency === "NGN").reduce((s, p) => s + p.amount, 0)
  const totalPaidDollar = mockPayouts.filter(p => p.status === "paid" && p.currency === "USD").reduce((s, p) => s + p.amount, 0)

  return (
    <DashboardShell title="Payouts" subtitle="Request and manage your profit withdrawals">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Naira Paid Out", value: formatCurrency(totalPaidNaira, "NGN"), color: "text-[#fbbf24]", icon: CheckCircle2 },
            { label: "Dollar Paid Out", value: formatCurrency(totalPaidDollar, "USD"), color: "text-[#4ade80]", icon: CheckCircle2 },
            { label: "Processing", value: formatCurrency(mockPayouts.filter(p => p.status === "processing").reduce((s, p) => s + p.amount, 0), "NGN"), color: "text-[#fbbf24]", icon: Clock },
            { label: "Avg Payout Time", value: "NGN < 24h · USD bi-wk", color: "text-[#a7ffeb]", icon: Clock },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <div className="p-2 rounded-lg bg-[rgba(167,255,235,0.06)] w-fit mb-3">
                <s.icon className="w-4 h-4 text-muted-foreground" size={16} />
              </div>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5">
              {!submitted ? (
                <>
                  <h3 className="font-bold text-foreground mb-1">Request Payout</h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    {isNaira
                      ? "Naira profits are paid within 24 hours via bank transfer."
                      : "Dollar profits are paid bi-weekly (every 2 weeks). Minimum payout: $50."}
                  </p>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all", step >= s ? "bg-[#5eead4] text-[#071210]" : "bg-[rgba(20,184,166,0.1)] text-muted-foreground border border-[rgba(94,234,212,0.15)]")}>
                          {s}
                        </div>
                        {s < 3 && <div className={cn("flex-1 h-0.5 rounded", step > s ? "bg-[#5eead4]" : "bg-[rgba(94,234,212,0.12)]")} />}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-foreground mb-3">Select Account</p>
                      <div className="space-y-2">
                        {fundedAccounts.length === 0 ? (
                          <div className="text-center py-6 text-sm text-muted-foreground">
                            No funded accounts available. Pass a challenge first.
                          </div>
                        ) : (
                          fundedAccounts.map((acc) => (
                            <button
                              key={acc.id}
                              onClick={() => setForm(f => ({ ...f, accountId: acc.id }))}
                              className={cn("w-full text-left p-3.5 rounded-xl border transition-all", form.accountId === acc.id ? "border-[#5eead4] bg-[rgba(20,184,166,0.1)]" : "border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.22)]")}
                              style={{ backdropFilter: "blur(12px)" }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{acc.accountNumber}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{acc.type === "naira" ? "Naira Account" : "Dollar Account"}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-[#4ade80]">{formatCurrency(acc.balance, acc.currency)}</p>
                                  <p className="text-xs text-muted-foreground">{acc.profitSplit}% split</p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                        {selectedAccount && (
                          <div className="rounded-lg p-3" style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(94,234,212,0.12)" }}>
                            <p className="text-xs text-muted-foreground">Eligible payout ({selectedAccount.profitSplit}% split):</p>
                            <p className="text-lg font-bold text-[#5eead4] mt-0.5">{formatCurrency(Math.max(0, maxPayout), selectedAccount.currency)}</p>
                            {!isNaira && <p className="text-[10px] text-[#fbbf24] mt-1">Min: $50 · Paid bi-weekly · USDT or USD bank</p>}
                            {isNaira && <p className="text-[10px] text-[#4ade80] mt-1">Paid within 24 hours · NGN bank transfer</p>}
                          </div>
                        )}
                      <button
                        onClick={() => setStep(2)}
                        disabled={!form.accountId || fundedAccounts.length === 0}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-[#071210] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ boxShadow: "0 0 20px rgba(94,234,212,0.2)" }}
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-foreground mb-3">Enter Amount</p>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Payout Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                            {isNaira ? "₦" : "$"}
                          </span>
                          <input
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                            placeholder="0.00"
                            className="w-full rounded-xl pl-8 pr-4 py-3 text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none transition-colors"
                            style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)", backdropFilter: "blur(12px)" }}
                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(94,234,212,0.4)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(94,234,212,0.14)")}
                          />
                        </div>
                        {selectedAccount && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {!isNaira && <span className="text-[#fbbf24]">Min: $50 · </span>}
                            Max: <button onClick={() => setForm(f => ({ ...f, amount: String(Math.max(0, maxPayout).toFixed(2)) }))} className="text-[#5eead4] hover:underline">{formatCurrency(Math.max(0, maxPayout), selectedAccount.currency)}</button>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Payment Method</label>
                        <div className="space-y-2">
                          {payoutMethods.map((m) => (
                            <button
                              key={m}
                              onClick={() => setForm(f => ({ ...f, method: m }))}
                              className={cn("w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all", form.method === m ? "border-[#5eead4] bg-[rgba(20,184,166,0.1)] text-[#5eead4]" : "border-[rgba(94,234,212,0.1)] text-muted-foreground hover:border-[rgba(94,234,212,0.22)] hover:text-foreground")}
                            >
                              {isNaira ? <Banknote size={14} className="inline mr-2" /> : <DollarSign size={14} className="inline mr-2" />}
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-medium border border-[rgba(167,255,235,0.15)] text-muted-foreground hover:text-foreground transition-all">Back</button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!form.amount || !form.method || Number(form.amount) <= 0 || (!isNaira && Number(form.amount) < 50)}
                          className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#071210] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all disabled:opacity-40"
                        style={{ boxShadow: "0 0 16px rgba(94,234,212,0.18)" }}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-foreground mb-3">
                        {isNaira ? "Bank Details" : "Wallet Details"}
                      </p>
                      {isNaira ? (
                        <>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Bank Name</label>
                            <input value={form.bankName} onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="e.g. GTBank" className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)" }} />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Account Number</label>
                            <input value={form.accountNumber} onChange={(e) => setForm(f => ({ ...f, accountNumber: e.target.value }))} placeholder="0123456789" maxLength={10} className="w-full rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)" }} />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Account Name</label>
                            <input value={form.accountName} onChange={(e) => setForm(f => ({ ...f, accountName: e.target.value }))} placeholder="Full account name" className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)" }} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Wallet Address</label>
                            <input value={form.walletAddress} onChange={(e) => setForm(f => ({ ...f, walletAddress: e.target.value }))} placeholder="0x..." className="w-full rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)" }} />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Network</label>
                            <input value={form.network} onChange={(e) => setForm(f => ({ ...f, network: e.target.value }))} placeholder="TRC20, ERC20..." className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.14)" }} />
                          </div>
                        </>
                      )}

                      {/* Summary */}
                      <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(13,148,136,0.07)", border: "1px solid rgba(94,234,212,0.12)" }}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Summary</p>
                        {[
                          { label: "Account", value: selectedAccount?.accountNumber || "" },
                          { label: "Amount", value: form.amount ? formatCurrency(Number(form.amount), selectedAccount?.currency || "NGN") : "-" },
                          { label: "Method", value: form.method },
                        ].map((r) => (
                          <div key={r.label} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{r.label}</span>
                            <span className="font-semibold text-foreground">{r.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-lg px-3 py-2.5" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
                        <AlertTriangle size={13} className="text-[#fbbf24] mt-0.5 shrink-0" />
                        {isNaira
                          ? "Naira payouts are processed within 24 hours. Ensure your bank details are correct."
                          : "Dollar payouts are processed bi-weekly. Minimum $50. Ensure your wallet/bank details are correct."}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-medium border border-[rgba(167,255,235,0.15)] text-muted-foreground hover:text-foreground transition-all">Back</button>
                        <button
                          onClick={handleSubmit}
                          disabled={isNaira ? (!form.bankName || !form.accountNumber || !form.accountName) : (!form.walletAddress)}
                          className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#071210] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all disabled:opacity-40"
                          style={{ boxShadow: "0 0 16px rgba(94,234,212,0.2)" }}
                        >
                          Submit Request
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[rgba(74,222,128,0.15)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#4ade80]" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">Request Submitted!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isNaira
                      ? "Your Naira payout request has been received. Funds will be sent within 24 hours."
                      : "Your Dollar payout request has been received. Funds will be sent in the next bi-weekly payout cycle (within 14 days)."}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#071210] bg-[#5eead4] hover:bg-[#2dd4bf] transition-all" style={{ boxShadow: "0 0 16px rgba(94,234,212,0.2)" }}>
                    New Request
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-3">
            <div className="glass-table overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(94,234,212,0.1)" }}>
                <h3 className="font-bold text-foreground">Payout History</h3>
              </div>
              {mockPayouts.length === 0 ? (
                <div className="p-12 text-center">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No payout history yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(94,234,212,0.08)" }}>
                        {["Reference", "Account", "Amount", "Method", "Requested", "Paid At", "Status"].map((h) => (
                          <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockPayouts.map((p) => (
                        <tr key={p.id} className="glass-row transition-colors" style={{ borderBottom: "1px solid rgba(94,234,212,0.05)" }}>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-[#5eead4]">{p.reference || "—"}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {mockAccounts.find(a => a.id === p.accountId)?.accountNumber || p.accountId}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#4ade80]">{formatCurrency(p.amount, p.currency)}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{p.method}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(p.requestedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <PayoutStatus status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
