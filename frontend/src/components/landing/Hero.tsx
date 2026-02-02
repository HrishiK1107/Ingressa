import LandingNavbar from "@/components/layout/LandingNavbar";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_60%)]" />

      {/* Top bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 text-fg font-medium tracking-wide">
          <div className="grid grid-cols-2 gap-1">
            <span className="w-2 h-2 bg-fg rounded-sm" />
            <span className="w-2 h-2 bg-fg rounded-sm" />
            <span className="w-2 h-2 bg-fg rounded-sm" />
            <span className="w-2 h-2 bg-fg rounded-sm" />
          </div>
          INGRESSA
        </div>

        {/* Center navbar */}
        <LandingNavbar />

        {/* Right CTA */}
        <button
          className="px-5 py-2 rounded-xl bg-bg-surface/70 backdrop-blur
                     border border-border text-sm
                     hover:bg-bg-muted transition"
        >
          Open Dashboard
        </button>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-tight">
            Cloud Asset Security & <br />
            Inventory Simplified
          </h1>

          <p className="mt-6 max-w-xl text-fg-muted">
            Streamline cloud security and manage your assets effortlessly
            with live scans, powerful triaging, and comprehensive dashboards.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-10 px-6 py-3 rounded-xl
                       bg-bg-surface border border-border
                       hover:bg-bg-muted transition"
          >
            Explore Features
          </button>
        </div>

        {/* RIGHT — terminal preview container */}
        <div className="relative">
          <div
            className="relative rounded-2xl border border-border
                       bg-bg-surface/60 backdrop-blur-xl
                       h-[420px] w-full shadow-2xl"
          >
            <div className="h-10 border-b border-border flex items-center px-4 text-xs text-fg-muted">
              ingressa / scan 260
            </div>

            <div className="p-4 text-xs text-fg-subtle">
              {/* animated terminal will live here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
