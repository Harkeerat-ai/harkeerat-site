import { createContext, useContext, useCallback, useState, useMemo } from "react";

type ChatContextValue = {
  isOpen: boolean;
  openChat: (origin?: { x: number; y: number }) => void;
  closeChat: () => void;
  clickOrigin: { x: number; y: number } | null;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(
    null
  );

  const openChat = useCallback((origin?: { x: number; y: number }) => {
    if (origin) setClickOrigin(origin);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, openChat, closeChat, clickOrigin }),
    [isOpen, openChat, closeChat, clickOrigin]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
