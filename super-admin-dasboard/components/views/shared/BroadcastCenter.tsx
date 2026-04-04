"use client";

import { useState } from "react";
import {
  Megaphone, Send, Users, Mail, Bell, AlertTriangle,
  CheckCircle, Plus, Filter, Clock, Eye, X, Globe,
  Smartphone, ChevronDown, Search, Target, ToggleLeft, ToggleRight,
} from "lucide-react";

type Role = string;

type Broadcast = {
  id: string;
  title: string;
  message: string;
  channel: "email" | "in-app" | "both";
  segment: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentAt?: string;
  scheduledFor?: string;
  recipients: number;
  openRate?: number;
  createdBy: string;
};

const initialBroadcasts: Broadcast[] = [
  { id: "b1", title: "MT5 Maintenance Window", message: "Our MT5 servers will be undergoing scheduled maintenance tonight from 02:00–04:00 UTC. All open positions will remain safe.", channel: "both", segment: "All Users", status: "sent", sentAt: "Today 09:15", recipients: 1021, openRate: 68, createdBy: "Alexander Noble" },
  { id: "b2", title: "20% Off Retry — Failed Phase 1", message: "We noticed you didn't quite make it through Phase 1. Don't give up — here's 20% off your next retry with code RETRY20.", channel: "email", segment: "Failed Phase 1 Traders", status: "sent", sentAt: "Yesterday 14:30", recipients: 312, openRate: 82, createdBy: "Marketing Team" },
  { id: "b3", title: "April Competition — Last 7 Days", message: "Only 7 days left in the April Pro Challenge! Check your current ranking and push for the top 3.", channel: "in-app", segment: "Competition Participants", status: "sent", sentAt: "Apr 23, 10:00", recipients: 842, openRate: 91, createdBy: "Marketing Team" },
  { id: "b4", title: "New ₦1M Challenge Plan Launched", message: "Introducing our brand-new ₦1,000,000 two-phase challenge. Bigger account, bigger payout.", channel: "both", segment: "NGN Account Holders", status: "scheduled", scheduledFor: "Tomorrow 09:00", recipients: 640, createdBy: "Alexander Noble" },
  { id: "b5", title: "KYC Reminder — Funded Traders", message: "Your funded account is ready — but we need your KYC documents before we can process your first payout.", channel: "email", segment: "Funded, KYC Pending", status: "draft", recipients: 28, createdBy: "Compliance" },
];

const segments = [
  "All Users",
  "Active Traders",
  "Failed Phase 1 Traders",
  "Failed Phase 2 Traders",
  "Funded Traders",
  "KYC Pending",
  "Funded, KYC Pending",
  "Competition Participants",
  "Affiliate Partners",
  "NGN Account Holders",
  "USD Account Holders",
  "Inactive (30+ days)",
];

const statusColor = { sent: "#34d399", scheduled: "#ffbc7c", draft: "#a8c0b8", failed: "#ff6b6b" };

type NewBroadcast = {
  title: string;
  message: string;
  channel: "email" | "in-app" | "both";
  segment: string;
  schedule: "now" | "later";
  scheduledFor: string;
};

