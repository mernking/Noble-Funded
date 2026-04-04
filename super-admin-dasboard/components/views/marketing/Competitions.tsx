"use client";

import { useState } from "react";
import {
  Trophy, Plus, Users, Calendar, DollarSign, Flag,
  Eye, Edit3, Trash2, Clock, CheckCircle, XCircle,
  AlertTriangle, ArrowUpRight, Star, Search, Filter,
  Wifi, WifiOff, BarChart2, X,
} from "lucide-react";

type Competition = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "ended";
  participants: number;
  prizePool: string;
  prizes: { rank: string; reward: string }[];
  suspectAccounts: number;
  type: string;
};

const initialCompetitions: Competition[] = [
  {
    id: "c1",
    name: "April Pro Challenge",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    status: "live",
    participants: 842,
    prizePool: "$50,000 Account",
    prizes: [
      { rank: "1st Place", reward: "$100K Funded Account" },
      { rank: "2nd Place", reward: "$50K Funded Account" },
      { rank: "3rd Place", reward: "$25K Funded Account" },
      { rank: "4th - 10th", reward: "₦50,000 Cash" },
    ],
    suspectAccounts: 3,
    type: "Percentage Return",
  },
  {
    id: "c2",
    name: "Q1 Naira Masters",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "ended",
    participants: 1240,
    prizePool: "₦5,000,000",
    prizes: [
      { rank: "1st Place", reward: "₦2,000,000 Cash" },
      { rank: "2nd Place", reward: "₦1,500,000 Cash" },
      { rank: "3rd Place", reward: "₦1,000,000 Cash" },
    ],
    suspectAccounts: 0,
    type: "Percentage Return",
  },
  {
    id: "c3",
    name: "May Dollar League",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    status: "upcoming",
    participants: 0,
    prizePool: "$75,000 Account",
    prizes: [
      { rank: "1st Place", reward: "$100K Funded Account" },
      { rank: "2nd Place", reward: "$50K Funded Account" },
      { rank: "3rd Place", reward: "$25K Funded Account" },
    ],
    suspectAccounts: 0,
    type: "Profit in Pips",
  },
];

const suspectEntries = [
  { rank: 12, account: "MT5-88231", trader: "Unknown-A", ips: 4, flagReason: "4 different IPs in 24h", similarity: "High similarity to MT5-88232" },
  { rank: 18, account: "MT5-88232", trader: "Unknown-B", ips: 3, flagReason: "VPN detected", similarity: "High similarity to MT5-88231" },
  { rank: 35, account: "MT5-77012", trader: "Unknown-C", ips: 2, flagReason: "Hedging with external account detected", similarity: "—" },
];

const leaderboard = [
  { rank: 1, trader: "Emeka N.", account: "MT5-44312", pnl: "+28.4%", trades: 142, flag: false },
  { rank: 2, trader: "Jane A.", account: "MT5-78821", pnl: "+24.1%", trades: 98, flag: false },
  { rank: 3, trader: "Musa O.", account: "MT5-33401", pnl: "+21.7%", trades: 210, flag: false },
  { rank: 4, trader: "Chidi O.", account: "MT5-55601", pnl: "+19.2%", trades: 77, flag: false },
  { rank: 5, trader: "Tosin A.", account: "MT5-22190", pnl: "+17.8%", trades: 134, flag: false },
];

type NewCompetition = {
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  prize1: string;
  prize2: string;
  prize3: string;
};

