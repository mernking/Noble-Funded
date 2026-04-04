"use client";

import { useState } from "react";
import { RefreshCw, Server, Cpu, HardDrive, Activity, Wifi } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const cpuData = Array.from({ length: 20 }, (_, i) => ({ t: i, v: Math.floor(Math.random() * 40 + 20) }));
const memData = Array.from({ length: 20 }, (_, i) => ({ t: i, v: Math.floor(Math.random() * 30 + 50) }));

const services = [
  { name: "API Gateway", status: "OPERATIONAL", latency: "14ms", uptime: "99.98%" },
  { name: "Trading Engine", status: "OPERATIONAL", latency: "8ms", uptime: "99.99%" },
  { name: "Database Cluster", status: "OPERATIONAL", latency: "3ms", uptime: "100%" },
  { name: "Auth Service", status: "OPERATIONAL", latency: "22ms", uptime: "99.95%" },
  { name: "Email Service", status: "DEGRADED", latency: "180ms", uptime: "98.2%" },
  { name: "File Storage", status: "OPERATIONAL", latency: "45ms", uptime: "99.97%" },
  { name: "WebSocket Server", status: "OPERATIONAL", latency: "6ms", uptime: "99.96%" },
  { name: "Cron Jobs", status: "OPERATIONAL", latency: "—", uptime: "100%" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return <div className="glass-card rounded-lg p-2 text-xs text-[#00ffcc] font-semibold">{payload[0]?.value}%</div>;
  }
  return null;
};

export default function SystemView() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">System Status</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Real-time infrastructure health and service monitoring.</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ffcc]/30 text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "CPU Usage", value: "34%", icon: Cpu, color: "#00ffcc" },
          { label: "Memory", value: "68%", icon: HardDrive, color: "#ffbc7c" },
          { label: "Network I/O", value: "142 MB/s", icon: Wifi, color: "#00ffcc" },
          { label: "Active Nodes", value: "12 / 12", icon: Server, color: "#00ffcc" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center">
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot mt-1" />
            </div>
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/60 uppercase mb-1">{s.label}</p>
            <p className="text-xl font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Resource Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-3">CPU Load (Live)</h2>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={cpuData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffcc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke="#00ffcc" strokeWidth={2} fill="url(#cpuGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-3">Memory Usage (Live)</h2>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={memData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffbc7c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffbc7c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke="#ffbc7c" strokeWidth={2} fill="url(#memGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Status Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-sm font-semibold font-display text-white">Service Health</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.06)]">
              {["SERVICE", "STATUS", "LATENCY", "UPTIME (30D)"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.name} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Activity size={13} className={s.status === "OPERATIONAL" ? "text-[#00ffcc]" : "text-[#ffbc7c]"} />
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${s.status === "OPERATIONAL" ? "chip-active" : "chip-warning"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === "OPERATIONAL" ? "bg-[#00ffcc]" : "bg-[#ffbc7c]"} pulse-dot`} />
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm font-mono text-white">{s.latency}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-semibold ${parseFloat(s.uptime) > 99 ? "text-[#00ffcc]" : "text-[#ffbc7c]"}`}>{s.uptime}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
