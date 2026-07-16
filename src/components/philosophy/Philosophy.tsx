import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";
import { FOCUS_RING, EASE_ENGINEERED } from "../../lib/constants";
import { usePrefersReducedMotion } from "../../lib/useResponsive";

const STAGES = [
  {
    id: "sense",
    word: "Sense",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
    description:
      "Instrument the physical world — cameras, encoders, IMUs, and tactile sensors feed raw data into the perception layer. Good sensing means knowing what matters before you compute.",
  },
  {
    id: "think",
    word: "Think",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5v1A4.5 4.5 0 0 0 8.5 13H9v1a3 3 0 0 0 3 3h1a5.5 5.5 0 0 0 5.5-5.5V9a4.5 4.5 0 0 0-4.5-4.5H9.5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16v6M9 19h6" strokeLinecap="round" />
      </svg>
    ),
    description:
      "Process, classify, and decide — from classical control loops to ML inference pipelines. The thinking stage turns noisy sensor streams into actionable state estimates and commands.",
  },
  {
    id: "build",
    word: "Build",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description:
      "Fabricate, wire, and deploy — PCB design, firmware, mechanical assembly, and integration testing. A beautiful algorithm means nothing if the actuator can't execute it reliably.",
  },
  {
    id: "evolve",
    word: "Evolve",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M7 17l5-5 5 5M7 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description:
      "Log, analyze, and improve — every deployment generates data for the next iteration. Evolution closes the loop: better sensing, smarter thinking, more robust builds.",
  },
];

function PhilosophyCard({
  stage,
  expanded,
  onToggle,
}: {
  stage: (typeof STAGES)[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.button
      layout
      onClick={onToggle}
      aria-expanded={expanded}
      className={`w-full text-left p-6 rounded-xl bg-bg-secondary border border-border-subtle hover:border-accent-electric/30 transition-colors duration-300 ${FOCUS_RING}`}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_ENGINEERED }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          className="text-accent-cyan shrink-0"
        >
          {stage.icon}
        </motion.div>
        <span className="font-display text-heading-2 text-text-primary">{stage.word}</span>
      </div>
      <motion.div
        layout
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? 16 : 0,
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_ENGINEERED }}
        className="overflow-hidden"
      >
        <p className="text-body text-text-secondary">{stage.description}</p>
      </motion.div>
    </motion.button>
  );
}

export default function Philosophy() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="philosophy" className="py-16 md:py-32 lg:py-48 bg-bg-secondary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-4">
            Engineering philosophy
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-12 md:mb-16">
            Four stages that define how I approach every robotics and AI project.
          </p>
        </ScrollReveal>

        <LayoutGroup>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage, i) => (
              <ScrollReveal key={stage.id} delay={i * 0.08}>
                <PhilosophyCard
                  stage={stage}
                  expanded={expandedId === stage.id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === stage.id ? null : stage.id))
                  }
                />
              </ScrollReveal>
            ))}
          </div>
        </LayoutGroup>

        <LayoutGroup>
          <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
            {STAGES.map((stage) => (
              <div key={stage.id} className="snap-center shrink-0 w-[85vw] max-w-sm">
                <PhilosophyCard
                  stage={stage}
                  expanded={expandedId === stage.id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === stage.id ? null : stage.id))
                  }
                />
              </div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
