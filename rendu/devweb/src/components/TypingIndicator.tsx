export function TypingIndicator() {
  return (
    <div className="flex items-center gap-[3px] px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce" />
    </div>
  );
}
