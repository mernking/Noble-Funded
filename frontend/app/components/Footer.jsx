import React from "react";
import { Link } from "react-router";
import { TrendingUp, Twitter, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0d1421",
        borderTop: "1px solid #1e2f4a",
        padding: "4rem 2rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={18} color="#070b11" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#f0f4ff",
                }}
              >
                Noble<span style={{ color: "#c9a84c" }}>Funded</span>
              </span>
            </div>
            <p
              style={{
                color: "#7a8fa6",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "260px",
              }}
            >
              Nigeria's premier prop trading firm. Funding ambitious traders
              since 2026.
            </p>
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}
            >
              {[Twitter, Instagram, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7a8fa6",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: [
                ["Pricing", "/pricing"],
                ["How It Works", "/faq"],
                ["FAQ", "/faq"],
              ],
            },
            {
              title: "Company",
              links: [
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Blog", "#"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Terms", "#"],
                ["Privacy", "#"],
                ["Risk Disclaimer", "#"],
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4
                style={{
                  color: "#f0f4ff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {title}
              </h4>
              {links.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    display: "block",
                    color: "#7a8fa6",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    marginBottom: "0.625rem",
                    transition: "color 0.2s",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #1e2f4a",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
            © 2026 Noble Funded. All rights reserved.
          </p>
          <p style={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
            Trading involves significant risk. Past performance is not
            indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
