import React from "react";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#f0f4ff",
          marginBottom: "0.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Settings size={22} color="#c9a84c" /> Admin Settings
      </h1>
      <p
        style={{ color: "#7a8fa6", fontSize: "0.85rem", marginBottom: "2rem" }}
      >
        System configuration and preferences
      </p>
      <div
        style={{
          background: "#0d1421",
          borderRadius: "16px",
          border: "1px solid #1e2f4a",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Settings size={48} color="#1e2f4a" style={{ marginBottom: "1rem" }} />
        <p style={{ color: "#7a8fa6" }}>
          Settings panel coming soon. Database system settings will appear here.
        </p>
      </div>
    </div>
  );
}
