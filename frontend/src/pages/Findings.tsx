export default function Findings() {
  return (
    <div className="h-full min-h-0 stack">
      {/* SEARCH + QUICK FILTER ICON */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-10 rounded-lg border border-white/15 flex items-center px-3 text-white/40">
          Search…
        </div>
        <div className="h-10 w-10 rounded-lg border border-white/15 flex items-center justify-center">
          ⏷
        </div>
      </div>

      {/* FILTER CHIPS ROW */}
      <div className="flex items-center gap-3 flex-wrap">
        <Chip label="1 Week" />
        <Chip label="Critical" />
        <Chip label="High" />
        <Chip label="Medium" />
        <Chip label="Low" />
        <Chip label="Region" />

        <div className="ml-auto flex items-center gap-3">
          <div className="text-sm text-white/50 cursor-pointer">Clear all</div>
          <div className="h-9 px-4 rounded-md border border-white/15 flex items-center text-sm">
            Filters
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="flex-1 min-h-0 rounded-2xl border border-white/15 flex flex-col overflow-hidden">
        {/* TABLE HEADER */}
        <div
          className="
            h-12 px-4
            grid grid-cols-[40px_1fr_1fr_2fr_1fr_1fr_1fr_40px]
            items-center
            text-xs text-white/50
            border-b border-white/10
          "
        >
          <div />
          <div>SEVERITY</div>
          <div>RISK</div>
          <div>POLICY ID</div>
          <div>RESOURCE</div>
          <div>REGION</div>
          <div>STATUS</div>
          <div />
        </div>

        {/* TABLE BODY (FILLS SPACE) */}
        <div className="flex-1 min-h-0">{/* rows go here */}</div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="h-12 px-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <div>1 of 25 pages</div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded border border-white/15" />
            <div className="h-7 w-7 rounded border border-white/15" />
            <div className="h-7 w-7 rounded border border-white/15" />
            <div className="h-7 w-16 rounded border border-white/15 flex items-center justify-center">
              25
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Chip (layout-only)
----------------------------------------- */
function Chip({ label }: { label: string }) {
  return (
    <div
      className="
        h-9 px-3
        rounded-md
        border border-white/15
        flex items-center
        text-sm text-white/70
      "
    >
      {label}
    </div>
  );
}
