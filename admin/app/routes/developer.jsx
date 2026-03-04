import React, { useState } from "react";
import {
  Code2,
  Server,
  CheckCircle,
  AlertTriangle,
  Cpu,
  HardDrive,
  Activity,
  RefreshCw,
} from "lucide-react";

const mockLogs = [
  { level: "info", message: "POST /api/auth/login 200 42ms", time: "14:32:01" },
  {
    level: "info",
    message: "POST /api/payments/webhook 200 88ms",
    time: "14:31:55",
  },
  {
    level: "warn",
    message: "Slow query: challenges.findMany 520ms",
    time: "14:31:40",
  },
  {
    level: "info",
    message: "GET /api/admin/dashboard/stats 200 34ms",
    time: "14:31:22",
  },
  {
    level: "error",
    message: "Webhook: Invalid signature — request rejected",
    time: "14:30:11",
  },
];

const ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "PORT",
  "FRONTEND_URL",
  "ADMIN_URL",
  "FLUTTERWAVE_SECRET_KEY",
  "FLUTTERWAVE_WEBHOOK_HASH",
];

export default function Developer() {
  const [logs, setLogs] = useState(mockLogs);

  const refresh = () => {
    setLogs((prev) => [
      {
        level: "info",
        message: "Log refresh triggered",
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 9),
    ]);
  };

  const LOG_COLORS = { info: "#60a5fa", warn: "#f59e0b", error: "#ef4444" };

  return (
    <div>
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
          <Code2 size={22} color="#c9a84c" /> Developer Panel
        </h1>
        <p
          style={{
            color: "#7a8fa6",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          System health, logs, and configuration
        </p>
      </div>

      {/* System health */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "API Server",
            value: "Online",
            icon: Server,
            color: "#22c55e",
          },
          {
            label: "Database",
            value: "Connected",
            icon: HardDrive,
            color: "#22c55e",
          },
          {
            label: "Flutterwave",
            value: "Operational",
            icon: Activity,
            color: "#22c55e",
          },
          { label: "CPU Load", value: "12%", icon: Cpu, color: "#c9a84c" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: "#0d1421",
              borderRadius: "12px",
              border: `1px solid ${color}30`,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <Icon size={16} color={color} />
              <span
                style={{
                  color: "#7a8fa6",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            </div>
            <div style={{ color, fontWeight: 700, fontSize: "1rem" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Logs */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid #1e2f4a",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{ color: "#f0f4ff", fontWeight: 700, fontSize: "0.95rem" }}
            >
              Request Logs
            </h2>
            <button
              onClick={refresh}
              style={{
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "6px",
                padding: "0.35rem",
                color: "#7a8fa6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <div
            style={{
              background: "#070b11",
              borderRadius: "8px",
              padding: "1rem",
              maxHeight: "300px",
              overflowY: "auto",
              fontFamily: "monospace",
            }}
          >
            {logs.map((l, i) => (
              <div
                key={i}
                style={{ marginBottom: "0.35rem", fontSize: "0.78rem" }}
              >
                <span style={{ color: "#7a8fa6" }}>[{l.time}]</span>{" "}
                <span
                  style={{
                    color: LOG_COLORS[l.level] || "#f0f4ff",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {l.level}
                </span>{" "}
                <span style={{ color: "#a0b4c8" }}>{l.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Env vars */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "14px",
            border: "1px solid #1e2f4a",
            padding: "1.5rem",
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
            Environment Status
          </h2>
          {ENV_VARS.map((v) => (
            <div
              key={v}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid #111b2e",
                fontSize: "0.78rem",
              }}
            >
              <span style={{ color: "#7a8fa6", fontFamily: "monospace" }}>
                {v}
              </span>
              <CheckCircle size={14} color="#22c55e" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
