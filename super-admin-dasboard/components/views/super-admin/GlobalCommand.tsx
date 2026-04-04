"use client";

import { useState } from "react";
import { Globe, Server, Zap, Shield, Activity, AlertCircle, CheckCircle, RefreshCw, Lock, Unlock } from "lucide-react";

const regions = [
  { name: "Lagos, Nigeria", code: "LAG", users: 18420, latency: "12ms", status: "online", load: 72 },
  { name: "London, UK", code: "LDN", users: 9840, latency: "8ms", status: "online", load: 45 },
  { name: "New York, US", code: "NYC", users: 7210, latency: "22ms", status: "online", load: 38 },
  { name: "Dubai, UAE", code: "DXB", users: 6480, latency: "18ms", status: "online", load: 55 },
  { name: "Johannesburg, SA", code: "JHB", users: 4120, latency: "28ms", status: "warning", load: 88 },
  { name: "Singapore", code: "SGP", users: 2230, latency: "34ms", status: "online", load: 30 },
];

const systemSwitches = [
  { id: "trading", label: "Live Trading", desc: "Enable/disable all live trading globally", on: true, critical: true },
  { id: "payouts", label: "Payout Processing", desc: "Enable/disable automated payout processing", on: true, critical: true },
  { id: "registration", label: "New Registrations", desc: "Allow new user sign-ups", on: true, critical: false },
  { id: "challenges", label: "Challenge Purchases", desc: "Allow new challenge purchases", on: true, critical: false },
  { id: "maintenance", label: "Maintenance Mode", desc: "Show maintenance page to all users", on: false, critical: true },
  { id: "2fa", label: "Force 2FA", desc: "Require 2FA for all admin logins", on: true, critical: false },
];

export default function GlobalCommand() {
  const [switches, setSwitches] = useState(
    systemSwitches.reduce((acc, s) => ({ ...acc, [s.id]: s.on }), {} as Record<string, boolean>)
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleToggle = (id: string, isCritical: boolean) => {
    if (isCritical) {
      setConfirmId(id);
    } else {
      setSwitches(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const confirmToggle = () => {
    if (confirmId) {
      setSwitches(prev => ({ ...prev, [confirmId]: !prev[confirmId] }));
      setConfirmId(null);
    }
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Global Command Center</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">System-wide controls and global infrastructure management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff4444]/10 border border-[#ff4444]/30 text-xs text-[#ff6b6b]">
          <AlertCircle size={13} />
          <span className="font-semibold">RESTRICTED — SUPER ADMIN ONLY</span>
        </div>
      </div>

      {/* Regional Nodes */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={15} className="text-[#00ffcc]" />
          <h2 className="text-sm font-semibold font-display text-white">Regional Node Status</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {regions.map((r) => (
            <div key={r.code} className={`p-4 rounded-xl border ${r.status === "warning" ? "border-[#ffbc7c]/30 bg-[#ffbc7c]/05" : "border-[rgba(0,255,204,0.12)] bg-[#0b2f2d]/30"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50 font-mono">{r.code}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === "warning" ? "chip-warning" : "chip-active"}`}>
                  {r.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#b9cbc2]/60">Users</span>
                  <span className="text-white font-semibold">{r.users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#b9cbc2]/60">Latency</span>
                  <span className="text-[#00ffcc]">{r.latency}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#b9cbc2]/60">Load</span>
                  <div className="flex-1 h-1.5 bg-[#0b2f2d] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${r.load > 80 ? "bg-[#ffbc7c]" : "bg-[#00ffcc]"}`}
                      style={{ width: `${r.load}%` }}
                    />
                  </div>
                  <span className={r.load > 80 ? "text-[#ffbc7c]" : "text-[#b9cbc2]"}>{r.load}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Switches */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={15} className="text-[#00ffcc]" />
          <h2 className="text-sm font-semibold font-display text-white">System-Wide Controls</h2>
        </div>
        <p className="text-xs text-[#b9cbc2]/50 mb-5">Critical switches affect all users globally. Changes are logged and audited.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {systemSwitches.map((s) => {
            const isOn = switches[s.id];
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isOn ? "border-[#00ffcc]/20 bg-[#00ffcc]/05" : "border-[rgba(0,255,204,0.08)] bg-[#0b2f2d]/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {s.critical ? (
                    <AlertCircle size={15} className={isOn ? "text-[#00ffcc] mt-0.5" : "text-[#b9cbc2]/40 mt-0.5"} />
                  ) : (
                    <CheckCircle size={15} className={isOn ? "text-[#00ffcc] mt-0.5" : "text-[#b9cbc2]/40 mt-0.5"} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className="text-[10px] text-[#b9cbc2]/50 leading-relaxed">{s.desc}</p>
                    {s.critical && <span className="text-[9px] font-bold text-[#ff6b6b] uppercase tracking-wide">Critical</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(s.id, s.critical)}
                  className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ml-3 ${isOn ? "bg-[#00ffcc]" : "bg-[#163835]"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isOn ? "left-6" : "left-1"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ff4444]/15 border border-[#ff4444]/30 flex items-center justify-center">
                <AlertCircle size={18} className="text-[#ff6b6b]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">Confirm Critical Change</h3>
                <p className="text-xs text-[#b9cbc2]/60">This action will affect all users globally.</p>
              </div>
            </div>
            <p className="text-sm text-[#b9cbc2] mb-5">
              You are about to toggle <strong className="text-white">{systemSwitches.find(s => s.id === confirmId)?.label}</strong>.
              This is a critical system control. Are you sure?
            </p>
            <div className="flex items-center gap-3">
              <button onClick={confirmToggle} className="flex-1 py-2 rounded-lg bg-[#ff4444] text-white text-sm font-semibold hover:bg-[#cc3333] transition-all">
                Confirm Toggle
              </button>
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2 rounded-lg border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2] hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
