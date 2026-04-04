"use client";

import { useState } from "react";
import { Search, MessageCircle, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tickets = [
  { id: "TKT-5021", user: "Felix Henderson", email: "felix.h@tradenet.io", subject: "Unable to withdraw — bank details not saving", category: "Payout", priority: "HIGH", status: "Open", time: "5 mins ago" },
  { id: "TKT-5020", user: "Sarah Valerius", email: "s.valerius@fintech.com", subject: "Challenge phase reset — lost progress data", category: "Challenge", priority: "URGENT", status: "Open", time: "22 mins ago" },
  { id: "TKT-5019", user: "Marcus Thorne", email: "mthorne@protrader.net", subject: "KYC document rejected — passport is valid", category: "KYC", priority: "MEDIUM", status: "Pending", time: "1h ago" },
  { id: "TKT-5018", user: "Ayo Tobi", email: "ayo.tobi@gmail.com", subject: "MetaTrader login credentials not working", category: "Platform", priority: "HIGH", status: "Open", time: "2h ago" },
  { id: "TKT-5017", user: "Elena Vasquez", email: "e.vasquez@invest.io", subject: "Drawdown calculation seems incorrect", category: "Challenge", priority: "MEDIUM", status: "Resolved", time: "4h ago" },
  { id: "TKT-5016", user: "Priya Sharma", email: "p.sharma@fundedtrader.in", subject: "Dashboard not loading — blank screen on Chrome", category: "Platform", priority: "LOW", status: "Resolved", time: "8h ago" },
  { id: "TKT-5015", user: "James Okafor", email: "j.okafor@trader.ng", subject: "Referral commission not credited after 14 days", category: "Finance", priority: "MEDIUM", status: "Pending", time: "1d ago" },
];

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "chip-danger",
  HIGH: "chip-warning",
  MEDIUM: "chip-neutral",
  LOW: "chip-neutral",
};

const STATUS_STYLES: Record<string, string> = {
  Open: "chip-active",
  Pending: "chip-warning",
  Resolved: "chip-neutral",
};

interface TicketsViewProps {
  onViewTicket: (id: string) => void;
}

export default function TicketsView({ onViewTicket }: TicketsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filtered = tickets.filter((t) => {
    const matchSearch = t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Support Tickets</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Manage and resolve all user support requests.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <Plus size={14} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: "128", hex: "#00ffcc", icon: MessageCircle },
          { label: "Pending", value: "34", hex: "#ffbc7c", icon: Clock },
          { label: "Resolved Today", value: "42", hex: "#a8c0b8", icon: CheckCircle },
          { label: "Urgent", value: "6", hex: "#ff6b6b", icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center" style={{ border: `1px solid ${s.hex}22` }}>
              <s.icon size={16} style={{ color: s.hex }} />
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase">{s.label}</p>
              <p className="text-xl font-bold font-display text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets, users, subjects..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Open", "Pending", "Resolved"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", statusFilter === s ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2]")}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["All", "URGENT", "HIGH", "MEDIUM"].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", priorityFilter === p ? "bg-[#00ffcc] text-[#001716]" : "bg-[#0b2f2d]/40 text-[#b9cbc2]")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["TICKET", "USER", "SUBJECT", "CATEGORY", "PRIORITY", "STATUS", "OPENED", ""].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)] cursor-pointer" onClick={() => onViewTicket(t.id)}>
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-[#00ffcc]/70">{t.id}</span></td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-white">{t.user}</p>
                  <p className="text-[10px] text-[#b9cbc2]/50">{t.email}</p>
                </td>
                <td className="px-4 py-3.5 max-w-[260px]"><span className="text-xs text-[#b9cbc2] line-clamp-2">{t.subject}</span></td>
                <td className="px-4 py-3.5"><span className="text-xs text-[#b9cbc2]/70">{t.category}</span></td>
                <td className="px-4 py-3.5"><span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", PRIORITY_STYLES[t.priority])}>{t.priority}</span></td>
                <td className="px-4 py-3.5"><span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_STYLES[t.status])}>{t.status}</span></td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/50">{t.time}</td>
                <td className="px-4 py-3.5">
                  <button onClick={(e) => { e.stopPropagation(); onViewTicket(t.id); }} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[rgba(0,255,204,0.2)] text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.06)]">
          <p className="text-xs text-[#b9cbc2]/50">Showing {filtered.length} of 128 tickets</p>
        </div>
      </div>
    </div>
  );
}
