"use client";

import { useState } from "react";
import { Send, Search } from "lucide-react";

const conversations = [
  { id: 1, user: "Felix Henderson", last: "Hi, I need help with my withdrawal", time: "5m", unread: 2, online: true },
  { id: 2, user: "Sarah Valerius", last: "Thank you for your help!", time: "22m", unread: 0, online: true },
  { id: 3, user: "Marcus Thorne", last: "The KYC is still pending...", time: "1h", unread: 1, online: false },
  { id: 4, user: "Ayo Tobi", last: "All sorted, thanks", time: "3h", unread: 0, online: false },
  { id: 5, user: "Elena Vasquez", last: "I have a question about drawdown", time: "1d", unread: 0, online: false },
];

const chatHistory: Record<number, { from: string; text: string; time: string; isSupport: boolean }[]> = {
  1: [
    { from: "Felix Henderson", text: "Hi, I need help with my withdrawal", time: "5 mins ago", isSupport: false },
    { from: "Support", text: "Hi Felix! I'd be happy to help. Can you describe the issue?", time: "3 mins ago", isSupport: true },
  ],
};

export default function MessagesView() {
  const [active, setActive] = useState(1);
  const [message, setMessage] = useState("");
  const [allChats, setAllChats] = useState(chatHistory);
  const [search, setSearch] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    const updated = { ...allChats };
    if (!updated[active]) updated[active] = [];
    updated[active] = [...updated[active], { from: "Support", text: message, time: "Just now", isSupport: true }];
    setAllChats(updated);
    setMessage("");
  };

  const filtered = conversations.filter((c) => c.user.toLowerCase().includes(search.toLowerCase()));
  const activeChat = allChats[active] || [];
  const activeName = conversations.find((c) => c.id === active)?.user || "";

  return (
    <div className="page-fade">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Messages</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Direct messaging with traders and account holders.</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden flex" style={{ height: "calc(100vh - 200px)" }}>
        {/* Conversation List */}
        <div className="w-72 border-r border-[rgba(0,255,204,0.08)] flex flex-col">
          <div className="p-3 border-b border-[rgba(0,255,204,0.08)]">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-7 pr-3 py-2 text-xs text-white placeholder:text-[#b9cbc2]/30" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => (
              <button key={conv.id} onClick={() => setActive(conv.id)} className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-[rgba(0,255,204,0.04)] transition-all ${active === conv.id ? "bg-[#00ffcc]/08" : "hover:bg-[#0b2f2d]/40"}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0b2f2d] border border-[rgba(0,255,204,0.15)] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                    {conv.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00ffcc] border border-[#001716]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{conv.user}</span>
                    <span className="text-[10px] text-[#b9cbc2]/40 flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-[10px] text-[#b9cbc2]/50 truncate mt-0.5">{conv.last}</p>
                </div>
                {conv.unread > 0 && <span className="w-4 h-4 rounded-full bg-[#00ffcc] text-[#001716] text-[9px] font-bold flex items-center justify-center flex-shrink-0">{conv.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3.5 border-b border-[rgba(0,255,204,0.08)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0b2f2d] border border-[rgba(0,255,204,0.15)] flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
              {activeName.split(" ").map(n => n[0]).join("")}
            </div>
            <p className="text-sm font-semibold text-white">{activeName}</p>
            <span className="chip-active text-[10px] px-2 py-0.5 rounded-full">Online</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.isSupport ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${msg.isSupport ? "bg-[#00ffcc]/10 border border-[#00ffcc]/20" : "bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.06)]"}`}>
                  <p className="text-sm text-white">{msg.text}</p>
                  <p className="text-[10px] text-[#b9cbc2]/30 mt-0.5 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {activeChat.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-[#b9cbc2]/40">No messages yet. Start the conversation.</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[rgba(0,255,204,0.08)] flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message..."
              className="flex-1 input-field bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#b9cbc2]/30"
            />
            <button onClick={sendMessage} className="btn-primary px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] font-semibold flex items-center gap-2">
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
