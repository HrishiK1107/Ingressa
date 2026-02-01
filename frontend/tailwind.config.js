/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0f1a",
          surface: "#111827",
          muted: "#0f172a",
        },
        fg: {
          DEFAULT: "#e5e7eb",
          muted: "#9ca3af",
          subtle: "#6b7280",
        },
        accent: {
          DEFAULT: "#3b82f6",
          muted: "#2563eb",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
