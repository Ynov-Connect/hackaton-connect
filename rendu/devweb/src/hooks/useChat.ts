import { useState, useRef, useCallback } from "react";
import type { Message } from "@/types";
import { streamChat } from "@/services/ollamaClient";

export function useChat(
  conversationId: string | null,
  initialMessages: Message[],
  onMessagesChange: (messages: Message[]) => void
) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const syncMessages = useCallback(
    (msgs: Message[]) => {
      setMessages(msgs);
      if (conversationId) onMessagesChange(msgs);
    },
    [conversationId, onMessagesChange]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        createdAt: Date.now(),
      };

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      };

      const nextMessages = [...messages, userMsg, assistantMsg];
      syncMessages(nextMessages);
      setIsLoading(true);

      abortRef.current = new AbortController();

      try {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let accumulated = "";

        await streamChat(
          history,
          (token) => {
            accumulated += token;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id ? { ...m, content: accumulated } : m
              )
            );
          },
          abortRef.current.signal
        );

        const final = nextMessages.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: accumulated } : m
        );
        syncMessages(final);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Impossible de joindre Ollama. Vérifiez que le serveur tourne.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading, syncMessages]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const resetMessages = useCallback(
    (msgs: Message[]) => {
      setMessages(msgs);
    },
    []
  );

  return { messages, isLoading, error, sendMessage, stopGeneration, resetMessages };
}
