"use client";

import { useState } from "react";
import { Rocket, CheckCircle, XCircle, Clock, GitBranch, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const deployments = [
  { id: "DEP-v2.4.1", branch: "main", commit: "f4a2bc9", message: "Fix: Payout batch timeout + Email retry logic", status: "SUCCESS", time: "4h ago", duration: "2m 14s", actor: "Elena Rodriguez" },
  { id: "DEP-v2.4.0", branch: "main", commit: "8e1dc3a", message: "Feat: Real-time compliance monitoring dashboard", status: "SUCCESS", time: "2d ago", duration: "2m 48s", actor: "Alexander Noble" },
  { id: "DEP-v2.3.9", branch: "hotfix/kyc", commit: "c92a001", message: "Hotfix: KYC OCR timeout increase to 60s", status: "FAILED", time: "3d ago", duration: "0m 54s", actor: "Elena Rodriguez" },
  { id: "DEP-v2.3.8", branch: "main", commit: "7b3d102", message: "Refactor: Challenge phase state machine rewrite", status: "SUCCESS", time: "5d ago", duration: "3m 02s", actor: "Elena Rodriguez" },
  { id: "DEP-v2.3.7", branch: "release/q1", commit: "aa10f88", message: "Release: Q1 feature bundle — marketing analytics", status: "SUCCESS", time: "7d ago", duration: "2m 38s", actor: "Alexander Noble" },
];

const STATUS_ICONS = {
  SUCCESS: CheckCircle,
  FAILED: XCircle,
  PENDING: Clock,
};

const STATUS_STYLES = {
  SUCCESS: "chip-active",
  FAILED: "chip-danger",
  PENDING: "chip-warning",
};

export default function DeployView() {
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const triggerDeploy = () => {
    setDeploying(true);
    setTimeout(() => { setDeploying(false); setDeployed(true); }, 3000);
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Deployment Console</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Manage and monitor production deployments.</p>
        </div>
        <button
          onClick={triggerDeploy}
          disabled={deploying}
          className={cn("btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", deploying ? "bg-[#0b2f2d] border border-[#00ffcc]/30 text-[#00ffcc]" : "bg-[#00ffcc] text-[#001716]")}
        >
          <Rocket size={14} className={deploying ? "animate-bounce" : ""} />
          {deploying ? "Deploying..." : deployed ? "Deploy Again" : "Deploy to Production"}
        </button>
      </div>

      {/* Current Version */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">Current Production Version</p>
          <p className="text-2xl font-bold font-display text-white">v2.4.1</p>
          <p className="text-xs text-[#b9cbc2]/60 mt-1">Deployed 4h ago • <span className="text-[#00ffcc]">All services healthy</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">Environment</p>
          <span className="chip-active text-xs px-3 py-1 rounded-full font-semibold">PRODUCTION</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">Branch</p>
          <div className="flex items-center gap-1.5 text-sm text-white">
            <GitBranch size={13} className="text-[#00ffcc]" /> main
          </div>
        </div>
      </div>

      {/* Deploy progress */}
      {deploying && (
        <div className="glass-card rounded-xl p-5 border-[#00ffcc]/20">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw size={16} className="text-[#00ffcc] animate-spin" />
            <p className="text-sm font-semibold text-white">Deploying to Production...</p>
          </div>
          <div className="space-y-2">
            {["Building Docker image", "Running test suite", "Pushing to registry", "Updating services"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <CheckCircle size={12} className="text-[#00ffcc] flex-shrink-0" />
                <span className="text-xs text-[#b9cbc2]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment History */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-sm font-semibold font-display text-white">Deployment History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.06)]">
              {["VERSION", "COMMIT", "MESSAGE", "DEPLOYED BY", "DURATION", "TIME", "STATUS"].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deployments.map((d) => {
              const Icon = STATUS_ICONS[d.status as keyof typeof STATUS_ICONS] || Clock;
              return (
                <tr key={d.id} className={cn("table-row-hover border-b border-[rgba(0,255,204,0.04)]", d.status === "FAILED" && "bg-[#ff4444]/03")}>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono text-[#00ffcc]">{d.id}</span></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <GitBranch size={10} className="text-[#b9cbc2]/40" />
                      <span className="text-[10px] font-mono text-[#b9cbc2]/60">{d.branch}</span>
                      <span className="text-[10px] font-mono text-[#00ffcc]/60 bg-[#00ffcc]/05 px-1 rounded">{d.commit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[240px]"><span className="text-xs text-[#b9cbc2] truncate block">{d.message}</span></td>
                  <td className="px-4 py-3.5 text-xs text-[#b9cbc2]">{d.actor}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-[#b9cbc2]/70">{d.duration}</td>
                  <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/50">{d.time}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full", STATUS_STYLES[d.status as keyof typeof STATUS_STYLES])}>
                      <Icon size={10} /> {d.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
