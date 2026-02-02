"use client";

import {
  Sparkles,
  Layers,
  Info,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Features", target: "features", icon: Sparkles },
  { label: "How it Works", target: "how-it-works", icon: Layers },
  { label: "About", target: "how-it-works", icon: Info },
  { label: "FAQ", target: "footer", icon: HelpCircle },
];

export default function LandingNavbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="absolute left-1/2 -translate-x-1/2
                 bg-bg-surface/60 backdrop-blur-xl
                 border border-border rounded-full
                 px-2 py-2 flex gap-1"
    >
      {navItems.map(({ label, target, icon: Icon }) => (
        <button
          key={label}
          onClick={() => scrollTo(target)}
          className="flex items-center gap-2 px-4 py-2 rounded-full
                     text-sm text-fg-muted
                     hover:text-fg hover:bg-bg-muted
                     transition"
        >
          <Icon size={16} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
