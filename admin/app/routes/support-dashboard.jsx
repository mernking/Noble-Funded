import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Headphones,
  MessageCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Circle,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api
      .get("support/tickets")
      .then((r) => setTickets(r.data || []))
      .catch(() => toast.error("Failed to load tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const selectTicket = (t) => {
    api
      .get(`support/tickets/${t.id}`)
      .then((r) => setSelected(r.data))
      .catch(() => toast.error("Failed to load ticket details."));
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSubmitting(true);
    try {
      await api.post(`support/tickets/${selected.id}/reply`, {
        message: reply,
        isInternal: false,
      });
      toast.success("Reply sent.");
      setReply("");
      selectTicket(selected); // reload
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`support/tickets/${id}`, { status });
      toast.success("Ticket status updated.");
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const STATUS = {
    open: { color: "#ef4444", label: "Open" },
    in_progress: { color: "#f59e0b", label: "In Progress" },
    resolved: { color: "#22c55e", label: "Resolved" },
    closed: { color: "#7a8fa6", label: "Closed" },
  };

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <div style={{ marginBottom: "1.5rem" }}>
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
          <Headphones size={22} color="#c9a84c" /> Support Tickets
        </h1>
        <p
          style={{
            color: "#7a8fa6",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          {tickets.filter((t) => t.status === "open").length} open tickets
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "1.5rem",
          height: "calc(100vh - 200px)",
        }}
      >
        {/* Ticket list */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid #1e2f4a",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid #1e2f4a",
              fontWeight: 700,
              color: "#f0f4ff",
              fontSize: "0.9rem",
            }}
          >
            All Tickets
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#7a8fa6",
                }}
              >
                Loading…
              </div>
            ) : tickets.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#7a8fa6",
                }}
              >
                No tickets yet.
              </div>
            ) : (
              tickets.map((t) => {
                const s = STATUS[t.status] || STATUS.open;
                return (
                  <div
                    key={t.id}
                    onClick={() => selectTicket(t)}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid #111b2e",
                      cursor: "pointer",
                      background:
                        selected?.id === t.id ? "#111b2e" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: "#f0f4ff",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            marginBottom: "0.2rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.subject}
                        </div>
                        <div style={{ color: "#7a8fa6", fontSize: "0.75rem" }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                          background: `${s.color}15`,
                          color: s.color,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Ticket detail */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid #1e2f4a",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {!selected ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7a8fa6",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <MessageCircle size={36} color="#1e2f4a" />
              <span>Select a ticket to view</span>
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid #1e2f4a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ color: "#f0f4ff", fontWeight: 700 }}>
                    {selected.subject}
                  </div>
                  <div style={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    borderRadius: "6px",
                    color: "#f0f4ff",
                    fontSize: "0.78rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {(selected.replies || []).map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.875rem",
                      borderRadius: "10px",
                      background: "#111b2e",
                      border: "1px solid #1e2f4a",
                    }}
                  >
                    <div
                      style={{
                        color: "#7a8fa6",
                        fontSize: "0.72rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                    <div
                      style={{
                        color: "#f0f4ff",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {r.message}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderTop: "1px solid #1e2f4a",
                  display: "flex",
                  gap: "0.75rem",
                }}
              >
                <textarea
                  rows={2}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  style={{
                    flex: 1,
                    padding: "0.625rem 0.875rem",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    borderRadius: "8px",
                    color: "#f0f4ff",
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  onClick={sendReply}
                  disabled={submitting || !reply.trim()}
                  style={{
                    padding: "0.625rem 1.25rem",
                    background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                    color: "#070b11",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    alignSelf: "flex-end",
                    fontSize: "0.85rem",
                  }}
                >
                  {submitting ? "…" : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
