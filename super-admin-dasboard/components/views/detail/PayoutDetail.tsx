"use client";

import { useState } from "react";
import {
  ArrowLeft, ChevronRight, CreditCard, Landmark, Bitcoin, CheckCircle,
  XCircle, AlertTriangle, Clock, Shield, User, MapPin, Calendar,
  FileText, Activity, Eye, Download, MessageSquare, Copy, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PayoutDetailProps {
  payoutId: string;
  onBack: () => void;
  onViewTrader?: (traderId: string) => void;
}

const PAYOUT_DATA: Record<string, {
  id: string; traderId: string; trader: string; email: string; phone: string;
  country: string; challengeId: string; challengeType: string; profitSplit: string;
  grossProfit: string; netPayout: string; amount: string; method: string;
  status: string; requestDate: string; processedDate?: string;
  bankName?: string; accountNumber?: string; accountName?: string;
  walletAddress?: string; walletNetwork?: string;
  ipAddress: string; deviceFingerprint: string; kycStatus: string;
  riskScore: number; riskLevel: string;
  auditLog: { action: string; by: string; time: string; note?: string; type: "success" | "warning" | "danger" | "info" }[];
  notes?: string;
}> = {
  "#PAY-8921": {
    id: "#PAY-8921", traderId: "#NF-89213", trader: "Ayo Tobi", email: "ayo.tobi@gmail.com",
    phone: "+234 807 222 3333", country: "Nigeria",
    challengeId: "#CH-96221", challengeType: "DOLLAR/PHASE 1 → Funded", profitSplit: "80%",
    grossProfit: "₦1,562,500", netPayout: "₦1,250,000", amount: "₦1,250,000",
    method: "Bank Transfer", status: "PENDING",
    requestDate: "Mar 31, 2:15 PM", bankName: "Guaranty Trust Bank",
    accountNumber: "0123456789", accountName: "Ayodeji Tobi",
    ipAddress: "105.112.44.88", deviceFingerprint: "Chrome 122 / macOS 14.4",
    kycStatus: "Verified", riskScore: 14, riskLevel: "LOW",
    auditLog: [
      { action: "Payout request submitted by trader", by: "Ayo Tobi (Trader)", time: "Mar 31, 2:15 PM", type: "info" },
      { action: "Automatic risk check passed — score 14/100", by: "System", time: "Mar 31, 2:15 PM", type: "success" },
      { action: "KYC verification confirmed", by: "System", time: "Mar 31, 2:15 PM", type: "success" },
      { action: "Payout queued for compliance review", by: "System", time: "Mar 31, 2:16 PM", type: "info" },
    ],
    notes: "Regular payout. Trader has a clean track record with 2 prior successful payouts.",
  },
  "#PAY-8918": {
    id: "#PAY-8918", traderId: "#NF-89211", trader: "Musa Okoro", email: "musa.okoro@outlook.com",
    phone: "+234 814 555 6666", country: "Nigeria",
    challengeId: "#CH-90112", challengeType: "NAIRA/FUNDED", profitSplit: "80%",
    grossProfit: "₦562,500", netPayout: "₦450,000", amount: "₦450,000",
    method: "Bank Transfer", status: "FLAGGED",
    requestDate: "Mar 31, 09:05 AM", bankName: "Access Bank",
    accountNumber: "0987654321", accountName: "Musa Okoro",
    ipAddress: "41.203.88.12", deviceFingerprint: "Firefox 124 / Windows 11",
    kycStatus: "Verified", riskScore: 72, riskLevel: "HIGH",
    auditLog: [
      { action: "Payout request submitted by trader", by: "Musa Okoro (Trader)", time: "Mar 31, 9:05 AM", type: "info" },
      { action: "Automatic risk check: IP address mismatch detected", by: "System", time: "Mar 31, 9:05 AM", type: "danger", note: "Previous IP: 105.112.22.10 — New IP: 41.203.88.12 — different ISP and location" },
      { action: "Account auto-flagged for compliance review", by: "System", time: "Mar 31, 9:06 AM", type: "warning" },
      { action: "Compliance review initiated", by: "Compliance Officer", time: "Mar 31, 10:30 AM", type: "info" },
    ],
    notes: "IP address mismatch detected. Previous logins from Lagos (MTN), this request from Abuja (Airtel). Requires manual identity verification before processing.",
  },
};

const DEFAULT_PAYOUT = PAYOUT_DATA["#PAY-8921"];

const statusStyles: Record<string, string> = {
  PENDING: "chip-warning",
  PROCESSING: "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30",
  FLAGGED: "chip-danger",
  APPROVED: "chip-active",
  REJECTED: "bg-[#7f1d1d]/30 text-[#ff6b6b] border border-[#ff4444]/30",
};

const riskColors: Record<string, string> = {
  LOW: "text-[#00ffcc]",
  MEDIUM: "text-[#f59e0b]",
  HIGH: "text-[#ff4444]",
};

const riskBarColors: Record<string, string> = {
  LOW: "#00ffcc",
  MEDIUM: "#f59e0b",
  HIGH: "#ff4444",
};

const auditColors = {
  success: "text-[#00ffcc]",
  warning: "text-[#f59e0b]",
  danger: "text-[#ff6b6b]",
  info: "text-[#60a5fa]",
};

const auditDots = {
  success: "bg-[#00ffcc]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ff4444]",
  info: "bg-[#60a5fa]",
};

export default function PayoutDetail({ payoutId, onBack, onViewTrader }: PayoutDetailProps) {
  const payout = PAYOUT_DATA[payoutId] || DEFAULT_PAYOUT;
  const [status, setStatus] = useState(payout.status);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [copied, setCopied] = useState(false);

  const canAct = status === "PENDING" || status === "FLAGGED";

  const handleApprove = () => {
    setStatus("APPROVED");
  };

  const handleReject = () => {
    setStatus("REJECTED");
    setShowRejectModal(false);
  };

  const copyAccount = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="page-fade space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Payouts
        </button>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-[#b9cbc2]/60 font-mono">{payout.id}</span>
        <ChevronRight size={13} className="text-[#b9cbc2]/30" />
        <span className="text-white">{payout.trader}</span>
      </div>

      {/* Hero */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4 justify-between flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)" }}>
              <CreditCard size={20} className="text-[#00ffcc]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl font-bold font-display text-white">{payout.id}</h1>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", statusStyles[status])}>{status}</span>
                <span className={cn("text-[11px] font-semibold", riskColors[payout.riskLevel])}>
                  Risk: {payout.riskLevel} ({payout.riskScore}/100)
                </span>
              </div>
              <p className="text-sm font-bold text-[#00ffcc] font-display">{payout.amount}</p>
              <p className="text-xs text-[#b9cbc2]/50 mt-0.5">Requested: {payout.requestDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {onViewTrader && (
              <button
                onClick={() => onViewTrader(payout.traderId)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-xs font-semibold hover:bg-[#00ffcc]/20 transition-all"
              >
                <User size={12} /> View Trader
              </button>
            )}
            {canAct && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffcc] text-[#001716] text-xs font-bold btn-primary transition-all"
                >
                  <CheckCircle size={12} /> Approve & Pay
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 text-[#ff6b6b] text-xs font-semibold hover:bg-[#ff4444]/20 transition-all"
                >
                  <XCircle size={12} /> Reject
                </button>
              </>
            )}
            {status === "APPROVED" && (
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-xs font-semibold">
                <CheckCircle size={12} /> Approved
              </span>
            )}
            {status === "REJECTED" && (
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ff4444]/10 border border-[#ff4444]/20 text-[#ff4444] text-xs font-semibold">
                <XCircle size={12} /> Rejected
              </span>
            )}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-xs hover:text-white transition-all">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* Risk Score bar */}
        <div className="mt-5 pt-5 border-t border-[rgba(0,255,204,0.08)]">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider">Automated Risk Score</p>
            <p className={cn("text-sm font-bold font-display", riskColors[payout.riskLevel])}>{payout.riskScore}/100</p>
          </div>
          <div className="h-2 rounded-full bg-[#0b2f2d]">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${payout.riskScore}%`, background: riskBarColors[payout.riskLevel] }}
            />
          </div>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trader Info */}
        <div className="glass-card rounded-xl p-5 space-y-1">
          <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
            <User size={14} className="text-[#00ffcc]" /> Trader Info
          </h3>
          {[
            { label: "Name", value: payout.trader },
            { label: "Email", value: payout.email },
            { label: "Phone", value: payout.phone },
            { label: "Country", value: payout.country },
            { label: "KYC Status", value: payout.kycStatus, color: payout.kycStatus === "Verified" ? "text-[#00ffcc]" : "text-[#f59e0b]" },
            { label: "Challenge", value: payout.challengeId },
            { label: "Challenge Type", value: payout.challengeType },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
              <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
              <span className={cn("text-[11px] font-medium font-mono", (row as { color?: string }).color || "text-white")}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Payment Details */}
        <div className="glass-card rounded-xl p-5 space-y-1">
          <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
            {payout.method === "Bank Transfer" ? <Landmark size={14} className="text-[#00ffcc]" /> : <Bitcoin size={14} className="text-[#00ffcc]" />}
            {payout.method === "Bank Transfer" ? "Bank Details" : "Wallet Details"}
          </h3>
          {(payout.method === "Bank Transfer" ? [
            { label: "Bank Name", value: payout.bankName! },
            { label: "Account Number", value: payout.accountNumber!, copy: true },
            { label: "Account Name", value: payout.accountName! },
            { label: "Method", value: "Bank Transfer" },
            { label: "Gross Profit", value: payout.grossProfit },
            { label: "Platform Split (20%)", value: "₦312,500" },
            { label: "Net Payout (80%)", value: payout.netPayout, highlight: true },
          ] : [
            { label: "Wallet Address", value: payout.walletAddress!, copy: true },
            { label: "Network", value: payout.walletNetwork! },
            { label: "Gross Profit", value: payout.grossProfit },
            { label: "Net Payout (80%)", value: payout.netPayout, highlight: true },
          ]).map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
              <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn("text-[11px] font-medium font-mono", (row as { highlight?: boolean }).highlight ? "text-[#00ffcc] font-bold text-sm" : "text-white")}>
                  {row.value}
                </span>
                {(row as { copy?: boolean }).copy && (
                  <button onClick={copyAccount} className="text-[#b9cbc2]/40 hover:text-[#00ffcc] transition-all">
                    {copied ? <Check size={10} className="text-[#00ffcc]" /> : <Copy size={10} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="glass-card rounded-xl p-5 space-y-1">
          <h3 className="text-sm font-semibold font-display text-white mb-3 flex items-center gap-2">
            <Shield size={14} className="text-[#00ffcc]" /> Security Checks
          </h3>
          {[
            { label: "IP Address", value: payout.ipAddress },
            { label: "Device", value: payout.deviceFingerprint },
            { label: "Risk Score", value: `${payout.riskScore}/100`, color: riskColors[payout.riskLevel] },
            { label: "Risk Level", value: payout.riskLevel, color: riskColors[payout.riskLevel] },
            { label: "KYC Verified", value: payout.kycStatus === "Verified" ? "Yes" : "No", color: payout.kycStatus === "Verified" ? "text-[#00ffcc]" : "text-[#ff4444]" },
            { label: "Bank Match", value: payout.method === "Bank Transfer" ? "Name matched" : "N/A", color: "text-[#00ffcc]" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
              <span className="text-[11px] text-[#b9cbc2]/50">{row.label}</span>
              <span className={cn("text-[11px] font-medium font-mono", (row as { color?: string }).color || "text-white")}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(0,255,204,0.08)]">
          <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2">
            <Activity size={14} className="text-[#00ffcc]" /> Audit Trail
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {payout.auditLog.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(0,255,204,0.05)] last:border-0">
              <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", auditDots[entry.type])} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-medium", auditColors[entry.type])}>{entry.action}</p>
                {entry.note && (
                  <p className="text-[10px] text-[#f59e0b]/70 mt-0.5 leading-relaxed">{entry.note}</p>
                )}
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-[#b9cbc2]/40">{entry.time}</span>
                  <span className="text-[10px] text-[#b9cbc2]/30">by {entry.by}</span>
                </div>
              </div>
            </div>
          ))}
          {status !== payout.status && (
            <div className="flex items-start gap-3 py-2">
              <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", status === "APPROVED" ? "bg-[#00ffcc]" : "bg-[#ff4444]")} />
              <div>
                <p className={cn("text-xs font-medium", status === "APPROVED" ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                  Payout {status === "APPROVED" ? "approved and queued for payment" : "rejected by admin"}
                </p>
                <p className="text-[10px] text-[#b9cbc2]/40 mt-0.5">Just now • by Admin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal Notes */}
      {payout.notes && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold font-display text-white mb-2 flex items-center gap-2">
            <FileText size={14} className="text-[#00ffcc]" /> Internal Notes
          </h3>
          <p className="text-sm text-[#b9cbc2] leading-relaxed">{payout.notes}</p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}>
          <div className="glass-modal rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#ff4444]/15 flex items-center justify-center">
                <XCircle size={18} className="text-[#ff6b6b]" />
              </div>
              <h3 className="text-base font-bold font-display text-white">Reject Payout</h3>
            </div>
            <p className="text-sm text-[#b9cbc2]/70">
              You are rejecting payout <span className="text-[#00ffcc] font-mono">{payout.id}</span> for <span className="text-[#00ffcc] font-bold">{payout.amount}</span>. Please provide a reason.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (required)..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl bg-[#0b2f2d]/60 border border-[rgba(255,68,68,0.2)] text-white placeholder:text-[#b9cbc2]/30 resize-none input-field"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2] hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#ff4444]/20 border border-[#ff4444]/30 text-[#ff6b6b] text-sm font-bold hover:bg-[#ff4444]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
