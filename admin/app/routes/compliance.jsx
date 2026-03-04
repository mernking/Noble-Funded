import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Shield,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Compliance() {
  const [payouts, setPayouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get("admin/challenges"),
        api.get("admin/dashboard/stats"),
      ]);
      // Fetch pending payouts separately
      const pOutRes = await api.get("payouts"); // fallback — would be scoped per admin role
      setPayouts(pOutRes.data?.filter((p) => p.status === "pending") || []);
      setChallenges(pRes.data?.challenges || []);
    } catch (err) {
      toast.error("Failed to load compliance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approvePayout = async (id) => {
    setProcessing(true);
    try {
      await api.put(`payouts/${id}/approve`, {
        notes: "Approved by compliance officer.",
      });
      toast.success("Payout approved successfully.");
      setPayouts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const rejectPayout = async (id) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setProcessing(true);
    try {
      await api.put(`payouts/${id}/reject`, { reason });
      toast.success("Payout rejected.");
      setPayouts((prev) => prev.filter((p) => p.id !== id));
      setRejectId(null);
      setReason("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <div style={{ marginBottom: "2rem" }}>
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
          <Shield size={24} color="#c9a84c" /> Compliance Dashboard
        </h1>
        <p
          style={{
            color: "#7a8fa6",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          Review payout requests and monitor active challenges
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Pending Payouts", value: payouts.length, color: "#f59e0b" },
          {
            label: "Active Challenges",
            value: challenges.filter((c) => c.status === "active").length,
            color: "#22c55e",
          },
          {
            label: "Passed Challenges",
            value: challenges.filter((c) => c.status === "passed").length,
            color: "#60a5fa",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "#0d1421",
              border: `1px solid ${color}30`,
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                fontFamily: "Montserrat, sans-serif",
                color,
              }}
            >
              {value}
            </div>
            <div
              style={{
                color: "#7a8fa6",
                fontSize: "0.8rem",
                marginTop: "0.25rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Payout Queue */}
      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            color: "#f0f4ff",
            fontWeight: 700,
            marginBottom: "1.25rem",
            fontSize: "1rem",
          }}
        >
          Payout Approval Queue
        </h2>
        {loading ? (
          <p style={{ color: "#7a8fa6", fontSize: "0.875rem" }}>Loading…</p>
        ) : payouts.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#7a8fa6" }}
          >
            <CheckCircle
              size={36}
              color="#22c55e"
              style={{ marginBottom: "0.75rem" }}
            />
            <p>No pending payout requests. All clear!</p>
          </div>
        ) : (
          payouts.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#111b2e",
                borderRadius: "10px",
                padding: "1.25rem",
                marginBottom: "0.75rem",
                border: "1px solid #1e2f4a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ color: "#f0f4ff", fontWeight: 700 }}>
                    ₦{Number(p.amount).toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: "#7a8fa6",
                      fontSize: "0.8rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    {p.bankName} • {p.accountNumber} • {p.accountName}
                  </div>
                  <div
                    style={{
                      color: "#7a8fa6",
                      fontSize: "0.75rem",
                      marginTop: "0.15rem",
                    }}
                  >
                    Requested: {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {rejectId !== p.id ? (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => approvePayout(p.id)}
                      disabled={processing}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.5rem 1rem",
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid #22c55e40",
                        borderRadius: "8px",
                        color: "#22c55e",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => setRejectId(p.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.5rem 1rem",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid #ef444440",
                        borderRadius: "8px",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for rejection…"
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "#0d1421",
                        border: "1px solid #1e2f4a",
                        borderRadius: "7px",
                        color: "#f0f4ff",
                        fontSize: "0.8rem",
                        outline: "none",
                        minWidth: "200px",
                      }}
                    />
                    <button
                      onClick={() => rejectPayout(p.id)}
                      disabled={processing}
                      style={{
                        padding: "0.5rem 0.875rem",
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "7px",
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
                        borderRadius: "7px",
                        color: "#7a8fa6",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "0.8rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Active challenges monitor */}
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
            color: "#f0f4ff",
            fontWeight: 700,
            marginBottom: "1.25rem",
            fontSize: "1rem",
          }}
        >
          Active Challenge Monitor
        </h2>
        {challenges.filter((c) => c.status === "active").length === 0 ? (
          <p style={{ color: "#7a8fa6", fontSize: "0.875rem" }}>
            No active challenges to monitor.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2f4a" }}>
                  {["Type", "Balance", "Target", "MT5 Login", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          color: "#7a8fa6",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          fontSize: "0.72rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {challenges
                  .filter((c) => c.status === "active")
                  .slice(0, 10)
                  .map((c) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #111b2e" }}
                    >
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "#f0f4ff",
                          textTransform: "capitalize",
                        }}
                      >
                        {c.accountType}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#f0f4ff" }}>
                        {c.accountType === "naira" ? "₦" : "$"}
                        {Number(c.currentBalance).toLocaleString()}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#c9a84c" }}>
                        {c.accountType === "naira" ? "₦" : "$"}
                        {Number(c.profitTarget).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "#7a8fa6",
                          fontFamily: "monospace",
                        }}
                      >
                        {c.mt5Login || "—"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            background: "rgba(34,197,94,0.1)",
                            color: "#22c55e",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
