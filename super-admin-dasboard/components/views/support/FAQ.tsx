"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { id: 1, q: "How do I withdraw my profits?", a: "To withdraw profits, navigate to the Payouts section in your dashboard. Ensure your bank details are verified, then submit a withdrawal request. Processing takes 2-3 business days.", category: "Payouts", views: 4821 },
  { id: 2, q: "What are the drawdown rules for funded accounts?", a: "Funded accounts have a maximum 10% total drawdown and 5% daily drawdown limit. Breaching either limit will result in account termination.", category: "Rules", views: 3912 },
  { id: 3, q: "How long does KYC verification take?", a: "KYC verification typically takes 24-48 hours. You will receive an email notification once your documents are reviewed.", category: "KYC", views: 2847 },
  { id: 4, q: "Can I trade news events?", a: "Yes, you may trade news events. However, we recommend exercising caution during high-impact events as spreads may widen.", category: "Trading", views: 2103 },
  { id: 5, q: "What instruments can I trade?", a: "You can trade forex pairs, indices, commodities, and cryptocurrencies on MetaTrader 5.", category: "Trading", views: 1988 },
  { id: 6, q: "What is the profit target for Phase 1?", a: "Phase 1 requires a 10% profit target with no time limit. You must achieve this while respecting all drawdown rules.", category: "Challenge", views: 1742 },
];

export default function FAQView() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ q: "", a: "", category: "General" });

  const filtered = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">FAQ Management</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Manage the knowledge base that reduces support ticket volume.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search FAQs..." className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#b9cbc2]/30" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((faq) => (
          <div key={faq.id} className="glass-card rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#00ffcc]/03 transition-all"
              onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="chip-neutral text-[10px] px-2 py-0.5 rounded-full font-semibold">{faq.category}</span>
                  <span className="text-[10px] text-[#b9cbc2]/40">{faq.views.toLocaleString()} views</span>
                </div>
                <p className="text-sm font-medium text-white">{faq.q}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-[#00ffcc]/10 text-[#b9cbc2]/50 hover:text-[#00ffcc] transition-all">
                  <Edit2 size={12} />
                </button>
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-[#ff4444]/10 text-[#b9cbc2]/50 hover:text-[#ff6b6b] transition-all">
                  <Trash2 size={12} />
                </button>
                <ChevronDown size={14} className={cn("text-[#b9cbc2]/50 transition-transform", expanded === faq.id && "rotate-180")} />
              </div>
            </button>
            {expanded === faq.id && (
              <div className="px-5 pb-4 border-t border-[rgba(0,255,204,0.06)]">
                <p className="text-sm text-[#b9cbc2] leading-relaxed pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold font-display text-white mb-4">Add FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Question</label>
                <input value={newFAQ.q} onChange={(e) => setNewFAQ({ ...newFAQ, q: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white" placeholder="Enter the question..." />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Answer</label>
                <textarea value={newFAQ.a} onChange={(e) => setNewFAQ({ ...newFAQ, a: e.target.value })} className="input-field w-full bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white resize-none h-24" placeholder="Write the answer..." />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase block mb-1.5">Category</label>
                <select value={newFAQ.category} onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })} className="w-full bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.1)] rounded-lg px-3 py-2 text-sm text-white">
                  {["General", "Payouts", "KYC", "Trading", "Challenge", "Rules"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-[rgba(0,255,204,0.2)] text-sm text-[#b9cbc2]">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl bg-[#00ffcc] text-[#001716] text-sm font-bold btn-primary">Add FAQ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
