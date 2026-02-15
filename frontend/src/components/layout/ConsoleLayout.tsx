import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function ConsoleLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
