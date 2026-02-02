import DockNav from "./DockNav";
import type { ReactNode } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-6 gap-6 bg-gradient-to-b from-black via-[#060912] to-black">

      {/* GLASS CONSOLE FRAME */}
      <div
        className="
          w-full
          max-w-[1400px]
          h-[82vh]
          rounded-3xl
          glass
          console-frame-glow
          overflow-hidden
          flex
          flex-col
        "
      >
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
