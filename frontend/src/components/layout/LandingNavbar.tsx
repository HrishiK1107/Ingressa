import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #222",
      }}
    >
      <strong>Ingressa</strong>

      <div style={{ marginLeft: "auto" }}>
        <Link to="/dashboard">Console</Link>
      </div>
    </nav>
  );
}
