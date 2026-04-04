"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Edit2, Save, X } from "lucide-react";

const STAFF = [
  { id: 1, name: "Sarah Mitchell", email: "sarah.m@noblefunded.com", role: "Compliance", active: true },
  { id: 2, name: "James Okafor", email: "james.o@noblefunded.com", role: "Support", active: true },
  { id: 3, name: "Priya Sharma", email: "priya.s@noblefunded.com", role: "Marketing", active: true },
  { id: 4, name: "Leo Brandt", email: "leo.b@noblefunded.com", role: "Developer", active: false },
  { id: 5, name: "Aisha Bello", email: "aisha.b@noblefunded.com", role: "Support", active: true },
];

type PermMap = Record<string, Record<string, boolean>>;

const DEFAULT_PERMS: PermMap = {
  Compliance: { view_users: true, edit_users: false, approve_payouts: true, reject_payouts: true, view_reports: true, manage_settings: false },
  Support: { view_users: true, edit_users: true, approve_payouts: false, reject_payouts: false, view_reports: false, manage_settings: false },
  Marketing: { view_users: false, edit_users: false, approve_payouts: false, reject_payouts: false, view_reports: true, manage_settings: false },
  Developer: { view_users: true, edit_users: false, approve_payouts: false, reject_payouts: false, view_reports: true, manage_settings: true },
};

const PERM_LABELS: Record<string, string> = {
  view_users: "View Users",
  edit_users: "Edit Users",
  approve_payouts: "Approve Payouts",
  reject_payouts: "Reject Payouts",
  view_reports: "View Reports",
  manage_settings: "Manage Settings",
};

export default function StaffPermissions() {
  const [selected, setSelected] = useState(STAFF[0]);
  const [perms, setPerms] = useState<PermMap>(DEFAULT_PERMS);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePerm = (perm: string) => {
    if (!editing) return;
    setPerms(prev => ({
      ...prev,
      [selected.role]: {
        ...prev[selected.role],
        [perm]: !prev[selected.role][perm],
      },
    }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentPerms = perms[selected.role] || {};

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Staff Permissions</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Manage role-based access control for all admin staff</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold hover:bg-[#00d4a8] btn-primary transition-all">
          <Plus size={14} /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Staff List */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Staff Members</h2>
          <div className="space-y-2">
            {STAFF.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setEditing(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selected.id === s.id
                    ? "bg-[#00ffcc]/10 border border-[#00ffcc]/25"
                    : "bg-[#0b2f2d]/20 border border-[rgba(0,255,204,0.06)] hover:border-[#00ffcc]/15"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0b2f2d] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#00ffcc]">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{s.name}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50">{s.role}</p>
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.active ? "bg-[#00ffcc]" : "bg-[#b9cbc2]/30"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Permission Editor */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-display text-white">{selected.name}</h2>
              <p className="text-xs text-[#b9cbc2]/50">{selected.email} · Role: {selected.role}</p>
            </div>
            <div className="flex items-center gap-2">
              {saved && <span className="text-xs text-[#00ffcc] flex items-center gap-1"><Save size={12} /> Saved</span>}
              {editing ? (
                <>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ffcc] text-[#001716] text-xs font-semibold btn-primary transition-all">
                    <Save size={12} /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#b9cbc2] hover:text-white transition-all">
                    <X size={12} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
                  <Edit2 size={12} /> Edit Permissions
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-lg bg-[#00ffcc]/04 border border-[#00ffcc]/10">
            <ShieldCheck size={15} className="text-[#00ffcc] flex-shrink-0" />
            <p className="text-xs text-[#b9cbc2]">
              These permissions apply to the <strong className="text-white">{selected.role}</strong> role. Changing them affects all staff with this role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(PERM_LABELS).map(([key, label]) => {
              const enabled = currentPerms[key] ?? false;
              return (
                <div
                  key={key}
                  onClick={() => togglePerm(key)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    editing ? "cursor-pointer" : "cursor-default"
                  } ${
                    enabled
                      ? "bg-[#00ffcc]/06 border-[#00ffcc]/25"
                      : "bg-[#0b2f2d]/30 border-[rgba(0,255,204,0.08)]"
                  }`}
                >
                  <span className={`text-sm font-medium ${enabled ? "text-white" : "text-[#b9cbc2]/60"}`}>{label}</span>
                  <div className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${enabled ? "bg-[#00ffcc]" : "bg-[#0b2f2d]"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
