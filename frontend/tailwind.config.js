/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: "#e53e3e",
        "brand-dark": "#c53030",
        "brand-light": "#fc8181",
        surface: "#141414",
        "surface-light": "#1e1e1e",
        "surface-lighter": "#2a2a2a",
        ink: "#f5f5f5",
        "ink-muted": "#9ca3af",
        "ink-faint": "#6b7280"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
