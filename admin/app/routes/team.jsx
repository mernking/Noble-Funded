import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

const ROLES = [
  "super_admin",
  "compliance",
  "support",
  "marketing",
  "developer",
];

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: "", role: "support" });
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("admin/team")
      .then((r) => setMembers(r.data || []))
      .catch(() => toast.error("Failed to load team."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const addMember = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.role) {
      toast.error("User ID and role are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("admin/team/add", form);
      toast.success(res.data?.message || "Team member added.");
      setShowForm(false);
      setForm({ userId: "", role: "support" });
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
            }}
          >
            Add Team Member
          </h2>
          <form
            onSubmit={addMember}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "0.75rem",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                User ID
              </label>
              <input
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                placeholder="UUID of existing user"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.75rem",
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
                  <option key={r} value={r}>
                    {r
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  color: "#070b11",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? "…" : "Add"}
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
                {["User ID", "Role", "Added By", "Date Added", "Actions"].map(
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
                    colSpan={5}
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
                    colSpan={5}
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
                members.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #111b2e" }}>
                    <td
                      style={{
                        padding: "0.875rem 1.25rem",
                        color: "#7a8fa6",
                        fontSize: "0.78rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {m.userId}
                    </td>
                    <td style={{ padding: "0.875rem 1.25rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.625rem",
                          borderRadius: "4px",
                          background: "rgba(201,168,76,0.1)",
                          color: "#c9a84c",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {m.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.875rem 1.25rem",
                        color: "#7a8fa6",
                        fontSize: "0.78rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {m.addedBy || "—"}
                    </td>
                    <td
                      style={{
                        padding: "0.875rem 1.25rem",
                        color: "#7a8fa6",
                        fontSize: "0.78rem",
                      }}
                    >
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.875rem 1.25rem" }}>
                      <button
                        onClick={() => removeMember(m.id)}
                        disabled={removing === m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.35rem 0.75rem",
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid #ef444440",
                          borderRadius: "6px",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
