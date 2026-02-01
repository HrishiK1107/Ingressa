export default function Assets() {
  return (
    <div className="h-full min-h-0 flex flex-col gap-5">

      {/* SEARCH BAR */}
      <div className="h-10 rounded-lg border border-white/15 flex items-center px-3 text-white/40">
        Search…
      </div>

      {/* FILTER ROW */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-32 rounded-md border border-white/15 flex items-center px-3 text-sm text-white/60">
          Asset Type
        </div>
        <div className="h-9 w-20 rounded-md border border-white/15 flex items-center px-3 text-sm text-white/60">
          All
        </div>
        <div className="h-9 w-20 rounded-md border border-white/15 flex items-center px-3 text-sm text-white/60">
          All
        </div>
        <div className="h-9 w-24 rounded-md border border-white/15 flex items-center px-3 text-sm text-white/60">
          + Filters
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="flex-1 min-h-0 rounded-2xl border border-white/15 flex flex-col overflow-hidden">

        {/* TABLE HEADER */}
        <div
          className="
            h-12
            grid grid-cols-[1.2fr_1.5fr_1.5fr_1fr_1fr_40px]
            items-center
            px-4
            text-xs text-white/50
            border-b border-white/10
          "
        >
          <div>ASSET TYPE</div>
          <div>ASSET ID</div>
          <div>NAME</div>
          <div>REGION</div>
          <div>ACCOUNT</div>
          <div />
        </div>

        {/* TABLE BODY */}
        <div className="flex-1 min-h-0">
          {/* rows go here */}
        </div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="h-12 border-t border-white/10 flex items-center justify-between px-4 text-xs text-white/50">
          <div>1 of 10 pages</div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded border border-white/15" />
            <div className="h-7 w-7 rounded border border-white/15" />
            <div className="h-7 w-12 rounded border border-white/15 flex items-center justify-center">
              10
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
