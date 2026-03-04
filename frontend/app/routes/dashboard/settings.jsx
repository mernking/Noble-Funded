import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api
      .get("users/me")
      .then((res) => {
        const u = res.data;
        setProfile({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
        });
      })
      .catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("users/me", {
        fullName: profile.fullName,
        phone: profile.phone,
      });
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, fullName: profile.fullName }),
      );
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("users/me/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    background: "#111b2e",
    border: "1px solid #1e2f4a",
    borderRadius: "8px",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    color: "#a0b4c8",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <h1
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#f0f4ff",
          marginBottom: "0.25rem",
        }}
      >
        Settings
      </h1>
      <p
        style={{ color: "#7a8fa6", fontSize: "0.85rem", marginBottom: "2rem" }}
      >
        Manage your account details
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Profile */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "1.75rem",
          }}
        >
          <h2
            style={{
              color: "#f0f4ff",
              fontWeight: 700,
              marginBottom: "1.5rem",
              fontSize: "1rem",
            }}
          >
            Profile Information
          </h2>
          <form onSubmit={saveProfile}>
            {[
              { label: "Full Name", key: "fullName", type: "text", icon: User },
              {
                label: "Email Address",
                key: "email",
                type: "email",
                icon: Mail,
                disabled: true,
              },
              { label: "Phone Number", key: "phone", type: "tel", icon: Phone },
            ].map(({ label, key, type, icon: Icon, disabled }) => (
              <div key={key} style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon
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
                    type={type}
                    value={profile[key]}
                    onChange={(e) =>
                      !disabled &&
                      setProfile({ ...profile, [key]: e.target.value })
                    }
                    disabled={disabled}
                    style={{
                      ...inputStyle,
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "text",
                    }}
                    onFocus={(e) =>
                      !disabled && (e.target.style.borderColor = "#c9a84c")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={savingProfile}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                color: "#070b11",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.875rem",
              }}
            >
              <Save size={15} /> {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "1.75rem",
          }}
        >
          <h2
            style={{
              color: "#f0f4ff",
              fontWeight: 700,
              marginBottom: "1.5rem",
              fontSize: "1rem",
            }}
          >
            Change Password
          </h2>
          <form onSubmit={savePassword}>
            {[
              { label: "Current Password", key: "currentPassword" },
              { label: "New Password", key: "newPassword" },
              { label: "Confirm New Password", key: "confirmPassword" },
            ].map(({ label, key }) => (
              <div key={key} style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>{label}</label>
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
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [key]: e.target.value })
                    }
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: "3rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e2f4a")}
                  />
                  {key === "currentPassword" && (
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
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={savingPassword}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                color: "#f0f4ff",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.875rem",
              }}
            >
              <Lock size={15} />{" "}
              {savingPassword ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