export default function BroadcastCenter({ role = "Marketing" }: { role?: Role }) {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "sent">("all");
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState<Broadcast | null>(null);
  const [newBroadcast, setNewBroadcast] = useState<NewBroadcast>({
    title: "",
    message: "",
    channel: "both",
    segment: "All Users",
    schedule: "now",
    scheduledFor: "",
  });

  const filtered = broadcasts.filter((b) => filter === "all" || b.status === filter);

  const handleCreate = () => {
    if (!newBroadcast.title || !newBroadcast.message) return;
    const segmentMap: Record<string, number> = {
      "All Users": 1021, "Active Traders": 342, "Failed Phase 1 Traders": 312,
      "Funded Traders": 94, "KYC Pending": 28, "Competition Participants": 842,
    };
    const created: Broadcast = {
      id: `b${Date.now()}`,
      title: newBroadcast.title,
      message: newBroadcast.message,
      channel: newBroadcast.channel,
      segment: newBroadcast.segment,
      status: newBroadcast.schedule === "now" ? "sent" : "scheduled",
      sentAt: newBroadcast.schedule === "now" ? "Just now" : undefined,
      scheduledFor: newBroadcast.schedule === "later" ? newBroadcast.scheduledFor : undefined,
      recipients: segmentMap[newBroadcast.segment] ?? 100,
      openRate: newBroadcast.schedule === "now" ? 0 : undefined,
      createdBy: "Current User",
    };
    setBroadcasts([created, ...broadcasts]);
    setShowModal(false);
    setNewBroadcast({ title: "", message: "", channel: "both", segment: "All Users", schedule: "now", scheduledFor: "" });
  };

  const channelIcon = { email: Mail, "in-app": Bell, both: Globe };
  const channelColor = { email: "#60a5fa", "in-app": "#a78bfa", both: "#00ffcc" };

  const stats = [
    { label: "TOTAL SENT", value: broadcasts.filter((b) => b.status === "sent").length, icon: Send, color: "#34d399" },
    { label: "SCHEDULED", value: broadcasts.filter((b) => b.status === "scheduled").length, icon: Clock, color: "#ffbc7c" },
    { label: "DRAFTS", value: broadcasts.filter((b) => b.status === "draft").length, icon: Mail, color: "#a8c0b8" },
    { label: "AVG OPEN RATE", value: `${Math.round(broadcasts.filter((b) => b.openRate).reduce((a, b) => a + (b.openRate || 0), 0) / broadcasts.filter((b) => b.openRate).length)}%`, icon: Eye, color: "#00ffcc" },
  ];

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#a78bfa] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Broadcast & Notification Center</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Send targeted emails and in-app alerts to user segments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold"
        >
          <Plus size={14} /> New Broadcast
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[20px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center bg-white/[0.04] border border-[rgba(0,255,204,0.1)] rounded-xl p-1 w-fit">
        {(["all", "sent", "scheduled", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
            style={filter === f ? { background: "rgba(0,255,204,0.15)", color: "#00ffcc" } : { color: "#a8c0b8" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Broadcasts list */}
      <div className="space-y-3">
        {filtered.map((broadcast) => {
          const Icon = channelIcon[broadcast.channel];
          return (
            <div key={broadcast.id} className="glass-card rounded-2xl p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${channelColor[broadcast.channel]}15`, border: `1px solid ${channelColor[broadcast.channel]}25` }}>
                  <Icon size={16} style={{ color: channelColor[broadcast.channel] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold text-white">{broadcast.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusColor[broadcast.status]}15`, color: statusColor[broadcast.status] }}>{broadcast.status}</span>
                  </div>
                  <p className="text-[12px] text-[#a8c0b8]/60 mt-1 leading-relaxed line-clamp-1">{broadcast.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-[#a8c0b8]/40 flex-wrap">
                    <span className="flex items-center gap-1"><Target size={9} /> {broadcast.segment}</span>
                    <span className="flex items-center gap-1"><Users size={9} /> {broadcast.recipients.toLocaleString()} recipients</span>
                    {broadcast.status === "sent" && broadcast.openRate !== undefined && (
                      <span className="flex items-center gap-1" style={{ color: broadcast.openRate > 70 ? "#34d399" : "#ffbc7c" }}>
                        <Eye size={9} /> {broadcast.openRate}% open rate
                      </span>
                    )}
                    {broadcast.status === "scheduled" && (
                      <span className="flex items-center gap-1 text-[#ffbc7c]"><Clock size={9} /> Scheduled: {broadcast.scheduledFor}</span>
                    )}
                    {broadcast.sentAt && <span className="flex items-center gap-1"><Clock size={9} /> {broadcast.sentAt}</span>}
                    <span>By {broadcast.createdBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setPreview(broadcast)} className="text-[11px] text-[#60a5fa] hover:underline flex items-center gap-1"><Eye size={11} /> Preview</button>
                  {broadcast.status === "draft" && (
                    <button className="text-[11px] text-[#00ffcc] hover:underline flex items-center gap-1"><Send size={11} /> Send</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-md relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold font-display text-white">{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="text-[#a8c0b8]/40 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-[13px] text-[#a8c0b8] leading-relaxed">{preview.message}</p>
            </div>
            <div className="mt-4 flex items-center gap-4 text-[11px] text-[#a8c0b8]/50">
              <span>Segment: {preview.segment}</span>
              <span>{preview.recipients} recipients</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-lg relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold font-display text-white">New Broadcast</h3>
              <button onClick={() => setShowModal(false)} className="text-[#a8c0b8]/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Subject / Title</label>
                <input type="text" value={newBroadcast.title} onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })} placeholder="e.g. MT5 maintenance tonight" className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Message</label>
                <textarea value={newBroadcast.message} onChange={(e) => setNewBroadcast({ ...newBroadcast, message: e.target.value })} rows={4} placeholder="Write your message..." className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Channel</label>
                  <select value={newBroadcast.channel} onChange={(e) => setNewBroadcast({ ...newBroadcast, channel: e.target.value as any })} className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none">
                    <option value="both">Email + In-App</option>
                    <option value="email">Email Only</option>
                    <option value="in-app">In-App Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Target Segment</label>
                  <select value={newBroadcast.segment} onChange={(e) => setNewBroadcast({ ...newBroadcast, segment: e.target.value })} className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none">
                    {segments.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Send Time</label>
                <div className="flex gap-2">
                  {(["now", "later"] as const).map((s) => (
                    <button key={s} onClick={() => setNewBroadcast({ ...newBroadcast, schedule: s })}
                      className="flex-1 py-2 rounded-xl text-[12px] font-semibold capitalize transition-all"
                      style={newBroadcast.schedule === s ? { background: "#00ffcc20", border: "1px solid #00ffcc35", color: "#00ffcc" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#a8c0b8" }}
                    >
                      {s === "now" ? "Send Now" : "Schedule"}
                    </button>
                  ))}
                </div>
                {newBroadcast.schedule === "later" && (
                  <input type="datetime-local" value={newBroadcast.scheduledFor} onChange={(e) => setNewBroadcast({ ...newBroadcast, scheduledFor: e.target.value })} className="w-full mt-2 bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none" />
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#010e0d] bg-[#00ffcc]">{newBroadcast.schedule === "now" ? "Send Now" : "Schedule"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
