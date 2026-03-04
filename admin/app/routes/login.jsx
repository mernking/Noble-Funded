import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Lock, Mail, TrendingUp, Eye, EyeOff, Shield } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const ALLOWED_ROLES = [
    "super_admin",
    "compliance",
    "support",
    "marketing",
    "developer",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post("auth/login", form);
      const user = data.data.user;
      if (!ALLOWED_ROLES.includes(user.role)) {
        toast.error(
          "Access denied. This portal is for admin team members only.",
        );
        return;
      }
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      toast.success("Welcome to Noble Funded Admin.");

      // Route based on role
      const roleRoutes = {
        super_admin: "/",
        compliance: "/compliance",
        support: "/support",
        marketing: "/marketing",
        developer: "/dev",
      };
      setTimeout(() => navigate(roleRoutes[user.role] || "/"), 700);
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <ToastContainer position="top-right" theme="dark" />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
      </div>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <TrendingUp size={28} color="#070b11" strokeWidth={2.5} />
          </div>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#f0f4ff",
            }}
          >
            Noble<span style={{ color: "#c9a84c" }}>Funded</span> Admin
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.2)",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              color: "#c9a84c",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginTop: "0.5rem",
            }}
          >
            <Shield size={12} /> Secure Admin Portal
          </div>
        </div>

        <div
          style={{
            background: "#0d1421",
            borderRadius: "20px",
            border: "1px solid #1e2f4a",
            padding: "2.5rem",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7a8fa6",
                  }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@noblefunded.com"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    borderRadius: "10px",
                    color: "#f0f4ff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
              </div>
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7a8fa6",
                  }}
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    borderRadius: "10px",
                    color: "#f0f4ff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#7a8fa6",
                    cursor: "pointer",
                  }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                background: loading
                  ? "#6b5a30"
                  : "linear-gradient(135deg, #c9a84c, #f0c96a)",
                color: "#070b11",
                border: "none",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Signing in…" : "Access Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
