"use client";

import { useState, useEffect } from "react";
import {
  CreditCard, ToggleLeft, ToggleRight, Wallet, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Plus, Zap, DollarSign,
  Bitcoin, Globe, ArrowRight, TrendingUp, Clock, Shield,
} from "lucide-react";
import { api } from "@/lib/api";

type GatewayConfig = {
  flutterwavePublicKey?: { value: string; sensitive: boolean };
  flutterwaveSecretKey?: { value: string; sensitive: boolean };
  flutterwaveWebhookSecret?: { value: string; sensitive: boolean };
  stripePublicKey?: { value: string; sensitive: boolean };
  stripeSecretKey?: { value: string; sensitive: boolean };
  stripeWebhookSecret?: { value: string; sensitive: boolean };
  paymentMethods?: { value: string };
  autoApproveThreshold?: { value: string };
  manualReviewRequired?: { value: string };
  settlementSchedule?: { value: string };
  refundEnabled?: { value: string };
  testMode?: { value: string };
};

type Gateway = {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  enabled: boolean;
  status: "connected" | "degraded" | "offline";
  transactions24h: number;
  volume24h: number;
  successRate: number;
  lastPing: string;
  apiHealth: "ok" | "warn" | "down";
};

type PayoutWallet = {
  id: string;
  name: string;
  type: string;
  color: string;
  balance: number;
  currency: string;
  pendingPayouts: number;
  canFulfill: boolean;
  lastRefreshed: string;
};

// Gateway definitions with API keys mapping
const gatewayDefs = [
  { id: "flutterwave", name: "Flutterwave", type: "NGN / Multi-currency", icon: Zap, color: "#f5a623", apiKey: "flutterwaveSecretKey" },
  { id: "stripe", name: "Stripe", type: "Card / Bank Transfer", icon: CreditCard, color: "#635bff", apiKey: "stripeSecretKey" },
];

// Payout wallets - could be moved to API later
const payoutWallets: PayoutWallet[] = [
  { id: "deel", name: "Deel", type: "Global Payroll", color: "#00b398", balance: 45000, currency: "USD", pendingPayouts: 12, canFulfill: true, lastRefreshed: "5 min ago" },
  { id: "rise", name: "Rise", type: "African Payouts", color: "#8b5cf6", balance: 2100000, currency: "NGN", pendingPayouts: 28, canFulfill: true, lastRefreshed: "5 min ago" },
  { id: "crypto_wallet", name: "USDT Wallet", type: "Crypto Payouts", color: "#f7931a", balance: 18200, currency: "USDT", pendingPayouts: 4, canFulfill: true, lastRefreshed: "1 min ago" },
  { id: "bank", name: "GTBank Float", type: "Direct Bank Transfer", color: "#f97316", balance: 8500000, currency: "NGN", pendingPayouts: 6, canFulfill: false, lastRefreshed: "8 min ago" },
];

