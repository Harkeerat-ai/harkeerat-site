import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./ChatContext";
import { useChatSession, type ChatMessage } from "./useChatSession";
import { FOCUS_RING, EASE_ENGINEERED } from "../../lib/constants";
import { useIsMobile, usePrefersReducedMotion } from "../../lib/useResponsive";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-accent-cyan"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function AssistantMessage({
  msg,
  onFeedback,
  onSuggestionClick,
  isLoading,
}: {
  msg: ChatMessage;
  onFeedback: (rating: 1 | -1) => void;
  onSuggestionClick: (text: string) => void;
  isLoading: boolean;
}) {
  const hasCitations = msg.citations && msg.citations.length > 0;
  const hasSourceNames =
    msg.sourceNames && msg.sourceNames.length > 0 && !hasCitations;

  return (
    <div className="flex justify-start">
      <div
        className="max-w-[85%] rounded-xl px-4 py-3 text-body bg-bg-secondary text-text-primary border border-border-subtle"
        aria-live="polite"
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {(hasCitations || hasSourceNames) && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-caption uppercase tracking-wide text-text-secondary mb-2">
              Sources
            </p>
            <ul className="space-y-2">
              {msg.citations?.map((c, i) => (
                <li key={i} className="text-caption normal-case tracking-normal">
                  <span className="text-accent-cyan font-medium">{c.source_name}</span>
                  {c.snippet && (
                    <p className="text-text-secondary mt-0.5 line-clamp-2">{c.snippet}</p>
                  )}
                </li>
              ))}
              {hasSourceNames &&
                msg.sourceNames!.map((name, i) => (
                  <li key={i} className="text-caption normal-case tracking-normal text-accent-cyan">
                    {name}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {msg.urls && msg.urls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-caption uppercase tracking-wide text-text-secondary mb-2">
              Links
            </p>
            <ul className="space-y-1">
              {msg.urls.map((u, i) =>
                u.url ? (
                  <li key={i}>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-caption normal-case tracking-normal text-accent-electric hover:underline ${FOCUS_RING}`}
                    >
                      {typeof u.title === "string" ? u.title : u.url}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {msg.messageId && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onFeedback(1)}
              disabled={msg.feedbackRating !== undefined}
              aria-label="Helpful"
              className={`px-2 py-1 rounded-md text-caption normal-case tracking-normal transition-colors ${
                msg.feedbackRating === 1
                  ? "text-accent-cyan bg-accent-cyan/10"
                  : "text-text-secondary hover:text-text-primary"
              } disabled:opacity-60 ${FOCUS_RING}`}
            >
              Helpful
            </button>
            <button
              type="button"
              onClick={() => onFeedback(-1)}
              disabled={msg.feedbackRating !== undefined}
              aria-label="Not helpful"
              className={`px-2 py-1 rounded-md text-caption normal-case tracking-normal transition-colors ${
                msg.feedbackRating === -1
                  ? "text-accent-cyan bg-accent-cyan/10"
                  : "text-text-secondary hover:text-text-primary"
              } disabled:opacity-60 ${FOCUS_RING}`}
            >
              Not helpful
            </button>
          </div>
        )}

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick(s)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-full text-caption normal-case tracking-normal border border-border-subtle text-text-secondary hover:border-accent-electric/40 hover:text-text-primary transition-colors disabled:opacity-50 ${FOCUS_RING}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatPanel() {
  const { isOpen, closeChat, clickOrigin } = useChat();
  const { messages, isLoading, error, sendMessage, submitFeedback } = useChatSession();
  const [input, setInput] = useState("");
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);

    const panel = panelRef.current;
    if (!panel) return () => window.removeEventListener("keydown", onKey);

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onTab);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onTab);
    };
  }, [isOpen, closeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const originStyle = clickOrigin
    ? { transformOrigin: `${clickOrigin.x}px ${clickOrigin.y}px` }
    : { transformOrigin: "bottom right" };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bg-primary/60 backdrop-blur-sm"
            onClick={closeChat}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="AI assistant chat"
            aria-modal="true"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.92 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE_ENGINEERED }}
            style={originStyle}
            className={
              isMobile
                ? "fixed inset-0 z-[70] flex flex-col bg-bg-elevated"
                : "fixed bottom-24 right-6 z-[70] w-[400px] max-h-[560px] flex flex-col rounded-2xl border border-border-subtle bg-bg-elevated/95 backdrop-blur-md shadow-2xl overflow-hidden"
            }
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div>
                <h2 className="text-body font-medium text-text-primary">Meet My AI</h2>
                <p className="text-caption text-text-secondary normal-case tracking-normal">
                  Powered by my Agentic RAG platform — ask about projects, skills, and background
                </p>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className={`p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors ${FOCUS_RING}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <p className="text-body text-text-secondary">
                  Hi! I'm Harkeerat's AI assistant. Ask me about robotics projects, AI work, or my engineering background.
                </p>
              )}
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-xl px-4 py-3 text-body bg-accent-electric text-text-primary">
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <AssistantMessage
                    key={msg.id}
                    msg={msg}
                    isLoading={isLoading}
                    onFeedback={(rating) => {
                      if (msg.messageId) submitFeedback(msg.id, msg.messageId, rating);
                    }}
                    onSuggestionClick={sendMessage}
                  />
                )
              )}
              {isLoading && <TypingIndicator />}
              {error && (
                <p className="text-body text-red-400" role="alert">
                  {error}
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border-subtle">
              <form onSubmit={handleSubmit} className="px-5 py-4 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg bg-bg-primary border border-border-subtle text-body text-text-primary placeholder:text-text-secondary ${FOCUS_RING}`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`px-4 py-2.5 rounded-lg bg-accent-electric text-text-primary text-body font-medium disabled:opacity-50 hover:brightness-110 transition-all ${FOCUS_RING}`}
                >
                  Send
                </button>
              </form>
              <p className="px-5 pb-3 text-caption normal-case tracking-normal text-text-secondary">
                AI assistant with retrieval-augmented generation
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatTriggerFAB() {
  const { isOpen, openChat } = useChat();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (isOpen) return null;

  return (
    <motion.button
      id="ai-chat-trigger-fab"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        openChat({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label="Open AI assistant"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-bg-elevated/90 backdrop-blur-md border border-border-subtle flex items-center justify-center text-accent-cyan hover:border-accent-cyan/50 transition-colors ${FOCUS_RING}`}
      animate={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: [
                "0 0 0 0 rgba(95, 224, 224, 0)",
                "0 0 20px 4px rgba(95, 224, 224, 0.25)",
                "0 0 0 0 rgba(95, 224, 224, 0)",
              ],
            }
      }
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

export default function MeetMyAI() {
  return (
    <>
      <ChatTriggerFAB />
      <ChatPanel />
    </>
  );
}
