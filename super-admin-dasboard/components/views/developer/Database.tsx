"use client";

import { useState } from "react";
import { Database, RefreshCw, Download, Search, Table, Zap, HardDrive, Activity } from "lucide-react";

const tables = [
  { name: "users", rows: "48,291", size: "12.4 MB", lastWrite: "2s ago", status: "healthy" },
  { name: "challenges", rows: "156,820", size: "38.1 MB", lastWrite: "4s ago", status: "healthy" },
  { name: "payouts", rows: "24,105", size: "8.7 MB", lastWrite: "12s ago", status: "healthy" },
  { name: "trades", rows: "1,240,882", size: "320 MB", lastWrite: "1s ago", status: "healthy" },
  { name: "audit_logs", rows: "580,441", size: "95 MB", lastWrite: "0s ago", status: "healthy" },
  { name: "notifications", rows: "210,000", size: "44 MB", lastWrite: "6s ago", status: "warning" },
  { name: "sessions", rows: "9,402", size: "2.1 MB", lastWrite: "1s ago", status: "healthy" },
  { name: "kyc_verifications", rows: "47,800", size: "15 MB", lastWrite: "22s ago", status: "healthy" },
];

const queryHistory = [
  { query: "SELECT * FROM payouts WHERE status='pending' LIMIT 50", time: "0.04s", rows: 8, ts: "2m ago" },
  { query: "UPDATE challenges SET status='completed' WHERE user_id=4821", time: "0.01s", rows: 1, ts: "14m ago" },
  { query: "SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24h'", time: "0.08s", rows: 1, ts: "45m ago" },
  { query: "DELETE FROM sessions WHERE expires_at < NOW()", time: "0.12s", rows: 1240, ts: "1h ago" },
];

export default function DatabaseView() {
  const [query, setQuery] = useState("SELECT * FROM users WHERE status = 'active' LIMIT 100;");
  const [queryResult, setQueryResult] = useState<null | { cols: string[]; rows: any[][] }>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setQueryResult({
        cols: ["id", "email", "status", "balance", "created_at"],
        rows: [
          [4821, "alex.thorne@email.com", "active", "₦48,200", "2024-10-01"],
          [4822, "jane.doe@email.com", "active", "₦12,500", "2024-10-02"],
          [4823, "mark.smith@email.com", "active", "₦92,000", "2024-10-03"],
          [4824, "musa.okoro@email.com", "active", "₦5,400", "2024-10-04"],
          [4825, "sarah.jones@email.com", "active", "₦210,000", "2024-10-05"],
        ],
      });
      setRunning(false);
    }, 800);
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Database Monitor</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Live PostgreSQL cluster — read replica + primary write node</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ffcc]/05 border border-[#00ffcc]/20 text-xs text-[#00ffcc]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] pulse-dot" />
            PRIMARY: CONNECTED
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
            <Download size={14} /> Export Schema
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL RECORDS", value: "2.32M", icon: Database, color: "#00ffcc" },
          { label: "DB SIZE", value: "535 MB", icon: HardDrive, color: "#00ffcc" },
          { label: "AVG QUERY TIME", value: "0.06s", icon: Zap, color: "#ffbc7c" },
          { label: "ACTIVE CONNECTIONS", value: "44 / 100", icon: Activity, color: "#00ffcc" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0b2f2d] flex items-center justify-center flex-shrink-0">
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{s.label}</p>
              <p className="text-lg font-bold font-display text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table Overview */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Table size={15} className="text-[#00ffcc]" /> Table Overview
            </h2>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] hover:border-[#00ffcc]/30 transition-all">
              <RefreshCw size={12} className="text-[#00ffcc]" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-2 px-2 pb-2 border-b border-[rgba(0,255,204,0.08)]">
              {["TABLE", "ROWS", "SIZE", "STATUS"].map(h => (
                <span key={h} className="text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase">{h}</span>
              ))}
            </div>
            {tables.map((t) => (
              <div key={t.name} className="grid grid-cols-4 gap-2 px-2 py-2 rounded-lg table-row-hover items-center">
                <span className="text-xs font-mono text-[#00ffcc]">{t.name}</span>
                <span className="text-xs text-[#b9cbc2]">{t.rows}</span>
                <span className="text-xs text-[#b9cbc2]">{t.size}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                  t.status === "healthy" ? "chip-active" : "chip-warning"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Query Console */}
        <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold font-display text-white flex items-center gap-2">
            <Database size={15} className="text-[#00ffcc]" /> Query Console
          </h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="w-full bg-[#001716] border border-[rgba(0,255,204,0.15)] rounded-lg px-4 py-3 text-xs font-mono text-[#00ffcc] resize-none input-field focus:border-[#00ffcc]/50 transition-all"
          />
          <button
            onClick={handleRun}
            disabled={running}
            className="btn-primary flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold hover:bg-[#00d4a8] transition-all disabled:opacity-50"
          >
            {running ? <><RefreshCw size={14} className="animate-spin" /> Running...</> : <><Zap size={14} /> Run Query</>}
          </button>

          {queryResult && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[rgba(0,255,204,0.1)]">
                    {queryResult.cols.map(c => (
                      <th key={c} className="text-left pb-2 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase pr-4">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, i) => (
                    <tr key={i} className="border-b border-[rgba(0,255,204,0.04)] table-row-hover">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 pr-4 font-mono text-[#b9cbc2]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-[#b9cbc2]/40 mt-2">{queryResult.rows.length} rows returned · 0.04s</p>
            </div>
          )}
        </div>
      </div>

      {/* Query History */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold font-display text-white mb-4">Recent Query History</h2>
        <div className="space-y-2">
          {queryHistory.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuery(q.query)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0b2f2d]/30 hover:bg-[#00ffcc]/05 border border-[rgba(0,255,204,0.06)] hover:border-[#00ffcc]/20 text-left transition-all group"
            >
              <Search size={13} className="text-[#00ffcc]/50 flex-shrink-0 group-hover:text-[#00ffcc]" />
              <span className="flex-1 text-xs font-mono text-[#b9cbc2] truncate">{q.query}</span>
              <span className="text-[10px] text-[#00ffcc]/50 flex-shrink-0">{q.time}</span>
              <span className="text-[10px] text-[#b9cbc2]/40 flex-shrink-0">{q.ts}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
