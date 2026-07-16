// Mirrors tailwind.config.js color tokens for use inside R3F/Three.js
// materials, which need hex numbers or CSS strings rather than Tailwind
// class names.

export const COLORS = {
  bgPrimary: "#0A0A0B",
  bgSecondary: "#151517",
  bgElevated: "#1C1C1F",
  accentElectric: "#2E6FFF",
  accentCyan: "#5FE0E0",
  textPrimary: "#FAFAFA",
  textSecondary: "#8A8F98",
  borderSubtle: "#2A2A2E",
} as const;
