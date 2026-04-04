"use client";

import { useState } from "react";
import { Search, Filter, UserPlus, MoreVertical, TrendingUp, TrendingDown, Users, Activity, AlertTriangle, X, Ban, Shield, Eye, Mail, Phone, MapPin, CreditCard, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  type: string;
  balance: string;
  perf: string;
  positive: boolean;
  status: string;
  kyc: string;
  joined: string;
  totalChallenges: number;
  passed: number;
  failed: number;
  totalSpent: string;
  totalEarned: string;
}

const users: User[] = [
  { id: "#NF-89210", name: "Felix Henderson", email: "felix.h@tradenet.io", phone: "+234 812 000 0001", country: "Nigeria", type: "FUNDED", balance: "$100,000", perf: "+4.2%", status: "Active", positive: true, kyc: "Verified", joined: "2025-08-14", totalChallenges: 3, passed: 2, failed: 1, totalSpent: "₦255,000", totalEarned: "₦1,200,000" },
  { id: "#NF-89211", name: "Sarah Valerius", email: "s.valerius@fintech.com", phone: "+234 803 111 2222", country: "Nigeria", type: "PHASE 2", balance: "$50,000", perf: "-1.8%", status: "Flagged", positive: false, kyc: "Verified", joined: "2025-09-01", totalChallenges: 2, passed: 1, failed: 1, totalSpent: "₦90,000", totalEarned: "₦0" },
  { id: "#NF-89212", name: "Marcus Thorne", email: "mthorne@protrader.net", phone: "+44 7900 111 222", country: "UK", type: "PHASE 1", balance: "$25,000", perf: "+0.5%", status: "Inactive", positive: true, kyc: "Pending", joined: "2025-10-20", totalChallenges: 1, passed: 0, failed: 0, totalSpent: "$199", totalEarned: "$0" },
  { id: "#NF-89213", name: "Ayo Tobi", email: "ayo.tobi@gmail.com", phone: "+234 807 222 3333", country: "Nigeria", type: "FUNDED", balance: "$200,000", perf: "+8.2%", status: "Active", positive: true, kyc: "Verified", joined: "2025-07-05", totalChallenges: 5, passed: 4, failed: 1, totalSpent: "₦425,000", totalEarned: "₦3,200,000" },
  { id: "#NF-89214", name: "Elena Vasquez", email: "e.vasquez@invest.io", phone: "+52 55 1234 5678", country: "Mexico", type: "PHASE 2", balance: "$50,000", perf: "-3.4%", status: "Flagged", positive: false, kyc: "Rejected", joined: "2025-11-02", totalChallenges: 2, passed: 1, failed: 1, totalSpent: "$298", totalEarned: "$0" },
  { id: "#NF-89215", name: "James Okafor", email: "j.okafor@trader.ng", phone: "+234 818 333 4444", country: "Nigeria", type: "PHASE 1", balance: "$25,000", perf: "+1.1%", status: "Active", positive: true, kyc: "Verified", joined: "2026-01-10", totalChallenges: 1, passed: 0, failed: 0, totalSpent: "₦45,000", totalEarned: "₦0" },
  { id: "#NF-89216", name: "Priya Sharma", email: "p.sharma@fundedtrader.in", phone: "+91 99887 77665", country: "India", type: "FUNDED", balance: "$100,000", perf: "+5.7%", status: "Active", positive: true, kyc: "Verified", joined: "2025-09-18", totalChallenges: 4, passed: 3, failed: 1, totalSpent: "$597", totalEarned: "$3,800" },
  { id: "#NF-89217", name: "David Kowalski", email: "d.kowalski@broker.net", phone: "+48 600 111 222", country: "Poland", type: "PHASE 1", balance: "$25,000", perf: "-0.9%", status: "Inactive", positive: false, kyc: "Pending", joined: "2026-02-14", totalChallenges: 1, passed: 0, failed: 0, totalSpent: "$99", totalEarned: "$0" },
];

const statusStyles: Record<string, string> = {
  Active: "chip-active",
  Flagged: "chip-danger",
  Inactive: "chip-neutral",
  Banned: "bg-[#7f1d1d]/40 text-[#ff4444] border border-[#ff4444]/30",
};

const typeStyles: Record<string, string> = {
  FUNDED: "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20",
  "PHASE 2": "bg-[#ffbc7c]/10 text-[#ffbc7c] border border-[#ffbc7c]/20",
  "PHASE 1": "bg-[#b9cbc2]/10 text-[#b9cbc2] border border-[#b9cbc2]/20",
};

