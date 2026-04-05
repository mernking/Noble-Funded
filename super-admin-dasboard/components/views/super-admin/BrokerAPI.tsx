"use client";

import { useState, useEffect } from "react";
import {
  Server, Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, Settings, Plus, Eye, ToggleLeft, ToggleRight,
  Activity, Zap, Clock, Link2, Edit3, Save, X,
} from "lucide-react";
import { api } from "@/lib/api";

type BrokerConnection = {
  id: string;
  name: string;
  server: string;
  login: string;
  token: string;
  status: "connected" | "connecting" | "offline";
  latency: number;
  lastSync: string;
  accountsManaged: number;
  version: string;
  env: "live" | "demo";
};

type GroupMapping = {
  phase: string;
  description: string;
  brokerGroup: string;
  color: string;
  accountCount: number;
};

// Default group mappings
const defaultGroupMappings: GroupMapping[] = [
  { phase: "Phase 1", description: "First evaluation stage", brokerGroup: "NF_PHASE1", color: "#ffbc7c", accountCount: 0 },
  { phase: "Phase 2", description: "Second evaluation stage", brokerGroup: "NF_PHASE2", color: "#60a5fa", accountCount: 0 },
  { phase: "Funded Account", description: "Live funded trader", brokerGroup: "NF_FUNDED", color: "#00ffcc", accountCount: 0 },
  { phase: "Free Trial", description: "Demo trial accounts", brokerGroup: "NF_TRIAL", color: "#a78bfa", accountCount: 0 },
];

