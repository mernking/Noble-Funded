"use client";

import { Download, FileText, BarChart2, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function MarketingReports() {
  const [generating, setGenerating] = useState(false);

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Marketing Reports</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Generate and export marketing performance reports.</p>
        </div>
        <button onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2000); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold">
          <FileText size={14} /> {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: "Traffic Performance Report", desc: "Sessions, pageviews, bounce rate analysis", icon: BarChart2 },
          { label: "Campaign ROI Report", desc: "Budget spend vs conversion outcomes", icon: TrendingUp },
          { label: "Conversion Funnel Report", desc: "Full funnel drop-off analysis", icon: FileText },
        ].map((t) => (
          <button key={t.label} className="glass-card rounded-xl p-5 text-left hover:border-[#00ffcc]/30 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-[#0b2f2d] flex items-center justify-center mb-3">
              <t.icon size={16} className="text-[#00ffcc]" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">{t.label}</p>
            <p className="text-xs text-[#b9cbc2]/60">{t.desc}</p>
            <span className="text-[10px] text-[#00ffcc] mt-2 block group-hover:underline">Generate →</span>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(0,255,204,0.08)]">
          <h2 className="text-sm font-semibold font-display text-white">Saved Reports</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,255,204,0.06)]">
              {["REPORT NAME", "PERIOD", "DATE", "FORMAT", ""].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-[10px] tracking-widest text-[#b9cbc2]/40 uppercase font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Q1 Traffic Summary", period: "Jan–Mar 2026", date: "Mar 31, 2026", format: "PDF" },
              { name: "Campaign Performance Q1", period: "Q1 2026", date: "Mar 28, 2026", format: "XLSX" },
              { name: "Conversion Funnel Feb", period: "Feb 2026", date: "Feb 28, 2026", format: "PDF" },
              { name: "Source Attribution Report", period: "Q1 2026", date: "Mar 25, 2026", format: "CSV" },
            ].map((r) => (
              <tr key={r.name} className="table-row-hover border-b border-[rgba(0,255,204,0.04)]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <FileText size={13} className="text-[#00ffcc]/50" />
                    <span className="text-sm text-white">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/70">{r.period}</td>
                <td className="px-4 py-3.5 text-xs text-[#b9cbc2]/70">{r.date}</td>
                <td className="px-4 py-3.5"><span className="chip-neutral text-[10px] px-2 py-0.5 rounded-full">{r.format}</span></td>
                <td className="px-4 py-3.5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,204,0.2)] text-xs text-[#00ffcc] hover:bg-[#00ffcc]/05 transition-all">
                    <Download size={11} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
