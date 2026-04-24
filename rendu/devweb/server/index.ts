import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";

const app = Fastify({
  logger: {
    transport: { target: "pino-pretty", options: { colorize: true } },
  },
});

await app.register(cors, { origin: true });

app.get("/api/ping", async () => ({ ok: true }));

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(`BFF ready → ${config.host}:${config.port}`);
  app.log.info(`Ollama → ${config.ollamaUrl}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
