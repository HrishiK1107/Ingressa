import { Outlet } from "react-router-dom";
import DockNav from "./DockNav";

export default function ConsoleLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DockNav />

      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
