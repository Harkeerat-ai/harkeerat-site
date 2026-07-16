import ScrollReveal from "../ui/ScrollReveal";
import { FOCUS_RING } from "../../lib/constants";

const INTERESTS = [
  "AI Robotics",
  "Industrial Automation",
  "Healthcare Robotics",
  "Human-Robot Collaboration",
  "Autonomous Systems",
  "Intelligent Embedded Devices",
];

export default function Vision() {
  return (
    <section id="vision" className="py-16 md:py-32 lg:py-48 bg-bg-secondary">
      <div className="max-w-content mx-auto px-6 md:px-20 text-center">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-8 md:mb-12 max-w-4xl mx-auto">
            Building the next generation of machines that understand, adapt, and collaborate.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {INTERESTS.map((interest) => (
              <span
                key={interest}
                className={`px-4 py-2 rounded-full bg-bg-primary border border-border-subtle text-body text-text-secondary hover:border-accent-electric/40 transition-colors duration-300 cursor-default ${FOCUS_RING}`}
              >
                {interest}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
