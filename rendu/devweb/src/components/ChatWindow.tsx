import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
}

const SUGGESTIONS = [
  "Qu'est-ce que le ratio P/E ?",
  "Comment fonctionne la diversification ?",
  "Explique-moi les obligations d'État",
  "Quelle est la différence entre action et ETF ?",
];

export function ChatWindow({ messages, isLoading, error, onSend, onStop }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#F2F2F7] dark:bg-[#000000]">
      <header className="flex items-center justify-center gap-2 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl px-6 py-3">
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007AFF] text-white text-lg font-semibold mb-0.5">
            AI
          </div>
          <span className="text-[13px] font-medium text-foreground">Phi-3.5 Financial</span>
          <span className="text-[11px] text-[#34C759]">● En ligne</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#007AFF] text-white text-2xl font-semibold shadow-lg shadow-blue-500/30">
              AI
            </div>
            <div>
              <p className="text-[17px] font-semibold text-foreground">Phi-3.5 Financial</p>
              <p className="mt-1 text-[13px] text-[#8E8E93] max-w-xs">
                Posez une question sur la finance, les marchés ou la gestion de patrimoine.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSend(s)}
                  className="rounded-full bg-white dark:bg-[#1C1C1E] border border-black/8 dark:border-white/10 px-4 py-2 text-[13px] text-[#007AFF] font-medium shadow-sm active:scale-95 transition-transform"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-1.5">
              {messages.map((msg, i) => {
                const prevRole = i > 0 ? messages[i - 1].role : null;
                const showGap = prevRole !== null && prevRole !== msg.role;
                return (
                  <div key={msg.id} className={showGap ? "mt-3" : ""}>
                    <MessageBubble message={msg} />
                  </div>
                );
              })}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start mt-1">
                  <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] rounded-bl-[5px] shadow-sm border border-black/5">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-1 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-4 py-2 text-[13px] text-[#FF3B30] text-center">
          {error}
        </div>
      )}

      <ChatInput onSend={onSend} onStop={onStop} isLoading={isLoading} />
    </div>
  );
}
