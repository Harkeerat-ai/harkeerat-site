import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { usePrefersReducedMotion } from "../../lib/useResponsive";

type StatCounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [isInView, value, prefersReducedMotion, count]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-heading-1 md:text-display-2 text-text-primary tabular-nums">
        <motion.span>{rounded}</motion.span>
        {suffix && <span className="text-accent-electric">{suffix}</span>}
      </div>
      <p className="mt-2 text-caption uppercase tracking-wide text-text-secondary">
        {label}
      </p>
    </div>
  );
}
