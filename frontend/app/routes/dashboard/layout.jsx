import React, { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  History,
  CreditCard,
  HeadphonesIcon,
  Settings,
  LogOut,
  TrendingUpIcon,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { auth, getUser } from "@/lib/api.js";

const NAV_ITEMS = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Challenges", to: "/dashboard/challenges", icon: TrendingUp },
  { label: "Payouts", to: "/dashboard/payouts", icon: CreditCard },
  { label: "Support", to: "/dashboard/support", icon: HeadphonesIcon },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getUser();
    if (!storedUser || !auth.isAuthenticated()) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, []);

  const handleLogout = async () => {
    await auth.logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--dark-bg)",
      }}
    >
      {/* Overlay */}
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
          width: "260px",
          background: "#0d1421",
          borderRight: "1px solid #1e2f4a",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem 1.5rem",
            borderBottom: "1px solid #1e2f4a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon size={17} color="#070b11" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#f0f4ff",
              }}
            >
              Noble<span style={{ color: "#c9a84c" }}>Funded</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#7a8fa6",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #1e2f4a",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#070b11",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "0.625rem",
            }}
          >
            {user?.fullName?.[0] || "T"}
          </div>
          <div
            style={{ color: "#f0f4ff", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {user?.fullName || "Trader"}
          </div>
          <div style={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
            {user?.email}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
                transition: "all 0.2s",
                background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
                color: isActive ? "#c9a84c" : "#7a8fa6",
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          style={{ padding: "1rem 0.75rem", borderTop: "1px solid #1e2f4a" }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            background: "#0d1421",
            borderBottom: "1px solid #1e2f4a",
            padding: "0 2rem",
            height: "65px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "8px",
                padding: "0.4rem 0.6rem",
                color: "#7a8fa6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Menu size={18} />
            </button>
            <span style={{ color: "#7a8fa6", fontSize: "0.85rem" }}>
              Trader Dashboard
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              style={{
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "8px",
                padding: "0.4rem 0.6rem",
                color: "#7a8fa6",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={18} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#111b2e",
                border: "1px solid #1e2f4a",
                borderRadius: "10px",
                padding: "0.4rem 0.875rem",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #c9a84c, #f0c96a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#070b11",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              >
                {user?.fullName?.[0] || "T"}
              </div>
              <span
                style={{
                  color: "#f0f4ff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {user?.fullName?.split(" ")[0]}
              </span>
              <ChevronDown size={14} color="#7a8fa6" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      {/* Desktop sidebar show (>= 1024px always visible) */}
      <style>{`
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; position: sticky !important; top: 0 !important; height: 100vh !important; }
        }
      `}</style>
    </div>
  );
}
