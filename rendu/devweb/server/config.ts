export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? "127.0.0.1",
  ollamaUrl: process.env.OLLAMA_URL ?? "https://ollama.velha-tech.fr",
  defaultModel: process.env.OLLAMA_MODEL ?? "phi3-financial-optimized",
  bearerToken: process.env.OLLAMA_TOKEN ?? "71403b24d2377b21c6a235100701601b74a27dca538f389d91b8bc86c86bcb52",
};
