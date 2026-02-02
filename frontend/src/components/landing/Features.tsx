export default function Features() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold">Features</h2>
          <p className="mt-3 max-w-2xl mx-auto text-fg-muted text-sm">
            Streamline cloud security with powerful tools designed to inventory
            assets, detect risks, track drift, and simplify remediation.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Row 1 */}
          <div className="lg:col-start-1 lg:row-start-1">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Asset Inventory</h3>
                <span className="text-xs text-fg-muted">550+ assets</span>
              </div>

              <div className="space-y-3 text-sm">
                {["EC2", "S3", "RDS", "IAM"].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-fg-muted">{item}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className="w-2 h-2 bg-fg/15 rounded-sm" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-start-2 lg:row-start-1">
            <Card elevated>
              <span className="text-xs text-fg-muted">AI Advisor</span>
              <h3 className="font-medium mt-2 mb-6">Live Scan Engine</h3>

              <div className="flex justify-between text-xs text-fg-muted mb-2">
                <span>Collect</span>
                <span>Analyze</span>
                <span>Detect</span>
              </div>

              <div className="h-1.5 w-[70%] bg-fg/10 rounded overflow-hidden">
                <div className="h-full w-[55%] bg-accent rounded" />
              </div>

              <p className="mt-6 text-sm text-fg-muted max-w-sm">
                Automated scanning powered by an AI advisor to detect and
                prioritize risks.
              </p>
            </Card>
          </div>

          <div className="lg:col-start-3 lg:row-start-1">
            <Card>
              <h3 className="font-medium mb-4">
                Deterministic Risk Scoring
              </h3>

              <div className="flex gap-2 text-xs">
                <Badge color="bg-green-500">LOW</Badge>
                <Badge color="bg-yellow-500">MED</Badge>
                <Badge color="bg-orange-500">HIGH</Badge>
                <Badge color="bg-red-500">CRIT</Badge>
              </div>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
            <Card>
              <h3 className="font-medium mb-4">
                Policy Detection + Drift
              </h3>

              <div className="flex items-end gap-2 h-14 mb-4">
                {[18, 40, 25, 48, 30, 42].map((v, i) => (
                  <div
                    key={i}
                    style={{ height: `${v}%` }}
                    className="w-5 bg-accent/70 rounded"
                  />
                ))}
              </div>

              <p className="text-sm text-fg-muted max-w-md">
                Monitor and track policy violations over time as they’re opened
                and resolved.
              </p>
            </Card>
          </div>

          <div className="lg:col-start-3 lg:row-start-2">
            <Card>
              <h3 className="font-medium mb-4">Remediation + Exports</h3>

              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Restrict inbound SSH access
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Enforce S3 public access block
                </li>
              </ul>

              <div className="mt-4 flex gap-2 text-xs">
                <MiniBtn>Export CSV</MiniBtn>
                <MiniBtn>Export JSON</MiniBtn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- primitives ---------- */

function Card({
  children,
  elevated,
  wide,
}: {
  children: React.ReactNode;
  elevated?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-bg-surface/60 backdrop-blur",
        // ⬇️ increased vertical length
        wide ? "h-[260px]" : "h-[280px]",
        "p-6 w-full",
        elevated && "bg-bg-surface/70 shadow-xl",
      ].join(" ")}
    >
      {children}
    </div>
  );
}


function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span className={`px-2 py-1 rounded text-white ${color}`}>
      {children}
    </span>
  );
}

function MiniBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded border border-border bg-bg-muted">
      {children}
    </span>
  );
}