const kycStyles: Record<string, string> = {
  Verified: "text-[#00ffcc]",
  Pending: "text-[#f59e0b]",
  Rejected: "text-[#ff4444]",
};

interface UsersViewProps {
  onViewTrader?: (traderId: string) => void;
}

export default function UsersView({ onViewTrader }: UsersViewProps = {}) {
  const [allUsers, setAllUsers] = useState<User[]>(users);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [accountFilter, setAccountFilter] = useState("All Types");
  const [page, setPage] = useState(1);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || u.status === statusFilter;
    const matchType = accountFilter === "All Types" || u.type === accountFilter;
    return matchSearch && matchStatus && matchType;
  });

  const banUser = (id: string) => {
    setAllUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" } : u));
    setActionMenuId(null);
    if (detailUser?.id === id) setDetailUser((prev) => prev ? { ...prev, status: prev.status === "Banned" ? "Active" : "Banned" } : null);
  };

  const flagUser = (id: string) => {
    setAllUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "Flagged" ? "Active" : "Flagged" } : u));
    setActionMenuId(null);
  };

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white text-balance">User Management</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Oversee global trader accounts and verification pipelines.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold hover:bg-[#00d4a8] transition-all"
        >
          <UserPlus size={15} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Users", value: "14,209", sub: "+12% from last month", icon: Users, color: "#b9cbc2" },
          { label: "Active Traders", value: "8,432", sub: "Live accounts in profit", icon: Activity, color: "#00ffcc" },
          { label: "Verification Pending", value: "142", sub: "Requires review", icon: AlertTriangle, color: "#ffbc7c" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#b9cbc2]/60 mb-1">{s.label}</p>
              <p className="text-2xl font-bold font-display text-white">{s.value}</p>
              <p className="text-[10px] mt-1" style={{ color: s.color }}>{s.sub}</p>
            </div>
            <s.icon size={32} style={{ color: s.color, opacity: 0.2 }} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Name, ID, or Email..."
            className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
            {["All Status", "Active", "Flagged", "Inactive", "Banned"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">Account:</span>
          <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} className="bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
            {["All Types", "FUNDED", "PHASE 2", "PHASE 1"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => { setSearch(""); setStatusFilter("All Status"); setAccountFilter("All Types"); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-sm hover:text-white transition-all">
          <Filter size={13} /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["USER ID", "TRADER", "ACCOUNT TYPE", "BALANCE", "PERFORMANCE", "KYC", "STATUS", ""].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)] transition-all cursor-pointer" onClick={() => setDetailUser(user)}>
                <td className="px-4 py-3.5"><span className="text-xs text-[#00ffcc] font-mono">{user.id}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b2f2d] to-[#00201e] border border-[rgba(0,255,204,0.15)] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-[10px] text-[#b9cbc2]/50">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className={cn("text-[10px] font-semibold px-2 py-1 rounded-md", typeStyles[user.type])}>{user.type}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm font-semibold font-display text-white">{user.balance}</span></td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-sm font-semibold font-display flex items-center gap-1 w-fit", user.positive ? "text-[#00ffcc]" : "text-[#ff6b6b]")}>
                    {user.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{user.perf}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-xs font-medium", kycStyles[user.kyc])}>{user.kyc}</span>
                </td>
                <td className="px-4 py-3.5"><span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", statusStyles[user.status] || "chip-neutral")}>{user.status}</span></td>
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 transition-all"
                    >
                      <MoreVertical size={14} className="text-[#b9cbc2]/50" />
                    </button>
                    {actionMenuId === user.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 w-40 glass-card rounded-xl overflow-hidden z-50">
                          <button onClick={() => { setDetailUser(user); setActionMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#b9cbc2] hover:text-white hover:bg-[#00ffcc]/05 transition-all">
                            <Eye size={12} /> View Details
                          </button>
                          {onViewTrader && (
                            <button onClick={() => { onViewTrader(user.id); setActionMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
                              <Eye size={12} /> Full Profile
                            </button>
                          )}
                          <button onClick={() => flagUser(user.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#f59e0b] hover:bg-[#f59e0b]/05 transition-all">
                            <AlertTriangle size={12} /> {user.status === "Flagged" ? "Unflag" : "Flag"} User
                          </button>
                          <button onClick={() => banUser(user.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#ff6b6b] hover:bg-[#ff4444]/05 transition-all">
                            <Ban size={12} /> {user.status === "Banned" ? "Unban" : "Ban"} User
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,255,204,0.06)]">
          <p className="text-xs text-[#b9cbc2]/60">Showing <span className="text-white font-medium">1–{filtered.length}</span> of <span className="text-white font-medium">14,209</span> users</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn("w-7 h-7 rounded-lg text-xs font-semibold transition-all", page === p ? "bg-[#00ffcc] text-[#001716]" : "text-[#b9cbc2] hover:bg-[#0b2f2d]")}>{p}</button>
            ))}
            <span className="text-[#b9cbc2]/40 text-xs px-1">...</span>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDetailUser(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-xl mx-4 space-y-5" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2f2d] to-[#00201e] border border-[#00ffcc]/20 flex items-center justify-center text-sm font-bold text-[#00ffcc]">
                  {detailUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-white font-bold font-display text-lg">{detailUser.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#00ffcc]">{detailUser.id}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-semibold", statusStyles[detailUser.status] || "chip-neutral")}>{detailUser.status}</span>
                    <span className={cn("text-[10px] font-medium flex items-center gap-1", kycStyles[detailUser.kyc])}>
                      <Shield size={10} /> {detailUser.kyc}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailUser(null)} className="text-[#b9cbc2]/50 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                <Mail size={14} className="text-[#00ffcc]/60" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#b9cbc2]/40">Email</p>
                  <p className="text-xs text-white truncate">{detailUser.email}</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                <Phone size={14} className="text-[#00ffcc]/60" />
                <div>
                  <p className="text-[10px] text-[#b9cbc2]/40">Phone</p>
                  <p className="text-xs text-white">{detailUser.phone}</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                <MapPin size={14} className="text-[#00ffcc]/60" />
                <div>
                  <p className="text-[10px] text-[#b9cbc2]/40">Country</p>
                  <p className="text-xs text-white">{detailUser.country}</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                <Clock size={14} className="text-[#00ffcc]/60" />
                <div>
                  <p className="text-[10px] text-[#b9cbc2]/40">Joined</p>
                  <p className="text-xs text-white">{detailUser.joined}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Challenges", value: `${detailUser.totalChallenges}`, sub: `${detailUser.passed} passed / ${detailUser.failed} failed` },
                { label: "Total Spent", value: detailUser.totalSpent, sub: "on challenges" },
                { label: "Total Earned", value: detailUser.totalEarned, sub: "in payouts" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0b2f2d]/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#b9cbc2]/40 mb-0.5">{s.label}</p>
                  <p className="text-sm font-bold font-display text-white">{s.value}</p>
                  <p className="text-[10px] text-[#b9cbc2]/40">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {onViewTrader && (
                <button
                  onClick={() => { onViewTrader(detailUser.id); setDetailUser(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-semibold hover:bg-[#00e6b8] btn-primary transition-all"
                >
                  <Eye size={14} /> Full Profile
                </button>
              )}
              <button className={cn("flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-sm font-semibold hover:bg-[#00ffcc]/20 transition-all", onViewTrader ? "px-4" : "flex-1")}>
                <Mail size={14} /> Email User
              </button>
              <button
                onClick={() => banUser(detailUser.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                  detailUser.status === "Banned"
                    ? "bg-[#00ffcc]/10 border-[#00ffcc]/20 text-[#00ffcc] hover:bg-[#00ffcc]/20"
                    : "bg-[#ff4444]/10 border-[#ff4444]/20 text-[#ff6b6b] hover:bg-[#ff4444]/20"
                )}
              >
                <Ban size={14} /> {detailUser.status === "Banned" ? "Unban User" : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#b9cbc2]/50 hover:text-white"><X size={18} /></button>
            </div>
            {[
              { label: "Full Name", placeholder: "e.g. Adebayo Okafor" },
              { label: "Email Address", placeholder: "trader@email.com" },
              { label: "Phone Number", placeholder: "+234 800 000 0000" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">{f.label}</label>
                <input type="text" placeholder={f.placeholder} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white placeholder:text-[#b9cbc2]/30 focus:border-[#00ffcc]/40" />
              </div>
            ))}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Account Type</label>
              <select className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40">
                <option>PHASE 1</option><option>PHASE 2</option><option>FUNDED</option>
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all">Create Account</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl border border-[rgba(0,255,204,0.15)] text-[#b9cbc2] text-sm hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
