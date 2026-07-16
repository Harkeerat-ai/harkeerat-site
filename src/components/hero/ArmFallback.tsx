import { motion } from "framer-motion";
import { COLORS } from "../../lib/tokens";

interface ArmFallbackProps {
  codeLines: string[];
  animate?: boolean; // false when prefers-reduced-motion is set
}

// A static/lightly-animated 2D line-art rendering of the same arm+panel
// concept, used on mobile (<768px), when prefers-reduced-motion is set, or
// when WebGL isn't available. Per design-system.md Section 7 this must not
// run R3F at all -- it's a genuinely separate, lightweight component, not
// the 3D scene rendered smaller.
// Code panel is on the right to match the desktop scene (clears left copy).
export default function ArmFallback({ codeLines, animate = true }: ArmFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-end pr-4 md:pr-16 pointer-events-none">
      <svg
        viewBox="0 0 400 260"
        className="w-full max-w-sm opacity-80"
        role="img"
        aria-label="Illustration of a robotic arm beside a panel of code, representing engineering and robotics"
      >
        {/* code panel — right side */}
        <rect x="190" y="30" width="195" height="200" rx="6" fill={COLORS.bgSecondary} opacity="0.7" />
        {codeLines.map((line, i) => (
          <text
            key={i}
            x="204"
            y={60 + i * 26}
            fill={COLORS.textSecondary}
            fontSize="11"
            fontFamily="ui-monospace, monospace"
          >
            {line}
          </text>
        ))}

        {/* base */}
        <circle cx="90" cy="220" r="10" fill={COLORS.textPrimary} />

        {/* upper arm */}
        <motion.line
          x1="90"
          y1="220"
          x2="140"
          y2="140"
          stroke={COLORS.textSecondary}
          strokeWidth="3"
          animate={
            animate
              ? { x2: [140, 150, 140], y2: [140, 130, 140] }
              : undefined
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="140" cy="140" r="7" fill={COLORS.textPrimary} />

        {/* forearm */}
        <motion.line
          x1="140"
          y1="140"
          x2="195"
          y2="90"
          stroke={COLORS.textSecondary}
          strokeWidth="3"
          animate={
            animate
              ? { x2: [195, 205, 195], y2: [90, 85, 90] }
              : undefined
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />

        {/* pen tip */}
        <motion.circle
          cx="195"
          cy="90"
          r="5"
          fill={COLORS.accentCyan}
          animate={animate ? { opacity: [1, 0.6, 1] } : undefined}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
