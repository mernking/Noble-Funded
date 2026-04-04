"use client";

import { useState } from "react";
import { ArrowLeft, Send, CheckCircle, Clock, User, Tag } from "lucide-react";

const TICKET_DATA: Record<string, {
  id: string; user: string; email: string; subject: string;
  category: string; priority: string; status: string; time: string;
  messages: { from: string; text: string; time: string; isSupport: boolean }[];
}> = {
  "TKT-5021": {
    id: "TKT-5021", user: "Felix Henderson", email: "felix.h@tradenet.io",
    subject: "Unable to withdraw — bank details not saving",
    category: "Payout", priority: "HIGH", status: "Open", time: "5 mins ago",
    messages: [
      { from: "Felix Henderson", text: "Hi, I've been trying to add my bank details for withdrawal but the form keeps resetting. I've tried 3 times now and nothing saves. Please help urgently.", time: "5 mins ago", isSupport: false },
      { from: "Support Agent", text: "Hi Felix, thank you for reaching out. I can see your account is verified. Can you let me know which browser you're using, and whether you receive any error message when saving?", time: "2 mins ago", isSupport: true },
    ],
  },
};

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

export default function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(
    TICKET_DATA[ticketId]?.messages || [
      { from: "User", text: "I need help with my account.", time: "10 mins ago", isSupport: false }
    ]
  );

  const ticket = TICKET_DATA[ticketId] || {
    id: ticketId, user: "User", email: "user@email.com",
    subject: "Support Request", category: "General",
    priority: "MEDIUM", status: "Open", time: "Recent",
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages([...messages, { from: "Support Agent", text: reply, time: "Just now", isSupport: true }]);
    setReply("");
  };

  return (
    <div className="page-fade space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#00ffcc] hover:underline">
          <ArrowLeft size={14} /> Back to Tickets
        </button>
        <span className="text-[#b9cbc2]/30">/</span>
        <span className="text-sm text-[#b9cbc2]/70">{ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Column */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col" style={{ height: "clamp(360px, calc(100vh - 220px), 600px)" }}>
          <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
            <h2 className="text-sm font-semibold font-display text-white">{ticket.subject}</h2>
            <p className="text-xs text-[#b9cbc2]/50 mt-0.5">{ticket.id} • {ticket.user}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isSupport ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.isSupport ? "bg-[#00ffcc]/10 border border-[#00ffcc]/20" : "bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)]"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold ${msg.isSupport ? "text-[#00ffcc]" : "text-[#b9cbc2]/70"}`}>{msg.from}</span>
                    <span className="text-[10px] text-[#b9cbc2]/30">{msg.time}</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.08)] flex gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
              placeholder="Type your reply... (Enter to send)"
              className="flex-1 input-field bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30 resize-none h-14"
            />
            <button onClick={sendReply} className="btn-primary px-4 rounded-lg bg-[#00ffcc] text-[#001716] font-semibold self-end py-2 flex items-center gap-2">
              <Send size={13} /> Send
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold font-display text-white">Ticket Details</h3>
            {[
              { label: "Status", value: ticket.status, icon: Clock },
              { label: "Priority", value: ticket.priority, icon: Tag },
              { label: "Category", value: ticket.category, icon: Tag },
              { label: "Opened", value: ticket.time, icon: Clock },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between py-2 border-t border-[rgba(0,255,204,0.06)]">
                <span className="text-xs text-[#b9cbc2]/60">{d.label}</span>
                <span className="text-xs font-semibold text-white">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold font-display text-white mb-3">User Info</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                {ticket.user.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{ticket.user}</p>
                <p className="text-[10px] text-[#b9cbc2]/50">{ticket.email}</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-[#b9cbc2]/60">
              <p>Account: <span className="text-white">$100k Funded</span></p>
              <p>Member since: <span className="text-white">Jan 2025</span></p>
              <p>Total tickets: <span className="text-white">3</span></p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-2">
            <button className="w-full py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold btn-primary flex items-center justify-center gap-2">
              <CheckCircle size={14} /> Mark Resolved
            </button>
            <button className="w-full py-2 rounded-lg border border-[rgba(0,255,204,0.2)] text-sm text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
              Escalate to Senior
            </button>
            <button className="w-full py-2 rounded-lg border border-[rgba(255,68,68,0.2)] text-sm text-[#ff6b6b] hover:bg-[#ff4444]/05 transition-all">
              Close Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
