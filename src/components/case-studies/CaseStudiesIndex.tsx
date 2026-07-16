import { Link } from "react-router-dom";
import ScrollReveal from "../ui/ScrollReveal";
import { FOCUS_RING } from "../../lib/constants";

const FEATURED = [
  {
    slug: "robotic-arm",
    title: "Servo-Driven Robotic Arm",
    problem: "Precise multi-axis manipulation with real-time inverse kinematics on embedded hardware.",
    tags: ["hardware", "control", "embedded"],
    route: "/case-studies/robotic-arm",
  },
  {
    slug: "pong-ai",
    title: "OLED Pong Game (v2)",
    problem: "Full-featured embedded Pong on an STM32 with 125 FPS frame pacing, angle-deflection physics, and a CPU opponent.",
    tags: ["embedded", "c++", "game"],
    route: "/case-studies/pong-ai",
  },

];

const COMING_SOON = [
  "Autonomous Line Follower",
  "Gesture-Controlled Drone",
  "Smart Home IoT Hub",
];

function FeatureCard({
  title,
  problem,
  tags,
  route,
}: (typeof FEATURED)[number]) {
  return (
    <Link
      to={route}
      className={`group relative block overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary isolate ${FOCUS_RING}`}
    >
      {/* TODO: replace with real project diagram / exploded view */}
      <div className="aspect-[16/9] bg-bg-elevated overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-bg-elevated to-bg-secondary group-hover:scale-[1.04] transition-transform duration-300 ease-engineered" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/20 to-transparent group-hover:from-bg-primary/90 transition-colors duration-300" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-caption uppercase tracking-wide text-accent-cyan border border-accent-cyan/30 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-heading-2 text-text-primary mb-2">{title}</h3>
        <p className="text-body text-text-secondary mb-4 max-w-xl">{problem}</p>
        <span className="inline-flex items-center gap-2 text-body font-medium text-accent-electric">
          View Case Study
          <span className="inline-block transition-transform duration-300 ease-engineered group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function CaseStudiesIndex() {
  return (
    <section id="case-studies" className="py-16 md:py-32 lg:py-48 bg-bg-primary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-4">
            Case studies
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-12 md:mb-16">
            Deep dives into robotics and AI systems — from problem framing to deployed results.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-6 mb-12">
          {FEATURED.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.1}>
              <FeatureCard {...project} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <p className="text-caption uppercase tracking-wide text-text-secondary mb-6">
            In the pipeline
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMING_SOON.map((title) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-bg-secondary border border-border-subtle opacity-50 cursor-default"
                aria-label={`${title} — coming soon`}
              >
                <span className="text-caption uppercase tracking-wide text-text-secondary mb-2 block">
                  Coming soon
                </span>
                <p className="text-body text-text-secondary">{title}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
