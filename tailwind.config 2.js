/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./quartz/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--lightgray)",
        background: "var(--light)",
        card: "var(--lightgray)",
        primary: "var(--secondary)",
        destructive: "var(--red)",
        muted: {
          foreground: "var(--darkgray)",
        },
        'aurora-red': 'var(--red)',
        'aurora-yellow': 'var(--yellow)',
        'aurora-green': 'var(--green)',
        'aurora-purple': 'var(--secondary)',
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
}
