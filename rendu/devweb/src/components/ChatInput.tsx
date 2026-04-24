import { useRef, useState, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (content: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="border-t bg-background px-6 py-4">
      <div className="flex items-end gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question financière…"
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={isLoading ? onStop : submit}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
            isLoading
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : value.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
        Entrée pour envoyer · Maj+Entrée pour sauter une ligne
      </p>
    </div>
  );
}
