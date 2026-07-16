import ScrollReveal from "../ui/ScrollReveal";

const CREDENTIALS = [
  {
    org: "EduPrime Robotics",
    title: "Level 3 Robotics Certification",
    date: "2024",
    initials: "EP",
    color: "#2E6FFF",
  },
  {
    org: "FIRST Robotics Competition",
    title: "Regional Finalist — Team 5823",
    date: "2023",
    initials: "FR",
    color: "#5FE0E0",
  },
  {
    org: "Coursera / Stanford Online",
    title: "Machine Learning Specialization",
    date: "2024",
    initials: "ML",
    color: "#2E6FFF",
  },
  {
    org: "Hack the North",
    title: "Top 10 Finalist — Autonomous Systems Track",
    date: "2024",
    initials: "HT",
    color: "#5FE0E0",
  },
  {
    org: "AWS Educate",
    title: "Cloud Practitioner Certificate",
    date: "2023",
    initials: "AW",
    color: "#2E6FFF",
  },
  {
    org: "University CS Department",
    title: "Dean's List — Academic Excellence",
    date: "2024",
    initials: "DL",
    color: "#5FE0E0",
  },
];

export default function ProofOfExcellence() {
  return (
    <section id="proof" className="py-16 md:py-32 lg:py-48 bg-bg-primary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-4">
            Proof of excellence
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-12 md:mb-16">
            Verifiable achievements from competitions, certifications, and academic recognition.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CREDENTIALS.map((cred, i) => (
            <ScrollReveal key={cred.title} delay={i * 0.05}>
              <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-caption font-medium text-text-primary"
                    style={{ backgroundColor: `${cred.color}22`, color: cred.color }}
                    aria-hidden="true"
                  >
                    {cred.initials}
                  </div>
                  <div>
                    <p className="text-caption uppercase tracking-wide text-text-secondary mb-1">
                      {cred.org}
                    </p>
                    <h3 className="text-body font-medium text-text-primary mb-1">
                      {cred.title}
                    </h3>
                    <p className="text-caption text-text-secondary normal-case tracking-normal">
                      {cred.date}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
