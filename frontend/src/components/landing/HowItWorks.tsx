import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  id: string;
  label: string;
  description: string;
};

const STEPS: Step[] = [
  {
    id: "collect",
    label: "Collect",
    description:
      "Pull inventory of cloud resources across regions and accounts.",
  },
  {
    id: "normalize",
    label: "Normalize",
    description:
      "Standardize raw provider data into a unified internal schema.",
  },
  {
    id: "graph",
    label: "Graph",
    description:
      "Convert assets into a relationship graph to reveal exposure paths.",
  },
  {
    id: "detect",
    label: "Detect",
    description:
      "Run security policies to detect misconfigurations and risks.",
  },
  {
    id: "score",
    label: "Score",
    description:
      "Compute deterministic risk scores with explainable context.",
  },
  {
    id: "remediate",
    label: "Remediate",
    description:
      "Generate actionable remediation steps mapped to each finding.",
  },
  {
    id: "export",
    label: "Export",
    description:
      "Export reports and findings to CSV, JSON, or external systems.",
  },
];

export default function HowItWorks() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-highlight on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) setActive(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(refs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto text-center mb-24">
        <h2 className="text-3xl font-semibold tracking-tight">
          How It Works
        </h2>
        <p className="mt-4 text-fg-muted max-w-2xl mx-auto">
          See Ingressa’s AI-powered security process in action from data
          collection to remediation and reporting.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-16">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 w-px bg-border" />

        {STEPS.map((step, index) => {
          const isLeft = index % 2 === 1;
          const isActive = hovered === step.id || active === step.id;

          return (
            <div
              key={step.id}
              ref={(el) => {
                refs.current[step.id] = el;
              }}
              data-id={step.id}
              className="relative flex flex-col items-center"
            >
              {/* Tooltip */}
              <AnimatePresence>
                {hovered === step.id && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isLeft ? -16 : 16,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: isLeft ? -16 : 16,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={[
                      "absolute top-1/2 -translate-y-1/2",
                      "w-[340px]",
                      "rounded-xl border border-border bg-bg-surface/80 backdrop-blur",
                      "px-5 py-4 text-sm text-fg-muted shadow-xl leading-relaxed",
                      isLeft
                        ? "right-[calc(50%+72px)] text-right"
                        : "left-[calc(50%+72px)] text-left",
                    ].join(" ")}
                  >
                    {step.description}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node */}
              <div
                onMouseEnter={() => setHovered(step.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative w-16 h-16 flex items-center justify-center cursor-pointer"
              >
                {/* Idle pulse */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse" />
                )}

                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-accent/30 blur-2xl" />

                {/* Mid halo */}
                <div className="absolute inset-2 rounded-full bg-accent/60 blur-md" />

                {/* Core */}
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="relative w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_18px_rgba(59,130,246,0.95)]"
                />
              </div>

              {/* Label */}
              <div className="mt-3 text-sm font-medium text-fg">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
