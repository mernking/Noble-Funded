"use client";

import { useState } from "react";
import { RefreshCw, Download, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const logs = [
  { time: "2026-03-31 14:22:04", level: "INFO", service: "API", message: "GET /api/v2/challenges/status — 200 OK — 14ms" },
  { time: "2026-03-31 14:22:01", level: "INFO", service: "AUTH", message: "Token verified for user #NF-89210 — session extended" },
  { time: "2026-03-31 14:21:58", level: "WARN", service: "DB", message: "Slow query detected: challenges.getActiveTrades — 824ms" },
  { time: "2026-03-31 14:21:55", level: "INFO", service: "API", message: "POST /api/v2/payouts/request — 201 Created — 22ms" },
  { time: "2026-03-31 14:21:44", level: "ERROR", service: "EMAIL", message: "SendGrid webhook delivery failure — retry scheduled (3/5)" },
  { time: "2026-03-31 14:21:38", level: "INFO", service: "CRON", message: "Daily drawdown check completed — 1,847 accounts scanned" },
  { time: "2026-03-31 14:21:22", level: "INFO", service: "WS", message: "WebSocket connection opened — client #NF-89213 — latency 6ms" },
  { time: "2026-03-31 14:21:10", level: "WARN", service: "API", message: "Rate limit warning: IP 82.33.11.04 — 890/1000 req/min" },
  { time: "2026-03-31 14:20:55", level: "INFO", service: "TRADE", message: "Position closed: EURUSD — P&L +$240.00 — Account #NF-89210" },
  { time: "2026-03-31 14:20:41", level: "ERROR", service: "KYC", message: "OCR parse failure for document ID-88291 — manual review queued" },
  { time: "2026-03-31 14:20:30", level: "INFO", service: "API", message: "DELETE /api/v2/sessions/expired — 200 OK — 8ms" },
  { time: "2026-03-31 14:20:18", level: "INFO", service: "DB", message: "Replication lag: 0ms — all nodes in sync" },
];

const LEVEL_COLORS: Record<string, string> = {
  INFO: "text-[#00ffcc]",
  WARN: "text-[#ffbc7c]",
  ERROR: "text-[#ff6b6b]",
};

export default function LogsView() {
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const filtered = logs.filter((l) => filter === "ALL" || l.level === filter);

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">System Logs</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Live application and infrastructure log stream.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <Terminal size={14} className="text-[#00ffcc]/60" />
        <span className="text-[10px] text-[#b9cbc2]/50 uppercase tracking-widest">Filter:</span>
        <div className="flex gap-1.5">
          {["ALL", "INFO", "WARN", "ERROR"].map((l) => (
            <button key={l} onClick={() => setFilter(l)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all", filter === l ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2]")}>
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-[#00ffcc]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] pulse-dot" />
          LIVE STREAM
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="font-mono text-xs divide-y divide-[rgba(0,255,204,0.04)]" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {filtered.map((log, i) => (
            <div key={i} className={cn("flex items-start gap-3 px-4 py-2.5 hover:bg-[#00ffcc]/03 transition-all", log.level === "ERROR" && "bg-[#ff4444]/03")}>
              <span className="text-[10px] text-[#b9cbc2]/30 flex-shrink-0 pt-0.5">{log.time}</span>
              <span className={cn("text-[10px] font-bold w-10 flex-shrink-0 pt-0.5", LEVEL_COLORS[log.level])}>{log.level}</span>
              <span className="text-[10px] text-[#b9cbc2]/50 w-12 flex-shrink-0 pt-0.5">[{log.service}]</span>
              <span className={cn("text-xs flex-1", log.level === "ERROR" ? "text-[#ff6b6b]" : log.level === "WARN" ? "text-[#ffbc7c]" : "text-[#b9cbc2]")}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] flex items-center justify-between bg-[#0b2f2d]/20">
          <p className="text-xs text-[#b9cbc2]/40 font-mono">Showing {filtered.length} entries</p>
          <span className="text-[10px] text-[#00ffcc] font-mono blink">|</span>
        </div>
      </div>
    </div>
  );
}
