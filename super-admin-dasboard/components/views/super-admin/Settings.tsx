"use client";

import { useState } from "react";
import { Save, RefreshCw, Shield, Bell, CreditCard, Globe, Lock, Zap } from "lucide-react";

export default function SettingsView() {
  const [profitSplit, setProfitSplit] = useState(80);
  const [maxDrawdown, setMaxDrawdown] = useState(10);
  const [dailyDrawdown, setDailyDrawdown] = useState(5);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [autoPayouts, setAutoPayouts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-all ${value ? "bg-[#00ffcc]" : "bg-[#0b2f2d] border border-[rgba(0,255,204,0.2)]"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#001716] transition-all ${value ? "left-5" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">System Settings</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Configure platform-wide parameters and operational limits.</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold"
        >
          {saved ? <><RefreshCw size={14} className="animate-spin" /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trading Parameters */}
        <div className="glass-card rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-[#00ffcc]" />
            <h2 className="text-sm font-semibold font-display text-white">Trading Parameters</h2>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#b9cbc2]/70">Profit Split</label>
              <span className="text-lg font-bold font-display text-[#00ffcc]">{profitSplit}%</span>
            </div>
            <input type="range" min={50} max={95} value={profitSplit} onChange={(e) => setProfitSplit(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-[#b9cbc2]/40 mt-1"><span>50%</span><span>95%</span></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#b9cbc2]/70">Max Drawdown Limit</label>
              <span className="text-lg font-bold font-display text-[#ffbc7c]">{maxDrawdown}%</span>
            </div>
            <input type="range" min={5} max={20} value={maxDrawdown} onChange={(e) => setMaxDrawdown(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-[#b9cbc2]/40 mt-1"><span>5%</span><span>20%</span></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#b9cbc2]/70">Daily Drawdown Limit</label>
              <span className="text-lg font-bold font-display text-[#ff6b6b]">{dailyDrawdown}%</span>
            </div>
            <input type="range" min={2} max={10} value={dailyDrawdown} onChange={(e) => setDailyDrawdown(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-[#b9cbc2]/40 mt-1"><span>2%</span><span>10%</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Min Challenge Size</label>
              <input defaultValue="$10,000" className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Max Challenge Size</label>
              <input defaultValue="$400,000" className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-[#00ffcc]" />
            <h2 className="text-sm font-semibold font-display text-white">Security & Access</h2>
          </div>

          {[
            { label: "Two-Factor Authentication", sub: "Require 2FA for all admin logins", value: twoFA, onChange: setTwoFA },
            { label: "Automated Payout Processing", sub: "Auto-approve payouts under $5,000", value: autoPayouts, onChange: setAutoPayouts },
            { label: "Maintenance Mode", sub: "Temporarily disable user trading", value: maintenanceMode, onChange: setMaintenanceMode, danger: true },
            { label: "Email Alerts", sub: "System-wide alert notifications", value: emailAlerts, onChange: setEmailAlerts },
          ].map((setting) => (
            <div key={setting.label} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${setting.danger && setting.value ? "border-[#ff4444]/30 bg-[#ff4444]/05" : "border-[rgba(0,255,204,0.08)] bg-[#0b2f2d]/20"}`}>
              <div>
                <p className={`text-sm font-medium ${setting.danger && setting.value ? "text-[#ff6b6b]" : "text-white"}`}>{setting.label}</p>
                <p className="text-[10px] text-[#b9cbc2]/50 mt-0.5">{setting.sub}</p>
              </div>
              <Toggle value={setting.value} onChange={setting.onChange} />
            </div>
          ))}
        </div>

        {/* Payout Settings */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={16} className="text-[#00ffcc]" />
            <h2 className="text-sm font-semibold font-display text-white">Payout Configuration</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Min Payout Amount", value: "$100" },
              { label: "Max Single Payout", value: "$50,000" },
              { label: "Processing Days", value: "2 Days" },
              { label: "Default Currency", value: "USD" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">{f.label}</label>
                <input defaultValue={f.value} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Payment Methods</label>
            <div className="flex flex-wrap gap-2">
              {["Bank Transfer", "USDT (TRC20)", "USDC", "Crypto"].map((m) => (
                <span key={m} className="chip-active text-[10px] px-2.5 py-1 rounded-full font-semibold">{m}</span>
              ))}
              <button className="text-[10px] px-2.5 py-1 rounded-full border border-dashed border-[rgba(0,255,204,0.2)] text-[#b9cbc2]/50 hover:border-[#00ffcc]/40 hover:text-[#00ffcc] transition-all">+ Add Method</button>
            </div>
          </div>
        </div>

        {/* API & Integration */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-[#00ffcc]" />
            <h2 className="text-sm font-semibold font-display text-white">API & Integrations</h2>
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Live API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-[#b9cbc2]/50 font-mono truncate">
                sk-nf-live-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </div>
              <button className="px-3 py-2 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05">
                <Lock size={12} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Webhook URL</label>
            <input defaultValue="https://api.noblefunded.com/webhooks/events" className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div className="space-y-2">
            {["MetaTrader 5 Integration", "Stripe Payments", "SendGrid Email", "Slack Alerts"].map((int, i) => (
              <div key={int} className="flex items-center justify-between py-2 border-t border-[rgba(0,255,204,0.05)]">
                <span className="text-xs text-[#b9cbc2]">{int}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${i < 3 ? "chip-active" : "chip-neutral"}`}>
                  {i < 3 ? "CONNECTED" : "DISABLED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-[#00ffcc]" />
          <h2 className="text-sm font-semibold font-display text-white">Notification Triggers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "New user registration", "Challenge completion", "Payout requested",
            "Drawdown alert triggered", "Failed KYC verification", "System anomaly detected",
          ].map((trigger) => (
            <label key={trigger} className="flex items-center gap-3 p-3 rounded-xl bg-[#0b2f2d]/30 border border-[rgba(0,255,204,0.06)] cursor-pointer hover:border-[#00ffcc]/20 transition-all">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#00ffcc]" />
              <span className="text-xs text-[#b9cbc2]">{trigger}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
