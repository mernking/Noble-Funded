"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { mockUser } from "@/lib/data"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Upload,
  ExternalLink,
  Smartphone,
  CreditCard,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsTab = "profile" | "security" | "notifications" | "kyc" | "paymentmethods"

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "kyc", label: "KYC / Verification", icon: Shield },
  { id: "paymentmethods", label: "Payment Methods", icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    country: mockUser.country,
  })
  const [notifSettings, setNotifSettings] = useState({
    payoutUpdates: true,
    challengeProgress: true,
    tradeAlerts: false,
    marketingEmails: false,
    smsAlerts: true,
    weeklyReport: true,
  })
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [savedMethods] = useState([
    { id: "bm1", type: "bank", name: "GTBank", accountNumber: "012••••••89", accountName: "Adebayo Ogundimu", primary: true },
    { id: "bm2", type: "bank", name: "Opay", accountNumber: "901••••••45", accountName: "Adebayo Ogundimu", primary: false },
  ])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardShell title="Settings" subtitle="Manage your account preferences and security">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tab sidebar */}
          <aside className="lg:w-52 shrink-0">
            <div className="glass-card p-2 space-y-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    activeTab === tab.id
                      ? "bg-[rgba(20,184,166,0.12)] text-[#5eead4] border border-[rgba(94,234,212,0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-[rgba(20,184,166,0.06)]"
                  )}
                >
                  <tab.icon size={16} className="shrink-0" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight size={13} className="ml-auto opacity-60" />}
                </button>
              ))}
            </div>
          </aside>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="glass-card p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Update your profile details and personal information.</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shrink-0" style={{ background: "rgba(13,148,136,0.25)", color: "#5eead4", border: "2px solid rgba(94,234,212,0.2)" }}>
                    {mockUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mockUser.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">Member since {new Date(mockUser.joinedAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}</p>
                    <button className="flex items-center gap-1.5 text-xs text-[#5eead4] px-3 py-1.5 rounded-lg transition-colors" style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(94,234,212,0.15)" }}>
                      <Upload size={12} />
                      Upload Photo
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                        type="email"
                        className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Country</label>
                    <div className="relative">
                      <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={profileForm.country}
                        onChange={(e) => setProfileForm((f) => ({ ...f, country: e.target.value }))}
                        className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors appearance-none"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-[#4ade80]">
                      <CheckCircle2 size={15} />
                      Changes saved!
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="ml-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-4">
                {/* Change Password */}
                <div className="glass-card p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Use a strong, unique password for your account.</p>
                  </div>
                  <div className="space-y-3 max-w-md">
                    {[
                      { label: "Current Password", placeholder: "Enter current password" },
                      { label: "New Password", placeholder: "At least 8 characters" },
                      { label: "Confirm New Password", placeholder: "Re-enter new password" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="text-xs text-muted-foreground block mb-1.5 font-medium">{f.label}</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder={f.placeholder}
                            className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-9 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="glass-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone size={18} className="text-[#a7ffeb]" />
                        <h3 className="font-bold text-foreground">Two-Factor Authentication</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security. We strongly recommend enabling 2FA for your account.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <button
                        onClick={() => setTwoFaEnabled(!twoFaEnabled)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
                          twoFaEnabled ? "bg-[#a7ffeb]" : "bg-[rgba(167,255,235,0.15)]"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300",
                            twoFaEnabled ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                  {twoFaEnabled && (
                    <div className="mt-4 p-4 bg-[rgba(74,222,128,0.06)] rounded-xl border border-[rgba(74,222,128,0.15)]">
                      <div className="flex items-center gap-2 text-sm text-[#4ade80]">
                        <CheckCircle2 size={16} />
                        <span className="font-semibold">2FA is enabled via Google Authenticator</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Sessions */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-foreground mb-1">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Devices currently logged into your account.</p>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome — Windows 11", location: "Lagos, Nigeria", time: "Now (current)", current: true },
                      { device: "Safari — iPhone 15", location: "Lagos, Nigeria", time: "2 hours ago", current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(167,255,235,0.03)] border border-[rgba(167,255,235,0.07)]">
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {s.device}
                            {s.current && (
                              <span className="text-[10px] bg-[rgba(74,222,128,0.12)] text-[#4ade80] px-2 py-0.5 rounded-full font-semibold">Current</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                        </div>
                        {!s.current && (
                          <button className="text-xs text-[#f87171] hover:underline">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="glass-card p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose how and when you want to be notified.</p>
                </div>

                <div className="space-y-1">
                  {[
                    { key: "payoutUpdates" as const, label: "Payout Updates", desc: "Receive notifications when your payout is processed or rejected." },
                    { key: "challengeProgress" as const, label: "Challenge Progress", desc: "Get alerts when you hit profit targets or approach drawdown limits." },
                    { key: "tradeAlerts" as const, label: "Trade Alerts", desc: "Notifications for individual trade opens and closes." },
                    { key: "smsAlerts" as const, label: "SMS Alerts", desc: "Receive important alerts via SMS to your registered number." },
                    { key: "weeklyReport" as const, label: "Weekly Performance Report", desc: "A summary of your trading activity every Monday." },
                    { key: "marketingEmails" as const, label: "Promotions & News", desc: "Updates about new challenges, discounts, and announcements." },
                  ].map((n) => (
                    <div key={n.key} className="flex items-start justify-between py-4 border-b border-[rgba(167,255,235,0.06)] last:border-0 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{n.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifSettings((s) => ({ ...s, [n.key]: !s[n.key] }))}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 shrink-0 mt-0.5",
                          notifSettings[n.key] ? "bg-[#a7ffeb]" : "bg-[rgba(167,255,235,0.12)]"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300",
                            notifSettings[n.key] ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all">
                    {saved ? "Saved!" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* KYC */}
            {activeTab === "kyc" && (
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.2)]">
                      <Shield size={24} className="text-[#4ade80]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">Identity Verification (KYC)</h3>
                      <p className="text-sm text-muted-foreground">
                        Your identity has been verified. This is required to receive payouts.
                      </p>
                    </div>
                    <div className="ml-auto shrink-0">
                      <span className="badge-active">Verified</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { step: "1", label: "Personal Info", status: "done" },
                      { step: "2", label: "ID Document", status: "done" },
                      { step: "3", label: "Selfie / Liveness", status: "done" },
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(74,222,128,0.06)] border border-[rgba(74,222,128,0.12)]">
                        <div className="w-7 h-7 rounded-full bg-[rgba(74,222,128,0.15)] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={16} className="text-[#4ade80]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Step {s.step}</p>
                          <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-bold text-foreground mb-1">Verified Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">Documents on file for your account.</p>
                  <div className="space-y-3">
                    {[
                      { label: "National ID Card", status: "Verified", date: "Nov 2024" },
                      { label: "Proof of Address", status: "Verified", date: "Nov 2024" },
                    ].map((d) => (
                      <div key={d.label} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(167,255,235,0.03)] border border-[rgba(167,255,235,0.07)]">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{d.label}</p>
                          <p className="text-xs text-muted-foreground">Submitted {d.date}</p>
                        </div>
                        <span className="badge-active">{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-4 border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.04)]">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-[#fbbf24] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">KYC required for payouts</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Identity verification is mandatory before any payout can be processed. Your account is fully verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT METHODS */}
            {activeTab === "paymentmethods" && (
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">Payment Methods</h3>
                      <p className="text-sm text-muted-foreground">Bank accounts and wallets for receiving payouts.</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {savedMethods.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-4 rounded-xl border border-[rgba(167,255,235,0.1)] bg-[rgba(167,255,235,0.03)] hover:border-[rgba(167,255,235,0.2)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(167,255,235,0.08)] flex items-center justify-center">
                            <CreditCard size={18} className="text-[#a7ffeb]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{m.name}</p>
                              {m.primary && (
                                <span className="text-[10px] font-semibold bg-[rgba(167,255,235,0.1)] text-[#a7ffeb] px-2 py-0.5 rounded-full border border-[rgba(167,255,235,0.15)]">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{m.accountName} · {m.accountNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!m.primary && (
                            <button className="text-xs text-[#a7ffeb] hover:underline">Set Primary</button>
                          )}
                          <button className="text-xs text-[#f87171] hover:underline">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new */}
                  <div className="border border-dashed border-[rgba(167,255,235,0.2)] rounded-xl p-5 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Add Bank Account (Naira)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Bank Name", placeholder: "e.g. GTBank, Access, Opay" },
                        { label: "Account Number", placeholder: "10-digit account number" },
                        { label: "Account Name", placeholder: "As registered with bank" },
                      ].map((f) => (
                        <div key={f.label} className={f.label === "Account Name" ? "sm:col-span-2" : ""}>
                          <label className="text-xs text-muted-foreground block mb-1.5">{f.label}</label>
                          <input
                            placeholder={f.placeholder}
                            className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all">
                      Add Account
                    </button>
                  </div>
                </div>

                {/* Crypto wallets */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-foreground mb-1">Crypto Wallets (Dollar Accounts)</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add a wallet for receiving USDT payouts.</p>
                  <div className="border border-dashed border-[rgba(167,255,235,0.2)] rounded-xl p-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Wallet Address", placeholder: "0x... or T..." },
                        { label: "Network", placeholder: "e.g. TRC20, ERC20" },
                      ].map((f) => (
                        <div key={f.label}>
                          <label className="text-xs text-muted-foreground block mb-1.5">{f.label}</label>
                          <input
                            placeholder={f.placeholder}
                            className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all">
                      Save Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
