import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { endpoints } from "../../api/endpoints";

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

interface Finding {
  status: string;
}

interface Scan {
  status: string;
}

function useSidebarMetrics() {
  const { data: findings } = useQuery({
    queryKey: ["findings"],
    queryFn: async (): Promise<Finding[]> => {
      const res = await api.get(endpoints.findings);
      return res.data;
    },
  });

  const { data: scans } = useQuery({
    queryKey: ["scans"],
    queryFn: async (): Promise<Scan[]> => {
      const res = await api.get(endpoints.scans);
      return res.data.scans || [];
    },
  });

  const openFindings =
    findings?.filter((f) => f.status === "OPEN").length || 0;

  const runningScan =
    scans?.some((s) => s.status === "RUNNING") || false;

  return { openFindings, runningScan };
}

function useBackendHealth() {
  return useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      await api.get("/health"); // change if your health endpoint differs
      return true;
    },
    retry: false,
    staleTime: 10000,
  });
}

export default function Sidebar({ collapsed, setCollapsed }: Props) {
  const { openFindings, runningScan } = useSidebarMetrics();
  const { isError } = useBackendHealth();

  const backendConnected = !isError;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: GridIcon },
    {
      label: "Findings",
      path: "/findings",
      icon: ShieldIcon,
      badge: openFindings > 0 ? openFindings : undefined,
    },
    { label: "Assets", path: "/assets", icon: CubeIcon },
    {
      label: "Scans",
      path: "/scans",
      icon: SearchIcon,
      dot: runningScan,
    },
  ];

  return (
    <div
      style={{
        width: collapsed ? 56 : 240,
        transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
        borderRight: "1px solid #e5e7eb",
        padding: "18px 12px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 28,
        }}
      >
        {/* Collapse Button */}
        <div
          style={{
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            marginBottom: collapsed ? 0 : 18,
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <ChevronIcon collapsed={collapsed} />
          </button>
        </div>

        {/* Project Name + Backend Status */}
        {!collapsed && (
          <>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "1px",
              }}
            >
              INGRESSA
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: backendConnected ? "#16a34a" : "#dc2626",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: backendConnected
                    ? "#16a34a"
                    : "#dc2626",
                }}
              />
              Backend: {backendConnected ? "Connected" : "Disconnected"}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ""}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              gap: collapsed ? 0 : 12,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "#111827" : "#475569",
              backgroundColor: isActive ? "#eef2ff" : "transparent",
              transition: "all 0.18s ease",
              position: "relative",
            })}
            className="sidebar-link"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : 12,
              }}
            >
              <item.icon />
              {!collapsed && item.label}
            </div>

            {!collapsed && item.badge !== undefined && (
              <span
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                {item.badge}
              </span>
            )}

            {item.dot && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                  animation: "pulse 1.2s infinite",
                }}
              />
            )}
          </NavLink>
        ))}
      </div>

      <style>
        {`
          .sidebar-link:hover {
            background: #f1f5f9;
            transform: translateX(2px);
          }

          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
}

/* Icons */

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="#334155"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.25s ease",
        transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 4 10 8 6 12" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#334155" strokeWidth="2">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="10" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="10" width="5" height="5" rx="1" />
      <rect x="10" y="10" width="5" height="5" rx="1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#334155" strokeWidth="2">
      <path d="M9 2l6 3v4c0 4-3 7-6 8-3-1-6-4-6-8V5l6-3z" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#334155" strokeWidth="2">
      <path d="M3 7l6-4 6 4-6 4-6-4z" />
      <path d="M3 7v6l6 4 6-4V7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#334155" strokeWidth="2">
      <circle cx="8" cy="8" r="5" />
      <line x1="13" y1="13" x2="17" y2="17" />
    </svg>
  );
}
