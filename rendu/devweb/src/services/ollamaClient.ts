export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function streamChat(
  messages: OllamaMessage[],
  onToken: (token: string) => void,
  signal: AbortSignal
): Promise<void> {
  const token = import.meta.env.VITE_API_TOKEN;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
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
