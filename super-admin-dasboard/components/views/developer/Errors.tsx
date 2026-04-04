"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const errors = [
  { id: "ERR-0091", service: "EMAIL", code: "SMTP_DELIVERY_FAIL", message: "SendGrid webhook delivery failure — retry scheduled", occurrences: 3, firstSeen: "14 mins ago", lastSeen: "2 mins ago", resolved: false },
  { id: "ERR-0090", service: "KYC", code: "OCR_PARSE_FAILURE", message: "OCR parse failure for document ID-88291 — manual review queued", occurrences: 1, firstSeen: "22 mins ago", lastSeen: "22 mins ago", resolved: false },
  { id: "ERR-0089", service: "API", code: "RATE_LIMIT_BREACH", message: "IP 82.33.11.04 exceeded rate limit threshold", occurrences: 12, firstSeen: "1h ago", lastSeen: "1h ago", resolved: false },
  { id: "ERR-0088", service: "DB", code: "SLOW_QUERY", message: "Query challenges.getActiveTrades exceeded 800ms threshold", occurrences: 8, firstSeen: "2h ago", lastSeen: "21 mins ago", resolved: false },
  { id: "ERR-0087", service: "AUTH", code: "TOKEN_REFRESH_FAIL", message: "JWT refresh failed for 3 sessions — force re-login triggered", occurrences: 3, firstSeen: "4h ago", lastSeen: "4h ago", resolved: true },
  { id: "ERR-0086", service: "API", code: "TIMEOUT_500", message: "Payout batch request timed out after 30s", occurrences: 1, firstSeen: "8h ago", lastSeen: "8h ago", resolved: true },
];

export default function ErrorsView() {
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = errors.filter((e) => {
    if (filter === "Open") return !e.resolved;
    if (filter === "Resolved") return e.resolved;
    return true;
  });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Error Tracker</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Monitor and resolve platform-wide application errors.</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: "Open Errors", value: "4", color: "text-[#ff6b6b]" },
          { label: "Total Today", value: "28", color: "text-white" },
          { label: "Resolved Today", value: "22", color: "text-[#00ffcc]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          {["All", "Open", "Resolved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === f ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2]")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((err) => (
          <div key={err.id} className={cn("glass-card rounded-xl p-5", err.resolved ? "opacity-60" : "border-[#ff4444]/20")}>
            <div className="flex items-start gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center", err.resolved ? "bg-[#00ffcc]/10" : "bg-[#ff4444]/15")}>
                {err.resolved ? <CheckCircle size={16} className="text-[#00ffcc]" /> : <AlertCircle size={16} className="text-[#ff6b6b]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#b9cbc2]/50">{err.id}</span>
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded font-semibold", err.resolved ? "chip-active" : "chip-danger")}>{err.service}</span>
                  <span className="text-[10px] font-mono text-[#ff6b6b]/80">{err.code}</span>
                </div>
                <p className="text-sm font-medium text-white">{err.message}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-[10px] text-[#b9cbc2]/40">{err.occurrences}x occurrence{err.occurrences > 1 ? "s" : ""}</span>
                  <span className="text-[10px] text-[#b9cbc2]/40">First: {err.firstSeen}</span>
                  <span className="text-[10px] text-[#b9cbc2]/40">Last: {err.lastSeen}</span>
                </div>
              </div>
              {!err.resolved && (
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-all flex-shrink-0">
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
