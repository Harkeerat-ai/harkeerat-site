import { Link } from "react-router-dom";
import { FOCUS_RING } from "../../lib/constants";

export type CaseStudyContent = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  research: string;
  hardware: string;
  software: string;
  ai: string;
  challenges: { challenge: string; solution: string }[];
  results: { value: string; label: string }[];
  lessons: string;
  future: string;
};

type CaseStudyLayoutProps = {
  content: CaseStudyContent;
};

export default function CaseStudyLayout({ content }: CaseStudyLayoutProps) {
  return (
    <article className="bg-bg-primary min-h-screen pt-24 pb-16 md:pb-32">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <Link
          to="/#case-studies"
          className={`inline-flex items-center gap-2 text-body text-text-secondary hover:text-accent-electric transition-colors mb-8 ${FOCUS_RING}`}
        >
          ← Back to case studies
        </Link>

        {/* Hero visual */}
        {/* TODO: replace with real exploded diagram / project hero image */}
        <div className="aspect-[21/9] rounded-xl bg-bg-secondary border border-border-subtle mb-8 md:mb-12" />

        <h1 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-4">
          {content.title}
        </h1>
        <p className="text-body-lg text-text-secondary max-w-3xl mb-12 md:mb-16">
          {content.summary}
        </p>

        {/* Problem | Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <div>
            <h2 className="text-caption uppercase tracking-wide text-accent-electric mb-4">
              Problem
            </h2>
            <p className="text-body-lg text-text-secondary">{content.problem}</p>
          </div>
          <div>
            <h2 className="text-caption uppercase tracking-wide text-accent-electric mb-4">
              Objective
            </h2>
            <p className="text-body-lg text-text-secondary">{content.objective}</p>
          </div>
        </div>

        {/* Research */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-heading-2 text-text-primary mb-6">
            Research & design decisions
          </h2>
          <p className="text-body text-text-secondary leading-relaxed whitespace-pre-line">
            {content.research}
          </p>
        </div>

        {/* Hardware | Software | AI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
          {[
            { label: "Hardware", text: content.hardware },
            { label: "Software", text: content.software },
            { label: "AI / Control", text: content.ai },
          ].map((col) => (
            <div
              key={col.label}
              className="p-6 rounded-xl bg-bg-secondary border border-border-subtle"
            >
              <h3 className="text-caption uppercase tracking-wide text-accent-cyan mb-4">
                {col.label}
              </h3>
              <p className="text-body text-text-secondary">{col.text}</p>
            </div>
          ))}
        </div>

        {/* Architecture diagram placeholder */}
        {/* TODO: replace with interactive SVG architecture diagram */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-heading-2 text-text-primary mb-6">
            Architecture
          </h2>
          <div className="aspect-[16/7] rounded-xl bg-bg-secondary border border-border-subtle flex items-center justify-center">
            <span className="text-caption uppercase tracking-wide text-text-secondary">
              System architecture diagram
            </span>
          </div>
        </div>

        {/* Challenges → Solutions */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-heading-2 text-text-primary mb-8">
            Challenges → Solutions
          </h2>
          <div className="flex flex-col gap-6">
            {content.challenges.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-xl bg-bg-secondary border border-border-subtle"
              >
                <div>
                  <span className="text-caption uppercase tracking-wide text-text-secondary block mb-2">
                    Challenge
                  </span>
                  <p className="text-body text-text-primary">{item.challenge}</p>
                </div>
                <div>
                  <span className="text-caption uppercase tracking-wide text-accent-electric block mb-2">
                    Solution
                  </span>
                  <p className="text-body text-text-secondary">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-heading-2 text-text-primary mb-8">Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.results.map((r) => (
              <div key={r.label} className="text-center">
                <div className="font-display text-heading-1 md:text-display-2 text-accent-electric tabular-nums">
                  {r.value}
                </div>
                <p className="mt-2 text-caption uppercase tracking-wide text-text-secondary">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons | Future */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-12 border-t border-border-subtle">
          <div>
            <h2 className="text-caption uppercase tracking-wide text-accent-electric mb-4">
              Lessons learned
            </h2>
            <p className="text-body text-text-secondary">{content.lessons}</p>
          </div>
          <div>
            <h2 className="text-caption uppercase tracking-wide text-accent-cyan mb-4">
              Future improvements
            </h2>
            <p className="text-body text-text-secondary">{content.future}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