export default function BrokerAPI() {
  const [connections, setConnections] = useState<BrokerConnection[]>([]);
  const [mappings, setMappings] = useState<GroupMapping[]>(defaultGroupMappings);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newConn, setNewConn] = useState({ name: "", server: "", login: "", token: "", env: "live" as "live" | "demo" });

  const fetchBrokerData = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/broker-api");
      const data = response.data;
      
      // Map backend config to frontend format
      const brokers = data?.brokers || [];
      const mappedConnections: BrokerConnection[] = brokers.map((b: any, i: number) => ({
        id: b.id || `broker_${i}`,
        name: b.name || `Broker ${i + 1}`,
        server: b.server || "",
        login: b.login || "",
        token: b.token || "",
        status: b.isConnected ? "connected" : "offline",
        latency: b.latency || 0,
        lastSync: b.lastSync || "never",
        accountsManaged: b.accountsManaged || 0,
        version: b.version || "MT5",
        env: b.env || "live",
      }));
      
      setConnections(mappedConnections);
      
      // Update group mappings with account counts from API
      const updatedMappings = defaultGroupMappings.map((m, i) => ({
        ...m,
        accountCount: data?.groupCounts?.[i] || 0,
      }));
      setMappings(updatedMappings);
    } catch (err) {
      console.error("Failed to fetch broker config", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokerData();
  }, []);

  const pingConnection = async (id: string) => {
    setPinging(id);
    try {
      const response = await api.post("admin/broker-api/test", { serverId: id });
      const result = response.data;
      
      setConnections((prev) => prev.map((c) => 
        c.id === id ? { 
          ...c, 
          status: result?.status === "connected" ? "connected" : "offline", 
          latency: result?.latency || 0,
          lastSync: "just now"
        } : c
      ));
    } catch (err) {
      console.error("Ping failed", err);
      setConnections((prev) => prev.map((c) => 
        c.id === id ? { ...c, status: "offline" } : c
      ));
    } finally {
      setPinging(null);
    }
  };

  const addConnection = async () => {
    if (!newConn.name || !newConn.server) return;
    
    try {
      await api.post("admin/broker-api", {
        name: newConn.name,
        server: newConn.server,
        login: newConn.login,
        token: newConn.token,
        env: newConn.env,
      });
      await fetchBrokerData();
      setShowAddModal(false);
      setNewConn({ name: "", server: "", login: "", token: "", env: "live" });
    } catch (err) {
      console.error("Failed to add broker", err);
    }
  };

  const updateGroupMapping = async (phase: string, value: string) => {
    try {
      await api.put("admin/broker-api", {
        groupMapping: { phase, brokerGroup: value }
      });
      setMappings((prev) => prev.map((m) => m.phase === phase ? { ...m, brokerGroup: value } : m));
      setEditingGroup(null);
    } catch (err) {
      console.error("Failed to update group mapping", err);
    }
  };

  const statusColor = { connected: "#34d399", connecting: "#ffbc7c", offline: "#ff6b6b" };
  const totalManaged = connections.filter((c) => c.status === "connected").reduce((a, c) => a + c.accountsManaged, 0);

  return (
    <div className="page-fade space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffcc] pulse-dot" />
            <h1 className="text-[22px] font-bold font-display text-white">Broker API & Server Management</h1>
          </div>
          <p className="text-[13px] text-[#a8c0b8]/60">MT5 server connections, API tokens, and phase-group mappings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00ffcc] text-[#010e0d] text-[13px] font-semibold"
        >
          <Plus size={14} /> Add Server
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ACTIVE SERVERS", value: `${connections.filter((c) => c.status === "connected").length} / ${connections.length}`, icon: Server, color: "#00ffcc" },
          { label: "ACCOUNTS MANAGED", value: totalManaged.toLocaleString(), icon: Activity, color: "#34d399" },
          { label: "AVG LATENCY", value: `${Math.round(connections.filter((c) => c.latency > 0).reduce((a, c) => a + c.latency, 0) / connections.filter((c) => c.latency > 0).length)}ms`, icon: Zap, color: "#ffbc7c" },
          { label: "OFFLINE SERVERS", value: connections.filter((c) => c.status === "offline").length.toString(), icon: WifiOff, color: "#ff6b6b" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-[9px] tracking-widest text-[#a8c0b8]/50 uppercase font-display mb-0.5">{s.label}</p>
            <p className="text-[18px] font-bold font-display text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Server Connections */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-[14px] font-semibold font-display text-white">MT5 Server Connections</h2>
          <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Live connection status with broker servers</p>
        </div>
        <div className="divide-y divide-[rgba(0,255,204,0.05)]">
          {connections.map((conn) => (
            <div key={conn.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors flex-wrap">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                style={{ background: `${statusColor[conn.status]}15`, border: `1px solid ${statusColor[conn.status]}30` }}
              >
                <Server size={18} style={{ color: statusColor[conn.status] }} />
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a1e1c]"
                  style={{ background: statusColor[conn.status] }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-white font-mono">{conn.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: conn.env === "live" ? "#00ffcc15" : "#a78bfa15", color: conn.env === "live" ? "#00ffcc" : "#a78bfa" }}>{conn.env}</span>
                  <span className="text-[10px] font-bold uppercase" style={{ color: statusColor[conn.status] }}>{conn.status}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-[11px] text-[#a8c0b8]/50 flex-wrap">
                  <span className="flex items-center gap-1 font-mono"><Link2 size={9} /> {conn.server}</span>
                  <span>Login: {conn.login}</span>
                  {conn.status === "connected" && (
                    <>
                      <span className="flex items-center gap-1"><Zap size={9} /> {conn.latency}ms</span>
                      <span>{conn.accountsManaged} accounts</span>
                    </>
                  )}
                  <span className="flex items-center gap-1"><Clock size={9} /> {conn.lastSync}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => pingConnection(conn.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
                  style={{ borderColor: `${statusColor[conn.status]}30`, color: statusColor[conn.status], background: `${statusColor[conn.status]}08` }}
                  disabled={pinging === conn.id}
                >
                  {pinging === conn.id ? <RefreshCw size={11} className="animate-spin" /> : <Wifi size={11} />}
                  {pinging === conn.id ? "Pinging..." : "Ping"}
                </button>
                <button className="p-2 rounded-lg text-[#a8c0b8]/40 hover:text-[#a8c0b8] hover:bg-white/[0.05] transition-all">
                  <Settings size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Mappings */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-[14px] font-semibold font-display text-white">Phase — Broker Group Mapping</h2>
          <p className="text-[11px] text-[#a8c0b8]/50 mt-0.5">Map platform phases to their corresponding MT5 broker groups</p>
        </div>
        <div className="divide-y divide-[rgba(0,255,204,0.05)]">
          {mappings.map((mapping) => (
            <div key={mapping.phase} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${mapping.color}15`, border: `1px solid ${mapping.color}25` }}>
                <Server size={13} style={{ color: mapping.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white">{mapping.phase}</p>
                <p className="text-[10px] text-[#a8c0b8]/50">{mapping.description} — {mapping.accountCount} accounts</p>
              </div>
              {editingGroup === mapping.phase ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mapping.brokerGroup}
                    onChange={(e) => updateGroupMapping(mapping.phase, e.target.value)}
                    className="bg-white/[0.05] border border-[rgba(0,255,204,0.25)] rounded-lg px-2.5 py-1.5 text-[12px] font-mono text-[#00ffcc] outline-none w-36"
                  />
                  <button onClick={() => setEditingGroup(null)} className="text-[#34d399]"><Save size={14} /></button>
                  <button onClick={() => setEditingGroup(null)} className="text-[#a8c0b8]/50"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <code className="text-[12px] font-mono text-[#00ffcc] bg-[#00ffcc]/08 px-2.5 py-1 rounded-lg">{mapping.brokerGroup}</code>
                  <button onClick={() => setEditingGroup(mapping.phase)} className="text-[#a8c0b8]/40 hover:text-[#a8c0b8] transition-colors">
                    <Edit3 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="glass-modal rounded-2xl p-6 w-full max-w-md relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold font-display text-white">Add MT5 Server</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#a8c0b8]/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Server Name", key: "name", placeholder: "NF-LIVE-03" },
                { label: "Server IP:Port", key: "server", placeholder: "192.168.1.103:443" },
                { label: "Login", key: "login", placeholder: "nf_admin" },
                { label: "API Token", key: "token", placeholder: "eyJ..." },
              ].map((field) => (
                <div key={field.key} className={field.key === "token" ? "col-span-2" : ""}>
                  <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">{field.label}</label>
                  <input
                    type={field.key === "token" ? "password" : "text"}
                    value={(newConn as any)[field.key]}
                    onChange={(e) => setNewConn({ ...newConn, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-white/[0.05] border border-[rgba(0,255,204,0.12)] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#a8c0b8]/40 outline-none focus:border-[rgba(0,255,204,0.35)] font-mono"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-[11px] text-[#a8c0b8]/60 mb-1.5 block uppercase tracking-wider">Environment</label>
                <div className="flex gap-2">
                  {(["live", "demo"] as const).map((env) => (
                    <button
                      key={env}
                      onClick={() => setNewConn({ ...newConn, env })}
                      className="flex-1 py-2 rounded-xl text-[12px] font-semibold capitalize transition-all"
                      style={newConn.env === env
                        ? { background: env === "live" ? "#00ffcc20" : "#a78bfa20", border: `1px solid ${env === "live" ? "#00ffcc35" : "#a78bfa35"}`, color: env === "live" ? "#00ffcc" : "#a78bfa" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#a8c0b8" }}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-[#a8c0b8] bg-white/[0.05] border border-white/[0.08]">Cancel</button>
              <button onClick={addConnection} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#010e0d] bg-[#00ffcc]">Add Server</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
