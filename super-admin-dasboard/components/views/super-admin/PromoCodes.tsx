"use client";

import { useState, useEffect } from "react";
import {
  Tag, Plus, Copy, Trash2, Search, Filter, CheckCircle,
  XCircle, Clock, Trophy, DollarSign, Percent, Eye,
  ToggleLeft, ToggleRight, Calendar, Loader2,
} from "lucide-react";
import { api } from "@/lib/api";

type PromoCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  uses: number;
  maxUses: number;
  validFrom: string;
  validTo: string;
  planRestriction: string;
  status: "active" | "expired" | "paused";
  redemptions: number;
  revenue: number;
  discountType?: string;
  discountValue?: number;
  minPurchase?: number;
  isActive?: boolean;
  usageCount?: number;
};

const planOptions = ["All Plans", "₦200K Plan", "₦500K Plan", "₦1M Plan", "$15K Plan", "$50K Plan", "$100K Plan", "Naira Plans Only", "Dollar Plans Only"];

type NewCode = {
  code: string;
  type: "percent" | "fixed";
  value: string;
  maxUses: string;
  validFrom: string;
  validTo: string;
  planRestriction: string;
};

export default function PromoCodes() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "paused">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState<NewCode>({
    code: "", type: "percent", value: "", maxUses: "", validFrom: "", validTo: "", planRestriction: "All Plans"
  });
  const [copied, setCopied] = useState<string | null>(null);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/promo-codes?limit=50");
      const promoCodes = response.data?.promoCodes || [];
      
      setCodes(promoCodes.map((c: any) => ({
        id: c.id,
        code: c.code,
        type: c.discountType === "percentage" ? "percent" : "fixed",
        value: c.discountValue,
        uses: c.usageCount || 0,
        maxUses: c.maxUses || 0,
        validFrom: c.validFrom ? new Date(c.validFrom).toISOString().split("T")[0] : "",
        validTo: c.validTo ? new Date(c.validTo).toISOString().split("T")[0] : "",
        planRestriction: "All Plans",
        status: c.isActive ? "active" : "expired",
        redemptions: c.usageCount || 0,
        revenue: 0,
      })));
      
      if (response.data?.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch promo codes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const filtered = codes.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCreate = async () => {
    if (!newCode.code || !newCode.value) return;
    setSaving(true);
    
    try {
      const response = await api.post("admin/promo-codes", {
        code: newCode.code.toUpperCase(),
        discountType: newCode.type === "percent" ? "percentage" : "fixed",
        discountValue: Number(newCode.value),
        maxUses: newCode.maxUses ? Number(newCode.maxUses) : null,
        validFrom: newCode.validFrom || null,
        validUntil: newCode.validTo || null,
      });
      
      if (response.data?.promoCode) {
        const created = response.data.promoCode;
        setCodes([{
          id: created.id,
          code: created.code,
          type: created.discountType === "percentage" ? "percent" : "fixed",
          value: created.discountValue,
          uses: 0,
          maxUses: created.maxUses || 0,
          validFrom: created.validFrom ? new Date(created.validFrom).toISOString().split("T")[0] : "",
          validTo: created.validUntil ? new Date(created.validUntil).toISOString().split("T")[0] : "",
          planRestriction: "All Plans",
          status: "active",
          redemptions: 0,
          revenue: 0,
        }, ...codes]);
      }
      setShowCreateModal(false);
      setNewCode({ code: "", type: "percent", value: "", maxUses: "", validFrom: "", validTo: "", planRestriction: "All Plans" });
    } catch (err) {
      console.error("Failed to create promo code", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? false : true;
    
    try {
      await api.put(`admin/promo-codes/${id}`, { isActive: newStatus });
      setCodes((prev) =>
        prev.map((c) => c.id === id ? { ...c, status: newStatus ? "active" : "paused" } : c)
      );
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const deleteCode = async (id: string) => {
    try {
      await api.delete(`admin/promo-codes/${id}`);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete code", err);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusColor = { active: "#34d399", expired: "#a8c0b8", paused: "#ffbc7c" };
  const totalRevenue = codes.reduce((a, c) => a + c.revenue, 0);
  const activeCodes = codes.filter((c) => c.status === "active").length;
  const totalRedemptions = codes.reduce((a, c) => a + c.redemptions, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#00ffcc] animate-spin" />
        <p className="text-sm text-[#a8c0b8]">Loading promo codes...</p>
      </div>
    );
  }

  return (
    <div className="page-fade space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Tag size={20} className="text-[#00ffcc]" />
            <h1 className="text-xl font-bold font-display text-white">Promo Codes</h1>
          </div>
          <p className="text-[#b9cbc2]/60 text-sm">Create and manage discount codes for challenge purchases.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-bold hover:bg-[#00e6b8] transition-all">
          <Plus size={14} /> Create Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Codes", value: stats?.activeCodes?.toString() || activeCodes.toString(), color: "text-[#00ffcc]" },
          { label: "Total Redemptions", value: stats?.totalUses?.toLocaleString() || totalRedemptions.toString(), color: "text-white" },
          { label: "Total Revenue", value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, color: "text-[#a78bfa]" },
          { label: "Avg Discount", value: "28%", color: "text-[#ffbc7c]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[11px] text-[#b9cbc2]/50 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cbc2]/40" />
          <input
            type="text"
            placeholder="Search codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] text-white placeholder:text-[#b9cbc2]/40"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "expired", "paused"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f ? "bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30" : "text-[#b9cbc2]/60 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl p-8 text-center text-[#b9cbc2]/50">
            No promo codes found
          </div>
        ) : (
          filtered.map((code) => (
            <div key={code.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center">
                    <Tag size={18} className="text-[#00ffcc]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold font-display">{code.code}</h3>
                      <button onClick={() => copyCode(code.code)} className="text-[#b9cbc2]/50 hover:text-[#00ffcc]">
                        {copied === code.code ? <CheckCircle size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#b9cbc2]/50">
                      {code.type === "percent" ? `${code.value}% OFF` : `₦${code.value.toLocaleString()} OFF`}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{ background: `${statusColor[code.status]}15`, color: statusColor[code.status] }}
                >
                  {code.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="text-[#b9cbc2]/60">
                  <p>Uses: {code.uses} / {code.maxUses || "∞"}</p>
                  <p>Valid: {code.validFrom || "N/A"} - {code.validTo || "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#00ffcc] font-bold">{code.redemptions} redemptions</p>
                  <p className="text-[#b9cbc2]/50">₦{code.revenue.toLocaleString()} revenue</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[rgba(0,255,204,0.08)]">
                <button
                  onClick={() => toggleStatus(code.id, code.status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                    code.status === "active"
                      ? "bg-[#ffbc7c]/10 text-[#ffbc7c] border border-[#ffbc7c]/20"
                      : "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20"
                  }`}
                >
                  {code.status === "active" ? <Pause size={12} /> : <Play size={12} />}
                  {code.status === "active" ? "Pause" : "Activate"}
                </button>
                <button
                  onClick={() => deleteCode(code.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ff4444]/10 text-[#ff4444] hover:bg-[#ff4444]/20"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <h2 className="text-lg font-bold font-display text-white">Create Promo Code</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Code</label>
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                  placeholder="e.g. SUMMER50"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Type</label>
                  <select
                    value={newCode.type}
                    onChange={(e) => setNewCode({ ...newCode, type: e.target.value as "percent" | "fixed" })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Value</label>
                  <input
                    type="number"
                    value={newCode.value}
                    onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                    placeholder={newCode.type === "percent" ? "10" : "5000"}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Max Uses</label>
                  <input
                    type="number"
                    value={newCode.maxUses}
                    onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                    placeholder="100"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#b9cbc2]/50 mb-1 block">Valid Until</label>
                  <input
                    type="date"
                    value={newCode.validTo}
                    onChange={(e) => setNewCode({ ...newCode, validTo: e.target.value })}
                    className="input-field w-full px-3 py-2 text-sm rounded-lg bg-[#0b2f2d]/60 border border-[rgba(0,255,204,0.15)] text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-[#b9cbc2] border border-[rgba(0,255,204,0.12)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newCode.code || !newCode.value}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#00ffcc] text-[#001716] disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pause(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>; }
function Play(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>; }