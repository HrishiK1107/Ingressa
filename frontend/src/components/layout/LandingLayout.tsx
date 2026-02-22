import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function LandingLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    // If not on landing page, navigate first
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="landing-root">
      {/* ================= NAVBAR ================= */}
      <header className="landing-navbar">
        <div className="nav-inner">

          <div
            className="nav-brand"
            onClick={() => navigate("/")}
          >
            INGRESSA
          </div>

          <nav className="nav-links">
            <button
              className="nav-link-btn"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            <button
              className="nav-link-btn"
              onClick={() => scrollToSection("how")}
            >
              How it Works
            </button>

            <button
              className="nav-link-btn"
              onClick={() => scrollToSection("architecture")}
            >
              Architecture
            </button>
          </nav>

          <div className="nav-actions">
            <button
              className="nav-console-btn"
              onClick={() => navigate("/dashboard")}
            >
              Launch Console
            </button>
          </div>

        </div>
      </header>

      <Outlet />
    </div>
  );
}
