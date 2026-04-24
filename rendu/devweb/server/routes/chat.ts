import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

type ChatBody = {
    model?: string;
    messages: ChatMessage[];
};

export async function chatRoutes(app: FastifyInstance) {
    app.post<{ Body: ChatBody }>("/api/chat", async (request, reply) => {
        const { model = config.defaultModel, messages } = request.body;

        try {
            const upstream = await fetch(`${config.ollamaUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, messages, stream: true }),
            });

            if (!upstream.ok || !upstream.body) {
                reply.code(502);
                return { error: `Ollama returned ${upstream.status}` };
            }

            reply.header("Content-Type", "application/x-ndjson");
            return reply.send(upstream.body);
        } catch (error) {
            reply.code(502);
            return { error: error instanceof Error ? error.message : "Upstream chat failed" };
        }
    });
}
