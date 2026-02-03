/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",

        card: "hsl(var(--card))",
        card2: "hsl(var(--card-2))",

        muted: "hsl(var(--muted))",
        muted2: "hsl(var(--muted-2))",

        border: "hsl(var(--border))",

        accent: "hsl(var(--accent))",
        accent2: "hsl(var(--accent-2))",
      },

      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 8px)",
      },

      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
      },
    },
  },
  plugins: [],
};
