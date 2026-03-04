import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  MessageCircle,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("support/tickets")
      .then((r) => setTickets(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error("Subject and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("support/tickets", form);
      setTickets((prev) => [res.data, ...prev]);
      toast.success("Ticket submitted! We'll respond within 24 hours.");
      setShowForm(false);
      setForm({ subject: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const STATUS = {
    open: { color: "#ef4444", label: "Open", icon: Circle },
    in_progress: { color: "#f59e0b", label: "In Progress", icon: Clock },
    resolved: { color: "#22c55e", label: "Resolved", icon: CheckCircle },
    closed: { color: "#7a8fa6", label: "Closed", icon: CheckCircle },
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "#111b2e",
    border: "1px solid #1e2f4a",
    borderRadius: "8px",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
  };

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
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
            Support
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            Get help from our team
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
            color: "#070b11",
            padding: "0.625rem 1.25rem",
            borderRadius: "10px",
            border: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "inherit",
          }}
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #c9a84c30",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              color: "#f0f4ff",
              fontWeight: 700,
              marginBottom: "1.5rem",
              fontSize: "1rem",
            }}
          >
            Create Support Ticket
          </h2>
          <form onSubmit={handleSubmit}>
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
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Briefly describe your issue"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
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
                Message
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue in detail…"
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "#111b2e",
                  border: "1px solid #1e2f4a",
                  borderRadius: "8px",
                  color: "#7a8fa6",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#7a8fa6" }}>
          Loading tickets…
        </div>
      ) : tickets.length === 0 ? (
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <MessageCircle
            size={48}
            color="#1e2f4a"
            style={{ marginBottom: "1rem" }}
          />
          <p style={{ color: "#7a8fa6" }}>
            No support tickets yet. Need help? Open a ticket above.
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {tickets.map((t) => {
            const s = STATUS[t.status] || STATUS.open;
            return (
              <div
                key={t.id}
                style={{
                  background: "#0d1421",
                  borderRadius: "12px",
                  border: "1px solid #1e2f4a",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#f0f4ff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t.subject}
                    </span>
                    <span
                      style={{
                        padding: "0.15rem 0.6rem",
                        borderRadius: "999px",
                        background: `${s.color}15`,
                        color: s.color,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div style={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
                    Opened {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <ChevronRight size={18} color="#7a8fa6" />
              </div>
            );
          })}
        </div>
      )}

      {/* Contact info */}
      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          padding: "1.5rem",
          marginTop: "2rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              color: "#c9a84c",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "0.25rem",
            }}
          >
            📧 Email
          </div>
          <div style={{ color: "#7a8fa6", fontSize: "0.85rem" }}>
            support@noblefunded.com
          </div>
        </div>
        <div>
          <div
            style={{
              color: "#c9a84c",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "0.25rem",
            }}
          >
            💬 WhatsApp
          </div>
          <div style={{ color: "#7a8fa6", fontSize: "0.85rem" }}>
            +234 800 NOBLE 01
          </div>
        </div>
        <div>
          <div
            style={{
              color: "#c9a84c",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "0.25rem",
            }}
          >
            ⏰ Response Time
          </div>
          <div style={{ color: "#7a8fa6", fontSize: "0.85rem" }}>
            Within 24 hours
          </div>
        </div>
      </div>
    </div>
  );
}
