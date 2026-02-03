import DockNav from "./DockNav";
import type { ReactNode } from "react";
import ConnectivityBadge from "@/components/ConnectivityBadge";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center page-pad gap-6 bg-gradient-to-b from-black via-[#060912] to-black">
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
          {/* inner padding normalized via token rhythm */}
          <div className="h-full console-pad">{children}</div>
        </main>

        {/* CONNECTIVITY FOOTER (F1.4) */}
        <div className="h-12 px-4 border-t border-white/10 flex items-center justify-between">
          <ConnectivityBadge />
          <div className="text-xs text-white/40">Ingressa Console</div>
        </div>
      </div>

      {/* DOCK */}
      <div className="h-20 flex items-center justify-center">
        <DockNav />
      </div>
    </div>
  );
}
