"use client";

import { useState } from "react";
import { PackageOpen, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Currency = "NGN" | "USD";
type PlanStatus = "active" | "draft" | "archived";

interface ChallengePlan {
  id: string;
  name: string;
  currency: Currency;
  accountSize: number;
  price: number;
  phase1Target: number;
  phase2Target: number;
  dailyDrawdown: number;
  maxDrawdown: number;
  minTradingDays: number;
  maxDuration: number;
  profitSplitTier1: number;
  profitSplitTier2: number;
  status: PlanStatus;
  purchasedCount: number;
  popular: boolean;
}

const INITIAL_PLANS: ChallengePlan[] = [
  // Naira Plans - Correct Prices
  { id: "pl-1", name: "Naira ₦200K", currency: "NGN", accountSize: 200000, price: 10000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 312, popular: false },
  { id: "pl-2", name: "Naira ₦400K", currency: "NGN", accountSize: 400000, price: 19000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 541, popular: true },
  { id: "pl-8", name: "Naira ₦600K", currency: "NGN", accountSize: 600000, price: 29000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 189, popular: false },
  { id: "pl-3", name: "Naira ₦800K", currency: "NGN", accountSize: 800000, price: 39000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 218, popular: true },
  { id: "pl-9", name: "Naira ₦1M", currency: "NGN", accountSize: 1000000, price: 54000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 142, popular: true },
  { id: "pl-10", name: "Naira ₦3M", currency: "NGN", accountSize: 3000000, price: 190000, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 5, maxDuration: 45, profitSplitTier1: 80, profitSplitTier2: 65, status: "active", purchasedCount: 67, popular: false },
  // Dollar Plans - Correct Prices
  { id: "pl-4", name: "Dollar $5K", currency: "USD", accountSize: 5000, price: 29.99, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 94, popular: false },
  { id: "pl-5", name: "Dollar $10K", currency: "USD", accountSize: 10000, price: 59.99, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 77, popular: true },
  { id: "pl-6", name: "Dollar $25K", currency: "USD", accountSize: 25000, price: 134.99, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 43, popular: false },
  { id: "pl-11", name: "Dollar $50K", currency: "USD", accountSize: 50000, price: 219.99, phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10, minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60, status: "active", purchasedCount: 56, popular: true },
  { id: "pl-7", name: "Dollar $100K", currency: "USD", accountSize: 100000, price: 379.99, phase1Target: 8, phase2Target: 4, dailyDrawdown: 4, maxDrawdown: 8, minTradingDays: 5, maxDuration: 45, profitSplitTier1: 85, profitSplitTier2: 70, status: "active", purchasedCount: 28, popular: false },
  { id: "pl-12", name: "Dollar $200K", currency: "USD", accountSize: 200000, price: 749.99, phase1Target: 8, phase2Target: 4, dailyDrawdown: 4, maxDrawdown: 8, minTradingDays: 5, maxDuration: 45, profitSplitTier1: 85, profitSplitTier2: 70, status: "active", purchasedCount: 12, popular: false },
];

const STATUS_STYLE: Record<PlanStatus, string> = {
  active: "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/25",
  draft: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
  archived: "text-[#b9cbc2]/50 bg-[#0b2f2d]/40 border-[rgba(0,255,204,0.08)]",
};

type EditingPlan = Omit<ChallengePlan, "id" | "purchasedCount"> & { id: string | null };

const BLANK: EditingPlan = {
  id: null, name: "", currency: "NGN", accountSize: 0, price: 0,
  phase1Target: 10, phase2Target: 5, dailyDrawdown: 5, maxDrawdown: 10,
  minTradingDays: 4, maxDuration: 30, profitSplitTier1: 80, profitSplitTier2: 60,
  status: "draft", popular: false,
};

export default function ChallengePlansView() {
  const [plans, setPlans] = useState<ChallengePlan[]>(INITIAL_PLANS);
  const [currencyFilter, setCurrencyFilter] = useState<"all" | Currency>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EditingPlan | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = plans.filter((p) => currencyFilter === "all" || p.currency === currencyFilter);

  const toggleStatus = (id: string) => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p));
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (plan: ChallengePlan) => {
    setEditing({ ...plan });
    setShowForm(true);
  };

  const duplicatePlan = (plan: ChallengePlan) => {
    const newPlan: ChallengePlan = { ...plan, id: `pl-${Date.now()}`, name: `${plan.name} (Copy)`, status: "draft", purchasedCount: 0 };
    setPlans((prev) => [...prev, newPlan]);
  };

  const savePlan = () => {
    if (!editing) return;
    if (editing.id) {
      setPlans((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...editing, id: p.id } as ChallengePlan : p));
    } else {
      const newPlan: ChallengePlan = { ...editing, id: `pl-${Date.now()}`, purchasedCount: 0 };
      setPlans((prev) => [...prev, newPlan]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const formatSize = (plan: ChallengePlan) => plan.currency === "NGN" ? `₦${plan.accountSize.toLocaleString()}` : `$${plan.accountSize.toLocaleString()}`;
  const formatPrice = (plan: ChallengePlan) => {
    if (plan.currency === "NGN") {
      return `₦${plan.price.toLocaleString()}`;
    }
    // USD prices may have decimals (e.g. $29.99)
    return plan.price % 1 === 0 ? `$${plan.price.toLocaleString()}` : `$${plan.price.toFixed(2)}`;
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <PackageOpen size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Challenge Plans & Pricing</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Create, configure, and manage all trading challenge plans and their pricing.</p>
        </div>
        <button
          onClick={() => { setEditing(BLANK); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-bold hover:bg-[#00e6b8] transition-all"
        >
          <Plus size={14} /> New Plan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Plans", value: plans.length, sub: `${plans.filter((p) => p.status === "active").length} active` },
          { label: "NGN Plans", value: plans.filter((p) => p.currency === "NGN").length, sub: "Naira accounts" },
          { label: "USD Plans", value: plans.filter((p) => p.currency === "USD").length, sub: "Dollar accounts" },
          { label: "Total Purchased", value: plans.reduce((s, p) => s + p.purchasedCount, 0).toLocaleString(), sub: "across all plans" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-display text-white">{s.value}</p>
            <p className="text-[11px] text-[#b9cbc2]/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(["all", "NGN", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrencyFilter(c)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              currencyFilter === c ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30" : "text-[#b9cbc2]/60 border border-transparent hover:border-[#00ffcc]/15"
            )}
          >
            {c === "all" ? "All Currencies" : c}
          </button>
        ))}
      </div>

      {/* Plans List */}
      <div className="space-y-3">
        {filtered.map((plan) => (
          <div key={plan.id} className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-4">
              {/* Name & badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{plan.name}</h3>
                  {plan.popular && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/25">Popular</span>
                  )}
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", STATUS_STYLE[plan.status])}>{plan.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[#00ffcc] font-bold font-display text-sm">{formatSize(plan)}</span>
                  <span className="text-[#b9cbc2]/40 text-[11px]">Price: <span className="text-[#b9cbc2]">{formatPrice(plan)}</span></span>
                  <span className="text-[#b9cbc2]/40 text-[11px]">Purchased: <span className="text-[#b9cbc2]">{plan.purchasedCount}</span></span>
                  <span className="text-[#b9cbc2]/40 text-[11px]">Split: <span className="text-[#b9cbc2]">{plan.profitSplitTier1}/{100 - plan.profitSplitTier1}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setExpandedId(expandedId === plan.id ? null : plan.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white transition-all">
                  {expandedId === plan.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                <button onClick={() => duplicatePlan(plan)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-white transition-all">
                  <Copy size={12} />
                </button>
                <button onClick={() => startEdit(plan)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 transition-all">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => deletePlan(plan.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/60 hover:text-[#ff6b6b] hover:border-[#ff4444]/20 transition-all">
                  <Trash2 size={12} />
                </button>
                <button
                  onClick={() => toggleStatus(plan.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all",
                    plan.status === "active" ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/20" : "text-[#b9cbc2]/50 bg-[#0b2f2d]/40 border-[rgba(0,255,204,0.08)]"
                  )}
                >
                  {plan.status === "active" ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                  {plan.status === "active" ? "Live" : "Offline"}
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === plan.id && (
              <div className="px-4 pb-4 border-t border-[#00ffcc]/08 pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: "Phase 1 Target", value: `${plan.phase1Target}%` },
                    { label: "Phase 2 Target", value: `${plan.phase2Target}%` },
                    { label: "Daily DD", value: `${plan.dailyDrawdown}%` },
                    { label: "Max DD", value: `${plan.maxDrawdown}%` },
                    { label: "Min Days", value: `${plan.minTradingDays} days` },
                    { label: "Max Duration", value: `${plan.maxDuration} days` },
                  ].map((d) => (
                    <div key={d.label} className="bg-[#0b2f2d]/40 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-[#b9cbc2]/40 mb-0.5">{d.label}</p>
                      <p className="text-sm font-bold font-display text-white">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl space-y-4 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white">{editing.id ? "Edit Challenge Plan" : "New Challenge Plan"}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-[#b9cbc2]/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Plan Name */}
              <div className="col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Plan Name</label>
                <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" placeholder="e.g. Naira 400K" />
              </div>
              {/* Currency */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Currency</label>
                <select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40">
                  <option value="NGN">NGN — Naira</option>
                  <option value="USD">USD — Dollar</option>
                </select>
              </div>
              {/* Account Size */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Account Size</label>
                <input type="number" value={editing.accountSize} onChange={(e) => setEditing({ ...editing, accountSize: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Price */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Price ({editing.currency})</label>
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Phase 1 */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Phase 1 Profit Target (%)</label>
                <input type="number" value={editing.phase1Target} onChange={(e) => setEditing({ ...editing, phase1Target: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Phase 2 */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Phase 2 Profit Target (%)</label>
                <input type="number" value={editing.phase2Target} onChange={(e) => setEditing({ ...editing, phase2Target: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Daily DD */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Daily Drawdown (%)</label>
                <input type="number" value={editing.dailyDrawdown} onChange={(e) => setEditing({ ...editing, dailyDrawdown: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Max DD */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Max Drawdown (%)</label>
                <input type="number" value={editing.maxDrawdown} onChange={(e) => setEditing({ ...editing, maxDrawdown: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Min days */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Min Trading Days</label>
                <input type="number" value={editing.minTradingDays} onChange={(e) => setEditing({ ...editing, minTradingDays: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Max duration */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Max Duration (Days)</label>
                <input type="number" value={editing.maxDuration} onChange={(e) => setEditing({ ...editing, maxDuration: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Profit split T1 */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Profit Split Tier 1 (%)</label>
                <input type="number" value={editing.profitSplitTier1} onChange={(e) => setEditing({ ...editing, profitSplitTier1: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Profit split T2 */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Profit Split Tier 2 (%)</label>
                <input type="number" value={editing.profitSplitTier2} onChange={(e) => setEditing({ ...editing, profitSplitTier2: Number(e.target.value) })} className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40" />
              </div>
              {/* Popular toggle */}
              <div className="col-span-2 flex items-center gap-3">
                <button onClick={() => setEditing({ ...editing, popular: !editing.popular })} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all", editing.popular ? "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25" : "text-[#b9cbc2]/50 border-[rgba(0,255,204,0.12)]")}>
                  {editing.popular ? <ToggleRight size={14} /> : <ToggleLeft size={14} />} Mark as Popular
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={savePlan} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all">
                <Save size={14} /> Save Plan
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2.5 rounded-lg text-sm text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
