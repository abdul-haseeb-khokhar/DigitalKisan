/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#c9a227",      // Mustard gold
        secondary: "#1d3557",    // Deep blue
        background: "#fdf6ec",   // Warm cream
        surface: "#ffffff",
        textDark: "#3d2b1f",     // Dark brown
        textMuted: "#7a8fa0",    // Muted blue-gray
        border: "#e8d9c4",       // Warm border
      },
    },
  },
  plugins: [],
}

