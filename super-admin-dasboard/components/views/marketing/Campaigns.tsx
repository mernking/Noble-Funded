"use client";

import { useState } from "react";
import { Plus, Play, Pause, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const campaigns = [
  { id: "C-001", name: "Q1 Referral Bonus", type: "Referral", status: "Active", budget: "$5,000", spent: "$3,200", conversions: 284, startDate: "Mar 1", endDate: "Mar 31" },
  { id: "C-002", name: "Funded Trader Launch", type: "Social", status: "Active", budget: "$8,000", spent: "$5,100", conversions: 412, startDate: "Mar 10", endDate: "Apr 10" },
  { id: "C-003", name: "Email Re-engagement", type: "Email", status: "Paused", budget: "$1,200", spent: "$880", conversions: 91, startDate: "Mar 15", endDate: "Mar 30" },
  { id: "C-004", name: "Google Ads — Phase 1", type: "Paid", status: "Active", budget: "$12,000", spent: "$7,400", conversions: 623, startDate: "Mar 1", endDate: "Apr 30" },
  { id: "C-005", name: "Instagram Awareness", type: "Social", status: "Draft", budget: "$3,500", spent: "$0", conversions: 0, startDate: "Apr 1", endDate: "Apr 30" },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "chip-active",
  Paused: "chip-warning",
  Draft: "chip-neutral",
};

export default function CampaignsView() {
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "Social", budget: "" });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Campaigns</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Manage and track all marketing campaigns.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <Plus size={14} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Active Campaigns", value: "3", color: "text-[#00ffcc]" },
          { label: "Total Budget", value: "$29.7K", color: "text-white" },
          { label: "Total Spent", value: "$16.6K", color: "text-[#ffbc7c]" },
          { label: "Total Conversions", value: "1,410", color: "text-[#00ffcc]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["CAMPAIGN", "TYPE", "BUDGET", "SPENT", "CONVERSIONS", "DATES", "STATUS", ""].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50">{c.id}</p>
                </td>
                <td className="px-4 py-3.5"><span className="text-xs text-[#b9cbc2]">{c.type}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm font-semibold text-white">{c.budget}</span></td>
                <td className="px-4 py-3.5">
                  <div>
                    <span className="text-sm font-semibold text-[#ffbc7c]">{c.spent}</span>
                    {c.budget !== "$0" && (
                      <div className="mt-1 w-16 h-1 bg-[#0b2f2d] rounded-full overflow-hidden">
                        <div className="h-full bg-[#ffbc7c] rounded-full" style={{ width: `${(parseFloat(c.spent.replace(/[$,]/g, "")) / parseFloat(c.budget.replace(/[$,]/g, ""))) * 100}%` }} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="text-sm font-semibold text-[#00ffcc]">{c.conversions.toLocaleString()}</span></td>
                <td className="px-4 py-3.5">
                  <p className="text-[10px] text-[#b9cbc2]/60">{c.startDate} — {c.endDate}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_STYLES[c.status])}>{c.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    {c.status === "Active" && <button className="p-1.5 rounded-lg hover:bg-[#ffbc7c]/10 text-[#b9cbc2]/50 hover:text-[#ffbc7c] transition-all"><Pause size={12} /></button>}
                    {c.status === "Paused" && <button className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 text-[#b9cbc2]/50 hover:text-[#00ffcc] transition-all"><Play size={12} /></button>}
                    <button className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 text-[#b9cbc2]/50 hover:text-[#00ffcc] transition-all"><Edit2 size={12} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[#ff4444]/10 text-[#b9cbc2]/50 hover:text-[#ff6b6b] transition-all"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold font-display text-white mb-4">Create Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Campaign Name</label>
                <input value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. Spring Challenge Promo" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Type</label>
                <select value={newCampaign.type} onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })} className="w-full bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
                  {["Social", "Email", "Paid", "Referral", "Content"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Budget</label>
                <input value={newCampaign.budget} onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" placeholder="$5,000" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2]">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-bold btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
