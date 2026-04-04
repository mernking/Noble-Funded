"use client";

import { useState } from "react";
import {
  User, Lock, Bell, Shield, Save, Eye, EyeOff,
  Camera, Mail, Phone, Globe, CheckCircle, AlertTriangle,
  Smartphone, Key, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/types";

const ROLE_COLORS: Record<Role, string> = {
  "Super Admin": "#00ffcc",
  "Compliance": "#60a5fa",
  "Support": "#f59e0b",
  "Marketing": "#a78bfa",
  "Developer": "#34d399",
};

const ROLE_LABELS: Record<Role, string> = {
  "Super Admin": "Super Administrator",
  "Compliance": "Compliance Officer",
  "Support": "Customer Support Agent",
  "Marketing": "Marketing Analyst",
  "Developer": "Backend Developer",
};

interface AccountSettingsProps {
  role?: Role;
  onSignOut?: () => void;
}

type Tab = "profile" | "security" | "notifications" | "sessions";

export default function AccountSettings({ role = "Super Admin", onSignOut }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [payoutNotifs, setPayoutNotifs] = useState(role === "Super Admin" || role === "Compliance");
  const [systemAlerts, setSystemAlerts] = useState(role === "Super Admin" || role === "Developer");
  const [emailNotifs, setEmailNotifs] = useState(true);

  const roleColor = ROLE_COLORS[role];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
      style={
        value
          ? { background: roleColor, boxShadow: `0 0 8px ${roleColor}50` }
          : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
      }
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md"
        style={{ left: value ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "sessions", label: "Sessions", icon: Smartphone },
  ];

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Account Settings</h1>
          <p className="text-[13px] text-[#a8c0b8]/60 mt-0.5">Manage your profile, security, and notification preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold font-display transition-all"
          style={{ background: roleColor, color: "#010e0d" }}
        >
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left: Profile Card + Navigation */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile card */}
          <div className="glass-card-elevated rounded-2xl p-5 text-center">
            <div className="relative inline-block mb-3">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold font-display mx-auto"
                style={{
                  background: `linear-gradient(135deg, ${roleColor}30, ${roleColor}10)`,
                  border: `2px solid ${roleColor}35`,
                  color: roleColor,
                  boxShadow: `0 8px 24px ${roleColor}15`,
                }}
              >
                AN
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center bg-[#0a2825] border border-[rgba(0,255,204,0.2)] hover:border-[rgba(0,255,204,0.4)] transition-all"
              >
                <Camera size={12} className="text-[#a8c0b8]" />
              </button>
            </div>
            <p className="text-[15px] font-bold text-white font-display">Alexander Noble</p>
            <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">admin@noblefunded.com</p>
            <div
              className="mt-2 inline-block px-3 py-1 rounded-lg text-[11px] font-bold"
              style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}25` }}
            >
              {ROLE_LABELS[role]}
            </div>
          </div>

          {/* Tab navigation */}
          <div className="glass-card rounded-xl overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-[13px] transition-all border-b border-[rgba(0,255,204,0.05)] last:border-0",
                    activeTab === tab.id ? "text-white font-medium" : "text-[#a8c0b8] hover:text-white hover:bg-white/[0.03]"
                  )}
                  style={activeTab === tab.id ? { background: `${roleColor}12` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} style={{ color: activeTab === tab.id ? roleColor : undefined }} className={activeTab === tab.id ? "" : "opacity-50"} />
                    {tab.label}
                  </div>
                  <ChevronRight size={12} className="opacity-30" style={{ color: activeTab === tab.id ? roleColor : undefined }} />
                </button>
              );
            })}
          </div>

          {/* Sign out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium text-[#ff6b6b] border border-[#ff4444]/15 hover:bg-[#ff4444]/08 hover:border-[#ff4444]/25 transition-all"
          >
            <LogOut size={13} />
            Sign Out of Platform
          </button>
        </div>

        {/* Right: Settings panels */}
        <div className="lg:col-span-3">

          {/* ── PROFILE TAB ──────────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className="glass-card rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <User size={15} style={{ color: roleColor }} />
                <h2 className="text-[14px] font-semibold font-display text-white">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Alexander Noble", icon: User },
                  { label: "Display Name", value: "Alex Noble", icon: User },
                  { label: "Email Address", value: "admin@noblefunded.com", icon: Mail },
                  { label: "Phone Number", value: "+234 801 234 5678", icon: Phone },
                  { label: "Timezone", value: "Africa/Lagos (WAT, UTC+1)", icon: Globe },
                  { label: "Language", value: "English (UK)", icon: Globe },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase font-display block mb-1.5">{field.label}</label>
                    <div className="relative">
                      <field.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8c0b8]/35" />
                      <input
                        defaultValue={field.value}
                        className="input-field w-full bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/35"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase font-display block mb-1.5">Bio / Notes</label>
                <textarea
                  rows={3}
                  defaultValue="Noble Funded Super Administrator. Responsible for platform oversight and compliance."
                  className="input-field w-full bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/35 resize-none"
                />
              </div>

              {/* Role info (read only) */}
              <div
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: `${roleColor}08`, border: `1px solid ${roleColor}18` }}
              >
                <Shield size={15} style={{ color: roleColor }} />
                <div>
                  <p className="text-[12px] font-medium text-white">Access Level: <span style={{ color: roleColor }}>{ROLE_LABELS[role]}</span></p>
                  <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Role is assigned by the platform. Contact a Super Admin to change.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ─────────────────────────────────────────────── */}
          {activeTab === "security" && (
            <div className="space-y-4">
              {/* Change Password */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={15} style={{ color: roleColor }} />
                  <h2 className="text-[14px] font-semibold font-display text-white">Change Password</h2>
                </div>

                {[
                  { label: "Current Password", placeholder: "Enter current password" },
                  { label: "New Password", placeholder: "Minimum 12 characters" },
                  { label: "Confirm New Password", placeholder: "Repeat new password" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] tracking-widest text-[#a8c0b8]/50 uppercase font-display block mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={field.placeholder}
                        className="input-field w-full bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/30 pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8c0b8]/35 hover:text-[#a8c0b8] transition-all"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength */}
                <div>
                  <p className="text-[10px] text-[#a8c0b8]/40 mb-1.5">Password Strength</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= 3 ? roleColor : "rgba(255,255,255,0.06)" }} />
                    ))}
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: roleColor }}>Strong password</p>
                </div>

                <button
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold font-display transition-all"
                  style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}25` }}
                >
                  Update Password
                </button>
              </div>

              {/* 2FA + Security Toggles */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={15} style={{ color: roleColor }} />
                  <h2 className="text-[14px] font-semibold font-display text-white">Two-Factor Authentication</h2>
                </div>

                {[
                  { label: "2FA via Authenticator App", sub: "Use Google Authenticator or Authy", value: twoFA, onChange: setTwoFA },
                  { label: "Login Alert Emails", sub: "Get notified of new sign-ins", value: loginAlerts, onChange: setLoginAlerts },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-[rgba(0,255,204,0.07)]">
                    <div>
                      <p className="text-[13px] font-medium text-white">{item.label}</p>
                      <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">{item.sub}</p>
                    </div>
                    <Toggle value={item.value} onChange={item.onChange} />
                  </div>
                ))}

                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.18)" }}
                >
                  <AlertTriangle size={14} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-[#a8c0b8]/70 leading-relaxed">
                    We strongly recommend enabling 2FA. Admin accounts are high-value targets. Protecting your account protects all platform users.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ────────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Bell size={15} style={{ color: roleColor }} />
                <h2 className="text-[14px] font-semibold font-display text-white">Notification Preferences</h2>
              </div>
              <p className="text-[12px] text-[#a8c0b8]/50">Control which notifications you receive for your role.</p>

              <div className="space-y-2">
                {[
                  { label: "Email Notifications", sub: "Receive alerts via email", value: emailNotifs, onChange: setEmailNotifs, alwaysShow: true },
                  { label: "Payout Alerts", sub: "New payouts requiring review", value: payoutNotifs, onChange: setPayoutNotifs, alwaysShow: role === "Super Admin" || role === "Compliance" },
                  { label: "System Alerts", sub: "Platform errors and performance issues", value: systemAlerts, onChange: setSystemAlerts, alwaysShow: role === "Super Admin" || role === "Developer" },
                ].filter((item) => item.alwaysShow).map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-[rgba(0,255,204,0.07)]">
                    <div>
                      <p className="text-[13px] font-medium text-white">{item.label}</p>
                      <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">{item.sub}</p>
                    </div>
                    <Toggle value={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>

              <div
                className="p-3.5 rounded-xl text-[11px] text-[#a8c0b8]/60 leading-relaxed"
                style={{ background: `${roleColor}06`, border: `1px solid ${roleColor}15` }}
              >
                You only see notifications relevant to your <strong className="text-white">{role}</strong> role.
                Super Admin can access all platform notifications.
              </div>
            </div>
          )}

          {/* ── SESSIONS TAB ─────────────────────────────────────────────── */}
          {activeTab === "sessions" && (
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone size={15} style={{ color: roleColor }} />
                <h2 className="text-[14px] font-semibold font-display text-white">Active Sessions</h2>
              </div>
              <p className="text-[12px] text-[#a8c0b8]/50">Devices and locations currently signed in to your account.</p>

              <div className="space-y-2">
                {[
                  { device: "MacBook Pro 16\" — Chrome 121", location: "Lagos, Nigeria", time: "Current session", current: true },
                  { device: "iPhone 15 Pro — Safari Mobile", location: "Lagos, Nigeria", time: "2 hours ago", current: false },
                  { device: "Windows PC — Firefox 122", location: "Abuja, Nigeria", time: "1 day ago", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-[rgba(0,255,204,0.07)]">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0"
                        style={{ background: session.current ? `${roleColor}18` : "rgba(255,255,255,0.04)", border: `1px solid ${session.current ? `${roleColor}25` : "rgba(255,255,255,0.06)"}` }}
                      >
                        <Smartphone size={13} style={{ color: session.current ? roleColor : "#a8c0b8" }} />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-white">{session.device}</p>
                        <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">{session.location} — {session.time}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}25` }}
                      >
                        CURRENT
                      </span>
                    ) : (
                      <button className="text-[11px] text-[#ff6b6b] hover:text-[#ff4444] transition-all flex-shrink-0">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full py-2.5 rounded-xl text-[12px] font-medium text-[#ff6b6b] border border-[#ff4444]/15 hover:bg-[#ff4444]/08 transition-all">
                Sign Out All Other Sessions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
