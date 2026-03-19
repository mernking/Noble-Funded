import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Shield, UserPlus, Trash2, Mail, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

const ROLES = [
  { value: "compliance", label: "Compliance Officer" },
  { value: "support", label: "Support Agent" },
  { value: "marketing", label: "Marketing Team" },
  { value: "developer", label: "Developer" },
];

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", role: "support", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("admin/team")
      .then((r) => setMembers(r.data || []))
      .catch(() => toast.error("Failed to load team members."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const addMember = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("admin/team/add", form);
      toast.success(res.data?.message || "Team member added successfully.");
      setShowForm(false);
      setForm({ fullName: "", email: "", role: "support", password: "" });
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const removeMember = async (id) => {
    setRemoving(id);
    try {
      await api.delete(`admin/team/${id}`);
      toast.success("Team member removed.");
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemoving(null);
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
    fontFamily: "inherit",
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
      compliance: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
      support: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
      marketing: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },
      developer: { bg: "rgba(249,115,22,0.15)", color: "#f97316" },
    };
    return colors[role] || { bg: "rgba(201,168,76,0.1)", color: "#c9a84c" };
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
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Shield size={22} color="#c9a84c" /> Team Management
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {members.length} admin team members
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
            color: "#070b11",
            padding: "0.5rem 1.25rem",
            borderRadius: "10px",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.875rem",
            fontFamily: "inherit",
          }}
        >
          <UserPlus size={15} /> Add Member
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid #c9a84c30",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "#f0f4ff",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Mail size={16} color="#c9a84c" /> Add New Team Member
          </h2>
          <p style={{ color: "#7a8fa6", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
            A welcome email with login credentials will be sent to the new member.
          </p>
          <form
            onSubmit={addMember}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Full Name
              </label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#7a8fa6",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: submitting ? "#6b5a30" : "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Mail size={14} />
                {submitting ? "Sending..." : "Create & Send Invite"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "0.75rem 1.25rem",
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
                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.875rem 1.25rem",
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    No team members added yet.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const badgeColors = getRoleBadgeColor(m.role);
                  return (
                    <tr key={m.id} style={{ borderBottom: "1px solid #111b2e" }}>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#f0f4ff",
                          fontWeight: 600,
                        }}
                      >
                        {m.fullName}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                        }}
                      >
                        {m.email}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.625rem",
                            borderRadius: "4px",
                            background: badgeColors.bg,
                            color: badgeColors.color,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {m.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.625rem",
                            borderRadius: "4px",
                            background: m.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                            color: m.status === "active" ? "#22c55e" : "#ef4444",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                          fontSize: "0.78rem",
                        }}
                      >
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <button
                          onClick={() => removeMember(m.id)}
                          disabled={removing === m.id || m.role === "super_admin"}
                          title={m.role === "super_admin" ? "Cannot remove super admin" : "Remove team member"}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.35rem 0.75rem",
                            background: m.role === "super_admin" ? "#1e2f4a" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${m.role === "super_admin" ? "#1e2f4a" : "#ef444440"}`,
                            borderRadius: "6px",
                            color: m.role === "super_admin" ? "#7a8fa6" : "#ef4444",
                            cursor: m.role === "super_admin" ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            fontFamily: "inherit",
                          }}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </td>
                    </tr>
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
