import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post("auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Welcome back!");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--dark-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <ToastContainer position="top-right" theme="dark" />

      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={22} color="#070b11" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#f0f4ff",
            }}
          >
            Noble<span style={{ color: "#c9a84c" }}>Funded</span>
          </span>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "var(--dark-card)",
            borderRadius: "20px",
            border: "1px solid var(--dark-border)",
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#f0f4ff",
              marginBottom: "0.5rem",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              marginBottom: "2rem",
              fontSize: "0.9rem",
            }}
          >
            Sign in to your trading account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
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
                  placeholder="trader@example.com"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "#111b2e",
                    border: "1px solid #1e2f4a",
                    borderRadius: "10px",
                    color: "#f0f4ff",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "0.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#a0b4c8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7a8fa6",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
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
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "1.75rem" }}>
              <Link
                to="/forgot-password"
                style={{
                  color: "#c9a84c",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
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
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "opacity 0.2s",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#7a8fa6",
              fontSize: "0.875rem",
              marginTop: "1.75rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#c9a84c",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
