export default function Scans() {
  return (
    <div className="h-full min-h-0 flex flex-col gap-6">

      {/* TOP SEARCH ROW */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-10 rounded-lg border border-white/15 flex items-center px-3 text-white/40">
          Search…
        </div>

        {/* Placeholder right-side controls */}
        <div className="flex gap-3">
          <div className="h-8 w-24 rounded-md border border-white/10" />
          <div className="h-8 w-24 rounded-md border border-white/10" />
          <div className="h-8 w-24 rounded-md border border-white/10" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-0 grid grid-cols-[320px_1fr] gap-6">

        {/* LEFT PANEL — RUN SCAN */}
        <div className="rounded-2xl border border-white/15 p-4 flex flex-col gap-4">
          <div className="text-lg text-white/90">
            Run Scan
          </div>

          <div className="text-sm text-white/60 leading-relaxed">
            Perform a cloud security scan to detect vulnerabilities and
            misconfigurations.
          </div>

          <div className="flex gap-3">
            <div className="h-9 px-4 rounded-md border border-white/15 flex items-center text-sm">
              Mock Scan
            </div>
            <div className="h-9 px-4 rounded-md border border-white/15 flex items-center text-sm">
              AWS Scan
            </div>
          </div>

          <div className="text-sm text-white/50">
            Last scan: <span className="text-orange-400">Running…</span>
          </div>

          {/* filler content */}
          <div className="flex-1 rounded-lg border border-white/5" />
        </div>

        {/* RIGHT PANEL — SCANS TABLE */}
        <div className="min-h-0 rounded-2xl border border-white/15 flex flex-col overflow-hidden">

          {/* TABLE FILTER BAR */}
          <div className="h-12 px-4 flex items-center gap-3 border-b border-white/10 text-sm text-white/60">
            <div className="h-8 px-3 rounded-md border border-white/15 flex items-center">
              + AWS
            </div>
            <div className="h-8 w-20 rounded-md border border-white/15" />
            <div className="h-8 w-20 rounded-md border border-white/15" />
          </div>

          {/* TABLE HEADER */}
          <div className="
            h-12 px-4
            grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_40px]
            items-center
            text-xs text-white/50
            border-b border-white/10
          ">
            <div>SCAN ID</div>
            <div>STARTED</div>
            <div>COMPLETED</div>
            <div>DURATION</div>
            <div>STATUS</div>
            <div>ASSETS</div>
            <div>FINDINGS</div>
          </div>

          {/* TABLE BODY */}
          <div className="flex-1 min-h-0">
            {/* rows go here */}
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="h-12 px-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <div>1 of 7 pages</div>

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

    </div>
  );
}
