import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

type OllamaModel = {
    name: string;
    size: number;
    modified_at: string;
};

type OllamaTagsResponse = {
    models: OllamaModel[];
};

export async function modelsRoutes(app: FastifyInstance) {
    app.get("/api/models", async (_request, reply) => {
        try {
            // Fetch la liste des modèles depuis Ollama avec un timeout de 2 secondes
            const response = await fetch(`${config.ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(2000) });

            if (!response.ok) {
                reply.code(502);
                return { error: `Ollama returned ${response.status}` };
            }

            // Parse la réponse et formate les données pour le front
            const tags = (await response.json()) as OllamaTagsResponse;
            // On retourne que le nom et la taille de chaque modèle
            const models = tags.models.map((m) => ({ name: m.name, size: m.size }));
            return { models };
        } catch (error) {
            reply.code(500);
            return { error: error instanceof Error ? error.message : 'Failed to fetch models' };
        }
    })
}
