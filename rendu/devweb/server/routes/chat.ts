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
        // On utilise le modèle par défaut si aucun n'est spécifié
        const { model = config.defaultModel, messages } = request.body;

        try {
            // On envoie la requête au endpoint de chat d'Ollama en mode streaming
            const upstream = await fetch(`${config.ollamaUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.bearerToken}`,
                },
                body: JSON.stringify({ model, messages, stream: true }),
            });

            // Si Ollama retourne une erreur ou n'inclut pas de body, on renvoie une erreur 502
            if (!upstream.ok || !upstream.body) {
                reply.code(502);
                return { error: `Ollama returned ${upstream.status}` };
            }

            // On envoie le stream de réponse d'Ollama direct au front, en s'assurant de bien définir le content-type
            reply.header("Content-Type", "application/x-ndjson");
            return reply.send(upstream.body);
        } catch (error) {
            reply.code(502);
            return { error: error instanceof Error ? error.message : "Upstream chat failed" };
        }
    });
}
