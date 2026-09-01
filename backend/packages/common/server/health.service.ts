import mongoDatabase from "../config/mongo.database.js";
import redis from "../config/redis.js";

export interface HealthComponent {
    status: "up" | "down";
    latencyMs?: number;
    error?: string;
}

export interface HealthResponse {
    status: "ok" | "degraded";
    timestamp: string;
    uptime: number;
    node: HealthComponent;
    mongodb: HealthComponent;
    redis: HealthComponent;
    llm: HealthComponent;
}

class HealthService {

    async check(
        llmHealthCheck: () => Promise<boolean>
    ): Promise<HealthResponse> {

        const [
            mongodb,
            redisHealth,
            llm,
        ] = await Promise.all([
            this.checkMongoDB(),
            this.checkRedis(),
            this.checkLLM(
                llmHealthCheck
            ),
        ]);

        const node: HealthComponent = {
            status: "up",
        };

        const allHealthy =
            mongodb.status === "up" &&
            redisHealth.status === "up" &&
            llm.status === "up";

        return {
            status:
                allHealthy
                    ? "ok"
                    : "degraded",

            timestamp:
                new Date().toISOString(),

            uptime:
                process.uptime(),

            node,

            mongodb,

            redis: redisHealth,

            llm,
        };
    }

    private async checkMongoDB(): Promise<HealthComponent> {
        const start =
            Date.now();

        try {
            const healthy =
                mongoDatabase.isHealthy();

            if (!healthy) {
                return {
                    status: "down",
                    latencyMs:
                        Date.now() - start,
                };
            }

            return {
                status: "up",
                latencyMs:
                    Date.now() - start,
            };
        } catch (error) {
            return {
                status: "down",
                latencyMs:
                    Date.now() - start,
                error:
                    error instanceof Error
                        ? error.message
                        : "MongoDB health check failed",
            };
        }
    }

    private async checkRedis(): Promise<HealthComponent> {
        const start =
            Date.now();

        try {
            await redis.ping();

            return {
                status: "up",
                latencyMs:
                    Date.now() - start,
            };
        } catch (error) {
            return {
                status: "down",
                latencyMs:
                    Date.now() - start,
                error:
                    error instanceof Error
                        ? error.message
                        : "Redis health check failed",
            };
        }
    }

    private async checkLLM(
        healthCheck: () => Promise<boolean>
    ): Promise<HealthComponent> {

        const start =
            Date.now();

        try {
            const healthy =
                await healthCheck();

            return {
                status:
                    healthy
                        ? "up"
                        : "down",

                latencyMs:
                    Date.now() - start,
            };
        } catch (error) {
            return {
                status: "down",
                latencyMs:
                    Date.now() - start,
                error:
                    error instanceof Error
                        ? error.message
                        : "LLM health check failed",
            };
        }
    }
}

const healthService =
    new HealthService();

export default healthService;