"use client";

import { useState } from "react";
import { UserPlus, Search, Shield, Ban, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const staff = [
  { id: "NT-8829-X", name: "Alexander Thorne", role: "Admin", status: "VERIFIED", activity: "2 mins ago", ip: "192.168.1.44" },
  { id: "NT-4421-Y", name: "Elena Rodriguez", role: "Developer", status: "VERIFIED", activity: "14 mins ago", ip: "45.12.98.22" },
  { id: "NT-0912-C", name: "Sarah Jenkins", role: "Compliance", status: "FLAGGED", activity: "1 hour ago", ip: "82.33.11.04" },
  { id: "NT-3301-S", name: "Marcus Chen", role: "Support", status: "SUSPENDED", activity: "3 days ago", ip: "22.109.4.19" },
  { id: "NT-5512-M", name: "Priya Sharma", role: "Marketing", status: "VERIFIED", activity: "Just now", ip: "104.22.8.91" },
];

const statusStyles: Record<string, string> = {
  VERIFIED: "chip-active",
  FLAGGED: "chip-warning",
  SUSPENDED: "chip-danger",
};

interface TeamViewProps {
  onViewStaff?: (staffId: string) => void;
}

export default function TeamView({ onViewStaff }: TeamViewProps = {}) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "Support", email: "" });

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Team Management</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Orchestrate institutional access levels and monitor internal administrative footprints.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <UserPlus size={14} /> Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Total Staff", value: "124" },
          { label: "Active Sessions", value: "18" },
          { label: "Admin Overrides", value: "03", color: "text-[#ffbc7c]" },
          { label: "System Health", value: "99.9%", color: "text-[#00ffcc]" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color || "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Directory */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,255,204,0.08)] flex-wrap gap-3">
          <h2 className="text-sm font-semibold font-display text-white">Personnel Directory</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parameters..." className="input-field bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-[#b9cbc2]/30 w-full sm:w-52" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.06)]">
              {["Staff Member", "Institutional Role", "Security Status", "Last Activity", "Administrative Actions"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ffcc]/20 to-[#0b2f2d] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-[10px] text-[#b9cbc2]/40">ID: {s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-[#b9cbc2]">{s.role}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", statusStyles[s.status])}>• {s.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-xs text-[#b9cbc2]/70">{s.activity}</p>
                  <p className="text-[10px] text-[#b9cbc2]/40">IP: {s.ip}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {onViewStaff && (
                      <button
                        onClick={() => onViewStaff(s.id)}
                        className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 text-[#00ffcc]/60 hover:text-[#00ffcc] transition-all"
                      >
                        <Eye size={13} />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 text-[#00ffcc]/60 hover:text-[#00ffcc] transition-all">
                      <Shield size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[#ff4444]/10 text-[#b9cbc2]/40 hover:text-[#ff6b6b] transition-all">
                      <Ban size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)] text-xs text-[#b9cbc2]/50">
          Showing {filtered.length} of 124 personnel
        </div>
      </div>

      {/* Access Distribution + Security Protocol */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold font-display text-white mb-4">Access Tier Distribution</h3>
          <div className="space-y-3">
            {[
              { label: "Administrative Core", pct: 12 },
              { label: "Development & Engineering", pct: 45 },
              { label: "Compliance & Audit", pct: 28 },
              { label: "Support & Marketing", pct: 15 },
            ].map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] tracking-widest text-[#b9cbc2]/60 uppercase">{t.label}</span>
                  <span className="text-xs text-[#00ffcc] font-semibold">{t.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#0b2f2d] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00ffcc] to-[#00d4a8] rounded-full transition-all" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold font-display text-white mb-3">Security Protocol</h3>
          <p className="text-xs text-[#b9cbc2]/60 leading-relaxed mb-4">
            All administrative actions are recorded on an immutable ledger. Multi-factor authentication is mandatory for all access tiers NT-3 and above.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00ffcc]/05 border border-[#00ffcc]/15">
            <Shield size={18} className="text-[#00ffcc]" />
            <div>
              <p className="text-xs font-semibold text-[#00ffcc]">AES-256 PROTOCOL</p>
              <p className="text-[10px] text-[#b9cbc2]/50">ACTIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold font-display text-white mb-4">Add Staff Member</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1.5 block">Full Name</label>
                <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1.5 block">Email</label>
                <input value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" placeholder="staff@noblefunded.com" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1.5 block">Role</label>
                <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="w-full bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
                  {["Admin", "Compliance", "Support", "Marketing", "Developer"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2]">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-bold btn-primary">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
