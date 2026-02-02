export default function Footer() {
  return (

    <footer className="relative mt-40 border-t border-border">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="w-[900px] h-[300px] bg-accent/15 blur-[160px] rounded-full -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-accent" />
              </div>
              <span className="text-lg font-semibold">Ingressa</span>
            </div>
            <p className="mt-4 text-sm text-fg-muted max-w-xs">
              Cloud Attack Surface Intelligence
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3 text-sm text-fg-muted">
            <a href="#features" className="hover:text-fg transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-fg transition">
              How it Works
            </a>
            <a href="#about" className="hover:text-fg transition">
              About
            </a>
            <a href="#faq" className="hover:text-fg transition">
              FAQs
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/HrishiK1107/Ingressa"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-border px-6 py-3 text-sm text-center hover:bg-bg-muted transition"
            >
              GitHub
            </a>
            <a
              href="#"
              className="rounded-xl border border-border px-6 py-3 text-sm text-center hover:bg-bg-muted transition"
            >
              API Docs
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-border" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between gap-6 text-sm text-fg-subtle">
          <span>© 2024 Ingressa</span>
          <span>Built by Hrishikesh Kanapuram</span>
          <span>Version v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
