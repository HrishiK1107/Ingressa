import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const baseStyle = {
    padding: "10px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.15s ease",
  };

  const iconStyle = {
    fontSize: "14px",
    opacity: 0.8,
  };

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 18px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          Ingressa
        </div>

        <div
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          Backend: Connected
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            ...baseStyle,
            backgroundColor: isActive ? "#f3f4f6" : "transparent",
            color: isActive ? "#111827" : "#374151",
            borderLeft: isActive ? "3px solid #111827" : "3px solid transparent",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={iconStyle}>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/findings"
          style={({ isActive }) => ({
            ...baseStyle,
            backgroundColor: isActive ? "#f3f4f6" : "transparent",
            color: isActive ? "#111827" : "#374151",
            borderLeft: isActive ? "3px solid #111827" : "3px solid transparent",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={iconStyle}>🛡</span>
          Findings
        </NavLink>

        <NavLink
          to="/assets"
          style={({ isActive }) => ({
            ...baseStyle,
            backgroundColor: isActive ? "#f3f4f6" : "transparent",
            color: isActive ? "#111827" : "#374151",
            borderLeft: isActive ? "3px solid #111827" : "3px solid transparent",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={iconStyle}>📦</span>
          Assets
        </NavLink>

        <NavLink
          to="/scans"
          style={({ isActive }) => ({
            ...baseStyle,
            backgroundColor: isActive ? "#f3f4f6" : "transparent",
            color: isActive ? "#111827" : "#374151",
            borderLeft: isActive ? "3px solid #111827" : "3px solid transparent",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={iconStyle}>🔍</span>
          Scans
        </NavLink>
      </div>
    </div>
  );
}
