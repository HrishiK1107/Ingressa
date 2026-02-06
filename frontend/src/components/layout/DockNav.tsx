import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/findings", label: "Findings" },
  { to: "/assets", label: "Assets" },
  { to: "/scans", label: "Scans" },
];

export default function DockNav() {
  const { pathname } = useLocation();

  return (
    <aside
      style={{
        width: 180,
        borderRight: "1px solid #222",
        padding: 16,
      }}
    >
      {links.map((l) => (
        <div key={l.to} style={{ marginBottom: 12 }}>
          <Link
            to={l.to}
            style={{
              fontWeight: pathname === l.to ? "bold" : "normal",
            }}
          >
            {l.label}
          </Link>
        </div>
      ))}
    </aside>
  );
}
