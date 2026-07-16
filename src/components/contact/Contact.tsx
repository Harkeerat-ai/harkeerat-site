import ScrollReveal from "../ui/ScrollReveal";
import { useChat } from "../ai-chat/ChatContext";
import { FOCUS_RING } from "../../lib/constants";

const LINKS = [
  {
    label: "Email",
    href: "mailto:harkeerat@example.com", // TODO: replace with real email
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/harkeerat-bhasin", // TODO: replace with real profile URL
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/Harkeerat-ai",
    external: true,
  },

];

export default function Contact() {
  const { openChat } = useChat();

  return (
    <section id="contact" className="py-16 md:py-32 lg:py-48 bg-bg-primary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-6">
            Let's build something.
          </h2>
          <p className="text-body-lg text-text-secondary max-w-xl mb-10">
            Open to collaborations, internships, and conversations about robotics and AI.
            For quick questions, my AI assistant knows my projects and background.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-6 mb-10">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-body-lg text-text-primary hover:text-accent-electric transition-colors duration-150 underline-offset-4 hover:underline ${FOCUS_RING}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              openChat({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            className={`text-body text-text-secondary hover:text-accent-cyan transition-colors duration-150 ${FOCUS_RING}`}
          >
            Or ask my AI assistant →
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
