  import { Outlet, useLocation } from "react-router-dom";
  import { useState } from "react";
  import Sidebar from "./Sidebar";

  export default function ConsoleLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const isDashboard = location.pathname.includes("dashboard");

    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--bg-app)",
          color: "var(--text-primary)",
        }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div
          className={`console-content ${
            isDashboard ? "dashboard-mode" : ""
          }`}
          style={{
            flex: 1,
            padding: "32px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              height: "100%",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
