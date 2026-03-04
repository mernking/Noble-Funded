import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { api } from "@/lib/api.js";

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`admin/challenges${filter ? `?status=${filter}` : ""}`)
      .then((r) => setChallenges(r.data?.challenges || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const STATUS = {
    active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    passed: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    failed: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
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
            <TrendingUp size={22} color="#c9a84c" /> Challenges
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {challenges.length} records
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "0.5rem 0.875rem",
            background: "#0d1421",
            border: "1px solid #1e2f4a",
            borderRadius: "8px",
            color: "#f0f4ff",
            fontSize: "0.8rem",
            outline: "none",
          }}
        >
          <option value="">All</option>
          {["active", "passed", "failed", "pending"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2f4a" }}>
                {[
                  "Type",
                  "Balance",
                  "Target",
                  "P&L",
                  "MT5",
                  "Status",
                  "Created",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "1rem 1.25rem",
                      textAlign: "left",
                      color: "#7a8fa6",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : challenges.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    No challenges found.
                  </td>
                </tr>
              ) : (
                challenges.map((c) => {
                  const s = STATUS[c.status] || STATUS.pending;
                  const currency = c.accountType === "naira" ? "₦" : "$";
                  const pnl =
                    Number(c.currentBalance) - Number(c.startingBalance);
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #111b2e" }}
                    >
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#f0f4ff",
                          textTransform: "capitalize",
                        }}
                      >
                        {c.accountType}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#f0f4ff",
                        }}
                      >
                        {currency}
                        {Number(c.startingBalance).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#c9a84c",
                        }}
                      >
                        {currency}
                        {Number(c.profitTarget).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: pnl >= 0 ? "#22c55e" : "#ef4444",
                          fontWeight: 700,
                        }}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {currency}
                        {pnl.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                        }}
                      >
                        {c.mt5Login || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.6rem",
                            borderRadius: "4px",
                            background: s.bg,
                            color: s.color,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                          fontSize: "0.78rem",
                        }}
                      >
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
