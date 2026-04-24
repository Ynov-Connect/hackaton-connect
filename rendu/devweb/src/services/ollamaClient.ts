const BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL ?? "http://localhost:11434";
const MODEL = import.meta.env.VITE_MODEL_NAME ?? "phi3_financial";

export interface OllamaMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamChat(
  messages: OllamaMessage[],
  onToken: (token: string) => void,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.message?.content) onToken(json.message.content);
      } catch {
        // ignore malformed chunks
      }
    }
  }
}
