"use client";

import { useState, useCallback } from "react";
import {
  SlidersHorizontal, Save, RotateCcw, CheckCircle2, AlertTriangle,
  Shield, Trophy, CreditCard, Clock, Zap, Info, TrendingDown,
  ChevronRight, ToggleLeft, ToggleRight, Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type RuleDataType = "percentage" | "currency_ngn" | "currency_usd" | "days" | "toggle" | "split" | "select";

interface ConfigRule {
  id: string;
  label: string;
  description: string;
  category: string;
  dataType: RuleDataType;
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  critical?: boolean;
  readFromDB: boolean; // n8n reads this from DB before enforcing
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_RULES: ConfigRule[] = [
  // Risk Management
  { id: "daily_loss_pct", label: "Daily Loss Limit", description: "Max % a trader can lose in a single trading day before auto-suspension triggers.", category: "Risk Management", dataType: "percentage", value: 5, min: 1, max: 15, step: 0.5, unit: "%", critical: true, readFromDB: true },
  { id: "overall_dd_pct", label: "Overall Drawdown Limit", description: "Max % total drawdown from the initial balance. Exceeding this ends the challenge.", category: "Risk Management", dataType: "percentage", value: 10, min: 5, max: 20, step: 0.5, unit: "%", critical: true, readFromDB: true },
  { id: "consistency_pct", label: "Consistency Rule Threshold", description: "No single day's profit may exceed this % of total profit target (prevents lump-sum trades).", category: "Risk Management", dataType: "percentage", value: 50, min: 20, max: 80, step: 5, unit: "%", readFromDB: true },
  { id: "news_trading", label: "News Trading Restriction", description: "Block positions 5 minutes before and after major news events (FOMC, NFP, CPI).", category: "Risk Management", dataType: "toggle", value: false, readFromDB: true },
  { id: "hedging_ban", label: "No Hedging Between Accounts", description: "Prevent same-instrument opposite positions across multiple accounts.", category: "Risk Management", dataType: "toggle", value: true, critical: true, readFromDB: true },
  { id: "max_lot_size", label: "Max Position Size (Lots)", description: "Maximum lot size allowed per trade relative to account size.", category: "Risk Management", dataType: "select", value: "5% of balance", options: ["1% of balance", "2% of balance", "5% of balance", "10% of balance", "Unlimited"], readFromDB: true },

  // Challenge Rules
  { id: "phase1_target", label: "Phase 1 Profit Target", description: "Minimum % gain required to pass Phase 1 evaluation.", category: "Challenge Rules", dataType: "percentage", value: 10, min: 5, max: 20, step: 0.5, unit: "%", readFromDB: true },
  { id: "phase2_target", label: "Phase 2 Profit Target", description: "Minimum % gain required to pass Phase 2 and become funded.", category: "Challenge Rules", dataType: "percentage", value: 5, min: 2, max: 15, step: 0.5, unit: "%", readFromDB: true },
  { id: "min_trading_days", label: "Minimum Trading Days", description: "Minimum distinct trading days before phase completion can be claimed.", category: "Challenge Rules", dataType: "days", value: 4, min: 1, max: 30, step: 1, unit: "days", readFromDB: true },
  { id: "phase1_duration", label: "Phase 1 Max Duration", description: "Maximum calendar days a trader has to complete Phase 1.", category: "Challenge Rules", dataType: "days", value: 30, min: 14, max: 90, step: 1, unit: "days", readFromDB: true },
  { id: "phase2_duration", label: "Phase 2 Max Duration", description: "Maximum calendar days a trader has to complete Phase 2.", category: "Challenge Rules", dataType: "days", value: 60, min: 14, max: 90, step: 1, unit: "days", readFromDB: true },
  { id: "weekend_positions", label: "Allow Weekend Positions", description: "Allow traders to hold open positions over the weekend.", category: "Challenge Rules", dataType: "toggle", value: true, readFromDB: true },

  // Payout Rules
  { id: "profit_split_t1", label: "Profit Split — Tier 1", description: "Trader's share of profits (%) up to 200% of account balance in total earnings.", category: "Payout Rules", dataType: "percentage", value: 80, min: 50, max: 95, step: 5, unit: "% trader", readFromDB: true },
  { id: "profit_split_t2", label: "Profit Split — Tier 2", description: "Trader's share of profits (%) after surpassing 200% of account balance in total earnings.", category: "Payout Rules", dataType: "percentage", value: 60, min: 40, max: 90, step: 5, unit: "% trader", readFromDB: true },
  { id: "payout_min_ngn", label: "Min Payout (Naira Accounts)", description: "Minimum ₦ amount required before a payout request is eligible.", category: "Payout Rules", dataType: "currency_ngn", value: 50000, min: 10000, max: 500000, step: 5000, unit: "₦", readFromDB: true },
  { id: "payout_min_usd", label: "Min Payout (Dollar Accounts)", description: "Minimum $ amount required before a payout request is eligible.", category: "Payout Rules", dataType: "currency_usd", value: 50, min: 10, max: 1000, step: 10, unit: "$", readFromDB: true },
  { id: "payout_cycle_days", label: "Payout Processing Window", description: "Business days within which approved payouts must be processed.", category: "Payout Rules", dataType: "days", value: 5, min: 1, max: 14, step: 1, unit: "business days", readFromDB: true },

  // Platform Rules
  { id: "allowed_instruments", label: "Forex Pairs Only Restriction", description: "Restrict trading to Forex pairs only — block crypto, commodities, indices.", category: "Platform", dataType: "toggle", value: false, readFromDB: true },
  { id: "auto_suspension", label: "Auto-Suspension (n8n)", description: "Allow n8n automation to auto-suspend accounts on rule breach.", category: "Platform", dataType: "toggle", value: true, critical: true, readFromDB: true },
  { id: "ip_restrictions", label: "IP Address Monitoring", description: "Flag accounts trading from unusual or VPN-detected IP addresses.", category: "Platform", dataType: "toggle", value: true, readFromDB: true },
];

const CATEGORIES = ["Risk Management", "Challenge Rules", "Payout Rules", "Platform"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_META: Record<Category, { color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }> }> = {
  "Risk Management": { color: "#ff6b6b", icon: Shield },
  "Challenge Rules": { color: "#00ffcc", icon: Trophy },
  "Payout Rules": { color: "#a78bfa", icon: CreditCard },
  "Platform": { color: "#60a5fa", icon: Database },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderControl({ rule, onChange }: { rule: ConfigRule; onChange: (id: string, val: number) => void }) {
  const val = rule.value as number;
  const pct = ((val - (rule.min ?? 0)) / ((rule.max ?? 100) - (rule.min ?? 0))) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#a8c0b8]/50">
          {rule.unit === "₦" ? `₦${val.toLocaleString()}` : rule.unit === "$" ? `$${val}` : `${val} ${rule.unit ?? ""}`}
        </span>
        <span className="text-[10px] text-[#a8c0b8]/30">{rule.min}{rule.unit} — {rule.max}{rule.unit}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full bg-[#0b2f2d]" />
        <div
          className="absolute h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #00ffcc88, #00ffcc)" }}
        />
        <input
          type="range"
          min={rule.min}
          max={rule.max}
          step={rule.step ?? 1}
          value={val}
          onChange={(e) => onChange(rule.id, parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-[#00ffcc] border-2 border-[#001716] shadow-lg transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function ToggleControl({ rule, onChange }: { rule: ConfigRule; onChange: (id: string, val: boolean) => void }) {
  const val = rule.value as boolean;
  return (
    <button
      onClick={() => onChange(rule.id, !val)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border transition-all",
        val
          ? "text-[#00ffcc] bg-[#00ffcc]/08 border-[#00ffcc]/25"
          : "text-[#a8c0b8]/50 bg-[#0b2f2d]/40 border-[rgba(0,255,204,0.08)]"
      )}
    >
      {val ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {val ? "Enabled" : "Disabled"}
    </button>
  );
}

function SelectControl({ rule, onChange }: { rule: ConfigRule; onChange: (id: string, val: string) => void }) {
  return (
    <select
      value={rule.value as string}
      onChange={(e) => onChange(rule.id, e.target.value)}
      className="input-field px-3 py-1.5 text-xs rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white focus:border-[#00ffcc]/40 min-w-[140px]"
    >
      {rule.options?.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RuleConfigMatrix() {
  const [rules, setRules] = useState<ConfigRule[]>(INITIAL_RULES);
  const [saved, setSaved] = useState<ConfigRule[]>(INITIAL_RULES);
  const [activeCategory, setActiveCategory] = useState<Category>("Risk Management");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [showChanges, setShowChanges] = useState(false);

  const filtered = rules.filter((r) => r.category === activeCategory);
  const hasChanges = JSON.stringify(rules) !== JSON.stringify(saved);

  const changed = rules.filter((r, i) => JSON.stringify(r.value) !== JSON.stringify(saved[i]?.value));

  const updateRule = useCallback((id: string, value: number | boolean | string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, value } : r));
  }, []);

  const handleSave = async () => {
    setSaveState("saving");
    // In production: POST /api/rules with rules array — n8n reads from DB
    await new Promise((r) => setTimeout(r, 1400));
    setSaved([...rules]);
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 3000);
  };

  const handleReset = () => {
    setRules([...saved]);
  };

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#00ffcc]/15 flex items-center justify-center">
              <SlidersHorizontal size={18} className="text-[#00ffcc]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">Rule Configuration Matrix</h1>
              <p className="text-[10px] tracking-widest text-[#a8c0b8]/40 uppercase">Business Logic Control Panel</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ffcc]/08 border border-[#00ffcc]/20">
            <Database size={11} className="text-[#00ffcc]" />
            <span className="text-[11px] text-[#00ffcc]/80">n8n reads from this database on every workflow run</span>
          </div>
          {hasChanges && (
            <button
              onClick={() => setShowChanges(!showChanges)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[#f59e0b] bg-[#f59e0b]/08 border border-[#f59e0b]/20 hover:bg-[#f59e0b]/15 transition-all"
            >
              <AlertTriangle size={11} />
              {changed.length} unsaved change{changed.length !== 1 ? "s" : ""}
              <ChevronRight size={10} className={cn("transition-transform", showChanges && "rotate-90")} />
            </button>
          )}
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-[#a8c0b8]/70 border border-[rgba(0,255,204,0.08)] hover:text-white hover:border-[rgba(0,255,204,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveState === "saving"}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold transition-all disabled:cursor-not-allowed",
              saveState === "saved"
                ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30"
                : hasChanges
                ? "bg-[#00ffcc] text-[#001716] hover:bg-[#00e6b8]"
                : "bg-[#0b2f2d]/40 text-[#a8c0b8]/30 border border-[rgba(0,255,204,0.06)]"
            )}
          >
            {saveState === "saving" ? (
              <><RotateCcw size={12} className="animate-spin" /> Saving to DB...</>
            ) : saveState === "saved" ? (
              <><CheckCircle2 size={12} /> Saved — n8n will pick up changes</>
            ) : (
              <><Save size={12} /> Save to Database</>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved changes preview */}
      {showChanges && hasChanges && (
        <div className="glass-card rounded-xl p-4 border border-[#f59e0b]/20 bg-[#f59e0b]/[0.03]">
          <p className="text-[11px] font-semibold text-[#f59e0b] mb-3 uppercase tracking-wider">Pending Changes (not yet saved to database)</p>
          <div className="space-y-2">
            {changed.map((r) => {
              const orig = saved.find((s) => s.id === r.id);
              return (
                <div key={r.id} className="flex items-center gap-3 text-[12px]">
                  <ChevronRight size={10} className="text-[#f59e0b]/60 flex-shrink-0" />
                  <span className="text-white font-medium">{r.label}</span>
                  <span className="text-[#a8c0b8]/50">
                    {String(orig?.value)}{r.unit ? ` ${r.unit}` : ""}
                  </span>
                  <span className="text-[#a8c0b8]/30">→</span>
                  <span className="text-[#00ffcc] font-semibold">
                    {String(r.value)}{r.unit ? ` ${r.unit}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#60a5fa]/[0.04] border border-[#60a5fa]/15">
        <Info size={14} className="text-[#60a5fa] flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#a8c0b8]/60 leading-relaxed">
          All changes saved here are written to the platform database. Your n8n workflows query this database before every enforcement decision — no need to touch n8n nodes or flows. Changes take effect on the next workflow evaluation cycle.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const catRules = rules.filter((r) => r.category === cat);
          const pendingCount = catRules.filter((r) => {
            const orig = saved.find((s) => s.id === r.id);
            return JSON.stringify(r.value) !== JSON.stringify(orig?.value);
          }).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all border",
                activeCategory === cat
                  ? "text-white"
                  : "text-[#a8c0b8]/60 border-transparent hover:text-white hover:border-[rgba(0,255,204,0.12)]"
              )}
              style={
                activeCategory === cat
                  ? { background: `${meta.color}15`, border: `1px solid ${meta.color}30`, color: meta.color }
                  : {}
              }
            >
              <meta.icon size={13} />
              {cat}
              {pendingCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b]">{pendingCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Rule cards */}
      <div className="space-y-3">
        {filtered.map((rule) => {
          const origValue = saved.find((s) => s.id === rule.id)?.value;
          const isDirty = JSON.stringify(rule.value) !== JSON.stringify(origValue);
          const catMeta = CATEGORY_META[rule.category as Category];
          return (
            <div
              key={rule.id}
              className={cn(
                "glass-card rounded-xl p-5 transition-all",
                isDirty && "border-[#f59e0b]/20 bg-[#f59e0b]/[0.02]"
              )}
            >
              <div className="flex items-start gap-4 flex-wrap">
                {/* Left: label + description */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-semibold text-white">{rule.label}</span>
                    {rule.critical && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ff4444]/10 text-[#ff6b6b] border border-[#ff4444]/20 flex items-center gap-1">
                        <Zap size={8} /> Critical
                      </span>
                    )}
                    {isDirty && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                        Modified
                      </span>
                    )}
                    {rule.readFromDB && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#60a5fa]/08 text-[#60a5fa]/70 border border-[#60a5fa]/15 flex items-center gap-1">
                        <Database size={7} /> n8n reads
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#a8c0b8]/50 leading-relaxed">{rule.description}</p>
                  {isDirty && (
                    <p className="text-[10px] text-[#f59e0b]/60 mt-1.5">
                      Previous: {String(origValue)}{rule.unit ? ` ${rule.unit}` : ""}
                    </p>
                  )}
                </div>

                {/* Right: control */}
                <div className="w-full sm:w-64">
                  {(rule.dataType === "percentage" || rule.dataType === "days" || rule.dataType === "currency_ngn" || rule.dataType === "currency_usd") && (
                    <SliderControl rule={rule} onChange={updateRule} />
                  )}
                  {rule.dataType === "toggle" && (
                    <ToggleControl rule={rule} onChange={updateRule} />
                  )}
                  {rule.dataType === "select" && (
                    <SelectControl rule={rule} onChange={updateRule} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save footer (sticky feel) */}
      {hasChanges && (
        <div className="sticky bottom-4 flex items-center justify-between px-5 py-3 rounded-xl glass-modal border border-[#f59e0b]/20 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingDown size={13} className="text-[#f59e0b]" />
            <span className="text-[12px] text-[#f59e0b]">{changed.length} rule{changed.length !== 1 ? "s" : ""} modified — not yet saved to database</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="px-3 py-2 rounded-lg text-[12px] text-[#a8c0b8]/70 border border-[rgba(0,255,204,0.08)] hover:text-white transition-all">
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold bg-[#00ffcc] text-[#001716] hover:bg-[#00e6b8] transition-all disabled:opacity-50"
            >
              {saveState === "saving" ? <><RotateCcw size={12} className="animate-spin" /> Saving...</> : <><Save size={12} /> Save to Database</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
