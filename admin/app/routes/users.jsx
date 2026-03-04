import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Users,
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const load = (q = "", s = "") => {
    setLoading(true);
    api
      .get(`admin/users?search=${q}&status=${s}&limit=50`)
      .then((r) => setUsers(r.data?.users || []))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleBan = async (id, action) => {
    setProcessing(id);
    try {
      const res = await api.put(`users/${id}/ban`, { action });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: action === "ban" ? "banned" : "active" }
            : u,
        ),
      );
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const STATUS = {
    active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    banned: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
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
            <Users size={22} color="#c9a84c" /> Users
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {users.length} registered traders
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7a8fa6",
              }}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                load(e.target.value, filter);
              }}
              placeholder="Search by name or email…"
              style={{
                padding: "0.5rem 0.875rem 0.5rem 2.25rem",
                background: "#0d1421",
                border: "1px solid #1e2f4a",
                borderRadius: "8px",
                color: "#f0f4ff",
                fontSize: "0.8rem",
                outline: "none",
                width: "220px",
              }}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              load(search, e.target.value);
            }}
            style={{
              padding: "0.5rem 0.875rem",
              background: "#0d1421",
              border: "1px solid #1e2f4a",
              borderRadius: "8px",
              color: "#f0f4ff",
              fontSize: "0.8rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
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
                  "Name",
                  "Email",
                  "Phone",
                  "KYC",
                  "Status",
                  "Joined",
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
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#7a8fa6",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const s = STATUS[u.status] || STATUS.active;
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: "1px solid #111b2e" }}
                    >
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#f0f4ff",
                          fontWeight: 600,
                        }}
                      >
                        {u.fullName}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                        }}
                      >
                        {u.email}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                        }}
                      >
                        {u.phone || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.6rem",
                            borderRadius: "4px",
                            background:
                              u.kycStatus === "verified"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(245,158,11,0.1)",
                            color:
                              u.kycStatus === "verified"
                                ? "#22c55e"
                                : "#f59e0b",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {u.kycStatus}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.6rem",
                            borderRadius: "4px",
                            background: s.bg,
                            color: s.color,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1.25rem",
                          color: "#7a8fa6",
                          fontSize: "0.78rem",
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <button
                          onClick={() =>
                            handleBan(
                              u.id,
                              u.status === "banned" ? "unban" : "ban",
                            )
                          }
                          disabled={processing === u.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.35rem 0.75rem",
                            background:
                              u.status === "banned"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(239,68,68,0.1)",
                            border: `1px solid ${u.status === "banned" ? "#22c55e40" : "#ef444440"}`,
                            borderRadius: "6px",
                            color:
                              u.status === "banned" ? "#22c55e" : "#ef4444",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            fontFamily: "inherit",
                          }}
                        >
                          {u.status === "banned" ? (
                            <>
                              <CheckCircle size={12} /> Unban
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Ban
                            </>
                          )}
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
