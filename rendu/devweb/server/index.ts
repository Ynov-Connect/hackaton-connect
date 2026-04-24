import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { modelsRoutes } from "./routes/models.js";
import { chatRoutes } from "./routes/chat.js";


const app = Fastify({
  logger: {
    transport: { target: "pino-pretty", options: { colorize: true } },
  },
});

await app.register(cors, { origin: true });
await app.register(healthRoutes);
await app.register(modelsRoutes);
await app.register(chatRoutes);

app.get("/api/ping", async () => ({ ok: true }));

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(`BFF ready → ${config.host}:${config.port}`);
  app.log.info(`Ollama → ${config.ollamaUrl}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
