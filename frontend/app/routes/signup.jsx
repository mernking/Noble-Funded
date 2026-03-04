import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post("auth/register", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Account created! Welcome to Noble Funded.");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 2.75rem",
    background: "#111b2e",
    border: "1px solid #1e2f4a",
    borderRadius: "10px",
    color: "#f0f4ff",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    color: "#a0b4c8",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
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
        paddingTop: "3rem",
        paddingBottom: "3rem",
      }}
    >
      <ToastContainer position="top-right" theme="dark" />
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
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: "460px" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "2rem",
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

        {/* Benefits */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Up to ₦1M funding", "80% profit split", "60-day challenges"].map(
            (b) => (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#c9a84c",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={14} /> {b}
              </div>
            ),
          )}
        </div>

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
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#f0f4ff",
              marginBottom: "0.5rem",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              color: "#7a8fa6",
              marginBottom: "2rem",
              fontSize: "0.875rem",
            }}
          >
            Join thousands of funded traders in Nigeria
          </p>

          <form onSubmit={handleSubmit}>
            {[
              {
                label: "Full Name",
                key: "fullName",
                type: "text",
                placeholder: "John Doe",
                Icon: User,
              },
              {
                label: "Email Address",
                key: "email",
                type: "email",
                placeholder: "trader@example.com",
                Icon: Mail,
              },
              {
                label: "Phone Number",
                key: "phone",
                type: "tel",
                placeholder: "+234 800 000 0000",
                Icon: Phone,
              },
            ].map(({ label, key, type, placeholder, Icon }) => (
              <div key={key} style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon
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
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Password</label>
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
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle, paddingRight: "3rem" }}
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

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>Confirm Password</label>
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
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                />
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
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                "Creating account…"
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#7a8fa6",
              fontSize: "0.8rem",
              marginTop: "1.5rem",
            }}
          >
            By signing up you agree to our{" "}
            <Link to="#" style={{ color: "#c9a84c" }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link to="#" style={{ color: "#c9a84c" }}>
              Privacy Policy
            </Link>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "#7a8fa6",
              fontSize: "0.875rem",
              marginTop: "1rem",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#c9a84c",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
