"use client";

import { useState } from "react";
import { Search, MessageCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
  { id: "#NF-89210", name: "Felix Henderson", email: "felix.h@tradenet.io", type: "Funded", tickets: 3, lastContact: "5 mins ago", status: "Active" },
  { id: "#NF-89211", name: "Sarah Valerius", email: "s.valerius@fintech.com", type: "Phase 2", tickets: 1, lastContact: "22 mins ago", status: "Flagged" },
  { id: "#NF-89212", name: "Marcus Thorne", email: "mthorne@protrader.net", type: "Phase 1", tickets: 2, lastContact: "1h ago", status: "Inactive" },
  { id: "#NF-89213", name: "Ayo Tobi", email: "ayo.tobi@gmail.com", type: "Funded", tickets: 0, lastContact: "2h ago", status: "Active" },
  { id: "#NF-89215", name: "James Okafor", email: "j.okafor@trader.ng", type: "Phase 1", tickets: 1, lastContact: "1d ago", status: "Active" },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "chip-active",
  Flagged: "chip-danger",
  Inactive: "chip-neutral",
};

interface SupportUsersProps {
  onViewTrader?: (traderId: string) => void;
}

export default function SupportUsers({ onViewTrader }: SupportUsersProps = {}) {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-fade space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">User Lookup</h1>
        <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Search and access trader account information for support purposes.</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or account ID..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.08)]">
              {["USER", "ACCOUNT TYPE", "TICKETS", "LAST CONTACT", "STATUS", "ACTIONS"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0b2f2d] border border-[rgba(0,255,204,0.1)] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-[10px] text-[#b9cbc2]/50">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{u.type}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-xs font-semibold", u.tickets > 0 ? "text-[#ffbc7c]" : "text-[#b9cbc2]/50")}>
                    {u.tickets} {u.tickets === 1 ? "ticket" : "tickets"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/70">{u.lastContact}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_STYLES[u.status])}>{u.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTrader ? onViewTrader(u.id) : undefined}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all"
                    >
                      <Eye size={11} /> View
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.1)] text-xs text-[#b9cbc2] hover:text-white hover:border-[#00ffcc]/20 transition-all">
                      <MessageCircle size={11} /> Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
