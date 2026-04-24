import { useRef, useState, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";
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
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
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

  const canSend = value.trim().length > 0;

  return (
    <div className="px-4 py-3 bg-background/80 backdrop-blur-xl border-t border-black/5">
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end gap-2 bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-[22px] px-4 py-2 shadow-sm">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="iMessage"
            className="flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-[#8E8E93] leading-relaxed max-h-[120px]"
          />
        </div>
        <button
          type="button"
          onClick={isLoading ? onStop : submit}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-150",
            isLoading
              ? "bg-[#007AFF] text-white"
              : canSend
              ? "bg-[#007AFF] text-white active:scale-95"
              : "bg-[#E5E5EA] dark:bg-[#2C2C2E] text-[#8E8E93] cursor-not-allowed"
          )}
        >
          {isLoading
            ? <Square className="h-3.5 w-3.5 fill-white" />
            : <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          }
        </button>
      </div>
    </div>
  );
}
