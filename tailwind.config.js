/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0A0A0B",
          secondary: "#151517",
          elevated: "#1C1C1F",
        },
        accent: {
          electric: "#2E6FFF",
          cyan: "#5FE0E0",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#8A8F98",
        },
        border: {
          subtle: "#2A2A2E",
        },
      },
      fontFamily: {
        display: ["'General Sans'", "'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-1": ["96px", { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-2": ["64px", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-1": ["40px", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-2": ["28px", { lineHeight: "1.2", fontWeight: "500" }],
        "body-lg": ["20px", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      spacing: {
        18: "4.5rem",
        30: "7.5rem",
        48: "12rem",
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        engineered: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};
