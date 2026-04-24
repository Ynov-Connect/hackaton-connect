import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/api/health", async () => {
        // Retenir l'heure de départ
        const startTime = Date.now();

        // Faire un fetch sur `${config.ollamaUrl}/api/tags``
        // -> Ollama réponds avec la liste des modèles quand il est up
        // -> on ajout un AbortSignal.timeout(2000) pour pas bloquer si down
        try {
            const response = await fetch(`${config.ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(2000) });
            if (!response.ok) {
                // Ollama a répondu mais avec un status HTTP d'erreur -> on traite comme un "down"
                throw new Error(`Ollama returned ${response.status}`);
            }
        } catch (error) {
            // Si fetch échoue (timeout ou autre erreur) -> on répond avec un status "error", le message d'erreur et le temps de réponse
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Ollama is down',
                latencyMs: Date.now() - startTime
            }
        }

        // Si fetch OK -> on répond avec un status "ok" et le temps de réponse
        return {
            status: 'ok',
            latencyMs: Date.now() - startTime
        }
    })
}