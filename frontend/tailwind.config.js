/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Base */
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",

        /* Surfaces */
        card: "hsl(var(--card))",
        "card-2": "hsl(var(--card-2))",

        /* Text */
        muted: "hsl(var(--muted))",
        "muted-2": "hsl(var(--muted-2))",

        /* Borders */
        border: "hsl(var(--border))",

        /* Accents */
        accent: "hsl(var(--accent))",
        "accent-2": "hsl(var(--accent-2))",
      },

      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 6px)",
      },
    },
  },
  plugins: [],
};
