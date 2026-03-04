import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

const FAQS = [
  {
    q: "How does the challenge work?",
    a: "You pay a one-time challenge fee and we create an MT5 account. You must hit the profit target within the duration without breaching drawdown or daily loss limits.",
  },
  {
    q: "What happens after I pass?",
    a: "You request a payout via your dashboard. Our compliance team reviews and pays you 80% of all profits to your Nigerian bank account within 2–3 business days.",
  },
  {
    q: "What is the maximum drawdown?",
    a: "For Naira accounts, max drawdown is 10%. For Dollar accounts, it's 5%. This is calculated from your starting balance.",
  },
  {
    q: "Can I trade any instruments?",
    a: "Yes, you can trade forex major/minor pairs, indices, and commodities on MT5. Crypto pairs may be restricted depending on your account tier.",
  },
  {
    q: "What if I fail the challenge?",
    a: "The challenge fee is non-refundable, but you can simply purchase a new challenge to try again. We offer discounts for repeated attempts (coming soon).",
  },
  {
    q: "Are Dollar accounts funded in real USD?",
    a: "Dollar accounts are denominated in USD and trade USD instruments, but payouts are made in NGN at the prevailing rate to your Nigerian bank account.",
  },
  {
    q: "How long does MT5 account setup take?",
    a: "After payment is confirmed, your MT5 credentials are usually sent within 24 hours on business days.",
  },
  {
    q: "Is there a minimum trading day requirement?",
    a: "Currently there is no minimum trading day requirement — you just need to hit the target within the allotted duration.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: "#0d1421",
        borderRadius: "12px",
        border: "1px solid #1e2f4a",
        marginBottom: "0.75rem",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          color: "#f0f4ff",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{ fontWeight: 600, fontSize: "0.95rem", textAlign: "left" }}
        >
          {q}
        </span>
        {open ? (
          <ChevronUp size={18} color="#c9a84c" />
        ) : (
          <ChevronDown size={18} color="#7a8fa6" />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "0 1.5rem 1.25rem",
            color: "#7a8fa6",
            fontSize: "0.875rem",
            lineHeight: 1.75,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div style={{ minHeight: "100vh", background: "#070b11" }}>
      <Navbar />
      <section
        style={{
          padding: "9rem 2rem 5rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#f0f4ff",
              marginBottom: "1rem",
            }}
          >
            Frequently Asked <span style={{ color: "#c9a84c" }}>Questions</span>
          </h1>
          <p style={{ color: "#7a8fa6", lineHeight: 1.75 }}>
            Everything you need to know about Noble Funded
          </p>
        </div>
        {FAQS.map((item, i) => (
          <FaqItem key={i} {...item} />
        ))}
      </section>
      <Footer />
    </div>
  );
}
