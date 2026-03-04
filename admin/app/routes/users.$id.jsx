import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/lib/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`users/${id}`)
      .then((r) => setUser(r.data))
      .catch(() => toast.error("Failed to load user."))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleBan = async () => {
    try {
      const action = user.status === "banned" ? "unban" : "ban";
      const res = await api.put(`users/${id}/ban`, { action });
      setUser((prev) => ({
        ...prev,
        status: action === "ban" ? "banned" : "active",
      }));
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div style={{ color: "#7a8fa6", textAlign: "center", padding: "4rem" }}>
        Loading…
      </div>
    );
  if (!user)
    return (
      <div style={{ color: "#7a8fa6", textAlign: "center", padding: "4rem" }}>
        User not found.
      </div>
    );

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          to="/users"
          style={{
            color: "#7a8fa6",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: "0.3rem" }} /> Back
        </Link>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#f0f4ff",
          }}
        >
          {user.fullName}
        </h1>
        <span
          style={{
            padding: "0.2rem 0.75rem",
            borderRadius: "999px",
            background:
              user.status === "banned"
                ? "rgba(239,68,68,0.1)"
                : "rgba(34,197,94,0.1)",
            color: user.status === "banned" ? "#ef4444" : "#22c55e",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          {user.status}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#0d1421",
            borderRadius: "16px",
            border: "1px solid #1e2f4a",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "#f0f4ff",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            Profile
          </h2>
          {[
            { icon: User, label: "Full Name", value: user.fullName },
            { icon: Mail, label: "Email", value: user.email },
            { icon: Phone, label: "Phone", value: user.phone || "—" },
            { icon: Shield, label: "KYC Status", value: user.kycStatus },
            {
              label: "Registered",
              value: new Date(user.createdAt).toLocaleDateString(),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0",
                borderBottom: "1px solid #1e2f4a",
                fontSize: "0.875rem",
              }}
            >
              {Icon && <Icon size={15} color="#7a8fa6" />}
              <span style={{ color: "#7a8fa6", flex: "0 0 120px" }}>
                {label}
              </span>
              <span
                style={{
                  color: "#f0f4ff",
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {value}
              </span>
            </div>
          ))}

          <button
            onClick={toggleBan}
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.25rem",
              background:
                user.status === "banned"
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(239,68,68,0.1)",
              border: `1px solid ${user.status === "banned" ? "#22c55e40" : "#ef444440"}`,
              borderRadius: "8px",
              color: user.status === "banned" ? "#22c55e" : "#ef4444",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.875rem",
              fontFamily: "inherit",
            }}
          >
            {user.status === "banned" ? (
              <>
                <CheckCircle size={16} /> Unban User
              </>
            ) : (
              <>
                <Ban size={16} /> Ban User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
