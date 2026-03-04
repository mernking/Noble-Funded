import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { TrendingUp, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { api } from "@/lib/api.js";

const STATUS_CONFIG = {
  active: { label: "Active", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  passed: { label: "Passed", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  failed: { label: "Failed", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("challenges")
      .then((res) => setChallenges(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? challenges
      : challenges.filter((c) => c.status === filter);

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
            }}
          >
            My Challenges
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {challenges.length} total challenge
            {challenges.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/pricing"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
            color: "#070b11",
            padding: "0.625rem 1.25rem",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <TrendingUp size={16} /> Buy New Challenge
        </Link>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {["all", "active", "passed", "failed", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${filter === f ? "#c9a84c" : "#1e2f4a"}`,
              background: filter === f ? "rgba(201,168,76,0.1)" : "transparent",
              color: filter === f ? "#c9a84c" : "#7a8fa6",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "capitalize",
              fontFamily: "inherit",
            }}
          >
            {f === "all" ? "All" : STATUS_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Challenges grid */}
      {loading ? (
        <div style={{ color: "#7a8fa6", padding: "3rem", textAlign: "center" }}>
          Loading your challenges…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <TrendingUp
            size={48}
            color="#1e2f4a"
            style={{ marginBottom: "1rem" }}
          />
          <p style={{ color: "#7a8fa6", marginBottom: "1rem" }}>
            {filter === "all"
              ? "You haven't purchased any challenges yet."
              : `No ${filter} challenges found.`}
          </p>
          <Link
            to="/pricing"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              color: "#070b11",
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((c) => {
            const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
            const startBal = Number(c.startingBalance);
            const curBal = Number(c.currentBalance);
            const target = Number(c.profitTarget);
            const progressPct = Math.min(
              ((curBal - startBal) / (target - startBal)) * 100,
              100,
            );
            const currency = c.accountType === "naira" ? "₦" : "$";

            return (
              <Link
                to={`/dashboard/challenges/${c.id}`}
                key={c.id}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#0d1421",
                    borderRadius: "16px",
                    border: "1px solid #1e2f4a",
                    padding: "1.5rem",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#c9a84c";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1e2f4a";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          color: "#f0f4ff",
                        }}
                      >
                        {currency}
                        {startBal.toLocaleString()}
                      </div>
                      <div
                        style={{
                          color: "#7a8fa6",
                          fontSize: "0.78rem",
                          textTransform: "uppercase",
                          marginTop: "0.2rem",
                        }}
                      >
                        {c.accountType} account
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        background: status.bg,
                        color: status.color,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Balances */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#111b2e",
                        borderRadius: "8px",
                        padding: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          color: "#7a8fa6",
                          fontSize: "0.72rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Current Balance
                      </div>
                      <div style={{ color: "#f0f4ff", fontWeight: 700 }}>
                        {currency}
                        {curBal.toLocaleString()}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#111b2e",
                        borderRadius: "8px",
                        padding: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          color: "#7a8fa6",
                          fontSize: "0.72rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Profit Target
                      </div>
                      <div style={{ color: "#f0f4ff", fontWeight: 700 }}>
                        {currency}
                        {target.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span style={{ color: "#7a8fa6", fontSize: "0.75rem" }}>
                        Progress to target
                      </span>
                      <span
                        style={{
                          color: "#c9a84c",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {Math.max(0, progressPct).toFixed(1)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#1e2f4a",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(0, progressPct)}%`,
                          background:
                            "linear-gradient(90deg, #c9a84c, #f0c96a)",
                          borderRadius: "3px",
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                  </div>

                  {/* MT5 */}
                  <div
                    style={{
                      color: "#7a8fa6",
                      fontSize: "0.78rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Clock size={13} /> MT5: {c.mt5Login || "Provisioning…"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
