import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CreditCard,
  BarChart3,
  Settings,
  Activity,
  LogOut,
  Shield,
  Headphones,
  Megaphone,
  Code2,
  TrendingUpIcon,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const SIDEBAR_BY_ROLE = {
  super_admin: [
    { label: "Overview", to: "/", icon: LayoutDashboard },
    { label: "Users", to: "/users", icon: Users },
    { label: "Challenges", to: "/challenges", icon: TrendingUp },
    { label: "Payouts", to: "/payouts", icon: CreditCard },
    { label: "Revenue", to: "/revenue", icon: BarChart3 },
    { label: "Team", to: "/team", icon: Shield },
    { label: "Activity Log", to: "/activity", icon: Activity },
    { label: "Settings", to: "/settings", icon: Settings },
  ],
  compliance: [
    { label: "Overview", to: "/", icon: LayoutDashboard },
    { label: "Compliance", to: "/compliance", icon: Shield },
    { label: "Payouts", to: "/payouts", icon: CreditCard },
  ],
  support: [
    { label: "Support", to: "/support", icon: Headphones },
    { label: "Users", to: "/users", icon: Users },
  ],
  marketing: [{ label: "Marketing", to: "/marketing", icon: Megaphone }],
  developer: [{ label: "Dev Dashboard", to: "/dev", icon: Code2 }],
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("adminUser");
    if (!raw) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  const navItems = SIDEBAR_BY_ROLE[user?.role] || SIDEBAR_BY_ROLE.super_admin;
  const roleLabel = {
    super_admin: "Super Admin",
    compliance: "Compliance",
    support: "Support",
    marketing: "Marketing",
    developer: "Developer",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070b11" }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#0d1421",
          borderRight: "1px solid #1e2f4a",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.25rem 1.25rem",
            borderBottom: "1px solid #1e2f4a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon size={16} color="#070b11" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#f0f4ff",
              }}
            >
              Noble<span style={{ color: "#c9a84c" }}>Funded</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#7a8fa6",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Role badge */}
        <div
          style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1e2f4a" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#070b11",
                fontWeight: 800,
                fontSize: "0.9rem",
                flexShrink: 0,
              }}
            >
              {user?.fullName?.[0] || "A"}
            </div>
            <div>
              <div
                style={{
                  color: "#f0f4ff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {user?.fullName || "Admin"}
              </div>
              <div
                style={{
                  color: "#c9a84c",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {roleLabel[user?.role] || "Admin"}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginBottom: "0.2rem",
                background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
                color: isActive ? "#c9a84c" : "#7a8fa6",
              })}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "0.75rem", borderTop: "1px solid #1e2f4a" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.875rem",
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRadius: "8px",
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: "#0d1421",
            borderBottom: "1px solid #1e2f4a",
            height: "60px",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "#111b2e",
              border: "1px solid #1e2f4a",
              borderRadius: "7px",
              padding: "0.375rem 0.5rem",
              color: "#7a8fa6",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <Menu size={17} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#111b2e",
              border: "1px solid #1e2f4a",
              borderRadius: "8px",
              padding: "0.375rem 0.875rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#070b11",
                fontWeight: 800,
                fontSize: "0.7rem",
              }}
            >
              {user?.fullName?.[0] || "A"}
            </div>
            <span
              style={{ color: "#f0f4ff", fontSize: "0.8rem", fontWeight: 600 }}
            >
              {user?.fullName?.split(" ")[0]}
            </span>
            <ChevronDown size={13} color="#7a8fa6" />
          </div>
        </header>
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar { transform: translateX(0) !important; position: sticky !important; top: 0 !important; height: 100vh !important; }
        }
      `}</style>
    </div>
  );
}
