import DockNav from "./DockNav";
import type { ReactNode } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-6 gap-4">

      {/* GLASS CONSOLE FRAME */}
      <div
        className="
          w-full
          max-w-[1400px]
          h-[82vh]
          rounded-3xl
          border border-white/15
          bg-gradient-to-b from-neutral-900/80 to-black
          backdrop-blur-xl
          shadow-[0_0_80px_rgba(59,130,246,0.15)]
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* HEIGHT-CONSTRAINED CONTENT */}
        <main className="flex-1 min-h-0">
          <div className="h-full px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* DOCK */}
      <div className="h-20 flex items-center justify-center">
        <DockNav />
      </div>

    </div>
  );
}
