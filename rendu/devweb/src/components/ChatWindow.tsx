import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import type { Message } from "@/types";
import { TrendingUp } from "lucide-react";

interface Props {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
}

export function ChatWindow({ messages, isLoading, error, onSend, onStop }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center gap-2 border-b px-6 py-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Financial Assistant</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-base font-medium">Comment puis-je vous aider ?</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Posez une question sur la finance, les marchés ou l'analyse économique.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <ChatInput onSend={onSend} onStop={onStop} isLoading={isLoading} />
    </div>
  );
}
