import { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import ArmScene from "./ArmScene";
import type { ArmPhase } from "./ArmScene";
import ArmFallback from "./ArmFallback";
import {
  useIsMobile,
  usePrefersReducedMotion,
  useSupportsWebGL,
} from "../../lib/useResponsive";
import { useChat } from "../ai-chat/ChatContext";

const CODE_LINES = [
  "class Engineer:",
  "  def __init__(self):",
  "    self.curiosity = True",
  "  def build(self, problem):",
  "    return solution",
];

export default function Hero() {
  const [phase, setPhase] = useState<ArmPhase>("writing");
  const [menuOpen, setMenuOpen] = useState(false);
  const handlePhaseChange = useCallback((p: ArmPhase) => setPhase(p), []);

  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const supportsWebGL = useSupportsWebGL();
  const { openChat } = useChat();

  const handleOpenChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    openChat({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  // Per design-system.md Section 7 & 8: no R3F on mobile (<768px), and
  // prefers-reduced-motion gets a simplified/static experience rather than
  // the full writing+follow sequence. WebGL absence falls back the same way.
  const useStaticFallback = isMobile || prefersReducedMotion || !supportsWebGL;

  // Escape closes the mobile menu — required for keyboard/AT users since
  // there's no other close affordance besides re-tapping the hamburger.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[720px] overflow-hidden bg-bg-primary"
    >
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-20 py-6">
        <span className="font-display text-body font-medium tracking-tight text-text-primary">
          HB
        </span>
        <div className="flex items-center gap-8">
          <button
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="hidden md:inline text-caption uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Menu
          </button>
          <button
            onClick={handleOpenChat}
            className="text-caption uppercase tracking-wide text-accent-electric hover:brightness-110 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Talk with my AI
          </button>
          {/* Mobile menu trigger — the "Menu" text link above is desktop-only;
              below 768px this is the only nav entry point, so it must exist. */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden relative w-6 h-5 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-text-primary origin-center"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-[1.5px] w-full bg-text-primary"
              transition={{ duration: 0.15 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-text-primary origin-center"
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu-panel"
            role="dialog"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-[72px] left-0 right-0 z-30 mx-6 rounded-xl border border-white/10 bg-bg-elevated/95 backdrop-blur-md p-6 flex flex-col gap-1"
          >
            {[
              { label: "About", href: "about" },
              { label: "Philosophy", href: "philosophy" },
              { label: "Case Studies", href: "case-studies" },
              { label: "Artificial Intelligence", href: "ai" },
              { label: "Proof of Excellence", href: "proof" },
              { label: "Vision", href: "vision" },
              { label: "Contact", href: "contact" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById(item.href)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left py-3 text-body text-text-primary hover:text-accent-electric transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric rounded"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D arm canvas / static fallback — full bleed background layer */}
      <div className="absolute inset-0 z-0" aria-hidden="true">

        {useStaticFallback ? (
          <ArmFallback codeLines={CODE_LINES} animate={!prefersReducedMotion} />
        ) : (
          <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]}>
            <color attach="background" args={["#0A0A0B"]} />
            <Suspense fallback={null}>
              <ArmScene codeLines={CODE_LINES} onPhaseChange={handlePhaseChange} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Status label */}
      <div
        className="absolute top-24 left-6 md:left-20 z-10 font-mono text-caption uppercase tracking-wide text-text-secondary pointer-events-none"
        aria-live="polite"
      >
        {useStaticFallback
          ? "Engineering, in progress"
          : phase === "writing"
          ? "System initializing"
          : "System online — tracking input"}
      </div>

      {/* Headline + copy — left-aligned, overlays left portion of the scene */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-20">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-display-2 text-text-primary mb-6"
          >
            Engineering the future
            <br />
            of intelligent robotics.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-body-lg text-text-secondary mb-10 max-w-md"
          >
            Harkeerat Bhasin — an AI-driven robotics engineer building
            intelligent systems at the intersection of hardware, software,
            and machine intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 rounded-lg bg-accent-electric text-text-primary text-body font-medium hover:brightness-110 hover:scale-[1.02] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              Explore my journey
            </button>
            <button
              onClick={handleOpenChat}
              className="px-6 py-3 rounded-lg border border-white/10 bg-transparent text-text-primary text-body font-medium hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              Talk with my AI
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-text-secondary text-caption uppercase tracking-wide"
      >
        Scroll
      </motion.div>
    </section>
  );
}
