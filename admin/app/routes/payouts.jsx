import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processing, setProcessing] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("admin/challenges") // ideally /admin/payouts but using challenge endpoint
      .catch(() => {})
      .finally(() => setLoading(false));
    // Pull all payouts via challenge route workaround
    api
      .get("payouts")
      .then((r) => setPayouts(r.data || []))
      .catch(() => toast.error("Failed to load payouts."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    setProcessing(id);
    try {
      const res = await api.put(`payouts/${id}/approve`, {
        notes: "Approved by admin.",
      });
      toast.success(res.data?.message || "Payout approved.");
      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)),
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const reject = async (id) => {
    if (!reason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    setProcessing(id);
    try {
      const res = await api.put(`payouts/${id}/reject`, { reason });
      toast.success("Payout rejected.");
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "rejected", rejectedReason: reason }
            : p,
        ),
      );
      setRejectId(null);
      setReason("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = filter
    ? payouts.filter((p) => p.status === filter)
    : payouts;
  const STATUS = {
    pending: "#f59e0b",
    approved: "#60a5fa",
    paid: "#22c55e",
    rejected: "#ef4444",
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
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <CreditCard size={22} color="#c9a84c" /> Payouts
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {payouts.filter((p) => p.status === "pending").length} pending
            requests
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "0.5rem 0.875rem",
            background: "#0d1421",
            border: "1px solid #1e2f4a",
            borderRadius: "8px",
            color: "#f0f4ff",
            fontSize: "0.8rem",
            outline: "none",
          }}
        >
          <option value="">All Status</option>
          {["pending", "approved", "paid", "rejected"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2f4a" }}>
                {[
                  "Date",
                  "Amount",
                  "Bank",
                  "Account",
                  "Method",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "1rem 1.25rem",
                      textAlign: "left",
                      color: "#7a8fa6",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    No payouts found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const color = STATUS[p.status] || "#7a8fa6";
                  return (
                    <React.Fragment key={p.id}>
                      <tr style={{ borderBottom: "1px solid #111b2e" }}>
                        <td
                          style={{
                            padding: "0.875rem 1.25rem",
                            color: "#7a8fa6",
                            fontSize: "0.78rem",
                          }}
                        >
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "0.875rem 1.25rem",
                            color: "#f0f4ff",
                            fontWeight: 700,
                          }}
                        >
                          ₦{Number(p.amount).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "0.875rem 1.25rem",
                            color: "#f0f4ff",
                          }}
                        >
                          {p.bankName || "—"}
                        </td>
                        <td
                          style={{
                            padding: "0.875rem 1.25rem",
                            color: "#7a8fa6",
                          }}
                        >
                          {p.accountNumber || "—"} • {p.accountName || ""}
                        </td>
                        <td
                          style={{
                            padding: "0.875rem 1.25rem",
                            color: "#7a8fa6",
                            textTransform: "capitalize",
                          }}
                        >
                          {p.payoutMethod?.replace("_", " ") || "—"}
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <span
                            style={{
                              padding: "0.15rem 0.6rem",
                              borderRadius: "4px",
                              background: `${color}15`,
                              color,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          {p.status === "pending" && rejectId !== p.id && (
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                              <button
                                onClick={() => approve(p.id)}
                                disabled={processing === p.id}
                                style={{
                                  padding: "0.3rem 0.6rem",
                                  background: "rgba(34,197,94,0.1)",
                                  border: "1px solid #22c55e40",
                                  borderRadius: "6px",
                                  color: "#22c55e",
                                  cursor: "pointer",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  fontFamily: "inherit",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectId(p.id)}
                                style={{
                                  padding: "0.3rem 0.6rem",
                                  background: "rgba(239,68,68,0.1)",
                                  border: "1px solid #ef444440",
                                  borderRadius: "6px",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  fontFamily: "inherit",
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {p.status !== "pending" && (
                            <span
                              style={{ color: "#7a8fa6", fontSize: "0.75rem" }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                      {rejectId === p.id && (
                        <tr
                          style={{
                            borderBottom: "1px solid #111b2e",
                            background: "#111b2e",
                          }}
                        >
                          <td
                            colSpan={7}
                            style={{ padding: "0.75rem 1.25rem" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason for rejection…"
                                style={{
                                  flex: 1,
                                  padding: "0.5rem 0.75rem",
                                  background: "#0d1421",
                                  border: "1px solid #1e2f4a",
                                  borderRadius: "6px",
                                  color: "#f0f4ff",
                                  fontSize: "0.8rem",
                                  outline: "none",
                                }}
                              />
                              <button
                                onClick={() => reject(p.id)}
                                style={{
                                  padding: "0.5rem 0.875rem",
                                  background: "#ef4444",
                                  border: "none",
                                  borderRadius: "6px",
                                  color: "#fff",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  fontSize: "0.8rem",
                                  fontFamily: "inherit",
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setRejectId(null);
                                  setReason("");
                                }}
                                style={{
                                  padding: "0.5rem 0.75rem",
                                  background: "#111b2e",
                                  border: "1px solid #1e2f4a",
                                  borderRadius: "6px",
                                  color: "#7a8fa6",
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
