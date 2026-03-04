import React, { useEffect, useState } from "react";
import { BarChart3, DollarSign, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api.js";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const mockRevenue = months.map((m) => ({
  month: m,
  revenue: Math.floor(Math.random() * 5000000 + 2000000),
}));

export default function Revenue() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("admin/revenue")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#f0f4ff",
          marginBottom: "0.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <BarChart3 size={22} color="#c9a84c" /> Revenue
      </h1>
      <p
        style={{ color: "#7a8fa6", fontSize: "0.85rem", marginBottom: "2rem" }}
      >
        Platform revenue overview
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {(stats?.revenue || []).map((r) => (
          <div
            key={r.currency}
            style={{
              background: "#0d1421",
              borderRadius: "14px",
              border: "1px solid #1e2f4a",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                color: "#7a8fa6",
                fontSize: "0.78rem",
                marginBottom: "0.5rem",
              }}
            >
              Revenue ({r.currency})
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                fontFamily: "Montserrat, sans-serif",
                color: "#f0f4ff",
              }}
            >
              {r.currency === "NGN" ? "₦" : "$"}
              {Number(r.total).toLocaleString()}
            </div>
            <div
              style={{
                color: "#7a8fa6",
                fontSize: "0.78rem",
                marginTop: "0.25rem",
              }}
            >
              {r.count} transactions
            </div>
          </div>
        ))}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid rgba(239,68,68,0.3)",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              color: "#7a8fa6",
              fontSize: "0.78rem",
              marginBottom: "0.5rem",
            }}
          >
            Pending Payouts
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              color: "#ef4444",
            }}
          >
            ₦{Number(stats?.pendingPayouts || 0).toLocaleString()}
          </div>
        </div>
      </div>

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
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          Monthly Revenue Trend
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockRevenue}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2f4a" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7a8fa6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`}
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
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#rev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
