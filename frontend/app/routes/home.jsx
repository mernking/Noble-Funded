import React from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  BarChart3,
  Users,
  DollarSign,
  ArrowUpRight,
  Zap,
  Target,
} from "lucide-react";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div
    style={{
      background: "#0d1421",
      borderRadius: "16px",
      border: "1px solid #1e2f4a",
      padding: "1.5rem",
      display: "flex",
      align: "start",
      flexDirection: "column",
      gap: "0.75rem",
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "12px",
        background: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={22} color={color} />
    </div>
    <div
      style={{
        fontSize: "2rem",
        fontWeight: 800,
        fontFamily: "Montserrat, sans-serif",
        color: "#f0f4ff",
      }}
    >
      {value}
    </div>
    <div style={{ color: "#7a8fa6", fontSize: "0.85rem" }}>{label}</div>
  </div>
);

const PlanCard = ({
  name,
  badge,
  fee,
  capital,
  target,
  drawdown,
  duration,
  currency,
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
          fontSize: "0.75rem",
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        MOST POPULAR
      </div>
    )}
    <span
      style={{
        background: "#1e2f4a",
        color: "#c9a84c",
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
      }}
    >
      {badge}
    </span>
    <h3
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: "1.3rem",
        fontWeight: 800,
        color: "#f0f4ff",
        marginTop: "0.75rem",
        marginBottom: "0.25rem",
      }}
    >
      {name}
    </h3>
    <p style={{ color: "#7a8fa6", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
      Trading Capital: <strong style={{ color: "#c9a84c" }}>{capital}</strong>
    </p>
    <div
      style={{
        fontSize: "2.25rem",
        fontWeight: 900,
        fontFamily: "Montserrat, sans-serif",
        color: "#f0f4ff",
        marginBottom: "0.25rem",
      }}
    >
      {fee}
    </div>
    <div style={{ color: "#7a8fa6", fontSize: "0.8rem", marginBottom: "2rem" }}>
      One-time challenge fee
    </div>
    {[
      ["Profit Target", target],
      ["Max Drawdown", drawdown],
      ["Duration", duration],
      ["Currency", currency],
    ].map(([k, v]) => (
      <div
        key={k}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.625rem 0",
          borderBottom: "1px solid #1e2f4a",
          fontSize: "0.875rem",
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
        gap: "0.5rem",
        marginTop: "1.75rem",
        background: featured
          ? "linear-gradient(135deg, #c9a84c, #f0c96a)"
          : "transparent",
        color: featured ? "#070b11" : "#c9a84c",
        border: featured ? "none" : "2px solid #c9a84c",
        borderRadius: "10px",
        padding: "0.875rem",
        fontWeight: 700,
        fontSize: "0.9rem",
        textDecoration: "none",
      }}
    >
      Get Funded <ChevronRight size={16} />
    </Link>
  </div>
);

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark-bg)" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "900px",
              height: "900px",
              background:
                "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 60%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />
        </div>
        <div style={{ maxWidth: "780px", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.3)",
              padding: "0.375rem 1rem",
              borderRadius: "999px",
              marginBottom: "2rem",
              fontSize: "0.8rem",
              color: "#c9a84c",
              fontWeight: 600,
            }}
          >
            <Zap size={13} fill="currentColor" /> Nigeria's #1 Prop Trading Firm
          </div>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "#f0f4ff",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.03em",
            }}
          >
            Trade Our Capital.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Keep 80% of Profits.
            </span>
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "1.1rem",
              lineHeight: 1.75,
              maxWidth: "580px",
              margin: "0 auto 2.5rem",
              fontWeight: 400,
            }}
          >
            Pass our challenge, trade with up to{" "}
            <strong style={{ color: "#f0f4ff" }}>₦1,000,000</strong> or{" "}
            <strong style={{ color: "#f0f4ff" }}>$100,000</strong> in funded
            capital, and earn 80% of every trade you win.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/signup"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                color: "#070b11",
                padding: "1rem 2.25rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 8px 32px rgba(201,168,76,0.35)",
              }}
            >
              Start Your Challenge <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/pricing"
              style={{
                color: "#f0f4ff",
                border: "2px solid #1e2f4a",
                padding: "1rem 2.25rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                background: "transparent",
              }}
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "#0d1421",
          borderTop: "1px solid #1e2f4a",
          borderBottom: "1px solid #1e2f4a",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <StatCard
            label="Traders Funded"
            value="1,200+"
            icon={Users}
            color="#c9a84c"
          />
          <StatCard
            label="Total Payouts"
            value="₦85M+"
            icon={DollarSign}
            color="#22c55e"
          />
          <StatCard
            label="Active Challenges"
            value="340"
            icon={BarChart3}
            color="#60a5fa"
          />
          <StatCard
            label="Pass Rate"
            value="68%"
            icon={Target}
            color="#a78bfa"
          />
        </div>
      </section>

      {/* How it works */}
      <section
        style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "#f0f4ff",
              marginBottom: "1rem",
            }}
          >
            How Noble Funded Works
          </h2>
          <p
            style={{
              color: "#7a8fa6",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            A simple 3-step process to get funded and start earning
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              step: "01",
              icon: Shield,
              title: "Pay the Challenge Fee",
              desc: "Choose a Naira or Dollar account plan and pay a one-time challenge fee via Flutterwave.",
              color: "#c9a84c",
            },
            {
              step: "02",
              icon: TrendingUp,
              title: "Complete the Challenge",
              desc: "Trade the MT5 account we create for you. Hit your profit target without breaking risk rules.",
              color: "#60a5fa",
            },
            {
              step: "03",
              icon: CheckCircle2,
              title: "Get Funded & Paid",
              desc: "Pass the challenge, request your payout, and keep 80% of all profits. Repeat!",
              color: "#22c55e",
            },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div
              key={step}
              style={{
                background: "#0d1421",
                borderRadius: "16px",
                border: "1px solid #1e2f4a",
                padding: "2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "4rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  color: `${color}20`,
                  position: "absolute",
                  top: "1rem",
                  right: "1.5rem",
                  lineHeight: 1,
                }}
              >
                {step}
              </div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Icon size={25} color={color} />
              </div>
              <h3
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f0f4ff",
                  marginBottom: "0.75rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "#7a8fa6",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans preview */}
      <section style={{ padding: "5rem 2rem", background: "#070b11" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "#f0f4ff",
                marginBottom: "1rem",
              }}
            >
              Choose Your Challenge
            </h2>
            <p style={{ color: "#7a8fa6", lineHeight: 1.7 }}>
              Naira or Dollar — we have a plan for every trader
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <PlanCard
              name="Naira Starter"
              badge="NAIRA"
              fee="₦10,000"
              capital="₦200,000"
              target="200% (₦400k)"
              drawdown="10%"
              duration="60 Days"
              currency="NGN"
              featured={false}
            />
            <PlanCard
              name="Dollar Standard"
              badge="DOLLAR"
              fee="₦100,000"
              capital="$15,000"
              target="100% ($30k)"
              drawdown="5%"
              duration="90 Days"
              currency="USD"
              featured={true}
            />
            <PlanCard
              name="Dollar Elite"
              badge="DOLLAR"
              fee="₦450,000"
              capital="$100,000"
              target="100% ($200k profit)"
              drawdown="5%"
              duration="90 Days"
              currency="USD"
              featured={false}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              to="/pricing"
              style={{
                color: "#c9a84c",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.95rem",
              }}
            >
              See all plans & pricing <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "#f0f4ff",
              marginBottom: "1rem",
            }}
          >
            Why Noble Funded?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            {
              icon: Shield,
              title: "MT5 Trading",
              desc: "Trade on the industry-standard MetaTrader 5 platform with your funded account.",
            },
            {
              icon: DollarSign,
              title: "80% Profit Split",
              desc: "You keep 80% of everything you earn. No hidden fees or deductions.",
            },
            {
              icon: BarChart3,
              title: "Real-Time Monitoring",
              desc: "Your account is monitored 24/7. Violations are caught and reported instantly.",
            },
            {
              icon: Clock,
              title: "Fast Payouts",
              desc: "Request payouts anytime after passing. We process within 2–3 business days.",
            },
            {
              icon: Star,
              title: "Naira Accounts",
              desc: "Trade in Naira without worrying about FX risk. Perfect for Nigerian traders.",
            },
            {
              icon: Users,
              title: "Dedicated Support",
              desc: "Our support team is ready to help you every step of the way.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "#0d1421",
                borderRadius: "14px",
                border: "1px solid #1e2f4a",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(201,168,76,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <Icon size={20} color="#c9a84c" />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#f0f4ff",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "#7a8fa6",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem" }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            background: "linear-gradient(135deg, #0d1421, #111b2e)",
            border: "1px solid #c9a84c30",
            borderRadius: "24px",
            padding: "4rem 3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#f0f4ff",
              marginBottom: "1rem",
            }}
          >
            Ready to Get Funded?
          </h2>
          <p
            style={{
              color: "#7a8fa6",
              marginBottom: "2.5rem",
              lineHeight: 1.7,
            }}
          >
            Join over 1,200 traders already funded by Noble Funded. Start your
            challenge today.
          </p>
          <Link
            to="/signup"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              color: "#070b11",
              padding: "1rem 2.5rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "1rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 8px 32px rgba(201,168,76,0.3)",
            }}
          >
            Start Your Challenge <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
