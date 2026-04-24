import { Plus, Trash2, MessageSquare, TrendingUp } from "lucide-react";
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
    <aside className="flex h-full w-64 shrink-0 flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TrendingUp className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">TechCorp AI</span>
        <button
          type="button"
          onClick={onNew}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          title="Nouvelle conversation"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-1">
        <p className="px-2 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
          Conversations
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-2">
        {conversations.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Aucune conversation
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors mt-0.5",
              conv.id === activeId
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm border border-zinc-200 dark:border-zinc-700"
                : "text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 hover:text-foreground"
            )}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{conv.title}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="hidden group-hover:flex h-5 w-5 items-center justify-center rounded hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <p className="text-[11px] text-zinc-400">Phi-3.5-Financial · Ollama</p>
        </div>
      </div>
    </aside>
  );
}
