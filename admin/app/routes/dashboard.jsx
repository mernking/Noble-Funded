import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users,
  TrendingUp,
  CreditCard,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "@/lib/api.js";

const StatsCard = ({ label, value, icon: Icon, color, to }) => (
  <Link to={to || "#"} style={{ textDecoration: "none" }}>
    <div
      style={{
        background: "#0d1421",
        borderRadius: "14px",
        border: "1px solid #1e2f4a",
        padding: "1.25rem",
        transition: "border-color 0.2s",
        cursor: to ? "pointer" : "default",
      }}
      onMouseEnter={(e) => to && (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2f4a")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            color: "#7a8fa6",
            fontSize: "0.78rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color={color} />
        </div>
      </div>
      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          fontFamily: "Montserrat, sans-serif",
          color: "#f0f4ff",
        }}
      >
        {value ?? "—"}
      </div>
    </div>
  </Link>
);

// Mock chart data
const chartData = Array.from({ length: 14 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  revenue: Math.floor(Math.random() * 200000 + 50000),
}));

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("admin/dashboard/stats")
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#f0f4ff",
          }}
        >
          Admin Overview
        </h1>
        <p
          style={{
            color: "#7a8fa6",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          Noble Funded platform at a glance
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatsCard
          label="Total Traders"
          value={stats?.totalUsers ?? "…"}
          icon={Users}
          color="#c9a84c"
          to="/users"
        />
        <StatsCard
          label="Active Challenges"
          value={stats?.activeChallenges ?? "…"}
          icon={TrendingUp}
          color="#22c55e"
          to="/challenges"
        />
        <StatsCard
          label="Passed"
          value={stats?.passedChallenges ?? "…"}
          icon={CheckCircle}
          color="#60a5fa"
          to="/challenges"
        />
        <StatsCard
          label="Failed"
          value={stats?.failedChallenges ?? "…"}
          icon={XCircle}
          color="#ef4444"
          to="/challenges"
        />
        <StatsCard
          label="Pending Payouts"
          value={stats?.pendingPayouts ?? "…"}
          icon={Clock}
          color="#f59e0b"
          to="/payouts"
        />
        <StatsCard
          label="Total Revenue"
          value={
            stats?.totalRevenue
              ? `₦${Number(stats.totalRevenue).toLocaleString()}`
              : "…"
          }
          icon={BarChart3}
          color="#a78bfa"
          to="/revenue"
        />
      </div>

      {/* Revenue Chart */}
      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ color: "#f0f4ff", fontWeight: 700, fontSize: "1rem" }}>
            Revenue — Last 14 Days
          </h2>
          <Link
            to="/revenue"
            style={{
              color: "#c9a84c",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Full report <ArrowUpRight size={14} />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2f4a" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "8px",
                color: "#f0f4ff",
              }}
              formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#c9a84c"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          {
            label: "Manage Users",
            to: "/users",
            icon: Users,
            color: "#c9a84c",
          },
          {
            label: "Review Payouts",
            to: "/payouts",
            icon: CreditCard,
            color: "#22c55e",
          },
          {
            label: "All Challenges",
            to: "/challenges",
            icon: TrendingUp,
            color: "#60a5fa",
          },
          {
            label: "Activity Log",
            to: "/activity",
            icon: Activity,
            color: "#a78bfa",
          },
        ].map(({ label, to, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#0d1421",
              border: "1px solid #1e2f4a",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              textDecoration: "none",
              fontWeight: 600,
              color: "#f0f4ff",
              fontSize: "0.875rem",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#1e2f4a")
            }
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                background: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={17} color={color} />
            </div>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
