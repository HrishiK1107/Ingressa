export default function Dashboard() {
  return (
    <div className="h-full min-h-0 flex flex-col gap-6">

      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <div className="h-5 w-5 rounded bg-white/20" />
          <span className="tracking-wide">INGRESSA</span>
        </div>

        <div className="h-9 px-4 rounded-md bg-blue-600 text-white text-sm flex items-center">
          Run Scan
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-5 gap-6">
        <MetricCard title="Total Assets" value="321" />
        <MetricCard title="Open Findings" value="128" />
        <MetricCard title="Critical Open" value="24" highlight />
        <MetricCard title="Last Scan" value="6m" badge="Completed" />
        <div className="rounded-xl border border-white/15" />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-0 grid grid-cols-[2fr_3fr] gap-6">

        {/* LEFT COLUMN */}
        <div className="grid grid-rows-[1fr_1fr] gap-6 min-h-0">

          {/* TOP RISKY FINDINGS */}
          <div className="rounded-2xl border border-white/15 p-4 flex flex-col gap-3">
            <div className="text-sm text-white/80">
              Top Risky Findings
            </div>

            <div className="flex-1 rounded-lg border border-white/10" />
          </div>

          {/* FINDINGS BY SEVERITY */}
          <div className="rounded-2xl border border-white/15 p-4 flex flex-col gap-3">
            <div className="text-sm text-white/80">
              Findings By Severity
            </div>

            <div className="flex-1 rounded-lg border border-white/10" />
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="grid grid-cols-[2fr_1fr] gap-6 min-h-0">

          {/* SCAN ACTIVITY */}
          <div className="rounded-2xl border border-white/15 p-4 flex flex-col gap-4">
            <div className="text-sm text-white/80">
              Scan Activity and Status
            </div>

            <div className="h-12 rounded-md border border-white/10 flex items-center px-3 text-orange-400 text-sm">
              Running…
            </div>

            <div className="flex-1 rounded-lg border border-white/10" />
          </div>

          {/* CURRENT SCAN STATUS */}
          <div className="rounded-2xl border border-white/15 p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Scan ID: #68294</span>
              <span className="text-white/40">✕</span>
            </div>

            <div className="text-orange-400 text-sm">
              Running…
            </div>

            <div className="flex-1 rounded-lg border border-white/10" />
          </div>

        </div>
      </div>

    </div>
  );
}

/* ----------------------------------------
   Metric Card (layout-only)
----------------------------------------- */
function MetricCard({
  title,
  value,
  badge,
  highlight,
}: {
  title: string;
  value: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 p-4 flex flex-col gap-1">
      <div className="text-xs text-white/50">
        {title}
      </div>

      <div className={`text-2xl ${highlight ? "text-red-400" : "text-white"}`}>
        {value}
      </div>

      {badge && (
        <div className="text-xs text-green-400">
          {badge}
        </div>
      )}
    </div>
  );
}
