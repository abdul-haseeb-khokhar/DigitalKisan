/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  safelist: [
    // Fresh Earth backgrounds
    'bg-fe-primary',
    'bg-fe-secondary',
    'bg-fe-background',
    'bg-fe-surface',
    'bg-fe-badge',
    // Fresh Earth text
    'text-fe-primary',
    'text-fe-secondary',
    'text-fe-textDark',
    'text-fe-textMuted',
    'text-fe-accent',
    // Fresh Earth borders
    'border-fe-primary',
    'border-fe-secondary',
    'border-fe-border',
    // Mitti & Sky backgrounds
    'bg-ms-primary',
    'bg-ms-secondary',
    'bg-ms-background',
    'bg-ms-surface',
    'bg-ms-badge',
    // Mitti & Sky text
    'text-ms-primary',
    'text-ms-secondary',
    'text-ms-textDark',
    'text-ms-textMuted',
    'text-ms-accent',
    // Mitti & Sky borders
    'border-ms-primary',
    'border-ms-secondary',
    'border-ms-border',
    // Input classes
    'bg-fe-surface',
    'bg-ms-surface',
  ],
  theme: {
    extend: {
      colors: {
        fe: {
          primary: "#1a6b3c",
          secondary: "#145530",
          background: "#f9f9f4",
          surface: "#ffffff",
          textDark: "#1c1c1c",
          textMuted: "#7a9e8a",
          border: "#d4e8da",
          accent: "#f5a623",
          badge: '#e6f4ec',
        },
        ms: {
          primary: "#c9a227",
          secondary: "#1d3557",
          background: "#fdf6ec",
          surface: "#ffffff",
          textDark: "#3d2b1f",
          textMuted: "#7a8fa0",
          border: "#e8d9c4",
          accent: '#c9a227',
          badge: '#f0e6d0',
        },

        error: '#c0392b',
        success: '#2d6a4f',
        warning: '#e67e22',
      },
    },
  },
  plugins: [],
}

