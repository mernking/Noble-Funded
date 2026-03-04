import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Phone, MessageCircle, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("support/tickets", {
        subject: form.subject || `Enquiry from ${form.name}`,
        message: `From: ${form.name} <${form.email}>\n\n${form.message}`,
      });
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send. Please try email instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    background: "#111b2e",
    border: "1px solid #1e2f4a",
    borderRadius: "10px",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070b11" }}>
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />
      <section
        style={{
          padding: "9rem 2rem 5rem",
          maxWidth: "1100px",
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
            Get In <span style={{ color: "#c9a84c" }}>Touch</span>
          </h1>
          <p style={{ color: "#7a8fa6", lineHeight: 1.75 }}>
            We're here to help with any questions about our platform
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Info */}
          <div>
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#f0f4ff",
                marginBottom: "1.5rem",
              }}
            >
              Contact Information
            </h2>
            {[
              { icon: Mail, label: "Email", value: "support@noblefunded.com" },
              { icon: Phone, label: "WhatsApp", value: "+234 800 NOBLE 01" },
              { icon: MessageCircle, label: "Telegram", value: "@NobleFunded" },
              { icon: MapPin, label: "Location", value: "Lagos, Nigeria" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(201,168,76,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="#c9a84c" />
                </div>
                <div>
                  <div
                    style={{
                      color: "#7a8fa6",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ color: "#f0f4ff", fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#0d1421",
                border: "1px solid #1e2f4a",
                borderRadius: "12px",
                padding: "1.25rem",
                marginTop: "0.5rem",
              }}
            >
              <div
                style={{
                  color: "#c9a84c",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                ⏰ Support Hours
              </div>
              <div
                style={{
                  color: "#7a8fa6",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                }}
              >
                Monday – Friday: 9am – 6pm WAT
                <br />
                Saturday: 10am – 2pm WAT
                <br />
                Sunday: Closed (Email only)
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              background: "#0d1421",
              borderRadius: "20px",
              border: "1px solid #1e2f4a",
              padding: "2.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#f0f4ff",
                marginBottom: "1.75rem",
              }}
            >
              Send us a message
            </h2>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#a0b4c8",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#a0b4c8",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "#a0b4c8",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Subject
                </label>
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="What's this about?"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "#a0b4c8",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Message *
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us more…"
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  background: submitting
                    ? "#6b5a30"
                    : "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Send size={16} /> {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
