import { useState, useEffect } from "react";
import type { Conversation, Message } from "@/types";

const STORAGE_KEY = "techcorp_conversations";

function load(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(load);
  const [activeId, setActiveId] = useState<string | null>(
    () => load()[0]?.id ?? null
  );

  useEffect(() => {
    save(conversations);
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  function newConversation(): string {
    const id = crypto.randomUUID();
    const conv: Conversation = {
      id,
      title: "New conversation",
      messages: [],
      createdAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(id);
    return id;
  }

  function updateMessages(id: string, messages: Message[]) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const title =
          messages.find((m) => m.role === "user")?.content.slice(0, 40) ??
          c.title;
        return { ...c, messages, title };
      })
    );
  }

  function deleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((prev) => {
      if (prev !== id) return prev;
      const remaining = conversations.filter((c) => c.id !== id);
      return remaining[0]?.id ?? null;
    });
  }

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    newConversation,
    updateMessages,
    deleteConversation,
  };
}
