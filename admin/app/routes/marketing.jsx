import React, { useEffect, useState } from "react";
import {
  Megaphone,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api.js";

const mockFunnelData = [
  { stage: "Visitors", count: 4200 },
  { stage: "Signups", count: 1200 },
  { stage: "Purchased", count: 640 },
  { stage: "Passed", count: 290 },
  { stage: "Funded", count: 240 },
];

export default function Marketing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("admin/dashboard/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#f0f4ff",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Megaphone size={22} color="#c9a84c" /> Marketing Dashboard
        </h1>
        <p
          style={{
            color: "#7a8fa6",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          Platform growth and acquisition metrics
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Total Traders",
            value: stats?.totalUsers ?? "…",
            icon: Users,
            color: "#c9a84c",
          },
          {
            label: "Active Challenges",
            value: stats?.activeChallenges ?? "…",
            icon: TrendingUp,
            color: "#22c55e",
          },
          {
            label: "Pass Rate",
            value: stats?.totalUsers
              ? `${Math.round((Number(stats.passedChallenges || 0) / Number(stats.activeChallenges || 1)) * 100)}%`
              : "…",
            icon: Star,
            color: "#60a5fa",
          },
          {
            label: "Revenue",
            value: stats?.totalRevenue
              ? `₦${(Number(stats.totalRevenue) / 1000000).toFixed(1)}M`
              : "…",
            icon: DollarSign,
            color: "#a78bfa",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: "#0d1421",
              borderRadius: "14px",
              border: "1px solid #1e2f4a",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                background: `${color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
              }}
            >
              <Icon size={17} color={color} />
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                fontFamily: "Montserrat, sans-serif",
                color: "#f0f4ff",
              }}
            >
              {value}
            </div>
            <div
              style={{
                color: "#7a8fa6",
                fontSize: "0.78rem",
                marginTop: "0.25rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Chart */}
      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          padding: "1.5rem",
        }}
      >
        <h2
          style={{
            color: "#f0f4ff",
            fontWeight: 700,
            marginBottom: "1.5rem",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <BarChart3 size={18} color="#c9a84c" /> Acquisition Funnel
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockFunnelData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2f4a"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="stage"
              type="category"
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "8px",
                color: "#f0f4ff",
              }}
            />
            <Bar dataKey="count" fill="#c9a84c" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
