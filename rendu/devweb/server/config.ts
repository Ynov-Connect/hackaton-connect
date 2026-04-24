export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? "127.0.0.1",
  ollamaUrl: process.env.OLLAMA_URL ?? "https://ollama.velha-tech.fr",
  defaultModel: process.env.OLLAMA_MODEL ?? "phi3-financial-optimized",
};
