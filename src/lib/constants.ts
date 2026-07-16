/** Shared Tailwind focus-visible ring — apply to every interactive element. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

export const EASE_ENGINEERED = [0.16, 1, 0.3, 1] as const;

export const NAV_SECTIONS = [
  { label: "About", id: "about" },
  { label: "Philosophy", id: "philosophy" },
  { label: "Case Studies", id: "case-studies" },
  { label: "AI", id: "ai" },
  { label: "Proof", id: "proof" },
  { label: "Vision", id: "vision" },
  { label: "Contact", id: "contact" },
] as const;
