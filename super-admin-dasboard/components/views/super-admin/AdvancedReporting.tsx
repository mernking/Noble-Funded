"use client";

import { useState } from "react";
import { FileBarChart, Download, Calendar, Filter, TrendingUp, Users, CreditCard, Trophy } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jul", revenue: 320000, payouts: 145000, newUsers: 210, challenges: 88 },
  { month: "Aug", revenue: 410000, payouts: 180000, newUsers: 248, challenges: 104 },
  { month: "Sep", revenue: 480000, payouts: 210000, newUsers: 290, challenges: 122 },
  { month: "Oct", revenue: 520000, payouts: 230000, newUsers: 312, challenges: 140 },
  { month: "Nov", revenue: 610000, payouts: 270000, newUsers: 380, challenges: 162 },
  { month: "Dec", revenue: 847000, payouts: 380000, newUsers: 442, challenges: 188 },
];

const REPORTS = [
  { id: "revenue", label: "Revenue Summary", icon: TrendingUp, desc: "Monthly gross revenue, net after payouts, and profit margins" },
  { id: "users", label: "User Acquisition", icon: Users, desc: "New registrations, retention rates, and churn analysis" },
  { id: "payouts", label: "Payout Analysis", icon: CreditCard, desc: "Payout volume, methods breakdown, and processing times" },
  { id: "challenges", label: "Challenge Report", icon: Trophy, desc: "Phase pass rates, fail rates, and challenge performance" },
];

export default function AdvancedReporting() {
  const [activeReport, setActiveReport] = useState("revenue");
  const [dateRange, setDateRange] = useState("6m");

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Advanced Reporting</h1>
          <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Comprehensive platform analytics and custom report generation</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field bg-[#0b2f2d]/40 border border-[rgba(0,255,204,0.12)] rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ffcc] text-[#001716] text-sm font-semibold btn-primary hover:bg-[#00d4a8] transition-all">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORTS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
              activeReport === r.id
                ? "bg-[#00ffcc]/10 border-[#00ffcc]/30"
                : "glass-card hover:border-[#00ffcc]/20"
            }`}
          >
            <r.icon size={16} className={activeReport === r.id ? "text-[#00ffcc]" : "text-[#b9cbc2]/60"} />
            <p className={`text-sm font-semibold ${activeReport === r.id ? "text-white" : "text-[#b9cbc2]"}`}>{r.label}</p>
            <p className="text-[10px] text-[#b9cbc2]/50 leading-relaxed">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-1">Monthly Revenue vs Payouts</h2>
          <p className="text-[10px] text-[#b9cbc2]/50 mb-4">6-month rolling window</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0b2f2d", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 8 }}
                labelStyle={{ color: "#b9cbc2", fontSize: 11 }}
                formatter={(v: any, name: string) => [`₦${v.toLocaleString()}`, name === "revenue" ? "Revenue" : "Payouts"]}
              />
              <Bar dataKey="revenue" fill="#00ffcc" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="payouts" fill="#ffbc7c" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-1">User Growth Trend</h2>
          <p className="text-[10px] text-[#b9cbc2]/50 mb-4">New user registrations per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#b9cbc2", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0b2f2d", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 8 }}
                labelStyle={{ color: "#b9cbc2", fontSize: 11 }}
                formatter={(v: any) => [v, "New Users"]}
              />
              <Line type="monotone" dataKey="newUsers" stroke="#00ffcc" strokeWidth={2} dot={{ fill: "#00ffcc", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold font-display text-white mb-4">Monthly Summary Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,255,204,0.08)]">
                {["Month", "Gross Revenue", "Total Payouts", "Net Revenue", "New Users", "Challenges Passed"].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row) => {
                const net = row.revenue - row.payouts;
                return (
                  <tr key={row.month} className="border-b border-[rgba(0,255,204,0.04)] table-row-hover">
                    <td className="py-3 pr-4 text-sm font-semibold text-white">{row.month} 2024</td>
                    <td className="py-3 pr-4 text-sm text-[#00ffcc] font-semibold">₦{row.revenue.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-sm text-[#ffbc7c]">₦{row.payouts.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-sm text-white font-semibold">₦{net.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-sm text-[#b9cbc2]">{row.newUsers}</td>
                    <td className="py-3 text-sm text-[#b9cbc2]">{row.challenges}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
