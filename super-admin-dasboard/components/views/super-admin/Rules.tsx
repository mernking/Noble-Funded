"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, GripVertical, Save, X, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type RuleCategory = "Challenge Rules" | "Risk Management" | "Payout Rules" | "Account Rules";

interface TradingRule {
  id: string;
  title: string;
  description: string;
  category: RuleCategory;
  active: boolean;
  applies_to: string[];
  value?: string;
  unit?: string;
}

const CATEGORIES: RuleCategory[] = ["Challenge Rules", "Risk Management", "Payout Rules", "Account Rules"];

const CATEGORY_COLOR: Record<RuleCategory, string> = {
  "Challenge Rules": "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/25",
  "Risk Management": "text-[#ff6b6b] bg-[#ff4444]/10 border-[#ff4444]/25",
  "Payout Rules": "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/25",
  "Account Rules": "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
};

interface EditState {
  id: string | null;
  title: string;
  description: string;
  category: RuleCategory;
  value: string;
  unit: string;
  applies_to: string[];
}

const BLANK_EDIT: EditState = { id: null, title: "", description: "", category: "Challenge Rules", value: "", unit: "", applies_to: [] };
const ACCOUNT_TYPES = ["Phase 1", "Phase 2", "Funded"];

export default function RulesView() {
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<"All" | RuleCategory>("All");
  const [editing, setEditing] = useState<EditState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/rules");
      const rulesData = response.data?.rules || {};
      
      // Transform API response to component format
      const rulesList: TradingRule[] = Object.entries(rulesData).map(([key, value]: [string, any]) => ({
        id: key,
        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        description: value.description || "",
        category: "Challenge Rules", // Default category
        active: value.value !== undefined,
        applies_to: [],
        value: value.value,
        unit: value.unit
      }));
      
      setRules(rulesList.length > 0 ? rulesList : getDefaultRules());
    } catch (err) {
      console.error("Failed to fetch rules", err);
      setRules(getDefaultRules());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRules = (): TradingRule[] => [
    { id: "r1", title: "Maximum Daily Drawdown", description: "Traders may not exceed the maximum daily drawdown limit.", category: "Risk Management", active: true, applies_to: ["Phase 1", "Phase 2", "Funded"], value: "5%", unit: "%" },
    { id: "r2", title: "Maximum Overall Drawdown", description: "The total account drawdown must never exceed the maximum overall drawdown limit.", category: "Risk Management", active: true, applies_to: ["Phase 1", "Phase 2", "Funded"], value: "10%", unit: "%" },
    { id: "r3", title: "Minimum Profit Target — Phase 1", description: "Traders must reach the minimum profit target to pass Phase 1.", category: "Challenge Rules", active: true, applies_to: ["Phase 1"], value: "10%", unit: "%" },
    { id: "r4", title: "Minimum Profit Target — Phase 2", description: "Traders must reach the minimum profit target to pass Phase 2.", category: "Challenge Rules", active: true, applies_to: ["Phase 2"], value: "5%", unit: "%" },
    { id: "r5", title: "Minimum Trading Days", description: "Traders must trade for a minimum number of days.", category: "Challenge Rules", active: true, applies_to: ["Phase 1", "Phase 2", "Funded"], value: "4", unit: "days" },
    { id: "r6", title: "Profit Split — Tier 1", description: "Funded traders receive their profit split according to Tier 1 structure.", category: "Payout Rules", active: true, applies_to: ["Funded"], value: "80/20" },
    { id: "r7", title: "Profit Split — Tier 2", description: "After 200% payout, traders move to Tier 2 profit split.", category: "Payout Rules", active: true, applies_to: ["Funded"], value: "60/40" },
    { id: "r8", title: "No News Trading Restriction", description: "Traders cannot hold positions during major news events.", category: "Risk Management", active: false, applies_to: ["Phase 1", "Phase 2"] },
    { id: "r9", title: "Payout Minimum Threshold", description: "Minimum amount required for payout request.", category: "Payout Rules", active: true, applies_to: ["Funded"], value: "50000", unit: "NGN" },
    { id: "r10", title: "Maximum Challenge Duration", description: "Traders must complete Phase 1 within the maximum calendar day window.", category: "Account Rules", active: true, applies_to: ["Phase 1"], value: "30", unit: "days" },
  ];

  useEffect(() => {
    fetchRules();
  }, []);

  const filtered = rules.filter((r) => categoryFilter === "All" || r.category === categoryFilter);

  const toggleActive = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    
    const newRules = { ...(await api.get("admin/rules")).data?.rules || {}, [id]: { ...rule, value: rule.value, description: rule.description } };
    
    try {
      await api.put("admin/rules", { rules: newRules });
      setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    } catch (err) {
      console.error("Failed to toggle rule", err);
    }
  };

  const deleteRule = async (id: string) => {
    // Optimistic delete
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const startEdit = (rule: TradingRule) => {
    setEditing({ 
      id: rule.id, 
      title: rule.title, 
      description: rule.description, 
      category: rule.category, 
      value: rule.value || "", 
      unit: rule.unit || "",
      applies_to: rule.applies_to 
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(BLANK_EDIT);
    setShowForm(true);
  };

  const saveRule = async () => {
    if (!editing) return;
    setSaving(true);
    
    try {
      const rulesObj: any = {};
      rules.forEach(r => {
        rulesObj[r.id] = { value: r.value, description: r.description, unit: r.unit };
      });
      
      if (editing.id) {
        rulesObj[editing.id] = { value: editing.value, description: editing.description, unit: editing.unit };
      } else {
        const newId = `rule_${Date.now()}`;
        rulesObj[newId] = { value: editing.value, description: editing.description, unit: editing.unit };
      }
      
      await api.put("admin/rules", { rules: rulesObj });
      
      if (editing.id) {
        setRules((prev) => prev.map((r) => r.id === editing.id ? { ...r, title: editing.title, description: editing.description, value: editing.value, unit: editing.unit, category: editing.category, applies_to: editing.applies_to } : r));
      } else {
        const newRule: TradingRule = {
          id: `rule_${Date.now()}`,
          title: editing.title,
          description: editing.description,
          category: editing.category,
          active: true,
          applies_to: editing.applies_to,
          value: editing.value || undefined,
          unit: editing.unit || undefined,
        };
        setRules((prev) => [...prev, newRule]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save rule", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleAppliesTo = (type: string) => {
    if (!editing) return;
    const next = editing.applies_to.includes(type)
      ? editing.applies_to.filter((t) => t !== type)
      : [...editing.applies_to, type];
    setEditing({ ...editing, applies_to: next });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#00ffcc] animate-spin" />
        <p className="text-sm text-[#a8c0b8]">Loading trading rules...</p>
      </div>
    );
  }

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Trading Rules</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Define and manage challenge rules, risk limits, and payout policies.</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-bold hover:bg-[#00e6b8] transition-all"
        >
          <Plus size={14} /> Add Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const catRules = rules.filter((r) => r.category === cat);
          const activeCount = catRules.filter((r) => r.active).length;
          return (
            <div key={cat} className="glass-card rounded-xl p-4">
              <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-1 truncate">{cat}</p>
              <p className="text-2xl font-bold font-display text-white">{activeCount}<span className="text-[#b9cbc2]/30 text-sm font-normal">/{catRules.length}</span></p>
              <p className="text-[11px] text-[#b9cbc2]/40 mt-0.5">active rules</p>
            </div>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              categoryFilter === cat
                ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30"
                : "text-[#b9cbc2]/60 border border-transparent hover:border-[#00ffcc]/15"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center text-[#b9cbc2]/50">
            No rules found
          </div>
        ) : (
          filtered.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "glass-card rounded-xl p-4 flex items-start gap-4 transition-all",
                !rule.active && "opacity-60"
              )}
            >
              <div className="text-[#b9cbc2]/20 mt-0.5 cursor-grab">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-semibold text-sm">{rule.title}</h3>
                      {rule.value && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20">
                          {rule.value}{rule.unit ? ` ${rule.unit}` : ""}
                        </span>
                      )}
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", CATEGORY_COLOR[rule.category])}>{rule.category}</span>
                    </div>
                    <p className="text-xs text-[#b9cbc2]/60 leading-relaxed max-w-2xl">{rule.description}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {rule.applies_to.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0b2f2d] text-[#b9cbc2]/60 border border-[rgba(0,255,204,0.08)]">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(rule)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/50 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 transition-all">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => deleteRule(rule.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.08)] text-[#b9cbc2]/50 hover:text-[#ff6b6b] hover:border-[#ff4444]/20 transition-all">
                      <Trash2 size={12} />
                    </button>
                    <button
                      onClick={() => toggleActive(rule.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all",
                        rule.active ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/20" : "text-[#b9cbc2]/50 bg-[#0b2f2d]/40 border-[rgba(0,255,204,0.08)]"
                      )}
                    >
                      {rule.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      {rule.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg space-y-4 mx-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white">{editing.id ? "Edit Rule" : "Add New Rule"}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-[#b9cbc2]/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Rule Title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40"
                  placeholder="e.g. Maximum Daily Drawdown"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40 resize-none"
                  placeholder="Full rule description..."
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Value</label>
                  <input
                    type="text"
                    value={editing.value}
                    onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40"
                    placeholder="e.g. 5, 10, 80/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Unit (optional)</label>
                  <input
                    type="text"
                    value={editing.unit}
                    onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40"
                    placeholder="e.g. %, days, NGN"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1.5 block">Applies To</label>
                <div className="flex items-center gap-2">
                  {ACCOUNT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleAppliesTo(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition-all",
                        editing.applies_to.includes(t)
                          ? "bg-[#00ffcc]/15 text-[#00ffcc] border-[#00ffcc]/30"
                          : "text-[#b9cbc2]/50 border-[rgba(0,255,204,0.12)] hover:text-white"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={saveRule}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00ffcc] text-[#001716] font-bold text-sm hover:bg-[#00e6b8] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Rule
              </button>
              <button
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2.5 rounded-lg text-sm text-[#b9cbc2] border border-[rgba(0,255,204,0.12)] hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}