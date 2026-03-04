import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  TrendingUp,
  BarChart2,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(7,11,17,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid #1e2f4a" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={20} color="#070b11" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#f0f4ff",
              letterSpacing: "-0.02em",
            }}
          >
            Noble<span style={{ color: "#c9a84c" }}>Funded</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          className="hidden-mobile"
        >
          {[
            ["Pricing", "/pricing"],
            ["How It Works", "/faq"],
            ["FAQ", "/faq"],
            ["Contact", "/contact"],
          ].map(([label, to]) => (
            <NavLink
              key={label}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? "#c9a84c" : "#7a8fa6",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "color 0.2s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {user ? (
            <Link
              to="/dashboard"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                color: "#070b11",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Dashboard <ChevronRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "#c9a84c",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Start Trading
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#f0f4ff",
              cursor: "pointer",
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "#0d1421",
            borderTop: "1px solid #1e2f4a",
            padding: "1.5rem 2rem",
          }}
        >
          {[
            ["Pricing", "/pricing"],
            ["FAQ", "/faq"],
            ["Contact", "/contact"],
            ["Login", "/login"],
            ["Sign Up", "/signup"],
          ].map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: "#f0f4ff",
                textDecoration: "none",
                padding: "0.75rem 0",
                borderBottom: "1px solid #1e2f4a",
                fontWeight: 500,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
