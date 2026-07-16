import { motion } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";
import { useChat } from "../ai-chat/ChatContext";
import { FOCUS_RING } from "../../lib/constants";
import { usePrefersReducedMotion } from "../../lib/useResponsive";

const CAPABILITIES = [
  {
    id: "rag",
    title: "RAG Pipelines",
    description: "Retrieval-augmented generation systems that ground LLM responses in verified knowledge bases.",
    Visual: RAGVisual,
  },
  {
    id: "chatbots",
    title: "LLM Chatbots",
    description:
      "Session-aware RAG chatbots with memory and source citations — try mine via the chat button below.",
    Visual: ChatbotVisual,
  },
  {
    id: "automation",
    title: "Automation",
    description: "Workflow orchestration that connects AI decisions to real actions — APIs, scripts, and triggers.",
    Visual: AutomationVisual,
  },
  {
    id: "prompt",
    title: "Prompt Engineering",
    description: "Structured prompt design with evaluation loops — not guesswork, but measurable iteration.",
    Visual: PromptVisual,
  },
  {
    id: "vector",
    title: "Vector Databases",
    description: "Embedding storage and similarity search with ChromaDB, Pinecone, and custom indexing strategies.",
    Visual: VectorVisual,
  },
  {
    id: "embeddings",
    title: "Embeddings",
    description: "Document chunking, embedding model selection, and semantic search tuned for retrieval quality.",
    Visual: EmbeddingsVisual,
  },
];

function RAGVisual() {
  const reduced = usePrefersReducedMotion();
  const steps = ["Query", "Retrieve", "Augment", "Generate"];
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      {steps.map((label, i) => (
        <g key={label}>
          <motion.rect
            x={i * 50 + 4}
            y="12"
            width="42"
            height="16"
            rx="3"
            fill="none"
            stroke="#5FE0E0"
            strokeWidth="1"
            animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
          />
          <text x={i * 50 + 25} y="23" textAnchor="middle" fill="#8A8F98" fontSize="7">
            {label}
          </text>
          {i < 3 && (
            <motion.line
              x1={i * 50 + 46}
              y1="20"
              x2={i * 50 + 54}
              y2="20"
              stroke="#2E6FFF"
              strokeWidth="1"
              animate={reduced ? {} : { opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 + 0.3 }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function ChatbotVisual() {
  const reduced = usePrefersReducedMotion();
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={20 + i * 55}
          y={8 + (i % 2) * 8}
          width="40"
          height="12"
          rx="6"
          fill="none"
          stroke="#5FE0E0"
          strokeWidth="1"
          animate={reduced ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          style={{ transformOrigin: `${40 + i * 55}px 14px` }}
        />
      ))}
    </svg>
  );
}

function AutomationVisual() {
  const reduced = usePrefersReducedMotion();
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      <circle cx="30" cy="20" r="6" fill="none" stroke="#5FE0E0" strokeWidth="1" />
      <circle cx="100" cy="20" r="6" fill="none" stroke="#2E6FFF" strokeWidth="1" />
      <circle cx="170" cy="20" r="6" fill="none" stroke="#5FE0E0" strokeWidth="1" />
      <motion.circle
        r="3"
        fill="#2E6FFF"
        animate={reduced ? { cx: 100 } : { cx: [30, 100, 170, 100] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        cy="20"
      />
    </svg>
  );
}

function PromptVisual() {
  const reduced = usePrefersReducedMotion();
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="20"
          y1={10 + i * 7}
          x2={60 + i * 25}
          y2={10 + i * 7}
          stroke="#5FE0E0"
          strokeWidth="1"
          animate={reduced ? {} : { x2: [60 + i * 25, 80 + i * 25, 60 + i * 25] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function VectorVisual() {
  const reduced = usePrefersReducedMotion();
  const dots = [
    [40, 15], [70, 28], [100, 12], [130, 25], [160, 18],
  ];
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      {dots.map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="#5FE0E0"
          animate={reduced ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <motion.line
        x1="100"
        y1="12"
        x2="130"
        y2="25"
        stroke="#2E6FFF"
        strokeWidth="1"
        strokeDasharray="3 2"
        animate={reduced ? {} : { opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

function EmbeddingsVisual() {
  const reduced = usePrefersReducedMotion();
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.rect
          key={i}
          x={20 + i * 20}
          y="10"
          width="8"
          height="20"
          rx="1"
          fill="#5FE0E0"
          animate={reduced ? { height: 20, y: 10 } : { height: [8, 20, 12], y: [16, 10, 14] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

export default function AICapabilities() {
  const { openChat } = useChat();

  const handleTalkWithAI = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    openChat({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <section id="ai" className="py-16 md:py-32 lg:py-48 bg-bg-secondary">
      <div className="max-w-content mx-auto px-6 md:px-20">
        <ScrollReveal>
          <h2 className="font-display text-heading-1 md:text-display-2 text-text-primary mb-4">
            Artificial intelligence
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-12 md:mb-16">
            Engineering capabilities I apply to robotics, automation, and intelligent systems.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 md:mb-16">
          {CAPABILITIES.map((cap, i) => (
            <ScrollReveal key={cap.id} delay={i * 0.06}>
              <div className="p-6 rounded-xl bg-bg-primary border border-border-subtle h-full">
                <cap.Visual />
                <h3 className="font-display text-heading-2 text-text-primary mt-4 mb-2">
                  {cap.title}
                </h3>
                <p className="text-body text-text-secondary">{cap.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <button
            id="ai-chat-trigger"
            onClick={handleTalkWithAI}
            className={`px-6 py-3 rounded-lg bg-accent-electric text-text-primary text-body font-medium hover:brightness-110 transition-all duration-150 ${FOCUS_RING}`}
          >
            Talk With My AI
          </button>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-8">
          <p className="text-body text-text-secondary max-w-2xl">
            Try my AI assistant live via the chat button above — it knows my projects, skills, and background.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
