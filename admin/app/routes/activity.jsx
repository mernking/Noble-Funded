import React, { useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { api } from "@/lib/api.js";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("admin/activity-log?limit=50")
      .then((r) => setLogs(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
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
            <Activity size={22} color="#c9a84c" /> Activity Log
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            Last 50 platform events
          </p>
        </div>
        <button
          onClick={load}
          style={{
            background: "#111b2e",
            border: "1px solid #1e2f4a",
            borderRadius: "8px",
            padding: "0.5rem 0.875rem",
            color: "#7a8fa6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.8rem",
            fontFamily: "inherit",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#7a8fa6" }}
          >
            Loading activity…
          </div>
        ) : logs.length === 0 ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#7a8fa6" }}
          >
            No activity recorded yet.
          </div>
        ) : (
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
                  {["Time", "User", "Action", "Resource", "Details"].map(
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
                {logs.map((l) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid #111b2e" }}>
                    <td
                      style={{
                        padding: "0.75rem 1.25rem",
                        color: "#7a8fa6",
                        fontSize: "0.78rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td
                      style={{ padding: "0.75rem 1.25rem", color: "#f0f4ff" }}
                    >
                      {l.userId || "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <span
                        style={{
                          padding: "0.15rem 0.6rem",
                          borderRadius: "4px",
                          background: "rgba(201,168,76,0.1)",
                          color: "#c9a84c",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1.25rem",
                        color: "#7a8fa6",
                        textTransform: "capitalize",
                      }}
                    >
                      {l.resourceType || "—"}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1.25rem",
                        color: "#7a8fa6",
                        fontSize: "0.78rem",
                      }}
                    >
                      {l.details
                        ? JSON.stringify(l.details).slice(0, 60) + "…"
                        : "—"}
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