export default function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [selectedComp, setSelectedComp] = useState<Competition>(initialCompetitions[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComp, setNewComp] = useState<NewCompetition>({ name: "", startDate: "", endDate: "", type: "Percentage Return", prize1: "", prize2: "", prize3: "" });

  const handleCreate = () => {
    if (!newComp.name) return;
    const created: Competition = {
      id: `c${Date.now()}`,
      name: newComp.name,
      startDate: newComp.startDate,
      endDate: newComp.endDate,
      status: "upcoming",
      participants: 0,
      prizePool: newComp.prize1,
      prizes: [
        { rank: "1st Place", reward: newComp.prize1 },
        { rank: "2nd Place", reward: newComp.prize2 },
        { rank: "3rd Place", reward: newComp.prize3 },
      ],
      suspectAccounts: 0,
      type: newComp.type,
    };
    setCompetitions([created, ...competitions]);
    setShowCreateModal(false);
    setNewComp({ name: "", startDate: "", endDate: "", type: "Percentage Return", prize1: "", prize2: "", prize3: "" });
  };

  const statusColor = { live: "#34d399", upcoming: "#ffbc7c", ended: "#a8c0b8" };

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#a78bfa] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Competitions Management</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Create and moderate monthly trading competitions with prize pools</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold"
        >
          <Plus size={14} /> New Competition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "LIVE COMPETITIONS", value: competitions.filter((c) => c.status === "live").length, icon: Wifi, color: "#34d399" },
          { label: "TOTAL PARTICIPANTS", value: competitions.reduce((a, c) => a + c.participants, 0).toLocaleString(), icon: Users, color: "#00ffcc" },
          { label: "SUSPECT ACCOUNTS", value: competitions.reduce((a, c) => a + c.suspectAccounts, 0), icon: AlertTriangle, color: "#ff6b6b" },
          { label: "PAST COMPETITIONS", value: competitions.filter((c) => c.status === "ended").length, icon: Trophy, color: "#a78bfa" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[20px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Competition list */}
        <div className="space-y-3">
          <h2 className="text-[13px] font-semibold font-display text-white px-1">Competitions</h2>
          {competitions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedComp(comp)}
              className="w-full text-left glass-card rounded-xl p-4 hover:bg-white/[0.03] transition-all"
              style={selectedComp.id === comp.id ? { border: "1px solid rgba(0,255,204,0.25)", background: "rgba(0,255,204,0.04)" } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-white">{comp.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusColor[comp.status]}15`, color: statusColor[comp.status] }}>{comp.status}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#a8c0b8]/50">
                <span className="flex items-center gap-1"><Users size={9} /> {comp.participants.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Trophy size={9} /> {comp.prizePool}</span>
              </div>
              {comp.suspectAccounts > 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#ff6b6b]">
                  <AlertTriangle size={10} /> {comp.suspectAccounts} suspect account{comp.suspectAccounts > 1 ? "s" : ""}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Competition detail */}
        <div className="xl:col-span-2 space-y-4">
          {selectedComp && (
            <>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h2 className="text-[16px] font-bold font-display text-white">{selectedComp.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#a8c0b8]/50">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {selectedComp.startDate} — {selectedComp.endDate}</span>
                      <span className="flex items-center gap-1"><BarChart2 size={9} /> {selectedComp.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: `${statusColor[selectedComp.status]}15`, color: statusColor[selectedComp.status] }}>{selectedComp.status.toUpperCase()}</span>
                </div>

                {/* Prize Pool */}
                <div className="mb-4">
                  <h3 className="text-[11px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-2">Prize Structure</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedComp.prizes.map((prize, i) => (
                      <div key={i} className="p-3 rounded-xl flex items-center gap-2.5" style={{ background: i === 0 ? "#ffbc7c10" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "#ffbc7c25" : "rgba(255,255,255,0.06)"}` }}>
                        <Star size={13} style={{ color: i === 0 ? "#ffbc7c" : i === 1 ? "#a8c0b8" : "#cd7f32" }} className="flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#a8c0b8]/60">{prize.rank}</p>
                          <p className="text-[12px] font-bold text-white">{prize.reward}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live leaderboard preview */}
                {selectedComp.status === "live" && (
                  <div>
                    <h3 className="text-[11px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-2">Live Leaderboard (Top 5)</h3>
                    <div className="space-y-1.5">
                      {leaderboard.map((entry) => (
                        <div key={entry.rank} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: entry.rank === 1 ? "rgba(255,188,124,0.06)" : "transparent", border: entry.rank === 1 ? "1px solid rgba(255,188,124,0.15)" : "1px solid transparent" }}>
                          <span className="text-[13px] font-bold font-display w-5 text-center" style={{ color: entry.rank === 1 ? "#ffbc7c" : entry.rank === 2 ? "#a8c0b8" : entry.rank === 3 ? "#cd7f32" : "#a8c0b8" }}>#{entry.rank}</span>
                          <div className="flex-1">
                            <span className="text-[12px] text-white font-medium">{entry.trader}</span>
                            <span className="text-[10px] text-[#a8c0b8]/50 ml-2 font-mono">{entry.account}</span>
                          </div>
                          <span className="text-[12px] font-bold text-[#34d399]">{entry.pnl}</span>
                          <span className="text-[10px] text-[#a8c0b8]/50">{entry.trades} trades</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suspect Accounts */}
              {selectedComp.status === "live" && (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[rgba(255,107,107,0.12)] bg-[#ff6b6b]/05">
                    <h3 className="text-[13px] font-semibold text-[#ff6b6b] flex items-center gap-2">
                      <AlertTriangle size={14} /> Suspect Rule-Breakers ({suspectEntries.length} flagged)
                    </h3>
                    <p className="text-[10px] text-[#a8c0b8]/50 mt-0.5">Accounts flagged for multi-IP usage, VPN, or coordination</p>
                  </div>
                  <div className="divide-y divide-[rgba(255,107,107,0.08)]">
                    {suspectEntries.map((entry) => (
                      <div key={entry.account} className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/[0.02]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20">
                          <AlertTriangle size={13} className="text-[#ff6b6b]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-semibold text-white">Rank #{entry.rank}</span>
                            <code className="text-[11px] font-mono text-[#ff6b6b] bg-[#ff6b6b]/10 px-1.5 py-0.5 rounded">{entry.account}</code>
                          </div>
                          <p className="text-[11px] text-[#a8c0b8]/60 mt-0.5">{entry.flagReason}</p>
                          {entry.similarity !== "—" && <p className="text-[10px] text-[#ffbc7c]/70 mt-0.5">{entry.similarity}</p>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20 hover:bg-[#ff6b6b]/20 transition-all">Ban</button>
                          <button className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/[0.05] text-[#a8c0b8] border border-white/[0.08] hover:text-white transition-all">Review</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-lg relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold font-display text-white">Create New Competition</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#a8c0b8]/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Competition Name</label>
                <input type="text" value={newComp.name} onChange={(e) => setNewComp({ ...newComp, name: e.target.value })} placeholder="e.g. May Dollar League" className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Start Date</label>
                <input type="date" value={newComp.startDate} onChange={(e) => setNewComp({ ...newComp, startDate: e.target.value })} className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">End Date</label>
                <input type="date" value={newComp.endDate} onChange={(e) => setNewComp({ ...newComp, endDate: e.target.value })} className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Competition Type</label>
                <select value={newComp.type} onChange={(e) => setNewComp({ ...newComp, type: e.target.value })} className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none">
                  <option>Percentage Return</option>
                  <option>Profit in Pips</option>
                  <option>Sharpe Ratio</option>
                  <option>Win Rate</option>
                </select>
              </div>
              {[{ label: "1st Prize", key: "prize1" }, { label: "2nd Prize", key: "prize2" }, { label: "3rd Prize", key: "prize3" }].map((f) => (
                <div key={f.key}>
                  <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">{f.label}</label>
                  <input type="text" value={(newComp as any)[f.key]} onChange={(e) => setNewComp({ ...newComp, [f.key]: e.target.value })} placeholder="e.g. $100K Account" className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#010e0d] bg-[#00ffcc]">Create Competition</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
