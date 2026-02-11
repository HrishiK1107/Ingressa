import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ConsoleLayout() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden", // prevent double scroll
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          backgroundColor: "#f9f9f9",
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
