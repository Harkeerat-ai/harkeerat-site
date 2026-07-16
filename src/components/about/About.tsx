import ScrollReveal from "../ui/ScrollReveal";
import StatCounter from "./StatCounter";

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Curiosity first",
    description: "Every build starts with a question worth answering.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Systems thinking",
    description: "Hardware, software, and intelligence as one integrated loop.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 12h16M12 4v16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "Iterate relentlessly",
    description: "Ship, measure, refine — progress beats perfection.",
  },
];

const STATS = [
  { value: 14, label: "Projects" },
  { value: 2, label: "Competitions" },
  { value: 10, label: "Certifications" },
  { value: 7, label: "Years of learning" },
];

export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 lg:py-48 bg-bg-primary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <p className="text-caption uppercase tracking-wide text-accent-electric mb-3">
            About Me
          </p>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-12 md:mb-16">
            Who I am
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* TODO: replace with real desaturated/graphite-toned portrait photo */}
          <ScrollReveal>
            <div
              className="aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-xl bg-bg-secondary border border-border-subtle flex flex-col items-center justify-center gap-3 p-8"
              aria-label="Portrait placeholder — replace with your photo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                className="w-12 h-12 text-text-secondary"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
              </svg>
              <p className="text-caption uppercase tracking-wide text-text-secondary text-center">
                Your photo here
              </p>
              <p className="text-caption normal-case tracking-normal text-text-secondary/70 text-center max-w-[12rem]">
                Replace this block with a portrait image
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-10">
            <ScrollReveal delay={0.1}>
              <p className="text-heading-1 font-display text-text-primary leading-tight">
                I build because I love creating things that work — from the
                first line of code to the moment a robot actually moves. The
                gap between what machines can do and what people need them to
                do is the most exciting engineering problem I know.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div>
                <h3 className="text-caption uppercase tracking-wide text-accent-electric mb-4">
                  Bio
                </h3>
                <div className="space-y-4 text-body-lg text-text-secondary">
                  <p>
                    Harkeerat Bhasin is a second-year Computer Science student
                    who builds at the intersection of robotics, embedded
                    systems, and artificial intelligence. What started with
                    tinkering on microcontrollers has grown into projects
                    spanning robotic manipulation, real-time game physics, and
                    full-stack AI systems.
                  </p>
                  <p>
                    Outside the lab you will find him on the basketball court,
                    coding late into the night with a coffee in hand, or
                    volunteering in community service initiatives. He believes
                    the best engineering happens when diverse interests
                    collide — whether that is applying control theory from
                    robotics to game physics, or bringing the same iteration
                    mindset from sports practice to software development.
                  </p>
                  <p>
                    Driven by curiosity and powered by caffeine, he treats
                    every project as a laboratory where technology meets
                    purpose. His goal: build intelligent machines that solve
                    real problems.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div>
                <h3 className="text-caption uppercase tracking-wide text-accent-cyan mb-4">
                  Core values
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {VALUES.map((v) => (
                    <div
                      key={v.title}
                      className="p-4 rounded-lg bg-bg-secondary border border-border-subtle"
                    >
                      <div className="text-accent-cyan mb-3">{v.icon}</div>
                      <h4 className="text-body font-medium text-text-primary mb-1">
                        {v.title}
                      </h4>
                      <p className="text-caption text-text-secondary normal-case tracking-normal">
                        {v.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h3 className="text-caption uppercase tracking-wide text-accent-electric mb-3">
                  Engineering philosophy
                </h3>
                <p className="text-body-lg text-text-secondary">
                  Every project is a laboratory — blend hardware, software, and
                  intelligence into one integrated loop. Ship fast, measure
                  honestly, and iterate relentlessly. Progress always beats
                  perfection.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={0.25} className="mt-16 md:mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 border-t border-border-subtle">
            {STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
