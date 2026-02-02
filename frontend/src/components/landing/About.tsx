export default function About() {
  return (
    <section id="about" className="relative py-36 px-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[1000px] h-[520px] bg-accent/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          About Ingressa
        </h2>

        {/* Glass container */}
        <div className="mt-20 rounded-2xl border border-border bg-bg-surface/60 backdrop-blur-xl px-12 py-14 shadow-xl">
          {/* SUBHEADER (circled text moved here) */}
          <h3 className="text-xl font-medium text-fg leading-relaxed max-w-4xl">
            Ingressa is a cloud attack surface discovery and risk prioritization
            engine built to help security teams identify exposed assets, detect
            misconfigurations, and take action fast.
          </h3>

          {/* Body */}
          <p className="mt-6 max-w-4xl text-sm text-fg-muted leading-relaxed">
            It works by collecting cloud inventory, normalizing it into a
            consistent asset model, mapping relationships into an asset graph,
            and running policy checks to generate findings. Each finding is
            scored deterministically and paired with remediation guidance, with
            optional AI explanations for faster triage.
          </p>

          {/* Pillars */}
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-border bg-bg/40 px-6 py-10 min-h-[220px]">
              <p className="text-base font-medium text-fg">
                Deterministic risk scoring
              </p>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Explainable, deterministic scoring that prioritizes risk
                consistently across accounts, regions, and environments.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-border bg-bg/40 px-6 py-10 min-h-[220px]">
              <p className="text-base font-medium text-fg">
                Finding lifecycle tracking
              </p>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Track findings from <span className="text-fg">OPEN</span> to{" "}
                <span className="text-fg">RESOLVED</span> with clear timelines,
                state changes, and historical context.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-border bg-bg/40 px-6 py-10 min-h-[220px]">
              <p className="text-base font-medium text-fg">
                Remediation-ready reporting
              </p>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Export actionable findings and fixes in CSV or JSON formats,
                ready for remediation workflows and audits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
