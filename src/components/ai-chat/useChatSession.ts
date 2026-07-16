import { useState, useCallback, useRef } from "react";
import { CHATBOT_API_URL, CHATBOT_BRAND } from "../../lib/chatbotConfig";

export type ChatCitation = {
  source_name: string;
  snippet: string;
};

export type ChatUrl = {
  url?: string;
  title?: string;
  [key: string]: unknown;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Backend message_id — used for feedback and suggestions */
  messageId?: number;
  citations?: ChatCitation[];
  sourceNames?: string[];
  urls?: ChatUrl[];
  suggestions?: string[];
  feedbackRating?: 1 | -1;
};

/** Matches chatbotllm ChatResponse schema */
type ChatResponsePayload = {
  brand?: string;
  session_id?: string;
  answer?: string;
  message_id?: number;
  sources?: string[];
  citations?: ChatCitation[];
  urls?: ChatUrl[];
  latency_ms?: number;
};

function getSessionId(): string {
  const key = "harkeerat_chat_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function parseChatResponse(data: unknown): {
  content: string;
  messageId?: number;
  citations?: ChatCitation[];
  sourceNames?: string[];
  urls?: ChatUrl[];
} {
  if (!data || typeof data !== "object") {
    return { content: "Sorry, I received an unexpected response." };
  }

  const obj = data as ChatResponsePayload;
  const content = typeof obj.answer === "string" ? obj.answer : "";

  const citations = Array.isArray(obj.citations)
    ? obj.citations.filter(
        (c): c is ChatCitation =>
          !!c && typeof c.source_name === "string"
      )
    : undefined;

  const sourceNames = Array.isArray(obj.sources)
    ? obj.sources.filter((s): s is string => typeof s === "string")
    : undefined;

  const urls = Array.isArray(obj.urls) ? obj.urls : undefined;

  return {
    content,
    messageId: typeof obj.message_id === "number" ? obj.message_id : undefined,
    citations,
    sourceNames,
    urls,
  };
}

function chatErrorMessage(err: unknown, status?: number): string {
  if (status === 404) {
    return "Brand not found — ensure the harkeerat brand is seeded on the backend.";
  }
  if (status === 429) {
    return "Too many requests — try again in a moment.";
  }
  if (err instanceof TypeError) {
    return "AI backend unreachable — check that the server is running.";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

async function fetchSuggestions(messageId: number): Promise<string[]> {
  try {
    const res = await fetch(
      `${CHATBOT_API_URL}/api/${CHATBOT_BRAND}/suggestions/${messageId}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions?: string[] };
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch {
    return [];
  }
}

export function useChatSession() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef(getSessionId());

  const updateMessage = useCallback(
    (clientId: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === clientId ? { ...m, ...patch } : m))
      );
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${CHATBOT_API_URL}/api/${CHATBOT_BRAND}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionIdRef.current,
              message: trimmed,
              top_k: 5,
            }),
          }
        );

        if (!res.ok) {
          throw Object.assign(new Error(chatErrorMessage(null, res.status)), {
            status: res.status,
          });
        }

        const data: unknown = await res.json();
        const parsed = parseChatResponse(data);
        const clientId = crypto.randomUUID();

        const assistantMsg: ChatMessage = {
          id: clientId,
          role: "assistant",
          content: parsed.content || "I don't have an answer for that yet.",
          messageId: parsed.messageId,
          citations: parsed.citations,
          sourceNames: parsed.sourceNames,
          urls: parsed.urls,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (parsed.messageId) {
          const suggestions = await fetchSuggestions(parsed.messageId);
          if (suggestions.length > 0) {
            updateMessage(clientId, { suggestions });
          }
        }
      } catch (err) {
        const status =
          err && typeof err === "object" && "status" in err
            ? (err as { status: number }).status
            : undefined;
        setError(chatErrorMessage(err, status));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, updateMessage]
  );

  const submitFeedback = useCallback(
    async (clientMessageId: string, messageId: number, rating: 1 | -1) => {
      updateMessage(clientMessageId, { feedbackRating: rating });

      try {
        await fetch(`${CHATBOT_API_URL}/api/${CHATBOT_BRAND}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message_id: messageId,
            rating,
            session_id: sessionIdRef.current,
            feedback_text: "",
          }),
        });
      } catch {
        // Feedback is best-effort — UI already shows selection
      }
    },
    [updateMessage]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    submitFeedback,
  };
}
