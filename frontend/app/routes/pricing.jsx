import React from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

const NAIRA_PLANS = [
  {
    name: "Naira Starter",
    capital: "₦200,000",
    fee: "₦10,000",
    target: "₦400,000",
    drawdown: "10%",
    daily: "5%",
    days: 60,
    split: "80%",
  },
  {
    name: "Naira Standard",
    capital: "₦500,000",
    fee: "₦25,000",
    target: "₦1,000,000",
    drawdown: "10%",
    daily: "5%",
    days: 60,
    split: "80%",
    featured: true,
  },
  {
    name: "Naira Elite",
    capital: "₦1,000,000",
    fee: "₦60,000",
    target: "₦2,000,000",
    drawdown: "10%",
    daily: "5%",
    days: 60,
    split: "80%",
  },
];
const DOLLAR_PLANS = [
  {
    name: "Dollar Starter",
    capital: "$5,000",
    fee: "₦40,000",
    target: "$10,000",
    drawdown: "5%",
    daily: "3%",
    days: 90,
    split: "80%",
  },
  {
    name: "Dollar Standard",
    capital: "$15,000",
    fee: "₦100,000",
    target: "$30,000",
    drawdown: "5%",
    daily: "3%",
    days: 90,
    split: "80%",
    featured: true,
  },
  {
    name: "Dollar Pro",
    capital: "$50,000",
    fee: "₦250,000",
    target: "$100,000",
    drawdown: "5%",
    daily: "3%",
    days: 90,
    split: "80%",
  },
  {
    name: "Dollar Elite",
    capital: "$100,000",
    fee: "₦450,000",
    target: "$200,000",
    drawdown: "5%",
    daily: "3%",
    days: 90,
    split: "80%",
  },
];

const PlanCard = ({
  name,
  capital,
  fee,
  target,
  drawdown,
  daily,
  days,
  split,
  featured,
}) => (
  <div
    style={{
      background: featured
        ? "linear-gradient(135deg, #111b2e, #0d1421)"
        : "#0d1421",
      borderRadius: "20px",
      border: featured ? "2px solid #c9a84c" : "1px solid #1e2f4a",
      padding: "2rem",
      position: "relative",
      transition: "transform 0.2s",
    }}
  >
    {featured && (
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
          color: "#070b11",
          padding: "0.25rem 1rem",
          borderRadius: "999px",
          fontSize: "0.72rem",
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        MOST POPULAR
      </div>
    )}
    <h3
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: "1.1rem",
        fontWeight: 800,
        color: "#f0f4ff",
        marginBottom: "0.5rem",
      }}
    >
      {name}
    </h3>
    <div
      style={{
        color: "#c9a84c",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 900,
        fontSize: "1.5rem",
        marginBottom: "0.25rem",
      }}
    >
      {fee}
    </div>
    <div
      style={{ color: "#7a8fa6", fontSize: "0.8rem", marginBottom: "1.5rem" }}
    >
      One-time fee • Capital: <b style={{ color: "#f0f4ff" }}>{capital}</b>
    </div>
    {[
      ["Profit Target", target],
      ["Max Drawdown", drawdown],
      ["Daily Loss Limit", daily],
      ["Duration", `${days} days`],
      ["Profit Split", split],
    ].map(([k, v]) => (
      <div
        key={k}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 0",
          borderBottom: "1px solid #1e2f4a",
          fontSize: "0.85rem",
        }}
      >
        <span style={{ color: "#7a8fa6" }}>{k}</span>
        <span style={{ color: "#f0f4ff", fontWeight: 600 }}>{v}</span>
      </div>
    ))}
    <Link
      to="/signup"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        marginTop: "1.5rem",
        background: featured
          ? "linear-gradient(135deg, #c9a84c, #f0c96a)"
          : "transparent",
        color: featured ? "#070b11" : "#c9a84c",
        border: featured ? "none" : "2px solid #c9a84c",
        borderRadius: "10px",
        padding: "0.875rem",
        fontWeight: 700,
        fontSize: "0.875rem",
        textDecoration: "none",
      }}
    >
      Get Started <ArrowUpRight size={16} />
    </Link>
  </div>
);

export default function Pricing() {
  return (
    <div style={{ minHeight: "100vh", background: "#070b11" }}>
      <Navbar />
      <section style={{ padding: "9rem 2rem 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "#f0f4ff",
                marginBottom: "1rem",
                letterSpacing: "-0.03em",
              }}
            >
              Simple, <span style={{ color: "#c9a84c" }}>Transparent</span>{" "}
              Pricing
            </h1>
            <p
              style={{
                color: "#7a8fa6",
                maxWidth: "540px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              No hidden fees. No subscription. Pay once, get funded, keep 80% of
              profits.
            </p>
          </div>

          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#f0f4ff",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                background: "rgba(201,168,76,0.1)",
                color: "#c9a84c",
                padding: "0.25rem 0.875rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              ₦ NAIRA
            </span>{" "}
            Naira Accounts
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "4rem",
            }}
          >
            {NAIRA_PLANS.map((p) => (
              <PlanCard key={p.name} {...p} />
            ))}
          </div>

          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#f0f4ff",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                background: "rgba(96,165,250,0.1)",
                color: "#60a5fa",
                padding: "0.25rem 0.875rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              $ DOLLAR
            </span>{" "}
            Dollar Accounts
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {DOLLAR_PLANS.map((p) => (
              <PlanCard key={p.name} {...p} />
            ))}
          </div>

          {/* Note */}
          <div
            style={{
              background: "#0d1421",
              border: "1px solid #1e2f4a",
              borderRadius: "14px",
              padding: "1.5rem",
              marginTop: "3rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <CheckCircle2
              size={20}
              color="#22c55e"
              style={{ flexShrink: 0, marginTop: "0.1rem" }}
            />
            <p
              style={{
                color: "#7a8fa6",
                fontSize: "0.875rem",
                lineHeight: 1.7,
              }}
            >
              All challenge fees are paid via Flutterwave (card or bank
              transfer). Dollar accounts are funded in USD backed by Naira
              equivalents. After passing, your payout is paid to your Nigerian
              bank account.{" "}
              <Link to="/faq" style={{ color: "#c9a84c" }}>
                See FAQ →
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
