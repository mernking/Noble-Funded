import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { api } from "@/lib/api.js";

const StatCard = ({ label, value, sub, icon: Icon, color, iconBg }) => (
  <div
    style={{
      background: "#0d1421",
      borderRadius: "16px",
      border: "1px solid #1e2f4a",
      padding: "1.5rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}
    >
      <span
        style={{
          color: "#7a8fa6",
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color={color} />
      </div>
    </div>
    <div
      style={{
        fontSize: "1.75rem",
        fontWeight: 800,
        fontFamily: "Montserrat, sans-serif",
        color: "#f0f4ff",
        marginBottom: "0.25rem",
      }}
    >
      {value}
    </div>
    {sub && <div style={{ color: "#7a8fa6", fontSize: "0.8rem" }}>{sub}</div>}
  </div>
);

export default function Overview() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));

    api
      .get("challenges")
      .then((res) => {
        setChallenges(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = challenges.filter((c) => c.status === "active");
  const passed = challenges.filter((c) => c.status === "passed");
  const failed = challenges.filter((c) => c.status === "failed");
  const pendingPayouts = challenges.filter((c) => c.status === "passed").length;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#f0f4ff",
            marginBottom: "0.25rem",
          }}
        >
          Good day, {user?.fullName?.split(" ")[0] || "Trader"} 👋
        </h1>
        <p style={{ color: "#7a8fa6", fontSize: "0.9rem" }}>
          Here's a snapshot of your trading activity
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Active Challenges"
          value={active.length}
          sub="Currently trading"
          icon={Activity}
          color="#c9a84c"
          iconBg="rgba(201,168,76,0.12)"
        />
        <StatCard
          label="Challenges Passed"
          value={passed.length}
          sub="Eligible for payout"
          icon={TrendingUp}
          color="#22c55e"
          iconBg="rgba(34,197,94,0.12)"
        />
        <StatCard
          label="Challenges Failed"
          value={failed.length}
          sub="All time"
          icon={TrendingDown}
          color="#ef4444"
          iconBg="rgba(239,68,68,0.12)"
        />
        <StatCard
          label="Pending Payouts"
          value={pendingPayouts}
          sub="Awaiting review"
          icon={CreditCard}
          color="#60a5fa"
          iconBg="rgba(96,165,250,0.12)"
        />
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Active challenges preview */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "1.5rem",
            gridColumn: active.length ? "span 2" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f0f4ff",
              }}
            >
              Active Challenges
            </h2>
            <Link
              to="/dashboard/challenges"
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
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div
              style={{
                color: "#7a8fa6",
                fontSize: "0.875rem",
                padding: "1rem 0",
              }}
            >
              Loading challenges…
            </div>
          ) : active.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div
                style={{
                  color: "#7a8fa6",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                No active challenges yet.
              </div>
              <Link
                to="/pricing"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                Buy a Challenge
              </Link>
            </div>
          ) : (
            active.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem",
                  background: "#111b2e",
                  borderRadius: "10px",
                  marginBottom: "0.625rem",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#f0f4ff",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {c.accountType === "naira" ? "₦" : "$"}
                    {Number(c.startingBalance).toLocaleString()}
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.15rem 0.5rem",
                        background: "rgba(34,197,94,0.12)",
                        color: "#22c55e",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>
                  <div style={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
                    {c.mt5Login ? `MT5: ${c.mt5Login}` : "MT5 provisioning…"}
                  </div>
                </div>
                <Link
                  to={`/dashboard/challenges/${c.id}`}
                  style={{
                    color: "#c9a84c",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Quick Links */}
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
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#f0f4ff",
              marginBottom: "1.25rem",
            }}
          >
            Quick Actions
          </h2>
          {[
            {
              label: "Buy a Challenge",
              to: "/pricing",
              color: "#c9a84c",
              icon: TrendingUp,
            },
            {
              label: "Request Payout",
              to: "/dashboard/payouts",
              color: "#22c55e",
              icon: CreditCard,
            },
            {
              label: "View Challenge History",
              to: "/dashboard/challenges",
              color: "#60a5fa",
              icon: Clock,
            },
            {
              label: "Get Support",
              to: "/dashboard/support",
              color: "#a78bfa",
              icon: Activity,
            },
          ].map(({ label, to, color, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                background: "#111b2e",
                borderRadius: "10px",
                textDecoration: "none",
                marginBottom: "0.5rem",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={15} color={color} />
              </div>
              <span
                style={{
                  color: "#f0f4ff",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
              <ChevronRight
                size={14}
                color="#7a8fa6"
                style={{ marginLeft: "auto" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
