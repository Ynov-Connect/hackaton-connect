import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed",
          isUser
            ? "bg-[#007AFF] text-white rounded-[20px] rounded-br-[5px]"
            : "bg-white dark:bg-[#1C1C1E] text-foreground rounded-[20px] rounded-bl-[5px] shadow-sm border border-black/5"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed prose-ul:my-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || "…"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
