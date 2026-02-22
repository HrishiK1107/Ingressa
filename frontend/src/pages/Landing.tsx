import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();

  const [lines, setLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const typeLine = async (text: string) => {
      setCurrentText("");

      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        setCurrentText((prev) => prev + text[i]);
        await delay(25 + Math.random() * 40);
      }

      await delay(400);

      if (!cancelled) {
        setLines((prev) => [...prev, text]);
        setCurrentText("");
      }
    };

    const run = async () => {
      while (!cancelled) {
        setLines([]);

        await typeLine("> initializing collectors...");
        await typeLine("> normalizing 842 assets...");
        await typeLine("> building relationship graph...");
        await typeLine("> evaluating policies...");
        await typeLine("> computing weighted risk score...");

        const score = 70 + Math.floor(Math.random() * 5);
        await typeLine(`> global_risk_score = ${score}`);

        await delay(500);

        if (!cancelled) {
          setLines((prev) => [
            ...prev,
            "SCAN_COMPLETED_SUCCESSFULLY",
          ]);
        }

        await delay(3000);

        if (!cancelled) {
          setLines([]);
        }
      }
    };

    run();

    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => {
      cancelled = true;
      clearInterval(blink);
    };
  }, []);

  return (
    <div className="landing-root">
      <div className="landing-container">

        {/* ================= HERO ================= */}
        <section className="landing-hero">
          <div className="hero-left">
            <h1 className="hero-title">
              Deterministic Cloud Risk Intelligence
            </h1>

            <h2 className="hero-subtitle">
              Cloud Attack Surface Discovery & <br />
              Risk Prioritization Engine
            </h2>

            <p className="hero-description">
              Continuous asset graph mapping. Policy-driven detection.
              Deterministic risk scoring. Drift-aware reconciliation.
            </p>

            <div className="hero-actions">
              <button
                className="hero-btn btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Launch Console
              </button>

              <button
                className="hero-btn btn-secondary"
                onClick={() =>
                  document
                    .getElementById("architecture")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Architecture
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="terminal-panel">
              <div className="terminal-header">
                <span>Ingressa Engine</span>
                <span className="terminal-status">
                  SCAN RUNNING
                </span>
              </div>

              <div className="terminal-body">
                {lines.map((line, i) => {
                  const isScore = line.includes("global_risk_score");
                  const isSuccess =
                    line === "SCAN_COMPLETED_SUCCESSFULLY";

                  return (
                    <div
                      key={i}
                      className={`terminal-line
                        ${isScore ? "score-line" : ""}
                        ${isSuccess ? "success-line" : ""}`}
                    >
                      {isSuccess
                        ? "scan completed successfully"
                        : line}
                    </div>
                  );
                })}

                <div className="terminal-line">
                  {currentText}
                  <span className="cursor">
                    {cursorVisible ? "|" : " "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="landing-features">
          <div className="features-container">
            <h2 className="features-title">
              Engineered for Real Cloud Risk
            </h2>

            <p className="features-subtitle">
              Deterministic analysis. Graph-based exposure mapping.
              Policy-driven detection. No black boxes.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">01</div>
                <h3>Asset Graph Mapping</h3>
                <p>
                  Normalizes cloud inventory into a relationship-aware
                  asset graph for contextual analysis.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">02</div>
                <h3>Policy-Driven Detection</h3>
                <p>
                  Deterministic rule engine with explainable findings.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">03</div>
                <h3>Weighted Risk Scoring</h3>
                <p>
                  Exposure-aware severity weighting for accurate prioritization.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">04</div>
                <h3>Drift Reconciliation</h3>
                <p>
                  Open / resolve lifecycle tracking across scans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how" className="landing-how">
          <div className="how-container">
            <h2 className="how-title">How Ingressa Works</h2>
            <p className="how-subtitle">
              Deterministic cloud risk analysis in structured phases.
            </p>

            <div className="how-grid">
              <div className="how-step">
                <div className="how-number">01</div>
                <h3>Collect & Normalize</h3>
                <p>
                  Inventory ingestion and relationship-aware graph modeling.
                </p>
              </div>

              <div className="how-step">
                <div className="how-number">02</div>
                <h3>Evaluate Policies</h3>
                <p>
                  Deterministic rule execution with explainable output.
                </p>
              </div>

              <div className="how-step">
                <div className="how-number">03</div>
                <h3>Score & Prioritize</h3>
                <p>
                  Exposure-weighted risk scoring aligned to impact.
                </p>
              </div>
            </div>
          </div>
        </section>

{/* ================= ARCHITECTURE ================= */}
<section id="architecture" className="landing-architecture">
  <div className="architecture-container">

    <h2 className="architecture-title">
      Deterministic Cloud Risk Architecture
    </h2>

    <p className="architecture-subtitle">
      Structured, explainable pipeline powering deterministic analysis.
    </p>

    <div className="architecture-pipeline">
      <div className="arch-flow-line" />
      <div className="arch-flow-dot" />

      <div className="arch-node">
        <h3>Collectors</h3>
        <p>
          Ingest AWS and mock inventories securely and normalize
          raw cloud data into structured input streams.
        </p>
      </div>

      <div className="arch-node">
        <h3>Normalization</h3>
        <p>
          Transform heterogeneous cloud resources into a unified,
          relationship-aware schema for graph construction.
        </p>
      </div>

      <div className="arch-node">
        <h3>Asset Graph</h3>
        <p>
          Build contextual dependency graphs mapping identities,
          permissions and exposure paths.
        </p>
      </div>

      <div className="arch-node">
        <h3>Policy Engine</h3>
        <p>
          Execute deterministic rules with fully auditable evaluation logic.
        </p>
      </div>

      <div className="arch-node">
        <h3>Risk Engine</h3>
        <p>
          Compute exposure-weighted severity scoring and prioritize
          remediation based on impact.
        </p>
      </div>

    </div>
  </div>
</section>

        {/* ================= FINAL CTA ================= */}
        <section className="landing-cta">
          <div className="cta-container">
            <h2 className="cta-title">
              See Your Cloud Risk — Deterministically
            </h2>

            <p className="cta-subtitle">
              No AI guessing. No black boxes. Just explainable,
              exposure-aware risk intelligence.
            </p>

            <button
              className="cta-button"
              onClick={() => navigate("/dashboard")}
            >
              Launch Ingressa Console
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
