import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: Props) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[#F2F2F7] dark:bg-[#1C1C1E] border-r border-black/8 dark:border-white/8">
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <span className="text-[22px] font-bold tracking-tight text-foreground">Messages</span>
        <button
          type="button"
          onClick={onNew}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title="Nouvelle conversation"
        >
          <Plus className="h-5 w-5 text-[#007AFF]" strokeWidth={2.5} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {conversations.length === 0 && (
          <p className="px-3 py-6 text-center text-[13px] text-[#8E8E93]">
            Aucune conversation
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors",
              conv.id === activeId
                ? "bg-white dark:bg-[#2C2C2E] shadow-sm"
                : "hover:bg-black/4 dark:hover:bg-white/4"
            )}
            onClick={() => onSelect(conv.id)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white text-[15px] font-semibold">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-foreground truncate leading-tight">
                Phi-3.5 Financial
              </p>
              <p className="text-[13px] text-[#8E8E93] truncate leading-tight">
                {conv.title === "New conversation" ? "Nouvelle conversation" : conv.title}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full hover:bg-[#FF3B30]/10 text-[#FF3B30] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </nav>

      <div className="border-t border-black/5 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
          <p className="text-[11px] text-[#8E8E93] font-medium">Phi-3.5-Financial · Ollama</p>
        </div>
      </div>
    </aside>
  );
}
