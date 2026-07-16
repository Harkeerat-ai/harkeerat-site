import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../../lib/useResponsive";
import { EASE_ENGINEERED } from "../../lib/constants";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_ENGINEERED,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
