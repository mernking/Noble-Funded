import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  CreditCard,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

const STATUS = {
  pending: { color: "#f59e0b", icon: Clock },
  approved: { color: "#60a5fa", icon: CheckCircle },
  paid: { color: "#22c55e", icon: CheckCircle },
  rejected: { color: "#ef4444", icon: XCircle },
};

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    challengeId: "",
    amount: "",
    payoutMethod: "bank_transfer",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("payouts").then((r) => setPayouts(r.data || [])),
      api
        .get("challenges")
        .then((r) =>
          setChallenges((r.data || []).filter((c) => c.status === "passed")),
        ),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.challengeId ||
      !form.amount ||
      !form.bankName ||
      !form.accountNumber ||
      !form.accountName
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("payouts/request", {
        ...form,
        amount: Number(form.amount),
        currency: "NGN",
      });
      setPayouts((prev) => [res.data, ...prev]);
      toast.success(res.data.message || "Payout request submitted!");
      setShowForm(false);
      setForm({
        challengeId: "",
        amount: "",
        payoutMethod: "bank_transfer",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
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
  };
  const labelStyle = {
    display: "block",
    color: "#a0b4c8",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
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
            }}
          >
            Payouts
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            Request and track your earnings
          </p>
        </div>
        {challenges.length > 0 && (
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
            <CreditCard size={16} /> Request Payout
          </button>
        )}
      </div>

      {/* Request form */}
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
            New Payout Request
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <div>
              <label style={labelStyle}>Challenge *</label>
              <select
                value={form.challengeId}
                onChange={(e) =>
                  setForm({ ...form, challengeId: e.target.value })
                }
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Select passed challenge</option>
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.accountType === "naira" ? "₦" : "$"}
                    {Number(c.startingBalance).toLocaleString()} — Passed
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount (₦) *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Bank Name *</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="e.g. Access Bank"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Account Number *</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
                placeholder="0123456789"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Account Name *</label>
              <input
                type="text"
                value={form.accountName}
                onChange={(e) =>
                  setForm({ ...form, accountName: e.target.value })
                }
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-end",
              }}
            >
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                }}
              >
                {submitting ? "Submitting…" : "Submit Request"}
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

      {/* Payouts list */}
      {loading ? (
        <div style={{ color: "#7a8fa6", textAlign: "center", padding: "3rem" }}>
          Loading payouts…
        </div>
      ) : payouts.length === 0 ? (
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <DollarSign
            size={48}
            color="#1e2f4a"
            style={{ marginBottom: "1rem" }}
          />
          <p style={{ color: "#7a8fa6", marginBottom: "0.5rem" }}>
            No payout requests yet.
          </p>
          <p style={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
            {challenges.length === 0
              ? "Pass a challenge to request your first payout."
              : "Use the button above to request a payout."}
          </p>
        </div>
      ) : (
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
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2f4a" }}>
                  {["Date", "Amount", "Method", "Bank", "Status", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "1rem 1.25rem",
                          textAlign: "left",
                          color: "#7a8fa6",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
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
                {payouts.map((p) => {
                  const s = STATUS[p.status] || STATUS.pending;
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: "1px solid #111b2e" }}
                    >
                      <td style={{ padding: "1rem 1.25rem", color: "#7a8fa6" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          color: "#f0f4ff",
                          fontWeight: 700,
                        }}
                      >
                        ₦{Number(p.amount).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          color: "#f0f4ff",
                          textTransform: "capitalize",
                        }}
                      >
                        {p.payoutMethod?.replace("_", " ")}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", color: "#f0f4ff" }}>
                        {p.bankName || "—"}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "999px",
                            background: `${s.color}15`,
                            color: s.color,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          <s.icon size={12} /> {p.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          color: "#7a8fa6",
                          fontSize: "0.8rem",
                        }}
                      >
                        {p.rejectedReason || p.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
