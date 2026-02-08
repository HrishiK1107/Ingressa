import { Outlet } from "react-router-dom";
import DockNav from "./DockNav";

export default function ConsoleLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#070b14] to-[#04060d]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blue-600/10 blur-[160px]" />
        <div className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      {/* Main content */}
      <main className="relative px-10 py-10 pb-32">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <Outlet />
        </div>
      </main>

      {/* Floating Dock */}
      <DockNav />
    </div>
  );
}