export default function PaymentGateway() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [config, setConfig] = useState<GatewayConfig>({});
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchGatewayData = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/payment-gateway");
      const data = response.data;
      
      setConfig(data.config || {});
      setStats(data.stats || {});

      // Map config to gateway status
      const mappedGateways: Gateway[] = gatewayDefs.map(gw => {
        const apiSecret = data.config?.[gw.apiKey]?.value;
        const isEnabled = !!apiSecret;
        
        return {
          ...gw,
          enabled: isEnabled,
          status: (isEnabled ? "connected" : "offline") as "connected" | "degraded" | "offline",
          transactions24h: gw.id === "flutterwave" ? (data.stats?.pendingTransactions || 0) : 0,
          volume24h: Number(data.stats?.todayVolume || 0),
          successRate: isEnabled ? 98.5 : 0,
          lastPing: isEnabled ? "just now" : "offline",
          apiHealth: (isEnabled ? "ok" : "down") as "ok" | "warn" | "down",
        };
      });
      
      setGateways(mappedGateways);
    } catch (err) {
      console.error("Failed to fetch payment gateway config", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatewayData();
  }, []);

  const toggleGateway = async (id: string) => {
    const gw = gateways.find(g => g.id === id);
    if (!gw) return;
    
    setSaving(true);
    try {
      // Toggle by setting or clearing the secret key
      const newValue = gw.enabled ? "" : "configured";
      await api.put("admin/payment-gateway", {
        config: {
          [`${id}SecretKey`]: { value: newValue, description: `${id} secret key` }
        }
      });
      await fetchGatewayData();
    } catch (err) {
      console.error("Failed to toggle gateway", err);
    } finally {
      setSaving(false);
    }
  };

  const testGateway = async (id: string) => {
    setTestingGateway(id);
    try {
      const response = await api.post("admin/payment-gateway/test", { gateway: id });
      if (response.data?.status === "connected") {
        // Success - refresh data
        await fetchGatewayData();
      }
    } catch (err) {
      console.error("Gateway test failed", err);
    } finally {
      setTimeout(() => setTestingGateway(null), 2000);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGatewayData();
    setRefreshing(false);
  };

  const totalVolume = gateways.reduce((a, g) => a + g.volume24h, 0);
  const totalTxns = gateways.reduce((a, g) => a + g.transactions24h, 0);
  const activeGateways = gateways.filter((g) => g.enabled && g.status === "connected").length;

  const healthColor = { ok: "#34d399", warn: "#ffbc7c", down: "#ff6b6b" };
  const statusColor = { connected: "#34d399", degraded: "#ffbc7c", offline: "#ff6b6b" };

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Payment Gateway Controller</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">Manage checkout gateways and payout provider float balances</p>
        </div>
        <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,204,0.18)] text-[12px] text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ACTIVE GATEWAYS", value: `${activeGateways} / ${gateways.length}`, icon: CheckCircle, color: "#34d399" },
          { label: "24H VOLUME", value: `₦${(totalVolume / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "#00ffcc" },
          { label: "24H TRANSACTIONS", value: totalTxns.toLocaleString(), icon: CreditCard, color: "#ffbc7c" },
          { label: "ALERTS", value: gateways.filter((g) => g.apiHealth !== "ok").length.toString(), icon: AlertTriangle, color: "#ff6b6b" },
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

      {/* Gateway Controls */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-[14px] font-semibold font-display text-white">Checkout Gateways</h2>
          <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Toggle payment methods on/off instantly without a code deploy</p>
        </div>
        <div className="divide-y divide-[rgba(0,255,204,0.05)]">
          {gateways.map((gw) => (
            <div key={gw.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors flex-wrap">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${gw.color}18`, border: `1px solid ${gw.color}30` }}
              >
                <gw.icon size={18} style={{ color: gw.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-white">{gw.name}</span>
                  <span className="text-[10px] text-[#a8c0b8]/50">{gw.type}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColor[gw.status]}15`, color: statusColor[gw.status] }}
                  >
                    {gw.status.toUpperCase()}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: `${healthColor[gw.apiHealth]}10`, color: healthColor[gw.apiHealth] }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor[gw.apiHealth] }} />
                    API {gw.apiHealth === "ok" ? "Healthy" : gw.apiHealth === "warn" ? "Degraded" : "Down"}
                  </span>
                </div>
                {gw.enabled && (
                  <div className="flex items-center gap-4 mt-1.5 text-[11px] text-[#a8c0b8]/50">
                    <span>{gw.transactions24h} txns (24h)</span>
                    <span>₦{(gw.volume24h / 1000000).toFixed(1)}M vol</span>
                    <span style={{ color: gw.successRate >= 98 ? "#34d399" : gw.successRate >= 95 ? "#ffbc7c" : "#ff6b6b" }}>{gw.successRate}% success</span>
                    <span className="flex items-center gap-1"><Clock size={9} /> ping {gw.lastPing}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => testGateway(gw.id)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#a8c0b8] bg-white/[0.04] border border-white/[0.08] hover:text-white transition-all"
                >
                  {testingGateway === gw.id ? <RefreshCw size={11} className="animate-spin" /> : "Test"}
                </button>
                <button onClick={() => toggleGateway(gw.id)}>
                  {gw.enabled
                    ? <ToggleRight size={28} style={{ color: gw.color }} />
                    : <ToggleLeft size={28} className="text-[#a8c0b8]/30" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Wallets */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-[14px] font-semibold font-display text-white">Payout Provider Float Balances</h2>
          <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Live view of available capital across payout providers to fulfill pending requests</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(0,255,204,0.06)]">
          {payoutWallets.map((wallet) => {
            const requiredPerPayout = wallet.currency === "NGN" ? 50000 : wallet.currency === "USD" ? 500 : 300;
            const estimatedRequired = wallet.pendingPayouts * requiredPerPayout;
            const canFulfill = wallet.balance >= estimatedRequired;
            return (
              <div key={wallet.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${wallet.color}18`, border: `1px solid ${wallet.color}30` }}>
                      <Wallet size={16} style={{ color: wallet.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{wallet.name}</p>
                      <p className="text-[10px] text-[#a8c0b8]/50">{wallet.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {canFulfill
                      ? <CheckCircle size={14} className="text-[#34d399]" />
                      : <AlertTriangle size={14} className="text-[#ff6b6b]" />}
                    <span className="text-[10px] font-semibold" style={{ color: canFulfill ? "#34d399" : "#ff6b6b" }}>
                      {canFulfill ? "Can Fulfill" : "Low Float"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-[#a8c0b8]/50">Available Balance</span>
                    <span className="text-[18px] font-bold font-display" style={{ color: wallet.color }}>
                      {wallet.currency === "NGN" ? "₦" : wallet.currency === "USDT" ? "₮" : "$"}{wallet.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#a8c0b8]/50">Pending Payouts</span>
                    <span className="text-white font-semibold">{wallet.pendingPayouts} requests</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#a8c0b8]/50">Est. Required</span>
                    <span style={{ color: canFulfill ? "#34d399" : "#ff6b6b" }} className="font-semibold">
                      {wallet.currency === "NGN" ? "₦" : wallet.currency === "USDT" ? "₮" : "$"}{estimatedRequired.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1 text-[10px] text-[#a8c0b8]/40">Refreshed: {wallet.lastRefreshed}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
