// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0f1a",     // global dark
          surface: "#11162a",     // cards (non-glass)
        },
        fg: {
          DEFAULT: "#e5e7eb",
          muted: "#9ca3af",
        },
        accent: {
          DEFAULT: "#6366f1",     // indigo
          soft: "rgba(99,102,241,.25)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,.08)",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,.25)",
        glow: "0 0 35px rgba(99,102,241,.25)", // hover only
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
      spacing: {
        page: "1.5rem",
        section: "4rem",
        card: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
