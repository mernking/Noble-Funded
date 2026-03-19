import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight } from "lucide-react";
import { auth } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for OAuth callback or error
  useEffect(() => {
    const error = searchParams.get("error");
    const expired = searchParams.get("session");
    
    if (expired === "expired") {
      toast.warning("Your session has expired. Please log in again.");
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }
    
    // Handle OAuth callback
    const callbackData = auth.handleCallback();
    if (callbackData) {
      toast.success("Successfully signed in with Google!");
      navigate("/dashboard");
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await auth.login({ email: form.email, password: form.password });
      toast.success("Welcome back!");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    auth.loginWithGoogle();
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

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.2s",
              fontFamily: "inherit",
              marginBottom: "1.5rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#1e2f4a" }} />
            <span style={{ color: "#7a8fa6", fontSize: "0.8rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#1e2f4a" }} />
          </div>

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
