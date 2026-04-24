import { useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types";

export default function App() {
  const {
    conversations,
    active,
    activeId,
    setActiveId,
    newConversation,
    updateMessages,
    deleteConversation,
  } = useConversations();

  const handleMessagesChange = useCallback(
    (msgs: Message[]) => {
      if (activeId) updateMessages(activeId, msgs);
    },
    [activeId, updateMessages]
  );

  const { messages, isLoading, error, sendMessage, stopGeneration, resetMessages } =
    useChat(activeId, active?.messages ?? [], handleMessagesChange);

  useEffect(() => {
    resetMessages(active?.messages ?? []);
  }, [activeId]);

  function handleNew() {
    const id = newConversation();
    setActiveId(id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onDelete={deleteConversation}
      />
      <main className="flex flex-1 overflow-hidden">
        {activeId ? (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSend={sendMessage}
            onStop={stopGeneration}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">
              Créez une conversation pour commencer
            </p>
            <button
              type="button"
              onClick={handleNew}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Nouvelle conversation
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
