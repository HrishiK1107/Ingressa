import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

/* icons unchanged */
function IconDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconFindings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconAssets() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <polyline points="3.3 7 12 12 20.7 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function IconScans() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

const links = [
  { to: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { to: "/findings", label: "Findings", icon: IconFindings },
  { to: "/assets", label: "Assets", icon: IconAssets },
  { to: "/scans", label: "Scans", icon: IconScans },
];

export default function DockNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2
        px-3 py-3
        rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      {links.map((l) => {
        const active = pathname === l.to;
        const Icon = l.icon;

        return (
          <Link
            key={l.to}
            to={l.to}
            title={l.label}
            className={clsx(
              "relative flex items-center justify-center",
              "w-11 h-11 rounded-xl transition-all",
              active
                ? "bg-white/20 text-white shadow-inner"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon />
            {active && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
