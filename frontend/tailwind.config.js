/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",

        card: "hsl(var(--card))",
        "card-2": "hsl(var(--card-2))",

        muted: "hsl(var(--muted))",
        "muted-2": "hsl(var(--muted-2))",

        border: "hsl(var(--border))",

        accent: "hsl(var(--accent))",
        "accent-2": "hsl(var(--accent-2))",
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [],
};
